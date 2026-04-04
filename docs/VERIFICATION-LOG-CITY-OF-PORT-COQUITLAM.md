# Verification Log — City of Port Coquitlam

**Date:** 2026-04-04
**Auditor:** Claude (automated)
**Registration portal:** https://anc.ca.apm.activecommunities.com/cityofportcoquitlam/home
**City info page:** https://www.portcoquitlam.ca/recreation-parks/day-camps

---

## Summary

Summer 2026 programs not yet published. Leisure Guide available May 5, 2026; resident registration opens May 12, public May 15.

Database has 60 programs (mostly spring + Pro-D programs). Main fix: `url` field was set to generic search page; updated to specific detail URLs.

Changes: 0 added / 60 url fixed / 0 status changed.

---

## Key Finding: Summer 2026 Not Yet Available

Per official City of Port Coquitlam schedule:
- **Summer 2026 Leisure Guide online:** May 5, 2026
- **PoCo resident registration:** May 12, 2026
- **General public registration:** May 15, 2026

**Re-audit this provider on or after May 5, 2026.**

---

## Fixes Applied

### URL field updated
All 60 programs: `url` was generic search page → updated to specific `registrationUrl` detail URLs (e.g. `https://anc.ca.apm.activecommunities.com/cityofportcoquitlam/activity/search/detail/115654`)

---

## Facilities

| Facility | Address |
|----------|---------|
| Hyde Creek Recreation Centre | 1379 Laurier Ave, Port Coquitlam, BC V3B 2B9 |
| Port Coquitlam Community Centre (PCCC) | 2150 Wilson Ave, Port Coquitlam, BC V3C 6J5 |
| The Outlet (arts) | 1100-2253 McAllister Ave, Port Coquitlam, BC V3C 2A5 |

## Summer Camp Types (based on 2025 pattern)
Programs typically run July 2 – August 28:
- Tons of Fun (Early Years, Ages 3-5.5)
- Junior Explorers (Ages 5.5-8) - outdoor adventure, full day
- Explorers (Ages 8-11) - outdoor adventure, full day
- Youth Adventure (Ages 11-17)
- Art Camps (multiple age groups)
- Biking (Little Sprockets, Trail Blazers)
- Skating + Swim camps
- Multi Sports, Basketball
- Musical Theatre

## Rule 24 Compliance
Uses `anc.ca.apm.activecommunities.com/cityofportcoquitlam/` — activecommunities.com is allowed.
