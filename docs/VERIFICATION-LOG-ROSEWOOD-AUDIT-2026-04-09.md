# Verification Log — Rosewood Hunters & Jumpers

**Audited:** 2026-04-09
**Queue entry:** Rank 212
**Source URLs verified (browser navigation):**
- `https://rosewoodhj.com/2026-summer-riding-camps` (5 weeks, AM/PM/Full Day options)
- `https://rosewoodhj.com/2026-spring-riding-camps` (2 weeks, Completed)
- `https://rosewoodhj.com/pro-d-day-riding-camps` (May 18 upcoming)
**DB count before audit:** 16,291 programs
**DB count after audit:** 16,309 (18 added, 4 corrected)

---

## Summary

DB had 4 generic entries with wrong dates (Jul 6-10, 13-17, 20-24, 27-31 — only 2 match actual sessions), wrong address (6926→6269 Carrington St), wrong ages (5-14→4-14 for summer), no cost. Provider offers 5 summer weeks with AM/PM/Full Day options (15 sessions), 2 spring break weeks (6 sessions, Completed), and Pro-D day camps. Existing entries remapped and corrected. 18 new entries added. Provider shows 22 total camp sessions; DB now has 22.

---

## Summer Camps (browser-verified, ages 4-14)

| ID | Session | Time | Cost |
|----|---------|------|------|
| 431 | Week 1 AM: Jun 29-Jul 3 | 9:00am-12:00pm | $399+GST |
| rosewood-summer-w1-pm | Week 1 PM: Jun 29-Jul 3 | 12:30pm-3:30pm | $399+GST |
| rosewood-summer-w1-full | Week 1 Full: Jun 29-Jul 3 | 9:00am-3:30pm | $699+GST |
| 432 | Week 2 AM: Jul 13-17 | 9:00am-12:00pm | $399+GST |
| rosewood-summer-w2-pm | Week 2 PM: Jul 13-17 | 12:30pm-3:30pm | $399+GST |
| rosewood-summer-w2-full | Week 2 Full: Jul 13-17 | 9:00am-3:30pm | $699+GST |
| 433 | Week 3 AM: Jul 27-31 | 9:00am-12:00pm | $399+GST |
| rosewood-summer-w3-pm | Week 3 PM: Jul 27-31 | 12:30pm-3:30pm | $399+GST |
| rosewood-summer-w3-full | Week 3 Full: Jul 27-31 | 9:00am-3:30pm | $699+GST |
| 434 | Week 4 AM: Aug 10-14 | 9:00am-12:00pm | $399+GST |
| rosewood-summer-w4-pm | Week 4 PM: Aug 10-14 | 12:30pm-3:30pm | $399+GST |
| rosewood-summer-w4-full | Week 4 Full: Aug 10-14 | 9:00am-3:30pm | $699+GST |
| rosewood-summer-w5-am | Week 5 AM: Aug 24-28 | 9:00am-12:00pm | $399+GST |
| rosewood-summer-w5-pm | Week 5 PM: Aug 24-28 | 12:30pm-3:30pm | $399+GST |
| rosewood-summer-w5-full | Week 5 Full: Aug 24-28 | 9:00am-3:30pm | $699+GST |

## Spring Break Camps (Completed, ages 4-16)

| ID | Session | Time | Cost |
|----|---------|------|------|
| rosewood-spring-w1-am | Week 1 AM: Mar 16-20 | 9:00am-12:00pm | $399+GST |
| rosewood-spring-w1-pm | Week 1 PM: Mar 16-20 | 12:30pm-3:30pm | $399+GST |
| rosewood-spring-w1-full | Week 1 Full: Mar 16-20 | 9:00am-3:30pm | $699+GST |
| rosewood-spring-w2-am | Week 2 AM: Mar 23-27 | 9:00am-12:00pm | $399+GST |
| rosewood-spring-w2-pm | Week 2 PM: Mar 23-27 | 12:30pm-3:30pm | $399+GST |
| rosewood-spring-w2-full | Week 2 Full: Mar 23-27 | 9:00am-3:30pm | $699+GST |

## Pro-D Day Camp

| ID | Date | Time | Cost |
|----|------|------|------|
| rosewood-prod-may18 | May 18 | 9:00am-3:00pm | $169+GST |

---

## Corrections Applied (IDs 431-434)

| Field | Old | New |
|-------|-----|-----|
| address | 6926 Carrington St | 6269 Carrington St |
| ageMin | 5 | 4 |
| ageMax | 14 (summer page says 4-14) | 14 |
| cost | null | $399 (half day) |
| startDate/endDate | Jul 6-10, 13-17, 20-24, 27-31 | Jun 29-Jul 3, Jul 13-17, Jul 27-31, Aug 10-14 |
| registrationUrl | /pro-d-day-riding-camps | /2026-summer-riding-camps |
| lat/lng | 49.2135/-123.036 | 49.2160/-123.1890 |

---

## Notes

- Address: 6269 Carrington Street, Vancouver, BC (Southlands)
- Max 15 campers per session
- Beginner riders only; no cantering or jumping
- ASTM-approved helmet mandatory
- Early bird: 10% off summer if booked before Feb 1
- No refunds; credits available for future camps/lessons
- Also offers: Tiny Trotters, Pony Rides, Lessons & Training (not camps)
- Birthday parties excluded per standing rule
