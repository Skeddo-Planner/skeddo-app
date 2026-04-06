# Verification Log — City of Vancouver - Britannia Cmty Centre

**Audited:** 2026-04-05
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=38&min_age=0&max_age=17&viewMode=list
**Live page count:** 209 programs (ages 0–17, in-progress/future)
**DB count after audit:** 135 programs

---

## Summary

Live page shows 209 programs. DB has 135 programs after fixing 2 status errors and adding 5 missing programs. Gap of ~74 is largely birthday party time slots, adult-only programs (African Drumming Level 1-5, all "16 yrs+"), cancelled programs, and C–Z programs not yet visible due to virtual renderer limitation.

**Status fixes:** IDs 1393 and 2504 both had `registrationDate: 2026-04-08` but `Full/Waitlist` status — corrected to "Coming Soon" since registration hadn't opened yet.

**R46 fix:** ID 2504 (Kids Swim Lessons, age 3–16 = 13-year span) added `ageSpanJustified` — Red Cross multi-level program presented as single generic listing.

---

## Fixes Applied This Audit

| ID | Field | Old | New | Reason |
|----|-------|-----|-----|--------|
| 1393 | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08; registration not yet open |
| 2504 | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08; registration not yet open |
| 2504 | ageSpanJustified | — | Added | R46 suppression: Red Cross multi-level swim lessons, single listing covering ages 3–16 |

---

## Programs Added This Audit (5)

| ID | Name | Dates | Time | Ages | Cost | Status |
|----|------|-------|------|------|------|--------|
| COV-618299 | ABCs & 123s (4yrs) | Aug 31–Sep 4, 2026 | Mon–Fri 10:00–11:00 AM | 4 | $75 | Coming Soon (Apr 8) |
| COV-618300 | ABCs & 123s (5yrs) | Aug 31–Sep 4, 2026 | Mon–Fri 11:15 AM–12:15 PM | 5 | $75 | Coming Soon (Apr 8) |
| COV-603883 | Archery- Beginner | Apr 11–Jun 6, 2026 | Sat 2:00–3:30 PM | 12–17 | $70 | Open (9 openings) |
| COV-603887 | Archery- Intermediate | Apr 11–Jun 6, 2026 | Sat 3:45–5:00 PM | 12–17 | $70 | Open (9 openings) |
| COV-603868 | Adapted Fitness Boxing | Apr 9–Jun 11, 2026 | Thu 7:15–8:15 PM | 13–17 | $100 | Open (3 openings) |

---

## Spot-Checks (field-by-field verification)

### ABCs & 123s (4yrs) — COV-618299
- **Dates:** Aug 31–Sep 4, 2026 (Mon–Fri) ✓
- **Time:** 10:00–11:00 AM ✓
- **Age:** 4yrs ✓
- **Cost:** $75 ✓
- **Status:** Coming Soon (opens Apr 8, 2026 7:00 PM) ✓

### Archery- Beginner — COV-603883
- **Dates:** Apr 11–Jun 6, 2026 (Sat), 7 sessions (no Apr 25 or May 16) ✓
- **Time:** 2:00–3:30 PM ✓
- **Age:** 12–17 ✓
- **Cost:** $70 ✓
- **Status:** Open (9 openings) ✓

### Archery- Intermediate — COV-603887
- **Dates:** Apr 11–Jun 6, 2026 (Sat), 7 sessions (no Apr 25 or May 16) ✓
- **Time:** 3:45–5:00 PM ✓
- **Prerequisite:** Beginner Archery course ✓
- **Cost:** $70 ✓
- **Status:** Open (9 openings) ✓

### Adapted Fitness Boxing — COV-603868
- **Dates:** Apr 9–Jun 11, 2026 (Thu) ✓
- **Time:** 7:15–8:15 PM ✓
- **Age:** 13–17 ✓
- **Target:** Neurodiverse youth ✓
- **Cost:** $100 ✓
- **Status:** Open (3 openings) ✓

---

## Programs Excluded

| Program | Reason |
|---------|--------|
| African Drumming Level 1–5 (all sessions) | Age "16 yrs+" — adult programs appearing in youth search due to age overlap |
| Art Making with Jennifer — COV-599532 | Cancelled — detail page confirms "This activity has been cancelled" |
| Art Camp With Paloma — COV-608909 | Cancelled — detail page confirms "This activity has been cancelled" |
| Afterschool Latin Dance (COV-603863, 603864) | Already in DB ✓ |
| Art of Tennis camps (9 sessions, COV-604302-310) | Already in DB ✓, statuses verified correct (Open, no registrationDate) |

---

## Notes

- Virtual renderer limitation: only A–B programs visible (~20 items). C–Z programs need follow-up pass.
- Dual-ID pattern confirmed: display IDs differ from URL IDs. URL IDs match COV- DB IDs.
- 209 live programs include birthday party slots (excluded per policy) and adult-only programs.
- Archery sessions: no class Apr 25 (Easter weekend) or May 16 (unknown conflict).
- Adapted Fitness Boxing specifically targets neurodiverse youth — inclusive adaptive programming.
- Tennis camp statuses (COV-604302-310): all `Open` with no `registrationDate` (registration opened before Apr 8 batch) — correct as-is.
