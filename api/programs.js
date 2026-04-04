/**
 * GET /api/programs
 *
 * Serves the Skeddo program catalog from behind an API endpoint.
 *   - CORS-restricted to skeddo.ca
 *   - IP-based sliding-window rate limit (60 req / 60 s)
 *   - Cache-Control keeps most traffic on the CDN edge (24 h)
 *
 * NOTE: The rate limiter is in-memory per serverless instance. Under
 * normal load the CDN absorbs >99% of traffic so a single instance
 * handles the remainder. For true multi-instance protection swap the
 * Map for Upstash Redis (KV).
 *
 * Optional query params (combinable):
 *   ?category=Sports
 *   ?ageMin=5&ageMax=12
 *   ?neighbourhood=Kitsilano
 *   ?enrollmentStatus=Open
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

/* ─── Sliding-window rate limiter ─── */
// ip -> sorted array of request timestamps (ms)
const _rl = new Map();
const RL_WINDOW_MS = 60_000; // 1 minute
const RL_MAX      = 60;      // requests per window per IP

/**
 * Returns { allowed: bool, remaining: int, resetMs: int }
 * Mutates _rl in place.
 */
function checkRateLimit(ip) {
  const now       = Date.now();
  const cutoff    = now - RL_WINDOW_MS;
  const prev      = (_rl.get(ip) || []).filter((t) => t > cutoff);

  if (prev.length >= RL_MAX) {
    // Oldest timestamp in the window tells us when a slot frees up.
    const resetMs = prev[0] + RL_WINDOW_MS;
    return { allowed: false, remaining: 0, resetMs };
  }

  prev.push(now);
  _rl.set(ip, prev);

  // Prune map when it grows large (each entry is tiny but unbounded growth
  // would be a problem on a long-lived warm instance).
  if (_rl.size > 5_000) {
    for (const [key, ts] of _rl) {
      if (!ts.some((t) => t > cutoff)) _rl.delete(key);
    }
  }

  return { allowed: true, remaining: RL_MAX - prev.length, resetMs: now + RL_WINDOW_MS };
}

/* ─── Handler ─── */
export default function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Prefer the left-most IP in x-forwarded-for (set by Vercel's proxy).
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  const { allowed, remaining, resetMs } = checkRateLimit(ip);

  res.setHeader("X-RateLimit-Limit",     String(RL_MAX));
  res.setHeader("X-RateLimit-Remaining", String(remaining));
  res.setHeader("X-RateLimit-Reset",     String(Math.ceil(resetMs / 1000)));

  if (!allowed) {
    res.setHeader("Retry-After", String(Math.ceil((resetMs - Date.now()) / 1000)));
    return res.status(429).json({ error: "Too many requests — please slow down." });
  }

  const programs = getPrograms();

  // Optional server-side filtering to reduce response payload.
  const { category, ageMin, ageMax, neighbourhood, enrollmentStatus } = req.query || {};
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

  // CDN caches for 24 h; browsers for 5 min.
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=86400, stale-while-revalidate=3600");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  return res.status(200).json(results);
}
