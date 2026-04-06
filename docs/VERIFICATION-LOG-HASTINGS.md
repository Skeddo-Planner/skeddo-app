# Verification Log — City of Vancouver - Hastings Cmty Centre

**Audited:** 2026-04-06
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=44&min_age=0&max_age=17&viewMode=list
**Live page count:** 308 programs (ages 0–17, in-progress/future)
**DB count after audit:** 74 programs (64 before + 10 added)

---

## Summary

Live page shows 308 programs. DB has 74 programs after fixing 17 status errors and adding 10 missing A programs. Gap of ~234 is largely B–Z alphabetical programs not yet visible due to virtual renderer limitation.

**Systemic status fix:** IDs 1505–1523 (17 programs) had `enrollmentStatus: 'Full/Waitlist'` but `registrationDate: 2026-04-08` — registration not yet open on 2026-04-06. All corrected to "Coming Soon".

---

## Fixes Applied This Audit

| ID(s) | Field | Old | New | Reason |
|-------|-------|-----|-----|--------|
| 1505–1515, 1518–1523 (17) | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08 |

---

## Programs Added This Audit (10)

| ID | Name | Dates | Time | Ages | Cost | Status |
|----|------|-------|------|------|------|--------|
| COV-605310 | Active Jazz Funk and Pop Dance & KPOP Sampler | Apr 8–Jun 10, 2026 | Wed 4:45–5:45 PM | 6–13 | $160 | Open (9) |
| COV-614155 | Adult & Family Decorative Sushi Workshop | May 9, 2026 | Sat 2:00–3:30 PM | 6+ | $60 | Open (9) |
| COV-614156 | Adult & Family Decorative Sushi Workshop | Jun 13, 2026 | Sat 2:00–3:30 PM | 6+ | $60 | Open (10) |
| COV-611398 | Adventures in Music - Mixed Ages | Apr 9–Jun 18, 2026 | Thu 9:15–10:00 AM | 1–5 | $165 | Open (5) |
| COV-611402 | Adventures in Music - Mixed Ages | Apr 11–Jun 20, 2026 | Sat 9:15–10:00 AM | 1–5 | $165 | Full/Waitlist |
| COV-611403 | Adventures in Music - Mixed Ages | Apr 11–Jun 20, 2026 | Sat 10:15–11:00 AM | 1–5 | $165 | Full/Waitlist |
| COV-611404 | Adventures in Music - Mixed Ages | Apr 11–Jun 20, 2026 | Sat 11:15 AM–Noon | 1–5 | $165 | Open (5) |
| COV-611476 | Adventures in Music - Mixed Ages | Jul 9–Aug 13, 2026 | Thu 9:15–10:00 AM | 1–5 | $90 | Upcoming (Jun 13) |
| COV-611477 | Adventures in Music - Mixed Ages | Jul 9–Aug 13, 2026 | Thu 10:15–11:00 AM | 1–5 | $90 | Upcoming (Jun 13) |
| COV-613000 | Alphabet Explorers | Apr 11–Jun 6, 2026 | Sat 11:00 AM–12:15 PM | 4–5 | $108 | Open (7) |

---

## Spot-Checks

### Active Jazz Funk and Pop Dance & KPOP Sampler — COV-605310 (display #608232)
- **Dates:** Apr 8–Jun 10, 2026 (Wed) ✓
- **Time:** 4:45–5:45 PM ✓
- **Age:** 6 to <14 (ageMax=13) ✓
- **Cost:** $160 ✓
- **Status:** Open (9 openings, Starting soon) ✓
- **Note:** ageSpanJustified added — single-bracket dance class, no age subdivisions ✓

### Adventures in Music - Mixed Ages (Thu 9:15 AM) — COV-611398 (display #614320)
- **Dates:** Apr 9–Jun 18, 2026 (Thu), 11 sessions ✓
- **Time:** 9:15–10:00 AM ✓
- **Age:** 1 to <6 (ageMax=5) ✓
- **Cost:** $165 ✓
- **Status:** Open (5 openings, Starting soon) ✓

### Adventures in Music - Mixed Ages (Summer) — COV-611476 (display #614398)
- **Dates:** Jul 9–Aug 13, 2026 (Thu), 6 sessions ✓
- **Time:** 9:15–10:00 AM ✓
- **Location:** Hastings Park (East) — outdoor setting, across from main CC ✓
- **Cost:** $90 ✓
- **Status:** Upcoming (registration opens Jun 13, 2026) ✓

### Alphabet Explorers — COV-613000 (display #615922)
- **Dates:** Apr 11–Jun 6, 2026 (Sat), 8 sessions, no May 16 ✓
- **Time:** 11:00 AM–12:15 PM ✓
- **Age:** 4 to <6 (ageMax=5) ✓
- **Cost:** $108 ✓
- **Status:** Open (7 openings) ✓
- **Instructor:** Jackie Liao ✓

---

## Existing Programs Verified

| ID | Name | Status | Notes |
|----|------|--------|-------|
| COV-611399 | Adventures in Music - Mixed Ages (Thu 10:15 AM) | Full (display #614321) | Already in DB ✓ |
| COV-611490 | Adventures in Music - Mixed Ages (Sat 10:15 Jul) | — | Already in DB ✓ |
| COV-611491 | Adventures in Music - Mixed Ages (Sat 11:15 Jul) | — | Already in DB ✓ |
| COV-611400–611485 | Adventures in Music for Babies (5 sessions) | — | All in DB ✓ |
| COV-605308 | Act Dance Sing FUN! Musical Theatre | Open | In DB ✓ |
| COV-605319 | Animal Cartoon Workshop | — | In DB ✓ |

---

## Notes

- Virtual renderer: only A programs visible (~20 items). B–Z programs need follow-up pass.
- 308 live programs include adult programs and birthday party slots.
- Adventures in Music series: large program family with 9 spring sessions + 5 summer sessions (Hastings Park East). 4 spring sessions missing from DB were added.
- Summer Adventures in Music (COV-611476/477): outdoor setting at Hastings Park East. Registration opens Jun 13, 2026 → status "Upcoming" per R8.
- Sushi Workshop: "Adult & Family" in name but ageMin=6 — suitable for families with children. ageSpanJustified added.
- Act Dance Sing FUN! Musical Theatre (COV-605308, display #608230): in DB, "Starting soon" — registration Apr 8 ✓.
