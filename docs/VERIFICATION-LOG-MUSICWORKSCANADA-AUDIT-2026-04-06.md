# Verification Log — Musicworks Canada

**Audited:** 2026-04-06
**Queue entry:** Rank 189
**Source URLs verified (browser navigation):**
- `https://musicworkscanada.com/summer-programs-2026/` (program overview — all 4 programs confirmed, registration Open)
- `https://musicworkscanada.com/british-columbia/` (5 Metro Vancouver locations confirmed)
**DB count before audit:** 16,236 programs
**DB count after audit:** 16,236 (0 added, 4 corrected)

---

## Summary

All 4 existing entries confirmed as the correct 4 programs offered. Registration status changed from "Likely Coming Soon" to "Open" (page banner confirms "Registration is NOW OPEN for Summer Camp 2026"). Pricing ($350) cannot be verified — it is not shown publicly on the website and requires contacting the store or completing a popup form. `priceVerified` set to false, `cost` set to null. `durationPerDay` corrected from 7hrs (assumed) to actual published hours. Specific session dates are NOT published on the website (flexible 1-3 week scheduling model) — entries marked `isEstimate: true`. Prodigy A (ID 141) corrected to Half Day (4hrs/day).

---

## Programs Confirmed

| ID | Program | Ages | Hours/Week | hrs/day | Status |
|----|---------|------|-----------|---------|--------|
| 139 | Build Your Own Ukulele Camp | 5-12 | 30 hrs | 6 | Open |
| 140 | STEM Einstein Camp (Math & Coding) | 5-12 | 30 hrs | 6 | Open |
| 141 | Beginning Music Prodigy (Ages 5-7) | 5-7 | 20 hrs | 4 | Open |
| 142 | Beginning Music Prodigy (Ages 8-12) | 8-12 | 25 hrs | 5 | Open |

All located at: 4101 Arbutus St, Vancouver (Kerrisdale neighbourhood) — Musicworks Canada Vancouver Arbutus location.

---

## Fixes Applied

| Field | Old | New | IDs |
|-------|-----|-----|-----|
| enrollmentStatus | Likely Coming Soon | Open | 139, 140, 141, 142 |
| cost | 350 | null | 139, 140, 141, 142 |
| priceVerified | true | false | 139, 140, 141, 142 |
| durationPerDay | 7 | 6 | 139, 140 |
| durationPerDay | 7 | 4 | 141 |
| durationPerDay | 7 | 5 | 142 |
| scheduleType | Full Day | Half Day | 141 |
| dayLength | Full Day | Half Day | 141 |
| isEstimate | — | true | 139, 140, 141, 142 |
| costNote | "Price may vary…" | Full details with hours + contact info | 139, 140, 141, 142 |

---

## Notes

- Pricing is NOT published on the website — requires popup signup form or direct contact with store
- Specific weekly session dates are NOT published (flexible 1-3 week scheduling per location)
- 5 Metro Vancouver locations: North Vancouver (Lynn Valley), Richmond (River Road), Surrey (Clayton), Surrey (White Rock), Vancouver (Arbutus). DB entries are at Vancouver Arbutus only — other locations could have their own entries in a follow-up audit
- Program hours from published summary table: BYOU 30hr, STEM 30hr, Prodigy A 20hr, Prodigy B 25hr
- No new programs found — the 4 types in DB match the 4 offered
