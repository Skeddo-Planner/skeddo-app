#!/usr/bin/env node
// coalharbour-audit-fix.cjs
// Fixes City of Vancouver - Coal Harbour Community Centre data (rank 200 audit, 2026-04-06)
//
// Source URLs verified (browser navigation):
//   https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/599208  (Starfish W1)
//   https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/599220  (Stingray W1)
//   https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/612888  (Amusement Parks)
//   https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607837  (Architecture)
//   https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607844  (Frozen Ballet)
//
// KEY FINDING: wecca-ch-* entries use internal program barcodes (#XXXXXX shown on detail pages)
//   as registrationUrl IDs instead of the actual URL IDs. The formula is:
//   correct_URL_ID = internal_barcode - 2922
//   Verified on 5 different programs — formula is consistent.
//
// DUPLICATES IDENTIFIED:
//   wecca-ch-starfish-w1 through w6 = duplicates of COV-599208, 599212-599216
//   wecca-ch-aftercare-w1 through w5 = duplicates of COV-599230-599234
//   wecca-ch-amusement-parks = duplicate of ID 1426 (same program, wecca URL is internal barcode)
//   wecca-ch-architecture = duplicate of ID 1427
//   wecca-ch-cartooning = duplicate of ID 1428
//   wecca-ch-dream-house = duplicate of ID 1429
//
// CORRECTIONS:
//   - 14 wecca-ch-* duplicate entries: confirmed2026=false
//   - 33 wecca-ch-* non-duplicate entries: registrationUrl corrected (internal→URL ID)
//   - COV-599208, 599212-599216 (Starfish w1-6): ageMax 9→8 (page: "less than 9 yrs")
//   - COV-599208, 599212-599216: registrationDate + enrollmentStatus "Open"→"Coming Soon"
//   - COV-599230-599234 (AfterCare w1-5): registrationDate + status "Open"→"Coming Soon"
//   - COV-599230-599234: cost updated from null (40/50 per week, 4-day/5-day)

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

const BASE_URL = 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/';

// Helper: compute correct URL from internal barcode (barcode - 2922 = URL ID)
function detailUrl(barcode) {
  return `${BASE_URL}${barcode - 2922}?onlineSiteId=0&from_original_cui=true`;
}

// ---- 1. DEACTIVATE DUPLICATE wecca-ch-* entries ----

const STAR_DUPS = ['wecca-ch-starfish-w1','wecca-ch-starfish-w2','wecca-ch-starfish-w3',
  'wecca-ch-starfish-w4','wecca-ch-starfish-w5','wecca-ch-starfish-w6'];
const AC_DUPS = ['wecca-ch-aftercare-w1','wecca-ch-aftercare-w2','wecca-ch-aftercare-w3',
  'wecca-ch-aftercare-w4','wecca-ch-aftercare-w5'];
const SPECIALTY_DUPS = ['wecca-ch-amusement-parks','wecca-ch-architecture',
  'wecca-ch-cartooning','wecca-ch-dream-house'];

[...STAR_DUPS, ...AC_DUPS, ...SPECIALTY_DUPS].forEach(id => {
  fix(id, 'confirmed2026', false);
  fix(id, 'enrollmentStatus', 'Cancelled');
  console.log(`Deactivated duplicate: ${id}`);
});

// ---- 2. FIX URLS for non-duplicate wecca-ch-* entries ----
// Formula: internal barcode in current URL → correct URL ID = barcode - 2922

const URL_FIXES = [
  // Starfish weeks 7-9 (barcodes 602139-602141)
  ['wecca-ch-starfish-w7', 602139],
  ['wecca-ch-starfish-w8', 602140],
  ['wecca-ch-starfish-w9', 602141],
  // Stingray weeks 1-9 (barcodes 602142-602150)
  ['wecca-ch-stingray-w1', 602142],
  ['wecca-ch-stingray-w2', 602143],
  ['wecca-ch-stingray-w3', 602144],
  ['wecca-ch-stingray-w4', 602145],
  ['wecca-ch-stingray-w5', 602146],
  ['wecca-ch-stingray-w6', 602147],
  ['wecca-ch-stingray-w7', 602148],
  ['wecca-ch-stingray-w8', 602149],
  ['wecca-ch-stingray-w9', 602150],
  // After Care weeks 6-9 (barcodes 602157-602160)
  ['wecca-ch-aftercare-w6', 602157],
  ['wecca-ch-aftercare-w7', 602158],
  ['wecca-ch-aftercare-w8', 602159],
  ['wecca-ch-aftercare-w9', 602160],
  // Dance camps
  ['wecca-ch-fairytale-remix', 615381],
  ['wecca-ch-frozen-ballet', 610766],
  ['wecca-ch-mini-hiphop', 615382],
  ['wecca-ch-under-sea', 610768],
  ['wecca-ch-superhero', 610770],
  ['wecca-ch-kpop', 615383],
  // LEGO Film camps
  ['wecca-ch-lego-film-w1', 600234],
  ['wecca-ch-lego-film-w2', 600237],
  // Tot soccer
  ['wecca-ch-tot-soccer-w1', 610368],
  ['wecca-ch-tot-soccer-w2', 610369],
  ['wecca-ch-tot-soccer-w3', 610371],
  ['wecca-ch-tot-soccer-w4', 610365],
  // Outdoor soccer
  ['wecca-ch-soccer-w1', 610372],
  ['wecca-ch-soccer-w2', 610383],
  ['wecca-ch-soccer-w3', 610384],
  ['wecca-ch-soccer-w4', 610373],
  // Fairy Gnomes Houses
  ['wecca-ch-fairy-gnomes', 614466],
];

URL_FIXES.forEach(([id, barcode]) => {
  const newUrl = detailUrl(barcode);
  fix(id, 'registrationUrl', newUrl);
  console.log(`URL fixed: ${id} → /detail/${barcode - 2922}`);
});

// ---- 3. FIX COV-* Starfish: ageMax 9→8, add registrationDate, fix status ----

const COV_STARFISH = ['COV-599208', 'COV-599212', 'COV-599213', 'COV-599214', 'COV-599215', 'COV-599216'];
COV_STARFISH.forEach(id => {
  fix(id, 'ageMax', 8);
  fix(id, 'registrationDate', '2026-04-08');
  fix(id, 'enrollmentStatus', 'Coming Soon');
  console.log(`Fixed ${id}: ageMax 9→8, registrationDate=2026-04-08, Coming Soon`);
});

// ---- 4. FIX COV-* AfterCare: add registrationDate, fix status, set cost ----

// Week 1 (Jun 29-Jul 3): 4-day (Canada Day Jul 1) → $40
// Weeks 2-5 (Jul 6-31): 5-day → $50
const COV_AFTERCARE = [
  ['COV-599230', 40],  // Week 1 — 4-day (Canada Day)
  ['COV-599231', 50],  // Week 2
  ['COV-599232', 50],  // Week 3
  ['COV-599233', 50],  // Week 4
  ['COV-599234', 50],  // Week 5
];
COV_AFTERCARE.forEach(([id, cost]) => {
  fix(id, 'registrationDate', '2026-04-08');
  fix(id, 'enrollmentStatus', 'Coming Soon');
  fix(id, 'cost', cost);
  fix(id, 'priceVerified', true);
  console.log(`Fixed ${id}: registrationDate, Coming Soon, cost=${cost}`);
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`\nDone. Total fixes: ${fixes}. Programs: ${programs.length}`);
