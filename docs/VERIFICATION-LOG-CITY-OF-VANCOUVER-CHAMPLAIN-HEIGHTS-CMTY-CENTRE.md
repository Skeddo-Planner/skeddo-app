# Verification Log — City of Vancouver - Champlain Heights Cmty Centre

**Date Audited:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Status:** INCOMPLETE — Playwright browser blocked (3 separate audit attempts)

---

## Audit Outcome

**BLOCKED: Playwright browser could not be launched on either attempt.**

Every attempt to launch `mcp__playwright__browser_navigate` returned:

```
Error: server: spawn UNKNOWN
Launching: firefox-1511/firefox/firefox.exe -no-remote -headless ...
```

This is a persistent system resource issue. The same error blocked audits of:
- City of Vancouver - Hillcrest Rink
- City of Vancouver - Killarney Community Centre
- City of Vancouver - Renfrew Park Cmty Centre
- City of Vancouver - Hillcrest Community Centre

**2026-04-05 attempts (second session):**
1. Initial attempt — spawn UNKNOWN
2. After 3s wait — spawn UNKNOWN
3. After kill/retry — spawn UNKNOWN
4. After no-Firefox-process confirmed — spawn UNKNOWN
5. Final attempt — spawn UNKNOWN

**2026-04-05 attempts (third session):**
All attempts failed with Playwright Chromium GPU crash loop:
```
[pid=140912] GPU process exited unexpectedly: exit_code=-2147483645
The GPU process has crashed 3 time(s)
```
Error code -2147483645 = 0x80000003 (STATUS_BREAKPOINT, Windows GPU rendering failure).
Same crashed browser PID (140912) reused across all retries. Retried 4 times with 3s and 8s delays — all identical failure.

---

## Existing Database State

At time of attempted audit, the database contained **96 programs** across three provider name variants:

| Provider Name | Count |
|---|---|
| City of Vancouver - Champlain Heights Cmty Centre | 62 |
| City of Vancouver - Champlain Heights Community Centre | 32 |
| Champlain Heights Community Centre | 2 |

**Enrollment status breakdown:**
| Status | Count |
|---|---|
| Open | 52 |
| Full/Waitlist | 34 |
| Completed | 10 |

### Program Categories in Database
- **Cycle Fit** — 21 drop-in entries (COV-615072 through COV-617723)
- **Piano** — 12 entries (COV-596475 through COV-596501 + older completed)
- **Guitar & Ukulele** — 13 entries (COV-605048 through COV-605061)
- **Summer Day Camps** — 32 entries (IDs 1394–1425, champlain-cc-1)
- **Youth programs** — Chess, Dungeons & Dragons, Tutoring, Taekwondo, Art, Hockey, Red Cross
- **Other** — Birthday Parties (completed), Wing Chun Kung Fu (completed)

### Summer Camps (IDs 1394–1425) — Unverified
| ID | Name | Dates | Cost | Status |
|----|------|-------|------|--------|
| 1394 | Anime Cartoon Drawing Camp | Jun 29–Jul 3, 2026 | $176 | Full/Waitlist |
| 1395 | Anime Cartoon Drawing Camp | Aug 10–14, 2026 | $220 | Full/Waitlist |
| 1396 | Byte Camp - Claymation Movie Production | Jul 27–31, 2026 | $410 | Full/Waitlist |
| 1397 | Byte Camp - Foundations of AI | Aug 10–14, 2026 | $410 | Full/Waitlist |
| 1398 | Byte Camp - Introduction to Coding | Jul 6–10, 2026 | $400 | Full/Waitlist |
| 1399 | Cartoons Character Creation Camp | Jun 29–Jul 3, 2026 | $176 | Full/Waitlist |
| 1400 | Cartoons Character Creation Camp | Aug 10–14, 2026 | $220 | Full/Waitlist |
| 1401 | Junior Sunsplash Week 1 | Jun 30–Jul 3, 2026 | $96 | Full/Waitlist |
| 1402 | Junior Sunsplash Week 2 | Jul 6–10, 2026 | $160 | Full/Waitlist |
| 1403 | Junior Sunsplash Week 3 | Jul 13–17, 2026 | $160 | Full/Waitlist |
| 1404 | Junior Sunsplash Week 4 | Jul 20–24, 2026 | $160 | Full/Waitlist |
| 1405 | Junior Sunsplash Week 5 | Jul 27–31, 2026 | $96 | Full/Waitlist |
| 1406 | Junior Sunsplash Week 6 | Aug 4–7, 2026 | $96 | Full/Waitlist |
| 1407 | Junior Sunsplash Week 7 | Aug 10–14, 2026 | $96 | Full/Waitlist |
| 1408 | Junior Sunsplash Week 8 | Aug 17–21, 2026 | $160 | Full/Waitlist |
| 1409 | Junior Sunsplash Week 9 | Aug 24–27, 2026 | $128 | Full/Waitlist |
| 1410 | Senior Sunsplash Week 1 | Jun 30–Jul 3, 2026 | $130 | Full/Waitlist |
| 1411 | Senior Sunsplash Week 2 | Jul 6–10, 2026 | $160 | Full/Waitlist |
| 1412 | Senior Sunsplash Week 3 | Jul 13–17, 2026 | $160 | Full/Waitlist |
| 1413 | Senior Sunsplash Week 4 | Jul 20–24, 2026 | $160 | Full/Waitlist |
| 1414 | Summer Youth Leadership Camp Week 1 | Jun 30–Jul 3, 2026 | $96 | Full/Waitlist |
| 1415 | Summer Youth Leadership Camp Week 2 | Jul 6–10, 2026 | $160 | Full/Waitlist |
| 1416 | Summer Youth Leadership Camp Week 3 | Jul 13–17, 2026 | $160 | Full/Waitlist |
| 1417 | Summer Youth Leadership Camp Week 4 | Jul 20–24, 2026 | $160 | Full/Waitlist |
| 1418 | Summer Youth Leadership Camp Week 5 | Jul 27–31, 2026 | $160 | Full/Waitlist |
| 1419 | Summer Youth Leadership Camp Week 6 | Aug 4–7, 2026 | $128 | Full/Waitlist |
| 1420 | Summer Youth Leadership Camp Week 7 | Aug 10–14, 2026 | $160 | Full/Waitlist |
| 1421 | Summer Youth Leadership Camp Week 8 | Aug 17–21, 2026 | $160 | Full/Waitlist |
| 1422 | Summer Youth Leadership Camp Week 9 | Aug 24–27, 2026 | $128 | Full/Waitlist |
| 1423 | WEDO 1 Robotics Camp | Jun 29–Jul 3, 2026 | $150 | Full/Waitlist |
| 1424 | WEDO 2 Robotics Camp | Jun 29–Jul 3, 2026 | $150 | Full/Waitlist |
| 1425 | Yoga, Nature and Craft Camp | Jul 13–17, 2026 | $275 | Full/Waitlist |

---

## What Was Not Verified

Because the browser could not be launched, the following could NOT be verified:
- Current prices on the ActiveNet registration system
- Updated enrollment statuses (Open/Full/Waitlist)
- Any new programs added since last audit
- Whether any programs have changed dates or times
- Specific registration URLs (all currently point to generic search page)
- Senior Sunsplash asymmetry: only 4 weeks vs Junior's 9 weeks — needs verification

**Registration page URL (unverified):**
`https://anc.ca.apm.activecommunities.com/vancouver/activity/search`

---

## Action Required

Retry audit when Playwright browser resources are available. Key areas to check:
1. Summer 2026 camp registrations (IDs 1394–1425) — verify statuses and prices
2. New 2026 programs not yet in database
3. Senior Sunsplash — only has 4 weeks; verify if more exist
4. "champlain-cc-1" (Champlain Heights Summer Day Camp, cost=null) — needs price verification
5. Cycle Fit series (21 entries) — verify all still running and prices current
6. All program-specific registration URLs need to be captured

---

## Provider Count vs Database Count

**Cannot verify** — live page was not accessible due to browser failure.

---

*This log documents three failed audit attempts (all 2026-04-05). No data changes were made to programs.json.*
