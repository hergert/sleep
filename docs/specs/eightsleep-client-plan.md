# Eight Sleep API Client - Plan

**Feature Key:** `eightsleep-client`

## Map TL;DR

**Current state:** Empty TypeScript project. Have complete Eight Sleep API docs (8sleep.md) with OAuth2 auth, user/device endpoints, sleep data, temperature control.

**Primary files:** None exist yet. New greenfield implementation.

## Goal

Build a minimal TypeScript client library for Eight Sleep API that:
- Authenticates via OAuth2 (password grant + token refresh)
- Exposes core operations: user profile, device status, sleep trends, temperature control
- Can be tested with real credentials (manual/integration test)

Keep it dead simple: no frameworks, no over-engineering. Just fetch + JSON.

## Acceptance Checks

1. `npm test` passes (green tests)
2. Can authenticate with real credentials via `CLIENT_TEST_EMAIL` and `CLIENT_TEST_PASSWORD` env vars
3. Can fetch user profile and extract userId/deviceId
4. Can get device heating status (left/right levels)
5. Can set heating level for configured side
6. Can get sleep trends for date range
7. Client auto-refreshes expired access tokens

## Files to Touch

**New files:**
- `package.json` - Node project with vitest/tsx
- `tsconfig.json` - TypeScript config
- `src/client.ts` - Core client class with auth + API methods
- `src/types.ts` - Response/request types matching API docs
- `src/client.test.ts` - Contract tests (integration style, requires real creds)

**Intent:**
- `src/client.ts`: OAuth2 flow, auto-refresh, fetch wrapper, 5-8 public methods (authenticate, getUserProfile, getDeviceStatus, setHeatingLevel, getSleepTrends)
- `src/types.ts`: Minimal interfaces for responses (UserProfile, DeviceStatus, SleepTrends, TokenResponse)
- `src/client.test.ts`: Integration tests using env vars, skipped if creds not present

## Diff Outline (Pseudo-code)

```typescript
// src/client.ts
export class EightSleepClient {
  private accessToken: string | null
  private refreshToken: string | null
  private expiresAt: number
  private userId: string | null

  async authenticate(email: string, password: string): Promise<void>
  private async refreshAccessToken(): Promise<void>
  async getUserProfile(): Promise<UserProfile>
  async getDeviceStatus(deviceId: string): Promise<DeviceStatus>
  async setHeatingLevel(level: number, durationSec: number): Promise<void>
  async getSleepTrends(from: string, to: string, tz: string): Promise<SleepDay[]>
}

// src/types.ts
export interface UserProfile { userId: string; email: string; firstName: string; currentDevice: CurrentDevice }
export interface DeviceStatus { leftHeatingLevel: number; rightHeatingLevel: number; ... }
export interface SleepDay { day: string; score: number; sleepDuration: number; ... }
export interface TokenResponse { access_token: string; refresh_token: string; expires_in: number; userId: string }

// src/client.test.ts
describe('EightSleepClient', () => {
  test('authenticate with real credentials')
  test('getUserProfile returns valid data')
  test('getDeviceStatus returns heating levels')
  test('setHeatingLevel updates temperature')
  test('getSleepTrends returns sleep data')
})
```

## Risks

- **Real credentials in tests:** Mitigate by using env vars, skip tests if not set, document clearly
- **Token expiry during test run:** Auto-refresh logic must work; test will catch
- **API rate limits:** Keep test suite minimal (5-6 tests), run sequentially
- **API changes:** Eight Sleep is unofficial/reverse-engineered; client may break without warning

**Detection:** Tests will fail immediately if API structure changes.

## Test Strategy

**Contract tests only:**
- `src/client.test.ts` contains integration tests that hit real API
- Tests require `CLIENT_TEST_EMAIL` and `CLIENT_TEST_PASSWORD` env vars
- Skip tests if env vars not set (vitest `test.skip()`)
- Test sequence: Auth → GetUser → GetDevice → SetTemp → GetTrends
- Assert status codes, non-null responses, expected field types
- No mocks, no unit tests of private methods (per rule #10)

## Out of Scope

- ❌ CLI tool/binary (just library)
- ❌ Caching layer
- ❌ Mock client for external consumers
- ❌ Advanced features (alarms, priming, away mode) - only if requested
- ❌ Retry/backoff logic (caller's responsibility)
- ❌ README/docs (unless requested)
- ❌ CI/CD setup
