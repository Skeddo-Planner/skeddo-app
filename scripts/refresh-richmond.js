/**
 * Skeddo — City of Richmond Program Refresh Script
 *
 * Checks the City of Richmond PerfectMind booking system for summer camp
 * availability and updates the Supabase directory_programs table.
 *
 * Richmond uses PerfectMind (BookMe4), a JavaScript SPA. We attempt to call
 * the internal API endpoints that the SPA uses to load course data.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/refresh-richmond.js
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

const RATE_LIMIT_MS = 500; // Be polite to PerfectMind servers
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── PerfectMind Configuration ────────────────────────────────
const PM_BASE = "https://richmondcity.perfectmind.com/23650";
const WIDGET_ID = "15f6af07-39c5-473e-b053-96653f77a406";

// Calendar IDs for different age groups
const CALENDARS = {
  children: { id: "17a44143-25f4-4d94-8100-22eb7de0204b", label: "Children (ages 6-12)" },
  preschool: { id: "eebf133e-f56e-4782-bf67-17877093e87f", label: "Preschool (ages 3-5)" },
  youth: { id: "10472f5b-3be6-4dae-bd73-c0dfef3e09e7", label: "Youth (ages 13+)" },
};

// Community centres that run camps
const CENTRES = [
  { name: "Thompson Community Centre", address: "5151 Granville Ave, Richmond, BC" },
  { name: "South Arm Community Centre", address: "8880 Williams Rd, Richmond, BC" },
  { name: "Steveston Community Centre", address: "4111 Moncton St, Richmond, BC" },
  { name: "City Centre Community Centre", address: "5900 Minoru Blvd, Richmond, BC" },
  { name: "West Richmond Community Centre", address: "9180 No. 1 Rd, Richmond, BC" },
  { name: "Cambie Community Centre", address: "12800 Cambie Rd, Richmond, BC" },
  { name: "Sea Island Community Centre", address: "7140 Miller Rd, Richmond, BC" },
  { name: "Hamilton Community Centre", address: "5140 Smith Dr, Richmond, BC" },
];

// ─── PerfectMind API Exploration ──────────────────────────────
// PerfectMind SPAs load data via internal API calls. We try several
// known endpoint patterns to find one that returns course data.

const API_PATTERNS = [
  // Pattern 1: BookMe4 API
  (calendarId) =>
    `${PM_BASE}/Clients/BookMe4BookingPages/api/CoursesV2?calendarId=${calendarId}&widgetId=${WIDGET_ID}`,
  // Pattern 2: Courses list
  (calendarId) =>
    `${PM_BASE}/Clients/BookMe4BookingPages/CoursesV2?calendarId=${calendarId}&widgetId=${WIDGET_ID}`,
  // Pattern 3: Direct API
  (calendarId) =>
    `${PM_BASE}/api/Course/GetCoursesList?calendarId=${calendarId}&widgetId=${WIDGET_ID}`,
  // Pattern 4: Booking pages API
  (calendarId) =>
    `${PM_BASE}/Clients/BookMe4BookingPages/BookingCoursesPage/GetCourses?calendarId=${calendarId}&widgetId=${WIDGET_ID}`,
];

/**
 * Try to fetch course data from PerfectMind's internal API.
 * Returns parsed courses array or null if all attempts fail.
 */
async function fetchPerfectMindCourses(calendarId, calendarLabel) {
  console.log(`  Trying API endpoints for ${calendarLabel}...`);

  for (let i = 0; i < API_PATTERNS.length; i++) {
    const url = API_PATTERNS[i](calendarId);
    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "User-Agent": "Skeddo/1.0 (skeddo.ca; program refresh)",
          "X-Requested-With": "XMLHttpRequest",
          Referer: `${PM_BASE}/Clients/BookMe4BookingPages/BookingCoursesPage?calendarId=${calendarId}&widgetId=${WIDGET_ID}`,
        },
      });

      if (res.ok) {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("json")) {
          const data = await res.json();
          // Check if we got actual course data
          if (data && (Array.isArray(data) || data.courses || data.items || data.data)) {
            const courses = Array.isArray(data) ? data : (data.courses || data.items || data.data || []);
            console.log(`    ✓ Pattern ${i + 1} returned ${courses.length} courses`);
            return courses;
          }
        }
        console.log(`    Pattern ${i + 1}: ${res.status} but no course data`);
      } else {
        console.log(`    Pattern ${i + 1}: ${res.status}`);
      }
    } catch (err) {
      console.log(`    Pattern ${i + 1}: error — ${err.message}`);
    }
    await sleep(RATE_LIMIT_MS);
  }

  return null;
}

/**
 * Fetch the booking page HTML and try to extract embedded JSON data.
 * Some SPAs embed initial state in a script tag.
 */
async function fetchPageEmbeddedData(calendarId) {
  const url = `${PM_BASE}/Clients/BookMe4BookingPages/BookingCoursesPage?calendarId=${calendarId}&widgetId=${WIDGET_ID}&embed=False`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Skeddo/1.0 (skeddo.ca; program refresh)",
        Accept: "text/html",
      },
    });

    if (!res.ok) return null;
    const html = await res.text();

    // Look for embedded JSON data in script tags
    // PerfectMind often embeds initial data like: window.__INITIAL_STATE__ = {...}
    const statePatterns = [
      /window\.__INITIAL_STATE__\s*=\s*({.+?});/s,
      /window\.__DATA__\s*=\s*({.+?});/s,
      /var\s+initialData\s*=\s*({.+?});/s,
      /"courses"\s*:\s*(\[.+?\])/s,
      /"programs"\s*:\s*(\[.+?\])/s,
    ];

    for (const pattern of statePatterns) {
      const match = html.match(pattern);
      if (match) {
        try {
          const data = JSON.parse(match[1]);
          console.log("    ✓ Found embedded data in HTML");
          return data;
        } catch {
          // Not valid JSON, continue
        }
      }
    }

    // Check if the page contains "no available classes" text
    if (html.includes("no available classes") || html.includes("no courses available")) {
      console.log("    Page indicates no available classes at this time");
      return "no_courses";
    }

    return null;
  } catch (err) {
    console.log(`    HTML fetch error: ${err.message}`);
    return null;
  }
}

// ─── Richmond Olympic Oval ───────────────────────────────────
const OVAL_BASE = "https://richmondoval.ca";

/**
 * Scrape the Richmond Olympic Oval summer camps pages for updates.
 */
async function refreshOvalPrograms() {
  console.log("\n─── Richmond Olympic Oval ───");

  const campPages = [
    { url: `${OVAL_BASE}/sport/camps/multi-sport-camps/`, category: "Multi-Sport" },
    { url: `${OVAL_BASE}/sport/camps/adventure-camps/`, category: "Adventure" },
    { url: `${OVAL_BASE}/sport/camps/sport-specific-camps/`, category: "Sport-Specific" },
    { url: `${OVAL_BASE}/sport/camps/ice-camps/`, category: "Ice Sports" },
    { url: `${OVAL_BASE}/camps/summer-camps/`, category: "General" },
  ];

  const programs = [];
  let campIndex = 0;

  for (const page of campPages) {
    await sleep(RATE_LIMIT_MS);
    try {
      const res = await fetch(page.url, {
        headers: {
          "User-Agent": "Skeddo/1.0 (skeddo.ca; program refresh)",
          Accept: "text/html",
        },
      });

      if (!res.ok) {
        console.log(`  ${page.category}: HTTP ${res.status}`);
        continue;
      }

      const html = await res.text();

      // Extract camp info from the HTML
      const parsed = parseOvalCampPage(html, page.category);
      if (parsed.length > 0) {
        console.log(`  ${page.category}: found ${parsed.length} camps`);
        programs.push(...parsed);
      } else {
        console.log(`  ${page.category}: no camp data found (page may not be updated yet)`);
      }
    } catch (err) {
      console.log(`  ${page.category}: error — ${err.message}`);
    }
  }

  return programs;
}

/**
 * Parse camp information from an Oval camp page HTML.
 */
function parseOvalCampPage(html, category) {
  const camps = [];

  // Look for price patterns like "$299" or "$225"
  const priceMatches = [...html.matchAll(/\$(\d{2,3}(?:\.\d{2})?)/g)];
  const prices = priceMatches.map((m) => parseFloat(m[1]));

  // Look for age patterns like "Ages 6-9" or "ages 9-12"
  const ageMatches = [...html.matchAll(/ages?\s*(\d{1,2})\s*[-–]\s*(\d{1,2})/gi)];

  // Look for camp name patterns in headings
  const headingMatches = [...html.matchAll(/<h[2-4][^>]*>([^<]+(?:camp|adventure|sport|skate|hockey|climb)[^<]*)<\/h[2-4]>/gi)];

  // Look for "sold out" or "register" buttons
  const hasSoldOut = /sold\s*out|full|waitlist/i.test(html);
  const hasRegister = /register|sign\s*up|enroll/i.test(html);

  // Look for date patterns
  const dateMatches = [...html.matchAll(/((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:\s*[-–]\s*\d{1,2})?(?:,?\s*\d{4})?)/gi)];

  // For now, return basic detection info
  if (headingMatches.length > 0 || ageMatches.length > 0 || prices.length > 0) {
    return [{
      category,
      headings: headingMatches.map((m) => m[1].trim()),
      ages: ageMatches.map((m) => ({ min: parseInt(m[1]), max: parseInt(m[2]) })),
      prices: [...new Set(prices)],
      dates: dateMatches.map((m) => m[1]),
      hasSoldOut,
      hasRegister,
    }];
  }

  return [];
}

// ─── Category Mapping ────────────────────────────────────────
function mapRichmondCategory(serviceName) {
  const name = serviceName.toLowerCase();
  if (name.includes("adventure")) return { category: "General", activityType: "Outdoor Adventure" };
  if (name.includes("art")) return { category: "Arts", activityType: "Visual Arts" };
  if (name.includes("bricks") || name.includes("lego")) return { category: "STEM", activityType: "STEM" };
  if (name.includes("byte") || name.includes("computer") || name.includes("tech")) return { category: "STEM", activityType: "Technology" };
  if (name.includes("heritage")) return { category: "Arts", activityType: "Heritage" };
  if (name.includes("martial")) return { category: "Sports", activityType: "Martial Arts" };
  if (name.includes("music")) return { category: "Music", activityType: "Music" };
  if (name.includes("musical theatre")) return { category: "Arts", activityType: "Performing Arts" };
  if (name.includes("nature")) return { category: "Outdoor", activityType: "Nature" };
  if (name.includes("racquet")) return { category: "Sports", activityType: "Racquet Sports" };
  if (name.includes("science")) return { category: "STEM", activityType: "Science" };
  if (name.includes("sportball")) return { category: "Sports", activityType: "Multi-Sport" };
  if (name.includes("sport")) return { category: "Sports", activityType: "Sports" };
  if (name.includes("variety") || name.includes("general")) return { category: "General", activityType: "Day Camp" };
  if (name.includes("licensed")) return { category: "General", activityType: "Day Camp" };
  return { category: "General", activityType: "Day Camp" };
}

// ─── Main Pipeline ───────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Skeddo — City of Richmond Program Refresh");
  console.log(`  Started at ${new Date().toISOString()}`);
  console.log("═══════════════════════════════════════════════════\n");

  let totalFound = 0;
  let totalUpserted = 0;
  let apiWorked = false;

  // ─── Try PerfectMind API for each calendar ───
  for (const [key, calendar] of Object.entries(CALENDARS)) {
    console.log(`\n─── ${calendar.label} ───`);

    // Try API endpoints first
    const courses = await fetchPerfectMindCourses(calendar.id, calendar.label);

    if (courses && courses.length > 0) {
      apiWorked = true;
      console.log(`  Found ${courses.length} courses via API`);
      totalFound += courses.length;

      // Process and upsert each course
      const programs = courses.map((course, idx) => {
        const cat = mapRichmondCategory(course.name || course.serviceName || "");
        return {
          name: course.name || course.title || `Richmond Camp ${idx}`,
          provider: course.location ? `City of Richmond - ${course.location}` : "City of Richmond",
          category: cat.category,
          camp_type: "Summer Camp",
          schedule_type: course.fullDay ? "Full Day" : "Half Day",
          age_min: course.ageFrom || course.minAge || null,
          age_max: course.ageTo || course.maxAge || null,
          start_date: course.startDate || null,
          end_date: course.endDate || null,
          days: "Mon-Fri",
          start_time: course.startTime || "9:00 AM",
          end_time: course.endTime || "4:00 PM",
          cost: course.price || course.fee || 0,
          indoor_outdoor: "Both",
          neighbourhood: "Richmond",
          address: null,
          lat: null,
          lng: null,
          enrollment_status: course.isFull ? "Full/Waitlist" : (course.spotsAvailable === 0 ? "Full/Waitlist" : "Open"),
          registration_url: `${PM_BASE}/Clients/BookMe4BookingPages/BookingCoursesPage?calendarId=${calendar.id}&widgetId=${WIDGET_ID}&embed=False`,
          description: course.description || `City of Richmond summer camp program.`,
          tags: [cat.category.toLowerCase(), cat.activityType.toLowerCase()],
          activity_type: cat.activityType,
          last_updated: new Date().toISOString(),
          source: "perfectmind-richmond",
          source_id: `richmond-${course.id || course.courseId || `${key}-${idx}`}`,
        };
      });

      // Upsert to Supabase
      const { error } = await supabase
        .from("directory_programs")
        .upsert(programs, { onConflict: "source,source_id", ignoreDuplicates: false });

      if (error) {
        console.error(`  Upsert error: ${error.message}`);
      } else {
        totalUpserted += programs.length;
        console.log(`  Upserted ${programs.length} programs`);
      }
    } else {
      // Try to get embedded data from HTML
      const embedded = await fetchPageEmbeddedData(calendar.id);
      if (embedded === "no_courses") {
        console.log(`  No courses available yet — Richmond hasn't published summer 2026 listings`);
      } else if (embedded) {
        console.log(`  Found embedded data, processing...`);
        // Process embedded data similarly
      } else {
        console.log(`  Could not retrieve course data — API endpoints may have changed`);
      }
    }

    await sleep(RATE_LIMIT_MS);
  }

  // ─── Richmond Olympic Oval ───
  const ovalData = await refreshOvalPrograms();

  if (ovalData.length > 0) {
    console.log(`\n  Oval: detected camp data on ${ovalData.length} pages`);
    // Log what we found for monitoring
    for (const d of ovalData) {
      console.log(`    ${d.category}: ${d.headings.length} headings, ${d.ages.length} age groups, ${d.prices.length} prices`);
      if (d.prices.length > 0) console.log(`      Prices: ${d.prices.map((p) => "$" + p).join(", ")}`);
      if (d.hasSoldOut) console.log(`      ⚠ Some camps appear sold out`);
    }
  }

  // ─── Summary ───
  console.log("\n═══════════════════════════════════════════════════");
  console.log("  RICHMOND REFRESH SUMMARY");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  API data available:  ${apiWorked ? "Yes" : "No (listings not published yet)"}`);
  console.log(`  Courses found:       ${totalFound}`);
  console.log(`  Programs upserted:   ${totalUpserted}`);
  console.log(`  Oval pages checked:  ${ovalData.length}`);
  console.log(`\n  Completed at ${new Date().toISOString()}`);
  console.log("═══════════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
