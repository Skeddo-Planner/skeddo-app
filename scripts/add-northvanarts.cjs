const fs = require('fs');
const path = require('path');

const programsPath = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(programsPath, 'utf8'));

let nextId = 15867;

const provider = 'North Van Arts';
const address = '399 Seymour River Pl, North Vancouver, BC V7H 1S6';
const lat = 49.3210;
const lng = -123.0155;
const neighbourhood = 'Maplewood';
const city = 'North Vancouver';

const camps = [
  { name: 'Camp Creative: Spring Break Week 1 (Mar 16-20)', startDate: '2026-03-16', endDate: '2026-03-20', campType: 'Spring Break', season: 'Spring Break 2026', enrollmentStatus: 'Completed', registrationUrl: 'https://www.showpass.com/camp-creative-spring-break-week-1/' },
  { name: 'Camp Creative: Spring Break Week 2 (Mar 23-27)', startDate: '2026-03-23', endDate: '2026-03-27', campType: 'Spring Break', season: 'Spring Break 2026', enrollmentStatus: 'Completed', registrationUrl: 'https://www.showpass.com/camp-creative-spring-break-week-2/' },
  { name: 'Camp Creative: Summer Break July 6-10', startDate: '2026-07-06', endDate: '2026-07-10', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open', registrationUrl: 'https://www.showpass.com/camp-creative-summer-break-july-6-10-2026/' },
  { name: 'Camp Creative: Summer Break July 13-17', startDate: '2026-07-13', endDate: '2026-07-17', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open', registrationUrl: 'https://www.showpass.com/o/north-van-arts/' },
  { name: 'Camp Creative: Summer Break July 20-24', startDate: '2026-07-20', endDate: '2026-07-24', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open', registrationUrl: 'https://www.showpass.com/o/north-van-arts/' },
  { name: 'Camp Creative: Summer Break July 27-31', startDate: '2026-07-27', endDate: '2026-07-31', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open', registrationUrl: 'https://www.showpass.com/o/north-van-arts/' },
  { name: 'Camp Creative: Summer Break August 10-14', startDate: '2026-08-10', endDate: '2026-08-14', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open', registrationUrl: 'https://www.showpass.com/o/north-van-arts/' },
  { name: 'Camp Creative: Summer Break August 17-21', startDate: '2026-08-17', endDate: '2026-08-21', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open', registrationUrl: 'https://www.showpass.com/o/north-van-arts/' },
  { name: 'Camp Creative: Summer Break August 24-28', startDate: '2026-08-24', endDate: '2026-08-28', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open', registrationUrl: 'https://www.showpass.com/o/north-van-arts/' },
];

const newPrograms = camps.map(camp => ({
  id: nextId++,
  name: camp.name,
  provider,
  category: 'Arts',
  campType: camp.campType,
  scheduleType: 'Full Day',
  ageMin: 6,
  ageMax: 11,
  startDate: camp.startDate,
  endDate: camp.endDate,
  days: 'Mon-Fri',
  startTime: '8:30 AM',
  endTime: '3:30 PM',
  cost: 395,
  indoorOutdoor: 'Both',
  neighbourhood,
  address,
  lat,
  lng,
  enrollmentStatus: camp.enrollmentStatus,
  registrationUrl: camp.registrationUrl,
  description: 'Creative arts camp for kids aged 6-11 at Maplewood House, nestled in the trees next to the Seymour River. Campers explore visual arts, drama, music, textile arts, and nature-based projects with professional instructors. Max 12 participants per week.',
  tags: ['art', 'arts camp', 'creative arts', 'drama', 'music', 'nature', 'visual arts'],
  activityType: 'Arts & Crafts',
  priceVerified: true,
  confirmed2026: true,
  dayLength: 'Full Day',
  season: camp.season,
  durationPerDay: 7,
  status: camp.enrollmentStatus,
  urlVerified: true,
  city
}));

console.log('Adding ' + newPrograms.length + ' North Van Arts programs (IDs ' + newPrograms[0].id + '-' + newPrograms[newPrograms.length-1].id + ')');

const combined = [...programs, ...newPrograms];
fs.writeFileSync(programsPath, JSON.stringify(combined, null, 2));
console.log('Written successfully. Total programs:', combined.length);
