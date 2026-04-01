#!/usr/bin/env node
/**
 * Auto-resolve program violations using offline inference + optional web checks.
 *
 * Applies fixes that go BEYOND what validate-programs.cjs --fix already does:
 *   - R2:    Infer repeating=true from date span + days pattern
 *   - R7:    Mark isEstimate=true when price can't be confirmed
 *   - R11:   Look up address from same-provider programs (internal consistency)
 *   - R11:   Look up address from known facility map
 *   - R29:   Try common URL subpaths via HTTP HEAD (online mode)
 *   - R32:   Reconstruct specific ActiveNet URL from keyword
 *
 * Everything handled by validate --fix (R3, R5, R8, R14, R20, R22, R26, R27,
 * R28, R33) is intentionally left to that tool. Run it first.
 *
 * Usage:
 *   node scripts/auto-resolve-violations.cjs [--ids=id1,id2,...] [--offline] [--report]
 *   node scripts/auto-resolve-violations.cjs --all [--offline] [--report]
 *
 *   --ids=...   Comma-separated IDs to target (default: all programs)
 *   --offline   Skip HTTP requests — fast mode for pre-commit hook
 *   --report    Dry-run: show what would change, don't write programs.json
 *
 * Exit codes:
 *   0 = all targeted violations resolved (or none)
 *   1 = some violations remain after all resolution attempts
 *
 * Output (JSON to stdout when --json flag given, human-readable otherwise):
 *   { resolved: number, unresolvable: [{id, violations: [...]}] }
 */

const fs   = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ── CLI flags ──────────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const OFFLINE = args.includes("--offline");
const REPORT  = args.includes("--report");
const JSON_OUT = args.includes("--json");

const idsArg = args.find(a => a.startsWith("--ids="));
const TARGET_IDS = idsArg
  ? new Set(idsArg.replace("--ids=", "").split(",").map(s => s.trim()).filter(Boolean))
  : null; // null = all programs

const ROOT = path.join(__dirname, "..");
const programsPath = path.join(ROOT, "src", "data", "programs.json");
let programs = JSON.parse(fs.readFileSync(programsPath, "utf8"));

// ── Known facility address map ─────────────────────────────────────────────────
// Used for R11: vague city-only addresses → real street addresses
// Format: keyword (lowercased, found in provider or name) → street address
const FACILITY_MAP = {
  // Vancouver community centres
  "britannia community centre":  "1661 Napier St, Vancouver, BC V5L 4X4",
  "trout lake community centre": "3360 Victoria Dr, Vancouver, BC V5N 4M4",
  "kensington community centre": "5065 Dumfries St, Vancouver, BC V5P 3A9",
  "sunset community centre":     "6810 Main St, Vancouver, BC V5X 3J6",
  "renfrew community centre":    "2929 E 22nd Ave, Vancouver, BC V5M 2Y3",
  "hastings community centre":   "3096 E Hastings St, Vancouver, BC V5K 2A3",
  "kiwassa neighbourhood house": "2425 Oxford St, Vancouver, BC V5K 1M7",
  "the cultch":                  "1895 Venables St, Vancouver, BC V5L 2H6",
  "roundhouse community centre": "181 Roundhouse Mews, Vancouver, BC V6Z 2W3",
  "strathcona community centre": "601 Keefer St, Vancouver, BC V6A 3V8",
  "marpole-oakridge community":  "990 W 59th Ave, Vancouver, BC V6P 1X4",
  "fraserview community centre": "8240 Fraser St, Vancouver, BC V5X 3X2",
  "langara":                     "100 W 49th Ave, Vancouver, BC V5Y 2Z6",
  "killarney community centre":  "6260 Killarney St, Vancouver, BC V5S 4C4",
  "champlain heights":           "3350 Maquinna Dr, Vancouver, BC V5S 4C1",
  "hillcrest community centre":  "4575 Clancy Loranger Way, Vancouver, BC V5Y 2M4",
  "douglas park community":      "801 W 22nd Ave, Vancouver, BC V5Z 1Z1",
  "riley park community centre": "50 E 30th Ave, Vancouver, BC V5V 2T9",

  // Burnaby community centres
  "bonsor recreation complex":   "6550 Bonsor Ave, Burnaby, BC V5H 3G4",
  "edmonds community centre":    "7282 Kingsway, Burnaby, BC V5E 1G3",
  "cameron community centre":    "9523 Cameron St, Burnaby, BC V3J 1L6",
  "confederation park":          "4585 Albert St, Burnaby, BC V5C 2G8",
  "burnaby lake sports complex": "3883 Pavilion Ct, Burnaby, BC V5A 4M4",
  "eileen dailly":               "240 Willingdon Ave, Burnaby, BC V5C 5H6",

  // North Vancouver
  "karen magnussen":             "2010 Lions Gate Lonsdale Ave, North Vancouver, BC V7M 2J6",
  "harry jerome recreation":     "123 E 23rd St, North Vancouver, BC V7L 3K6",
  "delbrook community recreation": "600 W Queens Rd, North Vancouver, BC V7N 2K3",
  "capilano north shore":        "905 W Queens Rd, North Vancouver, BC V7N 2K3",
  "parkgate community centre":   "3625 Banff Ct, North Vancouver, BC V7H 2T3",

  // Richmond
  "richmond oval":               "6111 River Rd, Richmond, BC V7C 0A2",
  "minoru centre":               "7191 Granville Ave, Richmond, BC V6Y 1N9",
  "minoru arena":                "7551 Minoru Gate, Richmond, BC V6Y 1R8",
  "south arm community":         "11120 Mellis Dr, Richmond, BC V6X 1L8",
  "steveston community centre":  "4111 Moncton St, Richmond, BC V7E 3A8",

  // Coquitlam / Port Coquitlam / Port Moody
  "pi recreation complex":       "2150 Salisbury Ave, Port Coquitlam, BC V3B 4K9",
  "gates park":                  "2511 Reeve St, Port Coquitlam, BC V3C 6M1",
  "recreation complex coquitlam": "633 Poirier St, Coquitlam, BC V3J 6A9",
  "inlet theatre":               "100 Newport Dr, Port Moody, BC V3H 5C3",

  // Surrey
  "north surrey recreation":     "10275 135th St, Surrey, BC V3T 4C8",
  "chuck bailey recreation":     "13458 107A Ave, Surrey, BC V3T 2C7",
  "fleetwood community centre":  "7225 148th St, Surrey, BC V3S 3E4",

  // West Vancouver
  "west vancouver community centre": "2121 Marine Dr, West Vancouver, BC V7V 4Y2",
  "gleneagles community centre": "6262 Marine Dr, West Vancouver, BC V7W 2T1",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
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

function isCityOnlyAddress(addr) {
  if (!addr) return false;
  return /^[A-Za-z\s]+,\s*(BC|British Columbia)(\s+\w+)?$/i.test(addr.trim())
    && !/\d/.test(addr); // no street number = city-only
}

// ── R2: Infer repeating=true from schedule ────────────────────────────────────
function resolveR2(p) {
  if (p.repeating) return false; // already set
  if (!p.startDate || !p.endDate) return false;
  const start = new Date(p.startDate + "T00:00:00");
  const end   = new Date(p.endDate   + "T00:00:00");
  const span  = (end - start) / (1000 * 60 * 60 * 24);
  if (span <= 35) return false; // short program, not a repeating schedule

  if (!p.days) return false;
  const d = (p.days || "").toLowerCase();
  // Patterns that clearly indicate a recurring weekly schedule
  const recurringPatterns = [
    "mon-fri", "monday-friday", "mon–fri",
    "weekly", "every week",
    /\b(mon|tue|wed|thu|fri|sat|sun)\b/,
    "saturdays", "sundays", "mondays", "tuesdays", "wednesdays", "thursdays", "fridays",
  ];
  const matches = recurringPatterns.some(pat =>
    typeof pat === "string" ? d.includes(pat) : pat.test(d)
  );
  if (!matches) return false;

  p.repeating = true;
  return true;
}

// ── R7: Mark as estimate when price can't be confirmed ────────────────────────
// Only applied if confirmed2026=true, priceVerified=false, cost is set, not already estimate
function resolveR7(p) {
  if (p.confirmed2026 !== true) return false;
  if (p.priceVerified !== false) return false;
  if (p.cost === null || p.cost === undefined) return false;
  if (p.isEstimate === true) return false;

  p.isEstimate = true;
  if (!p.costNote) p.costNote = "Estimated from prior year pricing — verify before registering";
  return true;
}

// ── R11: Address lookup from same-provider programs ───────────────────────────
function resolveR11Internal(p, allPrograms) {
  if (!isCityOnlyAddress(p.address)) return false;

  // Find other programs from same provider with a real address
  const sameProvider = allPrograms.filter(
    q => q.id !== p.id
      && q.provider === p.provider
      && q.address
      && !isCityOnlyAddress(q.address)
      && /\d/.test(q.address) // has a street number
  );
  if (sameProvider.length === 0) return false;

  // If all have the same address, use it
  const addresses = [...new Set(sameProvider.map(q => q.address))];
  if (addresses.length === 1) {
    p.address = addresses[0];
    return true;
  }

  // If there's a single dominant address (>= 60% of programs), use it
  const counts = {};
  sameProvider.forEach(q => { counts[q.address] = (counts[q.address] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (sorted[0][1] / sameProvider.length >= 0.6) {
    p.address = sorted[0][0];
    return true;
  }

  return false;
}

// ── R11: Address lookup from known facility map ────────────────────────────────
function resolveR11Facility(p) {
  if (!isCityOnlyAddress(p.address)) return false;

  const searchText = [p.provider || "", p.name || "", p.address || ""].join(" ").toLowerCase();
  for (const [keyword, address] of Object.entries(FACILITY_MAP)) {
    if (searchText.includes(keyword)) {
      p.address = address;
      return true;
    }
  }
  return false;
}

// ── R29/R32: URL resolution via HTTP HEAD ─────────────────────────────────────
// Only runs in online mode. Returns a promise.
function resolveUrlOnline(p) {
  return new Promise(resolve => {
    if (!p.registrationUrl) { resolve(false); return; }

    let url;
    try { url = new URL(p.registrationUrl); }
    catch (e) { resolve(false); return; }

    const pathOnly = url.pathname.replace(/\/+$/, "");

    // R29: generic homepage — try common program subpaths
    if (pathOnly === "" || pathOnly === "/home" || pathOnly === "/index.html") {
      const candidates = [
        "/programs", "/register", "/camps", "/activities",
        "/youth", "/kids", "/registration", "/programs/register",
        "/summer", "/summer-camps", "/programs/youth",
      ];
      tryPaths(url, candidates, 0, (found) => {
        if (found) { p.registrationUrl = found; resolve(true); }
        else resolve(false);
      });
      return;
    }

    // R32: ActiveNet generic search page
    if (url.hostname.includes("activecommunities.com") &&
        url.pathname.includes("/activity/search") &&
        !url.pathname.includes("/detail/")) {
      // Try to extract keyword from URL and construct a search with it
      const kwMatch = url.search.match(/[?&]activity_keyword=([^&]+)/i);
      if (kwMatch) {
        // Already has a keyword filter — this is as specific as we can get
        resolve(false);
        return;
      }
      // Try to append provider-specific keyword from program name
      const keyword = encodeURIComponent((p.name || "").split(" ").slice(0, 3).join(" "));
      if (keyword) {
        const sep = url.search ? "&" : "?";
        p.registrationUrl = p.registrationUrl.replace(/[?#].*$/, "") + `?activity_keyword=${keyword}`;
        resolve(true);
        return;
      }
      resolve(false);
      return;
    }

    resolve(false);
  });
}

function tryPaths(baseUrl, candidates, idx, callback) {
  if (idx >= candidates.length) { callback(null); return; }
  const testUrl = `${baseUrl.protocol}//${baseUrl.host}${candidates[idx]}`;
  headRequest(testUrl, (ok) => {
    if (ok) callback(testUrl);
    else tryPaths(baseUrl, candidates, idx + 1, callback);
  });
}

function headRequest(url, callback) {
  const mod = url.startsWith("https") ? require("https") : require("http");
  const timeout = 3000; // 3s per request
  try {
    const req = mod.request(url, { method: "HEAD", timeout }, (res) => {
      callback(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on("timeout", () => { req.destroy(); callback(false); });
    req.on("error", () => callback(false));
    req.end();
  } catch (e) {
    callback(false);
  }
}

// ── Run validator and parse violations for specific IDs ────────────────────────
function getViolationsForIds(ids) {
  let output = "";
  try {
    execSync(`node "${path.join(__dirname, "validate-programs.cjs")}"`, {
      cwd: ROOT, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"]
    });
    return {}; // exit 0 = no violations
  } catch (e) {
    output = (e.stdout || "") + (e.stderr || "");
  }

  const violations = {}; // id → [{rule, msg}]
  for (const line of output.split("\n")) {
    const m = line.match(/^\[R(\w+)\]\s+id=([^:]+):\s+(.+)$/);
    if (!m) continue;
    const [, rule, rawId, msg] = m;
    const id = rawId.trim();
    if (!ids || ids.has(id)) {
      if (!violations[id]) violations[id] = [];
      violations[id].push({ rule, msg: msg.trim() });
    }
  }
  return violations;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  const targeted = TARGET_IDS
    ? programs.filter(p => TARGET_IDS.has(String(p.id)))
    : programs;

  if (targeted.length === 0) {
    if (!JSON_OUT) console.log("No programs matched the given IDs.");
    if (JSON_OUT) process.stdout.write(JSON.stringify({ resolved: 0, unresolvable: [] }));
    process.exit(0);
  }

  if (!JSON_OUT) {
    console.log(`\n=== AUTO-RESOLVE VIOLATIONS ===`);
    console.log(`Targeting: ${TARGET_IDS ? targeted.length + " programs" : "all " + programs.length + " programs"}`);
    console.log(`Mode: ${OFFLINE ? "offline" : "offline + HTTP checks"} | ${REPORT ? "REPORT (dry run)" : "FIX"}\n`);
  }

  let resolved = 0;
  const changes = [];

  for (const p of targeted) {
    const id = String(p.id);
    const fixes = [];

    if (resolveR2(p))              fixes.push("R2: set repeating=true");
    if (resolveR7(p))              fixes.push("R7: marked as estimate");
    if (resolveR11Facility(p))     fixes.push("R11: address from facility map");
    else if (resolveR11Internal(p, programs)) fixes.push("R11: address from same-provider programs");

    if (!OFFLINE) {
      const urlFixed = await resolveUrlOnline(p);
      if (urlFixed) fixes.push(`R29/R32: URL updated to ${p.registrationUrl}`);
    }

    if (fixes.length > 0) {
      resolved += fixes.length;
      changes.push({ id, fixes });
      if (!JSON_OUT) {
        console.log(`  id=${id}: ${fixes.join("; ")}`);
      }
    }
  }

  if (!REPORT) {
    fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2));
  }

  // Re-check violations for targeted programs
  const remainingViolations = getViolationsForIds(TARGET_IDS);
  const unresolvable = Object.entries(remainingViolations).map(([id, violations]) => ({
    id, violations
  }));

  if (!JSON_OUT) {
    console.log(`\n=== AUTO-RESOLVE SUMMARY ===`);
    console.log(`Fixes applied: ${resolved}`);
    if (changes.length > 0) {
      console.log(`Programs fixed:`);
      changes.forEach(({ id, fixes }) => console.log(`  id=${id}: ${fixes.join("; ")}`));
    }
    if (unresolvable.length > 0) {
      console.log(`\nUnresolvable violations (${unresolvable.length} programs):`);
      unresolvable.forEach(({ id, violations }) => {
        violations.forEach(v => console.log(`  [R${v.rule}] id=${id}: ${v.msg}`));
      });
    } else {
      console.log(`All targeted violations resolved.`);
    }
    if (!REPORT && resolved > 0) {
      console.log(`\nprograms.json saved.`);
    }
    console.log("");
  } else {
    process.stdout.write(JSON.stringify({ resolved, unresolvable }));
  }

  process.exit(unresolvable.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error("auto-resolve-violations.cjs failed:", err.message);
  process.exit(1);
});
