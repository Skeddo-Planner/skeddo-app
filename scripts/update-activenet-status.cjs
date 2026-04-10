#!/usr/bin/env node
/**
 * update-activenet-status.cjs
 *
 * Checks enrollment status for all ActiveNet programs via their REST API
 * and updates programs.json accordingly.
 *
 * Also extracts ageMax from the API response where missing.
 *
 * Usage:
 *   node scripts/update-activenet-status.cjs          # dry-run (report only)
 *   node scripts/update-activenet-status.cjs --fix     # apply changes
 *   node scripts/update-activenet-status.cjs --fix --limit=100  # test with limit
 *
 * This script should be run regularly (e.g. daily via CI or pre-commit)
 * to keep enrollment statuses current. ActiveNet programs go Full/Waitlist
 * frequently and our data goes stale without re-checking.
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

const HOST = "anc.ca.apm.activecommunities.com";

// Map program ID prefixes to ActiveNet instance slugs
const SLUG_MAP = {
  COV: "vancouver",
  BNB: "burnaby",
  WV: "westvanrec",
  PC: "cityofportcoquitlam",
  LGY: "langleycityrecconnect",
};

// Parse CLI args
const args = process.argv.slice(2);
const FIX = args.includes("--fix");
const VERBOSE = args.includes("--verbose");
const limitArg = args.find(a => a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1]) : Infinity;

/**
 * Fetch activity detail from ActiveNet REST API
 */
function fetchDetail(slug, activityId) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: HOST,
      port: 443,
      path: `/${slug}/rest/activity/detail/${activityId}?locale=en-US`,
      method: "GET",
      headers: { Accept: "application/json", "User-Agent": "Skeddo-StatusChecker/1.0" },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
    });
    req.on("error", () => resolve(null));
    req.setTimeout(15000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

/**
 * Map ActiveNet space_status + space_message to our enrollmentStatus enum
 */
function mapStatus(detail) {
  const spaceStatus = detail.space_status || "";
  const spaceMessage = detail.space_message || "";
  const regStatus = detail.registration_status || "";

  // Closed to registration
  if (regStatus === "Closed" || spaceStatus === "Closed") {
    return "Closed";
  }

  // Cancelled
  if (spaceStatus === "Cancelled" || regStatus === "Cancelled") {
    return "Cancelled";
  }

  // Full — check for waitlist
  if (spaceStatus === "Full") {
    if (spaceMessage.toLowerCase().includes("wait")) {
      return "Full/Waitlist";
    }
    return "Full";
  }

  // Available
  if (spaceStatus === "Available") {
    return "Open";
  }

  // Enrollment not yet open
  if (regStatus === "Not Yet Open" || spaceMessage.toLowerCase().includes("enrollment opens")) {
    return "Coming Soon";
  }

  return null; // Unknown — don't change
}

/**
 * Extract ageMin from ActiveNet detail age_restriction field
 */
function extractAgeMin(detail) {
  const ageText = detail.age_restriction || "";
  const m = ageText.match(/at least\s+(\d+)\s*yrs?/i);
  if (m) return parseInt(m[1]);
  return null;
}

/**
 * Extract ageMax from ActiveNet detail age_restriction field
 * Format: "Age at least X yrs but less than Y[y Zm]"
 */
function extractAgeMax(detail) {
  const ageText = detail.age_restriction || "";
  // Pattern: "less than Xy Zm" or "less than X yrs"
  let m = ageText.match(/less than\s+(\d+)y\s+(\d+)m/i);
  if (m) {
    const years = parseInt(m[1]);
    const months = parseInt(m[2]);
    // "less than 12y 11m" → ageMax = 12 (up to 12y 10m)
    // "less than 6y 0m" → ageMax = 5
    return months >= 6 ? years : years - 1;
  }
  m = ageText.match(/less than\s+(\d+)\s*yrs?/i);
  if (m) {
    return parseInt(m[1]) - 1; // "less than 6 yrs" → ageMax = 5
  }
  return null;
}

async function main() {
  const programsPath = path.join(__dirname, "..", "src", "data", "programs.json");
  const programs = JSON.parse(fs.readFileSync(programsPath, "utf-8"));

  // Build list of ActiveNet programs to check
  const activenet = [];
  for (let i = 0; i < programs.length; i++) {
    const p = programs[i];
    if (typeof p.id !== "string") continue;
    const prefix = p.id.split("-")[0];
    if (!SLUG_MAP[prefix]) continue;
    const activityId = p.id.split("-").slice(1).join("-");
    activenet.push({ index: i, prefix, slug: SLUG_MAP[prefix], activityId, id: p.id });
  }

  const toCheck = activenet.slice(0, LIMIT);
  console.log(`\n=== ActiveNet Status Update ===`);
  console.log(`Mode: ${FIX ? "FIX (will update programs.json)" : "DRY-RUN (report only)"}`);
  console.log(`Programs to check: ${toCheck.length} / ${activenet.length} ActiveNet entries\n`);

  let statusUpdated = 0;
  let ageMaxFilled = 0;
  let nameUpdated = 0;
  let errors = 0;
  const changes = [];
  const BATCH = 10;

  for (let i = 0; i < toCheck.length; i += BATCH) {
    const batch = toCheck.slice(i, i + BATCH);
    await Promise.all(batch.map(async (item) => {
      const result = await fetchDetail(item.slug, item.activityId);
      const detail = result?.body?.detail;
      if (!detail) {
        errors++;
        return;
      }

      const prog = programs[item.index];
      const oldStatus = prog.enrollmentStatus;

      // --- Status update ---
      const newStatus = mapStatus(detail);
      if (newStatus && newStatus !== oldStatus) {
        // Don't downgrade Completed to Open (program already ran)
        if (oldStatus === "Completed") return;
        // Don't downgrade Likely Coming Soon (prior-year data, manually set)
        if (oldStatus === "Likely Coming Soon") return;

        changes.push({
          id: prog.id,
          name: prog.name,
          from: oldStatus,
          to: newStatus,
          spaceStatus: detail.space_status,
          spaceMessage: detail.space_message || "",
        });

        if (FIX) {
          prog.enrollmentStatus = newStatus;
        }
        statusUpdated++;
      }

      // --- Name mismatch detection ---
      const apiName = (detail.activity_name || "").trim();
      if (apiName && prog.name) {
        const apiFirst10 = apiName.substring(0, 10).toLowerCase();
        const ourFirst10 = prog.name.substring(0, 10).toLowerCase();
        if (apiFirst10 !== ourFirst10 && !apiName.toLowerCase().includes(prog.name.substring(0, 10).toLowerCase()) && !prog.name.toLowerCase().includes(apiFirst10)) {
          nameUpdated++;
          if (VERBOSE || nameUpdated <= 30) {
            console.log(`  ${prog.id}: NAME CHANGED "${prog.name}" → "${apiName}"`);
          }
          if (FIX) {
            prog.name = apiName;
            // Also update age range from API
            const newAgeMin = extractAgeMin(detail);
            const newAgeMax = extractAgeMax(detail);
            if (newAgeMin !== null) prog.ageMin = newAgeMin;
            if (newAgeMax !== null) prog.ageMax = newAgeMax;
            // Update cost if available
            if (detail.fee_amount !== undefined && detail.fee_amount !== null) {
              prog.cost = detail.fee_amount;
              prog.priceVerified = true;
            }
          }
        }
      }

      // --- ageMax extraction ---
      if (prog.ageMax === null || prog.ageMax === undefined) {
        const ageMax = extractAgeMax(detail);
        if (ageMax !== null && ageMax > 0 && (prog.ageMin === null || ageMax >= prog.ageMin)) {
          if (FIX) {
            prog.ageMax = ageMax;
          }
          ageMaxFilled++;
          if (VERBOSE) {
            console.log(`  ${prog.id}: ageMax set to ${ageMax} from "${detail.age_restriction}"`);
          }
        }
      }
    }));

    // Progress logging
    const checked = Math.min(i + BATCH, toCheck.length);
    if (checked % 500 < BATCH || checked === toCheck.length) {
      console.log(`Progress: ${checked}/${toCheck.length} — Status changes: ${statusUpdated}, ageMax fills: ${ageMaxFilled}, Errors: ${errors}`);
    }
    await new Promise(r => setTimeout(r, 200)); // Rate limit between batches
  }

  // --- Report ---
  console.log(`\n=== RESULTS ===`);
  console.log(`Checked: ${toCheck.length}`);
  console.log(`Status changes: ${statusUpdated}`);
  console.log(`Name updates: ${nameUpdated}`);
  console.log(`ageMax filled: ${ageMaxFilled}`);
  console.log(`API errors: ${errors}`);

  if (changes.length > 0) {
    console.log(`\nStatus changes${FIX ? " (applied)" : " (dry-run, use --fix to apply)"}:`);
    // Group by transition type
    const transitions = {};
    changes.forEach(c => {
      const key = `${c.from} → ${c.to}`;
      transitions[key] = (transitions[key] || 0) + 1;
    });
    Object.entries(transitions).sort((a, b) => b[1] - a[1]).forEach(([t, count]) => {
      console.log(`  ${t}: ${count}`);
    });

    // Show first 30 individual changes
    if (VERBOSE || changes.length <= 30) {
      console.log(`\nDetailed changes:`);
      changes.slice(0, 50).forEach(c => {
        console.log(`  ${c.id}: ${c.from} → ${c.to} (${c.spaceStatus}, "${c.spaceMessage}")`);
      });
      if (changes.length > 50) console.log(`  ... and ${changes.length - 50} more`);
    }
  }

  // --- Save ---
  if (FIX && (statusUpdated > 0 || ageMaxFilled > 0 || nameUpdated > 0)) {
    fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2) + "\n");
    console.log(`\n✅ Updated programs.json (${statusUpdated} status + ${nameUpdated} names + ${ageMaxFilled} ageMax)`);
  } else if (!FIX && (statusUpdated > 0 || ageMaxFilled > 0 || nameUpdated > 0)) {
    console.log(`\n⚠️  Dry run — use --fix to apply ${statusUpdated + ageMaxFilled + nameUpdated} changes`);
  } else {
    console.log(`\n✅ No changes needed`);
  }
}

main().catch(console.error);
