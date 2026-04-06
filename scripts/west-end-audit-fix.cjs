#!/usr/bin/env node
// west-end-audit-fix.cjs
// Fixes West End CC day camp data (ranks 116 + 129 audit, 2026-04-06)
//
// Issues found:
// 1. 28 entries (wecca-* and numeric IDs 1918/1919) have WRONG registrationUrls
//    — they used display IDs instead of URL IDs (display - 2922 = URL ID)
//    — e.g. /detail/602548 (Piano Lessons!) instead of /detail/599626 (After Care Wk 5)
// 2. wecca-disc-w3 to w9: age range 7-8yrs → correct is 8-9yrs (verified via API)
// 3. wecca-voy-w1 to w9: age range 9-12yrs → correct is 10-12yrs (verified via API)
// 4. Names corrected to match ActiveNet ("at West End" suffix removed; age band updated)
// 5. COV-599622 (After Care Wk 1): season Year-Round → Summer 2026
// 6. COV-599649 (Discoveries Wk 1): season Year-Round → Summer 2026
// 7. 2053/2054 (Before Care Wk 8-9): enrollmentStatus Completed → Cancelled
// 8. Adds Before Care Wk 1-7 (all Cancelled — never in DB, consistent with Wk 8/9)

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const pid_map = new Map(programs.map(p => [String(p.id), p]));

const BASE = 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/';
const covUrl = (urlId) => BASE + urlId;

let fixes = 0;

function fix(id, field, value) {
  const p = pid_map.get(String(id));
  if (!p) { console.warn(`SKIP (not found): ${id}`); return; }
  p[field] = value;
  fixes++;
}

// ── 1. URL fixes (display IDs → URL IDs) ──────────────────────────────────
// Formula: url_id = display_id - 2922

const urlFixes = {
  // After Care Wk 5-9: display 602548-602552 → url 599626-599630
  'wecca-aftercare-w5': 599626, 'wecca-aftercare-w6': 599627,
  'wecca-aftercare-w7': 599628, 'wecca-aftercare-w8': 599629,
  'wecca-aftercare-w9': 599630,
  // Adventures Wk 1-2, 4-7, 9
  '1918': 599640, '1919': 599641,
  'wecca-adv-w4': 599643, 'wecca-adv-w5': 599644,
  'wecca-adv-w6': 599645, 'wecca-adv-w7': 599646,
  'wecca-adv-w9': 599648,
  // Discoveries Wk 3-9: display 602573-602579 → url 599651-599657
  'wecca-disc-w3': 599651, 'wecca-disc-w4': 599652,
  'wecca-disc-w5': 599653, 'wecca-disc-w6': 599654,
  'wecca-disc-w7': 599655, 'wecca-disc-w8': 599656,
  'wecca-disc-w9': 599657,
  // Voyages Wk 1-9: display 602580-602588 → url 599658-599666
  // wecca-voy-w8 had WRONG display ID 602600 (not 602587); correct url_id is 599665
  'wecca-voy-w1': 599658, 'wecca-voy-w2': 599659, 'wecca-voy-w3': 599660,
  'wecca-voy-w4': 599661, 'wecca-voy-w5': 599662, 'wecca-voy-w6': 599663,
  'wecca-voy-w7': 599664, 'wecca-voy-w8': 599665, 'wecca-voy-w9': 599666,
};
for (const [id, urlId] of Object.entries(urlFixes)) {
  fix(id, 'registrationUrl', covUrl(urlId));
}
console.log('URLs fixed:', Object.keys(urlFixes).length);

// ── 2. Age fixes — Discoveries (8-9yrs) ───────────────────────────────────
for (const w of ['w3','w4','w5','w6','w7','w8','w9']) {
  fix(`wecca-disc-${w}`, 'ageMin', 8);
  fix(`wecca-disc-${w}`, 'ageMax', 9);
}

// ── 3. Age fixes — Voyages (10-12yrs) ────────────────────────────────────
for (const w of ['w1','w2','w3','w4','w5','w6','w7','w8','w9']) {
  fix(`wecca-voy-${w}`, 'ageMin', 10);
  // ageMax stays 12 — just ensuring ageMin is correct
}

// ── 4. Name fixes ─────────────────────────────────────────────────────────
// Remove "at West End" suffix; fix age bands in names
const nameMap = {
  '1918': 'Day Camp Adventures (6-7yrs) - Week 1',
  '1919': 'Day Camp Adventures (6-7yrs) - Week 2',
  'wecca-adv-w4': 'Day Camp Adventures (6-7yrs) - Week 4',
  'wecca-adv-w5': 'Day Camp Adventures (6-7yrs) - Week 5',
  'wecca-adv-w6': 'Day Camp Adventures (6-7yrs) - Week 6',
  'wecca-adv-w7': 'Day Camp Adventures (6-7yrs) - Week 7',
  'wecca-adv-w9': 'Day Camp Adventures (6-7yrs) - Week 9',
};
// Also fix Discoveries names (7-8yrs → 8-9yrs, remove "at West End")
for (let i = 3; i <= 9; i++) {
  nameMap[`wecca-disc-w${i}`] = `Day Camp Discoveries (8-9yrs) - Week ${i}`;
}
// Fix Voyages names (9-12yrs → 10-12yrs, remove "at West End")
for (let i = 1; i <= 9; i++) {
  nameMap[`wecca-voy-w${i}`] = `Day Camp Voyages (10-12yrs)- Week ${i}`;
}
// Fix After Care names (add dash/space to match ActiveNet format)
for (let i = 5; i <= 9; i++) {
  nameMap[`wecca-aftercare-w${i}`] = `Day Camp - After Care (6-12 yrs) - Week ${i}`;
}
for (const [id, name] of Object.entries(nameMap)) {
  fix(id, 'name', name);
}
console.log('Names fixed:', Object.keys(nameMap).length);

// ── 5. Season fixes ───────────────────────────────────────────────────────
fix('COV-599622', 'season', 'Summer 2026');
fix('COV-599649', 'season', 'Summer 2026');

// ── 6. Status fix for Before Care Wk 8-9 ─────────────────────────────────
fix('2053', 'enrollmentStatus', 'Cancelled');
fix('2054', 'enrollmentStatus', 'Cancelled');
fix('2053', 'season', 'Summer 2026');
fix('2054', 'season', 'Summer 2026');

// ── 7. Add Before Care Wk 1-7 (all Cancelled) ────────────────────────────
// URL IDs 599631-599637, display IDs 602553-602559
const BEFORE_CARE_COMMON = {
  provider: 'City of Vancouver - West End Cmty Centre',
  category: 'Day Camp',
  activityType: 'Day Camp',
  address: '870 Denman Street, Vancouver, BC',
  neighbourhood: 'West End',
  lat: 49.2869678,
  lng: -123.1401514,
  startTime: '8:00 AM',
  endTime: '9:30 AM',
  durationPerDay: 1.5,
  scheduleType: 'Activity',
  dayLength: 'Partial Day',
  campType: 'Summer Camp',
  season: 'Summer 2026',
  enrollmentStatus: 'Cancelled',
  confirmed2026: true,
  priceVerified: false,
  registrationDate: '2026-04-08',
  registrationDateLabel: 'Apr 8 at 7:00 PM',
  indoorOutdoor: 'Both',
  tags: ['camp'],
  city: 'Vancouver',
  ageMin: 6,
  ageMax: 12,
  costNote: 'Before Care Cancelled for 2026 — registration not available',
  cost: null,
  description: 'Day Camp Before Care (8:00-9:30 AM) is an add-on for children registered in Adventures, Discoveries, or Voyages Day Camp. Must be registered in a main camp to participate. Note: Cancelled for Summer 2026.',
};

const beforeCareWeeks = [
  { id: 'COV-599631', wk: 1, start: '2026-06-29', end: '2026-07-03', days: 'Mon, Tue, Thu, Fri' },
  { id: 'COV-599632', wk: 2, start: '2026-07-06', end: '2026-07-10', days: 'Mon, Tue, Wed, Thu, Fri' },
  { id: 'COV-599633', wk: 3, start: '2026-07-13', end: '2026-07-17', days: 'Mon, Tue, Wed, Thu, Fri' },
  { id: 'COV-599634', wk: 4, start: '2026-07-20', end: '2026-07-24', days: 'Mon, Tue, Wed, Thu, Fri' },
  { id: 'COV-599635', wk: 5, start: '2026-07-27', end: '2026-07-31', days: 'Mon, Tue, Wed, Thu, Fri' },
  { id: 'COV-599636', wk: 6, start: '2026-08-04', end: '2026-08-07', days: 'Tue, Wed, Thu, Fri' },
  { id: 'COV-599637', wk: 7, start: '2026-08-10', end: '2026-08-14', days: 'Mon, Tue, Wed, Thu, Fri' },
];

const existingIds = new Set(programs.map(p => String(p.id)));
let added = 0;
for (const { id, wk, start, end, days } of beforeCareWeeks) {
  if (existingIds.has(id)) {
    console.warn(`SKIP (already exists): ${id}`);
    continue;
  }
  programs.push({
    ...BEFORE_CARE_COMMON,
    id,
    name: `Day Camp - Before Care (6-12 yrs) - Week ${wk}`,
    startDate: start,
    endDate: end,
    days,
    registrationUrl: covUrl(parseInt(id.replace('COV-', ''))),
  });
  added++;
}
console.log(`Before Care Wk 1-7 added: ${added}`);
console.log(`Total fields fixed: ${fixes}`);

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Programs: ${programs.length}`);
