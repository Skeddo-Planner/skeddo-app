#!/usr/bin/env node
// heroacademy-audit-fix.cjs
// Fixes Hero Academy data (rank 185 audit, 2026-04-06)
//
// Source pages verified (browser navigation):
//   https://hero-academy.ca/kids-camps-north-vancouver/  (summer camps)
//   https://hero-academy.ca/kids-martial-arts-north-vancouver/  (martial arts classes)
//
// FINDINGS:
//   1. Entry 16055 "Hero Academy Kids Summer Camp (Ages 5-11)":
//      - ageMax: 11 is WRONG — Jul/Aug weeks for ages 5-10, NOT 5-11
//        (site shows 4 weeks ages 5-10, 2 weeks ages 8-11)
//      - endDate: 2026-08-28 is WRONG — last ages-5-10 week ends Aug 14
//      - costNote: early bird $330 is WRONG — site says $350 till April 30
//      - name: should say "Ages 5-10" not "Ages 5-11"
//      - repeating: true required (date span Jul 6 – Aug 14 = 39 days > 35)
//
//   2. Missing entry for Ages 8-11 camp weeks (Jul 13-17, Aug 17-21)
//      — these are a distinct age group at the same cost
//
//   3. Martial arts entries (16051-16053) confirmed valid:
//      - Website confirms JITS (K-Gr7) and STRIKE (K-Gr7) programs are active
//      - No pricing shown on site; existing confirmed2026=true/priceVerified=true trusted
//
//   4. After-school care (16054) — confirmed via hero-academy.ca/after-school-programs/
//
// CONFIRMED SUMMER CAMP DATA (from hero-academy.ca/kids-camps-north-vancouver/):
//   Ages 5-10 weeks: Jul 6-10, Jul 20-24, Jul 27-31, Aug 10-14
//   Ages 8-11 weeks: Jul 13-17, Aug 17-21
//   Cost: $440/week; Early Bird $350/week until April 30, 2026
//   Time: 9:00 AM – 3:00 PM Mon-Fri
//   Location: 208-250 East Esplanade, North Vancouver (entrance in alley)

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

// --- Fix 1: Entry 16055 — Ages 5-10 summer camp weeks ---
fix('16055', 'name', 'Hero Academy Kids Summer Camp (Ages 5-10)');
fix('16055', 'ageMax', 10);
fix('16055', 'endDate', '2026-08-14');
fix('16055', 'repeating', true);
fix('16055', 'costNote',
  '$440/week (Early Bird $350/week until April 30, 2026). Ages 5–10. Mon–Fri 9:00 AM–3:00 PM. ' +
  'Weeks available: Jul 6–10, Jul 20–24, Jul 27–31, Aug 10–14. ' +
  'Drop-in days may be available. Lunch not provided — bring own lunch, snacks, water. ' +
  'Subsidies available via Harbourside Youth Foundation and Athletics 4 Kids. ' +
  'Entrance in alley at 208-250 East Esplanade.'
);
fix('16055', 'description',
  'Full-day weekly summer camp for ages 5–10 at Hero Academy, North Vancouver. Daily BJJ and Strike (boxing/kickboxing), ' +
  'plus outdoor games, swimming (Delbrook Rec Centre), waterpark visits, arts and crafts, bowling, ' +
  'Lynn Canyon Eco Centre hikes, and Moodieville playground visits. 9 AM–3 PM Mon–Fri. ' +
  'Weeks: Jul 6–10, Jul 20–24, Jul 27–31, Aug 10–14.'
);
fix('16055', 'priceVerified', true);
fix('16055', 'confirmed2026', true);
console.log('Fixed entry 16055 (Ages 5-10): name, ageMax, endDate, costNote, description, repeating');

// --- Add entry 16056 — Ages 8-11 summer camp weeks ---
const camp811 = {
  id: 16056,
  name: 'Hero Academy Kids Summer Camp (Ages 8-11)',
  provider: 'Hero Academy',
  category: 'Sports',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  ageMin: 8,
  ageMax: 11,
  startDate: '2026-07-13',
  endDate: '2026-08-21',
  days: 'Mon-Fri',
  startTime: '9:00 AM',
  endTime: '3:00 PM',
  cost: 440,
  costNote: '$440/week (Early Bird $350/week until April 30, 2026). Ages 8–11. Mon–Fri 9:00 AM–3:00 PM. ' +
    'Weeks available: Jul 13–17, Aug 17–21. ' +
    'Lunch not provided — bring own lunch, snacks, water. ' +
    'Subsidies available via Harbourside Youth Foundation and Athletics 4 Kids. ' +
    'Entrance in alley at 208-250 East Esplanade.',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Lower Lonsdale',
  address: '208-250 East Esplanade, North Vancouver, BC V7L 4M8',
  lat: 49.3099,
  lng: -123.0767,
  enrollmentStatus: 'Open',
  registrationUrl: 'https://hero-academy.ca/kids-camps-north-vancouver/',
  description: 'Full-day weekly summer camp for ages 8–11 at Hero Academy, North Vancouver. Daily BJJ and Strike (boxing/kickboxing), ' +
    'plus outdoor games, swimming (Delbrook Rec Centre), waterpark visits, arts and crafts, bowling, ' +
    'Lynn Canyon Eco Centre hikes, and Moodieville playground visits. 9 AM–3 PM Mon–Fri. ' +
    'Weeks: Jul 13–17, Aug 17–21.',
  tags: ['summer camp', 'martial arts', 'BJJ', 'boxing', 'full day camp', 'kids camp'],
  activityType: 'Martial Arts',
  priceVerified: true,
  confirmed2026: true,
  repeating: true,
  season: 'Summer 2026',
  city: 'North Vancouver',
};
programs.push(camp811);
added++;
console.log('Added entry 16056: Hero Academy Kids Summer Camp (Ages 8-11)');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Fixes: ${fixes}, Added: ${added}. Total programs: ${programs.length}`);
