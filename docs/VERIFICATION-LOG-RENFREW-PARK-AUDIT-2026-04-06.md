# Verification Log — City of Vancouver - Renfrew Park Community Centre

**Audited:** 2026-04-06
**Queue entry:** Rank 103 (labeled "Renfrew Park Pool" — actual center: Renfrew Park CC, center_ids=46)
**Search URLs used:**
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=renfrew+camp&min_age=0&max_age=17&viewMode=list`
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=summer+adventures&min_age=0&max_age=17&viewMode=list`
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=falaise+camp&min_age=0&max_age=17&viewMode=list`
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=falaise+fun+finders&min_age=0&max_age=17&viewMode=list`
**Address:** 2929 East 22nd Avenue, Vancouver, BC (Renfrew-Collingwood)
**DB count before audit:** 16,000 programs
**DB count after audit:** 16,022 (+22 added)

---

## Summary

Renfrew Park CC runs three day camp program families through summer 2026, all operated out of
or affiliated with the Renfrew Park Community Centre and Falaise Hall (3434 Falaise Avenue).

Of 25 total summer day camp programs, only 3 were in the DB (Falaise Fun Finders Day Camp Wk 1-3).
All 9 Renfrew Summer Adventures weeks, all 8 Supported Day Camp weeks, and Falaise Day Camp Wk 4-8
were entirely missing.

**Programs added (22 total):**
- Renfrew Summer Adventures Day Camp: Wk 1-9 (9 programs — all missing)
- Falaise Fun Finders - Supported Day Camp: Wk 1-8 (8 programs — all missing)
- Falaise Fun Finders Day Camp: Wk 4-8 (5 programs — Wk 1-3 already in DB as COV-601694/695/696)

---

## Fee Verification (via REST estimateprice API)

`https://anc.ca.apm.activecommunities.com/vancouver/rest/activity/detail/estimateprice/{urlId}?locale=en-US`

| Program | 5-day fee | Canada Day 4-day | BC Day 4-day | Verified IDs |
|---------|-----------|-----------------|--------------|--------------|
| Renfrew Summer Adventures | $150 | $120 | $120 | 601677=$120, 601678=$150 |
| Falaise Fun Finders - Supported | $150 | $120 | $120 | 601686=$120, 601691=$120 |
| Falaise Fun Finders Day Camp | $150 | — (Wk 4-8 only) | $120 | 601697=$150, 601699=$120 |

**50% Leisure Access discount available on all programs.**

---

## Renfrew Summer Adventures Day Camp

- Ages: 6–13 (must have completed Kindergarten; single age band — no sub-bands in ActiveNet)
- Times: 9:00 AM – 3:00 PM (6 hrs, Full Day)
- Location: Renfrew Park Community Centre, 2929 East 22nd Avenue

| ID | Week | Dates | Days | Cost | Status |
|----|------|-------|------|------|--------|
| COV-601677 | Wk 1 | Jun 29–Jul 3 | Mon, Tue, Thu, Fri (Canada Day) | $120 | **Added** |
| COV-601678 | Wk 2 | Jul 6–10 | Mon–Fri | $150 | **Added** |
| COV-601679 | Wk 3 | Jul 13–17 | Mon–Fri | $150 | **Added** |
| COV-601680 | Wk 4 | Jul 20–24 | Mon–Fri | $150 | **Added** |
| COV-601681 | Wk 5 | Jul 27–31 | Mon–Fri | $150 | **Added** |
| COV-601682 | Wk 6 | Aug 4–7 (BC Day) | Tue, Wed, Thu, Fri | $120 | **Added** |
| COV-601683 | Wk 7 | Aug 10–14 | Mon–Fri | $150 | **Added** |
| COV-601684 | Wk 8 | Aug 17–21 | Mon–Fri | $150 | **Added** |
| COV-602958 | Wk 9 | Aug 24–28 | Mon–Fri | $150 | **Added** |

Display IDs: 604599–604606, 605880 → URL IDs: 601677–601684, 602958

---

## Falaise Fun Finders - Supported Day Camp

- Ages: 6–13 (single age band — no sub-bands in ActiveNet)
- Times: 9:00 AM – 3:00 PM (6 hrs, Full Day)
- Location: Falaise Hall, 3434 Falaise Avenue, Vancouver
- **Special requirement:** Registration requires pre-approval and an Adapted Recreation Pass
  from Access Services (access.services@vancouver.ca or 604-718-8270).
  Shared support model — staff float between registered campers.
- Weeks run Jun 29–Aug 21 (8 weeks; no Wk 9 Aug 24-28 for Supported camp)

| ID | Week | Dates | Days | Cost | Status |
|----|------|-------|------|------|--------|
| COV-601686 | Wk 1 | Jun 29–Jul 3 | Mon, Tue, Thu, Fri (Canada Day) | $120 | **Added** |
| COV-601687 | Wk 2 | Jul 6–10 | Mon–Fri | $150 | **Added** |
| COV-601688 | Wk 3 | Jul 13–17 | Mon–Fri | $150 | **Added** |
| COV-601689 | Wk 4 | Jul 20–24 | Mon–Fri | $150 | **Added** |
| COV-601690 | Wk 5 | Jul 27–31 | Mon–Fri | $150 | **Added** |
| COV-601691 | Wk 6 | Aug 4–7 (BC Day) | Tue, Wed, Thu, Fri | $120 | **Added** |
| COV-601692 | Wk 7 | Aug 10–14 | Mon–Fri | $150 | **Added** |
| COV-601693 | Wk 8 | Aug 17–21 | Mon–Fri | $150 | **Added** |

Display IDs: 604608–604615 → URL IDs: 601686–601693

---

## Falaise Fun Finders Day Camp

- Ages: 6–13 (single age band — no sub-bands in ActiveNet)
- Times: 9:00 AM – 3:00 PM (6 hrs, Full Day)
- Location: Falaise Hall, 3434 Falaise Avenue, Vancouver

| ID | Week | Dates | Days | Cost | Status |
|----|------|-------|------|------|--------|
| COV-601694 | Wk 1 | Jun 29–Jul 3 | Mon, Tue, Thu, Fri (Canada Day) | $120 | Already in DB |
| COV-601695 | Wk 2 | Jul 6–10 | Mon–Fri | $150 | Already in DB |
| COV-601696 | Wk 3 | Jul 13–17 | Mon–Fri | $150 | Already in DB |
| COV-601697 | Wk 4 | Jul 20–24 | Mon–Fri | $150 | **Added** |
| COV-601698 | Wk 5 | Jul 27–31 | Mon–Fri | $150 | **Added** |
| COV-601699 | Wk 6 | Aug 4–7 (BC Day) | Tue, Wed, Thu, Fri | $120 | **Added** |
| COV-601700 | Wk 7 | Aug 10–14 | Mon–Fri | $150 | **Added** |
| COV-601701 | Wk 8 | Aug 17–21 | Mon–Fri | $150 | **Added** |

Display IDs: 604619–604623 → URL IDs: 601697–601701

---

## Gap Analysis

| Category | Live | In DB before | Added |
|----------|------|-------------|-------|
| Renfrew Summer Adventures (9 wks) | 9 | 0 | 9 |
| Falaise Fun Finders - Supported (8 wks) | 8 | 0 | 8 |
| Falaise Fun Finders Day Camp (8 wks) | 8 | 3 (Wk 1-3) | 5 |
| **Total** | **25** | **3** | **22** |

---

## Notes

- Vancouver display ID − 2922 = URL ID (confirmed for all Renfrew/Falaise programs)
- Canada Day (Jul 1, Wed): Wk 1 runs Mon/Tue/Thu/Fri (4-day), cost = $120
- BC Day (Aug 3, Mon): Wk 6 runs Tue–Fri (4-day), cost = $120
- Queue entry mislabeled: Rank 103 says "Renfrew Park Pool" but center_ids=46 = Renfrew Park CC
- Supported Day Camp is a special needs program — Adapted Recreation Pass required before online
  registration. Included in DB so parents can identify and plan (must call Access Services to enroll)
- Renfrew Summer Adventures runs 9 weeks (Jun 29–Aug 28); Falaise programs run 8 weeks (Jun 29–Aug 21)
- All programs: ageSpanJustified added — verified in ActiveNet as single age band 6-13, no sub-bands
- Registration opens: Apr 8, 2026 at 7:00 PM
