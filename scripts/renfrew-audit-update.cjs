#!/usr/bin/env node
// renfrew-audit-update.cjs
// Adds 22 missing programs at Renfrew Park CC (rank 103 audit)
// - Renfrew Summer Adventures Day Camp: Wk 1-9 (9 programs, entirely missing)
// - Falaise Fun Finders - Supported Day Camp: Wk 1-8 (8 programs, entirely missing)
// - Falaise Fun Finders Day Camp: Wk 4-8 (5 programs, Wk 1-3 already in DB)
// Verified via browser nav + REST estimateprice API on 2026-04-06

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

// Vancouver display ID - 2922 = URL ID
// Summer Adventures: display 604599-604606, 605880 → URL 601677-601684, 602958
// Supported Day Camp: display 604608-604615 → URL 601686-601693
// Falaise Day Camp Wk 4-8: display 604619-604623 → URL 601697-601701

const COMMON = {
  provider: 'City of Vancouver - Renfrew Park Cmty Centre',
  category: 'Multi-Activity',
  activityType: 'Day Camp',
  address: '2929 East 22nd Avenue, Vancouver, BC',
  neighbourhood: 'Renfrew-Collingwood',
  lat: 49.2512351,
  lng: -123.042921,
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
  ageMin: 6,
  ageMax: 13,
};

const covUrl = (urlId) => `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/${urlId}`;

// Price pattern (all 3 camp types):
// - 5-day regular weeks: $150 (verified: COV-601677=$120 Canada Day, COV-601678=$150 regular)
// - 4-day Canada Day (Jun 29-Jul 3): $120 (verified)
// - 4-day BC Day (Aug 4-7): $120 (verified COV-601691=$120)

const SUMMER_ADVENTURES_DESC = 'Renfrew Summer Adventures Day Camp offers a fun-filled summer experience for children. Activities include arts and crafts, games, outdoor play, and more. Children must have completed Kindergarten. Please provide lunch, snack, and water daily.';

const FALAISE_DESC = 'Falaise Fun Finders Day Camp provides a summer day camp experience for children at Falaise Hall (3434 Falaise Avenue). Activities include outdoor play, arts and crafts, and group games. Children must have completed Kindergarten.';

const SUPPORTED_DESC = 'Falaise Fun Finders Supported Day Camp provides children with diverse needs the opportunity to participate in a day camp with their peers. Registration requires pre-approval and an Adapted Recreation Pass from Access Services (access.services@vancouver.ca or 604-718-8270). Camp is located at Falaise Hall (3434 Falaise Avenue). Shared support model — staff float between registered campers.';

const newPrograms = [
  // ── Renfrew Summer Adventures Day Camp (Wk 1-9) ─────────────────────────
  {
    id: 'COV-601677',
    name: 'Renfrew Summer Adventures Day Camp',
    cost: 120, costNote: '4-day week (Canada Day Jul 1)',
    startDate: '2026-06-29', endDate: '2026-07-03',
    days: 'Mon, Tue, Thu, Fri',
    description: SUMMER_ADVENTURES_DESC,
    registrationUrl: covUrl(601677),
  },
  {
    id: 'COV-601678',
    name: 'Renfrew Summer Adventures Day Camp',
    cost: 150,
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: SUMMER_ADVENTURES_DESC,
    registrationUrl: covUrl(601678),
  },
  {
    id: 'COV-601679',
    name: 'Renfrew Summer Adventures Day Camp',
    cost: 150,
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: SUMMER_ADVENTURES_DESC,
    registrationUrl: covUrl(601679),
  },
  {
    id: 'COV-601680',
    name: 'Renfrew Summer Adventures Day Camp',
    cost: 150,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: SUMMER_ADVENTURES_DESC,
    registrationUrl: covUrl(601680),
  },
  {
    id: 'COV-601681',
    name: 'Renfrew Summer Adventures Day Camp',
    cost: 150,
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: SUMMER_ADVENTURES_DESC,
    registrationUrl: covUrl(601681),
  },
  {
    id: 'COV-601682',
    name: 'Renfrew Summer Adventures Day Camp',
    cost: 120, costNote: '4-day week (BC Day Aug 3)',
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue, Wed, Thu, Fri',
    description: SUMMER_ADVENTURES_DESC,
    registrationUrl: covUrl(601682),
  },
  {
    id: 'COV-601683',
    name: 'Renfrew Summer Adventures Day Camp',
    cost: 150,
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: SUMMER_ADVENTURES_DESC,
    registrationUrl: covUrl(601683),
  },
  {
    id: 'COV-601684',
    name: 'Renfrew Summer Adventures Day Camp',
    cost: 150,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: SUMMER_ADVENTURES_DESC,
    registrationUrl: covUrl(601684),
  },
  {
    id: 'COV-602958',
    name: 'Renfrew Summer Adventures Day Camp',
    cost: 150,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: SUMMER_ADVENTURES_DESC,
    registrationUrl: covUrl(602958),
  },

  // ── Falaise Fun Finders - Supported Day Camp (Wk 1-8) ───────────────────
  {
    id: 'COV-601686',
    name: 'Falaise Fun Finders - Supported Day Camp',
    cost: 120, costNote: '4-day week (Canada Day Jul 1). Registration requires Adapted Recreation Pass — contact access.services@vancouver.ca or 604-718-8270.',
    startDate: '2026-06-29', endDate: '2026-07-03',
    days: 'Mon, Tue, Thu, Fri',
    description: SUPPORTED_DESC,
    registrationUrl: covUrl(601686),
  },
  {
    id: 'COV-601687',
    name: 'Falaise Fun Finders - Supported Day Camp',
    cost: 150, costNote: 'Registration requires Adapted Recreation Pass — contact access.services@vancouver.ca or 604-718-8270.',
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: SUPPORTED_DESC,
    registrationUrl: covUrl(601687),
  },
  {
    id: 'COV-601688',
    name: 'Falaise Fun Finders - Supported Day Camp',
    cost: 150, costNote: 'Registration requires Adapted Recreation Pass — contact access.services@vancouver.ca or 604-718-8270.',
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: SUPPORTED_DESC,
    registrationUrl: covUrl(601688),
  },
  {
    id: 'COV-601689',
    name: 'Falaise Fun Finders - Supported Day Camp',
    cost: 150, costNote: 'Registration requires Adapted Recreation Pass — contact access.services@vancouver.ca or 604-718-8270.',
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: SUPPORTED_DESC,
    registrationUrl: covUrl(601689),
  },
  {
    id: 'COV-601690',
    name: 'Falaise Fun Finders - Supported Day Camp',
    cost: 150, costNote: 'Registration requires Adapted Recreation Pass — contact access.services@vancouver.ca or 604-718-8270.',
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: SUPPORTED_DESC,
    registrationUrl: covUrl(601690),
  },
  {
    id: 'COV-601691',
    name: 'Falaise Fun Finders - Supported Day Camp',
    cost: 120, costNote: '4-day week (BC Day Aug 3). Registration requires Adapted Recreation Pass — contact access.services@vancouver.ca or 604-718-8270.',
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue, Wed, Thu, Fri',
    description: SUPPORTED_DESC,
    registrationUrl: covUrl(601691),
  },
  {
    id: 'COV-601692',
    name: 'Falaise Fun Finders - Supported Day Camp',
    cost: 150, costNote: 'Registration requires Adapted Recreation Pass — contact access.services@vancouver.ca or 604-718-8270.',
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: SUPPORTED_DESC,
    registrationUrl: covUrl(601692),
  },
  {
    id: 'COV-601693',
    name: 'Falaise Fun Finders - Supported Day Camp',
    cost: 150, costNote: 'Registration requires Adapted Recreation Pass — contact access.services@vancouver.ca or 604-718-8270.',
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: SUPPORTED_DESC,
    registrationUrl: covUrl(601693),
  },

  // ── Falaise Fun Finders Day Camp (Wk 4-8, Wk 1-3 already in DB) ─────────
  {
    id: 'COV-601697',
    name: 'Falaise Fun Finders Day Camp',
    cost: 150,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: FALAISE_DESC,
    registrationUrl: covUrl(601697),
  },
  {
    id: 'COV-601698',
    name: 'Falaise Fun Finders Day Camp',
    cost: 150,
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: FALAISE_DESC,
    registrationUrl: covUrl(601698),
  },
  {
    id: 'COV-601699',
    name: 'Falaise Fun Finders Day Camp',
    cost: 120, costNote: '4-day week (BC Day Aug 3)',
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue, Wed, Thu, Fri',
    description: FALAISE_DESC,
    registrationUrl: covUrl(601699),
  },
  {
    id: 'COV-601700',
    name: 'Falaise Fun Finders Day Camp',
    cost: 150,
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: FALAISE_DESC,
    registrationUrl: covUrl(601700),
  },
  {
    id: 'COV-601701',
    name: 'Falaise Fun Finders Day Camp',
    cost: 150,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon, Tue, Wed, Thu, Fri',
    description: FALAISE_DESC,
    registrationUrl: covUrl(601701),
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
  programs.push({ ...COMMON, ...prog });
  added++;
}

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Added ${added} programs. Total: ${programs.length}`);
