#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let addCount = 0;

// ── SOURCE ─────────────────────────────────────────────────────────────────
// Killarney CC: center_id=35
//   Registration: https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=35
//   Verified 2026-04-06. 14 tennis camp programs found (6 Junior + 6 Youth + 2 spring ongoing)
//   Dual-ID formula: display ID − 2922 = URL ID
//   CAMP: Junior Tennis display #613251 → URL 610329 ✓ (verified at detail/610329)
//   CAMP: Youth Tennis display #613254 → URL 610332 ✓ (verified at detail/610332)
//   Courts are at Killarney Secondary School, just south of the CC (off-site)
//
// Mount Pleasant CC (Robson Park): center_id=53
//   Registration: https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=53&activity_keyword=smash+camp
//   Verified 2026-04-06. 22 Summer Smash camp programs found (8 Junior + 6 Mini + 8 Youth)
//   Dual-ID formula: display ID − 2922 = URL ID
//   Junior Fun + Aces display #611093 → URL 608171 ✓ (verified at detail/608171)
//   Youth Fun + Aces display #611108 → URL 608186 ✓ (verified at detail/608186)
//   All camps held at Robson Park tennis courts, 13th Ave & St George St, Vancouver
//   Registration opens Apr 8, 2026 at 7:00 PM. Fee behind JS modal (cost=null).

// ── BASE OBJECTS ───────────────────────────────────────────────────────────

const KILLARNEY_TENNIS = {
  provider: 'City of Vancouver - Killarney Community Centre',
  address: '6260 Killarney St, Vancouver, BC V5S 2X7',
  neighbourhood: 'Killarney',
  lat: 49.2251,
  lng: -123.0434,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: false,
  urlVerified: true,
  indoorOutdoor: 'Outdoor',
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=35&activity_keyword=tennis',
  season: 'Summer 2026',
  campType: 'Sports Camp',
  category: 'Sports',
  subcategory: 'Tennis',
  activityType: 'Day Camp',
  scheduleType: 'Half Day',
  dayLength: 'Half Day',
  durationPerDay: 3,
  registrationDate: '2026-04-08',
  enrollmentStatus: 'Coming Soon',
  cost: null,
  costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM.',
  tags: ['tennis', 'sports camp', 'summer camp', 'day camp'],
};

const ROBSON_TENNIS = {
  provider: 'City of Vancouver - Mount Pleasant Community Centre',
  address: '13th Ave & St George St, Vancouver, BC',
  neighbourhood: 'Mount Pleasant',
  lat: 49.2608,
  lng: -123.1037,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: false,
  urlVerified: true,
  indoorOutdoor: 'Outdoor',
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=53&activity_keyword=tennis',
  season: 'Summer 2026',
  campType: 'Sports Camp',
  category: 'Sports',
  subcategory: 'Tennis',
  activityType: 'Day Camp',
  scheduleType: 'Half Day',
  dayLength: 'Half Day',
  durationPerDay: 3,
  registrationDate: '2026-04-08',
  enrollmentStatus: 'Coming Soon',
  cost: null,
  costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM.',
  tags: ['tennis', 'sports camp', 'summer camp', 'day camp'],
};

const JUNIOR_TENNIS_DESC = 'Inspire and nurture a lifelong passion for tennis with Precision Tennis\' fun, inclusive, and dynamic half-day outdoor summer camp. Supervised by Tennis Canada certified professionals, our tactics-first approach gives players essential skills to start rallying, collaborating and having fun right away. Camps run outdoors Mon–Fri, weather permitting. Participants must bring their own racket. This camp takes place outdoors at the Killarney Secondary School tennis courts, just south of the community centre. Registration opens Apr 8, 2026 at 7:00 PM.';

const YOUTH_TENNIS_DESC = 'Have fun and build fundamental tennis skills with Precision Tennis\' fun, inclusive, and dynamic half-day summer camp. Tennis Canada-certified coaches provide 15 hours total of on-court and off-court programming. Our program aims to introduce the sport of tennis in an interactive way and to ensure the future success for young tennis players. Camps run outdoors Mon–Fri, weather permitting. Participants must bring their own racket. This camp takes place outdoors at the Killarney Secondary School tennis courts, just south of the community centre. Registration opens Apr 8, 2026 at 7:00 PM.';

const JUNIOR_FUN_ACES_DESC = 'Start learning tennis in a fun and supportive environment. Lessons provide young beginners with little or no experience an introduction to the game through high energy, game-based lessons. An emphasis is placed on inspiring a love for the game while building a strong technical foundation. Students are expected to bring their own racquets. Held at Robson Park tennis courts (13th Ave and St George St, Vancouver). Instructor: Summer Smash Tennis. Registration opens Apr 8, 2026 at 7:00 PM.';

const MINI_ACES_DESC = 'Summer Smash Tennis Mini Aces Camp for young beginners ages 6–7.5. Fun, high-energy tennis introduction through game-based lessons using the progressive tennis model. Held at Robson Park tennis courts (13th Ave and St George St, Vancouver). Students must bring their own racquet. Instructor: Summer Smash Tennis. Registration opens Apr 8, 2026 at 7:00 PM.';

const YOUTH_FUN_ACES_DESC = 'Start learning tennis in a fun and supportive environment. Lessons provide young beginners with little or no experience an introduction to the game through high energy, game-based lessons. An emphasis is placed inspiring a love for the game while building a strong technical foundation. Students will be split into small groups based on age and skill. Students must bring their own racquets. Held at Robson Park tennis courts (13th Ave and St George St, Vancouver). Instructor: Summer Smash Tennis. Registration opens Apr 8, 2026 at 7:00 PM.';

// ── NEW PROGRAMS ────────────────────────────────────────────────────────────

const newPrograms = [

  // ════════════════════════════════════════════════════════════════
  // KILLARNEY — CAMP: Junior Tennis (ages 6–9) — Precision Tennis
  // display IDs: #613251, 613258, 613259, 613262, 613263, 614629
  // URL IDs = display − 2922
  // ════════════════════════════════════════════════════════════════

  {
    id: 'COV-610329',
    name: 'CAMP: Junior Tennis',
    ...KILLARNEY_TENNIS,
    startDate: '2026-07-06', endDate: '2026-07-10',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 6, ageMax: 9,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610329',
    description: JUNIOR_TENNIS_DESC,
  },
  {
    id: 'COV-610336',
    name: 'CAMP: Junior Tennis',
    ...KILLARNEY_TENNIS,
    startDate: '2026-07-13', endDate: '2026-07-17',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 6, ageMax: 9,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610336',
    description: JUNIOR_TENNIS_DESC,
  },
  {
    id: 'COV-610337',
    name: 'CAMP: Junior Tennis',
    ...KILLARNEY_TENNIS,
    startDate: '2026-07-20', endDate: '2026-07-24',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 6, ageMax: 9,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610337',
    description: JUNIOR_TENNIS_DESC,
  },
  {
    id: 'COV-610340',
    name: 'CAMP: Junior Tennis',
    ...KILLARNEY_TENNIS,
    startDate: '2026-08-10', endDate: '2026-08-14',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 6, ageMax: 9,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610340',
    description: JUNIOR_TENNIS_DESC,
  },
  {
    id: 'COV-610341',
    name: 'CAMP: Junior Tennis',
    ...KILLARNEY_TENNIS,
    startDate: '2026-08-17', endDate: '2026-08-21',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 6, ageMax: 9,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610341',
    description: JUNIOR_TENNIS_DESC,
  },
  {
    id: 'COV-611707',
    name: 'CAMP: Junior Tennis',
    ...KILLARNEY_TENNIS,
    startDate: '2026-08-04', endDate: '2026-08-07',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Tue,Wed,Thu,Fri',
    ageMin: 6, ageMax: 9,
    costNote: 'Fee not displayed on registration page (requires click-through). 4-day week (BC Day Aug 3 Mon off). Registration opens Apr 8, 2026 at 7:00 PM.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/611707',
    description: JUNIOR_TENNIS_DESC + ' 4-day week (BC Day Mon off).',
  },

  // ════════════════════════════════════════════════════════════════
  // KILLARNEY — CAMP: Youth Tennis (ages 10–13) — Precision Tennis
  // display IDs: #613254, 613255, 613260, 613261, 613264, 614632
  // ════════════════════════════════════════════════════════════════

  {
    id: 'COV-610332',
    name: 'CAMP: Youth Tennis',
    ...KILLARNEY_TENNIS,
    startDate: '2026-07-06', endDate: '2026-07-10',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 10, ageMax: 13,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610332',
    description: YOUTH_TENNIS_DESC,
  },
  {
    id: 'COV-610333',
    name: 'CAMP: Youth Tennis',
    ...KILLARNEY_TENNIS,
    startDate: '2026-07-13', endDate: '2026-07-17',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 10, ageMax: 13,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610333',
    description: YOUTH_TENNIS_DESC,
  },
  {
    id: 'COV-610338',
    name: 'CAMP: Youth Tennis',
    ...KILLARNEY_TENNIS,
    startDate: '2026-07-20', endDate: '2026-07-24',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 10, ageMax: 13,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610338',
    description: YOUTH_TENNIS_DESC,
  },
  {
    id: 'COV-610339',
    name: 'CAMP: Youth Tennis',
    ...KILLARNEY_TENNIS,
    startDate: '2026-08-04', endDate: '2026-08-07',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Tue,Wed,Thu,Fri',
    ageMin: 10, ageMax: 13,
    costNote: 'Fee not displayed on registration page (requires click-through). 4-day week (BC Day Aug 3 Mon off). Registration opens Apr 8, 2026 at 7:00 PM.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610339',
    description: YOUTH_TENNIS_DESC + ' 4-day week (BC Day Mon off).',
  },
  {
    id: 'COV-610342',
    name: 'CAMP: Youth Tennis',
    ...KILLARNEY_TENNIS,
    startDate: '2026-08-24', endDate: '2026-08-28',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 10, ageMax: 13,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610342',
    description: YOUTH_TENNIS_DESC,
  },
  {
    id: 'COV-611710',
    name: 'CAMP: Youth Tennis',
    ...KILLARNEY_TENNIS,
    startDate: '2026-08-10', endDate: '2026-08-14',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 10, ageMax: 13,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/611710',
    description: YOUTH_TENNIS_DESC,
  },

  // ════════════════════════════════════════════════════════════════
  // ROBSON PARK (Mount Pleasant) — Junior Fun + Aces Camp (7.5-10yrs)
  // Summer Smash Tennis. display IDs: #611093–611100
  // ════════════════════════════════════════════════════════════════

  {
    id: 'COV-608171',
    name: 'Summer Smash Tennis: Junior Fun + Aces Camp (7.5-10yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-06-29', endDate: '2026-07-03',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Thu,Fri',
    ageMin: 7, ageMax: 10,
    costNote: 'Fee not displayed on registration page (requires click-through). 4-day week (Canada Day Jul 1 off). Registration opens Apr 8, 2026 at 7:00 PM.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608171',
    description: JUNIOR_FUN_ACES_DESC + ' 4-day week (Canada Day Jul 1 off).',
  },
  {
    id: 'COV-608172',
    name: 'Summer Smash Tennis: Junior Fun + Aces Camp (7.5-10yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-07-06', endDate: '2026-07-10',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 7, ageMax: 10,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608172',
    description: JUNIOR_FUN_ACES_DESC,
  },
  {
    id: 'COV-608173',
    name: 'Summer Smash Tennis: Junior Fun + Aces Camp (7.5-10yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-07-13', endDate: '2026-07-17',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 7, ageMax: 10,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608173',
    description: JUNIOR_FUN_ACES_DESC,
  },
  {
    id: 'COV-608174',
    name: 'Summer Smash Tennis: Junior Fun + Aces Camp (7.5-10yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-07-20', endDate: '2026-07-24',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 7, ageMax: 10,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608174',
    description: JUNIOR_FUN_ACES_DESC,
  },
  {
    id: 'COV-608175',
    name: 'Summer Smash Tennis: Junior Fun + Aces Camp (7.5-10yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-07-27', endDate: '2026-07-31',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 7, ageMax: 10,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608175',
    description: JUNIOR_FUN_ACES_DESC,
  },
  {
    id: 'COV-608176',
    name: 'Summer Smash Tennis: Junior Fun + Aces Camp (7.5-10yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-08-04', endDate: '2026-08-07',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Tue,Wed,Thu,Fri',
    ageMin: 7, ageMax: 10,
    costNote: 'Fee not displayed on registration page (requires click-through). 4-day week (BC Day Aug 3 Mon off). Registration opens Apr 8, 2026 at 7:00 PM.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608176',
    description: JUNIOR_FUN_ACES_DESC + ' 4-day week (BC Day Mon off).',
  },
  {
    id: 'COV-608177',
    name: 'Summer Smash Tennis: Junior Fun + Aces Camp (7.5-10yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-08-10', endDate: '2026-08-14',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 7, ageMax: 10,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608177',
    description: JUNIOR_FUN_ACES_DESC,
  },
  {
    id: 'COV-608178',
    name: 'Summer Smash Tennis: Junior Fun + Aces Camp (7.5-10yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-08-17', endDate: '2026-08-21',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 7, ageMax: 10,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608178',
    description: JUNIOR_FUN_ACES_DESC,
  },

  // ════════════════════════════════════════════════════════════════
  // ROBSON PARK — Mini Aces Camp (6-7.5yrs) — Summer Smash Tennis
  // display IDs: #611087–611092 (6 programs; Jul 13 and Aug 10 not offered)
  // ════════════════════════════════════════════════════════════════

  {
    id: 'COV-608165',
    name: 'Summer Smash Tennis: Mini Aces Camp (6-7.5yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-06-29', endDate: '2026-07-03',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Thu,Fri',
    ageMin: 6, ageMax: 7,
    costNote: 'Fee not displayed on registration page (requires click-through). 4-day week (Canada Day Jul 1 off). Registration opens Apr 8, 2026 at 7:00 PM.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608165',
    description: MINI_ACES_DESC + ' 4-day week (Canada Day Jul 1 off).',
  },
  {
    id: 'COV-608166',
    name: 'Summer Smash Tennis: Mini Aces Camp (6-7.5yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-07-06', endDate: '2026-07-10',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 6, ageMax: 7,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608166',
    description: MINI_ACES_DESC,
  },
  {
    id: 'COV-608167',
    name: 'Summer Smash Tennis: Mini Aces Camp (6-7.5yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-07-20', endDate: '2026-07-24',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 6, ageMax: 7,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608167',
    description: MINI_ACES_DESC,
  },
  {
    id: 'COV-608168',
    name: 'Summer Smash Tennis: Mini Aces Camp (6-7.5yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-07-27', endDate: '2026-07-31',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 6, ageMax: 7,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608168',
    description: MINI_ACES_DESC,
  },
  {
    id: 'COV-608169',
    name: 'Summer Smash Tennis: Mini Aces Camp (6-7.5yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-08-04', endDate: '2026-08-07',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Tue,Wed,Thu,Fri',
    ageMin: 6, ageMax: 7,
    costNote: 'Fee not displayed on registration page (requires click-through). 4-day week (BC Day Aug 3 Mon off). Registration opens Apr 8, 2026 at 7:00 PM.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608169',
    description: MINI_ACES_DESC + ' 4-day week (BC Day Mon off).',
  },
  {
    id: 'COV-608170',
    name: 'Summer Smash Tennis: Mini Aces Camp (6-7.5yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-08-17', endDate: '2026-08-21',
    startTime: '9:00 AM', endTime: '12:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 6, ageMax: 7,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608170',
    description: MINI_ACES_DESC,
  },

  // ════════════════════════════════════════════════════════════════
  // ROBSON PARK — Youth Fun + Aces Camp (11-16yrs) — Summer Smash
  // display IDs: #611102–611109 (8 programs)
  // ════════════════════════════════════════════════════════════════

  {
    id: 'COV-608180',
    name: 'Summer Smash Tennis: Youth Fun + Aces Camp (11-16yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-06-29', endDate: '2026-07-03',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Mon,Tue,Thu,Fri',
    ageMin: 11, ageMax: 16,
    costNote: 'Fee not displayed on registration page (requires click-through). 4-day week (Canada Day Jul 1 off). Registration opens Apr 8, 2026 at 7:00 PM.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608180',
    description: YOUTH_FUN_ACES_DESC + ' 4-day week (Canada Day Jul 1 off).',
  },
  {
    id: 'COV-608181',
    name: 'Summer Smash Tennis: Youth Fun + Aces Camp (11-16yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-07-06', endDate: '2026-07-10',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 11, ageMax: 16,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608181',
    description: YOUTH_FUN_ACES_DESC,
  },
  {
    id: 'COV-608182',
    name: 'Summer Smash Tennis: Youth Fun + Aces Camp (11-16yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-07-13', endDate: '2026-07-17',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 11, ageMax: 16,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608182',
    description: YOUTH_FUN_ACES_DESC,
  },
  {
    id: 'COV-608183',
    name: 'Summer Smash Tennis: Youth Fun + Aces Camp (11-16yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-07-20', endDate: '2026-07-24',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 11, ageMax: 16,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608183',
    description: YOUTH_FUN_ACES_DESC,
  },
  {
    id: 'COV-608184',
    name: 'Summer Smash Tennis: Youth Fun + Aces Camp (11-16yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-07-27', endDate: '2026-07-31',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 11, ageMax: 16,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608184',
    description: YOUTH_FUN_ACES_DESC,
  },
  {
    id: 'COV-608185',
    name: 'Summer Smash Tennis: Youth Fun + Aces Camp (11-16yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-08-04', endDate: '2026-08-07',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Tue,Wed,Thu,Fri',
    ageMin: 11, ageMax: 16,
    costNote: 'Fee not displayed on registration page (requires click-through). 4-day week (BC Day Aug 3 Mon off). Registration opens Apr 8, 2026 at 7:00 PM.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608185',
    description: YOUTH_FUN_ACES_DESC + ' 4-day week (BC Day Mon off).',
  },
  {
    id: 'COV-608186',
    name: 'Summer Smash Tennis: Youth Fun + Aces Camp (11-16yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-08-10', endDate: '2026-08-14',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 11, ageMax: 16,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608186',
    description: YOUTH_FUN_ACES_DESC,
  },
  {
    id: 'COV-608187',
    name: 'Summer Smash Tennis: Youth Fun + Aces Camp (11-16yrs)',
    ...ROBSON_TENNIS,
    startDate: '2026-08-17', endDate: '2026-08-21',
    startTime: '1:00 PM', endTime: '4:00 PM',
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 11, ageMax: 16,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608187',
    description: YOUTH_FUN_ACES_DESC,
  },
];

// ── ADD NEW PROGRAMS ─────────────────────────────────────────────────────────
const existingIds = new Set(programs.map(p => String(p.id)));
for (const prog of newPrograms) {
  if (existingIds.has(String(prog.id))) {
    console.log(`SKIP (exists): ${prog.id}`);
  } else {
    programs.push(prog);
    existingIds.add(String(prog.id));
    addCount++;
    console.log(`ADDED: ${prog.id} — ${prog.name} (${prog.startDate})`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nDone. Added: ${addCount}, Total: ${programs.length}`);
