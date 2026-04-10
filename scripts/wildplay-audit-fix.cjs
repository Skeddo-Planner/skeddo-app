/**
 * WildPlay Element Parks Audit Fix — 2026-04-09
 * Rank 249 in audit queue
 *
 * Browser-verified against:
 * - https://www.wildplay.com/camps (main camps page)
 * - https://book.singenuity.com/6/activity/details/1624/rates (full-day camp booking)
 * - https://book.singenuity.com/6/activity/details/3845/rates (minis booking)
 * - https://book.singenuity.com/6/activity/details/1392/rates (Pro-D day camp booking)
 *
 * Key findings:
 * - Maple Ridge only location in Metro Vancouver service area (Victoria/Nanaimo are Vancouver Island)
 * - Full-day camp (10-14): tiered pricing — Early Bird $425, Regular $450, Last Minute $475
 * - Minis half-day (5-8): Regular $219.99, Last Minute $239.99
 * - Pro-D Day Camps (7-14): Early Bird $79.99, Regular $89.99, Last Minute $99.99
 * - MISSING: 3 Pro-D Day Camp entries (Apr 24, May 13, May 25)
 * - Monday-only try-then-buy option $89.99 for full-day camp
 * - Discount codes: CAMP25 ($25 off before Jun 30), AGCSP (Season Passholders $25 off), stackable
 * - Address: 23485 Fern Crescent, Maple Ridge, BC V4R 2S6
 * - Drop-off 8:30-9:00 AM, pickup 4:30-5:30 PM (full day); minis 8:30 AM-12:30 PM
 * - Phone: 1-855-595-2251 / 250-590-7529
 * - Email: camps@wildplay.com
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;
let added = 0;

for (const p of programs) {
  if (p.provider !== 'WildPlay Element Parks') continue;
  if (![499, 500, 501, 502].includes(Number(p.id))) continue;

  // Common fixes for all entries
  p.postalCode = 'V4R 2S6';
  p.address = '23485 Fern Crescent, Maple Ridge, BC V4R 2S6';
  p.confirmed2026 = true;
  p.priceVerified = true;
  p.enrollmentStatus = 'Open';
  p.status = 'Open';
  p.urlVerified = true;
  p.activityType = 'Aerial Adventure';
  p.category = 'Sports';

  const id = Number(p.id);

  if (id === 499 || id === 500 || id === 502) {
    // Full-day summer camps (Ages 10-14)
    p.cost = 425;
    p.costNote = 'Tiered pricing: Early Bird $425, Regular $450, Last Minute $475. CAMP25 code saves $25 (register by Jun 30). Season Passholders save $25 (code AGCSP). Discounts stackable — save up to $75. Monday-only try-then-buy $89.99. Min height 4\'8". 1:8 guide ratio, 10-24 campers. Free cancellation 72+ hrs notice. Late pickup fees apply after 5:30 PM. Contact: 1-855-595-2251 or camps@wildplay.com.';
    p.startTime = '8:30 AM';
    p.endTime = '5:30 PM';
    p.registrationUrl = 'https://book.singenuity.com/6/activity/details/1624/date';
    p.discountNote = 'Early Bird $425 (vs Regular $450). CAMP25 code $25 off before Jun 30. Season Passholders save $25 (code AGCSP). Stackable up to $75 off.';
    p.description = 'Anti-Gravity Camp at WildPlay Maple Ridge. Ages 10-14, min 4\'8". Mon-Fri 8:30am-5:30pm. Zipline, ropes courses, adventure courses, team-building, outdoor education. 1:8 guide ratio. Includes WildPlay water bottle and t-shirt. Daily schedule: 9am-12pm icebreakers + guided climbing, 12-3pm lunch + forest walks + outdoor education, 3-5pm Classic/Extreme courses + bungee.';
  }

  if (id === 501) {
    // Half-day minis (Ages 5-8)
    p.cost = 219.99;
    p.costNote = 'Regular $219.99/week, Last Minute $239.99/week. Season Passholders save $25 (code AGCSP). Min height 3\'9". 1:8 guide ratio, 10-24 campers. Includes WildPlay water bottle. Free cancellation 72+ hrs notice. Contact: 1-855-595-2251 or camps@wildplay.com.';
    p.startTime = '8:30 AM';
    p.endTime = '12:30 PM';
    p.registrationUrl = 'https://book.singenuity.com/6/activity/details/3845/date';
    p.discountNote = 'Season Passholders save $25 (code AGCSP).';
    p.description = 'Anti-Gravity Camp Minis at WildPlay Maple Ridge. Ages 5-8, min 3\'9". Mon-Fri 8:30am-12:30pm. Half-day aerial adventure for younger kids on Kids Adventure Course. Team-building, outdoor education, guided climbing. 1:8 guide ratio. Includes WildPlay water bottle.';
  }

  p.tags = ['aerial adventure', 'ziplining', 'ropes course', 'outdoor adventure', 'summer camp'];
  corrected++;
}

// Add missing Pro-D Day Camp entries
const proDDates = [
  { date: '2026-04-24', label: 'April 24' },
  { date: '2026-05-13', label: 'May 13' },
  { date: '2026-05-25', label: 'May 25' },
];

// Find max numeric ID
let maxId = 0;
for (const p of programs) {
  const numId = Number(p.id);
  if (!isNaN(numId) && numId > maxId) maxId = numId;
}

for (let i = 0; i < proDDates.length; i++) {
  const d = proDDates[i];
  programs.push({
    id: maxId + 1 + i,
    name: `Pro-D Day Camp (Ages 7-14) — ${d.label}`,
    provider: 'WildPlay Element Parks',
    category: 'Sports',
    activityType: 'Aerial Adventure',
    campType: 'Pro-D Day Camp',
    scheduleType: 'Full Day',
    ageMin: 7,
    ageMax: 14,
    startDate: d.date,
    endDate: d.date,
    days: d.date === '2026-05-25' ? 'Mon' : (d.date === '2026-04-24' ? 'Fri' : 'Wed'),
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    cost: 79.99,
    priceVerified: true,
    confirmed2026: true,
    indoorOutdoor: 'Outdoor',
    neighbourhood: 'Town Centre',
    address: '23485 Fern Crescent, Maple Ridge, BC V4R 2S6',
    postalCode: 'V4R 2S6',
    city: 'Maple Ridge',
    lat: 49.217,
    lng: -122.62,
    enrollmentStatus: 'Open',
    status: 'Open',
    registrationUrl: 'https://book.singenuity.com/6/activity/details/1392/date',
    urlVerified: true,
    description: `Pro-D Day Camp at WildPlay Maple Ridge. Ages 7-14, ${d.label}. 9am-5pm. One-day aerial adventure: ropes courses, ziplines, team-building, outdoor education. Min height 3'9" (Kids Course), 4'8" (Classic + Extreme). 1:8 guide ratio, 10-24 campers.`,
    costNote: `Tiered pricing: Early Bird $79.99, Regular $89.99, Last Minute $99.99. Season Passholders save $20 (code ANTIGRAVITYSP). Free cancellation 72+ hrs notice. Contact: 1-855-595-2251 or camps@wildplay.com.`,
    discountNote: 'Early Bird $79.99 (vs Regular $89.99). Season Passholders save $20 (code ANTIGRAVITYSP).',
    tags: ['aerial adventure', 'ziplining', 'ropes course', 'outdoor adventure', 'pro-d day'],
    ageSpanJustified: 'Provider offers single Pro-D Day Camp for ages 7-14 with height-based course access (3\'9" Kids Course, 4\'8" Classic+Extreme)',
    dayLength: 'Full Day',
    season: 'Spring 2026',
    durationPerDay: 8,
  });
  added++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`WildPlay Element Parks: ${corrected} corrected, ${added} added`);
console.log(`Total programs: ${programs.length}`);
