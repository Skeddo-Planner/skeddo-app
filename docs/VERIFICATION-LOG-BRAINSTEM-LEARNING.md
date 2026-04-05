# Verification Log — BrainSTEM Learning

**Date:** 2026-04-05
**Auditor:** Claude
**Registration page:** https://www.brainstemlearning.ca/programs/summer-camp
**Provider website:** https://www.brainstemlearning.ca
**Location:** 730 Marine Drive, North Vancouver, BC (Lower Lonsdale)

## Summary

Provider shows summer camps across **8 weeks** (Jul 6 – Aug 28, 2026) with **3 session types × 2 age groups = 6 program types** plus Spring Break and PD Day camps. Database previously had **10 programs** (full day ages 7-14 per week, plus spring break). After audit: **15 programs** total (5 added: half day AM/PM for ages 4-6, full day for ages 4-6, half day AM/PM for ages 7-14).

## Confirmed Program Details (from live page)

**Location:** 730 Marine Drive, North Vancouver, BC
**Ages:** 4-6 ("Little Brains") and 7-14 ("Specialists/Managers")
**Schedule:** 8 weeks, Jul 6 – Aug 28 (4-day week: Aug 4-7)

### Session Types and Times

| Type | Ages 4-6 | Ages 7-14 |
|------|----------|----------|
| Half Day AM | 9:30 AM – 12:00 PM | 9:00 AM – 12:00 PM |
| Half Day PM | 1:00 PM – 3:30 PM | 1:00 PM – 4:00 PM |
| Full Day | 9:30 AM – 3:30 PM | 9:00 AM – 4:00 PM |

### Pricing (confirmed from live page)

| Type | Regular Week | 4-Day Week (Aug 4-7) |
|------|-------------|---------------------|
| Half Day | $300/week | $240/week |
| Full Day | $660/week | $528/week |
| Lunch add-on (full day) | $60/week | $48/week |

### Weekly Schedule (Ages 7-14 AM themes)
- Week 1 (Jul 6-10): STEM Olympic Challenge AM / Robotics PM
- Week 2 (Jul 13-17): Crazy Science AM / Challenging Construction PM
- Week 3 (Jul 20-24): Aquatic Amusement AM / True STEM Heroes PM
- Week 4 (Jul 27-31): Challenging Physics AM / Robotics Updated PM
- Week 5* (Aug 4-7): True STEM Heroes AM / Aquatic Amusement PM *(4-day week)*
- Week 6 (Aug 10-14): Scratch Game Design AM / Crazy Science PM
- Week 7 (Aug 17-21): Robotics Updated AM / STEM Olympic Challenge PM
- Week 8 (Aug 24-28): Scratch Game Design AM / Adventure Vacations PM

## Discrepancies Found and Fixed

### 1. registrationUrl (all 10 existing records) — FIXED
- **Was:** `https://brainstemlearningcanada.perfectmind.com/Menu/MemberRegistration/MemberSignIn` (a login page, not a program page)
- **Now:** `https://www.brainstemlearning.ca/programs/summer-camp`
- **Why:** The old URL goes to a generic member signin page. Parents need to see the program page first.

### 2. Spring Break Mar 23-27 (record 694) — FIXED
- **Was:** enrollmentStatus "Open"
- **Now:** enrollmentStatus "Completed"
- **Why:** The camp ran Mar 23-27, 2026. Today is Apr 5, 2026 — this session is past.

### 3. Program names (records 155-160, 2397-2398) — FIXED
- **Was:** Generic "STEM Summer Camp (Full Day)"
- **Now:** "BrainSTEM STEM Camp – Full Day Ages 7-14 (Week N)"
- **Why:** Better distinguishes from new half-day and ages 4-6 listings.

### 4. Missing programs — ADDED (5 new)
Provider offers half-day morning, half-day afternoon, and full-day options for BOTH age groups (4-6 and 7-14). Previously only full-day ages 7-14 (per week) was in the DB.

Added:
- `brainstem-hd-am-46` — Half Day Morning Ages 4-6 ($300/week, 9:30 AM-12:00 PM)
- `brainstem-hd-pm-46` — Half Day Afternoon Ages 4-6 ($300/week, 1:00 PM-3:30 PM)
- `brainstem-fd-46` — Full Day Ages 4-6 ($660/week, 9:30 AM-3:30 PM)
- `brainstem-hd-am-714` — Half Day Morning Ages 7-14 ($300/week, 9:00 AM-12:00 PM)
- `brainstem-hd-pm-714` — Half Day Afternoon Ages 7-14 ($300/week, 1:00 PM-4:00 PM)

## Verified Fields (no change needed)
- Address: 730 Marine Drive, North Vancouver — confirmed correct
- Full Day times for ages 7-14 (9:00 AM – 4:00 PM) — confirmed correct
- Full Day costs ($660/$528 for 4-day week) — confirmed correct
- Spring Break Mar 16-20 (record 693) — correctly "Completed"
- PD Day records (15941, 15942) — retained as-is (separate program type)

## Notes
- The live page header lists "7-11, 12-14 YEARS" but the program text consistently says "ages 7-14" as one group. No distinct age-band pricing or curriculum differences were shown — confirmed as one listing per session type. R46 validator warnings on 7-14 range are intentional.
- BrainSTEM also runs PD Day camps (separate listing) and Spring Break camps (seasonal).
- The registration widget on the page uses PerfectMind embed — parents can browse weeks and register at the program page URL.
- Multi-week registration available — parents pick individual weeks at registration.
- Childcare tax receipts available.
