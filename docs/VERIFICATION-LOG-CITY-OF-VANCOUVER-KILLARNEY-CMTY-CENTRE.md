# Verification Log — City of Vancouver - Killarney Cmty Centre

**Date Audited:** 2026-04-05 (Session 1 + Session 2)
**Registration Page URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?locationId=31
**Physical Address:** 6260 Killarney Street, Vancouver, BC V5S 2X7
**Neighbourhood:** Killarney
**Auditor:** Claude (automated agent, two sessions on 2026-04-05)

---

## Audit Method

**Chrome browser (Playwright) was unavailable in both sessions.**
The ActiveNet REST API (`/rest/activities/list` filtered to locationId=31) and a full CoV scrape (`scripts/cov-activenet-data.json` from 2026-03-31) were used as the primary data sources. These APIs return program metadata including names, dates, times, age ranges, and enrollment status, but **do not expose pricing** (fees are rendered client-side via JavaScript).

- Enrollment status (Open/Full/Waitlist) confirmed from the API
- Program names, dates, times, and ages taken directly from API responses
- Prices were not verifiable without Chrome — all new entries with unconfirmed prices have `cost: null` + `costNote` explaining this
- API data cross-referenced against live Killarney program page

**Limitation:** Per CLAUDE.md, Chrome browser must be used to confirm prices and full program details. Prices on all new listings should be re-verified in a future Chrome-enabled session.

---

## Count Summary

| Category | Count |
|----------|-------|
| Programs in DB before Session 1 (provider = "City of Vancouver - Killarney Cmty Centre") | 117 |
| Programs added in Session 1 (Spring/Summer camps, dance, arts) | 33 |
| Programs added in Session 2 (ongoing programs, recurring classes, birthday parties, summer day camps) | 72 |
| Programs updated (status changes) | 1 |
| **DB after audit** | **222** |

Note: DB intentionally retains completed/past programs per R31/R47 policy.

---

## Session 1 Programs Added (33)

Spring 2026 live-page programs and Summer camps discovered on first pass:

| ID | Name | Notes |
|----|------|-------|
| COV-601181 | Instructional Badminton for 13-18yrs | Full/Waitlist; cost null |
| COV-601611 | Art Jam with a Disney Animator (Apr–May) | Full/Waitlist |
| COV-601625 | Art Jam with a Disney Animator (May–Jun) | Full/Waitlist |
| COV-601811 | Forte Piano 9:30–10:00 AM Sat | Full/Waitlist |
| COV-601812 | Forte Piano 10:00–10:30 AM Sat | Full/Waitlist |
| COV-601813 | Forte Piano 10:30–11:00 AM Sat | Full/Waitlist |
| COV-602129 | Strikewell Youth Boxing Level 2 | 14 spots |
| COV-602412 | Asian Pop/KPOP/Hip Hop Open (6-12yrs) | Fri 4:30–5:30 PM |
| COV-602415 | Asian Pop/KPOP/Hip Hop Open (9-12yrs) | Fri 4:30–5:30 PM (different age band) |
| COV-602420 | Asian Pop/KPOP/Hip Hop Open (13-18yrs) | Fri 5:30–6:30 PM |
| COV-602422 | Asian Pop/KPOP/Hip Hop Open (13-18yrs) | Fri 5:30–7:00 PM (extended session) |
| COV-602429 | Asian Pop/KPOP/Hip Hop – Family (4-18) | Fri 7:00–8:00 PM |
| COV-601172 | Children/Youth Movie Night – UP | Free, Apr 17 |
| COV-601173 | Children/Youth Movie Night – Toy Story 4 | Free, May 22 |
| COV-601176 | Children/Youth Movie Night – Jumanji | Free, Jun 12 |
| COV-597766 | Intro to Weight Training (May) | 13+ |
| COV-597767 | Intro to Weight Training (Jun) | 13+ |
| COV-609942 | CAMP: Bluey's Big Summer Camp (Jul) | Ages 3–6 |
| COV-609951 | CAMP: Bluey's Big Summer Camp (Aug) | Ages 3–6 |
| COV-610232 | CAMP: Bricktown Architects (AM) | 9:30 AM–12:30 PM |
| COV-610234 | CAMP: Bricktown Architects (PM) | 1:00–4:00 PM |
| COV-607388 | CAMP: Anime Manga Drawing Workshop | Aug 4–7, ages 6–13 |
| COV-610252 | CAMP: Act, Dance, Sing FUN! | Jun 29–Jul 3, ages 6–15 |
| COV-610253 | CAMP: Act, Dance, Sing FUN! (AM) | Aug 17–21, ages 8–15 |
| COV-610254 | CAMP: Act, Dance, Sing FUN! (PM) | Aug 17–21, ages 5–9 |
| COV-612462 | CAMP: Acrobatic Dance (3-5yrs) | Aug 4–7 |
| COV-612463 | CAMP: Acrobatic Dance (4-6yrs) | Aug 4–7 |
| COV-612464 | CAMP: Acrobatic Dance (6-9yrs) | Aug 4–7 |
| COV-612465 | CAMP: Acrobatic Dance (9-13yrs) | Aug 4–7 |
| COV-607442 | CAMP: Art and You (Jul 6–10) | Ages 6–10 |
| COV-607444 | CAMP: Art and You (Jul 27–31) | Ages 6–10 |
| COV-607445 | CAMP: Art and You (Aug 10–14) | Ages 6–10 |
| COV-609985 | CAMP: Art is Fun | Aug 17–21, ages 3–6 |

---

## Session 2 Programs Added (72)

Ongoing weekly classes and additional programs sourced from full-CoV API scrape (March 31 data) and fresh April 5 API:

### Summer Fun Day Camps (9)
| ID | Name | Notes |
|----|------|-------|
| COV-602052 | Killarney Summer Fun Day Camp Wk 1 | Jun 29–Jul 3, ages 6–12 |
| COV-602089 | Killarney Summer Fun Day Camp Wk 2 | Jul 6–10, ages 6–12 |
| COV-602091 | Killarney Summer Fun Day Camp Wk 3 | Jul 13–17, ages 6–12 |
| COV-602097 | Killarney Summer Fun Day Camp Wk 4 | Jul 20–24, ages 6–12 |
| COV-602099 | Killarney Summer Fun Day Camp Wk 5 | Jul 27–31, ages 6–12 |
| COV-602100 | Killarney Summer Fun Day Camp Wk 6 | Aug 3–7, ages 6–12 |
| COV-602102 | Killarney Summer Fun Day Camp Wk 7 | Aug 10–14, ages 6–12 |
| COV-602106 | Killarney Summer Fun Day Camp Wk 8 | Aug 17–21, ages 6–12 |
| COV-602110 | Killarney Summer Fun Day Camp Wk 9 | Aug 24–28, ages 6–12 |

### Dance Camps (2)
| ID | Name | Notes |
|----|------|-------|
| COV-609940 | CAMP: Frozen Ballet Dance (Jul) | Ages 3–5, PM half-day |
| COV-609953 | CAMP: Frozen Ballet Dance (Aug) | Ages 3–5, PM half-day |

### Community Events (3)
| ID | Name | Notes |
|----|------|-------|
| COV-602122 | Guitar Circle (drop-in) | Age 16+, free, Apr 11 |
| COV-582744 | Boccia drop-in | Age 16+, $2, Mar 28 — Completed |
| COV-598918 | Animal Aware Workshop | Jun 18 |

### Youth Programming (10)
| ID | Name | Notes |
|----|------|-------|
| COV-602359 | Red Cross Babysitting Course | Ages 11–15 |
| COV-602360 | Red Cross Babysitting Course | Ages 11–15 |
| COV-602361 | Red Cross Babysitting Course | Ages 11–15 |
| COV-616304 | Private Youth Tutoring – Tuesdays 4PM | Ages 11–17 |
| COV-616307 | Private Youth Tutoring – Tuesdays 5PM | Ages 11–17 |
| COV-616311 | Private Youth Tutoring – Thursdays 4PM | Ages 11–17 |
| COV-616312 | Private Youth Tutoring – Thursdays 5PM | Ages 11–17 |
| COV-613438 | Level Up Mondays – Cup Noodle Night | Ages 12–18 |
| COV-617731 | Level Up Mondays – Game Night | Ages 12–18 |
| COV-617732 | Level Up Mondays – Make Your Own Keychains | Ages 12–18 |
| COV-617733 | Level Up Mondays – Mango Bango | Ages 12–18 |
| COV-601224 | Night Hoops | Ages 13–18, weekly |

### Sports & Martial Arts (8)
| ID | Name | Notes |
|----|------|-------|
| COV-602438 | Rhythmic Gymnastics | Ages 4–5, weekly |
| COV-602442 | Rhythmic Gymnastics | Ages 6–12, weekly |
| COV-602174 | Taekwondo – Beginner | Ages 6–18, weekly |
| COV-602177 | Taekwondo – Beginner | Ages 6–18, weekly |
| COV-602179 | Taekwondo – Yellow Belt to Green Belt | Ages 6–18, weekly |
| COV-602943 | Axe Capoeira Mini Kids – Apr | Ages 5–7 |
| COV-602942 | Axe Capoeira Mini Kids – May | Ages 5–7 |
| COV-602944 | Axe Capoeira Mini Kids – Jun | Ages 5–7 |
| COV-602946 | Axe Capoeira Super Mini Kids – Apr | Ages 2–4 |
| COV-602945 | Axe Capoeira Super Mini Kids – May | Ages 2–4 |
| COV-602947 | Axe Capoeira Super Mini Kids – Jun | Ages 2–4 |
| COV-602949 | Axe Capoeira Youth Kids Beginners – Apr | Ages 8–17 |
| COV-600395 | Ki Aikido | Age 14+, weekly |

### Dance Classes (9)
| ID | Name | Notes |
|----|------|-------|
| COV-602419 | Active Dance Sing Musical Theatre | Ages 12–14, weekly |
| COV-602505 | Jazz/Ballet Fusion: 6-9yrs | Weekly |
| COV-602493 | Jazz/Ballet: 4-6yrs | Weekly |
| COV-602488 | Hip Hop Breakers: 6-8yrs | Weekly |
| COV-612130 | Hip Hop Dance Class (10-13yrs) | Weekly |
| COV-612131 | Hip Hop Dance Class (13-18yrs) | Weekly |
| COV-602492 | My First Dance Class: 2-4yrs | Weekly |

### Music (12)
| ID | Name | Notes |
|----|------|-------|
| COV-601756 | Guitar/Ukulele private lesson | Age 5+, weekly |
| COV-601758 | Guitar/Ukulele private lesson | Age 5+, weekly |
| COV-601759 | Guitar/Ukulele private lesson | Age 5+, weekly |
| COV-601760 | Guitar/Ukulele private lesson | Age 5+, weekly |
| COV-601761 | Guitar/Ukulele private lesson | Age 5+, weekly |
| COV-601763 | Guitar/Ukulele private lesson | Age 5+, weekly |
| COV-601764 | Guitar/Ukulele private lesson | Age 5+, weekly |
| COV-606830 | Music Together with Karina | Ages 0–5, weekly |
| COV-606832 | Music Together with Karina | Ages 0–5, weekly |
| COV-606833 | Music Together with Karina | Ages 0–5, weekly |
| COV-606834 | Music Together with Karina | Ages 0–5, weekly |
| COV-606868 | Music Together with Karina | Ages 0–5, weekly |

### Birthday Parties & Preschool Programs (13)
| ID | Name | Notes |
|----|------|-------|
| COV-602789 | MINI Play-Gym Express Birthday Party | Ages 0–5, party booking |
| COV-602813 | MINI Play-Gym Express Birthday Party | Ages 0–5 |
| COV-602814 | MINI Play-Gym Express Birthday Party | Ages 0–5 |
| COV-602815 | MINI Play-Gym Express Birthday Party | Ages 0–5 |
| COV-602816 | MINI Play-Gym Express Birthday Party | Ages 0–5 |
| COV-602818 | MINI Play-Gym Express Birthday Party | Ages 0–5 |
| COV-602819 | MINI Play-Gym Express Birthday Party | Ages 0–5 |
| COV-602820 | MINI Play-Gym Express Birthday Party | Ages 0–5 |
| COV-602822 | MINI Play-Gym Express Birthday Party | Ages 0–5 |
| COV-602823 | MINI Play-Gym Express Birthday Party | Ages 0–5 |
| COV-602826 | MINI Play-Gym Express Birthday Party | Ages 0–5 |
| COV-602858 | Licensed Preschool Summer Daycamp (Wk 1) | Ages 3–4, AM half-day |
| COV-602860 | Licensed Preschool Summer Daycamp (Wk 2) | Ages 3–4, AM half-day |

### Community/General (2)
| ID | Name | Notes |
|----|------|-------|
| COV-602845 | Movie in the Park | Outdoor, Aug 22 |

---

## Existing Programs Updated (1)

| ID | Name | Change |
|----|------|--------|
| COV-601810 | Forte Piano (6-12yrs) 9:00–9:30 AM Sat | enrollmentStatus: Open → Full/Waitlist |

---

## Known Limitations / Follow-up Needed

1. **All new programs have `cost: null`** — Chrome browser was unavailable to render fee JavaScript. A follow-up Chrome-enabled session should verify prices on all 105 new entries.

2. **R46 wide-age-range soft warnings on several programs** — These are intentional:
   - Family/drop-in event classes (Asian Pop, Movie Night): wide age range by design
   - Taekwondo and Capoeira Youth: single class covering full 6–18 age range per CoV listing
   - These are soft `warn()` violations only, not blocking hard violations

3. **Adult-only programs excluded** — Programs for 19+ / 65+ not added as outside Skeddo scope.

4. **Prices on recurring/weekly classes** — Guitar/Ukulele, Rhythmic Gymnastics, dance classes, martial arts, etc. all have `cost: null`. Re-audit with Chrome to confirm prices.
