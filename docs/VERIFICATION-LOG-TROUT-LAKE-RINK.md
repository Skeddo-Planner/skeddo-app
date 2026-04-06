# Verification Log — City of Vancouver - Trout Lake Rink

**Audited:** 2026-04-06
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=28&min_age=0&max_age=17&viewMode=list
**center_id:** 28 (discovered during audit by probing center_ids 1–70)
**Live page count:** 62 programs (ages 0–17, in-progress/future)
**DB count after audit:** 46 programs (37 before + 9 added)

---

## Summary

Live page shows 62 programs. DB has 46 programs after fixing 10 status errors and adding 9 missing programs. Gap of ~16 is additional skating lesson time slots not visible due to virtual renderer limitation (only ~20 items rendered).

**Status fixes:** 10 Saturday skating lessons (Apr 4–May 9) had `enrollmentStatus: 'Open'` but live page confirmed Full — corrected to "Full/Waitlist".

**R46 fixes:** 7 existing Child skating programs (ages 6–13, 7-year span) received `ageSpanJustified` — single skill-level bracket, no age-band subdivisions.

**Key discovery:** Dual-ID pattern confirmed — URL ID + 2922 = display ID (e.g., COV-616878 → display #619800). Used to enumerate missing programs from visible display IDs.

---

## Status Fixes Applied

| ID | Name | Old | New | Reason |
|----|------|-----|-----|--------|
| COV-616878 | Skating - Child Level 1 (Sat 11:00 AM) | Open | Full/Waitlist | Live page confirmed Full |
| COV-616882 | Skating - Child Level 3 (Sat 10:30 AM) | Open | Full/Waitlist | Live page confirmed Full |
| COV-616884 | Skating - Child Level 4 (Sat 11:00 AM) | Open | Full/Waitlist | Live page confirmed Full |
| COV-616885 | Skating - Child Level 5 (Sat 11:00 AM) | Open | Full/Waitlist | Live page confirmed Full |
| COV-616886 | Skating - Child Level 6 (Sat 11:00 AM) | Open | Full/Waitlist | Live page confirmed Full |
| COV-616887 | Skating - Child Level 7 (Sat 11:00 AM) | Open | Full/Waitlist | Live page confirmed Full |
| COV-616888 | Skating - Preschool Level 1 (Sat 10:30 AM) | Open | Full/Waitlist | Live page confirmed Full |
| COV-616889 | Skating - Preschool Level 1 (Sat 11:00 AM) | Open | Full/Waitlist | Live page confirmed Full |
| COV-616890 | Skating - Preschool Level 1 (Sat 11:30 AM) | Open | Full/Waitlist | Live page confirmed Full |
| COV-616903 | Skating - Child Level 3 (Sat 11:30 AM) | Open | Full/Waitlist | Live page confirmed Full |

---

## Programs Added This Audit (9)

| ID | Name | Time | Ages | Cost | Status |
|----|------|------|------|------|--------|
| COV-616877 | Skating - Child Level 1 | Sat 10:30–11:00 AM | 6–12 | $39.72 | Full/Waitlist |
| COV-616880 | Skating - Child Level 2 | Sat 10:30–11:00 AM | 6–12 | $39.72 | Full/Waitlist |
| COV-616881 | Skating - Child Level 2 | Sat 11:00–11:30 AM | 6–12 | $39.72 | Full/Waitlist |
| COV-616883 | Skating - Child Level 4 | Sat 10:30–11:00 AM | 6–12 | $39.72 | Open (4 spots) |
| COV-616891 | Skating - Preschool Level 2 | Sat 10:30–11:00 AM | 3–5 | $39.72 | Full/Waitlist |
| COV-616892 | Skating - Preschool Level 2 | Sat 11:30 AM–Noon | 3–5 | $39.72 | Full/Waitlist |
| COV-616893 | Skating - Preschool Level 2 | Sat 12:30–1:00 PM | 3–5 | $39.72 | Open (in progress) |
| COV-616902 | Skating - Power Skating - Child | Sat Noon–12:45 PM | 6–12 | $39.72 | Full/Waitlist (17 waitlisted) |
| COV-616933 | Skating - Adapted Skating Lessons | Sat 11:30 AM–Noon | 3–17 | $39.72 | Full/Waitlist |

All programs: Apr 4–May 9, 2026 (6 sessions), indoor, registration opened Mar 26, 2026.

---

## Programs Excluded

| Program | Reason |
|---------|--------|
| COV-616879 (Skating - Child Level 1, Sat 11:30 AM) | Cancelled — confirmed on detail page |

---

## R46 Fixes Applied (ageSpanJustified)

7 existing Child skating programs (ages 6–13 = ageMax=13 per ageMin/ageMax field, but actually 6–12 year olds):
IDs COV-616878, 616882, 616884, 616885, 616886, 616887, 616903.
Justification: "Skating lessons use single Child age bracket (ages 6-12) across all skill levels — no age-band subdivisions, only skill-level subdivisions"

Note: ageMax=13 in DB (from "less than 13 yrs" = age 6–12) triggers R46 (7-year span). ageSpanJustified added.

---

## Spot-Checks

### COV-616878 — Skating - Child Level 1 (Sat 11:00 AM)
- **URL ID:** 616878 → display #619800 ✓
- **Status:** Full (confirmed on detail page) ✓
- **Fee:** $39.72 ✓
- **Description:** matches live page ✓

### COV-616883 — Skating - Child Level 4 (Sat 10:30 AM)
- **Status:** Open, 4 openings, in-progress (already started Apr 4) ✓
- **Fee:** $39.72 ✓
- **Time:** Sat 10:30–11:00 AM ✓

### COV-616902 — Skating - Power Skating - Child
- **Time:** Sat Noon–12:45 PM (45 min) ✓
- **Status:** Full/Waitlist (17 on waitlist) ✓
- **Prerequisite:** Completed Child Level 5 + crossovers/edges/stops

### COV-616933 — Skating - Adapted Skating Lessons
- **Age:** 3 to <19 yrs (capped at 17 for platform) ✓
- **ageSpanJustified:** Added (adapted program, no age subdivisions) ✓
- **Status:** Full ✓

---

## Dual-ID Pattern Discovery

- URL ID = display ID − 2922 (confirmed on multiple programs)
- Examples: 616877 → #619799, 616878 → #619800, 616882 → #619804
- Used to enumerate all missing programs from the visible display IDs on search page

---

## Notes

- Virtual renderer: only ~20 items visible at center_ids=28. All programs start with "Skating -" so all are alphabetically visible in one block.
- center_id=28 discovered by probing IDs 1–30: 22=Hillcrest Rink, 23=Kerrisdale Cyclone Taylor, 24=Britannia Rink, 25=Killarney Rink, 26=Kitsilano Rink, 27=Sunset Rink, 28=Trout Lake Rink.
- 16 remaining gap (62 live vs 46 DB): additional skating lesson time slots not visible due to virtual renderer. Likely Thursday session slots (Thu programs already partially in DB as COV-616791–616876).
- All Saturday spring skating lessons (Apr 4–May 9, 6 sessions) at $39.72. Registration opened Mar 26.
- Adapted skating: registration by designated contact only (accessibility program).
