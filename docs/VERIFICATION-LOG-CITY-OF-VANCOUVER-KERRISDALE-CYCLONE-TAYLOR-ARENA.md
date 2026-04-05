# Verification Log — City of Vancouver - Kerrisdale Cyclone Taylor Arena

**Date audited:** 2026-04-05 (session 2 — re-attempt)
**Auditor:** Claude (automated audit agent)
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?facilityId=59
**Result:** INCOMPLETE — Playwright browser could not spawn (multiple sessions, multiple attempts)

---

## Blocking Issue

Playwright browser failed with `spawn UNKNOWN` on all launch attempts across two sessions (session 1 and session 2, same day). Attempts included waits of 5s, 15s, and 30s between tries.

```
Error: server: spawn UNKNOWN
Call log:
  - <launching> C:\Users\thoma\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe
    -no-remote -headless -profile ... -juggler-pipe about:blank
```

This is the same system-level resource exhaustion issue documented in recent audit commits
(Dunbar, Creekside, Mount Pleasant). No live page data could be retrieved.

---

## Existing Database State (45 programs — unchanged)

All 45 existing programs were previously confirmed (confirmed2026: true, priceVerified: true).
No changes were made since live page could not be accessed to verify current state.

### Play Palace Public Party - Upper North (9 slots)

| ID | Date | Time | Cost | Status |
|----|------|------|------|--------|
| COV-607213 | 2026-04-11 Sat | 10:30 AM–12:30 PM | $131.18 | Open |
| COV-607231 | 2026-04-12 Sun | 10:30 AM–12:30 PM | $131.18 | Open |
| COV-607242 | 2026-04-11 Sat | 1:30 PM–3:30 PM | $131.18 | Open |
| COV-607252 | 2026-04-12 Sun | 1:30 PM–3:30 PM | $131.18 | Open |
| COV-613450 | 2026-04-18 Sat | 10:30 AM–12:30 PM | $131.18 | Open |
| COV-613454 | 2026-04-25 Sat | 10:30 AM–12:30 PM | $131.18 | Open |
| COV-613459 | 2026-05-02 Sat | 10:30 AM–12:30 PM | $131.18 | Open |
| COV-613462 | 2026-05-09 Sat | 10:30 AM–12:30 PM | $131.18 | Open |
| COV-613464 | 2026-05-16 Sat | 10:30 AM–12:30 PM | $131.18 | Open |

### Play Palace Public Party - Upper Centre (23 slots)

| ID | Date | Time | Cost | Status |
|----|------|------|------|--------|
| COV-607259 | 2026-04-13 Mon | 2:00 PM–4:00 PM | $111.31 | Open |
| COV-607260 | 2026-04-14 Tue | 2:00 PM–4:00 PM | $111.31 | Open |
| COV-607262 | 2026-04-15 Wed | 2:00 PM–4:00 PM | $111.31 | Open |
| COV-607263 | 2026-04-16 Thu | 2:00 PM–4:00 PM | $111.31 | Open |
| COV-607264 | 2026-04-17 Fri | 2:00 PM–3:30 PM | $81.51 | Open |
| COV-610855 | 2026-04-20 Mon | 2:00 PM–4:00 PM | $111.31 | Open |
| COV-610856 | 2026-04-27 Mon | 2:00 PM–4:00 PM | $111.31 | Open |
| COV-610857 | 2026-05-04 Mon | 2:00 PM–4:00 PM | $111.31 | Open |
| COV-610858 | 2026-05-11 Mon | 2:00 PM–4:00 PM | $111.31 | Open |
| COV-610859 | 2026-05-18 Mon | 2:00 PM–4:00 PM | $111.31 | Open |
| COV-610882 | 2026-06-09 Tue | 2:00 PM–4:00 PM | $111.31 | Open |
| COV-612254 | 2026-05-21 Thu | 2:00 PM–4:00 PM | $111.31 | Open |
| COV-613404 | 2026-06-07 Sun | 1:30 PM–3:30 PM | $131.18 | Open |
| COV-613405 | 2026-06-14 Sun | 1:30 PM–3:30 PM | $131.18 | Open |
| COV-613406 | 2026-06-21 Sun | 1:30 PM–3:30 PM | $131.18 | Open |
| COV-613407 | 2026-06-28 Sun | 1:30 PM–3:30 PM | $131.18 | Open |
| COV-613408 | 2026-07-05 Sun | 1:30 PM–3:30 PM | $131.18 | Open |
| COV-613409 | 2026-07-12 Sun | 1:30 PM–3:30 PM | $131.18 | Open |
| COV-613410 | 2026-07-19 Sun | 1:30 PM–3:30 PM | $131.18 | Open |
| COV-613411 | 2026-07-26 Sun | 1:30 PM–3:30 PM | $131.18 | Open |
| COV-613412 | 2026-08-02 Sun | 1:30 PM–3:30 PM | $131.18 | Open |
| COV-613413 | 2026-08-09 Sun | 1:30 PM–3:30 PM | $131.18 | Open |
| COV-613414 | 2026-08-16 Sun | 1:30 PM–3:30 PM | $131.18 | Open |

### Play Palace Public Party - Skaters Lounge (10 slots)

| ID | Date | Time | Cost | Status |
|----|------|------|------|--------|
| COV-613708 | 2026-08-16 Sun | 10:30 AM–12:30 PM | $124.26 | Open |
| COV-613716 | 2026-06-07 Sun | 1:30 PM–3:30 PM | $124.26 | Open |
| COV-613718 | 2026-06-21 Sun | 1:30 PM–3:30 PM | $124.26 | Open |
| COV-613719 | 2026-06-28 Sun | 1:30 PM–3:30 PM | $124.26 | Open |
| COV-613720 | 2026-07-05 Sun | 1:30 PM–3:30 PM | $124.26 | Open |
| COV-613721 | 2026-07-12 Sun | 1:30 PM–3:30 PM | $124.26 | Open |
| COV-613722 | 2026-07-19 Sun | 1:30 PM–3:30 PM | $124.26 | Open |
| COV-613723 | 2026-07-26 Sun | 1:30 PM–3:30 PM | $124.26 | Open |
| COV-613724 | 2026-08-02 Sun | 1:30 PM–3:30 PM | $124.26 | Open |
| COV-613725 | 2026-08-09 Sun | 1:30 PM–3:30 PM | $124.26 | Open |

### Private Play Palace Party (3 slots)

| ID | Date | Time | Cost | Status |
|----|------|------|------|--------|
| COV-611061 | 2026-04-27 Mon | 5:00 PM–7:00 PM | $411.20 | Open |
| COV-611107 | 2026-05-06 Wed | 5:00 PM–7:00 PM | $411.20 | Open |
| COV-611856 | 2026-06-21 Sun | 4:30 PM–6:30 PM | $456.90 | Open |

---

## Summary

- **Provider shows:** Unknown (live page could not be loaded)
- **Database has:** 45 programs (4 distinct program types, multiple date slots)
- **Added:** 0
- **Fixed:** 0
- **Action required:** Re-audit when Playwright browser is available on this machine

---

## Notes

All existing programs relate to birthday party bookings at the Kerrisdale Play Palace indoor
play area within Kerrisdale Cyclone Taylor Arena. Programs span April–August 2026.
Address should be verified as: 5670 East Blvd, Vancouver, BC V6M 3V7 (Kerrisdale Arena).
The `address` field currently shows "Kerrisdale Cyclone Taylor Arena, Vancouver, BC" without
a street address — this could be improved in a future audit.
