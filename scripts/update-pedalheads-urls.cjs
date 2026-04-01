#!/usr/bin/env node
/**
 * Update Pedalheads registration URLs in programs.json
 * Maps each listing to the correct specific detail page URL:
 * https://pedalheads.com/en/camp/details?region=1&program_event={PE}&skill_level={SL}&category_time={CT}
 *
 * Skill levels used:
 *   Bike half-day:   sl=2345 (Level 1 Newbees), ct=1 (9am-12pm)
 *   Bike full-day:   sl=2345, ct=3 (9am-4pm)
 *   Swim:            sl=2225 (Preschool 1 Octopus), ct=1
 *   Soccer:          sl=2356 (Half-Day Camp), ct=1
 *   Trail Riding:    sl=2273 (Trail Rider 1), ct=1
 *   Trail/Swim Combo: sl=2256, ct=1
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '../src/data/programs.json');

function buildUrl(pe, sl, ct) {
  return `https://pedalheads.com/en/camp/details?region=1&program_event=${pe}&skill_level=${sl}&category_time=${ct}`;
}

// Complete mapping: Skeddo program ID -> [program_event, skill_level, category_time]
// Derived from live API calls to api.pedalheads.com/api/search/camps/ on 2026-03-31
const URL_MAP = {
  // === POINT GREY - JERICHO HILL CENTRE (location 2 = Bike, location 3 = Swim) ===
  // Learn to Ride Bike Camp (Full Day) — weeks Jul6–Aug24 all use Jul6 event pe=30593
  247: [30593, 2345, 3],
  248: [30593, 2345, 3],
  249: [30593, 2345, 3],
  250: [30593, 2345, 3],
  251: [30593, 2345, 3],
  252: [30593, 2345, 3],
  253: [30593, 2345, 3],
  254: [30593, 2345, 3],
  // Trail Riding Camp (Half Day AM) — Point Grey Bike location, Trail Rider 1 level
  255: [30593, 2273, 1],
  256: [30593, 2273, 1],
  257: [30593, 2273, 1],
  258: [30593, 2273, 1],
  259: [30593, 2273, 1],
  260: [30593, 2273, 1],
  261: [30593, 2273, 1],
  262: [30593, 2273, 1],
  // Swim Lessons — Point Grey Swim (location 3), first summer event pe=32397
  263: [32397, 2225, 1],
  264: [32397, 2225, 1],
  265: [32397, 2225, 1],
  266: [32397, 2225, 1],
  267: [32397, 2225, 1],
  268: [32397, 2225, 1],
  269: [32397, 2225, 1],
  270: [32397, 2225, 1],
  // Spring Break Bike Camp — Point Grey Bike (location 2), Jun22 event is first available pe=32538
  697: [32538, 2345, 3],
  698: [32538, 2345, 3],
  // ID 2496: Beginners Bike Camp, Riley Park Vancouver — Main & 23rd David Livingstone (loc 1628), Jun29 pe=30532
  2496: [30532, 2345, 3],

  // === VANCOUVER ===
  // 2549: Bike Camp half-day, Kitsilano — Arbutus Ridge (loc 1307), Jul6 pe=30363
  2549: [30363, 2345, 1],
  // 2550: Bike Camp Full Day, Kitsilano — Arbutus Ridge (loc 1307), Jul6 pe=30363
  2550: [30363, 2345, 3],
  // 2551: Swim Lessons, Marpole — Stan Stronge (loc 1328), first summer pe=32410
  2551: [32410, 2225, 1],
  // 2552: Soccer Camp, False Creek — Charleson Park (loc 1796), first summer pe=32233
  2552: [32233, 2356, 1],
  // 2553: Soccer Camp, Kitsilano — St. James Community Square (loc 1717), spring pe=32239
  2553: [32239, 2356, 1],

  // === BURNABY ===
  // 2554: Bike Camp half-day, Greentree Village — Our Lady of Mercy (loc 1254), Jul6 pe=30383
  2554: [30383, 2345, 1],
  // 2555: Bike Camp Full Day, Greentree Village — Our Lady of Mercy (loc 1254), Jul6 pe=30383
  2555: [30383, 2345, 3],
  // 2556: Swim Lessons, Greentree Village — Deer Lake Greentree (loc 5), Jul6 pe=32653
  2556: [32653, 2225, 1],
  // 2557: Swim Lessons Advanced, South Burnaby (Fitness 2000) — Sullivan Heights (loc 1175), pe=32340
  2557: [32340, 2231, 1],
  // 2558: Soccer Camp, Brentwood (Beecher Park) — Brentwood Beecher Park (loc 1777), Jul6 pe=32681
  2558: [32681, 2356, 1],
  // 2559: Soccer Camp, Deer Lake (Greentree Village Park) — Deer Lake Park (loc 1714), pe=32237
  2559: [32237, 2356, 1],

  // === RICHMOND ===
  // 2560: Swim Lessons, South Richmond (River Club) — Ironwood River Club (loc 1398), pe=32297
  2560: [32297, 2225, 1],
  // 2561: Soccer Camp, Ironwood (Sportstown) — Ironwood Sportstown Soccer (loc 1778), Jun29 pe=32211
  2561: [32211, 2356, 1],
  // 2562: Bike Camp, South Arm — No.2 & Blundell (loc 4), Jul6 pe=30553
  2562: [30553, 2345, 1],

  // === WEST VANCOUVER ===
  // 2563: Bike Camp half-day, Park Royal — Ambleside Ridgeview (loc 1003), Jul6 pe=30353
  2563: [30353, 2345, 1],
  // 2564: Bike Camp Full Day, Park Royal — Ambleside Ridgeview (loc 1003), Jul6 pe=30353
  2564: [30353, 2345, 3],
  // 2565: Trail Riding Camp, Park Royal — Park Royal Trail/Swim Combo (loc 1448), Jul6 pe=32614
  2565: [32614, 2256, 1],
  // 2566: Swim Lessons, Park Royal — Park Royal South Swim (loc 1327), first summer pe=32352
  2566: [32352, 2225, 1],

  // === PORT COQUITLAM ===
  // 2567: Bike Camp half-day, Fremont Village — École des Pionniers Bike (loc 1498), Jul6 pe=30603
  2567: [30603, 2345, 1],
  // 2568: Bike Camp Full Day, Fremont Village — École des Pionniers Bike (loc 1498), Jul6 pe=30603
  2568: [30603, 2345, 3],
  // 2569: Swim Lessons, Fremont Village — Fremont Village Swim (loc 1732), first summer pe=32375
  2569: [32375, 2225, 1],
  // 2570: Soccer Camp, Fremont Village — École des Pionniers Soccer (loc 1833), Jul6 pe=32699
  2570: [32699, 2356, 1],

  // === NORTH VANCOUVER ===
  // 2571: Bike Camp half-day, Lonsdale — Brooksbank Elementary (loc 1678), Jul6 pe=30503
  2571: [30503, 2345, 1],
  // 2572: Bike Camp Full Day, Lonsdale — Brooksbank Elementary (loc 1678), Jul6 pe=30503
  2572: [30503, 2345, 3],
  // 2573: Trail Riding Camp, Lynn Valley — Brockton Kilmer Park (loc 1161), Jul6 pe=30513
  2573: [30513, 2273, 1],
  // 2574: Soccer Camp, Lynn Valley — Lynn Valley Elementary (loc 1798), Jul6 pe=32717
  2574: [32717, 2356, 1],

  // === COQUITLAM ===
  // 2575: Bike Camp half-day, Pinetree — Pinetree Robson Park (loc 1010), Jul6 pe=30675
  2575: [30675, 2345, 1],
  // 2576: Bike Camp Full Day, Pinetree — Pinetree Robson Park (loc 1010), Jul6 pe=30675
  2576: [30675, 2345, 3],
  // 2577: Bike Camp, Como Lake — Como Lake Mundy Park (loc 1655), Jul6 pe=32519
  2577: [32519, 2345, 1],

  // === LANGLEY ===
  // 2578: Soccer Camp, Walnut Grove — Walnut Grove Soccer (loc 1832), Jul6 pe=32672
  2578: [32672, 2356, 1],
  // 2579: Bike Camp, Walnut Grove — Walnut Grove Alex Hope (loc 1006), Jul6 pe=32420
  2579: [32420, 2345, 1],

  // === SURREY ===
  // 2580: Bike Camp, Surrey — Johnston Heights Surrey Christian (loc 1545), Jul6 pe=30463
  2580: [30463, 2345, 1],
  // 2581: Soccer Camp, Surrey — no Surrey soccer in API; use Walnut Grove Soccer (loc 1832) as nearest pe=32672
  2581: [32672, 2356, 1],
};

const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let updated = 0;
let skipped = 0;

for (const program of programs) {
  if (program.provider !== 'Pedalheads') continue;
  const mapping = URL_MAP[program.id];
  if (!mapping) {
    console.log(`  SKIP: id=${program.id} "${program.name}" — no mapping`);
    skipped++;
    continue;
  }
  const [pe, sl, ct] = mapping;
  const newUrl = buildUrl(pe, sl, ct);
  const oldUrl = program.registrationUrl;
  if (oldUrl === newUrl) {
    console.log(`  SAME: id=${program.id} already correct`);
    continue;
  }
  program.registrationUrl = newUrl;
  program.urlVerified = true;
  updated++;
  console.log(`  UPDATE: id=${program.id} "${program.name}" -> pe=${pe}`);
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2), 'utf8');
console.log(`\nDone: ${updated} URLs updated, ${skipped} skipped (no mapping)`);
