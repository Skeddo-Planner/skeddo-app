#!/usr/bin/env node
// campsteam-audit-fix.cjs
// Fixes Camp STEAM Canada data (rank 166 audit, 2026-04-06)
//
// Source: https://campsteam.ca/summer-camps/burnaby/
//         https://campsteam.ca/summer-camps/port-moody/
//
// FINDING: DB had 8 Surrey entries (camp-steam-surrey-1 to 8) but Surrey is
// now a 404 — no longer a Camp STEAM location. BC locations for 2026:
//   Burnaby (Nelson Ave Community Church, 5825 Nelson Ave, V5H 3H6)
//   Port Moody (Inlet United Church, 2315 Spring Street)
//   Langford, Sidney, Victoria (not Metro Van — excluded)
//
// ACTION:
//   1. Relocate existing 8 Surrey entries → Burnaby (fix address, city, ages, URL, names)
//   2. Add 8 new Port Moody entries
//
// PROGRAM DETAILS (both locations identical pricing/schedule):
//   Ages: 6-13 (was 5-13 in DB — site says "no younger than 6 ... on Aug 28, 2026")
//   Hours: 9:00 AM - 4:00 PM (7 hours)
//   Weeks 1-4, 6-8: $268/week (5-day Mon-Fri)
//   Week 5 (Aug 4-7): $215/week (4-day, BC Day Aug 3 off)
//   Before care: 7:30-9:00 AM, $40/wk ($32 for 4-day week)
//   After care: 4:00-5:30 PM, $40/wk ($32 for 4-day week)
//
// THEMES (4 themes, each runs twice):
//   Jul 6-10 & Aug 4-7:   Minecraft: Space Expedition
//   Jul 13-17 & Aug 10-14: LEGO: Theme Park Fun
//   Jul 20-24 & Aug 17-21: Minecraft: Mission to Mars
//   Jul 27-31 & Aug 24-28: LEGO: Forging the Future

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

const BURNABY_ADDRESS = '5825 Nelson Avenue, Burnaby, BC V5H 3H6';
const BURNABY_URL = 'https://campsteam.ca/summer-camps/burnaby/';
const PORT_MOODY_ADDRESS = '2315 Spring Street, Port Moody, BC V3H 1Y7';
const PORT_MOODY_URL = 'https://campsteam.ca/summer-camps/port-moody/';

const COST_NOTE = '5-day camp weeks: $268/child. 4-day week (Aug 4-7, BC Day off): $215/child. Before care 7:30-9:00 AM: $40/week ($32 for 4-day week). After care 4:00-5:30 PM: $40/week ($32 for 4-day week). Ages 6-13 (must be 6-13 on Aug 28, 2026).';
const AGE_JUSTIFIED = 'Camp STEAM serves ages 6-13 as a single cohort. Website states: "Campers must be no younger than 6 years of age and no older than 13 years of age on August 28, 2026." No sub-division by age within the program — all campers share the same curriculum and pricing.';
const TAGS = ['STEM', 'LEGO', 'Minecraft', 'coding', 'science', 'engineering', 'technology'];

// ── Week schedule ─────────────────────────────────────────────────────────────
const WEEKS = [
  { n: 1, startDate: '2026-07-06', endDate: '2026-07-10', cost: 268, days: 'Mon, Tue, Wed, Thu, Fri', theme: 'Minecraft: Space Expedition' },
  { n: 2, startDate: '2026-07-13', endDate: '2026-07-17', cost: 268, days: 'Mon, Tue, Wed, Thu, Fri', theme: 'LEGO: Theme Park Fun' },
  { n: 3, startDate: '2026-07-20', endDate: '2026-07-24', cost: 268, days: 'Mon, Tue, Wed, Thu, Fri', theme: 'Minecraft: Mission to Mars' },
  { n: 4, startDate: '2026-07-27', endDate: '2026-07-31', cost: 268, days: 'Mon, Tue, Wed, Thu, Fri', theme: 'LEGO: Forging the Future' },
  { n: 5, startDate: '2026-08-04', endDate: '2026-08-07', cost: 215, days: 'Tue, Wed, Thu, Fri',       theme: 'Minecraft: Space Expedition' },
  { n: 6, startDate: '2026-08-10', endDate: '2026-08-14', cost: 268, days: 'Mon, Tue, Wed, Thu, Fri', theme: 'LEGO: Theme Park Fun' },
  { n: 7, startDate: '2026-08-17', endDate: '2026-08-21', cost: 268, days: 'Mon, Tue, Wed, Thu, Fri', theme: 'Minecraft: Mission to Mars' },
  { n: 8, startDate: '2026-08-24', endDate: '2026-08-28', cost: 268, days: 'Mon, Tue, Wed, Thu, Fri', theme: 'LEGO: Forging the Future' },
];

// ── 1. Relocate existing Surrey entries → Burnaby ────────────────────────────
for (const w of WEEKS) {
  const id = `camp-steam-surrey-${w.n}`;
  fix(id, 'name', `Camp STEAM Burnaby — Week ${w.n} — ${w.theme} (${w.startDate.slice(5).replace('-', '/')})`);
  fix(id, 'address', BURNABY_ADDRESS);
  fix(id, 'city', 'Burnaby');
  fix(id, 'neighbourhood', 'Metrotown');
  fix(id, 'lat', 49.2245);
  fix(id, 'lng', -123.0096);
  fix(id, 'registrationUrl', BURNABY_URL);
  fix(id, 'cost', w.cost);
  fix(id, 'days', w.days);
  fix(id, 'ageMin', 6);   // Site says min 6 (was 5 in DB)
  fix(id, 'ageMax', 13);
  fix(id, 'ageSpanJustified', AGE_JUSTIFIED);
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'description', `Camp STEAM — ${w.theme}. Full-day STEAM camp at Nelson Avenue Community Church, Burnaby. Ages 6-13. Mon-Fri 9:00 AM - 4:00 PM. Before/after care available for $40/week extra. Week ${w.n} of 8.`);
  fix(id, 'enrollmentStatus', 'Open');
  fix(id, 'confirmed2026', true);
  fix(id, 'priceVerified', true);
  fix(id, 'tags', TAGS);
  // Update before/after care cost for 4-day week
  if (w.n === 5) {
    fix(id, 'beforeCare', { available: true, time: '7:30 AM - 9:00 AM', cost: 32 });
    fix(id, 'afterCare',  { available: true, time: '4:00 PM - 5:30 PM', cost: 32 });
  }
}

// ── 2. Add 8 Port Moody entries ───────────────────────────────────────────────
const PM_BASE = {
  provider: 'Camp STEAM Canada',
  category: 'STEM',
  activityType: 'Science & Technology',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  indoorOutdoor: 'Indoor',
  startTime: '9:00 AM',
  endTime: '4:00 PM',
  durationPerDay: 7,
  ageMin: 6,
  ageMax: 13,
  ageSpanJustified: AGE_JUSTIFIED,
  address: PORT_MOODY_ADDRESS,
  city: 'Port Moody',
  neighbourhood: 'Port Moody Centre',
  lat: 49.2839,
  lng: -122.8315,
  registrationUrl: PORT_MOODY_URL,
  enrollmentStatus: 'Open',
  confirmed2026: true,
  priceVerified: true,
  costNote: COST_NOTE,
  season: 'Summer 2026',
  tags: TAGS,
  beforeCare: { available: true, time: '7:30 AM - 9:00 AM', cost: 40 },
  afterCare:  { available: true, time: '4:00 PM - 5:30 PM', cost: 40 },
};

for (const w of WEEKS) {
  const id = `camp-steam-portmoody-${w.n}`;
  const extra = w.n === 5
    ? { beforeCare: { available: true, time: '7:30 AM - 9:00 AM', cost: 32 },
        afterCare:  { available: true, time: '4:00 PM - 5:30 PM', cost: 32 } }
    : {};
  addEntry(id, {
    ...PM_BASE,
    ...extra,
    name: `Camp STEAM Port Moody — Week ${w.n} — ${w.theme} (${w.startDate.slice(5).replace('-', '/')})`,
    startDate: w.startDate,
    endDate:   w.endDate,
    cost:      w.cost,
    days:      w.days,
    description: `Camp STEAM — ${w.theme}. Full-day STEAM camp at Inlet United Church, Port Moody. Ages 6-13. Mon-Fri 9:00 AM - 4:00 PM (Tue-Fri for week 5 BC Day). Air-conditioned venue. Before/after care available. Week ${w.n} of 8.`,
  });
}

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
