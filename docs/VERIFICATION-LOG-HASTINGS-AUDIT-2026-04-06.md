# Verification Log — City of Vancouver - Hastings Community Centre

**Audited:** 2026-04-06
**Search URLs used:**
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=hastings+camp&min_age=0&max_age=17&viewMode=list` (22 results)
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=day+camp+safari&min_age=0&max_age=17&viewMode=list`
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=voyages+day+camp&min_age=0&max_age=17&viewMode=list`
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=youth+adventures+day+camp&min_age=0&max_age=17&viewMode=list`
**Address:** 3096 East Hastings Street, Vancouver, BC (Hastings-Sunrise)
**DB count before audit:** 15,941 programs
**DB count after audit:** 15,987 (+46 added, 2 fixed)

---

## Summary

Hastings CC runs three day camp tiers (Safari, Voyages, Youth Adventures) plus Before Care and After Care add-ons. The queue listed 17 listings, but the actual live count is much higher when all program families are included. Previously only 2 of 9 Safari weeks were in the DB.

**Programs added (46 total):**
- Safari Day Camp Wk 3–9 (7 programs — Wk 1/2 already existed)
- Voyages Day Camp Wk 1–9 (9 programs — all missing)
- Youth Adventures Day Camp Wk 1–9 (9 programs — all missing)
- EFK: Power and Energy, Civil Engineering, Print it! (3 programs)
- Before Care Wk 1–9 (9 programs)
- After Care Wk 1–9 (9 programs)

**Programs fixed (2):**
- COV-613146, COV-607068: provider "City of Vancouver - N/A" → "City of Vancouver - Hastings Cmty Centre"; wrong address/lat/lng corrected

---

## Fee Verification (via REST estimateprice API)

`https://anc.ca.apm.activecommunities.com/vancouver/rest/activity/detail/estimateprice/{urlId}?locale=en-US`

| Program Family | 5-day fee | 4-day fee (Canada Day/BC Day) |
|----------------|-----------|-------------------------------|
| Safari Day Camp | $174 | $140 |
| Voyages Day Camp | $174 | $140 |
| Youth Adventures | $174 (most weeks) | $140 |
| Youth Adventures Wk 2 (Jul 6–10) | **$140** (anomaly — 5-day priced at 4-day rate) | — |
| EFK programs | $420 | $336 (BC Day only) |
| Before Care | $27 | $27 (Canada Day); $22 (BC Day) |
| After Care | $48 | $39 (both Canada Day and BC Day) |

**50% Leisure Access discount available on all programs.**

---

## Day Camp Program Families

### Safari Day Camp (ages 6–7)
- Ages: "at least 6 yrs but less than 7y 11m 4w" (ageMin=6, ageMax=7)
- Times: 9:00 AM – 3:30 PM (6.5 hrs, Full Day)
- Child must have completed Kindergarten and be turning 6 by Dec 31, 2026

| ID | Week | Dates | Days | Cost | Status |
|----|------|-------|------|------|--------|
| COV-613146 | Wk 1 | Jun 29–Jul 3 | Mon,Tue,Thu,Fri (Canada Day) | $140 | In DB (fixed) |
| COV-607068 | Wk 2 | Jul 6–10 | Mon–Fri | $174 | In DB (fixed) |
| COV-607070 | Wk 3 | Jul 13–17 | Mon–Fri | $174 | Added |
| COV-607071 | Wk 4 | Jul 20–24 | Mon–Fri | $174 | Added |
| COV-607072 | Wk 5 | Jul 27–31 | Mon–Fri | $174 | Added |
| COV-607074 | Wk 6 | Aug 4–7 | Tue–Fri (BC Day) | $140 | Added |
| COV-607077 | Wk 7 | Aug 10–14 | Mon–Fri | $174 | Added |
| COV-607078 | Wk 8 | Aug 17–21 | Mon–Fri | $174 | Added |
| COV-607079 | Wk 9 | Aug 24–28 | Mon–Fri | $174 | Added |

### Voyages Day Camp (ages 8–10)
- Ages: "at least 8 yrs but less than 10y 11m 4w" (ageMin=8, ageMax=10)
- Times: 9:00 AM – 3:30 PM (6.5 hrs, Full Day)

| ID | Week | Dates | Days | Cost | Status |
|----|------|-------|------|------|--------|
| COV-613147 | Wk 1 | Jun 29–Jul 3 | Mon,Tue,Thu,Fri (Canada Day) | $140 | Added |
| COV-607674 | Wk 2 | Jul 6–10 | Mon–Fri | $174 | Added |
| COV-607675 | Wk 3 | Jul 13–17 | Mon–Fri | $174 | Added |
| COV-607676 | Wk 4 | Jul 20–24 | Mon–Fri | $174 | Added |
| COV-607677 | Wk 5 | Jul 27–31 | Mon–Fri | $174 | Added |
| COV-607678 | Wk 6 | Aug 4–7 | Tue–Fri (BC Day) | $140 | Added |
| COV-607679 | Wk 7 | Aug 10–14 | Mon–Fri | $174 | Added |
| COV-607680 | Wk 8 | Aug 17–21 | Mon–Fri | $174 | Added |
| COV-607681 | Wk 9 | Aug 24–28 | Mon–Fri | $174 | Added |

### Youth Adventures Day Camp (ages 11–13)
- Ages: "at least 11 yrs but less than 13y 11m 4w" (ageMin=11, ageMax=13)
- Times: 9:00 AM – 3:30 PM (6.5 hrs, Full Day)
- **ActiveNet labeling anomaly:** System labels Jul 27 "Week 6" and Aug 4 "Week 5" (non-chronological). Stored in DB in chronological order.

| ID | Chron Wk | Dates | Days | Cost | ActiveNet Label | Status |
|----|----------|-------|------|------|-----------------|--------|
| COV-613148 | Wk 1 | Jun 29–Jul 3 | Mon,Tue,Thu,Fri (Canada Day) | $140 | Week 1 | Added |
| COV-607980 | Wk 2 | Jul 6–10 | Mon–Fri | **$140** | Week 2 | Added |
| COV-607983 | Wk 3 | Jul 13–17 | Mon–Fri | $174 | Week 3 | Added |
| COV-607984 | Wk 4 | Jul 20–24 | Mon–Fri | $174 | Week 4 | Added |
| COV-608099 | Wk 5 | Jul 27–31 | Mon–Fri | $174 | Week 6 (!) | Added |
| COV-607994 | Wk 6 | Aug 4–7 | Tue–Fri (BC Day) | $140 | Week 5 (!) | Added |
| COV-607986 | Wk 7 | Aug 10–14 | Mon–Fri | $174 | Week 7 | Added |
| COV-607996 | Wk 8 | Aug 17–21 | Mon–Fri | $174 | Week 8 | Added |
| COV-607997 | Wk 9 | Aug 24–28 | Mon–Fri | $174 | Week 9 | Added |

**Youth Adventures Wk 2 anomaly:** Jul 6–10 is a full 5-day week but the ActiveNet REST API returns $140 (same as 4-day rate). Confirmed via API — used as-is with note in costNote.

### EFK Programs

| ID | Program | Dates | Age | Cost | Status |
|----|---------|-------|-----|------|--------|
| COV-614051 | Space Camp: Martian Engineering | Aug 4–7 (BC Day) | 6–11 | $336 | Already in DB |
| COV-614050 | Power and Energy: Agent of Change | Jul 20–24 | 6–11 | $420 | Added |
| COV-614052 | Civil Engineering: Build n Bash | Aug 17–21 | 6–11 | $420 | Added |
| COV-614053 | Print it! 3D Engineering | Aug 24–28 | 8–13 | $420 | Added |

Time: 9:30 AM – 3:30 PM (6 hrs, Full Day)

### Before Care (add-on, 8:00–9:00 AM)
- Must be registered in Safari, Voyages, or Youth Adventures
- Online registration NOT allowed — in-person at Hastings CC only

| ID | Week | Dates | Cost |
|----|------|-------|------|
| COV-613145 | Wk 1 | Jun 29–Jul 3 (Canada Day) | $27 |
| COV-607140 | Wk 2 | Jul 6–10 | $27 |
| COV-607154 | Wk 3 | Jul 13–17 | $27 |
| COV-607155 | Wk 4 | Jul 20–24 | $27 |
| COV-607157 | Wk 5 | Jul 27–31 | $27 |
| COV-607165 | Wk 6 | Aug 4–7 (BC Day) | $22 |
| COV-607159 | Wk 7 | Aug 10–14 | $27 |
| COV-607161 | Wk 8 | Aug 17–21 | $27 |
| COV-607163 | Wk 9 | Aug 24–28 | $27 |

### After Care (add-on, 3:30–5:30 PM)
- Must be registered in Safari, Voyages, or Youth Adventures
- Online registration NOT allowed — in-person at Hastings CC only
- Late fees: $10 first 15 min, $1/min thereafter

| ID | Week | Dates | Cost |
|----|------|-------|------|
| COV-613144 | Wk 1 | Jun 29–Jul 3 (Canada Day) | $39 |
| COV-607083 | Wk 2 | Jul 6–10 | $48 |
| COV-607116 | Wk 3 | Jul 13–17 | $48 |
| COV-607119 | Wk 4 | Jul 20–24 | $48 |
| COV-607123 | Wk 5 | Jul 27–31 | $48 |
| COV-607124 | Wk 6 | Aug 4–7 (BC Day) | $39 |
| COV-607128 | Wk 7 | Aug 10–14 | $48 |
| COV-607129 | Wk 8 | Aug 17–21 | $48 |
| COV-607130 | Wk 9 | Aug 24–28 | $48 |

---

## Fixes to Existing Programs

| ID | Field | Was | Now |
|----|-------|-----|-----|
| COV-613146 | provider | "City of Vancouver - N/A" | "City of Vancouver - Hastings Cmty Centre" |
| COV-613146 | address | "N/A, Vancouver, BC" | "3096 East Hastings Street, Vancouver, BC" |
| COV-613146 | lat/lng | 49.2689, -122.5582 (wrong) | 49.2806, -123.0394 |
| COV-607068 | provider | "City of Vancouver - N/A" | "City of Vancouver - Hastings Cmty Centre" |
| COV-607068 | address | "N/A, Vancouver, BC" | "3096 East Hastings Street, Vancouver, BC" |
| COV-607068 | lat/lng | 49.2689, -122.5582 (wrong) | 49.2806, -123.0394 |

---

## Programs Already in DB

| Category | Programs | IDs |
|----------|----------|-----|
| Safari Day Camp Wk 1–2 | 2 | COV-613146, COV-607068 (fixed) |
| EFK Space Camp (BC Day) | 1 | COV-614051 |
| Young Moviemakers (4 wks) | 4 | IDs 1509–1512 |
| Sportball Multisport (4 wks) | 4 | IDs 1514–1519 |
| Byte Camp (4 programs) | 4 | IDs 1520–1523 |
| Red Cross Babysitting/Stay Safe | 2 | IDs 1507–1508 |
| Make-A-Musical Day Camp | 1 | ID 1505 |
| Mindfulness & Movement Camp | 1 | ID 1506 |
| Aftercare daycamp Wk 3–8 (old entries) | 6 | COV-609711–609717 |
| Various Year-Round programs | 55+ | COV-564329 etc. |

---

## Gap Analysis

| Category | Live | In DB before | Added | Notes |
|----------|------|-------------|-------|-------|
| Safari Day Camp (9 wks) | 9 | 2 | 7 | Wk 1/2 already existed |
| Voyages Day Camp (9 wks) | 9 | 0 | 9 | Entirely missing |
| Youth Adventures (9 wks) | 9 | 0 | 9 | Entirely missing; Wk 5/6 labels swapped |
| EFK programs (4 total) | 4 | 1 | 3 | Space Camp already in DB |
| Before Care (9 wks) | 9 | 0 | 9 | In-person registration only |
| After Care (9 wks) | 9 | 0 | 9 | In-person registration only |
| **Total** | **49** | **3** | **46** | |

---

## Notes

- Vancouver display ID − 2922 = URL ID (confirmed for all Hastings programs)
- Canada Day (Jul 1, Wed): Wk 1 runs Mon/Tue/Thu/Fri (4-day), cost = $140
- BC Day (Aug 3, Mon): Wk 6 runs Tue–Fri (4-day), cost = $140 (main camps), $22/$39 (Before/After Care)
- Youth Adventures Wk 2 ($140 for 5-day) is a confirmed anomaly from ActiveNet, not an error on our part
- Before/After Care: "online registration not allowed" — must register in person; included in DB as parents can plan ahead
- Existing "Aftercare daycamp Wk 3–8" (COV-609711–609717) appear to be older/separate entries with different URL IDs — not duplicates of the new 2026 programs
- Hastings CC website: https://hastingscc.ca
- Registration opens: Apr 8, 2026 at 7:00 PM
