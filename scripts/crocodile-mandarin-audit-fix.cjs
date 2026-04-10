/**
 * Crocodile Mandarin School Audit Fix — 2026-04-09
 * Rank 233 in audit queue
 *
 * Browser-verified against:
 * - https://www.crocodilemandarin.com/current-term.html
 * - https://www.crocodilemandarin.com/where/scottish-cultural-centre.html
 * - https://www.crocodilemandarin.com/prices.html
 *
 * Key changes:
 * - campType corrected: "Summer Camp" → "Weekly Class" (spring Saturday classes)
 * - season corrected: "Summer 2026" → "Spring 2026"
 * - ACT-0232: confirmed2026 → true, enrollmentStatus → "Open" (spring term confirmed)
 * - activityType → "Language"
 * - costNote updated with website pricing ($264/11 sessions early bird)
 * - descriptions updated with verified details
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

const targetIds = ['ACT-0232', 'ACT-0233', 'ACT-0236'];

for (const p of programs) {
  if (!targetIds.includes(String(p.id))) continue;

  // Common fixes for all entries
  p.campType = 'Weekly Class';
  p.season = 'Spring 2026';
  p.activityType = 'Language';
  p.confirmed2026 = true;
  p.enrollmentStatus = 'Open';
  p.status = 'Open';
  p.priceVerified = true;
  p.indoorOutdoor = 'Indoor';
  p.tags = ['mandarin', 'chinese', 'language', 'academic'];

  const id = String(p.id);

  if (id === 'ACT-0232') {
    // Sat 9am Junior Academic at Scottish Cultural Centre
    p.cost = 264;
    p.costNote = '$264 for 11 sessions (early bird price). Multi-class discount: 20% off additional hours. Sibling discount: 10% off. Prices include 6.9% registration/processing fee and GST. Break: May 16-22.';
    p.description = 'Saturday morning Junior Academic Mandarin class at Scottish Cultural Centre, Marpole. Ages 7-12. Spring 2026 theme: Home and Family. 11 sessions Apr 11 - Jun 27. Register via ACTIVE Network.';
  }

  if (id === 'ACT-0233') {
    // Sat 9am Academic Class Level 2 at East Vancouver
    p.cost = 264;
    p.costNote = '$264 for 11 sessions (early bird price). Multi-class discount: 20% off additional hours. Sibling discount: 10% off. Prices include 6.9% registration/processing fee and GST. Break: May 16-22.';
    p.description = 'Saturday morning Academic Mandarin Class (Level 2) at East Vancouver (Odlum Drive). Ages 7+. Spring 2026 theme: Home and Family. 11 sessions Apr 11 - Jun 27.';
  }

  if (id === 'ACT-0236') {
    // Sat 10am Junior Academic at East Vancouver
    p.costNote = '$244 per ACTIVE listing (may reflect multi-class discount). Standard early bird price is $264/11 sessions. Multi-class discount: 20% off additional hours. Prices include 6.9% registration/processing fee and GST.';
    p.description = 'Saturday morning Junior Academic Mandarin class at East Vancouver (Odlum Drive). Ages 6-10. Spring 2026 theme: Home and Family. 11 sessions Apr 11 - Jun 27.';
  }

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Crocodile Mandarin School: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
