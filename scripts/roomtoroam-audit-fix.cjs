#!/usr/bin/env node
// roomtoroam-audit-fix.cjs
// Fixes Room to Roam Outdoor Learning data (rank 193 audit, 2026-04-06)
//
// Source pages verified (browser navigation):
//   https://roomtoroam.ca/port-coquitlam-summer-camps-2026/
//
// FINDINGS:
//   3 camp types offered in 2026:
//     1. Little Roamers Half Day Camp — ages 3-5, 9AM-12PM, $220/week
//     2. Big Roamers Full Day Camp — ages 6-10, 9AM-4PM, $340/week (4-day Aug 4-7 week: $275)
//     3. Rollin' Roamers Full Day Bike Camp — ages 7-12, 9AM-4PM, $340/week
//
//   Full 2026 calendar:
//     Week 1 (Jul 6-10):   Little Roamers (FULL), Big Roamers (FULL)
//     Week 2 (Jul 13-17):  Little Roamers (FULL), Rollin' Roamers (1 spot left)
//     Week 3 (Jul 20-24):  Little Roamers (FULL), Big Roamers (1 spot left)
//     Week 4 (Jul 27-31):  Little Roamers (FULL), Rollin' Roamers
//     Week 5 (Aug 4-7):    Big Roamers ($275 — 4 days due to BC Day)
//     Week 6 (Aug 10-14):  Big Roamers ($340)
//     Week 7 (Aug 17-21):  Big Roamers ($340, 2 spots left)
//     Week 8 (Aug 24-28):  Big Roamers ($340)
//
//   Existing DB problems fixed:
//     503-504: ages 3-12→3-5, endTime 4PM→12PM, Full Day→Half Day, durationPerDay 7→3
//     505: ages 3-12→6-10, name wrong, confirmed2026=false→true
//     506: repurposed Big Roamers Jul 27-31 (not offered) → Rollin' Roamers Jul 27-31 (offered)
//     507: ages 3-12→6-10, cost 340→275 (4-day week Aug 4-7)
//     508: ages 3-12→6-10, confirmed2026=false→true
//     All: registrationUrl 2025 → 2026 form, priceVerified false→true
//
//   6 new sessions added (IDs 613421-613426)

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

const REG_URL = 'https://roomtoroam.ca/summer-camp-2026-registration-form/';
const ADDR = 'Lions Park, Port Coquitlam, BC';
const LAT = 49.2656;
const LNG = -122.7726;
const PROVIDER = 'Room to Roam Outdoor Learning';

const LITTLE_COST_NOTE = 'Price verified from roomtoroam.ca/port-coquitlam-summer-camps-2026/ on 2026-04-06. $220 per week, no registration fee.';
const BIG_COST_NOTE = 'Price verified from roomtoroam.ca/port-coquitlam-summer-camps-2026/ on 2026-04-06. $340 per week (standard 5-day week), no registration fee.';
const ROLLIN_COST_NOTE = 'Price verified from roomtoroam.ca/port-coquitlam-summer-camps-2026/ on 2026-04-06. $340 per week, no registration fee. Children must ride independently with gears and hand brakes.';
const SHORT_WEEK_COST_NOTE = 'Price verified from roomtoroam.ca/port-coquitlam-summer-camps-2026/ on 2026-04-06. $275 for this 4-day week (Aug 4-7 — BC Day stat holiday on Aug 3).';

// --- FIX ID 503: Little Roamers Jul 6-10 ---
fix(503, 'name', 'Little Roamers Half Day Camp');
fix(503, 'ageMin', 3);
fix(503, 'ageMax', 5);
fix(503, 'endTime', '12:00 PM');
fix(503, 'scheduleType', 'Half Day');
fix(503, 'dayLength', 'Half Day');
fix(503, 'durationPerDay', 3);
fix(503, 'cost', 220);
fix(503, 'priceVerified', true);
fix(503, 'confirmed2026', true);
fix(503, 'enrollmentStatus', 'Full/Waitlist');
fix(503, 'registrationUrl', 'https://roomtoroam.ca/wait-list/');
fix(503, 'lat', LAT);
fix(503, 'lng', LNG);
fix(503, 'costNote', LITTLE_COST_NOTE);
fix(503, 'description', 'Child-led outdoor play and nature exploration for children ages 3-5. Half day 9AM-12PM Monday to Friday at Lions Park, Port Coquitlam. Rain or shine.');
console.log('Fixed 503: Little Roamers Jul 6-10 — age 3-5, Half Day, 12PM end, FULL');

// --- FIX ID 504: Little Roamers Jul 13-17 ---
fix(504, 'name', 'Little Roamers Half Day Camp');
fix(504, 'ageMin', 3);
fix(504, 'ageMax', 5);
fix(504, 'endTime', '12:00 PM');
fix(504, 'scheduleType', 'Half Day');
fix(504, 'dayLength', 'Half Day');
fix(504, 'durationPerDay', 3);
fix(504, 'cost', 220);
fix(504, 'priceVerified', true);
fix(504, 'confirmed2026', true);
fix(504, 'enrollmentStatus', 'Full/Waitlist');
fix(504, 'registrationUrl', 'https://roomtoroam.ca/wait-list/');
fix(504, 'lat', LAT);
fix(504, 'lng', LNG);
fix(504, 'costNote', LITTLE_COST_NOTE);
fix(504, 'description', 'Child-led outdoor play and nature exploration for children ages 3-5. Half day 9AM-12PM Monday to Friday at Lions Park, Port Coquitlam. Rain or shine.');
console.log('Fixed 504: Little Roamers Jul 13-17 — age 3-5, Half Day, 12PM end, FULL');

// --- FIX ID 505: Big Roamers Jul 20-24 ---
fix(505, 'name', 'Big Roamers Full Day Camp');
fix(505, 'ageMin', 6);
fix(505, 'ageMax', 10);
fix(505, 'confirmed2026', true);
fix(505, 'enrollmentStatus', 'Open');
fix(505, 'priceVerified', true);
fix(505, 'registrationUrl', REG_URL);
fix(505, 'lat', LAT);
fix(505, 'lng', LNG);
fix(505, 'costNote', BIG_COST_NOTE);
fix(505, 'description', 'Action-packed group games and nature-inspired activities for children ages 6-10 (entering grade 1-5). Full day 9AM-4PM at Lions Park, Port Coquitlam. Rain or shine. Theme changes each week.');
console.log('Fixed 505: Big Roamers Jul 20-24 — age 6-10, Open (1 spot left)');

// --- FIX ID 506: Repurpose as Rollin' Roamers Jul 27-31 ---
// Jul 27-31 Big Roamers NOT offered in 2026. Rollin' Roamers IS offered.
fix(506, 'name', "Rollin' Roamers Full Day Bike Camp");
fix(506, 'ageMin', 7);
fix(506, 'ageMax', 12);
fix(506, 'confirmed2026', true);
fix(506, 'enrollmentStatus', 'Open');
fix(506, 'priceVerified', true);
fix(506, 'cost', 340);
fix(506, 'registrationUrl', REG_URL);
fix(506, 'lat', LAT);
fix(506, 'lng', LNG);
fix(506, 'costNote', ROLLIN_COST_NOTE);
fix(506, 'description', "Full day bike camp for children ages 7-12 (entering grade 2-6). Ventures along the Coquitlam River and Traboulay PoCo trails. 9AM-4PM at Lions Park. Children must ride independently with gears and hand brakes.");
fix(506, 'tags', ['nature', 'outdoor', 'cycling', 'bike']);
console.log("Fixed 506: Repurposed Big Roamers Jul 27-31 → Rollin' Roamers Jul 27-31");

// --- FIX ID 507: Big Roamers Aug 4-7 (4-day week, $275) ---
fix(507, 'name', 'Big Roamers Full Day Camp');
fix(507, 'ageMin', 6);
fix(507, 'ageMax', 10);
fix(507, 'cost', 275);
fix(507, 'priceVerified', true);
fix(507, 'confirmed2026', true);
fix(507, 'enrollmentStatus', 'Open');
fix(507, 'registrationUrl', REG_URL);
fix(507, 'lat', LAT);
fix(507, 'lng', LNG);
fix(507, 'costNote', SHORT_WEEK_COST_NOTE);
fix(507, 'description', 'Action-packed group games and nature-inspired activities for children ages 6-10. Full day 9AM-4PM at Lions Park. Short 4-day week (BC Day Aug 3 holiday) at reduced cost of $275.');
console.log('Fixed 507: Big Roamers Aug 4-7 — age 6-10, $275 (4-day week)');

// --- FIX ID 508: Big Roamers Aug 10-14 ---
fix(508, 'name', 'Big Roamers Full Day Camp');
fix(508, 'ageMin', 6);
fix(508, 'ageMax', 10);
fix(508, 'priceVerified', true);
fix(508, 'confirmed2026', true);
fix(508, 'enrollmentStatus', 'Open');
fix(508, 'registrationUrl', REG_URL);
fix(508, 'lat', LAT);
fix(508, 'lng', LNG);
fix(508, 'costNote', BIG_COST_NOTE);
fix(508, 'description', 'Action-packed group games and nature-inspired activities for children ages 6-10 (entering grade 1-5). Full day 9AM-4PM at Lions Park, Port Coquitlam. Rain or shine. Theme changes each week.');
console.log('Fixed 508: Big Roamers Aug 10-14 — age 6-10, Open');

// --- ADD 6 MISSING SESSIONS ---
const BASE = {
  provider: PROVIDER,
  category: 'Outdoor',
  campType: 'Summer Camp',
  indoorOutdoor: 'Outdoor',
  neighbourhood: 'Central Port Coquitlam',
  address: ADDR,
  lat: LAT,
  lng: LNG,
  days: 'Mon-Fri',
  city: 'Port Coquitlam',
  activityType: 'Outdoor',
  season: 'Summer 2026',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  startTime: '9:00 AM',
  endTime: '4:00 PM',
  durationPerDay: 7,
  confirmed2026: true,
  priceVerified: true,
};

const newEntries = [
  // 613421: Big Roamers Jul 6-10 (FULL)
  {
    ...BASE,
    id: 613421,
    name: 'Big Roamers Full Day Camp',
    ageMin: 6, ageMax: 10,
    startDate: '2026-07-06', endDate: '2026-07-10',
    cost: 340,
    enrollmentStatus: 'Full/Waitlist',
    registrationUrl: 'https://roomtoroam.ca/wait-list/',
    costNote: BIG_COST_NOTE,
    description: 'Action-packed group games and nature-inspired activities for children ages 6-10 (entering grade 1-5). Full day 9AM-4PM at Lions Park, Port Coquitlam. Rain or shine. Theme changes each week.',
    tags: ['nature', 'outdoor', 'play-based'],
  },
  // 613422: Rollin' Roamers Jul 13-17 (1 spot left = Open)
  {
    ...BASE,
    id: 613422,
    name: "Rollin' Roamers Full Day Bike Camp",
    ageMin: 7, ageMax: 12,
    startDate: '2026-07-13', endDate: '2026-07-17',
    cost: 340,
    enrollmentStatus: 'Open',
    registrationUrl: REG_URL,
    costNote: ROLLIN_COST_NOTE,
    description: "Full day bike camp for children ages 7-12 (entering grade 2-6). Ventures along the Coquitlam River and Traboulay PoCo trails. 9AM-4PM at Lions Park. Children must ride independently with gears and hand brakes.",
    tags: ['nature', 'outdoor', 'cycling', 'bike'],
  },
  // 613423: Little Roamers Jul 20-24 (FULL)
  {
    ...BASE,
    id: 613423,
    name: 'Little Roamers Half Day Camp',
    ageMin: 3, ageMax: 5,
    startDate: '2026-07-20', endDate: '2026-07-24',
    scheduleType: 'Half Day',
    dayLength: 'Half Day',
    endTime: '12:00 PM',
    durationPerDay: 3,
    cost: 220,
    enrollmentStatus: 'Full/Waitlist',
    registrationUrl: 'https://roomtoroam.ca/wait-list/',
    costNote: LITTLE_COST_NOTE,
    description: 'Child-led outdoor play and nature exploration for children ages 3-5. Half day 9AM-12PM Monday to Friday at Lions Park, Port Coquitlam. Rain or shine.',
    tags: ['nature', 'outdoor', 'play-based'],
  },
  // 613424: Little Roamers Jul 27-31 (FULL)
  {
    ...BASE,
    id: 613424,
    name: 'Little Roamers Half Day Camp',
    ageMin: 3, ageMax: 5,
    startDate: '2026-07-27', endDate: '2026-07-31',
    scheduleType: 'Half Day',
    dayLength: 'Half Day',
    endTime: '12:00 PM',
    durationPerDay: 3,
    cost: 220,
    enrollmentStatus: 'Full/Waitlist',
    registrationUrl: 'https://roomtoroam.ca/wait-list/',
    costNote: LITTLE_COST_NOTE,
    description: 'Child-led outdoor play and nature exploration for children ages 3-5. Half day 9AM-12PM Monday to Friday at Lions Park, Port Coquitlam. Rain or shine.',
    tags: ['nature', 'outdoor', 'play-based'],
  },
  // 613425: Big Roamers Aug 17-21 (2 spots left = Open)
  {
    ...BASE,
    id: 613425,
    name: 'Big Roamers Full Day Camp',
    ageMin: 6, ageMax: 10,
    startDate: '2026-08-17', endDate: '2026-08-21',
    cost: 340,
    enrollmentStatus: 'Open',
    registrationUrl: REG_URL,
    costNote: BIG_COST_NOTE,
    description: 'Action-packed group games and nature-inspired activities for children ages 6-10 (entering grade 1-5). Full day 9AM-4PM at Lions Park, Port Coquitlam. Rain or shine. Theme changes each week.',
    tags: ['nature', 'outdoor', 'play-based'],
  },
  // 613426: Big Roamers Aug 24-28
  {
    ...BASE,
    id: 613426,
    name: 'Big Roamers Full Day Camp',
    ageMin: 6, ageMax: 10,
    startDate: '2026-08-24', endDate: '2026-08-28',
    cost: 340,
    enrollmentStatus: 'Open',
    registrationUrl: REG_URL,
    costNote: BIG_COST_NOTE,
    description: 'Action-packed group games and nature-inspired activities for children ages 6-10 (entering grade 1-5). Full day 9AM-4PM at Lions Park, Port Coquitlam. Rain or shine. Theme changes each week.',
    tags: ['nature', 'outdoor', 'play-based'],
  },
];

newEntries.forEach(e => {
  programs.push(e);
  fixes++;
  console.log(`Added ID ${e.id}: ${e.name} ${e.startDate}`);
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`\nDone. Fixes applied: ${fixes}. Total programs: ${programs.length}`);
