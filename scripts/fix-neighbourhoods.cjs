#!/usr/bin/env node
/**
 * fix-neighbourhoods.cjs
 *
 * Fixes vague neighbourhood tags in programs.json by looking up each program's
 * address and assigning the correct specific neighbourhood.
 *
 * Vague tags fixed: "Greater Vancouver", "Surrey", "Burnaby", "North Vancouver",
 * "Richmond", "Coquitlam", "New Westminster", "West Vancouver", "Vancouver",
 * "Vancouver West", "TBD", "MISSING", "Various", "Multiple", "Green Timbers"
 *
 * Also fixes programs in non-Lower-Mainland cities that need proper city tags
 * (Hope, Okanagan, Mission, Abbotsford, Langley) — left as-is since they are
 * real locations outside metro Vancouver.
 */

const fs = require("fs");
const path = require("path");

const PROGRAMS_PATH = path.join(__dirname, "..", "src", "data", "programs.json");

// ─── ADDRESS-TO-NEIGHBOURHOOD RULES ───────────────────────────────────────────
// Each rule: { pattern (regex on address), neighbourhood }
// Order matters — first match wins.

const ADDRESS_RULES = [
  // ── VANCOUVER ──────────────────────────────────────────────────────────────
  // UBC campus
  { pattern: /Main Mall.*Vancouver/i, neighbourhood: "UBC" },
  { pattern: /UBC|University of British Columbia/i, neighbourhood: "UBC" },
  { pattern: /Chancellor Blvd.*Vancouver/i, neighbourhood: "UBC" },
  { pattern: /Lower Mall.*Vancouver/i, neighbourhood: "UBC" },
  { pattern: /Natobi Garden|UBC longhouse/i, neighbourhood: "UBC" },
  // Downtown / West End
  { pattern: /1050 Beach Ave/i, neighbourhood: "West End" },
  { pattern: /Hornby St.*Vancouver/i, neighbourhood: "Downtown" },
  { pattern: /Beach Ave.*Vancouver/i, neighbourhood: "West End" },
  // Point Grey / W 14th
  { pattern: /3990 W 14th Ave.*Vancouver/i, neighbourhood: "Point Grey" },
  { pattern: /W 14th Ave.*Vancouver/i, neighbourhood: "Point Grey" },
  // Cambie / Oakridge
  { pattern: /6161 Cambie St/i, neighbourhood: "Cambie" },
  { pattern: /5251 Oak St.*Vancouver/i, neighbourhood: "Oakridge" },
  // Hadden Park / Ogden Ave = Kitsilano
  { pattern: /1905 Ogden Ave|Hadden Park/i, neighbourhood: "Kitsilano" },
  // Eric Hamber = Riley Park area
  { pattern: /960 W 33rd Ave.*Vancouver|Eric Hamber/i, neighbourhood: "Riley Park" },
  // Shaughnessy
  { pattern: /Marguerite St.*Vancouver|Shaughnessy/i, neighbourhood: "Shaughnessy" },
  // Dunbar-Southlands area
  { pattern: /Crown St.*Vancouver|Jules Quesnel/i, neighbourhood: "Dunbar-Southlands" },
  // Strathcona / Oppenheimer
  { pattern: /Scarboro.*Vancouver|Oppenheimer/i, neighbourhood: "Strathcona" },
  // Kingsford-Smith = South Vancouver
  { pattern: /Elliott St.*Vancouver|Kingsford-Smith|Waverley/i, neighbourhood: "South Vancouver" },
  // Norma Rose Point = UBC area
  { pattern: /Ortona Ave.*Vancouver|Norma Rose Point/i, neighbourhood: "UBC" },
  // Douglas Elementary = Sunrise area
  { pattern: /Brigadoon Ave.*Vancouver|Douglas Elementary/i, neighbourhood: "Hastings-Sunrise" },
  // Generic Vancouver addresses — try to map by street
  { pattern: /Vancouver.*West|Vancouver West/i, neighbourhood: "West Point Grey" },

  // ── NORTH VANCOUVER ────────────────────────────────────────────────────────
  // Marine Dr (lower area)
  { pattern: /Marine Dr.*North Vancouver|Marine Drive.*North Vancouver/i, neighbourhood: "Central Lonsdale" },
  // Victory Ship Way = Lower Lonsdale / Shipyards
  { pattern: /Victory Ship Way/i, neighbourhood: "Lower Lonsdale" },
  // Harbourside Drive = Lower Lonsdale
  { pattern: /Harbourside Dr/i, neighbourhood: "Lower Lonsdale" },
  // Mount Seymour Parkway
  { pattern: /Mount Seymour Pkwy|Mount Seymour Parkway|Mt Seymour/i, neighbourhood: "Mount Seymour" },
  // Frederick Rd = Central Lonsdale / Upper Lonsdale
  { pattern: /Frederick Rd.*North Vancouver/i, neighbourhood: "Central Lonsdale" },
  // Mahon Ave = Central Lonsdale
  { pattern: /Mahon Ave.*North Vancouver/i, neighbourhood: "Central Lonsdale" },
  // Roosevelt Crescent = Lynn Creek area
  { pattern: /Roosevelt Cr.*North Vancouver/i, neighbourhood: "Lynn Creek" },
  // Generic North Vancouver with no address
  { pattern: /^North Vancouver, BC$/i, neighbourhood: "Central Lonsdale" },

  // ── WEST VANCOUVER ─────────────────────────────────────────────────────────
  // Collingwood / Wentworth Ave
  { pattern: /2605 Wentworth Ave/i, neighbourhood: "Ambleside" },
  // Ambleside Park / Marine Drive WV
  { pattern: /1150 Marine Dr.*West Vancouver|Ambleside Park/i, neighbourhood: "Ambleside" },
  // Mulgrave / Cypress Lane
  { pattern: /2330 Cypress Lane|Mulgrave/i, neighbourhood: "British Properties" },
  // Morven Drive / Collingwood Morven
  { pattern: /70 Morven Dr/i, neighbourhood: "British Properties" },
  // Mathers Ave = Sentinel Hill / WV centre
  { pattern: /1750 Mathers Ave/i, neighbourhood: "West Vancouver" },
  // Irwin Park / Ridgeview = general WV
  { pattern: /Irwin Park|Ridgeview.*West Vancouver/i, neighbourhood: "West Vancouver" },
  // WV Community Centre
  { pattern: /West Vancouver Community Centre/i, neighbourhood: "Ambleside" },

  // ── BURNABY ────────────────────────────────────────────────────────────────
  // SFU / Burnaby Mountain
  { pattern: /SFU|University Dr.*Burnaby|Burnaby Mountain/i, neighbourhood: "Burnaby Mountain" },
  { pattern: /Tower Road.*Burnaby|University Highlands/i, neighbourhood: "Burnaby Mountain" },
  // Canada Way / Burnaby Winter Club = Deer Lake area
  { pattern: /4990 Canada Way|Burnaby Winter Club/i, neighbourhood: "Deer Lake" },
  { pattern: /Canada Way.*Burnaby/i, neighbourhood: "Deer Lake" },
  // Kingsway near Metrotown
  { pattern: /4789 Kingsway.*Burnaby/i, neighbourhood: "Metrotown" },
  { pattern: /Kingsway.*Burnaby/i, neighbourhood: "Metrotown" },
  // Southoaks Crescent = Deer Lake / Nikkei area
  { pattern: /Southoaks Cres.*Burnaby|6688 Southoaks/i, neighbourhood: "Deer Lake" },
  // Capitol Hill
  { pattern: /Holdom Ave.*Burnaby|Capitol Hill/i, neighbourhood: "Capitol Hill" },
  // Sprott Street / Scotiabarn = Cariboo
  { pattern: /Sprott St.*Burnaby|Scotiabarn/i, neighbourhood: "Cariboo" },
  // Brandon St / Inman Elementary = Edmonds
  { pattern: /Brandon St.*Burnaby|Inman Elementary/i, neighbourhood: "Edmonds" },
  // Halifax St / Parkcrest = North Burnaby
  { pattern: /Halifax St.*Burnaby|Parkcrest/i, neighbourhood: "North Burnaby" },
  // Watling St / South Slope Elementary
  { pattern: /Watling St.*Burnaby|South Slope Elementary/i, neighbourhood: "South Slope" },
  // Sardis St / Chaffey-Burke
  { pattern: /Sardis St.*Burnaby|Chaffey-Burke/i, neighbourhood: "Edmonds" },
  // Sperling Ave
  { pattern: /Sperling Ave.*Burnaby|Sperling Elementary/i, neighbourhood: "Sperling-Duthie" },
  // Gilmore Ave / Kitchener Elementary
  { pattern: /Gilmore Ave.*Burnaby|Kitchener Elementary/i, neighbourhood: "South Slope" },
  // Irmin St / Nelson Elementary = Metrotown
  { pattern: /Irmin St.*Burnaby|Nelson Elementary/i, neighbourhood: "Metrotown" },
  // Marlborough Ave
  { pattern: /Marlborough Ave.*Burnaby|Marlborough Elementary/i, neighbourhood: "North Burnaby" },
  // Erickson Dr / Cameron Elementary = Burnaby Mountain
  { pattern: /Erickson Dr.*Burnaby|Cameron Elementary/i, neighbourhood: "Burnaby Mountain" },
  // Mission Ave / Taylor Park = North Burnaby
  { pattern: /Mission Ave.*Burnaby|Taylor Park/i, neighbourhood: "North Burnaby" },
  // Government Rd / Seaforth = North Burnaby
  { pattern: /Government Rd.*Burnaby|Seaforth/i, neighbourhood: "North Burnaby" },
  // Duthie Ave / Montecito = Sperling-Duthie
  { pattern: /Duthie Ave.*Burnaby|Montecito/i, neighbourhood: "Sperling-Duthie" },
  // Forest Grove Dr = Burnaby Mountain
  { pattern: /Forest Grove Dr.*Burnaby|Forest Grove Elementary/i, neighbourhood: "Burnaby Mountain" },
  // Smith Ave / Cascade Heights = Edmonds
  { pattern: /4343 Smith Ave.*Burnaby|Cascade Heights/i, neighbourhood: "Edmonds" },
  // Beaverbrook Cres / Stoney Creek = North Burnaby
  { pattern: /Beaverbrook Cres.*Burnaby|Stoney Creek/i, neighbourhood: "North Burnaby" },
  // Multiple Burnaby schools = leave as Multiple Locations
  { pattern: /Multiple Burnaby school/i, neighbourhood: "Multiple Locations" },
  { pattern: /Multiple Burnaby secondary/i, neighbourhood: "Multiple Locations" },
  // Green Timbers Way = Green Timbers / Whalley area in Surrey
  { pattern: /Green Timbers Way.*Surrey/i, neighbourhood: "Green Timbers" },

  // ── SURREY ─────────────────────────────────────────────────────────────────
  // 13750 88 Ave = Whalley / Surrey Arts Centre
  { pattern: /13750 88 Ave.*Surrey/i, neighbourhood: "Whalley" },
  // 88 Ave / 96 Ave area = Whalley
  { pattern: /88 Ave.*Surrey|96 Ave.*Surrey/i, neighbourhood: "Whalley" },
  // Old Yale Road = Fleetwood / Cloverdale area
  { pattern: /Old Yale.*Surrey/i, neighbourhood: "Fleetwood" },
  // 154 St area = Guildford / Panorama area
  { pattern: /2124 154 St.*Surrey/i, neighbourhood: "Guildford" },
  // 57 Ave / 14988 = South Surrey / Panorama area
  { pattern: /14988 57 Ave.*Surrey/i, neighbourhood: "Panorama" },
  // 56A Ave / Cloverdale
  { pattern: /56A? Ave.*Surrey.*Cloverdale|Cloverdale.*Surrey/i, neighbourhood: "Cloverdale" },
  // 152 St / Guildford
  { pattern: /152 St.*Surrey|Guildford.*Surrey/i, neighbourhood: "Guildford" },
  // 72 Ave / Newton
  { pattern: /72 Ave.*Surrey|Newton.*Surrey/i, neighbourhood: "Newton" },
  // 160 St / Fleetwood
  { pattern: /160 St.*Surrey|Fleetwood.*Surrey/i, neighbourhood: "Fleetwood" },
  // 68 Ave / Clayton
  { pattern: /68 Ave.*Surrey.*Clayton|Clayton.*Surrey/i, neighbourhood: "Clayton" },
  // Multiple Surrey Recreation Centres
  { pattern: /Multiple Surrey Recreation/i, neighbourhood: "Multiple Locations" },
  // Various Surrey schools
  { pattern: /Various Surrey school/i, neighbourhood: "Multiple Locations" },

  // ── RICHMOND ───────────────────────────────────────────────────────────────
  // Bird Rd = East Richmond / Chaoyin area
  { pattern: /10111 Bird Rd.*Richmond/i, neighbourhood: "East Richmond" },
  // Triangle Road / Richmond Ice Centre = City Centre area
  { pattern: /14140 Triangle.*Richmond|Richmond Ice Centre/i, neighbourhood: "City Centre" },
  // Granville Ave / Burnett Secondary = City Centre
  { pattern: /Granville Ave.*Richmond|Burnett Secondary/i, neighbourhood: "City Centre" },
  // Brighouse / Byng / Tomsett = City Centre area
  { pattern: /Brighouse|Byng.*Richmond|Tomsett.*Richmond/i, neighbourhood: "City Centre" },
  // Boyd Secondary / MacNeill Secondary = general Richmond
  { pattern: /Boyd Secondary|MacNeill Secondary.*Richmond/i, neighbourhood: "City Centre" },
  // Alberta Rd = Broadmoor
  { pattern: /9460 Alberta Rd.*Richmond/i, neighbourhood: "Broadmoor" },
  // Carscallen Rd = South Arm
  { pattern: /Carscallen Rd.*Richmond/i, neighbourhood: "South Arm" },
  // Olafsen Ave = Steveston area
  { pattern: /Olafsen Ave.*Richmond/i, neighbourhood: "Steveston" },
  // Generic Richmond, BC
  { pattern: /^Richmond, BC$/i, neighbourhood: "City Centre" },
  { pattern: /Richmond, BC/i, neighbourhood: "City Centre" },

  // ── COQUITLAM ──────────────────────────────────────────────────────────────
  // Sharpe St / Parkland Players = Central Coquitlam (near Town Centre Park)
  { pattern: /900 Sharpe St.*Coquitlam/i, neighbourhood: "Central Coquitlam" },
  // Como Lake Ave = Central Coquitlam
  { pattern: /Como Lake Ave.*Coquitlam/i, neighbourhood: "Central Coquitlam" },
  // Sheffield Ave = Maillardville
  { pattern: /Sheffield Ave.*Coquitlam/i, neighbourhood: "Maillardville" },
  // Emerson St = Maillardville
  { pattern: /Emerson St.*Coquitlam/i, neighbourhood: "Maillardville" },
  // Coquitlam location (generic)
  { pattern: /Coquitlam location/i, neighbourhood: "Central Coquitlam" },
  // Multiple schools in Coquitlam
  { pattern: /Multiple schools in Coquitlam/i, neighbourhood: "Multiple Locations" },

  // ── NEW WESTMINSTER ────────────────────────────────────────────────────────
  // Richmond St = Queens Park area
  { pattern: /331 Richmond St.*New Westminster/i, neighbourhood: "Queens Park" },
  // 8th Avenue / Lord Tweedsmuir = Moody Park
  { pattern: /1714 8th Ave.*New Westminster|Lord Tweedsmuir/i, neighbourhood: "Moody Park" },
  // Salter St / Queen Elizabeth Elementary = Queensborough
  { pattern: /921 Salter St.*New Westminster|Queen Elizabeth Elementary.*New Westminster/i, neighbourhood: "Queensborough" },
  // Generic New Westminster
  { pattern: /^New Westminster, BC$/i, neighbourhood: "Downtown New Westminster" },
  { pattern: /New Westminster, BC/i, neighbourhood: "Downtown New Westminster" },

  // ── DELTA ──────────────────────────────────────────────────────────────────
  { pattern: /Nordel Ct.*Delta|Planet Ice Delta/i, neighbourhood: "North Delta" },
  { pattern: /Delta, BC/i, neighbourhood: "Delta" },

  // ── NORTH VAN OUTDOORS — address says NV but tagged "Greater Vancouver" ──
  { pattern: /North Vancouver, BC.*North Vancouver Outdoors/i, neighbourhood: "Mount Seymour" },
  { pattern: /North Vancouver.*BC/i, neighbourhood: "Central Lonsdale" },
];

// ── PROVIDER-BASED RULES (for programs with NO usable address) ─────────────
const PROVIDER_RULES = [
  // North Van
  { provider: /Camp Spirit.*North Van/i, neighbourhood: "Central Lonsdale" },
  { provider: /NSMLA|North Shore Minor Lacrosse/i, neighbourhood: "Central Lonsdale" },
  { provider: /Capilano RFC/i, neighbourhood: "Central Lonsdale" },
  // Burnaby
  { provider: /Camp Spirit.*Burnaby Jubilee/i, neighbourhood: "Edmonds" },
  { provider: /Camp Spirit.*Burnaby Sussex/i, neighbourhood: "North Burnaby" },
  { provider: /Sprouting Chefs/i, neighbourhood: "Metrotown" },
  { provider: /BMWC|Burnaby Mountain Wrestling/i, neighbourhood: "Burnaby Mountain" },
  // Coquitlam
  { provider: /Camp Spirit.*Coquitlam/i, neighbourhood: "Central Coquitlam" },
  // Surrey
  { provider: /Camp Spirit.*Surrey/i, neighbourhood: "Whalley" },
  { provider: /MCNA Islamic/i, neighbourhood: "Newton" },
  { provider: /Surrey German/i, neighbourhood: "Surrey City Centre" },
  // New Westminster
  { provider: /Camp Spirit.*New Westminster/i, neighbourhood: "Moody Park" },
  // West Vancouver
  { provider: /WVFHC|West Vancouver Field Hockey/i, neighbourhood: "Ambleside" },
  { provider: /Words in Motion/i, neighbourhood: "Ambleside" },
  // Vancouver (MISSING tag)
  { provider: /Clubhouse Kids/i, neighbourhood: "Riley Park" },
  { provider: /VCB|Vancouver Community Baseball/i, neighbourhood: "Hastings-Sunrise" },
  { provider: /VGSA|Vancouver Girls Softball/i, neighbourhood: "Riley Park" },
  { provider: /VMFL|Vancouver Mainland Football/i, neighbourhood: "East Vancouver" },
  { provider: /BC Lions/i, neighbourhood: "East Vancouver" },
  { provider: /RAW Sports/i, neighbourhood: "East Vancouver" },
  { provider: /VMLA|Vancouver Minor Lacrosse/i, neighbourhood: "Riley Park" },
  { provider: /Vancouver Hawks/i, neighbourhood: "UBC" },
  { provider: /Coast Wrestling/i, neighbourhood: "Kitsilano" },
  { provider: /Westsider Wrestling/i, neighbourhood: "West Point Grey" },
  { provider: /VSC|Vancouver Skating Club/i, neighbourhood: "Riley Park" },
  { provider: /Hive Climbing/i, neighbourhood: "Mount Pleasant" },
  { provider: /Pacific Institute of Culinary/i, neighbourhood: "Granville Island" },
  { provider: /Young Moviemakers/i, neighbourhood: "Kitsilano" },
  { provider: /Vancouver Film School/i, neighbourhood: "Downtown" },
  { provider: /Cinematheque/i, neighbourhood: "Downtown" },
  { provider: /BC Forensic League/i, neighbourhood: "Downtown" },
  { provider: /DanceWorks/i, neighbourhood: "Kitsilano" },
  { provider: /Landing Dance/i, neighbourhood: "Granville Island" },
  { provider: /Engineering For Kids.*Vancouver/i, neighbourhood: "Kitsilano" },
  { provider: /Scouts Canada.*McLean/i, neighbourhood: "North Vancouver" },
  { provider: /VMHA|Vancouver Minor Hockey/i, neighbourhood: "Riley Park" },
  // TBD programs
  { provider: /Guru Harkrishan/i, neighbourhood: "Surrey City Centre" },
  { provider: /Hindu Heritage/i, neighbourhood: "Kensington-Cedar Cottage" },
  { provider: /Uphoria Yoga/i, neighbourhood: "Kitsilano" },
  { provider: /Harriet Tubman|Ekua.*Heritage/i, neighbourhood: "Strathcona" },
  // Various / Multiple / Vancouver
  { provider: /VAFC|Vancouver Athletic Football/i, neighbourhood: "Multiple Locations" },
  { provider: /Fun Cantonese/i, neighbourhood: "Multiple Locations" },
  { provider: /Grace Korean/i, neighbourhood: "Kensington-Cedar Cottage" },
  { provider: /Vancouver Westside German/i, neighbourhood: "West Point Grey" },
  // I-SPARC is province-wide
  { provider: /I-SPARC/i, neighbourhood: "Multiple Locations" },
];

// ── NAME-BASED RULES (for camps identifiable by name) ──────────────────────
const NAME_RULES = [
  { name: /North Van.*St Andrew/i, neighbourhood: "Central Lonsdale" },
  { name: /Camp McLean/i, neighbourhood: "Lynn Valley" },
  { name: /Khalsa School Gurmat Camp/i, neighbourhood: "Multiple Locations" },
];

// ── VAGUE NEIGHBOURHOODS TO FIX ─────────────────────────────────────────────
const VAGUE_NEIGHBOURHOODS = new Set([
  "Greater Vancouver", "Surrey", "Burnaby", "North Vancouver",
  "Richmond", "Coquitlam", "New Westminster", "West Vancouver",
  "Vancouver", "Vancouver West", "TBD", "Various", "Multiple",
]);

// Also fix programs with missing neighbourhood
const MISSING_CHECK = true;

// ─── MAIN ───────────────────────────────────────────────────────────────────

function main() {
  const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, "utf8"));

  let fixedCount = 0;
  let unfixedCount = 0;
  const unfixed = [];
  const changes = {}; // old → new → count
  const newNeighbourhoods = new Set();

  for (const prog of programs) {
    const currentHood = prog.neighbourhood || "";
    const isMissing = !currentHood;
    const isVague = VAGUE_NEIGHBOURHOODS.has(currentHood);

    if (!isVague && !isMissing) continue;

    // Skip "Online" and "Multiple Locations" — these are intentional
    if (currentHood === "Online" || currentHood === "Multiple Locations") continue;

    const address = prog.address || "";
    const provider = prog.provider || "";
    const name = prog.name || "";
    let newHood = null;

    // 1. Try address rules (only if address looks real, not "NO ADDRESS" or empty)
    if (address && address !== "NO ADDRESS" && !address.startsWith("TBD")) {
      for (const rule of ADDRESS_RULES) {
        // Test against full address + provider combo for NV Outdoors
        const testStr = address + " " + provider;
        if (rule.pattern.test(testStr)) {
          newHood = rule.neighbourhood;
          break;
        }
      }
    }

    // 2. Try name rules
    if (!newHood) {
      for (const rule of NAME_RULES) {
        if (rule.name.test(name)) {
          newHood = rule.neighbourhood;
          break;
        }
      }
    }

    // 3. Try provider rules
    if (!newHood) {
      for (const rule of PROVIDER_RULES) {
        if (rule.provider.test(provider) || rule.provider.test(name)) {
          newHood = rule.neighbourhood;
          break;
        }
      }
    }

    if (newHood && newHood !== currentHood) {
      const key = `"${currentHood || "MISSING"}" → "${newHood}"`;
      changes[key] = (changes[key] || 0) + 1;
      prog.neighbourhood = newHood;
      newNeighbourhoods.add(newHood);
      fixedCount++;
    } else if (!newHood) {
      unfixedCount++;
      unfixed.push({ id: prog.id, hood: currentHood, address, provider: provider.substring(0, 40), name: name.substring(0, 50) });
    }
  }

  // Write updated programs
  fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + "\n");

  // Report
  console.log("\n=== NEIGHBOURHOOD FIX REPORT ===\n");
  console.log(`Fixed: ${fixedCount} programs`);
  console.log(`Unfixed: ${unfixedCount} programs\n`);

  console.log("Changes made:");
  Object.entries(changes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([change, count]) => {
      console.log(`  ${count}x ${change}`);
    });

  if (unfixed.length > 0) {
    console.log(`\nUnfixed programs (${unfixed.length}):`);
    unfixed.forEach((p) => {
      console.log(`  id=${p.id} | hood="${p.hood}" | addr="${p.address}" | ${p.provider}`);
    });
  }

  // Show all distinct neighbourhoods that now exist
  const allHoods = new Set();
  programs.forEach((p) => { if (p.neighbourhood) allHoods.add(p.neighbourhood); });
  console.log(`\nAll unique neighbourhoods after fix (${allHoods.size}):`);
  [...allHoods].sort().forEach((h) => console.log(`  ${h}`));
}

main();
