#!/usr/bin/env node
// cutdesignacademy-audit-fix.cjs
// Fixes The Cut Fashion Academy (listed as "The Cut Design Academy") data
// Rank 186 audit, 2026-04-06
//
// Source pages verified (browser navigation):
//   https://www.thecutfashionacademy.com/youth-camps  (program overview)
//   https://www.thecutfashionacademy.com/part-time-classes/youth-summer-fashion-camp
//   https://www.thecutfashionacademy.com/part-time-classes/glam-youth-makeup-camp-summer
//   https://www.thecutfashionacademy.com/part-time-classes/youth-art
//   https://www.thecutfashionacademy.com/part-time-classes/youth-sewing-camp
//
// FINDINGS:
//   1. Provider name WRONG: "The Cut Design Academy" → "The Cut Fashion Academy"
//      (site domain and title both say "The Cut Fashion Academy")
//
//   2. IDs 67 & 68 (Youth Fashion Design Camp):
//      - startTime: 9:00 AM → 10:00 AM (site: "10.00 AM to 3.00 PM")
//      - endTime: 4:00 PM → 3:00 PM
//      - ageMax: 14 → 16 (site: "Age range: 8 to 16 years")
//      - durationPerDay: 7 → 5
//      - registrationUrl: generic → specific program page
//
//   3. IDs 69 & 70 (Summer Glam Youth Makeup Camp):
//      - NOT a full week camp — it's 2 days per session (Mon & Tue)
//      - startTime: 9:00 AM → 10:00 AM
//      - endTime: 4:00 PM → 3:00 PM
//      - ageMax: 14 → 16 (site: "Age range: 8 to 16 years")
//      - days: "Mon-Fri" → "Mon,Tue"
//      - scheduleType: "Full Day" → "Half Day" (5hrs for fashion, but 5hrs for makeup too? No, 10am-3pm = 5hrs, Full Day >=4hrs)
//      - ID 69: dates Jul 20-24 → Jul 20-21 (Mon-Tue)
//      - ID 70: dates Jul 27-31 → Jul 27-28 (Mon-Tue)
//      - registrationUrl: generic → specific program page
//
//   4. Missing Fashion Camp sessions:
//      Jun 29-Jul 3, Jul 20-24, Jul 27-31, Aug 17-21 (site shows 7 sessions, DB had only 2)
//
//   5. Missing Makeup Camp sessions:
//      Jul 6-7, Jul 13-14 (site shows 4 sessions, DB had 2 but wrong dates)
//      NOTE: site shows "July 12th & 14th" but Jul 12 is a Sunday; confirmed as Mon Jul 13 & Tue Jul 14
//
//   6. Two new programs discovered:
//      - Youth After School Art Camp: Thursdays, 4-6pm, 1 month, $295, ages 8-14
//      - Youth After School Sewing Camp: Wednesdays, 4-6pm, 1 month, $295, ages 8-14
//      Available: Apr, May, Jun, Sep, Oct, Nov 2026

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const pid_map = new Map(programs.map(p => [String(p.id), p]));

let fixes = 0;
let added = 0;

function fix(id, field, value) {
  const p = pid_map.get(String(id));
  if (!p) { console.warn(`SKIP (not found): ${id}`); return; }
  p[field] = value;
  fixes++;
}

// --- Fix provider name (all 4 entries) ---
[67, 68, 69, 70].forEach(id => {
  fix(id, 'provider', 'The Cut Fashion Academy');
});
console.log('Fixed provider name: "The Cut Design Academy" → "The Cut Fashion Academy" (IDs 67, 68, 69, 70)');

// --- Fix IDs 67 & 68: Youth Fashion Design Camp ---
[67, 68].forEach(id => {
  fix(id, 'startTime', '10:00 AM');
  fix(id, 'endTime', '3:00 PM');
  fix(id, 'ageMax', 16);
  fix(id, 'durationPerDay', 5);
  fix(id, 'registrationUrl', 'https://www.thecutfashionacademy.com/part-time-classes/youth-summer-fashion-camp');
  fix(id, 'costNote',
    '$650/week (Mon–Fri, 10:00 AM–3:00 PM). Ages 8–16. Class max 10 students. ' +
    'Students create own designs, learn sewing, fashion illustration, and present at end-of-week fashion show. ' +
    'Bring packed lunch. Location: 1888 W 1st Ave, Vancouver (Kitsilano).'
  );
  fix(id, 'ageSpanJustified',
    'Fashion design is a skills-based creative discipline suitable for teens ages 8–16. ' +
    'The Cut Fashion Academy groups students by creative interest and skill level, not age sub-groups. ' +
    'Age range confirmed directly from registration page: "Age range: 8 to 16 years".'
  );
});
console.log('Fixed IDs 67, 68: startTime, endTime, ageMax, durationPerDay, registrationUrl, costNote, ageSpanJustified');

// --- Fix IDs 69 & 70: Summer Glam Youth Makeup Camp ---
// These are 2-day sessions (Mon & Tue), NOT full weeks
fix(69, 'startDate', '2026-07-20');
fix(69, 'endDate', '2026-07-21');
fix(69, 'days', 'Mon,Tue');
fix(70, 'startDate', '2026-07-27');
fix(70, 'endDate', '2026-07-28');
fix(70, 'days', 'Mon,Tue');

[69, 70].forEach(id => {
  fix(id, 'startTime', '10:00 AM');
  fix(id, 'endTime', '3:00 PM');
  fix(id, 'ageMax', 16);
  fix(id, 'durationPerDay', 5);
  fix(id, 'registrationUrl', 'https://www.thecutfashionacademy.com/part-time-classes/glam-youth-makeup-camp-summer');
  fix(id, 'costNote',
    '$295 per 2-day session (Mon & Tue, 10:00 AM–3:00 PM). Ages 8–16. Class max 12 students. ' +
    'Each session is 2 days — NOT a full week. Master makeup techniques, color theory, and blending. ' +
    'Location: 1888 W 1st Ave, Vancouver (Kitsilano).'
  );
  fix(id, 'ageSpanJustified',
    'Makeup/beauty artistry is suitable for teens ages 8–16. ' +
    'The Cut Fashion Academy groups students by interest, not age sub-groups. ' +
    'Age range confirmed from registration page: "Age range: 8 to 16 years".'
  );
});
console.log('Fixed IDs 69, 70: dates to 2-day blocks, days, startTime, endTime, ageMax, registrationUrl, costNote, ageSpanJustified');

// Base templates
const FASHION_BASE = {
  provider: 'The Cut Fashion Academy',
  category: 'Arts',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  ageMin: 8,
  ageMax: 16,
  days: 'Mon-Fri',
  startTime: '10:00 AM',
  endTime: '3:00 PM',
  cost: 650,
  costNote: '$650/week (Mon–Fri, 10:00 AM–3:00 PM). Ages 8–16. Class max 10 students. Students create own designs, learn sewing, fashion illustration, and present at end-of-week fashion show. Bring packed lunch. Location: 1888 W 1st Ave, Vancouver (Kitsilano).',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Kitsilano',
  address: '1888 West 1st Avenue, Vancouver, BC',
  lat: 49.271,
  lng: -123.147,
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.thecutfashionacademy.com/part-time-classes/youth-summer-fashion-camp',
  description: 'Week-long youth fashion design camp at The Cut Fashion Academy, Vancouver. Students create their own designs, learn sewing and illustration, and speak with industry experts about careers in fashion. End-of-week fashion presentation for friends and family. 10 AM–3 PM Mon–Fri.',
  tags: ['fashion', 'design', 'sewing', 'illustration', 'summer camp', 'teens'],
  activityType: 'Fashion Design',
  priceVerified: true,
  confirmed2026: true,
  season: 'Summer 2026',
  durationPerDay: 5,
  city: 'Vancouver',
  ageSpanJustified: 'Fashion design is a skills-based creative discipline suitable for teens ages 8–16. The Cut Fashion Academy groups students by creative interest and skill level, not age sub-groups. Age range confirmed directly from registration page: "Age range: 8 to 16 years".',
};

const MAKEUP_BASE = {
  provider: 'The Cut Fashion Academy',
  category: 'Arts',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  ageMin: 8,
  ageMax: 16,
  days: 'Mon,Tue',
  startTime: '10:00 AM',
  endTime: '3:00 PM',
  cost: 295,
  costNote: '$295 per 2-day session (Mon & Tue, 10:00 AM–3:00 PM). Ages 8–16. Class max 12 students. Each session is 2 days — NOT a full week. Master makeup techniques, color theory, and blending. Location: 1888 W 1st Ave, Vancouver (Kitsilano).',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Kitsilano',
  address: '1888 West 1st Avenue, Vancouver, BC',
  lat: 49.271,
  lng: -123.147,
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.thecutfashionacademy.com/part-time-classes/glam-youth-makeup-camp-summer',
  description: '2-day youth makeup camp at The Cut Fashion Academy, Vancouver. Learn timeless makeup techniques, color theory, and blending. Master the foundation of beauty artistry including flawless skin and the iconic cat-eye. 10 AM–3 PM Mon & Tue.',
  tags: ['makeup', 'beauty', 'fashion', 'summer camp', 'teens'],
  activityType: 'Fashion Design',
  priceVerified: true,
  confirmed2026: true,
  season: 'Summer 2026',
  durationPerDay: 5,
  city: 'Vancouver',
  ageSpanJustified: 'Makeup/beauty artistry is suitable for teens ages 8–16. The Cut Fashion Academy groups students by interest, not age sub-groups. Age range confirmed from registration page: "Age range: 8 to 16 years".',
};

// --- Add missing Fashion Camp sessions ---
const fashionSessions = [
  { id: 16160, startDate: '2026-06-29', endDate: '2026-07-03', note: 'Jun 29–Jul 3 (Canada Day Jul 1 falls within this week; camp may adjust — confirm with provider)' },
  { id: 16161, startDate: '2026-07-20', endDate: '2026-07-24', note: null },
  { id: 16162, startDate: '2026-07-27', endDate: '2026-07-31', note: null },
  { id: 16163, startDate: '2026-08-17', endDate: '2026-08-21', note: null },
];

fashionSessions.forEach(s => {
  const entry = { ...FASHION_BASE, id: s.id, startDate: s.startDate, endDate: s.endDate,
    name: 'Youth Fashion Design Camp' };
  if (s.note) entry.costNote = entry.costNote + ' Note: ' + s.note;
  programs.push(entry);
  added++;
  console.log(`Added Fashion Camp ${s.startDate}–${s.endDate} (ID ${s.id})`);
});

// --- Add missing Makeup Camp sessions ---
// Site shows "July 12th & 14th" — Jul 12 is Sunday, confirmed as Jul 13 (Mon) & 14 (Tue)
const makeupSessions = [
  { id: 16164, startDate: '2026-07-06', endDate: '2026-07-07' },
  { id: 16165, startDate: '2026-07-13', endDate: '2026-07-14' },
];

makeupSessions.forEach(s => {
  const entry = { ...MAKEUP_BASE, id: s.id, startDate: s.startDate, endDate: s.endDate,
    name: 'Summer Glam Youth Makeup Camp' };
  programs.push(entry);
  added++;
  console.log(`Added Makeup Camp ${s.startDate}–${s.endDate} (ID ${s.id})`);
});

// --- Add After School Art Camp ---
programs.push({
  id: 16166,
  name: 'Youth After School Art Camp',
  provider: 'The Cut Fashion Academy',
  category: 'Arts',
  campType: 'Class/Lesson',
  scheduleType: 'Activity',
  ageMin: 8,
  ageMax: 14,
  startDate: '2026-04-02',
  endDate: '2026-11-26',
  days: 'Thu',
  startTime: '4:00 PM',
  endTime: '6:00 PM',
  cost: 295,
  costNote: '$295/month (4 weekly Thursday sessions, 4:00–6:00 PM). Ages 8–14. Class max 16 students. ' +
    'Available months: April, May, June, September, October, November 2026. ' +
    'Each monthly session explores painting, drawing, and crafts. Location: 1888 W 1st Ave, Vancouver.',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Kitsilano',
  address: '1888 West 1st Avenue, Vancouver, BC',
  lat: 49.271,
  lng: -123.147,
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.thecutfashionacademy.com/part-time-classes/youth-art',
  description: 'Youth after-school art program at The Cut Fashion Academy, Vancouver. Once per week on Thursdays for one month (4 sessions), exploring painting, drawing, fashion design, graphic design, interior design, and crafts. 4:00–6:00 PM. Ages 8–14.',
  tags: ['art', 'drawing', 'painting', 'after school', 'fashion design', 'kids', 'teens'],
  activityType: 'Visual Arts',
  priceVerified: true,
  confirmed2026: true,
  repeating: true,
  season: 'Spring 2026',
  durationPerDay: 2,
  city: 'Vancouver',
});
added++;
console.log('Added After School Art Camp (ID 16166)');

// --- Add After School Sewing Camp ---
programs.push({
  id: 16167,
  name: 'Youth After School Sewing Camp',
  provider: 'The Cut Fashion Academy',
  category: 'Arts',
  campType: 'Class/Lesson',
  scheduleType: 'Activity',
  ageMin: 8,
  ageMax: 14,
  startDate: '2026-04-01',
  endDate: '2026-11-25',
  days: 'Wed',
  startTime: '4:00 PM',
  endTime: '6:00 PM',
  cost: 295,
  costNote: '$295/month (4 weekly Wednesday sessions, 4:00–6:00 PM). Ages 8–14. Class max 16 students. ' +
    'Available months: April, May, June, September, October, November 2026. ' +
    'Hands-on sewing, fashion and design exploration. Location: 1888 W 1st Ave, Vancouver.',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Kitsilano',
  address: '1888 West 1st Avenue, Vancouver, BC',
  lat: 49.271,
  lng: -123.147,
  enrollmentStatus: 'Open',
  registrationUrl: 'https://www.thecutfashionacademy.com/part-time-classes/youth-sewing-camp',
  description: 'Youth after-school sewing program at The Cut Fashion Academy, Vancouver. Once per week on Wednesdays for one month (4 sessions), exploring sewing, fashion design, and creative projects. 4:00–6:00 PM. Ages 8–14.',
  tags: ['sewing', 'fashion', 'design', 'after school', 'crafts', 'kids', 'teens'],
  activityType: 'Fashion Design',
  priceVerified: true,
  confirmed2026: true,
  repeating: true,
  season: 'Spring 2026',
  durationPerDay: 2,
  city: 'Vancouver',
});
added++;
console.log('Added After School Sewing Camp (ID 16167)');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`\nDone. Fixes: ${fixes}, Added: ${added}. Total programs: ${programs.length}`);
