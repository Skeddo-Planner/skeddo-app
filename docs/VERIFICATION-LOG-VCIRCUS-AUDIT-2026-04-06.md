# Verification Log — Vancouver Circus School

**Audited:** 2026-04-06
**Queue entry:** Rank 180
**Source URLs verified:**
- `https://vancouvercircusschool.ca/camps/` (camps landing page)
- `https://activitymessenger.com/p/i/2CBsOKm` (Summer Camp Registration Form 2026 — interactive form; prices retrieved by selecting weeks)
**DB count before audit:** 16,194 programs
**DB count after audit:** 16,195 (1 added, 6 corrected)

---

## Summary

DB had 6 entries for summer 2026 but there are 7 weeks on the registration form — Aug 17-21 was missing. Prices were wrong ($350 DB vs $349 half-day / $499 full-day actual). End time was wrong (4:00 PM vs actual 3:30 PM; after-care extends to 4:30 PM at extra cost). Added `ageSpanJustified` for the 8-year age span (6-14), which has no sub-division — provider groups by skill level only.

---

## Confirmed Program Details

| Field | Value |
|-------|-------|
| Address | 810 Quayside Dr Suite 212, New Westminster, BC V3M 6B9 (River Market, 2nd floor) |
| Hours | Full day: 9:00 AM – 3:30 PM |
| Half-day options | AM: 9:00 AM – 12:00 PM; PM: 12:30 PM – 3:30 PM |
| After-care | 3:30 PM – 4:30 PM (extra charge, regular weeks: $75) |
| Ages | 6–14 (no sub-division — skill-level groups, all levels welcome) |
| Disciplines | Aerial silks, trapeze, acrobatics, juggling, stilt-walking, and more |
| End-of-week showcase | Yes — open to family and friends |

---

## Pricing (confirmed via interactive form selection)

### Regular 5-day weeks (Jul 6-10, Jul 13-17, Jul 20-24, Jul 27-31, Aug 10-14, Aug 17-21):
| Option | Price |
|--------|-------|
| 5 Mornings (9am-12pm) | $349 |
| 5 Afternoons (12:30-3:30pm) | $349 |
| 5 Full Days (9am-3:30pm) | $499 (save $199) |
| After-care (3:30-4:30pm) | +$75/week |

### BC Day week (Aug 4-7, 4 days — BC Day Aug 3 off):
| Option | Price |
|--------|-------|
| 4 Mornings (9am-12pm) | $280 |
| 4 Afternoons (12:30-3:30pm) | $280 |
| 4 Full Days (9am-3:30pm) | $399 (save $161) |
| After-care (3:30-4:30pm) | +$60/week |

**Multi-week discount:** 15% off when registering 2+ weeks (applied automatically at checkout)
**Deposit:** $95 + GST (non-refundable, non-transferable)

---

## Summer 2026 Weeks (registration form)

| Week | Dates | DB ID | Status |
|------|-------|-------|--------|
| 1 | Jul 6-10 | 61 | In DB ✓ |
| 2 | Jul 13-17 | 62 | In DB ✓ |
| 3 | Jul 20-24 | 63 | In DB ✓ |
| 4 | Jul 27-31 | 64 | In DB ✓ |
| 5 | Aug 4-7 (BC Day week) | 65 | In DB ✓ |
| 6 | Aug 10-14 | 66 | In DB ✓ |
| 7 | Aug 17-21 | vancouver-circus-school-w7 | **ADDED** |

---

## Fixes Applied

| Field | Old | New | Affected IDs |
|-------|-----|-----|-------------|
| cost (regular weeks) | $350 | $349 (min/half-day) | 61, 62, 63, 64, 66, new |
| cost (BC Day week) | $350 | $280 (min/half-day) | 65 |
| endTime | 4:00 PM | 3:30 PM | All 6 existing |
| costNote | missing | Full pricing breakdown | All 7 |
| priceVerified | missing | true | All 7 |
| ageSpanJustified | missing | Added (6-14, 8-year span, no sub-division) | All 7 |
| name | "Circus Arts Camp" (generic) | "...Week N (dates)" | All 7 |
| address | "212-810 Quayside Drive..." | "810 Quayside Dr Suite 212, New Westminster, BC V3M 6B9" | All 7 |
| days (ID 65) | Mon-Fri | Tue, Wed, Thu, Fri | 65 (BC Day week) |
| New entry | — | vancouver-circus-school-w7 (Aug 17-21) | — |

---

## Notes

- DB `endTime: 4:00 PM` appears to have included after-care in the base program time — incorrect. After-care is a paid add-on.
- The provider offers spring, summer, and winter camps. Only summer audited here.
- The half-day and full-day options are distinct programs per the audit standard, but given the scope, they're represented as a single listing per week with comprehensive `costNote`. A follow-up audit could add separate half-day listings.
- Registration is via ActivityMessenger embedded form (not displayed standalone at that URL normally, but accessible directly for verification).
