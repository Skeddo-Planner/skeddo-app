/**
 * The Stage Musical Theatre Audit Fix — 2026-04-09
 * Rank 227 in audit queue
 *
 * Browser-verified against:
 * - https://www.thestagenewwest.ca/program/summermusicaltheatredaycamps/
 * - https://www.thestagenewwest.ca/program/stagecamp2025/ (StageCamp 2026 Alice)
 *
 * Key changes:
 * - Cost note added: $399 + GST = $418.95
 * - activityType corrected: "Dance" → "Theatre & Drama"
 * - registrationUrl updated to actual registration portal
 * - Added StageCamp: Alice in Wonderland (ages 11-15, Aug 4-15, $780+GST)
 * - Added postalCode
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;
let added = 0;

// Fix existing 4 entries (IDs 669-672)
for (const p of programs) {
  if (p.provider !== 'The Stage Musical Theatre') continue;
  if (![669, 670, 671, 672].includes(Number(p.id))) continue;

  p.activityType = 'Theatre & Drama';
  p.costNote = '$399 + GST ($418.95 total). Payment due in full at registration. $50 deposit kept if cancelled. Subsidies/sliding scale available.';
  p.postalCode = 'V3L 1H9';
  p.registrationUrl = 'https://app.gostudiopro.com/online/thestage';
  p.description = 'Musical theatre day camp at The Stage, New Westminster. Ages 6-10 (K-Gr 5). Music, theatre, dance, art, and acting games around a themed script. Personal workbook with real script. Friday afternoon live performance showcase with student-created set pieces and props. Outdoor play at Pier Park. Digital scrapbook for parents. Different theme each week.';
  delete p.urlVerified;
  corrected++;
}

// Add StageCamp: Alice in Wonderland (ages 11-15)
const stagecamp = {
  id: 'stage-alice-wonderland',
  name: 'StageCamp: Alice in Wonderland',
  provider: 'The Stage Musical Theatre',
  category: 'Arts',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  ageMin: 11,
  ageMax: 15,
  startDate: '2026-08-04',
  endDate: '2026-08-15',
  days: 'Mon-Sat',
  startTime: '9:00 AM',
  endTime: '4:00 PM',
  cost: 780,
  costNote: '$780 + GST ($819 total). $390 due at registration, remainder due June 1, 2026. $50 deposit kept if cancelled. 2-week production camp.',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Downtown New West',
  address: '511 Royal Ave, New Westminster, BC V3L 1H9',
  postalCode: 'V3L 1H9',
  lat: 49.2048,
  lng: -122.9145,
  city: 'New Westminster',
  enrollmentStatus: 'Open',
  registrationUrl: 'https://app.gostudiopro.com/online/thestage',
  description: 'Two-week musical theatre production camp presenting Alice in Wonderland. Ages 11-15 (must be 11 before camp start). Week 1: casting and rehearsals. Sat Aug 8: set painting with families. Week 2: rehearsals. Fri Aug 14: tech/dress rehearsal. Sat Aug 15: matinee and evening performances. 9am-4pm daily. Space limited.',
  tags: ['musical theatre', 'performing arts', 'theatre', 'production', 'Alice in Wonderland'],
  activityType: 'Theatre & Drama',
  priceVerified: true,
  confirmed2026: true,
  season: 'Summer 2026'
};

const lastIdx = programs.reduce((acc, p, i) =>
  p.provider === 'The Stage Musical Theatre' ? i : acc, -1);

if (lastIdx >= 0) {
  programs.splice(lastIdx + 1, 0, stagecamp);
  added++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`The Stage Musical Theatre: ${corrected} corrected, ${added} added`);
console.log(`Total programs: ${programs.length}`);
