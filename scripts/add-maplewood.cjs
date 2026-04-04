const fs = require('fs');
const path = require('path');

const programsPath = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(programsPath, 'utf8'));

let nextId = 15845;

const provider = 'Maplewood Farm';
const address = '405 Seymour River Place, North Vancouver, BC V7H 1S4';
const lat = 49.3210;
const lng = -123.0155;
const neighbourhood = 'Maplewood';
const city = 'North Vancouver';
const regUrl = 'https://maplewoodfarm.bc.ca/things-to-do/farm-programs/';

// All current programs listed on the registration page (as of April 4 2026)
// Farm Camp Full Day: May 17, 18, 23 — $170.59 incl tax, ages 5+, 8:30am-3:30pm
// Farm Camp Half Day: May 30, June 7 — $73.11 incl tax, ages 5+, 8:30-11:30am
// Barnyard Buddies: Apr 26 - Jun 21 — $36.30 incl tax (1 adult + 1 child), ages 2-5 with adult
// Behind the Scenes: Apr 25 - Jun 28 — $36.30 incl tax, ages 5+ with adult
// Farm Felting Workshop: May 24, Jun 27 — $36.30 incl tax, ages 6+ with adult

const newPrograms = [
  // Farm Camp Full Day — single days in May (3 dates; use May 17 start, May 23 end)
  {
    id: nextId++,
    name: 'Farm Camp - Full Day (Ages 5+)',
    provider,
    category: 'Outdoor',
    campType: 'Day Camp',
    scheduleType: 'Full Day',
    ageMin: 5,
    ageMax: 14,
    startDate: '2026-05-17',
    endDate: '2026-05-23',
    days: 'Weekends',
    startTime: '8:30 AM',
    endTime: '3:30 PM',
    cost: 171, // $170.59 rounded
    costNote: '$170.59 incl. tax per child for 7-hour session. Multiple dates available May 17-23.',
    indoorOutdoor: 'Outdoor',
    neighbourhood,
    address,
    lat,
    lng,
    enrollmentStatus: 'Open',
    registrationUrl: regUrl,
    description: 'Full-day farm camp at Maplewood Farm for ages 5+. Children care for animals, complete farm-themed projects, feed animals, and learn about farm life. 7-hour immersive experience at this DNV-operated farm.',
    tags: ['farm', 'animals', 'nature', 'outdoor', 'farm camp'],
    activityType: 'Nature & Environment',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Full Day',
    season: 'Summer 2026',
    durationPerDay: 7,
    status: 'Open',
    urlVerified: true,
    city
  },
  // Farm Camp Half Day
  {
    id: nextId++,
    name: 'Farm Camp - Half Day (Ages 5+)',
    provider,
    category: 'Outdoor',
    campType: 'Day Camp',
    scheduleType: 'Half Day',
    ageMin: 5,
    ageMax: 14,
    startDate: '2026-05-30',
    endDate: '2026-06-07',
    days: 'Weekends',
    startTime: '8:30 AM',
    endTime: '11:30 AM',
    cost: 73, // $73.11 rounded
    costNote: '$73.11 incl. tax per child for 3-hour session. Dates: May 30 and June 7.',
    indoorOutdoor: 'Outdoor',
    neighbourhood,
    address,
    lat,
    lng,
    enrollmentStatus: 'Open',
    registrationUrl: regUrl,
    description: 'Half-day farm camp at Maplewood Farm for ages 5+. Kids get hands-on with animal care, farm chores, and farm-themed activities at this DNV-operated farm on the North Shore.',
    tags: ['farm', 'animals', 'nature', 'outdoor', 'farm camp'],
    activityType: 'Nature & Environment',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Half Day',
    season: 'Summer 2026',
    durationPerDay: 3,
    status: 'Open',
    urlVerified: true,
    city
  },
  // Barnyard Buddies — family program
  {
    id: nextId++,
    name: 'Barnyard Buddies (Ages 2-5 with Adult)',
    provider,
    category: 'Outdoor',
    campType: 'Class/Lesson',
    scheduleType: 'Half Day',
    ageMin: 2,
    ageMax: 5,
    startDate: '2026-04-26',
    endDate: '2026-06-21',
    days: 'Weekends',
    startTime: '9:30 AM',
    endTime: '11:00 AM',
    cost: 36, // $36.30
    costNote: '$36.30 incl. tax per adult+child pair. Multiple Sunday/Saturday dates April-June. Adult must accompany child.',
    indoorOutdoor: 'Outdoor',
    neighbourhood,
    address,
    lat,
    lng,
    enrollmentStatus: 'Open',
    registrationUrl: regUrl,
    description: 'Farm program for toddlers ages 2-5 with an adult. Each 1.5-hour session includes a farm-themed craft, story time, and gentle introduction to goat grooming and animal care. Multiple weekend dates available.',
    tags: ['farm', 'animals', 'toddler', 'family', 'nature'],
    activityType: 'Nature & Environment',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Half Day',
    season: 'Summer 2026',
    durationPerDay: 2,
    status: 'Open',
    urlVerified: true,
    city
  },
  // Behind the Scenes — family program
  {
    id: nextId++,
    name: 'Behind the Scenes Farm Tour (Ages 5+ with Adult)',
    provider,
    category: 'Outdoor',
    campType: 'Class/Lesson',
    scheduleType: 'Half Day',
    ageMin: 5,
    ageMax: 16,
    startDate: '2026-04-25',
    endDate: '2026-06-28',
    days: 'Weekends',
    startTime: '2:00 PM',
    endTime: '3:30 PM',
    cost: 36,
    costNote: '$36.30 incl. tax per adult+child pair. Multiple Saturday/Sunday dates April-June. Adult must accompany child.',
    indoorOutdoor: 'Outdoor',
    neighbourhood,
    address,
    lat,
    lng,
    enrollmentStatus: 'Open',
    registrationUrl: regUrl,
    description: 'Family farm program for ages 5+ with an adult at Maplewood Farm. Hands-on farm tasks: animal care, feeding, and farm life exploration. 1.5 hours per session, multiple weekend dates available April-June.',
    tags: ['farm', 'animals', 'family', 'nature', 'outdoor'],
    activityType: 'Nature & Environment',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Half Day',
    season: 'Summer 2026',
    durationPerDay: 2,
    status: 'Open',
    urlVerified: true,
    city
  },
];

console.log('Adding ' + newPrograms.length + ' Maplewood Farm programs (IDs ' + newPrograms[0].id + '-' + newPrograms[newPrograms.length-1].id + ')');

const combined = [...programs, ...newPrograms];
fs.writeFileSync(programsPath, JSON.stringify(combined, null, 2));
console.log('Written successfully. Total programs:', combined.length);
