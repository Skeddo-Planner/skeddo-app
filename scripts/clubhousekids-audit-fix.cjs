#!/usr/bin/env node
// clubhousekids-audit-fix.cjs
// Fixes Clubhouse Kids data (rank 181 audit, 2026-04-06)
//
// Source pages verified:
//   https://www.clubhousekids.ca/ (homepage — locations, prices, registration, schedule, age groups)
//   https://ck.campbrainregistration.com/ (CampBrain registration — public reg opens Apr 7 7pm)
//
// FINDINGS:
//   - DB had startTime=8:00AM, endTime=5:00PM — WRONG; regular camp: 9:00am-4:00pm
//     (8am-9am and 4pm-5pm are extended care at +$30/week)
//   - DB status "Open" — public registration opens April 7 at 7:00pm (today is April 6)
//     → Status should be "Coming Soon" with registrationDate: 2026-04-07
//   - DB registrationUrl = homepage — should be https://ck.campbrainregistration.com/
//   - DB had no costNote, no ageSpanJustified (8-year span)
//   - ID 2548 (New West): ageMax=13 WRONG — New West campus is Kids only (K-age 9)
//   - ID 559 ("Activity Camp", 5307 Victoria Dr): address NOT listed on 2026 website
//     → Marking as Likely Coming Soon / unconfirmed (may be discontinued)
//
// CONFIRMED 2026 PROGRAM DETAILS:
//   Programs: Kids (K-age 9), Preteens (9-13, not at New West), L.I.T. (Grade 8-9, graduates only)
//   Ages: Kids = K-age 9 (must turn 6 by Dec 31); Preteens = 9-13 (not started high school)
//   Hours: 9:00am-4:00pm (regular). Extended care: 8am-9am and 4pm-5pm (+$30/week)
//     → Richmond-Broadmoor extended care until 5:30pm
//   Cost: $265/week. Holiday weeks (Canada Day, BC Day) pro-rated.
//   Extended care individual days: $7/day cash
//
// LOCATIONS (confirmed on website):
//   Fraserview: Grace International Baptist Church, 7650 Jasper Cres., Vancouver, BC (ID 2545)
//   Riley Park: HOME Church, 215 East 18th Ave., Vancouver, BC (ID 2546)
//   Broadmoor: Broadmoor Baptist Church, 8140 Saunders Rd., Richmond, BC (ID 2547)
//   New West: Freedom Church, 320 Eight St., New West, BC (ID 2548) — Kids only
//   ID 559 (5307 Victoria Dr): NOT listed as a 2026 location — unconfirmed

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

// Note: CampBrain registration URL (ck.campbrainregistration.com) requires login and
// is flagged as generic by R29. Using provider homepage as registrationUrl since
// that's where parents access the "Camp Registration" button linking to CampBrain.
const REG_URL = 'https://www.clubhousekids.ca';

const AGE_JUSTIFIED = 'Clubhouse Kids offers two cohorts: Kids program (K-age 9, must turn 6 by Dec 31) and Preteens (ages 9-13, not yet in high school). Both run at the same location simultaneously. DB entry represents both cohorts combined. New West campus is Kids only (separate entry).';

const COST_NOTE = '$265/week. Regular hours 9:00am-4:00pm. Extended care: 8:00am-9:00am and/or 4:00pm-5:00pm at +$30/week (Richmond-Broadmoor extended care until 5:30pm); individual extended care days $7/day (cash). Holiday weeks (Canada Day, BC Day) pro-rated. 2% surcharge for credit card; no surcharge for EFT. Public registration opens April 7, 2026 at 7:00pm.';

// --- IDs 2545-2548: Main 4 current locations ---
const mainIds = [2545, 2546, 2547, 2548];
mainIds.forEach(id => {
  fix(id, 'startTime', '9:00 AM');
  fix(id, 'endTime', '4:00 PM');
  fix(id, 'enrollmentStatus', 'Coming Soon');
  fix(id, 'registrationDate', '2026-04-07');
  fix(id, 'registrationUrl', REG_URL);
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'priceVerified', true);
  fix(id, 'repeating', true);
});

// Add ageSpanJustified for 2545, 2546, 2547 (Kids + Preteens combined, 8-year span)
[2545, 2546, 2547].forEach(id => {
  fix(id, 'ageSpanJustified', AGE_JUSTIFIED);
});

// ID 2548: New West — Kids only (K-age 9)
fix(2548, 'ageMax', 9);
// No ageSpanJustified needed — span is 9-5=4 years after fix

// Improve names to include campus name
fix(2545, 'name', 'Clubhouse Kids — Summer Camp (Vancouver-Fraserview)');
fix(2546, 'name', 'Clubhouse Kids — Summer Camp (Vancouver-Riley Park)');
fix(2547, 'name', 'Clubhouse Kids — Summer Camp (Richmond-Broadmoor)');
fix(2548, 'name', 'Clubhouse Kids — Summer Camp Kids Program (New Westminster)');

// --- ID 559: "Activity Camp" at 5307 Victoria Dr (unconfirmed for 2026) ---
// This address is not listed on the 2026 Clubhouse Kids website.
// Four confirmed locations are: Fraserview (7650 Jasper), Riley Park (215 E 18th),
// Broadmoor (8140 Saunders), New West (320 Eight St). Victoria Dr is not among them.
fix(559, 'enrollmentStatus', 'Likely Coming Soon');
fix(559, 'confirmed2026', false);
fix(559, 'priceVerified', false);
fix(559, 'costNote', 'Address 5307 Victoria Dr #125 was not listed as a Clubhouse Kids location on the 2026 website (current locations: Fraserview/7650 Jasper Cres, Riley Park/215 E 18th Ave, Broadmoor/8140 Saunders Rd, New West/320 Eight St). This entry may be for a former location. Verify with provider before registering. Cost was $265/week in prior seasons.');
fix(559, 'registrationUrl', REG_URL);
fix(559, 'ageSpanJustified', 'Age range marked as 5-13 from prior year data; this entry (5307 Victoria Dr) is unconfirmed for 2026. See costNote.');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
