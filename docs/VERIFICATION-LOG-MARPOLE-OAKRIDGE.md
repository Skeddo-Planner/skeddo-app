# Verification Log — City of Vancouver - Marpole-Oakridge Cmty Centre

**Audited:** 2026-04-06
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=54&min_age=0&max_age=17&viewMode=list
**Live page count:** 376 programs (ages 0–17, in-progress/future)
**DB count after audit:** ~102 programs (88 before + 14 added)

---

## Summary

Live page shows 376 programs. DB has ~102 programs after fixing 30 status errors and adding 14 missing A–B programs. Gap of ~274 is largely C–Z alphabetical programs not yet visible due to virtual renderer limitation.

**Systemic status fix:** 29 numeric programs (IDs 1679–1711) + marpole-oakridge-cc-1 had `enrollmentStatus: 'Full/Waitlist'` but `registrationDate: 2026-04-08` — registration not yet open on 2026-04-06. All corrected to "Coming Soon".

**R46 fix:** 10 Endorphin Rush Dance/Musical Theatre camp programs (IDs 1691–1696, 1707–1709, 1711) had ageMin=6, ageMax=13 (7-year span). Added `ageSpanJustified` — these are single-bracket performing arts programs with no age-band subdivisions.

---

## Fixes Applied This Audit

| ID(s) | Field | Old | New | Reason |
|-------|-------|-----|-----|--------|
| 1679, 1680, 1681, 1683, 1685, 1687, 1688 (7) | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08 |
| 1690–1711 (22) + marpole-oakridge-cc-1 | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08 |
| 1691–1696, 1707–1709, 1711 (10) | ageSpanJustified | — | Added | R46 suppression: single-bracket age 6–13 for performing arts camps |

---

## Programs Added This Audit (14)

| ID | Name | Dates | Time | Ages | Cost | Status |
|----|------|-------|------|------|------|--------|
| COV-606890 | Badminton Lessons - Beginner I | Apr 11–Jun 27, 2026 | Sat 11:15 AM–Noon | 8–10 | $80 | Full/Waitlist |
| COV-606892 | Badminton Lessons - Beginner II | Apr 11–Jun 27, 2026 | Sat Noon–12:55 PM | 10–14 | $105 | Full/Waitlist |
| COV-606894 | Badminton Lessons - Intermediate | Apr 11–Jun 27, 2026 | Sat 12:55–1:55 PM | 10–14 | $105 | Full/Waitlist |
| COV-604967 | Basketball - DRIVE Training Academy | Apr 7–Jun 23, 2026 | Tue 3:35–4:35 PM | 6–8 | $132 | Open (5) |
| COV-604968 | Basketball - DRIVE Training Academy | Apr 9–Jun 25, 2026 | Thu 3:35–4:35 PM | 6–8 | $132 | Open (2) |
| COV-604972 | Basketball - DRIVE Training Academy | Apr 7–Jun 23, 2026 | Tue 4:35–5:50 PM | 9–12 | $165 | Open (2) |
| COV-604973 | Basketball - DRIVE Training Academy | Apr 9–Jun 25, 2026 | Thu 4:35–5:50 PM | 9–12 | $165 | Full/Waitlist |
| COV-605744 | Athletic Foundation | Apr 10–May 29, 2026 | Fri 6:15–7:15 PM | 13–17 | $120 | Open (13) |
| COV-612404 | Architecture Around the World Camp with Petit Architect | Aug 4–7, 2026 | Tue–Fri 9:15 AM–3:00 PM | 7–12 | $375 | Coming Soon |
| COV-611025 | Bowling Out Trip | Apr 17, 2026 | Fri 4:00–8:00 PM | 13–17 | $12 | Open (8) |
| COV-609960 | Brick Animation Camp | Aug 24–28, 2026 | Mon–Fri 10:00 AM–Noon | 6–12 | $175 | Coming Soon |
| COV-609709 | Byte Camp - 2D Animation on Tablet Camp | Aug 4–7, 2026 | Tue–Fri 9:15 AM–4:15 PM | 9–12 | $355 | Coming Soon |
| COV-609704 | Byte Camp - 2D Video Game Design Camp | Jul 6–10, 2026 | Mon–Fri 9:15 AM–4:15 PM | 11–14 | $410 | Coming Soon |
| COV-609716 | Byte Camp - 3D Animation Camp | Aug 24–28, 2026 | Mon–Fri 9:15 AM–4:15 PM | 11–14 | $410 | Coming Soon |

---

## Spot-Checks

### Badminton Lessons - Beginner I — COV-606890 (display #609812)
- **Dates:** Apr 11–Jun 27, 2026 (Sat), 10 sessions, no May 16 & Jun 6 ✓
- **Time:** 11:15 AM–Noon ✓
- **Age:** 8 to <11 (ageMax=10) ✓
- **Cost:** $80 ✓
- **Status:** Full/Waitlist (1 on waitlist) ✓
- **Instructor:** Raymond Wong ✓

### Badminton Lessons - Intermediate — COV-606894 (display #609816)
- **Time:** 12:55–1:55 PM ✓
- **Age:** 10–14 ✓
- **Cost:** $105 ✓
- **Status:** Full/Waitlist (6 on waitlist) ✓

### Basketball DRIVE (age 9-12, Tue) — COV-604972
- **Dates:** Apr 7–Jun 23, 2026 (Tue) ✓
- **Time:** 4:35–5:50 PM ✓
- **Cost:** $165 ✓
- **Status:** Open (2 openings) ✓

### Athletic Foundation — COV-605744 (display #608666)
- **Dates:** Apr 10–May 29, 2026 (Fri) 6:15–7:15 PM, 8 sessions ✓
- **Age:** 13+ (capped at 17 for platform) ✓
- **Cost:** $120 ✓
- **Status:** Open (13 openings) ✓

### Architecture Around the World Camp — COV-612404 (display #615326)
- **Dates:** Aug 4–7, 2026 (Tue–Fri), 4 sessions ✓
- **Time:** 9:15 AM–3:00 PM ✓
- **Age:** 7–12 ✓
- **Cost:** $375 ✓
- **Status:** Coming Soon (opens Apr 8, 2026 7:00 PM) ✓

### Arts in Motion Camp — ID 1690 (live COV-609997 / display #612919)
- **Dates:** Jul 20–24, 2026 (Mon–Fri) ✓ (confirmed match with ID 1690)
- **Cost:** $445 (confirmed via fee modal) ✓
- **Status:** Coming Soon → registration opens Apr 8 ✓ (status fix applied)

---

## Programs Excluded

| Program | Reason |
|---------|--------|
| Aftercare daycamp wk 1 (COV-609532) | Already in DB ✓ |
| Aftercare daycamp wk 2 (COV-609710) | Already in DB ✓ |
| Animal/Anime Cartoon Drawing Camp (COV-609227/609223) | Already in DB ✓ |
| Audition Prep and Performance Dance Class (COV-611757) | Already in DB ✓ |

---

## Dual-ID Pattern Confirmed

- COV-606890 (URL) = display #609812
- COV-609997 (URL) = display #612919 = same program as DB ID 1690 (Arts in Motion Camp Jul 20–24)
- COV-609532 (URL) = display #612454 (Aftercare daycamp wk 1)

---

## Notes

- Virtual renderer: only A–B programs visible (~20 items). C–Z programs need follow-up pass.
- 376 live programs include birthday party slots (excluded per policy) and adult programs.
- Basketball DRIVE: 4 sessions total (Tue/Thu × 6-8yrs/9-12yrs). All run by DRIVE Basketball.
- Badminton: all 3 levels Full. Instructor Raymond Wong. No class May 16 & Jun 6.
- Architecture Camp: Petit Architect Design For Kids Ltd. (same as "Modernism Architecture" COV-594390 already in DB, different theme).
- Bowling Out Trip: at the Commodore bowling alley. Waiver required.
- Byte Camps: 4 programs total (Foundations in AI + Introduction to Coding already in DB; 3 new added).
