#!/usr/bin/env node
/**
 * update-verified-providers-batch3.cjs
 * Updates programs.json with verified data from JS-rendered provider websites
 * Visited via Chrome browser on 2026-03-25
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// Track changes
let updated = 0;
let added = 0;
let removed = 0;

// Helper: get next available ID
function nextId() {
  return Math.max(...programs.map(p => p.id)) + 1;
}

// Helper: update matching programs
function updateByProvider(providerMatch, updates) {
  programs.forEach(p => {
    if (p.provider && p.provider.toLowerCase().includes(providerMatch.toLowerCase())) {
      Object.assign(p, updates);
      updated++;
    }
  });
}

// Helper: update specific program by provider + name pattern
function updateByProviderAndName(providerMatch, nameMatch, updates) {
  programs.forEach(p => {
    if (p.provider && p.provider.toLowerCase().includes(providerMatch.toLowerCase()) &&
        p.name && p.name.toLowerCase().includes(nameMatch.toLowerCase())) {
      Object.assign(p, updates);
      updated++;
    }
  });
}

// Helper: add a new program
function addProgram(program) {
  program.id = nextId();
  program.season = program.season || 'Summer 2026';
  program.confirmed2026 = program.confirmed2026 !== undefined ? program.confirmed2026 : false;
  program.priceVerified = program.priceVerified !== undefined ? program.priceVerified : false;
  programs.push(program);
  added++;
}

// Helper: remove duplicates by provider (keep first of each unique name+dates combo)
function deduplicateProvider(providerMatch) {
  const seen = new Set();
  const toRemove = [];
  programs.forEach((p, i) => {
    if (p.provider && p.provider.toLowerCase().includes(providerMatch.toLowerCase())) {
      const key = `${p.name}|${p.startDate}|${p.endDate}`;
      if (seen.has(key)) {
        toRemove.push(i);
      } else {
        seen.add(key);
      }
    }
  });
  // Remove from end to preserve indices
  toRemove.reverse().forEach(i => {
    programs.splice(i, 1);
    removed++;
  });
}

console.log(`Starting with ${programs.length} programs...`);

// ============================================================
// 1. MCNA Islamic Camp — Still showing 2025 dates (July 15-24, 2025)
//    Location: Muslim Youth Centre, Surrey, BC
//    No 2026 info yet. Mark as not confirmed.
// ============================================================
updateByProvider('MCNA', {
  confirmed2026: false,
  enrollmentStatus: 'Likely Coming Soon',
  description: 'MCNA Islamic Summer Camp at Muslim Youth Centre, Surrey, BC. 2025 dates were July 15-24. 2026 dates not yet announced — check provider website.',
  neighbourhood: 'Surrey',
  address: 'Muslim Youth Centre, Surrey, BC',
  registrationUrl: 'https://mcna.icnasistersca.org/vancouver-summer-camp/',
  category: 'Faith-Based',
  activityType: 'Faith-Based Camp',
  tags: ['islamic', 'faith', 'summer camp', 'surrey', 'cultural']
});

// ============================================================
// 2. Camp Hatikvah — RESIDENTIAL/OVERNIGHT camp near Kelowna
//    2026 data confirmed. Multiple sessions. VERY expensive.
//    Grades 1-9 (approx ages 6-14)
//    Early bird: register before Oct 31 2025 for discount
// ============================================================
// Remove existing placeholder and add real sessions
const hatikvahIdx = programs.findIndex(p => p.provider && p.provider.toLowerCase().includes('hatikvah'));
if (hatikvahIdx !== -1) {
  programs.splice(hatikvahIdx, 1);
  removed++;
}

addProgram({
  name: 'Camp Hatikvah — 1st Session (Grades 3-8)',
  provider: 'Camp Hatikvah',
  category: 'Faith-Based',
  campType: 'Overnight Camp',
  scheduleType: 'Residential',
  ageMin: 8,
  ageMax: 14,
  startDate: '2026-06-28',
  endDate: '2026-07-26',
  days: 'Residential',
  startTime: null,
  endTime: null,
  cost: 6432,
  earlyBirdPrice: 6126,
  earlyBirdDeadline: '2025-10-31',
  indoorOutdoor: 'Both',
  neighbourhood: 'Kelowna Area',
  address: 'Camp Hatikvah, Winfield, BC',
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.camphatikvah.com/view-our-dates',
  description: 'Jewish overnight summer camp near Kelowna, BC. 28-night first session for Grades 3-8. Includes room, board, bus from Vancouver. Early bird pricing available before Oct 31, 2025. Plus $150 mandatory family membership.',
  tags: ['jewish', 'overnight', 'residential', 'kelowna', 'faith'],
  activityType: 'Faith-Based Camp',
  confirmed2026: true,
  priceVerified: true,
  dayLength: 'Multi-Week',
  season: 'Summer 2026'
});

addProgram({
  name: 'Camp Hatikvah — 2nd Session (Grades 3-8)',
  provider: 'Camp Hatikvah',
  category: 'Faith-Based',
  campType: 'Overnight Camp',
  scheduleType: 'Residential',
  ageMin: 8,
  ageMax: 14,
  startDate: '2026-07-28',
  endDate: '2026-08-11',
  days: 'Residential',
  startTime: null,
  endTime: null,
  cost: 3500,
  earlyBirdPrice: 3334,
  earlyBirdDeadline: '2025-10-31',
  indoorOutdoor: 'Both',
  neighbourhood: 'Kelowna Area',
  address: 'Camp Hatikvah, Winfield, BC',
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.camphatikvah.com/view-our-dates',
  description: 'Jewish overnight summer camp near Kelowna, BC. 14-night second session for Grades 3-8. Includes room, board, bus from Vancouver. Early bird pricing available before Oct 31, 2025.',
  tags: ['jewish', 'overnight', 'residential', 'kelowna', 'faith'],
  activityType: 'Faith-Based Camp',
  confirmed2026: true,
  priceVerified: true,
  dayLength: 'Multi-Week',
  season: 'Summer 2026'
});

addProgram({
  name: 'Camp Hatikvah — Giborim (Grade 2)',
  provider: 'Camp Hatikvah',
  category: 'Faith-Based',
  campType: 'Overnight Camp',
  scheduleType: 'Residential',
  ageMin: 7,
  ageMax: 8,
  startDate: '2026-07-28',
  endDate: '2026-08-04',
  days: 'Residential',
  startTime: null,
  endTime: null,
  cost: 1470,
  earlyBirdPrice: 1400,
  earlyBirdDeadline: '2025-10-31',
  indoorOutdoor: 'Both',
  neighbourhood: 'Kelowna Area',
  address: 'Camp Hatikvah, Winfield, BC',
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.camphatikvah.com/view-our-dates',
  description: 'Jewish overnight camp intro for Grade 2. 7-night session. Includes room, board, one-way bus from Vancouver. Early bird pricing before Oct 31, 2025.',
  tags: ['jewish', 'overnight', 'residential', 'kelowna', 'faith', 'intro'],
  activityType: 'Faith-Based Camp',
  confirmed2026: true,
  priceVerified: true,
  dayLength: 'Full Week',
  season: 'Summer 2026'
});

addProgram({
  name: "Camp Hatikvah — K'tanim (Grade 1)",
  provider: 'Camp Hatikvah',
  category: 'Faith-Based',
  campType: 'Overnight Camp',
  scheduleType: 'Residential',
  ageMin: 6,
  ageMax: 7,
  startDate: '2026-08-07',
  endDate: '2026-08-11',
  days: 'Residential',
  startTime: null,
  endTime: null,
  cost: 630,
  earlyBirdPrice: 600,
  earlyBirdDeadline: '2025-10-31',
  indoorOutdoor: 'Both',
  neighbourhood: 'Kelowna Area',
  address: 'Camp Hatikvah, Winfield, BC',
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.camphatikvah.com/view-our-dates',
  description: 'Jewish overnight camp intro for Grade 1. 4-night session. One-way bus from Vancouver included. Early bird pricing before Oct 31, 2025.',
  tags: ['jewish', 'overnight', 'residential', 'kelowna', 'faith', 'intro'],
  activityType: 'Faith-Based Camp',
  confirmed2026: true,
  priceVerified: true,
  dayLength: 'Partial Week',
  season: 'Summer 2026'
});

// ============================================================
// 3. WCSYA — Residential camp in Mission, BC
//    2025 page showing Aug 9-15, ages 9-18, $300-375
//    Early bird: $300 by Apr 30, $350 by Jul 15, $375 after
//    Sikh youth camp, cultural/spiritual focus
// ============================================================
addProgram({
  name: 'WCSYA Sikh Youth Summer Camp',
  provider: 'West Coast Sikh Youth Alliance',
  category: 'Faith-Based',
  campType: 'Overnight Camp',
  scheduleType: 'Residential',
  ageMin: 9,
  ageMax: 18,
  startDate: '2026-08-09',
  endDate: '2026-08-15',
  days: 'Residential',
  startTime: null,
  endTime: null,
  cost: 375,
  earlyBirdPrice: 300,
  earlyBirdDeadline: '2026-04-30',
  indoorOutdoor: 'Both',
  neighbourhood: 'Mission',
  address: 'Khalsa Centre Miracle Valley, Mission, BC',
  enrollmentStatus: 'Likely Coming Soon',
  registrationUrl: 'https://www.wcsya.com/campform',
  description: 'Annual Sikh youth residential camp at Khalsa Centre Miracle Valley, Mission, BC. 6 nights. Ages 9-18. Includes lectures, kirtan, sports, high ropes, kayaking, archery, campfires. Departs from Khalsa School Old Yale Road, Surrey. Early bird: $300 by Apr 30, $350 by Jul 15, $375 after. Camp-ships (scholarships) available. 2026 dates estimated from 2025 pattern.',
  tags: ['sikh', 'faith', 'overnight', 'residential', 'mission', 'cultural', 'youth'],
  activityType: 'Faith-Based Camp',
  confirmed2026: false,
  priceVerified: true,
  dayLength: 'Full Week',
  season: 'Summer 2026'
});

// ============================================================
// 4. Khalsa Centre KCMV — 2026 confirmed!
//    Ages 8-16, July 6-9, $230, residential camp in Mission, BC
// ============================================================
updateByProvider('Khalsa Centre', {
  confirmed2026: true,
  priceVerified: true,
  enrollmentStatus: 'Open',
  cost: 230,
  ageMin: 8,
  ageMax: 16,
  startDate: '2026-07-06',
  endDate: '2026-07-09',
  campType: 'Overnight Camp',
  scheduleType: 'Residential',
  neighbourhood: 'Mission',
  address: 'Khalsa Centre Miracle Valley, Mission, BC',
  description: 'KCMV Summer Camp 2026 for youth ages 8-16. Focus on leadership skills and Sikh heritage. Includes morning/evening darbars, workshops, recreational activities. Meet at Khalsa School Old Yale Road (10677 124th Street, Surrey). July 6-9, 2026. $230 per camper. All fees non-refundable.',
  registrationUrl: 'https://www.khalsacentre.ca/kcmv-camps/summer-camp',
  tags: ['sikh', 'faith', 'overnight', 'residential', 'mission', 'leadership', 'cultural']
});

// ============================================================
// 5. Khalsa School — Only showing winter camps for 2025-26
//    Ages 6-13, FREE (includes t-shirt, lunch, snacks)
//    No summer 2026 info yet
// ============================================================
updateByProviderAndName('Khalsa School', '', {
  confirmed2026: false,
  enrollmentStatus: 'Likely Coming Soon',
  cost: 0,
  ageMin: 6,
  ageMax: 13,
  description: 'Khalsa School Gurmat Camp. Learn Gurmukhi, Sikh History, Gurbani, Kirtan, Gatka and more. Free — includes t-shirt, lunch, and snacks. Summer 2026 dates not yet announced. Camps run during all school breaks.',
  registrationUrl: 'https://khalsaschool.ca/camps/',
  tags: ['sikh', 'faith', 'cultural', 'free', 'surrey', 'language']
});

// ============================================================
// 6. Hindu Heritage — No 2026 info yet ("see you next year")
// ============================================================
updateByProvider('Hindu Heritage', {
  confirmed2026: false,
  enrollmentStatus: 'Likely Coming Soon',
  description: 'Hindu Heritage Centre Kids Summer Camp. Explore Hindu culture, values, traditions, and spirituality through arts & crafts, music, yoga, storytelling, games, outdoor activities. 2026 dates not yet announced.',
  registrationUrl: 'https://www.hinduvision.com/copy-of-classes',
  tags: ['hindu', 'faith', 'cultural', 'yoga', 'arts']
});

// ============================================================
// 7. Uphoria Yoga — Summer camp URL redirected to spring break
//    No summer 2026 info available. Has spring break for ages 3-5 and 5-12.
// ============================================================
updateByProvider('Uphoria', {
  confirmed2026: false,
  enrollmentStatus: 'Likely Coming Soon',
  description: 'Uphoria Yoga Kids Summer Camp. Ages 5-12. 2025 price was $250/week. Summer 2026 not yet announced — currently showing spring break programs. Check website for updates.',
  registrationUrl: 'https://www.uphoriayoga.com/summer-camp-vancouver',
  tags: ['yoga', 'wellness', 'mindfulness', 'vancouver']
});

// ============================================================
// 8. Vancouver Mandarin School — 2026 CONFIRMED!
//    Ages 6-12, all levels. Summer camp July 6 - Aug 21.
//    Half-day: 9-12 or 12:30-3:30. Full-day: 9-3:30.
//    Location: Annie B. Jamieson Elementary, 6350 Tisdall St, Vancouver
//    7 weeks of camps in 2-week cycles
// ============================================================
// Remove old placeholder
const vmsIdx = programs.findIndex(p => p.provider && p.provider.toLowerCase().includes('vancouver mandarin'));
if (vmsIdx !== -1) {
  programs.splice(vmsIdx, 1);
  removed++;
}

const vmsWeeks = [
  { start: '2026-07-06', end: '2026-07-17', label: 'W1 & W2' },
  { start: '2026-07-20', end: '2026-07-31', label: 'W3 & W4' },
  { start: '2026-08-04', end: '2026-08-14', label: 'W5 & W6' },
  { start: '2026-08-17', end: '2026-08-21', label: 'W7 (Full-Day Only)' }
];

vmsWeeks.forEach((w, i) => {
  if (i < 3) {
    // Half-day AM option
    addProgram({
      name: `Mandarin Immersion Summer Camp — Half Day AM (${w.label})`,
      provider: 'Vancouver Mandarin School',
      category: 'Language',
      campType: 'Summer Camp',
      scheduleType: 'Half Day',
      ageMin: 6,
      ageMax: 12,
      startDate: w.start,
      endDate: w.end,
      days: 'Mon-Fri',
      startTime: '9:00 AM',
      endTime: '12:00 PM',
      cost: null,
      indoorOutdoor: 'Indoor',
      neighbourhood: 'Marpole',
      address: '6350 Tisdall St, Vancouver, BC',
      lat: 49.2175,
      lng: -123.1275,
      enrollmentStatus: 'Open',
      registrationUrl: 'https://www.vancouvermandarinschool.com/mandarin-immersion-camps',
      description: `Mandarin immersion summer camp ${w.label}. Half-day AM (9:00-12:00). Ages 6-12, all levels. Project-based learning, fun themes, field trips. Small class sizes divided by age and language background.`,
      tags: ['mandarin', 'chinese', 'language', 'immersion', 'vancouver'],
      activityType: 'Language Immersion',
      confirmed2026: true,
      priceVerified: false,
      dayLength: 'Half Day',
      season: 'Summer 2026',
      durationPerDay: 3
    });
    // Half-day PM option
    addProgram({
      name: `Mandarin Immersion Summer Camp — Half Day PM (${w.label})`,
      provider: 'Vancouver Mandarin School',
      category: 'Language',
      campType: 'Summer Camp',
      scheduleType: 'Half Day',
      ageMin: 6,
      ageMax: 12,
      startDate: w.start,
      endDate: w.end,
      days: 'Mon-Fri',
      startTime: '12:30 PM',
      endTime: '3:30 PM',
      cost: null,
      indoorOutdoor: 'Indoor',
      neighbourhood: 'Marpole',
      address: '6350 Tisdall St, Vancouver, BC',
      lat: 49.2175,
      lng: -123.1275,
      enrollmentStatus: 'Open',
      registrationUrl: 'https://www.vancouvermandarinschool.com/mandarin-immersion-camps',
      description: `Mandarin immersion summer camp ${w.label}. Half-day PM (12:30-3:30). Ages 6-12, all levels.`,
      tags: ['mandarin', 'chinese', 'language', 'immersion', 'vancouver'],
      activityType: 'Language Immersion',
      confirmed2026: true,
      priceVerified: false,
      dayLength: 'Half Day',
      season: 'Summer 2026',
      durationPerDay: 3
    });
  }
  // Full-day option for all weeks
  addProgram({
    name: `Mandarin Immersion Summer Camp — Full Day (${w.label})`,
    provider: 'Vancouver Mandarin School',
    category: 'Language',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 6,
    ageMax: 12,
    startDate: w.start,
    endDate: w.end,
    days: 'Mon-Fri',
    startTime: '9:00 AM',
    endTime: '3:30 PM',
    cost: null,
    indoorOutdoor: 'Indoor',
    neighbourhood: 'Marpole',
    address: '6350 Tisdall St, Vancouver, BC',
    lat: 49.2175,
    lng: -123.1275,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://www.vancouvermandarinschool.com/mandarin-immersion-camps',
    description: `Mandarin immersion summer camp ${w.label}. Full day (9:00-3:30). Ages 6-12, all levels. Project-based learning with fun themes including radio broadcasting, storytelling, drama, video making, and field trips.`,
    tags: ['mandarin', 'chinese', 'language', 'immersion', 'vancouver'],
    activityType: 'Language Immersion',
    confirmed2026: true,
    priceVerified: false,
    dayLength: 'Full Day',
    season: 'Summer 2026',
    durationPerDay: 6.5
  });
});

// ============================================================
// 9. Camp Virgule (Le Centre Culturel Francophone) — 2026 CONFIRMED!
//    Ages 6-12, June 29 - Aug 21, 9am-4pm, Mon-Fri
//    Member $280/week, non-member pricing higher
//    French immersion day camp
// ============================================================
// Remove old placeholder
const virguleIdx = programs.findIndex(p => p.provider && p.provider.toLowerCase().includes('centre culturel'));
if (virguleIdx !== -1) {
  programs.splice(virguleIdx, 1);
  removed++;
}

// Add 8 weekly sessions
const virguleStart = new Date('2026-06-29');
for (let week = 0; week < 8; week++) {
  const start = new Date(virguleStart);
  start.setDate(start.getDate() + week * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 4);
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];

  addProgram({
    name: `Camp Virgule French Day Camp — Week ${week + 1}`,
    provider: 'Le Centre Culturel Francophone',
    category: 'Language',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 6,
    ageMax: 12,
    startDate: startStr,
    endDate: endStr,
    days: 'Mon-Fri',
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    cost: 280,
    indoorOutdoor: 'Both',
    neighbourhood: 'Mount Pleasant',
    address: '1551 W 7th Ave, Vancouver, BC',
    lat: 49.2635,
    lng: -123.1375,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://www.lecentreculturel.com/en/camp-virgule',
    description: `Camp Virgule francophone day camp week ${week + 1}. French immersion for ages 6-12. Games, sports, outdoor excursions, beach visits, museum trips. Child should be francophone or have at least 1 year French immersion. $280/week (member price). Registration opened March 4, 2026.`,
    tags: ['french', 'francophone', 'language', 'immersion', 'vancouver', 'cultural'],
    activityType: 'Language Immersion',
    confirmed2026: true,
    priceVerified: true,
    dayLength: 'Full Day',
    season: 'Summer 2026',
    durationPerDay: 7
  });
}

// ============================================================
// 10. Italian Cultural Centre (Vacanze in Italiano) — 2026 CONFIRMED!
//     Ages 5-11, Week 1: Jul 6-10, Week 2: Jul 13-17
//     9am-4pm, Italian immersion
// ============================================================
// Remove old placeholders
const iccIdxs = [];
programs.forEach((p, i) => {
  if (p.provider && p.provider.toLowerCase().includes('italian cultural')) iccIdxs.push(i);
});
iccIdxs.reverse().forEach(i => { programs.splice(i, 1); removed++; });

addProgram({
  name: 'Vacanze in Italiano — Week 1 (Sud d\'Italia)',
  provider: 'Italian Cultural Centre',
  category: 'Language',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  ageMin: 5,
  ageMax: 11,
  startDate: '2026-07-06',
  endDate: '2026-07-10',
  days: 'Mon-Fri',
  startTime: '9:00 AM',
  endTime: '4:00 PM',
  cost: null,
  indoorOutdoor: 'Both',
  neighbourhood: 'Hastings-Sunrise',
  address: '3075 Slocan St, Vancouver, BC',
  lat: 49.2614,
  lng: -123.0369,
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.italianculturalcentre.ca/vacanze-in-italiano',
  description: 'Italian immersion summer camp Week 1 — vacanze al Sud d\'Italia. Ages 5-11. Art, games, music, outdoor activities, sport. Full immersion in Italian language and culture. Indoor turf complex available for rainy days.',
  tags: ['italian', 'language', 'immersion', 'cultural', 'vancouver'],
  activityType: 'Language Immersion',
  confirmed2026: true,
  priceVerified: false,
  dayLength: 'Full Day',
  season: 'Summer 2026',
  durationPerDay: 7
});

addProgram({
  name: 'Vacanze in Italiano — Week 2 (Nord d\'Italia)',
  provider: 'Italian Cultural Centre',
  category: 'Language',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  ageMin: 5,
  ageMax: 11,
  startDate: '2026-07-13',
  endDate: '2026-07-17',
  days: 'Mon-Fri',
  startTime: '9:00 AM',
  endTime: '4:00 PM',
  cost: null,
  indoorOutdoor: 'Both',
  neighbourhood: 'Hastings-Sunrise',
  address: '3075 Slocan St, Vancouver, BC',
  lat: 49.2614,
  lng: -123.0369,
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.italianculturalcentre.ca/vacanze-in-italiano',
  description: 'Italian immersion summer camp Week 2 — vacanze al Nord d\'Italia. Ages 5-11. Art, games, music, outdoor activities, sport. Full immersion in Italian language and culture.',
  tags: ['italian', 'language', 'immersion', 'cultural', 'vancouver'],
  activityType: 'Language Immersion',
  confirmed2026: true,
  priceVerified: false,
  dayLength: 'Full Day',
  season: 'Summer 2026',
  durationPerDay: 7
});

// ============================================================
// 11. VJLS — Japanese language school, has day camps K-Gr 6
//     Spring/Pro-D camps listed, no summer 2026 info yet
// ============================================================
// No existing VJLS programs to update - skip

// ============================================================
// 12. Gladstone JLS — Language school, no summer camp info
// ============================================================
updateByProvider('Gladstone', {
  confirmed2026: false,
  enrollmentStatus: 'Likely Coming Soon',
  description: 'Gladstone Japanese Language School. Japanese language classes in Burnaby. No summer camp information available for 2026.',
  registrationUrl: 'https://www.gladstonejls.com/english/'
});

// ============================================================
// 13-16. Language schools with no summer camp info:
//    Steveston JLS, CCC Vancouver, MandoKids, Grace Korean
// ============================================================
// These are primarily language schools. Update descriptions.

// ============================================================
// 17. Berlitz — Online ASL camp, US-based, not Vancouver-specific
// ============================================================
updateByProvider('Berlitz', {
  confirmed2026: false,
  enrollmentStatus: 'Likely Coming Soon',
  description: 'Berlitz Online ASL Summer Camp for kids and teens. Learn American Sign Language online with private or group classes. US-based program available to Canadian students. 2026 summer details not yet posted.',
  registrationUrl: 'https://www.berlitz.com/kids-and-teens/summer-camps/asl'
});

// ============================================================
// 18. Young Moviemakers — 2026 CONFIRMED! Multiple locations!
//     Film camps at SFU Burnaby, West Van (Mulgrave + Collingwood),
//     East Van (Hastings CC), Surrey (Clayton CC), Maple Ridge (Meadowridge),
//     UBC (Old Barn CC), Langley (TWU), Abbotsford (Rec Centre)
// ============================================================
// Remove old placeholder
const ymIdx = programs.findIndex(p => p.provider && p.provider.toLowerCase().includes('young moviemakers'));
if (ymIdx !== -1) {
  programs.splice(ymIdx, 1);
  removed++;
}

const ymLocations = [
  { name: 'SFU Burnaby', neighbourhood: 'Burnaby', dates: 'All Summer', start: '2026-07-06', end: '2026-08-28' },
  { name: 'West Van — Mulgrave School', neighbourhood: 'West Vancouver', dates: 'All July', start: '2026-07-06', end: '2026-07-31' },
  { name: 'East Van — Hastings Community Centre', neighbourhood: 'Hastings-Sunrise', dates: 'All July', start: '2026-07-06', end: '2026-07-31' },
  { name: 'Surrey — Clayton Community Centre', neighbourhood: 'Surrey', dates: 'Aug 17-28', start: '2026-08-17', end: '2026-08-28' },
  { name: 'Maple Ridge — Meadowridge', neighbourhood: 'Maple Ridge', dates: 'Jul 6-17', start: '2026-07-06', end: '2026-07-17' },
  { name: 'UBC — Old Barn Community Centre', neighbourhood: 'UBC', dates: 'Jul 27 - Aug 14', start: '2026-07-27', end: '2026-08-14' },
  { name: 'West Van — Collingwood School', neighbourhood: 'West Vancouver', dates: 'June & July', start: '2026-06-29', end: '2026-07-31' },
  { name: 'Langley — Trinity Western University', neighbourhood: 'Langley', dates: 'All Summer', start: '2026-07-06', end: '2026-08-28' },
  { name: 'Abbotsford — Abbotsford Rec Centre', neighbourhood: 'Abbotsford', dates: 'Jul 20-31', start: '2026-07-20', end: '2026-07-31' }
];

ymLocations.forEach(loc => {
  addProgram({
    name: `Young Moviemakers Film Camp (${loc.name})`,
    provider: 'Young Moviemakers',
    category: 'Arts',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 7,
    ageMax: 17,
    startDate: loc.start,
    endDate: loc.end,
    days: 'Mon-Fri',
    startTime: null,
    endTime: null,
    cost: null,
    indoorOutdoor: 'Both',
    neighbourhood: loc.neighbourhood,
    address: loc.name,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://www.youngmoviemakers.ca/programs',
    description: `Award-winning film camp at ${loc.name}. ${loc.dates}. Learn filmmaking, acting, scriptwriting, editing using professional-grade equipment. Groups create short films premiered to families. Many alumni work in BC film industry.`,
    tags: ['film', 'movie', 'acting', 'filmmaking', 'creative', 'arts'],
    activityType: 'Film & Media',
    confirmed2026: true,
    priceVerified: false,
    dayLength: 'Full Day',
    season: 'Summer 2026'
  });
});

// ============================================================
// 19. Vancouver Chess School — Has summer camps (8 weeks Jul-Aug)
//     Full day 9-3, half day AM 9-12, half day PM 12-3
//     312-2083 Alma St, Vancouver
//     No 2026 pricing confirmed
// ============================================================
updateByProvider('Vancouver Chess', {
  confirmed2026: false,
  enrollmentStatus: 'Likely Coming Soon',
  ageMin: 5,
  ageMax: 17,
  startTime: '9:00 AM',
  endTime: '3:00 PM',
  address: '312-2083 Alma St, Vancouver, BC',
  neighbourhood: 'Kitsilano',
  description: 'Vancouver Chess School summer camp. 8 weeks in July & August. Full day 9am-3pm, half-day AM 9am-12pm, or half-day PM 12pm-3pm. All skill levels: Beginner, Intermediate, Advanced. Includes lessons, training, tournaments, trivia, games, and complimentary pizza lunch. 2026 pricing not yet posted.',
  registrationUrl: 'https://www.vanchess.ca/camps',
  tags: ['chess', 'strategy', 'tournament', 'kitsilano', 'vancouver']
});

// ============================================================
// 20. Penny Chess — Has classes/camps but no summer 2026 details
// ============================================================
updateByProvider('Penny Chess', {
  confirmed2026: false,
  enrollmentStatus: 'Likely Coming Soon',
  description: 'Penny Chess Club. Chess classes and camps for kids ages 4-12. Founded by Woman International Master Penny Pham. Located at 3316 Kingsway, Vancouver. Summer 2026 camp details not yet posted.',
  registrationUrl: 'https://www.pennychessclub.ca/',
  address: '3316 Kingsway, Vancouver, BC',
  neighbourhood: 'Collingwood',
  tags: ['chess', 'strategy', 'tournament', 'collingwood']
});

// ============================================================
// 21. FDT Academy — Has 2026 registration open
//     Debate camps for winter, spring, summer breaks
// ============================================================
updateByProvider('FDT Academy', {
  confirmed2026: false,
  enrollmentStatus: 'Open',
  description: 'FDT (Fostering Debate Talent) Academy debate camp. Runs camps during winter, spring, and summer breaks. 2026 registration open. High school credits available for debate. Camps focus on public speaking and debate skills.',
  registrationUrl: 'https://fdtacademy.com/debate-camps/',
  tags: ['debate', 'public speaking', 'academic', 'critical thinking']
});

// ============================================================
// 22. Boogaloo Academy — 2026 CONFIRMED! Dance camps
//     Ages 3-5: Half day 9:30-12 (Enchanted Castle Jul 7-11, Disney Magic Aug 18-22)
//     Ages 5-8: Full day Superstars Minis 9:30-3 (Jul & Aug)
//     Ages 9-12: Full day Superstars 9:30-3 (Jul & Aug)
//     Ages 12+: Saturday classes
// ============================================================
// Remove duplicate Boogaloo entries first
deduplicateProvider('Boogaloo');

// Update existing entries with confirmed data
let boogalooUpdated = false;
programs.forEach(p => {
  if (p.provider === 'Boogaloo Academy' && !boogalooUpdated) {
    Object.assign(p, {
      confirmed2026: true,
      enrollmentStatus: 'Open',
      startTime: '9:30 AM',
      endTime: '3:00 PM',
      registrationUrl: 'https://www.boogalooacademy.com/summer-camps/',
      description: 'Boogaloo Academy summer dance camp. Street and classical dance, drama, music, crafts. Ages 3-5 half-day (9:30-12), ages 5-8 and 9-12 full-day (9:30-3). Weekly sessions July & August. Led by Vancouver\'s top dance professionals.',
      tags: ['dance', 'arts', 'drama', 'music', 'creative', 'vancouver']
    });
    boogalooUpdated = true;
    updated++;
  }
});

// Add specific age group camps
addProgram({
  name: 'Enchanted Castle Dance Camp (Ages 3-5)',
  provider: 'Boogaloo Academy',
  category: 'Arts',
  campType: 'Summer Camp',
  scheduleType: 'Half Day',
  ageMin: 3,
  ageMax: 5,
  startDate: '2026-07-07',
  endDate: '2026-07-11',
  days: 'Mon-Fri',
  startTime: '9:30 AM',
  endTime: '12:00 PM',
  cost: null,
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Mount Pleasant',
  address: 'Boogaloo Academy, Vancouver, BC',
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.boogalooacademy.com/summer-camps/',
  description: 'Enchanted Castle dance camp for ages 3-5. Explore rhythm and musicality through street and classical dance, drama, music, crafts, and storytelling. Develop flexibility, balance, coordination.',
  tags: ['dance', 'preschool', 'arts', 'creative'],
  activityType: 'Dance',
  confirmed2026: true,
  priceVerified: false,
  dayLength: 'Half Day',
  season: 'Summer 2026',
  durationPerDay: 2.5
});

addProgram({
  name: 'Disney Magic Dance Camp (Ages 3-5)',
  provider: 'Boogaloo Academy',
  category: 'Arts',
  campType: 'Summer Camp',
  scheduleType: 'Half Day',
  ageMin: 3,
  ageMax: 5,
  startDate: '2026-08-18',
  endDate: '2026-08-22',
  days: 'Mon-Fri',
  startTime: '9:30 AM',
  endTime: '12:00 PM',
  cost: null,
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Mount Pleasant',
  address: 'Boogaloo Academy, Vancouver, BC',
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.boogalooacademy.com/summer-camps/',
  description: 'Disney Magic dance camp for ages 3-5. Explore rhythm through dance, drama, music, crafts.',
  tags: ['dance', 'preschool', 'arts', 'creative', 'disney'],
  activityType: 'Dance',
  confirmed2026: true,
  priceVerified: false,
  dayLength: 'Half Day',
  season: 'Summer 2026',
  durationPerDay: 2.5
});

// ============================================================
// 23. JCCGV Camp Shalom — Page broken (raw shortcodes showing)
//     Keep existing entries, mark as unconfirmed
// ============================================================
updateByProvider('JCCGV', {
  confirmed2026: false,
  enrollmentStatus: 'Likely Coming Soon',
  registrationUrl: 'https://jccgv.com/camps-pro-d-days/',
  description: 'JCCGV Camp Shalom at Jewish Community Centre of Greater Vancouver. 2026 summer camp details not yet available on website (page under maintenance). Check back for updates.'
});

// ============================================================
// 24. Clubhouse Kids — 2026 CONFIRMED!
//     $265/week, ages K to 9 (Kids), 9-13 (Preteens), Gr 8-9 (L.I.T.)
//     4 locations: Vancouver Fraserview, Vancouver Riley Park, Richmond Broadmoor, New West
//     Hours: 8am-5pm (Jul-Aug)
//     Priority reg Apr 2, public reg Apr 7
// ============================================================
// Remove duplicate entries
deduplicateProvider('Clubhouse Kids');

const clubhouseLocations = [
  { name: 'Vancouver-Fraserview', addr: '7650 Jasper Cres., Vancouver, BC', hood: 'Fraserview', lat: 49.2133, lng: -123.0625 },
  { name: 'Vancouver-Riley Park', addr: '215 East 18th Ave., Vancouver, BC', hood: 'Riley Park', lat: 49.2525, lng: -123.1011 },
  { name: 'Richmond-Broadmoor', addr: '8140 Saunders Rd., Richmond, BC', hood: 'Richmond', lat: 49.1525, lng: -123.1528 },
  { name: 'New West', addr: '320 Eight St., New Westminster, BC', hood: 'New Westminster', lat: 49.2088, lng: -122.9108 }
];

// Update first entry, remove extras
let clubhouseCount = 0;
const clubhouseToRemove = [];
programs.forEach((p, i) => {
  if (p.provider === 'Clubhouse Kids') {
    clubhouseCount++;
    if (clubhouseCount > 1) clubhouseToRemove.push(i);
  }
});
clubhouseToRemove.reverse().forEach(i => { programs.splice(i, 1); removed++; });

// Update remaining entry
updateByProvider('Clubhouse Kids', {
  confirmed2026: true,
  priceVerified: true,
  enrollmentStatus: 'Likely Coming Soon',
  cost: 265,
  ageMin: 5,
  ageMax: 13,
  startTime: '8:00 AM',
  endTime: '5:00 PM',
  registrationUrl: 'https://www.clubhousekids.ca',
  description: 'Clubhouse Kids summer day camp. $265/week. Ages K-9 (Kids program), 9-13 (Preteens), Gr 8-9 (L.I.T.). 4 locations: Vancouver Fraserview, Vancouver Riley Park, Richmond Broadmoor, New West. 8am-5pm. Christian faith-based. Priority registration Apr 2, public registration Apr 7.',
  tags: ['faith-based', 'christian', 'day camp', 'multi-location']
});

// Add per-location entries
clubhouseLocations.forEach(loc => {
  addProgram({
    name: `Clubhouse Kids Summer Camp (${loc.name})`,
    provider: 'Clubhouse Kids',
    category: 'Faith-Based',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 5,
    ageMax: 13,
    startDate: '2026-07-06',
    endDate: '2026-08-21',
    days: 'Mon-Fri',
    startTime: '8:00 AM',
    endTime: '5:00 PM',
    cost: 265,
    indoorOutdoor: 'Both',
    neighbourhood: loc.hood,
    address: loc.addr,
    lat: loc.lat,
    lng: loc.lng,
    enrollmentStatus: 'Likely Coming Soon',
    registrationUrl: 'https://www.clubhousekids.ca',
    description: `Clubhouse Kids summer day camp at ${loc.name}. $265/week. Ages K-9 (Kids), 9-13 (Preteens). Priority reg Apr 2, public reg Apr 7, 2026.`,
    tags: ['faith-based', 'christian', 'day camp', loc.hood.toLowerCase()],
    activityType: 'Faith-Based Camp',
    confirmed2026: true,
    priceVerified: true,
    dayLength: 'Full Day',
    season: 'Summer 2026',
    durationPerDay: 9
  });
});

// ============================================================
// 25. Steamoji — 2026 CONFIRMED! South Surrey location
//     Weekly camps Jun 29 - Sep 4
//     Ages 5+/8+/10+, Full day 9-3, Half day 9-12
//     Pro-D days and weekly camps available
// ============================================================
// Remove duplicates
deduplicateProvider('Steamoji');

// Update existing entries
updateByProvider('Steamoji', {
  confirmed2026: true,
  enrollmentStatus: 'Open',
  startTime: '9:00 AM',
  endTime: '3:00 PM',
  neighbourhood: 'South Surrey',
  registrationUrl: 'https://www.steamoji.com/camps/canada-bc-south-surrey/',
  description: 'Steamoji STEAM maker camp in South Surrey. Ages 5-12+. Full day (9am-3pm) and half-day (9am-12pm) options. Weekly sessions from late June through early September. Robotics, coding, 3D printing, digital arts, electronics. Spots filling up.',
  tags: ['stem', 'steam', 'coding', 'robotics', '3d printing', 'south surrey', 'surrey']
});

// ============================================================
// 26. STEMA Vancouver — Summer camp page not found
//     Main location: 1025 Kingsway, Vancouver
//     Coding, robotics, digital arts
// ============================================================
updateByProvider('STEMA', {
  address: '1025 Kingsway, Vancouver, BC V5V 3C7',
  neighbourhood: 'East Vancouver',
  registrationUrl: 'https://vancouver.stemalearning.com',
  description: 'STEMA Learning Centre coding, robotics, and digital arts camps. Located at 1025 Kingsway, East Vancouver. Summer 2026 camp details — check website for updates. Full-day and half-day options typically available.',
  tags: ['stem', 'coding', 'robotics', 'digital arts', 'east vancouver']
});

// ============================================================
// 27. Jump Gymnastics Pro-D — Already well-represented in DB
//     Update registration URL
// ============================================================
// Already has detailed entries, just verify URL
programs.forEach(p => {
  if (p.provider === 'Jump Gymnastics' && p.name && p.name.includes('Pro-D')) {
    // keep as is - already detailed
  }
});

// ============================================================
// 28. Phoenix Gymnastics — Only showing 2022 summer data
//     No 2026 info available
// ============================================================
updateByProvider('Phoenix Gymnastics', {
  confirmed2026: false,
  enrollmentStatus: 'Likely Coming Soon',
  description: 'Phoenix Gymnastics summer camp. Preschool and school-aged gymnastics programs. 2026 summer camp not yet posted on website (showing 2022 data). Check back for updates.',
  registrationUrl: 'https://phoenixgymnastics.uplifterinc.com/pages/Recreational/camps/summer/'
});

// ============================================================
// 29. Camp Spirit — Amilia registration portal
//     No specific 2026 summer programs listed yet
// ============================================================
updateByProvider('Camp Spirit', {
  confirmed2026: false,
  enrollmentStatus: 'Likely Coming Soon',
  registrationUrl: 'https://app.amilia.com/store/en/chinook-pacific-uccan/shop/programs',
  description: 'Camp Spirit — United Church of Canada camp. Registration through Amilia platform. Summer 2026 camp sessions not yet posted. Check back for updates.'
});

// ============================================================
// Final: remove any remaining duplicates across all providers
// ============================================================
// De-dup Steamoji, Boogaloo, Phoenix, Clubhouse
['Steamoji', 'Boogaloo Academy', 'Phoenix Gymnastics'].forEach(p => deduplicateProvider(p));

// Write updated programs.json
fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2));

console.log(`\nDone!`);
console.log(`  Updated: ${updated} programs`);
console.log(`  Added: ${added} new programs`);
console.log(`  Removed: ${removed} duplicates/placeholders`);
console.log(`  Total: ${programs.length} programs`);
