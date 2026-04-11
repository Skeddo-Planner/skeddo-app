# Verification Log — Coquitlam School District (SD43)

**Audited:** 2026-04-09
**Queue entry:** Rank 204
**Source URLs verified (browser navigation):**
- `https://ce43.augusoft.net/info/landing/summer-learning` (main landing page — all programs, schedule table, registration status)
- `https://ce43.augusoft.net/index.cfm?method=templates.CustomTemplatePreview&ContentID=197` (Summer Afternoon Camps — third-party, not SD43 programs)
**DB count before audit:** 16,266 programs
**DB count after audit:** 16,267 (1 added, 6 corrected)

---

## Summary

6 existing SD43 entries corrected, 1 new program added. SD43-0002 ("Grades 5-7") does not exist on the live page — Elementary is Gr. 1-5 and Middle is Gr. 6-8 with no overlap. Times were wrong on 4 entries. Dates were wrong on SD43-0004. A missing program (Secondary Skill Building Gr. 9-12) was added. All programs are tuition-free. Elementary/Middle lottery closed April 8 (re-registration April 21). Secondary lottery opens April 28.

---

## Programs Verified (all fields browser-checked)

| ID | Program | Dates | Times (AM) | Ages | Status |
|----|---------|-------|------------|------|--------|
| SD43-0001 | Elementary Summer Learning (Gr. 1-5) | Jul 7-24 | 9:00 AM - 12:00 PM | 6-10 | Coming Soon |
| SD43-0002 | ~~Elementary (Grades 5-7)~~ | — | — | — | confirmed2026=false |
| SD43-0003 | Middle School Summer Learning (Gr. 6-8) | Jul 7-24 | 8:45 AM - 11:45 AM | 11-13 | Coming Soon |
| SD43-0004 | Secondary Academic Completion (Gr. 10-12) | Jul 7-24 | 8:30 AM - 11:30 AM | 15-17 | Coming Soon |
| SD43-0005 | Secondary High School Credit | Jul 2 - Aug 6 | 8:00 AM - 11:30 AM | 15-18 | Coming Soon |
| SD43-0006 | Secondary Fast Track (Online/Hybrid) | Jul 2 - Aug 6 | 8:00 AM - 11:30 AM | 15-18 | Coming Soon |
| SD43-0007 | **Secondary Skill Building (Gr. 9-12)** | Jul 7-24 | 8:30 AM - 11:30 AM | 14-17 | Coming Soon (NEW) |

All programs: cost=$0 (tuition free for BC students).

---

## Corrections Applied

| Field | Old | New | IDs |
|-------|-----|-----|-----|
| confirmed2026 | false | true | SD43-0001, 0003, 0004, 0005, 0006 |
| enrollmentStatus | Likely Coming Soon | Coming Soon | SD43-0001, 0003, 0004, 0005, 0006 |
| registrationDate | — | 2026-04-21 | SD43-0001, 0003 |
| registrationDate | — | 2026-04-28 | SD43-0004, 0005, 0006 |
| startTime | 9:00 AM | 8:45 AM | SD43-0003 |
| endTime | 12:00 PM | 11:45 AM | SD43-0003 |
| startTime | 9:00 AM | 8:30 AM | SD43-0004 |
| endTime | 12:00 PM | 11:30 AM | SD43-0004 |
| startDate | 2026-07-02 | 2026-07-07 | SD43-0004 |
| endDate | 2026-08-06 | 2026-07-24 | SD43-0004 |
| ageMax | 18 | 17 | SD43-0004 |
| address | Multiple schools | Centennial Secondary | SD43-0004 |
| startTime | 9:00 AM | 8:00 AM | SD43-0005, 0006 |
| endTime | 12:00 PM | 11:30 AM | SD43-0005, 0006 |
| durationPerDay | 3 | 3.5 | SD43-0005, 0006 |
| registrationUrl | landing page | specific detail page | all 6 |

---

## SD43-0002: No Matching Program

The DB entry "Elementary Summer Learning (Grades 5-7)" with ages 10-13 does not correspond to any program on the 2026 Summer Learning page. The page shows:
- Elementary: Gr. 1-5 (SD43-0001)
- Middle: Gr. 6-8 (SD43-0003)
- Secondary: Gr. 9-12 (SD43-0007, newly added)

No "Grades 5-7" transitional program exists. Set confirmed2026=false per R31 (never remove programs).

---

## Registration Timeline

| Program Level | Lottery | Re-registration Opens |
|--------------|---------|----------------------|
| Elementary (Gr. 1-5) | Closed April 8 | April 21 - July 7 |
| Middle (Gr. 6-8) | Closed April 8 | April 21 - July 7 |
| Secondary (all) | Opens April 28 | TBD |

---

## Locations (browser-verified)

| Level | Schools |
|-------|---------|
| Elementary | Aspenwood, Bramblewood, Coquitlam River, Glen, Kilmer, Miller Park, Porter Street, Smiling Creek |
| Middle | Hillcrest, Kwayhquitlum, Scott Creek |
| Secondary | Centennial Secondary, Gleneagle Secondary |

---

## Completeness Check

Page shows 6 distinct program types (Elementary, Middle, Secondary Skill Building, Academic Completion, High School Credit, Fast Track). DB now has 7 entries (6 active + 1 inactive SD43-0002). All 6 active programs on the page are represented.

Afternoon camps page checked — contains only third-party camps at SD43 schools, not SD43 programs. Not in scope.

---

## Notes

- All programs tuition free for BC students
- Contact: ceaccounts@sd43.bc.ca / (604) 936-4261
- Secondary programs with AM and PM options: listed with AM time as primary, PM noted in description
- Fast Track hybrid: Tue/Thu or Wed/Fri in-person, online on other days
- Academic Completion: by referral only, Math 10 and Science 10 only
- Locations subject to change per provider
