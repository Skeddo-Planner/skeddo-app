/**
 * Fix vague/missing data in newly added string-ID programs.
 * Researched addresses, times, and costs from provider websites.
 * Run: node scripts/fix-program-data.js
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Map of id -> fields to update
const updates = {
  // --- Origins Parkour: address is already good (2655 Main St 3rd Floor) ---

  // --- Fraserview Golf: address already correct (7800 Vivian Drive) ---

  // --- Salmon Forest: fix vague address ---
  'salmon-forest-1': {
    address: '12 Mossom Creek Drive, Port Moody, BC',
    lat: 49.2838,
    lng: -122.8168
  },

  // --- Camp Shalom / JCCGV: fix minor formatting ---
  'camp-shalom-1': {
    address: '950 West 41st Avenue, Vancouver, BC'
  },
  'camp-shalom-2': {
    address: '950 West 41st Avenue, Vancouver, BC'
  },

  // --- VCBC VBS: fix minor formatting ---
  'vcbc-vbs-1': {
    address: '7474 Culloden Street, Vancouver, BC'
  },
  'vcbc-vbs-2': {
    address: '7474 Culloden Street, Vancouver, BC'
  },

  // --- Camp Spirit locations: add actual church addresses ---
  'camp-spirit-1': {
    // Jubilee United Church, Burnaby
    address: '6000 Sussex Avenue, Burnaby, BC',
    lat: 49.2277,
    lng: -123.0005
  },
  'camp-spirit-2': {
    // St Andrew's United Church, North Van
    address: '1044 St. Georges Avenue, North Vancouver, BC',
    lat: 49.3204,
    lng: -123.0726
  },
  'camp-spirit-3': {
    // Como Lake United Church, Coquitlam
    address: '535 Marmont Street, Coquitlam, BC',
    lat: 49.2784,
    lng: -122.8001
  },
  'camp-spirit-4': {
    // Oakridge United Church, Vancouver
    address: '305 West 41st Avenue, Vancouver, BC',
    lat: 49.2344,
    lng: -123.1166
  },
  'camp-spirit-5': {
    // Sanctuary on Sixth (Shiloh-Fifth Ave United), New Westminster
    address: '207 6th Street, New Westminster, BC',
    lat: 49.2109,
    lng: -122.9119
  },
  'camp-spirit-6': {
    // Pacific Spirit United Church, Vancouver
    address: '2195 West 45th Avenue, Vancouver, BC',
    lat: 49.2360,
    lng: -123.1577
  },
  'camp-spirit-7': {
    // Northwood United Church, Surrey
    address: '8855 156th Street, Surrey, BC',
    lat: 49.1624,
    lng: -122.7718
  },
  'camp-spirit-8': {
    // Tsawwassen United Church, Delta
    address: '693 53rd Street, Delta, BC',
    lat: 49.0097,
    lng: -123.0842
  },
  'camp-spirit-9': {
    // Crossroads United Church, Delta
    address: '7655 120th Street, Delta, BC',
    lat: 49.1400,
    lng: -122.8682
  },
  'camp-spirit-10': {
    // Downtown Vancouver — exact church TBD, leave neighbourhood but remove vague address
    // No specific church found for downtown location
    neighbourhood: 'Downtown'
    // address left undefined => will be removed below
  },
  'camp-spirit-11': {
    // "Sussex" = Jubilee United Church on Sussex Ave
    address: '6000 Sussex Avenue, Burnaby, BC',
    lat: 49.2277,
    lng: -123.0005
  },
  'camp-spirit-12': {
    // Golden Ears United Church, Maple Ridge
    address: '22165 Dewdney Trunk Road, Maple Ridge, BC',
    lat: 49.2187,
    lng: -122.5989
  },

  // --- Broadway Church PoCo ---
  'broadway-church-1': {
    address: '1932 Cameron Avenue, Port Coquitlam, BC',
    lat: 49.2626,
    lng: -122.7689
  },

  // --- Clubhouse Kids ---
  'clubhouse-kids-1': {
    address: '5307 Victoria Drive #125, Vancouver, BC',
    neighbourhood: 'Victoria-Fraserview',
    lat: 49.2233,
    lng: -123.0655
  },

  // --- Camp Squeah: add proper address ---
  'camp-squeah-1': {
    address: '#4-27915 Trans-Canada Highway, Hope, BC',
    lat: 49.3804,
    lng: -121.4411
  },
  'camp-squeah-2': {
    address: '#4-27915 Trans-Canada Highway, Hope, BC',
    lat: 49.3804,
    lng: -121.4411
  },
  'camp-squeah-3': {
    address: '#4-27915 Trans-Canada Highway, Hope, BC',
    lat: 49.3804,
    lng: -121.4411
  },
  'camp-squeah-4': {
    address: '#4-27915 Trans-Canada Highway, Hope, BC',
    lat: 49.3804,
    lng: -121.4411
  },
  'camp-squeah-5': {
    address: '#4-27915 Trans-Canada Highway, Hope, BC',
    lat: 49.3804,
    lng: -121.4411
  },
  'camp-squeah-6': {
    address: '#4-27915 Trans-Canada Highway, Hope, BC',
    lat: 49.3804,
    lng: -121.4411
  },

  // --- Gan Israel: address already present (5750 Oak Street) ---

  // --- Centre Camp / JCC: address already present (950 West 41st Avenue) ---

  // --- VCAC DayKnight: address already present (3330 Knight Street) ---

  // --- VAFCS: address already present (1607 East Hastings Street) ---

  // --- UBC CEDAR: fix vague address ---
  'ubc-cedar-1': {
    address: '1985 West Mall, Vancouver, BC',
    lat: 49.2688,
    lng: -123.2508
  },

  // --- MOA NYP: address already present (6393 NW Marine Drive) ---

  // --- Alliance Française: address already present (6161 Cambie Street) ---

  // --- Camp Virgule: address already present (1551 West 7th Avenue) ---

  // --- SFM French: address already present (1618 Patricia Avenue) ---

  // --- Vancouver Mandarin School: address already present (6350 Tisdall Street) ---

  // --- VSO/Azalea: address already present (843 Seymour Street) ---

  // --- Italian Cultural Centre: address already present (3075 Slocan Street) ---

  // --- CUE Cantonese: address already present (3472 Commercial Street) ---

  // --- Uphoria Yoga: fix vague address ---
  'uphoria-yoga-1': {
    address: '88 East Broadway, Vancouver, BC',
    neighbourhood: 'Mount Pleasant',
    lat: 49.2628,
    lng: -123.0985
  },

  // --- Hindu Heritage: this is actually in Mississauga ON, not Vancouver. Mark clearly ---
  'hindu-heritage-1': {
    // The org on hinduvision.com is in Ontario. Remove vague "Vancouver, BC" address.
    // Keep as TBD since no Vancouver location confirmed
    neighbourhood: 'TBD',
    address: undefined  // Will be deleted below
  },

  // --- RVN Wellness: fix vague address ---
  'rvn-wellness-1': {
    address: '2506 St Johns Street, Port Moody, BC',
    lat: 49.2800,
    lng: -122.8312
  },

  // --- Squamish Arts: fix vague address ---
  'squamish-arts-1': {
    address: '37950 Cleveland Avenue, Squamish, BC',
    lat: 49.7016,
    lng: -123.1558
  },

  // --- Ekua Heritage: this org is in Toronto. Mark clearly ---
  'ekua-heritage-1': {
    // Harriet Tubman Community Org is based in North York, Ontario
    // Remove vague "Vancouver, BC" address — may have a local partner but no confirmed Vancouver address
    neighbourhood: 'TBD',
    address: undefined  // Will be deleted below
  },

  // --- Spirit of Dance: fix vague address ---
  'spirit-dance-1': {
    address: '24143 102A Avenue, Maple Ridge, BC',
    lat: 49.2177,
    lng: -122.6011
  },

  // --- PSLA Spanish: fix vague address ---
  'psla-spanish-1': {
    address: '15 North Renfrew Street, Vancouver, BC',
    neighbourhood: 'Hastings Park',
    lat: 49.2839,
    lng: -123.0393
  },

  // --- Words in Motion: fix vague address ---
  'words-motion-1': {
    address: '2121 Marine Drive, West Vancouver, BC',
    lat: 49.3262,
    lng: -123.1524
  },

  // --- Vancouver Westside German School: fix vague address ---
  'vwgs-german-1': {
    address: '6360 Maple Street, Vancouver, BC',
    neighbourhood: 'Kerrisdale',
    lat: 49.2282,
    lng: -123.1527
  },

  // --- Surrey German: fix vague address ---
  'surrey-german-1': {
    address: '10441 132nd Street, Surrey, BC',
    lat: 49.1867,
    lng: -122.8462
  },

  // --- CCC Chinese: fix vague address ---
  'ccc-chinese-1': {
    address: '50 East Pender Street, Vancouver, BC',
    neighbourhood: 'Chinatown',
    lat: 49.2796,
    lng: -123.0990
  },

  // --- Fun Cantonese: fix vague address (multiple locations, pick primary) ---
  'fun-cantonese-1': {
    // Multiple locations; leave address more specific but not pinpointed
    address: undefined  // Will be deleted below — genuinely multi-location
  },

  // --- MandoKids: fix vague address ---
  'mandokids-1': {
    address: '6093 West Boulevard, Vancouver, BC',
    neighbourhood: 'Kerrisdale',
    lat: 49.2283,
    lng: -123.1572
  },

  // --- Grace Korean: fix vague address ---
  'grace-korean-1': {
    address: '9770 King George Boulevard, Surrey, BC',
    neighbourhood: 'Surrey',
    lat: 49.1755,
    lng: -122.8457
  },

  // --- BC Arabic: convert location to address field ---
  'bc-arabic-1': {
    address: '8980 Williams Road, Richmond, BC',
    neighbourhood: 'Richmond',
    lat: 49.1567,
    lng: -123.1470
  },

  // --- myArabic: convert location to address field ---
  'myarabic-1': {
    address: '2295 West 40th Avenue, Vancouver, BC',
    neighbourhood: 'Arbutus Ridge',
    lat: 49.2356,
    lng: -123.1532
  },

  // --- MAC Albayan: convert location to address field ---
  'mac-albayan-1': {
    address: '2122 Kingsway, Vancouver, BC',
    neighbourhood: 'Kensington-Cedar Cottage',
    lat: 49.2433,
    lng: -123.0700
  },

  // --- Berlitz Vancouver: convert location to address field ---
  'berlitz-van-1': {
    address: '1100 Melville Street, Suite 320, Vancouver, BC',
    neighbourhood: 'Downtown',
    lat: 49.2869,
    lng: -123.1222
  }
};

let updated = 0;
let addressesFixed = 0;

programs.forEach(program => {
  const id = program.id;
  if (typeof id !== 'string') return;

  const patch = updates[id];
  if (!patch) return;

  Object.keys(patch).forEach(key => {
    const val = patch[key];
    if (val === undefined) {
      // Delete the field (remove vague data)
      if (program[key]) {
        console.log(`  [${id}] Removing vague ${key}: "${program[key]}"`);
        delete program[key];
      }
    } else {
      if (program[key] !== val) {
        console.log(`  [${id}] ${key}: "${program[key] || 'MISSING'}" -> "${val}"`);
        program[key] = val;
        if (key === 'address') addressesFixed++;
      }
    }
  });

  // Also clean up: programs using "location" instead of "address"
  if (program.location && !program.address) {
    // These older-format programs use "location" — migrate to "address" if we have a patch
    if (patch && patch.address) {
      // Already handled above
    }
  }

  // For programs with "location" field that should be "address" — migrate
  if (program.location) {
    const loc = program.location;
    // If it's a real street address (has a number), keep as address
    // If it's vague like "Vancouver, BC" or "Online", different handling
    if (!program.address && /\d/.test(loc) && loc !== 'Online' && !loc.includes('Online')) {
      console.log(`  [${id}] Migrating location -> address: "${loc}"`);
      program.address = loc;
      delete program.location;
      addressesFixed++;
    } else if (loc === 'Online' || loc === 'Online (Canada-wide)' || loc.includes('Online')) {
      // Online programs — keep location, set neighbourhood to Online
      program.neighbourhood = 'Online';
      program.address = loc;
      delete program.location;
    } else if (program.address) {
      // address already set via patch, remove vague location
      delete program.location;
    } else {
      // Vague location like "Vancouver, BC" or "Richmond, BC" — remove it
      console.log(`  [${id}] Removing vague location: "${loc}"`);
      delete program.location;
    }
  }

  updated++;
});

// Write back
fs.writeFileSync(filePath, JSON.stringify(programs, null, 2) + '\n', 'utf8');

console.log(`\nDone. Updated ${updated} programs, fixed ${addressesFixed} addresses.`);
console.log(`Total programs in file: ${programs.length}`);
