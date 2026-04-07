# Verification Log — Deep Cove Kayak

**Audited:** 2026-04-06
**Queue entry:** Rank 172
**Source URLs verified:**
- `https://deepcovekayak.com/lesson/junior-kayak-camp-level-1/` (Level 1: ages, price, dates, times)
- `https://deepcovekayak.com/lesson/junior-kayak-camp-level-2/` (Level 2: ages, price, dates, times)
- `https://deepcovekayak.com/lesson/youth-sup-camp/` (SUP: ages, price, dates, times)
- `https://deepcovekayak.com/lesson/coastal-adventure-day-camp/` (Coastal: ages, price, dates, times)
- `https://deepcovekayak.com/age/youth/` (listing page: Teen Paddle Canada $545, Youth Surfski $325)
**DB count before audit:** 16,194 programs
**DB count after audit:** 16,194 (0 added, 6 corrected)

---

## Summary

DB had 6 generic "Kids Kayak Camp" entries (IDs 417-422) for Jul 6–Aug 14 — wrong name, wrong (null) cost, wrong dates, wrong URL (pointing to a news article). Deep Cove Kayak offers 4 fully-confirmed summer camp programs plus at least 2 more on their youth listing page. All 6 existing IDs repurposed with correct program names, prices, dates, and times.

---

## Programs Confirmed

### 1. Junior Kayak Camp Level 1 — Ages 7-9

| Field | Value |
|-------|-------|
| Age | 7-9 |
| Time | 9am-12pm (AM) or 1pm-4pm (PM) — separate registration per slot |
| Price | $279 + GST (5-day), $235 + GST (4-day holiday weeks) |
| Status | Open ("ADDITIONAL SPOTS ✅") |
| URL | /lesson/junior-kayak-camp-level-1/ |
| Prereq | None |

### 2. Junior Kayak Camp Level 2 — Ages 7-9

| Field | Value |
|-------|-------|
| Age | 7-9 |
| Time | 1pm-4pm (PM only) |
| Price | $279 + GST (5-day), $235 + GST (4-day, 2 available) |
| Status | Open |
| URL | /lesson/junior-kayak-camp-level-2/ |
| Prereq | Must complete Level 1 first |

### 3. Youth SUP Camp — Ages 9-12

| Field | Value |
|-------|-------|
| Age | 9-12 |
| Time | 9am-12pm (AM only) |
| Price | $279 + GST (5-day), $235 + GST (4-day, 2 available) |
| Status | Open ("ADDITIONAL SPOTS ✅") |
| URL | /lesson/youth-sup-camp/ |
| Prereq | None |

### 4. Coastal Adventure Day Camp — Ages 10-12

| Field | Value |
|-------|-------|
| Age | 10-12 |
| Time | 9am-3pm (6 hours — full day) |
| Price | $525 + GST (5-day), $460 + GST (4-day, only 1 available) |
| Status | Open ("ADDITIONAL SPOTS ✅") |
| URL | /lesson/coastal-adventure-day-camp/ |
| Prereq | None |

### 5 & 6. Teen Paddle Canada + Youth Surfski (listing page only)

| Program | Ages | Price | Notes |
|---------|------|-------|-------|
| Teen Paddle Canada Level 1 Camp | ~13-17 | $545+GST | Listing page confirmed; program page URL not found |
| Youth Surfski Camp | 10-16 | $325+GST | Listing page confirmed; requires prior paddling experience |

These two are set to "Likely Coming Soon" with confirmed2026=false.

---

## 9-Week Season Schedule

All 4 primary programs run the same 9-week season:

| Week | Dates | Days |
|------|-------|------|
| 1 | Jun 29 – Jul 3 | Mon/Tue/Thu/Fri (Canada Day off) |
| 2 | Jul 6–10 | Mon–Fri |
| 3 | Jul 13–17 | Mon–Fri |
| 4 | Jul 20–24 | Mon–Fri |
| 5 | Jul 27–31 | Mon–Fri |
| 6 | Aug 4–7 | Tue–Fri (BC Day off) |
| 7 | Aug 11–15 | Mon–Fri |
| 8 | Aug 17–21 | Mon–Fri |
| 9 | Aug 24–28 | Mon–Fri |

---

## Fixes Applied (IDs 417–422)

| Field | Old | New |
|-------|-----|-----|
| name | "Kids Kayak Camp" (all 6) | Distinct program names per entry |
| cost | null (all 6) | $279, $279, $279, $525, $545, $325 |
| costNote | missing | Full pricing including holiday week discounts |
| startDate | 2026-07-06 | 2026-06-29 (programs start Jun 29) |
| endDate | Jul 10–Aug 14 | 2026-08-28 (season ends Aug 28) |
| startTime/endTime | missing | Set per program type |
| ageMin/ageMax | 7/14 (all) | Corrected per program (7-9, 9-12, 10-12, 10-16, 13-17) |
| registrationUrl | /lesson-news/youth-kids-camps-additional-spots/ | Program-specific pages |
| enrollmentStatus | "Open" (all) | Open (417-420), Likely Coming Soon (421-422) |
| confirmed2026 | true (all) | true (417-420), false (421-422) |
| priceVerified | unset | true (417-420), false (421-422) |
| days | "Mon-Fri" | "Mon, Tue, Wed, Thu, Fri" |
| repeating | missing | true (all 6 — weekly programs over 9-week season) |
| address | "2156 Banbury Rd, North Vancouver, BC" | Added postal code V7H 1A2 |
| lat/lng | missing | 49.3249, -122.9480 |

---

## Notes

- Deep Cove Kayak also operates at Cates Park Paddling Centre (North Vancouver) and Jericho Beach Kayak Centre (Vancouver) — separate locations not included here
- Junior Jets Surfski and Ocean Masters programs are at Cates Park — separate provider/location
- $40 non-refundable registration fee applies to all camp bookings
- D.A.R.T. Youth SUP Race Team also listed (from $230) — not added as it's a recurring club program, not a camp
- Provider shows "ALL programs have additional spots available" as of Apr 6, 2026
