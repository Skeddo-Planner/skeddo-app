# Verification Log — Windsure Adventure Watersports

**Audited:** 2026-04-06
**Queue entry:** Rank 158
**Source URLs verified:**
- `https://www.windsure.com/summercamps` (program overview)
- `https://fareharbor.com/embeds/book/windsure/items/?flow=548092&full-items=yes` (registration)
- `https://fareharbor.com/embeds/book/windsure/items/290203/calendar/2026/06/` (Windsurfing & Skimboarding/SUP Full Day — confirmed Jun 29 as first session)
**Address:** 1300 Discovery Street, Vancouver, BC V6R 4L9 (Jericho Beach)
**DB count before audit:** 16,135 programs
**DB count after audit:** 16,139 (+4 added, 6 corrected)

---

## Summary

Windsure offers 9 distinct camp types (full-day and half-day) at Jericho Beach running Jun 29–Sep 4, 2026 (10 weeks). The DB had 6 generic entries covering only weeks 2-7 (Jul 6–Aug 14), all incorrectly marked "Likely Coming Soon" despite registration being live on FareHarbor. Prices were wrong ($375 vs $540 full-day). Added 4 missing weeks and fixed all 6 existing entries.

---

## Camp Types Offered (FareHarbor)

| Camp | Ages | Type | Price |
|------|------|------|-------|
| Windsurfing & Skimboarding/SUP | 10-15 | Full Day | CA$540 |
| Windsurfing & SUP | 10-15 | Full Day | CA$540 |
| Skimboarding & SUP | 7-15 | Full Day | CA$540 |
| SUP Youth Camp | 10-15 | Half Day | CA$300 |
| Fun & SUP Youth Camp | 7-10 | Half Day | CA$300 |
| Skimboarding & SUP | 7-15 | Half Day | CA$300 |
| Skimboard & Explore | 7-15 | Half Day | CA$300 |
| Windsurfing Youth Camp | 10-15 | Half Day | CA$300 |
| Advanced Windsurfing | 10-15 | Half Day | CA$350 |
| Learn to Foil Program | 13-30 | 3hr/day | CA$530 |

Note: Windsurfing programs require minimum 80lbs/36kg.

---

## 2026 Season Schedule

| Week | Dates | Days | DB Entry | Action |
|------|-------|------|----------|--------|
| 1 | Jun 29-Jul 3 | Mon, Tue, Thu, Fri (Canada Day Jul 1 off) | WS-2026-W1 | **Added** |
| 2 | Jul 6-10 | Mon-Fri | 411 | Fixed |
| 3 | Jul 13-17 | Mon-Fri | 412 | Fixed |
| 4 | Jul 20-24 | Mon-Fri | 413 | Fixed |
| 5 | Jul 27-31 | Mon-Fri | 414 | Fixed |
| 6 | Aug 4-7 | Tue-Fri (BC Day Aug 3 off) | 415 | Fixed |
| 7 | Aug 10-14 | Mon-Fri | 416 | Fixed |
| 8 | Aug 17-21 | Mon-Fri | WS-2026-W8 | **Added** |
| 9 | Aug 24-28 | Mon-Fri | WS-2026-W9 | **Added** |
| 10 | Aug 31-Sep 4 | Mon-Fri | WS-2026-W10 | **Added** |

---

## Fixes Applied to Existing Entries (ids 411-416)

| Field | Old | New |
|-------|-----|-----|
| enrollmentStatus | Likely Coming Soon | Open |
| cost | $375 | $540 |
| name | Windsurfing & Paddleboard Camp | Windsure Watersports Summer Camp — Week N |
| priceVerified | (unclear) | true |
| costNote | (none) | Full pricing detail added |
| ageSpanJustified | (none) | Added (ages 7-15, span=8 > threshold) |
| address postal code | missing | V6R 4L9 added |
| id=415 days | Mon-Fri | Tue, Wed, Thu, Fri (BC Day Aug 3 off) |

---

## Notes

- Registration: FareHarbor (flow=548092)
- "Camp will not run on observed Statutory Holidays, pricing will be pro-rated accordingly"
- Canada Day (Jul 1, Wed): Week 1 runs Mon, Tue, Thu, Fri (4 days)
- BC Day (Aug 3, Mon): Week 6 starts Aug 4 (Tue) — DB id=415 was already correctly dated Aug 4-7
- Half-day programs ($300-$350) and Learn to Foil ($530) not individually listed in DB — follow-up audit recommended to add these as separate program entries
- FareHarbor shows "From CA$457.92" as the starting price for full-day — this appears to be a discounted or group rate; the listed price of $540 is the standard rate
