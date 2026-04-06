#!/usr/bin/env node
// hillcrest-audit-update.cjs
// Hillcrest Rink (Swim and Skate Camp) audit — 2026-04-06
// Adds 8 missing Swim and Skate Camp programs (COV-614774 through COV-614781)
// All 8 weeks confirmed live on ActiveNet; fees verified via REST estimateprice API.
// Standard charge: $225.55 (5-day), $180.44 (4-day BC Day week Aug 4-7)

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// Display IDs: 617696-617703 → URL IDs 614774-614781 (display − 2922)
// Ages: "at least 8 yrs but less than 14 yrs" → ageMin=8, ageMax=13
// Location: Hillcrest Rink (morning skating) + Hillcrest Pool (afternoon swimming)
// Registration: Apr 8, 2026 at 7:00 PM

const DESCRIPTION = 'Each day, campers will spend the morning in the rink working on the Vancouver Park Board Learn to Skate levels and the afternoon swimming recreationally at Hillcrest pool. Campers are expected to bring their own skates and helmet. Rentals may be available on-site.';

const COMMON = {
  provider: 'City of Vancouver - Hillcrest Rink',
  category: 'Camps & Day Camps',
  campType: 'Summer Camp',
  activityType: 'Multi-Sport',
  season: 'Summer 2026',
  indoorOutdoor: 'Indoor/Outdoor',
  neighbourhood: 'South Cambie',
  address: '4575 Clancy Loranger Way, Vancouver, BC',
  lat: 49.2440658,
  lng: -123.1078052,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: true,
  registrationDate: '2026-04-08',
  registrationDateLabel: 'Apr 8 at 7:00 PM',
  ageMin: 8,
  ageMax: 13,
  startTime: '9:30 AM',
  endTime: '4:00 PM',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 6.5,
  enrollmentStatus: 'Coming Soon',
  repeating: 'weekly',
  description: DESCRIPTION,
  tags: ['skating', 'swimming', 'multi-sport'],
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
};

const NEW_PROGRAMS = [
  {
    ...COMMON,
    id: 'COV-614774',
    name: 'Swim and Skate Camp - Wk 1',
    startDate: '2026-07-06',
    endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 225.55,
    costNote: '$225.55 standard charge (5-day week); 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/614774',
  },
  {
    ...COMMON,
    id: 'COV-614775',
    name: 'Swim and Skate Camp - Wk 2',
    startDate: '2026-07-13',
    endDate: '2026-07-17',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 225.55,
    costNote: '$225.55 standard charge (5-day week); 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/614775',
  },
  {
    ...COMMON,
    id: 'COV-614776',
    name: 'Swim and Skate Camp - Wk 3',
    startDate: '2026-07-20',
    endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 225.55,
    costNote: '$225.55 standard charge (5-day week); 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/614776',
  },
  {
    ...COMMON,
    id: 'COV-614777',
    name: 'Swim and Skate Camp - Wk 4',
    startDate: '2026-07-27',
    endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 225.55,
    costNote: '$225.55 standard charge (5-day week); 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/614777',
  },
  {
    ...COMMON,
    id: 'COV-614778',
    name: 'Swim and Skate Camp - Wk 5 (BC Day)',
    startDate: '2026-08-04',
    endDate: '2026-08-07',
    days: 'Tue, Wed, Thu, Fri',
    cost: 180.44,
    costNote: '$180.44 standard charge (4-day week; BC Day Aug 3 off); 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/614778',
  },
  {
    ...COMMON,
    id: 'COV-614779',
    name: 'Swim and Skate Camp - Wk 6',
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 225.55,
    costNote: '$225.55 standard charge (5-day week); 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/614779',
  },
  {
    ...COMMON,
    id: 'COV-614780',
    name: 'Swim and Skate Camp - Wk 7',
    startDate: '2026-08-17',
    endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 225.55,
    costNote: '$225.55 standard charge (5-day week); 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/614780',
  },
  {
    ...COMMON,
    id: 'COV-614781',
    name: 'Swim and Skate Camp - Wk 8',
    startDate: '2026-08-24',
    endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 225.55,
    costNote: '$225.55 standard charge (5-day week); 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/614781',
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
  console.log('ADD:', prog.id, prog.name, prog.startDate, 'cost=' + prog.cost);
  added++;
}

fs.writeFileSync(DATA_FILE, JSON.stringify(programs, null, 2));
console.log('\nAdded:', added, '| Total programs:', programs.length);
