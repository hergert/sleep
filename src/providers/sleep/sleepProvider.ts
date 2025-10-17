import { SleepClient } from '../../client.js';
import type { SleepTokenBundle } from '../../client.js';
import type {
  AuthenticationProvider,
  AuthenticationResult,
  CredentialPayload,
} from '../../auth/provider.js';

export class SleepAuthProvider implements AuthenticationProvider<SleepClient> {
  readonly id = 'sleep';
  readonly displayName = 'Sleep';
  readonly defaultScopes = [
    'sleep.read_device',
    'sleep.read_trends',
    'sleep.write_temperature',
    'sleep.prompts.analyze',
  ];

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
    const client = new SleepClient(credentials);
    return client;
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
