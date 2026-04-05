# Verification Log — City of Vancouver - Killarney Pool

**Date audited:** 2026-04-05 (attempted again 2026-04-05)
**Auditor:** Claude (automated audit agent)
**Status:** INCOMPLETE — Playwright browser failed to launch

---

## Registration Page URL

https://anc.ca.apm.activecommunities.com/vancouver/activity/search

---

## Audit Attempt

Playwright browser (`mcp__playwright__browser_navigate`) failed to launch on every attempt with:

```
Error: server: spawn UNKNOWN
Call log:
  - <launching> C:\Users\thoma\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe
    -no-remote -headless -profile C:\Users\thoma\AppData\Local\ms-playwright\mcp-firefox-5467dfb
    -juggler-pipe about:blank
```

This is the same systemic failure that blocked audits for:
- City of Vancouver - West End Cmty Centre (commit d38853a)
- City of Vancouver - Champlain Heights Cmty Centre (commit fd94cc1)
- City of Vancouver - Britannia Cmty Centre (commit 235c041)
- City of Vancouver - Trout Lake Community Centre (commit f4d1eb9)
- City of Vancouver - Coal Harbour Cmty Centre (commit 47a9c1c)

Per CLAUDE.md: WebFetch is prohibited for reading registration page content as it cannot render JavaScript (ActiveNet requires JS). Without Playwright, live page verification is impossible.

---

## Existing Database Listings (33 total — unverified)

| ID | Name | Status | Cost | Start Date | End Date | Time | Days | Ages |
|----|------|--------|------|------------|----------|------|------|------|
| COV-616145 | Swimming - Preschool 3 - Orca | Open | $61.21 | 2026-04-11 | 2026-05-30 | 9:00–9:30 AM | Sat | 3–5 |
| COV-616147 | Swimming - Preschool 3 - Orca | Open | $61.21 | 2026-04-11 | 2026-05-30 | 9:00–9:30 AM | Sat | 3–5 |
| COV-616167 | Swimming - Swimmer 2 | Open | $50.64 | 2026-04-11 | 2026-05-30 | 12:30–1:00 PM | Sat | 5–14 |
| COV-616172 | Swimming - Swimmer 4 | Open | $62.26 | 2026-04-11 | 2026-05-30 | 9:00–9:40 AM | Sat | 5–14 |
| COV-616174 | Swimming - Swimmer 5 | Open | $62.26 | 2026-04-11 | 2026-05-30 | 9:00–9:40 AM | Sat | 5–14 |
| COV-616210 | Swimming - Preschool 3 - Orca | Open | $61.21 | 2026-04-12 | 2026-05-31 | 10:00–10:30 AM | Sun | 3–5 |
| COV-616215 | Swimming - Swimmer 1 | Open | $50.64 | 2026-04-12 | 2026-05-31 | 10:00–10:30 AM | Sun | 5–16 |
| COV-616250 | Swimming - Swimmer 4 | Open | $62.26 | 2026-04-12 | 2026-05-31 | 10:00–10:40 AM | Sun | 5–14 |
| COV-616276 | Swimming - Preschool 1 - Octopus | Open | $77.47 | 2026-03-31 | 2026-05-26 | 5:00–5:30 PM | Tue | 3–5 |
| COV-616317 | Swimming - Swimmer 1 | Open | $63.88 | 2026-03-31 | 2026-05-26 | 5:15–5:45 PM | Tue | 5–16 |
| COV-616325 | Swimming - Swimmer 2 | Open | $63.88 | 2026-03-31 | 2026-05-26 | 5:00–5:30 PM | Tue | 5–14 |
| COV-616328 | Swimming - Swimmer 2 | Open | $63.88 | 2026-03-31 | 2026-05-26 | 5:45–6:15 PM | Tue | 5–14 |
| COV-616329 | Swimming - Swimmer 2 | Open | $63.88 | 2026-03-31 | 2026-05-26 | 5:45–6:15 PM | Tue | 5–14 |
| COV-616534 | Swimming - Swimmer 1 | Open | $63.88 | 2026-04-02 | 2026-05-28 | 4:30–5:00 PM | Thu | 5–16 |
| COV-616537 | Swimming - Swimmer 2 | Open | $63.88 | 2026-04-02 | 2026-05-28 | 4:00–4:30 PM | Thu | 5–14 |
| COV-616547 | Swimming - Preschool 2 - Crab | Open | $69.34 | 2026-04-10 | 2026-05-29 | 10:00–10:30 AM | Fri | 3–5 |
| COV-616934 | Swimming - Adult and Teen Swimmer 2 | Full/Waitlist | null | 2026-04-02 | 2026-05-28 | 12:15–12:55 PM | Thu | 13+ |
| COV-616935 | Swimming - Preschool 1 - Octopus | Open | $77.47 | 2026-04-02 | 2026-05-28 | 1:00–1:30 PM | Thu | 3–5 |
| COV-616936 | Swimming - Swimmer 5 | Open | $78.82 | 2026-04-02 | 2026-05-28 | 4:15–4:55 PM | Thu | 5–14 |
| COV-616940 | Swimming - Adult and Teen Swimmer 3 | Full/Waitlist | null | 2026-04-12 | 2026-05-31 | 5:45–6:25 PM | Sun | 13+ |
| COV-616969 | Swimming - Swimmer 1 | Open | $57.26 | 2026-04-10 | 2026-05-29 | 3:30–4:00 PM | Fri | 5–16 |
| COV-616971 | Swimming - Swimmer 2 | Open | $57.26 | 2026-04-10 | 2026-05-29 | 4:45–5:15 PM | Fri | 5–14 |
| COV-616975 | Swimming - Preschool 3 - Orca | Open | $61.21 | 2026-03-30 | 2026-05-25 | 5:45–6:15 PM | Mon | 3–5 |
| COV-616976 | Swimming - Swimmer 2 | Open | $50.64 | 2026-03-30 | 2026-05-25 | 6:15–6:45 PM | Mon | 5–14 |
| COV-616981 | Swimming - Swimmer 2 | Open | $63.88 | 2026-04-01 | 2026-05-27 | 4:00–4:30 PM | Wed | 5–14 |
| COV-617007 | Swimming - Private or Semi-Private Lesson (Leisure Pool) | Open | $81.20 | 2026-04-10 | 2026-04-17 | 5:00–5:30 PM | Fri | 3+ |
| COV-617020 | Swimming - Adult and Teen Swimmer 2 | Full/Waitlist | null | 2026-04-11 | 2026-05-30 | 5:30–6:10 PM | Sat | 13+ |
| COV-617021 | Swimming - Preschool 2 - Crab | Open | $61.21 | 2026-04-11 | 2026-05-30 | 5:30–6:00 PM | Sat | 3–5 |
| COV-617022 | Swimming - Private or Semi-Private Lesson (Leisure Pool) | Open | $121.80 | 2026-04-11 | 2026-04-25 | 6:00–6:30 PM | Sat | 3+ |
| COV-617023 | Swimming - Private or Semi-Private Lesson (Leisure Pool) | Open | $121.80 | 2026-04-11 | 2026-04-25 | 6:30–7:00 PM | Sat | 3+ |
| COV-617027 | Swimming - Private or Semi-Private Lesson (Leisure Pool) | Open | $121.80 | 2026-04-12 | 2026-04-26 | 5:30–6:00 PM | Sun | 3+ |
| COV-617702 | Swimming - Private or Semi-Private Lesson (Leisure Pool) | Open | $121.80 | 2026-03-31 | 2026-04-14 | 5:00–5:30 PM | Tue | 3+ |
| COV-617712 | Swimming - Swimmer 3 | Open | $70.54 | 2026-04-01 | 2026-05-27 | 4:00–4:40 PM | Wed | 5–14 |

---

## Summary

- **Database listings:** 33 (unverified — live page not accessible)
- **Live page programs verified:** 0 (Playwright could not launch)
- **Added:** 0
- **Fixed:** 0
- **Missing check:** Unknown — could not browse live page

## Next Steps

Playwright Firefox must be reinstalled or repaired before this audit can be completed. The ActiveNet registration system requires JavaScript rendering which WebFetch cannot provide.
