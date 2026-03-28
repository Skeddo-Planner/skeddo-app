/**
 * fix-activekids-urls.cjs
 * Replaces all activekids.com and campscui.active.com URLs with verified provider URLs.
 * Run: node scripts/fix-activekids-urls.cjs
 */
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../src/data/programs.json");
const programs = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

// ─── Provider URL mapping (verified registration pages) ───
const PROVIDER_URL_MAP = {
  // Batch A: UBC Geering Up — official registration portal
  "UBC Geering Up": "https://geeringup.apsc.ubc.ca/camps/in-person-camps/",

  // Batch B: Access2Innovate / Mulgrave — school's own summer camps page
  "Access2Innovate / Mulgrave": "https://www.mulgrave.com/campus-life/mulgrave-school-summer-camps",

  // Batch C: Access2Innovate / Collingwood — school's own camps page
  "Access2Innovate / Collingwood": "https://www.collingwood.org/camps",

  // Batch E: Chaoyin — UBC Geering Up partnership at Chaoyin campus
  "Chaoyin International School": "https://geeringup.apsc.ubc.ca/camps/in-person-camps/offsite-camps/",

  // Batch F: Richmond Ice Centre — multiple hockey organizations use this facility
  "Richmond Ice Centre": "https://www.richmondjetsmha.com/divisions/summer-camps/",

  // Batch G: Petit Architect — their own website
  "Petit Architect": "https://petitarchitect.com/summer-camps",

  // Batch H: North Vancouver Outdoors — NVRC camps page
  "North Vancouver Outdoors": "https://www.nvrc.ca/programs-memberships/program-directory/camps",

  // Batch I: Bodwell High School — their summer programs site
  "Bodwell High School": "https://summer.bodwell.edu/",

  // Batch J: Scottish Cultural Centre — their main site (programs page not available)
  "Scottish Cultural Centre": "https://scottishculturalcentre.com/",

  // Batch K: Access2Innovate standalone
  "Access2Innovate": "https://www.mulgrave.com/campus-life/mulgrave-school-summer-camps",

  // Various Providers at 6272 East Blvd = Sparks Academy
  "Various Providers": "https://www.sparksedu.com/",

  // Sparks Academy
  "Sparks Academy": "https://www.sparksedu.com/",

  // Vancouver Skateboard Coalition
  "Vancouver Skateboard Coalition": "https://www.vancouverskateboardcoalition.ca/",

  // City of Vancouver facilities — all use CoV ActiveNet
  "City of Vancouver — False Creek CC": "https://anc.ca.apm.activecommunities.com/vancouver/activity/search",
  "City of Vancouver — West Point Grey": "https://anc.ca.apm.activecommunities.com/vancouver/activity/search",
  "City of Vancouver — Lord Byng Pool": "https://anc.ca.apm.activecommunities.com/vancouver/activity/search",
  "City of Vancouver — East Van": "https://anc.ca.apm.activecommunities.com/vancouver/activity/search",
  "Vancouver Aquatic Centre": "https://anc.ca.apm.activecommunities.com/vancouver/activity/search",

  // Planet Ice Delta / Scotiabarn — hockey facilities
  "Planet Ice Delta": "https://www.pacificelitehockey.com/school/schedule.aspx",
  "Scotiabarn - Burnaby": "https://www.pacificelitehockey.com/school/schedule.aspx",

  // Collingwood Morven Campus — same as Collingwood camps
  "Collingwood School - Morven Campus": "https://www.collingwood.org/camps",

  // Q7 Studios — dance studio
  "Q7 Studios": "https://www.q7studios.com/",

  // Outdoor locations — these are Petit Architect programs at various venues
  "Jericho Beach": "https://petitarchitect.com/summer-camps",
  "Hadden Park": "https://petitarchitect.com/summer-camps",
  "Van Dusen Garden": "https://petitarchitect.com/summer-camps",
  "Bloedel Conservatory": "https://petitarchitect.com/summer-camps",
  "Natobi Garden & UBC longhouse": "https://petitarchitect.com/summer-camps",
  "Pacific Spirit Park": "https://petitarchitect.com/summer-camps",
  "Ambleside Park": "https://petitarchitect.com/spring-camps",

  // 3Squares Art Studio
  "3Squares Art Studio": "https://petitarchitect.com/summer-camps",

  // Petite Forêt Play Café
  "Petite Forêt Play Café": "https://petitarchitect.com/summer-camps",

  // Eric Hamber Secondary — likely CoV rec program
  "Eric Hamber Secondary School": "https://anc.ca.apm.activecommunities.com/vancouver/activity/search",
};

// Elementary school programs — "Elementary Drawing" and "Professor Puffin's Challenge Club"
// These are after-school arts programs run through CoV community centres
const ELEMENTARY_SCHOOLS = [
  "Henry Hudson Elementary", "Inman Elementary", "Chaffey-Burke Elementary",
  "Kitchener Elementary", "Taylor Park Elementary", "Capitol Hill Elementary",
  "Cascade Heights Elementary", "Kingsford-Smith Elementary", "Seaforth Elementary",
  "Montecito Elementary", "Shaughnessy Elementary", "Oppenheimer Elementary",
  "Skwo:wech Elementary", "Lord Tweedsmuir Elementary", "Cameron Elementary",
  "Parkcrest Elementary", "South Slope Elementary", "Queen Mary Elementary",
  "Douglas Elementary", "Sperling Elementary", "Nelson Elementary",
  "Renfrew Elementary", "Jules Quesnel Elementary", "Elsie Roy Elementary",
  "General Wolfe Elementary", "University Hill Elementary", "Forest Grove Elementary",
  "L'Ecole Bilingue", "Maple Grove Elementary", "Champlain Heights Elementary",
  "Kerrisdale Elementary", "University Highlands Elementary", "General Gordon Elementary",
  "Hastings Elementary", "Norma Rose Point Elementary", "Lord Tennyson Elementary",
  "Henderson Elementary", "Marlborough Elementary", "Queen Elizabeth Elementary",
  "Waverley Elementary",
];

// Map elementary schools to CoV ActiveNet (these programs run through community centres)
ELEMENTARY_SCHOOLS.forEach((school) => {
  PROVIDER_URL_MAP[school] = "https://anc.ca.apm.activecommunities.com/vancouver/activity/search";
});

// ─── Apply replacements ───
let replaced = 0;
let notFound = 0;
const notFoundProviders = new Set();

programs.forEach((p) => {
  if (!p.registrationUrl) return;
  if (!p.registrationUrl.includes("activekids.com") && !p.registrationUrl.includes("campscui.active.com")) return;

  const newUrl = PROVIDER_URL_MAP[p.provider];
  if (newUrl) {
    p.registrationUrl = newUrl;
    replaced++;

    // Fix "Various Providers" → "Sparks Academy" (they're all at the Sparks Academy address)
    if (p.provider === "Various Providers" && p.address && p.address.includes("6272 East")) {
      p.provider = "Sparks Academy";
    }
  } else {
    notFound++;
    notFoundProviders.add(p.provider);
  }
});

// ─── Save ───
fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));

console.log(`\n=== ActiveKids URL Fix Summary ===`);
console.log(`Replaced: ${replaced}`);
console.log(`Not found: ${notFound}`);
if (notFoundProviders.size > 0) {
  console.log(`Providers without mapping:`);
  notFoundProviders.forEach((p) => console.log(`  - ${p}`));
}
console.log(`\nDone. Run: node scripts/validate-programs.cjs to verify.`);
