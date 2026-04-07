#!/usr/bin/env node
// vyas-audit-fix.cjs
// Fixes Vancouver Young Actors School (VYAS) data (rank 199 audit, 2026-04-06)
//
// Source page verified (browser navigation):
//   https://vancouveryoungactorsschool.com/acting-class-descriptions/camps/
//
// FINDINGS:
//   3 locations confirmed for Summer 2026: Vancouver, North Vancouver, Port Coquitlam (POCO)
//   All camps: Mon-Fri 9:00 AM - 2:30 PM, $499/week
//   Age groups: 4-7yr and 8-17yr (split by week at each location)
//
//   Vancouver (210-112 East 3rd Ave) schedule:
//     Week 1 Jul 6-10: 8-17yr (prodId=206)
//     Week 2 Jul 13-17: 8-17yr (prodId=207)
//     Week 3 Jul 20-24: 8-17yr (prodId=208)
//     Week 4 Jul 27-31: 8-17yr (prodId=209) AND 4-7yr (prodId=282)
//     Week 5 Aug 10-14: 8-17yr (prodId=220)
//     Week 6 Aug 17-21: 8-17yr (prodId=219)
//     Week 7 Aug 24-28: 8-17yr (prodId=353)
//
//   North Vancouver (#201-50 Fell Ave) schedule (already in DB as 16150-16157):
//     Week 1-4 Jul: 8-17yr | Week 4 Aug 17-21: 4-7yr | Weeks 5-7 Aug: 8-17yr
//
//   POCO location: 8 sessions missing from DB — not added (address not published on camps page)
//
//   DB errors fixed:
//   - 657-660: ageMin 4→8 (weeks 1-3 are 8-17yr only; week 4 is also 8-17yr main session)
//   - 657-660: registrationUrl updated to specific MindBody links
//   - 657-660: name updated with location context
//   - 16150-16157: time format normalized ("09:00"→"9:00 AM", "14:30"→"2:30 PM")
//   - Added 4 missing Vancouver sessions

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

const VAN_ADDR = '210-112 East 3rd Avenue, Vancouver, BC';
const VAN_LAT = 49.2723;
const VAN_LNG = -123.1034;
const COST_NOTE = 'Price verified from vancouveryoungactorsschool.com/acting-class-descriptions/camps/ on 2026-04-06. $499 per week, all locations. Mon-Fri 9:00 AM-2:30 PM.';

// --- FIX IDs 657-660 (Vancouver, weeks 1-4, ages were wrong 4-17 → 8-17) ---
const vanWeeks = [
  { id: 657, week: 1, prodId: 206 },
  { id: 658, week: 2, prodId: 207 },
  { id: 659, week: 3, prodId: 208 },
  { id: 660, week: 4, prodId: 209 },
];

vanWeeks.forEach(({ id, week, prodId }) => {
  fix(id, 'name', `Summer Camp Week ${week} - Vancouver (Ages 8-17)`);
  fix(id, 'ageMin', 8);
  fix(id, 'ageMax', 17);
  fix(id, 'registrationUrl', `https://clients.mindbodyonline.com/classic/ws?studioid=34640&stype=40&prodId=${prodId}`);
  fix(id, 'costNote', COST_NOTE);
  console.log(`Fixed ${id}: Week ${week} Vancouver, ageMin 4→8, registrationUrl updated (prodId=${prodId})`);
});

// --- FIX 16150-16157 (North Van): normalize time format ---
const nvanIds = [16150, 16151, 16152, 16153, 16154, 16155, 16156, 16157];
nvanIds.forEach(id => {
  fix(id, 'startTime', '9:00 AM');
  fix(id, 'endTime', '2:30 PM');
  fix(id, 'costNote', COST_NOTE);
  console.log(`Fixed ${id}: normalized time format → 9:00 AM - 2:30 PM`);
});

// --- ADD MISSING VANCOUVER SESSIONS ---
const BASE_VAN = {
  provider: 'Vancouver Young Actors School',
  category: 'Arts',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  days: 'Mon-Fri',
  startTime: '9:00 AM',
  endTime: '2:30 PM',
  durationPerDay: 5.5,
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Mount Pleasant',
  address: VAN_ADDR,
  lat: VAN_LAT,
  lng: VAN_LNG,
  cost: 499,
  priceVerified: true,
  confirmed2026: true,
  enrollmentStatus: 'Open',
  registrationUrl: '',
  activityType: 'Performing Arts',
  season: 'Summer 2026',
  city: 'Vancouver',
  tags: ['acting', 'theatre', 'film', 'performing arts'],
  costNote: COST_NOTE,
  description: 'Week-long acting camp at VYAS Vancouver. Film, Television & Voice-Over for various age groups. Covers scene study, character development, on-camera audition technique, and improv. Mon-Fri 9AM-2:30PM.',
};

const newVanSessions = [
  // Week 4: 4-7yr (Jul 27-31)
  { id: 613435, name: 'Summer Camp Week 4 - Vancouver (Ages 4-7)', ageMin: 4, ageMax: 7,
    startDate: '2026-07-27', endDate: '2026-07-31', registrationUrl: 'https://clients.mindbodyonline.com/classic/ws?studioid=34640&stype=40&prodId=282' },
  // Week 5: 8-17yr (Aug 10-14)
  { id: 613436, name: 'Summer Camp Week 5 - Vancouver (Ages 8-17)', ageMin: 8, ageMax: 17,
    startDate: '2026-08-10', endDate: '2026-08-14', registrationUrl: 'https://clients.mindbodyonline.com/classic/ws?studioid=34640&stype=40&prodId=220' },
  // Week 6: 8-17yr (Aug 17-21)
  { id: 613437, name: 'Summer Camp Week 6 - Vancouver (Ages 8-17)', ageMin: 8, ageMax: 17,
    startDate: '2026-08-17', endDate: '2026-08-21', registrationUrl: 'https://clients.mindbodyonline.com/classic/ws?studioid=34640&stype=40&prodId=219' },
  // Week 7: 8-17yr (Aug 24-28)
  { id: 613438, name: 'Summer Camp Week 7 - Vancouver (Ages 8-17)', ageMin: 8, ageMax: 17,
    startDate: '2026-08-24', endDate: '2026-08-28', registrationUrl: 'https://clients.mindbodyonline.com/classic/ws?studioid=34640&stype=40&prodId=353' },
];

newVanSessions.forEach(session => {
  programs.push({ ...BASE_VAN, ...session });
  fixes++;
  console.log(`Added ${session.id}: ${session.name} ${session.startDate}`);
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`\nDone. Fixes: ${fixes}. Total programs: ${programs.length}`);
