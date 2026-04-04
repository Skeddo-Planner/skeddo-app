const fs = require('fs');
const path = require('path');

const programsPath = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(programsPath, 'utf8'));

let nextId = 15812;

const provider = 'Little Kitchen Academy';
const address = '3018 Edgemont Blvd, North Vancouver, BC V7R 2N4';
const lat = 49.3620;
const lng = -123.0880;
const neighbourhood = 'Edgemont Village';
const city = 'North Vancouver';
const regUrl = 'https://littlekitchenacademy.com/locations/north-vancouver/';

// All camps: [campLabel, theme, startDate, endDate, [{ age_label, ageMin, ageMax, startTime, endTime, cost }]]
const allCamps = [
  { label: 'A', theme: 'Mastering Kitchen Tools', start: '2026-06-15', end: '2026-06-19', sessions: [
    { age: '3-5', ageMin: 3, ageMax: 5, startTime: '9:00 AM', endTime: '12:00 PM', cost: 520 },
    { age: '6-8', ageMin: 6, ageMax: 8, startTime: '12:30 PM', endTime: '3:30 PM', cost: 520 },
  ]},
  { label: 'B', theme: 'Summer Flavor Lab', start: '2026-06-22', end: '2026-06-26', sessions: [
    { age: '6-8', ageMin: 6, ageMax: 8, startTime: '9:00 AM', endTime: '12:00 PM', cost: 520 },
    { age: '9-12', ageMin: 9, ageMax: 12, startTime: '12:30 PM', endTime: '3:30 PM', cost: 520 },
  ]},
  { label: 'C', theme: 'Picnic Classics', start: '2026-06-29', end: '2026-07-03', sessions: [
    { age: '3-5', ageMin: 3, ageMax: 5, startTime: '9:00 AM', endTime: '12:00 PM', cost: 415 },
    { age: '6-8', ageMin: 6, ageMax: 8, startTime: '12:30 PM', endTime: '3:30 PM', cost: 416 },
    { age: '9-12', ageMin: 9, ageMax: 12, startTime: '4:00 PM', endTime: '7:00 PM', cost: 416 },
  ]},
  { label: 'D', theme: 'Global Street Eats', start: '2026-07-06', end: '2026-07-10', sessions: [
    { age: '6-8', ageMin: 6, ageMax: 8, startTime: '9:00 AM', endTime: '12:00 PM', cost: 520 },
    { age: '9-12', ageMin: 9, ageMax: 12, startTime: '12:30 PM', endTime: '3:30 PM', cost: 520 },
    { age: '13-18', ageMin: 13, ageMax: 18, startTime: '4:00 PM', endTime: '7:00 PM', cost: 520 },
  ]},
  { label: 'E', theme: 'Baking Chemistry Lab', start: '2026-07-13', end: '2026-07-17', sessions: [
    { age: '3-5', ageMin: 3, ageMax: 5, startTime: '9:00 AM', endTime: '12:00 PM', cost: 520 },
    { age: '6-8', ageMin: 6, ageMax: 8, startTime: '12:30 PM', endTime: '3:30 PM', cost: 520 },
    { age: '9-12', ageMin: 9, ageMax: 12, startTime: '4:00 PM', endTime: '7:00 PM', cost: 520 },
  ]},
  { label: 'F', theme: "Cooking with Summer's Finest", start: '2026-07-20', end: '2026-07-24', sessions: [
    { age: '3-5', ageMin: 3, ageMax: 5, startTime: '9:00 AM', endTime: '12:00 PM', cost: 520 },
    { age: '9-12', ageMin: 9, ageMax: 12, startTime: '4:00 PM', endTime: '7:00 PM', cost: 520 },
  ]},
  { label: 'G', theme: 'Around the Campfire', start: '2026-07-27', end: '2026-07-31', sessions: [
    { age: '3-5', ageMin: 3, ageMax: 5, startTime: '9:00 AM', endTime: '12:00 PM', cost: 520 },
    { age: '9-12', ageMin: 9, ageMax: 12, startTime: '12:30 PM', endTime: '3:30 PM', cost: 520 },
    { age: '13-18', ageMin: 13, ageMax: 18, startTime: '4:00 PM', endTime: '7:00 PM', cost: 520 },
  ]},
  { label: 'H', theme: 'Taste the World', start: '2026-08-04', end: '2026-08-07', days: 'Tue-Fri', sessions: [
    { age: '3-5', ageMin: 3, ageMax: 5, startTime: '9:00 AM', endTime: '12:00 PM', cost: 416 },
    { age: '6-8', ageMin: 6, ageMax: 8, startTime: '12:30 PM', endTime: '3:30 PM', cost: 416 },
    { age: '9-12', ageMin: 9, ageMax: 12, startTime: '4:00 PM', endTime: '7:00 PM', cost: 416 },
  ]},
  { label: 'I', theme: 'Cooking with Imagination', start: '2026-08-10', end: '2026-08-14', sessions: [
    { age: '3-5', ageMin: 3, ageMax: 5, startTime: '9:00 AM', endTime: '12:00 PM', cost: 520 },
    { age: '6-8', ageMin: 6, ageMax: 8, startTime: '12:30 PM', endTime: '3:30 PM', cost: 520 },
    { age: '9-12', ageMin: 9, ageMax: 12, startTime: '4:00 PM', endTime: '7:00 PM', cost: 520 },
  ]},
  { label: 'J', theme: 'Culinary Engineering', start: '2026-08-17', end: '2026-08-21', sessions: [
    { age: '6-8', ageMin: 6, ageMax: 8, startTime: '9:00 AM', endTime: '12:00 PM', cost: 520 },
    { age: '9-12', ageMin: 9, ageMax: 12, startTime: '12:30 PM', endTime: '3:30 PM', cost: 520 },
    { age: '13-18', ageMin: 13, ageMax: 18, startTime: '4:00 PM', endTime: '7:00 PM', cost: 520 },
  ]},
  { label: 'K', theme: 'Smart Snacks & Packable Lunches', start: '2026-08-24', end: '2026-08-28', sessions: [
    { age: '3-5', ageMin: 3, ageMax: 5, startTime: '9:00 AM', endTime: '12:00 PM', cost: 520 },
    { age: '6-8', ageMin: 6, ageMax: 8, startTime: '12:30 PM', endTime: '3:30 PM', cost: 520 },
    { age: '9-12', ageMin: 9, ageMax: 12, startTime: '4:00 PM', endTime: '7:00 PM', cost: 520 },
  ]},
  { label: 'L', theme: 'Handheld Favorites', start: '2026-08-31', end: '2026-09-04', sessions: [
    { age: '3-5', ageMin: 3, ageMax: 5, startTime: '9:00 AM', endTime: '12:00 PM', cost: 520 },
    { age: '6-8', ageMin: 6, ageMax: 8, startTime: '12:30 PM', endTime: '3:30 PM', cost: 520 },
    { age: '9-12', ageMin: 9, ageMax: 12, startTime: '4:00 PM', endTime: '7:00 PM', cost: 520 },
  ]},
];

const newPrograms = [];

for (const camp of allCamps) {
  const days = camp.days || 'Mon-Fri';
  for (const session of camp.sessions) {
    newPrograms.push({
      id: nextId++,
      name: `Cooking Camp ${camp.label}: ${camp.theme} (Ages ${session.age})`,
      provider,
      category: 'Life Skills',
      campType: 'Summer Camp',
      scheduleType: 'Half Day',
      ageMin: session.ageMin,
      ageMax: session.ageMax,
      startDate: camp.start,
      endDate: camp.end,
      days,
      startTime: session.startTime,
      endTime: session.endTime,
      cost: session.cost,
      indoorOutdoor: 'Indoor',
      neighbourhood,
      address,
      lat,
      lng,
      enrollmentStatus: 'Open',
      registrationUrl: regUrl,
      description: `Hands-on cooking camp at Little Kitchen Academy Edgemont Village. Ages ${session.age} explore recipes, kitchen skills, and seasonal ingredients. Daily workstations, expert instructors. Theme: ${camp.theme}.`,
      tags: ['cooking', 'culinary', 'life skills', 'food', 'kids cooking'],
      activityType: 'Cooking',
      priceVerified: true,
      confirmed2026: true,
      dayLength: 'Half Day',
      season: 'Summer 2026',
      durationPerDay: 3,
      status: 'Open',
      urlVerified: true,
      city
    });
  }
}

console.log('Adding ' + newPrograms.length + ' Little Kitchen Academy programs (IDs ' + newPrograms[0].id + '-' + newPrograms[newPrograms.length-1].id + ')');

const combined = [...programs, ...newPrograms];
fs.writeFileSync(programsPath, JSON.stringify(combined, null, 2));
console.log('Written successfully. Total programs:', combined.length);
