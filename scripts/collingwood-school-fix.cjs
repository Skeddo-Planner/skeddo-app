/**
 * Collingwood School Fix — Browser-Verified (2026-04-10)
 *
 * SYSTEMIC ISSUE: 86 entries attributed to "Access2Innovate / Collingwood"
 * are actually Collingwood School programs (collingwood.org), a completely
 * separate organization. A2I runs STEM camps at The Shipyards in North Vancouver;
 * Collingwood School runs its own summer camp program at 2605 Wentworth Ave, West Vancouver.
 *
 * Evidence:
 * - A2I registration (campscui.active.com/orgs/Access2InnovateFoundation2) shows only
 *   STEM/robotics camps at The Shipyards, North Vancouver
 * - Collingwood School registration (campscui.active.com/orgs/CollingwoodSchool0) is separate
 * - Program names in our DB (Splash of Colour, Multi-Sports, Musical Theatre, Ceramics, etc.)
 *   match Collingwood School's Dates & Rates page, NOT A2I's offerings
 * - Address (2605 Wentworth Ave, West Vancouver) is Collingwood School's campus
 *
 * Fixes:
 * 1. Provider: "Access2Innovate / Collingwood" → "Collingwood School"
 * 2. URL: Set to collingwood.org/community/camps/dates-rates
 * 3. Pricing: 47 null-cost entries filled from browser-verified rates
 * 4. Ages: Fixed to match collingwood.org age ranges (not grade-to-age approximation)
 *
 * Age ranges from collingwood.org/community/camps/dates-rates:
 *   K (Table 0): Age 4-5
 *   Grades 1-2 (Table 1): Ages 5-7
 *   Grades 3-5 (Table 2): Ages 7-10
 *   Grades 6-8 (Table 3): Ages 10-13
 *   Leadership Grades 6-9 (Table 4): Ages 10-14
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

const COLLINGWOOD_URL = 'https://www.collingwood.org/community/camps/dates-rates';
const changes = [];

// Price map for null-cost entries based on browser-verified Collingwood School rates
// Format: name pattern → { cost, costNote }
const priceMap = [
  // K programs (ages 4-5)
  { pattern: /^Little Explorers \(K\)/, cost: 310, ageMin: 4, ageMax: 5 },
  { pattern: /^Explorers Signature \(K\)/, cost: 310, ageMin: 4, ageMax: 5 },
  { pattern: /^Mini Explorers\s+\(JK\)/, cost: 310, ageMin: 3, ageMax: 4 },

  // Grades 1-2 specialty half-day (ages 5-7): $300
  { pattern: /^Splash of Colour \(1-2\)/, cost: 300, ageMin: 5, ageMax: 7 },
  { pattern: /^Multi-Sports \(1-2\)/, cost: 300, ageMin: 5, ageMax: 7 },
  { pattern: /^STEM Adventure \(1-2\)/, cost: 300, ageMin: 5, ageMax: 7 },

  // Grades 1-2 specialty full-day: $600
  { pattern: /^Musical Theatre \(1-2\)/, cost: 600, ageMin: 5, ageMax: 7 },

  // Grades 1-2 Signature full-day: $600
  { pattern: /Signature \(1-2\)/, cost: 600, ageMin: 5, ageMax: 7 },

  // Grades 3-5 specialty half-day (ages 7-10): $300
  { pattern: /^Multi-Sports \(3-5\) AM/, cost: 300, ageMin: 7, ageMax: 10 },

  // Grades 3-5 Signature full-day: $600
  { pattern: /Signature \(3-5\)/, cost: 600, ageMin: 7, ageMax: 10 },

  // Grades 6-8 specialty (ages 10-13)
  { pattern: /^CSI Summer Edition \(6-8\)/, cost: 290, ageMin: 10, ageMax: 13 },
  { pattern: /^Ultimate Sports Adventure \(6-8\)/, cost: 290, ageMin: 10, ageMax: 13 },
  { pattern: /^Racquet Sports \(6-8\)/, cost: 290, ageMin: 10, ageMax: 13 },
  { pattern: /^The Mic is Yours \(6-8\)/, cost: 290, ageMin: 10, ageMax: 13 },

  // Leadership
  { pattern: /^Leader in Training \(8-9\)/, cost: 400, ageMin: 13, ageMax: 14 },

  // Lunch Program (all weeks are $90)
  { pattern: /^Lunch Program/, cost: 90 },
];

// Age corrections for entries that already have costs
const ageCorrections = {
  'K': { ageMin: 4, ageMax: 5 },
  'JK': { ageMin: 3, ageMax: 4 },
  '1-2': { ageMin: 5, ageMax: 7 },
  '3-5': { ageMin: 7, ageMax: 10 },
  '6-8': { ageMin: 10, ageMax: 13 },
  '7-10': { ageMin: 12, ageMax: 15 },  // Babysitting Start-Up (Gr 7-10)
  '8-9': { ageMin: 13, ageMax: 14 },
};

for (const prog of programs) {
  if (prog.provider !== 'Access2Innovate / Collingwood') continue;

  // Fix 1: Provider name
  prog.provider = 'Collingwood School';
  changes.push(`${prog.id}: provider → Collingwood School`);

  // Fix 2: URL
  if (!prog.url) {
    prog.url = COLLINGWOOD_URL;
    changes.push(`${prog.id}: url → ${COLLINGWOOD_URL}`);
  }

  // Fix 3: Pricing for null-cost entries
  if (prog.cost === null || prog.cost === undefined) {
    for (const rule of priceMap) {
      if (rule.pattern.test(prog.name)) {
        prog.cost = rule.cost;
        prog.priceVerified = true;
        prog.costNote = 'Browser-verified on collingwood.org/community/camps/dates-rates (Apr 10, 2026). Per week. Prices reduced on 4-day weeks (June 29-July 3, Aug 4-7).';
        changes.push(`${prog.id}: cost null→${rule.cost}`);

        // Also fix ages if specified
        if (rule.ageMin !== undefined) {
          if (prog.ageMin !== rule.ageMin) {
            changes.push(`${prog.id}: ageMin ${prog.ageMin}→${rule.ageMin}`);
            prog.ageMin = rule.ageMin;
          }
          if (prog.ageMax !== rule.ageMax) {
            changes.push(`${prog.id}: ageMax ${prog.ageMax}→${rule.ageMax}`);
            prog.ageMax = rule.ageMax;
          }
        }
        break;
      }
    }
  }

  // Fix 4: Age corrections for entries with existing costs
  // Detect grade group from name
  const gradeMatch = prog.name.match(/\((\d+-\d+|K|JK)\)/);
  if (gradeMatch) {
    const grade = gradeMatch[1];
    const correction = ageCorrections[grade];
    if (correction) {
      if (prog.ageMin !== correction.ageMin) {
        changes.push(`${prog.id}: ageMin ${prog.ageMin}→${correction.ageMin} (grade ${grade})`);
        prog.ageMin = correction.ageMin;
      }
      if (prog.ageMax !== correction.ageMax) {
        changes.push(`${prog.id}: ageMax ${prog.ageMax}→${correction.ageMax} (grade ${grade})`);
        prog.ageMax = correction.ageMax;
      }
    }
  }
}

// Also fix the "Access2Innovate" entries that are actual A2I (non-Collingwood)
// These are the 11 ProD Day camp entries — verify they have correct data
const a2iEntries = programs.filter(p => p.provider === 'Access2Innovate');
console.log(`\nA2I (non-Collingwood) entries: ${a2iEntries.length}`);
for (const prog of a2iEntries) {
  // Set URL to A2I camps page if missing
  if (!prog.url) {
    prog.url = 'https://www.access2innovate.com/camps';
    changes.push(`${prog.id}: url → https://www.access2innovate.com/camps`);
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nTotal changes: ${changes.length}`);
console.log('\nChanges:');
for (const c of changes) console.log('  ' + c);

// Summary
const collingwood = programs.filter(p => p.provider === 'Collingwood School');
const nullCost = collingwood.filter(p => p.cost === null || p.cost === undefined);
console.log(`\nCollingwood School entries: ${collingwood.length}`);
console.log(`Remaining null-cost: ${nullCost.length}`);
if (nullCost.length > 0) {
  console.log('Unpriced entries:');
  for (const p of nullCost) {
    console.log(`  ${p.id}: ${p.name}`);
  }
}
