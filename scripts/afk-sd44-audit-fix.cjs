#!/usr/bin/env node
// afk-sd44-audit-fix.cjs
// Fixes Artists for Kids (SD44) data (rank 167 audit, 2026-04-06)
//
// SOURCES VERIFIED:
//   AFK Day Camps (my44.sd44.ca/group/984mc2j):
//     Week 1 - Camp 1: Jun 29-Jul 3, Gr 1-2, $495, 9am-3pm, 18 max (MISSING in DB)
//     Week 1 - Camp 2: Jun 29-Jul 3, Gr 3-5, $495, 9am-3pm, 18 max (MISSING in DB)
//     Week 2 - Camp 1: Jul 6-10, Gr 1-2, $495, 9am-3pm, 18 max (MISSING in DB)
//     Week 2 - Camp 2: Jul 6-10, Gr 3-5, $495 → id=15931 ✓ (days fix needed)
//     Week 3 - Camp 1: Aug 31-Sep 4, Gr 1-2, $495 → id=15932 ✓ (days fix needed)
//     Week 3 - Camp 2: Aug 31-Sep 4, Gr 3-5, $495 → id=15933 ✓ (days fix needed)
//   AFK Paradise Valley: id=15934, Full status, $960, Jul 6-10
//
//   SD44 Summer School (sd44.ca/school/summer/):
//     SD44-0001 to SD44-0007 — URLs have moved (old /ProgramsServices/ paths are 404)
//     Update registrationUrl to main SD44 summer page for all 7 entries.
//
// WEEK 1 NOTE: Canada Day Jul 1 (Wed) — camp runs Mon Jun 29, Tue Jun 30, Thu Jul 2, Fri Jul 3 (4 days)
// All Weeks at: 2121 Lonsdale Avenue, North Vancouver, BC V7M 2K6

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const pid_map = new Map(programs.map(p => [String(p.id), p]));

let fixes = 0;

function fix(id, field, value) {
  const p = pid_map.get(String(id));
  if (!p) { console.warn(`SKIP (not found): ${id}`); return; }
  p[field] = value;
  fixes++;
}

function addEntry(id, fields) {
  if (pid_map.has(String(id))) {
    console.warn(`SKIP (already exists): ${id}`);
    return;
  }
  const entry = Object.assign({ id }, fields);
  programs.push(entry);
  pid_map.set(String(id), entry);
  fixes++;
}

const AFK_ADDRESS = '2121 Lonsdale Avenue, North Vancouver, BC V7M 2K6';
const AFK_BASE_URL = 'https://my44.sd44.ca/group/984mc2j/';
const PARADISE_URL = 'https://www.sd44.ca/school/artistsforkids/learn/paradisevalleysummervisualartscamps/Pages/default.aspx';
const SD44_SUMMER_URL = 'https://www.sd44.ca/school/summer/';

// ── 1. Fix existing AFK day camp entries (15931-15933) ──────────────────────
// normalize days format, address postal code
const EXISTING_FIXES = {
  15931: { days: 'Mon, Tue, Wed, Thu, Fri' },
  15932: { days: 'Mon, Tue, Wed, Thu, Fri' },
  15933: { days: 'Mon, Tue, Wed, Thu, Fri' },
};

for (const [id, fields] of Object.entries(EXISTING_FIXES)) {
  for (const [field, value] of Object.entries(fields)) {
    fix(id, field, value);
  }
  fix(id, 'address', AFK_ADDRESS);
  fix(id, 'lat', 49.3201);
  fix(id, 'lng', -123.0743);
}

// Fix Paradise Valley (15934) — url and days
fix(15934, 'days', 'Mon, Tue, Wed, Thu, Fri');
fix(15934, 'registrationUrl', PARADISE_URL);

// ── 2. Add missing AFK day camp entries ─────────────────────────────────────
const AFK_BASE = {
  provider: 'Artists for Kids',
  category: 'Arts & Crafts',
  activityType: 'Painting & Drawing',
  campType: 'Summer Camp',
  scheduleType: 'Half Day',
  dayLength: 'Half Day',
  indoorOutdoor: 'Indoor',
  startTime: '9:00 AM',
  endTime: '3:00 PM',
  durationPerDay: 6,
  address: AFK_ADDRESS,
  city: 'North Vancouver',
  neighbourhood: 'Central Lonsdale',
  lat: 49.3201,
  lng: -123.0743,
  cost: 495,
  priceVerified: true,
  confirmed2026: true,
  enrollmentStatus: 'Open',
  season: 'Summer 2026',
  tags: ['art', 'visual arts', 'drawing', 'painting', 'summer camp'],
};

// Week 1: Jun 29-Jul 3 (Canada Day Jul 1 off — Mon, Tue, Thu, Fri)
addEntry('AFK-W1C1', {
  ...AFK_BASE,
  name: 'Artists for Kids Summer Art Camp — Grades 1-2 (Jun 29-Jul 3)',
  startDate: '2026-06-29',
  endDate: '2026-07-03',
  days: 'Mon, Tue, Thu, Fri',   // Canada Day Jul 1 (Wed) off
  ageMin: 6,
  ageMax: 8,
  registrationUrl: AFK_BASE_URL + 'Pages/Summer%20Day%20Camps/Week%201%20-%20Camp%201/Registration-Form-Week-1-Camp-1.aspx',
  description: 'Artists for Kids visual arts summer camp for campers entering Grades 1-2. One-week camp (Mon/Tue/Thu/Fri — Canada Day Jul 1 off). 9am-3pm at Artists for Kids Gallery, 2121 Lonsdale Ave, North Vancouver. Max 18 campers.',
  costNote: '$495/week (4-day Canada Day week, Jun 29-Jul 3). Same price as 5-day weeks. Grades 1-2 (ages 6-8). Max 18 campers.',
});

addEntry('AFK-W1C2', {
  ...AFK_BASE,
  name: 'Artists for Kids Summer Art Camp — Grades 3-5 (Jun 29-Jul 3)',
  startDate: '2026-06-29',
  endDate: '2026-07-03',
  days: 'Mon, Tue, Thu, Fri',   // Canada Day Jul 1 (Wed) off
  ageMin: 8,
  ageMax: 11,
  registrationUrl: AFK_BASE_URL + 'Pages/Summer%20Day%20Camps/Week%201%20-%20Camp%202/Registration-Form-Week-1-Camp-2.aspx',
  description: 'Artists for Kids visual arts summer camp for campers entering Grades 3-5. One-week camp (Mon/Tue/Thu/Fri — Canada Day Jul 1 off). 9am-3pm at Artists for Kids Gallery, 2121 Lonsdale Ave, North Vancouver. Max 18 campers.',
  costNote: '$495/week (4-day Canada Day week, Jun 29-Jul 3). Same price as 5-day weeks. Grades 3-5 (ages 8-11). Max 18 campers.',
});

// Week 2: Jul 6-10 (5 days)
addEntry('AFK-W2C1', {
  ...AFK_BASE,
  name: 'Artists for Kids Summer Art Camp — Grades 1-2 (Jul 6-10)',
  startDate: '2026-07-06',
  endDate: '2026-07-10',
  days: 'Mon, Tue, Wed, Thu, Fri',
  ageMin: 6,
  ageMax: 8,
  registrationUrl: AFK_BASE_URL + 'Pages/Summer%20Day%20Camps/Week%202%20-%20Camp%201/Registration-Form-Week-2-Camp-1.aspx',
  description: 'Artists for Kids visual arts summer camp for campers entering Grades 1-2. One-week camp, Mon-Fri 9am-3pm at Artists for Kids Gallery, 2121 Lonsdale Ave, North Vancouver. Max 18 campers.',
  costNote: '$495/week. Grades 1-2 (ages 6-8). Max 18 campers. Registration at my44.sd44.ca.',
});

// ── 3. Fix SD44 summer school URLs (old /ProgramsServices/ paths are 404) ───
const SD44_IDS = ['SD44-0001','SD44-0002','SD44-0003','SD44-0004','SD44-0005','SD44-0006','SD44-0007'];
for (const id of SD44_IDS) {
  fix(id, 'registrationUrl', SD44_SUMMER_URL);
}

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
