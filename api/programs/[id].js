/**
 * GET /api/programs/:id
 *
 * Returns the full program record including description.
 * Used by the detail modal to lazy-load description after the slim list loads.
 *
 * Cache-Control: 1 h browser / 24 h CDN — full records change infrequently.
 */

import { createRequire } from "module";
import { handleCors } from "../_helpers.js";

const require = createRequire(import.meta.url);

let _programs = null;
let _index    = null;

function getIndex() {
  if (!_index) {
    _programs = require("../../src/data/programs.json");
    _index = new Map(_programs.map((p) => [String(p.id), p]));
  }
  return _index;
}

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  const program = getIndex().get(String(id));

  if (!program) {
    return res.status(404).json({ error: "Program not found" });
  }

  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(200).json(program);
}
