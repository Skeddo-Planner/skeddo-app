# Verification Log — City of Vancouver - Trout Lake Cmty Centre

**Date audited:** 2026-04-05
**Audited by:** Claude (automated audit agent)
**Registration page URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&location_ids=22
**Status:** COMPLETED (API-verified; Playwright browser unavailable)

---

## Audit Summary

The Playwright browser (Chrome MCP) failed to spawn on this machine (`spawn UNKNOWN`), preventing direct rendering of the ActiveNet JavaScript-based registration pages. Per the fallback protocol, verification was performed using:

1. **`cov-activenet-data.json`** — City of Vancouver ActiveNet bulk data snapshot (captured 2026-03-31), containing 135 Trout Lake Cmty Centre programs
2. **ActiveNet REST API** — `estimateprice` endpoint queried directly for price verification on new programs
3. **ActiveNet detail API** — `activity/detail/{id}` endpoint for descriptions and session data

**Caveat:** Field-by-field verification was done via API, not live browser. Prices were confirmed via `estimateprice` API. Browser re-verification is recommended when Playwright is available.

---

## Database Changes Made This Session

### Programs Added (2 new)

| ID | Name | Cost | Date | Ages |
|----|------|------|------|------|
| COV-609696 | Cycle Fit | $7.93/session | 2026-04-06 (Mon) | 13+ |
| COV-608141 | Axe Capoeira Adult All Levels | $315 (spring session) | Apr 10 – Jun 26 (Mon/Fri) | 14+ |

**COV-609696 — Cycle Fit (April 6)**
- Time: 5:30 PM – 6:30 PM
- Description: Cycle Fit is 60 minutes of indoor riding, with a longer warm-up and cool down.
- Price verified via ActiveNet estimateprice API: $7.93 (matches existing Cycle Fit sessions COV-597236, COV-612825, COV-615094)
- 15 openings as of 2026-03-31 API snapshot

**COV-608141 — Axe Capoeira Adult All Levels**
- Time: 5:15 PM – 6:15 PM, Mon/Fri
- Description: Capoeira is an Afro-Brazilian martial art that combines self-defense, dance, acrobatics, music, and physical conditioning. Classes focus on developing rhythm, reflexes, balance, coordination, strength and flexibility.
- Price verified via ActiveNet estimateprice API: $315.00
- Companion program to existing COV-595442 (Axe Capoeira Mini Kids, ages 4–7)
- 20 openings as of 2026-03-31 API snapshot

### Programs Updated (1 status fix)

| ID | Field | Before | After |
|----|-------|--------|-------|
| COV-601537 | enrollmentStatus | Open | Full |

**COV-601537 — Artisan Pottery Sale (May 2, 2026)**
- API showed 0 openings as of 2026-03-31 snapshot
- Free event (cost: $0), registration spots exhausted
- Changed to "Full"

---

## Programs Compared Against API Data

### Existing COV- Programs (111 → 113 after additions)

All 111 existing programs were cross-referenced against the `cov-activenet-data.json` snapshot:
- **110 programs**: dates, times, and status matched API data with no discrepancies
- **1 discrepancy**: COV-601537 showed 0 openings in API (fixed above)
- **0 programs**: appeared to have been removed from the live system

### Programs in API Not in COV- Namespace

The following programs existed in the API data for Trout Lake Cmty Centre but were NOT under the `City of Vancouver - Trout Lake Cmty Centre` provider in our database:

| API ID | Name | Notes |
|--------|------|-------|
| 606134–606140 | Soccer Camp with Golden Boot Soccer (6-7yrs) — 4 summer weeks | Exist under "City of Vancouver - Trout Lake Community Centre" (numeric IDs 1859–1866) |
| 606142–606147 | Soccer Camp with Golden Boot Soccer (8-12yrs) — 4 summer weeks | Exist under "City of Vancouver - Trout Lake Community Centre" (numeric IDs 1871–1874) |
| 611434–611452 | Summer Daze Day Camp Pre-teen Leadership — Weeks 1–9 | Exist under "City of Vancouver — Trout Lake Community Centre" (ACT-611434 etc.) |
| 606215 | Byte Camp — Introduction to Coding | Exists under "City of Vancouver - Trout Lake Community Centre" (numeric ID 1917) |
| 605247 | Art Studio Camp | Exists under "City of Vancouver - Trout Lake Community Centre" (numeric ID 1880) |
| 595430 | Aikido (April) — ages 17+ | Adult program (17+), not added |
| 606050 | Aikido (August) — ages 17+ | Adult program (17+), not added |
| 606051 | Aikido (July) — ages 17+ | Adult program (17+), not added |

**Note on duplicates:** The database contains multiple provider name variants for Trout Lake — "Trout Lake Cmty Centre" (COV- IDs), "Trout Lake Community Centre" (numeric IDs), and "Trout Lake Community Centre" with em-dash (ACT- IDs). The Soccer Camps, Summer Daze Pre-teen camps, Byte Camp, and Art Studio Camp all exist under the non-COV variants with complete data. No duplicate entries were created.

---

## Final Database State

**Provider:** `City of Vancouver - Trout Lake Cmty Centre`
**Total programs:** 113

| Status | Count |
|--------|-------|
| Open | 105 |
| Completed | 7 |
| Full | 1 |
| **Total** | **113** |

### ID Range
COV-536908 through COV-615094 (plus COV-608141, COV-609696 added this session)

### Program Types (Open programs)

| Category | Programs |
|----------|----------|
| Music | Piano with Samuel (Mon/Wed/Fri/Sat), Guitar & Ukulele, Violin and Fiddle, Classical/Jazz/Pop Piano & Guitar with Diego, Music Together With Karina, Babies Only Music Together With Karina, B-Boy Dance with Jhaymee, Art and Music with Sun Rey, Singing Stars, Pop Star Power |
| Dance/Movement | Hip-Hop & Jazz, Hip-Hop, Mini Hip Hop Movers, Ballet Parent & Toddler Dance |
| Martial Arts | Axe Capoeira Mini Kids (all levels), Axe Capoeira Adult All Levels, Shorinji Kempo (April) |
| Sports | High 5 Sports, High 5 Sports Parent and Tot, Rain City Basketball Spring Grassroot Sessions, Future Bounce Basketball Grades 8-10, Sportball Parent and Tot (Multisport + T-Ball), Kids Tennis (7-9yrs) |
| Fitness | Cycle Fit (multiple sessions), Cycle Core, Cycle Xpress |
| Preschool | Trout Lake Preschool, TL - Preschool 4YR - M/W/F-AM WAITLIST, TL - Preschool 4YR - M/W/F-PM WAITLIST, TL - Preschool 3YR - T/TH - AM WAITLIST, TL - Preschool 3YR - T/TH - PM WAITLIST |
| Arts/Crafts | Artisan Pottery Sale (Full), Art and Yoga Spring Break Camp for Kids, Tiny Hands, Big Ideas |
| Cooking/Life Skills | Cook and Bake with Lily, Family Fun Lip Gloss Making with Lily, EcoCooks: Cook for the Planet |
| STEM | WEDO I Robotics, Pre Foundation Chess (Level 2) |
| Literacy | Storytelling & Creative Writing |
| Camps | Summer Daze Week 1 - Before Care, Kingfisher Empowerment Camp, Modernism Architecture Spring Camp with Petit Architect |
| Music (Spring camps) | Easter Sugar Art, Art and Yoga Spring Break Camp for Kids |
| Parent/Tot | Toddler Birthday Party, Music Together, Sportball Parent and Tot |
| Drop-in | Stat Holiday - Free Play Gym | Arts & Crafts |

---

## Completeness Check

- **API shows:** 135 Trout Lake Cmty Centre programs (excl. rink)
- **Database has:** 113 under "Trout Lake Cmty Centre" + additional entries under other naming variants
- **Newly added:** 2 programs (COV-608141, COV-609696)
- **Skipped (adult 17+):** 3 Aikido sessions — out of Skeddo's children's program scope
- **Skipped (already in DB under different provider name):** 5 program groups (Soccer Camps, Summer Daze Pre-teen, Byte Camp, Art Studio Camp)

---

## Audit Limitations

1. **Playwright browser unavailable**: Chrome MCP could not spawn. All verification was done via ActiveNet REST API (not live browser rendering). Prices, dates, and status confirmed against API data from 2026-03-31 snapshot.
2. **Prices**: Confirmed via `estimateprice` API endpoint for new programs. Existing prices were not re-verified against live page.
3. **Re-audit recommended** when Playwright browser is available to confirm all 105 open programs against live registration pages.
