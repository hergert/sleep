import { describe, test, expect, beforeAll } from 'vitest';
import { SleepClient } from './client.js';

// Integration tests requiring real sleep credentials
// Set EMAIL and PASSWORD env vars (or CLIENT_TEST_EMAIL/CLIENT_TEST_PASSWORD) to run tests

const email = process.env.CLIENT_TEST_EMAIL;
const password = process.env.CLIENT_TEST_PASSWORD;
const hasCredentials = Boolean(email && password);
const describeSuite = hasCredentials ? describe : describe.skip;

describeSuite('SleepClient', () => {
  let client: SleepClient;
  let deviceId: string;

  beforeAll(async () => {
    if (!hasCredentials) {
      return;
    }
    client = new SleepClient();
  });

  test('authenticate with real credentials', async () => {
    await client.authenticate(email!, password!);
    // If we get here without throwing, authentication succeeded
    expect(true).toBe(true);
  });

  test('getUserProfile returns valid data', async () => {
    if (!client) {
      client = new SleepClient();
      await client.authenticate(email!, password!);
    }

    const profile = await client.getUserProfile();

    expect(profile).toBeDefined();
    expect(profile.userId).toBeDefined();
    expect(typeof profile.userId).toBe('string');
    expect(profile.email).toBeDefined();
    expect(profile.currentDevice).toBeDefined();
    expect(profile.currentDevice.id).toBeDefined();

    // Store deviceId for subsequent tests
    deviceId = profile.currentDevice.id;
  });

  test('getDeviceStatus returns heating levels', async () => {
    if (!client) {
      client = new SleepClient();
      await client.authenticate(email!, password!);
      const profile = await client.getUserProfile();
      deviceId = profile.currentDevice.id;
    }

    const status = await client.getDeviceStatus(deviceId);

    expect(status).toBeDefined();
    expect(typeof status.leftHeatingLevel).toBe('number');
    expect(typeof status.rightHeatingLevel).toBe('number');
    expect(typeof status.leftNowHeating).toBe('boolean');
    expect(typeof status.rightNowHeating).toBe('boolean');
  });

  test('setHeatingLevel updates temperature', async () => {
    if (!client) {
      client = new SleepClient();
      await client.authenticate(email!, password!);
    }

    // Set a mild heating level for 1 hour
    // Using 0 as a neutral level to avoid disrupting actual sleep
    await client.setHeatingLevel(0, 3600);

    // If we get here without throwing, the request succeeded
    expect(true).toBe(true);
  });

  test('getSleepTrends returns sleep data', async () => {
    if (!client) {
      client = new SleepClient();
      await client.authenticate(email!, password!);
    }

    // Get last 7 days of sleep data
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const from = weekAgo.toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];

    const trends = await client.getSleepTrends(from, to, 'America/New_York');

    expect(Array.isArray(trends)).toBe(true);
    // May be empty if no sleep data in range, which is valid
    if (trends.length > 0) {
      const day = trends[0];
      expect(day.day).toBeDefined();
      expect(typeof day.score).toBe('number');
      expect(typeof day.sleepDuration).toBe('number');
    }
  });
});
