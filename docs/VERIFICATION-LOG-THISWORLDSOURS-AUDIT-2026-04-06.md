# Verification Log — This World's Ours Centre

**Audited:** 2026-04-06
**Queue entry:** Rank 197
**Source URLs verified (browser navigation):**
- `https://www.thisworldsours.com/camps` (summer camp schedule, times, registration date confirmed)
**DB count before audit:** 16,254 programs
**DB count after audit:** 16,260 (6 added, 4 corrected)

---

## Summary

4 existing entries corrected and 6 missing sessions added. Summer 2026 registration opens April 15, 2026 at 9am (9 days from audit date → R8 status = "Coming Soon"). Name corrected from "Arts & Life Skills Camp" to "Social Skills Camp" (provider's own term). Cost $275 was unverified — pricing not publicly listed, set to null. DB only had weeks 2-5 (Jul 6-31); the full schedule includes 10 weeks from Jun 29 through Sep 4.

---

## Full 2026 Summer Schedule

| ID | Week | Dates | Notes |
|----|------|-------|-------|
| 613427 (**NEW**) | Week 1 | Jun 29-Jul 3 | 4-day (Canada Day Jul 1 stat) |
| 641 (corrected) | Week 2 | Jul 6-10 | |
| 642 (corrected) | Week 3 | Jul 13-17 | |
| 643 (corrected) | Week 4 | Jul 20-24 | |
| 644 (corrected) | Week 5 | Jul 27-31 | |
| 613428 (**NEW**) | Week 6 | Aug 4-7 | 4-day (BC Day Aug 3 stat) |
| 613429 (**NEW**) | Week 7 | Aug 10-14 | |
| 613430 (**NEW**) | Week 8 | Aug 17-21 | |
| 613431 (**NEW**) | Week 9 | Aug 24-28 | |
| 613432 (**NEW**) | Week 10 | Aug 31-Sep 4 | |

All sessions: 9AM-4PM, Mon-Fri (or Mon-Thu for 4-day stat holiday weeks), 1:6 ratio.

---

## What's Confirmed

| Field | Status |
|-------|--------|
| Summer 2026 programming | ✅ Confirmed (10 weeks) |
| Dates | ✅ Confirmed (Jun 29-Sep 4, all 10 weeks) |
| Times (9AM-4PM) | ✅ Confirmed |
| 1:6 staff ratio | ✅ Confirmed |
| 1:1 support option (half-day) | ✅ Confirmed (at additional cost, not priced) |
| Pricing | ❌ Not publicly listed |
| Registration opens April 15 | ✅ Confirmed |

---

## Corrections Applied

| Field | Old | New | IDs |
|-------|-----|-----|-----|
| name | "Arts & Life Skills Camp" | "Social Skills Camp" | 641, 642, 643, 644 |
| confirmed2026 | false | true | 641, 642, 643, 644 |
| enrollmentStatus | Likely Coming Soon | Coming Soon | 641, 642, 643, 644 |
| registrationDate | — | 2026-04-15 | 641, 642, 643, 644 |
| cost | 275 | null | 641, 642, 643, 644 |
| ageSpanJustified | — | Provider runs single program for ages 5-18, no sub-bands | 641, 642, 643, 644 |
| costNote | — | Full explanation + contact info | 641, 642, 643, 644 |
| description | Generic | Accurate from provider page | 641, 642, 643, 644 |

---

## Notes

- Inclusive program for neurodivergent youth — no specific diagnoses required
- 1:1 support camps available at additional cost (half-day AM 9-12 or PM 1-4) — not added as separate DB entries due to pricing being unverified
- Contact: programs@thisworldsours.com
- Cancellation policy: see thisworldsours.com/camps
- Age range 5-18 justified: single program with no separate age-band registrations (ageSpanJustified added)
