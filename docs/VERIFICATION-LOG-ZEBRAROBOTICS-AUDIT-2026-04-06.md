# Verification Log — Zebra Robotics (Richmond)

**Audited:** 2026-04-06
**Queue entry:** Rank 169
**Source URLs verified:**
- `https://www.zebrarobotics.com/richmond/camps` (8 program types, pricing)
- `https://www.zebrarobotics.com/richmond/camps/58` (Building Enthusiasts — schedule dropdown)
**DB count before audit:** 16,194 programs
**DB count after audit:** 16,194 (0 added, 6 corrected)

---

## Summary

One Metro Vancouver location: Richmond (8600 Cambie Road, Unit 210). DB had 6 entries all named "Robotics & Coding Camp" with wrong cost ($350). Website shows 8 distinct program types, each $249-$449/week (likely half-day vs full-day). July 2026 sessions confirmed in schedule dropdown. Fixed cost, names, ageSpanJustified, days format.

---

## 8 Program Types Available (Richmond location)

| Program | Code | Category | Grade |
|---------|------|----------|-------|
| Building Enthusiasts | SR150 | Robotics/LEGO | Grade 1+ |
| Jr. Game Developer I | SC200 | Coding/Scratch | Grade 1+ |
| Adventures in Building | SR350 | Robotics/LEGO WeDo | Grade 3+ |
| Minecraft Adventures | SC350 | Coding/Minecraft | Grade 3+ |
| Robotics Engineer I Bootcamp | SR400 | Robotics | Grade 4+ |
| Roblox Adventures | SC650 | Coding/Roblox | Grade 6+ |
| Web Design Bootcamp | SC600 | Coding/HTML/CSS/JS | Grade 6+ |
| Robotics Engineer II Bootcamp | SR600 | Robotics/Spike | Grade 6+ |

Pricing: $249-$449/week (+ taxes). Most programs $249-$449; Web Design $210-$449.

---

## Fixes Applied (ids 209-214)

| Field | Old | New |
|-------|-----|-----|
| name | "Robotics & Coding Camp" | "Zebra Robotics Summer Camp — Week N (dates)" |
| cost | 350 | null (range $249-$449, type TBD at registration) |
| costNote | (missing) | Full pricing detail, 8 program types listed |
| ageSpanJustified | (missing) | Added — Grade 1-6+ range (~ages 6-14) |
| days | "Mon-Fri" | "Mon, Tue, Wed, Thu, Fri" (normalized) |
| id=213 days | "Mon-Fri" | "Tue, Wed, Thu, Fri" (BC Day Aug 3 off) |
| description | "Robotics and coding camp with hands-on building." | Full description with 8 program types |
| priceVerified | true | false (range shown, not confirmed per session type) |

---

## Notes

- DB address "8600 Cambie Road, Unit 210, Richmond, BC" kept (not contradicted by site)
- 8 programs run concurrently each week — DB maintains 6 weekly entries representing the season
- "Open" status appropriate: July 2026 sessions confirmed in schedule dropdown
- confirmed2026=true appropriate: July available for booking
- Pricing range $249-$449 likely represents half-day ($249) vs full-day ($449) — not confirmed
- Week 5 (Aug 4-7) corrected to Tue-Fri (BC Day Aug 3 off)
