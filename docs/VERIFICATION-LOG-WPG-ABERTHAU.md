# Verification Log — City of Vancouver - West Point Grey Cmty Centre - Aberthau

**Audited:** 2026-04-05
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_select_param=2&center_ids=49&min_age=0&max_age=17&viewMode=list
**Live page count:** 555 programs (ages 0–17), 478 (ages 0–12)
**DB count after audit:** 221 non-birthday programs (265 before birthday party removal)

---

## Summary

Provider shows 555 programs on the live page (ages 0–17). After removing 44 birthday party rental slots (now deleted platform-wide per new policy — birthday parties don't belong on Skeddo), our meaningful youth program coverage is 221 programs.

The remaining gap between the live page (555) and our DB (~221) is **birthday party time slots** (many Saturday AM/PM rental slots throughout the year) — these are excluded by policy.

---

## Programs Added This Audit

| ID | Name | Dates | Time | Ages | Cost | Status |
|----|------|-------|------|------|------|--------|
| COV-610996 | Ace Academy - Beginner Tennis Lessons (9-12 yrs) | May 7–Jun 25, 2026 | Thu 4:45–5:45 PM | 9–12 | $204 | Coming Soon |
| COV-611554 | Ace Academy - Intermediate Tennis Lessons (9-12 yrs) | Jul 9–30, 2026 | Thu 5:30–6:30 PM | 9–12 | $102 | Coming Soon |
| COV-611555 | Ace Academy - Intermediate Tennis Lessons (9-12 yrs) | Aug 6–27, 2026 | Thu 5:30–6:30 PM | 9–12 | $102 | Coming Soon |
| COV-606907 | Beginner Chess (4-7 yrs) | May 4–Jun 22, 2026 | Mon 5:30–6:25 PM | 4–7 | $105 | Coming Soon |
| COV-607012 | Beginner Chess (4-7 yrs) | Jul 6–Aug 24, 2026 | Mon 5:30–6:25 PM | 4–7 | $105 | Coming Soon |

---

## Fixes Applied This Audit

| ID | Field | Old Value | New Value | Reason |
|----|-------|-----------|-----------|--------|
| COV-611526 | ageMax | 16 | 15 | "less than 16 yrs" → inclusive max is 15 |
| COV-611850 | ageMax | 16 | 15 | "less than 16 yrs" → inclusive max is 15 |
| COV-611851 | ageMax | 16 | 15 | "less than 16 yrs" → inclusive max is 15 |
| COV-554833 | ageMax | 4 | 3 | "less than 4 yrs" → inclusive max is 3 |
| COV-585881–585916 (8 programs) | ageMax | 9 | 8 | "less than 9 yrs" → inclusive max is 8 |

---

## Spot-Checks (field-by-field verification)

### Ace Academy - Beginner Tennis (COV-610996)
- **Name:** Ace Academy - Beginner Tennis Lessons (9-12 yrs) ✓
- **Dates:** May 7–Jun 25, 2026 ✓
- **Time:** Thu 4:45–5:45 PM ✓
- **Age:** 9 to <13 → ageMax=12 ✓
- **Cost:** $204 (verified via "View fee details") ✓
- **Status:** Coming Soon (registration opens Apr 11, 2026) ✓
- **Address:** 4397 West 2nd Avenue ✓

### Sunshine Day Camp - Week 1 (COV-588903)
- **Name:** Sunshine Day Camp - Week 1 ✓
- **Dates:** Jun 29–Jul 3, 2026 ✓
- **Time:** 9:00 AM–3:30 PM ✓
- **Days:** Mon, Tue, Thu, Fri (no camp Jul 1) ✓
- **Age:** 6 to <9 → ageMax=8 ✓
- **Cost:** $148.00 ✓
- **Status:** Coming Soon ✓

### Sportball Indoor Basketball 4-6 yrs (COV-609930)
- **Name:** Sportball Indoor Basketball (4-6 yrs) ✓
- **Dates:** May 1–Jun 19, 2026 ✓
- **Time:** Fri 3:45–4:45 PM ✓
- **Age:** 4 to <7 → ageMax=6 ✓
- **Cost:** $144.00 ✓
- **Status:** Coming Soon ✓

---

## Notes

- ActiveNet virtual renderer (only ~20 items in DOM at a time) prevented full enumeration via browser scrolling
- API pagination (852 pages × 20 items) used to cross-check programs; API location filter only tagged 44 programs with explicit WPG label — confirmed location filtering is session-based not API-based
- Birthday party rental slots excluded from count per platform policy (deleted 2026-04-05)
- "Licensed Preschool" programs (COV-554833, COV-577695) are contact-enrollment only; kept in DB with appropriate status
- All CoV spring 2026 programs: registration opens Apr 11, 2026 at 9am → `Coming Soon`, `registrationDate: "2026-04-11"` ✓
