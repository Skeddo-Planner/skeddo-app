# Verification Log — City of Vancouver - Britannia CC Funseekers Daycamp

**Audited:** 2026-04-06
**Search URLs used:**
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=britannia+funseekers&min_age=0&max_age=17&viewMode=list` (20 results)
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=britannia+day+camp&min_age=0&max_age=17&viewMode=list` (20 results — same set)
**Address:** 1661 Napier Street, Vancouver, BC (Grandview-Woodland)
**DB count before audit:** 15,987 programs
**DB count after audit:** 16,000 (+13 added)

---

## Summary

Britannia CC runs two Funseekers Daycamp cohorts (6-7yr and 8-12yr), each running 10 weeks
(Jun 29 through Sep 4 including Canada Day and BC Day shortened weeks).

Of 20 total Funseekers programs, only 7 were in the DB (6-7yr Wk 1-7). All 10 weeks of the
8-12yr cohort and 6-7yr Wk 8-10 were missing.

**Programs added (13 total):**
- 6-7yr olds Wk 8 (Aug 17-21)
- 6-7yr olds Wk 9 (Aug 24-28)
- 6-7yr olds Wk 10 (Aug 31-Sep 4)
- 8-12yr olds Wk 1-10 (all 10 weeks)

---

## Fee Verification (via REST estimateprice API)

`https://anc.ca.apm.activecommunities.com/vancouver/rest/activity/detail/estimateprice/{urlId}?locale=en-US`

| Cohort | Schedule | Cost | Verified IDs |
|--------|----------|------|--------------|
| 6-7yr olds | 5-day regular | $115 | 613156 |
| 6-7yr olds | 4-day Canada Day / BC Day | $92 | existing DB entries |
| 6-7yr olds Wk 4 (Jul 20-24) | 5-day (anomaly) | **$110** | 613152 (existing, confirmed) |
| 8-12yr olds | 5-day regular | $115 | 613160, 613162 |
| 8-12yr olds | 4-day Canada Day / BC Day | $92 | 613159, 613164 |

**50% Leisure Access discount available on all programs.**

**6-7yr Wk 4 anomaly ($110 for 5-day):** Jul 20-24 has no holiday but ActiveNet charges $110
instead of $115. This is confirmed from the REST API and not a data error. Already in DB as
COV-613152. The 8-12yr Wk 4 (COV-613162) correctly charges $115.

---

## Funseekers Daycamp — 6-7yr olds

- Ages: "at least 6 yrs but less than 7y 11m" (ageMin=6, ageMax=7)
- Times: 9:00 AM – 3:00 PM (6 hrs, Full Day)
- Location: Gymnasium D - 2/3 at Britannia CC

| ID | Week | Dates | Days | Cost | Status |
|----|------|-------|------|------|--------|
| COV-613149 | Wk 1 | Jun 29–Jul 3 | Mon,Tue,Thu,Fri (Canada Day) | $92 | Already in DB |
| COV-613150 | Wk 2 | Jul 6–10 | Mon–Fri | $115 | Already in DB |
| COV-613151 | Wk 3 | Jul 13–17 | Mon–Fri | $115 | Already in DB |
| COV-613152 | Wk 4 | Jul 20–24 | Mon–Fri | **$110** (anomaly) | Already in DB |
| COV-613153 | Wk 5 | Jul 27–31 | Mon–Fri | $115 | Already in DB |
| COV-613154 | Wk 6 | Aug 4–7 (BC Day) | Tue–Fri | $92 | Already in DB |
| COV-613155 | Wk 7 | Aug 10–14 | Mon–Fri | $115 | Already in DB |
| COV-613156 | Wk 8 | Aug 17–21 | Mon–Fri | $115 | **Added** |
| COV-613157 | Wk 9 | Aug 24–28 | Mon–Fri | $115 | **Added** |
| COV-613158 | Wk 10 | Aug 31–Sep 4 | Mon–Fri | $115 | **Added** |

---

## Funseekers Daycamp — 8-12yr olds

- Ages: "at least 8 yrs but less than 12y 11m" (ageMin=8, ageMax=12)
- Times: 9:00 AM – 3:00 PM (6 hrs, Full Day)
- Note: Wk 7 (Aug 10–14) listed as "Britannia Cc" (lowercase) in ActiveNet — stored as "CC" (correct)

| ID | Week | Dates | Days | Cost | Status |
|----|------|-------|------|------|--------|
| COV-613159 | Wk 1 | Jun 29–Jul 3 | Mon,Tue,Thu,Fri (Canada Day) | $92 | **Added** |
| COV-613160 | Wk 2 | Jul 6–10 | Mon–Fri | $115 | **Added** |
| COV-613161 | Wk 3 | Jul 13–17 | Mon–Fri | $115 | **Added** |
| COV-613162 | Wk 4 | Jul 20–24 | Mon–Fri | $115 | **Added** |
| COV-613163 | Wk 5 | Jul 27–31 | Mon–Fri | $115 | **Added** |
| COV-613164 | Wk 6 | Aug 4–7 (BC Day) | Tue–Fri | $92 | **Added** |
| COV-613165 | Wk 7 | Aug 10–14 | Mon–Fri | $115 | **Added** |
| COV-613166 | Wk 8 | Aug 17–21 | Mon–Fri | $115 | **Added** |
| COV-613167 | Wk 9 | Aug 24–28 | Mon–Fri | $115 | **Added** |
| COV-613168 | Wk 10 | Aug 31–Sep 4 | Mon–Fri | $115 | **Added** |

---

## Gap Analysis

| Category | Live | In DB before | Added |
|----------|------|-------------|-------|
| Funseekers 6-7yr (10 wks) | 10 | 7 (Wk 1-7) | 3 (Wk 8-10) |
| Funseekers 8-12yr (10 wks) | 10 | 0 | 10 |
| **Total** | **20** | **7** | **13** |

---

## Notes

- Vancouver display ID − 2922 = URL ID (confirmed)
- 6-7yr: display 616071–616080 → URL 613149–613158
- 8-12yr: display 616081–616090 → URL 613159–613168
- Canada Day (Jul 1, Wed): Wk 1 runs Mon/Tue/Thu/Fri (4-day), cost = $92
- BC Day (Aug 3, Mon): Wk 6 runs Tue–Fri (4-day), cost = $92
- 6-7yr Wk 4 ($110 for 5-day) is a confirmed anomaly; 8-12yr Wk 4 correctly $115
- Wk 10 (Aug 31–Sep 4): Labour Day is Sep 7 (Mon), so this is a full 5-day week at $115
- "Britannia Cc" typo (lowercase c) in ActiveNet for 8-12yr Wk 7 (display #616087) — stored as "CC"
- Registration opens: Apr 8, 2026 at 7:00 PM
- Queue note: Rank 75 "Britannia Rink" also covers the CC Funseekers programs that were
  partially missed in the rank 18 (Britannia Cmty Centre) audit from 2026-04-05
