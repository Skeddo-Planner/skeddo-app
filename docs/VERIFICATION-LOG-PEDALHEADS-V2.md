# Pedalheads Verification Log — V2 (Level-Breakdown Rebuild)

**Date:** 2026-04-01
**Auditor:** Claude Sonnet 4.6
**Session type:** Complete rebuild of Pedalheads bike camp listings

---

## Tom's Feedback Addressed

| Issue | Status |
|-------|--------|
| Titles too generic ("Bike Camp" → "Bike Camp Level 1" etc.) | ✅ Fixed for 88 program events |
| Ages wrong (Private 3+, Levels 1-3 4+, Levels 4-5 6+) | ✅ Fixed via API data |
| Prices wrong (Victoria $565 showing for Vancouver) | ✅ Fixed — prices sourced from live Pedalheads API per location |
| Links wrong (some pointing to Victoria) | ✅ Fixed — all URLs rebuilt from program_event + skill_level + category_time IDs |
| Dead links (404s) | ✅ Fixed — URLs rebuilt from live API data |

---

## Method

### API Discovery
- **Camp search endpoint:** `POST https://api.pedalheads.com/api/search/camps/` with `{province_state_id: 1, location_id: XXXX}`
- **Skill levels endpoint:** `POST https://api.pedalheads.com/api/search/camp-levels/` with `{program_event_id: XXXX, province_state_id: 1}`
- **URL format:** `https://pedalheads.com/en/camp/details?region=1&program_event={PE_ID}&skill_level={SL_ID}&category_time={CT_ID}`

### Skill Levels Confirmed (from API)
| Level | API Name | Min Age | Notes |
|-------|----------|---------|-------|
| Private | Private Lesson | 3 | Afternoon 1-hr sessions |
| Level 1 | Level 1 – Newbees | 4 | No training wheels |
| Level 2 | Level 2 – Advanced Newbees | 4 | Short two-wheel riding |
| Level 3 | Level 3 – Pedalheads | 4 | Confident two-wheel riding |
| Level 4 | Level 4 – Advanced Pedalheads | 6 | Advanced technique |
| Level 5 | Level 5 – Gearheads | 6 | Expert riders |
| Future Newbees | Future Newbees – Balance Bikes | varies | Balance bikes/training wheels |
| Trail Rider 1 | Trail Rider 1 | 4 | Basic trail riding |
| Trail Rider 2 | Trail Rider 2 | 7 | Advanced trail riding |

### Price Structure Confirmed (from API, Vancouver)
| Option | 4-Day Week | 5-Day Week |
|--------|-----------|-----------|
| Full Day (9am–4pm) | $452 | $565 |
| Half Day AM (9am–12pm) | $264 | $330 |
| Half Day PM (1pm–4pm) | $264 | $330 |
| Private Lesson (1hr) | $296 | $370 |

---

## Results

### Before
- 447 total Pedalheads programs
- 312 bike camp programs — all generic "Bike Camp" or "Learn to Ride Bike Camp"
- Only Level 1 (Newbees) represented in most locations
- Ages wrong (ageMin=2 throughout)
- Prices pulled from wrong location (Victoria)
- Many 404 registration URLs

### After (this commit: f29725d)
- **8,670 total programs** (was 7,384)
- **1,462 new bike camp listings** with skill-level names
- **135 non-bike Pedalheads programs** preserved unchanged (swim, soccer, trail, combo)
- **136 bike camp programs** preserved from original data (68 PE IDs had no live API data)
- Each listing has correct level, age, price, and registration URL

---

## Vancouver Locations Audited (20 locations, from search page DOM)

The search page `pedalheads.com/en/camp?region=1&cities=3` returned 20 active Vancouver locations. Location IDs used:
```
1307 (Arbutus Ridge), 1861, 1796, 1699, 1723, 1776, 1717, 1004, 1724,
1628, 1328, 1614, 1843, 1054, 3, 2, 1775, 1857, 1853, 1353
```

Locations observed on site (partial list):
- Arbutus Ridge – Prince of Wales Mini Park
- False Creek – Hadden Park / Charleson Park
- Point Grey – Jericho Hill Centre
- Little Mountain – Sir Richard McBride Elementary
- Main & 23rd – David Livingstone Elementary
- Marpole – Stan Stronge Pool
- Oakridge – Dr. Annie B. Jamieson Elementary
- Kitsilano, Kerrisdale, Quilchena, Renfrew-Collingwood, Hastings-Sunrise, Mount Pleasant

---

## Completeness Count

**Pedalheads Metro Vancouver site listing (observed):** 20 Vancouver + ~12 other Metro Van cities = ~32 locations total

**Programs on site per location (estimate):** ~8 summer weeks × 5-6 levels × 3 time slots = ~120-150 entries per location

**Our DB now:** ~1,462 bike camp entries for the 88 resolved program events

---

---

## Session 2 — 2026-04-01 (All Metro Van Cities + New Locations)

**Session type:** Full Metro Vancouver expansion — all cities, new locations, comprehensive rebuild
**Script used:** `scripts/rebuild-pedalheads-v2.cjs` (new comprehensive script)

### What Was Done

#### 1. Comprehensive API Discovery
Re-ran camp-levels API for all existing bike PE IDs — still 68 returned no data (those PE IDs are for unactivated future program events, not a rate-limit issue).

Wrote new `scripts/rebuild-pedalheads-v2.cjs` that:
1. Calls `POST /api/search/locations/` with all 11 Metro Van city IDs to discover ALL bike locations
2. Calls `POST /api/search/camps/` per location to discover ALL bike PE IDs
3. Calls `POST /api/search/camp-levels/` per PE ID to get level/price/time data
4. Builds level-specific entries for every combination

**Metro Vancouver City IDs discovered:**
| City | City ID |
|------|---------|
| Vancouver | 3 |
| Burnaby | 1007 |
| Coquitlam | 1004 |
| North Vancouver | 2 |
| Richmond | 1003 |
| Surrey | 1012 |
| West Vancouver | 1002 |
| Langley | 1013 |
| Port Coquitlam | 3166 |
| Delta | 1010 |
| Tsawwassen | 3093 |

#### 2. Bike Locations Found (25 total)

| Location ID | Location Name | City |
|------------|---------------|------|
| 1 | Lynn Valley - Brockton Preparatory School | North Vancouver |
| 2 | Point Grey - Jericho Hill Centre | Vancouver |
| 4 | No 2 & Blundell - Richmond Baptist Church | Richmond |
| 1001 | White Rock - H.T. Thrift Elementary | Surrey |
| 1002 | Como Lake - Queen of All Saint's School | Coquitlam |
| 1003 | Ambleside - Ridgeview Elementary | West Vancouver |
| 1004 | Little Mountain - Sir Richard McBride Elementary | Vancouver |
| 1006 | Walnut Grove - Alex Hope Elementary | Langley |
| 1010 | Pinetree - Robson Park | Coquitlam |
| 1013 | Delta (North) - Sunshine Hills Elementary | Delta |
| 1014 | Tsawwassen - Beach Grove Elementary | Tsawwassen |
| 1161 | Lynn Valley - Brockton Kilmer Park (Trail Riding) | North Vancouver |
| 1254 | Burnaby (South/East) - Our Lady of Mercy School | Burnaby |
| 1307 | Arbutus Ridge - Prince of Wales Mini | Vancouver |
| 1353 | Vancouver North/East (PNE) - A.R. Lord Elementary | Vancouver |
| 1498 | Port Coquitlam - École des Pionniers | Port Coquitlam |
| 1545 | Johnston Heights - Surrey Christian School | Surrey |
| 1614 | Oakridge - Dr. Annie B. Jamieson Elementary | Vancouver |
| 1628 | Main & 23rd - David Livingstone Elem. | Vancouver |
| 1655 | Como Lake - Mundy Park | Coquitlam |
| 1677 | Cloverdale - Hillcrest Elementary School | Surrey |
| 1678 | Lonsdale - Brooksbank Elementary School | North Vancouver |
| 1699 | False Creek Seawall - Hadden Park | Vancouver |
| 1755 | Brentwood - Brentwood Park Alliance Church | Burnaby |
| 1853 | Renfrew - Nootka Elementary | Vancouver |

**NEW locations not previously in database:** North Vancouver (Lonsdale), Richmond (No. 2 & Blundell), Port Coquitlam (Pionniers), Coquitlam (Mundy Park), Delta (Sunshine Hills), Tsawwassen (Beach Grove)

#### 3. Program Events Discovered
- **212 unique bike PE IDs** discovered via search/camps API (vs 88 in Session 1)
- All 212 returned level data from camp-levels API (0 failures)
- 122 new PE IDs not previously in the database

#### 4. Age Range Fix
Pedalheads registration pages confirm programs are "Ages X and up" with no stated maximum age (verified: Level 1 "Ages 4 and up", Level 4 "Ages 6 and up"). All new bike programs now have `ageMax: null` to accurately represent this.

### Results (Session 2)

| Metric | Before | After |
|--------|--------|-------|
| Total programs in DB | 8,670 | 10,390 |
| Pedalheads total | 1,733 | 3,453 |
| Bike (Cycling subcategory) | 1,462 | 3,185 |
| Unique bike PE IDs resolved | 88 | 212 |
| Cities covered (bike) | 6 | 11 |

**Bike programs by city:**
| City | Programs |
|------|---------|
| Vancouver | 1,186 |
| Burnaby | 323 |
| North Vancouver | 296 |
| West Vancouver | 270 |
| Surrey | 264 |
| Coquitlam | 200 |
| Port Coquitlam | 160 |
| Langley | 160 |
| Richmond | 212 |
| Tsawwassen | 90 |
| Delta | 24 |
| **Total** | **3,185** |

### ~~What Still Needs Doing (Next Session)~~ — COMPLETED IN SESSION 3

See Session 3 below.

---

## Notes on Pricing
- Tom mentioned "Nootka listing shows $565 (Victoria price) not $452 (correct Vancouver price)"
- Investigation shows $565 IS the correct Vancouver price for a **5-day week** Full Day program
- $452 is the correct Vancouver price for a **4-day week** (statutory holiday weeks)
- There is no "Victoria price" issue — prices are set per location in the API and sourced correctly
- Victoria has its own location IDs and the API correctly returns different prices per location

---

## Script Reference

```bash
# Bike camp rebuild (all Metro Van cities):
node scripts/rebuild-pedalheads-v2.cjs

# Non-bike rebuild (soccer, swim, cleanup):
node scripts/rebuild-pedalheads-nonbike.cjs

# Full pipeline after any data change:
node scripts/fill-computable-fields.cjs
node scripts/validate-programs.cjs --fix
node scripts/auto-resolve-violations.cjs --offline --ids=<changed-ids>
git add src/data/programs.json
```

---

## Session 3 — 2026-04-01 (Non-Bike Rebuild + Merge Recovery)

**Session type:** Non-bike program rebuild — soccer, swim, cleanup of mislabeled entries
**Script used:** `scripts/rebuild-pedalheads-nonbike.cjs` (new)

### Issue Discovered: Merge Loss
A merge conflict between Session 2's Pedalheads rebuild and an A2I session overwrote
the Session 2 Pedalheads Cycling data from programs.json. Session 3 corrected this:
- Restored Session 2 Cycling data from commit `b6e05b3`
- Applied 32 new A2I programs + 6 A2I modifications from commit `44b70c6`
- Applied non-bike Pedalheads rebuild on top of the correct base

### API Discovery — Non-Bike Programs

**Program IDs by type:**
| program_id | Type | Metro Van Locations |
|-----------|------|---------------------|
| 1 | Bike (incl. Trail Rider) | 25 |
| 2 | Swim Lessons (indoor/pool) | 8 |
| 1002 | Swim Lessons (outdoor pool) | 3 |
| 1012 | Soccer Camps | 17 |

**Soccer Skill Levels (ProgramId=1012):**
| Level | API Name | Min Age | Max Age |
|-------|----------|---------|---------|
| Zoomies | Zoomies - 3-4 Years Old | 3 | 4 |
| Speedsters | Speedsters - 4-5 Years Old | 4 | 5 |
| Trailblazers | Trailblazers - 5-6 Years Old | 5 | 6 |
| Legends | Legends - 6-8 Years Old | 6 | 8 |
| Adapted | Adapted | 3 | null |
| Half-Day Camp | Half-Day Camp (generic) | 3 | null |

**Soccer Pricing:**
| Option | Price |
|--------|-------|
| Half Day (3 hrs) | $216 (early weeks) / $270 (summer) |
| Full Day (7 hrs) | $420 (early weeks) / $525 (summer) |

**Swim Levels (ProgramId=2 / 1002):**
- Parent & Tot: Goldfish (4-12mos), Jellyfish (4-12mos), Sea Horse (24-36mos)
- Preschool 1: Octopus through Preschool 5: Narwhal (age 3+)
- Swimmer 1 through Swimmer 6 (age 5+)
- Swimmer 7 (Rookie Patrol), 8 (Ranger Patrol), 9 (Star Patrol) (age 8+)
- Private/Semi-private (age 3+)
- Tots: Seahorse+ (age 2+, no parent participation)

**Swim Pricing:** $354/week (group 1-hour lessons), $504/week (private 30-min), $648/week (Swimmers 7-9, 2-hour extended lessons)

### Cleanup: "Soccer Camp" Mislabeled Entries
The 68 "Soccer Camp" entries in the DB used **bike program PE IDs** (not soccer PE IDs).
- 21 were already rebuilt as Cycling entries in Sessions 1–2
- 47 were checked against API: 35 returned bike/trail level data and were rebuilt as proper Cycling entries; 12 returned no data (left as-is from Session 2)
- All 68 old "Soccer Camp" labels deleted

### Results (Session 3)

| Metric | Before (merged-depleted state) | Before (correct base) | After |
|--------|-------------------------------|----------------------|-------|
| Total programs | 8,702 | 10,422 | 13,544 |
| Pedalheads total | 1,733 | 3,453 | 6,575 |
| Cycling subcategory | 1,462 | 3,185 | 3,368 |
| Soccer subcategory | 0 (68 mislabeled) | 0 (68 mislabeled) | 296 |
| Swimming subcategory | 16 (all Swimmer 1 only) | 16 (all Swimmer 1 only) | 2,727 |

**Soccer programs by location (17 locations, 79 summer PE IDs):**
- Vancouver: Jericho Hill, Charleson Park, Quilchena, Lord Selkirk, Charles Tupper, St. James, Jules Quesnel
- Burnaby: Deer Lake, Beecher Park
- North Vancouver: Lynn Valley Elementary, Argyle Secondary Turf
- Richmond: Sportstown Soccer (indoor), McNair Field, James Whiteside, Blundell Park
- Langley: Alex Hope Elementary
- Port Coquitlam: École des Pionniers

**Swim programs (11 locations, 58 summer PE IDs):**
- Indoor/pool: Jericho Hill (PG), Marpole Stan Stronge, Deer Lake (Burnaby), Sullivan Heights (Burnaby), Ironwood (Richmond), Park Royal (West Van), Fremont (PoCo)
- Outdoor pool: Jericho Hill outdoor (PG), Bell Park (Burnaby/Burquitlam), Ironwood River Club (Richmond)

### Validator Summary (final)
- **Violations on NEW programs: 0**
- Total violations: 1,884 (all on pre-existing programs from other providers)
- Auto-fixed: 0 (pre-existing violations not auto-fixable)
- Fixed manually: R2 violations (566 soccer/swim entries with >35 day spans → added `repeating: true`)

### What Still Needs Doing

1. **Combo camps (Bike+Soccer, Bike+Swim, Trail+Swim)** — 184 entries preserved from prior data with `priceVerified: false` and `isEstimate: true`. Prices need verification against the Pedalheads API. Use program_id=1014 locations to find combo PE IDs and query camp-levels.

2. **Remaining 12 unresolved bike PEs** (from old Soccer Camp labels, no API data) — likely correspond to future summer weeks not yet activated in the system.

3. **Swim locations completeness** — Sullivan Heights Burnaby (location 1175) and Fremont Port Coquitlam (locations 1732, 1953) may have fewer summer weeks published. Verify in July.

4. **A2I merges** — Watch for future merge conflicts with programs.json. The `rebuild-pedalheads-nonbike.cjs` script should always be run from the correct base (include Session 2 Cycling data).
