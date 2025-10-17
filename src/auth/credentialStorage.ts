import crypto from 'node:crypto';
import type { AuthConfig } from './config.js';
import type { CredentialPayload } from './provider.js';

interface PendingRecord {
  data: string;
  expiresAt: number;
  providerId: string;
}

interface StoredGrantRecord {
  providerId: string;
  encryptedProps: string;
  refreshTokenHash?: string;
  previousRefreshTokenHash?: string;
}

// Storage backend interface
interface CredentialStorageBackend {
  storePending(code: string, record: PendingRecord): Promise<void>;
  consumePending(code: string): Promise<PendingRecord | undefined>;
  persistCredential(key: string, record: StoredGrantRecord): Promise<void>;
  getCredential(key: string): Promise<StoredGrantRecord | undefined>;
  removeCredential(key: string): Promise<void>;
  hasCredentials(providerId?: string): Promise<boolean>;
}

// In-memory storage backend
class InMemoryCredentialStorage implements CredentialStorageBackend {
  private pendingAuthorizations = new Map<string, PendingRecord>();
  private credentialStore = new Map<string, StoredGrantRecord>();

  async storePending(code: string, record: PendingRecord): Promise<void> {
    this.pendingAuthorizations.set(code, record);
  }

  async consumePending(code: string): Promise<PendingRecord | undefined> {
    const record = this.pendingAuthorizations.get(code);
    if (record) {
      this.pendingAuthorizations.delete(code);
    }
    return record;
  }

  async persistCredential(key: string, record: StoredGrantRecord): Promise<void> {
    this.credentialStore.set(key, record);
  }

  async getCredential(key: string): Promise<StoredGrantRecord | undefined> {
    return this.credentialStore.get(key);
  }

  async removeCredential(key: string): Promise<void> {
    this.credentialStore.delete(key);
  }

  async hasCredentials(providerId?: string): Promise<boolean> {
    if (providerId) {
      for (const record of this.credentialStore.values()) {
        if (record.providerId === providerId) {
          return true;
        }
      }
      return false;
    }
    return this.credentialStore.size > 0;
  }
}

// KV storage backend
class KVCredentialStorage implements CredentialStorageBackend {
  constructor(private credentialsKV: KVNamespace) {}

  private pendingKey(code: string): string {
    return `pending:${code}`;
  }

  private credKey(accountKey: string): string {
    return `cred:${accountKey}`;
  }

  async storePending(code: string, record: PendingRecord): Promise<void> {
    const ttl = Math.max(1, Math.floor((record.expiresAt - Date.now()) / 1000));
    await this.credentialsKV.put(this.pendingKey(code), JSON.stringify(record), {
      expirationTtl: ttl,
    });
  }

  async consumePending(code: string): Promise<PendingRecord | undefined> {
    const key = this.pendingKey(code);
    const data = await this.credentialsKV.get(key);
    if (!data) return undefined;

    await this.credentialsKV.delete(key);
    return JSON.parse(data);
  }

  async persistCredential(key: string, record: StoredGrantRecord): Promise<void> {
    await this.credentialsKV.put(this.credKey(key), JSON.stringify(record));
  }

  async getCredential(key: string): Promise<StoredGrantRecord | undefined> {
    const data = await this.credentialsKV.get(this.credKey(key));
    return data ? JSON.parse(data) : undefined;
  }

  async removeCredential(key: string): Promise<void> {
    await this.credentialsKV.delete(this.credKey(key));
  }

  async hasCredentials(providerId?: string): Promise<boolean> {
    if (providerId) {
      const list = await this.credentialsKV.list({ prefix: 'cred:' });
      for (const key of list.keys) {
        const data = await this.credentialsKV.get(key.name);
        if (data) {
          const record: StoredGrantRecord = JSON.parse(data);
          if (record.providerId === providerId) return true;
        }
      }
      return false;
    }
    const list = await this.credentialsKV.list({ prefix: 'cred:', limit: 1 });
    return list.keys.length > 0;
  }
}

let masterEncryptionKey: Buffer | undefined;
let storageBackend: CredentialStorageBackend = new InMemoryCredentialStorage();

// Initialize credential storage backend
export function initializeCredentialStorage(credentialsKV?: KVNamespace) {
  if (credentialsKV) {
    storageBackend = new KVCredentialStorage(credentialsKV);
    console.log('[credentialStorage] Using KV storage backend');
  } else {
    storageBackend = new InMemoryCredentialStorage();
    console.log('[credentialStorage] Using in-memory storage backend');
  }

  const raw = process.env.AUTH_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error('AUTH_ENCRYPTION_KEY must be set to initialize credential storage');
  }
  masterEncryptionKey = Buffer.from(raw, 'base64');
}

function ensureMasterKey(): Buffer {
  if (!masterEncryptionKey) {
    throw new Error('Credential storage not initialised');
  }
  return masterEncryptionKey;
}

function serialize(record: { iv: Buffer; ciphertext: Buffer; tag: Buffer }): string {
  return JSON.stringify({
    iv: record.iv.toString('base64'),
    ciphertext: record.ciphertext.toString('base64'),
    tag: record.tag.toString('base64'),
  });
}

function deserialize(data: string): { iv: Buffer; ciphertext: Buffer; tag: Buffer } {
  const parsed = JSON.parse(data) as { iv: string; ciphertext: string; tag: string };
  return {
    iv: Buffer.from(parsed.iv, 'base64'),
    ciphertext: Buffer.from(parsed.ciphertext, 'base64'),
    tag: Buffer.from(parsed.tag, 'base64'),
  };
}

function deriveGrantKey(providerId: string, subject: string, clientId: string): Buffer {
  const masterKey = ensureMasterKey();
  return crypto
    .createHmac('sha256', masterKey)
    .update(`${providerId}:${subject}:${clientId}`)
    .digest();
}

function encryptWithKey(key: Buffer, payload: CredentialPayload): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const serialized = Buffer.from(JSON.stringify(payload), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(serialized), cipher.final()]);
  const tag = cipher.getAuthTag();
  return serialize({ iv, ciphertext, tag });
}

function decryptWithKey(key: Buffer, data: string): CredentialPayload {
  const { iv, ciphertext, tag } = deserialize(data);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8')) as CredentialPayload;
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function accountKey(subject: string, clientId: string): string {
  return `${subject}::${clientId}`;
}

export function initialiseCredentialStorage(config: AuthConfig) {
  masterEncryptionKey = Buffer.from(config.encryptionKey);
}

export async function storePendingCredential(
  code: string,
  providerId: string,
  payload: CredentialPayload,
  ttlMilliseconds = 5 * 60 * 1000
): Promise<void> {
  const expiresAt = Date.now() + ttlMilliseconds;
  await storageBackend.storePending(code, {
    providerId,
    data: encryptWithKey(ensureMasterKey(), payload),
    expiresAt,
  });
}

export async function consumePendingCredential(
  code: string
): Promise<{ providerId: string; credentials: CredentialPayload } | undefined> {
  const record = await storageBackend.consumePending(code);
  if (!record) {
    return undefined;
  }
  if (record.expiresAt <= Date.now()) {
    return undefined;
  }
  return { providerId: record.providerId, credentials: decryptWithKey(ensureMasterKey(), record.data) };
}

export async function persistCredentials(
  subject: string,
  clientId: string,
  providerId: string,
  payload: CredentialPayload
): Promise<void> {
  const key = accountKey(subject, clientId);
  const grantKey = deriveGrantKey(providerId, subject, clientId);
  const encryptedProps = encryptWithKey(grantKey, payload);
  const current = await storageBackend.getCredential(key);
  const refreshTokenHash = payload.refreshToken ? hashToken(payload.refreshToken) : undefined;

  const record: StoredGrantRecord = {
    providerId,
    encryptedProps,
    refreshTokenHash,
  };

  if (refreshTokenHash && current?.refreshTokenHash && current.refreshTokenHash !== refreshTokenHash) {
    record.previousRefreshTokenHash = current.refreshTokenHash;
  } else if (!refreshTokenHash && current?.refreshTokenHash) {
    record.previousRefreshTokenHash = current.refreshTokenHash;
  } else if (!record.previousRefreshTokenHash && current?.previousRefreshTokenHash) {
    record.previousRefreshTokenHash = current.previousRefreshTokenHash;
  }

  await storageBackend.persistCredential(key, record);
}

export async function getPersistedCredentials(
  subject: string,
  clientId: string
): Promise<{ providerId: string; credentials: CredentialPayload } | undefined> {
  const record = await storageBackend.getCredential(accountKey(subject, clientId));
  if (!record) {
    return undefined;
  }
  try {
    const grantKey = deriveGrantKey(record.providerId, subject, clientId);
    return { providerId: record.providerId, credentials: decryptWithKey(grantKey, record.encryptedProps) };
  } catch (_error) {
    await storageBackend.removeCredential(accountKey(subject, clientId));
    return undefined;
  }
}

export async function removePersistedCredentials(subject: string, clientId: string): Promise<void> {
  await storageBackend.removeCredential(accountKey(subject, clientId));
}

export async function hasPersistedCredentials(providerId?: string): Promise<boolean> {
  return storageBackend.hasCredentials(providerId);
}
