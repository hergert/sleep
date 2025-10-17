import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { InitializeRequestSchema } from '@modelcontextprotocol/sdk/types.js';

type ServerConstructorOptions = ConstructorParameters<typeof Server>[1];
type ServerCapabilities = NonNullable<ServerConstructorOptions>['capabilities'];

export interface McpServerOptions {
  serverInfo: {
    name: string;
    version: string;
  };
  protocolVersion: string;
  capabilities?: ServerCapabilities;
}

const DEFAULT_CAPABILITIES: ServerCapabilities = {
  logging: {},
  tools: { listChanged: false },
  resources: { subscribe: false, listChanged: false },
  prompts: { listChanged: false },
  completions: {},
};

export function createMcpServer(options: McpServerOptions): Server {
  const capabilities = options.capabilities ?? DEFAULT_CAPABILITIES;

  const server = new Server(options.serverInfo, {
    capabilities,
  });

  server.setRequestHandler(InitializeRequestSchema, async () => ({
    protocolVersion: options.protocolVersion,
    capabilities,
    serverInfo: options.serverInfo,
  }));

  return server;
}

export { DEFAULT_CAPABILITIES };
