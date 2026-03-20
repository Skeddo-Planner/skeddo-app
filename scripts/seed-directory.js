/**
 * Skeddo — Seed Directory Programs
 *
 * One-time script to populate the Supabase directory_programs table
 * with the existing programs.json data.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-directory.js
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Environment ───────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── Load programs.json ────────────────────────────────────────
const programsPath = join(__dirname, "..", "src", "data", "programs.json");
const rawPrograms = JSON.parse(readFileSync(programsPath, "utf-8"));

console.log(`Loaded ${rawPrograms.length} programs from programs.json\n`);

// ─── Determine source for each program ─────────────────────────
// City of Vancouver programs that came from ActiveNet get source='activenet-vancouver'
// and their original ID as source_id. All others get source='manual'.

function isCoVProgram(program) {
  return (
    program.provider === "City of Vancouver" ||
    (program.registrationUrl && program.registrationUrl.includes("activecommunities.com"))
  );
}

function extractActiveNetId(program) {
  if (program.registrationUrl) {
    const match = program.registrationUrl.match(/detail\/(\d+)/);
    if (match) return match[1];
  }
  return null;
}

// ─── Transform to DB schema (snake_case) ───────────────────────
function transformProgram(program, index) {
  const isCoV = isCoVProgram(program);
  const activeNetId = extractActiveNetId(program);

  return {
    name: program.name,
    provider: program.provider || null,
    category: program.category || null,
    camp_type: program.campType || program.seasonType || null,
    schedule_type: program.scheduleType || null,
    age_min: program.ageMin ?? null,
    age_max: program.ageMax ?? null,
    start_date: program.startDate || null,
    end_date: program.endDate || null,
    days: program.days || null,
    start_time: program.startTime || null,
    end_time: program.endTime || null,
    cost: program.cost ?? 0,
    indoor_outdoor: program.indoorOutdoor || null,
    neighbourhood: program.neighbourhood || null,
    address: program.address || null,
    lat: program.lat ?? null,
    lng: program.lng ?? null,
    enrollment_status: program.enrollmentStatus || "Open",
    registration_url: program.registrationUrl || null,
    description: program.description || null,
    tags: program.tags || [],
    activity_type: program.activityType || null,
    early_bird_cost: program.earlyBirdCost ?? null,
    early_bird_deadline: program.earlyBirdDeadline || null,
    last_updated: new Date().toISOString(),
    source: isCoV && activeNetId ? "activenet-vancouver" : "manual",
    source_id: isCoV && activeNetId ? activeNetId : `manual-${index + 1}`,
  };
}

// ─── Seed ──────────────────────────────────────────────────────
async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Skeddo — Seed Directory Programs");
  console.log("═══════════════════════════════════════════════════\n");

  const transformed = rawPrograms.map((p, i) => transformProgram(p, i));

  const covCount = transformed.filter((p) => p.source === "activenet-vancouver").length;
  const manualCount = transformed.filter((p) => p.source === "manual").length;
  console.log(`  ActiveNet programs: ${covCount}`);
  console.log(`  Manual programs:    ${manualCount}`);
  console.log(`  Total:              ${transformed.length}\n`);

  // Upsert in batches of 200
  const BATCH_SIZE = 200;
  let upserted = 0;
  let errors = 0;

  for (let i = 0; i < transformed.length; i += BATCH_SIZE) {
    const batch = transformed.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    const { error } = await supabase
      .from("directory_programs")
      .upsert(batch, {
        onConflict: "source,source_id",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error(`  Batch ${batchNum} error:`, error.message);
      errors++;
    } else {
      upserted += batch.length;
      console.log(`  Batch ${batchNum}: ${batch.length} programs upserted`);
    }
  }

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  SEED COMPLETE");
  console.log(`  Upserted: ${upserted}`);
  console.log(`  Errors:   ${errors}`);
  console.log("═══════════════════════════════════════════════════\n");

  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
