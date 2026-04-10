/**
 * Rosewood Hunters & Jumpers Audit Fix — 2026-04-09
 * Rank 212 in audit queue
 *
 * Browser-verified against:
 *   https://rosewoodhj.com/2026-summer-riding-camps
 *   https://rosewoodhj.com/2026-spring-riding-camps
 *   https://rosewoodhj.com/pro-d-day-riding-camps
 *
 * DB had 4 entries (431-434) with wrong dates, wrong address (6926→6269),
 * wrong ages (5-14→4-14), no cost, and only AM half-day.
 *
 * Summer camps: 5 weeks × (AM + PM + Full Day) = 15 sessions
 * Spring Break: 2 weeks × (AM + PM + Full Day) = 6 sessions (Completed)
 * Pro-D Day: May 18 (upcoming)
 *
 * 4 existing corrected, 18 new added.
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

const SUMMER_URL = 'https://rosewoodhj.com/2026-summer-riding-camps';
const SPRING_URL = 'https://rosewoodhj.com/2026-spring-riding-camps';
const PROD_URL = 'https://rosewoodhj.com/pro-d-day-riding-camps';

const COMMON = {
  provider: 'Rosewood Hunters & Jumpers',
  category: 'Sports',
  ageMin: 4,
  days: 'Mon-Fri',
  indoorOutdoor: 'Outdoor',
  tags: ['horseback riding', 'horses', 'ponies', 'equestrian', 'outdoor'],
  source: 'rosewoodhj.com',
  activityType: 'Horseback Riding',
  address: '6269 Carrington Street, Vancouver, BC',
  neighbourhood: 'Dunbar-Southlands',
  lat: 49.2160,
  lng: -123.1890,
  city: 'Vancouver',
  priceVerified: true,
  urlVerified: true,
};

const SUMMER_COMMON = {
  ...COMMON,
  ageMax: 14,
  campType: 'Summer Camp',
  season: 'Summer 2026',
  confirmed2026: true,
  enrollmentStatus: 'Open',
  registrationUrl: SUMMER_URL,
  ageSpanJustified: 'Provider registration form lists single age range "ages 4 - 14" for all summer camp sessions with no age-group breakdown.',
};

// Summer camp weeks
const SUMMER_WEEKS = [
  { num: 1, start: '2026-06-29', end: '2026-07-03' },
  { num: 2, start: '2026-07-13', end: '2026-07-17' },
  { num: 3, start: '2026-07-27', end: '2026-07-31' },
  { num: 4, start: '2026-08-10', end: '2026-08-14' },
  { num: 5, start: '2026-08-24', end: '2026-08-28' },
];

let corrected = 0;

// Fix existing 4 entries → remap to Camp #1-4 AM
const idMap = {
  431: 0, // → Camp #1 AM (Jun 29 - Jul 3)
  432: 1, // → Camp #2 AM (Jul 13-17) — dates already correct
  433: 2, // → Camp #3 AM (Jul 27-31) — was Jul 20-24
  434: 3, // → Camp #4 AM (Aug 10-14) — was Jul 27-31
};

for (const p of programs) {
  if (p.provider !== 'Rosewood Hunters & Jumpers') continue;
  const id = Number(p.id);
  if (!(id in idMap)) continue;

  const week = SUMMER_WEEKS[idMap[id]];
  p.name = `Horseback Riding Camp – Week ${week.num} (AM)`;
  p.startDate = week.start;
  p.endDate = week.end;
  p.startTime = '9:00 AM';
  p.endTime = '12:00 PM';
  p.scheduleType = 'Half Day (AM)';
  p.dayLength = 'Half Day';
  p.durationPerDay = 3;
  p.cost = 399;
  p.costNote = '$399 + 5% GST per week. Half day AM (9:00am-12:00pm). Max 15 campers. All beginner riders. Gift bag included.';
  p.ageMin = 4;
  p.ageMax = 14;
  p.address = '6269 Carrington Street, Vancouver, BC';
  p.lat = 49.2160;
  p.lng = -123.1890;
  p.neighbourhood = 'Dunbar-Southlands';
  p.enrollmentStatus = 'Open';
  p.registrationUrl = SUMMER_URL;
  p.description = `Week ${week.num} AM horseback riding camp at Rosewood in Southlands, Vancouver. Ages 4-14, beginner riders. 9:00am-12:00pm Mon-Fri. Daily riding lessons, grooming, stable management, games & crafts. Max 15 campers. $399 + GST/week.`;
  p.confirmed2026 = true;
  p.priceVerified = true;
  p.urlVerified = true;
  p.ageSpanJustified = SUMMER_COMMON.ageSpanJustified;
  if (p.isEstimate) delete p.isEstimate;
  corrected++;
}

// New entries
const newEntries = [];

// Camp #5 AM (not covered by existing entries)
newEntries.push({
  id: 'rosewood-summer-w5-am',
  name: 'Horseback Riding Camp – Week 5 (AM)',
  ...SUMMER_COMMON,
  startDate: '2026-08-24',
  endDate: '2026-08-28',
  startTime: '9:00 AM',
  endTime: '12:00 PM',
  scheduleType: 'Half Day (AM)',
  dayLength: 'Half Day',
  durationPerDay: 3,
  cost: 399,
  costNote: '$399 + 5% GST per week. Half day AM (9:00am-12:00pm). Max 15 campers. Gift bag included.',
  description: 'Week 5 AM horseback riding camp at Rosewood in Southlands, Vancouver. Ages 4-14, beginner riders. 9:00am-12:00pm Mon-Fri. Daily riding lessons, grooming, stable management, games & crafts. Max 15 campers. $399 + GST/week.',
});

// All 5 PM half-day camps
for (const week of SUMMER_WEEKS) {
  newEntries.push({
    id: `rosewood-summer-w${week.num}-pm`,
    name: `Horseback Riding Camp – Week ${week.num} (PM)`,
    ...SUMMER_COMMON,
    startDate: week.start,
    endDate: week.end,
    startTime: '12:30 PM',
    endTime: '3:30 PM',
    scheduleType: 'Half Day (PM)',
    dayLength: 'Half Day',
    durationPerDay: 3,
    cost: 399,
    costNote: '$399 + 5% GST per week. Half day PM (12:30pm-3:30pm). Max 15 campers. Gift bag included.',
    description: `Week ${week.num} PM horseback riding camp at Rosewood in Southlands, Vancouver. Ages 4-14, beginner riders. 12:30pm-3:30pm Mon-Fri. Daily riding lessons, grooming, stable management, games & crafts. Max 15 campers. $399 + GST/week.`,
  });
}

// All 5 Full Day camps
for (const week of SUMMER_WEEKS) {
  newEntries.push({
    id: `rosewood-summer-w${week.num}-full`,
    name: `Horseback Riding Camp – Week ${week.num} (Full Day)`,
    ...SUMMER_COMMON,
    startDate: week.start,
    endDate: week.end,
    startTime: '9:00 AM',
    endTime: '3:30 PM',
    scheduleType: 'Full Day',
    dayLength: 'Full Day',
    durationPerDay: 6.5,
    cost: 699,
    costNote: '$699 + 5% GST per week. Full day (9:00am-3:30pm). Max 15 campers. Gift bag included.',
    description: `Week ${week.num} full day horseback riding camp at Rosewood in Southlands, Vancouver. Ages 4-14, beginner riders. 9:00am-3:30pm Mon-Fri. Daily riding lessons, grooming, stable management, games & crafts. Max 15 campers. $699 + GST/week.`,
  });
}

// Spring Break camps (Completed — ran Mar 16-27, 2026)
const SPRING_WEEKS = [
  { num: 1, start: '2026-03-16', end: '2026-03-20' },
  { num: 2, start: '2026-03-23', end: '2026-03-27' },
];
const SPRING_COMMON = {
  ...COMMON,
  ageMax: 16,
  campType: 'Spring Break Camp',
  season: 'Spring 2026',
  confirmed2026: true,
  enrollmentStatus: 'Completed',
  registrationUrl: SPRING_URL,
  ageSpanJustified: 'Provider registration form lists single age range "ages 4 - 16" for all spring break camp sessions with no age-group breakdown.',
};

for (const week of SPRING_WEEKS) {
  // AM
  newEntries.push({
    id: `rosewood-spring-w${week.num}-am`,
    name: `Spring Break Riding Camp – Week ${week.num} (AM)`,
    ...SPRING_COMMON,
    startDate: week.start,
    endDate: week.end,
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    scheduleType: 'Half Day (AM)',
    dayLength: 'Half Day',
    durationPerDay: 3,
    cost: 399,
    costNote: '$399 + 5% GST per week. Half day AM. Max 15 campers. Gift bag included.',
    description: `Spring Break week ${week.num} AM riding camp at Rosewood. Ages 4-16, beginner riders. 9:00am-12:00pm. $399 + GST/week.`,
  });
  // PM
  newEntries.push({
    id: `rosewood-spring-w${week.num}-pm`,
    name: `Spring Break Riding Camp – Week ${week.num} (PM)`,
    ...SPRING_COMMON,
    startDate: week.start,
    endDate: week.end,
    startTime: '12:30 PM',
    endTime: '3:30 PM',
    scheduleType: 'Half Day (PM)',
    dayLength: 'Half Day',
    durationPerDay: 3,
    cost: 399,
    costNote: '$399 + 5% GST per week. Half day PM. Max 15 campers. Gift bag included.',
    description: `Spring Break week ${week.num} PM riding camp at Rosewood. Ages 4-16, beginner riders. 12:30pm-3:30pm. $399 + GST/week.`,
  });
  // Full Day
  newEntries.push({
    id: `rosewood-spring-w${week.num}-full`,
    name: `Spring Break Riding Camp – Week ${week.num} (Full Day)`,
    ...SPRING_COMMON,
    startDate: week.start,
    endDate: week.end,
    startTime: '9:00 AM',
    endTime: '3:30 PM',
    scheduleType: 'Full Day',
    dayLength: 'Full Day',
    durationPerDay: 6.5,
    cost: 699,
    costNote: '$699 + 5% GST per week. Full day (9:00am-3:30pm). Max 15 campers. Gift bag included.',
    description: `Spring Break week ${week.num} full day riding camp at Rosewood. Ages 4-16, beginner riders. 9:00am-3:30pm. $699 + GST/week.`,
  });
}

// Pro-D Day Camp #8 — May 18
newEntries.push({
  id: 'rosewood-prod-may18',
  name: 'Pro-D Day Riding Camp – May 18',
  ...COMMON,
  ageMax: 16,
  campType: 'Pro-D Day Camp',
  season: 'Spring 2026',
  confirmed2026: true,
  enrollmentStatus: 'Open',
  registrationUrl: PROD_URL,
  startDate: '2026-05-18',
  endDate: '2026-05-18',
  startTime: '9:00 AM',
  endTime: '3:00 PM',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 6,
  days: 'Mon',
  cost: 169,
  costNote: '$169 + 5% GST. Full day Pro-D camp. Max 15 campers. Gift bag & photo on horseback included.',
  description: 'Pro-D Day riding camp at Rosewood in Southlands, Vancouver. Ages 4-16. Full day 9:00am-3:00pm. Riding lessons, horse education, grooming, games & crafts. $169 + GST.',
  ageSpanJustified: 'Provider registration form lists single age range "ages 4 - 16" for Pro-D Day camps with no age-group breakdown.',
});

for (const entry of newEntries) {
  programs.push({
    status: entry.enrollmentStatus === 'Completed' ? 'Completed' : 'Open',
    ...entry,
  });
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Rosewood Hunters & Jumpers: ${corrected} corrected, ${newEntries.length} added`);
console.log(`Total programs: ${programs.length}`);
