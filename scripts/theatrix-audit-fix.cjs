/**
 * Theatrix Youtheatre Society Audit Fix — 2026-04-09
 * Rank 225 in audit queue
 *
 * Browser-verified against:
 * - https://theatrixyoutheatre.com/theatre-classes-and-camps/
 *
 * Key changes:
 * - As You Wish Performance Camp (653): enrollmentStatus → "Waitlist" (waitlist full)
 * - As You Wish Play Camp (655): enrollmentStatus → "Waitlist"
 * - Spamalot Performance Camp (654): enrollmentStatus → "Open"
 * - Spamalot Play Camp (656): enrollmentStatus → "Open"
 * - Updated descriptions to be program-specific
 * - Added registrationUrl to registration page
 * - Added 3 missing Port Coquitlam camps (Charlotte's Web, Tangled, Shrek)
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;
let added = 0;

// Fix existing entries
for (const p of programs) {
  if (p.provider !== 'Theatrix Youtheatre Society') continue;

  if (Number(p.id) === 653) {
    // Performance Camp As You Wish — Waitlist Full
    p.enrollmentStatus = 'Waitlist';
    p.status = 'Waitlist';
    p.description = 'Musical theatre performance camp at Coquitlam Presbyterian Church. Ages 7-13 (7-year-olds should have experience). Students learn acting through games, exercises, improv, and rehearsals creating a mini-musical of As You Wish. Learn movement, voice, and character building. Performance for family Jul 24 at 3:00 PM. 9:30 AM-3:30 PM. $199/week.';
    p.registrationUrl = 'https://theatrixyoutheatre.com/classes-camps-intro/';
    corrected++;
  }

  if (Number(p.id) === 654) {
    // Performance Camp Spamalot — Open
    p.enrollmentStatus = 'Open';
    p.status = 'Open';
    p.description = 'Musical theatre performance camp at Coquitlam Presbyterian Church. Ages 7-13 (7-year-olds should have experience). Students learn acting through games, exercises, improv, and rehearsals creating a mini-musical of Spamalot. Learn movement, voice, and character building. Performance for family Aug 21 at 3:00 PM. 9:30 AM-3:30 PM. $199/week.';
    p.registrationUrl = 'https://theatrixyoutheatre.com/classes-camps-intro/';
    corrected++;
  }

  if (Number(p.id) === 655) {
    // Play Camp As You Wish — Waitlist
    p.enrollmentStatus = 'Waitlist';
    p.status = 'Waitlist';
    p.description = 'Musical theatre play camp at Coquitlam Presbyterian Church. Ages 5-7 (5-year-olds must have completed Kindergarten). Less rehearsal time than Performance Camp, more structured play with masks, music, and movement games. Join Performance Campers for big musical numbers in As You Wish. Performance for family Jul 24 at 3:00 PM. 9:30 AM-3:30 PM. $199/week.';
    p.registrationUrl = 'https://theatrixyoutheatre.com/classes-camps-intro/';
    corrected++;
  }

  if (Number(p.id) === 656) {
    // Play Camp Spamalot — Open
    p.enrollmentStatus = 'Open';
    p.status = 'Open';
    p.description = 'Musical theatre play camp at Coquitlam Presbyterian Church. Ages 5-7 (5-year-olds must have completed Kindergarten). Less rehearsal time than Performance Camp, more structured play with masks, music, and movement games. Join Performance Campers for big musical numbers in Spamalot. Performance for family Aug 21 at 3:00 PM. 9:30 AM-3:30 PM. $199/week.';
    p.registrationUrl = 'https://theatrixyoutheatre.com/classes-camps-intro/';
    corrected++;
  }
}

// Port Coquitlam camps — partnership with City of Port Coquitlam
const pococCommon = {
  provider: 'Theatrix Youtheatre Society',
  category: 'Arts',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  days: 'Mon-Fri',
  startTime: '9:00 AM',
  endTime: '3:30 PM',
  indoorOutdoor: 'Indoor',
  city: 'Port Coquitlam',
  neighbourhood: 'Port Coquitlam',
  enrollmentStatus: 'Coming Soon',
  registrationDate: '2026-05-12',
  tags: ['theatre', 'musical', 'performing arts', 'musical theatre'],
  activityType: 'Theatre & Drama',
  priceVerified: true,
  confirmed2026: true,
  season: 'Summer 2026'
};

const newEntries = [
  {
    id: 'theatrix-poco-charlottes-web',
    name: "Musical Theatre Camp: Charlotte's Web",
    ...pococCommon,
    ageMin: 5,
    ageMax: 7,
    startDate: '2026-07-13',
    endDate: '2026-07-17',
    cost: 230,
    address: '2150 Wilson Ave, Port Coquitlam, BC V3C 6B2',
    postalCode: 'V3C 6B2',
    lat: 49.2620,
    lng: -122.7710,
    registrationUrl: 'https://theatrixyoutheatre.com/theatre-classes-and-camps/',
    costNote: '$230 per week. Registration opens May 12 for PoCo residents, May 15 for non-residents. Presented in partnership with City of Port Coquitlam.',
    description: "Musical theatre camp at Outlet Workroom, Port Coquitlam Community Centre. Ages 5-7. Sing, dance and act in a mini-musical of Charlotte's Web. Acting games, exercises, and rehearsals with performance for family on last day. Includes daily walks and play at the park. 9:00 AM-3:30 PM. Course #127423."
  },
  {
    id: 'theatrix-poco-tangled',
    name: 'Musical Theatre Camp: Tangled',
    ...pococCommon,
    ageMin: 8,
    ageMax: 12,
    startDate: '2026-07-27',
    endDate: '2026-07-31',
    cost: 230,
    address: '2150 Wilson Ave, Port Coquitlam, BC V3C 6B2',
    postalCode: 'V3C 6B2',
    lat: 49.2620,
    lng: -122.7710,
    registrationUrl: 'https://theatrixyoutheatre.com/theatre-classes-and-camps/',
    costNote: '$230 per week. Registration opens May 12 for PoCo residents, May 15 for non-residents. Includes swimming at PCCC leisure pool. Presented in partnership with City of Port Coquitlam.',
    description: 'Musical theatre camp at PCCC JB Young Room, Port Coquitlam Community Centre. Ages 8-12. Sing, dance and act in a mini-musical of Tangled. Acting games, exercises, and rehearsals with performance for family on last day. Includes daily walks, park play, and swimming at PCCC leisure pool. 9:00 AM-3:30 PM. Course #127411.'
  },
  {
    id: 'theatrix-poco-shrek',
    name: 'Musical Theatre Camp: Shrek',
    ...pococCommon,
    ageMin: 8,
    ageMax: 12,
    startDate: '2026-08-24',
    endDate: '2026-08-28',
    cost: 230,
    address: '2150 Wilson Ave, Port Coquitlam, BC V3C 6B2',
    postalCode: 'V3C 6B2',
    lat: 49.2620,
    lng: -122.7710,
    registrationUrl: 'https://theatrixyoutheatre.com/theatre-classes-and-camps/',
    costNote: '$230 per week. Registration opens May 12 for PoCo residents, May 15 for non-residents. Includes swimming at PCCC leisure pool. Presented in partnership with City of Port Coquitlam.',
    description: 'Musical theatre camp at PCCC JB Young Room, Port Coquitlam Community Centre. Ages 8-12. Sing, dance and act in a mini-musical of Shrek. Acting games, exercises, and rehearsals with performance for family on last day. Includes daily walks, park play, and swimming at PCCC leisure pool. 9:00 AM-3:30 PM. Course #127418.'
  }
];

// Insert after last Theatrix entry
const lastIdx = programs.reduce((acc, p, i) =>
  p.provider === 'Theatrix Youtheatre Society' ? i : acc, -1);

if (lastIdx >= 0) {
  programs.splice(lastIdx + 1, 0, ...newEntries);
  added = newEntries.length;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Theatrix Youtheatre Society: ${corrected} corrected, ${added} added`);
console.log(`Total programs: ${programs.length}`);
