# Sleep MCP Server – Cloudflare Deployment Plan

## Objectives

1. Host the Sleep MCP server on Cloudflare Workers, exposing the `/mcp` SSE endpoint behind Workers’ OAuth Provider wrapper.
2. Align with Cloudflare’s “Build a Remote MCP server” guide for both public (authless) and OAuth-backed deployments.
3. Provide a reproducible workflow for local development, secret management, and production deployments via Wrangler.

## Deliverables

- `wrangler.toml` (or `.jsonc`) configured for the Sleep MCP Worker (name, routes, kv namespaces, compatibility date).
- Worker entry point (`src/worker.ts` or `src/index.ts`) that:
  - Imports the Sleep MCP router logic.
  - Wraps it with `OAuthProvider` (eventually `SleepAuthHandler` for interactive login).
  - Exposes the fetch handler expected by Workers.
- Build tooling integration (`package.json` scripts using `wrangler dev`, `wrangler deploy`).
- KV namespace binding for Sleep refresh tokens (e.g., `KV_SLEEP_TOKENS`).
- Documentation updates describing how to deploy, configure secrets, and test.

## Project Structure Changes

1. **Create Worker scaffold**
   - Option A (new workspace): `npm create cloudflare@latest -- sleep-mcp-worker --template=cloudflare/ai/demos/remote-mcp-authless`.
   - Option B (within current repo): add `wrangler.toml`, Worker entry, and adjust build scripts to bundle existing TypeScript for Workers.
   - Remove Node-only dependencies from runtime path (e.g., `http`, `node:crypto` usage replaced with Web Crypto).
2. **Entry point (`src/index.ts`)**
   ```ts
   import OAuthProvider from '@cloudflare/agents-oauth-provider'; // placeholder import
   import { sleepMcpRouter } from './worker/mcp-router';
   import { sleepAuthHandler } from './worker/sleep-auth-handler';

   export default new OAuthProvider({
     apiRoute: '/mcp',
     apiHandler: sleepMcpRouter,
     defaultHandler: sleepAuthHandler, // initially can be a simple “login not implemented” page
     authorizeEndpoint: '/authorize',
     tokenEndpoint: '/token',
     clientRegistrationEndpoint: '/register',
   });
   ```
   - Until interactive login is ready, `sleepAuthHandler` can mimic the authless example (auto-approve) to keep deployment simple.

3. **Reuse existing logic**
   - Move `SleepClient` and tool/resource handlers into Worker-compatible modules (no Node APIs, use `fetch`).
   - Replace Node crypto with `crypto.subtle` or Web Crypto.
   - Ensure SSE responses are emitted via Workers’ streaming APIs (`new Response(eventStream(), { headers })`).

## Environment & Secrets

- `.dev.vars` for local dev (per Cloudflare docs):
  ```
  AUTH_ENCRYPTION_KEY="..."
  AUTH_SESSION_SECRET="..."
  SLEEP_API_BASE="https://client-api.8slp.net"
  ```
- `wrangler secret put <NAME>` for production secrets (Sleep API client ID/secret if needed, encryption keys).
- `wrangler kv namespace create "KV_SLEEP_TOKENS"` → bind in `wrangler.toml`:
  ```toml
  kv_namespaces = [
    { binding = "KV_SLEEP_TOKENS", id = "<namespace-id>" }
  ]
  ```

## Local Development Workflow

1. `npm install` (including `wrangler`, bundler like `esbuild` or `vite`).
2. `npm run dev` → `wrangler dev --local` to emulate Worker at `http://localhost:8788`.
3. Run MCP Inspector (`npx @modelcontextprotocol/inspector`) and connect to `http://localhost:8788/mcp` (SSE).
4. For auth flows, use Inspector’s **Quick OAuth Flow** button to exercise `/authorize`/`/token`.

## Deployment Workflow

1. `npx wrangler deploy`
2. Verify deployed URL `https://<worker-name>.<account>.workers.dev/mcp` with MCP Inspector or `mcp-remote`.
3. Configure CI/CD (GitHub Actions) if preferred (automatic deploy on main merges).

## Post-Deployment Validation

- Use `mcp-remote` to tunnel the remote server into Claude Desktop (as per Cloudflare guide).
- Confirm the SSE endpoint streams tool responses correctly.
- Check Worker logs via `wrangler tail`.

## Future Enhancements

- Once interactive login is implemented, integrate `sleepAuthHandler` and KV-backed token storage.
- Add environment-specific config (staging vs production) in `wrangler.toml`.
- Implement Cloudflare Access/third-party IdP integration as alternative options.
