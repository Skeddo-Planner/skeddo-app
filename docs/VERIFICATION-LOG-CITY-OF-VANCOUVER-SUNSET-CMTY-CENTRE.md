# Verification Log — City of Vancouver - Sunset Cmty Centre

**Date audited:** 2026-04-05 (session 2)
**Auditor:** Claude (automated)
**Status:** BLOCKED — Playwright browser failure (repeated across 2 sessions)

---

## Audit Attempt Summary

**Registration page URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&activity_select_param=2&viewMode=list&facility_id=29
**Provider address:** 6810 Main Street, Vancouver, BC (Sunset neighbourhood)

### Browser Failure

All attempts to launch the Playwright MCP browser (`mcp__playwright__browser_navigate`) failed with:

```
Error: Browser "chrome-for-testing" is not installed
Error: server: spawn UNKNOWN
```

The MCP is configured to use `chromium-1217\chrome-win64\chrome.exe` (`chrome-for-testing`) which fails to spawn. This differs from previous sessions which used the regular Google Chrome (`mcp-chrome-5467dfb`). The binary exists at the expected path and the install command produced no output, but all launch attempts failed.

**Attempts made:**
1. `npx @playwright/mcp install-browser chrome-for-testing` — no output, issue persisted
2. Multiple `mcp__playwright__browser_navigate` calls — all returned "spawn UNKNOWN"
3. Verified chromium-1217 binary exists at expected path
4. Checked for profile lock conflicts — none found

This is a system-level MCP configuration issue, not a site-level issue. The ActiveNet site itself is accessible.

---

## Current Database State

**Total programs in database:** 68
**Open (Spring 2026):** 43
**Completed (Winter 2025–26):** 25
**confirmed2026=true:** 68 (all)

All 68 programs were previously confirmed and verified. The queue note says "Re-audit required: previous audit was bulk/partial, needs per-page browser navigation", indicating the previous audit may not have done full per-page browser verification.

### Programs in Database (Open)

| ID | Name | Dates | Cost | Status |
|----|------|-------|------|--------|
| COV-588354 | Preteen Basketball Drop-In | Apr 3–Jun 26 | $0 | Open |
| COV-588493 | Preteen Games Room | Apr 10–Jun 26 | $0 | Open |
| COV-588938 | Girls+ Group | Apr 9–Jun 25 | $0 | Open |
| COV-588967 | Preteen Volleyball Drop-In | Apr 1–Jun 24 | $0 | Open |
| COV-589472 | 604 Bhangra Fusion (6-14 yrs) | Apr 12–Jun 28 | $143 | Open |
| COV-589473 | 604 Bhangra Dance (6-7 yrs) | Apr 12–Jun 28 | $132 | Open |
| COV-589474 | 604 Bhangra Dance (8-9.5 yrs) | Apr 12–Jun 28 | $143 | Open |
| COV-589475 | 604 Bhangra Dance (9.5+ yrs) | Apr 12–Jun 28 | $143 | Open |
| COV-589477 | 604 Bhangra Dance - Preschool (4.5-6yrs) | Apr 12–Jun 28 | $110 | Open |
| COV-589483 | Axe Capoeira - May | May 5–28 | $100 | Open |
| COV-589484 | Axe Capoeira - April | Apr 2–30 | $112.50 | Open |
| COV-589485 | Axe Capoeira - June | Jun 2–25 | $100 | Open |
| COV-589516 | Head Start Math | Apr 19–Jun 14 | $84 | Open |
| COV-589517 | Healthiest Babies Possible | Apr 8–Jun 22 | $0 | Open |
| COV-589525 | Karate Kids (with Parents) | Apr 12–May 31 | $105 | Open |
| COV-589533 | Math Masterminds | Apr 21–Jun 9 | $80 | Open |
| COV-589537 | Play Gym | Apr 1–Jun 24 | $3 | Open |
| COV-589538 | Play Gym | Apr 10–Jun 26 | $3 | Open |
| COV-589555 | Soccer (6-9 years) | Apr 18–Jun 13 | $84 | Open |
| COV-589560 | SVNH Family Play Time | Apr 7–Jun 16 | $0 | Open |
| COV-589573 | Young Artists | Apr 18–May 30 | $100 | Open |
| COV-589574 | Young-Commander Chess - Intermediate/Advance | Apr 19–Jun 28 | $120 | Open |
| COV-589805 | Game On! - Boys Mentorship | Apr 9–May 28 | $0 | Open |
| COV-589806 | Girls+ Multi-Sports | Apr 10–Jun 26 | $0 | Open |
| COV-592110 | Ultimate Play Gym Birthday Party 60 Guests 2-4 pm | Jun 21 | $350 | Open |
| COV-592125 | Play Gym Birthday Party 30 Guests 11 am-1 pm | Apr 18 | $250 | Open |
| COV-592126 | Play Gym Birthday Party 30 Guests 11 am-1 pm | Apr 25 | $250 | Open |
| COV-592127 | Play Gym Birthday Party 30 Guests 11 am-1 pm | May 2 | $250 | Open |
| COV-592128 | Play Gym Birthday Party 30 Guests 11 am-1 pm | May 9 | $250 | Open |
| COV-592131 | Play Gym Birthday Party 30 Guests 11 am-1 pm | May 23 | $250 | Open |
| COV-592132 | Play Gym Birthday Party 30 Guests 11 am-1 pm | May 30 | $250 | Open |
| COV-592133 | Play Gym Birthday Party 30 Guests 11 am-1 pm | Jun 6 | $250 | Open |
| COV-592134 | Play Gym Birthday Party 30 Guests 11 am-1 pm | Jun 13 | $250 | Open |
| COV-592138 | Ultimate Play Gym Birthday Party 60 Guests 1:30-3:30 pm | Apr 5 | $350 | Open |
| COV-594551 | Gidha for Kids | Apr 12–Jun 28 | $143 | Open |
| COV-595268 | Piano - Private Lessons with Jensen | Apr 10–Jun 26 | $300 | Open |
| COV-595310 | Piano - Private Lessons with Kelly | Apr 12–Jun 21 | $250 | Open |
| COV-614148 | Study Session | Apr 7–Jun 30 | $0 | Open |
| COV-614372 | Piano - Private Lessons with Derek | Apr 9–Jun 25 | $300 | Open |
| COV-614373 | Piano - Private Lessons with Derek | Apr 9–Jun 25 | $300 | Open |
| COV-614384 | Acoustic Guitar - Private Lessons with Artemis | Apr 12–Jun 21 | $200 | Open |
| COV-614527 | Piano - Private Lessons with Kelly | Apr 8–Jun 24 | $300 | Open |
| COV-615835 | Night Hoops Girls BasketBall Program | Apr 13–Jun 8 | $0 | Open |

### Programs in Database (Completed — Winter 2025–26)

| ID | Name | Dates |
|----|------|-------|
| COV-586975 | Preteen Basketball Drop-In | Jan 9–Mar 27 |
| COV-587252 | Preteen Games Room | Jan 8–Mar 31 |
| COV-587267 | Girls+ Multi-Sports | Jan 9–Mar 27 |
| COV-591237 | Piano - Private Lessons with Kelly | Jan 4–Mar 29 |
| COV-591248 | Piano - Private Lessons with Jensen | Jan 9–Mar 27 |
| COV-591988 | Karate Black Belts (13+ yrs) | Jan 11–Mar 29 |
| COV-592024 | Karate Kids (with Parents) | Feb 22–Mar 29 |
| COV-593963 | Pompom Shadowbox Workshop | Mar 29 |
| COV-593964 | Strawberry Cheesecake Workshop | Mar 29 |
| COV-595050 | Piano - Private Lessons with Kelly | Jan 4–Mar 29 |
| COV-595256–595260 | Piano - Private Lessons with Jensen (×5) | Jan 9–Mar 27 |
| COV-595297–595303 | Piano - Private Lessons with Kelly (×7) | Jan 4–Mar 29 |
| COV-596187 | Activities Spectacular Birthday Party 60 Guests 1:30-3:30 pm | Mar 28 |
| COV-596201 | Activities Spectacular Birthday Party 60 Guests 10 am-12 pm | Mar 29 |
| COV-616366 | Easter Eggstravaganza - 12:15 pm Egg Hunt | Apr 3 |

---

## Why Audit Is Blocked

The Playwright MCP browser (`chrome-for-testing`) cannot be launched in this session. This is a configuration/system issue:

- The MCP server is now targeting `chromium-1217\chrome-win64\chrome.exe` instead of the regular Google Chrome
- The regular Google Chrome MCP instance (port 61152, `mcp-chrome-5467dfb`) is running but cannot be accessed by the current MCP tools
- Per-page browser navigation is REQUIRED for full audit per the mandatory audit patterns

**Action taken:** No data changes made. Existing confirmed data preserved.

**Session 2 failure (2026-04-05):** MCP browser failed with GPU process crash loop. Every navigation attempt returned `GPU process isn't usable. Goodbye.` with the same PID (54096) and timestamps, indicating the MCP server is replaying a cached crash from a previous session and cannot start a fresh browser process.

**Recommended next step:** Restart the Claude Code / MCP server process entirely to clear the cached Playwright browser state, then re-run this audit.
