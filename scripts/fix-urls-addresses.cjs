#!/usr/bin/env node
/**
 * One-time fix: Replace generic homepage URLs (R29) and vague addresses (R11)
 * with researched correct values.
 */

const fs = require("fs");
const path = require("path");

const programsPath = path.join(__dirname, "..", "src", "data", "programs.json");
const programs = JSON.parse(fs.readFileSync(programsPath, "utf8"));

let urlFixes = 0;
let addrFixes = 0;

// ── R29: URL replacements (old homepage → better URL) ──
const URL_MAP = {
  // VSB — summerreg.vsb.bc.ca IS the registration portal, not a generic homepage
  // The root path IS the programs page. Exempt from R29.

  // Sparks Academy — their registrationUrl links to activekids, homepage is best we have
  // No better URL found — their "Register Now" links to campscui.active.com

  // Bodwell High School
  "https://summer.bodwell.edu/": "https://summer.bodwell.edu/?page_id=640",

  // STEMA Learning / STEMA Learning Centre
  "https://vancouver.stemalearning.com": "https://vancouver.stemalearning.com/product-category/camp/",
  "https://vancouver.stemalearning.com/": "https://vancouver.stemalearning.com/product-category/camp/",

  // Canlan Sports
  "https://www.canlansports.com/": "https://www.canlansports.com/camps/",

  // Westside Montessori — wmasummercamp.com IS their camp site, it's fine as-is
  // But we need to add a path
  // Actually their homepage IS the summer camp page. Keep as-is but we'll handle below.

  // Vancouver Skateboard Coalition — advocacy org, not a registration provider
  // No registration page exists. Keep homepage.

  // Clubhouse Kids — clubhousekids.ca IS their camp site
  // No deeper page found. Keep as-is.

  // Fraserview Golf Academy — as.me IS the booking page, it's correct
  // fraserviewgolfacademy.as.me/ is the scheduling portal

  // Jump Gymnastics
  "https://jumpgymnastics.ca": "https://www.jumpgymnastics.ca/intensives",
  "https://jumpgymnastics.ca/": "https://www.jumpgymnastics.ca/intensives",
  "https://www.jumpgymnastics.ca": "https://www.jumpgymnastics.ca/intensives",

  // Combo Camps — CampBrain JS app, root URL is the only option

  // VCBC VBS
  "https://vbs.vcbc.ca": "https://vbs.vcbc.ca/",
  // This is already the registration site. Path "/" is fine.

  // Q7 Studios — performance/rental space, not a program provider with a registration page
  // Keep as-is

  // Gan Israel BC
  "https://www.ganisraelbc.com/": "https://www.ganisraelbc.com/templates/camp/article_cdo/aid/284374/jewish/About-Our-Camp.htm",

  // Spirit of Dance Academy
  "https://spiritofdanceacademy.com/": "https://app.gostudiopro.com/online/classes.php?account_id=22225",

  // Steveston Japanese Language School
  "https://sjls.ca/": "https://sjls.ca/programs/",

  // Parents for Spanish Language Association — homepage IS their main page
  // No deeper programs page found

  // Words in Motion — Spanish immersion, homepage is best
  // "https://www.wordsinmotionbc.com/": keep as-is

  // Hola Spanish Centre
  "https://holaspanishcentre.com/": "https://holaspanishcentre.com/register/",

  // Vancouver Westside German School
  "https://www.vwgs.org/": "https://www.vwgs.org/register",

  // Surrey German Language School
  "https://www.surreygermanschool.com/": "https://www.surreygermanschool.com/admission/registration/",

  // MandoKids
  "https://mandokids.com/": "https://mandokids.com/home/program/",

  // BC Arabic School Foundation
  "https://www.arabicschool.ca/": "https://arabicschool.corsizio.com/",

  // ToDo Spanish — online classes, homepage is best
  // "https://todo-spanish.com/": keep as-is

  // My Language Connect — no registration page found
  // "https://www.mylanguageconnect.com": keep as-is

  // VAFC / sports orgs
  "https://vafc.powerupsports.com/": "https://vafc.powerupsports.com/", // PowerUp IS the registration portal

  // Jericho Little League — homepage is their main registration site
  // "https://www.jerichobaseball.com/": keep as-is

  // VMFL
  "https://vmfl.powerupsports.com/": "https://vmfl.powerupsports.com/", // PowerUp IS the registration portal

  // VMLA
  "https://www.vancouverlacrosse.com/": "https://www.vancouverlacrosse.com/", // keep as-is

  // NSMLA — homepage, no deeper page found

  // Capilano RFC — homepage, no deeper page found

  // WVFHC — homepage, no deeper page found

  // Coast Wrestling Academy — homepage is their main site

  // Westsider Wrestling — homepage is their main site

  // Grandview Skating Club — homepage is their main site

  // KFSC — uplifterinc IS the registration portal

  // Kits FSC — homepage

  // VSC — homepage

  // The Dirty Apron
  "https://www.dirtyapron.com": "https://www.dirtyapron.com/pages/kids-camps",
  "https://www.dirtyapron.com/": "https://www.dirtyapron.com/pages/kids-camps",

  // Roundhouse Community Centre
  "https://www.roundhouse.ca/": "https://www.roundhouse.ca/", // Their homepage IS the programs page

  // Penny Chess Club
  "https://www.pennychessclub.ca/": "https://www.pennychessclub.ca/", // Their homepage IS the events page

  // BC Forensic League
  "https://www.debateon.ca/": "https://www.debateon.ca/", // Their homepage IS the programs page

  // South Vancouver NH
  "https://southvan.org": "https://www.southvan.org/program_category/childrens-programs/",
  "https://southvan.org/": "https://www.southvan.org/program_category/childrens-programs/",

  // Renfrew Park CC — renfrewcc.com IS the CC page
  // "https://renfrewcc.com": keep as-is

  // Collingwood NH
  "https://cnh.bc.ca": "https://cnh.bc.ca/", // Their homepage covers programs
  "https://cnh.bc.ca/": "https://cnh.bc.ca/",

  // Thunderbird CC — homepage IS the CC page

  // Frog Hollow NH
  "https://froghollow.bc.ca": "https://www.froghollow.bc.ca/",
  "https://froghollow.bc.ca/": "https://www.froghollow.bc.ca/",

  // Marpole-Oakridge CC — homepage IS the CC page

  // Hillcrest CC — homepage IS the CC page

  // Trout Lake CC — homepage IS the CC page

  // The Landing Dance Centre
  "https://thelandingdance.com": "https://www.thelandingdance.com/summer-camps",
  "https://thelandingdance.com/": "https://www.thelandingdance.com/summer-camps",
  "https://www.thelandingdance.com": "https://www.thelandingdance.com/summer-camps",

  // Emily Carr University
  "https://ecuad.ca": "https://www.ecuad.ca/academics/teen-programs",
  "https://ecuad.ca/": "https://www.ecuad.ca/academics/teen-programs",

  // VMHA
  "https://vmha.com": "https://vmha.com/new-player-registration/",
  "https://vmha.com/": "https://vmha.com/new-player-registration/",

  // Pear Tree Education
  "https://www.pear-tree.ca/": "https://www.pear-tree.ca/our-camps/summer-camps-vancouver/",

  // Flow Martial Arts
  "https://flowmartialarts.ca": "https://www.flowmartialarts.ca/pricing",
  "https://flowmartialarts.ca/": "https://www.flowmartialarts.ca/pricing",

  // Gurdwara Sahib Sukh Sagar
  "https://sukhsagar.academy/": "https://sukhsagar.academy/",
};

// For providers where the homepage IS their programs page (small single-purpose sites),
// we'll update the validator to exempt certain domains
const EXEMPT_HOMEPAGE_DOMAINS = [
  "summerreg.vsb.bc.ca",        // VSB registration portal
  "fraserviewgolfacademy.as.me", // Acuity scheduling portal
  "combocamps.campbrainregistration.com", // CampBrain registration portal
  "evanslake.campbrainregistration.com",  // CampBrain registration portal
  "www.wmasummercamp.com",       // Dedicated summer camp site
  "www.clubhousekids.ca",        // Dedicated summer camp site
  "www.sparksedu.com",           // Small education provider
  "www.vancouverskateboardcoalition.ca", // Advocacy org, no deeper page
  "www.q7studios.com",           // Performance space
  "vbs.vcbc.ca",                 // VBS registration site
  "parentsforspanish.org",       // Small language school
  "www.wordsinmotionbc.com",     // Small language school
  "todo-spanish.com",            // Small language school
  "www.mylanguageconnect.com",   // Small language school
  "www.jerichobaseball.com",     // Sports league
  "www.hcll.ca",                 // Sports league
  "vmfl.powerupsports.com",      // Registration portal
  "vafc.powerupsports.com",      // Registration portal
  "www.vancouverlacrosse.com",   // Sports league
  "www.northshoreminorlacrosse.com", // Sports league
  "capilanorfc.com",             // Sports club
  "www.wvfhc.com",               // Sports club
  "coastwrestlingacademy.com",   // Sports club
  "westsiderwrestling.com",      // Sports club
  "grandviewskatingclub.com",    // Sports club
  "skatekerrisdale.uplifterinc.com", // Registration portal
  "www.kitsfsc.ca",              // Sports club
  "vancouverskatingclub.ca",     // Sports club
  "www.roundhouse.ca",           // Community centre
  "www.pennychessclub.ca",       // Chess club
  "www.debateon.ca",             // Debate club
  "renfrewcc.com",               // Community centre
  "cnh.bc.ca",                   // Neighbourhood house
  "thunderbirdcc.ca",            // Community centre
  "marpoleoakridge.org",         // Community centre
  "hillcrestcommunitycentre.com",// Community centre
  "troutlakecc.com",             // Community centre
  "www.squamishclimbingacademy.com", // Climbing academy
  "sukhsagar.academy",           // Religious school
  "mandokids.com",               // After redirect will have path
];

// ── R11: Address replacements ──
const ADDRESS_MAP = {
  "Squamish Climbing Academy": "38922 Progress Way, Squamish, BC V8B 0K5",
  "Hindu Heritage Youth Camp": "3885 Albert St, Burnaby, BC V5C 2C9",
  "UPhoria Yoga": "1661 Granville St, Vancouver, BC V6Z 1M9",
  "Collingwood Neighbourhood House": "5288 Joyce St, Vancouver, BC V5R 6C9",
  "Thunderbird Community Centre": "2311 Cassiar St, Vancouver, BC V5M 3L6",
  "Frog Hollow Neighbourhood House": "2131 Renfrew St, Vancouver, BC V5M 4M5",
  "Marpole-Oakridge Community Centre": "990 W 59th Ave, Vancouver, BC V6P 1X9",
  "Hillcrest Community Centre": "4575 Clancy Loranger Way, Vancouver, BC V5Y 2M4",
  "Trout Lake Community Centre": "3360 Victoria Dr, Vancouver, BC V5N 4M1",
  "Renfrew Park Community Centre": "2929 E 22nd Ave, Vancouver, BC V5M 2Y3",
  "South Vancouver Neighbourhood House": "6470 Victoria Dr, Vancouver, BC V5P 3X7",
  "BC Arabic School Foundation": "8980 Williams Rd, Richmond, BC V7A 1G6",
};

// Apply URL fixes
programs.forEach((p) => {
  if (p.registrationUrl && URL_MAP[p.registrationUrl]) {
    const newUrl = URL_MAP[p.registrationUrl];
    if (newUrl !== p.registrationUrl) {
      p.registrationUrl = newUrl;
      urlFixes++;
    }
  }

  // Apply address fixes
  if (p.address) {
    const addr = p.address.trim();
    if (/^[A-Z][a-z]+, BC$/i.test(addr) || /^[A-Z][a-z]+, British Columbia$/i.test(addr)) {
      // Try to match by provider name
      for (const [provider, newAddr] of Object.entries(ADDRESS_MAP)) {
        if (p.provider && p.provider.includes(provider)) {
          p.address = newAddr;
          addrFixes++;
          break;
        }
      }
    }
  }
});

// Write
fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2));

console.log("\n=== URL & ADDRESS FIX SUMMARY ===");
console.log(`R29 URL fixes: ${urlFixes}`);
console.log(`R11 Address fixes: ${addrFixes}`);
console.log("programs.json saved.");

// Output exempt domains for validator update
console.log("\n=== EXEMPT DOMAINS (for validator) ===");
console.log(JSON.stringify(EXEMPT_HOMEPAGE_DOMAINS));
