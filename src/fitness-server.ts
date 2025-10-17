#!/usr/bin/env node
import { createServer as createHttpServer } from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import { createMcpServer } from './platform/mcp/server.js';
import { registerFitnessHandlers } from './providers/fitness/tools.js';
import { FitnessAuthProvider } from './providers/fitness/authProvider.js';
import { bootstrap } from './workers/fitness/startup.js';

import { initialiseAuth, handleAuthRequest, verifyAccessToken } from './platform/auth/http.js';
import { loadAuthConfig } from './platform/auth/config.js';
import { hasPersistedCredentials } from './platform/auth/credentialStorage.js';

const authProvider = new FitnessAuthProvider();

const server = createMcpServer({
  serverInfo: { name: 'fitness-mcp-server', version: '1.0.0' },
  protocolVersion: '2025-06-18',
});

registerFitnessHandlers(server);

export { server, bootstrap };

export async function start(): Promise<void> {
  const port = Number.parseInt(process.env.PORT ?? '3001', 10);
  const enableJsonResponse = process.env.MCP_ENABLE_JSON_RESPONSE !== 'false';

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse,
  });

  await server.connect(transport);

  const authConfig = loadAuthConfig(port, authProvider.defaultScopes);
  await initialiseAuth(authConfig, { provider: authProvider });

  const httpServer = createHttpServer((req, res) => {
    void (async () => {
      try {
        if (!req.url) {
          res.writeHead(400).end();
          return;
        }

        const url = new URL(req.url, authConfig.issuer);

        let corsHeaders: Record<string, string> = {};
        const isOAuthPath = [
          '/authorize',
          '/token',
          '/jwks.json',
          '/.well-known/oauth-authorization-server',
          '/register',
        ].includes(url.pathname);

        if (req.method === 'OPTIONS' || url.pathname.startsWith('/mcp') || isOAuthPath) {
          corsHeaders = {
            ...corsHeaders,
            'Access-Control-Allow-Origin': req.headers.origin ?? '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id, mcp-protocol-version',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
            'Access-Control-Expose-Headers': 'Mcp-Session-Id',
            'Access-Control-Allow-Credentials': 'true',
            Vary: 'Origin',
          };
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
            .end(
              JSON.stringify({
                status: 'ok',
                authenticated: await hasPersistedCredentials(authProvider.id),
              })
            );
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
              'WWW-Authenticate': 'Bearer realm="fitness-mcp-server"',
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
        console.error('[fitness] Failed to handle HTTP request:', error);
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
    console.error(`[fitness] Streamable HTTP transport listening on http://localhost:${port}/mcp`);
  });

  const shutdown = () => {
    console.error('[fitness] Shutting down HTTP server');
    httpServer.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

if (import.meta.url === (process.argv[1] ? new URL(`file://${process.argv[1]}`).href : undefined)) {
  void start();
}
