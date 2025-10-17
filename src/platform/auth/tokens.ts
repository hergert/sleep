import crypto from 'node:crypto';
import { loadAuthConfig } from './config.js';
import { base64UrlEncode, base64UrlDecode, randomToken } from './utils.js';
import {
  consumeAuthorizationCode,
  consumeRefreshToken,
  hashToken,
  storeAuthorizationCode,
  storeRefreshToken,
  rotateRefreshToken,
  getClient,
  purgeExpiredAuthorizationCodes,
} from './store.js';

const ACCESS_TOKEN_TYPE = 'Bearer';

interface AuthorizationCodePayload {
  code: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
  subject: string;
  codeChallenge: string;
  codeChallengeMethod: 'plain' | 'S256';
  expiresAt: number;
}

interface TokenResult {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken?: string;
  refreshTokenExpiresAt?: number;
  scopes: string[];
  subject: string;
  clientId: string;
}

export interface VerifiedAccessToken {
  token: string;
  clientId: string;
  subject: string;
  scopes: string[];
  expiresAt: number;
}

export class OAuthError extends Error {
  public status: number;
  public error: string;
  public description?: string;

  constructor(status: number, error: string, description?: string) {
    super(description ?? error);
    this.status = status;
    this.error = error;
    this.description = description;
  }
}

function computeCodeChallenge(value: string, method: 'plain' | 'S256'): string {
  if (method === 'plain') {
    return value;
  }
  const digest = crypto.createHash('sha256').update(value).digest();
  return base64UrlEncode(digest);
}

function signJwt(
  config: ReturnType<typeof loadAuthConfig>,
  payload: Record<string, unknown>
): string {
  const header = { alg: 'HS256', typ: 'JWT', kid: config.jwtKid };
  const encodedHeader = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const signature = crypto
    .createHmac('sha256', config.jwtSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/u, '');
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function decodeJwt(token: string): { header: any; payload: any; signature: string } {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new OAuthError(401, 'invalid_token', 'Token structure invalid');
  }
  const [encodedHeader, encodedPayload, signature] = parts;
  try {
    const header = JSON.parse(base64UrlDecode(encodedHeader).toString('utf8'));
    const payload = JSON.parse(base64UrlDecode(encodedPayload).toString('utf8'));
    return { header, payload, signature };
  } catch {
    throw new OAuthError(401, 'invalid_token', 'Token payload invalid');
  }
}

export async function generateAuthorizationCode(
  config: ReturnType<typeof loadAuthConfig>,
  payload: Omit<AuthorizationCodePayload, 'code' | 'expiresAt'>
): Promise<string> {
  purgeExpiredAuthorizationCodes(Date.now());
  const code = randomToken(32);
  const expiresAt = Date.now() + 5 * 60 * 1000;
  await storeAuthorizationCode({
    code,
    expiresAt,
    ...payload,
  });
  return code;
}

export async function redeemAuthorizationCode(
  config: ReturnType<typeof loadAuthConfig>,
  code: string,
  clientId: string,
  redirectUri: string,
  codeVerifier: string
): Promise<AuthorizationCodePayload> {
  const record = await consumeAuthorizationCode(code);
  if (!record) {
    throw new OAuthError(400, 'invalid_grant', 'Authorization code invalid or expired');
  }
  const now = Date.now();
  if (record.expiresAt < now) {
    throw new OAuthError(400, 'invalid_grant', 'Authorization code expired');
  }
  if (record.clientId !== clientId) {
    throw new OAuthError(400, 'invalid_grant', 'Client mismatch');
  }
  if (record.redirectUri !== redirectUri) {
    throw new OAuthError(400, 'invalid_grant', 'Redirect URI mismatch');
  }
  const computed = computeCodeChallenge(codeVerifier, record.codeChallengeMethod);
  if (computed !== record.codeChallenge) {
    throw new OAuthError(400, 'invalid_grant', 'PKCE verification failed');
  }
  return record;
}

async function issueTokens(
  config: ReturnType<typeof loadAuthConfig>,
  subject: string,
  clientId: string,
  scopes: string[],
  issueRefreshToken: boolean
): Promise<TokenResult> {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const expiresAt = nowSeconds + config.accessTokenTtlSeconds;
  const payload = {
    iss: config.issuer,
    aud: config.audience,
    sub: subject,
    client_id: clientId,
    scope: scopes.join(' '),
    exp: expiresAt,
    iat: nowSeconds,
  };
  const accessToken = signJwt(config, payload);

  if (!issueRefreshToken) {
    return {
      accessToken,
      accessTokenExpiresAt: expiresAt,
      scopes,
      subject,
      clientId,
    };
  }

  const refreshToken = randomToken(48);
  const hashed = hashToken(refreshToken);
  const refreshExpiresAt = nowSeconds + config.refreshTokenTtlSeconds;
  await storeRefreshToken({
    hashedToken: hashed,
    clientId,
    subject,
    scopes,
    expiresAt: refreshExpiresAt,
  });

  return {
    accessToken,
    accessTokenExpiresAt: expiresAt,
    refreshToken,
    refreshTokenExpiresAt: refreshExpiresAt,
    scopes,
    subject,
    clientId,
  };
}

export async function createTokenResponse(
  config: ReturnType<typeof loadAuthConfig>,
  subject: string,
  clientId: string,
  scopes: string[],
  issueRefreshToken: boolean
): Promise<Record<string, unknown>> {
  const result = await issueTokens(config, subject, clientId, scopes, issueRefreshToken);
  const response: Record<string, unknown> = {
    token_type: ACCESS_TOKEN_TYPE,
    access_token: result.accessToken,
    expires_in: config.accessTokenTtlSeconds,
    scope: scopes.join(' '),
  };
  if (result.refreshToken) {
    response.refresh_token = result.refreshToken;
  }
  return response;
}

export async function refreshAccessToken(
  config: ReturnType<typeof loadAuthConfig>,
  token: string,
  clientId: string
): Promise<{ response: Record<string, unknown>; subject: string; scopes: string[] }> {
  const hashed = hashToken(token);
  const existing = await consumeRefreshToken(hashed);
  if (!existing) {
    throw new OAuthError(400, 'invalid_grant', 'Refresh token invalid');
  }
  if (existing.clientId !== clientId) {
    throw new OAuthError(400, 'invalid_grant', 'Client mismatch');
  }
  const result = await issueTokens(config, existing.subject, clientId, existing.scopes, true);
  await rotateRefreshToken(hashed, {
    hashedToken: hashToken(result.refreshToken as string),
    clientId,
    subject: existing.subject,
    scopes: existing.scopes,
    expiresAt: result.refreshTokenExpiresAt!,
  });
  return {
    response: {
      token_type: ACCESS_TOKEN_TYPE,
      access_token: result.accessToken,
      expires_in: config.accessTokenTtlSeconds,
      refresh_token: result.refreshToken,
      scope: existing.scopes.join(' '),
    },
    subject: existing.subject,
    scopes: existing.scopes,
  };
}

export function verifyAccessToken(
  config: ReturnType<typeof loadAuthConfig>,
  token: string
): VerifiedAccessToken {
  const { header, payload, signature } = decodeJwt(token);
  if (header.alg !== 'HS256' || header.kid !== config.jwtKid) {
    throw new OAuthError(401, 'invalid_token', 'Unsupported token header');
  }

  const reSigned = crypto
    .createHmac('sha256', config.jwtSecret)
    .update(token.slice(0, token.lastIndexOf('.')))
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/u, '');
  if (reSigned !== signature) {
    throw new OAuthError(401, 'invalid_token', 'Signature mismatch');
  }

  if (payload.iss !== config.issuer) {
    throw new OAuthError(401, 'invalid_token', 'Issuer mismatch');
  }
  if (payload.aud !== config.audience) {
    throw new OAuthError(401, 'invalid_token', 'Audience mismatch');
  }
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp + config.clockSkewSeconds < now) {
    throw new OAuthError(401, 'invalid_token', 'Token expired');
  }
  if (typeof payload.sub !== 'string') {
    throw new OAuthError(401, 'invalid_token', 'Subject missing');
  }
  const scopes = typeof payload.scope === 'string' ? payload.scope.split(' ').filter(Boolean) : [];
  const clientId: string | undefined = payload.client_id;
  if (!clientId) {
    throw new OAuthError(401, 'invalid_token', 'client_id missing');
  }
  return {
    token,
    clientId,
    subject: payload.sub,
    scopes,
    expiresAt: payload.exp,
  };
}

export function buildJwks(config: ReturnType<typeof loadAuthConfig>) {
  return {
    keys: [
      {
        kty: 'oct',
        use: 'sig',
        alg: 'HS256',
        kid: config.jwtKid,
        k: base64UrlEncode(config.jwtSecret),
      },
    ],
  };
}

export function validateScopes(requested: string[], allowed: string[]): string[] {
  // If no scopes requested, grant all allowed scopes
  if (requested.length === 0) {
    return allowed;
  }
  for (const scope of requested) {
    if (!allowed.includes(scope)) {
      throw new OAuthError(400, 'invalid_scope', `Scope ${scope} not allowed`);
    }
  }
  return requested;
}

export async function ensureClientSecret(clientId: string, providedSecret: string | undefined) {
  const client = await getClient(clientId);
  if (!client) {
    throw new OAuthError(401, 'invalid_client', 'Unknown client');
  }
  if (client.isPublic) {
    return;
  }
  if (!providedSecret || client.clientSecret !== providedSecret) {
    throw new OAuthError(401, 'invalid_client', 'Client authentication failed');
  }
}

// Removed: computeSubject() - no longer needed with OAuth user authentication
