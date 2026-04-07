# Verification Log — FDT Academy Debate Camps

**Audited:** 2026-04-06
**Queue entry:** Rank 177
**Source URL verified:**
- `https://fdtacademy.com/debate-camps/` (times, dates, prices, programs, location)
**DB count before audit:** 16,194 programs
**DB count after audit:** 16,194 (0 added, 5 corrected)

---

## Summary

DB had 4 weekly entries (Jul 6-31) and 1 aggregate entry — all with confirmed2026=false and "Likely Coming Soon". Registration is OPEN for all summer 2026 weeks. Key errors corrected: times (missing → 11am-3pm), status (Likely Coming Soon → Open), confirmed2026 (false → true), age range correction (8-18 → 9-18 for Grade 4-12), ID 617 repurposed to cover the Jun 22-26 Speak Up! week, aggregate entry repurposed to Jul 27-31.

---

## Confirmed Program Details

| Field | Value |
|-------|-------|
| Address | #200-1916 W Broadway, Vancouver, BC (confirmed) |
| Time | 11:00 AM – 3:00 PM PST (4 hours) |
| Grades | K-12 (primary summer camp: Grades 4-12) |
| Programs | Debate, Public Speaking, Communication Exploration (Ethics Olympiad, World Scholar's Cup, Model UN, Mock Trial, Speak Up!) |
| Groups | Split by experience level and tournament needs, not age |

---

## Pricing

| Option | Price |
|--------|-------|
| 1 Day | $200 |
| 3 Days | $400 |
| 1 Week | $500 |
| 2 Weeks | $900 |
| 3 Weeks | $1,200 |
| All Access Pass (full summer) | $2,000 |

DB had cost=$500/week — **CORRECT**. Aggregate entry had cost=$800 — **WRONG** (that's the spring camp 2-week price); corrected to $500.

---

## Summer 2026 Schedule

| Week | Dates | Notes |
|------|-------|-------|
| Pre-season | Jun 22-26 | Speak Up! Only (public speaking focus) |
| 1 | Jul 6-10 | All programs |
| 2 | Jul 13-17 | All programs |
| 3 | Jul 20-24 | All programs |
| 4 | Jul 27-31 | All programs |
| *(BC Day)* | *(Aug 4-7)* | *No camp* |
| 5 | Aug 10-14 | All programs |
| 6 | Aug 17-21 | All programs |

---

## DB Coverage (5 IDs, 7 weeks)

| ID | Week | Notes |
|----|------|-------|
| 617 | Jun 22-26 | Repurposed to Speak Up! pre-season week |
| 618 | Jul 6-10 | |
| 619 | Jul 13-17 | |
| 620 | Jul 20-24 | |
| fdt-academy-1 | Jul 27-31 | Repurposed from generic aggregate |

**Not in DB:** Aug 10-14, Aug 17-21 — follow-up needed to add these 2 weeks.

---

## Fixes Applied

| Field | Old | New |
|-------|-----|-----|
| startTime/endTime | missing | 11:00 AM / 3:00 PM |
| enrollmentStatus | "Likely Coming Soon" (all) | "Open" |
| confirmed2026 | false (all) | true |
| priceVerified | unset | true |
| ageMin | 8 (IDs 617-620), 5 (fdt-academy-1) | 9 (all — Grade 4-12) |
| ageSpanJustified | missing | Added (9-year span, experience-based grouping) |
| ID 617 dates | Jul 6-10 | Jun 22-26 (Speak Up! week) |
| fdt-academy-1 cost | $800 | $500 (1 week price) |
| fdt-academy-1 dates | missing | Jul 27-31 |
| lat/lng | missing | 49.2636, -123.1519 |

---

## Notes

- FDT also runs spring and winter camps at same location/price structure
- "Bring a friend" incentive available (amount not specified on page)
- No age sub-division in registration — experience level is the differentiator
- No BC Day week (Aug 4-7) offered in summer 2026
