# Verification Log — Evans Lake (RE-AUDIT)

**Audited:** 2026-04-09 (re-audit via Chrome browser)
**Queue entry:** Rank 239
**Source URLs verified (Chrome browser):**
- `https://evanslake.com/camp/camp-programs/` — overnight camp schedule with full pricing table
- `https://evanslake.com/camp/new-day-camp/` — day camp schedule and pricing
- `https://evanslake.campbrainregistration.com` — CampBrain registration portal (login-protected)
**DB count before audit:** 16,382 programs
**DB count after audit:** 16,398 (16 added, 8 corrected)

---

## Re-audit reason

Prior audit used WebFetch which got content but missed the Day Camp page entirely, and missed Leadership and OAK programs from the overnight camp schedule. Chrome browser captured the full registration table showing all 17 sessions (9 standard + 4 Leadership + 3 OAK) plus 8 Day Camp weeks.

---

## Completeness Check

**Overnight camps (from evanslake.com/camp/camp-programs/):**
| Camp# | Program | Our DB |
|-------|---------|--------|
| 1 | Junior Teen (10-14) $963 | **NEW** evans-lake-camp1-jt |
| 2 | Youth (8-12) $963 | evans-lake-w1 |
| 2 | Leadership A (14-16) $1077 | **NEW** evans-lake-leada-camp2 |
| 3 | Junior Teen (10-14) $963 | evans-lake-w2 |
| 3 | OAK Garibaldi + Rafting (13-16) $1167 | **NEW** evans-lake-oak-camp3 |
| 4 | Youth (8-12) $963 | evans-lake-w3 |
| 4 | Leadership B (14-16) $1077 | **NEW** evans-lake-leadb-camp4 |
| 5 | Youth (8-12) $963 | evans-lake-w4 |
| 5 | Leadership A (14-16) $1077 | **NEW** evans-lake-leada-camp5 |
| 6 | Teen (13-16) $963 | evans-lake-w5 |
| 6 | OAK Elfin Lake + Boat (13-16) $1167 | **NEW** evans-lake-oak-camp6 |
| 7 | Junior Teen (10-14) $963 | evans-lake-w6 |
| 7 | OAK Garibaldi + Zip-lining (13-16) $1167 | **NEW** evans-lake-oak-camp7 |
| 8 | Youth (8-12) $963 | evans-lake-w7 |
| 8 | Leadership B (14-16) $1077 | **NEW** evans-lake-leadb-camp8 |
| 9 | Junior Teen (10-14) $771 | evans-lake-w8 |

**Day camps (from evanslake.com/camp/new-day-camp/):**
| Week | Dates | Cost | Our DB |
|------|-------|------|--------|
| 2 | Jul 6-10 | $470 | **NEW** evans-lake-day-w2 |
| 3 | Jul 13-17 | $470 | **NEW** evans-lake-day-w3 |
| 4 | Jul 20-24 | $470 | **NEW** evans-lake-day-w4 |
| 5 | Jul 27-31 | $470 | **NEW** evans-lake-day-w5 |
| 6 | Aug 4-7 | $375 | **NEW** evans-lake-day-w6 |
| 7 | Aug 10-14 | $470 | **NEW** evans-lake-day-w7 |
| 8 | Aug 17-21 | $470 | **NEW** evans-lake-day-w8 |
| 9 | Aug 24-28 | $470 | **NEW** evans-lake-day-w9 |

**Provider shows 25 total sessions. We now have 24** (all except Family Weekends, which are not youth camps).

---

## Programs Added (16)

| ID | Name | Ages | Cost |
|----|------|------|------|
| evans-lake-camp1-jt | Junior Teen Camp (Camp 1) | 10-14 | $963 |
| evans-lake-leada-camp2 | Leadership Camp A (Camp 2) | 14-16 | $1077 |
| evans-lake-leadb-camp4 | Leadership Camp B (Camp 4) | 14-16 | $1077 |
| evans-lake-leada-camp5 | Leadership Camp A (Camp 5) | 14-16 | $1077 |
| evans-lake-leadb-camp8 | Leadership Camp B (Camp 8) | 14-16 | $1077 |
| evans-lake-oak-camp3 | OAK Adventure (Camp 3) | 13-16 | $1167 |
| evans-lake-oak-camp6 | OAK Adventure (Camp 6) | 13-16 | $1167 |
| evans-lake-oak-camp7 | OAK Adventure (Camp 7) | 13-16 | $1167 |
| evans-lake-day-w2 to w9 | Day Camp (Weeks 2-9) | 6-12 | $470 ($375 wk6) |

---

## Notes

- All prices are +GST
- Overnight camps are 6-day co-ed (Sun-Fri), except Camp 9 which is 5 days
- Day camps run 9am-3pm Mon-Fri, except Week 6 (Tue-Fri, $375)
- Day camp bus from Squamish Brennan Park: $35/week
- Camp road drop-off: free
- Late pickup fee: $100/occurrence (day camp)
- Cancellation: overnight >30 days = refund less $125; day camp >30 days = refund less $75
- OAK includes 3-day hike in Garibaldi Provincial Park + adventure activity
- Leadership is a pathway to volunteer/staff positions — extremely limited space
- Registration opened Jan 21, 2026 (overnight) and Jan 29, 2026 (day camp)
