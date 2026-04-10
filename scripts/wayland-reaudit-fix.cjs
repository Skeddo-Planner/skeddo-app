/**
 * Wayland Sports Re-Audit Fix — 2026-04-09
 * Rank 208 in audit queue — RE-AUDIT via Chrome browser
 *
 * Prior audit used WebFetch which timed out. This re-audit used Chrome browser.
 *
 * Browser-verified against:
 * - https://www.waylandsports.com/ (homepage — loads fine in Chrome)
 * - https://www.waylandsports.com/ironwood-campus/ (camps page — 8 program types listed)
 * - https://www.waylandsports.com/locations/ironwood-campus/ (address confirmed)
 * - Spring 2025 camp info PDF (pricing reference only)
 * - Jackrabbit registration portal (login-protected, can't view schedules)
 *
 * Key findings:
 * - Site IS accessible via Chrome (was timing out on WebFetch/Playwright)
 * - Summer 2026 NOT posted — only Spring 2025 info available
 * - 8 distinct camp types offered (vs our 4 generic entries)
 * - Address: 12080 Horseshoe Way, Richmond, BC V7A 4V5
 * - Phone: 604-275-1888
 * - Email: richmondinfo@waylandsports.com
 * - Registration: Jackrabbit Class (app.jackrabbitclass.com)
 * - Spring 2025 pricing: Half Day $399+GST, Full Day Beginner $860+GST, Intermediate $795+GST
 * - $16 Gymnastics BC insurance fee, $30 new member fee for swim camps
 * - Steveston location permanently closed (COVID-19)
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'Wayland Sports') continue;
  if (![353, 354, 355, 356].includes(Number(p.id))) continue;

  // Address — verified via Chrome
  p.address = '12080 Horseshoe Way, Richmond, BC V7A 4V5';
  p.postalCode = 'V7A 4V5';
  p.city = 'Richmond';
  p.neighbourhood = 'East Richmond';

  // Status stays as-is (summer 2026 not posted)
  p.confirmed2026 = false;
  p.enrollmentStatus = 'Likely Coming Soon';
  p.status = 'Likely Coming Soon';
  p.cost = null;
  p.priceVerified = false;
  p.isEstimate = false;

  // Registration URL — camps page (Jackrabbit portal requires login)
  p.registrationUrl = 'https://www.waylandsports.com/ironwood-campus/';
  p.urlVerified = true;

  // Activity details
  p.activityType = 'Gymnastics';
  p.category = 'Sports';
  p.indoorOutdoor = 'Indoor';

  // Updated costNote with Chrome-verified details
  p.costNote = 'Summer 2026 not yet posted. Spring 2025 reference pricing: Half Day Gymnastics $399+GST (9am-12pm), Full Day Gym/Swim/Bike Beginner $860+GST (9am-3pm), Intermediate $795+GST. Additional fees: $16 Gymnastics BC insurance (non-members), $30 new member fee (swim camps). Provider offers 8 camp types: Half Day Swim (Beginner/Intermediate), Half Day Gymnastics, Full Day (Beginner/Intermediate), Swim Camp (Beginner/Intermediate), Early Care. Registration via Jackrabbit portal. Contact: 604-275-1888 or richmondinfo@waylandsports.com.';

  p.description = 'Gymnastics and swim camps at Wayland Sports Ironwood Campus, Richmond. 32,000 sq ft facility with Olympic gymnastics equipment, pool, trampolines, foam pit. Half-day and full-day options for various skill levels. Programs include gymnastics, swimming, and biking.';
  p.tags = ['gymnastics', 'swimming', 'summer camp'];

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Wayland Sports re-audit: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
