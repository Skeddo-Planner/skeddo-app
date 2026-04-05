# Verification Log — Richmond Olympic Oval

**Date:** 2026-04-05
**Auditor:** Claude (automated)
**Info Page:** https://richmondoval.ca/camps/summer-camps/
**Registration Portal:** https://richmondoval.perfectmind.com/... (PerfectMind — opens May 1, 2026 at 8pm)
**Status:** PARTIAL — registration portal not yet open

---

## Summary

| Metric | Value |
|--------|-------|
| Programs confirmed on provider website | 9 types (30+ distinct programs) |
| Programs in database | 9 |
| Programs updated | 9 (removed false verified flags, set Coming Soon) |
| Programs added | 0 |

---

## Key Finding: Registration Opens May 1, 2026

The Richmond Olympic Oval's summer camp registration for the general public opens **May 1, 2026 at 8pm** via PerfectMind. Individual session prices and availability cannot be verified until then. The PerfectMind portal is JavaScript-rendered and returns no program data before registration opens.

**Action required:** Re-audit on or after May 1, 2026 to verify:
- Exact prices per week/session
- Session dates and availability per program
- Enrollment status per week

---

## Provider Information

- **Location:** 6111 River Rd, Richmond, BC V7C 0A2
- **Phone:** 1-778-296-1400
- **Email:** camps@richmondoval.ca
- **Registration portal:** https://richmondoval.perfectmind.com/22161/Clients/BookMe4BookingPages/BookingCoursesPage?widgetId=11295dc8-a5e8-4bf4-954f-a873ef1abeef&calendarId=e2732d13-bcfe-4906-bcf4-81961e2abe86&singleCalendarWidget=False

## Confirmed 2026 Program Types

Camps run Mon-Fri, July 6 – September 4, 2026, at 6111 River Rd, Richmond.

| Program | Ages | Format |
|---------|------|--------|
| Multi-Sport Camp (ages 6-10) | 6-10 | Full Day 9am-4pm |
| Multi-Sport Camp (ages 11-14) | 11-14 | Full Day 9am-4pm |
| Adventure Bike Camp (ages 6-9) | 6-9 | Half Day |
| Adventure Bike Camp (ages 9-12) | 9-12 | Half Day |
| Learn to Skate Camp (ages 6-9) | 6-9 | Half Day |
| Ice Sports Camp (ages 9-12) | 9-12 | Half Day |
| Sport-Specific Camp (ages 6-9) | 6-9 | Full/Half Day |
| Sport-Specific Camp (ages 9-12) | 9-12 | Full/Half Day |
| Tot Multi-Sport Camp (ages 4-5) | 4-5 | 3-hour session |

Also confirmed but not yet in database:
- Oval Explorers (monthly program, July 6-31 OR Aug 10-Sep 4) — opened registration April 1, 2026
- 16 sport-specific sub-programs (Basketball, Badminton, Soccer, etc.)

## Database Corrections Made

All 9 entries updated:
- Removed `isEstimate=true` flags
- Set `confirmed2026=true` (programs confirmed running in 2026)
- Set `priceVerified=false` (portal not yet open)
- Set `cost=null` (prices unverified)
- Set `enrollmentStatus=Coming Soon` with `registrationDate=2026-05-01`
- Updated `registrationUrl` to PerfectMind portal
- Added `costNote` explaining registration timeline
