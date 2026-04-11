# Verification Log — Gracie Barra Vancouver

**Audited:** 2026-04-06
**Queue entry:** Rank 201
**Source URLs verified (browser navigation):**
- `https://www.gbvancouver.com/programs` (program types, ages confirmed)
- `https://www.gbvancouver.com/afterschool-1` (Spring & Summer Camps confirmed, 9AM-4PM)
- `https://www.gbvancouver.com/afterschool` (After School Program, ages 5-12)
- `https://www.gbvancouver.com/contact` (contact info: infovancouver@graciebarra.ca, (236) 865-2297)
**DB count before audit:** 16,266 programs
**DB count after audit:** 16,266 (0 added, 4 corrected)

---

## Summary

4 existing entries corrected. All 4 were marked confirmed2026=false and "Likely Coming Soon" — the provider is actively running all programs in 2026. Spring & Summer Camps confirmed (9:00 AM - 4:00 PM). ID 2486 had unverified cost=$400 — pricing is not listed on the website and requires direct contact. Updated all 4 to confirmed2026=true, enrollmentStatus="Open", with accurate descriptions and ageSpanJustified notes.

---

## Programs Confirmed

| ID | Program | Ages | Status |
|----|---------|------|--------|
| 2485 | Kids Brazilian Jiu-Jitsu | 3-15 | Open |
| 2486 | Summer BJJ Camp | 5-12 | Open |
| 2487 | After School BJJ Program | 5-12 | Open |
| 2488 | Kids Kickboxing | 5-15 | Open |

---

## Corrections Applied

| Field | Old | New | IDs |
|-------|-----|-----|-----|
| confirmed2026 | false | true | 2485, 2486, 2487, 2488 |
| enrollmentStatus | Likely Coming Soon | Open | 2485, 2486, 2487, 2488 |
| cost | 400 | null | 2486 (not listed on website) |
| priceVerified | — | false | 2486 |
| costNote | — | Contact info + note | all 4 |
| description | Generic | Accurate from provider page | all 4 |
| ageSpanJustified | — | Single program, no sub-bands | all 4 |

---

## What's Confirmed

| Field | Status |
|-------|--------|
| Summer 2026 camps | ✅ Confirmed ("Spring & Summer Camps" listed) |
| Camp times (9AM-4PM) | ✅ Confirmed from camps page |
| Ages 5-12 (summer camp) | ✅ Confirmed |
| Ages 3-15 (Kids BJJ) | ✅ Confirmed from programs page |
| Ages 5-12 (After School) | ✅ Confirmed from afterschool page |
| Pricing | ❌ Not listed — contact required |
| Specific camp dates | ❌ Not listed — contact required |
| Physical address (2440 Main St) | ⚠️ Not shown on website — unverified but plausible (no change) |

---

## Age Range Justification

All programs run as single cohorts with no separate age-band registrations:
- Kids BJJ (3-15yr): GB Fundamentals through Advanced — all ages, grouped by level not separate programs
- Summer Camp (5-12yr): "all experience levels" — single program
- After School (5-12yr): "daily school pick-up and age-specific training" — single program
- Kids Kickboxing (5-15yr): single program for all kids/teens ages

---

## Notes

- Contact: infovancouver@graciebarra.ca / (236) 865-2297
- No specific summer camp dates published — inquire directly
- Registration URLs verified: /afterschool-1 (camps), /afterschool (after school), Zenplanner free trial (BJJ, Kickboxing)
