# Verification Log — Westside Montessori Academy Summer Camp

**Audited:** 2026-04-06
**Queue entry:** Rank 163
**Source URLs verified:**
- `https://www.wmasummercamp.com/` (main page — schedule, pricing, program types)
- `https://www.cognitoforms.com/WestsideMontessoriAcademy1/WMASummerCamp` (registration form)
**Address:** 5550 Fraser Street, Unit 300, Vancouver, BC V5W 2Z4
**DB count before audit:** 16,177 programs
**DB count after audit:** 16,183 (+6 added, 6 corrected)

---

## Summary

WMA Summer Camp runs 6 weeks (Jul 6–Aug 14) at Fraser Elementary with two distinct programs: The Explorers (ages 5-7) and The Innovators (ages 8-13). The DB had 6 generic entries (ids 571-576), all marked "Likely Coming Soon" despite registration being live, with wrong price ($325 vs $450/$400), wrong start time (9:00 AM vs 8:30 AM), wrong ages (3-11), and a description referencing the Italian Cultural Centre (camp is at Fraser Elementary). Split into 12 entries (6 Explorers + 6 Innovators) and corrected all fields.

---

## Camp Details

| Field | Value |
|-------|-------|
| Season | Jul 6–Aug 14, 2026 (6 weeks) |
| Drop-off | 8:30 AM |
| Pick-up | 4:00 PM |
| Weeks 1-4, 6 | $450/week |
| Week 5 (Aug 4-7) | $400/week (4-day, BC Day Aug 3 off) |
| Registration | cognitoforms.com/WestsideMontessoriAcademy1/WMASummerCamp |

---

## Programs

| Program | Ages | Grade Range |
|---------|------|-------------|
| The Explorers | 5-7 | K-Grade 2 (starting Sept 2026) |
| The Innovators | 8-13 | Grade 3-7 (starting Sept 2026) |

---

## 2026 Schedule

| Week | Dates | Days | Cost | Explorers DB | Innovators DB |
|------|-------|------|------|-------------|----------------|
| W1 | Jul 6-10 | Mon-Fri | $450 | 571 | WMA-INV-W1 |
| W2 | Jul 13-17 | Mon-Fri | $450 | 572 | WMA-INV-W2 |
| W3 | Jul 20-24 | Mon-Fri | $450 | 573 | WMA-INV-W3 |
| W4 | Jul 27-31 | Mon-Fri | $450 | 574 | WMA-INV-W4 |
| W5 | Aug 4-7 | Tue-Fri | $400 | 575 | WMA-INV-W5 |
| W6 | Aug 10-14 | Mon-Fri | $450 | 576 | WMA-INV-W6 |

---

## Fixes Applied to Existing Entries (ids 571-576)

| Field | Old | New |
|-------|-----|-----|
| name | "Multi-Activity Camp" | "WMA The Explorers Camp — Week N (dates)" |
| enrollmentStatus | Likely Coming Soon | Open |
| cost | $325 | $450 (standard); $400 for id=575 BC Day week |
| priceVerified | false | true |
| confirmed2026 | false | true |
| startTime | 9:00 AM | 8:30 AM (drop-off time confirmed on site) |
| durationPerDay | 7 | 7.5 (8:30am-4pm) |
| ageMin | 3 | 5 (K-Grade 2) |
| ageMax | 11 | 7 (Explorers only; Innovators in new entries) |
| registrationUrl | wmasummercamp.com | cognitoforms.com/WestsideMontessoriAcademy1/WMASummerCamp |
| id=575 days | Mon-Fri | Tue, Wed, Thu, Fri (BC Day Aug 3 off) |
| description | Referenced "Italian Cultural Centre" | Fraser Elementary location, correct program description |

---

## Notes

- Camp is at Fraser Elementary (5550 Fraser St), NOT the Italian Cultural Centre — DB description was wrong
- Registration uses CognitoForms (not their own booking system)
- Both programs run same weeks/schedule/price; separated into distinct DB entries per age group
- No camps before Jul 6 or after Aug 14 — WMA operates a 6-week season only
- The Innovators (8-13): ageSpanJustified added (8-13 span = 5 years, no sub-division within program)
