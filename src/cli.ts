#!/usr/bin/env node
import { config } from 'dotenv';

// Load .env file
config();

const AUTH_BASE_URL = 'https://auth-api.8slp.net/v1';
const CLIENT_BASE_URL = 'https://client-api.8slp.net/v1';
const APP_BASE_URL = 'https://app-api.8slp.net/v1';

const CLIENT_ID = '0894c7f33bb94800a03f1f4df13a4f38';
const CLIENT_SECRET = 'f0954a3ed5763ba3d06834c73731a32f15f168f47d4f164751275def86db0c76';

// Store auth state
let accessToken: string | null = null;
let userId: string | null = null;

/**
 * Pretty print response with headers and body
 */
function printResponse(url: string, response: Response, body: any) {
  console.log('\n' + '='.repeat(80));
  console.log(`REQUEST: ${response.url}`);
  console.log('='.repeat(80));

  console.log('\n📍 URL:', url);
  console.log('🔄 Status:', response.status, response.statusText);

  console.log('\n📋 RESPONSE HEADERS:');
  console.log('-'.repeat(80));
  response.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });

  console.log('\n📦 RESPONSE BODY:');
  console.log('-'.repeat(80));
  console.log(JSON.stringify(body, null, 2));
  console.log('\n' + '='.repeat(80) + '\n');
}

/**
 * Make authenticated request with full inspection
 */
async function inspectRequest(url: string, options: RequestInit = {}): Promise<any> {
  if (!options.headers) {
    options.headers = {};
  }

  if (accessToken) {
    (options.headers as any)['Authorization'] = `Bearer ${accessToken}`;
  }

  (options.headers as any)['Content-Type'] = 'application/json';
  (options.headers as any)['Accept'] = 'application/json';
  (options.headers as any)['User-Agent'] = 'Android App';

  const response = await fetch(url, options);
  const body = await response.json();

  printResponse(url, response, body);

  if (!response.ok) {
    console.error('❌ Request failed!');
    return null;
  }

  return body;
}

/**
 * Authenticate with Eight Sleep
 */
async function authenticate() {
  const email = process.env.EMAIL || process.env.CLIENT_TEST_EMAIL;
  const password = process.env.PASSWORD || process.env.CLIENT_TEST_PASSWORD;

  if (!email || !password) {
    console.error('❌ Missing EMAIL and PASSWORD in .env file');
    process.exit(1);
  }

  console.log('🔐 Authenticating...');

  const body = await inspectRequest(`${AUTH_BASE_URL}/tokens`, {
    method: 'POST',
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'password',
      username: email,
      password: password,
    }),
  });

  if (body) {
    accessToken = body.access_token;
    userId = body.userId;
    console.log('✅ Authenticated successfully!');
    console.log('👤 User ID:', userId);
  }
}

/**
 * Get user profile
 */
async function getUserProfile() {
  console.log('👤 Fetching user profile...');
  return await inspectRequest(`${CLIENT_BASE_URL}/users/me`);
}

/**
 * Get device status
 */
async function getDeviceStatus(deviceId: string) {
  console.log('🛏️  Fetching device status...');
  return await inspectRequest(`${CLIENT_BASE_URL}/devices/${deviceId}`);
}

/**
 * Get temperature settings
 */
async function getTemperatureSettings() {
  if (!userId) {
    console.error('❌ Must authenticate first');
    return;
  }
  console.log('🌡️  Fetching temperature settings...');
  return await inspectRequest(`${APP_BASE_URL}/users/${userId}/temperature`);
}

/**
 * Set heating level
 */
async function setHeatingLevel(level: number, duration: number) {
  if (!userId) {
    console.error('❌ Must authenticate first');
    return;
  }
  console.log(`🔥 Setting heating level to ${level} for ${duration}s...`);
  return await inspectRequest(`${APP_BASE_URL}/users/${userId}/temperature`, {
    method: 'PUT',
    body: JSON.stringify({
      timeBased: {
        level,
        durationSeconds: duration,
      },
      currentLevel: level,
    }),
  });
}

/**
 * Get sleep trends
 */
async function getSleepTrends(from: string, to: string, tz: string = 'America/New_York') {
  if (!userId) {
    console.error('❌ Must authenticate first');
    return;
  }
  console.log(`😴 Fetching sleep trends from ${from} to ${to}...`);
  const params = new URLSearchParams({
    tz,
    from,
    to,
    'include-main': 'false',
    'include-all-sessions': 'false',
    'model-version': 'v2',
  });
  return await inspectRequest(`${CLIENT_BASE_URL}/users/${userId}/trends?${params}`);
}

/**
 * Get sleep intervals (detailed session data)
 */
async function getSleepIntervals() {
  if (!userId) {
    console.error('❌ Must authenticate first');
    return;
  }
  console.log('📊 Fetching sleep intervals...');
  return await inspectRequest(`${CLIENT_BASE_URL}/users/${userId}/intervals`);
}

/**
 * Get sleep trends for this week (Monday to today)
 */
async function getTrendsThisWeek(tz: string = 'America/New_York') {
  if (!userId) {
    console.error('❌ Must authenticate first');
    return;
  }

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days

  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday);

  const from = monday.toISOString().split('T')[0];
  const to = today.toISOString().split('T')[0];

  console.log(`📅 Fetching sleep trends for this week (${from} to ${to})...`);
  return await getSleepTrends(from, to, tz);
}

/**
 * Interactive CLI menu
 */
async function showMenu() {
  console.log('\n' + '='.repeat(80));
  console.log('🛏️  Eight Sleep API Explorer');
  console.log('='.repeat(80));
  console.log('\nAvailable commands:');
  console.log('  1. auth              - Authenticate with Eight Sleep');
  console.log('  2. profile           - Get user profile');
  console.log('  3. device <id>       - Get device status');
  console.log('  4. temp              - Get temperature settings');
  console.log('  5. set-temp <level> <duration> - Set heating level (-100 to 100, duration in seconds)');
  console.log('  6. trends <from> <to> [tz] - Get sleep trends (dates: YYYY-MM-DD)');
  console.log('  7. trends-week [tz]  - Get sleep trends for this week (Monday to today)');
  console.log('  8. intervals         - Get detailed sleep intervals');
  console.log('  9. quick             - Quick exploration (auth + profile + device + temp + trends)');
  console.log('  10. help             - Show this menu');
  console.log('  0. exit              - Exit\n');
}

/**
 * Quick exploration flow
 */
async function quickExplore() {
  console.log('🚀 Starting quick exploration...\n');

  // Auth
  await authenticate();
  if (!accessToken) return;

  // Profile
  const profile = await getUserProfile();
  if (!profile) return;

  const deviceId = profile.user?.currentDevice?.id;
  if (deviceId) {
    // Device status
    await getDeviceStatus(deviceId);
  }

  // Temperature settings
  await getTemperatureSettings();

  // Sleep trends (last 7 days)
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  const from = weekAgo.toISOString().split('T')[0];
  const to = today.toISOString().split('T')[0];
  await getSleepTrends(from, to);

  console.log('✅ Quick exploration complete!');
}

/**
 * Main CLI handler
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    await showMenu();
    return;
  }

  const command = args[0];

  switch (command) {
    case '1':
    case 'auth':
      await authenticate();
      break;

    case '2':
    case 'profile':
      if (!accessToken) {
        await authenticate();
      }
      await getUserProfile();
      break;

    case '3':
    case 'device':
      if (!accessToken) {
        await authenticate();
      }
      if (!args[1]) {
        console.error('❌ Usage: device <deviceId>');
        console.log('💡 Tip: Get deviceId from profile first');
        return;
      }
      await getDeviceStatus(args[1]);
      break;

    case '4':
    case 'temp':
      if (!accessToken) {
        await authenticate();
      }
      await getTemperatureSettings();
      break;

    case '5':
    case 'set-temp':
      if (!accessToken) {
        await authenticate();
      }
      if (!args[1] || !args[2]) {
        console.error('❌ Usage: set-temp <level> <duration>');
        console.log('💡 Example: set-temp -20 3600 (set to -20 for 1 hour)');
        return;
      }
      await setHeatingLevel(parseInt(args[1]), parseInt(args[2]));
      break;

    case '6':
    case 'trends':
      if (!accessToken) {
        await authenticate();
      }
      if (!args[1] || !args[2]) {
        console.error('❌ Usage: trends <from> <to> [timezone]');
        console.log('💡 Example: trends 2024-01-01 2024-01-07 America/New_York');
        return;
      }
      await getSleepTrends(args[1], args[2], args[3]);
      break;

    case '7':
    case 'trends-week':
      if (!accessToken) {
        await authenticate();
      }
      await getTrendsThisWeek(args[1]);
      break;

    case '8':
    case 'intervals':
      if (!accessToken) {
        await authenticate();
      }
      await getSleepIntervals();
      break;

    case '9':
    case 'quick':
      await quickExplore();
      break;

    case '10':
    case 'help':
      await showMenu();
      break;

    case '0':
    case 'exit':
      console.log('👋 Goodbye!');
      process.exit(0);
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      await showMenu();
      break;
  }
}

main().catch(console.error);
