/**
 * White Rock Gymnastics Re-Audit Fix — 2026-04-09
 * Rank 242 in audit queue — RE-AUDIT via Chrome browser
 *
 * Browser-verified against:
 * - https://www.whiterockgym.org/camps (camps page — summer reg opens Apr 13)
 * - https://portal.iclasspro.com/whiterockgym/camps (iClassPro — no events listed yet)
 * - Note: whiterockgym.com is a parked domain — actual site is whiterockgym.org
 *
 * Key findings:
 * - Summer camp registration opens April 13, 2026 at 10AM
 * - No summer dates posted yet — iClassPro shows "No Events Found"
 * - Pro-D camp price confirmed: $65 + GST per day
 * - $55 Gymnastics BC insurance for new members
 * - Times: 8:30am-2:30pm (no before/after care)
 * - Location: WRG Mountain View - #114: 15272 Croydon Dr, Surrey
 * - Also has Ocean Side location: #305: 3091 152 St, Surrey
 * - Phone: 604-542-0386
 * - Ages: must be 5 years old prior to first day
 * - Nut-aware facility
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'White Rock Gymnastics Athletics Society') continue;
  if (![343, 344, 345, 346].includes(Number(p.id))) continue;

  // Summer registration opens April 13 — not posted yet
  p.confirmed2026 = false;
  p.enrollmentStatus = 'Coming Soon';
  p.status = 'Coming Soon';
  p.registrationDate = '2026-04-13';

  // Dates are from prior year pattern — not confirmed for 2026
  p.startDate = null;
  p.endDate = null;
  p.priceVerified = false;
  p.isEstimate = true;

  // URL updates
  p.registrationUrl = 'https://portal.iclasspro.com/whiterockgym/camps';
  p.urlVerified = true;

  // Cost stays at $65 — confirmed from Pro-D camp pricing, likely same for summer
  p.costNote = '$65+GST per camp day (confirmed from Pro-D camp pricing — likely same for summer). Plus $55 Gymnastics BC insurance for new members (non-refundable, expires Aug 31, 2026). Summer 2026 registration opens April 13 at 10AM. Payment in full at registration. First-come, first-served. No refunds within 10 days of camp. Register via iClassPro portal. Phone: 604-542-0386.';

  p.description = 'Gymnastics day camp at White Rock Gymnastics Athletics Society, South Surrey. Ages 5-12. 8:30am-2:30pm. Progressive instruction on vault, bars, beam & floor in a fully equipped facility. Also includes arts, crafts, games & team building. Grouped by age and experience. Must be 5 years old prior to first day. Nut-aware facility.';

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`White Rock Gym re-audit: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
