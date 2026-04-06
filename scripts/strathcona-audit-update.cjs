#!/usr/bin/env node
// strathcona-audit-update.cjs
// Adds 5 missing programs to City of Vancouver - Strathcona Community Centre:
//   - Supershine Summer Day Camp (8-9yrs) Wk 5-8 (4 programs)
//   - Pro-D Day Camp - April 20, 2026 (1 program)
// All fees verified via ActiveNet fee modal (browser navigation).

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

const BASE = {
  provider: 'City of Vancouver - Strathcona Community Centre',
  category: 'Multi-Activity',
  campType: 'Summer Camp',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Strathcona',
  address: '601 Keefer St, Vancouver, BC V6A 3V8',
  lat: 49.279,
  lng: -123.0895,
  city: 'Vancouver',
  season: 'Summer 2026',
  confirmed2026: true,
  priceVerified: true,
  registrationDate: '2026-04-08',
  registrationDateLabel: 'Apr 8 at 7:00 PM',
  ageMin: 8,
  ageMax: 9,
  startTime: '9:00 AM',
  endTime: '4:00 PM',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 7,
  activityType: 'Day Camp',
  tags: ['multi-activity', 'day camp'],
  description: 'Supershine Summer Day Camp (8-9yrs) at Strathcona Community Centre. Activities include arts & crafts, neighbourhood adventures, sports, and games.',
};

const WEEKDAYS = 'Mon,Tue,Wed,Thu,Fri';
const BC_WEEK = 'Tue,Wed,Thu,Fri'; // Aug 4-7

const NEW_PROGRAMS = [
  // Supershine 8-9yrs Wk 5-8
  // Wk 5 (Jul 27-31): display #586175 → URL ID 583253, $140, 5-day
  {
    ...BASE,
    id: 'COV-583253',
    name: 'Supershine Summer Day Camp (8-9yrs) Wk 5',
    startDate: '2026-07-27',
    endDate: '2026-07-31',
    days: WEEKDAYS,
    cost: 140,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583253?onlineSiteId=0&from_original_cui=true',
  },
  // Wk 6 (Aug 4-7, BC Day Mon off): display #586176 → URL ID 583254, $112, 4-day
  {
    ...BASE,
    id: 'COV-583254',
    name: 'Supershine Summer Day Camp (8-9yrs) Wk 6',
    startDate: '2026-08-04',
    endDate: '2026-08-07',
    days: BC_WEEK,
    cost: 112,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583254?onlineSiteId=0&from_original_cui=true',
  },
  // Wk 7 (Aug 10-14): display #586177 → URL ID 583255, $140, 5-day
  {
    ...BASE,
    id: 'COV-583255',
    name: 'Supershine Summer Day Camp (8-9yrs) Wk 7',
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    days: WEEKDAYS,
    cost: 140,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583255?onlineSiteId=0&from_original_cui=true',
  },
  // Wk 8 (Aug 17-21): display #586178 → URL ID 583256, $140, 5-day
  {
    ...BASE,
    id: 'COV-583256',
    name: 'Supershine Summer Day Camp (8-9yrs) Wk 8',
    startDate: '2026-08-17',
    endDate: '2026-08-21',
    days: WEEKDAYS,
    cost: 140,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583256?onlineSiteId=0&from_original_cui=true',
  },
  // Pro-D Day Camp (April 20, 2026): display #586308 → URL ID 583386
  {
    id: 'COV-583386',
    name: 'Pro-D Day Camp - April 20, 2026',
    provider: 'City of Vancouver - Strathcona Community Centre',
    category: 'Multi-Activity',
    campType: 'Spring Camp',
    season: 'Spring 2026',
    indoorOutdoor: 'Indoor',
    neighbourhood: 'Strathcona',
    address: '601 Keefer St, Vancouver, BC V6A 3V8',
    lat: 49.279,
    lng: -123.0895,
    city: 'Vancouver',
    confirmed2026: true,
    priceVerified: true,
    ageMin: 5,
    ageMax: 12,
    startDate: '2026-04-20',
    endDate: '2026-04-20',
    days: 'Mon',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    cost: 25,
    scheduleType: 'Full Day',
    dayLength: 'Full Day',
    durationPerDay: 6,
    activityType: 'Day Camp',
    enrollmentStatus: 'Full/Waitlist',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583386?onlineSiteId=0&from_original_cui=true',
    description: 'Single-day recreation-based day camp on BC Professional Development Day. Activities include arts & crafts, sports, and games. Children should bring a lunch, water, and snacks.',
    tags: ['multi-activity', 'day camp'],
  },
];

// Check for duplicates
let added = 0;
for (const prog of NEW_PROGRAMS) {
  const dupById = programs.find(p => String(p.id) === String(prog.id));
  const dupByUrl = prog.registrationUrl && programs.find(p => p.registrationUrl === prog.registrationUrl);
  if (dupById || dupByUrl) {
    console.log('SKIP (already in DB):', prog.id, prog.name);
    continue;
  }
  programs.push(prog);
  console.log('ADD:', prog.id, prog.name, prog.startDate, '$' + prog.cost);
  added++;
}

fs.writeFileSync(DATA_FILE, JSON.stringify(programs, null, 2));
console.log('\nAdded:', added, '| Total programs:', programs.length);
