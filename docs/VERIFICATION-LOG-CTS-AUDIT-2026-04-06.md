# Verification Log — CTS Youth Society

**Audited:** 2026-04-06
**Queue entry:** Rank 194
**Source URLs verified (browser navigation):**
- `https://ctsyouthsociety.com/` (homepage — summer 2026 confirmed, registration May 11, ages 12-18, free)
- `https://ctsyouthsociety.com/programs/camps/` (camp types: Weekday Activity Tue-Fri, Overnight 3-night, Mishkoopitum)
- `https://ctsyouthsociety.com/register/` (registration opens May 11, 2026)
- `https://ctsyouthsociety.com/important-dates/` (Summer 2026 Calendar — no schedule published yet)
**DB count before audit:** 16,254 programs
**DB count after audit:** 16,254 (0 added, 4 corrected)

---

## Summary

4 existing entries corrected. Major errors: enrollmentStatus "Open" (wrong — registration doesn't open until May 11, 2026), name "Outdoor Leadership Camp" (not found on provider website), days "Mon-Fri" (Weekday Activity Camps run Tue-Fri at Burnaby Lake). Enrollment status corrected to "Upcoming" (R8: registration opens within 35 days). Overnight Adventure Camps and Mishkoopitum Camps exist but are not in DB — adding them must wait until the 2026 schedule is published when registration opens.

---

## What's Confirmed

| Field | Status |
|-------|--------|
| Summer 2026 programming | ✅ Confirmed |
| All programs free | ✅ Confirmed ($0) |
| Ages 12-18 | ✅ Confirmed |
| Registration opens May 11, 2026 | ✅ Confirmed |
| Weekday Activity Camps: Tue-Fri at Burnaby Lake | ✅ Confirmed |
| Specific 2026 session dates | ❌ Not published yet |
| Overnight/Mishkoopitum schedule | ❌ Not published yet |

---

## Program Types Confirmed (for future DB additions)

| Type | Schedule | Location | Notes |
|------|---------|----------|-------|
| Weekday Activity Camp | Tue-Fri | Burnaby Lake Regional Park | Day camp |
| Overnight Adventure Camp | 3-day/2-night weekends | Tynehead, Capilano River, Pacific Spirit | Multi-location |
| Mishkoopitum Camp | Overnight | All 4 park locations | Indigenous-led by 2MetisWomen |

---

## Corrections Applied

| Field | Old | New | Affected IDs |
|-------|-----|-----|-------------|
| name | "Outdoor Leadership Camp" | "Weekday Activity Camp" | 519, 520, 521, 522 |
| days | Mon-Fri | Tue-Fri | 519, 520, 521, 522 |
| enrollmentStatus | Open | Upcoming | 519, 520, 521, 522 |
| registrationDate | — | 2026-05-11 | 519, 520, 521, 522 |
| registrationUrl | cts.campbrainregistration.com (login wall) | ctsyouthsociety.com/register/ | 519, 520, 521, 522 |
| costNote | — | Full explanation with registration date | 519, 520, 521, 522 |
| description | Generic | Accurate description from camps page | 519, 520, 521, 522 |

---

## Notes

- Registration system: CampBrain at cts.campbrainregistration.com (requires account — not auditable without login)
- Contact: info@ctsyouthsociety.com | 604-562-0583
- Address: 6825 Cariboo Rd, Burnaby, BC V3N 4A3 (office) — camps at regional parks
- $25 admin fee for late cancellations (< 36 hours notice) — not a program cost
- Overnight/Mishkoopitum Camps not yet added — check ctsyouthsociety.com/important-dates/ after May 11 for full schedule
