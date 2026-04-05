# Verification Log — Royal City Soccer Club

**Date:** 2026-04-05
**Auditor:** Claude (automated)
**Registration Page:** https://royalsoccerclub.com/summer-camp-locations/british-columbia/vancouver/
**Registration Portal:** https://royalbc.campbrainregistration.com/
**Status:** COMPLETED

---

## Summary

| Metric | Value |
|--------|-------|
| Programs found on live page | 80 (4 locations × 10 weeks × 2 session types) |
| Programs in database (before) | 8 |
| Programs updated | 8 (corrected URL, name, cost) |
| Programs added | 72 (missing locations + morning sessions) |
| Programs completed | 0 |

---

## Provider Note

"Royal City Soccer Club" (royalsoccer.com) redirects permanently (301) to royalsoccerclub.com ("Royal Soccer Club"). They are the same organization. Our database provider name "Royal City Soccer Club" is correct as it matches the BC-specific branding used on their site.

---

## Programs Found on Live Page

### 4 Vancouver Locations

| Location | Primary Address | Week 9 Address |
|----------|----------------|----------------|
| Kensington | Kensington Park, 5175 Dumfries St, Vancouver | Tecumseh Annex Elementary, 1551 37 Ave E, Vancouver |
| Renfrew | Beaconsfield Park, 3215 Slocan St, Vancouver | Same |
| Kerrisdale | Kerrisdale Park, 5670 East Blvd, Vancouver | Quilchena Elementary, 5300 Maple St, Vancouver |
| Templeton | Templeton Park North Field, 700 Templeton Dr, Vancouver | Templeton Secondary, 727 Templeton Dr, Vancouver |

### 10 Weeks

| Week | Dates | Days | Notes |
|------|-------|------|-------|
| 1 | June 29 – July 3, 2026 | Mon-Fri | 4-day (no July 1, Canada Day) |
| 2 | July 6–10, 2026 | Mon-Fri | Full week |
| 3 | July 13–17, 2026 | Mon-Fri | Full week |
| 4 | July 20–24, 2026 | Mon-Fri | Full week |
| 5 | July 27–31, 2026 | Mon-Fri | Full week |
| 6 | Aug 3–7, 2026 | Mon-Fri | 4-day (no Aug 3, BC Day) |
| 7 | Aug 10–14, 2026 | Mon-Fri | Full week |
| 8 | Aug 17–21, 2026 | Mon-Fri | Full week |
| 9 | Aug 24–28, 2026 | Mon-Fri | Full week (venue change at some locations) |
| 10 | Aug 31 – Sept 4, 2026 | Mon-Fri | Full week |

### 2 Session Types

| Session | Times | Full-week Price | 4-day Price |
|---------|-------|----------------|-------------|
| Full Day | 9:00 AM – 4:00 PM | $299/week | $215/week |
| Morning Session | 9:00 AM – 12:00 PM | $195/week | $140/week |

**Ages:** 5–13 (single undivided group; campers must turn 6 before Dec 31, 2026)
**Early registration discount:** $20 off full day / $10 off morning, if registered by June 1
**Sibling discount:** $10 off second and additional campers
**Campers receive:** Soccer ball and medal

---

## Database Changes Made

### Updated (8 programs — IDs 291–298)
- Renamed from "Soccer Camp" to "Soccer Camp — Full Day"
- Fixed registrationUrl to Vancouver camp page (was missing Kerrisdale location specificity)
- Updated cost for Week 6 (Aug 3–7, 4-day): $299 → $215
- Added ageSpanJustified (provider uses single 5–13 group, no sub-bands)

### Added (72 programs — IDs 613264–613335)
- 3 new locations: Kensington, Renfrew, Templeton — all 10 weeks, Full Day sessions
- Morning Session variants for all 4 locations, all 10 weeks

**Provider shows 80 programs, database had 8 — 72 added**

---

## Notes

- R46 suppressed via `ageSpanJustified`: provider genuinely uses 5–13 as a single group
- Early bird deadline (March 31) has already passed as of audit date (April 5, 2026)
- Week 9 venues differ at Kensington, Kerrisdale, Templeton — noted in `costNote` fields
