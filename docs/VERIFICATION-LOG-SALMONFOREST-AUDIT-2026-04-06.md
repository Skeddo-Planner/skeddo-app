# Verification Log — Salmon Forest

**Audited:** 2026-04-06
**Queue entry:** Rank 179
**Source URLs verified:**
- `https://www.salmonforest.ca/services-6-1` (Seasonal CAMP — all summer details, schedule, price, ages)
- `https://www.salmonforest.ca/prod-days` (Pro-D Days — date, price, ages, capacity)
**DB count before audit:** 16,194 programs
**DB count after audit:** 16,194 (0 added, 7 corrected)

---

## Summary

DB data was mostly accurate. The summer camp week names, dates, times, price ($415/week), and registration dates all matched the provider page. Main fix: Pro-D Day `ageMax` was set to 8 (K-Grade 3) but the provider page now says "Kindergarten to Grade 5" for 2026 — updated to 11. Added `costNote` to all 7 entries (missing previously).

---

## Confirmed Program Details

| Field | Value |
|-------|-------|
| Address | 12 Mossom Creek Dr, Port Moody, BC V3H 2X3 (Mossom Creek Hatchery) |
| Coordinates | 49.2897, -122.8539 |
| Summer camp hours | 9:00 AM – 3:00 PM |
| Ages | Kindergarten to Grade 5 (ages 5-11) — new for 2026 (was K-Grade 3) |
| Group size | Max 16 children, 1:8 ratio |
| Price | $415 + GST / week |
| Pro-D Day price | $85/child ($10 off each additional sibling) |
| Pro-D Day date | Friday, April 24, 2026 |
| Cancellation policy | Full refund if cancelled 1+ month before start (minus $30 admin fee); no refund within 1 month |

---

## Summer 2026 Schedule (all weeks confirmed)

| Week | Dates | Theme | DB ID | DB Status |
|------|-------|-------|-------|-----------|
| 1 | Jul 6-10 | Forest Explorers | salmon-forest-w1 | Coming Soon ✓ |
| 2 | Jul 13-17 | Salmon & Water Guardians | salmon-forest-w2 | Coming Soon ✓ |
| 3 | Jul 20-24 | Wildlife Detectives | salmon-forest-w3 | Coming Soon ✓ |
| 4 | Aug 3-7 | Wilderness Survival | salmon-forest-w4 | Coming Soon ✓ |
| 5 | Aug 10-14 | Plants & Forest Medicine | salmon-forest-w5 | Coming Soon ✓ |
| 6 | Aug 17-21 | Woodworkers 101 | salmon-forest-w6 | Coming Soon ✓ |

**Note on Week 4 (Aug 3-7):** BC Day is Monday Aug 3, 2026. Provider explicitly lists Aug 3 as the start of this week on their website — they appear to run camp on BC Day.

---

## Registration Details

| Phase | Date |
|-------|------|
| Returning families | March 30, 2026 at 8:00 AM (already opened) |
| Public registration | April 7, 2026 at 8:00 AM (tomorrow as of audit date) |

Status "Coming Soon" with `registrationDate: 2026-04-07` is correct for all 6 summer weeks.

---

## Registration URLs (JotForm)

| Program | URL |
|---------|-----|
| Summer camps (w1-w6) | https://form.jotform.com/260805878160260 |
| Pro-D Day | https://form.jotform.com/260614859254261 |

Both URLs confirmed on provider pages.

---

## Age Range Update

The 2026 summer camp page explicitly states:

> "We are now welcoming children from Kindergarten to Grade 5."

Previously the program accepted K-Grade 3 (ageMax=8). Both the summer camp page and Pro-D Day page now list "Kindergarten to Grade 5" (ageMax=11) as the target range for 2026.

- Summer camp DB IDs (w1-w6) already had ageMax=11 ✓
- Pro-D Day (salmon-forest-proday-1): ageMax corrected 8 → 11

---

## Fixes Applied

| Field | Old | New | Affected IDs |
|-------|-----|-----|-------------|
| ageMax | 8 | 11 | salmon-forest-proday-1 |
| costNote | missing | Added (see notes above) | All 7 |
| priceVerified | unset/false | true | All 7 |
| description | missing/outdated | Updated with accurate details | All 7 |

---

## Notes

- Provider runs nature-based forest school camps at Mossom Creek Hatchery (a salmon hatchery in Port Moody)
- "Guest specialists" planned for some weeks in 2026 — unique feature not noted in DB
- Pro-D Day has sibling discount: $10 off each additional sibling
- No issues with the summer camp week data — all 6 weeks in DB match the provider schedule exactly
- Provider FAQ still references "Kindergarten to Grade 3" in some places but main program text says K-Grade 5 for 2026
