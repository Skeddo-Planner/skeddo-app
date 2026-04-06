# Verification Log — Byte Camp (Vancouver)

**Audited:** 2026-04-06
**Queue entry:** Rank 151
**Source URLs verified:**
- `https://www.bytecamp.ca/#c` (full 41-session Vancouver schedule extracted via JS)
- `https://www.bytecamp.ca/calendar/programdetail.php?pid=3347` (HQ address verification)
**Address (HQ):** 2378 Alberta St, Vancouver, BC (Riley Park)
**DB count before audit:** 16,116 programs
**DB count after audit:** 16,122 (+6 added, 10 existing entries fixed, 6 cancelled)

---

## Summary

Byte Camp runs 41 distinct summer camp sessions across Vancouver in 2026, spread across 12 community centres plus their own HQ. Registration opens April 8, 2026 for all sessions.

The DB had:
- 6 wrong "Tech Innovation Camp" placeholder entries (ids 181-186) — Cancelled
- 4 COV Hillcrest entries with single-day endDate errors — Fixed
- 45 correct location-specific entries (COV-* and numbered) from prior audits — Validated
- 6 sessions present on bytecamp.ca with no DB entry — Added

---

## Camp Type → Program Name Mapping

| Code | Program Name |
|------|-------------|
| coding | Introduction to Coding |
| coding2 | Introduction to Coding Level 2 |
| flash | 2D Video Game Design |
| ByteApp | Build an App |
| clay | Claymation Movie Production |
| 3D | 3D Animation |
| 3Dgame | 3D Video Game Design |
| 2Dtab | 2D Animation on Tablet |
| musicvid | Music and Video Production |
| foundAI | Foundations in AI |
| python | Python Coding Level 1 |

---

## Pricing (verified from existing Open COV-* entries)

| Camp Duration | Ages | Price |
|--------------|------|-------|
| 5-day (Mon–Fri, regular week) | 9–12 or 11–14 | CA$410 |
| 4-day (Canada Day week, Jun 29–Jul 3) | any | CA$355 |
| 4-day (BC Day week, Aug 4–7) | any | CA$355 |

---

## Cancelled Entries (ids 181–186)

"Tech Innovation Camp" is not a real Byte Camp program. These were generic placeholder entries.

| ID | Dates | Reason |
|----|-------|--------|
| 181 | Jul 6–10 | Not a real Byte Camp program name |
| 182 | Jul 13–17 | Not a real Byte Camp program name |
| 183 | Jul 20–24 | Not a real Byte Camp program name |
| 184 | Jul 27–31 | Not a real Byte Camp program name |
| 185 | Aug 4–7 | Not a real Byte Camp program name |
| 186 | Aug 10–14 | Not a real Byte Camp program name |

---

## Date/Days Fixes on Existing COV Entries

| ID | Field | Old | New |
|----|-------|-----|-----|
| COV-600455 | endDate | 2026-06-29 | 2026-07-03 |
| COV-600455 | days | Mon | Mon, Tue, Thu, Fri (Canada Day off) |
| COV-600457 | endDate | 2026-07-13 | 2026-07-17 |
| COV-600457 | days | Mon | Mon, Tue, Wed, Thu, Fri |
| COV-600461 | endDate | 2026-08-04 | 2026-08-07 |
| COV-600461 | days | Tue | Tue, Wed, Thu, Fri (BC Day off) |
| COV-600464 | endDate | 2026-08-24 | 2026-08-28 |
| COV-600464 | days | Mon | Mon, Tue, Wed, Thu, Fri |

---

## New Entries Added

| ID | Location | Program | Ages | Dates | Cost |
|----|----------|---------|------|-------|------|
| BC-4440 | Hillcrest CC | 2D Video Game Design | 11–14 | Jul 20–24 | $410 |
| BC-4469 | Byte Camp HQ | 2D Video Game Design | 11–14 | Jul 27–31 | $410 |
| BC-4513 | Hillcrest CC | 2D Animation on Tablet | 9–12 | Aug 10–14 | $410 |
| BC-4537 | Hillcrest CC | 3D Video Game Design | 11–14 | Aug 17–21 | $410 |
| BC-4539 | Byte Camp HQ | 2D Animation on Tablet | 9–12 | Aug 17–21 | $410 |
| BC-4559 | Strathcona CC | Claymation Movie Production | 9–12 | Aug 24–28 | $410 |

---

## Full 41-Session Vancouver Schedule (bytecamp.ca)

| # | Location | Program | Ages | Dates | DB Entry |
|---|----------|---------|------|-------|----------|
| 1 | Hillcrest CC | Introduction to Coding | 9–12 | Jun 29–Jul 3 | COV-600455 ✓ (fixed) |
| 2 | Hillcrest CC | Graphic Design & Printing | 11–14 | Jul 6–10 | COV-600456 ✓ |
| 3 | Champlain Heights CC | Introduction to Coding | 9–12 | Jul 6–10 | 1398 ✓ |
| 4 | Marpole Oakridge CC | 2D Video Game Design | 11–14 | Jul 6–10 | COV-609704 ✓ |
| 5 | Hastings CC | Claymation Movie Production | 9–12 | Jul 6–10 | 1521 ✓ |
| 6 | Kerrisdale CC | 2D Animation on Tablet | 9–12 | Jul 6–10 | COV-604331 ✓ |
| 7 | Roundhouse Arts | Introduction to Coding | 9–12 | Jul 6–10 | 1787 ✓ |
| 8 | Hillcrest CC | Music and Video Production | 9–12 | Jul 13–17 | COV-600457 ✓ (fixed) |
| 9 | Marpole Oakridge CC | Foundations in AI | 11–14 | Jul 13–17 | COV-609706 ✓ |
| 10 | Hastings CC | Introduction to Coding | 9–12 | Jul 13–17 | 1522 ✓ |
| 11 | Roundhouse Arts | Music and Video Production | 9–12 | Jul 13–17 | 1797 ✓ |
| 12 | False Creek CC | Introduction to Coding | 9–12 | Jul 13–17 | COV-603654 ✓ |
| 13 | Hillcrest CC | 2D Video Game Design | 11–14 | Jul 20–24 | **BC-4440 (added)** |
| 14 | Champlain Heights CC | Foundations in AI | 11–14 | Jul 20–24 | 1397 ✓ |
| 15 | Marpole Oakridge CC | Music and Video Production | 9–12 | Jul 20–24 | 1710 ✓ |
| 16 | Douglas Park CC | Foundations in AI | 11–14 | Jul 20–24 | 1439 ✓ |
| 17 | Killarney CC | 3D Animation | 11–14 | Jul 20–24 | COV-610213 ✓ |
| 18 | Hillcrest CC | Foundations in AI | 11–14 | Jul 27–31 | COV-600460 ✓ |
| 19 | Champlain Heights CC | Claymation Movie Production | 9–12 | Jul 27–31 | 1396 ✓ |
| 20 | Marpole Oakridge CC | Introduction to Coding | 9–12 | Jul 27–31 | COV-609708 ✓ |
| 21 | Hastings CC | Python Coding Level 1 | 11–14 | Jul 27–31 | 1523 ✓ |
| 22 | Roundhouse Arts | Claymation Movie Production | 9–12 | Jul 27–31 | COV-605862 ✓ |
| 23 | Byte Camp HQ | 2D Video Game Design | 11–14 | Jul 27–31 | **BC-4469 (added)** |
| 24 | Hillcrest CC | Python Coding Level 1 | 11–14 | Aug 4–7 | COV-600461 ✓ (fixed) |
| 25 | Marpole Oakridge CC | 2D Animation on Tablet | 9–12 | Aug 4–7 | COV-609709 ✓ |
| 26 | Kerrisdale CC | Foundations in AI | 11–14 | Aug 4–7 | COV-604332 ✓ |
| 27 | Roundhouse Arts | Graphic Design & Printing | 11–14 | Aug 4–7 | COV-605864 ✓ |
| 28 | Killarney CC | Introduction to Coding | 9–12 | Aug 4–7 | 1657 ✓ |
| 29 | Trout Lake CC | 3D Animation | 11–14 | Aug 4–7 | COV-606214 ✓ |
| 30 | Hillcrest CC | 2D Animation on Tablet | 9–12 | Aug 10–14 | **BC-4513 (added)** |
| 31 | Hastings CC | 2D Animation on Tablet | 9–12 | Aug 10–14 | 1520 ✓ |
| 32 | False Creek CC | 3D Animation | 11–14 | Aug 10–14 | COV-603655 ✓ |
| 33 | Douglas Park CC | Introduction to Coding | 9–12 | Aug 10–14 | 1440 ✓ |
| 34 | Hillcrest CC | 3D Video Game Design | 11–14 | Aug 17–21 | **BC-4537 (added)** |
| 35 | Byte Camp HQ | 2D Animation on Tablet | 9–12 | Aug 17–21 | **BC-4539 (added)** |
| 36 | Trout Lake CC | Introduction to Coding | 9–12 | Aug 17–21 | 1917 ✓ |
| 37 | Hillcrest CC | Introduction to Coding Level 2 | 9–12 | Aug 24–28 | COV-600464 ✓ (fixed) |
| 38 | Marpole Oakridge CC | 3D Animation | 11–14 | Aug 24–28 | COV-609716 ✓ |
| 39 | False Creek CC | Python Coding Level 1 | 11–14 | Aug 24–28 | COV-603656 ✓ |
| 40 | Killarney CC | 2D Animation on Tablet | 9–12 | Aug 24–28 | COV-610215 ✓ |
| 41 | Strathcona CC | Claymation Movie Production | 9–12 | Aug 24–28 | **BC-4559 (added)** |

---

## Gap Analysis

| Category | Live | In DB before | Added | Cancelled |
|----------|------|-------------|-------|-----------|
| Sessions matched to existing DB entries | 35 | 35 | 0 | 0 |
| Sessions missing from DB | 6 | 0 | 6 | 0 |
| Wrong placeholder entries | 0 | 6 | 0 | 6 |
| **Total** | **41** | **41** | **6** | **6** |

---

## Notes

- Registration for all 2026 Vancouver sessions opens **April 8, 2026**
- All sessions run 9:00 AM – 4:00 PM (full day), Mon–Fri (except holiday weeks)
- Age ranges: 9–12 yrs (junior programs) or 11–14 yrs (senior programs)
- Byte Camp Vancouver HQ address: 2378 Alberta St, Vancouver, BC (Riley Park)
- Canada Day week (Jun 29–Jul 3): 4-day, $355; days = Mon, Tue, Thu, Fri
- BC Day week (Aug 4–7): 4-day, $355; days = Tue, Wed, Thu, Fri
- Note: DB also contains COV-602069/602074 (Dunbar CC) and COV-606213 (Trout Lake Claymation Aug 24-28)
  which did not appear in the 41-session VAN-region filter on bytecamp.ca — these were not removed
  (per R31: never remove without certainty)
