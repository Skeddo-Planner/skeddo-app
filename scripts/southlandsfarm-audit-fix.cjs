#!/usr/bin/env node
// southlandsfarm-audit-fix.cjs
// Fixes Southlands Farm (Southlands Heritage Farm) data (rank 160 audit, 2026-04-06)
//
// Source: https://southlandsfarm.pike13.com/categories/71400 (all camps)
//         https://southlandsfarm.pike13.com/courses/122265 (Pony Camp 6-12)
//         https://southlandsfarm.pike13.com/courses/124147 (Farm Camp 6-12)
//         https://southlandsfarm.pike13.com/courses/190435 (Preschool Pony Camp 3-5)
//
// Programs:
//   Summer Pony Camp (6-12): Mon-Fri, AM 9-12 or PM 1-4, $550/half-day, 11 weeks Jun 22-Sep 4
//   Summer Farm Camp (6-12): Mon-Fri, AM 9-12 or PM 1-4, $299/half-day, 11 weeks Jun 22-Sep 4
//   Summer Pony Camp (3-5):  Tue-Wed-Thu, AM or PM, $380/3-day-week, 11 weeks Jun 23-Sep 3
//
// BC Day (Aug 3) and Canada Day (Jul 1): Farm runs full weeks (confirmed on Pike13 schedule)
// Address: 7939 MacDonald St, Vancouver, BC V6N 1G1
//
// DB had 6 entries (435-440) with WRONG prices (all $550), WRONG scheduleType (Full Day),
// WRONG times (9-4), and wrong Preschool dates (Mon-Fri instead of Tue-Thu).
// All 6 entries fixed; 27 missing weeks added (9 per program type).

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

const ADDRESS = '7939 MacDonald St, Vancouver, BC V6N 1G1';
const PC_URL  = 'https://southlandsfarm.pike13.com/courses/122265';
const FC_URL  = 'https://southlandsfarm.pike13.com/courses/124147';
const PP_URL  = 'https://southlandsfarm.pike13.com/courses/190435';

const PC_COST_NOTE = 'Half-day Pony Camp: $550/week (Mon-Fri, 9am-12pm AM or 1-4pm PM). Choose AM or PM slot at registration. Farm Camp is offered simultaneously for those wanting a full day ($299 half day added). Waitlist available at info@southlandsfarm.ca.';
const FC_COST_NOTE = 'Half-day Farm Camp: $299/week (Mon-Fri, 9am-12pm AM or 1-4pm PM). Choose AM or PM slot at registration. Can be combined with Pony Camp for a full farm day. Register at southlandsfarm.pike13.com.';
const PP_COST_NOTE = 'Preschool Pony Camp (ages 3-5): $380/3-day-week (Tue-Wed-Thu only, AM or PM half-day). Groups of 4. Waitlist: info@southlandsfarm.ca.';

// ── 1. Fix existing 6 entries ─────────────────────────────────────────────────
// 435: Pony Camp (6-12) Week 2 Jul 6-10 — fix scheduleType and times only
fix(435, 'name', 'Southlands Farm Summer Pony Camp (Ages 6-12) — Week 2 (Jul 6-10)');
fix(435, 'scheduleType', 'Half Day');
fix(435, 'dayLength', 'Half Day');
fix(435, 'startTime', '9:00 AM');
fix(435, 'endTime', '12:00 PM');
fix(435, 'durationPerDay', 3);
fix(435, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(435, 'cost', 550);
fix(435, 'costNote', PC_COST_NOTE);
fix(435, 'priceVerified', true);
fix(435, 'registrationUrl', PC_URL);
fix(435, 'address', ADDRESS);
fix(435, 'confirmed2026', true);

// 436: Pony Camp (6-12) Week 3 Jul 13-17
fix(436, 'name', 'Southlands Farm Summer Pony Camp (Ages 6-12) — Week 3 (Jul 13-17)');
fix(436, 'scheduleType', 'Half Day');
fix(436, 'dayLength', 'Half Day');
fix(436, 'startTime', '9:00 AM');
fix(436, 'endTime', '12:00 PM');
fix(436, 'durationPerDay', 3);
fix(436, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(436, 'cost', 550);
fix(436, 'costNote', PC_COST_NOTE);
fix(436, 'priceVerified', true);
fix(436, 'registrationUrl', PC_URL);
fix(436, 'address', ADDRESS);
fix(436, 'confirmed2026', true);

// 437: Farm Camp (6-12) Week 4 Jul 20-24 — fix price $550→$299 and scheduleType
fix(437, 'name', 'Southlands Farm Summer Farm Camp (Ages 6-12) — Week 4 (Jul 20-24)');
fix(437, 'scheduleType', 'Half Day');
fix(437, 'dayLength', 'Half Day');
fix(437, 'startTime', '9:00 AM');
fix(437, 'endTime', '12:00 PM');
fix(437, 'durationPerDay', 3);
fix(437, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(437, 'cost', 299);
fix(437, 'costNote', FC_COST_NOTE);
fix(437, 'priceVerified', true);
fix(437, 'registrationUrl', FC_URL);
fix(437, 'address', ADDRESS);
fix(437, 'confirmed2026', true);

// 438: Farm Camp (6-12) Week 5 Jul 27-31
fix(438, 'name', 'Southlands Farm Summer Farm Camp (Ages 6-12) — Week 5 (Jul 27-31)');
fix(438, 'scheduleType', 'Half Day');
fix(438, 'dayLength', 'Half Day');
fix(438, 'startTime', '9:00 AM');
fix(438, 'endTime', '12:00 PM');
fix(438, 'durationPerDay', 3);
fix(438, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(438, 'cost', 299);
fix(438, 'costNote', FC_COST_NOTE);
fix(438, 'priceVerified', true);
fix(438, 'registrationUrl', FC_URL);
fix(438, 'address', ADDRESS);
fix(438, 'confirmed2026', true);

// 439: Preschool Pony Camp (3-5) Week 6 — fix dates (Tue-Thu Aug 4-6, not Mon-Fri Aug 4-7)
fix(439, 'name', 'Southlands Farm Preschool Pony Camp (Ages 3-5) — Week 6 (Aug 4-6)');
fix(439, 'ageMin', 3);
fix(439, 'ageMax', 5);
fix(439, 'startDate', '2026-08-04');
fix(439, 'endDate', '2026-08-06');
fix(439, 'days', 'Tue, Wed, Thu');
fix(439, 'scheduleType', 'Half Day');
fix(439, 'dayLength', 'Half Day');
fix(439, 'startTime', '9:00 AM');
fix(439, 'endTime', '12:00 PM');
fix(439, 'durationPerDay', 3);
fix(439, 'cost', 380);
fix(439, 'costNote', PP_COST_NOTE);
fix(439, 'priceVerified', true);
fix(439, 'registrationUrl', PP_URL);
fix(439, 'address', ADDRESS);
fix(439, 'confirmed2026', true);

// 440: Preschool Pony Camp (3-5) Week 7 — fix dates (Tue-Thu Aug 11-13)
fix(440, 'name', 'Southlands Farm Preschool Pony Camp (Ages 3-5) — Week 7 (Aug 11-13)');
fix(440, 'ageMin', 3);
fix(440, 'ageMax', 5);
fix(440, 'startDate', '2026-08-11');
fix(440, 'endDate', '2026-08-13');
fix(440, 'days', 'Tue, Wed, Thu');
fix(440, 'scheduleType', 'Half Day');
fix(440, 'dayLength', 'Half Day');
fix(440, 'startTime', '9:00 AM');
fix(440, 'endTime', '12:00 PM');
fix(440, 'durationPerDay', 3);
fix(440, 'cost', 380);
fix(440, 'costNote', PP_COST_NOTE);
fix(440, 'priceVerified', true);
fix(440, 'registrationUrl', PP_URL);
fix(440, 'address', ADDRESS);
fix(440, 'confirmed2026', true);

// ── 2. Add missing weeks ──────────────────────────────────────────────────────
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

const PC_BASE = {
  provider: 'Southlands Farm',
  category: 'Animals & Nature',
  activityType: 'Horseback Riding',
  campType: 'Summer Camp',
  scheduleType: 'Half Day',
  dayLength: 'Half Day',
  indoorOutdoor: 'Outdoor',
  startTime: '9:00 AM',
  endTime: '12:00 PM',
  durationPerDay: 3,
  days: 'Mon, Tue, Wed, Thu, Fri',
  cost: 550,
  priceVerified: true,
  costNote: PC_COST_NOTE,
  enrollmentStatus: 'Open',
  confirmed2026: true,
  registrationUrl: PC_URL,
  address: ADDRESS,
  neighbourhood: 'Southlands',
  lat: 49.2283,
  lng: -123.1835,
  city: 'Vancouver',
  season: 'Summer 2026',
  ageMin: 6,
  ageMax: 12,
  description: 'Half-day horseback riding camp at Southlands Heritage Farm. Children ride ponies ~45 min/day and learn grooming, feeding, tacking up, and horse care. Trail ride Thursday, Horse Show Friday. Groups of 4. AM (9-12) or PM (1-4) session.',
  tags: ['horseback riding', 'horses', 'farm', 'animals', 'nature'],
};

const FC_BASE = {
  provider: 'Southlands Farm',
  category: 'Animals & Nature',
  activityType: 'Nature & Outdoor',
  campType: 'Summer Camp',
  scheduleType: 'Half Day',
  dayLength: 'Half Day',
  indoorOutdoor: 'Outdoor',
  startTime: '9:00 AM',
  endTime: '12:00 PM',
  durationPerDay: 3,
  days: 'Mon, Tue, Wed, Thu, Fri',
  cost: 299,
  priceVerified: true,
  costNote: FC_COST_NOTE,
  enrollmentStatus: 'Open',
  confirmed2026: true,
  registrationUrl: FC_URL,
  address: ADDRESS,
  neighbourhood: 'Southlands',
  lat: 49.2283,
  lng: -123.1835,
  city: 'Vancouver',
  season: 'Summer 2026',
  ageMin: 6,
  ageMax: 12,
  description: 'Half-day farm adventure camp at Southlands Heritage Farm. Themed weeks: survival skills, animal care, nature exploration, farm-to-table, pioneer skills, and more. AM (9-12) or PM (1-4) session available.',
  tags: ['farm', 'nature', 'animals', 'outdoor', 'science', 'survival skills'],
};

const PP_BASE = {
  provider: 'Southlands Farm',
  category: 'Animals & Nature',
  activityType: 'Horseback Riding',
  campType: 'Summer Camp',
  scheduleType: 'Half Day',
  dayLength: 'Half Day',
  indoorOutdoor: 'Outdoor',
  startTime: '9:00 AM',
  endTime: '12:00 PM',
  durationPerDay: 3,
  days: 'Tue, Wed, Thu',
  cost: 380,
  priceVerified: true,
  costNote: PP_COST_NOTE,
  enrollmentStatus: 'Open',
  confirmed2026: true,
  registrationUrl: PP_URL,
  address: ADDRESS,
  neighbourhood: 'Southlands',
  lat: 49.2283,
  lng: -123.1835,
  city: 'Vancouver',
  season: 'Summer 2026',
  ageMin: 3,
  ageMax: 5,
  description: 'Preschool pony camp at Southlands Heritage Farm. Kids ride a pony one-on-one ~20 min/day. Learn horse basics, grooming, and farm safety. Groups of 4. Runs Tue-Wed-Thu. Parents welcome to watch.',
  tags: ['horseback riding', 'horses', 'farm', 'preschool', 'animals'],
};

// Pony Camp 6-12: missing weeks 0,1,4,5,6,7,8,9,10
const PC_WEEKS = [
  { id: 'SLF-PC-W0',  name: 'Southlands Farm Summer Pony Camp (Ages 6-12) — Week 0 (Jun 22-26)',  startDate: '2026-06-22', endDate: '2026-06-26' },
  { id: 'SLF-PC-W1',  name: 'Southlands Farm Summer Pony Camp (Ages 6-12) — Week 1 (Jun 29-Jul 3)', startDate: '2026-06-29', endDate: '2026-07-03' },
  { id: 'SLF-PC-W4',  name: 'Southlands Farm Summer Pony Camp (Ages 6-12) — Week 4 (Jul 20-24)',  startDate: '2026-07-20', endDate: '2026-07-24' },
  { id: 'SLF-PC-W5',  name: 'Southlands Farm Summer Pony Camp (Ages 6-12) — Week 5 (Jul 27-31)',  startDate: '2026-07-27', endDate: '2026-07-31' },
  { id: 'SLF-PC-W6',  name: 'Southlands Farm Summer Pony Camp (Ages 6-12) — Week 6 (Aug 3-7)',    startDate: '2026-08-03', endDate: '2026-08-07' },
  { id: 'SLF-PC-W7',  name: 'Southlands Farm Summer Pony Camp (Ages 6-12) — Week 7 (Aug 10-14)', startDate: '2026-08-10', endDate: '2026-08-14' },
  { id: 'SLF-PC-W8',  name: 'Southlands Farm Summer Pony Camp (Ages 6-12) — Week 8 (Aug 17-21)', startDate: '2026-08-17', endDate: '2026-08-21' },
  { id: 'SLF-PC-W9',  name: 'Southlands Farm Summer Pony Camp (Ages 6-12) — Week 9 (Aug 24-28)', startDate: '2026-08-24', endDate: '2026-08-28' },
  { id: 'SLF-PC-W10', name: 'Southlands Farm Summer Pony Camp (Ages 6-12) — Week 10 (Aug 31-Sep 4)', startDate: '2026-08-31', endDate: '2026-09-04' },
];

for (const w of PC_WEEKS) {
  addEntry(w.id, { ...PC_BASE, name: w.name, startDate: w.startDate, endDate: w.endDate });
}

// Farm Camp 6-12: missing weeks 0,1,2,3,6,7,8,9,10
const FC_WEEKS = [
  { id: 'SLF-FC-W0',  name: 'Southlands Farm Summer Farm Camp (Ages 6-12) — Week 0 (Jun 22-26)',  startDate: '2026-06-22', endDate: '2026-06-26' },
  { id: 'SLF-FC-W1',  name: 'Southlands Farm Summer Farm Camp (Ages 6-12) — Week 1 (Jun 29-Jul 3)', startDate: '2026-06-29', endDate: '2026-07-03' },
  { id: 'SLF-FC-W2',  name: 'Southlands Farm Summer Farm Camp (Ages 6-12) — Week 2 (Jul 6-10)',   startDate: '2026-07-06', endDate: '2026-07-10' },
  { id: 'SLF-FC-W3',  name: 'Southlands Farm Summer Farm Camp (Ages 6-12) — Week 3 (Jul 13-17)',  startDate: '2026-07-13', endDate: '2026-07-17' },
  { id: 'SLF-FC-W6',  name: 'Southlands Farm Summer Farm Camp (Ages 6-12) — Week 6 (Aug 3-7)',    startDate: '2026-08-03', endDate: '2026-08-07' },
  { id: 'SLF-FC-W7',  name: 'Southlands Farm Summer Farm Camp (Ages 6-12) — Week 7 (Aug 10-14)', startDate: '2026-08-10', endDate: '2026-08-14' },
  { id: 'SLF-FC-W8',  name: 'Southlands Farm Summer Farm Camp (Ages 6-12) — Week 8 (Aug 17-21)', startDate: '2026-08-17', endDate: '2026-08-21' },
  { id: 'SLF-FC-W9',  name: 'Southlands Farm Summer Farm Camp (Ages 6-12) — Week 9 (Aug 24-28)', startDate: '2026-08-24', endDate: '2026-08-28' },
  { id: 'SLF-FC-W10', name: 'Southlands Farm Summer Farm Camp (Ages 6-12) — Week 10 (Aug 31-Sep 4)', startDate: '2026-08-31', endDate: '2026-09-04' },
];

for (const w of FC_WEEKS) {
  addEntry(w.id, { ...FC_BASE, name: w.name, startDate: w.startDate, endDate: w.endDate });
}

// Preschool Pony Camp 3-5: missing weeks 0-5, 8-10 (Tue-Thu mid-week dates)
const PP_WEEKS = [
  { id: 'SLF-PP-W0',  name: 'Southlands Farm Preschool Pony Camp (Ages 3-5) — Week 0 (Jun 23-25)',  startDate: '2026-06-23', endDate: '2026-06-25' },
  { id: 'SLF-PP-W1',  name: 'Southlands Farm Preschool Pony Camp (Ages 3-5) — Week 1 (Jun 30-Jul 2)', startDate: '2026-06-30', endDate: '2026-07-02' },
  { id: 'SLF-PP-W2',  name: 'Southlands Farm Preschool Pony Camp (Ages 3-5) — Week 2 (Jul 7-9)',    startDate: '2026-07-07', endDate: '2026-07-09' },
  { id: 'SLF-PP-W3',  name: 'Southlands Farm Preschool Pony Camp (Ages 3-5) — Week 3 (Jul 14-16)', startDate: '2026-07-14', endDate: '2026-07-16' },
  { id: 'SLF-PP-W4',  name: 'Southlands Farm Preschool Pony Camp (Ages 3-5) — Week 4 (Jul 21-23)', startDate: '2026-07-21', endDate: '2026-07-23' },
  { id: 'SLF-PP-W5',  name: 'Southlands Farm Preschool Pony Camp (Ages 3-5) — Week 5 (Jul 28-30)', startDate: '2026-07-28', endDate: '2026-07-30' },
  { id: 'SLF-PP-W8',  name: 'Southlands Farm Preschool Pony Camp (Ages 3-5) — Week 8 (Aug 18-20)', startDate: '2026-08-18', endDate: '2026-08-20' },
  { id: 'SLF-PP-W9',  name: 'Southlands Farm Preschool Pony Camp (Ages 3-5) — Week 9 (Aug 25-27)', startDate: '2026-08-25', endDate: '2026-08-27' },
  { id: 'SLF-PP-W10', name: 'Southlands Farm Preschool Pony Camp (Ages 3-5) — Week 10 (Sep 1-3)',  startDate: '2026-09-01', endDate: '2026-09-03' },
];

for (const w of PP_WEEKS) {
  addEntry(w.id, { ...PP_BASE, name: w.name, startDate: w.startDate, endDate: w.endDate });
}

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
