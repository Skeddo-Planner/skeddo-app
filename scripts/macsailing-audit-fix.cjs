#!/usr/bin/env node
// macsailing-audit-fix.cjs
// Fixes MacSailing data (rank 157 audit, 2026-04-06)
//
// Source: https://www.macsailing.com/our-summer-camps
//         https://www.macsailing.com/product/sailing-beach-sports-combo/29
//         https://www.macsailing.com/product/beach-kids/23
//         https://www.macsailing.com/product/sail-optis/96
//         (and all other product pages verified via browser)
//
// MacSailing offers camps at Jericho Beach from Jun 15 – Sep 4, 2026 (12 weeks).
// Program types:
//   HALF-DAY ($330–$395): Beach Kids (6-7), Sail Optis (7-10), Sail Escapes (10-14),
//     Basic Canoeing (8-14), Beach Sports Blast (8-14), Ocean Explorers (7-10),
//     Marine Protectors (10-14), CANSail Programs (11-16)
//   FULL-DAY ($600–$625): Sailing+Beach Sports ($615), Sailing+Canoeing ($625),
//     Sailing+Marine Ecology ($615), Beach Sports+Canoeing ($615),
//     Beach Sports+Marine Ecology ($600), Canoeing+Marine Ecology ($615)
//   KEELBOAT: Junior Cruiser ($595, ages 12-16, 5 dates); Basic Cruising Standard ($995, ages 14-18, 3 dates)
//
// DB had 6 entries (ids 405-410) covering weeks 4-9 only, with wrong prices,
// wrong age range (6-16), and generic names. Fixing all 6 + adding 6 missing weeks.
// Half-day and keelboat programs not individually listed in DB — noted in verification log.

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

const ADDRESS = '1300 Discovery Street, Vancouver, BC V6R 4K5';
const REG_URL = 'https://www.macsailing.com/our-summer-camps';
const COST_NOTE = 'Full-day combo camp (9am-4pm). Price depends on combo chosen: Sailing & Beach Sports $615, Sailing & Canoeing $625, Sailing & Marine Ecology $615, Beach Sports & Canoeing $615, Canoeing & Marine Ecology $615, Beach Sports & Marine Ecology $600. Half-day programs also available: $330-$395 for sailing, canoeing, beach sports, or marine ecology individually. Register at macsailing.com/our-summer-camps.';
const AGE_JUSTIFIED = 'MacSailing full-day combos are offered in two age groups: 8-10 and 10-14. Combined ageMin=8/ageMax=14 covers both groups; parents select their age group at registration.';
const DESC = 'Full-day outdoor camp at Jericho Beach combining activities such as sailing, canoeing, beach sports, and marine ecology. Led by certified instructors. Half-day options also available. In operation 25+ years, 30,000+ kids served.';

// ── 1. Fix existing 6 entries (405-410) ──────────────────────────────────────
// These cover weeks 4-9 (Jul 6-10 through Aug 10-14) — fix all shared fields
const WEEK_FIXES = {
  405: { name: 'MacSailing Full Day Camp — Week 4 (Jul 6-10)', startDate: '2026-07-06', endDate: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri' },
  406: { name: 'MacSailing Full Day Camp — Week 5 (Jul 13-17)', startDate: '2026-07-13', endDate: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri' },
  407: { name: 'MacSailing Full Day Camp — Week 6 (Jul 20-24)', startDate: '2026-07-20', endDate: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri' },
  408: { name: 'MacSailing Full Day Camp — Week 7 (Jul 27-31)', startDate: '2026-07-27', endDate: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri' },
  409: { name: 'MacSailing Full Day Camp — Week 8 (Aug 3-7)', startDate: '2026-08-03', endDate: '2026-08-07', days: 'Mon, Tue, Wed, Thu, Fri' },
  410: { name: 'MacSailing Full Day Camp — Week 9 (Aug 10-14)', startDate: '2026-08-10', endDate: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri' },
};

for (const [id, week] of Object.entries(WEEK_FIXES)) {
  fix(id, 'name', week.name);
  fix(id, 'startDate', week.startDate);
  fix(id, 'endDate', week.endDate);
  fix(id, 'days', week.days);
  fix(id, 'cost', 615);
  fix(id, 'priceVerified', true);
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'ageMin', 8);
  fix(id, 'ageMax', 14);
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
}

// ── 2. Add 6 missing weeks ────────────────────────────────────────────────────
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
  provider: 'MacSailing',
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
  cost: 615,
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
  ageMin: 8,
  ageMax: 14,
  ageSpanJustified: AGE_JUSTIFIED,
  description: DESC,
  tags: ['sailing', 'canoeing', 'beach sports', 'marine ecology', 'water sports', 'outdoor'],
};

// Week 1: Jun 15-19
addEntry('MAC-2026-W1', {
  ...BASE,
  name: 'MacSailing Full Day Camp — Week 1 (Jun 15-19)',
  startDate: '2026-06-15',
  endDate: '2026-06-19',
});

// Week 2: Jun 22-26
addEntry('MAC-2026-W2', {
  ...BASE,
  name: 'MacSailing Full Day Camp — Week 2 (Jun 22-26)',
  startDate: '2026-06-22',
  endDate: '2026-06-26',
});

// Week 3: Jun 29-Jul 3 (Canada Day Jul 1 — site lists as full week, no exception noted)
addEntry('MAC-2026-W3', {
  ...BASE,
  name: 'MacSailing Full Day Camp — Week 3 (Jun 29-Jul 3)',
  startDate: '2026-06-29',
  endDate: '2026-07-03',
  costNote: COST_NOTE + ' Note: Canada Day (Jul 1) — site lists full week with no exception; verify with provider.',
});

// Week 10: Aug 17-21
addEntry('MAC-2026-W10', {
  ...BASE,
  name: 'MacSailing Full Day Camp — Week 10 (Aug 17-21)',
  startDate: '2026-08-17',
  endDate: '2026-08-21',
});

// Week 11: Aug 24-28
addEntry('MAC-2026-W11', {
  ...BASE,
  name: 'MacSailing Full Day Camp — Week 11 (Aug 24-28)',
  startDate: '2026-08-24',
  endDate: '2026-08-28',
});

// Week 12: Aug 31-Sep 4
addEntry('MAC-2026-W12', {
  ...BASE,
  name: 'MacSailing Full Day Camp — Week 12 (Aug 31-Sep 4)',
  startDate: '2026-08-31',
  endDate: '2026-09-04',
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
