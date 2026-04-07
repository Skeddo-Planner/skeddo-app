#!/usr/bin/env node
// vancouvercircusschool-audit-fix.cjs
// Fixes Vancouver Circus School data (rank 180 audit, 2026-04-06)
//
// Source page verified:
//   https://vancouvercircusschool.ca/camps/ (camps page)
//   https://activitymessenger.com/p/i/2CBsOKm (Summer Camp Registration Form 2026)
//
// FINDINGS:
//   - DB had 6 entries (IDs 61-66), missing Aug 17-21 week — 7 weeks total on registration form
//   - DB cost=$350 WRONG: actual pricing is half-day $349/week, full day $499/week
//   - DB endTime=4:00 PM WRONG: actual full day ends 3:30 PM; after-care 3:30-4:30pm is extra ($75)
//   - DB had no costNote — added with full pricing breakdown
//   - DB had no ageSpanJustified — added (ages 6-14, 8-year span; no sub-division offered)
//   - priceVerified was missing — added
//   - All dates, times (9:00 AM start), status, confirmed2026 were correct
//
// CONFIRMED SUMMER 2026 WEEKS:
//   Jul 6-10, Jul 13-17, Jul 20-24, Jul 27-31 — regular 5-day weeks
//   Aug 4-7 (BC Day week, 4 days: BC Day Aug 3 off, Tue-Fri)
//   Aug 10-14 — regular 5-day week
//   Aug 17-21 — regular 5-day week (MISSING FROM DB — adding as vancouver-circus-school-w7)
//
// PRICING (per registration form, July 6-10 week confirmed):
//   5-day weeks:
//     5 Mornings only (9am-12pm): $349
//     5 Afternoons only (12:30-3:30pm): $349
//     5 Full Days (9am-3:30pm): $499 (save $199)
//     After-care (3:30-4:30pm): $75 extra
//   BC Day week (Aug 4-7, 4 days):
//     4 Mornings only: $280
//     4 Afternoons only: $280
//     4 Full Days: $399 (save $161)
//     After-care: $60 extra
//   Multi-week discount: 15% off when registering 2+ weeks
//   Deposit: $95 + GST (non-refundable/non-transferable)
//
// ADDRESS: 810 Quayside Dr Suite 212, New Westminster, BC V3M 6B9
// AGE SPAN: 6-14 (8-year span) — no sub-division offered; all mixed-level groups

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

const PROVIDER = 'Vancouver Circus School';
const ADDRESS = '810 Quayside Dr Suite 212, New Westminster, BC V3M 6B9';
const LAT = 49.2056;
const LNG = -122.9107;
const REG_URL = 'https://vancouvercircusschool.ca/camps/';

const AGE_JUSTIFIED = 'Vancouver Circus School summer camps span ages 6-14 (8-year span). No age sub-division offered — provider groups by skill level (beginner to advanced), not age. All circus disciplines (aerials, juggling, acrobatics) are mixed-age and skill-level appropriate.';

const COST_NOTE_REGULAR = 'From $349/week (half day — 5 mornings 9am-12pm, or 5 afternoons 12:30-3:30pm). Full day (9am-3:30pm): $499/week. After-care (3:30-4:30pm): $75 extra/week. 15% discount for 2+ week registrations (applied automatically at checkout). Deposit: $95 + GST non-refundable. Ages 6-14.';

const COST_NOTE_BCDAY = 'From $280 (BC Day week, 4 days Tue-Fri: BC Day Aug 3 off). 4 mornings (9am-12pm) $280; 4 afternoons (12:30-3:30pm) $280; 4 full days (9am-3:30pm) $399. After-care $60 extra. 15% discount for 2+ week registrations. Deposit: $95 + GST non-refundable. Ages 6-14.';

// --- IDs 61-64: Regular 5-day weeks ---
[61, 62, 63, 64].forEach(id => {
  fix(id, 'cost', 349);
  fix(id, 'costNote', COST_NOTE_REGULAR);
  fix(id, 'endTime', '3:30 PM');
  fix(id, 'priceVerified', true);
  fix(id, 'ageSpanJustified', AGE_JUSTIFIED);
  fix(id, 'address', ADDRESS);
  fix(id, 'lat', LAT);
  fix(id, 'lng', LNG);
});

// Update names to be more descriptive
const weekNames = {
  61: 'Circus Arts Summer Camp — Week 1 (Jul 6-10)',
  62: 'Circus Arts Summer Camp — Week 2 (Jul 13-17)',
  63: 'Circus Arts Summer Camp — Week 3 (Jul 20-24)',
  64: 'Circus Arts Summer Camp — Week 4 (Jul 27-31)',
};
Object.entries(weekNames).forEach(([id, name]) => {
  fix(Number(id), 'name', `Vancouver Circus School — ${name}`);
  fix(Number(id), 'provider', PROVIDER);
});

// --- ID 65: BC Day week (Aug 4-7, 4 days) ---
fix(65, 'name', 'Vancouver Circus School — Circus Arts Summer Camp — BC Day Week (Aug 4-7)');
fix(65, 'provider', PROVIDER);
fix(65, 'cost', 280);
fix(65, 'costNote', COST_NOTE_BCDAY);
fix(65, 'endTime', '3:30 PM');
fix(65, 'priceVerified', true);
fix(65, 'ageSpanJustified', AGE_JUSTIFIED);
fix(65, 'address', ADDRESS);
fix(65, 'lat', LAT);
fix(65, 'lng', LNG);
// BC Day is Aug 3 — camp runs Tue-Fri Aug 4-7 (DB dates are correct)
fix(65, 'days', 'Tue, Wed, Thu, Fri');

// --- ID 66: Aug 10-14 (regular 5-day week) ---
fix(66, 'name', 'Vancouver Circus School — Circus Arts Summer Camp — Week 6 (Aug 10-14)');
fix(66, 'provider', PROVIDER);
fix(66, 'cost', 349);
fix(66, 'costNote', COST_NOTE_REGULAR);
fix(66, 'endTime', '3:30 PM');
fix(66, 'priceVerified', true);
fix(66, 'ageSpanJustified', AGE_JUSTIFIED);
fix(66, 'address', ADDRESS);
fix(66, 'lat', LAT);
fix(66, 'lng', LNG);

// --- NEW: vancouver-circus-school-w7 — Aug 17-21 (missing week) ---
// Template from ID 66, adjusted for Aug 17-21
const baseEntry = programs.find(p => String(p.id) === '66');
const newEntry = Object.assign({}, baseEntry, {
  id: 'vancouver-circus-school-w7',
  name: 'Vancouver Circus School — Circus Arts Summer Camp — Week 7 (Aug 17-21)',
  startDate: '2026-08-17',
  endDate: '2026-08-21',
  days: 'Mon, Tue, Wed, Thu, Fri',
  cost: 349,
  costNote: COST_NOTE_REGULAR,
  endTime: '3:30 PM',
  priceVerified: true,
  ageSpanJustified: AGE_JUSTIFIED,
});
programs.push(newEntry);
fixes++;
console.log('Added new entry: vancouver-circus-school-w7 (Aug 17-21)');

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
