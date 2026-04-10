/**
 * Collage Collage Audit Fix — 2026-04-09
 * Rank 231 in audit queue
 *
 * Browser-verified against:
 * - https://shop.collagecollage.ca/collections/classes-workshops
 * - https://shop.collagecollage.ca/products/summer-art-camp-2026-july-august
 * - https://shop.collagecollage.ca/products/in-person-mini-make-a-class-for-parent-and-child-3-5yrs
 *
 * Key changes:
 * - Spring Break entries (2492, collage-sb-pm): enrollmentStatus → "Completed"
 * - Mini MAKE (2494): updated to May sessions, price $125→$155, 5 sessions
 * - Address fix on collage-sb-pm: 4736 → 3697 Main Street
 * - Added Summer Art Camp 2026 AM + PM sessions
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;
let added = 0;

for (const p of programs) {
  if (p.provider !== 'Collage Collage') continue;

  const id = String(p.id);

  if (id === '2492') {
    // Spring Break AM — completed (past event)
    p.enrollmentStatus = 'Completed';
    p.status = 'Completed';
    corrected++;
  }

  if (id === 'collage-sb-pm') {
    // Spring Break PM — completed, fix address
    p.enrollmentStatus = 'Completed';
    p.status = 'Completed';
    p.address = '3697 Main St, Vancouver, BC V5V 3N6';
    p.lat = 49.2458;
    p.lng = -123.1008;
    p.postalCode = 'V5V 3N6';
    corrected++;
  }

  if (id === '2494') {
    // Mini MAKE — update to May sessions, new price
    p.name = 'IN PERSON Mini MAKE | Parent + Child Class (Ages 3-5)';
    p.startDate = '2026-05-02';
    p.endDate = '2026-05-30';
    p.cost = 155;
    p.costNote = '$155 for 5-session block (May). Classes are most often 4 sessions ($125), occasional 5-week sessions priced accordingly.';
    p.description = 'Saturday parent + child art class at Collage Collage. Ages 3-5. Mixed media art projects inspired by picture books. May sessions: 2/9/16/23/30. 10:15-11:00am. $155 for 5 sessions.';
    p.postalCode = 'V5V 3N6';
    corrected++;
  }
}

// Add Summer Art Camp 2026
const commonFields = {
  provider: 'Collage Collage',
  category: 'Arts',
  campType: 'Summer Camp',
  scheduleType: 'Activity',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Riley Park',
  address: '3697 Main St, Vancouver, BC V5V 3N6',
  postalCode: 'V5V 3N6',
  lat: 49.2458,
  lng: -123.1008,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: true,
  season: 'Summer 2026',
  days: 'Mon-Fri',
  ageMin: 6,
  ageMax: 10,
  activityType: 'Visual Arts',
  tags: ['art', 'painting', 'drawing', 'crafts', 'small class', 'summer camp'],
  urlVerified: true
};

const newPrograms = [
  {
    id: 'collage-summer-am',
    name: 'Summer Art Camp 2026 — AM Session (Ages 6-10)',
    ...commonFields,
    startDate: '2026-07-06',
    endDate: '2026-08-28',
    startTime: '9:30 AM',
    endTime: '12:00 PM',
    cost: 275,
    costNote: '$275/week (5-day), $225/week (4-day short week Aug 4-7). 8 kids max per session. All camps final sale. Session 7 (Aug 17-21) sold out.',
    durationPerDay: 2.5,
    dayLength: 'Single Day',
    enrollmentStatus: 'Open',
    registrationUrl: 'https://shop.collagecollage.ca/products/summer-art-camp-2026-july-august',
    description: 'Summer Art Camp at Collage Collage, Main Street. Ages 6-10. Small class (8 kids max). Paint, draw, build! Contemporary art projects. AM session 9:30am-12:00pm, Mon-Fri. 8 weekly sessions Jul 6 - Aug 28. 5-year-olds may attend if turning 6 and completed kindergarten.',
    repeating: true
  },
  {
    id: 'collage-summer-pm',
    name: 'Summer Art Camp 2026 — PM Session (Ages 6-10)',
    ...commonFields,
    startDate: '2026-07-06',
    endDate: '2026-08-14',
    startTime: '1:30 PM',
    endTime: '4:00 PM',
    cost: 275,
    costNote: '$275/week (5-day), $225/week (4-day short week Aug 4-7). 8 kids max per session. All camps final sale. PM available Sessions 1-3 (Jul 6-24), 5-6 (Aug 4-14) only.',
    durationPerDay: 2.5,
    dayLength: 'Single Day',
    enrollmentStatus: 'Open',
    registrationUrl: 'https://shop.collagecollage.ca/products/summer-art-camp-2026-july-august',
    description: 'Summer Art Camp at Collage Collage, Main Street. Ages 6-10. Small class (8 kids max). Paint, draw, build! Contemporary art projects. PM session 1:30-4:00pm, Mon-Fri. PM available select weeks Jul 6 - Aug 14.',
    repeating: true
  }
];

const lastIdx = programs.reduce((acc, p, i) =>
  p.provider === 'Collage Collage' ? i : acc, -1);

if (lastIdx >= 0) {
  programs.splice(lastIdx + 1, 0, ...newPrograms);
  added = newPrograms.length;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Collage Collage: ${corrected} corrected, ${added} added`);
console.log(`Total programs: ${programs.length}`);
