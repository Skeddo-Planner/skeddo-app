# Verification Log — City of Vancouver - West End Cmty Centre

**Date audited:** 2026-04-05
**Auditor:** Claude (automated)
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?facility_id=165
**Status: BLOCKED — Playwright browser spawn UNKNOWN**

---

## What Was Attempted

1. Attempted `mcp__playwright__browser_navigate` to the Vancouver ActiveNet registration page — failed with `spawn UNKNOWN` (Firefox cannot launch in this environment).
2. Attempted WebFetch on the ActiveNet activity search and detail pages — pages require JavaScript rendering; WebFetch returns only configuration/navigation data, not program listings.
3. Attempted WebFetch on the ActiveNet REST API endpoints (`/rest/activity/search`, `/rest/activities/list`) — returned 405 or configuration-only JSON.

This is the same Playwright spawn UNKNOWN error that has blocked 5 consecutive prior audits (see recent git log).

---

## Registration Timeline

- Registration for all West End summer camps opens **April 8, 2026 at 7:00 PM**
- Today is April 5, 2026 — registration has not yet opened
- Even if Playwright were functional, many programs would not be fully visible yet

---

## Current Database State

Provider name in DB: **"City of Vancouver - West End Community Centre"**
Total programs in DB: **50**

### Programs by Enrollment Status

| Status | Count |
|--------|-------|
| Coming Soon | 44 |
| Full/Waitlist | 2 |
| Completed | 4 |

### Full Program List (as stored in DB)

| ID | Name | Cost | Dates | Status |
|----|------|------|-------|--------|
| 1918 | Day Camp Adventures (6-7yrs) - Week 1 at West End | $144 | 2026-06-29 – 2026-07-03 | Coming Soon |
| 1919 | Day Camp Adventures (6-7yrs) - Week 2 at West End | $180 | 2026-07-06 – 2026-07-10 | Coming Soon |
| 1920 | Escape Artist Summer Camp (11-15yrs) at West End | $130 | 2026-07-13 – 2026-07-17 | Full/Waitlist |
| 1921 | Escape Artist Summer Camp (11-15yrs) at West End | $130 | 2026-08-10 – 2026-08-14 | Full/Waitlist |
| 1922 | West End Youth Council | $0 | 2025-09-18 – 2026-06-11 | Completed |
| 1923 | Pop Star Playground Dance Camp (6-10yrs) at West End | $219 | 2026-07-20 – 2026-07-24 | Coming Soon |
| 2053 | Day Camp - Before Care (6-12 yrs) - Week 8 | $0 | 2026-08-17 – 2026-08-21 | Completed |
| 2054 | Day Camp - Before Care (6-12 yrs) - Week 9 | $0 | 2026-08-24 – 2026-08-28 | Completed |
| ACT-585353 | Spring Break Day Camp - Week 2 (5-12yrs) | null | 2026-03-23 – 2026-03-27 | Completed |
| ACT-599622 | Day Camp - After Care (6-12 yrs) - Week 1 | $40 | 2026-06-29 – 2026-07-03 | Coming Soon |
| ACT-599623 | Day Camp - After Care (6-12 yrs) - Week 2 | $50 | 2026-07-06 – 2026-07-10 | Coming Soon |
| ACT-599624 | Day Camp - After Care (6-12 yrs) - Week 3 | $50 | 2026-07-13 – 2026-07-17 | Coming Soon |
| ACT-599625 | Day Camp - After Care (6-12 yrs) - Week 4 | $50 | 2026-07-20 – 2026-07-24 | Coming Soon |
| ACT-599642 | Day Camp Adventures (6-7yrs) - Week 3 | $180 | 2026-07-13 – 2026-07-17 | Coming Soon |
| ACT-599647 | Day Camp Adventures (6-7yrs) - Week 8 | $180 | 2026-08-17 – 2026-08-21 | Coming Soon |
| ACT-599649 | Day Camp Discoveries (8-9yrs) - Week 1 | $144 | 2026-06-29 – 2026-07-03 | Coming Soon |
| ACT-599650 | Day Camp Discoveries (8-9yrs) - Week 2 | $180 | 2026-07-06 – 2026-07-10 | Coming Soon |
| wecca-adv-w4 | Day Camp Adventures (6-7yrs) - Week 4 at West End | $180 | 2026-07-20 – 2026-07-24 | Coming Soon |
| wecca-adv-w5 | Day Camp Adventures (6-7yrs) - Week 5 at West End | $180 | 2026-07-27 – 2026-07-31 | Coming Soon |
| wecca-adv-w6 | Day Camp Adventures (6-7yrs) - Week 6 at West End | $144 | 2026-08-04 – 2026-08-07 | Coming Soon |
| wecca-adv-w7 | Day Camp Adventures (6-7yrs) - Week 7 at West End | $180 | 2026-08-10 – 2026-08-14 | Coming Soon |
| wecca-adv-w9 | Day Camp Adventures (6-7yrs) - Week 9 at West End | $180 | 2026-08-24 – 2026-08-28 | Coming Soon |
| wecca-disc-w3 | Day Camp Discoveries (7-8yrs) - Week 3 at West End | $180 | 2026-07-13 – 2026-07-17 | Coming Soon |
| wecca-disc-w4 | Day Camp Discoveries (7-8yrs) - Week 4 at West End | $180 | 2026-07-20 – 2026-07-24 | Coming Soon |
| wecca-disc-w5 | Day Camp Discoveries (7-8yrs) - Week 5 at West End | $180 | 2026-07-27 – 2026-07-31 | Coming Soon |
| wecca-disc-w6 | Day Camp Discoveries (7-8yrs) - Week 6 at West End | $144 | 2026-08-04 – 2026-08-07 | Coming Soon |
| wecca-disc-w7 | Day Camp Discoveries (7-8yrs) - Week 7 at West End | $180 | 2026-08-10 – 2026-08-14 | Coming Soon |
| wecca-disc-w8 | Day Camp Discoveries (7-8yrs) - Week 8 at West End | $180 | 2026-08-17 – 2026-08-21 | Coming Soon |
| wecca-disc-w9 | Day Camp Discoveries (7-8yrs) - Week 9 at West End | $180 | 2026-08-24 – 2026-08-28 | Coming Soon |
| wecca-voy-w1 | Day Camp Voyages (9-12yrs) - Week 1 at West End | $144 | 2026-06-29 – 2026-07-03 | Coming Soon |
| wecca-voy-w2 | Day Camp Voyages (9-12yrs) - Week 2 at West End | $180 | 2026-07-06 – 2026-07-10 | Coming Soon |
| wecca-voy-w3 | Day Camp Voyages (9-12yrs) - Week 3 at West End | $180 | 2026-07-13 – 2026-07-17 | Coming Soon |
| wecca-voy-w4 | Day Camp Voyages (9-12yrs) - Week 4 at West End | $180 | 2026-07-20 – 2026-07-24 | Coming Soon |
| wecca-voy-w5 | Day Camp Voyages (9-12yrs) - Week 5 at West End | $180 | 2026-07-27 – 2026-07-31 | Coming Soon |
| wecca-voy-w6 | Day Camp Voyages (9-12yrs) - Week 6 at West End | $144 | 2026-08-04 – 2026-08-07 | Coming Soon |
| wecca-voy-w7 | Day Camp Voyages (9-12yrs) - Week 7 at West End | $180 | 2026-08-10 – 2026-08-14 | Coming Soon |
| wecca-voy-w8 | Day Camp Voyages (9-12yrs) - Week 8 at West End | $180 | 2026-08-17 – 2026-08-21 | Coming Soon |
| wecca-voy-w9 | Day Camp Voyages (9-12yrs) - Week 9 at West End | $180 | 2026-08-24 – 2026-08-28 | Coming Soon |
| wecca-aftercare-w5 | Day Camp After Care (6-12yrs) - Week 5 at West End | $50 | 2026-07-27 – 2026-07-31 | Coming Soon |
| wecca-aftercare-w6 | Day Camp After Care (6-12yrs) - Week 6 at West End | $40 | 2026-08-04 – 2026-08-07 | Coming Soon |
| wecca-aftercare-w7 | Day Camp After Care (6-12yrs) - Week 7 at West End | $50 | 2026-08-10 – 2026-08-14 | Coming Soon |
| wecca-aftercare-w8 | Day Camp After Care (6-12yrs) - Week 8 at West End | $50 | 2026-08-17 – 2026-08-21 | Coming Soon |
| wecca-aftercare-w9 | Day Camp After Care (6-12yrs) - Week 9 at West End | $50 | 2026-08-24 – 2026-08-28 | Coming Soon |
| wecca-frozen-ballet | Frozen Ballet Dance Camp (3.5-5yrs) at West End | $109 | 2026-08-10 – 2026-08-14 | Coming Soon |
| wecca-fairytale-remix-we | Fairytale Remix Dance Camp (4-6yrs) at West End | $109 | 2026-08-10 – 2026-08-14 | Coming Soon |
| wecca-mini-hiphop-we | Mini Hip Hop Playground Dance Camp (4-6yrs) at West End | $109 | 2026-08-10 – 2026-08-14 | Coming Soon |
| wecca-hiphop-we | Hip Hop Playground Dance Camp (6-9yrs) at West End | $109 | 2026-08-10 – 2026-08-14 | Coming Soon |
| wecca-superhero-we | Superhero Training Academy Dance Camp (6-9yrs) at West End | $219 | 2026-07-20 – 2026-07-24 | Coming Soon |
| wecca-filmmaking-w1 | Feature Film Making Camp (9-14yrs) - Week 1 at West End | $365 | 2026-07-06 – 2026-07-10 | Coming Soon |
| wecca-filmmaking-w2 | Feature Film Making Camp (9-14yrs) - Week 2 at West End | $365 | 2026-08-24 – 2026-08-28 | Coming Soon |

---

## Data Changes Made

**None.** No data changes were made because live-page verification was impossible (Playwright blocked).

48 of 50 programs already have `confirmed2026: true`. Programs 2053 and 2054 are correctly marked Completed (Before Care discontinued per Spring 2026 Recreation Guide).

---

## Count

- Provider shows: **Unknown** (could not access registration page)
- Database has: **50**
- Added: 0 | Fixed: 0 | Blocked: All

---

## Resolution Required

Re-audit after April 8, 2026 (registration open date) once Playwright browser is functional. The Firefox MCP browser fails with `spawn UNKNOWN` on this Windows 10 machine — a system-level issue unrelated to this provider.
