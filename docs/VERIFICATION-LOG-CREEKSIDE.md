# Verification Log — City of Vancouver - Creekside Cmty Rec Centre

**Audited:** 2026-04-05
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=29&min_age=0&max_age=17&viewMode=list
**Live page count:** 187 programs (ages 0–17, in-progress/future)
**DB count after audit:** 47 programs

---

## Summary

Live page shows 187 programs. DB has 47 programs after fixing 28 status errors and adding 5 missing programs. Gap of ~140 is largely adult-only programs (Athletic Taping Course "16 yrs+"), B–Z programs not yet enumerable due to virtual renderer limitation.

**Systemic status fix:** 28 programs had `enrollmentStatus: 'Open'` but `registrationDate: 2026-04-08` — registration hadn't opened yet. All corrected to "Coming Soon".

**Missing sessions:** 20/20/20 Dance fit had Mon in-progress (COV-587134) and 6 future Wed/Fri sessions in DB, but was missing 2 in-progress sessions (Wed COV-587149, Fri COV-587157) and 3 future Monday sessions (COV-610923–610925). All 5 added.

---

## Fixes Applied This Audit

| ID(s) | Field | Old | New | Reason |
|-------|-------|-----|-----|--------|
| COV-612894–612900 (6) | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08; registration not yet open |
| COV-610927, 610929, 610933, 610951, 610952, 610955 (6) | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| COV-609112–609115 (4) | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| COV-611034–611036 (3) | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| COV-614807–614815 (9) | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |

---

## Programs Added This Audit (5)

| ID | Name | Dates | Days | Cost | Status |
|----|------|-------|------|------|--------|
| COV-587149 | 20/20/20 Dance fit, Strength and Yoga Fitness | Mar 18–Apr 29, 2026 | Wed | $154 | Open (7 sessions) |
| COV-587157 | 20/20/20 Dance fit, Strength and Yoga Fitness | Mar 20–Apr 24, 2026 | Fri | $110 | Open (5 sessions, no Apr 3) |
| COV-610923 | 20/20/20 Dance fit, Strength and Yoga Fitness | May 4–Jun 8, 2026 | Mon | $100 | Coming Soon (no May 18) |
| COV-610924 | 20/20/20 Dance fit, Strength and Yoga Fitness | Jun 15–Jul 13, 2026 | Mon | $100 | Coming Soon |
| COV-610925 | 20/20/20 Dance fit, Strength and Yoga Fitness | Jul 20–Aug 24, 2026 | Mon | $100 | Coming Soon (no Aug 3) |

---

## Spot-Checks (field-by-field verification)

### A 'Lets Play' Summer Start: Learning Through Minecraft — COV-612894 (live #615816)
- **Dates:** Jul 6–10, 2026, Mon–Fri ✓
- **Time:** 9:30 AM–3:30 PM ✓
- **Age:** 8 to <14 (ageMin=8, ageMax=13) ✓
- **Cost:** $425 ✓
- **Status:** Coming Soon (22 openings, opens Apr 8, 2026 7:00 PM) ✓ (was Open — corrected)

### 20/20/20 Dance fit, Strength and Yoga Fitness — COV-610927 (live #613849)
- **Dates:** May 6–Jun 3, 2026, Wed ✓ (display ID confirmed via URL ID match)
- **Status:** Coming Soon (opens Apr 8, 2026) ✓ (was Open — corrected)

### 20/20/20 Dance fit, Strength and Yoga Fitness — COV-587149 (live #590071) — NEW
- **Dates:** Mar 18–Apr 29, 2026, Wed, 7 sessions ✓
- **Time:** 9:30–10:30 AM ✓
- **Age:** 13 yrs+ ✓
- **Cost:** $154 ✓ (via fee details modal)
- **Status:** Open (9 openings, registration opened Dec 2, 2025) ✓

### 20/20/20 Dance fit, Strength and Yoga Fitness — COV-587157 (live #590079) — NEW
- **Dates:** Mar 20–Apr 24, 2026, Fri, 5 sessions, no Apr 3 ✓
- **Cost:** $110 ✓
- **Status:** Open (7 openings) ✓

### Shorinji Kempo — COV-609112 (live #612034)
- **Dates:** May 2–30, 2026, Tue+Sat, no May 16 ✓
- **Status:** Coming Soon (opens Apr 8) ✓ (was Open — corrected)
- **Age:** 13 yrs+ (categorized as Adult by ActiveNet) ✓

### Kids Self-Defense and Anti Bullying Classes (ages 5-8) — COV-611034 (live #613956)
- **Dates:** Jul 4–Aug 22, 2026, Sat 11:00–11:45 AM, no Aug 1 ✓
- **Status:** Coming Soon (opens Apr 8) ✓ (was Open — corrected)

### Birds Nest Properties Community Dragon Boat Paddling Day — COV-614807 (live #617729)
- **Date:** May 24, 2026, Sun 1:00–2:00 PM ✓
- **Cost:** $2.00 ✓
- **Status:** Coming Soon (opens Apr 8) ✓ (was Open — corrected)

---

## Programs Excluded

| Program | Reason |
|---------|--------|
| Athletic Taping Course (COV-590391, 613945, 613946) | "16 yrs+" — adult programs |
| 20/20/20 Dance fit (in-progress Mon) COV-587134 | Already in DB ✓ |

---

## Dual-ID Pattern Confirmed

- COV-612894 (URL ID) = display ID #615816
- COV-610927 (URL ID) = display ID #613849 (confirmed via detail page showing May 6, Wed)
- COV-609112 (URL ID) = display ID #612034
- All URL IDs match COV- DB IDs; display IDs differ and are not stored

---

## Notes

- Virtual renderer limitation: only A programs visible (~20 items). B–Z programs need follow-up pass.
- 20/20/20 Dance fit series: all 9 sessions per day (Mon/Wed/Fri) now fully represented in DB.
- Minecraft MCKids Academy camps: instructor Anna (Momibelle) & Emiliana (Emibelle) Belluz, Vernon (2vb) Ip. Laptop required (Java Edition $29.99 CA). Laptop rental $15/day available.
- Dragon Boat: minimum donation $2/person, proceeds to charity, run by Dragon Zone / Dragon Boat BC.
- Shorinji Kempo: drop-in $9.52. No class May 16.
