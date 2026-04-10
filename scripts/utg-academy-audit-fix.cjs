/**
 * UTG Academy Audit Fix — 2026-04-09
 * Rank 240 in audit queue
 *
 * Web-verified against:
 * - https://utgacademy.com/summer-camp/
 * - https://utgacademy.com/courses/?courseCategory=summer
 * - https://utgacademy.com/find-us/
 *
 * Key findings:
 * - Summer 2026 courses not yet posted ("seasonal and may not be up yet")
 * - 3 camp types: Coding (Python/PixelPAD), Robotics, Animation & 3D Printing
 * - Schedule from prior year: AM outdoors 9am-12pm, PM STEM indoors 1pm-4pm
 * - 4 locations: Kitsilano, North Vancouver, Coquitlam, South Burnaby
 * - DB entries only have North Vancouver address — keeping for now
 * - Max group size: 5 for coding/art, 2-3 teams for robotics
 * - Sibling discount: code "sibling50" for $50 off
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'UTG Academy') continue;
  if (![16058, 16059, 16060].includes(Number(p.id))) continue;

  // Common fixes
  p.confirmed2026 = false;
  p.enrollmentStatus = 'Likely Coming Soon';
  p.status = 'Likely Coming Soon';
  p.priceVerified = false;
  p.isEstimate = false;
  p.urlVerified = true;
  p.category = 'STEM';
  p.indoorOutdoor = 'Both';
  p.registrationUrl = 'https://utgacademy.com/courses/?courseCategory=summer';

  const id = Number(p.id);

  if (id === 16058) {
    p.activityType = 'Coding';
    p.costNote = 'Summer 2026 pricing not yet posted. Prior summers included half-day STEM (1-4pm) + half-day outdoor (9am-12pm). Max 5 per group. Sibling discount code "sibling50" ($50 off). Contact 604-700-9931.';
    p.description = 'Summer Coding Camp at UTG Academy. Learn Python and game design using PixelPAD engine. Build interactive games. Half-day STEM indoors (1-4pm) with half-day ultimate frisbee outdoors (9am-12pm). Max 5 per group. No experience required.';
    p.tags = ['coding', 'python', 'game design', 'STEM', 'technology'];
  }

  if (id === 16059) {
    p.activityType = 'Robotics';
    p.costNote = 'Summer 2026 pricing not yet posted. Prior summers included half-day STEM + half-day outdoor activities. Teams of 2-3 for robotics. Sibling discount code "sibling50" ($50 off). Contact 604-700-9931.';
    p.description = 'Summer Robotics Camp at UTG Academy. Build and program robots from the ground up. Navigate obstacles and mazes. Teams of 2-3. Half-day STEM indoors with half-day outdoor activities. No experience required.';
    p.tags = ['robotics', 'STEM', 'technology', 'programming'];
  }

  if (id === 16060) {
    p.activityType = '3D Printing';
    p.costNote = 'Summer 2026 pricing not yet posted. Prior summers included half-day STEM + half-day outdoor activities. Max 5 per group. Sibling discount code "sibling50" ($50 off). Contact 604-700-9931.';
    p.description = 'Summer Animation & 3D Printing Camp at UTG Academy. Learn CAD software for digital design and animation. Create 3D printed projects. Max 5 per group. Half-day STEM indoors with half-day outdoor activities. No experience required.';
    p.tags = ['3D printing', 'animation', 'STEM', 'technology', 'digital art'];
  }

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`UTG Academy: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
