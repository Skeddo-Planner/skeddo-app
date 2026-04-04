#!/usr/bin/env node
/**
 * scripts/upload-programs-blob.cjs
 *
 * Uploads programs.json to Vercel Blob storage so it can be served from a
 * stable CDN URL that is NOT purged when the Vercel app deploys.
 *
 * This decouples the data CDN cache from the code deployment cache — meaning
 * 1,000 users hitting the site right after a deploy will still get fast,
 * cached responses for the programs data even though the app CDN was purged.
 *
 * ONE-TIME SETUP
 * ──────────────
 * 1. In your Vercel project: Storage → Connect Store → Blob
 *    (Free 500 MB included on Hobby plan)
 * 2. In Vercel dashboard → Settings → Environment Variables, copy
 *    BLOB_READ_WRITE_TOKEN (Vercel adds it automatically when you link Blob)
 * 3. Add it to your local .env file:
 *        BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
 * 4. Run this script once to upload programs.json:
 *        node scripts/upload-programs-blob.cjs
 * 5. Copy the printed URL and set it in Vercel env vars:
 *        VITE_PROGRAMS_URL=https://xxx.public.blob.vercel-storage.com/programs.json
 *    (In Vercel dashboard → Settings → Environment Variables → Production)
 * 6. Re-deploy the app once so the new env var takes effect.
 *
 * ONGOING USAGE
 * ─────────────
 * Run this script whenever programs.json changes significantly (e.g. after
 * a large data update). It overwrites the same URL so no client changes needed.
 *
 * The blob URL is stable and does NOT change between runs (Vercel Blob uses
 * content-addressed storage but puts() with the same pathname return the same
 * public URL when using `allowOverwrite: true`).
 *
 * You can also wire this into CI/CD:
 *   - Run after fill-computable-fields.cjs + validate-programs.cjs
 *   - Only run when programs.json actually changed (check git diff)
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
    "See the ONE-TIME SETUP instructions at the top of this file."
  );
  process.exit(1);
}

const programsPath = path.join(__dirname, "../src/data/programs.json");
if (!fs.existsSync(programsPath)) {
  console.error("Error: src/data/programs.json not found.");
  process.exit(1);
}

const fileBytes  = fs.statSync(programsPath).size;
const fileMB     = (fileBytes / 1024 / 1024).toFixed(1);
const programCount = JSON.parse(fs.readFileSync(programsPath, "utf8")).length;

console.log(`Uploading programs.json (${fileMB} MB, ${programCount.toLocaleString()} programs)…`);

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

async function main() {
  const fileBuffer = fs.readFileSync(programsPath);

  const blob = await put("programs.json", fileBuffer, {
    access:         "public",
    contentType:    "application/json",
    allowOverwrite: true,  // same URL on each upload — no client changes needed
    token,
  });

  console.log("\n✓ Upload complete.");
  console.log("  Blob URL:", blob.url);
  console.log("\nNext step — set this in Vercel env vars (Production):");
  console.log(`  VITE_PROGRAMS_URL=${blob.url}`);
  console.log("\nThen redeploy the app once for the new env var to take effect.");
  console.log("After that, programs.json is served from the Blob CDN and will");
  console.log("remain cached even when you deploy new app code.");
}

main().catch((err) => {
  console.error("Upload failed:", err.message);
  process.exit(1);
});
