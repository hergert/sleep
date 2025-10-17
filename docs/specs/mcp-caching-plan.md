# MCP Caching Plan

## Goals
- Reduce redundant calls to the Eight Sleep APIs while keeping user data fresh.
- Hide API latency from MCP clients without introducing stale or inconsistent results.
- Preserve security: no sensitive material should be logged or cached longer than necessary.

## Cache Layers

### 1. In-memory (per-isolate) Cache via Cache API
- **Scope:** Short-lived data (< 1 minute) such as `get_device_status` responses.
- **Mechanism:** Use `caches.default` with composite keys: `sleep::${subject}::device-status`.
- **Expiry:** `Cache-Control: s-maxage=30`.
- **Invalidation:** Natural expiry; bypass cache if tool call specifies `force: true`.

### 2. Edge KV Cache for Overnight Data
- **Scope:** Sleep trends, nightly summaries, interval blobs.
- **Key format:** `sleep:trends:${subject}:${from}:${to}:${tz}` and `sleep:day:${subject}:${date}`.
- **Write policy:**
  1. On tool/resource request, read KV first.
  2. Fetch missing data from API, then write to KV with TTL 30 min.
  3. For range queries, break into per-day slices to maximise reuse.
- **Consistency:** Data is append-only after a night completes, so TTL-based invalidation is acceptable.

### 3. Durable Object (optional, stretch goal)
- **Use when:** We need request coalescing or real-time cache metrics.
- **Responsibilities:**
  - Serialize refreshes so multiple workers do not stampede the API.
  - Maintain hit/miss counters for observability.
  - Provide explicit invalidation endpoint (`/cache/invalidate?user=...`).

## Cache Keys & Payload Hygiene
- Include `subject` (Sleep account) and request arguments (`from`, `to`, `timezone`).
- Never include bearer tokens or secrets.
- Store payloads encrypted using existing AES helpers (`auth/store.ts`) before writing to KV/DO.
- Add version suffix (`v1`) so schema changes do not break existing entries.

## Tool & Resource Integration

### get_device_status
- Try Cache API first (`s-maxage=30`).
- On miss, fetch from API, store, return result.
- Accept optional `refresh: true` argument to bypass cache.

### get_sleep_trends / sleep://sleep/* resources
- Resolve to helper `fetchTrendsWithCache(subject, from, to, tz)`.
- Helper checks KV, fetches missing days, persists slices, merges result.
- Return aggregated response plus cache metadata in `structuredContent._cache` (e.g., `hit: true`).

### get_sleep_intervals
- Similar to trends but respect pagination: cache by `(subject, nextCursor)`.
- Limit stored blobs (e.g., first 50 intervals) to control storage cost.

## Edge Headers & Annotations
- When returning cached data, set `Cache-Control` headers for downstream clients (`max-age=60` for device status, `max-age=900` for trends).
- Update MCP resource annotations with `lastModified` using API timestamps so hosts can prioritise context.

## Observability
- Log cache hits/misses at `debug` level using a consistent prefix (`[cache]`).
- Instrument Durable Object (if adopted) with counters and expose via `/health`.
- Add metrics to wrangler tail filters for quick inspection.

## Roll-out Steps
1. Implement Cache API wrapper utility in `src/cache.ts` (short TTL layer).
2. Introduce KV-backed helper for trends/intervals; wire into client/server.
3. Add optional `refresh` argument to relevant tools.
4. Update docs + tests to cover cache behaviour.
5. Monitor API call volume and adjust TTLs.

## Risks & Mitigations
- **Stale data:** Use conservative TTLs and allow manual refresh.
- **Sensitive data at rest:** Encrypt KV payloads, limit TTL, avoid logging raw JSON.
- **Storage costs:** Store per-day slices; prune large interval blobs beyond retention window (e.g., 14 days).
- **Stampede on cold start:** Optional Durable Object ensures single refresh per key.

