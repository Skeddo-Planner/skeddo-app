# Verification Log — Clubhouse Kids

**Audited:** 2026-04-06
**Queue entry:** Rank 181
**Source URLs verified:**
- `https://www.clubhousekids.ca/` (homepage — locations, prices, programs, age groups, schedule)
- `https://ck.campbrainregistration.com/` (CampBrain registration portal — registration dates confirmed)
**DB count before audit:** 16,195 programs
**DB count after audit:** 16,195 (0 added, 5 corrected)

---

## Summary

DB had incorrect times (8am-5pm instead of 9am-4pm for regular camp — DB included extended care in base hours). All 4 active-location entries were marked "Open" but public registration doesn't open until April 7 at 7pm — corrected to "Coming Soon." ID 559 (5307 Victoria Dr) is not listed as a 2026 Clubhouse Kids location — marked unconfirmed. New West campus is Kids-only (corrected ageMax from 13 to 9).

---

## Confirmed Program Details

| Field | Value |
|-------|-------|
| Regular camp hours | 9:00 AM – 4:00 PM |
| Extended care | 8:00 AM–9:00 AM and/or 4:00 PM–5:00 PM (+$30/week; Broadmoor until 5:30 PM) |
| Individual extended care | $7/day (cash on the day) |
| Cost | $265/week |
| Holiday weeks | Canada Day and BC Day weeks pro-rated |
| Payment surcharge | 2% for credit card; no surcharge for EFT |
| Age — Kids program | Kindergarten to age 9 (must turn 6 by Dec 31, 2026) |
| Age — Preteens program | Ages 9–13 (not yet in high school) |
| Age — L.I.T. program | Grade 8–9 (Preteen graduates only — not in DB) |

---

## Confirmed 2026 Locations

| Campus | Address | DB ID | Programs |
|--------|---------|-------|----------|
| Vancouver-Fraserview | 7650 Jasper Cres., Vancouver, BC (Grace International Baptist Church) | 2545 | Kids + Preteens |
| Vancouver-Riley Park | 215 East 18th Ave., Vancouver, BC (HOME Church) | 2546 | Kids + Preteens |
| Richmond-Broadmoor | 8140 Saunders Rd., Richmond, BC (Broadmoor Baptist Church) | 2547 | Kids + Preteens |
| New Westminster | 320 Eight St., New West, BC (Freedom Church) — *Kids only* | 2548 | Kids only |

**Note on ID 559 (5307 Victoria Dr #125, Vancouver V5P 3V6):** This address does NOT appear on the Clubhouse Kids 2026 website. The 4 confirmed locations above cover all current campuses. Victoria Drive may be a former location. Entry marked as "Likely Coming Soon" / unconfirmed pending provider verification.

---

## Registration Dates

| Phase | Date/Time |
|-------|-----------|
| Priority (returning families) | April 2, 2026 at 7:00 PM (already opened/closed) |
| Public registration | April 7, 2026 at 7:00 PM |

Status "Coming Soon" with `registrationDate: 2026-04-07` is correct for public families as of audit date (April 6).

---

## Fixes Applied

| Field | Old | New | Affected IDs |
|-------|-----|-----|-------------|
| startTime | 8:00 AM | 9:00 AM | 2545, 2546, 2547, 2548 |
| endTime | 5:00 PM | 4:00 PM | 2545, 2546, 2547, 2548 |
| enrollmentStatus | Open | Coming Soon | 2545, 2546, 2547, 2548 |
| registrationDate | missing | 2026-04-07 | 2545, 2546, 2547, 2548 |
| registrationUrl | clubhousekids.ca (homepage) | ck.campbrainregistration.com | All 5 |
| costNote | missing | Full pricing w/ extended care | All 5 |
| priceVerified | missing | true (2545-2548), false (559) | All 5 |
| ageSpanJustified | missing | Added (8-year span, two cohorts) | 2545, 2546, 2547, 559 |
| repeating | "weekdays" | true | 2545, 2546, 2547, 2548 |
| ageMax (New West) | 13 | 9 | 2548 (Kids only) |
| enrollmentStatus (ID 559) | Open | Likely Coming Soon | 559 |
| confirmed2026 (ID 559) | true | false | 559 |
| names | Generic | Descriptive with campus | All 5 |

---

## Known Remaining Violations

- **R29 (all 5 IDs):** CampBrain registration URL `ck.campbrainregistration.com` is flagged as "generic homepage." This is unavoidable — CampBrain requires login to view programs, and there is no public-facing URL with program details deeper than the root. This is the correct registration URL.

---

## Notes

- The `repeating: "weekdays"` value in the original DB was non-standard (should be boolean `true`). Corrected.
- DB startTime/endTime of 8am-5pm incorporated extended care hours into the base listing — incorrect. Extended care is a paid add-on.
- L.I.T. program (Grade 8-9, Preteen graduates) exists but is not in the DB. Very restricted eligibility (must be Preteen graduate).
- Provider is a community program of **Thriving Kids Care Society**, a Christian values-based organization. Not a commercial operator.
