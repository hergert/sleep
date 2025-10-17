import crypto from 'node:crypto';
import type { OAuthClient } from './config.js';

export type { OAuthClient };

export interface AuthorizationCode {
  code: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
  subject: string;
  codeChallenge: string;
  codeChallengeMethod: 'plain' | 'S256';
  expiresAt: number;
}

export interface RefreshTokenRecord {
  hashedToken: string;
  clientId: string;
  subject: string;
  scopes: string[];
  expiresAt: number;
}

// Storage backend interface
interface StorageBackend {
  registerClient(client: OAuthClient): Promise<void>;
  getClient(clientId: string): Promise<OAuthClient | undefined>;
  listClients(): Promise<OAuthClient[]>;
  storeAuthorizationCode(record: AuthorizationCode): Promise<void>;
  consumeAuthorizationCode(code: string): Promise<AuthorizationCode | undefined>;
  storeRefreshToken(record: RefreshTokenRecord): Promise<void>;
  rotateRefreshToken(oldHashed: string | undefined, record: RefreshTokenRecord): Promise<void>;
  consumeRefreshToken(hashedToken: string): Promise<RefreshTokenRecord | undefined>;
  revokeRefreshToken(hashedToken: string): Promise<void>;
}

// In-memory storage (for local development)
class InMemoryStorage implements StorageBackend {
  private clientsById = new Map<string, OAuthClient>();
  private authorizationCodes = new Map<string, AuthorizationCode>();
  private refreshTokens = new Map<string, RefreshTokenRecord>();

  async registerClient(client: OAuthClient): Promise<void> {
    this.clientsById.set(client.clientId, client);
  }

  async getClient(clientId: string): Promise<OAuthClient | undefined> {
    return this.clientsById.get(clientId);
  }

  async listClients(): Promise<OAuthClient[]> {
    return Array.from(this.clientsById.values());
  }

  async storeAuthorizationCode(record: AuthorizationCode): Promise<void> {
    this.authorizationCodes.set(record.code, record);
  }

  async consumeAuthorizationCode(code: string): Promise<AuthorizationCode | undefined> {
    const record = this.authorizationCodes.get(code);
    if (record) {
      this.authorizationCodes.delete(code);
    }
    return record;
  }

  async storeRefreshToken(record: RefreshTokenRecord): Promise<void> {
    this.refreshTokens.set(record.hashedToken, record);
  }

  async rotateRefreshToken(oldHashed: string | undefined, record: RefreshTokenRecord): Promise<void> {
    if (oldHashed) {
      this.refreshTokens.delete(oldHashed);
    }
    this.refreshTokens.set(record.hashedToken, record);
  }

  async consumeRefreshToken(hashedToken: string): Promise<RefreshTokenRecord | undefined> {
    const record = this.refreshTokens.get(hashedToken);
    if (!record) {
      return undefined;
    }
    if (record.expiresAt <= Date.now() / 1000) {
      this.refreshTokens.delete(hashedToken);
      return undefined;
    }
    return record;
  }

  async revokeRefreshToken(hashedToken: string): Promise<void> {
    this.refreshTokens.delete(hashedToken);
  }
}

// KV storage (for Cloudflare Workers)
class KVStorage implements StorageBackend {
  constructor(
    private oauthKV: KVNamespace,
    private clientsKV: KVNamespace
  ) {}

  private authCodeKey(code: string): string {
    return `auth:${code}`;
  }

  private refreshTokenKey(hashedToken: string): string {
    return `refresh:${hashedToken}`;
  }

  private clientKey(clientId: string): string {
    return `client:${clientId}`;
  }

  async registerClient(client: OAuthClient): Promise<void> {
    await this.clientsKV.put(this.clientKey(client.clientId), JSON.stringify(client));
  }

  async getClient(clientId: string): Promise<OAuthClient | undefined> {
    const data = await this.clientsKV.get(this.clientKey(clientId));
    return data ? JSON.parse(data) : undefined;
  }

  async listClients(): Promise<OAuthClient[]> {
    const list = await this.clientsKV.list({ prefix: 'client:' });
    const clients: OAuthClient[] = [];
    for (const key of list.keys) {
      const data = await this.clientsKV.get(key.name);
      if (data) clients.push(JSON.parse(data));
    }
    return clients;
  }

  async storeAuthorizationCode(record: AuthorizationCode): Promise<void> {
    const ttl = Math.max(1, Math.floor((record.expiresAt - Date.now()) / 1000));
    await this.oauthKV.put(this.authCodeKey(record.code), JSON.stringify(record), {
      expirationTtl: ttl,
    });
  }

  async consumeAuthorizationCode(code: string): Promise<AuthorizationCode | undefined> {
    const key = this.authCodeKey(code);
    const data = await this.oauthKV.get(key);
    if (!data) return undefined;

    await this.oauthKV.delete(key);
    return JSON.parse(data);
  }

  async storeRefreshToken(record: RefreshTokenRecord): Promise<void> {
    const ttl = Math.max(1, record.expiresAt - Math.floor(Date.now() / 1000));
    await this.oauthKV.put(this.refreshTokenKey(record.hashedToken), JSON.stringify(record), {
      expirationTtl: ttl,
    });
  }

  async rotateRefreshToken(oldHashed: string | undefined, record: RefreshTokenRecord): Promise<void> {
    if (oldHashed) {
      await this.oauthKV.delete(this.refreshTokenKey(oldHashed));
    }
    await this.storeRefreshToken(record);
  }

  async consumeRefreshToken(hashedToken: string): Promise<RefreshTokenRecord | undefined> {
    const data = await this.oauthKV.get(this.refreshTokenKey(hashedToken));
    if (!data) return undefined;

    const record: RefreshTokenRecord = JSON.parse(data);
    if (record.expiresAt <= Math.floor(Date.now() / 1000)) {
      await this.oauthKV.delete(this.refreshTokenKey(hashedToken));
      return undefined;
    }
    return record;
  }

  async revokeRefreshToken(hashedToken: string): Promise<void> {
    await this.oauthKV.delete(this.refreshTokenKey(hashedToken));
  }
}

// Global storage backend (initialized by worker or server)
let storageBackend: StorageBackend = new InMemoryStorage();

// Initialize storage backend (called from worker.ts with KV bindings, or uses in-memory for local dev)
export function initializeStorage(oauthKV?: KVNamespace, clientsKV?: KVNamespace) {
  if (oauthKV && clientsKV) {
    storageBackend = new KVStorage(oauthKV, clientsKV);
    console.log('[store] Using KV storage backend');
  } else {
    storageBackend = new InMemoryStorage();
    console.log('[store] Using in-memory storage backend');
  }
}

// Export async functions that delegate to the storage backend
export async function registerClient(client: OAuthClient): Promise<void> {
  return storageBackend.registerClient(client);
}

export async function getClient(clientId: string): Promise<OAuthClient | undefined> {
  return storageBackend.getClient(clientId);
}

export async function listClients(): Promise<OAuthClient[]> {
  return storageBackend.listClients();
}

export async function storeAuthorizationCode(record: AuthorizationCode): Promise<void> {
  return storageBackend.storeAuthorizationCode(record);
}

export async function consumeAuthorizationCode(code: string): Promise<AuthorizationCode | undefined> {
  return storageBackend.consumeAuthorizationCode(code);
}

export function purgeExpiredAuthorizationCodes(_now: number) {
  // KV handles expiration automatically, in-memory storage doesn't need purging for short-lived codes
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function storeRefreshToken(record: RefreshTokenRecord): Promise<void> {
  return storageBackend.storeRefreshToken(record);
}

export async function rotateRefreshToken(oldHashed: string | undefined, record: RefreshTokenRecord): Promise<void> {
  return storageBackend.rotateRefreshToken(oldHashed, record);
}

export async function consumeRefreshToken(hashedToken: string): Promise<RefreshTokenRecord | undefined> {
  return storageBackend.consumeRefreshToken(hashedToken);
}

export async function revokeRefreshToken(hashedToken: string): Promise<void> {
  return storageBackend.revokeRefreshToken(hashedToken);
}
