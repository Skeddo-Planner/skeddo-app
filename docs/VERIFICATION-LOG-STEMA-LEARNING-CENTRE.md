# Verification Log — STEMA Learning Centre

**Audit date:** 2026-04-05
**Auditor:** Claude (automated)
**Registration page URL:** https://vancouver.stemalearning.com/product/summercamp2026/
**Overall status:** COMPLETED — existing data verified, duplicates cleaned up

---

## Summary

| Metric | Value |
|--------|-------|
| Programs found on live page | 9 weekly summer camps (2 age groups) + Pro-D days |
| Programs in database (before audit) | 27 |
| Programs added | 0 |
| Programs fixed | 11 (ageSpanJustified added, duplicates marked Completed) |
| Programs marked Completed | 2 (duplicate generic entries) |

---

## Provider Details

| Field | Value |
|-------|-------|
| Name | STEMA Learning Centre |
| Location | 1025 Kingsway, Vancouver, BC V5V 3C7 (East Vancouver) |
| Phone | 604-283-6788 ext. 2 |
| Email | vancouver@stemalearning.com |
| Registration URL | https://vancouver.stemalearning.com/product/summercamp2026/ |

---

## 2026 Summer Camp Program (verified from live page)

### STEMA Junior Explorers — Ages 5–7 (Grades K–2)

| ID | Dates | Days | Cost | Status |
|----|-------|------|------|--------|
| stema-junior-w1 | Jun 29–Jul 3, 2026 | Mon–Thu (4 days) | $312 | Open |
| stema-junior-w2 | Jul 6–10, 2026 | Mon–Fri | $389 | Open |
| stema-junior-w3 | Jul 13–17, 2026 | Mon–Fri | $389 | Open |
| stema-junior-w4 | Jul 20–24, 2026 | Mon–Fri | $389 | Open |
| stema-junior-w5 | Jul 27–31, 2026 | Mon–Fri | $389 | Open |
| stema-junior-w6 | Aug 3–7, 2026 | Mon–Thu (4 days) | $312 | Open |
| stema-junior-w7 | Aug 10–14, 2026 | Mon–Fri | $389 | Open |
| stema-junior-w8 | Aug 17–21, 2026 | Mon–Fri | $389 | Open |
| stema-junior-w9 | Aug 24–28, 2026 | Mon–Fri | $389 | Open |

### STEMA Innovators — Ages 8–13 (Grades 2–7)

| ID | Dates | Days | Cost | Status |
|----|-------|------|------|--------|
| 2399 | Jun 29–Jul 3, 2026 | Mon–Thu (4 days) | $312 | Open |
| 1180 | Jul 6–10, 2026 | Mon–Fri | $389 | Open |
| 1181 | Jul 13–17, 2026 | Mon–Fri | $389 | Open |
| 1182 | Jul 20–24, 2026 | Mon–Fri | $389 | Open |
| 1183 | Jul 27–31, 2026 | Mon–Fri | $389 | Open |
| 1184 | Aug 3–7, 2026 | Mon–Thu (4 days) | $312 | Open |
| 1185 | Aug 10–14, 2026 | Mon–Fri | $389 | Open |
| 1186 | Aug 17–21, 2026 | Mon–Fri | $389 | Open |
| 1187 | Aug 24–28, 2026 | Mon–Fri | $389 | Open |

**All summer camp entries:** Time 9:00 AM – 4:00 PM, confirmed2026=true, priceVerified=true

**Note on half-day options:** The registration page lists full-day (9am–4pm), extended (9am–6pm), half-day AM (9am–12pm), and half-day PM (1pm–4pm) as selectable options. Specific per-slot pricing was not extractable via static fetch (requires interactive selection). The database currently only captures full-day entries. Half-day summer camp entries could be added in a future audit with browser tool access.

---

## Pro-D Day Camps (verified)

| ID | Date | Times | Cost | Ages | Status |
|----|------|-------|------|------|--------|
| proday-stema-jun26-fullday | Jun 26, 2026 | 9am–4pm | $100 | 5–13 | Open |
| proday-stema-jun26-halfday-am | Jun 26, 2026 | 9am–12pm | $60 | 5–13 | Open |
| proday-stema-jun26-halfday-pm | Jun 26, 2026 | 1pm–4pm | $60 | 5–13 | Open |
| proday-stema-fullday-1 | Apr 20, 2026 | 9am–4pm | $100 | 5–15 | Open |
| proday-stema-halfday-am-1 | Apr 20, 2026 | 9am–12pm | $60 | 5–15 | Open |
| proday-stema-halfday-pm-1 | Apr 20, 2026 | 1pm–4pm | $60 | 5–15 | Open |
| proday-stemalearningcentre-20260515-... | May 15, 2026 | 9am–4pm | $100 | 5–15 | Likely Coming Soon |

---

## Changes Made

| ID | Change |
|----|--------|
| stema-surrey-1 | Marked Completed (duplicate generic, superseded by week-specific entries) |
| stema-van-1 | Marked Completed (duplicate generic, superseded by week-specific entries) |
| stema-van-1 + stema-surrey-1 | ageSpanJustified added |
| proday-stema-* (7 entries) | ageSpanJustified added (provider uses mixed-age groups for Pro-D days) |

---

## Count Verification

Provider shows 9 weeks × 2 age groups = 18 summer camp slots + multiple Pro-D day options.
Database has 18 active weekly summer entries + 7 Pro-D day entries = 25 active entries (correct).
2 duplicate generic entries marked Completed.

---

## Notes

- **Super Early Bird offer** runs until April 15, 2026 — pricing on website may change after that date
- Half-day summer camp entries are missing from database (site is dynamic; prices not extractable via static fetch)
- stema-junior entries (Ages 5–7) and numbered entries 1180-1187/2399 (Ages 8–13) represent STEMA's two age groups correctly separated
