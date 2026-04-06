#!/usr/bin/env node
// britannia-audit-update.cjs
// Adds 13 missing Funseekers Daycamp programs at Britannia CC (rank 75 audit)
// 6-7yr Wk 8-10 (3 programs) + 8-12yr Wk 1-10 (10 programs)
// Verified via browser nav + REST estimateprice API on 2026-04-06

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

// Vancouver display ID - 2922 = URL ID (confirmed)
// 6-7yr: display 616071-616080 → URL 613149-613158
// 8-12yr: display 616081-616090 → URL 613159-613168
// Existing in DB: COV-613149 to COV-613155 (6-7yr Wk 1-7)

const COMMON = {
  provider: 'City of Vancouver - Britannia Cmty Centre',
  category: 'Multi-Activity',
  activityType: 'Day Camp',
  address: '1661 Napier Street, Vancouver, BC',
  neighbourhood: 'Grandview-Woodland',
  lat: 49.2749646,
  lng: -123.0707081,
  startTime: '9:00 AM',
  endTime: '3:00 PM',
  durationPerDay: 6,
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  campType: 'Summer Camp',
  season: 'Summer 2026',
  enrollmentStatus: 'Open',
  confirmed2026: true,
  priceVerified: true,
  registrationDate: '2026-04-08',
  registrationDateLabel: 'Apr 8 at 7:00 PM',
  indoorOutdoor: 'Both',
  tags: ['camp'],
  city: 'Vancouver',
  description: 'There are many activities and out-trips planned for the Summer Break Funseekers program! Come on to learn new skills, meet new friends, or simply to have FUN! Learn arts and crafts, play group games, and more! Register early to avoid disappointment. Please provide lunch, snack, and water daily. Parents are required to complete consent forms. Funseekers Cancellation Policy: A $10 administration fee will be charged for each camp a refund is requested for. Refund requests must be made a minimum of one week (seven days) prior to the start of the program. No refunds after this time.',
};

const covUrl = (urlId) => `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/${urlId}`;

// Price verification summary:
// 6-7yr: Canada Day 4-day=$92, BC Day 4-day=$92, regular 5-day=$115
//   Exception: Wk 4 (Jul 20-24) = $110 (already in DB COV-613152, confirmed anomaly)
// 8-12yr: Canada Day 4-day=$92, BC Day 4-day=$92, regular 5-day=$115 (no anomalies)
// Verified via REST estimateprice API:
//   613156=$115 (6-7yr Wk 8), 613159=$92 (8-12yr Wk 1), 613160=$115 (Wk 2),
//   613162=$115 (Wk 4 — no anomaly for 8-12yr), 613164=$92 (Wk 6 BC Day)

const newPrograms = [
  // ── 6-7yr Wk 8-10 (missing) ─────────────────────────────────────────────
  {
    id: 'COV-613156',
    name: 'Britannia CC- Funseekers Daycamp- 6-7yr olds',
    ageMin: 6, ageMax: 7,
    cost: 115,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    registrationUrl: covUrl(613156),
  },
  {
    id: 'COV-613157',
    name: 'Britannia CC- Funseekers Daycamp- 6-7yr olds',
    ageMin: 6, ageMax: 7,
    cost: 115,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    registrationUrl: covUrl(613157),
  },
  {
    id: 'COV-613158',
    name: 'Britannia CC- Funseekers Daycamp- 6-7yr olds',
    ageMin: 6, ageMax: 7,
    cost: 115,
    startDate: '2026-08-31', endDate: '2026-09-04',
    days: 'Mon, Tue, Wed, Thu, Fri',
    registrationUrl: covUrl(613158),
  },

  // ── 8-12yr Wk 1-10 (all missing) ────────────────────────────────────────
  {
    id: 'COV-613159',
    name: 'Britannia CC- Funseekers Daycamp- 8-12yr olds',
    ageMin: 8, ageMax: 12,
    cost: 92,
    costNote: '4-day week (Canada Day Jul 1)',
    startDate: '2026-06-29', endDate: '2026-07-03',
    days: 'Mon, Tue, Thu, Fri',
    registrationUrl: covUrl(613159),
  },
  {
    id: 'COV-613160',
    name: 'Britannia CC- Funseekers Daycamp- 8-12yr olds',
    ageMin: 8, ageMax: 12,
    cost: 115,
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    registrationUrl: covUrl(613160),
  },
  {
    id: 'COV-613161',
    name: 'Britannia CC- Funseekers Daycamp- 8-12yr olds',
    ageMin: 8, ageMax: 12,
    cost: 115,
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon, Tue, Wed, Thu, Fri',
    registrationUrl: covUrl(613161),
  },
  {
    id: 'COV-613162',
    name: 'Britannia CC- Funseekers Daycamp- 8-12yr olds',
    ageMin: 8, ageMax: 12,
    cost: 115,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    registrationUrl: covUrl(613162),
  },
  {
    id: 'COV-613163',
    name: 'Britannia CC- Funseekers Daycamp- 8-12yr olds',
    ageMin: 8, ageMax: 12,
    cost: 115,
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    registrationUrl: covUrl(613163),
  },
  {
    id: 'COV-613164',
    name: 'Britannia CC- Funseekers Daycamp- 8-12yr olds',
    ageMin: 8, ageMax: 12,
    cost: 92,
    costNote: '4-day week (BC Day Aug 3)',
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue, Wed, Thu, Fri',
    registrationUrl: covUrl(613164),
  },
  {
    id: 'COV-613165',
    name: 'Britannia CC- Funseekers Daycamp- 8-12yr olds',
    ageMin: 8, ageMax: 12,
    cost: 115,
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon, Tue, Wed, Thu, Fri',
    registrationUrl: covUrl(613165),
  },
  {
    id: 'COV-613166',
    name: 'Britannia CC- Funseekers Daycamp- 8-12yr olds',
    ageMin: 8, ageMax: 12,
    cost: 115,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    registrationUrl: covUrl(613166),
  },
  {
    id: 'COV-613167',
    name: 'Britannia CC- Funseekers Daycamp- 8-12yr olds',
    ageMin: 8, ageMax: 12,
    cost: 115,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    registrationUrl: covUrl(613167),
  },
  {
    id: 'COV-613168',
    name: 'Britannia CC- Funseekers Daycamp- 8-12yr olds',
    ageMin: 8, ageMax: 12,
    cost: 115,
    startDate: '2026-08-31', endDate: '2026-09-04',
    days: 'Mon, Tue, Wed, Thu, Fri',
    registrationUrl: covUrl(613168),
  },
];

// Check for duplicates
const existingIds = new Set(programs.map(p => p.id));
let added = 0;
for (const prog of newPrograms) {
  if (existingIds.has(prog.id)) {
    console.warn(`SKIP (already exists): ${prog.id}`);
    continue;
  }
  const full = { ...COMMON, ...prog };
  programs.push(full);
  added++;
}

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Added ${added} programs. Total: ${programs.length}`);
