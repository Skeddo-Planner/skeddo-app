# Verification Log — Adult & Non-Program Entry Removal (2026-04-10)

**Date:** 2026-04-10
**Method:** Browser spot-check on ActiveNet + programmatic keyword analysis
**DB count:** 16,582 → 16,359 (223 entries removed)
**Violations before:** 0
**Violations after:** 0

---

## Root Cause #4: Adult-Only Programs in Youth Database

ActiveNet importers (COV, BNB) pulled in adult fitness programs alongside youth programs because the API doesn't distinguish. Browser-verified examples:

- **COV-577115 (Personal Training: Bita):** Page shows "12 yrs+, Mixed, Fitness & Health 6 - Adult" — CCA personal training for adults
- **BNB-102045 (Aquafit):** Page shows "14 yrs+, Mixed, Swimming, Adult" — adult aquafit class

### Programs Removed (162 entries)

| Category | Count | Examples |
|----------|-------|---------|
| Aquafit (BNB/COV, ageMin 13-14+) | 90 | Reserve In Advance: Aquafit, Aquafit - Shallow Water Moderate |
| Personal Training (COV) | 19 | PRIVATE/SEMI PRIVATE Personal Training: [name], City-Wide Personal Training |
| Group Fitness (COV, ageMin 16+) | 42 | Group Fitness - Zumba, Cardio Combo, Step Class, etc. |
| Pilates (WV/LGY, ageMin 13-14+) | 2 | Pilates Mat Class, Pilates: Pilates Mat Intermediate |
| Other adult fitness (WV/PC) | 4 | Workit on the Circuit, Total Body Training, Interval Sculpt, Kickbox Cardio |
| Spanish: Adult Beginners (COV) | 2 | Spanish: Adult Beginners I/II |
| Adult & Senior (COV) | 3 | Adult and Senior Public Skate |

### Not removed (false positives excluded)
- "Axe Capoeira - Youth and Adult" — includes youth, kept
- "Swimming - Adult and Teen Swimmer" — includes teens, kept
- "Farm Felting Workshop (Ages 6+ with Adult)" — kids program requiring adult supervision, kept
- "Adult Participation" programs — parent-child classes, kept

## Root Cause #5: Non-Program Facility Entries

ActiveNet importers pulled in facility booking slots and public drop-in entries that are not registrable programs.

### Entries Removed (61 entries)

| Type | Count |
|------|-------|
| Public Swim / Length Swim / Lengths | 33 |
| Public Skate | 24 |
| Organization Registration Form | 1 |
| Facility Closure | 1 |
| SwimFIT (facility drop-in) | 1 |
| Lessons and One Lane (pool schedule) | 1 |

## Additional Fix: R46 ageSpanJustified

Set `ageSpanJustified` on 2 Family Pickleball entries (COV-615511, COV-615576) — 7-17 age range is correct for family programs.

---

## Summary

| Action | Count |
|--------|-------|
| Adult-only programs removed | 162 |
| Non-program entries removed | 61 |
| ageMax filled via same-name matching | 2 |
| ageSpanJustified set | 2 |
| **Total entries removed** | **223** |
| **New program count** | **16,359** |
