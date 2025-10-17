import type { TokenResponse, UserProfile, DeviceStatus, SleepDay } from './types.js';

const AUTH_BASE_URL = 'https://auth-api.8slp.net/v1';
const CLIENT_BASE_URL = 'https://client-api.8slp.net/v1';
const APP_BASE_URL = 'https://app-api.8slp.net/v1';

const CLIENT_ID = '0894c7f33bb94800a03f1f4df13a4f38';
const CLIENT_SECRET = 'f0954a3ed5763ba3d06834c73731a32f15f168f47d4f164751275def86db0c76';

const DEFAULT_TIMEOUT_MS = 20000;

class SleepApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'SleepApiError';
  }
}

/**
 * Fetch helper with timeout to prevent Workers from hanging.
 * Workers have a 30-second hard timeout, so we bail out at 20 seconds.
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new SleepApiError(`Request timeout after ${timeoutMs}ms: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export interface SleepTokenBundle {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
}

export class SleepClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;
  private userId: string | null = null;

  constructor(initialTokens?: SleepTokenBundle) {
    if (initialTokens) {
      this.applyTokenBundle(initialTokens);
    }
  }

  private applyTokenBundle(bundle: SleepTokenBundle) {
    this.accessToken = bundle.accessToken;
    this.refreshToken = bundle.refreshToken;
    this.userId = bundle.userId;
    this.expiresAt = bundle.expiresAt;
  }

  getTokenBundle(): SleepTokenBundle {
    if (!this.accessToken || !this.refreshToken || !this.userId) {
      throw new Error('Sleep client not authenticated');
    }
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      userId: this.userId,
      expiresAt: this.expiresAt,
    };
  }

  setTokenBundle(bundle: SleepTokenBundle) {
    this.applyTokenBundle(bundle);
  }

  /**
   * Authenticate with sleep API using email and password.
   * Stores access token, refresh token, and userId for subsequent requests.
   */
  async authenticate(email: string, password: string): Promise<SleepTokenBundle> {
    const response = await fetchWithTimeout(`${AUTH_BASE_URL}/tokens`, {
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
      throw new SleepApiError(
        `Authentication failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data: TokenResponse = await response.json();
    this.applyTokenBundle({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      userId: data.userId,
      expiresAt: Date.now() + data.expires_in * 1000,
    });
    return this.getTokenBundle();
  }

  /**
   * Refresh the access token using the stored refresh token.
   */
  private async refreshAccessToken(): Promise<SleepTokenBundle> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available. Please authenticate first.');
    }

    const response = await fetchWithTimeout(`${AUTH_BASE_URL}/tokens`, {
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
      throw new SleepApiError(
        `Token refresh failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data: Omit<TokenResponse, 'userId'> = await response.json();
    if (!this.userId) {
      throw new Error('User ID missing during token refresh');
    }
    this.applyTokenBundle({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      userId: this.userId,
      expiresAt: Date.now() + data.expires_in * 1000,
    });
    return this.getTokenBundle();
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
   * Ensure the token bundle is fresh, refreshing if within the buffer window.
   * Returns the up-to-date token bundle.
   */
  async ensureFreshTokens(bufferMs = 60_000): Promise<SleepTokenBundle> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please call authenticate() first.');
    }

    if (Date.now() >= this.expiresAt - bufferMs) {
      await this.refreshAccessToken();
    }

    return this.getTokenBundle();
  }

  /**
   * Make an authenticated request to the API.
   */
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    await this.ensureValidToken();

    const response = await fetchWithTimeout(url, {
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
      throw new SleepApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status
      );
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
   * Get detailed sleep intervals with stages, biometrics, and timeseries data.
   */
  async getSleepIntervals(): Promise<unknown[]> {
    if (!this.userId) {
      throw new Error('User ID not available. Please authenticate first.');
    }

    const data = await this.request<{ result?: { intervals?: unknown[] }; intervals?: unknown[] }>(
      `${CLIENT_BASE_URL}/users/${this.userId}/intervals`
    );

    // Handle different possible response structures
    if (data.result?.intervals) {
      return data.result.intervals;
    }
    if (data.intervals) {
      return data.intervals;
    }
    return [];
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
