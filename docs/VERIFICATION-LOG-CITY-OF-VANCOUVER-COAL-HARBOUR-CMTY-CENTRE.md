# Verification Log — City of Vancouver - Coal Harbour Cmty Centre

**Audit Date:** 2026-04-05
**Auditor:** Claude (automated)
**Registration Page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search (ActiveNet)
**Provider:** City of Vancouver - Coal Harbour Community Centre

---

## Status: INCOMPLETE — Playwright Browser Unavailable

### What Was Attempted

1. Attempted to navigate to Vancouver Parks registration page using `mcp__playwright__browser_navigate`
2. Browser failed to spawn: `Error: server: spawn UNKNOWN` — Firefox process could not be launched
3. This is the same Playwright spawn error blocking multiple recent City of Vancouver audits (Coal Harbour, Kitsilano, Marpole-Oakridge, False Creek, Hillcrest Rink, Killarney)

### Why WebFetch Cannot Be Used As a Substitute

Per CLAUDE.md mandatory audit standards: "You MUST use the Playwright browser tool — never WebFetch — to read registration pages." The ActiveNet registration system requires JavaScript rendering to display program listings. WebFetch/WebSearch cannot render JavaScript and will miss most or all program data.

### Existing Database State (Pre-Audit)

**Total programs in database:** 116

| Status | Count |
|--------|-------|
| Open | 54 |
| Coming Soon | 48 |
| Full/Waitlist | 6 |
| Completed | 8 |
| **Total** | **116** |

### Programs Currently in Database

#### Day Camps (COV IDs — Open/Completed)
- COV-599208: Day Camp Starfish (6-8yrs) - Week 1
- COV-599212: Day Camp Starfish (6-8yrs) - Week 2
- COV-599213: Day Camp Starfish (6-8yrs) - Week 3
- COV-599214: Day Camp Starfish (6-8yrs) - Week 4
- COV-599215: Day Camp Starfish (6-8yrs) - Week 5
- COV-599216: Day Camp Starfish (6-8yrs) - Week 6
- COV-599230: Day Camp - After Care (6-12 yrs) - Week 1
- COV-599231: Day Camp - After Care (6-12 yrs) - Week 2
- COV-599232: Day Camp - After Care (6-12 yrs) - Week 3
- COV-599233: Day Camp - After Care (6-12 yrs) - Week 4
- COV-599234: Day Camp - After Care (6-12 yrs) - Week 5
- ACT-599208: Day Camp Starfish (6-8yrs) - Week 1 (duplicate ACT ID)
- ACT-599212: Day Camp Starfish (6-8yrs) - Week 2 (duplicate ACT ID)

#### Summer Camps (wecca IDs — Coming Soon)
- wecca-ch-starfish-w1 through w9: Day Camp Starfish (6-8yrs) Weeks 1-9
- wecca-ch-stingray-w1 through w9: Day Camp Stingray (9-12yrs) Weeks 1-9
- wecca-ch-aftercare-w1 through w9: Day Camp After Care (6-12yrs) Weeks 1-9
- wecca-ch-fairytale-remix: Fairytale Remix Dance Camp (4-6yrs)
- wecca-ch-frozen-ballet: Frozen Ballet Camp (3-5yrs)
- wecca-ch-mini-hiphop: Mini Hip Hop Playground Dance Camp (4-6yrs)
- wecca-ch-under-sea: Under the Sea Dance Quest (4-6yrs)
- wecca-ch-superhero: Superhero Training Academy Dance Camp (5-8yrs)
- wecca-ch-kpop: K-Pop Demon Hunters Dance Camp (6-12yrs)
- wecca-ch-lego-film-w1 through w2: LEGO Stopmotion Animation Camp (7-12yrs)
- wecca-ch-tot-soccer-w1 through w4: Outdoor Tot Soccer Camp (4-6yrs)
- wecca-ch-soccer-w1 through w4: Outdoor Soccer Camp (7-12yrs)
- wecca-ch-amusement-parks: Amusement Parks Camp
- wecca-ch-architecture: Architecture Around the World Camp
- wecca-ch-cartooning: Cartooning & Illustration Summer Camp
- wecca-ch-fairy-gnomes: Fairy and Gnomes Houses Camp
- wecca-ch-dream-house: Dream House Camp with Petit Architect

#### Regular Programs (COV IDs — Open)
- COV-416623: Coal Harbour Kinder Kids - Waiting List
- COV-598147: Jellyfish Playtime - Tu/Th
- COV-598148: Baby Jellyfish Playtime - M/Tu/W/Th/F
- COV-599404: Tot Soccer (4-6yrs)
- COV-600158: Artists, Architects and Engineers!
- COV-600160: Art with Acrylic Paint and Different Medias!
- COV-600335 through COV-600347: Piano - Ami Set 1 (13 sessions)
- COV-600877: Aikido (5-8yrs)
- COV-600878: Aikido (8-15yrs)
- COV-601556: Mini Hip Hop Breakers (3-5yrs)
- COV-601702: Olympic Style TaeKwonDo (11-16 yrs)
- COV-601703: Olympic Style TaeKwonDo (4-6yrs)
- COV-601704: Olympic Style TaeKwonDo (7-10yrs)
- COV-601709: Olympic Style TaeKwonDo (11-16yrs)
- COV-605766: Fun with Japanese! - P/T (1-2yrs)
- COV-605781: P/T Fun with Japanese! Eurythmics & Infant Massage (0-12mth)
- COV-605912: Axe Capoeira - Mini Kids (4-7yrs)
- COV-606296: Art Adventure (3-5yrs)
- COV-606532: Rubik's Cubes for Beginners (8-14yrs) - Set 1
- COV-606538: Rubik's Cubes for Beginners (8-14yrs) - Set 2

### Fields Not Verified

Due to Playwright browser failure, the following could NOT be verified on the live page:
- Exact prices (cost field)
- Exact start/end dates
- Exact start/end times
- Current enrollment status (Open/Full/Waitlist)
- Whether programs were added or removed
- Whether URLs point to correct booking pages

### Counts

- **Provider shows:** Unknown (page could not be loaded)
- **Database has:** 116 programs
- **Added this audit:** 0
- **Fixed this audit:** 0

### Recommended Next Steps

1. Fix Playwright/Firefox spawn issue (check: `C:\Users\thoma\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe`)
2. Re-run this audit once browser tools are functional
3. Priority verifications needed:
   - All 54 "Open" programs: confirm prices, dates, URLs still accurate
   - 48 "Coming Soon" (wecca-*) programs: check if now live on ActiveNet
   - Duplicate ACT-* and COV-* IDs for same programs (ACT-599208/COV-599208 etc.)
