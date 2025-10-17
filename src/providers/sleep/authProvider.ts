import { SleepClient } from './client.js';
import type { SleepTokenBundle } from './client.js';
import type {
  AuthenticationProvider,
  AuthenticationResult,
  CredentialPayload,
} from '../../platform/auth/provider.js';

export class SleepAuthProvider implements AuthenticationProvider<SleepClient> {
  readonly id = 'sleep';
  readonly displayName = 'Sleep';
  readonly defaultScopes = ['sleep.read', 'sleep.write'];

  async authenticate(email: string, password: string): Promise<AuthenticationResult> {
    const client = new SleepClient();
    const tokens = await client.authenticate(email, password);
    const profile = await client.getUserProfile();
    const deviceId = profile.currentDevice?.id;

    if (!deviceId) {
      throw new Error('No active Sleep device associated with the authenticated account.');
    }

    return {
      credentials: this.buildCredentialPayload(tokens, deviceId, profile.firstName),
    };
  }

  async createClient(credentials: CredentialPayload): Promise<SleepClient> {
    const client = new SleepClient({
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      expiresAt: credentials.expiresAt,
      userId: credentials.userId,
    });
    return client;
  }

  async refreshCredentials(credentials: CredentialPayload): Promise<CredentialPayload | undefined> {
    const client = new SleepClient({
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      expiresAt: credentials.expiresAt,
      userId: credentials.userId,
    });
    const bundle = await client.ensureFreshTokens();

    if (
      bundle.accessToken !== credentials.accessToken ||
      bundle.refreshToken !== credentials.refreshToken ||
      bundle.expiresAt !== credentials.expiresAt
    ) {
      return {
        ...credentials,
        accessToken: bundle.accessToken,
        refreshToken: bundle.refreshToken,
        expiresAt: bundle.expiresAt,
      };
    }

    return undefined;
  }

  private buildCredentialPayload(
    bundle: SleepTokenBundle,
    deviceId: string,
    firstName?: string
  ): CredentialPayload {
    return {
      accessToken: bundle.accessToken,
      refreshToken: bundle.refreshToken,
      expiresAt: bundle.expiresAt,
      userId: bundle.userId,
      metadata: {
        deviceId,
        firstName,
      },
    };
  }
}
