#!/usr/bin/env node
// musicworkscanada-audit-fix.cjs
// Fixes Musicworks Canada data (rank 189 audit, 2026-04-06)
//
// Source pages verified (browser navigation):
//   https://musicworkscanada.com/summer-programs-2026/ (program overview — all 4 programs confirmed)
//   https://musicworkscanada.com/british-columbia/ (5 Metro Vancouver locations confirmed)
//
// FINDINGS:
//   IDs 139-142: All marked "Likely Coming Soon" — WRONG, page says "Registration is NOW OPEN"
//   Pricing ($350): NOT shown publicly on website (behind popup form) — priceVerified must be false
//   durationPerDay: All set to 7hrs — wrong based on published program hours:
//     BYOU (ID 139): 30hr/week = 6hr/day
//     STEM (ID 140): 30hr/week = 6hr/day
//     Prodigy A (ID 141): 20hr/week = 4hr/day
//     Prodigy B (ID 142): 25hr/week = 5hr/day
//   Specific session dates: NOT published on website (flexible 1-3 week options);
//     existing dates in DB are unconfirmed estimates
//   Location: Vancouver Arbutus (4101 Arbutus St) confirmed correct for IDs 139-142

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

// --- ID 139: Build Your Own Ukulele Camp (Jul 6-10) ---
fix(139, 'enrollmentStatus', 'Open');
fix(139, 'priceVerified', false);
fix(139, 'cost', null);
fix(139, 'durationPerDay', 6);
fix(139, 'isEstimate', true);
fix(139, 'costNote',
  'Price not published publicly — contact your nearest Musicworks Canada location for current pricing. ' +
  '30 hrs/week program (6 hrs/day Mon–Fri). Flexible 1–3 week scheduling available. ' +
  'Specific session dates not published on website — verify with provider. ' +
  'Vancouver Arbutus location: 4101 Arbutus St, 604-620-5316. Registration open as of Apr 2026.'
);
console.log('Fixed ID 139: enrollmentStatus Open, cost null, durationPerDay 6, isEstimate true');

// --- ID 140: STEM Einstein Camp (Jul 13-17) ---
fix(140, 'enrollmentStatus', 'Open');
fix(140, 'priceVerified', false);
fix(140, 'cost', null);
fix(140, 'durationPerDay', 6);
fix(140, 'isEstimate', true);
fix(140, 'costNote',
  'Price not published publicly — contact your nearest Musicworks Canada location for current pricing. ' +
  '30 hrs/week program (6 hrs/day Mon–Fri). Flexible 1–3 week scheduling available. ' +
  'Specific session dates not published on website — verify with provider. ' +
  'Vancouver Arbutus location: 4101 Arbutus St, 604-620-5316. Registration open as of Apr 2026.'
);
console.log('Fixed ID 140: enrollmentStatus Open, cost null, durationPerDay 6, isEstimate true');

// --- ID 141: Beginning Music Prodigy Ages 5-7 (Jul 20-24) ---
fix(141, 'enrollmentStatus', 'Open');
fix(141, 'priceVerified', false);
fix(141, 'cost', null);
fix(141, 'durationPerDay', 4);
fix(141, 'scheduleType', 'Half Day');
fix(141, 'dayLength', 'Half Day');
fix(141, 'isEstimate', true);
fix(141, 'costNote',
  'Price not published publicly — contact your nearest Musicworks Canada location for current pricing. ' +
  '20 hrs/week program (4 hrs/day Mon–Fri). Flexible 1–3 week scheduling available. ' +
  'Specific session dates not published on website — verify with provider. ' +
  'Vancouver Arbutus location: 4101 Arbutus St, 604-620-5316. Registration open as of Apr 2026.'
);
console.log('Fixed ID 141: enrollmentStatus Open, cost null, durationPerDay 4, scheduleType Half Day, isEstimate true');

// --- ID 142: Beginning Music Prodigy Ages 8-12 (Jul 27-31) ---
fix(142, 'enrollmentStatus', 'Open');
fix(142, 'priceVerified', false);
fix(142, 'cost', null);
fix(142, 'durationPerDay', 5);
fix(142, 'isEstimate', true);
fix(142, 'costNote',
  'Price not published publicly — contact your nearest Musicworks Canada location for current pricing. ' +
  '25 hrs/week program (5 hrs/day Mon–Fri). Flexible 1–3 week scheduling available. ' +
  'Specific session dates not published on website — verify with provider. ' +
  'Vancouver Arbutus location: 4101 Arbutus St, 604-620-5316. Registration open as of Apr 2026.'
);
console.log('Fixed ID 142: enrollmentStatus Open, cost null, durationPerDay 5, isEstimate true');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`\nDone. Fixes: ${fixes}. Total programs: ${programs.length}`);
