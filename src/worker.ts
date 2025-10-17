/**
 * Cloudflare Workers entry point for Sleep MCP server.
 * Uses nodejs_compat mode to run the existing Node.js server.
 */
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { SleepAuthProvider } from './providers/sleep/sleepProvider.js';
import { loadAuthConfig } from './auth/config.js';
import { initialiseAuth, handleAuthRequest, verifyAccessToken } from './auth/http.js';
import { initializeStorage } from './auth/store.js';
import { initializeCredentialStorage } from './auth/credentialStorage.js';
import { server, bootstrap } from './server.js';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Readable } from 'node:stream';

// Initialize at module level (but config will be loaded per-request to access secrets)
const sleepProvider = new SleepAuthProvider();

// Create transport once (stateless – no session ID exchange)
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined,
  enableJsonResponse: true,
});

// Connect server to transport
await server.connect(transport);
let bootstrapped = false;

// Initialize auth with secrets (called on each worker cold start)
// Cache the last issuer to detect when we need to reinitialize
let lastIssuer: string | undefined;
let authConfig: ReturnType<typeof loadAuthConfig>;

async function ensureAuthInitialized(env?: any) {
  const currentIssuer = env?.AUTH_ISSUER;

  // Reinitialize if issuer changed or not yet initialized
  if (currentIssuer !== lastIssuer) {
    console.log('[worker] Initializing auth (issuer changed from', lastIssuer, 'to', currentIssuer, ')');

    if (env) {
      // In Workers, secrets are in env, not process.env
      // Copy secrets to process.env FIRST so initialization functions can read them
      if (env.AUTH_ISSUER) process.env.AUTH_ISSUER = env.AUTH_ISSUER;
      if (env.AUTH_JWT_SECRET) process.env.AUTH_JWT_SECRET = env.AUTH_JWT_SECRET;
      if (env.AUTH_ENCRYPTION_KEY) process.env.AUTH_ENCRYPTION_KEY = env.AUTH_ENCRYPTION_KEY;
      if (env.AUTH_SESSION_SECRET) process.env.AUTH_SESSION_SECRET = env.AUTH_SESSION_SECRET;
      if (env.AUTH_CLIENTS_JSON) process.env.AUTH_CLIENTS_JSON = env.AUTH_CLIENTS_JSON;

      // Initialize KV storage if bindings are available, otherwise use in-memory
      initializeStorage(env.OAUTH_STATE_KV, env.OAUTH_CLIENTS_KV);
      initializeCredentialStorage(env.CREDENTIALS_KV);
    }

    authConfig = loadAuthConfig(443, sleepProvider.defaultScopes);
    await initialiseAuth(authConfig, { provider: sleepProvider });
    lastIssuer = currentIssuer;

    console.log('[worker] Auth initialized with issuer:', authConfig.issuer);
  }

  return authConfig;
}

/**
 * Convert Workers Request to Node.js IncomingMessage-like object
 */
function toNodeRequest(request: Request): IncomingMessage {
  const url = new URL(request.url);
  const req = new Readable({
    read() {
      // Body reading handled via request.body stream
    }
  }) as unknown as IncomingMessage;

  req.method = request.method;
  req.url = url.pathname + url.search;
  req.headers = Object.fromEntries(request.headers.entries());

  // Stream request body if present
  if (request.body) {
    const reader = request.body.getReader();
    void (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            req.push(null);
            break;
          }
          req.push(value);
        }
      } catch (error) {
        req.destroy(error as Error);
      }
    })();
  } else {
    req.push(null);
  }

  return req;
}

/**
 * Convert Node.js ServerResponse to Workers Response
 */
async function toWorkersResponse(res: ServerResponse): Promise<Response> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];

    res.write = function(chunk: any) {
      if (chunk) chunks.push(Buffer.from(chunk));
      return true;
    };

    res.end = function(chunk?: any) {
      if (chunk) chunks.push(Buffer.from(chunk));
      const body = Buffer.concat(chunks);
      const headers = new Headers();

      Object.entries(res.getHeaders()).forEach(([key, value]) => {
        if (value !== undefined) {
          headers.set(key, String(value));
        }
      });

      resolve(new Response(body, {
        status: res.statusCode || 200,
        headers,
      }));
      return res;
    };
  });
}

// Simple CORS helper for Workers
function getCorsHeaders(origin: string | null): Record<string, string> {
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, mcp-protocol-version, mcp-session-id',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Expose-Headers': 'mcp-session-id',
  };

  // Allow all origins since OAuth provides authentication
  // MCP clients can be from any origin (Claude.ai, local tools, etc.)
  if (origin) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
    corsHeaders['Access-Control-Allow-Credentials'] = 'true';
  }

  return corsHeaders;
}

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    try {
      // Initialize auth config with secrets on first request
      const config = await ensureAuthInitialized(env);

      // Bootstrap once
      if (!bootstrapped) {
        await bootstrap();
        bootstrapped = true;
      }

      const url = new URL(request.url);

      // Some clients probe this during auth; respond 204 instead of 404.
      if (url.pathname.startsWith('/.well-known/oauth-protected-resource')) {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }

      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: corsHeaders,
        });
      }

      // Convert to Node.js request/response
      const nodeReq = toNodeRequest(request);
      const nodeRes = new ServerResponse(nodeReq);
      const responsePromise = toWorkersResponse(nodeRes);

      // Handle auth routes (OAuth endpoints like /.well-known/*, /authorize, /token, etc.)
      if (await handleAuthRequest(config, nodeReq, nodeRes, url)) {
        const response = await responsePromise;

        // Add CORS headers to auth responses
        const newHeaders = new Headers(response.headers);
        Object.entries(corsHeaders).forEach(([key, value]) => newHeaders.set(key, value));

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }

      // Health check
      if (url.pathname === '/health') {
        return new Response(
          JSON.stringify({ status: 'ok' }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // MCP endpoints require authentication
      if (url.pathname.startsWith('/mcp')) {
        if (request.method === 'GET' || request.method === 'HEAD') {
          // Streamable HTTP clients poll GET for notifications. Respond 200 with CORS headers.
          return new Response(null, { status: 200, headers: corsHeaders });
        }

        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response(
            JSON.stringify({ error: 'invalid_token', error_description: 'Bearer token required' }),
            {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
                'WWW-Authenticate': 'Bearer realm="sleep-mcp-server"',
                ...corsHeaders,
              },
            }
          );
        }

        const token = authHeader.slice('Bearer '.length);
        try {
          const verified = verifyAccessToken(config, token);
          (nodeReq as any).auth = {
            token,
            clientId: verified.clientId,
            scopes: verified.scopes,
            expiresAt: verified.expiresAt,
            extra: { subject: verified.subject },
          };

          console.log(
            '[worker] MCP request - Session header:',
            request.headers.get('mcp-session-id'),
            'Bootstrapped:',
            bootstrapped
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: 'invalid_token',
              error_description: (error as Error).message,
            }),
            {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
                'WWW-Authenticate': 'Bearer error="invalid_token"',
                ...corsHeaders,
              },
            }
          );
        }

        await transport.handleRequest(nodeReq as any, nodeRes);
        const response = await responsePromise;

        // Add CORS headers to response
        const newHeaders = new Headers(response.headers);
        Object.entries(corsHeaders).forEach(([key, value]) => newHeaders.set(key, value));

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });

    } catch (error) {
      console.error('[worker] Request failed:', error);
      const errorHeaders: Record<string, string> = { 'Content-Type': 'application/json', ...corsHeaders };
      return new Response(
        JSON.stringify({
          error: 'Internal error',
          message: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: errorHeaders,
        }
      );
    }
  },
};
