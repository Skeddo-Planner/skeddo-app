const fs = require('fs');
const path = require('path');

const programsPath = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(programsPath, 'utf8'));

let nextId = 15790;

const address = '140-2270 Dollarton Hwy, North Vancouver, BC V7H 1A8';
const lat = 49.3180;
const lng = -122.9500;
const neighbourhood = 'Deep Cove';
const city = 'North Vancouver';
const provider = 'The Hive Climbing';

// Spring Break: March 16-20 and March 23-27 (both Completed as of April 4)
// Summer: 9 weeks (Jun 29, Jul 6, Jul 13, Jul 20, Jul 27, Aug 3, Aug 10, Aug 17, Aug 24)
// They run on stat holidays Jul 1 and Aug 3

const springBreakWeeks = [
  { startDate: '2026-03-16', endDate: '2026-03-20', enrollmentStatus: 'Completed', campType: 'Spring Break', season: 'Spring Break 2026' },
  { startDate: '2026-03-23', endDate: '2026-03-27', enrollmentStatus: 'Completed', campType: 'Spring Break', season: 'Spring Break 2026' },
];

const summerWeeks = [
  { startDate: '2026-06-29', endDate: '2026-07-03', enrollmentStatus: 'Open', campType: 'Summer Camp', season: 'Summer 2026' },
  { startDate: '2026-07-06', endDate: '2026-07-10', enrollmentStatusJuniors: 'Waitlist', enrollmentStatusInters: 'Open', campType: 'Summer Camp', season: 'Summer 2026' },
  { startDate: '2026-07-13', endDate: '2026-07-17', enrollmentStatus: 'Open', campType: 'Summer Camp', season: 'Summer 2026' },
  { startDate: '2026-07-20', endDate: '2026-07-24', enrollmentStatus: 'Open', campType: 'Summer Camp', season: 'Summer 2026' },
  { startDate: '2026-07-27', endDate: '2026-07-31', enrollmentStatus: 'Open', campType: 'Summer Camp', season: 'Summer 2026' },
  { startDate: '2026-08-03', endDate: '2026-08-07', enrollmentStatus: 'Open', campType: 'Summer Camp', season: 'Summer 2026' },
  { startDate: '2026-08-10', endDate: '2026-08-14', enrollmentStatusJuniors: 'Waitlist', enrollmentStatusInters: 'Open', campType: 'Summer Camp', season: 'Summer 2026' },
  { startDate: '2026-08-17', endDate: '2026-08-21', enrollmentStatus: 'Open', campType: 'Summer Camp', season: 'Summer 2026' },
  { startDate: '2026-08-24', endDate: '2026-08-28', enrollmentStatus: 'Open', campType: 'Summer Camp', season: 'Summer 2026' },
];

const juniorRegUrlSpring = 'https://app.rockgympro.com/b/widget/?a=offering&offering_guid=acecbe7e64ac4759860b95a873616126&widget_guid=27362b193418402f83d637ea5ac267b1&iframeid=&mode=p';
const intersRegUrlSpring = 'https://app.rockgympro.com/b/widget/?a=offering&offering_guid=001c05cc478c432187be45355cd106eb&widget_guid=27362b193418402f83d637ea5ac267b1&iframeid=&mode=p';
const juniorRegUrlSummer = 'https://app.rockgympro.com/b/widget/?a=offering&offering_guid=1a70718db6034985b9fb171a208ce60b&widget_guid=f1dcb82d0e2a4bac941fcc43a0d78236&iframeid=&mode=p';
const intersRegUrlSummer = 'https://app.rockgympro.com/b/widget/?a=offering&offering_guid=68ab660dcdff41319bc78f076ceec443&widget_guid=f1dcb82d0e2a4bac941fcc43a0d78236&iframeid=&mode=p';

const newPrograms = [];

// Spring break - Juniors and Inters
for (const week of springBreakWeeks) {
  // Juniors (6-8)
  newPrograms.push({
    id: nextId++,
    name: 'Youth Climbing Spring Break Camp - Juniors (Ages 6-8)',
    provider,
    category: 'Sports',
    campType: week.campType,
    scheduleType: 'Full Day',
    ageMin: 6,
    ageMax: 8,
    startDate: week.startDate,
    endDate: week.endDate,
    days: 'Mon-Fri',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    cost: 475,
    indoorOutdoor: 'Indoor',
    neighbourhood,
    address,
    lat,
    lng,
    enrollmentStatus: week.enrollmentStatus,
    registrationUrl: juniorRegUrlSpring,
    description: 'Youth climbing camp for ages 6-8 at The Hive North Shore. Full-day camp with climbing, games and off-site activities at nearby parks. No prior experience needed — rental shoes provided.',
    tags: ['climbing', 'bouldering', 'youth camp', 'rock climbing'],
    activityType: 'Climbing',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Full Day',
    season: week.season,
    durationPerDay: 7,
    status: week.enrollmentStatus,
    urlVerified: true,
    city
  });
  // Inters (9-12)
  newPrograms.push({
    id: nextId++,
    name: 'Youth Climbing Spring Break Camp - Inters (Ages 9-12)',
    provider,
    category: 'Sports',
    campType: week.campType,
    scheduleType: 'Full Day',
    ageMin: 9,
    ageMax: 12,
    startDate: week.startDate,
    endDate: week.endDate,
    days: 'Mon-Fri',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    cost: 475,
    indoorOutdoor: 'Indoor',
    neighbourhood,
    address,
    lat,
    lng,
    enrollmentStatus: week.enrollmentStatus,
    registrationUrl: intersRegUrlSpring,
    description: 'Youth climbing camp for ages 9-12 at The Hive North Shore. Full-day camp blending climbing instruction with outdoor activities at local parks. All skill levels welcome — rental shoes provided.',
    tags: ['climbing', 'bouldering', 'youth camp', 'rock climbing'],
    activityType: 'Climbing',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Full Day',
    season: week.season,
    durationPerDay: 7,
    status: week.enrollmentStatus,
    urlVerified: true,
    city
  });
}

// Summer - Juniors and Inters
for (const week of summerWeeks) {
  const juniorStatus = week.enrollmentStatusJuniors || week.enrollmentStatus;
  const intersStatus = week.enrollmentStatusInters || week.enrollmentStatus;

  newPrograms.push({
    id: nextId++,
    name: 'Youth Climbing Summer Camp - Juniors (Ages 6-8)',
    provider,
    category: 'Sports',
    campType: week.campType,
    scheduleType: 'Full Day',
    ageMin: 6,
    ageMax: 8,
    startDate: week.startDate,
    endDate: week.endDate,
    days: 'Mon-Fri',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    cost: 475,
    indoorOutdoor: 'Indoor',
    neighbourhood,
    address,
    lat,
    lng,
    enrollmentStatus: juniorStatus,
    registrationUrl: juniorRegUrlSummer,
    description: 'Youth climbing summer camp for ages 6-8 at The Hive North Shore. Week-long full-day camp: ~2/3 climbing at the gym, ~1/3 at nearby parks. Rental shoes provided. Camp runs on stat holidays.',
    tags: ['climbing', 'bouldering', 'youth camp', 'rock climbing', 'summer camp'],
    activityType: 'Climbing',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Full Day',
    season: week.season,
    durationPerDay: 7,
    status: juniorStatus,
    urlVerified: true,
    city
  });

  newPrograms.push({
    id: nextId++,
    name: 'Youth Climbing Summer Camp - Inters (Ages 9-12)',
    provider,
    category: 'Sports',
    campType: week.campType,
    scheduleType: 'Full Day',
    ageMin: 9,
    ageMax: 12,
    startDate: week.startDate,
    endDate: week.endDate,
    days: 'Mon-Fri',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    cost: 475,
    indoorOutdoor: 'Indoor',
    neighbourhood,
    address,
    lat,
    lng,
    enrollmentStatus: intersStatus,
    registrationUrl: intersRegUrlSummer,
    description: 'Youth climbing summer camp for ages 9-12 at The Hive North Shore. Week-long full-day camp: ~2/3 climbing at the gym, ~1/3 at nearby parks. All levels welcome — rental shoes provided.',
    tags: ['climbing', 'bouldering', 'youth camp', 'rock climbing', 'summer camp'],
    activityType: 'Climbing',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Full Day',
    season: week.season,
    durationPerDay: 7,
    status: intersStatus,
    urlVerified: true,
    city
  });
}

console.log('Adding ' + newPrograms.length + ' Hive Climbing programs (IDs ' + newPrograms[0].id + '-' + newPrograms[newPrograms.length-1].id + ')');

const combined = [...programs, ...newPrograms];
fs.writeFileSync(programsPath, JSON.stringify(combined, null, 2));
console.log('Written successfully. Total programs:', combined.length);
