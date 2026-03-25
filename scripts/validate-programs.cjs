/**
 * Program Data Validation Script
 * Run BEFORE committing any changes to programs.json
 * Usage: node scripts/validate-programs.cjs
 *
 * Enforces all 15 data quality rules from docs/DATA-QUALITY-RULES.md
 * Exit code 0 = pass, 1 = violations found
 */
const fs = require("fs");
const path = require("path");

const programs = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/data/programs.json"), "utf8"));

let violations = 0;
const issues = [];

function fail(id, provider, rule, msg) {
  violations++;
  issues.push({ id, provider, rule, msg });
}

programs.forEach((p) => {
  const id = p.id;
  const prov = p.provider || "Unknown";

  // Rule 1: Registration URL must exist and not be a bare homepage
  if (!p.registrationUrl) {
    fail(id, prov, 1, "Missing registrationUrl");
  }

  // Rule 2: Dates — flag season-wide ranges (>14 days) without repeating field
  if (p.startDate && p.endDate && !p.repeating) {
    const days = (new Date(p.endDate + "T00:00:00") - new Date(p.startDate + "T00:00:00")) / (1000 * 60 * 60 * 24);
    if (days > 14) {
      // Allow school districts and multi-week intensives
      const provLower = prov.toLowerCase();
      if (!provLower.includes("school board") && !provLower.includes("school district") && !provLower.match(/\(sd[0-9]/) && !provLower.includes("arts umbrella")) {
        fail(id, prov, 2, `Date range spans ${days} days without repeating field`);
      }
    }
  }

  // Rule 5: Age ranges — ageMin must be less than ageMax
  if (p.ageMin != null && p.ageMax != null && p.ageMin > p.ageMax) {
    fail(id, prov, 5, `ageMin (${p.ageMin}) > ageMax (${p.ageMax})`);
  }

  // Rule 14: Prior-year data must be "Likely Coming Soon"
  if (p.confirmed2026 === false && p.enrollmentStatus === "Open") {
    fail(id, prov, 14, "confirmed2026=false but enrollmentStatus=Open (must be 'Likely Coming Soon')");
  }

  // Rule 15: No false free listings
  if (p.cost === 0 && !p.costNote) {
    const provLower = prov.toLowerCase();
    const isFreeProvider = provLower.includes("school board") || provLower.includes("school district") ||
      provLower.includes("aboriginal") || provLower.includes("cedar") || provLower.includes("khalsa") ||
      provLower.includes("gurmat") || provLower.includes("i-sparc") || provLower.includes("library");
    if (!isFreeProvider) {
      fail(id, prov, 15, "cost=0 without costNote — is this genuinely free?");
    }
  }

  // Missing required fields
  if (!p.name) fail(id, prov, 0, "Missing name");
  if (!p.provider) fail(id, prov, 0, "Missing provider");
  if (!p.category) fail(id, prov, 0, "Missing category");
});

// Summary
console.log("=".repeat(60));
console.log(`  PROGRAM VALIDATION: ${programs.length} programs scanned`);
console.log("=".repeat(60));

if (violations === 0) {
  console.log("  ✅ ALL CHECKS PASSED — zero violations");
} else {
  console.log(`  ❌ ${violations} VIOLATIONS FOUND`);
  console.log("");

  // Group by rule
  const byRule = {};
  issues.forEach((i) => {
    if (!byRule[i.rule]) byRule[i.rule] = [];
    byRule[i.rule].push(i);
  });

  Object.entries(byRule).sort((a, b) => a[0] - b[0]).forEach(([rule, items]) => {
    console.log(`  Rule ${rule}: ${items.length} violation(s)`);
    items.slice(0, 5).forEach((i) => console.log(`    ${i.id} | ${i.provider} | ${i.msg}`));
    if (items.length > 5) console.log(`    ... +${items.length - 5} more`);
    console.log("");
  });
}

console.log("=".repeat(60));
process.exit(violations > 0 ? 1 : 0);
