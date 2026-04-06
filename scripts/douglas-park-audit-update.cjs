#!/usr/bin/env node
// douglas-park-audit-update.cjs
// Adds 17 genuinely missing programs to City of Vancouver - Douglas Park Cmty Centre.
// All fees verified via ActiveNet fee modal (browser navigation).
// All details cross-checked against live registration pages.
//
// Programs added:
//   - Coerver Coaching Soccer Camp (1)
//   - EFK: Civil Engineering: Build n Bash Camp (1)
//   - EFK: Engineering Electrified: Scratch, Switches & Sound Camp (1)
//   - EFK: Mechanical Engineering: Master Machines Camp (1) - BC Day 4-day
//   - EFK: Power and Energy: Agent of Change Camp (1)
//   - High 5 Sports - Indoor Soccer/Floor Hockey Camp (3)
//   - High 5 Sports Multisport Drop-off Camp (3)
//   - WIZE - 3D Modelling and Printing (1)
//   - WIZE - Animation, Games & Storytelling in Scratch Jr (1)
//   - WIZE - AR/VR Creators Lab (1)
//   - WIZE - Coding and Modding in Minecraft (1)
//   - Young Commander Chess: Novice/Newbie I & II Camp (2 missing sessions)

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

const BASE = {
  provider: 'City of Vancouver - Douglas Park Cmty Centre',
  address: '801 W 22nd Ave, Vancouver, BC V5Z 1Z8',
  neighbourhood: 'Riley Park',
  lat: 49.2525,
  lng: -123.1202,
  city: 'Vancouver',
  season: 'Summer 2026',
  campType: 'Summer Camp',
  confirmed2026: true,
  priceVerified: true,
  registrationDate: '2026-04-08',
  registrationDateLabel: 'Apr 8 at 7:00 PM',
  enrollmentStatus: 'Open',
};

const WEEKDAYS = 'Mon, Tue, Wed, Thu, Fri';
const BC_WEEK = 'Tue, Wed, Thu, Fri'; // Aug 4-7 (BC Day Mon off)

const NEW_PROGRAMS = [
  // ─── Coerver Coaching Soccer Camp ───────────────────────────────────────────
  // Display #600929 → URL ID 598007; Aug 24-28, 9AM-Noon, ages 5-13, $225
  {
    ...BASE,
    id: 'COV-598007',
    name: 'Coerver Coaching Soccer Camp',
    category: 'Sports',
    activityType: 'Day Camp',
    indoorOutdoor: 'Outdoor',
    ageMin: 5,
    ageMax: 13,
    startDate: '2026-08-24',
    endDate: '2026-08-28',
    days: WEEKDAYS,
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    cost: 225,
    description: 'Coerver Coaching is the #1 Soccer Skills teaching method in the World. Suited for players of all skill levels, focusing on individual skills development and small group play. Registration includes a full uniform. Classes held outdoors at Douglas Park Field.',
    tags: ['soccer', 'sports', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/598007',
  },

  // ─── EFK Camps ──────────────────────────────────────────────────────────────
  // All EFK: ages 6-11, 9AM-3PM (full-day), $420 for 5-day; 9AM-Noon (half-day), $168 for 4-day BC week
  // Display #614876 → URL 611954; Jul 13-17, 9AM-3PM, $420
  {
    ...BASE,
    id: 'COV-611954',
    name: 'EFK: Power and Energy: Agent of Change Camp',
    category: 'STEM',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 6,
    ageMax: 11,
    startDate: '2026-07-13',
    endDate: '2026-07-17',
    days: WEEKDAYS,
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    cost: 420,
    description: 'Engineers investigate power and energy sources through hands-on building challenges. Campers design and build circuits, solar-powered vehicles, wind turbines, and more.',
    tags: ['STEM', 'engineering', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/611954',
  },
  // Display #614878 → URL 611956; Jul 20-24, 9AM-3PM, $420
  {
    ...BASE,
    id: 'COV-611956',
    name: 'EFK: Engineering Electrified: Scratch, Switches & Sound Camp',
    category: 'STEM',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 6,
    ageMax: 11,
    startDate: '2026-07-20',
    endDate: '2026-07-24',
    days: WEEKDAYS,
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    cost: 420,
    description: 'Campers explore electrical engineering by building circuits, experimenting with switches, and coding sounds and animations in Scratch.',
    tags: ['STEM', 'engineering', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/611956',
  },
  // Display #614883 → URL 611961; Aug 4-7 (BC Day week, Tue-Fri), 9AM-Noon, $168
  {
    ...BASE,
    id: 'COV-611961',
    name: 'EFK: Mechanical Engineering: Master Machines Camp',
    category: 'STEM',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 6,
    ageMax: 11,
    startDate: '2026-08-04',
    endDate: '2026-08-07',
    days: BC_WEEK,
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    cost: 168,
    description: 'Campers dive into mechanical engineering, building and testing machines, levers, gears, and pulleys through hands-on activities.',
    tags: ['STEM', 'engineering', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/611961',
  },
  // Display #614970 → URL 612048; Aug 17-21, 9AM-3PM, $420
  {
    ...BASE,
    id: 'COV-612048',
    name: 'EFK: Civil Engineering: Build n Bash Camp',
    category: 'STEM',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 6,
    ageMax: 11,
    startDate: '2026-08-17',
    endDate: '2026-08-21',
    days: WEEKDAYS,
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    cost: 420,
    description: 'Campers explore civil engineering through designing and testing bridges, towers, and structures — then get to bash them to test their limits!',
    tags: ['STEM', 'engineering', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/612048',
  },

  // ─── High 5 Sports – Indoor Soccer / Floor Hockey Camp ──────────────────────
  // Ages 6-8, 1PM-4PM (PM half-day)
  // Display #613269 → URL 610347; Aug 4-7 (BC Day Tue-Fri), $208
  {
    ...BASE,
    id: 'COV-610347',
    name: 'High 5 Sports - Indoor Soccer/ Floor Hockey Camp',
    category: 'Sports',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 6,
    ageMax: 8,
    startDate: '2026-08-04',
    endDate: '2026-08-07',
    days: BC_WEEK,
    startTime: '1:00 PM',
    endTime: '4:00 PM',
    cost: 208,
    description: 'Young athletes develop soccer and floor hockey skills through drills, games, and friendly competitions in a safe and supportive environment. Emphasizes coordination, teamwork, and confidence.',
    tags: ['sports', 'soccer', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610347',
  },
  // Display #613290 → URL 610368; Aug 10-14 (Mon-Fri), $260
  {
    ...BASE,
    id: 'COV-610368',
    name: 'High 5 Sports - Indoor Soccer/ Floor Hockey Camp',
    category: 'Sports',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 6,
    ageMax: 8,
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    days: WEEKDAYS,
    startTime: '1:00 PM',
    endTime: '4:00 PM',
    cost: 260,
    description: 'Young athletes develop soccer and floor hockey skills through drills, games, and friendly competitions in a safe and supportive environment. Emphasizes coordination, teamwork, and confidence.',
    tags: ['sports', 'soccer', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610368',
  },
  // Display #613291 → URL 610369; Aug 24-28 (Mon-Fri), $260
  {
    ...BASE,
    id: 'COV-610369',
    name: 'High 5 Sports - Indoor Soccer/ Floor Hockey Camp',
    category: 'Sports',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 6,
    ageMax: 8,
    startDate: '2026-08-24',
    endDate: '2026-08-28',
    days: WEEKDAYS,
    startTime: '1:00 PM',
    endTime: '4:00 PM',
    cost: 260,
    description: 'Young athletes develop soccer and floor hockey skills through drills, games, and friendly competitions in a safe and supportive environment. Emphasizes coordination, teamwork, and confidence.',
    tags: ['sports', 'soccer', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610369',
  },

  // ─── High 5 Sports Multisport Drop-off Camp ──────────────────────────────────
  // Ages 3-5, 10AM-11:15AM (drop-off program)
  // Display #613267 → URL 610345; Aug 4-7 (BC Day Tue-Fri), $100
  {
    ...BASE,
    id: 'COV-610345',
    name: 'High 5 Sports Multisport Drop-off Camp',
    category: 'Sports',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 3,
    ageMax: 5,
    startDate: '2026-08-04',
    endDate: '2026-08-07',
    days: BC_WEEK,
    startTime: '10:00 AM',
    endTime: '11:15 AM',
    cost: 100,
    description: 'Energetic multisport drop-off program for young children. Introduces a variety of sports and movement activities in a fun and safe environment.',
    tags: ['sports', 'preschool', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610345',
  },
  // Display #613286 → URL 610364; Aug 10-14 (Mon-Fri), $125
  {
    ...BASE,
    id: 'COV-610364',
    name: 'High 5 Sports Multisport Drop-off Camp',
    category: 'Sports',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 3,
    ageMax: 5,
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    days: WEEKDAYS,
    startTime: '10:00 AM',
    endTime: '11:15 AM',
    cost: 125,
    description: 'Energetic multisport drop-off program for young children. Introduces a variety of sports and movement activities in a fun and safe environment.',
    tags: ['sports', 'preschool', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610364',
  },
  // Display #613289 → URL 610367; Aug 24-28 (Mon-Fri), $125
  {
    ...BASE,
    id: 'COV-610367',
    name: 'High 5 Sports Multisport Drop-off Camp',
    category: 'Sports',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 3,
    ageMax: 5,
    startDate: '2026-08-24',
    endDate: '2026-08-28',
    days: WEEKDAYS,
    startTime: '10:00 AM',
    endTime: '11:15 AM',
    cost: 125,
    description: 'Energetic multisport drop-off program for young children. Introduces a variety of sports and movement activities in a fun and safe environment.',
    tags: ['sports', 'preschool', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610367',
  },

  // ─── WIZE Camps ─────────────────────────────────────────────────────────────
  // All $300 for 5-day half-day sessions
  // Display #611277 → URL 608355; Jul 6-10, 9AM-Noon, ages 8-11
  {
    ...BASE,
    id: 'COV-608355',
    name: 'WIZE - 3D Modelling and Printing',
    category: 'Technology',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 8,
    ageMax: 11,
    startDate: '2026-07-06',
    endDate: '2026-07-10',
    days: WEEKDAYS,
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    cost: 300,
    description: 'Learn the art of 3D designing by creating cool designs and printing them. Take home your design as a memoir of this summer camp. Participants need to bring a Windows PC, MacBook, or Chromebook; a 3-button mouse with scroll wheel is recommended.',
    tags: ['technology', 'coding', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608355',
  },
  // Display #610785 → URL 607863; Aug 10-14, 9AM-Noon, ages 8-11
  {
    ...BASE,
    id: 'COV-607863',
    name: 'WIZE - AR/VR Creators Lab',
    category: 'Technology',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 8,
    ageMax: 11,
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    days: WEEKDAYS,
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    cost: 300,
    description: 'Campers explore augmented and virtual reality creation, building immersive experiences using AR/VR tools and software.',
    tags: ['technology', 'coding', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607863',
  },
  // Display #610786 → URL 607864; Aug 10-14, 1PM-4PM, ages 6-7
  {
    ...BASE,
    id: 'COV-607864',
    name: 'WIZE - Animation, Games & Storytelling in Scratch Jr',
    category: 'Technology',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 6,
    ageMax: 7,
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    days: WEEKDAYS,
    startTime: '1:00 PM',
    endTime: '4:00 PM',
    cost: 300,
    description: 'Young campers use Scratch Jr to create animations, games, and interactive stories through an age-appropriate introduction to coding and digital storytelling.',
    tags: ['technology', 'coding', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607864',
  },
  // Display #610836 → URL 607914; Aug 24-28, 9AM-Noon, ages 8-11
  {
    ...BASE,
    id: 'COV-607914',
    name: 'WIZE - Coding and Modding in Minecraft',
    category: 'Technology',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 8,
    ageMax: 11,
    startDate: '2026-08-24',
    endDate: '2026-08-28',
    days: WEEKDAYS,
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    cost: 300,
    description: 'Campers learn coding fundamentals and game design by creating mods and custom worlds in Minecraft using block-based and text-based coding.',
    tags: ['technology', 'coding', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607914',
  },

  // ─── Young Commander Chess: missing second-slot sessions ────────────────────
  // Display #603304 → URL 600382; Jul 6-10, 2:20-3:30 PM, ages 5-9, $75
  {
    ...BASE,
    id: 'COV-600382',
    name: 'Young Commander Chess: Novice/Newbie I & II Camp',
    category: 'Academics',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 5,
    ageMax: 9,
    startDate: '2026-07-06',
    endDate: '2026-07-10',
    days: WEEKDAYS,
    startTime: '2:20 PM',
    endTime: '3:30 PM',
    cost: 75,
    description: 'Young Commander Chess camp for beginners and newcomers to chess. Covers basic moves, captures, checkmates, special moves, and notation. Free complimentary chess kit for new students.',
    tags: ['chess', 'academics', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/600382',
  },
  // Display #603306 → URL 600384; Aug 4-7 (BC Day Tue-Fri), 3:40-5:10 PM, ages 5-9, $80
  {
    ...BASE,
    id: 'COV-600384',
    name: 'Young Commander Chess: Novice/Newbie I & II Camp',
    category: 'Academics',
    activityType: 'Day Camp',
    indoorOutdoor: 'Indoor',
    ageMin: 5,
    ageMax: 9,
    startDate: '2026-08-04',
    endDate: '2026-08-07',
    days: BC_WEEK,
    startTime: '3:40 PM',
    endTime: '5:10 PM',
    cost: 80,
    description: 'Young Commander Chess camp for beginners and newcomers to chess. Covers basic moves, captures, checkmates, special moves, and notation. Free complimentary chess kit for new students.',
    tags: ['chess', 'academics', 'day camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/600384',
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
  console.log('ADD:', prog.id, '|', prog.name, '|', prog.startDate, '|', '$' + prog.cost);
  added++;
}

fs.writeFileSync(DATA_FILE, JSON.stringify(programs, null, 2));
console.log('\nAdded:', added, '| Total programs:', programs.length);
