# Pedalheads Final Spot-Check — April 3, 2026

One sample browser-verified per category. All navigation done via pedalheads.com live pages.

---

## Summary

| Category | Sample (ID) | Location | Result |
|----------|-------------|----------|--------|
| Bike Camp half-day AM | 11972 | Langley – Walnut Grove | ✅ PASS |
| Bike Camp half-day PM | 10471 | Richmond – No 2 & Blundell | ✅ PASS |
| Bike Camp full-day | 9520 | Burnaby – Brentwood | ✅ PASS |
| Bike/Soccer Combo | 2880 | Vancouver – Kensington | ⚠️ PASS (description fixed) |
| Bike/Swim Combo | 13301 | Vancouver – Point Grey | ⚠️ PASS (campType flagged) |
| Trail/Swim Combo | 3012 | North Vancouver – Lynn Valley | ℹ️ NOT YET CONFIRMED |
| Soccer half-day | 12502 | Vancouver – Point Grey | ✅ PASS |
| Trail Riding | 10061 | North Vancouver – Lynn Valley | ✅ PASS |
| Private Lesson | 9479 | Vancouver – Arbutus Ridge | ✅ PASS |

> **Swim Lessons standalone:** Pedalheads does not offer standalone swim lessons — swimming is only available as part of Bike/Swim or Trail/Swim combos. Category covered by the Bike/Swim Combo check above.

---

## Category Detail

### 1. Bike Camp Half-Day AM — Langley (ID 11972)

**URL verified:** `https://pedalheads.com/en/camp/details?region=1&program_event=32419&skill_level=2153&category_time=1`

| Field | Our Data | Website | Match? |
|-------|----------|---------|--------|
| Name | Bike Camp Level 4 – Advanced Pedalheads | "Level 4 - Advanced Pedalheads" | ✅ |
| Location | Walnut Grove - Alex Hope Elementary | Walnut Grove - Alex Hope Elementary, 21150 85th Ave | ✅ |
| Dates | Jun 29 – Jul 3, 2026 | Mon Jun 29 – Fri Jul 3, 2026 | ✅ |
| Times | 9:00 AM – 12:00 PM | 9:00am–12:00pm | ✅ |
| Ages | 6+ | Ages 6 and up | ✅ |
| Cost | $264 | $264/child | ✅ |
| Status | Open (reg opens Apr 7) | Registration opens Apr 7, 2026 | ✅ |

**Result: PASS — all fields verified correct.**

---

### 2. Bike Camp Half-Day PM — Richmond (ID 10471)

**URL verified:** `https://pedalheads.com/en/camp/details?region=1&program_event=30552&skill_level=2153&category_time=2`

| Field | Our Data | Website | Match? |
|-------|----------|---------|--------|
| Name | Bike Camp Level 4 – Advanced Pedalheads | "Level 4 - Advanced Pedalheads" | ✅ |
| Location | No 2 & Blundell - Richmond Baptist Church | No 2 & Blundell - Richmond Baptist Church, 6640 Blundell Rd | ✅ |
| Dates | Jun 29 – Jul 3, 2026 | Mon Jun 29 – Fri Jul 3, 2026 | ✅ |
| Times | 1:00 PM – 4:00 PM | 1:00pm–4:00pm | ✅ |
| Ages | 6+ | Ages 6 and up | ✅ |
| Cost | $264 | $264/child | ✅ |

**Result: PASS — all fields verified correct.**

---

### 3. Bike Camp Full-Day — Burnaby (ID 9520)

**URL verified:** `https://pedalheads.com/en/camp/details?region=1&program_event=30372&skill_level=2153&category_time=3`

| Field | Our Data | Website | Match? |
|-------|----------|---------|--------|
| Name | Bike Camp Level 4 – Advanced Pedalheads | "Level 4 - Advanced Pedalheads" | ✅ |
| Location | Brentwood - Brentwood Park Alliance Church | Brentwood - Brentwood Park Alliance Church, 1410 Delta Ave | ✅ |
| Dates | Jun 29 – Jul 3, 2026 | Mon Jun 29 – Fri Jul 3, 2026 | ✅ |
| Times | 9:00 AM – 4:00 PM | 9:00am–4:00pm | ✅ |
| Ages | 6+ | Ages 6 and up | ✅ |
| Cost | $452 | $452/child | ✅ |

**Result: PASS — all fields verified correct.**

---

### 4. Bike/Soccer Combo — Vancouver (ID 2880)

**URL:** `https://pedalheads.com/en/british-columbia/vancouver` (city fallback — intentional)

**Why generic URL?** Tom's commit 28b0454 (Apr 3, 2026) checked all 424 unique program_event IDs via Pedalheads internal API — 58 returned `{"success":false,"message":"Camp not found"}` and were replaced with city-level fallbacks. All 25 Bike/Soccer combo URLs are in this group. The Vancouver city page confirms combos exist ("combo options with bike and soccer camps").

| Field | Our Data | Verified | Match? |
|-------|----------|---------|--------|
| Program exists on site | — | Vancouver city page confirms combos | ✅ |
| Cost (5-day weeks) | $545 | Browser-confirmed by commit 34e55ad | ✅ |
| Cost (BC Day shortened week, ID 2884) | $436 | Correct for 4-day week | ✅ |
| Description price text | Was `$436/week` for 14 programs | **FIXED → $545/week** | ✅ fixed |

**Issues found and fixed:**
- 14 programs (Vancouver IDs 2880–2883, 2885–2887 + Langley IDs 2988–2991, 2993–2995) had stale `$436/week` in description text while cost field correctly showed $545. Descriptions updated.

**Result: PASS with fix applied.**

---

### 5. Bike/Swim Combo — Vancouver (ID 13301)

**URL verified:** `https://pedalheads.com/en/camp/details?region=1&program_event=32633&skill_level=2242&category_time=4348`

| Field | Our Data | Website | Match? |
|-------|----------|---------|--------|
| Name | Bike & Swim Combo – Preschool 1: Octopus | "Preschool 1: Octopus" | ✅ |
| Location | Point Grey, 4196 West 4th Ave | Point Grey - Jericho Hill Centre, 4196 West 4th Ave, V6R 4J5 | ✅ |
| Dates | Jun 29 – Jul 3, 2026 | Mon Jun 29 – Fri Jul 3, 2026 | ✅ |
| Times | 1:00 PM – 6:30 PM | 1:00pm–6:30pm | ✅ |
| Ages | 4+ | Ages 4 and up | ✅ |
| Cost | $508 | $508/child | ✅ |

**Finding (not fixed — needs Tom's decision):**
- 2,497 Bike/Swim combo programs have `campType: "Weekly Class"`. The Pedalheads website labels these "Bike/Swim Combo **camp**" and each runs as a specific summer week. These should likely be `"Summer Camp"`, but changing 2,497 records requires deliberate confirmation. Flagged for Tom.

**Result: PASS — core data correct. campType question flagged.**

---

### 6. Trail/Swim Combo — North Vancouver (ID 3012)

**URL:** `https://pedalheads.com/en/british-columbia/north-vancouver` (city fallback)

| Field | Our Data | Status |
|-------|----------|--------|
| confirmed2026 | false | Appropriately unconfirmed |
| enrollmentStatus | Likely Coming Soon | Correct — program not yet announced |
| isEstimate | true | Correct — prices estimated from prior year |
| North Van city page | — | No mention of Trail/Swim Combo at all |

The Trail/Swim Combo at Lynn Valley is not yet confirmed for 2026. The North Vancouver city page does not mention it. Data is correctly marked "Likely Coming Soon" / `confirmed2026: false`.

**Result: NOT YET CONFIRMED — data status is appropriate, no fix needed.**

---

### 7. Soccer Half-Day — Vancouver (ID 12502)

**URL verified:** `https://pedalheads.com/en/camp/details?region=1&program_event=32165&skill_level=2297&category_time=4882`

| Field | Our Data | Website | Match? |
|-------|----------|---------|--------|
| Name | Soccer Camp – Zoomies - 3-4 Years Old | "Zoomies - 3-4 Years Old" | ✅ |
| Location | Point Grey, 4196 West 4th Ave | Point Grey - Jericho Hill Centre (Outdoor), 4196 West 4th Ave | ✅ |
| Dates | Jun 29 – Jul 3, 2026 | Mon Jun 29 – Fri Jul 3, 2026 | ✅ |
| Times | 9:00 AM – 12:00 PM | 9:00am–12:00pm | ✅ |
| Ages | 3+ | Ages 3 and up | ✅ |
| Cost | $216 | $216/child | ✅ |

**Result: PASS — all fields verified correct.**

---

### 8. Trail Riding — North Vancouver (ID 10061)

**URL verified:** `https://pedalheads.com/en/camp/details?region=1&program_event=30513&skill_level=2273&category_time=4417`

| Field | Our Data | Website | Match? |
|-------|----------|---------|--------|
| Name | Bike Camp – Trail Rider 1 | "Trail Rider 1 - Must ride two-wheeler bike" | ✅ |
| Location | Lynn Valley - Brockton Kilmer Park | Lynn Valley - Brockton Kilmer Park (Trail Riding), 3467 Duval Rd | ✅ |
| Dates | Jul 6 – Jul 10, 2026 | Mon Jul 6 – Fri Jul 10, 2026 | ✅ |
| Times | 9:15 AM – 12:15 PM | 9:15am–12:15pm | ✅ |
| Ages | 4+ | Ages 4 and up | ✅ |
| Cost | $340 | $340/child | ✅ |

**Result: PASS — all fields verified correct.**

---

### 9. Private Lesson — Vancouver (ID 9479)

**URL verified:** `https://pedalheads.com/en/camp/details?region=1&program_event=30362&skill_level=2021&category_time=2016`

| Field | Our Data | Website | Match? |
|-------|----------|---------|--------|
| Name | Bike Camp – Private Lesson | "Private Lesson" | ✅ |
| Location | Arbutus Ridge - Prince of Wales Mini | Arbutus Ridge - Prince of Wales Mini, 2250 Edington Dr | ✅ |
| Dates | Jun 29 – Jul 3, 2026 | Mon Jun 29 – Fri Jul 3, 2026 | ✅ |
| Times | 4:05 PM – 5:00 PM | 4:05pm–5:00pm | ✅ |
| Ages | 3+ | Ages 3 and up | ✅ |
| Cost | $296 | $296/child | ✅ |

**Result: PASS — all fields verified correct.**

---

## Generic City URLs — Context

225 programs use city-level fallback URLs (e.g. `pedalheads.com/en/british-columbia/vancouver`). This is **intentional**, not an error. Tom's commit 28b0454 (Apr 3) checked every program_event ID via the Pedalheads internal API and replaced IDs that returned `"Camp not found"` with city fallbacks. These URLs still direct parents to the correct city registration page where all programs are listed.

Affected categories: Bike Camp Level 1 (149), Bike/Soccer Combo (24), Bike/Swim Combo Level 1 (16), Trail/Swim Combo (8), Bike Camp Level 2 (13), Bike Camp Level 3 (13).

---

## Open Question for Tom

**campType for Bike/Swim Combos:** 2,497 programs have `campType: "Weekly Class"`. The Pedalheads website labels these "Bike/Swim Combo **camp**" and each runs as a specific summer week (not recurring lessons). These should likely be `"Summer Camp"`. Requires a deliberate bulk update — confirm before changing.

---

## Fix Applied in This Session

| Fix | Programs affected |
|-----|------------------|
| Updated description text from `$436/week` → `$545/week` in Bike/Soccer Combo 5-day weeks | 14 programs (Vancouver IDs 2880–2883, 2885–2887; Langley IDs 2988–2991, 2993–2995) |

---

*Spot-check completed: April 3, 2026. Verified by browser navigation on pedalheads.com.*
