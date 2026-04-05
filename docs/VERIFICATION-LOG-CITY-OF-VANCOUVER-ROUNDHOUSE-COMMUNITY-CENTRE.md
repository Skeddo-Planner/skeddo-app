# Verification Log — City of Vancouver - Roundhouse Community Centre

**Date Audited:** 2026-04-05 (session 5 — still blocked)
**Auditor:** Claude (automated)
**Registration Page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&locale=en-US&keyword=roundhouse
**Status:** BLOCKED — Playwright browser GPU crash (all sessions)

---

## Audit Outcome

**INCOMPLETE — Playwright browser unavailable across all retry sessions.**

All attempts to launch the Playwright MCP browser failed. In sessions 1–4 the error was:
```
Error: server: spawn UNKNOWN
```
In session 5 (this session), the error changed to a GPU crash:
```
GPU process exited unexpectedly: exit_code=-2147483645
GPU process has crashed 6 times
FATAL: GPU process isn't usable. Goodbye.
```

The headless shell (`chromium_headless_shell-1217`) crashes before it can render any page. The `--enable-unsafe-swiftshader` software renderer flag is present but is not preventing the crash.

**This issue is now persistent across 5 separate audit sessions on the same machine.**

---

## What Was Attempted (Session 5)

1. `mcp__playwright__browser_navigate` to ActiveNet search page — failed: GPU crash
2. `mcp__playwright__browser_navigate` to `about:blank` — same GPU crash
3. Multiple retry attempts — all fail deterministically with the same crash signature

---

## Note on Provider Name Variants

The database has 4 different provider name variants for Roundhouse:

| Provider name | Programs |
|--------------|---------|
| `City of Vancouver - Roundhouse Community Centre` | 56 |
| `City of Vancouver - Roundhouse Cmty Arts and Rec Centre` | 96 |
| `City of Vancouver — Roundhouse Community Arts & Recreation Centre` | 22 |
| `Roundhouse Community Centre` | 1 |
| **Total** | **175** |

This audit covers the canonical variant `City of Vancouver - Roundhouse Community Centre` (56 programs). The other variants were likely created by different prior audit sessions — they should be normalized in a future cleanup pass.

---

## Existing Database State — "City of Vancouver - Roundhouse Community Centre" (56 programs)

All 56 programs have `enrollmentStatus: "Full/Waitlist"` and `confirmed2026: true`. Program types:

| Program type | Weeks/sessions |
|-------------|----------------|
| Summer Safari Day Camp Junior (6-8) | Weeks 1–10 |
| Summer Safari Day Camp Senior (9-12) | Weeks 1–10 |
| Art is Fun Camp | 2 sessions |
| Creative Remix Arts Camp | 1 session |
| Little Artist Camp | 2 sessions |
| Young-Commander Chess CAMP (Novice/Starter I & II) | 3 sessions |
| Sportball Multisport Outdoor Camp | 4 sessions |
| Sportball Soccer Outdoor Camp | 2 sessions |
| Lego Robotics Stop Motion Animation Camp | 2 sessions |
| Lego Robotics Camp | 2 sessions |
| Lego Robotics Ev3 Camp | 2 sessions |
| Byte Camp - Introduction to Coding | 1 session |
| Byte Camp - Music Video Production | 1 session |
| Science Explorer Camp | 1 session |
| Wild Science Camp | 1 session |
| Acrobatic Dance Camp | 1 session |
| Creative Dance Camp | 2 sessions |
| Multi Dance Camp | 1 session |
| Preschool Acrobatic Dance Camp | 1 session |
| Preschool Creative Dance Camp | 1 session |
| Preschool Multi Dance Camp | 1 session |
| Creative Theatre Summer Camp | 1 session |
| Raincity Basketball Outdoor Camp (10-15 yrs) | 2 sessions |
| Raincity Basketball Outdoor Camp (6-10 yrs) | 2 sessions |

All programs:
- Address: 181 Roundhouse Mews, Vancouver, BC V6Z 2W3
- Neighbourhood: Yaletown
- `registrationDate`: 2026-04-08 (registration opens Apr 8 at 7:00 PM)
- Cost: ranges from $120–$190/week

---

## Data Not Verified

Because the Playwright browser could not launch, the following could NOT be verified:

- Current enrollment status (Open/Full/Waitlist) for each program
- Current prices
- Whether any new programs have been added
- Whether any programs have been discontinued
- Whether registration has opened (registration date was Apr 8, 2026 — past)

---

## Recommendation

The Playwright MCP browser tool is non-functional on this machine (GPU crash). This is blocking ALL audit sessions. Tom should:

1. Restart Claude Code / reboot the machine to clear GPU state
2. Or update the Playwright MCP to use a different browser backend
3. Then re-run this audit

The existing 56 programs have high confidence (all `confirmed2026: true`) and should not be degraded until a working audit can be performed.

---

## Provider Count Comparison

| Source | Count |
|--------|-------|
| Database (this provider name) | 56 |
| Database (all Roundhouse variants) | 175 |
| Live page | Unknown (browser broken) |
| Added | 0 |
| Fixed | 0 |
| Blocked reason | Playwright GPU crash (5 sessions) |
