#!/usr/bin/env node
/**
 * Fix systemic data issues in programs.json:
 * 1. scheduleType incorrectly set to "Full Day" for programs < 4 hours
 * 2. Access2Innovate grade-to-age mapping (ageMin=1,ageMax=2 = Grade 1-2, not age 1-2)
 * 3. ageMin=0 cleanup for CoV ActiveNet scrapes with no meaningful age data
 *
 * Run: node scripts/fix-schedule-and-ages.cjs
 */

const fs = require("fs");
const path = require("path");

const programsPath = path.join(__dirname, "..", "src", "data", "programs.json");
const programs = JSON.parse(fs.readFileSync(programsPath, "utf8"));

let fix1Count = 0;
let fix2Count = 0;
let fix3Count = 0;

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

// ═══════════════════════════════════════════════════════════════
// FIX 1: scheduleType "Full Day" with durationPerDay < 4 hours
// ═══════════════════════════════════════════════════════════════

// Providers that are legitimately full-day camps even if short hours (do NOT change)
const LEGIT_FULL_DAY_PROVIDERS = [
  "Wayland Sports",
];

// After-school class keywords
const AFTER_SCHOOL_KEYWORDS = ["elementary", "school", "after school", "afterschool"];

// Lesson-type keywords (swim, sports skills, skating, paddling)
const LESSON_KEYWORDS = [
  "lesson", "skating", "skate", "hockey", "power skating",
  "swim", "paddling", "canoe", "kayak", "fundamentals",
  "instruction", "tutorial", "clinic", "private",
];

programs.forEach((p) => {
  const provider = p.provider || "";
  const name = (p.name || "").toLowerCase();
  const dur = p.durationPerDay;

  // Skip if not Full Day or no duration data or legitimate full day
  if (p.scheduleType !== "Full Day") return;
  if (!dur || dur >= 4) return;
  if (LEGIT_FULL_DAY_PROVIDERS.some(lp => provider.includes(lp))) return;

  // ── Provider-specific rules ──

  // Young Rembrandts: always "Class"
  if (provider === "Young Rembrandts") {
    p.scheduleType = "Class";
    p.dayLength = "Lesson"; // short class = Lesson dayLength
    fix1Count++;
    return;
  }

  // Professor Puffin's: always "Class" (after-school enrichment)
  if (provider.includes("Professor Puffin")) {
    p.scheduleType = "Class";
    p.dayLength = "Lesson";
    fix1Count++;
    return;
  }

  // Access2Innovate before/after care add-ons
  if (provider.includes("Access2Innovate") || provider.includes("Collingwood")) {
    if (name.includes("before camp care") || name.includes("after camp care")) {
      const startH = parseTime(p.startTime);
      const endH = parseTime(p.endTime);
      if (startH !== null && endH !== null) {
        if (endH <= 10) {
          p.scheduleType = "Before Care";
        } else if (startH >= 15) {
          p.scheduleType = "After Care";
        } else {
          p.scheduleType = "Class";
        }
      } else {
        p.scheduleType = "Class";
      }
      p.dayLength = "Lesson";
      fix1Count++;
      return;
    }
  }

  // Richmond Ice Centre hockey skills (1-2hr): "Lesson"
  if (provider.includes("Richmond Ice")) {
    p.scheduleType = "Lesson";
    p.dayLength = "Lesson";
    fix1Count++;
    return;
  }

  // Burnaby Winter Club skating (1-2hr): "Lesson"
  if (provider.includes("Burnaby Winter Club")) {
    p.scheduleType = "Lesson";
    p.dayLength = "Lesson";
    fix1Count++;
    return;
  }

  // North Vancouver Outdoors bike rides (1.5-2hr): "Class"
  if (provider.includes("North Vancouver Outdoors")) {
    // Except full-day programs (dur >= 4 already filtered above)
    if (dur < 4) {
      p.scheduleType = "Class";
      p.dayLength = dur <= 2 ? "Lesson" : "Half Day";
      fix1Count++;
      return;
    }
  }

  // False Creek Sprint Canoe (1-1.5hr): "Lesson"
  if (provider.includes("False Creek Sprint")) {
    p.scheduleType = "Lesson";
    p.dayLength = "Lesson";
    fix1Count++;
    return;
  }

  // Petit Architect (1-1.5hr classes): "Class"
  if (provider.includes("Petit Architect")) {
    p.scheduleType = "Class";
    p.dayLength = dur <= 2 ? "Lesson" : "Half Day";
    fix1Count++;
    return;
  }

  // ── Generic rules for remaining programs ──

  const startH = parseTime(p.startTime);
  const endH = parseTime(p.endTime);

  if (dur < 2) {
    // < 2 hours: Lesson or Class
    const isAfterSchool = AFTER_SCHOOL_KEYWORDS.some(kw => name.includes(kw)) ||
      (startH !== null && startH >= 14.5); // starts 2:30 PM or later
    const isLesson = LESSON_KEYWORDS.some(kw => name.includes(kw));

    if (isLesson) {
      p.scheduleType = "Lesson";
    } else if (isAfterSchool) {
      p.scheduleType = "After School";
    } else {
      p.scheduleType = "Class";
    }
    p.dayLength = "Lesson";
    fix1Count++;
    return;
  }

  if (dur >= 2 && dur < 4) {
    // 2-4 hours: Half Day variants
    // Access2Innovate half-day sessions
    if (endH !== null && endH <= 13) {
      p.scheduleType = "Half Day (AM)";
    } else if (startH !== null && startH >= 11.5) {
      p.scheduleType = "Half Day (PM)";
    } else {
      p.scheduleType = "Half Day";
    }
    p.dayLength = "Half Day";
    fix1Count++;
    return;
  }
});

console.log(`FIX 1: scheduleType corrections: ${fix1Count} programs fixed`);

// ═══════════════════════════════════════════════════════════════
// FIX 2: Access2Innovate grade-to-age mapping
// ═══════════════════════════════════════════════════════════════

const GRADE_MAPS = [
  { pattern: /\(K\)|kindergarten/i, ageMin: 5, ageMax: 5 },
  { pattern: /\(1-2\)|grade\s*1-2/i, ageMin: 6, ageMax: 7 },
  { pattern: /\(3-4\)|grade\s*3-4/i, ageMin: 8, ageMax: 9 },
  { pattern: /\(5-6\)|grade\s*5-6/i, ageMin: 10, ageMax: 11 },
  { pattern: /\(7-8\)|grade\s*7-8/i, ageMin: 12, ageMax: 13 },
];

programs.forEach((p) => {
  const provider = p.provider || "";
  if (!provider.includes("Access2Innovate") && !provider.includes("Collingwood")) return;

  const name = p.name || "";

  for (const gm of GRADE_MAPS) {
    if (gm.pattern.test(name)) {
      // Only fix if currently has wrong grade-as-age values
      if (p.ageMin <= 2 || (p.ageMin !== gm.ageMin && p.ageMax !== gm.ageMax)) {
        const oldMin = p.ageMin;
        const oldMax = p.ageMax;
        p.ageMin = gm.ageMin;
        p.ageMax = gm.ageMax;
        if (oldMin !== gm.ageMin || oldMax !== gm.ageMax) {
          fix2Count++;
          console.log(`  FIX 2: ${p.id} "${name}" ageMin ${oldMin}→${gm.ageMin}, ageMax ${oldMax}→${gm.ageMax}`);
        }
      }
      break;
    }
  }
});

console.log(`FIX 2: Grade-to-age corrections: ${fix2Count} programs fixed`);

// ═══════════════════════════════════════════════════════════════
// FIX 3: ageMin=0 cleanup
// ═══════════════════════════════════════════════════════════════

// Keywords that indicate a legitimate baby/toddler program
const BABY_KEYWORDS = [
  "baby", "babies", "infant", "tot ", "tots ", "toddler",
  "parent and", "parent &", "mommy", "mommies",
  "newborn", "0-", "playtime", "preschool",
  "crabtree", "early learning", "child care", "childcare",
  "zumbini", "music together", "jellyfish",
];

programs.forEach((p) => {
  if (p.ageMin !== 0) return;

  const name = (p.name || "").toLowerCase();
  const provider = p.provider || "";

  // Check if this is a legitimate baby/toddler program
  const isBabyProgram = BABY_KEYWORDS.some(kw => name.includes(kw));

  if (isBabyProgram) {
    // Keep ageMin=0 for legitimate baby/toddler programs
    return;
  }

  // CoV ActiveNet scrapes with ageMin=0 and no meaningful age data
  if (provider.includes("City of Vancouver")) {
    // If ageMax is also null/undefined, this is likely a scrape artifact
    if (p.ageMax === null || p.ageMax === undefined) {
      p.ageMin = null;
      p.ageMax = null;
      fix3Count++;
      return;
    }
    // If ageMax is set but ageMin is 0, check if it makes sense
    // Programs like "Birthday Party" (ageMax=5/6/12/13) with ageMin=0 are probably fine
    // but generic programs with ageMin=0 likely just don't have age data
    if (!name.includes("birthday") && !name.includes("play") &&
        !name.includes("drop") && !name.includes("family") &&
        !name.includes("gym") && !name.includes("lunch") &&
        !name.includes("fair") && !name.includes("volunteer") &&
        !name.includes("membership") && !name.includes("registration")) {
      // These are likely scraped with no meaningful age — keep ageMin=0
      // since ageMax is set and it might be a valid range
      return;
    }
  }
});

console.log(`FIX 3: ageMin=0 cleanup: ${fix3Count} programs fixed`);

// ═══════════════════════════════════════════════════════════════
// Save
// ═══════════════════════════════════════════════════════════════

const totalFixes = fix1Count + fix2Count + fix3Count;
console.log(`\nTOTAL: ${totalFixes} fixes applied`);

fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2));
console.log(`Saved programs.json (${programs.length} programs)`);
