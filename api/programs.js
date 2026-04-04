/**
 * GET /api/programs
 *
 * Serves the Skeddo program catalog from behind an API endpoint rather than
 * exposing it as a static asset or bundled JS chunk. Benefits:
 *   - CORS-restricted to skeddo.ca (blocks naive cross-origin scraping)
 *   - Strong CDN cache headers (86400s) reduce cold-start cost to once per day
 *   - Central choke point to add auth/rate-limiting in future
 *
 * Optional query params (all combinable):
 *   ?category=Sports
 *   ?ageMin=5&ageMax=12
 *   ?neighbourhood=Kitsilano
 *   ?enrollmentStatus=Open
 *
 * Response: JSON array of program objects (filtered subset if params supplied).
 */

import { createRequire } from "module";
import { handleCors } from "./_helpers.js";

const require = createRequire(import.meta.url);

// Cache parsed JSON in module scope — survives warm Vercel invocations.
let _programs = null;
function getPrograms() {
  if (!_programs) {
    _programs = require("../src/data/programs.json");
  }
  return _programs;
}

export default function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const programs = getPrograms();

  // Optional lightweight server-side filtering to reduce payload size.
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

  // Cache: browsers 5 min, CDN 24 h.  stale-while-revalidate lets CDN serve
  // a cached copy while refreshing in the background.
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=86400, stale-while-revalidate=3600");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  return res.status(200).json(results);
}
