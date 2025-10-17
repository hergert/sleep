import { describe, expect, test, vi, beforeEach } from 'vitest';
import type { Server as McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { loadAuthConfig } from '../../../platform/auth/config.js';
import { SleepAuthProvider } from '../../../providers/sleep/authProvider.js';
import type { CredentialPayload } from '../../../platform/auth/provider.js';

type CredentialStorageModule = typeof import('../../../platform/auth/credentialStorage.js');
let credentialStorage: CredentialStorageModule | undefined;

const mockClient = {
  authenticate: vi.fn(),
  getUserProfile: vi.fn(),
  setHeatingLevel: vi.fn(),
  getSleepTrends: vi.fn(),
  getSleepIntervals: vi.fn(),
  getDeviceStatus: vi.fn(),
  getTokenBundle: vi.fn(),
  ensureFreshTokens: vi.fn(),
};

vi.mock('../../../providers/sleep/client.js', () => ({
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
  mockClient.getSleepIntervals.mockReset();
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

  credentialStorage = await import('../../../platform/auth/credentialStorage.js');
  const authHttp = await import('../../../platform/auth/http.js');
  const { createMcpServer } = await import('../../../platform/mcp/server.js');
  const { registerSleepHandlers } = await import('../../../providers/sleep/tools.js');
  const { bootstrap } = await import('../startup.js');
  const config = loadAuthConfig(3000, provider.defaultScopes);
  credentialStorage.initialiseCredentialStorage(config);
  await authHttp.initialiseAuth(config, { provider });
  if (!authHttp.getAuthProvider()) {
    throw new Error('Authentication provider failed to initialize in tests');
  }
  const server: McpServer = createMcpServer({
    serverInfo: { name: 'sleep-mcp-server', version: '1.0.0' },
    protocolVersion: '2025-06-18',
  });
  registerSleepHandlers(server);
  return { server, bootstrap };
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

    const handler = (server as unknown as {
      _requestHandlers: Map<string, (request: unknown, extra?: unknown) => Promise<unknown>>;
    })._requestHandlers.get('initialize');
    expect(handler).toBeDefined();
    const result = (await handler!(
      {
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {},
          clientInfo: { name: 'test-client', version: '0.0.0' },
        },
      },
      createExtra()
    )) as any;

    expect(result.protocolVersion).toBe('2025-06-18');
    expect(result.capabilities.tools).toEqual({ listChanged: false });
    expect(result.capabilities.resources).toEqual({ subscribe: false, listChanged: false });
    expect(result.capabilities.prompts).toEqual({ listChanged: false });
    expect(result.capabilities.completions).toEqual({});
  });

  test('tools/list exposes tool schemas', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as {
      _requestHandlers: Map<string, (request: unknown, extra?: unknown) => Promise<unknown>>;
    })._requestHandlers.get('tools/list');
    expect(handler).toBeDefined();
    const result = (await handler!({ method: 'tools/list', params: {} }, createExtra())) as any;

    expect(result.tools).toHaveLength(4);
    const setTemperature = result.tools.find((tool: { name: string }) => tool.name === 'set_temperature');
    expect(setTemperature?.inputSchema.required).toContain('level');
    expect(setTemperature?.outputSchema.required).toEqual(['status', 'level', 'durationSeconds']);
  });

  test('resources/list exposes annotated resources', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as {
      _requestHandlers: Map<string, (request: unknown, extra?: unknown) => Promise<unknown>>;
    })._requestHandlers.get('resources/list');
    expect(handler).toBeDefined();
    const result = (await handler!({ method: 'resources/list', params: {} }, createExtra())) as any;

    expect(result.resources).toHaveLength(2);
    expect(result.resources[0].uri).toBe('sleep://device/status');
    expect(result.resources[0].annotations?.priority).toBeCloseTo(0.9);
    expect(result.resources[1].annotations?.priority).toBeCloseTo(0.8);
  });

  test('tools/call get_sleep_trends requires caller-supplied timezone', async () => {
    const { bootstrap, server } = await loadServer();
    mockClient.getSleepTrends.mockResolvedValueOnce({
      days: [
        {
          day: '2024-01-02',
          score: 85,
          sleepDuration: 25_000,
          latencyDuration: 600,
          outOfBedDuration: 300,
          restlessSleep: 0,
          lightSleepPercentage: 0.5,
          deepSleepPercentage: 0.3,
          remSleepPercentage: 0.2,
          stages: [],
          incomplete: false,
        },
      ],
      avgScore: 85,
    });
    await bootstrap();
    await seedSleepAccount();

    const handler = (server as unknown as {
      _requestHandlers: Map<string, (request: unknown, extra?: unknown) => Promise<unknown>>;
    })._requestHandlers.get('tools/call');
    expect(handler).toBeDefined();
    const result = (await handler!(
      {
        method: 'tools/call',
        params: {
          name: 'get_sleep_trends',
          arguments: { from: '2024-01-01', to: '2024-01-07', timezone: 'America/Los_Angeles' },
        },
      },
      createExtra()
    )) as any;

    expect(mockClient.getSleepTrends).toHaveBeenCalledWith(
      '2024-01-01',
      '2024-01-07',
      'America/Los_Angeles'
    );
    expect(result.isError).not.toBe(true);
    expect(result.structuredContent?.days).toHaveLength(1);
  });

  test('tools/call get_sleep_trends rejects missing timezone', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as {
      _requestHandlers: Map<string, (request: unknown, extra?: unknown) => Promise<unknown>>;
    })._requestHandlers.get('tools/call');
    expect(handler).toBeDefined();
    const result = (await handler!(
      {
        method: 'tools/call',
        params: {
          name: 'get_sleep_trends',
          arguments: { from: '2024-01-01', to: '2024-01-07' },
        },
      },
      createExtra()
    )) as any;

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('timezone');
  });

  test('resources/read latest sleep uses default timezone', async () => {
    const { bootstrap, server } = await loadServer();
    mockClient.getSleepTrends.mockResolvedValueOnce({
      days: [
        {
          day: '2024-01-03',
          score: 80,
          sleepDuration: 24_000,
          latencyDuration: 500,
          outOfBedDuration: 200,
          restlessSleep: 0,
          lightSleepPercentage: 0.5,
          deepSleepPercentage: 0.25,
          remSleepPercentage: 0.25,
          stages: [],
          incomplete: false,
        },
      ],
    });
    await bootstrap();
    await seedSleepAccount();

    const handler = (server as unknown as {
      _requestHandlers: Map<string, (request: unknown, extra?: unknown) => Promise<unknown>>;
    })._requestHandlers.get('resources/read');
    expect(handler).toBeDefined();
    const result = (await handler!(
      {
        method: 'resources/read',
        params: { uri: 'sleep://sleep/latest' },
      },
      createExtra()
    )) as any;

    expect(mockClient.getSleepTrends).toHaveBeenCalledWith(expect.any(String), expect.any(String), 'UTC');
    expect(result.contents[0]?.mimeType).toBe('application/json');
  });

  test('resources/list succeeds with authenticated request regardless of scopes', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as {
      _requestHandlers: Map<string, (request: unknown, extra?: unknown) => Promise<unknown>>;
    })._requestHandlers.get('resources/list');
    const result = (await handler!({ method: 'resources/list', params: {} }, createExtra({ scopes: [] }))) as any;
    expect(result.resources).toHaveLength(2);
  });

  test('tools/call set_temperature forwards arguments and returns structuredContent', async () => {
    const { bootstrap, server } = await loadServer();
    mockClient.setHeatingLevel.mockResolvedValue(undefined);
    await bootstrap();
    await seedSleepAccount();

    const handler = (server as unknown as {
      _requestHandlers: Map<string, (request: unknown, extra?: unknown) => Promise<unknown>>;
    })._requestHandlers.get('tools/call');
    expect(handler).toBeDefined();
    const result = (await handler!(
      {
        method: 'tools/call',
        params: { name: 'set_temperature', arguments: { level: 25, durationSeconds: 60 } },
      },
      createExtra()
    )) as any;

    expect(mockClient.setHeatingLevel).toHaveBeenCalledWith(25, 60);
    expect(result.structuredContent).toEqual({ status: 'ok', level: 25, durationSeconds: 60 });
    expect(result.content[0].text).toMatch(/Temperature set to 25/);
  });

  test('tools/call set_temperature rejects unauthenticated requests', async () => {
    const { bootstrap, server } = await loadServer();
    await bootstrap();

    const handler = (server as unknown as {
      _requestHandlers: Map<string, (request: unknown, extra?: unknown) => Promise<unknown>>;
    })._requestHandlers.get('tools/call');
    expect(handler).toBeDefined();

    const result = (await handler!(
      {
        method: 'tools/call',
        params: { name: 'set_temperature', arguments: { level: 10, durationSeconds: 30 } },
      },
      createExtra({ authenticated: false })
    )) as any;

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Authentication required');
  });

  test('resources/read returns serialized device status', async () => {
    const { bootstrap, server } = await loadServer();
    const statusPayload = { leftHeatingLevel: 0, rightHeatingLevel: 10 };
    mockClient.getDeviceStatus.mockResolvedValue(statusPayload);
    await bootstrap();
    await seedSleepAccount();

    const handler = (server as unknown as {
      _requestHandlers: Map<string, (request: unknown, extra?: unknown) => Promise<unknown>>;
    })._requestHandlers.get('resources/read');
    expect(handler).toBeDefined();
    const result = (await handler!(
      { method: 'resources/read', params: { uri: 'sleep://device/status' } },
      createExtra()
    )) as any;

    expect(mockClient.getDeviceStatus).toHaveBeenCalledWith('device-123');
    expect(result.contents[0].mimeType).toBe('application/json');
    expect(JSON.parse(result.contents[0].text)).toEqual(statusPayload);
  });
});
