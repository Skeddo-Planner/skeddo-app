# Verification Log: City of Vancouver - Mount Pleasant Community Centre

**Date Audited:** 2026-04-05
**Auditor:** Claude (automated)
**Registration Page URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search
**Status:** BLOCKED — Playwright browser unavailable

---

## Audit Status

**Blocked:** The Playwright browser tool (`mcp__playwright__browser_navigate`) failed with `spawn UNKNOWN` — Firefox cannot be launched in this environment. This is the same issue affecting other recent CoV audits (Creekside, Templeton, West End).

Per CLAUDE.md: "Always use Playwright browser — never WebFetch — to read registration pages." The audit cannot proceed without a working browser.

---

## Existing Database Summary

At time of audit attempt, the database contains **134 listings** across 4 provider name variants:

| Provider Name | Count |
|---|---|
| City of Vancouver - Mount Pleasant Community Centre | ~28 (CoV ActiveNet IDs) |
| City of Vancouver — Mount Pleasant Community Centre | ~2 (em-dash variant) |
| City of Vancouver - Mount Pleasant Cmty Centre | ~1 |
| Mount Pleasant Community Centre Association | ~9 (MPCCA Our House camp) |
| Legacy IDs (1712–1741) | ~30 (old numbering) |

**Known IDs on file (sample):**
- COV-584948 through COV-610384 — birthday parties, piano, dance, sports, arts programs
- mpcca-ourhouse-w1 through w9 — Our House Summer Daycamp weeks
- 1712–1741 — older camp listings (K-Pop, Dance, Music camps)
- ACT-604678, ACT-604695 — K-Pop Demon Hunters

**All statuses as of last update:**
- Many legacy IDs (1712–1741): Full/Waitlist
- CoV ActiveNet IDs: Mix of Open, Full/Waitlist, Completed, Open

---

## What Was Attempted

1. Attempted to navigate to `https://ca.apm.activecommunities.com/vancouver/Activity_Search?facility=Mount+Pleasant+Community+Centre` via Playwright — **FAILED: spawn UNKNOWN**
2. Cannot use WebFetch as a substitute (CLAUDE.md prohibits this for registration page content)

---

## Recommended Next Steps

When Playwright browser becomes available:
1. Navigate to https://anc.ca.apm.activecommunities.com/vancouver/activity/search
2. Search/filter by facility: "Mount Pleasant Community Centre"
3. Verify all existing COV-* IDs against live data
4. Check for new programs added since last audit
5. Verify enrollment status for all Open/Full/Waitlist listings
6. Check MPCCA (Mount Pleasant Community Centre Association) separately at their own site

---

## Programs NOT Verified (all existing listings pending browser audit)

All 134 existing listings remain unverified pending a working Playwright session.
