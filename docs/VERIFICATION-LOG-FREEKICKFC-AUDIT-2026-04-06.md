# Verification Log — Free Kick FC

**Audited:** 2026-04-06
**Queue entry:** Rank 153
**Source URLs verified:**
- `https://www.freekickfc.com/our-programs/` (2026 schedule)
- `https://secure.esportsdesk.com/login.cfm?leagueID=33586&clientID=6949&regEventID=54747` (registration system)
**Address:** Shaughnessy Elementary, 4250 Marguerite St, Vancouver, BC V6J 4G3
**DB count before audit:** 16,127 programs
**DB count after audit:** 16,128 (+1 added, 2 corrected, 4 cancelled)

---

## Summary

Free Kick FC offers 3 summer camp weeks in 2026 at Shaughnessy Elementary (not 6 as the DB implied). The DB had 4 wrong weeks and the wrong address on all entries. Pricing is behind an esportsdesk login and cannot be publicly verified.

---

## 2026 Summer Camp Schedule (from freekickfc.com/our-programs)

| Week | Dates | Type | DB Entry | Action |
|------|-------|------|----------|--------|
| 1 | July 6–10 | **Half Day only** | 299 | Fixed (was Full Day) |
| 2 | July 13–17 | NOT OFFERED | 300 | Cancelled |
| 3 | July 20–24 | Full & Half Day | 301 | Fixed |
| 4 | July 27–31 | NOT OFFERED | 302 | Cancelled |
| 5 | August 4–7 | NOT OFFERED | 303 | Cancelled |
| 6 | August 10–14 | NOT OFFERED | 304 | Cancelled |
| 8 | August 31–Sep 4 | Full & Half Day | FKFC-2026-W8 | **Added** |

---

## Pricing

Pricing is NOT publicly listed on the website. Registration requires an esportsdesk.com account. The site advertises "Save $15 before May 20" suggesting early-bird pricing, but the base price is not shown. All camp entries set to `cost: null, priceVerified: false`.

Note: The separate **World Cup Summer Soccer** league program (weekly, all summer) is listed at $165 ($149 early bird before May 15). This is a distinct program from the summer camps and not reflected in the camp DB entries.

---

## Fixes Applied

| ID | Field | Old | New |
|----|-------|-----|-----|
| 299 | scheduleType | Full Day | Half Day |
| 299 | dayLength | Full Day | Half Day |
| 299 | address | Shaughnessy Elementary, Vancouver, BC | 4250 Marguerite St, Vancouver, BC V6J 4G3 |
| 299 | cost | $199 | null |
| 299 | priceVerified | true | false |
| 301 | address | Shaughnessy Elementary, Vancouver, BC | 4250 Marguerite St, Vancouver, BC V6J 4G3 |
| 301 | cost | $199 | null |
| 301 | priceVerified | true | false |
| 300, 302, 303, 304 | enrollmentStatus | Open | Cancelled |
| 300, 302, 303, 304 | cost | $199/$299 | null |

---

## Notes

- Registration system: esportsdesk.com (leagueID=33586, regEventID=54747)
- "Save $15 before May 20" is the only pricing hint visible publicly
- DB also references a separate World Cup Summer Soccer league:
  - Wednesdays: Jericho Turf, Jun 25–Aug 13, 5-6pm, ages 4-12, $165
  - Saturdays: Shaughnessy Elementary, Jul 5–Aug 23, ages 4-7 (9-10am), ages 8-12 (10-11am)
  These were not added to DB as they are ongoing weekly leagues, not day camps
- freekickfc.ca (with .ca) redirects but gave errors — correct domain is freekickfc.com
