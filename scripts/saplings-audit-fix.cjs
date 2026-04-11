#!/usr/bin/env node
// saplings-audit-fix.cjs
// Fixes Saplings Outdoor Program data (rank 174 audit, 2026-04-06)
//
// Source pages verified (Amilia store):
//   https://app.amilia.com/store/en/saplings-outdoor-program-ltd/shop/programs
//   https://app.amilia.com/store/en/saplings-outdoor-program-ltd/shop/activities/6668736 (PH Day-to-Day Jun 29)
//   https://app.amilia.com/store/en/saplings-outdoor-program-ltd/shop/activities/6667596 (West Bay Jul 6-10)
//
// FINDINGS:
//   - DB had 6 generic "Outdoor Nature Camp" entries (IDs 509-514) — all wrong
//   - DB address "3663 Park Rd, North Vancouver" is WRONG
//   - DB cost $275 is WRONG: actual is $445/5-day week, $356/4-day BC Day week, $89/single day (Day-to-Day)
//   - DB had no times — actual: 8:30 AM - 4:30 PM
//   - DB had all 6 as "Full" — NOT accurate, varies by program and week
//   - DB had ageMin=3, ageMax=12 — needs to be split into proper age groups
//
// CONFIRMED PROGRAMS (4 distinct, 2 locations):
//   Location 1: Pemberton Heights | 1390 West 22nd Street, North Vancouver, BC, V7P 2G4
//     a) Multi-Age Camp (Ages 3-9): $445/week, Aug 10-28 FULL; Jul 6-Aug 7 Available
//     b) School Age Camp (Ages 5-12): $445/week, all weeks Available
//     c) Day to Day (Ages 3-9): $89/session, Jun 29+30+Jul 2+3 Available
//
//   Location 2: West Bay | 3175 Thompson Pl., West Vancouver, BC, V7V 3E3
//     a) Multi-Age Camp (Ages 3-9): $445/week, ALL WEEKS FULL/Waitlist
//
//   Season: Jun 29 – Aug 28, 2026
//   BC Day week (Aug 4-7): Tue-Fri, 4 days, $356
//   Canada Day Jul 1 off: Jun 29-Jul 3 week = Mon/Tue/Thu/Fri
//
// ID ASSIGNMENT (repurposing 6 existing IDs):
//   509 → Pemberton Heights Multi-Age Camp (Ages 3-9)  Jul 6-Aug 28
//   510 → Pemberton Heights School Age Camp (Ages 5-12) Jul 6-Aug 28
//   511 → West Bay Multi-Age Camp (Ages 3-9)            Jul 6-Aug 28
//   512 → Pemberton Heights Day to Day (Ages 3-9)       Jun 29-Jul 3
//   513 → placeholder (other PH location weeks / future use, Likely Coming Soon)
//   514 → placeholder (other PH location weeks / future use, Likely Coming Soon)

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

const PROVIDER = 'Saplings Outdoor Program';
const REG_URL = 'https://app.amilia.com/store/en/saplings-outdoor-program-ltd/shop/programs';

const PH_ADDRESS = '1390 West 22nd Street, North Vancouver, BC V7P 2G4';
const PH_LAT = 49.3490;
const PH_LNG = -123.1172;

const WB_ADDRESS = '3175 Thompson Pl., West Vancouver, BC V7V 3E3';
const WB_LAT = 49.3540;
const WB_LNG = -123.2436;

const CANCEL_NOTE = 'Cancellation: 7+ days before first day = refund less $35 admin fee. Within 7 days = no refund. Email saplingsreg@gmail.com for changes. Taxes waived.';

// Season: Jul 6–Aug 28 (8 weeks)
// BC Day week Aug 4-7 (Tue-Fri): $356. All other 5-day weeks: $445.
const SEASON_NOTE = 'Season Jul 6–Aug 28, 2026 (8 weeks). BC Day week Aug 4-7: Tue-Fri only ($356). All other weeks: Mon-Fri ($445). ' + CANCEL_NOTE;

// --- ID 509: Pemberton Heights Multi-Age Camp (Ages 3-9) ---
// Some weeks Available (Jul 6-Aug 7), some Full (Aug 10-28)
fix(509, 'name', 'Saplings Outdoor Program — Pemberton Heights Multi-Age Summer Camp (Ages 3-9)');
fix(509, 'provider', PROVIDER);
fix(509, 'address', PH_ADDRESS);
fix(509, 'lat', PH_LAT);
fix(509, 'lng', PH_LNG);
fix(509, 'cost', 445);
fix(509, 'costNote', '$445 + taxes waived per 5-day week. BC Day week (Aug 4-7, Tue-Fri): $356. Jul 6-Aug 7 weeks: Available. Aug 10-28 weeks: FULL. ' + CANCEL_NOTE);
fix(509, 'priceVerified', true);
fix(509, 'startDate', '2026-07-06');
fix(509, 'endDate', '2026-08-28');
fix(509, 'startTime', '8:30 AM');
fix(509, 'endTime', '4:30 PM');
fix(509, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(509, 'ageMin', 3);
fix(509, 'ageMax', 9);
fix(509, 'enrollmentStatus', 'Open');
fix(509, 'confirmed2026', true);
fix(509, 'isEstimate', false);
fix(509, 'repeating', true);
fix(509, 'registrationUrl', REG_URL);
fix(509, 'description', 'Full-day summer nature camp for ages 3-9 at Pemberton Heights (1390 West 22nd St, North Vancouver). Fort-building, fairy houses, nature art, bow & arrow crafting, outdoor games (Survival, Man Hunt, Capture the Flag). Jul 6-Aug 28, 2026. Jul 6-Aug 7 weeks available; Aug 10-28 full. Instructor: Heather Fraser.');

// --- ID 510: Pemberton Heights School Age Camp (Ages 5-12) ---
// All weeks Available
fix(510, 'name', 'Saplings Outdoor Program — Pemberton Heights School Age Summer Camp (Ages 5-12)');
fix(510, 'provider', PROVIDER);
fix(510, 'address', PH_ADDRESS);
fix(510, 'lat', PH_LAT);
fix(510, 'lng', PH_LNG);
fix(510, 'cost', 445);
fix(510, 'costNote', '$445 + taxes waived per 5-day week. BC Day week (Aug 4-7, Tue-Fri): $356. All weeks as of Apr 2026: Available. ' + CANCEL_NOTE);
fix(510, 'priceVerified', true);
fix(510, 'startDate', '2026-07-06');
fix(510, 'endDate', '2026-08-28');
fix(510, 'startTime', '8:30 AM');
fix(510, 'endTime', '4:30 PM');
fix(510, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(510, 'ageMin', 5);
fix(510, 'ageMax', 12);
fix(510, 'ageSpanJustified', 'Saplings Outdoor Program School Age Camp is for ages 5-12 (7-year span). Provider sells as a single cohort for school-aged children — no sub-division by age band in registration system. Multi-Age and School Age are separate listings at the same location.');
fix(510, 'enrollmentStatus', 'Open');
fix(510, 'confirmed2026', true);
fix(510, 'isEstimate', false);
fix(510, 'repeating', true);
fix(510, 'registrationUrl', REG_URL);
fix(510, 'description', 'Full-day summer nature camp for ages 5-12 at Pemberton Heights (1390 West 22nd St, North Vancouver). Nature exploration, fort-building, fairy houses, nature art, bow & arrow crafting, outdoor games. Jul 6-Aug 28, 2026 (8 weeks). All weeks available as of Apr 2026. Instructor: Heather Fraser.');

// --- ID 511: West Bay Multi-Age Camp (Ages 3-9) ---
// ALL weeks FULL/Waitlist
fix(511, 'name', 'Saplings Outdoor Program — West Bay Multi-Age Summer Camp (Ages 3-9)');
fix(511, 'provider', PROVIDER);
fix(511, 'address', WB_ADDRESS);
fix(511, 'lat', WB_LAT);
fix(511, 'lng', WB_LNG);
fix(511, 'cost', 445);
fix(511, 'costNote', '$445 + taxes waived per 5-day week. BC Day week (Aug 4-7, Tue-Fri): $356. All weeks FULL as of Apr 2026 — waitlist available via registration page. ' + CANCEL_NOTE);
fix(511, 'priceVerified', true);
fix(511, 'startDate', '2026-07-06');
fix(511, 'endDate', '2026-08-28');
fix(511, 'startTime', '8:30 AM');
fix(511, 'endTime', '4:30 PM');
fix(511, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(511, 'ageMin', 3);
fix(511, 'ageMax', 9);
fix(511, 'enrollmentStatus', 'Waitlist');
fix(511, 'confirmed2026', true);
fix(511, 'isEstimate', false);
fix(511, 'repeating', true);
fix(511, 'registrationUrl', REG_URL);
fix(511, 'description', 'Full-day summer nature camp for ages 3-9 at West Bay (3175 Thompson Pl., West Vancouver). Fort-building, fairy houses, nature art, outdoor games. Jul 6-Aug 28, 2026 (8 weeks). All weeks FULL as of Apr 2026 — join waitlist via registration. Instructor: Heather Fraser.');

// --- ID 512: Pemberton Heights Day to Day (Ages 3-9) ---
// Individual day sessions, Canada Day week only (Jun 29, 30, Jul 2, 3)
fix(512, 'name', 'Saplings Outdoor Program — Pemberton Heights Day to Day Summer Camp (Ages 3-9)');
fix(512, 'provider', PROVIDER);
fix(512, 'address', PH_ADDRESS);
fix(512, 'lat', PH_LAT);
fix(512, 'lng', PH_LNG);
fix(512, 'cost', 89);
fix(512, 'costNote', '$89.00 per session (pay-per-day). Canada Day week only: Jun 29, Jun 30, Jul 2, Jul 3 (Jul 1 Canada Day off). Taxes waived. ' + CANCEL_NOTE);
fix(512, 'priceVerified', true);
fix(512, 'startDate', '2026-06-29');
fix(512, 'endDate', '2026-07-03');
fix(512, 'startTime', '8:30 AM');
fix(512, 'endTime', '4:30 PM');
fix(512, 'days', 'Mon, Tue, Thu, Fri');
fix(512, 'ageMin', 3);
fix(512, 'ageMax', 9);
fix(512, 'enrollmentStatus', 'Open');
fix(512, 'confirmed2026', true);
fix(512, 'isEstimate', false);
fix(512, 'registrationUrl', REG_URL);
fix(512, 'description', 'Pay-per-day nature camp for ages 3-9 at Pemberton Heights (1390 West 22nd St, North Vancouver). Canada Day week only: Jun 29, Jun 30, Jul 2, Jul 3. $89/day. Same activities as weekly camps: nature exploration, fort-building, fairy houses, outdoor games. Register for individual days.');

// --- IDs 513-514: Placeholder entries (other PH weeks / other locations) ---
// These IDs were originally Jun 29-Jul 3 through Aug 10-14 duplicates.
// Other Saplings locations (Canyon Heights, Glen Eagles, Lions Bay, Oakridge)
// not confirmed for summer 2026 on the registration page as of Apr 2026.
fix(513, 'name', 'Saplings Outdoor Program — Summer Camp (Other Location, unconfirmed)');
fix(513, 'provider', PROVIDER);
fix(513, 'address', PH_ADDRESS);
fix(513, 'lat', PH_LAT);
fix(513, 'lng', PH_LNG);
fix(513, 'cost', null);
fix(513, 'costNote', 'Summer 2026 sessions at additional Saplings locations (Canyon Heights, Glen Eagles, Lions Bay, Oakridge) not confirmed on Amilia registration page as of Apr 2026. Check https://app.amilia.com/store/en/saplings-outdoor-program-ltd/shop/programs for updates. When confirmed: likely $445/week, ages 3-9 or 5-12, 8:30am-4:30pm.');
fix(513, 'priceVerified', false);
fix(513, 'enrollmentStatus', 'Likely Coming Soon');
fix(513, 'confirmed2026', false);
fix(513, 'registrationUrl', REG_URL);

fix(514, 'name', 'Saplings Outdoor Program — Summer Camp (Other Location, unconfirmed)');
fix(514, 'provider', PROVIDER);
fix(514, 'address', PH_ADDRESS);
fix(514, 'lat', PH_LAT);
fix(514, 'lng', PH_LNG);
fix(514, 'cost', null);
fix(514, 'costNote', 'Summer 2026 sessions at additional Saplings locations not confirmed on Amilia registration page as of Apr 2026. Check registration page for updates.');
fix(514, 'priceVerified', false);
fix(514, 'enrollmentStatus', 'Likely Coming Soon');
fix(514, 'confirmed2026', false);
fix(514, 'registrationUrl', REG_URL);

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
