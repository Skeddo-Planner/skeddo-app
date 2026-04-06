# Verification Log — City of Vancouver - Trout Lake Community Centre

**Audited:** 2026-04-06
**Queue entry:** Rank 117 (center_ids=98)
**Search URLs used:**
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=day+camp&center_ids=98&min_age=0&max_age=17&viewMode=list` (103 in DB before audit)
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=camp&center_ids=98&min_age=0&max_age=17&viewMode=list` (135 live results)
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=dance+camp&center_ids=98&min_age=0&max_age=17&viewMode=list`
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=petit+architect&center_ids=98&min_age=0&max_age=17&viewMode=list`
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=byte+camp&center_ids=98&min_age=0&max_age=17&viewMode=list`
**Address:** 3360 Victoria Dr, Vancouver, BC V5N 4M1 (Kensington-Cedar Cottage)
**DB count before audit:** 16,029 programs
**DB count after audit:** 16,043 (+14 added)

---

## Summary

Trout Lake CC runs a wide variety of summer 2026 day camps including City of Vancouver core programs,
specialty camps from Petit Architect, Byte Camp, local dance operators, Brick Animation, and more.

Of 135 live camp listings (all center_ids=98), 103 were already in the DB. Systematic keyword searches
identified 14 genuinely missing programs across 5 program families.

**Programs added (14):**
- Petit Architect camps (Happy City, Dream House, Beautiful Boutiques): 3 programs
- Byte Camp (3D Animation, Claymation-Cancelled): 2 programs
- Dance camps (Dance Extreme, Frozen Dance!, Frozen Ballet ×2, Superhero, Swiftie): 6 programs
- Brick Animation Camp ×2: 2 programs
- Bluey's Big Summer Camp: 1 program

---

## Fee Verification (via REST estimateprice API)

`https://anc.ca.apm.activecommunities.com/vancouver/rest/activity/detail/estimateprice/{urlId}?locale=en-US`

| Program | Fee | Notes | Verified |
|---------|-----|-------|---------|
| Happy City Camp with Petit Architect | $450 | Full week | 606204=$450 ✓ |
| Dream House Camp with Petit Architect | $490 | Full week | 606206=$490 ✓ |
| Beautiful Boutiques Camp with Petit Architect | $450 | Full week | 606208=$450 ✓ |
| Byte Camp - 3D Animation | $355 | 4-day (BC Day) | 606214=$355 ✓ |
| Byte Camp - Claymation Movie Production | $395 | Cancelled | 606213=$395 ✓ |
| Dance Extreme Camp | $220 | 4-day (Canada Day) | 606395=$220 ✓ |
| Frozen Dance Camp! | $110 | Half-day activity | 606370=$110 ✓ |
| Frozen Ballet Dance Camp (Sess 1) | $109 | Activity 9:15-10:30 AM | 606385=$109 ✓ |
| Frozen Ballet Dance Camp (Sess 2) | $109 | Activity 10:45 AM-Noon | 606386=$109 ✓ |
| Superhero Training Academy Dance Camp | $220 | Half-day PM | 606406=$220 ✓ |
| Swiftie Dance Camp | $220 | Half-day PM | 606387=$220 ✓ |
| Brick Animation Camp (Wk 1) | $175 | Half-day AM | 607857=$175 ✓ |
| Brick Animation Camp (Wk 2) | $175 | Half-day AM | 607859=$175 ✓ |
| Bluey's Big Summer Camp | $109 | Activity 9:15-10:30 AM | 606399=$109 ✓ |

---

## Programs Added

### Petit Architect Camps (Full Day, Ages 7–12)

| ID | Name | Dates | Cost |
|----|------|-------|------|
| COV-606204 | Happy City Camp with Petit Architect | Jul 6–10 | $450 |
| COV-606206 | Dream House Camp with Petit Architect | Jul 13–17 | $490 |
| COV-606208 | Beautiful Boutiques Camp with Petit Architect | Jul 27–31 | $450 |

Times: 9:15–3:00 PM (606204, 606208), 9:30–3:15 PM (606206)

### Byte Camp (Full Day)

| ID | Name | Ages | Dates | Days | Cost | Status |
|----|------|------|-------|------|------|--------|
| COV-606214 | Byte Camp - 3D Animation | 11–14 | Aug 4–7 | Tue–Fri (BC Day) | $355 | Open |
| COV-606213 | Byte Camp - Claymation Movie Production | 9–12 | Aug 24–28 | Mon–Fri | $395 | Cancelled |

### Dance Camps

| ID | Name | Ages | Dates | Time | Cost |
|----|------|------|-------|------|------|
| COV-606395 | Dance Extreme Camp | 6–12 | Jun 29–Jul 3 (4-day) | 12:30–3:30 PM | $220 |
| COV-606370 | Frozen Dance Camp! | 4–6 | Jul 27–31 | 12:30–1:45 PM | $110 |
| COV-606385 | Frozen Ballet Dance Camp (Session 1) | 3–5 | Aug 24–28 | 9:15–10:30 AM | $109 |
| COV-606386 | Frozen Ballet Dance Camp (Session 2) | 3–5 | Aug 24–28 | 10:45 AM–Noon | $109 |
| COV-606406 | Superhero Training Academy Dance Camp | 6–12 | Aug 17–21 | 12:30–3:30 PM | $220 |
| COV-606387 | Swiftie Dance Camp | 6–12 | Aug 24–28 | 12:30–3:30 PM | $220 |

### Brick Animation Camp (Half Day AM, Ages 6–12)

| ID | Dates | Cost |
|----|-------|------|
| COV-607857 | Jul 20–24 | $175 |
| COV-607859 | Aug 10–14 | $175 |

Times: 10:00 AM – 12:00 PM

### Bluey's Big Summer Camp (Activity, Ages 3–5)

| ID | Dates | Time | Cost |
|----|-------|------|------|
| COV-606399 | Aug 17–21 | 9:15–10:30 AM | $109 |

---

## Gap Analysis

| Category | Live | In DB before | Added |
|----------|------|-------------|-------|
| Petit Architect camps | 3 | 0 | 3 |
| Byte Camp | 2 | 0 | 2 |
| Dance camps | 6 | 0 | 6 |
| Brick Animation Camp | 2 | 0 | 2 |
| Bluey's Big Summer Camp | 1 | 0 | 1 |
| All other programs | 121 | 103 | 0 |
| **Total** | **135** | **103** | **14** |

---

## Notes

- Vancouver display ID − 2922 = URL ID (confirmed for all Trout Lake programs)
- COV-606213 (Claymation) marked Cancelled — verified in ActiveNet as cancelled listing
- COV-606214 (3D Animation) is 4-day due to BC Day Aug 3 (Mon) holiday
- COV-606395 (Dance Extreme) is 4-day due to Canada Day Jul 1 (Wed) holiday
- Frozen Ballet has two concurrent sessions same week/dates, different times — two separate listings
- Registration opens: Apr 8, 2026 at 7:00 PM
- All prices verified via REST estimateprice API
