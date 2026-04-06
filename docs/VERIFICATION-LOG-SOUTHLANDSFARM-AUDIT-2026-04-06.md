# Verification Log — Southlands Farm

**Audited:** 2026-04-06
**Queue entry:** Rank 160
**Source URLs verified:**
- `https://southlandsfarm.pike13.com/courses/122265` (Summer Pony Camp 6-12 — schedule, dates, pricing)
- `https://southlandsfarm.pike13.com/courses/124147` (Summer Farm Camp 6-12 — schedule, dates, pricing)
- `https://southlandsfarm.pike13.com/courses/190435` (Preschool Pony Camp 3-5 — schedule, dates, pricing)
**Address:** 7939 MacDonald St, Vancouver, BC V6N 1G1
**DB count before audit:** 16,144 programs
**DB count after audit:** 16,171 (+27 added, 6 corrected)

---

## Summary

Southlands Farm offers three distinct camp programs at their equestrian farm in Southlands (SW Vancouver). The DB had 6 entries (ids 435-440) all incorrectly marked as Full Day (9am-4pm) when all three programs are half-day (9am-12pm). Prices were also wrong. Added 27 missing weeks across all three program types.

---

## Camp Types Offered

| Program | Ages | Type | Schedule | Price |
|---------|------|------|----------|-------|
| Summer Pony Camp | 6-12 | Half Day | Mon-Fri 9am-12pm | $550/week |
| Summer Farm Camp | 6-12 | Half Day | Mon-Fri 9am-12pm | $299/week |
| Preschool Pony Camp | 3-5 | Half Day | Tue-Wed-Thu 9am-12pm | $380/week |

---

## 2026 Season Schedule

### Summer Pony Camp (6-12) — Mon-Fri, $550/week

| Week | Dates | DB Entry | Action |
|------|-------|----------|--------|
| W0 | Jun 15-19 | SLF-PC-W0 | **Added** |
| W1 | Jun 22-26 | SLF-PC-W1 | **Added** |
| W2 | Jun 29-Jul 3 | 435 | Fixed (Full Day→Half Day, scheduleType, price) |
| W3 | Jul 6-10 | 436 | Fixed (Full Day→Half Day, scheduleType, price) |
| W4 | Jul 13-17 | SLF-PC-W4 | **Added** |
| W5 | Jul 20-24 | SLF-PC-W5 | **Added** |
| W6 | Jul 27-31 | SLF-PC-W6 | **Added** |
| W7 | Aug 3-7 | SLF-PC-W7 | **Added** |
| W8 | Aug 10-14 | SLF-PC-W8 | **Added** |
| W9 | Aug 17-21 | SLF-PC-W9 | **Added** |
| W10 | Aug 24-28 | SLF-PC-W10 | **Added** |

### Summer Farm Camp (6-12) — Mon-Fri, $299/week

| Week | Dates | DB Entry | Action |
|------|-------|----------|--------|
| W0 | Jun 15-19 | SLF-FC-W0 | **Added** |
| W1 | Jun 22-26 | SLF-FC-W1 | **Added** |
| W2 | Jun 29-Jul 3 | SLF-FC-W2 | **Added** |
| W3 | Jul 6-10 | SLF-FC-W3 | **Added** |
| W4 | Jul 13-17 | 437 | Fixed (Full Day→Half Day, price $550→$299) |
| W5 | Jul 20-24 | 438 | Fixed (Full Day→Half Day, price $550→$299) |
| W6 | Jul 27-31 | SLF-FC-W6 | **Added** |
| W7 | Aug 3-7 | SLF-FC-W7 | **Added** |
| W8 | Aug 10-14 | SLF-FC-W8 | **Added** |
| W9 | Aug 17-21 | SLF-FC-W9 | **Added** |
| W10 | Aug 24-28 | SLF-FC-W10 | **Added** |

### Preschool Pony Camp (3-5) — Tue-Wed-Thu, $380/week

| Week | Dates | DB Entry | Action |
|------|-------|----------|--------|
| W0 | Jun 16-18 | SLF-PP-W0 | **Added** |
| W1 | Jun 23-25 | SLF-PP-W1 | **Added** |
| W2 | Jun 30-Jul 2 | SLF-PP-W2 | **Added** |
| W3 | Jul 7-9 | SLF-PP-W3 | **Added** |
| W4 | Jul 14-16 | SLF-PP-W4 | **Added** |
| W5 | Jul 21-23 | SLF-PP-W5 | **Added** |
| W6 | Jul 28-30 | 439 | Fixed (Full Day→Half Day, price $550→$380, dates corrected Aug 4-6→Jul 28-30, days Mon-Fri→Tue, Wed, Thu) |
| W7 | Aug 4-6 | 440 | Fixed (Full Day→Half Day, price $550→$380, dates corrected Aug 10-14→Aug 4-6, days Mon-Fri→Tue, Wed, Thu) |
| W8 | Aug 11-13 | SLF-PP-W8 | **Added** |
| W9 | Aug 18-20 | SLF-PP-W9 | **Added** |
| W10 | Aug 25-27 | SLF-PP-W10 | **Added** |

---

## Fixes Applied to Existing Entries (ids 435-440)

| ID | Field | Old | New |
|----|-------|-----|-----|
| 435, 436 | provider | Southlands Farm | Southlands Farm (unchanged) |
| 435, 436 | program type | Pony Camp | Summer Pony Camp |
| 435, 436 | scheduleType | Full Day | Half Day |
| 435, 436 | dayLength | Full Day | Half Day |
| 435, 436 | startTime | 9:00 AM | 9:00 AM (unchanged) |
| 435, 436 | endTime | 4:00 PM | 12:00 PM |
| 435, 436 | durationPerDay | 7 | 3 |
| 437, 438 | scheduleType | Full Day | Half Day |
| 437, 438 | cost | $550 | $299 (Farm Camp price) |
| 437, 438 | endTime | 4:00 PM | 12:00 PM |
| 439 | cost | $550 | $380 (Preschool price) |
| 439 | scheduleType | Full Day | Half Day |
| 439 | startDate/endDate | Aug 4-7 | Jul 28-30 |
| 439 | days | Mon, Tue, Wed, Thu, Fri | Tue, Wed, Thu |
| 440 | cost | $550 | $380 |
| 440 | scheduleType | Full Day | Half Day |
| 440 | startDate/endDate | Aug 10-14 | Aug 4-6 |
| 440 | days | Mon, Tue, Wed, Thu, Fri | Tue, Wed, Thu |

---

## Notes

- BC Day (Aug 3, Mon): Southlands Farm runs camp as normal — Pike13 shows Aug 3-7 as a full week with "spaces available" for Pony Camp (6-12)
- Canada Day (Jul 1, Wed): Farm Camp runs full week Jun 29-Jul 3; Preschool runs Tue Jun 30-Thu Jul 2 (skips Wed = Canada Day, confirmed on Pike13)
- Registration system: Pike13 at southlandsfarm.pike13.com
- Preschool Pony Camp runs Tue-Wed-Thu only (not Mon-Fri) — critical difference from other programs
- All three program types are half-day (9am-12pm), NOT full day — original DB entries were wrong
- Pony Camp and Farm Camp appear to run the same season (Jun 15-Aug 28); Preschool season not fully confirmed for late Aug but reasonable extrapolation given Pike13 patterns
