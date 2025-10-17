import { describe, expect, test, vi, beforeEach } from 'vitest';
import { loadAuthConfig } from './auth/config.js';
import { SleepAuthProvider } from './providers/sleep/sleepProvider.js';
import type { CredentialPayload } from './auth/provider.js';

type CredentialStorageModule = typeof import('./auth/credentialStorage.js');
let credentialStorage: CredentialStorageModule | undefined;

const mockClient = {
  authenticate: vi.fn(),
  getUserProfile: vi.fn(),
  setHeatingLevel: vi.fn(),
  getSleepTrends: vi.fn(),
  getDeviceStatus: vi.fn(),
  getTokenBundle: vi.fn(),
  ensureFreshTokens: vi.fn(),
};

vi.mock('./client.js', () => ({
  SleepClient: vi.fn(() => mockClient),
}));

const DEFAULT_SUBJECT = 'user-123';
const DEFAULT_CLIENT_ID = 'sleep-cli';
const DEFAULT_DEVICE_ID = 'device-123';
const TOKEN_EXPIRES_AT = 1_700_000_000_000;
const DEFAULT_TOKEN_BUNDLE = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  expiresAt: TOKEN_EXPIRES_AT,
  userId: DEFAULT_SUBJECT,
};
const BASE_CREDENTIALS: CredentialPayload = {
  ...DEFAULT_TOKEN_BUNDLE,
  metadata: {
    deviceId: DEFAULT_DEVICE_ID,
    firstName: 'Test',
  },
};

const resetMockClient = () => {
  mockClient.authenticate.mockReset();
  mockClient.getUserProfile.mockReset();
  mockClient.setHeatingLevel.mockReset();
  mockClient.getSleepTrends.mockReset();
  mockClient.getDeviceStatus.mockReset();
  mockClient.getTokenBundle.mockReset();
  mockClient.ensureFreshTokens.mockReset();
  mockClient.getTokenBundle.mockImplementation(() => ({ ...DEFAULT_TOKEN_BUNDLE }));
  mockClient.ensureFreshTokens.mockImplementation(() => ({ ...DEFAULT_TOKEN_BUNDLE }));
};

const createExtra = (options?: {
  scopes?: string[];
  authenticated?: boolean;
  subject?: string;
}) => {
  const scopes =
    options?.scopes ??
    ['sleep.read_device', 'sleep.read_trends', 'sleep.write_temperature', 'sleep.prompts.analyze'];
  const authenticated = options?.authenticated ?? true;
  const subject = options?.subject ?? DEFAULT_SUBJECT;
  const base = {
    signal: new AbortController().signal,
    requestId: 1,
    sendNotification: vi.fn(),
    sendRequest: vi.fn(),
  };
  if (!authenticated) {
    return base;
  }
  return {
    ...base,
    authInfo: {
      token: 'test-token',
      clientId: DEFAULT_CLIENT_ID,
      scopes,
      expiresAt: Date.now() / 1000 + 60,
      extra: { subject },
    },
  };
};

const loadServer = async () => {
  vi.resetModules();
  resetMockClient();

  const encryptionKey = Buffer.alloc(32, 2).toString('base64');
  process.env.AUTH_ENCRYPTION_KEY = encryptionKey;
  process.env.AUTH_JWT_SECRET = 'unit-test-secret';
  process.env.SLEEP_TIMEZONE = 'UTC';
  process.env.AUTH_SESSION_SECRET = 'session-secret';
  const provider = new SleepAuthProvider();
  process.env.AUTH_CLIENTS_JSON = JSON.stringify([
    {
      clientId: DEFAULT_CLIENT_ID,
      clientSecret: 'dev-secret',
      redirectUris: ['http://localhost:8765/callback'],
      scopes: provider.defaultScopes,
      isPublic: false,
    },
  ]);

  credentialStorage = await import('./auth/credentialStorage.js');
  const authHttp = await import('./auth/http.js');
  const module = await import('./server.js');
  const config = loadAuthConfig(3000, provider.defaultScopes);
  credentialStorage.initialiseCredentialStorage(config);
  await authHttp.initialiseAuth(config, { provider });
  if (!authHttp.getAuthProvider()) {
    throw new Error('Authentication provider failed to initialize in tests');
  }
  return module;
};

const seedSleepAccount = async (overrides?: Partial<CredentialPayload> & { deviceId?: string }) => {
  if (!credentialStorage) {
    throw new Error('Credential storage not initialised');
  }
  const subject = overrides?.userId ?? DEFAULT_SUBJECT;
  const overrideMetadata = (overrides?.metadata ?? {}) as Record<string, unknown>;
  const metadataDeviceIdValue =
    typeof overrideMetadata.deviceId === 'string'
      ? (overrideMetadata.deviceId as string)
      : overrides?.deviceId;
  const credentials: CredentialPayload = {
    ...BASE_CREDENTIALS,
    ...overrides,
    metadata: {
      ...(BASE_CREDENTIALS.metadata ?? {}),
      ...overrideMetadata,
      deviceId: metadataDeviceIdValue ?? DEFAULT_DEVICE_ID,
    },
  };
  await credentialStorage.persistCredentials(subject, DEFAULT_CLIENT_ID, 'sleep', credentials);
  const stored = await credentialStorage.getPersistedCredentials(subject, DEFAULT_CLIENT_ID);
  if (!stored) {
    throw new Error('Failed to seed Sleep account for tests');
  }
  return stored;
};

describe('Sleep MCP server', () => {
  beforeEach(() => {
    resetMockClient();
  });

  test('bootstrap completes without calling Sleep API', async () => {
    const { bootstrap } = await loadServer();

    await expect(bootstrap()).resolves.toBeUndefined();
    expect(mockClient.authenticate).not.toHaveBeenCalled();
    expect(mockClient.getUserProfile).not.toHaveBeenCalled();
  });

  test('initialize handler advertises protocol version and capabilities', async () => {
    const { bootstrap, server } = await loadServer();

    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'initialize'
    );
    expect(handler).toBeDefined();
    const result = await handler!(
      {
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {},
          clientInfo: { name: 'test-client', version: '0.0.0' },
        },
      },
      createExtra()
    );

    expect(result.protocolVersion).toBe('2025-06-18');
    expect(result.capabilities.tools).toEqual({ listChanged: false });
    expect(result.capabilities.resources).toEqual({ subscribe: false, listChanged: false });
    expect(result.capabilities.prompts).toEqual({ listChanged: false });
    expect(result.capabilities.completions).toEqual({});
  });

  test('tools/list exposes tool schemas', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'tools/list'
    );
    expect(handler).toBeDefined();
    const result = await handler!({ method: 'tools/list', params: {} }, createExtra());

    expect(result.tools).toHaveLength(3);
    const setTemperature = result.tools.find((tool: { name: string }) => tool.name === 'set_temperature');
    expect(setTemperature?.inputSchema.required).toContain('level');
    expect(setTemperature?.outputSchema.required).toEqual(['status', 'level', 'durationSeconds']);
  });

  test('resources/list exposes annotated resources', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'resources/list'
    );
    expect(handler).toBeDefined();
    const result = await handler!({ method: 'resources/list', params: {} }, createExtra());

    expect(result.resources).toHaveLength(2);
    expect(result.resources[0].uri).toBe('sleep://device/status');
    expect(result.resources[0].annotations?.priority).toBeCloseTo(0.9);
    expect(result.resources[1].annotations?.priority).toBeCloseTo(0.8);
  });

  test('tools/call get_sleep_trends requires caller-supplied timezone', async () => {
    const { bootstrap, server } = await loadServer();
    mockClient.getSleepTrends.mockResolvedValueOnce([{ date: '2024-01-02' }]);
    await bootstrap();
    await seedSleepAccount();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'tools/call'
    );
    expect(handler).toBeDefined();
    const result = await handler!(
      {
        method: 'tools/call',
        params: {
          name: 'get_sleep_trends',
          arguments: { from: '2024-01-01', to: '2024-01-07', timezone: 'America/Los_Angeles' },
        },
      },
      createExtra()
    );

    expect(mockClient.getSleepTrends).toHaveBeenCalledWith(
      '2024-01-01',
      '2024-01-07',
      'America/Los_Angeles'
    );
    expect(result.isError).not.toBe(true);
    expect(Array.isArray(result.structuredContent)).toBe(true);
  });

  test('tools/call get_sleep_trends rejects missing timezone', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'tools/call'
    );
    expect(handler).toBeDefined();
    const result = await handler!(
      {
        method: 'tools/call',
        params: {
          name: 'get_sleep_trends',
          arguments: { from: '2024-01-01', to: '2024-01-07' },
        },
      },
      createExtra()
    );

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('timezone');
  });

  test('resources/read latest sleep uses default timezone', async () => {
    const { bootstrap, server } = await loadServer();
    mockClient.getSleepTrends.mockResolvedValueOnce([{ date: '2024-01-03' }]);
    await bootstrap();
    await seedSleepAccount();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'resources/read'
    );
    expect(handler).toBeDefined();
    const result = await handler!(
      {
        method: 'resources/read',
        params: { uri: 'sleep://sleep/latest' },
      },
      createExtra()
    );

    expect(mockClient.getSleepTrends).toHaveBeenCalledWith(expect.any(String), expect.any(String), 'UTC');
    expect(result.contents[0]?.mimeType).toBe('application/json');
  });

  test('resources/list succeeds with authenticated request regardless of scopes', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'resources/list'
    );
    const result = await handler!({ method: 'resources/list', params: {} }, createExtra({ scopes: [] }));
    expect(result.resources).toHaveLength(2);
  });

  test('tools/call set_temperature forwards arguments and returns structuredContent', async () => {
    const { bootstrap, server } = await loadServer();
    mockClient.setHeatingLevel.mockResolvedValue(undefined);
    await bootstrap();
    await seedSleepAccount();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'tools/call'
    );
    expect(handler).toBeDefined();
    const result = await handler!(
      {
        method: 'tools/call',
        params: { name: 'set_temperature', arguments: { level: 25, durationSeconds: 60 } },
      },
      createExtra()
    );

    expect(mockClient.setHeatingLevel).toHaveBeenCalledWith(25, 60);
    expect(result.structuredContent).toEqual({ status: 'ok', level: 25, durationSeconds: 60 });
    expect(result.content[0].text).toMatch(/Temperature set to 25/);
  });

  test('tools/call set_temperature rejects unauthenticated requests', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'tools/call'
    );
    expect(handler).toBeDefined();

    const result = await handler!(
      {
        method: 'tools/call',
        params: { name: 'set_temperature', arguments: { level: 10, durationSeconds: 30 } },
      },
      createExtra({ authenticated: false })
    );

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Authentication required');
  });

  test('resources/read returns serialized device status', async () => {
    const { bootstrap, server } = await loadServer();
    const statusPayload = { leftHeatingLevel: 0, rightHeatingLevel: 10 };
    mockClient.getDeviceStatus.mockResolvedValue(statusPayload);
    await bootstrap();
    await seedSleepAccount();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'resources/read'
    );
    expect(handler).toBeDefined();
    const result = await handler!(
      { method: 'resources/read', params: { uri: 'sleep://device/status' } },
      createExtra()
    );

    expect(mockClient.getDeviceStatus).toHaveBeenCalledWith('device-123');
    expect(result.contents[0].mimeType).toBe('application/json');
    expect(JSON.parse(result.contents[0].text)).toEqual(statusPayload);
  });

  test('resources/read rejects unknown URIs with MCP error code', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'resources/read'
    );
    expect(handler).toBeDefined();

    await expect(
      handler!({ method: 'resources/read', params: { uri: 'sleep://unknown' } }, createExtra())
    ).rejects.toMatchObject({ code: -32602 });
  });

  test('prompts/get returns templated messages', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'prompts/get'
    );
    expect(handler).toBeDefined();
    const result = await handler!(
      { method: 'prompts/get', params: { name: 'analyze_sleep', arguments: { days: '5' } } },
      createExtra({ scopes: [] })
    );

    expect(result.messages).toHaveLength(2);
    expect(result.messages[0].content.text).toMatch(/last 5 days/);
    expect(result.messages[0].content.annotations?.priority).toBe(1);
  });

  test('prompts/get rejects unauthenticated requests', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'prompts/get'
    );
    expect(handler).toBeDefined();

    await expect(
      handler!(
        { method: 'prompts/get', params: { name: 'analyze_sleep', arguments: { days: '3' } } },
        createExtra({ authenticated: false })
      )
    ).rejects.toMatchObject({ message: expect.stringContaining('Authentication required') });
  });

  test('prompts/get rejects out-of-range days', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'prompts/get'
    );
    expect(handler).toBeDefined();

    await expect(
      handler!(
        { method: 'prompts/get', params: { name: 'analyze_sleep', arguments: { days: '20' } } },
        createExtra()
      )
    ).rejects.toMatchObject({ code: -32602 });
  });

  test('completion handler suggests common day windows', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'completion/complete'
    );
    expect(handler).toBeDefined();

    const result = await handler!(
      {
        method: 'completion/complete',
        params: {
          ref: { type: 'ref/prompt', name: 'analyze_sleep' },
          argument: { name: 'days', value: '1' },
        },
      },
      createExtra()
    );

    expect(result.completion.values).toEqual(['10', '14']);
    expect(result.completion.total).toBe(2);
  });
});
