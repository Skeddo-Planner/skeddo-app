#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let fixCount = 0;
let addCount = 0;

// ── 1. FIXES ──────────────────────────────────────────────────────────────────
// Three Adult/Teen Swimmer programs were added as unconfirmed prior-year data.
// All three verified on live page (center_id=36) on 2026-04-06.
// COV-616934 (#619856) has 2 spaces left → Open.
// COV-617020 (#619942) and COV-616940 (#619862) confirmed Full.

const swimmer2Description = 'Prerequisite: At least 13 years of age, able to swim front crawl and back crawl (15-25m) and is comfortable swimming in deep water. This level covers tumble turns, eggbeater kick, breaststroke, front crawl and back crawl (25-50m each), side stroke, elementary backstroke, and interval training.';
const swimmer3Description = 'Prerequisite: At least 13 years of age, able to swim front crawl and back crawl at least 25 metres continuously, and comfortable swimming in deep water. This level covers advanced entries (shallow dives, stride jumps), eggbeater or scissor kick, breaststroke, front crawl and back crawl (50-100m each), head up front crawl, interval and sprint training, and completing a 300m continuous swim workout.';

for (const prog of programs) {
  if (prog.id === 'COV-616934') {
    prog.confirmed2026 = true;
    prog.season = 'Spring 2026';
    prog.enrollmentStatus = 'Open';
    prog.description = swimmer2Description;
    fixCount++;
    console.log(`Fixed: ${prog.id} — confirmed2026=true, Open, Spring 2026`);
  }
  if (prog.id === 'COV-617020') {
    prog.confirmed2026 = true;
    prog.season = 'Spring 2026';
    prog.description = swimmer2Description;
    fixCount++;
    console.log(`Fixed: ${prog.id} — confirmed2026=true, Spring 2026`);
  }
  if (prog.id === 'COV-616940') {
    prog.confirmed2026 = true;
    prog.season = 'Spring 2026';
    prog.description = swimmer3Description;
    fixCount++;
    console.log(`Fixed: ${prog.id} — confirmed2026=true, Spring 2026`);
  }
}

// ── BASE OBJECT ──────────────────────────────────────────────────────────────
const KLP = {
  provider: 'City of Vancouver - Killarney Pool',
  address: 'Killarney Pool, Vancouver, BC',
  neighbourhood: 'Vancouver',
  lat: 49.2272121,
  lng: -123.0441556,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: false,
  urlVerified: true,
  indoorOutdoor: 'Indoor',
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  season: 'Spring 2026',
  campType: 'Spring Program',
  category: 'Sports',
  activityType: 'Swimming',
  scheduleType: 'Activity',
  dayLength: 'Single Day',
  registrationDate: null,
  repeating: 'weekly',
  tags: ['swimming', 'swim lessons'],
};

// Shared descriptions
const swimmer1Description = 'Prerequisite: At least 13 years of age, no previous swimming experience required. This level covers multiple types of entries into the water, treading water (30 secs) with a PFD, front and back floats and glides with kicking, whip kick in a vertical position, front crawl and back crawl (10-15m), and an introduction to interval training.';

const parentTotDescription = 'Goldfish (12–24 months): Babies and caregivers work on rhythmic breathing, moving through the water, front and back floats, shallow water entries and exits, and underwater object recovery. Seahorse (24–36 months): Toddlers and caregivers work on submersion, front and back floats and glides, jumping into water with assistance, underwater object recovery, and kicking on front and front swim. Swim diapers are mandatory. Caregiver participation required.';

// ── 2. NEW PROGRAMS ──────────────────────────────────────────────────────────
const newPrograms = [

  // ── PARENT AND TOT 2/3 ───────────────────────────────────────────────────
  {
    id: 'COV-616272',
    name: 'Swimming - Parent and Tot 2 / 3 - Goldfish / Seahorse',
    ...KLP,
    ageMin: 1, ageMax: 3,
    startDate: '2026-03-31', endDate: '2026-05-26',
    days: 'Tue',
    startTime: '11:45 AM', endTime: '12:15 PM',
    durationPerDay: 0.5,
    cost: null,
    costNote: 'Fee not displayed on registration page. 50% Leisure Access discount available.',
    enrollmentStatus: 'Full/Waitlist',
    description: parentTotDescription,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616272',
    tags: ['swimming', 'swim lessons', 'parent and tot', 'infant', 'toddler', 'caregiver'],
  },
  {
    id: 'COV-616844',
    name: 'Swimming - Parent and Tot 2 / 3 - Goldfish / Seahorse',
    ...KLP,
    ageMin: 1, ageMax: 3,
    startDate: '2026-04-11', endDate: '2026-05-30',
    days: 'Sat',
    startTime: '10:15 AM', endTime: '10:45 AM',
    durationPerDay: 0.5,
    cost: null,
    costNote: 'Fee not displayed on registration page. 50% Leisure Access discount available.',
    enrollmentStatus: 'Full',
    description: parentTotDescription,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616844',
    tags: ['swimming', 'swim lessons', 'parent and tot', 'infant', 'toddler', 'caregiver'],
  },

  // ── ADULT AND TEEN SWIMMER 1 ─────────────────────────────────────────────
  {
    id: 'COV-616259',
    name: 'Swimming - Adult and Teen Swimmer 1',
    ...KLP,
    ageMin: 13, ageMax: null,
    startDate: '2026-03-30', endDate: '2026-05-25',
    days: 'Mon',
    startTime: '10:45 AM', endTime: '11:25 AM',
    durationPerDay: 0.67,
    cost: null,
    costNote: 'Fee not displayed on registration page. 7 sessions (no class Apr 6 or May 18). 50% Leisure Access discount available.',
    enrollmentStatus: 'Open',
    description: swimmer1Description,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616259',
    tags: ['swimming', 'swim lessons', 'teens', 'adults'],
  },
  {
    id: 'COV-616271',
    name: 'Swimming - Adult and Teen Swimmer 1',
    ...KLP,
    ageMin: 13, ageMax: null,
    startDate: '2026-03-31', endDate: '2026-05-26',
    days: 'Tue',
    startTime: '11:45 AM', endTime: '12:25 PM',
    durationPerDay: 0.67,
    cost: null,
    costNote: 'Fee not displayed on registration page. 9 sessions. 50% Leisure Access discount available.',
    enrollmentStatus: 'Open',
    description: swimmer1Description,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616271',
    tags: ['swimming', 'swim lessons', 'teens', 'adults'],
  },
  {
    id: 'COV-616982',
    name: 'Swimming - Adult and Teen Swimmer 1',
    ...KLP,
    ageMin: 13, ageMax: null,
    startDate: '2026-04-01', endDate: '2026-05-27',
    days: 'Wed',
    startTime: '6:00 PM', endTime: '6:40 PM',
    durationPerDay: 0.67,
    cost: null,
    costNote: 'Fee not displayed on registration page. 9 sessions. 50% Leisure Access discount available.',
    enrollmentStatus: 'Full',
    description: swimmer1Description,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616982',
    tags: ['swimming', 'swim lessons', 'teens', 'adults'],
  },
  {
    id: 'COV-617004',
    name: 'Swimming - Adult and Teen Swimmer 1',
    ...KLP,
    ageMin: 13, ageMax: null,
    startDate: '2026-04-02', endDate: '2026-05-28',
    days: 'Thu',
    startTime: '8:00 PM', endTime: '8:40 PM',
    durationPerDay: 0.67,
    cost: null,
    costNote: 'Fee not displayed on registration page. 9 sessions. 50% Leisure Access discount available.',
    enrollmentStatus: 'Full',
    description: swimmer1Description,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/617004',
    tags: ['swimming', 'swim lessons', 'teens', 'adults'],
  },
  {
    id: 'COV-616959',
    name: 'Swimming - Adult and Teen Swimmer 1',
    ...KLP,
    ageMin: 13, ageMax: null,
    startDate: '2026-04-10', endDate: '2026-05-29',
    days: 'Fri',
    startTime: '11:15 AM', endTime: '11:55 AM',
    durationPerDay: 0.67,
    cost: null,
    costNote: 'Fee not displayed on registration page. 8 sessions. 50% Leisure Access discount available.',
    enrollmentStatus: 'Open',
    description: swimmer1Description,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616959',
    tags: ['swimming', 'swim lessons', 'teens', 'adults'],
  },

  // ── ADULT AND TEEN SWIMMER 3 ─────────────────────────────────────────────
  {
    id: 'COV-616938',
    name: 'Swimming - Adult and Teen Swimmer 3',
    ...KLP,
    ageMin: 13, ageMax: null,
    startDate: '2026-04-10', endDate: '2026-05-29',
    days: 'Fri',
    startTime: '11:15 AM', endTime: '11:55 AM',
    durationPerDay: 0.67,
    cost: null,
    costNote: 'Fee not displayed on registration page. 8 sessions. 50% Leisure Access discount available.',
    enrollmentStatus: 'Open',
    description: swimmer3Description,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616938',
    tags: ['swimming', 'swim lessons', 'teens', 'adults'],
  },
  {
    id: 'COV-616939',
    name: 'Swimming - Adult and Teen Swimmer 3',
    ...KLP,
    ageMin: 13, ageMax: null,
    startDate: '2026-04-01', endDate: '2026-05-27',
    days: 'Wed',
    startTime: '12:00 PM', endTime: '12:40 PM',
    durationPerDay: 0.67,
    cost: null,
    costNote: 'Fee not displayed on registration page. 9 sessions. 50% Leisure Access discount available.',
    enrollmentStatus: 'Open',
    description: swimmer3Description,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616939',
    tags: ['swimming', 'swim lessons', 'teens', 'adults'],
  },
];

const existingIds = new Set(programs.map(p => String(p.id)));
for (const prog of newPrograms) {
  if (existingIds.has(String(prog.id))) {
    console.log(`SKIP (exists): ${prog.id}`);
  } else {
    programs.push(prog);
    existingIds.add(String(prog.id));
    addCount++;
    console.log(`ADDED: ${prog.id} — ${prog.name} (${prog.days} ${prog.startTime})`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nDone. Fixed: ${fixCount}, Added: ${addCount}, Total: ${programs.length}`);
