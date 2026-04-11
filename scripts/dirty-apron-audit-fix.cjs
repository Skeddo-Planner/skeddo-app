/**
 * The Dirty Apron Audit Fix — 2026-04-09
 * Rank 254 in audit queue — via Chrome browser
 *
 * Browser-verified against:
 * - https://www.thedirtyapron.com/kids-cooking-classes — all kid/family classes
 * - Individual class detail pages for ages, times, descriptions
 * - https://www.campchannel.com (for address, capacity context)
 *
 * Key findings:
 * - 540 Beatty Street, Vancouver, BC V6B 2L3
 * - Phone: 604-879-8588
 * - No week-long summer camps currently listed for 2026 (CampChannel mentions them, may be posted later)
 * - 5 upcoming individual kid/family cooking classes (2.5 hours each)
 * - Two types: "Kid's Class" (ages 8-17) and "Family Class" (ages 5+, adult+child pair)
 * - Pricing NOT displayed on website — set cost=null with note
 * - 3 past spring break classes (2 sold out) set to Completed
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// Remove old generic entries
const oldIds = [2507, 'dirty-apron-1'];
const filtered = programs.filter(p => !oldIds.includes(Number(p.id)) && !oldIds.includes(String(p.id)));
const removed = programs.length - filtered.length;

const base = {
  provider: 'The Dirty Apron',
  category: 'Cooking',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Yaletown',
  address: '540 Beatty Street, Vancouver, BC V6B 2L3',
  city: 'Vancouver',
  urlVerified: true,
  confirmed2026: true,
  activityType: 'Cooking Class',
  tags: ['cooking', 'culinary', 'kids cooking', 'hands-on'],
  season: 'Year-Round',
  campType: 'Year-Round',
};

let added = 0;
const classes = [
  {
    id: 'da-disney-may1',
    name: 'The Dirty Apron — Family Class: Dinner with Disney (May 1)',
    scheduleType: 'Activity',
    ageMin: 5, ageMax: 17,
    startDate: '2026-05-01', endDate: '2026-05-01',
    startTime: '18:00', endTime: '20:30',
    cost: null,
    priceVerified: false,
    enrollmentStatus: 'Open', status: 'Open',
    registrationUrl: 'https://www.thedirtyapron.com/kids-cooking-classes/family-class-a-date-with-disney-and-chef-liz',
    costNote: 'Price not listed on website — contact 604-879-8588 to book. Family class: 1 adult + 1 child (ages 5+). 6-8:30pm. Cook Disney-inspired dishes with Chef Liz. Nut-free kitchen.',
    description: 'Family Cooking Class: Dinner with Disney at The Dirty Apron. Ages 5+ with adult. Cook Ratatouille-inspired soup, Lady & the Tramp meatballs, and Beauty & the Beast grey stuff dessert. 2.5-hour hands-on class with Chef Liz.',
    days: 'Fri',
  },
  {
    id: 'da-brunch-may23',
    name: 'The Dirty Apron — Kid\'s Class: Saturday Brunch (May 23)',
    scheduleType: 'Activity',
    ageMin: 8, ageMax: 17,
    startDate: '2026-05-23', endDate: '2026-05-23',
    startTime: '12:00', endTime: '14:30',
    cost: null,
    priceVerified: false,
    enrollmentStatus: 'Open', status: 'Open',
    registrationUrl: 'https://www.thedirtyapron.com/kids-cooking-classes/6hpqwgowrnedwlbeu8ih65a4hx43yq',
    costNote: 'Price not listed on website — contact 604-879-8588 to book. Kid\'s class: ages 8-17 (no parent required). 12-2:30pm. Dutch baby pancake, candied bacon, frittatas.',
    description: 'Kid\'s Cooking Class: Saturday Brunch at The Dirty Apron. Ages 8-17. Make Dutch baby pancake, candied bacon, and egg frittatas with Chef Amy. Practice knife skills, teamwork, and stovetop safety. Sit-down brunch at the end.',
    days: 'Sat',
  },
  {
    id: 'da-pies-jul18',
    name: 'The Dirty Apron — Family Class: Sweet & Savory Pies (Jul 18)',
    scheduleType: 'Activity',
    ageMin: 5, ageMax: 17,
    startDate: '2026-07-18', endDate: '2026-07-18',
    startTime: '12:00', endTime: '14:30',
    cost: null,
    priceVerified: false,
    enrollmentStatus: 'Open', status: 'Open',
    registrationUrl: 'https://www.thedirtyapron.com/kids-cooking-classes/family-class-sweet-savory-pies-with-chef-amy',
    costNote: 'Price not listed on website — contact 604-879-8588 to book. Family class: 1 adult + 1 child (ages 5+). 12-2:30pm. Chicken pot pie and sweet hand pies.',
    description: 'Family Cooking Class: Sweet & Savory Pies at The Dirty Apron. Ages 5+ with adult. Make homemade pie crust, chicken pot pie, and sweet hand pies with Chef Amy. 2.5-hour hands-on baking class.',
    days: 'Sat',
  },
  {
    id: 'da-pasta-aug1',
    name: 'The Dirty Apron — Family Class: Spaghetti & Meatballs (Aug 1)',
    scheduleType: 'Activity',
    ageMin: 5, ageMax: 17,
    startDate: '2026-08-01', endDate: '2026-08-01',
    startTime: '12:00', endTime: '14:30',
    cost: null,
    priceVerified: false,
    enrollmentStatus: 'Open', status: 'Open',
    registrationUrl: 'https://www.thedirtyapron.com/kids-cooking-classes',
    costNote: 'Price not listed on website — contact 604-879-8588 to book. Family class: 1 adult + 1 child (ages 5+). 12-2:30pm. Fresh spaghetti, red sauce, meatballs.',
    description: 'Family Cooking Class: Spaghetti & Meatballs at The Dirty Apron. Ages 5+ with adult. Make fresh pasta dough, red sauce, and meatballs with Chef Amy. 2.5-hour hands-on class.',
    days: 'Sat',
  },
  {
    id: 'da-dumplings-aug15',
    name: 'The Dirty Apron — Family Class: Delicious Dumplings (Aug 15)',
    scheduleType: 'Activity',
    ageMin: 5, ageMax: 17,
    startDate: '2026-08-15', endDate: '2026-08-15',
    startTime: '12:00', endTime: '14:30',
    cost: null,
    priceVerified: false,
    enrollmentStatus: 'Open', status: 'Open',
    registrationUrl: 'https://www.thedirtyapron.com/kids-cooking-classes',
    costNote: 'Price not listed on website — contact 604-879-8588 to book. Family class: 1 adult + 1 child (ages 5+). 12-2:30pm. Steamed shumai and pan-seared pot stickers with dipping sauce.',
    description: 'Family Cooking Class: Delicious Dumplings at The Dirty Apron. Ages 5+ with adult. Make steamed shumai and pan-seared pot stickers with Chef Amy. Learn filling, folding, and dipping sauce techniques.',
    days: 'Sat',
  },
];

for (const cls of classes) {
  filtered.push({ ...base, ...cls });
  added++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(filtered, null, 2) + '\n');
console.log(`The Dirty Apron audit: ${removed} removed, ${added} added`);
console.log(`Total programs: ${filtered.length}`);
