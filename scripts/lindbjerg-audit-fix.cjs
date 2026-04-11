/**
 * Lindbjerg Academy Audit Fix — 2026-04-09
 * Rank 237 in audit queue
 *
 * Browser-verified against:
 * - https://www.lindbjergacademy.com/programs
 * - https://www.lindbjergacademy.com/register
 * - https://www.lindbjergacademy.com/schedule
 *
 * Key findings:
 * - Year-round performing arts academy (musical theatre, dance, choirs)
 * - 2025/26 school year registration — no summer camp or dance intensive announced
 * - DB has 4 "Dance Intensive" entries with guessed summer dates — not confirmed
 * - Address corrected with postal code V3K 0A7
 * - activityType corrected to Dance
 * - campType corrected to Weekly Class (ongoing program, not a summer camp)
 * - Registration via Jackrabbit Class parent portal
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'Lindbjerg Academy') continue;
  if (![677, 678, 679, 680].includes(Number(p.id))) continue;

  // Address fix
  p.address = '#7 - 75 Blue Mountain Street, Coquitlam, BC V3K 0A7';
  p.postalCode = 'V3K 0A7';

  // Not confirmed for summer
  p.confirmed2026 = false;
  p.enrollmentStatus = 'Likely Coming Soon';
  p.status = 'Likely Coming Soon';

  // Cost not verified
  p.cost = null;
  p.priceVerified = false;
  p.isEstimate = false;
  p.costNote = 'No summer 2026 dance intensive announced. Year-round academy offers musical theatre, dance, and choir classes. Contact info@lindbjergacademy.com for summer program info.';

  // Correct activity type
  p.activityType = 'Dance';
  p.category = 'Arts';

  // Registration URL
  p.registrationUrl = 'https://www.lindbjergacademy.com/register';
  p.urlVerified = true;

  // Description update
  p.description = 'Lindbjerg Academy performing arts programs in Coquitlam. Musical theatre, dance (acro, ballet, contemporary, hip hop, jazz, lyrical, tap), and show choir. Year-round classes from kindergarten to grade 12. Uses Jackrabbit Class for registration.';
  p.tags = ['dance', 'performing arts', 'musical theatre'];

  // Age span justified
  p.ageSpanJustified = 'Performing arts academy serves kindergarten through grade 12 — single provider age range';

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Lindbjerg Academy: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
