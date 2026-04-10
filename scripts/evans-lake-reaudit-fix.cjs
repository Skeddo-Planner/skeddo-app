/**
 * Evans Lake Re-Audit Fix — 2026-04-09
 * Rank 239 in audit queue — RE-AUDIT via Chrome browser
 *
 * Prior audit used WebFetch. Re-audit via Chrome found:
 * 1. All 8 existing overnight camp entries are correct (dates, prices, ages match)
 * 2. MISSING: Camp 1 Junior Teen (Jun 28 - Jul 3)
 * 3. MISSING: 4 Leadership A/B sessions ($1077+GST)
 * 4. MISSING: 3 OAK adventure sessions ($1167+GST)
 * 5. MISSING: 8 Day Camp sessions ($470/week, ages 6-12)
 * Total: 8 existing correct + 16 missing = 24 total programs
 *
 * Browser-verified against:
 * - https://evanslake.com/camp/camp-programs/ (overnight camp schedule)
 * - https://evanslake.com/camp/new-day-camp/ (day camp schedule)
 * - https://evanslake.campbrainregistration.com (registration portal — login required)
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;
let added = 0;

// Update existing entries with Chrome-verified costNote
for (const p of programs) {
  if (p.provider !== 'Evans Lake Forest Education Society') continue;
  if (!String(p.id).startsWith('evans-lake-')) continue;

  p.costNote = `$${p.cost}+GST. 6-day overnight camp (5-day for Camp 9). Includes meals, accommodation, all activities. Registration via CampBrain portal. Cancellation: >30 days = refund less $125 admin fee; <30 days = refund only if spot refilled. Contact: evanslake.com.`;
  p.urlVerified = true;
  corrected++;
}

// Find max numeric ID for new entries
let maxId = 0;
for (const p of programs) {
  const numId = Number(p.id);
  if (!isNaN(numId) && numId > maxId) maxId = numId;
}
let nextId = maxId + 1;

const base = {
  provider: 'Evans Lake Forest Education Society',
  category: 'Nature',
  indoorOutdoor: 'Outdoor',
  neighbourhood: 'Squamish',
  address: 'Evans Lake, Paradise Valley Road, Squamish, BC',
  city: 'Squamish',
  days: 'Sun-Fri',
  registrationUrl: 'https://evanslake.campbrainregistration.com',
  urlVerified: true,
  confirmed2026: true,
  priceVerified: true,
  enrollmentStatus: 'Open',
  status: 'Open',
  tags: ['overnight camp', 'outdoor education', 'nature', 'summer camp'],
};

// === ADD MISSING OVERNIGHT CAMPS ===

// Camp 1: Junior Teen (Jun 28 - Jul 3)
programs.push({
  ...base,
  id: `evans-lake-camp1-jt`,
  name: 'Evans Lake Junior Teen Camp (Camp 1)',
  campType: 'Overnight Camp',
  scheduleType: 'Full Day',
  ageMin: 10, ageMax: 14,
  startDate: '2026-06-28', endDate: '2026-07-03',
  cost: 963,
  activityType: 'Outdoor Education',
  costNote: '$963+GST. 6-day overnight camp. Includes meals, accommodation, all activities (canoeing, swimming, archery, eco-fun, campfire). Registration via CampBrain portal. Cancellation: >30 days = refund less $125 admin fee.',
  description: 'Junior Teen Camp at Evans Lake (Camp 1). Ages 10-14. 6-day overnight co-ed camp in Squamish. Activities include canoeing, swimming, paddle-boarding, archery, forest education (Eco Fun), campfire songs, team games, hikes, and overnight excursions.',
});
added++;

// Leadership sessions
const leadershipSessions = [
  { camp: 2, dates: ['2026-07-05', '2026-07-10'], type: 'A' },
  { camp: 4, dates: ['2026-07-19', '2026-07-24'], type: 'B' },
  { camp: 5, dates: ['2026-07-26', '2026-07-31'], type: 'A' },
  { camp: 8, dates: ['2026-08-16', '2026-08-21'], type: 'B' },
];

for (const ls of leadershipSessions) {
  programs.push({
    ...base,
    id: `evans-lake-lead${ls.type.toLowerCase()}-camp${ls.camp}`,
    name: `Evans Lake Leadership Camp ${ls.type} (Camp ${ls.camp})`,
    campType: 'Overnight Camp',
    scheduleType: 'Full Day',
    ageMin: 14, ageMax: 16,
    startDate: ls.dates[0], endDate: ls.dates[1],
    cost: 1077,
    activityType: 'Leadership',
    costNote: `$1077+GST. 6-day overnight leadership camp. Leadership ${ls.type} focuses on ${ls.type === 'A' ? 'communication and teaching styles' : 'teambuilding, team development and leadership in action'}. Space extremely limited. First step toward volunteer/staff positions. Registration via CampBrain portal.`,
    description: `Leadership Camp ${ls.type} at Evans Lake (Camp ${ls.camp}). Ages 14-16. 6-day overnight program. ${ls.type === 'A' ? 'Focus on communication, teaching styles, and interpersonal skills. Observe cabin dynamics, support cabin leaders, coordinate Evans Lake Aroo Games.' : 'Focus on teambuilding, team development, leadership in action. Build rapport with cabin campers, lead final day camp-wide games.'}`,
    tags: ['leadership', 'overnight camp', 'outdoor education', 'summer camp'],
  });
  added++;
}

// OAK sessions
const oakSessions = [
  { camp: 3, dates: ['2026-07-12', '2026-07-17'], activity: 'White Water Rafting', hike: 'Panorama Ridge' },
  { camp: 6, dates: ['2026-08-02', '2026-08-07'], activity: 'Howe Sound Boat Tour', hike: 'Elfin Lakes' },
  { camp: 7, dates: ['2026-08-09', '2026-08-14'], activity: 'Zip-lining in Whistler', hike: 'Panorama Ridge' },
];

for (const oak of oakSessions) {
  programs.push({
    ...base,
    id: `evans-lake-oak-camp${oak.camp}`,
    name: `Evans Lake OAK Adventure (Camp ${oak.camp})`,
    campType: 'Overnight Camp',
    scheduleType: 'Full Day',
    ageMin: 13, ageMax: 16,
    startDate: oak.dates[0], endDate: oak.dates[1],
    cost: 1167,
    activityType: 'Outdoor Adventure',
    costNote: `$1167+GST. 6-day overnight OAK (Outdoor Adventure Kamp). Includes 3-day hike to ${oak.hike} in Garibaldi Provincial Park + ${oak.activity}. Small group. Registration via CampBrain portal.`,
    description: `Outdoor Adventure Kamp (OAK) at Evans Lake (Camp ${oak.camp}). Ages 13-16. 6-day overnight program: 3-day, 35km hike to ${oak.hike} in Garibaldi Provincial Park + half-day ${oak.activity}. Team-building, leadership, outdoor stewardship.`,
    tags: ['outdoor adventure', 'hiking', 'overnight camp', 'summer camp'],
  });
  added++;
}

// === ADD DAY CAMP SESSIONS ===
const dayCampWeeks = [
  { week: 2, dates: ['2026-07-06', '2026-07-10'], cost: 470, days: 'Mon-Fri' },
  { week: 3, dates: ['2026-07-13', '2026-07-17'], cost: 470, days: 'Mon-Fri' },
  { week: 4, dates: ['2026-07-20', '2026-07-24'], cost: 470, days: 'Mon-Fri' },
  { week: 5, dates: ['2026-07-27', '2026-07-31'], cost: 470, days: 'Mon-Fri' },
  { week: 6, dates: ['2026-08-04', '2026-08-07'], cost: 375, days: 'Tue-Fri' },
  { week: 7, dates: ['2026-08-10', '2026-08-14'], cost: 470, days: 'Mon-Fri' },
  { week: 8, dates: ['2026-08-17', '2026-08-21'], cost: 470, days: 'Mon-Fri' },
  { week: 9, dates: ['2026-08-24', '2026-08-28'], cost: 470, days: 'Mon-Fri' },
];

for (const dc of dayCampWeeks) {
  programs.push({
    ...base,
    id: `evans-lake-day-w${dc.week}`,
    name: `Evans Lake Day Camp (Week ${dc.week})`,
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 6, ageMax: 12,
    startDate: dc.dates[0], endDate: dc.dates[1],
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    days: dc.days,
    cost: dc.cost,
    activityType: 'Outdoor Education',
    indoorOutdoor: 'Outdoor',
    costNote: `$${dc.cost}/week${dc.week === 6 ? ' (4-day week, Tue-Fri)' : ''}. Day camp 9am-3pm. Bus from Squamish Brennan Park $35/week (8:05am drop-off, 3:15pm pickup) or camp road drop-off (free, 8:35am). Late pickup fee $100. Registration via CampBrain portal. Cancellation: >30 days = refund less $75 admin fee.`,
    description: `Day Camp at Evans Lake (Week ${dc.week}). Ages 6-12. ${dc.week === 6 ? '4 days (Tue-Fri)' : '5 days (Mon-Fri)'} 9am-3pm. Outdoor education, swimming, canoeing, archery, forest education (Eco Fun), campfire songs, hikes, team games. Groups of 8 with 1 staff member. Located in Squamish.`,
    tags: ['day camp', 'outdoor education', 'nature', 'summer camp'],
  });
  added++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Evans Lake re-audit: ${corrected} corrected, ${added} added`);
console.log(`Total programs: ${programs.length}`);
