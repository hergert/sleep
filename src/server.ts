#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  CompleteRequestSchema,
  GetPromptRequestSchema,
  InitializeRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type {
  CallToolRequest,
  CallToolResult,
  ListPromptsResult,
  ListResourcesResult,
} from '@modelcontextprotocol/sdk/types.js';
import { SleepClient } from './client.js';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { loadAuthConfig } from './auth/config.js';
import {
  initialiseAuth,
  handleAuthRequest,
  buildCorsHeaders,
  verifyAccessToken,
  OAuthError,
} from './auth/http.js';
import { SleepAuthProvider } from './providers/sleep/sleepProvider.js';
import { getProviderCredentials, getAuthProvider } from './auth/http.js';
import { hasPersistedCredentials, persistCredentials } from './auth/credentialStorage.js';
import type { CredentialPayload } from './auth/provider.js';

const SERVER_INFO = { name: 'sleep-mcp-server', version: '1.0.0' };
const PROTOCOL_VERSION = '2025-06-18';

const TIMEZONE = process.env.SLEEP_TIMEZONE ?? 'UTC';

const isoDateDaysAgo = (daysAgo: number) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
};

type RawAuthInfo = {
  token?: string;
  clientId?: string;
  scopes?: string[];
  expiresAt?: number;
  extra?: { subject?: string };
  [key: string]: unknown;
};

interface AuthContext {
  subject: string;
  clientId: string;
  authInfo: RawAuthInfo;
}

const ensureAuthenticated = (extra: { authInfo?: unknown }): RawAuthInfo => {
  if (!extra?.authInfo) {
    const error = new Error('Authentication required');
    (error as Error & { code?: number }).code = -32603;
    (error as any).httpStatus = 401;
    throw error;
  }
  return extra.authInfo as RawAuthInfo;
};

const getAuthContext = (extra: { authInfo?: unknown }): AuthContext => {
  const authInfo = ensureAuthenticated(extra);
  const clientId = authInfo.clientId;
  const subject = authInfo.extra?.subject;
  if (!clientId || !subject) {
    const error = new Error('Authenticated subject not available');
    (error as Error & { code?: number }).code = -32603;
    (error as any).httpStatus = 401;
    throw error;
  }
  return { subject, clientId, authInfo };
};

interface SleepExecutionContext {
  client: SleepClient;
  deviceId: string;
  credentials: CredentialPayload;
  subject: string;
  clientId: string;
}

const withSleepClient = async <T>(
  extra: { authInfo?: unknown },
  handler: (context: SleepExecutionContext) => Promise<T>
): Promise<T> => {
  const context = getAuthContext(extra);
  const provider = getAuthProvider();

  if (!provider) {
    const error = new Error('Authentication provider not initialized');
    (error as Error & { code?: number }).code = -32603;
    (error as any).httpStatus = 500;
    throw error;
  }

  const credentials = await getProviderCredentials(context.subject, context.clientId);
  if (!credentials) {
    const error = new Error('Account credentials not found. Please sign in again.');
    (error as Error & { code?: number }).code = -32603;
    (error as any).httpStatus = 401;
    throw error;
  }

  // Use provider to hydrate a fully configured client
  const client = (await provider.createClient(credentials)) as SleepClient;

  // Get Sleep-specific device ID from metadata
  const deviceId = credentials.metadata?.deviceId;
  if (typeof deviceId !== 'string' || deviceId.length === 0) {
    const error = new Error('No Sleep device associated with this account.');
    (error as Error & { code?: number }).code = -32603;
    (error as any).httpStatus = 412;
    throw error;
  }

  const result = await handler({
    client,
    deviceId,
    credentials,
    subject: context.subject,
    clientId: context.clientId,
  });

  // Check if tokens were refreshed and persist updates
  const updatedTokens = client.getTokenBundle();
  if (
    updatedTokens.accessToken !== credentials.accessToken ||
    updatedTokens.refreshToken !== credentials.refreshToken ||
    updatedTokens.expiresAt !== credentials.expiresAt
  ) {
    await persistCredentials(context.subject, context.clientId, provider.id, {
      ...credentials,
      accessToken: updatedTokens.accessToken,
      refreshToken: updatedTokens.refreshToken,
      expiresAt: updatedTokens.expiresAt,
    });
  }

  return result;
};

const normalizeDaysWindow = (value: unknown): number => {
  if (value === undefined || value === null || value === '') {
    return 7;
  }

  const numeric = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  if (!Number.isFinite(numeric)) {
    const error = new Error('Argument "days" must be an integer between 1 and 14.');
    (error as Error & { code?: number }).code = -32602;
    throw error;
  }

  const coerced = Math.trunc(numeric);
  if (coerced < 1 || coerced > 14) {
    const error = new Error('Argument "days" must be between 1 and 14.');
    (error as Error & { code?: number }).code = -32602;
    throw error;
  }
  return coerced;
};

export async function bootstrap(): Promise<void> {
  console.log('[mcp] Sleep MCP server initialised. Awaiting user authentication via OAuth.');
}

export const server = new Server(
  SERVER_INFO,
  {
    capabilities: {
      logging: {},
      tools: { listChanged: false },
      resources: { subscribe: false, listChanged: false },
      prompts: { listChanged: false },
      completions: {},
    },
  }
);

server.setRequestHandler(InitializeRequestSchema, async () => ({
  protocolVersion: PROTOCOL_VERSION,
  capabilities: {
    logging: {},
    tools: { listChanged: false },
    resources: { subscribe: false, listChanged: false },
    prompts: { listChanged: false },
    completions: {},
  },
  serverInfo: SERVER_INFO,
}));

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'set_temperature',
      title: 'Set Pod Temperature',
      description: 'Adjust the pod temperature for your side.',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        required: ['level'],
        properties: {
          level: {
            type: 'number',
            minimum: -100,
            maximum: 100,
            description: 'Heating level from -100 (cooling) to 100 (heating).',
          },
          durationSeconds: {
            type: 'number',
            minimum: 0,
            default: 0,
            description: 'Duration in seconds (0 keeps the level until changed).',
          },
        },
      },
      outputSchema: {
        type: 'object',
        additionalProperties: false,
        required: ['status', 'level', 'durationSeconds'],
        properties: {
          status: { type: 'string', enum: ['ok'] },
          level: { type: 'number' },
          durationSeconds: { type: 'number' },
        },
      },
    },
    {
      name: 'get_sleep_trends',
      title: 'Get Sleep Trends',
      description: 'Retrieve historical sleep metrics for a date range.',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        required: ['from', 'to', 'timezone'],
        properties: {
          from: {
            type: 'string',
            format: 'date',
            description: 'Inclusive start date (YYYY-MM-DD).',
          },
          to: {
            type: 'string',
            format: 'date',
            description: 'Inclusive end date (YYYY-MM-DD).',
          },
          timezone: {
            type: 'string',
            description: 'IANA timezone used to aggregate daily metrics.',
          },
        },
      },
    },
    {
      name: 'get_device_status',
      title: 'Get Device Status',
      description: 'Get the current heating status for both sides of the pod.',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
      },
    },
  ],
}));

server.setRequestHandler(
  CallToolRequestSchema,
  async ({ params }: CallToolRequest, extra): Promise<CallToolResult> => {
    const { name, arguments: rawArgs = {} } = params;

    try {
      switch (name) {
        case 'set_temperature': {
          const { level, durationSeconds = 0 } = rawArgs as {
            level: number;
            durationSeconds?: number;
          };
          return await withSleepClient(extra, async ({ client }) => {
            await client.setHeatingLevel(level, durationSeconds);
            return {
              content: [
                {
                  type: 'text',
                  text: `Temperature set to ${level} for ${
                    durationSeconds === 0 ? 'an indefinite period' : `${durationSeconds} seconds`
                  }.`,
                },
              ],
              structuredContent: { status: 'ok', level, durationSeconds },
            };
          });
        }

        case 'get_sleep_trends': {
          const { from, to, timezone } = rawArgs as {
            from: string;
            to: string;
            timezone?: string;
          };
          const coercedTimezone = typeof timezone === 'string' ? timezone.trim() : '';
          if (!coercedTimezone) {
            const error = new Error('Argument "timezone" is required.');
            (error as Error & { code?: number }).code = -32602;
            throw error;
          }
          return await withSleepClient(extra, async ({ client }) => {
            const trends = await client.getSleepTrends(from, to, coercedTimezone);

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(trends, null, 2),
                  annotations: { audience: ['assistant'] },
                },
              ],
              structuredContent: trends as unknown as Record<string, unknown>,
            };
          });
        }

        case 'get_device_status': {
          return await withSleepClient(extra, async ({ client, deviceId }) => {
            const status = await client.getDeviceStatus(deviceId);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(status, null, 2),
                  annotations: { audience: ['assistant', 'user'] },
                },
              ],
              structuredContent: status as unknown as Record<string, unknown>,
            };
          });
        }

        default:
          return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true,
          };
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Tool ${name} failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.setRequestHandler(
  ListResourcesRequestSchema,
  async (_request, extra): Promise<ListResourcesResult> => {
    ensureAuthenticated(extra);
    return {
      resources: [
        {
          uri: 'sleep://device/status',
          name: 'device-status',
          title: 'Current Device Status',
          description: 'Heating levels, targets, and timers for the active pod.',
          mimeType: 'application/json',
          annotations: {
            audience: ['assistant', 'user'],
            priority: 0.9,
            lastModified: new Date().toISOString(),
          },
        },
        {
          uri: 'sleep://sleep/latest',
          name: 'latest-sleep',
          title: 'Latest Sleep Session',
          description: 'Most recent nightly sleep metrics snapshot.',
          mimeType: 'application/json',
          annotations: {
            audience: ['assistant'],
            priority: 0.8,
            lastModified: new Date().toISOString(),
          },
        },
      ],
    };
  }
);

server.setRequestHandler(ReadResourceRequestSchema, async ({ params }, extra) => {
  const { uri } = params;

  if (uri === 'sleep://device/status') {
    return withSleepClient(extra, async ({ client, deviceId }) => {
      const status = await client.getDeviceStatus(deviceId);
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(status),
          },
        ],
      };
    });
  }

  if (uri === 'sleep://sleep/latest') {
    return withSleepClient(extra, async ({ client }) => {
      const [latest] = await client.getSleepTrends(isoDateDaysAgo(7), isoDateDaysAgo(0), TIMEZONE);
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(latest ?? null),
          },
        ],
      };
    });
  }

  const error = new Error(`Unknown resource URI: ${uri}`);
  (error as Error & { code?: number }).code = -32602;
  throw error;
});

server.setRequestHandler(
  ListPromptsRequestSchema,
  async (_request, extra): Promise<ListPromptsResult> => {
    ensureAuthenticated(extra);
    return {
      prompts: [
        {
          name: 'analyze_sleep',
          title: 'Analyze Sleep Quality',
          description: 'Guide the assistant through summarizing recent sleep metrics.',
          arguments: [
            {
              name: 'days',
              description: 'Number of days to review (default 7, max 14).',
              required: false,
              default: 7,
            },
          ],
        },
      ],
    };
  }
);

server.setRequestHandler(GetPromptRequestSchema, async ({ params }, extra) => {
  if (params.name !== 'analyze_sleep') {
    const error = new Error(`Unknown prompt: ${params.name}`);
    (error as Error & { code?: number }).code = -32602;
    throw error;
  }

  ensureAuthenticated(extra);
  const days = normalizeDaysWindow(params.arguments?.days);

  return {
    description: 'Analyze Sleep metrics and recommend actions.',
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Analyze my Sleep data for the last ${days} days. Highlight score trends, restlessness, duration, and temperature adjustments.`,
          annotations: { audience: ['assistant'], priority: 1.0 },
        },
      },
      {
        role: 'assistant',
        content: {
          type: 'text',
          text: 'Sure—fetch the latest metrics (e.g., `sleep://sleep/latest` and `sleep://device/status`), summarize top takeaways, note anomalies, and suggest practical adjustments.',
          annotations: { audience: ['user'], priority: 0.6 },
        },
      },
    ],
  };
});

server.setRequestHandler(CompleteRequestSchema, async ({ params }, extra) => {
  if (params.ref.type === 'ref/prompt' && params.ref.name === 'analyze_sleep') {
    if (params.argument.name !== 'days') {
      return { completion: { values: [], total: 0 } };
    }
    ensureAuthenticated(extra);

    const seedOptions = ['3', '5', '7', '10', '14'];
    const query = params.argument.value?.toString() ?? '';
    const values = seedOptions.filter((option) =>
      option.startsWith(query.replace(/^\s+/, ''))
    );

    return {
      completion: {
        values,
        total: values.length,
      },
    };
  }

  return { completion: { values: [], total: 0 } };
});

export async function start(): Promise<void> {
  const port = Number.parseInt(process.env.PORT ?? '3000', 10);
  const enableJsonResponse = process.env.MCP_ENABLE_JSON_RESPONSE !== 'false';

  let httpServer: ReturnType<typeof createServer> | undefined;
  try {
    await bootstrap();

    // Initialize authentication with Sleep provider
    const sleepProvider = new SleepAuthProvider();
    const defaultScopes = [
      'sleep.read_device',
      'sleep.read_trends',
      'sleep.write_temperature',
      'sleep.prompts.analyze',
    ];
    const authConfig = loadAuthConfig(port, defaultScopes);
    await initialiseAuth(authConfig, { provider: sleepProvider });
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      enableJsonResponse,
      allowedHosts:
        authConfig.allowedHosts.length > 0 ? authConfig.allowedHosts : undefined,
      allowedOrigins:
        authConfig.allowedOrigins.length > 0 ? authConfig.allowedOrigins : undefined,
      enableDnsRebindingProtection: authConfig.dnsRebindingProtection,
    });
    await server.connect(transport);
    httpServer = createServer(async (req, res) => {
      try {
        if (!req.url) {
          res.writeHead(400).end();
          return;
        }

        const url = new URL(req.url, authConfig.issuer);

        // Apply CORS headers early for all OAuth and MCP endpoints
        let corsHeaders: Record<string, string> = {};
        const isOAuthPath = ['/authorize', '/token', '/jwks.json', '/.well-known/oauth-authorization-server', '/register'].includes(url.pathname);
        if (req.method === 'OPTIONS' || url.pathname.startsWith('/mcp') || isOAuthPath) {
          try {
            corsHeaders = buildCorsHeaders(authConfig, req.headers.origin);
          } catch (error) {
            if (error instanceof OAuthError) {
              res
                .writeHead(error.status, { 'Content-Type': 'application/json' })
                .end(
                  JSON.stringify({
                    error: error.error,
                    error_description: error.description,
                  })
                );
              return;
            }
            throw error;
          }
        }
        for (const [header, value] of Object.entries(corsHeaders)) {
          res.setHeader(header, value);
        }

        if (req.method === 'OPTIONS') {
          res.writeHead(204).end();
          return;
        }

        if (await handleAuthRequest(authConfig, req, res, url)) {
          return;
        }

        if (url.pathname === '/health') {
          if (req.method && req.method !== 'GET') {
            res.writeHead(405).end();
            return;
          }
          res
            .writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders })
            .end(JSON.stringify({ status: 'ok', authenticated: await hasPersistedCredentials(sleepProvider.id) }));
          return;
        }

        if (!url.pathname.startsWith('/mcp')) {
          res.writeHead(404).end();
          return;
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res
            .writeHead(401, {
              'Content-Type': 'application/json',
              'WWW-Authenticate': 'Bearer realm="sleep-mcp-server"',
              ...corsHeaders,
            })
            .end(JSON.stringify({ error: 'invalid_token', error_description: 'Bearer token required' }));
          return;
        }

        const token = authHeader.slice('Bearer '.length);
        let verified;
        try {
          verified = verifyAccessToken(authConfig, token);
        } catch (error) {
          res
            .writeHead(401, {
              'Content-Type': 'application/json',
              'WWW-Authenticate': 'Bearer error="invalid_token"',
              ...corsHeaders,
            })
            .end(
              JSON.stringify({
                error: 'invalid_token',
                error_description: (error as Error).message,
              })
            );
          return;
        }

        (req as any).auth = {
          token,
          clientId: verified.clientId,
          scopes: verified.scopes,
          expiresAt: verified.expiresAt,
          extra: { subject: verified.subject },
        };

        await transport.handleRequest(req as any, res);
      } catch (error) {
        console.error('[mcp] Failed to handle HTTP request:', error);
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
        }
        res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            error: { code: -32603, message: 'Internal error' },
            id: null,
          })
        );
      }
    });
    httpServer.listen(port, () => {
      console.error(`[mcp] Streamable HTTP transport listening on http://localhost:${port}/mcp`);
    });

    const shutdown = () => {
      console.error('[mcp] Shutting down HTTP server');
      httpServer?.close(() => process.exit(0));
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error(
      `Failed to start Sleep MCP server: ${error instanceof Error ? error.message : String(error)}`
    );
    httpServer?.close?.();
    process.exit(1);
  }
}

// Main module detection - only for Node.js direct execution
// In Workers, this file is imported by worker.ts, not executed directly
if (typeof process !== 'undefined' && process.argv && import.meta.url) {
  try {
    const { fileURLToPath } = await import('node:url');
    const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
    if (isMainModule) {
      void start();
    }
  } catch {
    // Not in Node.js environment
  }
}
