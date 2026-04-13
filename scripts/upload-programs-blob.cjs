#!/usr/bin/env node
/**
 * scripts/upload-programs-blob.cjs
 *
 * Uploads TWO versions of programs.json to Vercel Blob:
 *   1. programs-slim.json  — list fields only (no description). Used as the
 *      primary CDN source (VITE_PROGRAMS_URL). ~20% smaller than full version.
 *   2. programs.json       — full record including description. The individual
 *      program detail API (/api/programs/:id) serves from this.
 *
 * Both uploads use allowOverwrite: true so URLs are stable across runs.
 * Run this script after any significant change to programs.json — the
 * post-commit hook does this automatically when programs.json is committed.
 *
 * ONE-TIME SETUP
 * ──────────────
 * 1. Vercel dashboard → Storage → Create → Blob (name: skeddo-app-blob, Public)
 * 2. Copy BLOB_READ_WRITE_TOKEN from the .env.local tab in the Blob dashboard
 * 3. Add to your local .env file:
 *        BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
 * 4. Run once: node scripts/upload-programs-blob.cjs
 * 5. Copy the printed SLIM URL and set in Vercel env vars (Production):
 *        VITE_PROGRAMS_URL=https://xxx.public.blob.vercel-storage.com/programs-slim.json
 * 6. Redeploy once for the env var to take effect.
 *
 * After that, the post-commit hook handles all future uploads automatically.
 *
 * LIST FIELDS (slim version strips these from each program):
 *   description — only needed in the detail modal, fetched lazily via
 *                 GET /api/programs/:id when a user opens a program card
 */

"use strict";

const path = require("path");
const fs   = require("fs");

// Load .env (if present) so BLOB_READ_WRITE_TOKEN is available locally
try {
  require("dotenv").config({ path: path.join(__dirname, "../.env") });
} catch {
  // dotenv is optional — token can also come from the environment directly
}

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error(
    "Error: BLOB_READ_WRITE_TOKEN is not set.\n" +
    "Add it to your .env file. See ONE-TIME SETUP at the top of this file."
  );
  process.exit(1);
}

const programsPath = path.join(__dirname, "../src/data/programs.json");
if (!fs.existsSync(programsPath)) {
  console.error("Error: src/data/programs.json not found.");
  process.exit(1);
}

// Vercel Blob requires @vercel/blob — install it if missing.
let put;
try {
  ({ put } = require("@vercel/blob"));
} catch {
  console.error(
    "Error: @vercel/blob is not installed.\n" +
    "Run: npm install --save-dev @vercel/blob"
  );
  process.exit(1);
}

// Fields stripped from the slim version (only needed in detail modal)
const SLIM_STRIP_FIELDS = new Set(["description"]);

async function main() {
  const programs = JSON.parse(fs.readFileSync(programsPath, "utf8"));
  const count = programs.length;

  // Build slim array (strip description)
  const slim = programs.map((p) => {
    const out = {};
    for (const key of Object.keys(p)) {
      if (!SLIM_STRIP_FIELDS.has(key)) out[key] = p[key];
    }
    return out;
  });

  const fullBytes = Buffer.byteLength(JSON.stringify(programs));
  const slimBytes = Buffer.byteLength(JSON.stringify(slim));
  const savingPct = (((fullBytes - slimBytes) / fullBytes) * 100).toFixed(0);

  console.log(`Programs: ${count.toLocaleString()}`);
  console.log(`Full:     ${(fullBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Slim:     ${(slimBytes / 1024 / 1024).toFixed(1)} MB  (${savingPct}% smaller — description stripped)`);
  console.log("");
  console.log("Uploading…");

  const [slimBlob, fullBlob] = await Promise.all([
    put("programs-slim.json", JSON.stringify(slim), {
      access:           "public",
      contentType:      "application/json",
      addRandomSuffix:  false,
      allowOverwrite:   true,
      token,
    }),
    put("programs.json", JSON.stringify(programs), {
      access:           "public",
      contentType:      "application/json",
      addRandomSuffix:  false,
      allowOverwrite:   true,
      token,
    }),
  ]);

  console.log("\n✓ Both blobs uploaded.");
  console.log("  Slim URL (for VITE_PROGRAMS_URL):", slimBlob.url);
  console.log("  Full URL (reference only):        ", fullBlob.url);

  const slimUrlEnv = `VITE_PROGRAMS_URL=${slimBlob.url}`;
  if (process.env.VITE_PROGRAMS_URL === slimBlob.url) {
    console.log("\n✓ VITE_PROGRAMS_URL already set to the slim blob. No Vercel env var change needed.");
  } else {
    console.log("\nIf VITE_PROGRAMS_URL is not yet set (or changed), update it in Vercel:");
    console.log(`  ${slimUrlEnv}`);
    console.log("Then redeploy once for the env var to take effect.");
  }
}

main().catch((err) => {
  console.error("Upload failed:", err.message);
  process.exit(1);
});
