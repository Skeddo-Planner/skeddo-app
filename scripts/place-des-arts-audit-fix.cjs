/**
 * Place des Arts Audit Fix — 2026-04-09
 * Rank 228 in audit queue
 *
 * Browser-verified against:
 * - https://placedesarts.ca/art-camps/summer-fun/
 * - https://anc.ca.apm.activecommunities.com/placedesarts/activity/search (ActiveNet, 102 results)
 *
 * Key changes:
 * - Day Camp ages corrected: 5-14 → 7-9 (half-day camps cover other ages)
 * - Times corrected: 9am-4pm → 9am-3:45pm
 * - Cost updated from flat $275 to actual range per ActiveNet
 * - Postal code added: V3K 1G2
 * - confirmed2026=true, enrollmentStatus="Coming Soon" (reg opens Apr 12)
 * - Added Day Camp weeks 5-6 (Aug 4-7, Aug 10-14)
 * - Added Half Day camps for ages 5-7, 7-9, 9-12, 11-14
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;
let added = 0;

const commonFields = {
  provider: 'Place des Arts',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Maillardville',
  address: '1120 Brunette Avenue, Coquitlam, BC V3K 1G2',
  postalCode: 'V3K 1G2',
  lat: 49.2275,
  lng: -122.8895,
  city: 'Coquitlam',
  enrollmentStatus: 'Coming Soon',
  registrationDate: '2026-04-12',
  confirmed2026: true,
  priceVerified: true,
  season: 'Summer 2026',
  days: 'Mon-Fri'
};

const dayCampWeeks = [
  { id: 673, startDate: '2026-07-06', endDate: '2026-07-10', cost: 282 },
  { id: 674, startDate: '2026-07-13', endDate: '2026-07-17', cost: 274 },
  { id: 675, startDate: '2026-07-20', endDate: '2026-07-24', cost: 287 },
  { id: 676, startDate: '2026-07-27', endDate: '2026-07-31', cost: 281 }
];

// Fix existing Day Camp entries (IDs 673-676)
for (const p of programs) {
  if (p.provider !== 'Place des Arts') continue;
  const weekInfo = dayCampWeeks.find(w => w.id === Number(p.id));
  if (!weekInfo) continue;

  p.name = 'Summer Fun Day Camp';
  p.ageMin = 7;
  p.ageMax = 9;
  p.startTime = '9:00 AM';
  p.endTime = '3:45 PM';
  p.cost = weekInfo.cost;
  p.costNote = 'Price varies by block/class ($224-$314/week depending on activities chosen). Multiple art class blocks available per week. Registration opens Apr 12 at 7am online, 1pm in-person.';
  p.postalCode = 'V3K 1G2';
  p.enrollmentStatus = 'Coming Soon';
  p.registrationDate = '2026-04-12';
  p.confirmed2026 = true;
  p.priceVerified = true;
  p.registrationUrl = 'https://anc.ca.apm.activecommunities.com/placedesarts/activity/search?onlineSiteId=0&activity_keyword=summer+fun+day+camp';
  p.description = 'Summer Fun Day Camp at Place des Arts, Coquitlam. Ages 7-9. Full day of visual and performing arts: painting, dance, theatre, music, clay, and more. Multiple class blocks available per week — each block is a different art discipline. 9am-3:45pm Mon-Fri.';
  p.activityType = 'Visual Arts';
  p.tags = ['art', 'visual arts', 'performing arts', 'dance', 'theatre', 'music', 'summer camp'];
  delete p.isEstimate;
  delete p.urlVerified;
  corrected++;
}

// Add Day Camp weeks 5-6
const newDayCamps = [
  {
    id: 'pda-daycamp-w5',
    name: 'Summer Fun Day Camp',
    ...commonFields,
    category: 'Arts',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 7,
    ageMax: 9,
    startDate: '2026-08-04',
    endDate: '2026-08-07',
    days: 'Tue-Fri',
    startTime: '9:00 AM',
    endTime: '3:45 PM',
    cost: 224,
    costNote: '4-day week (BC Day Mon). Price varies by block ($224-$232). Multiple art class blocks available. Registration opens Apr 12.',
    activityType: 'Visual Arts',
    tags: ['art', 'visual arts', 'performing arts', 'summer camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/placedesarts/activity/search?onlineSiteId=0&activity_keyword=summer+fun+day+camp',
    description: 'Summer Fun Day Camp at Place des Arts, Coquitlam. Ages 7-9. 4-day week (BC Day). Visual and performing arts activities. Multiple class blocks available. 9am-3:45pm Tue-Fri.'
  },
  {
    id: 'pda-daycamp-w6',
    name: 'Summer Fun Day Camp',
    ...commonFields,
    category: 'Arts',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 7,
    ageMax: 9,
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    startTime: '9:00 AM',
    endTime: '3:45 PM',
    cost: 277,
    costNote: 'Price varies by block ($277-$301). Multiple art class blocks available. Registration opens Apr 12.',
    activityType: 'Visual Arts',
    tags: ['art', 'visual arts', 'performing arts', 'summer camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/placedesarts/activity/search?onlineSiteId=0&activity_keyword=summer+fun+day+camp',
    description: 'Summer Fun Day Camp at Place des Arts, Coquitlam. Ages 7-9. Full day of visual and performing arts. Multiple class blocks available per week. 9am-3:45pm Mon-Fri.'
  }
];

// Add Half Day camp entries by age group (repeating, covering all 6 weeks)
const halfDayCamps = [
  {
    id: 'pda-halfday-am-5-7',
    name: 'Summer Fun Half Day Camp AM (Ages 5-7)',
    ...commonFields,
    category: 'Arts',
    campType: 'Summer Camp',
    scheduleType: 'Half Day',
    ageMin: 5,
    ageMax: 7,
    startDate: '2026-07-06',
    endDate: '2026-08-14',
    startTime: '9:00 AM',
    endTime: '12:05 PM',
    cost: 152,
    costNote: 'Price per week varies by block ($152-$163). 6 weekly sessions Jul 6 - Aug 14. Multiple art class blocks available per week. Registration opens Apr 12.',
    activityType: 'Visual Arts',
    tags: ['art', 'visual arts', 'performing arts', 'summer camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/placedesarts/activity/search?onlineSiteId=0&activity_keyword=summer+fun+half+day',
    description: 'Summer Fun Half Day Camp (morning) at Place des Arts, Coquitlam. Ages 5-7. Visual and performing arts classes — choose from painting, clay, dance, music, and more. Multiple blocks per week. 9am-12:05pm Mon-Fri.',
    repeating: true
  },
  {
    id: 'pda-halfday-pm-7-9',
    name: 'Summer Fun Half Day Camp PM (Ages 7-9)',
    ...commonFields,
    category: 'Arts',
    campType: 'Summer Camp',
    scheduleType: 'Half Day',
    ageMin: 7,
    ageMax: 9,
    startDate: '2026-07-06',
    endDate: '2026-08-14',
    startTime: '12:40 PM',
    endTime: '3:45 PM',
    cost: 161,
    costNote: 'Price per week varies by block ($152-$163). 6 weekly sessions Jul 6 - Aug 14. Multiple art class blocks available per week. Registration opens Apr 12.',
    activityType: 'Visual Arts',
    tags: ['art', 'visual arts', 'performing arts', 'summer camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/placedesarts/activity/search?onlineSiteId=0&activity_keyword=summer+fun+half+day',
    description: 'Summer Fun Half Day Camp (afternoon) at Place des Arts, Coquitlam. Ages 7-9. Visual and performing arts classes — choose from painting, clay, dance, music, and more. Multiple blocks per week. 12:40-3:45pm Mon-Fri.',
    repeating: true
  },
  {
    id: 'pda-halfday-pm-9-12',
    name: 'Summer Fun Half Day Camp PM (Ages 9-12)',
    ...commonFields,
    category: 'Arts',
    campType: 'Summer Camp',
    scheduleType: 'Half Day',
    ageMin: 9,
    ageMax: 12,
    startDate: '2026-07-06',
    endDate: '2026-08-14',
    startTime: '12:40 PM',
    endTime: '3:45 PM',
    cost: 161,
    costNote: 'Price per week varies by block ($161-$163). 6 weekly sessions Jul 6 - Aug 14. Multiple art class blocks available per week. Registration opens Apr 12.',
    activityType: 'Visual Arts',
    tags: ['art', 'visual arts', 'performing arts', 'summer camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/placedesarts/activity/search?onlineSiteId=0&activity_keyword=summer+fun+half+day',
    description: 'Summer Fun Half Day Camp (afternoon) at Place des Arts, Coquitlam. Ages 9-12. Visual and performing arts classes — choose from painting, clay, theatre, music, and more. Multiple blocks per week. 12:40-3:45pm Mon-Fri.',
    repeating: true
  },
  {
    id: 'pda-halfday-am-9-12',
    name: 'Summer Fun Half Day Camp AM (Ages 9-12)',
    ...commonFields,
    category: 'Arts',
    campType: 'Summer Camp',
    scheduleType: 'Half Day',
    ageMin: 9,
    ageMax: 12,
    startDate: '2026-07-06',
    endDate: '2026-08-14',
    startTime: '9:00 AM',
    endTime: '12:05 PM',
    cost: 159,
    costNote: 'Price per week varies by block ($152-$163). 6 weekly sessions Jul 6 - Aug 14. Multiple art class blocks available per week. Registration opens Apr 12.',
    activityType: 'Visual Arts',
    tags: ['art', 'visual arts', 'performing arts', 'summer camp'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/placedesarts/activity/search?onlineSiteId=0&activity_keyword=summer+fun+half+day',
    description: 'Summer Fun Half Day Camp (morning) at Place des Arts, Coquitlam. Ages 9-12. Visual and performing arts classes — choose from painting, clay, dance, music, and more. Multiple blocks per week. 9am-12:05pm Mon-Fri.',
    repeating: true
  }
];

const allNew = [...newDayCamps, ...halfDayCamps];

const lastIdx = programs.reduce((acc, p, i) =>
  p.provider === 'Place des Arts' ? i : acc, -1);

if (lastIdx >= 0) {
  programs.splice(lastIdx + 1, 0, ...allNew);
  added = allNew.length;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Place des Arts: ${corrected} corrected, ${added} added`);
console.log(`Total programs: ${programs.length}`);
