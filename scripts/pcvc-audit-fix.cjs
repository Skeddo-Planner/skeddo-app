/**
 * Pacific Coast Volleyball Club Audit Fix — 2026-04-09
 * Rank 207 in audit queue
 *
 * Browser-verified against:
 * https://www.pacificcoastvolleyballclub.com/beach-volleyball-summer-camps.html
 *
 * DB had 4 entries (weeks 3-6 only). Page shows 11 weeks × 2 options (half/full day) = 22.
 * Fix existing 4, add 18 new entries.
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

const REG_URL = 'https://pacificcoastvolleyballclub.leagueapps.com/camps/4874851-pcvc-beach-volleyball-summer-camps';
const PAGE_URL = 'https://www.pacificcoastvolleyballclub.com/beach-volleyball-summer-camps.html';

const COMMON = {
  provider: 'Pacific Coast Volleyball Club',
  category: 'Sports',
  campType: 'Summer Camp',
  ageMin: 8,
  ageMax: 18,
  days: 'Mon-Fri',
  indoorOutdoor: 'Outdoor',
  neighbourhood: 'West Point Grey',
  address: 'Spanish Banks East Beach Volleyball Courts, Vancouver, BC',
  lat: 49.2751,
  lng: -123.2041,
  enrollmentStatus: 'Open',
  registrationUrl: REG_URL,
  tags: ['beach volleyball', 'volleyball', 'outdoor', 'summer camp'],
  source: 'pacificcoastvolleyballclub.com',
  season: 'Summer 2026',
  activityType: 'Volleyball',
  status: 'Open',
  confirmed2026: true,
  priceVerified: true,
  urlVerified: true,
  ageSpanJustified: 'Single camp program for ages 8-18; athletes grouped by age, gender, and experience level within the camp. No separate age-band registrations.',
  city: 'Vancouver'
};

const weeks = [
  { num: 1, start: '2026-06-22', end: '2026-06-26', halfCost: 260, fullCost: 445 },
  { num: 2, start: '2026-06-29', end: '2026-07-03', halfCost: 210, fullCost: 360, note: 'No session Jul 1 (Canada Day), adjusted pricing' },
  { num: 3, start: '2026-07-06', end: '2026-07-10', halfCost: 260, fullCost: 445 },
  { num: 4, start: '2026-07-13', end: '2026-07-17', halfCost: 260, fullCost: 445 },
  { num: 5, start: '2026-07-20', end: '2026-07-24', halfCost: 260, fullCost: 445 },
  { num: 6, start: '2026-07-27', end: '2026-07-31', halfCost: 260, fullCost: 445 },
  { num: 7, start: '2026-08-04', end: '2026-08-07', halfCost: 210, fullCost: 360, note: 'No session Aug 3 (BC Day), adjusted pricing' },
  { num: 8, start: '2026-08-10', end: '2026-08-14', halfCost: 260, fullCost: 445 },
  { num: 9, start: '2026-08-17', end: '2026-08-21', halfCost: 260, fullCost: 445 },
  { num: 10, start: '2026-08-24', end: '2026-08-28', halfCost: 260, fullCost: 445 },
  { num: 11, start: '2026-08-31', end: '2026-09-04', halfCost: 260, fullCost: 445 },
];

// Map existing IDs to week/type
const existingMap = {
  305: { week: 3, type: 'half' },
  306: { week: 4, type: 'half' },
  307: { week: 5, type: 'full' },
  308: { week: 6, type: 'full' },
};

let corrected = 0;
let added = 0;

// Fix existing entries
for (const p of programs) {
  const mapping = existingMap[p.id];
  if (!mapping) continue;

  const week = weeks.find(w => w.num === mapping.week);
  const isFull = mapping.type === 'full';

  p.name = `Beach Volleyball Camp – Week ${week.num} (${isFull ? 'Full Day' : 'Half Day'})`;
  p.startDate = week.start;
  p.endDate = week.end;
  p.startTime = '9:00 AM';
  p.endTime = isFull ? '4:00 PM' : '12:00 PM';
  p.cost = isFull ? week.fullCost : week.halfCost;
  p.scheduleType = isFull ? 'Full Day' : 'Half Day (AM)';
  p.dayLength = isFull ? 'Full Day' : 'Half Day';
  p.durationPerDay = isFull ? 7 : 3;
  p.description = `Beach volleyball camp at Spanish Banks East. ${isFull ? 'Full day 9 AM-4 PM' : 'Half day (AM 9 AM-12 PM or PM 1-4 PM)'}. Ages 8-18, grouped by age/experience. $${isFull ? week.fullCost : week.halfCost}/week incl. GST.${week.note ? ' ' + week.note + '.' : ''}${isFull ? ' Optional $40 paddleboarding add-on.' : ''}`;
  Object.assign(p, {
    neighbourhood: COMMON.neighbourhood,
    address: COMMON.address,
    lat: COMMON.lat,
    lng: COMMON.lng,
    enrollmentStatus: COMMON.enrollmentStatus,
    registrationUrl: COMMON.registrationUrl,
    tags: COMMON.tags,
    confirmed2026: true,
    priceVerified: true,
    urlVerified: true,
    ageSpanJustified: COMMON.ageSpanJustified,
    costNote: `$${isFull ? week.fullCost : week.halfCost}/week incl. GST. ${week.note || ''}`.trim(),
  });
  if (p.isEstimate) delete p.isEstimate;
  corrected++;
}

// Add missing entries
const existingWeekTypes = new Set(Object.values(existingMap).map(m => `${m.week}-${m.type}`));

for (const week of weeks) {
  for (const type of ['half', 'full']) {
    const key = `${week.num}-${type}`;
    if (existingWeekTypes.has(key)) continue;

    const isFull = type === 'full';
    const newEntry = {
      id: `pcvc-w${week.num}-${type}`,
      name: `Beach Volleyball Camp – Week ${week.num} (${isFull ? 'Full Day' : 'Half Day'})`,
      ...COMMON,
      startDate: week.start,
      endDate: week.end,
      startTime: '9:00 AM',
      endTime: isFull ? '4:00 PM' : '12:00 PM',
      cost: isFull ? week.fullCost : week.halfCost,
      scheduleType: isFull ? 'Full Day' : 'Half Day (AM)',
      dayLength: isFull ? 'Full Day' : 'Half Day',
      durationPerDay: isFull ? 7 : 3,
      description: `Beach volleyball camp at Spanish Banks East. ${isFull ? 'Full day 9 AM-4 PM' : 'Half day (AM 9 AM-12 PM or PM 1-4 PM)'}. Ages 8-18, grouped by age/experience. $${isFull ? week.fullCost : week.halfCost}/week incl. GST.${week.note ? ' ' + week.note + '.' : ''}${isFull ? ' Optional $40 paddleboarding add-on.' : ''}`,
      costNote: `$${isFull ? week.fullCost : week.halfCost}/week incl. GST. ${week.note || ''}`.trim(),
    };
    programs.push(newEntry);
    added++;
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`PCVC audit: ${corrected} corrected, ${added} added`);
console.log(`Total programs: ${programs.length}`);
