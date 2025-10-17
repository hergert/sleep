import type { OAuthTokenResponse, WorkoutUserProfile, WorkoutSummary, WorkoutMovement } from './types.js';

const AUTH_BASE_URL = 'https://tonal.auth0.com';
const API_BASE_URL = 'https://api.tonal.com/v6';
const CLIENT_ID = 'ERCyexW-xoVG_Yy3RDe-eV4xsOnRHP6L';

interface AuthenticateOptions {
  username: string;
  password: string;
  clientId?: string;
  scope?: string;
}

export class FitnessClient {
  private idToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt = 0;
  private userId: string | null = null;
  private readonly clientId: string;

  constructor(options?: { clientId?: string; userId?: string }) {
    this.clientId = options?.clientId ?? CLIENT_ID;
    this.userId = options?.userId ?? null;
  }

  async authenticate({ username, password, clientId, scope = 'offline_access' }: AuthenticateOptions): Promise<void> {
    const response = await fetch(`${AUTH_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        client_id: clientId ?? this.clientId,
        grant_type: 'password',
        scope,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Authentication failed';
      try {
        const error = await response.json() as { error_description?: string };
        errorMessage = error.error_description ?? errorMessage;
      } catch {
        // ignore JSON errors
      }
      throw new Error(errorMessage);
    }

    const data: OAuthTokenResponse = await response.json();
    this.idToken = data.id_token;
    this.refreshToken = data.refresh_token;
    this.expiresAt = Date.now() + data.expires_in * 1000;
  }

  getTokens() {
    return {
      idToken: this.idToken,
      refreshToken: this.refreshToken,
      expiresAt: this.expiresAt,
    };
  }

  setTokens(tokens: { idToken: string; refreshToken: string; expiresAt: number; userId?: string }) {
    this.idToken = tokens.idToken;
    this.refreshToken = tokens.refreshToken;
    this.expiresAt = tokens.expiresAt;
    if (tokens.userId) {
      this.userId = tokens.userId;
    }
  }

  private assertAuthenticated() {
    if (!this.idToken) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }
    if (Date.now() >= this.expiresAt - 60_000) {
      throw new Error('Token expired. Please refresh credentials.');
    }
  }

  private async request<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
    this.assertAuthenticated();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...init,
      headers: {
        'Authorization': `Bearer ${this.idToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...init.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const error = await response.json() as { error_description?: string };
        errorMessage = error.error_description ?? errorMessage;
      } catch {
        // ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getUserProfile(): Promise<WorkoutUserProfile> {
    return this.request<WorkoutUserProfile>('/users/userinfo');
  }

  async getWorkouts(offset = 0, limit = 50): Promise<WorkoutSummary[]> {
    return this.request<WorkoutSummary[]>('/workouts', {
      headers: {
        'x-paginate-offset': offset.toString(),
        'x-paginate-limit': limit.toString(),
      },
    });
  }

  async getUserWorkouts(offset = 0, limit = 50): Promise<WorkoutSummary[]> {
    return this.request<WorkoutSummary[]>('/user-workouts', {
      headers: {
        'x-paginate-offset': offset.toString(),
        'x-paginate-limit': limit.toString(),
      },
    });
  }

  async getMovements(): Promise<WorkoutMovement[]> {
    return this.request<WorkoutMovement[]>('/movements');
  }

  async createWorkout(payload: unknown): Promise<unknown> {
    return this.request('/user-workouts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getWorkoutHistories(offset = 0, limit = 50): Promise<WorkoutSummary[]> {
    if (!this.userId) {
      throw new Error('User ID not available. Authenticate first or provide userId in constructor.');
    }
    return this.request<WorkoutSummary[]>(`/users/${this.userId}/workout-summaries`, {
      headers: {
        'x-paginate-offset': offset.toString(),
        'x-paginate-limit': limit.toString(),
      },
    });
  }
}
