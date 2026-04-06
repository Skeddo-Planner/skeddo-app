# Verification Log — City of Vancouver - Killarney Community Centre

**Audited:** 2026-04-06
**Queue entry:** Rank 132 (center_ids=35)
**Search URLs used:**
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=camp&center_ids=35&min_age=0&max_age=17&viewMode=list` (162 results — virtual DOM renders only 20 at a time)
- Targeted keyword searches: `soccer camp`, `baseball camp`, `sportball`, `EFK`, `Byte Camp`, `drawing camp`, `ninja camp`
**Address:** 6260 Killarney Street, Vancouver, BC V5S 2X4 (Killarney neighbourhood)
**DB count before audit:** 16,043 programs
**DB count after audit:** 16,076 (+33 added, +13 data quality fixes)

---

## Summary

Killarney CC offers 162 live summer camp listings. 129 were already in the DB.
Systematic keyword searches identified 33 genuinely missing programs across 7 program families.
All prices verified via REST estimateprice API before adding.

ActiveNet's virtual renderer only renders 20 of 162 results in the DOM at a time — full list
required targeted category-by-category keyword searches.

**Programs added (33):**
- Soccer Camp Wk2-3 (2 programs)
- Byte Camp 3D Animation + 2D Animation (2 programs)
- Junior Baseball Wk7-9 (3 programs)
- Mini Baseball Wk2-9 (8 programs)
- Sportball Multisport 3-5yr Wk2-9 (8 programs)
- EFK (Engineers for Kids) 7 sessions (7 programs)
- Drawing workshops — Junior Under the Sea, Junior Zoo, Fantasy Forest (3 programs)

**Data quality fixes (13 changes):**
- 9 Killarney Summer Fun Day Camp entries: `priceVerified: false → true`
- 2 Licensed Preschool Summer Daycamp entries: `cost: null → $225.10`, `priceVerified: false → true`

---

## Fee Verification (via REST estimateprice API)

`https://anc.ca.apm.activecommunities.com/vancouver/rest/activity/detail/estimateprice/{urlId}?locale=en-US`

| Program | Fee | Notes | Verified |
|---------|-----|-------|---------|
| Soccer Camp Wk2 | $198 | 5-day full week | 607199=$198 ✓ |
| Soccer Camp Wk3 | $198 | 5-day full week | 607583=$198 ✓ |
| Byte Camp - 3D Animation | $410 | Full day Jul 20-24 | 610213=$410 ✓ |
| Byte Camp - 2D Animation | $410 | Full day Aug 24-28 | 610215=$410 ✓ |
| Junior Baseball Wk7 | $285 | 5-day | 607626=$285 ✓ |
| Junior Baseball Wk8 | $285 | 5-day | 607627=$285 ✓ |
| Junior Baseball Wk9 | $285 | 5-day | 607628=$285 ✓ |
| Mini Baseball Wk2 | $275 | 5-day | 607476=$275 ✓ |
| Mini Baseball Wk3 | $275 | 5-day | 607614=$275 ✓ |
| Mini Baseball Wk4 | $275 | 5-day | 607615=$275 ✓ |
| Mini Baseball Wk5 | $275 | 5-day | 607616=$275 ✓ |
| Mini Baseball Wk6 | $220.60 | 4-day (BC Day) | 607617=$220.60 ✓ |
| Mini Baseball Wk7 | $275 | 5-day | 607618=$275 ✓ |
| Mini Baseball Wk8 | $275 | 5-day | 607619=$275 ✓ |
| Mini Baseball Wk9 | $275 | 5-day | 607620=$275 ✓ |
| Sportball 3-5yr Wk2 | $93 | 5-day half-day | 607226=$93 ✓ |
| Sportball 3-5yr Wk3 | $93 | 5-day | 607608=$93 ✓ |
| Sportball 3-5yr Wk4 | $93 | 5-day | 607609=$93 ✓ |
| Sportball 3-5yr Wk5 | $93 | 5-day | 607610=$93 ✓ |
| Sportball 3-5yr Wk6 | $93 | 4-day (BC Day) | 607601=$93 ✓ |
| Sportball 3-5yr Wk7 | $93 | 5-day | 607611=$93 ✓ |
| Sportball 3-5yr Wk8 | $93 | 5-day | 607612=$93 ✓ |
| Sportball 3-5yr Wk9 | $93 | 5-day | 607613=$93 ✓ |
| EFK Wk1 (Jul 6-10) | $280 | Full day | 612913=$280 ✓ |
| EFK Wk2 (Jul 13-17) | $280 | Full day | 612914=$280 ✓ |
| EFK Wk3 (Jul 20-24) | $280 | Full day | 612915=$280 ✓ |
| EFK Wk5 (Aug 4-7) | $280 | 4-day (BC Day) | 612917=$280 ✓ |
| EFK Wk6 (Aug 10-14) | $384 | Full day — price discrepancy vs Wk1-5 | 612918=$384 ✓ |
| EFK Wk7 (Aug 17-21) | $425 | Full day | 612919=$425 ✓ |
| EFK Wk9 (Aug 24-28) | $425 | Full day | 612921=$425 ✓ |
| Drawing - Junior Under the Sea | $155 | Half-day | 607339=$155 ✓ |
| Drawing - Junior Zoo Animals | $155 | Half-day | 607353=$155 ✓ |
| Drawing - Fantasy Forest | $220 | Full day | 607357=$220 ✓ |

---

## Programs Added

### Soccer Camp (Ages 5-14, Full Day)
Times: 9:00 AM – 4:00 PM

| ID | Week | Dates | Cost |
|----|------|-------|------|
| COV-607199 | Wk2 | Jul 6–10 | $198 |
| COV-607583 | Wk3 | Jul 13–17 | $198 |

Note: Soccer Wk1 already in DB.

### Byte Camp (Full Day, Ages 11-14)
Times: 9:00 AM – 4:00 PM

| ID | Name | Dates | Cost |
|----|------|-------|------|
| COV-610213 | Byte Camp - 3D Animation | Jul 20–24 | $410 |
| COV-610215 | Byte Camp - 2D Animation | Aug 24–28 | $410 |

Note: COV-610214 (Byte Camp Introduction to Coding) already in DB as id=1657 (same registrationUrl).

### Junior Baseball Camp (Ages 9-12, Full Day)
Times: 9:00 AM – 4:00 PM | Cost: $285/week

| ID | Week | Dates |
|----|------|-------|
| COV-607626 | Wk7 | Aug 10–14 |
| COV-607627 | Wk8 | Aug 17–21 |
| COV-607628 | Wk9 | Aug 24–28 |

Note: Junior Baseball Wk1-6 already in DB.

### Mini Baseball Camp (Ages 5-8, Half Day AM)
Times: 9:00 AM – 12:00 PM

| ID | Week | Dates | Days | Cost |
|----|------|-------|------|------|
| COV-607476 | Wk2 | Jul 6–10 | Mon–Fri | $275 |
| COV-607614 | Wk3 | Jul 13–17 | Mon–Fri | $275 |
| COV-607615 | Wk4 | Jul 20–24 | Mon–Fri | $275 |
| COV-607616 | Wk5 | Jul 27–31 | Mon–Fri | $275 |
| COV-607617 | Wk6 | Aug 4–7 | Tue–Fri (BC Day) | $220.60 |
| COV-607618 | Wk7 | Aug 10–14 | Mon–Fri | $275 |
| COV-607619 | Wk8 | Aug 17–21 | Mon–Fri | $275 |
| COV-607620 | Wk9 | Aug 24–28 | Mon–Fri | $275 |

Note: Mini Baseball Wk1 already in DB.

### Sportball Multisport Camp — 3-5yr (Half Day AM)
Times: 9:00 AM – 12:00 PM | Cost: $93/week

| ID | Week | Dates | Days |
|----|------|-------|------|
| COV-607226 | Wk2 | Jul 6–10 | Mon–Fri |
| COV-607608 | Wk3 | Jul 13–17 | Mon–Fri |
| COV-607609 | Wk4 | Jul 20–24 | Mon–Fri |
| COV-607610 | Wk5 | Jul 27–31 | Mon–Fri |
| COV-607601 | Wk6 | Aug 4–7 | Tue–Fri (BC Day) |
| COV-607611 | Wk7 | Aug 10–14 | Mon–Fri |
| COV-607612 | Wk8 | Aug 17–21 | Mon–Fri |
| COV-607613 | Wk9 | Aug 24–28 | Mon–Fri |

Note: Sportball 3-5yr Wk1 already in DB. Sportball 6-9yr Wk1-9 already in DB.
Note: BC Day week (Wk6) priced at $93 (same as 5-day — confirmed via API).

### EFK (Engineers for Kids) (Ages 6-10, Full Day)
Times: 9:00 AM – 4:00 PM

| ID | Week | Dates | Days | Cost |
|----|------|-------|------|------|
| COV-612913 | Wk1 | Jul 6–10 | Mon–Fri | $280 |
| COV-612914 | Wk2 | Jul 13–17 | Mon–Fri | $280 |
| COV-612915 | Wk3 | Jul 20–24 | Mon–Fri | $280 |
| COV-612917 | Wk5 | Aug 4–7 | Tue–Fri (BC Day) | $280 |
| COV-612918 | Wk6 | Aug 10–14 | Mon–Fri | $384 |
| COV-612919 | Wk7 | Aug 17–21 | Mon–Fri | $425 |
| COV-612921 | Wk9 | Aug 24–28 | Mon–Fri | $425 |

Note: COV-612922 (EFK Wk4 Jul 27-31) already in DB.
Note: EFK Wk8 (612920) not found in live results — may be cancelled or not offered.
Price escalation (Wk6 $384, Wk7/9 $425) confirmed via API — matches live page.

### Drawing Workshops (Half Day / Full Day)

| ID | Name | Ages | Dates | Time | Cost |
|----|------|------|-------|------|------|
| COV-607339 | Drawing - Junior Under the Sea | 6-9 | Jul 6–10 | 9:00 AM–12:00 PM | $155 |
| COV-607353 | Drawing - Junior Zoo Animals | 6-9 | Jul 20–24 | 9:00 AM–12:00 PM | $155 |
| COV-607357 | Drawing - Fantasy Forest | 10-14 | Aug 17–21 | 9:00 AM–4:00 PM | $220 |

---

## Data Quality Fixes

### priceVerified corrections (Killarney Summer Fun Day Camp)
9 existing COV- entries had `priceVerified: false` — prices verified via ActiveNet at $198-$252:

COV-602052, COV-602089, COV-602091, COV-602097, COV-602099, COV-602100, COV-602102, COV-602106, COV-602110

### Licensed Preschool Summer Daycamp cost fix
2 existing entries had `cost: null` — prices verified at $225.10/week via ActiveNet:

| ID | Program |
|----|---------|
| COV-602858 | Licensed Preschool Summer Daycamp (session 1) |
| COV-602860 | Licensed Preschool Summer Daycamp (session 2) |

---

## Gap Analysis

| Category | Live | In DB before | Added |
|----------|------|-------------|-------|
| Soccer Camp | 9 | 7 | 2 |
| Byte Camp | 3 | 1 | 2 |
| Junior Baseball | 9 | 6 | 3 |
| Mini Baseball | 9 | 1 | 8 |
| Sportball 3-5yr | 9 | 1 | 8 |
| Sportball 6-9yr | 9 | 9 | 0 |
| EFK | 8 | 1 | 7 |
| Drawing workshops | 3 | 0 | 3 |
| KSFDC + other programs | 113 | 113 | 0 |
| **Total** | **172*** | **139** | **33** |

*ActiveNet keyword search returned 162 on "camp"; additional programs found via targeted searches

---

## Notes

- Vancouver display ID − 2922 = URL ID (confirmed for all Killarney programs)
- ActiveNet virtual DOM: Only 20 of 162 results visible at once; keyword-based category searches required
- COV-610214 (Byte Camp Introduction to Coding) already covered by id=1657 — same registrationUrl confirmed; excluded from additions
- Sportball 3-5yr Wk6 (607601) BC Day price: $93 (same as 5-day) — confirmed via API
- EFK price escalation Wk6-9 is confirmed: $280 (Wk1-5), $384 (Wk6), $425 (Wk7, Wk9)
- Registration opens: Apr 8, 2026 at 7:00 PM
- All prices verified via REST estimateprice API
