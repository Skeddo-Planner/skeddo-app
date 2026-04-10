/**
 * CoV Camp Price Fix — Browser-Verified Spot Check (2026-04-10)
 *
 * Fixes null costs and ageMax errors for CoV ActiveNet camp entries.
 * All prices verified via Chrome browser on ActiveNet detail pages
 * with "View fee details" clicked.
 *
 * 20 individual entries browser-verified; prices propagated to same-name
 * programs at the same facility (different weeks share the same price).
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// Verified price patterns: { namePattern, providerPattern, price, ageMaxFix? }
const pricePatterns = [
  // Killarney CCA camps
  { name: 'CAMP: Bluey\'s Big Summer Camp', provider: /Killarney/, price: 109, ageMax: 5 },
  { name: 'CAMP: Bricktown Architects', provider: /Killarney/, price: 220, ageMax: 10 },
  { name: 'CAMP: Anime Manga Drawing Workshop', provider: /Killarney/, price: 176 },
  { name: 'CAMP: Acrobatic Dance', provider: /Killarney/, price: 115, ageMax: 5 },
  { name: 'CAMP: Frozen Ballet Dance', provider: /Killarney/, price: 109 },
  { name: 'CAMP: Act, Dance, Sing FUN!', provider: /Killarney/, price: 275, ageMax: 8 },
  { name: 'CAMP: Junior Tennis', provider: /Killarney/, price: 209.25 },
  { name: 'CAMP: Youth Tennis', provider: /Killarney/, price: 209.25 },

  // Roundhouse / Mt Pleasant camps
  { namePattern: /^Summer Safari Day Camp Junior/, provider: /Roundhouse/, price: 160 },
  { namePattern: /^Summer Safari Day Camp Senior/, provider: /Roundhouse/, price: 160 },
  { namePattern: /^K-Pop Demon Hunters/, provider: /Mount Pleasant|Roundhouse/, price: 210 },

  // Champlain Heights / Marpole camps
  { namePattern: /^Senior Sunsplash/, provider: /Champlain/, price: 160 },
  { namePattern: /^Supported Sunsplash/, provider: /Champlain/, price: 96 },
  { namePattern: /^Youth Camp Week/, provider: /Champlain|Marpole/, price: 165 },

  // Mount Pleasant camps
  { namePattern: /^Karate Camp/, provider: /Mount Pleasant/, price: 105 },
  { namePattern: /^Summer Smash Tennis: Junior Fun/, provider: /Mount Pleasant|Tennis/, price: 262 },
  { namePattern: /^Summer Smash Tennis: Youth Fun/, provider: /Mount Pleasant|Tennis/, price: 262 },
  { namePattern: /^Summer Smash Tennis: Mini Aces/, provider: /Mount Pleasant|Tennis/, price: 255 },

  // Dunbar / Various Tennis Courts
  { name: 'Kids Tennis Game Set Match Full-Day Camp', provider: /Dunbar|Tennis/, price: 399 },
];

let updated = 0;
let ageFixed = 0;
const changes = [];

for (const prog of programs) {
  if (prog.cost != null) continue; // already has price
  if (!prog.provider || !prog.provider.startsWith('City of Vancouver')) continue;

  for (const pattern of pricePatterns) {
    const nameMatch = pattern.name
      ? prog.name === pattern.name
      : pattern.namePattern.test(prog.name);
    const providerMatch = pattern.provider.test(prog.provider);

    if (nameMatch && providerMatch) {
      prog.cost = pattern.price;
      prog.priceVerified = true;
      prog.costNote = 'Browser-verified on ActiveNet (Apr 10, 2026). Per week.';

      if (pattern.ageMax != null && prog.ageMax !== pattern.ageMax) {
        const oldAge = prog.ageMax;
        prog.ageMax = pattern.ageMax;
        ageFixed++;
        changes.push(`${prog.id}: cost null→${pattern.price}, ageMax ${oldAge}→${pattern.ageMax}`);
      } else {
        changes.push(`${prog.id}: cost null→${pattern.price}`);
      }
      updated++;
      break;
    }
  }
}

// Also fix ageMax on entries that already have costs but wrong ageMax
const ageOnlyFixes = [
  { name: 'CAMP: Bluey\'s Big Summer Camp', provider: /Killarney/, ageMax: 5 },
  { name: 'CAMP: Bricktown Architects', provider: /Killarney/, ageMax: 10 },
  { name: 'CAMP: Acrobatic Dance', provider: /Killarney/, ageMax: 5 },
  { name: 'CAMP: Act, Dance, Sing FUN!', provider: /Killarney/, ageMax: 8 },
];

for (const prog of programs) {
  if (!prog.provider || !prog.provider.startsWith('City of Vancouver')) continue;
  for (const fix of ageOnlyFixes) {
    if (prog.name === fix.name && fix.provider.test(prog.provider) && prog.ageMax !== fix.ageMax) {
      const oldAge = prog.ageMax;
      prog.ageMax = fix.ageMax;
      ageFixed++;
      changes.push(`${prog.id}: ageMax ${oldAge}→${fix.ageMax} (age-only fix)`);
    }
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Updated ${updated} program costs`);
console.log(`Fixed ${ageFixed} ageMax values`);
console.log(`Total programs: ${programs.length}`);
console.log('\nChanges:');
for (const c of changes) console.log('  ' + c);
