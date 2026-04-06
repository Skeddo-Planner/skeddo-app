# Verification Log — VISST (Vancouver Independent School for Science and Technology)

**Audited:** 2026-04-06
**Queue entry:** Rank 150
**Source URLs verified:**
- `https://www.visst.ca/camps` (full 2026 schedule)
- `https://drive.google.com/file/d/1YuTTn3kt_UHbjGLReYSsoVKMT-mG1yqe/view` (2026 brochure PDF)
- `https://www.visst.ca/camps-old` (store page for pricing)
**Address:** 1490 West Broadway, 2nd Floor, Vancouver, BC V6H 1H2 (Fairview)
**DB count before audit:** 16,092 programs
**DB count after audit:** 16,116 (+24 added, 6 existing entries corrected/Cancelled)

---

## Summary

VISST offers 24 distinct half-day and full-day summer camp programs across 9 weeks in 2026.
The DB had 6 generic "Game Development Camp" placeholder entries (ids 175-180) which is NOT
a 2026 VISST program. All 6 were marked Cancelled; 24 correct per-program entries added.

---

## Price Verification (from visst.ca/camps-old store)

| Camp Type | Price |
|-----------|-------|
| 5-day half-day camps (most programs) | CA$300 |
| 4-day half-day camps (Canada Day week, BC Day week) | CA$240 |
| Science Matters: Engineering — half-day AM or PM | CA$315 |
| Science Matters: Engineering — Full Day | CA$590 |
| Combo savings (most pairs) | $40 off |
| Combo savings (3D Design + Sticker Making, 3D Print + Claymation) | $30 off |

---

## 2026 Schedule (all programs verified from live page)

### June 29 – July 3, 2026 (4-day, no class Canada Day Jul 1)
| ID | Name | Time | Grades | Price |
|----|------|------|--------|-------|
| VISST-3dprint-jun29 | 3D Design and Printing | 9am–12noon | 5-8 | $240 |
| VISST-sticker-jun29 | Sticker Making and Crafting with Cricut | 1–4pm | 5-8 | $240 |

### July 6–10, 2026
| ID | Name | Time | Grades | Price |
|----|------|------|--------|-------|
| VISST-makerlab-jul6 | Maker Lab: Digital Design and Fabrication | 9am–12noon | 5-9 | $300 |
| VISST-mathgames-jul6 | How to Win at Games using Math | 1–4pm | 5-7 | $300 |

### July 13–17, 2026
| ID | Name | Time | Grades | Price |
|----|------|------|--------|-------|
| VISST-science-am-jul13 | Science Matters: Engineering Design Competition (AM) | 9am–12noon | 5-8 | $315 |
| VISST-science-pm-jul13 | Science Matters: Engineering Design Competition (PM) | 1–4pm | 5-8 | $315 |
| VISST-science-fd-jul13 | Science Matters: Engineering Design Competition (Full Day) | 9am–4pm | 5-8 | $590 |
| VISST-mathgames-jul13 | How to Win at Games using Math | 9am–12noon | 5-7 | $300 |
| VISST-arcade-jul13 | Arcade Action Coding | 1–4pm | 5-8 | $300 |

### July 20–24, 2026
| ID | Name | Time | Grades | Price |
|----|------|------|--------|-------|
| VISST-debate-gr79-jul20 | Word Wizards: Debate Camp (Grades 7-9) | 9am–12noon | 7-9 | $300 |
| VISST-speakup-gr79-jul20 | Speak Up: Public Speaking (Grades 7-9) | 1–4pm | 7-9 | $300 |

### July 27–31, 2026
| ID | Name | Time | Grades | Price |
|----|------|------|--------|-------|
| VISST-mathemagics-jul27 | MatheMagics | 9am–12noon | 5-8 | $300 |
| VISST-debate-gr46-jul27 | Word Wizards: Debate Camp (Grades 4-6) | 9am–12noon | 4-6 | $300 |
| VISST-speakup-gr46-jul27 | Speak Up: Public Speaking (Grades 4-6) | 1–4pm | 4-6 | $300 |
| VISST-zine-jul27 | Zine Studio: Create Your Own Mini-Magazine | 1–4pm | 5-8 | $300 |

### August 4–7, 2026 (4-day, BC Day Aug 3)
| ID | Name | Time | Grades | Price |
|----|------|------|--------|-------|
| VISST-3dprint-aug4 | 3D Design and Printing (August) | 9am–12noon | 5-8 | $240 |
| VISST-claymation-aug4 | Claymation: Make Your Own Animated Movie | 1–4pm | 3-6 | $240 |

### August 10–14, 2026
| ID | Name | Time | Grades | Price |
|----|------|------|--------|-------|
| VISST-3danim-aug10 | 3D Modeling and Animation | 9am–12noon | 6-9 | $300 |
| VISST-puzzlegame-aug10 | Puzzle Game Programming | 1–4pm | 5-8 | $300 |

### August 17–21, 2026
| ID | Name | Time | Grades | Price |
|----|------|------|--------|-------|
| VISST-makerlab-aug17 | Maker Lab: Digital Design and Fabrication (August) | 9am–12noon | 5-9 | $300 |
| VISST-datascience-aug17 | Data Science for Kids | 1–4pm | 6-9 | $300 |
| VISST-2dgame-aug17 | 2D Game Design: Create Your Own Adventure Game | 1–4pm | 5-7 | $300 |

### August 24–28, 2026
| ID | Name | Time | Grades | Price |
|----|------|------|--------|-------|
| VISST-quantum-aug24 | The World of Quantum Computing and AI | 9am–12noon | 7-9 | $300 |
| VISST-juniorscience-aug24 | Junior Science Explorers | 10am–1pm | 4-5 | $300 |

---

## Cancelled Entries (ids 175–180)

"Game Development Camp" is not a 2026 VISST program. These were placeholder entries covering Jul 6 through Aug 10.

| ID | Original Dates | Reason |
|----|---------------|--------|
| 175 | Jul 6-10 | Wrong program name; replaced by VISST-* entries |
| 176 | Jul 13-17 | Wrong program name |
| 177 | Jul 20-24 | Wrong program name |
| 178 | Jul 27-31 | Wrong program name |
| 179 | Aug 4-7 | Wrong program name |
| 180 | Aug 10-14 | Wrong program name |

---

## Gap Analysis

| Category | Live | In DB before | Added |
|----------|------|-------------|-------|
| 5-day half-day camps | 18 | 0 (wrong entries) | 18 |
| 4-day half-day camps (Canada Day + BC Day) | 4 | 0 | 4 |
| Full Day (Science Matters) | 1 | 0 | 1 |
| Wrong "Game Development Camp" entries | 0 | 6 | 0 (Cancelled) |
| **Total** | **24** | **0 correct** | **24** |

---

## Notes

- Registration is OPEN as of audit date (April 6, 2026)
- VISST describes their program as "STEM-focussed camps for kids aged 8-14"
- Grade-to-age conversion used: going into grade N ≈ age N+5 (summer before entering grade)
- Science Matters has 3 separate registerable options: AM half-day ($315), PM half-day ($315), Full Day ($590)
- Jul 27-31 has two concurrent AM programs (MatheMagics and Word Wizards Gr 4-6) — parents choose one
- Aug 17-21 has two concurrent PM programs (Data Science and 2D Game Design) — parents choose one
- Combo discount details captured in costNote fields
- BC Day (Aug 3) confirmed: Aug 4-7 is 4-day; Canada Day (Jul 1) confirmed: Jun 29-Jul 3 is 4-day
- Pricing source: visst.ca/camps-old store page (verified for 2026 sessions listed by date)
