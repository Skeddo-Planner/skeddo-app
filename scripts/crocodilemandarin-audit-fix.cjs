#!/usr/bin/env node
// crocodilemandarin-audit-fix.cjs
// Fixes Crocodile Mandarin data (rank 195 audit, 2026-04-06)
//
// Source pages verified (browser navigation):
//   https://www.crocodilemandarin.com/courses/summer-day-camps.html
//   https://www.crocodilemandarin.com/where/scottish-cultural-centre.html
//
// FINDINGS:
//   Full Day Camp: Mon-Fri 9AM-5PM, $540+GST regular ($498+GST early bird until May 1)
//   Half Day Camp: Mon-Fri 9AM-1PM, $280+GST ($260+GST early bird until May 1)
//   Ages: recommended 5-10 (others admitted case-by-case)
//   Location: 8886 Hudson St, Vancouver (Marpole) — Scottish Cultural Centre
//   South Burnaby camp: "Date to be determined" — no schedule published
//   Specific 2026 weekly dates: "Weekly throughout the summer" (no calendar published yet)
//   Registration: campscui.active.com (R24 prohibited URL — use provider's page)
//
//   Duplicate situation:
//   - 609 (Full Day Jul 6-10) duplicates ACT-0394 → mark ACT-0394 confirmed2026=false
//   - 610 (Full Day Jul 13-17) duplicates ACT-0450 → mark ACT-0450 confirmed2026=false
//   - 611 (HALF Day Jul 20-24) is NOT duplicate of ACT-0548 (Full Day) — different session type
//   - 612 (HALF Day Jul 27-31) is NOT duplicate of ACT-0619 (Full Day) — different session type
//
//   Age errors:
//   - ACT-0450: ages 7-12 → should be 5-10
//   - ACT-0548: ages 7-12 → should be 5-10
//
//   confirmed2026 errors:
//   - ACT-0548, 0619, 0659, 0696, 0741, 0768: false → true (provider confirms weekly all summer)
//
//   Address errors on 609-612:
//   - "Scottish Cultural Centre, Vancouver, BC" → "8886 Hudson St, Vancouver, BC" (confirmed from website)

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const pid_map = new Map(programs.map(p => [String(p.id), p]));

let fixes = 0;

function fix(id, field, value) {
  const p = pid_map.get(String(id));
  if (!p) { console.warn(`SKIP (not found): ${id}`); return; }
  p[field] = value;
  fixes++;
}

const ADDR = '8886 Hudson St, Vancouver, BC';
const LAT = 49.2087;
const LNG = -123.1367;
const NEIGHBOURHOOD = 'Marpole';
const REG_URL = 'https://www.crocodilemandarin.com/courses/summer-day-camps.html';

const FULL_COST_NOTE = 'Price verified from crocodilemandarin.com/courses/summer-day-camps.html on 2026-04-06. ' +
  'Regular full-day price: $540+GST. Early bird: $498+GST (until May 1). ' +
  'Half-day option also available: 9AM-1PM, $280+GST ($260+GST early bird). ' +
  'Fees likely qualify as childcare expense (tax deductible). Extended pickup to 5:30 available for small fee.';

const HALF_COST_NOTE = 'Price verified from crocodilemandarin.com/courses/summer-day-camps.html on 2026-04-06. ' +
  'Half-day price: $280+GST. Early bird: $260+GST (until May 1). Hours: 9AM-1PM. ' +
  'Full-day option also available: 9AM-5PM, $540+GST ($498+GST early bird).';

// --- FIX NUMERIC IDs 609-612: address update + costNote ---
[609, 610].forEach(id => {
  fix(id, 'address', ADDR);
  fix(id, 'lat', LAT);
  fix(id, 'lng', LNG);
  fix(id, 'costNote', FULL_COST_NOTE);
  console.log(`Fixed ${id}: address → 8886 Hudson St`);
});

[611, 612].forEach(id => {
  fix(id, 'address', ADDR);
  fix(id, 'lat', LAT);
  fix(id, 'lng', LNG);
  fix(id, 'costNote', HALF_COST_NOTE);
  console.log(`Fixed ${id}: address → 8886 Hudson St (half-day)`);
});

// --- FIX ACT-0394: Duplicate of 609 (Jul 6-10 Full Day) ---
fix('ACT-0394', 'confirmed2026', false);
fix('ACT-0394', 'enrollmentStatus', 'Likely Coming Soon');
fix('ACT-0394', 'costNote', 'Duplicate of canonical ID 609 (same week, same location, same schedule type). confirmed2026=false to prevent double-listing.');
console.log('Fixed ACT-0394: confirmed2026=false (duplicate of 609)');

// --- FIX ACT-0450: Duplicate of 610 (Jul 13-17 Full Day) + wrong ages ---
fix('ACT-0450', 'ageMin', 5);
fix('ACT-0450', 'ageMax', 10);
fix('ACT-0450', 'confirmed2026', false);
fix('ACT-0450', 'enrollmentStatus', 'Likely Coming Soon');
fix('ACT-0450', 'costNote', 'Duplicate of canonical ID 610 (same week, same location, same schedule type). confirmed2026=false. Ages corrected 7-12→5-10 (provider recommends 5-10).');
console.log('Fixed ACT-0450: confirmed2026=false (duplicate of 610), ages 7-12→5-10');

// --- FIX ACT-0548: NOT duplicate (Full Day vs 611 Half Day) — fix ages + confirm ---
fix('ACT-0548', 'ageMin', 5);
fix('ACT-0548', 'ageMax', 10);
fix('ACT-0548', 'confirmed2026', true);
fix('ACT-0548', 'costNote', FULL_COST_NOTE);
console.log('Fixed ACT-0548: ages 7-12→5-10, confirmed2026=true (full-day, not duplicate of half-day 611)');

// --- FIX ACT-0619: NOT duplicate (Full Day vs 612 Half Day) — confirm ---
fix('ACT-0619', 'confirmed2026', true);
fix('ACT-0619', 'costNote', FULL_COST_NOTE);
console.log('Fixed ACT-0619: confirmed2026=true (full-day, not duplicate of half-day 612)');

// --- FIX ACT-0659, 0696, 0741, 0768: August camps — confirm + costNote ---
['ACT-0659', 'ACT-0696', 'ACT-0741', 'ACT-0768'].forEach(id => {
  fix(id, 'confirmed2026', true);
  fix(id, 'costNote', FULL_COST_NOTE);
  console.log(`Fixed ${id}: confirmed2026=true`);
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`\nDone. Fixes: ${fixes}. Total programs: ${programs.length}`);
