#!/usr/bin/env node
// mygym-audit-fix.cjs
// Fixes My Gym Richmond data (rank 171 audit, 2026-04-06)
//
// Source: https://www.mygym.com/richmondbc/camp
//
// FINDINGS:
//   - Address in DB is WRONG: "5300 No. 3 Rd" → "Unit 9, 4751 Shell Road, Richmond, BC V6X 3H4"
//   - Cost in DB is WRONG: $250/week → $35/day (pay-per-session)
//   - Time: 1:00PM–4:00PM (half-day, 3 hours)
//   - Ages: "3yrs 6mos to 9yrs" on site — DB ageMin=3 kept (rounds down from 3.5)
//   - ONLY two confirmed weeks: Jul 6-10 and Aug 24-28, 2026
//     (Available Times grid lists exactly 10 sessions; daily themes listed for Jul 6-10 and Aug 24-28 only)
//   - IDs 348-352 cover non-existent weeks — repurpose 348 → Aug 24-28 (confirmed)
//   - IDs 349-352 → Likely Coming Soon (unconfirmed mid-summer weeks)
//   - registrationUrl: root homepage → /camp page
//   - enrollmentStatus: "Likely Coming Soon" → Open (for 347, 348)
//   - confirmed2026: false → true (for 347, 348 only)
//   - priceVerified: not set → true for 347/348 ($35/session confirmed on page)
//   - days format: "Mon-Fri" → "Mon, Tue, Wed, Thu, Fri"

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

const ADDRESS = 'Unit 9, 4751 Shell Road, Richmond, BC V6X 3H4';
const REG_URL = 'https://www.mygym.com/richmondbc/camp';
const COST_NOTE = '$35.00 per session (pay-per-day). No weekly package pricing. Early bird discount available. My Gym gripper socks mandatory (available for purchase). 15-min snack break included. Same-day cancellations are non-refundable.';
const AGE_JUSTIFIED = 'My Gym Richmond Summer Camp is for ages 3 years 6 months to 9 years. DB ageMin=3 is a rounded-down approximation of the 3.5-year minimum. No age-band subdivision — single cohort covers the full range.';

// Confirmed open sessions
fix(347, 'name', 'My Gym Richmond Summer Camp — Week 1 (Jul 6-10)');
fix(347, 'address', ADDRESS);
fix(347, 'cost', 35);
fix(347, 'costNote', COST_NOTE);
fix(347, 'registrationUrl', REG_URL);
fix(347, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(347, 'startDate', '2026-07-06');
fix(347, 'endDate', '2026-07-10');
fix(347, 'startTime', '1:00 PM');
fix(347, 'endTime', '4:00 PM');
fix(347, 'enrollmentStatus', 'Open');
fix(347, 'confirmed2026', true);
fix(347, 'priceVerified', true);
fix(347, 'ageSpanJustified', AGE_JUSTIFIED);
fix(347, 'lat', 49.1817);
fix(347, 'lng', -123.1444);

// Repurpose ID 348 → Aug 24-28 (confirmed last week)
fix(348, 'name', 'My Gym Richmond Summer Camp — Week 9 (Aug 24-28)');
fix(348, 'address', ADDRESS);
fix(348, 'cost', 35);
fix(348, 'costNote', COST_NOTE);
fix(348, 'registrationUrl', REG_URL);
fix(348, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(348, 'startDate', '2026-08-24');
fix(348, 'endDate', '2026-08-28');
fix(348, 'startTime', '1:00 PM');
fix(348, 'endTime', '4:00 PM');
fix(348, 'enrollmentStatus', 'Open');
fix(348, 'confirmed2026', true);
fix(348, 'priceVerified', true);
fix(348, 'ageSpanJustified', AGE_JUSTIFIED);
fix(348, 'lat', 49.1817);
fix(348, 'lng', -123.1444);

// IDs 349-352: Non-confirmed mid-summer weeks — mark as Likely Coming Soon
// The registration page (as of Apr 6, 2026) only shows Jul 6-10 and Aug 24-28.
// Mid-summer weeks may open later; keeping entries with corrected address/cost but unconfirmed status.
const MID_SUMMER_NOTE = COST_NOTE + ' NOTE: Only Jul 6-10 and Aug 24-28 confirmed in registration system as of Apr 2026. Additional mid-summer weeks may be added — check mygym.com/richmondbc/camp.';
for (const id of [349, 350, 351, 352]) {
  fix(id, 'address', ADDRESS);
  fix(id, 'cost', 35);
  fix(id, 'costNote', MID_SUMMER_NOTE);
  fix(id, 'registrationUrl', REG_URL);
  fix(id, 'days', 'Mon, Tue, Wed, Thu, Fri');
  fix(id, 'startTime', '1:00 PM');
  fix(id, 'endTime', '4:00 PM');
  fix(id, 'enrollmentStatus', 'Likely Coming Soon');
  fix(id, 'confirmed2026', false);
  fix(id, 'priceVerified', false);
  fix(id, 'ageSpanJustified', AGE_JUSTIFIED);
  fix(id, 'lat', 49.1817);
  fix(id, 'lng', -123.1444);
}

// Name the remaining entries clearly
fix(349, 'name', 'My Gym Richmond Summer Camp — Week 3 (Jul 20-24, unconfirmed)');
fix(349, 'startDate', '2026-07-20');
fix(349, 'endDate', '2026-07-24');
fix(350, 'name', 'My Gym Richmond Summer Camp — Week 4 (Jul 27-31, unconfirmed)');
fix(350, 'startDate', '2026-07-27');
fix(350, 'endDate', '2026-07-31');
fix(351, 'name', 'My Gym Richmond Summer Camp — Week 5 (Aug 4-7, unconfirmed)');
fix(351, 'startDate', '2026-08-04');
fix(351, 'endDate', '2026-08-07');
fix(351, 'days', 'Tue, Wed, Thu, Fri'); // BC Day Aug 3
fix(352, 'name', 'My Gym Richmond Summer Camp — Week 6 (Aug 10-14, unconfirmed)');
fix(352, 'startDate', '2026-08-10');
fix(352, 'endDate', '2026-08-14');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
