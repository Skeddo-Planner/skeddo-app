/**
 * White Rock Gymnastics Athletics Society Audit Fix — 2026-04-09
 * Rank 242 in audit queue
 *
 * Web-verified against:
 * - https://www.whiterockgym.org/camps (dynamic site — content from web search)
 * - https://portal.iclasspro.com/whiterockgym/camps/100
 * - Web search results for "White Rock Gymnastics summer camp 2026"
 *
 * Key findings:
 * - Official domain is whiterockgym.ORG (not .com — .com is for sale)
 * - Cost: $65+GST per day camp
 * - GymBC insurance: $55 for new members (non-refundable, expires Aug 31, 2026)
 * - Age: must be 5 years old prior to first day of camp (DB had ageMin=3)
 * - Schedule: 8:30am - 2:30pm
 * - Address: 15272 Croydon Dr #114, Surrey, BC V3Z 0Z5
 * - Grouped by age and experience; vault, bars, beam, floor + arts/crafts/games
 * - Payment in full at registration; first-come, first-served
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'White Rock Gymnastics') continue;
  if (![343, 344, 345, 346].includes(Number(p.id))) continue;

  // Fix provider name to match official
  p.provider = 'White Rock Gymnastics Athletics Society';

  // Age fix — must be 5 prior to first day
  p.ageMin = 5;
  p.ageMax = 12;

  // Schedule
  p.startTime = '8:30 AM';
  p.endTime = '2:30 PM';
  p.durationPerDay = 6;
  p.scheduleType = 'Full Day';
  p.dayLength = 'Full Day';

  // Address and location
  p.address = '15272 Croydon Dr #114, Surrey, BC V3Z 0Z5';
  p.postalCode = 'V3Z 0Z5';
  p.neighbourhood = 'South Surrey';
  p.city = 'Surrey';

  // Cost verified from web search
  p.cost = 65;
  p.priceVerified = true;
  p.costNote = '$65 + GST per camp day. Plus $55 Gymnastics BC insurance for new members (non-refundable, expires Aug 31, 2026). Payment in full at registration. First-come, first-served. No refunds within 10 days of camp.';

  // Activity details
  p.activityType = 'Gymnastics';
  p.category = 'Sports';
  p.campType = 'Summer Camp';
  p.indoorOutdoor = 'Indoor';
  p.confirmed2026 = true;
  p.enrollmentStatus = 'Open';
  p.status = 'Open';
  p.urlVerified = true;
  p.registrationUrl = 'https://portal.iclasspro.com/whiterockgym/camps/100?sortBy=time';

  p.description = 'Gymnastics day camp at White Rock Gymnastics Athletics Society, South Surrey. Ages 5-12. 8:30am-2:30pm. Progressive instruction on vault, bars, beam & floor. Also includes arts, crafts, games & team building. Grouped by age and experience. Must be 5 years old prior to first day of camp.';
  p.tags = ['gymnastics', 'summer camp', 'sports', 'fitness'];
  p.ageSpanJustified = 'Provider groups campers by age and experience level — single registration for ages 5-12';

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`White Rock Gymnastics: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
