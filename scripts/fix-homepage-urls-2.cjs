/**
 * fix-homepage-urls-2.cjs
 *
 * Investigates and fixes the 311 programs in programs.json where registrationUrl
 * points to a provider's root/homepage instead of a specific registration page.
 *
 * Logic:
 *  1. Find all homepage URLs (pathname empty or /home or /index.html)
 *  2. Group by provider, check against Rule 29 exempt list
 *  3. Apply fixes for providers with known better URLs
 *  4. Report what was fixed and what needs manual attention
 *
 * Usage:
 *   node scripts/fix-homepage-urls-2.cjs          — dry run (report only)
 *   node scripts/fix-homepage-urls-2.cjs --fix     — apply fixes to programs.json
 */

const fs = require("fs");
const path = require("path");

const PROGRAMS_PATH = path.join(__dirname, "..", "src", "data", "programs.json");
const FIX = process.argv.includes("--fix");

const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, "utf8"));

// ── Rule 29 exempt domains (homepage IS the registration/programs page) ──
// Keep in sync with validate-programs.cjs HOMEPAGE_EXEMPT_DOMAINS
const HOMEPAGE_EXEMPT_DOMAINS = new Set([
  "summerreg.vsb.bc.ca", "fraserviewgolfacademy.as.me",
  "combocamps.campbrainregistration.com", "evanslake.campbrainregistration.com",
  "thrivingroots.campbrainregistration.com", "cts.campbrainregistration.com",
  "vmfl.powerupsports.com", "vafc.powerupsports.com", "newwestsc.powerupsports.com",
  "skatekerrisdale.uplifterinc.com", "vancouversc.uplifterinc.com",
  "arabicschool.corsizio.com", "regportal.cnh.bc.ca",
  "book.singenuity.com", "littlecooksclub.getomnify.com",
  "www.wmasummercamp.com", "www.clubhousekids.ca",
  "www.vancouverskateboardcoalition.ca", "www.capilanorfcminiyouth.com",
  "www.squamishclimbingacademy.com", "sukhsagar.academy",
  "mandokids.com", "summer.bodwell.edu",
  "www.mylanguageconnect.com", "myarabic.ca",
  "www.q7studios.com",
]);

function isHomepageUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const pathOnly = parsed.pathname.replace(/\/+$/, "");
    return pathOnly === "" || pathOnly === "/home" || pathOnly === "/index.html";
  } catch {
    return false;
  }
}

function getHostname(url) {
  try { return new URL(url).hostname; } catch { return ""; }
}

// ── URL fixes: providers where we found a specific registration/camps page ──
// Each entry: { match, newUrl, note, verified }
const URL_FIXES = [
  // ══════════════════════════════════════════════════════════════════
  // SPARKS ACADEMY (14 programs) — homepage → camps page
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "Sparks Academy",
    newUrl: "https://www.sparksedu.com/camps-1",
    note: "Sparks Academy camps showcase page with all current STEAM camp offerings",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // PROFESSOR PUFFIN'S CHALLENGE CLUB (14 programs) — homepage → registrations page
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "Professor Puffin's Challenge Club",
    newUrl: "https://professorpuffin.ca/registrations",
    note: "Professor Puffin direct registrations page",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // THE HIVE CLIMBING (11 programs) — homepage → youth camps page
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "The Hive Climbing",
    newUrl: "https://hiveclimbing.com/youth-kids/camps/",
    note: "The Hive youth & kids spring/summer break camps page",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // RICHMOND OLYMPIC OVAL (9 programs) — homepage → summer camps page
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "Richmond Olympic Oval",
    newUrl: "https://www.richmondoval.ca/camps/summer-camps/",
    note: "Richmond Oval summer sport camps page with all camp types",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // DRAGON ZONE PADDLING CLUB (9 programs) — homepage → community/camp info page
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "Dragon Zone Paddling Club",
    newUrl: "https://dragonzone.ca/paddle/community/",
    note: "Dragon Zone summer camp info page (actual registration via Dragon Boat BC: register.dragonboatbc.ca)",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // WEST END COMMUNITY ASSOCIATION (9 programs) — homepage → programs & registration
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "West End Community Association",
    newUrl: "https://westendcc.ca/programs-registration/",
    note: "West End Community Association programs and registration hub page",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // KITSILANO NEIGHBOURHOOD HOUSE (9 programs) — homepage → camps page
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "Kitsilano Neighbourhood House",
    newUrl: "https://www.kitshouse.org/spring-break-and-sumer-camps/",
    note: "Kits House spring break and summer camps page with all programs",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // LDS SOCIETY (8 programs) — homepage → camps page
  // (LDS = Learn. Develop. Succeed. — camps for kids with learning differences)
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "LDS Society",
    newUrl: "https://ldsociety.ca/program/camps/",
    note: "LDS Society camps page for ADHD/dyslexia-specialized programs",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // CAMP STEAM CANADA (8 programs) — homepage → summer camps locations page
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "Camp STEAM Canada",
    newUrl: "https://campsteam.ca/summer-camps/",
    note: "Camp STEAM Canada summer camps locations page (select BC city to find local camp)",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // ULTIMATE CODERS (6 programs) — homepage → Richmond BC coding camps page
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "Ultimate Coders",
    newUrl: "https://www.ultimatecoders.ca/richmond-bc-ca/programs/coding-camps",
    note: "Ultimate Coders Richmond BC location coding camps and registration page",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // CANLAN SPORTS (6 programs) — homepage → camps hub page
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "Canlan Sports",
    newUrl: "https://www.canlansports.com/camps/",
    note: "Canlan Sports camps hub page (North Shore BC location is closest Vancouver-area facility)",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // THIRD EYE MARTIAL ARTS (6 programs) — homepage → camps page
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "Third Eye Martial Arts",
    newUrl: "https://temartialarts.com/camps",
    note: "Third Eye Martial Arts dedicated spring and summer camps page",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // MACSAILING (6 programs) — homepage → summer camps page
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "MacSailing",
    newUrl: "https://www.macsailing.com/summer-camps",
    note: "MacSailing summer camps page for sailing and outdoor adventure camps",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // MOUNTAIN SKILLS ACADEMY (6 programs) — homepage → camps hub
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "Mountain Skills Academy",
    newUrl: "https://www.mountainskillsacademy.com/camps/",
    note: "Mountain Skills Academy camps hub page with all adventure camp offerings",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // MY GYM (6 programs) — generic mygym.com → Richmond BC location
  // (All Skeddo programs are at 5300 No. 3 Rd, Richmond)
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "My Gym",
    newUrl: "https://www.mygym.com/richmondbc/",
    note: "My Gym Richmond BC location page (5300 No. 3 Rd, Richmond)",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // YWCA BC (4 programs) — homepage → camps/programs page
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "YWCA BC",
    newUrl: "https://ywcabc.org/programs/",
    note: "YWCA BC programs page including youth camps and activities",
    verified: false, // URL pattern inferred, needs manual verification
  },

  // ══════════════════════════════════════════════════════════════════
  // HARBOUR DANCE CENTRE (3 programs) — homepage → youth camps
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "Harbour Dance Centre",
    newUrl: "https://www.harbourdance.com/youth/",
    note: "Harbour Dance Centre youth programs page (may include camps)",
    verified: false, // URL pattern inferred, needs manual verification
  },

  // ══════════════════════════════════════════════════════════════════
  // THE DIRTY APRON (1 program) — homepage → cooking school
  // Already handled by fix-generic-urls.cjs but that script may have missed it
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "The Dirty Apron",
    newUrl: "https://www.dirtyapron.com/cooking-school/",
    note: "The Dirty Apron cooking school page with camp calendar",
    verified: true,
  },

  // ══════════════════════════════════════════════════════════════════
  // SFU SUMMER CAMPS (1 program) — sfu.ca homepage → summer camps
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "SFU Summer Camps",
    newUrl: "https://www.sfu.ca/continuing-studies/programs/youth-programs/summer-camps.html",
    note: "SFU Continuing Studies youth summer camps page",
    verified: false, // URL pattern inferred, needs manual verification
  },

  // ══════════════════════════════════════════════════════════════════
  // EMILY CARR UNIVERSITY (1 program) — ecuad.ca homepage → youth summer programs
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "Emily Carr University",
    newUrl: "https://www.ecuad.ca/academics/continuing-studies/youth-summer-programs",
    note: "Emily Carr Continuing Studies youth summer programs page",
    verified: false, // URL pattern inferred, needs manual verification
  },

  // ══════════════════════════════════════════════════════════════════
  // ENGINEERING FOR KIDS (1 program) — homepage → Vancouver/BC franchise
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "Engineering For Kids",
    newUrl: "https://www.engineeringforkids.com/locations/canada/british-columbia/",
    note: "Engineering For Kids BC locations page to find local camp",
    verified: false, // URL pattern inferred, needs manual verification
  },

  // ══════════════════════════════════════════════════════════════════
  // HCLL (1 program) — homepage — keep as homepage (has registration details per fix-generic-urls.cjs)
  // Mark urlVerified=true but don't change URL
  // ══════════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === "HCLL",
    newUrl: null, // keep https://www.hcll.ca/
    note: "HCLL homepage has registration info and is the correct entry point",
    verified: true,
  },
];

// ── Providers flagged for manual attention (couldn't find specific URL) ──
const MANUAL_ATTENTION = {
  "Scottish Cultural Centre": "Website appears sparse; no specific camps/registration page found. Check scottishculturalcentre.com manually.",
  "Vancouver Young Actors School": "Uses MindBody but clients.mindbodyonline.com is a generic MindBody homepage. Find the specific studio booking URL.",
  "SC Kim's Taekwondo": "No specific camps/registration page found. Check sckimstaekwondo.com manually.",
  "Chabad of BC": "ganisraelbc.com is a VBS-specific site. Check if there's a direct registration/programs page.",
  "Van Dusen Garden": "petitarchitect.com is a third-party registration system. Find the Van Dusen Garden-specific URL.",
  "Scouts Canada": "scouts.ca is the national site. Need a BC/Vancouver-specific camps URL.",
  "Muslim Association of Canada": "schools.macnet.ca has no path. Find the specific programs or registration page.",
  "VMSA": "vmsa.goalline.ca is a sports league homepage. Find the youth programs or registration page.",
  "Debate Camp": "debatecamp.org homepage. Find the registration or programs page.",
  "Kirby Snell Dance / Endorphin Dance Rush": "kirbysnelldance.com homepage. Find the classes/registration page.",
};

// ── Analysis ──
console.log("\n═══════════════════════════════════════════════════════════════");
console.log("  Homepage URL Analysis — Skeddo Programs");
console.log(`  Mode: ${FIX ? "FIX (writing changes)" : "DRY RUN (report only)"}`);
console.log("═══════════════════════════════════════════════════════════════\n");

const homepagePrograms = programs.filter((p) => isHomepageUrl(p.registrationUrl));
console.log(`Total programs with homepage URLs: ${homepagePrograms.length}\n`);

// Group by provider
const byProvider = {};
homepagePrograms.forEach((p) => {
  const k = p.provider || "Unknown";
  if (!byProvider[k]) byProvider[k] = { count: 0, urls: new Set(), programs: [] };
  byProvider[k].count++;
  byProvider[k].urls.add(p.registrationUrl);
  byProvider[k].programs.push(p);
});

const sorted = Object.entries(byProvider).sort((a, b) => b[1].count - a[1].count);

console.log("Provider breakdown:");
console.log("──────────────────────────────────────────────────────────────");
sorted.forEach(([provider, data]) => {
  const hostname = getHostname([...data.urls][0]);
  const exempt = HOMEPAGE_EXEMPT_DOMAINS.has(hostname) ? " ✓ EXEMPT" : "";
  const hasfix = URL_FIXES.some((f) => data.programs.some((p) => f.match(p)));
  const manual = MANUAL_ATTENTION[provider] ? " ⚠ MANUAL" : "";
  const status = exempt || (hasfix ? " → AUTO-FIX" : manual || " ⚠ MANUAL");
  console.log(`  ${String(data.count).padStart(3)}  ${provider}${status}`);
});

// ── Apply fixes ──
let fixedCount = 0;
let programsFixed = 0;

if (FIX) {
  console.log("\n\nApplying fixes...\n");

  programs.forEach((program) => {
    if (!isHomepageUrl(program.registrationUrl)) return;

    for (const fix of URL_FIXES) {
      if (fix.match(program)) {
        if (fix.newUrl && fix.newUrl !== program.registrationUrl) {
          program.registrationUrl = fix.newUrl;
          programsFixed++;
        }
        program.urlVerified = fix.verified;
        if (fix.note) program.urlNote = fix.note;
        break;
      }
    }
  });

  fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + "\n");
  console.log(`✅ Fixed ${programsFixed} program URLs in programs.json`);
}

// ── Summary ──
const exemptCount = sorted.filter(([p, d]) =>
  HOMEPAGE_EXEMPT_DOMAINS.has(getHostname([...d.urls][0]))
).reduce((sum, [, d]) => sum + d.count, 0);

const autoFixCount = sorted
  .filter(([p, d]) => !HOMEPAGE_EXEMPT_DOMAINS.has(getHostname([...d.urls][0])))
  .filter(([p, d]) => URL_FIXES.some((f) => d.programs.some((pr) => f.match(pr))))
  .reduce((sum, [, d]) => sum + d.count, 0);

const manualCount = homepagePrograms.length - exemptCount - autoFixCount;

console.log("\n\n════════════════════════════════════════════════");
console.log("  Summary");
console.log("════════════════════════════════════════════════");
console.log(`  Total homepage URLs:        ${homepagePrograms.length}`);
console.log(`  Exempt (expected):          ${exemptCount}`);
console.log(`  Auto-fixable:               ${autoFixCount}  ${FIX ? "(FIXED ✅)" : "(run with --fix to apply)"}`);
console.log(`  Need manual attention:      ${manualCount}`);
console.log("════════════════════════════════════════════════");

if (Object.keys(MANUAL_ATTENTION).length > 0) {
  console.log("\n⚠️  Providers needing manual attention:\n");
  Object.entries(MANUAL_ATTENTION).forEach(([provider, note]) => {
    const count = byProvider[provider] ? byProvider[provider].count : "?";
    console.log(`  ${provider} (${count} programs):`);
    console.log(`    ${note}\n`);
  });
}

if (!FIX) {
  console.log("\nRun with --fix to apply the auto-fixes.");
}
