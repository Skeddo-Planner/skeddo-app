#!/usr/bin/env node
/**
 * Skeddo Source-of-Truth Verification Layer (verify-programs.cjs)
 *
 * Visits each program's registrationUrl and cross-checks key fields
 * against what's actually on the registration page:
 *   - URL resolves and doesn't redirect to a generic/homepage
 *   - Page mentions the program name (fuzzy match)
 *   - Price on page matches stored cost
 *   - Enrollment status matches page signals
 *
 * For failed checks, applies automatic resolutions:
 *   - Bad/404 URL → fall back to provider's search page + urlNote
 *   - Price mismatch → update to page price if unambiguous, else null + "Inquire with provider"
 *   - Status mismatch → update to page-detected status, else "Likely Coming Soon"
 *   - JS-rendered pages → URL-only check (content cannot be verified without a browser)
 *
 * Usage:
 *   node scripts/verify-programs.cjs --audit        Check ALL programs
 *   node scripts/verify-programs.cjs --incremental  Check only unverified / stale programs (>7 days)
 *   node scripts/verify-programs.cjs --fix          Apply auto-resolutions to programs.json
 *   node scripts/verify-programs.cjs --limit=N      Process at most N programs (for testing)
 *   node scripts/verify-programs.cjs --verbose      Print every result, not just issues
 *
 * Combines any of the above, e.g.:
 *   node scripts/verify-programs.cjs --incremental --fix --limit=200
 *
 * State tracking:
 *   scripts/verify-state.json — records when each program was last verified
 *
 * Report output:
 *   scripts/verify-report-YYYY-MM-DD.json — full results for the run
 *
 * Exit codes:
 *   0 = all checked programs pass (or all issues auto-resolved with --fix)
 *   1 = unresolved issues remain
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');
const http  = require('http');
const { URL } = require('url');

// ── CLI args ──────────────────────────────────────────────────────────────────
const ARGS        = process.argv.slice(2);
const MODE        = ARGS.includes('--incremental') ? 'incremental' : 'audit';
const FIX         = ARGS.includes('--fix');
const VERBOSE     = ARGS.includes('--verbose');
const LIMIT_ARG   = ARGS.find(a => a.startsWith('--limit='));
const LIMIT       = LIMIT_ARG ? parseInt(LIMIT_ARG.split('=')[1], 10) : null;

// ── Config ────────────────────────────────────────────────────────────────────
const RATE_MS        = 750;     // ms between requests (≈1.3 req/sec across all domains)
const TIMEOUT_MS     = 10000;   // per-request timeout (socket inactivity)
const HARD_TIMEOUT_MS = 10000;  // hard deadline per fetchPage call (total wall-clock budget)
const MAX_HTML_BYTES = 150000;  // cap body read at 150 KB
const MAX_REDIRECTS  = 6;
const STALE_DAYS     = 7;       // re-check after this many days in incremental mode
const STATE_SAVE_EVERY = 50;    // save partial progress to state file every N programs

// ── Paths ─────────────────────────────────────────────────────────────────────
const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const STATE_PATH    = path.join(__dirname, 'verify-state.json');
const TODAY         = new Date().toISOString().split('T')[0];
const REPORT_PATH   = path.join(__dirname, `verify-report-${TODAY}.json`);

// ── Load data ─────────────────────────────────────────────────────────────────
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let state = { lastRun: null, programs: {} };
if (fs.existsSync(STATE_PATH)) {
  try { state = { ...state, ...JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')) }; } catch (_) {}
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch a page, following redirects, capping body at MAX_HTML_BYTES.
 * Returns { status, finalUrl, html, redirectChain, error }
 */
function fetchPage(startUrl) {
  return new Promise(resolve => {
    const redirectChain = [];

    function doRequest(currentUrl, depth) {
      if (depth > MAX_REDIRECTS) {
        return resolve({ status: null, finalUrl: currentUrl, html: '', redirectChain, error: 'Too many redirects' });
      }

      let parsed;
      try { parsed = new URL(currentUrl); } catch (e) {
        return resolve({ status: null, finalUrl: currentUrl, html: '', redirectChain, error: `Invalid URL: ${e.message}` });
      }

      const lib = parsed.protocol === 'https:' ? https : http;
      const options = {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Skeddo-Verifier/1.0; +https://skeddo.ca)',
          'Accept': 'text/html,application/xhtml+xml,*/*;q=0.9',
          'Accept-Language': 'en-CA,en;q=0.9',
        },
        timeout: TIMEOUT_MS,
        rejectUnauthorized: false, // gracefully handle self-signed or expired certs
      };

      const req = lib.request(options, res => {
        const status = res.statusCode;

        // Follow redirects
        if ([301, 302, 303, 307, 308].includes(status) && res.headers.location) {
          let next;
          try { next = new URL(res.headers.location, currentUrl).href; } catch (e) {
            res.resume();
            return resolve({ status, finalUrl: currentUrl, html: '', redirectChain, error: `Bad redirect: ${res.headers.location}` });
          }
          redirectChain.push({ from: currentUrl, to: next, status });
          res.resume();
          return doRequest(next, depth + 1);
        }

        // Read body (capped)
        let html  = '';
        let bytes = 0;
        res.setEncoding('utf8');
        res.on('data', chunk => { if (bytes < MAX_HTML_BYTES) { html += chunk; bytes += chunk.length; } });
        res.on('end',  () => resolve({ status, finalUrl: currentUrl, html, redirectChain, error: null }));
        res.on('error', err => resolve({ status, finalUrl: currentUrl, html, redirectChain, error: err.message }));
      });

      req.on('timeout', () => { req.destroy(); resolve({ status: null, finalUrl: currentUrl, html: '', redirectChain, error: 'Request timed out' }); });
      req.on('error',  err  => resolve({ status: null, finalUrl: currentUrl, html: '', redirectChain, error: err.message }));
      req.end();
    }

    doRequest(startUrl, 0);
  });
}

/**
 * Wraps fetchPage with a hard wall-clock deadline (HARD_TIMEOUT_MS).
 * Even if the socket timeout fires but the stream hangs, this ensures we move on.
 */
function fetchPageWithDeadline(url) {
  return Promise.race([
    fetchPage(url),
    new Promise(resolve =>
      setTimeout(
        () => resolve({ status: null, finalUrl: url, html: '', redirectChain: [], error: 'Hard deadline exceeded' }),
        HARD_TIMEOUT_MS
      )
    ),
  ]);
}

/**
 * Returns the provider's generic registration/search page URL.
 * Used as fallback when the specific program URL can't be resolved.
 */
function getProviderSearchPage(registrationUrl, provider) {
  try {
    const u    = new URL(registrationUrl);
    const host = u.hostname.toLowerCase();

    // ActiveNet municipalities (CoV, Burnaby, West Van, Port Coquitlam, etc.)
    if (host === 'anc.ca.apm.activecommunities.com') {
      const city = registrationUrl.split('activecommunities.com/')[1]?.split('/')[0];
      return city
        ? `https://anc.ca.apm.activecommunities.com/${city}/activity/search`
        : 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search';
    }

    // PerfectMind (Richmond, Coquitlam, etc.)
    if (host === 'webreg.perfectmind.com' || host.includes('perfectmind.com')) {
      return `${u.protocol}//${u.hostname}`;
    }

    // CampBrain registration portals
    if (host.endsWith('.campbrainregistration.com')) {
      return `${u.protocol}//${u.hostname}`;
    }

    // PowerUp Sports
    if (host.endsWith('.powerupsports.com')) {
      return `${u.protocol}//${u.hostname}`;
    }

    // Uplift registration portals
    if (host.endsWith('.uplifterinc.com')) {
      return `${u.protocol}//${u.hostname}`;
    }

    // Corsizio event pages
    if (host.includes('corsizio.com')) {
      return `${u.protocol}//${u.hostname}`;
    }

    // Eventbrite — organizer page is the right fallback
    if (host === 'www.eventbrite.ca' || host === 'eventbrite.ca') {
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts[0] === 'o') return registrationUrl; // already an organizer page
      return 'https://www.eventbrite.ca/d/canada--vancouver/events/';
    }

    // Generic fallback: provider root domain
    return `${u.protocol}//${u.hostname}`;
  } catch (_) {
    return null;
  }
}

/**
 * Returns true if the final URL after redirects is a homepage
 * (i.e., the original deep-link redirected to the root or a generic page).
 */
function isHomepageRedirect(originalUrl, finalUrl) {
  try {
    const orig  = new URL(originalUrl);
    const final = new URL(finalUrl);

    // Redirected to a completely different domain
    if (orig.hostname !== final.hostname) return true;

    const origPath  = orig.pathname.replace(/\/+$/, '');
    const finalPath = final.pathname.replace(/\/+$/, '');

    // Final is root, /home, or index page — but original was deeper
    if (
      (finalPath === '' || finalPath === '/home' || finalPath === '/index.html' || finalPath === '/index.htm') &&
      origPath.length > 5
    ) return true;

    // Path became drastically shorter (e.g., /programs/summer/junior-artists → /)
    if (origPath.length > 20 && finalPath.length < origPath.length * 0.3) return true;

    return false;
  } catch (_) {
    return false;
  }
}

/**
 * Returns true if the page appears to be a JavaScript SPA
 * with little or no static text content visible in the raw HTML.
 */
function isJsRendered(html) {
  if (!html || html.length < 500) return true;
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length < 300) return true;
  // React/Vue/Angular root divs with very little textual content
  if ((/<div[^>]+id=["']root["']/i.test(html) || /<div[^>]+id=["']app["']/i.test(html)) && text.length < 800) return true;
  return false;
}

/**
 * Fuzzy match: fraction of significant words from programName found in page HTML.
 * Score 0.0–1.0 (≥ 0.5 = match, 0.3–0.5 = weak, < 0.3 = not found).
 */
function fuzzyNameScore(html, programName) {
  if (!html || !programName) return 0;

  const text = html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#\d+;/g, ' ').toLowerCase();

  const STOPWORDS = new Set([
    'the','and','for','with','your','our','this','that','are','was','have',
    'been','will','from','they','their','what','when','where','how','can',
    'not','all','but','more','also','than','into','out','about','some',
  ]);

  const words = programName
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOPWORDS.has(w));

  if (words.length === 0) return 1; // no significant words → assume OK
  const matches = words.filter(w => text.includes(w));
  return matches.length / words.length;
}

/**
 * Extract dollar amounts from page HTML.
 * Returns array of numeric prices found (filtered to plausible program-cost range).
 */
function extractPrices(html) {
  const text = html.replace(/<[^>]+>/g, ' ');
  const raw  = text.match(/\$\s*(\d{1,4}(?:[,]\d{3})*(?:\.\d{2})?)/g) || [];
  return raw
    .map(m => parseFloat(m.replace(/[$,\s]/g, '')))
    .filter(n => !isNaN(n) && n > 0 && n < 10000);
}

/**
 * Check whether the stored cost is consistent with prices found on the page.
 * Returns 'match' | 'mismatch' | 'unknown' (no prices found).
 */
function checkPrice(storedCost, html) {
  if (storedCost === null || storedCost === undefined) return 'unknown';
  const pagePrices = extractPrices(html);
  if (pagePrices.length === 0) return 'unknown';
  const tolerance = Math.max(15, storedCost * 0.10); // 10% or $15, whichever is greater
  return pagePrices.some(p => Math.abs(p - storedCost) <= tolerance) ? 'match' : 'mismatch';
}

/**
 * Detect enrollment status signals from page text.
 * Returns a status string or null if signals are ambiguous.
 */
function detectEnrollmentStatus(html) {
  const text = html.replace(/<[^>]+>/g, ' ').toLowerCase();

  if (/registration\s+(is\s+)?closed|registrations\s+(are\s+)?closed/i.test(text)) return 'Closed';
  if (/sold\s+out|class\s+is\s+full|fully\s+(enrolled|booked)|no\s+spots\s+(left|available)/i.test(text)) return 'Full';
  if (/waitlist|wait\s+list/i.test(text)) return 'Full/Waitlist';
  if (/registration\s+opens|opens\s+on\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i.test(text)) return 'Coming Soon';
  if (/coming\s+soon|not\s+yet\s+open|available\s+soon/i.test(text)) return 'Likely Coming Soon';
  if (/register\s+now|enroll\s+now|add\s+to\s+cart|book\s+now|sign\s+up\s+now|register\s+today|online\s+registration|proceed\s+to\s+checkout/i.test(text)) return 'Open';

  return null;
}

// ── Per-program verification ──────────────────────────────────────────────────

/**
 * Verify a single program against its registrationUrl.
 * Returns a result object with checks, issues, and recommended resolutions.
 */
async function verifyProgram(program) {
  const result = {
    id:          program.id,
    name:        program.name,
    url:         program.registrationUrl,
    checks:      {},
    issues:      [],
    resolutions: [],
    jsRendered:  false,
  };

  // Programs with no URL that are "Likely Coming Soon" are valid — skip silently
  if (!program.registrationUrl) {
    result.checks.url = program.enrollmentStatus === 'Likely Coming Soon'
      ? 'skipped-expected-no-url'
      : 'missing';
    if (result.checks.url === 'missing') {
      result.issues.push('No registrationUrl but status is not "Likely Coming Soon"');
    }
    return result;
  }

  // ── Fetch ──
  const { status, finalUrl, html, redirectChain, error } = await fetchPageWithDeadline(program.registrationUrl);

  result.httpStatus    = status;
  result.finalUrl      = finalUrl;
  result.redirectCount = redirectChain.length;

  // ── Check: URL resolves ──
  if (error && !status) {
    result.checks.url = 'network-error';
    result.issues.push(`Network error: ${error}`);
    result.resolutions.push({
      type:         'url',
      action:       'fallback-to-search',
      reason:       error,
      suggestedUrl: getProviderSearchPage(program.registrationUrl, program.provider),
      urlNote:      'Search provider site for this program',
    });
    return result;
  }

  if (status === 404 || status === 410) {
    result.checks.url = 'not-found';
    result.issues.push(`URL returned HTTP ${status}`);
    result.resolutions.push({
      type:         'url',
      action:       'fallback-to-search',
      reason:       `HTTP ${status}`,
      suggestedUrl: getProviderSearchPage(program.registrationUrl, program.provider),
      urlNote:      'Search provider site for this program',
    });
    return result;
  }

  if (status >= 500) {
    // Temporary server error — flag but don't auto-fix (may resolve itself)
    result.checks.url = 'server-error';
    result.issues.push(`URL returned server error HTTP ${status} (temporary — recheck later)`);
    return result;
  }

  if (status >= 400) {
    result.checks.url = 'client-error';
    result.issues.push(`URL returned HTTP ${status}`);
    result.resolutions.push({
      type:         'url',
      action:       'fallback-to-search',
      reason:       `HTTP ${status}`,
      suggestedUrl: getProviderSearchPage(program.registrationUrl, program.provider),
      urlNote:      `HTTP ${status} — search provider site for this program`,
    });
    return result;
  }

  // ── Check: Not a homepage redirect ──
  if (redirectChain.length > 0 && isHomepageRedirect(program.registrationUrl, finalUrl)) {
    result.checks.url = 'homepage-redirect';
    result.issues.push(`URL redirected to generic page: ${finalUrl}`);
    result.resolutions.push({
      type:         'url',
      action:       'fallback-to-search',
      reason:       `Redirected to homepage (${finalUrl})`,
      suggestedUrl: getProviderSearchPage(program.registrationUrl, program.provider),
      urlNote:      'Original link no longer works — search provider site for this program',
    });
    return result;
  }

  result.checks.url = 'ok';

  // ── JS-rendered detection — content checks can't run without a browser ──
  if (isJsRendered(html)) {
    result.jsRendered      = true;
    result.checks.content  = 'js-rendered';
    // URL resolved successfully — that is all we can verify without Puppeteer
    return result;
  }

  // ── Check: Program name appears on page ──
  const nameScore     = fuzzyNameScore(html, program.name);
  result.nameScore    = parseFloat(nameScore.toFixed(2));
  result.checks.name  = nameScore >= 0.5 ? 'match' : nameScore > 0.25 ? 'weak-match' : 'not-found';

  if (nameScore < 0.3) {
    result.issues.push(`Program name "${program.name}" not found on page (match score: ${result.nameScore})`);
    result.resolutions.push({
      type:   'name',
      action: 'manual-review',
      reason: 'Program name not found — URL may point to wrong program',
    });
  }

  // ── Check: Price ──
  if (program.cost !== null && program.cost !== undefined) {
    const priceCheck    = checkPrice(program.cost, html);
    result.checks.price = priceCheck;

    if (priceCheck === 'mismatch') {
      const pagePrices   = extractPrices(html);
      result.pagePrices  = pagePrices;
      result.issues.push(
        `Price mismatch: stored $${program.cost}, page shows: ${pagePrices.map(p => `$${p}`).join(', ')}`
      );

      if (pagePrices.length === 1) {
        // Single unambiguous price on page — update to it
        result.resolutions.push({
          type:     'price',
          action:   'update-to-page-price',
          newCost:  pagePrices[0],
          reason:   'Single price found on page',
        });
      } else {
        // Multiple prices or ambiguous — graceful fallback (Rule 37)
        result.resolutions.push({
          type:             'price',
          action:           'set-null',
          newCost:          null,
          newCostNote:      'Inquire with provider',
          newPriceVerified: false,
          reason:           'Price mismatch — multiple prices on page or amount unclear',
        });
      }
    }
  }

  // ── Check: Enrollment status ──
  const pageStatus    = detectEnrollmentStatus(html);
  result.pageStatus   = pageStatus;
  result.checks.status = pageStatus ? 'detected' : 'unknown';

  if (pageStatus && program.enrollmentStatus) {
    // Treat "Full" and "Full/Waitlist" as variants of the same general state
    const normalise = s => s.replace('Full/Waitlist', 'Full').replace('Waitlist', 'Full');
    const normPage  = normalise(pageStatus);
    const normStored = normalise(program.enrollmentStatus);

    const openGroup   = new Set(['Open', 'Full', 'In Progress']);
    const closedGroup = new Set(['Closed', 'Completed']);
    const soonGroup   = new Set(['Coming Soon', 'Upcoming', 'Likely Coming Soon']);

    const pageGroup   = openGroup.has(normPage) ? 'open' : closedGroup.has(normPage) ? 'closed' : 'soon';
    const storedGroup = openGroup.has(normStored) ? 'open' : closedGroup.has(normStored) ? 'closed' : 'soon';

    if (pageGroup !== storedGroup) {
      result.issues.push(
        `Status mismatch: stored "${program.enrollmentStatus}", page signals "${pageStatus}"`
      );
      result.resolutions.push({
        type:      'status',
        action:    'update-to-page-status',
        newStatus: pageStatus,
        reason:    'Page signals a different enrollment state',
      });
    }
  }

  return result;
}

// ── Apply resolutions to a program object ─────────────────────────────────────

function applyResolutions(program, verifyResult) {
  let changed = false;

  for (const res of verifyResult.resolutions) {
    // URL fallback
    if (res.type === 'url' && res.action === 'fallback-to-search') {
      if (res.suggestedUrl) {
        program.registrationUrl = res.suggestedUrl;
        program.urlNote         = res.urlNote || 'Search provider site for this program';
        changed = true;
      } else {
        // No fallback URL available — set to Likely Coming Soon (graceful degradation)
        if (!['Likely Coming Soon', 'Closed', 'Completed'].includes(program.enrollmentStatus)) {
          program.enrollmentStatus = 'Likely Coming Soon';
          changed = true;
        }
      }
    }

    // Price resolution
    if (res.type === 'price') {
      if (res.action === 'update-to-page-price') {
        program.cost          = res.newCost;
        program.priceVerified = false; // Mark for manual re-confirmation
        changed = true;
      } else if (res.action === 'set-null') {
        program.cost          = null;
        program.costNote      = res.newCostNote || 'Inquire with provider';
        program.priceVerified = false;
        changed = true;
      }
    }

    // Status update from page
    if (res.type === 'status' && res.action === 'update-to-page-status') {
      program.enrollmentStatus = res.newStatus;
      changed = true;
    }
  }

  return changed;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n=== SKEDDO PROGRAM VERIFIER ===');
  console.log(`Mode: ${MODE.toUpperCase()} | Fix: ${FIX} | Verbose: ${VERBOSE} | Date: ${TODAY}`);
  console.log(`Total programs in database: ${programs.length}`);

  // ── Select which programs to check ──
  let toCheck;

  if (MODE === 'incremental') {
    const cutoff = new Date(Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000).toISOString();
    toCheck = programs.filter(p => {
      const s = state.programs[String(p.id)];
      // Re-check if: never checked, last check was stale, or last check returned an error
      return !s || !s.verifiedAt || s.verifiedAt < cutoff || s.outcome === 'error';
    });
    console.log(`Incremental: ${toCheck.length} programs to check (unverified or >${STALE_DAYS} days old)`);
  } else {
    toCheck = programs.slice(); // audit = all programs
    console.log(`Audit: checking all ${toCheck.length} programs`);
  }

  // Apply --limit
  if (LIMIT !== null && LIMIT > 0) {
    toCheck = toCheck.slice(0, LIMIT);
    console.log(`Limited to ${toCheck.length} programs (--limit=${LIMIT})`);
  }

  // Programs with no URL that are legitimately "Likely Coming Soon" → skip silently
  const expectedNoUrl = toCheck.filter(p => !p.registrationUrl && p.enrollmentStatus === 'Likely Coming Soon');
  toCheck = toCheck.filter(p => p.registrationUrl || p.enrollmentStatus !== 'Likely Coming Soon');

  if (expectedNoUrl.length > 0) {
    console.log(`Skipping ${expectedNoUrl.length} "Likely Coming Soon" programs with no URL (expected)`);
  }

  console.log(`\nChecking ${toCheck.length} programs at ${1000 / RATE_MS}req/s...\n`);

  // ── Run checks ──
  const report = {
    date:    TODAY,
    mode:    MODE,
    total:   toCheck.length,
    skipped: expectedNoUrl.length,
    results: [],
    summary: { ok: 0, issues: 0, resolved: 0, unresolved: 0, jsRendered: 0 },
  };

  let programsModified = false;

  for (let i = 0; i < toCheck.length; i++) {
    const program = toCheck[i];
    const id      = String(program.id);

    if (i > 0) await sleep(RATE_MS);

    if (VERBOSE || i % 10 === 0) {
      process.stdout.write(`[${i + 1}/${toCheck.length}] ${program.name} (${id})\n`);
    }

    let verifyResult;
    try {
      verifyResult = await verifyProgram(program);
    } catch (err) {
      verifyResult = {
        id:          program.id,
        name:        program.name,
        url:         program.registrationUrl,
        checks:      { url: 'exception' },
        issues:      [`Unexpected exception: ${err.message}`],
        resolutions: [],
      };
    }

    // Track in state file
    state.programs[id] = {
      verifiedAt: new Date().toISOString(),
      outcome:    verifyResult.issues.length === 0 ? 'ok' : 'issues',
      issueCount: verifyResult.issues.length,
    };

    // Periodically flush state to disk so we can resume if interrupted
    if ((i + 1) % STATE_SAVE_EVERY === 0) {
      state.lastRun = new Date().toISOString();
      fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
      process.stdout.write(`  [checkpoint] State saved at program ${i + 1}/${toCheck.length}\n`);
    }

    if (verifyResult.jsRendered) report.summary.jsRendered++;

    if (verifyResult.issues.length === 0) {
      report.summary.ok++;
      if (VERBOSE) console.log(`  ✓ OK`);
    } else {
      report.summary.issues++;

      // Attempt auto-resolution
      if (FIX && verifyResult.resolutions.some(r => r.action !== 'manual-review')) {
        const changed = applyResolutions(program, verifyResult);
        if (changed) {
          programsModified = true;
          report.summary.resolved++;
          if (VERBOSE) {
            const types = verifyResult.resolutions.filter(r => r.action !== 'manual-review').map(r => r.type);
            console.log(`  ✓ Auto-resolved: ${types.join(', ')}`);
          }
        } else {
          report.summary.unresolved++;
        }
      } else {
        report.summary.unresolved++;
      }

      if (VERBOSE || verifyResult.checks.url !== 'ok') {
        for (const issue of verifyResult.issues) {
          console.log(`  [ISSUE] ${issue}`);
        }
      }
    }

    report.results.push(verifyResult);
  }

  // ── Persist state ──
  state.lastRun = new Date().toISOString();
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));

  // ── Save programs.json if modified ──
  if (FIX && programsModified) {
    fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2));
    console.log(`\n✓ programs.json updated with ${report.summary.resolved} auto-resolutions.`);
  }

  // ── Save report ──
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  // ── Print summary ──
  console.log('\n=== VERIFICATION SUMMARY ===');
  console.log(`Checked:       ${report.total}`);
  console.log(`OK:            ${report.summary.ok}`);
  console.log(`JS-rendered:   ${report.summary.jsRendered} (URL verified, content not checkable)`);
  console.log(`With issues:   ${report.summary.issues}`);
  if (FIX) {
    console.log(`Auto-resolved: ${report.summary.resolved}`);
    console.log(`Unresolved:    ${report.summary.unresolved}`);
  }
  console.log(`Skipped:       ${report.summary.skipped}`);
  console.log(`\nReport saved:  ${REPORT_PATH}`);
  console.log(`State saved:   ${STATE_PATH}\n`);

  const exitIssues = FIX ? report.summary.unresolved : report.summary.issues;
  process.exit(exitIssues > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
