# Sleep MCP Server – Interactive User Authentication Plan

## Goals

1. Eliminate the requirement for static `SLEEP_EMAIL` / `SLEEP_PASSWORD` environment variables.
2. Prompt each end-user to sign into their Sleep account during the OAuth Authorization Code flow.
3. Exchange user-provided credentials for Sleep access/refresh tokens and persist them securely for subsequent API calls.
4. Maintain the existing OAuth 2.1 surface area (`/authorize`, `/token`, etc.) so remote MCP clients keep working with standard flows.
5. Align with the Cloudflare Agents guidance on MCP authorization: the server issues its own tokens even when delegating authentication to a third-party or hosted login flow.

## High-Level Flow

1. MCP client initiates the Authorization Code + PKCE flow by visiting `/authorize`.
2. Server presents a login + consent UI where the user enters Sleep email/password.
3. Server calls `SleepClient.authenticate` with submitted credentials; on success, it stores the resulting Sleep tokens (not the password) in a short-lived session keyed to the pending authorization request.
4. Server issues an authorization code and redirects the user back to the MCP client’s redirect URI.
5. MCP client exchanges the code at `/token`; the server mints an MCP access token and (optionally) refresh token, while also persisting the Sleep refresh token for future use.
6. Subsequent MCP tool/resource calls use the stored Sleep tokens associated with the subject from the access token; when the Sleep access token expires, the server refreshes it transparently using the stored Sleep refresh token.

## Detailed Components

### 1. Authorization Endpoint (`/authorize`)

#### Browser UX requirements

When the MCP client opens `GET /authorize` in the user’s browser, the Worker must respond with a real HTML page (or redirect to a frontend) that:

- Displays Sleep login form fields (email/password) plus a consent summary listing the requesting `client_id` and scopes.
- Preserves all OAuth parameters (`client_id`, `redirect_uri`, `code_challenge`, `code_challenge_method`, `state`, `scope`) as hidden inputs.
- Includes a CSRF token (stored server-side or in a signed cookie) so the subsequent POST can be validated.
- Optionally presents branding and a link to terms/privacy.

#### POST handling

The login form posts back to `/authorize`; the server must:

1. Validate CSRF token, PKCE params, client registration, redirect URI, and state.
2. Call `SleepClient.authenticate(email, password)` with the submitted credentials.
3. On success, fetch `SleepClient.getUserProfile()` to obtain `userId`, `deviceId`, and capture Sleep access/refresh tokens.
4. Store the Sleep token bundle (encrypted) in a short-lived cache keyed to a generated authorization code.
5. Redirect the browser back to `redirect_uri` with `code=...` and the original `state`.

#### Error handling

- Wrong credentials → redisplay the login form with a friendly error.
- Invalid OAuth params → return the spec-defined error (`invalid_request`, `unauthorized_client`, etc.).
- Allow the consent view to provide a “Cancel” button that redirects with `error=access_denied`.

### 2. Cloudflare OAuth Provider Integration

The [Cloudflare Workers OAuth Provider Library](https://github.com/cloudflare/workers-oauth-provider) already provides an MCP-ready OAuth façade. We should host our server behind it so we inherit the battle-tested flow described in the Agents docs:

```ts
export default new OAuthProvider({
  apiRoute: '/mcp',
  apiHandler: sleepMcpRouter,          // existing MCP JSON-RPC handler
  defaultHandler: sleepAuthHandler,    // renders login form & handles POST
  authorizeEndpoint: '/authorize',
  tokenEndpoint: '/token',
  clientRegistrationEndpoint: '/register',
});
```

- `sleepAuthHandler` is responsible for rendering the Sleep login UI and processing credentials before handing control back to the provider.
- The provider ensures the full RFC-compliant Authorization Code + PKCE flow (401 challenge, browser redirect, code exchange) matches the sequence diagrams in the Cloudflare docs.
- If we ever switch to a third-party IdP (Access, Auth0, Stytch, etc.), we can swap `sleepAuthHandler` for their provided handler without rewriting our MCP transport.
- Use the Workers guide “Build a Remote MCP server” as the blueprint: start from the `remote-mcp-authless` template, then substitute our handler (akin to the GitHub example’s `defaultHandler`) with a `SleepAuthHandler` that prompts for Sleep credentials.

### 3. Token Endpoint (`/token`)

- **Authorization Code Grant**:
  - Look up stored Sleep token bundle using the authorization code.
  - Issue MCP access token (JWT) with subject = Sleep `userId`.
  - Persist Sleep refresh token encrypted, associated with MCP subject + client.
  - Optionally issue MCP refresh token; when redeemed, re-use stored Sleep refresh token to refresh upstream Sleep access tokens.
  - Delete one-time authorization-code bundle after exchange.
- **Refresh Token Grant**:
  - Validate MCP refresh token.
  - Retrieve persisted Sleep refresh token; refresh Sleep access token if needed.
  - Issue new MCP access token (and rotate refresh token if desired).
- **Client Credentials Grant**:
  - Remain supported (server-to-server automation) but will not access user-specific Sleep data unless separately provisioned.

### 4. Storage & Encryption

- **Authorization Code Store**:
  - Key: authorization code string.
  - Value: Sleep access token, Sleep refresh token, Sleep token expiration, Sleep profile metadata, PKCE verifier method, client/id info.
  - TTL: 5 minutes (matching OAuth spec); purge on exchange or expiration.
- **User Credential Store**:
  - Key: `(subject, clientId)` or `(Sleep userId, MCP clientId)`.
  - Value: encrypted Sleep refresh token, current Sleep access token + expiry, device metadata.
  - Encryption: use server-side secret (e.g., derived from `AUTH_JWT_SECRET` or dedicated `AUTH_ENCRYPTION_KEY`).
  - Provide helper to refresh Sleep tokens when `expiresAt` is close.

### 5. Sleep API Usage Adjustments

- Update `bootstrap()` to skip static credential login.
- Introduce helper service (e.g., `SleepAccountService`) to fetch the proper Sleep access token for a given subject:
  - On each tool/resource handler, derive subject from MCP access token (`extra.authInfo.extra.subject` or similar).
  - Fetch stored tokens; if access token is expiring, refresh via Sleep refresh token.
  - Instantiate `SleepClient` for the subject’s tokens or update existing client instance with new tokens.

### 6. Session Management & Security

- Ensure login form posts via HTTPS; enforce CSRF protection (e.g., hidden token tied to session).
- Validate `state` parameter to prevent CSRF in OAuth flow.
- Do not log raw credentials; wipe them from memory after authentication.
- Consider adding rate limiting or captcha for repeated failed logins.

### 7. User Experience

- Minimal HTML template for login (rendered server-side or served from `/public/auth.html`):
  - Sleep branding or generic “Sleep account” label.
  - “Remember this device” checkbox (optional; would influence refresh token storage duration).
- Provide success page fallback in case redirect URI is not provided or invalid.
- Add an error page for unsupported browsers (rare but possible if JS disabled, etc.).

## Configuration Changes

- Remove requirement for `SLEEP_EMAIL`, `SLEEP_PASSWORD`, `SLEEP_TIMEZONE`.
- Add env vars:
  - `AUTH_ENCRYPTION_KEY` (base64) for encrypting Sleep refresh tokens.
  - `AUTH_SESSION_SECRET` for CSRF tokens / cookie signing (if using cookie-based session).
  - `AUTH_FORM_TEMPLATE` (optional path to custom login HTML).
  - `KV_SLEEP_TOKENS` (Workers KV binding) or equivalent durable store for Sleep refresh tokens.
- Update documentation to explain new flow and configuration.

## Testing Strategy

1. **Unit Tests**
   - Authorization code store read/write/expiry.
   - Encryption/decryption helpers.
   - Sleep token refresh logic (mocking SleepClient).
2. **Integration Tests (Vitest or Playwright)**
   - Simulate full `/authorize` -> Sleep login -> `/token` flow with mocked SleepClient.
   - Refresh token rotation (MCP + Sleep).
3. **Local OAuth Loop (manual/automated)**
   - Start the Worker locally (`npm start`) and run MCP Inspector (`npx @modelcontextprotocol/inspector`).
   - Use the Inspector’s “Quick OAuth Flow” (from Cloudflare doc) to walk through 401 → browser login → callback → tool invocation.
4. **Manual QA**
   - Run the server locally, walk through login UI in a browser, confirm redirect to MCP client.
   - Trigger expired Sleep tokens to ensure refresh logic works.

## Deployment Considerations

- Require HTTPS termination in front of the server (no plain HTTP in production).
- Ensure storage for Sleep refresh tokens is durable and encrypted (file-based key store, database, or cloud secret manager).
- Provide a migration path for existing users stored via env vars (e.g., prompt them to re-login).
- Document a recovery procedure for revoked Sleep refresh tokens (user must re-authorize).
- Follow the Cloudflare deployment steps: scaffold Worker (`npm create cloudflare@latest …`), configure KV/secrets via `wrangler secret put`, deploy with `npx wrangler deploy`, then test remotely using MCP Inspector or `mcp-remote` as shown in the guide.

## Implementation Phases

1. **Scaffold Login UI & Session Store**
2. **Modify `/authorize` & `/token` to use interactive login**
3. **Persist Sleep tokens per user + refresh mechanism**
4. **Remove static credential login from server bootstrap**
5. **Update docs/tests & perform end-to-end validation**
