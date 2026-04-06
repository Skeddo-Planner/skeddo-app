#!/usr/bin/env node
// hastings-audit-update.cjs
// City of Vancouver - Hastings Community Centre audit — 2026-04-06
// Adds 46 missing programs:
//   - Safari Day Camp Wk 3-9 (7 programs, ages 6-7)
//   - Voyages Day Camp Wk 1-9 (9 programs, ages 8-10)
//   - Youth Adventures Day Camp Wk 1-9 (9 programs, ages 11-13)
//   - EFK: Power and Energy, Civil Engineering, Print it! (3 programs)
//   - Before Care Wk 1-9 (9 programs, add-on care)
//   - After Care Wk 1-9 (9 programs, add-on care)
// Fixes 2 existing programs with wrong provider/address/lat/lng:
//   - COV-613146 (Safari Wk 1), COV-607068 (Safari Wk 2)
//
// Fees verified via REST: /vancouver/rest/activity/detail/estimateprice/{urlId}?locale=en-US
// Display ID - 2922 = URL ID (Vancouver standard offset)
// Registration: Apr 8, 2026 at 7:00 PM
// Provider: City of Vancouver - Hastings Cmty Centre
// Address: 3096 East Hastings Street, Vancouver, BC
// Lat/Lng: 49.2806, -123.0394

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

const COV_URL = (urlId) => `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/${urlId}`;

const HASTINGS_COMMON = {
  provider: 'City of Vancouver - Hastings Cmty Centre',
  category: 'Camps & Day Camps',
  campType: 'Summer Camp',
  season: 'Summer 2026',
  indoorOutdoor: 'Indoor/Outdoor',
  neighbourhood: 'Hastings-Sunrise',
  address: '3096 East Hastings Street, Vancouver, BC',
  lat: 49.2806,
  lng: -123.0394,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: true,
  registrationDate: '2026-04-08',
  registrationDateLabel: 'Apr 8 at 7:00 PM',
  enrollmentStatus: 'Open',
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
};

// ===== SAFARI DAY CAMP (ages 6-7) =====
// Display IDs: 616068 (Wk1), 609990-610001 sequential
// Wk 1 & 2 already in DB (COV-613146, COV-607068) — adding Wk 3-9 only
// Time: 9:00 AM - 3:30 PM (6.5 hrs, Full Day)
// Cost: $174 (5-day), $140 (4-day Canada Day/BC Day)
const SAFARI_DESC = 'Child must have completed Kindergarten and turning 6 years old by December 31, 2026, to attend this Safari Day Camp. Activities include indoor and outdoor sports, cooperative games, arts & crafts, theatre, dance parties, entertainers, and special guests. Campers will embark on 3-4 field-trips each week, travelling by public transit and charter bus. The camp is held in the Community Hall. Weekly schedule includes going to the spray park/pool/ice rink/bowling and more. Before & After Care is available.';

const safariWeeks = [
  // Wk 1 (Jun 29, Canada Day) and Wk 2 (Jul 6) already in DB — skip
  { urlId: 607070, display: 609992, wk: 3, start: '2026-07-13', end: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607071, display: 609993, wk: 4, start: '2026-07-20', end: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607072, display: 609994, wk: 5, start: '2026-07-27', end: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607074, display: 609996, wk: 6, start: '2026-08-04', end: '2026-08-07', days: 'Tue, Wed, Thu, Fri', cost: 140, note: '$140 (4-day BC Day week; Aug 3 off)' },
  { urlId: 607077, display: 609999, wk: 7, start: '2026-08-10', end: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607078, display: 610000, wk: 8, start: '2026-08-17', end: '2026-08-21', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607079, display: 610001, wk: 9, start: '2026-08-24', end: '2026-08-28', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
];

const safariPrograms = safariWeeks.map(w => ({
  ...HASTINGS_COMMON,
  id: `COV-${w.urlId}`,
  name: `Safari Day Camp Week ${w.wk}`,
  activityType: 'Day Camp',
  ageMin: 6,
  ageMax: 7,
  startDate: w.start,
  endDate: w.end,
  days: w.days,
  startTime: '9:00 AM',
  endTime: '3:30 PM',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 6.5,
  repeating: 'weekly',
  cost: w.cost,
  costNote: w.note || `$${w.cost} (${w.days.includes('Tue, Wed') ? '4' : '5'}-day week); 50% Leisure Access discount available.`,
  description: SAFARI_DESC,
  tags: ['day camp', 'field trips', 'multi-sport'],
  registrationUrl: COV_URL(w.urlId),
}));

// ===== VOYAGES DAY CAMP (ages 8-10) =====
// Display IDs: 616069 (Wk1), 610596-610603 sequential
// All 9 weeks missing from DB
// Time: 9:00 AM - 3:30 PM (6.5 hrs, Full Day)
const VOYAGES_DESC = 'Voyages Day Camp is for children ages 8-10. Activities include indoor and outdoor sports, cooperative games, arts & crafts, theatre, dance parties, entertainers, and special guests. Campers will take field trips each week exploring the city and great outdoors. The camp is held in the Community Hall. Before & After Care is available.';

const voyagesWeeks = [
  { urlId: 613147, display: 616069, wk: 1, start: '2026-06-29', end: '2026-07-03', days: 'Mon, Tue, Thu, Fri', cost: 140, note: '$140 (4-day Canada Day week; Jul 1 off)' },
  { urlId: 607674, display: 610596, wk: 2, start: '2026-07-06', end: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607675, display: 610597, wk: 3, start: '2026-07-13', end: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607676, display: 610598, wk: 4, start: '2026-07-20', end: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607677, display: 610599, wk: 5, start: '2026-07-27', end: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607678, display: 610600, wk: 6, start: '2026-08-04', end: '2026-08-07', days: 'Tue, Wed, Thu, Fri', cost: 140, note: '$140 (4-day BC Day week; Aug 3 off)' },
  { urlId: 607679, display: 610601, wk: 7, start: '2026-08-10', end: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607680, display: 610602, wk: 8, start: '2026-08-17', end: '2026-08-21', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607681, display: 610603, wk: 9, start: '2026-08-24', end: '2026-08-28', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
];

const voyagesPrograms = voyagesWeeks.map(w => ({
  ...HASTINGS_COMMON,
  id: `COV-${w.urlId}`,
  name: `Voyages Day Camp Week ${w.wk}`,
  activityType: 'Day Camp',
  ageMin: 8,
  ageMax: 10,
  startDate: w.start,
  endDate: w.end,
  days: w.days,
  startTime: '9:00 AM',
  endTime: '3:30 PM',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 6.5,
  repeating: 'weekly',
  cost: w.cost,
  costNote: w.note || `$${w.cost} (${w.days.includes('Tue, Wed') ? '4' : '5'}-day week); 50% Leisure Access discount available.`,
  description: VOYAGES_DESC,
  tags: ['day camp', 'field trips', 'multi-sport'],
  registrationUrl: COV_URL(w.urlId),
}));

// ===== YOUTH ADVENTURES DAY CAMP (ages 11-13) =====
// Display IDs (sorted chronologically):
//   Wk1=616070, Wk2=610902, Wk3=610905, Wk4=610906,
//   Wk5=611021(Jul27!), Wk6=610916(Aug4 BC Day), Wk7=610908, Wk8=610918, Wk9=610919
// NOTE: ActiveNet labels Jul 27 "Week 6" and Aug 4 "Week 5" (non-chronological).
//       We store in chronological order.
// Prices verified: Wk1=$140(4-day), Wk2=$140(5-day anomaly), Wk3=$174, Wk5(Jul27)=$174
const YOUTH_ADV_DESC = 'Youth Adventures Day Camp is for participants ages 11-13. Activities include sports, cooperative games, arts & crafts, and field trips exploring Vancouver by public transit and charter bus. The camp is held in the Community Hall. Before & After Care is available.';

const youthAdvWeeks = [
  // Wk 1: Canada Day week, display 616069, 4-day — price $140
  { urlId: 613148, display: 616070, wk: 1, start: '2026-06-29', end: '2026-07-03', days: 'Mon, Tue, Thu, Fri', cost: 140, note: '$140 (4-day Canada Day week; Jul 1 off); 50% Leisure Access discount available.' },
  // Wk 2: display 610902, 5-day — price anomaly $140 (confirmed via REST)
  { urlId: 607980, display: 610902, wk: 2, start: '2026-07-06', end: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri', cost: 140, note: '$140 (5-day week; pricing confirmed via ActiveNet API); 50% Leisure Access discount available.' },
  // Wk 3-4: display 610905, 610906, 5-day, $174
  { urlId: 607983, display: 610905, wk: 3, start: '2026-07-13', end: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607984, display: 610906, wk: 4, start: '2026-07-20', end: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  // Wk 5: display 611021 (Jul 27) — ActiveNet labels this "Week 6" but chronologically Wk 5
  { urlId: 608099, display: 611021, wk: 5, start: '2026-07-27', end: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  // Wk 6: display 610916 (BC Day, Aug 4-7) — ActiveNet labels this "Week 5" but chronologically Wk 6
  { urlId: 607994, display: 610916, wk: 6, start: '2026-08-04', end: '2026-08-07', days: 'Tue, Wed, Thu, Fri', cost: 140, note: '$140 (4-day BC Day week; Aug 3 off); 50% Leisure Access discount available.' },
  { urlId: 607986, display: 610908, wk: 7, start: '2026-08-10', end: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607996, display: 610918, wk: 8, start: '2026-08-17', end: '2026-08-21', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
  { urlId: 607997, display: 610919, wk: 9, start: '2026-08-24', end: '2026-08-28', days: 'Mon, Tue, Wed, Thu, Fri', cost: 174 },
];

const youthAdvPrograms = youthAdvWeeks.map(w => ({
  ...HASTINGS_COMMON,
  id: `COV-${w.urlId}`,
  name: `Youth Adventures Day Camp Week ${w.wk}`,
  activityType: 'Day Camp',
  ageMin: 11,
  ageMax: 13,
  startDate: w.start,
  endDate: w.end,
  days: w.days,
  startTime: '9:00 AM',
  endTime: '3:30 PM',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 6.5,
  repeating: 'weekly',
  cost: w.cost,
  costNote: w.note || `$${w.cost} (${w.days.includes('Tue, Wed') ? '4' : '5'}-day week); 50% Leisure Access discount available.`,
  description: YOUTH_ADV_DESC,
  tags: ['day camp', 'field trips', 'youth'],
  registrationUrl: COV_URL(w.urlId),
}));

// ===== EFK PROGRAMS (3 missing, 1 already in DB) =====
// EFK Space Camp (COV-614051, BC Day 4-day, Aug 4-7) already in DB
// EFK 5-day price: $420; EFK 4-day (BC Day): $336
const EFK_DESC_POWER = 'EFK: Power and Energy: Agent of Change. Engineering for Kids camp focusing on power and energy concepts through hands-on STEM activities, experiments, and engineering challenges. Ages 6-11.';
const EFK_DESC_CIVIL = 'EFK: Civil Engineering: Build n Bash. Engineering for Kids camp where campers learn civil engineering concepts through building, testing, and creative challenges. Ages 6-11.';
const EFK_DESC_PRINT = 'EFK: Print it! 3D Engineering. Engineering for Kids camp exploring 3D design and engineering principles through hands-on projects and challenges. Ages 8-13.';

const efkPrograms = [
  {
    ...HASTINGS_COMMON,
    id: 'COV-614050',
    name: 'EFK: Power and Energy: Agent of Change',
    activityType: 'STEM',
    category: 'Science & Technology',
    campType: 'Summer Camp',
    ageMin: 6, ageMax: 11,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:30 AM', endTime: '3:30 PM',
    scheduleType: 'Full Day', dayLength: 'Full Day', durationPerDay: 6,
    cost: 420,
    costNote: '$420 (5-day week); 50% Leisure Access (CCA) discount available.',
    description: EFK_DESC_POWER,
    tags: ['STEM', 'engineering', 'science'],
    registrationUrl: COV_URL(614050),
    repeating: 'weekly',
  },
  {
    ...HASTINGS_COMMON,
    id: 'COV-614052',
    name: 'EFK: Civil Engineering: Build n Bash',
    activityType: 'STEM',
    category: 'Science & Technology',
    campType: 'Summer Camp',
    ageMin: 6, ageMax: 11,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:30 AM', endTime: '3:30 PM',
    scheduleType: 'Full Day', dayLength: 'Full Day', durationPerDay: 6,
    cost: 420,
    costNote: '$420 (5-day week); 50% Leisure Access (CCA) discount available.',
    description: EFK_DESC_CIVIL,
    tags: ['STEM', 'engineering', 'science'],
    registrationUrl: COV_URL(614052),
    repeating: 'weekly',
  },
  {
    ...HASTINGS_COMMON,
    id: 'COV-614053',
    name: 'EFK: Print it! 3D Engineering',
    activityType: 'STEM',
    category: 'Science & Technology',
    campType: 'Summer Camp',
    ageMin: 8, ageMax: 13,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:30 AM', endTime: '3:30 PM',
    scheduleType: 'Full Day', dayLength: 'Full Day', durationPerDay: 6,
    cost: 420,
    costNote: '$420 (5-day week); 50% Leisure Access (CCA) discount available.',
    description: EFK_DESC_PRINT,
    tags: ['STEM', 'engineering', '3D printing'],
    registrationUrl: COV_URL(614053),
    repeating: 'weekly',
  },
];

// ===== BEFORE CARE (add-on program, 8:00 AM - 9:00 AM) =====
// Display IDs: 616067 (Wk1), 610062,610076,610077,610079,610087,610081,610083,610085
// Fees: $27 (5-day and Canada Day 4-day), $22 (BC Day 4-day Wk 6)
// NOTE: Online registration not allowed — must register in person at Hastings CC
const BC_DESC = 'Before Care for Hastings Summer Day Camp (Safari, Voyages, or Youth Adventures). Drop-off from 8:00-9:00 AM. Available only for participants registered in Day Camp Safari, Voyages, or Youth Adventures at Hastings Community Centre.';

const beforeCareWeeks = [
  { urlId: 613145, display: 616067, wk: 1, start: '2026-06-29', end: '2026-07-03', days: 'Mon, Tue, Thu, Fri', cost: 27, note: '$27 (4-day Canada Day week); in-person registration required at Hastings CC.' },
  { urlId: 607140, display: 610062, wk: 2, start: '2026-07-06', end: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri', cost: 27 },
  { urlId: 607154, display: 610076, wk: 3, start: '2026-07-13', end: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri', cost: 27 },
  { urlId: 607155, display: 610077, wk: 4, start: '2026-07-20', end: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri', cost: 27 },
  { urlId: 607157, display: 610079, wk: 5, start: '2026-07-27', end: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri', cost: 27 },
  { urlId: 607165, display: 610087, wk: 6, start: '2026-08-04', end: '2026-08-07', days: 'Tue, Wed, Thu, Fri', cost: 22, note: '$22 (4-day BC Day week; Aug 3 off); in-person registration required at Hastings CC.' },
  { urlId: 607159, display: 610081, wk: 7, start: '2026-08-10', end: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri', cost: 27 },
  { urlId: 607161, display: 610083, wk: 8, start: '2026-08-17', end: '2026-08-21', days: 'Mon, Tue, Wed, Thu, Fri', cost: 27 },
  { urlId: 607163, display: 610085, wk: 9, start: '2026-08-24', end: '2026-08-28', days: 'Mon, Tue, Wed, Thu, Fri', cost: 27 },
];

const beforeCarePrograms = beforeCareWeeks.map(w => ({
  ...HASTINGS_COMMON,
  id: `COV-${w.urlId}`,
  name: `Hastings Summer Day Camp - Before Care - Week ${w.wk}`,
  activityType: 'Day Camp',
  category: 'Camps & Day Camps',
  campType: 'Summer Camp',
  ageMin: 6, ageMax: 11,
  startDate: w.start,
  endDate: w.end,
  days: w.days,
  startTime: '8:00 AM', endTime: '9:00 AM',
  scheduleType: 'Activity',
  dayLength: 'Activity',
  durationPerDay: 1,
  repeating: 'weekly',
  cost: w.cost,
  costNote: w.note || `$${w.cost} (5-day); in-person registration required at Hastings CC. Add-on for Day Camp Safari, Voyages, or Youth Adventures participants only.`,
  description: BC_DESC,
  tags: ['before care', 'day camp add-on'],
  registrationUrl: COV_URL(w.urlId),
}));

// ===== AFTER CARE (add-on program, 3:30 PM - 5:30 PM) =====
// Display IDs: 616066 (Wk1), 610005,610038,610041,610045,610046,610050,610051,610052
// Fees: $48 (5-day), $39 (4-day weeks — Canada Day and BC Day)
// NOTE: Online registration not allowed — must register in person at Hastings CC
const AC_DESC = 'After Care for Hastings Summer Day Camp (Safari, Voyages, or Youth Adventures). Pick-up until 5:30 PM. Late fees apply: $10 for first 15 minutes, $1 per minute after. Available only for participants registered in Day Camp Safari, Voyages, or Youth Adventures at Hastings Community Centre.';

const afterCareWeeks = [
  { urlId: 613144, display: 616066, wk: 1, start: '2026-06-29', end: '2026-07-03', days: 'Mon, Tue, Thu, Fri', cost: 39, note: '$39 (4-day Canada Day week); in-person registration required at Hastings CC.' },
  { urlId: 607083, display: 610005, wk: 2, start: '2026-07-06', end: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri', cost: 48 },
  { urlId: 607116, display: 610038, wk: 3, start: '2026-07-13', end: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri', cost: 48 },
  { urlId: 607119, display: 610041, wk: 4, start: '2026-07-20', end: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri', cost: 48 },
  { urlId: 607123, display: 610045, wk: 5, start: '2026-07-27', end: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri', cost: 48 },
  { urlId: 607124, display: 610046, wk: 6, start: '2026-08-04', end: '2026-08-07', days: 'Tue, Wed, Thu, Fri', cost: 39, note: '$39 (4-day BC Day week; Aug 3 off); in-person registration required at Hastings CC.' },
  { urlId: 607128, display: 610050, wk: 7, start: '2026-08-10', end: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri', cost: 48 },
  { urlId: 607129, display: 610051, wk: 8, start: '2026-08-17', end: '2026-08-21', days: 'Mon, Tue, Wed, Thu, Fri', cost: 48 },
  { urlId: 607130, display: 610052, wk: 9, start: '2026-08-24', end: '2026-08-28', days: 'Mon, Tue, Wed, Thu, Fri', cost: 48 },
];

const afterCarePrograms = afterCareWeeks.map(w => ({
  ...HASTINGS_COMMON,
  id: `COV-${w.urlId}`,
  name: `Hastings Summer Day Camp - After Care - Week ${w.wk}`,
  activityType: 'Day Camp',
  category: 'Camps & Day Camps',
  campType: 'Summer Camp',
  ageMin: 6, ageMax: 11,
  startDate: w.start,
  endDate: w.end,
  days: w.days,
  startTime: '3:30 PM', endTime: '5:30 PM',
  scheduleType: 'Activity',
  dayLength: 'Activity',
  durationPerDay: 2,
  repeating: 'weekly',
  cost: w.cost,
  costNote: w.note || `$${w.cost} (5-day); in-person registration required at Hastings CC. Add-on for Day Camp Safari, Voyages, or Youth Adventures participants only.`,
  description: AC_DESC,
  tags: ['after care', 'day camp add-on'],
  registrationUrl: COV_URL(w.urlId),
}));

// All new programs
const ALL_NEW = [
  ...safariPrograms,
  ...voyagesPrograms,
  ...youthAdvPrograms,
  ...efkPrograms,
  ...beforeCarePrograms,
  ...afterCarePrograms,
];

let added = 0;
let skipped = 0;
for (const prog of ALL_NEW) {
  const dupById = programs.find(p => String(p.id) === String(prog.id));
  const dupByUrl = prog.registrationUrl && programs.find(p => p.registrationUrl === prog.registrationUrl);
  if (dupById || dupByUrl) {
    console.log('SKIP (already in DB):', prog.id, prog.name);
    skipped++;
    continue;
  }
  programs.push(prog);
  console.log('ADD:', prog.id, prog.name, prog.startDate);
  added++;
}

// ===== FIX EXISTING PROGRAMS WITH WRONG PROVIDER/ADDRESS =====
// COV-613146 (Safari Wk 1) and COV-607068 (Safari Wk 2) have:
//   provider = "City of Vancouver - N/A" → should be "City of Vancouver - Hastings Cmty Centre"
//   address = "N/A, Vancouver, BC" → should be "3096 East Hastings Street, Vancouver, BC"
//   lat/lng = 49.2689, -122.5582 (wrong) → 49.2806, -123.0394
let fixed = 0;
const WRONG_IDS = ['COV-613146', 'COV-607068'];
for (const prog of programs) {
  if (WRONG_IDS.includes(prog.id) && prog.provider === 'City of Vancouver - N/A') {
    prog.provider = 'City of Vancouver - Hastings Cmty Centre';
    prog.address = '3096 East Hastings Street, Vancouver, BC';
    prog.lat = 49.2806;
    prog.lng = -123.0394;
    prog.neighbourhood = 'Hastings-Sunrise';
    fixed++;
    console.log('FIX:', prog.id, prog.name, '— provider/address/lat/lng corrected');
  }
}

fs.writeFileSync(DATA_FILE, JSON.stringify(programs, null, 2));
console.log(`\nAdded: ${added} | Skipped: ${skipped} | Fixed: ${fixed} | Total: ${programs.length}`);
