# Verification Log — City of Vancouver - Killarney Community Centre

**Date audited:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Status:** INCOMPLETE — Playwright browser spawn blocked

---

## Audit Blocked: Playwright spawn UNKNOWN

Live page verification was not possible. The Playwright MCP browser tool repeatedly
failed to launch with:

```
Error: server: spawn UNKNOWN
Launching: C:\Users\thoma\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe
  -no-remote -headless -profile C:\Users\thoma\AppData\Local\ms-playwright\mcp-firefox-5467dfb
  -juggler-pipe about:blank
```

This is the same failure pattern documented in recent audits:
- City of Vancouver - Dunbar Cmty Centre (commit f13434f)
- City of Vancouver - Creekside Cmty Rec Centre (commit 0a12bb3)
- City of Vancouver - Mount Pleasant Cmty Centre (commit 1c7c0e9)

Multiple retries with 5–15 second waits did not resolve the issue. The Firefox binary
exists at the expected path; the profile directory appears empty. This is a system-level
process spawn failure on Windows, not a network or authentication issue.

---

## Registration Page URL

https://anc.ca.apm.activecommunities.com/vancouver/activity/search
(City of Vancouver ActiveNet system — same as all CoV community centres)

---

## Current Database State (not verified against live page)

**Total programs in database:** 39
**Provider:** City of Vancouver - Killarney Community Centre
**Address:** 6260 Killarney St, Vancouver, BC V5S 2X7
**All enrollment statuses:** Full/Waitlist (39 programs — pre-existing from prior audit)

### Programs on file (IDs 1620–1678):

| ID   | Name | Cost | Dates | Status |
|------|------|------|-------|--------|
| 1620 | Killarney Summer Fun Day Camp - Wk 1 | $173.04 | Jun 29 – Jul 3, 2026 | Full/Waitlist |
| 1621 | Killarney Summer Fun Day Camp - Wk 2 | $216.30 | Jul 6–10, 2026 | Full/Waitlist |
| 1622 | Killarney Summer Fun Day Camp - Wk 3 | $216.30 | Jul 13–17, 2026 | Full/Waitlist |
| 1623 | Killarney Summer Fun Day Camp - Wk 4 | $216.30 | Jul 20–24, 2026 | Full/Waitlist |
| 1624 | Killarney Summer Fun Day Camp - Wk 5 | $216.30 | Jul 27–31, 2026 | Full/Waitlist |
| 1625 | Killarney Summer Fun Day Camp - Wk 6 | $173.04 | Aug 4–7, 2026 | Full/Waitlist |
| 1626 | Killarney Summer Fun Day Camp - Wk 7 | $216.30 | Aug 10–14, 2026 | Full/Waitlist |
| 1627 | Killarney Summer Fun Day Camp - Wk 8 | $216.30 | Aug 17–21, 2026 | Full/Waitlist |
| 1628 | Killarney Summer Fun Day Camp - Wk 9 | $210.30 | Aug 24–28, 2026 | Full/Waitlist |
| 1629 | Licensed Preschool Summer Daycamp at Killarney | $248.85 | Jul 6–17, 2026 | Full/Waitlist |
| 1630 | Licensed Preschool Summer Daycamp at Killarney | $248.85 | Jul 20–31, 2026 | Full/Waitlist |
| 1631 | CAMP: Animal Cartoon Workshop at Killarney | $176.00 | Aug 4–7, 2026 | Full/Waitlist |
| 1632 | CAMP: Art and You at Killarney | $155.00 | Jul 6–10, 2026 | Full/Waitlist |
| 1633 | CAMP: Art and You at Killarney | $155.00 | Jul 27–31, 2026 | Full/Waitlist |
| 1634 | CAMP: Art and You at Killarney | $155.00 | Aug 10–14, 2026 | Full/Waitlist |
| 1635 | CAMP: Art is Fun at Killarney | $133.00 | Aug 17–21, 2026 | Full/Waitlist |
| 1636 | CAMP: EFK - Space: Martian Engineering Expeditions at Killarney | $425.00 | Aug 24–28, 2026 | Full/Waitlist |
| 1637 | CAMP: Famous Artists Remix at Killarney | $198.00 | Aug 17–21, 2026 | Full/Waitlist |
| 1638 | CAMP: Little Artists at Killarney | $177.00 | Aug 17–21, 2026 | Full/Waitlist |
| 1639 | Pre-Kindergarten Summer Camp at Killarney | $257.14 | Jul 6–17, 2026 | Full/Waitlist |
| 1640 | Pre-Kindergarten Summer Camp at Killarney | $257.14 | Jul 20–31, 2026 | Full/Waitlist |
| 1641 | CAMP: Sportball Multisport at Killarney | $218.00 | Jul 6–10, 2026 | Full/Waitlist |
| 1643 | CAMP: Sportball Multisport at Killarney | $93.00 | Jul 13–17, 2026 | Full/Waitlist |
| 1644 | CAMP: Sportball Multisport at Killarney | $93.00 | Jul 20–24, 2026 | Full/Waitlist |
| 1645 | CAMP: Sportball Multisport at Killarney | $93.00 | Jul 27–31, 2026 | Full/Waitlist |
| 1646 | CAMP: Sportball Multisport at Killarney | $75.00 | Aug 4–7, 2026 | Full/Waitlist |
| 1647 | CAMP: Sportball Multisport at Killarney | $93.00 | Aug 10–14, 2026 | Full/Waitlist |
| 1648 | CAMP: Sportball Multisport at Killarney | $93.00 | Aug 17–21, 2026 | Full/Waitlist |
| 1649 | CAMP: Sportball Multisport at Killarney | $93.00 | Aug 24–28, 2026 | Full/Waitlist |
| 1657 | CAMP: Byte Camp - Introduction to Coding at Killarney | $355.00 | Aug 4–7, 2026 | Full/Waitlist |
| 1658 | CAMP: Acrobatic Dance at Killarney | $115.00 | Aug 4–7, 2026 | Full/Waitlist |
| 1662 | CAMP: Act, Dance, Sing FUN! at Killarney | $220.00 | Jun 29 – Jul 3, 2026 | Full/Waitlist |
| 1663 | CAMP: Act, Dance, Sing FUN! at Killarney | $275.00 | Aug 17–21, 2026 | Full/Waitlist |
| 1665 | CAMP: Creative Dance at Killarney | $115.00 | Jun 29 – Jul 3, 2026 | Full/Waitlist |
| 1669 | CAMP: Dance & Yoga at Killarney | $137.50 | Aug 17–21, 2026 | Full/Waitlist |
| 1673 | CAMP: Frozen Ballet Dance at Killarney | $109.00 | Jul 6–10, 2026 | Full/Waitlist |
| 1674 | CAMP: Frozen Ballet Dance at Killarney | $109.00 | Aug 17–21, 2026 | Full/Waitlist |
| 1675 | CAMP: Multi-Dance at Killarney | $137.50 | Aug 10–14, 2026 | Full/Waitlist |
| 1678 | CAMP: Music Exploration (Parent & Tot) at Killarney | $80.00 | Aug 24–28, 2026 | Full/Waitlist |

---

## What Was NOT Verified

Because the browser could not launch, the following was NOT checked:
- Whether enrollment statuses are still accurate (all show Full/Waitlist)
- Whether any new programs have been added for 2026
- Whether any programs have been cancelled or removed
- Whether prices match current registration page values
- Whether dates/times match current listings
- Whether registration URLs still resolve correctly

---

## Recommended Follow-Up

Re-run this audit when the Playwright browser issue is resolved. All 39 programs should
be verified individually against the ActiveNet registration system.

The registration page for Killarney-specific programs can be filtered at:
https://anc.ca.apm.activecommunities.com/vancouver/activity/search
(search by location: Killarney Community Centre)
