#!/usr/bin/env node
import { config } from 'dotenv';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { SleepClient } from './client.js';

// Load .env file
config();

// Sleep client instance
let client: SleepClient | null = null;

// Optional file output
let outputFile: string | null = null;

/**
 * Pretty print response data
 */
function printResponse(description: string, body: any) {
  console.log('\n' + '='.repeat(80));
  console.log(`📦 ${description}`);
  console.log('='.repeat(80));
  console.log(JSON.stringify(body, null, 2));
  console.log('\n' + '='.repeat(80) + '\n');

  // Save to file if --file flag was provided
  if (outputFile) {
    try {
      mkdirSync(dirname(outputFile), { recursive: true });
      writeFileSync(outputFile, JSON.stringify(body, null, 2));
      console.log(`✅ Saved response to: ${outputFile}\n`);
    } catch (error) {
      console.error(`❌ Failed to save file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Authenticate with sleep API
 */
async function authenticate() {
  const email = process.env.EMAIL || process.env.CLIENT_TEST_EMAIL;
  const password = process.env.PASSWORD || process.env.CLIENT_TEST_PASSWORD;

  if (!email || !password) {
    console.error('❌ Missing EMAIL and PASSWORD in .env file');
    process.exit(1);
  }

  console.log('🔐 Authenticating...');

  try {
    client = new SleepClient();
    const tokens = await client.authenticate(email, password);
    console.log('✅ Authenticated successfully!');
    console.log('👤 User ID:', tokens.userId);
  } catch (error) {
    console.error('❌ Authentication failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

/**
 * Ensure client is authenticated
 */
function ensureAuthenticated() {
  if (!client) {
    console.error('❌ Must authenticate first');
    process.exit(1);
  }
  return client;
}

/**
 * Get user profile
 */
async function getUserProfile() {
  const c = ensureAuthenticated();
  console.log('👤 Fetching user profile...');
  try {
    const profile = await c.getUserProfile();
    printResponse('User Profile', { user: profile });
    return profile;
  } catch (error) {
    console.error('❌ Failed:', error instanceof Error ? error.message : String(error));
  }
}

/**
 * Get device status
 */
async function getDeviceStatus(deviceId: string) {
  const c = ensureAuthenticated();
  console.log('🛏️  Fetching device status...');
  try {
    const status = await c.getDeviceStatus(deviceId);
    printResponse('Device Status', { result: status });
    return status;
  } catch (error) {
    console.error('❌ Failed:', error instanceof Error ? error.message : String(error));
  }
}

/**
 * Set heating level
 */
async function setHeatingLevel(level: number, duration: number) {
  const c = ensureAuthenticated();
  console.log(`🔥 Setting heating level to ${level} for ${duration}s...`);
  try {
    await c.setHeatingLevel(level, duration);
    console.log('✅ Temperature set successfully!');
  } catch (error) {
    console.error('❌ Failed:', error instanceof Error ? error.message : String(error));
  }
}

/**
 * Get sleep trends
 */
async function getSleepTrends(from: string, to: string, tz: string = 'America/New_York') {
  const c = ensureAuthenticated();
  console.log(`😴 Fetching sleep trends from ${from} to ${to}...`);
  try {
    const trends = await c.getSleepTrends(from, to, tz);
    printResponse('Sleep Trends', trends);
    return trends;
  } catch (error) {
    console.error('❌ Failed:', error instanceof Error ? error.message : String(error));
  }
}

/**
 * Get sleep intervals (detailed session data)
 */
async function getSleepIntervals() {
  const c = ensureAuthenticated();
  console.log('📊 Fetching sleep intervals...');
  try {
    const intervals = await c.getSleepIntervals();
    printResponse('Sleep Intervals', intervals);
    return intervals;
  } catch (error) {
    console.error('❌ Failed:', error instanceof Error ? error.message : String(error));
  }
}

/**
 * Get sleep trends for this week (Monday to today)
 */
async function getTrendsThisWeek(tz: string = 'America/New_York') {
  ensureAuthenticated();

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
  console.log('🛏️  Sleep API Explorer');
  console.log('='.repeat(80));
  console.log('\nAvailable commands:');
  console.log('  1. auth              - Authenticate with sleep API');
  console.log('  2. profile           - Get user profile');
  console.log('  3. device <id>       - Get device status');
  console.log('  4. set-temp <level> <duration> - Set heating level (-100 to 100, duration in seconds)');
  console.log('  5. trends <from> <to> [tz] - Get sleep trends (dates: YYYY-MM-DD)');
  console.log('  6. trends-week [tz]  - Get sleep trends for this week (Monday to today)');
  console.log('  7. intervals         - Get detailed sleep intervals');
  console.log('  8. quick             - Quick exploration (auth + profile + device + trends)');
  console.log('  9. help              - Show this menu');
  console.log('  0. exit              - Exit');
  console.log('\nOptions:');
  console.log('  --file <path>        - Save JSON response to file');
  console.log('  💡 Example: npm run cli trends 2025-01-01 2025-01-07 --file docs/api-samples/trends.json\n');
}

/**
 * Quick exploration flow
 */
async function quickExplore() {
  console.log('🚀 Starting quick exploration...\n');

  // Auth
  await authenticate();
  if (!client) return;

  // Profile
  const profile = await getUserProfile();
  if (!profile) return;

  const deviceId = profile.currentDevice?.id;
  if (deviceId) {
    // Device status
    await getDeviceStatus(deviceId);
  }

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
  let args = process.argv.slice(2);

  // Check for --file flag
  const fileIndex = args.indexOf('--file');
  if (fileIndex !== -1 && fileIndex + 1 < args.length) {
    outputFile = args[fileIndex + 1];
    // Remove --file and its value from args
    args.splice(fileIndex, 2);
  }

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
      if (!client) {
        await authenticate();
      }
      await getUserProfile();
      break;

    case '3':
    case 'device':
      if (!client) {
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
    case 'set-temp':
      if (!client) {
        await authenticate();
      }
      if (!args[1] || !args[2]) {
        console.error('❌ Usage: set-temp <level> <duration>');
        console.log('💡 Example: set-temp -20 3600 (set to -20 for 1 hour)');
        return;
      }
      await setHeatingLevel(parseInt(args[1]), parseInt(args[2]));
      break;

    case '5':
    case 'trends':
      if (!client) {
        await authenticate();
      }
      if (!args[1] || !args[2]) {
        console.error('❌ Usage: trends <from> <to> [timezone]');
        console.log('💡 Example: trends 2024-01-01 2024-01-07 America/New_York');
        return;
      }
      await getSleepTrends(args[1], args[2], args[3]);
      break;

    case '6':
    case 'trends-week':
      if (!client) {
        await authenticate();
      }
      await getTrendsThisWeek(args[1]);
      break;

    case '7':
    case 'intervals':
      if (!client) {
        await authenticate();
      }
      await getSleepIntervals();
      break;

    case '8':
    case 'quick':
      await quickExplore();
      break;

    case '9':
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
