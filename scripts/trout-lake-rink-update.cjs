#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let fixCount = 0;
let addCount = 0;

// ── 1. STATUS FIXES ────────────────────────────────────────────────────────
// Saturday skating lessons (Apr 4–May 9) shown as "Open" in DB but Full on live page
const toFull = [
  'COV-616878', // Child Level 1, Sat 11:00 AM
  'COV-616882', // Child Level 3, Sat 10:30 AM
  'COV-616884', // Child Level 4, Sat 11:00 AM
  'COV-616885', // Child Level 5, Sat 11:00 AM
  'COV-616886', // Child Level 6, Sat 11:00 AM
  'COV-616887', // Child Level 7, Sat 11:00 AM
  'COV-616888', // Preschool Level 1, Sat 10:30 AM
  'COV-616889', // Preschool Level 1, Sat 11:00 AM
  'COV-616890', // Preschool Level 1, Sat 11:30 AM
  'COV-616903', // Child Level 3, Sat 11:30 AM
];

const toFullSet = new Set(toFull);
for (const prog of programs) {
  if (toFullSet.has(String(prog.id))) {
    if (prog.enrollmentStatus !== 'Full/Waitlist') {
      prog.enrollmentStatus = 'Full/Waitlist';
      fixCount++;
      console.log(`Fixed: ${prog.id} (${prog.name}) → Full/Waitlist`);
    }
  }
}

// ── 2. ADD NEW PROGRAMS ────────────────────────────────────────────────────
const TLR = {
  provider: 'City of Vancouver - Trout Lake Rink',
  address: '3350 Victoria Drive, Vancouver, BC',
  neighbourhood: 'Kensington-Cedar Cottage',
  lat: 49.2793061,
  lng: -123.0656156,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: true,
  urlVerified: true,
  season: 'Year-Round',
  indoorOutdoor: 'Indoor',
  repeating: 'weekly',
  days: 'Sat',
  startDate: '2026-04-04',
  endDate: '2026-05-09',
  cost: 39.72,
  costNote: '$39.72 for 6 sessions (Apr 4–May 9, Sat). Leisure Access 50% discount available.',
  registrationDate: null,
  category: 'Sports',
  activityType: 'Hockey',
  campType: 'Spring Program',
  scheduleType: 'Activity',
  durationPerDay: 0.5,
  dayLength: 'Single Day',
};

const skatingDesc = (level, prereq) =>
  `${level} skating class at Trout Lake Rink. ${prereq}Skate rentals available at additional cost. Returning students: bring previous report card to first class.`;

const newPrograms = [
  {
    id: 'COV-616877',
    name: 'Skating - Child Level 1',
    description: skatingDesc('Entry level child (ages 6–12)', 'No prior skating experience required. '),
    ageMin: 6, ageMax: 12,
    startTime: '10:30 AM', endTime: '11:00 AM',
    enrollmentStatus: 'Full/Waitlist',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616877',
    tags: ['sports', 'skating', 'ice skating', 'kids'],
  },
  {
    id: 'COV-616880',
    name: 'Skating - Child Level 2',
    description: skatingDesc('Child Level 2 (ages 6–12)', 'Must be able to fall and get up unassisted. '),
    ageMin: 6, ageMax: 12,
    startTime: '10:30 AM', endTime: '11:00 AM',
    enrollmentStatus: 'Full/Waitlist',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616880',
    tags: ['sports', 'skating', 'ice skating', 'kids'],
  },
  {
    id: 'COV-616881',
    name: 'Skating - Child Level 2',
    description: skatingDesc('Child Level 2 (ages 6–12)', 'Must be able to fall and get up unassisted. '),
    ageMin: 6, ageMax: 12,
    startTime: '11:00 AM', endTime: '11:30 AM',
    enrollmentStatus: 'Full/Waitlist',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616881',
    tags: ['sports', 'skating', 'ice skating', 'kids'],
  },
  {
    id: 'COV-616883',
    name: 'Skating - Child Level 4',
    description: skatingDesc('Child Level 4 (ages 6–12)', ''),
    ageMin: 6, ageMax: 12,
    startTime: '10:30 AM', endTime: '11:00 AM',
    enrollmentStatus: 'Open',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616883',
    tags: ['sports', 'skating', 'ice skating', 'kids'],
  },
  {
    id: 'COV-616891',
    name: 'Skating - Preschool Level 2',
    description: skatingDesc('Preschool Level 2 (ages 3–5)', ''),
    ageMin: 3, ageMax: 5,
    startTime: '10:30 AM', endTime: '11:00 AM',
    enrollmentStatus: 'Full/Waitlist',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616891',
    tags: ['sports', 'skating', 'ice skating', 'preschool', 'toddler'],
  },
  {
    id: 'COV-616892',
    name: 'Skating - Preschool Level 2',
    description: skatingDesc('Preschool Level 2 (ages 3–5)', ''),
    ageMin: 3, ageMax: 5,
    startTime: '11:30 AM', endTime: '12:00 PM',
    enrollmentStatus: 'Full/Waitlist',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616892',
    tags: ['sports', 'skating', 'ice skating', 'preschool', 'toddler'],
  },
  {
    id: 'COV-616893',
    name: 'Skating - Preschool Level 2',
    description: skatingDesc('Preschool Level 2 (ages 3–5)', ''),
    ageMin: 3, ageMax: 5,
    startTime: '12:30 PM', endTime: '1:00 PM',
    enrollmentStatus: 'Open',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616893',
    tags: ['sports', 'skating', 'ice skating', 'preschool', 'toddler'],
  },
  {
    id: 'COV-616902',
    name: 'Skating - Power Skating - Child',
    description: 'Power skating for children (ages 6–12) who have COMPLETED Child Level 5. Must be able to do forward/backward crossovers, stop in both directions, inside/outside edges, two-foot turns. Gloves, stick, and helmet required. Skate rentals available at additional cost.',
    ageMin: 6, ageMax: 12,
    startTime: '12:00 PM', endTime: '12:45 PM',
    durationPerDay: 0.75,
    enrollmentStatus: 'Full/Waitlist',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616902',
    tags: ['sports', 'skating', 'power skating', 'hockey', 'kids'],
  },
  {
    id: 'COV-616933',
    name: 'Skating - Adapted Skating Lessons',
    description: 'Adapted skating lessons for participants with disabilities (ages 3–17). Registration by designated contact only. Skate rentals available at additional cost.',
    ageMin: 3, ageMax: 17,
    ageSpanJustified: 'Adapted program serving wide age range (3–17) — no age-band subdivisions offered for adapted skating',
    startTime: '11:30 AM', endTime: '12:00 PM',
    enrollmentStatus: 'Full/Waitlist',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616933',
    tags: ['sports', 'skating', 'adapted', 'inclusive', 'special needs'],
  },
];

const existingIds = new Set(programs.map(p => String(p.id)));
for (const prog of newPrograms) {
  if (existingIds.has(String(prog.id))) {
    console.log(`SKIP (exists): ${prog.id}`);
  } else {
    const full = { ...TLR, ...prog, url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search' };
    programs.push(full);
    existingIds.add(String(prog.id));
    addCount++;
    console.log(`ADDED: ${prog.id} — ${prog.name} (${prog.startTime})`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nDone. Fixed: ${fixCount}, Added: ${addCount}, Total: ${programs.length}`);
