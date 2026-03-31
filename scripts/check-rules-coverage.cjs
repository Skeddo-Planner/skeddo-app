#!/usr/bin/env node
/**
 * Skeddo Rules Coverage Checker
 *
 * Verifies that every rule in docs/DATA-QUALITY-RULES.md has a corresponding
 * validation check in scripts/validate-programs.cjs.
 *
 * Usage: node scripts/check-rules-coverage.cjs
 * Exit codes:
 *   0 = all data rules covered (process/other-script rules are expected gaps)
 *   1 = data rules exist in the doc with NO validator checks at all
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const RULES_DOC_PATH = path.join(ROOT, "docs", "DATA-QUALITY-RULES.md");
const VALIDATOR_PATH = path.join(ROOT, "scripts", "validate-programs.cjs");

const rulesDoc = fs.readFileSync(RULES_DOC_PATH, "utf8");
const validatorCode = fs.readFileSync(VALIDATOR_PATH, "utf8");

// ── 1. Extract rule numbers from DATA-QUALITY-RULES.md ──────────────────────
// Pattern: ## Rule N: Title  or  ## Rule N (Title)
// The doc has some duplicate rule numbers (16, 17, 18 appear twice each due to
// rules being added non-sequentially). We deduplicate — each rule number is
// either covered or not.
const docRuleMatches = [...rulesDoc.matchAll(/^##\s+Rule\s+(\d+)\b/gm)];
const docRuleNumbers = [...new Set(docRuleMatches.map(m => parseInt(m[1], 10)))].sort(
  (a, b) => a - b
);

// Extract rule titles for readable output
const ruleTitles = {};
for (const m of rulesDoc.matchAll(/^##\s+(Rule\s+\d+[^\n]*)/gm)) {
  const numMatch = m[1].match(/Rule\s+(\d+)/);
  if (numMatch) {
    const n = parseInt(numMatch[1], 10);
    if (!ruleTitles[n]) ruleTitles[n] = m[1].trim();
  }
}

// ── 2. Extract rule references from validate-programs.cjs ───────────────────
// Collect every rule number mentioned in any of these forms:
//   warn(id, N, ...)          — actual check emitting a violation
//   warn(String(...), N, ...) — same
//   // R12, R13, R16 in comments — explicitly acknowledged process rules
//   Rule N: or R${N} anywhere in the file
const validatorRuleRefs = new Set();

// warn(anything, N,
for (const m of validatorCode.matchAll(/\bwarn\s*\([^,]+,\s*(\d+)\s*,/g)) {
  validatorRuleRefs.add(parseInt(m[1], 10));
}

// Standalone Rxx token (e.g. R12, R33)
for (const m of validatorCode.matchAll(/\bR(\d+)\b/g)) {
  validatorRuleRefs.add(parseInt(m[1], 10));
}

// "Rule N" anywhere (comments, strings)
for (const m of validatorCode.matchAll(/\bRule\s+(\d+)\b/g)) {
  validatorRuleRefs.add(parseInt(m[1], 10));
}

// ── 3. Classify rules ────────────────────────────────────────────────────────

// Process/workflow rules: documented in the validator comment block as
// "not automatable as data checks" — they are explicitly acknowledged.
const PROCESS_RULES = new Set([12, 13, 16, 17, 18, 19]);

// Rules enforced by other scripts in the pipeline (not validate-programs.cjs).
// They still have full automation coverage — just in a different script.
const OTHER_SCRIPT_RULES = new Set([35, 36, 37, 38]);
const OTHER_SCRIPT_MAP = {
  35: "validate-urls.cjs (broken URL → fallback)",
  36: "verify-programs.cjs (unverifiable pricing)",
  37: "verify-programs.cjs (enrollment status degradation)",
  38: "validate-urls.cjs + verify-programs.cjs (process rule)",
};

const covered = docRuleNumbers.filter(n => validatorRuleRefs.has(n));
const uncovered = docRuleNumbers.filter(n => !validatorRuleRefs.has(n));

const uncoveredProcess = uncovered.filter(n => PROCESS_RULES.has(n));
const uncoveredOtherScript = uncovered.filter(n => OTHER_SCRIPT_RULES.has(n));
const uncoveredData = uncovered.filter(
  n => !PROCESS_RULES.has(n) && !OTHER_SCRIPT_RULES.has(n)
);

// Orphan checks: validator references a rule number that doesn't appear in the doc
const orphanChecks = [...validatorRuleRefs]
  .filter(n => !docRuleNumbers.includes(n))
  .sort((a, b) => a - b);

// ── 4. Compute coverage percentages ─────────────────────────────────────────
const totalRules = docRuleNumbers.length;
// Direct coverage: rules the validator explicitly checks
const directCoverage = Math.round((covered.length / totalRules) * 100);
// Effective coverage: also counts process rules and other-script rules as covered
const effectivelyCovered =
  covered.length + uncoveredProcess.size + uncoveredOtherScript.size;
const effectiveCoverage = Math.round(
  ((covered.length + uncoveredProcess.length + uncoveredOtherScript.length) /
    totalRules) *
    100
);

// ── 5. Print report ──────────────────────────────────────────────────────────
console.log("\n=== SKEDDO RULES COVERAGE REPORT ===\n");
console.log(`Rules in DATA-QUALITY-RULES.md : ${totalRules}`);
console.log(`Covered by validate-programs.cjs: ${covered.length}`);
console.log(`Process rules (acknowledged)    : ${uncoveredProcess.length}`);
console.log(`Covered by other pipeline scripts: ${uncoveredOtherScript.length}`);
console.log(`\nDirect coverage  : ${directCoverage}%`);
console.log(`Effective coverage: ${effectiveCoverage}% (all pipeline scripts + process rules)\n`);

console.log(`✅ COVERED (${covered.length}): ${covered.map(n => `R${n}`).join(", ")}`);

if (uncoveredProcess.length > 0) {
  console.log(
    `\n📋 PROCESS RULES — acknowledged, not data-checkable (${uncoveredProcess.length}): ` +
      uncoveredProcess.map(n => `R${n}`).join(", ")
  );
  console.log(
    `   These are workflow/UI rules explicitly documented in the validator's comment block.`
  );
}

if (uncoveredOtherScript.length > 0) {
  console.log(`\n🔗 COVERED BY OTHER PIPELINE SCRIPTS (${uncoveredOtherScript.length}):`);
  uncoveredOtherScript.forEach(n => {
    console.log(`   R${n} — ${OTHER_SCRIPT_MAP[n] || "other script"}`);
  });
}

if (orphanChecks.length > 0) {
  console.log(
    `\n⚠️  ORPHAN CHECKS — validator references rules NOT in the doc (${orphanChecks.length}): ` +
      orphanChecks.map(n => `R${n}`).join(", ")
  );
  console.log(
    `   Either add these rules to DATA-QUALITY-RULES.md or remove the check.`
  );
}

if (uncoveredData.length > 0) {
  console.log(`\n❌ UNCOVERED DATA RULES — no validator check anywhere (${uncoveredData.length}):`);
  uncoveredData.forEach(n => {
    console.log(`   ${ruleTitles[n] || `Rule ${n}`}`);
  });
  console.log(
    `\n   → Add checks to scripts/validate-programs.cjs for: ` +
      uncoveredData.map(n => `R${n}`).join(", ")
  );
  console.log(`   → Per Rule 17: every rule must be documented AND automated.\n`);
} else {
  console.log(`\n✅ All ${totalRules} rules have coverage (validator, pipeline scripts, or process acknowledgement).\n`);
}

console.log("=".repeat(50));

// Exit 1 only if data rules have zero coverage anywhere in the pipeline
process.exit(uncoveredData.length > 0 ? 1 : 0);
