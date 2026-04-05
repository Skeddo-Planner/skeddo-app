# Verification Log — Origins Parkour

**Date:** 2026-04-05
**Auditor:** Claude
**Registration page:** https://www.wellnessliving.com/rs/event/origins_parkour?k_class=939946
**Provider website:** https://originsparkour.com/camps/
**Location:** 3rd Floor, 2665 Main St, Vancouver, BC (Mount Pleasant)

## Summary

Provider shows **12 summer camp sessions** on the live registration page. Database has **12 programs**. Count matches — 0 added, 12 corrected.

All programs now have "Enroll now" buttons visible on the live WellnessLiving page — registration is currently open for all summer 2026 camps.

## Program Data (from live WellnessLiving registration page)

### Full Day Summer Camp (Ages 7-12) — k_class=939946
Mon–Fri, 9:00 AM – 3:00 PM | $620 | Location: Origins Parkour - Vancouver

| ID | Dates | Status |
|----|-------|--------|
| origins-parkour-fd-1 | Jul 6–10, 2026 | Open (Enroll now) |
| origins-parkour-fd-2 | Jul 13–17, 2026 | Open (Enroll now) |
| origins-parkour-fd-3 | Jul 27–31, 2026 | Open (Enroll now) |
| origins-parkour-fd-4 | Aug 10–14, 2026 | Open (Enroll now) |
| origins-parkour-fd-5 | Aug 31–Sep 4, 2026 | Open (Enroll now) |

### Half Day Summer Camp Ages 5–7 (Morning) — k_class=941074
Mon–Fri, 9:00 AM – 12:00 PM | $340 | Location: Origins Parkour - Vancouver

| ID | Dates | Status |
|----|-------|--------|
| origins-parkour-hd57-1 | Jun 29–Jul 3, 2026 | Open (Enroll now) |
| origins-parkour-hd57-2 | Aug 3–7, 2026 | Open (Enroll now) |

### Half Day Summer Camp Ages 7–12 (Afternoon) — k_class=941053
| ID | Dates | Time | Status |
|----|-------|------|--------|
| origins-parkour-hd712-1 | Jun 29–Jul 3, 2026 | **12:30 PM – 3:30 PM** | Open (Enroll now) |
| origins-parkour-hd712-2 | Jul 20–24, 2026 | 9:00 AM – 12:00 PM | Open (Enroll now) |
| origins-parkour-hd712-3 | Aug 3–7, 2026 | **12:30 PM – 3:30 PM** | Open (Enroll now) |

Note: Half Day 7-12 alternates between morning and afternoon time slots by week.

### Summer SKILLS Camp Ages 10–17 — k_class=941071
**12:30 PM – 3:30 PM** | Mon–Fri | $395 | Jul 20–24, 2026 | Open (Enroll now)

### SUPER CAMP Ages 10–17 — k_class=941083
9:00 AM – 3:00 PM | **Tue–Fri** (4 days) | $749 | Aug 25–28, 2026 | Open (Enroll now)

## Discrepancies Found and Fixed

### 1. enrollmentStatus (ALL 12 programs) — FIXED
- **Was:** "Likely Coming Soon"
- **Now:** "Open"
- **Why:** Live WellnessLiving page shows active "Enroll now" buttons for all 12 sessions. Registration is open as of 2026-04-05.

### 2. Half Day 7-12 times — Jun 29 and Aug 3 sessions (hd712-1, hd712-3) — FIXED
- **Was:** startTime 9:00 AM, endTime 12:00 PM
- **Now:** startTime 12:30 PM, endTime 3:30 PM
- **Why:** Live page confirms these are afternoon sessions (12:30pm-3:30pm PT). Only the Jul 20 session is morning (9:00am-12:00pm). The Jun 29 and Aug 3 sessions run in the afternoon alongside the Ages 5-7 morning sessions at the same location.

### 3. Skill Camp time (origins-parkour-skill-1) — FIXED
- **Was:** startTime 9:00 AM, endTime 3:00 PM
- **Now:** startTime 12:30 PM, endTime 3:30 PM
- **Why:** Live page confirms "Mon, Tue, Wed, Thu, Fri, 12:30pm – 3:30pm PT"

### 4. Super Camp days (origins-parkour-super-1) — FIXED
- **Was:** days "Mon-Thu"
- **Now:** days "Tue-Fri"
- **Why:** Live page confirms "Tue, Wed, Thu, Fri" (4-day camp running Aug 25 which is a Tuesday through Aug 28 which is a Friday)

## Verified Fields (no change needed)
- All costs match live page: Full Day $620, Half Day $340, Skill Camp $395, Super Camp $749
- All dates match live page
- Full Day Camp times (9:00 AM – 3:00 PM) confirmed correct
- Half Day 5-7 times (9:00 AM – 12:00 PM) confirmed correct
- Ages match: Full Day ages 7-12, Half Day 5-7, Half Day 7-12, Skill/Super 10-17
- Address confirmed: 3rd Floor, 2665 Main St, Vancouver (Mount Pleasant)
- All registrationUrls point to correct WellnessLiving k_class pages

## Notes
- Provider also offers Spring Break camps (Spring Camp Age 5-7 Morning, Spring Camp Age 7-12 Afternoon, Full Day Vancouver, Full Day Port Moody) and events (Origins Spring Classic 2026 Adult/Kids). These are not in the current audit scope (Port Moody location outside Metro Vancouver focus area; Spring Break camps may have already completed or started).
- The Skill Camp and Super Camp age range 10-17 triggers R46 validator warning (7-year span). Confirmed from live page that Origins Parkour offers these as a single undivided age group for older athletes — no age band breakdown exists. Violation is expected and not a data error.
- Multi-week discounts available per the camps page ("Up to $150 off when booking multiple full-day weeks") — not reflected in per-session pricing.
