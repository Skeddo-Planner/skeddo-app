/**
 * Maplewood Farm Audit Fix — 2026-04-09
 * Rank 220 in audit queue
 *
 * Browser-verified against https://maplewoodfarm.bc.ca/farm-programs/
 *
 * Existing 4 entries verified — data mostly accurate.
 * Minor fixes: postal code, ageSpanJustified for 5-12 range.
 * Added: Farm Felting workshop (ages 6+ with adult, 2 sessions).
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;
let added = 0;

for (const p of programs) {
  if (p.provider !== 'Maplewood Farm') continue;

  // Fix postal code for all entries (website footer says V7H 1S6)
  if (p.address && p.address.includes('V7H 1S4')) {
    p.address = '405 Seymour River Place, North Vancouver, BC V7H 1S6';
  }

  // Add ageSpanJustified for entries with 5-12 range (7 years > 6)
  if (p.id === 15845 || p.id === 15846 || p.id === 15848) {
    p.ageSpanJustified = 'Provider lists age range as "5+" with no upper limit. ageMax=12 is a reasonable estimate for a farm program.';
  }

  // Update registration URLs to point to the programs page (confirmed correct landing)
  p.registrationUrl = 'https://maplewoodfarm.bc.ca/farm-programs/';

  // Remove urlVerified (not a standard field)
  delete p.urlVerified;

  corrected++;
}

// Add Farm Felting workshop
const newEntry = {
  id: 'maplewood-felting-1',
  name: 'Farm Felting Workshop (Ages 6+ with Adult)',
  provider: 'Maplewood Farm',
  category: 'Arts',
  campType: 'Class/Lesson',
  scheduleType: 'Activity',
  ageMin: 6,
  ageMax: 12,
  startDate: '2026-05-24',
  endDate: '2026-06-27',
  days: 'Weekends',
  startTime: '2:00 PM',
  endTime: '3:30 PM',
  cost: 36,
  costNote: '$36.30 incl. tax per adult+child pair. Members $18.85. Two sessions: May 24 and Jun 27. Adult must accompany child.',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Maplewood',
  address: '405 Seymour River Place, North Vancouver, BC V7H 1S6',
  lat: 49.321,
  lng: -123.0155,
  enrollmentStatus: 'Open',
  registrationUrl: 'https://maplewoodfarm.bc.ca/farm-programs/',
  description: 'Creative felting workshop at Maplewood Farm for children 6+ with an adult. Learn about wool processing and craft your favorite farm animal using colorful felted wool. 1.5-hour hands-on session. Two dates: May 24 and Jun 27.',
  tags: ['farm', 'arts', 'crafts', 'felting', 'family', 'workshop'],
  activityType: 'Arts & Crafts',
  priceVerified: true,
  confirmed2026: true,
  season: 'Summer 2026',
  city: 'North Vancouver',
  repeating: true,
  ageSpanJustified: 'Provider lists age range as "6+" with no upper limit. ageMax=12 is a reasonable estimate for a farm workshop.'
};

// Insert after last Maplewood Farm entry
const lastIdx = programs.reduce((acc, p, i) =>
  p.provider === 'Maplewood Farm' ? i : acc, -1);

if (lastIdx >= 0) {
  programs.splice(lastIdx + 1, 0, newEntry);
  added++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Maplewood Farm: ${corrected} corrected, ${added} added`);
console.log(`Total programs: ${programs.length}`);
