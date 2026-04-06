# Verification Log — City of Vancouver - Hillcrest Community Centre

**Audited:** 2026-04-06
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=39&min_age=0&max_age=17&viewMode=list
**Live page count:** 574 programs (ages 0–17, in-progress/future)
**DB count after audit:** 526 programs (no programs added — all A programs already in DB)

---

## Summary

Live page shows 574 programs. DB has 526 programs. All visible A programs were already in DB. No new programs added this pass.

**Systemic status fix:** 48 programs with `registrationDate: 2026-04-08` incorrectly set to `Open`, `Full/Waitlist`, or `Completed`. All corrected to "Coming Soon" (registration not yet open on 2026-04-06).

**R46 fix:** Program ID 2503 (Kids Swim Lessons, age 3–16, 13-year span) had R46 violation. Added `ageSpanJustified` — umbrella entry for multiple swim levels (Parent & Tot, Preschool, Swimmer).

---

## Fixes Applied This Audit

| ID(s) | Name | Field | Old | New | Reason |
|-------|------|-------|-----|-----|--------|
| 1524–1531 (8) | Art of Tennis Summer Camp at Hillcrest | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1532 | High 5 Sports - Floor Hockey Camp | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1533–1534 | High 5 Sports - Indoor Hockey Camp | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1535–1536 | High 5 Sports - Indoor Soccer Camp | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1537–1538 | High 5 Sports - Multi Sport Camp | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1539 | High 5 Sports - Soccer/Floor Hockey Camp | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1540–1541 | Sportball Multisport Camp at Hillcrest | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1544–1547 | Sportball Outdoor Multisport Camp at Hillcrest | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1552–1559 (8) | Explorers Youth Leadership Camp - Weeks 1–8 | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1560–1561 | Lego Robotics 1 at Hillcrest | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1562 | Byte Camp - Introduction to Coding | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1563 | Byte Camp - Introduction to Coding Level 2 | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1564 | Byte Camp - Python Coding Level 1 | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1565 | Dance Camp - KPop at Hillcrest | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1566 | Dance Camp - Pop Era at Hillcrest | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1567 | Mini Dance Camp - Let it Go at Hillcrest | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1568 | Mini Dance Camp - Super Paws at Hillcrest | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1569 | Byte Camp - Music Video Production | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1570 | Mini Musical Camp - Pinkatastic | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1571 | Musical Camp - Defy Gravity | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1572 | Musical Camp - Family Magic | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1573 | Musical Camp - Frozen | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1574 | Musical Camp - Seuss | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 1575 | Musical Camp - Wicked Wonderland | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08 |
| 2503 | Kids Swim Lessons | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08 |
| 2503 | Kids Swim Lessons | ageSpanJustified | — | Added | R46 suppression: umbrella entry ages 3–16 |
| hillcrest-cc-1 | Hillcrest Community Centre Summer Day Camp | enrollmentStatus | Completed | Coming Soon | registrationDate=2026-04-08 |

**Total fixes: 48 status corrections + 1 ageSpanJustified added**

---

## Spot-Checks

### Art of Tennis Summer Camp at Hillcrest — IDs 1524–1531 (8 sessions)
- **registrationDate:** 2026-04-08 confirmed via detail page (COV-605938 spot-check: "From Apr 8, 2026 7:00 PM")
- **Status fix:** Open → Coming Soon ✓

### Kids Swim Lessons — ID 2503
- **registrationDate:** 2026-04-08 ✓
- **Status fix:** Full/Waitlist → Coming Soon ✓
- **R46 fix:** ageSpanJustified added (3–16 umbrella entry) ✓

### Hillcrest CC Summer Day Camp — hillcrest-cc-1
- **Issue:** enrollmentStatus was "Completed" with registrationDate=2026-04-08 — contradictory
- **Fix:** Changed to "Coming Soon" ✓

---

## Programs Not Added

All A programs visible on the live page were already in the DB:
- Art and Music with Sun Rey (COV-601473, 601476, 601478) — already in DB
- Art of Tennis Summer Camp (IDs 1524–1531) — already in DB
- Artists, Architects and Engineers (COV-601534) — already in DB
- Axe Capoeira series (multiple COV- IDs) — already in DB

---

## Notes

- Virtual renderer: only A programs visible (~20 items). B–Z programs need follow-up pass.
- 574 live programs includes adult programs and birthday party slots (excluded per policy).
- Hillcrest is the largest CoV community centre pool complex — heavy swim lesson inventory.
- Explorers Youth Leadership Camp (IDs 1552–1559): 8-week program, all summer. Same structure as other CoV camps.
- High 5 Sports, Sportball, Byte Camps, Dance Camps, Musical Camps: all confirmed registrationDate=2026-04-08.
