#!/usr/bin/env node
import { config } from 'dotenv';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import { SleepClient } from './providers/sleep/client.js';
import { FitnessClient } from './providers/fitness/client.js';

config();

const OUTPUT_DIVIDER = '='.repeat(80);

interface CommandContext {
  sleepClient?: SleepClient;
  fitnessClient?: FitnessClient;
  outputFile?: string;
}

const ctx: CommandContext = {};

function setOutputFile(path?: string) {
  if (!path) return;
  ctx.outputFile = path;
}

function formatJson(data: unknown) {
  return JSON.stringify(data, null, 2);
}

function printSection(title: string, body: unknown) {
  console.log('\n' + OUTPUT_DIVIDER);
  console.log(title);
  console.log(OUTPUT_DIVIDER);
  console.log(formatJson(body));
  console.log('\n' + OUTPUT_DIVIDER + '\n');

  if (ctx.outputFile) {
    try {
      mkdirSync(dirname(ctx.outputFile), { recursive: true });
      writeFileSync(ctx.outputFile, formatJson(body));
      console.log(`✅ Saved response to: ${ctx.outputFile}\n`);
    } catch (error) {
      console.error(`❌ Failed to save file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

function requireEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    console.error(`❌ Missing ${name} in environment`);
    process.exit(1);
  }
  return value;
}

async function withSpinner<T>(label: string, task: () => Promise<T>) {
  const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let index = 0;
  let active = true;

  const loop = async () => {
    while (active) {
      process.stdout.write(`\r${spinner[index]} ${label}`);
      index = (index + 1) % spinner.length;
      await delay(80);
    }
  };

  loop().catch(() => {});
  try {
    const result = await task();
    active = false;
    process.stdout.write(`\r✅ ${label}\n`);
    return result;
  } catch (error) {
    active = false;
    process.stdout.write(`\r❌ ${label}\n`);
    throw error;
  }
}

async function authenticateSleep() {
  if (ctx.sleepClient) return ctx.sleepClient;

  const email = requireEnv('SLEEP_EMAIL', process.env.CLIENT_TEST_EMAIL);
  const password = requireEnv('SLEEP_PASSWORD', process.env.CLIENT_TEST_PASSWORD);

  const client = new SleepClient();
  const tokens = await withSpinner('Authenticating with Sleep API...', () => client.authenticate(email, password));

  console.log('👤 User ID:', tokens.userId);
  ctx.sleepClient = client;
  return client;
}

async function authenticateFitness() {
  if (ctx.fitnessClient) return ctx.fitnessClient;

  const username = requireEnv('FITNESS_EMAIL', process.env.TONAL_EMAIL);
  const password = requireEnv('FITNESS_PASSWORD', process.env.TONAL_PASSWORD);

  const client = new FitnessClient();
  await withSpinner('Authenticating with Fitness API...', () => client.authenticate({ username, password }));

  const profile = await client.getUserProfile();
  const tokens = client.getTokens();
  if (tokens.idToken) {
    client.setTokens({
      idToken: tokens.idToken,
      refreshToken: tokens.refreshToken ?? '',
      expiresAt: tokens.expiresAt,
      userId: profile.id,
    });
  }

  console.log('👤 User ID:', profile.id);
  console.log('🎫 Token expires at:', new Date(tokens.expiresAt).toISOString());
  ctx.fitnessClient = client;
  return client;
}

const sleepCommands = {
  async auth() {
    await authenticateSleep();
  },
  async profile() {
    const client = await authenticateSleep();
    const profile = await client.getUserProfile();
    printSection('Sleep User Profile', profile);
  },
  async device(deviceId?: string) {
    if (!deviceId) throw new Error('Usage: sleep:device <deviceId>');
    const client = await authenticateSleep();
    const status = await client.getDeviceStatus(deviceId);
    printSection('Device Status', { result: status });
  },
  async temp(level?: string, duration?: string) {
    if (!level || !duration) throw new Error('Usage: sleep:temp <level> <duration>');
    const client = await authenticateSleep();
    await client.setHeatingLevel(Number(level), Number(duration));
    console.log('✅ Temperature set successfully!');
  },
  async trends(from?: string, to?: string, tz?: string) {
    if (!from || !to) throw new Error('Usage: sleep:trends <from> <to> [timezone]');
    const client = await authenticateSleep();
    const trends = await client.getSleepTrends(from, to, tz ?? 'America/New_York');
    printSection('Sleep Trends', trends);
  },
  async intervals() {
    const client = await authenticateSleep();
    const intervals = await client.getSleepIntervals();
    printSection('Sleep Intervals', intervals);
  },
};

const fitnessCommands = {
  async auth() {
    await authenticateFitness();
  },
  async profile() {
    const client = await authenticateFitness();
    const profile = await client.getUserProfile();
    printSection('Fitness User Profile', profile);
  },
  async workouts(offset?: string, limit?: string) {
    const client = await authenticateFitness();
    const sessions = await client.getWorkouts(offset ? Number(offset) : 0, limit ? Number(limit) : 10);
    printSection('Workouts Catalog', sessions);
    console.log(`📊 Returned ${sessions.length} workouts`);
  },
  async 'user-workouts'(offset?: string, limit?: string) {
    const client = await authenticateFitness();
    const workouts = await client.getUserWorkouts(offset ? Number(offset) : 0, limit ? Number(limit) : 10);
    printSection('User Custom Workouts', workouts);
    console.log(`📊 Returned ${workouts.length} workouts`);
  },
  async histories(offset?: string, limit?: string) {
    const client = await authenticateFitness();
    const histories = await client.getWorkoutHistories(offset ? Number(offset) : 0, limit ? Number(limit) : 10);
    printSection('Workout Histories', histories);
    console.log(`📊 Returned ${histories.length} sessions`);
  },
  async movements() {
    const client = await authenticateFitness();
    const movements = await client.getMovements();
    printSection('Movement Catalog', movements);
    console.log(`📊 Total movements: ${movements.length}`);
  },
};

function listCommands() {
  console.log('\n' + OUTPUT_DIVIDER);
  console.log('🔧 Multi-Provider API Explorer');
  console.log(OUTPUT_DIVIDER);
  console.log('\n🛏️  SLEEP COMMANDS:');
  console.log('  sleep:auth');
  console.log('  sleep:profile');
  console.log('  sleep:device <id>');
  console.log('  sleep:temp <level> <duration>');
  console.log('  sleep:trends <from> <to> [tz]');
  console.log('  sleep:intervals');

  console.log('\n🏋️  FITNESS COMMANDS:');
  console.log('  fitness:auth');
  console.log('  fitness:profile');
  console.log('  fitness:workouts [offset] [limit]');
  console.log('  fitness:user-workouts [offset] [limit]');
  console.log('  fitness:histories [offset] [limit]');
  console.log('  fitness:movements');

  console.log('\nOPTIONS:');
  console.log('  --file <path>  Save JSON output to file');
  console.log('  help           Show this menu');
  console.log('  exit           Exit CLI');
  console.log(OUTPUT_DIVIDER + '\n');
}

async function dispatch(command: string, args: string[]) {
  if (command.startsWith('sleep:')) {
    const action = command.split(':')[1] as keyof typeof sleepCommands;
    const handler = sleepCommands[action];
    if (!handler) throw new Error(`Unknown sleep command: ${command}`);
    await handler(...args);
    return;
  }

  if (command.startsWith('fitness:')) {
    const action = command.split(':')[1] as keyof typeof fitnessCommands;
    const handler = fitnessCommands[action];
    if (!handler) throw new Error(`Unknown fitness command: ${command}`);
    await handler(...args);
    return;
  }

  if (command === 'help') {
    listCommands();
    return;
  }

  if (command === 'exit') {
    console.log('👋 Goodbye!');
    process.exit(0);
  }

  throw new Error(`Unknown command: ${command}`);
}

async function main() {
  const argv = process.argv.slice(2);

  const fileFlag = argv.indexOf('--file');
  if (fileFlag !== -1 && fileFlag + 1 < argv.length) {
    setOutputFile(argv[fileFlag + 1]);
    argv.splice(fileFlag, 2);
  }

  const [command, ...args] = argv;

  if (!command) {
    listCommands();
    return;
  }

  try {
    await dispatch(command, args);
  } catch (error) {
    console.error('❌ Command failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
