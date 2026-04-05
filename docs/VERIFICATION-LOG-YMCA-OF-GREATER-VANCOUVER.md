# Verification Log — YMCA of Greater Vancouver

**Date Audited:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Status:** INCOMPLETE — Playwright browser could not be launched

---

## Audit Attempt Summary

**Registration Page URL:** https://anc.ca.apm.activecommunities.com/ygv/Activity_Search
**YMCA BC main site:** https://www.ymcabc.ca

### Blocker

Every attempt to launch the Playwright browser (Firefox MCP tool) failed with:

```
Error: server: spawn UNKNOWN
Call log:
  - <launching> C:\Users\thoma\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe
    -no-remote -headless -profile ... -juggler-pipe about:blank
```

Attempts made: 10+ retries across multiple URLs. All failed identically.

This is the same issue that blocked recent audits of West End Cmty Centre, Champlain Heights, Britannia, and Templeton Park Pool. Likely caused by a Windows process/permission issue preventing Firefox from spawning in headless mode.

---

## Existing Database State (30 programs — not verified this session)

### YMCA Kids Club Day Camps (18 locations)

| ID | Name | Status | Cost | Address |
|----|------|--------|------|---------|
| ymca-dc-anderson | Anderson YMCA Kids Club | Open | $50/wk | 9460 Alberta Rd, Richmond |
| ymca-dc-cascade | Cascade Heights YMCA Kids Club | Full | $50/wk | 4343 Smith Ave, Burnaby |
| ymca-dc-coast | Coast Salish YMCA Kids Club | Open | $50/wk | 3538 Sheffield Ave, Coquitlam |
| ymca-dc-donna | Donna Gabriel Robins YMCA Kids Club | Full | $50/wk | 7844 204B St, Langley |
| ymca-dc-douglas | Douglas YMCA Kids Club | Open | $50/wk | Douglas Elementary, Vancouver |
| ymca-dc-fleming | Flemming YMCA Kids Club | Open | $50/wk | Fleming Elementary, Vancouver |
| ymca-dc-jamieson | Jamieson YMCA Kids Club | Full | $50/wk | Jamieson Elementary, Vancouver |
| ymca-dc-jessie | Jessie Lee YMCA Kids Club | Open | $50/wk | 2124 154 St, Surrey |
| ymca-dc-jules | Jules Quesnel YMCA Kids Club | Open | $50/wk | Jules Quesnel Elementary, Vancouver |
| ymca-dc-mtpleasant | Mount Pleasant YMCA Kids Club | Open | $50/wk | Mount Pleasant Elementary, Vancouver |
| ymca-dc-osler | Osler YMCA Kids Club | Full | $50/wk | Osler Elementary, Vancouver |
| ymca-dc-roberts | Lord Roberts YMCA Kids Club | Full | $50/wk | Lord Roberts Elementary, Vancouver |
| ymca-dc-rupert | Rupert YMCA Kids Club | Open | $50/wk | Rupert Elementary, Vancouver |
| ymca-dc-sprouts | Sprouts YMCA Kids Club | Open | $50/wk | Sprouts Elementary, Vancouver |
| ymca-dc-stoney | Stoney Creek YMCA Kids Club | Open | $50/wk | Stoney Creek, Burnaby |
| ymca-dc-tonglouie | Tong Louie YMCA Kids Club | Full | $50/wk | Tong Louie YMCA, Langley |
| ymca-dc-vanhorne | Van Horne YMCA Kids Club | Open | $50/wk | Van Horne Elementary, Vancouver |
| ymca-dc-weir | Weir YMCA Kids Club | Open | $50/wk | Weir Elementary, Vancouver |

### Camp Elphinstone (8 programs)

| ID | Name | Status | Cost |
|----|------|--------|------|
| ymca-elph-12day | Camp Elphinstone 12-Day Camp | Open | null (not public) |
| ymca-elph-3day-trip | Camp Elphinstone Three-Day Out-Trip | Open | null (not public) |
| ymca-elph-5day | Camp Elphinstone Five-Day Camp | Open | null (not public) |
| ymca-elph-8day-trip | Camp Elphinstone Eight-Day Out-Trip | Open | null (not public) |
| ymca-elph-daycamp | Camp Elphinstone Day Camp | Open | null (not public) |
| ymca-elph-ld1 | Camp Elphinstone Leadership Development 1 | Open | null (not public) |
| ymca-elph-ld2 | Camp Elphinstone Leadership Development 2 | Open | null (not public) |
| ymca-elph-mcnabb | Camp Elphinstone McNabb Camp | Open | null (not public) |

### Swim Lessons (4 locations)

| ID | Name | Status | Cost |
|----|------|--------|------|
| ymca-swim-bettie | YMCA Swim Lessons (Bettie Allard) | Open | null (membership required) |
| ymca-swim-langara | YMCA Swim Lessons (Langara) | Open | null (membership required) |
| ymca-swim-robert | YMCA Swim Lessons (Robert Lee) | Open | null (membership required) |
| ymca-swim-tonglouie | YMCA Swim Lessons (Tong Louie) | Open | null (membership required) |

---

## Fields NOT Verified This Session

Because Playwright failed, NONE of the following could be verified against the live page:
- Enrollment status (Open/Full/Waitlist) — may have changed
- Prices — Kids Club $50/wk was verified in a prior session
- Start/end dates — not present in current database records
- Times — set as 7:30 AM–5:30 PM for Kids Club (not re-verified)
- Ages — set as 6–13 (not re-verified)
- Registration URLs — not tested for 404s or redirects
- Program completeness — unknown if additional locations/programs exist

---

## Next Steps

Re-run this audit when Playwright/Firefox spawn issue is resolved. Key questions to answer:
1. Are any Kids Club locations still open or have enrollment statuses changed?
2. Are there additional Kids Club locations not in the database (YMCA has 20+ Metro Vancouver schools)?
3. What are the exact start/end dates for each week of Kids Club?
4. What are the Camp Elphinstone prices (may be posted on ymcacampelphinstone.ca)?
5. Are there any new 2026 programs (sports camps, specialty camps) not in the database?
6. Swim lesson pricing and availability details.

---

## Provider Count

- Database: 30 programs
- Live page: NOT VERIFIED (could not access)
- Added this session: 0
- Fixed this session: 0
