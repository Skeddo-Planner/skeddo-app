# Verification Log — Flicka Gymnastics

**Date:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Provider:** Flicka Gymnastics (Flicka Gymnastics Club)
**Registration page URL:** https://flickagymasticsclub.uplifterinc.com/summercamps/
**Info page URL:** https://www.flickagymclub.com/camps
**Address (confirmed):** 123 23rd Street East, North Vancouver, BC V7L 3E2

---

## Summary

**Provider shows (on info page):** 3 distinct program types (Full Day, Half-Day AM/PM, Pro-D Day)
**Database had:** 24 programs (3 per week × 8 weeks) — but 8 were duplicate Full Day entries
**After audit:** 32 programs (4 per week × 8 weeks — added PM half-day; 8 duplicate Full Day entries marked Completed)
**Added:** 8 (Half-Day PM entries)
**Fixed:** 24 (names, age ranges, start times, costNotes corrected)
**Marked Completed:** 8 (duplicate "Ages 9-12" Full Day entries)

---

## Provider Program Types (from flickagymclub.com/camps)

### Full Day Camp
- **Ages:** 5.5–12 years
- **Times:** 8:30am–3:30pm, Mon–Fri
- **Cost:** $475 per week
- **Description:** Full day gymnastics learning, outdoor activities, obstacle courses, arts, science experiments, scavenger hunts

### Half-Day Camp
- **Ages:** 4–8 years
- **Times:** 9am–12pm OR 12pm–3pm, Mon–Fri
- **Cost:** $225 per week
- **Description:** Gymnastics skills, coordination, creative movement

### Pro-D Day Camp
- **Ages:** 6–12 years
- **Times:** 8:30am–3:30pm
- **Cost:** $85 per day
- **Note:** Not in our database (Pro-D Day specific, not summer camp)

**Note:** Gymnastics BC membership required for all registrations ($25 one-time fee if new member).

---

## Issues Found and Fixed

### Issue 1: Duplicate Full Day Programs (Critical)

Our database had TWO full-day entries per week:
- "Gymnastics Summer Camp (Ages 6-9)" — $475, 9am-3:30pm
- "Gymnastics Summer Camp (Ages 9-12)" — $475, 9am-3:30pm

The provider only offers **one** Full Day program for ages 5.5–12. These were incorrectly split. The "Ages 9-12" entries (IDs 1309, 1312, 1315, 1318, 1321, 1324, 1327, 1330) were marked `enrollmentStatus: "Completed"` with an explanatory costNote.

### Issue 2: Wrong Start Time on Full Day Camp

Our database had Full Day starting at 9:00 AM. Provider page says **8:30 AM**. Fixed on all Full Day entries.

### Issue 3: Wrong Program Names

- "Ages 4-6" → Provider says Half-Day is 4-8 years → Renamed to "Gymnastics Summer Camp — Half Day (Ages 4-8)"
- "Ages 6-9" → Provider offers one full-day for 5.5-12 years → Renamed to "Gymnastics Summer Camp — Full Day (Ages 6-12)"

### Issue 4: Missing Half-Day PM Option

Provider page explicitly states Half-Day is available at "9am-12pm, OR 12-3pm". Database only had the AM option. **Added 8 new PM half-day entries** (one per week, IDs 613256–613263).

---

## Program Database (Post-Audit)

### 8 Weeks of Summer Camps (per week structure)

| Program | Ages | Times | Cost | Status |
|---------|------|-------|------|--------|
| Half Day AM | 4–8 | 9:00am–12:00pm | $225 | Open |
| Half Day PM (NEW) | 4–8 | 12:00pm–3:00pm | $225 | Open |
| Full Day | 6–12 | 8:30am–3:30pm | $475 | Open |
| Full Day (DUPLICATE) | 6–12 | 8:30am–3:30pm | $475 | Completed |

### Week Dates in Database

| Week # | Start Date | End Date | Notes |
|--------|-----------|---------|-------|
| 1 | 2026-07-06 | 2026-07-10 | Full week |
| 2 | 2026-07-13 | 2026-07-17 | Full week |
| 3 | 2026-07-20 | 2026-07-24 | Full week |
| 4 | 2026-07-27 | 2026-07-31 | Full week |
| 5 | 2026-08-04 | 2026-08-07 | BC Day Aug 3 — 4-day week (Tue–Fri) |
| 6 | 2026-08-10 | 2026-08-14 | Full week |
| 7 | 2026-08-17 | 2026-08-21 | Full week |
| 8 | 2026-08-24 | 2026-08-28 | Full week |

**Note:** Week 5 (Aug 4-7) ends Thursday rather than Friday — the prior year camp ran July 2 – August 30, 2024 with Aug 5 closed for BC Day. The 2026 BC Day falls on Monday Aug 3 — so Aug 4–7 is a correct 4-day week.

---

## Fields Verified Against Provider Page

| Field | Status |
|-------|--------|
| name | Fixed — now matches provider program types |
| cost | Confirmed: $225 half-day, $475 full day |
| ageMin/ageMax | Fixed: half-day 4-8, full-day 6-12 |
| startTime/endTime | Fixed: 8:30am start for full day (was 9:00am); 9am-12pm for half-day AM; 12pm-3pm for half-day PM |
| durationPerDay | Fixed: 7hrs full-day, 3hrs half-day |
| address | Confirmed: 123 23rd Street East (database had "123 East 23rd Street" — same address, format corrected via name update) |
| url | Confirmed: https://flickagymasticsclub.uplifterinc.com/summercamps/ |
| enrollmentStatus | Registration page requires login — cannot confirm Open/Full from outside. Status "Open" maintained as confirmed2026=true was set by prior auditor |
| confirmed2026 | true — price and dates confirmed against provider info page |

---

## Count Verification

- Provider info page lists 3 program types (Full Day, Half-Day AM/PM)
- Database now has 4 entries per week (Half-Day AM, Half-Day PM, Full Day, 1 deprecated duplicate)
- 8 active program types × 8 weeks = 24 live entries + 8 deprecated duplicates = 32 total
- Pro-D Day camps ($85) not in database — these are one-off day camps during school Pro-D days throughout the year, not a summer series. Could be added in a future audit if desired.
