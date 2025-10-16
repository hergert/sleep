import crypto from 'node:crypto';

export interface OAuthClient {
  clientId: string;
  clientSecret?: string;
  redirectUris: string[];
  scopes: string[];
  isPublic: boolean;
}

export interface AuthConfig {
  issuer: string;
  audience: string;
  jwtSecret: Buffer;
  jwtKid: string;
  encryptionKey: Buffer;
  sessionSecret: Buffer;
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
  clients: OAuthClient[];
  clockSkewSeconds: number;
  allowedOrigins: string[];
  allowedHosts: string[];
  dnsRebindingProtection: boolean;
  formTemplatePath?: string;
}

function parseClients(defaultScopes: string[]): OAuthClient[] {
  const raw = process.env.AUTH_CLIENTS_JSON;
  if (!raw) {
    // Default development client - scopes come from provider
    return [
      {
        clientId: 'sleep-cli',
        clientSecret: 'dev-secret',
        redirectUris: ['http://localhost:8765/callback'],
        scopes: defaultScopes,
        isPublic: false,
      },
    ];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('AUTH_CLIENTS_JSON must be an array');
    }
    return parsed.map((entry) => {
      if (!entry || typeof entry !== 'object') {
        throw new Error('Invalid client entry in AUTH_CLIENTS_JSON');
      }
      const { clientId, clientSecret, redirectUris, scopes, isPublic } = entry;
      if (typeof clientId !== 'string' || !clientId.trim()) {
        throw new Error('clientId is required for each client');
      }
      if (!Array.isArray(redirectUris) || redirectUris.length === 0) {
        throw new Error(`redirectUris missing for client ${clientId}`);
      }
      if (!Array.isArray(scopes) || scopes.length === 0) {
        throw new Error(`scopes missing for client ${clientId}`);
      }
      if (!isPublic && typeof clientSecret !== 'string') {
        throw new Error(`clientSecret required for confidential client ${clientId}`);
      }
      return {
        clientId,
        clientSecret,
        redirectUris,
        scopes,
        isPublic: Boolean(isPublic),
      };
    });
  } catch (error) {
    throw new Error(`Failed to parse AUTH_CLIENTS_JSON: ${(error as Error).message}`);
  }
}

function deriveKid(secret: Buffer): string {
  const hash = crypto.createHash('sha256').update(secret).digest('base64url');
  return hash.slice(0, 16);
}

export function loadAuthConfig(port: number, defaultScopes: string[] = []): AuthConfig {
  const issuerFromEnv = process.env.AUTH_ISSUER;
  const issuer =
    issuerFromEnv ??
    (port === 443
      ? 'https://localhost'
      : port === 80
        ? 'http://localhost'
        : `http://localhost:${port}`);

  const secretString = process.env.AUTH_JWT_SECRET ?? 'mcp-dev-secret';
  const jwtSecret = Buffer.from(secretString, 'utf8');
  const encryptionKey = (() => {
    const raw = process.env.AUTH_ENCRYPTION_KEY;
    if (raw) {
      try {
        const decoded = Buffer.from(raw, 'base64');
        if (decoded.length !== 32) {
          throw new Error('AUTH_ENCRYPTION_KEY must decode to 32 bytes for AES-256-GCM');
        }
        return decoded;
      } catch (error) {
        throw new Error(`Failed to decode AUTH_ENCRYPTION_KEY: ${(error as Error).message}`);
      }
    }
    return crypto.createHash('sha256').update(jwtSecret).digest();
  })();
  const sessionSecret = (() => {
    const raw = process.env.AUTH_SESSION_SECRET;
    if (raw) {
      return crypto.createHash('sha256').update(raw, 'utf8').digest();
    }
    return crypto.createHash('sha256').update(encryptionKey).digest();
  })();
  const clients = parseClients(defaultScopes);

  const allowedOrigins =
    process.env.ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? [];
  const allowedHosts =
    process.env.ALLOWED_HOSTS?.split(',').map((host) => host.trim()).filter(Boolean) ?? [];

  return {
    issuer,
    audience: process.env.AUTH_AUDIENCE ?? 'mcp-server',
    jwtSecret,
    jwtKid: deriveKid(jwtSecret),
    encryptionKey,
    sessionSecret,
    accessTokenTtlSeconds: Number.parseInt(process.env.ACCESS_TOKEN_TTL_SECONDS ?? '900', 10),
    refreshTokenTtlSeconds: Number.parseInt(process.env.REFRESH_TOKEN_TTL_SECONDS ?? '2592000', 10),
    clients,
    clockSkewSeconds: Number.parseInt(process.env.TOKEN_CLOCK_SKEW ?? '5', 10),
    allowedOrigins,
    allowedHosts,
    dnsRebindingProtection: process.env.MCP_ENABLE_DNS_PROTECTION === 'true',
    formTemplatePath: process.env.AUTH_FORM_TEMPLATE,
  };
}
