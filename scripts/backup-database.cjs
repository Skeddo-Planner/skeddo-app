#!/usr/bin/env node
/**
 * Skeddo Daily Database Backup
 * Exports all user data tables from Supabase to timestamped JSON files.
 * Saves to Google Drive for cloud persistence.
 *
 * Usage: node scripts/backup-database.cjs
 * Scheduled: runs daily via Claude scheduled task
 */

const fs = require("fs");
const path = require("path");

// Try to load env vars
try {
  const envPath = path.join(__dirname, "..", ".env");
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const [key, ...vals] = line.split("=");
    if (key && !key.startsWith("#")) {
      process.env[key.trim()] = vals.join("=").trim();
    }
  });
} catch {}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

// Tables to backup (service role key bypasses RLS)
const TABLES = [
  "profiles",
  "kids",
  "user_programs",
  "program_kid_assignments",
  "child_access",
  "child_invite",
  "activity_log",
  "circles",
  "circle_memberships",
  "shared_activities",
  "activity_flags",
  "circle_bookmarks",
  "referrals",
  "program_submissions",
  "manual_costs",
  "push_subscriptions",
];

// Backup destination — Google Drive if available, fallback to local
const GDRIVE_PATH = path.join(
  process.env.HOME || "",
  "Library/CloudStorage/GoogleDrive-skeddo.planner@gmail.com/My Drive/skeddo-backups"
);
const LOCAL_PATH = path.join(__dirname, "..", "backups");

async function fetchTable(table) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=*`;
  const res = await fetch(url, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    console.warn(`  ⚠ ${table}: ${res.status} ${text.substring(0, 100)}`);
    return null;
  }
  return res.json();
}

async function main() {
  const now = new Date();
  const timestamp = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const timeStr = now.toISOString().replace(/[:.]/g, "-");

  console.log(`\n🗄️  Skeddo Database Backup — ${timestamp}`);
  console.log("=".repeat(50));

  // Choose backup directory
  let backupDir;
  if (fs.existsSync(path.dirname(GDRIVE_PATH))) {
    backupDir = GDRIVE_PATH;
    console.log(`📁 Saving to Google Drive: ${backupDir}`);
  } else {
    backupDir = LOCAL_PATH;
    console.log(`📁 Google Drive not available, saving locally: ${backupDir}`);
  }

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Fetch all tables
  const backup = {
    timestamp: now.toISOString(),
    version: "1.0",
    tables: {},
  };

  let totalRows = 0;
  for (const table of TABLES) {
    const data = await fetchTable(table);
    if (data !== null) {
      backup.tables[table] = data;
      totalRows += data.length;
      console.log(`  ✅ ${table}: ${data.length} rows`);
    } else {
      backup.tables[table] = [];
      console.log(`  ⚠️  ${table}: skipped (error)`);
    }
  }

  // Write backup file
  const filename = `skeddo-backup-${timeStr}.json`;
  const filepath = path.join(backupDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));

  const sizeMB = (fs.statSync(filepath).size / 1024 / 1024).toFixed(2);
  console.log(`\n✅ Backup complete: ${filename}`);
  console.log(`   ${totalRows} total rows across ${TABLES.length} tables (${sizeMB} MB)`);

  // Clean up old backups (keep last 30 days)
  const files = fs.readdirSync(backupDir)
    .filter((f) => f.startsWith("skeddo-backup-") && f.endsWith(".json"))
    .sort();

  if (files.length > 30) {
    const toDelete = files.slice(0, files.length - 30);
    toDelete.forEach((f) => {
      fs.unlinkSync(path.join(backupDir, f));
      console.log(`   🗑️  Deleted old backup: ${f}`);
    });
  }

  console.log(`   📊 ${files.length} backups retained (30-day rolling window)\n`);
}

main().catch((err) => {
  console.error("Backup failed:", err.message);
  process.exit(1);
});
