import type {
  TokenResponse,
  UserProfile,
  DeviceStatus,
  SleepDay,
} from './types.js';

const AUTH_BASE_URL = 'https://auth-api.8slp.net/v1';
const CLIENT_BASE_URL = 'https://client-api.8slp.net/v1';
const APP_BASE_URL = 'https://app-api.8slp.net/v1';

const CLIENT_ID = '0894c7f33bb94800a03f1f4df13a4f38';
const CLIENT_SECRET = 'f0954a3ed5763ba3d06834c73731a32f15f168f47d4f164751275def86db0c76';

export class EightSleepClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;
  private userId: string | null = null;

  /**
   * Authenticate with Eight Sleep API using email and password.
   * Stores access token, refresh token, and userId for subsequent requests.
   */
  async authenticate(email: string, password: string): Promise<void> {
    const response = await fetch(`${AUTH_BASE_URL}/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Android App',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'password',
        username: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
    }

    const data: TokenResponse = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    this.userId = data.userId;
    this.expiresAt = Date.now() + data.expires_in * 1000;
  }

  /**
   * Refresh the access token using the stored refresh token.
   */
  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available. Please authenticate first.');
    }

    const response = await fetch(`${AUTH_BASE_URL}/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
    }

    const data: Omit<TokenResponse, 'userId'> = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    this.expiresAt = Date.now() + data.expires_in * 1000;
  }

  /**
   * Ensure we have a valid access token, refreshing if necessary.
   */
  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please call authenticate() first.');
    }

    // Refresh if token expires in less than 5 minutes
    if (Date.now() >= this.expiresAt - 5 * 60 * 1000) {
      await this.refreshAccessToken();
    }
  }

  /**
   * Make an authenticated request to the API.
   */
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    await this.ensureValidToken();

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        'User-Agent': 'Android App',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get the authenticated user's profile.
   */
  async getUserProfile(): Promise<UserProfile> {
    const data = await this.request<{ user: UserProfile }>(`${CLIENT_BASE_URL}/users/me`);
    return data.user;
  }

  /**
   * Get device status including heating levels for both sides.
   */
  async getDeviceStatus(deviceId: string): Promise<DeviceStatus> {
    const data = await this.request<{ result: DeviceStatus }>(`${CLIENT_BASE_URL}/devices/${deviceId}`);
    return data.result;
  }

  /**
   * Set heating level for the authenticated user's side.
   * @param level Heating level from -100 (cooling) to 100 (heating)
   * @param durationSec Duration in seconds (0 = indefinite)
   */
  async setHeatingLevel(level: number, durationSec: number): Promise<void> {
    if (!this.userId) {
      throw new Error('User ID not available. Please authenticate first.');
    }

    await this.request(`${APP_BASE_URL}/users/${this.userId}/temperature`, {
      method: 'PUT',
      body: JSON.stringify({
        timeBased: {
          level,
          durationSeconds: durationSec,
        },
        currentLevel: level,
      }),
    });
  }

  /**
   * Get sleep trends for a date range.
   * @param from Start date in YYYY-MM-DD format
   * @param to End date in YYYY-MM-DD format
   * @param tz IANA timezone (e.g., "America/New_York")
   */
  async getSleepTrends(from: string, to: string, tz: string): Promise<SleepDay[]> {
    if (!this.userId) {
      throw new Error('User ID not available. Please authenticate first.');
    }

    const params = new URLSearchParams({
      tz,
      from,
      to,
      'include-main': 'false',
      'include-all-sessions': 'false',
      'model-version': 'v2',
    });

    const data = await this.request<{ result?: { days?: SleepDay[] }; days?: SleepDay[] }>(
      `${CLIENT_BASE_URL}/users/${this.userId}/trends?${params}`
    );

    // Handle different possible response structures
    if (data.result?.days) {
      return data.result.days;
    }
    if (data.days) {
      return data.days;
    }
    return [];
  }
}
