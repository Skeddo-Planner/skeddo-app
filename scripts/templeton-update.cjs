#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let addCount = 0;

// ── BASE OBJECT ─────────────────────────────────────────────────────────────
const TPP = {
  provider: 'City of Vancouver - Templeton Park Pool',
  address: '700 Templeton Drive, Vancouver, BC',
  neighbourhood: 'Hastings-Sunrise',
  lat: 49.2782957,
  lng: -123.0589855,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: true,
  urlVerified: true,
  indoorOutdoor: 'Indoor',
  season: 'Year-Round',
  scheduleType: 'Activity',
  dayLength: 'Single Day',
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
};

// ── NEW PROGRAMS ─────────────────────────────────────────────────────────────
const newPrograms = [
  // ── DANCE / ARTS CAMPS (summer, registrationDate=2026-04-08 → Coming Soon) ─
  {
    id: 'COV-611037',
    name: 'Active Dance Sing/Jazz Funk/Hip Hop/KPOP (AM Half Camp)',
    description: 'Half-day summer dance camp (ages 5–14). Learn Jazz Funk, Street, and Korean Pop (KPOP) dance styles through cardio warm-ups, strengthening, footwork, isolations, and stretches. Musical theatre elements including singing and acting through games. No previous experience required. Campers grouped by age/skill upon in-camp assessment. Dress: dry indoor shoes with non-marking soles, comfortable sports/loose clothing. By ILLUMA Studio.',
    category: 'Performing Arts',
    activityType: 'Dance',
    campType: 'Summer Camp',
    ageMin: 5, ageMax: 14,
    ageSpanJustified: 'Single-skill-level camp serving wide age range (5-14) — campers grouped by age/skill on assessment day, no age-band subdivisions offered',
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '9:05 AM', endTime: '12:00 PM',
    durationPerDay: 2.92,
    cost: 238,
    costNote: '$238.00 for 5 sessions (AM half-camp, Mon–Fri). 50% Leisure Access discount available.',
    registrationDate: '2026-04-08',
    enrollmentStatus: 'Coming Soon',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/611037',
    tags: ['dance', 'performing arts', 'summer camp', 'half-day camp', 'kpop', 'hip hop', 'jazz'],
  },
  {
    id: 'COV-611038',
    name: 'Active Dance: Jazz Funk, Hip Hop and Asian Pop (PM Half Camp)',
    description: 'Half-day summer dance camp (ages 5–14). Beginner/intermediate buffet of Hip Hop, Locking, Popping, Street Dance, Korean Pop (KPOP), and more. Cardio dance skills, strengthening, footwork, isolations, and stretches. No previous experience required. Campers grouped by age/skill upon assessment. By ILLUMA Studio.',
    category: 'Performing Arts',
    activityType: 'Dance',
    campType: 'Summer Camp',
    ageMin: 5, ageMax: 14,
    ageSpanJustified: 'Single-skill-level camp serving wide age range (5-14) — campers grouped by age/skill on assessment day, no age-band subdivisions offered',
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '12:00 PM', endTime: '3:00 PM',
    durationPerDay: 3.0,
    cost: 225,
    costNote: '$225.00 for 5 sessions (PM half-camp, Mon–Fri). 50% Leisure Access discount available.',
    registrationDate: '2026-04-08',
    enrollmentStatus: 'Coming Soon',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/611038',
    tags: ['dance', 'performing arts', 'summer camp', 'half-day camp', 'kpop', 'hip hop', 'jazz'],
  },
  {
    id: 'COV-611039',
    name: 'Active Tumble, Flex and Dance (AM Half Camp)',
    description: 'Half-day summer camp combining tumbling, flexibility, and dance (ages 5–14). Through proper breathing, strengthening, tumbling, and stretching, students develop physical awareness, stronger core muscles, and increased flexibility. No previous experience required. Campers grouped by age/skill upon assessment. By ILLUMA Studio.',
    category: 'Performing Arts',
    activityType: 'Dance',
    campType: 'Summer Camp',
    ageMin: 5, ageMax: 14,
    ageSpanJustified: 'Single-skill-level camp serving wide age range (5-14) — campers grouped by age/skill on assessment day, no age-band subdivisions offered',
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '9:05 AM', endTime: '12:00 PM',
    durationPerDay: 2.92,
    cost: 238,
    costNote: '$238.00 for 5 sessions (AM half-camp, Mon–Fri). 50% Leisure Access discount available.',
    registrationDate: '2026-04-08',
    enrollmentStatus: 'Coming Soon',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/611039',
    tags: ['dance', 'gymnastics', 'tumbling', 'performing arts', 'summer camp', 'half-day camp'],
  },
  {
    id: 'COV-611040',
    name: 'Active Dance Sing/Jazz Funk/Hip Hop/KPOP (PM Half Camp)',
    description: 'Half-day summer dance camp (ages 5–14). Learn Jazz Funk, Street, and Korean Pop (KPOP) dance styles through cardio warm-ups, strengthening, footwork, isolations, and stretches. Musical theatre elements through fun games. No previous experience required. Campers grouped by age/skill upon assessment. By ILLUMA Studio.',
    category: 'Performing Arts',
    activityType: 'Dance',
    campType: 'Summer Camp',
    ageMin: 5, ageMax: 14,
    ageSpanJustified: 'Single-skill-level camp serving wide age range (5-14) — campers grouped by age/skill on assessment day, no age-band subdivisions offered',
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '12:00 PM', endTime: '3:00 PM',
    durationPerDay: 3.0,
    cost: 225,
    costNote: '$225.00 for 5 sessions (PM half-camp, Mon–Fri). 50% Leisure Access discount available.',
    registrationDate: '2026-04-08',
    enrollmentStatus: 'Coming Soon',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/611040',
    tags: ['dance', 'performing arts', 'summer camp', 'half-day camp', 'kpop', 'hip hop', 'jazz'],
  },

  // ── MUSIC CLASSES (weekly spring, registration already open) ─────────────
  {
    id: 'COV-611473',
    name: 'Adventures in Music - Babies',
    description: 'Interactive music class for babies (under 18 months) with caregiver. Songs, chants, rhymes, instruments, dance with bubbles and more. Supports development in language/speech, social, emotional, physical, and cognitive domains. Caregiver participation required. Siblings may receive a discount when registering in person or by phone. Drop-in available at $17, space permitting.',
    category: 'Performing Arts',
    activityType: 'Music',
    campType: 'Spring Program',
    ageMin: 0, ageMax: 1,
    startDate: '2026-04-10', endDate: '2026-06-19',
    days: 'Fri',
    startTime: '11:30 AM', endTime: '12:15 PM',
    durationPerDay: 0.75,
    cost: 165,
    costNote: '$165.00 for 11 sessions (weekly Fri, Apr 10–Jun 19). $17 drop-in, space permitting. 50% Leisure Access discount available.',
    registrationDate: null,
    enrollmentStatus: 'Open',
    repeating: 'weekly',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/611473',
    tags: ['music', 'infant', 'babies', 'performing arts', 'caregiver', 'toddler'],
  },
  {
    id: 'COV-611405',
    name: 'Adventures in Music - Mixed Ages',
    description: 'Interactive music class for children ages 1–5 with caregiver. Sing songs, learn rhymes, play instruments, and explore movement. Covers musical concepts: rhythm, solfege/pitch, tempo, dynamics, improvisation. Supports development in language, social, physical, and cognitive domains. Siblings under 1 year attend free. Caregiver participation required. Drop-in available at $17, space permitting.',
    category: 'Performing Arts',
    activityType: 'Music',
    campType: 'Spring Program',
    ageMin: 1, ageMax: 5,
    startDate: '2026-04-10', endDate: '2026-06-19',
    days: 'Fri',
    startTime: '10:30 AM', endTime: '11:15 AM',
    durationPerDay: 0.75,
    cost: 165,
    costNote: '$165.00 for 11 sessions (weekly Fri, Apr 10–Jun 19). $17 drop-in, space permitting. Siblings under 1 attend free. 50% Leisure Access discount available.',
    registrationDate: null,
    enrollmentStatus: 'Open',
    repeating: 'weekly',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/611405',
    tags: ['music', 'toddler', 'preschool', 'performing arts', 'caregiver'],
  },
];

const existingIds = new Set(programs.map(p => String(p.id)));
for (const prog of newPrograms) {
  if (existingIds.has(String(prog.id))) {
    console.log(`SKIP (exists): ${prog.id}`);
  } else {
    const full = { ...TPP, ...prog };
    programs.push(full);
    existingIds.add(String(prog.id));
    addCount++;
    console.log(`ADDED: ${prog.id} — ${prog.name}`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nDone. Added: ${addCount}, Total: ${programs.length}`);
