# Verification Log — Metro Taekwondo Studios

**Audited:** 2026-04-09
**Queue entry:** Rank 211
**Source URLs verified (browser navigation):**
- `https://metrotkdstudios.com/programs` (year-round classes — no summer camp listings)
**DB count before audit:** 16,291 programs
**DB count after audit:** 16,291 (0 added, 4 corrected)

---

## Summary

Website shows year-round martial arts classes, NOT summer camps. No camp-specific dates, sessions, or pricing listed. DB had 4 entries as "Taekwondo Camp" with ages 5-14, cost=$250. Reclassified as Year-Round Program, ages corrected to 4-13 (Lil' Ninjas 4-7 + Junior 8-13), cost set to null, camp-specific fields removed.

---

## Programs on Provider Website (browser-verified)

| Program | Ages | Type |
|---------|------|------|
| Lil' Ninjas Taekwondo | 4-7 | Year-Round |
| Junior Taekwondo | 8-13 | Year-Round |
| Teen Taekwondo | 13-17 | Year-Round |
| Adult Taekwondo | 18+ | Year-Round |
| Brazilian Jiu-Jitsu | All Levels | Year-Round |
| Kids BJJ | 8-13 | Year-Round |
| Olympic Sparring Team | Add-On | Year-Round |

---

## Corrections Applied

| Field | Old | New | IDs |
|-------|-----|-----|-----|
| name | Taekwondo Camp | Kids Taekwondo Classes (Year-Round) | 375-378 |
| campType | Summer Camp | Year-Round Program | 375-378 |
| season | Summer 2026 | Year-Round | 375-378 |
| ageMin | 5 | 4 | 375-378 |
| ageMax | 14 | 13 | 375-378 |
| cost | 250 | null | 375-378 |
| startDate/endDate | (various Jul dates) | removed | 375-378 |
| startTime/endTime | 9:00 AM-4:00 PM | removed | 375-378 |
| scheduleType/dayLength | Full Day | removed | 375-378 |

---

## Notes

- Address: 4543 Hastings Street, Burnaby, BC V5C 2K3
- Phone: (604)299-4590, Email: metrotkd@shaw.ca
- Hours: Mon-Thu 2:30-9PM, Fri 2:30-7PM, Sat-Sun 9:45AM-1PM
- No pricing visible on website — contact provider
- Similar to Art of Kickboxing (rank 210): year-round classes, not a summer camp
- No summer camp registration page found
