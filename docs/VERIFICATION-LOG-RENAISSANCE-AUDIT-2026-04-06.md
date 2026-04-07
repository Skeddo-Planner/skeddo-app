# Verification Log — Renaissance Academy Summer Wondercamps

**Audited:** 2026-04-06
**Queue entry:** Rank 176
**Source URL verified:**
- `https://renaissanceacademy.ca/summer-wondercamps-for-kids-in-richmond/` (all 9 weeks, themed camps, prices, ages, times, add-ons)
**DB count before audit:** 16,194 programs
**DB count after audit:** 16,194 (0 added, 6 corrected)

---

## Summary

DB had 6 generic "Summer Wondercamp" entries — ALL with cost=null and "Likely Coming Soon" status. Registration is OPEN as of Apr 2026 with a full 9-week lineup. Provider offers 4-10 distinct themed camps per week in two cohorts (Little Wonders 5-8, Junior Wonders 7-12). The DB was missing virtually all meaningful data.

---

## Confirmed Program Details

| Field | Value |
|-------|-------|
| Address | 12660 Gilley Rd, Richmond, BC (confirmed) |
| Core hours | 9:00 AM – 3:00 PM |
| Extended care | Before care 7:30-9am ($75/week); Aftercare 3-6pm ($110/week) |
| Hot lunch | $65/week (in-house chef, freshly prepared daily) |
| Ages | Little Wonders: 5-8 (Grade 1-2); Junior Wonders: 7-12 (Grade 3-6) |
| 5-day week price | $369-$418 (varies by themed camp) |
| BC Day week price | $310-$334 (Tue-Fri, Aug 4-7) |
| Season | 9 weeks: Jul 6 – Sep 4, 2026 |

---

## Age Group Split

DB had ageMin=5, ageMax=12 for all 6 entries — this is too broad and masks the provider's actual structure:

| Cohort | Ages | Grade | DB IDs |
|--------|------|-------|--------|
| Little Wonders | 5-8 | Grade 1-2 | 587 (season), 589 (BC Day week) |
| Junior Wonders | 7-12 | Grade 3-6 | 588 (season), 590 (BC Day week) |
| Placeholder | 5-12 | Both | 591, 592 |

---

## Sample Themed Camps by Week

### Little Wonders (Ages 5-8)
| Week | Theme | Price |
|------|-------|-------|
| 1 (Jul 6-10) | Build A Bear | $389 |
| 1 (Jul 6-10) | Huntrix Dance-A-Long | $388 |
| 1 (Jul 6-10) | Dessert Lab | $408 |
| 3 (Jul 20-24) | Cublets Robotics Lab | $418 |
| 3 (Jul 20-24) | Dino Dig | $398 |
| 5 (Aug 4-7) | Clay Creations | $310 |
| 5 (Aug 4-7) | Lego Creators | $311 |
| 6 (Aug 10-14) | Animal Trackers | $418 |
| 6 (Aug 10-14) | Kawaii Kids | $388 |
| 7 (Aug 17-21) | Ninja Warriors | $398 |
| 8 (Aug 24-28) | Biome Explorers | $418 |
| 9 (Aug 31-Sep 4) | STEM Spectacular | $398 |

### Junior Wonders (Ages 7-12)
| Week | Theme | Price |
|------|-------|-------|
| 1 (Jul 6-10) | Strange Science | $398 |
| 1 (Jul 6-10) | Gamer's Academy | $418 |
| 2 (Jul 13-17) | Cublets Robotics Lab | $418 |
| 2 (Jul 13-17) | Dessert Lab | $408 |
| 4 (Jul 27-31) | Adventure Quest | $418 |
| 4 (Jul 27-31) | Edible Art | $408 |
| 5 (Aug 4-7) | Viral Videos Jr | $310 |
| 5 (Aug 4-7) | 3D Makers Lab | $334 |
| 7 (Aug 17-21) | Biome Explorers | $418 |
| 7 (Aug 17-21) | 3D Maker's Lab | $418 |
| 8 (Aug 24-28) | Emily Carr Inspired | $388 |
| 9 (Aug 31-Sep 4) | Digital Art Explorers | $418 |

*This is a sample only — provider offers 30+ distinct themed camp sessions total across 9 weeks.*

---

## Fixes Applied (IDs 587-592)

| Field | Old | New |
|-------|-----|-----|
| names | "Summer Wondercamp" (all 6) | Distinct cohort/week names |
| cost | null (all 6) | $369 (IDs 587-588), $310 (IDs 589-590), null (placeholders) |
| costNote | missing | Full pricing explanation with add-ons and cancellation policy |
| enrollmentStatus | "Likely Coming Soon" (all) | Open (IDs 587-590), Likely Coming Soon (591-592 placeholders) |
| confirmed2026 | true (but "Likely Coming Soon") | true (IDs 587-590), false (591-592) |
| priceVerified | unset | true (IDs 587-590), false (591-592) |
| ageMin/ageMax | 5/12 (all) | 5/8 (IDs 587, 589), 7/12 (IDs 588, 590), 5/12 (placeholders) |
| startTime/endTime | missing | 9:00 AM / 3:00 PM |
| lat/lng | missing | 49.1617, -123.0889 |
| repeating | missing | true (IDs 587, 588, 591, 592 — spans >35 days) |
| description | missing | Added per program type |

---

## Notes

- Provider has 60+ distinct themed camp sessions across 9 weeks — the 6 DB IDs cannot represent all individual camps. IDs 587-590 are aggregate entries by cohort/week type; 591-592 are placeholders
- A follow-up audit should add individual themed camp entries to better represent the program variety
- No Week 1 Canada Day week (Jun 29-Jul 3) observed — season appears to start Jul 6
- The "Grade 1-2" and "Grade 3-6" designations are the provider's framing, with age ranges 5-8 and 7-12
- Extended care and hot lunch are available as paid add-ons through the registration checkout
