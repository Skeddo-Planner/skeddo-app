# Verification Log — Smash Volleyball

**Audited:** 2026-04-06
**Queue entry:** Rank 190
**Source URLs verified (browser navigation):**
- `https://smashvball.com/registration/` (registration links — SportsEngine form URL confirmed)
- `https://smashvball.com/camps/` (full camp schedule — dates, locations, ages, pricing confirmed)
**DB count before audit:** 16,236 programs
**DB count after audit:** 16,248 (12 added, 4 corrected)

---

## Summary

All 4 existing entries (IDs 309-312) had fundamentally wrong data: listed as 7hr full-day camps at their gym address, but all Smash Volleyball camps are 3-hour half-day sessions at external locations (Spanish Banks West, Shaughnessy Heights United Church, Empire Field Beach Courts). Cost was null but is actually $310 + 5% GST per week ($325.50 total). ID 312 (Jul 27-31) is NOT offered in 2026. 12 sessions were missing entirely from the database.

---

## All 2026 Summer Programs

### July Outdoor Camps — Spanish Banks West Concession

| DB ID | Program | Grades | Ages | Week | Time | Price | Status |
|-------|---------|--------|------|------|------|-------|--------|
| 309 (corrected) | Skills & Games | Gr 5-10 | 10-15 | Jul 6-10 | 9AM-12PM | $310+GST | Open |
| 310 (corrected) | Skills & Games | Gr 5-10 | 10-15 | Jul 13-17 | 9AM-12PM | $310+GST | Open |
| 311 (corrected) | Skills & Games | Gr 5-10 | 10-15 | Jul 20-24 | 9AM-12PM | $310+GST | Open |
| 16188 (**NEW**) | Skills & Competition (int/adv) | Gr 7-10 | 12-15 | Jul 20-24 | 12:30-3:30PM | $310+GST | Open |

### July Indoor Camps — Shaughnessy Heights United Church (1550 W 33rd Ave)

| DB ID | Program | Grades | Ages | Week | Time | Price | Status |
|-------|---------|--------|------|------|------|-------|--------|
| 16186 (**NEW**) | Skills & Games | Gr 5-7 | 10-12 | Jul 13-17 | 9AM-12PM | $310+GST | Open |
| 16187 (**NEW**) | Skills & Games | Gr 5-7 | 10-12 | Jul 13-17 | 12:30-3:30PM | $310+GST | Open |

### August Outdoor Camps — Empire Field Beach Courts

| DB ID | Program | Grades | Ages | Week | Time | Price | Status |
|-------|---------|--------|------|------|------|-------|--------|
| 16189 (**NEW**) | Skills & Games | Gr 6-9 | 11-14 | Aug 10-14 | 9AM-12PM | $310+GST | Open |
| 16192 (**NEW**) | Skills & Games | Gr 5-9 | 10-14 | Aug 17-21 | 9AM-12PM | $310+GST | Open |

### August Indoor Camps — Shaughnessy Heights United Church

| DB ID | Program | Grades | Ages | Week | Time | Price | Status |
|-------|---------|--------|------|------|------|-------|--------|
| 16190 (**NEW**) | Skills & Games | Gr 7-8 | 12-13 | Aug 10-14 | 9AM-12PM | $310+GST | Open |
| 16191 (**NEW**) | Skills & Games | Gr 5-7 | 10-12 | Aug 10-14 | 12:30-3:30PM | $310+GST | Open |
| 16193 (**NEW**) | Skills & Competition (int/adv) | Gr 7-10 | 12-15 | Aug 24-28 | TBA | $310+GST | Open |
| 16194 (**NEW**) | Skills & Games | Gr 5-7 | 10-12 | Aug 31-Sep 4 | 9AM-12PM | $310+GST | Open |
| 16195 (**NEW**) | Skills & Games | Gr 7-8 | 12-13 | Aug 31-Sep 4 | 12:30-3:30PM | $310+GST | Open |

### Tuesday Weekly Programs — Spanish Banks West Concession

| DB ID | Program | Grades | Ages | Dates | Time | Price | Status |
|-------|---------|--------|------|-------|------|-------|--------|
| 16196 (**NEW**) | Skills & Games | Gr 5-8 | 10-13 | Jul 14-Aug 25 (Tue) | 4:15-5:45PM | $40+GST/session | Open |
| 16197 (**NEW**) | Skills & Games | Gr 7-10 | 12-15 | Jul 14-Aug 25 (Tue) | 5:45-7:15PM | $40+GST/session | Open |

Weekly program: Jul 14, 21, 28, Aug 4, 11, 18, 25. Register for 3, 5, or 7 sessions.

---

## Fixes Applied to Existing Entries

| Field | Old | New | Affected IDs |
|-------|-----|-----|-------------|
| startTime | 9:00 AM | 9:00 AM (unchanged) | 309, 310, 311 |
| endTime | 4:00 PM | 12:00 PM | 309, 310, 311 |
| durationPerDay | 7 | 3 | 309, 310, 311 |
| scheduleType | Full Day | Half Day | 309, 310, 311 |
| dayLength | Full Day | Half Day | 309, 310, 311 |
| address | 617-289 East 6th Ave | Spanish Banks West Concession | 309, 310, 311 |
| neighbourhood | Mount Pleasant | Point Grey | 309, 310, 311 |
| indoorOutdoor | Indoor | Outdoor | 309, 310, 311 |
| cost | null | 310 | 309, 310, 311 |
| priceVerified | false | true | 309, 310, 311 |
| ageMax | 16 | 15 | 309, 310, 311 |
| name | "Volleyball Summer Camp" | Specific session names | 309, 310, 311 |
| registrationUrl | /registration/ | SportsEngine form URL | 309, 310, 311 |
| confirmed2026 | true | false | 312 (not offered) |
| enrollmentStatus | Open | Likely Coming Soon | 312 (not offered) |
| costNote | "Inquire with provider" | Full details + note for 312 | All |

---

## Notes

- All camps are 3 hours; 15 min early arrival/late pickup available for supervision (free)
- Grades refer to grade entering September 2026
- "August 2025" section on provider website is believed to be a typo for "August 2026" (same REGISTER link, consistent with 2026 context)
- Aug 24-28 Skills & Competition: Location TBA as of audit date — check smashvball.com/camps/
- Empire Field Beach Courts address approximate (100 N Renfrew St area, Hastings-Sunrise) — verify with provider
- ID 312 (Jul 27-31) retained in DB per R31 with confirmed2026=false
- Financial assistance available: Athletics 4 Kids ($200/yr, Smash matches) + Jumpstart grants
- Winter Holiday Camps (Dec 28-30) not added — out of summer scope
