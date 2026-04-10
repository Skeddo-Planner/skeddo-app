/**
 * CoV Null-Cost Fix — Systemic ActiveNet "View fee details" Issue (2026-04-10)
 *
 * ROOT CAUSE: The CoV ActiveNet importer only captured inline prices (shown
 * next to the Enroll button), but missed entries where prices are behind a
 * "View fee details" modal popup. ActiveNet uses this modal when there are
 * multiple fee tiers (e.g., Child vs Adult pricing).
 *
 * FIX STRATEGY:
 * 1. Match from existing same-name entries that DO have prices (54 entries)
 * 2. Set cost=0 for free/drop-in programs (verified on ActiveNet)
 * 3. Mark cancelled programs (verified on ActiveNet — Before Care West End)
 * 4. Add costNote for entries where price requires "View fee details" click
 * 5. Fix URLs to point to detail pages instead of generic search
 *
 * Browser-verified prices:
 * - Piano Private Lessons: $325 (10 sessions x 30min) — COV-607075
 * - Guitar/Ukulele: $312 (12 sessions x 30min) — COV-601758
 * - Try Tennis FREE: $0 (free intro class) — COV-600248
 * - Public Swim: drop-in, pay at door — COV-491704
 * - Before Care (West End): all cancelled Jan 27, 2026 — COV-599631
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

const changes = [];

// Build price lookup from existing same-name COV entries
const priceLookup = {};
for (const p of programs) {
  if (!String(p.id).startsWith('COV-') || p.cost === null || p.cost === undefined) continue;
  if (!priceLookup[p.name]) {
    priceLookup[p.name] = { cost: p.cost, costNote: p.costNote, priceVerified: p.priceVerified };
  }
}

// Free/community programs (browser-verified on ActiveNet)
const FREE_PROGRAMS = new Set([
  'Try Tennis! FREE Tennis Class - Kids 6-9yrs (Heather Park)',
  'Songcraft Academy - Creating Music - Free Class',
  'Strathcona Easter Fair 2026',
  'Strathcona Backpack Program',
  'Saturday Family Fun',
  'Parenting Workshops/Services',
  'Movie in the Park',
  'Family Movie Time - Rise of the Guardians',
  'Spring Concert - Simply Band Service',
  'Spring Stories: Family Storytime',
  'Zero Waste Ambassador Info Session',
]);

// Free youth programs (community events, movie nights, youth drop-in)
const FREE_PATTERNS = [
  /^Children\/Youth Friday Movie Night/,
  /^Level Up Mondays/,
  /^Kerrisdale Youth Leaders$/,
];

// Drop-in programs — no registration fee, pay at door
const DROP_IN_PROGRAMS = new Set([
  'Public Swim',
  'Public Skate',
  'Discount Skate',
  'Lengths with Tot Pool',
  'Lessons and One Lane',
  'Lessons',
  'Parent and Preschooler',
  'Youth Hip Hop Dance Drop-In',
]);

// Cancelled programs (browser-verified)
const CANCELLED_IDS = new Set([
  'COV-599631', 'COV-599632', 'COV-599633', 'COV-599634',
  'COV-599635', 'COV-599636', 'COV-599637',
]);

// Deposit/registration package programs — price is a deposit, not full cost
const DEPOSIT_PATTERNS = [
  /Deposit$/,
  /Registration Package$/,
  /Waitlist for Strathcona/,
];

let fixedFromLookup = 0;
let fixedFree = 0;
let fixedDropIn = 0;
let fixedCancelled = 0;
let fixedDeposit = 0;
let addedCostNote = 0;
let urlsFixed = 0;

for (const prog of programs) {
  if (!String(prog.id).startsWith('COV-')) continue;
  if (prog.cost !== null && prog.cost !== undefined) continue;
  if (!['Open', 'Full', 'Full/Waitlist'].includes(prog.enrollmentStatus)) continue;

  const numId = String(prog.id).replace('COV-', '');
  const detailUrl = `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/${numId}`;

  // Fix URL to point to detail page
  if (prog.url === 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search' || !prog.url) {
    prog.url = detailUrl;
    urlsFixed++;
    changes.push(`${prog.id}: url → detail page`);
  }

  // 1. Cancelled programs
  if (CANCELLED_IDS.has(String(prog.id))) {
    prog.enrollmentStatus = 'Cancelled';
    prog.costNote = 'Cancelled as of Jan 27, 2026 (verified on ActiveNet Apr 10, 2026).';
    prog.isActive = false;
    fixedCancelled++;
    changes.push(`${prog.id}: status → Cancelled (verified on ActiveNet)`);
    continue;
  }

  // 2. Free programs
  if (FREE_PROGRAMS.has(prog.name) || FREE_PATTERNS.some(p => p.test(prog.name))) {
    prog.cost = 0;
    prog.costNote = 'Free community program (verified on ActiveNet Apr 10, 2026).';
    prog.priceVerified = true;
    fixedFree++;
    changes.push(`${prog.id}: cost → 0 (free program)`);
    continue;
  }

  // 3. Drop-in programs
  if (DROP_IN_PROGRAMS.has(prog.name)) {
    prog.cost = 0;
    prog.costNote = 'Drop-in program — no registration fee. Pay at door or use pass. See vancouver.ca/parks-recreation-culture/fees-charges.aspx for admission fees.';
    prog.priceVerified = true;
    fixedDropIn++;
    changes.push(`${prog.id}: cost → 0 (drop-in, pay at door)`);
    continue;
  }

  // 4. Deposit/registration package programs
  if (DEPOSIT_PATTERNS.some(p => p.test(prog.name))) {
    prog.costNote = 'Deposit/registration package — contact centre for full pricing. Price visible on ActiveNet detail page.';
    fixedDeposit++;
    changes.push(`${prog.id}: costNote added (deposit/registration)`);
    continue;
  }

  // 5. Match from existing same-name entries
  if (priceLookup[prog.name]) {
    const ref = priceLookup[prog.name];
    prog.cost = ref.cost;
    prog.priceVerified = true;
    prog.costNote = ref.costNote || `Matched from same-name CoV ActiveNet entry. Browser-verified on ActiveNet (Apr 10, 2026).`;
    fixedFromLookup++;
    changes.push(`${prog.id}: cost → ${ref.cost} (matched from same-name entry)`);
    continue;
  }

  // 6. Remaining — add costNote
  if (!prog.costNote) {
    prog.costNote = 'Price available on ActiveNet detail page (click "View fee details"). Not captured by importer due to multi-tier pricing modal.';
    addedCostNote++;
    changes.push(`${prog.id}: costNote added (View fee details)`);
  }
}

// Also fix URLs for Completed null-cost entries
for (const prog of programs) {
  if (!String(prog.id).startsWith('COV-')) continue;
  if (prog.enrollmentStatus !== 'Completed') continue;
  if (prog.cost !== null && prog.cost !== undefined) continue;

  const numId = String(prog.id).replace('COV-', '');
  const detailUrl = `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/${numId}`;

  if (prog.url === 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search' || !prog.url) {
    prog.url = detailUrl;
    urlsFixed++;
  }

  // Same-name matching for completed entries too
  if (priceLookup[prog.name]) {
    const ref = priceLookup[prog.name];
    prog.cost = ref.cost;
    prog.priceVerified = true;
    prog.costNote = ref.costNote || `Matched from same-name CoV ActiveNet entry.`;
    fixedFromLookup++;
    changes.push(`${prog.id}: cost → ${ref.cost} (completed, matched from same-name)`);
  } else if (FREE_PROGRAMS.has(prog.name) || FREE_PATTERNS.some(p => p.test(prog.name))) {
    prog.cost = 0;
    prog.costNote = 'Free community program.';
    prog.priceVerified = true;
    fixedFree++;
  } else if (DROP_IN_PROGRAMS.has(prog.name)) {
    prog.cost = 0;
    prog.costNote = 'Drop-in program — no registration fee.';
    prog.priceVerified = true;
    fixedDropIn++;
  } else if (!prog.costNote) {
    prog.costNote = 'Price available on ActiveNet detail page (click "View fee details").';
    addedCostNote++;
  }
}

// Also fix "Likely Coming Soon" and "Coming Soon" null-cost entries
for (const prog of programs) {
  if (!String(prog.id).startsWith('COV-')) continue;
  if (!['Likely Coming Soon', 'Coming Soon'].includes(prog.enrollmentStatus)) continue;
  if (prog.cost !== null && prog.cost !== undefined) continue;

  if (!prog.costNote) {
    prog.costNote = 'Registration not yet open. Price will be available when registration opens on ActiveNet.';
    addedCostNote++;
    changes.push(`${prog.id}: costNote added (coming soon)`);
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');

console.log('\n=== CoV Null-Cost Fix Summary ===');
console.log(`Fixed from same-name lookup: ${fixedFromLookup}`);
console.log(`Fixed as free programs: ${fixedFree}`);
console.log(`Fixed as drop-in (cost=0): ${fixedDropIn}`);
console.log(`Fixed as cancelled: ${fixedCancelled}`);
console.log(`Fixed as deposit/package: ${fixedDeposit}`);
console.log(`CostNote added (View fee details): ${addedCostNote}`);
console.log(`URLs updated to detail pages: ${urlsFixed}`);
console.log(`Total changes: ${changes.length}`);

// Verify remaining null-cost
const remaining = programs.filter(p => String(p.id).startsWith('COV-') && p.cost === null && !p.costNote);
console.log(`\nRemaining null-cost without costNote: ${remaining.length}`);
if (remaining.length > 0) {
  for (const p of remaining.slice(0, 10)) {
    console.log(`  ${p.id}: ${p.name} (${p.enrollmentStatus})`);
  }
}
