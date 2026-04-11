# Verification Log — Presentation House Theatre (PHT)

**Audited:** 2026-04-06
**Queue entry:** Rank 198
**Source URLs verified (browser navigation):**
- `https://www.phtheatre.org/summer-camps/` (full schedule, names, pricing, address, times confirmed)
**DB count before audit:** 16,260 programs
**DB count after audit:** 16,262 (2 added, 4 corrected)

---

## Summary

4 existing entries corrected and 2 missing sessions added. ID 648 had a wrong program name ("D&D Theatre" at Aug 17-21) — D&D is Week 1 (Aug 10-14), Week 2 for ages 11-13 is Stage Combat. All names updated to match actual 2026 program names. Address updated to exact street address (333 Chesterfield Ave, North Vancouver). Pricing confirmed ($450/week, $850 bundle). Times already correct (9AM-3PM). Two Week 1 programs were missing from DB: D&D (11-13) and Week 2 Physical Comedy (8-10).

---

## Full 2026 Program Schedule

### Week 1: August 10-14, 2026 (9AM-3PM)

| ID | Program | Ages | Status |
|----|---------|------|--------|
| 645 (corrected) | Movement and Storytelling Theatre Camp | 5-7 | Open |
| 646 (corrected) | Fundamentals of Stagecraft Theatre Camp | 8-10 | Open |
| 613433 (**NEW**) | Dungeons & Dragons Theatre Camp | 11-13 | Open |

### Week 2: August 17-21, 2026 (9AM-3PM)

| ID | Program | Ages | Status |
|----|---------|------|--------|
| 647 (corrected) | Introduction to Storytelling Theatre Camp | 5-7 | Open |
| 613434 (**NEW**) | Physical Comedy and Movement Theatre Camp | 8-10 | Open |
| 648 (corrected) | Stage Combat Theatre Camp | 11-13 | Open |

---

## Corrections Applied

| Field | Old | New | IDs |
|-------|-----|-----|-----|
| name | "Theatre Camp (Ages 5-7): Movement & Body" | "Movement and Storytelling Theatre Camp" | 645 |
| name | "Theatre Camp (Ages 8-10): Stagecraft" | "Fundamentals of Stagecraft Theatre Camp" | 646 |
| name | "Theatre Camp (Ages 5-7): Storytelling" | "Introduction to Storytelling Theatre Camp" | 647 |
| name | "Theatre Camp (Ages 11-13): D&D Theatre" | "Stage Combat Theatre Camp" (WRONG PROGRAM for Aug 17-21 week) | 648 |
| address | Not specified | "333 Chesterfield Ave, North Vancouver, BC" | 645, 646, 647, 648 |
| lat/lng | — | 49.3216, -123.0728 (333 Chesterfield Ave) | 645, 646, 647, 648 |
| costNote | — | $450/week, $850 bundle, extended care details | all |
| description | Generic | Accurate from provider page | all |

---

## Pricing Confirmed

- $450 per week (single week)
- $850 for both weeks combined, or for multiple children (siblings)
- Extended care: 8:30 AM - 3:30 PM at no extra charge
- $25 late pickup fee after 3:30 PM

---

## Notes

- Contact: Emily Brown, 604-990-3474, producer@phtheatre.org
- Refund: Full refund if cancelled 72+ hours before start; 50% if cancelled due to illness; no refund < 72 hours
- Wheelchair accessible (ramp off 4th Street)
- Gender-neutral washrooms
- Waitlist via Box Office page if full
- ID 648 was labeled "D&D Theatre" at Aug 17-21 — this is incorrect. D&D is the Week 1 (Aug 10-14) program for ages 11-13 (now added as ID 613433). Stage Combat is the Week 2 program for ages 11-13 (now correctly named in ID 648).
