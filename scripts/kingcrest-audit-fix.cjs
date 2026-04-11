/**
 * Kingcrest Learning Academy Audit Fix — 2026-04-09
 * Rank 230 in audit queue
 *
 * Browser-verified against:
 * - https://www.kingcrestlearning.com/prodday-camps
 * - https://www.kingcrestlearning.com/schoolofarts
 * - https://www.kingcrestlearning.com/enrichment
 * - https://www.kingcrestlearning.com/ (homepage)
 * - https://www.kingcrestlearning.com/summer-camp (404)
 *
 * Key changes:
 * - ID 2489: ages corrected 3-10 → 5-11 (per Pro D Day page); no summer camp page exists
 * - ID 2489: costNote updated with $300/week early bird mention from Pro D page
 * - ID 2489: registrationUrl updated to homepage (no summer-specific page)
 * - ID 2490: costNote updated with trial class details ($20)
 * - ID 2491: costNote updated, ageSpanJustified added (ages 3-10 = 7yr span)
 * - All: postal code added, urlVerified updated
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'Kingcrest Learning Academy') continue;

  const id = Number(p.id);

  if (id === 2489) {
    // Summer Break Camp — no summer camp page exists on site
    // Pro D Day page mentions "$300/week early bird" but no summer details published
    p.ageMin = 5;
    p.ageMax = 11;
    p.registrationUrl = 'https://www.kingcrestlearning.com/prodday-camps';
    p.costNote = 'Summer 2026 not yet announced. Pro D Day page mentions early bird rate of $300/week — may indicate summer camp pricing. Pro D Day camps are $75/day (9am-3pm). Contact provider for summer details.';
    p.description = 'Summer Break Camp at Kingcrest Learning Academy, Kensington-Cedar Cottage. Reggio Emilia-inspired fine arts camp with art, music, dance enrichment. Ages 5-11. Summer 2026 details not yet published — check website for updates.';
    p.postalCode = 'V5V 3E2';
    p.urlVerified = true;
    p.urlNote = 'No dedicated summer camp page; Pro D Day page is closest match';
    p.ageSpanJustified = 'Provider groups all school-age children (5-11) in one camp program';
    corrected++;
  }

  if (id === 2490) {
    // Preschool Piano Program — exists on School of Arts page
    p.postalCode = 'V5V 3E2';
    p.costNote = '$20 trial class credited toward first month tuition if enrolled. Ongoing monthly pricing not listed on website — inquire with provider.';
    p.registrationUrl = 'https://www.kingcrestlearning.com/schoolofarts';
    p.urlVerified = true;
    delete p.urlNote;
    corrected++;
  }

  if (id === 2491) {
    // Kids Music Lessons — exists on School of Arts page
    p.postalCode = 'V5V 3E2';
    p.costNote = '$20 trial class credited toward first month tuition if enrolled. Lessons in piano, flute, voice, guitar, ukulele. RCM exam prep available. Ongoing pricing not listed — inquire with provider.';
    p.registrationUrl = 'https://www.kingcrestlearning.com/schoolofarts';
    p.urlVerified = true;
    delete p.urlNote;
    p.ageSpanJustified = 'Music lessons offered across all ages 3-10 as individual instruction tailored to each student';
    corrected++;
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Kingcrest Learning Academy: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
