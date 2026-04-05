# Verification Log — Chaoyin International School

**Date:** 2026-04-04
**Auditor:** Claude (automated audit agent)
**Provider:** Chaoyin International School (Geering Up camps at Chaoyin Bilingual School)
**Registration Page:** https://campscui.active.com/orgs/GEERingUp?season=3743243
**Info Page:** https://geeringup.apsc.ubc.ca/camps/in-person-camps/offsite-camps/
**Location:** 10111 Bird Rd, Richmond, BC V6X 1N4

---

## Key Finding: Geering Up Partnership

All programs listed under "Chaoyin International School" are actually Geering Up (UBC Engineering Outreach) camps hosted at the Chaoyin Bilingual School location in Richmond. The provider is a host venue for Geering Up's Richmond offsite camp series.

---

## Registration Portal Count

Provider (campscui.active.com) shows: **31 sessions** at Chaoyin International School
Database had: **28 programs**
After audit: **32 programs** (28 existing + 4 new Code Quest sessions added)

---

## All 31 Sessions Verified on Registration Portal

| # | Program Name | Dates | Grades | Cost | Status |
|---|-------------|-------|--------|------|--------|
| 1 | Code Quest 4/5 (Week 1) | Jun 29 – Jul 3, 2026 | 4-5 | $405 | Open |
| 2 | Maker 2/3: Tinkerers (Week 1) | Jun 29 – Jul 3, 2026 | 2-3 | $385 | Open |
| 3 | Pathways in STEM 6/7 (Week 1) | Jun 29 – Jul 3, 2026 | 6-7 | $385 | Open |
| 4 | STEAM 2/3: Creators (Week 1) | Jun 29 – Jul 3, 2026 | 2-3 | $385 | Open |
| 5 | Maker 4/5: Inventors (Week 2) | Jul 6–10, 2026 | 4-5 | $450 | Open |
| 6 | Miniminds: Early Explorers (Week 2) | Jul 6–10, 2026 | Grade 1 | $450 | Open |
| 7 | STEM Explorations 2/3: Discoverers (Week 2) | Jul 6–10, 2026 | 2-3 | $450 | Open |
| 8 | Technological Futures 6/7 (Week 2) | Jul 6–10, 2026 | 6-7 | $470 | Open |
| 9 | Code Quest 4/5 (Week 3) | Jul 13–17, 2026 | 4-5 | $470 | Open |
| 10 | Maker 2/3: Tinkerers (Week 3) | Jul 13–17, 2026 | 2-3 | $450 | Open |
| 11 | Miniminds: Growing Geniuses (Week 3) | Jul 13–17, 2026 | Grade 1 | $450 | Open |
| 12 | STEM Explorations 4/5: Researchers (Week 3) | Jul 13–17, 2026 | 4-5 | $450 | Open |
| 13 | All Girls* Maker 4/5: Inventors (Week 4) | Jul 20–24, 2026 | 4-5 | $450 | Open |
| 14 | All Girls* Pathways in STEM 6/7 (Week 4) | Jul 20–24, 2026 | 6-7 | $450 | Open |
| 15 | All Girls* STEAM 2/3: Creators (Week 4) | Jul 20–24, 2026 | 2-3 | $450 | Open |
| 16 | Code Quest 4/5 (Week 5) | Jul 27–31, 2026 | 4-5 | $470 | Open |
| 17 | Miniminds: Early Explorers (Week 5) | Jul 27–31, 2026 | Grade 1 | $450 | Open |
| 18 | STEM Explorations 2/3: Discoverers (Week 5) | Jul 27–31, 2026 | 2-3 | $450 | Open |
| 19 | STEM Explorations 4/5: Researchers (Week 5) | Jul 27–31, 2026 | 4-5 | $450 | Open |
| 20 | Maker 2/3: Tinkerers (Week 6) | Aug 4–7, 2026 | 2-3 | $385 | Open |
| 21 | Maker 4/5: Inventors (Week 6) | Aug 4–7, 2026 | 4-5 | $385 | Open |
| 22 | Miniminds: Growing Geniuses (Week 6) | Aug 4–7, 2026 | Grade 1 | $385 | Open |
| 23 | Technological Futures 6/7 (Week 6) | Aug 4–7, 2026 | 6-7 | $405 | Open |
| 24 | Code Quest 4/5 (Week 7) | Aug 10–14, 2026 | 4-5 | $470 | Open |
| 25 | Pathways in STEM 6/7 (Week 7) | Aug 10–14, 2026 | 6-7 | $450 | Open |
| 26 | STEAM 2/3: Creators (Week 7) | Aug 10–14, 2026 | 2-3 | $450 | Open |
| 27 | STEM Explorations 2/3: Discoverers (Week 7) | Aug 10–14, 2026 | 2-3 | $450 | Open |
| 28 | Maker 2/3: Tinkerers (Week 8) | Aug 17–21, 2026 | 2-3 | $450 | Open |
| 29 | Miniminds: Early Explorers (Week 8) | Aug 17–21, 2026 | Grade 1 | $450 | Open |
| 30 | STEM Explorations 4/5: Researchers (Week 8) | Aug 17–21, 2026 | 4-5 | $450 | Open |
| 31 | Technological Futures 6/7 (Week 8) | Aug 17–21, 2026 | 6-7 | $470 | Open |

**Note:** Also in DB (not in 2026 summer portal): ACT-0129 "Grade 1/2: Wizarding Wonders (Winter - Richmond)" — a Winter 2026 program (Jan 17–Mar 28, 2026) that has now completed. Status set to "Completed".

---

## Discrepancies Found and Fixed

### 1. Missing Code Quest programs (4 added)
The registration portal shows Code Quest 4/5 camps in Weeks 1, 3, 5, and 7, but none existed in the database. Added:
- CIS-CODE-W1-2026: Code Quest 4/5 (Week 1) — $405
- CIS-CODE-W3-2026: Code Quest 4/5 (Week 3) — $470
- CIS-CODE-W5-2026: Code Quest 4/5 (Week 5) — $470
- CIS-CODE-W7-2026: Code Quest 4/5 (Week 7) — $470

### 2. ageMax was null for 25 programs
All programs (except ACT-0129) had ageMax: null. Fixed using Geering Up grade-based age bands:
- Grade 1 (Miniminds) → ageMin: 6, ageMax: 7
- Grades 2-3 → ageMin: 7, ageMax: 9
- Grades 4-5 → ageMin: 9, ageMax: 11
- Grades 6-7 → ageMin: 11, ageMax: 13

### 3. Miniminds ageMin was wrong
ACT-0388, ACT-0484, ACT-0613, ACT-0652, ACT-0742 (Miniminds programs) had ageMin: 4. The portal clearly states "Grade: 1st" (entering grade 1 only). Fixed to ageMin: 6, ageMax: 7.

### 4. registrationUrl was info page, not registration page
All programs had registrationUrl pointing to the Geering Up info page. Updated to the actual ACTIVE registration portal: https://campscui.active.com/orgs/GEERingUp?season=3743243

### 5. Winter program ACT-0129 marked Completed
The "Grade 1/2: Wizarding Wonders (Winter - Richmond)" ran Jan 17 – Mar 28, 2026 and is now complete. Status updated to "Completed".

### 6. costNote added to all programs
All programs were missing costNote. Added per-week cost context and grade requirements to all 32 entries.

---

## Programs Not on 2026 Portal
- **ACT-0129** (Grade 1/2: Wizarding Wonders Winter) — Winter 2026 program, completed. Kept in DB with enrollmentStatus: "Completed".

---

## Price Verification
All costs verified against campscui.active.com registration portal:
- Week 1: $385–$405 (shorter June/July week)
- Weeks 2–5, 7–8: $450–$470 (standard 5-day weeks)
- Week 6: $385–$405 (4-day week due to BC Day Aug 3 holiday)
- Grades 6-7 (Technological Futures): $470 vs other camps at $450 — confirmed higher rate

---

## Schedule Details
- Hours: 9:00 AM – 3:00 PM daily
- No before/after care at this location
- No lunch program at this location
- Registration deadlines: 11:59 PM the Sunday before each camp week begins
