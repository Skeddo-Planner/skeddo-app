/**
 * Harbour Dance Centre Audit Fix — 2026-04-09
 * Rank 229 in audit queue
 *
 * Browser-verified against:
 * - https://www.harbourdance.com/summer-intensive
 *
 * Key changes:
 * - registrationUrl updated to summer intensive page
 * - postalCode added: V6Z 1L3
 * - costNote clarified (per-class pricing structure)
 * - urlVerified set to true, urlNote removed
 * - Description updated with 2026 details
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'Harbour Dance Centre') continue;
  if (![2400, 2401, 2402].includes(Number(p.id))) continue;

  p.postalCode = 'V6Z 1L3';
  p.registrationUrl = 'https://www.harbourdance.com/summer-intensive';
  p.urlVerified = true;
  delete p.urlNote;
  p.costNote = 'Per-class pricing: $105/week (1hr), $115/week (1.25hr), $125/week (1.5hr) +GST. Must register for min 2, max 4 classes per day. Full week of 4 classes = $420-$500+GST.';
  p.description = 'Junior Summer Dance Intensive at Harbour Dance Centre, downtown Vancouver. Ages 12-16. Intermediate level. Styles include Contemporary Jazz, Ballet, Hip Hop, Theatre Jazz, Turns & Jumps, Jazz Funk. Register per class (min 2/day, max 4/day). Friday filming day. Registration via MindBody Online.';
  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Harbour Dance Centre: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
