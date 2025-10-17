import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import { createMcpServer } from '../../platform/mcp/server.js';
import { createWorkerHandler } from '../../platform/cloudflare/worker.js';
import { SleepAuthProvider } from '../../providers/sleep/authProvider.js';
import { registerSleepHandlers } from '../../providers/sleep/tools.js';
import { bootstrap as sleepBootstrap } from './startup.js';

import {
  initialiseAuth,
  handleAuthRequest,
  verifyAccessToken,
} from '../../platform/auth/http.js';
import { loadAuthConfig } from '../../platform/auth/config.js';
import { initializeStorage } from '../../platform/auth/store.js';
import { initializeCredentialStorage } from '../../platform/auth/credentialStorage.js';

const authProvider = new SleepAuthProvider();

const server = createMcpServer({
  serverInfo: { name: 'sleep-mcp-server', version: '1.0.0' },
  protocolVersion: '2025-06-18',
});

registerSleepHandlers(server);

const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined,
  enableJsonResponse: true,
});

await server.connect(transport);

const worker = createWorkerHandler({
  auth: {
    provider: authProvider,
    loadAuthConfig,
    initialiseAuth,
    handleAuthRequest,
    verifyAccessToken,
    initializeStorage,
    initializeCredentialStorage,
  },
  transport,
  bootstrap: sleepBootstrap,
});

export default worker;
