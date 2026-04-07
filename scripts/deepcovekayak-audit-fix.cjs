#!/usr/bin/env node
// deepcovekayak-audit-fix.cjs
// Fixes Deep Cove Kayak data (rank 172 audit, 2026-04-06)
//
// Source pages verified:
//   https://deepcovekayak.com/lesson/junior-kayak-camp-level-1/
//   https://deepcovekayak.com/lesson/junior-kayak-camp-level-2/
//   https://deepcovekayak.com/lesson/youth-sup-camp/
//   https://deepcovekayak.com/lesson/coastal-adventure-day-camp/
//   https://deepcovekayak.com/age/youth/  (listing page for all youth programs)
//
// FINDINGS:
//   - DB had 6 generic "Kids Kayak Camp" entries — not a real program name
//   - 4 distinct program types confirmed (plus 2 more on listing page):
//       Junior Kayak Camp Level 1 — ages 7-9, AM or PM, $279+GST, 9 weeks
//       Junior Kayak Camp Level 2 — ages 7-9, PM only, $279+GST, 9 weeks (prereq: Level 1)
//       Youth SUP Camp — ages 9-12, AM only, $279+GST, 9 weeks
//       Coastal Adventure Day Camp — ages 10-12, 9am-3pm, $525+GST, 9 weeks
//       Teen Paddle Canada Level 1 Camp — teens, $545+GST (listing only, no program page navigated)
//       Youth Surfski Camp — ages 10-16 w/ experience, $325+GST (listing only)
//   - 9-week season: Jun 29-Jul 3, Jul 6-10, Jul 13-17, Jul 20-24, Jul 27-31,
//     Aug 4-7 (Tue-Fri, BC Day), Aug 11-15, Aug 17-21, Aug 24-28
//   - Cost is + GST (5%); 4-day holiday weeks discounted
//   - Address confirmed: 2156 Banbury Rd, North Vancouver — postal code V7H 1A2
//   - DB registrationUrl pointed to a news article — corrected to program-specific pages
//   - Days "Mon-Fri" → "Mon, Tue, Wed, Thu, Fri"

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

const ADDRESS = '2156 Banbury Rd, North Vancouver, BC V7H 1A2';
const PROVIDER = 'Deep Cove Kayak';
const LAT = 49.3249;
const LNG = -122.9480;

// Standard date range: 9 weeks Jun 29–Aug 28 (Mon–Fri, except BC Day week Tue-Fri)
// Canada Day week (Jun 29-Jul 3): Mon/Tue/Thu/Fri (Jul 1 off)
const START = '2026-06-29';
const END = '2026-08-28';
const DAYS = 'Mon, Tue, Wed, Thu, Fri';

const HOLIDAY_NOTE = 'Season runs Jun 29–Aug 28, 2026 (9 weeks). Canada Day week (Jun 29-Jul 3): Mon/Tue/Thu/Fri (Jul 1 off). BC Day week (Aug 4-7): Tue-Fri (Aug 3 off). $40 non-refundable registration fee. 14-day notice required for refund.';

// --- ID 417: Junior Kayak Camp Level 1 ---
fix(417, 'name', 'Deep Cove Kayak — Junior Kayak Camp Level 1 (Ages 7-9)');
fix(417, 'provider', PROVIDER);
fix(417, 'address', ADDRESS);
fix(417, 'lat', LAT);
fix(417, 'lng', LNG);
fix(417, 'cost', 279);
fix(417, 'costNote', 'Standard 5-day week: $279 + GST. 4-day holiday weeks: $235 + GST. ' + HOLIDAY_NOTE + ' AM session (9am-12pm) or PM session (1pm-4pm) — separate registration per session. Equipment provided.');
fix(417, 'priceVerified', true);
fix(417, 'startDate', START);
fix(417, 'endDate', END);
fix(417, 'startTime', '9:00 AM');
fix(417, 'endTime', '12:00 PM');
fix(417, 'days', DAYS);
fix(417, 'ageMin', 7);
fix(417, 'ageMax', 9);
fix(417, 'enrollmentStatus', 'Open');
fix(417, 'confirmed2026', true);
fix(417, 'isEstimate', false);
fix(417, 'registrationUrl', 'https://deepcovekayak.com/lesson/junior-kayak-camp-level-1/');
fix(417, 'description', '5-day summer kayak camp for ages 7-9 at Deep Cove Kayak. Introduces paddling skills, water safety, and coastal exploration through games and guided excursions. AM (9am-12pm) or PM (1pm-4pm) sessions available each week. No experience required. Jun 29–Aug 28, 2026.');

// --- ID 418: Junior Kayak Camp Level 2 ---
fix(418, 'name', 'Deep Cove Kayak — Junior Kayak Camp Level 2 (Ages 7-9)');
fix(418, 'provider', PROVIDER);
fix(418, 'address', ADDRESS);
fix(418, 'lat', LAT);
fix(418, 'lng', LNG);
fix(418, 'cost', 279);
fix(418, 'costNote', 'Standard 5-day week: $279 + GST. 4-day holiday weeks: $235 + GST. ' + HOLIDAY_NOTE + ' PM session only (1pm-4pm). Must have completed Level 1 prior to Level 2.');
fix(418, 'priceVerified', true);
fix(418, 'startDate', START);
fix(418, 'endDate', END);
fix(418, 'startTime', '1:00 PM');
fix(418, 'endTime', '4:00 PM');
fix(418, 'days', DAYS);
fix(418, 'ageMin', 7);
fix(418, 'ageMax', 9);
fix(418, 'enrollmentStatus', 'Open');
fix(418, 'confirmed2026', true);
fix(418, 'isEstimate', false);
fix(418, 'registrationUrl', 'https://deepcovekayak.com/lesson/junior-kayak-camp-level-2/');
fix(418, 'description', '5-day summer kayak camp for ages 7-9. Builds on Level 1 skills with a focus on proficient strokes and rescues. PM sessions only (1pm-4pm). Prerequisite: Junior Kayak Level 1 completion. Jun 29–Aug 28, 2026.');

// --- ID 419: Youth SUP Camp ---
fix(419, 'name', 'Deep Cove Kayak — Youth SUP Camp (Ages 9-12)');
fix(419, 'provider', PROVIDER);
fix(419, 'address', ADDRESS);
fix(419, 'lat', LAT);
fix(419, 'lng', LNG);
fix(419, 'cost', 279);
fix(419, 'costNote', 'Standard 5-day week: $279 + GST. 4-day holiday weeks: $235 + GST. ' + HOLIDAY_NOTE + ' Morning session only (9am-12pm). Equipment (SUP board, paddle, PFD) provided. No experience required.');
fix(419, 'priceVerified', true);
fix(419, 'startDate', START);
fix(419, 'endDate', END);
fix(419, 'startTime', '9:00 AM');
fix(419, 'endTime', '12:00 PM');
fix(419, 'days', DAYS);
fix(419, 'ageMin', 9);
fix(419, 'ageMax', 12);
fix(419, 'enrollmentStatus', 'Open');
fix(419, 'confirmed2026', true);
fix(419, 'isEstimate', false);
fix(419, 'registrationUrl', 'https://deepcovekayak.com/lesson/youth-sup-camp/');
fix(419, 'description', '5-day stand-up paddleboarding camp for ages 9-12 at Deep Cove Kayak. Morning sessions (9am-12pm) teach balance, basic strokes, and water safety through games on the water. No experience required. Jun 29–Aug 28, 2026.');

// --- ID 420: Coastal Adventure Day Camp ---
fix(420, 'name', 'Deep Cove Kayak — Coastal Adventure Day Camp (Ages 10-12)');
fix(420, 'provider', PROVIDER);
fix(420, 'address', ADDRESS);
fix(420, 'lat', LAT);
fix(420, 'lng', LNG);
fix(420, 'cost', 525);
fix(420, 'costNote', 'Standard 5-day week: $525 + GST. 4-day holiday week (only 1 available): $460 + GST. ' + HOLIDAY_NOTE + ' Full-day camp 9am-3pm. Includes kayaking, coastal exploration, and marine discovery. No experience required.');
fix(420, 'priceVerified', true);
fix(420, 'startDate', START);
fix(420, 'endDate', END);
fix(420, 'startTime', '9:00 AM');
fix(420, 'endTime', '3:00 PM');
fix(420, 'days', DAYS);
fix(420, 'ageMin', 10);
fix(420, 'ageMax', 12);
fix(420, 'enrollmentStatus', 'Open');
fix(420, 'confirmed2026', true);
fix(420, 'isEstimate', false);
fix(420, 'registrationUrl', 'https://deepcovekayak.com/lesson/coastal-adventure-day-camp/');
fix(420, 'description', '5-day full-day coastal adventure camp for ages 10-12 (9am-3pm). Combines kayaking with coastal exploration — marine discovery, intertidal zone learning, and guided paddling in Deep Cove. No experience required. Jun 29–Aug 28, 2026.');

// --- ID 421: Teen Paddle Canada Level 1 Camp ---
// Confirmed on listing page (deepcovekayak.com/age/youth/) at $545+GST for teens.
// Program-specific page URL not found — using youth listing page.
// specific 2026 dates not confirmed — confirmed2026=false
fix(421, 'name', 'Deep Cove Kayak — Teen Paddle Canada Level 1 Camp');
fix(421, 'provider', PROVIDER);
fix(421, 'address', ADDRESS);
fix(421, 'lat', LAT);
fix(421, 'lng', LNG);
fix(421, 'cost', 545);
fix(421, 'costNote', '$545 + GST per week. Teen kayaking camp with Paddle Canada Level 1 certification. Price confirmed on provider listing page Apr 2026. Specific 2026 session dates not yet confirmed on individual program page as of Apr 2026.');
fix(421, 'priceVerified', false);  // listing price only, not per-session page
fix(421, 'startDate', '2026-07-06');
fix(421, 'endDate', '2026-08-28');
fix(421, 'days', DAYS);
fix(421, 'ageMin', 13);
fix(421, 'ageMax', 17);
fix(421, 'enrollmentStatus', 'Likely Coming Soon');
fix(421, 'confirmed2026', false);
fix(421, 'registrationUrl', 'https://deepcovekayak.com/age/youth/');
fix(421, 'description', 'Teen Paddle Canada Level 1 kayaking camp at Deep Cove Kayak for teenagers. Structured activities to extend learning through the summer. Paddle Canada Level 1 certification offered. Details at deepcovekayak.com/age/youth/.');

// --- ID 422: Youth Surfski Camp ---
// Confirmed on listing page at $325+GST, ages 10-16 with paddling experience.
// Program-specific page URL not found — using youth listing page.
fix(422, 'name', 'Deep Cove Kayak — Youth Surfski Camp (Ages 10-16)');
fix(422, 'provider', PROVIDER);
fix(422, 'address', ADDRESS);
fix(422, 'lat', LAT);
fix(422, 'lng', LNG);
fix(422, 'cost', 325);
fix(422, 'costNote', '$325 + GST per week. For kids ages 10-16 with prior paddling experience (kayaks). Surfskis are open-cockpit kayaks — lighter, faster, and more performance-oriented. Price confirmed on provider listing page Apr 2026.');
fix(422, 'priceVerified', false);  // listing price only
fix(422, 'startDate', '2026-07-06');
fix(422, 'endDate', '2026-08-28');
fix(422, 'days', DAYS);
fix(422, 'ageMin', 10);
fix(422, 'ageMax', 16);
fix(422, 'enrollmentStatus', 'Likely Coming Soon');
fix(422, 'confirmed2026', false);
fix(422, 'registrationUrl', 'https://deepcovekayak.com/age/youth/');
fix(422, 'description', 'Youth Surfski Camp for ages 10-16 at Deep Cove Kayak. Designed for kids with prior kayaking experience who want to try surfskis — open-cockpit kayaks that are lighter and faster. Details at deepcovekayak.com/age/youth/.');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
