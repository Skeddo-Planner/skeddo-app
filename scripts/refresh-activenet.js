/**
 * Skeddo — ActiveNet Program Refresh Script
 *
 * Fetches summer camp/program data from the City of Vancouver's ActiveNet
 * system and upserts it into the Supabase directory_programs table.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/refresh-activenet.js
 *
 * This script:
 *   1. Searches each community centre for programs using multiple keywords
 *   2. Parses program details (ages, dates, times, categories)
 *   3. Builds direct registration URLs
 *   4. Upserts into Supabase (deduplicates by source + source_id)
 *   5. Logs a summary of new/updated programs per centre
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

// ─── Constants ─────────────────────────────────────────────────
const ACTIVENET_BASE = "https://anc.ca.apm.activecommunities.com/vancouver";
const REGISTRATION_URL_TEMPLATE = (id) =>
  `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/${id}?onlineSiteId=0&from_original_cui=true`;

const RATE_LIMIT_MS = 100; // 100ms between API calls

const SEARCH_KEYWORDS = [
  "day camp", "art camp", "sport camp", "spring break camp",
  "summer daze", "leadership", "robotics", "coding camp",
  "science camp", "nature camp", "dance camp", "music camp",
  "theatre camp", "cooking camp", "outdoor camp",
];

// ─── Centre Info ───────────────────────────────────────────────
const CENTRES = {
  38:  { name: "Britannia",         addr: "1661 Napier St, Vancouver, BC V5L 4X4",       lat: 49.2756, lng: -123.0697, hood: "Grandview-Woodland" },
  57:  { name: "Champlain Heights", addr: "3350 Maquinna Dr, Vancouver, BC V5S 4C6",     lat: 49.2165, lng: -123.0300, hood: "Killarney" },
  6:   { name: "Coal Harbour",      addr: "480 Broughton St, Vancouver, BC V6G 3A4",     lat: 49.2891, lng: -123.1243, hood: "Coal Harbour" },
  29:  { name: "Creekside",         addr: "1 Athletes Way, Vancouver, BC V5Y 0B1",       lat: 49.2712, lng: -123.1023, hood: "Mount Pleasant" },
  48:  { name: "Douglas Park",      addr: "801 W 22nd Ave, Vancouver, BC V5Z 1Z8",       lat: 49.2525, lng: -123.1202, hood: "Riley Park" },
  50:  { name: "Dunbar",            addr: "4747 Dunbar St, Vancouver, BC V6S 2H2",       lat: 49.2447, lng: -123.1860, hood: "Dunbar-Southlands" },
  43:  { name: "False Creek",       addr: "1318 Cartwright St, Vancouver, BC V6H 3R8",   lat: 49.2711, lng: -123.1362, hood: "Fairview" },
  44:  { name: "Hastings",          addr: "3096 E Hastings St, Vancouver, BC V5K 2A3",   lat: 49.2812, lng: -123.0387, hood: "Hastings-Sunrise" },
  39:  { name: "Hillcrest",         addr: "4575 Clancy Loranger Way, Vancouver, BC V5Y 2M4", lat: 49.2437, lng: -123.1081, hood: "Riley Park" },
  55:  { name: "Kensington",        addr: "5175 Dumfries St, Vancouver, BC V5P 3A3",     lat: 49.2346, lng: -123.0585, hood: "Kensington-Cedar Cottage" },
  33:  { name: "Kerrisdale",        addr: "5851 West Blvd, Vancouver, BC V6M 3W4",       lat: 49.2342, lng: -123.1574, hood: "Kerrisdale" },
  35:  { name: "Killarney",         addr: "6260 Killarney St, Vancouver, BC V5S 2X7",    lat: 49.2251, lng: -123.0434, hood: "Killarney" },
  40:  { name: "Kitsilano",         addr: "2690 Larch St, Vancouver, BC V6K 2E5",        lat: 49.2645, lng: -123.1568, hood: "Kitsilano" },
  54:  { name: "Marpole-Oakridge",  addr: "990 W 59th Ave, Vancouver, BC V6P 1X9",       lat: 49.2180, lng: -123.1312, hood: "Marpole" },
  53:  { name: "Mount Pleasant",    addr: "1 Kingsway, Vancouver, BC V5T 3C7",           lat: 49.2636, lng: -123.1012, hood: "Mount Pleasant" },
  60:  { name: "Ray-Cam",           addr: "920 E Hastings St, Vancouver, BC V6A 3T1",    lat: 49.2812, lng: -123.0876, hood: "Strathcona" },
  46:  { name: "Renfrew Park",      addr: "2929 E 22nd Ave, Vancouver, BC V5M 2Y3",      lat: 49.2509, lng: -123.0393, hood: "Renfrew-Collingwood" },
  42:  { name: "Roundhouse",        addr: "181 Roundhouse Mews, Vancouver, BC V6Z 2W3",  lat: 49.2731, lng: -123.1216, hood: "Yaletown" },
  51:  { name: "Strathcona",        addr: "601 Keefer St, Vancouver, BC V6A 3V8",        lat: 49.2790, lng: -123.0895, hood: "Strathcona" },
  41:  { name: "Sunset",            addr: "6810 Main St, Vancouver, BC V5X 3H1",         lat: 49.2181, lng: -123.1008, hood: "Sunset" },
  58:  { name: "Thunderbird",       addr: "2311 Cassiar St, Vancouver, BC V5M 3Y1",      lat: 49.2620, lng: -123.0347, hood: "Hastings-Sunrise" },
  32:  { name: "Trout Lake",        addr: "3360 Victoria Dr, Vancouver, BC V5N 4M1",     lat: 49.2563, lng: -123.0655, hood: "Kensington-Cedar Cottage" },
  7:   { name: "West End",          addr: "870 Denman St, Vancouver, BC V6G 2L8",        lat: 49.2880, lng: -123.1359, hood: "West End" },
};

// ─── Categorization ────────────────────────────────────────────
const CATEGORY_PATTERNS = [
  { pattern: /\b(art|paint|draw|sketch|ceramic|pottery|craft|creative|mural|printmak)/i, category: "Arts", activityType: "Visual Arts" },
  { pattern: /\b(theatre|theater|drama|acting|improv|musical theatre)/i, category: "Arts", activityType: "Performing Arts" },
  { pattern: /\b(dance|ballet|hip\s?hop|jazz dance|contemporary dance|breakdanc)/i, category: "Arts", activityType: "Dance" },
  { pattern: /\b(music|band|guitar|piano|ukulele|drum|sing|choir|vocal)/i, category: "Music", activityType: "Music" },
  { pattern: /\b(robot|coding|code|program|stem|science|engineer|minecraft|tech|comput|cyber|ai\b|digital)/i, category: "STEM", activityType: "STEM" },
  { pattern: /\b(soccer|basketball|baseball|softball|tennis|volleyball|hockey|lacrosse|badminton|cricket|rugby)/i, category: "Sports", activityType: "Team Sports" },
  { pattern: /\b(swim|aqua|diving|water polo|lifeguard)/i, category: "Sports", activityType: "Swimming" },
  { pattern: /\b(gymnast|tumbl|acrobat|cheer|parkour|martial|karate|judo|taekwondo|kung fu|fencing)/i, category: "Sports", activityType: "Individual Sports" },
  { pattern: /\b(skateboard|climb|boulder|archery|golf|cycling|track|running)/i, category: "Sports", activityType: "Individual Sports" },
  { pattern: /\b(sport|multi-sport|athletic|fitness|active play)/i, category: "Sports", activityType: "Multi-Sport" },
  { pattern: /\b(outdoor|nature|hike|hiking|trail|forest|garden|farm|wilderness|kayak|canoe|paddle|camp.*outdoor)/i, category: "Outdoor", activityType: "Outdoor Adventure" },
  { pattern: /\b(cook|bak|chef|culinary|kitchen|food)/i, category: "Life Skills", activityType: "Cooking" },
  { pattern: /\b(leadership|babysit|first aid|life skill|financial|entrepreneur)/i, category: "Life Skills", activityType: "Life Skills" },
  { pattern: /\b(reading|writing|math|tutor|homework|literacy|french|spanish|mandarin|language)/i, category: "Academic", activityType: "Academic" },
];

function categorizeProgram(name) {
  for (const { pattern, category, activityType } of CATEGORY_PATTERNS) {
    if (pattern.test(name)) {
      return { category, activityType };
    }
  }
  // Default for City of Vancouver programs
  return { category: "General", activityType: "Day Camp" };
}

// ─── Parsing Helpers ───────────────────────────────────────────

/**
 * Parse age strings like "At least 5 but less than 7y 11m 4w"
 * or "5 - 12 yrs" or "6-8" etc.
 */
function parseAges(ageStr) {
  if (!ageStr) return { ageMin: null, ageMax: null };

  // "At least X but less than Yy ..."
  const atLeastMatch = ageStr.match(/at least\s+(\d+).*?less than\s+(\d+)/i);
  if (atLeastMatch) {
    return { ageMin: parseInt(atLeastMatch[1]), ageMax: parseInt(atLeastMatch[2]) };
  }

  // "X - Y" or "X-Y" with optional "yrs", "years", "y"
  const rangeMatch = ageStr.match(/(\d+)\s*[-–—]\s*(\d+)/);
  if (rangeMatch) {
    return { ageMin: parseInt(rangeMatch[1]), ageMax: parseInt(rangeMatch[2]) };
  }

  // Single age "5+"
  const singleMatch = ageStr.match(/(\d+)\+/);
  if (singleMatch) {
    return { ageMin: parseInt(singleMatch[1]), ageMax: 17 };
  }

  // Single age
  const numMatch = ageStr.match(/(\d+)/);
  if (numMatch) {
    return { ageMin: parseInt(numMatch[1]), ageMax: parseInt(numMatch[1]) };
  }

  return { ageMin: null, ageMax: null };
}

/**
 * Parse date ranges like "July 6, 2026 to July 10, 2026"
 * or "Jul 6 - Jul 10, 2026"
 */
function parseDateRange(dateStr) {
  if (!dateStr) return { startDate: null, endDate: null };

  // Try "Month Day, Year to Month Day, Year"
  const fullMatch = dateStr.match(
    /(\w+\s+\d{1,2},?\s+\d{4})\s*(?:to|[-–—])\s*(\w+\s+\d{1,2},?\s+\d{4})/i
  );
  if (fullMatch) {
    const start = new Date(fullMatch[1]);
    const end = new Date(fullMatch[2]);
    if (!isNaN(start) && !isNaN(end)) {
      return {
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
      };
    }
  }

  // Try single date "July 6, 2026"
  const singleMatch = dateStr.match(/(\w+\s+\d{1,2},?\s+\d{4})/i);
  if (singleMatch) {
    const d = new Date(singleMatch[1]);
    if (!isNaN(d)) {
      const ds = d.toISOString().split("T")[0];
      return { startDate: ds, endDate: ds };
    }
  }

  return { startDate: null, endDate: null };
}

/**
 * Parse time range like "9:00 AM - 4:00 PM" and determine schedule type
 */
function parseTimeRange(timeStr) {
  if (!timeStr) return { startTime: null, endTime: null, scheduleType: "Full Day" };

  const match = timeStr.match(/([\d:]+\s*[AP]M?)\s*[-–—]\s*([\d:]+\s*[AP]M?)/i);
  if (!match) return { startTime: timeStr, endTime: null, scheduleType: "Full Day" };

  const startTime = match[1].trim();
  const endTime = match[2].trim();

  // Determine schedule type based on hours
  const endHour = parseHour(endTime);
  const startHour = parseHour(startTime);
  const duration = endHour - startHour;

  let scheduleType = "Full Day";
  if (duration <= 4) {
    if (startHour < 12) {
      scheduleType = "Half Day (AM)";
    } else {
      scheduleType = "Half Day (PM)";
    }
  }

  return { startTime, endTime, scheduleType };
}

function parseHour(timeStr) {
  if (!timeStr) return 12;
  const match = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
  if (!match) return 12;
  let hour = parseInt(match[1]);
  const ampm = match[3];
  if (ampm) {
    if (ampm.toUpperCase() === "PM" && hour < 12) hour += 12;
    if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;
  }
  return hour;
}

/**
 * Parse days_of_week from API (array of day names or comma-separated string)
 */
function parseDays(daysData) {
  if (!daysData) return "Mon-Fri";

  if (Array.isArray(daysData)) {
    if (daysData.length >= 5) return "Mon-Fri";
    const abbrevs = daysData.map((d) => {
      const day = d.toString().trim();
      return day.substring(0, 3);
    });
    return abbrevs.join("/");
  }

  return String(daysData);
}

// ─── API Fetching ──────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch programs from ActiveNet for a given centre ID and keyword.
 * Returns an array of raw activity items.
 */
async function fetchActivities(centreId, keyword, cookies) {
  const url = `${ACTIVENET_BASE}/rest/activities/list?locale=en-US`;

  const body = {
    activity_search_pattern: {
      skills: [],
      time_after_str: "",
      days_of_week: null,
      activity_select_param: 2,
      center_ids: [centreId],
      time_before_str: "",
      open_spots: null,
      activity_id: null,
      activity_category_ids: [],
      date_before: "2026-09-01",
      min_age: null,
      date_after: "2026-06-01",
      activity_type_ids: [],
      site_ids: [],
      for_map: false,
      geographic_area_ids: [],
      season_ids: [],
      activity_department_ids: [],
      activity_other_category_ids: [],
      child_season_ids: [],
      activity_keyword: keyword,
      instructor_ids: [],
      max_age: null,
      custom_price_from: "",
      custom_price_to: "",
    },
    activity_transfer_pattern: {},
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Skeddo/1.0 (skeddo.ca; program refresh)",
        ...(cookies ? { Cookie: cookies } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn(`  API returned ${res.status} for centre ${centreId}, keyword "${keyword}"`);
      return [];
    }

    const data = await res.json();
    return data?.body?.activity_items || [];
  } catch (err) {
    console.warn(`  Fetch error for centre ${centreId}, keyword "${keyword}": ${err.message}`);
    return [];
  }
}

/**
 * Fetch real price for an activity from ActiveNet's estimateprice endpoint.
 * Checks both formats: prices[] array (detailed fee) and estimate_price string (simple fee).
 * Returns the price as a number, or 0 if not available.
 */
async function fetchActivityPrice(activityId, cookies) {
  const url = `${ACTIVENET_BASE}/rest/activity/detail/estimateprice/${activityId}?locale=en-US`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Skeddo/1.0 (skeddo.ca; program refresh)",
        ...(cookies ? { Cookie: cookies } : {}),
      },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    const ep = data?.body || {};

    // Method 1: prices array (detailed fee)
    if (ep.prices && ep.prices.length > 0) {
      for (const detail of ep.prices[0]?.details || []) {
        if (detail.price && detail.price.startsWith("$")) {
          const price = parseFloat(detail.price.replace("$", "").replace(",", ""));
          if (price > 0) return price;
        }
      }
    }

    // Method 2: estimate_price string (simple fee)
    if (ep.estimate_price && ep.estimate_price.startsWith("$")) {
      const price = parseFloat(ep.estimate_price.replace("$", "").replace(",", ""));
      if (price > 0) return price;
    }

    return 0;
  } catch {
    return 0;
  }
}

/**
 * Fetch real age range and enrollment info from ActiveNet's detail endpoint.
 * Returns { ageMin, ageMax, spotsAvailable, showPriceOnline } or nulls on failure.
 */
async function fetchActivityDetail(activityId, cookies) {
  const url = `${ACTIVENET_BASE}/rest/activity/detail/${activityId}?locale=en-US`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Skeddo/1.0 (skeddo.ca; program refresh)",
        ...(cookies ? { Cookie: cookies } : {}),
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const detail = data?.body?.detail || {};

    return {
      ageMin: detail.age_min_year || null,
      ageMax: detail.age_max_year || null,
      spotsAvailable: detail.spots_available ?? null,
      isFull: detail.is_sold_out === true,
      registrationStartDate: detail.registration_start_date ?? null,
      showPriceOnline: detail.show_price_info_online ?? true,
    };
  } catch {
    return null;
  }
}

/**
 * Determine enrollment status from detail info.
 */
function determineEnrollmentStatus(detail, startDate) {
  if (!detail) return "Open";

  if (detail.isFull) return "Full/Waitlist";

  // Check if registration hasn't opened yet
  if (detail.registrationStartDate) {
    const regDate = new Date(detail.registrationStartDate);
    if (regDate > new Date()) return "Opening Soon";
  }

  // Check if program has already started
  if (startDate) {
    const start = new Date(startDate);
    const now = new Date();
    if (start < now) {
      const end = new Date(start);
      end.setDate(end.getDate() + 5); // assume ~1 week program
      if (now > end) return "Completed";
      return "In Progress";
    }
  }

  return "Open";
}

/**
 * Establish a session with ActiveNet by visiting the search page.
 * Returns cookies string for subsequent requests.
 */
async function getSessionCookies() {
  try {
    const res = await fetch(`${ACTIVENET_BASE}/activity/search`, {
      headers: {
        "User-Agent": "Skeddo/1.0 (skeddo.ca; program refresh)",
      },
      redirect: "follow",
    });

    const setCookies = res.headers.getSetCookie?.() || [];
    if (setCookies.length > 0) {
      return setCookies
        .map((c) => c.split(";")[0])
        .join("; ");
    }

    // Fallback: try raw header
    const rawCookie = res.headers.get("set-cookie");
    if (rawCookie) {
      return rawCookie
        .split(",")
        .map((c) => c.split(";")[0].trim())
        .join("; ");
    }

    return "";
  } catch (err) {
    console.warn(`Could not establish session: ${err.message}`);
    return "";
  }
}

// ─── Main Pipeline ─────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Skeddo — ActiveNet Program Refresh");
  console.log(`  Started at ${new Date().toISOString()}`);
  console.log("═══════════════════════════════════════════════════\n");

  // Get existing source_ids so we can track truly new programs
  const { data: existingRows, error: existErr } = await supabase
    .from("directory_programs")
    .select("source_id")
    .eq("source", "activenet-vancouver");

  if (existErr) {
    console.error("Error fetching existing programs:", existErr.message);
  }

  const existingIds = new Set((existingRows || []).map((r) => r.source_id));
  console.log(`Found ${existingIds.size} existing ActiveNet programs in database.\n`);

  // Establish session
  console.log("Establishing ActiveNet session...");
  const cookies = await getSessionCookies();
  console.log(cookies ? "Session established.\n" : "No session cookies (proceeding anyway).\n");

  // Collect all programs across all centres
  const allPrograms = new Map(); // keyed by activity ID for deduplication
  const centreStats = {};

  for (const [centreIdStr, centre] of Object.entries(CENTRES)) {
    const centreId = parseInt(centreIdStr);
    console.log(`\n─── ${centre.name} (ID: ${centreId}) ───`);
    centreStats[centre.name] = { found: 0, new: 0 };

    for (const keyword of SEARCH_KEYWORDS) {
      await sleep(RATE_LIMIT_MS);

      const items = await fetchActivities(centreId, keyword, cookies);

      for (const item of items) {
        const activityId = String(item.id);

        // Skip if we already have this program in this batch
        if (allPrograms.has(activityId)) continue;

        // Parse basic fields from the list endpoint (used as fallback)
        const fallbackAges = parseAges(item.ages || item.age_range || "");
        const { startDate, endDate } = parseDateRange(item.date_range || "");
        const { startTime, endTime, scheduleType } = parseTimeRange(item.time_range || "");
        const { category, activityType } = categorizeProgram(item.name || "");
        const days = parseDays(item.days_of_week);

        // Skip adult programs (using fallback ages for quick filter)
        if (fallbackAges.ageMin !== null && fallbackAges.ageMin >= 18) continue;

        // Skip programs starting before June (not summer)
        if (startDate) {
          const startMonth = parseInt(startDate.split("-")[1]);
          if (startMonth < 6) continue;
        }

        // Store basic info now; detail + price fetched in batch below
        const program = {
          _activityId: activityId,
          _fallbackAges: fallbackAges,
          name: (item.name || "").replace(/^\s*\|+\s*|\s*\|+\s*$/g, "").trim(),
          provider: "City of Vancouver",
          category,
          camp_type: "Summer Camp",
          schedule_type: scheduleType,
          age_min: fallbackAges.ageMin,
          age_max: fallbackAges.ageMax,
          start_date: startDate,
          end_date: endDate,
          days,
          start_time: startTime,
          end_time: endTime,
          cost: 0, // Will be filled by price fetch
          indoor_outdoor: "Indoor",
          neighbourhood: centre.hood,
          address: centre.addr,
          lat: centre.lat,
          lng: centre.lng,
          enrollment_status: "Open", // Will be updated by detail fetch
          registration_url: REGISTRATION_URL_TEMPLATE(activityId),
          description: item.description || `${item.name} at ${centre.name} Community Centre.`,
          tags: [category.toLowerCase(), activityType.toLowerCase()],
          activity_type: activityType,
          last_updated: new Date().toISOString(),
          source: "activenet-vancouver",
          source_id: activityId,
        };

        allPrograms.set(activityId, program);
        centreStats[centre.name].found++;

        if (!existingIds.has(activityId)) {
          centreStats[centre.name].new++;
        }
      }

      if (items.length > 0) {
        console.log(`  "${keyword}": ${items.length} results`);
      }
    }

    console.log(`  Total for ${centre.name}: ${centreStats[centre.name].found} programs (${centreStats[centre.name].new} new)`);
  }

  // ─── Enrich with real prices, ages, and enrollment status ───
  const programsList = Array.from(allPrograms.values());
  console.log(`\n─── Enriching ${programsList.length} programs with detail + price data ───`);

  let pricesFetched = 0;
  let detailsFetched = 0;
  let pricesFound = 0;

  for (let i = 0; i < programsList.length; i++) {
    const program = programsList[i];
    const activityId = program._activityId;

    // Fetch real price
    await sleep(RATE_LIMIT_MS);
    const realPrice = await fetchActivityPrice(activityId, cookies);
    if (realPrice > 0) {
      program.cost = realPrice;
      pricesFound++;
    }
    pricesFetched++;

    // Fetch detail for accurate ages + enrollment status
    await sleep(RATE_LIMIT_MS);
    const detail = await fetchActivityDetail(activityId, cookies);
    if (detail) {
      // Use API age fields (accurate) instead of text parsing (off-by-one)
      if (detail.ageMin !== null) program.age_min = detail.ageMin;
      if (detail.ageMax !== null) program.age_max = detail.ageMax;

      // Determine enrollment status from real data
      program.enrollment_status = determineEnrollmentStatus(detail, program.start_date);

      // Skip programs where price isn't published yet and cost is 0
      // (likely pre-registration add-ons or not yet priced)
      if (!detail.showPriceOnline && program.cost === 0) {
        allPrograms.delete(activityId);
        continue;
      }

      detailsFetched++;
    }

    // Clean up temporary fields before upsert
    delete program._activityId;
    delete program._fallbackAges;

    // Log progress every 50 programs
    if ((i + 1) % 50 === 0) {
      console.log(`  Progress: ${i + 1}/${programsList.length} (${pricesFound} prices found)`);
    }
  }

  console.log(`  Prices fetched: ${pricesFetched} (${pricesFound} had real prices)`);
  console.log(`  Details fetched: ${detailsFetched}`);

  // Upsert to Supabase
  const programsArray = Array.from(allPrograms.values());
  // Clean up any remaining temp fields
  for (const p of programsArray) {
    delete p._activityId;
    delete p._fallbackAges;
  }
  console.log(`\n═══════════════════════════════════════════════════`);
  console.log(`  Total unique programs to upsert: ${programsArray.length}`);
  console.log(`═══════════════════════════════════════════════════\n`);

  if (programsArray.length === 0) {
    console.log("No programs found. This may indicate an API issue. Skipping upsert.");
    return;
  }

  // Upsert in batches of 100
  const BATCH_SIZE = 100;
  let upserted = 0;
  let errors = 0;

  for (let i = 0; i < programsArray.length; i += BATCH_SIZE) {
    const batch = programsArray.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("directory_programs")
      .upsert(batch, {
        onConflict: "source,source_id",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error(`Upsert error (batch ${Math.floor(i / BATCH_SIZE) + 1}):`, error.message);
      errors++;
    } else {
      upserted += batch.length;
    }
  }

  // Summary
  const totalNew = Object.values(centreStats).reduce((sum, s) => sum + s.new, 0);
  console.log("\n═══════════════════════════════════════════════════");
  console.log("  REFRESH SUMMARY");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  Programs found:    ${programsArray.length}`);
  console.log(`  New programs:      ${totalNew}`);
  console.log(`  Upserted:          ${upserted}`);
  console.log(`  Errors:            ${errors}`);
  console.log("");
  console.log("  Per-centre breakdown:");
  for (const [name, stats] of Object.entries(centreStats)) {
    if (stats.found > 0) {
      console.log(`    ${name}: ${stats.found} found, ${stats.new} new`);
    }
  }
  console.log(`\n  Completed at ${new Date().toISOString()}`);
  console.log("═══════════════════════════════════════════════════\n");

  if (errors > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
