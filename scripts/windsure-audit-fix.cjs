#!/usr/bin/env node
// windsure-audit-fix.cjs
// Fixes Windsure Adventure Watersports data (rank 158 audit, 2026-04-06)
//
// Source: https://www.windsure.com/summercamps
//         https://fareharbor.com/embeds/book/windsure/items/?flow=548092&full-items=yes
//         https://fareharbor.com/embeds/book/windsure/items/290203/calendar/2026/06/?flow=548092 (item 290203 = Windsurfing & Skimboarding/SUP Full Day)
//
// Windsure offers 9 distinct camp types at Jericho Beach (1300 Discovery St):
//   FULL DAY (9am-4pm, $540): Windsurfing & Skimboarding/SUP (10-15), Windsurfing & SUP (10-15), Skimboarding & SUP (7-15)
//   HALF DAY (9am-12pm, $300): SUP (10-15), Fun & SUP (7-10), Skimboarding & SUP, Skimboard & Explore (7-15), Windsurfing (10-15)
//   HALF DAY ($350): Advanced Windsurfing (10-15)
//   OTHER: Learn to Foil Program (13-30)
//
// Camp notes: Does NOT run on statutory holidays (Canada Day Jul 1, BC Day Aug 3).
// First available full-day session: June 29, 2026.
//
// DB had 6 entries (ids 411-416) covering Jul 6 - Aug 14 only. All marked "Likely
// Coming Soon" even though registration is live on FareHarbor. Cost wrong ($375 vs $540).
// Name "Windsurfing & Paddleboard Camp" doesn't match any current program name.
//
// Fix: update all 6 entries + add 4 missing weeks (Jun 29-Jul 3, Aug 17-21, Aug 24-28, Aug 31-Sep 4).

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

const ADDRESS = '1300 Discovery Street, Vancouver, BC V6R 4L9';
const REG_URL = 'https://fareharbor.com/embeds/book/windsure/items/?flow=548092&full-items=yes';
const COST_NOTE = 'Full-day camp price: CA$540/week (Windsurfing & Skimboarding/SUP or Windsurfing & SUP). Half-day options also available: $300/week (SUP, Fun & SUP, Skimboarding & SUP, Skimboard & Explore, Windsurfing half-day), $350/week (Advanced Windsurfing). Prices include FareHarbor fees. Camp does NOT run on statutory holidays (Canada Day Jul 1, BC Day Aug 3); holiday weeks are pro-rated. Register at fareharbor.com/windsure.';
const AGE_JUSTIFIED = 'Windsure offers multiple program types with different age ranges: Windsurfing requires ages 10-15 (minimum 80lbs/36kg); Skimboarding & SUP full-day is ages 7-15; Fun & SUP half-day is ages 7-10. Entry covers the full age span across all Windsure camp types (7-15).';
const DESC = 'Watersports summer camp at Jericho Beach. Choose from windsurfing, paddleboarding (SUP), skimboarding, or combo full-day programs. All equipment provided. Led by certified instructors. Ages 7-15 across all programs. 20+ years of operation.';

// ── 1. Fix existing 6 entries (411-416) ──────────────────────────────────────
const WEEK_FIXES = {
  411: { name: 'Windsure Watersports Summer Camp — Week 2 (Jul 6-10)',    startDate: '2026-07-06', endDate: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri' },
  412: { name: 'Windsure Watersports Summer Camp — Week 3 (Jul 13-17)',   startDate: '2026-07-13', endDate: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri' },
  413: { name: 'Windsure Watersports Summer Camp — Week 4 (Jul 20-24)',   startDate: '2026-07-20', endDate: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri' },
  414: { name: 'Windsure Watersports Summer Camp — Week 5 (Jul 27-31)',   startDate: '2026-07-27', endDate: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri' },
  415: { name: 'Windsure Watersports Summer Camp — Week 6 (Aug 4-7)',     startDate: '2026-08-04', endDate: '2026-08-07', days: 'Tue, Wed, Thu, Fri' },   // BC Day Aug 3 off
  416: { name: 'Windsure Watersports Summer Camp — Week 7 (Aug 10-14)',   startDate: '2026-08-10', endDate: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri' },
};

for (const [id, week] of Object.entries(WEEK_FIXES)) {
  fix(id, 'name', week.name);
  fix(id, 'startDate', week.startDate);
  fix(id, 'endDate', week.endDate);
  fix(id, 'days', week.days);
  fix(id, 'enrollmentStatus', 'Open');
  fix(id, 'cost', 540);
  fix(id, 'priceVerified', true);
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'ageMin', 7);
  fix(id, 'ageMax', 15);
  fix(id, 'ageSpanJustified', AGE_JUSTIFIED);
  fix(id, 'startTime', '9:00 AM');
  fix(id, 'endTime', '4:00 PM');
  fix(id, 'durationPerDay', 7);
  fix(id, 'scheduleType', 'Full Day');
  fix(id, 'dayLength', 'Full Day');
  fix(id, 'registrationUrl', REG_URL);
  fix(id, 'address', ADDRESS);
  fix(id, 'neighbourhood', 'Point Grey');
  fix(id, 'city', 'Vancouver');
  fix(id, 'description', DESC);
  fix(id, 'confirmed2026', true);
  fix(id, 'activityType', 'Paddling & Sailing');
  fix(id, 'category', 'Sports');
  fix(id, 'campType', 'Summer Camp');
  fix(id, 'season', 'Summer 2026');
  fix(id, 'indoorOutdoor', 'Outdoor');
  fix(id, 'tags', ['windsurfing', 'paddleboarding', 'SUP', 'skimboarding', 'water sports', 'outdoor']);
  fix(id, 'provider', 'Windsure Adventure Watersports');
  fix(id, 'lat', 49.2763);
  fix(id, 'lng', -123.2);
}

// BC Day week: fix durationPerDay (4-day week)
fix(415, 'durationPerDay', 7);  // 4 days but still 7hr days; fill-computable handles daysCount separately

// ── 2. Add 4 missing weeks ────────────────────────────────────────────────────
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
  provider: 'Windsure Adventure Watersports',
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
  cost: 540,
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
  ageMax: 15,
  ageSpanJustified: AGE_JUSTIFIED,
  description: DESC,
  tags: ['windsurfing', 'paddleboarding', 'SUP', 'skimboarding', 'water sports', 'outdoor'],
};

// Week 1: Jun 29-Jul 3 (Canada Day Jul 1 off — 4-day week, pro-rated)
addEntry('WS-2026-W1', {
  ...BASE,
  name: 'Windsure Watersports Summer Camp — Week 1 (Jun 29-Jul 3)',
  startDate: '2026-06-29',
  endDate: '2026-07-03',
  days: 'Mon, Tue, Thu, Fri',  // Canada Day Wed Jul 1 off
  costNote: 'Canada Day week (Jul 1 off, 4 days). Price is pro-rated from $540/full week. Half-day options also available: $300/week. Register at fareharbor.com/windsure.',
});

// Week 8: Aug 17-21
addEntry('WS-2026-W8', {
  ...BASE,
  name: 'Windsure Watersports Summer Camp — Week 8 (Aug 17-21)',
  startDate: '2026-08-17',
  endDate: '2026-08-21',
});

// Week 9: Aug 24-28
addEntry('WS-2026-W9', {
  ...BASE,
  name: 'Windsure Watersports Summer Camp — Week 9 (Aug 24-28)',
  startDate: '2026-08-24',
  endDate: '2026-08-28',
});

// Week 10: Aug 31-Sep 4
addEntry('WS-2026-W10', {
  ...BASE,
  name: 'Windsure Watersports Summer Camp — Week 10 (Aug 31-Sep 4)',
  startDate: '2026-08-31',
  endDate: '2026-09-04',
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
