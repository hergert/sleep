import { FitnessClient } from './client.js';
import type { AuthenticationProvider, AuthenticationResult, CredentialPayload } from '../../platform/auth/provider.js';

export class FitnessAuthProvider implements AuthenticationProvider<FitnessClient> {
  readonly id = 'fitness';
  readonly displayName = 'Fitness';
  readonly defaultScopes = ['fitness.read', 'fitness.write'];

  async authenticate(username: string, password: string): Promise<AuthenticationResult> {
    const client = new FitnessClient();
    await client.authenticate({ username, password });
    const tokens = client.getTokens();
    const profile = await client.getUserProfile();

    if (!tokens.idToken) {
      throw new Error('Failed to obtain ID token from Tonal authentication');
    }

    return {
      credentials: {
        accessToken: tokens.idToken,
        refreshToken: tokens.refreshToken ?? '',
        expiresAt: tokens.expiresAt,
        userId: profile.id,
        metadata: {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
        },
      },
    };
  }

  async createClient(credentials: CredentialPayload): Promise<FitnessClient> {
    const client = new FitnessClient({ userId: credentials.userId });
    client.setTokens({
      idToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      expiresAt: credentials.expiresAt,
      userId: credentials.userId,
    });
    return client;
  }

  async refreshCredentials(): Promise<CredentialPayload | undefined> {
    // Tonal tokens are long-lived (24h id token). Implement refresh via Auth0 refresh token if needed.
    return undefined;
  }
}
