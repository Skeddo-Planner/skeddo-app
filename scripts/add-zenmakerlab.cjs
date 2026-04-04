const fs = require('fs');
const path = require('path');

const programsPath = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(programsPath, 'utf8'));

let nextId = 15849;

const regUrl = 'https://www.zenmakerlab.com/summer-camps';

// Two NV locations
const locations = [
  {
    provider: 'Zen Maker Lab',
    address: '125 Victory Ship Way Unit 224, North Vancouver, BC V7L 0G7',
    lat: 49.3115,
    lng: -123.0685,
    neighbourhood: 'Lower Lonsdale',
    locationLabel: 'Shipyards',
  },
  {
    provider: 'Zen Maker Lab',
    address: '1276 1st St E, North Vancouver, BC',
    lat: 49.3255,
    lng: -123.0445,
    neighbourhood: 'Central Lonsdale',
    locationLabel: 'HQ',
  }
];

// Programs by grade/age group (from live summer-camps page, 2025 data — 2026 TBA)
const programDefs = [
  { name: 'STEAM Camp: Tiny Inventors (K-Grade 1)', ageMin: 5, ageMax: 7, gradeLabel: 'K-Gr 1', scheduleType: 'Half Day', startTime: '9:30 AM', endTime: '12:30 PM', durationPerDay: 3, desc: 'Intro STEAM camp for Kindergarten and Grade 1. Small projects introducing creativity, problem-solving, and dexterity through hands-on STEAM concepts. No robotics in this program.' },
  { name: 'STEAM Camp: Tiny Ecologists (K-Grade 1)', ageMin: 5, ageMax: 7, gradeLabel: 'K-Gr 1', scheduleType: 'Half Day', startTime: '9:30 AM', endTime: '12:30 PM', durationPerDay: 3, desc: 'STEAM camp for K-Grade 1 focused on biology, the environment, and green energy through small hands-on projects.' },
  { name: 'STEAM Camp: Jr. Coding — Mission Code Breaker (Gr 2-3)', ageMin: 7, ageMax: 9, gradeLabel: 'Gr 2-3', scheduleType: 'Full Day', startTime: '9:30 AM', endTime: '3:30 PM', durationPerDay: 6, desc: 'Coding camp using programmable robots to complete missions. Students learn encryption, Morse code, and block coding while working in teams.' },
  { name: 'STEAM Camp: Jr. Engineer — Engineering a Green City (Gr 2-3)', ageMin: 7, ageMax: 9, gradeLabel: 'Gr 2-3', scheduleType: 'Full Day', startTime: '9:30 AM', endTime: '3:30 PM', durationPerDay: 6, desc: 'Engineering camp for Grades 2-3. Students build scale green homes with solar panels, laser-cut materials, and 3D printed pieces.' },
  { name: 'STEAM Camp: Creative Makers & Illustration (Gr 2-3)', ageMin: 7, ageMax: 9, gradeLabel: 'Gr 2-3', scheduleType: 'Full Day', startTime: '9:30 AM', endTime: '3:30 PM', durationPerDay: 6, desc: 'Creativity and illustration camp for Grades 2-3. Design process projects in illustration, animation, and character development.' },
  { name: 'STEAM Camp: Zen Maker Bot — Fabrication & Robotics (Gr 4-6)', ageMin: 9, ageMax: 12, gradeLabel: 'Gr 4-6', scheduleType: 'Full Day', startTime: '9:30 AM', endTime: '3:30 PM', durationPerDay: 6, desc: 'Robotics and fabrication camp for Grades 4-6. Students build a wheeled robot from laser-cut wood and 3D printed materials.' },
  { name: 'STEAM Camp: Circuits & Motors (Gr 4-6)', ageMin: 9, ageMax: 12, gradeLabel: 'Gr 4-6', scheduleType: 'Full Day', startTime: '9:30 AM', endTime: '3:30 PM', durationPerDay: 6, desc: 'Kinetic art and circuits camp for Grades 4-6. Students design and assemble moving sculptures, learning circuitry, 3D design, and mechanics.' },
  { name: 'STEAM Camp: Environmental Film Making (Gr 4-6)', ageMin: 9, ageMax: 12, gradeLabel: 'Gr 4-6', scheduleType: 'Full Day', startTime: '9:30 AM', endTime: '3:30 PM', durationPerDay: 6, desc: 'Filmmaking and conservation camp for Grades 4-6. Students learn eco-documentary filmmaking, photography, and video editing about BC natural landscapes.' },
  { name: 'STEAM Camp: Mechatronics — Build a Table Game (Gr 7-12)', ageMin: 12, ageMax: 17, gradeLabel: 'Gr 7-12', scheduleType: 'Full Day', startTime: '9:30 AM', endTime: '3:30 PM', durationPerDay: 6, desc: 'Advanced mechatronics camp for Grades 7-12. Students design a linear actuator and custom pinball game, combining mechanical, electrical, and computer engineering.' },
];

const newPrograms = [];

for (const loc of locations) {
  for (const prog of programDefs) {
    newPrograms.push({
      id: nextId++,
      name: `${prog.name} — ${loc.locationLabel}`,
      provider: loc.provider,
      category: 'STEM',
      campType: 'Summer Camp',
      scheduleType: prog.scheduleType,
      ageMin: prog.ageMin,
      ageMax: prog.ageMax,
      startDate: '2026-07-06',
      endDate: '2026-08-22',
      days: 'Mon-Fri',
      startTime: prog.startTime,
      endTime: prog.endTime,
      cost: null,
      costNote: '2026 pricing not yet published. 2025 full-week camps ranged $400-500; half-day K-1 camps from $200. Check zenmakerlab.com/summer-camps for 2026 pricing.',
      indoorOutdoor: 'Indoor',
      neighbourhood: loc.neighbourhood,
      address: loc.address,
      lat: loc.lat,
      lng: loc.lng,
      enrollmentStatus: 'Likely Coming Soon',
      registrationUrl: regUrl,
      description: `${prog.desc} At Zen Maker Lab ${loc.locationLabel}, North Vancouver. 2026 dates and registration TBA.`,
      tags: ['STEM', 'STEAM', 'coding', 'robotics', 'maker', '3D printing', 'engineering'],
      activityType: 'STEM',
      priceVerified: false,
      confirmed2026: false,
      isEstimate: true,
      dayLength: prog.scheduleType,
      season: 'Summer 2026',
      durationPerDay: prog.durationPerDay,
      status: 'Likely Coming Soon',
      urlVerified: true,
      city: 'North Vancouver'
    });
  }
}

console.log('Adding ' + newPrograms.length + ' Zen Maker Lab programs (IDs ' + newPrograms[0].id + '-' + newPrograms[newPrograms.length-1].id + ')');

const combined = [...programs, ...newPrograms];
fs.writeFileSync(programsPath, JSON.stringify(combined, null, 2));
console.log('Written successfully. Total programs:', combined.length);
