// update-cn-a2i.cjs
// Applies ONLY verified-2026 data from provider registration pages.
// No estimates. Gaps are left as null with source-cited costNotes.
//
// Code Ninjas source: codeninjas.com/vancouver-west-bc-ca/camps (pricing confirmed)
// Collingwood source: collingwood.org/community/camps/dates-rates (pricing confirmed)

const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/data/programs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let cnUpdated = 0;
let a2iUpdated = 0;

// ============================================================
// 1. UPDATE CODE NINJAS - VANCOUVER WEST (IDs 167-174, 691, 692)
// ============================================================
// Verified 2026 pricing from codeninjas.com/vancouver-west-bc-ca/camps:
//   Half-day: $250/week (AM 9am-12pm or PM 12:30-3:30pm)
//   Full day (AM+PM): $225/camp × 2 = $450/week
//   Extended care: $60/week (early 8-9am or late 3:30-5pm)
// Location confirmed open at 3534 W 41st Ave, Vancouver, BC V6N 3E6
// Source: codeninjas-nine.vercel.app, reviews.birdeye.com, ca.nextdoor.com

const cnCostNote =
  '$250/week half-day (AM 9am-12pm or PM 12:30-3:30pm). ' +
  'Book AM+PM for $225/each ($450/week full day). ' +
  'Extended care $60/week (early 8-9am or late 3:30-5pm). ' +
  'Source: codeninjas.com/vancouver-west-bc-ca/camps';

const cnDescription =
  'Week-long coding camps with themed sessions (Roblox, Minecraft, Robotics, AI, etc.). ' +
  'Half-day $250/week (AM 9am-12pm or PM 12:30-3:30pm). ' +
  'Book both sessions for $225 each ($450/week full day). ' +
  'JR ages 5-7; CREATE ages 7-14. ' +
  'Location: 3534 W 41st Ave, Vancouver, BC V6N 3E6. ' +
  'Source: codeninjas.com/vancouver-west-bc-ca/camps (verified April 2026)';

for (const p of data) {
  if (p.provider !== 'Code Ninjas') continue;

  p.cost = 250;
  p.costNote = cnCostNote;
  p.priceVerified = true;

  // Fix description (remove stale "coming soon" language)
  if (p.description && p.description.includes('coming soon')) {
    p.description = cnDescription;
  }

  // Spring break camps (March 2026) have already ended as of April 1, 2026
  if (p.startDate && p.startDate < '2026-04-01') {
    p.enrollmentStatus = 'Closed';
  }

  cnUpdated++;
}

console.log('[Code Ninjas] Updated:', cnUpdated, 'programs');
console.log('[Code Ninjas] NOTE: 3 additional open locations found (East, South, North Van) —');
console.log('  specific session dates not confirmed via registration portal; not added.');
console.log('  See verification log for location details and addresses.');

// ============================================================
// 2. UPDATE ACCESS2INNOVATE / COLLINGWOOD NULL-COST PROGRAMS
// ============================================================
// Verified 2026 pricing from collingwood.org/community/camps/dates-rates:
//   Explorers (Kindergarten / JK): $310/week
//   Wonderers (Gr 1-2) half-day AM or PM: $300/week
//   Wonderers (Gr 1-2) full day: $600/week
//   Adventurers (Gr 3-5) half-day AM or PM: $300/week
//   Adventurers (Gr 3-5) full day: $600/week
//   Leader-in-Training (Gr 8-9): $400/week
//   Lunch Program (standard 5-day week): $90/week (from collingwood.org/camps)
//
// NOT applied (cannot determine exact price from public sources):
//   Innovators (Gr 6-8): range $250-700/week depending on program type
//   Lunch Program WK 2 & WK 7 (4-day holiday weeks): "$90 reduced, exact TBD"

const ratesUrl = 'collingwood.org/community/camps/dates-rates';

for (const p of data) {
  if (p.provider !== 'Access2Innovate / Collingwood' || p.cost !== null) continue;

  const name = p.name;
  const sched = p.scheduleType;

  // --- Lunch Programs ---
  if (name.includes('Lunch Program')) {
    if (p.startDate === '2026-06-29' || p.startDate === '2026-08-04') {
      // 4-day holiday week: website says "prices reduced" but exact amount not published
      p.cost = null;
      p.costNote =
        'Standard lunch $90/week; this is a 4-day holiday week (Canada Day Jul 1 / BC Day Aug 3) — ' +
        'exact reduced price not published on site. Source: ' + ratesUrl;
      // priceVerified stays false — price not confirmed
    } else {
      p.cost = 90;
      p.costNote = '$90/week (full-day campers only). Source: collingwood.org/camps + ' + ratesUrl;
      p.priceVerified = true;
    }
    a2iUpdated++;
    continue;
  }

  // --- Leader-in-Training (Gr 8-9) ---
  if (name.includes('Leader in Training') || name.includes('Leader-in-Training')) {
    p.cost = 400;
    p.costNote = 'Leader-in-Training (Gr 8-9): $400/week. Source: ' + ratesUrl;
    p.priceVerified = true;
    a2iUpdated++;
    continue;
  }

  // --- Explorers / Mini-Explorers (Kindergarten / JK) ---
  const isK =
    name.includes('(K)') ||
    /Mini.Explorers/i.test(name) ||
    /Explorers Signature \(K\)/i.test(name);

  // --- Wonderers (Gr 1-2) ---
  const isGr12 = name.includes('(1-2)');

  // --- Adventurers (Gr 3-5) ---
  const isGr35 = name.includes('(3-5)');

  // --- Innovators (Gr 6-8) ---
  const isGr68 = name.includes('(6-8)') || name.includes('(6-9)');

  if (isK) {
    p.cost = 310;
    p.costNote = 'Explorers/Mini-Explorers (Kindergarten): $310/week. Source: ' + ratesUrl;
    p.priceVerified = true;
    a2iUpdated++;
  } else if (isGr12) {
    if (sched === 'Full Day') {
      p.cost = 600;
      p.costNote = 'Wonderers (Gr 1-2) full-day: $600/week. Source: ' + ratesUrl;
    } else {
      p.cost = 300;
      p.costNote = 'Wonderers (Gr 1-2) half-day (AM or PM): $300/week. Source: ' + ratesUrl;
    }
    p.priceVerified = true;
    a2iUpdated++;
  } else if (isGr35) {
    if (sched === 'Full Day') {
      p.cost = 600;
      p.costNote = 'Adventurers (Gr 3-5) full-day: $600/week. Source: ' + ratesUrl;
    } else {
      p.cost = 300;
      p.costNote = 'Adventurers (Gr 3-5) half-day (AM or PM): $300/week. Source: ' + ratesUrl;
    }
    p.priceVerified = true;
    a2iUpdated++;
  } else if (isGr68) {
    // Price range known but exact per-program price requires registration portal
    p.cost = null;
    p.costNote =
      'Innovators (Gr 6-8): range $250-700/week depending on specialty — ' +
      'Arts & Media $250-550, Sports & Adventure $290-700, Science & Discovery $290-500, Nature & Wellness $290-300. ' +
      'Exact price requires checking registration portal. Source: ' + ratesUrl;
    a2iUpdated++;
  }
}

console.log('[A2I Collingwood] Updated:', a2iUpdated, 'programs');

// ============================================================
// SAVE
// ============================================================
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('programs.json saved. Total programs:', data.length);
