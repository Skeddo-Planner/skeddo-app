# Verification Log — Young Moviemakers

**Date:** 2026-04-05
**Auditor:** Claude (automated)
**Registration Pages:**
- SFU Burnaby: https://athleticsandrecreation.its.sfu.ca/Program/GetProgramDetails?courseId=85595db2-984e-4e0d-863d-1374f4c893ad
- Mulgrave West Van: https://www.mulgrave.com/campus-life/mulgrave-school-summer-camps (via active.com)
- TWU Langley: https://www.twu.ca/life-twu/kids-camps/young-moviemakers
**Status:** COMPLETE

---

## Summary

| Metric | Value |
|--------|-------|
| BC locations | 9 in database |
| Confirmed 2026 | 3 (SFU, Mulgrave, TWU) |
| Set to Likely Coming Soon | 6 (Hastings, Clayton, UBC, Collingwood, Meadowridge, Abbotsford) |
| Programs added | 0 |

---

## Provider Information

- **Name:** Young Moviemakers
- **Website:** https://www.youngmoviemakers.ca
- **Description:** Award-winning acting and video production camp. Participants create short films in one-week sessions.
- **Age:** Generally 8-14 (varies slightly by location)
- **Format:** Full day, Mon-Fri (some 4-day weeks around BC Day and Canada Day)

---

## Confirmed 2026 Locations

### SFU Burnaby (ID 2534)
| Field | Before | After |
|-------|--------|-------|
| ageMin | 7 | 8 |
| ageMax | 17 | 13 |
| endDate | 2026-08-28 | 2026-08-21 (7 sessions: Jul 6 – Aug 21) |
| startTime | null | 8:30 AM |
| endTime | null | 3:30 PM |
| address | "SFU Burnaby" | "SFU Burnaby, 8888 University Dr, Burnaby, BC V5A 1S6" |
| registrationUrl | youngmoviemakers.ca/programs | athleticsandrecreation.its.sfu.ca (direct link) |

Sessions: Jul 6-10, Jul 13-17, Jul 20-24, Jul 27-31, Aug 4-7 (4-day), Aug 10-14, Aug 17-21

### West Van — Mulgrave School (ID 2535)
| Field | Before | After |
|-------|--------|-------|
| startDate | 2026-07-06 | 2026-07-27 (only W4 confirmed) |
| endDate | 2026-07-31 | 2026-07-31 |
| cost | null | $600 |
| priceVerified | false | true |
| ageMin | 7 | 8 |
| ageMax | 17 | 12 (Grades 3-7) |
| startTime | null | 9:00 AM |
| endTime | null | 3:30 PM |
| address | "2330 Cypress Bowl Lane" | "2330 Cypress Lane, West Vancouver, BC V7S 3H9" |
| neighbourhood | Kitsilano | British Properties |
| city | Vancouver | West Vancouver |

### Langley — TWU (ID 2541)
| Field | Before | After |
|-------|--------|-------|
| cost | null | $460 |
| priceVerified | false | true |
| ageMin | 7 | 8 |
| ageMax | 17 | 14 |
| address | "Langley — Trinity Western University" | "Trinity Western University, 7600 Glover Rd, Langley, BC V2Y 1Y1" |
| registrationUrl | youngmoviemakers.ca/programs | twu.ca/life-twu/kids-camps/young-moviemakers |

Sessions: Jun 29-Jul 3 (4-day/Canada Day), Jul 6-10, Jul 13-17, Jul 20-24, Jul 27-31, Aug 4-7 (4-day/BC Day), Aug 10-14, Aug 17-21, Aug 24-28
Pricing: $460/5-day week, $368/4-day week

---

## Locations Set to Likely Coming Soon

These locations have no confirmed 2026 schedule as of April 5, 2026. All set to:
`enrollmentStatus: Likely Coming Soon`, `confirmed2026: false`, `isEstimate: true`, `priceVerified: false`, dates cleared.

| ID | Location | Note |
|----|----------|------|
| 2536 | East Van — Hastings CC | VPR activity ID 174339 exists but closed |
| 2537 | Surrey — Clayton CC | No 2026 listing found; address fixed to 7155 187A St |
| 2538 | Maple Ridge — Meadowridge | No 2026 data found |
| 2539 | UBC — Old Barn CC | 2025 price was $450 ($405 resident); address fixed |
| 2540 | West Van — Collingwood School | Collingwood also runs own "Moviemakers" camp — needs verification |
| 2542 | Abbotsford — Abbotsford Rec | No 2026 data found |

### Additional fixes on these entries
- All ageMin corrected 7→8
- All ageMax corrected 17→14
- Surrey entry: neighbourhood fixed Kitsilano→Clayton Heights, city fixed Vancouver→Surrey
- UBC entry: address fixed to "Old Barn Community Centre, 6308 Thunderbird Blvd, Vancouver, BC V6T 1Z4"

---

## Notes

- **youngmoviemakers.ca** is a Wix site that renders content client-side — program details not accessible via static fetch
- Registration is handled through the host institution's system (SFU Athletics, TWU, VPR, Mulgrave, etc.)
- The Collingwood entry needs manual verification: Collingwood School runs its own "Moviemakers" specialty camp (Grades 3-5, Jun 22-26) which may be separate from Young Moviemakers (the organization)
