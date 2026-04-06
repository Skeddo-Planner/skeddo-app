#!/usr/bin/env node
// danceco-audit-fix.cjs
// Fixes Dance Co summer camp data (rank 147 audit, 2026-04-06)
//
// Source: https://www.danceco.com/summer-dance-camps
//         Registration: https://registration.danceco.com/camps
//
// Dance Co Arbutus (4230 Yew St) — 4 weeks: Jul 13-17, 20-24, 27-31, Aug 4-7
// July 6 and August 10 weeks are NOT offered in 2026.
//
// Age groups (per provider's exact breakdowns per R46):
//   Preschool: 3-4yr — AM only (9am-12pm)
//   Pre-Primary: 5-6yr — AM, PM, Full Day
//   Primary: 7-8yr — AM, PM, Full Day
//   Junior: 9-11yr — AM, PM, Full Day
//   Teen: 12-14yr — AM, PM, Full Day
//
// Pricing (verified live):
//   5-day weeks: AM $325, PM $270, Full Day $595
//   4-day week (Aug 4-7, BC Day): AM $240, PM $200, Full Day $440

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const pid_map = new Map(programs.map(p => [String(p.id), p]));
const existingIds = new Set(programs.map(p => String(p.id)));

let fixes = 0;
let added = 0;

function fix(id, field, value) {
  const p = pid_map.get(String(id));
  if (!p) { console.warn(`SKIP (not found): ${id}`); return; }
  p[field] = value;
  fixes++;
}

// Base fields for all Dance Co entries
const BASE = {
  provider: 'Dance Co',
  address: '4230 Yew Street, Vancouver, BC V6L 2E4',
  neighbourhood: 'Arbutus',
  lat: 49.2490,
  lng: -123.1566,
  city: 'Vancouver',
  enrollmentStatus: 'Open',
  confirmed2026: true,
  priceVerified: true,
  campType: 'Summer Camp',
  season: 'Summer 2026',
  activityType: 'Day Camp',
  category: 'Dance',
  indoorOutdoor: 'Indoor',
  days: 'Mon, Tue, Wed, Thu, Fri',
  registrationUrl: 'https://registration.danceco.com/camps',
  tags: ['camp', 'dance'],
};

// ── Update existing ids 71-76 to be Preschool (3-4yr) entries ─────────────
// id=71 (Jul 6 week): NOT OFFERED — Cancelled
for (const [f, v] of Object.entries(BASE)) fix(71, f, v);
fix(71, 'name', 'Dance Camp - Preschool (3-4yr)');
fix(71, 'ageMin', 3);
fix(71, 'ageMax', 4);
fix(71, 'enrollmentStatus', 'Cancelled');
fix(71, 'startDate', '2026-07-06');
fix(71, 'endDate', '2026-07-10');
fix(71, 'startTime', '9:00 AM');
fix(71, 'endTime', '12:00 PM');
fix(71, 'durationPerDay', 3);
fix(71, 'scheduleType', 'HalfDay');
fix(71, 'dayLength', 'Half Day');
fix(71, 'cost', 325);
fix(71, 'costNote', 'July 6-10 week not offered for 2026. Dance Co runs Jul 13, 20, 27 and Aug 4-7 only.');

// id=72 (Jul 13-17): Preschool 3-4yr, AM only, 5-day, $325
for (const [f, v] of Object.entries(BASE)) fix(72, f, v);
fix(72, 'name', 'Dance Camp - Preschool (3-4yr)');
fix(72, 'ageMin', 3);
fix(72, 'ageMax', 4);
fix(72, 'startDate', '2026-07-13');
fix(72, 'endDate', '2026-07-17');
fix(72, 'startTime', '9:00 AM');
fix(72, 'endTime', '12:00 PM');
fix(72, 'durationPerDay', 3);
fix(72, 'scheduleType', 'HalfDay');
fix(72, 'dayLength', 'Half Day');
fix(72, 'cost', 325);
fix(72, 'costNote', 'AM session only for Preschool (9am-12pm). Includes Ballet, Tap, Jazz, Hip Hop, Crafts.');

// id=73 (Jul 20-24): Preschool 3-4yr, AM only, 5-day, $325
for (const [f, v] of Object.entries(BASE)) fix(73, f, v);
fix(73, 'name', 'Dance Camp - Preschool (3-4yr)');
fix(73, 'ageMin', 3);
fix(73, 'ageMax', 4);
fix(73, 'startDate', '2026-07-20');
fix(73, 'endDate', '2026-07-24');
fix(73, 'startTime', '9:00 AM');
fix(73, 'endTime', '12:00 PM');
fix(73, 'durationPerDay', 3);
fix(73, 'scheduleType', 'HalfDay');
fix(73, 'dayLength', 'Half Day');
fix(73, 'cost', 325);
fix(73, 'costNote', 'AM session only for Preschool (9am-12pm). Includes Ballet, Tap, Jazz, Hip Hop, Crafts.');

// id=74 (Jul 27-31): Preschool 3-4yr, AM only, 5-day, $325
for (const [f, v] of Object.entries(BASE)) fix(74, f, v);
fix(74, 'name', 'Dance Camp - Preschool (3-4yr)');
fix(74, 'ageMin', 3);
fix(74, 'ageMax', 4);
fix(74, 'startDate', '2026-07-27');
fix(74, 'endDate', '2026-07-31');
fix(74, 'startTime', '9:00 AM');
fix(74, 'endTime', '12:00 PM');
fix(74, 'durationPerDay', 3);
fix(74, 'scheduleType', 'HalfDay');
fix(74, 'dayLength', 'Half Day');
fix(74, 'cost', 325);
fix(74, 'costNote', 'AM session only for Preschool (9am-12pm). Includes Ballet, Tap, Jazz, Hip Hop, Crafts.');

// id=75 (Aug 4-7): Preschool 3-4yr, AM only, 4-day (BC Day), $240
for (const [f, v] of Object.entries(BASE)) fix(75, f, v);
fix(75, 'name', 'Dance Camp - Preschool (3-4yr)');
fix(75, 'ageMin', 3);
fix(75, 'ageMax', 4);
fix(75, 'startDate', '2026-08-04');
fix(75, 'endDate', '2026-08-07');
fix(75, 'days', 'Tue, Wed, Thu, Fri');
fix(75, 'startTime', '9:00 AM');
fix(75, 'endTime', '12:00 PM');
fix(75, 'durationPerDay', 3);
fix(75, 'scheduleType', 'HalfDay');
fix(75, 'dayLength', 'Half Day');
fix(75, 'cost', 240);
fix(75, 'costNote', '4-day week (BC Day Aug 3). AM session only for Preschool (9am-12pm). Includes Ballet, Tap, Jazz, Hip Hop, Crafts.');

// id=76 (Aug 10 week): NOT OFFERED — Cancelled
for (const [f, v] of Object.entries(BASE)) fix(76, f, v);
fix(76, 'name', 'Dance Camp - Preschool (3-4yr)');
fix(76, 'ageMin', 3);
fix(76, 'ageMax', 4);
fix(76, 'enrollmentStatus', 'Cancelled');
fix(76, 'startDate', '2026-08-10');
fix(76, 'endDate', '2026-08-14');
fix(76, 'startTime', '9:00 AM');
fix(76, 'endTime', '12:00 PM');
fix(76, 'durationPerDay', 3);
fix(76, 'scheduleType', 'HalfDay');
fix(76, 'dayLength', 'Half Day');
fix(76, 'cost', 325);
fix(76, 'costNote', 'August 10-14 week not offered for 2026. Dance Co runs Jul 13, 20, 27 and Aug 4-7 only.');

console.log(`Existing entries updated: ${fixes} field changes`);

// ── Add new entries for Pre-Primary, Primary, Junior, Teen ────────────────
// 4 age groups × 4 weeks = 16 new entries
const ageGroups = [
  { suffix: 'pre-primary', name: 'Pre-Primary (5-6yr)', ageMin: 5, ageMax: 6 },
  { suffix: 'primary',     name: 'Primary (7-8yr)',     ageMin: 7, ageMax: 8 },
  { suffix: 'junior',      name: 'Junior (9-11yr)',     ageMin: 9, ageMax: 11 },
  { suffix: 'teen',        name: 'Teen (12-14yr)',      ageMin: 12, ageMax: 14 },
];

const weeks = [
  { wk: 1, start: '2026-07-13', end: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri', cost: 325, costNote4day: null },
  { wk: 2, start: '2026-07-20', end: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri', cost: 325, costNote4day: null },
  { wk: 3, start: '2026-07-27', end: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri', cost: 325, costNote4day: null },
  { wk: 4, start: '2026-08-04', end: '2026-08-07', days: 'Tue, Wed, Thu, Fri', cost: 270, costNote4day: '4-day week (BC Day Aug 3). ' },
];

for (const ag of ageGroups) {
  for (const wk of weeks) {
    const id = `DC-${ag.suffix}-wk${wk.wk}`;
    if (existingIds.has(id)) {
      console.warn(`SKIP (already exists): ${id}`);
      continue;
    }
    const note5day = `AM half-day (9am-12pm): $${wk.wk < 4 ? 325 : 240}; PM half-day (12:30-3pm): $${wk.wk < 4 ? 270 : 200}; Full Day (9am-3pm): $${wk.wk < 4 ? 595 : 440}. ` +
      (ag.ageMin <= 6 ? 'AM styles: Ballet, Tap, Jazz, Crafts. PM styles: Hip Hop, Acro, Musical Theatre.' :
       'AM styles: Hip Hop, Tap, Musical Theatre, Flex/Conditioning. PM styles: Ballet, Jazz, Contemporary.');
    const costNote = (wk.costNote4day || '') + note5day;
    programs.push({
      ...BASE,
      id,
      name: `Dance Camp - ${ag.name}`,
      ageMin: ag.ageMin,
      ageMax: ag.ageMax,
      startDate: wk.start,
      endDate: wk.end,
      days: wk.days,
      startTime: '9:00 AM',
      endTime: '3:00 PM',
      durationPerDay: 6,
      scheduleType: 'FullDay',
      dayLength: 'Full Day',
      cost: wk.cost,
      costNote,
    });
    added++;
  }
}

console.log(`New entries added: ${added}`);

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Total programs: ${programs.length}`);
