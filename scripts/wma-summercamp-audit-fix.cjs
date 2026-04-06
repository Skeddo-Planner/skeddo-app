#!/usr/bin/env node
// wma-summercamp-audit-fix.cjs
// Fixes Westside Montessori Academy Summer Camp data (rank 163 audit, 2026-04-06)
//
// Source: https://www.wmasummercamp.com/
//         https://www.wmasummercamp.com/the-explorers-ages-5-7
//         https://www.wmasummercamp.com/the-innovators-ages-8-13-1
//
// Season: Jul 6 - Aug 14, 2026 (6 weeks)
// Hours: 8:30 AM drop-off - 4:00 PM pick-up (NOT 9:00 AM as in DB)
// Address: 5550 Fraser Street, Unit 300, Vancouver, BC V5W 2Z4 (Fraser Elementary)
// Registration: https://www.cognitoforms.com/WestsideMontessoriAcademy1/WMASummerCamp
//
// Two distinct programs:
//   The Explorers (ages 5-7, K-Gr2): Reggio-inspired hands-on learning, creativity, science
//   The Innovators (ages 8-13, Gr3-7): engineering, art, drama, science projects
//
// Pricing (same for both programs):
//   Weeks 1/2/3/4/6 ($450): Jul 6-10, Jul 13-17, Jul 20-24, Jul 27-31, Aug 10-14
//   Week 5 ($400): Aug 4-7 (4-day week, BC Day Aug 3 off)
//
// DB had 6 generic entries (ids 571-576), all "Likely Coming Soon" and cost=$325.
// Registration is live. Price confirmed at $450/$400. ageMin was 3 (min is 5).
// ageMax was 11 (max is 13 for Innovators). startTime was 9:00 AM (should be 8:30 AM).
// Description incorrectly referenced "Italian Cultural Centre" — camp is at Fraser Elementary.
// DB didn't distinguish between The Explorers and The Innovators — split into separate entries.

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

const ADDRESS = '5550 Fraser Street, Unit 300, Vancouver, BC V5W 2Z4';
const REG_URL = 'https://www.cognitoforms.com/WestsideMontessoriAcademy1/WMASummerCamp';
const COST_NOTE = 'Weeks 1–4 and 6 (5-day): $450/week. Week 5 (Aug 4–7, 4-day BC Day week): $400. Same price for The Explorers (ages 5-7) and The Innovators (ages 8-13). Register at cognitoforms.com/WestsideMontessoriAcademy1/WMASummerCamp';

const EXPLORER_DESC = 'The Explorers Camp — Reggio-inspired and Montessori hands-on camp for ages 5-7 (K-Grade 2 in Sept 2026). Creative, science, and adventure activities designed for curious younger learners at Fraser Elementary. Same week schedule as The Innovators; two separate programs run concurrently.';
const INNOVATOR_DESC = 'The Innovators Camp — STEM-focused camp for ages 8-13 (Grade 3-7 in Sept 2026). Engineering, art, drama, and science projects for independent problem-solvers and makers. Runs concurrently with The Explorers (ages 5-7) at Fraser Elementary location.';

// ── 1. Convert existing entries (571-576) to The Explorers (ages 5-7) ─────────
const EXPLORER_WEEKS = {
  571: { name: 'WMA The Explorers Camp — Week 1 (Jul 6-10)',  startDate: '2026-07-06', endDate: '2026-07-10', cost: 450, days: 'Mon, Tue, Wed, Thu, Fri' },
  572: { name: 'WMA The Explorers Camp — Week 2 (Jul 13-17)', startDate: '2026-07-13', endDate: '2026-07-17', cost: 450, days: 'Mon, Tue, Wed, Thu, Fri' },
  573: { name: 'WMA The Explorers Camp — Week 3 (Jul 20-24)', startDate: '2026-07-20', endDate: '2026-07-24', cost: 450, days: 'Mon, Tue, Wed, Thu, Fri' },
  574: { name: 'WMA The Explorers Camp — Week 4 (Jul 27-31)', startDate: '2026-07-27', endDate: '2026-07-31', cost: 450, days: 'Mon, Tue, Wed, Thu, Fri' },
  575: { name: 'WMA The Explorers Camp — Week 5 (Aug 4-7)',   startDate: '2026-08-04', endDate: '2026-08-07', cost: 400, days: 'Tue, Wed, Thu, Fri' },       // BC Day Aug 3 off
  576: { name: 'WMA The Explorers Camp — Week 6 (Aug 10-14)',startDate: '2026-08-10', endDate: '2026-08-14', cost: 450, days: 'Mon, Tue, Wed, Thu, Fri' },
};

for (const [id, w] of Object.entries(EXPLORER_WEEKS)) {
  fix(id, 'name', w.name);
  fix(id, 'cost', w.cost);
  fix(id, 'days', w.days);
  fix(id, 'startDate', w.startDate);
  fix(id, 'endDate', w.endDate);
  fix(id, 'enrollmentStatus', 'Open');
  fix(id, 'priceVerified', true);
  fix(id, 'confirmed2026', true);
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'startTime', '8:30 AM');
  fix(id, 'endTime', '4:00 PM');
  fix(id, 'durationPerDay', 7.5);
  fix(id, 'ageMin', 5);
  fix(id, 'ageMax', 7);
  fix(id, 'address', ADDRESS);
  fix(id, 'registrationUrl', REG_URL);
  fix(id, 'description', EXPLORER_DESC);
  fix(id, 'category', 'General');
  fix(id, 'activityType', 'Painting & Drawing');
  fix(id, 'tags', ['art', 'science', 'montessori', 'hands-on', 'outdoor']);
}

// ── 2. Add 6 Innovators entries (ages 8-13) ───────────────────────────────────
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

const INNOVATOR_BASE = {
  provider: 'Westside Montessori Academy',
  category: 'General',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  indoorOutdoor: 'Both',
  startTime: '8:30 AM',
  endTime: '4:00 PM',
  durationPerDay: 7.5,
  days: 'Mon, Tue, Wed, Thu, Fri',
  cost: 450,
  priceVerified: true,
  costNote: COST_NOTE,
  enrollmentStatus: 'Open',
  confirmed2026: true,
  registrationUrl: REG_URL,
  address: ADDRESS,
  neighbourhood: 'South Vancouver',
  lat: 49.2275,
  lng: -123.0908,
  city: 'Vancouver',
  season: 'Summer 2026',
  ageMin: 8,
  ageMax: 13,
  ageSpanJustified: 'The Innovators program targets Grade 3-7 in Sept 2026, approximately ages 8-13. WMA uses a single age band for this group with consistent curriculum and pricing. No sub-division by age within the Innovators program.',
  description: INNOVATOR_DESC,
  tags: ['STEM', 'engineering', 'art', 'drama', 'science', 'montessori'],
  activityType: 'Painting & Drawing',
};

const INNOVATOR_WEEKS = [
  { id: 'WMA-INV-W1', name: 'WMA The Innovators Camp — Week 1 (Jul 6-10)',  startDate: '2026-07-06', endDate: '2026-07-10', cost: 450, days: 'Mon, Tue, Wed, Thu, Fri' },
  { id: 'WMA-INV-W2', name: 'WMA The Innovators Camp — Week 2 (Jul 13-17)', startDate: '2026-07-13', endDate: '2026-07-17', cost: 450, days: 'Mon, Tue, Wed, Thu, Fri' },
  { id: 'WMA-INV-W3', name: 'WMA The Innovators Camp — Week 3 (Jul 20-24)', startDate: '2026-07-20', endDate: '2026-07-24', cost: 450, days: 'Mon, Tue, Wed, Thu, Fri' },
  { id: 'WMA-INV-W4', name: 'WMA The Innovators Camp — Week 4 (Jul 27-31)', startDate: '2026-07-27', endDate: '2026-07-31', cost: 450, days: 'Mon, Tue, Wed, Thu, Fri' },
  { id: 'WMA-INV-W5', name: 'WMA The Innovators Camp — Week 5 (Aug 4-7)',   startDate: '2026-08-04', endDate: '2026-08-07', cost: 400, days: 'Tue, Wed, Thu, Fri',
    costNote: 'BC Day week (Aug 3 off) — 4-day camp: $400. Standard 5-day weeks: $450. Register at cognitoforms.com/WestsideMontessoriAcademy1/WMASummerCamp' },
  { id: 'WMA-INV-W6', name: 'WMA The Innovators Camp — Week 6 (Aug 10-14)', startDate: '2026-08-10', endDate: '2026-08-14', cost: 450, days: 'Mon, Tue, Wed, Thu, Fri' },
];

for (const w of INNOVATOR_WEEKS) {
  const { id, ...rest } = w;
  addEntry(id, { ...INNOVATOR_BASE, ...rest });
}

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
