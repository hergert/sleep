import crypto from 'node:crypto';
import type { AuthConfig } from './config.js';

export interface SleepCredentialPayload {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
  email: string;
  firstName?: string;
  deviceId: string;
}

interface PendingRecord {
  data: string;
  expiresAt: number;
}

let encryptionKey: Buffer | undefined;

const pendingAuthorizations = new Map<string, PendingRecord>();
const accountStore = new Map<string, string>();

function ensureEncryptionKey(): Buffer {
  if (!encryptionKey) {
    throw new Error('Sleep credential storage not initialised');
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

function encrypt(payload: SleepCredentialPayload): string {
  const key = ensureEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const serialized = Buffer.from(JSON.stringify(payload), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(serialized), cipher.final()]);
  const tag = cipher.getAuthTag();
  return serialize({ iv, ciphertext, tag });
}

function decrypt(data: string): SleepCredentialPayload {
  const key = ensureEncryptionKey();
  const { iv, ciphertext, tag } = deserialize(data);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8')) as SleepCredentialPayload;
}

function accountKey(subject: string, clientId: string): string {
  return `${subject}::${clientId}`;
}

export function initialiseSleepStorage(config: AuthConfig) {
  encryptionKey = Buffer.from(config.encryptionKey);
}

export function storePendingSleepAuthorization(
  code: string,
  payload: SleepCredentialPayload,
  ttlMilliseconds = 5 * 60 * 1000
) {
  const expiresAt = Date.now() + ttlMilliseconds;
  pendingAuthorizations.set(code, { data: encrypt(payload), expiresAt });
}

export function consumePendingSleepAuthorization(code: string): SleepCredentialPayload | undefined {
  const record = pendingAuthorizations.get(code);
  if (!record) {
    return undefined;
  }
  pendingAuthorizations.delete(code);
  if (record.expiresAt <= Date.now()) {
    return undefined;
  }
  return decrypt(record.data);
}

export function persistSleepAccount(
  subject: string,
  clientId: string,
  payload: SleepCredentialPayload
) {
  accountStore.set(accountKey(subject, clientId), encrypt(payload));
}

export function getSleepAccount(
  subject: string,
  clientId: string
): SleepCredentialPayload | undefined {
  const record = accountStore.get(accountKey(subject, clientId));
  if (!record) {
    return undefined;
  }
  try {
    return decrypt(record);
  } catch (error) {
    // If decrypt fails (e.g., key rotated), remove corrupted entry.
    accountStore.delete(accountKey(subject, clientId));
    return undefined;
  }
}

export function removeSleepAccount(subject: string, clientId: string) {
  accountStore.delete(accountKey(subject, clientId));
}

export function hasPersistedSleepAccounts(): boolean {
  return accountStore.size > 0;
}
