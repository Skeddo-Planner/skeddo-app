#!/usr/bin/env node
// wpg-audit-update.cjs
// West Point Grey CC (center_id=49) audit — 2026-04-06
// Adds 1 missing program:
//   - Summer Smash Tennis: Mini Aces (6-7½ yrs) — spring lesson May 4 – Jun 15, 2026
// All 100 "camp" keyword programs verified in DB; only non-camp spring lesson missing.
// Fee: registration opens Apr 11 (not Apr 8); fee modal not yet accessible — cost=null.

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

const NEW_PROGRAMS = [
  // Summer Smash Tennis: Mini Aces (6-7½ yrs)
  // display #614560 → URL ID 614560-2922 = 611638
  // May 4-Jun 15 (Mon), 4:15-5:00PM, ages 6-7.5 yrs
  // Registration: Apr 11, 2026 9:00 AM; 6 sessions (no class May 18)
  // Location: Trimble Park Tennis Courts, West 7th Ave & Trimble St, Vancouver
  {
    id: 'COV-611638',
    name: 'Summer Smash Tennis: Mini Aces (6-7½ yrs)',
    provider: 'City of Vancouver - West Point Grey Cmty Centre - Aberthau',
    category: 'Sports',
    campType: 'Spring Program',
    activityType: 'Tennis',
    season: 'Spring 2026',
    indoorOutdoor: 'Outdoor',
    neighbourhood: 'West Point Grey',
    address: '4397 West 2nd Avenue, Vancouver, BC',
    lat: 49.2715229,
    lng: -123.2051641,
    city: 'Vancouver',
    confirmed2026: true,
    priceVerified: false,
    registrationDate: '2026-04-11',
    registrationDateLabel: 'Apr 11 at 9:00 AM',
    ageMin: 6,
    ageMax: 7,
    startDate: '2026-05-04',
    endDate: '2026-06-15',
    days: 'Mon',
    startTime: '4:15 PM',
    endTime: '5:00 PM',
    cost: null,
    costNote: 'Registration opens Apr 11, 2026 at 9:00 AM; fee not yet listed. See registrationUrl for current pricing.',
    scheduleType: 'Activity',
    dayLength: 'Single Day',
    durationPerDay: 0.75,
    enrollmentStatus: 'Coming Soon',
    repeating: 'weekly',
    description: 'Start or continue learning tennis. Lessons focus on developing fundamental movement, tracking, and racquet skills. An emphasis is placed on developing motor skills and physical literacy specific to tennis. Students are expected to bring their own rackets, to come dressed in athletic clothing with athletic shoes, and water bottle. No class May 18. This program takes place at Trimble Park Tennis Courts at West 7th Avenue and Trimble Street.',
    tags: ['tennis', 'beginner-friendly'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/611638',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  },
];

let added = 0;
for (const prog of NEW_PROGRAMS) {
  const dupById = programs.find(p => String(p.id) === String(prog.id));
  const dupByUrl = prog.registrationUrl && programs.find(p => p.registrationUrl === prog.registrationUrl);
  if (dupById || dupByUrl) {
    console.log('SKIP (already in DB):', prog.id, prog.name);
    continue;
  }
  programs.push(prog);
  console.log('ADD:', prog.id, prog.name, prog.startDate, 'cost=null (pre-enrollment)');
  added++;
}

fs.writeFileSync(DATA_FILE, JSON.stringify(programs, null, 2));
console.log('\nAdded:', added, '| Total programs:', programs.length);
