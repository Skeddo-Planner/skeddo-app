# Verification Log — City of Vancouver - Dunbar Cmty Centre

**Date audited:** 2026-04-05
**Audited by:** Claude (automated audit agent)
**Registration page URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&location_ids=23
**Status:** BLOCKED — Chrome browser unavailable

---

## Audit Outcome: Blocked

### Reason

The `mcp__Claude_in_Chrome__navigate` tool (Claude in Chrome) was not available in this session. Per mandatory audit rules, `WebFetch` and `WebSearch` must not be used to read registration page content — the ActiveNet platform requires JavaScript rendering and WebFetch will silently miss most program data.

Without Chrome, field-by-field verification of live registration data cannot be performed.

### What Was Attempted

1. Confirmed Chrome MCP tool unavailable — `mcp__Claude_in_Chrome__navigate` returned `No such tool available`.
2. Checked MCP server configuration — no Chrome MCP server registered in `claude_desktop_config.json`.
3. Reviewed existing database state (documented below).

---

## Existing Database State (as of 2026-04-05)

**Provider names in database:**
- `City of Vancouver - Dunbar Community Centre` (numeric IDs 1451–1486)
- `City of Vancouver - Dunbar Cmty Centre` (COV-* IDs)
- `City of Vancouver — Dunbar Cmty Centre` (em-dash variant)

**Total programs in database:** 201
- Open: 111
- Full/Waitlist: 41
- Completed: 49

**Registration URL pattern:** `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/{activityId}?onlineSiteId=0`

### Program Categories (Open programs)
| Category | Count |
|----------|-------|
| General | 40 |
| Sports | 23 |
| Performing Arts | 17 |
| Music | 16 |
| Multi-Activity | 11 |
| Arts | 4 |

### Open Programs Inventory (111 total)

| ID | Name | Start Date | Cost |
|----|------|-----------|------|
| ACT-602618 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-06 | null |
| ACT-602619 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-13 | null |
| ACT-602620 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-20 | null |
| ACT-602621 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-27 | null |
| ACT-602622 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-04 | null |
| ACT-602623 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-10 | null |
| ACT-602624 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-17 | null |
| ACT-602625 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-24 | null |
| ACT-602627 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-06 | null |
| ACT-602628 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-13 | null |
| ACT-602630 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-20 | null |
| ACT-602631 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-27 | null |
| ACT-602632 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-04 | null |
| ACT-608317 | Dunbar Day Camp - Week 1 (6-12 yrs) | 2026-07-02 | null |
| ACT-608330 | Dunbar Day Camp - Week 2 (6-12 yrs) | 2026-07-06 | null |
| ACT-608332 | Dunbar Day Camp - Week 3 (6-12 yrs) | 2026-07-13 | null |
| ACT-609243 | Dunbar Day Camp - Week 4 (6-12 yrs) | 2026-07-20 | null |
| ACT-609244 | Dunbar Day Camp - Week 5 (6-12 yrs) | 2026-07-27 | null |
| ACT-609245 | Dunbar Day Camp - Week 6 (6-12 yrs) | 2026-08-04 | null |
| ACT-609246 | Dunbar Day Camp - Week 7 (6-12 yrs) | 2026-08-10 | null |
| ACT-609247 | Dunbar Day Camp - Week 8 (6-12 yrs) | 2026-08-17 | null |
| COV-598743 | Private Piano Lessons (5-9 yrs) | 2026-04-02 | $318 |
| COV-600802 | Dunbar Soccer Academy (2-3 yrs) | 2026-04-15 | $203.50 |
| COV-600803 | Dunbar Soccer Academy (3-5 yrs) | 2026-04-13 | $203.50 |
| COV-600804 | Dunbar Soccer Academy (3-5 yrs) | 2026-04-15 | $203.50 |
| COV-600805 | Dunbar Soccer Academy (5-7 yrs) | 2026-04-13 | $203.50 |
| COV-600807 | Dunbar Soccer Academy (7-9 yrs) | 2026-04-13 | $203.50 |
| COV-601346 | Private Piano Lessons (3.5+ yrs) | 2026-04-11 | $550 |
| COV-601348 | Private Piano Lessons (3.5+ yrs) | 2026-04-11 | $726 |
| COV-602035 | Private Piano Lessons (3.5+ yrs) | 2026-04-08 | $1584 |
| COV-602069 | Byte Camp - Introduction to coding | 2026-08-10 | $410 |
| COV-602625 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-24 | $399 |
| COV-602627 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-06 | $399 |
| COV-602628 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-13 | $399 |
| COV-602630 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-20 | $399 |
| COV-602631 | Kids Tennis Game Set Match Full-Day Camp | 2026-07-27 | $399 |
| COV-602632 | Kids Tennis Game Set Match Full-Day Camp | 2026-08-04 | $322 |
| COV-603548 | Self Defence Summer Camp (6-10yrs) | 2026-07-20 | $295 |
| COV-603587 | Self Defence Summer Camp (11-16yrs) | 2026-08-24 | $295 |
| COV-603643 | Sportball Indoor Basketball (6-9 yrs) | 2026-05-21 | $120 |
| COV-604386 | ANIME CARTOON DRAWING WORKSHOP (6-12 yrs) | 2026-08-17 | $220 |
| COV-604400 | Drawing and Painting (3-5 yrs) | 2026-04-13 | $220 |
| COV-604777 | Private Piano Lessons (4+ yrs) | 2026-04-13 | $325 |
| COV-604778 | Private Piano Lessons (4+ yrs) | 2026-04-13 | $325 |
| COV-604780 | Private Piano Lessons (4+ yrs) | 2026-04-13 | $325 |
| COV-604781 | Private Piano Lessons (4+ yrs) | 2026-04-13 | $325 |
| COV-604782 | Private Piano Lessons (4+ yrs) | 2026-04-13 | $325 |
| COV-608124 | Mini Hip Hop Breakers age 3-5 | 2026-04-12 | $154 |
| COV-608125 | Mini Hip Hop Breakers age 3-5 | 2026-07-05 | $112 |
| COV-608873 | Shotokan Karate | 2026-04-01 | $288 |
| COV-608874 | Shotokan Karate Saturdays | 2026-04-04 | $144 |
| COV-608880 | Shotokan Karate | 2026-07-06 | $180 |
| COV-608882 | Shotokan Karate Saturdays | 2026-07-04 | $108 |
| COV-609508 | Maevann Art Lessons (Fridays)(Preschoolers 3-5 years) | 2026-04-10 | $45 |
| COV-609568 | Maevann Art Summer Camp (5-10 yrs) | 2026-08-17 | $70 |
| COV-609569 | Maevann Art Summer Camp (5-10 yrs) | 2026-08-04 | $60 |
| COV-610140 | GirlsCANCompute: Math Club (10-13 yrs) | 2026-04-10 | $0 |
| COV-610141 | GirlsCANCompute: Computational Linguistics Club (13-15 yrs) | 2026-04-10 | $0 |
| COV-610183 | Youth Knitting Club (11-16 yrs) | 2026-04-08 | $0 |
| COV-610186 | Dunbar Reading Buddies | 2026-04-10 | $0 |
| COV-610357 | 1st Ballet Time | 2026-07-07 | $128 |
| COV-610362 | 1st Dance Sing Musical Theatre | 2026-04-07 | $192 |
| COV-610365 | 1st Dance Sing Musical Theatre | 2026-07-07 | $192 |
| COV-610372 | 1st Tumble, Flex and Dance | 2026-04-07 | $192 |
| COV-610373 | 1st Tumble, Flex and Dance | 2026-07-07 | $128 |
| COV-610375 | 1st Urban Dance Hip Hop | 2026-04-07 | $192 |
| COV-610376 | 1st Urban Dance Hip Hop | 2026-07-07 | $128 |
| COV-610465 | A Ballet Time with Strength and Stretch (7-10yrs) | 2026-04-11 | $192 |
| COV-610470 | Asian Pop/KPOP/ Hip Hop (6-12 yrs) | 2026-04-12 | $192 |
| COV-610471 | Asian Pop/KPOP/ Hip Hop (6-12 yrs) | 2026-07-05 | $144 |
| COV-610472 | Asian Pop/KPOP/ Hip Hop (6-12 yrs) | 2026-04-11 | $192 |
| COV-610473 | Asian Pop/KPOP/ Hip Hop (6-12 yrs) | 2026-07-04 | $144 |
| COV-610479 | 1-Active Dance Sing/Jazz Funk/Hip Hop/KPOP (AM Half 8-14yrs) | 2026-08-17 | $238 |
| COV-610791 | 1-Active Dance Sing/Jazz Funk/Hip Hop/KPOP (PM Half 8-14yrs) | 2026-08-24 | $238 |
| COV-613002 | ANIMAL CARTOON WORKSHOP (6-12 yrs) | 2026-08-10 | $220 |
| COV-615725 | Private Piano Lessons (3.5+ yrs) | 2026-07-04 | $357 |
| COV-615726 | Private Piano Lessons (3.5+ yrs) | 2026-07-04 | $357 |
| COV-615727 | Private Piano Lessons (3.5+ yrs) | 2026-07-04 | $357 |
| COV-615729 | Private Piano Lessons (3.5+ yrs) | 2026-07-05 | $469 |
| COV-615730 | Private Piano Lessons (3.5+ yrs) | 2026-07-05 | $357 |
| COV-615746 | Teen Astronomy Club | 2026-04-15 | $0 |
| COV-616587 | Private Piano Lessons (3.5+ yrs) | 2026-04-10 | $363 |
| COV-616588 | Private Piano Lessons (3.5+ yrs) | 2026-07-10 | $238 |
| COV-617324 | Cycle Fit | 2026-05-02 | $7.93 |
| COV-617325 | Cycle Fit | 2026-05-09 | $7.93 |
| COV-617326 | Cycle Fit | 2026-05-16 | $7.93 |
| COV-617327 | Cycle Fit | 2026-05-23 | $7.93 |
| COV-617328 | Cycle Fit | 2026-05-30 | $7.93 |
| COV-617329 | Cycle Fit | 2026-06-06 | $7.93 |
| COV-617330 | Cycle Fit | 2026-06-13 | $7.93 |
| COV-617381 | Cycle Fit | 2026-04-08 | $7.93 |
| COV-617382 | Cycle Fit | 2026-04-15 | $7.93 |
| COV-617383 | Cycle Fit | 2026-04-22 | $7.93 |
| COV-617384 | Cycle Fit | 2026-04-29 | $7.93 |
| COV-617385 | Cycle Fit | 2026-05-06 | $7.93 |
| COV-617386 | Cycle Fit | 2026-05-13 | $7.93 |
| COV-617387 | Cycle Fit | 2026-05-20 | $7.93 |
| COV-617388 | Cycle Fit | 2026-05-27 | $7.93 |
| COV-617389 | Cycle Fit | 2026-06-03 | $7.93 |
| COV-617390 | Cycle Fit | 2026-06-10 | $7.93 |
| COV-617392 | Cycle Fit | 2026-06-17 | $7.93 |
| COV-617394 | Cycle Fit | 2026-06-24 | $7.93 |
| COV-617395 | Cycle Fit | 2026-07-08 | $7.93 |
| COV-617396 | Cycle Fit | 2026-07-15 | $7.93 |
| COV-617397 | Cycle Fit | 2026-07-22 | $7.93 |
| COV-617399 | Cycle Fit | 2026-07-29 | $7.93 |
| COV-617400 | Cycle Fit | 2026-08-05 | $7.93 |
| COV-617402 | Cycle Fit | 2026-08-12 | $7.93 |
| COV-617403 | Cycle Fit | 2026-08-19 | $7.93 |
| COV-617404 | Cycle Fit | 2026-08-26 | $7.93 |
| COV-617656 | 1st Ballet Time | 2026-04-07 | $192 |

---

## No Data Changes Made

No programs were modified, added, or removed. Without Chrome browser verification, no field values can be confirmed or corrected.

## Completeness Check

Unable to determine: live page was not loaded. Cannot count programs on provider's registration site.

## Next Steps

Re-run this audit when the `mcp__Claude_in_Chrome__navigate` tool is available. The ActiveNet platform (anc.ca.apm.activecommunities.com) requires JavaScript rendering — WebFetch cannot be used as a substitute.

Registration page to revisit:
- https://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&location_ids=23
