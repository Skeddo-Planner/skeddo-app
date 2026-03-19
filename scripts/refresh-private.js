/**
 * Skeddo — Private Provider Program Refresh Script
 *
 * Scrapes camp/program pages from private providers (non-municipal) to
 * detect changes in pricing, dates, enrollment status, and availability.
 *
 * Strategy:
 *   1. Fetch each provider's camp page HTML
 *   2. Extract structured data (prices, dates, ages, enrollment status)
 *   3. Compare with existing data in Supabase
 *   4. Update changed fields
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/refresh-private.js
 */

import { createClient } from "@supabase/supabase-js";

// ─── Environment ───────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const RATE_LIMIT_MS = 1000; // 1 second between requests — be very polite
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Provider Registry ───────────────────────────────────────
// Each provider has a camp page URL and a parsing strategy.
// Providers using known booking platforms get specialized parsers.

const PROVIDERS = [
  // ══════════════════════════════════════════════════════════════
  // ARTS & CREATIVE — Visual Arts, Dance, Fashion, Photography
  // ══════════════════════════════════════════════════════════════
  { name: "Arts Umbrella", url: "https://www.artsumbrella.com/summer-camps/", platform: "generic" },
  { name: "4Cats Art Studio", url: "https://4cats.com/camps/", platform: "generic" },
  { name: "Vancouver Art Gallery", url: "https://www.vanartgallery.bc.ca/learn/kids-and-families", platform: "generic" },
  { name: "Boogaloo Academy", url: "https://www.boogalooacademy.com/camps", platform: "generic" },
  { name: "The Cut Design Academy", url: "https://www.thecutfashionacademy.com/summer-camps", platform: "generic" },
  { name: "Shoreline Studios", url: "https://www.shoreline-studios.com/summer-camps", platform: "generic" },
  { name: "Paintlounge", url: "https://www.paintlounge.ca/camps", platform: "generic" },
  { name: "Petit Architect", url: "https://www.petitarchitect.com/camps", platform: "generic" },
  { name: "Monarch Arts Education", url: "https://www.monarcharts.com/summer-camps", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // PERFORMING ARTS — Dance, Theatre, Circus
  // ══════════════════════════════════════════════════════════════
  { name: "Dance Co", url: "https://www.danceco.com/summer-camps", platform: "generic" },
  { name: "The Happening Dance", url: "https://www.thehappeningdance.com/camps", platform: "generic" },
  { name: "Harbour Dance Centre", url: "https://www.harbourdance.com/summer-dance-camps/", platform: "generic" },
  { name: "Vancouver Performing Stars", url: "https://www.performingstars.ca/summer-camps", platform: "generic" },
  { name: "Vancouver Circus School", url: "https://www.vancouvercircusschool.ca/summer-camps", platform: "generic" },
  { name: "West Coast Circus", url: "https://www.westcoastcircus.ca/summer-camps", platform: "generic" },
  { name: "Bard on the Beach", url: "https://www.bardonthebeach.org/education/young-shakespeareans/", platform: "generic" },
  { name: "Lights Up Musical Theatre", url: "https://www.lightsuptheatre.ca/summer-camp", platform: "generic" },
  { name: "Theatrix Youtheatre Society", url: "https://www.theatrixyoutheatre.com/summer-camps", platform: "generic" },
  { name: "Vancouver Young Actors School", url: "https://www.vancouveryoungactorsschool.com/summer-camps", platform: "generic" },
  { name: "Camp Cue", url: "https://www.campcue.com/summer-camps", platform: "generic" },
  { name: "StageKidz", url: "https://www.stagekidz.ca/summer-camps", platform: "generic" },
  { name: "The Stage Musical Theatre", url: "https://www.thestagenewwest.ca/summer-camps", platform: "generic" },
  { name: "Presentation House Theatre", url: "https://www.phtheatre.org/education/summer-camps/", platform: "generic" },
  { name: "This World's Ours Centre", url: "https://www.thisworldsours.com/summer-camps", platform: "generic" },
  { name: "Place des Arts", url: "https://www.placedesarts.ca/summer-camps", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // MUSIC
  // ══════════════════════════════════════════════════════════════
  { name: "VSO School of Music", url: "https://www.vsoschoolofmusic.ca/summer-music-camps/", platform: "generic" },
  { name: "Ava Music & Art Centre", url: "https://www.avamusic.com/summer-camps", platform: "generic" },
  { name: "Musicworks Canada", url: "https://www.musicworkscanada.com/summer-camps", platform: "generic" },
  { name: "Deep Cove Music", url: "https://www.deepcovemusic.com/summer-camps", platform: "generic" },
  { name: "Vancouver Academy of Music", url: "https://www.vam.ca/summer-programs/", platform: "generic" },
  { name: "School of Rock", url: "https://www.schoolofrock.com/vancouver/summer-camps", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // STEM / TECH / CODING
  // ══════════════════════════════════════════════════════════════
  { name: "Brainstem Learning", url: "https://www.brainstemlearning.ca/summer-camps", platform: "generic" },
  { name: "Byte Camp", url: "https://www.bytecamp.ca/summer-camps/", platform: "generic" },
  { name: "Code Ninjas", url: "https://www.codeninjas.com/vancouver-bc-ca/camps", platform: "generic" },
  { name: "Steamoji", url: "https://www.steamoji.com/summer-camps", platform: "generic" },
  { name: "Stema Learning Center", url: "https://www.stemalearning.com/summer-camps", platform: "generic" },
  { name: "STEMA Learning", url: "https://www.stemalearning.com/summer-camps", platform: "generic" },
  { name: "Ultimate Coders", url: "https://ultimatecoders.ca/summer-camps", platform: "generic" },
  { name: "KiddoSTEAM Academy", url: "https://www.kiddosteam.ca/summer-camps", platform: "generic" },
  { name: "STEM Camp", url: "https://www.stemcamp.ca/british-columbia/", platform: "generic" },
  { name: "Zebra Robotics", url: "https://www.zebrarobotics.com/summer-camps", platform: "generic" },
  { name: "Science Alive", url: "https://www.sciencealive.ca/summer-camps", platform: "generic" },
  { name: "VISST", url: "https://www.visst.ca/summer-camps", platform: "generic" },
  { name: "Kingcrest Academy", url: "https://www.kingcrestacademy.com/summer-camps", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // SPORTS — Team Sports
  // ══════════════════════════════════════════════════════════════
  { name: "Whitecaps FC", url: "https://whitecapsfcyouth.com/programs/summer-camps/", platform: "generic" },
  { name: "Royal City Soccer Club", url: "https://www.royalsoccer.com/summer-camps/", platform: "generic" },
  { name: "Vancouver All Stars Baseball", url: "https://www.vancouverallstars.ca/summer-camps", platform: "generic" },
  { name: "Free Kick FC", url: "https://www.freekickfc.com/summer-camps", platform: "generic" },
  { name: "Pacific Coast Volleyball Club", url: "https://www.pacificcoastvolleyballclub.com/camps", platform: "generic" },
  { name: "Smash Volleyball", url: "https://www.smashvball.com/camps", platform: "generic" },
  { name: "3D Basketball", url: "https://www.3dbasketball.net/camps", platform: "generic" },
  { name: "New Westminster Soccer Club", url: "https://www.newwestsc.ca/summer-camps", platform: "generic" },
  { name: "SportBall", url: "https://www.sportball.ca/vancouver/camps/", platform: "generic" },
  { name: "Sports Camps Canada", url: "https://www.sportscampscanada.com/summer-camps", platform: "generic" },
  { name: "Canlan Sports", url: "https://www.canlansports.com/summer-camps", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // SPORTS — Gymnastics, Martial Arts, Individual
  // ══════════════════════════════════════════════════════════════
  { name: "Jump Gymnastics", url: "https://www.jumpgymnastics.ca/summer-camps", platform: "generic" },
  { name: "Flicka Gymnastics", url: "https://www.flickagymclub.com/summer-camps", platform: "generic" },
  { name: "Phoenix Gymnastics", url: "https://www.phoenixgym.ca/summer-camps", platform: "generic" },
  { name: "White Rock Gymnastics", url: "https://www.whiterockgym.org/summer-camps", platform: "generic" },
  { name: "My Gym", url: "https://www.mygym.com/vancouver/camps", platform: "generic" },
  { name: "Exceleration", url: "https://excelerationtriclub.ca/summer-camps/", platform: "generic" },
  { name: "Dynamo Fencing", url: "https://www.dynamofencing.com/summer-camps", platform: "generic" },
  { name: "Art of Kickboxing", url: "https://www.artofkickboxing.ca/summer-camps", platform: "generic" },
  { name: "Third Eye Martial Arts", url: "https://www.temartialarts.com/summer-camps", platform: "generic" },
  { name: "Roll Jiu Jitsu Academy", url: "https://www.rjja.ca/summer-camps", platform: "generic" },
  { name: "Metro Taekwondo Studios", url: "https://www.metrotkdstudios.com/camps", platform: "generic" },
  { name: "SC Kim's Taekwondo", url: "https://www.sckimstaekwondo.com/summer-camps", platform: "generic" },
  { name: "KFitness", url: "https://www.kfitness.com/summer-camps", platform: "generic" },
  { name: "Excel Martial Arts", url: "https://www.martialartsportcoquitlam.com/summer-camps", platform: "generic" },
  { name: "Wayland Sports", url: "https://www.waylandsports.com/summer-camps", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // SPORTS — Racquet, Tennis, Badminton
  // ══════════════════════════════════════════════════════════════
  { name: "Vancouver Lawn Tennis Club", url: "https://www.vanlawn.com/summer-camps", platform: "generic" },
  { name: "Shuttlesport Badminton Academy", url: "https://www.shuttlesport.com/summer-camps", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // SPORTS — Climbing
  // ══════════════════════════════════════════════════════════════
  { name: "The Hive Climbing", url: "https://www.hiveclimbing.com/summer-camps/", platform: "generic" },
  { name: "Squamish Climbing Academy", url: "https://www.squamishclimbingacademy.com/summer-camps", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // OUTDOOR / WATER / ADVENTURE
  // ══════════════════════════════════════════════════════════════
  { name: "Pedalheads", url: "https://www.pedalheads.com/programs/summer-camps", platform: "generic" },
  { name: "MacSailing", url: "https://www.macsailing.com/youth-sailing-camps/", platform: "generic" },
  { name: "Windsure Adventure Watersports", url: "https://www.windsure.com/summer-camps/", platform: "generic" },
  { name: "Deep Cove Kayak", url: "https://www.deepcovekayak.com/summer-camps/", platform: "generic" },
  { name: "Jericho Beach Kayak", url: "https://www.jerichobeachkayak.com/summer-camps", platform: "generic" },
  { name: "Bowen Island Sea Kayaking", url: "https://www.bowenislandkayaking.com/camps", platform: "generic" },
  { name: "Rosewood Hunter Jumper", url: "https://www.rosewoodhj.com/summer-camps", platform: "generic" },
  { name: "Mountain Skills Academy", url: "https://www.mountainskillsacademy.com/summer-camps", platform: "generic" },
  { name: "Mt Seymour", url: "https://mtseymour.ca/summer-camps", platform: "generic" },
  { name: "Mount Seymour", url: "https://mtseymour.ca/summer-camps", platform: "generic" },
  { name: "WildPlay Element Parks", url: "https://www.wildplay.com/summer-camps", platform: "generic" },
  { name: "Fireside Adventures", url: "https://www.firesideadventures.ca/summer-camps", platform: "generic" },
  { name: "Woods and Waves Outdoor Learning", url: "https://woodsandwaves.ca/summer-camps", platform: "generic" },
  { name: "Camp Qwanoes", url: "https://www.qwanoes.ca/summer-camp/", platform: "generic" },
  { name: "Timberline Ranch", url: "https://www.timberlineranch.com/summer-camp/", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // NATURE / ECO / OUTDOOR EDUCATION
  // ══════════════════════════════════════════════════════════════
  { name: "Soaring Eagle Nature School", url: "https://soaringeaglenatureschool.org/summer-camp/", platform: "generic" },
  { name: "Thriving Roots", url: "https://www.thrivingroots.org/summer-camps", platform: "generic" },
  { name: "Stanley Park Ecology Society", url: "https://www.stanleyparkecology.ca/programs/camps/", platform: "generic" },
  { name: "Room to Roam Outdoor Learning", url: "https://www.roomtoroam.ca/summer-camps", platform: "generic" },
  { name: "Saplings Outdoor Program", url: "https://www.saplingsoutdoorprogram.ca/summer-camps", platform: "generic" },
  { name: "Sea Smart School Society", url: "https://www.seasmartschool.com/summer-camps", platform: "generic" },
  { name: "Muddy Boot Prints", url: "https://muddybootprints.ca/summer-camps", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // GENERAL / MULTI-ACTIVITY / DAY CAMPS
  // ══════════════════════════════════════════════════════════════
  { name: "YMCA of Greater Vancouver", url: "https://www.gv.ymca.ca/day-camps", platform: "generic" },
  { name: "JCC of Greater Vancouver", url: "https://www.jccgv.com/day-camps/", platform: "generic" },
  { name: "Rainforest Adventure Camps", url: "https://www.rfcamps.com/summer-camps", platform: "generic" },
  { name: "Clubhouse Kids", url: "https://www.clubhousekids.ca/summer-camps", platform: "generic" },
  { name: "Funderland", url: "https://www.funderland.ca/summer-camps", platform: "generic" },
  { name: "Extra Steps", url: "https://www.extrasteps.ca/summer-camps", platform: "generic" },
  { name: "LDS Society", url: "https://ldsociety.ca/summer-camps", platform: "generic" },
  { name: "Thrive Kids Canada", url: "https://www.thrivekidscanada.ca/summer-camps", platform: "generic" },
  { name: "CTS Youth Society", url: "https://www.ctsyouthsociety.com/summer-camps", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // EDUCATION / ACADEMIC / LANGUAGE
  // ══════════════════════════════════════════════════════════════
  { name: "Westside Montessori Academy", url: "https://www.wmasummercamp.com/", platform: "generic" },
  { name: "Burnaby Family Life", url: "https://www.burnabyfamilylife.org/summer-camps", platform: "generic" },
  { name: "Renaissance Academy", url: "https://www.renaissanceacademy.ca/summer-camps", platform: "generic" },
  { name: "Dharma Kids Centre", url: "https://www.dharmakids.ca/summer-camps", platform: "generic" },
  { name: "Parkland Players", url: "https://www.parklandplayers.com/summer-camps", platform: "generic" },
  { name: "Alliance Francaise Vancouver", url: "https://www.alliancefrancaise.ca/summer-camps", platform: "generic" },
  { name: "Crocodile Mandarin", url: "https://www.crocodilemandarin.com/summer-camps", platform: "generic" },
  { name: "LWL Education", url: "https://www.lwleducation.com/summer-camps", platform: "generic" },
  { name: "FDT Academy", url: "https://www.fdtacademy.com/summer-camps", platform: "generic" },
  { name: "Christiane's Lyceum", url: "https://www.christianneslyceum.com/summer-camps", platform: "generic" },
  { name: "Aspire Learning Academy", url: "https://www.aspiremathacademy.com/summer-camps", platform: "generic" },
  { name: "Mulgrave School", url: "https://www.mulgrave.com/summer-camps", platform: "generic" },
  { name: "Queen's Academy", url: "https://www.queensacademy.ca/summer-camps", platform: "generic" },
  { name: "Linbjerg Academy", url: "https://www.lindbjergacademy.com/summer-camps", platform: "generic" },
  { name: "Pear Tree Education", url: "https://www.pear-tree.ca/summer-camps", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // COOKING
  // ══════════════════════════════════════════════════════════════
  { name: "Little Cooks Club", url: "https://littlecooksclub.ca/summer-camps/", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // UNIVERSITY / INSTITUTIONAL
  // ══════════════════════════════════════════════════════════════
  { name: "SFU Summer Camps", url: "https://www.sfu.ca/camps.html", platform: "generic" },
  { name: "UBC Recreation", url: "https://recreation.ubc.ca/camps/summer-camps/", platform: "generic" },
  { name: "PAL Ropes Course", url: "https://recreation.ubc.ca/outdoor-programs/pal-ropes/", platform: "generic" },

  // ══════════════════════════════════════════════════════════════
  // PROVIDERS ON SPECIFIC PLATFORMS
  // ══════════════════════════════════════════════════════════════

  // Amilia platform
  { name: "VanDusen Botanical Garden", url: "https://app.amilia.com/store/en/vancouver-botanical-gardens-association/shop/programs", platform: "amilia" },

  // Pike13 platform
  { name: "Southlands Farm", url: "https://southlandsfarm.pike13.com/schedule", platform: "pike13" },

  // ══════════════════════════════════════════════════════════════
  // MUNICIPAL / RECREATION COMMISSIONS (non-Vancouver, non-Richmond)
  // ══════════════════════════════════════════════════════════════
  { name: "North Vancouver Recreation Commission (NVRC)", url: "https://www.nvrc.ca/programs-registration/camps", platform: "generic" },
  { name: "District of West Vancouver", url: "https://westvancouver.ca/parks-recreation/recreation/camps", platform: "generic" },
  { name: "City of Burnaby", url: "https://www.burnaby.ca/recreation-and-arts/programs-and-activities/day-camps", platform: "generic" },
  { name: "City of Burnaby - Bonsor Recreation Centre", url: "https://www.burnaby.ca/recreation-and-arts/programs-and-activities/day-camps", platform: "generic" },
  { name: "City of Burnaby - Edmonds Recreation Centre", url: "https://www.burnaby.ca/recreation-and-arts/programs-and-activities/day-camps", platform: "generic" },
  { name: "City of Burnaby - Cameron Recreation Centre", url: "https://www.burnaby.ca/recreation-and-arts/programs-and-activities/day-camps", platform: "generic" },
  { name: "City of Burnaby - Confederation Park Recreation Centre", url: "https://www.burnaby.ca/recreation-and-arts/programs-and-activities/day-camps", platform: "generic" },
  { name: "City of Burnaby - Christine Sinclair Recreation Centre", url: "https://www.burnaby.ca/recreation-and-arts/programs-and-activities/day-camps", platform: "generic" },
  { name: "City of Burnaby - Eileen Dailly Recreation Centre", url: "https://www.burnaby.ca/recreation-and-arts/programs-and-activities/day-camps", platform: "generic" },
  { name: "City of Burnaby - Kensington Recreation Centre", url: "https://www.burnaby.ca/recreation-and-arts/programs-and-activities/day-camps", platform: "generic" },
  { name: "City of Burnaby - Bill Copeland Recreation Centre", url: "https://www.burnaby.ca/recreation-and-arts/programs-and-activities/day-camps", platform: "generic" },
  { name: "City of New Westminster", url: "https://anc.ca.apm.activecommunities.com/newwestminster/activity/search?onlineSiteId=0&activity_select_param=2&activity_keyword=camp&date_after=2026-06-01&date_before=2026-09-01", platform: "activenet" },
];

// ─── HTML Parsing Helpers ─────────────────────────────────────

/**
 * Extract price information from HTML.
 * Looks for patterns like $299, $225.00, etc.
 */
function extractPrices(html) {
  const matches = [...html.matchAll(/\$\s*(\d{1,4}(?:\.\d{2})?)/g)];
  const prices = matches
    .map((m) => parseFloat(m[1]))
    .filter((p) => p >= 20 && p <= 2000); // Filter reasonable camp prices
  return [...new Set(prices)].sort((a, b) => a - b);
}

/**
 * Extract age ranges from HTML.
 */
function extractAges(html) {
  const matches = [...html.matchAll(/ages?\s*(\d{1,2})\s*[-–to]+\s*(\d{1,2})/gi)];
  return matches.map((m) => ({
    min: parseInt(m[1]),
    max: parseInt(m[2]),
  }));
}

/**
 * Extract date information from HTML.
 */
function extractDates(html) {
  const monthNames = "(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)";
  const dateRegex = new RegExp(`(${monthNames})\\s+(\\d{1,2})(?:\\s*[-–]\\s*(\\d{1,2}))?(?:[,\\s]*(20\\d{2}))?`, "gi");
  const matches = [...html.matchAll(dateRegex)];

  return matches.map((m) => ({
    month: m[1],
    startDay: parseInt(m[2]),
    endDay: m[3] ? parseInt(m[3]) : null,
    year: m[4] ? parseInt(m[4]) : 2026,
  }));
}

/**
 * Detect enrollment status from HTML text.
 */
function detectEnrollmentStatus(html) {
  const text = html.toLowerCase();
  if (/sold\s*out|fully?\s*booked|capacity\s*reached/i.test(text)) return "Full/Waitlist";
  if (/waitlist|wait\s*list|join\s*waitlist/i.test(text)) return "Full/Waitlist";
  if (/registration\s*closed|reg\.?\s*closed/i.test(text)) return "Completed";
  if (/coming\s*soon|registration\s*opens?|opens?\s*(?:in|on)/i.test(text)) return "Coming Soon";
  if (/register\s*now|sign\s*up|enroll|book\s*now/i.test(text)) return "Open";
  return null; // Can't determine
}

/**
 * Strip HTML tags for cleaner text analysis.
 */
function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Provider Page Fetching ──────────────────────────────────

/**
 * Fetch a provider's camp page and extract relevant data.
 * Returns a summary of what was found.
 */
async function scrapeProvider(provider) {
  try {
    const res = await fetch(provider.url, {
      headers: {
        "User-Agent": "Skeddo/1.0 (skeddo.ca; program refresh)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!res.ok) {
      return {
        provider: provider.name,
        status: "error",
        httpStatus: res.status,
        message: `HTTP ${res.status}`,
      };
    }

    const html = await res.text();
    const text = stripHtml(html);

    // Extract all available data
    const prices = extractPrices(text);
    const ages = extractAges(text);
    const dates = extractDates(text);
    const enrollmentStatus = detectEnrollmentStatus(html);

    // Detect if the page mentions summer 2026 specifically
    const mentions2026 = /2026/.test(text);
    const mentionsSummer = /summer/i.test(text);

    // Check if the page seems to have actual camp listings vs. just info
    const hasListings = prices.length > 0 || ages.length > 0 || dates.length > 0;

    return {
      provider: provider.name,
      url: provider.url,
      status: "ok",
      hasListings,
      mentions2026,
      mentionsSummer,
      prices,
      ages,
      dates: dates.slice(0, 10), // Limit to first 10 date entries
      enrollmentStatus,
      pageSize: html.length,
    };
  } catch (err) {
    return {
      provider: provider.name,
      status: "error",
      message: err.message,
    };
  }
}

// ─── Data Quality Validation ─────────────────────────────────
// These rules ensure new and updated programs meet the same quality
// standards as our manually curated data. Every field is validated.

/**
 * Validate and clean a program record before upserting.
 * Applies the same quality rules used for existing programs.
 */
function validateProgram(program) {
  const issues = [];

  // Price: must be a number >= 0, no strings like "TBD"
  if (typeof program.cost !== "number" || isNaN(program.cost)) {
    program.cost = 0;
    issues.push("cost set to 0 (was non-numeric)");
  }
  if (program.cost < 0) {
    program.cost = 0;
    issues.push("cost set to 0 (was negative)");
  }

  // Age range: must be integers, min < max, within 0-18
  if (program.age_min !== null && program.age_min !== undefined) {
    program.age_min = Math.max(0, Math.min(18, Math.round(program.age_min)));
  }
  if (program.age_max !== null && program.age_max !== undefined) {
    program.age_max = Math.max(0, Math.min(18, Math.round(program.age_max)));
  }
  if (program.age_min && program.age_max && program.age_min > program.age_max) {
    issues.push(`age range swapped (was ${program.age_min}-${program.age_max})`);
    [program.age_min, program.age_max] = [program.age_max, program.age_min];
  }

  // Registration URL: must be a valid URL, not just a homepage
  if (program.registration_url) {
    try {
      const url = new URL(program.registration_url);
      // Flag homepage-only URLs (no meaningful path)
      if (url.pathname === "/" || url.pathname === "") {
        issues.push("registration URL is homepage-only");
      }
    } catch {
      issues.push("invalid registration URL");
      program.registration_url = null;
    }
  }

  // Enrollment status: must be one of the valid values
  const validStatuses = ["Open", "Coming Soon", "Full/Waitlist", "In Progress", "Completed", "Opening Soon"];
  if (program.enrollment_status && !validStatuses.includes(program.enrollment_status)) {
    issues.push(`invalid enrollment status "${program.enrollment_status}"`);
    program.enrollment_status = "Open";
  }

  // Dates: start must be before end
  if (program.start_date && program.end_date) {
    if (new Date(program.start_date) > new Date(program.end_date)) {
      issues.push("start date after end date — swapped");
      [program.start_date, program.end_date] = [program.end_date, program.start_date];
    }
  }

  // Name: must not be empty
  if (!program.name || program.name.trim() === "") {
    issues.push("empty name");
    return null; // Skip programs with no name
  }

  return { program, issues };
}

/**
 * Extract camp-specific registration URLs from HTML.
 * Looks for links containing camp/register/signup keywords.
 */
function extractRegistrationUrls(html, baseUrl) {
  const urls = new Map();
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*(?:register|sign\s*up|enroll|book|camp)[^<]*)<\/a>/gi;
  const matches = [...html.matchAll(linkRegex)];

  for (const m of matches) {
    let href = m[1];
    const text = m[2].trim();

    // Resolve relative URLs
    if (href.startsWith("/")) {
      try {
        const base = new URL(baseUrl);
        href = `${base.origin}${href}`;
      } catch { continue; }
    }

    // Skip mailto, tel, javascript links
    if (/^(mailto:|tel:|javascript:)/.test(href)) continue;

    urls.set(text, href);
  }

  return urls;
}

// ─── Comparison & Update Logic ───────────────────────────────

/**
 * Compare scraped data with existing database records and update if changed.
 * Applies data quality validation to all updates.
 */
async function updateProviderPrograms(scrapeResult) {
  if (scrapeResult.status !== "ok" || !scrapeResult.hasListings) return 0;

  // Fetch existing programs for this provider from Supabase
  const { data: existing, error } = await supabase
    .from("directory_programs")
    .select("*")
    .eq("provider", scrapeResult.provider);

  if (error) {
    console.log(`    DB error for ${scrapeResult.provider}: ${error.message}`);
    return 0;
  }

  if (!existing || existing.length === 0) return 0;

  let updated = 0;
  const updates = {};

  // Check if enrollment status changed
  if (scrapeResult.enrollmentStatus) {
    const programsNeedingUpdate = existing.filter(
      (p) => p.enrollment_status !== scrapeResult.enrollmentStatus
    );
    if (programsNeedingUpdate.length > 0) {
      updates.enrollment_status = scrapeResult.enrollmentStatus;
      console.log(`    → Enrollment status: ${scrapeResult.enrollmentStatus} (${programsNeedingUpdate.length} programs)`);
    }
  }

  // Check if prices changed significantly (only if we found clear price data)
  if (scrapeResult.prices.length > 0 && scrapeResult.prices.length <= 5) {
    const existingPrices = [...new Set(existing.map((p) => p.cost).filter((c) => c > 0))].sort((a, b) => a - b);
    const newPrices = scrapeResult.prices;

    if (existingPrices.length > 0 && newPrices.length > 0) {
      const avgExisting = existingPrices.reduce((a, b) => a + b, 0) / existingPrices.length;
      const avgNew = newPrices.reduce((a, b) => a + b, 0) / newPrices.length;

      if (Math.abs(avgNew - avgExisting) / avgExisting > 0.2) {
        console.log(`    ⚠ Price change detected: was avg $${avgExisting.toFixed(0)}, now avg $${avgNew.toFixed(0)}`);
        // Don't auto-update prices — flag for review
        // Prices on websites can be ambiguous (early bird, multi-week, etc.)
      }
    }

    // If existing programs have $0 cost and we found real prices, update them
    const zeroCostPrograms = existing.filter((p) => p.cost === 0 || p.cost === null);
    if (zeroCostPrograms.length > 0 && newPrices.length === 1) {
      // Single price found — likely applies to all programs
      updates.cost = newPrices[0];
      console.log(`    → Price update: $0 → $${newPrices[0]} (${zeroCostPrograms.length} programs)`);
    }
  }

  // Check age ranges — if we found ages and existing have nulls, fill them in
  if (scrapeResult.ages.length > 0) {
    const nullAgePrograms = existing.filter((p) => p.age_min === null || p.age_max === null);
    if (nullAgePrograms.length > 0 && scrapeResult.ages.length === 1) {
      const age = scrapeResult.ages[0];
      if (age.min >= 0 && age.min <= 18 && age.max >= 0 && age.max <= 18 && age.min <= age.max) {
        updates.age_min = age.min;
        updates.age_max = age.max;
        console.log(`    → Age range filled: ${age.min}-${age.max} (${nullAgePrograms.length} programs)`);
      }
    }
  }

  // Apply updates if any
  if (Object.keys(updates).length > 0) {
    updates.last_updated = new Date().toISOString();

    // Validate the update fields
    if (updates.cost !== undefined && (typeof updates.cost !== "number" || updates.cost < 0)) {
      delete updates.cost;
    }
    if (updates.age_min !== undefined && (updates.age_min < 0 || updates.age_min > 18)) {
      delete updates.age_min;
      delete updates.age_max;
    }

    const { error: updateErr } = await supabase
      .from("directory_programs")
      .update(updates)
      .eq("provider", scrapeResult.provider);

    if (!updateErr) {
      updated += existing.length;
    } else {
      console.log(`    DB update error: ${updateErr.message}`);
    }
  }

  return updated;
}

// ─── Main Pipeline ───────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Skeddo — Private Provider Program Refresh");
  console.log(`  Started at ${new Date().toISOString()}`);
  console.log(`  Checking ${PROVIDERS.length} providers`);
  console.log("  Data quality validation: ENABLED");
  console.log("═══════════════════════════════════════════════════\n");

  const results = {
    ok: 0,
    errors: 0,
    withListings: 0,
    updated: 0,
    with2026: 0,
    statusChanges: [],
    priceChanges: [],
  };

  // URL cache: avoid fetching the same URL multiple times
  // (e.g., 8 Burnaby recreation centres all share burnaby.ca/day-camps)
  const urlCache = new Map();

  for (let i = 0; i < PROVIDERS.length; i++) {
    const provider = PROVIDERS[i];

    let scrapeResult;

    // Check if we already fetched this URL
    if (urlCache.has(provider.url)) {
      // Reuse cached scrape data but with this provider's name
      const cached = urlCache.get(provider.url);
      scrapeResult = { ...cached, provider: provider.name };
      console.log(`  ↺ ${provider.name}: using cached data from ${new URL(provider.url).hostname}`);
    } else {
      await sleep(RATE_LIMIT_MS);
      scrapeResult = await scrapeProvider(provider);
      urlCache.set(provider.url, scrapeResult);
    }

    if (scrapeResult.status === "ok") {
      results.ok++;
      if (scrapeResult.hasListings) results.withListings++;
      if (scrapeResult.mentions2026) results.with2026++;

      // Log findings
      const parts = [];
      if (scrapeResult.prices.length > 0) parts.push(`${scrapeResult.prices.length} prices`);
      if (scrapeResult.ages.length > 0) parts.push(`${scrapeResult.ages.length} age groups`);
      if (scrapeResult.dates.length > 0) parts.push(`${scrapeResult.dates.length} dates`);
      if (scrapeResult.enrollmentStatus) parts.push(`status: ${scrapeResult.enrollmentStatus}`);
      if (scrapeResult.mentions2026) parts.push("mentions 2026");

      if (parts.length > 0 && !urlCache.has(provider.url + "_logged")) {
        console.log(`  ✓ ${provider.name}: ${parts.join(", ")}`);
        urlCache.set(provider.url + "_logged", true);
      } else if (!parts.length) {
        console.log(`  ○ ${provider.name}: page loaded but no camp data found`);
      }

      // Compare and update in database
      const updatedCount = await updateProviderPrograms(scrapeResult);
      results.updated += updatedCount;
    } else {
      results.errors++;
      console.log(`  ✗ ${provider.name}: ${scrapeResult.message}`);
    }

    // Log progress every 25 providers
    if ((i + 1) % 25 === 0) {
      console.log(`\n  Progress: ${i + 1}/${PROVIDERS.length}\n`);
    }
  }

  // ─── Summary ───
  console.log("\n═══════════════════════════════════════════════════");
  console.log("  PRIVATE PROVIDER REFRESH SUMMARY");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  Providers checked:     ${PROVIDERS.length}`);
  console.log(`  Successful fetches:    ${results.ok}`);
  console.log(`  Errors:                ${results.errors}`);
  console.log(`  With camp listings:    ${results.withListings}`);
  console.log(`  Mentioning 2026:       ${results.with2026}`);
  console.log(`  Programs updated:      ${results.updated}`);
  console.log(`\n  Completed at ${new Date().toISOString()}`);
  console.log("═══════════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
