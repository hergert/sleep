import { describe, expect, test, vi, beforeEach } from 'vitest';

const mockClient = {
  authenticate: vi.fn(),
  getUserProfile: vi.fn(),
  setHeatingLevel: vi.fn(),
  getSleepTrends: vi.fn(),
  getDeviceStatus: vi.fn(),
};

vi.mock('./client.js', () => ({
  SleepClient: vi.fn(() => mockClient),
}));

const resetMockClient = () => {
  mockClient.authenticate.mockReset();
  mockClient.getUserProfile.mockReset();
  mockClient.setHeatingLevel.mockReset();
  mockClient.getSleepTrends.mockReset();
  mockClient.getDeviceStatus.mockReset();
};

const createExtra = (options?: { scopes?: string[]; authenticated?: boolean }) => {
  const scopes =
    options?.scopes ??
    ['sleep.read_device', 'sleep.read_trends', 'sleep.write_temperature', 'sleep.prompts.analyze'];
  const authenticated = options?.authenticated ?? true;
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
      clientId: 'sleep-cli',
      scopes,
      expiresAt: Date.now() / 1000 + 60,
    },
  };
};

const loadServer = async () => {
  vi.resetModules();
  resetMockClient();

  process.env.SLEEP_EMAIL = 'user@example.com';
  process.env.SLEEP_PASSWORD = 'secret';
  process.env.SLEEP_TIMEZONE = 'UTC';

  return import('./server.js');
};

describe('Sleep MCP server', () => {
  beforeEach(() => {
    resetMockClient();
  });

  test('fails fast when credentials are missing', async () => {
    vi.resetModules();
    resetMockClient();
    delete process.env.SLEEP_EMAIL;
    delete process.env.SLEEP_PASSWORD;

    await expect(import('./server.js')).rejects.toThrow(/Missing credentials/);
  });

  test('bootstrap authenticates and caches device metadata', async () => {
    const { bootstrap, client } = await loadServer();

    mockClient.authenticate.mockResolvedValue(undefined);
    mockClient.getUserProfile.mockResolvedValue({
      email: 'user@example.com',
      firstName: 'Test',
      currentDevice: { id: 'device-123', side: 'right' },
    });

    await bootstrap();

    expect(mockClient.authenticate).toHaveBeenCalledWith('user@example.com', 'secret');
    expect(mockClient.getUserProfile).toHaveBeenCalledTimes(1);
    // ensure exported client is the same mocked instance
    expect(client).toBe(mockClient);
  });

  test('initialize handler advertises protocol version and capabilities', async () => {
    const { bootstrap, server } = await loadServer();

    mockClient.authenticate.mockResolvedValue(undefined);
    mockClient.getUserProfile.mockResolvedValue({
      email: 'user@example.com',
      firstName: 'Test',
      currentDevice: { id: 'device-123', side: 'right' },
    });
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
    mockClient.authenticate.mockResolvedValue(undefined);
    mockClient.getUserProfile.mockResolvedValue({
      email: 'user@example.com',
      firstName: 'Test',
      currentDevice: { id: 'device-123', side: 'right' },
    });
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
    mockClient.authenticate.mockResolvedValue(undefined);
    mockClient.getUserProfile.mockResolvedValue({
      email: 'user@example.com',
      firstName: 'Test',
      currentDevice: { id: 'device-123', side: 'right' },
    });
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

  test('resources/list succeeds with authenticated request regardless of scopes', async () => {
    const { bootstrap, server } = await loadServer();
    mockClient.authenticate.mockResolvedValue(undefined);
    mockClient.getUserProfile.mockResolvedValue({
      email: 'user@example.com',
      firstName: 'Test',
      currentDevice: { id: 'device-123', side: 'right' },
    });
    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'resources/list'
    );
    const result = await handler!({ method: 'resources/list', params: {} }, createExtra({ scopes: [] }));
    expect(result.resources).toHaveLength(2);
  });

  test('tools/call set_temperature forwards arguments and returns structuredContent', async () => {
    const { bootstrap, server } = await loadServer();
    mockClient.authenticate.mockResolvedValue(undefined);
    mockClient.getUserProfile.mockResolvedValue({
      email: 'user@example.com',
      firstName: 'Test',
      currentDevice: { id: 'device-123', side: 'right' },
    });
    mockClient.setHeatingLevel.mockResolvedValue(undefined);
    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'tools/call'
    );
    expect(handler).toBeDefined();
    const result = await handler!(
      {
        method: 'tools/call',
        params: { name: 'set_temperature', arguments: { level: 25, durationSeconds: 60 } },
      },
      createExtra({ scopes: [] })
    );

    expect(mockClient.setHeatingLevel).toHaveBeenCalledWith(25, 60);
    expect(result.structuredContent).toEqual({ status: 'ok', level: 25, durationSeconds: 60 });
    expect(result.content[0].text).toMatch(/Temperature set to 25/);
  });

  test('tools/call set_temperature rejects unauthenticated requests', async () => {
    const { bootstrap, server } = await loadServer();
    mockClient.authenticate.mockResolvedValue(undefined);
    mockClient.getUserProfile.mockResolvedValue({
      email: 'user@example.com',
      firstName: 'Test',
      currentDevice: { id: 'device-123', side: 'right' },
    });
    await bootstrap();

    const handler = (server as unknown as { _requestHandlers: Map<string, Function> })._requestHandlers.get(
      'tools/call'
    );
    expect(handler).toBeDefined();

    await expect(
      handler!(
        {
          method: 'tools/call',
          params: { name: 'set_temperature', arguments: { level: 10, durationSeconds: 30 } },
        },
        createExtra({ authenticated: false })
      )
    ).rejects.toMatchObject({ message: expect.stringContaining('Authentication required') });
  });

  test('resources/read returns serialized device status', async () => {
    const { bootstrap, server } = await loadServer();
    mockClient.authenticate.mockResolvedValue(undefined);
    mockClient.getUserProfile.mockResolvedValue({
      email: 'user@example.com',
      firstName: 'Test',
      currentDevice: { id: 'device-123', side: 'right' },
    });
    const statusPayload = { leftHeatingLevel: 0, rightHeatingLevel: 10 };
    mockClient.getDeviceStatus.mockResolvedValue(statusPayload);
    await bootstrap();

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
    mockClient.authenticate.mockResolvedValue(undefined);
    mockClient.getUserProfile.mockResolvedValue({
      email: 'user@example.com',
      firstName: 'Test',
      currentDevice: { id: 'device-123', side: 'right' },
    });
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
    mockClient.authenticate.mockResolvedValue(undefined);
    mockClient.getUserProfile.mockResolvedValue({
      email: 'user@example.com',
      firstName: 'Test',
      currentDevice: { id: 'device-123', side: 'right' },
    });
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
    mockClient.authenticate.mockResolvedValue(undefined);
    mockClient.getUserProfile.mockResolvedValue({
      email: 'user@example.com',
      firstName: 'Test',
      currentDevice: { id: 'device-123', side: 'right' },
    });
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
    mockClient.authenticate.mockResolvedValue(undefined);
    mockClient.getUserProfile.mockResolvedValue({
      email: 'user@example.com',
      firstName: 'Test',
      currentDevice: { id: 'device-123', side: 'right' },
    });
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
    mockClient.authenticate.mockResolvedValue(undefined);
    mockClient.getUserProfile.mockResolvedValue({
      email: 'user@example.com',
      firstName: 'Test',
      currentDevice: { id: 'device-123', side: 'right' },
    });
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
