/**
 * scrape-activekids.cjs
 *
 * Fetches activekids.com registration pages for all programs in programs.json
 * that have activekids.com URLs, extracts cost, times, ages, and enrollment
 * status, then updates programs.json with the scraped data.
 *
 * Usage: cd skeddo-app && node scripts/scrape-activekids.cjs
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const DELAY_MS = 1200; // delay between requests to avoid rate limiting
const MAX_RETRIES = 2;
const TIMEOUT_MS = 15000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parse cost from page HTML
 * Looks for patterns like C$350.00, $475.00, etc.
 */
function parseCost(html) {
  // Look for JSON-LD price first (most reliable)
  const jsonLdMatch = html.match(/"price"\s*:\s*"?([\d.]+)"?/);
  if (jsonLdMatch) {
    const val = parseFloat(jsonLdMatch[1]);
    if (val > 0 && val < 50000) return val;
  }

  // Look for C$XXX.XX pattern
  const costPatterns = [
    /C\$\s*([\d,]+\.?\d*)/,
    /CAD\s*\$?\s*([\d,]+\.?\d*)/,
    /"priceCurrency"\s*:\s*"CAD"[^}]*"price"\s*:\s*"?([\d.]+)"?/,
  ];
  for (const pat of costPatterns) {
    const m = html.match(pat);
    if (m) {
      const val = parseFloat(m[1].replace(/,/g, ''));
      if (val > 0 && val < 50000) return val;
    }
  }
  return null;
}

/**
 * Parse times from page HTML
 * Looks for patterns like "9:00 AM to 3:00 PM", "10:00 AM - 12:30 PM"
 */
function parseTimes(html) {
  const timePatterns = [
    /(\d{1,2}:\d{2}\s*[AP]M)\s*(?:to|-)\s*(\d{1,2}:\d{2}\s*[AP]M)/i,
    /from\s+(\d{1,2}:\d{2}\s*[AP]M)\s+to\s+(\d{1,2}:\d{2}\s*[AP]M)/i,
  ];
  for (const pat of timePatterns) {
    const m = html.match(pat);
    if (m) {
      let start = m[1].trim().toUpperCase();
      let end = m[2].trim().toUpperCase();
      // Normalize spacing: "9:00AM" -> "9:00 AM"
      start = start.replace(/(\d)(AM|PM)/, '$1 $2');
      end = end.replace(/(\d)(AM|PM)/, '$1 $2');
      return { startTime: start, endTime: end };
    }
  }
  return null;
}

/**
 * Parse age range from page HTML
 * Looks for "Ages X-Y", "Ages X to Y", age badges, structured data
 */
function parseAges(html) {
  // Try "Ages X-Y" or "Ages X to Y"
  const agePatterns = [
    /Ages?\s+(\d{1,2})\s*[-–to]+\s*(\d{1,2})/i,
    /age[s]?\s*:\s*(\d{1,2})\s*[-–to]+\s*(\d{1,2})/i,
    /(\d{1,2})\s*[-–]\s*(\d{1,2})\s*(?:years?|yrs?)/i,
    /(?:for\s+)?(?:ages?\s+)?(\d{1,2})\+/i, // "Ages 6+" -> min only
  ];

  for (let i = 0; i < agePatterns.length; i++) {
    const m = html.match(agePatterns[i]);
    if (m) {
      if (i === 3) {
        // "Ages X+" pattern - only min
        return { ageMin: parseInt(m[1]), ageMax: null };
      }
      const a = parseInt(m[1]);
      const b = parseInt(m[2]);
      if (a >= 0 && a <= 18 && b >= 0 && b <= 18 && a <= b) {
        return { ageMin: a, ageMax: b };
      }
    }
  }

  // Try grade-based: "Grade X/Y" -> approximate ages
  const gradeMatch = html.match(/Grade\s+(\d+)(?:\s*[/&,]\s*(\d+))?(?:\s*[/&,]\s*(\d+))?/i);
  if (gradeMatch) {
    const grades = [gradeMatch[1], gradeMatch[2], gradeMatch[3]].filter(Boolean).map(Number);
    const minGrade = Math.min(...grades);
    const maxGrade = Math.max(...grades);
    // Grade 1 ~ age 6, Grade 7 ~ age 12
    return { ageMin: minGrade + 5, ageMax: maxGrade + 6 };
  }

  // Try "U11", "U13" (under X) patterns common in sports
  const uMatch = html.match(/U(\d{1,2})\s*(?:&|and|,)\s*U(\d{1,2})/i);
  if (uMatch) {
    const ages = [parseInt(uMatch[1]), parseInt(uMatch[2])].sort((a, b) => a - b);
    // "U11 & U13" means age groups, min would be ~8, max would be 12
    return { ageMin: Math.max(ages[0] - 3, 4), ageMax: ages[1] - 1 };
  }
  const uSingle = html.match(/U(\d{1,2})/i);
  if (uSingle) {
    const u = parseInt(uSingle[1]);
    if (u >= 5 && u <= 19) {
      return { ageMin: Math.max(u - 3, 4), ageMax: u - 1 };
    }
  }

  return null;
}

/**
 * Parse enrollment status
 * Returns "Open", "Closed", or "Completed" (for past activities)
 */
function parseEnrollmentStatus(html) {
  const lowerHtml = html.toLowerCase();

  // Check for past/completed
  if (lowerHtml.includes('this activity has passed') ||
      lowerHtml.includes('this event has passed') ||
      lowerHtml.includes('activity has ended')) {
    return 'Completed';
  }

  // Check for closed registration
  if (lowerHtml.includes('registration is closed') ||
      lowerHtml.includes('sign up for this activity is no longer available') ||
      lowerHtml.includes('"availability":"soldout"') ||
      lowerHtml.includes('"availabilitystatus":"soldout"')) {
    return 'Closed';
  }

  // Check structured data for registrationOpen
  const regOpenMatch = html.match(/"registrationOpen"\s*:\s*(true|false)/i);
  if (regOpenMatch) {
    return regOpenMatch[1] === 'true' ? 'Open' : 'Closed';
  }

  // Check for register now button
  if (lowerHtml.includes('register now') || lowerHtml.includes('register today')) {
    return 'Open';
  }

  return null;
}

/**
 * Check if page shows 2026 dates
 */
function has2026Dates(html) {
  return /2026/.test(html);
}

/**
 * Calculate duration per day from start/end times
 */
function calcDuration(startTime, endTime) {
  if (!startTime || !endTime) return null;

  function toMinutes(t) {
    const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return null;
    let h = parseInt(m[1]);
    const min = parseInt(m[2]);
    const ampm = m[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + min;
  }

  const startMin = toMinutes(startTime);
  const endMin = toMinutes(endTime);
  if (startMin === null || endMin === null) return null;

  const diff = endMin - startMin;
  if (diff <= 0 || diff > 720) return null; // sanity check: max 12 hours

  const hours = diff / 60;
  if (hours <= 4) return 'Half Day';
  return 'Full Day';
}

/**
 * Fetch a single URL with retry logic
 */
async function fetchPage(url, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const resp = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      clearTimeout(timeout);

      if (resp.status === 429) {
        console.log(`  Rate limited, waiting 10s...`);
        await sleep(10000);
        continue;
      }

      if (!resp.ok) {
        if (resp.status === 404) return { html: null, status: 404 };
        throw new Error(`HTTP ${resp.status}`);
      }

      const html = await resp.text();
      return { html, status: resp.status };
    } catch (err) {
      if (attempt < retries) {
        console.log(`  Retry ${attempt + 1} for ${url}: ${err.message}`);
        await sleep(3000);
      } else {
        console.log(`  FAILED after ${retries + 1} attempts: ${err.message}`);
        return { html: null, status: null, error: err.message };
      }
    }
  }
}

async function main() {
  console.log('=== ActiveKids.com Scraper ===\n');

  // Load programs
  const allPrograms = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf-8'));
  const akPrograms = allPrograms.filter(
    p => p.registrationUrl && p.registrationUrl.includes('activekids.com')
  );

  console.log(`Total programs: ${allPrograms.length}`);
  console.log(`ActiveKids programs to scrape: ${akPrograms.length}\n`);

  // Group by provider for logging
  const byProvider = {};
  akPrograms.forEach(p => {
    if (!byProvider[p.provider]) byProvider[p.provider] = [];
    byProvider[p.provider].push(p);
  });

  const providerNames = Object.keys(byProvider).sort(
    (a, b) => byProvider[b].length - byProvider[a].length
  );

  console.log('Providers:');
  providerNames.forEach(p => console.log(`  ${p}: ${byProvider[p].length} programs`));
  console.log();

  // Build index map for fast lookup
  const indexMap = new Map();
  allPrograms.forEach((p, i) => indexMap.set(p.id, i));

  let updated = 0;
  let failed = 0;
  let completed = 0; // past activities
  let closed = 0;
  let scraped = 0;

  // Process all programs
  for (let i = 0; i < akPrograms.length; i++) {
    const prog = akPrograms[i];
    const idx = indexMap.get(prog.id);

    console.log(`[${i + 1}/${akPrograms.length}] ${prog.name}`);
    console.log(`  URL: ${prog.registrationUrl}`);

    const { html, status, error } = await fetchPage(prog.registrationUrl);
    scraped++;

    if (!html) {
      if (status === 404) {
        console.log(`  -> 404 Not Found - marking as Completed`);
        allPrograms[idx].enrollmentStatus = 'Completed';
        completed++;
      } else {
        console.log(`  -> Failed to fetch: ${error || `status ${status}`}`);
        failed++;
      }
      await sleep(DELAY_MS);
      continue;
    }

    let changes = [];

    // Parse cost
    const cost = parseCost(html);
    if (cost !== null) {
      if (allPrograms[idx].cost === null || allPrograms[idx].cost === undefined || !allPrograms[idx].priceVerified) {
        allPrograms[idx].cost = cost;
        allPrograms[idx].priceVerified = true;
        changes.push(`cost=$${cost}`);
      }
    }

    // Parse times
    const times = parseTimes(html);
    if (times) {
      if (!allPrograms[idx].startTime) {
        allPrograms[idx].startTime = times.startTime;
        allPrograms[idx].endTime = times.endTime;
        changes.push(`time=${times.startTime}-${times.endTime}`);

        // Calculate duration
        const dur = calcDuration(times.startTime, times.endTime);
        if (dur) {
          allPrograms[idx].dayLength = dur;
          allPrograms[idx].durationPerDay = dur;
        }
      }
    }

    // Parse ages
    const ages = parseAges(html);
    if (ages) {
      if (allPrograms[idx].ageMin === null || allPrograms[idx].ageMin === undefined) {
        allPrograms[idx].ageMin = ages.ageMin;
        if (ages.ageMax !== null) allPrograms[idx].ageMax = ages.ageMax;
        changes.push(`ages=${ages.ageMin}-${ages.ageMax || '?'}`);
      }
    }

    // Parse enrollment status
    const enrollStatus = parseEnrollmentStatus(html);
    if (enrollStatus) {
      allPrograms[idx].enrollmentStatus = enrollStatus;
      changes.push(`status=${enrollStatus}`);
      if (enrollStatus === 'Completed') completed++;
      if (enrollStatus === 'Closed') closed++;
    }

    // Check 2026 dates
    if (has2026Dates(html)) {
      allPrograms[idx].confirmed2026 = true;
    }

    if (changes.length > 0) {
      updated++;
      console.log(`  -> Updated: ${changes.join(', ')}`);
    } else {
      console.log(`  -> No new data found`);
    }

    // Save progress every 50 programs
    if (scraped % 50 === 0) {
      console.log(`\n--- Saving progress (${scraped} scraped) ---\n`);
      fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(allPrograms, null, 2) + '\n');
    }

    await sleep(DELAY_MS);
  }

  // Final save
  fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(allPrograms, null, 2) + '\n');

  console.log('\n=== SUMMARY ===');
  console.log(`Total scraped: ${scraped}`);
  console.log(`Updated with new data: ${updated}`);
  console.log(`Failed to fetch: ${failed}`);
  console.log(`Marked Completed (past): ${completed}`);
  console.log(`Marked Closed: ${closed}`);
  console.log(`Programs.json saved.`);

  // Post-scrape stats
  const final = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf-8'));
  const akFinal = final.filter(p => p.registrationUrl && p.registrationUrl.includes('activekids.com'));
  console.log(`\nPost-scrape field coverage for ActiveKids programs:`);
  console.log(`  Has cost: ${akFinal.filter(p => p.cost !== null && p.cost !== undefined).length}/${akFinal.length}`);
  console.log(`  Has times: ${akFinal.filter(p => p.startTime).length}/${akFinal.length}`);
  console.log(`  Has ages: ${akFinal.filter(p => p.ageMin !== null && p.ageMin !== undefined).length}/${akFinal.length}`);
  console.log(`  Status Open: ${akFinal.filter(p => p.enrollmentStatus === 'Open').length}`);
  console.log(`  Status Closed: ${akFinal.filter(p => p.enrollmentStatus === 'Closed').length}`);
  console.log(`  Status Completed: ${akFinal.filter(p => p.enrollmentStatus === 'Completed').length}`);
  console.log(`  Status TBD: ${akFinal.filter(p => p.enrollmentStatus === 'TBD').length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
