#!/usr/bin/env node
// chorusandclouds-audit-fix.cjs
// Fixes Chorus & Clouds data (rank 178 audit, 2026-04-06)
//
// Source pages verified:
//   https://chorusandclouds.ca/collections/classes (listing page, prices)
//   https://chorusandclouds.ca/products/magical-music-ages-0-5-all-ages-are-welcome (sessions, availability)
//   https://chorusandclouds.ca/products/infant-toddler-art-club-ages-10-months (sessions, availability)
//   https://chorusandclouds.ca/products/little-explorers-lab-3-12-months (sessions, availability)
//   https://chorusandclouds.ca/products/explorer-s-lab-ages-2-5-yrs (sessions, availability)
//
// FINDINGS:
//   - Spring 2026 semester: May 4 – Jun 26, 2026. Registration opened April 1, 2026 at 8am.
//   - ALL programs have available spots in the spring semester (options NOT disabled in cart)
//   - DB had ALL as "Full" or "Full/Waitlist" with confirmed2026=false — WRONG
//   - DB prices are wrong for all programs except Drop-In ($30 correct)
//   - Address confirmed: 197 East 17th Avenue, Vancouver, BC, V5V 1A5 (Mount Pleasant)
//
// CONFIRMED PROGRAMS AND PRICES:
//
//   1. Magical Music (ages 0-5):
//      Mon 3:45-4:30pm (ages 0-12mo): $188.13
//      Wed 9:15-10am (ages 0-5yr): $215.00
//      Thu 9:15-10am (ages 0-5yr): $215.00
//      Thu 3-3:45pm (ages 0-12mo): $215.00
//      Fri 3:30-4:15pm (ages 0-5yr): $215.00
//      DB cost: $222 → WRONG; corrected to $188 (min session)
//
//   2. Infant/Toddler Art Club (ages 10mo+):
//      Mon 9:30-10:15am: $179.38
//      Tue 9:30-10:15am: $205.00
//      Tue 10:45-11:30am: $205.00
//      Tue 3:30-4:15pm: $205.00
//      Fri 11:15-12pm: $205.00
//      DB cost: $212 → WRONG; corrected to $179 (min session)
//
//   3. Little Wonders Developmental Play (ages 3-12mo):
//      Mon 12:30-1:30pm: $185.00
//      Thu 12:30-1:30pm: $185.00
//      Fri 12:30-1:30pm: $161.88
//      DB cost: $191 → WRONG; corrected to $162 (min session)
//
//   4. Explorer's Lab / School Preparation (ages 2.5-5):
//      Mon 10:45-11:45am: $188.13
//      Thu 10:30-11:30am: $215.00
//      Fri 9:30-10:30am: $215.00
//      DB cost: $215 → partially correct (high-end session); corrected to $188 (min session)
//
//   5. Drop-In Art and Music (all ages):
//      DB cost: $30 → CORRECT (confirmed on listing page)

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

const PROVIDER = 'Chorus & Clouds';
const ADDRESS = '197 East 17th Avenue, Vancouver, BC V5V 1A5';
const LAT = 49.2539;
const LNG = -123.0969;

// Spring 2026 semester: May 4 – Jun 26 (no classes Victoria Day May 18)
const SEMESTER_NOTE = 'Spring 2026 semester: May 4 – Jun 26, 2026 (no class Victoria Day May 18). Current semester runs until May 1. Registration opens April 1 each semester.';
const REG_URL = 'https://chorusandclouds.ca/collections/classes';

// --- ID chorus-clouds-1: Magical Music (Ages 0-5) ---
fix('chorus-clouds-1', 'name', 'Chorus & Clouds — Magical Music (Ages 0-5)');
fix('chorus-clouds-1', 'provider', PROVIDER);
fix('chorus-clouds-1', 'address', ADDRESS);
fix('chorus-clouds-1', 'lat', LAT);
fix('chorus-clouds-1', 'lng', LNG);
fix('chorus-clouds-1', 'cost', 188);
fix('chorus-clouds-1', 'costNote', 'From $188.13/semester session (Monday 3:45-4:30pm, ages 0-12mo). Other sessions: $215.00 (Wed 9:15-10am, Thu 9:15-10am, Thu 3-3:45pm, Fri 3:30-4:15pm). Price per semester (approx 7-8 weeks). ' + SEMESTER_NOTE + ' Drop-in spots may be available — email hello@chorusandclouds.ca.');
fix('chorus-clouds-1', 'priceVerified', true);
fix('chorus-clouds-1', 'startDate', '2026-05-04');
fix('chorus-clouds-1', 'endDate', '2026-06-26');
fix('chorus-clouds-1', 'ageMin', 0);
fix('chorus-clouds-1', 'ageMax', 5);
fix('chorus-clouds-1', 'enrollmentStatus', 'Open');
fix('chorus-clouds-1', 'confirmed2026', true);
fix('chorus-clouds-1', 'registrationUrl', 'https://chorusandclouds.ca/products/magical-music-ages-0-5-all-ages-are-welcome');
fix('chorus-clouds-1', 'description', 'Magical Music classes at Chorus & Clouds (197 East 17th Ave, Vancouver / Mount Pleasant). Music-focused classes for ages 0-5. Multiple weekly sessions: Mon 3:45-4:30pm (0-12mo), Wed 9:15-10am (0-5yr), Thu 9:15-10am (0-5yr), Thu 3-3:45pm (0-12mo), Fri 3:30-4:15pm (0-5yr). Spring 2026: May 4-Jun 26. 10th year of operation.');

// --- ID chorus-clouds-2: Infant/Toddler Art Club (Ages 10mo+) ---
fix('chorus-clouds-2', 'name', 'Chorus & Clouds — Infant/Toddler Art Club (Ages 10mo+)');
fix('chorus-clouds-2', 'provider', PROVIDER);
fix('chorus-clouds-2', 'address', ADDRESS);
fix('chorus-clouds-2', 'lat', LAT);
fix('chorus-clouds-2', 'lng', LNG);
fix('chorus-clouds-2', 'cost', 179);
fix('chorus-clouds-2', 'costNote', 'From $179.38/semester session (Mon 9:30-10:15am). Other sessions: $205.00 (Tue 9:30-10:15am, Tue 10:45-11:30am, Tue 3:30-4:15pm, Fri 11:15-12pm). Price per semester. ' + SEMESTER_NOTE);
fix('chorus-clouds-2', 'priceVerified', true);
fix('chorus-clouds-2', 'startDate', '2026-05-04');
fix('chorus-clouds-2', 'endDate', '2026-06-26');
fix('chorus-clouds-2', 'ageMin', 0);
fix('chorus-clouds-2', 'ageMax', 3);
fix('chorus-clouds-2', 'enrollmentStatus', 'Open');
fix('chorus-clouds-2', 'confirmed2026', true);
fix('chorus-clouds-2', 'registrationUrl', 'https://chorusandclouds.ca/products/infant-toddler-art-club-ages-10-months');
fix('chorus-clouds-2', 'description', 'Infant/Toddler Art Club for ages 10 months+ at Chorus & Clouds, Mount Pleasant. Sensory art exploration for babies and toddlers. Sessions: Mon 9:30-10:15am, Tue 9:30-10:15am, Tue 10:45-11:30am, Tue 3:30-4:15pm, Fri 11:15-12pm. Spring 2026: May 4-Jun 26.');

// --- ID chorus-clouds-3: Little Wonders Developmental Play (Ages 3-12mo) ---
fix('chorus-clouds-3', 'name', 'Chorus & Clouds — Little Wonders Developmental Play (Ages 3-12mo)');
fix('chorus-clouds-3', 'provider', PROVIDER);
fix('chorus-clouds-3', 'address', ADDRESS);
fix('chorus-clouds-3', 'lat', LAT);
fix('chorus-clouds-3', 'lng', LNG);
fix('chorus-clouds-3', 'cost', 162);
fix('chorus-clouds-3', 'costNote', 'From $161.88/semester session (Fri 12:30-1:30pm). Other sessions: $185.00 (Mon 12:30-1:30pm, Thu 12:30-1:30pm). Price per semester. ' + SEMESTER_NOTE);
fix('chorus-clouds-3', 'priceVerified', true);
fix('chorus-clouds-3', 'startDate', '2026-05-04');
fix('chorus-clouds-3', 'endDate', '2026-06-26');
fix('chorus-clouds-3', 'ageMin', 0);
fix('chorus-clouds-3', 'ageMax', 1);
fix('chorus-clouds-3', 'enrollmentStatus', 'Open');
fix('chorus-clouds-3', 'confirmed2026', true);
fix('chorus-clouds-3', 'registrationUrl', 'https://chorusandclouds.ca/products/little-explorers-lab-3-12-months');
fix('chorus-clouds-3', 'description', 'Little Wonders Developmental Play for ages 3-12 months at Chorus & Clouds, Mount Pleasant. Gentle developmental play and music for the youngest learners and their caregivers. Sessions: Mon 12:30-1:30pm, Thu 12:30-1:30pm, Fri 12:30-1:30pm. Spring 2026: May 4-Jun 26.');

// --- ID chorus-clouds-4: Explorer's Lab / School Preparation (Ages 2.5-5) ---
fix('chorus-clouds-4', 'name', "Chorus & Clouds — Explorer's Lab / School Preparation (Ages 2.5-5)");
fix('chorus-clouds-4', 'provider', PROVIDER);
fix('chorus-clouds-4', 'address', ADDRESS);
fix('chorus-clouds-4', 'lat', LAT);
fix('chorus-clouds-4', 'lng', LNG);
fix('chorus-clouds-4', 'cost', 188);
fix('chorus-clouds-4', 'costNote', 'From $188.13/semester session (Mon 10:45-11:45am). Other sessions: $215.00 (Thu 10:30-11:30am, Fri 9:30-10:30am). Price per semester. ' + SEMESTER_NOTE);
fix('chorus-clouds-4', 'priceVerified', true);
fix('chorus-clouds-4', 'startDate', '2026-05-04');
fix('chorus-clouds-4', 'endDate', '2026-06-26');
fix('chorus-clouds-4', 'ageMin', 2);
fix('chorus-clouds-4', 'ageMax', 5);
fix('chorus-clouds-4', 'enrollmentStatus', 'Open');
fix('chorus-clouds-4', 'confirmed2026', true);
fix('chorus-clouds-4', 'registrationUrl', 'https://chorusandclouds.ca/products/explorer-s-lab-ages-2-5-yrs');
fix('chorus-clouds-4', 'description', "Explorer's Lab school preparation class for ages 2.5-5 at Chorus & Clouds, Mount Pleasant. Structured play, music, and art to build school readiness. Sessions: Mon 10:45-11:45am, Thu 10:30-11:30am, Fri 9:30-10:30am. Spring 2026: May 4-Jun 26.");

// --- ID chorus-clouds-5: Drop-In Art and Music (All Ages) ---
// $30 confirmed. Status "Full" seems wrong for a drop-in format — setting to Open.
fix('chorus-clouds-5', 'name', 'Chorus & Clouds — Drop-In Art and Music (All Ages)');
fix('chorus-clouds-5', 'provider', PROVIDER);
fix('chorus-clouds-5', 'address', ADDRESS);
fix('chorus-clouds-5', 'lat', LAT);
fix('chorus-clouds-5', 'lng', LNG);
fix('chorus-clouds-5', 'cost', 30);
fix('chorus-clouds-5', 'costNote', '$30 per drop-in session. All ages welcome. Drop-in spots may be available in some regular classes — email hello@chorusandclouds.ca or DM @chorusandclouds on Instagram to confirm availability before attending. Spring 2026: May 4-Jun 26.');
fix('chorus-clouds-5', 'priceVerified', true);
fix('chorus-clouds-5', 'startDate', '2026-05-04');
fix('chorus-clouds-5', 'endDate', '2026-06-26');
fix('chorus-clouds-5', 'ageMin', 0);
fix('chorus-clouds-5', 'ageMax', 5);
fix('chorus-clouds-5', 'enrollmentStatus', 'Open');
fix('chorus-clouds-5', 'confirmed2026', true);
fix('chorus-clouds-5', 'registrationUrl', 'https://chorusandclouds.ca/collections/drop-in-classes');
fix('chorus-clouds-5', 'description', 'Drop-in art and music sessions at Chorus & Clouds, Mount Pleasant Vancouver. $30/session. Email hello@chorusandclouds.ca or DM @chorusandclouds on Instagram to check availability in a specific class before attending.');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
