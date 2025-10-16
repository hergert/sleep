import crypto from 'node:crypto';
import type { AuthConfig } from './config.js';
import type { CredentialPayload } from './provider.js';

interface PendingRecord {
  data: string;
  expiresAt: number;
  providerId: string;
}

interface StoredCredentialRecord {
  providerId: string;
  data: string;
}

let encryptionKey: Buffer | undefined;

const pendingAuthorizations = new Map<string, PendingRecord>();
const credentialStore = new Map<string, StoredCredentialRecord>();

function ensureEncryptionKey(): Buffer {
  if (!encryptionKey) {
    throw new Error('Credential storage not initialised');
  }
  return encryptionKey;
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

function encrypt(payload: CredentialPayload): string {
  const key = ensureEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const serialized = Buffer.from(JSON.stringify(payload), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(serialized), cipher.final()]);
  const tag = cipher.getAuthTag();
  return serialize({ iv, ciphertext, tag });
}

function decrypt(data: string): CredentialPayload {
  const key = ensureEncryptionKey();
  const { iv, ciphertext, tag } = deserialize(data);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8')) as CredentialPayload;
}

function accountKey(subject: string, clientId: string): string {
  return `${subject}::${clientId}`;
}

export function initialiseCredentialStorage(config: AuthConfig) {
  encryptionKey = Buffer.from(config.encryptionKey);
}

export function storePendingCredential(
  code: string,
  providerId: string,
  payload: CredentialPayload,
  ttlMilliseconds = 5 * 60 * 1000
) {
  const expiresAt = Date.now() + ttlMilliseconds;
  pendingAuthorizations.set(code, {
    providerId,
    data: encrypt(payload),
    expiresAt,
  });
}

export function consumePendingCredential(
  code: string
): { providerId: string; credentials: CredentialPayload } | undefined {
  const record = pendingAuthorizations.get(code);
  if (!record) {
    return undefined;
  }
  pendingAuthorizations.delete(code);
  if (record.expiresAt <= Date.now()) {
    return undefined;
  }
  return { providerId: record.providerId, credentials: decrypt(record.data) };
}

export function persistCredentials(
  subject: string,
  clientId: string,
  providerId: string,
  payload: CredentialPayload
) {
  credentialStore.set(accountKey(subject, clientId), {
    providerId,
    data: encrypt(payload),
  });
}

export function getPersistedCredentials(
  subject: string,
  clientId: string
): { providerId: string; credentials: CredentialPayload } | undefined {
  const record = credentialStore.get(accountKey(subject, clientId));
  if (!record) {
    return undefined;
  }
  try {
    return { providerId: record.providerId, credentials: decrypt(record.data) };
  } catch (error) {
    credentialStore.delete(accountKey(subject, clientId));
    return undefined;
  }
}

export function removePersistedCredentials(subject: string, clientId: string) {
  credentialStore.delete(accountKey(subject, clientId));
}

export function hasPersistedCredentials(providerId?: string): boolean {
  if (providerId) {
    for (const record of credentialStore.values()) {
      if (record.providerId === providerId) {
        return true;
      }
    }
    return false;
  }
  return credentialStore.size > 0;
}
