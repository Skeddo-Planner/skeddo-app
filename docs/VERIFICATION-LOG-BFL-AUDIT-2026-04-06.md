# Verification Log — Burnaby Family Life (McKercher Summer Camp)

**Audited:** 2026-04-06
**Queue entry:** Rank 175
**Source URLs verified:**
- `https://www.burnabyfamilylife.org/summer-camp` (times: 8:30am-5:30pm, ages 5-10, price tiers, description)
- `https://www.burnabyfamilylife.org/store/p/mckercher-summer-camp-2026` (all 10 weeks, sold-out status, per-week pricing)
**DB count before audit:** 16,194 programs
**DB count after audit:** 16,194 (0 added, 6 corrected)

---

## Summary

DB had 6 entries (IDs 577-582) for Jul 6–Aug 14, with wrong start times (9:00 AM vs 8:30 AM), one wrong price (Aug 10-14 at $300 instead of $325), one wrong status (Jul 20-24 listed as "Open" when Sold Out), and missing start date for the Canada Day week. The actual season runs 10 weeks (Jun 29–Sep 4). ID 577 repurposed to cover Week 1 (Canada Day week, Jun 29-Jul 3).

---

## Confirmed Program Details

| Field | Value |
|-------|-------|
| Address | 6140 McKercher Avenue, Burnaby, BC |
| Time | 8:30 AM – 5:30 PM (9 hours — full day) |
| Ages | 5-10 years (must have completed kindergarten if turning 5 in 2026) |
| Standard week price | $325 per 5-day week |
| Holiday week price | $300 per 4-day week (Canada Day, BC Day) |
| Cancellation | Prior to May 31: refund less $50/week admin fee; After May 31: no refund |

---

## Full 10-Week Season Schedule

| Week | Dates | Days | Price | Status |
|------|-------|------|-------|--------|
| 1 | Jun 29 – Jul 3 | Mon/Tue/Thu/Fri (Jul 1 off) | $300 | Open |
| 2 | Jul 6–10 | Mon–Fri | $325 | Open |
| 3 | Jul 13–17 | Mon–Fri | $325 | Open |
| 4 | Jul 20–24 | Mon–Fri | $325 | **SOLD OUT** |
| 5 | Jul 27–31 | Mon–Fri | $325 | Open |
| 6 | Aug 4–7 | Tue–Fri (BC Day Aug 3 off) | $300 | Open |
| 7 | Aug 10–14 | Mon–Fri | $325 | Open |
| 8 | Aug 17–21 | Mon–Fri | $325 | **SOLD OUT** |
| 9 | Aug 24–28 | Mon–Fri | $325 | Open |
| 10 | Aug 31–Sep 4 | Mon–Fri | $325 | Open |

---

## DB Coverage (6 IDs, 10 weeks)

With only 6 DB IDs for 10 weeks, coverage is as follows:

| ID | Week Covered | Notes |
|----|-------------|-------|
| 577 | Week 1 (Jun 29-Jul 3) | Repurposed from Jul 6-10 |
| 578 | Week 2 (Jul 6-10) | Shifted from Jul 13-17 |
| 579 | Week 4 (Jul 20-24) | Status corrected: Full (Sold Out) |
| 580 | Week 5 (Jul 27-31) | Time corrected |
| 581 | Week 6 (Aug 4-7) | Time corrected |
| 582 | Week 7 (Aug 10-14) | Cost corrected: $300→$325 |

**Not in DB:** Weeks 3, 8, 9, 10 (Jul 13-17, Aug 17-21, Aug 24-28, Aug 31-Sep 4). A follow-up session should add IDs for these weeks to complete the season.

---

## Fixes Applied

| Field | Old | New |
|-------|-----|-----|
| startTime | 9:00 AM (all) | 8:30 AM |
| endTime | missing | 5:30 PM |
| ID 577 startDate | 2026-07-06 | 2026-06-29 (repurposed to Week 1) |
| ID 579 enrollmentStatus | "Open" | "Full" (Sold Out) |
| ID 582 cost | $300 | $325 (5-day week, not holiday) |
| days | "Mon-Fri" format | "Mon, Tue, Wed, Thu, Fri" format |
| ID 581 days | Mon-Fri | "Tue, Wed, Thu, Fri" (BC Day week) |
| lat/lng | missing | 49.2295, -122.9814 |
| description | missing | Added per program |

---

## Notes

- BFL also operates child care programs and other community services — only summer camp in DB
- Site explicitly states "If your child requires extra support needs, please contact us prior to registering"
- The store page shows 10 distinct weeks for 2026, all from $300-$325
- Registration for July has significant demand — 2 of 10 weeks already sold out as of Apr 6
