# Verification Log — City of Vancouver - Coal Harbour Community Centre

**Audited:** 2026-04-06
**Queue entry:** Rank 200
**Source URLs verified (browser navigation):**
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/599208` (Starfish W1 — ages, times, registration date)
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/599220` (Stingray W1 — ages, times, confirmed formula)
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/612888` (Amusement Parks — age, times, barcode formula confirmed)
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607837` (Architecture — ages, times confirmed)
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607844` (Frozen Ballet — ages 3-5, times 9:15-10:30 AM, formula confirmed)
**DB count before audit:** 16,266 programs
**DB count after audit:** 16,266 (0 added, corrections only)

---

## Summary

104 Coal Harbour entries were in the DB across multiple ID prefixes (numeric IDs 1426-1429, COV-*, wecca-ch-*). A systematic URL error was discovered: all 48 `wecca-ch-*` entries use the internal program **barcode** (the `#XXXXXX` number shown on program detail pages) as the `registrationUrl` ID rather than the actual URL ID.

**Formula confirmed on 5 independent programs:**
```
correct_URL_ID = internal_barcode - 2922
```
(e.g., Amusement Parks: barcode #615810 → URL /detail/612888 = 615810 - 2922 ✓)

As a result, 33 non-duplicate wecca-ch-* entries were linking parents to completely wrong programs (a Starfish entry linked to "Chair Yoga at Kerrisdale," etc.). All URLs corrected.

Additionally, 15 wecca-ch-* entries were identified as duplicates of COV-* or numeric entries and deactivated.

---

## Duplicate Analysis

| wecca-ch-* entry | Duplicate of | Action |
|-----------------|-------------|--------|
| wecca-ch-starfish-w1 through w6 | COV-599208, 599212-599216 | confirmed2026=false |
| wecca-ch-aftercare-w1 through w5 | COV-599230-599234 | confirmed2026=false |
| wecca-ch-amusement-parks | ID 1426 | confirmed2026=false |
| wecca-ch-architecture | ID 1427 | confirmed2026=false |
| wecca-ch-cartooning | ID 1428 | confirmed2026=false |
| wecca-ch-dream-house | ID 1429 | confirmed2026=false |

The wecca-ch-* duplicates had wrong URLs (internal barcodes) while the kept entries (COV-* and numeric IDs) have correct URL IDs confirmed by browser navigation.

---

## URL Corrections Applied (33 entries)

All wecca-ch-* non-duplicate entries corrected using formula `barcode - 2922`:

| Entry | Old URL (internal barcode) | Correct URL ID |
|-------|--------------------------|----------------|
| wecca-ch-starfish-w7 | /detail/602139 | /detail/599217 |
| wecca-ch-starfish-w8 | /detail/602140 | /detail/599218 |
| wecca-ch-starfish-w9 | /detail/602141 | /detail/599219 |
| wecca-ch-stingray-w1 through w9 | /detail/602142-602150 | /detail/599220-599228 |
| wecca-ch-aftercare-w6 through w9 | /detail/602157-602160 | /detail/599235-599238 |
| wecca-ch-fairytale-remix | /detail/615381 | /detail/612459 |
| wecca-ch-frozen-ballet | /detail/610766 | /detail/607844 |
| wecca-ch-mini-hiphop | /detail/615382 | /detail/612460 |
| wecca-ch-under-sea | /detail/610768 | /detail/607846 |
| wecca-ch-superhero | /detail/610770 | /detail/607848 |
| wecca-ch-kpop | /detail/615383 | /detail/612461 |
| wecca-ch-lego-film-w1 | /detail/600234 | /detail/597312 |
| wecca-ch-lego-film-w2 | /detail/600237 | /detail/597315 |
| wecca-ch-tot-soccer-w1 through w4 | /detail/610368/369/371/365 | /detail/607446/447/449/443 |
| wecca-ch-soccer-w1 through w4 | /detail/610372/383/384/373 | /detail/607450/461/462/451 |
| wecca-ch-fairy-gnomes | /detail/614466 | /detail/611544 |

---

## Other Corrections

| Field | Old | New | IDs |
|-------|-----|-----|-----|
| ageMax | 9 | 8 | COV-599208, 599212-599216 (Starfish "less than 9 yrs") |
| ageMax | 13 | 12 | COV-599230-599234 (After Care "6-12 yrs") |
| registrationDate | — | 2026-04-08 | COV-599208, 599212-599216, 599230-599234 |
| enrollmentStatus | Open | Coming Soon | COV-599208, 599212-599216, 599230-599234 |
| cost | null | 40/50 | COV-599230 ($40, 4-day week), COV-599231-234 ($50) |

---

## Program Schedule Confirmed

All programs: Summer 2026, registration opened Apr 8, 2026 at 7:00 PM.

**Day Camps (Full Day, 9:00 AM - 3:30 PM):**
- Day Camp Starfish (6-8yrs): Weeks 1-9 (Jun 29 - Aug 28) — COV-599208, 599212-216 + wecca-ch-starfish-w7/8/9
- Day Camp Stingray (9-12yrs): Weeks 1-9 — wecca-ch-stingray-w1 through w9

**After Care (3:30 PM - 5:30 PM):**
- Weeks 1-5: COV-599230-599234; Weeks 6-9: wecca-ch-aftercare-w6/7/8/9

**Specialty Camps (9:15 AM - 3:00/3:15 PM):**
- ID 1426: Amusement Parks Camp (6-11yr) Jul 6-10
- ID 1427: Architecture Around the World (7-12yr) Aug 24-28
- ID 1428: Cartooning & Illustration (6-12yr) Jul 13-17
- ID 1429: Dream House (7-12yr) Aug 17-21
- wecca-ch-fairy-gnomes: Fairy and Gnomes Houses (5-10yr) Jul 20-24

**Dance Camps (half-day sessions):**
- wecca-ch-frozen-ballet: Frozen Ballet (3-5yr) Aug 10-14, 9:15-10:30 AM
- wecca-ch-fairytale-remix: Fairytale Remix Dance (4-6yr) Jul 27-31, 9:15-10:30 AM
- wecca-ch-mini-hiphop: Mini Hip Hop Playground (4-6yr) Jul 27-31, 10:45 AM-12 PM
- wecca-ch-under-sea: Under the Sea Dance Quest (4-6yr) Aug 10-14, 10:45 AM-12 PM
- wecca-ch-superhero: Superhero Training Academy (5-8yr) Aug 10-14, 12:30-3 PM
- wecca-ch-kpop: K-Pop Demon Hunters (6-12yr) Jul 27-31, 12:30-3 PM

**Activity Camps:**
- wecca-ch-lego-film-w1/w2: LEGO Stopmotion Animation (7-12yr) Jun 29-Jul 3, Aug 4-7
- wecca-ch-tot-soccer-w1/w2/w3/w4: Outdoor Tot Soccer (4-6yr) 2:15-3:30 PM
- wecca-ch-soccer-w1/w2/w3/w4: Outdoor Soccer (7-12yr) 3:45-5:45 PM

---

## Notes

- Coal Harbour CC: 480 Broughton St, Vancouver (Coal Harbour neighbourhood)
- Late pickup fee: $1/minute after program end
- Refund policy: 5 business days prior, $5 admin fee per program
- All programs open for registration as of Apr 8, 2026 at 7:00 PM
