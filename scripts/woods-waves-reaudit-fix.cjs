/**
 * Woods and Waves Outdoor Learning Re-Audit Fix — 2026-04-09
 * Rank 245 in audit queue — RE-AUDIT via Chrome browser
 *
 * Browser-verified against:
 * - https://woodsandwaves.ca/camps — Summer camp page (dates, pricing, registration)
 * - https://woodsandwaves.ca/fees-and-hours-1 — Regular term pricing
 * - https://woodsandwaves.ca/spring-term-and-2026-27 — Ages confirmed 2.5-7
 *
 * Key findings:
 * - Nature-based outdoor preschool at Jericho Beach, Kitsilano
 * - Summer camp: Jul 6-Aug 28, 8 weeks, $445/week ($356 for Aug 4-7 BC Day week)
 * - Camp hours: 9am-3pm, Mon-Fri
 * - Ages: 2.5-7 (ageMin=3 in our system)
 * - Registration via Google Forms (separate for new vs returning families)
 * - New families: https://docs.google.com/forms/d/e/1FAIpQLSfAKnBTi5vnoznVFHASVIyhKx34JmEEBT9MFAiKlcPS3EzUbg/viewform
 * - Returning families: https://forms.gle/SVSa8od1P5T37YUJ8
 * - Address: 302-2525 Carnarvon Street, Vancouver, BC V6K 0C6 (mailing)
 * - Program runs at Jericho Beach area, Kitsilano
 * - Phone: (778) 929-5761
 * - Refundable deposit required upon registration
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// Remove old generic entries (IDs 477-479)
const oldIds = [477, 478, 479];
const filtered = programs.filter(p => !oldIds.includes(Number(p.id)));
const removed = programs.length - filtered.length;

const base = {
  provider: 'Woods and Waves Outdoor Learning',
  category: 'Nature',
  indoorOutdoor: 'Outdoor',
  neighbourhood: 'Kitsilano',
  address: 'Jericho Beach, Vancouver, BC',
  addressNote: 'Outdoor nature program based at Jericho Beach area. Mailing address: 302-2525 Carnarvon St, Vancouver, BC V6K 0C6.',
  city: 'Vancouver',
  registrationUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfAKnBTi5vnoznVFHASVIyhKx34JmEEBT9MFAiKlcPS3EzUbg/viewform',
  urlVerified: true,
  confirmed2026: true,
  priceVerified: true,
  enrollmentStatus: 'Open',
  status: 'Open',
  activityType: 'Outdoor Education',
  tags: ['outdoor education', 'nature', 'summer camp', 'preschool'],
  costPer: 'week',
  ageMin: 3,
  ageMax: 7,
};

let added = 0;

const weeks = [
  { id: 'ww-camp-jul6',   start: '2026-07-06', end: '2026-07-10', label: 'Jul 6-10',   cost: 445, days: 'Mon-Fri' },
  { id: 'ww-camp-jul13',  start: '2026-07-13', end: '2026-07-17', label: 'Jul 13-17',  cost: 445, days: 'Mon-Fri' },
  { id: 'ww-camp-jul20',  start: '2026-07-20', end: '2026-07-24', label: 'Jul 20-24',  cost: 445, days: 'Mon-Fri' },
  { id: 'ww-camp-jul27',  start: '2026-07-27', end: '2026-07-31', label: 'Jul 27-31',  cost: 445, days: 'Mon-Fri' },
  { id: 'ww-camp-aug4',   start: '2026-08-04', end: '2026-08-07', label: 'Aug 4-7',    cost: 356, days: 'Tue-Fri',
    note: '4-day week (BC Day Mon Aug 3). $356 for 4 days.' },
  { id: 'ww-camp-aug10',  start: '2026-08-10', end: '2026-08-14', label: 'Aug 10-14',  cost: 445, days: 'Mon-Fri' },
  { id: 'ww-camp-aug17',  start: '2026-08-17', end: '2026-08-21', label: 'Aug 17-21',  cost: 445, days: 'Mon-Fri' },
  { id: 'ww-camp-aug24',  start: '2026-08-24', end: '2026-08-28', label: 'Aug 24-28',  cost: 445, days: 'Mon-Fri' },
];

for (const week of weeks) {
  const costNote = week.note
    ? `$${week.cost} for this week (${week.note}). Ages 2.5-7. 9am-3pm. Nature-based outdoor camp at Jericho Beach. Registration via Google Form. Refundable deposit required. Phone: 778-929-5761.`
    : `$${week.cost}/week. Ages 2.5-7. 9am-3pm. Nature-based outdoor camp at Jericho Beach. Registration via Google Form. Refundable deposit required. Phone: 778-929-5761.`;

  filtered.push({
    ...base,
    id: week.id,
    name: `Woods and Waves Summer Camp (${week.label})`,
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    startDate: week.start,
    endDate: week.end,
    startTime: '09:00',
    endTime: '15:00',
    days: week.days,
    cost: week.cost,
    costNote,
    description: 'Summer outdoor camp at Woods and Waves Outdoor Learning, Jericho Beach, Kitsilano. Ages 2.5-7. Nature-based outdoor play, exploration, and learning. 9am-3pm daily. Small group sizes.',
    season: 'Summer 2026',
  });
  added++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(filtered, null, 2) + '\n');
console.log(`Woods and Waves re-audit: ${removed} removed, ${added} added`);
console.log(`Total programs: ${filtered.length}`);
