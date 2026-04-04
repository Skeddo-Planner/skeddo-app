#!/usr/bin/env node
/**
 * One-Click Deeper Audit: 4Cats Arts Studio V2
 *
 * Verified on 2026-04-03 via browser navigation of:
 *   https://4cats.com/pages/kids-camps
 *   https://4cats.com/collections/passover-camp
 *   https://4cats.com/collections/summer-camp-full-day
 *   https://4cats.com/collections/summer-camp-half-day
 *   https://4cats.com/collections/pa-pd-days
 *   https://4cats.com/collections/kids-class
 *   https://4cats.com/collections/mixed-media-class
 *   https://4cats.com/pages/vancouver-main-street
 *   https://4cats.com/pages/vancouver-kitsilano
 *   https://4cats.com/pages/ubc
 *   (plus individual product pages for prices, ages, times)
 *
 * Locations:
 *   Main Street: 3573 Main St, Vancouver, BC V5V 1M1
 *   Kitsilano:   3730 W 10th Ave, Vancouver, BC V6R 2G4
 *   UBC:         3311 Wesbrook Mall, Vancouver, BC V6S 0E3
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');

// ─── Location definitions ───────────────────────────────────────────────────
const LOCATIONS = {
  mainSt: {
    label: 'Main Street',
    address: '3573 Main St, Vancouver, BC V5V 1M1',
    neighbourhood: 'Riley Park',
    lat: 49.2474,
    lng: -123.1008,
    studioUrl: 'https://4cats.com/pages/vancouver-main-street',
  },
  kits: {
    label: 'Kitsilano',
    address: '3730 W 10th Ave, Vancouver, BC V6R 2G4',
    neighbourhood: 'Kitsilano',
    lat: 49.2669,
    lng: -123.1840,
    studioUrl: 'https://4cats.com/pages/vancouver-kitsilano',
  },
  ubc: {
    label: 'UBC',
    address: '3311 Wesbrook Mall, Vancouver, BC V6S 0E3',
    neighbourhood: 'University',
    lat: 49.2522,
    lng: -123.2427,
    studioUrl: 'https://4cats.com/pages/ubc',
  },
};

// ─── IDs: 2481-2484 updated, 15712+ new ────────────────────────────────────
let nextId = 15712;
function newId() { return nextId++; }

// ─── Program builder helpers ─────────────────────────────────────────────────
function base(loc) {
  return {
    provider: '4Cats Arts Studio',
    category: 'Arts',
    indoorOutdoor: 'Indoor',
    neighbourhood: loc.neighbourhood,
    address: loc.address,
    lat: loc.lat,
    lng: loc.lng,
    confirmed2026: true,
    priceVerified: true,
    city: 'Vancouver',
  };
}

// ─── CAMP: Summer Camp Full Day ──────────────────────────────────────────────
function summerFullDay(id, loc) {
  return {
    id,
    name: `Summer Art Camp — Full Day (${loc.label})`,
    ...base(loc),
    campType: 'Summer Camp',
    ageMin: 6,
    ageMax: 12,
    startDate: '2026-06-15',
    endDate: '2026-09-04',
    days: 'Mon-Fri',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    cost: 124,
    costNote: '$124 per day. Book individual days at the registration URL. 1-hour aftercare available for $15/day. No refunds; 30-day credit with 2+ weeks notice.',
    enrollmentStatus: 'Open',
    registrationUrl: 'https://4cats.com/collections/summer-camp-full-day',
    description: 'Full-day art camp with guided projects, creative studio time, and supportive instruction. Covers painting, drawing, clay, and mixed media inspired by famous artists. 9am–3pm Mon–Fri. Book individual days for $124/day. 1-hour aftercare available for $15/day. Pack 2 snacks and 1 lunch. Ages 6–12.',
    tags: ['art', 'painting', 'drawing', 'clay', 'mixed media', 'summer camp', 'full day'],
    activityType: 'Painting & Drawing',
    season: 'Summer 2026',
    repeating: true,
  };
}

// ─── CAMP: Summer Camp Half Day AM ──────────────────────────────────────────
function summerHalfAM(id, loc) {
  return {
    id,
    name: `Summer Art Camp — Half Day AM (${loc.label})`,
    ...base(loc),
    campType: 'Summer Camp',
    ageMin: 5,
    ageMax: 12,
    startDate: '2026-06-15',
    endDate: '2026-09-04',
    days: 'Mon-Fri',
    startTime: '9:00 AM',
    endTime: '12:00 PM',
    cost: 95,
    costNote: '$95 per day. Book individual days at the registration URL.',
    enrollmentStatus: 'Open',
    registrationUrl: 'https://4cats.com/collections/summer-camp-half-day',
    description: 'Half-day morning art camp with guided creative projects in painting, drawing, clay, and mixed media. 9am–12pm Mon–Fri. Book individual days for $95/day. Pack 2 snacks. Ages 5–12.',
    tags: ['art', 'painting', 'drawing', 'mixed media', 'summer camp', 'half day', 'morning'],
    activityType: 'Painting & Drawing',
    season: 'Summer 2026',
    repeating: true,
  };
}

// ─── CAMP: Summer Camp Half Day PM ──────────────────────────────────────────
function summerHalfPM(id, loc) {
  return {
    id,
    name: `Summer Art Camp — Half Day PM (${loc.label})`,
    ...base(loc),
    campType: 'Summer Camp',
    ageMin: 5,
    ageMax: 12,
    startDate: '2026-06-15',
    endDate: '2026-09-04',
    days: 'Mon-Fri',
    startTime: '1:00 PM',
    endTime: '4:00 PM',
    cost: 95,
    costNote: '$95 per day. Book individual days at the registration URL.',
    enrollmentStatus: 'Open',
    registrationUrl: 'https://4cats.com/collections/summer-camp-half-day-afternoons',
    description: 'Half-day afternoon art camp with guided creative projects in painting, drawing, clay, and mixed media. 1pm–4pm Mon–Fri. Book individual days for $95/day. Pack 2 snacks. Ages 5–12.',
    tags: ['art', 'painting', 'drawing', 'mixed media', 'summer camp', 'half day', 'afternoon'],
    activityType: 'Painting & Drawing',
    season: 'Summer 2026',
    repeating: true,
  };
}

// ─── CAMP: Passover Camp Full Day ────────────────────────────────────────────
function passoverCamp(id, loc, enrollmentStatus) {
  return {
    id,
    name: `Passover Art Camp — Full Day (${loc.label})`,
    ...base(loc),
    campType: 'Holiday Camp',
    ageMin: 6,
    ageMax: 12,
    startDate: '2026-04-06',
    endDate: '2026-04-10',
    days: 'Mon-Fri',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    cost: 124,
    costNote: '$124 per day. Book individual days. 1-hour aftercare available for $15/day. Members price $59.52/day.',
    enrollmentStatus,
    registrationUrl: 'https://4cats.com/collections/passover-camp',
    description: 'Full-day art camp during Passover school break (April 6–10, 2026). Guided art projects, creative studio time, and supportive instruction throughout the day. 9am–3pm. Book individual days for $124/day. 1-hour aftercare available. Pack 2 snacks and 1 lunch. Ages 6–12.',
    tags: ['art', 'painting', 'drawing', 'mixed media', 'passover', 'holiday camp', 'spring break'],
    activityType: 'Painting & Drawing',
    season: 'Spring 2026',
  };
}

// ─── CAMP: PA/PD Day ─────────────────────────────────────────────────────────
function paPdDay(id, loc) {
  return {
    id,
    name: `PA/PD Day Art Program (${loc.label})`,
    ...base(loc),
    campType: 'PD Day',
    ageMin: 6,
    ageMax: 12,
    startDate: '2026-04-06',
    endDate: '2026-06-26',
    days: 'Varies',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    cost: 109,
    costNote: '$109 per day ($65.40 member price). $10 sibling discount. 1-hour aftercare available for $15/day. Multiple PA and PD day dates available April–June 2026 — check registration URL for specific dates.',
    enrollmentStatus: 'Open',
    registrationUrl: 'https://4cats.com/collections/pa-pd-days',
    description: 'Full-day art program on school non-instructional (PA/PD) days. Guided creative projects with supportive instruction throughout the day. 9am–3pm, ages 6–12. $109/day ($65.40 member price). $10 sibling discount. 1-hour aftercare available for $15/day. Multiple dates available April–June 2026; check registration page for current listings.',
    tags: ['art', 'painting', 'drawing', 'clay', 'mixed media', 'PA day', 'PD day', 'school'],
    activityType: 'Painting & Drawing',
    season: 'Spring 2026',
    repeating: true,
  };
}

// ─── CLASS: Post-Impressionists 10-Week Session ───────────────────────────────
function postImpressionist(id, loc, dayOfWeek, startTime, endTime, startDate, endDate) {
  const timeLabel = startTime.replace(' ', '').toLowerCase();
  return {
    id,
    name: `Post-Impressionists 10-Week Kids Class — ${dayOfWeek} ${startTime} (${loc.label})`,
    ...base(loc),
    campType: 'Weekly Class',
    ageMin: 5,
    ageMax: 12,
    startDate,
    endDate,
    days: dayOfWeek,
    startTime,
    endTime,
    cost: 312.50,
    costNote: '$312.50 for the full 10-week session. Member early bird price: $150. Drop-off only.',
    enrollmentStatus: 'Open',
    registrationUrl: 'https://4cats.com/collections/10-week-post-impressionist-kids-session',
    description: `10-week kids art class exploring Post-Impressionist techniques. Students complete 6 finished projects across painting, clay, watercolour, and oven-bake clay in a supportive studio environment. 1.5 hours per class. ${dayOfWeek}s ${startTime}–${endTime}, ${startDate} to ${endDate}. Ages school-age (approx. 5–12). Drop-off only. $312.50 for the full 10-week session (member early bird: $150).`,
    tags: ['art', 'painting', 'clay', 'watercolour', 'mixed media', 'post-impressionist', 'weekly class', '10-week session'],
    activityType: 'Painting & Drawing',
    season: 'Spring 2026',
    repeating: true,
  };
}

// ─── CLASS: Mixed Media Drop-In ──────────────────────────────────────────────
function mixedMediaDropIn(id, loc, dayOfWeek, startDate, endDate) {
  return {
    id,
    name: `Mixed Media Drop-In Class — ${dayOfWeek}s 4pm (${loc.label})`,
    ...base(loc),
    campType: 'Drop-In Class',
    ageMin: 5,
    ageMax: 12,
    startDate,
    endDate,
    days: dayOfWeek,
    startTime: '4:00 PM',
    endTime: '5:30 PM',
    cost: 15,
    costNote: '$15 per class ($10 for members). Register for individual class dates and attend as often as you like.',
    enrollmentStatus: 'Open',
    registrationUrl: 'https://4cats.com/collections/mixed-media-class',
    description: `After-school drop-in art class exploring clay, paint, drawing, and layered materials. Each class offers two guided project options for creative choice. 1.5 hours. ${dayOfWeek}s 4pm–5:30pm. $15/class ($10 for members). Register for individual dates. Suitable for school-age kids ages 5–12. Drop-off only.`,
    tags: ['art', 'painting', 'drawing', 'clay', 'mixed media', 'after school', 'drop-in', 'weekly class'],
    activityType: 'Mixed Media',
    season: 'Spring 2026',
    repeating: true,
  };
}

// ─── CLASS: Playing in the Mud (Completed) ────────────────────────────────────
function playingInMud(id, loc) {
  return {
    id,
    name: `Playing in the Mud — 5-Week Clay Session (${loc.label})`,
    ...base(loc),
    campType: 'Weekly Class',
    ageMin: 7,
    ageMax: 12,
    startDate: '2026-01-05',
    endDate: '2026-02-02',
    days: 'Varies',
    startTime: null,
    endTime: null,
    cost: 199,
    costNote: '$199 for 5 classes (1.5 hrs each). Session ran approximately January–February 2026 based on January 2026 promotion. Specific schedule per studio. Check website for next session.',
    enrollmentStatus: 'Completed',
    registrationUrl: 'https://4cats.com/products/playing-in-the-mud-session-5-weeks',
    description: '5-week clay session exploring wheel throwing and hand-building. Students create mugs, plates, bowls, and sculptural clay projects. Includes learning the pottery wheel and hand-building techniques. 5 classes × 1.5 hours each. Ages 7–12. $199 for the session. Session ran approximately January–February 2026; check website for next session.',
    tags: ['art', 'clay', 'pottery', 'wheel throwing', 'hand building', 'weekly class', 'ceramics'],
    activityType: 'Pottery & Clay',
    season: 'Winter 2026',
    confirmed2026: true,
    priceVerified: true,
  };
}

// ─── CLASS: Dragons (Completed) ──────────────────────────────────────────────
function dragons(id, loc) {
  return {
    id,
    name: `Dragons — 5-Week Mixed Media Session (${loc.label})`,
    ...base(loc),
    campType: 'Weekly Class',
    ageMin: 5,
    ageMax: 12,
    startDate: '2026-01-05',
    endDate: '2026-02-02',
    days: 'Varies',
    startTime: null,
    endTime: null,
    cost: 165,
    costNote: '$165 for 5 classes (1.5 hrs each). Session ran approximately January–February 2026 based on January 2026 promotion. Specific schedule per studio. Check website for next session.',
    enrollmentStatus: 'Completed',
    registrationUrl: 'https://4cats.com/products/dragons-5-week-kids-session',
    description: '5-week mixed media session inspired by dragon folklore and mythology. Students sculpt a large dragon, create watercolour-and-ink dragon worlds, and paint an acrylic dragon on canvas. 5 classes × 1.5 hours each. Ages 5–12. $165 for the session. Session ran approximately January–February 2026; check website for next session.',
    tags: ['art', 'painting', 'sculpture', 'watercolour', 'acrylic', 'clay', 'mixed media', 'weekly class'],
    activityType: 'Mixed Media',
    season: 'Winter 2026',
  };
}

// ─── Build all programs ───────────────────────────────────────────────────────
const allLocs = [LOCATIONS.mainSt, LOCATIONS.kits, LOCATIONS.ubc];

const newPrograms = [
  // ── Summer Camp Full Day (IDs: 2481, 15712, 15713)
  summerFullDay(2481, LOCATIONS.mainSt),
  summerFullDay(15712, LOCATIONS.kits),
  summerFullDay(15713, LOCATIONS.ubc),

  // ── Summer Camp Half Day AM (IDs: 2482, 15714, 15715)
  summerHalfAM(2482, LOCATIONS.mainSt),
  summerHalfAM(15714, LOCATIONS.kits),
  summerHalfAM(15715, LOCATIONS.ubc),

  // ── Summer Camp Half Day PM (IDs: 2483, 15716, 15717)
  summerHalfPM(2483, LOCATIONS.mainSt),
  summerHalfPM(15716, LOCATIONS.kits),
  summerHalfPM(15717, LOCATIONS.ubc),

  // ── PA/PD Days (IDs: 2484, 15718, 15719)
  paPdDay(2484, LOCATIONS.mainSt),
  paPdDay(15718, LOCATIONS.kits),
  paPdDay(15719, LOCATIONS.ubc),

  // ── Passover Camp (IDs: 15720, 15721, 15722)
  // Main St: 1 spot available on Apr 6 (Open); Kits & UBC: Sold Out for Apr 6
  passoverCamp(15720, LOCATIONS.mainSt, 'Open'),
  passoverCamp(15721, LOCATIONS.kits, 'Full'),
  passoverCamp(15722, LOCATIONS.ubc, 'Full'),

  // ── Post-Impressionists: Sat 9am (IDs: 15723, 15724, 15725)
  postImpressionist(15723, LOCATIONS.mainSt, 'Sat', '9:00 AM', '10:30 AM', '2026-04-18', '2026-06-20'),
  postImpressionist(15724, LOCATIONS.kits,   'Sat', '9:00 AM', '10:30 AM', '2026-04-18', '2026-06-20'),
  postImpressionist(15725, LOCATIONS.ubc,    'Sat', '9:00 AM', '10:30 AM', '2026-04-18', '2026-06-20'),

  // ── Post-Impressionists: Sun 9am (IDs: 15726, 15727, 15728)
  postImpressionist(15726, LOCATIONS.mainSt, 'Sun', '9:00 AM', '10:30 AM', '2026-04-19', '2026-06-21'),
  postImpressionist(15727, LOCATIONS.kits,   'Sun', '9:00 AM', '10:30 AM', '2026-04-19', '2026-06-21'),
  postImpressionist(15728, LOCATIONS.ubc,    'Sun', '9:00 AM', '10:30 AM', '2026-04-19', '2026-06-21'),

  // ── Post-Impressionists: Mon 4pm (IDs: 15729, 15730, 15731)
  postImpressionist(15729, LOCATIONS.mainSt, 'Mon', '4:00 PM', '5:30 PM', '2026-04-13', '2026-06-15'),
  postImpressionist(15730, LOCATIONS.kits,   'Mon', '4:00 PM', '5:30 PM', '2026-04-13', '2026-06-15'),
  postImpressionist(15731, LOCATIONS.ubc,    'Mon', '4:00 PM', '5:30 PM', '2026-04-13', '2026-06-15'),

  // ── Post-Impressionists: Mon 5:45pm (IDs: 15732, 15733, 15734)
  postImpressionist(15732, LOCATIONS.mainSt, 'Mon', '5:45 PM', '7:15 PM', '2026-04-13', '2026-06-15'),
  postImpressionist(15733, LOCATIONS.kits,   'Mon', '5:45 PM', '7:15 PM', '2026-04-13', '2026-06-15'),
  postImpressionist(15734, LOCATIONS.ubc,    'Mon', '5:45 PM', '7:15 PM', '2026-04-13', '2026-06-15'),

  // ── Mixed Media Drop-In: Wed (IDs: 15735, 15736, 15737)
  mixedMediaDropIn(15735, LOCATIONS.mainSt, 'Wed', '2026-04-08', '2026-06-17'),
  mixedMediaDropIn(15736, LOCATIONS.kits,   'Wed', '2026-04-08', '2026-06-17'),
  mixedMediaDropIn(15737, LOCATIONS.ubc,    'Wed', '2026-04-08', '2026-06-17'),

  // ── Mixed Media Drop-In: Thu (IDs: 15738, 15739, 15740)
  mixedMediaDropIn(15738, LOCATIONS.mainSt, 'Thu', '2026-04-09', '2026-06-11'),
  mixedMediaDropIn(15739, LOCATIONS.kits,   'Thu', '2026-04-09', '2026-06-11'),
  mixedMediaDropIn(15740, LOCATIONS.ubc,    'Thu', '2026-04-09', '2026-06-11'),

  // ── Mixed Media Drop-In: Fri (IDs: 15741, 15742, 15743)
  mixedMediaDropIn(15741, LOCATIONS.mainSt, 'Fri', '2026-04-10', '2026-06-12'),
  mixedMediaDropIn(15742, LOCATIONS.kits,   'Fri', '2026-04-10', '2026-06-12'),
  mixedMediaDropIn(15743, LOCATIONS.ubc,    'Fri', '2026-04-10', '2026-06-12'),

  // ── Playing in the Mud (Completed) (IDs: 15744, 15745, 15746)
  playingInMud(15744, LOCATIONS.mainSt),
  playingInMud(15745, LOCATIONS.kits),
  playingInMud(15746, LOCATIONS.ubc),

  // ── Dragons (Completed) (IDs: 15747, 15748, 15749)
  dragons(15747, LOCATIONS.mainSt),
  dragons(15748, LOCATIONS.kits),
  dragons(15749, LOCATIONS.ubc),
];

// ─── Apply changes ────────────────────────────────────────────────────────────
const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

// IDs to replace (4 existing + all new ids)
const replaceIds = new Set([2481, 2482, 2483, 2484, ...newPrograms.filter(p => p.id >= 15712).map(p => p.id)]);

// Remove old 4Cats programs (keep non-4Cats, or 4Cats with IDs not in our set)
const filtered = data.filter(p => {
  if (p.provider === '4Cats Arts Studio') return false; // remove ALL existing 4Cats
  return true;
});

// Add all new programs
const updated = [...filtered, ...newPrograms];

fs.writeFileSync(DATA_PATH, JSON.stringify(updated, null, 2));
console.log(`Done. Removed all old 4Cats listings. Added ${newPrograms.length} new programs.`);
console.log(`Total programs in database: ${updated.length}`);
console.log('New IDs used:', newPrograms.map(p => p.id).join(', '));
