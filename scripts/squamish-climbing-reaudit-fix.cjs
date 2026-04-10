/**
 * Squamish Climbing Academy Re-Audit Fix — 2026-04-09
 * Rank 243 in audit queue — RE-AUDIT via Chrome browser
 *
 * Browser-verified against:
 * - https://www.squamishclimbingacademy.com/camps (full camps page with pricing)
 *
 * Key findings:
 * - Site loads fine in Chrome (was timing out on WebFetch)
 * - 5 distinct programs with specific dates and pricing
 * - PD-Day: $149 (1 day), 3-Day: $349, 5-Day: $549, 7-Day: $799, 11-Day: $1049
 * - Junior (7-12) and Senior (12-18) options for 3-day and 5-day
 * - 7-day and 11-day are ages 12-18 only
 * - 6:1 camper-to-guide ratio, ACMG certified, all equipment included
 * - Overnight option at Adventure Inn for ages 12-18
 * - Community volunteering with Squamish Access Society
 * - Phone: +1 778 266 9541
 * - Location: Squamish, BC (outdoor granite climbing)
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// Remove old generic placeholders
const oldIds = [441, 442, 443, 444, 445, 446];
const filtered = programs.filter(p => !oldIds.includes(Number(p.id)));
const removed = programs.length - filtered.length;

const base = {
  provider: 'Squamish Climbing Academy',
  category: 'Sports',
  indoorOutdoor: 'Outdoor',
  neighbourhood: 'Squamish',
  address: 'Squamish, BC',
  city: 'Squamish',
  registrationUrl: 'https://www.squamishclimbingacademy.com/camps',
  urlVerified: true,
  confirmed2026: true,
  priceVerified: true,
  enrollmentStatus: 'Open',
  status: 'Open',
  activityType: 'Rock Climbing',
  tags: ['rock climbing', 'outdoor adventure', 'summer camp', 'Squamish'],
};

let added = 0;

const camps = [
  // PD-Day
  {
    id: 'sca-pd-day-may8',
    name: 'Squamish Climbing Academy PD-Day Intro to Climbing Camp (May 8)',
    campType: 'Pro-D Day Camp',
    scheduleType: 'Full Day',
    ageMin: 7, ageMax: 18,
    startDate: '2026-05-08', endDate: '2026-05-08',
    days: 'Friday',
    cost: 149,
    costNote: '$149/day. Full day outdoor rock climbing on PD day. Ages 7-18. Same program as Day 1 of 3-Day Camp. 6:1 camper-to-guide ratio. ACMG certified guides. All equipment included. Phone: 778-266-9541.',
    description: 'PD-Day Intro to Climbing Camp at Squamish Climbing Academy. Ages 7-18. Full day of outdoor rock climbing on real Squamish granite. Intro to climbing fundamentals, knot tying, belay techniques, outdoor safety. 6:1 ratio. All equipment included.',
    season: 'Spring 2026',
  },
  // 3-Day Camp — Spring Break (COMPLETED)
  {
    id: 'sca-3day-mar23',
    name: 'Squamish Climbing Academy 3-Day Camp (Mar 23-25)',
    campType: 'Spring Break Camp',
    scheduleType: 'Full Day',
    ageMin: 7, ageMax: 18,
    startDate: '2026-03-23', endDate: '2026-03-25',
    days: 'Mon-Wed',
    cost: 349,
    enrollmentStatus: 'Completed', status: 'Completed',
    costNote: '$349 for 3 days. Junior (7-12) and Senior (12-18) options. 6:1 ratio. All equipment included.',
    description: '3-Day introductory climbing camp at Squamish Climbing Academy. Top-rope basics, climbing technique, outdoor safety, knot tying, belay techniques. 6:1 camper-to-guide ratio. ACMG certified guides. All equipment included.',
    season: 'Spring 2026',
  },
  // 3-Day Camp — May
  {
    id: 'sca-3day-may16',
    name: 'Squamish Climbing Academy 3-Day Camp (May 16-18)',
    campType: 'Specialty',
    scheduleType: 'Full Day',
    ageMin: 7, ageMax: 18,
    startDate: '2026-05-16', endDate: '2026-05-18',
    days: 'Sat-Mon',
    cost: 349,
    costNote: '$349 for 3 days. Junior (7-12) and Senior (12-18) options. 6:1 ratio. All equipment included. Phone: 778-266-9541.',
    description: '3-Day introductory climbing camp at Squamish Climbing Academy. Top-rope basics, climbing technique, outdoor safety, knot tying, belay techniques. 6:1 camper-to-guide ratio. ACMG certified guides. All equipment included.',
    season: 'Spring 2026',
  },
  // 3-Day Camp — Summer
  {
    id: 'sca-3day-jun29',
    name: 'Squamish Climbing Academy 3-Day Camp (Jun 29-Jul 1)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 7, ageMax: 18,
    startDate: '2026-06-29', endDate: '2026-07-01',
    days: 'Mon-Wed',
    cost: 349,
    costNote: '$349 for 3 days. Junior (7-12) and Senior (12-18) options. 6:1 ratio. All equipment included. Phone: 778-266-9541.',
    description: '3-Day introductory climbing camp at Squamish Climbing Academy. Top-rope basics, climbing technique, outdoor safety, knot tying, belay techniques. 6:1 camper-to-guide ratio. ACMG certified guides. All equipment included.',
    season: 'Summer 2026',
  },
  // 5-Day Camp — Spring Break (COMPLETED)
  {
    id: 'sca-5day-mar23',
    name: 'Squamish Climbing Academy 5-Day Camp (Mar 23-27)',
    campType: 'Spring Break Camp',
    scheduleType: 'Full Day',
    ageMin: 7, ageMax: 18,
    startDate: '2026-03-23', endDate: '2026-03-27',
    days: 'Mon-Fri',
    cost: 549,
    enrollmentStatus: 'Completed', status: 'Completed',
    costNote: '$549 for 5 days. Junior (7-12) and Senior (12-18) options. 6:1 ratio. Multi-pitch introduction. Peak experience included. All equipment included.',
    description: '5-Day immersive climbing camp at Squamish Climbing Academy. Progressive skill development, multi-pitch introduction, climbing technique workshops. Culminates in a personalized peak experience. 6:1 ratio. ACMG certified guides.',
    season: 'Spring 2026',
  },
  // 5-Day Camp — Summer
  {
    id: 'sca-5day-jun29',
    name: 'Squamish Climbing Academy 5-Day Camp (Jun 29-Jul 3)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 7, ageMax: 18,
    startDate: '2026-06-29', endDate: '2026-07-03',
    days: 'Mon-Fri',
    cost: 549,
    costNote: '$549 for 5 days. Junior (7-12) and Senior (12-18) options. 6:1 ratio. Multi-pitch introduction. Peak experience included. All equipment included. Phone: 778-266-9541.',
    description: '5-Day immersive climbing camp at Squamish Climbing Academy. Progressive skill development, multi-pitch introduction, climbing technique workshops. Culminates in a personalized peak experience. 6:1 ratio. ACMG certified guides.',
    season: 'Summer 2026',
  },
  // 7-Day Camp — Summer (Ages 12-18)
  {
    id: 'sca-7day-aug8',
    name: 'Squamish Climbing Academy 7-Day Camp (Aug 8-14)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 12, ageMax: 18,
    startDate: '2026-08-08', endDate: '2026-08-14',
    days: 'Sat-Fri',
    cost: 799,
    costNote: '$799 for 7 days. Ages 12-18. Advanced multi-pitch climbing, trad climbing introduction, guided climb on The Chief. Day camp or overnight at Adventure Inn. 6:1 ratio. All equipment included. Phone: 778-266-9541.',
    description: '7-Day comprehensive climbing camp at Squamish Climbing Academy. Ages 12-18. Advanced multi-pitch climbing, trad climbing introduction, route reading and planning. Guided climb on The Chief. Day or overnight option at Adventure Inn. 6:1 ratio. ACMG certified guides.',
    season: 'Summer 2026',
  },
  // 11-Day Camp — Summer (Ages 12-18)
  {
    id: 'sca-11day-jul20',
    name: 'Squamish Climbing Academy 11-Day Camp (Jul 20-30)',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 12, ageMax: 18,
    startDate: '2026-07-20', endDate: '2026-07-30',
    days: 'Mon-Thu',
    cost: 1049,
    costNote: '$1049 for 11 days. Ages 12-18. Crack climbing, sport & trad progression, rock rescue, multi-pitch skills. Day camp or overnight at Adventure Inn. 6:1 ratio. All equipment included. Phone: 778-266-9541.',
    description: '11-Day flagship climbing camp at Squamish Climbing Academy. Ages 12-18. Master advanced skills: crack climbing, sport & trad climbing progression, rock rescue training, multi-pitch techniques. Peak experience guided climb. Day or overnight at Adventure Inn. 6:1 ratio. ACMG certified guides.',
    season: 'Summer 2026',
  },
];

for (const camp of camps) {
  filtered.push({
    ...base,
    ...camp,
    ageSpanJustified: camp.ageMax - camp.ageMin > 6
      ? 'Provider offers Junior (7-12) and Senior (12-18) as options within the same booking — single price, campers grouped by age/skill internally'
      : undefined,
  });
  added++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(filtered, null, 2) + '\n');
console.log(`Squamish Climbing re-audit: ${removed} removed, ${added} added`);
console.log(`Total programs: ${filtered.length}`);
