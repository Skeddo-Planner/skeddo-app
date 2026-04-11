/**
 * UTG Academy Re-Audit Fix — 2026-04-09
 * Rank 240 in audit queue — RE-AUDIT via Chrome browser
 *
 * Prior audit used WebFetch — site is JS-heavy WooCommerce, returned no useful data.
 * Chrome browser captured full summer camp catalog with 27 sessions across 6 program types.
 *
 * Browser-verified against:
 * - https://utgacademy.com/courses/?courseCategory=summer (full catalog with JS schedule data)
 * - https://kitsilano.underthegui.com/product/summer-coding-camp-full-day-ultimate/ ($560)
 * - https://kitsilano.underthegui.com/product/summer-coding-camp-half-day/ ($300)
 * - https://kitsilano.underthegui.com/product/summer-robotics-camp-half-day/ ($375)
 * - https://kitsilano.underthegui.com/product/summer-robotics-camp-full-day-ultimate-4/ ($625)
 * - https://kitsilano.underthegui.com/product/summer-digital-art-camp-half-day/ ($375)
 * - https://kitsilano.underthegui.com/product/summer-digital-art-camp-full-day-ultimate/ ($625)
 *
 * Key findings:
 * - Address: 210-1909 W Broadway, Vancouver, BC V6J 1Z3 (Kitsilano — NOT North Vancouver)
 * - Phone: (604) 715-6471 / (604) 700-9931
 * - All 6 program types confirmed with exact pricing
 * - 27 total sessions for Summer 2026
 * - Registration via WooCommerce at kitsilano.underthegui.com
 * - Full Day (Ultimate) camps partner with Elevate Ultimate Frisbee
 * - Ages 7-14 for all programs
 * - Grouped by age and skill level within each session
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// Remove the 3 old generic placeholder entries
const oldIds = [16058, 16059, 16060];
const filtered = programs.filter(p => !oldIds.includes(Number(p.id)));
const removed = programs.length - filtered.length;

// Find max numeric ID
let maxId = 0;
for (const p of filtered) {
  const numId = Number(p.id);
  if (!isNaN(numId) && numId > maxId) maxId = numId;
}
let nextId = maxId + 1;

const base = {
  provider: 'UTG Academy',
  category: 'STEM',
  campType: 'Summer Camp',
  indoorOutdoor: 'Both',
  neighbourhood: 'Kitsilano',
  address: '210-1909 W Broadway, Vancouver, BC V6J 1Z3',
  city: 'Vancouver',
  registrationUrl: 'https://utgacademy.com/courses/?courseCategory=summer',
  urlVerified: true,
  confirmed2026: true,
  priceVerified: true,
  enrollmentStatus: 'Open',
  status: 'Open',
  season: 'Summer 2026',
  ageMin: 7,
  ageMax: 14,
};

let added = 0;

// === CODING CAMP FULL DAY (ULTIMATE) — $560 ===
const codingFullDaySessions = [
  { dates: ['2026-06-29', '2026-07-03'], days: 'Mon-Tue, Thu-Fri', url: 'https://kitsilano.underthegui.com/product/summer-coding-camp-full-day-ultimate/' },
  { dates: ['2026-07-27', '2026-07-31'], days: 'Mon-Fri', url: 'https://kitsilano.underthegui.com/product/summer-coding-camp-full-day-ultimate-2/' },
  { dates: ['2026-08-10', '2026-08-14'], days: 'Mon-Fri', url: 'https://kitsilano.underthegui.com/product/summer-coding-camp-full-day-ultimate-3/' },
  { dates: ['2026-08-24', '2026-08-28'], days: 'Mon-Fri', url: 'https://kitsilano.underthegui.com/product/summer-coding-camp-full-day-ultimate-4/' },
];

for (let i = 0; i < codingFullDaySessions.length; i++) {
  const s = codingFullDaySessions[i];
  filtered.push({
    ...base,
    id: `utg-coding-fd-${i + 1}`,
    name: `UTG Academy Summer Coding Camp Full Day (Ultimate) — Week of ${s.dates[0].slice(5)}`,
    scheduleType: 'Full Day',
    startDate: s.dates[0],
    endDate: s.dates[1],
    days: s.days,
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    cost: 560,
    activityType: 'Coding',
    registrationUrl: s.url,
    costNote: '$560/week. Full day 9am-4pm. Half day Python coding/game design + half day Ultimate Frisbee with Elevate. Grouped by age and skill. No experience required. Contact: (604) 715-6471.',
    description: 'Summer Coding Camp Full Day (Ultimate) at UTG Academy, Kitsilano. Ages 7-14. Campers spend half the day creating video games with Python (loops, variables, conditionals, collision detection) and half the day playing Ultimate Frisbee with Elevate coaches. Every week is different — instructors work with students to choose from a catalogue of projects.',
    tags: ['coding', 'python', 'game design', 'ultimate frisbee', 'STEM', 'summer camp'],
  });
  added++;
}

// === CODING CAMP HALF DAY — $300 ===
const codingHalfDaySessions = [
  { dates: ['2026-06-29', '2026-07-03'], days: 'Mon-Tue, Thu-Fri', time: 'PM', startTime: '12:45 PM', endTime: '4:00 PM', url: 'https://kitsilano.underthegui.com/product/summer-coding-camp-half-day/' },
  { dates: ['2026-07-06', '2026-07-10'], days: 'Mon-Fri', time: 'AM', startTime: '9:00 AM', endTime: '12:15 PM', url: 'https://kitsilano.underthegui.com/product/summer-coding-camp-half-day-2/' },
  { dates: ['2026-08-04', '2026-08-07'], days: 'Tue-Fri', time: 'AM', startTime: '9:00 AM', endTime: '12:15 PM', url: 'https://kitsilano.underthegui.com/product/summer-coding-camp-half-day-3/' },
  { dates: ['2026-08-10', '2026-08-14'], days: 'Mon-Fri', time: 'PM', startTime: '12:45 PM', endTime: '4:00 PM', url: 'https://kitsilano.underthegui.com/product/summer-coding-camp-half-day-4/' },
  { dates: ['2026-08-24', '2026-08-28'], days: 'Mon-Fri', time: 'PM', startTime: '12:45 PM', endTime: '4:00 PM', url: 'https://kitsilano.underthegui.com/product/summer-coding-camp-half-day-5/' },
];

for (let i = 0; i < codingHalfDaySessions.length; i++) {
  const s = codingHalfDaySessions[i];
  filtered.push({
    ...base,
    id: `utg-coding-hd-${i + 1}`,
    name: `UTG Academy Summer Coding Camp Half Day (${s.time}) — Week of ${s.dates[0].slice(5)}`,
    scheduleType: 'Half Day',
    startDate: s.dates[0],
    endDate: s.dates[1],
    days: s.days,
    startTime: s.startTime,
    endTime: s.endTime,
    cost: 300,
    activityType: 'Coding',
    registrationUrl: s.url,
    costNote: `$300/week. Half day ${s.startTime}-${s.endTime}. Python coding and game design. Grouped by age and skill. No experience required. Contact: (604) 715-6471.`,
    description: 'Summer Coding Camp Half Day at UTG Academy, Kitsilano. Ages 7-14. Campers use Python to create their own unique video game, exploring programming concepts like loops, variables, conditionals, coordinates, and collision detection. Every week is different — instructors choose from a catalogue of projects.',
    tags: ['coding', 'python', 'game design', 'STEM', 'summer camp'],
  });
  added++;
}

// === ROBOTICS CAMP HALF DAY — $375 ===
const roboticsHalfDaySessions = [
  { dates: ['2026-06-29', '2026-07-03'], days: 'Mon-Tue, Thu-Fri', time: 'AM', startTime: '9:00 AM', endTime: '12:15 PM', url: 'https://kitsilano.underthegui.com/product/competitive-robotics-bootcamp/' },
  { dates: ['2026-07-06', '2026-07-10'], days: 'Mon-Fri', time: 'PM', startTime: '12:45 PM', endTime: '4:00 PM', url: 'https://kitsilano.underthegui.com/product/summer-robotics-camp-half-day/' },
  { dates: ['2026-07-13', '2026-07-17'], days: 'Mon-Fri', time: 'AM', startTime: '9:00 AM', endTime: '12:15 PM', url: 'https://kitsilano.underthegui.com/product/summer-robotics-camp-half-day-2/' },
  { dates: ['2026-07-20', '2026-07-24'], days: 'Mon-Fri', time: 'PM', startTime: '12:45 PM', endTime: '4:00 PM', url: 'https://kitsilano.underthegui.com/product/summer-robotics-camp-half-day-3/' },
  { dates: ['2026-07-27', '2026-07-31'], days: 'Mon-Fri', time: 'PM', startTime: '12:45 PM', endTime: '4:00 PM', url: 'https://kitsilano.underthegui.com/product/summer-robotics-camp-half-day-5/' },
  { dates: ['2026-07-27', '2026-07-31'], days: 'Mon-Fri', time: 'AM', startTime: '9:00 AM', endTime: '12:15 PM', url: 'https://kitsilano.underthegui.com/product/summer-robotics-camp-half-day-4/' },
  { dates: ['2026-08-04', '2026-08-07'], days: 'Tue-Fri', time: 'PM', startTime: '12:45 PM', endTime: '4:00 PM', url: 'https://kitsilano.underthegui.com/product/summer-robotics-camp-half-day-6/' },
  { dates: ['2026-08-10', '2026-08-14'], days: 'Mon-Fri', time: 'AM', startTime: '9:00 AM', endTime: '12:15 PM', url: 'https://kitsilano.underthegui.com/product/summer-robotics-camp-half-day-7/' },
  { dates: ['2026-08-17', '2026-08-21'], days: 'Mon-Fri', time: 'PM', startTime: '12:45 PM', endTime: '4:00 PM', url: 'https://kitsilano.underthegui.com/product/summer-robotics-camp-half-day-8/' },
  { dates: ['2026-08-24', '2026-08-28'], days: 'Mon-Fri', time: 'AM', startTime: '9:00 AM', endTime: '12:15 PM', url: 'https://kitsilano.underthegui.com/product/summer-robotics-camp-half-day-9/' },
];

for (let i = 0; i < roboticsHalfDaySessions.length; i++) {
  const s = roboticsHalfDaySessions[i];
  filtered.push({
    ...base,
    id: `utg-robotics-hd-${i + 1}`,
    name: `UTG Academy Summer Robotics Camp Half Day (${s.time}) — Week of ${s.dates[0].slice(5)}`,
    scheduleType: 'Half Day',
    startDate: s.dates[0],
    endDate: s.dates[1],
    days: s.days,
    startTime: s.startTime,
    endTime: s.endTime,
    cost: 375,
    activityType: 'Robotics',
    registrationUrl: s.url,
    costNote: `$375/week. Half day ${s.startTime}-${s.endTime}. VEX IQ robotics — build, customize, and code robots. Grouped by age and skill. No experience required. Contact: (604) 715-6471.`,
    description: 'Summer Robotics Camp Half Day at UTG Academy, Kitsilano. Ages 7-14. Campers build and customize their own VEX IQ robot to tackle engineering challenges including robot soccer. Learn block-based coding to program robots autonomously. Concepts include gearing, friction, leverage, and center of gravity.',
    tags: ['robotics', 'VEX IQ', 'coding', 'STEM', 'summer camp'],
  });
  added++;
}

// === ROBOTICS CAMP FULL DAY (ULTIMATE) — $625 ===
const roboticsFullDaySessions = [
  { dates: ['2026-07-06', '2026-07-10'], days: 'Mon-Fri', url: 'https://kitsilano.underthegui.com/product/robotics-circuits-3d-printing/' },
  { dates: ['2026-07-20', '2026-07-24'], days: 'Mon-Fri', url: 'https://kitsilano.underthegui.com/product/summer-robotics-camp-full-day-ultimate-4/' },
  { dates: ['2026-08-04', '2026-08-07'], days: 'Tue-Fri', url: 'https://kitsilano.underthegui.com/product/summer-robotics-camp-full-day-ultimate-5/' },
  { dates: ['2026-08-17', '2026-08-21'], days: 'Mon-Fri', url: 'https://kitsilano.underthegui.com/product/summer-robotics-camp-full-day-ultimate-6/' },
];

for (let i = 0; i < roboticsFullDaySessions.length; i++) {
  const s = roboticsFullDaySessions[i];
  filtered.push({
    ...base,
    id: `utg-robotics-fd-${i + 1}`,
    name: `UTG Academy Summer Robotics Camp Full Day (Ultimate) — Week of ${s.dates[0].slice(5)}`,
    scheduleType: 'Full Day',
    startDate: s.dates[0],
    endDate: s.dates[1],
    days: s.days,
    startTime: '9:00 AM',
    endTime: '4:00 PM',
    cost: 625,
    activityType: 'Robotics',
    registrationUrl: s.url,
    costNote: '$625/week. Full day 9am-4pm. Half day VEX IQ robotics + half day Ultimate Frisbee with Elevate. Grouped by age and skill. No experience required. Contact: (604) 715-6471.',
    description: 'Summer Robotics Camp Full Day (Ultimate) at UTG Academy, Kitsilano. Ages 7-14. Half day building and programming VEX IQ robots (robot soccer, autonomous coding, engineering challenges) + half day Ultimate Frisbee with Elevate coaches. Covers gearing, friction, leverage, center of gravity.',
    tags: ['robotics', 'VEX IQ', 'ultimate frisbee', 'STEM', 'summer camp'],
  });
  added++;
}

// === DIGITAL ART CAMP HALF DAY — $375 ===
const digitalArtHalfDaySessions = [
  { dates: ['2026-07-13', '2026-07-17'], days: 'Mon-Fri', time: 'PM', startTime: '12:45 PM', endTime: '4:00 PM', url: 'https://kitsilano.underthegui.com/product/summer-digital-art-camp-half-day/' },
  { dates: ['2026-07-20', '2026-07-24'], days: 'Mon-Fri', time: 'AM', startTime: '9:00 AM', endTime: '12:15 PM', url: 'https://kitsilano.underthegui.com/product/summer-digital-art-camp-half-day-2/' },
  { dates: ['2026-08-17', '2026-08-21'], days: 'Mon-Fri', time: 'AM', startTime: '9:00 AM', endTime: '12:15 PM', url: 'https://kitsilano.underthegui.com/product/summer-digital-art-camp-half-day-3/' },
];

for (let i = 0; i < digitalArtHalfDaySessions.length; i++) {
  const s = digitalArtHalfDaySessions[i];
  filtered.push({
    ...base,
    id: `utg-digart-hd-${i + 1}`,
    name: `UTG Academy Summer Digital Art Camp Half Day (${s.time}) — Week of ${s.dates[0].slice(5)}`,
    scheduleType: 'Half Day',
    startDate: s.dates[0],
    endDate: s.dates[1],
    days: s.days,
    startTime: s.startTime,
    endTime: s.endTime,
    cost: 375,
    activityType: 'Digital Art',
    registrationUrl: s.url,
    costNote: `$375/week. Half day ${s.startTime}-${s.endTime}. 3D modeling in Tinkercad, animation with Pivot, greenscreen, photo editing. Grouped by age and skill. No experience required. Contact: (604) 715-6471.`,
    description: 'Summer Digital Art Camp Half Day at UTG Academy, Kitsilano. Ages 7-14. 3D modeling in Tinkercad — design and 3D-print a functional car for a pinewood derby-style race. Animation using Pivot, greenscreen, and photo-editing software to create a short film.',
    tags: ['digital art', '3D printing', 'animation', 'STEM', 'summer camp'],
  });
  added++;
}

// === DIGITAL ART CAMP FULL DAY (ULTIMATE) — $625 ===
filtered.push({
  ...base,
  id: 'utg-digart-fd-1',
  name: 'UTG Academy Summer Digital Art Camp Full Day (Ultimate) — Week of 07-13',
  scheduleType: 'Full Day',
  startDate: '2026-07-13',
  endDate: '2026-07-17',
  days: 'Mon-Fri',
  startTime: '9:00 AM',
  endTime: '4:00 PM',
  cost: 625,
  activityType: 'Digital Art',
  registrationUrl: 'https://kitsilano.underthegui.com/product/summer-digital-art-camp-full-day-ultimate/',
  costNote: '$625/week. Full day 9am-4pm. Half day digital art (Tinkercad 3D modeling, animation, greenscreen) + half day Ultimate Frisbee with Elevate. Grouped by age and skill. No experience required. Contact: (604) 715-6471.',
  description: 'Summer Digital Art Camp Full Day (Ultimate) at UTG Academy, Kitsilano. Ages 7-14. Half day digital art (3D modeling in Tinkercad, animation with Pivot, greenscreen, photo editing, short film creation) + half day Ultimate Frisbee with Elevate coaches.',
  tags: ['digital art', '3D printing', 'animation', 'ultimate frisbee', 'STEM', 'summer camp'],
});
added++;

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(filtered, null, 2) + '\n');
console.log(`UTG Academy re-audit: ${removed} removed, ${added} added`);
console.log(`Total programs: ${filtered.length}`);
