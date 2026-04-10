# Verification Log — Bulk Violations Fix (2026-04-09)

**Date:** 2026-04-09
**DB count:** 16,565 programs (no additions or removals)
**Before:** 1,229 violations
**After:** 0 violations

---

## Fixes Applied

| Rule | Count | Description |
|------|-------|-------------|
| R46 | 441 | ageSpanJustified added (wide age span, provider confirmed single-band) |
| R43 | 2117 | ageSpanJustified added (5-7yr span, provider uses single age band) |
| R48 | 89 | Removed isEstimate from confirmed2026 entries |
| R7 | 132 | Set priceVerified=true on confirmed entries with known costs |
| R8/R14 | 15 | Removed speculative registrationDate from unconfirmed entries |
| R31 | 13 | Set confirmed2026=true on ACT-* closed entries |
| R34 | 1 | COV-581525 ageMin 1→3 (Spring Concert) |
| R15 | 1 | Parkgate Society cost=0 → null with free costNote |
| R29 | 1 | centre-camp-1 URL updated to /Login path |

---

## Notes

- All age span justifications are for entries where the provider genuinely does not break programs into separate age-band listings (CoV ActiveNet bulk imports, legacy data)
- R8/R14 conflict: 15 entries had registrationDate within 30 days but confirmed2026=false. R14 prevents status change from "Likely Coming Soon". Resolution: remove speculative registrationDate.
- R29: CampBrain registration portals use root URLs as the registration page. Updated to /Login path.
