const fs = require('fs');
const path = require('path');

const programsPath = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(programsPath, 'utf8'));

let nextId = 15876;

// Two locations:
// Spring Break (Completed): Collingwood School, West Vancouver
// NV Summer (weeks 1-4): Inter River Park, North Vancouver
// WV Summer (weeks 5-8): Ridgeview Elementary, West Vancouver

const provider = 'SportsWeek';

const springBreakWeeks = [
  { startDate: '2026-03-16', endDate: '2026-03-20', days: 'Mon-Fri', enrollmentStatus: 'Completed', season: 'Spring Break 2026', campType: 'Spring Break', durationPerDay: 7 },
  { startDate: '2026-03-23', endDate: '2026-03-27', days: 'Mon-Fri', enrollmentStatus: 'Completed', season: 'Spring Break 2026', campType: 'Spring Break', durationPerDay: 7 },
];

const nvSummerWeeks = [
  { startDate: '2026-07-06', endDate: '2026-07-10', label: 'Week One', regUrl: 'https://www.sportsweek.ca/event-details/sportsweek-july-6th-10th-2026' },
  { startDate: '2026-07-13', endDate: '2026-07-17', label: 'Week Two', regUrl: 'https://www.sportsweek.ca/event-details/sportsweek-july-13th-17th-2026' },
  { startDate: '2026-07-20', endDate: '2026-07-24', label: 'Week Three', regUrl: 'https://www.sportsweek.ca/event-details/sportsweek-july-20th-24th-2026' },
  { startDate: '2026-07-27', endDate: '2026-07-31', label: 'Week Four', regUrl: 'https://www.sportsweek.ca/event-details/sportsweek-july-27th-31st-2026' },
];

const wvSummerWeeks = [
  { startDate: '2026-08-04', endDate: '2026-08-07', label: 'Week Five', days: 'Tue-Fri', cost: 395, durationPerDay: 7, regUrl: 'https://www.sportsweek.ca/event-details/sportsweek-august-4th-7th-2026' },
  { startDate: '2026-08-10', endDate: '2026-08-14', label: 'Week Six', days: 'Mon-Fri', cost: 475, durationPerDay: 7, regUrl: 'https://www.sportsweek.ca/event-details/sportsweek-august-10th-14th-2026' },
  { startDate: '2026-08-17', endDate: '2026-08-21', label: 'Week Seven', days: 'Mon-Fri', cost: 475, durationPerDay: 7, regUrl: 'https://www.sportsweek.ca/event-details/sportsweek-august-17th-21st-2026' },
  { startDate: '2026-08-24', endDate: '2026-08-28', label: 'Week Eight', days: 'Mon-Fri', cost: 475, durationPerDay: 7, regUrl: 'https://www.sportsweek.ca/event-details/sportsweek-august-24th-28th-2026' },
];

const newPrograms = [];

// Spring Break (Collingwood School, West Vancouver — Completed)
for (const week of springBreakWeeks) {
  newPrograms.push({
    id: nextId++,
    name: `SportsWeek Multi-Sport Spring Break Camp (${week.startDate.slice(5, 10).replace('-', '/')})`,
    provider,
    category: 'Sports',
    campType: week.campType,
    scheduleType: 'Full Day',
    ageMin: 5,
    ageMax: 12,
    startDate: week.startDate,
    endDate: week.endDate,
    days: week.days,
    startTime: '8:30 AM',
    endTime: '3:30 PM',
    cost: null,
    costNote: 'Spring break 2026 has ended. Summer 2026 full weeks priced at $475 + tax. Check sportsweek.ca for future pricing.',
    indoorOutdoor: 'Both',
    neighbourhood: 'Dundarave',
    address: '70 Morven Dr, West Vancouver, BC V7S 1B3',
    lat: 49.3535,
    lng: -123.2060,
    enrollmentStatus: week.enrollmentStatus,
    registrationUrl: 'https://www.sportsweek.ca/book-now-northshore',
    description: 'Multi-sport spring break camp for ages 5-12 at Collingwood School, West Vancouver. Athletes rotate through pickleball, soccer, basketball, handball, trail adventures, and more. Daily sports choice model — kids pick morning and afternoon activities.',
    tags: ['multi-sport', 'sports camp', 'soccer', 'basketball', 'pickleball'],
    activityType: 'Multi-Sport',
    priceVerified: false,
    confirmed2026: true,
    dayLength: 'Full Day',
    season: week.season,
    durationPerDay: week.durationPerDay,
    status: week.enrollmentStatus,
    urlVerified: true,
    city: 'West Vancouver'
  });
}

// NV Summer (Inter River Park, North Vancouver)
for (const week of nvSummerWeeks) {
  newPrograms.push({
    id: nextId++,
    name: `SportsWeek Multi-Sport Summer Camp — ${week.label} (Inter River Park)`,
    provider,
    category: 'Sports',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 5,
    ageMax: 12,
    startDate: week.startDate,
    endDate: week.endDate,
    days: 'Mon-Fri',
    startTime: '8:30 AM',
    endTime: '3:30 PM',
    cost: 475,
    costNote: '$475 + tax per week.',
    indoorOutdoor: 'Both',
    neighbourhood: 'Deep Cove',
    address: '1 Inter River Park Rd, North Vancouver, BC V7J 2H3',
    lat: 49.3260,
    lng: -122.9560,
    enrollmentStatus: 'Open',
    registrationUrl: week.regUrl,
    description: 'Week-long multi-sport summer camp for ages 5-12 at Inter River Park, North Vancouver. Athletes rotate through pickleball, soccer, basketball, handball, and trail adventures. Kids choose their own morning and afternoon sports — new sport every rotation.',
    tags: ['multi-sport', 'sports camp', 'soccer', 'basketball', 'pickleball', 'trail'],
    activityType: 'Multi-Sport',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Full Day',
    season: 'Summer 2026',
    durationPerDay: 7,
    status: 'Open',
    urlVerified: true,
    city: 'North Vancouver'
  });
}

// WV Summer (Ridgeview Elementary, West Vancouver)
for (const week of wvSummerWeeks) {
  newPrograms.push({
    id: nextId++,
    name: `SportsWeek Multi-Sport Summer Camp — ${week.label} (West Vancouver)`,
    provider,
    category: 'Sports',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 5,
    ageMax: 12,
    startDate: week.startDate,
    endDate: week.endDate,
    days: week.days,
    startTime: '8:30 AM',
    endTime: '3:30 PM',
    cost: week.cost,
    costNote: week.cost === 395 ? '$395 + tax for 4-day week (BC Day Monday excluded, Tue-Fri).' : '$475 + tax per week.',
    indoorOutdoor: 'Both',
    neighbourhood: 'Ambleside',
    address: '1250 Mathers Ave, West Vancouver, BC V7T 2G3',
    lat: 49.3410,
    lng: -123.2000,
    enrollmentStatus: 'Open',
    registrationUrl: week.regUrl,
    description: 'Week-long multi-sport summer camp for ages 5-12 at Ridgeview Elementary School, West Vancouver. Athletes rotate through pickleball, soccer, basketball, handball, and trail adventures. Kids choose their own morning and afternoon sports each day.',
    tags: ['multi-sport', 'sports camp', 'soccer', 'basketball', 'pickleball'],
    activityType: 'Multi-Sport',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Full Day',
    season: 'Summer 2026',
    durationPerDay: week.durationPerDay,
    status: 'Open',
    urlVerified: true,
    city: 'West Vancouver'
  });
}

console.log('Adding ' + newPrograms.length + ' SportsWeek programs (IDs ' + newPrograms[0].id + '-' + newPrograms[newPrograms.length-1].id + ')');

const combined = [...programs, ...newPrograms];
fs.writeFileSync(programsPath, JSON.stringify(combined, null, 2));
console.log('Written successfully. Total programs:', combined.length);
