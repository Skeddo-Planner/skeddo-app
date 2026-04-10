/**
 * Metro Taekwondo Studios Audit Fix — 2026-04-09
 * Rank 211 in audit queue
 *
 * Browser-verified against https://metrotkdstudios.com/programs
 *
 * Website shows year-round martial arts classes, NOT summer camps:
 * - Lil' Ninjas Taekwondo (Ages 4-7)
 * - Junior Taekwondo (Ages 8-13)
 * - Teen Taekwondo (Ages 13-17)
 * - Adult Taekwondo (18+)
 * - Brazilian Jiu-Jitsu (All Levels)
 * - Kids BJJ (Ages 8-13)
 * - Olympic Sparring Team (Add-On)
 *
 * DB has 4 entries (375-378) as "Taekwondo Camp" with ages 5-14, cost=$250.
 * No summer camp dates, pricing, or registration on the page.
 * Reclassified as Year-Round Program, ages corrected to 4-13
 * (covering Lil' Ninjas 4-7 + Junior 8-13), cost set to null.
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'Metro Taekwondo Studios') continue;
  if (![375, 376, 377, 378].includes(Number(p.id))) continue;

  p.name = 'Kids Taekwondo Classes (Year-Round)';
  p.campType = 'Year-Round Program';
  p.season = 'Year-Round';
  p.ageMin = 4;
  p.ageMax = 13;
  p.cost = null;
  p.costNote = 'Year-round martial arts classes (not a summer camp). Contact provider for pricing: (604)299-4590 or metrotkd@shaw.ca. Website shows classes but no pricing.';
  p.priceVerified = false;
  p.confirmed2026 = false;
  p.enrollmentStatus = 'Likely Coming Soon';
  p.registrationUrl = 'https://metrotkdstudios.com/programs';
  p.description = 'Year-round taekwondo classes at Metro Taekwondo Studios in Burnaby. Programs for Lil\' Ninjas (ages 4-7) and Junior (ages 8-13). Also offers BJJ and Olympic sparring. Not a summer camp — year-round classes.';
  p.ageSpanJustified = 'Covers Lil\' Ninjas (4-7) and Junior Taekwondo (8-13) programs combined. Provider does not offer separate summer camp registrations by age group.';
  p.neighbourhood = 'Burnaby Heights';
  p.city = 'Burnaby';

  // Remove camp-specific fields that don't apply
  delete p.startDate;
  delete p.endDate;
  delete p.startTime;
  delete p.endTime;
  delete p.days;
  delete p.scheduleType;
  delete p.dayLength;
  delete p.durationPerDay;
  if (p.isEstimate) delete p.isEstimate;

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Metro Taekwondo Studios: ${corrected} corrected`);
console.log(`Total programs: ${programs.length}`);
