#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let fixCount = 0;
let addCount = 0;

// ── 1. R46 FIXES — add ageSpanJustified to existing swim programs ─────────────
const swimLevelJustification = 'CoV aquatics single skill level — age range reflects all children who may enroll at this proficiency level, no age-band subdivisions offered';
const swimClubJustification = 'Recreational swim club serving ages 8–15 — single competitive development track, no age-band subdivisions within club sessions';

const r46Fixes = {
  'COV-607975': swimClubJustification,
  'COV-614939': swimLevelJustification,
  'COV-614941': swimLevelJustification,
  'COV-614942': swimLevelJustification,
  'COV-614943': swimLevelJustification,
  'COV-614947': swimLevelJustification,
  'COV-614998': swimLevelJustification,
  'COV-615008': swimLevelJustification,
  'COV-615010': swimLevelJustification,
};

const r46Set = new Set(Object.keys(r46Fixes));
for (const prog of programs) {
  if (r46Set.has(String(prog.id)) && !prog.ageSpanJustified) {
    prog.ageSpanJustified = r46Fixes[String(prog.id)];
    fixCount++;
    console.log(`R46 fix: ${prog.id} — ${prog.name}`);
  }
}

// ── BASE OBJECT ─────────────────────────────────────────────────────────────
const BP = {
  provider: 'City of Vancouver - Britannia Pool',
  address: 'Britannia Pool, Vancouver, BC',
  neighbourhood: 'Vancouver',
  lat: 49.2754,
  lng: -123.0716,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: true,
  urlVerified: true,
  indoorOutdoor: 'Indoor',
  season: 'Spring 2026',
  campType: 'Spring Program',
  scheduleType: 'Activity',
  dayLength: 'Single Day',
  category: 'Sports',
  activityType: 'Swimming',
  registrationDate: null,
  enrollmentStatus: 'Open',
  repeating: 'weekly',
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  tags: ['swimming', 'aquatics', 'indoor'],
};

// ── 2. NEW PROGRAMS ──────────────────────────────────────────────────────────
const newPrograms = [

  // ── BRITANNIA SWIM CLUB — Tuesday session (missing) ───────────────────────
  {
    id: 'COV-607974',
    name: 'Swimming - Britannia Swim Club',
    ...BP,
    ageMin: 8, ageMax: 15,
    ageSpanJustified: swimClubJustification,
    startDate: '2026-03-31', endDate: '2026-06-16',
    days: 'Tue',
    startTime: '6:45 PM', endTime: '7:45 PM',
    durationPerDay: 1.0,
    cost: 72,
    costNote: '$72.00 for 12 sessions (weekly Tue, Mar 31–Jun 16). Prerequisite: Swimmer 4 or higher, or continuous 25m front swim.',
    enrollmentStatus: 'Full/Waitlist',
    description: 'Britannia Swim club is a community children/youth recreational swim club dedicated to swim development while building positive interactions and having fun. Stroke development, endurance, water safety skills, and social development. Prerequisite: Swimmers must be at Swimmers 4 or higher or able to continuously swim on their front unassisted for a minimum of 25m. Must be evaluated before registering unless a returning club member.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607974',
    tags: ['swimming', 'swim club', 'aquatics', 'indoor', 'competitive'],
  },

  // ── PARENT AND TOT 1 — JELLYFISH (4 months to under 1 yr) ────────────────
  // Tue sessions
  {
    id: 'COV-614954',
    name: 'Swimming - Parent and Tot 1 - Jellyfish',
    ...BP,
    ageMin: 0, ageMax: 1,
    startDate: '2026-03-31', endDate: '2026-05-05',
    days: 'Tue',
    startTime: '9:00 AM', endTime: '9:30 AM',
    durationPerDay: 0.5,
    cost: 85.60,
    costNote: '$85.60 for 6 sessions (weekly Tue, Mar 31–May 5). Prerequisite: 4–12 months of age, able to hold head up, with parent/caregiver. Swim diapers mandatory.',
    enrollmentStatus: 'Open',
    description: 'Infant swim lessons for babies 4–12 months with parent or caregiver. Babies and caregivers work on getting wet, buoyancy and movement, front/back/vertical positions in the water, and shallow water entries and exits. Swim diapers mandatory — bring your own or purchase at the facility.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/614954',
    tags: ['swimming', 'parent and tot', 'infant', 'aquatics', 'caregiver', 'indoor'],
  },
  {
    id: 'COV-615034',
    name: 'Swimming - Parent and Tot 1 - Jellyfish',
    ...BP,
    ageMin: 0, ageMax: 1,
    startDate: '2026-05-12', endDate: '2026-06-16',
    days: 'Tue',
    startTime: '9:00 AM', endTime: '9:30 AM',
    durationPerDay: 0.5,
    cost: 85.60,
    costNote: '$85.60 for 6 sessions (weekly Tue, May 12–Jun 16). Prerequisite: 4–12 months, able to hold head up, with parent/caregiver. Swim diapers mandatory.',
    enrollmentStatus: 'Full/Waitlist',
    description: 'Infant swim lessons for babies 4–12 months with parent or caregiver. Babies and caregivers work on getting wet, buoyancy and movement, front/back/vertical positions in the water, and shallow water entries and exits. Swim diapers mandatory.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615034',
    tags: ['swimming', 'parent and tot', 'infant', 'aquatics', 'caregiver', 'indoor'],
  },
  // Thu sessions
  {
    id: 'COV-615040',
    name: 'Swimming - Parent and Tot 1 - Jellyfish',
    ...BP,
    ageMin: 0, ageMax: 1,
    startDate: '2026-04-02', endDate: '2026-05-07',
    days: 'Thu',
    startTime: '10:00 AM', endTime: '10:30 AM',
    durationPerDay: 0.5,
    cost: 85.60,
    costNote: '$85.60 for 6 sessions (weekly Thu, Apr 2–May 7). Prerequisite: 4–12 months, able to hold head up, with parent/caregiver. Swim diapers mandatory.',
    enrollmentStatus: 'Open',
    description: 'Infant swim lessons for babies 4–12 months with parent or caregiver. Babies and caregivers work on getting wet, buoyancy and movement, front/back/vertical positions in the water, and shallow water entries and exits. Swim diapers mandatory.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615040',
    tags: ['swimming', 'parent and tot', 'infant', 'aquatics', 'caregiver', 'indoor'],
  },
  {
    id: 'COV-615041',
    name: 'Swimming - Parent and Tot 1 - Jellyfish',
    ...BP,
    ageMin: 0, ageMax: 1,
    startDate: '2026-05-14', endDate: '2026-06-18',
    days: 'Thu',
    startTime: '10:00 AM', endTime: '10:30 AM',
    durationPerDay: 0.5,
    cost: 85.60,
    costNote: '$85.60 for 6 sessions (weekly Thu, May 14–Jun 18). Prerequisite: 4–12 months, able to hold head up, with parent/caregiver. Swim diapers mandatory.',
    enrollmentStatus: 'Full/Waitlist',
    description: 'Infant swim lessons for babies 4–12 months with parent or caregiver. Babies and caregivers work on getting wet, buoyancy and movement, front/back/vertical positions in the water, and shallow water entries and exits. Swim diapers mandatory.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615041',
    tags: ['swimming', 'parent and tot', 'infant', 'aquatics', 'caregiver', 'indoor'],
  },
  // Sat session
  {
    id: 'COV-615044',
    name: 'Swimming - Parent and Tot 1 - Jellyfish',
    ...BP,
    ageMin: 0, ageMax: 1,
    startDate: '2026-04-11', endDate: '2026-06-20',
    days: 'Sat',
    startTime: '11:00 AM', endTime: '11:30 AM',
    durationPerDay: 0.5,
    cost: 85.60,
    costNote: '$85.60 for 10 sessions (weekly Sat, Apr 11–Jun 20). Prerequisite: 4–12 months, able to hold head up, with parent/caregiver. Swim diapers mandatory.',
    enrollmentStatus: 'Open',
    description: 'Infant swim lessons for babies 4–12 months with parent or caregiver. Babies and caregivers work on getting wet, buoyancy and movement, front/back/vertical positions in the water, and shallow water entries and exits. Swim diapers mandatory.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615044',
    tags: ['swimming', 'parent and tot', 'infant', 'aquatics', 'caregiver', 'indoor'],
  },
  // Sun session
  {
    id: 'COV-615045',
    name: 'Swimming - Parent and Tot 1 - Jellyfish',
    ...BP,
    ageMin: 0, ageMax: 1,
    startDate: '2026-04-12', endDate: '2026-06-14',
    days: 'Sun',
    startTime: '11:30 AM', endTime: '12:00 PM',
    durationPerDay: 0.5,
    cost: 85.60,
    costNote: '$85.60 for 10 sessions (weekly Sun, Apr 12–Jun 14). Prerequisite: 4–12 months, able to hold head up, with parent/caregiver. Swim diapers mandatory.',
    enrollmentStatus: 'Full/Waitlist',
    description: 'Infant swim lessons for babies 4–12 months with parent or caregiver. Babies and caregivers work on getting wet, buoyancy and movement, front/back/vertical positions in the water, and shallow water entries and exits. Swim diapers mandatory.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615045',
    tags: ['swimming', 'parent and tot', 'infant', 'aquatics', 'caregiver', 'indoor'],
  },

  // ── PARENT AND TOT 2 AND 3 — GOLDFISH AND SEAHORSE (1–2 yrs) ────────────
  // Tue sessions
  {
    id: 'COV-614955',
    name: 'Swimming - Parent and Tot 2 and 3 - Goldfish and Seahorse',
    ...BP,
    ageMin: 1, ageMax: 2,
    startDate: '2026-03-31', endDate: '2026-05-05',
    days: 'Tue',
    startTime: '9:30 AM', endTime: '10:00 AM',
    durationPerDay: 0.5,
    cost: 85.60,
    costNote: '$85.60 for 6 sessions (weekly Tue, Mar 31–May 5). Ages 1–2 with parent/caregiver.',
    enrollmentStatus: 'Full/Waitlist',
    description: 'Toddler swim lessons for children ages 1–2 with parent or caregiver. Works on water comfort, buoyancy, movement, and basic swimming skills in a fun, supportive environment. Parent or caregiver participation required.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/614955',
    tags: ['swimming', 'parent and tot', 'toddler', 'aquatics', 'caregiver', 'indoor'],
  },
  {
    id: 'COV-615035',
    name: 'Swimming - Parent and Tot 2 and 3 - Goldfish and Seahorse',
    ...BP,
    ageMin: 1, ageMax: 2,
    startDate: '2026-05-12', endDate: '2026-06-16',
    days: 'Tue',
    startTime: '9:30 AM', endTime: '10:00 AM',
    durationPerDay: 0.5,
    cost: 85.60,
    costNote: '$85.60 for 6 sessions (weekly Tue, May 12–Jun 16). Ages 1–2 with parent/caregiver.',
    enrollmentStatus: 'Full/Waitlist',
    description: 'Toddler swim lessons for children ages 1–2 with parent or caregiver. Works on water comfort, buoyancy, movement, and basic swimming skills in a fun, supportive environment. Parent or caregiver participation required.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615035',
    tags: ['swimming', 'parent and tot', 'toddler', 'aquatics', 'caregiver', 'indoor'],
  },
  // Thu sessions
  {
    id: 'COV-615042',
    name: 'Swimming - Parent and Tot 2 and 3 - Goldfish and Seahorse',
    ...BP,
    ageMin: 1, ageMax: 2,
    startDate: '2026-04-02', endDate: '2026-05-07',
    days: 'Thu',
    startTime: '10:30 AM', endTime: '11:00 AM',
    durationPerDay: 0.5,
    cost: 85.60,
    costNote: '$85.60 for 6 sessions (weekly Thu, Apr 2–May 7). Ages 1–2 with parent/caregiver.',
    enrollmentStatus: 'Full/Waitlist',
    description: 'Toddler swim lessons for children ages 1–2 with parent or caregiver. Works on water comfort, buoyancy, movement, and basic swimming skills in a fun, supportive environment. Parent or caregiver participation required.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615042',
    tags: ['swimming', 'parent and tot', 'toddler', 'aquatics', 'caregiver', 'indoor'],
  },
  {
    id: 'COV-615043',
    name: 'Swimming - Parent and Tot 2 and 3 - Goldfish and Seahorse',
    ...BP,
    ageMin: 1, ageMax: 2,
    startDate: '2026-05-14', endDate: '2026-06-18',
    days: 'Thu',
    startTime: '10:30 AM', endTime: '11:00 AM',
    durationPerDay: 0.5,
    cost: 85.60,
    costNote: '$85.60 for 6 sessions (weekly Thu, May 14–Jun 18). Ages 1–2 with parent/caregiver.',
    enrollmentStatus: 'Full/Waitlist',
    description: 'Toddler swim lessons for children ages 1–2 with parent or caregiver. Works on water comfort, buoyancy, movement, and basic swimming skills in a fun, supportive environment. Parent or caregiver participation required.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615043',
    tags: ['swimming', 'parent and tot', 'toddler', 'aquatics', 'caregiver', 'indoor'],
  },
  // Sat session
  {
    id: 'COV-615046',
    name: 'Swimming - Parent and Tot 2 and 3 - Goldfish and Seahorse',
    ...BP,
    ageMin: 1, ageMax: 2,
    startDate: '2026-04-11', endDate: '2026-06-20',
    days: 'Sat',
    startTime: '11:30 AM', endTime: '12:00 PM',
    durationPerDay: 0.5,
    cost: 85.60,
    costNote: '$85.60 for 10 sessions (weekly Sat, Apr 11–Jun 20). Ages 1–2 with parent/caregiver.',
    enrollmentStatus: 'Full/Waitlist',
    description: 'Toddler swim lessons for children ages 1–2 with parent or caregiver. Works on water comfort, buoyancy, movement, and basic swimming skills in a fun, supportive environment. Parent or caregiver participation required.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615046',
    tags: ['swimming', 'parent and tot', 'toddler', 'aquatics', 'caregiver', 'indoor'],
  },
  // Sun session
  {
    id: 'COV-615048',
    name: 'Swimming - Parent and Tot 2 and 3 - Goldfish and Seahorse',
    ...BP,
    ageMin: 1, ageMax: 2,
    startDate: '2026-04-12', endDate: '2026-06-14',
    days: 'Sun',
    startTime: '11:00 AM', endTime: '11:30 AM',
    durationPerDay: 0.5,
    cost: 85.60,
    costNote: '$85.60 for 10 sessions (weekly Sun, Apr 12–Jun 14). Ages 1–2 with parent/caregiver.',
    enrollmentStatus: 'Full/Waitlist',
    description: 'Toddler swim lessons for children ages 1–2 with parent or caregiver. Works on water comfort, buoyancy, movement, and basic swimming skills in a fun, supportive environment. Parent or caregiver participation required.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615048',
    tags: ['swimming', 'parent and tot', 'toddler', 'aquatics', 'caregiver', 'indoor'],
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
console.log(`\nDone. R46 fixed: ${fixCount}, Added: ${addCount}, Total: ${programs.length}`);
