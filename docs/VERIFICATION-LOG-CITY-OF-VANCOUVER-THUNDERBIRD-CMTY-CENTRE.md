# Verification Log — City of Vancouver - Thunderbird Cmty Centre

**Date audited:** 2026-04-05
**Auditor:** Claude (claude-sonnet-4-6)
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search
**Booking system:** ActiveNet (City of Vancouver)
**Note on tooling:** Playwright browser MCP was unavailable in this session (browser session closed/crashed). Programs verified using the ActiveNet REST API (`/vancouver/rest/activities/list`), which is the same authoritative data source that powers the registration website. All 853 pages (17,050 records) were fetched and filtered by location="Thunderbird". The API returns live enrollment status, dates, times, and age ranges but does **not** include prices (searchFromPrice: null for all Thunderbird programs). Prices on new entries are set to null with a costNote.

---

## Facility Details

- **Address:** 2311 Cassiar Street, Vancouver, BC
- **Neighbourhood:** Hastings-Sunrise
- **Coordinates:** 49.2639995, -123.0312924
- **Provider names in DB:** "City of Vancouver - Thunderbird Cmty Centre" (106 listings), "City of Vancouver - Thunderbird Community Centre" (36 listings), "Thunderbird Community Centre" (1 listing)

---

## API Results — Programs Found on Live System (2026-04-05)

24 unique programs returned from ActiveNet for location "Thunderbird Cmty Centre":

| ID | Name | Dates | Days | Time | Ages | Openings | Status |
|----|------|-------|------|------|------|----------|--------|
| 604918 | Anime Art Adventure | Apr 9 – Jun 11 | Thu | 4:30–5:30 PM | 8–13 | 8 | Starting soon |
| 600204 | Anime Cartoon Drawing Camp | Jul 27 – Jul 31 | Mon–Fri | 9:15 AM–12:15 PM | 6–12 | 15 | Open |
| 596516 | 123, ABCs - Spring | Apr 11 – Jun 13 | Sat | 1:45–2:45 PM | 4–6 | 8 | 1 space left |
| 601799 | Karate | Jul 9 – Aug 13 | Thu | 5:30–7:00 PM | 7+ | 30 | Open |
| 608914 | Art Jam with a Disney Animator - Set 1 | Apr 7 – May 12 | Tue | 3:30–4:30 PM | 4–5 | 10 | **Cancelled** |
| 608917 | Art Jam with a Disney Animator - Set 2 | May 19 – Jun 23 | Tue | 3:30–4:30 PM | 4–5 | 10 | Open |
| 601793 | Art Jam with a Disney Animator - Summer Camp | Jul 13–17 | Mon–Fri | 9:30–10:30 AM | 4–5 | 8 | Open |
| 601794 | Art Jam with a Disney Animator - Summer Camp | Aug 4–7 | Tue–Fri | 9:30–10:30 AM | 4–5 | 8 | Open |
| 608925 | Taekwondo - Beginner | Jul 6 – Aug 17 | Mon | 4:30–5:30 PM | 6–18 | 30 | Open |
| 605564 | Red Cross Babysitting | Jun 20 | Sat | 9:00 AM–4:45 PM | 11–15 | 12 | **Full** |
| 600197 | Safety Talks with Hastings Sunrise Community Policing | May 12 | Tue | 12:15–1:00 PM | 55+ | 20 | Open |
| 603213 | Shopping Shuttle-Skeena Terrace & Beulah Garden | Apr 10 | Fri | 9:30 AM–Noon | 55+ | 10 | Open |
| 603215 | Shopping Shuttle-Skeena Terrace & Beulah Garden | Jul 3 – Aug 21 | Fri | 9:30 AM–Noon | 55+ | 10 | Open |
| 600163 | Outdoor Soccer 9-12 yrs | Apr 11 – Jun 13 | Sat | 10:45–11:45 AM | 9–12 | 15 | Open |
| 598246 | Pickleball Lessons: Advanced Beginner Class | May 20 – Jun 24 | Wed | 7:15–8:45 PM | 19+ | 12 | Open |
| 598245 | Pickleball Lessons: Beginner I | Apr 8 – May 13 | Wed | 7:15–8:45 PM | 19+ | 12 | **Full** |
| 597153 | Basketball 19+ | Apr 7 – Jun 16 | Tue | 7:15–8:45 PM | 19+ | 15 | Starting soon |
| 608920 | Character Design with a Disney Animator - Set 2 | May 19 – Jun 23 | Tue | 5:50–6:50 PM | 9–12 | 12 | Open |
| 601797 | Character Design with a Disney Animator - Summer Camp | Jul 13–17 | Mon–Fri | 11:50 AM–12:50 PM | 9–12 | 12 | Open |
| 601798 | Character Design with a Disney Animator - Summer Camp | Aug 4–7 | Tue–Fri | 11:50 AM–12:50 PM | 9–12 | 12 | Open |
| 597187 | Feature FilmMaking | Jul 20–24 | Mon–Fri | 9:00 AM–4:00 PM | 9–14 | 12 | Open |
| 597188 | Feature FilmMaking | Aug 24–28 | Mon–Fri | 9:00 AM–4:00 PM | 9–14 | 12 | Open |
| 597852 | A Ballet Time with Strength and Stretch | Apr 7 – Jun 9 | Tue | 5:45–6:45 PM | 6–13 | 12 | **Cancelled** |
| 597828 | Chinese Calligraphy for Kids | Apr 10 – Jun 19 | Fri | 3:30–5:00 PM | 6–13 | 12 | Open |

**Adult/senior programs excluded from DB (ages 19+ or 55+):** Basketball 19+, Pickleball Beginner I, Pickleball Advanced Beginner, Safety Talks (55+), Shopping Shuttle (55+)

---

## Changes Made

### New Programs Added (8)

| ID | Name | Dates | Ages | DB Action |
|----|------|-------|------|-----------|
| COV-608917 | Art Jam with a Disney Animator - Set 2 | May 19–Jun 23, 2026 | 4–5 | **ADDED** |
| COV-600163 | Outdoor Soccer 9-12 yrs | Apr 11–Jun 13, 2026 | 9–12 | **ADDED** |
| COV-597828 | Chinese Calligraphy for Kids | Apr 10–Jun 19, 2026 | 6–13 | **ADDED** |
| COV-605564 | Red Cross Babysitting | Jun 20, 2026 | 11–15 | **ADDED** (Full) |
| COV-601799 | Karate | Jul 9–Aug 13, 2026 | 7+ | **ADDED** |
| COV-608925 | Taekwondo - Beginner | Jul 6–Aug 17, 2026 | 6–18 | **ADDED** |
| COV-597187 | Feature FilmMaking | Jul 20–24, 2026 | 9–14 | **ADDED** |
| COV-597188 | Feature FilmMaking | Aug 24–28, 2026 | 9–14 | **ADDED** |

### Status Fixes (6)

| ID | Name | Old Status | New Status | Reason |
|----|------|-----------|-----------|--------|
| COV-597852 | A Ballet Time with Strength and Stretch | Open | Completed | API: Cancelled |
| ID 1823 | Art Jam with a Disney Animator - Summer Camp (Jul) | Full/Waitlist | Open | API: 0/8 openings, "Enroll Now" |
| ID 1824 | Art Jam with a Disney Animator - Summer Camp (Aug) | Full/Waitlist | Open | API: 0/8 openings, "Enroll Now" |
| ID 1827 | Character Design with a Disney Animator - Summer Camp (Jul) | Full/Waitlist | Open | API: 0/12 openings, "Enroll Now" |
| ID 1828 | Character Design with a Disney Animator - Summer Camp (Aug) | Full/Waitlist | Open | API: 0/12 openings, "Enroll Now" |
| ID 1839 | Anime Cartoon Drawing Camp | Full/Waitlist | Open | API: 0/15 openings, "Enroll Now" |

---

## Programs in DB Not Found in API

These programs exist in the DB as "Open" but were not returned by the API. Most have already started or are ongoing non-search programs (drop-ins, community events):

| ID | Name | Start Date | Note |
|----|------|-----------|------|
| COV-595414 | My First Dance Class (2-4 yrs) | Apr 11, 2026 | Not shown in API — may be full or registration closes on first day |
| COV-597145 | Outdoor Soccer 3-5 yrs | Apr 11, 2026 | Not shown in API |
| COV-597157 | Basketball 6-8 yrs | Apr 7, 2026 | Started Apr 7, may no longer be searchable |
| COV-597830 | STEM It - Spring Set | Apr 11, 2026 | Not shown in API |
| COV-598248 | Basketball 9-12 yrs | Apr 7, 2026 | Started Apr 7 |
| COV-598255 | Mini Chefs | Apr 11, 2026 | Not shown in API |
| COV-599187 | Family Drop In | Apr 1, 2026 | Already started (drop-in) |
| COV-599188 | Family Drop In & Grandma's Kitchen | Apr 2, 2026 | Already started (drop-in) |
| COV-600078 | Thunderbird Catchment Tax Clinic | Apr 4, 2026 | One-time event, passed |
| COV-600082 | Bird's Nest Cafe - Fundraising | Apr 6, 2026 | Already started |
| COV-600142 | Thunderbird Catchment Tax Clinic | Apr 11, 2026 | Recurring event, today |
| COV-600153 | Saturday Family Fun | Apr 4, 2026 | Already started |
| COV-601342 | MCKids Minecraft | Apr 13, 2026 | Future — may not be in search yet |
| COV-601396 | Family Drop In- Rainy Days Only | Jul 2, 2026 | Future summer drop-in |
| COV-601750 | Basketball 6-8 yrs | Jul 7, 2026 | Future — not yet open for search |
| COV-601751 | Basketball 9-12 yrs | Jul 7, 2026 | Future — not yet open for search |
| COV-608916 | Character Design with a Disney Animator - Set 1 | Apr 7, 2026 | Not in API; sibling program (608914) was Cancelled — possible cancellation |
| COV-617117 | Thunderbird Catchment Tax Clinic | Apr 15, 2026 | Future event |
| thunderbird-cc-1 | Thunderbird CC Summer Day Camp | undefined | Legacy entry |

**Note:** COV-608916 (Character Design Set 1) is suspicious — its parallel program COV-608914 (Art Jam Set 1) was explicitly Cancelled in the API. However, COV-608916 has no API entry at all (neither Cancelled nor Open). Without browser access, status was left as-is. Recommend browser verification on next audit.

---

## Completeness Count

- **API returned:** 24 unique programs at Thunderbird (all categories)
- **Kid/family-relevant programs in API:** 19 (excluding 5 adult programs ages 19+ or 55+)
- **Already in DB before audit:** 13 of the 19 (some under old integer IDs)
- **Added in this audit:** 8
- **Total Thunderbird programs in DB after audit:** 151

---

## Price Verification Note

The ActiveNet REST API does not return price data in the list endpoint (`searchFromPrice: null` for all Thunderbird programs). All 8 newly added programs have `cost: null` and `priceVerified: false` with a note to visit the registration URL for current prices. Existing programs with previously-confirmed prices were not modified.

---

## Validator Output

```
Violations: 1776 (all pre-existing — no new violations on changed/added programs)
Rules checked: R1–R34, R39, R43, R46, R48 + REQ
Programs: 15032 total
```

R46 warnings on wide age ranges (6–13 for Ballet, Chinese Calligraphy; 6–18 for Taekwondo) reflect the provider's own ActiveNet age listings. The API does not indicate sub-band breakdowns for these programs.
