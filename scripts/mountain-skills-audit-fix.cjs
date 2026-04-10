/**
 * Mountain Skills Academy Audit Fix — 2026-04-09
 * Rank 244 in audit queue
 *
 * Web-verified against:
 * - https://www.mountainskillsacademy.com/camps/ (CSS-only, no content via WebFetch)
 * - https://www.chatterblock.com/resources/42480/mountain-skills-academy-adventures-squamish-bc/
 * - Web search results
 *
 * Key findings:
 * - Address: 4368 Main Street, Unit 207B, Squamish, BC V8E 1B6
 * - Kids Adventure Camp: ages 8-12, 3-day camp (NOT weekly as in DB)
 * - Teen Climbing Camp: ages 13-17
 * - Programs include: gear, hiking, Sea to Sky gondola, Via Ferrata, climbing
 * - Phone: 604-938-9242, email: info@mountainskillsacademy.com
 * - 2026 dates/prices not available on any accessible page
 * - DB cost $425 and ages 7-16 not verified — correcting
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'Mountain Skills Academy') continue;
  if (![447, 448, 449, 450, 451, 452].includes(Number(p.id))) continue;

  // Address
  p.address = '4368 Main Street, Unit 207B, Squamish, BC V8E 1B6';
  p.postalCode = 'V8E 1B6';
  p.neighbourhood = 'Squamish';
  p.city = 'Squamish';

  // Cannot verify 2026 pricing
  p.confirmed2026 = false;
  p.enrollmentStatus = 'Likely Coming Soon';
  p.status = 'Likely Coming Soon';
  p.cost = null;
  p.priceVerified = false;
  p.isEstimate = false;
  p.urlVerified = false;
  p.costNote = '2026 pricing not available (website renders CSS only). Prior cost $425 unverified. Kids Adventure 3-day camp ages 8-12. Teen Climbing 3-day camp ages 13-17. Contact 604-938-9242 or info@mountainskillsacademy.com.';

  // Activity details
  p.activityType = 'Outdoor Adventure';
  p.category = 'Sports';
  p.indoorOutdoor = 'Outdoor';

  p.description = 'Mountain adventure and climbing camps at Mountain Skills Academy, Squamish. Kids Adventure Camp (8-12): hiking, games, outdoor skills, Sea to Sky gondola, Via Ferrata tour, waterfall tour. Teen Climbing Camp (13-17): top rope rock climbing, techniques, safety skills, rappelling. 3-day camps. Gear included. Est. 1991.';
  p.tags = ['outdoor adventure', 'rock climbing', 'hiking', 'summer camp'];

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Mountain Skills Academy: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
