# Verification Log — Vancouver School Board (SD39)

- **Date:** 2026-04-04
- **Auditor:** Claude (automated audit agent)
- **Registration page URL:** https://summerreg.vsb.bc.ca/
- **Programme info:** https://www.vsb.bc.ca/summer-learning/
- **Catalogue source:** VSB Summer Learning Catalogue 2026

---

## Summary

Provider shows approximately 100+ summer learning programs across elementary (K-7) and secondary (8-12) levels. Database had 62 records covering elementary and secondary preview programs. This audit corrected cost, time, and status errors across all 62 records.

**Records verified/fixed:** 62
**New records added:** 0
**Critical issues fixed:** 51 programs had wrong cost ($390 instead of $0), all 62 had wrong start/end times

---

## Critical Fixes Made

### 1. Cost Correction — 51 Programs

**Issue:** 51 of 62 programs had `cost: 390` but are actually **free for BC resident students** (Ministry-funded).

Only the following 11 "non-funded elective" programs legitimately cost $390:
- Art Adventures with Awesome Authors (Grades K-1) — SD39-0045
- Art Adventures with Awesome Authors (Grades 2-3) — SD39-0046
- Create Your Own Comic Book! (Grades 4-7) — SD39-0047
- Design Thinking for Young Engineers (Grades 2-3) — SD39-0048
- Design Thinking for Young Engineers (Grades 4-7) — SD39-0049
- Summer Games & Outdoor Adventures! (Grades K-1) — SD39-0050
- Summer Games & Outdoor Adventures! (Grades 2-3) — SD39-0051
- Summer Games & Outdoor Adventures! (Grades 4-7) — SD39-0052
- Summer of STEAM (Grades K-1) — SD39-0053
- Summer of STEAM (Grades 2-3) — SD39-0054
- Summer of STEAM (Grades 4-7) — SD39-0055

**Fix:** SD39-0001 through SD39-0044, and SD39-0056 through SD39-0062 → `cost: 0`, `costNote` updated to explain free for BC residents, non-BC residents pay $390.

**From VSB fee table:**
- 1st elementary course (40-hour, Funded): **No Fee** for BC students
- 2nd elementary course (40-hour, Non-Funded): **$390** for BC students
- Secondary Review/Preview/Remedial/ELL (40-hour, Funded): **No Fee** for BC students

### 2. Start/End Time Correction — All 62 Programs

**Issue:** All programs had `startTime: "9:00 AM"` / `endTime: "12:00 PM"` — incorrect.

**Correct times per VSB catalogue:**
- Elementary programs (SD39-0001 to SD39-0055): `8:30 AM – 11:35 AM` (AM session)
- Secondary preview programs (SD39-0056 to SD39-0062): `8:00 AM – 10:10 AM` (Session 1)

**Fix:** All 55 elementary programs updated to 8:30 AM–11:35 AM. All 7 secondary programs updated to 8:00 AM–10:10 AM.

**Note:** Programs also run in PM sessions (elementary: 12:05–3:10 PM; secondary: 10:30 AM–12:40 PM). The database represents each program once (AM session). A follow-up audit could add PM session records.

### 3. URL Field — All 62 Programs

**Issue:** All 62 programs had `url: undefined`.

**Fix:** Added `url: "https://summerreg.vsb.bc.ca/"` to all records. Registration hasn't opened yet (opens April 30, 2026), so no individual program URLs exist yet.

---

## Verified Correct (No Changes)

| Field | Status |
|---|---|
| enrollmentStatus: "Coming Soon" for elementary | ✅ Correct (registration opens Apr 30) |
| enrollmentStatus: "Upcoming" for secondary | ✅ Correct (registration opens May 7, 33 days away) |
| registrationDate: "2026-04-30" for elementary | ✅ Correct |
| registrationDate: "2026-05-07" for secondary | ✅ Correct |
| Dates: July 7–24 for elementary | ✅ Verified in catalogue |
| Dates: July 7–31 for secondary | ✅ Verified in catalogue |
| Program names | ✅ Match catalogue (minor capitalization variants acceptable) |
| confirmed2026: true | ✅ Correct — confirmed from VSB catalogue |

---

## Missing Programs (Not Added This Pass)

The database covers elementary programs and secondary preview programs. The following secondary programs exist in the VSB catalogue but are NOT in the database:

**Secondary Review (Grades 8-9, July 7–31, FREE):**
English Language Arts 8 Review, English Language Arts 9 Review, Mathematics 8 Review, Mathematics 9 Review, Science 8 Review, Science 9 Review, Social Studies 8 Review, Social Studies 9 Review

**Secondary Remedial (Grades 10-11, July 7–31, FREE):**
Composition 10, Foundations of Math & Pre-Calculus 10, Science 10, Social Studies 10

**Secondary Completion (Grades 10-12, July 7–August 7, FREE):**
~30+ courses across English, Math, Science, Social Studies, PHE, Modern Languages

**Secondary ELL (Grades 8-12, July 7–31, FREE):**
ELL Reading & Writing

These are mostly for grades 10-12 (older than Skeddo's core audience) and are all free for BC students. A follow-up audit could add these if secondary students are a target demographic.

---

## School Locations

Programs are offered at the following schools (not differentiated in DB — all show "Multiple Locations"):

**Elementary (July 7–24):**
- Dickens Elementary — 1010 East 17th Ave, Vancouver
- Kingsford-Smith Elementary — 6901 Elliott Street, Vancouver
- Lord Kitchener Elementary — 3455 King Edward Ave W, Vancouver
- Maple Grove Elementary — 1924 West 45th Ave, Vancouver
- Renfrew Elementary — 3315 East 22nd Ave, Vancouver
- Sexsmith Elementary — 7410 Columbia Street, Vancouver
- Van Horne Elementary — 5855 Ontario Street, Vancouver
- wək̓ʷan̓əs tə syaqʷəm Elementary — 3150 Kitchener Street, Vancouver

**Secondary (July 7–31 / Aug 7):**
- Churchill Secondary — 7055 Heather Street, Vancouver
- Prince of Wales Secondary — 2250 Eddington Drive, Vancouver
- Tupper Secondary — 419 East 24th Ave, Vancouver
- Vancouver Technical Secondary — 2600 East Broadway, Vancouver

A follow-up audit should consider creating per-school records for the elementary programs since each school offers all programs at specific locations — this would allow accurate location-based filtering.

---

## Enrollment Status Notes

As of 2026-04-04, registration is not yet open. All "Coming Soon" and "Upcoming" statuses are correct.

- Elementary registration opens: **April 30, 2026 at 12:00 PM**
- Secondary registration opens: **May 7, 2026 at 12:00 PM**
