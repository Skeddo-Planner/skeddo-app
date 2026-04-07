#!/usr/bin/env node
// renaissance-audit-fix.cjs
// Fixes Renaissance Academy Summer Wondercamps data (rank 176 audit, 2026-04-06)
//
// Source page verified:
//   https://renaissanceacademy.ca/summer-wondercamps-for-kids-in-richmond/
//
// FINDINGS:
//   - DB had 6 generic "Summer Wondercamp" entries, ALL cost=null, ALL "Likely Coming Soon"
//   - Registration is OPEN as of Apr 2026 — many themed camps available
//   - Two age groups: Little Wonders (ages 5-8 / Grade 1-2) and Junior Wonders (ages 7-12 / Grade 3-6)
//   - DB ageMin=5, ageMax=12 — too broad; should be split into 5-8 and 7-12
//   - Core camp hours: 9:00 AM – 3:00 PM
//   - Extended care available: before care 7:30-9am ($75/week), aftercare 3-6pm ($110/week)
//   - Hot lunch add-on: $65/week (prepared by in-house chef)
//   - Season: 9 weeks, Jul 6 – Sep 4, 2026
//   - Prices vary by themed camp: $369-$418 for 5-day weeks; $310-$334 for BC Day week (Aug 4-7)
//   - Address: 12660 Gilley Rd, Richmond, BC (confirmed on page)
//
// REPRESENTATIVE CAMPS (sample from registration page):
//   Little Wonders (5-8): Week 1 Build A Bear $389, Week 1 Huntrix Dance-A-Long $388,
//     Week 9 STEM Spectacular $398, Week 3 Cublets Robotics Lab $418, etc.
//   Junior Wonders (7-12): Week 1 Strange Science $398, Week 1 Gamer's Academy $418,
//     Week 2 Cublets Robotics Lab $418, Week 4 Adventure Quest $418, etc.
//   BC Day week (Aug 4-7, 4 days): $310-$334 for Little Wonders; $310-$334 for Junior Wonders
//
// ID ASSIGNMENT (repurposing 6 existing IDs):
//   587 → Little Wonders season aggregate (Ages 5-8, Jul 6-Sep 4, repeating)
//   588 → Junior Wonders season aggregate (Ages 7-12, Jul 6-Sep 4, repeating)
//   589 → Little Wonders BC Day week (Ages 5-8, Aug 4-7, 4 days)
//   590 → Junior Wonders BC Day week (Ages 7-12, Aug 4-7, 4 days)
//   591 → Placeholder (additional themed camp placeholder, Likely Coming Soon)
//   592 → Placeholder (additional themed camp placeholder, Likely Coming Soon)

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

const PROVIDER = 'Renaissance Academy';
const ADDRESS = '12660 Gilley Rd, Richmond, BC';
const LAT = 49.1617;
const LNG = -123.0889;
const REG_URL = 'https://renaissanceacademy.ca/summer-wondercamps-for-kids-in-richmond/';

const ADDONS_NOTE = 'Add-ons available at checkout: hot lunch $65/week (chef-prepared daily), before care 7:30-9am $75/week, aftercare 3-6pm $110/week.';
const CANCEL_NOTE = 'Cancellation: pay-in-full refund = 2/3 before May 1 or 1/3 before June 1; no refund after June 1. Installment payments: forfeit fees paid at point of withdrawal. $25 fee per camp transfer.';

// Season: Jul 6–Sep 4 (9 weeks). Week 5 (BC Day week, Aug 4-7): 4 days, reduced price.
const SEASON_NOTE = 'Season: 9 weeks (Jul 6–Sep 4, 2026). Multiple themed camps offered each week — see registration page for full weekly lineup. BC Day week (Aug 4-7): 4-day reduced-price camps. Core hours 9:00 AM – 3:00 PM. ' + ADDONS_NOTE + ' ' + CANCEL_NOTE;

// --- ID 587: Little Wonders Season Aggregate (Ages 5-8 / Grade 1-2) ---
fix(587, 'name', 'Renaissance Academy — Little Wonders Summer Wondercamps (Ages 5-8)');
fix(587, 'provider', PROVIDER);
fix(587, 'address', ADDRESS);
fix(587, 'lat', LAT);
fix(587, 'lng', LNG);
fix(587, 'cost', 369);
fix(587, 'costNote', 'From $369/week (5-day weeks). Prices vary by themed camp: $369-$418 depending on program. BC Day week (Aug 4-7, 4 days): $310-$334. ' + SEASON_NOTE);
fix(587, 'priceVerified', true);
fix(587, 'startDate', '2026-07-06');
fix(587, 'endDate', '2026-09-04');
fix(587, 'startTime', '9:00 AM');
fix(587, 'endTime', '3:00 PM');
fix(587, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(587, 'ageMin', 5);
fix(587, 'ageMax', 8);
fix(587, 'enrollmentStatus', 'Open');
fix(587, 'confirmed2026', true);
fix(587, 'isEstimate', false);
fix(587, 'repeating', true);
fix(587, 'registrationUrl', REG_URL);
fix(587, 'description', 'Little Wonders Summer Wondercamps for ages 5-8 (Grade 1-2) at Renaissance Academy, Richmond. 9 themed weeks (Jul 6-Sep 4, 2026). Weekly themed camps include: Build A Bear, Huntrix Dance-A-Long, Cublets Robotics Lab, Dino Dig, Clay Creations, Lego Creators, Animal Trackers, Kawaii Kids, Ninja Warriors, Biome Explorers, and more. Core hours 9am-3pm; extended care 7:30am-6pm available.');
fix(587, 'isEstimate', false);

// --- ID 588: Junior Wonders Season Aggregate (Ages 7-12 / Grade 3-6) ---
fix(588, 'name', 'Renaissance Academy — Junior Wonders Summer Wondercamps (Ages 7-12)');
fix(588, 'provider', PROVIDER);
fix(588, 'address', ADDRESS);
fix(588, 'lat', LAT);
fix(588, 'lng', LNG);
fix(588, 'cost', 369);
fix(588, 'costNote', 'From $369/week (5-day weeks). Prices vary by themed camp: $369-$418 depending on program. BC Day week (Aug 4-7, 4 days): $310-$334. ' + SEASON_NOTE);
fix(588, 'priceVerified', true);
fix(588, 'startDate', '2026-07-06');
fix(588, 'endDate', '2026-09-04');
fix(588, 'startTime', '9:00 AM');
fix(588, 'endTime', '3:00 PM');
fix(588, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(588, 'ageMin', 7);
fix(588, 'ageMax', 12);
fix(588, 'enrollmentStatus', 'Open');
fix(588, 'confirmed2026', true);
fix(588, 'isEstimate', false);
fix(588, 'repeating', true);
fix(588, 'registrationUrl', REG_URL);
fix(588, 'description', 'Junior Wonders Summer Wondercamps for ages 7-12 (Grade 3-6) at Renaissance Academy, Richmond. 9 themed weeks (Jul 6-Sep 4, 2026). Weekly themed camps include: Strange Science, Gamer\'s Academy, Dessert Lab, Cublets Robotics Lab, Design & Shine, Adventure Quest, Potters Potions, 3D Maker\'s Lab, Biome Explorers, Emily Carr Inspired, Minecraft Masters, and more. Core hours 9am-3pm; extended care 7:30am-6pm available.');

// --- ID 589: Little Wonders BC Day Week (Ages 5-8, Aug 4-7, 4 days) ---
fix(589, 'name', 'Renaissance Academy — Little Wonders BC Day Week Wondercamp (Ages 5-8)');
fix(589, 'provider', PROVIDER);
fix(589, 'address', ADDRESS);
fix(589, 'lat', LAT);
fix(589, 'lng', LNG);
fix(589, 'cost', 310);
fix(589, 'costNote', 'From $310 for 4-day BC Day week (Tue-Fri, BC Day Aug 3 off). Prices vary by theme: $310-$334. ' + ADDONS_NOTE + ' ' + CANCEL_NOTE);
fix(589, 'priceVerified', true);
fix(589, 'startDate', '2026-08-04');
fix(589, 'endDate', '2026-08-07');
fix(589, 'startTime', '9:00 AM');
fix(589, 'endTime', '3:00 PM');
fix(589, 'days', 'Tue, Wed, Thu, Fri');
fix(589, 'ageMin', 5);
fix(589, 'ageMax', 8);
fix(589, 'enrollmentStatus', 'Open');
fix(589, 'confirmed2026', true);
fix(589, 'isEstimate', false);
fix(589, 'registrationUrl', REG_URL);
fix(589, 'description', 'Little Wonders (ages 5-8) BC Day week camp at Renaissance Academy, Richmond. Tue-Fri Aug 4-7 (BC Day Aug 3 off). Themed camps offered: Clay Creations, Lego Creators, 3D Makers Lab, Story Book Cooks, and more. 9am-3pm core hours. See registration page for specific themes.');

// --- ID 590: Junior Wonders BC Day Week (Ages 7-12, Aug 4-7, 4 days) ---
fix(590, 'name', 'Renaissance Academy — Junior Wonders BC Day Week Wondercamp (Ages 7-12)');
fix(590, 'provider', PROVIDER);
fix(590, 'address', ADDRESS);
fix(590, 'lat', LAT);
fix(590, 'lng', LNG);
fix(590, 'cost', 310);
fix(590, 'costNote', 'From $310 for 4-day BC Day week (Tue-Fri, BC Day Aug 3 off). Prices vary by theme: $310-$334. ' + ADDONS_NOTE + ' ' + CANCEL_NOTE);
fix(590, 'priceVerified', true);
fix(590, 'startDate', '2026-08-04');
fix(590, 'endDate', '2026-08-07');
fix(590, 'startTime', '9:00 AM');
fix(590, 'endTime', '3:00 PM');
fix(590, 'days', 'Tue, Wed, Thu, Fri');
fix(590, 'ageMin', 7);
fix(590, 'ageMax', 12);
fix(590, 'enrollmentStatus', 'Open');
fix(590, 'confirmed2026', true);
fix(590, 'isEstimate', false);
fix(590, 'registrationUrl', REG_URL);
fix(590, 'description', 'Junior Wonders (ages 7-12) BC Day week camp at Renaissance Academy, Richmond. Tue-Fri Aug 4-7 (BC Day Aug 3 off). Themed camps offered: Viral Videos Jr, 3D Makers Lab, Animal Trackers, Physics of Fun, and more. 9am-3pm core hours. See registration page for specific themes.');

// --- ID 591: Placeholder (additional themed camp option) ---
// With 6 IDs and 60+ themed camps, most camps are not individually listed.
// These placeholders indicate the provider offers more than what's in the DB.
fix(591, 'name', 'Renaissance Academy — Summer Wondercamp Additional Themed Camp (placeholder)');
fix(591, 'provider', PROVIDER);
fix(591, 'address', ADDRESS);
fix(591, 'lat', LAT);
fix(591, 'lng', LNG);
fix(591, 'cost', null);
fix(591, 'costNote', 'Renaissance Academy offers 4-10 distinct themed camps per week across 9 weeks (Jul 6-Sep 4). This is a placeholder for additional themed camps not individually listed. See https://renaissanceacademy.ca/summer-wondercamps-for-kids-in-richmond/ for the full weekly themed camp schedule. Prices $310-$418 depending on week and theme.');
fix(591, 'priceVerified', false);
fix(591, 'startDate', '2026-07-06');
fix(591, 'endDate', '2026-09-04');
fix(591, 'enrollmentStatus', 'Likely Coming Soon');
fix(591, 'confirmed2026', false);
fix(591, 'registrationUrl', REG_URL);

fix(592, 'name', 'Renaissance Academy — Summer Wondercamp Additional Themed Camp (placeholder)');
fix(592, 'provider', PROVIDER);
fix(592, 'address', ADDRESS);
fix(592, 'lat', LAT);
fix(592, 'lng', LNG);
fix(592, 'cost', null);
fix(592, 'costNote', 'Placeholder for additional Renaissance Academy Wondercamp themed camps. See registration page for full weekly schedule across all 9 weeks. Prices $310-$418.');
fix(592, 'priceVerified', false);
fix(592, 'startDate', '2026-07-06');
fix(592, 'endDate', '2026-09-04');
fix(592, 'enrollmentStatus', 'Likely Coming Soon');
fix(592, 'confirmed2026', false);
fix(592, 'registrationUrl', REG_URL);

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
