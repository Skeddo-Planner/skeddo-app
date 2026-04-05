# Verification Log — City of Vancouver - Coal Harbour Cmty Centre

**Date Audited:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Registration Page URL:** https://ca.apm.activecommunities.com/vancouver/Home
**Status: BLOCKED — Playwright browser spawn failure**

---

## Audit Status

This audit was **blocked** by a Playwright browser spawn failure (`spawn UNKNOWN`). The Firefox browser process could not be launched, preventing any live page verification. This is the same system resource exhaustion issue that blocked several prior audits (Mount Pleasant, Creekside, Dunbar).

### Error

```
Error: server: spawn UNKNOWN
Call log:
  - <launching> C:\Users\thoma\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe
    -no-remote -headless -profile ... -juggler-pipe about:blank
```

Three consecutive launch attempts were made, all failed with the same error.

---

## Existing Database State (as of 2026-04-05)

**Total Coal Harbour programs in database:** 116

| Status | Count |
|--------|-------|
| Open | 54 |
| Coming Soon | 48 |
| Full/Waitlist | 6 |
| Completed | 8 |

**Provider name variants in database:**
- `City of Vancouver - Coal Harbour Community Centre` (52 programs)
- `City of Vancouver - Coal Harbour Cmty Centre` (52 programs)
- `City of Vancouver — Coal Harbour Community Centre` (12 programs, uses em-dash)

**Categories covered:**
- Arts (19), General (27), Multi-Activity (15), Music (13), Outdoor (18), Sports (13), Performing Arts (2), General/Other (9)

**Program types found:**
- Day Camp Starfish (6-8yrs) — Weeks 1-9
- Day Camp Stingray (9-12yrs) — Weeks 1-9
- Day Camp After Care (6-12yrs) — Weeks 1-9
- Dance camps (Fairytale Remix, Frozen Ballet, Mini Hip Hop, Under the Sea, Superhero, K-Pop)
- LEGO Stopmotion Animation Camp — Weeks 1-2
- Tot Soccer / Soccer camps — Weeks 1-4
- External provider camps (Petit Architect, Cartooning, Amusement Parks)
- Spring Break Day Camp (completed)
- Classes: Jellyfish Playtime, Baby Jellyfish Playtime, Kinder Kids
- Piano (Ami Set 1) — multiple time slots (COV-600335 through COV-600347)
- Aikido (5-8yrs), Aikido (8-15yrs)
- Mini Hip Hop Breakers (3-5yrs)
- Olympic Style TaeKwonDo (4-6, 7-10, 11-16yrs)
- Fun with Japanese!, Axe Capoeira, Art Adventure, Artists/Architects/Engineers
- Rubik's Cubes for Beginners (8-14yrs) — Sets 1 & 2
- Tot Soccer (4-6yrs)
- Art with Acrylic Paint
- Interior Design Fun!
- Natural Dye and Shibori
- Yoga Adventure
- Birthday Party listings

---

## Field-by-Field Verification

**Could not be completed** — Playwright browser failed to launch, so no live page was accessed. All fields remain unverified against the 2026 registration page.

---

## What Needs to Be Done on Next Attempt

1. Navigate to: https://ca.apm.activecommunities.com/vancouver/ActiveNet_3?SPID=17781&lang=en-CA
   (Coal Harbour's specific location page on ActiveNet)
2. Check all program categories, especially:
   - Confirm which "Coming Soon" programs have now opened
   - Verify Summer 2026 camp prices and dates
   - Check for any new programs added
   - Confirm the 9 duplicate ID pairs (e.g., ACT-599208 vs COV-599208 for same program)
3. Verify provider name consistency — standardize to `City of Vancouver - Coal Harbour Cmty Centre`

---

## Known Issues to Resolve

- **Duplicate program IDs:** Several programs appear with both `ACT-` and `COV-` prefixes for the same program (e.g., Day Camp Starfish Week 1 exists as both ACT-599208 and COV-599208). These may need deduplication.
- **Provider name inconsistency:** Three different provider name strings in use. Should be standardized.
- **Em-dash variant:** 12 programs use `—` (em-dash) instead of `-` (hyphen) in provider name.
- **wecca- prefixed Coming Soon programs:** 46 programs with `wecca-ch-*` IDs are all `Coming Soon` — need live page verification to confirm status, dates, and prices.

---

## Count

- Provider shows: **Unknown** (could not access live page)
- Database has: **116 programs**
- Added this session: **0**
- Fixed this session: **0**
