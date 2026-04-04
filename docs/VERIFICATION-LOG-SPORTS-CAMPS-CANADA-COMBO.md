# Verification Log — Sports Camps Canada (Combo Listings Audit)

**Date:** 2026-04-03
**Auditor:** Claude Sonnet 4.6
**Provider:** Sports Camps Canada
**Registration page:** https://www.sportscampscanada.com/camps/nike-basketball-camp-north-vancouver-bc#register-block
**Audit type:** One Click Deeper — add combo camp listings + fix registration URL anchor

---

## Audit Summary

Tom flagged 3 missing combo listings. The registration page shows 6 total registration options
(3 individual weeks + 3 combo packages), but we only had 3 confirmed/open listings (individual weeks).
The #register-block anchor was also missing from all 8 existing entries.

**Before:** 8 total Sports Camps Canada listings (3 open individual weeks, 5 "Likely Coming Soon")
**After:** 11 total Sports Camps Canada listings (6 open + 5 "Likely Coming Soon")
**Net change:** +3 combo listings added (IDs 15709-15711), all 8 existing URLs updated

---

## Registration Page Findings

Source: https://www.sportscampscanada.com/camps/nike-basketball-camp-north-vancouver-bc#register-block
Verified: 2026-04-03

### Common Details (all sessions)
- Address: 2055 Purcell Way, North Vancouver, BC V7J 3H5 (Capilano University)
- Ages: 12-16, Coed
- Skill level: Intermediate to Advanced
- Times: 9:00 AM - 4:00 PM
- Coach: Jey-son Edwards, NCCP Certified Level 2 + Basketball USA Gold Licensed Coach
- Annual fee: One-time $35/camper per year (separate from camp price)

---

## Field-by-Field Verification

### Week 1: Attack Moves Camp (ID 321) — existing, verified

| Field | Registration Page | DB Value | Match |
|-------|-------------------|----------|-------|
| name | Attack Moves Camp | Nike Basketball Camp NV (Attack Moves Week) | OK |
| startDate | Aug 4, 2026 (Tue) | 2026-08-04 | OK |
| endDate | Aug 7, 2026 (Fri) | 2026-08-07 | OK |
| days | Tue-Fri (4-day) | Tue-Fri | OK |
| startTime | 9:00 AM | 9:00 AM | OK |
| endTime | 4:00 PM | 4:00 PM | OK |
| cost | $355 + HST | 355 | OK |
| ageMin | 12 | 12 | OK |
| ageMax | 16 | 16 | OK |
| enrollmentStatus | Open | Open | OK |
| confirmed2026 | true | true | OK |
| registrationUrl | .../…#register-block | updated | OK |
| address | 2055 Purcell Way, North Vancouver | 2055 Purcell Way, North Vancouver, BC | OK |
| focus | First steps, change of pace, footwork to get by defenders | in description | OK |

### Week 2: Sharp Shooter Camp (ID 322) — existing, verified

| Field | Registration Page | DB Value | Match |
|-------|-------------------|----------|-------|
| name | Sharp Shooter Camp | Nike Basketball Camp NV (Sharp Shooter Week) | OK |
| startDate | Aug 10, 2026 (Mon) | 2026-08-10 | OK |
| endDate | Aug 14, 2026 (Fri) | 2026-08-14 | OK |
| days | Mon-Fri | Mon-Fri | OK |
| startTime | 9:00 AM | 9:00 AM | OK |
| endTime | 4:00 PM | 4:00 PM | OK |
| cost | $355 + HST | 355 | OK |
| ageMin | 12 | 12 | OK |
| ageMax | 16 | 16 | OK |
| enrollmentStatus | Open | Open | OK |
| confirmed2026 | true | true | OK |
| registrationUrl | .../…#register-block | updated | OK |
| focus | Shooting mechanics, consistency, confidence | in description | OK |

### Week 3: Play Maker Camp (ID 323) — existing, verified

| Field | Registration Page | DB Value | Match |
|-------|-------------------|----------|-------|
| name | Play Maker Camp | Nike Basketball Camp NV (Play Maker Week) | OK |
| startDate | Aug 17, 2026 (Mon) | 2026-08-17 | OK |
| endDate | Aug 21, 2026 (Fri) | 2026-08-21 | OK |
| days | Mon-Fri | Mon-Fri | OK |
| startTime | 9:00 AM | 9:00 AM | OK |
| endTime | 4:00 PM | 4:00 PM | OK |
| cost | $355 + HST | 355 | OK |
| ageMin | 12 | 12 | OK |
| ageMax | 16 | 16 | OK |
| enrollmentStatus | Open | Open | OK |
| confirmed2026 | true | true | OK |
| registrationUrl | .../…#register-block | updated | OK |
| focus | Decision making, passing angles, dribble control, reading defenders | in description | OK |

### Combo 1 and 2: Attack Moves + Sharp Shooter (ID 15709) — NEW

| Field | Registration Page | DB Value | Source |
|-------|-------------------|----------|--------|
| name | Combo 1 and 2 | Nike Basketball Camp NV (2-Week Combo: Attack Moves + Sharp Shooter) | Browser |
| startDate | Aug 4, 2026 | 2026-08-04 | Browser |
| endDate | Aug 14, 2026 | 2026-08-14 | Browser |
| weeks | Aug 4-7 (Tue-Fri) + Aug 10-14 (Mon-Fri) | Noted in description and costNote | Browser |
| startTime | 9:00 AM | 9:00 AM | Browser |
| endTime | 4:00 PM | 4:00 PM | Browser |
| cost | $635 + HST | 635 | Browser |
| savings | $65 vs individual | Noted in costNote | Browser |
| ageMin | 12 | 12 | Browser |
| ageMax | 16 | 16 | Browser |
| enrollmentStatus | Open | Open | Browser |
| confirmed2026 | true | true | Browser |
| registrationUrl | .../nike-basketball-camp-north-vancouver-bc#register-block | set | Browser |
| direct reg link | https://secure.sportscampscanada.com/step1/5595 | via #register-block page | Browser |
| address | 2055 Purcell Way, North Vancouver | 2055 Purcell Way, North Vancouver, BC | Browser |

### Combo 2 and 3: Sharp Shooter + Play Maker (ID 15710) — NEW

| Field | Registration Page | DB Value | Source |
|-------|-------------------|----------|--------|
| name | Combo 2 and 3 | Nike Basketball Camp NV (2-Week Combo: Sharp Shooter + Play Maker) | Browser |
| startDate | Aug 10, 2026 | 2026-08-10 | Browser |
| endDate | Aug 21, 2026 | 2026-08-21 | Browser |
| weeks | Aug 10-14 (Mon-Fri) + Aug 17-21 (Mon-Fri) | Noted in description and costNote | Browser |
| startTime | 9:00 AM | 9:00 AM | Browser |
| endTime | 4:00 PM | 4:00 PM | Browser |
| cost | $635 + HST | 635 | Browser |
| savings | $65 vs individual | Noted in costNote | Browser |
| ageMin | 12 | 12 | Browser |
| ageMax | 16 | 16 | Browser |
| enrollmentStatus | Open | Open | Browser |
| confirmed2026 | true | true | Browser |
| registrationUrl | .../nike-basketball-camp-north-vancouver-bc#register-block | set | Browser |
| direct reg link | https://secure.sportscampscanada.com/step1/5598 | via #register-block page | Browser |
| address | 2055 Purcell Way, North Vancouver | 2055 Purcell Way, North Vancouver, BC | Browser |

### 3-Week Combo: All Weeks (ID 15711) — NEW

| Field | Registration Page | DB Value | Source |
|-------|-------------------|----------|--------|
| name | All 3 Weeks (Weeks 1, 2 and 3) | Nike Basketball Camp NV (3-Week Combo) | Browser |
| startDate | Aug 4, 2026 | 2026-08-04 | Browser |
| endDate | Aug 21, 2026 | 2026-08-21 | Browser |
| weeks | Aug 4-7 + Aug 10-14 + Aug 17-21 | Noted in description and costNote | Browser |
| startTime | 9:00 AM | 9:00 AM | Browser |
| endTime | 4:00 PM | 4:00 PM | Browser |
| cost | $945 + HST | 945 | Browser |
| savings | $100 vs individual | Noted in costNote | Browser |
| ageMin | 12 | 12 | Browser |
| ageMax | 16 | 16 | Browser |
| enrollmentStatus | Open | Open | Browser |
| confirmed2026 | true | true | Browser |
| registrationUrl | .../nike-basketball-camp-north-vancouver-bc#register-block | set | Browser |
| direct reg link | https://secure.sportscampscanada.com/step1/5596 | via #register-block page | Browser |
| address | 2055 Purcell Way, North Vancouver | 2055 Purcell Way, North Vancouver, BC | Browser |

---

## URL Fix Applied to All Existing Entries

All 8 Sports Camps Canada listings (IDs 317-324) had url and registrationUrl updated:

Before: https://www.sportscampscanada.com/camps/nike-basketball-camp-north-vancouver-bc
After:  https://www.sportscampscanada.com/camps/nike-basketball-camp-north-vancouver-bc#register-block

---

## Completeness Check

| Source | Count |
|--------|-------|
| Registration page options | 6 (3 individual + 3 combo) |
| DB open listings before audit | 3 |
| DB open listings after audit | 6 |
| DB "Likely Coming Soon" (July + Aug 24-28, not yet open) | 5 |
| Total DB listings after audit | 11 |
| Missing options | 0 |

Note: IDs 317-320 (July weeks) and ID 324 (Aug 24-28) are "Likely Coming Soon" with
confirmed2026: false — registration for those weeks has not opened on the provider site.

---

## Issues Found and Fixed

| # | Issue | Fix Applied |
|---|-------|-------------|
| 1 | All 8 existing URLs missing #register-block anchor | Updated url + registrationUrl on IDs 317-324 |
| 2 | Combo 1+2 (Aug 4-7 + Aug 10-14, $635+HST) not in DB | Added ID 15709 |
| 3 | Combo 2+3 (Aug 10-14 + Aug 17-21, $635+HST) not in DB | Added ID 15710 |
| 4 | 3-Week Combo (all 3 weeks, $945+HST) not in DB | Added ID 15711 |
