#!/usr/bin/env node
// zebrarobotics-audit-fix.cjs
// Fixes Zebra Robotics data (rank 169 audit, 2026-04-06)
//
// Source: https://www.zebrarobotics.com/richmond/camps
//         https://www.zebrarobotics.com/richmond/camps/58 (sample schedule check)
//
// FINDING:
//   - Richmond location confirmed: 8600 Cambie Road, Unit 210, Richmond, BC (DB address OK)
//   - 8 program types offered (not 1 generic "Robotics & Coding Camp"):
//       Building Enthusiasts (SR150) — Gr 1+, Lego Robotics, $249-$449/wk
//       Jr. Game Developer I (SC200) — Gr 1+, Coding/Scratch, $249-$449/wk
//       Adventures in Building (SR350) — Gr 3+, Lego WeDo, $249-$449/wk
//       Minecraft Adventures (SC350) — Gr 3+, Coding, $249-$449/wk
//       Robotics Engineer I Bootcamp (SR400) — Gr 4+, $249-$449/wk
//       Roblox Adventures (SC650) — Gr 6+, Coding, $249-$449/wk
//       Web Design Bootcamp (SC600) — Gr 6+, $210-$449/wk
//       Robotics Engineer II Bootcamp (SR600) — Gr 6+, $249-$449/wk
//   - Pricing range $249-$449/week (likely half-day vs full-day options)
//   - July sessions confirmed available (schedule dropdown shows "July")
//   - Existing DB cost $350 is wrong — set to null, use costNote
//   - ageSpanJustified missing (ages 6-14, span 8 years)
//   - days format needs normalization
//   - id=213 (Aug 4-7): BC Day Aug 3 off → Tue-Fri

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

const REG_URL = 'https://www.zebrarobotics.com/richmond/camps';
const COST_NOTE = 'Pricing range $249-$449/week (+ taxes). Likely half-day ($249) vs full-day ($449) options. 8 program types available each week: LEGO robotics (SR150/SR350/SR400/SR600), coding/Scratch (SC200), Minecraft (SC350), Roblox (SC650), Web Design (SC600). Select program type at zebrarobotics.com/richmond/camps when registering.';
const AGE_JUSTIFIED = 'Zebra Robotics offers 8 camp programs spanning Grades 1-6+ (approx. ages 6-14). Programs are differentiated by grade level (Grade 1+, 3+, 4+, 6+) rather than specific age bands. DB entry covers the full provider age range; parents select the appropriate program for their child\'s grade at registration.';
const DESC = 'Weekly summer robotics and coding camps at Zebra Robotics Richmond (8600 Cambie Road, Unit 210). 8 program types running concurrently: LEGO robotics (Grades 1+, 3+, 6+), Scratch coding, Minecraft, Roblox, Web Design. Half-day ($249/wk) or full-day ($449/wk) options. July 2026 sessions confirmed available.';

const SESSIONS = {
  209: { name: 'Zebra Robotics Summer Camp — Week 1 (Jul 6-10)',  startDate: '2026-07-06', endDate: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri' },
  210: { name: 'Zebra Robotics Summer Camp — Week 2 (Jul 13-17)', startDate: '2026-07-13', endDate: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri' },
  211: { name: 'Zebra Robotics Summer Camp — Week 3 (Jul 20-24)', startDate: '2026-07-20', endDate: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri' },
  212: { name: 'Zebra Robotics Summer Camp — Week 4 (Jul 27-31)', startDate: '2026-07-27', endDate: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri' },
  213: { name: 'Zebra Robotics Summer Camp — Week 5 (Aug 4-7)',   startDate: '2026-08-04', endDate: '2026-08-07', days: 'Tue, Wed, Thu, Fri' },  // BC Day Aug 3 off
  214: { name: 'Zebra Robotics Summer Camp — Week 6 (Aug 10-14)', startDate: '2026-08-10', endDate: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri' },
};

for (const [id, s] of Object.entries(SESSIONS)) {
  fix(id, 'name', s.name);
  fix(id, 'days', s.days);
  fix(id, 'cost', null);
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'registrationUrl', REG_URL);
  fix(id, 'ageSpanJustified', AGE_JUSTIFIED);
  fix(id, 'description', DESC);
  fix(id, 'enrollmentStatus', 'Open');     // July sessions confirmed in schedule dropdown
  fix(id, 'confirmed2026', true);          // July confirmed available
  fix(id, 'priceVerified', false);         // Range shown, type not confirmed
}

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
