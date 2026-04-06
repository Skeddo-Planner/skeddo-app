#!/usr/bin/env node
// burnaby-audit-update.cjs
// City of Burnaby audit — 2026-04-06
// Adds programs for 9 centers/venues entirely missing from DB:
//   - Willingdon Community Centre (8 weeks)
//   - Wesburn Community Centre (8 weeks)
//   - Charles Rummel Centre (8 weeks)
//   - Riverway Sports Complex (8 weeks)
//   - Rosemary Brown Recreation Centre (7 programs: 5 regular + 2 out-trip)
//   - South Central Youth Centre (1 week)
//   - Burnaby Village Museum (8 themed weeks)
//   - Burnaby Art Gallery (7 programs: 2 half-day + 5 full-day)
//   - Swangard Stadium (2 weeks)
//
// Burnaby ActiveNet: display ID − 5487 = URL ID
// Verified: BVM display #99617 → URL 94130 → /burnaby/rest/.../estimateprice/94130 = "Summer Camp - Village Ventures" ✓
// All fees verified via browser navigation and/or REST estimateprice API
// Registration opens: Mar 9 (residents), Mar 13 (non-residents)
//
// EXISTING CENTER CORRECTIONS (8 centers with wrong cost=$265):
// BON, ECC, CSC, BCS prices corrected. Cameron, Confederation, Eileen Dailly, Kensington flagged.

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

const BURNABY_DESC = 'Burnaby Summer Camps are designed to be safe, fun, exciting and include games, sports, arts and crafts and adventure as part of each weeklong camp. Participants MUST be turning 6 years old in the calendar year the camp is offered.';

const REG_DATE = '2026-03-09';
const REG_LABEL = 'Mar 9 (residents) / Mar 13 (non-residents)';

// Helper: make a registrationUrl from URL ID
const bnbUrl = (urlId) => `https://anc.ca.apm.activecommunities.com/burnaby/activity/search/detail/${urlId}`;
const BNB_SEARCH = 'https://anc.ca.apm.activecommunities.com/burnaby/activity/search';

// ===== WILLINGDON COMMUNITY CENTRE =====
// Display IDs: 98930-98937 (sequential Wk2-Wk9)
// URL IDs: display - 5487
// Ages: 5-11 (at least 5 but less than 12)
// Time: 9:00 AM – 3:00 PM
// Cost: $168.00 (5-day), $134.40 (4-day BC Day)
const WIL_COMMON = {
  provider: 'City of Burnaby - Willingdon Community Centre',
  category: 'Camps & Day Camps',
  campType: 'Summer Camp',
  activityType: 'Multi-Sport',
  season: 'Summer 2026',
  indoorOutdoor: 'Indoor/Outdoor',
  neighbourhood: 'Lochdale',
  address: '3665 Kensington Ave, Burnaby, BC',
  lat: 49.2789,
  lng: -122.9784,
  city: 'Burnaby',
  confirmed2026: true,
  priceVerified: true,
  registrationDate: REG_DATE,
  registrationDateLabel: REG_LABEL,
  ageMin: 5,
  ageMax: 11,
  startTime: '9:00 AM',
  endTime: '3:00 PM',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 6,
  enrollmentStatus: 'Open',
  repeating: 'weekly',
  description: BURNABY_DESC,
  tags: ['day camp', 'games', 'crafts', 'sports'],
  url: BNB_SEARCH,
};

const WIL_WEEKS = [
  { id: 'BNB-93443', start: '2026-07-06', end: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, displayId: 98930 },
  { id: 'BNB-93444', start: '2026-07-13', end: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, displayId: 98931 },
  { id: 'BNB-93445', start: '2026-07-20', end: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, displayId: 98932 },
  { id: 'BNB-93446', start: '2026-07-27', end: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, displayId: 98933 },
  { id: 'BNB-93447', start: '2026-08-04', end: '2026-08-07', days: 'Tue, Wed, Thu, Fri', cost: 134.40, displayId: 98934, costNote: '$134.40 (4-day BC Day week; Aug 3 off)' },
  { id: 'BNB-93448', start: '2026-08-10', end: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, displayId: 98935 },
  { id: 'BNB-93449', start: '2026-08-17', end: '2026-08-21', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, displayId: 98936 },
  { id: 'BNB-93450', start: '2026-08-24', end: '2026-08-28', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, displayId: 98937 },
];

const wilPrograms = WIL_WEEKS.map(w => ({
  ...WIL_COMMON,
  id: w.id,
  name: `Summer Camp (Willingdon CC) Wk ${WIL_WEEKS.indexOf(w) + 2}`,
  startDate: w.start,
  endDate: w.end,
  days: w.days,
  cost: w.cost,
  costNote: w.costNote || `$${w.cost} (${w.days.includes('Tue, Wed') ? '4' : '5'}-day week)`,
  registrationUrl: bnbUrl(w.displayId - 5487),
}));

// ===== WESBURN COMMUNITY CENTRE =====
// Display IDs: 99452-99459 (mix — Aug 24 = 99452, Jul 6-Aug 17 = 99453-99459 sequential)
// Ages: 5-11
const WCC_COMMON = {
  ...WIL_COMMON,
  provider: 'City of Burnaby - Wesburn Community Centre',
  neighbourhood: 'East Burnaby',
  address: '7282 Cariboo Rd, Burnaby, BC',
  lat: 49.2454,
  lng: -122.9314,
};

const WCC_WEEKS = [
  { id: 'BNB-93966', start: '2026-07-06', end: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 93966 },
  { id: 'BNB-93967', start: '2026-07-13', end: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 93967 },
  { id: 'BNB-93968', start: '2026-07-20', end: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 93968 },
  { id: 'BNB-93969', start: '2026-07-27', end: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 93969 },
  { id: 'BNB-93970', start: '2026-08-04', end: '2026-08-07', days: 'Tue, Wed, Thu, Fri', cost: 134.40, urlId: 93970, costNote: '$134.40 (4-day BC Day week; Aug 3 off)' },
  { id: 'BNB-93971', start: '2026-08-10', end: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 93971 },
  { id: 'BNB-93972', start: '2026-08-17', end: '2026-08-21', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 93972 },
  { id: 'BNB-93965', start: '2026-08-24', end: '2026-08-28', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 93965 },
];

const wccPrograms = WCC_WEEKS.map((w, i) => ({
  ...WCC_COMMON,
  id: w.id,
  name: `Summer Camp (Wesburn CC) Wk ${i + 2}`,
  startDate: w.start,
  endDate: w.end,
  days: w.days,
  cost: w.cost,
  costNote: w.costNote || `$${w.cost} (${w.days.includes('Tue, Wed') ? '4' : '5'}-day week)`,
  registrationUrl: bnbUrl(w.urlId),
}));

// ===== CHARLES RUMMEL CENTRE =====
// Display IDs: 99896-99904 (sequential, Aug 24 = 99904 not 99903)
// Ages: 5-11
const CRC_COMMON = {
  ...WIL_COMMON,
  provider: 'City of Burnaby - Charles Rummel Centre',
  neighbourhood: 'Lochdale',
  address: '3880 Lozells Ave, Burnaby, BC',
  lat: 49.2838,
  lng: -122.9705,
};

const CRC_WEEKS = [
  { id: 'BNB-94409', start: '2026-07-06', end: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 94409 },
  { id: 'BNB-94410', start: '2026-07-13', end: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 94410 },
  { id: 'BNB-94411', start: '2026-07-20', end: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 94411 },
  { id: 'BNB-94412', start: '2026-07-27', end: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 94412 },
  { id: 'BNB-94413', start: '2026-08-04', end: '2026-08-07', days: 'Tue, Wed, Thu, Fri', cost: 134.40, urlId: 94413, costNote: '$134.40 (4-day BC Day week; Aug 3 off)' },
  { id: 'BNB-94414', start: '2026-08-10', end: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 94414 },
  { id: 'BNB-94415', start: '2026-08-17', end: '2026-08-21', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 94415 },
  { id: 'BNB-94417', start: '2026-08-24', end: '2026-08-28', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 94417 },
];

const crcPrograms = CRC_WEEKS.map((w, i) => ({
  ...CRC_COMMON,
  id: w.id,
  name: `Summer Camp (Charles Rummel Centre) Wk ${i + 2}`,
  startDate: w.start,
  endDate: w.end,
  days: w.days,
  cost: w.cost,
  costNote: w.costNote || `$${w.cost} (${w.days.includes('Tue, Wed') ? '4' : '5'}-day week)`,
  registrationUrl: bnbUrl(w.urlId),
}));

// ===== RIVERWAY SPORTS COMPLEX =====
// Display IDs: non-sequential (97984, 97985, 98176, 98203, 98215, 98228, 98229, 98230)
// Ages: 6-11
const RSC_COMMON = {
  ...WIL_COMMON,
  provider: 'City of Burnaby - Riverway Sports Complex',
  neighbourhood: 'Burnaby South',
  address: '9523 Riverway Place, Burnaby, BC',
  lat: 49.1946,
  lng: -122.9984,
  ageMin: 6,
  ageMax: 11,
};

const RSC_WEEKS = [
  { id: 'BNB-92497', name: 'Riverway Sports Camp - Wk 2', start: '2026-07-06', end: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 92497 },
  { id: 'BNB-92498', name: 'Riverway Sports Camp - Wk 3', start: '2026-07-13', end: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 92498 },
  { id: 'BNB-92689', name: 'Riverway Sports Camp - Wk 4', start: '2026-07-20', end: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 92689 },
  { id: 'BNB-92716', name: 'Riverway Sports Camp - Wk 5', start: '2026-07-27', end: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 92716 },
  { id: 'BNB-92728', name: 'Riverway Sports Camp - Wk 6 (BC Day)', start: '2026-08-04', end: '2026-08-07', days: 'Tue, Wed, Thu, Fri', cost: 134.40, urlId: 92728, costNote: '$134.40 (4-day BC Day week; Aug 3 off)' },
  { id: 'BNB-92741', name: 'Riverway Sports Camp - Wk 7', start: '2026-08-10', end: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 92741 },
  { id: 'BNB-92742', name: 'Riverway Sports Camp - Wk 8', start: '2026-08-17', end: '2026-08-21', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 92742 },
  { id: 'BNB-92743', name: 'Riverway Sports Camp - Wk 9', start: '2026-08-24', end: '2026-08-28', days: 'Mon, Tue, Wed, Thu, Fri', cost: 168.00, urlId: 92743 },
];

const rscPrograms = RSC_WEEKS.map(w => ({
  ...RSC_COMMON,
  id: w.id,
  name: w.name,
  startDate: w.start,
  endDate: w.end,
  days: w.days,
  cost: w.cost,
  costNote: w.costNote || `$${w.cost} (${w.days.includes('Tue, Wed') ? '4' : '5'}-day week)`,
  registrationUrl: bnbUrl(w.urlId),
}));

// ===== ROSEMARY BROWN RECREATION CENTRE =====
// Regular camp: Jun 29 + Jul 13-Aug 4 (ages 5-10)
// Senior Out-trip: Jul 6, Aug 10 (ages 8-11, $199.50)
const RBR_ADDR = {
  provider: 'City of Burnaby - Rosemary Brown Recreation Centre',
  neighbourhood: 'South Burnaby',
  address: '2160 Central Blvd, Burnaby, BC',
  lat: 49.2147,
  lng: -122.9550,
  city: 'Burnaby',
};

const rbrPrograms = [
  // Regular camp — Canada Day week
  {
    ...WIL_COMMON, ...RBR_ADDR,
    id: 'BNB-94518',
    name: 'Summer Camp (Rosemary Brown RC) - Canada Day Wk',
    startDate: '2026-06-29',
    endDate: '2026-07-03',
    days: 'Mon, Tue, Thu, Fri',
    cost: 134.60,
    costNote: '$134.60 (4-day Canada Day week; Jul 1 off)',
    ageMin: 5, ageMax: 10,
    registrationUrl: bnbUrl(94518),
  },
  // Senior Out-trip — Jul 6
  {
    ...WIL_COMMON, ...RBR_ADDR,
    id: 'BNB-94512',
    name: 'Summer Camp: Senior Out-trip (Rosemary Brown RC) - Wk 2',
    startDate: '2026-07-06',
    endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 199.50,
    costNote: '$199.50 (5-day Senior Out-trip camp)',
    ageMin: 8, ageMax: 11,
    registrationUrl: bnbUrl(94512),
  },
  // Regular camp — Jul 13
  {
    ...WIL_COMMON, ...RBR_ADDR,
    id: 'BNB-94513',
    name: 'Summer Camp (Rosemary Brown RC) - Wk 3',
    startDate: '2026-07-13',
    endDate: '2026-07-17',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 168.00,
    costNote: '$168.00 (5-day week)',
    ageMin: 5, ageMax: 10,
    registrationUrl: bnbUrl(94513),
  },
  // Regular camp — Jul 20
  {
    ...WIL_COMMON, ...RBR_ADDR,
    id: 'BNB-94514',
    name: 'Summer Camp (Rosemary Brown RC) - Wk 4',
    startDate: '2026-07-20',
    endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 168.00,
    costNote: '$168.00 (5-day week)',
    ageMin: 5, ageMax: 10,
    registrationUrl: bnbUrl(94514),
  },
  // Regular camp — Jul 27
  {
    ...WIL_COMMON, ...RBR_ADDR,
    id: 'BNB-94515',
    name: 'Summer Camp (Rosemary Brown RC) - Wk 5',
    startDate: '2026-07-27',
    endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 168.00,
    costNote: '$168.00 (5-day week)',
    ageMin: 5, ageMax: 10,
    registrationUrl: bnbUrl(94515),
  },
  // Regular camp — Aug 4 (BC Day)
  {
    ...WIL_COMMON, ...RBR_ADDR,
    id: 'BNB-94516',
    name: 'Summer Camp (Rosemary Brown RC) - Wk 6 (BC Day)',
    startDate: '2026-08-04',
    endDate: '2026-08-07',
    days: 'Tue, Wed, Thu, Fri',
    cost: 134.60,
    costNote: '$134.60 (4-day BC Day week; Aug 3 off)',
    ageMin: 5, ageMax: 10,
    registrationUrl: bnbUrl(94516),
  },
  // Senior Out-trip — Aug 10
  {
    ...WIL_COMMON, ...RBR_ADDR,
    id: 'BNB-94517',
    name: 'Summer Camp: Senior Out-trip (Rosemary Brown RC) - Wk 7',
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 199.50,
    costNote: '$199.50 (5-day Senior Out-trip camp)',
    ageMin: 8, ageMax: 11,
    registrationUrl: bnbUrl(94517),
  },
];

// ===== SOUTH CENTRAL YOUTH CENTRE =====
// 1 week only: Jul 6-10, ages 10-13, $199.50
const scyPrograms = [
  {
    ...WIL_COMMON,
    id: 'BNB-85585',
    name: 'Summer Break Camp (South Central Youth Centre)',
    provider: 'City of Burnaby - South Central Youth Centre',
    neighbourhood: 'Central Burnaby',
    address: '7630 Patterson Ave, Burnaby, BC',
    lat: 49.2318,
    lng: -122.9864,
    ageMin: 10, ageMax: 13,
    startDate: '2026-07-06',
    endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 199.50,
    costNote: '$199.50 (5-day week). Youth camp for older participants (10-13 yrs).',
    registrationUrl: bnbUrl(85585),
  },
];

// ===== BURNABY VILLAGE MUSEUM =====
// 8 themed weeks. Cost: $260 (non-member), $234.50 (member)
// Fees verified via REST estimateprice API (ID 94130 → $260 for Village Ventures, 94131 → $260 for Fun with Food)
const BVM_ADDR = {
  provider: 'City of Burnaby - Burnaby Village Museum',
  category: 'Arts',
  activityType: 'Multi-Activity',
  neighbourhood: 'Deer Lake',
  address: '6501 Deer Lake Ave, Burnaby, BC',
  lat: 49.2295,
  lng: -122.9845,
  city: 'Burnaby',
  ageMin: 6, ageMax: 11,
  startTime: '9:00 AM',
  endTime: '3:00 PM',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 6,
  indoorOutdoor: 'Indoor/Outdoor',
  tags: ['museum', 'arts', 'crafts', 'heritage'],
};

const bvmPrograms = [
  {
    ...WIL_COMMON, ...BVM_ADDR,
    id: 'BNB-94130',
    name: 'Summer Camp - Village Ventures (Burnaby Village Museum)',
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 260.00,
    costNote: '$260 non-member / $234.50 member rate. Price verified via ActiveNet REST API.',
    registrationUrl: bnbUrl(94130),
  },
  {
    ...WIL_COMMON, ...BVM_ADDR,
    id: 'BNB-94131',
    name: 'Summer Camp - Fun with Food (Burnaby Village Museum)',
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 260.00,
    costNote: '$260 non-member / $234.50 member rate.',
    registrationUrl: bnbUrl(94131),
  },
  {
    ...WIL_COMMON, ...BVM_ADDR,
    id: 'BNB-94132',
    name: 'Summer Camp - Indigenous Week (Burnaby Village Museum)',
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    ageMin: 7, ageMax: 11,
    cost: 260.00,
    costNote: '$260 non-member / $234.50 member rate.',
    registrationUrl: bnbUrl(94132),
  },
  {
    ...WIL_COMMON, ...BVM_ADDR,
    id: 'BNB-94133',
    name: 'Summer Camp - Outdoor Escape (Burnaby Village Museum)',
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 260.00,
    costNote: '$260 non-member / $234.50 member rate.',
    registrationUrl: bnbUrl(94133),
  },
  {
    ...WIL_COMMON, ...BVM_ADDR,
    id: 'BNB-94138',
    name: 'Summer Camp - Toy Week (Burnaby Village Museum)',
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue, Wed, Thu, Fri',
    cost: null,
    costNote: '$260 non-member / $234.50 member rate (5-day). BC Day week (4-day Tue-Fri); 4-day price not verified — check ActiveNet.',
    priceVerified: false,
    registrationUrl: bnbUrl(94138),
  },
  {
    ...WIL_COMMON, ...BVM_ADDR,
    id: 'BNB-94135',
    name: 'Summer Camp - Museum Mysteries (Burnaby Village Museum)',
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 260.00,
    costNote: '$260 non-member / $234.50 member rate.',
    registrationUrl: bnbUrl(94135),
  },
  {
    ...WIL_COMMON, ...BVM_ADDR,
    id: 'BNB-94134',
    name: 'Summer Camp - Decades Week (Burnaby Village Museum)',
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 260.00,
    costNote: '$260 non-member / $234.50 member rate.',
    registrationUrl: bnbUrl(94134),
  },
  {
    ...WIL_COMMON, ...BVM_ADDR,
    id: 'BNB-94136',
    name: 'Summer Camp - Discovering Skills (Burnaby Village Museum)',
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 260.00,
    costNote: '$260 non-member / $234.50 member rate.',
    registrationUrl: bnbUrl(94136),
  },
];

// ===== BURNABY ART GALLERY =====
// 7 programs: 2 half-day (Jul 6) + 5 full-day (Jul 13 - Aug 10)
// $311.50 (5-day full-day), $251.20 (4-day BC Day), $110.50 (half-day)
const BAG_ADDR = {
  provider: 'City of Burnaby - Burnaby Art Gallery',
  category: 'Arts',
  activityType: 'Painting & Drawing',
  neighbourhood: 'Deer Lake',
  address: '6344 Deer Lake Ave, Burnaby, BC',
  lat: 49.2285,
  lng: -122.9860,
  city: 'Burnaby',
  indoorOutdoor: 'Indoor',
  tags: ['art', 'visual arts', 'gallery'],
};

const bagPrograms = [
  // Jul 6 AM half-day (ages 4-6)
  {
    ...WIL_COMMON, ...BAG_ADDR,
    id: 'BNB-92102',
    name: 'Summer Art Camp: Down in the Dirt AM (Burnaby Art Gallery)',
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '10:00 AM', endTime: '12:00 PM',
    scheduleType: 'Activity', dayLength: 'Half Day', durationPerDay: 2,
    ageMin: 4, ageMax: 6,
    cost: 110.50,
    costNote: '$110.50 (5-day half-day AM session, 10am-noon)',
    registrationUrl: bnbUrl(92102),
  },
  // Jul 6 PM half-day (ages 4-6)
  {
    ...WIL_COMMON, ...BAG_ADDR,
    id: 'BNB-92103',
    name: 'Summer Art Camp: Down in the Dirt PM (Burnaby Art Gallery)',
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '1:00 PM', endTime: '3:00 PM',
    scheduleType: 'Activity', dayLength: 'Half Day', durationPerDay: 2,
    ageMin: 4, ageMax: 6,
    cost: 110.50,
    costNote: '$110.50 (5-day half-day PM session, 1pm-3pm)',
    registrationUrl: bnbUrl(92103),
  },
  // Jul 13 full-day (ages 6-8)
  {
    ...WIL_COMMON, ...BAG_ADDR,
    id: 'BNB-92100',
    name: 'Summer Art Camp: Days of Colour (Burnaby Art Gallery)',
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    scheduleType: 'Full Day', dayLength: 'Full Day', durationPerDay: 6,
    ageMin: 6, ageMax: 8,
    cost: 311.50,
    costNote: '$311.50 (5-day full-day art camp)',
    registrationUrl: bnbUrl(92100),
  },
  // Jul 20 full-day (ages 9-12)
  {
    ...WIL_COMMON, ...BAG_ADDR,
    id: 'BNB-92097',
    name: 'Summer Art Camp: Art in Nature (Burnaby Art Gallery)',
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    scheduleType: 'Full Day', dayLength: 'Full Day', durationPerDay: 6,
    ageMin: 9, ageMax: 12,
    cost: 311.50,
    costNote: '$311.50 (5-day full-day art camp)',
    registrationUrl: bnbUrl(92097),
  },
  // Jul 27 full-day (ages 6-8)
  {
    ...WIL_COMMON, ...BAG_ADDR,
    id: 'BNB-92101',
    name: 'Summer Art Camp: Find it, Make it (Burnaby Art Gallery)',
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    scheduleType: 'Full Day', dayLength: 'Full Day', durationPerDay: 6,
    ageMin: 6, ageMax: 8,
    cost: 311.50,
    costNote: '$311.50 (5-day full-day art camp)',
    registrationUrl: bnbUrl(92101),
  },
  // Aug 4 BC Day 4-day (ages 9-12)
  {
    ...WIL_COMMON, ...BAG_ADDR,
    id: 'BNB-92098',
    name: 'Summer Art Camp: Art Investigators (Burnaby Art Gallery)',
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    scheduleType: 'Full Day', dayLength: 'Full Day', durationPerDay: 6,
    ageMin: 9, ageMax: 12,
    cost: 251.20,
    costNote: '$251.20 (4-day BC Day week; Aug 3 off)',
    registrationUrl: bnbUrl(92098),
  },
  // Aug 10 full-day (ages 6-8)
  {
    ...WIL_COMMON, ...BAG_ADDR,
    id: 'BNB-92099',
    name: 'Summer Art Camp: Art Unusual (Burnaby Art Gallery)',
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon, Tue, Wed, Thu, Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    scheduleType: 'Full Day', dayLength: 'Full Day', durationPerDay: 6,
    ageMin: 6, ageMax: 8,
    cost: 311.50,
    costNote: '$311.50 (5-day full-day art camp)',
    registrationUrl: bnbUrl(92099),
  },
];

// ===== SWANGARD STADIUM =====
// 2 weeks: Jul 27, Aug 24. Ages 6-11. $163.50.
const swaPrograms = [
  {
    ...WIL_COMMON,
    id: 'BNB-92749',
    name: 'Swangard Sports Camp - Wk 5',
    provider: 'City of Burnaby - Swangard Stadium',
    neighbourhood: 'Central Burnaby',
    address: '3883 Imperial St, Burnaby, BC',
    lat: 49.2302,
    lng: -123.0019,
    ageMin: 6, ageMax: 11,
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 163.50,
    costNote: '$163.50 (5-day week)',
    registrationUrl: bnbUrl(92749),
  },
  {
    ...WIL_COMMON,
    id: 'BNB-92757',
    name: 'Swangard Sports Camp - Wk 9',
    provider: 'City of Burnaby - Swangard Stadium',
    neighbourhood: 'Central Burnaby',
    address: '3883 Imperial St, Burnaby, BC',
    lat: 49.2302,
    lng: -123.0019,
    ageMin: 6, ageMax: 11,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    cost: 163.50,
    costNote: '$163.50 (5-day week)',
    registrationUrl: bnbUrl(92757),
  },
];

// All new programs to add
const ALL_NEW = [
  ...wilPrograms,
  ...wccPrograms,
  ...crcPrograms,
  ...rscPrograms,
  ...rbrPrograms,
  ...scyPrograms,
  ...bvmPrograms,
  ...bagPrograms,
  ...swaPrograms,
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

// ===== CORRECT EXISTING WRONG PRICES =====
// Existing centers have cost=265 (wrong) and priceVerified=true (wrong)
// Set priceVerified=false and add costNote with correct price
const WRONG_PRICE_PROVIDERS = [
  'City of Burnaby - Bonsor Recreation Centre',
  'City of Burnaby - Edmonds Recreation Centre',
  'City of Burnaby - Christine Sinclair Recreation Centre',
  'City of Burnaby - Bill Copeland Recreation Centre',
  'City of Burnaby - Cameron Recreation Centre',
  'City of Burnaby - Confederation Park Recreation Centre',
  'City of Burnaby - Eileen Dailly Recreation Centre',
  'City of Burnaby - Kensington Recreation Centre',
];

const CORRECT_PRICES = {
  'City of Burnaby - Bonsor Recreation Centre': {
    jr: { cost: 182.00, note: 'Actual price: JR $182 (5-day) / $145.60 (4-day). DB had incorrect $265.' },
    sr: { cost: 188.83, note: 'Actual price: Senior $188.83 (5-day) / $152.43 (4-day). DB had incorrect $265.' },
  },
  'City of Burnaby - Edmonds Recreation Centre': {
    jr: { cost: 168.00, note: 'Actual price: $168 (5-day). DB had incorrect $265.' },
    sr: { cost: 168.00, note: 'Actual price: $168 (5-day). DB had incorrect $265.' },
  },
  'City of Burnaby - Christine Sinclair Recreation Centre': {
    jr: { cost: 168.00, note: 'Actual price: Junior $168 (5-day). DB had incorrect $265.' },
    sr: { cost: 199.50, note: 'Actual price: Senior $199.50 (5-day). DB had incorrect $265.' },
  },
  'City of Burnaby - Bill Copeland Recreation Centre': {
    jr: { cost: 168.00, note: 'Actual price: $168 (5-day from Wk 3+). DB had incorrect $265.' },
    sr: { cost: 168.00, note: 'Actual price: $168 (5-day from Wk 3+). DB had incorrect $265.' },
  },
};

let corrected = 0;
for (const prog of programs) {
  if (prog.cost === 265 && WRONG_PRICE_PROVIDERS.includes(prog.provider) && prog.campType === 'Summer Camp') {
    const prices = CORRECT_PRICES[prog.provider];
    if (prices) {
      const isJr = prog.ageMax <= 9; // JR camps have lower max age
      const priceInfo = isJr ? prices.jr : prices.sr;
      prog.cost = priceInfo.cost;
      prog.costNote = priceInfo.note;
      prog.priceVerified = true; // now verified
    } else {
      // Cameron, Confederation, Eileen Dailly, Kensington — price unknown
      prog.cost = null;
      prog.costNote = 'Previous price of $265 was incorrect. Correct price unverified — check ActiveNet for current pricing.';
      prog.priceVerified = false;
    }
    corrected++;
  }
}

console.log(`\nCorrected: ${corrected} existing programs with wrong prices`);

fs.writeFileSync(DATA_FILE, JSON.stringify(programs, null, 2));
console.log(`\nAdded: ${added} | Skipped: ${skipped} | Corrected: ${corrected} | Total programs: ${programs.length}`);
