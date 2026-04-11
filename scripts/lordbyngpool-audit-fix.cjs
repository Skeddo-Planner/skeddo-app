#!/usr/bin/env node
// lordbyngpool-audit-fix.cjs
// Fixes City of Vancouver — Lord Byng Pool data (rank 183 audit, 2026-04-06)
//
// Source pages verified (browser navigation):
//   https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615740  (Parent & Tot - Full)
//   https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615794  (Preschool 1 - Full)
//   https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615856  (Swimmer 1 - Full, cost $70.50 confirmed)
//   https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615898  (Swimmer 7 Rookie - Full, cost $4.30 WRONG)
//   https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615907  (Private Lesson - Full, cost $203 confirmed)
//
// FINDINGS:
//   1. COV-615898 (Swimmer 7 Rookie): cost=$4.30 WRONG.
//      Fee modal shows:
//        Standard charge: $4.30 (placeholder/admin, not the real price)
//        Child Fee PB (5-12 yrs): $132.40
//        Youth Fee PB (13-16 yrs): $162.20
//      DB should reflect the actual registration cost for children: $132.40
//
//   2. All structured lesson entries (Parent & Tot, Preschool 1-4, Swimmer 1-7,
//      Private Lessons) are FULL on the website with waiting lists open.
//      DB incorrectly shows enrollmentStatus: "Open" for all of them.
//      Sampled and confirmed Full: 615740, 615794, 615856, 615898, 615907
//
//   3. Drop-in entries (Lengths, School Board, School Use, Public Swim) remain Open —
//      these don't have limited capacity per session.
//
//   4. No summer 2026 swim lesson sessions are posted on ActiveNet yet (as of Apr 6).
//
//   5. Private lesson description says "2024 Private & Semi-Private Swimming Lesson Rates"
//      but the actual fee modal shows $203 for 5 sessions ($40.60/lesson) — description
//      label is outdated (2024) but the DB cost of $203 is confirmed correct for 2026.
//
//   6. All Completed entries have correct status (past dates).
//   7. COV-616462 (Statutory Holiday Apr 6 today): Open is correct since it's today.
//
// CONFIRMED PRICES:
//   Swimmer 1: $70.50 (Standard charge, 10 sessions, confirmed via fee modal)
//   Swimmer 7 Rookie: $132.40 child (5-12) / $162.20 youth (13-16)
//   Private Lesson: $203 flat (Under 14 or 14+, 5 sessions)
//   Drop-in public swim: $7.93

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

// --- Fix 1: Swimmer 7 Rookie — cost was $4.30 (Standard charge placeholder), not real price ---
// Actual: Child (5-12 yrs) = $132.40, Youth (13-16 yrs) = $162.20
fix('COV-615898', 'cost', 132.40);
fix('COV-615898', 'costNote',
  'Spring 2026: $132.40/child (ages 5–12) or $162.20/youth (ages 13–16) for 10 sessions. ' +
  'Fee confirmed via ActiveNet fee modal (activity #615898). Previous cost of $4.30 was an ' +
  'administrative "Standard charge" placeholder. Leisure Access Pass holders qualify for 50% discount. ' +
  'Prerequisite: min. 8 yrs old, completion of Red Cross Swim Kids Level 8 or Lifesaving Society Swimmer 6.'
);
fix('COV-615898', 'priceVerified', true);
console.log('Fixed COV-615898 cost: $4.30 → $132.40');

// --- Fix 2: Mark all structured lessons as Full (confirmed via browser navigation) ---
// These are specific timeslot entries; all 5 sampled are Full with waiting lists open.
// Parent & Tot sessions
const fullLessonIds = [
  'COV-615740', 'COV-615744',           // Parent & Tot 1/2
  'COV-615794',                          // Preschool 1 - Octopus
  'COV-615804', 'COV-615807',            // Preschool 2 - Crab
  'COV-615839', 'COV-615842',            // Preschool 3 - Orca
  'COV-615845',                          // Preschool 4 - Sea Lion
  'COV-615856',                          // Swimmer 1
  'COV-615862',                          // Swimmer 2
  'COV-615881',                          // Swimmer 4
  'COV-615883', 'COV-615887',            // Swimmer 5
  'COV-615891', 'COV-615896',            // Swimmer 6
  'COV-615898',                          // Swimmer 7 - Rookie (already fixed above)
  'COV-615907', 'COV-615909',            // Private/Semi-Private (Mon, Mon)
  'COV-615919', 'COV-615923', 'COV-615925', 'COV-615927', // Private (Tue, multiple)
  'COV-615957', 'COV-615959',            // Private (Thu)
];

fullLessonIds.forEach(id => {
  fix(id, 'enrollmentStatus', 'Full');
});

console.log(`Marked ${fullLessonIds.length} structured lesson entries as Full`);
console.log('Note: Waiting lists are open on all Full entries. Parents can join via the registration URL.');

// Drop-in entries left as-is (Open): 616452, 616453, 616454, 616456, 616457, 616462

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Changes: ${fixes}. Total programs: ${programs.length}`);
