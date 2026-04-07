#!/usr/bin/env node
// fraserviewgolf-audit-fix.cjs
// Fixes Fraserview Golf Academy data (rank 184 audit, 2026-04-06)
//
// Source pages verified (browser navigation):
//   https://www.fraserviewgolfacademy.com/golf-camps.html (main camps page)
//   https://fraserviewgolfacademy.as.me/squirrelsam1  (Pro-D Squirrels AM: Apr 24, 27, May 15, 18)
//   https://fraserviewgolfacademy.as.me/SQAMSUMMER20261947 (Summer Squirrels AM: Jun 15–Aug 31)
//   https://fraserviewgolfacademy.as.me/weekend471   (Weekend 4-7: Apr 18, May 23, Jun 27, Aug 1 — all Full)
//   https://fraserviewgolfacademy.as.me/weekend8121  (Weekend 8-12: Apr 12, May 17, Jun 21, Jul 26 — Jul 26 has 4 spots)
//
// FINDINGS:
//   1. ALL 5 existing entries marked "Likely Coming Soon" with confirmed2026=false —
//      Summer Camp Registration opened April 3, 2026. Status should be "Open" or "Full".
//
//   2. Pro-D day camps: DB only had AM sessions. Website also has PM sessions:
//      - PM Squirrels (4-6): 1:30pm–4:30pm
//      - PM Gophers (7-9):   1:00pm–4:00pm
//      - PM Eagles (10-14):  1:15pm–4:15pm
//      (3 new entries needed)
//
//   3. Summer Break Camps: 8 distinct programs NOT in DB at all, registration OPEN:
//      - AM Squirrels (4-6):           $235+GST, 10:00am–12:00pm
//      - PM Squirrels (4-6):           $235+GST, 12:45pm–2:45pm
//      - AM Gophers (7-9):             $355+GST, 9:30am–12:30pm
//      - PM Gophers (7-9):             $355+GST, 1:00pm–4:00pm
//      - Gophers Performance (7-9):    $395+GST, 11:00am–2:15pm
//      - Eagles (10-14):               $525+GST, 9:45am–1:45pm
//      - Eagles Performance (10-14):   $595+GST, 9:00am–1:30pm
//      - Pre-Summer Camp (10-14):      $525+GST, 11:00am–3:00pm
//      All run Mon–Fri, weekly sessions Jun 15–Aug 31, 2026 (12 weeks)
//
//   4. Weekend 4-7: All 4 session blocks full (Apr 18, May 23, Jun 27, Aug 1) → "Full"
//   5. Weekend 8-12: Jul 26 session has 4 spots → "Open"
//
//   6. registrationUrls updated from generic catalog to specific booking pages
//   7. Cost confirmed: $89+GST pro-D, $189+GST weekend, $235–$595+GST summer
//   8. Address 7800 Vivian Drive, Vancouver (Fraserview Golf Course, Killarney) ✓
//
// PRO-D DAY DATES (from website + registration page):
//   Past: April 3 (Good Fri), 6 (Easter Mon), 17, 20
//   Upcoming: April 24, 27, May 15, 18 (Victoria Day)

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const pid_map = new Map(programs.map(p => [String(p.id), p]));

let added = 0;
let fixes = 0;

function fix(id, field, value) {
  const p = pid_map.get(String(id));
  if (!p) { console.warn(`SKIP (not found): ${id}`); return; }
  p[field] = value;
  fixes++;
}

const PROVIDER = 'Fraserview Golf Academy';
const ADDRESS = '7800 Vivian Drive, Vancouver, BC';
const LAT = 49.2178;
const LNG = -123.0333;
const NEIGHBOURHOOD = 'Killarney';
const CITY = 'Vancouver';

// Pro-D day cost note
const PROD_COST_NOTE = '$89 + GST = $93.45 per session. One-day camp on holidays and Pro-D days. ' +
  '2026 dates (Holiday & Pro-D): April 3 (Good Friday), 6 (Easter Monday), 17, 20, 24, 27; May 15, 18 (Victoria Day). ' +
  'Golf clubs included. Bring snacks, lunch, water bottle, hat, sunscreen. Max 6 students per class.';

// Weekend camp cost note
const WEEKEND_COST_NOTE = '$189 + GST = $198.45 per 5-week block (1.5 hrs/week). Runs Saturday or Sunday afternoons. ' +
  'Max 6 students per class. Open to all abilities; fundamentals, full swing and short game. ' +
  '2026 session blocks: Ages 4-7 (Sat) Apr 18, May 23, Jun 27, Aug 1; Ages 8-12 (Sun) Apr 12, May 17, Jun 21, Jul 26.';

// --- Update existing Pro-D AM entries ---
// fraserview-golf-1: AM Squirrels (4-6)
fix('fraserview-golf-1', 'enrollmentStatus', 'Open');
fix('fraserview-golf-1', 'confirmed2026', true);
fix('fraserview-golf-1', 'priceVerified', true);
fix('fraserview-golf-1', 'startDate', '2026-04-03');
fix('fraserview-golf-1', 'endDate', '2026-05-18');
fix('fraserview-golf-1', 'days', 'Varies (holidays and Pro-D days)');
fix('fraserview-golf-1', 'registrationUrl', 'https://fraserviewgolfacademy.as.me/squirrelsam1');
fix('fraserview-golf-1', 'costNote', PROD_COST_NOTE);
fix('fraserview-golf-1', 'campType', 'Holiday/Pro-D Day');

// fraserview-golf-2: AM Gophers (7-9)
fix('fraserview-golf-2', 'enrollmentStatus', 'Open');
fix('fraserview-golf-2', 'confirmed2026', true);
fix('fraserview-golf-2', 'priceVerified', true);
fix('fraserview-golf-2', 'startDate', '2026-04-03');
fix('fraserview-golf-2', 'endDate', '2026-05-18');
fix('fraserview-golf-2', 'days', 'Varies (holidays and Pro-D days)');
fix('fraserview-golf-2', 'registrationUrl', 'https://fraserviewgolfacademy.as.me/gophersam1');
fix('fraserview-golf-2', 'costNote', PROD_COST_NOTE);
fix('fraserview-golf-2', 'campType', 'Holiday/Pro-D Day');

// fraserview-golf-3: AM Eagles (10-14)
fix('fraserview-golf-3', 'enrollmentStatus', 'Open');
fix('fraserview-golf-3', 'confirmed2026', true);
fix('fraserview-golf-3', 'priceVerified', true);
fix('fraserview-golf-3', 'startDate', '2026-04-03');
fix('fraserview-golf-3', 'endDate', '2026-05-18');
fix('fraserview-golf-3', 'days', 'Varies (holidays and Pro-D days)');
fix('fraserview-golf-3', 'registrationUrl', 'https://fraserviewgolfacademy.as.me/eaglesam1');
fix('fraserview-golf-3', 'costNote', PROD_COST_NOTE);
fix('fraserview-golf-3', 'campType', 'Holiday/Pro-D Day');

// --- Update existing Weekend entries ---
// fraserview-golf-4: Weekend Ages 4-7 (Sat afternoons — all sessions Full)
fix('fraserview-golf-4', 'enrollmentStatus', 'Full');
fix('fraserview-golf-4', 'confirmed2026', true);
fix('fraserview-golf-4', 'priceVerified', true);
fix('fraserview-golf-4', 'startDate', '2026-04-18');
fix('fraserview-golf-4', 'endDate', '2026-09-05'); // Aug 1 session × 5 weeks ends ~Sep 5
fix('fraserview-golf-4', 'startTime', '2:30 PM');
fix('fraserview-golf-4', 'endTime', '4:00 PM');
fix('fraserview-golf-4', 'days', 'Sat');
fix('fraserview-golf-4', 'repeating', true);
fix('fraserview-golf-4', 'registrationUrl', 'https://fraserviewgolfacademy.as.me/weekend471');
fix('fraserview-golf-4', 'costNote', WEEKEND_COST_NOTE);
fix('fraserview-golf-4', 'campType', 'Year-Round Program');

// fraserview-golf-5: Weekend Ages 8-12 (Sun afternoons — Jul 26 has 4 spots = Open)
fix('fraserview-golf-5', 'enrollmentStatus', 'Open');
fix('fraserview-golf-5', 'confirmed2026', true);
fix('fraserview-golf-5', 'priceVerified', true);
fix('fraserview-golf-5', 'startDate', '2026-04-12');
fix('fraserview-golf-5', 'endDate', '2026-08-30'); // Jul 26 × 5 weeks ends ~Aug 30
fix('fraserview-golf-5', 'startTime', '2:30 PM');
fix('fraserview-golf-5', 'endTime', '4:00 PM');
fix('fraserview-golf-5', 'days', 'Sun');
fix('fraserview-golf-5', 'repeating', true);
fix('fraserview-golf-5', 'registrationUrl', 'https://fraserviewgolfacademy.as.me/weekend8121');
fix('fraserview-golf-5', 'costNote', WEEKEND_COST_NOTE);
fix('fraserview-golf-5', 'campType', 'Year-Round Program');

console.log(`Updated 5 existing entries (${fixes} field changes)`);
const before = fixes;

// Helper to add new program
function addProgram(obj) {
  const entry = Object.assign({
    provider: PROVIDER,
    category: 'Sports',
    activityType: 'Golf',
    indoorOutdoor: 'Outdoor',
    address: ADDRESS,
    lat: LAT,
    lng: LNG,
    neighbourhood: NEIGHBOURHOOD,
    city: CITY,
    confirmed2026: true,
    priceVerified: true,
    urlVerified: true,
    season: 'Summer 2026',
    tags: ['golf', 'sport', 'outdoor'],
  }, obj);
  programs.push(entry);
  pid_map.set(String(entry.id), entry);
  added++;
  console.log(`Added: ${entry.id} — ${entry.name}`);
}

// --- New Pro-D PM entries ---
addProgram({
  id: 'fraserview-golf-6',
  name: 'Jr Golf Pro-D Camp Squirrels PM Ages 4-6',
  campType: 'Holiday/Pro-D Day',
  ageMin: 4, ageMax: 6,
  startTime: '1:30 PM', endTime: '4:30 PM',
  cost: 89,
  costNote: PROD_COST_NOTE,
  enrollmentStatus: 'Open',
  startDate: '2026-04-03',
  endDate: '2026-05-18',
  days: 'Varies (holidays and Pro-D days)',
  registrationUrl: 'https://fraserviewgolfacademy.as.me/squirrelspm1',
  description: 'Junior golf Pro-D/holiday day camp for Squirrels ages 4-6. PM session 1:30pm–4:30pm. Introduction to golf fundamentals in a fun environment. Golf clubs included.',
  scheduleType: 'Half Day (PM)',
  dayLength: 'Half Day',
  durationPerDay: 3,
});

addProgram({
  id: 'fraserview-golf-7',
  name: 'Jr Golf Pro-D Camp Gophers PM Ages 7-9',
  campType: 'Holiday/Pro-D Day',
  ageMin: 7, ageMax: 9,
  startTime: '1:00 PM', endTime: '4:00 PM',
  cost: 89,
  costNote: PROD_COST_NOTE,
  enrollmentStatus: 'Open',
  startDate: '2026-04-03',
  endDate: '2026-05-18',
  days: 'Varies (holidays and Pro-D days)',
  registrationUrl: 'https://fraserviewgolfacademy.as.me/gopherspm1',
  description: 'Junior golf Pro-D/holiday day camp for Gophers ages 7-9. PM session 1:00pm–4:00pm. Building on fundamentals with on-course play. Golf clubs included.',
  scheduleType: 'Half Day (PM)',
  dayLength: 'Half Day',
  durationPerDay: 3,
});

addProgram({
  id: 'fraserview-golf-8',
  name: 'Jr Golf Pro-D Camp Eagles PM Ages 10-14',
  campType: 'Holiday/Pro-D Day',
  ageMin: 10, ageMax: 14,
  startTime: '1:15 PM', endTime: '4:15 PM',
  cost: 89,
  costNote: PROD_COST_NOTE,
  enrollmentStatus: 'Open',
  startDate: '2026-04-03',
  endDate: '2026-05-18',
  days: 'Varies (holidays and Pro-D days)',
  registrationUrl: 'https://fraserviewgolfacademy.as.me/eaglespm1',
  description: 'Junior golf Pro-D/holiday day camp for Eagles ages 10-14. PM session 1:15pm–4:15pm. Advanced skills, course play, and competition prep. Golf clubs included.',
  scheduleType: 'Half Day (PM)',
  dayLength: 'Half Day',
  durationPerDay: 3,
});

// --- New Summer Camp entries ---
const SUMMER_NOTE_BASE = 'Weekly Mon–Fri camp, Jun 15–Aug 31, 2026 (12 weeks, register for individual weeks). ' +
  'Golf clubs included. Bring snacks, lunch, water bottle, hat, sunscreen. Max 6 students per class.';

const summerCommon = {
  campType: 'Summer Camp',
  enrollmentStatus: 'Open',
  startDate: '2026-06-15',
  endDate: '2026-08-31',
  days: 'Mon, Tue, Wed, Thu, Fri',
  repeating: true,
  durationPerDay: 2,
};

addProgram(Object.assign({}, summerCommon, {
  id: 'fraserview-golf-summer-sq-am',
  name: 'Junior Summer Golf Camp — Squirrels AM (Ages 4-6)',
  ageMin: 4, ageMax: 6,
  startTime: '10:00 AM', endTime: '12:00 PM',
  cost: 235,
  costNote: '$235 + GST = $246.75/week. ' + SUMMER_NOTE_BASE,
  registrationUrl: 'https://fraserviewgolfacademy.as.me/SQAMSUMMER20261947',
  description: 'Junior summer golf camp for Squirrels ages 4-6. AM session 10:00am–12:00pm, Mon–Fri. Introduction to golf fundamentals in a fun environment. Golf clubs included.',
  scheduleType: 'Half Day (AM)',
  dayLength: 'Half Day',
}));

addProgram(Object.assign({}, summerCommon, {
  id: 'fraserview-golf-summer-sq-pm',
  name: 'Junior Summer Golf Camp — Squirrels PM (Ages 4-6)',
  ageMin: 4, ageMax: 6,
  startTime: '12:45 PM', endTime: '2:45 PM',
  cost: 235,
  costNote: '$235 + GST = $246.75/week. ' + SUMMER_NOTE_BASE,
  registrationUrl: 'https://fraserviewgolfacademy.as.me/SQPMSUMMER20261947',
  description: 'Junior summer golf camp for Squirrels ages 4-6. PM session 12:45pm–2:45pm, Mon–Fri. Introduction to golf fundamentals in a fun environment. Golf clubs included.',
  scheduleType: 'Half Day (PM)',
  dayLength: 'Half Day',
}));

addProgram(Object.assign({}, summerCommon, {
  id: 'fraserview-golf-summer-go-am',
  name: 'Junior Summer Golf Camp — Gophers AM (Ages 7-9)',
  ageMin: 7, ageMax: 9,
  startTime: '9:30 AM', endTime: '12:30 PM',
  cost: 355,
  costNote: '$355 + GST = $372.75/week. ' + SUMMER_NOTE_BASE,
  registrationUrl: 'https://fraserviewgolfacademy.as.me/GOAMSUMMER20261947',
  description: 'Junior summer golf camp for Gophers ages 7-9. AM session 9:30am–12:30pm, Mon–Fri. Building on fundamentals with on-course play. Golf clubs included.',
  scheduleType: 'Half Day (AM)',
  dayLength: 'Half Day',
}));

addProgram(Object.assign({}, summerCommon, {
  id: 'fraserview-golf-summer-go-pm',
  name: 'Junior Summer Golf Camp — Gophers PM (Ages 7-9)',
  ageMin: 7, ageMax: 9,
  startTime: '1:00 PM', endTime: '4:00 PM',
  cost: 355,
  costNote: '$355 + GST = $372.75/week. ' + SUMMER_NOTE_BASE,
  registrationUrl: 'https://fraserviewgolfacademy.as.me/GOPMSUMMER20261947',
  description: 'Junior summer golf camp for Gophers ages 7-9. PM session 1:00pm–4:00pm, Mon–Fri. Building on fundamentals with on-course play. Golf clubs included.',
  scheduleType: 'Half Day (PM)',
  dayLength: 'Half Day',
}));

addProgram(Object.assign({}, summerCommon, {
  id: 'fraserview-golf-summer-go-perf',
  name: 'Junior Summer Golf Camp — Gophers Performance (Ages 7-9)',
  ageMin: 7, ageMax: 9,
  startTime: '11:00 AM', endTime: '2:15 PM',
  cost: 395,
  costNote: '$395 + GST = $414.75/week. ' + SUMMER_NOTE_BASE,
  registrationUrl: 'https://fraserviewgolfacademy.as.me/GOPERFSUMMER20261947',
  description: 'Junior summer golf performance camp for Gophers ages 7-9. 11:00am–2:15pm, Mon–Fri. Advanced skills for experienced junior golfers. Golf clubs included.',
  scheduleType: 'Half Day',
  dayLength: 'Half Day',
  durationPerDay: 3.25,
}));

addProgram(Object.assign({}, summerCommon, {
  id: 'fraserview-golf-summer-ea',
  name: 'Junior Summer Golf Camp — Eagles (Ages 10-14)',
  ageMin: 10, ageMax: 14,
  startTime: '9:45 AM', endTime: '1:45 PM',
  cost: 525,
  costNote: '$525 + GST = $551.25/week. ' + SUMMER_NOTE_BASE,
  registrationUrl: 'https://fraserviewgolfacademy.as.me/EASUMMER20261947',
  description: 'Junior summer golf camp for Eagles ages 10-14. 9:45am–1:45pm, Mon–Fri. Advanced skills, course play, and competition prep. Golf clubs included.',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 4,
}));

addProgram(Object.assign({}, summerCommon, {
  id: 'fraserview-golf-summer-ea-perf',
  name: 'Junior Summer Golf Camp — Eagles Performance (Ages 10-14)',
  ageMin: 10, ageMax: 14,
  startTime: '9:00 AM', endTime: '1:30 PM',
  cost: 595,
  costNote: '$595 + GST = $624.75/week. ' + SUMMER_NOTE_BASE,
  registrationUrl: 'https://fraserviewgolfacademy.as.me/EAPERFSUMMER20261947',
  description: 'Junior summer golf performance camp for Eagles ages 10-14. 9:00am–1:30pm, Mon–Fri. High-performance training for competitive junior golfers. Golf clubs included.',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 4.5,
}));

addProgram(Object.assign({}, summerCommon, {
  id: 'fraserview-golf-summer-pre',
  name: 'Junior Summer Golf Camp — Pre-Summer Camp (Ages 10-14)',
  ageMin: 10, ageMax: 14,
  startTime: '11:00 AM', endTime: '3:00 PM',
  cost: 525,
  costNote: '$525 + GST = $551.25/week. ' + SUMMER_NOTE_BASE,
  registrationUrl: 'https://fraserviewgolfacademy.as.me/PRESUMMER20261947',
  description: 'Junior golf pre-summer camp for Eagles ages 10-14. 11:00am–3:00pm, Mon–Fri. Advanced skills and course play for experienced junior golfers. Golf clubs included.',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 4,
}));

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`\nDone. Field fixes: ${fixes}. New entries added: ${added}. Total programs: ${programs.length}`);
