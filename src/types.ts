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
