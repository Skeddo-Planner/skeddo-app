#!/usr/bin/env node
// rjja-audit-fix.cjs
// Fixes Roll Jiu Jitsu Academy data (rank 191 audit, 2026-04-06)
//
// Source pages verified (browser navigation):
//   https://www.rjja.ca/ (homepage — address: 286 Pemberton Ave, North Vancouver, BC)
//   https://www.rjja.ca/programs (programs page — no summer camp details)
//   https://www.rjja.ca/services (services page — "rjja summer camp 2026" confirmed, Learn More → /contact)
//
// FINDINGS:
//   Summer camp IS confirmed for 2026 — listed on services page as "rjja summer camp 2026"
//   BUT: no dates, pricing, ages, or times published on website. Parents directed to contact page.
//
//   Corrections needed for IDs 371-374:
//   - address: "255 W 1st St" → "286 Pemberton Ave" (confirmed from homepage footer)
//   - neighbourhood: "Lower Lonsdale" → "Norgate" (286 Pemberton Ave is Norgate/Lynn Valley area)
//   - lat/lng: corrected for 286 Pemberton Ave
//   - confirmed2026: false → true (camp confirmed for 2026 on services page)
//   - cost: 275 → null (price not published; $275 was unverified estimate)
//   - priceVerified: false → false (unchanged, but also clearing cost)
//   - registrationUrl: /programs → /services (camp info is on services page, contact for details)
//   - costNote: updated with actual findings

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

const COST_NOTE = 'Pricing and session dates not published on website as of Apr 2026. ' +
  'Contact provider directly: info@rjja.ca or 604-988-8819. ' +
  'Summer camp 2026 confirmed on rjja.ca/services. Registration details to be released — check website for updates.';

[371, 372, 373, 374].forEach(id => {
  fix(id, 'address', '286 Pemberton Ave, North Vancouver, BC');
  fix(id, 'neighbourhood', 'Norgate');
  fix(id, 'lat', 49.3185);
  fix(id, 'lng', -123.0965);
  fix(id, 'confirmed2026', true);
  fix(id, 'cost', null);
  fix(id, 'priceVerified', false);
  fix(id, 'registrationUrl', 'https://www.rjja.ca/services');
  fix(id, 'costNote', COST_NOTE);
  fix(id, 'description',
    'Brazilian Jiu Jitsu summer camp at Roll Jiu Jitsu Academy in North Vancouver. ' +
    'Camp confirmed for 2026 — contact provider for dates, times, and pricing.'
  );
  console.log(`Fixed ID ${id}: address → 286 Pemberton Ave, confirmed2026=true, cost=null`);
});

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`\nDone. Fixes: ${fixes}. Total programs: ${programs.length}`);
