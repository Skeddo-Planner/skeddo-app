# Verification Log — Dynamo Fencing

**Audited:** 2026-04-09
**Queue entry:** Rank 209
**Source URLs verified (browser navigation):**
- `https://www.dynamofencing.com/camps` (all locations, dates, pricing, registration link)
- Registration: Google Forms link on page
**DB count before audit:** 16,285 programs
**DB count after audit:** 16,291 (6 added, 4 corrected)

---

## Summary

DB had 4 generic entries for Jul 6-31 with no location differentiation. Provider offers camps at 3 locations (Gastown, North Van, Richmond) with 2 sessions each, plus full-day option at Gastown only, plus a Pro-D Day camp. ID 360 (Jul 27-31) doesn't exist on the page — deactivated. 3 existing entries corrected with proper locations/times. 6 new entries added.

---

## Programs Verified (browser-checked)

### Half-Day Camps (12:00 PM - 3:00 PM, $349 + GST)

| ID | Location | Dates |
|----|----------|-------|
| 357 | Richmond (2231 Vauxhall Pl) | Jul 6-10 |
| dynamo-richmond-aug | Richmond | Aug 3-7 |
| 358 | North Vancouver (238 Fell Ave) | Jul 13-17 |
| dynamo-northvan-aug | North Vancouver | Aug 10-14 |
| 359 | Gastown (211 Columbia St #100) | Jul 20-24 |
| dynamo-gastown-aug-half | Gastown | Aug 17-21 |

### Full-Day Camps (9:00 AM - 3:00 PM, $499 + GST, Gastown only)

| ID | Location | Dates |
|----|----------|-------|
| dynamo-gastown-jul-full | Gastown | Jul 20-24 |
| dynamo-gastown-aug-full | Gastown | Aug 17-21 |

### Pro-D Day Camp ($119 + GST)

| ID | Location | Date |
|----|----------|------|
| dynamo-prod-apr20 | Gastown | Apr 20, 2026 |

### Deactivated

| ID | Reason |
|----|--------|
| 360 | Jul 27-31 session doesn't exist on 2026 page |

---

## Corrections Applied

| Field | Old | New | IDs |
|-------|-----|-----|-----|
| name | "All Level Summer Camp" | Location-specific names | 357-359 |
| startTime/endTime | (various) | 12:00 PM - 3:00 PM | 357-359 |
| scheduleType | Full Day | Half Day (PM) | 357-359 |
| address | (generic) | Location-specific addresses | 357-359 |
| registrationUrl | /camps page | Google Forms direct link | 357-359 |
| confirmed2026 | true | false | 360 |

---

## Notes

- All equipment provided for all camps
- Registration via Google Forms
- Ages listed as 6-16 in DB; page says "All Level (Beginner)" without specifying exact ages
- Pro-D Day Camp: bring lunch/snacks, extended hours available for extra charge
- Also offers HP (High Performance) camps at separate link — not in scope for this audit (competitive fencing)
- Contact: pacificcoastvc@gmail.com (note: different from PCVC volleyball)
