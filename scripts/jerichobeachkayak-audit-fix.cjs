#!/usr/bin/env node
// jerichobeachkayak-audit-fix.cjs
// Fixes Jericho Beach Kayak data (rank 159 audit, 2026-04-06)
//
// Source: https://jerichobeachkayak.com/summer-camps/
//         https://jerichobeachkayak.com/youth-kayak-programs/full-day-camp/
//         https://jerichobeachkayak.com/youth-kayak-programs/
//
// 2026 Full-Day Camp schedule (starting Jun 22):
//   Jun 22-26: $569  | Jun 29-Jul 3 (4-day, Canada Day off): $455
//   Jul 6-10: $569   | Jul 13-17: $569 | Jul 20-24: $569 | Jul 27-31: $569
//   Aug 4-7 (4-day, BC Day off): $455  | Aug 10-14: $569 | Aug 17-21: $569
//   Aug 24-28: $569  | Aug 31-Sep 4: $569
//
// DB had 6 entries (ids 423-428) covering Jul 6-Aug 14 only.
// Problems: 423-425 had wrong cost ($315 = half-day price, not full-day);
//   427 had wrong cost ($569 vs correct $455 for 4-day BC Day week);
//   missing weeks Jun 22-26, Jun 29-Jul 3, Aug 17-21, Aug 24-28, Aug 31-Sep 4.
//
// Programs offered:
//   Half-Day ($315): Fun Kayak Camp (7-10, 9am-12pm or 1pm-4pm),
//     Beginner Skills Camp (10-14, 1pm-4pm), Intermediate Camp (12-15, 1pm-4pm)
//   Full-Day ($569, or $455 for 4-day holiday weeks):
//     Fun Kayak + Coastal Adventures (7-10), Beginner Kayak + Coastal Adventures (10-14)
//   Address: 1300 Discovery St, Vancouver, BC (Jericho Sailing Centre compound)

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const pid_map = new Map(programs.map(p => [String(p.id), p]));

let fixes = 0;

function fix(id, field, value) {
  const p = pid_map.get(String(id));
  if (!p) { console.warn(`SKIP (not found): ${id}`); return; }
  p[field] = value;
  fixes++;
}

const ADDRESS = '1300 Discovery St, Vancouver, BC V6R 4K5';
const REG_URL = 'https://jerichobeachkayak.com/summer-camps/';
const AGE_JUSTIFIED = 'Jericho Beach Kayak offers full-day programs for ages 7-10 (Fun Kayak + Coastal Adventures) and 10-14 (Beginner Skills + Coastal Adventures). Combined ageMin=7/ageMax=14 covers both groups; same schedule, different program content.';
const COST_NOTE = 'Full-day camp (9am-4pm): $569/week for 5-day weeks; $455/week for 4-day holiday weeks (Canada Day Jun 29-Jul 3, BC Day Aug 4-7). Half-day camps also available: $315/week. Book at jerichobeachkayak.com/summer-camps.';
const DESC = 'Kayaking and coastal nature exploration at Jericho Beach. Full-day camps combine on-water kayaking with intertidal/marine ecology activities on shore. Ages 7-14. Paddle Canada certified instructors. 11 weeks Jun-Sep.';

// ── 1. Fix existing 6 entries (423-428) ──────────────────────────────────────
const FIXES = {
  423: { name: 'Jericho Beach Kayak Full Day Camp — Week 3 (Jul 6-10)',  cost: 569, days: 'Mon, Tue, Wed, Thu, Fri', startDate: '2026-07-06', endDate: '2026-07-10' },
  424: { name: 'Jericho Beach Kayak Full Day Camp — Week 4 (Jul 13-17)', cost: 569, days: 'Mon, Tue, Wed, Thu, Fri', startDate: '2026-07-13', endDate: '2026-07-17' },
  425: { name: 'Jericho Beach Kayak Full Day Camp — Week 5 (Jul 20-24)', cost: 569, days: 'Mon, Tue, Wed, Thu, Fri', startDate: '2026-07-20', endDate: '2026-07-24' },
  426: { name: 'Jericho Beach Kayak Full Day Camp — Week 6 (Jul 27-31)', cost: 569, days: 'Mon, Tue, Wed, Thu, Fri', startDate: '2026-07-27', endDate: '2026-07-31' },
  427: { name: 'Jericho Beach Kayak Full Day Camp — Week 7 (Aug 4-7)',   cost: 455, days: 'Tue, Wed, Thu, Fri',           startDate: '2026-08-04', endDate: '2026-08-07' },
  428: { name: 'Jericho Beach Kayak Full Day Camp — Week 8 (Aug 10-14)', cost: 569, days: 'Mon, Tue, Wed, Thu, Fri', startDate: '2026-08-10', endDate: '2026-08-14' },
};

for (const [id, w] of Object.entries(FIXES)) {
  fix(id, 'name', w.name);
  fix(id, 'cost', w.cost);
  fix(id, 'days', w.days);
  fix(id, 'startDate', w.startDate);
  fix(id, 'endDate', w.endDate);
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'priceVerified', true);
  fix(id, 'enrollmentStatus', 'Open');
  fix(id, 'confirmed2026', true);
  fix(id, 'address', ADDRESS);
  fix(id, 'registrationUrl', REG_URL);
  fix(id, 'ageMin', 7);
  fix(id, 'ageMax', 14);
  fix(id, 'ageSpanJustified', AGE_JUSTIFIED);
  fix(id, 'scheduleType', 'Full Day');
  fix(id, 'dayLength', 'Full Day');
  fix(id, 'startTime', '9:00 AM');
  fix(id, 'endTime', '4:00 PM');
  fix(id, 'durationPerDay', 7);
  fix(id, 'description', DESC);
  fix(id, 'activityType', 'Paddling & Sailing');
  fix(id, 'category', 'Sports');
  fix(id, 'campType', 'Summer Camp');
  fix(id, 'season', 'Summer 2026');
  fix(id, 'indoorOutdoor', 'Outdoor');
  fix(id, 'tags', ['kayaking', 'paddling', 'nature', 'marine ecology', 'water sports']);
  fix(id, 'neighbourhood', 'Point Grey');
  fix(id, 'lat', 49.2763);
  fix(id, 'lng', -123.2);
  fix(id, 'city', 'Vancouver');
}

// ── 2. Add 5 missing weeks ────────────────────────────────────────────────────
function addEntry(id, fields) {
  if (pid_map.has(String(id))) {
    console.warn(`SKIP (already exists): ${id}`);
    return;
  }
  const entry = Object.assign({ id }, fields);
  programs.push(entry);
  pid_map.set(String(id), entry);
  fixes++;
}

const BASE = {
  provider: 'Jericho Beach Kayak',
  category: 'Sports',
  activityType: 'Paddling & Sailing',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  indoorOutdoor: 'Outdoor',
  startTime: '9:00 AM',
  endTime: '4:00 PM',
  durationPerDay: 7,
  days: 'Mon, Tue, Wed, Thu, Fri',
  cost: 569,
  priceVerified: true,
  costNote: COST_NOTE,
  enrollmentStatus: 'Open',
  confirmed2026: true,
  registrationUrl: REG_URL,
  address: ADDRESS,
  neighbourhood: 'Point Grey',
  lat: 49.2763,
  lng: -123.2,
  city: 'Vancouver',
  season: 'Summer 2026',
  ageMin: 7,
  ageMax: 14,
  ageSpanJustified: AGE_JUSTIFIED,
  description: DESC,
  tags: ['kayaking', 'paddling', 'nature', 'marine ecology', 'water sports'],
};

// Week 1: Jun 22-26 (5-day, $569)
addEntry('JBK-2026-W1', {
  ...BASE,
  name: 'Jericho Beach Kayak Full Day Camp — Week 1 (Jun 22-26)',
  startDate: '2026-06-22',
  endDate: '2026-06-26',
});

// Week 2: Jun 29-Jul 3 (4-day, Canada Day Jul 1 off, $455)
addEntry('JBK-2026-W2', {
  ...BASE,
  name: 'Jericho Beach Kayak Full Day Camp — Week 2 (Jun 29-Jul 3)',
  startDate: '2026-06-29',
  endDate: '2026-07-03',
  days: 'Mon, Tue, Thu, Fri',  // Canada Day Wed Jul 1 off
  cost: 455,
  costNote: 'Canada Day week (Jul 1 off) — 4-day camp at reduced rate: $455. Standard 5-day weeks: $569. Half-day camps also available: $315/week.',
});

// Week 9: Aug 17-21
addEntry('JBK-2026-W9', {
  ...BASE,
  name: 'Jericho Beach Kayak Full Day Camp — Week 9 (Aug 17-21)',
  startDate: '2026-08-17',
  endDate: '2026-08-21',
});

// Week 10: Aug 24-28
addEntry('JBK-2026-W10', {
  ...BASE,
  name: 'Jericho Beach Kayak Full Day Camp — Week 10 (Aug 24-28)',
  startDate: '2026-08-24',
  endDate: '2026-08-28',
});

// Week 11: Aug 31-Sep 4
addEntry('JBK-2026-W11', {
  ...BASE,
  name: 'Jericho Beach Kayak Full Day Camp — Week 11 (Aug 31-Sep 4)',
  startDate: '2026-08-31',
  endDate: '2026-09-04',
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
