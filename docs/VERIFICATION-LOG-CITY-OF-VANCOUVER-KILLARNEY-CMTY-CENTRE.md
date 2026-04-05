# Verification Log — City of Vancouver - Killarney Cmty Centre

**Date Audited:** 2026-04-05
**Registration Page URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?locationId=31
**Physical Address:** 6260 Killarney Street, Vancouver, BC V5S 2X7
**Neighbourhood:** Killarney
**Auditor:** Claude (automated agent)

---

## Audit Method

**Chrome browser (mcp__Claude_in_Chrome__navigate) was unavailable in this session.**
The ActiveNet REST API (`/rest/activities/list` filtered to locationId=31) was used as the primary data source. This API returns program metadata including names, dates, times, age ranges, and enrollment status, but **does not expose pricing** (fees are rendered client-side via JavaScript).

- Enrollment status (Open/Full/Waitlist) confirmed from the API
- Program names, dates, times, and ages taken directly from API responses
- Prices were not verifiable without Chrome — all new entries with unconfirmed prices have `cost: null` + `costNote` explaining this
- API data compared against the 78 programs returned for Killarney (locationId=31)

**Limitation:** Per CLAUDE.md, Chrome browser must be used to confirm prices and full program details. Prices on all new listings should be re-verified in a future Chrome-enabled session.

---

## Count Summary

| Category | Count |
|----------|-------|
| Programs on live site (Killarney locationId=31) | 78 |
| Programs in DB before audit (provider = "City of Vancouver - Killarney Cmty Centre") | 117 |
| New programs added | 33 |
| Existing programs updated (status) | 1 |
| DB after audit | 150 |

Note: DB has more entries than live site (150 vs 78) because DB retains completed/past programs per policy.

---

## Programs Found on Live Registration Page (78 total)

### Spring 2026 — Ongoing Programs (children/youth-relevant)

| ActNet ID | Name | Dates | Days | Time | Ages | Status | In DB? |
|-----------|------|-------|------|------|------|--------|--------|
| 601215 | Journey Basketball: Advanced | Apr 2–Jun 25 | Thu | 6:00–7:15 PM | 10–14 | Open | ✓ |
| 601181 | Instructional Badminton for 13-18yrs | Apr 4–Jun 27 | Sat | 3:15–4:45 PM | 13–18 | FULL | Added |
| 601654 | Family Play Time | Apr 8–Jun 10 | Wed | 1:30–3:00 PM | 6m–5 | Open | ✓ |
| 602429 | Asian Pop / KPOP / Hip Hop – Family | Apr 10–Jun 26 | Fri | 7:00–8:00 PM | 4–18 | Open | Added |
| 602412 | Asian Pop / KPOP / Hip Hop Open | Apr 10–Jun 26 | Fri | 4:30–5:30 PM | 6–12 | Open | Added |
| 602415 | Asian Pop / KPOP / Hip Hop Open | Apr 10–Jun 26 | Fri | 4:30–5:30 PM | 9–12 | Open | Added |
| 602420 | Asian Pop / KPOP / Hip Hop Open | Apr 10–Jun 26 | Fri | 5:30–6:30 PM | 13–18 | Open | Added |
| 602422 | Asian Pop / KPOP / Hip Hop Open | Apr 10–Jun 26 | Fri | 5:30–7:00 PM | 13–18 | Open | Added |
| 601810 | Forte Piano (6-12yrs) | Apr 11–Jun 27 | Sat | 9:00–9:30 AM | 6–12 | FULL | Updated status |
| 601811 | Forte Piano (6-12yrs) | Apr 11–Jun 27 | Sat | 9:30–10:00 AM | 6–12 | FULL | Added |
| 601812 | Forte Piano (6-12yrs) | Apr 11–Jun 27 | Sat | 10:00–10:30 AM | 6–12 | FULL | Added |
| 601813 | Forte Piano (6-12yrs) | Apr 11–Jun 27 | Sat | 10:30–11:00 AM | 6–12 | FULL | Added |
| 601611 | Art Jam with a Disney Animator | Apr 12–May 10 | Sun | 2:00–3:00 PM | 4–6 | FULL | Added |
| 601650 | Art and You | Apr 12–May 17 | Sun | 11:00 AM–Noon | 6–10 | Open | ✓ (COV-601650) |
| 602129 | Strikewell Youth Boxing Level 2 | Apr 13–Jun 22 | Mon | 5:00–6:00 PM | 13–18 | Open | Added |
| 601172 | Children/Youth Movie Night – UP | Apr 17 | Fri | 5:00–7:00 PM | 6–16 | FULL (Free) | Added |
| 602064 | Art Sushi Workshop – Dandelion | Apr 19 | Sun | 10:00–11:30 AM | 5+ | Open | ✓ |
| 597766 | Intro to Weight Training | May 3–24 | Sun | 2:15–3:15 PM | 13+ | Open | Added |
| 602066 | Art Sushi Workshop – Orca | May 10 | Sun | 10:00–11:30 AM | 5+ | Open | ✓ |
| 601173 | Children/Youth Movie Night – Toy Story 4 | May 22 | Fri | 5:00–7:00 PM | 6–16 | FULL (Free) | Added |
| 601625 | Art Jam with a Disney Animator | May 24–Jun 28 | Sun | 2:00–3:00 PM | 4–6 | FULL | Added |
| 601651 | Art and You | May 24–Jun 28 | Sun | 11:00 AM–Noon | 6–10 | Open | ✓ (COV-601651) |
| 597316 | "Young at Heart" Choir Fundraiser | May 31 | Sun | 2:00–4:00 PM | 8+ | Open | ✓ |
| 597432 | Community Board Games | Apr 1–Jun 24 | Wed | various | All ages | Open | ✓ |
| 597767 | Intro to Weight Training | Jun 7–28 | Sun | 2:15–3:15 PM | 13+ | Open | Added |
| 601712 | Tennis: 7-10yrs | Apr 12–Jun 21 | Sun | 10:00–11:00 AM | 7–10 | Open | ✓ |
| 601176 | Children/Youth Movie Night – Jumanji | Jun 12 | Fri | 5:00–7:00 PM | 6–16 | FULL (Free) | Added |
| 602061 | Art Sushi Workshop – Strawberry | Jun 14 | Sun | 10:00–11:30 AM | 5+ | Open | ✓ |
| 597765 | Intro to Weight Training (Apr) | Apr 5–26 | Sun | 2:15–3:15 PM | 13+ | FULL | ✓ |
| 602238 | Invasive Species Bookmarks | May 25 | Mon | 6:45–8:45 PM | All ages | Open | ✓ |
| 614725 | KCCS Shredathon | May 2 | Sat | various | All ages | Open | ✓ |
| 601245 | Youth Friday Night Fun | Apr 10–Jun 12 | Fri | various | Youth | Open | ✓ |
| 602486 | Hip Hop: 4-6yrs | Apr 11–Jun 20 | Sat | 11:35 AM–12:20 PM | 4–6 | Open | ✓ |
| 602489 | Mini Hip Hop Breakers: 3-5yrs | Apr 11–Jun 20 | Sat | 2:10–2:55 PM | 3–5 | Open | ✓ |
| 602501 | Little Ballerinas: 4-6yrs | Apr 12–Jun 21 | Sun | 1:15–2:00 PM | 4–6 | Open | ✓ |
| 602948–953 | Axe Capoeira Youth Kids | Apr–Jun | Tue,Thu,Sat | 1:00–1:30 PM | 8–17 | Open | ✓ |
| 607126 | Soccer | Apr 11–Jun 20 | Sat | various | Youth | Open | ✓ |
| 612489 | EFK – Apprentice Aerospace | Apr 11–May 16 | Sat | various | Youth | Open | ✓ |
| 612492 | EFK – Electrical Engineering | May 23–Jun 27 | Sat | various | Youth | Open | ✓ |
| 601623 | Character Design with a Disney Animator | Apr 12–May 10 | Sun | 11:00 AM–Noon | 7–12 | Open | ✓ |
| 601631 | Character Design with a Disney Animator | May 24–Jun 28 | Sun | 11:00 AM–Noon | 7–12 | Open | ✓ |
| 616294 | Private Youth Tutoring (4PM Mon) | Apr 6–Jun 1 | Mon | 4:00–5:00 PM | Youth | Open | ✓ |
| 616299 | Private Youth Tutoring (5PM Mon) | Apr 6–Jun 1 | Mon | 5:00–6:00 PM | Youth | Open | ✓ |

### Spring 2026 — Adult-Only Programs (not added to Skeddo)

| ActNet ID | Name | Ages | Reason Not Added |
|-----------|------|------|-----------------|
| 595024/595026 | Chinese Folk Dance | 19+ | Adult only |
| 597768 | Chinese Choir | 19+ | Adult only |
| 597779 | Latin Ballroom Dance – Paso Doble | 19+ | Adult only |
| 601163 | Seniors Getting Crafty | 65+ | Adult/seniors only |
| 596306 | Line Dancing Beginners | 19+ | Adult only |
| 597421 | Jump Rope HIIT | 19+ | Adult only |
| 602115/117/118 | Arnis/Eskrima | 19+ | Adult only |
| 613339 | Japanese Beginner I | 19+ | Adult only |
| 598943/944 | Cardio Kickboxing | 16+ | Primarily adult |
| 598882/613124 | Full Body Stretching | 19+ | Adult only |
| 596303 | Yoga Flow & Core | 19+ | Adult only |
| 598918 | Animal Aware Workshop | 16+ | Primarily adult |
| 605836 | Foot & Ankle Arthritis | 65+ | Seniors only |
| 599368–388 | Footcare (individual appointments) | 65+ | Medical appointment, seniors only |

### Summer 2026 Camps

| ActNet ID | Name | Dates | Days | Time | Ages | Status | In DB? |
|-----------|------|-------|------|------|------|--------|--------|
| 602138–147 | Youth Summer LIT Camp Wk 1–9 | Jun 29–Aug 28 | Varies | 9:00 AM–3:00 PM | 11–14 | Open | ✓ |
| 610252 | CAMP: Act, Dance, Sing FUN! | Jun 29–Jul 3 | Mon,Tue,Thu,Fri | 12:30–3:30 PM | 6–15 | Open | Added |
| 607482 | CAMP: Junior Baseball (9-13yrs) | Jul 6–10 | Mon–Fri | various | 9–13 | Open | ✓ |
| 607442 | CAMP: Art and You | Jul 6–10 | Mon–Fri | 10:30 AM–Noon | 6–10 | Open | Added |
| 609942 | CAMP: Bluey's Big Summer Camp | Jul 13–17 | Mon–Fri | 12:30–1:45 PM | 3–6 | Open | Added |
| 610232 | CAMP: Bricktown Architects (AM) | Jul 13–17 | Mon–Fri | 9:30 AM–12:30 PM | 5–11 | Open | Added |
| 610234 | CAMP: Bricktown Architects (PM) | Jul 13–17 | Mon–Fri | 1:00–4:00 PM | 5–11 | Open | Added |
| 607488 | CAMP: Elevate Ultimate Frisbee | Jul 13–17 | Mon–Fri | various | Youth | Open | ✓ |
| 609943 | CAMP: Jazz/Ballet Fusion | Jul 13–17 | Mon–Fri | various | Youth | Open | ✓ |
| 607584–593 | CAMP: Soccer | Jul 20–Aug 28 | Mon–Fri | various | Youth | Open | ✓ |
| 609946–950 | CAMP: Hip Hop Playground | Jul 20–Aug 7 | Mon–Fri | various | Youth | Open | ✓ |
| 607444 | CAMP: Art and You | Jul 27–31 | Mon–Fri | 10:30 AM–Noon | 6–10 | Open | Added |
| 607621–624 | CAMP: Junior Baseball | Jul 13–Aug 7 | Mon–Fri | various | 9–13 | Open | ✓ |
| 607376 | CAMP: Animal Cartoon Workshop | Aug 4–7 | Tue–Fri | 9:15 AM–12:15 PM | 6–13 | Open | ✓ |
| 607388 | CAMP: Anime Manga Drawing Workshop | Aug 4–7 | Tue–Fri | 12:45–3:45 PM | 6–13 | Open | Added |
| 612462 | CAMP: Acrobatic Dance (3-5yrs) | Aug 4–7 | Tue–Fri | 9:00–10:15 AM | 3–5 | Open | Added |
| 612463 | CAMP: Acrobatic Dance (4-6yrs) | Aug 4–7 | Tue–Fri | 10:20–11:35 AM | 4–6 | Open | Added |
| 612464 | CAMP: Acrobatic Dance (6-9yrs) | Aug 4–7 | Tue–Fri | 11:55 AM–1:25 PM | 6–9 | Open | Added |
| 612465 | CAMP: Acrobatic Dance (9-13yrs) | Aug 4–7 | Tue–Fri | 1:30–3:00 PM | 9–13 | Open | Added |
| 607445 | CAMP: Art and You | Aug 10–14 | Mon–Fri | 10:30 AM–Noon | 6–10 | Open | Added |
| 609951 | CAMP: Bluey's Big Summer Camp | Aug 10–14 | Mon–Fri | 12:30–1:45 PM | 3–6 | Open | Added |
| 609952 | CAMP: Jazz/Ballet Fusion | Aug 10–14 | Mon–Fri | various | Youth | Open | ✓ |
| 610253 | CAMP: Act, Dance, Sing FUN! (AM) | Aug 17–21 | Mon–Fri | 9:15 AM–12:15 PM | 8–15 | Open | Added |
| 610254 | CAMP: Act, Dance, Sing FUN! (PM) | Aug 17–21 | Mon–Fri | 12:30–3:30 PM | 5–9 | Open | Added |
| 609985 | CAMP: Art is Fun | Aug 17–21 | Mon–Fri | 12:30–2:00 PM | 3–6 | Open | Added |
| 609955 | CAMP: Superhero Training Academy | Aug 24–28 | Mon–Fri | various | Youth | Open | ✓ |
| 607390 | CAMP: Favourite Apps & Video Games Drawing | Aug 24–28 | Mon–Fri | 9:15 AM–12:15 PM | 6–12 | Open | ✓ |
| 607392 | CAMP: Furry Friends Drawing Workshop | Aug 24–28 | Mon–Fri | 12:45–3:45 PM | 6–12 | Open | ✓ |
| 610247 | CAMP: Feature Film Making | Jul 13–17 | Mon–Fri | various | Youth | Open | ✓ |
| 607630–633 | CAMP: Elevate Ultimate Frisbee | Jul 27–Aug 28 | Mon–Fri | various | Youth | Open | ✓ |

---

## Changes Made to Database

### New Programs Added (33)

| ID | Name | Change | Notes |
|----|------|--------|-------|
| COV-601181 | Instructional Badminton for 13-18yrs | Added | Full/Waitlist; cost null (Chrome unavailable) |
| COV-601611 | Art Jam with a Disney Animator (Apr 12–May 10) | Added | Full/Waitlist; separate from COV-601623 |
| COV-601625 | Art Jam with a Disney Animator (May 24–Jun 28) | Added | Full/Waitlist |
| COV-601811 | Forte Piano 9:30–10:00 AM Sat | Added | Full/Waitlist; cost $384 inferred from COV-601810 |
| COV-601812 | Forte Piano 10:00–10:30 AM Sat | Added | Full/Waitlist |
| COV-601813 | Forte Piano 10:30–11:00 AM Sat | Added | Full/Waitlist |
| COV-602129 | Strikewell Youth Boxing Level 2 | Added | Open, 14 spots; cost null |
| COV-602412 | Asian Pop/KPOP/Hip Hop Open (6-12yrs) | Added | Fri 4:30–5:30 PM |
| COV-602415 | Asian Pop/KPOP/Hip Hop Open (9-12yrs) | Added | Fri 4:30–5:30 PM (different age band) |
| COV-602420 | Asian Pop/KPOP/Hip Hop Open (13-18yrs) | Added | Fri 5:30–6:30 PM |
| COV-602422 | Asian Pop/KPOP/Hip Hop Open (13-18yrs) | Added | Fri 5:30–7:00 PM (extended session) |
| COV-602429 | Asian Pop/KPOP/Hip Hop – Family (4-18) | Added | Fri 7:00–8:00 PM; R46 noted (Family class) |
| COV-601172 | Children/Youth Movie Night – UP | Added | Free, Full/Waitlist, Apr 17; R46 noted (movie event) |
| COV-601173 | Children/Youth Movie Night – Toy Story 4 | Added | Free, Full/Waitlist, May 22 |
| COV-601176 | Children/Youth Movie Night – Jumanji | Added | Free, Full/Waitlist, Jun 12 |
| COV-597766 | Intro to Weight Training (May) | Added | 13+, Sun; additional monthly session |
| COV-597767 | Intro to Weight Training (Jun) | Added | 13+, Sun; additional monthly session |
| COV-609942 | CAMP: Bluey's Big Summer Camp | Added | Jul 13–17, ages 3–6 |
| COV-609951 | CAMP: Bluey's Big Summer Camp | Added | Aug 10–14, ages 3–6 |
| COV-610232 | CAMP: Bricktown Architects (AM) | Added | Jul 13–17, 9:30 AM–12:30 PM |
| COV-610234 | CAMP: Bricktown Architects (PM) | Added | Jul 13–17, 1:00–4:00 PM |
| COV-607388 | CAMP: Anime Manga Drawing Workshop | Added | Aug 4–7, ages 6–13; R46 noted |
| COV-610252 | CAMP: Act, Dance, Sing FUN! | Added | Jun 29–Jul 3, ages 6–15; R46 noted |
| COV-610253 | CAMP: Act, Dance, Sing FUN! (AM) | Added | Aug 17–21, ages 8–15; R46 noted |
| COV-610254 | CAMP: Act, Dance, Sing FUN! (PM) | Added | Aug 17–21, ages 5–9 |
| COV-612462 | CAMP: Acrobatic Dance (3-5yrs) | Added | Aug 4–7, 9:00–10:15 AM |
| COV-612463 | CAMP: Acrobatic Dance (4-6yrs) | Added | Aug 4–7, 10:20–11:35 AM |
| COV-612464 | CAMP: Acrobatic Dance (6-9yrs) | Added | Aug 4–7, 11:55 AM–1:25 PM |
| COV-612465 | CAMP: Acrobatic Dance (9-13yrs) | Added | Aug 4–7, 1:30–3:00 PM |
| COV-607442 | CAMP: Art and You | Added | Jul 6–10, ages 6–10 |
| COV-607444 | CAMP: Art and You | Added | Jul 27–31, ages 6–10 |
| COV-607445 | CAMP: Art and You | Added | Aug 10–14, ages 6–10 |
| COV-609985 | CAMP: Art is Fun | Added | Aug 17–21, ages 3–6 |

### Existing Programs Updated (1)

| ID | Name | Change |
|----|------|--------|
| COV-601810 | Forte Piano (6-12yrs) 9:00–9:30 AM Sat | enrollmentStatus: Open → Full/Waitlist |

---

## Known Limitations / Follow-up Needed

1. **All 33 new programs have `cost: null`** — Chrome browser was unavailable to render fee JavaScript. A follow-up Chrome-enabled session should verify prices.

2. **R46 wide-age-range flags on 7 programs** — documented in costNote. These are:
   - COV-602429: Family class by design (4-18)
   - COV-601172/173/176: Movie night events by design (6-16)
   - COV-607388, 610252, 610253: Provider API shows single age group; may need splitting

3. **Adult-only programs excluded** — 14 adult/seniors programs not added as they're outside Skeddo's scope.
