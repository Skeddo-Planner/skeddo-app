#!/usr/bin/env node
// smashvball-audit-fix.cjs
// Fixes Smash Volleyball data (rank 190 audit, 2026-04-06)
//
// Source pages verified (browser navigation):
//   https://smashvball.com/registration/ (registration links confirmed)
//   https://smashvball.com/camps/ (full camp schedule — all programs, dates, prices)
//
// FINDINGS:
//   IDs 309-312: All fundamentally wrong:
//     - All listed as 9AM-4PM full day → WRONG: all camps are 3 hrs (9-12pm or 12:30-3:30pm)
//     - Location: 617-289 East 6th Ave (Smash gym) → WRONG: camps at Spanish Banks West (outdoor)
//     - cost: null → WRONG: $310 + 5% GST ($325.50 total) per week
//     - Ages 10-16 → WRONG: Grades 5-10 entering Sept 2026 (≈ ages 10-15)
//     - ID 312 (Jul 27-31) → NOT OFFERED IN 2026 (no July 27-31 camp listed)
//
//   MISSING PROGRAMS (extensive):
//     - Jul 13-17 indoor sessions: Gr 5-7 AM + Gr 5-7 PM (Shaughnessy Heights United Church)
//     - Jul 20-24 afternoon: Skills & Competition Gr 7-10 PM (Spanish Banks)
//     - Aug 10-14 outdoor: Gr 6-9 AM (Empire Field Beach Courts)
//     - Aug 10-14 indoor: Gr 7-8 AM + Gr 5-7 PM (Shaughnessy Heights United Church)
//     - Aug 17-21 outdoor: Gr 5-9 AM (Empire Field Beach Courts)
//     - Aug 24-28: Skills & Competition Gr 7-10 (Location TBA)
//     - Aug 31-Sep 4 indoor: Gr 5-7 AM + Gr 7-8 PM (Shaughnessy Heights United Church)
//     - Tuesday weekly: Gr 5-8 + Gr 7-10 at Spanish Banks (Jul 14 - Aug 25, $40+GST/session)

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const pid_map = new Map(programs.map(p => [String(p.id), p]));

let fixes = 0;
let added = 0;

function fix(id, field, value) {
  const p = pid_map.get(String(id));
  if (!p) { console.warn(`SKIP (not found): ${id}`); return; }
  p[field] = value;
  fixes++;
}

// Common base for Smash Volleyball camps
const SMASH_BASE = {
  provider: 'Smash Volleyball',
  category: 'Sports',
  campType: 'Summer Camp',
  days: 'Mon-Fri',
  indoorOutdoor: 'Outdoor',
  enrollmentStatus: 'Open',
  registrationUrl: 'https://smashvball.sportngin.com/register/form/105061522',
  tags: ['volleyball', 'sports', 'summer camp'],
  activityType: 'Volleyball',
  priceVerified: true,
  confirmed2026: true,
  season: 'Summer 2026',
  city: 'Vancouver',
  scheduleType: 'Half Day',
  dayLength: 'Half Day',
  durationPerDay: 3,
  cost: 310,
};

const SPANISH_BANKS = {
  address: 'Spanish Banks West Concession, 3800 NW Marine Dr, Vancouver, BC',
  neighbourhood: 'Point Grey',
  lat: 49.2736,
  lng: -123.2115,
  indoorOutdoor: 'Outdoor',
};

const SHAUGHNESSY_UC = {
  address: '1550 W 33rd Ave, Vancouver, BC',
  neighbourhood: 'Shaughnessy',
  lat: 49.2415,
  lng: -123.1455,
  indoorOutdoor: 'Indoor',
};

const EMPIRE_FIELD = {
  address: 'Empire Field Beach Courts, 100 N Renfrew St, Vancouver, BC',
  neighbourhood: 'Hastings-Sunrise',
  lat: 49.2813,
  lng: -123.0382,
  indoorOutdoor: 'Outdoor',
};

const SMASH_COST_NOTE = '$310 + 5% GST per week ($325.50 total). Register by grade entering September 2026. ' +
  'All levels welcome (beg, int, adv) unless noted. 50% skills / 50% games format. ' +
  'Early arrival / late pickup 15 min before/after for supervision. ' +
  'Registration: smashvball.sportngin.com/register/form/105061522';

// --- Fix ID 309: Jul 6-10 outdoor Gr 5-10 AM ---
fix(309, 'name', 'Summer Volleyball Camp: Skills & Games — Grades 5-10 (Jul 6-10)');
fix(309, 'ageMin', 10);
fix(309, 'ageMax', 15);
fix(309, 'address', SPANISH_BANKS.address);
fix(309, 'neighbourhood', SPANISH_BANKS.neighbourhood);
fix(309, 'lat', SPANISH_BANKS.lat);
fix(309, 'lng', SPANISH_BANKS.lng);
fix(309, 'indoorOutdoor', 'Outdoor');
fix(309, 'startTime', '9:00 AM');
fix(309, 'endTime', '12:00 PM');
fix(309, 'durationPerDay', 3);
fix(309, 'scheduleType', 'Half Day');
fix(309, 'dayLength', 'Half Day');
fix(309, 'cost', 310);
fix(309, 'priceVerified', true);
fix(309, 'registrationUrl', 'https://smashvball.sportngin.com/register/form/105061522');
fix(309, 'description',
  'Outdoor beach volleyball camp at Spanish Banks West for Grades 5-10 entering September 2026. ' +
  'All levels welcome. 50% skills development / 50% games. Coaches positively reinforce skills. ' +
  'Groups organized by friend requests and similar skill/age level.'
);
fix(309, 'costNote', SMASH_COST_NOTE);
console.log('Fixed ID 309: Jul 6-10 outdoor Gr 5-10, 9AM-12PM, Spanish Banks, $310+GST');

// --- Fix ID 310: Jul 13-17 outdoor Gr 5-10 AM ---
fix(310, 'name', 'Summer Volleyball Camp: Skills & Games — Grades 5-10 (Jul 13-17)');
fix(310, 'ageMin', 10);
fix(310, 'ageMax', 15);
fix(310, 'address', SPANISH_BANKS.address);
fix(310, 'neighbourhood', SPANISH_BANKS.neighbourhood);
fix(310, 'lat', SPANISH_BANKS.lat);
fix(310, 'lng', SPANISH_BANKS.lng);
fix(310, 'indoorOutdoor', 'Outdoor');
fix(310, 'startTime', '9:00 AM');
fix(310, 'endTime', '12:00 PM');
fix(310, 'durationPerDay', 3);
fix(310, 'scheduleType', 'Half Day');
fix(310, 'dayLength', 'Half Day');
fix(310, 'cost', 310);
fix(310, 'priceVerified', true);
fix(310, 'registrationUrl', 'https://smashvball.sportngin.com/register/form/105061522');
fix(310, 'description',
  'Outdoor beach volleyball camp at Spanish Banks West for Grades 5-10 entering September 2026. ' +
  'All levels welcome. 50% skills development / 50% games. Coaches positively reinforce skills. ' +
  'Groups organized by friend requests and similar skill/age level.'
);
fix(310, 'costNote', SMASH_COST_NOTE);
console.log('Fixed ID 310: Jul 13-17 outdoor Gr 5-10, 9AM-12PM, Spanish Banks, $310+GST');

// --- Fix ID 311: Jul 20-24 outdoor Gr 5-10 AM ---
fix(311, 'name', 'Summer Volleyball Camp: Skills & Games — Grades 5-10 (Jul 20-24)');
fix(311, 'ageMin', 10);
fix(311, 'ageMax', 15);
fix(311, 'address', SPANISH_BANKS.address);
fix(311, 'neighbourhood', SPANISH_BANKS.neighbourhood);
fix(311, 'lat', SPANISH_BANKS.lat);
fix(311, 'lng', SPANISH_BANKS.lng);
fix(311, 'indoorOutdoor', 'Outdoor');
fix(311, 'startTime', '9:00 AM');
fix(311, 'endTime', '12:00 PM');
fix(311, 'durationPerDay', 3);
fix(311, 'scheduleType', 'Half Day');
fix(311, 'dayLength', 'Half Day');
fix(311, 'cost', 310);
fix(311, 'priceVerified', true);
fix(311, 'registrationUrl', 'https://smashvball.sportngin.com/register/form/105061522');
fix(311, 'description',
  'Outdoor beach volleyball camp at Spanish Banks West for Grades 5-10 entering September 2026. ' +
  'All levels welcome. 50% skills development / 50% games. Coaches positively reinforce skills. ' +
  'Groups organized by friend requests and similar skill/age level.'
);
fix(311, 'costNote', SMASH_COST_NOTE);
console.log('Fixed ID 311: Jul 20-24 outdoor Gr 5-10, 9AM-12PM, Spanish Banks, $310+GST');

// --- Fix ID 312: Jul 27-31 — NOT OFFERED in 2026 ---
fix(312, 'confirmed2026', false);
fix(312, 'enrollmentStatus', 'Likely Coming Soon');
fix(312, 'costNote',
  'No July 27-31 camp offered in 2026. Provider offers Jul 6-10, 13-17, and 20-24 in July, ' +
  'then resumes in August. Retained in DB per R31. See smashvball.com/camps/ for current schedule.'
);
console.log('Fixed ID 312: Jul 27-31 — confirmed2026=false (not offered in 2026)');

// --- Add new camps ---

// Jul 13-17 Indoor AM — Gr 5-7 (Shaughnessy Heights United Church)
programs.push({
  ...SMASH_BASE,
  ...SHAUGHNESSY_UC,
  id: 16186,
  name: 'Summer Volleyball Camp: Skills & Games — Grades 5-7 Indoor AM (Jul 13-17)',
  ageMin: 10, ageMax: 12,
  startDate: '2026-07-13', endDate: '2026-07-17',
  startTime: '9:00 AM', endTime: '12:00 PM',
  description: 'Indoor volleyball camp at Shaughnessy Heights United Church for Grades 5-7 entering September 2026. All levels welcome. 50% skills / 50% games.',
  costNote: SMASH_COST_NOTE,
});
added++;
console.log('Added ID 16186: Jul 13-17 indoor Gr 5-7 AM (Shaughnessy Heights UC)');

// Jul 13-17 Indoor PM — Gr 5-7
programs.push({
  ...SMASH_BASE,
  ...SHAUGHNESSY_UC,
  id: 16187,
  name: 'Summer Volleyball Camp: Skills & Games — Grades 5-7 Indoor PM (Jul 13-17)',
  ageMin: 10, ageMax: 12,
  startDate: '2026-07-13', endDate: '2026-07-17',
  startTime: '12:30 PM', endTime: '3:30 PM',
  description: 'Indoor volleyball camp at Shaughnessy Heights United Church for Grades 5-7 entering September 2026. All levels welcome. 50% skills / 50% games.',
  costNote: SMASH_COST_NOTE,
});
added++;
console.log('Added ID 16187: Jul 13-17 indoor Gr 5-7 PM (Shaughnessy Heights UC)');

// Jul 20-24 outdoor PM — Skills & Competition Gr 7-10 (int/adv)
programs.push({
  ...SMASH_BASE,
  ...SPANISH_BANKS,
  id: 16188,
  name: 'Summer Volleyball Camp: Skills & Competition — Grades 7-10 PM (Jul 20-24)',
  ageMin: 12, ageMax: 15,
  startDate: '2026-07-20', endDate: '2026-07-24',
  startTime: '12:30 PM', endTime: '3:30 PM',
  description: 'Outdoor beach volleyball Skills & Competition camp at Spanish Banks West for intermediate/advanced Grades 7-10 entering September 2026. Higher-level competition focus.',
  costNote: SMASH_COST_NOTE + ' Intermediate/advanced players only.',
  tags: ['volleyball', 'sports', 'summer camp', 'competitive'],
});
added++;
console.log('Added ID 16188: Jul 20-24 outdoor Skills & Competition Gr 7-10 PM');

// Aug 10-14 outdoor AM — Gr 6-9 (Empire Field Beach Courts)
programs.push({
  ...SMASH_BASE,
  ...EMPIRE_FIELD,
  id: 16189,
  name: 'Summer Volleyball Camp: Skills & Games — Grades 6-9 Outdoor AM (Aug 10-14)',
  ageMin: 11, ageMax: 14,
  startDate: '2026-08-10', endDate: '2026-08-14',
  startTime: '9:00 AM', endTime: '12:00 PM',
  description: 'Outdoor beach volleyball camp at Empire Field Beach Courts for Grades 6-9 entering September 2026. All levels welcome. 50% skills / 50% games.',
  costNote: SMASH_COST_NOTE + ' Note: listed as "August 2025" on provider page — believed to be a typo for August 2026 based on context.',
});
added++;
console.log('Added ID 16189: Aug 10-14 outdoor Gr 6-9 AM (Empire Field Beach Courts)');

// Aug 10-14 indoor AM — Gr 7-8 (Shaughnessy Heights UC)
programs.push({
  ...SMASH_BASE,
  ...SHAUGHNESSY_UC,
  id: 16190,
  name: 'Summer Volleyball Camp: Skills & Games — Grades 7-8 Indoor AM (Aug 10-14)',
  ageMin: 12, ageMax: 13,
  startDate: '2026-08-10', endDate: '2026-08-14',
  startTime: '9:00 AM', endTime: '12:00 PM',
  description: 'Indoor volleyball camp at Shaughnessy Heights United Church for Grades 7-8 entering September 2026. All levels welcome. 50% skills / 50% games.',
  costNote: SMASH_COST_NOTE,
});
added++;
console.log('Added ID 16190: Aug 10-14 indoor Gr 7-8 AM (Shaughnessy Heights UC)');

// Aug 10-14 indoor PM — Gr 5-7
programs.push({
  ...SMASH_BASE,
  ...SHAUGHNESSY_UC,
  id: 16191,
  name: 'Summer Volleyball Camp: Skills & Games — Grades 5-7 Indoor PM (Aug 10-14)',
  ageMin: 10, ageMax: 12,
  startDate: '2026-08-10', endDate: '2026-08-14',
  startTime: '12:30 PM', endTime: '3:30 PM',
  description: 'Indoor volleyball camp at Shaughnessy Heights United Church for Grades 5-7 entering September 2026. All levels welcome. 50% skills / 50% games.',
  costNote: SMASH_COST_NOTE,
});
added++;
console.log('Added ID 16191: Aug 10-14 indoor Gr 5-7 PM (Shaughnessy Heights UC)');

// Aug 17-21 outdoor AM — Gr 5-9 (Empire Field Beach Courts)
programs.push({
  ...SMASH_BASE,
  ...EMPIRE_FIELD,
  id: 16192,
  name: 'Summer Volleyball Camp: Skills & Games — Grades 5-9 Outdoor AM (Aug 17-21)',
  ageMin: 10, ageMax: 14,
  startDate: '2026-08-17', endDate: '2026-08-21',
  startTime: '9:00 AM', endTime: '12:00 PM',
  description: 'Outdoor beach volleyball camp at Empire Field Beach Courts for Grades 5-9 entering September 2026. All levels welcome. 50% skills / 50% games.',
  costNote: SMASH_COST_NOTE + ' Note: listed as "August 2025" on provider page — believed to be a typo for August 2026.',
});
added++;
console.log('Added ID 16192: Aug 17-21 outdoor Gr 5-9 AM (Empire Field Beach Courts)');

// Aug 24-28 — Skills & Competition Gr 7-10 (Location TBA)
programs.push({
  ...SMASH_BASE,
  id: 16193,
  name: 'Summer Volleyball Camp: Skills & Competition — Grades 7-10 (Aug 24-28)',
  ageMin: 12, ageMax: 15,
  startDate: '2026-08-24', endDate: '2026-08-28',
  startTime: null, endTime: null,
  address: 'Location TBA — check smashvball.com/camps/ for updates',
  neighbourhood: 'Vancouver',
  lat: 49.2827,
  lng: -123.1207,
  indoorOutdoor: 'Indoor',
  description: 'Volleyball Skills & Competition camp for intermediate/advanced Grades 7-10 entering September 2026. Location to be announced — check provider website for updates.',
  costNote: '$310 + 5% GST per week ($325.50 total). Intermediate/advanced players only. Location TBA as of Apr 2026 — check smashvball.com/camps/ for updates.',
  tags: ['volleyball', 'sports', 'summer camp', 'competitive'],
});
added++;
console.log('Added ID 16193: Aug 24-28 Skills & Competition Gr 7-10 (location TBA)');

// Aug 31-Sep 4 indoor AM — Gr 5-7 (Shaughnessy Heights UC)
programs.push({
  ...SMASH_BASE,
  ...SHAUGHNESSY_UC,
  id: 16194,
  name: 'Summer Volleyball Camp: Skills & Games — Grades 5-7 Indoor AM (Aug 31-Sep 4)',
  ageMin: 10, ageMax: 12,
  startDate: '2026-08-31', endDate: '2026-09-04',
  startTime: '9:00 AM', endTime: '12:00 PM',
  description: 'Indoor volleyball camp at Shaughnessy Heights United Church for Grades 5-7 entering September 2026. All levels welcome. 50% skills / 50% games.',
  costNote: SMASH_COST_NOTE,
});
added++;
console.log('Added ID 16194: Aug 31-Sep 4 indoor Gr 5-7 AM (Shaughnessy Heights UC)');

// Aug 31-Sep 4 indoor PM — Gr 7-8
programs.push({
  ...SMASH_BASE,
  ...SHAUGHNESSY_UC,
  id: 16195,
  name: 'Summer Volleyball Camp: Skills & Games — Grades 7-8 Indoor PM (Aug 31-Sep 4)',
  ageMin: 12, ageMax: 13,
  startDate: '2026-08-31', endDate: '2026-09-04',
  startTime: '12:30 PM', endTime: '3:30 PM',
  description: 'Indoor volleyball camp at Shaughnessy Heights United Church for Grades 7-8 entering September 2026. All levels welcome. 50% skills / 50% games.',
  costNote: SMASH_COST_NOTE,
});
added++;
console.log('Added ID 16195: Aug 31-Sep 4 indoor Gr 7-8 PM (Shaughnessy Heights UC)');

// Tuesday Weekly — Gr 5-8 at Spanish Banks (Jul 14 - Aug 25)
programs.push({
  ...SMASH_BASE,
  ...SPANISH_BANKS,
  id: 16196,
  name: 'Volleyball Weekly Program: Skills & Games — Grades 5-8 (Tuesdays, Spanish Banks)',
  ageMin: 10, ageMax: 13,
  startDate: '2026-07-14', endDate: '2026-08-25',
  days: 'Tue',
  startTime: '4:15 PM', endTime: '5:45 PM',
  durationPerDay: 1.5,
  scheduleType: 'Activity',
  dayLength: 'Activity',
  campType: 'Summer Program',
  cost: 40,
  repeating: true,
  description: 'Weekly outdoor volleyball program at Spanish Banks West Concession for Grades 5-8 entering September 2026. All levels welcome. 7 sessions: Jul 14, 21, 28, Aug 4, 11, 18, 25. Register for 3, 5, or 7 sessions.',
  costNote: '$40 + 5% GST per session ($42 total). Register for 3, 5, or 7 sessions. Jul 14, 21, 28, Aug 4, 11, 18, 25. Location: Spanish Banks West Concession.',
  tags: ['volleyball', 'sports', 'weekly', 'outdoor'],
});
added++;
console.log('Added ID 16196: Tuesday weekly Gr 5-8, Spanish Banks, Jul 14-Aug 25, $40+GST/session');

// Tuesday Weekly — Gr 7-10 at Spanish Banks (Jul 14 - Aug 25)
programs.push({
  ...SMASH_BASE,
  ...SPANISH_BANKS,
  id: 16197,
  name: 'Volleyball Weekly Program: Skills & Games — Grades 7-10 (Tuesdays, Spanish Banks)',
  ageMin: 12, ageMax: 15,
  startDate: '2026-07-14', endDate: '2026-08-25',
  days: 'Tue',
  startTime: '5:45 PM', endTime: '7:15 PM',
  durationPerDay: 1.5,
  scheduleType: 'Activity',
  dayLength: 'Activity',
  campType: 'Summer Program',
  cost: 40,
  repeating: true,
  description: 'Weekly outdoor volleyball program at Spanish Banks West Concession for Grades 7-10 entering September 2026. All levels welcome. 7 sessions: Jul 14, 21, 28, Aug 4, 11, 18, 25. Register for 3, 5, or 7 sessions.',
  costNote: '$40 + 5% GST per session ($42 total). Register for 3, 5, or 7 sessions. Jul 14, 21, 28, Aug 4, 11, 18, 25. Location: Spanish Banks West Concession.',
  tags: ['volleyball', 'sports', 'weekly', 'outdoor'],
});
added++;
console.log('Added ID 16197: Tuesday weekly Gr 7-10, Spanish Banks, Jul 14-Aug 25, $40+GST/session');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`\nDone. Fixes: ${fixes}, Added: ${added}. Total programs: ${programs.length}`);
