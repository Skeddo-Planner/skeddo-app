# Verification Log — City of Vancouver - Dunbar Community Centre

**Audited:** 2026-04-06
**URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=50&min_age=0&max_age=17&activity_keyword=camp&viewMode=list
**center_id:** 50 (confirmed via Where filter)
**Live camp count:** ~85 programs matching "camp" keyword (ages 0–17; virtual renderer caps at 20, required 15+ keyword searches)
**DB count before audit:** 253 programs
**DB count after audit:** 276 (+23 programs added)

---

## Summary

Dunbar Community Centre runs a wide variety of summer camp programs. The DB had good coverage of the main day camp family but was missing:
1. The **Kids Tennis 11-14 yrs** age group entirely (8 weeks)
2. Three late-summer weeks of **Kids Tennis 8-10 yrs** (Wk 6-8)
3. Several **WIZE technology camps**, **Maevann art camps**, **Creative Cooks**, **Design & Build**, and **Byte Camp Claymation**

**Dual-ID formula confirmed for center_id=50:**
- display ID − 2922 = URL ID
- Verified: COV-602627 display 605549 → URL 602627 ✓

**BC Day (Aug 3, Mon):** Aug 4–7 week runs Tue–Fri (4 days). Tennis 11-14 BC Day week = $322 (vs $399 for 5-day).

**Canada Day (Jul 1, Wed 2026):** No Dunbar summer camps in Canada Day week (camps start Jul 6).

**Virtual renderer gap:** Because ActiveNet only renders ~20 items at once, enumeration required 15+ keyword searches: "daycamp", "dunbar day camp", "tennis camp", "self defence", "WIZE", "byte camp", "maevann", "creative cooks", "design build", "swiftie", "summer dance", "sportball", "music exploration", "1-Active", "maevann art lessons".

**Note on 404 URL IDs:** IDs 602626, 602629, 602633, 602636 return "Sorry! We could not find the information you've requested." — these are deleted/cancelled sessions that still appear as search index artifacts. Not added.

---

## Programs Added (23 total)

### Kids Tennis 8-10 yrs — Missing Weeks 6-8

| ID | Week | Dates | Days | Cost |
|----|------|-------|------|------|
| COV-602634 | Wk 6 | Aug 10–14, 2026 | Mon–Fri | $399 |
| COV-602635 | Wk 7 | Aug 17–21, 2026 | Mon–Fri | $399 |
| COV-602637 | Wk 8 | Aug 24–28, 2026 | Mon–Fri | $399 |

*Ages 8-10 | 8:45 AM – 4:15 PM | Indoor/Outdoor*
*Note: 602636 = 404 (deleted); skipped*

### Kids Tennis 11-14 yrs — Full Summer (Entirely Missing Age Group)

| ID | Week | Dates | Days | Cost |
|----|------|-------|------|------|
| COV-602643 | Wk 1 | Jul 6–10, 2026 | Mon–Fri | $399 |
| COV-602644 | Wk 2 | Jul 13–17, 2026 | Mon–Fri | $399 |
| COV-602645 | Wk 3 | Jul 20–24, 2026 | Mon–Fri | $399 |
| COV-602646 | Wk 4 | Jul 27–31, 2026 | Mon–Fri | $399 |
| COV-602647 | Wk 5 | Aug 4–7, 2026 | Tue–Fri (BC Day off) | $322 |
| COV-602648 | Wk 6 | Aug 10–14, 2026 | Mon–Fri | $399 |
| COV-602649 | Wk 7 | Aug 17–21, 2026 | Mon–Fri | $399 |
| COV-602650 | Wk 8 | Aug 24–28, 2026 | Mon–Fri | $399 |

*Ages 11-14 | 8:45 AM – 4:15 PM | Indoor/Outdoor*

### Creative Cooks Camp

| ID | Dates | Days | Time | Ages | Cost |
|----|-------|------|------|------|------|
| COV-601214 | Jul 13–17, 2026 | Mon–Fri | 2:00–4:00 PM | 7–12 | $160 |
| COV-601219 | Aug 17–21, 2026 | Mon–Fri | 2:00–4:00 PM | 7–12 | $160 |

### Design and Build Camp

| ID | Dates | Days | Time | Ages | Cost |
|----|-------|------|------|------|------|
| COV-601220 | Aug 17–21, 2026 | Mon–Fri | 12:30–1:45 PM | 3–5 | $125 |

### Byte Camp Claymation

| ID | Dates | Days | Time | Ages | Cost |
|----|-------|------|------|------|------|
| COV-602074 | Aug 17–21, 2026 | Mon–Fri | 9:00 AM – 4:00 PM | 9–12 | $410 |

### WIZE Technology Camps

| ID | Name | Dates | Time | Ages | Cost |
|----|------|-------|------|------|------|
| COV-609619 | WIZE - 3D Modelling and Printing | Jul 13–17 | 9:00 AM – 12:00 PM | 8–12 | $300 |
| COV-609620 | WIZE - 3D Modelling and Printing | Aug 24–28 | 9:00 AM – 12:00 PM | 8–12 | $300 |
| COV-609621 | WIZE - Coding and Modding in Minecraft | Jul 27–31 | 9:00 AM – 12:00 PM | 8–12 | $300 |
| COV-609624 | WIZE - Animation, Games & Storytelling in Scratch Jr | Aug 17–21 | 1:00 PM – 4:00 PM | 8–12 | $300 |

### Maevann Art Summer Camps

| ID | Dates | Days | Time | Ages | Cost |
|----|-------|------|------|------|------|
| COV-609530 | Jul 6–10, 2026 | Mon–Fri | 9:30 AM – 3:00 PM | 5–10 | $70 |
| COV-609564 | Jul 13–17, 2026 | Mon–Fri | 9:30 AM – 3:00 PM | 5–10 | $70 |
| COV-609566 | Jul 27–31, 2026 | Mon–Fri | 9:30 AM – 3:00 PM | 5–10 | $70 |

*Note: Jul 20-24 (Wk 3) and Aug 17-21 (Wk 7) are already in DB as COV-609568 and COV-609569*

### Maevann Art Lessons Summer Break

| ID | Dates | Days | Time | Ages | Cost |
|----|-------|------|------|------|------|
| COV-610197 | Aug 11–13, 2026 | Tue–Wed–Thu | 9:30–10:45 AM | 3–5 | $25 |

*Short 3-day art session during summer break*

---

## Programs Already in DB (not added)

| Category | Weeks | DB Coverage |
|----------|-------|-------------|
| Dunbar Day Camp | Wk 1–8 + BC Day | COV-608317, COV-608330, COV-608332 + legacy IDs ✓ |
| Kids Tennis 5-7 yrs | Wk 1–8 + BC Day | Legacy IDs 1463–1469, COV-602625, ACT-* ✓ |
| Kids Tennis 8-10 yrs | Wk 1-5 (Jul 6 – Aug 7) | COV-602627, 602628, 602630, 602631, 602632 ✓ |
| Summer Dance Camps | Multiple | COV-608124–608155 ✓ |
| Self-Defence | Multiple | Various COV-* ✓ |
| Sportball Camp | Wk 1–8 | COV-610465–610481 ✓ |
| Music Exploration Camp | Multiple | COV-* ✓ |
| WIZE Engineering/Robotics | Jul 27-31 | Legacy ID 1470 (COV-609627) ✓ |
| Maevann Art Summer Camp | Wk 5, 7 | COV-609568, COV-609569 ✓ |
| Maevann Art Lessons | Various terms | COV-609508, COV-610140, etc. ✓ |
| Byte Camp Intro to Coding | Aug 10-14 | COV-602069 ✓ |
| 1-Active Basketball | Multiple | COV-* ✓ |

---

## Fee Verification

All fees verified via ActiveNet fee modal (browser navigation):

| Program | URL ID | Fee |
|---------|--------|-----|
| Tennis 8-10 Wk 6-8 | 602634/635/637 | $399 (5-day) |
| Tennis 11-14 Wk 1-4, 6-8 | 602643–646, 648–650 | $399 (5-day) |
| Tennis 11-14 BC Day week | 602647 | $322 (4-day) |
| Creative Cooks | 601214/601219 | $160 (5-day) |
| Design and Build | 601220 | $125 (5-day) |
| Byte Camp Claymation | 602074 | $410 (5-day) |
| WIZE camps | 609619/620/621/624 | $300 (5-day) |
| Maevann Art Summer Camp | 609530/564/566 | $70 (5-day, resident rate) |
| Maevann Art Lessons Break | 610197 | $25 (3-day) |

---

## Gap Analysis

| Category | Live Count | Added | Notes |
|----------|-----------|-------|-------|
| Tennis 5-7 yrs | 9 | 0 | Already in DB ✓ |
| Tennis 8-10 yrs | 9 | 3 | Wk 6-8 were missing |
| Tennis 11-14 yrs | 9 | 8 | Entire age group missing! +1 BC Day |
| Dunbar Day Camp | 8+ | 0 | Already in DB ✓ |
| Summer Dance Camps | 15+ | 0 | Already in DB ✓ |
| WIZE | 5 | 4 | 1 already in DB (COV-609627) |
| Maevann Art Summer Camp | 5 | 3 | 2 already in DB |
| Maevann Art Lessons Break | 1 | 1 | New |
| Creative Cooks | 2 | 2 | New |
| Design and Build | 1 | 1 | New |
| Byte Camp Claymation | 1 | 1 | New |
| Sportball | 8+ | 0 | Already in DB ✓ |
| Self-Defence | 4+ | 0 | Already in DB ✓ |
| Other | varies | 0 | Already in DB ✓ |

---

## Notes

- center_id=50 confirmed for Dunbar Community Centre
- Registration for summer programs: April 8, 2026 at 7:00 PM
- **Pre-existing data issue (not fixed):** COV-608139 DB name is "Summer Dance Camp - Ballet/Jazz Wk 2" but live URL 608139 = "Swiftie Dance Party Camp". Flagged for future cleanup.
- **Pre-existing data issue (not fixed):** COV-608127 DB name says "Summer Dance Camp" but live = "Frozen Ballet Camp". Flagged for future cleanup.
- **404 URL IDs skipped:** 602626, 602629, 602633, 602636 — deleted/cancelled sessions
- Maevann resident rate: $70/week (vs $325 full rate shown in fee modal)
- WIZE camps at Dunbar: same provider as Douglas Park WIZE programs; ages 8-12 consistent with legacy entry 1470
- Virtual renderer limitation: needed 15+ keyword searches to enumerate all ~85 programs
