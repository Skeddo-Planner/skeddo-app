#!/usr/bin/env node
/**
 * Skeddo Program Database Validator
 *
 * Enforces ALL rules from docs/DATA-QUALITY-RULES.md.
 * Run after ANY data change (import, scrape, manual add).
 *
 * Usage: node scripts/validate-programs.cjs [--fix]
 *   --fix: auto-fix issues where possible (otherwise report only)
 *
 * Exit codes:
 *   0 = all checks pass
 *   1 = violations found (printed to stdout)
 */

const fs = require("fs");
const path = require("path");

const FIX = process.argv.includes("--fix");
const programsPath = path.join(__dirname, "..", "src", "data", "programs.json");
const programs = JSON.parse(fs.readFileSync(programsPath, "utf8"));

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

let violations = 0;
let fixed = 0;

function warn(id, rule, msg) {
  violations++;
  console.log(`[R${rule}] id=${id}: ${msg}`);
}

function parseTime(t) {
  if (!t || typeof t !== "string") return null;
  const m = t.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
  if (!m) return null;
  let h = parseInt(m[1]);
  const min = parseInt(m[2] || "0");
  const ampm = (m[3] || "").toUpperCase();
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h + min / 60;
}

// Genuinely free providers (confirmed on their websites)
const FREE_PROVIDERS = [
  "Vancouver School Board (SD39)", "Burnaby School District (SD41)",
  "North Vancouver School District (SD44)", "West Vancouver Schools (SD45)",
  "Richmond School District (SD38)", "New Westminster School District (SD40)",
  "Coquitlam School District (SD43)", "Surrey School District (SD36)",
  "CTS Youth Society", "Khalsa Centre", "Gurmat Center",
  "Gurdwara Sahib Sukh Sagar", "Khalsa School Canada",
  "Vancouver Aboriginal Friendship Centre", "UBC CEDAR Program", "I-SPARC",
];

console.log(`\n=== SKEDDO PROGRAM VALIDATOR ===`);
console.log(`Programs: ${programs.length} | Mode: ${FIX ? "FIX" : "REPORT"} | Date: ${TODAY.toISOString().split("T")[0]}\n`);

programs.forEach((p, idx) => {
  const id = p.id || `[idx ${idx}]`;

  // ── Rule 1: Registration URL must exist and be valid ──
  if (!p.registrationUrl) {
    warn(id, 1, "Missing registrationUrl");
  } else if (!p.registrationUrl.startsWith("http")) {
    warn(id, 1, `Invalid registrationUrl: ${p.registrationUrl}`);
  }

  // ── Rule 24: NEVER use activekids.com or campscui.active.com URLs ──
  if (p.registrationUrl && (p.registrationUrl.includes("activekids.com") || p.registrationUrl.includes("campscui.active.com"))) {
    warn(id, 24, `Banned URL domain (third-party aggregator): ${p.registrationUrl.split("/")[2]}`);
  }

  // ── Rule 2: Dates must be program-specific, not season-wide ──
  if (p.startDate && p.endDate) {
    const start = new Date(p.startDate + "T00:00:00");
    const end = new Date(p.endDate + "T00:00:00");
    const span = (end - start) / (1000 * 60 * 60 * 24);
    if (span > 35 && !p.repeating) {
      warn(id, 2, `Date span ${span} days without repeating flag (${p.startDate} to ${p.endDate})`);
    }
    // Single-day mismatch: days field says one day but dates span multiple
    if (p.days && typeof p.days === "string") {
      const d = p.days.trim().toLowerCase();
      const isSingle = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].includes(d);
      if (isSingle && span > 1) {
        warn(id, 2, `Days="${p.days}" (single day) but date span is ${span} days`);
      }
    }
    // Start after end
    if (start > end) {
      warn(id, 2, `startDate (${p.startDate}) is after endDate (${p.endDate})`);
    }
  }

  // ── Rule 3: Cost must be number or null, not empty string ──
  if (p.cost === "") {
    warn(id, 3, 'Cost is empty string — should be null or a number');
    if (FIX) { p.cost = null; p.costNote = p.costNote || "Inquire for pricing"; fixed++; }
  }
  if (typeof p.cost === "string" && p.cost !== "TBD") {
    const parsed = parseFloat(p.cost);
    if (!isNaN(parsed)) {
      warn(id, 3, `Cost is string "${p.cost}" — should be number ${parsed}`);
      if (FIX) { p.cost = parsed; fixed++; }
    }
  }

  // ── Rule 4: Times must be valid ──
  if (p.startTime && p.endTime) {
    const start = parseTime(p.startTime);
    const end = parseTime(p.endTime);
    if (start !== null && end !== null) {
      if (end <= start) {
        warn(id, 4, `endTime (${p.endTime}) is before/equal to startTime (${p.startTime})`);
      }
      const dur = end - start;
      if (dur > 12) {
        warn(id, 4, `Duration ${dur}h too long (${p.startTime}-${p.endTime})`);
      }
      // Auto-compute durationPerDay if missing
      if (!p.durationPerDay && dur > 0 && dur <= 12) {
        let total = dur;
        if (p.beforeCare?.available && p.beforeCare.time) {
          const parts = p.beforeCare.time.split(/[-–]/).map(s => s.trim());
          if (parts.length === 2) {
            const bs = parseTime(parts[0]), be = parseTime(parts[1]);
            if (bs !== null && be !== null && be > bs) total += (be - bs);
          }
        }
        if (p.afterCare?.available && p.afterCare.time) {
          const parts = p.afterCare.time.split(/[-–]/).map(s => s.trim());
          if (parts.length === 2) {
            const as2 = parseTime(parts[0]), ae = parseTime(parts[1]);
            if (as2 !== null && ae !== null && ae > as2) total += (ae - as2);
          }
        }
        if (FIX) { p.durationPerDay = Math.round(total * 2) / 2; fixed++; }
      }
    }
  }

  // ── Rule 5: Age ranges must be valid numbers ──
  if (p.ageMin !== null && p.ageMin !== undefined && typeof p.ageMin !== "number") {
    warn(id, 5, `ageMin is ${typeof p.ageMin} "${p.ageMin}"`);
    if (FIX) { const n = parseInt(p.ageMin); p.ageMin = isNaN(n) ? null : n; fixed++; }
  }
  if (p.ageMax !== null && p.ageMax !== undefined && typeof p.ageMax !== "number") {
    warn(id, 5, `ageMax is ${typeof p.ageMax} "${p.ageMax}"`);
    if (FIX) { const n = parseInt(p.ageMax); p.ageMax = isNaN(n) ? null : n; fixed++; }
  }
  if (typeof p.ageMin === "number" && typeof p.ageMax === "number" && p.ageMin > p.ageMax) {
    warn(id, 5, `ageMin (${p.ageMin}) > ageMax (${p.ageMax})`);
  }

  // ── Rule 6: Neighbourhood must not be vague ──
  if (!p.neighbourhood || p.neighbourhood === "TBD" || p.neighbourhood === "Various") {
    warn(id, 6, `Vague/missing neighbourhood: "${p.neighbourhood || ""}"`);
  }

  // ── Rule 8 + 20: Enrollment status must match registration date ──
  if (p.enrollmentStatus === "Coming Soon" && !p.registrationDate) {
    warn(id, 20, '"Coming Soon" without registrationDate');
    if (FIX) { p.enrollmentStatus = "Likely Coming Soon"; fixed++; }
  }
  if (p.registrationDate) {
    const regDate = new Date(p.registrationDate + "T00:00:00");
    const daysUntil = (regDate - TODAY) / (1000 * 60 * 60 * 24);
    const openStatuses = ["Open", "Full/Waitlist", "Waitlist", "Closed", "In Progress", "Completed"];
    if (daysUntil < 0 && !openStatuses.includes(p.enrollmentStatus)) {
      warn(id, 8, `Registration date ${p.registrationDate} passed but status="${p.enrollmentStatus}"`);
      if (FIX) { p.enrollmentStatus = "Open"; fixed++; }
    } else if (daysUntil >= 0 && daysUntil <= 30 && p.enrollmentStatus !== "Coming Soon" && !openStatuses.includes(p.enrollmentStatus)) {
      warn(id, 8, `Registration in ${Math.round(daysUntil)}d but status="${p.enrollmentStatus}" (should be "Coming Soon")`);
      if (FIX) { p.enrollmentStatus = "Coming Soon"; fixed++; }
    } else if (daysUntil > 30 && p.enrollmentStatus !== "Upcoming" && !openStatuses.includes(p.enrollmentStatus)) {
      warn(id, 8, `Registration in ${Math.round(daysUntil)}d but status="${p.enrollmentStatus}" (should be "Upcoming")`);
      if (FIX) { p.enrollmentStatus = "Upcoming"; fixed++; }
    }
  }

  // ── Rule 11: Address must be a real street address ──
  if (p.address) {
    const addr = p.address.trim();
    if (/^[A-Z][a-z]+, BC$/i.test(addr) || /^[A-Z][a-z]+, British Columbia$/i.test(addr)) {
      warn(id, 11, `Vague address (city only): "${addr}"`);
    }
  }

  // ── Rule 14: Prior-year data = "Likely Coming Soon" ──
  if (p.confirmed2026 === false) {
    if (p.enrollmentStatus === "Open" || p.enrollmentStatus === "Coming Soon") {
      warn(id, 14, `confirmed2026=false but status="${p.enrollmentStatus}"`);
      if (FIX) { p.enrollmentStatus = "Likely Coming Soon"; fixed++; }
    }
  }

  // ── Rule 15: No false "Free" listings ──
  if (p.cost === 0) {
    const isGenuinelyFree = FREE_PROVIDERS.includes(p.provider) ||
      (p.name && (p.name.includes("Volunteer") || p.name.includes("Youth Council")));
    if (!isGenuinelyFree) {
      warn(id, 15, `cost=0 but "${p.provider}" not in confirmed-free list`);
    }
  }

  // ── Rule 22: No guessed data — null cost must have costNote ──
  if (p.cost === null && !p.costNote) {
    warn(id, 22, 'cost=null without costNote');
    if (FIX) { p.costNote = "Inquire for pricing"; fixed++; }
  }

  // ── Required fields ──
  if (!p.name) warn(id, "REQ", "Missing name");
  if (!p.provider) warn(id, "REQ", "Missing provider");
  if (!p.category) warn(id, "REQ", "Missing category");
  if (!p.season) warn(id, "REQ", "Missing season");
});

// ── R23: Adult-only programs (ageMin >= 18) should not be in database ──
for (const p of programs) {
  if (p.ageMin >= 18 && (!p.ageMax || p.ageMax >= 18)) {
    warn(String(p.id), 23, `Adult-only program (ageMin=${p.ageMin}, ageMax=${p.ageMax}) — remove or verify`);
  }
}

// ── R24: Programs for teens (ageMin 13-17) are VALID — do NOT remove ──
// This is a documentation rule, not a check. Programs with ageMin < 18 must be kept.
// Skeddo serves all kids under 18.

// ── Batch: Duplicate IDs ──
const idCounts = {};
programs.forEach(p => { idCounts[String(p.id)] = (idCounts[String(p.id)] || 0) + 1; });
Object.entries(idCounts).filter(([, v]) => v > 1).forEach(([k, v]) => {
  warn(k, 10, `Duplicate ID (${v} occurrences)`);
});

// ── Summary ──
console.log(`\n=== VALIDATION SUMMARY ===`);
console.log(`Total programs: ${programs.length}`);
console.log(`Violations: ${violations}`);
if (FIX) {
  console.log(`Auto-fixed: ${fixed}`);
  fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2));
  console.log(`programs.json saved.`);
}
console.log(`Rules checked: 1,2,3,4,5,6,8,10,11,14,15,20,22,23 + REQ`);
console.log(`\nRun with --fix to auto-repair fixable issues.\n`);

process.exit(violations > 0 ? 1 : 0);
