const fs = require('fs');
const path = require('path');

const programsPath = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(programsPath, 'utf8'));

let nextId = 15902;

const provider = 'Parkgate Society';
const mainAddress = '3625 Banff Court, North Vancouver, BC V7H 2Z8';
const mainLat = 49.3370;
const mainLng = -122.9670;
const neighbourhood = 'Deep Cove';
const city = 'North Vancouver';
const regUrl = 'https://parkgatesociety.ca/child-care/day-camps/';

// Verified from parkgatesociety.ca on 2026-04-04:
// - Day Camps page: ages 5-12, full and half-day, summer + school closures
//   "We don't have any sessions available right now" — 2026 dates not yet posted
// - Camp Extreme (Youth Camps): 2025 data — $375/week, 9am-3pm, Gr. 5-9, Deep Cove area
//   3 weeks in July/August 2025. 2026 not yet posted.
// - Summer in the Park: FREE annual drop-in, July–August, Little Cates Park, ages 0-6
//   Confirmed: "FREE program every July and August" — parkgatesociety.ca/family/summer-in-the-park/

const newPrograms = [
  // --- DAY CAMP FULL DAY ---
  {
    id: nextId++,
    name: 'Parkgate Society Summer Day Camp - Full Day (Ages 5-12)',
    provider,
    category: 'Multi',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 5,
    ageMax: 12,
    startDate: '2026-07-01',
    endDate: '2026-08-31',
    days: 'Mon-Fri',
    startTime: null,
    endTime: null,
    cost: null,
    costNote: '2026 pricing not yet published. Check parkgatesociety.ca/child-care/day-camps/ for registration when open.',
    indoorOutdoor: 'Both',
    neighbourhood,
    address: mainAddress,
    lat: mainLat,
    lng: mainLng,
    enrollmentStatus: 'Likely Coming Soon',
    registrationUrl: regUrl,
    description: 'Full-day summer day camp at Parkgate Community Centre for children ages 5-12. Activities include outdoor exploration, local field trips (Science World, Vancouver Aquarium, Grouse Mountain, Lynn Valley Ecology Centre), arts and crafts, and active play. Open to all children regardless of enrollment in Parkgate\'s School Age Care program.',
    tags: ['day camp', 'summer camp', 'outdoor', 'nature', 'field trips'],
    activityType: 'Multi-Activity',
    priceVerified: false,
    confirmed2026: false,
    isEstimate: true,
    dayLength: 'Full Day',
    season: 'Summer 2026',
    durationPerDay: 7,
    repeating: true,
    status: 'Likely Coming Soon',
    urlVerified: true,
    city
  },
  // --- DAY CAMP HALF DAY ---
  {
    id: nextId++,
    name: 'Parkgate Society Summer Day Camp - Half Day (Ages 5-12)',
    provider,
    category: 'Multi',
    campType: 'Summer Camp',
    scheduleType: 'Half Day',
    ageMin: 5,
    ageMax: 12,
    startDate: '2026-07-01',
    endDate: '2026-08-31',
    days: 'Mon-Fri',
    startTime: null,
    endTime: null,
    cost: null,
    costNote: '2026 pricing not yet published. Check parkgatesociety.ca/child-care/day-camps/ for registration when open.',
    indoorOutdoor: 'Both',
    neighbourhood,
    address: mainAddress,
    lat: mainLat,
    lng: mainLng,
    enrollmentStatus: 'Likely Coming Soon',
    registrationUrl: regUrl,
    description: 'Half-day summer day camp at Parkgate Community Centre for children ages 5-12. Active and engaging morning or afternoon programs featuring outdoor activities, arts and crafts, games, and hands-on exploration. Open to all children.',
    tags: ['day camp', 'summer camp', 'half day', 'outdoor', 'arts'],
    activityType: 'Multi-Activity',
    priceVerified: false,
    confirmed2026: false,
    isEstimate: true,
    dayLength: 'Half Day',
    season: 'Summer 2026',
    durationPerDay: 3,
    repeating: true,
    status: 'Likely Coming Soon',
    urlVerified: true,
    city
  },
  // --- CAMP EXTREME (YOUTH) ---
  {
    id: nextId++,
    name: 'Camp Extreme — Parkgate Youth Summer Camp (Gr. 5-9)',
    provider,
    category: 'Outdoor',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 10,
    ageMax: 15,
    startDate: '2026-07-06',
    endDate: '2026-08-28',
    days: 'Mon-Fri',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    cost: 375,
    costNote: '$375/week based on 2025 pricing. 2026 pricing not yet confirmed. Led by Parkgate Youth Services team. Activities include kayaking, paddle boarding, and local hikes in the Deep Cove area.',
    indoorOutdoor: 'Outdoor',
    neighbourhood,
    address: mainAddress,
    lat: mainLat,
    lng: mainLng,
    enrollmentStatus: 'Likely Coming Soon',
    registrationUrl: 'https://parkgatesociety.ca/youth/youth-camps/',
    description: 'Camp Extreme is an outdoor youth summer camp led by the Parkgate Youth Services team. Grades 5-9, co-ed. Focuses on exploring the Deep Cove area with activities including kayaking, paddle boarding, and local hikes. 9am-3pm. No transportation provided — some walking required each day.',
    tags: ['outdoor camp', 'kayaking', 'paddle board', 'hiking', 'youth camp', 'Deep Cove'],
    activityType: 'Outdoor Adventure',
    priceVerified: false,
    confirmed2026: false,
    isEstimate: true,
    dayLength: 'Full Day',
    season: 'Summer 2026',
    durationPerDay: 6,
    repeating: true,
    status: 'Likely Coming Soon',
    urlVerified: true,
    city
  },
  // --- SUMMER IN THE PARK ---
  {
    id: nextId++,
    name: 'Summer in the Park — Free Family Playgroup (Ages 0-6)',
    provider,
    category: 'Outdoor',
    campType: 'Class/Lesson',
    scheduleType: 'Half Day',
    ageMin: 0,
    ageMax: 6,
    startDate: '2026-07-01',
    endDate: '2026-08-31',
    days: 'Weekdays',
    startTime: null,
    endTime: null,
    cost: 0,
    costNote: 'FREE. No registration required. Drop-in at Little Cates Park (4000 Dollarton Hwy, off Seashell Lane). Runs rain or shine every July and August. Light snack provided for children.',
    indoorOutdoor: 'Outdoor',
    neighbourhood: 'Dollarton',
    address: '4000 Dollarton Highway, North Vancouver, BC',
    lat: 49.3160,
    lng: -122.9660,
    enrollmentStatus: 'Likely Coming Soon',
    registrationUrl: 'https://parkgatesociety.ca/family/summer-in-the-park/',
    description: 'Free outdoor drop-in playgroup at Little Cates Park every July and August. For children ages 0-6 with a parent or caregiver (siblings welcome). Hosted by Parkgate Society\'s Parent Community Developers. Activities include art, games, story time, and more. Light snack provided. No registration required — just show up!',
    tags: ['free', 'playgroup', 'outdoor', 'toddler', 'family', 'drop-in', 'park'],
    activityType: 'Playgroup',
    priceVerified: true,
    confirmed2026: false,
    isEstimate: true,
    dayLength: 'Half Day',
    season: 'Summer 2026',
    durationPerDay: 2,
    repeating: true,
    status: 'Likely Coming Soon',
    urlVerified: true,
    city
  }
];

console.log('Adding ' + newPrograms.length + ' Parkgate Society programs (IDs ' + newPrograms[0].id + '-' + newPrograms[newPrograms.length - 1].id + ')');

const combined = [...programs, ...newPrograms];
fs.writeFileSync(programsPath, JSON.stringify(combined, null, 2));
console.log('Written successfully. Total programs:', combined.length);
