/**
 * Dynamo Fencing Audit Fix — 2026-04-09
 * Rank 209 in audit queue
 *
 * Browser-verified against https://www.dynamofencing.com/camps
 *
 * DB had 4 entries for Jul 6-31. Page shows:
 * - Richmond: Jul 6-10, Aug 3-7 (half day 12-3PM)
 * - North Van: Jul 13-17, Aug 10-14 (half day 12-3PM)
 * - Gastown: Jul 20-24, Aug 17-21 (half day 12-3PM OR full day 9AM-3PM)
 * - Pro-D Day Camp: Apr 20 (full day 9AM-3PM, $119)
 *
 * ID 360 (Jul 27-31) doesn't exist on page — deactivated.
 * 6 new entries added.
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

const REG_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdDEHlUQmMnsOyVtmY7w_jsa0-WiskuSeNyFiC8oTQJp8l-4g/viewform';
const PAGE_URL = 'https://www.dynamofencing.com/camps';

const COMMON = {
  provider: 'Dynamo Fencing',
  category: 'Sports',
  campType: 'Summer Camp',
  ageMin: 6,
  ageMax: 16,
  days: 'Mon-Fri',
  indoorOutdoor: 'Indoor',
  tags: ['fencing', 'sports', 'summer camp'],
  source: 'dynamofencing.com',
  season: 'Summer 2026',
  activityType: 'Fencing',
  confirmed2026: true,
  priceVerified: true,
  urlVerified: true,
  ageSpanJustified: 'Single "All Level (Beginner)" camp for ages 6-16; no separate age-band registrations on provider page.',
  city: 'Vancouver',
};

let corrected = 0;

// Fix existing entries
for (const p of programs) {
  if (p.provider !== 'Dynamo Fencing') continue;

  switch (p.id) {
    case 357: // Jul 6-10 = Richmond
      p.name = 'All Level Fencing Camp – Richmond';
      p.startTime = '12:00 PM';
      p.endTime = '3:00 PM';
      p.scheduleType = 'Half Day (PM)';
      p.dayLength = 'Half Day';
      p.durationPerDay = 3;
      p.cost = 349;
      p.costNote = '$349 + 5% GST. All equipment provided.';
      p.address = '2231 Vauxhall Place, Richmond, BC';
      p.neighbourhood = 'Richmond';
      p.lat = 49.1717;
      p.lng = -123.0995;
      p.enrollmentStatus = 'Open';
      p.registrationUrl = REG_URL;
      p.description = 'All level beginner fencing summer camp at Dynamo Richmond. Half day 12:00-3:00 PM. Ages 6-16. All equipment provided. $349 + 5% tax.';
      Object.assign(p, { confirmed2026: true, priceVerified: true, urlVerified: true, ageSpanJustified: COMMON.ageSpanJustified });
      if (p.isEstimate) delete p.isEstimate;
      corrected++;
      break;

    case 358: // Jul 13-17 = North Vancouver
      p.name = 'All Level Fencing Camp – North Vancouver';
      p.startTime = '12:00 PM';
      p.endTime = '3:00 PM';
      p.scheduleType = 'Half Day (PM)';
      p.dayLength = 'Half Day';
      p.durationPerDay = 3;
      p.cost = 349;
      p.costNote = '$349 + 5% GST. All equipment provided.';
      p.address = '238 Fell Ave, North Vancouver, BC';
      p.neighbourhood = 'North Vancouver';
      p.lat = 49.3199;
      p.lng = -123.0724;
      p.enrollmentStatus = 'Open';
      p.registrationUrl = REG_URL;
      p.description = 'All level beginner fencing summer camp at Dynamo North Vancouver. Half day 12:00-3:00 PM. Ages 6-16. All equipment provided. $349 + 5% tax.';
      Object.assign(p, { confirmed2026: true, priceVerified: true, urlVerified: true, ageSpanJustified: COMMON.ageSpanJustified });
      if (p.isEstimate) delete p.isEstimate;
      corrected++;
      break;

    case 359: // Jul 20-24 = Gastown (half day)
      p.name = 'All Level Fencing Camp – Gastown (Half Day)';
      p.startTime = '12:00 PM';
      p.endTime = '3:00 PM';
      p.scheduleType = 'Half Day (PM)';
      p.dayLength = 'Half Day';
      p.durationPerDay = 3;
      p.cost = 349;
      p.costNote = '$349 + 5% GST. Full day option also available ($499). All equipment provided.';
      p.address = '211 Columbia St #100, Vancouver, BC';
      p.neighbourhood = 'Gastown';
      p.lat = 49.2827;
      p.lng = -123.1048;
      p.enrollmentStatus = 'Open';
      p.registrationUrl = REG_URL;
      p.description = 'All level beginner fencing summer camp at Dynamo Gastown. Half day 12:00-3:00 PM. Full day option (9 AM-3 PM, $499) also available. Ages 6-16. All equipment provided. $349 + 5% tax.';
      Object.assign(p, { confirmed2026: true, priceVerified: true, urlVerified: true, ageSpanJustified: COMMON.ageSpanJustified });
      if (p.isEstimate) delete p.isEstimate;
      corrected++;
      break;

    case 360: // Jul 27-31 = DOES NOT EXIST on page
      p.confirmed2026 = false;
      p.enrollmentStatus = 'Likely Coming Soon';
      p.description = 'Jul 27-31 session does not appear on 2026 Dynamo Fencing camps page. Retained per R31. Actual 2026 sessions are at specific locations: Richmond Jul 6-10/Aug 3-7, North Van Jul 13-17/Aug 10-14, Gastown Jul 20-24/Aug 17-21.';
      corrected++;
      break;
  }
}

// Add new entries
const newEntries = [
  {
    id: 'dynamo-richmond-aug',
    name: 'All Level Fencing Camp – Richmond',
    startDate: '2026-08-03',
    endDate: '2026-08-07',
    startTime: '12:00 PM',
    endTime: '3:00 PM',
    scheduleType: 'Half Day (PM)',
    dayLength: 'Half Day',
    durationPerDay: 3,
    cost: 349,
    costNote: '$349 + 5% GST. All equipment provided.',
    address: '2231 Vauxhall Place, Richmond, BC',
    neighbourhood: 'Richmond',
    lat: 49.1717,
    lng: -123.0995,
    description: 'All level beginner fencing summer camp at Dynamo Richmond. Half day 12:00-3:00 PM. Ages 6-16. All equipment provided. $349 + 5% tax.',
  },
  {
    id: 'dynamo-northvan-aug',
    name: 'All Level Fencing Camp – North Vancouver',
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    startTime: '12:00 PM',
    endTime: '3:00 PM',
    scheduleType: 'Half Day (PM)',
    dayLength: 'Half Day',
    durationPerDay: 3,
    cost: 349,
    costNote: '$349 + 5% GST. All equipment provided.',
    address: '238 Fell Ave, North Vancouver, BC',
    neighbourhood: 'North Vancouver',
    lat: 49.3199,
    lng: -123.0724,
    description: 'All level beginner fencing summer camp at Dynamo North Vancouver. Half day 12:00-3:00 PM. Ages 6-16. All equipment provided. $349 + 5% tax.',
  },
  {
    id: 'dynamo-gastown-aug-half',
    name: 'All Level Fencing Camp – Gastown (Half Day)',
    startDate: '2026-08-17',
    endDate: '2026-08-21',
    startTime: '12:00 PM',
    endTime: '3:00 PM',
    scheduleType: 'Half Day (PM)',
    dayLength: 'Half Day',
    durationPerDay: 3,
    cost: 349,
    costNote: '$349 + 5% GST. Full day option also available ($499). All equipment provided.',
    address: '211 Columbia St #100, Vancouver, BC',
    neighbourhood: 'Gastown',
    lat: 49.2827,
    lng: -123.1048,
    description: 'All level beginner fencing summer camp at Dynamo Gastown. Half day 12:00-3:00 PM. Full day option (9 AM-3 PM, $499) also available. Ages 6-16. All equipment provided. $349 + 5% tax.',
  },
  {
    id: 'dynamo-gastown-jul-full',
    name: 'All Level Fencing Camp – Gastown (Full Day)',
    startDate: '2026-07-20',
    endDate: '2026-07-24',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    scheduleType: 'Full Day',
    dayLength: 'Full Day',
    durationPerDay: 6,
    cost: 499,
    costNote: '$499 + 5% GST. Full day option at Gastown only. All equipment provided.',
    address: '211 Columbia St #100, Vancouver, BC',
    neighbourhood: 'Gastown',
    lat: 49.2827,
    lng: -123.1048,
    description: 'All level beginner fencing summer camp at Dynamo Gastown. Full day 9:00 AM-3:00 PM. Ages 6-16. All equipment provided. $499 + 5% tax.',
  },
  {
    id: 'dynamo-gastown-aug-full',
    name: 'All Level Fencing Camp – Gastown (Full Day)',
    startDate: '2026-08-17',
    endDate: '2026-08-21',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    scheduleType: 'Full Day',
    dayLength: 'Full Day',
    durationPerDay: 6,
    cost: 499,
    costNote: '$499 + 5% GST. Full day option at Gastown only. All equipment provided.',
    address: '211 Columbia St #100, Vancouver, BC',
    neighbourhood: 'Gastown',
    lat: 49.2827,
    lng: -123.1048,
    description: 'All level beginner fencing summer camp at Dynamo Gastown. Full day 9:00 AM-3:00 PM. Ages 6-16. All equipment provided. $499 + 5% tax.',
  },
  {
    id: 'dynamo-prod-apr20',
    name: 'Pro-D Day Fencing Camp – Gastown',
    startDate: '2026-04-20',
    endDate: '2026-04-20',
    startTime: '9:00 AM',
    endTime: '3:00 PM',
    scheduleType: 'Full Day',
    dayLength: 'Full Day',
    durationPerDay: 6,
    cost: 119,
    costNote: '$119 + 5% GST. Bring lunch and snacks. Extended hours available for extra charge.',
    address: '211 Columbia St #100, Vancouver, BC',
    neighbourhood: 'Gastown',
    lat: 49.2827,
    lng: -123.1048,
    description: 'Pro-D Day fencing camp at Dynamo Gastown. Full day 9:00 AM-3:00 PM. Ages 6-16. All equipment provided. Bring lunch and snacks. $119 + 5% tax. Extended drop-off/pick-up available.',
    campType: 'Pro-D Day Camp',
    season: 'Spring 2026',
  },
];

for (const entry of newEntries) {
  programs.push({
    ...COMMON,
    enrollmentStatus: 'Open',
    registrationUrl: REG_URL,
    status: 'Open',
    ...entry,
  });
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Dynamo Fencing: ${corrected} corrected, ${newEntries.length} added`);
console.log(`Total programs: ${programs.length}`);
