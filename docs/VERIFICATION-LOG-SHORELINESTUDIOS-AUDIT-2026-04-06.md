# Verification Log — Shoreline Studios

**Audited:** 2026-04-06
**Queue entry:** Rank 187
**Source URLs verified (browser navigation):**
- `https://www.shoreline-studios.com/crafting-the-actor` (summer camps — dates, ages, pricing, early bird confirmed)
- `https://www.shoreline-studios.com/sign-up` (registration form — 12 summer sessions confirmed, ongoing class list confirmed)
- `https://www.shoreline-studios.com/vancouver-acting-classes` (full class listing)
- `https://www.shoreline-studios.com/vancouver-acting-classes/c56/connecting-characters` ($320+GST)
- `https://www.shoreline-studios.com/vancouver-acting-classes/bc79/building-character` ($350+GST, ages 7-9)
- `https://www.shoreline-studios.com/vancouver-acting-classes/bc1012/building-character` ($350+GST, ages 10-12)
- `https://www.shoreline-studios.com/vancouver-acting-classes/bc1317/building-character` ($520+GST, ages 13-17)
- `https://www.shoreline-studios.com/vancouver-acting-classes/its1317/into-the-script` ($520+GST, ages 13-17)
**DB count before audit:** 16,218 programs
**DB count after audit:** 16,234 (16 added, 4 corrected)

---

## Summary

All 4 existing entries had wrong cost ($375 → $470+GST), wrong times (9AM-4PM → 9AM-2PM for junior groups; 2:30PM-7:30PM for teens), wrong combined age range (7-18 should be 3 separate groups: 7-9, 10-12, 13-17), and wrong enrollment status ("Likely Coming Soon" → "Open"). ID 90 (Jul 13-17) is not offered in summer 2026. Aug 10-14 week was missing entirely (3 entries added). 7 new ongoing youth class entries added for programs not previously in DB.

---

## Summer Camps — Crafting The Actor

**Cost:** $470/week + 5% GST = $493.50 total
**Early bird:** 20% OFF with promo code CTASUMMER20
**Registration status:** Open (active promo code visible on page)

| Age Group | Time | Sessions |
|-----------|------|---------|
| 7–9 | 9:00 AM – 2:00 PM | Jul 6-10, Jul 20-24, Jul 27-31, Aug 10-14 |
| 10–12 | 9:00 AM – 2:00 PM | Jul 6-10, Jul 20-24, Jul 27-31, Aug 10-14 |
| 13–17 | 2:30 PM – 7:30 PM | Jul 6-10, Jul 20-24, Jul 27-31, Aug 10-14 |

**NOTE: Jul 13-17 NOT offered in 2026.** Registration page lists only the 4 weeks above.

### Entries by Week and Age Group

| DB ID | Week | Ages | Status |
|-------|------|------|--------|
| 89 (corrected) | Jul 6-10 | 7-9 | Open |
| 16169 (**NEW**) | Jul 6-10 | 10-12 | Open |
| 16170 (**NEW**) | Jul 6-10 | 13-17 | Open |
| 90 (corrected) | Jul 13-17 | — | NOT offered 2026 (confirmed2026=false) |
| 91 (corrected) | Jul 20-24 | 7-9 | Open |
| 16171 (**NEW**) | Jul 20-24 | 10-12 | Open |
| 16172 (**NEW**) | Jul 20-24 | 13-17 | Open |
| 92 (corrected) | Jul 27-31 | 7-9 | Open |
| 16173 (**NEW**) | Jul 27-31 | 10-12 | Open |
| 16174 (**NEW**) | Jul 27-31 | 13-17 | Open |
| 16168 (**NEW**) | Aug 10-14 | 7-9 | Open |
| 16175 (**NEW**) | Aug 10-14 | 10-12 | Open |
| 16176 (**NEW**) | Aug 10-14 | 13-17 | Open |

---

## Ongoing Youth Classes (NEW — not previously in DB)

All classes: 6-week sessions, in-studio at 1425 Charles St, Vancouver. Times not published on public pages — contact provider for schedule.

| DB ID | Class | Ages | Days | Cost | GST Total |
|-------|-------|------|------|------|-----------|
| 16177 | Connecting Characters | 5-6 | Sun | $320 | $336 |
| 16178 | Building Character | 7-9 | Sat | $350 | $367.50 |
| 16179 | Building Character | 7-9 | Sun | $350 | $367.50 |
| 16180 | Building Character | 10-12 | Sat | $350 | $367.50 |
| 16181 | Building Character | 10-12 | Sun | $350 | $367.50 |
| 16182 | Building Character | 13-17 | Sun | $520 | $546 |
| 16183 | Into The Script | 13-17 | Sat | $520 | $546 |

---

## Fixes Applied to Existing Entries

| Field | Old | New | Affected IDs |
|-------|-----|-----|-------------|
| cost | $375 | $470 | 89, 91, 92 |
| startTime | 9:00 AM | 9:00 AM (unchanged) | 89, 91, 92 |
| endTime | 4:00 PM | 2:00 PM | 89, 91, 92 |
| ageMin | 7 | 7 | 89, 91, 92 |
| ageMax | 18 | 9 | 89, 91, 92 |
| name | "Acting for Screen Camp" | "...Ages 7-9 (Week)" | 89, 91, 92 |
| enrollmentStatus | Likely Coming Soon | Open | 89, 91, 92 |
| durationPerDay | 7 | 5 | 89, 91, 92 |
| registrationUrl | /crafting-the-actor | /crafting-the-actor (same) | 89, 91, 92 |
| costNote | "Price may vary..." | Full details with GST | 89, 91, 92 |
| priceVerified | true | true | unchanged |
| confirmed2026 | true | false | 90 (not offered) |
| costNote | — | Note that Jul 13-17 not in 2026 | 90 |

---

## Notes

- Adult acting classes (18+) not added: Audition on Camera, Into The Script (18+), Intro To Audition, Scene Study, Screen Acting Essentials — outside target demographic
- Spring series camps (Mar 16-20, Mar 23-27) are past; not added
- Session times for ongoing classes not visible on public pages — costNote directs parents to contact provider
- ID 90 retained in DB per R31 (never remove programs); marked with confirmed2026=false and note explaining it's not offered this year
