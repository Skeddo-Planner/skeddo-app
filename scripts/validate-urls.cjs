#!/usr/bin/env node
/**
 * Skeddo URL Resolution Validator (validate-urls.cjs)
 *
 * Fast, focused check of every registrationUrl in programs.json.
 * Uses GET requests (not HEAD) so it can also check page content.
 *
 * Checks:
 *   1. Does the URL resolve? (no 404/500)
 *   2. Does it redirect to a generic homepage?
 *   3. Does the landing page contain the program name?
 *
 * Resolution rules (applied with --fix):
 *   - 404 / 410 / redirect-to-homepage → fall back to provider search page + urlNote
 *   - 4xx client errors                → same fallback
 *   - 5xx server errors                → flag only (may be temporary)
 *   - Name not found on page           → flag for manual review (no auto-fix)
 *   - URL already OK                   → mark as urlVerified: true (with --fix)
 *
 * Usage:
 *   node scripts/validate-urls.cjs               Report mode — print issues, no changes
 *   node scripts/validate-urls.cjs --fix          Apply URL resolutions to programs.json
 *   node scripts/validate-urls.cjs --limit=N      Process at most N programs (for testing)
 *   node scripts/validate-urls.cjs --verbose      Print every result, not just failures
 *   node scripts/validate-urls.cjs --skip-content Skip name-on-page check (faster)
 *
 * Can also be required from other scripts:
 *   const { validateUrls } = require('./validate-urls.cjs');
 *   await validateUrls({ fix: true, limit: 100 });
 *
 * Performance:
 *   ~200ms rate limit = ~5 req/sec.
 *   For 6,838 programs ≈ 23 minutes. Fine for CI with 45-minute timeout.
 *   Use --limit=500 for daily pipeline checks on recently-refreshed programs.
 *
 * Exit codes:
 *   0 = no broken URLs found (or all fixed with --fix)
 *   1 = broken URLs remain
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');
const http  = require('http');
const { URL } = require('url');

// ── CLI args ──────────────────────────────────────────────────────────────────
const ARGS         = process.argv.slice(2);
const FIX          = ARGS.includes('--fix');
const VERBOSE      = ARGS.includes('--verbose');
const SKIP_CONTENT = ARGS.includes('--skip-content');
const LIMIT_ARG    = ARGS.find(a => a.startsWith('--limit='));
const LIMIT        = LIMIT_ARG ? parseInt(LIMIT_ARG.split('=')[1], 10) : null;

// ── Config ────────────────────────────────────────────────────────────────────
const RATE_MS        = 200;    // ms between requests (≈5 req/sec)
const TIMEOUT_MS     = 10000;  // per-request socket timeout
const HARD_TIMEOUT_MS = 10000; // hard wall-clock deadline per fetchUrl call
const MAX_HTML_BYTES = 80000;  // 80 KB is enough to check titles and pricing
const MAX_REDIRECTS  = 6;

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const TODAY         = new Date().toISOString().split('T')[0];

// ── Provider search page fallbacks ───────────────────────────────────────────
// When a specific program URL is broken, we fall back to the provider's
// registration search page so parents can still find the program manually.
function getProviderSearchPage(registrationUrl, provider) {
  try {
    const u    = new URL(registrationUrl);
    const host = u.hostname.toLowerCase();

    // ActiveNet municipalities (CoV, Burnaby, West Van, Port Coquitlam, City of Langley, etc.)
    if (host === 'anc.ca.apm.activecommunities.com') {
      const city = registrationUrl.split('activecommunities.com/')[1]?.split('/')[0];
      return city
        ? `https://anc.ca.apm.activecommunities.com/${city}/activity/search`
        : 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search';
    }

    // PerfectMind (Richmond, Coquitlam, Surrey, etc.)
    if (host === 'webreg.perfectmind.com' || host.endsWith('.perfectmind.com')) {
      return `${u.protocol}//${u.hostname}`;
    }

    // CampBrain registration portals (many private camps)
    if (host.endsWith('.campbrainregistration.com')) {
      return `${u.protocol}//${u.hostname}`;
    }

    // PowerUp Sports (VAFC, VMFL, New West SC, etc.)
    if (host.endsWith('.powerupsports.com')) {
      return `${u.protocol}//${u.hostname}`;
    }

    // Uplift (Kerrisdale Skating, Vancouver Skating, etc.)
    if (host.endsWith('.uplifterinc.com')) {
      return `${u.protocol}//${u.hostname}`;
    }

    // Corsizio event booking
    if (host.includes('corsizio.com')) {
      return `${u.protocol}//${u.hostname}`;
    }

    // Omnify booking
    if (host.endsWith('.getomnify.com')) {
      return `${u.protocol}//${u.hostname}`;
    }

    // as.me / Acuity scheduling
    if (host.endsWith('.as.me') || host.includes('acuityscheduling.com')) {
      return `${u.protocol}//${u.hostname}`;
    }

    // Eventbrite — use organizer page or Vancouver events search
    if (host === 'www.eventbrite.ca' || host === 'eventbrite.ca') {
      const parts = u.pathname.split('/').filter(Boolean);
      return parts[0] === 'o' ? registrationUrl : 'https://www.eventbrite.ca/d/canada--vancouver/events/';
    }

    // Generic fallback: provider's root domain
    return `${u.protocol}//${u.hostname}`;
  } catch (_) {
    return null;
  }
}

// ── HTTP fetch ────────────────────────────────────────────────────────────────

/**
 * Fetch a URL via GET, following redirects, capping body at MAX_HTML_BYTES.
 * Returns { status, finalUrl, html, redirectChain, error }
 *
 * @param {string}      startUrl
 * @param {AbortSignal} [abortSignal]  When fired, the active socket is destroyed immediately.
 */
function fetchUrl(startUrl, abortSignal) {
  return new Promise(resolve => {
    const redirectChain = [];
    let settled = false;

    // Guard: only resolve once (req.destroy() causes both 'timeout' and 'error' to fire)
    function safeResolve(val) {
      if (!settled) { settled = true; resolve(val); }
    }

    if (abortSignal && abortSignal.aborted) {
      return safeResolve({ status: null, finalUrl: startUrl, html: '', redirectChain, error: 'Hard deadline exceeded' });
    }

    function doRequest(currentUrl, depth) {
      if (depth > MAX_REDIRECTS) {
        return safeResolve({ status: null, finalUrl: currentUrl, html: '', redirectChain, error: 'Too many redirects' });
      }

      let parsed;
      try { parsed = new URL(currentUrl); } catch (e) {
        return safeResolve({ status: null, finalUrl: currentUrl, html: '', redirectChain, error: `Invalid URL: ${e.message}` });
      }

      const lib = parsed.protocol === 'https:' ? https : http;
      const options = {
        hostname: parsed.hostname,
        port:     parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path:     parsed.pathname + parsed.search,
        method:   'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Skeddo-Verifier/1.0; +https://skeddo.ca)',
          'Accept':     'text/html,application/xhtml+xml,*/*;q=0.9',
          'Accept-Language': 'en-CA,en;q=0.9',
        },
        timeout: TIMEOUT_MS,
        rejectUnauthorized: false, // handle self-signed or expired TLS certs gracefully
      };

      const req = lib.request(options, res => {
        const status = res.statusCode;

        // Follow redirects
        if ([301, 302, 303, 307, 308].includes(status) && res.headers.location) {
          let next;
          try { next = new URL(res.headers.location, currentUrl).href; } catch (e) {
            res.resume();
            return safeResolve({ status, finalUrl: currentUrl, html: '', redirectChain, error: `Malformed redirect: ${res.headers.location}` });
          }
          redirectChain.push({ from: currentUrl, to: next, status });
          res.resume();
          return doRequest(next, depth + 1);
        }

        // Read body (capped)
        let html  = '';
        let bytes = 0;
        res.setEncoding('utf8');
        res.on('data',  chunk => { if (bytes < MAX_HTML_BYTES) { html += chunk; bytes += chunk.length; } });
        res.on('end',   ()    => safeResolve({ status, finalUrl: currentUrl, html, redirectChain, error: null }));
        res.on('error', err   => safeResolve({ status, finalUrl: currentUrl, html, redirectChain, error: err.message }));
      });

      // Socket-level inactivity timeout (fires once connected but idle) — destroy triggers 'error'
      req.on('timeout', () => { req.destroy(); });
      // All errors (including from req.destroy()) land here
      req.on('error', err => {
        safeResolve({ status: null, finalUrl: currentUrl, html: '', redirectChain,
          error: (abortSignal && abortSignal.aborted) ? 'Hard deadline exceeded' : err.message });
      });

      // Wire up the external abort signal so the hard deadline actually kills this socket
      if (abortSignal) {
        abortSignal.addEventListener('abort', () => {
          req.destroy();
          safeResolve({ status: null, finalUrl: currentUrl, html: '', redirectChain, error: 'Hard deadline exceeded' });
        }, { once: true });
      }

      req.end();
    }

    doRequest(startUrl, 0);
  });
}

/**
 * Wraps fetchUrl with a hard wall-clock deadline via AbortController.
 * When the deadline fires, controller.abort() destroys the active socket
 * immediately — no background requests accumulate across thousands of URLs.
 */
function fetchUrlWithDeadline(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HARD_TIMEOUT_MS);
  return fetchUrl(url, controller.signal).finally(() => clearTimeout(timer));
}

// ── URL analysis helpers ──────────────────────────────────────────────────────

/**
 * Returns true if the final URL after redirects is a homepage or generic page
 * (i.e., a specific program URL redirected to the site root).
 */
function isHomepageRedirect(originalUrl, finalUrl) {
  try {
    const orig  = new URL(originalUrl);
    const final = new URL(finalUrl);

    if (orig.hostname !== final.hostname) return true;

    const origPath  = orig.pathname.replace(/\/+$/, '');
    const finalPath = final.pathname.replace(/\/+$/, '');

    if (
      (finalPath === '' || finalPath === '/home' || finalPath === '/index.html' || finalPath === '/index.htm') &&
      origPath.length > 5
    ) return true;

    if (origPath.length > 20 && finalPath.length < origPath.length * 0.3) return true;

    return false;
  } catch (_) {
    return false;
  }
}

/**
 * Returns true if the HTML suggests a JavaScript SPA with little static text.
 * These pages can't be content-checked without running the JS (e.g., ActiveNet).
 */
function isJsRendered(html) {
  if (!html || html.length < 300) return true;
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length < 300) return true;
  if ((/<div[^>]+id=["']root["']/i.test(html) || /<div[^>]+id=["']app["']/i.test(html)) && text.length < 800) return true;
  return false;
}

/**
 * Fuzzy match: fraction of significant words from programName found in page text.
 * Returns 0.0–1.0. Threshold: ≥0.5 = match, 0.25–0.5 = weak, <0.25 = not found.
 */
function fuzzyNameScore(html, programName) {
  if (!html || !programName) return 0;
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').toLowerCase();
  const STOP = new Set([
    'the','and','for','with','your','our','this','that','are','was','have',
    'been','will','from','they','their','what','when','where','how','can','not',
  ]);
  const words = programName.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/)
    .filter(w => w.length > 3 && !STOP.has(w));
  if (words.length === 0) return 1;
  return words.filter(w => text.includes(w)).length / words.length;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Core validation logic ────────────────────────────────────────────────────

/**
 * Validate all URLs in programs.json.
 * Can be called programmatically with options, or driven by CLI args.
 *
 * @param {Object} opts
 * @param {boolean} opts.fix           - Apply resolutions to programs.json
 * @param {number}  opts.limit         - Process at most N programs
 * @param {boolean} opts.verbose       - Print every result
 * @param {boolean} opts.skipContent   - Skip program-name-on-page check
 * @returns {Object} results summary
 */
async function validateUrls(opts = {}) {
  const fix         = opts.fix         ?? FIX;
  const limit       = opts.limit        ?? LIMIT;
  const verbose     = opts.verbose      ?? VERBOSE;
  const skipContent = opts.skipContent  ?? SKIP_CONTENT;

  const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

  // Only check programs that have a registrationUrl
  const withUrl     = programs.filter(p => p.registrationUrl);
  const withoutUrl  = programs.length - withUrl.length;
  const toCheck     = (limit !== null && limit > 0) ? withUrl.slice(0, limit) : withUrl;

  console.log('\n=== SKEDDO URL VALIDATOR ===');
  console.log(`Programs: ${programs.length} total | ${withUrl.length} with URLs | ${withoutUrl} without`);
  console.log(`Checking: ${toCheck.length}${limit ? ` (--limit=${limit})` : ''} | Fix: ${fix} | Skip content: ${skipContent}`);
  console.log(`Date: ${TODAY}\n`);

  const summary = {
    checked:       toCheck.length,
    ok:            0,
    jsRendered:    0,
    broken:        0,
    homeRedirect:  0,
    nameMismatch:  0,
    serverError:   0,
    networkError:  0,
    fixed:         0,
  };

  const issues = [];
  let programsModified = false;

  for (let i = 0; i < toCheck.length; i++) {
    const program = toCheck[i];
    const id      = String(program.id);

    if (i > 0) await sleep(RATE_MS);

    if (verbose || i % 500 === 0) {
      process.stdout.write(`[${i + 1}/${toCheck.length}] ${program.name}\n`);
    }

    const { status, finalUrl, html, redirectChain, error } = await fetchUrlWithDeadline(program.registrationUrl);

    // ── Network / connection error ──
    if (error && !status) {
      summary.networkError++;
      const issue = {
        id, name: program.name, url: program.registrationUrl,
        type: 'network-error', detail: error,
        resolution: null,
      };
      issues.push(issue);
      if (verbose) console.log(`  [NETWORK-ERROR] ${error}`);
      continue;
    }

    // ── 5xx server error (temporary — no auto-fix) ──
    if (status >= 500) {
      summary.serverError++;
      issues.push({ id, name: program.name, url: program.registrationUrl, type: 'server-error', status, resolution: 'recheck-later' });
      if (verbose) console.log(`  [${status}] Server error — temporary, not auto-fixed`);
      continue;
    }

    // ── 404 / 410 gone ──
    if (status === 404 || status === 410) {
      summary.broken++;
      const fallback = getProviderSearchPage(program.registrationUrl, program.provider);
      const issue = {
        id, name: program.name, url: program.registrationUrl,
        type: 'not-found', status,
        fallback,
        resolution: fallback ? (fix ? 'applied' : 'available') : 'manual-required',
      };
      issues.push(issue);

      if (fix && fallback) {
        const prog = programs.find(p => String(p.id) === id);
        if (prog) {
          prog.registrationUrl = fallback;
          prog.urlNote         = 'Search provider site for this program';
          programsModified     = true;
          summary.fixed++;
        }
      }

      if (verbose) console.log(`  [${status}] → fallback: ${fallback || 'none'}`);
      continue;
    }

    // ── Other 4xx client errors ──
    if (status >= 400) {
      summary.broken++;
      const fallback = getProviderSearchPage(program.registrationUrl, program.provider);
      issues.push({
        id, name: program.name, url: program.registrationUrl,
        type: 'client-error', status, fallback,
        resolution: fallback ? (fix ? 'applied' : 'available') : 'manual-required',
      });

      if (fix && fallback) {
        const prog = programs.find(p => String(p.id) === id);
        if (prog) {
          prog.registrationUrl = fallback;
          prog.urlNote         = `HTTP ${status} — search provider site for this program`;
          programsModified     = true;
          summary.fixed++;
        }
      }

      if (verbose) console.log(`  [${status}] Client error`);
      continue;
    }

    // ── Homepage redirect ──
    if (redirectChain.length > 0 && isHomepageRedirect(program.registrationUrl, finalUrl)) {
      summary.homeRedirect++;
      const fallback = getProviderSearchPage(program.registrationUrl, program.provider);
      issues.push({
        id, name: program.name, url: program.registrationUrl,
        type: 'homepage-redirect', finalUrl, fallback,
        resolution: fallback ? (fix ? 'applied' : 'available') : 'manual-required',
      });

      if (fix && fallback) {
        const prog = programs.find(p => String(p.id) === id);
        if (prog) {
          prog.registrationUrl = fallback;
          prog.urlNote         = 'Original link redirects to homepage — search provider site for this program';
          programsModified     = true;
          summary.fixed++;
        }
      }

      if (verbose) console.log(`  [HOMEPAGE-REDIRECT] → ${finalUrl}`);
      continue;
    }

    // ── URL resolved (status 200-399, not a homepage redirect) ──

    // JS-rendered pages: content cannot be verified with plain HTTP
    if (isJsRendered(html)) {
      summary.jsRendered++;
      summary.ok++;
      if (verbose) console.log(`  [OK-JS-RENDERED] URL resolves, content check skipped`);
      continue;
    }

    // Content check: does program name appear on page?
    if (!skipContent && html && html.length > 500) {
      const score = fuzzyNameScore(html, program.name);

      if (score < 0.25) {
        summary.nameMismatch++;
        issues.push({
          id, name: program.name, url: program.registrationUrl,
          type: 'name-not-found',
          nameScore: parseFloat(score.toFixed(2)),
          detail: 'Program name not found on page — URL may point to wrong program (manual review needed)',
          resolution: 'manual-review',
        });
        if (verbose) console.log(`  [NAME-MISMATCH] score=${score.toFixed(2)}`);
      } else {
        summary.ok++;
        // Mark as urlVerified if requested via --fix
        if (fix) {
          const prog = programs.find(p => String(p.id) === id);
          if (prog && !prog.urlVerified) {
            prog.urlVerified = true;
            programsModified = true;
          }
        }
        if (verbose) console.log(`  [OK] name score=${score.toFixed(2)}`);
      }
    } else {
      summary.ok++;
      if (verbose) console.log(`  [OK] status ${status}`);
    }
  }

  // ── Save programs.json if modified ──
  if (fix && programsModified) {
    fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2));
    console.log(`\n✓ programs.json updated: ${summary.fixed} URLs fixed.`);
  }

  // ── Print summary ──
  console.log('\n=== URL VALIDATION SUMMARY ===');
  console.log(`Checked:          ${summary.checked}`);
  console.log(`OK:               ${summary.ok}`);
  console.log(`JS-rendered:      ${summary.jsRendered} (URL resolves, content not checkable)`);
  console.log(`Broken (404/4xx): ${summary.broken}`);
  console.log(`Home redirects:   ${summary.homeRedirect}`);
  console.log(`Name mismatch:    ${summary.nameMismatch}`);
  console.log(`Server errors:    ${summary.serverError} (temporary, not auto-fixed)`);
  console.log(`Network errors:   ${summary.networkError}`);
  if (fix) console.log(`Auto-fixed:       ${summary.fixed}`);

  // Print first 30 issues (grouped by type)
  const actionable = issues.filter(i => i.type !== 'server-error' && i.type !== 'network-error');
  if (actionable.length > 0) {
    console.log(`\nActionable issues (${actionable.length}):`);
    actionable.slice(0, 30).forEach(issue => {
      const tag = fix && issue.resolution === 'applied' ? '✓ FIXED' : issue.resolution === 'manual-required' ? '⚠ MANUAL' : '→';
      console.log(`  [${issue.type}] ${tag} id=${issue.id}: ${issue.name}`);
      if (issue.fallback && issue.resolution !== 'applied') console.log(`    Fallback: ${issue.fallback}`);
    });
    if (actionable.length > 30) console.log(`  ... and ${actionable.length - 30} more issues`);
  }

  const unresolved = actionable.filter(i => !['applied', 'manual-review'].includes(i.resolution));
  console.log('');

  return { summary, issues, unresolved };
}

// ── Run standalone ────────────────────────────────────────────────────────────
if (require.main === module) {
  validateUrls()
    .then(({ unresolved }) => {
      const hardFailures = unresolved.filter(i => i.type !== 'name-not-found').length;
      process.exit(hardFailures > 0 ? 1 : 0);
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { validateUrls };
