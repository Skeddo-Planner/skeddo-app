/**
 * School of Rock Vancouver Audit Fix — 2026-04-09
 * Rank 253 in audit queue — via Chrome browser
 *
 * Browser-verified against:
 * - https://www.schoolofrock.com/locations/vancouver/music-camps — full camp listing
 * - Individual camp detail pages for pricing, ages, times
 *
 * Key findings:
 * - 2837 Cambie Street, Vancouver, BC V5Z 3Y8
 * - Phone: 778-561-4261 | Email: vancouver@schoolofrock.com
 * - All week-long camps: $549 CAD
 * - Single-day camps: $125 CAD
 * - Rock 101 (ages 7-11): 9 summer weekly sessions + 2 single-day
 * - Classic Rock Rewind (ages 12-18): 3 sessions
 * - Songwriting Camp (ages 12-18): 2 sessions
 * - The Beatles Camp (ages 12-18): 2 sessions
 * - Best of the 90's Camp (ages 12-18): 2 sessions
 * - Rock Band Jam (ages 12-18): 1 single-day
 * - 4-day weeks (Jun 29 = Canada Day, Aug 4 = BC Day): 9am-4pm
 * - 5-day weeks: 9am-3pm
 * - Instruments provided for Rock 101 (beginners)
 * - Friday 3pm performance for family
 * - Nut-free facility
 * - Cancellation: full refund >7 days, 50% 6 days-24hrs, none <24hrs
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// Remove old generic entries (IDs 2446-2447)
const oldIds = [2446, 2447];
const filtered = programs.filter(p => !oldIds.includes(Number(p.id)));
const removed = programs.length - filtered.length;

const base = {
  provider: 'School of Rock Vancouver',
  category: 'Arts',
  subcategory: 'Music',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Cambie Village',
  address: '2837 Cambie Street, Vancouver, BC V5Z 3Y8',
  city: 'Vancouver',
  urlVerified: true,
  confirmed2026: true,
  priceVerified: true,
  activityType: 'Music Camp',
  tags: ['summer camp', 'music', 'band', 'performance', 'instruments'],
  season: 'Summer 2026',
  days: 'Mon-Fri',
};

let added = 0;
const camps = [];

// Helper for Rock 101 weekly camps
const rock101Weeks = [
  { slug: 'june-29-2026', start: '2026-06-29', end: '2026-07-03', startTime: '09:00', endTime: '16:00', note: '4-day week (no camp Jul 1 — Canada Day).' },
  { slug: 'july-6-2026', start: '2026-07-06', end: '2026-07-10', startTime: '09:00', endTime: '15:00', note: '' },
  { slug: 'july-13-2026', start: '2026-07-13', end: '2026-07-17', startTime: '09:00', endTime: '15:00', note: '' },
  { slug: 'july-20-2026', start: '2026-07-20', end: '2026-07-24', startTime: '09:00', endTime: '15:00', note: '' },
  { slug: 'july-27-2026', start: '2026-07-27', end: '2026-07-31', startTime: '09:00', endTime: '15:00', note: '' },
  { slug: 'august-4-2026', start: '2026-08-04', end: '2026-08-07', startTime: '09:00', endTime: '16:00', note: '4-day week (BC Day Aug 3).' },
  { slug: 'august-10-2026', start: '2026-08-10', end: '2026-08-14', startTime: '09:00', endTime: '15:00', note: '' },
  { slug: 'august-17-2026', start: '2026-08-17', end: '2026-08-21', startTime: '09:00', endTime: '15:00', note: '' },
  { slug: 'august-24-2026', start: '2026-08-24', end: '2026-08-28', startTime: '09:00', endTime: '15:00', note: '' },
];

// Rock 101 weekly camps (ages 7-11, $549)
for (let i = 0; i < rock101Weeks.length; i++) {
  const w = rock101Weeks[i];
  const dateLabel = `${w.start.replace('2026-', '').replace(/-/g, '/')}`;
  camps.push({
    id: `sor-rock101-${w.slug}`,
    name: `School of Rock Vancouver — Rock 101 Camp (${w.start.slice(5).replace('-', '/')}-${w.end.slice(5).replace('-', '/')})`,
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 7, ageMax: 11,
    startDate: w.start, endDate: w.end,
    startTime: w.startTime, endTime: w.endTime,
    cost: 549,
    enrollmentStatus: 'Open', status: 'Open',
    registrationUrl: `https://www.schoolofrock.com/locations/vancouver/music-camps/rock-101-camp-${w.slug}`,
    costNote: `$549/week. Ages 7-11. No experience needed. Instruments provided. ${w.startTime === '09:00' && w.endTime === '16:00' ? '9am-4pm' : '9am-3pm'} Mon-Fri. ${w.note}Friday performance at 3pm. Nut-free facility. Full refund >7 days, 50% 6 days-24hrs, none <24hrs. Phone: 778-561-4261.`,
    description: `Rock 101 Camp at School of Rock Vancouver. Ages 7-11, no experience necessary. Students explore instruments through musical games and activities, work on songs, and perform a live concert Friday at 3pm. Instruments provided. Nut-free facility.`,
  });
}

// Classic Rock Rewind (ages 12-18, $549)
const classicRockWeeks = [
  { slug: 'june-29-2026', start: '2026-06-29', end: '2026-07-03', startTime: '09:00', endTime: '16:00', note: '4-day week (no camp Jul 1 — Canada Day).' },
  { slug: 'august-4-2026', start: '2026-08-04', end: '2026-08-07', startTime: '09:00', endTime: '16:00', note: '4-day week (BC Day Aug 3).' },
  { slug: 'august-24-2026', start: '2026-08-24', end: '2026-08-28', startTime: '09:00', endTime: '15:00', note: '' },
];

for (const w of classicRockWeeks) {
  camps.push({
    id: `sor-classic-${w.slug}`,
    name: `School of Rock Vancouver — Classic Rock Rewind Camp (${w.start.slice(5).replace('-', '/')}-${w.end.slice(5).replace('-', '/')})`,
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 12, ageMax: 18,
    startDate: w.start, endDate: w.end,
    startTime: w.startTime, endTime: w.endTime,
    cost: 549,
    enrollmentStatus: 'Open', status: 'Open',
    registrationUrl: `https://www.schoolofrock.com/locations/vancouver/music-camps/classic-rock-rewind-camp-${w.slug}`,
    costNote: `$549/week. Ages 12-18. Some experience required. ${w.startTime === '09:00' && w.endTime === '16:00' ? '9am-4pm' : '9am-3pm'} Mon-Fri. ${w.note}Classic rock hits of the 60s & 70s — Beatles, Led Zeppelin, Rolling Stones. Friday performance. Full refund >7 days, 50% 6 days-24hrs. Phone: 778-561-4261.`,
    description: `Classic Rock Rewind Camp at School of Rock Vancouver. Ages 12-18, some experience required. Learn and perform timeless hits from the 60s and 70s — Beatles, Led Zeppelin, Rolling Stones. Week culminates in a live performance.`,
  });
}

// Songwriting Camp (ages 12-18, $549)
const songwritingWeeks = [
  { slug: 'july-6-2026', start: '2026-07-06', end: '2026-07-10' },
  { slug: 'july-27-2026', start: '2026-07-27', end: '2026-07-31' },
];

for (const w of songwritingWeeks) {
  camps.push({
    id: `sor-songwriting-${w.slug}`,
    name: `School of Rock Vancouver — Songwriting Camp (${w.start.slice(5).replace('-', '/')}-${w.end.slice(5).replace('-', '/')})`,
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 12, ageMax: 18,
    startDate: w.start, endDate: w.end,
    startTime: '09:00', endTime: '15:00',
    cost: 549,
    enrollmentStatus: 'Open', status: 'Open',
    registrationUrl: `https://www.schoolofrock.com/locations/vancouver/music-camps/songwriting-camp-${w.slug}`,
    costNote: '$549/week. Ages 12-18. Some experience required. 9am-3pm Mon-Fri. Create, arrange, and perform original songs. Groups of 2-3 develop unique songs. Friday performance. Full refund >7 days, 50% 6 days-24hrs. Phone: 778-561-4261.',
    description: 'Songwriting Camp at School of Rock Vancouver. Ages 12-18, some experience required. Students analyze iconic compositions, then work in groups to create, arrange, and perform their own original songs. Friday live performance.',
  });
}

// The Beatles Camp (ages 12-18, $549)
const beatlesWeeks = [
  { slug: 'july-13-2026', start: '2026-07-13', end: '2026-07-17' },
  { slug: 'august-10-2026', start: '2026-08-10', end: '2026-08-14' },
];

for (const w of beatlesWeeks) {
  camps.push({
    id: `sor-beatles-${w.slug}`,
    name: `School of Rock Vancouver — The Beatles Camp (${w.start.slice(5).replace('-', '/')}-${w.end.slice(5).replace('-', '/')})`,
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 12, ageMax: 18,
    startDate: w.start, endDate: w.end,
    startTime: '09:00', endTime: '15:00',
    cost: 549,
    enrollmentStatus: 'Open', status: 'Open',
    registrationUrl: `https://www.schoolofrock.com/locations/vancouver/music-camps/the-beatles-camp-${w.slug}`,
    costNote: '$549/week. Ages 12-18. Some experience required. 9am-3pm Mon-Fri. Dive into the music of The Beatles — learn and perform their legendary songs. Friday performance. Full refund >7 days, 50% 6 days-24hrs. Phone: 778-561-4261.',
    description: 'The Beatles Camp at School of Rock Vancouver. Ages 12-18, some experience required. Explore the iconic music of The Beatles, learn their legendary songs, and perform them live. Friday performance for family and friends.',
  });
}

// Best of the 90's Camp (ages 12-18, $549)
const ninetiesWeeks = [
  { slug: 'july-20-2026', start: '2026-07-20', end: '2026-07-24' },
  { slug: 'august-17-2026', start: '2026-08-17', end: '2026-08-21' },
];

for (const w of ninetiesWeeks) {
  camps.push({
    id: `sor-90s-${w.slug}`,
    name: `School of Rock Vancouver — Best of the 90's Camp (${w.start.slice(5).replace('-', '/')}-${w.end.slice(5).replace('-', '/')})`,
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 12, ageMax: 18,
    startDate: w.start, endDate: w.end,
    startTime: '09:00', endTime: '15:00',
    cost: 549,
    enrollmentStatus: 'Open', status: 'Open',
    registrationUrl: `https://www.schoolofrock.com/locations/vancouver/music-camps/best-of-the-90s-camp-${w.slug}`,
    costNote: "$549/week. Ages 12-18. Some experience required. 9am-3pm Mon-Fri. Rock out to the best hits of the 90s. Friday performance. Full refund >7 days, 50% 6 days-24hrs. Phone: 778-561-4261.",
    description: "Best of the 90's Camp at School of Rock Vancouver. Ages 12-18, some experience required. Explore and perform the defining music of the 1990s. Friday live performance for family and friends.",
  });
}

// Single-day camps
// Rock 101 single-day Apr 20 (ages 7-11, $125)
camps.push({
  id: 'sor-rock101-day-apr20',
  name: 'School of Rock Vancouver — Rock 101 Day Camp (Apr 20)',
  campType: 'Day Camp',
  scheduleType: 'Full Day',
  ageMin: 7, ageMax: 11,
  startDate: '2026-04-20', endDate: '2026-04-20',
  startTime: '09:00', endTime: '15:00',
  cost: 125,
  enrollmentStatus: 'Open', status: 'Open',
  registrationUrl: 'https://www.schoolofrock.com/locations/vancouver/music-camps/rock-101-camp-april-20-2026',
  costNote: '$125 for single-day camp. Ages 7-11. No experience needed. Instruments provided. 9am-3pm. Nut-free facility. Phone: 778-561-4261.',
  description: 'Rock 101 single-day camp at School of Rock Vancouver. Ages 7-11, no experience necessary. Explore instruments through musical games and activities. One-day introduction to rock music.',
  days: 'Sun',
});

// Rock 101 single-day May 15 (ages 7-11, $125)
camps.push({
  id: 'sor-rock101-day-may15',
  name: 'School of Rock Vancouver — Rock 101 Day Camp (May 15)',
  campType: 'Day Camp',
  scheduleType: 'Full Day',
  ageMin: 7, ageMax: 11,
  startDate: '2026-05-15', endDate: '2026-05-15',
  startTime: '09:00', endTime: '15:00',
  cost: 125,
  enrollmentStatus: 'Open', status: 'Open',
  registrationUrl: 'https://www.schoolofrock.com/locations/vancouver/music-camps/rock-101-camp-may-15-2026',
  costNote: '$125 for single-day camp. Ages 7-11. No experience needed. Instruments provided. 9am-3pm. Nut-free facility. Phone: 778-561-4261.',
  description: 'Rock 101 single-day camp at School of Rock Vancouver. Ages 7-11, no experience necessary. Explore instruments through musical games and activities. One-day introduction to rock music.',
  days: 'Fri',
});

// Rock Band Jam single-day Apr 20 (ages 12-18, $125)
camps.push({
  id: 'sor-bandjam-day-apr20',
  name: 'School of Rock Vancouver — Rock Band Jam Day Camp (Apr 20)',
  campType: 'Day Camp',
  scheduleType: 'Full Day',
  ageMin: 12, ageMax: 18,
  startDate: '2026-04-20', endDate: '2026-04-20',
  startTime: '09:00', endTime: '15:00',
  cost: 125,
  enrollmentStatus: 'Open', status: 'Open',
  registrationUrl: 'https://www.schoolofrock.com/locations/vancouver/music-camps/rock-band-jam-camp-april-20-2026',
  costNote: '$125 for single-day camp. Ages 12-18. Some experience required. 9am-3pm. Nut-free facility. Phone: 778-561-4261.',
  description: 'Rock Band Jam single-day camp at School of Rock Vancouver. Ages 12-18, some experience required. Play in a band for a day — jam with other musicians and perform together.',
  days: 'Sun',
});

for (const camp of camps) {
  filtered.push({ ...base, ...camp });
  added++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(filtered, null, 2) + '\n');
console.log(`School of Rock Vancouver audit: ${removed} removed, ${added} added`);
console.log(`Total programs: ${filtered.length}`);
