# Verification Log — City of Vancouver - Coal Harbour Cmty Centre

**Audited:** 2026-04-06
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=6&min_age=0&max_age=17&viewMode=list
**Live page count:** 173 programs (ages 0–17, in-progress/future)
**DB count after audit:** 104 programs (102 before + 2 added)

---

## Summary

Live page shows 173 programs. DB has 104 programs after fixing 4 status errors and adding 2 missing A–B programs. Gap of ~69 is largely B–Z alphabetical programs not yet visible due to virtual renderer limitation, plus birthday party venue rental slots (8+ visible, all excluded per policy).

**Status fixes:** IDs 1426–1429 had `Full/Waitlist` but `registrationDate: 2026-04-08` — registration not yet open. All corrected to "Coming Soon".

---

## Fixes Applied This Audit

| ID | Name | Field | Old | New | Reason |
|----|------|-------|-----|-----|--------|
| 1426 | Amusement Parks Camp | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08 |
| 1427 | Architecture Around the World Camp with Petit Architect | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08 |
| 1428 | Cartooning & Illustration Summer Camp | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08 |
| 1429 | Dream House Camp with Petit Architect | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08 |

---

## Programs Added This Audit (2)

| ID | Name | Dates | Time | Ages | Cost | Status |
|----|------|-------|------|------|------|--------|
| COV-600236 | Asian Pop / KPOP / Jazz Funk / Hip Hop Dance (6-9 yrs) | Apr 5–Jun 28, 2026 | Sun 2:45–3:45 PM | 6–9 | $208 | Open (10) |
| COV-600238 | Asian Pop / KPOP / Jazz Funk / Hip Hop Dance (9-15 yrs) | Apr 5–Jun 28, 2026 | Sun 3:45–4:45 PM | 9–15 | $208 | Open (9) |

---

## Spot-Checks

### Asian Pop / KPOP Dance (6-9 yrs) — COV-600236 (display #603158)
- **Dates:** Apr 5–Jun 28, 2026 (Sun), 13 sessions ✓
- **Time:** 2:45–3:45 PM ✓
- **Age:** 6 to <10 (ageMax=9) ✓
- **Cost:** $208 ✓
- **Status:** Open (10 openings, reg opened Mar 10, 2026) ✓
- **Instructor:** ILLUMA Studio ✓
- **Note:** Program already started; pro-rated enrolment accepted ✓

### Asian Pop / KPOP Dance (9-15 yrs) — COV-600238 (display #603160)
- **Time:** 3:45–4:45 PM ✓
- **Age:** 9 to <16 (ageMax=15) ✓
- **Cost:** $208 ✓
- **Status:** Open (9 openings) ✓

---

## Programs Excluded

| Program | Reason |
|---------|--------|
| COV-605992 (Beginner Theatre) | Cancelled — "Cancelled as of Mar 7, 2026" confirmed on detail page |
| Birthday Party slots (×8+) | Venue rental — excluded per policy |

---

## Notes

- Virtual renderer: only A–B programs visible (~12 real programs + birthday parties). C–Z needs follow-up.
- 173 live programs include birthday party slots and adult-only programs.
- Amusement Parks Camp (ID 1426) = COV-612888; Architecture Camp (ID 1427) = COV-607837 (confirmed by date match).
- KPOP dance classes by ILLUMA Studio: same instructor as Active French Immersion at Sunset CC.
- Coal Harbour already had good pre-audit coverage (102 programs, 48 already marked Coming Soon correctly).
