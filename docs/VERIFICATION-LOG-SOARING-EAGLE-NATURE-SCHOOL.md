# Verification Log — Soaring Eagle Nature School

**Date:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Provider:** Soaring Eagle Nature School
**Primary source:** https://soaringeaglenatureschool.org/summer-forest-camp/
**Secondary sources:** /summer-young-sprouts-camp/, /summer-advanced-camp/, /programguide/, /registration/
**Registration platform:** CampBrain (soaringeagle.campbrainregistration.com) — unavailable during audit (503)

---

## Summary

**Provider shows (2026 — confirmed from live pages):**
- Summer Forest Camp (ages 6-12, 9AM-3PM): 15 sessions across 4 locations — Vancouver, NV, Coquitlam, Delta
- Summer Young Sprouts Camp (ages 4-6, 9AM-1PM): dates TBA, pricing TBA
- Summer Advanced Camp (ages 8-14, 9AM-3PM): dates TBA, pricing TBA
- Summer Ocean & Forest Camp (at Acadia Beach, Vancouver): listed in program guide; specific page 404s

**Database before audit:** 20 entries
**Database after audit:** 30 entries
**Added:** 10 new Summer Forest Camp sessions (missing locations/weeks)
**Fixed:** 19 existing entries (cost, address, status, URLs, age ranges)
**Marked Completed:** 7 (stale/incorrect entries)

---

## Source Verification

### Summer Forest Camp page (soaringeaglenatureschool.org/summer-forest-camp/)

**Confirmed 2026 data:**
- Ages 6-12, 9AM-3PM, **$490 + tax** per week
- Registration opened April 2, 2026 at 6pm

| Location | Park | 2026 Dates |
|----------|------|-----------|
| Vancouver | Acadia Beach Park | Jun 29-Jul 3, Jul 6-10, Jul 13-17, Jul 20-24, Aug 3-7, Aug 10-14, Aug 17-21, Aug 24-28 |
| North Vancouver | Capilano River Regional Park | Jun 29-Jul 3, Jul 6-10, Aug 10-14, Aug 17-21, Aug 24-28 |
| Coquitlam | Minnekhada Regional Park | Jul 20-24 |
| Delta | Delta Watershed Park | Jul 13-17 |

Note: Aug 3-7 week at Vancouver is a 4-day week (BC Day Mon Aug 3 holiday).
Note: Jun 29-Jul 3 week is a 4-day week (Canada Day Jul 1 holiday).

### Summer Young Sprouts Camp page (soaringeaglenatureschool.org/summer-young-sprouts-camp/)

- Ages 4-6, 9AM-1PM (half day)
- **Pricing TBA** as of April 2026
- 2026 Dates: TBA
- Locations: Vancouver (Pacific Spirit Park), Vancouver (Acadia Beach Park), North Vancouver

### Advanced Forest Camp page (soaringeaglenatureschool.org/summer-advanced-camp/)

- Ages **8-14** (DB had 9-14 — corrected), 9AM-3PM
- **Pricing TBA** as of April 2026
- 2026 Dates: TBA
- Locations: Acadia Beach Vancouver, Capilano River NV
- Prerequisite: 2+ previous 5-day camps or Monthly programs

### Summer Ocean & Forest Camp

- Listed in program guide as existing at Acadia Beach Park
- Specific page (summer-ocean-forest-camp/) returns 404 — page appears removed or merged with Summer Forest Camp
- DB entries 1379-1380 retained/fixed as Acadia Beach Vancouver entries

---

## Issues Found and Fixed

### Issue 1: Cost Wrong on All Summer Forest Camp Entries

All 20 DB entries had `cost: 365` (2024 prior-year estimate). Live 2026 page shows **$490 + tax**. Fixed on all confirmed entries.

### Issue 2: Wrong Locations on Several Entries

- IDs 461-466 had address "1496 Frederick Road, North Vancouver" (the school office address, not a camp venue). Fixed to correct park addresses.
- ID 462 listed as NV Jul 13-17 but NV does NOT have Jul 13-17 per live schedule. Fixed: corrected to Acadia Beach Vancouver Jul 13-17.
- ID 463 listed as NV Jul 20-24 but NV doesn't have that week (Coquitlam does, covered by 1389). Marked Completed.
- ID 464 listed as NV Jul 27-31 but no location has Jul 27-31 in 2026. Marked Completed.
- ID 465 listed as NV Aug 4-7 but NV doesn't have that week. Fixed: corrected to Acadia Beach Vancouver Aug 4-7 (BC Day short week).

### Issue 3: Pacific Spirit Park Misattributed

IDs 1387-1388 listed "Summer Forest Camp (Pacific Spirit)" — but the live page confirms Pacific Spirit Park is a **Young Sprouts** location, not a Summer Forest Camp location. Marked Completed.

### Issue 4: Spring Break Entry Still "Likely Coming Soon"

ID 468 (North Vancouver Survival Skills Camp, Mar 23-27, 2026) was still "Likely Coming Soon" even though the dates are past. Marked Completed.

### Issue 5: Advanced Camp Age Range Wrong

Live page says ages 8-14. DB had ageMin=9. Fixed to ageMin=8.

### Issue 6: Missing Sessions

15 total Summer Forest Camp sessions are on the live page; DB only had 10 (with several wrong). Added 10 new entries for missing sessions:
- NV: Jun 29-Jul 3, Aug 17-21, Aug 24-28
- Vancouver Acadia Beach: Jun 29-Jul 3, Jul 6-10, Jul 20-24, Aug 10-14, Aug 17-21, Aug 24-28
- Delta: Jul 13-17

---

## Program Database (Post-Audit)

### Active Entries — Summer Forest Camp (15 confirmed sessions)

| ID | Location | Dates | Days | Cost |
|----|----------|-------|------|------|
| sens-van-jun29 | Vancouver (Acadia Beach) | Jun 29-Jul 3 | Mon-Thu (4 days) | $490 |
| sens-van-jul6 | Vancouver (Acadia Beach) | Jul 6-10 | Mon-Fri | $490 |
| 462 | Vancouver (Acadia Beach) | Jul 13-17 | Mon-Fri | $490 |
| sens-van-jul20 | Vancouver (Acadia Beach) | Jul 20-24 | Mon-Fri | $490 |
| 465 | Vancouver (Acadia Beach) | Aug 4-7 | Tue-Fri (4 days) | $490 |
| sens-van-aug10 | Vancouver (Acadia Beach) | Aug 10-14 | Mon-Fri | $490 |
| sens-van-aug17 | Vancouver (Acadia Beach) | Aug 17-21 | Mon-Fri | $490 |
| sens-van-aug24 | Vancouver (Acadia Beach) | Aug 24-28 | Mon-Fri | $490 |
| sens-nv-jun29 | North Vancouver (Capilano River) | Jun 29-Jul 3 | Mon-Thu (4 days) | $490 |
| 461 | North Vancouver (Capilano River) | Jul 6-10 | Mon-Fri | $490 |
| 466 | North Vancouver (Capilano River) | Aug 10-14 | Mon-Fri | $490 |
| sens-nv-aug17 | North Vancouver (Capilano River) | Aug 17-21 | Mon-Fri | $490 |
| sens-nv-aug24 | North Vancouver (Capilano River) | Aug 24-28 | Mon-Fri | $490 |
| 1389 | Coquitlam (Minnekhada) | Jul 20-24 | Mon-Fri | $490 |
| sens-delta-jul13 | Delta (Watershed Park) | Jul 13-17 | Mon-Fri | $490 |

### Active Entries — Other Programs (dates/prices TBA)

| ID | Program | Ages | Time | Status |
|----|---------|------|------|--------|
| 1381 | Young Sprouts Nature Camp (NV) | 4-6 | 9AM-1PM | Likely Coming Soon |
| 1382 | Young Sprouts Nature Camp (NV) | 4-6 | 9AM-1PM | Likely Coming Soon |
| 1383 | Young Sprouts Nature Camp (Vancouver PS) | 4-6 | 9AM-1PM | Likely Coming Soon |
| 1384 | Young Sprouts Nature Camp (Vancouver PS) | 4-6 | 9AM-1PM | Likely Coming Soon |
| 1385 | Advanced Forest Camp (Vancouver) | 8-14 | 9AM-3PM | Likely Coming Soon |
| 1386 | Advanced Forest Camp (NV) | 8-14 | 9AM-3PM | Likely Coming Soon |
| 1380 | Summer Ocean & Forest Camp (Acadia Beach) | 6-12 | 9AM-3PM | Open (Aug 4-7) |

### Spring Break / Completed Entries

| ID | Program | Dates | Status |
|----|---------|-------|--------|
| 467 | Vancouver Ocean and Forest Camp | Mar 16-20, 2026 | Completed |
| 468 | North Vancouver Survival Skills Camp | Mar 23-27, 2026 | Completed |

### Deprecated Entries (Marked Completed)

| ID | Reason |
|----|--------|
| 463 | NV doesn't have Jul 20-24; Coquitlam has it (entry 1389) |
| 464 | No location has Jul 27-31 in 2026 |
| 1379 | Jul 27-31 not in 2026 schedule |
| 1387 | Pacific Spirit is Young Sprouts location, not Summer Forest Camp |
| 1388 | Pacific Spirit is Young Sprouts location, not Summer Forest Camp |

---

## Fields Verified Against Provider Page

| Field | Status |
|-------|--------|
| name | Fixed — location-specific names added |
| cost | Fixed: $490 + GST confirmed from live page (was $365 prior year estimate) |
| ageMin/ageMax | Fixed: Advanced Camp 8-14 (was 9-14); others confirmed |
| startDate/endDate | Fixed — corrected per live schedule; 4-day weeks noted |
| startTime/endTime | Confirmed: 9AM-3PM full day; 9AM-1PM Young Sprouts |
| address | Fixed — all entries now have park names/addresses, not school office |
| registrationUrl | Fixed — program-specific pages used |
| enrollmentStatus | Open (confirmed), Likely Coming Soon (dates TBA), Completed (past) |
| confirmed2026 | true for Summer Forest Camp ($490 confirmed); false for TBA programs |
| priceVerified | true for Summer Forest Camp; false for TBA programs |

---

## Count Verification

| Program | Provider Shows | DB Before | DB After |
|---------|---------------|-----------|----------|
| Summer Forest Camp (all locations) | 15 sessions | ~10 (wrong) | 15 confirmed ✓ |
| Summer Young Sprouts | TBA dates | 4 (wrong URL) | 4 (fixed URL/price) |
| Advanced Forest Camp | TBA dates | 2 | 2 (fixed age/URL) |
| Ocean & Forest Camp | 1+ sessions | 2 | 1 confirmed + 1 deprecated |
| Spring Break (past) | — | 2 | 2 Completed |
| **Active total** | | | **24 active** |

---

## Notes

- Registration platform transitioned to CampBrain (soaringeagle.campbrainregistration.com) — was Amilia previously. CampBrain was returning 503 during audit; provider pages confirmed registrationUrl.
- Summer camp registration opened April 2, 2026 at 6pm per the provider's summer-forest-camp page.
- Young Sprouts and Advanced Camp 2026 dates/prices not yet posted. Entries retained with appropriate "Likely Coming Soon" status and null cost.
- "Summer Ninja Camp" mentioned on registration page — not found as a standalone page; may be a new program to add in a future audit when details are available.
- Teen Internship program (ages 13-17) exists but is an add-on to existing summer camp sessions, not a standalone listing. Not added.
