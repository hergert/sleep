# Sleep MCP Server – Cloudflare Deployment Plan

**Target Account**: Smallbits (`d4ca2ffcbf66d256bb1d333e523c3a2f`)

## Objectives

1. Host the Sleep MCP server on Cloudflare Workers using the existing streamable HTTP transport (`/mcp`), backed by the generic authentication provider.
2. Keep the deployment flow minimal (YAGNI): reuse the current server/auth code, add only the Worker entry point and Wrangler configuration.
3. Document the exact steps to build, configure secrets, and deploy via Wrangler.
4. Add KV-backed persistence for credentials and OAuth state to survive Worker isolate evictions.

## Deliverables

- `wrangler.toml` configured for the Sleep MCP Worker (name, compatibility date, KV namespaces, Smallbits account).
- Worker entry point (`src/worker.ts`) that:
  - Imports the existing MCP `server` and `SleepAuthProvider`.
  - Calls `initialiseAuth(config, { provider })`.
  - Exposes a `fetch` handler that delegates to the Worker transport.
- KV storage adapter (`src/auth/kvStorage.ts`) for persistent credentials and OAuth state.
- Updated `credentialStorage.ts` and `store.ts` to use KV in Workers, in-memory for local dev.
- Build tooling (`npm run build`, `npm run deploy`) aligned with the current TypeScript output.
- Documentation updates describing deployment, secrets, and testing.

## Project Structure Changes

1. **Worker entry (`src/worker.ts`)**
   ```ts
   import { CloudflareWorkerTransport } from '@modelcontextprotocol/sdk/server/cloudflare';
   import { loadAuthConfig } from '../auth/config.js';
   import { initialiseAuth } from '../auth/http.js';
   import { SleepAuthProvider } from '../providers/sleep/sleepProvider.js';
   import { server, bootstrap } from '../server.js';

   const provider = new SleepAuthProvider();
   const config = loadAuthConfig(443, provider.defaultScopes);
   initialiseAuth(config, { provider });

   const transport = new CloudflareWorkerTransport({
     apiRoute: '/mcp',
     authorizeEndpoint: '/authorize',
     tokenEndpoint: '/token',
     clientRegistrationEndpoint: '/register',
   });

   await server.connect(transport);

   export default {
     async fetch(request: Request, env: Env, ctx: ExecutionContext) {
       await bootstrap();
       return transport.handleRequest(request, env, ctx);
     },
   };
   ```
   - This file reuses the existing auth + server logic; no additional handlers are required.

2. **Build configuration**
   - Ensure `tsconfig.json` emits `src/worker.ts` to `dist/worker.js`.
   - Add `npm run build` and `npm run deploy` scripts that run `tsc` then `wrangler deploy`.

## Environment & Secrets

- Local development (`.env` or `.dev.vars`):
  ```
  AUTH_JWT_SECRET="..."
  AUTH_ENCRYPTION_KEY="..."
  AUTH_SESSION_SECRET="..."
  AUTH_CLIENTS_JSON='[{"clientId":"sleep-cli","clientSecret":"dev-secret","redirectUris":["http://localhost:8765/callback"],"scopes":["sleep.read_device","sleep.read_trends","sleep.write_temperature","sleep.prompts.analyze"],"isPublic":false}]'
  SLEEP_TIMEZONE="UTC"
  ```
- Production (Workers):
  ```
  wrangler secret put AUTH_JWT_SECRET
  wrangler secret put AUTH_ENCRYPTION_KEY
  wrangler secret put AUTH_SESSION_SECRET
  wrangler secret put AUTH_CLIENTS_JSON
  ```
  > Credential storage remains in-memory for the first deployment. Workers may evict isolates, so tokens last only for the life of the isolate. Add a persistence layer in a follow-up when required.

## Local Development Workflow

1. `npm install` (ensure `wrangler` is in `devDependencies`).
2. `npm run build` then `wrangler dev` to emulate the Worker (defaults to `http://127.0.0.1:8787/mcp`).
3. Run MCP Inspector (`npx @modelcontextprotocol/inspector`) and connect to the local `/mcp` URL (Streamable HTTP).
4. Trigger a tool; Inspector will open the `/authorize` login page using the Worker-hosted form.

## Deployment Workflow

### Step 1: Create KV Namespaces
```bash
npx wrangler kv namespace create OAUTH_STATE_KV
npx wrangler kv namespace create CREDENTIALS_KV
npx wrangler kv namespace create CLIENTS_KV
```
Copy the 3 namespace IDs from the output and update `wrangler.toml`.

### Step 2: Set Secrets
```bash
# Generate secrets
openssl rand -hex 32    # For AUTH_JWT_SECRET
openssl rand -base64 32 # For AUTH_ENCRYPTION_KEY
openssl rand -hex 32    # For AUTH_SESSION_SECRET

# Set in Cloudflare
npx wrangler secret put AUTH_JWT_SECRET
npx wrangler secret put AUTH_ENCRYPTION_KEY
npx wrangler secret put AUTH_SESSION_SECRET
npx wrangler secret put AUTH_CLIENTS_JSON
```

For `AUTH_CLIENTS_JSON`, paste:
```json
[{"clientId":"sleep-cli","clientSecret":"dev-secret","redirectUris":["http://localhost:8765/callback","https://playground.ai.cloudflare.com/oauth/callback"],"scopes":["sleep.read_device","sleep.read_trends","sleep.write_temperature","sleep.prompts.analyze"],"isPublic":false}]
```

### Step 3: Build and Deploy
```bash
npm run build
npx wrangler deploy
```

### Step 4: Verify
Deployed URL: `https://sleep-mcp-server.smallbits.workers.dev/mcp`

Test with MCP Inspector or `mcp-remote`.

## Post-Deployment Validation

- Use `mcp-remote` to tunnel the remote server into Claude Desktop (as per Cloudflare guide).
- Confirm the `/mcp` streamable HTTP endpoint responds and tool calls succeed.
- Check Worker logs via `wrangler tail`.

## Implementation Checklist

### Code Changes
- [ ] Create `wrangler.toml` with Smallbits account ID and KV bindings
- [ ] Create `src/worker.ts` with CloudflareWorkerTransport
- [ ] Create `src/auth/kvStorage.ts` for KV-backed storage
- [ ] Update `src/auth/credentialStorage.ts` to use KV in Workers
- [ ] Update `src/auth/store.ts` to use KV in Workers
- [ ] Add deployment scripts to `package.json`

### Cloudflare Setup (CLI)
- [ ] Create OAUTH_STATE_KV namespace
- [ ] Create CREDENTIALS_KV namespace
- [ ] Create CLIENTS_KV namespace
- [ ] Update `wrangler.toml` with KV IDs
- [ ] Set AUTH_JWT_SECRET secret
- [ ] Set AUTH_ENCRYPTION_KEY secret
- [ ] Set AUTH_SESSION_SECRET secret
- [ ] Set AUTH_CLIENTS_JSON secret

### Deployment
- [ ] Build: `npm run build`
- [ ] Deploy: `npx wrangler deploy`
- [ ] Test with MCP Inspector

## Future Enhancements

- Add environment-specific config (staging vs production) in `wrangler.toml`.
- Consider Cloudflare Access or third-party IdPs as additional authentication options.
