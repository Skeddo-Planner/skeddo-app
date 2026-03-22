#!/usr/bin/env node
/**
 * Skeddo Program Database Audit & Fix Script
 * Reads programs.json, runs comprehensive checks, fixes issues, writes cleaned file.
 */

const fs = require("fs");
const path = require("path");

const PROGRAMS_PATH = path.join(__dirname, "..", "src", "data", "programs.json");
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, "utf-8"));

// ── Valid values ──
const VALID_CATEGORIES = [
  "Sports", "Arts", "STEM", "Outdoor", "General", "Multi-Activity",
  "Performing Arts", "Life Skills", "Music", "Academic", "Faith-Based",
  "Language", "Cultural", "Social",
];

const VALID_ENROLLMENT = [
  "Open", "Coming Soon", "Likely Coming Soon", "Full", "Full/Waitlist",
  "Waitlist", "Closed", "In Progress", "Completed",
];

const VALID_DAY_LENGTH = ["Full Day", "Half Day", "Overnight", null, undefined];

// Known valid field names (superset across all programs)
const KNOWN_FIELDS = new Set([
  "id", "name", "provider", "category", "campType", "scheduleType",
  "ageMin", "ageMax", "startDate", "endDate", "days", "startTime", "endTime",
  "cost", "indoorOutdoor", "neighbourhood", "address", "location", "lat", "lng",
  "enrollmentStatus", "registrationUrl", "description", "tags", "activityType",
  "confirmed2026", "priceVerified", "dayLength", "season", "city",
  "source", "sourceId", "lastScraped", "weekNumber",
]);

// ── Levenshtein distance ──
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ── Report accumulator ──
const issues = {
  exactDuplicates: [],
  nearDuplicates: [],
  invalidCost: [],
  invalidAge: [],
  invalidDates: [],
  missingId: [],
  impossibleAge: [],
  impossibleCost: [],
  impossibleDates: [],
  missingName: [],
  missingProvider: [],
  missingCategory: [],
  missingRegistrationUrl: [],
  invalidUrl: [],
  invalidCategory: [],
  invalidEnrollment: [],
  locationFieldInconsistency: [],
  invalidDayLength: [],
  orphanedFields: [],
  highCost: [],
  dateOutOfRange: [],
};

console.log("=".repeat(80));
console.log("  SKEDDO PROGRAM DATABASE AUDIT");
console.log("  Total programs: " + programs.length);
console.log("=".repeat(80));
console.log();

// ────────────────────────────────────────────
// 1. EXACT DUPLICATES (same name + provider, case-insensitive, same dates)
// ────────────────────────────────────────────
console.log("── 1. EXACT DUPLICATES ──");
const seen = new Map();
const exactDupIndices = new Set();

programs.forEach((p, i) => {
  const key = `${(p.name || "").toLowerCase().trim()}|${(p.provider || "").toLowerCase().trim()}|${p.startDate || ""}|${p.endDate || ""}`;
  if (seen.has(key)) {
    const prevIdx = seen.get(key);
    issues.exactDuplicates.push({
      kept: programs[prevIdx].id,
      removed: p.id,
      name: p.name,
      provider: p.provider,
      dates: `${p.startDate} - ${p.endDate}`,
    });
    // Mark the one with fewer filled fields for removal
    const prevFilled = Object.values(programs[prevIdx]).filter(v => v !== null && v !== undefined && v !== "").length;
    const currFilled = Object.values(p).filter(v => v !== null && v !== undefined && v !== "").length;
    if (currFilled > prevFilled) {
      exactDupIndices.add(prevIdx);
      seen.set(key, i);
    } else {
      exactDupIndices.add(i);
    }
  } else {
    seen.set(key, i);
  }
});

if (issues.exactDuplicates.length === 0) {
  console.log("  No exact duplicates found (same name + provider + dates).");
} else {
  console.log(`  Found ${issues.exactDuplicates.length} exact duplicate(s):`);
  issues.exactDuplicates.forEach(d => {
    console.log(`    - "${d.name}" by ${d.provider} (${d.dates}) — keeping id=${d.kept}, removing id=${d.removed}`);
  });
}

// Also check name+provider without dates (same session listed twice)
const seenNameProvider = new Map();
const exactDupNameOnly = [];
programs.forEach((p, i) => {
  if (exactDupIndices.has(i)) return;
  const key = `${(p.name || "").toLowerCase().trim()}|${(p.provider || "").toLowerCase().trim()}`;
  if (seenNameProvider.has(key)) {
    const prevIdx = seenNameProvider.get(key);
    const prev = programs[prevIdx];
    // Only flag if dates are ALSO the same (truly identical)
    if (prev.startDate === p.startDate && prev.endDate === p.endDate) {
      exactDupNameOnly.push({ id1: prev.id, id2: p.id, name: p.name, provider: p.provider });
    }
  } else {
    seenNameProvider.set(key, i);
  }
});

console.log();

// ────────────────────────────────────────────
// 2. NEAR DUPLICATES (same provider, similar name)
// ────────────────────────────────────────────
console.log("── 2. NEAR DUPLICATES (same provider, Levenshtein < 5 or containment) ──");
const byProvider = {};
programs.forEach((p, i) => {
  if (exactDupIndices.has(i)) return;
  const prov = (p.provider || "UNKNOWN").toLowerCase().trim();
  if (!byProvider[prov]) byProvider[prov] = [];
  byProvider[prov].push({ idx: i, name: (p.name || "").trim(), id: p.id });
});

Object.entries(byProvider).forEach(([prov, entries]) => {
  if (entries.length < 2) return;
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i].name.toLowerCase();
      const b = entries[j].name.toLowerCase();
      if (a === b) continue; // exact dup already handled
      const dist = levenshtein(a, b);
      const contains = a.includes(b) || b.includes(a);
      if (dist > 0 && (dist < 5 || contains)) {
        // Skip if names differ only because one has a week number or date
        issues.nearDuplicates.push({
          provider: prov,
          name1: entries[i].name,
          id1: entries[i].id,
          name2: entries[j].name,
          id2: entries[j].id,
          distance: dist,
          contains,
        });
      }
    }
  }
});

if (issues.nearDuplicates.length === 0) {
  console.log("  No near duplicates found.");
} else {
  console.log(`  Found ${issues.nearDuplicates.length} near duplicate pair(s):`);
  // Only print first 50 to avoid overwhelming output
  const show = issues.nearDuplicates.slice(0, 50);
  show.forEach(d => {
    console.log(`    - [${d.provider}] "${d.name1}" (id=${d.id1}) vs "${d.name2}" (id=${d.id2}) — dist=${d.distance}, contains=${d.contains}`);
  });
  if (issues.nearDuplicates.length > 50) {
    console.log(`    ... and ${issues.nearDuplicates.length - 50} more`);
  }
}
console.log();

// ────────────────────────────────────────────
// 3. INVALID DATA TYPES
// ────────────────────────────────────────────
console.log("── 3. INVALID DATA TYPES ──");

programs.forEach((p, i) => {
  if (exactDupIndices.has(i)) return;

  // cost: should be number or null
  if (p.cost !== null && p.cost !== undefined && typeof p.cost !== "number") {
    issues.invalidCost.push({ id: p.id, name: p.name, cost: p.cost, type: typeof p.cost });
  }

  // ageMin/ageMax: should be number or null
  if (p.ageMin !== null && p.ageMin !== undefined && typeof p.ageMin !== "number") {
    issues.invalidAge.push({ id: p.id, name: p.name, field: "ageMin", value: p.ageMin });
  }
  if (p.ageMax !== null && p.ageMax !== undefined && typeof p.ageMax !== "number") {
    issues.invalidAge.push({ id: p.id, name: p.name, field: "ageMax", value: p.ageMax });
  }

  // startDate/endDate: should be YYYY-MM-DD or null/empty
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (p.startDate && typeof p.startDate === "string" && !dateRegex.test(p.startDate)) {
    issues.invalidDates.push({ id: p.id, name: p.name, field: "startDate", value: p.startDate });
  }
  if (p.endDate && typeof p.endDate === "string" && !dateRegex.test(p.endDate)) {
    issues.invalidDates.push({ id: p.id, name: p.name, field: "endDate", value: p.endDate });
  }

  // id: should never be undefined or null
  if (p.id === null || p.id === undefined) {
    issues.missingId.push({ index: i, name: p.name });
  }
});

console.log(`  Invalid cost types: ${issues.invalidCost.length}`);
issues.invalidCost.forEach(c => console.log(`    - id=${c.id} "${c.name}": cost="${c.cost}" (${c.type})`));
console.log(`  Invalid age types: ${issues.invalidAge.length}`);
issues.invalidAge.forEach(a => console.log(`    - id=${a.id} "${a.name}": ${a.field}="${a.value}"`));
console.log(`  Invalid date formats: ${issues.invalidDates.length}`);
issues.invalidDates.forEach(d => console.log(`    - id=${d.id} "${d.name}": ${d.field}="${d.value}"`));
console.log(`  Missing IDs: ${issues.missingId.length}`);
issues.missingId.forEach(m => console.log(`    - index=${m.index} "${m.name}"`));
console.log();

// ────────────────────────────────────────────
// 4. IMPOSSIBLE VALUES
// ────────────────────────────────────────────
console.log("── 4. IMPOSSIBLE VALUES ──");

programs.forEach((p, i) => {
  if (exactDupIndices.has(i)) return;

  // Age checks
  const ageMin = typeof p.ageMin === "number" ? p.ageMin : null;
  const ageMax = typeof p.ageMax === "number" ? p.ageMax : null;
  if (ageMin !== null && ageMax !== null && ageMin > ageMax) {
    issues.impossibleAge.push({ id: p.id, name: p.name, ageMin, ageMax, issue: "min > max" });
  }
  if (ageMin !== null && ageMin < 0) {
    issues.impossibleAge.push({ id: p.id, name: p.name, ageMin, issue: "negative ageMin" });
  }
  if (ageMax !== null && ageMax > 25) {
    issues.impossibleAge.push({ id: p.id, name: p.name, ageMax, issue: "ageMax > 25" });
  }

  // Cost checks
  const cost = typeof p.cost === "number" ? p.cost : null;
  if (cost !== null && cost < 0) {
    issues.impossibleCost.push({ id: p.id, name: p.name, cost, issue: "negative cost" });
  }
  if (cost !== null && cost > 10000) {
    issues.highCost.push({ id: p.id, name: p.name, cost, provider: p.provider });
  }

  // Date checks
  if (p.startDate && p.endDate && p.startDate > p.endDate) {
    issues.impossibleDates.push({ id: p.id, name: p.name, startDate: p.startDate, endDate: p.endDate, issue: "start after end" });
  }
  if (p.startDate && (p.startDate < "2025-01-01" || p.startDate > "2027-12-31")) {
    issues.dateOutOfRange.push({ id: p.id, name: p.name, field: "startDate", value: p.startDate });
  }
  if (p.endDate && (p.endDate < "2025-01-01" || p.endDate > "2027-12-31")) {
    issues.dateOutOfRange.push({ id: p.id, name: p.name, field: "endDate", value: p.endDate });
  }
});

console.log(`  Impossible age values: ${issues.impossibleAge.length}`);
issues.impossibleAge.forEach(a => console.log(`    - id=${a.id} "${a.name}": ${a.issue} (ageMin=${a.ageMin}, ageMax=${a.ageMax || "N/A"})`));
console.log(`  Negative cost: ${issues.impossibleCost.length}`);
issues.impossibleCost.forEach(c => console.log(`    - id=${c.id} "${c.name}": cost=${c.cost}`));
console.log(`  Unusually high cost (>$10,000): ${issues.highCost.length}`);
issues.highCost.forEach(c => console.log(`    - id=${c.id} "${c.name}" (${c.provider}): $${c.cost}`));
console.log(`  Start date after end date: ${issues.impossibleDates.length}`);
issues.impossibleDates.forEach(d => console.log(`    - id=${d.id} "${d.name}": ${d.startDate} > ${d.endDate}`));
console.log(`  Dates out of range (before 2025 or after 2027): ${issues.dateOutOfRange.length}`);
issues.dateOutOfRange.forEach(d => console.log(`    - id=${d.id} "${d.name}": ${d.field}=${d.value}`));
console.log();

// ────────────────────────────────────────────
// 5. MISSING CRITICAL FIELDS
// ────────────────────────────────────────────
console.log("── 5. MISSING CRITICAL FIELDS ──");

programs.forEach((p, i) => {
  if (exactDupIndices.has(i)) return;
  if (!p.name || !p.name.trim()) issues.missingName.push({ id: p.id, index: i });
  if (!p.provider || !p.provider.trim()) issues.missingProvider.push({ id: p.id, name: p.name, index: i });
  if (!p.category || !p.category.trim()) issues.missingCategory.push({ id: p.id, name: p.name, provider: p.provider });
  if (!p.registrationUrl || !p.registrationUrl.trim()) issues.missingRegistrationUrl.push({ id: p.id, name: p.name, provider: p.provider });
});

console.log(`  Missing name: ${issues.missingName.length}`);
issues.missingName.forEach(m => console.log(`    - id=${m.id} (index ${m.index})`));
console.log(`  Missing provider: ${issues.missingProvider.length}`);
issues.missingProvider.forEach(m => console.log(`    - id=${m.id} "${m.name}"`));
console.log(`  Missing category: ${issues.missingCategory.length}`);
issues.missingCategory.forEach(m => console.log(`    - id=${m.id} "${m.name}" (${m.provider})`));
console.log(`  Missing registrationUrl: ${issues.missingRegistrationUrl.length}`);
issues.missingRegistrationUrl.slice(0, 30).forEach(m => console.log(`    - id=${m.id} "${m.name}" (${m.provider})`));
if (issues.missingRegistrationUrl.length > 30) console.log(`    ... and ${issues.missingRegistrationUrl.length - 30} more`);
console.log();

// ────────────────────────────────────────────
// 6. INVALID URLs
// ────────────────────────────────────────────
console.log("── 6. INVALID URLs ──");

programs.forEach((p, i) => {
  if (exactDupIndices.has(i)) return;
  if (!p.registrationUrl) return; // already flagged as missing
  const url = p.registrationUrl.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    issues.invalidUrl.push({ id: p.id, name: p.name, url, issue: "doesn't start with http(s)://" });
  } else if (url === "http://" || url === "https://" || url.match(/^https?:\/\/[^./]+$/)) {
    issues.invalidUrl.push({ id: p.id, name: p.name, url, issue: "just a domain or empty" });
  }
});

console.log(`  Invalid URLs: ${issues.invalidUrl.length}`);
issues.invalidUrl.forEach(u => console.log(`    - id=${u.id} "${u.name}": "${u.url}" (${u.issue})`));
console.log();

// ────────────────────────────────────────────
// 7. CATEGORY VALIDATION
// ────────────────────────────────────────────
console.log("── 7. CATEGORY VALIDATION ──");
const allCategories = new Set();

programs.forEach((p, i) => {
  if (exactDupIndices.has(i)) return;
  if (p.category) allCategories.add(p.category);
  if (p.category && !VALID_CATEGORIES.includes(p.category)) {
    issues.invalidCategory.push({ id: p.id, name: p.name, category: p.category });
  }
});

console.log(`  All unique categories found: ${[...allCategories].sort().join(", ")}`);
console.log(`  Invalid categories: ${issues.invalidCategory.length}`);
issues.invalidCategory.slice(0, 30).forEach(c => console.log(`    - id=${c.id} "${c.name}": category="${c.category}"`));
if (issues.invalidCategory.length > 30) console.log(`    ... and ${issues.invalidCategory.length - 30} more`);
console.log();

// ────────────────────────────────────────────
// 8. ENROLLMENT STATUS VALIDATION
// ────────────────────────────────────────────
console.log("── 8. ENROLLMENT STATUS VALIDATION ──");
const allStatuses = new Set();

programs.forEach((p, i) => {
  if (exactDupIndices.has(i)) return;
  if (p.enrollmentStatus) allStatuses.add(p.enrollmentStatus);
  if (p.enrollmentStatus && !VALID_ENROLLMENT.includes(p.enrollmentStatus)) {
    issues.invalidEnrollment.push({ id: p.id, name: p.name, status: p.enrollmentStatus });
  }
});

console.log(`  All unique enrollment statuses: ${[...allStatuses].sort().join(", ")}`);
console.log(`  Invalid enrollment statuses: ${issues.invalidEnrollment.length}`);
issues.invalidEnrollment.forEach(e => console.log(`    - id=${e.id} "${e.name}": status="${e.status}"`));
console.log();

// ────────────────────────────────────────────
// 9. ADDRESS/LOCATION CONSISTENCY
// ────────────────────────────────────────────
console.log("── 9. ADDRESS/LOCATION FIELD CONSISTENCY ──");
let hasAddress = 0, hasLocation = 0, hasBoth = 0, hasNeither = 0;

programs.forEach((p, i) => {
  if (exactDupIndices.has(i)) return;
  const a = p.address !== undefined && p.address !== null;
  const l = p.location !== undefined && p.location !== null;
  if (a && l) { hasBoth++; issues.locationFieldInconsistency.push({ id: p.id, name: p.name, issue: "has both address and location" }); }
  else if (a) hasAddress++;
  else if (l) hasLocation++;
  else hasNeither++;
});

console.log(`  Programs with "address" field: ${hasAddress}`);
console.log(`  Programs with "location" field: ${hasLocation}`);
console.log(`  Programs with BOTH fields: ${hasBoth}`);
console.log(`  Programs with NEITHER field: ${hasNeither}`);
if (hasBoth > 0) {
  issues.locationFieldInconsistency.slice(0, 10).forEach(l => console.log(`    - id=${l.id} "${l.name}": ${l.issue}`));
}
console.log();

// ────────────────────────────────────────────
// 10. DAY LENGTH VALIDATION
// ────────────────────────────────────────────
console.log("── 10. DAY LENGTH VALIDATION ──");
const allDayLengths = new Set();

programs.forEach((p, i) => {
  if (exactDupIndices.has(i)) return;
  if (p.dayLength !== undefined && p.dayLength !== null) allDayLengths.add(p.dayLength);
  if (p.dayLength !== undefined && p.dayLength !== null && !["Full Day", "Half Day", "Overnight"].includes(p.dayLength)) {
    issues.invalidDayLength.push({ id: p.id, name: p.name, dayLength: p.dayLength });
  }
});

console.log(`  All unique dayLength values: ${[...allDayLengths].sort().join(", ") || "(none)"}`);
console.log(`  Invalid dayLength values: ${issues.invalidDayLength.length}`);
issues.invalidDayLength.forEach(d => console.log(`    - id=${d.id} "${d.name}": dayLength="${d.dayLength}"`));
console.log();

// ────────────────────────────────────────────
// 11. ORPHANED / UNEXPECTED FIELDS
// ────────────────────────────────────────────
console.log("── 11. ORPHANED / UNEXPECTED FIELDS ──");
const unexpectedFields = new Map();

programs.forEach((p, i) => {
  if (exactDupIndices.has(i)) return;
  Object.keys(p).forEach(key => {
    if (!KNOWN_FIELDS.has(key)) {
      if (!unexpectedFields.has(key)) unexpectedFields.set(key, []);
      unexpectedFields.get(key).push(p.id);
    }
  });
});

if (unexpectedFields.size === 0) {
  console.log("  No unexpected fields found.");
} else {
  console.log(`  Found ${unexpectedFields.size} unexpected field name(s):`);
  unexpectedFields.forEach((ids, key) => {
    console.log(`    - "${key}" found in ${ids.length} program(s): [${ids.slice(0, 10).join(", ")}${ids.length > 10 ? " ..." : ""}]`);
  });
}
console.log();

// ════════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════════
console.log("=".repeat(80));
console.log("  AUDIT SUMMARY");
console.log("=".repeat(80));
const totalIssues =
  issues.exactDuplicates.length +
  issues.invalidCost.length +
  issues.invalidAge.length +
  issues.invalidDates.length +
  issues.missingId.length +
  issues.impossibleAge.length +
  issues.impossibleCost.length +
  issues.highCost.length +
  issues.impossibleDates.length +
  issues.dateOutOfRange.length +
  issues.missingName.length +
  issues.missingProvider.length +
  issues.missingCategory.length +
  issues.missingRegistrationUrl.length +
  issues.invalidUrl.length +
  issues.invalidCategory.length +
  issues.invalidEnrollment.length +
  issues.invalidDayLength.length +
  unexpectedFields.size;

console.log(`  Total programs scanned: ${programs.length}`);
console.log(`  Exact duplicates to remove: ${issues.exactDuplicates.length}`);
console.log(`  Near duplicates (review): ${issues.nearDuplicates.length}`);
console.log(`  Invalid cost types: ${issues.invalidCost.length}`);
console.log(`  Invalid age types: ${issues.invalidAge.length}`);
console.log(`  Invalid date formats: ${issues.invalidDates.length}`);
console.log(`  Missing IDs: ${issues.missingId.length}`);
console.log(`  Impossible age values: ${issues.impossibleAge.length}`);
console.log(`  Negative costs: ${issues.impossibleCost.length}`);
console.log(`  High costs (>$10k): ${issues.highCost.length}`);
console.log(`  Start > End dates: ${issues.impossibleDates.length}`);
console.log(`  Dates out of range: ${issues.dateOutOfRange.length}`);
console.log(`  Missing name: ${issues.missingName.length}`);
console.log(`  Missing provider: ${issues.missingProvider.length}`);
console.log(`  Missing category: ${issues.missingCategory.length}`);
console.log(`  Missing registrationUrl: ${issues.missingRegistrationUrl.length}`);
console.log(`  Invalid URLs: ${issues.invalidUrl.length}`);
console.log(`  Invalid categories: ${issues.invalidCategory.length}`);
console.log(`  Invalid enrollment statuses: ${issues.invalidEnrollment.length}`);
console.log(`  Invalid dayLength: ${issues.invalidDayLength.length}`);
console.log(`  Unexpected fields: ${unexpectedFields.size}`);
console.log();

// ════════════════════════════════════════════
// FIXES
// ════════════════════════════════════════════
console.log("=".repeat(80));
console.log("  APPLYING FIXES");
console.log("=".repeat(80));

let fixCount = 0;

// Start with non-duplicate programs
let cleaned = programs.filter((_, i) => !exactDupIndices.has(i));
console.log(`  Removed ${exactDupIndices.size} exact duplicate(s). ${cleaned.length} programs remaining.`);
fixCount += exactDupIndices.size;

// Fix each program
cleaned = cleaned.map(p => {
  const prog = { ...p };

  // Fix cost: convert string numbers, "Free" → 0, "TBD"/empty → null
  if (typeof prog.cost === "string") {
    const lower = prog.cost.toLowerCase().trim();
    if (lower === "free" || lower === "$0" || lower === "0") {
      prog.cost = 0;
      fixCount++;
    } else if (lower === "tbd" || lower === "" || lower === "n/a") {
      prog.cost = null;
      fixCount++;
    } else {
      const parsed = parseFloat(prog.cost.replace(/[$,]/g, ""));
      if (!isNaN(parsed)) {
        prog.cost = parsed;
        fixCount++;
      } else {
        prog.cost = null;
        fixCount++;
      }
    }
  }

  // Fix ageMin/ageMax: convert string numbers, empty → null
  ["ageMin", "ageMax"].forEach(field => {
    if (typeof prog[field] === "string") {
      const parsed = parseInt(prog[field], 10);
      if (!isNaN(parsed)) {
        prog[field] = parsed;
      } else {
        prog[field] = null;
      }
      fixCount++;
    }
  });

  // Fix impossible age: swap if min > max
  if (typeof prog.ageMin === "number" && typeof prog.ageMax === "number" && prog.ageMin > prog.ageMax) {
    [prog.ageMin, prog.ageMax] = [prog.ageMax, prog.ageMin];
    fixCount++;
  }

  // Fix impossible dates: swap if start > end
  if (prog.startDate && prog.endDate && prog.startDate > prog.endDate) {
    [prog.startDate, prog.endDate] = [prog.endDate, prog.startDate];
    fixCount++;
  }

  // Standardize location → address
  if (prog.location && !prog.address) {
    prog.address = prog.location;
    delete prog.location;
    fixCount++;
  } else if (prog.location && prog.address) {
    // Keep address, drop location
    delete prog.location;
    fixCount++;
  }

  // Fix missing ID: generate one
  if (prog.id === null || prog.id === undefined) {
    prog.id = `auto_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    fixCount++;
  }

  return prog;
});

// Re-assign sequential IDs to avoid gaps from duplicate removal
// Actually, keep original IDs to avoid breaking references

// Write cleaned file
fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(cleaned, null, 2) + "\n", "utf-8");

console.log(`  Total fixes applied: ${fixCount}`);
console.log(`  Cleaned programs.json written with ${cleaned.length} programs.`);
console.log();
console.log("=".repeat(80));
console.log("  AUDIT COMPLETE");
console.log("=".repeat(80));
