#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let fixCount = 0;

// ── YMCA KIDS CLUB COST FIXES ─────────────────────────────────────────────────
//
// Source: https://www.gv.ymca.ca/summer-day-camps-information (verified 2026-04-06)
// Registration opened Mar 8, 2026. Summer runs Jul 2 – Aug 28, 2026.
//
// ALL existing records had cost=50 for every location.
// Only Cascade Heights, Osler, and Donna Gabriel Robins are approved $10/day
// child care centres ($50/week). All others are $284 or $298/week.
//
// ActiveNet portal: https://anc.ca.apm.activecommunities.com/ygv/activity/search
// Anderson Wk 1 (Jul 2-3): #31762 → URL ID 26422 (ygv offset = 5340)

const CAMP_URL = 'https://www.gv.ymca.ca/summer-day-camps-information';
const START_DATE = '2026-07-02';
const END_DATE = '2026-08-28';

// Cost by location ($ per 5-day week)
const LOCATION_COSTS = {
  // $10/day approved childcare centres — $50/week is CORRECT
  'ymca-dc-cascade':    { cost: 50,  city: 'Burnaby',    costNote: '$50 per week ($10/day approved BC child care centre). Week 1 (Jul 2-3, 2 days) = $20. 50% Leisure Access subsidy available. See gv.ymca.ca for financial assistance.' },
  'ymca-dc-osler':      { cost: 50,  city: 'Vancouver',  costNote: '$50 per week ($10/day approved BC child care centre). Week 1 (Jul 2-3, 2 days) = $20. 50% Leisure Access subsidy available. See gv.ymca.ca for financial assistance.' },
  'ymca-dc-donna':      { cost: 50,  city: 'Langley',    costNote: '$50 per week ($10/day approved BC child care centre). Week 1 (Jul 2-3, 2 days) = $20. 50% Leisure Access subsidy available. See gv.ymca.ca for financial assistance.' },

  // $284/week locations (Burnaby, Vancouver non-$10/day)
  'ymca-dc-stoney':     { cost: 284, city: 'Burnaby',    costNote: '$284 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
  'ymca-dc-douglas':    { cost: 284, city: 'Vancouver',  costNote: '$284 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
  'ymca-dc-fleming':    { cost: 284, city: 'Vancouver',  costNote: '$284 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
  'ymca-dc-jamieson':   { cost: 284, city: 'Vancouver',  costNote: '$284 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
  'ymca-dc-jules':      { cost: 284, city: 'Vancouver',  costNote: '$284 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
  'ymca-dc-roberts':    { cost: 284, city: 'Vancouver',  costNote: '$284 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
  'ymca-dc-mtpleasant': { cost: 284, city: 'Vancouver',  costNote: '$284 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
  'ymca-dc-rupert':     { cost: 284, city: 'Vancouver',  costNote: '$284 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
  'ymca-dc-vanhorne':   { cost: 284, city: 'Vancouver',  costNote: '$284 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
  'ymca-dc-weir':       { cost: 284, city: 'Vancouver',  costNote: '$284 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },

  // $298/week locations (Coquitlam, Richmond, Surrey)
  'ymca-dc-coast':      { cost: 298, city: 'Coquitlam',  costNote: '$298 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
  'ymca-dc-anderson':   { cost: 298, city: 'Richmond',   costNote: '$298 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
  'ymca-dc-sprouts':    { cost: 298, city: 'Richmond',   costNote: '$298 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
  'ymca-dc-jessie':     { cost: 298, city: 'Surrey',     costNote: '$298 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
  'ymca-dc-tonglouie':  { cost: 298, city: 'Surrey',     costNote: '$298 per week (5-day). Week 1 (Jul 2-3, 2 days) is partial week. Financial assistance available — see gv.ymca.ca.' },
};

for (const prog of programs) {
  const fix = LOCATION_COSTS[prog.id];
  if (!fix) continue;

  const changed = [];

  if (prog.cost !== fix.cost) {
    changed.push(`cost ${prog.cost}→${fix.cost}`);
    prog.cost = fix.cost;
  }

  if (prog.costNote !== fix.costNote) {
    changed.push('costNote updated');
    prog.costNote = fix.costNote;
  }

  if (!prog.url) {
    prog.url = CAMP_URL;
    changed.push('url added');
  }

  if (!prog.startDate) {
    prog.startDate = START_DATE;
    changed.push('startDate');
  }

  if (!prog.endDate) {
    prog.endDate = END_DATE;
    changed.push('endDate');
  }

  if (prog.priceVerified !== true) {
    prog.priceVerified = true;
    changed.push('priceVerified');
  }

  if (changed.length) {
    fixCount++;
    console.log(`Fixed: ${prog.id} — ${changed.join(', ')}`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nDone. Fixed: ${fixCount}, Total: ${programs.length}`);
