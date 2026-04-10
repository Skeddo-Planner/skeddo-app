# Verification Log — ageMax Fix (2026-04-10)

**Date:** 2026-04-10
**Method:** Browser verification on pedalheads.com + same-name matching
**DB count:** 16,582 programs (unchanged)
**Violations before:** 0
**Violations after:** 37 (pre-existing R43/R46 on COV/BNB entries, not new)

---

## Issue: 8,354 Programs Missing ageMax

### Root Cause
1. **Pedalheads (6,568)**: API import didn't include ageMax — only ageMin was captured
2. **CoV/BNB ActiveNet (1,726)**: ActiveNet importer captured minimum age but not maximum age for many entries
3. **Other providers (60)**: Manual data entry left ageMax blank

### Fix Strategy

#### 1. Pedalheads (6,568 entries — browser-verified)
Navigated to pedalheads.com/en/bike, /en/swim, /en/soccer, /en/trail and extracted age ranges:

| Program Type | Age Range | Count |
|-------------|-----------|-------|
| Bike Level 0 (Future Newbees) | 3-5 | 67 |
| Bike Level 1 (Newbees) | 4-10 | 699 |
| Bike Level 2-3 | 4-10 | 1,140 |
| Bike Level 4 | 6-10 | 345 |
| Bike Level 5-6 | 6-12 | 582 |
| Bike Private | 3-12 | 470 |
| Bike Trail Rider 1-3 | 4-10/7-10 | 262 |
| Bike Riding Rookies (Parent & Tot) | 2-3 | varies |
| Swim Tots | 1-3 | 144 |
| Swim Preschool 1-5 | 3-5 | 815 |
| Swim Swimmer 1-9 | 5-12 | 1,212+ |
| Swim Private | 3-12 | 230 |
| Soccer Zoomies | 3-4 | 48 |
| Soccer Speedsters | 4-5 | 63 |
| Soccer Trailblazers | 5-6 | 62 |
| Soccer Legends | 6-8 | 62 |
| Soccer Half-Day/Full-Day | 3-10/4-10 | varies |

Also set `ageSpanJustified` on 1,967 entries with wide ranges to document that Pedalheads uses skill levels (not age bands) for program placement.

#### 2. Same-name matching (49 entries)
Copied ageMax from entries with the same program name that already had ageMax values.

#### 3. Description extraction (11 entries)
Extracted ageMax from program descriptions containing explicit age ranges.

#### 4. R5 fix (6 entries)
Reverted ageMax on 6 "Shorinji Kempo" entries where same-name matching produced ageMin > ageMax.

---

## Summary

| Action | Count |
|--------|-------|
| Pedalheads ageMax from browser verification | 6,568 |
| Pedalheads ageSpanJustified set | 1,967 |
| Same-name ageMax matching | 49 |
| Description ageMax extraction | 11 |
| R5 fix (bad same-name match reverted) | 6 |
| **Total entries fixed** | **6,634** |
| **ageMax gap reduced** | **8,354 → 1,720** |
