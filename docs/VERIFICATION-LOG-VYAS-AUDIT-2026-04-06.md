# Verification Log — Vancouver Young Actors School (VYAS)

**Audited:** 2026-04-06
**Queue entry:** Rank 199
**Source URLs verified (browser navigation):**
- `https://vancouveryoungactorsschool.com/acting-class-descriptions/camps/` (full schedule, locations, times, pricing, MindBody registration links confirmed)
**DB count before audit:** 16,262 programs
**DB count after audit:** 16,266 (4 added, 20 corrected)

---

## Summary

3 locations confirmed for Summer 2026: Vancouver, North Vancouver, and Port Coquitlam (POCO). All camps run Mon-Fri 9:00 AM–2:30 PM at $499/week.

Vancouver entries (657-660) had wrong ageMin (4 instead of 8) — only Week 4 Jul 27-31 offers a 4-7yr section; Weeks 1-3 are 8-17yr only. Names updated to include location context. RegistrationUrls updated to specific MindBody session links (prodId per week). 4 missing Vancouver sessions added (Weeks 4 4-7yr, 5, 6, 7).

North Vancouver entries (16150-16157) had time format inconsistencies ("09:00"/"14:30" instead of "9:00 AM"/"2:30 PM"). Normalized to match standard format.

POCO location (8 sessions) intentionally NOT added — the address is not published on the camps page and could not be verified.

---

## Full 2026 Program Schedule

### Vancouver (210-112 East 3rd Avenue, Vancouver, BC)

| ID | Program | Ages | Dates | Status |
|----|---------|------|-------|--------|
| 657 (corrected) | Summer Camp Week 1 - Vancouver (Ages 8-17) | 8-17 | Jul 6-10 | Open |
| 658 (corrected) | Summer Camp Week 2 - Vancouver (Ages 8-17) | 8-17 | Jul 13-17 | Open |
| 659 (corrected) | Summer Camp Week 3 - Vancouver (Ages 8-17) | 8-17 | Jul 20-24 | Open |
| 660 (corrected) | Summer Camp Week 4 - Vancouver (Ages 8-17) | 8-17 | Jul 27-31 | Open |
| 613435 (**NEW**) | Summer Camp Week 4 - Vancouver (Ages 4-7) | 4-7 | Jul 27-31 | Open |
| 613436 (**NEW**) | Summer Camp Week 5 - Vancouver (Ages 8-17) | 8-17 | Aug 10-14 | Open |
| 613437 (**NEW**) | Summer Camp Week 6 - Vancouver (Ages 8-17) | 8-17 | Aug 17-21 | Open |
| 613438 (**NEW**) | Summer Camp Week 7 - Vancouver (Ages 8-17) | 8-17 | Aug 24-28 | Open |

### North Vancouver (#201-50 Fell Ave, North Vancouver, BC)

| ID | Dates | Ages | Status |
|----|-------|------|--------|
| 16150 (corrected) | Jul 6-10 | 8-17 | Open |
| 16151 (corrected) | Jul 13-17 | 8-17 | Open |
| 16152 (corrected) | Jul 20-24 | 8-17 | Open |
| 16153 (corrected) | Jul 27-31 | 8-17 | Open |
| 16154 (corrected) | Aug 17-21 | 4-7 | Open |
| 16155 (corrected) | Aug 10-14 | 8-17 | Open |
| 16156 (corrected) | Aug 17-21 | 8-17 | Open |
| 16157 (corrected) | Aug 24-28 | 8-17 | Open |

### Port Coquitlam — NOT in DB (address unverified)

8 sessions visible on the camps page but physical address not published. Cannot add without verified address.

---

## Corrections Applied

| Field | Old | New | IDs |
|-------|-----|-----|-----|
| ageMin | 4 | 8 | 657, 658, 659, 660 |
| name | "Summer Camp Week X" | "Summer Camp Week X - Vancouver (Ages 8-17)" | 657, 658, 659, 660 |
| registrationUrl | generic | specific MindBody prodId links | 657, 658, 659, 660 |
| startTime | "09:00" | "9:00 AM" | 16150-16157 |
| endTime | "14:30" | "2:30 PM" | 16150-16157 |
| costNote | — | Verified $499/week, 9:00 AM-2:30 PM | all |
| ageSpanJustified | — | Single program 8-17, no sub-band registrations | 657-660, 16150-16157, 613436-613438 |

---

## Pricing Confirmed

- $499 per week, all locations
- Mon-Fri, 9:00 AM – 2:30 PM
- No age-based pricing difference between 4-7yr and 8-17yr sessions

---

## Notes

- POCO location: 8 sessions observed (Jul 6-10, Jul 13-17, Jul 20-24, Jul 27-31 for 8-17yr; Jul 27-31 for 4-7yr; Aug 10-14, Aug 17-21, Aug 24-28 for 8-17yr) — address not published on camps page, not added to DB
- Registration via MindBody (clients.mindbodyonline.com, studioid=34640)
- ageSpanJustified added for 8-17yr entries: VYAS registers by week/location, not by age sub-group
