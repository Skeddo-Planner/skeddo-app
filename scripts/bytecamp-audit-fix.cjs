#!/usr/bin/env node
// bytecamp-audit-fix.cjs
// Fixes Byte Camp data (rank 151 audit, 2026-04-06)
//
// Source: https://www.bytecamp.ca/#c (all 41 Vancouver sessions verified)
// HQ address verified: https://www.bytecamp.ca/calendar/programdetail.php?pid=3347
//
// Changes:
//   1. Cancel ids 181-186 ("Tech Innovation Camp" placeholders — wrong name, wrong address)
//   2. Fix endDate errors on COV-600455, COV-600457, COV-600461, COV-600464
//   3. Add 6 genuinely missing Vancouver sessions

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

// ── 1. Cancel ids 181-186: "Tech Innovation Camp" placeholders ───────────────
// bytecamp.ca has never offered a program called "Tech Innovation Camp".
// Byte Camp's actual Vancouver 2026 programs are covered by COV-*, numbered,
// and newly added entries below.
const cancelNote = 'Placeholder entry — "Tech Innovation Camp" is not a real Byte Camp program. Byte Camp offers Introduction to Coding, 2D/3D Game Design, Claymation, etc. See individual location entries.';
for (const id of [181, 182, 183, 184, 185, 186]) {
  fix(id, 'enrollmentStatus', 'Cancelled');
  fix(id, 'confirmed2026', true);
  fix(id, 'cost', null);
  fix(id, 'priceVerified', false);
  fix(id, 'costNote', cancelNote);
  fix(id, 'registrationUrl', 'https://www.bytecamp.ca/#c');
}

// ── 2. Fix endDate errors on COV Hillcrest entries ────────────────────────────
// These were added with startDate = endDate (single-day). Actual week dates verified on bytecamp.ca.
fix('COV-600455', 'endDate', '2026-07-03');   // Jun 29 – Jul 3 (4-day, Canada Day off)
fix('COV-600457', 'endDate', '2026-07-17');   // Jul 13 – Jul 17 (5-day)
fix('COV-600461', 'endDate', '2026-08-07');   // Aug 4 – Aug 7 (4-day, BC Day off)
fix('COV-600464', 'endDate', '2026-08-28');   // Aug 24 – Aug 28 (5-day)

// ── 3. Add 6 missing Vancouver sessions ───────────────────────────────────────
// These appear on bytecamp.ca but have no corresponding DB entry.

function addEntry(id, fields) {
  if (pid_map.has(String(id))) {
    console.warn(`SKIP (already exists): ${id}`);
    return;
  }
  const entry = Object.assign({ id }, fields);
  programs.push(entry);
  pid_map.set(String(id), entry);
  fixes++;
}

// Shared fields for all new entries
const BASE = {
  provider: 'Byte Camp',
  city: 'Vancouver',
  campType: 'Summer Camp',
  activityType: 'Day Camp',
  category: 'Technology',
  indoorOutdoor: 'Indoor',
  days: 'Mon, Tue, Wed, Thu, Fri',
  startTime: '9:00 AM',
  endTime: '4:00 PM',
  durationPerDay: 7,
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  cost: 410,
  priceVerified: true,
  enrollmentStatus: 'Coming Soon',
  registrationDate: '2026-04-08',
  confirmed2026: true,
  registrationUrl: 'https://www.bytecamp.ca/#c',
  season: 'Summer 2026',
  tags: ['camp', 'technology', 'coding'],
};

// --- Hillcrest CC entries ---
const HILLCREST = {
  address: '4575 Clancy Loranger Way, Vancouver, BC',
  neighbourhood: 'South Cambie',
  lat: 49.2440658,
  lng: -123.1078052,
};

// #13: Hillcrest | 2D Video Game Design | 11-14yrs | Jul 20-24
addEntry('BC-4440', {
  ...BASE,
  ...HILLCREST,
  name: 'Byte Camp - 2D Video Game Design at Hillcrest (Jul 20)',
  description: 'Learn to build a 2D game from the ground up using Godot. Create advanced 2D vector artwork and animated character sprites. Some coding experience recommended.',
  ageMin: 11,
  ageMax: 14,
  startDate: '2026-07-20',
  endDate: '2026-07-24',
  costNote: 'CA$410 for 5-day camp. Registration opens April 8, 2026.',
});

// #30: Hillcrest | 2D Animation on Tablet | 9-12yrs | Aug 10-14
addEntry('BC-4513', {
  ...BASE,
  ...HILLCREST,
  name: 'Byte Camp - 2D Animation on Tablet at Hillcrest (Aug 10)',
  description: 'Create animated short films using a tablet. Learn character design, movement, and storytelling through digital animation tools.',
  ageMin: 9,
  ageMax: 12,
  startDate: '2026-08-10',
  endDate: '2026-08-14',
  costNote: 'CA$410 for 5-day camp. Registration opens April 8, 2026.',
});

// #34: Hillcrest | 3D Video Game Design | 11-14yrs | Aug 17-21
addEntry('BC-4537', {
  ...BASE,
  ...HILLCREST,
  name: 'Byte Camp - 3D Video Game Design at Hillcrest (Aug 17)',
  description: 'Design and build a 3D video game from scratch. Learn 3D modelling, game mechanics, and level design using industry-standard tools.',
  ageMin: 11,
  ageMax: 14,
  startDate: '2026-08-17',
  endDate: '2026-08-21',
  costNote: 'CA$410 for 5-day camp. Registration opens April 8, 2026.',
});

// --- Byte Camp Vancouver HQ entries ---
const BYTECAMP_HQ = {
  address: '2378 Alberta St, Vancouver, BC',
  neighbourhood: 'Riley Park',
  lat: 49.2641089,
  lng: -123.1107440,
};

// #23: Byte Camp Vancouver HQ | 2D Video Game Design | 11-14yrs | Jul 27-31
addEntry('BC-4469', {
  ...BASE,
  ...BYTECAMP_HQ,
  name: 'Byte Camp - 2D Video Game Design at Byte Camp HQ (Jul 27)',
  description: 'Learn to build a 2D game from the ground up using Godot. Create advanced 2D vector artwork and animated character sprites. Some coding experience recommended.',
  ageMin: 11,
  ageMax: 14,
  startDate: '2026-07-27',
  endDate: '2026-07-31',
  costNote: 'CA$410 for 5-day camp. Registration opens April 8, 2026.',
});

// #35: Byte Camp Vancouver HQ | 2D Animation on Tablet | 9-12yrs | Aug 17-21
addEntry('BC-4539', {
  ...BASE,
  ...BYTECAMP_HQ,
  name: 'Byte Camp - 2D Animation on Tablet at Byte Camp HQ (Aug 17)',
  description: 'Create animated short films using a tablet. Learn character design, movement, and storytelling through digital animation tools.',
  ageMin: 9,
  ageMax: 12,
  startDate: '2026-08-17',
  endDate: '2026-08-21',
  costNote: 'CA$410 for 5-day camp. Registration opens April 8, 2026.',
});

// --- Strathcona Community Centre ---
// #41: Strathcona CC | Claymation Movie Production | 9-12yrs | Aug 24-28
addEntry('BC-4559', {
  ...BASE,
  address: '601 Keefer St, Vancouver, BC V6A 3V8',
  neighbourhood: 'Strathcona',
  lat: 49.2773,
  lng: -123.0882,
  name: 'Byte Camp - Claymation Movie Production at Strathcona (Aug 24)',
  description: 'Create your own stop-motion animated film using clay figures. Learn animation fundamentals, storytelling, set design, and video editing.',
  ageMin: 9,
  ageMax: 12,
  startDate: '2026-08-24',
  endDate: '2026-08-28',
  costNote: 'CA$410 for 5-day camp. Registration opens April 8, 2026.',
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Field changes/adds: ${fixes}. Total programs: ${programs.length}`);
