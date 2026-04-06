#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let fixCount = 0;
let addCount = 0;

// ── 1. R46 FIXES ──────────────────────────────────────────────────────────────
const childJustification = 'CoV skating single skill level using Child age bracket (ages 6–12) — no age-band subdivisions, only skill-level progressions';
const adaptedJustification = 'Adapted skating serving wide age range (3–17) — no age-band subdivisions; registration by designated contact through Access Services only';

const r46Fixes = {
  'COV-616496': childJustification,
  'COV-616497': childJustification,
  'COV-616498': childJustification,
  'COV-616499': childJustification,
  'COV-616813': childJustification,
  'COV-616817': childJustification,
  'COV-616818': childJustification,
  'COV-616823': childJustification,
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
const HR = {
  provider: 'City of Vancouver - Hillcrest Rink',
  address: '4575 Clancy Loranger Way, Vancouver, BC',
  neighbourhood: 'South Cambie',
  lat: 49.2440658,
  lng: -123.1078052,
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
  activityType: 'Skating',
  registrationDate: null,
  enrollmentStatus: 'Full/Waitlist',
  repeating: 'weekly',
  durationPerDay: 0.5,
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
};

const childDesc1 = 'Entry level skating class for children ages 6–12. If you are a returning student, bring your previous report card to the first lesson. Skate rentals available at additional cost. Cycling helmets not permitted — hockey helmets available free for lesson registrants.';
const childDesc2 = 'Skating - Child Level 2 for ages 6–12. Must be able to fall and get up unassisted. If you are a returning student, bring your previous report card to the first lesson. Skate rentals available at additional cost.';
const adaptedDesc = 'Adapted Skating Lessons for participants with disabilities (ages 3–17). Registration by designated student/family only — prearranged through Access Services. Skate rentals available at additional cost.';

// ── 2. NEW PROGRAMS ──────────────────────────────────────────────────────────
const newPrograms = [

  // ── CHILD LEVEL 1 — Sun Apr 5–May 10 (6 sessions each) ───────────────────
  { id: 'COV-616444', name: 'Skating - Child Level 1', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '9:45 AM', endTime: '10:15 AM', cost: 39.72, costNote: '$39.72 for 6 sessions (weekly Sun, Apr 5–May 10).', description: childDesc1, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616444', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616445', name: 'Skating - Child Level 1', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '10:15 AM', endTime: '10:45 AM', cost: 39.72, costNote: '$39.72 for 6 sessions (weekly Sun, Apr 5–May 10).', description: childDesc1, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616445', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616446', name: 'Skating - Child Level 1', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '10:45 AM', endTime: '11:15 AM', cost: 39.72, costNote: '$39.72 for 6 sessions (weekly Sun, Apr 5–May 10).', description: childDesc1, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616446', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616447', name: 'Skating - Child Level 1', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '11:15 AM', endTime: '11:45 AM', cost: 39.72, costNote: '$39.72 for 6 sessions (weekly Sun, Apr 5–May 10).', description: childDesc1, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616447', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616448', name: 'Skating - Child Level 1', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '12:00 PM', endTime: '12:30 PM', cost: 39.72, costNote: '$39.72 for 6 sessions (weekly Sun, Apr 5–May 10).', description: childDesc1, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616448', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616449', name: 'Skating - Child Level 1', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '12:30 PM', endTime: '1:00 PM', cost: 39.72, costNote: '$39.72 for 6 sessions (weekly Sun, Apr 5–May 10).', description: childDesc1, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616449', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616450', name: 'Skating - Child Level 1', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '1:00 PM', endTime: '1:30 PM', cost: 39.72, costNote: '$39.72 for 6 sessions (weekly Sun, Apr 5–May 10).', description: childDesc1, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616450', tags: ['skating', 'ice skating', 'kids', 'sports'] },

  // ── CHILD LEVEL 1 — Wed Apr 1–May 13 (7 sessions each) ───────────────────
  { id: 'COV-616801', name: 'Skating - Child Level 1', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-01', endDate: '2026-05-13', days: 'Wed', startTime: '3:45 PM', endTime: '4:15 PM', cost: 39.72, costNote: '$39.72 for 7 sessions (weekly Wed, Apr 1–May 13).', description: childDesc1, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616801', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616807', name: 'Skating - Child Level 1', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-01', endDate: '2026-05-13', days: 'Wed', startTime: '4:15 PM', endTime: '4:45 PM', cost: 39.72, costNote: '$39.72 for 7 sessions (weekly Wed, Apr 1–May 13).', description: childDesc1, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616807', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616815', name: 'Skating - Child Level 1', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-01', endDate: '2026-05-13', days: 'Wed', startTime: '4:45 PM', endTime: '5:15 PM', cost: 39.72, costNote: '$39.72 for 7 sessions (weekly Wed, Apr 1–May 13).', description: childDesc1, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616815', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616821', name: 'Skating - Child Level 1', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-01', endDate: '2026-05-13', days: 'Wed', startTime: '5:15 PM', endTime: '5:45 PM', cost: 39.72, costNote: '$39.72 for 7 sessions (weekly Wed, Apr 1–May 13).', description: childDesc1, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616821', tags: ['skating', 'ice skating', 'kids', 'sports'] },

  // ── CHILD LEVEL 2 — Sun Apr 5–May 10 (6 sessions each) ───────────────────
  { id: 'COV-616484', name: 'Skating - Child Level 2', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '9:45 AM', endTime: '10:15 AM', cost: 39.72, costNote: '$39.72 for 6 sessions (weekly Sun, Apr 5–May 10).', description: childDesc2, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616484', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616485', name: 'Skating - Child Level 2', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '9:45 AM', endTime: '10:15 AM', cost: 39.72, costNote: '$39.72 for 6 sessions (weekly Sun, Apr 5–May 10). Second group at same time.', description: childDesc2, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616485', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616486', name: 'Skating - Child Level 2', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '10:15 AM', endTime: '10:45 AM', cost: 39.72, costNote: '$39.72 for 6 sessions (weekly Sun, Apr 5–May 10).', description: childDesc2, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616486', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616487', name: 'Skating - Child Level 2', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '10:45 AM', endTime: '11:15 AM', cost: 39.72, costNote: '$39.72 for 6 sessions (weekly Sun, Apr 5–May 10).', description: childDesc2, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616487', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616488', name: 'Skating - Child Level 2', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '11:15 AM', endTime: '11:45 AM', cost: 39.72, costNote: '$39.72 for 6 sessions (weekly Sun, Apr 5–May 10).', description: childDesc2, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616488', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616489', name: 'Skating - Child Level 2', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '12:00 PM', endTime: '12:30 PM', cost: 39.72, costNote: '$39.72 for 6 sessions (weekly Sun, Apr 5–May 10).', description: childDesc2, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616489', tags: ['skating', 'ice skating', 'kids', 'sports'] },

  // ── CHILD LEVEL 2 — Wed Apr 1–May 13 (7 sessions each) ───────────────────
  { id: 'COV-616812', name: 'Skating - Child Level 2', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-01', endDate: '2026-05-13', days: 'Wed', startTime: '4:15 PM', endTime: '4:45 PM', cost: 39.72, costNote: '$39.72 for 7 sessions (weekly Wed, Apr 1–May 13).', description: childDesc2, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616812', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616816', name: 'Skating - Child Level 2', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-01', endDate: '2026-05-13', days: 'Wed', startTime: '4:45 PM', endTime: '5:15 PM', cost: 39.72, costNote: '$39.72 for 7 sessions (weekly Wed, Apr 1–May 13).', description: childDesc2, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616816', tags: ['skating', 'ice skating', 'kids', 'sports'] },
  { id: 'COV-616822', name: 'Skating - Child Level 2', ...HR, ageMin: 6, ageMax: 12, startDate: '2026-04-01', endDate: '2026-05-13', days: 'Wed', startTime: '5:15 PM', endTime: '5:45 PM', cost: 39.72, costNote: '$39.72 for 7 sessions (weekly Wed, Apr 1–May 13).', description: childDesc2, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616822', tags: ['skating', 'ice skating', 'kids', 'sports'] },

  // ── ADAPTED SKATING LESSONS ───────────────────────────────────────────────
  { id: 'COV-616544', name: 'Skating - Adapted Skating Lessons', ...HR, ageMin: 3, ageMax: 17, ageSpanJustified: adaptedJustification, startDate: '2026-04-05', endDate: '2026-05-10', days: 'Sun', startTime: '10:15 AM', endTime: '10:45 AM', cost: 48.78, costNote: '$48.78 for 6 sessions (weekly Sun, Apr 5–May 10). Registration by designated student/family through Access Services only.', description: adaptedDesc, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616544', tags: ['skating', 'adapted', 'inclusive', 'special needs', 'sports'] },
  { id: 'COV-616829', name: 'Skating - Adapted Skating Lessons', ...HR, ageMin: 3, ageMax: 17, ageSpanJustified: adaptedJustification, startDate: '2026-04-01', endDate: '2026-05-13', days: 'Wed', startTime: '3:45 PM', endTime: '4:15 PM', cost: 48.78, costNote: '$48.78 for 7 sessions (weekly Wed, Apr 1–May 13). Registration by designated student/family through Access Services only.', description: adaptedDesc, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616829', tags: ['skating', 'adapted', 'inclusive', 'special needs', 'sports'] },
  { id: 'COV-616830', name: 'Skating - Adapted Skating Lessons', ...HR, ageMin: 3, ageMax: 17, ageSpanJustified: adaptedJustification, startDate: '2026-04-01', endDate: '2026-05-13', days: 'Wed', startTime: '4:15 PM', endTime: '4:45 PM', cost: 48.78, costNote: '$48.78 for 7 sessions (weekly Wed, Apr 1–May 13). Registration by designated student/family through Access Services only.', description: adaptedDesc, registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616830', tags: ['skating', 'adapted', 'inclusive', 'special needs', 'sports'] },
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
