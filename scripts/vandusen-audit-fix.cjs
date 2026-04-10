/**
 * VanDusen Botanical Garden Summer Camps Audit Fix — 2026-04-09
 * Rank 257 in audit queue — via Chrome browser
 *
 * Browser-verified against:
 * - https://app.amilia.com/store/en/vanduseneducation/shop/programs/129816
 *
 * Key findings:
 * - VanDusen Botanical Garden, 5251 Oak Street, Vancouver, BC V6M 4H1
 * - Run by Vancouver Botanical Gardens Association (VBGA)
 * - Contact: Natasha Friedmann, nfriedmann@vandusen.org, 604-257-8443
 * - 8 summer camp weeks (Jun 29 - Aug 21), 3 cohorts per week = 24 sessions
 * - Red Cohort (Ages 5-7) 8:40am-3:40pm
 * - Blue Cohort (Ages 7-10) 8:50am-3:50pm
 * - Yellow Cohort (Ages 5-7) 9:00am-4:00pm
 * - 5-day weeks: $425, 4-day weeks (W1, W6): $340
 * - VBGA Member 10% discount (code: MEMBER)
 * - After care available 3:45-5:00pm ($80/wk, $64/4-day wk)
 * - Outdoors rain or shine, group size up to 24
 * - Field trip to Queen Elizabeth Park + Bloedel Conservatory each week
 * - Must be 5+ AND completed Kindergarten
 * - Cancellation: 21 days notice, $15 admin fee
 * - Bursary available for financial need
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// Don't remove old Hadden Park/Van Dusen entries — they're different programs (Petit Architect)
// Just add the new VanDusen VBGA summer camps

const base = {
  provider: 'VanDusen Botanical Garden',
  category: 'Nature',
  indoorOutdoor: 'Outdoor',
  neighbourhood: 'Shaughnessy',
  address: '5251 Oak Street, Vancouver, BC V6M 4H1',
  city: 'Vancouver',
  registrationUrl: 'https://app.amilia.com/store/en/vanduseneducation/shop/programs/129816',
  urlVerified: true,
  confirmed2026: true,
  priceVerified: true,
  activityType: 'Nature Camp',
  tags: ['summer camp', 'nature', 'botanical garden', 'outdoor', 'crafts', 'science'],
  season: 'Summer 2026',
  days: 'Mon-Fri',
  campType: 'Summer Camp',
  scheduleType: 'Full Day',
};

const weeks = [
  { num: 1, start: '2026-06-29', end: '2026-07-03', cost: 340, fourDay: true,
    red: { theme: 'Aquatic Adventures', status: 'Open' },
    blue: { theme: 'Crafty Critters', status: 'Full' },
    yellow: { theme: 'Dirt to Dinner', status: 'Full' } },
  { num: 2, start: '2026-07-06', end: '2026-07-10', cost: 425, fourDay: false,
    red: { theme: 'Earthly Explorers', status: 'Open' },
    blue: { theme: 'Mini & Mighty', status: 'Open' },
    yellow: { theme: 'Sprouting Imagination', status: 'Open' } },
  { num: 3, start: '2026-07-13', end: '2026-07-17', cost: 425, fourDay: false,
    red: { theme: 'Strategizing Sustainability', status: 'Open' },
    blue: { theme: 'Things with Wings', status: 'Open' },
    yellow: { theme: 'Aquatic Adventures', status: 'Open' } },
  { num: 4, start: '2026-07-20', end: '2026-07-24', cost: 425, fourDay: false,
    red: { theme: 'Crafty Critters', status: 'Open' },
    blue: { theme: 'Dirt to Dinner', status: 'Open' },
    yellow: { theme: 'Earthly Explorers', status: 'Open' } },
  { num: 5, start: '2026-07-27', end: '2026-07-31', cost: 425, fourDay: false,
    red: { theme: 'Mini and Mighty', status: 'Open' },
    blue: { theme: 'Sprouting Imagination', status: 'Open' },
    yellow: { theme: 'Strategizing Sustainability', status: 'Open' } },
  { num: 6, start: '2026-08-04', end: '2026-08-07', cost: 340, fourDay: true,
    red: { theme: 'Things with Wings', status: 'Open' },
    blue: { theme: 'Aquatic Adventures', status: 'Open' },
    yellow: { theme: 'Crafty Critters', status: 'Open' } },
  { num: 7, start: '2026-08-10', end: '2026-08-14', cost: 425, fourDay: false,
    red: { theme: 'Dirt to Dinner', status: 'Full' },
    blue: { theme: 'Earthly Explorers', status: 'Full' },
    yellow: { theme: 'Mini & Mighty', status: 'Open' } },
  { num: 8, start: '2026-08-17', end: '2026-08-21', cost: 425, fourDay: false,
    red: { theme: 'Sprouting Imagination', status: 'Open' },
    blue: { theme: 'Strategizing Sustainability', status: 'Full' },
    yellow: { theme: 'Things with Wings', status: 'Open' } },
];

const cohorts = [
  { color: 'red', label: 'Red', ages: '5-7', ageMin: 5, ageMax: 7, startTime: '08:40', endTime: '15:40' },
  { color: 'blue', label: 'Blue', ages: '7-10', ageMin: 7, ageMax: 10, startTime: '08:50', endTime: '15:50' },
  { color: 'yellow', label: 'Yellow', ages: '5-7', ageMin: 5, ageMax: 7, startTime: '09:00', endTime: '16:00' },
];

let added = 0;

for (const week of weeks) {
  for (const cohort of cohorts) {
    const info = week[cohort.color];
    const dateLabel = `${week.start.slice(5).replace('-', '/')}-${week.end.slice(5).replace('-', '/')}`;
    const dayNote = week.fourDay ? '4-day week. ' : '';
    const enrollmentStatus = info.status === 'Full' ? 'Full/Waitlist' : 'Open';

    programs.push({
      ...base,
      id: `vd-w${week.num}-${cohort.color}`,
      name: `VanDusen Summer Camp W${week.num} — ${info.theme} (${cohort.label} Cohort, Ages ${cohort.ages}, ${dateLabel})`,
      ageMin: cohort.ageMin,
      ageMax: cohort.ageMax,
      startDate: week.start,
      endDate: week.end,
      startTime: cohort.startTime,
      endTime: cohort.endTime,
      cost: week.cost,
      enrollmentStatus: enrollmentStatus,
      status: enrollmentStatus,
      costNote: `$${week.cost}/week. ${dayNote}Ages ${cohort.ages}. ${cohort.label} Cohort (${cohort.startTime.replace(':','')} start). ${info.theme} theme. VBGA member 10% off (code: MEMBER). After care available 3:45-5pm ($${week.fourDay ? '64' : '80'}/wk). Must be 5+ and completed Kindergarten. Outdoors rain or shine, groups up to 24. Field trip to QE Park + Bloedel. Cancel 21 days notice, $15 fee. Bursary available. Contact: nfriedmann@vandusen.org | 604-257-8443.`,
      description: `VanDusen Botanical Garden Summer Camp — ${info.theme}. ${cohort.label} Cohort (Ages ${cohort.ages}). Week ${week.num}. Outdoor nature camp with crafts, games, science activities. Field trip to Queen Elizabeth Park and Bloedel Conservatory. Run by VBGA with professional camp leaders.`,
    });
    added++;
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`VanDusen Botanical Garden audit: 0 removed, ${added} added`);
console.log(`Total programs: ${programs.length}`);
