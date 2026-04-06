# Verification Log — City of Vancouver - Trout Lake Cmty Centre

**Audited:** 2026-04-05
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=32&min_age=0&max_age=17&viewMode=list
**Live page count:** 722 programs (ages 0–17, in-progress/future)
**DB count after audit:** 251 programs

---

## Summary

Live page shows 722 programs (includes adult-only programs like Aikido 17+, Aikido April/May/June/July/August). Database has 251 programs after adding 17 missing youth programs. The remaining gap is adult-only programs (ageMin=17+), programs from the completed spring season, and programs too specialized to enumerate via virtual renderer.

**Note on virtual renderer:** ActiveNet shows only ~20 DOM items at a time. Scrolling expanded to 40 items before stalling at 7221px body height. Only alphabetical A–B programs were fully enumerated. The remaining gap is not fully characterized.

---

## Programs Added This Audit (17)

| ID | Name | Dates | Time | Ages | Cost | Status |
|----|------|-------|------|------|------|--------|
| COV-595433 | Aikido Beginner Level (5-7yrs) | Apr 13–Jun 22, 2026 | Mon 4:45–5:45 PM | 5–7 | $100 | Open |
| COV-595434 | Aikido Beginner Level (8-12yrs) | Apr 7–Jun 23, 2026 | Tue 4:45–5:45 PM | 8–12 | $120 | Full |
| COV-595460 | Advanced Architechure for Kids (8-12yrs) | Apr 13–Jun 8, 2026 | Mon 5:15–6:30 PM | 8–12 | $240 | Open |
| COV-595439 | Axe Capoeira For Youth Advanced | Apr 8–Jun 26, 2026 | Mon/Wed/Fri 4:30–5:30 PM | 8–13 | $320 | Open |
| COV-595440 | Axe Capoeira For Youth Beginners | Apr 8–Jun 26, 2026 | Wed/Fri 4:30–5:30 PM | 8–13 | $264 | Open |
| COV-595441 | Axe Capoeira For Youth Intermediate | Apr 8–Jun 24, 2026 | Mon/Wed 4:30–5:30 PM | 8–13 | $264 | Open |
| COV-606049 | Advanced Youth Capoeira Intensive | Jul 6–10, 2026 | Mon–Fri 9:30 AM–1:00 PM | 7–14 | $175 | Coming Soon (opens Apr 8) |
| COV-606055 | Axe Capoeira For Youth (All Levels) | Jul 6–Aug 19, 2026 | Mon/Wed 4:15–5:15 PM | 8–13 | $156 | Open |
| COV-606207 | Architecture Around the World with Petit Architect | Jul 20–24, 2026 | Mon–Fri 9:15 AM–3:00 PM | 7–12 | $450 | Coming Soon (opens Apr 8) |
| COV-613138 | Aikido Summer Kids Class | Jul 7–Aug 25, 2026 | Tue 4:30–5:30 PM | 8–12 | $80 | Open |
| COV-599767 | Beginner Ballet | Apr 12–Jun 21, 2026 | Sun 12:15–1:00 PM | 5–6 | $111 | Full |
| COV-599772 | Beginner Ballet | Jul 5–Aug 23, 2026 | Sun 12:15–1:00 PM | 5–6 | $78 | Full |
| COV-599782 | Ballet/Jazz Fusion | Apr 11–Jun 20, 2026 | Sat 11:00–11:45 AM | 4–6 | $140 | Full |
| COV-599797 | Ballet/Jazz Fusion | Jul 4–Aug 22, 2026 | Sat 11:00–11:45 AM | 4–6 | $112 | Open |
| COV-599763 | Ballet Parent & Toddler Dance | Apr 12–Jun 21, 2026 | Sun 9:30–10:00 AM | 2–3 | $101 | Full |
| COV-599768 | Ballet Parent & Toddler Dance | Jul 5–Aug 23, 2026 | Sun 9:30–10:00 AM | 2–3 | $71 | Open |
| COV-599769 | Ballet Parent & Toddler Dance | Jul 5–Aug 23, 2026 | Sun 10:05–10:35 AM | 2–3 | $71 | Full |

---

## Fixes Applied This Audit

| ID | Field | Old | New | Reason |
|----|-------|-----|-----|--------|
| COV-601537 | enrollmentStatus | Open | Full | Page shows "Activity is full" |
| COV-599622 | cost | null | $40 | Applied from ACT- source data (West End After Care Wk 1) |
| COV-599623 | cost | null | $50 | Applied from ACT- source data (West End After Care Wk 2) |
| COV-599624 | cost | null | $50 | Applied from ACT- source data (West End After Care Wk 3) |
| COV-599625 | cost | null | $50 | Applied from ACT- source data (West End After Care Wk 4) |

---

## Spot-Checks (field-by-field verification)

### Aikido Beginner Level (5-7yrs) — COV-595433
- **Name:** Aikido Beginner Level (5-7yrs) ✓
- **Dates:** Apr 13–Jun 22, 2026 ✓
- **Time:** Mon 4:45–5:45 PM ✓
- **Age:** 5 to <8 → ageMax=7 ✓
- **Cost:** $100 (verified via fee details modal) ✓
- **Status:** Open (11 openings) ✓
- **Location:** Elm Room, Trout Lake Cmty Centre ✓

### Axe Capoeira For Youth Advanced — COV-595439
- **Name:** Axe Capoeira For Youth Advanced ✓
- **Dates:** Apr 8–Jun 26, 2026 ✓
- **Time:** Mon/Wed/Fri 4:30–5:30 PM ✓
- **Age:** 8 to <14 → ageMax=13 ✓
- **Cost:** $320 ✓
- **Status:** Open ✓

### Architecture Around the World with Petit Architect — COV-606207
- **Name:** Architecture Around the World with Petit Architect ✓
- **Dates:** Jul 20–24, 2026 ✓
- **Time:** Mon–Fri 9:15 AM–3:00 PM ✓
- **Age:** 7 to <13 → ageMax=12 ✓
- **Cost:** $450 ✓
- **Status:** Coming Soon (registration opens Apr 8, 2026 7:00 PM) ✓

### Artisan Pottery Sale — COV-601537
- **Status:** Full ("Activity is full" confirmed on detail page) ✓
- **Note:** This is a community pottery sale event, not a youth activity class

---

## Notes

- Adult-only Aikido programs (April/May/June/July/August, "17 yrs+") were correctly excluded from DB
- "Axe Capoeira Adult All Levels" (COV-608141, "17 yrs+") excluded as adult program
- 722 live programs include many adult programs and programs from parent providers (Petit Architect, Kirby Snell Dance, Shohei Juku Aikido)
- Virtual renderer limitation: only A–B programs fully enumerated; C–Z programs may still have missing entries to be addressed in subsequent passes
- Programs under numeric IDs (1875–2566) are summer camps entered in prior import — these correspond to COV- programs on the live page but were retained as-is since data is correct
