#!/usr/bin/env node
// vam-audit-fix.cjs
// Fixes Vancouver Academy of Music data (rank 188 audit, 2026-04-06)
//
// Source pages verified (browser navigation):
//   https://vancouveracademyofmusic.com/summer-programs/ (program overview)
//   https://vancouveracademyofmusic.com/2026-summer-popcorn-orchestra/ (IDs 113, 114 — confirmed)
//   https://vancouveracademyofmusic.com/semester-courses/summer-musicianship-for-kids/ (IDs 115, 116 — WRONG data)
//   https://vancouveracademyofmusic.com/summer-musical-theatre-camps/ (new programs found)
//
// FINDINGS:
//   IDs 113 & 114 (Summer Popcorn Orchestra):
//     - Cost $510, dates, times, ages all CONFIRMED correct
//     - registrationUrl: login page → specific 2026 program page
//
//   IDs 115 & 116 (Summer Musicianship for Kids):
//     - ALL FIELDS WRONG:
//       - ageMin/Max: 6-18 → 5-7 (site: "Recommended for: students aged 5-7")
//       - cost: $350 → $145 (site: "$145 (26/27 Summer)")
//       - startTime/endTime: 9AM-4PM → 4:00PM-5:00PM (1-hour daily class)
//       - ID 115 dates: Jul 20-24 → Jul 13-17 (Session I)
//       - ID 116 dates: Jul 27-31 → Aug 24-28 (Session II)
//       - scheduleType: "Full Day" → Activity (1hr/day)
//
//   NEW PROGRAMS (Summer Musical Theatre — not in DB):
//     - Sound of Music: Ages 7-10, Jul 20-24, 9:30AM-3PM, $470
//     - Sound of Disney: Ages 10-13, Jul 27-31, 10AM-3PM, $470

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

// --- Fix IDs 113 & 114: Popcorn Orchestra — registrationUrl only ---
fix(113, 'registrationUrl', 'https://vancouveracademyofmusic.com/2026-summer-popcorn-orchestra/');
fix(113, 'costNote',
  '$510 per session (no GST noted on site). Ages 10–15. RCM Grade 4+ / Suzuki Book 3+ required. ' +
  'Jul 20–24, 10:00 AM – 3:00 PM. Registration requires a VAM account (login at vancouveracademyofmusic.com). ' +
  'Camp includes movie-themed games, ear training, speech arts, drama, and theory.'
);
fix(114, 'registrationUrl', 'https://vancouveracademyofmusic.com/2026-summer-popcorn-orchestra/');
fix(114, 'costNote',
  '$510 per session (no GST noted on site). Ages 7–12. RCM Grade 1+ / Suzuki Book 2+ required. ' +
  'Jul 27–31, 9:30 AM – 3:00 PM. Registration requires a VAM account (login at vancouveracademyofmusic.com). ' +
  'Camp includes movie-themed games, ear training, drama, and music theory.'
);
console.log('Fixed IDs 113, 114: registrationUrl and costNote');

// --- Fix ID 115: Summer Musicianship for Kids Session I (Jul 13-17) ---
fix(115, 'ageMin', 5);
fix(115, 'ageMax', 7);
fix(115, 'startDate', '2026-07-13');
fix(115, 'endDate', '2026-07-17');
fix(115, 'startTime', '4:00 PM');
fix(115, 'endTime', '5:00 PM');
fix(115, 'cost', 145);
fix(115, 'durationPerDay', 1);
fix(115, 'scheduleType', 'Activity');
fix(115, 'dayLength', 'Activity');
fix(115, 'registrationUrl', 'https://vancouveracademyofmusic.com/semester-courses/summer-musicianship-for-kids/');
fix(115, 'costNote',
  '$145 per session (2026/27 season pricing). Ages 5–7. Mon–Fri 4:00–5:00 PM. ' +
  'Session I: Jul 13–17. Registration requires a VAM account. ' +
  'Explores music theory, world composers, music history, percussion, and singing.'
);
fix(115, 'name', 'Summer Musicianship for Kids — Session I (Jul 13-17)');
console.log('Fixed ID 115: Summer Musicianship Session I (Jul 13-17, ages 5-7, $145, 4-5pm)');

// --- Fix ID 116: Summer Musicianship for Kids Session II (Aug 24-28) ---
fix(116, 'ageMin', 5);
fix(116, 'ageMax', 7);
fix(116, 'startDate', '2026-08-24');
fix(116, 'endDate', '2026-08-28');
fix(116, 'startTime', '4:00 PM');
fix(116, 'endTime', '5:00 PM');
fix(116, 'cost', 145);
fix(116, 'durationPerDay', 1);
fix(116, 'scheduleType', 'Activity');
fix(116, 'dayLength', 'Activity');
fix(116, 'registrationUrl', 'https://vancouveracademyofmusic.com/semester-courses/summer-musicianship-for-kids/');
fix(116, 'costNote',
  '$145 per session (2026/27 season pricing). Ages 5–7. Mon–Fri 4:00–5:00 PM. ' +
  'Session II: Aug 24–28. Registration requires a VAM account. ' +
  'Explores music theory, world composers, music history, percussion, and singing.'
);
fix(116, 'name', 'Summer Musicianship for Kids — Session II (Aug 24-28)');
console.log('Fixed ID 116: Summer Musicianship Session II (Aug 24-28, ages 5-7, $145, 4-5pm)');

// --- Add Summer Musical Theatre camps (NEW) ---
const MT_BASE = {
  provider: 'Vancouver Academy of Music',
  category: 'Music',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  days: 'Mon-Fri',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Kitsilano',
  address: '1270 Chestnut St, Vancouver, BC',
  lat: 49.2756,
  lng: -123.144,
  enrollmentStatus: 'Open',
  registrationUrl: 'https://vancouveracademyofmusic.com/summer-musical-theatre-camps/',
  tags: ['music', 'theatre', 'musical theatre', 'singing', 'acting', 'summer camp'],
  activityType: 'Musical Theatre',
  priceVerified: true,
  confirmed2026: true,
  season: 'Summer 2026',
  city: 'Vancouver',
};

programs.push({
  ...MT_BASE,
  id: 16184,
  name: 'Summer Musical Theatre Camp: Sound of Music',
  ageMin: 7, ageMax: 10,
  startDate: '2026-07-20', endDate: '2026-07-24',
  startTime: '9:30 AM', endTime: '3:00 PM',
  cost: 470,
  durationPerDay: 5.5,
  description: 'Week-long musical theatre camp for ages 7–10 at Vancouver Academy of Music. Students prepare selections from The Sound of Music, with scripted scenes and monologues. Culminates in a showcase performance. Conservatory-level training in singing, acting, movement, and ensemble. No prior experience required.',
  costNote: '$470 per session. Ages 7–10. Jul 20–24, 9:30 AM – 3:00 PM Mon–Fri. Registration requires a VAM account. Showcase performance at end of week.',
});
added++;
console.log('Added ID 16184: Summer Musical Theatre — Sound of Music (Jul 20-24, ages 7-10)');

programs.push({
  ...MT_BASE,
  id: 16185,
  name: 'Summer Musical Theatre Camp: Sound of Disney',
  ageMin: 10, ageMax: 13,
  startDate: '2026-07-27', endDate: '2026-07-31',
  startTime: '10:00 AM', endTime: '3:00 PM',
  cost: 470,
  durationPerDay: 5,
  description: 'Week-long musical theatre camp for ages 10–13 at Vancouver Academy of Music. Students prepare Disney selections (Aladdin, The Jungle Book) plus scripted scenes and character monologues. Culminates in a showcase performance. Conservatory-level training in singing, acting, movement. No prior experience required.',
  costNote: '$470 per session. Ages 10–13. Jul 27–31, 10:00 AM – 3:00 PM Mon–Fri. Registration requires a VAM account. Showcase performance at end of week.',
});
added++;
console.log('Added ID 16185: Summer Musical Theatre — Sound of Disney (Jul 27-31, ages 10-13)');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`\nDone. Fixes: ${fixes}, Added: ${added}. Total programs: ${programs.length}`);
