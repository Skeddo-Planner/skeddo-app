#!/usr/bin/env node
// funderland-audit-fix.cjs
// Fixes Funderland data (rank 162 audit, 2026-04-06)
//
// Source: https://funderland.ca/ (home page — full fee schedule, dates, locations)
//         https://funderland.ca/summer-camp/ (program detail)
//         https://funderland.ca/summer-camp-registration-form/ (registration form)
//
// Season: Jul 2 - Sep 4, 2026 (no camp on Canada Day Jul 1 or BC Day Aug 3)
// Hours: 9:00 AM - 4:30 PM | Ages: 5-10 (K-Grade 4)
//
// 2026 Summer Fee Schedule (regular / early bird):
//   Jul 2-3 (2-day, Canada Day): $170 / $139
//   Jul 6-10: $420 / $399
//   Jul 13-17: $420 / $399
//   Jul 20-24: $420 / $399
//   Jul 27-31: $420 / $399
//   Aug 4-7 (4-day, BC Day): $370 / $350
//   Aug 10-14: $420 / $399
//   Aug 17-21: $420 / $399
//   Aug 24-28: $420 / $399
//   Aug 31-Sep 4: $420 / $399
//
// Locations:
//   Vancouver: 1708 W 16th Ave, Vancouver, BC V6J 2M1
//   North & West Vancouver: 1290 3rd St, West Vancouver, BC V7S 2Y2
//
// DB had 6 entries (ids 565-570), Jul 6 - Aug 14 only. All had cost=null.
// id=569 (Aug 4-7): wrong cost (null vs $370) and wrong days (Mon-Fri vs Tue-Fri).
// ageMax was 11 (should be 10, K-Grade 4). Address had "St" instead of "Ave".
// Missing: Jul 2-3 partial week, Aug 17-21, Aug 24-28, Aug 31-Sep 4.

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

const VAN_ADDRESS = '1708 W 16th Ave, Vancouver, BC V6J 2M1';
const REG_URL = 'https://funderland.ca/summer-camp-registration-form/';
const COST_NOTE = 'Standard weeks: $420/week (early bird $399). Holiday short weeks: Jul 2-3 (2-day Canada Day week) $170/$139; Aug 4-7 (4-day BC Day week) $370/$350. Hours 9am-4:30pm. Registration form at funderland.ca/summer-camp-registration-form/';
const DESC = 'Full-day camp at Jericho / Fairview Vancouver for children ages 5-10. Daily field trips, outdoor adventures, arts & crafts, science experiments, sports, music, drama. Low child-to-leader ratio (4:1). Two locations: Vancouver (W 16th Ave) and West Vancouver (3rd St). No camp on statutory holidays.';

const IDS = [565, 566, 567, 568, 569, 570];

// Fix all existing entries
for (const id of IDS) {
  fix(id, 'cost', 420);
  fix(id, 'priceVerified', true);
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'ageMax', 10);           // K-Grade 4 = max age 10, not 11
  fix(id, 'address', VAN_ADDRESS);  // was "16th St" → correct is "16th Ave"
  fix(id, 'description', DESC);
  fix(id, 'registrationUrl', REG_URL);
  fix(id, 'confirmed2026', true);
}

// Rename for consistency
const EXISTING_NAMES = {
  565: 'Funderland Summer Camp — Jul Week 2 (Jul 6-10)',
  566: 'Funderland Summer Camp — Jul Week 3 (Jul 13-17)',
  567: 'Funderland Summer Camp — Jul Week 4 (Jul 20-24)',
  568: 'Funderland Summer Camp — Jul Week 5 (Jul 27-31)',
  569: 'Funderland Summer Camp — Aug Week 1 (Aug 4-7)',
  570: 'Funderland Summer Camp — Aug Week 2 (Aug 10-14)',
};
for (const [id, name] of Object.entries(EXISTING_NAMES)) {
  fix(id, 'name', name);
}

// id=569 (Aug 4-7): BC Day week — 4-day, $370, Tue-Fri
fix(569, 'cost', 370);
fix(569, 'days', 'Tue, Wed, Thu, Fri');  // Aug 3 (Mon) = BC Day off
fix(569, 'costNote', 'BC Day week (Aug 3 off) — 4-day camp: $370 (early bird $350). Standard 5-day weeks: $420 ($399 early bird). Hours 9am-4:30pm. Register at funderland.ca/summer-camp-registration-form/');

// ── Add missing weeks ─────────────────────────────────────────────────────────
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
  provider: 'Funderland',
  category: 'General',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  indoorOutdoor: 'Both',
  startTime: '9:00 AM',
  endTime: '4:30 PM',
  durationPerDay: 7.5,
  days: 'Mon, Tue, Wed, Thu, Fri',
  cost: 420,
  priceVerified: true,
  costNote: COST_NOTE,
  enrollmentStatus: 'Open',
  confirmed2026: true,
  registrationUrl: REG_URL,
  address: VAN_ADDRESS,
  neighbourhood: 'Fairview',
  lat: 49.2565,
  lng: -123.142,
  city: 'Vancouver',
  season: 'Summer 2026',
  ageMin: 5,
  ageMax: 10,
  description: DESC,
  tags: ['field trips', 'art', 'craft', 'activities', 'science', 'sports'],
  activityType: 'Painting & Drawing',
  beforeCare: { available: false },
  afterCare: { available: false },
};

// Jul 2-3: 2-day partial week (Canada Day Jul 1 Mon off — Thu-Fri only)
addEntry('FL-2026-JULW1', {
  ...BASE,
  name: 'Funderland Summer Camp — Jul Week 1 (Jul 2-3)',
  startDate: '2026-07-02',
  endDate: '2026-07-03',
  days: 'Thu, Fri',  // Canada Day Jul 1 Mon off; week is only 2 days Thu-Fri
  cost: 170,
  costNote: 'Canada Day week (Jul 1 Mon off) — 2-day camp only (Thu Jul 2 - Fri Jul 3): $170 (early bird $139). Standard 5-day weeks: $420 ($399 early bird). Register at funderland.ca/summer-camp-registration-form/',
});

// Aug 17-21
addEntry('FL-2026-AUGW3', {
  ...BASE,
  name: 'Funderland Summer Camp — Aug Week 3 (Aug 17-21)',
  startDate: '2026-08-17',
  endDate: '2026-08-21',
});

// Aug 24-28
addEntry('FL-2026-AUGW4', {
  ...BASE,
  name: 'Funderland Summer Camp — Aug Week 4 (Aug 24-28)',
  startDate: '2026-08-24',
  endDate: '2026-08-28',
});

// Aug 31-Sep 4
addEntry('FL-2026-AUGW5', {
  ...BASE,
  name: 'Funderland Summer Camp — Aug Week 5 (Aug 31-Sep 4)',
  startDate: '2026-08-31',
  endDate: '2026-09-04',
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
