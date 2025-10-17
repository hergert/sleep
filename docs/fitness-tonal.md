# Tonal API Documentation

**Version:** Reverse-Engineered from Mobile Apps
**Last Updated:** January 2025
**Status:** Unofficial - Not officially supported by Tonal

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [User & Profile](#user--profile)
   - [Workouts](#workouts)
   - [Movements](#movements)
   - [Goals & Training](#goals--training)
4. [Data Models](#data-models)
5. [Workout Structure Reference](#workout-structure-reference)
6. [Error Handling](#error-handling)
7. [Rate Limiting & Best Practices](#rate-limiting--best-practices)

---

## Overview

Tonal provides a single API base URL for all functionality:

| Service     | Base URL                      | Purpose                                   |
| ----------- | ----------------------------- | ----------------------------------------- |
| **API v6**  | `https://api.tonal.com/v6`    | All API operations (user, workouts, etc.) |
| **Auth**    | `https://tonal.auth0.com`     | OAuth2 authentication via Auth0           |

### Standard Headers

All authenticated API requests should include:

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {id_token}
```

---

## Authentication

### OAuth2 via Auth0

Tonal uses Auth0 for authentication with password grant type. The following credentials were reverse-engineered from the mobile apps:

```
Client ID: ERCyexW-xoVG_Yy3RDe-eV4xsOnRHP6L
```

**Note:** No client secret is required for this public client.

### 1. Obtain Access Token

**Endpoint:** `POST /oauth/token`
**Base URL:** `https://tonal.auth0.com`

#### Request

```http
POST /oauth/token HTTP/1.1
Host: tonal.auth0.com
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "user_password",
  "client_id": "ERCyexW-xoVG_Yy3RDe-eV4xsOnRHP6L",
  "grant_type": "password",
  "scope": "offline_access"
}
```

#### Response (200 OK)

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "v1.MRr...",
  "scope": "offline_access",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

#### Response Fields

| Field           | Type    | Description                                            |
| --------------- | ------- | ------------------------------------------------------ |
| `access_token`  | string  | JWT access token (not used directly in API calls)      |
| `id_token`      | string  | JWT ID token - **use this for API authentication**    |
| `refresh_token` | string  | Long-lived token to obtain new tokens                  |
| `expires_in`    | integer | Token lifetime in seconds (typically 86400 = 24 hours) |
| `token_type`    | string  | Always "Bearer"                                        |
| `scope`         | string  | Granted scopes                                         |

**Important:** Use the `id_token` (not `access_token`) for all API requests.

#### Error Response (401 Unauthorized)

```json
{
  "error": "invalid_grant",
  "error_description": "Wrong email or password."
}
```

---

## API Endpoints

### User & Profile

#### Get User Profile

Retrieve comprehensive user information including physical stats, preferences, and device info.

**Endpoint:** `GET /v6/users/userinfo`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
GET /v6/users/userinfo HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
Accept: application/json
```

##### Response (200 OK)

```json
{
  "id": "12345678-1234-1234-1234-123456789abc",
  "createdAt": "2020-01-15T12:00:00Z",
  "updatedAt": "2025-01-10T08:30:00Z",
  "deletedAt": null,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "gender": "MALE",
  "heightInches": 72,
  "weightPounds": 180,
  "auth0Id": "auth0|abc123...",
  "dateOfBirth": "1990-05-20",
  "isGuestAccount": false,
  "isDemoAccount": false,
  "watchedSafetyVideo": true,
  "recentMobileDevice": {
    "deviceId": "device-uuid",
    "tonalDeviceId": "T123456",
    "userId": "user-uuid",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2025-01-10T00:00:00Z",
    "loggedIn": true,
    "postWorkoutNotifs": true,
    "reminderNotifs": true,
    "productUpdateNotifs": true,
    "socialNotifs": true,
    "blogNotifs": false,
    "chatbotNotifs": true,
    "deviceModel": "iPhone14,2",
    "osVersion": "17.2",
    "appVersion": "3.45.0",
    "platform": "ios"
  },
  "emailVerified": true,
  "username": "johndoe",
  "workoutsPerWeek": 4,
  "tonalStatus": "purchased",
  "social": null,
  "profileAssetID": "asset-uuid-or-null",
  "mobileWorkoutsEnabled": true,
  "accountType": "PublicUser",
  "location": "San Francisco, CA",
  "sharingCustomWorkoutsDisabled": false,
  "level": "INTERMEDIATE",
  "goalId": "goal-uuid-primary",
  "goals": [
    {
      "id": "user-goal-uuid-1",
      "userID": "user-uuid",
      "goalID": "goal-uuid-primary",
      "tier": 1
    },
    {
      "id": "user-goal-uuid-2",
      "userID": "user-uuid",
      "goalID": "goal-uuid-secondary",
      "tier": 2
    }
  ],
  "workoutDurationMin": 1800,
  "workoutDurationMax": 3600,
  "updatedPreferencesAt": "2024-12-01T10:00:00Z",
  "primaryDeviceType": "Classic"
}
```

##### Response Fields

| Field                            | Type    | Description                                             |
| -------------------------------- | ------- | ------------------------------------------------------- |
| `id`                             | string  | Unique user identifier (UUID)                           |
| `email`                          | string  | User's email address                                    |
| `firstName`                      | string  | User's first name                                       |
| `lastName`                       | string  | User's last name                                        |
| `gender`                         | string  | Gender: "MALE", "FEMALE", etc.                          |
| `heightInches`                   | integer | Height in inches                                        |
| `weightPounds`                   | integer | Weight in pounds                                        |
| `dateOfBirth`                    | string  | Date of birth (YYYY-MM-DD)                              |
| `level`                          | string  | Fitness level: "BEGINNER", "INTERMEDIATE", "ADVANCED"   |
| `workoutsPerWeek`                | integer | Target workouts per week                                |
| `workoutDurationMin`             | integer | Minimum preferred workout duration (seconds)            |
| `workoutDurationMax`             | integer | Maximum preferred workout duration (seconds)            |
| `tonalStatus`                    | string  | Account status: "purchased", etc.                       |
| `primaryDeviceType`              | string  | Tonal device type: "Classic", etc.                      |
| `recentMobileDevice.platform`    | string  | Mobile platform: "ios" or "android"                     |
| `recentMobileDevice.appVersion`  | string  | Mobile app version                                      |
| `recentMobileDevice.deviceModel` | string  | Device model identifier                                 |
| `goals[].tier`                   | integer | Goal priority: 1=primary, 2=secondary, 3=tertiary       |

---

### Workouts

#### Get User Workouts

Retrieve a paginated list of the user's workouts (both Tonal-created and user-created).

**Endpoint:** `GET /v6/user-workouts`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
GET /v6/user-workouts HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
x-paginate-offset: 0
x-paginate-limit: 50
```

##### Query Parameters

| Parameter | Type    | Required | Description                             |
| --------- | ------- | -------- | --------------------------------------- |
| None      | -       | -        | Uses headers for pagination             |

##### Headers

| Header              | Type    | Required | Description                   |
| ------------------- | ------- | -------- | ----------------------------- |
| `x-paginate-offset` | integer | No       | Starting index (default: 0)   |
| `x-paginate-limit`  | integer | No       | Number of results (max: 50)   |

##### Response (200 OK)

Returns an array of workout objects (see [Workout Data Model](#workout)).

---

#### Get Daily Lifts

Retrieve the user's Daily Lift workouts (Tonal's AI-generated daily recommendations).

**Endpoint:** `GET /v6/user-workouts?types=DailyLift`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
GET /v6/user-workouts?types=DailyLift HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
Time-Zone: America/New_York
AppVersion: 3.45.0
DeviceId: T123456
Accept: */*
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
User-Agent: Tonal/3004226 CFNetwork/3860.100.1 Darwin/24.2.0
```

##### Query Parameters

| Parameter | Type   | Required | Description                          |
| --------- | ------ | -------- | ------------------------------------ |
| `types`   | string | Yes      | Filter by type: "DailyLift"          |

##### Headers

| Header            | Type   | Required | Description                                     |
| ----------------- | ------ | -------- | ----------------------------------------------- |
| `Time-Zone`       | string | Yes      | IANA timezone (e.g., "America/New_York")        |
| `AppVersion`      | string | Yes      | Mobile app version from user device             |
| `DeviceId`        | string | Yes      | Tonal device ID from user device                |
| `User-Agent`      | string | Yes      | Platform-specific user agent string             |

**User-Agent Formats:**
- iOS: `Tonal/{buildNumber} CFNetwork/{version} Darwin/{osVersion}`
- Android: `Tonal/{appVersion}`

##### Response (200 OK)

Returns an array of Daily Lift workout objects.

---

#### Get Workout by ID

Retrieve detailed information about a specific workout.

**Endpoint:** `GET /v6/workouts/{workoutId}`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
GET /v6/workouts/12345678-1234-1234-1234-123456789abc HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
```

##### URL Parameters

| Parameter    | Type   | Required | Description                |
| ------------ | ------ | -------- | -------------------------- |
| `workoutId`  | string | Yes      | Workout UUID               |

##### Response (200 OK)

Returns a single workout object (see [Workout Data Model](#workout)).

---

#### Get Shared Workout

Retrieve a workout that has been shared via URL.

**Endpoint:** `GET /v6/user-workouts/sharing-records/{shareId}`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
GET /v6/user-workouts/sharing-records/abc12345-def6-7890-ghij-klmnopqrstuv HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
```

##### URL Parameters

| Parameter | Type   | Required | Description                                              |
| --------- | ------ | -------- | -------------------------------------------------------- |
| `shareId` | string | Yes      | Share ID extracted from share URL                        |

**Share URL Format:** `https://share.tonal.com/workout/{shareId}`

##### Response (200 OK)

```json
{
  "id": "share-record-uuid",
  "sharerUserId": "user-uuid",
  "parentWorkoutId": "original-workout-uuid",
  "workoutSnapshotId": "snapshot-uuid",
  "workoutSnapshotHash": "hash-string",
  "deepLinkUrl": "https://share.tonal.com/workout/...",
  "workoutSnapshot": {
    // Full workout object (see Workout Data Model)
  }
}
```

---

#### Estimate Workout Duration

Get an estimated duration for a workout based on its sets.

**Endpoint:** `POST /v6/user-workouts/estimate`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
POST /v6/user-workouts/estimate HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
Content-Type: application/json

{
  "sets": [
    {
      "blockStart": true,
      "movementId": "movement-uuid",
      "prescribedReps": 12,
      "dropSet": false,
      "repetition": 1,
      "repetitionTotal": 3,
      "blockNumber": 1,
      "burnout": false,
      "spotter": false,
      "eccentric": false,
      "chains": false,
      "flex": false,
      "warmUp": false,
      "weightPercentage": 100,
      "setGroup": 1,
      "round": 1,
      "description": ""
    }
  ]
}
```

##### Request Body

| Field  | Type  | Required | Description                               |
| ------ | ----- | -------- | ----------------------------------------- |
| `sets` | array | Yes      | Array of set objects (see Set structure)  |

##### Response (200 OK)

```json
{
  "duration": 1842
}
```

##### Response Fields

| Field      | Type    | Description                        |
| ---------- | ------- | ---------------------------------- |
| `duration` | integer | Estimated workout duration (seconds) |

---

#### Create Workout

Create a new custom workout.

**Endpoint:** `POST /v6/user-workouts`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
POST /v6/user-workouts HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
Content-Type: application/json

{
  "title": "My Custom Workout",
  "sets": [
    {
      "blockStart": true,
      "movementId": "eb067021-46de-433c-9262-deea70debde2",
      "prescribedReps": 12,
      "dropSet": false,
      "repetition": 1,
      "repetitionTotal": 3,
      "blockNumber": 1,
      "burnout": false,
      "spotter": true,
      "eccentric": false,
      "chains": false,
      "flex": false,
      "warmUp": false,
      "weightPercentage": 100,
      "setGroup": 1,
      "round": 1,
      "description": ""
    }
  ],
  "createdSource": "WorkoutBuilder",
  "shortDescription": "A great upper body workout",
  "description": "This workout focuses on chest and triceps with compound movements."
}
```

##### Request Body

| Field              | Type   | Required | Description                                                       |
| ------------------ | ------ | -------- | ----------------------------------------------------------------- |
| `title`            | string | Yes      | Workout title                                                     |
| `sets`             | array  | Yes      | Array of set objects                                              |
| `createdSource`    | string | No       | Source: "WorkoutBuilder", "FreeLift", etc. (default: "WorkoutBuilder") |
| `shortDescription` | string | No       | Brief description (default: "")                                   |
| `description`      | string | No       | Full description (default: "")                                    |

##### Response (200 OK)

Returns the created workout object (see [Workout Data Model](#workout)).

---

#### Update Workout

Update an existing custom workout.

**Endpoint:** `PUT /v6/user-workouts/{workoutId}`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
PUT /v6/user-workouts/12345678-1234-1234-1234-123456789abc HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
Content-Type: application/json

{
  "id": "12345678-1234-1234-1234-123456789abc",
  "title": "My Updated Workout Title",
  "description": "Updated description with changes",
  "coachId": "00000000-0000-0000-0000-000000000000",
  "sets": [
    // Updated sets array
  ],
  "level": "INTERMEDIATE",
  "assetId": "asset-uuid",
  "createdSource": "WorkoutBuilder"
}
```

##### Request Body

| Field           | Type   | Required | Description                                  |
| --------------- | ------ | -------- | -------------------------------------------- |
| `id`            | string | Yes      | Workout UUID to update                       |
| `title`         | string | Yes      | Updated workout title                        |
| `description`   | string | No       | Updated description (default: "")            |
| `coachId`       | string | Yes      | Coach UUID (use all zeros for custom)        |
| `sets`          | array  | Yes      | Updated array of set objects                 |
| `level`         | string | No       | Difficulty level                             |
| `assetId`       | string | Yes      | Asset UUID for workout thumbnail/video       |
| `createdSource` | string | No       | Source type                                  |

##### Response (200 OK)

Returns the updated workout object.

---

#### Delete Workout

Delete a custom workout.

**Endpoint:** `DELETE /v6/user-workouts/{workoutId}`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
DELETE /v6/user-workouts/12345678-1234-1234-1234-123456789abc HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
```

##### URL Parameters

| Parameter   | Type   | Required | Description          |
| ----------- | ------ | -------- | -------------------- |
| `workoutId` | string | Yes      | Workout UUID to delete |

##### Response (200 OK)

```json
{}
```

---

### Movements

#### Get All Movements

Retrieve the complete database of available Tonal movements (exercises).

**Endpoint:** `GET /v6/movements`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
GET /v6/movements HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
```

##### Response (200 OK)

Returns an array of movement objects (see [Movement Data Model](#movement)).

```json
[
  {
    "id": "eb067021-46de-433c-9262-deea70debde2",
    "createdAt": "2019-05-01T00:00:00Z",
    "updatedAt": "2024-08-15T00:00:00Z",
    "name": "Barbell Bench Press",
    "shortName": "Bench Press",
    "muscleGroups": ["Chest", "Triceps", "Shoulders"],
    "bodyRegion": "UpperBody",
    "bodyRegionDisplay": "Upper Body",
    "baseOfSupport": "Bench",
    "pushPull": "Push",
    "family": "BenchPress",
    "familyDisplay": "Bench Press",
    "inFreeLift": true,
    "onMachine": true,
    "countReps": true,
    "isTwoSided": true,
    "isBilateral": true,
    "isAlternating": false,
    "offMachineAccessory": "Bench",
    "descriptionHow": "Lie on bench, lower bar to chest, press up",
    "descriptionWhy": "Builds chest strength and size",
    "sortOrder": 100,
    "imageAssetId": "asset-uuid",
    "skillLevel": 2,
    "active": true,
    "featureGroupIds": null,
    "isGeneric": false
  }
]
```

---

### Goals & Training

#### Get Goals

Retrieve available fitness goals.

**Endpoint:** `GET /v6/goals`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
GET /v6/goals HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
```

##### Response (200 OK)

```json
[
  {
    "id": "goal-uuid-1",
    "name": "Build Muscle",
    "description": "Increase muscle mass and size through hypertrophy training",
    "active": true,
    "filterItemId": "filter-uuid"
  },
  {
    "id": "goal-uuid-2",
    "name": "Get Lean",
    "description": "Reduce body fat while maintaining muscle mass",
    "active": true,
    "filterItemId": "filter-uuid"
  }
]
```

---

#### Get Training Effect Goals

Retrieve training effect goals with their relationships (primary, secondary, tertiary).

**Endpoint:** `GET /v6/training-effect-goals`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
GET /v6/training-effect-goals HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
```

##### Response (200 OK)

```json
{
  "goals": [
    {
      "id": "training-goal-uuid-1",
      "name": "Strength",
      "description": "Build maximum force production",
      "active": true,
      "filterItemId": "filter-uuid"
    }
  ],
  "relations": [
    {
      "id": "training-goal-uuid-1",
      "secondary": ["training-goal-uuid-2", "training-goal-uuid-3"],
      "tertiary": ["training-goal-uuid-4"]
    }
  ]
}
```

---

#### Get Training Types

Retrieve all available training types (workout styles).

**Endpoint:** `GET /v6/training-types`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
GET /v6/training-types HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
```

##### Response (200 OK)

```json
[
  {
    "id": "training-type-uuid-1",
    "name": "Strength Training",
    "description": "Build strength with heavy weights and compound movements",
    "assetId": "asset-uuid",
    "infoVidId": "video-uuid",
    "filterItemId": "filter-uuid"
  }
]
```

---

#### Get Goal Metrics

Retrieve metrics associated with training effect goals.

**Endpoint:** `GET /v6/goal-metrics`
**Base URL:** `https://api.tonal.com`
**Authentication:** Required

##### Request

```http
GET /v6/goal-metrics HTTP/1.1
Host: api.tonal.com
Authorization: Bearer {id_token}
```

##### Response (200 OK)

```json
[
  {
    "id": "metric-uuid-1",
    "name": "Volume Load",
    "goalId": "training-goal-uuid-1",
    "description": "Total weight lifted across all sets"
  }
]
```

---

## Data Models

### User Info

```typescript
{
  id: string                    // User UUID
  createdAt: string             // ISO 8601 timestamp
  updatedAt: string             // ISO 8601 timestamp
  deletedAt: string | null      // ISO 8601 timestamp or null
  email: string                 // Email address
  firstName: string             // First name
  lastName: string              // Last name
  gender: string                // "MALE" | "FEMALE" | etc.
  heightInches: number          // Height in inches
  weightPounds: number          // Weight in pounds
  auth0Id: string               // Auth0 user identifier
  dateOfBirth: string           // YYYY-MM-DD format
  isGuestAccount: boolean       // Guest account flag
  isDemoAccount: boolean        // Demo account flag
  watchedSafetyVideo: boolean   // Safety video completion
  recentMobileDevice: {         // Most recent mobile device
    deviceId: string
    tonalDeviceId: string
    userId: string
    createdAt: string
    updatedAt: string
    loggedIn: boolean
    postWorkoutNotifs: boolean
    reminderNotifs: boolean
    productUpdateNotifs: boolean
    socialNotifs: boolean
    blogNotifs: boolean
    chatbotNotifs: boolean
    deviceModel: string         // e.g., "iPhone14,2"
    osVersion: string           // e.g., "17.2"
    appVersion: string          // e.g., "3.45.0"
    platform: string            // "ios" | "android"
  }
  emailVerified: boolean        // Email verification status
  username: string              // Username
  workoutsPerWeek: number       // Target workouts per week
  tonalStatus: string           // "purchased" | etc.
  social: unknown | null        // Social integrations
  profileAssetID: string | null // Profile picture asset UUID
  mobileWorkoutsEnabled: boolean // Mobile workout feature flag
  accountType: string           // "PublicUser" | etc.
  location: string              // User location
  sharingCustomWorkoutsDisabled: boolean
  level: string                 // "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  goalId: string                // Primary goal UUID
  goals: Array<{                // User's selected goals
    id: string                  // User goal relationship UUID
    userID: string              // User UUID
    goalID: string              // Goal UUID
    tier: number                // 1=primary, 2=secondary, 3=tertiary
  }>
  workoutDurationMin: number    // Min duration preference (seconds)
  workoutDurationMax: number    // Max duration preference (seconds)
  updatedPreferencesAt: string  // ISO 8601 timestamp
  primaryDeviceType: string     // "Classic" | "Smart Gym" | etc.
}
```

---

### Workout

```typescript
{
  id: string                       // Workout UUID
  createdAt: string                // ISO 8601 timestamp
  title: string                    // Workout name
  shortDescription: string         // Brief description
  description: string              // Full description
  productionCode: string           // Internal production code
  assetId: string                  // Thumbnail/video asset UUID
  coachId: string                  // Coach UUID (or zeros for custom)
  sets: Array<WorkoutSet>          // Array of sets (see below)
  duration: number                 // Duration in seconds
  publishState: string             // "published" | "archived"
  programId: string | null         // Program UUID if part of program
  level: string                    // Difficulty level
  groupIds: string[]               // Group/category UUIDs
  targetArea: string               // Target body area
  tags: string[] | null            // Workout tags
  bodyRegions: MuscleGroup[]       // Muscle groups worked
  goalIds: string[] | null         // Associated goal UUIDs
  trainingEffectGoals: string[]    // Training effect goal UUIDs
  disableModification: boolean     // Whether workout can be edited
  publishedAt: string              // ISO 8601 timestamp
  localPublishedAt: string         // ISO 8601 timestamp (local time)
  type: string                     // Workout type
  userId: string                   // Creator user UUID
  style: string                    // Workout style
  trainingType: string             // Training type
  trainingTypeIds: string[] | null // Training type UUIDs
  mobileFriendly: boolean          // Mobile compatibility flag
  live: boolean                    // Live class flag
  recoveryWeight: boolean          // Recovery weight flag
  supportedDevices: string[] | null // Device compatibility
  featureGroupIds: string[] | null // Feature group UUIDs
  movementIds: string[]            // Movement UUIDs used
  accessories: string[]            // Required accessories: "Bench", "Handles", etc.
  muscleGroupsForExclusion: MuscleGroup[] | null // Excluded muscle groups
  playbackType: string             // Playback type
  isImported: boolean              // Import flag
  createdSource: string            // "WorkoutBuilder" | "FreeLift" | "DailyLift" | etc.
}
```

---

### Workout Set

```typescript
{
  id: string                    // Set UUID (for existing sets)
  workoutId: string             // Parent workout UUID
  blockStart: boolean           // Marks start of new block
  movementId: string            // Movement UUID
  prescribedReps: number        // Target rep count (rep-based exercises)
  repetition: number            // Current repetition number
  repetitionTotal: number       // Total repetitions of this set
  blockNumber: number           // Block number (1-indexed)
  burnout: boolean              // Burnout set flag
  spotter: boolean              // Requires spotter flag
  eccentric: boolean            // Eccentric emphasis flag
  chains: boolean               // Uses chains modifier
  skipSetup: boolean            // Skip setup instruction
  skipDemo: boolean             // Skip demo video
  finalSet: boolean             // Last set in workout
  calibration: boolean          // Calibration set flag
  practice: boolean             // Practice set flag
  flex: boolean                 // Flex mode flag
  progressive: boolean          // Progressive overload flag
  weightPercentage: number      // Weight as percentage (0-100)
  warmUp: boolean               // Warm-up set flag
  durationBasedRepGoal: number  // Duration in seconds (time-based exercises)
  setGroup: number              // Set group number within block
  round: number                 // Round number
  description: string           // Custom set description
  dropSet: boolean              // Drop set flag
  prescribedDuration: number    // Duration in seconds (alternative field)
}
```

---

### Movement

```typescript
{
  id: string                    // Movement UUID
  createdAt: string             // ISO 8601 timestamp
  updatedAt: string             // ISO 8601 timestamp
  name: string                  // Full movement name
  shortName: string             // Abbreviated name
  muscleGroups: MuscleGroup[]   // Primary muscle groups worked
  bodyRegion: string            // Body region code
  bodyRegionDisplay: string     // Body region display name
  baseOfSupport: string         // Support type: "Bench", "Floor", etc.
  pushPull: string              // "Push" | "Pull" | "Hybrid"
  family: string                // Movement family code
  familyDisplay: string         // Movement family display name
  inFreeLift: boolean           // Available in Free Lift mode
  onMachine: boolean            // Can be done on Tonal machine
  countReps: boolean            // Rep-based (vs time-based)
  isTwoSided: boolean           // Bilateral movement
  isBilateral: boolean          // Uses both arms/legs simultaneously
  isAlternating: boolean        // Alternating sides flag
  offMachineAccessory: string   // Required accessory name
  descriptionHow: string        // How to perform movement
  descriptionWhy: string        // Benefits of movement
  sortOrder: number             // Display sort order
  imageAssetId: string          // Image asset UUID
  skillLevel: number            // Skill level: 1=beginner, 2=intermediate, 3=advanced
  active: boolean               // Active/available flag
  featureGroupIds: string[] | null // Feature group UUIDs
  isGeneric: boolean            // Generic movement template flag
}
```

---

### Muscle Groups

```typescript
type MuscleGroup =
  | 'Obliques'
  | 'Abs'
  | 'Shoulders'
  | 'Glutes'
  | 'Back'
  | 'Biceps'
  | 'Quads'
  | 'Triceps'
  | 'Chest'
  | 'Hamstrings'
  | 'Calves'
  | 'Forearms'
```

---

### Goal

```typescript
{
  id: string                    // Goal UUID
  name: string                  // Goal name
  description: string           // Goal description
  active: boolean               // Active/available flag
  filterItemId: string          // Filter item UUID
}
```

---

### Training Effect Goal

```typescript
{
  id: string                    // Training goal UUID
  name: string                  // Goal name
  description: string           // Goal description
  active: boolean               // Active flag
  filterItemId: string          // Filter item UUID
}
```

---

### Training Type

```typescript
{
  id: string                    // Training type UUID
  name: string                  // Type name
  description: string           // Type description
  assetId: string               // Asset UUID for thumbnail/icon
  infoVidId: string             // Info video UUID
  filterItemId: string          // Filter item UUID
}
```

---

### Goal Metric

```typescript
{
  id: string                    // Metric UUID
  name: string                  // Metric name
  goalId: string                // Associated training goal UUID
  description: string           // Metric description
}
```

---

## Workout Structure Reference

### Understanding Workout Organization

Workouts are organized hierarchically:

```
Workout
├── Block 1 (blockNumber: 1)
│   ├── Set Group 1 (setGroup: 1)
│   │   ├── Set 1 (repetition: 1, repetitionTotal: 3, blockStart: true)
│   │   ├── Set 2 (repetition: 2, repetitionTotal: 3, blockStart: false)
│   │   └── Set 3 (repetition: 3, repetitionTotal: 3, blockStart: false)
│   └── Set Group 2 (setGroup: 2)
│       └── Set 1 (repetition: 1, repetitionTotal: 1)
└── Block 2 (blockNumber: 2)
    └── Set Group 1 (setGroup: 1)
        └── ...
```

### Key Set Properties

#### Block Organization
- **`blockNumber`**: Sequential block number (1, 2, 3, ...)
- **`blockStart`**: `true` for first set in block, `false` for others
- **`round`**: Round number within block (typically 1)

#### Set Repetitions
- **`setGroup`**: Group number within block (1, 2, 3, ...)
- **`repetition`**: Current repetition (1, 2, 3, ...)
- **`repetitionTotal`**: Total repetitions for this set group

#### Exercise Configuration
- **Rep-based**: Set `prescribedReps` (e.g., 12 reps)
- **Time-based**: Set `durationBasedRepGoal` or `prescribedDuration` (in seconds)

#### Modifiers
- **`burnout`**: Push to failure
- **`eccentric`**: Slower eccentric (lowering) phase
- **`chains`**: Variable resistance using chains
- **`spotter`**: Requires spotter assistance
- **`dropSet`**: Reduce weight mid-set
- **`warmUp`**: Warm-up set (lighter weight)

#### Weight Settings
- **`weightPercentage`**: Weight as percentage of user's max (0-100)
  - 100 = user's working weight
  - 75 = 75% of working weight (often used for warm-ups)
  - 120 = 120% of working weight (advanced users)

### Example: Simple 2-Block Workout

```json
{
  "sets": [
    // Block 1, Set Group 1: Bench Press (3 sets x 12 reps)
    {
      "blockStart": true,
      "movementId": "eb067021-46de-433c-9262-deea70debde2",
      "prescribedReps": 12,
      "repetition": 1,
      "repetitionTotal": 3,
      "blockNumber": 1,
      "setGroup": 1,
      "weightPercentage": 100,
      "burnout": false,
      "spotter": true,
      "eccentric": false,
      "chains": false,
      "warmUp": false,
      "dropSet": false,
      "round": 1,
      "description": ""
    },
    // Block 1, Set Group 2: Tricep Extension (2 sets x 15 reps)
    {
      "blockStart": false,
      "movementId": "1f5e8776-3b9c-4fe7-80d1-75b5b28a4455",
      "prescribedReps": 15,
      "repetition": 1,
      "repetitionTotal": 2,
      "blockNumber": 1,
      "setGroup": 2,
      "weightPercentage": 100,
      "burnout": true,
      "spotter": false,
      "eccentric": false,
      "chains": false,
      "warmUp": false,
      "dropSet": false,
      "round": 1,
      "description": ""
    },
    // Block 2, Set Group 1: Plank (time-based, 30 seconds)
    {
      "blockStart": true,
      "movementId": "b11f89b0-5470-44a2-b70a-5391e972eb71",
      "durationBasedRepGoal": 30,
      "repetition": 1,
      "repetitionTotal": 1,
      "blockNumber": 2,
      "setGroup": 1,
      "weightPercentage": 0,
      "burnout": false,
      "spotter": false,
      "eccentric": false,
      "chains": false,
      "warmUp": false,
      "dropSet": false,
      "round": 1,
      "description": ""
    }
  ]
}
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Meaning               | Common Causes                             |
| ----------- | --------------------- | ----------------------------------------- |
| 200         | Success               | Request completed successfully            |
| 400         | Bad Request           | Invalid request body or parameters        |
| 401         | Unauthorized          | Invalid or expired token                  |
| 403         | Forbidden             | Insufficient permissions                  |
| 404         | Not Found             | Resource does not exist                   |
| 429         | Too Many Requests     | Rate limit exceeded                       |
| 500         | Internal Server Error | Server-side error                         |
| 503         | Service Unavailable   | Tonal API is down                         |

### Error Response Format

```json
{
  "error": "error_code",
  "error_description": "Human-readable error message"
}
```

### Common Errors

#### Authentication Errors

**Invalid Credentials**
```json
{
  "error": "invalid_grant",
  "error_description": "Wrong email or password."
}
```

**Expired Token**
```json
{
  "error": "invalid_token",
  "error_description": "Token has expired"
}
```

#### API Errors

**Resource Not Found**
```json
{
  "error": "Not Found",
  "error_description": "Workout not found"
}
```

**Invalid Request**
```json
{
  "error": "Bad Request",
  "error_description": "Workout title is required"
}
```

---

## Rate Limiting & Best Practices

### Rate Limits

Tonal does not publicly document rate limits, but based on observed behavior:

- **Authentication:** ~10 requests per minute
- **Data Retrieval:** ~120 requests per minute
- **Workout Creation/Updates:** ~30 requests per minute

**Recommendation:** Implement exponential backoff when receiving 429 responses.

### Best Practices

#### 1. Token Management

- **Cache tokens** - ID tokens are valid for 24 hours
- **Proactively refresh** - Refresh tokens ~1 hour before expiry
- **Use id_token** - Always use `id_token` (not `access_token`) for API calls
- **Store securely** - Encrypt stored tokens

#### 2. API Usage

- **Cache reference data** - Goals, movements, and training types change rarely
- **Paginate workouts** - Use pagination headers for large workout lists
- **Batch operations** - Group related API calls when possible
- **Respect user preferences** - Use timezone from user profile for time-based queries

#### 3. Error Handling

- **Implement retries** - Retry failed requests with exponential backoff
- **Validate inputs** - Check required fields before API calls
- **Handle timeouts** - Default 30-second timeout is recommended
- **Log errors** - Capture error details for debugging

#### 4. Workout Creation

- **Validate movements** - Ensure movement IDs exist before creating workouts
- **Use estimates** - Call estimate endpoint before creation to preview duration
- **Provide descriptions** - Add meaningful titles and descriptions for user context
- **Set proper sources** - Use appropriate `createdSource` values

#### 5. Daily Lifts

- **Use device headers** - Include device-specific headers from user profile
- **Specify timezone** - Always provide accurate timezone for correct date filtering
- **Match user agent** - Use platform-appropriate user agent format

### Example: Exponential Backoff

```typescript
async function apiCallWithRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }

      // Don't retry client errors (400-499)
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        throw error
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}
```

### Example: Token Refresh Check

```typescript
class TokenManager {
  private idToken: string = ''
  private expiresAt: number = 0

  isTokenValid(): boolean {
    // Check if token exists and has more than 1 minute remaining
    return !!this.idToken && Date.now() < this.expiresAt - 60000
  }

  async getValidToken(): Promise<string> {
    if (!this.isTokenValid()) {
      await this.authenticate()
    }
    return this.idToken
  }
}
```

---

## Security Considerations

### Important Warnings

⚠️ **This API is reverse-engineered and not officially supported by Tonal**

- Using this API may violate Tonal's Terms of Service
- Tonal could block access or suspend accounts at any time
- API structure and authentication may change without notice
- No guarantees of data privacy or security

### Secure Integration

If you choose to integrate with this API:

1. **Protect credentials** - Never hardcode or expose user passwords
2. **Secure token storage** - Store tokens encrypted at rest
3. **Use HTTPS** - All API communication uses HTTPS, do not downgrade
4. **Limit scope** - Only request data you need
5. **Personal use only** - Do not build commercial services on this API
6. **Monitor for changes** - Be prepared for API changes or deprecation
7. **Respect rate limits** - Avoid excessive API calls
8. **Handle errors gracefully** - Don't expose sensitive error details to end users

---

## Example Code

### TypeScript Authentication Example

```typescript
import fetch from 'node-fetch'

interface OAuthTokenResponse {
  access_token: string
  id_token: string
  refresh_token: string
  scope: string
  token_type: string
  expires_in: number
}

class TonalAPI {
  private readonly authUrl = 'https://tonal.auth0.com/oauth/token'
  private readonly apiUrl = 'https://api.tonal.com/v6'
  private readonly clientId = 'ERCyexW-xoVG_Yy3RDe-eV4xsOnRHP6L'

  private idToken: string = ''
  private expiresAt: number = 0

  async authenticate(username: string, password: string): Promise<void> {
    const response = await fetch(this.authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        client_id: this.clientId,
        grant_type: 'password',
        scope: 'offline_access',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error_description || 'Authentication failed')
    }

    const data: OAuthTokenResponse = await response.json()
    this.idToken = data.id_token
    this.expiresAt = Date.now() + (data.expires_in * 1000)
  }

  private isTokenValid(): boolean {
    return !!this.idToken && Date.now() < this.expiresAt - 60000
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.isTokenValid()) {
      throw new Error('Token expired. Call authenticate() first.')
    }

    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.idToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error_description || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getUserInfo() {
    return this.request('/users/userinfo')
  }

  async getUserWorkouts(offset: number = 0, limit: number = 50) {
    return this.request('/user-workouts', {
      headers: {
        'x-paginate-offset': offset.toString(),
        'x-paginate-limit': limit.toString(),
      },
    })
  }

  async getMovements() {
    return this.request('/movements')
  }

  async createWorkout(workoutData: any) {
    return this.request('/user-workouts', {
      method: 'POST',
      body: JSON.stringify(workoutData),
    })
  }
}

// Usage
const api = new TonalAPI()
await api.authenticate('user@example.com', 'password')

const userInfo = await api.getUserInfo()
console.log(`Welcome ${userInfo.firstName}!`)

const workouts = await api.getUserWorkouts()
console.log(`You have ${workouts.length} workouts`)
```

---

## Changelog

### Version History

- **January 2025** - Initial comprehensive documentation
  - Reverse-engineered from Tonal mobile apps (iOS & Android)
  - Client ID extracted from Auth0 configuration
  - API endpoints discovered through network traffic analysis
  - Type definitions derived from response schemas
  - Workout structure analyzed from example code

---

## Disclaimer

This documentation is based on reverse-engineering Tonal mobile applications and is provided for educational purposes only. This is **not an official API** and is **not supported or endorsed by Tonal Systems, Inc.**

**Use at your own risk.** Tonal may change their API at any time without notice, breaking integrations. Using this API may violate Tonal's Terms of Service and could result in account suspension.

For official integrations, contact Tonal directly for their supported API program (if available).

---

## Contributing

If you discover new endpoints, parameters, or corrections to this documentation, please contribute back to the community by updating this document.

---

## License

This documentation is provided as-is under MIT License. The Tonal API itself is proprietary and owned by Tonal Systems, Inc.

---

## References

- **TypeScript Client Library:** [ts-tonal-client](https://github.com/dlwiest/ts-tonal-client) by Derrick Wiest
- **Tonal Official Website:** [tonal.com](https://www.tonal.com)
- **Auth0 Documentation:** [auth0.com/docs](https://auth0.com/docs)
