#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let fixCount = 0;
let addCount = 0;

// ── 1. STATUS FIX ─────────────────────────────────────────────────────────────
for (const prog of programs) {
  if (prog.id === 'thunderbird-cc-1' && prog.enrollmentStatus === 'Open' && prog.registrationDate === '2026-04-08') {
    prog.enrollmentStatus = 'Coming Soon';
    fixCount++;
    console.log(`Fixed: ${prog.id} (${prog.name}) → Coming Soon`);
  }
}

// ── BASE OBJECTS ──────────────────────────────────────────────────────────────
const TCC = {
  provider: 'City of Vancouver - Thunderbird Community Centre',
  address: '2311 Cassiar St, Vancouver, BC V5M 3Y1',
  neighbourhood: 'Hastings-Sunrise',
  lat: 49.262,
  lng: -123.0347,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: true,
  urlVerified: true,
  indoorOutdoor: 'Indoor',
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
};

const SUMMER_CAMP = {
  ...TCC,
  season: 'Summer 2026',
  campType: 'Summer Camp',
  activityType: 'Day Camp',
  category: 'Multi-Activity',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  registrationDate: '2026-04-08',
  enrollmentStatus: 'Coming Soon',
  days: 'Mon,Tue,Wed,Thu,Fri',
  startTime: '9:00 AM',
  endTime: '3:30 PM',
  durationPerDay: 6.5,
  tags: ['multi-activity', 'day camp'],
};

const AFTER_CARE = {
  ...TCC,
  season: 'Summer 2026',
  campType: 'Summer Camp',
  activityType: 'Day Camp',
  category: 'Multi-Activity',
  scheduleType: 'Activity',
  registrationDate: '2026-04-08',
  enrollmentStatus: 'Coming Soon',
  ageMin: 6,
  ageMax: 12,
  startTime: '3:30 PM',
  endTime: '5:30 PM',
  durationPerDay: 2.0,
  description: 'After care for campers enrolled in Thunderbird CC\'s Sunrays, Sunseekers, and Youth Summer Day Camps. A great program to unwind from camp. Please pack an additional snack. Parents/Guardian must pick up before 5:30 PM from the Games Room.',
  tags: ['after care', 'day camp', 'summer'],
};

// ── NEW PROGRAMS ──────────────────────────────────────────────────────────────
const newPrograms = [

  // ── SUNSEEKERS DAY CAMP 8-10 YRS — WEEKS 2–8 ─────────────────────────────
  // Week 1 (id=1838) already in DB
  {
    id: 'COV-597896',
    name: 'Sunseekers Day Camp - 8-10 yrs - Week 2',
    ...SUMMER_CAMP,
    ageMin: 8, ageMax: 10,
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon,Tue,Wed,Thu,Fri',
    cost: 145,
    costNote: '$145.00 for 5 sessions (Mon–Fri). After Care available separately. 50% Leisure Access discount available.',
    description: 'Sunseekers Day Camp for experienced campers ages 8–10. Activities include local outings, bigger out-trips, arts & crafts, games, cooking, and sports. After Care available for an additional fee.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/597896',
  },
  {
    id: 'COV-597897',
    name: 'Sunseekers Day Camp - 8-10 yrs - Week 3',
    ...SUMMER_CAMP,
    ageMin: 8, ageMax: 10,
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon,Tue,Wed,Thu,Fri',
    cost: 145,
    costNote: '$145.00 for 5 sessions (Mon–Fri). After Care available separately. 50% Leisure Access discount available.',
    description: 'Sunseekers Day Camp for experienced campers ages 8–10. Activities include local outings, bigger out-trips, arts & crafts, games, cooking, and sports. After Care available for an additional fee.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/597897',
  },
  {
    id: 'COV-597898',
    name: 'Sunseekers Day Camp - 8-10 yrs - Week 4',
    ...SUMMER_CAMP,
    ageMin: 8, ageMax: 10,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon,Tue,Wed,Thu,Fri',
    cost: 145,
    costNote: '$145.00 for 5 sessions (Mon–Fri). After Care available separately. 50% Leisure Access discount available.',
    description: 'Sunseekers Day Camp for experienced campers ages 8–10. Activities include local outings, bigger out-trips, arts & crafts, games, cooking, and sports. After Care available for an additional fee.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/597898',
  },
  {
    id: 'COV-597899',
    name: 'Sunseekers Day Camp - 8-10 yrs - Week 5',
    ...SUMMER_CAMP,
    ageMin: 8, ageMax: 10,
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon,Tue,Wed,Thu,Fri',
    cost: 145,
    costNote: '$145.00 for 5 sessions (Mon–Fri). After Care available separately. 50% Leisure Access discount available.',
    description: 'Sunseekers Day Camp for experienced campers ages 8–10. Activities include local outings, bigger out-trips, arts & crafts, games, cooking, and sports. After Care available for an additional fee.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/597899',
  },
  {
    id: 'COV-597900',
    name: 'Sunseekers Day Camp - 8-10 yrs - Week 6',
    ...SUMMER_CAMP,
    ageMin: 8, ageMax: 10,
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue,Wed,Thu,Fri',
    cost: 116,
    costNote: '$116.00 for 4 sessions (Tue–Fri; BC Day Aug 3 holiday, no class Mon). After Care available separately. 50% Leisure Access discount available.',
    description: 'Sunseekers Day Camp for experienced campers ages 8–10. Activities include local outings, bigger out-trips, arts & crafts, games, cooking, and sports. After Care available for an additional fee.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/597900',
  },
  {
    id: 'COV-597901',
    name: 'Sunseekers Day Camp - 8-10 yrs - Week 7',
    ...SUMMER_CAMP,
    ageMin: 8, ageMax: 10,
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon,Tue,Wed,Thu,Fri',
    cost: 145,
    costNote: '$145.00 for 5 sessions (Mon–Fri). After Care available separately. 50% Leisure Access discount available.',
    description: 'Sunseekers Day Camp for experienced campers ages 8–10. Activities include local outings, bigger out-trips, arts & crafts, games, cooking, and sports. After Care available for an additional fee.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/597901',
  },
  {
    id: 'COV-597902',
    name: 'Sunseekers Day Camp - 8-10 yrs - Week 8',
    ...SUMMER_CAMP,
    ageMin: 8, ageMax: 10,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon,Tue,Wed,Thu,Fri',
    cost: 145,
    costNote: '$145.00 for 5 sessions (Mon–Fri). After Care available separately. 50% Leisure Access discount available.',
    description: 'Sunseekers Day Camp for experienced campers ages 8–10. Activities include local outings, bigger out-trips, arts & crafts, games, cooking, and sports. After Care available for an additional fee.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/597902',
  },

  // ── CAMP AFTER CARE 6-12 YRS — WEEKS 1–8 ─────────────────────────────────
  {
    id: 'COV-599048',
    name: 'Camp After Care - 6-12 yrs - Week 1',
    ...AFTER_CARE,
    startDate: '2026-06-29', endDate: '2026-07-03',
    days: 'Mon,Tue,Thu,Fri',
    cost: 29,
    costNote: '$29.00 for 4 sessions (Mon,Tue,Thu,Fri; no class Jul 1 Canada Day). Must be registered in Sunrays, Sunseekers, or Youth Summer Day Camp. 50% Leisure Access discount available.',
    durationPerDay: 2.0,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/599048',
  },
  {
    id: 'COV-599049',
    name: 'Camp After Care - 6-12 yrs - Week 2',
    ...AFTER_CARE,
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon,Tue,Wed,Thu,Fri',
    cost: 36,
    costNote: '$36.00 for 5 sessions (Mon–Fri). Must be registered in Sunrays, Sunseekers, or Youth Summer Day Camp. 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/599049',
  },
  {
    id: 'COV-599050',
    name: 'Camp After Care - 6-12 yrs - Week 3',
    ...AFTER_CARE,
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon,Tue,Wed,Thu,Fri',
    cost: 36,
    costNote: '$36.00 for 5 sessions (Mon–Fri). Must be registered in Sunrays, Sunseekers, or Youth Summer Day Camp. 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/599050',
  },
  {
    id: 'COV-599051',
    name: 'Camp After Care - 6-12 yrs - Week 4',
    ...AFTER_CARE,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon,Tue,Wed,Thu,Fri',
    cost: 36,
    costNote: '$36.00 for 5 sessions (Mon–Fri). Must be registered in Sunrays, Sunseekers, or Youth Summer Day Camp. 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/599051',
  },
  {
    id: 'COV-599052',
    name: 'Camp After Care - 6-12 yrs - Week 5',
    ...AFTER_CARE,
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon,Tue,Wed,Thu,Fri',
    cost: 36,
    costNote: '$36.00 for 5 sessions (Mon–Fri). Must be registered in Sunrays, Sunseekers, or Youth Summer Day Camp. 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/599052',
  },
  {
    id: 'COV-599053',
    name: 'Camp After Care - 6-12 yrs - Week 6',
    ...AFTER_CARE,
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue,Wed,Thu,Fri',
    cost: 29,
    costNote: '$29.00 for 4 sessions (Tue–Fri; BC Day Aug 3 holiday, no class Mon). Must be registered in Sunrays, Sunseekers, or Youth Summer Day Camp. 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/599053',
  },
  {
    id: 'COV-599054',
    name: 'Camp After Care - 6-12 yrs - Week 7',
    ...AFTER_CARE,
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon,Tue,Wed,Thu,Fri',
    cost: 36,
    costNote: '$36.00 for 5 sessions (Mon–Fri). Must be registered in Sunrays, Sunseekers, or Youth Summer Day Camp. 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/599054',
  },
  {
    id: 'COV-599055',
    name: 'Camp After Care - 6-12 yrs - Week 8',
    ...AFTER_CARE,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon,Tue,Wed,Thu,Fri',
    cost: 36,
    costNote: '$36.00 for 5 sessions (Mon–Fri). Must be registered in Sunrays, Sunseekers, or Youth Summer Day Camp. 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/599055',
  },

  // ── CARTOON WITH A DISNEY ANIMATOR — SET 2 ───────────────────────────────
  {
    id: 'COV-608919',
    name: 'Cartoon with a Disney Animator - Set 2',
    ...TCC,
    season: 'Spring 2026',
    campType: 'Spring Program',
    activityType: 'Visual Arts',
    category: 'Arts & Crafts',
    scheduleType: 'Activity',
    ageMin: 6, ageMax: 8,
    startDate: '2026-05-19', endDate: '2026-06-23',
    days: 'Tue',
    startTime: '4:40 PM', endTime: '5:40 PM',
    durationPerDay: 1.0,
    cost: 90,
    costNote: '$90.00 for 6 sessions (weekly Tue, May 19–Jun 23).',
    registrationDate: null,
    enrollmentStatus: 'Open',
    repeating: 'weekly',
    description: 'Learn to tell stories through drawings by working on character development, thumbnails, layout pages, panelling and more. Instructed by a former Disney animator from Happy Kids Studios.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608919',
    tags: ['art', 'drawing', 'cartoon', 'animation', 'kids'],
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
console.log(`\nDone. Fixed: ${fixCount}, Added: ${addCount}, Total: ${programs.length}`);
