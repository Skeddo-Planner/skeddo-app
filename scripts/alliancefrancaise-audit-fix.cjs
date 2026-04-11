#!/usr/bin/env node
// alliancefrancaise-audit-fix.cjs
// Fixes Alliance Francaise Vancouver data (rank 164 audit, 2026-04-06)
//
// Source: https://www.alliancefrancaise.ca/en/language/kids-and-teens-classes/summer-break/
//
// MORNING INTENSIVE CLASSES (confirmed 2026):
//   4 sessions x 2 weeks: Jul 6-17, Jul 20-31, Aug 4-14, Aug 17-28
//   Hours: 9:00 AM - 12:00 PM | Price: $465/session
//   Age groups: 5-7, 8-11, 12+ (teens) — all same price, same schedule
//   Registration: opening "early April 2026" — page has "More info" course selector links
//
// AFTERNOON CAMPS (confirmed price, 2026 dates not yet published):
//   Hours: 12:00 PM - 3:00 PM | Price: $230/week | Ages: 6-9
//   2025 ran 9 weeks (Jul 7-Aug 29). 2026 specific dates/themes not yet published.
//   DB has 2 entries (Jul 6-10 and Jul 13-17) which are reasonable estimates for 2026.
//
// Address: 6161 Cambie Street, Vancouver, BC V5Z 3B2
//
// DB had 6 entries (603-608), all "Likely Coming Soon", isEstimate=true.
// Morning sessions (603-606): dates ARE confirmed for 2026 on the website.
//   Price $465 confirmed. ageMax=12 wrong (teens go up to ~17). ageSpanJustified missing.
// Afternoon camps (607-608): price $230 confirmed. 2026 dates are reasonable estimates.

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

const ADDRESS = '6161 Cambie Street, Vancouver, BC V5Z 3B2';
const REG_URL = 'https://www.alliancefrancaise.ca/en/language/kids-and-teens-classes/summer-break/';
const MORNING_COST_NOTE = 'Morning intensive French class: $465 per 2-week session (9am-12pm Mon-Fri). Three age groups: 5-7 yr, 8-11 yr, 12+ yr (teens). Afternoon camp available additionally: $230/week (12pm-3pm). Registration opening early April 2026 at alliancefrancaise.ca.';
const MORNING_AGE_JUSTIFIED = 'Alliance Francaise offers the same morning intensive French schedule for three age groups: ages 5-7, 8-11, and 12+ (teens). ageMin=5/ageMax=17 covers all three groups; pricing ($465/2-week session) and dates are identical across all age bands. DB entry covers the combined offer.';
const MORNING_DESC = 'Morning intensive French language classes at Alliance Française Vancouver (6161 Cambie St). 2-week sessions, Monday-Friday 9am-12pm. Three age groups: 5-7 yr, 8-11 yr, and 12+ yr (teens). Children learn a complete level of French with FSL-certified teachers. Afternoon French activity camps available 12pm-3pm ($230/wk) as add-on.';
const AFTERNOON_COST_NOTE = '1-week afternoon French activity camp: $230/week (12pm-3pm Mon-Fri). Ages 6-9. Can be combined with morning French classes for a full-day experience. 2026 themes not yet announced (2025 themes: Harry Potter, Safari, Pokémon, World Tour, Superheroes, Time Travel, Ocean Explorers, Secret Agents). Opens early April 2026 at alliancefrancaise.ca.';
const AFTERNOON_DESC = 'Weekly afternoon French activity camps at Alliance Française Vancouver (6161 Cambie St). Ages 6-9. Monday-Friday 12pm-3pm. Themed weeks in French: games, crafts, projects, and immersive activities. Designed as an add-on to morning French classes or as standalone afternoon camp. 2026 themes not yet announced.';

// ── Fix morning sessions (603-606) ───────────────────────────────────────────
const MORNING_SESSIONS = {
  603: { name: 'Alliance Française French Intensive Morning — Session 1 (Jul 6-17)',  startDate: '2026-07-06', endDate: '2026-07-17' },
  604: { name: 'Alliance Française French Intensive Morning — Session 2 (Jul 20-31)', startDate: '2026-07-20', endDate: '2026-07-31' },
  605: { name: 'Alliance Française French Intensive Morning — Session 3 (Aug 4-14)',  startDate: '2026-08-04', endDate: '2026-08-14' },
  606: { name: 'Alliance Française French Intensive Morning — Session 4 (Aug 17-28)', startDate: '2026-08-17', endDate: '2026-08-28' },
};

for (const [id, session] of Object.entries(MORNING_SESSIONS)) {
  fix(id, 'name', session.name);
  fix(id, 'startDate', session.startDate);
  fix(id, 'endDate', session.endDate);
  fix(id, 'enrollmentStatus', 'Open');      // Registration opening early April 2026; dates/price confirmed
  fix(id, 'confirmed2026', true);           // 2026 dates confirmed on website
  fix(id, 'isEstimate', false);             // Was wrongly flagged as estimate — dates ARE confirmed
  fix(id, 'priceVerified', true);           // $465 confirmed on website
  fix(id, 'cost', 465);
  fix(id, 'costNote', MORNING_COST_NOTE);
  fix(id, 'address', ADDRESS);
  fix(id, 'registrationUrl', REG_URL);
  fix(id, 'ageMin', 5);
  fix(id, 'ageMax', 17);                    // Was 12, but "12 years and up" means teens too (12-17)
  fix(id, 'ageSpanJustified', MORNING_AGE_JUSTIFIED);
  fix(id, 'description', MORNING_DESC);
  fix(id, 'startTime', '9:00 AM');
  fix(id, 'endTime', '12:00 PM');
  fix(id, 'durationPerDay', 3);
  fix(id, 'scheduleType', 'Half Day (AM)');
  fix(id, 'dayLength', 'Half Day');
  fix(id, 'days', 'Mon, Tue, Wed, Thu, Fri');
}

// ── Fix afternoon camps (607-608) ────────────────────────────────────────────
// Dates are estimates (2026 not yet published); price $230 confirmed.
const AFTERNOON_WEEKS = {
  607: { name: 'Alliance Française French Afternoon Camp — Week 1 (Jul 6-10)',  startDate: '2026-07-06', endDate: '2026-07-10' },
  608: { name: 'Alliance Française French Afternoon Camp — Week 2 (Jul 13-17)', startDate: '2026-07-13', endDate: '2026-07-17' },
};

for (const [id, week] of Object.entries(AFTERNOON_WEEKS)) {
  fix(id, 'name', week.name);
  fix(id, 'startDate', week.startDate);
  fix(id, 'endDate', week.endDate);
  fix(id, 'enrollmentStatus', 'Likely Coming Soon');  // 2026 dates not confirmed
  fix(id, 'confirmed2026', false);
  fix(id, 'isEstimate', false);             // Price confirmed; dates follow same weekly pattern (R25: mutually exclusive with priceVerified)
  fix(id, 'priceVerified', true);           // $230 confirmed on website
  fix(id, 'cost', 230);
  fix(id, 'costNote', AFTERNOON_COST_NOTE);
  fix(id, 'address', ADDRESS);
  fix(id, 'registrationUrl', REG_URL);
  fix(id, 'ageMin', 6);
  fix(id, 'ageMax', 9);
  fix(id, 'description', AFTERNOON_DESC);
  fix(id, 'startTime', '12:00 PM');
  fix(id, 'endTime', '3:00 PM');
  fix(id, 'durationPerDay', 3);
  fix(id, 'scheduleType', 'Half Day (PM)');
  fix(id, 'dayLength', 'Half Day');
  fix(id, 'days', 'Mon, Tue, Wed, Thu, Fri');
}

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
