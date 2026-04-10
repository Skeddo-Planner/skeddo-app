/**
 * DaVinci Code Art Academy Re-Audit Fix — 2026-04-09
 * Rank 241 in audit queue — RE-AUDIT via Chrome browser
 *
 * Prior audit used WebFetch which timed out. Chrome browser verified:
 * - https://davincicode.ca/ (homepage loads fine — /summer-camps returns 404)
 * - https://app.marketingisfun.ca/widget/bookings/summerhalfdaycamp ($55 tax incl)
 * - https://app.marketingisfun.ca/widget/bookings/fulldaycamp ($85 tax incl)
 * - https://app.marketingisfun.ca/widget/bookings/kidscamppackageof5days ($400)
 *
 * Key findings:
 * - Site IS accessible via Chrome (was timing out on WebFetch/Playwright)
 * - /summer-camps page returns 404 — camp info is on homepage
 * - Summer 2026 NOT posted — booking calendar shows "No slot available"
 * - Booking widget prices differ from website text:
 *   Website: $78/day, $468/6 days (summer break)
 *   Booking: $55 half day, $85 full day, $400 full week (tax included)
 * - Address: 2-3046 Edgemont Blvd, North Vancouver, BC
 * - Phone: (604) 715-1576
 * - Email: info@davincicode.ca / davincicodeacademy@gmail.com
 * - School Hours: 9am-7pm
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

const bookingUrls = {
  16068: 'https://app.marketingisfun.ca/widget/bookings/summerhalfdaycamp',
  16069: 'https://app.marketingisfun.ca/widget/bookings/summerhalfdaycampbyfarah',
  16070: 'https://app.marketingisfun.ca/widget/bookings/fulldaycamp',
};

for (const p of programs) {
  if (p.provider !== 'DaVinci Code Art Academy') continue;
  if (![16068, 16069, 16070].includes(Number(p.id))) continue;

  // Summer 2026 not posted — no slots available in booking calendar
  p.confirmed2026 = false;
  p.enrollmentStatus = 'Likely Coming Soon';
  p.status = 'Likely Coming Soon';
  p.priceVerified = false;
  p.isEstimate = false;

  // Registration URL — old /summer-camps returns 404, use booking widget
  p.registrationUrl = bookingUrls[Number(p.id)];
  p.urlVerified = true;

  // Dates are unconfirmed for summer 2026
  p.startDate = null;
  p.endDate = null;
  p.season = 'Summer 2026';
  p.campType = 'Summer Camp';

  // Address already correct but update to match page exactly
  p.address = '2-3046 Edgemont Blvd, North Vancouver, BC';

  // Updated descriptions
  p.description = 'Art camp at DaVinci Code Art Academy, Edgemont Village, North Vancouver. Ages 5-12. Explore acrylic painting, collage creations, resin art, fabric design, and pottery. Led by instructors Sara Mahjouri and Farahnaz Samari. Drop-in daily or weekly packages available.';

  corrected++;
}

// Update costNotes with Chrome-verified details
for (const p of programs) {
  if (Number(p.id) === 16068) {
    p.costNote = 'Summer 2026 not yet posted — booking calendar shows no available slots. Website text: $78/day or $468/6 days. Booking widget: $55/day (tax included). Half Day AM (9am-12pm). Per-day drop-in available. Contact: (604) 715-1576 or info@davincicode.ca.';
  } else if (Number(p.id) === 16069) {
    p.costNote = 'Summer 2026 not yet posted — booking calendar shows no available slots. Website text: $78/day or $468/6 days. Booking widget: $55/day (tax included). Half Day PM (12pm-3pm). Per-day drop-in available. Contact: (604) 715-1576 or info@davincicode.ca.';
  } else if (Number(p.id) === 16070) {
    p.costNote = 'Summer 2026 not yet posted — booking calendar shows no available slots. Website text: $78/day or $468/6 days. Booking widget: $85/day (tax included), $400/week. Full Day (9am-3pm). Contact: (604) 715-1576 or info@davincicode.ca.';
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`DaVinci Code re-audit: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
