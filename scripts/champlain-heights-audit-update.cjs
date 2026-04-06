#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let fixCount = 0;
let addCount = 0;

// ── SOURCE ─────────────────────────────────────────────────────────────────
// Registration page: https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=57
// Verified: 2026-04-06
// center_id=57 = Champlain Heights Cmty Centre
// Dual-ID formula: display ID − 2922 = URL ID

// ── 1. STATUS / DATE FIXES ─────────────────────────────────────────────────

for (const prog of programs) {
  // Anime Cartoon Drawing Camp Jun 29–Jul 3: live page = Cancelled
  if (prog.id === 1394) {
    if (prog.enrollmentStatus !== 'Cancelled') {
      prog.enrollmentStatus = 'Cancelled';
      fixCount++;
      console.log(`Fixed: ${prog.id} — ${prog.name} → Cancelled`);
    }
  }

  // Anime Cartoon Drawing Camp Aug 10–14: live page = Full
  if (prog.id === 1395) {
    if (prog.enrollmentStatus !== 'Full') {
      prog.enrollmentStatus = 'Full';
      fixCount++;
      console.log(`Fixed: ${prog.id} — ${prog.name} → Full`);
    }
  }

  // Byte Camp - Foundations of AI: start/end date was wrong (Aug 10 → Jul 20)
  if (prog.id === 1397) {
    if (prog.startDate !== '2026-07-20') {
      prog.startDate = '2026-07-20';
      prog.endDate = '2026-07-24';
      fixCount++;
      console.log(`Fixed: ${prog.id} — Byte Camp Foundations of AI — startDate corrected to 2026-07-20`);
    }
  }

  // champlain-cc-1: wrong registrationUrl (was pointing to Killarney), fix to Champlain search
  if (prog.id === 'champlain-cc-1') {
    prog.registrationUrl = 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=57';
    prog.name = 'Champlain Heights Summer Day Camp (Sunsplash)';
    prog.description = 'Summer day camp at Champlain Heights — see Junior Sunsplash and Senior Sunsplash for specific age group programs and weekly registration.';
    fixCount++;
    console.log(`Fixed: champlain-cc-1 — corrected URL and description`);
  }
}

// ── 2. BASE OBJECT ─────────────────────────────────────────────────────────
const CH = {
  provider: 'City of Vancouver - Champlain Heights Cmty Centre',
  address: '3350 Maquinna Drive, Vancouver, BC',
  neighbourhood: 'Champlain Heights',
  lat: 49.2165,
  lng: -123.03,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: false,
  urlVerified: true,
  indoorOutdoor: 'Both',
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=57',
  campType: 'Summer Camp',
  category: 'Multi-Activity',
  activityType: 'Day Camp',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  registrationDate: '2026-04-08',
  enrollmentStatus: 'Coming Soon',
  repeating: 'weekly',
  tags: ['day camp', 'summer camp', 'champlain heights'],
};

const sunsplashDesc = 'Summer day camp with indoor and outdoor sports, cooperative games, arts & crafts, theatre, dance, and 2 field-trips per week. Held at Champlain Heights Main School. Sensory accommodations available (chill-out zone, visual schedules). Behaviour Support Leader (BSL) on staff. Includes visits to spray park/pools. Children must have completed kindergarten.';

const supportedSunsplashDesc = 'Inclusion day camp for children who require additional support. Maximum 3 participants per week. Activities include indoor and outdoor sports, arts & crafts, theatre, and field trips. Held at Champlain Heights Main School. Contact the centre for information on required forms and eligibility. Registration opens Apr 8, 2026 at 7:00 PM. Enroll via registration page.';

// ── 3. NEW PROGRAMS ────────────────────────────────────────────────────────

const newPrograms = [

  // ── SENIOR SUNSPLASH WEEKS 5–9 (weeks 1–4 already in DB as IDs 1410–1413) ──
  {
    id: 'COV-602877',
    name: 'Senior Sunsplash | Week 5',
    ...CH,
    ageMin: 9, ageMax: 12,
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM. 50% Leisure Access discount available.',
    description: sunsplashDesc,
    season: 'Summer 2026',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602877',
  },
  {
    id: 'COV-602878',
    name: 'Senior Sunsplash | Week 6',
    ...CH,
    ageMin: 9, ageMax: 12,
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue,Wed,Thu,Fri',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Week 6 is 4 days (Aug 4–7, BC Day on Mon Aug 3). Registration opens Apr 8, 2026 at 7:00 PM. 50% Leisure Access discount available.',
    description: sunsplashDesc,
    season: 'Summer 2026',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602878',
  },
  {
    id: 'COV-602879',
    name: 'Senior Sunsplash | Week 7',
    ...CH,
    ageMin: 9, ageMax: 12,
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM. 50% Leisure Access discount available.',
    description: sunsplashDesc,
    season: 'Summer 2026',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602879',
  },
  {
    id: 'COV-602880',
    name: 'Senior Sunsplash | Week 8',
    ...CH,
    ageMin: 9, ageMax: 12,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM. 50% Leisure Access discount available.',
    description: sunsplashDesc,
    season: 'Summer 2026',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602880',
  },
  {
    id: 'COV-602881',
    name: 'Senior Sunsplash | Week 9',
    ...CH,
    ageMin: 9, ageMax: 12,
    startDate: '2026-08-24', endDate: '2026-08-27',
    days: 'Mon,Tue,Wed,Thu',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Week 9 is 4 days (Aug 24–27, Mon–Thu). Registration opens Apr 8, 2026 at 7:00 PM. 50% Leisure Access discount available.',
    description: sunsplashDesc,
    season: 'Summer 2026',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602881',
  },

  // ── SUPPORTED SUNSPLASH WEEKS 1–9 (inclusion program, 3 spots/week) ───────
  {
    id: 'COV-602285',
    name: 'Supported Sunsplash | Week 1',
    ...CH,
    ageMin: 6, ageMax: 12,
    startDate: '2026-06-30', endDate: '2026-07-03',
    days: 'Tue,Thu,Fri',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page. Inclusion program — 3 spots available. Registration opens Apr 8, 2026 at 7:00 PM.',
    description: supportedSunsplashDesc,
    season: 'Summer 2026',
    tags: ['day camp', 'summer camp', 'inclusion', 'supported', 'champlain heights', 'special needs'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602285',
    ageSpanJustified: 'Inclusion day camp for children requiring support, ages 6–12 — single cohort with 3 spots, no age-band subdivisions',
  },
  {
    id: 'COV-602286',
    name: 'Supported Sunsplash | Week 2',
    ...CH,
    ageMin: 6, ageMax: 8,
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page. Inclusion program — 3 spots available. Registration opens Apr 8, 2026 at 7:00 PM.',
    description: supportedSunsplashDesc,
    season: 'Summer 2026',
    tags: ['day camp', 'summer camp', 'inclusion', 'supported', 'champlain heights', 'special needs'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602286',
  },
  {
    id: 'COV-602287',
    name: 'Supported Sunsplash | Week 3',
    ...CH,
    ageMin: 6, ageMax: 12,
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page. Inclusion program — 3 spots available. Registration opens Apr 8, 2026 at 7:00 PM.',
    description: supportedSunsplashDesc,
    season: 'Summer 2026',
    tags: ['day camp', 'summer camp', 'inclusion', 'supported', 'champlain heights', 'special needs'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602287',
    ageSpanJustified: 'Inclusion day camp for children requiring support, ages 6–12 — single cohort with 3 spots, no age-band subdivisions',
  },
  {
    id: 'COV-602288',
    name: 'Supported Sunsplash | Week 4',
    ...CH,
    ageMin: 6, ageMax: 12,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page. Inclusion program — 3 spots available. Registration opens Apr 8, 2026 at 7:00 PM.',
    description: supportedSunsplashDesc,
    season: 'Summer 2026',
    tags: ['day camp', 'summer camp', 'inclusion', 'supported', 'champlain heights', 'special needs'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602288',
    ageSpanJustified: 'Inclusion day camp for children requiring support, ages 6–12 — single cohort with 3 spots, no age-band subdivisions',
  },
  {
    id: 'COV-602289',
    name: 'Supported Sunsplash | Week 5',
    ...CH,
    ageMin: 6, ageMax: 12,
    startDate: '2026-07-27', endDate: '2026-07-31',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page. Inclusion program — 3 spots available. Registration opens Apr 8, 2026 at 7:00 PM.',
    description: supportedSunsplashDesc,
    season: 'Summer 2026',
    tags: ['day camp', 'summer camp', 'inclusion', 'supported', 'champlain heights', 'special needs'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602289',
    ageSpanJustified: 'Inclusion day camp for children requiring support, ages 6–12 — single cohort with 3 spots, no age-band subdivisions',
  },
  {
    id: 'COV-602290',
    name: 'Supported Sunsplash | Week 6',
    ...CH,
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue,Wed,Thu,Fri',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page. Inclusion program — 3 spots available. Week 6 is 4 days (BC Day on Aug 3). Registration opens Apr 8, 2026 at 7:00 PM.',
    description: supportedSunsplashDesc,
    season: 'Summer 2026',
    tags: ['day camp', 'summer camp', 'inclusion', 'supported', 'champlain heights', 'special needs'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602290',
    ageSpanJustified: 'Inclusion day camp for children requiring support, ages 6–12 — single cohort with 3 spots, no age-band subdivisions',
  },
  {
    id: 'COV-602291',
    name: 'Supported Sunsplash | Week 7',
    ...CH,
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page. Inclusion program — 3 spots available. Registration opens Apr 8, 2026 at 7:00 PM.',
    description: supportedSunsplashDesc,
    season: 'Summer 2026',
    tags: ['day camp', 'summer camp', 'inclusion', 'supported', 'champlain heights', 'special needs'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602291',
    ageSpanJustified: 'Inclusion day camp for children requiring support, ages 6–12 — single cohort with 3 spots, no age-band subdivisions',
  },
  {
    id: 'COV-602292',
    name: 'Supported Sunsplash | Week 8',
    ...CH,
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page. Inclusion program — 3 spots available. Registration opens Apr 8, 2026 at 7:00 PM.',
    description: supportedSunsplashDesc,
    season: 'Summer 2026',
    tags: ['day camp', 'summer camp', 'inclusion', 'supported', 'champlain heights', 'special needs'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602292',
    ageSpanJustified: 'Inclusion day camp for children requiring support, ages 6–12 — single cohort with 3 spots, no age-band subdivisions',
  },
  {
    id: 'COV-602293',
    name: 'Supported Sunsplash | Week 9',
    ...CH,
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '9:00 AM', endTime: '3:30 PM',
    durationPerDay: 6.5,
    cost: null,
    costNote: 'Fee not displayed on registration page. Inclusion program — 3 spots available. Registration opens Apr 8, 2026 at 7:00 PM.',
    description: supportedSunsplashDesc,
    season: 'Summer 2026',
    tags: ['day camp', 'summer camp', 'inclusion', 'supported', 'champlain heights', 'special needs'],
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/602293',
    ageSpanJustified: 'Inclusion day camp for children requiring support, ages 6–12 — single cohort with 3 spots, no age-band subdivisions',
  },

  // ── CHAMPLAIN COOKING CLUB ─────────────────────────────────────────────────
  {
    id: 'COV-598777',
    name: 'Champlain Cooking Club Set #1',
    provider: 'City of Vancouver - Champlain Heights Cmty Centre',
    address: '3350 Maquinna Drive, Vancouver, BC',
    neighbourhood: 'Champlain Heights',
    lat: 49.2165, lng: -123.03,
    city: 'Vancouver',
    confirmed2026: true,
    priceVerified: false,
    urlVerified: true,
    indoorOutdoor: 'Indoor',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=57',
    season: 'Spring 2026',
    campType: 'Spring Program',
    category: 'Life Skills',
    activityType: 'Cooking',
    scheduleType: 'Activity',
    dayLength: 'Single Day',
    registrationDate: null,
    enrollmentStatus: 'Full/Waitlist',
    repeating: 'weekly',
    ageMin: 11, ageMax: 15,
    startDate: '2026-04-02', endDate: '2026-05-07',
    days: 'Thu',
    startTime: '5:30 PM', endTime: '7:00 PM',
    durationPerDay: 1.5,
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). 6 sessions (weekly Thu, Apr 2–May 7). Program is currently Full — waitlist open with 4 on waiting list.',
    description: 'Join the youth worker in the kitchen to create simple and tasty meals and snacks. Learn safe kitchen habits including knife handling, cleaning, and food safety standards. Make budget-friendly, easy recipes to cook at home — after-school snacks and meals to impress friends and family. Bring a container to take home leftovers.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/598777',
    tags: ['cooking', 'kitchen', 'food', 'youth', 'life skills'],
  },
  {
    id: 'COV-598785',
    name: 'Champlain Cooking Club Set #2',
    provider: 'City of Vancouver - Champlain Heights Cmty Centre',
    address: '3350 Maquinna Drive, Vancouver, BC',
    neighbourhood: 'Champlain Heights',
    lat: 49.2165, lng: -123.03,
    city: 'Vancouver',
    confirmed2026: true,
    priceVerified: false,
    urlVerified: true,
    indoorOutdoor: 'Indoor',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=57',
    season: 'Spring 2026',
    campType: 'Spring Program',
    category: 'Life Skills',
    activityType: 'Cooking',
    scheduleType: 'Activity',
    dayLength: 'Single Day',
    registrationDate: null,
    enrollmentStatus: 'Full',
    repeating: 'weekly',
    ageMin: 11, ageMax: 15,
    startDate: '2026-05-14', endDate: '2026-06-18',
    days: 'Thu',
    startTime: '5:30 PM', endTime: '7:00 PM',
    durationPerDay: 1.5,
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). 6 sessions (weekly Thu, May 14–Jun 18). Program is currently Full.',
    description: 'Join the youth worker in the kitchen to create simple and tasty meals and snacks. Learn safe kitchen habits including knife handling, cleaning, and food safety standards. Make budget-friendly, easy recipes to cook at home — after-school snacks and meals to impress friends and family. Bring a container to take home leftovers.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/598785',
    tags: ['cooking', 'kitchen', 'food', 'youth', 'life skills'],
  },

  // ── PRO-D DAY: SCIENCE WORLD ───────────────────────────────────────────────
  {
    id: 'COV-604055',
    name: 'Pro-D Day — Science World (Champlain Heights OSC)',
    provider: 'City of Vancouver - Champlain Heights Cmty Centre',
    address: '3350 Maquinna Drive, Vancouver, BC',
    neighbourhood: 'Champlain Heights',
    lat: 49.2165, lng: -123.03,
    city: 'Vancouver',
    confirmed2026: true,
    priceVerified: true,
    urlVerified: true,
    indoorOutdoor: 'Both',
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=57',
    season: 'Spring 2026',
    campType: 'Spring Program',
    category: 'Education',
    activityType: 'Science',
    scheduleType: 'Full Day',
    dayLength: 'Full Day',
    registrationDate: null,
    enrollmentStatus: 'Open',
    ageMin: 5, ageMax: 13,
    startDate: '2026-05-04', endDate: '2026-05-04',
    days: 'Mon',
    startTime: '9:00 AM', endTime: '3:00 PM',
    durationPerDay: 6,
    cost: 75,
    costNote: '$75 for 1 session (Mon May 4, 9:00 AM–3:00 PM). $20 Science World admission included. Before care (7:30–9:00 AM) and after care (3:00–6:00 PM) available for additional fee. Priority registration for current Champlain Heights Out of School Care (OSC) participants — non-OSC families placed on waitlist and contacted 2 weeks prior.',
    description: 'Licensed Pro-D Day care at Science World — travel to/from Science World via the community bus. $20 admission fee included in registration. Before care (7:30–9:00 AM) and after care (3:00–6:00 PM) available for extra fee. New participants must provide immunization record, photo, and required licensing forms before the program. Priority given to current Champlain Heights OSC participants.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/604055',
    tags: ['science', 'pro-d day', 'field trip', 'science world', 'licensed child care'],
    ageSpanJustified: 'Licensed childcare Pro-D day for grades K–7 (ages 5–13) — single cohort attending Science World, no age-band subdivisions',
  },
];

// ── 4. ADD NEW PROGRAMS ────────────────────────────────────────────────────
const existingIds = new Set(programs.map(p => String(p.id)));
for (const prog of newPrograms) {
  if (existingIds.has(String(prog.id))) {
    console.log(`SKIP (exists): ${prog.id}`);
  } else {
    programs.push(prog);
    existingIds.add(String(prog.id));
    addCount++;
    console.log(`ADDED: ${prog.id} — ${prog.name}`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nDone. Fixed: ${fixCount}, Added: ${addCount}, Total: ${programs.length}`);
