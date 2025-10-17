# Sleep MCP Server – Refresh Token Rotation Plan

## Goal

Align the Sleep MCP server refresh-token handling with the rotation scheme used by Cloudflare’s official Workers OAuth provider so that a refresh attempt can be retried safely and compromised tokens can be revoked by hash. Today we refresh the Eight Sleep tokens and persist the updated bundle, but we do not keep track of the prior refresh token or wrap/unwrap per-rotation keys.

## Current State

- Credential storage now uses per-grant derived AES keys and separates grant data (`encryptedProps`, current refresh-token hash, `previousRefreshTokenHash`).
- The OAuth refresh token grant calls `SleepAuthProvider.refreshCredentials`, which refreshes the Eight Sleep token if close to expiry and persists the updated bundle.
- MCP refresh tokens (our JWTs) are rotated each time `refreshAccessToken` succeeds.
- We do **not** track the “previous” refresh-token hash or per-rotation encryption keys as Cloudflare’s provider does—the grant record only stores the current hash and leaves the previous hash blank if a refresh has not occurred since migration.

## Desired Behaviour

When the client exchanges an MCP refresh token:

1. Validate the refresh token and resolve the grant (already done via `refreshAccessToken` and KV).
2. If the stored grant record has `previousRefreshTokenHash`, it indicates the client may be retrying with the old token. Recognise it, remove or update the grant accordingly, and avoid locking out the caller if the new token hasn’t been persisted yet.
3. After refreshing the upstream (Eight Sleep) token, persist **both** the new hash and the prior hash so the next refresh attempt can recognise an in-flight retry.
4. Optionally emit a new MCP refresh token that is bound to the wrapped key for the new refresh token, enabling revocation by invalidating hash entries.

This mirrors Cloudflare’s provider flow:

```mermaid
sequenceDiagram
    participant C as MCP Client
    participant M as Sleep MCP Worker
    participant E as Eight Sleep API

    C->>M: Refresh token grant (with MCP refresh token)
    M->>M: Lookup grant record by hash
    alt grant has previous hash match
        M->>M: Treat as retry; keep record, return access token
    end
    M->>E: Refresh Eight Sleep token (using stored refresh token)
    E->>M: New Eight Sleep token bundle
    M->>M: Store hashed refreshToken + previous hash (old hash)
    M->>C: Respond with new access token + new MCP refresh token
```

## Implementation Plan

1. **Augment grant record shape**
   - Already stores `refreshTokenHash` and `previousRefreshTokenHash`. Ensure migration path sets `previous` when updating the first time.
   - Add helper to compare incoming MCP refresh token hash against `refreshTokenHash` and `previousRefreshTokenHash`.

2. **Update `refreshAccessToken` flow**
   - After `refreshAccessToken` verifies and returns the new JWT payload, fetch the current grant record.
   - If the supplied MCP refresh token matches the `previousRefreshTokenHash`, treat as a retry: do not attempt to refresh the upstream token again, simply return the cached props and re-issue tokens.
   - Once Eight Sleep token rotation succeeds, hash the new refresh token and assign:
     - `previousRefreshTokenHash = current.refreshTokenHash`
     - `refreshTokenHash = newHash`
     - Persist the updated grant record before issuing the MCP response.

3. **Handle retries gracefully**
   - Ensure that if the refresh flow fails after persisting `previousRefreshTokenHash`, the next attempt with the old token can still succeed (mirrors Cloudflare provider logic).
   - Optionally include a short-lived grace window where both hashes are accepted.

4. **Testing**
   - Unit tests for the grant storage helper to confirm hash transitions.
   - Tests for refresh flow: first refresh stores new hash, subsequent refresh with new token uses it; retry with old token only works once.

5. **Future alignment**
   - When the Workers OAuth provider supports Streamable HTTP, this code path can be replaced by their `tokenExchangeCallback`, which handles the same responsibilities.

## Non-Goals

- Implementing per-refresh key wrapping (beyond the per-grant derived key introduced earlier). This can wait until we move to the official provider.
- Changing Eight Sleep token storage to use minimal props; we already persist only the bundle necessary for refresh.

