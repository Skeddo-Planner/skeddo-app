/**
 * Burnaby Camp Fix — Browser-Verified (2026-04-10)
 *
 * Fixes discovered during spot check of Burnaby ActiveNet entries:
 *
 * 1. Bonsor Day Camp (IDs 971-984): Wrong ages, wrong end time, wrong status
 *    - JR: ageMin 6→5, ageMax 8→7, endTime 4:00 PM→3:30 PM, status Full
 *    - Senior: ageMin 9→8, ageMax 12→11, endTime 4:00 PM→3:30 PM, status Full
 *
 * 2. Cameron/Confederation/Eileen Dailly/Kensington (IDs 999-1068):
 *    No camps found on Burnaby ActiveNet for summer 2026 at these facilities.
 *    Set to "Likely Coming Soon" with updated costNote.
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

const changes = [];

for (const prog of programs) {
  // Fix Bonsor Day Camp entries
  if (prog.id >= 971 && prog.id <= 984 && prog.provider && prog.provider.includes('Bonsor')) {
    const isJR = prog.name.includes('6-8');
    const isSenior = prog.name.includes('9-12');

    if (isJR) {
      // ActiveNet: "at least 5 yrs but less than 8 yrs" = ages 5-7
      // Description: "MUST be turning 6 years old in the calendar year"
      if (prog.ageMin !== 5) { changes.push(`${prog.id}: ageMin ${prog.ageMin}→5`); prog.ageMin = 5; }
      if (prog.ageMax !== 7) { changes.push(`${prog.id}: ageMax ${prog.ageMax}→7`); prog.ageMax = 7; }
      prog.name = 'Bonsor Summer Camp - JR (Ages 5-7)';
    }

    if (isSenior) {
      // ActiveNet: "at least 8 yrs but less than 12 yrs" = ages 8-11
      if (prog.ageMin !== 8) { changes.push(`${prog.id}: ageMin ${prog.ageMin}→8`); prog.ageMin = 8; }
      if (prog.ageMax !== 11) { changes.push(`${prog.id}: ageMax ${prog.ageMax}→11`); prog.ageMax = 11; }
      prog.name = 'Bonsor Summer Camp - Senior (Ages 8-11)';
    }

    if (prog.endTime !== '3:30 PM') {
      changes.push(`${prog.id}: endTime ${prog.endTime}→3:30 PM`);
      prog.endTime = '3:30 PM';
    }

    if (prog.enrollmentStatus !== 'Full') {
      changes.push(`${prog.id}: status ${prog.enrollmentStatus}→Full`);
      prog.enrollmentStatus = 'Full';
    }

    prog.priceVerified = true;
    prog.costNote = 'Per week (5 days). First week (Jun 29-Jul 3) is 4 days due to Canada Day — lower price. Browser-verified on ActiveNet (Apr 10, 2026).';
  }

  // Fix Cameron, Confederation, Eileen Dailly, Kensington — no ActiveNet listings found
  const unverifiableFacilities = ['Cameron', 'Confederation', 'Eileen Dailly', 'Kensington'];
  const isUnverifiable = prog.id >= 999 && prog.id <= 1068 &&
    prog.provider && unverifiableFacilities.some(f => prog.provider.includes(f));

  if (isUnverifiable) {
    if (prog.enrollmentStatus !== 'Likely Coming Soon') {
      changes.push(`${prog.id}: status ${prog.enrollmentStatus}→Likely Coming Soon (not on ActiveNet)`);
      prog.enrollmentStatus = 'Likely Coming Soon';
    }
    if (prog.confirmed2026 !== false) {
      prog.confirmed2026 = false;
      changes.push(`${prog.id}: confirmed2026 true→false`);
    }
    prog.cost = null;
    prog.priceVerified = false;
    prog.costNote = 'Not currently listed on Burnaby ActiveNet (checked Apr 10, 2026). These facilities may post summer camps later. Previous price data was unverified.';
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Changes made: ${changes.length}`);
console.log('\nChanges:');
for (const c of changes) console.log('  ' + c);
