# Verification Log — Rainforest Adventure Camps

**Audited:** 2026-04-06
**Queue entry:** Rank 161
**Source URLs verified:**
- `https://www.rfcamps.com/` (main page — full schedule, rates, dates, locations)
- `https://www.rfcamps.com/Coquitlam-Camps/` (Coquitlam page — age breakdowns, location sub-programs)
**Address:** Various daily meeting locations across Metro Vancouver (nomadic camp model)
**DB count before audit:** 16,171 programs
**DB count after audit:** 16,173 (+2 added, 8 corrected)

---

## Summary

Rainforest Adventure Camps is a non-profit running outdoor day camps across 15+ locations in Metro Vancouver (Jun 26–Sep 4, 2026). The DB had 8 entries (ids 551-558) covering only weeks 2-9 (Jul 6–Aug 28), all missing ageSpanJustified and costNote. id=555 (BC Day week Aug 4-7) had wrong cost ($275 vs $220) and wrong days (Mon-Fri vs Tue-Fri). Added 2 missing weeks.

---

## Camp Details

| Field | Value |
|-------|-------|
| Season | Jun 26–Sep 4, 2026 |
| Hours | 9am–4pm |
| Standard price | $275/week or $55/day |
| Holiday weeks | $220/week (Jun 29–Jul 3 Canada Day, Aug 4–7 BC Day) |
| No camp | Jul 1 (Canada Day), Aug 3 (BC Day) |
| Ages | K–Grade 2 (Kids Only camps), 7–12+ (standard), 10–12+ (Youth Only) |
| Before/after care | 8–9am and 4–6pm, $10/hour, by request |
| Registration | Email to info@rfcamps.com via rfcamps.com/Register/ |

---

## 2026 Season Schedule

| Week | Dates | Days | Cost | DB Entry | Action |
|------|-------|------|------|----------|--------|
| Jun 26 | Fri only | Fri | $55/day | — | Not in DB (single day) |
| W1 | Jun 29–Jul 3 | Mon, Tue, Thu, Fri (Jul 1 off) | $220 | RFC-2026-W1 | **Added** |
| W2 | Jul 6–10 | Mon–Fri | $275 | 551 | Fixed (name, costNote, ageSpanJustified) |
| W3 | Jul 13–17 | Mon–Fri | $275 | 552 | Fixed |
| W4 | Jul 20–24 | Mon–Fri | $275 | 553 | Fixed |
| W5 | Jul 27–31 | Mon–Fri | $275 | 554 | Fixed |
| W6 | Aug 4–7 | Tue, Wed, Thu, Fri (Aug 3 off) | $220 | 555 | Fixed cost $275→$220, days Mon-Fri→Tue-Fri |
| W7 | Aug 10–14 | Mon–Fri | $275 | 556 | Fixed |
| W8 | Aug 17–21 | Mon–Fri | $275 | 557 | Fixed |
| W9 | Aug 24–28 | Mon–Fri | $275 | 558 | Fixed |
| W10 | Aug 31–Sep 4 | Mon–Fri | $275 | RFC-2026-W10 | **Added** |

---

## Locations Served (all same pricing)

**Tri-Cities:**
- Tri-Cities North (ages 7-12+) — White Pine Beach, Coquitlam River, Eagle Ridge Pool
- Tri-Cities East (ages 7-12+) — Coquitlam River, Centennial Pool, Hyde Creek Pool
- Tri-Cities West (ages 7-12+) — Mundy Park Pool, Westhill Park Pool
- Kids Only: Port Coquitlam (K-Gr 2) — shallow wading pools
- Kids Only: Coquitlam (K-Gr 2) — Blue Mountain Park, Rochester Park
- Youth Only: Tri-Cities (ages 10-12+)
- Reel Adventures: Tri-Cities (ages 7-12+) — video-making focus

**Other Metro Vancouver:** Burnaby, New Westminster, Vancouver West Side, Richmond, Maple Ridge/Pitt Meadows, North Vancouver, Langley, Surrey

---

## Fixes Applied

| ID | Field | Old | New |
|----|-------|-----|-----|
| All (551-558) | name | "Adventure Day Camp" | "Rainforest Adventure Camp — Week N (dates)" |
| All (551-558) | ageSpanJustified | (missing) | Added (K–12+: three age groups at same price) |
| All (551-558) | costNote | (missing) | Added (holiday week pricing details) |
| All (551-558) | description | older text | Updated to reflect full Metro Vancouver scope |
| 555 | cost | $275 | $220 (BC Day 4-day week) |
| 555 | days | Mon, Tue, Wed, Thu, Fri | Tue, Wed, Thu, Fri |

---

## Notes

- Registration is by email (info@rfcamps.com via registration form) — no online booking system
- Provider is non-profit — prices are notably lower than other camp providers
- DB entries represent generic Tri-Cities entries; separate entries for other Metro Van locations (Burnaby, North Van, Vancouver West Side, etc.) would be a future enhancement
- Jun 26 (single Friday, $55/day) not added to DB — a single day, not a full week listing
- Age breakdown varies by sub-camp type (Kids Only K-Gr2, Kids 7-9, Youth 10-12+) — DB uses combined range 5-12 with ageSpanJustified
