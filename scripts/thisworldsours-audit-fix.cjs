#!/usr/bin/env node
// thisworldsours-audit-fix.cjs
// Fixes This World's Ours Centre data (rank 197 audit, 2026-04-06)
//
// Source page verified (browser navigation):
//   https://www.thisworldsours.com/camps
//
// FINDINGS:
//   Summer Camps confirmed for 2026 — registration opens April 15, 2026 at 9am
//   Social Skills Camp: Mon-Fri 9AM-4PM, 1:6 ratio
//   1:1 support option: additional cost, half day AM (9-12) or PM (1-4)
//
//   Full 2026 schedule:
//     Week 1:  Jun 29 - Jul 3 (4-day camp, Canada Day Jul 1 = 4 days)
//     Week 2:  Jul 6-10
//     Week 3:  Jul 13-17
//     Week 4:  Jul 20-24
//     Week 5:  Jul 27-31
//     Week 6:  Aug 4-7 (4-day camp, BC Day Aug 3 = 4 days)
//     Week 7:  Aug 10-14
//     Week 8:  Aug 17-21
//     Week 9:  Aug 24-28
//     Week 10: Aug 31-Sep 4
//
//   DB had only 4 entries (641-644, weeks 2-5). Missing 6 sessions added.
//   Fixes to existing entries:
//   - name: "Arts & Life Skills Camp" → "Social Skills Camp" (from provider page)
//   - confirmed2026: false → true
//   - enrollmentStatus: "Likely Coming Soon" → "Upcoming" (reg opens Apr 15, R8: <35 days)
//   - registrationDate: 2026-04-15
//   - cost: 275 → null (not shown publicly, priceVerified=false)
//   - ageSpanJustified: added (5-18 = 13yr span; provider offers single program, no sub-bands)

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

const COST_NOTE = 'Pricing not publicly listed on thisworldsours.com/camps as of 2026-04-06. ' +
  'Summer 2026 registration opens April 15, 2026 at 9am. ' +
  '1:1 support option available at additional cost (half-day AM 9-12 or PM 1-4pm). ' +
  'Contact: programs@thisworldsours.com';

const AGE_SPAN = 'Provider runs a single inclusive Social Skills Camp for youth ages 5-18 (neurodivergent youth). ' +
  'No separate age-band registrations offered — all ages attend together with 1:6 staff ratio.';

const DESC = 'Inclusive Social Skills summer camp for neurodivergent youth ages 5-18. ' +
  'Activities include arts & crafts, cooking, physical activity, and visits to local parks. ' +
  '9AM-4PM Monday to Friday at 1:6 staff ratio. 1:1 support option available at additional cost. ' +
  'Registration opens April 15, 2026.';

// --- FIX existing IDs 641-644 (Weeks 2-5) ---
[641, 642, 643, 644].forEach(id => {
  fix(id, 'name', 'Social Skills Camp');
  fix(id, 'confirmed2026', true);
  fix(id, 'enrollmentStatus', 'Upcoming');
  fix(id, 'registrationDate', '2026-04-15');
  fix(id, 'cost', null);
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'ageSpanJustified', AGE_SPAN);
  fix(id, 'description', DESC);
  console.log(`Fixed ${id}: name=Social Skills Camp, Upcoming, registrationDate=2026-04-15, cost=null`);
});

// --- ADD 6 MISSING SESSIONS ---
const BASE = {
  provider: "This World's Ours Centre",
  category: 'Life Skills',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  ageMin: 5,
  ageMax: 18,
  days: 'Mon-Fri',
  startTime: '9:00 AM',
  endTime: '4:00 PM',
  durationPerDay: 7,
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Mount Pleasant',
  address: '191 East 10th Avenue, Vancouver, BC',
  lat: 49.2625,
  lng: -123.101,
  cost: null,
  priceVerified: false,
  confirmed2026: true,
  enrollmentStatus: 'Upcoming',
  registrationDate: '2026-04-15',
  registrationUrl: 'https://www.thisworldsours.com/camps',
  activityType: 'Life Skills',
  season: 'Summer 2026',
  city: 'Vancouver',
  tags: ['inclusive', 'neurodiversity', 'social skills', 'arts'],
  name: 'Social Skills Camp',
  description: DESC,
  costNote: COST_NOTE,
  ageSpanJustified: AGE_SPAN,
};

const newSessions = [
  // Week 1: Jun 29-Jul 3 (4-day — Canada Day Jul 1 stat holiday)
  { id: 613427, startDate: '2026-06-29', endDate: '2026-07-03',
    costNote: COST_NOTE + ' Note: 4-day week (Canada Day Jul 1 stat holiday).' },
  // Week 6: Aug 4-7 (4-day — BC Day Aug 3 stat holiday)
  { id: 613428, startDate: '2026-08-04', endDate: '2026-08-07',
    costNote: COST_NOTE + ' Note: 4-day week (BC Day Aug 3 stat holiday).' },
  // Week 7: Aug 10-14
  { id: 613429, startDate: '2026-08-10', endDate: '2026-08-14' },
  // Week 8: Aug 17-21
  { id: 613430, startDate: '2026-08-17', endDate: '2026-08-21' },
  // Week 9: Aug 24-28
  { id: 613431, startDate: '2026-08-24', endDate: '2026-08-28' },
  // Week 10: Aug 31-Sep 4
  { id: 613432, startDate: '2026-08-31', endDate: '2026-09-04' },
];

newSessions.forEach(session => {
  const entry = { ...BASE, ...session };
  if (!entry.costNote) entry.costNote = COST_NOTE;
  programs.push(entry);
  fixes++;
  console.log(`Added ID ${entry.id}: Social Skills Camp ${entry.startDate}`);
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`\nDone. Fixes: ${fixes}. Total programs: ${programs.length}`);
