# Verification Log — Vancouver All Stars Baseball

**Audited:** 2026-04-06
**Queue entry:** Rank 152
**Source URLs verified:**
- `https://vancouverallstars.ca/summer-camps/` (full 11-week schedule)
- `https://vancouverallstars.ca/prices/` (pricing)
- `https://vancouverallstars.ca/register/` (registration form — program types, hours)
**Address:** Variety Challenger Field, 4501 Clancy Loranger Way, Vancouver, BC V5Y 4B6 (Riley Park)
**DB count before audit:** 16,122 programs
**DB count after audit:** 16,127 (+5 added, 6 corrected)

---

## Summary

Vancouver All Stars Baseball offers 11 weeks of summer camps in 2026 at Variety Challenger Field. The DB had 6 entries (Weeks 3–8) with wrong times. Added 5 missing weeks and corrected all times and days.

---

## Verified Program Details

| Field | Value |
|-------|-------|
| Hours | 9:30 AM – 3:30 PM (full day) |
| Morning half-day | 9:30 AM – 12:15 PM |
| Afternoon half-day | 12:45 PM – 3:30 PM |
| Ages | 5–13 (single group, no age-band splits) |
| Program types | Baseball, Softball, Ball Foundations (AM skills only) |
| Status | Open (spaces available) |

---

## Pricing (from prices page)

| Option | Price |
|--------|-------|
| Full Week (5-day) | CA$399 |
| Weeks 1 & 7 | Prorated for actual days |
| Half Day (AM or PM, 5-day) | CA$229 |
| Drop-In Full Day | CA$85 |
| Drop-In Half Day | CA$50 |
| Half Day Addition (add PM after AM) | CA$35 |
| Before/After Care | CA$5/half-hour per child |
| Annual Registration/Uniform Fee | CA$35 |
| GST | 5% on all prices |

---

## Full 11-Week Schedule

| Week | Dates | Days | DB Entry | Action |
|------|-------|------|----------|--------|
| 1 | Jun 24–26 | Wed, Thu, Fri (3-day) | VAS-2026-W1 | **Added** |
| 2 | Jun 29–Jul 3 | Mon–Fri (Canada Day Jul 1 held) | VAS-2026-W2 | **Added** |
| 3 | Jul 6–10 | Mon–Fri | 285 | Fixed times |
| 4 | Jul 13–17 | Mon–Fri | 286 | Fixed times |
| 5 | Jul 20–24 | Mon–Fri | 287 | Fixed times |
| 6 | Jul 27–31 | Mon–Fri | 288 | Fixed times |
| 7 | Aug 4–7 | Tue–Fri (BC Day Mon Aug 3 off) | 289 | Fixed times + days |
| 8 | Aug 10–14 | Mon–Fri | 290 | Fixed times |
| 9 | Aug 17–21 | Mon–Fri | VAS-2026-W9 | **Added** |
| 10 | Aug 24–28 | Mon–Fri | VAS-2026-W10 | **Added** |
| 11 | Aug 31–Sep 4 | Mon–Fri | VAS-2026-W11 | **Added** |

---

## Fixes Applied to Existing Entries (ids 285–290)

| Field | Old | New |
|-------|-----|-----|
| startTime | 9:00 AM | 9:30 AM |
| endTime | 4:00 PM | 3:30 PM |
| costNote | (none) | Full pricing details added |
| id=289 days | Mon-Fri | Tue, Wed, Thu, Fri |

---

## Notes

- Canada Day (Jul 1): Camp IS held on July 1 per provider website ("camp will be held on Canada Day, July 1")
- BC Day (Aug 3 Mon): Camp NOT held — Week 7 runs Tue–Fri Aug 4–7
- Week 1 (Jun 24-26) cost set to $240 (approximate prorate of 3/5 × $399)
- Provider does not split by age group — same 5-13 range for all programs; skill addressed through program type and coach grouping
- Before/After Care available: 8:30 AM before, up to 5:30 PM after
- Sibling discount: $349 full day, $199 half day (all full-day weeks)
- April early registration discount: 5% off first week, 10% off additional weeks
