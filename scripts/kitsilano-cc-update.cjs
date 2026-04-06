#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let fixCount = 0;
let addCount = 0;

// ── 1. R46 FIXES ──────────────────────────────────────────────────────────────
const afterCareJustification = 'After care program serving campers ages 6–12 enrolled in Kits Kids Day Camp — single bracket, no age-band subdivisions';
const fairJustification = 'Information fair for families with children ages 0–7 — single event serving all ages in this range, no age-band subdivisions';

const r46Fixes = {
  'COV-607273': afterCareJustification,
  'COV-607279': afterCareJustification,
  'COV-607281': afterCareJustification,
  'COV-607282': afterCareJustification,
  'COV-607284': afterCareJustification,
  'COV-607287': afterCareJustification,
  'COV-607293': afterCareJustification,
  'COV-607301': afterCareJustification,
  'COV-613995': fairJustification,
};

for (const prog of programs) {
  const j = r46Fixes[String(prog.id)];
  if (j && !prog.ageSpanJustified) {
    prog.ageSpanJustified = j;
    fixCount++;
    console.log(`R46 fix: ${prog.id} — ${prog.name}`);
  }
}

// ── BASE OBJECT ──────────────────────────────────────────────────────────────
const KCC = {
  provider: 'City of Vancouver - Kitsilano Cmty Centre',
  address: '2690 Larch Street, Vancouver, BC',
  neighbourhood: 'Kitsilano',
  lat: 49.2615255,
  lng: -123.1620902,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: true,
  urlVerified: true,
  indoorOutdoor: 'Indoor',
  season: 'Spring 2026',
  campType: 'Spring Program',
  scheduleType: 'Activity',
  dayLength: 'Single Day',
  registrationDate: null,
  enrollmentStatus: 'Full/Waitlist',
  repeating: 'weekly',
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
};

// ── 2. NEW PROGRAMS ──────────────────────────────────────────────────────────
const newPrograms = [
  // ── BABY DANCE ───────────────────────────────────────────────────────────
  {
    id: 'COV-604666',
    name: 'Baby Dance (3 months-pre-walking)',
    ...KCC,
    ageMin: 0, ageMax: 1,
    startDate: '2026-04-07', endDate: '2026-05-12',
    days: 'Tue',
    startTime: '11:25 AM', endTime: '12:00 PM',
    durationPerDay: 0.58,
    cost: 96,
    costNote: '$96.00 for 6 sessions (weekly Tue, Apr 7–May 12). Caregiver participation required.',
    description: 'Dance and play with your little one to music, songs and rhymes. Bonding with your baby and social interactions with other parents are the foundations for this class. Floor time, tummy time, and dancing in arms allow for gentle and playful connections that nurture your baby\'s development. For babies 3 months to pre-walking with caregiver.',
    category: 'Performing Arts',
    activityType: 'Dance',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/604666',
    tags: ['dance', 'infant', 'baby', 'caregiver', 'performing arts'],
  },

  // ── BEGINNER BABY SIGN LANGUAGE ─────────────────────────────────────────
  {
    id: 'COV-604661',
    name: 'Beginner Baby Sign Language (Birth-18 months)',
    ...KCC,
    ageMin: 0, ageMax: 1,
    startDate: '2026-04-08', endDate: '2026-05-13',
    days: 'Wed',
    startTime: '1:00 PM', endTime: '1:45 PM',
    durationPerDay: 0.75,
    cost: 120,
    costNote: '$120.00 for 6 sessions (weekly Wed, Apr 8–May 13). Caregiver participation required.',
    description: 'Babies and toddlers can express themselves without crying using simple American Sign Language. Learn exactly how to start teaching your little one to sign in a playful classroom format alongside other families. Covers signs for everyday needs and communication. For birth–18 months with caregiver.',
    category: 'Education',
    activityType: 'Language',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/604661',
    tags: ['sign language', 'baby', 'infant', 'caregiver', 'language', 'education'],
  },
  {
    id: 'COV-604663',
    name: 'Beginner Baby Sign Language (Birth-18 months)',
    ...KCC,
    ageMin: 0, ageMax: 1,
    startDate: '2026-04-08', endDate: '2026-05-13',
    days: 'Wed',
    startTime: '2:15 PM', endTime: '3:00 PM',
    durationPerDay: 0.75,
    cost: 120,
    costNote: '$120.00 for 6 sessions (weekly Wed, Apr 8–May 13). Caregiver participation required.',
    description: 'Babies and toddlers can express themselves without crying using simple American Sign Language. Learn exactly how to start teaching your little one to sign in a playful classroom format alongside other families. Covers signs for everyday needs and communication. For birth–18 months with caregiver.',
    category: 'Education',
    activityType: 'Language',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/604663',
    tags: ['sign language', 'baby', 'infant', 'caregiver', 'language', 'education'],
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
    console.log(`ADDED: ${prog.id} — ${prog.name}`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nDone. R46 fixed: ${fixCount}, Added: ${addCount}, Total: ${programs.length}`);
