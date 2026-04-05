# Verification Log — City of Vancouver - Dunbar Community Centre

**Date audited:** 2026-04-05
**Auditor:** Claude (automated audit)
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search
**Status: INCOMPLETE — Playwright browser spawn blocked**

---

## Audit Attempt Summary

Attempted to navigate to City of Vancouver ActiveNet registration page using Playwright browser
(`mcp__playwright__browser_navigate`), but received:

```
Error: server: spawn UNKNOWN
Call log:
  - <launching> C:\Users\thoma\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe
    -no-remote -headless -profile ... -juggler-pipe about:blank
```

This is the same "spawn UNKNOWN" error that has blocked audits for other Vancouver community
centres (Dunbar, Creekside, Mount Pleasant) in recent sessions. Root cause appears to be
system resource exhaustion or a locked browser process on the Windows host.

---

## Current Database State

Provider names found in database:
- `City of Vancouver - Dunbar Community Centre` (primary)
- `City of Vancouver — Dunbar Community Centre` (em-dash variant)
- `City of Vancouver - Dunbar Cmty Centre` (abbreviated variant)

**Program counts:**
- Total CoV Dunbar programs in database: **208**
- Open: 112
- Full/Waitlist: 41
- Coming Soon: 6
- Completed: 49
- confirmed2026=true: 203
- Has ActiveNet detail URL: 208

All 208 programs have ActiveNet-format registration URLs
(`anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/XXXXXX`).

---

## What Was Not Verified

Because Playwright could not launch, the following could not be checked:
- Whether any programs listed in the database are now Full, Waitlist, or Closed
- Whether any new programs have been added to the registration page since last audit
- Whether prices, dates, times, or age ranges have changed
- Whether any programs previously marked Open are now Completed

---

## Recommended Follow-up

1. Resolve the Playwright browser spawn issue on the Windows host (close stale browser
   processes, restart the MCP server, or reboot)
2. Re-run this audit once Playwright is functional
3. Registration page to verify: https://anc.ca.apm.activecommunities.com/vancouver/activity/search
   - Filter by location: Dunbar Community Centre
   - Check all categories and age groups

---

## Programs in Database (208 total)

Full list by enrollment status:

### Open (112)
COV-610479, COV-610791, COV-610357, COV-617656, COV-610362, COV-610365, COV-610372,
COV-610373, COV-610375, COV-610376, COV-591398 (note: Full/Waitlist), COV-610465,
COV-610467, COV-613002, COV-604386, COV-602069, COV-617324 through COV-617404 (Cycle Fit),
COV-604400, ACT-608317 through ACT-609247 (Dunbar Day Camp weeks 1-8),
COV-610186, COV-600802 through COV-600807 (Soccer Academy), COV-610141, COV-610140,
ACT-602618 through ACT-602632 (Kids Tennis), COV-602625 through COV-602632 (Kids Tennis COV-prefix),
COV-609508, COV-609568, COV-609569, COV-608124, COV-608125, COV-590113 (note: Completed),
COV-601346, COV-601348, COV-602035, COV-615725 through COV-616588 (Private Piano),
COV-604777 through COV-598743 (Private Piano), COV-603587, COV-603548,
COV-608873, COV-608880, COV-608874, COV-608882, COV-603643, COV-615746, COV-610183

### Full/Waitlist (41)
IDs 1451-1486 (legacy numeric IDs — summer camp programs), COV-585109, COV-585803,
COV-588376 (LEGO Cinematic Crossovers)

### Coming Soon (6)
COV-610477, COV-610478, COV-610476, COV-610481, COV-610475, COV-610800

### Completed (49)
COV-591391, COV-592879, COV-585121, COV-609000, COV-609001, COV-592042, COV-592044,
COV-590113 through COV-590154 (completed Private Piano Lessons),
COV-588392 through COV-588399 (completed Private Piano 4+ yrs),
COV-604396, COV-588630, COV-588633, COV-586348, COV-585122, COV-585124 (note: Full/Waitlist),
COV-585126, COV-585127, COV-585128, COV-589937, COV-590084, COV-590085, COV-590092,
COV-597178, COV-589942, COV-590088

---

*Audit incomplete — browser spawn blocked. Re-audit required once Playwright is operational.*
