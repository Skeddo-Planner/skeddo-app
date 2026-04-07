# Verification Log — Vancouver Academy of Music (VAM)

**Audited:** 2026-04-06
**Queue entry:** Rank 188
**Source URLs verified (browser navigation):**
- `https://vancouveracademyofmusic.com/summer-programs/` (program overview — categories and 2025 brochure)
- `https://vancouveracademyofmusic.com/2026-summer-popcorn-orchestra/` (IDs 113, 114 — dates/ages/prices confirmed)
- `https://vancouveracademyofmusic.com/semester-courses/summer-musicianship-for-kids/` (IDs 115, 116 — completely wrong data found)
- `https://vancouveracademyofmusic.com/summer-musical-theatre-camps/` (new programs found)
**DB count before audit:** 16,234 programs
**DB count after audit:** 16,236 (2 added, 4 corrected)

---

## Summary

Popcorn Orchestra entries (IDs 113-114) confirmed correct — only the registrationUrl was wrong (login page → specific 2026 program page). Summer Musicianship for Kids (IDs 115-116) had completely wrong data: ages 6-18 (should be 5-7), cost $350 (should be $145), times 9AM-4PM (should be 4-5PM), and wrong dates. Two missing Summer Musical Theatre camps added.

---

## Summer Popcorn Orchestra — $510/session (CONFIRMED)

| ID | Program | Ages | Week | Time | Status |
|----|---------|------|------|------|--------|
| 113 | Music from The Avengers | 10-15 | Jul 20-24 | 10:00AM-3:00PM | Open ✓ |
| 114 | Music from Harry Potter | 7-12 | Jul 27-31 | 9:30AM-3:00PM | Open ✓ |

- Prerequisite: RCM Grade 4+ / Suzuki 3+ (Avengers); RCM Grade 1+ / Suzuki 2+ (Harry Potter)
- Registration requires a VAM account (login at vancouveracademyofmusic.com)
- Only fix: registrationUrl from login page → `/2026-summer-popcorn-orchestra/`

---

## Summer Musicianship for Kids — $145/session (MAJOR ERRORS FIXED)

| Field | DB (wrong) | Actual | IDs |
|-------|-----------|--------|-----|
| ageMin/Max | 6–18 | 5–7 | 115, 116 |
| cost | $350 | $145 | 115, 116 |
| startTime | 9:00 AM | 4:00 PM | 115, 116 |
| endTime | 4:00 PM | 5:00 PM | 115, 116 |
| ID 115 dates | Jul 20-24 | Jul 13-17 (Session I) | 115 |
| ID 116 dates | Jul 27-31 | Aug 24-28 (Session II) | 116 |
| scheduleType | Full Day | Activity (1hr/day) | 115, 116 |
| registrationUrl | login page | /semester-courses/summer-musicianship-for-kids/ | 115, 116 |

- Pricing confirmed as "$145 (26/27 Summer)" on the class page
- 1-hour daily sessions (4:00–5:00 PM Mon-Fri) — not a full-day camp
- Session I: Jul 13-17 | Session II: Aug 24-28

---

## Summer Musical Theatre Camps — $470/session (NEW)

| DB ID | Camp | Ages | Week | Time |
|-------|------|------|------|------|
| 16184 (**NEW**) | Sound of Music | 7-10 | Jul 20-24 | 9:30AM-3:00PM |
| 16185 (**NEW**) | Sound of Disney | 10-13 | Jul 27-31 | 10:00AM-3:00PM |

- Full-day conservatory-level musical theatre training
- Culminates in showcase performance
- No prior experience required
- Registration requires a VAM account

---

## Notes

- VAM summer programs page only shows 2025 brochure as PDF — 2026 individual program pages found via site search
- Registration system is VAM's own login-based platform; no external booking tool
- Other summer programs observed but not added (adult programs or specialty programs outside scope): Amati & Stradivari Players Summer Camp, Sea to Sky Chamberfest, Harp Ensemble — these merit a follow-up audit if youth eligibility confirmed
- Summer RCM Smart Start (early childhood 3-6) and Music with Friends (ages 3-6) are for pre-K age, registering as VAM student required — could be added in a follow-up
