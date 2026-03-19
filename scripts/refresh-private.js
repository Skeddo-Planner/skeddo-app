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
  // ── Large providers with dedicated camp pages ──
  { name: "Arts Umbrella", url: "https://www.artsumbrella.com/summer-camps/", platform: "generic" },
  { name: "Pedalheads", url: "https://www.pedalheads.com/programs/summer-camps", platform: "generic" },
  { name: "Jump Gymnastics", url: "https://www.jumpgymnastics.ca/summer-camps", platform: "generic" },
  { name: "4Cats Art Studio", url: "https://4cats.com/camps/", platform: "generic" },
  { name: "Flicka Gymnastics", url: "https://www.flickagymclub.com/summer-camps", platform: "generic" },
  { name: "Exceleration", url: "https://excelerationtriclub.ca/summer-camps/", platform: "generic" },
  { name: "SportBall", url: "https://www.sportball.ca/vancouver/camps/", platform: "generic" },
  { name: "Extra Steps", url: "https://www.extrasteps.ca/summer-camps", platform: "generic" },
  { name: "YMCA of Greater Vancouver", url: "https://www.gv.ymca.ca/day-camps", platform: "generic" },
  { name: "Soaring Eagle Nature School", url: "https://soaringeaglenatureschool.org/summer-camp/", platform: "generic" },
  { name: "Bard on the Beach", url: "https://www.bardonthebeach.org/education/young-shakespeareans/", platform: "generic" },
  { name: "Vancouver Art Gallery", url: "https://www.vanartgallery.bc.ca/learn/kids-and-families", platform: "generic" },
  { name: "Vancouver Circus School", url: "https://www.vancouvercircusschool.ca/summer-camps", platform: "generic" },
  { name: "Harbour Dance Centre", url: "https://www.harbourdance.com/summer-dance-camps/", platform: "generic" },
  { name: "VSO School of Music", url: "https://www.vsoschoolofmusic.ca/summer-music-camps/", platform: "generic" },
  { name: "Brainstem Learning", url: "https://www.brainstemlearning.ca/summer-camps", platform: "generic" },
  { name: "Byte Camp", url: "https://www.bytecamp.ca/summer-camps/", platform: "generic" },
  { name: "Code Ninjas", url: "https://www.codeninjas.com/vancouver-bc-ca/camps", platform: "generic" },
  { name: "Science Alive", url: "https://www.sciencealive.ca/summer-camps", platform: "generic" },
  { name: "SFU Summer Camps", url: "https://www.sfu.ca/camps.html", platform: "generic" },
  { name: "Steamoji", url: "https://www.steamoji.com/summer-camps", platform: "generic" },
  { name: "Royal City Soccer Club", url: "https://www.royalsoccer.com/summer-camps/", platform: "generic" },
  { name: "Whitecaps FC", url: "https://whitecapsfcyouth.com/programs/summer-camps/", platform: "generic" },
  { name: "The Hive Climbing", url: "https://www.hiveclimbing.com/summer-camps/", platform: "generic" },
  { name: "Fireside Adventures", url: "https://www.firesideadventures.ca/summer-camps", platform: "generic" },
  { name: "Sea Smart School Society", url: "https://www.seasmartschool.com/summer-camps", platform: "generic" },
  { name: "Rainforest Adventure Camps", url: "https://www.rfcamps.com/summer-camps", platform: "generic" },
  { name: "JCC of Greater Vancouver", url: "https://www.jccgv.com/day-camps/", platform: "generic" },
  { name: "Stanley Park Ecology Society", url: "https://www.stanleyparkecology.ca/programs/camps/", platform: "generic" },
  { name: "Squamish Climbing Academy", url: "https://www.squamishclimbingacademy.com/summer-camps", platform: "generic" },
  { name: "Mt Seymour", url: "https://mtseymour.ca/summer-camps", platform: "generic" },
  { name: "WildPlay Element Parks", url: "https://www.wildplay.com/summer-camps", platform: "generic" },
  { name: "MacSailing", url: "https://www.macsailing.com/youth-sailing-camps/", platform: "generic" },
  { name: "Deep Cove Kayak", url: "https://www.deepcovekayak.com/summer-camps/", platform: "generic" },
  { name: "Windsure Adventure Watersports", url: "https://www.windsure.com/summer-camps/", platform: "generic" },
  { name: "Camp Qwanoes", url: "https://www.qwanoes.ca/summer-camp/", platform: "generic" },
  { name: "Timberline Ranch", url: "https://www.timberlineranch.com/summer-camp/", platform: "generic" },
  { name: "Little Cooks Club", url: "https://littlecooksclub.ca/summer-camps/", platform: "generic" },
  { name: "School of Rock", url: "https://www.schoolofrock.com/vancouver/summer-camps", platform: "generic" },
  { name: "Lights Up Musical Theatre", url: "https://www.lightsuptheatre.ca/summer-camp", platform: "generic" },
  { name: "Zebra Robotics", url: "https://www.zebrarobotics.com/summer-camps", platform: "generic" },
  { name: "STEM Camp", url: "https://www.stemcamp.ca/british-columbia/", platform: "generic" },

  // ── Providers on Amilia platform ──
  { name: "VanDusen Botanical Garden", url: "https://app.amilia.com/store/en/vancouver-botanical-gardens-association/shop/programs", platform: "amilia" },

  // ── Providers on Pike13 platform ──
  { name: "Southlands Farm", url: "https://southlandsfarm.pike13.com/schedule", platform: "pike13" },

  // ── UBC Recreation (ActiveNet-based) ──
  { name: "UBC Recreation", url: "https://recreation.ubc.ca/camps/summer-camps/", platform: "generic" },

  // ── Providers with ActiveNet-like systems ──
  { name: "NVRC", url: "https://www.nvrc.ca/programs-registration/camps", platform: "generic" },
  { name: "City of Burnaby", url: "https://www.burnaby.ca/recreation-and-arts/programs-and-activities/day-camps", platform: "generic" },
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

// ─── Comparison & Update Logic ───────────────────────────────

/**
 * Compare scraped data with existing database records and update if changed.
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

  // Check if enrollment status changed
  if (scrapeResult.enrollmentStatus) {
    const programsToUpdate = existing.filter(
      (p) => p.enrollment_status !== scrapeResult.enrollmentStatus
    );

    if (programsToUpdate.length > 0) {
      const { error: updateErr } = await supabase
        .from("directory_programs")
        .update({
          enrollment_status: scrapeResult.enrollmentStatus,
          last_updated: new Date().toISOString(),
        })
        .eq("provider", scrapeResult.provider);

      if (!updateErr) {
        updated += programsToUpdate.length;
        console.log(`    Updated enrollment status for ${scrapeResult.provider}: → ${scrapeResult.enrollmentStatus}`);
      }
    }
  }

  // Check if prices changed significantly (only if we found clear price data)
  if (scrapeResult.prices.length > 0 && scrapeResult.prices.length <= 5) {
    // If we found 1-5 prices, check if they differ from existing
    const existingPrices = [...new Set(existing.map((p) => p.cost).filter((c) => c > 0))].sort((a, b) => a - b);
    const newPrices = scrapeResult.prices;

    // Only flag if there's a clear mismatch
    if (existingPrices.length > 0 && newPrices.length > 0) {
      const avgExisting = existingPrices.reduce((a, b) => a + b, 0) / existingPrices.length;
      const avgNew = newPrices.reduce((a, b) => a + b, 0) / newPrices.length;

      // If average price differs by more than 20%, flag it
      if (Math.abs(avgNew - avgExisting) / avgExisting > 0.2) {
        console.log(`    ⚠ Price change detected for ${scrapeResult.provider}: was avg $${avgExisting.toFixed(0)}, now avg $${avgNew.toFixed(0)}`);
        // Don't auto-update prices — flag for review
        // Prices on websites can be ambiguous (early bird, multi-week, etc.)
      }
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

  for (let i = 0; i < PROVIDERS.length; i++) {
    const provider = PROVIDERS[i];
    await sleep(RATE_LIMIT_MS);

    const scrapeResult = await scrapeProvider(provider);

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

      if (parts.length > 0) {
        console.log(`  ✓ ${provider.name}: ${parts.join(", ")}`);
      } else {
        console.log(`  ○ ${provider.name}: page loaded but no camp data found`);
      }

      // Compare and update
      const updatedCount = await updateProviderPrograms(scrapeResult);
      results.updated += updatedCount;
    } else {
      results.errors++;
      console.log(`  ✗ ${provider.name}: ${scrapeResult.message}`);
    }

    // Log progress every 20 providers
    if ((i + 1) % 20 === 0) {
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
