# Verification Log — Little Kitchen Academy

**Date:** 2026-04-04
**Auditor:** Claude (autonomous audit agent)
**Provider:** Little Kitchen Academy
**Registration pages:**
- North Vancouver: https://littlekitchenacademy.com/locations/north-vancouver/
- Fraser: https://littlekitchenacademy.com/locations/fraser/
- Point Grey: https://littlekitchenacademy.com/locations/point-grey/

---

## Locations Confirmed

| Location | Address | Registration URL |
|----------|---------|-----------------|
| North Vancouver (Edgemont) | 3018 Edgemont Blvd, North Vancouver, BC V7R 2N4 | https://app.amilia.com/store/en/little-kitchen-academy-north-vancouver/shop/programs/128446 |
| Vancouver (Fraser) | 3873 Fraser St, Vancouver, BC | https://app.amilia.com/store/en/littlekitchenacademyfraser/shop/programs/128440 |
| Vancouver (Point Grey) | 3744 W 10th Ave, Vancouver, BC | https://app.amilia.com/store/en/lka/shop/programs/128449 |

---

## Camp Schedule (All Locations)

12 themed camp weeks, June 15 – September 4, 2026. Each week runs Mon–Fri 9am–4pm across three age-group sessions:
- Ages 3-5: 9:00 AM – 12:00 PM
- Ages 6-8: 12:30 PM – 3:30 PM (NV/PG); times vary at Fraser
- Ages 9-12: 4:00 PM – 7:00 PM
- Ages 13-18: 4:00 PM – 7:00 PM (Teen Nights, select weeks only)

| Camp | Theme | Dates |
|------|-------|-------|
| A | Mastering Kitchen Tools | Jun 15–19 |
| B | Summer Flavor Lab | Jun 22–26 |
| C | Picnic Classics | Jun 29–Jul 3 (4 days, Canada Day Jul 1) |
| D | Global Street Eats | Jul 6–10 |
| E | Baking Chemistry Lab | Jul 13–17 |
| F | Cooking with Summer's Finest | Jul 20–24 |
| G | Around the Campfire | Jul 27–31 |
| H | Taste the World | Aug 4–7 (4 days, BC Day Aug 3; PG may run Aug 3–7) |
| I | Cooking with Imagination | Aug 10–14 |
| J | Culinary Engineering | Aug 17–21 |
| K | Smart Snacks & Packable Lunches | Aug 24–28 |
| L | Handheld Favorites / Favourites | Aug 31–Sep 4 |

### Pricing

| Location | Standard 5-day | 4-day (Camp C/H) |
|----------|---------------|-----------------|
| North Vancouver | $520 | $415-416 |
| Fraser | $520 | $415-416 |
| Point Grey | $529 | $429 (Camp C only) |

---

## Database Count

- **Provider shows (live):** ~30+ sessions at NV, ~32 at Fraser, ~35 at PG
- **Database had:** 35 programs (2 stale + 33 NV confirmed)
- **Added:** 69 programs
  - 2 missing NV programs (Camp F 6-8 and Camp G 6-8)
  - 32 Fraser location programs (5 ages 3-5 + 12 ages 6-8 + 12 ages 9-12 + 3 teen)
  - 35 Point Grey location programs (12 ages 3-5 + 12 ages 6-8 + 11 ages 9-12)
- **Retired to Completed:** 2 stale records (IDs 2506 and little-kitchen-pg-1)
- **Database now has:** 104 programs for this provider (102 active + 2 Completed)

---

## Discrepancies Found & Resolved

### 1. Camp F (Cooking with Summer's Finest) — missing Ages 6-8 at NV
- **Issue:** Database had only Ages 3-5 and Ages 9-12 for Camp F at North Vancouver
- **Fix:** Added Camp F Ages 6-8 (Jul 20-24, 12:30-3:30pm, $520)

### 2. Camp G (Around the Campfire) — missing Ages 6-8 at NV
- **Issue:** Database had Ages 3-5, 9-12, and 13-18 for Camp G at NV, but not Ages 6-8
- **Fix:** Added Camp G Ages 6-8 (Jul 27-31, 12:30-3:30pm, $520)

### 3. Fraser location completely missing
- **Issue:** Fraser St location had only one stale unconfirmed placeholder (ID 2506)
- **Fix:** Added 32 confirmed sessions across all age groups and available camp weeks
- Note: Skipped sessions marked "Cancelled" on the Amilia registration platform:
  - Camp C Ages 3-5 (Cancelled at Fraser)
  - Camp I Ages 3-5 (Cancelled at Fraser)

### 4. Point Grey location — only stale placeholder, no real sessions
- **Issue:** ID "little-kitchen-pg-1" was a generic unconfirmed placeholder with no dates or costs
- **Fix:** Added 35 confirmed sessions for all 12 camp weeks across 3 age groups
- Note: Camp K Ages 9-12 not listed at Point Grey (only 11 sessions for 9-12)
- Note: Point Grey prices are $529 (vs $520 at NV/Fraser) and $429 for Camp C (4-day week)
- Note: Point Grey's Camp L uses "Handheld Favourites" (Canadian spelling) per their listing

### 5. Stale unconfirmed records
- ID 2506 ("Kids Cooking Camp"): no dates, cost null, Fraser St — marked Completed
- ID "little-kitchen-pg-1" ("Little Kitchen Academy (Point Grey)"): no dates, cost null — marked Completed

---

## Price Verification

All prices confirmed from live Amilia registration platform (verified 2026-04-04):
- NV standard: $520 ✓
- Fraser standard: $520 ✓
- PG standard: $529 ✓
- 4-day weeks: $415-416 (NV/Fraser), $429 (PG Camp C)

## Enrollment Status
- All sessions verified as "Available" on Amilia registration platform
- "Cancelled" sessions were not added to the database
- All new programs set to enrollmentStatus: "Open"

## Fraser 6-8 Time Variation Note
At the Fraser location, ages 6-8 alternates between morning (9am-12pm) and afternoon (12:30-3:30pm) sessions depending on which camp week. This was captured accurately in the new listings per the Amilia platform data.
