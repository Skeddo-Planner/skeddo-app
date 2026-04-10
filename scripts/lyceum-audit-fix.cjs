/**
 * Christianne's Lyceum Audit Fix — 2026-04-09
 * Rank 214 in audit queue
 *
 * Browser-verified against:
 *   https://www.christianneslyceum.com/elementary-summer-programs
 *   https://www.christianneslyceum.com/summer-programs (main page)
 *
 * DB had 4 generic entries (621-624) with wrong cost ($656, no program on page costs that),
 * wrong ages (5-18 generic, actual programs range 5-9, 5-12, 8-12), wrong times.
 * Provider offers 15 unique school-aged programs with varying schedules and prices.
 * Also offers Preschool (3-5) and Preteen/Teen (10-18) — noted for future audit.
 *
 * 4 existing corrected → mapped to specific programs.
 * 11 new school-aged programs added.
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

const BASE_URL = 'https://www.christianneslyceum.com/elementary-summer-programs';

const COMMON = {
  provider: "Christianne's Lyceum",
  category: 'Arts',
  campType: 'Summer Camp',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'West Point Grey',
  address: '4433 West 10th Avenue, Vancouver, BC V6R 2H8',
  lat: 49.2625,
  lng: -123.206,
  city: 'Vancouver',
  tags: ['reading', 'writing', 'art', 'creative', 'literature'],
  source: 'christianneslyceum.com',
  season: 'Summer 2026',
  confirmed2026: true,
  priceVerified: true,
  urlVerified: true,
  enrollmentStatus: 'Open',
  registrationUrl: BASE_URL,
  status: 'Open',
};

// All 15 school-aged programs from the elementary page
const PROGRAMS = [
  {
    id: 'lyceum-sculpey',
    name: 'A Whole Day with Sculpey',
    ages: [5, 12], startDate: '2026-06-29', endDate: '2026-06-29',
    startTime: '9:00 AM', endTime: '4:30 PM', cost: 156, days: 'Sun',
    schedule: 'Full Day', duration: 7.5, desc: '1 full day',
  },
  {
    id: 'lyceum-paint-outdoors',
    name: 'A Day to Paint Outdoors',
    ages: [5, 12], startDate: '2026-07-03', endDate: '2026-07-03',
    startTime: '9:00 AM', endTime: '4:30 PM', cost: 156, days: 'Fri',
    schedule: 'Full Day', duration: 7.5, desc: '1 full day',
  },
  {
    id: 621, // existing
    name: 'Invasive Species Good, Bad or Inevitable?',
    ages: [5, 12], startDate: '2026-07-06', endDate: '2026-07-10',
    startTime: '1:30 PM', endTime: '4:30 PM', cost: 312, days: 'Mon-Fri',
    schedule: 'Half Day (PM)', duration: 3, desc: '5 afternoons',
  },
  {
    id: 622, // existing
    name: 'Moving Parts: Driving from Above',
    ages: [5, 9], startDate: '2026-07-13', endDate: '2026-07-17',
    startTime: '9:00 AM', endTime: '12:00 PM', cost: 312, days: 'Mon-Fri',
    schedule: 'Half Day (AM)', duration: 3, desc: '5 mornings',
  },
  {
    id: 'lyceum-treasure',
    name: 'Treasure Hunting with Joshua',
    ages: [5, 9], startDate: '2026-07-13', endDate: '2026-07-17',
    startTime: '1:30 PM', endTime: '4:30 PM', cost: 312, days: 'Mon-Fri',
    schedule: 'Half Day (PM)', duration: 3, desc: '5 afternoons',
  },
  {
    id: 623, // existing
    name: 'Getting to Know the Lyceum Fae',
    ages: [5, 12], startDate: '2026-07-20', endDate: '2026-07-24',
    startTime: '9:00 AM', endTime: '4:30 PM', cost: 780, days: 'Mon-Fri',
    schedule: 'Full Day', duration: 7.5, desc: '5 full days',
  },
  {
    id: 'lyceum-midnight-fae',
    name: 'Midnight Nibbles with the Fae',
    ages: [8, 12], startDate: '2026-07-25', endDate: '2026-07-26',
    startTime: '6:00 PM', endTime: '11:00 AM', cost: 167, days: 'Sat-Sun',
    schedule: 'Overnight', duration: 17, desc: 'overnight event',
    indoorOutdoor: 'Both',
  },
  {
    id: 624, // existing
    name: 'Little Acts, Lasting Roots',
    ages: [5, 12], startDate: '2026-07-27', endDate: '2026-07-31',
    startTime: '9:00 AM', endTime: '12:00 PM', cost: 312, days: 'Mon-Fri',
    schedule: 'Half Day (AM)', duration: 3, desc: '5 mornings',
  },
  {
    id: 'lyceum-coordinators',
    name: 'The Secret Coordinators Club',
    ages: [8, 12], startDate: '2026-07-27', endDate: '2026-07-31',
    startTime: '1:30 PM', endTime: '4:30 PM', cost: 312, days: 'Mon-Fri',
    schedule: 'Half Day (PM)', duration: 3, desc: '5 afternoons',
  },
  {
    id: 'lyceum-folk-art',
    name: 'Folk and Art Lore from Around the World',
    ages: [5, 12], startDate: '2026-08-04', endDate: '2026-08-07',
    startTime: '1:30 PM', endTime: '4:30 PM', cost: 250, days: 'Mon-Thu',
    schedule: 'Half Day (PM)', duration: 3, desc: '4 afternoons',
  },
  {
    id: 'lyceum-harry-potter',
    name: 'Harry Potter: The Rag & Rune Bazaar',
    ages: [5, 12], startDate: '2026-08-10', endDate: '2026-08-14',
    startTime: '9:00 AM', endTime: '4:30 PM', cost: 780, days: 'Mon-Fri',
    schedule: 'Full Day', duration: 7.5, desc: '5 full days',
  },
  {
    id: 'lyceum-spiderwick',
    name: 'Spiderwick: Through the Seeing Stone',
    ages: [8, 12], startDate: '2026-08-17', endDate: '2026-08-21',
    startTime: '9:00 AM', endTime: '4:30 PM', cost: 780, days: 'Mon-Fri',
    schedule: 'Full Day', duration: 7.5, desc: '5 full days',
  },
  {
    id: 'lyceum-journaling',
    name: 'Journaling and Drawing Through the Neighbourhood',
    ages: [8, 12], startDate: '2026-08-24', endDate: '2026-08-28',
    startTime: '1:30 PM', endTime: '4:30 PM', cost: 312, days: 'Mon-Fri',
    schedule: 'Half Day (PM)', duration: 3, desc: '5 afternoons',
  },
  {
    id: 'lyceum-wordless',
    name: 'Hidden Worlds in Wordless Wonders',
    ages: [5, 12], startDate: '2026-08-31', endDate: '2026-09-03',
    startTime: '9:00 AM', endTime: '12:00 PM', cost: 250, days: 'Mon-Thu',
    schedule: 'Half Day (AM)', duration: 3, desc: '4 mornings',
  },
  {
    id: 'lyceum-rare-wonders',
    name: 'Collecting Rare Wonders',
    ages: [5, 12], startDate: '2026-08-31', endDate: '2026-09-03',
    startTime: '1:30 PM', endTime: '4:30 PM', cost: 250, days: 'Mon-Thu',
    schedule: 'Half Day (PM)', duration: 3, desc: '4 afternoons',
  },
];

let corrected = 0;
const existingIds = new Set([621, 622, 623, 624]);

for (const prog of PROGRAMS) {
  const isExisting = existingIds.has(prog.id);

  if (isExisting) {
    // Update existing entry
    const p = programs.find(x => Number(x.id) === prog.id);
    if (!p) continue;

    p.name = prog.name;
    p.ageMin = prog.ages[0];
    p.ageMax = prog.ages[1];
    p.startDate = prog.startDate;
    p.endDate = prog.endDate;
    p.startTime = prog.startTime;
    p.endTime = prog.endTime;
    p.cost = prog.cost;
    p.costNote = `$${prog.cost} + 5% GST. ${prog.desc}. Literature & art summer program.`;
    p.days = prog.days;
    p.scheduleType = prog.schedule;
    p.dayLength = prog.schedule.includes('Half') ? 'Half Day' : 'Full Day';
    p.durationPerDay = prog.duration;
    p.description = `"${prog.name}" — ${prog.desc} literature & art camp at Christianne's Lyceum. Ages ${prog.ages[0]}-${prog.ages[1]}. ${prog.startTime}-${prog.endTime}. $${prog.cost} + GST.`;
    p.activityType = 'Arts & Crafts';
    p.registrationUrl = BASE_URL;
    if (prog.ages[1] - prog.ages[0] > 6) {
      p.ageSpanJustified = `Provider lists this program as ages ${prog.ages[0]} to ${prog.ages[1]} with no sub-groupings.`;
    }
    if (p.isEstimate) delete p.isEstimate;
    corrected++;
  } else {
    // Add new entry
    const entry = {
      ...COMMON,
      id: prog.id,
      name: prog.name,
      ageMin: prog.ages[0],
      ageMax: prog.ages[1],
      startDate: prog.startDate,
      endDate: prog.endDate,
      startTime: prog.startTime,
      endTime: prog.endTime,
      cost: prog.cost,
      costNote: `$${prog.cost} + 5% GST. ${prog.desc}. Literature & art summer program.`,
      days: prog.days,
      scheduleType: prog.schedule,
      dayLength: prog.schedule.includes('Half') ? 'Half Day' : 'Full Day',
      durationPerDay: prog.duration,
      description: `"${prog.name}" — ${prog.desc} literature & art camp at Christianne's Lyceum. Ages ${prog.ages[0]}-${prog.ages[1]}. ${prog.startTime}-${prog.endTime}. $${prog.cost} + GST.`,
      activityType: 'Arts & Crafts',
    };
    if (prog.indoorOutdoor) entry.indoorOutdoor = prog.indoorOutdoor;
    if (prog.ages[1] - prog.ages[0] > 6) {
      entry.ageSpanJustified = `Provider lists this program as ages ${prog.ages[0]} to ${prog.ages[1]} with no sub-groupings.`;
    }
    programs.push(entry);
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Christianne's Lyceum: ${corrected} corrected, ${PROGRAMS.length - corrected} added`);
console.log(`Total programs: ${programs.length}`);
