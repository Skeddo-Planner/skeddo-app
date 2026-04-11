/**
 * process-submissions.cjs
 *
 * Pulls pending program submissions from the program_submissions table,
 * runs offline validation (dedup, required fields, URL format, data quality),
 * rejects obvious spam/duplicates, and writes a submission-queue.json for
 * Claude to browser-verify in the next interactive session.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/process-submissions.cjs
 *
 * What it does:
 *   1. Fetches all submissions with status='pending'
 *   2. Rejects: missing name, duplicate name+provider already in programs.json
 *   3. Marks remaining as 'awaiting_verification' in the DB
 *   4. Writes src/data/submission-queue.json for Claude browser verification
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const PROGRAMS_PATH = path.join(__dirname, "..", "src", "data", "programs.json");
const QUEUE_PATH = path.join(__dirname, "..", "src", "data", "submission-queue.json");

function normalize(str) {
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function main() {
  console.log("=== Process Submissions ===\n");

  // 1. Fetch pending submissions
  const { data: pending, error } = await supabase
    .from("program_submissions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch submissions:", error.message);
    process.exit(1);
  }

  if (!pending || pending.length === 0) {
    console.log("No pending submissions found.");
    // Clear the queue file if it exists
    if (fs.existsSync(QUEUE_PATH)) {
      const existing = JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
      if (existing.submissions && existing.submissions.length === 0) {
        console.log("Queue already empty.");
      }
    }
    return;
  }

  console.log(`Found ${pending.length} pending submission(s).\n`);

  // 2. Load existing programs for dedup check
  let existingPrograms = [];
  try {
    existingPrograms = JSON.parse(fs.readFileSync(PROGRAMS_PATH, "utf8"));
  } catch (e) {
    console.warn("Warning: Could not load programs.json for dedup check:", e.message);
  }

  // Build dedup index: normalized(name + provider) → program id
  const dedupIndex = new Map();
  existingPrograms.forEach((p) => {
    const key = normalize(p.name) + "|" + normalize(p.provider);
    dedupIndex.set(key, p.id);
  });

  const approved = [];
  const rejected = [];

  for (const sub of pending) {
    const reasons = [];

    // Reject: missing name
    if (!sub.name || !sub.name.trim()) {
      reasons.push("Missing program name");
    }

    // Reject: exact duplicate (same name + provider already in DB)
    const dedupKey = normalize(sub.name) + "|" + normalize(sub.provider);
    if (dedupIndex.has(dedupKey)) {
      reasons.push(`Duplicate of existing program: ${dedupIndex.get(dedupKey)}`);
    }

    // Reject: obviously invalid URL
    if (sub.registration_url && !/^https?:\/\/.+\..+/i.test(sub.registration_url)) {
      reasons.push("Invalid registration URL format");
    }

    // Reject: spam patterns (name is just a URL, gibberish, etc.)
    if (sub.name && /^https?:\/\//i.test(sub.name.trim())) {
      reasons.push("Program name appears to be a URL (spam)");
    }

    if (reasons.length > 0) {
      rejected.push({ id: sub.id, name: sub.name, reasons });
      // Mark as rejected in DB
      await supabase
        .from("program_submissions")
        .update({ status: "rejected", reviewed_at: new Date().toISOString() })
        .eq("id", sub.id);
      console.log(`  REJECTED: "${sub.name}" — ${reasons.join("; ")}`);
    } else {
      approved.push(sub);
      // Mark as awaiting_verification in DB
      await supabase
        .from("program_submissions")
        .update({ status: "awaiting_verification" })
        .eq("id", sub.id);
      console.log(`  QUEUED: "${sub.name}" by ${sub.submitted_by_name || sub.submitted_by_email || "anonymous"}`);
    }
  }

  console.log(`\nResults: ${approved.length} queued for verification, ${rejected.length} rejected.\n`);

  // 3. Build the queue file
  // Load existing queue (in case there are unprocessed items from previous runs)
  let existingQueue = { lastUpdated: "", submissions: [] };
  if (fs.existsSync(QUEUE_PATH)) {
    try {
      existingQueue = JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
    } catch (e) { /* start fresh */ }
  }

  // Merge new approved into queue (avoid duplicates by submission ID)
  const existingIds = new Set(existingQueue.submissions.map((s) => s.submissionId));
  const newEntries = approved
    .filter((s) => !existingIds.has(s.id))
    .map((s) => ({
      submissionId: s.id,
      name: s.name,
      provider: s.provider || null,
      category: s.category || "General",
      cost: s.cost,
      days: s.days || null,
      times: s.times || null,
      startDate: s.start_date || null,
      endDate: s.end_date || null,
      ageMin: s.age_min,
      ageMax: s.age_max,
      location: s.location || null,
      neighbourhood: s.neighbourhood || null,
      registrationUrl: s.registration_url || null,
      submittedBy: s.submitted_by_name || s.submitted_by_email || null,
      submittedAt: s.created_at,
      status: "awaiting_verification",
    }));

  const queue = {
    lastUpdated: new Date().toISOString(),
    note: "Programs submitted by users, validated offline, awaiting browser verification by Claude. Do NOT add to programs.json without browser-verifying every field against the live registration page.",
    submissions: [...existingQueue.submissions, ...newEntries],
  };

  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
  console.log(`Queue file written: ${queue.submissions.length} total submission(s) awaiting verification.`);
  console.log(`  Path: ${QUEUE_PATH}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
