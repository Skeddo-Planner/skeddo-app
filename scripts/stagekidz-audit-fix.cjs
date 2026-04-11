/**
 * StageKidz Audit Fix — 2026-04-09
 * Rank 216 in audit queue
 *
 * Browser-verified against https://www.stagekidz.ca/summer-camps/
 *
 * 2026 summer camp dates NOT yet announced ("New Dates Coming Soon").
 * Ages 5-14, Musical Theatre camps at Douglas College Coquitlam.
 * DB had wrong address (Burnaby instead of Coquitlam).
 * Retained per R31 with confirmed2026=false.
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'StageKidz') continue;
  if (![649, 650, 651, 652].includes(Number(p.id))) continue;

  p.name = 'Musical Theatre Summer Camp';
  p.address = '1250 Pinetree Way, Coquitlam, BC V3B 7X3';
  p.neighbourhood = 'Coquitlam';
  p.city = 'Coquitlam';
  p.lat = 49.2840;
  p.lng = -122.7916;
  p.confirmed2026 = false;
  p.priceVerified = false;
  p.enrollmentStatus = 'Likely Coming Soon';
  p.cost = null;
  p.costNote = '2026 summer camp dates and pricing not yet announced as of Apr 9, 2026. Check stagekidz.ca or contact (778) 990-9043 / contact@stagekidz.ca.';
  p.description = 'Musical theatre summer camp at Douglas College, Coquitlam. Ages 5-14. Singing, dancing, acting, performance skills. End-of-camp showcase. All levels welcome. 2026 dates coming soon.';
  p.activityType = 'Performing Arts';
  p.registrationUrl = 'https://www.stagekidz.ca/summer-camps/';
  p.ageSpanJustified = 'Provider lists single age range 5-14 for all summer camps with no sub-groupings.';
  if (p.isEstimate) delete p.isEstimate;
  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`StageKidz: ${corrected} corrected`);
console.log(`Total programs: ${programs.length}`);
