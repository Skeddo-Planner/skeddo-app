#!/usr/bin/env node
// ultimatecoders-audit-fix.cjs
// Fixes Ultimate Coders data (rank 168 audit, 2026-04-06)
//
// Source: https://www.ultimatecoders.com/richmond-bc-ca/programs/coding-camps
//         https://www.ultimatecoders.com/locations
//
// FINDING:
//   - Only ONE Metro Vancouver location: Richmond (4400 Hazelbridge Way, Unit 510)
//   - DB had wrong address: "6060 Minoru Blvd" — corrected to "4400 Hazelbridge Way, Unit 510"
//   - DB cost $350 is incorrect. Actual pricing (+ taxes):
//       Half Day (9am-12pm OR 1pm-4pm): $275/week
//       Full Day (9am-4pm, lunch incl.): $550/week — marked "Most Popular"
//       Day Camp (single day, 9am-4pm): $150/day
//   - "No Coding Camps are currently available at this location" → status OK as Likely Coming Soon
//   - Ages: heading says "Ages 5+" but description says "ages 6 and above" — use ageMin=6
//   - ageMax=18 not stated on page (no upper limit shown) — keep but add ageSpanJustified
//   - scheduleType: DB says Full Day — keeping as Full Day ($550) but cost set to null (+ taxes unknown)

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

const ADDRESS = '4400 Hazelbridge Way, Unit 510, Richmond, BC V6X 3R8';
const REG_URL = 'https://www.ultimatecoders.com/richmond-bc-ca/programs/coding-camps';

const COST_NOTE = 'Coding camp pricing (+ applicable taxes): Half Day (9am-12pm or 1pm-4pm) $275/week; Full Day (9am-4pm, lunch included) $550/week (most popular); Single-day camp $150/day. No registration fee. 10% off if combining with Math or Debate camp; 15% off if combining Coding + Math + Debate. Exact 2026 summer session dates not yet posted on website as of April 2026.';

const AGE_JUSTIFIED = 'Ultimate Coders serves ages 6 and up with no stated upper age limit. Website says "ages 6 and above" — upper bound of 18 retained as reasonable maximum for youth coding camps. No age-band sub-division within the camp program; pricing and curriculum are the same across all ages.';

const SESSIONS = {
  203: { name: 'Ultimate Coders Coding Camp — Week 1 (Jul 6-10)', startDate: '2026-07-06', endDate: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri' },
  204: { name: 'Ultimate Coders Coding Camp — Week 2 (Jul 13-17)', startDate: '2026-07-13', endDate: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri' },
  205: { name: 'Ultimate Coders Coding Camp — Week 3 (Jul 20-24)', startDate: '2026-07-20', endDate: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri' },
  206: { name: 'Ultimate Coders Coding Camp — Week 4 (Jul 27-31)', startDate: '2026-07-27', endDate: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri' },
  207: { name: 'Ultimate Coders Coding Camp — Week 5 (Aug 4-7)',   startDate: '2026-08-04', endDate: '2026-08-07', days: 'Tue, Wed, Thu, Fri' },  // BC Day Aug 3 off
  208: { name: 'Ultimate Coders Coding Camp — Week 6 (Aug 10-14)', startDate: '2026-08-10', endDate: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri' },
};

for (const [id, s] of Object.entries(SESSIONS)) {
  fix(id, 'name', s.name);
  fix(id, 'days', s.days);
  fix(id, 'address', ADDRESS);
  fix(id, 'cost', null);               // $275 or $550 + taxes — set null, use costNote
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'registrationUrl', REG_URL);
  fix(id, 'ageMin', 6);                // site says "ages 6 and above"
  fix(id, 'ageSpanJustified', AGE_JUSTIFIED);
  fix(id, 'lat', 49.1703);
  fix(id, 'lng', -123.1353);
  fix(id, 'enrollmentStatus', 'Likely Coming Soon');  // no sessions listed on website yet
  fix(id, 'confirmed2026', false);     // no 2026 sessions published yet
  fix(id, 'priceVerified', false);     // we see pricing tiers but not confirmed cost per session type
  fix(id, 'description', 'Coding camp at Ultimate Coders Richmond (4400 Hazelbridge Way, Unit 510). Half Day ($275/wk, 9am-12pm or 1pm-4pm) or Full Day ($550/wk, 9am-4pm with lunch) options. Ages 6+. Coding + robotics + game design. 2026 summer session dates not yet posted as of April 2026.');
}

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
