# Security Hardening Plan

**Goal:** Align with Cloudflare OAuth Provider security model without breaking Streamable HTTP transport

**Timeline:** 1-2 days
**Status:** Planning

---

## Phase 1: Per-Grant Key Derivation (Priority 1)

### Current Risk
- Single `AUTH_ENCRYPTION_KEY` encrypts ALL user credentials
- If key leaks → complete breach of all users

### Solution: HKDF-based Per-Grant Keys

```typescript
// auth/credentialStorage.ts

import crypto from 'node:crypto';

/**
 * Derive a unique encryption key for each grant using HKDF
 * @param subject - User identifier (from Eight Sleep userId)
 * @param clientId - OAuth client ID
 * @param globalSecret - AUTH_ENCRYPTION_KEY (base64)
 * @returns 32-byte AES-256 key
 */
function deriveGrantKey(subject: string, clientId: string, globalSecret: Buffer): Buffer {
  const info = `sleep-mcp-grant:${subject}:${clientId}`;

  return crypto.hkdfSync(
    'sha256',           // hash algorithm
    globalSecret,       // input key material
    '',                 // salt (empty for deterministic derivation)
    info,               // context info
    32                  // output length (256 bits for AES-256)
  );
}

/**
 * Encrypt credential payload with per-grant key
 */
function encryptWithGrantKey(
  payload: CredentialPayload,
  subject: string,
  clientId: string
): string {
  const globalSecret = ensureEncryptionKey();
  const grantKey = deriveGrantKey(subject, clientId, globalSecret);

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', grantKey, iv);
  const serialized = Buffer.from(JSON.stringify(payload), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(serialized), cipher.final()]);
  const tag = cipher.getAuthTag();

  return serialize({ iv, ciphertext, tag });
}

/**
 * Decrypt credential payload with per-grant key
 */
function decryptWithGrantKey(
  data: string,
  subject: string,
  clientId: string
): CredentialPayload {
  const globalSecret = ensureEncryptionKey();
  const grantKey = deriveGrantKey(subject, clientId, globalSecret);

  const { iv, ciphertext, tag } = deserialize(data);
  const decipher = crypto.createDecipheriv('aes-256-gcm', grantKey, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

  return JSON.parse(decrypted.toString('utf8')) as CredentialPayload;
}
```

### Changes Required
1. Update `persistCredentials()` to use `encryptWithGrantKey()`
2. Update `getPersistedCredentials()` to use `decryptWithGrantKey()`
3. Pass `subject` and `clientId` through the call chain

### Migration Strategy
- Keys are derived deterministically - no migration needed
- Old credentials encrypted with global key will fail to decrypt
- Users will need to re-authenticate (one-time disruption)
- Alternative: Dual-read (try per-grant key, fallback to global) for transition period

**Effort:** 3-4 hours
**Risk Reduction:** ⭐⭐⭐⭐⭐ (Critical - eliminates single point of failure)

---

## Phase 2: Structured Storage Keys (Priority 2)

### Current Schema
```
cred:{subject}::{clientId} → encrypted blob
```

### New Schema (Aligned with Cloudflare)
```
grant:{subject}:{clientId} → {
  providerId: "sleep",
  encryptedProps: "...",        // Per-grant key
  refreshTokenHash: "sha256...", // SHA-256 of refresh token
  previousRefreshTokenHash: "sha256...", // For retry safety
  createdAt: 1729123456,
  metadata: { deviceId: "..." }
}
```

### Benefits
1. **Efficient revocation**: Delete all grants for a user with prefix scan
2. **Audit trail**: Track when grants were created
3. **Retry safety**: Store previous refresh token hash
4. **Metadata visibility**: deviceId not encrypted (for admin UI)

### Implementation

```typescript
// auth/credentialStorage.ts

interface GrantRecord {
  providerId: string;
  encryptedProps: string;           // AES-GCM encrypted with per-grant key
  refreshTokenHash: string;         // SHA-256(refreshToken)
  previousRefreshTokenHash?: string; // For retry safety
  createdAt: number;
  metadata?: {
    deviceId?: string;
    firstName?: string;
  };
}

async function persistCredentials(
  subject: string,
  clientId: string,
  providerId: string,
  payload: CredentialPayload
): Promise<void> {
  const refreshTokenHash = hashToken(payload.refreshToken);

  // Check if grant exists to preserve previous refresh token
  const existingGrant = await storageBackend.getCredential(grantKey(subject, clientId));
  let previousRefreshTokenHash: string | undefined;

  if (existingGrant) {
    const existing = JSON.parse(existingGrant.data) as GrantRecord;
    // Store current refresh token as "previous" for retry safety
    previousRefreshTokenHash = existing.refreshTokenHash;
  }

  const grantRecord: GrantRecord = {
    providerId,
    encryptedProps: encryptWithGrantKey({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      expiresAt: payload.expiresAt,
      userId: payload.userId,
    }, subject, clientId),
    refreshTokenHash,
    previousRefreshTokenHash,
    createdAt: Date.now(),
    metadata: payload.metadata,
  };

  await storageBackend.persistCredential(
    grantKey(subject, clientId),
    {
      providerId,
      data: JSON.stringify(grantRecord),
    }
  );
}

function grantKey(subject: string, clientId: string): string {
  return `grant:${subject}:${clientId}`;
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
```

**Effort:** 4-5 hours
**Risk Reduction:** ⭐⭐⭐ (Medium - improves operational security)

---

## Phase 3: Minimal Props Storage (Priority 3)

### Current Approach
Store entire `CredentialPayload`:
```typescript
{
  accessToken: "...",      // 500+ chars
  refreshToken: "...",     // 500+ chars
  expiresAt: 1729123456,
  userId: "...",
  metadata: { deviceId: "..." }
}
```

### Optimized Approach
Store ONLY refresh token + metadata:
```typescript
{
  refreshToken: "...",     // Required for token refresh
  userId: "...",           // Required for Sleep API
  metadata: { deviceId: "..." } // Required for device control
}
```

Generate access tokens on-demand:
```typescript
async function getSleepClient(subject: string, clientId: string): Promise<SleepClient> {
  const grant = await getPersistedCredentials(subject, clientId);

  // Always create fresh client (will refresh token if needed)
  const client = new SleepClient({
    refreshToken: grant.credentials.refreshToken,
    userId: grant.credentials.userId,
    metadata: grant.credentials.metadata,
    // No accessToken - client will fetch on first use
  });

  // Client automatically refreshes if needed
  await client.ensureValidToken();

  return client;
}
```

### Benefits
1. Smaller KV storage (50% reduction)
2. No stale access tokens
3. Automatic refresh on every request (with timeout protection)

**Effort:** 2-3 hours
**Risk Reduction:** ⭐⭐ (Low - operational improvement)

---

## Phase 4: Scope Enforcement (Priority 4)

### Current State
Scopes defined but never checked:
```typescript
// sleepProvider.ts
readonly defaultScopes = [
  'sleep.read_device',
  'sleep.read_trends',
  'sleep.write_temperature',
  'sleep.prompts.analyze',
];
```

### Implementation

```typescript
// server.ts

function ensureScope(required: string, extra: any): void {
  const scopes = extra.authInfo?.scopes || [];
  if (!scopes.includes(required)) {
    const error = new Error(`Scope required: ${required}`);
    (error as Error & { code?: number }).code = -32602;
    throw error;
  }
}

server.setRequestHandler(CallToolRequestSchema, async ({ params }, extra) => {
  const { name, arguments: rawArgs = {} } = params;

  switch (name) {
    case 'set_temperature': {
      ensureScope('sleep.write_temperature', extra);
      return await withSleepClient(extra, async ({ client }) => {
        // ... existing code
      });
    }

    case 'get_sleep_trends': {
      ensureScope('sleep.read_trends', extra);
      return await withSleepClient(extra, async ({ client }) => {
        // ... existing code
      });
    }

    case 'get_device_status': {
      ensureScope('sleep.read_device', extra);
      return await withSleepClient(extra, async ({ client }) => {
        // ... existing code
      });
    }
  }
});
```

**Effort:** 1-2 hours
**Risk Reduction:** ⭐⭐⭐⭐ (High - security best practice)

---

## Phase 5: Token Refresh Timing (Priority 5)

### Current Approach
Refresh happens inside tool handlers:
```typescript
const result = await handler({ client, deviceId, credentials, subject, clientId });

// Check if tokens were refreshed
const updatedTokens = client.getTokenBundle();
if (updatedTokens.accessToken !== credentials.accessToken) {
  await persistCredentials(...);
}
```

### Better Approach
Refresh before request enters MCP layer:
```typescript
// worker.ts - in MCP request handler

if (url.pathname.startsWith('/mcp')) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader.slice('Bearer '.length);
  const verified = verifyAccessToken(config, token);

  // PRE-FLIGHT: Ensure Sleep tokens are fresh
  const credentials = await getProviderCredentials(verified.subject, verified.clientId);
  if (credentials && credentials.expiresAt < Date.now() + 60000) { // 1min buffer
    const client = new SleepClient(credentials);
    await client.refreshToken();
    const newTokens = client.getTokenBundle();

    // Persist immediately, before MCP request
    await persistCredentials(verified.subject, verified.clientId, 'sleep', {
      ...credentials,
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      expiresAt: newTokens.expiresAt,
    });
  }

  // Now process MCP request with fresh tokens
  await transport.handleRequest(nodeReq as any, nodeRes);
}
```

**Effort:** 2-3 hours
**Risk Reduction:** ⭐⭐ (Low - operational improvement)

---

## Migration Path to Official Provider (Future)

When conditions are met:
1. ✅ MCP SDK supports Worker-native Streamable HTTP transport
2. ✅ `@cloudflare/workers-oauth-provider` supports Streamable HTTP
3. ✅ We've aligned our storage schema with theirs

### Migration Steps
1. Install `@cloudflare/workers-oauth-provider`
2. Implement `tokenExchangeCallback` for Eight Sleep auth
3. Map our `grant:{subject}:{clientId}` storage to their schema
4. Delete `auth/http.ts`, `auth/tokens.ts`, `auth/store.ts`
5. Keep `SleepAuthProvider` and `SleepClient` (domain logic)
6. Update `worker.ts` to use `OAuthProvider` wrapper

---

## Summary

| Phase | Effort | Risk Reduction | Status |
|-------|--------|----------------|--------|
| 1. Per-Grant Keys | 3-4h | ⭐⭐⭐⭐⭐ | 🔴 Critical |
| 2. Structured Storage | 4-5h | ⭐⭐⭐ | 🟡 Important |
| 3. Minimal Props | 2-3h | ⭐⭐ | 🟢 Nice-to-have |
| 4. Scope Enforcement | 1-2h | ⭐⭐⭐⭐ | 🔴 Critical |
| 5. Token Refresh Timing | 2-3h | ⭐⭐ | 🟢 Nice-to-have |

**Total Effort:** 1-2 days
**Total Risk Reduction:** Massive security improvement while preserving Streamable HTTP

---

## Next Steps

1. ✅ Review this plan
2. ⬜ Implement Phase 1 (Per-Grant Keys) - **START HERE**
3. ⬜ Implement Phase 4 (Scope Enforcement) - **QUICK WIN**
4. ⬜ Test end-to-end with OAuth flow
5. ⬜ Deploy to dev environment
6. ⬜ Monitor for credential decryption failures
7. ⬜ Implement Phases 2, 3, 5 as time permits
