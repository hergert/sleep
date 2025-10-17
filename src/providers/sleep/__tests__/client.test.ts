import { describe, test, expect, beforeAll } from 'vitest';
import { SleepClient } from '../client.js';

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

    await client.setHeatingLevel(0, 3600);
    expect(true).toBe(true);
  });

  test('getSleepTrends returns sleep data', async () => {
    if (!client) {
      client = new SleepClient();
      await client.authenticate(email!, password!);
    }

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const from = weekAgo.toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];

    const trends = await client.getSleepTrends(from, to, 'America/New_York');

    expect(trends).toBeDefined();
    expect(Array.isArray(trends.days)).toBe(true);
    if (trends.days.length > 0) {
      const day = trends.days[0];
      expect(day.day).toBeDefined();
      expect(typeof day.score).toBe('number');
      expect(typeof day.sleepDuration).toBe('number');
    }
  });
});
