const fs = require('fs');
const path = require('path');

const programsPath = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(programsPath, 'utf8'));

let nextId = 15750;

const locations = [
  {
    neighbourhood: 'Edgemont Village',
    address: '1058 Ridgewood Dr, North Vancouver, BC V7R 1H8',
    lat: 49.3680,
    lng: -123.1090,
    registrationUrl: 'https://manage.myregistersplus.com/studentapplication_form/workshop-application-full.php?cd=73104&id=31&f1d=649'
  },
  {
    neighbourhood: 'Lynn Valley',
    address: '630 19th St E, North Vancouver, BC V7L 3A1',
    lat: 49.3285,
    lng: -123.0240,
    registrationUrl: 'https://manage.myregistersplus.com/studentapplication_form/workshop-application-full.php?cd=73104&id=31&f1d=1297'
  }
];

const halfDayCamps = [
  { name: 'Musical Theatre Half Day Camp: KPop Kids (Spring Break)', startDate: '2026-03-16', endDate: '2026-03-20', days: 'Mon-Fri', campType: 'Spring Break', season: 'Spring Break 2026', enrollmentStatus: 'Completed' },
  { name: 'Musical Theatre Half Day Camp: Under the Sea (Spring Break)', startDate: '2026-03-23', endDate: '2026-03-27', days: 'Mon-Fri', campType: 'Spring Break', season: 'Spring Break 2026', enrollmentStatus: 'Completed' },
  { name: 'Musical Theatre Half Day Camp: Rainbow Unicorns', startDate: '2026-07-06', endDate: '2026-07-10', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: 'Musical Theatre Half Day Camp: Zoo-tastic Movies', startDate: '2026-07-13', endDate: '2026-07-17', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: 'Musical Theatre Half Day Camp: Movie Night Minis', startDate: '2026-07-20', endDate: '2026-07-24', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: 'Musical Theatre Half Day Camp: Frozen', startDate: '2026-07-27', endDate: '2026-07-31', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: 'Musical Theatre Half Day Camp: Trolls & Friends (4-Day)', startDate: '2026-08-04', endDate: '2026-08-07', days: 'Tue-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: 'Musical Theatre Half Day Camp: Musical Magic Kingdom', startDate: '2026-08-10', endDate: '2026-08-14', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: 'Musical Theatre Half Day Camp: Raining Cats & Dogs', startDate: '2026-08-17', endDate: '2026-08-21', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: 'Musical Theatre Half Day Camp: KPop Kids', startDate: '2026-08-24', endDate: '2026-08-28', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
];

const fullDayCamps = [
  { name: 'Musical Theatre Full Day Camp: KPop Demon Hunters (Spring Break)', startDate: '2026-03-16', endDate: '2026-03-20', days: 'Mon-Fri', campType: 'Spring Break', season: 'Spring Break 2026', enrollmentStatus: 'Completed' },
  { name: 'Musical Theatre Full Day Camp: Broadway and Beyond (Spring Break)', startDate: '2026-03-23', endDate: '2026-03-27', days: 'Mon-Fri', campType: 'Spring Break', season: 'Spring Break 2026', enrollmentStatus: 'Completed' },
  { name: 'Musical Theatre Full Day Camp: Swifties -- Life of a Showkid', startDate: '2026-07-06', endDate: '2026-07-10', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: 'Musical Theatre Full Day Camp: Wicked', startDate: '2026-07-13', endDate: '2026-07-17', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: 'Musical Theatre Full Day Camp: Movie Night', startDate: '2026-07-20', endDate: '2026-07-24', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: "Musical Theatre Full Day Camp: Lights Up's Got Talent", startDate: '2026-07-27', endDate: '2026-07-31', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: "Musical Theatre Full Day Camp: Totally 90s (4-Day)", startDate: '2026-08-04', endDate: '2026-08-07', days: 'Tue-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: 'Musical Theatre Full Day Camp: Descendants Academy', startDate: '2026-08-10', endDate: '2026-08-14', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: 'Musical Theatre Full Day Camp: Taking on New York', startDate: '2026-08-17', endDate: '2026-08-21', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
  { name: 'Musical Theatre Full Day Camp: KPop Demon Hunters', startDate: '2026-08-24', endDate: '2026-08-28', days: 'Mon-Fri', campType: 'Summer Camp', season: 'Summer 2026', enrollmentStatus: 'Open' },
];

const newPrograms = [];

for (const loc of locations) {
  for (const camp of halfDayCamps) {
    newPrograms.push({
      id: nextId++,
      name: camp.name,
      provider: 'Lights Up Musical Theatre',
      category: 'Performing Arts',
      campType: camp.campType,
      scheduleType: 'Half Day',
      ageMin: 4,
      ageMax: 6,
      startDate: camp.startDate,
      endDate: camp.endDate,
      days: camp.days,
      startTime: '9:15 AM',
      endTime: '12:15 PM',
      cost: 260,
      indoorOutdoor: 'Indoor',
      neighbourhood: loc.neighbourhood,
      address: loc.address,
      lat: loc.lat,
      lng: loc.lng,
      enrollmentStatus: camp.enrollmentStatus,
      registrationUrl: loc.registrationUrl,
      description: 'Musical theatre half day camp for ages 4-6. Campers explore singing, dance, and acting through themed material, culminating in a Friday show for parents. No prior experience needed.',
      tags: ['musical theatre', 'singing', 'dance', 'acting', 'performing arts'],
      activityType: 'Musical Theatre',
      priceVerified: true,
      confirmed2026: true,
      dayLength: 'Half Day',
      season: camp.season,
      durationPerDay: 3,
      status: camp.enrollmentStatus,
      urlVerified: true,
      city: 'North Vancouver'
    });
  }

  for (const camp of fullDayCamps) {
    newPrograms.push({
      id: nextId++,
      name: camp.name,
      provider: 'Lights Up Musical Theatre',
      category: 'Performing Arts',
      campType: camp.campType,
      scheduleType: 'Full Day',
      ageMin: 6,
      ageMax: 12,
      startDate: camp.startDate,
      endDate: camp.endDate,
      days: camp.days,
      startTime: '9:00 AM',
      endTime: '3:00 PM',
      cost: 425,
      indoorOutdoor: 'Indoor',
      neighbourhood: loc.neighbourhood,
      address: loc.address,
      lat: loc.lat,
      lng: loc.lng,
      enrollmentStatus: camp.enrollmentStatus,
      registrationUrl: loc.registrationUrl,
      description: 'Musical theatre full day camp for ages 6-12. Campers spend the week singing, dancing, and acting through a themed curriculum, with a full performance for parents on Friday.',
      tags: ['musical theatre', 'singing', 'dance', 'acting', 'performing arts'],
      activityType: 'Musical Theatre',
      priceVerified: true,
      confirmed2026: true,
      dayLength: 'Full Day',
      season: camp.season,
      durationPerDay: 6,
      status: camp.enrollmentStatus,
      urlVerified: true,
      city: 'North Vancouver'
    });
  }
}

console.log('Adding ' + newPrograms.length + ' Lights Up programs (IDs ' + newPrograms[0].id + '-' + newPrograms[newPrograms.length-1].id + ')');

const combined = [...programs, ...newPrograms];
fs.writeFileSync(programsPath, JSON.stringify(combined, null, 2));
console.log('Written successfully. Total programs:', combined.length);
