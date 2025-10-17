# MCP Platform Scaffolding Plan

## Goal

Create a reusable scaffolding that cleanly separates:

- **Cloudflare runtime plumbing** (Wrangler config, Worker entry, KV bindings, secret bootstrap)
- **Generic auth provider + credential storage** (extensible across different third-party APIs)
- **MCP server wiring** (transport, lifecycle, tool/resource registration)
- **Provider-specific adapters** (Sleep client today, other vendors later)

This lets us spin up additional MCP servers (e.g., finance, calendars, home automation) with minimal duplication while maintaining the same security guarantees.

---

## Proposed Package Layout

```
src/
 ├─ platform/
 │   ├─ cloudflare/
 │   │   ├─ worker.ts         # nodejs_compat bootstrap, env hydration, KV bindings
 │   │   └─ secrets.ts        # helpers for secret validation & documentation
 │   ├─ auth/
 │   │   ├─ provider.ts       # interfaces + base implementations
 │   │   ├─ storage.ts        # per-grant key derivation, refresh hashing
+│   │   └─ tokens.ts         # JWT issuance, refresh grant orchestration
 │   ├─ mcp/
 │   │   ├─ transport.ts      # shared Streamable HTTP transport helpers
 │   │   ├─ server.ts         # base `McpServer` bootstrap + tool registry hooks
 │   │   └─ scopes.ts         # generic scope enforcement utilities
 │   └─ logging.ts            # structured logger, Cloudflare-tail friendly
 ├─ providers/
 │   ├─ sleep/
 │   │   ├─ authProvider.ts   # extends platform/auth/provider
 │   │   ├─ client.ts         # Sleep API client (timeouts, fetch wrappers)
 │   │   └─ tools.ts          # tool/resource definitions
 │   └─ calendar/             # future providers
 └─ workers/
     └─ sleep/
         ├─ entry.ts          # imports platform/cloudflare + providers/sleep
         └─ config.ts         # provider-specific defaults (scopes, metadata)
```

---

## Layer Responsibilities

### `platform/cloudflare`

- Provides a `createWorkerHandler(options)` that:
  - Accepts auth provider, MCP transport, KV bindings
  - Loads secrets from `env`, hydrates `process.env` when nodejs_compat is enabled
  - Validates required secrets (e.g., `AUTH_ENCRYPTION_KEY`, `AUTH_SESSION_SECRET`, `AUTH_JWT_SECRET`, `AUTH_CLIENTS_JSON`)
- Exports Wrangler “hints” (doc generation for `wrangler.toml`)

### `platform/auth`

- `AuthenticationProvider` interface + base class handling:
  - `authenticate`, `createClient`, `refreshCredentials`
  - Default scope list
- `storage.ts` encapsulates:
  - Per-grant key derivation (HMAC(master, provider:subject:client))
  - Pending grant storage (master key) vs long-term grant storage (derived key)
  - Refresh token hash rotation (current + previous)
  - Retrieval + revocation helpers
- `tokens.ts` handles:
  - Authorization-code issuance/validation (PKCE)
  - Access/refresh JWT issuance (`AUTH_JWT_SECRET`)
  - Refresh grant flow (hash matching, provider `refreshCredentials`)

### `platform/mcp`

- Helpers to glue MCP SDK objects:
  - `createMcpServer({ tools, resources, prompts })`
  - `withAuthenticatedClient(handler)` (takes scopes, uses platform/auth to fetch credentials)
  - Scope enforcement utility (`requireScopes(scopes, handler)`)
- Streamable HTTP transport bootstrap (single endpoint + GET/HEAD 204 fallback)

### `providers/<name>`

- Implements provider-specific `AuthProvider` extending base class
- Exports `registerTools(server, context)` with provider-specific tool logic
- Defines provider defaults (`provider.defaultScopes`, metadata, etc.)

### `workers/<name>`

- Entry point combining:
  - `platform/cloudflare.createWorkerHandler`
  - Provider-specific auth provider
  - Provider-specific tool registration
  - Optional provider configuration (e.g., documentation link, display name)

---

## Migration Steps

1. **Extract platform modules**
   - Move current `src/auth/provider.ts`, `src/auth/credentialStorage.ts`, `src/auth/tokens.ts` into `src/platform/auth/`
   - Move Worker bootstrap (`src/worker.ts`) into `src/platform/cloudflare/worker.ts` and expose a factory that accepts provider + tool registration

2. **Define base MCP server helpers**
   - Wrap `new Server(...)`, move `withSleepClient` pattern into reusable `withAuthenticatedClient` util
   - Provide built-in scope checking (currently TODO)

3. **Refactor Sleep provider**
   - Place Sleep-specific bits in `src/providers/sleep/` (client, auth provider, tools)
   - Update worker entry to instantiate `SleepAuthProvider`, register tools, pass into platform factory

4. **Documentation & templates**
   - Update `docs/AUTH_FLOW.md` to reference platform modules
   - Add quick-start guide for creating a new provider (clone template directory, implement auth + tools)

5. **Future enhancements**
   - Provide CLI command scaffolding (`npm run create-provider -- sleep`)
   - Once a Worker-native MCP transport is published, swap `platform/cloudflare` implementation to use it transparently

---

## Example Worker Entrypoint (future)

```ts
// workers/sleep/entry.ts
import { createWorkerHandler } from '../../platform/cloudflare/worker';
import { createSleepAuthProvider } from '../../providers/sleep/authProvider';
import { registerSleepTools } from '../../providers/sleep/tools';

const authProvider = createSleepAuthProvider();

export default createWorkerHandler({
  authProvider,
  registerTools: registerSleepTools,
});
```

This keeps future workers similarly small; the heavy lifting stays in the platform modules.

---

## Benefits

- **Consistency**: All MCP projects share the same auth/transport semantics.
- **Security**: Improvements (per-grant keys, refresh rotation, scope enforcement) live in one place.
- **Productivity**: New provider requires implementing only provider-specific pieces.
- **Documentation**: Easier to explain + enforce required secrets/KV bindings across teams.

---

## Next Steps

- Implement platform modules incrementally (start with auth + storage extraction).
- Refactor Sleep worker to the new structure.
- Validate tests + Wrangler deploy.
- Document how to add new providers + generate Worker scaffolding.

