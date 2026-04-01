#!/usr/bin/env node
/**
 * Smart pre-commit validation for programs.json changes.
 *
 * Called by .husky/pre-commit when programs.json is staged.
 *
 * Pipeline:
 *   1. Identify new/changed program IDs vs HEAD
 *   2. Run fill-computable-fields.cjs  (computed fields)
 *   3. Run validate-programs.cjs --fix  (rule auto-fixes)
 *   4. Re-stage programs.json
 *   5. Re-validate — check if any violations belong to new/changed programs
 *   6. If yes → run auto-resolve-violations.cjs --offline --ids=...
 *   7. Re-stage + re-validate
 *   8. If new/changed programs still have violations → EXIT 1 (block commit)
 *   9. If violations only on pre-existing programs → EXIT 0 with warning
 *  10. If no violations → EXIT 0
 *
 * Exit codes:
 *   0 = commit allowed (all new/changed programs clean, or no programs changed)
 *   1 = commit blocked (new/changed programs have unresolvable violations)
 */

const fs    = require("fs");
const path  = require("path");
const { execSync, spawnSync } = require("child_process");

const ROOT = execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim();
const programsPath = path.join(ROOT, "src", "data", "programs.json");

// ── Helpers ────────────────────────────────────────────────────────────────────
function run(cmd, opts = {}) {
  return spawnSync("node", cmd, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    ...opts,
  });
}

function runSh(cmd) {
  return spawnSync("bash", ["-c", cmd], {
    cwd: ROOT, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"],
  });
}

function gitAdd(file) {
  spawnSync("git", ["add", file], { cwd: ROOT, encoding: "utf8" });
}

// Parse validator output → { id → [{rule, msg}] }
function parseViolations(output) {
  const violations = {};
  for (const line of (output || "").split("\n")) {
    const m = line.match(/^\[R(\w+)\]\s+id=([^:]+):\s+(.+)$/);
    if (!m) continue;
    const [, rule, rawId, msg] = m;
    const id = rawId.trim();
    if (!violations[id]) violations[id] = [];
    violations[id].push({ rule, msg: msg.trim() });
  }
  return violations;
}

// Run validator (no --fix) and return all violations
function validate() {
  const result = spawnSync("node", [path.join(ROOT, "scripts", "validate-programs.cjs")], {
    cwd: ROOT, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"],
  });
  const output = (result.stdout || "") + (result.stderr || "");
  return {
    clean: result.status === 0,
    violations: parseViolations(output),
    output,
  };
}

// ── Get changed/new program IDs vs HEAD ────────────────────────────────────────
function getChangedIds() {
  let oldPrograms = [];
  try {
    const oldJson = execSync("git show HEAD:src/data/programs.json", {
      cwd: ROOT, encoding: "utf8", maxBuffer: 50 * 1024 * 1024, // 50MB — programs.json is ~9MB
    });
    oldPrograms = JSON.parse(oldJson);
  } catch (e) {
    // No HEAD (first commit) — all programs are "new"
    console.log("  (First commit detected — all programs are new)");
    const current = JSON.parse(fs.readFileSync(programsPath, "utf8"));
    return new Set(current.map(p => String(p.id)));
  }

  const newPrograms = JSON.parse(fs.readFileSync(programsPath, "utf8"));

  const oldById = {};
  oldPrograms.forEach(p => { oldById[String(p.id)] = JSON.stringify(p); });

  const changedIds = new Set();
  newPrograms.forEach(p => {
    const id = String(p.id);
    const newStr = JSON.stringify(p);
    if (!oldById[id] || oldById[id] !== newStr) {
      changedIds.add(id);
    }
  });

  return changedIds;
}

// ── Main ───────────────────────────────────────────────────────────────────────
function main() {
  console.log("\n🔍 Smart pre-commit: programs.json validation pipeline\n");

  // Step 1: Get changed IDs
  console.log("Step 1/5  Identifying new/changed programs vs HEAD...");
  const changedIds = getChangedIds();

  if (changedIds.size === 0) {
    console.log("  No program data changed. Skipping validation.");
    process.exit(0);
  }

  console.log(`  Found ${changedIds.size} new/changed program(s): ${[...changedIds].slice(0, 8).join(", ")}${changedIds.size > 8 ? ", ..." : ""}`);

  // Step 2: Run fill-computable-fields.cjs
  console.log("\nStep 2/5  Computing derived fields (fill-computable-fields.cjs)...");
  const fillResult = run([path.join(ROOT, "scripts", "fill-computable-fields.cjs")]);
  if (fillResult.status !== 0) {
    console.error("  ⚠️  fill-computable-fields.cjs failed (non-fatal):");
    console.error(fillResult.stderr || fillResult.stdout);
  } else {
    const lines = (fillResult.stdout || "").trim().split("\n").filter(Boolean);
    lines.forEach(l => console.log("  " + l));
  }

  // Step 3: Run validate-programs.cjs --fix
  console.log("\nStep 3/5  Running validate-programs.cjs --fix...");
  const fixResult = run([path.join(ROOT, "scripts", "validate-programs.cjs"), "--fix"]);
  const fixOutput = (fixResult.stdout || "") + (fixResult.stderr || "");
  // Print summary line(s)
  const summaryLines = fixOutput.split("\n").filter(l =>
    l.includes("Auto-fixed:") || l.includes("Violations:") || l.includes("Programs:")
  );
  summaryLines.forEach(l => console.log("  " + l.trim()));

  // Step 4: Re-stage programs.json
  gitAdd("src/data/programs.json");

  // Step 5: Re-validate to find remaining violations
  console.log("\nStep 4/5  Re-validating changed programs...");
  let { clean, violations } = validate();

  // Filter violations to only changed/new programs
  const changedViolations = {};
  for (const [id, vs] of Object.entries(violations)) {
    if (changedIds.has(id)) changedViolations[id] = vs;
  }
  const preExistingViolations = {};
  for (const [id, vs] of Object.entries(violations)) {
    if (!changedIds.has(id)) preExistingViolations[id] = vs;
  }

  const changedViolationCount  = Object.values(changedViolations).reduce((n, vs) => n + vs.length, 0);
  const preExistingViolationCount = Object.values(preExistingViolations).reduce((n, vs) => n + vs.length, 0);

  if (changedViolationCount === 0) {
    // No violations on new/changed programs
    if (preExistingViolationCount > 0) {
      printPreExistingWarning(preExistingViolations);
    } else {
      console.log("  ✅ All new/changed programs pass validation.");
    }
    process.exit(0);
  }

  // Violations found on changed programs — try auto-resolve
  console.log(`  Found ${changedViolationCount} violation(s) on new/changed programs:`);
  for (const [id, vs] of Object.entries(changedViolations)) {
    vs.forEach(v => console.log(`    [R${v.rule}] id=${id}: ${v.msg}`));
  }

  console.log("\nStep 5/5  Running auto-resolve-violations.cjs --offline...");
  const idsArg = `--ids=${[...changedIds].join(",")}`;
  const resolveResult = run([
    path.join(ROOT, "scripts", "auto-resolve-violations.cjs"),
    "--offline", idsArg,
  ]);
  const resolveOutput = (resolveResult.stdout || "").trim();
  resolveOutput.split("\n").filter(l => l.startsWith("  id=") || l.includes("resolved") || l.includes("Unresolvable"))
    .forEach(l => console.log("  " + l.trim()));

  // Re-stage and re-validate
  gitAdd("src/data/programs.json");
  const final = validate();
  const finalChangedViolations = {};
  const finalPreExistingViolations = {};
  for (const [id, vs] of Object.entries(final.violations)) {
    if (changedIds.has(id)) finalChangedViolations[id] = vs;
    else finalPreExistingViolations[id] = vs;
  }
  const finalChangedCount = Object.values(finalChangedViolations).reduce((n, vs) => n + vs.length, 0);

  if (finalChangedCount === 0) {
    console.log("\n  ✅ All violations on new/changed programs were auto-resolved.");
    if (Object.keys(finalPreExistingViolations).length > 0) {
      printPreExistingWarning(finalPreExistingViolations);
    }
    process.exit(0);
  }

  // BLOCK: violations remain on new/changed programs
  const fixableNotes = {
    "1":   "Add a registrationUrl pointing to the program's registration page",
    "2":   "Fix date range or add repeating:true if program runs on a recurring schedule",
    "3":   "Set cost to a number (e.g. 350) or null — not a string",
    "5":   "Set ageMin and ageMax to numbers (e.g. 6, 12)",
    "6":   "Set neighbourhood to a specific area (e.g. 'Kitsilano', 'Burnaby North')",
    "7":   "Set confirmed2026:true only after verifying on the provider's live page",
    "8":   "Correct enrollmentStatus based on registrationDate (or remove registrationDate)",
    "11":  "Replace city-only address with a real street address",
    "14":  "Set enrollmentStatus:'Likely Coming Soon' for unconfirmed 2026 programs",
    "15":  "Only set cost:0 for genuinely free programs; use null+costNote otherwise",
    "20":  "Add registrationDate or change status to 'Likely Coming Soon'",
    "22":  "Add costNote explaining why cost is null (e.g. 'Inquire for pricing')",
    "24":  "Replace activekids.com/campscui.active.com URL with the provider's own site",
    "25":  "Can't have both isEstimate:true and priceVerified:true — pick one",
    "26":  "Add costNote explaining the estimate source",
    "28":  "Set confirmed2026:true (after verifying) or change status to 'Likely Coming Soon'",
    "29":  "Update registrationUrl to a specific program/registration page, not the homepage",
    "32":  "Update ActiveNet URL to point to the specific activity detail page",
    "33":  "Fix scheduleType — 'Full Day' requires durationPerDay >= 4 hours",
    "34":  "Verify ageMin — programs for infants/toddlers must have matching keywords",
    "REQ": "Fill in all required fields: name, provider, category, season, enrollmentStatus, ageMin, description, activityType",
  };

  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════════════╗");
  console.log("║  ❌  COMMIT BLOCKED — new/changed programs have violations       ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("The following new/changed programs must be fixed before committing:");
  console.log("");

  for (const [id, vs] of Object.entries(finalChangedViolations)) {
    console.log(`  Program id=${id}:`);
    vs.forEach(v => {
      const hint = fixableNotes[v.rule] || "Review the rule and fix manually";
      console.log(`    [R${v.rule}] ${v.msg}`);
      console.log(`           Fix: ${hint}`);
    });
    console.log("");
  }

  console.log("Fix the violations above, then run:");
  console.log("  node scripts/validate-programs.cjs --fix");
  console.log("  git add src/data/programs.json");
  console.log("  git commit ...");
  console.log("");

  if (Object.keys(finalPreExistingViolations).length > 0) {
    const n = Object.values(finalPreExistingViolations).reduce((s, vs) => s + vs.length, 0);
    console.log(`Note: ${n} pre-existing violation(s) on unchanged programs were NOT the cause of this block.`);
    console.log("      They will be auto-fixed by the daily pipeline.\n");
  }

  process.exit(1);
}

function printPreExistingWarning(preExistingViolations) {
  const n = Object.values(preExistingViolations).reduce((s, vs) => s + vs.length, 0);
  const ids = Object.keys(preExistingViolations).slice(0, 5);
  console.log(`\n  ⚠️  Warning: ${n} pre-existing violation(s) on unchanged programs (ids: ${ids.join(", ")}${Object.keys(preExistingViolations).length > 5 ? ", ..." : ""})`);
  console.log("      These are not caused by your changes. Commit is allowed.");
  console.log("      Run 'node scripts/validate-programs.cjs --fix' to clean them up.\n");
}

main();
