/**
 * Vancouver Curling Club at Hillcrest CC Audit Fix — 2026-04-09
 * Rank 234 in audit queue
 *
 * Browser-verified against:
 * - https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/613884
 * - https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/613888
 * - https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616181
 *
 * Key changes:
 * - activityType: "General" → "Pickleball"
 * - category: "General" → "Sports"
 * - address: Added full address with postal code
 * - COV-616181: ageMin 14 → primarily adult, but kept for 14+ youth
 * - neighbourhood corrected
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

const targetIds = ['COV-613884', 'COV-613888', 'COV-616181'];

for (const p of programs) {
  if (!targetIds.includes(String(p.id))) continue;

  p.category = 'Sports';
  p.activityType = 'Pickleball';
  p.address = '4575 Clancy Loranger Way, Vancouver, BC V5Y 2M4';
  p.postalCode = 'V5Y 2M4';
  p.neighbourhood = 'Riley Park';
  p.indoorOutdoor = 'Outdoor';

  const id = String(p.id);

  if (id === 'COV-613884') {
    p.costNote = '$101.25 for 5 sessions (Sundays). 12 openings remaining as of Apr 9. Instructor: Precision Tennis Inc. No refunds after second class. Extra paddles provided.';
    p.tags = ['pickleball', 'beginner', 'teens', 'racquet sports'];
  }

  if (id === 'COV-613888') {
    p.costNote = '$101.25 for 5 sessions (Sundays). Instructor: Precision Tennis Inc. No refunds after second class. Extra paddles provided.';
    p.tags = ['pickleball', 'beginner', 'racquet sports'];
    p.urlVerified = true;
  }

  if (id === 'COV-616181') {
    p.costNote = '$200 for 9 sessions (Saturdays Jun 6 - Aug 1). All levels. Part workshop, part tournament. Register individually, form trios. Experienced (3.5+ DUPR) and emerging player tracks.';
    p.tags = ['pickleball', 'teens', 'racquet sports', 'tournament'];
    p.season = 'Summer 2026';
  }

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Vancouver Curling Club at Hillcrest CC: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
