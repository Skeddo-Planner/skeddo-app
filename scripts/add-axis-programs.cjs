// Script to add all 85 Axis Adventure Camps programs
const fs = require('fs');
const path = require('path');

const programsPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(programsPath, 'utf8'));

// Remove existing Axis Adventure entries
const filtered = programs.filter(p => !(p.provider || '').toLowerCase().includes('axis adventure'));
console.log(`Removed ${programs.length - filtered.length} existing Axis entries`);

const REG_URL = 'https://axiscamps.playbookapi.com/programs/register/';
const BASE = {
  provider: 'Axis Adventure Camps',
  category: 'Sports',
  confirmed2026: true,
  priceVerified: true,
  indoorOutdoor: 'Outdoor',
  tags: ['camp'],
  neighbourhood: 'Whistler',
  city: 'Whistler',
  registrationUrl: REG_URL,
  urlVerified: true,
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  durationPerDay: 6.5,
};

const BIKING_3_5_ADDR = '7226 Fitzsimmons Rd, Whistler, BC';
const BIKING_5_12_ADDR = 'Spruce Grove Park, 7328 Kirkpatrick Way, Whistler, BC';
const PEAK_ADDR = '7328 Kirkpatrick Way, Whistler, BC';
const SPRING_FALL_ADDR = '7226 Fitzsimmons Rd, Whistler, BC';
const LAT_FITS = 50.1166; const LNG_FITS = -122.9534;
const LAT_KIRK = 50.1213; const LNG_KIRK = -122.9511;

const sumWeeks = [
  { n:1, start:'2026-06-29', end:'2026-07-03', label:'June 29 - July 3' },
  { n:2, start:'2026-07-06', end:'2026-07-10', label:'July 6-10' },
  { n:3, start:'2026-07-13', end:'2026-07-17', label:'July 13-17' },
  { n:4, start:'2026-07-20', end:'2026-07-24', label:'July 20-24' },
  { n:5, start:'2026-07-27', end:'2026-07-31', label:'July 27-31' },
  { n:6, start:'2026-08-03', end:'2026-08-07', label:'Aug 3-7' },
  { n:7, start:'2026-08-10', end:'2026-08-14', label:'Aug 10-14' },
  { n:8, start:'2026-08-17', end:'2026-08-21', label:'Aug 17-21' },
  { n:9, start:'2026-08-24', end:'2026-08-28', label:'Aug 24-28' },
  { n:10, start:'2026-08-31', end:'2026-09-04', label:'Aug 31 - Sep 4' },
];

const newPrograms = [];

// ── GROUP 1: Summer Biking Ages 3-5 Weekly ──────────────────────────────
sumWeeks.forEach(w => {
  newPrograms.push({
    ...BASE,
    id: `axis-biking-3-5-w${w.n}`,
    name: `Axis Biking Camp Ages 3-5 Week ${w.n} (${w.label})`,
    activityType: 'Mountain Biking',
    ageMin: 3, ageMax: 5,
    cost: 699,
    costNote: 'Per-week rate. Season passes also available: 2x/week=$1,803; 1x/week=$984; 5-day flexible=$556; daily drop-in=$150.',
    startDate: w.start, endDate: w.end,
    days: 'Mon-Fri', startTime: '8:30 AM', endTime: '3:00 PM',
    address: BIKING_3_5_ADDR,
    lat: LAT_FITS, lng: LNG_FITS,
    season: 'Summer 2026', campType: 'Summer Camp',
    repeating: 'weekly', enrollmentStatus: 'Open', status: 'Open',
    description: 'Mountain biking day camp for children ages 3-5 in Whistler. Balance biking and trail exploration in the morning, followed by outdoor activities including paddle boarding and ball sports. Includes Axis jersey; up to 4 make-up sessions available. Children must turn 3 by August 28, 2026.',
  });
});

// ── GROUP 2: Summer Biking Ages 5-12 Weekly ──────────────────────────────
sumWeeks.forEach(w => {
  newPrograms.push({
    ...BASE,
    id: `axis-biking-5-12-w${w.n}`,
    name: `Axis Biking Camp Ages 5-12 Week ${w.n} (${w.label})`,
    activityType: 'Mountain Biking',
    ageMin: 5, ageMax: 12,
    cost: 699,
    costNote: 'Per-week rate. Season passes also available: 2x/week=$1,622.70; 1x/week=$885.60; 5-day flexible=$556; daily drop-in=$150.',
    startDate: w.start, endDate: w.end,
    days: 'Mon-Fri', startTime: '8:30 AM', endTime: '3:00 PM',
    address: BIKING_5_12_ADDR,
    lat: LAT_KIRK, lng: LNG_KIRK,
    season: 'Summer 2026', campType: 'Summer Camp',
    repeating: 'weekly', enrollmentStatus: 'Open', status: 'Open',
    description: 'Mountain bike day camp for children turning 6-12 in 2026, at Spruce Grove Park in Whistler. PMBI-certified coaches lead rides on Whistler trails with daily off-bike activities including multisports and water activities. Includes Axis jersey; up to 4 make-up sessions available.',
  });
});

// ── GROUP 3: Summer Peak Adventures 3-5 Weekly ───────────────────────────
sumWeeks.forEach(w => {
  newPrograms.push({
    ...BASE,
    id: `axis-peak-3-5-w${w.n}`,
    name: `Axis Peak Adventures Ages 3-5 Week ${w.n} (${w.label}) - No Biking`,
    activityType: 'Multi-Sport',
    ageMin: 3, ageMax: 5,
    cost: 699,
    costNote: 'Per-week rate. Season passes also available: 2x/week=$1,803; 1x/week=$984; 5-day flexible=$556; daily drop-in=$150.',
    startDate: w.start, endDate: w.end,
    days: 'Mon-Fri', startTime: '8:30 AM', endTime: '3:00 PM',
    address: PEAK_ADDR,
    lat: LAT_KIRK, lng: LNG_KIRK,
    season: 'Summer 2026', campType: 'Summer Camp',
    repeating: 'weekly', enrollmentStatus: 'Open', status: 'Open',
    description: 'Non-biking outdoor adventure and STEM day camp for ages 3-5 in Whistler. Outdoor sports, water activities, and hands-on STEM workshops led by experienced instructors. Includes Axis jersey and up to 4 make-up sessions. Children must turn 3 by August 28, 2026.',
  });
});

// ── GROUP 4: Summer Peak Adventures 5-12 Weekly ──────────────────────────
sumWeeks.forEach(w => {
  newPrograms.push({
    ...BASE,
    id: `axis-peak-5-12-w${w.n}`,
    name: `Axis Peak Adventures Ages 5-12 Week ${w.n} (${w.label}) - No Biking`,
    activityType: 'Multi-Sport',
    ageMin: 5, ageMax: 12,
    cost: 699,
    costNote: 'Per-week rate. Season passes also available: 2x/week=$1,803; 1x/week=$984; 5-day flexible=$556; daily drop-in=$150.',
    startDate: w.start, endDate: w.end,
    days: 'Mon-Fri', startTime: '8:30 AM', endTime: '3:00 PM',
    address: PEAK_ADDR,
    lat: LAT_KIRK, lng: LNG_KIRK,
    season: 'Summer 2026', campType: 'Summer Camp',
    repeating: 'weekly', enrollmentStatus: 'Open', status: 'Open',
    description: 'Non-biking outdoor adventure and STEM day camp for children turning 6-12 in 2026, in Whistler. Outdoor sports, water activities, and hands-on STEM workshops. Includes Axis jersey and up to 4 make-up sessions.',
  });
});

// ── GROUP 5: Summer Season Passes – Biking 3-5 ───────────────────────────
const b35Passes = [
  { id:'axis-summer-b35-mw', name:'Axis Summer Biking Ages 3-5 Mon/Wed Season Pass', days:'Mon, Wed', cost:1803, startDate:'2026-06-29', endDate:'2026-09-02', costNote:'$1,803 for full summer season (Mon/Wed), June 29 - Sept 2, 2026. Up to 4 make-up sessions + Axis jersey included.' },
  { id:'axis-summer-b35-tth', name:'Axis Summer Biking Ages 3-5 Tue/Thu Season Pass', days:'Tue, Thu', cost:1803, startDate:'2026-06-30', endDate:'2026-09-03', costNote:'$1,803 for full summer season (Tue/Thu), June 30 - Sept 3, 2026. Up to 4 make-up sessions + Axis jersey included.' },
  { id:'axis-summer-b35-mon', name:'Axis Summer Biking Ages 3-5 Monday Only Season Pass', days:'Mon', cost:984, startDate:'2026-06-29', endDate:'2026-08-31', costNote:'$984 for full summer season (Mondays), June 29 - Aug 31, 2026. Up to 3 make-up sessions + Axis jersey included.' },
  { id:'axis-summer-b35-tue', name:'Axis Summer Biking Ages 3-5 Tuesday Only Season Pass', days:'Tue', cost:984, startDate:'2026-06-30', endDate:'2026-09-01', costNote:'$984 for full summer season (Tuesdays), June 30 - Sept 1, 2026. Up to 3 make-up sessions + Axis jersey included.' },
  { id:'axis-summer-b35-wed', name:'Axis Summer Biking Ages 3-5 Wednesday Only Season Pass', days:'Wed', cost:984, startDate:'2026-07-01', endDate:'2026-09-02', costNote:'$984 for full summer season (Wednesdays), July 1 - Sept 2, 2026. Up to 3 make-up sessions + Axis jersey included.' },
  { id:'axis-summer-b35-thu', name:'Axis Summer Biking Ages 3-5 Thursday Only Season Pass', days:'Thu', cost:984, startDate:'2026-07-02', endDate:'2026-09-03', costNote:'$984 for full summer season (Thursdays), July 2 - Sept 3, 2026. Up to 3 make-up sessions + Axis jersey included.' },
  { id:'axis-summer-b35-fri', name:'Axis Summer Biking Ages 3-5 Friday Only Season Pass', days:'Fri', cost:984, startDate:'2026-07-03', endDate:'2026-08-28', costNote:'$984 for full summer season (Fridays), July 3 - Aug 28, 2026. Up to 3 make-up sessions + Axis jersey included.' },
];
b35Passes.forEach(p => {
  newPrograms.push({ ...BASE, ...p,
    activityType:'Mountain Biking', ageMin:3, ageMax:5,
    startTime:'8:30 AM', endTime:'3:00 PM',
    address: BIKING_3_5_ADDR, lat:LAT_FITS, lng:LNG_FITS,
    season:'Summer 2026', campType:'Summer Camp',
    repeating:'seasonal', enrollmentStatus:'Open', status:'Open',
    description:'Full-season mountain biking day camp pass for ages 3-5 at 7226 Fitzsimmons Rd, Whistler. Balance biking and trail riding with afternoon outdoor activities. Children must turn 3 by August 28, 2026.',
  });
});

newPrograms.push({ ...BASE,
  id:'axis-summer-b35-dropin', name:'Axis Summer Biking Ages 3-5 Daily Drop In',
  activityType:'Mountain Biking', ageMin:3, ageMax:5,
  days:'Mon-Fri', cost:150,
  costNote:'$150 per day. Available June 29 - September 4, 2026.',
  startDate:'2026-06-29', endDate:'2026-09-04',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:BIKING_3_5_ADDR, lat:LAT_FITS, lng:LNG_FITS,
  season:'Summer 2026', campType:'Summer Camp',
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Drop-in mountain biking day camp for ages 3-5 at 7226 Fitzsimmons Rd, Whistler. Book individual days throughout the summer season (June 29 - Sept 4).',
});

newPrograms.push({ ...BASE,
  id:'axis-summer-b35-5day', name:'Axis Summer Biking Ages 3-5 Flexible 5-Day Package',
  activityType:'Mountain Biking', ageMin:3, ageMax:5,
  days:'Mon-Fri', cost:556,
  costNote:'$556 for any 5 days between June 29 - August 28, 2026. Cannot use more than 3 consecutive days or split between siblings. Email info@axisadventurecamps.com to book dates.',
  startDate:'2026-06-29', endDate:'2026-08-28',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:BIKING_3_5_ADDR, lat:LAT_FITS, lng:LNG_FITS,
  season:'Summer 2026', campType:'Summer Camp',
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Flexible 5-day mountain biking camp package for ages 3-5 in Whistler. Choose any 5 full days between June 29 and August 28, 2026. Book via email.',
});

// ── GROUP 6: Summer Season Passes – Biking 5-12 ──────────────────────────
const b512Passes = [
  { id:'axis-summer-b512-mw', name:'Axis Summer Biking Ages 5-12 Mon/Wed Season Pass', days:'Mon, Wed', cost:1622.70, startDate:'2026-06-29', endDate:'2026-08-26', costNote:'$1,622.70 for full summer season (Mon/Wed), June 29 - Aug 26, 2026. Up to 4 make-up sessions + Axis jersey included.' },
  { id:'axis-summer-b512-tth', name:'Axis Summer Biking Ages 5-12 Tue/Thu Season Pass', days:'Tue, Thu', cost:1662.70, startDate:'2026-06-30', endDate:'2026-08-27', costNote:'$1,662.70 for full summer season (Tue/Thu), June 30 - Aug 27, 2026. Up to 4 make-up sessions + Axis jersey included.' },
  { id:'axis-summer-b512-mon', name:'Axis Summer Biking Ages 5-12 Monday Only Season Pass', days:'Mon', cost:885.60, startDate:'2026-06-29', endDate:'2026-08-24', costNote:'$885.60 for full summer season (Mondays), June 29 - Aug 24, 2026. Up to 3 make-up sessions + Axis jersey included.' },
  { id:'axis-summer-b512-tue', name:'Axis Summer Biking Ages 5-12 Tuesday Only Season Pass', days:'Tue', cost:885.60, startDate:'2026-06-30', endDate:'2026-08-25', costNote:'$885.60 for full summer season (Tuesdays), June 30 - Aug 25, 2026. Up to 3 make-up sessions + Axis jersey included.' },
  { id:'axis-summer-b512-wed', name:'Axis Summer Biking Ages 5-12 Wednesday Only Season Pass', days:'Wed', cost:885.60, startDate:'2026-07-01', endDate:'2026-08-26', costNote:'$885.60 for full summer season (Wednesdays), July 1 - Aug 26, 2026. Up to 3 make-up sessions + Axis jersey included.' },
  { id:'axis-summer-b512-thu', name:'Axis Summer Biking Ages 5-12 Thursday Only Season Pass', days:'Thu', cost:885.60, startDate:'2026-07-02', endDate:'2026-08-27', costNote:'$885.60 for full summer season (Thursdays), July 2 - Aug 27, 2026. Up to 3 make-up sessions + Axis jersey included.' },
  { id:'axis-summer-b512-fri', name:'Axis Summer Biking Ages 5-12 Friday Only Season Pass', days:'Fri', cost:885.60, startDate:'2026-07-03', endDate:'2026-08-28', costNote:'$885.60 for full summer season (Fridays), July 3 - Aug 28, 2026. Up to 3 make-up sessions + Axis jersey included.' },
];
b512Passes.forEach(p => {
  newPrograms.push({ ...BASE, ...p,
    activityType:'Mountain Biking', ageMin:5, ageMax:12,
    startTime:'8:30 AM', endTime:'3:00 PM',
    address:BIKING_5_12_ADDR, lat:LAT_KIRK, lng:LNG_KIRK,
    season:'Summer 2026', campType:'Summer Camp',
    repeating:'seasonal', enrollmentStatus:'Open', status:'Open',
    description:'Full-season mountain biking day camp pass for children turning 6-12 in 2026, at Spruce Grove Park, Whistler. Trail riding with PMBI-certified coaches and daily off-bike activities.',
  });
});

newPrograms.push({ ...BASE,
  id:'axis-summer-b512-dropin', name:'Axis Summer Biking Ages 5-12 Daily Drop In',
  activityType:'Mountain Biking', ageMin:5, ageMax:12,
  days:'Mon-Fri', cost:150,
  costNote:'$150 per day. Available June 29 - August 28, 2026.',
  startDate:'2026-06-29', endDate:'2026-08-28',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:BIKING_5_12_ADDR, lat:LAT_KIRK, lng:LNG_KIRK,
  season:'Summer 2026', campType:'Summer Camp',
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Drop-in mountain biking day camp for children turning 6-12 at Spruce Grove Park, Whistler. Book individual days throughout the summer (June 29 - Aug 28).',
});

newPrograms.push({ ...BASE,
  id:'axis-summer-b512-5day', name:'Axis Summer Biking Ages 5-12 Flexible 5-Day Package',
  activityType:'Mountain Biking', ageMin:5, ageMax:12,
  days:'Mon-Fri', cost:556,
  costNote:'$556 for any 5 days between June 29 - August 28, 2026. Email info@axisadventurecamps.com to book dates.',
  startDate:'2026-06-29', endDate:'2026-08-28',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:BIKING_5_12_ADDR, lat:LAT_KIRK, lng:LNG_KIRK,
  season:'Summer 2026', campType:'Summer Camp',
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Flexible 5-day mountain biking camp package for children turning 6-12 in Whistler. Choose any 5 full days between June 29 and August 28, 2026.',
});

// ── GROUP 7: Summer Peak Adventures Season Passes – Ages 3-5 ──────────────
newPrograms.push({ ...BASE,
  id:'axis-summer-peak35-2day', name:'Axis Summer Peak Adventures Ages 3-5 2-Day/Week Season Pass',
  activityType:'Multi-Sport', ageMin:3, ageMax:5,
  days:'Mon-Fri (any 2 days/week)', cost:1803,
  costNote:'$1,803 for 2-day/week season pass (choose any 2 days). June 29 - Sept 4, 2026. Up to 4 make-up sessions + Axis jersey included.',
  startDate:'2026-06-29', endDate:'2026-09-04',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:PEAK_ADDR, lat:LAT_KIRK, lng:LNG_KIRK,
  season:'Summer 2026', campType:'Summer Camp',
  repeating:'seasonal', enrollmentStatus:'Open', status:'Open',
  description:'Full-season 2-day/week pass for Axis Peak Adventures non-biking camp, ages 3-5 in Whistler. Outdoor sports, water activities, and STEM workshops.',
});
newPrograms.push({ ...BASE,
  id:'axis-summer-peak35-1day', name:'Axis Summer Peak Adventures Ages 3-5 1-Day/Week Season Pass',
  activityType:'Multi-Sport', ageMin:3, ageMax:5,
  days:'Mon-Fri (1 chosen day/week)', cost:984,
  costNote:'$984 for 1-day/week season pass. June 29 - Sept 4, 2026. Up to 3 make-up sessions + Axis jersey included.',
  startDate:'2026-06-29', endDate:'2026-09-04',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:PEAK_ADDR, lat:LAT_KIRK, lng:LNG_KIRK,
  season:'Summer 2026', campType:'Summer Camp',
  repeating:'seasonal', enrollmentStatus:'Open', status:'Open',
  description:'Full-season 1-day/week pass for Axis Peak Adventures non-biking camp, ages 3-5 in Whistler.',
});
newPrograms.push({ ...BASE,
  id:'axis-summer-peak35-dropin', name:'Axis Summer Peak Adventures Ages 3-5 Daily Drop In',
  activityType:'Multi-Sport', ageMin:3, ageMax:5,
  days:'Mon-Fri', cost:150,
  costNote:'$150 per day. Available June 29 - September 4, 2026.',
  startDate:'2026-06-29', endDate:'2026-09-04',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:PEAK_ADDR, lat:LAT_KIRK, lng:LNG_KIRK,
  season:'Summer 2026', campType:'Summer Camp',
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Drop-in day at Axis Peak Adventures non-biking camp for ages 3-5 in Whistler.',
});
newPrograms.push({ ...BASE,
  id:'axis-summer-peak35-5day', name:'Axis Summer Peak Adventures Ages 3-5 Flexible 5-Day Package',
  activityType:'Multi-Sport', ageMin:3, ageMax:5,
  days:'Mon-Fri', cost:556,
  costNote:'$556 for any 5 days between June 29 - August 28, 2026. Email info@axisadventurecamps.com to book dates.',
  startDate:'2026-06-29', endDate:'2026-08-28',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:PEAK_ADDR, lat:LAT_KIRK, lng:LNG_KIRK,
  season:'Summer 2026', campType:'Summer Camp',
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Flexible 5-day package for Axis Peak Adventures non-biking camp, ages 3-5 in Whistler.',
});

// ── GROUP 8: Summer Peak Adventures Season Passes – Ages 5-12 ────────────
newPrograms.push({ ...BASE,
  id:'axis-summer-peak512-2day', name:'Axis Summer Peak Adventures Ages 5-12 2-Day/Week Season Pass',
  activityType:'Multi-Sport', ageMin:5, ageMax:12,
  days:'Mon-Fri (any 2 days/week)', cost:1803,
  costNote:'$1,803 for 2-day/week season pass (choose any 2 days). June 29 - Sept 4, 2026. Up to 4 make-up sessions + Axis jersey included.',
  startDate:'2026-06-29', endDate:'2026-09-04',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:PEAK_ADDR, lat:LAT_KIRK, lng:LNG_KIRK,
  season:'Summer 2026', campType:'Summer Camp',
  repeating:'seasonal', enrollmentStatus:'Open', status:'Open',
  description:'Full-season 2-day/week pass for Axis Peak Adventures non-biking camp, children turning 6-12 in 2026, in Whistler. Outdoor sports, water activities, and STEM workshops.',
});
newPrograms.push({ ...BASE,
  id:'axis-summer-peak512-1day', name:'Axis Summer Peak Adventures Ages 5-12 1-Day/Week Season Pass',
  activityType:'Multi-Sport', ageMin:5, ageMax:12,
  days:'Mon-Fri (1 chosen day/week)', cost:984,
  costNote:'$984 for 1-day/week season pass. June 29 - Sept 4, 2026. Up to 3 make-up sessions + Axis jersey included.',
  startDate:'2026-06-29', endDate:'2026-09-04',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:PEAK_ADDR, lat:LAT_KIRK, lng:LNG_KIRK,
  season:'Summer 2026', campType:'Summer Camp',
  repeating:'seasonal', enrollmentStatus:'Open', status:'Open',
  description:'Full-season 1-day/week pass for Axis Peak Adventures non-biking camp, children turning 6-12 in Whistler.',
});
newPrograms.push({ ...BASE,
  id:'axis-summer-peak512-dropin', name:'Axis Summer Peak Adventures Ages 5-12 Daily Drop In',
  activityType:'Multi-Sport', ageMin:5, ageMax:12,
  days:'Mon-Fri', cost:150,
  costNote:'$150 per day. Available June 29 - September 4, 2026.',
  startDate:'2026-06-29', endDate:'2026-09-04',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:PEAK_ADDR, lat:LAT_KIRK, lng:LNG_KIRK,
  season:'Summer 2026', campType:'Summer Camp',
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Drop-in day at Axis Peak Adventures non-biking camp for children turning 6-12 in Whistler.',
});
newPrograms.push({ ...BASE,
  id:'axis-summer-peak512-5day', name:'Axis Summer Peak Adventures Ages 5-12 Flexible 5-Day Package',
  activityType:'Multi-Sport', ageMin:5, ageMax:12,
  days:'Mon-Fri', cost:556,
  costNote:'$556 for any 5 days between June 29 - August 28, 2026. Email info@axisadventurecamps.com to book dates.',
  startDate:'2026-06-29', endDate:'2026-08-28',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:PEAK_ADDR, lat:LAT_KIRK, lng:LNG_KIRK,
  season:'Summer 2026', campType:'Summer Camp',
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Flexible 5-day package for Axis Peak Adventures non-biking camp, children turning 6-12 in Whistler.',
});

// ── GROUP 9: Summer Extended Day ─────────────────────────────────────────
newPrograms.push({ ...BASE,
  id:'axis-extended-day-summer', name:'Axis Summer 2026 Extended Day Program',
  activityType:'After Care', ageMin:3, ageMax:12,
  days:'Mon-Fri', cost:29.50,
  costNote:'$29.50 per session. Extended care after main camp starting at 3:15 PM. June 29 - September 4, 2026.',
  startDate:'2026-06-29', endDate:'2026-09-04',
  startTime:'3:15 PM', endTime:'5:00 PM',
  address:BIKING_3_5_ADDR, lat:LAT_FITS, lng:LNG_FITS,
  season:'Summer 2026', campType:'Summer Camp',
  scheduleType:'Part Day', dayLength:'Part Day', durationPerDay:1.75,
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Extended afternoon care add-on available after the main Axis summer camp day. $29.50 per session, beginning at 3:15 PM. Available throughout Summer 2026 (June 29 - September 4).',
});

// ── GROUP 10: Spring 2026 Programs ───────────────────────────────────────
const sprPasses = [
  { id:'axis-spring-mw', name:'Axis Spring 2026 Mon/Wed Season Pass', days:'Mon, Wed', cost:2160, startDate:'2026-04-06', endDate:'2026-06-24', enrollmentStatus:'Open', costNote:'$2,160 for full spring season (Mon/Wed), April 6 - June 24, 2026. 24 sessions. Up to 4 make-up sessions + Axis jersey included.' },
  { id:'axis-spring-tth', name:'Axis Spring 2026 Tue/Thu Season Pass', days:'Tue, Thu', cost:2160, startDate:'2026-04-07', endDate:'2026-06-25', enrollmentStatus:'Open', costNote:'$2,160 for full spring season (Tue/Thu), April 7 - June 25, 2026. 24 sessions. Up to 4 make-up sessions + Axis jersey included.' },
  { id:'axis-spring-mon', name:'Axis Spring 2026 Monday Only Season Pass', days:'Mon', cost:1182, startDate:'2026-04-06', endDate:'2026-06-22', enrollmentStatus:'Full', costNote:'$1,182 for full spring season (Mondays), April 6 - June 22, 2026. 12 sessions. SOLD OUT as of April 2026.' },
  { id:'axis-spring-tue', name:'Axis Spring 2026 Tuesday Only Season Pass', days:'Tue', cost:1182, startDate:'2026-04-07', endDate:'2026-06-23', enrollmentStatus:'Open', costNote:'$1,182 for full spring season (Tuesdays), April 7 - June 23, 2026. 12 sessions. Up to 3 make-up sessions + Axis jersey included.' },
  { id:'axis-spring-wed', name:'Axis Spring 2026 Wednesday Only Season Pass', days:'Wed', cost:1182, startDate:'2026-04-08', endDate:'2026-06-24', enrollmentStatus:'Open', costNote:'$1,182 for full spring season (Wednesdays), April 8 - June 24, 2026. 12 sessions. Up to 3 make-up sessions + Axis jersey included.' },
  { id:'axis-spring-thu', name:'Axis Spring 2026 Thursday Only Season Pass', days:'Thu', cost:1182, startDate:'2026-04-09', endDate:'2026-06-25', enrollmentStatus:'Open', costNote:'$1,182 for full spring season (Thursdays), April 9 - June 25, 2026. 12 sessions. Up to 3 make-up sessions + Axis jersey included.' },
];
sprPasses.forEach(p => {
  newPrograms.push({ ...BASE, ...p,
    activityType:'Mountain Biking', ageMin:3, ageMax:12,
    startTime:'8:30 AM', endTime:'3:00 PM',
    address:SPRING_FALL_ADDR, lat:LAT_FITS, lng:LNG_FITS,
    season:'Spring 2026', campType:'Spring Camp',
    repeating:'seasonal', status: p.enrollmentStatus,
    description:'Spring mountain biking and multi-sport day camp in Whistler. Biking in morning, outdoor activities (paddle boarding, ball sports, nature exploration) in afternoon. Children must turn 3 before June 25, 2026.',
  });
});

newPrograms.push({ ...BASE,
  id:'axis-spring-dropin', name:'Axis Spring 2026 Daily Drop In',
  activityType:'Mountain Biking', ageMin:3, ageMax:12,
  days:'Mon-Thu', cost:150,
  costNote:'$150 per day. Available Mon-Thu, April 6 - June 25, 2026. Note: Fridays not offered in spring season.',
  startDate:'2026-04-06', endDate:'2026-06-25',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:SPRING_FALL_ADDR, lat:LAT_FITS, lng:LNG_FITS,
  season:'Spring 2026', campType:'Spring Camp',
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Drop-in day at Axis Spring camp in Whistler. Available Mon-Thu, April 6 - June 25, 2026.',
});
newPrograms.push({ ...BASE,
  id:'axis-spring-5day', name:'Axis Spring 2026 Flexible 5-Day Package',
  activityType:'Mountain Biking', ageMin:3, ageMax:12,
  days:'Mon-Thu', cost:556,
  costNote:'$556 for any 5 full days within the spring season (April 6 - June 25, 2026). No Fridays. All days must be used by June 25. Email info@axisadventurecamps.com.',
  startDate:'2026-04-06', endDate:'2026-06-25',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:SPRING_FALL_ADDR, lat:LAT_FITS, lng:LNG_FITS,
  season:'Spring 2026', campType:'Spring Camp',
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Flexible 5-day spring camp package at Axis Adventure Camps, Whistler. Choose any 5 full days within the spring season.',
});
newPrograms.push({ ...BASE,
  id:'axis-extended-day-spring', name:'Axis Spring 2026 Extended Day Program',
  activityType:'After Care', ageMin:3, ageMax:12,
  days:'Mon-Thu', cost:30,
  costNote:'$30.00 per session. Extended afternoon care starting at 3:15 PM. April 6 - June 25, 2026.',
  startDate:'2026-04-06', endDate:'2026-06-25',
  startTime:'3:15 PM', endTime:'5:00 PM',
  address:SPRING_FALL_ADDR, lat:LAT_FITS, lng:LNG_FITS,
  season:'Spring 2026', campType:'Spring Camp',
  scheduleType:'Part Day', dayLength:'Part Day', durationPerDay:1.75,
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Extended afternoon care add-on available after the main Axis spring camp. $30.00 per session, starting 3:15 PM. Available April 6 - June 25, 2026.',
});

// ── GROUP 11: Fall 2026 Programs ─────────────────────────────────────────
const fallPasses = [
  { id:'axis-fall-mw', name:'Axis Fall 2026 Mon/Wed Season Pass', days:'Mon, Wed', cost:2344, startDate:'2026-08-31', endDate:'2026-11-25', costNote:'$2,344 for full fall season (Mon/Wed), Aug 31 - Nov 25, 2026. 26 sessions. Up to 4 make-up sessions + Axis jersey included.' },
  { id:'axis-fall-tth', name:'Axis Fall 2026 Tue/Thu Season Pass', days:'Tue, Thu', cost:2344, startDate:'2026-09-01', endDate:'2026-11-26', costNote:'$2,344 for full fall season (Tue/Thu), Sept 1 - Nov 26, 2026. 26 sessions. Up to 4 make-up sessions + Axis jersey included.' },
  { id:'axis-fall-mon', name:'Axis Fall 2026 Monday Only Season Pass', days:'Mon', cost:1279, startDate:'2026-08-31', endDate:'2026-11-23', costNote:'$1,279 for full fall season (Mondays), Aug 31 - Nov 23, 2026. 13 sessions. Up to 4 make-up sessions + Axis jersey included.' },
  { id:'axis-fall-tue', name:'Axis Fall 2026 Tuesday Only Season Pass', days:'Tue', cost:1279, startDate:'2026-09-01', endDate:'2026-11-24', costNote:'$1,279 for full fall season (Tuesdays), Sept 1 - Nov 24, 2026. 13 sessions. Up to 4 make-up sessions + Axis jersey included.' },
  { id:'axis-fall-wed', name:'Axis Fall 2026 Wednesday Only Season Pass', days:'Wed', cost:1279, startDate:'2026-09-02', endDate:'2026-11-25', costNote:'$1,279 for full fall season (Wednesdays), Sept 2 - Nov 25, 2026. 13 sessions. Up to 4 make-up sessions + Axis jersey included.' },
  { id:'axis-fall-thu', name:'Axis Fall 2026 Thursday Only Season Pass', days:'Thu', cost:1279, startDate:'2026-09-03', endDate:'2026-11-26', costNote:'$1,279 for full fall season (Thursdays), Sept 3 - Nov 26, 2026. 13 sessions. Up to 4 make-up sessions + Axis jersey included.' },
];
fallPasses.forEach(p => {
  newPrograms.push({ ...BASE, ...p,
    activityType:'Mountain Biking', ageMin:3, ageMax:12,
    startTime:'8:30 AM', endTime:'3:00 PM',
    address:SPRING_FALL_ADDR, lat:LAT_FITS, lng:LNG_FITS,
    season:'Fall 2026', campType:'Fall Camp',
    repeating:'seasonal', enrollmentStatus:'Open', status:'Open',
    description:'Fall mountain biking and multi-sport day camp in Whistler. Biking through October (rain or shine), transitioning to 2 sports/day for November including paddle boarding, soccer, tennis, and gymnastics. Children must turn 3 before November 26, 2026.',
  });
});

newPrograms.push({ ...BASE,
  id:'axis-fall-dropin', name:'Axis Fall 2026 Daily Drop In',
  activityType:'Mountain Biking', ageMin:3, ageMax:12,
  days:'Mon-Thu', cost:150,
  costNote:'$150 per day. Available Mon-Thu, August 31 - November 26, 2026. No Fridays in fall season.',
  startDate:'2026-08-31', endDate:'2026-11-26',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:SPRING_FALL_ADDR, lat:LAT_FITS, lng:LNG_FITS,
  season:'Fall 2026', campType:'Fall Camp',
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Drop-in day at Axis Fall camp in Whistler. Available Mon-Thu, Aug 31 - Nov 26, 2026.',
});
newPrograms.push({ ...BASE,
  id:'axis-fall-5day', name:'Axis Fall 2026 Flexible 5-Day Package',
  activityType:'Mountain Biking', ageMin:3, ageMax:12,
  days:'Mon-Thu', cost:556,
  costNote:'$556 for any 5 full days between Aug 31 - Nov 26, 2026. No Fridays. All days must be used by November 26. Email info@axisadventurecamps.com.',
  startDate:'2026-08-31', endDate:'2026-11-26',
  startTime:'8:30 AM', endTime:'3:00 PM',
  address:SPRING_FALL_ADDR, lat:LAT_FITS, lng:LNG_FITS,
  season:'Fall 2026', campType:'Fall Camp',
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Flexible 5-day fall camp package at Axis Adventure Camps, Whistler. Choose any 5 full days within the fall season (Aug 31 - Nov 26).',
});
newPrograms.push({ ...BASE,
  id:'axis-extended-day-fall', name:'Axis Fall 2026 Extended Day Program',
  activityType:'After Care', ageMin:3, ageMax:12,
  days:'Mon-Thu', cost:29.50,
  costNote:'$29.50 per session. Extended afternoon care starting at 3:15 PM. September 7 - November 26, 2026.',
  startDate:'2026-09-07', endDate:'2026-11-26',
  startTime:'3:15 PM', endTime:'5:00 PM',
  address:SPRING_FALL_ADDR, lat:LAT_FITS, lng:LNG_FITS,
  season:'Fall 2026', campType:'Fall Camp',
  scheduleType:'Part Day', dayLength:'Part Day', durationPerDay:1.75,
  repeating:'flexible', enrollmentStatus:'Open', status:'Open',
  description:'Extended afternoon care add-on available after the main Axis fall camp. $29.50 per session, starting 3:15 PM. Available September 7 - November 26, 2026.',
});

console.log(`Generated ${newPrograms.length} new Axis programs`);

const final = [...filtered, ...newPrograms];
fs.writeFileSync(programsPath, JSON.stringify(final, null, 2));
console.log(`Total programs: ${final.length}`);
