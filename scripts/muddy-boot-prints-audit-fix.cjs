/**
 * Muddy Boot Prints Audit Fix — 2026-04-09
 * Rank 251 in audit queue — via Chrome browser
 *
 * Browser-verified against:
 * - https://muddybootprints.ca/programs/summer-camps/ — camp details, pricing
 * - https://youth.esikidz.com/activity-list?type=center&id=... — eSikidz registration portal
 *
 * Key findings:
 * - 2 summer camp weeks, both under "Flicker (2.5 to 5 years)" category
 * - Thimbleberry Camp: Jul 6-10, $350, 9:15am-1:15pm, capacity 12
 * - Salmonberry Camp: Jul 13-17, $350, 9:15am-1:15pm, capacity 12
 * - Location: Trout Lake Park, East Vancouver
 * - Teachers: Ms. Marina & Ms. Sam
 * - Both camps Open on eSikidz
 * - Existing entry 1392 had wrong ageMax (9 instead of 5)
 * - Website: muddybootprints.ca (not .com which is broken)
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (![1391, 1392].includes(Number(p.id))) continue;

  // Common corrections
  p.confirmed2026 = true;
  p.priceVerified = true;
  p.urlVerified = true;
  p.startTime = '09:15';
  p.endTime = '13:15';
  p.scheduleType = 'Half Day';
  p.neighbourhood = 'Kensington-Cedar Cottage';
  p.address = 'Trout Lake Park, East Vancouver, BC';
  p.city = 'Vancouver';

  if (Number(p.id) === 1391) {
    // Thimbleberry Camp — Week 1
    p.startDate = '2026-07-06';
    p.endDate = '2026-07-10';
    p.ageMin = 3;
    p.ageMax = 5;
    p.costNote = '$350/week. Ages 2.5-5. 9:15am-1:15pm. Trout Lake Park. Capacity 12. Teachers: Ms. Marina & Ms. Sam. Bring snack and water. Closed-toed shoes, sunscreen applied. 50% refund with 2 weeks notice, $25 admin fee. Register via eSikidz.';
    p.description = 'Thimbleberry Camp (Week 1) at Muddy Boot Prints, Trout Lake Park. Ages 2.5-5. Nature-based outdoor summer camp. Beach exploration, nature art (felting, solar art, lantern making, clay), nature journaling, games. 9:15am-1:15pm.';
  }

  if (Number(p.id) === 1392) {
    // Salmonberry Camp — Week 2
    p.startDate = '2026-07-13';
    p.endDate = '2026-07-17';
    p.ageMin = 3;
    p.ageMax = 5; // was incorrectly 9
    p.costNote = '$350/week. Ages 2.5-5. 9:15am-1:15pm. Trout Lake Park. Capacity 12. Teachers: Ms. Marina & Ms. Sam. Bring snack and water. Closed-toed shoes, sunscreen applied. 50% refund with 2 weeks notice, $25 admin fee. Register via eSikidz.';
    p.description = 'Salmonberry Camp (Week 2) at Muddy Boot Prints, Trout Lake Park. Ages 2.5-5. Nature-based outdoor summer camp. Beach exploration, nature art (felting, solar art, lantern making, clay), nature journaling, games. 9:15am-1:15pm.';
  }

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Muddy Boot Prints audit: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
