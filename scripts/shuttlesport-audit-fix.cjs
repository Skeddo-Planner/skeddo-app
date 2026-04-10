/**
 * Shuttlesport Badminton Academy Audit Fix — 2026-04-09
 * Rank 236 in audit queue
 *
 * Browser-verified against:
 * - https://www.shuttlesport.com/camps
 *
 * Key findings:
 * - Only Spring Break Camp 2026 shown (Mar 16-20 & Mar 23-27, both completed)
 * - No summer 2026 camp announced yet
 * - Spring pricing: Half Day $160+GST, Full Day $285+GST
 * - DB has 4 summer entries with guessed dates (Jul) and unverified cost ($250)
 * - Address corrected with unit number and postal code
 * - Ages: site says 5-18 (header) and 6-18 (body text) — using 5-18
 * - ageSpanJustified added (provider groups internally: 7-12 and 13-18)
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'Shuttlesport Badminton Academy') continue;
  if (![397, 398, 399, 400].includes(Number(p.id))) continue;

  // Address fix — add unit number and postal code
  p.address = '550 Sherling Pl #1120, Port Coquitlam, BC V3B 0J6';
  p.postalCode = 'V3B 0J6';

  // Summer not announced — keep as unconfirmed
  p.confirmed2026 = false;
  p.enrollmentStatus = 'Likely Coming Soon';
  p.status = 'Likely Coming Soon';

  // Cost was guessed at $250 — null it out, document spring pricing as reference
  p.cost = null;
  p.priceVerified = false;
  p.isEstimate = false;
  p.costNote = 'Summer 2026 camp not yet announced. Spring 2026 pricing was: Half Day $160+GST, Full Day $285+GST. Contact badminton@shuttlesport.com or 604-552-2473 for summer info.';

  // Age range verified
  p.ageMin = 5;
  p.ageMax = 18;
  p.ageSpanJustified = 'Provider lists ages 5-18 as single registration; internally groups into 7-12 and 13-18 during camp';

  // Registration URL is correct (camps page)
  p.registrationUrl = 'https://www.shuttlesport.com/camps';
  p.urlVerified = true;

  // Description update
  p.description = 'Badminton camp at Shuttlesport, Port Coquitlam. Ages 5-18. NCCP certified coaches on Taraflex and wood sports flooring. Learn racket grip, footwork, form, timing, speed, power, strategy. Includes matches, dodgeball, games. Pizza lunch on last day. Half day (9am-12pm or 1pm-4pm) and full day (9am-4pm) options. No membership required.';
  p.tags = ['badminton', 'racquet sports', 'summer camp'];

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Shuttlesport Badminton Academy: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
