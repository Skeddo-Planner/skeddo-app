# Verification Log — City of Vancouver - False Creek Community Centre

**Audited:** 2026-04-06
**URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=43&min_age=0&max_age=17&activity_keyword=camp&viewMode=list
**center_id:** 43 (confirmed via Where filter)
**Live camp count:** 37 programs matching "camp" keyword (ages 0–17)
**DB count before audit:** 164 programs (mix of fccc-*, COV-*, ACT-*, numeric legacy IDs)
**DB count after audit:** 15,830 (−14 birthday party removals, 0 added, 33 URL fixes)

---

## Summary

False Creek Community Centre has a comprehensive set of summer programs already in the DB from prior audits. No missing summer camp programs were found.

**Two classes of issues fixed:**
1. **33 fccc-* registrationUrls** used ActiveNet display IDs instead of URL IDs. Navigating to a display-ID URL loads a completely unrelated program (e.g., `/detail/611028` showed "Little Ballerinas at Hastings" instead of "Summer Trekkers W2"). Fixed by applying the dual-ID formula: URL ID = display ID − 2922.
2. **14 birthday party / venue rental entries** removed per project policy (no birthday party programs in DB).

**Registration for all new programs:** April 8, 2026 at 7:00 PM

**Dual-ID formula confirmed for center_id=43:**
- Fun Explorers W1 display #605531 → URL 602609 ✓ (verified at detail/602609)
- Karate Girlz W1 display #616815 → URL 613893 ✓ (verified at detail/613893)
- Before & After Care W2 COV-607992 URL 607992 → display 607992+2922=610914 ✓ (confirmed live)

---

## Programs Already in DB (not added)

All 37 live "camp" programs at False Creek were already in the DB:

| Category | Live Count | DB Coverage |
|----------|-----------|-------------|
| Byte Camp (Intro, 3D Animation, Python) | 3 | COV-603654, 603655, 603656 ✓ |
| Combo Trekkers W1, W10 | 2 | fccc-trekkers-w1, COV-607979 ✓ |
| False Creek Fun Explorers W1–W7 | 7 | fccc-fun-explorers-w1 through w7 ✓ |
| False Creek Youth Adventures W1–W7 | 7 | fccc-youth-adv-w1 through w7 ✓ |
| Dance camps (Frozen Ballet ×2, Hip Hop, Superhero) | 4 | COV-603705, 603706, 603710, 603756 ✓ |
| Karate Girlz W1–W2 | 2 | fccc-karate-girlz-w1, w2 ✓ |
| Outdoor Tennis Camp (4 age groups × 3 rounds) | 12 | Legacy IDs 1493–1504 ✓ |

**From "trekkers" search (26 additional):**

| Category | Live Count | DB Coverage |
|----------|-----------|-------------|
| Summer Trekkers W2–W9 | 8 | fccc-trekkers-w2 through w9 ✓ |
| Little Trekkers W2–W9 | 8 | fccc-little-trekkers-w2 through w9 ✓ |
| Before & After Care Trekkers W2–W9 | 8 | COV-607992 through COV-608070 ✓ |
| Combo Trekkers W1, W10 | 2 | (same as above) |

---

## Issues Fixed

### Fix 1: fccc-* registrationUrl Broken URLs (33 entries)

All 33 `fccc-*` entries used ActiveNet display IDs in their registrationUrls with the `?onlineSiteId=0&activity_select_param=2` query string. Navigating to a display-ID URL loads a wrong, unrelated program.

**Verified broken:** `/detail/611028?...activity_select_param=2` → loaded "Little Ballerinas - 11:15am at Hastings"
**Verified correct:** `/detail/602609?onlineSiteId=0&from_original_cui=true` → loaded "False Creek Fun Explorers Camp - Week 1"

Fixed by applying `urlId = displayId - 2922` for all fccc-* entries:

| ID | Display ID | URL ID (fixed) |
|----|-----------|----------------|
| fccc-fun-explorers-w1 | 605531 | 602609 |
| fccc-fun-explorers-w2 | 605532 | 602610 |
| fccc-fun-explorers-w3 | 605533 | 602611 |
| fccc-fun-explorers-w4 | 605534 | 602612 |
| fccc-fun-explorers-w5 | 605535 | 602613 |
| fccc-fun-explorers-w6 | 605536 | 602614 |
| fccc-fun-explorers-w7 | 605537 | 602615 |
| fccc-trekkers-w1 | 610888 | 607966 |
| fccc-trekkers-w2 | 611028 | 608106 |
| fccc-trekkers-w3 | 611030 | 608108 |
| fccc-trekkers-w4 | 611031 | 608109 |
| fccc-trekkers-w5 | 611033 | 608111 |
| fccc-trekkers-w6 | 611035 | 608113 |
| fccc-trekkers-w7 | 611037 | 608115 |
| fccc-trekkers-w8 | 611038 | 608116 |
| fccc-trekkers-w9 | 611039 | 608117 |
| fccc-youth-adv-w1 | 607356 | 604434 |
| fccc-youth-adv-w2 | 607357 | 604435 |
| fccc-youth-adv-w3 | 607358 | 604436 |
| fccc-youth-adv-w4 | 607359 | 604437 |
| fccc-youth-adv-w5 | 607360 | 604438 |
| fccc-youth-adv-w6 | 607361 | 604439 |
| fccc-youth-adv-w7 | 607362 | 604440 |
| fccc-karate-girlz-w1 | 616815 | 613893 |
| fccc-karate-girlz-w2 | 616816 | 613894 |
| fccc-little-trekkers-w2 | 611016 | 608094 |
| fccc-little-trekkers-w3 | 611017 | 608095 |
| fccc-little-trekkers-w4 | 611018 | 608096 |
| fccc-little-trekkers-w5 | 611022 | 608100 |
| fccc-little-trekkers-w6 | 611023 | 608101 |
| fccc-little-trekkers-w7 | 611024 | 608102 |
| fccc-little-trekkers-w8 | 611025 | 608103 |
| fccc-little-trekkers-w9 | 611026 | 608104 |

### Fix 2: Birthday Party / Venue Rental Entries Removed (14 entries)

| ID | Name |
|----|------|
| COV-593046 | Birthday Parties |
| COV-593057 | Birthday Parties |
| COV-616677 | Craft Birthday Parties (Ages 9-13) |
| COV-616678 | Craft Birthday Parties (Ages 9-13) |
| COV-616679 | Craft Birthday Parties (Ages 9-13) |
| COV-616680 | Craft Birthday Parties (Ages 9-13) |
| COV-616681 | Craft Birthday Parties (Ages 9-13) |
| COV-616682 | Craft Birthday Parties (Ages 9-13) |
| COV-616683 | Craft Birthday Parties (Ages 9-13) |
| COV-616684 | Craft Birthday Parties (Ages 9-13) |
| COV-616685 | Craft Birthday Parties (Ages 9-13) |
| COV-616686 | Craft Birthday Parties (Ages 9-13) |
| COV-616687 | Craft Birthday Parties (Ages 9-13) |
| COV-616688 | Craft Birthday Parties (Ages 9-13) |

---

## Legacy Duplicate Entries (noted, not removed)

These legacy numeric IDs are duplicates of COV-* entries (same registrationUrl):
- ID 1487 = COV-603654 (Byte Camp Intro to Coding)
- ID 1488 = COV-603656 (Byte Camp Python Coding Level 1)
- IDs 1489–1492 = COV-603705, 603706, 603710, 603756 (dance camps)
- IDs 1493–1504 = Outdoor Tennis Camps × 12 (1493 also duplicated by COV-603364)

Per Rule 31, these are not removed — they are flagged here for future cleanup.

---

## Notes

- center_id=43 confirmed for False Creek Community Centre
- No missing summer camp programs found
- All fccc-* entries were sourced from the 2026 Spring & Summer Recreation Guide PDF (before the Chrome-only audit rule was established); data fields (cost, times, ages) appear accurate
- Legacy numeric IDs 1487–1504 are known duplicates; no action taken per Rule 31
- BC Day (Aug 3): W6 weeks (Trekkers, Little Trekkers, Before & After Care W6) are 4-day with reduced pricing — verified in DB
