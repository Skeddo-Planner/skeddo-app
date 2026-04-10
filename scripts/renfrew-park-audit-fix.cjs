/**
 * Renfrew Park Community Centre Audit Fix — 2026-04-09
 * Rank 238 in audit queue
 *
 * Browser-verified against:
 * - https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/601677
 * - ActiveNet center_ids=46 search results
 *
 * Key changes:
 * - renfrew-cc-camp-1: Deactivated — duplicate placeholder superseded by 9 COV- weekly entries
 * - id=2505: Deactivated — generic swim lessons placeholder superseded by COV- swim entries
 * - COV-601677: Status updated to Full/Waitlist (verified: full with 2 on waitlist)
 * - Provider name consistency fix on renfrew-cc-camp-1
 * - Postal code V5M 2Y3 added where missing
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  // Fix generic placeholder: renfrew-cc-camp-1
  if (String(p.id) === 'renfrew-cc-camp-1') {
    p.confirmed2026 = false;
    p.enrollmentStatus = 'Likely Coming Soon';
    p.status = 'Likely Coming Soon';
    p.provider = 'City of Vancouver - Renfrew Park Community Centre';
    p.costNote = 'Generic placeholder — superseded by individual weekly COV- entries (COV-601677 through COV-602958). See those entries for specific weeks and pricing.';
    p.address = '2929 E 22nd Ave, Vancouver, BC V5M 2Y3';
    p.postalCode = 'V5M 2Y3';
    p.registrationUrl = 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=46';
    corrected++;
  }

  // Fix generic placeholder: 2505 (swim lessons)
  if (Number(p.id) === 2505) {
    p.confirmed2026 = false;
    p.enrollmentStatus = 'Likely Coming Soon';
    p.status = 'Likely Coming Soon';
    p.costNote = 'Generic swim lessons placeholder — superseded by individual COV- swim entries (COV-615678 through COV-616409). See those entries for specific levels and pricing.';
    p.registrationUrl = 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=46';
    p.priceVerified = false;
    corrected++;
  }

  // Fix COV-601677: verified as Full/Waitlist
  if (String(p.id) === 'COV-601677') {
    p.enrollmentStatus = 'Full/Waitlist';
    p.status = 'Full/Waitlist';
    p.postalCode = 'V5M 2Y3';
    p.costNote = '$120 for 4-day week (Jun 29 - Jul 3, no Wed due to Canada Day). Ages 6-13. Mon/Tue/Thu/Fri 9am-3pm. Full with 2 on waitlist as of Apr 9. Registration opened Apr 8.';
    p.priceVerified = true;
    corrected++;
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Renfrew Park CC: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
