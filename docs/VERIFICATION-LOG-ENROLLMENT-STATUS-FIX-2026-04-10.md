# Verification Log — Enrollment Status Fix (2026-04-10)

**Date:** 2026-04-10
**Method:** ActiveNet REST API (`/rest/activity/detail/{id}`) for all COV/BNB/WV/PC/LGY entries
**DB count:** 16,110 programs (unchanged)
**Violations before:** 0
**Violations after:** 0

---

## Root Cause #3: Stale Enrollment Statuses

### Problem

ActiveNet programs go Full, get Waitlists, or close registration frequently. Our data was imported once and never refreshed — 36% of ActiveNet entries had stale statuses.

Browser spot-check confirmed the issue on 3 of 10 entries:
- BNB-92068 (Dance Camp): data=Open, page=Full (29 on waitlist)
- BNB-102045 (Aquafit): data=Open, page=Enrollment opens May 25
- COV-616518 (Skating Preschool): data=Open, page=Full (11 on waitlist)

### Fix

Rewrote `scripts/update-activenet-status.cjs` to:
1. Query ActiveNet REST API for all 4,191 ActiveNet entries
2. Map `space_status` to our `enrollmentStatus` enum
3. Protect against downgrading `Completed` or `Likely Coming Soon` entries
4. Also extract `ageMax` from API response where missing

### Results

| Status Transition | Count |
|-------------------|-------|
| Open → Full/Waitlist | 1,081 |
| Open → Full | 184 |
| Open → Cancelled | 69 |
| Open → Closed | 66 |
| Full/Waitlist → Closed | 50 |
| Full → Full/Waitlist | 43 |
| Full/Waitlist → Cancelled | 28 |
| Full/Waitlist → Full | 7 |
| Waitlist → Full/Waitlist | 1 |
| **Total status changes** | **1,529** |

### Automation

Added `update-activenet-status.cjs --fix` to the daily CI pipeline (`.github/workflows/refresh-programs.yml`) so statuses are refreshed automatically every day at 6 AM Pacific.

---

## Summary

| Action | Count |
|--------|-------|
| Enrollment statuses corrected via API | 1,529 |
| API errors (timeout/unreachable) | 1 |
| Script added to daily CI pipeline | ✓ |
