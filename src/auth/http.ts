import { URL } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { loadAuthConfig } from './config.js';
import type { OAuthClient } from './config.js';
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
} from './tokens.js';
import { getClient, registerClient } from './store.js';
import { randomToken } from './utils.js';
import type { AuthenticationProvider, CredentialPayload } from './provider.js';
import {
  initialiseCredentialStorage,
  storePendingCredential,
  consumePendingCredential,
  persistCredentials,
  getPersistedCredentials,
} from './credentialStorage.js';

const CSRF_TTL_MS = 10 * 60 * 1000;
const csrfTokens = new Map<string, number>();

// Template path - will be resolved at runtime if needed
let DEFAULT_TEMPLATE_PATH: string | undefined;
let fsReadFileSync: typeof import('node:fs').readFileSync | undefined;

// Lazy load Node.js modules (only available in Node.js environment, not Workers)
try {
  const urlModule = await import('node:url');
  const pathModule = await import('node:path');
  const fsModule = await import('node:fs');

  const MODULE_DIR = pathModule.dirname(urlModule.fileURLToPath(import.meta.url));
  DEFAULT_TEMPLATE_PATH = pathModule.resolve(MODULE_DIR, '../templates/auth.html');
  fsReadFileSync = fsModule.readFileSync;
} catch {
  // Running in Workers environment - no file system access
}
const DEFAULT_LOGIN_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{{PROVIDER_NAME}} Account Sign-In</title>
    <style>
      body { font-family: system-ui, sans-serif; background: #f5f5f5; margin: 0; padding: 40px; }
      main { max-width: 420px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 12px; box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
      h1 { margin-top: 0; font-size: 1.5rem; }
      label { display: block; margin-bottom: 12px; }
      input[type="email"], input[type="password"] { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #d0d0d0; font-size: 1rem; }
      .actions { display: flex; gap: 12px; margin-top: 24px; }
      button { flex: 1; padding: 12px; font-size: 1rem; border: none; border-radius: 6px; cursor: pointer; }
      button[type="submit"] { background: #2d5cf6; color: #fff; }
      button.secondary { background: #e0e0e0; color: #333; }
      .scopes { margin: 16px 0; padding-left: 20px; }
      .scopes.none { list-style: none; padding-left: 0; color: #555; }
      .error { color: #c00; background: #ffe5e5; padding: 8px 12px; border-radius: 6px; }
      .consent { font-size: 0.9rem; color: #555; margin-bottom: 16px; }
    </style>
  </head>
  <body>
    <main>
      <h1>Sign in to {{PROVIDER_NAME}}</h1>
      <p class="consent">Client <strong>{{CLIENT_ID}}</strong> is requesting access with the following scopes:</p>
      {{SCOPES_LIST}}
      {{ERROR_BLOCK}}
      <form method="post" action="/authorize">
        <input type="hidden" name="response_type" value="code" />
        <input type="hidden" name="client_id" value="{{CLIENT_ID}}" />
        <input type="hidden" name="redirect_uri" value="{{REDIRECT_URI}}" />
        <input type="hidden" name="state" value="{{STATE}}" />
        <input type="hidden" name="scope" value="{{SCOPE_PARAM}}" />
        <input type="hidden" name="code_challenge" value="{{CODE_CHALLENGE}}" />
        <input type="hidden" name="code_challenge_method" value="{{CODE_CHALLENGE_METHOD}}" />
        <input type="hidden" name="csrf_token" value="{{CSRF_TOKEN}}" />
        <label>
          Email
          <input type="email" name="email" autocomplete="email" value="{{EMAIL_VALUE}}" required />
        </label>
        <label>
          Password
          <input type="password" name="password" autocomplete="current-password" required />
        </label>
        <div class="actions">
          <button type="submit" name="action" value="approve">Continue</button>
          <button type="submit" name="action" value="cancel" class="secondary">Cancel</button>
        </div>
      </form>
    </main>
  </body>
</html>`;
let loginTemplate = DEFAULT_LOGIN_TEMPLATE;
const PLACEHOLDER_PATTERN = /{{\s*([A-Z0-9_]+)\s*}}/g;

function purgeExpiredCsrfTokens() {
  const now = Date.now();
  for (const [token, expiresAt] of csrfTokens.entries()) {
    if (expiresAt <= now) {
      csrfTokens.delete(token);
    }
  }
}

function issueCsrfToken(): string {
  purgeExpiredCsrfTokens();
  const token = randomToken(24);
  csrfTokens.set(token, Date.now() + CSRF_TTL_MS);
  return token;
}

function validateCsrfToken(token: string | null): boolean {
  if (!token) {
    return false;
  }
  purgeExpiredCsrfTokens();
  const expiresAt = csrfTokens.get(token);
  if (!expiresAt) {
    return false;
  }
  csrfTokens.delete(token);
  return expiresAt > Date.now();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function applyTemplate(template: string, replacements: Record<string, string>): string {
  return template.replace(PLACEHOLDER_PATTERN, (_match, key: string) => replacements[key] ?? '');
}

function loadLoginTemplate(_config: ReturnType<typeof loadAuthConfig>) {
  // In Workers environment, file system is not available - use default template
  if (!fsReadFileSync || !DEFAULT_TEMPLATE_PATH) {
    loginTemplate = DEFAULT_LOGIN_TEMPLATE;
    return;
  }

  // In Node.js environment, try to load custom template if specified
  let loaded: string | undefined;
  try {
    loaded = fsReadFileSync(DEFAULT_TEMPLATE_PATH, 'utf8');
  } catch (_error) {
    // Template file not found, use default
  }
  loginTemplate = loaded ?? DEFAULT_LOGIN_TEMPLATE;
}

interface AuthorizeContext {
  clientId: string;
  redirectUri: string;
  state: string;
  scopeParam: string;
  scopes: string[];
  codeChallenge: string;
  codeChallengeMethod: 'plain' | 'S256';
  client: OAuthClient;
}

async function parseAuthorizeRequest(
  params: URLSearchParams
): Promise<AuthorizeContext> {
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

  const client = await getClient(clientId);
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

  return {
    clientId,
    redirectUri,
    state,
    scopeParam,
    scopes,
    codeChallenge,
    codeChallengeMethod,
    client,
  };
}

function renderLoginForm(
  res: ServerResponse,
  authorizeContext: AuthorizeContext,
  options: { csrfToken: string; error?: string; email?: string }
) {
  const { clientId, scopeParam, scopes, redirectUri, state, codeChallenge, codeChallengeMethod } =
    authorizeContext;
  const errorBlock = options.error
    ? `<p class="error">${escapeHtml(options.error)}</p>`
    : '';
  const scopeList =
    scopes.length > 0
      ? `<ul class="scopes">${scopes.map((scope) => `<li>${escapeHtml(scope)}</li>`).join('')}</ul>`
      : '<p class="scopes none">No scopes requested</p>';

  const html = applyTemplate(loginTemplate, {
    PROVIDER_NAME: escapeHtml(authProvider?.displayName ?? 'your account'),
    CLIENT_ID: escapeHtml(clientId),
    REDIRECT_URI: escapeHtml(redirectUri),
    STATE: escapeHtml(state),
    SCOPE_PARAM: escapeHtml(scopeParam),
    CODE_CHALLENGE: escapeHtml(codeChallenge),
    CODE_CHALLENGE_METHOD: escapeHtml(codeChallengeMethod),
    CSRF_TOKEN: escapeHtml(options.csrfToken),
    EMAIL_VALUE: escapeHtml(options.email ?? ''),
    ERROR_BLOCK: errorBlock,
    SCOPES_LIST: scopeList,
  });

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

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

let authProvider: AuthenticationProvider | undefined;

export async function initialiseAuth(
  config: ReturnType<typeof loadAuthConfig>,
  options: { provider: AuthenticationProvider }
) {
  authProvider = options.provider;
  for (const client of config.clients) {
    await registerClient(client);
  }
  initialiseCredentialStorage(config);
  loadLoginTemplate(config);
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

  const authorizeContext = await parseAuthorizeRequest(params);

  if (method === 'GET') {
    const csrfToken = issueCsrfToken();
    renderLoginForm(res, authorizeContext, {
      csrfToken,
      email: params.get('email') ?? undefined,
    });
    return;
  }

  const csrfToken = params.get('csrf_token');
  if (!validateCsrfToken(csrfToken)) {
    renderLoginForm(res, authorizeContext, {
      csrfToken: issueCsrfToken(),
      error: 'Your session expired. Please try signing in again.',
      email: params.get('email') ?? undefined,
    });
    return;
  }

  const action = params.get('action') ?? 'approve';
  if (action === 'cancel') {
    const redirect = new URL(authorizeContext.redirectUri);
    redirect.searchParams.set('error', 'access_denied');
    if (authorizeContext.state) {
      redirect.searchParams.set('state', authorizeContext.state);
    }
    res.writeHead(302, { Location: redirect.toString() });
    res.end();
    return;
  }

  const email = (params.get('email') ?? '').trim();
  const password = params.get('password') ?? '';
  if (!email || !password) {
    renderLoginForm(res, authorizeContext, {
      csrfToken: issueCsrfToken(),
      error: 'Email and password are required.',
      email,
    });
    return;
  }

  try {
    if (!authProvider) {
      throw new Error('Authentication provider not initialized');
    }

    const { credentials } = await authProvider.authenticate(email, password);

    const subject = credentials.userId && credentials.userId.length > 0
      ? credentials.userId
      : randomToken(16);

    const code = await generateAuthorizationCode(config, {
      clientId: authorizeContext.clientId,
      redirectUri: authorizeContext.redirectUri,
      scopes: authorizeContext.scopes,
      subject,
      codeChallenge: authorizeContext.codeChallenge,
      codeChallengeMethod: authorizeContext.codeChallengeMethod,
    });

    await storePendingCredential(code, authProvider.id, credentials);

    const redirect = new URL(authorizeContext.redirectUri);
    redirect.searchParams.set('code', code);
    if (authorizeContext.state) {
      redirect.searchParams.set('state', authorizeContext.state);
    }
    res.writeHead(302, { Location: redirect.toString() });
    res.end();
  } catch (error) {
    const message =
      error instanceof Error && /Authentication failed/i.test(error.message)
        ? 'Invalid email or password. Please try again.'
        : (error as Error).message || `Unable to authenticate with ${authProvider?.displayName ?? 'the selected provider'}.`;
    renderLoginForm(res, authorizeContext, {
      csrfToken: issueCsrfToken(),
      error: message,
      email,
    });
  }
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
    const client = await getClient(clientId);
    if (!client) {
      throw new OAuthError(401, 'invalid_client', 'Unknown client');
    }
    if (!client.isPublic) {
      const secret = params.get('client_secret') ?? basic?.clientSecret;
      await ensureClientSecret(clientId, secret);
    }
    if (!authProvider) {
      throw new OAuthError(500, 'server_error', 'Authentication provider not initialized');
    }
    const record = await redeemAuthorizationCode(config, code, clientId, redirectUri, codeVerifier);
    const pending = await consumePendingCredential(code);
    if (!pending) {
      throw new OAuthError(400, 'invalid_grant', 'Provider credentials missing or expired');
    }
    if (pending.providerId !== authProvider.id) {
      throw new OAuthError(400, 'invalid_grant', 'Provider mismatch during credential exchange');
    }
    const subjectMatches = pending.credentials.userId
      ? pending.credentials.userId === record.subject
      : true;
    if (!subjectMatches) {
      throw new OAuthError(400, 'invalid_grant', 'Subject mismatch during credential exchange');
    }
    await persistCredentials(record.subject, clientId, pending.providerId, pending.credentials);
    const response = await createTokenResponse(config, record.subject, clientId, record.scopes, true);
    sendJson(res, response);
    return;
  }

  if (grantType === 'refresh_token') {
    const clientId = params.get('client_id') ?? basic?.clientId ?? '';
    const client = await getClient(clientId);
    if (!client) {
      throw new OAuthError(401, 'invalid_client', 'Unknown client');
    }
    const secret = params.get('client_secret') ?? basic?.clientSecret;
    if (!client.isPublic) {
      await ensureClientSecret(clientId, secret);
    }
    const refreshToken = params.get('refresh_token');
    if (!refreshToken) {
      throw new OAuthError(400, 'invalid_request', 'refresh_token missing');
    }
    if (!authProvider) {
      throw new OAuthError(500, 'server_error', 'Authentication provider not initialized');
    }
    const result = await refreshAccessToken(config, refreshToken, clientId);
    const stored = await getPersistedCredentials(result.subject, clientId);
    if (!stored || stored.providerId !== authProvider.id) {
      throw new OAuthError(400, 'invalid_grant', 'Provider credentials missing for subject');
    }
    if (authProvider.refreshCredentials) {
      const updated = await authProvider.refreshCredentials(stored.credentials);
      if (updated) {
        await persistCredentials(result.subject, clientId, authProvider.id, updated);
      }
    }
    sendJson(res, result.response);
    return;
  }

  if (grantType === 'client_credentials') {
    const clientId = params.get('client_id') ?? basic?.clientId ?? '';
    const secret = params.get('client_secret') ?? basic?.clientSecret;
    await ensureClientSecret(clientId, secret);
    const client = (await getClient(clientId))!;
    const scopeParam = params.get('scope') ?? client.scopes.join(' ');
    const scopes = validateScopes(scopeParam.split(' ').filter(Boolean), client.scopes);
    const subject = params.get('subject');
    if (!subject) {
      throw new OAuthError(400, 'invalid_request', 'subject parameter required for client_credentials grant');
    }
    const response = await createTokenResponse(config, subject, clientId, scopes, false);
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
    registration_endpoint: `${config.issuer}/register`,
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

  // Parse JSON body for dynamic client registration (OAuth 2.0 RFC 7591)
  const contentType = req.headers['content-type'] || '';
  let clientName: string | undefined;
  let redirectUris: string[] = [];
  let scopes: string[] = [];

  if (contentType.includes('application/json')) {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyStr = Buffer.concat(chunks).toString('utf8');
    const body = JSON.parse(bodyStr);
    clientName = body.client_name;
    redirectUris = Array.isArray(body.redirect_uris) ? body.redirect_uris : [];
    scopes = typeof body.scope === 'string' ? body.scope.split(' ').filter(Boolean) : [];
  } else {
    const params = await parseBody(req);
    clientName = params.get('client_name') || undefined;
    redirectUris = params.getAll('redirect_uris');
    scopes = params.get('scope')?.split(' ').filter(Boolean) ?? [];
  }

  if (!clientName || redirectUris.length === 0) {
    throw new OAuthError(400, 'invalid_request', 'client_name and redirect_uris required');
  }

  const allowedScopes = scopes.length > 0 ? scopes : [];

  const clientId = randomToken(24);
  const clientSecret = randomToken(48);
  const newClient = {
    clientId,
    clientSecret,
    redirectUris,
    scopes: allowedScopes,
    isPublic: false,
  };
  await registerClient(newClient);
  sendJson(
    res,
    {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: redirectUris,
      scope: allowedScopes.join(' '),
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
  _config: ReturnType<typeof loadAuthConfig>,
  originHeader: string | undefined
): Record<string, string> {
  if (!originHeader) {
    return {};
  }
  // Allow all origins - OAuth provides authentication security
  // MCP clients can connect from any origin (Claude.ai, localhost, etc.)
  return {
    'Access-Control-Allow-Origin': originHeader,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id, mcp-protocol-version',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
    'Access-Control-Expose-Headers': 'Mcp-Session-Id',
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
  };
}

/**
 * Get provider credentials for a user
 * Used by MCP server to retrieve provider-specific credentials
 */
export async function getProviderCredentials(
  subject: string,
  clientId: string
): Promise<CredentialPayload | undefined> {
  if (!authProvider) {
    return undefined;
  }
  const record = await getPersistedCredentials(subject, clientId);
  if (!record || record.providerId !== authProvider.id) {
    return undefined;
  }
  return record.credentials;
}

/**
 * Get the current authentication provider
 */
export function getAuthProvider(): AuthenticationProvider | undefined {
  return authProvider;
}

export { verifyAccessToken, OAuthError };
