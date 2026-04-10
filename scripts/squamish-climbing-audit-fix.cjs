/**
 * Squamish Climbing Academy Audit Fix — 2026-04-09
 * Rank 243 in audit queue
 *
 * Web-verified against:
 * - https://www.squamishclimbingacademy.com/camps (times out on Playwright/WebFetch)
 * - https://www.exploresquamish.com/business/squamish-climbing-academy/
 * - Web search results
 *
 * Key findings:
 * - Website consistently times out on both Playwright and WebFetch
 * - Tourism Squamish listing confirms: outdoor climbing camps for youth
 * - Address: 38221 Guilford Drive, Squamish, BC V0N 0C2
 * - Phone: 778.266.9541
 * - Programs: overnight camps, day camps, after-school climbing
 * - Ages 7-18, with overnight for 12-18
 * - 2025 pricing ~$900 for 3-day camp (includes food, accommodation)
 * - DB cost of $400 not verified for 2026 — setting to null
 * - confirmed2026=true but enrollmentStatus was wrong (Likely Coming Soon with confirmed)
 * - These should be confirmed2026=false since 2026 schedule not verified
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'Squamish Climbing Academy') continue;
  if (![441, 442, 443, 444, 445, 446].includes(Number(p.id))) continue;

  // Address
  p.address = '38221 Guilford Drive, Squamish, BC V0N 0C2';
  p.postalCode = 'V0N 0C2';
  p.neighbourhood = 'Squamish';
  p.city = 'Squamish';

  // Cannot verify 2026 schedule/pricing — site unreachable
  p.confirmed2026 = false;
  p.enrollmentStatus = 'Likely Coming Soon';
  p.status = 'Likely Coming Soon';
  p.cost = null;
  p.priceVerified = false;
  p.isEstimate = false;
  p.urlVerified = false;
  p.costNote = '2026 pricing not verified (website unreachable). 2025 pricing was ~$900 for 3-day camp (includes food, accommodation, instruction). Day camps also offered. Contact 778-266-9541.';

  // Activity details
  p.activityType = 'Rock Climbing';
  p.category = 'Sports';
  p.indoorOutdoor = 'Outdoor';
  p.ageSpanJustified = 'Provider offers climbing camps for ages 7-18 as single registration; overnight camps restricted to 12-18';

  p.description = 'Outdoor rock climbing camp at Squamish Climbing Academy. Ages 7-18. Day camps and overnight camps (12-18). Led by certified guides. Focus on safety, skill development, teamwork, and challenge-by-choice. Located in Squamish, 48.8km from Vancouver.';
  p.tags = ['rock climbing', 'outdoor adventure', 'summer camp'];

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Squamish Climbing Academy: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
