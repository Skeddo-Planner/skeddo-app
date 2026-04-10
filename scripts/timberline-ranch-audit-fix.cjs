/**
 * Timberline Ranch Audit Fix — 2026-04-09
 * Rank 250 in audit queue — via Chrome browser
 *
 * Browser-verified against:
 * - https://www.timberlineranch.com/summer-camps/pricing-and-calendar/
 *
 * Key findings:
 * - Christian ranch camp in Maple Ridge (22351 144 Ave, Maple Ridge, BC V4R 2P8)
 * - 4 camp types: Kick-Off (3 days), Junior (5 days), Middle (5 days), Teen (5 days)
 * - 10 total sessions across summer 2026
 * - Overnight and day camp options (day camp gets $50 discount, $35 for Kick-Off)
 * - GST on overnight camps
 * - Ages based on age at Dec 31, 2026
 * - Phone: 604-463-9278
 * - Registration: timberlineranch.com/summer-camps/registration/
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// Remove old generic entries (IDs 527-530)
const oldIds = [527, 528, 529, 530];
const filtered = programs.filter(p => !oldIds.includes(Number(p.id)));
const removed = programs.length - filtered.length;

const base = {
  provider: 'Timberline Ranch',
  category: 'Nature',
  indoorOutdoor: 'Outdoor',
  neighbourhood: 'Maple Ridge',
  address: '22351 144 Avenue, Maple Ridge, BC V4R 2P8',
  city: 'Maple Ridge',
  registrationUrl: 'https://www.timberlineranch.com/summer-camps/registration/',
  urlVerified: true,
  confirmed2026: true,
  priceVerified: true,
  activityType: 'Ranch Camp',
  tags: ['summer camp', 'ranch', 'outdoor adventure', 'overnight camp'],
  season: 'Summer 2026',
  days: 'Mon-Fri',
};

let added = 0;

const camps = [
  // Kick-Off Camps (3 days, ages 9-14)
  {
    id: 'tr-kickoff-1',
    name: 'Timberline Ranch Kick-Off Camp #1 (Jun 27-29)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 9, ageMax: 14,
    startDate: '2026-06-27', endDate: '2026-06-29',
    days: 'Sat-Mon',
    cost: 389,
    enrollmentStatus: 'Open', status: 'Open',
    costNote: '$389 for 3-day Kick-Off camp (overnight). Day camp option: $35 discount. Ages 9-14 (born 2012-2017). Boys & Girls. GST added to overnight. Includes t-shirt and daily Tuck Shop treats. Phone: 604-463-9278.',
    description: 'Kick-Off Camp #1 at Timberline Ranch, Maple Ridge. Ages 9-14. 3-day overnight ranch camp to start the summer. Horseback riding, outdoor activities, swimming. Boys & Girls.',
  },
  {
    id: 'tr-kickoff-2',
    name: 'Timberline Ranch Kick-Off Camp #2 — Girls Only (Jul 1-3)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 9, ageMax: 14,
    startDate: '2026-07-01', endDate: '2026-07-03',
    days: 'Wed-Fri',
    cost: 439,
    enrollmentStatus: 'Open', status: 'Open',
    costNote: '$439 for 3-day Kick-Off camp (overnight). Girls Only. Day camp option: $35 discount. Ages 9-14 (born 2012-2017). GST added to overnight. Phone: 604-463-9278.',
    description: 'Kick-Off Camp #2 (Girls Only) at Timberline Ranch, Maple Ridge. Ages 9-14. 3-day overnight ranch camp. Horseback riding, outdoor activities, swimming.',
  },

  // Junior Camps (5 days, ages 9-12)
  {
    id: 'tr-junior-1',
    name: 'Timberline Ranch Junior Camp #1 (Jul 13-17)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 9, ageMax: 12,
    startDate: '2026-07-13', endDate: '2026-07-17',
    cost: 679,
    enrollmentStatus: 'Waitlist', status: 'Waitlist',
    costNote: '$679 for 5-day Junior camp (overnight). Day camp option: $50 discount. Ages 9-12 (born 2014-2017). Boys & Girls. ALL OPTIONS WAITLIST ONLY. GST added to overnight. Phone: 604-463-9278.',
    description: 'Junior Camp #1 at Timberline Ranch, Maple Ridge. Ages 9-12. 5-day overnight ranch camp. Boys & Girls. Currently waitlist only for all options.',
  },
  {
    id: 'tr-junior-2',
    name: 'Timberline Ranch Junior Camp #2 — Girls Only (Jul 27-31)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 9, ageMax: 12,
    startDate: '2026-07-27', endDate: '2026-07-31',
    cost: 679,
    enrollmentStatus: 'Open', status: 'Open',
    costNote: '$679 for 5-day Junior camp (overnight). Girls Only. Day camp option: $50 discount. Ages 9-12 (born 2014-2017). GST added to overnight. Phone: 604-463-9278.',
    description: 'Junior Camp #2 (Girls Only) at Timberline Ranch, Maple Ridge. Ages 9-12. 5-day overnight ranch camp.',
  },
  {
    id: 'tr-junior-3',
    name: 'Timberline Ranch Junior Camp #3 (Aug 3-7)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 9, ageMax: 12,
    startDate: '2026-08-03', endDate: '2026-08-07',
    cost: 679,
    enrollmentStatus: 'Open', status: 'Open',
    costNote: '$679 for 5-day Junior camp (overnight). Day camp option: $50 discount. Ages 9-12 (born 2014-2017). Boys & Girls. Boys day camp near full, girls day camp waitlist. GST added to overnight. Phone: 604-463-9278.',
    description: 'Junior Camp #3 at Timberline Ranch, Maple Ridge. Ages 9-12. 5-day overnight ranch camp. Boys & Girls. Some options near full.',
  },
  {
    id: 'tr-junior-4',
    name: 'Timberline Ranch Junior Camp #4 (Aug 17-21)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 9, ageMax: 12,
    startDate: '2026-08-17', endDate: '2026-08-21',
    cost: 679,
    enrollmentStatus: 'Open', status: 'Open',
    costNote: '$679 for 5-day Junior camp (overnight). Day camp option: $50 discount. Ages 9-12 (born 2014-2017). Boys & Girls. Boys day camp near full, girls day camp waitlist. GST added to overnight. Phone: 604-463-9278.',
    description: 'Junior Camp #4 at Timberline Ranch, Maple Ridge. Ages 9-12. 5-day overnight ranch camp. Boys & Girls.',
  },

  // Middle Camps (5 days, ages 11-14)
  {
    id: 'tr-middle-1',
    name: 'Timberline Ranch Middle Camp #1 (Jul 6-10)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 11, ageMax: 14,
    startDate: '2026-07-06', endDate: '2026-07-10',
    cost: 699,
    enrollmentStatus: 'Open', status: 'Open',
    costNote: '$699 for 5-day Middle camp (overnight). Day camp option: $50 discount. Ages 11-14 (born 2012-2015). Boys & Girls. Overnight waitlist, day camp available. GST added to overnight. Phone: 604-463-9278.',
    description: 'Middle Camp #1 at Timberline Ranch, Maple Ridge. Ages 11-14. 5-day overnight ranch camp. Boys & Girls. Overnight waitlist, day camp spots available.',
  },
  {
    id: 'tr-middle-2',
    name: 'Timberline Ranch Middle Camp #2 (Aug 10-14)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 11, ageMax: 14,
    startDate: '2026-08-10', endDate: '2026-08-14',
    cost: 699,
    enrollmentStatus: 'Open', status: 'Open',
    costNote: '$699 for 5-day Middle camp (overnight). Day camp option: $50 discount. Ages 11-14 (born 2012-2015). Boys & Girls. Overnight waitlist, day camp available. GST added to overnight. Phone: 604-463-9278.',
    description: 'Middle Camp #2 at Timberline Ranch, Maple Ridge. Ages 11-14. 5-day overnight ranch camp. Boys & Girls.',
  },
  {
    id: 'tr-middle-3',
    name: 'Timberline Ranch Middle Camp #3 — Girls Only (Aug 24-28)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 11, ageMax: 14,
    startDate: '2026-08-24', endDate: '2026-08-28',
    cost: 699,
    enrollmentStatus: 'Open', status: 'Open',
    costNote: '$699 for 5-day Middle camp (overnight). Girls Only. Day camp option: $50 discount. Ages 11-14 (born 2012-2015). Overnight waitlist, day camp available. GST added to overnight. Phone: 604-463-9278.',
    description: 'Middle Camp #3 (Girls Only) at Timberline Ranch, Maple Ridge. Ages 11-14. 5-day overnight ranch camp.',
  },

  // Teen Camp (5 days, ages 14-16)
  {
    id: 'tr-teen-1',
    name: 'Timberline Ranch Teen Camp (Jul 20-24)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 14, ageMax: 16,
    startDate: '2026-07-20', endDate: '2026-07-24',
    cost: 719,
    enrollmentStatus: 'Open', status: 'Open',
    costNote: '$719 for 5-day Teen camp (overnight). Day camp option: $50 discount. Ages 14-16 (born 2010-2012). Boys & Girls. Overnight waitlist, day camp available. GST added to overnight. Phone: 604-463-9278.',
    description: 'Teen Camp at Timberline Ranch, Maple Ridge. Ages 14-16. 5-day overnight ranch camp. Boys & Girls.',
  },
];

for (const camp of camps) {
  filtered.push({ ...base, ...camp });
  added++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(filtered, null, 2) + '\n');
console.log(`Timberline Ranch audit: ${removed} removed, ${added} added`);
console.log(`Total programs: ${filtered.length}`);
