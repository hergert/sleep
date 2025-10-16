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
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
  clients: OAuthClient[];
  clockSkewSeconds: number;
  allowedOrigins: string[];
  allowedHosts: string[];
  dnsRebindingProtection: boolean;
}

function parseClients(): OAuthClient[] {
  const raw = process.env.AUTH_CLIENTS_JSON;
  if (!raw) {
    return [
      {
        clientId: 'sleep-cli',
        clientSecret: 'dev-secret',
        redirectUris: ['http://localhost:8765/callback'],
        scopes: ['sleep.read_device', 'sleep.read_trends', 'sleep.write_temperature', 'sleep.prompts.analyze'],
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

export function loadAuthConfig(port: number): AuthConfig {
  const issuerFromEnv = process.env.AUTH_ISSUER;
  const issuer =
    issuerFromEnv ??
    (port === 443
      ? 'https://localhost'
      : port === 80
        ? 'http://localhost'
        : `http://localhost:${port}`);

  const secretString = process.env.AUTH_JWT_SECRET ?? 'sleep-mcp-dev-secret';
  const jwtSecret = Buffer.from(secretString, 'utf8');
  const clients = parseClients();

  const allowedOrigins =
    process.env.ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? [];
  const allowedHosts =
    process.env.ALLOWED_HOSTS?.split(',').map((host) => host.trim()).filter(Boolean) ?? [];

  return {
    issuer,
    audience: process.env.AUTH_AUDIENCE ?? 'sleep-mcp-server',
    jwtSecret,
    jwtKid: deriveKid(jwtSecret),
    accessTokenTtlSeconds: Number.parseInt(process.env.ACCESS_TOKEN_TTL_SECONDS ?? '900', 10),
    refreshTokenTtlSeconds: Number.parseInt(process.env.REFRESH_TOKEN_TTL_SECONDS ?? '2592000', 10),
    clients,
    clockSkewSeconds: Number.parseInt(process.env.TOKEN_CLOCK_SKEW ?? '5', 10),
    allowedOrigins,
    allowedHosts,
    dnsRebindingProtection: process.env.MCP_ENABLE_DNS_PROTECTION === 'true',
  };
}
