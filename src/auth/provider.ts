export interface CredentialPayload {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
  metadata?: Record<string, unknown>;
}

export interface AuthenticationResult {
  credentials: CredentialPayload;
}

export interface AuthenticationProvider<ClientType = unknown> {
  /** Unique identifier for the provider (e.g., 'sleep'). */
  id: string;
  /** Human-friendly name shown to users in the login UI. */
  displayName: string;

  /**
   * Authenticate using provider-specific credentials (email/password, etc.).
   * Returns the credential payload that should be persisted for subsequent calls.
   */
  authenticate(email: string, password: string): Promise<AuthenticationResult>;

  /**
   * Recreate a provider-specific client that can make API calls using the stored credentials.
   * Implementations should refresh tokens if required as part of client creation/use.
   */
  createClient(credentials: CredentialPayload): Promise<ClientType>;
}
