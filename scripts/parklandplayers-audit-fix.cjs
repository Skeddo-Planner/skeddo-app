#!/usr/bin/env node
// parklandplayers-audit-fix.cjs
// Fixes Parkland Players Summer Camp data (rank 182 audit, 2026-04-06)
//
// Source page verified:
//   https://parklandplayers.com/programs#summer-camp
//   (old URL https://parklandplayers.com/programs/summer-camp-coquitlam-daycare-summer-school returns 404)
//
// FINDINGS:
//   - DB cost=$275 WRONG: actual $325–$355/week (varies by week)
//   - DB startTime=9:00AM WRONG: actual 7:30 AM
//   - DB endTime=4:00PM WRONG: actual 5:30 PM
//   - DB has 6 entries (Jul 6 – Aug 14), missing 3 weeks:
//       Jun 28 week (Jun 29-Jul 3, Canada Day week): $325
//       Aug 16 week (Aug 17-21): $355
//       Aug 23 week (Aug 24-27, season ends Aug 27): $355
//   - DB status "Likely Coming Soon" with confirmed2026=true — contradictory;
//     registration is via contact ("Contact us to register") → setting Open
//   - DB registrationUrl is 404 → updated to programs#summer-camp
//   - Address 900 Sharpe St = Parkland Elementary School ✓ (confirmed on provider page)
//
// CONFIRMED SUMMER 2026 SCHEDULE AND PRICING:
//   Season: Jun 28, 2026 – Aug 27, 2026 (9 weeks)
//   Hours: 7:30 AM – 5:30 PM, Monday–Friday
//   Ages: 6–12 years
//   Location: Parkland Elementary School, 900 Sharpe St, Coquitlam, BC
//
//   Week (starts Sunday) | DB startDate | DB endDate  | Fee
//   Jun 28               | 2026-06-29   | 2026-07-03  | $325  [MISSING — added]
//   Jul 5                | 2026-07-06   | 2026-07-10  | $355  [ID 597]
//   Jul 12               | 2026-07-13   | 2026-07-17  | $335  [ID 598]
//   Jul 19               | 2026-07-20   | 2026-07-24  | $345  [ID 599]
//   Jul 26               | 2026-07-27   | 2026-07-31  | $355  [ID 600]
//   Aug 2 (BC Day)       | 2026-08-04   | 2026-08-07  | $325  [ID 601, 4 days: BC Day Aug 3 off]
//   Aug 9                | 2026-08-10   | 2026-08-14  | $335  [ID 602]
//   Aug 16               | 2026-08-17   | 2026-08-21  | $355  [MISSING — added]
//   Aug 23               | 2026-08-24   | 2026-08-27  | $355  [MISSING — added, Thu end]

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

const PROVIDER = 'Parkland Players';
const ADDRESS = '900 Sharpe St, Coquitlam, BC';
const LAT = 49.257;
const LNG = -122.8055;
const REG_URL = 'https://parklandplayers.com/programs#summer-camp';
const COST_NOTE_BASE = 'Weekly rates vary: $325–$355/week depending on the week. 7:30am-5:30pm, Mon-Fri. Ages 6-12. Registration via contact: web.kinderlogix.com/registration.php?cid=1285 or call (604) 936-7005. Season Jun 28–Aug 27, 2026.';

const weekData = [
  { id: 597,  name: 'Week 2 (Jul 6-10)',   start: '2026-07-06', end: '2026-07-10', cost: 355, days: 'Mon, Tue, Wed, Thu, Fri' },
  { id: 598,  name: 'Week 3 (Jul 13-17)',  start: '2026-07-13', end: '2026-07-17', cost: 335, days: 'Mon, Tue, Wed, Thu, Fri' },
  { id: 599,  name: 'Week 4 (Jul 20-24)',  start: '2026-07-20', end: '2026-07-24', cost: 345, days: 'Mon, Tue, Wed, Thu, Fri' },
  { id: 600,  name: 'Week 5 (Jul 27-31)',  start: '2026-07-27', end: '2026-07-31', cost: 355, days: 'Mon, Tue, Wed, Thu, Fri' },
  { id: 601,  name: 'Week 6 BC Day (Aug 4-7)', start: '2026-08-04', end: '2026-08-07', cost: 325, days: 'Tue, Wed, Thu, Fri' },
  { id: 602,  name: 'Week 7 (Aug 10-14)', start: '2026-08-10', end: '2026-08-14', cost: 335, days: 'Mon, Tue, Wed, Thu, Fri' },
];

weekData.forEach(({ id, name, start, end, cost, days }) => {
  fix(id, 'name', `Parkland Players — Summer Camp ${name}`);
  fix(id, 'provider', PROVIDER);
  fix(id, 'cost', cost);
  fix(id, 'costNote', `$${cost}/week (this week). ${COST_NOTE_BASE}`);
  fix(id, 'priceVerified', true);
  fix(id, 'startTime', '7:30 AM');
  fix(id, 'endTime', '5:30 PM');
  fix(id, 'startDate', start);
  fix(id, 'endDate', end);
  fix(id, 'days', days);
  fix(id, 'enrollmentStatus', 'Open');
  fix(id, 'confirmed2026', true);
  fix(id, 'registrationUrl', REG_URL);
  fix(id, 'address', ADDRESS);
  fix(id, 'lat', LAT);
  fix(id, 'lng', LNG);
});

// Helper to add new week entry
function addWeek(id, name, start, end, cost, days) {
  const baseEntry = programs.find(p => String(p.id) === '597');
  const newEntry = Object.assign({}, baseEntry, {
    id,
    name: `Parkland Players — Summer Camp ${name}`,
    provider: PROVIDER,
    cost,
    costNote: `$${cost}/week (this week). ${COST_NOTE_BASE}`,
    priceVerified: true,
    startDate: start,
    endDate: end,
    startTime: '7:30 AM',
    endTime: '5:30 PM',
    days,
    enrollmentStatus: 'Open',
    confirmed2026: true,
    registrationUrl: REG_URL,
    address: ADDRESS,
    lat: LAT,
    lng: LNG,
  });
  programs.push(newEntry);
  pid_map.set(String(id), newEntry);
  fixes++;
  console.log(`Added: ${id} (${name})`);
}

// Week 1: Jun 28 (Canada Day week — Jun 29-Jul 3; Canada Day Jul 1 falls midweek)
addWeek('parkland-players-w1', 'Week 1 Canada Day (Jun 29-Jul 3)', '2026-06-29', '2026-07-03', 325, 'Mon, Tue, Wed, Thu, Fri');

// Week 8: Aug 16
addWeek('parkland-players-w8', 'Week 8 (Aug 17-21)', '2026-08-17', '2026-08-21', 355, 'Mon, Tue, Wed, Thu, Fri');

// Week 9: Aug 23 (season ends Aug 27 — Thursday)
addWeek('parkland-players-w9', 'Week 9 (Aug 24-27)', '2026-08-24', '2026-08-27', 355, 'Mon, Tue, Wed, Thu');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
