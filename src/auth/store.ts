import crypto from 'node:crypto';
import type { OAuthClient } from './config.js';

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

const clientsById = new Map<string, OAuthClient>();
const authorizationCodes = new Map<string, AuthorizationCode>();
const refreshTokens = new Map<string, RefreshTokenRecord>();

export function registerClient(client: OAuthClient) {
  clientsById.set(client.clientId, client);
}

export function getClient(clientId: string): OAuthClient | undefined {
  return clientsById.get(clientId);
}

export function listClients(): OAuthClient[] {
  return Array.from(clientsById.values());
}

export function storeAuthorizationCode(record: AuthorizationCode) {
  authorizationCodes.set(record.code, record);
}

export function consumeAuthorizationCode(code: string): AuthorizationCode | undefined {
  const record = authorizationCodes.get(code);
  if (record) {
    authorizationCodes.delete(code);
  }
  return record;
}

export function purgeExpiredAuthorizationCodes(now: number) {
  for (const [code, record] of authorizationCodes.entries()) {
    if (record.expiresAt <= now) {
      authorizationCodes.delete(code);
    }
  }
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function storeRefreshToken(record: RefreshTokenRecord) {
  refreshTokens.set(record.hashedToken, record);
}

export function rotateRefreshToken(oldHashed: string | undefined, record: RefreshTokenRecord) {
  if (oldHashed) {
    refreshTokens.delete(oldHashed);
  }
  refreshTokens.set(record.hashedToken, record);
}

export function consumeRefreshToken(hashedToken: string): RefreshTokenRecord | undefined {
  const record = refreshTokens.get(hashedToken);
  if (!record) {
    return undefined;
  }
  if (record.expiresAt <= Date.now() / 1000) {
    refreshTokens.delete(hashedToken);
    return undefined;
  }
  return record;
}

export function revokeRefreshToken(hashedToken: string) {
  refreshTokens.delete(hashedToken);
}
