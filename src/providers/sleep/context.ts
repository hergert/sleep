import type { CredentialPayload } from '../../platform/auth/provider.js';
import { getAuthProvider, getProviderCredentials } from '../../platform/auth/http.js';
import { persistCredentials } from '../../platform/auth/credentialStorage.js';
import type { SleepClient } from './client.js';

type RawAuthInfo = {
  token?: string;
  clientId?: string;
  scopes?: string[];
  expiresAt?: number;
  extra?: { subject?: string };
  [key: string]: unknown;
};

interface AuthContext {
  subject: string;
  clientId: string;
  authInfo: RawAuthInfo;
}

export interface SleepExecutionContext {
  client: SleepClient;
  deviceId: string;
  credentials: CredentialPayload;
  subject: string;
  clientId: string;
}

export const ensureAuthenticated = (extra: { authInfo?: unknown }): RawAuthInfo => {
  if (!extra?.authInfo) {
    const error = new Error('Authentication required');
    (error as Error & { code?: number }).code = -32603;
    (error as any).httpStatus = 401;
    throw error;
  }
  return extra.authInfo as RawAuthInfo;
};

const getAuthContext = (extra: { authInfo?: unknown }): AuthContext => {
  const authInfo = ensureAuthenticated(extra);
  const clientId = authInfo.clientId;
  const subject = authInfo.extra?.subject;
  if (!clientId || !subject) {
    const error = new Error('Authenticated subject not available');
    (error as Error & { code?: number }).code = -32603;
    (error as any).httpStatus = 401;
    throw error;
  }
  return { subject, clientId, authInfo };
};

export const TIMEZONE = process.env.SLEEP_TIMEZONE ?? 'UTC';

export const isoDateDaysAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
};

export const normalizeDaysWindow = (value: unknown): number => {
  if (value === undefined || value === null || value === '') {
    return 7;
  }

  const numeric = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  if (!Number.isFinite(numeric)) {
    const error = new Error('Argument "days" must be an integer between 1 and 14.');
    (error as Error & { code?: number }).code = -32602;
    throw error;
  }

  const coerced = Math.trunc(numeric);
  if (coerced < 1 || coerced > 14) {
    const error = new Error('Argument "days" must be between 1 and 14.');
    (error as Error & { code?: number }).code = -32602;
    throw error;
  }
  return coerced;
};

export const withSleepClient = async <T>(
  extra: { authInfo?: unknown },
  handler: (context: SleepExecutionContext) => Promise<T>
): Promise<T> => {
  const context = getAuthContext(extra);
  const provider = getAuthProvider();

  if (!provider) {
    const error = new Error('Authentication provider not initialized');
    (error as Error & { code?: number }).code = -32603;
    (error as any).httpStatus = 500;
    throw error;
  }

  const storedCredentials = await getProviderCredentials(context.subject, context.clientId);
  if (!storedCredentials) {
    const error = new Error('Account credentials not found. Please sign in again.');
    (error as Error & { code?: number }).code = -32603;
    (error as any).httpStatus = 401;
    throw error;
  }

  let credentials = storedCredentials;
  if (provider.refreshCredentials) {
    const refreshed = await provider.refreshCredentials(storedCredentials);
    if (refreshed) {
      credentials = refreshed;
      await persistCredentials(context.subject, context.clientId, provider.id, refreshed);
    }
  }

  const client = (await provider.createClient(credentials)) as SleepClient;

  const deviceId = credentials.metadata?.deviceId;
  if (typeof deviceId !== 'string' || deviceId.length === 0) {
    const error = new Error('No Sleep device associated with this account.');
    (error as Error & { code?: number }).code = -32603;
    (error as any).httpStatus = 412;
    throw error;
  }

  return handler({
    client,
    deviceId,
    credentials,
    subject: context.subject,
    clientId: context.clientId,
  });
};
