#!/usr/bin/env node
// cts-audit-fix.cjs
// Fixes CTS Youth Society data (rank 194 audit, 2026-04-06)
//
// Source pages verified (browser navigation):
//   https://ctsyouthsociety.com/ (homepage — "Register starting May 11, 2026", ages 12-18, free)
//   https://ctsyouthsociety.com/programs/camps/ (camp types: Weekday Activity Tue-Fri, Overnight 3-night, Mishkoopitum)
//   https://ctsyouthsociety.com/register/ (registration opens May 11, 2026)
//   https://ctsyouthsociety.com/important-dates/ (Summer 2026 Calendar — no schedule published yet)
//
// FINDINGS:
//   - Summer 2026 programming confirmed — registration opens May 11, 2026
//   - Weekday Activity Camps: Tue-Fri at Burnaby Lake Regional Park (NOT Mon-Fri)
//   - Overnight Adventure Camps: 3-day/2-night weekends at multiple parks (not in DB)
//   - Mishkoopitum Camps: Indigenous-led overnight at all 4 parks (not in DB)
//   - All programs 100% FREE (cost=0 confirmed)
//   - Ages 12-18 (confirmed)
//   - Specific 2026 session dates NOT yet published — schedule released when registration opens
//
//   DB errors:
//   - enrollmentStatus "Open" is WRONG — registration opens May 11 (should be "Likely Coming Soon")
//   - name "Outdoor Leadership Camp" not found on provider website
//   - days "Mon-Fri" incorrect for Weekday Activity Camps (Tue-Fri per provider)
//   - registrationUrl points to campbrain login page — using info page instead
//   - Missing: Overnight Adventure Camps, Mishkoopitum Camps (not added — schedule not published)

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

const COST_NOTE = 'CTS Youth Society programs are completely FREE for all participants (confirmed ctsyouthsociety.com/programs/camps/). ' +
  'Summer 2026 programming confirmed; registration opens May 11, 2026 at cts.campbrainregistration.com. ' +
  'Specific session dates not published yet — check ctsyouthsociety.com/important-dates/ for 2026 schedule.';

[519, 520, 521, 522].forEach(id => {
  fix(id, 'name', 'Weekday Activity Camp');
  fix(id, 'days', 'Tue-Fri');
  fix(id, 'enrollmentStatus', 'Likely Coming Soon');
  fix(id, 'registrationDate', '2026-05-11');
  fix(id, 'registrationUrl', 'https://ctsyouthsociety.com/register/');
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'description',
    'Free outdoor day camp for youth ages 12-18 at Burnaby Lake Regional Park. ' +
    'Activities include hiking, eco-exploring, campfire cooking, park projects, games, and community gardening. ' +
    'Run by CTS Youth Society — completely free, "for youth, by youth." Registration opens May 11, 2026.'
  );
  console.log(`Fixed ID ${id}: name=Weekday Activity Camp, days=Tue-Fri, enrollmentStatus=Likely Coming Soon, registrationDate=2026-05-11`);
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`\nDone. Fixes: ${fixes}. Total programs: ${programs.length}`);
