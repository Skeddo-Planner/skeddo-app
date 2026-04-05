# Verification Log — Vancouver Mandarin School

**Date:** 2026-04-05
**Auditor:** Claude
**Registration page:** https://www.vancouvermandarinschool.com/mandarin-immersion-camps
**Provider website:** https://www.vancouvermandarinschool.com/mandarin-immersion-camps
**Location:** Annie B. Jamieson Elementary School, 6350 Tisdall St, Vancouver, BC (Marpole)

## Summary

Provider shows **10 summer camp session types** and **2 Spring Bootcamp weeks** on the live page. Database had **10 summer programs** (2514-2523). After audit: **12 programs** total (2 Spring Bootcamp records added as Completed).

## Confirmed Program Details (from live page)

**Ages:** 5-12 (all levels of Mandarin)
**Location (Summer):** Annie B. Jamieson Elementary School, 6350 Tisdall St, Vancouver
**Location (Spring Bootcamp):** 6184 Ash Street, Vancouver

### Summer Camp Sessions

Two-week cycles, project-based immersion:

| Group | Weeks | Dates | Sessions Available |
|-------|-------|-------|-------------------|
| W1 & W2 | 1-2 | Jul 6-10, Jul 13-17 | Half Day AM, Half Day PM, Full Day |
| W3 & W4 | 3-4 | Jul 20-24, Jul 27-31 | Half Day AM, Half Day PM, Full Day |
| *W5 & W6 | 5-6 | Aug 4-7, Aug 10-14 | Half Day AM, Half Day PM, Full Day |
| W7 | 7 | Aug 17-21 | Full Day only |

*W5 starts Aug 4 (Tuesday) — BC Day Aug 3 is a stat holiday.

**Session times:**
- Half Day AM: 9:00 AM – 12:00 PM
- Half Day PM: 12:30 PM – 3:30 PM
- Full Day: 9:00 AM – 3:30 PM

**Pricing (per 2-week cycle, non-member):**
- Half Day: $298
- Full Day: $498

### Spring Bootcamp (both past as of 2026-04-05)
- W1: March 16-20 | Half Day: 9:30 AM – 12:15 PM or 12:30 – 3:15 PM
- W2: March 23-27 | Half Day: 9:30 AM – 12:15 PM or 12:30 – 3:15 PM
- Location: 6184 Ash Street, Vancouver (also 2524 Cypress Street, Vancouver listed)
- Price: Not listed on page

## Discrepancies Found and Fixed

### 1. ageMin (ALL 10 summer records) — FIXED
- **Was:** ageMin 6
- **Now:** ageMin 5
- **Why:** Live page says "Designed for kids aged 5-12." The original DB had 6 as minimum, which excluded eligible 5-year-olds.

### 2. Missing Spring Bootcamp records — ADDED (2 new)
- **Added:** vms-spring-bootcamp-w1 (Mar 16-20) and vms-spring-bootcamp-w2 (Mar 23-27)
- **Status:** Completed (both past as of 2026-04-05)
- **Why:** Provider's live page still shows Spring Bootcamp as a program offered. Completed programs that were offered should be retained in DB per policy.
- **Note:** Price not visible on provider page — costNote set accordingly.

## Verified Fields (no change needed)
- All summer session dates: confirmed correct
- All summer times: confirmed correct (AM 9:00-12:00, PM 12:30-3:30, Full 9:00-3:30)
- All summer prices: confirmed correct ($298 half-day, $498 full-day per 2-week cycle)
- Address 6350 Tisdall St, Vancouver: confirmed correct
- Neighbourhood Marpole: confirmed correct
- All registrationUrls: confirmed correct
- W5 start Aug 4 (Tuesday): correct — BC Day stat holiday on Aug 3

## R43/R46 Violations (Expected)
The live page says classes are "Divided by age (5-8 and 9-12)" — this is internal classroom management, not separate registration listings. The provider offers a single enrollment for each session type covering all ages 5-12. R43/R46 warnings are expected given the provider's format and do not represent a data error. Each record has been annotated with this explanation in costNote.

## Notes
- Spring Bootcamp location is different from summer camps (Ash Street vs Tisdall Street)
- Spring Bootcamp has both AM and PM half-day options — DB records use AM times (9:30-12:15)
- Provider also offers a June Study Tour in China — out of scope for this database
- All session types within the same "W1&W2" group are for the same 2-week block (Jul 6-17); parents choose half-day AM, half-day PM, or full day at registration
