#!/usr/bin/env node
// trout-lake-audit-update.cjs
// Adds 14 missing programs at Trout Lake CC (rank 117 audit, 2026-04-06)
// Verified via browser nav + REST estimateprice API
//
// Missing program groups:
// - Petit Architect camps (Happy City, Dream House, Beautiful Boutiques): 3 programs
// - Byte Camp (3D Animation, Claymation-Cancelled): 2 programs
// - Dance camps (Dance Extreme, Frozen Dance!, Frozen Ballet x2, Superhero, Swiftie): 6 programs
// - Brick Animation Camp x2: 2 programs
// - Bluey's Big Summer Camp: 1 program

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const COMMON = {
  provider: 'City of Vancouver - Trout Lake Community Centre',
  address: '3360 Victoria Dr, Vancouver, BC V5N 4M1',
  neighbourhood: 'Kensington-Cedar Cottage',
  lat: 49.2563,
  lng: -123.0655,
  city: 'Vancouver',
  campType: 'Summer Camp',
  season: 'Summer 2026',
  enrollmentStatus: 'Open',
  confirmed2026: true,
  priceVerified: true,
  registrationDate: '2026-04-08',
  registrationDateLabel: 'Apr 8 at 7:00 PM',
  tags: ['camp'],
};

const covUrl = (urlId) =>
  `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/${urlId}`;

const newPrograms = [
  // ── Petit Architect camps ────────────────────────────────────────────────
  {
    id: 'COV-606204',
    name: 'Happy City Camp with Petit Architect',
    cost: 450,
    category: 'Multi-Activity',
    activityType: 'Day Camp',
    ageMin: 7, ageMax: 12,
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:15 AM', endTime: '3:00 PM',
    durationPerDay: 5.75, scheduleType: 'Full Day', dayLength: 'Full Day',
    indoorOutdoor: 'Both',
    description: 'Happy City Camp with Petit Architect: design and build a model happy city! Children explore urban planning, architecture, and sustainable design through hands-on building activities.',
    registrationUrl: covUrl(606204),
  },
  {
    id: 'COV-606206',
    name: 'Dream House Camp with Petit Architect',
    cost: 490,
    category: 'Multi-Activity',
    activityType: 'Day Camp',
    ageMin: 7, ageMax: 12,
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:30 AM', endTime: '3:15 PM',
    durationPerDay: 5.75, scheduleType: 'Full Day', dayLength: 'Full Day',
    indoorOutdoor: 'Both',
    description: 'Dream House Camp with Petit Architect: design and build your dream house! Children explore architecture, interior design, and engineering through hands-on building activities.',
    registrationUrl: covUrl(606206),
  },
  {
    id: 'COV-606208',
    name: 'Beautiful Boutiques Camp with Petit Architect',
    cost: 450,
    category: 'Multi-Activity',
    activityType: 'Day Camp',
    ageMin: 7, ageMax: 12,
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:15 AM', endTime: '2:59 PM',
    durationPerDay: 5.75, scheduleType: 'Full Day', dayLength: 'Full Day',
    indoorOutdoor: 'Both',
    description: 'Beautiful Boutiques Camp with Petit Architect: design and build a boutique storefront! Children explore retail design, architecture, and creative business concepts through hands-on activities.',
    registrationUrl: covUrl(606208),
  },

  // ── Byte Camp ────────────────────────────────────────────────────────────
  {
    id: 'COV-606214',
    name: 'Byte Camp - 3D Animation',
    cost: 355,
    category: 'Technology',
    activityType: 'Day Camp',
    ageMin: 11, ageMax: 14,
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '4:00 PM',
    durationPerDay: 7, scheduleType: 'Full Day', dayLength: 'Full Day',
    costNote: '4-day week (BC Day Aug 3)',
    indoorOutdoor: 'Indoor',
    description: 'Byte Camp - 3D Animation: learn professional 3D animation techniques using industry-standard software. Campers create animated characters and scenes over the week.',
    registrationUrl: covUrl(606214),
  },
  {
    id: 'COV-606213',
    name: 'Byte Camp - Claymation Movie Production',
    cost: 395,
    category: 'Technology',
    activityType: 'Day Camp',
    ageMin: 9, ageMax: 12,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '4:00 PM',
    durationPerDay: 7, scheduleType: 'Full Day', dayLength: 'Full Day',
    enrollmentStatus: 'Cancelled',
    indoorOutdoor: 'Indoor',
    description: 'Byte Camp - Claymation Movie Production: create stop-motion animation films using clay characters. Campers write scripts, build sets, animate characters, and edit their films. Note: Cancelled for Summer 2026.',
    registrationUrl: covUrl(606213),
  },

  // ── Dance camps ──────────────────────────────────────────────────────────
  {
    id: 'COV-606395',
    name: 'Dance Extreme Camp',
    cost: 220,
    category: 'Dance',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 12,
    startDate: '2026-06-29', endDate: '2026-07-03',
    days: 'Mon, Tue, Thu, Fri',
    startTime: '12:30 PM', endTime: '3:30 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    costNote: '4-day week (Canada Day Jul 1)',
    indoorOutdoor: 'Indoor',
    description: 'Dance Extreme Camp: high-energy dance camp exploring multiple dance styles including hip hop, jazz, and freestyle. Perfect for kids who love to move!',
    registrationUrl: covUrl(606395),
  },
  {
    id: 'COV-606370',
    name: 'Frozen Dance Camp!',
    cost: 110,
    category: 'Dance',
    activityType: 'Day Camp',
    ageMin: 4, ageMax: 6,
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '12:30 PM', endTime: '1:45 PM',
    durationPerDay: 1.25, scheduleType: 'Activity', dayLength: 'Partial Day',
    indoorOutdoor: 'Indoor',
    description: 'Frozen Dance Camp! inspired by the beloved movie Frozen, children dance to iconic songs and dress up as their favourite characters. A magical experience for young dancers!',
    registrationUrl: covUrl(606370),
  },
  {
    id: 'COV-606385',
    name: 'Frozen Ballet Dance Camp',
    cost: 109,
    category: 'Dance',
    activityType: 'Day Camp',
    ageMin: 3, ageMax: 5,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:15 AM', endTime: '10:30 AM',
    durationPerDay: 1.25, scheduleType: 'Activity', dayLength: 'Partial Day',
    costNote: 'Session 1 of 2 — same week, same dates, different time (Session 2: 10:45 AM–Noon)',
    indoorOutdoor: 'Indoor',
    description: 'Frozen Ballet Dance Camp: ballet-inspired dance camp themed around the movie Frozen. Young dancers learn basic ballet steps and movement through songs from the film.',
    registrationUrl: covUrl(606385),
  },
  {
    id: 'COV-606386',
    name: 'Frozen Ballet Dance Camp',
    cost: 109,
    category: 'Dance',
    activityType: 'Day Camp',
    ageMin: 3, ageMax: 5,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '10:45 AM', endTime: '12:00 PM',
    durationPerDay: 1.25, scheduleType: 'Activity', dayLength: 'Partial Day',
    costNote: 'Session 2 of 2 — same week, same dates, different time (Session 1: 9:15–10:30 AM)',
    indoorOutdoor: 'Indoor',
    description: 'Frozen Ballet Dance Camp: ballet-inspired dance camp themed around the movie Frozen. Young dancers learn basic ballet steps and movement through songs from the film.',
    registrationUrl: covUrl(606386),
  },
  {
    id: 'COV-606406',
    name: 'Superhero Training Academy Dance Camp',
    cost: 220,
    category: 'Dance',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '12:30 PM', endTime: '3:30 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Indoor',
    description: 'Superhero Training Academy Dance Camp: campers become superheroes through dance! Learn powerful moves, create superhero personas, and perform a final showcase.',
    registrationUrl: covUrl(606406),
  },
  {
    id: 'COV-606387',
    name: 'Swiftie Dance Camp',
    cost: 220,
    category: 'Dance',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '12:30 PM', endTime: '3:30 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Indoor',
    description: 'Swiftie Dance Camp: dance to Taylor Swift hits! Campers learn choreography inspired by Taylor Swift music videos and perform a final showcase.',
    registrationUrl: covUrl(606387),
  },

  // ── Brick Animation Camp ─────────────────────────────────────────────────
  {
    id: 'COV-607857',
    name: 'Brick Animation Camp',
    cost: 175,
    category: 'Multi-Activity',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 12,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '10:00 AM', endTime: '12:00 PM',
    durationPerDay: 2, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Indoor',
    description: 'Brick Animation Camp: create LEGO stop-motion animations! Campers learn animation principles, build LEGO scenes, and produce their own short films.',
    registrationUrl: covUrl(607857),
  },
  {
    id: 'COV-607859',
    name: 'Brick Animation Camp',
    cost: 175,
    category: 'Multi-Activity',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '10:00 AM', endTime: '12:00 PM',
    durationPerDay: 2, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Indoor',
    description: 'Brick Animation Camp: create LEGO stop-motion animations! Campers learn animation principles, build LEGO scenes, and produce their own short films.',
    registrationUrl: covUrl(607859),
  },

  // ── Bluey's Big Summer Camp ──────────────────────────────────────────────
  {
    id: 'COV-606399',
    name: "Bluey's Big Summer Camp",
    cost: 109,
    category: 'Multi-Activity',
    activityType: 'Day Camp',
    ageMin: 3, ageMax: 5,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:15 AM', endTime: '10:30 AM',
    durationPerDay: 1.25, scheduleType: 'Activity', dayLength: 'Partial Day',
    indoorOutdoor: 'Indoor',
    description: "Bluey's Big Summer Camp: inspired by the beloved Australian children's show Bluey! Young children enjoy imaginative play, games, crafts, and activities inspired by Bluey and friends.",
    registrationUrl: covUrl(606399),
  },
];

// Check for duplicates
const existingIds = new Set(programs.map(p => String(p.id)));
let added = 0;
for (const prog of newPrograms) {
  if (existingIds.has(prog.id)) {
    console.warn(`SKIP (already exists): ${prog.id}`);
    continue;
  }
  programs.push({ ...COMMON, ...prog });
  added++;
}

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Added ${added} programs. Total: ${programs.length}`);
