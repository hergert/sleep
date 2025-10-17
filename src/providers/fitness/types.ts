export interface OAuthTokenResponse {
  access_token: string;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: 'Bearer';
  expires_in: number;
}

export interface WorkoutUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  heightInches?: number;
  weightPounds?: number;
  birthday?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface WorkoutSummary {
  id: string;
  totalVolume: number;
  totalTime: number;
  totalMovements: number;
  completedAt: string;
  workout: {
    id: string;
    name: string;
    description?: string;
    difficulty?: string;
    categories?: string[];
  };
  [key: string]: unknown;
}

export interface WorkoutMovement {
  id: string;
  name: string;
  description?: string;
  category?: string;
  equipment?: string[];
  [key: string]: unknown;
}
