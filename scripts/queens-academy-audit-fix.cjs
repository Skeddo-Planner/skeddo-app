/**
 * Queen's Academy Audit Fix — 2026-04-09
 * Rank 226 in audit queue
 *
 * Browser-verified against:
 * - https://www.queensacademy.ca/summer-camps
 *
 * Key changes:
 * - Location corrected: 3355 North Rd → Halpern Centre, SFU Burnaby (V5A 1S6)
 * - ID 666 mapped to Wild Things (Jul 13-17, ages 6-11, $420)
 * - IDs 665, 667, 668: weeks don't exist in 2026, kept as confirmed2026=false
 * - Added 5 new camps: Ratatouille, Oz (4-6), Oz (6-11), K-POP, Black Youth
 * - Prices updated: $420/week full day, $225/week half day (GST included)
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;
let added = 0;

const halpernCommon = {
  provider: "Queen's Academy",
  category: 'Arts',
  campType: 'Summer Camp',
  days: 'Mon-Fri',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Burnaby Mountain',
  address: 'Halpern Centre, SFU Burnaby, 8888 University Dr, Burnaby, BC V5A 1S6',
  postalCode: 'V5A 1S6',
  lat: 49.2781,
  lng: -122.9199,
  city: 'Burnaby',
  tags: ['musical theatre', 'performing arts', 'theatre', 'dance', 'singing'],
  activityType: 'Musical Theatre',
  enrollmentStatus: 'Open',
  priceVerified: true,
  confirmed2026: true,
  season: 'Summer 2026'
};

for (const p of programs) {
  if (p.provider !== "Queen's Academy") continue;

  if (Number(p.id) === 666) {
    // Map to Wild Things (Jul 13-17, Ages 6-11, $420)
    p.name = 'Summer Camp: Wild Things';
    p.ageMin = 6;
    p.ageMax = 11;
    p.startDate = '2026-07-13';
    p.endDate = '2026-07-17';
    p.startTime = '9:00 AM';
    p.endTime = '5:00 PM';
    p.cost = 420;
    p.costNote = '$420/week (GST included). Payment via Interac E-Transfer within 24 hours. Subsidy program available.';
    p.address = halpernCommon.address;
    p.postalCode = halpernCommon.postalCode;
    p.neighbourhood = halpernCommon.neighbourhood;
    p.lat = halpernCommon.lat;
    p.lng = halpernCommon.lng;
    p.enrollmentStatus = 'Open';
    p.confirmed2026 = true;
    p.priceVerified = true;
    p.registrationUrl = 'https://www.queensacademy.ca/event-details/jul-13-17-summer-camp-wild-things-ages-6-11/form';
    p.description = 'Musical theatre performance camp at Halpern Centre, SFU Burnaby. Ages 6-11. Singing, dancing, acting, storytelling, drama games, and script rehearsal. Mini musical production of Wild Things on Friday at 5pm (10 min show). Daily outdoor play. $420/week (GST incl).';
    delete p.isEstimate;
    delete p.urlVerified;
    corrected++;
  }

  // IDs 665, 667, 668: these July weeks don't exist in 2026
  if ([665, 667, 668].includes(Number(p.id))) {
    p.address = halpernCommon.address;
    p.postalCode = halpernCommon.postalCode;
    p.neighbourhood = halpernCommon.neighbourhood;
    p.lat = halpernCommon.lat;
    p.lng = halpernCommon.lng;
    p.costNote = 'Prior year estimate. This specific week does NOT appear on the 2026 summer camp schedule.';
    p.ageSpanJustified = 'Prior year estimate — 2026 camps use specific age bands (4-6, 6-11, 9-14).';
    delete p.urlVerified;
    corrected++;
  }
}

// New camps
const newEntries = [
  {
    id: 'qa-ratatouille-6-11',
    name: 'Summer Camp: Ratatouille',
    ...halpernCommon,
    scheduleType: 'Full Day',
    ageMin: 6,
    ageMax: 11,
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    cost: 420,
    costNote: '$420/week (GST included). Payment via Interac E-Transfer within 24 hours. Subsidy program available.',
    registrationUrl: 'https://www.queensacademy.ca/event-details/aug-10-14-summer-camp-ratatouille-ages-6-11/form',
    description: 'Musical theatre performance camp at Halpern Centre, SFU Burnaby. Ages 6-11. Singing, dancing, acting, storytelling, drama games, and script rehearsal. Mini musical production of Ratatouille on Friday at 5pm (10 min show). Daily outdoor play. $420/week (GST incl).'
  },
  {
    id: 'qa-oz-4-6',
    name: 'Summer Camp: Oz (Ages 4-6)',
    ...halpernCommon,
    scheduleType: 'Half Day',
    ageMin: 4,
    ageMax: 6,
    startDate: '2026-08-17',
    endDate: '2026-08-21',
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    cost: 225,
    costNote: '$225/week half day (GST included). Payment via Interac E-Transfer within 24 hours. Subsidy program available.',
    registrationUrl: 'https://www.queensacademy.ca/event-details/aug-17-21-summer-camp-oz-ages-4-6/form',
    description: 'Musical theatre performance camp at Halpern Centre, SFU Burnaby. Ages 4-6 (half day 9am-12pm). Singing, dancing, acting, storytelling, drama games. Mini musical production of Oz on Friday at 5pm (10 min show). Daily outdoor play. $225/week (GST incl).'
  },
  {
    id: 'qa-oz-6-11',
    name: 'Summer Camp: Oz (Ages 6-11)',
    ...halpernCommon,
    scheduleType: 'Full Day',
    ageMin: 6,
    ageMax: 11,
    startDate: '2026-08-17',
    endDate: '2026-08-21',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    cost: 420,
    costNote: '$420/week (GST included). Payment via Interac E-Transfer within 24 hours. Subsidy program available.',
    registrationUrl: 'https://www.queensacademy.ca/event-details/aug-17-21-summer-camp-oz-ages-6-11/form',
    description: 'Musical theatre performance camp at Halpern Centre, SFU Burnaby. Ages 6-11. Singing, dancing, acting, storytelling, drama games, and script rehearsal. Mini musical production of Oz on Friday at 5pm (10 min show). Daily outdoor play. $420/week (GST incl).'
  },
  {
    id: 'qa-kpop-6-11',
    name: 'Summer Camp: K-POP',
    ...halpernCommon,
    scheduleType: 'Full Day',
    ageMin: 6,
    ageMax: 11,
    startDate: '2026-08-24',
    endDate: '2026-08-28',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    cost: 420,
    costNote: '$420/week (GST included). Payment via Interac E-Transfer within 24 hours. Subsidy program available.',
    registrationUrl: 'https://www.queensacademy.ca/event-details/aug-24-28-summer-camp-k-pop-ages-6-11/form',
    description: 'Musical theatre performance camp at Halpern Centre, SFU Burnaby. Ages 6-11. K-POP themed week with singing, dancing, acting, storytelling, drama games. Mini musical production on Friday at 5pm (10 min show). Daily outdoor play. $420/week (GST incl).'
  },
  {
    id: 'qa-black-youth-camp',
    name: 'Black Youth Summer Camp',
    provider: "Queen's Academy",
    category: 'Arts',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    days: 'Mon-Fri',
    indoorOutdoor: 'Indoor',
    neighbourhood: 'Burnaby',
    address: 'Royals Community Centre, Burnaby, BC',
    city: 'Burnaby',
    ageMin: 9,
    ageMax: 14,
    startDate: '2026-08-31',
    endDate: '2026-09-04',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    cost: null,
    costNote: 'Subsidized for Black youth. Subsidy pending — contact queensacademy@hotmail.com for details.',
    tags: ['musical theatre', 'performing arts', 'theatre', 'BIPOC', 'Black youth'],
    activityType: 'Musical Theatre',
    enrollmentStatus: 'Open',
    priceVerified: false,
    confirmed2026: true,
    season: 'Summer 2026',
    registrationUrl: 'https://www.queensacademy.ca/event-details/black-youth-summer-camp-ages-9-14/form',
    description: 'Black Youth musical theatre summer camp at Royals Community Centre, Burnaby. Ages 9-14. Singing, dancing, acting, drama games, and mini musical production. Subsidized for Black youth through BIPOC programs. 9am-3pm. Presented by Queen\'s Academy.'
  }
];

const lastIdx = programs.reduce((acc, p, i) =>
  p.provider === "Queen's Academy" ? i : acc, -1);

if (lastIdx >= 0) {
  programs.splice(lastIdx + 1, 0, ...newEntries);
  added = newEntries.length;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Queen's Academy: ${corrected} corrected, ${added} added`);
console.log(`Total programs: ${programs.length}`);
