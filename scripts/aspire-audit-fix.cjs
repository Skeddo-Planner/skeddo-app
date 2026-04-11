/**
 * Aspire Learning Academy Audit Fix — 2026-04-09
 * Rank 215 in audit queue
 *
 * Browser-verified against:
 *   https://aspiremathacademy.com/camps/math/
 *   https://aspiremathacademy.com/camps/literacy
 *
 * DB had 4 generic entries (625-628) with wrong cost ($350, actual $500+GST),
 * wrong schedule (Full Day 9-4, actual Half Day AM/PM), wrong ages.
 * Provider offers 30+ individual camp sessions across Math and Literacy.
 *
 * Grade-to-age (BC): Gr1=6, Gr2=7, Gr3=8, Gr4=9, Gr5=10, Gr6=11,
 *   Gr7=12, Gr8=13, Gr9=14, Gr10=15, Gr11=16
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

const MATH_URL = 'https://aspiremathacademy.com/camps/math/';
const LIT_URL = 'https://aspiremathacademy.com/camps/literacy';
const REG_URL = 'https://aspiremathacademy.com/scheduling/';

const COMMON = {
  provider: 'Aspire Learning Academy',
  category: 'Academic',
  campType: 'Summer Camp',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Ambleside',
  address: '2428 Haywood Ave, West Vancouver, BC V7V 1Y1',
  lat: 49.3375,
  lng: -123.156,
  city: 'West Vancouver',
  source: 'aspiremathacademy.com',
  season: 'Summer 2026',
  confirmed2026: true,
  priceVerified: true,
  urlVerified: true,
  enrollmentStatus: 'Open',
  registrationUrl: REG_URL,
  status: 'Open',
};

// All programs
const ALL = [];

// --- MATH: Chess camps (Jul) ---
for (const [dates, sd, ed] of [['Jul 6-10', '2026-07-06', '2026-07-10'], ['Jul 20-24', '2026-07-20', '2026-07-24']]) {
  ALL.push({
    id: `aspire-chess-${sd.slice(5,7)}${sd.slice(8)}`,
    name: `Math & Chess Camp (${dates})`,
    ageMin: 8, ageMax: 14, // "Intermediate" - roughly Gr 3-9
    startDate: sd, endDate: ed,
    startTime: '9:30 AM', endTime: '12:00 PM',
    cost: 500, days: 'Mon-Fri',
    tags: ['math', 'chess', 'problem solving'],
    activityType: 'Tutoring',
    costNote: '$500 + 5% GST. Math & Chess camp, intermediate level.',
    registrationUrl: MATH_URL,
  });
}

// --- MATH: Fundamentals (Jul) ---
for (const [dates, sd, ed] of [['Jul 13-17', '2026-07-13', '2026-07-17'], ['Jul 27-31', '2026-07-27', '2026-07-31']]) {
  ALL.push({
    id: `aspire-mathfund-${sd.slice(5,7)}${sd.slice(8)}`,
    name: `Math Fundamentals – Gr 4-6 (${dates})`,
    ageMin: 9, ageMax: 11,
    startDate: sd, endDate: ed,
    startTime: '1:00 PM', endTime: '3:30 PM',
    cost: 500, days: 'Mon-Fri',
    tags: ['math', 'fundamentals', 'tutoring'],
    activityType: 'Tutoring',
    costNote: '$500 + 5% GST. Math Fundamentals bootcamp for Grades 4-6.',
    registrationUrl: MATH_URL,
  });
}

// --- MATH: Prep courses (Aug) ---
const MATH_PREP = [
  // Aug 4-7 (4-day, $400)
  { sd: '2026-08-04', ed: '2026-08-07', days: 'Mon-Thu', cost: 400, gr: '1-2', t: 'AM', ageMin: 6, ageMax: 7 },
  { sd: '2026-08-04', ed: '2026-08-07', days: 'Mon-Thu', cost: 400, gr: '3-4', t: 'AM', ageMin: 8, ageMax: 9 },
  { sd: '2026-08-04', ed: '2026-08-07', days: 'Mon-Thu', cost: 400, gr: '5-6', t: 'PM', ageMin: 10, ageMax: 11 },
  { sd: '2026-08-04', ed: '2026-08-07', days: 'Mon-Thu', cost: 400, gr: '7-8', t: 'PM', ageMin: 12, ageMax: 13 },
  // Aug 10-14
  { sd: '2026-08-10', ed: '2026-08-14', days: 'Mon-Fri', cost: 500, gr: '2-3', t: 'AM', ageMin: 7, ageMax: 8 },
  { sd: '2026-08-10', ed: '2026-08-14', days: 'Mon-Fri', cost: 500, gr: '5-6', t: 'AM', ageMin: 10, ageMax: 11, name: 'Math Fundamentals' },
  { sd: '2026-08-10', ed: '2026-08-14', days: 'Mon-Fri', cost: 500, gr: '6-7', t: 'PM', ageMin: 11, ageMax: 12 },
  { sd: '2026-08-10', ed: '2026-08-14', days: 'Mon-Fri', cost: 500, gr: '8-9', t: 'PM', ageMin: 13, ageMax: 14 },
  // Aug 17-21
  { sd: '2026-08-17', ed: '2026-08-21', days: 'Mon-Fri', cost: 500, gr: '3-4', t: 'AM', ageMin: 8, ageMax: 9 },
  { sd: '2026-08-17', ed: '2026-08-21', days: 'Mon-Fri', cost: 500, gr: '5-6', t: 'AM', ageMin: 10, ageMax: 11 },
  { sd: '2026-08-17', ed: '2026-08-21', days: 'Mon-Fri', cost: 500, gr: '10', t: 'PM', ageMin: 15, ageMax: 15 },
  { sd: '2026-08-17', ed: '2026-08-21', days: 'Mon-Fri', cost: 500, gr: '11', t: 'PM', ageMin: 16, ageMax: 16 },
  // Aug 24-28
  { sd: '2026-08-24', ed: '2026-08-28', days: 'Mon-Fri', cost: 500, gr: '6-7', t: 'AM', ageMin: 11, ageMax: 12 },
  { sd: '2026-08-24', ed: '2026-08-28', days: 'Mon-Fri', cost: 500, gr: '8-9', t: 'AM', ageMin: 13, ageMax: 14 },
  { sd: '2026-08-24', ed: '2026-08-28', days: 'Mon-Fri', cost: 500, gr: '10', t: 'PM', ageMin: 15, ageMax: 15 },
  { sd: '2026-08-24', ed: '2026-08-28', days: 'Mon-Fri', cost: 500, gr: '11', t: 'PM', ageMin: 16, ageMax: 16 },
];

for (const mp of MATH_PREP) {
  const dateStr = `${mp.sd.slice(5,7)}${mp.sd.slice(8)}`;
  const label = mp.name || 'Math Preparation';
  ALL.push({
    id: `aspire-mathprep-gr${mp.gr.replace('-','')}-${dateStr}`,
    name: `${label} – Gr ${mp.gr} (${mp.t === 'AM' ? 'AM' : 'PM'})`,
    ageMin: mp.ageMin, ageMax: mp.ageMax,
    startDate: mp.sd, endDate: mp.ed,
    startTime: mp.t === 'AM' ? '9:30 AM' : '1:00 PM',
    endTime: mp.t === 'AM' ? '12:00 PM' : '3:30 PM',
    cost: mp.cost, days: mp.days,
    tags: ['math', 'preparation', 'tutoring'],
    activityType: 'Tutoring',
    costNote: `$${mp.cost} + 5% GST. ${mp.cost === 400 ? '4-day' : '5-day'} Math Preparation for Gr ${mp.gr}.`,
    registrationUrl: MATH_URL,
  });
}

// --- LITERACY ---
// Little Readers & Writers (Gr 1-2)
for (const [dates, sd, ed] of [['Jul 13-17', '2026-07-13', '2026-07-17'], ['Jul 27-31', '2026-07-27', '2026-07-31']]) {
  ALL.push({
    id: `aspire-readers-${sd.slice(5,7)}${sd.slice(8)}`,
    name: `Little Readers & Writers – Gr 1-2 (${dates})`,
    ageMin: 6, ageMax: 7,
    startDate: sd, endDate: ed,
    startTime: '9:30 AM', endTime: '12:00 PM',
    cost: 500, days: 'Mon-Fri',
    tags: ['reading', 'writing', 'literacy'],
    activityType: 'Tutoring',
    costNote: '$500 + 5% GST. Reading & writing camp for Grades 1-2.',
    registrationUrl: LIT_URL,
  });
}

// Intermediate English Essentials (Gr 3-4)
ALL.push({
  id: 'aspire-engess-0720', name: 'Intermediate English Essentials – Gr 3-4 (Jul 20-24 AM)',
  ageMin: 8, ageMax: 9, startDate: '2026-07-20', endDate: '2026-07-24',
  startTime: '9:30 AM', endTime: '12:00 PM', cost: 500, days: 'Mon-Fri',
  tags: ['english', 'grammar', 'literacy'], activityType: 'Tutoring',
  costNote: '$500 + 5% GST. English essentials for Grades 3-4.',
  registrationUrl: LIT_URL,
});
ALL.push({
  id: 'aspire-engess-0727', name: 'Intermediate English Essentials – Gr 3-4 (Jul 27-31 PM)',
  ageMin: 8, ageMax: 9, startDate: '2026-07-27', endDate: '2026-07-31',
  startTime: '1:00 PM', endTime: '3:30 PM', cost: 500, days: 'Mon-Fri',
  tags: ['english', 'grammar', 'literacy'], activityType: 'Tutoring',
  costNote: '$500 + 5% GST. English essentials for Grades 3-4.',
  registrationUrl: LIT_URL,
});

// Novel Study Analysis (Gr 4-7, 3:30-5:30PM)
for (const [dates, sd, ed] of [['Jul 6-10', '2026-07-06', '2026-07-10'], ['Jul 20-24', '2026-07-20', '2026-07-24'], ['Jul 27-31', '2026-07-27', '2026-07-31']]) {
  ALL.push({
    id: `aspire-novel-${sd.slice(5,7)}${sd.slice(8)}`,
    name: `Novel Study Analysis – Gr 4-7 (${dates})`,
    ageMin: 9, ageMax: 12,
    startDate: sd, endDate: ed,
    startTime: '3:30 PM', endTime: '5:30 PM',
    cost: 500, days: 'Mon-Fri',
    tags: ['reading', 'literature', 'analysis'],
    activityType: 'Tutoring',
    costNote: '$500 + 5% GST. Novel study and literary analysis for Grades 4-7.',
    registrationUrl: LIT_URL,
  });
}

// Creative Writing Essentials (Gr 5-6)
ALL.push({
  id: 'aspire-creative-0706', name: 'Creative Writing Essentials – Gr 5-6 (Jul 6-10 AM)',
  ageMin: 10, ageMax: 11, startDate: '2026-07-06', endDate: '2026-07-10',
  startTime: '9:30 AM', endTime: '12:00 PM', cost: 500, days: 'Mon-Fri',
  tags: ['creative writing', 'storytelling', 'literacy'], activityType: 'Tutoring',
  costNote: '$500 + 5% GST. Creative writing for Grades 5-6.',
  registrationUrl: LIT_URL,
});
ALL.push({
  id: 'aspire-creative-0720', name: 'Creative Writing Essentials – Gr 5-6 (Jul 20-24 PM)',
  ageMin: 10, ageMax: 11, startDate: '2026-07-20', endDate: '2026-07-24',
  startTime: '1:00 PM', endTime: '3:30 PM', cost: 500, days: 'Mon-Fri',
  tags: ['creative writing', 'storytelling', 'literacy'], activityType: 'Tutoring',
  costNote: '$500 + 5% GST. Creative writing for Grades 5-6.',
  registrationUrl: LIT_URL,
});

// Essay Writing Essentials (Gr 8-9)
for (const [dates, sd, ed] of [['Jul 6-10', '2026-07-06', '2026-07-10'], ['Jul 13-17', '2026-07-13', '2026-07-17']]) {
  ALL.push({
    id: `aspire-essay-${sd.slice(5,7)}${sd.slice(8)}`,
    name: `Essay Writing Essentials – Gr 8-9 (${dates})`,
    ageMin: 13, ageMax: 14,
    startDate: sd, endDate: ed,
    startTime: '1:00 PM', endTime: '3:30 PM',
    cost: 500, days: 'Mon-Fri',
    tags: ['essay writing', 'academic writing', 'literacy'],
    activityType: 'Tutoring',
    costNote: '$500 + 5% GST. Essay writing for Grades 8-9.',
    registrationUrl: LIT_URL,
  });
}

// Map existing 4 entries to specific programs
const existingMap = {
  625: { // Jul 6-10 → Math & Chess AM
    name: 'Math & Chess Camp (Jul 6-10)',
    startTime: '9:30 AM', endTime: '12:00 PM',
    ageMin: 8, ageMax: 14, cost: 500,
    costNote: '$500 + 5% GST. Math & Chess camp, intermediate level.',
    registrationUrl: MATH_URL,
    tags: ['math', 'chess', 'problem solving'],
  },
  626: { // Jul 13-17 → Math Fundamentals PM
    name: 'Math Fundamentals – Gr 4-6 (Jul 13-17)',
    startTime: '1:00 PM', endTime: '3:30 PM',
    ageMin: 9, ageMax: 11, cost: 500,
    costNote: '$500 + 5% GST. Math Fundamentals bootcamp for Grades 4-6.',
    registrationUrl: MATH_URL,
    tags: ['math', 'fundamentals', 'tutoring'],
  },
  627: { // Jul 20-24 → Math & Chess AM
    name: 'Math & Chess Camp (Jul 20-24)',
    startTime: '9:30 AM', endTime: '12:00 PM',
    ageMin: 8, ageMax: 14, cost: 500,
    costNote: '$500 + 5% GST. Math & Chess camp, intermediate level.',
    registrationUrl: MATH_URL,
    tags: ['math', 'chess', 'problem solving'],
  },
  628: { // Jul 27-31 → Math Fundamentals PM
    name: 'Math Fundamentals – Gr 4-6 (Jul 27-31)',
    startTime: '1:00 PM', endTime: '3:30 PM',
    ageMin: 9, ageMax: 11, cost: 500,
    costNote: '$500 + 5% GST. Math Fundamentals bootcamp for Grades 4-6.',
    registrationUrl: MATH_URL,
    tags: ['math', 'fundamentals', 'tutoring'],
  },
};

let corrected = 0;
for (const p of programs) {
  if (p.provider !== 'Aspire Learning Academy') continue;
  const id = Number(p.id);
  const fix = existingMap[id];
  if (!fix) continue;

  Object.assign(p, fix);
  p.scheduleType = 'Half Day (AM)';
  if (fix.startTime.includes('PM') || fix.startTime.includes('1:00')) p.scheduleType = 'Half Day (PM)';
  p.dayLength = 'Half Day';
  p.durationPerDay = 2.5;
  p.description = `${fix.name} at Aspire Learning Academy, West Vancouver. Ages ${fix.ageMin}-${fix.ageMax}. ${fix.startTime}-${fix.endTime} Mon-Fri. $500 + GST.`;
  p.confirmed2026 = true;
  p.priceVerified = true;
  p.urlVerified = true;
  if (p.isEstimate) delete p.isEstimate;
  corrected++;
}

// Remove duplicates — existing entries already cover Jul Math Chess & Fundamentals
const existingCovers = new Set([
  'aspire-chess-0706', 'aspire-chess-0720',
  'aspire-mathfund-0713', 'aspire-mathfund-0727',
]);

const newEntries = ALL.filter(e => !existingCovers.has(e.id));

for (const entry of newEntries) {
  const isAM = entry.startTime.includes('9:');
  const isPM = entry.startTime.includes('1:') || entry.startTime.includes('3:');
  programs.push({
    ...COMMON,
    ...entry,
    scheduleType: isAM ? 'Half Day (AM)' : 'Half Day (PM)',
    dayLength: 'Half Day',
    durationPerDay: 2.5,
    description: `${entry.name} at Aspire Learning Academy, West Vancouver. Ages ${entry.ageMin}-${entry.ageMax}. ${entry.startTime}-${entry.endTime}. $${entry.cost} + GST.`,
  });
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Aspire Learning Academy: ${corrected} corrected, ${newEntries.length} added`);
console.log(`Total programs: ${programs.length}`);
