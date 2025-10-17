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

  const storedCredentials = await getProviderCredentials(context.subject, context.clientId);
  if (!storedCredentials) {
    const error = new Error('Account credentials not found. Please sign in again.');
    (error as Error & { code?: number }).code = -32603;
    (error as any).httpStatus = 401;
    throw error;
  }

  let credentials = storedCredentials;
  if (provider.refreshCredentials) {
    const refreshed = await provider.refreshCredentials(storedCredentials);
    if (refreshed) {
      credentials = refreshed;
      await persistCredentials(context.subject, context.clientId, provider.id, refreshed);
    }
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
      description: 'Sets the heating/cooling level for the user\'s side of the Sleep pod. Use for temperature adjustments to improve comfort. Inputs: level (-100 to 100, where negative=cooling, positive=heating), optional durationSeconds (0=indefinite). Outputs: Confirmation with applied level and duration.',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        required: ['level'],
        properties: {
          level: {
            type: 'number',
            minimum: -100,
            maximum: 100,
            description: 'Heating level from -100 (maximum cooling) to 100 (maximum heating). 0 is neutral/off.',
          },
          durationSeconds: {
            type: 'number',
            minimum: 0,
            default: 0,
            description: 'Duration in seconds to maintain this level. 0 (default) keeps the level indefinitely until manually changed.',
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
      title: 'Fetch Historical Sleep Metrics',
      description: 'Retrieves nightly sleep metrics (sleep score, total duration, sleep stages breakdown, heart rate, respiratory rate, restlessness) for a specified date range. Use for trend analysis and identifying patterns over 1-14 days. Inputs: from/to dates (YYYY-MM-DD, ISO format), timezone (IANA format, e.g., "America/New_York"). Outputs: Summary object with daily entries, averages, and scoring breakdowns.',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        required: ['from', 'to', 'timezone'],
        properties: {
          from: {
            type: 'string',
            format: 'date',
            description: 'Inclusive start date in YYYY-MM-DD format (e.g., "2025-01-01"). Must be within last 90 days.',
          },
          to: {
            type: 'string',
            format: 'date',
            description: 'Inclusive end date in YYYY-MM-DD format (e.g., "2025-01-07"). Must be >= from date.',
          },
          timezone: {
            type: 'string',
            description: 'IANA timezone identifier (e.g., "America/New_York", "Europe/London", "UTC") used to aggregate daily metrics. Determines how overnight sessions are grouped into calendar days.',
          },
        },
      },
      outputSchema: {
        type: 'object',
        required: ['days', 'avgScore', 'avgSleepDuration'],
        properties: {
          days: {
            type: 'array',
            description: 'Per-day sleep metrics for the requested window',
            items: {
              type: 'object',
              required: ['day', 'score', 'sleepDuration', 'stages', 'incomplete'],
              properties: {
                day: { type: 'string', format: 'date', description: 'Date in YYYY-MM-DD format' },
                score: { type: 'number', description: 'Overall sleep quality score (0-100)' },
                sleepDuration: { type: 'number', description: 'Total sleep duration in seconds' },
                latencyDuration: { type: 'number', description: 'Time to fall asleep in seconds' },
                outOfBedDuration: { type: 'number', description: 'Time spent out of bed in seconds' },
                restlessSleep: { type: 'number', description: 'Restlessness metric' },
                lightSleepPercentage: { type: 'number', description: 'Percentage of light sleep (0-100)' },
                deepSleepPercentage: { type: 'number', description: 'Percentage of deep sleep (0-100)' },
                remSleepPercentage: { type: 'number', description: 'Percentage of REM sleep (0-100)' },
                stages: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['stage', 'duration'],
                    properties: {
                      stage: { type: 'string', description: 'Sleep stage name' },
                      duration: { type: 'number', description: 'Duration in seconds' },
                    },
                  },
                },
                incomplete: { type: 'boolean', description: 'Whether the sleep session is incomplete/ongoing' },
              },
            },
          },
          avgScore: { type: 'number', description: 'Average sleep score across the selected window' },
          avgPresenceDuration: { type: 'number', description: 'Average time in bed in seconds' },
          avgSleepDuration: { type: 'number', description: 'Average sleep duration in seconds' },
          avgDeepPercent: { type: 'number', description: 'Average percentage of deep sleep (0-1)' },
          avgTnt: { type: 'number', description: 'Average tosses and turns (TNT) count' },
          modelVersion: { type: 'string', description: 'Model version used for calculations' },
          sfsCalculator: { type: 'string', description: 'Sleep fitness score calculator version' },
          sleepFitnessScore: {
            type: 'object',
            description: 'Breakdown of the overall sleep fitness score components',
            properties: {},
            additionalProperties: true,
          },
          scoreBreakdown: {
            type: 'object',
            description: 'Detailed scoring categories such as total sleep, recovery, routine',
            properties: {},
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },
    },
    {
      name: 'get_sleep_intervals',
      title: 'Fetch Detailed Sleep Sessions',
      description: 'Retrieves granular, timestamped sleep session data including sleep stage transitions (awake/light/deep/REM), heart rate timeseries, respiratory rate timeseries, and pod temperature readings. Use for in-depth analysis of specific nights or investigating sleep quality issues. Inputs: None (fetches recent sessions). Outputs: Array of sleep intervals with minute-by-minute stage data, biometric readings, and environmental conditions.',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
      },
      outputSchema: {
        type: 'object',
        required: ['intervals'],
        additionalProperties: true,
        properties: {
          intervals: {
            type: 'array',
            description: 'Sleep intervals with detailed stage and biometric data',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Unique interval ID' },
                ts: { type: 'string', format: 'date-time', description: 'Interval timestamp (ISO 8601)' },
                timezone: { type: 'string', description: 'IANA timezone identifier' },
                duration: { type: 'number', description: 'Total interval duration in seconds' },
                stages: {
                  type: 'array',
                  description: 'Array of sleep stage segments with duration in seconds',
                  items: {
                    type: 'object',
                    properties: {
                      stage: { type: 'string' },
                      duration: { type: 'number' },
                    },
                    additionalProperties: true,
                  },
                },
                stageSummary: {
                  type: 'object',
                  description: 'Aggregated stage durations and percentages',
                  additionalProperties: true,
                },
              },
              additionalProperties: true,
            },
          },
          next: {
            type: ['string', 'null'],
            description: 'Pagination cursor to fetch the next set of intervals (if provided by the API).',
          },
        },
      },
    },
    {
      name: 'get_device_status',
      title: 'Check Current Device Status',
      description: 'Retrieves real-time pod status including current heating/cooling levels, target levels, active timers, and power state for both sides of the mattress. Use to verify applied temperature settings or diagnose device issues. Inputs: None. Outputs: Object with leftSide/rightSide heating levels, targets, timer remaining, and device online status.',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
      },
      outputSchema: {
        type: 'object',
        required: [
          'leftHeatingLevel',
          'rightHeatingLevel',
          'leftTargetHeatingLevel',
          'rightTargetHeatingLevel',
          'leftNowHeating',
          'rightNowHeating',
          'leftHeatingDuration',
          'rightHeatingDuration',
        ],
        properties: {
          deviceId: { type: 'string', description: 'Unique device identifier' },
          ownerId: { type: 'string', description: 'User ID of device owner' },
          leftHeatingLevel: {
            type: 'number',
            minimum: -100,
            maximum: 100,
            description: 'Current left side heating level (-100=max cooling, 100=max heating)',
          },
          rightHeatingLevel: {
            type: 'number',
            minimum: -100,
            maximum: 100,
            description: 'Current right side heating level (-100=max cooling, 100=max heating)',
          },
          leftTargetHeatingLevel: {
            type: 'number',
            minimum: -100,
            maximum: 100,
            description: 'Target left side heating level',
          },
          rightTargetHeatingLevel: {
            type: 'number',
            minimum: -100,
            maximum: 100,
            description: 'Target right side heating level',
          },
          leftNowHeating: {
            type: 'boolean',
            description: 'Whether left side is actively heating/cooling',
          },
          rightNowHeating: {
            type: 'boolean',
            description: 'Whether right side is actively heating/cooling',
          },
          leftHeatingDuration: {
            type: 'number',
            description: 'Remaining duration for left side timer (seconds, 0=indefinite)',
          },
          rightHeatingDuration: {
            type: 'number',
            description: 'Remaining duration for right side timer (seconds, 0=indefinite)',
          },
          priming: { type: 'boolean', description: 'Whether device is in priming mode' },
          needsPriming: { type: 'boolean', description: 'Whether device needs priming' },
          hasWater: { type: 'boolean', description: 'Whether device has sufficient water' },
          ledBrightnessLevel: {
            type: 'number',
            description: 'LED brightness level (0=off)',
          },
        },
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

        case 'get_sleep_intervals': {
          return await withSleepClient(extra, async ({ client }) => {
            const intervals = await client.getSleepIntervals();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(intervals, null, 2),
                  annotations: { audience: ['assistant'] },
                },
              ],
              structuredContent: intervals as unknown as Record<string, unknown>,
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
          description: 'Real-time heating levels, targets, and timers for the active pod.',
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
          description: 'Most recent nightly sleep metrics snapshot (score, stages, biometrics).',
          mimeType: 'application/json',
          annotations: {
            audience: ['assistant'],
            priority: 0.8,
            lastModified: new Date().toISOString(),
          },
        },
      ],
      resourceTemplates: [
        {
          uriTemplate: 'sleep://sleep/{date}',
          name: 'sleep-by-date',
          title: 'Sleep Session by Date',
          description: 'Nightly sleep metrics for a specific date. Use for fetching historical data without tool calls. Date must be in YYYY-MM-DD format (e.g., "2025-01-15").',
          mimeType: 'application/json',
          annotations: {
            audience: ['assistant'],
            priority: 0.7,
          },
        },
        {
          uriTemplate: 'sleep://trends/{from}/{to}',
          name: 'trends-by-range',
          title: 'Sleep Trends by Date Range',
          description: 'Aggregated sleep trends for a date range. Parameters: from and to dates in YYYY-MM-DD format. Uses server default timezone. Efficient for fetching multiple days of data.',
          mimeType: 'application/json',
          annotations: {
            audience: ['assistant'],
            priority: 0.75,
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
      const trends = await client.getSleepTrends(isoDateDaysAgo(7), isoDateDaysAgo(0), TIMEZONE);
      const latest = Array.isArray(trends.days) ? trends.days[0] ?? null : null;
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

  // Resource template: sleep://sleep/{date}
  const sleepByDateMatch = uri.match(/^sleep:\/\/sleep\/([0-9]{4}-[0-9]{2}-[0-9]{2})$/);
  if (sleepByDateMatch) {
    const date = sleepByDateMatch[1];
    return withSleepClient(extra, async ({ client }) => {
      const trends = await client.getSleepTrends(date, date, TIMEZONE);
      const dayData = Array.isArray(trends.days) ? trends.days[0] ?? null : null;
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(dayData),
          },
        ],
      };
    });
  }

  // Resource template: sleep://trends/{from}/{to}
  const trendsRangeMatch = uri.match(/^sleep:\/\/trends\/([0-9]{4}-[0-9]{2}-[0-9]{2})\/([0-9]{4}-[0-9]{2}-[0-9]{2})$/);
  if (trendsRangeMatch) {
    const from = trendsRangeMatch[1];
    const to = trendsRangeMatch[2];
    return withSleepClient(extra, async ({ client }) => {
      const trends = await client.getSleepTrends(from, to, TIMEZONE);
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(trends),
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
  // Prompt argument completion
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

  // Resource template argument completion (uses ref/resource with template URIs)
  if (params.ref.type === 'ref/resource') {
    ensureAuthenticated(extra);

    // Completion for sleep://sleep/{date} template
    const sleepByDateMatch = params.ref.uri?.match(/^sleep:\/\/sleep\/\{date\}$/);
    if (sleepByDateMatch && params.argument.name === 'date') {
      const query = params.argument.value?.toString() ?? '';
      // Suggest recent dates (last 7 days)
      const suggestions: string[] = [];
      for (let i = 0; i < 7; i++) {
        suggestions.push(isoDateDaysAgo(i));
      }

      const values = suggestions.filter((date) => date.startsWith(query));
      return {
        completion: {
          values,
          total: values.length,
        },
      };
    }

    // Completion for sleep://trends/{from}/{to} template
    const trendsRangeMatch = params.ref.uri?.match(/^sleep:\/\/trends\/\{from\}\/\{to\}$/);
    if (trendsRangeMatch && (params.argument.name === 'from' || params.argument.name === 'to')) {
      const query = params.argument.value?.toString() ?? '';
      // Suggest common date ranges
      const suggestions: string[] = [];
      for (let i = 0; i < 14; i++) {
        suggestions.push(isoDateDaysAgo(i));
      }

      const values = suggestions.filter((date) => date.startsWith(query));
      return {
        completion: {
          values,
          total: values.length,
        },
      };
    }
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
      sessionIdGenerator: undefined,
      enableJsonResponse,
      allowedHosts:
        authConfig.allowedHosts.length > 0 ? authConfig.allowedHosts : undefined,
      allowedOrigins:
        authConfig.allowedOrigins.length > 0 ? authConfig.allowedOrigins : undefined,
      enableDnsRebindingProtection: authConfig.dnsRebindingProtection,
    });
    await server.connect(transport);
    httpServer = createServer((req, res) => {
      void (async () => {
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
      })();
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
