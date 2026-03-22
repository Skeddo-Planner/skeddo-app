/**
 * add-neighbourhood-programs.cjs
 * Appends programs from underrepresented Vancouver neighbourhoods
 * to src/data/programs.json (Victoria-Fraserview, Sunset, Renfrew-Collingwood,
 * Oakridge, South Cambie, Arbutus Ridge, Grandview-Woodland, East Vancouver).
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');

const newPrograms = [
  // --- Victoria-Fraserview (currently 0) ---
  {
    id: "champlain-cc-1",
    name: "Champlain Heights Summer Day Camp",
    provider: "Champlain Heights Community Centre",
    category: "General",
    activityType: "Day Camp",
    ageMin: 6,
    ageMax: 12,
    days: "Mon-Fri",
    address: "3350 Maquinna Dr, Vancouver, BC",
    neighbourhood: "Victoria-Fraserview",
    registrationUrl: "https://anc.ca.apm.activecommunities.com/vancouver/activity/search",
    enrollmentStatus: "Coming Soon",
    registrationDate: "2026-04-08",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["day camp", "general", "victoria-fraserview"]
  },

  // --- Sunset (missing providers) ---
  {
    id: "sunset-cc-camp-1",
    name: "Sunset Community Centre Summer Day Camp",
    provider: "Sunset Community Centre",
    category: "General",
    activityType: "Day Camp",
    ageMin: 6,
    ageMax: 12,
    days: "Mon-Fri",
    address: "6810 Main St, Vancouver, BC",
    neighbourhood: "Sunset",
    registrationUrl: "https://mysunset.net/summer-day-camps-2026/",
    enrollmentStatus: "Coming Soon",
    registrationDate: "2026-04-08",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["day camp", "general", "sunset"]
  },
  {
    id: "moberly-arts-1",
    name: "Moberly Arts Creative Remix Summer Camp",
    provider: "Moberly Arts & Cultural Centre",
    category: "Arts",
    activityType: "General Arts",
    ageMin: 6,
    ageMax: 12,
    startDate: "2026-07-02",
    endDate: "2026-08-08",
    days: "Mon-Fri",
    address: "E 61st Ave & Prince Albert St, Vancouver, BC",
    neighbourhood: "Sunset",
    registrationUrl: "https://moberlyartscentre.ca",
    enrollmentStatus: "Coming Soon",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["arts", "creative", "sunset"]
  },
  {
    id: "moberly-arts-2",
    name: "Tastes & Tales of Ethiopia Camp",
    provider: "Moberly Arts & Cultural Centre",
    category: "Cultural",
    activityType: "Day Camp",
    ageMin: 6,
    ageMax: 12,
    startDate: "2026-08-11",
    endDate: "2026-08-15",
    days: "Mon-Fri",
    address: "E 61st Ave & Prince Albert St, Vancouver, BC",
    neighbourhood: "Sunset",
    registrationUrl: "https://moberlyartscentre.ca",
    enrollmentStatus: "Coming Soon",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["cultural", "cooking", "ethiopia", "sunset"]
  },
  {
    id: "svnh-camp-1",
    name: "South Vancouver NH Summer Camp",
    provider: "South Vancouver Neighbourhood House",
    category: "General",
    activityType: "Day Camp",
    ageMin: 5,
    ageMax: 12,
    address: "Victoria Dr & 49th Ave, Vancouver, BC",
    neighbourhood: "Sunset",
    registrationUrl: "https://southvan.org",
    enrollmentStatus: "Coming Soon",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["day camp", "general", "neighbourhood house", "sunset"]
  },

  // --- Renfrew-Collingwood (currently 6) ---
  {
    id: "renfrew-cc-camp-1",
    name: "Renfrew Summer Adventures Day Camp",
    provider: "Renfrew Park Community Centre",
    category: "General",
    activityType: "Day Camp",
    ageMin: 6,
    ageMax: 12,
    days: "Mon-Fri",
    address: "2929 East 22nd Ave, Vancouver, BC",
    neighbourhood: "Renfrew-Collingwood",
    registrationUrl: "https://renfrewcc.com",
    enrollmentStatus: "Coming Soon",
    registrationDate: "2026-04-08",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["day camp", "general", "renfrew-collingwood"]
  },
  {
    id: "cnh-camp-1",
    name: "Collingwood NH Summer Specialty Camps",
    provider: "Collingwood Neighbourhood House",
    category: "Multi-Activity",
    activityType: "Day Camp",
    ageMin: 6,
    ageMax: 12,
    days: "Mon-Fri",
    address: "5288 Joyce St, Vancouver, BC",
    neighbourhood: "Renfrew-Collingwood",
    registrationUrl: "https://cnh.bc.ca",
    enrollmentStatus: "Coming Soon",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["day camp", "multi-activity", "neighbourhood house", "renfrew-collingwood"]
  },
  {
    id: "thunderbird-cc-1",
    name: "Thunderbird CC Summer Day Camp",
    provider: "Thunderbird Community Centre",
    category: "General",
    activityType: "Day Camp",
    ageMin: 6,
    ageMax: 12,
    days: "Mon-Fri",
    address: "2311 Cassiar St, Vancouver, BC",
    neighbourhood: "Renfrew-Collingwood",
    registrationUrl: "https://thunderbirdcc.ca",
    enrollmentStatus: "Coming Soon",
    registrationDate: "2026-04-08",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["day camp", "general", "renfrew-collingwood"]
  },
  {
    id: "stema-van-1",
    name: "STEMA STEAM Summer Camp (Vancouver East)",
    provider: "STEMA Learning Centre",
    category: "STEM",
    activityType: "Coding & Robotics",
    ageMin: 5,
    ageMax: 12,
    address: "1025 Kingsway, Vancouver, BC",
    neighbourhood: "Renfrew-Collingwood",
    registrationUrl: "https://vancouver.stemalearning.com",
    enrollmentStatus: "Open",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["stem", "steam", "coding", "robotics", "renfrew-collingwood"]
  },
  {
    id: "frog-hollow-1",
    name: "Frog Hollow NH Kids Summer Programs",
    provider: "Frog Hollow Neighbourhood House",
    category: "General",
    activityType: "Day Camp",
    ageMin: 5,
    ageMax: 12,
    address: "2131 Renfrew St, Vancouver, BC",
    neighbourhood: "Hastings-Sunrise",
    registrationUrl: "https://froghollow.bc.ca",
    enrollmentStatus: "Coming Soon",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["day camp", "general", "neighbourhood house", "hastings-sunrise"]
  },

  // --- Oakridge (currently 6) ---
  {
    id: "marpole-oakridge-cc-1",
    name: "Marpole-Oakridge CC Summer Day Camp",
    provider: "Marpole-Oakridge Community Centre",
    category: "General",
    activityType: "Day Camp",
    ageMin: 6,
    ageMax: 12,
    days: "Mon-Fri",
    address: "990 W 59th Ave, Vancouver, BC",
    neighbourhood: "Oakridge",
    registrationUrl: "https://marpoleoakridge.org",
    enrollmentStatus: "Coming Soon",
    registrationDate: "2026-04-08",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["day camp", "general", "oakridge"]
  },

  // --- South Cambie (currently 0) ---
  {
    id: "hillcrest-cc-1",
    name: "Hillcrest Community Centre Summer Day Camp",
    provider: "Hillcrest Community Centre",
    category: "General",
    activityType: "Day Camp",
    ageMin: 6,
    ageMax: 12,
    days: "Mon-Fri",
    address: "4575 Clancy Loranger Way, Vancouver, BC",
    neighbourhood: "South Cambie",
    registrationUrl: "https://hillcrestcommunitycentre.com",
    enrollmentStatus: "Coming Soon",
    registrationDate: "2026-04-08",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["day camp", "general", "south cambie"]
  },

  // --- Arbutus Ridge (currently 0) ---
  {
    id: "arbutus-cc-1",
    name: "Arbutus Community Centre Summer Day Camp",
    provider: "Arbutus Community Centre",
    category: "General",
    activityType: "Day Camp",
    ageMin: 6,
    ageMax: 12,
    days: "Mon-Fri",
    address: "4585 West 8th Ave, Vancouver, BC",
    neighbourhood: "Arbutus Ridge",
    registrationUrl: "https://anc.ca.apm.activecommunities.com/vancouver/activity/search",
    enrollmentStatus: "Coming Soon",
    registrationDate: "2026-04-08",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["day camp", "general", "arbutus ridge"]
  },

  // --- Grandview-Woodland (missing providers) ---
  {
    id: "trout-lake-cc-1",
    name: "Trout Lake CC Summer Day Camp",
    provider: "Trout Lake Community Centre",
    category: "General",
    activityType: "Day Camp",
    ageMin: 6,
    ageMax: 12,
    days: "Mon-Fri",
    address: "3360 Victoria Dr, Vancouver, BC",
    neighbourhood: "Grandview-Woodland",
    registrationUrl: "https://troutlakecc.com",
    enrollmentStatus: "Coming Soon",
    registrationDate: "2026-04-08",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["day camp", "general", "grandview-woodland"]
  },

  // --- East Vancouver / various (missing providers) ---
  {
    id: "danceworks-1",
    name: "DanceWorks Summer Dance Camp",
    provider: "DanceWorks Performing Arts",
    category: "Performing Arts",
    activityType: "Dance",
    ageMin: 4,
    ageMax: 14,
    registrationUrl: "https://danceworksperformingarts.com",
    enrollmentStatus: "Open",
    season: "Summer 2026",
    dayLength: "Half Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["dance", "performing arts"]
  },
  {
    id: "landing-dance-1",
    name: "The Landing Dance Summer Camp",
    provider: "The Landing Dance Centre",
    category: "Performing Arts",
    activityType: "Dance",
    ageMin: 3,
    ageMax: 12,
    registrationUrl: "https://thelandingdance.com",
    enrollmentStatus: "Likely Coming Soon",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["dance", "performing arts"]
  },
  {
    id: "emily-carr-jai-1",
    name: "Emily Carr Junior Arts Institute",
    provider: "Emily Carr University",
    category: "Arts",
    activityType: "Visual Arts",
    ageMin: 13,
    ageMax: 15,
    startDate: "2026-06-29",
    endDate: "2026-07-24",
    days: "Mon-Fri",
    address: "Granville Island, Vancouver, BC",
    neighbourhood: "Granville Island",
    registrationUrl: "https://ecuad.ca",
    enrollmentStatus: "Likely Coming Soon",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["arts", "visual arts", "university", "teens"]
  },
  {
    id: "efk-van-1",
    name: "Engineering For Kids Vancouver",
    provider: "Engineering For Kids",
    category: "STEM",
    activityType: "Coding & Robotics",
    ageMin: 4,
    ageMax: 14,
    registrationUrl: "https://engineeringforkids.com/vancouver",
    enrollmentStatus: "Likely Coming Soon",
    season: "Summer 2026",
    dayLength: "Half Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["stem", "engineering", "robotics", "coding"]
  },
  {
    id: "camp-mclean-1",
    name: "Camp McLean Day Camp",
    provider: "Scouts Canada",
    category: "Outdoor",
    activityType: "Outdoor Adventure",
    ageMin: 5,
    ageMax: 11,
    registrationUrl: "https://scouts.ca/camps/camp-mclean.html",
    enrollmentStatus: "Likely Coming Soon",
    season: "Summer 2026",
    dayLength: "Full Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["outdoor", "adventure", "scouts", "nature"]
  },
  {
    id: "vmha-1",
    name: "Vancouver Minor Hockey Association",
    provider: "VMHA",
    category: "Sports",
    activityType: "Hockey",
    ageMin: 4,
    ageMax: 18,
    registrationUrl: "https://vmha.com",
    enrollmentStatus: "Open",
    season: "Year-Round",
    dayLength: "Half Day",
    confirmed2026: false,
    priceVerified: false,
    tags: ["sports", "hockey", "year-round"]
  }
];

// Read, merge, write
const existing = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf-8'));
const existingIds = new Set(existing.map(p => p.id));

let added = 0;
let skipped = 0;

for (const prog of newPrograms) {
  if (existingIds.has(prog.id)) {
    console.log(`  SKIP (duplicate id): ${prog.id}`);
    skipped++;
  } else {
    existing.push(prog);
    existingIds.add(prog.id);
    added++;
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf-8');

console.log(`\nDone! Added ${added} programs, skipped ${skipped} duplicates.`);
console.log(`Total programs now: ${existing.length}`);
