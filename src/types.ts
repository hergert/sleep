// OAuth2 token response
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  userId: string;
}

// User profile types
export interface CurrentDevice {
  id: string;
  side: 'left' | 'right';
}

export interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  currentDevice: CurrentDevice;
}

// Device status types
export interface DeviceStatus {
  leftHeatingLevel: number;
  rightHeatingLevel: number;
  leftHeatingDuration: number;
  rightHeatingDuration: number;
  leftNowHeating: boolean;
  rightNowHeating: boolean;
  leftTargetHeatingLevel: number;
  rightTargetHeatingLevel: number;
}

// Sleep trends types
export interface SleepStage {
  stage: string;
  duration: number;
}

export interface SleepDay {
  day: string;
  score: number;
  sleepDuration: number;
  latencyDuration: number;
  outOfBedDuration: number;
  restlessSleep: number;
  lightSleepPercentage: number;
  deepSleepPercentage: number;
  remSleepPercentage: number;
  stages: SleepStage[];
  incomplete: boolean;
}

export interface SleepTrendsResponse {
  days: SleepDay[];
  avgScore?: number;
  avgPresenceDuration?: number;
  avgSleepDuration?: number;
  avgDeepPercent?: number;
  avgTnt?: number;
  modelVersion?: string;
  sfsCalculator?: string;
  sleepFitnessScore?: Record<string, unknown> | null;
  scoreBreakdown?: Record<string, unknown> | null;
  [key: string]: unknown;
}

// Sleep intervals types (partial to preserve shape while remaining flexible)
export interface SleepInterval {
  id: string;
  ts?: string;
  timezone?: string;
  duration?: number;
  stageSummary?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface SleepIntervalsResponse {
  intervals: SleepInterval[];
  next?: string | null;
  [key: string]: unknown;
}
