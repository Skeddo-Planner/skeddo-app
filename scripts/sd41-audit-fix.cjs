/**
 * Burnaby School District (SD41) Audit Fix — 2026-04-09
 * Rank 218 in audit queue
 *
 * Browser-verified against https://burnabyschools.ca/summersession/
 * Page updated April 9, 2026.
 *
 * Key corrections:
 * - Elementary times were in decimal format (8.92 instead of "8:55 AM")
 * - Elementary enrollmentStatus "Open" → "Coming Soon" (registration opens Apr 14)
 * - Secondary ELL/Preview: wrong times (9:00→8:45, 12:00→12:05), ageMax 18→15 (Gr 8-9)
 * - Secondary Advanced Credit: wrong times (9:00→8:15, 12:00→12:05), endDate Jul 31→Jul 30
 * - Added PM session for Secondary Advanced Credit (12:35–4:25 PM)
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;
let added = 0;

for (const p of programs) {
  if (p.provider !== 'Burnaby School District (SD41)') continue;

  // SD41-0001: Elementary Summer Session - Morning Classes
  if (p.id === 'SD41-0001') {
    p.startTime = '8:55 AM';
    p.endTime = '12:15 PM';
    p.enrollmentStatus = 'Coming Soon';
    p.status = 'Coming Soon';
    p.registrationUrl = 'https://burnabyschools.ca/summersession/';
    p.registrationDate = '2026-04-14';
    p.description = 'Free academic enrichment morning classes for elementary students (K-7) across 14 Burnaby schools. Core subjects, hands-on learning, creative courses. July 2-17, Mon-Fri 8:55 AM-12:15 PM. Pre-approval required for non-Burnaby public school students. Free for all BC students.';
    p.costNote = 'Free for all BC students. Pre-approval required for non-Burnaby SD41 students.';
    p.urlNote = 'Elementary registration opens April 14 at 10am (group 1) and April 16 (group 2).';
    delete p.times;
    corrected++;
  }

  // SD41-0002: Elementary Summer Session - Afternoon Camps
  if (p.id === 'SD41-0002') {
    p.startTime = '12:45 PM';
    p.endTime = '3:15 PM';
    p.enrollmentStatus = 'Coming Soon';
    p.status = 'Coming Soon';
    p.registrationUrl = 'https://burnabyschools.ca/summersession/';
    p.registrationDate = '2026-04-14';
    p.description = 'Free afternoon enrichment camps for elementary students (K-7) including sports, arts, coding, guitar, sewing, and skill exploration. July 2-17, Mon-Fri 12:45-3:15 PM. Available at select Burnaby schools offering Full Day. Pre-approval required for non-Burnaby public school students.';
    p.costNote = 'Free for all BC students. Pre-approval required for non-Burnaby SD41 students.';
    p.urlNote = 'Elementary registration opens April 14 at 10am (group 1) and April 16 (group 2). Afternoon camps only at Full Day schools: Aubrey, Brantford, Cascade Heights, Marlborough, Parkcrest, Seaforth, Sperling, Taylor Park.';
    delete p.times;
    corrected++;
  }

  // SD41-0003: Secondary Summer Session - ELL/Preview/Enrichment
  if (p.id === 'SD41-0003') {
    p.startTime = '8:45 AM';
    p.endTime = '12:05 PM';
    p.ageMin = 13;
    p.ageMax = 15;
    p.enrollmentStatus = 'Open';
    p.status = 'Open';
    p.registrationUrl = 'https://registration.sd41.bc.ca/Forms/ssessionreg8-12am';
    p.description = 'Free secondary summer session for Grade 8-9 students: ELL, grade preview, enrichment, coding, badminton, fitness, animation, game design, and more. July 2-17, Mon-Fri 8:45 AM-12:05 PM. At Burnaby Central, Burnaby North, and Burnaby South secondary schools. Pre-approval required for non-Burnaby public school students.';
    p.costNote = 'Free for all BC students. Pre-approval required for non-Burnaby SD41 students.';
    p.confirmed2026 = true;
    p.priceVerified = true;
    corrected++;
  }

  // SD41-0004: Secondary Summer Session - Advanced Credit (AM)
  if (p.id === 'SD41-0004') {
    p.name = 'Secondary Summer Session - Advanced Credit (AM)';
    p.startTime = '8:15 AM';
    p.endTime = '12:05 PM';
    p.endDate = '2026-07-30';
    p.enrollmentStatus = 'Open';
    p.status = 'Open';
    p.registrationUrl = 'https://registration.sd41.bc.ca/Forms/ssessionreg8-12am';
    p.description = 'Free advanced credit academic courses for Grade 10-12 secondary students including Chemistry, English, Social Studies, Math, and other subjects. July 2-30 (July 31 admin day), Mon-Fri 8:15 AM-12:05 PM. At Burnaby Central, Burnaby North, and Burnaby South. Pre-approval required for non-Burnaby public school students.';
    p.costNote = 'Free for all BC students. Pre-approval required for non-Burnaby SD41 students.';
    p.confirmed2026 = true;
    p.priceVerified = true;
    corrected++;
  }
}

// Add SD41-0005: Secondary Advanced Credit PM session
const newEntry = {
  id: 'SD41-0005',
  name: 'Secondary Summer Session - Advanced Credit (PM)',
  provider: 'Burnaby School District (SD41)',
  category: 'Academic',
  campType: 'Summer Learning',
  ageMin: 15,
  ageMax: 18,
  startDate: '2026-07-02',
  endDate: '2026-07-30',
  days: 'Mon-Fri',
  startTime: '12:35 PM',
  endTime: '4:25 PM',
  cost: 0,
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Multiple Locations',
  address: 'Multiple Burnaby secondary schools',
  postalCode: null,
  lat: 49.2488,
  lng: -122.9805,
  enrollmentStatus: 'Open',
  registrationUrl: 'https://registration.sd41.bc.ca/Forms/ssessionreg8-12pm',
  description: 'Free advanced credit academic courses for Grade 10-12 secondary students. Afternoon session: July 2-30 (July 31 admin day), Mon-Fri 12:35-4:25 PM. At Burnaby Central, Burnaby North, and Burnaby South. Pre-approval required for non-Burnaby public school students.',
  tags: ['school district', 'Burnaby', 'SD41', 'summer session', 'secondary', 'free', 'academic'],
  source: 'Burnaby Schools Summer Session 2026',
  season: 'Summer 2026',
  costNote: 'Free for all BC students. Pre-approval required for non-Burnaby SD41 students.',
  priceVerified: true,
  confirmed2026: true,
  activityType: 'Academic',
  ageSpanJustified: 'SD41 Advanced Credit courses are open to all Grade 10-12 students (ages 15-18).'
};

// Insert after the last SD41 entry
const lastSD41Idx = programs.reduce((acc, p, i) =>
  p.provider === 'Burnaby School District (SD41)' ? i : acc, -1);

if (lastSD41Idx >= 0) {
  programs.splice(lastSD41Idx + 1, 0, newEntry);
  added++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`SD41: ${corrected} corrected, ${added} added`);
console.log(`Total programs: ${programs.length}`);
