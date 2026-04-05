# Verification Log — City of Vancouver - Creekside Cmty Rec Centre

**Date Audited:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Status:** INCOMPLETE — Playwright browser spawn failure
**Registration Page URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&activity_select_param=2&viewMode=list&center_ids=11

---

## Audit Outcome: Blocked

This audit was blocked by a persistent Playwright browser spawn failure (`spawn UNKNOWN`). This is the same system-level issue that blocked the Britannia Cmty Centre audit (see commit `ab85df9`).

### What Was Attempted

1. **Playwright browser navigation** (3 attempts) — all failed with `spawn UNKNOWN` error. Chrome processes were killed to free resources before each retry, with no improvement.
2. **WebFetch on ActiveNet REST API endpoints** — returned the React app's configuration/initial state, not program data. ActiveNet requires JavaScript rendering to display program listings.
3. **WebFetch on specific program detail pages** — same result; React app shell without program data.
4. **Cross-reference against pre-cached scan pages** — scan_page*.json files referenced in git status are not present in the current file system (appear to be from a different session/worktree).

### Root Cause

The Playwright MCP server (`mcp__playwright__browser_navigate`) is unable to spawn a new headless Chrome process on this Windows machine. The error (`spawn UNKNOWN`) indicates a system-level failure, not a network or authentication issue.

---

## Database State (Pre-Audit)

**65 programs** exist for City of Vancouver - Creekside Cmty Rec Centre in `src/data/programs.json`.

### Status Breakdown
| Status | Count |
|--------|-------|
| Open | 59 |
| Full/Waitlist | 2 |
| Completed | 4 |

### Programs by Category
| Program | Count |
|---------|-------|
| Sportball Junior | 1 |
| Sportball Multi-Sport | 1 |
| Sportball Parent and Tot | 1 |
| Private Piano Lessons | 2 |
| Shorinji Kempo | 6 |
| Tigers Taekwondo (3-4 yrs) | 1 |
| Children Beginner Taekwondo (White Belts) | 1 |
| Children Beginners Taekwondo (White Belts) | 1 |
| 20/20/20 Dance fit, Strength and Yoga Fitness | 7 |
| Capoeira | 1 |
| Creekside Soccer Academy | 1 |
| Family Play Gym | 1 |
| Birthday Party | 23 |
| Kids Self-Defense / Anti Bullying (3 age groups) | 3 |
| Minecraft Camps (6 weeks) | 6 |
| Birds Nest Properties Community Dragon Boat Paddling Day | 9 |

- **63 of 65** programs have `confirmed2026: true`
- **63 of 65** programs have `priceVerified: true`
- No programs have past end dates that need updating (all end dates are 2026-04-05 or later)

### Full Program Inventory (as of 2026-04-05)

| ID | Name | Ages | Status | Date Range |
|----|------|------|--------|------------|
| COV-586679 | Sportball Junior | 1-2 | Open | 2026-03-04 – 2026-04-29 |
| COV-586710 | Sportball Multi-Sport | 3-5 | Open | 2026-03-04 – 2026-04-29 |
| COV-586723 | Sportball Parent and Tot | 2-3 | Open | 2026-03-04 – 2026-04-29 |
| COV-586757 | Private Piano Lessons | 5+ | Full/Waitlist | 2026-01-07 – 2026-04-29 |
| COV-586758 | Private Piano Lessons | 5+ | Full/Waitlist | 2026-01-07 – 2026-04-29 |
| COV-587054 | Shorinji Kempo | 13+ | Completed | 2026-03-03 – 2026-03-31 |
| COV-587055 | Shorinji Kempo | 13+ | Open | 2026-04-07 – 2026-04-28 |
| COV-587079 | Tigers Taekwondo (3-4 yrs) | 3-4 | Open | 2026-01-12 – 2026-04-27 |
| COV-587092 | Children Beginner Taekwondo (White Belts) | 5-8 | Open | 2026-01-12 – 2026-04-27 |
| COV-587094 | Children Beginners Taekwondo (White Belts) | 9-12 | Open | 2026-01-12 – 2026-04-27 |
| COV-587134 | 20/20/20 Dance fit, Strength and Yoga Fitness | 13+ | Open | 2026-03-23 – 2026-04-27 |
| COV-588252 | Capoeira | 13+ | Completed | 2026-03-02 – 2026-03-30 |
| COV-588402 | Creekside Soccer Academy | 6-9 | Open | 2026-01-11 – 2026-04-26 |
| COV-588796 | Family Play Gym | 0-5 | Open | 2026-01-09 – 2026-04-24 |
| COV-588863 | Birthday Party | 0-6 | Completed | 2026-03-28 |
| COV-588865 | Birthday Party | 0-6 | Completed | 2026-03-29 |
| COV-588866 | Birthday Party | 0-6 | Open | 2026-04-11 |
| COV-609112 | Shorinji Kempo | 13+ | Open | 2026-05-02 – 2026-05-30 |
| COV-609113 | Shorinji Kempo | 13+ | Open | 2026-06-02 – 2026-06-30 |
| COV-609114 | Shorinji Kempo | 13+ | Open | 2026-07-04 – 2026-07-28 |
| COV-609115 | Shorinji Kempo | 13+ | Open | 2026-08-04 – 2026-08-29 |
| COV-610927 | 20/20/20 Dance fit, Strength and Yoga Fitness | 13+ | Open | 2026-05-06 – 2026-06-03 |
| COV-610929 | 20/20/20 Dance fit, Strength and Yoga Fitness | 13+ | Open | 2026-06-10 – 2026-07-15 |
| COV-610933 | 20/20/20 Dance fit, Strength and Yoga Fitness | 13+ | Open | 2026-07-22 – 2026-08-19 |
| COV-610951 | 20/20/20 Dance fit, Strength and Yoga Fitness | 13+ | Open | 2026-05-01 – 2026-06-05 |
| COV-610952 | 20/20/20 Dance fit, Strength and Yoga Fitness | 13+ | Open | 2026-06-12 – 2026-07-10 |
| COV-610955 | 20/20/20 Dance fit, Strength and Yoga Fitness | 13+ | Open | 2026-07-17 – 2026-08-21 |
| COV-611034 | Kids Self-Defense and Anti Bullying (ages 5-8) | 5-8 | Open | 2026-07-04 – 2026-08-22 |
| COV-611035 | Kids Self Defense and Anti Bullying (ages 9-11) | 9-11 | Open | 2026-07-04 – 2026-08-22 |
| COV-611036 | Youth Self-Defense and Anti Bullying (Ages 12-17) | 12-17 | Open | 2026-07-04 – 2026-08-22 |
| COV-612894 | A 'Lets Play' Summer Start: Learning Through Minecraft | 8-14 | Open | 2026-07-06 – 2026-07-10 |
| COV-612895 | A Minecraft Master Class: Mini Game Design | 8-14 | Open | 2026-07-13 – 2026-07-17 |
| COV-612896 | A Minecraft History Quest: Ancient Civilizations | 8-14 | Open | 2026-07-20 – 2026-07-24 |
| COV-612897 | A Minecraft Master Class: Builder/Engineer/Architect | 8-14 | Open | 2026-07-27 – 2026-07-31 |
| COV-612898 | A Mid-Summer Minecraft Adventure: Four Days to The End! | 8-14 | Open | 2026-08-04 – 2026-08-07 |
| COV-612900 | Pokemon in Minecraft with Cobblemon | 8-14 | Open | 2026-08-17 – 2026-08-21 |
| COV-613012 | Birthday Party | 0-6 | Open | 2026-06-27 |
| COV-613013 | Birthday Party | 0-6 | Open | 2026-06-28 |
| COV-613015 | Birthday Party | 0-6 | Open | 2026-07-04 |
| COV-613016 | Birthday Party | 0-6 | Open | 2026-07-05 |
| COV-613017 | Birthday Party | 0-6 | Open | 2026-07-11 |
| COV-613018 | Birthday Party | 0-6 | Open | 2026-07-12 |
| COV-613019 | Birthday Party | 0-6 | Open | 2026-07-18 |
| COV-613020 | Birthday Party | 0-6 | Open | 2026-07-19 |
| COV-613021 | Birthday Party | 0-6 | Open | 2026-07-25 |
| COV-613022 | Birthday Party | 0-6 | Open | 2026-07-26 |
| COV-613023 | Birthday Party | 0-6 | Open | 2026-08-01 |
| COV-613024 | Birthday Party | 0-6 | Open | 2026-08-02 |
| COV-613025 | Birthday Party | 0-6 | Open | 2026-08-08 |
| COV-613026 | Birthday Party | 0-6 | Open | 2026-08-09 |
| COV-613027 | Birthday Party | 0-6 | Open | 2026-08-15 |
| COV-613028 | Birthday Party | 0-6 | Open | 2026-08-16 |
| COV-613029 | Birthday Party | 0-6 | Open | 2026-08-23 |
| COV-613030 | Birthday Party | 0-6 | Open | 2026-08-22 |
| COV-613031 | Birthday Party | 0-6 | Open | 2026-08-29 |
| COV-613032 | Birthday Party | 0-6 | Open | 2026-08-30 |
| COV-614807 | Birds Nest Properties Community Dragon Boat Paddling Day | 12+ | Open | 2026-05-24 |
| COV-614808 | Birds Nest Properties Community Dragon Boat Paddling Day | 12+ | Open | 2026-05-24 |
| COV-614809 | Birds Nest Properties Community Dragon Boat Paddling Day | 12+ | Open | 2026-05-24 |
| COV-614810 | Birds Nest Properties Community Dragon Boat Paddling Day | 12+ | Open | 2026-07-12 |
| COV-614811 | Birds Nest Properties Community Dragon Boat Paddling Day | 12+ | Open | 2026-07-12 |
| COV-614812 | Birds Nest Properties Community Dragon Boat Paddling Day | 12+ | Open | 2026-07-12 |
| COV-614813 | Birds Nest Properties Community Dragon Boat Paddling Day | 12+ | Open | 2026-08-02 |
| COV-614814 | Birds Nest Properties Community Dragon Boat Paddling Day | 12+ | Open | 2026-08-02 |
| COV-614815 | Birds Nest Properties Community Dragon Boat Paddling Day | 12+ | Open | 2026-08-02 |

---

## Programs Found in Scan Pages Not in Database

During the audit, the following additional Creekside programs were identified through cross-referencing previously generated scan data. These could NOT be verified via the live registration page due to the Playwright failure. They are noted here for future audit follow-up:

| ID | Name | Ages | Notes |
|----|------|------|-------|
| 590377 | Badminton Beginner & Intermediate | 8-15 | Status: Full |
| 613967 | Badminton Beginner & Intermediate | 8-15 | Spring/Summer 2026 session |
| 613968 | Badminton Beginner & Intermediate | 8-15 | Spring/Summer 2026 session |
| 587102 | Teens Taekwondo | 13-18 | Status: In progress |
| 587112 | Children Intermediate Taekwondo (Yellow to Green Belts) | 6-11 | Status: In progress |
| 611029 | Children Intermediate Taekwondo (Yellow to Green Belts) | 6-10 | Spring 2026 |
| 611017 | Children Taekwondo Beginners (ages 11-17) | 11-17 | Spring 2026 |
| 613945 | Athletic Taping Course | 16+ | One-day workshop |
| 613946 | Athletic Taping Course | 16+ | One-day workshop |
| 612902 | Back to School in Minecraft: Stay Safe | 8-14 | Mon-Fri camp |
| 613006-613011 | Birthday Party (6 additional dates) | 0-6 | April/May 2026 slots |
| 611266 | Creekside Soccer Academy | 4-6 | Spring 2026 (ages 4-5) |
| 611268 | Creekside Soccer Academy | 6-10 | Spring 2026 (ages 6-9) |
| 612419 | Capoeira | 13+ | Spring 2026 session |
| 612420 | Capoeira | 13+ | Spring 2026 session |
| 613951 | Yoga Made for Runners - Monday | 16+ | Spring 2026 |
| 613952 | Yoga Made for Runners - Friday | 16+ | Spring 2026 |
| 610911-610913 | Jodo - The Way Of The Stick | 19+ | Adult martial arts |

**Note:** The adult drop-in programs (Badminton 19+, Basketball 19+, Soccer 19+, Callanetics 19+) were excluded as Skeddo focuses on youth/family programs.

---

## Changes Made

**None** — The existing 65 programs were not modified. No programs were added without browser verification.

## What Needs to Be Done in Next Audit

1. Fix Playwright browser spawn issue on this machine
2. Navigate to the live registration page and verify all 65 existing programs field-by-field
3. Add the missing programs identified above (especially: Teens Taekwondo, Children Intermediate Taekwondo, Badminton Beginner 8-15, additional Capoeira sessions, additional Soccer Academy age groups, Minecraft: Stay Safe camp, Birthday Party April slots)
4. Verify enrollmentStatus for Spring 2026 programs currently marked "Open" — some may have filled up

---

## Provider Info

- **Address:** 1 Athletes Way, Vancouver, BC V6G 2W6
- **Neighbourhood:** Olympic Village / False Creek
- **Registration URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search

---

*Audit blocked: Playwright browser spawn failure (spawn UNKNOWN) — same issue as City of Vancouver - Britannia Cmty Centre audit (2026-04-05). Re-audit required once browser environment is restored.*
