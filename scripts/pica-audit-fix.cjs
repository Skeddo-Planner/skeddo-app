/**
 * Pacific Institute of Culinary Arts (PICA) Audit Fix — 2026-04-09
 * Rank 255 in audit queue — via Chrome browser
 *
 * Browser-verified against:
 * - https://www.picachef.com/teen-camps — camp listing page
 * - https://www.tickettailor.com/events/pacificinstituteofculinaryarts/2104670 — Jul 6 booking (pricing)
 * - https://www.tickettailor.com/events/pacificinstituteofculinaryarts/2104691 — Aug 31 booking (pricing)
 *
 * Key findings:
 * - 101-1505 West 2nd Avenue, Vancouver, BC V6H 3Y4
 * - Phone: 604-734-4488 | Toll free: 1-800-416-4040
 * - 9 weekly summer cooking camps, ages 10-16
 * - $649 + GST per week, 9am-1pm Mon-Fri
 * - All NEW 2026 recipes, same curriculum each week
 * - Includes apron ($25 value) to take home
 * - Booking via TicketTailor
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// Find and remove old generic entries for PICA
const filtered = programs.filter(p => {
  const name = (p.provider || '').toLowerCase();
  const pName = (p.name || '').toLowerCase();
  return !(name.includes('pacific institute of culinary') || pName.includes('pacific institute of culinary'));
});
const removed = programs.length - filtered.length;

const base = {
  provider: 'Pacific Institute of Culinary Arts',
  category: 'Cooking',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Kitsilano',
  address: '101-1505 West 2nd Avenue, Vancouver, BC V6H 3Y4',
  city: 'Vancouver',
  urlVerified: true,
  confirmed2026: true,
  priceVerified: true,
  activityType: 'Cooking Camp',
  tags: ['summer camp', 'cooking', 'culinary', 'baking', 'hands-on'],
  season: 'Summer 2026',
  days: 'Mon-Fri',
  campType: 'Summer Camp',
  scheduleType: 'Half Day',
  ageMin: 10,
  ageMax: 16,
  cost: 649,
  ageSpanJustified: true,
};

const weeks = [
  { start: '2026-07-06', end: '2026-07-10', ttId: '2104670' },
  { start: '2026-07-13', end: '2026-07-17', ttId: '2104678' },
  { start: '2026-07-20', end: '2026-07-24', ttId: '2104679' },
  { start: '2026-07-27', end: '2026-07-31', ttId: '2104683' },
  { start: '2026-08-04', end: '2026-08-08', ttId: '2104684' },
  { start: '2026-08-10', end: '2026-08-14', ttId: '2104685' },
  { start: '2026-08-17', end: '2026-08-21', ttId: '2104689' },
  { start: '2026-08-24', end: '2026-08-28', ttId: '2104690' },
  { start: '2026-08-31', end: '2026-09-04', ttId: '2104691' },
];

let added = 0;

for (const w of weeks) {
  const dateLabel = `${w.start.slice(5).replace('-', '/')}-${w.end.slice(5).replace('-', '/')}`;
  filtered.push({
    ...base,
    id: `pica-camp-${w.start}`,
    name: `PICA Summer Cooking Camp (${dateLabel})`,
    startDate: w.start,
    endDate: w.end,
    startTime: '09:00',
    endTime: '13:00',
    enrollmentStatus: 'Open',
    status: 'Open',
    registrationUrl: `https://www.tickettailor.com/events/pacificinstituteofculinaryarts/${w.ttId}`,
    costNote: `$649 + GST per week. Ages 10-16. 9am-1pm Mon-Fri. Hands-on cooking & baking with professional chef-instructors. All 2026 recipes. Includes apron ($25 value). Work in pairs. Closed-toe non-slip shoes required. May cancel if insufficient enrollment (full refund). Phone: 604-734-4488.`,
    description: `Summer Cooking Camp at Pacific Institute of Culinary Arts (PICA). Ages 10-16. Week-long hands-on cooking and baking camp. Curriculum: knife skills, Mexican fiesta, pasta, baking, Asian cuisine, world foods. Includes apron to take home. Professional chef-instructors.`,
  });
  added++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(filtered, null, 2) + '\n');
console.log(`PICA audit: ${removed} removed, ${added} added`);
console.log(`Total programs: ${filtered.length}`);
