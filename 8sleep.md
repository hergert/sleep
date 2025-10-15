# Eight Sleep API Documentation

**Version:** Reverse-Engineered from Android App
**Last Updated:** October 2024
**Status:** Unofficial - Not officially supported by Eight Sleep

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [User & Profile](#user--profile)
   - [Sleep Data & Analytics](#sleep-data--analytics)
   - [Device Control](#device-control)
   - [Temperature Management](#temperature-management)
   - [Alarms & Routines](#alarms--routines)
4. [Data Models](#data-models)
5. [Temperature Scale Reference](#temperature-scale-reference)
6. [Error Handling](#error-handling)
7. [Rate Limiting & Best Practices](#rate-limiting--best-practices)

---

## Overview

Eight Sleep provides three API base URLs for different functionality:

| Service        | Base URL                         | Purpose                                |
| -------------- | -------------------------------- | -------------------------------------- |
| **Auth API**   | `https://auth-api.8slp.net/v1`   | Authentication & token management      |
| **Client API** | `https://client-api.8slp.net/v1` | User profiles, sleep data, device info |
| **App API**    | `https://app-api.8slp.net/v1`    | Device control, temperature, alarms    |

### Standard Headers

All authenticated API requests should include:

```http
Content-Type: application/json
Accept: application/json
Accept-Encoding: gzip
User-Agent: Android App
Connection: keep-alive
Host: app-api.8slp.net
Authorization: Bearer {access_token}
```

---

## Authentication

### OAuth2 Credentials

Eight Sleep uses OAuth2 with password grant type. The following credentials were reverse-engineered from the Android app:

```
Client ID:     0894c7f33bb94800a03f1f4df13a4f38
Client Secret: f0954a3ed5763ba3d06834c73731a32f15f168f47d4f164751275def86db0c76
```

### 1. Obtain Access Token

**Endpoint:** `POST /v1/tokens`
**Base URL:** `https://auth-api.8slp.net`

#### Request

```http
POST /v1/tokens HTTP/1.1
Host: auth-api.8slp.net
Content-Type: application/json
Accept: application/json
User-Agent: Android App

{
  "client_id": "0894c7f33bb94800a03f1f4df13a4f38",
  "client_secret": "f0954a3ed5763ba3d06834c73731a32f15f168f47d4f164751275def86db0c76",
  "grant_type": "password",
  "username": "user@example.com",
  "password": "user_password"
}
```

#### Response (200 OK)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "a1b2c3d4e5f6g7h8i9j0...",
  "expires_in": 3600,
  "token_type": "Bearer",
  "userId": "1234567890abcdef"
}
```

#### Response Fields

| Field           | Type    | Description                                         |
| --------------- | ------- | --------------------------------------------------- |
| `access_token`  | string  | JWT access token for API authentication             |
| `refresh_token` | string  | Long-lived token to obtain new access tokens        |
| `expires_in`    | integer | Token lifetime in seconds (typically 3600 = 1 hour) |
| `token_type`    | string  | Always "Bearer"                                     |
| `userId`        | string  | Unique user identifier                              |

#### Error Response (401 Unauthorized)

```json
{
  "error": "invalid_grant",
  "error_description": "Invalid credentials"
}
```

---

### 2. Refresh Access Token

**Endpoint:** `POST /v1/tokens`
**Base URL:** `https://auth-api.8slp.net`

#### Request

```http
POST /v1/tokens HTTP/1.1
Host: auth-api.8slp.net
Content-Type: application/json

{
  "client_id": "0894c7f33bb94800a03f1f4df13a4f38",
  "client_secret": "f0954a3ed5763ba3d06834c73731a32f15f168f47d4f164751275def86db0c76",
  "grant_type": "refresh_token",
  "refresh_token": "a1b2c3d4e5f6g7h8i9j0..."
}
```

#### Response (200 OK)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "x9y8z7w6v5u4t3s2r1q0...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

**Note:** The `userId` field is not returned in refresh responses. You must store it from the initial authentication.

---

## API Endpoints

### User & Profile

#### Get User Profile

Retrieve user information, device list, and current device settings.

**Endpoint:** `GET /v1/users/me`
**Base URL:** `https://client-api.8slp.net`
**Authentication:** Required

##### Request

```http
GET /v1/users/me HTTP/1.1
Host: client-api.8slp.net
Authorization: Bearer {access_token}
Accept: application/json
```

##### Response (200 OK)

```json
{
  "user": {
    "userId": "1234567890abcdef",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "gender": "male",
    "dob": "1990-01-15",
    "zip": 94102,
    "emailVerified": true,
    "createdAt": "2020-01-01T00:00:00.000Z",
    "tempPreference": "neutral",
    "tempPreferenceUpdatedAt": "2024-01-01T00:00:00.000Z",
    "devices": ["device-id-12345"],
    "currentDevice": {
      "id": "device-id-12345",
      "side": "left",
      "timeZone": "America/Los_Angeles"
    },
    "sleepTracking": {
      "enabledSince": "2020-01-01T00:00:00.000Z"
    },
    "features": ["autopilot", "smart_alarm"],
    "autopilotEnabled": true,
    "experimentalFeatures": false,
    "hotelGuest": false,
    "sharingMetricsTo": [],
    "sharingMetricsFrom": [],
    "notifications": {
      "email": true,
      "push": true
    }
  }
}
```

##### Response Fields

| Field                    | Type    | Description                                  |
| ------------------------ | ------- | -------------------------------------------- |
| `userId`                 | string  | Unique user identifier                       |
| `email`                  | string  | User's email address                         |
| `firstName`              | string  | User's first name                            |
| `lastName`               | string  | User's last name                             |
| `gender`                 | string  | User's gender                                |
| `dob`                    | string  | Date of birth (ISO 8601)                     |
| `devices`                | array   | List of device IDs owned by user             |
| `currentDevice.id`       | string  | Currently selected device ID                 |
| `currentDevice.side`     | string  | Current bed side: "left", "right", or "solo" |
| `currentDevice.timeZone` | string  | User's timezone (IANA format)                |
| `autopilotEnabled`       | boolean | Whether Autopilot feature is enabled         |

---

#### Get Device List

Returns only the list of devices owned by the user.

**Endpoint:** `GET /v1/users/me`
**Base URL:** `https://client-api.8slp.net`
**Authentication:** Required

This is the same endpoint as Get User Profile, but you extract only the `user.devices` array.

##### Response

```json
{
  "user": {
    "devices": ["device-id-12345", "device-id-67890"]
  }
}
```

---

#### Set Bed Side

Switch between left and right side of the mattress.

**Endpoint:** `PUT /v1/users/{userId}/current-device`
**Base URL:** `https://client-api.8slp.net`
**Authentication:** Required

##### Request

```http
PUT /v1/users/1234567890abcdef/current-device HTTP/1.1
Host: client-api.8slp.net
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "id": "device-id-12345",
  "side": "right"
}
```

##### Request Body

| Field  | Type   | Required | Values                  | Description          |
| ------ | ------ | -------- | ----------------------- | -------------------- |
| `id`   | string | Yes      | -                       | Device ID            |
| `side` | string | Yes      | "left", "right", "solo" | Bed side to activate |

##### Response (200 OK)

```json
{}
```

---

### Sleep Data & Analytics

#### Get Sleep Trends

Retrieve aggregated sleep data over a date range.

**Endpoint:** `GET /v1/users/{userId}/trends`
**Base URL:** `https://client-api.8slp.net`
**Authentication:** Required

##### Request

```http
GET /v1/users/1234567890abcdef/trends?tz=America%2FNew_York&from=2024-01-01&to=2024-01-07&include-main=false&include-all-sessions=false&model-version=v2 HTTP/1.1
Host: client-api.8slp.net
Authorization: Bearer {access_token}
```

##### Query Parameters

| Parameter              | Type   | Required | Description                              |
| ---------------------- | ------ | -------- | ---------------------------------------- |
| `tz`                   | string | Yes      | IANA timezone (e.g., "America/New_York") |
| `from`                 | string | Yes      | Start date in YYYY-MM-DD format          |
| `to`                   | string | Yes      | End date in YYYY-MM-DD format            |
| `include-main`         | string | No       | "true" or "false" (default: false)       |
| `include-all-sessions` | string | No       | "true" or "false" (default: false)       |
| `model-version`        | string | Yes      | "v2" (recommended)                       |

##### Response (200 OK)

```json
{
  "result": {
    "days": [
      {
        "day": "2024-01-01",
        "score": 85,
        "sleepDuration": 28800,
        "presenceStart": "2024-01-01T22:30:00.000Z",
        "presenceEnd": "2024-01-02T06:30:00.000Z",
        "sleepQualityScore": {
          "total": 88,
          "sleepDurationSeconds": {
            "score": 90
          },
          "hrv": {
            "current": 45
          },
          "respiratoryRate": {
            "current": 14.5
          }
        },
        "sleepRoutineScore": {
          "total": 82,
          "latencyAsleepSeconds": {
            "score": 85
          },
          "latencyOutSeconds": {
            "score": 88
          },
          "wakeupConsistency": {
            "score": 75
          },
          "heartRate": {
            "current": 58
          }
        }
      }
    ]
  }
}
```

##### Response Fields

| Field                                          | Type    | Description                          |
| ---------------------------------------------- | ------- | ------------------------------------ |
| `day`                                          | string  | Date in YYYY-MM-DD format            |
| `score`                                        | integer | Overall sleep score (0-100)          |
| `sleepDuration`                                | integer | Total sleep duration in seconds      |
| `presenceStart`                                | string  | When user got into bed (ISO 8601)    |
| `presenceEnd`                                  | string  | When user got out of bed (ISO 8601)  |
| `sleepQualityScore.total`                      | integer | Sleep quality score (0-100)          |
| `sleepQualityScore.hrv.current`                | float   | Heart Rate Variability in ms         |
| `sleepQualityScore.respiratoryRate.current`    | float   | Breaths per minute                   |
| `sleepRoutineScore.heartRate.current`          | float   | Average heart rate (BPM)             |
| `sleepRoutineScore.latencyAsleepSeconds.score` | integer | How quickly user fell asleep (score) |

---

#### Get Sleep Intervals

Retrieve detailed sleep session data including stages, heart rate, and temperature timeseries.

**Endpoint:** `GET /v1/users/{userId}/intervals`
**Base URL:** `https://client-api.8slp.net`
**Authentication:** Required

##### Request

```http
GET /v1/users/1234567890abcdef/intervals HTTP/1.1
Host: client-api.8slp.net
Authorization: Bearer {access_token}
```

##### Response (200 OK)

```json
{
  "result": {
    "intervals": [
      {
        "id": "interval-abc123",
        "ts": "2024-01-01T22:30:00.000Z",
        "score": 85,
        "incomplete": false,
        "stages": [
          {
            "stage": "awake",
            "duration": 600
          },
          {
            "stage": "light",
            "duration": 3600
          },
          {
            "stage": "deep",
            "duration": 7200
          },
          {
            "stage": "rem",
            "duration": 5400
          }
        ],
        "timeseries": {
          "tnt": [
            ["2024-01-01T22:30:00.000Z", 0],
            ["2024-01-01T22:35:00.000Z", 2],
            ["2024-01-01T22:40:00.000Z", 1]
          ],
          "tempBedC": [
            ["2024-01-01T22:30:00.000Z", 22.5],
            ["2024-01-01T22:35:00.000Z", 22.3],
            ["2024-01-01T22:40:00.000Z", 22.1]
          ],
          "tempRoomC": [
            ["2024-01-01T22:30:00.000Z", 20.0],
            ["2024-01-01T22:35:00.000Z", 19.8]
          ],
          "respiratoryRate": [
            ["2024-01-01T22:30:00.000Z", 14.5],
            ["2024-01-01T22:35:00.000Z", 14.2]
          ],
          "heartRate": [
            ["2024-01-01T22:30:00.000Z", 58],
            ["2024-01-01T22:35:00.000Z", 56]
          ]
        }
      }
    ]
  }
}
```

##### Response Fields

| Field                        | Type    | Description                                         |
| ---------------------------- | ------- | --------------------------------------------------- |
| `id`                         | string  | Unique interval identifier                          |
| `ts`                         | string  | Interval start timestamp (ISO 8601)                 |
| `score`                      | integer | Sleep score for this interval (0-100)               |
| `incomplete`                 | boolean | Whether the session is still in progress            |
| `stages[].stage`             | string  | Sleep stage: "awake", "light", "deep", "rem", "out" |
| `stages[].duration`          | integer | Duration in seconds                                 |
| `timeseries.tnt`             | array   | Toss & Turn data [timestamp, movement_count]        |
| `timeseries.tempBedC`        | array   | Bed temperature in Celsius [timestamp, temp]        |
| `timeseries.tempRoomC`       | array   | Room temperature in Celsius [timestamp, temp]       |
| `timeseries.respiratoryRate` | array   | Breaths per minute [timestamp, rate]                |
| `timeseries.heartRate`       | array   | Heart rate in BPM [timestamp, bpm]                  |

---

### Device Control

#### Get Device Status

Retrieve current heating status for both sides of the mattress.

**Endpoint:** `GET /v1/devices/{deviceId}`
**Base URL:** `https://client-api.8slp.net`
**Authentication:** Required

##### Request

```http
GET /v1/devices/device-id-12345 HTTP/1.1
Host: client-api.8slp.net
Authorization: Bearer {access_token}
```

##### Response (200 OK)

```json
{
  "result": {
    "deviceId": "device-id-12345",
    "leftHeatingLevel": -20,
    "leftTargetHeatingLevel": -20,
    "leftNowHeating": true,
    "leftHeatingDuration": 3600,
    "rightHeatingLevel": 10,
    "rightTargetHeatingLevel": 10,
    "rightNowHeating": false,
    "rightHeatingDuration": 0
  }
}
```

##### Response Fields

| Field                     | Type    | Description                                        |
| ------------------------- | ------- | -------------------------------------------------- |
| `deviceId`                | string  | Device identifier                                  |
| `leftHeatingLevel`        | integer | Current heating level for left side (-100 to 100)  |
| `leftTargetHeatingLevel`  | integer | Target heating level for left side                 |
| `leftNowHeating`          | boolean | Whether left side is actively heating              |
| `leftHeatingDuration`     | integer | Remaining heating duration in seconds              |
| `rightHeatingLevel`       | integer | Current heating level for right side (-100 to 100) |
| `rightTargetHeatingLevel` | integer | Target heating level for right side                |
| `rightNowHeating`         | boolean | Whether right side is actively heating             |
| `rightHeatingDuration`    | integer | Remaining heating duration in seconds              |

---

#### Prime Pod

Start the pod priming process (water circulation).

**Endpoint:** `POST /v1/devices/{deviceId}/priming/tasks`
**Base URL:** `https://app-api.8slp.net`
**Authentication:** Required

##### Request

```http
POST /v1/devices/device-id-12345/priming/tasks HTTP/1.1
Host: app-api.8slp.net
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "notifications": {
    "users": ["1234567890abcdef"],
    "meta": "rePriming"
  }
}
```

##### Request Body

| Field                 | Type   | Required | Description                |
| --------------------- | ------ | -------- | -------------------------- |
| `notifications.users` | array  | Yes      | List of user IDs to notify |
| `notifications.meta`  | string | Yes      | Should be "rePriming"      |

##### Response (200 OK)

```json
{}
```

---

### Temperature Management

#### Get Temperature Settings

Retrieve current temperature configuration and state.

**Endpoint:** `GET /v1/users/{userId}/temperature`
**Base URL:** `https://app-api.8slp.net`
**Authentication:** Required

##### Request

```http
GET /v1/users/1234567890abcdef/temperature HTTP/1.1
Host: app-api.8slp.net
Authorization: Bearer {access_token}
```

##### Response (200 OK)

```json
{
  "result": {
    "currentLevel": -20,
    "currentDeviceLevel": -20,
    "currentState": {
      "type": "smart"
    },
    "smart": {
      "bedTimeLevel": -10,
      "initialSleepLevel": -20,
      "finalSleepLevel": 5
    }
  }
}
```

##### Response Fields

| Field                     | Type    | Description                                 |
| ------------------------- | ------- | ------------------------------------------- |
| `currentLevel`            | integer | Current heating level (-100 to 100)         |
| `currentDeviceLevel`      | integer | Device-reported heating level               |
| `currentState.type`       | string  | "smart" (on) or "off"                       |
| `smart.bedTimeLevel`      | integer | Pre-heating level before bed                |
| `smart.initialSleepLevel` | integer | Level for initial sleep phase               |
| `smart.finalSleepLevel`   | integer | Level for final sleep phase (before waking) |

---

#### Set Heating Level (Time-Based)

Set a specific heating level for a duration.

**Endpoint:** `PUT /v1/users/{userId}/temperature`
**Base URL:** `https://app-api.8slp.net`
**Authentication:** Required

##### Request

```http
PUT /v1/users/1234567890abcdef/temperature HTTP/1.1
Host: app-api.8slp.net
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "timeBased": {
    "level": -20,
    "durationSeconds": 3600
  },
  "currentLevel": -20
}
```

##### Request Body

| Field                       | Type    | Required | Description                          |
| --------------------------- | ------- | -------- | ------------------------------------ |
| `timeBased.level`           | integer | Yes      | Heating level (-100 to 100)          |
| `timeBased.durationSeconds` | integer | Yes      | Duration in seconds (0 = indefinite) |
| `currentLevel`              | integer | Yes      | Should match `timeBased.level`       |

##### Response (200 OK)

```json
{}
```

---

#### Set Smart Heating Levels

Configure heating levels for different sleep stages.

**Endpoint:** `PUT /v1/users/{userId}/temperature`
**Base URL:** `https://app-api.8slp.net`
**Authentication:** Required

##### Request

First, GET the current smart levels, then PUT the modified levels.

```http
PUT /v1/users/1234567890abcdef/temperature HTTP/1.1
Host: app-api.8slp.net
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "smart": {
    "bedTimeLevel": -10,
    "initialSleepLevel": -25,
    "finalSleepLevel": 0
  }
}
```

##### Request Body

| Field                     | Type    | Required | Description                        |
| ------------------------- | ------- | -------- | ---------------------------------- |
| `smart.bedTimeLevel`      | integer | Yes      | Level before bedtime (-100 to 100) |
| `smart.initialSleepLevel` | integer | Yes      | Level for initial sleep phase      |
| `smart.finalSleepLevel`   | integer | Yes      | Level for final sleep phase        |

##### Response (200 OK)

```json
{}
```

---

#### Turn Side On (Smart Mode)

Enable heating for the user's side using smart temperature control.

**Endpoint:** `PUT /v1/users/{userId}/temperature`
**Base URL:** `https://app-api.8slp.net`
**Authentication:** Required

##### Request

```http
PUT /v1/users/1234567890abcdef/temperature HTTP/1.1
Host: app-api.8slp.net
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "currentState": {
    "type": "smart"
  }
}
```

##### Response (200 OK)

```json
{}
```

---

#### Turn Side Off

Disable heating for the user's side.

**Endpoint:** `PUT /v1/users/{userId}/temperature`
**Base URL:** `https://app-api.8slp.net`
**Authentication:** Required

##### Request

```http
PUT /v1/users/1234567890abcdef/temperature HTTP/1.1
Host: app-api.8slp.net
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "currentState": {
    "type": "off"
  }
}
```

##### Response (200 OK)

```json
{}
```

---

#### Set Away Mode

Enable or disable away mode (shuts off heating).

**Endpoint:** `PUT /v1/users/{userId}/away-mode`
**Base URL:** `https://app-api.8slp.net`
**Authentication:** Required

##### Request (Enable Away Mode)

```http
PUT /v1/users/1234567890abcdef/away-mode HTTP/1.1
Host: app-api.8slp.net
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "awayPeriod": {
    "start": "2024-01-01T00:00:00.000Z"
  }
}
```

##### Request (Disable Away Mode)

```http
PUT /v1/users/1234567890abcdef/away-mode HTTP/1.1
Host: app-api.8slp.net
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "awayPeriod": {
    "end": "2024-01-07T00:00:00.000Z"
  }
}
```

##### Request Body

| Field              | Type   | Required    | Description                             |
| ------------------ | ------ | ----------- | --------------------------------------- |
| `awayPeriod.start` | string | Conditional | ISO 8601 timestamp to enable away mode  |
| `awayPeriod.end`   | string | Conditional | ISO 8601 timestamp to disable away mode |

##### Response (200 OK)

```json
{}
```

---

### Alarms & Routines

#### Get Routines Data

Retrieve next alarm information.

**Endpoint:** `GET /v2/users/{userId}/routines`
**Base URL:** `https://app-api.8slp.net`
**Authentication:** Required

##### Request

```http
GET /v2/users/1234567890abcdef/routines HTTP/1.1
Host: app-api.8slp.net
Authorization: Bearer {access_token}
```

##### Response (200 OK)

```json
{
  "result": {
    "state": {
      "nextAlarm": {
        "nextTimestamp": "2024-01-02T07:00:00.000Z",
        "alarmId": "alarm-xyz789"
      }
    }
  }
}
```

##### Response Fields

| Field                     | Type   | Description                      |
| ------------------------- | ------ | -------------------------------- |
| `nextAlarm.nextTimestamp` | string | ISO 8601 timestamp of next alarm |
| `nextAlarm.alarmId`       | string | Unique alarm identifier          |

---

#### Snooze Alarm

Snooze an active alarm for a specified duration.

**Endpoint:** `PUT /v1/users/{userId}/routines`
**Base URL:** `https://app-api.8slp.net`
**Authentication:** Required

##### Request

```http
PUT /v1/users/1234567890abcdef/routines HTTP/1.1
Host: app-api.8slp.net
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "alarm": {
    "alarmId": "alarm-xyz789",
    "snoozeForMinutes": 10
  }
}
```

##### Request Body

| Field                    | Type    | Required | Description                |
| ------------------------ | ------- | -------- | -------------------------- |
| `alarm.alarmId`          | string  | Yes      | Alarm identifier           |
| `alarm.snoozeForMinutes` | integer | Yes      | Snooze duration in minutes |

##### Response (200 OK)

```json
{}
```

---

#### Stop Alarm

Stop an active alarm completely.

**Endpoint:** `PUT /v1/users/{userId}/routines`
**Base URL:** `https://app-api.8slp.net`
**Authentication:** Required

##### Request

```http
PUT /v1/users/1234567890abcdef/routines HTTP/1.1
Host: app-api.8slp.net
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "alarm": {
    "alarmId": "alarm-xyz789",
    "stopped": true
  }
}
```

##### Request Body

| Field           | Type    | Required | Description      |
| --------------- | ------- | -------- | ---------------- |
| `alarm.alarmId` | string  | Yes      | Alarm identifier |
| `alarm.stopped` | boolean | Yes      | Must be `true`   |

##### Response (200 OK)

```json
{}
```

---

#### Dismiss Alarm

Dismiss an active alarm.

**Endpoint:** `PUT /v1/users/{userId}/routines`
**Base URL:** `https://app-api.8slp.net`
**Authentication:** Required

##### Request

```http
PUT /v1/users/1234567890abcdef/routines HTTP/1.1
Host: app-api.8slp.net
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "alarm": {
    "alarmId": "alarm-xyz789",
    "dismissed": true
  }
}
```

##### Request Body

| Field             | Type    | Required | Description      |
| ----------------- | ------- | -------- | ---------------- |
| `alarm.alarmId`   | string  | Yes      | Alarm identifier |
| `alarm.dismissed` | boolean | Yes      | Must be `true`   |

##### Response (200 OK)

```json
{}
```

---

## Data Models

### User Profile

```typescript
{
  userId: string
  email: string
  firstName: string
  lastName: string
  gender: string
  dob: string  // ISO 8601 date
  zip: number
  emailVerified: boolean
  createdAt: string  // ISO 8601 timestamp
  tempPreference: string
  tempPreferenceUpdatedAt: string  // ISO 8601 timestamp
  devices: string[]  // Array of device IDs
  currentDevice: {
    id: string
    side: "left" | "right" | "solo"
    timeZone: string  // IANA timezone
  }
  sleepTracking: {
    enabledSince: string  // ISO 8601 timestamp
  }
  features: string[]
  autopilotEnabled: boolean
  experimentalFeatures: boolean
  hotelGuest: boolean
  sharingMetricsTo: any[]
  sharingMetricsFrom: any[]
  notifications: {
    [key: string]: boolean
  }
}
```

### Sleep Trend Day

```typescript
{
  day: string; // YYYY-MM-DD
  score: number; // 0-100
  sleepDuration: number; // seconds
  presenceStart: string; // ISO 8601 timestamp
  presenceEnd: string; // ISO 8601 timestamp
  sleepQualityScore: {
    total: number; // 0-100
    sleepDurationSeconds: {
      score: number; // 0-100
    }
    hrv: {
      current: number; // milliseconds
    }
    respiratoryRate: {
      current: number; // breaths per minute
    }
  }
  sleepRoutineScore: {
    total: number; // 0-100
    latencyAsleepSeconds: {
      score: number; // 0-100
    }
    latencyOutSeconds: {
      score: number; // 0-100
    }
    wakeupConsistency: {
      score: number; // 0-100
    }
    heartRate: {
      current: number; // BPM
    }
  }
}
```

### Sleep Interval

```typescript
{
  id: string
  ts: string  // ISO 8601 timestamp
  score: number  // 0-100
  incomplete: boolean
  stages: [
    {
      stage: "awake" | "light" | "deep" | "rem" | "out"
      duration: number  // seconds
    }
  ]
  timeseries: {
    tnt: [string, number][]  // [timestamp, movement_count]
    tempBedC: [string, number][]  // [timestamp, celsius]
    tempRoomC: [string, number][]  // [timestamp, celsius]
    respiratoryRate: [string, number][]  // [timestamp, breaths_per_minute]
    heartRate: [string, number][]  // [timestamp, bpm]
  }
}
```

### Device Status

```typescript
{
  deviceId: string;
  leftHeatingLevel: number; // -100 to 100
  leftTargetHeatingLevel: number; // -100 to 100
  leftNowHeating: boolean;
  leftHeatingDuration: number; // seconds
  rightHeatingLevel: number; // -100 to 100
  rightTargetHeatingLevel: number; // -100 to 100
  rightNowHeating: boolean;
  rightHeatingDuration: number; // seconds
}
```

### Temperature Settings

```typescript
{
  currentLevel: number  // -100 to 100
  currentDeviceLevel: number  // -100 to 100
  currentState: {
    type: "smart" | "off"
  }
  smart: {
    [stage: string]: number  // -100 to 100
  }
}
```

---

## Temperature Scale Reference

Eight Sleep uses a proprietary scale from **-100 to 100** for heating levels. These values map to actual temperatures as follows:

### Celsius Mapping

| Raw Value | Temperature (°C) |
| --------- | ---------------- |
| -100      | 13°C             |
| -90       | 15°C             |
| -80       | 17°C             |
| -70       | 18°C             |
| -60       | 20°C             |
| -50       | 21°C             |
| -40       | 22°C             |
| -30       | 23°C             |
| -20       | 24°C             |
| -10       | 25°C             |
| 0         | 27°C             |
| 10        | 29°C             |
| 20        | 30°C             |
| 30        | 32°C             |
| 40        | 34°C             |
| 50        | 36°C             |
| 60        | 38°C             |
| 70        | 40°C             |
| 80        | 42°C             |
| 90        | 43°C             |
| 100       | 44°C             |

### Fahrenheit Mapping

| Raw Value | Temperature (°F) |
| --------- | ---------------- |
| -100      | 55°F             |
| -90       | 61°F             |
| -80       | 64°F             |
| -70       | 67°F             |
| -60       | 70°F             |
| -50       | 73°F             |
| -40       | 75°F             |
| -30       | 79°F             |
| -20       | 81°F             |
| -10       | 84°F             |
| 0         | 81°F             |
| 10        | 84°F             |
| 20        | 87°F             |
| 30        | 90°F             |
| 40        | 93°F             |
| 50        | 96°F             |
| 60        | 100°F            |
| 70        | 104°F            |
| 80        | 107°F            |
| 90        | 109°F            |
| 100       | 111°F            |

### Recommended Temperature Ranges

| Use Case    | Raw Value Range | Temperature Range |
| ----------- | --------------- | ----------------- |
| **Cooling** | -50 to -20      | 21-24°C / 70-75°F |
| **Neutral** | -10 to 10       | 25-29°C / 77-84°F |
| **Warming** | 20 to 50        | 30-36°C / 86-97°F |

**Note:** Values between mapped points are interpolated linearly. For example, a raw value of -15 would be approximately 24.5°C.

---

## Error Handling

### HTTP Status Codes

| Status Code | Meaning               | Common Causes                                        |
| ----------- | --------------------- | ---------------------------------------------------- |
| 200         | Success               | Request completed successfully                       |
| 400         | Bad Request           | Invalid request body or parameters                   |
| 401         | Unauthorized          | Invalid or expired access token, invalid credentials |
| 403         | Forbidden             | Insufficient permissions                             |
| 404         | Not Found             | Resource does not exist                              |
| 429         | Too Many Requests     | Rate limit exceeded                                  |
| 500         | Internal Server Error | Server-side error                                    |
| 503         | Service Unavailable   | Eight Sleep service is down                          |

### Error Response Format

```json
{
  "error": "error_code",
  "error_description": "Human-readable error message"
}
```

### Common Errors

#### Authentication Errors

```json
{
  "error": "invalid_grant",
  "error_description": "Invalid credentials"
}
```

**Cause:** Incorrect email or password
**Solution:** Verify credentials and retry

```json
{
  "error": "invalid_token",
  "error_description": "Access token expired"
}
```

**Cause:** Access token has expired
**Solution:** Refresh the access token using refresh token

```json
{
  "error": "invalid_grant",
  "error_description": "Invalid or expired refresh token"
}
```

**Cause:** Refresh token is invalid or expired
**Solution:** Re-authenticate with email and password

#### API Errors

```json
{
  "message": "API request failed: 404"
}
```

**Cause:** Resource not found (invalid userId or deviceId)
**Solution:** Verify IDs are correct

---

## Rate Limiting & Best Practices

### Rate Limits

Eight Sleep does not publicly document rate limits, but based on observed behavior:

- **Authentication:** ~10 requests per minute
- **Data Retrieval:** ~60 requests per minute
- **Device Control:** ~30 requests per minute

**Recommendation:** Implement exponential backoff when receiving 429 responses.

### Best Practices

#### 1. Token Management

- **Store refresh tokens securely** - They are long-lived and can be used to obtain new access tokens
- **Proactively refresh tokens** - Refresh access tokens ~2 minutes before expiry
- **Handle token refresh failures** - If refresh fails, re-authenticate with credentials

#### 2. API Usage

- **Cache user profile data** - User profiles change infrequently
- **Batch data requests** - Use date ranges in trends endpoint rather than multiple single-day requests
- **Respect sleep cycles** - Avoid frequent temperature changes during sleep (recommended: max 1 change per 30 minutes)
- **Use appropriate endpoints** - Use Client API for data retrieval, App API for control

#### 3. Error Handling

- **Implement retry logic** - Retry failed requests with exponential backoff
- **Handle partial failures** - Sleep data may be incomplete during active sleep sessions
- **Validate responses** - Use schema validation to ensure response structure

#### 4. Temperature Control

- **Gradual changes** - Avoid large temperature jumps (>20 raw units) to prevent discomfort
- **Duration limits** - Set reasonable heating durations to avoid excessive energy use
- **Monitor heating status** - Check if device is actively heating before making changes

#### 5. Sleep Data

- **Timezone awareness** - Always specify timezone when requesting trend data
- **Incomplete intervals** - Check `incomplete` flag on intervals - they may be updated as sleep continues
- **Data availability** - Sleep data is typically available 15-30 minutes after waking

### Example: Exponential Backoff

```python
import time

def api_call_with_retry(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            wait_time = (2 ** attempt) * 1  # 1s, 2s, 4s
            time.sleep(wait_time)
```

### Example: Token Refresh Check

```python
import time

def is_token_expired(expires_at_posix, buffer_seconds=120):
    """Check if token will expire within buffer_seconds"""
    return time.time() >= (expires_at_posix - buffer_seconds)

def get_valid_token(token_data):
    """Get a valid access token, refreshing if necessary"""
    if is_token_expired(token_data['expires_at']):
        # Refresh token
        new_token = refresh_access_token(token_data['refresh_token'])
        token_data.update(new_token)
    return token_data['access_token']
```

---

## Security Considerations

### Important Warnings

⚠️ **This API is reverse-engineered and not officially supported by Eight Sleep**

- Using this API may violate Eight Sleep's Terms of Service
- Eight Sleep could block access or suspend accounts at any time
- API structure and authentication may change without notice
- No guarantees of data privacy or security

### Secure Integration

If you choose to integrate with this API:

1. **Protect credentials** - Never hardcode or expose user passwords
2. **Secure token storage** - Store access and refresh tokens encrypted
3. **Use HTTPS** - All API communication uses HTTPS, do not downgrade
4. **Limit scope** - Only request data and control permissions you need
5. **Personal use only** - Do not build commercial services on this API
6. **Monitor for changes** - Be prepared for API changes or deprecation

---

## Example Code

### Python Authentication Example

```python
import requests
from datetime import datetime, timedelta

class EightSleepAPI:
    AUTH_URL = "https://auth-api.8slp.net/v1/tokens"
    CLIENT_API_URL = "https://client-api.8slp.net/v1"
    APP_API_URL = "https://app-api.8slp.net/v1"

    CLIENT_ID = "0894c7f33bb94800a03f1f4df13a4f38"
    CLIENT_SECRET = "f0954a3ed5763ba3d06834c73731a32f15f168f47d4f164751275def86db0c76"

    def __init__(self):
        self.access_token = None
        self.refresh_token = None
        self.expires_at = None
        self.user_id = None

    def authenticate(self, email, password):
        """Login with email and password"""
        data = {
            "client_id": self.CLIENT_ID,
            "client_secret": self.CLIENT_SECRET,
            "grant_type": "password",
            "username": email,
            "password": password
        }

        response = requests.post(
            self.AUTH_URL,
            json=data,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "Android App"
            }
        )
        response.raise_for_status()

        token_data = response.json()
        self.access_token = token_data["access_token"]
        self.refresh_token = token_data["refresh_token"]
        self.user_id = token_data["userId"]
        self.expires_at = datetime.now() + timedelta(seconds=token_data["expires_in"])

        return token_data

    def refresh_access_token(self):
        """Refresh expired access token"""
        data = {
            "client_id": self.CLIENT_ID,
            "client_secret": self.CLIENT_SECRET,
            "grant_type": "refresh_token",
            "refresh_token": self.refresh_token
        }

        response = requests.post(self.AUTH_URL, json=data)
        response.raise_for_status()

        token_data = response.json()
        self.access_token = token_data["access_token"]
        self.refresh_token = token_data["refresh_token"]
        self.expires_at = datetime.now() + timedelta(seconds=token_data["expires_in"])

    def _get_headers(self):
        """Get headers with current access token"""
        if datetime.now() >= self.expires_at - timedelta(minutes=2):
            self.refresh_access_token()

        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "User-Agent": "Android App",
            "Accept": "application/json"
        }

    def get_user_profile(self):
        """Get user profile"""
        response = requests.get(
            f"{self.CLIENT_API_URL}/users/me",
            headers=self._get_headers()
        )
        response.raise_for_status()
        return response.json()["user"]

    def get_sleep_trends(self, start_date, end_date, timezone="America/New_York"):
        """Get sleep trends for date range"""
        params = {
            "tz": timezone,
            "from": start_date,
            "to": end_date,
            "include-main": "false",
            "include-all-sessions": "false",
            "model-version": "v2"
        }

        response = requests.get(
            f"{self.CLIENT_API_URL}/users/{self.user_id}/trends",
            params=params,
            headers=self._get_headers()
        )
        response.raise_for_status()
        return response.json()["result"]["days"]

    def set_heating_level(self, level, duration=0):
        """Set heating level for user's side"""
        data = {
            "timeBased": {
                "level": level,
                "durationSeconds": duration
            },
            "currentLevel": level
        }

        response = requests.put(
            f"{self.APP_API_URL}/users/{self.user_id}/temperature",
            json=data,
            headers=self._get_headers()
        )
        response.raise_for_status()

    def turn_off(self):
        """Turn off heating"""
        data = {"currentState": {"type": "off"}}

        response = requests.put(
            f"{self.APP_API_URL}/users/{self.user_id}/temperature",
            json=data,
            headers=self._get_headers()
        )
        response.raise_for_status()

# Usage
api = EightSleepAPI()
api.authenticate("your-email@example.com", "your-password")

# Get user profile
profile = api.get_user_profile()
print(f"User: {profile['firstName']} {profile['lastName']}")

# Get last 7 days of sleep data
from datetime import date
end = date.today().strftime("%Y-%m-%d")
start = (date.today() - timedelta(days=7)).strftime("%Y-%m-%d")
trends = api.get_sleep_trends(start, end)

for day in trends:
    print(f"{day['day']}: Score {day['score']}, Duration {day['sleepDuration']/3600:.1f}h")

# Set temperature
api.set_heating_level(-20, duration=3600)  # Cool for 1 hour
```

---

## Changelog

### Version History

- **October 2024** - Initial documentation based on reverse-engineering of Eight Sleep Android app
- Client ID and secret extracted from app resources
- API endpoints discovered through network traffic analysis
- Temperature scale mapping reverse-engineered from app code

---

## Disclaimer

This documentation is based on reverse-engineering the Eight Sleep Android application and is provided for educational purposes only. This is **not an official API** and is **not supported or endorsed by Eight Sleep, Inc.**

**Use at your own risk.** Eight Sleep may change their API at any time without notice, breaking integrations. Using this API may violate Eight Sleep's Terms of Service and could result in account suspension.

For official integrations, contact Eight Sleep directly for their supported API program.

---

## Contributing

If you discover new endpoints, parameters, or corrections to this documentation, please contribute back to the community by updating this document or the source project.

---

## License

This documentation is provided as-is under MIT License. The Eight Sleep API itself is proprietary and owned by Eight Sleep, Inc.
