/**
 * SC Kim's Taekwondo Audit Fix — 2026-04-09
 * Rank 223 in audit queue
 *
 * Browser-verified against:
 * - https://sckimstaekwondo.com/ (homepage)
 * - https://sckimstaekwondo.com/summer-camp-burnaby/ (summer camp lead page)
 * - https://sckimstaekwondo.com/schedule/ (class schedule)
 *
 * Key changes:
 * - Address corrected: "4455 Byrne Rd" → "4603 Kingsway Suite 001" (confirmed on homepage + summer camp page)
 * - Added postal code V5H 4M4
 * - Updated lat/lng for correct address
 * - Registration URL updated to summer camp specific page
 * - Removed HTTP 403 urlNote (site now loads correctly)
 * - Added costNote: price unverified, 2026 details not yet announced
 * - confirmed2026 remains false, enrollmentStatus remains "Likely Coming Soon"
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== "SC Kim's Taekwondo") continue;
  if (![379, 380, 381, 382].includes(Number(p.id))) continue;

  // Address correction — website clearly shows "4603 Kingsway Suite 001, Burnaby, BC V5H 4M4"
  p.address = '4603 Kingsway Suite 001, Burnaby, BC V5H 4M4';
  p.postalCode = 'V5H 4M4';
  p.lat = 49.2290;
  p.lng = -123.0015;

  // Registration URL — summer camp specific page
  p.registrationUrl = 'https://sckimstaekwondo.com/summer-camp-burnaby/';

  // Remove stale HTTP 403 note — site loads fine now
  delete p.urlNote;

  // Cost note — $250 is unverified prior-year data, 2026 pricing not yet announced
  p.costNote = 'Price from prior year, unverified. 2026 summer camp details not yet announced — website is a lead capture form only.';

  // Age span justification (5-14 = 9 year span)
  p.ageSpanJustified = 'Provider offers one summer camp program for all ages with no sub-groupings.';

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`SC Kim's Taekwondo: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
