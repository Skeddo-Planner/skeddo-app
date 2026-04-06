#!/usr/bin/env node
// rainforestcamps-audit-fix.cjs
// Fixes Rainforest Adventure Camps data (rank 161 audit, 2026-04-06)
//
// Source: https://www.rfcamps.com/
//         https://www.rfcamps.com/Coquitlam-Camps/
//
// Season: Jun 26 - Sep 4, 2026 (no camps on Canada Day Jul 1 or BC Day Aug 3)
// Hours: 9am-4pm | $275/week or $55/day
// Holiday weeks: Jun 29-Jul 3 (4-day, Jul 1 off) and Aug 4-7 (4-day, Aug 3 off) = $220
//
// Locations served (all same pricing):
//   Tri-Cities: North (7-12+), East (7-12+), West (7-12+), Kids Only PoCo (K-Gr2),
//     Kids Only Coq (K-Gr2), Youth Only (10-12+), Reel Adventures (7-12+)
//   Burnaby (K-12+), New Westminster (K-12+), Vancouver West Side (K-12+),
//   Richmond (K-12+), Maple Ridge/Pitt Meadows (K-12+), North Vancouver (K-12+),
//   Langley (K-12+), Surrey (K-12+)
//
// DB had 8 entries (ids 551-558) covering weeks 2-9 (Jul 6-Aug 28) only.
// Problems: id=555 had wrong cost ($275 vs $220 for BC Day 4-day week) and wrong
//   days (Mon-Fri vs Tue-Wed-Thu-Fri). All entries missing ageSpanJustified and costNote.
// Missing: Week 1 (Jun 29-Jul 3, $220) and Week 10 (Aug 31-Sep 4, $275).

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

const REG_URL = 'https://www.rfcamps.com/Register/';
const COST_NOTE = 'Standard weeks: $275/week or $55/day. Holiday short weeks (Jun 29–Jul 3 Canada Day, Aug 4–7 BC Day): $220/week. Before & after care available: $10/hour (8–9 am and 4–6 pm, by request). Non-profit camps. Register by email at info@rfcamps.com via rfcamps.com/Register/';
const AGE_JUSTIFIED = 'Rainforest Adventure Camps breaks programs into three age groups at each location: Kids Only (K–Grade 2, approx ages 5–7), Kids Camps (ages 7–9), and Youth Camps (ages 10–12+). ageMin=5/ageMax=12 covers all three groups; pricing and schedule are the same for all, so they are combined in one DB entry per week per region.';
const DESC = 'Outdoor, screen-free, non-profit adventure camp serving 15+ locations across Metro Vancouver. Full-day programs with swimming, sports, arts & crafts, forest exploration, and daily out-trips. Career professionals (Teachers, EAs, Lifeguards) with low camper ratios. Ages K–12+. Season: Jun 26–Sep 4, 2026. No camps on Canada Day (Jul 1) or BC Day (Aug 3).';

const IDS = [551, 552, 553, 554, 555, 556, 557, 558];

// Fix all existing entries
for (const id of IDS) {
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'ageSpanJustified', AGE_JUSTIFIED);
  fix(id, 'description', DESC);
  fix(id, 'registrationUrl', REG_URL);
  fix(id, 'priceVerified', true);
  fix(id, 'confirmed2026', true);
}

// id=555 (Aug 4-7): BC Day week — 4-day camp, wrong cost and days
fix(555, 'cost', 220);
fix(555, 'days', 'Tue, Wed, Thu, Fri');  // Aug 3 (Mon) = BC Day off
fix(555, 'name', 'Rainforest Adventure Camp — Week 6 (Aug 4-7)');
fix(555, 'costNote', 'BC Day week (Aug 3 off) — 4-day camp: $220. Standard 5-day weeks: $275/week or $55/day. Before & after care: $10/hour. Non-profit. Register at rfcamps.com/Register/');

// Rename other existing entries for clarity
const EXISTING_NAMES = {
  551: 'Rainforest Adventure Camp — Week 2 (Jul 6-10)',
  552: 'Rainforest Adventure Camp — Week 3 (Jul 13-17)',
  553: 'Rainforest Adventure Camp — Week 4 (Jul 20-24)',
  554: 'Rainforest Adventure Camp — Week 5 (Jul 27-31)',
  556: 'Rainforest Adventure Camp — Week 7 (Aug 10-14)',
  557: 'Rainforest Adventure Camp — Week 8 (Aug 17-21)',
  558: 'Rainforest Adventure Camp — Week 9 (Aug 24-28)',
};
for (const [id, name] of Object.entries(EXISTING_NAMES)) {
  fix(id, 'name', name);
}

// ── Add 2 missing weeks ───────────────────────────────────────────────────────
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
  provider: 'Rainforest Adventure Camps',
  category: 'General',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  indoorOutdoor: 'Both',
  startTime: '9:00 AM',
  endTime: '4:00 PM',
  durationPerDay: 7,
  days: 'Mon, Tue, Wed, Thu, Fri',
  cost: 275,
  priceVerified: true,
  costNote: COST_NOTE,
  enrollmentStatus: 'Open',
  confirmed2026: true,
  registrationUrl: REG_URL,
  address: 'Various locations, Tri-Cities, BC',
  neighbourhood: 'Central Coquitlam',
  lat: 49.2485,
  lng: -122.801,
  city: 'Coquitlam',
  season: 'Summer 2026',
  ageMin: 5,
  ageMax: 12,
  ageSpanJustified: AGE_JUSTIFIED,
  description: DESC,
  tags: ['adventure', 'nature', 'sports', 'swimming', 'arts'],
  activityType: 'Swimming',
  beforeCare: { available: true, time: '8:00 AM - 9:00 AM', cost: 10 },
  afterCare: { available: true, time: '4:00 PM - 6:00 PM', cost: 10 },
};

// Week 1: Jun 29-Jul 3 (Canada Day Jul 1 off — 4-day, $220)
addEntry('RFC-2026-W1', {
  ...BASE,
  name: 'Rainforest Adventure Camp — Week 1 (Jun 29-Jul 3)',
  startDate: '2026-06-29',
  endDate: '2026-07-03',
  days: 'Mon, Tue, Thu, Fri',  // Canada Day Wed Jul 1 off
  cost: 220,
  costNote: 'Canada Day week (Jul 1 off) — 4-day camp: $220. Standard 5-day weeks: $275/week or $55/day. Before & after care: $10/hour. Non-profit. Register at rfcamps.com/Register/',
});

// Week 10: Aug 31-Sep 4 (standard 5-day, $275)
addEntry('RFC-2026-W10', {
  ...BASE,
  name: 'Rainforest Adventure Camp — Week 10 (Aug 31-Sep 4)',
  startDate: '2026-08-31',
  endDate: '2026-09-04',
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
