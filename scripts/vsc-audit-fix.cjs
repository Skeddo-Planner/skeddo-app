#!/usr/bin/env node
// vsc-audit-fix.cjs
// Fixes Vancouver Skateboard Coalition data (rank 165 audit, 2026-04-06)
//
// Source: https://www.vancouverskateboardcoalition.ca/ (no camp info found)
//         https://anc.ca.apm.activecommunities.com/vancouver (CoV recreation portal)
//
// FINDING: The 6 VSC DB entries (ACT-0407, ACT-0485, ACT-0533, ACT-0588, ACT-0708, ACT-0737)
// came from the old ACTIVE Network API pull. They show $515 full-day camps with busing.
// These camps CANNOT be verified for 2026:
//   - VSC website has no summer camp info
//   - CoV recreation portal search for "skateboard camp" shows only:
//     a) Spectrum Skateboard Society Camp (Hillcrest CC, 1pm-4pm, $250, ages 6-17)
//     b) Swim and Skate Camp (Hillcrest Rink, 9:30am-4pm, $225.55, ages 8-13)
//   Neither matches the VSC DB entries ($515, 9am-3pm, "Busing Available")
//
// Action: Downgrade all 6 entries to "Likely Coming Soon", unset confirmed2026/priceVerified,
// fix names (remove typos), update registrationUrl to CoV recreation search.

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

const REG_URL = 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&activity_select_param=2&activity_keyword=skateboard&viewMode=list';
const COST_NOTE = 'Price based on prior-year ACTIVE Network API data ($515/week). 2026 VSC camps not yet confirmed on CoV recreation portal as of audit date (Apr 2026). Check CoV recreation portal or VSC website for current pricing. A 2-hour PM option at $250/week (Spectrum Skateboard Society) and a full-day Swim & Skate camp at $225.55/week are available separately through CoV recreation.';

const SESSIONS = {
  'ACT-0407': { name: 'VSC Vancouver Skate Camp — Session 1 (Jul 6-10)',  startDate: '2026-07-06', endDate: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri' },
  'ACT-0485': { name: 'VSC Vancouver Skate Camp — Session 2 (Jul 13-17)', startDate: '2026-07-13', endDate: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri' },
  'ACT-0533': { name: 'VSC Vancouver Skate Camp — Session 3 (Jul 20-24)', startDate: '2026-07-20', endDate: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri' },
  'ACT-0588': { name: 'VSC Vancouver Skate Camp — Session 4 (Jul 27-31)', startDate: '2026-07-27', endDate: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri' },
  'ACT-0708': { name: 'VSC Vancouver Skate Camp — Session 5 (Aug 10-14)', startDate: '2026-08-10', endDate: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri' },
  'ACT-0737': { name: 'VSC Vancouver Skate Camp — Session 6 (Aug 17-21)', startDate: '2026-08-17', endDate: '2026-08-21', days: 'Mon, Tue, Wed, Thu, Fri' },
};

for (const [id, s] of Object.entries(SESSIONS)) {
  fix(id, 'name', s.name);
  fix(id, 'days', s.days);
  fix(id, 'enrollmentStatus', 'Likely Coming Soon');  // Not verified in CoV portal for 2026
  fix(id, 'confirmed2026', false);                    // Cannot confirm — not in CoV portal
  fix(id, 'priceVerified', false);                    // $515 from old API, unverified
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'registrationUrl', REG_URL);
  fix(id, 'ageSpanJustified', 'Vancouver Skateboard Coalition camps target ages 6-14 across beginner to intermediate skill levels. No age-band sub-division verified on provider website.');
  fix(id, 'description', 'Full-day skateboarding camp operated by Vancouver Skateboard Coalition in partnership with City of Vancouver. Busing available. 2026 program details unconfirmed as of April 2026 — check CoV recreation portal for current availability.');
}

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
