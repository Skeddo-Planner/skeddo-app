#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let addCount = 0;

// ── SOURCE ─────────────────────────────────────────────────────────────────
// Registration page: https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=54
// Verified: 2026-04-06. center_id=54 = Marpole-Oakridge Cmty Centre
// Live page: 376 programs (ages 0-17). DB had 102. Main gap: Youth Camp Weeks 1-5.
// Dual-ID formula: display ID − 2922 = URL ID
// Youth Camp Wk 1 display #608760 → URL 605838 ✓ (verified at detail/605838)

// ── BASE OBJECT ────────────────────────────────────────────────────────────
// Copied from existing COV-605858 (Youth Camp Week 6) which is verified priceVerified=true $165
const MO_YOUTH = {
  provider: 'City of Vancouver - Marpole-Oakridge Cmty Centre',
  address: '990 West 59th Avenue, Vancouver, BC',
  neighbourhood: 'Marpole',
  lat: 49.216782,
  lng: -123.1286357,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: false,
  urlVerified: true,
  indoorOutdoor: 'Both',
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
  season: 'Summer 2026',
  campType: 'Summer Camp',
  category: 'Multi-Activity',
  activityType: 'Day Camp',
  scheduleType: 'Full Day',
  dayLength: 'Full Day',
  registrationDate: '2026-04-08',
  enrollmentStatus: 'Coming Soon',
  ageMin: 11, ageMax: 14,
  startTime: '9:00 AM', endTime: '4:00 PM',
  durationPerDay: 7,
  days: 'Mon,Tue,Wed,Thu,Fri',
  tags: ['day camp', 'summer camp', 'teens', 'youth', 'leadership'],
  description: 'Youth Camp is designed to help young people build leadership and communication skills while preparing for future volunteer opportunities. This program blends fun, learning, and friendship in a safe and welcoming environment. Through engaging discussions, group projects, and confidence-building activities, youth grow both individually and as part of a team. Each week features a new theme explored through interactive workshops, leadership games, and team-building activities. Campers take part in creative arts and crafts and enjoy local outings and excursions throughout the Lower Mainland, including swimming, ice skating, and visits to fun venues. Contact: marpole.camps@vancouver.ca. Registration opens Apr 8, 2026 at 7:00 PM.',
};

// ── NEW PROGRAMS: Youth Camp Weeks 1–5 ────────────────────────────────────
// Weeks 6–8 already in DB (COV-605858, COV-605859, COV-605860, all priceVerified=true, cost=165)
// Cost for full weeks likely $165 based on verified Wk 6–8; not yet verifiable for Wks 1–5 (registration opens Apr 8)
// Wk 5 is 4 days (BC Day Aug 4 off) — set cost=null, costNote explains

const newPrograms = [
  {
    id: 'COV-605838',
    name: 'Youth Camp Week 1',
    ...MO_YOUTH,
    startDate: '2026-07-06', endDate: '2026-07-10',
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM. Weeks 6–8 confirmed at $165/week — fee for Wk 1 likely similar. 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/605838',
  },
  {
    id: 'COV-605848',
    name: 'Youth Camp Week 2',
    ...MO_YOUTH,
    startDate: '2026-07-13', endDate: '2026-07-17',
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM. Weeks 6–8 confirmed at $165/week — fee for Wk 2 likely similar. 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/605848',
  },
  {
    id: 'COV-605850',
    name: 'Youth Camp Week 3',
    ...MO_YOUTH,
    startDate: '2026-07-20', endDate: '2026-07-24',
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM. Weeks 6–8 confirmed at $165/week — fee for Wk 3 likely similar. 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/605850',
  },
  {
    id: 'COV-605853',
    name: 'Youth Camp Week 4',
    ...MO_YOUTH,
    startDate: '2026-07-27', endDate: '2026-07-31',
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM. Weeks 6–8 confirmed at $165/week — fee for Wk 4 likely similar. 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/605853',
  },
  {
    id: 'COV-605855',
    name: 'Youth Camp Week 5',
    ...MO_YOUTH,
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue,Wed,Thu,Fri',
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Week 5 is 4 days (Tue–Fri Aug 4–7; BC Day on Aug 3 Mon). Registration opens Apr 8, 2026 at 7:00 PM. 50% Leisure Access discount available.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/605855',
  },
];

const existingIds = new Set(programs.map(p => String(p.id)));
for (const prog of newPrograms) {
  if (existingIds.has(String(prog.id))) {
    console.log(`SKIP (exists): ${prog.id}`);
  } else {
    programs.push(prog);
    existingIds.add(String(prog.id));
    addCount++;
    console.log(`ADDED: ${prog.id} — ${prog.name} (${prog.startDate})`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nDone. Added: ${addCount}, Total: ${programs.length}`);
