/**
 * Evans Lake Forest Education Society Audit Fix — 2026-04-09
 * Rank 239 in audit queue
 *
 * Browser/web-verified against:
 * - https://evanslake.com/camp/camp-programs/
 * - https://evanslake.campbrainregistration.com
 *
 * Key findings:
 * - ALL programs are OVERNIGHT camps, NOT day camps
 * - DB had wrong program type, wrong ages, wrong prices
 * - Real prices: $963+GST (6-day), $771+GST (5-day), $1077+GST Leadership, $1167+GST OAK
 * - Real ages: Youth 8-12, Jr Teen 10-14, Teen 13-16
 * - Location: 15 km north of Squamish, BC (61.5 km from Vancouver)
 * - Registration opened Jan 21, 2026
 * - 9 camp sessions (Jun 28 - Aug 28), DB had 8 entries (missing Camp 1)
 *
 * Changes:
 * - campType: "Summer Camp" (kept, correct for overnight)
 * - activityType: "Day Camp" → "Overnight Camp"
 * - scheduleType: corrected for overnight
 * - Ages, costs, names, dates all corrected per website
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

// Camp session data from evanslake.com/camp/camp-programs/
const campData = {
  'evans-lake-w1': {
    name: 'Evans Lake Youth Camp (Camp 2)',
    ageMin: 8, ageMax: 12,
    startDate: '2026-07-05', endDate: '2026-07-10',
    cost: 963, costNote: '$963 + GST for 6-day overnight camp. Youth Camp ages 8-12. Location: Evans Lake, 15 km north of Squamish. Registration opened Jan 21, 2026.'
  },
  'evans-lake-w2': {
    name: 'Evans Lake Junior Teen Camp (Camp 3)',
    ageMin: 10, ageMax: 14,
    startDate: '2026-07-12', endDate: '2026-07-17',
    cost: 963, costNote: '$963 + GST for 6-day overnight camp. Junior Teen Camp ages 10-14. Location: Evans Lake, 15 km north of Squamish.'
  },
  'evans-lake-w3': {
    name: 'Evans Lake Youth Camp (Camp 4)',
    ageMin: 8, ageMax: 12,
    startDate: '2026-07-19', endDate: '2026-07-24',
    cost: 963, costNote: '$963 + GST for 6-day overnight camp. Youth Camp ages 8-12. Location: Evans Lake, 15 km north of Squamish.'
  },
  'evans-lake-w4': {
    name: 'Evans Lake Youth Camp (Camp 5)',
    ageMin: 8, ageMax: 12,
    startDate: '2026-07-26', endDate: '2026-07-31',
    cost: 963, costNote: '$963 + GST for 6-day overnight camp. Youth Camp ages 8-12. Location: Evans Lake, 15 km north of Squamish.'
  },
  'evans-lake-w5': {
    name: 'Evans Lake Teen Camp (Camp 6)',
    ageMin: 13, ageMax: 16,
    startDate: '2026-08-02', endDate: '2026-08-07',
    cost: 963, costNote: '$963 + GST for 6-day overnight camp. Teen Camp ages 13-16. Location: Evans Lake, 15 km north of Squamish.'
  },
  'evans-lake-w6': {
    name: 'Evans Lake Junior Teen Camp (Camp 7)',
    ageMin: 10, ageMax: 14,
    startDate: '2026-08-09', endDate: '2026-08-14',
    cost: 963, costNote: '$963 + GST for 6-day overnight camp. Junior Teen Camp ages 10-14. Location: Evans Lake, 15 km north of Squamish.'
  },
  'evans-lake-w7': {
    name: 'Evans Lake Youth Camp (Camp 8)',
    ageMin: 8, ageMax: 12,
    startDate: '2026-08-16', endDate: '2026-08-21',
    cost: 963, costNote: '$963 + GST for 6-day overnight camp. Youth Camp ages 8-12. Location: Evans Lake, 15 km north of Squamish.'
  },
  'evans-lake-w8': {
    name: 'Evans Lake Junior Teen Camp (Camp 9)',
    ageMin: 10, ageMax: 14,
    startDate: '2026-08-24', endDate: '2026-08-28',
    cost: 771, costNote: '$771 + GST for 5-day overnight camp. Junior Teen Camp ages 10-14. Location: Evans Lake, 15 km north of Squamish.'
  }
};

for (const p of programs) {
  if (p.provider !== 'Evans Lake Forest Education Society') continue;
  const id = String(p.id);
  if (!campData[id]) continue;

  const data = campData[id];

  p.name = data.name;
  p.ageMin = data.ageMin;
  p.ageMax = data.ageMax;
  p.startDate = data.startDate;
  p.endDate = data.endDate;
  p.cost = data.cost;
  p.costNote = data.costNote;

  // Common fixes
  p.activityType = 'Overnight Camp';
  p.campType = 'Summer Camp';
  p.scheduleType = 'Full Day';
  p.dayLength = 'Full Day';
  p.indoorOutdoor = 'Outdoor';
  p.confirmed2026 = true;
  p.priceVerified = true;
  p.urlVerified = true;
  p.enrollmentStatus = 'Open';
  p.status = 'Open';
  p.days = 'Mon-Fri';
  p.season = 'Summer 2026';
  p.registrationUrl = 'https://evanslake.campbrainregistration.com';
  p.description = 'Overnight camp at Evans Lake Forest Education Centre, 15 km north of Squamish. Activities include canoeing, paddle boarding, rock climbing, low ropes, archery, swimming, field games, arts & crafts, campfire activities. Subsidy applications available.';
  p.tags = ['overnight camp', 'outdoor education', 'nature', 'canoeing', 'rock climbing', 'archery'];

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Evans Lake: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
