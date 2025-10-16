# Sleep MCP Server – Remote Auth & Transport Hardening Plan

## Objectives

1. Provide secure OAuth 2.1 authentication (Authorization Code + PKCE, Client Credentials) for remote MCP clients.
2. Harden the MCP Streamable HTTP transport against DNS rebinding, origin spoofing, and misuse of session identifiers.
3. Enforce least-privilege scopes for tools/resources and validate Bearer tokens on every request.

## Architecture Overview

1. **OAuth Identity Layer**
   - Expose discovery metadata at `/.well-known/oauth-authorization-server`.
   - Implement `/authorize`, `/token`, `/jwks.json`, and optional `/register`, `/introspect`, `/revoke`.
   - Store client registrations with:
     - `client_id`, optional `client_secret`.
     - Allowed redirect URIs (exact match).
     - Grant types (Authorization Code PKCE, Client Credentials).
     - Allowed scopes.
   - During the authorization code exchange, authenticate the user via the existing `SleepClient` (username/password) and immediately discard the password.
   - Issue signed JWT access tokens (short-lived) and hashed refresh tokens (rotated on use).

2. **Grant Flow Requirements**
   - **Authorization Code + PKCE**:
     - Validate `code_challenge`/`code_verifier`, enforce `S256` method.
     - Display consent UI enumerating requested scopes; store approval per client.
     - Mint access + refresh tokens on `/token` exchange; respect redirect URI whitelist.
   - **Client Credentials**:
     - Require confidential clients.
     - Restrict scopes to non-user-specific actions (e.g., read-only metrics).
   - Tokens include: `iss`, `aud` (e.g., `sleep-mcp-server`), `sub` (Sleep account identifier), `scope` (space-separated), `exp`, `iat`.

3. **Transport Hardening**
   - Configure `StreamableHTTPServerTransport` with:
     - `sessionIdGenerator: () => randomUUID()`.
     - `allowedHosts` / `allowedOrigins` via env (`ALLOWED_HOSTS`, `ALLOWED_ORIGINS`).
     - `enableDnsRebindingProtection: true`.
     - Optional `enableJsonResponse` toggle for debugging.
   - For every response, set CORS headers:
     - `Access-Control-Allow-Origin` limited to configured origin(s).
     - `Access-Control-Allow-Headers`: `Content-Type`, `Authorization`, `Mcp-Session-Id`.
     - `Access-Control-Expose-Headers`: `Mcp-Session-Id`.
   - Enforce spec-compliant errors:
     - 405 for unsupported methods.
     - 406 when SSE GET lacks `Accept: text/event-stream`.
     - 400/404 for missing/invalid sessions (non-initial requests).

4. **Bearer Token Validation**
   - Require `Authorization: Bearer <token>` on every POST and GET `/mcp` request.
   - Validate tokens against JWKS:
     - Verify signature, issuer, audience, expiry, not-before.
     - Accept small clock skew (configurable).
   - Reject invalid tokens with `401 Unauthorized`.
   - Populate `authInfo`/`scope` context for request handlers.

5. **Scope Enforcement**
   - Define scope constants (examples):
     - `sleep.read_device`, `sleep.write_temperature`, `sleep.read_trends`, `sleep.prompts.analyze`.
   - Map handlers:
     - `set_temperature` → `sleep.write_temperature`.
     - `get_device_status`, `sleep://device/status` → `sleep.read_device`.
     - `get_sleep_trends`, `sleep://sleep/latest` → `sleep.read_trends`.
     - Prompt `analyze_sleep` → combination of read scopes.
   - Middleware checks for required scope; respond with `403 Forbidden` (MCP error `-32603` payload) if missing.

6. **Session Management**
   - Treat `Mcp-Session-Id` as connection state only; never as identity proof.
   - Rotate session IDs when clients re-initialize; expire idle sessions (config).
   - Implement DELETE `/mcp` to close sessions and trigger cleanup.

7. **Token Lifecycle & Security**
   - Access tokens: 10–15 minutes expiration.
   - Refresh tokens: stored hashed, rotated on use; revoke on logout.
   - Support token revocation/introspection for admin tooling.
   - No upstream token passthrough—Sleep MCP server issues and validates its own tokens exclusively.

8. **Third-Party API Considerations**
   - If proxying to other OAuth APIs, maintain per-client consent, strict redirect URI validation, CSRF-resistant state parameter, and separate access tokens (avoid confused-deputy).

## Implementation Steps

1. **Auth Service Scaffolding**
   - Create `src/auth/` with routers/controllers for OAuth endpoints.
   - Persist clients, auth codes, refresh tokens (database or KV).
   - Integrate SleepClient authentication in authorization code grant.
   - Generate JWKS (public keys) for token verification.

2. **Token Verification Middleware**
   - Introduce middleware before `transport.handleRequest` that:
     - Handles CORS preflight.
     - Validates Bearer token and attaches scope context.
     - Short-circuits with 401/403 when validation fails.

3. **Handler Updates**
   - Wrap tool/resource/prompt handlers with scope-check helper.
   - Adjust error responses to return MCP-compliant errors (JSON-RPC `error.code` / HTTP status).

4. **Configuration**
   - Add env vars: `AUTH_ISSUER`, `AUTH_AUDIENCE`, `AUTH_JWKS_URL`, `ALLOWED_ORIGINS`, `ALLOWED_HOSTS`, `TOKEN_CLOCK_SKEW`.
   - Document defaults and secure production values (e.g., restrict origins, require HTTPS).

5. **Logging & Monitoring**
   - Log authentication failures (without sensitive info).
   - Track scope denials, token issuance, revocations.
   - Add rate limiting/throttling for auth endpoints.

## Testing Strategy

- **Unit Tests**
  - Token verification success/failure, scope enforcement, CORS header correctness.
- **Integration Tests**
  - Simulate full Authorization Code + PKCE exchange (mock SleepClient).
  - Cover client-credentials grant.
  - Ensure SSE GET endpoints reject missing Bearer tokens and accept valid ones.
- **Security Tests**
  - Attempt requests with invalid Host/Origin when DNS protection enabled.
  - Verify session loss triggers 400/404 per spec.

## Deployment Considerations

- Serve MCP server and auth service over HTTPS; bind dev builds to `127.0.0.1`.
- Provide documentation to integrators:
  - Discovery URL and endpoints.
  - Example PKCE flow (code snippets).
  - Scope-to-feature mapping.
- Monitor for repeated auth failures; enable alerts and automated lockouts.
- Maintain key rotation schedule and publish updated JWKS.

## Checklist for PRs

- [ ] OAuth 2.1 + PKCE fully implemented; discovery document served; redirect URIs exact-match.
- [ ] Bearer tokens validated on every HTTP request (POST/GET) with proper errors.
- [ ] Streamable HTTP transport configured with DNS rebinding protection and restricted origins.
- [ ] CORS headers expose `Mcp-Session-Id` and limit allowed headers/origins.
- [ ] Scope enforcement in place for tools/resources/prompts (403 on missing scope).
- [ ] No token passthrough; access/refresh tokens short-lived and rotated.
- [ ] DELETE `/mcp` and session expiry behavior implemented.
- [ ] Tests cover token validation, scope checks, CORS, SSE auth, and PKCE flow.
