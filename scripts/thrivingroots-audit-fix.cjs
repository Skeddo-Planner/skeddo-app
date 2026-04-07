#!/usr/bin/env node
// thrivingroots-audit-fix.cjs
// Fixes Thriving Roots data (rank 173 audit, 2026-04-06)
//
// Source pages verified:
//   https://www.thrivingroots.org/camps (full listing)
//   https://www.thrivingroots.org/wilderness-skills-camp (price, time, location)
//   https://www.thrivingroots.org/little-explorers-camp (price, time, location)
//   https://www.thrivingroots.org/campus (geographic confirmation)
//
// CRITICAL FINDING:
//   Thriving Roots is based in GREATER VICTORIA (Vancouver Island), NOT Metro Vancouver.
//   - "Our programs have typically been hosted from outdoor spaces in the Greater Victoria area"
//   - 2026/27 interim location: Boys & Girls Club Campus, 3900 Metchosin Rd, Metchosin, BC
//   - Cedar Song Centre: 119 Ross Durrance Rd, Highlands, BC (near Victoria)
//   - Beaver Lake Ponds (summer 2026 camps) = Saanich/Victoria area
//   - DB address "3691 Mountain Hwy, North Vancouver" is COMPLETELY WRONG
//   - lat/lng corrected to Greater Victoria → programs will fall outside Metro Vancouver
//
// OTHER FINDINGS:
//   - DB had generic "Wilderness Camp" names — 9 distinct themed programs exist
//   - DB cost $380 is WRONG: Little Explorers $465+GST, Wilderness Skills $585+GST
//   - DB ageMin=5/ageMax=17 — should be split by age group (5-7, 8-14, teens 13-17)
//   - Times: Little Explorers 10am-2:30pm; Youth 8-14: 9:30am-3:30pm
//   - registrationUrl: CampBrain portal (login required) — main camps page is better public URL

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

// Geographic correction: Beaver Lake Ponds, Greater Victoria (Saanich area)
// NOT Metro Vancouver — lat/lng reflect actual Victoria location
const ADDRESS = 'Beaver Lake Ponds, Saanich, BC (Greater Victoria)';
const LAT = 48.5145;   // Elk/Beaver Lake Regional Park, Saanich
const LNG = -123.4102;
const PROVIDER = 'Thriving Roots';
const REG_URL = 'https://www.thrivingroots.org/camps';
const CAMP_BRAIN = 'https://thrivingroots.campbrainregistration.com/';

const GEO_NOTE = 'NOTE: Thriving Roots is based in Greater Victoria (Vancouver Island), NOT Metro Vancouver. 2026 summer camps held at Beaver Lake Ponds in Saanich, BC. Year-round programs at interim location 3900 Metchosin Rd, Metchosin, BC (Boys & Girls Club campus). Provider phone: 778-676-4842.';

// --- ID 488: Little Explorers (Ages 5-7) ---
// CONFIRMED: Jun 29-Jul 3, 10am-2:30pm, $465+GST
fix(488, 'name', 'Thriving Roots — Little Explorers Summer Camp (Ages 5-7)');
fix(488, 'provider', PROVIDER);
fix(488, 'address', ADDRESS);
fix(488, 'lat', LAT);
fix(488, 'lng', LNG);
fix(488, 'cost', 465);
fix(488, 'costNote', '$465 + GST. Includes camp t-shirt. Non-refundable deposit included in fee. 14-day notice required for refund (excl. deposit). Equity Fund discounts available for families experiencing financial barriers. ' + GEO_NOTE);
fix(488, 'priceVerified', true);
fix(488, 'startDate', '2026-06-29');
fix(488, 'endDate', '2026-07-03');
fix(488, 'startTime', '10:00 AM');
fix(488, 'endTime', '2:30 PM');
fix(488, 'days', 'Mon, Tue, Thu, Fri');  // Canada Day Jul 1 off
fix(488, 'ageMin', 5);
fix(488, 'ageMax', 7);
fix(488, 'enrollmentStatus', 'Open');
fix(488, 'confirmed2026', true);
fix(488, 'isEstimate', false);
fix(488, 'registrationUrl', CAMP_BRAIN);
fix(488, 'description', 'Nature-based summer camp for ages 5-7 at Beaver Lake Ponds, Saanich, BC (Greater Victoria). Fort building, plant/animal discovery, games, storytelling and exploration in a safe outdoor environment. Jun 29-Jul 3, 2026 (Mon/Tue/Thu/Fri, Canada Day off). Mentors: Anjolene and Diego.');

// --- ID 489: Wilderness Skills (Ages 8-14) ---
// CONFIRMED: Jul 6-10, 9:30am-3:30pm, $585+GST
fix(489, 'name', 'Thriving Roots — Wilderness Skills Summer Camp (Ages 8-14)');
fix(489, 'provider', PROVIDER);
fix(489, 'address', ADDRESS);
fix(489, 'lat', LAT);
fix(489, 'lng', LNG);
fix(489, 'cost', 585);
fix(489, 'costNote', '$585 + GST. Includes camp t-shirt. Non-refundable deposit included in fee. 14-day notice required for refund (excl. deposit). Equity Fund discounts available. ' + GEO_NOTE);
fix(489, 'priceVerified', true);
fix(489, 'startDate', '2026-07-06');
fix(489, 'endDate', '2026-07-10');
fix(489, 'startTime', '9:30 AM');
fix(489, 'endTime', '3:30 PM');
fix(489, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(489, 'ageMin', 8);
fix(489, 'ageMax', 14);
fix(489, 'enrollmentStatus', 'Open');
fix(489, 'confirmed2026', true);
fix(489, 'isEstimate', false);
fix(489, 'registrationUrl', CAMP_BRAIN);
fix(489, 'description', 'Wilderness survival skills camp for ages 8-14 at Beaver Lake Ponds, Saanich, BC (Greater Victoria). Plant medicine, shelter building, knife safety, fish spears, baskets, survival tools. 3 small age/challenge groups. Jul 6-10, 2026. Mentors: Catherine and Ariana.');

// --- ID 490: Way of the Scout (Ages 8-14) ---
// LISTED ON CAMPS PAGE: Jul 13-17, price not confirmed on individual page
fix(490, 'name', 'Thriving Roots — Way of the Scout Summer Camp (Ages 8-14)');
fix(490, 'provider', PROVIDER);
fix(490, 'address', ADDRESS);
fix(490, 'lat', LAT);
fix(490, 'lng', LNG);
fix(490, 'cost', null);
fix(490, 'costNote', 'Price likely ~$585 + GST (consistent with other 8-14 camps) but not confirmed on individual program page as of Apr 2026. ' + GEO_NOTE);
fix(490, 'priceVerified', false);
fix(490, 'startDate', '2026-07-13');
fix(490, 'endDate', '2026-07-17');
fix(490, 'startTime', '9:30 AM');
fix(490, 'endTime', '3:30 PM');
fix(490, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(490, 'ageMin', 8);
fix(490, 'ageMax', 14);
fix(490, 'enrollmentStatus', 'Open');
fix(490, 'confirmed2026', true);
fix(490, 'isEstimate', false);
fix(490, 'registrationUrl', CAMP_BRAIN);
fix(490, 'description', 'Forest tracking and scouting skills camp for ages 8-14. Jul 13-17, 2026. Beaver Lake Ponds, Saanich, BC (Greater Victoria). See trivingroots.org/camps for details.');

// --- ID 491: Wild Theatre Camp (Ages 8-14) ---
// LISTED ON CAMPS PAGE: Jul 20-24
fix(491, 'name', 'Thriving Roots — Wild Theatre Summer Camp (Ages 8-14)');
fix(491, 'provider', PROVIDER);
fix(491, 'address', ADDRESS);
fix(491, 'lat', LAT);
fix(491, 'lng', LNG);
fix(491, 'cost', null);
fix(491, 'costNote', 'Price likely ~$585 + GST (consistent with other 8-14 camps) but not confirmed on individual program page as of Apr 2026. ' + GEO_NOTE);
fix(491, 'priceVerified', false);
fix(491, 'startDate', '2026-07-20');
fix(491, 'endDate', '2026-07-24');
fix(491, 'startTime', '9:30 AM');
fix(491, 'endTime', '3:30 PM');
fix(491, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(491, 'ageMin', 8);
fix(491, 'ageMax', 14);
fix(491, 'enrollmentStatus', 'Open');
fix(491, 'confirmed2026', true);
fix(491, 'isEstimate', false);
fix(491, 'registrationUrl', CAMP_BRAIN);
fix(491, 'description', 'Nature-themed theatre and creative arts camp for ages 8-14. Jul 20-24, 2026. Beaver Lake Ponds, Saanich, BC (Greater Victoria). See thrivingroots.org/camps for details.');

// --- ID 492: Earth Arts (Ages 8-14) ---
// LISTED ON CAMPS PAGE: Aug 10-14
fix(492, 'name', 'Thriving Roots — Earth Arts Summer Camp (Ages 8-14)');
fix(492, 'provider', PROVIDER);
fix(492, 'address', ADDRESS);
fix(492, 'lat', LAT);
fix(492, 'lng', LNG);
fix(492, 'cost', null);
fix(492, 'costNote', 'Price likely ~$585 + GST (consistent with other 8-14 camps) but not confirmed on individual program page as of Apr 2026. ' + GEO_NOTE);
fix(492, 'priceVerified', false);
fix(492, 'startDate', '2026-08-10');
fix(492, 'endDate', '2026-08-14');
fix(492, 'startTime', '9:30 AM');
fix(492, 'endTime', '3:30 PM');
fix(492, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(492, 'ageMin', 8);
fix(492, 'ageMax', 14);
fix(492, 'enrollmentStatus', 'Open');
fix(492, 'confirmed2026', true);
fix(492, 'isEstimate', false);
fix(492, 'registrationUrl', CAMP_BRAIN);
fix(492, 'description', 'Nature-inspired arts camp for ages 8-14. Listening to nature through art-making, expressing wonder, creating with natural materials. Aug 10-14, 2026. Beaver Lake Ponds, Saanich, BC (Greater Victoria).');

// --- ID 493: Wild Craft & Wonder Overnight (Teens 13-17) ---
// LISTED ON CAMPS PAGE: Jul 13-17, overnight camp
fix(493, 'name', 'Thriving Roots — Wild Craft & Wonder Overnight Teen Camp (Ages 13-17)');
fix(493, 'provider', PROVIDER);
fix(493, 'address', ADDRESS);
fix(493, 'lat', LAT);
fix(493, 'lng', LNG);
fix(493, 'cost', null);
fix(493, 'costNote', 'Overnight camp — pricing not confirmed on individual program page as of Apr 2026. Multi-day residential format. ' + GEO_NOTE);
fix(493, 'priceVerified', false);
fix(493, 'startDate', '2026-07-13');
fix(493, 'endDate', '2026-07-17');
fix(493, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(493, 'ageMin', 13);
fix(493, 'ageMax', 17);
fix(493, 'enrollmentStatus', 'Open');
fix(493, 'confirmed2026', true);
fix(493, 'isEstimate', false);
fix(493, 'registrationUrl', CAMP_BRAIN);
fix(493, 'description', 'Overnight creative & wild arts teen camp for ages 13-17. 5 days/4 nights immersion at W̱MÍYEŦEN Nature Sanctuary (Greater Victoria). Forest trails, beaver lake habitat, arts immersion. Jul 13-17, 2026.');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
