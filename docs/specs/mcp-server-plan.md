# Sleep MCP Server - Plan

**Feature Key:** `mcp-server`

## Map TL;DR

**Current state:** Have sleep client ([src/client.ts](../../src/client.ts)) with auth, device control, sleep trends. No MCP server exists.

**Primary files:**
- `src/client.ts:1-195` - SleepClient with 5 public methods
- `src/types.ts:1-52` - API response types
- MCP specs: Tools (model-controlled), Resources (app-controlled), Prompts (user-controlled)

**MCP Architecture:** JSON-RPC 2.0, stdio transport, capability negotiation, server exposes tools/resources/prompts to MCP clients (like Claude Desktop).

## Goal

Build an MCP server that exposes sleep device capabilities following MCP 2025-06-18 spec. Server should offer **Tools** (AI-controlled temperature/data operations), **Resources** (current device/sleep state), and **Prompts** (user-initiated sleep workflows). Enables AI assistants to control sleep devices naturally while maintaining user consent and security per MCP best practices.

## Acceptance Checks

1. `npx @modelcontextprotocol/inspector dist/server.js` completes the MCP lifecycle (client `initialize`, server response, client `initialized`) while advertising protocol revision `2025-06-18`
2. Server exposes ≥3 tools with valid JSON Schema `inputSchema` and (where applicable) `outputSchema`; `tools/call` executes and returns both `content` and `structuredContent`
3. Server exposes ≥2 resources with URIs, metadata, and delivers point-in-time JSON snapshots via `resources/read`
4. Server exposes ≥1 prompt with arguments via `prompts/list` and `prompts/get`, returning prompt messages that use MCP content types
5. Responses adhere to MCP typing rules (e.g., JSON as text with `mimeType`, annotations optional) and propagate protocol errors (`-32602`, `-32603`) for invalid inputs
6. Server authenticates during startup using env-provided credentials, caches device metadata, auto-refreshes tokens transparently, and fails fast with descriptive errors if configuration is missing

## Files to Touch

**New files:**
- `src/server.ts` - MCP server implementation (stdio transport, JSON-RPC handlers)
- `src/server.test.ts` - Contract tests using MCP client protocol
- `package.json` - Add `@modelcontextprotocol/sdk` dependency, add build script

**Modified files:**
- `tsconfig.json` - Ensure server code compiles correctly

**Intent:**
- `src/server.ts`: Implement an MCP server using the official SDK, declare negotiated capabilities (logging/tools/resources/prompts), wire to EightSleepClient, bootstrap credentials/device metadata, and ensure responses comply with the 2025-06-18 schemas
- `src/server.test.ts`: Test MCP protocol contracts (initialize response, list/call/read/get flows, structured outputs, error handling) with a mocked EightSleepClient; real-API smoke tests remain manual

## Diff Outline (Pseudo-code)

```typescript
// src/server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type {
  CallToolRequest,
  ListPromptsResponse,
  ListResourcesResponse,
  ListToolsResponse,
  ToolOutput,
} from '@modelcontextprotocol/sdk/types.js';
import { EightSleepClient } from './client.js';

const EMAIL = process.env.EIGHT_SLEEP_EMAIL;
const PASSWORD = process.env.EIGHT_SLEEP_PASSWORD;
if (!EMAIL || !PASSWORD) {
  throw new Error('Missing Eight Sleep credentials (EIGHT_SLEEP_EMAIL / EIGHT_SLEEP_PASSWORD)');
}

const TIMEZONE = process.env.EIGHT_SLEEP_TIMEZONE ?? 'UTC';

const client = new EightSleepClient();
await client.authenticate(EMAIL, PASSWORD);
const profile = await client.getUserProfile();
const deviceId = profile.currentDevice?.id;
if (!deviceId) {
  throw new Error('No active Eight Sleep device found on user profile');
}

const isoDateDaysAgo = (daysAgo: number) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
};

const server = new Server(
  { name: 'eightsleep-mcp-server', version: '1.0.0' },
  {
    capabilities: {
      logging: {},
      tools: { listChanged: false },
      resources: { subscribe: false, listChanged: false },
      prompts: { listChanged: false },
    },
  }
);

server.setRequestHandler('initialize', async () => ({
  protocolVersion: '2025-06-18',
  capabilities: server.getCapabilities(),
  serverInfo: { name: 'eightsleep-mcp-server', version: '1.0.0' },
}));

server.setRequestHandler('tools/list', async (): Promise<ListToolsResponse> => ({
  tools: [
    {
      name: 'set_temperature',
      title: 'Set Pod Temperature',
      description: 'Adjust pod temperature for the authenticated user side.',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        required: ['level'],
        properties: {
          level: { type: 'number', minimum: -100, maximum: 100 },
          durationSeconds: { type: 'number', minimum: 0, default: 0 },
        },
      },
      outputSchema: {
        type: 'object',
        required: ['status'],
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
      description: 'Retrieve historical sleep scores for a date range.',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        required: ['from', 'to'],
        properties: {
          from: { type: 'string', format: 'date' },
          to: { type: 'string', format: 'date' },
          timezone: { type: 'string', default: TIMEZONE },
        },
      },
    },
    {
      name: 'get_device_status',
      title: 'Get Device Status',
      description: 'Return the current pod status for both sides.',
      inputSchema: { type: 'object', additionalProperties: false },
    },
  ],
}));

server.setRequestHandler('tools/call', async ({ params }: CallToolRequest): Promise<ToolOutput> => {
  const { name, arguments: rawArgs = {} } = params;

  switch (name) {
    case 'set_temperature': {
      const { level, durationSeconds = 0 } = rawArgs as { level: number; durationSeconds?: number };
      await client.setHeatingLevel(level, durationSeconds);
      return {
        content: [{ type: 'text', text: `Temperature set to ${level} for ${durationSeconds}s` }],
        structuredContent: { status: 'ok', level, durationSeconds },
      };
    }
    case 'get_sleep_trends': {
      const { from, to, timezone = TIMEZONE } = rawArgs as { from: string; to: string; timezone?: string };
      const days = await client.getSleepTrends(from, to, timezone);
      return {
        content: [{ type: 'text', text: JSON.stringify(days), annotations: { audience: ['assistant'] } }],
        structuredContent: days,
      };
    }
    case 'get_device_status': {
      const status = await client.getDeviceStatus(deviceId);
      return {
        content: [{ type: 'text', text: JSON.stringify(status), annotations: { audience: ['assistant', 'user'] } }],
        structuredContent: status,
      };
    }
    default:
      return {
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
});

server.setRequestHandler('resources/list', async (): Promise<ListResourcesResponse> => ({
  resources: [
    {
      uri: 'eightsleep://device/status',
      name: 'device-status',
      title: 'Current Device Status',
      description: 'Heating levels and targets for the active pod.',
      mimeType: 'application/json',
    },
    {
      uri: 'eightsleep://sleep/latest',
      name: 'latest-sleep',
      title: 'Most Recent Sleep Session',
      description: 'Latest sleep metrics snapshot.',
      mimeType: 'application/json',
    },
  ],
}));

server.setRequestHandler('resources/read', async ({ params }) => {
  if (params.uri === 'eightsleep://device/status') {
    const status = await client.getDeviceStatus(deviceId);
    return {
      contents: [
        {
          uri: params.uri,
          mimeType: 'application/json',
          text: JSON.stringify(status),
        },
      ],
    };
  }
  if (params.uri === 'eightsleep://sleep/latest') {
    const [latest] = await client.getSleepTrends(isoDateDaysAgo(7), isoDateDaysAgo(0), TIMEZONE);
    return {
      contents: [
        {
          uri: params.uri,
          mimeType: 'application/json',
          text: JSON.stringify(latest ?? null),
        },
      ],
    };
  }
  throw Object.assign(new Error(`Unknown resource URI: ${params.uri}`), { code: -32602 });
});

server.setRequestHandler('prompts/list', async (): Promise<ListPromptsResponse> => ({
  prompts: [
    {
      name: 'analyze_sleep',
      title: 'Analyze Sleep Quality',
      description: 'Guide the user through reviewing recent sleep metrics.',
      arguments: [
        {
          name: 'days',
          description: 'Number of days to review (max 14).',
          required: false,
          default: 7,
        },
      ],
    },
  ],
}));

server.setRequestHandler('prompts/get', async ({ params }) => {
  if (params.name !== 'analyze_sleep') {
    throw Object.assign(new Error(`Unknown prompt: ${params.name}`), { code: -32602 });
  }

  const days = (params.arguments?.days as number | undefined) ?? 7;
  return {
    description: 'Analyze recent sleep quality with trend highlights.',
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Analyze my Eight Sleep data for the last ${days} days. Highlight trends in score, restlessness, and recommended adjustments.`,
        },
      },
      {
        role: 'assistant',
        content: {
          type: 'text',
          text: 'Sure—share any goals or additional context, and I will synthesize insights from the latest metrics.',
          annotations: { audience: ['user'] },
        },
      },
    ],
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

## Risks

- **Credentials management**: Server needs `EIGHT_SLEEP_EMAIL` / `EIGHT_SLEEP_PASSWORD`; misconfigured env = auth failures
  - *Detection*: Test with missing env vars, expect clear error
- **Token refresh during long sessions**: Access token expires after 1h; must auto-refresh
  - *Detection*: Mock expired token, verify refresh happens transparently
- **MCP SDK breaking changes**: SDK at v0.x may have API changes
  - *Detection*: Lock dependency version, test on SDK updates
- **Resource staleness**: Device status/sleep data changes externally
  - *Mitigation*: Document resources as point-in-time snapshots (no subscriptions for now)

## Test Strategy

**Contract tests** (MCP protocol compliance):
- `src/server.test.ts` using a mocked EightSleepClient that simulates token refresh and API responses:
  - `testInitializeHandshake()`: Send `initialize`, verify protocol version `2025-06-18`, capabilities, and server info
  - `testListTools()`: Call `tools/list`, validate JSON Schemas and optional `outputSchema`
  - `testCallSetTemperature()`: Invoke `set_temperature`, ensure request params forwarded and response contains `content` + `structuredContent`
  - `testListResources()`: Call `resources/list`, verify URIs/mime types and pagination defaults
  - `testReadDeviceStatus()`: Read `eightsleep://device/status`, verify JSON text payload and structured data
  - `testGetPrompt()`: Request `analyze_sleep`, confirm argument defaults and multi-message response
  - `testUnknownIdentifiers()`: Assert `-32602` errors for unknown tool/resource/prompt names
  - `testMissingCredentials()`: Ensure startup throws a descriptive error when env vars absent

**Integration test** (manual / smoke):
- Use `@modelcontextprotocol/inspector` to connect and test live with real Eight Sleep credentials loaded via env
- Optional long-lived session test to observe token refresh logs and resource freshness

## Out of Scope

- ❌ Complex prompts with multiple arguments/templates (start with 1-2 simple ones)
- ❌ Resource subscriptions (set `subscribe: false` initially)
- ❌ HTTP transport (stdio only per local MCP pattern)
- ❌ Alarms, priming, away mode (only core sleep/temp features)
- ❌ Multi-user support (single credential set from env)
- ❌ Caching/optimization (YAGNI - add if perf issues arise)
- ❌ Tool pagination (tools list is small)
- ❌ Error recovery UI (client handles, server just throws)
