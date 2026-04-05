# Verification Log — City of Vancouver - Kerrisdale Community Centre

**Date audited:** 2026-04-05
**Auditor:** Claude (automated)
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&locale=en-US&keyword=kerrisdale&activity_select_param=2
**Status: BLOCKED — Playwright spawn UNKNOWN**

---

## Audit Failure: Playwright Firefox Cannot Launch

All attempts to navigate the live registration page via `mcp__playwright__browser_navigate` failed with:

```
Error: server: spawn UNKNOWN
Call log:
  - <launching> C:\Users\thoma\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe
    -no-remote -headless -profile C:\Users\thoma\AppData\Local\ms-playwright\mcp-firefox-5467dfb
    -juggler-pipe about:blank
```

Root cause: The Firefox binary at `C:\Users\thoma\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe`
returns "Permission denied" when executed from the shell. The MCP Playwright tool is configured to use
Firefox, which cannot spawn in this environment.

This is the same issue blocking all recent audits:
- Dunbar Cmty Centre (2026-04-05)
- Kitsilano Cmty Centre (2026-04-05)
- Marpole-Oakridge Cmty Centre (2026-04-05)
- False Creek Cmty Centre (2026-04-05)
- Hillcrest Rink (2026-04-05)

WebFetch was not used as a fallback — prohibited by CLAUDE.md (cannot render JavaScript-heavy ActiveNet pages).

---

## Existing Database State (35 programs — not re-verified this session)

These programs were previously verified (confirmed2026: true, priceVerified: true) and are left
unchanged pending a re-audit when Playwright is functional.

| ID | Name | Status | Cost | Start | End |
|----|------|--------|------|-------|-----|
| 1585 | Week 6 Summer Safaris Daycamp Jrs 6-8yrs at Kerrisdale | Open | $140 | 2026-08-04 | 2026-08-07 |
| 1586 | Week 6 Summer Safaris Daycamp Srs 9-12 yrs at Kerrisdale | Open | $140 | 2026-08-04 | 2026-08-07 |
| 1587 | Active Dance Camp: Jazz Funk, Hip Hop and KPOP at Kerrisdale | Full/Waitlist | $221 | 2026-08-04 | 2026-08-07 |
| 1588 | Act, Dance, Sing FUN! Camp at Kerrisdale | Open | $204 | 2026-08-04 | 2026-08-07 |
| 1589 | Week 7 Summer Safaris Daycamp Jrs 6-8yrs at Kerrisdale | Open | $175 | 2026-08-10 | 2026-08-14 |
| 1590 | Week 7 Summer Safaris Daycamp Srs 9-12yrs at Kerrisdale | Open | $175 | 2026-08-10 | 2026-08-14 |
| 1591 | Active Dance Camp: Street, Locking, Popping and KPOP at Kerrisdale | Full/Waitlist | $276.25 | 2026-08-10 | 2026-08-14 |
| 1592 | Active Dance Camp: Jazz Funk, Hip Hop and KPOP at Kerrisdale | Full/Waitlist | $255 | 2026-08-10 | 2026-08-14 |
| 1593 | Week 8 Summer Safaris Daycamp Jrs 6-8yrs at Kerrisdale | Open | $175 | 2026-08-17 | 2026-08-21 |
| 1594 | Week 8 Summer Safaris Daycamp Srs 9-12yrs at Kerrisdale | Open | $175 | 2026-08-17 | 2026-08-21 |
| 1595 | Active Dance Camp: Street, Locking, Popping and KPOP at Kerrisdale | Full/Waitlist | $276.25 | 2026-08-17 | 2026-08-21 |
| 1596 | Act, Dance, Sing FUN! Camp at Kerrisdale | Open | $255 | 2026-08-17 | 2026-08-21 |
| 1597 | Week 9 Summer Safaris Daycamp Jrs 6-8yrs at Kerrisdale | Open | $175 | 2026-08-24 | 2026-08-28 |
| 1598 | Week 9 Summer Safaris Daycamp Srs 9-12yrs at Kerrisdale | Open | $175 | 2026-08-24 | 2026-08-28 |
| 1599 | Active Dance Camp: Street, Locking, Popping and KPOP at Kerrisdale | Full/Waitlist | $276.25 | 2026-08-24 | 2026-08-28 |
| 1600 | Act, Dance, Sing FUN! Camp at Kerrisdale | Open | $255 | 2026-08-24 | 2026-08-28 |
| 1601 | Cartoons Character Creation Camp at Kerrisdale | Open | $220 | 2026-07-13 | 2026-07-17 |
| 1602 | Happy Kids Studios - Art Jam Camp at Kerrisdale | Open | $100 | 2026-07-06 | 2026-07-10 |
| 1603 | Happy Kids Studios - Art Jam Camp at Kerrisdale | Open | $100 | 2026-08-10 | 2026-08-14 |
| 1604 | Happy Kids Studios - Cartoon Camp at Kerrisdale | Open | $100 | 2026-07-06 | 2026-07-10 |
| 1605 | Happy Kids Studios - Cartoon Camp at Kerrisdale | Open | $100 | 2026-08-10 | 2026-08-14 |
| 1606 | Ready for Kindergarten Camp at Kerrisdale | Full/Waitlist | $115 | 2026-08-17 | 2026-08-21 |
| 1607 | Game Ready Crazy Sports Camp at Kerrisdale | Full/Waitlist | $185 | 2026-08-04 | 2026-08-07 |
| 1608 | Game Ready Crazy Sports Camp at Kerrisdale | Full/Waitlist | $229 | 2026-08-24 | 2026-08-28 |
| 1609 | Sportball Multisport Camp at Kerrisdale | Full/Waitlist | $240 | 2026-07-06 | 2026-07-10 |
| 1610 | Sportball Multisport Camp at Kerrisdale | Full/Waitlist | $240 | 2026-08-10 | 2026-08-14 |
| 1611 | Tomorrow's Playground: WeDo Robotics Camp at Kerrisdale | Full/Waitlist | $175 | 2026-07-27 | 2026-07-31 |
| 1612 | WIZE - Animation, Games & Storytelling in Scratch Jr Camp at Kerrisdale | Full/Waitlist | $320 | 2026-07-20 | 2026-07-24 |
| 1613 | WIZE - Coding and Modding in Minecraft Camp at Kerrisdale | Full/Waitlist | $320 | 2026-07-20 | 2026-07-24 |
| 1614 | WIZE - Minecraft, AR/VR, and Robotics Camp at Kerrisdale | Full/Waitlist | $500 | 2026-08-10 | 2026-08-14 |
| 1615 | Intro to Coding and Chess Camp (New) at Kerrisdale | Full/Waitlist | $165 | 2026-08-04 | 2026-08-07 |
| 1616 | Micro:bit Coding Camp at Kerrisdale | Open | $92 | 2026-08-17 | 2026-08-19 |
| 1617 | Science Explorer Camp at Kerrisdale | Open | $390 | 2026-07-13 | 2026-07-17 |
| 1618 | STEAM 4 Kids: Science Adventures Camp at Kerrisdale | Full/Waitlist | $390 | 2026-08-10 | 2026-08-14 |
| 1619 | STEAM 4 Kids: Wild Science Camp at Kerrisdale | Full/Waitlist | $390 | 2026-07-27 | 2026-07-31 |

---

## Summary

- **Provider shows:** Unable to determine (page not rendered — Playwright blocked)
- **Database has:** 35 programs
- **Added this session:** 0
- **Fixed this session:** 0
- **Discrepancies found:** Unable to determine

## Action Required

Fix the Playwright/Firefox spawn issue before re-auditing. Options:
1. Reinstall Playwright Firefox browser: `npx playwright install firefox`
2. Reconfigure MCP Playwright server to use Chrome instead of Firefox
3. Run Claude Code session as administrator so Firefox binary has execute permission
