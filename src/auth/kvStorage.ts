import type { CredentialPayload } from './provider.js';
import type { AuthorizationCode, RefreshTokenRecord, OAuthClient } from './store.js';

/**
 * KV-backed credential storage for Cloudflare Workers.
 * Replaces in-memory Maps with persistent KV storage.
 */
export class KVCredentialStorage {
  constructor(
    private credentialsKV: KVNamespace,
    private encryptionKey: string
  ) {}

  private credKey(subject: string, clientId: string): string {
    return `cred:${subject}::${clientId}`;
  }

  private pendingKey(code: string): string {
    return `pending:${code}`;
  }

  async storePendingCredential(
    code: string,
    providerId: string,
    payload: CredentialPayload,
    ttlSeconds = 300
  ): Promise<void> {
    const record = {
      providerId,
      data: JSON.stringify(payload),
      expiresAt: Date.now() + ttlSeconds * 1000,
    };
    await this.credentialsKV.put(this.pendingKey(code), JSON.stringify(record), {
      expirationTtl: ttlSeconds,
    });
  }

  async consumePendingCredential(
    code: string
  ): Promise<{ providerId: string; credentials: CredentialPayload } | undefined> {
    const key = this.pendingKey(code);
    const data = await this.credentialsKV.get(key);
    if (!data) return undefined;

    await this.credentialsKV.delete(key);

    const record = JSON.parse(data);
    if (record.expiresAt <= Date.now()) return undefined;

    return {
      providerId: record.providerId,
      credentials: JSON.parse(record.data),
    };
  }

  async persistCredentials(
    subject: string,
    clientId: string,
    providerId: string,
    payload: CredentialPayload
  ): Promise<void> {
    const record = {
      providerId,
      data: JSON.stringify(payload),
    };
    await this.credentialsKV.put(this.credKey(subject, clientId), JSON.stringify(record));
  }

  async getPersistedCredentials(
    subject: string,
    clientId: string
  ): Promise<{ providerId: string; credentials: CredentialPayload } | undefined> {
    const data = await this.credentialsKV.get(this.credKey(subject, clientId));
    if (!data) return undefined;

    try {
      const record = JSON.parse(data);
      return {
        providerId: record.providerId,
        credentials: JSON.parse(record.data),
      };
    } catch {
      await this.credentialsKV.delete(this.credKey(subject, clientId));
      return undefined;
    }
  }

  async removePersistedCredentials(subject: string, clientId: string): Promise<void> {
    await this.credentialsKV.delete(this.credKey(subject, clientId));
  }

  async hasPersistedCredentials(providerId?: string): Promise<boolean> {
    if (providerId) {
      const list = await this.credentialsKV.list({ prefix: 'cred:' });
      for (const key of list.keys) {
        const data = await this.credentialsKV.get(key.name);
        if (data) {
          const record = JSON.parse(data);
          if (record.providerId === providerId) return true;
        }
      }
      return false;
    }
    const list = await this.credentialsKV.list({ prefix: 'cred:', limit: 1 });
    return list.keys.length > 0;
  }
}

/**
 * KV-backed OAuth state storage for Cloudflare Workers.
 * Replaces in-memory Maps for auth codes, refresh tokens, and clients.
 */
export class KVOAuthStore {
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

  async rotateRefreshToken(
    oldHashed: string | undefined,
    record: RefreshTokenRecord
  ): Promise<void> {
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
