# Verification Log — City of Vancouver - Strathcona Community Centre

**Date audited:** 2026-04-05
**Auditor:** Claude (automated audit session)
**Status:** INCOMPLETE — Playwright browser unavailable
**Registration page URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&facility_id=115

---

## Blocker

Playwright MCP browser failed to launch on every attempt with error:
```
Error: server: spawn UNKNOWN
Call log:
  - <launching> C:\Users\thoma\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe
    -no-remote -headless -profile ... -juggler-pipe about:blank
```

This is a known environment issue (see recent git commits for other providers with the same error). The ActiveNet registration system requires JavaScript rendering — WebFetch/WebSearch cannot be used as substitutes per CLAUDE.md policy.

Attempted URLs:
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search`
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&facility_id=115`

Both failed with the same spawn error before any page content was loaded.

---

## Existing Database Records (20 programs, unverified)

All 20 programs are "Supershine Summer Day Camp" across 3 age groups (5-7yrs, 8-9yrs, 10-13yrs) for Summer 2026.

### Age Group: 5–7 yrs (IDs 1811–1818)

| ID | Name | Dates | Cost | Status | Registration URL |
|----|------|-------|------|--------|-----------------|
| 1811 | Supershine Summer Day Camp (5-7yrs) - Wk 1 | 2026-06-29 – 2026-07-03 | $112 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583241?onlineSiteId=0&from_original_cui=true) |
| 1812 | Supershine Summer Day Camp (5-7yrs) - Wk 2 | 2026-07-06 – 2026-07-10 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583242?onlineSiteId=0&from_original_cui=true) |
| 1813 | Supershine Summer Day Camp (5-7yrs) - Wk 3 | 2026-07-13 – 2026-07-17 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583243?onlineSiteId=0&from_original_cui=true) |
| 1814 | Supershine Summer Day Camp (5-7yrs) - Wk 4 | 2026-07-20 – 2026-07-24 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583244?onlineSiteId=0&from_original_cui=true) |
| 1815 | Supershine Summer Day Camp (5-7yrs) - Wk 5 | 2026-07-27 – 2026-07-31 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583245?onlineSiteId=0&from_original_cui=true) |
| 1816 | Supershine Summer Day Camp (5-7yrs) - Wk 6 | 2026-08-04 – 2026-08-07 | $112 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583246?onlineSiteId=0&from_original_cui=true) |
| 1817 | Supershine Summer Day Camp (5-7yrs) - Wk 7 | 2026-08-10 – 2026-08-14 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583247?onlineSiteId=0&from_original_cui=true) |
| 1818 | Supershine Summer Day Camp (5-7yrs) - Wk 8 | 2026-08-17 – 2026-08-21 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583248?onlineSiteId=0&from_original_cui=true) |

### Age Group: 8–9 yrs (IDs 1819–1822)

| ID | Name | Dates | Cost | Status | Registration URL |
|----|------|-------|------|--------|-----------------|
| 1819 | Supershine Summer Day Camp (8-9yrs) Wk 1 | 2026-06-29 – 2026-07-03 | $112 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583249?onlineSiteId=0&from_original_cui=true) |
| 1820 | Supershine Summer Day Camp (8-9yrs) Wk 2 | 2026-07-06 – 2026-07-10 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583250?onlineSiteId=0&from_original_cui=true) |
| 1821 | Supershine Summer Day Camp (8-9yrs) Wk 3 | 2026-07-13 – 2026-07-17 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583251?onlineSiteId=0&from_original_cui=true) |
| 1822 | Supershine Summer Day Camp (8-9yrs) Wk 4 | 2026-07-20 – 2026-07-24 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583252?onlineSiteId=0&from_original_cui=true) |

**Note:** 8-9yr group only has 4 weeks (Wks 1-4). The 5-7yr and 10-13yr groups have 8 weeks each. Weeks 5-8 for 8-9yrs may be missing from the database — could not verify without Playwright.

### Age Group: 10–13 yrs (IDs 1803–1810)

| ID | Name | Dates | Cost | Status | Registration URL |
|----|------|-------|------|--------|-----------------|
| 1803 | Supershine Summer Day Camp (10-13yrs) Wk 1 | 2026-06-29 – 2026-07-03 | $112 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583233?onlineSiteId=0&from_original_cui=true) |
| 1804 | Supershine Summer Day Camp (10-13yrs) Wk 2 | 2026-07-06 – 2026-07-10 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583234?onlineSiteId=0&from_original_cui=true) |
| 1805 | Supershine Summer Day Camp (10-13yrs) Wk 3 | 2026-07-13 – 2026-07-17 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583235?onlineSiteId=0&from_original_cui=true) |
| 1806 | Supershine Summer Day Camp (10-13yrs) Wk 4 | 2026-07-20 – 2026-07-24 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583529?onlineSiteId=0&from_original_cui=true) |
| 1807 | Supershine Summer Day Camp (10-13yrs) Wk 5 | 2026-07-27 – 2026-07-31 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583531?onlineSiteId=0&from_original_cui=true) |
| 1808 | Supershine Summer Day Camp (10-13yrs) Wk 6 | 2026-08-04 – 2026-08-07 | $112 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583534?onlineSiteId=0&from_original_cui=true) |
| 1809 | Supershine Summer Day Camp (10-13yrs) Wk 7 | 2026-08-10 – 2026-08-14 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583239?onlineSiteId=0&from_original_cui=true) |
| 1810 | Supershine Summer Day Camp (10-13yrs) Wk 8 | 2026-08-17 – 2026-08-21 | $140 | Full/Waitlist | [Link](https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/583240?onlineSiteId=0&from_original_cui=true) |

---

## Summary

- **Provider shows:** Unknown (could not load page)
- **Database has:** 20 programs
- **Added:** 0
- **Fixed:** 0
- **Missing (suspected):** Possibly Wks 5–8 for age group 8-9yrs (4 programs) — pattern inconsistency with other age groups

## Action Required

- Playwright browser must be repaired before this audit can be completed
- Once working, re-run audit to verify all 20 existing programs and check for missing 8-9yr weeks 5-8
- Physical address confirmed: 601 Keefer St, Vancouver, BC V6A 3V8
