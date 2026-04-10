/**
 * Dharma Kids Centre Audit Fix — 2026-04-09
 * Rank 213 in audit queue
 *
 * Browser-verified against https://www.dharmakids.ca/burnaby/camps/p/register
 *
 * DB had 4 entries (593-596) for camps 2-5 (Jul 6-31) with ageMax=9.
 * Provider says K-Gr2 (born 2020, 2019, 2018) → ages 5-8.
 * Provider offers 9 summer camps + 2 spring break camps = 11 total.
 * DB missing camps 1, 6-9 (5 summer) + 2 spring break = 7 missing.
 *
 * $325/week (5-day), $270 (4-day: camps 1 & 6), $400 extended hours.
 * No taxes. Prices reduced by BC Child Care Fee Reduction Initiative.
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

const REG_URL = 'https://www.dharmakids.ca/burnaby/camps/p/register';

const COMMON = {
  provider: 'Dharma Kids Centre',
  category: 'General',
  campType: 'Summer Camp',
  ageMin: 5,
  ageMax: 8,
  days: 'Mon-Fri',
  startTime: '9:30 AM',
  endTime: '3:30 PM',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 6,
  indoorOutdoor: 'Both',
  neighbourhood: 'North Burnaby',
  address: '3821 Piper Ave, Burnaby, BC V5A 3B2',
  lat: 49.2575,
  lng: -123.009,
  city: 'Burnaby',
  tags: ['creative play', 'art', 'cooking', 'nature'],
  activityType: 'General',
  source: 'dharmakids.ca',
  season: 'Summer 2026',
  confirmed2026: true,
  priceVerified: true,
  urlVerified: true,
  enrollmentStatus: 'Open',
  registrationUrl: REG_URL,
  status: 'Open',
};

// Camp themes from registration page
const SUMMER_CAMPS = [
  { num: 1, start: '2026-06-29', end: '2026-07-03', theme: 'Healthy Snacks', cost: 270, note4day: true },
  { num: 2, start: '2026-07-06', end: '2026-07-10', theme: 'Nature, Plants & Bugs', cost: 325 },
  { num: 3, start: '2026-07-13', end: '2026-07-17', theme: 'Sports Camp', cost: 325 },
  { num: 4, start: '2026-07-20', end: '2026-07-24', theme: 'Ocean Creatures', cost: 325 },
  { num: 5, start: '2026-07-27', end: '2026-07-31', theme: 'Out of this World', cost: 325 },
  { num: 6, start: '2026-08-04', end: '2026-08-07', theme: 'Slime-tastic', cost: 270, note4day: true },
  { num: 7, start: '2026-08-10', end: '2026-08-14', theme: 'Baking', cost: 325 },
  { num: 8, start: '2026-08-17', end: '2026-08-21', theme: 'Water Park Fun', cost: 325 },
  { num: 9, start: '2026-08-24', end: '2026-08-28', theme: 'Community Heroes', cost: 325 },
];

// Map existing IDs to camps 2-5
const existingMap = { 593: 2, 594: 3, 595: 4, 596: 5 };
let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'Dharma Kids Centre') continue;
  const id = Number(p.id);
  if (!(id in existingMap)) continue;

  const campNum = existingMap[id];
  const camp = SUMMER_CAMPS.find(c => c.num === campNum);

  p.name = `Summer Camp ${camp.num} – ${camp.theme}`;
  p.ageMax = 8;
  p.cost = camp.cost;
  p.costNote = `$${camp.cost}/week, no tax. Extended hours (8am-6pm) available for $400/week. Prices reduced by BC Child Care Fee Reduction Initiative. Sibling & multi-week discounts available (3 camps: $50 off, 4: $100, 5+: $150).`;
  p.description = `Summer Camp ${camp.num}: "${camp.theme}" at Dharma Kids Centre Burnaby. Ages K-Gr2 (5-8). 9:30am-3:30pm Mon-Fri. Licensed child care. Pack nut-free lunch & snacks.`;
  p.activityType = 'General';
  p.discountNote = 'Sibling & multi-week discounts: 3 camps save $50 (THREE50), 4 camps save $100 (FOUR100), 5+ camps save $150 (FIVE150).';
  corrected++;
}

// Add missing summer camps (1, 6-9)
const newEntries = [];
const missingCamps = [1, 6, 7, 8, 9];

for (const num of missingCamps) {
  const camp = SUMMER_CAMPS.find(c => c.num === num);
  const costNote = camp.note4day
    ? `$${camp.cost}/week (4-day camp), no tax. Extended hours (8am-6pm) available for $${camp.cost + 60}/week. Prices reduced by BC CCFRI. Sibling & multi-week discounts available.`
    : `$${camp.cost}/week, no tax. Extended hours (8am-6pm) available for $400/week. Prices reduced by BC CCFRI. Sibling & multi-week discounts available.`;

  newEntries.push({
    id: `dharma-summer-${camp.num}`,
    name: `Summer Camp ${camp.num} – ${camp.theme}`,
    ...COMMON,
    startDate: camp.start,
    endDate: camp.end,
    cost: camp.cost,
    costNote,
    description: `Summer Camp ${camp.num}: "${camp.theme}" at Dharma Kids Centre Burnaby. Ages K-Gr2 (5-8). 9:30am-3:30pm Mon-Fri. Licensed child care. Pack nut-free lunch & snacks.`,
    discountNote: 'Sibling & multi-week discounts: 3 camps save $50 (THREE50), 4 camps save $100 (FOUR100), 5+ camps save $150 (FIVE150).',
  });
}

// Spring Break camps (Completed)
const SPRING_CAMPS = [
  { num: 1, start: '2026-03-16', end: '2026-03-20', theme: 'Mini STEAMers' },
  { num: 2, start: '2026-03-23', end: '2026-03-27', theme: 'Fun Fitness & Yoga' },
];

for (const camp of SPRING_CAMPS) {
  newEntries.push({
    id: `dharma-spring-${camp.num}`,
    name: `Spring Camp ${camp.num} – ${camp.theme}`,
    ...COMMON,
    campType: 'Spring Break Camp',
    season: 'Spring 2026',
    startDate: camp.start,
    endDate: camp.end,
    cost: 325,
    costNote: '$325/week, no tax. Extended hours available for $400/week. Prices reduced by BC CCFRI.',
    enrollmentStatus: 'Completed',
    status: 'Completed',
    description: `Spring Break Camp ${camp.num}: "${camp.theme}" at Dharma Kids Centre Burnaby. Ages K-Gr2 (5-8). 9:30am-3:30pm Mon-Fri. Licensed child care.`,
  });
}

for (const entry of newEntries) {
  programs.push(entry);
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Dharma Kids Centre: ${corrected} corrected, ${newEntries.length} added`);
console.log(`Total programs: ${programs.length}`);
