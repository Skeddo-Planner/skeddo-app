#!/usr/bin/env node
// fdt-audit-fix.cjs
// Fixes FDT Academy Debate Camps data (rank 177 audit, 2026-04-06)
//
// Source page verified:
//   https://fdtacademy.com/debate-camps/
//
// FINDINGS:
//   - DB had confirmed2026=false and "Likely Coming Soon" — WRONG: registration is open
//   - DB had no times — actual: 11:00 AM – 3:00 PM PST
//   - DB had cost=$500 for 4 weekly entries — CORRECT (1 week = $500)
//   - DB had cost=$800 for aggregate entry — WRONG: $800 is spring camp 2-week price; summer 2-week=$900
//   - DB had ageMin=8 — should be ageMin=9 (Grades 4-12 for summer camp, Grades K-12 for general)
//   - DB covered Jul 6-31 (4 weeks); actual season has 7 weeks including Jun 22-26
//
// CONFIRMED SUMMER 2026 DATES:
//   Jun 22-26 (Speak Up! Only)
//   Jul 6-10
//   Jul 13-17
//   Jul 20-24
//   Jul 27-31
//   Aug 10-14
//   Aug 17-21
//   (No Aug 4-7 BC Day week)
//
// PRICING:
//   1 Day: $200
//   3 Days: $400
//   1 Week: $500
//   2 Weeks: $900
//   3 Weeks: $1200
//   All Access Pass: $2000
//
// PROGRAMS OFFERED:
//   Debate, Public Speaking, Communication Exploration (Ethics Olympiad, World Scholar's Cup,
//   Model UN, Mock Trial, Speak Up!). Groups split by experience level, not age.
//
// ID ASSIGNMENT:
//   617 → Jun 22-26 (Speak Up! Only) [repurposed from Jul 6-10]
//   618 → Jul 6-10 [shifted from Jul 13-17]
//   619 → Jul 13-17 [shifted from Jul 20-24]
//   620 → Jul 20-24 [shifted from Jul 27-31]
//   fdt-academy-1 → Jul 27-31 [repurposed from generic aggregate]
//   NOTE: Aug 10-14 and Aug 17-21 not covered by any ID — follow-up needed

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

const PROVIDER = 'FDT Academy';
const ADDRESS = '200-1916 West Broadway, Vancouver, BC';
const LAT = 49.2636;
const LNG = -123.1519;
const REG_URL = 'https://fdtacademy.com/debate-camps/';

const AGE_JUSTIFIED = 'FDT Academy Summer Debate Camps span Grades 4-12 (ages 9-18, 9-year span). Groups are split by experience level and tournament needs, not age bands — no sub-division by age available in registration. Provider page states "Students from grades K to 12, with any level of experience, are welcome."';

const COST_NOTE = '$500 per week. Also available: 1 day $200, 3 days $400, 2 weeks $900, 3 weeks $1200, All Access Pass (all summer) $2000. Time: 11am-3pm PST. Location: #200-1916 W Broadway, Vancouver. Groups split by experience level. Season: Jun 22-Aug 21 (7 weeks, no BC Day week Aug 4-7).';

const SEASON_NOTE = 'Full 2026 summer season: Jun 22-26 (Speak Up! Only), Jul 6-10, Jul 13-17, Jul 20-24, Jul 27-31, Aug 10-14, Aug 17-21. No camp Aug 4-7 (BC Day week). See registration page for all available weeks.';

// --- ID 617: Jun 22-26 (Speak Up! Only) ---
// Repurposed from Jul 6-10. This is the pre-season Speak Up! camp week.
fix(617, 'name', 'FDT Academy — Speak Up! Summer Camp (Jun 22-26)');
fix(617, 'provider', PROVIDER);
fix(617, 'address', ADDRESS);
fix(617, 'lat', LAT);
fix(617, 'lng', LNG);
fix(617, 'cost', 500);
fix(617, 'costNote', COST_NOTE + ' NOTE: Jun 22-26 week is Speak Up! program only (public speaking focus; debate and other programs not offered this week).');
fix(617, 'priceVerified', true);
fix(617, 'startDate', '2026-06-22');
fix(617, 'endDate', '2026-06-26');
fix(617, 'startTime', '11:00 AM');
fix(617, 'endTime', '3:00 PM');
fix(617, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(617, 'ageMin', 9);
fix(617, 'ageMax', 18);
fix(617, 'ageSpanJustified', AGE_JUSTIFIED);
fix(617, 'enrollmentStatus', 'Open');
fix(617, 'confirmed2026', true);
fix(617, 'isEstimate', false);
fix(617, 'registrationUrl', REG_URL);
fix(617, 'description', 'FDT Academy Speak Up! summer camp (public speaking) Jun 22-26, 2026. 11am-3pm PST, #200-1916 W Broadway, Vancouver. Grades K-12 welcome; groups split by experience level. Note: Only Speak Up! offered this week; debate and other programs start Jul 6.');

// --- ID 618: Jul 6-10 ---
fix(618, 'name', 'FDT Academy — Debate & Public Speaking Summer Camp (Jul 6-10)');
fix(618, 'provider', PROVIDER);
fix(618, 'address', ADDRESS);
fix(618, 'lat', LAT);
fix(618, 'lng', LNG);
fix(618, 'cost', 500);
fix(618, 'costNote', COST_NOTE);
fix(618, 'priceVerified', true);
fix(618, 'startDate', '2026-07-06');
fix(618, 'endDate', '2026-07-10');
fix(618, 'startTime', '11:00 AM');
fix(618, 'endTime', '3:00 PM');
fix(618, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(618, 'ageMin', 9);
fix(618, 'ageMax', 18);
fix(618, 'ageSpanJustified', AGE_JUSTIFIED);
fix(618, 'enrollmentStatus', 'Open');
fix(618, 'confirmed2026', true);
fix(618, 'isEstimate', false);
fix(618, 'registrationUrl', REG_URL);
fix(618, 'description', 'FDT Academy summer debate and public speaking camp Jul 6-10, 2026. 11am-3pm PST, #200-1916 W Broadway, Vancouver. Programs: Debate, Public Speaking, Communication Exploration (Ethics Olympiad, World Scholar\'s Cup, Model UN, Mock Trial, Speak Up!). Grades 4-12; groups split by experience. ' + SEASON_NOTE);

// --- ID 619: Jul 13-17 ---
fix(619, 'name', 'FDT Academy — Debate & Public Speaking Summer Camp (Jul 13-17)');
fix(619, 'provider', PROVIDER);
fix(619, 'address', ADDRESS);
fix(619, 'lat', LAT);
fix(619, 'lng', LNG);
fix(619, 'cost', 500);
fix(619, 'costNote', COST_NOTE);
fix(619, 'priceVerified', true);
fix(619, 'startDate', '2026-07-13');
fix(619, 'endDate', '2026-07-17');
fix(619, 'startTime', '11:00 AM');
fix(619, 'endTime', '3:00 PM');
fix(619, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(619, 'ageMin', 9);
fix(619, 'ageMax', 18);
fix(619, 'ageSpanJustified', AGE_JUSTIFIED);
fix(619, 'enrollmentStatus', 'Open');
fix(619, 'confirmed2026', true);
fix(619, 'isEstimate', false);
fix(619, 'registrationUrl', REG_URL);
fix(619, 'description', 'FDT Academy summer debate and public speaking camp Jul 13-17, 2026. 11am-3pm PST, #200-1916 W Broadway, Vancouver. Programs: Debate, Public Speaking, Communication Exploration. Grades 4-12; groups split by experience.');

// --- ID 620: Jul 20-24 ---
fix(620, 'name', 'FDT Academy — Debate & Public Speaking Summer Camp (Jul 20-24)');
fix(620, 'provider', PROVIDER);
fix(620, 'address', ADDRESS);
fix(620, 'lat', LAT);
fix(620, 'lng', LNG);
fix(620, 'cost', 500);
fix(620, 'costNote', COST_NOTE);
fix(620, 'priceVerified', true);
fix(620, 'startDate', '2026-07-20');
fix(620, 'endDate', '2026-07-24');
fix(620, 'startTime', '11:00 AM');
fix(620, 'endTime', '3:00 PM');
fix(620, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(620, 'ageMin', 9);
fix(620, 'ageMax', 18);
fix(620, 'ageSpanJustified', AGE_JUSTIFIED);
fix(620, 'enrollmentStatus', 'Open');
fix(620, 'confirmed2026', true);
fix(620, 'isEstimate', false);
fix(620, 'registrationUrl', REG_URL);
fix(620, 'description', 'FDT Academy summer debate and public speaking camp Jul 20-24, 2026. 11am-3pm PST, #200-1916 W Broadway, Vancouver. Programs: Debate, Public Speaking, Communication Exploration. Grades 4-12; groups split by experience.');

// --- ID fdt-academy-1: Jul 27-31 ---
// Repurposed from generic aggregate entry
fix('fdt-academy-1', 'name', 'FDT Academy — Debate & Public Speaking Summer Camp (Jul 27-31)');
fix('fdt-academy-1', 'provider', PROVIDER);
fix('fdt-academy-1', 'address', ADDRESS);
fix('fdt-academy-1', 'lat', LAT);
fix('fdt-academy-1', 'lng', LNG);
fix('fdt-academy-1', 'cost', 500);
fix('fdt-academy-1', 'costNote', COST_NOTE + ' NOTE: Also available Aug 10-14 and Aug 17-21 — no DB entries for those weeks yet. See registration page.');
fix('fdt-academy-1', 'priceVerified', true);
fix('fdt-academy-1', 'startDate', '2026-07-27');
fix('fdt-academy-1', 'endDate', '2026-07-31');
fix('fdt-academy-1', 'startTime', '11:00 AM');
fix('fdt-academy-1', 'endTime', '3:00 PM');
fix('fdt-academy-1', 'days', 'Mon, Tue, Wed, Thu, Fri');
fix('fdt-academy-1', 'ageMin', 9);
fix('fdt-academy-1', 'ageMax', 18);
fix('fdt-academy-1', 'ageSpanJustified', AGE_JUSTIFIED);
fix('fdt-academy-1', 'enrollmentStatus', 'Open');
fix('fdt-academy-1', 'confirmed2026', true);
fix('fdt-academy-1', 'isEstimate', false);
fix('fdt-academy-1', 'registrationUrl', REG_URL);
fix('fdt-academy-1', 'description', 'FDT Academy summer debate and public speaking camp Jul 27-31, 2026. 11am-3pm PST, #200-1916 W Broadway, Vancouver. Programs: Debate, Public Speaking, Communication Exploration. Grades 4-12; groups split by experience. Also available: Aug 10-14 and Aug 17-21 (no entries yet — see registration).');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
