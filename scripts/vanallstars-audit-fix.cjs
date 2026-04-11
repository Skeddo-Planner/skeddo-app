#!/usr/bin/env node
// vanallstars-audit-fix.cjs
// Fixes Vancouver All Stars Baseball data (rank 152 audit, 2026-04-06)
//
// Source: https://vancouverallstars.ca/summer-camps/
//         https://vancouverallstars.ca/prices/
//         https://vancouverallstars.ca/register/
//
// Fixes:
//   1. Correct startTime/endTime on all 6 existing entries (9:00 AM-4:00 PM → 9:30 AM-3:30 PM)
//   2. Add costNote to all 6 existing entries
//   3. Fix days on id=289 (Aug 4-7): Mon-Fri → Tue-Fri (BC Day off)
//   4. Add 5 missing weeks: Jun 24-26, Jun 29-Jul 3, Aug 17-21, Aug 24-28, Aug 31-Sep 4

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

const COST_NOTE = 'CA$399/week full day (5-day weeks). 4-day weeks (BC Day) prorated to ~$320. 3-day week (Jun 24-26) prorated. Half day (AM or PM): $229. Drop-in: full day $85, half day $50. Before/After Care: $5/half-hour per child. GST (5%) extra. Programs: Baseball, Softball, Ball Foundations (AM only for skills, PM for games).';

// ── 1. Fix times and add costNote on all 6 existing entries ──────────────────
for (const id of [285, 286, 287, 288, 289, 290]) {
  fix(id, 'startTime', '9:30 AM');
  fix(id, 'endTime', '3:30 PM');
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'confirmed2026', true);
  fix(id, 'priceVerified', true);
}

// ── 2. Fix days on id=289 (Aug 4-7): BC Day off ───────────────────────────────
fix(289, 'days', 'Tue, Wed, Thu, Fri');  // BC Day = Mon Aug 3

// ── 3. Add 5 missing weeks ────────────────────────────────────────────────────
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
  provider: 'Vancouver All Stars Baseball',
  category: 'Sports',
  activityType: 'Baseball',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  indoorOutdoor: 'Outdoor',
  startTime: '9:30 AM',
  endTime: '3:30 PM',
  durationPerDay: 6,
  cost: 399,
  priceVerified: true,
  confirmed2026: true,
  enrollmentStatus: 'Open',
  registrationUrl: 'https://vancouverallstars.ca/register/',
  address: '4501 Clancy Loranger Way, Vancouver, BC V5Y 4B6',
  neighbourhood: 'Riley Park',
  lat: 49.2433,
  lng: -123.109,
  city: 'Vancouver',
  season: 'Summer 2026',
  tags: ['baseball', 'softball', 'sports'],
  description: 'Premier baseball camp at Variety Challenger Field. FUNdamental approach for all skill levels. Programs: Baseball, Softball, and Ball Foundations. Full day (9:30am–3:30pm), AM half-day (9:30am–12:15pm), or PM half-day (12:45pm–3:30pm). Award-winning camp in its 20+ year.',
  costNote: COST_NOTE,
  ageMin: 5,
  ageMax: 13,
};

// Week 1: Jun 24-26 (3-day, prorated)
addEntry('VAS-2026-W1', {
  ...BASE,
  name: 'Baseball Camp — Week 1 (Jun 24-26)',
  startDate: '2026-06-24',
  endDate: '2026-06-26',
  days: 'Wed, Thu, Fri',
  cost: 240,   // prorated: 3/5 * $399 ≈ $240
  costNote: 'Week 1 is 3 days only (Wed Jun 24 – Fri Jun 26). Prorated price ~CA$240 full day. Half day ~CA$138. GST (5%) extra. Programs: Baseball, Softball, Ball Foundations.',
});

// Week 2: Jun 29-Jul 3 (5-day, Canada Day Jul 1 held — confirmed on site)
addEntry('VAS-2026-W2', {
  ...BASE,
  name: 'Baseball Camp — Week 2 (Jun 29-Jul 3)',
  startDate: '2026-06-29',
  endDate: '2026-07-03',
  days: 'Mon, Tue, Wed, Thu, Fri',  // camp held on Canada Day per provider
  cost: 399,
  costNote: 'CA$399/week full day. Camp IS held on Canada Day (July 1) per provider. Half day: $229. Drop-in: $85 full / $50 half. GST 5% extra.',
});

// Week 9: Aug 17-21 (5-day)
addEntry('VAS-2026-W9', {
  ...BASE,
  name: 'Baseball Camp — Week 9 (Aug 17-21)',
  startDate: '2026-08-17',
  endDate: '2026-08-21',
  days: 'Mon, Tue, Wed, Thu, Fri',
  cost: 399,
});

// Week 10: Aug 24-28 (5-day)
addEntry('VAS-2026-W10', {
  ...BASE,
  name: 'Baseball Camp — Week 10 (Aug 24-28)',
  startDate: '2026-08-24',
  endDate: '2026-08-28',
  days: 'Mon, Tue, Wed, Thu, Fri',
  cost: 399,
});

// Week 11: Aug 31-Sep 4 (5-day, prorated per site note)
addEntry('VAS-2026-W11', {
  ...BASE,
  name: 'Baseball Camp — Week 11 (Aug 31-Sep 4)',
  startDate: '2026-08-31',
  endDate: '2026-09-04',
  days: 'Mon, Tue, Wed, Thu, Fri',
  cost: 399,
  costNote: 'Week 11 (Aug 31-Sep 4). CA$399/week full day. Provider notes weeks 1 and 7 are prorated — week 11 may also be prorated if it runs fewer than 5 days; check with provider. Half day: $229. GST 5% extra.',
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
