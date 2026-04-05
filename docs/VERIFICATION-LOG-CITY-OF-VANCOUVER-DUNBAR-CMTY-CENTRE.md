# Verification Log — City of Vancouver - Dunbar Cmty Centre

**Audit date:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=50
**Status:** COMPLETE

---

## Summary

| Metric | Value |
|--------|-------|
| Programs in DB before audit | 151 |
| New programs added | 44 |
| Status fixes (→ Completed) | 5 |
| Programs in DB after audit | 195 |
| Violations on new/changed programs | 0 hard (2 soft R43/R46 — intentional combo camp age range) |

---

## Method

- Navigated to `https://anc.ca.apm.activecommunities.com/vancouver/activity/search`
- Applied "Where" filter → Dunbar Community Centre (`center_ids=50`)
- Used JavaScript virtual-scroll loading to enumerate all 190 programs at this location
- Navigated to individual detail pages for each new/unverified program to confirm:
  - Program name, age range, cost, dates, times, days, enrollment status
  - Registration open date (April 8, 2026 for summer programs)
  - Fee details via "View fee details" modal

---

## New Programs Added (44)

### Dunbar Day Camps (8 programs)

| ID | Dates | Ages | Cost | Status |
|----|-------|------|------|--------|
| COV-608317 | Jul 2-3 (2-day) | 6-12 | $76 | Coming Soon (Apr 8) |
| COV-608330 | Jul 6-10 | 6-12 | $190 | Coming Soon (Apr 8) |
| COV-608332 | Jul 13-17 | 6-12 | $190 | Coming Soon (Apr 8) |
| COV-609243 | Jul 20-24 | 6-12 | $190 | Coming Soon (Apr 8) |
| COV-609244 | Jul 27-31 | 6-12 | $190 | Coming Soon (Apr 8) |
| COV-609245 | Aug 4-8 (4-day, BC Day) | 6-12 | $190 | Coming Soon (Apr 8) |
| COV-609246 | Aug 11-15 | 6-12 | $190 | Coming Soon (Apr 8) |
| COV-609247 | Aug 17-21 | 6-12 | $190 | Coming Soon (Apr 8) |

All camps: Mon-Fri 9:00 AM - 3:30 PM. Week 1 shortened due to Canada Day (Jul 1). Week 6 shortened due to BC Day (Aug 3).

### Active Kids UBC Kinesiology (8 programs)

Movement classes led by UBC Kinesiology students for children ages 1-5.

| ID | Days | Dates | Time | Cost | Status |
|----|------|-------|------|------|--------|
| COV-608146 | Fri | Apr 17 - May 29 (7 classes) | 9:30-10:15 AM | $132 | Open |
| COV-608149 | Sun | Apr 19 - Jun 7 (8 classes) | 9:30-10:15 AM | $154 | Open |
| COV-608151 | Fri | Apr 17 - Jun 5 (8 classes) | 10:30-11:15 AM | $154 | Open |
| COV-608153 | Sun | Apr 19 - Jun 7 (8 classes) | 10:30-11:15 AM | $154 | Open |
| COV-608148 | Fri | Jul 3 - Aug 7 (5 classes) | 9:30-10:15 AM | $132 | Coming Soon (Apr 8) |
| COV-608150 | Sun | Jul 5 - Aug 9 (6 classes) | 9:30-10:15 AM | $154 | Coming Soon (Apr 8) |
| COV-608152 | Fri | Jul 3 - Aug 7 (5 classes) | 10:30-11:15 AM | $132 | Coming Soon (Apr 8) |
| COV-608155 | Sun | Jul 5 - Aug 9 (6 classes) | 10:30-11:15 AM | $154 | Coming Soon (Apr 8) |

### Endorphin Rush Dance (14 programs)

Saturday dance classes. Spring: 8 classes, $154. Summer: 5 classes, $112.

| ID | Program | Ages | Time |
|----|---------|------|------|
| COV-607751 | My First Dance (Spring) | 1-3 | 9:00-9:30 AM |
| COV-607741 | Little Ballerinas A (Spring) | 2-4 | 9:30-10:00 AM |
| COV-607745 | Little Ballerinas B (Spring) | 2-4 | 10:00-10:30 AM |
| COV-607742 | Ballet/Jazz Fusion A (Spring) | 4-6 | 10:30-11:15 AM |
| COV-607748 | Ballet/Jazz Fusion B (Spring) | 4-6 | 11:15 AM-12:00 PM |
| COV-607749 | Hip Hop A (Spring) | 6-10 | 12:00-12:45 PM |
| COV-607754 | Hip Hop B (Spring) | 6-10 | 12:45-1:30 PM |
| COV-607768 | My First Dance (Summer) | 1-3 | 9:00-9:30 AM |
| COV-607758 | Little Ballerinas A (Summer) | 2-4 | 9:30-10:00 AM |
| COV-607759 | Little Ballerinas B (Summer) | 2-4 | 10:00-10:30 AM |
| COV-607761 | Ballet/Jazz Fusion A (Summer) | 4-6 | 10:30-11:15 AM |
| COV-607763 | Ballet/Jazz Fusion B (Summer) | 4-6 | 11:15 AM-12:00 PM |
| COV-607764 | Hip Hop A (Summer) | 6-10 | 12:00-12:45 PM |
| COV-607767 | Hip Hop B (Summer) | 6-10 | 12:45-1:30 PM |

Spring dates: Apr 18 - Jun 13. Summer dates: Jul 11 - Aug 15.

### Summer Dance Camps (6 programs)

| ID | Program | Ages | Week | Times | Cost |
|----|---------|------|------|-------|------|
| COV-608127 | Ballet/Jazz Half-Day | 5-7 | Jul 20-24 | 9 AM-12 PM | $109 |
| COV-608131 | Hip Hop Half-Day | 8-12 | Jul 20-24 | 9 AM-12 PM | $109 |
| COV-608129 | Ballet/Jazz + Hip Hop Combo | 5-12* | Jul 20-24 | 9 AM-3 PM | $220 |
| COV-608139 | Ballet/Jazz Half-Day | 5-7 | Aug 24-28 | 9 AM-12 PM | $109 |
| COV-608126 | Hip Hop Half-Day | 8-12 | Aug 24-28 | 9 AM-12 PM | $109 |
| COV-608145 | Ballet/Jazz + Hip Hop Combo | 5-12* | Aug 24-28 | 9 AM-3 PM | $220 |

All Coming Soon, registration opens Apr 8. *Combo is sold as a single full-day bundle — wide age range is intentional (R43/R46 soft warnings acknowledged).

### Sportball (5 programs)

All Spring, Sat Apr 18 - Jun 6 (8 classes), $120.

| ID | Program | Ages | Time |
|----|---------|------|------|
| COV-603636 | Multi-Sport | 2-3 | 9:30-10:00 AM |
| COV-603638 | Multi-Sport | 3-5 | 10:00-10:45 AM |
| COV-603640 | Multi-Sport | 5-8 | 10:45-11:45 AM |
| COV-603645 | Soccer | 2-3 | 11:45 AM-12:15 PM |
| COV-603646 | Soccer | 3-5 | 12:15-1:00 PM |

### Kids Indoor Tennis (2 programs)

Both Spring, Sat Apr 18 - Jun 6 (8 classes).

| ID | Ages | Time | Cost |
|----|------|------|------|
| COV-602544 | 5-7 | 1:00-1:45 PM | $180 |
| COV-602545 | 8-10 | 1:45-2:30 PM | $180 |

### Dunbar Soccer Academy (1 program)

| ID | Ages | Dates | Times | Cost |
|----|------|-------|-------|------|
| COV-600808 | 9-12 | Apr 18 - Jun 7 (Sat+Sun) | 10:00-11:30 AM | $203.50 |

---

## Status Fixes (5 programs → Completed)

These programs no longer appear on the live registration page. Marked Completed per Rule 6.

| ID | Name |
|----|------|
| COV-585109 | Birthday Party (2hr rental) |
| COV-585124 | Dunbar Soccer Academy (3-5 yrs) |
| COV-585803 | Martial Arts Birthday Party |
| COV-588376 | LEGO Cinematic Crossovers |
| COV-591398 | A Ballet Time with Strength and Stretch (7-10 yrs) |

---

## Completeness Check

- Live page showed ~190 programs at Dunbar Community Centre
- DB before: 151 programs. After: 195 programs (44 added + 5 status fixes)
- All major program categories confirmed covered: day camps, dance, kinesiology, soccer, tennis, Sportball, piano, karate, art, coding, community programs

---

## Previous Blocked Sessions (1-4 — 2026-04-05)

Sessions 1-4 were blocked by Playwright browser failures (spawn UNKNOWN errors, Firefox executable issues). This session (5) successfully used Playwright to complete the audit.

---

## Audit Outcome: Blocked (Session 4 — 2026-04-05)

### Reason

Same `Error: server: spawn UNKNOWN` as Sessions 1–3. Firefox executable cannot be spawned by the Playwright MCP. Four consecutive sessions have now failed with this exact error. No data changes made.

### What Was Attempted (Session 4)

1. `mcp__playwright__browser_navigate` — failed immediately with spawn UNKNOWN (3 attempts with delays)
2. No data changes made — marking provider as `failed` in queue
3. Requires Playwright MCP fix (Firefox executable path issue) or Claude Code restart before this audit can proceed

---

## Audit Outcome: Blocked (Session 3 — 2026-04-05)

### Reason

Same `Error: server: spawn UNKNOWN` as Session 2. Firefox executable at `C:\Users\thoma\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe` cannot be spawned. Every `mcp__playwright__browser_navigate` and `mcp__playwright__browser_snapshot` call fails immediately. No browser data can be gathered.

### What Was Attempted (Session 3)

1. `mcp__playwright__browser_navigate` — failed with spawn UNKNOWN
2. `mcp__playwright__browser_snapshot` — failed with spawn UNKNOWN
3. No data changes made — existing database has 229 Dunbar listings (Open: 132, Coming Soon: 6, Full/Waitlist: 41, Completed: 49, Likely Coming Soon: 1)

---

## Audit Outcome: Blocked (Session 2 — 2026-04-05)

### Reason

The Playwright MCP browser (`mcp__playwright__browser_navigate`) failed to launch on every attempt with `Error: server: spawn UNKNOWN`. Chromium at `C:\Users\thoma\AppData\Local\ms-playwright\chromium-1217\chrome-win64\chrome.exe` could not be spawned by Node.js. 10+ attempts over ~30 minutes all failed. This is distinct from Session 1's failure (which was missing `mcp__Claude_in_Chrome__navigate`).

Per mandatory audit rules, `WebFetch` and `WebSearch` must not be used to read registration page content — the ActiveNet platform requires JavaScript rendering.

### Data Fixes Applied (Session 2)

Two fixes were made to existing data without requiring browser verification (correcting clear data entry errors):

1. **COV-610467** (A Ballet Time with Strength and Stretch 7-10yrs) — Added `repeating: true`
   - Weekly Saturday class (2026-07-04 to 2026-08-29). Missing flag caused R2 violation.

2. **COV-610477** (1-Active Tumble, Flex and Dance AM Half Camp 5-7 yrs) — Fixed `ageMax` from 12 to 7
   - Program name explicitly says "5-7 yrs". ageMax=12 was a data entry error.

### What Was Attempted (Session 2)

1. 10+ attempts to launch Playwright MCP browser — all failed with `spawn UNKNOWN`.
2. Checked Chrome executable exists (confirmed at correct path).
3. Waiting between attempts — still failed.
4. Confirmed this is a system-level issue requiring restart of Claude Code / Playwright MCP.

---

## Audit Outcome: Blocked (Session 1 — 2026-04-05)

### Reason

The `mcp__Claude_in_Chrome__navigate` tool (Claude in Chrome) was not available in this session. Per mandatory audit rules, `WebFetch` and `WebSearch` must not be used to read registration page content — the ActiveNet platform requires JavaScript rendering and WebFetch will silently miss most program data.

Without Chrome, field-by-field verification of live registration data cannot be performed.

### What Was Attempted (Session 1)

1. Confirmed Chrome MCP tool unavailable — `mcp__Claude_in_Chrome__navigate` returned `No such tool available`.
2. Checked MCP server configuration — no Chrome MCP server registered in `claude_desktop_config.json`.
3. Reviewed existing database state (documented below).

---

## Existing Database State (as of 2026-04-05)

**Provider names in database:**
- `City of Vancouver - Dunbar Community Centre` (numeric IDs 1451–1486)
- `City of Vancouver - Dunbar Cmty Centre` (COV-* IDs)
- `City of Vancouver — Dunbar Cmty Centre` (em-dash variant)

**Total programs in database:** 201
- Open: 111
- Full/Waitlist: 41
- Completed: 49

**Registration URL pattern:** `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/{activityId}?onlineSiteId=0`

### Program Categories (Open programs)
| Category | Count |
|----------|-------|
| General | 40 |
| Sports | 23 |
| Performing Arts | 17 |
| Music | 16 |
| Multi-Activity | 11 |
| Arts | 4 |

### Open Programs Inventory (111 total)

| ID | Name | Start Date | Cost |
|----|------|-----------|------|
| ACT-602618 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-06 | null |
| ACT-602619 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-13 | null |
| ACT-602620 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-20 | null |
| ACT-602621 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-27 | null |
| ACT-602622 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-04 | null |
| ACT-602623 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-10 | null |
| ACT-602624 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-17 | null |
| ACT-602625 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-24 | null |
| ACT-602627 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-06 | null |
| ACT-602628 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-13 | null |
| ACT-602630 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-20 | null |
| ACT-602631 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-27 | null |
| ACT-602632 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-04 | null |
| ACT-608317 | Dunbar Day Camp - Week 1 (6-12 yrs) | 2026-07-02 | null |
| ACT-608330 | Dunbar Day Camp - Week 2 (6-12 yrs) | 2026-07-06 | null |
| ACT-608332 | Dunbar Day Camp - Week 3 (6-12 yrs) | 2026-07-13 | null |
| ACT-609243 | Dunbar Day Camp - Week 4 (6-12 yrs) | 2026-07-20 | null |
| ACT-609244 | Dunbar Day Camp - Week 5 (6-12 yrs) | 2026-07-27 | null |
| ACT-609245 | Dunbar Day Camp - Week 6 (6-12 yrs) | 2026-08-04 | null |
| ACT-609246 | Dunbar Day Camp - Week 7 (6-12 yrs) | 2026-08-10 | null |
| ACT-609247 | Dunbar Day Camp - Week 8 (6-12 yrs) | 2026-08-17 | null |
| COV-598743 | Private Piano Lessons (5-9 yrs) | 2026-04-02 | $318 |
| COV-600802 | Dunbar Soccer Academy (2-3 yrs) | 2026-04-15 | $203.50 |
| COV-600803 | Dunbar Soccer Academy (3-5 yrs) | 2026-04-13 | $203.50 |
| COV-600804 | Dunbar Soccer Academy (3-5 yrs) | 2026-04-15 | $203.50 |
| COV-600805 | Dunbar Soccer Academy (5-7 yrs) | 2026-04-13 | $203.50 |
| COV-600807 | Dunbar Soccer Academy (7-9 yrs) | 2026-04-13 | $203.50 |
| COV-601346 | Private Piano Lessons (3.5+ yrs) | 2026-04-11 | $550 |
| COV-601348 | Private Piano Lessons (3.5+ yrs) | 2026-04-11 | $726 |
| COV-602035 | Private Piano Lessons (3.5+ yrs) | 2026-04-08 | $1584 |
| COV-602069 | Byte Camp - Introduction to coding | 2026-08-10 | $410 |
| COV-602625 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-24 | $399 |
| COV-602627 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-06 | $399 |
| COV-602628 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-13 | $399 |
| COV-602630 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-20 | $399 |
| COV-602631 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-27 | $399 |
| COV-602632 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-04 | $322 |
| COV-603548 | Self Defence Summer Camp (6-10yrs) | 2026-07-20 | $295 |
| COV-603587 | Self Defence Summer Camp (11-16yrs) | 2026-08-24 | $295 |
| COV-603643 | Sportball Indoor Basketball (6-9 yrs) | 2026-05-21 | $120 |
| COV-604386 | ANIME CARTOON DRAWING WORKSHOP (6-12 yrs) | 2026-08-17 | $220 |
| COV-604400 | Drawing and Painting (3-5 yrs) | 2026-04-13 | $220 |
| COV-604777 | Private Piano Lessons (4+ yrs) | 2026-04-13 | $325 |
| COV-604778 | Private Piano Lessons (4+ yrs) | 2026-04-13 | $325 |
| COV-604780 | Private Piano Lessons (4+ yrs) | 2026-04-13 | $325 |
| COV-604781 | Private Piano Lessons (4+ yrs) | 2026-04-13 | $325 |
| COV-604782 | Private Piano Lessons (4+ yrs) | 2026-04-13 | $325 |
| COV-608124 | Mini Hip Hop Breakers age 3-5 | 2026-04-12 | $154 |
| COV-608125 | Mini Hip Hop Breakers age 3-5 | 2026-07-05 | $112 |
| COV-608873 | Shotokan Karate | 2026-04-01 | $288 |
| COV-608874 | Shotokan Karate Saturdays | 2026-04-04 | $144 |
| COV-608880 | Shotokan Karate | 2026-07-06 | $180 |
| COV-608882 | Shotokan Karate Saturdays | 2026-07-04 | $108 |
| COV-609508 | Maevann Art Lessons (Fridays)(Preschoolers 3-5 years) | 2026-04-10 | $45 |
| COV-609568 | Maevann Art Summer Camp (5-10 yrs) | 2026-08-17 | $70 |
| COV-609569 | Maevann Art Summer Camp (5-10 yrs) | 2026-08-04 | $60 |
| COV-610140 | GirlsCANCompute: Math Club (10-13 yrs) | 2026-04-10 | $0 |
| COV-610141 | GirlsCANCompute: Computational Linguistics Club (13-15 yrs) | 2026-04-10 | $0 |
| COV-610183 | Youth Knitting Club (11-16 yrs) | 2026-04-08 | $0 |
| COV-610186 | Dunbar Reading Buddies | 2026-04-10 | $0 |
| COV-610357 | 1st Ballet Time | 2026-07-07 | $128 |
| COV-610362 | 1st Dance Sing Musical Theatre | 2026-04-07 | $192 |
| COV-610365 | 1st Dance Sing Musical Theatre | 2026-07-07 | $192 |
| COV-610372 | 1st Tumble, Flex and Dance | 2026-04-07 | $192 |
| COV-610373 | 1st Tumble, Flex and Dance | 2026-07-07 | $128 |
| COV-610375 | 1st Urban Dance Hip Hop | 2026-04-07 | $192 |
| COV-610376 | 1st Urban Dance Hip Hop | 2026-07-07 | $128 |
| COV-610465 | A Ballet Time with Strength and Stretch (7-10yrs) | 2026-04-11 | $192 |
| COV-610470 | Asian Pop/KPOP/ Hip Hop (6-12 yrs) | 2026-04-12 | $192 |
| COV-610471 | Asian Pop/KPOP/ Hip Hop (6-12 yrs) | 2026-07-05 | $144 |
| COV-610472 | Asian Pop/KPOP/ Hip Hop (6-12 yrs) | 2026-04-11 | $192 |
| COV-610473 | Asian Pop/KPOP/ Hip Hop (6-12 yrs) | 2026-07-04 | $144 |
| COV-610479 | 1-Active Dance Sing/Jazz Funk/Hip Hop/KPOP (AM Half 8-14yrs) | 2026-08-17 | $238 |
| COV-610791 | 1-Active Dance Sing/Jazz Funk/Hip Hop/KPOP (PM Half 8-14yrs) | 2026-08-24 | $238 |
| COV-613002 | ANIMAL CARTOON WORKSHOP (6-12 yrs) | 2026-08-10 | $220 |
| COV-615725 | Private Piano Lessons (3.5+ yrs) | 2026-07-04 | $357 |
| COV-615726 | Private Piano Lessons (3.5+ yrs) | 2026-07-04 | $357 |
| COV-615727 | Private Piano Lessons (3.5+ yrs) | 2026-07-04 | $357 |
| COV-615729 | Private Piano Lessons (3.5+ yrs) | 2026-07-05 | $469 |
| COV-615730 | Private Piano Lessons (3.5+ yrs) | 2026-07-05 | $357 |
| COV-615746 | Teen Astronomy Club | 2026-04-15 | $0 |
| COV-616587 | Private Piano Lessons (3.5+ yrs) | 2026-04-10 | $363 |
| COV-616588 | Private Piano Lessons (3.5+ yrs) | 2026-07-10 | $238 |
| COV-617324 | Cycle Fit | 2026-05-02 | $7.93 |
| COV-617325 | Cycle Fit | 2026-05-09 | $7.93 |
| COV-617326 | Cycle Fit | 2026-05-16 | $7.93 |
| COV-617327 | Cycle Fit | 2026-05-23 | $7.93 |
| COV-617328 | Cycle Fit | 2026-05-30 | $7.93 |
| COV-617329 | Cycle Fit | 2026-06-06 | $7.93 |
| COV-617330 | Cycle Fit | 2026-06-13 | $7.93 |
| COV-617381 | Cycle Fit | 2026-04-08 | $7.93 |
| COV-617382 | Cycle Fit | 2026-04-15 | $7.93 |
| COV-617383 | Cycle Fit | 2026-04-22 | $7.93 |
| COV-617384 | Cycle Fit | 2026-04-29 | $7.93 |
| COV-617385 | Cycle Fit | 2026-05-06 | $7.93 |
| COV-617386 | Cycle Fit | 2026-05-13 | $7.93 |
| COV-617387 | Cycle Fit | 2026-05-20 | $7.93 |
| COV-617388 | Cycle Fit | 2026-05-27 | $7.93 |
| COV-617389 | Cycle Fit | 2026-06-03 | $7.93 |
| COV-617390 | Cycle Fit | 2026-06-10 | $7.93 |
| COV-617392 | Cycle Fit | 2026-06-17 | $7.93 |
| COV-617394 | Cycle Fit | 2026-06-24 | $7.93 |
| COV-617395 | Cycle Fit | 2026-07-08 | $7.93 |
| COV-617396 | Cycle Fit | 2026-07-15 | $7.93 |
| COV-617397 | Cycle Fit | 2026-07-22 | $7.93 |
| COV-617399 | Cycle Fit | 2026-07-29 | $7.93 |
| COV-617400 | Cycle Fit | 2026-08-05 | $7.93 |
| COV-617402 | Cycle Fit | 2026-08-12 | $7.93 |
| COV-617403 | Cycle Fit | 2026-08-19 | $7.93 |
| COV-617404 | Cycle Fit | 2026-08-26 | $7.93 |
| COV-617656 | 1st Ballet Time | 2026-04-07 | $192 |

---

## Data Changes Made (Session 1)

No programs were modified, added, or removed in Session 1.

## Data Changes Made (Session 2)

Two programs corrected (see "Data Fixes Applied" section above).

## Completeness Check

**Database has:** 187 programs (across "City of Vancouver - Dunbar Community Centre" and "City of Vancouver - Dunbar Cmty Centre" provider variants)
- Open: 91
- Completed: 49
- Full/Waitlist: 41 (from older Winter 2026 session)
- Coming Soon: 6

**Live page:** Not verified — browser unavailable in both sessions.

## Priority Actions for Next Audit Session

1. **Restart Claude Code / Playwright MCP** to restore browser functionality
2. Navigate to: `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&location_ids=23`
3. Verify Coming Soon programs (COV-610475 through -481, COV-610800) — registrationDate was 2026-04-08, may now be Open
4. Spot-check Open programs against live prices, dates, times
5. Check for new programs (Dunbar Day Camp series ACT-608317 etc. in old log — verify still in DB)

## Next Steps

Re-run this audit when Playwright browser is working. The ActiveNet platform (anc.ca.apm.activecommunities.com) requires JavaScript rendering — WebFetch cannot be used as a substitute.

Registration page to revisit:
- https://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&location_ids=23
