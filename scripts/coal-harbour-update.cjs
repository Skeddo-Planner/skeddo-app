#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let fixCount = 0;
let addCount = 0;

// ── 1. STATUS FIXES ────────────────────────────────────────────────────────
// IDs 1426–1429: Full/Waitlist → Coming Soon (registrationDate=2026-04-08)
const toComingSoon = [1426, 1427, 1428, 1429];
for (const prog of programs) {
  if (toComingSoon.includes(prog.id)) {
    if (prog.enrollmentStatus !== 'Coming Soon') {
      prog.enrollmentStatus = 'Coming Soon';
      fixCount++;
      console.log(`Fixed: ${prog.id} → Coming Soon (was ${prog.enrollmentStatus})`);
    }
  }
}

// ── 2. ADD NEW PROGRAMS ────────────────────────────────────────────────────
const CH = {
  provider: 'City of Vancouver - Coal Harbour Cmty Centre',
  address: '480 Broughton St, Vancouver, BC V6G 3A4',
  neighbourhood: 'Coal Harbour',
  lat: 49.2891,
  lng: -123.1243,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: true,
  urlVerified: true,
};

const newPrograms = [
  {
    id: 'COV-600236',
    name: 'Asian Pop / KPOP / Jazz Funk / Hip Hop Dance (6-9 yrs)',
    provider: CH.provider,
    category: 'Dance',
    subcategory: 'Hip Hop',
    activityType: 'Dance',
    description: 'Sample Jazz Funk, Street and Korean Pop (KPOP) dance styles through cardio warm-ups, strengthening, footwork, isolations, and stretches. No previous experience required. Dry indoor shoes and comfortable clothing. By ILLUMA Studio.',
    ageMin: 6,
    ageMax: 9,
    startDate: '2026-04-05',
    endDate: '2026-06-28',
    startTime: '2:45 PM',
    endTime: '3:45 PM',
    days: 'Sun',
    cost: 208,
    costNote: '$208 for 13 sessions (started Apr 5; pro-rated enrolment accepted)',
    enrollmentStatus: 'Open',
    registrationDate: null,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/600236',
    address: CH.address,
    neighbourhood: CH.neighbourhood,
    lat: CH.lat,
    lng: CH.lng,
    city: CH.city,
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=6',
    confirmed2026: CH.confirmed2026,
    priceVerified: CH.priceVerified,
    urlVerified: CH.urlVerified,
    season: 'Spring',
    tags: ['dance', 'KPOP', 'hip hop', 'jazz funk', 'kids'],
    repeating: 'weekly',
    indoorOutdoor: 'Indoor',
  },
  {
    id: 'COV-600238',
    name: 'Asian Pop / KPOP / Jazz Funk / Hip Hop Dance (9-15 yrs)',
    provider: CH.provider,
    category: 'Dance',
    subcategory: 'Hip Hop',
    activityType: 'Dance',
    description: 'Sample Jazz Funk, Street and Korean Pop (KPOP) dance styles through cardio warm-ups, strengthening, footwork, isolations, and stretches. No previous experience required. Dry indoor shoes and comfortable clothing. By ILLUMA Studio.',
    ageMin: 9,
    ageMax: 15,
    startDate: '2026-04-05',
    endDate: '2026-06-28',
    startTime: '3:45 PM',
    endTime: '4:45 PM',
    days: 'Sun',
    cost: 208,
    costNote: '$208 for 13 sessions (started Apr 5; pro-rated enrolment accepted)',
    enrollmentStatus: 'Open',
    registrationDate: null,
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/600238',
    address: CH.address,
    neighbourhood: CH.neighbourhood,
    lat: CH.lat,
    lng: CH.lng,
    city: CH.city,
    url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=6',
    confirmed2026: CH.confirmed2026,
    priceVerified: CH.priceVerified,
    urlVerified: CH.urlVerified,
    season: 'Spring',
    tags: ['dance', 'KPOP', 'hip hop', 'jazz funk', 'youth', 'teen'],
    repeating: 'weekly',
    indoorOutdoor: 'Indoor',
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
    console.log(`ADDED: ${prog.id} — ${prog.name}`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nDone. Fixed: ${fixCount}, Added: ${addCount}, Total: ${programs.length}`);
