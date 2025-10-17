import type { AuthenticationProvider } from '../auth/provider.js';
import type { AuthConfig } from '../auth/config.js';
import type { IncomingMessage } from 'node:http';
import { ServerResponse } from 'node:http';
import { Readable } from 'node:stream';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createLogger } from '../logging/logger.js';

interface AuthBindings {
  provider: AuthenticationProvider;
  loadAuthConfig: (port: number, defaultScopes?: string[]) => AuthConfig;
  initialiseAuth: (config: AuthConfig, options: { provider: AuthenticationProvider }) => Promise<void>;
  handleAuthRequest: (
    config: AuthConfig,
    req: IncomingMessage,
    res: ServerResponse,
    url: URL
  ) => Promise<boolean>;
  verifyAccessToken: (config: AuthConfig, token: string) => {
    clientId: string;
    subject: string;
    scopes: string[];
    expiresAt: number;
  };
  initializeStorage: (oauthKV?: KVNamespace, clientsKV?: KVNamespace) => void;
  initializeCredentialStorage: (credentialsKV?: KVNamespace) => void;
}

export interface WorkerOptions {
  auth: AuthBindings;
  transport: StreamableHTTPServerTransport;
  bootstrap?: () => Promise<void> | void;
  defaultScopes?: string[];
  defaultPort?: number;
}

export interface WorkerExports {
  fetch(request: Request, env: Record<string, unknown>): Promise<Response>;
}

export function createWorkerHandler(options: WorkerOptions): WorkerExports {
  const {
    auth,
    transport,
    bootstrap,
    defaultScopes = auth.provider.defaultScopes ?? [],
    defaultPort = 443,
  } = options;

  const logger = createLogger('worker');

  let bootstrapped = false;
  let lastIssuer: string | undefined;
  let authConfig: AuthConfig | undefined;

  const ensureAuthInitialized = async (env?: Record<string, unknown>) => {
    const currentIssuer = env?.AUTH_ISSUER as string | undefined;

    if (currentIssuer !== lastIssuer) {
      logger.info('Initializing auth', { previousIssuer: lastIssuer, currentIssuer });

      if (env) {
        if (env.AUTH_ISSUER) process.env.AUTH_ISSUER = String(env.AUTH_ISSUER);
        if (env.AUTH_JWT_SECRET) process.env.AUTH_JWT_SECRET = String(env.AUTH_JWT_SECRET);
        if (env.AUTH_ENCRYPTION_KEY) process.env.AUTH_ENCRYPTION_KEY = String(env.AUTH_ENCRYPTION_KEY);
        if (env.AUTH_SESSION_SECRET) process.env.AUTH_SESSION_SECRET = String(env.AUTH_SESSION_SECRET);
        if (env.AUTH_CLIENTS_JSON) process.env.AUTH_CLIENTS_JSON = String(env.AUTH_CLIENTS_JSON);

        auth.initializeStorage(env.OAUTH_STATE_KV as KVNamespace | undefined, env.OAUTH_CLIENTS_KV as KVNamespace | undefined);
        auth.initializeCredentialStorage(env.CREDENTIALS_KV as KVNamespace | undefined);
      }

      authConfig = auth.loadAuthConfig(defaultPort, defaultScopes);
      await auth.initialiseAuth(authConfig, { provider: auth.provider });
      lastIssuer = currentIssuer;

      logger.info('Auth initialized', { issuer: authConfig.issuer });
    }

    if (!authConfig) {
      authConfig = auth.loadAuthConfig(defaultPort, defaultScopes);
      await auth.initialiseAuth(authConfig, { provider: auth.provider });
    }

    return authConfig;
  };

  const toNodeRequest = (request: Request): IncomingMessage => {
    const url = new URL(request.url);
    const req = new Readable({
      read() {
        // Body reading handled via request.body stream
      },
    }) as unknown as IncomingMessage;

    req.method = request.method;
    req.url = url.pathname + url.search;
    req.headers = Object.fromEntries(request.headers.entries());

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
  };

  const toWorkersResponse = async (res: ServerResponse): Promise<Response> => {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];

      res.write = function (chunk: any) {
        if (chunk) chunks.push(Buffer.from(chunk));
        return true;
      };

      res.end = function (chunk?: any) {
        if (chunk) chunks.push(Buffer.from(chunk));
        const body = Buffer.concat(chunks);
        const headers = new Headers();

        Object.entries(res.getHeaders()).forEach(([key, value]) => {
          if (value !== undefined) {
            headers.set(key, String(value));
          }
        });

        resolve(
          new Response(body, {
            status: res.statusCode || 200,
            headers,
          })
        );
        return res;
      };
    });
  };

  const getCorsHeaders = (origin: string | null): Record<string, string> => {
    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-Requested-With, mcp-protocol-version, mcp-session-id',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'mcp-session-id',
    };

    if (origin) {
      corsHeaders['Access-Control-Allow-Origin'] = origin;
      corsHeaders['Access-Control-Allow-Credentials'] = 'true';
    }

    return corsHeaders;
  };

  const fetch = async (request: Request, env: Record<string, unknown>): Promise<Response> => {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    try {
      const config = await ensureAuthInitialized(env);

      if (!bootstrapped && bootstrap) {
        await bootstrap();
        bootstrapped = true;
        logger.info('Bootstrap complete');
      }

      const url = new URL(request.url);

      if (url.pathname.startsWith('/.well-known/oauth-protected-resource')) {
        const body = {
          authorization_servers: [
            `${config.issuer}/.well-known/oauth-authorization-server`,
          ],
          token_endpoint: `${config.issuer}/token`,
        };
        return new Response(JSON.stringify(body), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: corsHeaders,
        });
      }

      const nodeReq = toNodeRequest(request);
      const nodeRes = new ServerResponse(nodeReq);
      const responsePromise = toWorkersResponse(nodeRes);

      if (await auth.handleAuthRequest(config, nodeReq, nodeRes, url)) {
        const response = await responsePromise;
        const newHeaders = new Headers(response.headers);
        Object.entries(corsHeaders).forEach(([key, value]) => newHeaders.set(key, value));

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }

      if (url.pathname === '/health') {
        return new Response(
          JSON.stringify({ status: 'ok' }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      if (url.pathname.startsWith('/mcp')) {

        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response(
            JSON.stringify({ error: 'invalid_token', error_description: 'Bearer token required' }),
            {
              status: 401,
              headers: {
                'Content-Type': 'application/json',
                'WWW-Authenticate': 'Bearer realm="mcp-server"',
                ...corsHeaders,
              },
            }
          );
        }

        const token = authHeader.slice('Bearer '.length);
        try {
          const verified = auth.verifyAccessToken(config, token);
          (nodeReq as any).auth = {
            token,
            clientId: verified.clientId,
            scopes: verified.scopes,
            expiresAt: verified.expiresAt,
            extra: { subject: verified.subject },
          };
          logger.debug('Authorized MCP request', {
            method: request.method,
            path: url.pathname,
            clientId: verified.clientId,
            subject: verified.subject,
          });
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
      logger.error('Request failed', undefined, error);
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
  };

  return { fetch };
}
