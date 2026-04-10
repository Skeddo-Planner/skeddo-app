/**
 * Ocean Ambassadors Canada Re-Audit Fix — 2026-04-09
 * Rank 248 in audit queue — RE-AUDIT via Chrome browser
 *
 * Browser-verified against:
 * - https://oceanambassadorscanada.org/programs/summer-camps/ — full program details, pricing
 * - https://mtseymour.ca/summer/2026-summer-camps — Sea to Sky listed on Mt Seymour camps page
 * - https://mtseymour.ca/summer/eco-adventure-summer-camps/forest-guardians — ages 7-9 schedule with Sea to Sky dates
 *
 * Key findings:
 * - Sea to Sky Camp is a partnership between Mt Seymour, Ocean Ambassadors, and Cates Park Paddling
 * - 3 weeks: Jul 6-10, Jul 13-17, Jul 20-24, $399/week
 * - Ages 7-9 (Forest Guardians): Mon-Wed Mt Seymour, Thu-Fri ocean days at Cates Park
 * - Ages 10-12 (Mountain Rangers): Mon-Wed ocean days at Cates Park, Thu-Fri Mt Seymour
 * - Camp hours: 9am-4pm (per Mt Seymour page)
 * - Leadership Camp for Young Women: Jun 29-Jul 2, $439, ages 13-15, max 12
 * - Leadership Camp registers via Google Form on Ocean Ambassadors site
 * - Sea to Sky registers via Mt Seymour website
 * - Phone: 604-312-6023 | Email: admin@oceanambassadorscanada.org
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// Remove old generic entries (IDs 16061-16063)
const oldIds = [16061, 16062, 16063];
const filtered = programs.filter(p => !oldIds.includes(Number(p.id)));
const removed = programs.length - filtered.length;

const seaToSkyBase = {
  provider: 'Ocean Ambassadors Canada',
  category: 'Nature',
  indoorOutdoor: 'Outdoor',
  city: 'North Vancouver',
  urlVerified: true,
  confirmed2026: true,
  priceVerified: true,
  enrollmentStatus: 'Open',
  status: 'Open',
  activityType: 'Outdoor Education',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  startTime: '09:00',
  endTime: '16:00',
  cost: 399,
  tags: ['outdoor education', 'nature', 'ocean', 'paddleboarding', 'kayaking', 'summer camp'],
  registrationUrl: 'https://mtseymour.ca/summer/summer-camps',
  season: 'Summer 2026',
};

let added = 0;

const camps = [
  // Sea to Sky — Ages 7-9
  {
    id: 'oa-s2s-7-9-jul6',
    name: 'Ocean Ambassadors Sea to Sky Camp Ages 7-9 (Jul 6-10)',
    ageMin: 7, ageMax: 9,
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon-Fri',
    neighbourhood: 'Mt Seymour / Deep Cove',
    address: 'Mt Seymour & Whey-ah-Wichen/Cates Park, North Vancouver, BC',
    addressNote: 'Ages 7-9: Mon-Wed at Mt Seymour (1700 Mt Seymour Rd), Thu-Fri at Cates Park/Whey-ah-Wichen (4141 Dollarton Hwy). Locations alternate by age group.',
    costNote: '$399/week. Ages 7-9. 9am-4pm. Partnership: Mt Seymour + Ocean Ambassadors Canada + Cates Park Paddling Centre. Mon-Wed: forest activities at Mt Seymour. Thu-Fri: paddleboarding/kayaking + marine ecology at Cates Park. Shuttle bus available ($70-75/wk). Register at mtseymour.ca. Phone: 604-312-6023.',
    description: 'Sea to Sky Camp for ages 7-9. Partnership between Mt Seymour, Ocean Ambassadors Canada, and Cates Park Paddling Centre. 3 days of mountain hiking, forest exploration, and Junior Ecologist activities at Mt Seymour. 2 days of paddleboarding/kayaking and marine ecology at Whey-ah-Wichen/Cates Park. 9am-4pm.',
  },
  {
    id: 'oa-s2s-7-9-jul13',
    name: 'Ocean Ambassadors Sea to Sky Camp Ages 7-9 (Jul 13-17)',
    ageMin: 7, ageMax: 9,
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon-Fri',
    neighbourhood: 'Mt Seymour / Deep Cove',
    address: 'Mt Seymour & Whey-ah-Wichen/Cates Park, North Vancouver, BC',
    addressNote: 'Ages 7-9: Mon-Wed at Mt Seymour, Thu-Fri at Cates Park/Whey-ah-Wichen',
    costNote: '$399/week. Ages 7-9. 9am-4pm. Mt Seymour + Ocean Ambassadors + Cates Park Paddling. Shuttle bus available. Register at mtseymour.ca. Phone: 604-312-6023.',
    description: 'Sea to Sky Camp for ages 7-9. Mountain + ocean adventure camp. 3 days at Mt Seymour, 2 days paddleboarding/kayaking at Cates Park. 9am-4pm.',
  },
  {
    id: 'oa-s2s-7-9-jul20',
    name: 'Ocean Ambassadors Sea to Sky Camp Ages 7-9 (Jul 20-24)',
    ageMin: 7, ageMax: 9,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon-Fri',
    neighbourhood: 'Mt Seymour / Deep Cove',
    address: 'Mt Seymour & Whey-ah-Wichen/Cates Park, North Vancouver, BC',
    addressNote: 'Ages 7-9: Mon-Wed at Mt Seymour, Thu-Fri at Cates Park/Whey-ah-Wichen',
    costNote: '$399/week. Ages 7-9. 9am-4pm. Mt Seymour + Ocean Ambassadors + Cates Park Paddling. Shuttle bus available. Register at mtseymour.ca. Phone: 604-312-6023.',
    description: 'Sea to Sky Camp for ages 7-9. Mountain + ocean adventure camp. 3 days at Mt Seymour, 2 days paddleboarding/kayaking at Cates Park. 9am-4pm.',
  },

  // Sea to Sky — Ages 10-12
  {
    id: 'oa-s2s-10-12-jul6',
    name: 'Ocean Ambassadors Sea to Sky Camp Ages 10-12 (Jul 6-10)',
    ageMin: 10, ageMax: 12,
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon-Fri',
    neighbourhood: 'Mt Seymour / Deep Cove',
    address: 'Mt Seymour & Whey-ah-Wichen/Cates Park, North Vancouver, BC',
    addressNote: 'Ages 10-12: Mon-Wed at Cates Park/Whey-ah-Wichen (4141 Dollarton Hwy), Thu-Fri at Mt Seymour (1700 Mt Seymour Rd). Locations alternate by age group.',
    costNote: '$399/week. Ages 10-12. 9am-4pm. Partnership: Mt Seymour + Ocean Ambassadors Canada + Cates Park Paddling Centre. Mon-Wed: paddleboarding/kayaking + marine ecology at Cates Park. Thu-Fri: forest activities at Mt Seymour. Shuttle bus available ($70-75/wk). Register at mtseymour.ca. Phone: 604-312-6023.',
    description: 'Sea to Sky Camp for ages 10-12. Partnership between Mt Seymour, Ocean Ambassadors Canada, and Cates Park Paddling Centre. 3 days of paddleboarding/kayaking and marine ecology at Cates Park. 2 days of mountain activities at Mt Seymour. 9am-4pm.',
  },
  {
    id: 'oa-s2s-10-12-jul13',
    name: 'Ocean Ambassadors Sea to Sky Camp Ages 10-12 (Jul 13-17)',
    ageMin: 10, ageMax: 12,
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon-Fri',
    neighbourhood: 'Mt Seymour / Deep Cove',
    address: 'Mt Seymour & Whey-ah-Wichen/Cates Park, North Vancouver, BC',
    addressNote: 'Ages 10-12: Mon-Wed at Cates Park, Thu-Fri at Mt Seymour',
    costNote: '$399/week. Ages 10-12. 9am-4pm. Mt Seymour + Ocean Ambassadors + Cates Park Paddling. Shuttle bus available. Register at mtseymour.ca. Phone: 604-312-6023.',
    description: 'Sea to Sky Camp for ages 10-12. Mountain + ocean adventure camp. 3 days paddleboarding/kayaking at Cates Park, 2 days at Mt Seymour. 9am-4pm.',
  },
  {
    id: 'oa-s2s-10-12-jul20',
    name: 'Ocean Ambassadors Sea to Sky Camp Ages 10-12 (Jul 20-24)',
    ageMin: 10, ageMax: 12,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon-Fri',
    neighbourhood: 'Mt Seymour / Deep Cove',
    address: 'Mt Seymour & Whey-ah-Wichen/Cates Park, North Vancouver, BC',
    addressNote: 'Ages 10-12: Mon-Wed at Cates Park, Thu-Fri at Mt Seymour',
    costNote: '$399/week. Ages 10-12. 9am-4pm. Mt Seymour + Ocean Ambassadors + Cates Park Paddling. Shuttle bus available. Register at mtseymour.ca. Phone: 604-312-6023.',
    description: 'Sea to Sky Camp for ages 10-12. Mountain + ocean adventure camp. 3 days paddleboarding/kayaking at Cates Park, 2 days at Mt Seymour. 9am-4pm.',
  },

  // Leadership Camp for Young Women
  {
    id: 'oa-leadership-jun29',
    name: 'Ocean Ambassadors Leadership Camp for Young Women (Jun 29-Jul 2)',
    ageMin: 13, ageMax: 15,
    startDate: '2026-06-29', endDate: '2026-07-02',
    days: 'Mon-Thu',
    neighbourhood: 'Deep Cove',
    address: 'Whey-ah-Wichen/Cates Park & Twin Islands, North Vancouver, BC',
    addressNote: 'Day 1: Cates Park/Whey-ah-Wichen (4141 Dollarton Hwy). Days 2-4: paddle camping at Twin Islands/Say Nuth Khaw Yum Park. Depart/return from Panorama Park, Deep Cove.',
    registrationUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfkpJ3GKq_N9_dpkUqUhRQWJ63SCr14XaztG2UOpKFl5VXt_w/viewform',
    cost: 439,
    costNote: '$439/person. Ages 13-15. 4-day leadership camp. Max 12 participants. Day 1: paddleboarding at Cates Park. Days 2-4: paddle camping trip to Twin Islands (3 days, 2 nights). Leadership skills, marine ecology, ocean conservation. Email: admin@oceanambassadorscanada.org. Phone: 604-312-6023.',
    description: 'Leadership Camp for Young Women at Ocean Ambassadors Canada. Ages 13-15. 4-day adventure: Day 1 paddleboarding at Cates Park, then 3-day/2-night paddle camping trip to Twin Islands. Leadership skills, marine ecology, ocean conservation, snorkeling, hiking. Max 12 participants.',
    tags: ['leadership', 'ocean', 'paddleboarding', 'camping', 'summer camp', 'girls'],
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    startTime: null,
    endTime: null,
    season: 'Summer 2026',
  },
];

for (const camp of camps) {
  filtered.push({ ...seaToSkyBase, ...camp });
  added++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(filtered, null, 2) + '\n');
console.log(`Ocean Ambassadors re-audit: ${removed} removed, ${added} added`);
console.log(`Total programs: ${filtered.length}`);
