#!/usr/bin/env node
// shorelinestudios-audit-fix.cjs
// Fixes Shoreline Studios data (rank 187 audit, 2026-04-06)
//
// Source pages verified (browser navigation):
//   https://www.shoreline-studios.com/crafting-the-actor (summer camps — dates, ages, pricing confirmed)
//   https://www.shoreline-studios.com/sign-up (registration form — 12 summer sessions confirmed)
//   https://www.shoreline-studios.com/vancouver-acting-classes (ongoing class listing)
//   https://www.shoreline-studios.com/vancouver-acting-classes/c56/connecting-characters ($320+GST)
//   https://www.shoreline-studios.com/vancouver-acting-classes/bc79/building-character ($350+GST)
//   https://www.shoreline-studios.com/vancouver-acting-classes/bc1012/building-character ($350+GST)
//   https://www.shoreline-studios.com/vancouver-acting-classes/bc1317/building-character ($520+GST)
//   https://www.shoreline-studios.com/vancouver-acting-classes/its1317/into-the-script ($520+GST)
//
// FINDINGS — Summer Camps (Crafting The Actor):
//   - Cost: $375 → $470 + 5% GST ($493.50) — WRONG in all 4 entries
//   - Times: 9:00 AM–4:00 PM → split by age (7-9/10-12: 9AM-2PM; 13-17: 2:30PM-7:30PM)
//   - Age groups: 7-18 combined → must split to 7-9, 10-12, 13-17 (3 separate age group entries)
//   - Status: "Likely Coming Soon" → "Open" (registration open; early bird promo code active)
//   - ID 90 (Jul 13-17): NOT offered in summer 2026. Registration page shows 4 weeks only:
//     Jul 6-10, Jul 20-24, Jul 27-31, Aug 10-14
//   - Aug 10-14 week: NOT in DB (3 entries needed for 3 age groups)
//   - Early bird: 20% OFF with promo code CTASUMMER20
//
// FINDINGS — Ongoing Youth Classes (not previously in DB):
//   - Connecting Characters (5-6): $320+GST, 6 weeks, Sundays (times not published on site)
//   - Building Character (7-9): $350+GST, 6 weeks, Saturdays & Sundays (2 offerings)
//   - Building Character (10-12): $350+GST, 6 weeks, Saturdays & Sundays (2 offerings)
//   - Building Character (13-17): $520+GST, 6 weeks, Sundays
//   - Into The Script (13-17): $520+GST, 6 weeks, Saturdays
//   Times not displayed on public class pages — contact provider for schedule

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

const CAMP_NOTE_79 = '$470/week + 5% GST ($493.50 total). Ages 7–9. Mon–Fri 9:00 AM–2:00 PM. ' +
  'Early bird: 20% OFF with promo code CTASUMMER20. ' +
  'Film & TV acting camp: improvisation, on-camera technique, audition prep, character building. ' +
  'Private link to on-camera footage sent after course. Doors open 8:30 AM for early drop-off. ' +
  'Location: 1425 Charles St, Vancouver (Grandview-Woodland).';
const CAMP_NOTE_1012 = '$470/week + 5% GST ($493.50 total). Ages 10–12. Mon–Fri 9:00 AM–2:00 PM. ' +
  'Early bird: 20% OFF with promo code CTASUMMER20. ' +
  'Film & TV acting camp: improvisation, on-camera technique, audition prep, character building. ' +
  'Private link to on-camera footage sent after course. Location: 1425 Charles St, Vancouver.';
const CAMP_NOTE_1317 = '$470/week + 5% GST ($493.50 total). Ages 13–17. Mon–Fri 2:30 PM–7:30 PM. ' +
  'Early bird: 20% OFF with promo code CTASUMMER20. ' +
  'Film & TV acting camp: improvisation, on-camera technique, audition prep, character building. ' +
  'Private link to on-camera footage sent after course. Location: 1425 Charles St, Vancouver.';

// --- Fix ID 89: Jul 6-10, ages 7-18 → 7-9 ---
fix(89, 'name', 'Acting for Screen Camp — Ages 7-9 (Jul 6-10)');
fix(89, 'ageMin', 7);
fix(89, 'ageMax', 9);
fix(89, 'cost', 470);
fix(89, 'startTime', '9:00 AM');
fix(89, 'endTime', '2:00 PM');
fix(89, 'durationPerDay', 5);
fix(89, 'enrollmentStatus', 'Open');
fix(89, 'confirmed2026', true);
fix(89, 'costNote', CAMP_NOTE_79);
fix(89, 'registrationUrl', 'https://www.shoreline-studios.com/crafting-the-actor');
fix(89, 'priceVerified', true);
console.log('Fixed ID 89 (Jul 6-10, ages 7-9)');

// --- Fix ID 90: Jul 13-17 — NOT OFFERED IN 2026 ---
fix(90, 'confirmed2026', false);
fix(90, 'costNote',
  'No July 13-17 session offered in summer 2026. ' +
  'Available summer 2026 weeks: Jul 6-10, Jul 20-24, Jul 27-31, Aug 10-14. ' +
  'This entry retained for historical reference (prior years offered this week).'
);
console.log('Fixed ID 90 (Jul 13-17): confirmed2026=false — not offered in 2026');

// --- Fix ID 91: Jul 20-24, ages 7-18 → 7-9 ---
fix(91, 'name', 'Acting for Screen Camp — Ages 7-9 (Jul 20-24)');
fix(91, 'ageMin', 7);
fix(91, 'ageMax', 9);
fix(91, 'cost', 470);
fix(91, 'startTime', '9:00 AM');
fix(91, 'endTime', '2:00 PM');
fix(91, 'durationPerDay', 5);
fix(91, 'enrollmentStatus', 'Open');
fix(91, 'confirmed2026', true);
fix(91, 'costNote', CAMP_NOTE_79.replace('Jul 6–10', 'Jul 20–24'));
fix(91, 'registrationUrl', 'https://www.shoreline-studios.com/crafting-the-actor');
fix(91, 'priceVerified', true);
console.log('Fixed ID 91 (Jul 20-24, ages 7-9)');

// --- Fix ID 92: Jul 27-31, ages 7-18 → 7-9 ---
fix(92, 'name', 'Acting for Screen Camp — Ages 7-9 (Jul 27-31)');
fix(92, 'ageMin', 7);
fix(92, 'ageMax', 9);
fix(92, 'cost', 470);
fix(92, 'startTime', '9:00 AM');
fix(92, 'endTime', '2:00 PM');
fix(92, 'durationPerDay', 5);
fix(92, 'enrollmentStatus', 'Open');
fix(92, 'confirmed2026', true);
fix(92, 'costNote', CAMP_NOTE_79.replace('Jul 6–10', 'Jul 27–31'));
fix(92, 'registrationUrl', 'https://www.shoreline-studios.com/crafting-the-actor');
fix(92, 'priceVerified', true);
console.log('Fixed ID 92 (Jul 27-31, ages 7-9)');

// Base for camp entries
const CAMP_BASE = {
  provider: 'Shoreline Studios',
  category: 'Arts',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  days: 'Mon-Fri',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Grandview-Woodland',
  address: '1425 Charles St, Vancouver, BC',
  lat: 49.2752,
  lng: -123.0686,
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.shoreline-studios.com/crafting-the-actor',
  tags: ['acting', 'film', 'TV', 'drama', 'summer camp', 'teens'],
  activityType: 'Theatre & Drama',
  priceVerified: true,
  confirmed2026: true,
  season: 'Summer 2026',
  city: 'Vancouver',
};

// --- Add 10-12 and 13-17 for weeks Jul 6-10, Jul 20-24, Jul 27-31, and all 3 for Aug 10-14 ---
const campWeeks = [
  { startDate: '2026-07-06', endDate: '2026-07-10', label: 'Jul 6-10' },
  { startDate: '2026-07-20', endDate: '2026-07-24', label: 'Jul 20-24' },
  { startDate: '2026-07-27', endDate: '2026-07-31', label: 'Jul 27-31' },
  { startDate: '2026-08-10', endDate: '2026-08-14', label: 'Aug 10-14' },
];

const ageGroups = [
  { ageMin: 10, ageMax: 12, startTime: '9:00 AM', endTime: '2:00 PM', durationPerDay: 5,
    label: '10-12', costNote: CAMP_NOTE_1012, skipWeeks: [] },
  { ageMin: 13, ageMax: 17, startTime: '2:30 PM', endTime: '7:30 PM', durationPerDay: 5,
    label: '13-17', costNote: CAMP_NOTE_1317, skipWeeks: [] },
];

// Also add 7-9 for Aug 10-14 (existing entries only cover Jul 6-10, 20-24, 27-31)
const aug79 = {
  ...CAMP_BASE,
  id: 16168,
  name: 'Acting for Screen Camp — Ages 7-9 (Aug 10-14)',
  ageMin: 7, ageMax: 9,
  startDate: '2026-08-10', endDate: '2026-08-14',
  startTime: '9:00 AM', endTime: '2:00 PM',
  cost: 470, durationPerDay: 5,
  description: 'Week-long film/TV acting camp for ages 7–9. Improvisation, on-camera technique, audition prep, character building. Private link to on-camera footage after course. 9 AM–2 PM Mon–Fri. Aug 10-14.',
  costNote: CAMP_NOTE_79.replace('Jul 6–10', 'Aug 10–14'),
};
programs.push(aug79); added++;
console.log('Added ID 16168: Ages 7-9, Aug 10-14');

let nextId = 16169;
for (const week of campWeeks) {
  for (const ag of ageGroups) {
    const entry = {
      ...CAMP_BASE,
      id: nextId++,
      name: `Acting for Screen Camp — Ages ${ag.label} (${week.label})`,
      ageMin: ag.ageMin, ageMax: ag.ageMax,
      startDate: week.startDate, endDate: week.endDate,
      startTime: ag.startTime, endTime: ag.endTime,
      durationPerDay: ag.durationPerDay,
      cost: 470,
      description: `Week-long film/TV acting camp for ages ${ag.label}. Improvisation, on-camera technique, audition prep, character building. Private link to on-camera footage after course. ${ag.startTime}–${ag.endTime} Mon–Fri. ${week.label}.`,
      costNote: ag.costNote,
    };
    programs.push(entry);
    added++;
    console.log(`Added ID ${entry.id}: Ages ${ag.label}, ${week.label}`);
  }
}

// --- Add ongoing youth classes ---
const CLASS_BASE = {
  provider: 'Shoreline Studios',
  category: 'Arts',
  campType: 'Class/Lesson',
  scheduleType: 'Activity',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Grandview-Woodland',
  address: '1425 Charles St, Vancouver, BC',
  lat: 49.2752,
  lng: -123.0686,
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.shoreline-studios.com/sign-up',
  tags: ['acting', 'film', 'TV', 'drama', 'after school'],
  activityType: 'Theatre & Drama',
  priceVerified: true,
  confirmed2026: true,
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  repeating: true,
  season: 'Spring 2026',
  startTime: null,
  endTime: null,
  durationPerDay: null,
  city: 'Vancouver',
};

const ongoingClasses = [
  {
    id: 16177,
    name: 'Connecting Characters — Kids Acting (Ages 5-6)',
    ageMin: 5, ageMax: 6,
    days: 'Sun',
    cost: 320,
    description: 'Film & TV acting class for ages 5–6 at Shoreline Studios, Vancouver. 6-week session covering improvisation, on-camera technique, and emotional connection through game-based exercises. Sundays.',
    costNote: '$320 + 5% GST ($336) per 6-week session. Ages 5–6. Sundays. Contact provider for current session dates and times. Multi-class and referral discounts available.',
  },
  {
    id: 16178,
    name: 'Building Character — Kids Acting (Ages 7-9, Saturdays)',
    ageMin: 7, ageMax: 9,
    days: 'Sat',
    cost: 350,
    description: 'Film & TV acting class for ages 7–9 at Shoreline Studios, Vancouver. 6-week session focusing on improvisation, on-camera technique, audition technique, and text analysis. Saturdays.',
    costNote: '$350 + 5% GST ($367.50) per 6-week session. Ages 7–9. Saturdays. Contact provider for current session dates and times.',
  },
  {
    id: 16179,
    name: 'Building Character — Kids Acting (Ages 7-9, Sundays)',
    ageMin: 7, ageMax: 9,
    days: 'Sun',
    cost: 350,
    description: 'Film & TV acting class for ages 7–9 at Shoreline Studios, Vancouver. 6-week session focusing on improvisation, on-camera technique, audition technique, and text analysis. Sundays.',
    costNote: '$350 + 5% GST ($367.50) per 6-week session. Ages 7–9. Sundays. Contact provider for current session dates and times.',
  },
  {
    id: 16180,
    name: 'Building Character — Kids Acting (Ages 10-12, Saturdays)',
    ageMin: 10, ageMax: 12,
    days: 'Sat',
    cost: 350,
    description: 'Film & TV acting class for ages 10–12 at Shoreline Studios, Vancouver. 6-week session covering improvisation, on-camera technique, audition technique, and character building. Saturdays.',
    costNote: '$350 + 5% GST ($367.50) per 6-week session. Ages 10–12. Saturdays. Contact provider for current session dates and times.',
  },
  {
    id: 16181,
    name: 'Building Character — Kids Acting (Ages 10-12, Sundays)',
    ageMin: 10, ageMax: 12,
    days: 'Sun',
    cost: 350,
    description: 'Film & TV acting class for ages 10–12 at Shoreline Studios, Vancouver. 6-week session covering improvisation, on-camera technique, audition technique, and character building. Sundays.',
    costNote: '$350 + 5% GST ($367.50) per 6-week session. Ages 10–12. Sundays. Contact provider for current session dates and times.',
  },
  {
    id: 16182,
    name: 'Building Character — Teen Acting (Ages 13-17)',
    ageMin: 13, ageMax: 17,
    days: 'Sun',
    cost: 520,
    description: 'Film & TV acting class for ages 13–17 at Shoreline Studios, Vancouver. 6-week session exploring emotional connection, on-camera technique, improvisation, and character building. Sundays.',
    costNote: '$520 + 5% GST ($546) per 6-week session. Ages 13–17. Sundays. Contact provider for current session dates and times.',
  },
  {
    id: 16183,
    name: 'Into The Script — Teen Acting (Ages 13-17)',
    ageMin: 13, ageMax: 17,
    days: 'Sat',
    cost: 520,
    description: 'Advanced film & TV acting class for ages 13–17 at Shoreline Studios, Vancouver. 6-week session focused on full script breakdown, technique refinement, and deeply embodying characters. Saturdays.',
    costNote: '$520 + 5% GST ($546) per 6-week session. Ages 13–17. Saturdays. Contact provider for current session dates and times. Prerequisite: prior acting experience recommended.',
  },
];

ongoingClasses.forEach(c => {
  programs.push({ ...CLASS_BASE, ...c });
  added++;
  console.log(`Added ID ${c.id}: ${c.name}`);
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`\nDone. Fixes: ${fixes}, Added: ${added}. Total programs: ${programs.length}`);
