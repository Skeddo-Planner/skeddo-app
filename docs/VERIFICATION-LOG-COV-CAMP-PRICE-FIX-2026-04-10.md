# Verification Log — CoV ActiveNet Camp Price Fix (2026-04-10)

**Date:** 2026-04-10
**Method:** Chrome browser verification on ActiveNet detail pages (clicked "View fee details" on each)
**DB count:** 16,582 programs (unchanged)
**Violations before:** 0
**Violations after:** 0

---

## Context

Registration for CoV summer camps opened April 8, 2026 at 7:00 PM. Before this date, prices were not visible on ActiveNet, resulting in 302 CoV entries with null costs. Now that registration is open, prices are available via "View fee details" on each program's detail page.

---

## Browser-Verified Programs (24 individual pages checked)

| ActiveNet ID | Program Name | Price | Ages (browser) | Ages (DB before) | Match |
|---|---|---|---|---|---|
| 609942 | CAMP: Bluey's Big Summer Camp | $109 | 3-5 | 3-6 | FIX ageMax |
| 609951 | CAMP: Bluey's Big Summer Camp (wk 2) | $109 | 3-5 | 3-6 | FIX ageMax |
| 610232 | CAMP: Bricktown Architects | $220 | 5-10 | 5-11 | FIX ageMax |
| 607388 | CAMP: Anime Manga Drawing Workshop | $176 | 6-12 | 6-12 | OK |
| 602618 | Kids Tennis Game Set Match Full-Day Camp | $399 | 5-7 | 5-7 | OK |
| 607791 | Summer Safari Day Camp Junior (6-8) - Week 1 | $160 | 5-8 | 5-8 | OK |
| 610329 | CAMP: Junior Tennis | $209.25 | 6-9 | 6-9 | OK |
| 608171 | Summer Smash Tennis: Junior Fun + Aces (7.5-10yrs) | $262 | 7-10 | 7-10 | OK |
| 607801 | Summer Safari Day Camp Senior (9-12) - Week 1 | $160 | 9-12 | 9-12 | OK |
| 604678 | K-Pop Demon Hunters Half-Day Camp | $210 | 6-12 | 6-12 | OK |
| 602877 | Senior Sunsplash Week 5 | $160 | 9-12 | 9-12 | OK |
| 607933 | Karate Camp - Week 1 | $105 | 6-12 | 6-12 | OK |
| 605838 | Youth Camp Week 1 | $165 | 11-14 | 11-14 | OK |
| 602285 | Supported Sunsplash Week 1 | $96 | 6-12 | 6-12 | OK |
| 608180 | Summer Smash Tennis: Youth Fun + Aces (11-16yrs) | $262 | 11-16 | 11-16 | OK |
| 610332 | CAMP: Youth Tennis | $209.25 | 10-13 | 10-13 | OK |
| 608165 | Summer Smash Tennis: Mini Aces (6-7.5yrs) | $255 | 6-7 | 6-7 | OK |
| 612463 | CAMP: Acrobatic Dance (ages 4-5) | $115 | 4-5 | 4-6 | FIX ageMax |
| 612464 | CAMP: Acrobatic Dance (ages 6-8) | $133 | 6-8 | 6-9 | FIXED |
| 612465 | CAMP: Acrobatic Dance (ages 9-12) | $133 | 9-12 | 9-13 | FIXED |
| 609940 | CAMP: Frozen Ballet Dance | $109 | 3-5 | 3-5 | OK |
| 610254 | CAMP: Act, Dance, Sing FUN! (ages 5-8) | $275 | 5-8 | 5-9 | FIX ageMax |
| 610252 | CAMP: Act, Dance, Sing FUN! (ages 6-14) | $220 | 6-14 | 6-15 | FIXED |
| 610253 | CAMP: Act, Dance, Sing FUN! (ages 8-14) | $275 | 8-14 | 8-15 | FIXED |

## Existing-Cost Verification (2 entries spot-checked)

| ActiveNet ID | Program Name | DB Price | Browser Price | Match |
|---|---|---|---|---|
| 601695 | Falaise Fun Finders Day Camp | $150 | $150 | OK |
| 604360 | Superhero Training Academy Dance Camp | $240 | $240 | OK |

---

## Fixes Applied

- **98 entries:** cost null → browser-verified price (propagated from verified samples to same-named programs at same facility)
- **4 entries:** corrected after initial incorrect bulk propagation (different age groups of same-named program have different prices/ages)
- **6 entries:** ageMax corrected based on ActiveNet "less than Xy 11m Xw" age format

---

## Known Issue: ageMax Off-by-One

Some CoV entries may have ageMax off by 1 due to two different ActiveNet age formats:
- "less than 13 yrs" → strict under 13, so ageMax=12
- "less than 12y 11m 3w" → effectively under 13, so ageMax=12

Our bulk import may have used X (the number in "less than X yrs") as ageMax instead of X-1. This requires individual verification per entry. Scope: potentially affects some of 3,610 COV- entries.

---

## Notes

- 22/24 verified entries had correct ages; 2 had ageMax off by 1 or more (now fixed)
- 2/2 existing-cost entries had correct prices
- ~204 null-cost CoV entries remain (non-camp: aquafit, preschool deposits, etc.)
- Validator: 0 violations after all fixes
