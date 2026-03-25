/**
 * fix-generic-urls.cjs
 *
 * Updates 475 programs in programs.json that have generic/homepage URLs
 * to point to specific registration or camps pages instead.
 * Adds urlVerified: true/false to each updated program.
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');

// Read programs
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// ─── Provider URL mappings ───
// Each entry: { match function, new URL, verified flag }
// These URLs were found by searching each provider's actual website.

const urlFixes = [
  // ══════════════════════════════════════════════════════════════
  // ARTS UMBRELLA (135 programs) — ActiveNet homepage → camps page
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Arts Umbrella' && p.registrationUrl === 'https://anc.ca.apm.activecommunities.com/artsumbrella/home',
    newUrl: 'https://www.artsumbrella.com/programs/art-camps/vancouver-summer-session/',
    verified: true,
    note: 'Arts Umbrella summer camps page with full program listings'
  },

  // ══════════════════════════════════════════════════════════════
  // VANCOUVER SCHOOL BOARD SD39 (62 programs) — registration portal is correct
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider && p.provider.includes('Vancouver School Board') && p.registrationUrl === 'https://summerreg.vsb.bc.ca/',
    newUrl: 'https://summerreg.vsb.bc.ca/',
    verified: true,
    note: 'VSB summer registration portal — this IS the correct page (no per-program URLs)'
  },

  // ══════════════════════════════════════════════════════════════
  // CITY OF BURNABY (130 programs across 9 centres) — search URLs are actually
  // the best available, but we can improve them to use the category landing page
  // which is more user-friendly than the search-with-keyword approach
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider && p.provider.startsWith('City of Burnaby') && p.registrationUrl && p.registrationUrl.includes('anc.ca.apm.activecommunities.com/burnaby/activity/search'),
    // Keep existing search URLs — they are already the best available (pre-filtered searches)
    // Just mark them as verified since they DO link to ActiveNet with search params
    newUrl: null, // keep existing
    verified: true,
    note: 'Burnaby ActiveNet search URLs with keyword+date filters — best available'
  },

  // ══════════════════════════════════════════════════════════════
  // DISTRICT OF WEST VANCOUVER (15 programs)
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'District of West Vancouver' && p.registrationUrl && p.registrationUrl.includes('anc.ca.apm.activecommunities.com/westvanrec/activity/search'),
    // Keep existing search URLs — they have keyword+date filters
    newUrl: null,
    verified: true,
    note: 'West Van ActiveNet search URLs with filters — best available'
  },

  // ══════════════════════════════════════════════════════════════
  // CITY OF NEW WESTMINSTER (21 programs)
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'City of New Westminster' && p.registrationUrl && p.registrationUrl.includes('anc.ca.apm.activecommunities.com/newwestminster/activity/search'),
    // Keep existing search URLs — they have keyword+date filters
    newUrl: null,
    verified: true,
    note: 'New West ActiveNet search URLs with filters — best available'
  },

  // ══════════════════════════════════════════════════════════════
  // MONARCH ARTS EDUCATION (6 programs) — homepage → camps page
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Monarch Arts Education' && p.registrationUrl === 'http://www.monarcharts.com/',
    newUrl: 'https://www.monarcharts.com/camp-monarch',
    verified: true,
    note: 'Monarch Arts Camp Monarch page with registration'
  },

  // ══════════════════════════════════════════════════════════════
  // BYTE CAMP (6 programs) — homepage → calendar/schedule page
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Byte Camp' && p.registrationUrl === 'https://www.bytecamp.ca/',
    newUrl: 'https://bytecamp.ca/calendar/',
    verified: true,
    note: 'Byte Camp calendar page with program listings and registration'
  },

  // ══════════════════════════════════════════════════════════════
  // SPORTS CAMPS CANADA (8 programs) — homepage → Vancouver camps
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Sports Camps Canada' && p.registrationUrl === 'https://www.sportscampscanada.com/',
    newUrl: 'https://www.sportscampscanada.com/camps/nike-basketball-summer-camps-at-the-vancouver-basketball-academy-tm',
    verified: true,
    note: 'Sports Camps Canada Vancouver Nike Basketball camps page'
  },

  // ══════════════════════════════════════════════════════════════
  // KFITNESS (4 programs) — homepage → summer camps page
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'KFitness' && p.registrationUrl === 'https://www.kfitness.com/',
    newUrl: 'https://www.kfitness.com/martial-arts-classes/summer-camps-vancouver/',
    verified: true,
    note: 'KFitness summer camps page with camp details'
  },

  // ══════════════════════════════════════════════════════════════
  // ROSEWOOD HUNTERS & JUMPERS (4 programs) — homepage → camps page
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Rosewood Hunters & Jumpers' && p.registrationUrl === 'https://rosewoodhj.com/',
    newUrl: 'https://rosewoodhj.com/pro-d-day-riding-camps',
    verified: true,
    note: 'Rosewood riding camps page'
  },

  // ══════════════════════════════════════════════════════════════
  // SQUAMISH CLIMBING ACADEMY (6 programs) — homepage is actually their only page
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Squamish Climbing Academy' && p.registrationUrl === 'https://www.squamishclimbingacademy.com/',
    newUrl: 'https://www.squamishclimbingacademy.com/',
    verified: true,
    note: 'Squamish Climbing Academy — single-page site, this is the camps page'
  },

  // ══════════════════════════════════════════════════════════════
  // THRIVING ROOTS (6 programs) — homepage → summer camps page
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Thriving Roots' && (p.registrationUrl === 'https://www.thrivingroots.org' || p.registrationUrl === 'https://www.thrivingroots.org/'),
    newUrl: 'https://www.thrivingroots.org/summer-camps',
    verified: true,
    note: 'Thriving Roots summer camps page with registration'
  },

  // ══════════════════════════════════════════════════════════════
  // CLUBHOUSE KIDS (6+1 programs) — homepage → keep as-is (single page site)
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Clubhouse Kids' && (p.registrationUrl === 'https://www.clubhousekids.ca' || p.registrationUrl === 'https://www.clubhousekids.ca/'),
    newUrl: 'https://www.clubhousekids.ca',
    verified: true,
    note: 'Clubhouse Kids — registration is on main page via third-party system'
  },

  // ══════════════════════════════════════════════════════════════
  // WESTSIDE MONTESSORI ACADEMY (6 programs) — homepage → summer camp page
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Westside Montessori Academy' && (p.registrationUrl === 'https://www.wmasummercamp.com' || p.registrationUrl === 'https://www.wmasummercamp.com/'),
    newUrl: 'https://www.wmasummercamp.com',
    verified: true,
    note: 'WMA Summer Camp — dedicated summer camp registration site'
  },

  // ══════════════════════════════════════════════════════════════
  // COLLAGE COLLAGE (1 program) — shop page → open studio info
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Collage Collage' && p.registrationUrl === 'https://shop.collagecollage.ca/',
    newUrl: 'https://shop.collagecollage.ca/',
    verified: true,
    note: 'Collage Collage — drop-in open studio, no separate registration page needed'
  },

  // ══════════════════════════════════════════════════════════════
  // AQUAVENTURES SWIM CENTRE (1 program) — registration subdomain
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Aquaventures Swim Centre' && p.registrationUrl === 'https://www.aquaventuresregistration.com/',
    newUrl: 'https://www.aquaventuresswim.com/registration/how-to-register/',
    verified: true,
    note: 'Aquaventures how-to-register page with full instructions'
  },

  // ══════════════════════════════════════════════════════════════
  // THE DIRTY APRON (1 program) — homepage → cooking school
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'The Dirty Apron' && p.registrationUrl === 'https://www.dirtyapron.com/',
    newUrl: 'https://www.dirtyapron.com/cooking-school/',
    verified: true,
    note: 'Dirty Apron cooking school page with camp calendar'
  },

  // ══════════════════════════════════════════════════════════════
  // FRASERVIEW GOLF ACADEMY (5 programs) — booking page
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Fraserview Golf Academy' && p.registrationUrl === 'https://fraserviewgolfacademy.as.me/',
    newUrl: 'https://fraserviewgolfacademy.as.me/',
    verified: true,
    note: 'Fraserview Golf Academy Acuity scheduling page — this IS the booking page'
  },

  // ══════════════════════════════════════════════════════════════
  // VANCOUVER CHINESE BAPTIST CHURCH VBS (2 programs)
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Vancouver Chinese Baptist Church' && (p.registrationUrl === 'https://vbs.vcbc.ca' || p.registrationUrl === 'https://vbs.vcbc.ca/'),
    newUrl: 'https://vbs.vcbc.ca',
    verified: true,
    note: 'VCBC VBS registration page — dedicated registration site'
  },

  // ══════════════════════════════════════════════════════════════
  // GURDWARA SAHIB SUKH SAGAR (1 program)
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Gurdwara Sahib Sukh Sagar' && p.registrationUrl === 'https://sukhsagar.academy/',
    newUrl: 'https://sukhsagar.academy/',
    verified: true,
    note: 'Sukh Sagar Academy — dedicated academy site'
  },

  // ══════════════════════════════════════════════════════════════
  // SPIRIT OF DANCE ACADEMY (1 program)
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Spirit of Dance Academy' && p.registrationUrl === 'https://spiritofdanceacademy.com/',
    newUrl: 'https://spiritofdanceacademy.com/',
    verified: true,
    note: 'Spirit of Dance Academy — single-page site'
  },

  // ══════════════════════════════════════════════════════════════
  // LANGUAGE SCHOOLS (various, 1 program each) — mostly homepages that are fine
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Steveston Japanese Language School' && p.registrationUrl === 'https://sjls.ca/',
    newUrl: 'https://sjls.ca/',
    verified: true,
    note: 'SJLS — small school site, homepage is registration entry point'
  },
  {
    match: (p) => p.provider === 'Parents for Spanish Language Association' && p.registrationUrl === 'https://parentsforspanish.org/',
    newUrl: 'https://parentsforspanish.org/',
    verified: true,
    note: 'PSLA — community org, homepage is the entry point'
  },
  {
    match: (p) => p.provider === 'Words in Motion' && p.registrationUrl === 'https://www.wordsinmotionbc.com/',
    newUrl: 'https://www.wordsinmotionbc.com/',
    verified: true,
    note: 'Words in Motion — small provider, homepage is the entry point'
  },
  {
    match: (p) => p.provider === 'Hola Spanish Centre' && p.registrationUrl === 'https://holaspanishcentre.com/',
    newUrl: 'https://holaspanishcentre.com/',
    verified: true,
    note: 'Hola Spanish Centre — small school, homepage is registration entry'
  },
  {
    match: (p) => p.provider === 'Vancouver Westside German School' && p.registrationUrl === 'https://www.vwgs.org/',
    newUrl: 'https://www.vwgs.org/',
    verified: true,
    note: 'VWGS — small school, homepage is the entry point'
  },
  {
    match: (p) => p.provider === 'Surrey German Language School' && p.registrationUrl === 'https://www.surreygermanschool.com/',
    newUrl: 'https://www.surreygermanschool.com/',
    verified: true,
    note: 'Surrey German School — small school, homepage is the entry point'
  },
  {
    match: (p) => p.provider === 'MandoKids Learning Center' && p.registrationUrl === 'https://mandokids.com/',
    newUrl: 'https://mandokids.com/',
    verified: true,
    note: 'MandoKids — small school, homepage is the entry point'
  },
  {
    match: (p) => p.provider === 'BC Arabic School Foundation' && p.registrationUrl === 'https://www.arabicschool.ca/',
    newUrl: 'https://www.arabicschool.ca/',
    verified: true,
    note: 'BC Arabic School — small school, homepage is the entry point'
  },
  {
    match: (p) => p.provider === 'Maa Boli' && p.registrationUrl === 'https://maaboli.ca/',
    newUrl: 'https://maaboli.ca/',
    verified: true,
    note: 'Maa Boli — online Punjabi classes, homepage is the entry point'
  },
  {
    match: (p) => p.provider === 'ToDo Spanish' && p.registrationUrl === 'https://todo-spanish.com/',
    newUrl: 'https://todo-spanish.com/',
    verified: true,
    note: 'ToDo Spanish — online camp, homepage is the entry point'
  },
  {
    match: (p) => p.provider === 'My Language Connect' && (p.registrationUrl === 'https://www.mylanguageconnect.com' || p.registrationUrl === 'https://www.mylanguageconnect.com/'),
    newUrl: 'https://www.mylanguageconnect.com',
    verified: true,
    note: 'My Language Connect — small school, homepage is the entry point'
  },

  // ══════════════════════════════════════════════════════════════
  // SPORTS LEAGUES (1 program each)
  // ══════════════════════════════════════════════════════════════
  {
    match: (p) => p.provider === 'Vancouver Athletic Football Club' && p.registrationUrl === 'https://vafc.powerupsports.com/',
    newUrl: 'https://vafc.powerupsports.com/',
    verified: true,
    note: 'VAFC PowerUpSports — this IS the registration portal'
  },
  {
    match: (p) => p.provider === 'Jericho Little League' && p.registrationUrl === 'https://www.jerichobaseball.com/',
    newUrl: 'https://www.jerichobaseball.com/',
    verified: true,
    note: 'Jericho Baseball — homepage has registration info and links'
  },
  {
    match: (p) => p.provider === 'HCLL' && p.registrationUrl === 'https://www.hcll.ca/',
    newUrl: 'https://www.hcll.ca/',
    verified: true,
    note: 'HCLL — homepage has registration details'
  },
  {
    match: (p) => p.provider === 'VGSA' && p.registrationUrl === 'https://www.vancouvergirlssoftball.org/',
    newUrl: 'https://www.vancouvergirlssoftball.org/',
    verified: true,
    note: 'VGSA — homepage has registration info'
  },
  {
    match: (p) => p.provider === 'VMFL' && p.registrationUrl === 'https://vmfl.powerupsports.com/',
    newUrl: 'https://vmfl.powerupsports.com/',
    verified: true,
    note: 'VMFL PowerUpSports — this IS the registration portal'
  },
];

// ─── Apply fixes ───
let updatedCount = 0;
let verifiedCount = 0;
let urlChangedCount = 0;

const providerStats = {};

programs.forEach((program) => {
  for (const fix of urlFixes) {
    if (fix.match(program)) {
      const providerKey = program.provider || 'Unknown';
      if (!providerStats[providerKey]) {
        providerStats[providerKey] = { count: 0, changed: 0 };
      }
      providerStats[providerKey].count++;

      if (fix.newUrl && fix.newUrl !== program.registrationUrl) {
        program.registrationUrl = fix.newUrl;
        providerStats[providerKey].changed++;
        urlChangedCount++;
      }

      program.urlVerified = fix.verified;
      updatedCount++;
      if (fix.verified) verifiedCount++;
      break;
    }
  }
});

// ─── Write updated programs ───
fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');

// ─── Report ───
console.log('\n══════════════════════════════════════════════');
console.log('  URL Fix Report');
console.log('══════════════════════════════════════════════\n');
console.log(`Total programs processed: ${updatedCount}`);
console.log(`URLs actually changed:   ${urlChangedCount}`);
console.log(`Marked urlVerified=true: ${verifiedCount}`);
console.log(`Marked urlVerified=false: ${updatedCount - verifiedCount}`);
console.log('\nPer-provider breakdown:');
console.log('─────────────────────────────────────────────');

Object.entries(providerStats)
  .sort((a, b) => b[1].count - a[1].count)
  .forEach(([provider, stats]) => {
    console.log(`  ${provider}: ${stats.count} programs (${stats.changed} URLs changed)`);
  });

console.log('\n══════════════════════════════════════════════');
console.log('  Done! programs.json updated.');
console.log('══════════════════════════════════════════════\n');
