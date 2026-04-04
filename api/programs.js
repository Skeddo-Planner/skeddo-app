/**
 * GET /api/programs
 *
 * Serves the Skeddo program catalog.
 *   - CORS-restricted to skeddo.ca
 *   - Sliding-window rate limit via Upstash Redis (60 req / 60 s per IP,
 *     shared across ALL serverless instances — no more per-instance bypass)
 *   - Falls back to an in-memory limiter if UPSTASH_REDIS_REST_URL is not set
 *   - Cache-Control keeps most traffic on the CDN edge (24 h)
 *   - description field stripped by default (~20% payload savings);
 *     use GET /api/programs/:id for the full record with description
 *
 * Upstash setup (one-time):
 *   1. Create a free Redis database at https://console.upstash.com
 *   2. Copy REST URL + token → add to Vercel env vars:
 *        UPSTASH_REDIS_REST_URL   (e.g. https://xxx.upstash.io)
 *        UPSTASH_REDIS_REST_TOKEN (e.g. AXxx...)
 *
 * Optional query params (combinable):
 *   ?category=Sports
 *   ?ageMin=5&ageMax=12
 *   ?neighbourhood=Kitsilano
 *   ?enrollmentStatus=Open
 *   ?page=1&limit=1000     paginate results → returns {data,total,page,totalPages}
 *   ?full=true             include description in list results
 */

import { createRequire } from "module";
import { handleCors } from "./_helpers.js";

const require = createRequire(import.meta.url);

/* ─── Program data cache ─── */
let _programs = null;
function getPrograms() {
  if (!_programs) _programs = require("../src/data/programs.json");
  return _programs;
}

// Fields stripped from list responses to reduce payload (~20% savings).
// Full records are available via GET /api/programs/:id.
const LIST_STRIP_FIELDS = new Set(["description"]);

function toListRecord(p) {
  const out = {};
  for (const key of Object.keys(p)) {
    if (!LIST_STRIP_FIELDS.has(key)) out[key] = p[key];
  }
  return out;
}

/* ══════════════════════════════════════════════════════════
   RATE LIMITING
   Primary:  Upstash Redis  (shared across all instances)
   Fallback: In-memory Map  (per-instance, used when Redis
             is not configured or temporarily unreachable)
   ══════════════════════════════════════════════════════════ */

const RL_WINDOW_MS = 60_000; // 1 minute
const RL_MAX       = 60;     // requests per window per IP

/* ── Upstash Redis sliding-window limiter ── */

const _upstashUrl   = process.env.UPSTASH_REDIS_REST_URL;
const _upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * Sliding-window rate check via Upstash Redis pipeline.
 * Uses a sorted set keyed by IP; members are timestamped to allow range pruning.
 * Returns { allowed, remaining, resetMs }.
 *
 * Throws on network/auth errors so the caller can fall back to in-memory.
 */
async function checkRateLimitRedis(ip) {
  const key = `skeddo:rl:programs:${ip}`;
  const now = Date.now();
  const cutoff = now - RL_WINDOW_MS;

  // Atomic pipeline: prune old entries, record this request, count, set TTL.
  // Member value is "<timestamp>-<rand>" to ensure uniqueness when two requests
  // arrive in the same millisecond.
  const pipeline = [
    ["ZREMRANGEBYSCORE", key, "-inf", String(cutoff)],
    ["ZADD",            key, String(now), `${now}-${Math.random().toString(36).slice(2)}`],
    ["ZCARD",           key],
    ["PEXPIRE",         key, String(RL_WINDOW_MS * 2)],
  ];

  const res = await fetch(`${_upstashUrl}/pipeline`, {
    method:  "POST",
    headers: {
      Authorization:  `Bearer ${_upstashToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pipeline),
  });

  if (!res.ok) throw new Error(`Upstash HTTP ${res.status}`);

  const results = await res.json();
  // results[2] is the ZCARD response: { result: <count> }
  const count = results[2]?.result ?? RL_MAX + 1;

  return {
    allowed:   count <= RL_MAX,
    remaining: Math.max(0, RL_MAX - count),
    resetMs:   now + RL_WINDOW_MS,
  };
}

/* ── In-memory fallback (per-instance, used when Redis is unavailable) ── */

const _rl = new Map(); // ip -> sorted array of request timestamps (ms)

function checkRateLimitMemory(ip) {
  const now    = Date.now();
  const cutoff = now - RL_WINDOW_MS;
  const prev   = (_rl.get(ip) || []).filter((t) => t > cutoff);

  if (prev.length >= RL_MAX) {
    const resetMs = prev[0] + RL_WINDOW_MS;
    return { allowed: false, remaining: 0, resetMs };
  }

  prev.push(now);
  _rl.set(ip, prev);

  // Prune stale entries to prevent unbounded memory growth on warm instances.
  if (_rl.size > 5_000) {
    for (const [k, ts] of _rl) {
      if (!ts.some((t) => t > cutoff)) _rl.delete(k);
    }
  }

  return { allowed: true, remaining: RL_MAX - prev.length, resetMs: now + RL_WINDOW_MS };
}

/**
 * Unified rate-limit entry point.
 * Tries Redis first; falls back to in-memory on error or if not configured.
 */
async function checkRateLimit(ip) {
  if (_upstashUrl && _upstashToken) {
    try {
      return await checkRateLimitRedis(ip);
    } catch (err) {
      // Redis is unreachable — degrade gracefully rather than blocking users.
      console.error("[programs] Upstash fallback:", err.message);
    }
  }
  return checkRateLimitMemory(ip);
}

/* ─── Handler ─── */
export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Prefer the left-most IP in x-forwarded-for (set by Vercel's proxy).
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  const { allowed, remaining, resetMs } = await checkRateLimit(ip);

  res.setHeader("X-RateLimit-Limit",     String(RL_MAX));
  res.setHeader("X-RateLimit-Remaining", String(remaining));
  res.setHeader("X-RateLimit-Reset",     String(Math.ceil(resetMs / 1000)));

  if (!allowed) {
    res.setHeader("Retry-After", String(Math.ceil((resetMs - Date.now()) / 1000)));
    return res.status(429).json({ error: "Too many requests — please slow down." });
  }

  const programs = getPrograms();
  const query = req.query || {};

  // Optional server-side filtering to reduce response payload.
  const { category, ageMin, ageMax, neighbourhood, enrollmentStatus, full } = query;
  let results = programs;

  if (category) {
    const cat = category.toLowerCase();
    results = results.filter((p) => (p.category || "").toLowerCase() === cat);
  }
  if (neighbourhood) {
    const nb = neighbourhood.toLowerCase();
    results = results.filter((p) => (p.neighbourhood || "").toLowerCase().includes(nb));
  }
  if (enrollmentStatus) {
    const es = enrollmentStatus.toLowerCase();
    results = results.filter((p) => (p.enrollmentStatus || "").toLowerCase() === es);
  }
  if (ageMin !== undefined) {
    const min = Number(ageMin);
    results = results.filter((p) => p.ageMax == null || p.ageMax >= min);
  }
  if (ageMax !== undefined) {
    const max = Number(ageMax);
    results = results.filter((p) => p.ageMin == null || p.ageMin <= max);
  }

  // Strip description from list results unless ?full=true is requested.
  // Full records are available via GET /api/programs/:id.
  const includeDescription = full === "true";
  if (!includeDescription) {
    results = results.map(toListRecord);
  }

  // Pagination: ?page=1&limit=1000 returns {data, total, page, totalPages}.
  // Without pagination params, returns the array directly (backwards compat).
  const pageParam  = query.page  !== undefined ? parseInt(query.page,  10) : null;
  const limitParam = query.limit !== undefined ? parseInt(query.limit, 10) : null;

  // CDN caches for 24 h; browsers for 5 min; stale-while-revalidate covers
  // the brief window after a deploy before the CDN warms up again.
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=86400, stale-while-revalidate=86400");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (pageParam !== null && limitParam !== null && !isNaN(pageParam) && !isNaN(limitParam)) {
    const total      = results.length;
    const totalPages = Math.ceil(total / limitParam);
    const page       = Math.max(1, Math.min(pageParam, totalPages || 1));
    const start      = (page - 1) * limitParam;
    const data       = results.slice(start, start + limitParam);
    return res.status(200).json({ data, total, page, totalPages });
  }

  return res.status(200).json(results);
}
