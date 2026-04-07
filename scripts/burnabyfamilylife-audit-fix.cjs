#!/usr/bin/env node
// burnabyfamilylife-audit-fix.cjs
// Fixes Burnaby Family Life McKercher Summer Camp data (rank 175 audit, 2026-04-06)
//
// Source pages verified:
//   https://www.burnabyfamilylife.org/summer-camp (times, ages, price tiers, description)
//   https://www.burnabyfamilylife.org/store/p/mckercher-summer-camp-2026 (all 10 weeks, sold-out status)
//
// FINDINGS:
//   - DB had times "9:00 AM" — WRONG: actual is 8:30 AM - 5:30 PM (9-hour day)
//   - DB had IDs 577-580 (Jul 6-31) at $325 — CORRECT
//   - DB had ID 581 (Aug 4-7) at $300 — CORRECT (BC Day 4-day week)
//   - DB had ID 582 (Aug 10-14) at $300 — WRONG: should be $325 (5-day week)
//   - DB had ID 579 (Jul 20-24) as "Open" — WRONG: SOLD OUT on registration page
//   - DB missing Week 1 (Jun 29-Jul 3, $300, Canada Day week) — no ID available for new entry
//   - DB missing Week 8 (Aug 17-21) — SOLD OUT
//   - DB missing Weeks 9-10 (Aug 24-28, Aug 31-Sep 4) — Available
//   - Age range 5-10 is CORRECT (must have completed kindergarten if turning 5)
//   - Address "6140 McKercher Avenue, Burnaby, BC" confirmed correct
//   - Registration page: https://www.burnabyfamilylife.org/store/p/mckercher-summer-camp-2026
//   - Cancellation: prior to May 31 = refund less $50/week admin fee; after May 31 = no refund
//
// FULL SEASON (10 weeks):
//   Week 1:  Jun 29-Jul 3   Mon/Tue/Thu/Fri (Canada Day off)  $300  Available
//   Week 2:  Jul 6-10       Mon-Fri                            $325  Available
//   Week 3:  Jul 13-17      Mon-Fri                            $325  Available
//   Week 4:  Jul 20-24      Mon-Fri                            $325  SOLD OUT
//   Week 5:  Jul 27-31      Mon-Fri                            $325  Available
//   Week 6:  Aug 4-7        Tue-Fri (BC Day Aug 3 off)         $300  Available
//   Week 7:  Aug 10-14      Mon-Fri                            $325  Available
//   Week 8:  Aug 17-21      Mon-Fri                            $325  SOLD OUT
//   Week 9:  Aug 24-28      Mon-Fri                            $325  Available
//   Week 10: Aug 31-Sep 4   Mon-Fri                            $325  Available
//
// ID ASSIGNMENT (6 IDs cover 6 of 10 weeks — Weeks 1, 3, 8, 9, 10 not covered by a dedicated ID):
//   577 → Week 1 (Jun 29-Jul 3)  [repurposed from Jul 6-10]
//   578 → Week 2 (Jul 6-10)      [shifted from Jul 13-17]
//   579 → Week 4 (Jul 20-24)     SOLD OUT  [status fix]
//   580 → Week 5 (Jul 27-31)     [times fix]
//   581 → Week 6 (Aug 4-7)       [times fix]
//   582 → Week 7 (Aug 10-14)     [cost fix: $300→$325]

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

const PROVIDER = 'Burnaby Family Life';
const ADDRESS = '6140 McKercher Avenue, Burnaby, BC';
const LAT = 49.2295;
const LNG = -122.9814;
const REG_URL = 'https://www.burnabyfamilylife.org/store/p/mckercher-summer-camp-2026';

const COST_NOTE_325 = '$325 per 5-day week. 4-day holiday weeks (Canada Day, BC Day): $300. Cancellation prior to May 31: refund less $50/week admin fee. After May 31: no refund. Ages 5-10 (must have completed kindergarten if turning 5 in 2026). Full 10-week season: Jun 29–Sep 4. Check registration page for all available weeks.';
const COST_NOTE_300 = '$300 per 4-day holiday week (statutory holiday off). Standard 5-day weeks: $325. Cancellation prior to May 31: refund less $50/week admin fee. After May 31: no refund. Ages 5-10.';

// --- ID 577: Week 1 (Jun 29-Jul 3, Canada Day week, $300) ---
// Repurposed from Jul 6-10. Canada Day week: Mon/Tue/Thu/Fri (Jul 1 off).
fix(577, 'name', 'BFL McKercher Summer Camp — Week 1 (Jun 29-Jul 3)');
fix(577, 'cost', 300);
fix(577, 'costNote', COST_NOTE_300 + ' Canada Day week: Mon/Tue/Thu/Fri (Jul 1 off).');
fix(577, 'startDate', '2026-06-29');
fix(577, 'endDate', '2026-07-03');
fix(577, 'startTime', '8:30 AM');
fix(577, 'endTime', '5:30 PM');
fix(577, 'days', 'Mon, Tue, Thu, Fri');
fix(577, 'ageMin', 5);
fix(577, 'ageMax', 10);
fix(577, 'enrollmentStatus', 'Open');
fix(577, 'confirmed2026', true);
fix(577, 'priceVerified', true);
fix(577, 'isEstimate', false);
fix(577, 'address', ADDRESS);
fix(577, 'lat', LAT);
fix(577, 'lng', LNG);
fix(577, 'registrationUrl', REG_URL);
fix(577, 'description', 'Week 1 of BFL McKercher Summer Camp 2026. Educational, recreational and outdoor experiences for ages 5-10 (must have completed kindergarten). Canada Day week: Mon/Tue/Thu/Fri (Jul 1 off). 8:30am-5:30pm. 6140 McKercher Avenue, Burnaby.');

// --- ID 578: Week 2 (Jul 6-10, $325, Open) ---
fix(578, 'name', 'BFL McKercher Summer Camp — Week 2 (Jul 6-10)');
fix(578, 'cost', 325);
fix(578, 'costNote', COST_NOTE_325);
fix(578, 'startDate', '2026-07-06');
fix(578, 'endDate', '2026-07-10');
fix(578, 'startTime', '8:30 AM');
fix(578, 'endTime', '5:30 PM');
fix(578, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(578, 'ageMin', 5);
fix(578, 'ageMax', 10);
fix(578, 'enrollmentStatus', 'Open');
fix(578, 'confirmed2026', true);
fix(578, 'priceVerified', true);
fix(578, 'isEstimate', false);
fix(578, 'address', ADDRESS);
fix(578, 'lat', LAT);
fix(578, 'lng', LNG);
fix(578, 'registrationUrl', REG_URL);
fix(578, 'description', 'Week 2 of BFL McKercher Summer Camp 2026. Educational, recreational and outdoor experiences for ages 5-10. Mon-Fri, 8:30am-5:30pm. 6140 McKercher Avenue, Burnaby.');

// --- ID 579: Week 4 (Jul 20-24, $325, SOLD OUT) ---
// DB had "Open" — registration page shows Sold Out
fix(579, 'name', 'BFL McKercher Summer Camp — Week 4 (Jul 20-24)');
fix(579, 'cost', 325);
fix(579, 'costNote', COST_NOTE_325 + ' NOTE: This week is SOLD OUT as of Apr 2026.');
fix(579, 'startDate', '2026-07-20');
fix(579, 'endDate', '2026-07-24');
fix(579, 'startTime', '8:30 AM');
fix(579, 'endTime', '5:30 PM');
fix(579, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(579, 'ageMin', 5);
fix(579, 'ageMax', 10);
fix(579, 'enrollmentStatus', 'Full');
fix(579, 'confirmed2026', true);
fix(579, 'priceVerified', true);
fix(579, 'isEstimate', false);
fix(579, 'address', ADDRESS);
fix(579, 'lat', LAT);
fix(579, 'lng', LNG);
fix(579, 'registrationUrl', REG_URL);
fix(579, 'description', 'Week 4 of BFL McKercher Summer Camp 2026. SOLD OUT as of Apr 2026. Educational, recreational and outdoor experiences for ages 5-10. Mon-Fri, 8:30am-5:30pm. 6140 McKercher Avenue, Burnaby.');

// --- ID 580: Week 5 (Jul 27-31, $325, Open) ---
fix(580, 'name', 'BFL McKercher Summer Camp — Week 5 (Jul 27-31)');
fix(580, 'cost', 325);
fix(580, 'costNote', COST_NOTE_325);
fix(580, 'startDate', '2026-07-27');
fix(580, 'endDate', '2026-07-31');
fix(580, 'startTime', '8:30 AM');
fix(580, 'endTime', '5:30 PM');
fix(580, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(580, 'ageMin', 5);
fix(580, 'ageMax', 10);
fix(580, 'enrollmentStatus', 'Open');
fix(580, 'confirmed2026', true);
fix(580, 'priceVerified', true);
fix(580, 'isEstimate', false);
fix(580, 'address', ADDRESS);
fix(580, 'lat', LAT);
fix(580, 'lng', LNG);
fix(580, 'registrationUrl', REG_URL);
fix(580, 'description', 'Week 5 of BFL McKercher Summer Camp 2026. Educational, recreational and outdoor experiences for ages 5-10. Mon-Fri, 8:30am-5:30pm. 6140 McKercher Avenue, Burnaby.');

// --- ID 581: Week 6 (Aug 4-7, $300, BC Day week, Open) ---
// BC Day Aug 3 (Monday) — camp runs Tue-Fri
fix(581, 'name', 'BFL McKercher Summer Camp — Week 6 (Aug 4-7, BC Day week)');
fix(581, 'cost', 300);
fix(581, 'costNote', COST_NOTE_300 + ' BC Day week: Tue-Fri (Aug 3 BC Day off).');
fix(581, 'startDate', '2026-08-04');
fix(581, 'endDate', '2026-08-07');
fix(581, 'startTime', '8:30 AM');
fix(581, 'endTime', '5:30 PM');
fix(581, 'days', 'Tue, Wed, Thu, Fri');
fix(581, 'ageMin', 5);
fix(581, 'ageMax', 10);
fix(581, 'enrollmentStatus', 'Open');
fix(581, 'confirmed2026', true);
fix(581, 'priceVerified', true);
fix(581, 'isEstimate', false);
fix(581, 'address', ADDRESS);
fix(581, 'lat', LAT);
fix(581, 'lng', LNG);
fix(581, 'registrationUrl', REG_URL);
fix(581, 'description', 'Week 6 of BFL McKercher Summer Camp 2026 (BC Day week). Tue-Fri Aug 4-7 (BC Day Mon Aug 3 off). $300 for 4-day week. Educational, recreational and outdoor experiences for ages 5-10. 8:30am-5:30pm. 6140 McKercher Avenue, Burnaby.');

// --- ID 582: Week 7 (Aug 10-14, $325, Open) ---
// DB had $300 — WRONG: this is a full 5-day week, price is $325
fix(582, 'name', 'BFL McKercher Summer Camp — Week 7 (Aug 10-14)');
fix(582, 'cost', 325);
fix(582, 'costNote', COST_NOTE_325);
fix(582, 'startDate', '2026-08-10');
fix(582, 'endDate', '2026-08-14');
fix(582, 'startTime', '8:30 AM');
fix(582, 'endTime', '5:30 PM');
fix(582, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(582, 'ageMin', 5);
fix(582, 'ageMax', 10);
fix(582, 'enrollmentStatus', 'Open');
fix(582, 'confirmed2026', true);
fix(582, 'priceVerified', true);
fix(582, 'isEstimate', false);
fix(582, 'address', ADDRESS);
fix(582, 'lat', LAT);
fix(582, 'lng', LNG);
fix(582, 'registrationUrl', REG_URL);
fix(582, 'description', 'Week 7 of BFL McKercher Summer Camp 2026. Educational, recreational and outdoor experiences for ages 5-10. Mon-Fri, 8:30am-5:30pm. 6140 McKercher Avenue, Burnaby. Note: 10-week season runs Jun 29–Sep 4; Weeks 8 (Aug 17-21) is sold out. See registration page for Weeks 9-10 (Aug 24-Sep 4).');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
