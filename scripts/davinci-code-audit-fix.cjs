/**
 * DaVinci Code Art Academy Audit Fix — 2026-04-09
 * Rank 241 in audit queue
 *
 * Web-verified against:
 * - https://davincicode.ca (homepage — site consistently times out on Playwright)
 * - Web search results for "DaVinci Code Art Academy North Vancouver"
 *
 * Key findings:
 * - Website times out on both Playwright and WebFetch (dynamic Divi/WordPress)
 * - Web search confirms: art classes ages 5-12, acrylic painting, collage,
 *   resin, fabric design, pottery. Located at 2-3046 Edgemont Blvd, North Van.
 * - Cannot verify current summer 2026 pricing or schedule
 * - DB cost $78 cannot be verified — setting priceVerified=false
 * - All 3 entries (half day AM, half day PM, full day) kept as-is with
 *   priceVerified=false since site is unreachable
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'DaVinci Code Art Academy') continue;
  if (![16068, 16069, 16070].includes(Number(p.id))) continue;

  // Cannot verify current pricing — site unreachable
  p.priceVerified = false;
  p.urlVerified = false;
  p.activityType = 'Art';
  p.category = 'Arts';

  p.costNote = (p.costNote || '') + ' Website (davincicode.ca) unreachable during audit — times out on Playwright and WebFetch. Price unverified. Contact academy directly. Hours: Mon-Sun 10am-8pm.';

  p.description = 'Art camp at DaVinci Code Art Academy, Edgemont Village, North Vancouver. Ages 5-12. Explore acrylic painting, collage creations, resin art, fabric design, and pottery. Led by instructors Sara Mahjouri and Farahnaz Samari.';
  p.tags = ['art', 'painting', 'pottery', 'crafts', 'summer camp'];
  p.postalCode = 'V7R 2N3';
  p.neighbourhood = 'Edgemont';

  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`DaVinci Code Art Academy: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
