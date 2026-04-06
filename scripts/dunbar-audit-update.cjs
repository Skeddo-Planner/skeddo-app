#!/usr/bin/env node
// dunbar-audit-update.cjs
// Adds 23 missing programs to City of Vancouver - Dunbar Community Centre (center_id=50):
//   - Kids Tennis 8-10 yrs: Wk 6-8 (Aug 10, 17, 24) — 3 programs
//   - Kids Tennis 11-14 yrs: Wk 1-8 (full summer) — 8 programs
//   - Creative Cooks Camp: Jul 13-17, Aug 17-21 — 2 programs
//   - Design and Build Camp: Aug 17-21 — 1 program
//   - Byte Camp Claymation: Aug 17-21 — 1 program
//   - WIZE Technology Camps: 4 programs
//   - Maevann Art Summer Camps: 3 programs (Jul 6-10, Jul 13-17, Jul 27-31)
//   - Maevann Art Lessons Summer Break: Aug 11-13 — 1 program
// All fees verified via ActiveNet fee modal (browser navigation, center_id=50).
// Dual-ID formula confirmed: display - 2922 = URL ID

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

const TENNIS_BASE = {
  provider: 'City of Vancouver - Dunbar Cmty Centre',
  category: 'Multi-Activity',
  campType: 'Summer Camp',
  activityType: 'Day Camp',
  indoorOutdoor: 'Both',
  neighbourhood: 'Dunbar-Southlands',
  address: '4747 Dunbar Street, Vancouver, BC',
  lat: 49.2620904,
  lng: -123.183886,
  city: 'Vancouver',
  season: 'Summer 2026',
  confirmed2026: true,
  priceVerified: true,
  registrationDate: '2026-04-08',
  registrationDateLabel: 'Apr 8 at 7:00 PM',
  startTime: '8:45 AM',
  endTime: '4:15 PM',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 7.5,
  enrollmentStatus: 'Open',
  description: 'Unleash your child\'s potential this summer with the Game Set Match Full-Day Camp at Dunbar Community Centre! Designed for kids aged 4–15, our full-day camp combines professional tennis instruction, creative arts and crafts, and exciting team sports for a balanced and enriching experience. Two daily tennis lessons tailored to age and skill levels, using Tennis Canada\'s Learn to Play curriculum and guided by certified instructors.',
  tags: ['camp'],
};

const WEEKDAYS = 'Mon, Tue, Wed, Thu, Fri';
const BC_WEEK_DAYS = 'Tue, Wed, Thu, Fri'; // Aug 4-7 (BC Day Mon off)

const WIZE_BASE = {
  provider: 'City of Vancouver - Dunbar Cmty Centre',
  category: 'STEM',
  campType: 'Summer Camp',
  activityType: 'Coding & Robotics',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Dunbar-Southlands',
  address: '4747 Dunbar St, Vancouver, BC V6S 2H2',
  lat: 49.2620904,
  lng: -123.183886,
  city: 'Vancouver',
  season: 'Summer 2026',
  confirmed2026: true,
  priceVerified: true,
  registrationDate: '2026-04-08',
  registrationDateLabel: 'Apr 8 at 7:00 PM',
  endTime: '12:00 PM',
  days: WEEKDAYS,
  scheduleType: 'Half Day (AM)',
  dayLength: 'Half Day',
  enrollmentStatus: 'Open',
  tags: ['stem', 'coding-robotics'],
  ageMin: 8,
  ageMax: 12,
  cost: 300,
};

const MAEVANN_CAMP_BASE = {
  provider: 'City of Vancouver - Dunbar Cmty Centre',
  category: 'Arts',
  campType: 'Summer Camp',
  activityType: 'Visual Arts',
  indoorOutdoor: 'Both',
  neighbourhood: 'Dunbar-Southlands',
  address: '4747 Dunbar Street, Vancouver, BC',
  lat: 49.2620904,
  lng: -123.183886,
  city: 'Vancouver',
  season: 'Summer 2026',
  confirmed2026: true,
  priceVerified: true,
  registrationDate: '2026-04-08',
  registrationDateLabel: 'Apr 8 at 7:00 PM',
  startTime: '9:30 AM',
  endTime: '3:00 PM',
  days: WEEKDAYS,
  scheduleType: 'Half Day (AM)',
  dayLength: 'Half Day',
  durationPerDay: 5.5,
  enrollmentStatus: 'Open',
  ageMin: 5,
  ageMax: 10,
  cost: 70,
  tags: ['creative', 'camp'],
  description: 'Art exploration using a variety of art materials including painting, printmaking techniques, mixed media and 3D elements. Each week will include an art history and appreciation element. On completion of works, students will display and discuss their work among their peers. These week long camps allow students to dive into their art making skills and creativity.',
};

const NEW_PROGRAMS = [

  // ── Tennis 8-10 yrs: Missing Wk 6-8 (Wk 5 = BC Day week already in DB as COV-602632) ─
  // Wk 6: Aug 10-14 → URL ID 602634 (display 605556)
  {
    ...TENNIS_BASE,
    id: 'COV-602634',
    name: 'Kids Tennis Game Set Match Full-Day Camp (8-10 yrs) Wk 6',
    ageMin: 8,
    ageMax: 10,
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    days: WEEKDAYS,
    cost: 399,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602634',
  },
  // Wk 7: Aug 17-21 → URL ID 602635 (display 605557)
  {
    ...TENNIS_BASE,
    id: 'COV-602635',
    name: 'Kids Tennis Game Set Match Full-Day Camp (8-10 yrs) Wk 7',
    ageMin: 8,
    ageMax: 10,
    startDate: '2026-08-17',
    endDate: '2026-08-21',
    days: WEEKDAYS,
    cost: 399,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602635',
  },
  // Wk 8: Aug 24-28 → URL ID 602637 (display 605559; 602636 was deleted)
  {
    ...TENNIS_BASE,
    id: 'COV-602637',
    name: 'Kids Tennis Game Set Match Full-Day Camp (8-10 yrs) Wk 8',
    ageMin: 8,
    ageMax: 10,
    startDate: '2026-08-24',
    endDate: '2026-08-28',
    days: WEEKDAYS,
    cost: 399,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602637',
  },

  // ── Tennis 11-14 yrs: Full summer (entirely missing from DB) ─────────────
  // Wk 1: Jul 6-10 → URL ID 602643
  {
    ...TENNIS_BASE,
    id: 'COV-602643',
    name: 'Kids Tennis Game Set Match Full-Day Camp (11-14 yrs) Wk 1',
    ageMin: 11,
    ageMax: 14,
    startDate: '2026-07-06',
    endDate: '2026-07-10',
    days: WEEKDAYS,
    cost: 399,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602643',
  },
  // Wk 2: Jul 13-17 → URL ID 602644
  {
    ...TENNIS_BASE,
    id: 'COV-602644',
    name: 'Kids Tennis Game Set Match Full-Day Camp (11-14 yrs) Wk 2',
    ageMin: 11,
    ageMax: 14,
    startDate: '2026-07-13',
    endDate: '2026-07-17',
    days: WEEKDAYS,
    cost: 399,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602644',
  },
  // Wk 3: Jul 20-24 → URL ID 602645
  {
    ...TENNIS_BASE,
    id: 'COV-602645',
    name: 'Kids Tennis Game Set Match Full-Day Camp (11-14 yrs) Wk 3',
    ageMin: 11,
    ageMax: 14,
    startDate: '2026-07-20',
    endDate: '2026-07-24',
    days: WEEKDAYS,
    cost: 399,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602645',
  },
  // Wk 4: Jul 27-31 → URL ID 602646
  {
    ...TENNIS_BASE,
    id: 'COV-602646',
    name: 'Kids Tennis Game Set Match Full-Day Camp (11-14 yrs) Wk 4',
    ageMin: 11,
    ageMax: 14,
    startDate: '2026-07-27',
    endDate: '2026-07-31',
    days: WEEKDAYS,
    cost: 399,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602646',
  },
  // BC Day week: Aug 4-7 (Mon off) → URL ID 602647, $322, Tue-Fri
  {
    ...TENNIS_BASE,
    id: 'COV-602647',
    name: 'Kids Tennis Game Set Match Full-Day Camp (11-14 yrs) Wk 5',
    ageMin: 11,
    ageMax: 14,
    startDate: '2026-08-04',
    endDate: '2026-08-07',
    days: BC_WEEK_DAYS,
    cost: 322,
    costNote: '4-day week (BC Day Monday off)',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602647',
  },
  // Wk 6: Aug 10-14 → URL ID 602648
  {
    ...TENNIS_BASE,
    id: 'COV-602648',
    name: 'Kids Tennis Game Set Match Full-Day Camp (11-14 yrs) Wk 6',
    ageMin: 11,
    ageMax: 14,
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    days: WEEKDAYS,
    cost: 399,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602648',
  },
  // Wk 7: Aug 17-21 → URL ID 602649
  {
    ...TENNIS_BASE,
    id: 'COV-602649',
    name: 'Kids Tennis Game Set Match Full-Day Camp (11-14 yrs) Wk 7',
    ageMin: 11,
    ageMax: 14,
    startDate: '2026-08-17',
    endDate: '2026-08-21',
    days: WEEKDAYS,
    cost: 399,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602649',
  },
  // Wk 8: Aug 24-28 → URL ID 602650
  {
    ...TENNIS_BASE,
    id: 'COV-602650',
    name: 'Kids Tennis Game Set Match Full-Day Camp (11-14 yrs) Wk 8',
    ageMin: 11,
    ageMax: 14,
    startDate: '2026-08-24',
    endDate: '2026-08-28',
    days: WEEKDAYS,
    cost: 399,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602650',
  },

  // ── Creative Cooks Camp ───────────────────────────────────────────────────
  // Jul 13-17 → URL ID 601214
  {
    id: 'COV-601214',
    name: 'Creative Cooks Camp (7-12 yrs)',
    provider: 'City of Vancouver - Dunbar Cmty Centre',
    category: 'Arts',
    campType: 'Summer Camp',
    activityType: 'Culinary',
    indoorOutdoor: 'Indoor',
    neighbourhood: 'Dunbar-Southlands',
    address: '4747 Dunbar Street, Vancouver, BC',
    lat: 49.2620904,
    lng: -123.183886,
    city: 'Vancouver',
    season: 'Summer 2026',
    confirmed2026: true,
    priceVerified: true,
    registrationDate: '2026-04-08',
    registrationDateLabel: 'Apr 8 at 7:00 PM',
    ageMin: 7,
    ageMax: 12,
    startDate: '2026-07-13',
    endDate: '2026-07-17',
    days: WEEKDAYS,
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    cost: 160,
    scheduleType: 'Half Day (PM)',
    dayLength: 'Half Day',
    durationPerDay: 2,
    enrollmentStatus: 'Open',
    tags: ['creative', 'camp'],
    description: 'Creative Cooks Camp at Dunbar Community Centre. Children will explore cooking and food arts in a fun, hands-on setting.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/601214',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  },
  // Aug 17-21 → URL ID 601219
  {
    id: 'COV-601219',
    name: 'Creative Cooks Camp (7-12 yrs)',
    provider: 'City of Vancouver - Dunbar Cmty Centre',
    category: 'Arts',
    campType: 'Summer Camp',
    activityType: 'Culinary',
    indoorOutdoor: 'Indoor',
    neighbourhood: 'Dunbar-Southlands',
    address: '4747 Dunbar Street, Vancouver, BC',
    lat: 49.2620904,
    lng: -123.183886,
    city: 'Vancouver',
    season: 'Summer 2026',
    confirmed2026: true,
    priceVerified: true,
    registrationDate: '2026-04-08',
    registrationDateLabel: 'Apr 8 at 7:00 PM',
    ageMin: 7,
    ageMax: 12,
    startDate: '2026-08-17',
    endDate: '2026-08-21',
    days: WEEKDAYS,
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    cost: 160,
    scheduleType: 'Half Day (PM)',
    dayLength: 'Half Day',
    durationPerDay: 2,
    enrollmentStatus: 'Open',
    tags: ['creative', 'camp'],
    description: 'Creative Cooks Camp at Dunbar Community Centre. Children will explore cooking and food arts in a fun, hands-on setting.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/601219',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  },

  // ── Design and Build Camp ─────────────────────────────────────────────────
  // Aug 17-21 → URL ID 601220
  {
    id: 'COV-601220',
    name: 'Design and Build Camp (3-5 yrs)',
    provider: 'City of Vancouver - Dunbar Cmty Centre',
    category: 'STEM',
    campType: 'Summer Camp',
    activityType: 'STEM',
    indoorOutdoor: 'Indoor',
    neighbourhood: 'Dunbar-Southlands',
    address: '4747 Dunbar Street, Vancouver, BC',
    lat: 49.2620904,
    lng: -123.183886,
    city: 'Vancouver',
    season: 'Summer 2026',
    confirmed2026: true,
    priceVerified: true,
    registrationDate: '2026-04-08',
    registrationDateLabel: 'Apr 8 at 7:00 PM',
    ageMin: 3,
    ageMax: 5,
    startDate: '2026-08-17',
    endDate: '2026-08-21',
    days: WEEKDAYS,
    startTime: '12:30 PM',
    endTime: '1:45 PM',
    cost: 125,
    scheduleType: 'Half Day (PM)',
    dayLength: 'Half Day',
    durationPerDay: 1.25,
    enrollmentStatus: 'Open',
    tags: ['stem', 'preschool', 'camp'],
    description: 'Design and Build Camp for preschoolers (3-5 yrs) at Dunbar Community Centre. Little engineers will explore building, design, and construction through hands-on activities.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/601220',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  },

  // ── Byte Camp Claymation ──────────────────────────────────────────────────
  // Aug 17-21 → URL ID 602074
  {
    id: 'COV-602074',
    name: 'Byte Camp - Claymation',
    provider: 'City of Vancouver - Dunbar Cmty Centre',
    category: 'STEM',
    campType: 'Summer Camp',
    activityType: 'Coding & Robotics',
    indoorOutdoor: 'Indoor',
    neighbourhood: 'Dunbar-Southlands',
    address: '4747 Dunbar Street, Vancouver, BC',
    lat: 49.2620904,
    lng: -123.183886,
    city: 'Vancouver',
    season: 'Summer 2026',
    confirmed2026: true,
    priceVerified: true,
    registrationDate: '2026-04-08',
    registrationDateLabel: 'Apr 8 at 7:00 PM',
    ageMin: 9,
    ageMax: 12,
    startDate: '2026-08-17',
    endDate: '2026-08-21',
    days: WEEKDAYS,
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    cost: 410,
    scheduleType: 'Full Day',
    dayLength: 'Full Day',
    durationPerDay: 7,
    enrollmentStatus: 'Open',
    tags: ['stem', 'coding-robotics', 'camp'],
    description: 'Byte Camp Claymation at Dunbar Community Centre. Students will learn stop-motion animation techniques using clay, creating characters and scenes, and combining digital media skills with hands-on art.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602074',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  },

  // ── WIZE Technology Camps ─────────────────────────────────────────────────
  // 3D Modelling and Printing — Jul 13-17 → URL ID 609619
  {
    ...WIZE_BASE,
    id: 'COV-609619',
    name: 'WIZE - 3D Modelling and Printing',
    startDate: '2026-07-13',
    endDate: '2026-07-17',
    startTime: '9:00 AM',
    description: 'WIZE 3D Modelling and Printing camp at Dunbar Community Centre. Students explore 3D design software and 3D printing technology, creating their own designs and seeing them come to life.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/609619',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  },
  // 3D Modelling and Printing — Aug 24-28 → URL ID 609620
  {
    ...WIZE_BASE,
    id: 'COV-609620',
    name: 'WIZE - 3D Modelling and Printing',
    startDate: '2026-08-24',
    endDate: '2026-08-28',
    startTime: '9:00 AM',
    description: 'WIZE 3D Modelling and Printing camp at Dunbar Community Centre. Students explore 3D design software and 3D printing technology, creating their own designs and seeing them come to life.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/609620',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  },
  // Coding and Modding in Minecraft — Jul 27-31 → URL ID 609621
  {
    ...WIZE_BASE,
    id: 'COV-609621',
    name: 'WIZE - Coding and Modding in Minecraft',
    startDate: '2026-07-27',
    endDate: '2026-07-31',
    startTime: '9:00 AM',
    description: 'WIZE Coding and Modding in Minecraft camp at Dunbar Community Centre. Students learn coding fundamentals through Minecraft modding, creating their own game modifications using block-based and text-based programming.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/609621',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  },
  // Animation, Games & Storytelling in Scratch Jr — Aug 17-21 (PM) → URL ID 609624
  {
    ...WIZE_BASE,
    id: 'COV-609624',
    name: 'WIZE - Animation, Games & Storytelling in Scratch Jr',
    startDate: '2026-08-17',
    endDate: '2026-08-21',
    startTime: '1:00 PM',
    endTime: '4:00 PM',
    scheduleType: 'Half Day (PM)',
    description: 'WIZE Animation, Games & Storytelling in Scratch Jr camp at Dunbar Community Centre. Students create their own animated stories, interactive games, and digital projects using Scratch Jr programming.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/609624',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  },

  // ── Maevann Art Summer Camps ──────────────────────────────────────────────
  // Jul 6-10 → URL ID 609530
  {
    ...MAEVANN_CAMP_BASE,
    id: 'COV-609530',
    name: 'Maevann Art Summer Camp (5-10 yrs)',
    startDate: '2026-07-06',
    endDate: '2026-07-10',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/609530',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  },
  // Jul 13-17 → URL ID 609564
  {
    ...MAEVANN_CAMP_BASE,
    id: 'COV-609564',
    name: 'Maevann Art Summer Camp (5-10 yrs)',
    startDate: '2026-07-13',
    endDate: '2026-07-17',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/609564',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  },
  // Jul 27-31 → URL ID 609566
  {
    ...MAEVANN_CAMP_BASE,
    id: 'COV-609566',
    name: 'Maevann Art Summer Camp (5-10 yrs)',
    startDate: '2026-07-27',
    endDate: '2026-07-31',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/609566',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  },

  // ── Maevann Art Lessons Summer Break ─────────────────────────────────────
  // Aug 11-13 (Tue-Thu only) → URL ID 610197
  {
    id: 'COV-610197',
    name: 'Maevann Art Lessons Summer Break (3-5 yrs)',
    provider: 'City of Vancouver - Dunbar Cmty Centre',
    category: 'Arts',
    campType: 'Summer Camp',
    activityType: 'Visual Arts',
    indoorOutdoor: 'Both',
    neighbourhood: 'Dunbar-Southlands',
    address: '4747 Dunbar Street, Vancouver, BC',
    lat: 49.2620904,
    lng: -123.183886,
    city: 'Vancouver',
    season: 'Summer 2026',
    confirmed2026: true,
    priceVerified: true,
    registrationDate: '2026-04-08',
    registrationDateLabel: 'Apr 8 at 7:00 PM',
    ageMin: 3,
    ageMax: 5,
    startDate: '2026-08-11',
    endDate: '2026-08-13',
    days: 'Tue, Wed, Thu',
    startTime: '9:30 AM',
    endTime: '10:45 AM',
    cost: 25,
    scheduleType: 'Activity',
    dayLength: 'Half Day',
    durationPerDay: 1.25,
    enrollmentStatus: 'Open',
    tags: ['creative', 'preschool'],
    description: 'Maevann Art Lessons Summer Break for preschoolers (3-5 yrs) at Dunbar Community Centre. A short 3-day art session during summer break exploring creative art materials and process-based art activities.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610197',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  },
];

// Check for duplicates and add
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
