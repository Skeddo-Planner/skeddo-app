/**
 * Deep Cove Music Audit Fix — 2026-04-09
 * Rank 222 in audit queue
 *
 * Browser-verified against:
 * - https://www.deepcovemusic.com/summer-camps
 * - https://www.deepcovemusic.com/summer-arts-day-camp
 * - https://www.deepcovemusic.com/jam-camp-101
 *
 * Key changes:
 * - Corrected name to "Summer Arts Day Camp" (from generic "Music & Arts Camp")
 * - Added 4 August weeks (DB only had July)
 * - Added BandFactory Jam Camp 101 (ages 7-12, $450/$360, 9am-3pm)
 * - Added BandFactory Jam Camp 201 (ages 10-18, $450/$360, 9am-3pm)
 * - Updated registration URLs to specific camp pages
 * - Added postal code V7G 1S3
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;
let added = 0;

const commonFields = {
  provider: 'Deep Cove Music',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Deep Cove',
  address: '1046 Deep Cove Rd, North Vancouver, BC V7G 1S3',
  postalCode: 'V7G 1S3',
  lat: 49.3288,
  lng: -122.9491,
  city: 'North Vancouver',
  enrollmentStatus: 'Open',
  priceVerified: true,
  confirmed2026: true,
  season: 'Summer 2026',
  days: 'Mon-Fri',
  tags: ['music', 'arts', 'performing arts', 'summer camp', 'Deep Cove']
};

// Fix existing 4 entries (IDs 123-126)
for (const p of programs) {
  if (p.provider !== 'Deep Cove Music') continue;
  if (![123, 124, 125, 126].includes(Number(p.id))) continue;

  p.name = 'Summer Arts Day Camp';
  p.address = commonFields.address;
  p.postalCode = commonFields.postalCode;
  p.registrationUrl = 'https://www.deepcovemusic.com/summer-arts-day-camp';
  p.activityType = 'Performing Arts';
  p.description = 'Music, acting and filmmaking day camp at Deep Cove Music. Ages 6-12. Campers create a short film, including improv games, script writing, music soundtracks, props/costumes, filming, and editing. Friday premiere for family. 9am-4pm (drop off 8:30am, pickup by 4:30pm). No experience needed.';
  p.costNote = '$350 per 5-day week, $280 for 4-day week (Week 5: Aug 4-7). Ages 13+ may inquire. GST applies for ages 15+.';
  p.ageSpanJustified = 'Provider runs single camp for ages 6-12 with no sub-groupings by age.';
  delete p.urlVerified;
  corrected++;
}

// Add August weeks for Summer Arts Day Camp
const artsCampWeeks = [
  { id: 'dcm-arts-5', startDate: '2026-08-04', endDate: '2026-08-07', cost: 280, note: '4-day week' },
  { id: 'dcm-arts-6', startDate: '2026-08-10', endDate: '2026-08-14', cost: 350, note: '5-day week' },
  { id: 'dcm-arts-7', startDate: '2026-08-17', endDate: '2026-08-21', cost: 350, note: '5-day week' },
  { id: 'dcm-arts-8', startDate: '2026-08-24', endDate: '2026-08-28', cost: 350, note: '5-day week' }
];

// Add BandFactory Jam Camp 101 (1 entry covering all 8 weeks)
const jamCamp101 = {
  id: 'dcm-jamcamp-101',
  name: 'BandFactory Jam Camp 101',
  ...commonFields,
  category: 'Music',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  ageMin: 7,
  ageMax: 12,
  startDate: '2026-07-06',
  endDate: '2026-08-28',
  startTime: '9:00 AM',
  endTime: '3:00 PM',
  cost: 450,
  costNote: '$450 per 5-day week, $360 for 4-day week (Week 5: Aug 4-7). Any week can be 101 or 201 depending on interest. Instruments provided.',
  activityType: 'Music',
  registrationUrl: 'https://www.deepcovemusic.com/jam-camp-101',
  description: 'Rock band camp for beginners to intermediate players ages 7-12 at Deep Cove Music. No experience needed. Learn instruments through musical games, activities, and songs from classic rock to modern hits. All instruments provided. 9am-3pm (drop off 8:40am, pickup by 3:30pm). Friday concert for family at 2pm. 8 weekly sessions Jul-Aug.',
  repeating: true,
  ageSpanJustified: 'Provider runs single camp for ages 7-12 with no sub-groupings by age.'
};

// Add BandFactory Jam Camp 201
const jamCamp201 = {
  id: 'dcm-jamcamp-201',
  name: 'BandFactory Jam Camp 201',
  ...commonFields,
  category: 'Music',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
  ageMin: 10,
  ageMax: 18,
  startDate: '2026-07-06',
  endDate: '2026-08-28',
  startTime: '9:00 AM',
  endTime: '3:00 PM',
  cost: 450,
  costNote: '$450 per 5-day week, $360 for 4-day week (Week 5: Aug 4-7). Any week can be 101 or 201 depending on interest. Instruments provided. GST applies for ages 15+.',
  activityType: 'Music',
  registrationUrl: 'https://www.deepcovemusic.com/jam-camp-201',
  description: 'Advanced rock band camp for experienced players ages 10-18 at Deep Cove Music. Collaborate with bandmates, pick songs to learn, jam and perform. Write original songs. Great for students with previous instruction. 9am-3pm. Friday concert. 8 weekly sessions Jul-Aug.',
  repeating: true,
  ageSpanJustified: 'Provider runs single camp for ages 10-18 with no sub-groupings by age — skill level placement, not age-based.'
};

// Insert new entries after last Deep Cove Music entry
const lastDCMIdx = programs.reduce((acc, p, i) =>
  p.provider === 'Deep Cove Music' ? i : acc, -1);

if (lastDCMIdx >= 0) {
  const newEntries = [];

  // Add August arts camp weeks
  for (const week of artsCampWeeks) {
    newEntries.push({
      id: week.id,
      name: 'Summer Arts Day Camp',
      ...commonFields,
      category: 'Music',
      campType: 'Summer Camp',
      scheduleType: 'Full Day',
      ageMin: 6,
      ageMax: 12,
      startDate: week.startDate,
      endDate: week.endDate,
      startTime: '9:00 AM',
      endTime: '4:00 PM',
      cost: week.cost,
      costNote: `$${week.cost} (${week.note}). Ages 13+ may inquire. GST applies for ages 15+.`,
      activityType: 'Performing Arts',
      registrationUrl: 'https://www.deepcovemusic.com/summer-arts-day-camp',
      description: 'Music, acting and filmmaking day camp at Deep Cove Music. Ages 6-12. Campers create a short film, including improv games, script writing, music soundtracks, props/costumes, filming, and editing. Friday premiere for family. 9am-4pm (drop off 8:30am, pickup by 4:30pm). No experience needed.',
      ageSpanJustified: 'Provider runs single camp for ages 6-12 with no sub-groupings by age.'
    });
    added++;
  }

  // Add jam camps
  newEntries.push(jamCamp101);
  added++;
  newEntries.push(jamCamp201);
  added++;

  programs.splice(lastDCMIdx + 1, 0, ...newEntries);
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Deep Cove Music: ${corrected} corrected, ${added} added`);
console.log(`Total programs: ${programs.length}`);
