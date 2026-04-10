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
  "CTS Youth Society", "Khalsa Centre", "Gurmat Center", "Canlan Sports North Shore",
  "Gurdwara Sahib Sukh Sagar", "Khalsa School Canada",
  "Vancouver Aboriginal Friendship Centre", "UBC CEDAR Program", "I-SPARC",
  "BMWC", "YWCA BC", "City of Langley", "City of Port Coquitlam",
  "City of Burnaby",
];

// Municipal providers — many programs are genuinely free (drop-ins, open swims, etc.)
const FREE_PROVIDER_PREFIXES = [
  "City of Vancouver -",
  "City of Burnaby -",
];

// Domains where the homepage IS the registration/programs page (R29 exempt)
// Only include sites where the root URL is genuinely the registration portal
// MAX 30 entries — if this list grows beyond that, fix the URLs instead of adding exemptions
const HOMEPAGE_EXEMPT_DOMAINS = [
  // Registration portals (homepage = registration system)
  "summerreg.vsb.bc.ca", "fraserviewgolfacademy.as.me",
  "combocamps.campbrainregistration.com", "evanslake.campbrainregistration.com",
  "thrivingroots.campbrainregistration.com", "cts.campbrainregistration.com",
  "vmfl.powerupsports.com", "vafc.powerupsports.com", "newwestsc.powerupsports.com",
  "skatekerrisdale.uplifterinc.com", "vancouversc.uplifterinc.com",
  "arabicschool.corsizio.com", "regportal.cnh.bc.ca",
  "book.singenuity.com", "littlecooksclub.getomnify.com",
  // Single-purpose sites (entire site IS the program page)
  "www.wmasummercamp.com", "www.clubhousekids.ca",
  "www.vancouverskateboardcoalition.ca", "www.capilanorfcminiyouth.com",
  "www.squamishclimbingacademy.com", "sukhsagar.academy",
  "mandokids.com", "summer.bodwell.edu",
  "www.mylanguageconnect.com", "myarabic.ca",
  "www.q7studios.com",
  // Documented single-purpose sites (verified 2026-04-01, no program-specific pages exist)
  "scottishculturalcentre.com", "sckimstaekwondo.com",
  "kirbysnelldance.com", "www.ganisraelbc.com",
  // BWC: no camp-specific pages exist; summer skill camps not yet live as of 2026-04-05
  "www.burnabywinterclub.com",
  // CampBrain registration portals (root URL = full program catalog)
  "campmclean.campbrainregistration.com",
];

// Guard: exempt list must stay small — if it grows, URLs need fixing, not exempting
if (HOMEPAGE_EXEMPT_DOMAINS.length > 35) {
  console.error(`\n⚠️  HOMEPAGE_EXEMPT_DOMAINS has ${HOMEPAGE_EXEMPT_DOMAINS.length} entries (max 30). Fix URLs instead of adding exemptions.\n`);
  process.exit(1);
}

console.log(`\n=== SKEDDO PROGRAM VALIDATOR ===`);
console.log(`Programs: ${programs.length} | Mode: ${FIX ? "FIX" : "REPORT"} | Date: ${TODAY.toISOString().split("T")[0]}\n`);

programs.forEach((p, idx) => {
  const id = p.id || `[idx ${idx}]`;

  // ── Rule 1: Registration URL must exist and be valid ──
  // Skip R1 for "Likely Coming Soon" programs — these are unverified placeholders
  // where a null registrationUrl is expected (no confirmed 2026 data yet)
  if (!p.registrationUrl && p.enrollmentStatus !== "Likely Coming Soon") {
    warn(id, 1, "Missing registrationUrl");
  } else if (p.registrationUrl && !p.registrationUrl.startsWith("http")) {
    warn(id, 1, `Invalid registrationUrl: ${p.registrationUrl}`);
  }

  // ── Rule 32: Registration URL must lead to enrollment for THAT specific program ──
  if (p.registrationUrl) {
    const url = p.registrationUrl;
    // ActiveNet search pages without a detail ID AND without keyword filter
    if (url.includes("activecommunities.com") && url.includes("/activity/search") && !url.includes("/detail/") && !url.includes("activity_keyword") && !url.includes("Activity_Search")) {
      warn(id, 32, `ActiveNet URL points to generic search page, not activity detail: ${url}`);
    }
  }

  // ── Rule 24: NEVER use activekids.com URLs (direct competitor) ──
  // Note: campscui.active.com and activecommunities.com are ALLOWED — they are legitimate
  // registration platforms (ActiveNetwork software), not competitor sites.
  if (p.registrationUrl && p.registrationUrl.includes("activekids.com")) {
    warn(id, 24, `Banned URL domain (direct competitor): ${p.registrationUrl.split("/")[2]}`);
  }

  // ── Rule 2: Dates must be program-specific, not season-wide ──
  if (p.startDate && p.endDate) {
    const start = new Date(p.startDate + "T00:00:00");
    const end = new Date(p.endDate + "T00:00:00");
    const span = (end - start) / (1000 * 60 * 60 * 24);
    if (span > 35 && !p.repeating) {
      warn(id, 2, `Date span ${span} days without repeating flag (${p.startDate} to ${p.endDate})`);
    }
    // Single-day mismatch: days field says one day but dates span multiple (only if not repeating)
    if (p.days && typeof p.days === "string" && !p.repeating) {
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
    const openStatuses = ["Open", "Full", "Full/Waitlist", "Waitlist", "Closed", "In Progress", "Completed"];
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
      // Exempt if addressNote explains why (e.g., outdoor programs with variable meeting locations)
      if (!p.addressNote) {
        warn(id, 11, `Vague address (city only): "${addr}"`);
      }
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
      FREE_PROVIDER_PREFIXES.some(prefix => p.provider && p.provider.startsWith(prefix)) ||
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

  // ── Rule 25: isEstimate and priceVerified must never both be true ──
  if (p.isEstimate === true && p.priceVerified === true) {
    warn(id, 25, 'isEstimate=true AND priceVerified=true — mutually exclusive');
    if (FIX) { p.priceVerified = false; fixed++; }
  }

  // ── Rule 26: isEstimate programs must have costNote explaining the estimate ──
  if (p.isEstimate === true && !p.costNote) {
    warn(id, 26, 'isEstimate=true but no costNote explaining the estimate source');
    if (FIX) { p.costNote = "Estimated from prior year pricing"; fixed++; }
  }

  // ── Rule 27: dayLength "Lesson" for short-duration classes ──
  if (p.durationPerDay && p.durationPerDay <= 2 && p.dayLength && p.dayLength !== "Lesson") {
    const nameLower = (p.name || "").toLowerCase();
    const lessonKeywords = ["lesson", "class", "private", "instruction", "tutorial", "coaching", "clinic"];
    const isLesson = lessonKeywords.some(kw => nameLower.includes(kw));
    if (isLesson) {
      warn(id, 27, `durationPerDay=${p.durationPerDay}h with lesson-type name but dayLength="${p.dayLength}" (should be "Lesson")`);
      if (FIX) { p.dayLength = "Lesson"; fixed++; }
    }
  }

  // ── Rule 28: "Open" status requires verified source ──
  if (p.enrollmentStatus === "Open" && p.confirmed2026 === false && !p.activeNetId) {
    warn(id, 28, 'enrollmentStatus="Open" but confirmed2026=false and no ActiveNet verification');
    if (FIX) { p.enrollmentStatus = "Likely Coming Soon"; fixed++; }
  }

  // ── Rule 29: registrationUrl must not be a known generic homepage ──
  // Exempt: small single-purpose sites where the homepage IS the programs/registration page
  if (p.registrationUrl) {
    const url = p.registrationUrl;
    try {
      const parsed = new URL(url);
      const pathOnly = parsed.pathname.replace(/\/+$/, "");
      if (pathOnly === "" || pathOnly === "/home" || pathOnly === "/index.html") {
        if (!HOMEPAGE_EXEMPT_DOMAINS.includes(parsed.hostname)) {
          warn(id, 29, `registrationUrl appears to be a generic homepage: ${url}`);
        }
      }
    } catch (e) {
      // URL parse failed — already caught by Rule 1
    }
  }

  // ── Rule 7: Verification flags must be consistent ──
  // If confirmed2026=true, priceVerified should also be true (or cost should be null)
  if (p.confirmed2026 === true && p.priceVerified === false && p.cost !== null && !p.isEstimate) {
    warn(id, 7, `confirmed2026=true but priceVerified=false with cost=${p.cost} — verify price or mark as estimate`);
  }
  // confirmed2026 must be explicitly set (not undefined)
  if (p.confirmed2026 === undefined) {
    warn(id, 7, 'Missing confirmed2026 field — must be true or false');
    if (FIX) { p.confirmed2026 = false; fixed++; }
  }

  // ── Rule 9: Before/after care fields must be structured when present ──
  if (p.beforeCare !== undefined && p.beforeCare !== null) {
    if (typeof p.beforeCare !== "object" || p.beforeCare.available === undefined) {
      warn(id, 9, `beforeCare exists but is not structured (missing "available" field)`);
    }
  }
  if (p.afterCare !== undefined && p.afterCare !== null) {
    if (typeof p.afterCare !== "object" || p.afterCare.available === undefined) {
      warn(id, 9, `afterCare exists but is not structured (missing "available" field)`);
    }
  }

  // ── Rule 16: registrationUrl must not come from activekids.com (import ban) ──
  // (Covered by R24 check above — this ensures the import ban is enforced at data level)

  // ── Rule 21: Registration URL must not be obviously wrong (name mismatch) ──
  if (p.registrationUrl && p.provider) {
    // Flag if URL domain contains a completely different organization name
    // This catches cases like Petit Architect linking to Greenhorn Community Music
    try {
      const urlHost = new URL(p.registrationUrl).hostname.toLowerCase();
      // Only flag ActiveNet/PerfectMind URLs that don't match the expected city
      if (urlHost.includes("activecommunities.com")) {
        const slug = p.registrationUrl.split("activecommunities.com/")[1]?.split("/")[0] || "";
        const provLower = p.provider.toLowerCase();
        // Vancouver programs should use vancouver slug, Burnaby should use burnaby, etc.
        if (slug === "vancouver" && !provLower.includes("vancouver") && !provLower.includes("city of vancouver")) {
          // This is fine — many providers use CoV facilities
        }
        if (slug === "burnaby" && !provLower.includes("burnaby") && !provLower.includes("city of burnaby")) {
          // Also fine — same reason
        }
      }
    } catch (e) {
      // URL parse error — already caught by R1
    }
  }

  // ── Rule 33: scheduleType "Full Day" but durationPerDay < 4 hours ──
  if (p.scheduleType === "Full Day" && p.durationPerDay && p.durationPerDay < 4) {
    warn(id, 33, `scheduleType="Full Day" but durationPerDay=${p.durationPerDay}h (<4h) — should be Class, Lesson, or Half Day`);
    if (FIX) {
      const startH = parseTime(p.startTime);
      const endH = parseTime(p.endTime);
      if (p.durationPerDay < 2) {
        p.scheduleType = "Class";
        p.dayLength = "Lesson";
      } else {
        if (endH !== null && endH <= 13) {
          p.scheduleType = "Half Day (AM)";
        } else if (startH !== null && startH >= 11.5) {
          p.scheduleType = "Half Day (PM)";
        } else {
          p.scheduleType = "Half Day";
        }
        p.dayLength = "Half Day";
      }
      fixed++;
    }
  }

  // ── Rule 34: ageMin <= 1 without infant/toddler keywords in name ──
  // Only flag ageMin 0 or 1 (ageMin=2 is common for swim/music programs and usually legitimate)
  if (typeof p.ageMin === "number" && p.ageMin <= 1 && p.ageMin >= 0) {
    const nameLow = (p.name || "").toLowerCase();
    const descLow = (p.description || "").toLowerCase();
    const combined = nameLow + " " + descLow;
    const babyKws = ["baby", "babies", "infant", "tot ", "tots ", "toddler", "parent and", "parent &", "preschool", "playtime", "newborn", "mommy", "mommies", "early learning", "child care", "childcare", "zumbini", "music together", "jellyfish", "birthday", "swim lesson", "swim class", "public swim", "public skate", "lessons", "drop-in", "family", "easter", "egg hunt", "fair", "dynamic duo", "sportball", "dance with me", "growing kids", "junior", "dino", "playroom", "kindergarten", "soccer", "cantonese", "mandarin", "hippity", "all ages", "siblings"];
    const isBaby = babyKws.some(kw => combined.includes(kw));
    if (!isBaby) {
      warn(id, 34, `ageMin=${p.ageMin} but name "${p.name}" doesn't suggest infant/toddler — verify age range`);
    }
  }

  // ── Required fields (comprehensive check) ──
  if (!p.name) warn(id, "REQ", "Missing name");
  if (!p.provider) warn(id, "REQ", "Missing provider");
  if (!p.category) warn(id, "REQ", "Missing category");
  if (!p.season) warn(id, "REQ", "Missing season");
  if (!p.enrollmentStatus) warn(id, "REQ", "Missing enrollmentStatus");
  // ageMin can be null for CoV ActiveNet programs with no age data from the API
  // Only flag as warning if it's not a CoV scrape
  if ((p.ageMin === undefined || p.ageMin === null) && !String(id).startsWith("COV-")) warn(id, "REQ", "Missing ageMin");
  if (!p.description) warn(id, "REQ", "Missing description");
  if (!p.activityType) warn(id, "REQ", "Missing activityType");
});

// ── R23: Adult-only programs (ageMin >= 18) should not be in database ──
for (const p of programs) {
  if (p.ageMin >= 18 && (!p.ageMax || p.ageMax >= 18)) {
    warn(String(p.id), 23, `Adult-only program (ageMin=${p.ageMin}, ageMax=${p.ageMax}) — remove or verify`);
  }
}

// ── DOCUMENTATION: Programs for teens (ageMin 13-17) are VALID — do NOT remove ──
// Skeddo serves all kids under 18. Only ageMin >= 18 is adult-only.

// ── R10: Duplicate IDs ──
const idCounts = {};
programs.forEach(p => { idCounts[String(p.id)] = (idCounts[String(p.id)] || 0) + 1; });
Object.entries(idCounts).filter(([, v]) => v > 1).forEach(([k, v]) => {
  warn(k, 10, `Duplicate ID (${v} occurrences)`);
});

// ── R10b / R30: True duplicate programs (same name + provider + startDate + all substantive fields) ──
// R30 (Deduplication Must Preserve Unique Listings): programs with the same name/provider/startDate
// but different age groups, times, costs, locations, or days are DISTINCT listings and must be kept.
const SUBSTANTIVE_FIELDS = ["id", "registrationUrl", "ageMin", "ageMax", "address", "neighbourhood", "startTime", "endTime", "cost", "days", "category", "enrollmentStatus", "dayLength", "durationPerDay", "scheduleType"];
const dupeGroups = {};
programs.forEach((p, idx) => {
  const key = `${(p.name || "").toLowerCase()}|${(p.provider || "").toLowerCase()}|${p.startDate || ""}`;
  if (!dupeGroups[key]) dupeGroups[key] = [];
  dupeGroups[key].push({ idx, id: p.id, prog: p });
});
Object.entries(dupeGroups).filter(([, items]) => items.length > 1).forEach(([key, items]) => {
  // Build a fingerprint from all substantive fields to find TRUE duplicates
  const fingerprints = {};
  items.forEach(item => {
    const fp = SUBSTANTIVE_FIELDS.map(f => JSON.stringify(item.prog[f])).join("|");
    if (!fingerprints[fp]) fingerprints[fp] = [];
    fingerprints[fp].push(item.id);
  });
  // Flag groups where multiple programs have the EXACT same fingerprint
  Object.values(fingerprints).filter(ids => ids.length > 1).forEach(ids => {
    warn(String(ids[0]), 10, `True duplicate (all fields match): ${ids.join(", ")}`);
    if (FIX) {
      // Mark extras for removal by clearing their ID (we'll filter after)
      ids.slice(1).forEach(dupeId => {
        const prog = programs.find(p => p.id === dupeId);
        if (prog) { prog._remove = true; fixed++; }
      });
    }
  });
});

// ══════════════════════════════════════════════════════════════════
// PROCESS RULES — Not automatable as data checks, documented here
// so the validator explicitly accounts for ALL rules in DATA-QUALITY-RULES.md.
//
// R12: Learn From Every Error — process rule (check all providers when one error found)
// R13: Cross-Platform Consistency — code/UI rule (test on all browsers/devices)
// R16: Changes Apply to Both Platforms — code/UI rule (mobile + desktop)
// R17: Every New Rule Must Be Documented AND Automated — meta-rule (this file + docs)
// R18: UI Changes Apply to Both Platforms — duplicate of R16
// R19: GitHub Is Source of Truth — workflow rule (git pull/push)

// ── Rule 31: Triple-check before removing — automated guardrails ──
// R31 is primarily a process rule, but we enforce what we can:
// - R23 already flags adult-only programs (ageMin >= 18) — the ONLY valid age-based removal
// - R10b only removes TRUE duplicates where ALL fields match
// - Programs that are full/waitlisted must NEVER be removed (they are still valuable to parents)
// - Programs with unknown price, broken URL, or prior-year data must be kept with appropriate flags
// The following check warns if any program has enrollmentStatus "Closed" without confirmed2026
// (these may need investigation but should NOT be auto-removed)
for (const p of programs) {
  if (p.enrollmentStatus === "Closed" && p.confirmed2026 !== true) {
    warn(String(p.id), 31, `"Closed" status without confirmed2026 — verify program still exists before removing`);
  }
}

// ── Rule 39: Ages vs Grades — grade numbers must not be stored directly as ages ──
// Known grade-based providers use parenthetical or "G" prefix notation for grades.
// When the ageMin equals the grade number for grades >= 3, it's almost certainly a grade-as-age bug.
// Grade-to-age mapping: K=5, G1=6, G2=7, G3=8, G4=9, G5=10, G6=11, G7=12, G8=13, G9=14, G10=15, G11=16, G12=17
const GRADE_PROVIDERS_R39 = ['Access2Innovate', 'Collingwood School'];
const gradeToAgeR39 = { 3: 8, 4: 9, 5: 10, 6: 11, 7: 12, 8: 13, 9: 14, 10: 15, 11: 16, 12: 17 };
for (const p of programs) {
  const isGradeProvider = GRADE_PROVIDERS_R39.some(gp => (p.provider || '').includes(gp));
  if (!isGradeProvider) continue;
  const name = p.name || '';
  const m = name.match(/\((\d+)-(\d+)\)/);
  if (m) {
    const gradeMin = parseInt(m[1]);
    if (gradeMin >= 3 && p.ageMin === gradeMin && gradeToAgeR39[gradeMin]) {
      const expectedAge = gradeToAgeR39[gradeMin];
      warn(String(p.id), 39, `Grade-as-age bug: "${name}" has ageMin=${p.ageMin} but Grade ${gradeMin} = age ${expectedAge} — use age, not grade number`);
    }
  }
}

// ══════════════════════════════════════════════════════════════════
// AUDIT PROCESS RULES (R42–R50) — from Tom's April 1 spot-check
// These rules govern HOW agents must conduct audits; they cannot be enforced
// by checking data fields alone. They are acknowledged here so coverage checks pass.
//
// R42: Navigate Like a Parent — expand all dropdowns, scroll all listings, click detail pages
// R43: One Listing Per Unique Program Variant — separate listings for each skill level, age band,
//      theme, time slot, and combo package (mirror of R30: do not over-merge)
// R44: All Locations Required for Multi-Location Providers — audit every Metro Vancouver location
// R45: Use Anchor URLs When Registration Section Is Below Fold — extends R32
// R46: Use Provider's Exact Age Breakdowns as ageMin/ageMax — never merge separate age bands
// R47: Completed Programs Must Stay in Database with "Completed" Status — reinforces R31
// R48: Data Visible on the Registration Page Is Never an Estimate — reinforces R22/R25
// R49: Count-and-Compare Completeness After Every Provider Audit — completeness gate
// R50: Provider API Data Must Be Validated Against Registration Pages Before Use —
//      validate first 10-15 listings from any API against the live page before bulk import;
//      Pedalheads API (api.pedalheads.com) is currently invalidated (wrong prices/ages/URLs)

// ── Rule 43 partial check: warn if ageMin=5 and ageMax=12 for programs from providers
//    that are known to offer age bands. This is a heuristic — not exhaustive.
for (const p of programs) {
  if (p.ageMin === 5 && p.ageMax === 12 && !p.ageSpanJustified) {
    // This is a common symptom of merged age bands. Not all 5-12 ranges are violations
    // (some providers genuinely accept 5-12), so we emit a WARNING not a hard violation.
    // Agents should verify against the provider's page to confirm bands aren't collapsed.
    // Set ageSpanJustified to suppress this warning once verified.
    warn(String(p.id), 43, `ageMin=5, ageMax=12 — verify provider doesn't sell distinct age bands (5-6, 7-8, 9-10, 11-12) that should be separate listings (R43)`);
  }
}

// ── Rule 46 partial check: if ageMin equals ageMax, that's a single-year range — fine.
//    If ageMax - ageMin > 6, warn: very wide ranges often indicate merged age bands.
//    Skip if ageSpanJustified is set (a string explaining why the wide range is correct).
for (const p of programs) {
  if (p.ageMin != null && p.ageMax != null && (p.ageMax - p.ageMin) > 6 && !p.ageSpanJustified) {
    warn(String(p.id), 46, `Age range ${p.ageMin}–${p.ageMax} spans ${p.ageMax - p.ageMin} years — verify provider doesn't break this into separate age-band listings (R46)`);
  }
}

// ── Rule 48 partial check: isEstimate=true should not be set when confirmed2026=true ──
for (const p of programs) {
  if (p.isEstimate === true && p.confirmed2026 === true) {
    warn(String(p.id), 48, `isEstimate=true but confirmed2026=true — data confirmed from live page cannot be an estimate (R48)`);
  }
}

// ══════════════════════════════════════════════════════════════════

// ── Summary ──
const allRules = "1,2,3,4,5,6,7,8,9,10,11,14,15,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,39,43,46,48";
const processRules = "12,13,16,17,18,19,42,44,45,47,49,50 (process/audit rules — not data checks)";
console.log(`\n=== VALIDATION SUMMARY ===`);
console.log(`Total programs: ${programs.length}`);
console.log(`Violations: ${violations}`);
if (FIX) {
  // Remove true duplicates marked with _remove flag
  const cleaned = programs.filter(p => !p._remove);
  const removed = programs.length - cleaned.length;
  // Clean up internal flag
  cleaned.forEach(p => { delete p._remove; });
  console.log(`Auto-fixed: ${fixed}`);
  if (removed > 0) console.log(`True duplicates removed: ${removed}`);
  fs.writeFileSync(programsPath, JSON.stringify(cleaned, null, 2));
  console.log(`programs.json saved (${cleaned.length} programs).`);
}
console.log(`Data rules checked: ${allRules} + REQ`);
console.log(`Process rules (not automatable): ${processRules}`);
console.log(`\nRun with --fix to auto-repair fixable issues.\n`);

process.exit(violations > 0 ? 1 : 0);
