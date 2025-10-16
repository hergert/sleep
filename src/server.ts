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
  ListToolsResult,
} from '@modelcontextprotocol/sdk/types.js';
import { SleepClient } from './client.js';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const SERVER_INFO = { name: 'sleep-mcp-server', version: '1.0.0' };
const PROTOCOL_VERSION = '2025-06-18';

const EMAIL = process.env.SLEEP_EMAIL || process.env.EMAIL;
const PASSWORD = process.env.SLEEP_PASSWORD || process.env.PASSWORD;
const TIMEZONE = process.env.SLEEP_TIMEZONE ?? 'UTC';

if (!EMAIL || !PASSWORD) {
  throw new Error(
    'Missing credentials: set SLEEP_EMAIL and SLEEP_PASSWORD environment variables.'
  );
}

export const client = new SleepClient();
let deviceId: string;

const isoDateDaysAgo = (daysAgo: number) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
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
  await client.authenticate(EMAIL!, PASSWORD!);
  const profile = await client.getUserProfile();

  deviceId = profile.currentDevice?.id ?? '';
  if (!deviceId) {
    throw new Error('No active Sleep device associated with the authenticated account.');
  }

  console.error(`[mcp] Authenticated Sleep user: ${profile.email}`);
  console.error(`[mcp] Active device detected: ${deviceId}`);
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
        required: ['from', 'to'],
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
            default: TIMEZONE,
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
  async ({ params }: CallToolRequest): Promise<CallToolResult> => {
    const { name, arguments: rawArgs = {} } = params;

    try {
      switch (name) {
        case 'set_temperature': {
          const { level, durationSeconds = 0 } = rawArgs as {
            level: number;
            durationSeconds?: number;
          };
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
        }

        case 'get_sleep_trends': {
          const { from, to, timezone = TIMEZONE } = rawArgs as {
            from: string;
            to: string;
            timezone?: string;
          };
          const trends = await client.getSleepTrends(from, to, timezone);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(trends, null, 2),
                annotations: { audience: ['assistant'] },
              },
            ],
            structuredContent: trends as unknown as { [x: string]: unknown },
          };
        }

        case 'get_device_status': {
          const status = await client.getDeviceStatus(deviceId);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(status, null, 2),
                annotations: { audience: ['assistant', 'user'] },
              },
            ],
            structuredContent: status as unknown as { [x: string]: unknown },
          };
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
  async (): Promise<ListResourcesResult> => ({
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
  })
);

server.setRequestHandler(ReadResourceRequestSchema, async ({ params }) => {
  const { uri } = params;

  if (uri === 'sleep://device/status') {
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
  }

  if (uri === 'sleep://sleep/latest') {
    const [latest] = await client.getSleepTrends(
      isoDateDaysAgo(7),
      isoDateDaysAgo(0),
      TIMEZONE
    );
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(latest ?? null),
        },
      ],
    };
  }

  const error = new Error(`Unknown resource URI: ${uri}`);
  (error as Error & { code?: number }).code = -32602;
  throw error;
});

server.setRequestHandler(
  ListPromptsRequestSchema,
  async (): Promise<ListPromptsResult> => ({
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
  })
);

server.setRequestHandler(GetPromptRequestSchema, async ({ params }) => {
  if (params.name !== 'analyze_sleep') {
    const error = new Error(`Unknown prompt: ${params.name}`);
    (error as Error & { code?: number }).code = -32602;
    throw error;
  }

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

server.setRequestHandler(CompleteRequestSchema, async ({ params }) => {
  if (params.ref.type === 'ref/prompt' && params.ref.name === 'analyze_sleep') {
    if (params.argument.name !== 'days') {
      return { completion: { values: [], total: 0 } };
    }

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
  const allowedHosts = process.env.MCP_ALLOWED_HOSTS?.split(',').map((host) => host.trim()).filter(Boolean);
  const allowedOrigins = process.env.MCP_ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean);
  const enableDnsProtection = process.env.MCP_ENABLE_DNS_PROTECTION === 'true';
  const enableJsonResponse = process.env.MCP_ENABLE_JSON_RESPONSE !== 'false';

  let httpServer: ReturnType<typeof createServer> | undefined;
  try {
    await bootstrap();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      enableJsonResponse,
      allowedHosts: allowedHosts && allowedHosts.length > 0 ? allowedHosts : undefined,
      allowedOrigins: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : undefined,
      enableDnsRebindingProtection: enableDnsProtection,
    });
    await server.connect(transport);
    httpServer = createServer(async (req, res) => {
      try {
        if (!req.url) {
          res.writeHead(400).end();
          return;
        }

        if (req.url.startsWith('/health')) {
          if (req.method && req.method !== 'GET') {
            res.writeHead(405).end();
            return;
          }
          res
            .writeHead(200, { 'Content-Type': 'application/json' })
            .end(JSON.stringify({ status: 'ok', authenticated: Boolean(deviceId) }));
          return;
        }

        if (!req.url.startsWith('/mcp')) {
          res.writeHead(404).end();
          return;
        }

        await transport.handleRequest(req, res);
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

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  void start();
}
