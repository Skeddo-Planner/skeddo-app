#!/usr/bin/env node
// killarney-audit-update.cjs
// Adds 33 missing programs at Killarney CC (rank 132 audit, 2026-04-06)
// Also fixes priceVerified for Killarney Summer Fun Day Camp COV- entries
// and adds prices to Licensed Preschool Summer Daycamp entries.
//
// Missing programs by category:
// - CAMP: Soccer (Wk2-3, Jul 6-17): 2 programs
// - CAMP: Byte Camp (3D Animation Jul 20-24, 2D Animation Aug 24-28): 2 programs
// - CAMP: Junior Baseball (9-13yrs) Wk7-9 (Aug 10-28): 3 programs
// - CAMP: Mini Baseball (6-8yrs) Wk2-9 (Jul 6 - Aug 28): 8 programs
// - CAMP: Sportball Multisport (3-5yr) Wk2-9 (Jul 6 - Aug 28): 8 programs
// - CAMP: EFK (7 programs, Jul 6 - Aug 21): 7 programs
// - CAMP: Drawing workshops (Fantasy Forest, Junior Under the Sea, Junior Zoo): 3 programs
//
// Prices verified via REST estimateprice API on 2026-04-06.
// Vancouver display_id - 2922 = url_id (confirmed for all Killarney programs)

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const pid_map = new Map(programs.map(p => [String(p.id), p]));

const covUrl = (urlId) =>
  `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/${urlId}`;

let fixes = 0;
function fix(id, field, value) {
  const p = pid_map.get(String(id));
  if (!p) { console.warn(`SKIP (not found): ${id}`); return; }
  p[field] = value;
  fixes++;
}

// ── Data quality fixes ────────────────────────────────────────────────────────

// Killarney Summer Fun Day Camp COV- entries: prices correct but priceVerified=false
// API confirmed: Wk1 (Canada Day 4-day)=$173.04, Wks2-9 (5-day)=$216.30
const ksfdc_ids = [
  'COV-602052','COV-602089','COV-602091','COV-602097',
  'COV-602099','COV-602100','COV-602102','COV-602106','COV-602110',
];
for (const id of ksfdc_ids) {
  fix(id, 'priceVerified', true);
}
console.log(`Killarney Summer Fun Day Camp priceVerified fixed: ${ksfdc_ids.length}`);

// Licensed Preschool Summer Daycamp: cost=null → $225.10 (API verified)
fix('COV-602858', 'cost', 225.10);
fix('COV-602858', 'priceVerified', true);
fix('COV-602860', 'cost', 225.10);
fix('COV-602860', 'priceVerified', true);
console.log('Licensed Preschool Summer Daycamp prices fixed.');

// ── Common provider fields ────────────────────────────────────────────────────
const COMMON = {
  provider: 'City of Vancouver - Killarney Community Centre',
  address: '6260 Killarney Street, Vancouver, BC V5S 2X4',
  neighbourhood: 'Killarney',
  lat: 49.2219,
  lng: -123.0384,
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

// ── New programs ──────────────────────────────────────────────────────────────

const newPrograms = [

  // ── CAMP: Soccer (2 missing — Wk2 Jul6-10, Wk3 Jul13-17) ─────────────────
  // Full series: 8 weeks (Wk2-9, no Wk1 Canada Day). Price: $198/5-day, $159/4-day BC Day.
  // Wk4-9 (COV-607584 to COV-607593) already in DB. Adding Wk2 and Wk3.
  {
    id: 'COV-607199',
    name: 'CAMP: Soccer',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 12,
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '12:00 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Outdoor',
    cost: 198,
    description: 'CAMP: Soccer summer day camp at Killarney Community Centre. Fun and skill-building soccer activities for children aged 6–12.',
    registrationUrl: covUrl(607199),
  },
  {
    id: 'COV-607583',
    name: 'CAMP: Soccer',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 12,
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '12:00 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Outdoor',
    cost: 198,
    description: 'CAMP: Soccer summer day camp at Killarney Community Centre. Fun and skill-building soccer activities for children aged 6–12.',
    registrationUrl: covUrl(607583),
  },

  // ── CAMP: Byte Camp (2 new) ───────────────────────────────────────────────
  // Intro to Coding (COV-610214 = id=1657) already in DB. Adding 3D Animation and 2D Animation.
  {
    id: 'COV-610213',
    name: 'CAMP: Byte Camp - 3D Animation',
    category: 'Technology',
    activityType: 'Day Camp',
    ageMin: 11, ageMax: 14,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '4:00 PM',
    durationPerDay: 7, scheduleType: 'Full Day', dayLength: 'Full Day',
    indoorOutdoor: 'Indoor',
    cost: 410,
    description: 'CAMP: Byte Camp - 3D Animation at Killarney. Learn professional 3D animation techniques using industry-standard software. Campers create animated characters and scenes.',
    registrationUrl: covUrl(610213),
  },
  {
    id: 'COV-610215',
    name: 'CAMP: Byte Camp - 2D Animation on Tablet',
    category: 'Technology',
    activityType: 'Day Camp',
    ageMin: 9, ageMax: 12,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '4:00 PM',
    durationPerDay: 7, scheduleType: 'Full Day', dayLength: 'Full Day',
    indoorOutdoor: 'Indoor',
    cost: 410,
    description: 'CAMP: Byte Camp - 2D Animation on Tablet at Killarney. Create digital 2D animations on tablets using professional animation apps. Campers develop storytelling and animation skills.',
    registrationUrl: covUrl(610215),
  },

  // ── CAMP: Junior Baseball (9-13yrs) — Wk7-9 (3 missing) ─────────────────
  // Wk2-6 (COV-607482, COV-607621-607624) already in DB. Adding Wk7-9.
  // Price: $285/5-day, $228.60/4-day BC Day (Wk6 already in DB at $228.60)
  {
    id: 'COV-607626',
    name: 'CAMP: Junior Baseball (9-13yrs)',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 9, ageMax: 13,
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '12:30 PM', endTime: '3:30 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Outdoor',
    cost: 285,
    description: 'CAMP: Junior Baseball (9-13yrs) at Killarney Community Centre. Develop baseball skills through drills, instruction, and scrimmage games. Off-site location.',
    registrationUrl: covUrl(607626),
  },
  {
    id: 'COV-607627',
    name: 'CAMP: Junior Baseball (9-13yrs)',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 9, ageMax: 13,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '12:30 PM', endTime: '3:30 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Outdoor',
    cost: 285,
    description: 'CAMP: Junior Baseball (9-13yrs) at Killarney Community Centre. Develop baseball skills through drills, instruction, and scrimmage games. Off-site location.',
    registrationUrl: covUrl(607627),
  },
  {
    id: 'COV-607628',
    name: 'CAMP: Junior Baseball (9-13yrs)',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 9, ageMax: 13,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '12:30 PM', endTime: '3:30 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Outdoor',
    cost: 285,
    description: 'CAMP: Junior Baseball (9-13yrs) at Killarney Community Centre. Develop baseball skills through drills, instruction, and scrimmage games. Off-site location.',
    registrationUrl: covUrl(607628),
  },

  // ── CAMP: Mini Baseball (6-8yrs) — Wk2-9 (8 missing, all missing) ────────
  // No Wk1 (Canada Day week). Price: $275/5-day, $220.60/4-day BC Day.
  {
    id: 'COV-607476',
    name: 'CAMP: Mini Baseball (6-8yrs)',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 8,
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:15 AM', endTime: '12:15 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Outdoor',
    cost: 275,
    description: 'CAMP: Mini Baseball (6-8yrs) at Killarney Community Centre. Introduction to baseball skills including throwing, catching, and batting for young players. Off-site location.',
    registrationUrl: covUrl(607476),
  },
  {
    id: 'COV-607614',
    name: 'CAMP: Mini Baseball (6-8yrs)',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 8,
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:15 AM', endTime: '12:15 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Outdoor',
    cost: 275,
    description: 'CAMP: Mini Baseball (6-8yrs) at Killarney Community Centre. Introduction to baseball skills including throwing, catching, and batting for young players. Off-site location.',
    registrationUrl: covUrl(607614),
  },
  {
    id: 'COV-607615',
    name: 'CAMP: Mini Baseball (6-8yrs)',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 8,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:15 AM', endTime: '12:15 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Outdoor',
    cost: 275,
    description: 'CAMP: Mini Baseball (6-8yrs) at Killarney Community Centre. Introduction to baseball skills including throwing, catching, and batting for young players. Off-site location.',
    registrationUrl: covUrl(607615),
  },
  {
    id: 'COV-607616',
    name: 'CAMP: Mini Baseball (6-8yrs)',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 8,
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:15 AM', endTime: '12:15 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Outdoor',
    cost: 275,
    description: 'CAMP: Mini Baseball (6-8yrs) at Killarney Community Centre. Introduction to baseball skills including throwing, catching, and batting for young players. Off-site location.',
    registrationUrl: covUrl(607616),
  },
  {
    id: 'COV-607617',
    name: 'CAMP: Mini Baseball (6-8yrs)',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 8,
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue, Wed, Thu, Fri',
    startTime: '9:15 AM', endTime: '12:15 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    costNote: '4-day week (BC Day Aug 3)',
    indoorOutdoor: 'Outdoor',
    cost: 220.60,
    description: 'CAMP: Mini Baseball (6-8yrs) at Killarney Community Centre. Introduction to baseball skills for young players. Off-site location. Note: 4-day week due to BC Day.',
    registrationUrl: covUrl(607617),
  },
  {
    id: 'COV-607618',
    name: 'CAMP: Mini Baseball (6-8yrs)',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 8,
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:15 AM', endTime: '12:15 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Outdoor',
    cost: 275,
    description: 'CAMP: Mini Baseball (6-8yrs) at Killarney Community Centre. Introduction to baseball skills including throwing, catching, and batting for young players. Off-site location.',
    registrationUrl: covUrl(607618),
  },
  {
    id: 'COV-607619',
    name: 'CAMP: Mini Baseball (6-8yrs)',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 8,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:15 AM', endTime: '12:15 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Outdoor',
    cost: 275,
    description: 'CAMP: Mini Baseball (6-8yrs) at Killarney Community Centre. Introduction to baseball skills including throwing, catching, and batting for young players. Off-site location.',
    registrationUrl: covUrl(607619),
  },
  {
    id: 'COV-607620',
    name: 'CAMP: Mini Baseball (6-8yrs)',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 8,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:15 AM', endTime: '12:15 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Outdoor',
    cost: 275,
    description: 'CAMP: Mini Baseball (6-8yrs) at Killarney Community Centre. Introduction to baseball skills including throwing, catching, and batting for young players. Off-site location.',
    registrationUrl: covUrl(607620),
  },

  // ── CAMP: Sportball Multisport (3-5yr) — Wk2-9 (8 missing) ──────────────
  // 6-9yr group (COV-607217, 607596-607604) already in DB.
  // 3-5yr group: all 8 weeks missing. Price: $93/5-day, $93/4-day BC Day (same).
  // Times: 10:45 AM – 12:00 PM (75 min activity)
  {
    id: 'COV-607226',
    name: 'CAMP: Sportball Multisport',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 3, ageMax: 5,
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '10:45 AM', endTime: '12:00 PM',
    durationPerDay: 1.25, scheduleType: 'Activity', dayLength: 'Partial Day',
    indoorOutdoor: 'Both',
    cost: 93,
    description: 'CAMP: Sportball Multisport for ages 3–5 at Killarney. Introduction to multiple sports through play-based activities designed for toddlers and preschoolers.',
    registrationUrl: covUrl(607226),
  },
  {
    id: 'COV-607608',
    name: 'CAMP: Sportball Multisport',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 3, ageMax: 5,
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '10:45 AM', endTime: '12:00 PM',
    durationPerDay: 1.25, scheduleType: 'Activity', dayLength: 'Partial Day',
    indoorOutdoor: 'Both',
    cost: 93,
    description: 'CAMP: Sportball Multisport for ages 3–5 at Killarney. Introduction to multiple sports through play-based activities designed for toddlers and preschoolers.',
    registrationUrl: covUrl(607608),
  },
  {
    id: 'COV-607609',
    name: 'CAMP: Sportball Multisport',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 3, ageMax: 5,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '10:45 AM', endTime: '12:00 PM',
    durationPerDay: 1.25, scheduleType: 'Activity', dayLength: 'Partial Day',
    indoorOutdoor: 'Both',
    cost: 93,
    description: 'CAMP: Sportball Multisport for ages 3–5 at Killarney. Introduction to multiple sports through play-based activities designed for toddlers and preschoolers.',
    registrationUrl: covUrl(607609),
  },
  {
    id: 'COV-607610',
    name: 'CAMP: Sportball Multisport',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 3, ageMax: 5,
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '10:45 AM', endTime: '12:00 PM',
    durationPerDay: 1.25, scheduleType: 'Activity', dayLength: 'Partial Day',
    indoorOutdoor: 'Both',
    cost: 93,
    description: 'CAMP: Sportball Multisport for ages 3–5 at Killarney. Introduction to multiple sports through play-based activities designed for toddlers and preschoolers.',
    registrationUrl: covUrl(607610),
  },
  {
    id: 'COV-607601',
    name: 'CAMP: Sportball Multisport',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 3, ageMax: 5,
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue, Wed, Thu, Fri',
    startTime: '10:45 AM', endTime: '12:00 PM',
    durationPerDay: 1.25, scheduleType: 'Activity', dayLength: 'Partial Day',
    costNote: '4-day week (BC Day Aug 3)',
    indoorOutdoor: 'Both',
    cost: 93,
    description: 'CAMP: Sportball Multisport for ages 3–5 at Killarney. Introduction to multiple sports through play-based activities. Note: 4-day week due to BC Day.',
    registrationUrl: covUrl(607601),
  },
  {
    id: 'COV-607611',
    name: 'CAMP: Sportball Multisport',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 3, ageMax: 5,
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '10:45 AM', endTime: '12:00 PM',
    durationPerDay: 1.25, scheduleType: 'Activity', dayLength: 'Partial Day',
    indoorOutdoor: 'Both',
    cost: 93,
    description: 'CAMP: Sportball Multisport for ages 3–5 at Killarney. Introduction to multiple sports through play-based activities designed for toddlers and preschoolers.',
    registrationUrl: covUrl(607611),
  },
  {
    id: 'COV-607612',
    name: 'CAMP: Sportball Multisport',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 3, ageMax: 5,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '10:45 AM', endTime: '12:00 PM',
    durationPerDay: 1.25, scheduleType: 'Activity', dayLength: 'Partial Day',
    indoorOutdoor: 'Both',
    cost: 93,
    description: 'CAMP: Sportball Multisport for ages 3–5 at Killarney. Introduction to multiple sports through play-based activities designed for toddlers and preschoolers.',
    registrationUrl: covUrl(607612),
  },
  {
    id: 'COV-607613',
    name: 'CAMP: Sportball Multisport',
    category: 'Sports',
    activityType: 'Day Camp',
    ageMin: 3, ageMax: 5,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '10:45 AM', endTime: '12:00 PM',
    durationPerDay: 1.25, scheduleType: 'Activity', dayLength: 'Partial Day',
    indoorOutdoor: 'Both',
    cost: 93,
    description: 'CAMP: Sportball Multisport for ages 3–5 at Killarney. Introduction to multiple sports through play-based activities designed for toddlers and preschoolers.',
    registrationUrl: covUrl(607613),
  },

  // ── CAMP: EFK (7 missing — COV-612922 Aug 24-28 already in DB) ───────────
  // Wks 1-4 (Jul, 1-4 PM, 3hr): $280 each
  // Wk5 BC Day (Aug 4-7, 9AM-3PM, 6hr, 4-day): $384
  // Wks 6-8 (Aug 10-28, 9AM-3PM, 6hr): $425 each
  {
    id: 'COV-612913',
    name: 'CAMP: EFK - Jr. Software Engineering: Video Sensing',
    category: 'Technology',
    activityType: 'Day Camp',
    ageMin: 5, ageMax: 10,
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '1:00 PM', endTime: '4:00 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Indoor',
    cost: 280,
    description: 'CAMP: EFK - Jr. Software Engineering: Video Sensing at Killarney. Young engineers explore coding and video sensing technology through hands-on engineering challenges.',
    registrationUrl: covUrl(612913),
  },
  {
    id: 'COV-612914',
    name: 'CAMP: EFK - Civil Engineering: Strategic Structures',
    category: 'Technology',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 12,
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '1:00 PM', endTime: '4:00 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Indoor',
    cost: 280,
    description: 'CAMP: EFK - Civil Engineering: Strategic Structures at Killarney. Campers design and build structures while learning civil engineering principles.',
    registrationUrl: covUrl(612914),
  },
  {
    id: 'COV-612915',
    name: 'CAMP: EFK - Jr. Engineering: Playful Playground Engineers',
    category: 'Technology',
    activityType: 'Day Camp',
    ageMin: 5, ageMax: 10,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '1:00 PM', endTime: '4:00 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Indoor',
    cost: 280,
    description: 'CAMP: EFK - Jr. Engineering: Playful Playground Engineers at Killarney. Young engineers design and build playground equipment through creative engineering challenges.',
    registrationUrl: covUrl(612915),
  },
  {
    id: 'COV-612917',
    name: 'CAMP: EFK - Mechanical Engineering: Master Machines',
    category: 'Technology',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 12,
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '1:00 PM', endTime: '4:00 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Indoor',
    cost: 280,
    description: 'CAMP: EFK - Mechanical Engineering: Master Machines at Killarney. Campers explore mechanical engineering by designing and building machines and mechanisms.',
    registrationUrl: covUrl(612917),
  },
  {
    id: 'COV-612918',
    name: 'CAMP: EFK - Print It! 3D Engineering and Maker',
    category: 'Technology',
    activityType: 'Day Camp',
    ageMin: 8, ageMax: 14,
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    durationPerDay: 6, scheduleType: 'Full Day', dayLength: 'Full Day',
    costNote: '4-day week (BC Day Aug 3)',
    indoorOutdoor: 'Indoor',
    cost: 384,
    description: 'CAMP: EFK - Print It! 3D Engineering and Maker at Killarney. Campers explore 3D design and printing through hands-on maker challenges. Note: 4-day week due to BC Day.',
    registrationUrl: covUrl(612918),
  },
  {
    id: 'COV-612919',
    name: 'CAMP: EFK - Power and Energy: Agent of Change',
    category: 'Technology',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    durationPerDay: 6, scheduleType: 'Full Day', dayLength: 'Full Day',
    indoorOutdoor: 'Indoor',
    cost: 425,
    description: 'CAMP: EFK - Power and Energy: Agent of Change at Killarney. Campers explore renewable energy and power systems through engineering challenges and projects.',
    registrationUrl: covUrl(612919),
  },
  {
    id: 'COV-612921',
    name: 'CAMP: EFK - Engineering Electrified: Scratch/Switches/Sound',
    category: 'Technology',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    durationPerDay: 6, scheduleType: 'Full Day', dayLength: 'Full Day',
    indoorOutdoor: 'Indoor',
    cost: 425,
    description: 'CAMP: EFK - Engineering Electrified: Scratch, Switches & Sound at Killarney. Campers learn about electricity, circuits, and sound engineering through coding and hands-on projects.',
    registrationUrl: covUrl(612921),
  },

  // ── CAMP: Drawing Workshops (3 missing) ──────────────────────────────────
  // Existing in DB: COV-607388 (Anime, BC Day), COV-607390 (Fav Apps), COV-607392 (Furry Friends)
  // Missing: COV-607339 (Junior Under the Sea), COV-607353 (Junior Zoo), COV-607357 (Fantasy Forest)
  // All are Jul 20-24. Junior workshops (4-6yr): $155, Regular (6-12yr): $220
  {
    id: 'COV-607339',
    name: 'CAMP: Junior Under the Sea Drawing Workshop',
    category: 'Arts',
    activityType: 'Day Camp',
    ageMin: 4, ageMax: 6,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:15 AM', endTime: '10:45 AM',
    durationPerDay: 1.5, scheduleType: 'Activity', dayLength: 'Partial Day',
    indoorOutdoor: 'Indoor',
    cost: 155,
    description: 'CAMP: Junior Under the Sea Drawing Workshop at Killarney. Young artists aged 4–6 explore ocean-themed drawing and art activities in a fun, supportive environment.',
    registrationUrl: covUrl(607339),
  },
  {
    id: 'COV-607353',
    name: 'CAMP: Junior Zoo Drawing Workshop',
    category: 'Arts',
    activityType: 'Day Camp',
    ageMin: 4, ageMax: 6,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '11:00 AM', endTime: '12:30 PM',
    durationPerDay: 1.5, scheduleType: 'Activity', dayLength: 'Partial Day',
    indoorOutdoor: 'Indoor',
    cost: 155,
    description: 'CAMP: Junior Zoo Drawing Workshop at Killarney. Young artists aged 4–6 draw and paint their favourite zoo animals through guided art activities.',
    registrationUrl: covUrl(607353),
  },
  {
    id: 'COV-607357',
    name: 'CAMP: Fantasy Forest Drawing Workshop',
    category: 'Arts',
    activityType: 'Day Camp',
    ageMin: 6, ageMax: 12,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '1:00 PM', endTime: '4:00 PM',
    durationPerDay: 3, scheduleType: 'HalfDay', dayLength: 'Half Day',
    indoorOutdoor: 'Indoor',
    cost: 220,
    description: 'CAMP: Fantasy Forest Drawing Workshop at Killarney. Artists aged 6–12 create fantasy forest scenes with mythical creatures, magical landscapes, and imaginative characters.',
    registrationUrl: covUrl(607357),
  },
];

// ── Deduplicate and add ───────────────────────────────────────────────────────
const existingIds = new Set(programs.map(p => String(p.id)));
// Also track by registrationUrl to catch duplicate coverage by old numeric IDs
const existingUrls = new Set(programs.map(p => p.registrationUrl || '').filter(Boolean));

let added = 0;
for (const prog of newPrograms) {
  if (existingIds.has(prog.id)) {
    console.warn(`SKIP (id exists): ${prog.id}`);
    continue;
  }
  const url = covUrl(parseInt(prog.id.replace('COV-', '')));
  if (existingUrls.has(url)) {
    console.warn(`SKIP (url already covered): ${prog.id} → ${url}`);
    continue;
  }
  programs.push({ ...COMMON, ...prog });
  added++;
}

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Added ${added} programs. Data quality fixes: ${fixes}. Total: ${programs.length}`);
