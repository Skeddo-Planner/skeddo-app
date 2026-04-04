const fs = require('fs');
const path = require('path');

const programsPath = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(programsPath, 'utf8'));

let nextId = 15898;

const provider = 'Absolute Cheer & Tumbling';
const address = '758 Harbourside Drive, North Vancouver, BC V7P3R7';
const lat = 49.3167;
const lng = -123.0778;
const neighbourhood = 'Mosquito Creek';
const city = 'North Vancouver';
const regUrl = 'https://portal.iclasspro.com/absolute/camps/17?sortBy=date';

// All data verified from iClass Pro portal (portal.iclasspro.com/absolute/camps)
// and absolutegym.ca on 2026-04-04
// Ages 5-12 confirmed from API (minAge:5, maxAge:12 on all 36 camp sessions)
// Address: 758 Harbourside Drive, North Vancouver, BC V7P3R7 (from portal)
// Note: $35+tax membership fee required in addition to camp fees

const newPrograms = [
  // --- FULL DAY ---
  {
    id: nextId++,
    name: 'Absolute Gym Recreational Day Camp - Full Day (Ages 5-12)',
    provider,
    category: 'Sports',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 5,
    ageMax: 12,
    startDate: '2026-06-29',
    endDate: '2026-08-28',
    days: 'Mon-Fri',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    cost: 475,
    costNote: '$380+tax for 4-day short weeks (Canada Day week Jun 29-Jul 3, BC Day week Aug 4-7); $475+tax for standard 5-day weeks. Note: $35+tax annual membership fee also required.',
    indoorOutdoor: 'Indoor',
    neighbourhood,
    address,
    lat,
    lng,
    enrollmentStatus: 'Open',
    registrationUrl: regUrl,
    description: 'Full-day recreational summer camp at Absolute Gym (cheer & tumbling) in North Vancouver. Ages 5-12, all skill levels welcome. Daily activities include cheerleading, tumbling, gymnastics games, crafts, fitness circuits, and team bonding. Coaches group kids by age and ability.',
    tags: ['cheerleading', 'tumbling', 'gymnastics', 'cheer camp', 'gymnastics camp'],
    activityType: 'Cheer & Gymnastics',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Full Day',
    season: 'Summer 2026',
    durationPerDay: 6,
    repeating: true,
    status: 'Open',
    urlVerified: true,
    city
  },
  // --- HALF DAY AM ---
  {
    id: nextId++,
    name: 'Absolute Gym Recreational Day Camp - Half Day AM (Ages 5-12)',
    provider,
    category: 'Sports',
    campType: 'Summer Camp',
    scheduleType: 'Half Day',
    ageMin: 5,
    ageMax: 12,
    startDate: '2026-06-29',
    endDate: '2026-08-28',
    days: 'Mon-Fri',
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    cost: 260,
    costNote: '$208+tax for 4-day short weeks (Canada Day week Jun 29-Jul 3, BC Day week Aug 4-7); $260+tax for standard 5-day weeks. Note: $35+tax annual membership fee also required.',
    indoorOutdoor: 'Indoor',
    neighbourhood,
    address,
    lat,
    lng,
    enrollmentStatus: 'Open',
    registrationUrl: regUrl,
    description: 'Morning half-day recreational summer camp at Absolute Gym (cheer & tumbling) in North Vancouver. Ages 5-12, all levels welcome. 9AM-12PM daily. Activities include cheerleading, tumbling, gymnastics games, and fitness. Coaches group kids by age and ability.',
    tags: ['cheerleading', 'tumbling', 'gymnastics', 'cheer camp', 'half day camp'],
    activityType: 'Cheer & Gymnastics',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Half Day',
    season: 'Summer 2026',
    durationPerDay: 3,
    repeating: true,
    status: 'Open',
    urlVerified: true,
    city
  },
  // --- HALF DAY PM ---
  {
    id: nextId++,
    name: 'Absolute Gym Recreational Day Camp - Half Day PM (Ages 5-12)',
    provider,
    category: 'Sports',
    campType: 'Summer Camp',
    scheduleType: 'Half Day',
    ageMin: 5,
    ageMax: 12,
    startDate: '2026-06-29',
    endDate: '2026-08-28',
    days: 'Mon-Fri',
    startTime: '12:00 PM',
    endTime: '3:00 PM',
    cost: 260,
    costNote: '$208+tax for 4-day short weeks (Canada Day week Jun 29-Jul 3, BC Day week Aug 4-7); $260+tax for standard 5-day weeks. Note: $35+tax annual membership fee also required.',
    indoorOutdoor: 'Indoor',
    neighbourhood,
    address,
    lat,
    lng,
    enrollmentStatus: 'Open',
    registrationUrl: regUrl,
    description: 'Afternoon half-day recreational summer camp at Absolute Gym (cheer & tumbling) in North Vancouver. Ages 5-12, all levels welcome. 12PM-3PM daily. Activities include cheerleading, tumbling, gymnastics games, and fitness. Coaches group kids by age and ability.',
    tags: ['cheerleading', 'tumbling', 'gymnastics', 'cheer camp', 'half day camp'],
    activityType: 'Cheer & Gymnastics',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Half Day',
    season: 'Summer 2026',
    durationPerDay: 3,
    repeating: true,
    status: 'Open',
    urlVerified: true,
    city
  },
  // --- SINGLE DAY DROP-IN ---
  {
    id: nextId++,
    name: 'Absolute Gym Recreational Day Camp - Single Day Drop-In (Ages 5-12)',
    provider,
    category: 'Sports',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 5,
    ageMax: 12,
    startDate: '2026-06-29',
    endDate: '2026-08-28',
    days: 'Mon-Fri',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    cost: 125,
    costNote: '$125+tax per single day. Drop-in option available any camp week Jun 29-Aug 28. Note: $35+tax annual membership fee also required.',
    indoorOutdoor: 'Indoor',
    neighbourhood,
    address,
    lat,
    lng,
    enrollmentStatus: 'Open',
    registrationUrl: regUrl,
    description: 'Single-day drop-in option for Absolute Gym\'s recreational summer camp. Ages 5-12, all levels. 9AM-3PM. Activities include cheerleading, tumbling, gymnastics games, crafts, and team fun. Book individual days without committing to a full week.',
    tags: ['cheerleading', 'tumbling', 'gymnastics', 'cheer camp', 'drop in'],
    activityType: 'Cheer & Gymnastics',
    priceVerified: true,
    confirmed2026: true,
    dayLength: 'Full Day',
    season: 'Summer 2026',
    durationPerDay: 6,
    repeating: true,
    status: 'Open',
    urlVerified: true,
    city
  }
];

console.log('Adding ' + newPrograms.length + ' Absolute Gym programs (IDs ' + newPrograms[0].id + '-' + newPrograms[newPrograms.length - 1].id + ')');

const combined = [...programs, ...newPrograms];
fs.writeFileSync(programsPath, JSON.stringify(combined, null, 2));
console.log('Written successfully. Total programs:', combined.length);
