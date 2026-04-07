#!/usr/bin/env node
// salmonforest-audit-fix.cjs
// Fixes Salmon Forest data (rank 179 audit, 2026-04-06)
//
// Source pages verified:
//   https://www.salmonforest.ca/services-6-1 (summer camp — details, schedule, price)
//   https://www.salmonforest.ca/prod-days (Pro-D Day — date, price, ages)
//
// FINDINGS:
//   - DB summer camp data is mostly correct:
//       cost $415/week correct (site says $415 + GST)
//       All 6 week dates/themes match exactly (Jul 6-10, 13-17, 20-24, Aug 3-7, 10-14, 17-21)
//       Times 9am-3pm correct; location Mossom Creek Hatchery Port Moody correct
//       Status "Coming Soon" correct — public registration opens April 7 (tomorrow)
//       registrationDate: 2026-04-07 correct
//   - Age update: site now says "Kindergarten to Grade 5" for summer 2026
//       (previously K-Grade 3; site notes "we are now welcoming children from Kindergarten to Grade 5")
//       Summer camps DB ageMax=11 is already correct for K-Grade 5
//   - Pro-D Day ageMax: 8 → 11 (page says K-Grade 5, not K-Grade 3 as implied by ageMax=8)
//   - All entries missing costNote — adding for completeness
//   - Aug 3-7 week (w4): provider explicitly lists Aug 3 (BC Day) in their schedule
//
// CONFIRMED DATA:
//   Address: 12 Mossom Creek Dr, Port Moody, BC V3H 2X3 (Mossom Creek Hatchery)
//   Summer camps: $415 + GST/week, 9am-3pm, K-Grade 5, max 16 children, 1:8 ratio
//   Pro-D Day: Apr 24, $85/child ($10 off each additional sibling), K-Grade 5, 9am-3pm
//   Public registration: April 7, 2026 at 8:00 AM
//   JotForm summer: https://form.jotform.com/260805878160260
//   JotForm Pro-D: https://form.jotform.com/260614859254261

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

const PROVIDER = 'Salmon Forest';
const ADDRESS = '12 Mossom Creek Dr, Port Moody, BC V3H 2X3';
const LAT = 49.2897;
const LNG = -122.8539;
const SUMMER_REG_URL = 'https://form.jotform.com/260805878160260';
const PROD_REG_URL = 'https://form.jotform.com/260614859254261';

const SUMMER_COST_NOTE = '$415 + GST per week. Small-group forest camp at Mossom Creek Hatchery, Port Moody. 9am-3pm. K-Grade 5 (ages 5-11). Max 16 children, 1:8 ratio. Cancellation: full refund if cancelled 1+ month before start (minus $30 admin fee); no refund within 1 month. Public registration opens April 7, 2026 at 8:00 AM.';

// --- salmon-forest-proday-1: Pro-D Day Forest Adventure (Apr 24) ---
fix('salmon-forest-proday-1', 'ageMax', 11); // page says K-Grade 5 (was 8 = K-Grade 3)
fix('salmon-forest-proday-1', 'costNote', '$85/child. Sibling discount: $10 off each additional sibling. Single-day Pro-D Day forest adventure at Mossom Creek Hatchery, Port Moody. 9am-3pm, Friday April 24, 2026. K-Grade 5 (ages 5-11). Capacity: 15 children.');
fix('salmon-forest-proday-1', 'priceVerified', true);
fix('salmon-forest-proday-1', 'description', 'Salmon Forest Pro-D Day forest adventure at Mossom Creek Hatchery, Port Moody. Friday April 24, 2026, 9am-3pm. Full day of forest exploration: nature walks, wildlife tracking, outdoor games, seasonal crafts. K-Grade 5. $85/child ($10 sibling discount). Small group, certified forest educators.');

// --- salmon-forest-w1: Forest Explorers (Jul 6-10) ---
fix('salmon-forest-w1', 'costNote', SUMMER_COST_NOTE);
fix('salmon-forest-w1', 'priceVerified', true);
fix('salmon-forest-w1', 'description', 'Salmon Forest — Forest Explorers summer camp, Jul 6-10, 2026. Nature-based day camp at Mossom Creek Hatchery, Port Moody. Children explore forest, creek, and salmon habitat through play, storytelling, and hands-on learning. 9am-3pm. K-Grade 5 (ages 5-11).');

// --- salmon-forest-w2: Salmon & Water Guardians (Jul 13-17) ---
fix('salmon-forest-w2', 'costNote', SUMMER_COST_NOTE);
fix('salmon-forest-w2', 'priceVerified', true);
fix('salmon-forest-w2', 'description', 'Salmon Forest — Salmon & Water Guardians summer camp, Jul 13-17, 2026. Themed week focused on salmon ecosystems and water stewardship at Mossom Creek Hatchery, Port Moody. 9am-3pm. K-Grade 5 (ages 5-11).');

// --- salmon-forest-w3: Wildlife Detectives (Jul 20-24) ---
fix('salmon-forest-w3', 'costNote', SUMMER_COST_NOTE);
fix('salmon-forest-w3', 'priceVerified', true);
fix('salmon-forest-w3', 'description', 'Salmon Forest — Wildlife Detectives summer camp, Jul 20-24, 2026. Themed week focused on wildlife tracking and identification at Mossom Creek Hatchery, Port Moody. 9am-3pm. K-Grade 5 (ages 5-11).');

// --- salmon-forest-w4: Wilderness Survival (Aug 3-7) ---
// Provider explicitly lists Aug 3 (BC Day Monday) as the start of this week.
fix('salmon-forest-w4', 'costNote', SUMMER_COST_NOTE + ' NOTE: This week runs Aug 3-7 (includes BC Day Monday Aug 3) per provider schedule — confirm with provider if plans change.');
fix('salmon-forest-w4', 'priceVerified', true);
fix('salmon-forest-w4', 'description', 'Salmon Forest — Wilderness Survival summer camp, Aug 3-7, 2026. Themed week focused on outdoor survival skills at Mossom Creek Hatchery, Port Moody. 9am-3pm. K-Grade 5 (ages 5-11). Note: week starts Aug 3 (BC Day) per provider schedule.');

// --- salmon-forest-w5: Plants & Forest Medicine (Aug 10-14) ---
fix('salmon-forest-w5', 'costNote', SUMMER_COST_NOTE);
fix('salmon-forest-w5', 'priceVerified', true);
fix('salmon-forest-w5', 'description', 'Salmon Forest — Plants & Forest Medicine summer camp, Aug 10-14, 2026. Themed week exploring local plants and traditional forest medicine at Mossom Creek Hatchery, Port Moody. 9am-3pm. K-Grade 5 (ages 5-11).');

// --- salmon-forest-w6: Woodworkers 101 (Aug 17-21) ---
fix('salmon-forest-w6', 'costNote', SUMMER_COST_NOTE);
fix('salmon-forest-w6', 'priceVerified', true);
fix('salmon-forest-w6', 'description', 'Salmon Forest — Woodworkers 101 summer camp, Aug 17-21, 2026. Themed week focused on basic woodworking and nature crafts at Mossom Creek Hatchery, Port Moody. 9am-3pm. K-Grade 5 (ages 5-11).');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
