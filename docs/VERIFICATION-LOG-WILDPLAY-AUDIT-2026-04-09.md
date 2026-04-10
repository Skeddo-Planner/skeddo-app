# Verification Log — WildPlay Element Parks

**Audited:** 2026-04-09
**Queue entry:** Rank 249
**Source URLs verified (Chrome browser):**
- `https://www.wildplay.com/camps` — main camps page with all locations and schedules
- `https://book.singenuity.com/6/activity/details/1624/rates` — full-day camp booking (Maple Ridge)
- `https://book.singenuity.com/6/activity/details/3845/rates` — minis half-day booking (Maple Ridge)
- `https://book.singenuity.com/6/activity/details/1392/rates` — Pro-D Day Camp booking (Maple Ridge)
**DB count before audit:** 16,379 programs
**DB count after audit:** 16,382 (3 added, 4 corrected)

---

## Summary

7 total entries (4 corrected + 3 new Pro-D Day Camp entries). Only Maple Ridge location is in Metro Vancouver service area; Victoria and Nanaimo are on Vancouver Island. Tiered pricing verified directly from Singenuity booking system. 3 missing Pro-D Day Camp entries added.

---

## Corrections Applied

| ID | Field | Old | New |
|----|-------|-----|-----|
| 499,500,502 | cost | 425 | 425 (confirmed as Early Bird; Regular $450, Last Minute $475) |
| 499,500,502 | costNote | (basic) | Detailed tiered pricing + discount codes |
| 499,500,502 | registrationUrl | book.singenuity.com/ | book.singenuity.com/6/activity/details/1624/date |
| 501 | cost | 220 | 219.99 |
| 501 | costNote | (basic) | Detailed tiered pricing |
| 501 | registrationUrl | book.singenuity.com/ | book.singenuity.com/6/activity/details/3845/date |
| All 4 | postalCode | (missing) | V4R 2S6 |
| All 4 | activityType | Climbing | Aerial Adventure |
| All 4 | discountNote | (incomplete) | Full details with CAMP25 + AGCSP codes |

## Programs Added

| ID | Name | Dates | Cost |
|----|------|-------|------|
| 613439 | Pro-D Day Camp (Ages 7-14) — April 24 | 2026-04-24 | $79.99 (Early Bird) |
| 613440 | Pro-D Day Camp (Ages 7-14) — May 13 | 2026-05-13 | $79.99 (Early Bird) |
| 613441 | Pro-D Day Camp (Ages 7-14) — May 25 | 2026-05-25 | $79.99 (Early Bird) |

---

## Completeness Check

Provider shows on camps page:
- **Maple Ridge:** 3 summer camp weeks (10-14) + 1 minis week (5-8) + 3 Pro-D dates = **7 programs** ✓ We have 7
- **Victoria:** 3 summer weeks + 2 minis weeks + 4 Pro-D dates = 9 programs (out of service area)
- **Nanaimo:** 2 minis weeks + 2 Pro-D dates = 4 programs (out of service area)

---

## Pricing Details (from Singenuity booking)

**Full-Day Camp (Ages 10-14):**
- Early Bird: CA$425.00
- Regular: CA$450.00
- Last Minute: CA$475.00
- Monday-only try-then-buy: CA$89.99
- CAMP25 code: $25 off (register by Jun 30)
- AGCSP Season Passholder code: $25 off
- Stackable: save up to $75

**Half-Day Minis (Ages 5-8):**
- Regular: CA$219.99
- Last Minute: CA$239.99

**Pro-D Day Camp (Ages 7-14):**
- Early Bird: CA$79.99
- Regular: CA$89.99
- Last Minute: CA$99.99
- ANTIGRAVITYSP Season Passholder code: $20 off

---

## Notes

- Address: 23485 Fern Crescent, Maple Ridge, BC V4R 2S6
- Phone: 1-855-595-2251 / 250-590-7529
- Email: camps@wildplay.com
- Drop-off: 8:30-9:00 AM, Pickup: 4:30-5:30 PM
- Late pickup fees: first time <10 min free, 10-30 min $10, 30+ min $25
- Late Day Stay available until 6:30 PM (additional fee)
- Rain or shine policy — camps run in all weather
- All camps include WildPlay water bottle; full-week includes t-shirt
- No meals provided — campers bring own lunch/snacks
- Special needs accommodations available — email camps@wildplay.com
- 9-year-olds: email camps@wildplay.com for inquiry (between age groups)
