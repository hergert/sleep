import { URL } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { loadAuthConfig } from './config.js';
import {
  OAuthError,
  generateAuthorizationCode,
  redeemAuthorizationCode,
  createTokenResponse,
  refreshAccessToken,
  verifyAccessToken,
  buildJwks,
  validateScopes,
  ensureClientSecret,
  computeSubject,
} from './tokens.js';
import { getClient, registerClient } from './store.js';
import { randomToken } from './utils.js';

function parseBody(req: IncomingMessage): Promise<URLSearchParams> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req
      .on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
      .on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(new URLSearchParams(raw));
      })
      .on('error', (error) => reject(error));
  });
}

function readBasicAuth(header: string | undefined): { clientId: string; clientSecret: string } | undefined {
  if (!header) {
    return undefined;
  }
  const [scheme, value] = header.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'basic' || !value) {
    return undefined;
  }
  const decoded = Buffer.from(value, 'base64').toString('utf8');
  const idx = decoded.indexOf(':');
  if (idx === -1) {
    return undefined;
  }
  return { clientId: decoded.slice(0, idx), clientSecret: decoded.slice(idx + 1) };
}

function sendOAuthError(res: ServerResponse, error: OAuthError) {
  res.writeHead(error.status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: error.error, error_description: error.description }));
}

function sendJson(res: ServerResponse, body: Record<string, unknown>, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function initialiseAuth(config: ReturnType<typeof loadAuthConfig>) {
  for (const client of config.clients) {
    registerClient(client);
  }
}

async function handleAuthorize(
  config: ReturnType<typeof loadAuthConfig>,
  req: IncomingMessage,
  res: ServerResponse,
  url: URL
) {
  const method = req.method ?? 'GET';
  const params =
    method === 'GET' ? url.searchParams : method === 'POST' ? await parseBody(req) : undefined;
  if (!params) {
    res.writeHead(405).end();
    return;
  }

  const responseType = params.get('response_type');
  if (responseType !== 'code') {
    throw new OAuthError(400, 'unsupported_response_type', 'Only authorization_code supported');
  }

  const clientId = params.get('client_id') ?? '';
  const redirectUri = params.get('redirect_uri') ?? '';
  const state = params.get('state') ?? '';
  const scopeParam = params.get('scope') ?? '';
  const codeChallenge = params.get('code_challenge') ?? '';
  const codeChallengeMethod = (params.get('code_challenge_method') ?? 'plain') as 'plain' | 'S256';

  const client = getClient(clientId);
  if (!client) {
    throw new OAuthError(400, 'unauthorized_client', 'Unknown client');
  }
  if (!client.redirectUris.includes(redirectUri)) {
    throw new OAuthError(400, 'invalid_request', 'Redirect URI not allowed');
  }
  if (!codeChallenge) {
    throw new OAuthError(400, 'invalid_request', 'code_challenge required');
  }
  if (codeChallengeMethod !== 'plain' && codeChallengeMethod !== 'S256') {
    throw new OAuthError(400, 'invalid_request', 'Unsupported code_challenge_method');
  }

  const scopes = validateScopes(scopeParam.split(' ').filter(Boolean), client.scopes);
  const subject = computeSubject();
  const code = generateAuthorizationCode(config, {
    clientId,
    redirectUri,
    scopes,
    subject,
    codeChallenge,
    codeChallengeMethod,
  });

  const redirect = new URL(redirectUri);
  redirect.searchParams.set('code', code);
  if (state) {
    redirect.searchParams.set('state', state);
  }
  res.writeHead(302, { Location: redirect.toString() });
  res.end();
}

async function handleToken(
  config: ReturnType<typeof loadAuthConfig>,
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method !== 'POST') {
    res.writeHead(405).end();
    return;
  }
  const params = await parseBody(req);
  const grantType = params.get('grant_type');
  const basic = readBasicAuth(req.headers.authorization);

  if (grantType === 'authorization_code') {
    const clientId = params.get('client_id') ?? basic?.clientId ?? '';
    const redirectUri = params.get('redirect_uri') ?? '';
    const code = params.get('code') ?? '';
    const codeVerifier = params.get('code_verifier') ?? '';
    const client = getClient(clientId);
    if (!client) {
      throw new OAuthError(401, 'invalid_client', 'Unknown client');
    }
    if (!client.isPublic) {
      const secret = params.get('client_secret') ?? basic?.clientSecret;
      ensureClientSecret(clientId, secret);
    }
    const record = redeemAuthorizationCode(config, code, clientId, redirectUri, codeVerifier);
    const response = createTokenResponse(config, record.subject, clientId, record.scopes, true);
    sendJson(res, response);
    return;
  }

  if (grantType === 'refresh_token') {
    const clientId = params.get('client_id') ?? basic?.clientId ?? '';
    const client = getClient(clientId);
    if (!client) {
      throw new OAuthError(401, 'invalid_client', 'Unknown client');
    }
    const secret = params.get('client_secret') ?? basic?.clientSecret;
    if (!client.isPublic) {
      ensureClientSecret(clientId, secret);
    }
    const refreshToken = params.get('refresh_token');
    if (!refreshToken) {
      throw new OAuthError(400, 'invalid_request', 'refresh_token missing');
    }
    const response = refreshAccessToken(config, refreshToken, clientId);
    sendJson(res, response);
    return;
  }

  if (grantType === 'client_credentials') {
    const clientId = params.get('client_id') ?? basic?.clientId ?? '';
    const secret = params.get('client_secret') ?? basic?.clientSecret;
    ensureClientSecret(clientId, secret);
    const client = getClient(clientId)!;
    const scopeParam = params.get('scope') ?? client.scopes.join(' ');
    const scopes = validateScopes(scopeParam.split(' ').filter(Boolean), client.scopes);
    const subject = params.get('subject') ?? computeSubject();
    const response = createTokenResponse(config, subject, clientId, scopes, false);
    sendJson(res, response);
    return;
  }

  throw new OAuthError(400, 'unsupported_grant_type', 'Grant not supported');
}

function handleDiscovery(config: ReturnType<typeof loadAuthConfig>, res: ServerResponse) {
  const metadata = {
    issuer: config.issuer,
    authorization_endpoint: `${config.issuer}/authorize`,
    token_endpoint: `${config.issuer}/token`,
    jwks_uri: `${config.issuer}/jwks.json`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token', 'client_credentials'],
    code_challenge_methods_supported: ['plain', 'S256'],
  };
  sendJson(res, metadata);
}

function handleJwks(config: ReturnType<typeof loadAuthConfig>, res: ServerResponse) {
  sendJson(res, buildJwks(config));
}

async function handleClientRegistration(
  config: ReturnType<typeof loadAuthConfig>,
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method !== 'POST') {
    res.writeHead(405).end();
    return;
  }
  const params = await parseBody(req);
  const clientName = params.get('client_name');
  const redirectUris = params.getAll('redirect_uris');
  const scopes = params.get('scope')?.split(' ').filter(Boolean) ?? [];
  if (!clientName || redirectUris.length === 0 || scopes.length === 0) {
    throw new OAuthError(400, 'invalid_request', 'client_name, redirect_uris, scope required');
  }
  const clientId = randomToken(24);
  const clientSecret = randomToken(48);
  const newClient = {
    clientId,
    clientSecret,
    redirectUris,
    scopes,
    isPublic: false,
  };
  registerClient(newClient);
  sendJson(
    res,
    {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: redirectUris,
      scope: scopes.join(' '),
    },
    201
  );
}

export async function handleAuthRequest(
  config: ReturnType<typeof loadAuthConfig>,
  req: IncomingMessage,
  res: ServerResponse,
  url: URL
): Promise<boolean> {
  try {
    switch (url.pathname) {
      case '/authorize':
        await handleAuthorize(config, req, res, url);
        return true;
      case '/token':
        await handleToken(config, req, res);
        return true;
      case '/jwks.json':
        handleJwks(config, res);
        return true;
      case '/.well-known/oauth-authorization-server':
        handleDiscovery(config, res);
        return true;
      case '/register':
        await handleClientRegistration(config, req, res);
        return true;
      default:
        return false;
    }
  } catch (error) {
    if (error instanceof OAuthError) {
      sendOAuthError(res, error);
      return true;
    }
    res.writeHead(500, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        error: 'server_error',
        error_description: (error as Error).message,
      })
    );
    return true;
  }
}

export function buildCorsHeaders(
  config: ReturnType<typeof loadAuthConfig>,
  originHeader: string | undefined
): Record<string, string> {
  if (!originHeader) {
    return {};
  }
  if (config.allowedOrigins.length > 0 && !config.allowedOrigins.includes(originHeader)) {
    throw new OAuthError(403, 'access_denied', 'Origin not allowed');
  }
  return {
    'Access-Control-Allow-Origin': originHeader,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
    'Access-Control-Expose-Headers': 'Mcp-Session-Id',
    Vary: 'Origin',
  };
}

export { verifyAccessToken, OAuthError };
