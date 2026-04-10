/**
 * Planet Ice Delta Audit Fix — 2026-04-09
 * Rank 232 in audit queue
 *
 * Browser-verified against:
 * - https://www.pacificelitehockey.com/school/schedule.aspx
 * - https://planetice.ca/delta/
 *
 * Key changes:
 * - All 4 Female Skills Group entries NOT on current PEHS schedule
 * - PEHS schedule shows different spring programs (High Tempo Combo, Skating & Shooting)
 * - confirmed2026 → false (programs not verifiable on live page)
 * - enrollmentStatus → "Likely Coming Soon"
 * - campType corrected: "Summer Camp" → "Weekly Class" (spring sessions)
 * - indoorOutdoor → "Indoor" (ice arena)
 * - urlVerified → false (programs not on schedule page)
 * - Source was ACTIVE Network API — data not validated against provider page
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

const targetIds = ['ACT-0211', 'ACT-0212', 'ACT-0213', 'ACT-0214'];

for (const p of programs) {
  if (!targetIds.includes(String(p.id))) continue;

  p.confirmed2026 = false;
  p.enrollmentStatus = 'Likely Coming Soon';
  p.status = 'Likely Coming Soon';
  p.campType = 'Weekly Class';
  p.season = 'Spring 2026';
  p.indoorOutdoor = 'Indoor';
  p.urlVerified = false;
  p.urlNote = 'Female Skills Groups not on current PEHS schedule page. PEHS schedule shows different spring programs (High Tempo Combo $270, Skating & Shooting $270). These entries sourced from ACTIVE Network API — not validated.';
  p.costNote = 'Pricing not available — programs not currently listed on PEHS schedule. Current PEHS spring programs are $270/6-week session. Contact Pacific Elite Hockey School at 604-303-0993.';
  p.activityType = 'Hockey';
  p.description = p.name + ' at Planet Ice Delta (10388 Nordel Ct, Delta). Run by Pacific Elite Hockey School. Spring session. Not currently listed on PEHS schedule — may be from prior season or upcoming. Contact provider for availability.';
  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Planet Ice Delta: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
