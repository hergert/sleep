# Sleep MCP Server Authentication Flow

**Last Updated:** 2025-10-17
**Status:** Production
**Transport:** Streamable HTTP (MCP over POST/GET)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Phase 1: OAuth Authorization Flow](#phase-1-oauth-authorization-flow)
4. [Phase 2: Token Exchange](#phase-2-token-exchange)
5. [Phase 3: Authenticated MCP Requests](#phase-3-authenticated-mcp-requests)
6. [Security Model](#security-model)
7. [Storage Schema](#storage-schema)
8. [Key Security Components](#key-security-components)

---

## Overview

The Sleep MCP Server implements a custom OAuth 2.1 provider with PKCE support that proxies authentication to the Eight Sleep API. This allows MCP clients (Claude.ai, CLI tools, etc.) to securely control Eight Sleep devices on behalf of authenticated users.

### Key Characteristics

- **OAuth 2.1 + PKCE**: Industry-standard authorization flow with proof key
- **Password-based flow**: Users authenticate with Eight Sleep credentials (not standard OAuth redirect)
- **Streamable HTTP**: Uses MCP's POST/GET transport (not SSE)
- **Cloudflare Workers**: Deployed on edge, uses KV for storage
- **Per-grant encryption**: Each grant derives its own AES key from the master secret
- **Hashed refresh tokens**: Grant records store current/previous refresh token hashes for retry safety
- **Upstream token refresh at auth layer**: Refresh logic runs during OAuth grant refresh, before tool handlers execute

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         MCP Client                               │
│              (Claude.ai, mcp-cli, Inspector)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 1. Discover OAuth endpoints
                             │ GET /.well-known/oauth-authorization-server
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Sleep MCP Server (Worker)                     │
│                                                                  │
│  ┌────────────────────┐          ┌─────────────────────────┐   │
│  │  OAuth Provider    │          │   MCP Server            │   │
│  │                    │          │                         │   │
│  │  • /authorize      │◄─────────┤  • /mcp (POST/GET)     │   │
│  │  • /token          │          │  • tools/call          │   │
│  │  • /register       │          │  • resources/read      │   │
│  └────────┬───────────┘          └────────┬────────────────┘   │
│           │                                │                     │
│           │                                │                     │
│  ┌────────▼────────────────────────────────▼────────────────┐   │
│  │              Cloudflare Workers KV                        │   │
│  │                                                            │   │
│  │  • oauth_state:{state}      → Pending OAuth flows        │   │
│  │  • oauth_clients:{id}       → Client registrations       │   │
│  │  • pending:{code}           → Temp credentials (5min)    │   │
│  │  • cred:{subject}::{client} → Long-term credentials      │   │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ 2. Authenticate & fetch device data
                           │ POST https://client-api.8slp.net/v1/login
                           ↓
           ┌───────────────────────────────────────┐
           │     Eight Sleep API (Third-Party)     │
           │                                        │
           │  • POST /v1/login                     │
           │  • GET /v1/users/me                   │
           │  • PUT /v1/devices/{id}/temperature   │
           │  • GET /v1/users/{id}/trends          │
           └───────────────────────────────────────┘
```

---

## Phase 1: OAuth Authorization Flow

### 1. User Initiates Connection

**Actor:** MCP Client (Claude.ai, mcp-cli, etc.)

The client discovers OAuth endpoints by fetching server metadata:

```http
GET /.well-known/oauth-authorization-server HTTP/1.1
Host: sleep-mcp-server.clearmenu-edge.workers.dev
```

**Response:**
```json
{
  "issuer": "https://sleep-mcp-server.clearmenu-edge.workers.dev",
  "authorization_endpoint": "https://sleep-mcp-server.clearmenu-edge.workers.dev/authorize",
  "token_endpoint": "https://sleep-mcp-server.clearmenu-edge.workers.dev/token",
  "registration_endpoint": "https://sleep-mcp-server.clearmenu-edge.workers.dev/register",
  "jwks_uri": "https://sleep-mcp-server.clearmenu-edge.workers.dev/jwks.json",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "code_challenge_methods_supported": ["S256"]
}
```

**Code Reference:** [src/auth/http.ts:494-505](../src/auth/http.ts#L494-L505) - `handleDiscovery()`

---

### 2. Authorization Request (GET /authorize)

**Actor:** MCP Client → User's Browser

Client generates PKCE challenge and redirects user to authorization endpoint:

```http
GET /authorize?response_type=code&client_id=sleep-cli&redirect_uri=http://localhost:6274/oauth/callback&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256&scope=sleep.read_device%20sleep.write_temperature&state=abc123 HTTP/1.1
Host: sleep-mcp-server.clearmenu-edge.workers.dev
```

**PKCE Flow:**
```typescript
// Client generates (not visible to server):
const codeVerifier = randomBytes(32).toString('base64url');  // 43-128 chars
const codeChallenge = sha256(codeVerifier).toString('base64url');

// Client sends:
// code_challenge = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"
// code_challenge_method = "S256"

// Client keeps secret:
// code_verifier (will send later during token exchange)
```

**Code Reference:** [src/auth/http.ts:171-212](../src/auth/http.ts#L171-L212) - `parseAuthorizeRequest()`

---

### 3. Login Form Rendered

**Actor:** Sleep MCP Server → User's Browser

Server validates the request and renders an HTML login form:

```typescript
// Generate CSRF token for form protection
const csrfToken = issueCsrfToken();  // Random 24-byte token, 10min TTL

// Render form with hidden OAuth parameters
renderLoginForm(res, authorizeContext, {
  csrfToken,
  email: params.get('email') ?? undefined,
});
```

**HTML Form Structure:**
```html
<form method="post" action="/authorize">
  <!-- Hidden OAuth parameters (preserved through form submit) -->
  <input type="hidden" name="response_type" value="code" />
  <input type="hidden" name="client_id" value="sleep-cli" />
  <input type="hidden" name="redirect_uri" value="http://localhost:6274/oauth/callback" />
  <input type="hidden" name="state" value="abc123" />
  <input type="hidden" name="scope" value="sleep.read_device sleep.write_temperature" />
  <input type="hidden" name="code_challenge" value="E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM" />
  <input type="hidden" name="code_challenge_method" value="S256" />
  <input type="hidden" name="csrf_token" value="{CSRF_TOKEN}" />

  <!-- User credentials -->
  <label>
    Email
    <input type="email" name="email" required />
  </label>
  <label>
    Password
    <input type="password" name="password" required />
  </label>

  <button type="submit" name="action" value="approve">Continue</button>
  <button type="submit" name="action" value="cancel">Cancel</button>
</form>
```

**Code Reference:** [src/auth/http.ts:214-245](../src/auth/http.ts#L214-L245) - `renderLoginForm()`

---

### 4. User Submits Credentials (POST /authorize)

**Actor:** User's Browser → Sleep MCP Server

User enters Eight Sleep email/password and submits form:

```http
POST /authorize HTTP/1.1
Host: sleep-mcp-server.clearmenu-edge.workers.dev
Content-Type: application/x-www-form-urlencoded

response_type=code&client_id=sleep-cli&redirect_uri=http://localhost:6274/oauth/callback&state=abc123&scope=sleep.read_device%20sleep.write_temperature&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256&csrf_token={CSRF_TOKEN}&email=user@example.com&password=secret123&action=approve
```

**Code Reference:** [src/auth/http.ts:300-398](../src/auth/http.ts#L300-L398) - `handleAuthorize()` POST handler

---

### 5. Authentication & Credential Storage

**Actor:** Sleep MCP Server → Eight Sleep API → Cloudflare KV

Server processes the login and stores encrypted credentials:

```typescript
// a. Validate CSRF token (prevents replay attacks)
if (!validateCsrfToken(csrfToken)) {
  // Re-render form with error
  renderLoginForm(res, authorizeContext, {
    csrfToken: issueCsrfToken(),
    error: 'Your session expired. Please try signing in again.',
    email
  });
  return;
}

// b. Authenticate with Eight Sleep API
const sleepClient = new SleepClient();
const tokens = await sleepClient.authenticate(email, password);
// → POST https://client-api.8slp.net/v1/login
// ← { token: "eyJ...", expiresDate: "2025-10-18T...", userId: "..." }

const profile = await sleepClient.getUserProfile();
// → GET https://client-api.8slp.net/v1/users/me
// ← { user: { userId: "...", firstName: "...", email: "..." }, currentDevice: { id: "..." } }

const credentials: CredentialPayload = {
  accessToken: tokens.token,
  refreshToken: tokens.token,  // Eight Sleep doesn't separate these
  expiresAt: new Date(tokens.expiresDate).getTime(),
  userId: tokens.userId,
  metadata: {
    deviceId: profile.currentDevice?.id,
    firstName: profile.firstName
  }
};

// c. Generate authorization code (JWT, expires in 10 minutes)
const code = await generateAuthorizationCode(config, {
  clientId: 'sleep-cli',
  redirectUri: 'http://localhost:6274/oauth/callback',
  scopes: ['sleep.read_device', 'sleep.write_temperature'],
  subject: tokens.userId,  // Eight Sleep user ID
  codeChallenge: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
  codeChallengeMethod: 'S256'
});
// → JWT: { sub: userId, cid: clientId, scp: [...], chl: challenge, chm: method, exp: +10min }

// d. Store credentials temporarily (pending token exchange)
await storePendingCredential(code, 'sleep', credentials);
// → KV: pending:{code} = {
//      providerId: "sleep",
//      data: "{\"iv\":\"...\",\"ciphertext\":\"...\",\"tag\":\"...\"}",  // AES-256-GCM encrypted
//      expiresAt: Date.now() + 300000  // 5 minutes
//    }
//    TTL: 300 seconds (auto-delete after 5min)

// e. Redirect back to client with authorization code
const redirect = new URL('http://localhost:6274/oauth/callback');
redirect.searchParams.set('code', code);
redirect.searchParams.set('state', 'abc123');

res.writeHead(302, { Location: redirect.toString() });
res.end();
// → HTTP 302 Location: http://localhost:6274/oauth/callback?code={CODE}&state=abc123
```

**What's Stored in `pending:{code}`:**

```json
{
  "providerId": "sleep",
  "data": "{\"iv\":\"rGfY3mK...\",\"ciphertext\":\"hF8sK2...\",\"tag\":\"mN4pL...\"}",
  "expiresAt": 1729123756789
}
```

**Encrypted Payload (decrypted view):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": 1729137356789,
  "userId": "8sleep_user_123",
  "metadata": {
    "deviceId": "device_abc789",
    "firstName": "John"
  }
}
```

**Code References:**
- `src/auth/http.ts` – Authorization handler (`handleAuthorize()`)
- `src/auth/tokens.ts` – `generateAuthorizationCode()`
- `src/auth/credentialStorage.ts` – `storePendingCredential()` / `consumePendingCredential()`

---

## Phase 2: Token Exchange

### 6. Client Exchanges Code for Tokens (POST /token)

**Actor:** MCP Client → Sleep MCP Server

Client receives the authorization code and exchanges it for access/refresh tokens:

```http
POST /token HTTP/1.1
Host: sleep-mcp-server.clearmenu-edge.workers.dev
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code={AUTH_CODE}&client_id=sleep-cli&redirect_uri=http://localhost:6274/oauth/callback&code_verifier={CODE_VERIFIER}
```

**Server Processing:**

```typescript
// a. Verify authorization code (JWT)
const record = await redeemAuthorizationCode(config, code, clientId, redirectUri, codeVerifier);
// → Validates:
//   - JWT signature (using AUTH_JWT_SECRET)
//   - Expiration (10 min TTL)
//   - Client ID match
//   - Redirect URI match
//   - PKCE challenge: sha256(codeVerifier) === record.codeChallenge
// → Returns: { subject, clientId, scopes, codeChallenge, codeChallengeMethod }
// → Marks code as used (prevents replay)

// b. Retrieve pending credentials from KV
const pending = await consumePendingCredential(code);
// → KV GET: pending:{code}
// → Decrypt with master key (no grant identity yet)
// → Delete from KV (single-use)
// → Returns: { providerId: "sleep", credentials: {...} }

if (!pending) {
  throw new OAuthError(400, 'invalid_grant', 'Provider credentials missing or expired');
}

// c. Persist credentials long-term
await persistCredentials(record.subject, clientId, 'sleep', pending.credentials);
// → Derive grant key K = HMAC(master, "sleep:${subject}:${clientId}")
// → Encrypt props with K
// → Hash refresh token (SHA-256)
// → KV PUT: cred:{subject}::{clientId} = {
//      providerId: "sleep",
//      encryptedProps: "{\"iv\":\"...\",\"ciphertext\":\"...\",\"tag\":\"...\"}",
//      refreshTokenHash: "5c2f...",
//      previousRefreshTokenHash: null
//    }

// d. Issue MCP OAuth tokens
const response = await createTokenResponse(config, record.subject, clientId, record.scopes, true);
// → Generates:
//   - access_token: JWT with subject, clientId, scopes (1 hour TTL)
//   - refresh_token: JWT with subject, clientId (no expiry)
// → Signed with AUTH_JWT_SECRET
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4c2xlZXBfdXNlcl8xMjMiLCJjaWQiOiJzbGVlcC1jbGkiLCJzY3AiOlsic2xlZXAucmVhZF9kZXZpY2UiLCJzbGVlcC53cml0ZV90ZW1wZXJhdHVyZSJdLCJpYXQiOjE3MjkxMjM0NTYsImV4cCI6MTcyOTEyNzA1Nn0...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4c2xlZXBfdXNlcl8xMjMiLCJjaWQiOiJzbGVlcC1jbGkiLCJ0eXAiOiJyZWZyZXNoIiwiaWF0IjoxNzI5MTIzNDU2fQ...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "sleep.read_device sleep.write_temperature"
}
```

**JWT Structure (access_token):**
```json
{
  "sub": "8sleep_user_123",           // Eight Sleep user ID (subject)
  "cid": "sleep-cli",                 // OAuth client ID
  "scp": ["sleep.read_device", "sleep.write_temperature"],  // Granted scopes
  "iat": 1729123456,                  // Issued at (Unix timestamp)
  "exp": 1729127056                   // Expires at (1 hour later)
}
```

**Code References:**
- `src/auth/http.ts` – `handleToken()` (authorization_code grant)
- `src/auth/tokens.ts` – `redeemAuthorizationCode()`
- `src/auth/credentialStorage.ts` – `consumePendingCredential()` / `persistCredentials()`
- `src/auth/tokens.ts` – `createTokenResponse()`

### 6b. Refresh Grant Flow (POST /token, grant_type=refresh_token)

```mermaid
sequenceDiagram
    participant C as MCP Client
    participant W as Worker
    participant KV as KV (cred store)
    participant E as Eight Sleep API

    C->>W: POST /token (refresh_token, client_id)
    W->>KV: Load grant record (hashed refresh tokens)
    alt Hash matches current or previous
        W->>E: (Optional) refresh Eight Sleep token when near expiry
        E-->>W: New token bundle
        W->>KV: Update grant → encryptedProps + hash rotation
        W-->>C: New access token (+ rotated refresh token)
    else Invalid hash
        W-->>C: 400 invalid_grant
    end
```

**Key points:**

- Grant identity is derived from the MCP refresh token (`sub`, `cid`).
- The stored `refreshTokenHash` and `previousRefreshTokenHash` guard against replay and support retriable refreshes.
- `SleepAuthProvider.refreshCredentials()` decides when the upstream (Eight Sleep) token needs rotation.
- Updated grant records are persisted before issuing the new MCP tokens so retries see the latest state.

---

## Phase 3: Authenticated MCP Requests

### 7. Client Makes MCP Request

**Actor:** MCP Client → Sleep MCP Server

Client makes MCP tool call with Bearer token:

```http
POST /mcp HTTP/1.1
Host: sleep-mcp-server.clearmenu-edge.workers.dev
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "set_temperature",
    "arguments": {
      "level": 50,
      "durationSeconds": 3600
    }
  }
}
```

**Worker Processing:**

```typescript
// a. Verify Bearer token (JWT)
const authHeader = request.headers.get('authorization');
const token = authHeader.slice('Bearer '.length);

const verified = verifyAccessToken(config, token);
// → Validates:
//   - JWT signature (AUTH_JWT_SECRET)
//   - Expiration (1 hour TTL)
//   - Token structure
// → Returns: { subject, clientId, scopes, expiresAt }

// b. Attach auth context to request
nodeReq.auth = {
  token,
  clientId: verified.clientId,
  scopes: verified.scopes,
  expiresAt: verified.expiresAt,
  extra: { subject: verified.subject }
};

// c. Pass to MCP transport
await transport.handleRequest(nodeReq, nodeRes);
// → MCP SDK processes JSON-RPC request
// → Calls tool handler with `extra` containing auth context
```

**Code Reference:** [src/worker.ts:217-277](../src/worker.ts#L217-L277) - MCP request authentication

---

### 8. MCP Server Retrieves Provider Credentials

**Actor:** MCP Server → Cloudflare KV → Eight Sleep API

MCP tool handler retrieves Eight Sleep credentials and executes API call:

```typescript
// In tool handler (e.g., set_temperature)
server.setRequestHandler(CallToolRequestSchema, async ({ params }, extra) => {
  const { name, arguments: rawArgs = {} } = params;

  switch (name) {
    case 'set_temperature': {
      return await withSleepClient(extra, async ({ client, deviceId }) => {
        // client is SleepClient with Eight Sleep tokens
        await client.setHeatingLevel(level, durationSeconds);
        // → PUT https://client-api.8slp.net/v1/devices/{deviceId}/temperature
        //   Authorization: Bearer {Eight Sleep access token}

        return {
          content: [{ type: 'text', text: `Temperature set to ${level}` }],
          structuredContent: { status: 'ok', level, durationSeconds }
        };
      });
    }
  }
});

// withSleepClient() helper extracts credentials:
const withSleepClient = async (extra, handler) => {
  // a. Extract auth context from JWT
  const context = getAuthContext(extra);
  // → { subject: "8sleep_user_123", clientId: "sleep-cli", authInfo: {...} }

  // b. Retrieve Sleep credentials from KV
  const credentials = await getProviderCredentials(context.subject, context.clientId);
  // → KV GET: cred:8sleep_user_123::sleep-cli
  // → Decrypt with AUTH_ENCRYPTION_KEY
  // → Returns: {
  //     accessToken: "eyJ...",
  //     refreshToken: "eyJ...",
  //     expiresAt: 1729137356789,
  //     userId: "8sleep_user_123",
  //     metadata: { deviceId: "device_abc789", firstName: "John" }
  //   }

  if (!credentials) {
    throw new Error('Account credentials not found. Please sign in again.');
  }

  // c. Create Sleep API client
  const client = await provider.createClient(credentials);
  // → new SleepClient({ accessToken, refreshToken, expiresAt, userId, metadata })

  // d. Execute tool handler
  const result = await handler({
    client,
    deviceId: credentials.metadata.deviceId,
    credentials,
    subject: context.subject,
    clientId: context.clientId
  });

  // e. Save refreshed tokens if updated
  const updatedTokens = client.getTokenBundle();
  if (
    updatedTokens.accessToken !== credentials.accessToken ||
    updatedTokens.refreshToken !== credentials.refreshToken ||
    updatedTokens.expiresAt !== credentials.expiresAt
  ) {
    await persistCredentials(context.subject, context.clientId, 'sleep', {
      ...credentials,
      accessToken: updatedTokens.accessToken,
      refreshToken: updatedTokens.refreshToken,
      expiresAt: updatedTokens.expiresAt
    });
    // → KV PUT: cred:8sleep_user_123::sleep-cli (updated)
  }

  return result;
};
```

**Code References:**
- [src/server.ts:93-151](../src/server.ts#L93-L151) - `withSleepClient()` helper
- [src/server.ts:277-366](../src/server.ts#L277-L366) - Tool request handlers
- [src/auth/http.ts:637-649](../src/auth/http.ts#L637-L649) - `getProviderCredentials()`
- [src/client.ts](../src/client.ts) - `SleepClient` Eight Sleep API wrapper

---

## Security Model

### End-to-End Encryption Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as MCP Client
    participant W as Worker (OAuth + MCP)
    participant KV as Cloudflare KV
    participant E as Eight Sleep API

    U->>W: Submit Sleep credentials (POST /authorize)
    W->>E: Authenticate, fetch profile/device
    E-->>W: Eight Sleep tokens (access, refresh)
    Note over W: Encrypt with per-grant key K(prov, sub, client)
    W->>KV: pending:{code} ← encrypted bundle
    C->>W: POST /token (code + verifier)
    W->>KV: consume pending record, persist cred:{subject}::{client}
    W-->>C: Access + refresh JWTs
    C->>W: POST /mcp with access token
    W->>KV: Decrypt grant with K(prov, sub, client)
    W->>E: Invoke Eight Sleep API
    E-->>W: Result
    W-->>C: MCP response
```

### Encryption Details

**Algorithm:** AES-256-GCM (Galois/Counter Mode)
- **Key Size:** 256 bits (32 bytes)
- **IV Size:** 96 bits (12 bytes, randomly generated per encryption)
- **Tag Size:** 128 bits (16 bytes, for authentication)

**Master Secret:** `AUTH_ENCRYPTION_KEY` (base64-encoded, Cloudflare Secret)

**Per-Grant Key Derivation:**
```typescript
const masterKey = Buffer.from(process.env.AUTH_ENCRYPTION_KEY, 'base64');

function deriveGrantKey(providerId: string, subject: string, clientId: string): Buffer {
  return crypto
    .createHmac('sha256', masterKey)
    .update(`${providerId}:${subject}:${clientId}`)
    .digest(); // 32 bytes
}
```

**Encryption Process:**
```typescript
const grantKey = deriveGrantKey('sleep', subject, clientId);
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', grantKey, iv);
const serialized = JSON.stringify(payload);
const ciphertext = Buffer.concat([cipher.update(serialized, 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();

return JSON.stringify({
  iv: iv.toString('base64'),
  ciphertext: ciphertext.toString('base64'),
  tag: tag.toString('base64'),
});
```

**Decryption Process:**
```typescript
const grantKey = deriveGrantKey(record.providerId, subject, clientId);
const { iv, ciphertext, tag } = JSON.parse(data);
const decipher = crypto.createDecipheriv('aes-256-gcm', grantKey, Buffer.from(iv, 'base64'));
decipher.setAuthTag(Buffer.from(tag, 'base64'));
const plaintext = Buffer.concat([
  decipher.update(Buffer.from(ciphertext, 'base64')),
  decipher.final()
]);
return JSON.parse(plaintext.toString('utf8'));
```

> **Pending credentials:** short-lived `pending:{code}` records still encrypt with the master key because the grant identity is not yet established.

### Refresh Token Hashing & Retry Safety

- Persisted grants record `refreshTokenHash = SHA-256(refreshToken)`
- On refresh success, the previous hash is copied to `previousRefreshTokenHash`
- During a subsequent refresh request, the server accepts either hash so clients can safely retry if the new token response was lost
- Hash matching happens before contacting Eight Sleep to avoid redundant upstream refresh attempts

### PKCE (Proof Key for Code Exchange)

**Purpose:** Prevent authorization code interception attacks

**Flow:**
```typescript
// 1. Client generates code verifier (43-128 random bytes)
const codeVerifier = crypto.randomBytes(32).toString('base64url');
// → "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"

// 2. Client computes code challenge
const codeChallenge = crypto.createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');
// → "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"

// 3. Client sends challenge (keeps verifier secret)
GET /authorize?code_challenge={codeChallenge}&code_challenge_method=S256

// 4. Server stores challenge in authorization code (JWT claim)
const code = signJWT({
  sub: userId,
  cid: clientId,
  scp: scopes,
  chl: codeChallenge,       // Store challenge
  chm: 'S256',              // Store method
  exp: Date.now() + 600000  // 10min
});

// 5. Client sends verifier during token exchange
POST /token
grant_type=authorization_code&code={code}&code_verifier={codeVerifier}

// 6. Server verifies challenge matches verifier
const record = verifyJWT(code);
const computedChallenge = crypto.createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

if (computedChallenge !== record.chl) {
  throw new OAuthError(400, 'invalid_grant', 'PKCE verification failed');
}
```

**Code Reference:** [src/auth/tokens.ts:redeemAuthorizationCode()](../src/auth/tokens.ts) - PKCE verification

---

## Storage Schema

### Cloudflare KV Namespaces

**Binding:** `OAUTH_STATE_KV`, `OAUTH_CLIENTS_KV`, `CREDENTIALS_KV`

#### 1. OAuth State (Short-lived)

**Key:** `oauth_state:{state}`
**TTL:** 10 minutes
**Purpose:** Prevent CSRF attacks during OAuth flow

```json
{
  "state": "random_state_token_xyz",
  "createdAt": 1729123456789
}
```

#### 2. OAuth Clients (Permanent)

**Key:** `oauth_clients:{clientId}`
**TTL:** None
**Purpose:** Store registered OAuth client configurations

```json
{
  "clientId": "sleep-cli",
  "clientSecret": null,  // Public client (no secret)
  "redirectUris": ["http://localhost:6274/oauth/callback"],
  "scopes": ["sleep.read_device", "sleep.read_trends", "sleep.write_temperature"],
  "isPublic": true
}
```

#### 3. Pending Credentials (Short-lived)

**Key:** `pending:{authorizationCode}`
**TTL:** 5 minutes
**Purpose:** Temporary storage during OAuth code→token exchange

```json
{
  "providerId": "sleep",
  "data": "{\"iv\":\"rGfY3mK9pL...\",\"ciphertext\":\"hF8sK2nM4...\",\"tag\":\"mN4pL7qR...\"}",
  "expiresAt": 1729123756789
}
```

**Encrypted Payload (plaintext view):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": 1729137356789,
  "userId": "8sleep_user_123",
  "metadata": {
    "deviceId": "device_abc789",
    "firstName": "John"
  }
}
```

#### 4. Grant Records (Long-lived)

**Key:** `cred:{subject}::{clientId}`
**TTL:** None (revoked manually)
**Purpose:** Persist encrypted Eight Sleep props plus refresh-token hashes

```json
{
  "providerId": "sleep",
  "encryptedProps": "{\"iv\":\"xK3mN7pQ...\",\"ciphertext\":\"nL5sM9qR...\",\"tag\":\"pO6tN8...\"}",
  "refreshTokenHash": "5c2f4c3d8d72...",
  "previousRefreshTokenHash": "d0e4a7c9f4b1..."
}
```

**Encrypted Props (plaintext view):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": 1729137356789,
  "userId": "8sleep_user_123",
  "metadata": {
    "deviceId": "device_abc789",
    "firstName": "John"
  }
}
```

---

## Key Security Components

### 1. Subject Identity

**Definition:** Unique identifier for each user, derived from Eight Sleep user ID

**Generation:**
```typescript
const subject = credentials.userId && credentials.userId.length > 0
  ? credentials.userId
  : randomToken(16);
// → "8sleep_user_123" (from Eight Sleep API)
```

**Usage:**
- Stored in JWT claims (`sub`)
- Used as KV key: `cred:{subject}::{clientId}`
- Extracted on every MCP request to lookup credentials

### 2. Encryption Key Management

**Storage:** Cloudflare Worker secret (base64-encoded)

```bash
# Set via wrangler:
npx wrangler secret put AUTH_ENCRYPTION_KEY
# Input: base64-encoded 32-byte key
# Example: openssl rand -base64 32
```

**Initialization:**
```typescript
// worker.ts (Worker entry)
process.env.AUTH_ENCRYPTION_KEY = env.AUTH_ENCRYPTION_KEY;

// credentialStorage.ts (Module init)
const raw = process.env.AUTH_ENCRYPTION_KEY;
if (!raw) {
  throw new Error('AUTH_ENCRYPTION_KEY must be set');
}
masterEncryptionKey = Buffer.from(raw, 'base64');  // Decode to 32 bytes (master secret)
```

**Code Reference:** `src/auth/credentialStorage.ts` – `initializeCredentialStorage()`

### 3. JWT Signing

**Algorithm:** HMAC-SHA256
**Secret:** `AUTH_JWT_SECRET` (stored in Cloudflare secret)

**Access Token Structure:**
```json
{
  "sub": "8sleep_user_123",     // Subject (user ID)
  "cid": "sleep-cli",           // Client ID
  "scp": ["sleep.read_device"], // Scopes
  "iat": 1729123456,            // Issued at
  "exp": 1729127056             // Expires at (1 hour)
}
```

**Refresh Token Structure:**
```json
{
  "sub": "8sleep_user_123",     // Subject (user ID)
  "cid": "sleep-cli",           // Client ID
  "typ": "refresh",             // Token type
  "iat": 1729123456             // Issued at (no expiry)
}
```

### 4. CSRF Protection

**Mechanism:** Random 24-byte token with 10-minute TTL

```typescript
// Generate CSRF token
const token = crypto.randomBytes(24).toString('hex');
csrfTokens.set(token, Date.now() + 600000);  // 10min expiry

// Validate CSRF token
const expiresAt = csrfTokens.get(token);
if (!expiresAt || expiresAt <= Date.now()) {
  return false;  // Expired or invalid
}
csrfTokens.delete(token);  // Single-use
return true;
```

**Code Reference:** [src/auth/http.ts:101-128](../src/auth/http.ts#L101-L128)

---

## Known Issues & Future Improvements

### Current Limitations

1. **Per-refresh key wrapping**
   - **Risk:** Refresh token compromise still exposes grant encryption key
   - **Mitigation:** Planned - Wrap the per-grant key with token-specific secrets (aligned with Cloudflare provider)
   - **Ref:** [docs/specs/mcp-refresh-rotation-plan.md](./specs/mcp-refresh-rotation-plan.md)

2. **Refresh retry logic integration**
   - **Risk:** Hashes are stored, but we still need to accept/rotate previous hashes during refresh exchange
   - **Mitigation:** Implement full rotation logic described in the refresh plan
   - **Ref:** [docs/specs/mcp-refresh-rotation-plan.md](./specs/mcp-refresh-rotation-plan.md)

3. **No Scope Enforcement**
   - **Risk:** Authenticated users can call ANY tool regardless of granted scopes
   - **Mitigation:** Planned - Add scope checks in tool handlers
   - **Ref:** [docs/security-hardening-plan.md](./security-hardening-plan.md)

### Future Migration Path

When the MCP SDK supports Worker-native Streamable HTTP transport:
- Migrate to `@cloudflare/workers-oauth-provider`
- Adopt provider-managed key wrapping and dual refresh token rotation
- Delete ~2000 lines of custom OAuth code

**Ref:** [docs/cloudflare-oauth-provider-analysis.md](./cloudflare-oauth-provider-analysis.md)

---

## References

- [OAuth 2.1 Specification](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-11)
- [RFC 7636 - PKCE](https://datatracker.ietf.org/doc/html/rfc7636)
- [MCP Authorization Spec](https://spec.modelcontextprotocol.io/specification/draft/basic/authorization/)
- [Cloudflare Workers OAuth Provider](https://github.com/cloudflare/workers-oauth-provider)
- [Eight Sleep API Documentation](https://8sleep.com) (unofficial)
- [Sleep MCP Refresh Rotation Plan](./specs/mcp-refresh-rotation-plan.md)

---

**Last Updated:** 2025-10-17
**Maintained By:** Sleep MCP Server Team
**Codebase:** https://github.com/yourusername/sleep-mcp-server
