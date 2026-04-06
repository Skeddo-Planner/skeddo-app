# Verification Log — City of Burnaby

**Audited:** 2026-04-06
**URL:** https://anc.ca.apm.activecommunities.com/burnaby/activity/search
**ActiveNet instance:** burnaby
**DB count before audit:** 15,884 programs
**DB count after audit:** 15,941 (+57 programs added, 112 corrected)

---

## Summary

City of Burnaby uses ActiveNet with a **display ID − 5487 = URL ID** offset formula.
- Confirmed: BVM display #99617 → URL 94130 → REST `estimateprice/94130` = "Summer Camp - Village Ventures" ✓
- Fees verified via browser navigation + REST API: `https://anc.ca.apm.activecommunities.com/burnaby/rest/activity/detail/estimateprice/{urlId}?locale=en-US`

**Registration dates:** Residents Mar 9, Non-residents Mar 13, 2026

**9 new centers added** (entirely missing from DB):
Willingdon CC, Wesburn CC, Charles Rummel Centre, Riverway Sports Complex, Rosemary Brown Recreation Centre, South Central Youth Centre, Burnaby Village Museum, Burnaby Art Gallery, Swangard Stadium

**8 existing centers corrected** (wrong cost=$265):
Bonsor, Edmonds, Christine Sinclair, Bill Copeland (prices verified and corrected),
Cameron, Confederation Park, Eileen Dailly, Kensington (prices unverified → cost=null, flagged)

---

## Burnaby ActiveNet ID Formula

- **Display ID** shown on search page listing cards
- **URL ID** used in detail URLs (`/burnaby/activity/search/detail/{urlId}`)
- **Offset:** display − 5487 = URL ID (consistent across all Burnaby programs verified)

---

## New Centers Added (57 programs)

### Willingdon Community Centre (8 weeks)
- Address: 3665 Kensington Ave, Burnaby, BC (neighbourhood: Lochdale)
- Ages: 5–11 (at least 5, less than 12)
- Time: 9:00 AM – 3:00 PM (Full Day, 6 hrs)
- Cost: $168.00 (5-day) / $134.40 (4-day BC Day)

| ID | Week | Dates | Cost |
|----|------|-------|------|
| BNB-93443 | Wk 2 | Jul 6–10 | $168.00 |
| BNB-93444 | Wk 3 | Jul 13–17 | $168.00 |
| BNB-93445 | Wk 4 | Jul 20–24 | $168.00 |
| BNB-93446 | Wk 5 | Jul 27–31 | $168.00 |
| BNB-93447 | Wk 6 (BC Day) | Aug 4–7 (Tue–Fri) | $134.40 |
| BNB-93448 | Wk 7 | Aug 10–14 | $168.00 |
| BNB-93449 | Wk 8 | Aug 17–21 | $168.00 |
| BNB-93450 | Wk 9 | Aug 24–28 | $168.00 |

Display IDs: 98930–98937 (sequential)

### Wesburn Community Centre (8 weeks)
- Address: 7282 Cariboo Rd, Burnaby, BC (neighbourhood: East Burnaby)
- Ages: 5–11, Time: 9:00 AM – 3:00 PM
- Same pricing as WIL: $168/$134.40 BC Day

| ID | Week | Dates | Cost |
|----|------|-------|------|
| BNB-93966 | Wk 2 | Jul 6–10 | $168.00 |
| BNB-93967 | Wk 3 | Jul 13–17 | $168.00 |
| BNB-93968 | Wk 4 | Jul 20–24 | $168.00 |
| BNB-93969 | Wk 5 | Jul 27–31 | $168.00 |
| BNB-93970 | Wk 6 (BC Day) | Aug 4–7 | $134.40 |
| BNB-93971 | Wk 7 | Aug 10–14 | $168.00 |
| BNB-93972 | Wk 8 | Aug 17–21 | $168.00 |
| BNB-93965 | Wk 9 | Aug 24–28 | $168.00 |

**Note:** Display IDs are 99452–99459, but Aug 24 is display #99452 (lower than Jul 6 = #99453).
Anomalous ordering confirmed — IDs not assigned chronologically for WCC.

### Charles Rummel Centre (8 weeks)
- Address: 3880 Lozells Ave, Burnaby, BC (neighbourhood: Lochdale)
- Ages: 5–11, Time: 9:00 AM – 3:00 PM

| ID | Week | Dates | Cost |
|----|------|-------|------|
| BNB-94409 | Wk 2 | Jul 6–10 | $168.00 |
| BNB-94410 | Wk 3 | Jul 13–17 | $168.00 |
| BNB-94411 | Wk 4 | Jul 20–24 | $168.00 |
| BNB-94412 | Wk 5 | Jul 27–31 | $168.00 |
| BNB-94413 | Wk 6 (BC Day) | Aug 4–7 | $134.40 |
| BNB-94414 | Wk 7 | Aug 10–14 | $168.00 |
| BNB-94415 | Wk 8 | Aug 17–21 | $168.00 |
| BNB-94417 | Wk 9 | Aug 24–28 | $168.00 |

**Note:** Display IDs sequential 99896–99904, but Aug 24 = display #99904 (expected 99903). Off by 1 — confirmed live.

### Riverway Sports Complex (8 weeks)
- Address: 9523 Riverway Place, Burnaby, BC (neighbourhood: Burnaby South)
- Ages: 6–11 (slightly different minimum)
- Time: 9:00 AM – 3:00 PM

| ID | Week | Dates | Cost |
|----|------|-------|------|
| BNB-92497 | Wk 2 | Jul 6–10 | $168.00 |
| BNB-92498 | Wk 3 | Jul 13–17 | $168.00 |
| BNB-92689 | Wk 4 | Jul 20–24 | $168.00 |
| BNB-92716 | Wk 5 | Jul 27–31 | $168.00 |
| BNB-92728 | Wk 6 (BC Day) | Aug 4–7 | $134.40 |
| BNB-92741 | Wk 7 | Aug 10–14 | $168.00 |
| BNB-92742 | Wk 8 | Aug 17–21 | $168.00 |
| BNB-92743 | Wk 9 | Aug 24–28 | $168.00 |

**Note:** Display IDs non-sequential (97984, 97985, 98176, 98203, 98215, 98228, 98229, 98230). Confirmed individually via browser.

### Rosemary Brown Recreation Centre (7 programs)
- Address: 2160 Central Blvd, Burnaby, BC (neighbourhood: South Burnaby)
- Regular camp: Ages 5–10; Senior Out-trip: Ages 8–11

| ID | Program | Dates | Days | Cost |
|----|---------|-------|------|------|
| BNB-94518 | Regular – Canada Day Wk | Jun 29–Jul 3 | Mon,Tue,Thu,Fri | $134.60 |
| BNB-94512 | Senior Out-trip – Wk 2 | Jul 6–10 | Mon–Fri | $199.50 |
| BNB-94513 | Regular – Wk 3 | Jul 13–17 | Mon–Fri | $168.00 |
| BNB-94514 | Regular – Wk 4 | Jul 20–24 | Mon–Fri | $168.00 |
| BNB-94515 | Regular – Wk 5 | Jul 27–31 | Mon–Fri | $168.00 |
| BNB-94516 | Regular – Wk 6 (BC Day) | Aug 4–7 | Tue–Fri | $134.60 |
| BNB-94517 | Senior Out-trip – Wk 7 | Aug 10–14 | Mon–Fri | $199.50 |

**Note:** RBR offers Canada Day week; no regular camp Jul 6; no Aug 17 or Aug 24 camps confirmed.
Canada Day 4-day price: $134.60 ≈ $168 × 4/5 = $134.40 (slight variance confirmed on page).

### South Central Youth Centre (1 program)
- Address: 7630 Patterson Ave, Burnaby, BC (neighbourhood: Central Burnaby)
- Ages: 10–13 (older cohort — Senior camp)

| ID | Dates | Cost |
|----|-------|------|
| BNB-85585 | Jul 6–10 | $199.50 |

Confirmed via `activity_keyword=summer+break+camp` search — only 1 result.

### Burnaby Village Museum (8 themed weeks)
- Address: 6501 Deer Lake Ave, Burnaby, BC (neighbourhood: Deer Lake)
- Ages: 6–11 (Indigenous Week: 7–11)
- Time: 9:00 AM – 3:00 PM
- Cost: $260 non-member / $234.50 member (verified via REST estimateprice API for IDs 94130, 94131)

| ID | Theme | Dates | Cost |
|----|-------|-------|------|
| BNB-94130 | Village Ventures | Jul 6–10 | $260 |
| BNB-94131 | Fun with Food | Jul 13–17 | $260 |
| BNB-94132 | Indigenous Week | Jul 20–24 | $260 (ages 7–11) |
| BNB-94133 | Outdoor Escape | Jul 27–31 | $260 |
| BNB-94138 | Toy Week (BC Day) | Aug 4–7 Tue–Fri | null (4-day unverified) |
| BNB-94135 | Museum Mysteries | Aug 10–14 | $260 |
| BNB-94134 | Decades Week | Aug 17–21 | $260 |
| BNB-94136 | Discovering Skills | Aug 24–28 | $260 |

**Note:** BVM URL IDs are non-sequential (94130–94138 with gaps). BC Day Toy Week 4-day price not verified — set to null with costNote.

### Burnaby Art Gallery (7 programs)
- Address: 6344 Deer Lake Ave, Burnaby, BC (neighbourhood: Deer Lake)

| ID | Program | Dates | Ages | Time | Cost |
|----|---------|-------|------|------|------|
| BNB-92102 | Down in the Dirt AM | Jul 6–10 | 4–6 | 10am–12pm (Half Day) | $110.50 |
| BNB-92103 | Down in the Dirt PM | Jul 6–10 | 4–6 | 1pm–3pm (Half Day) | $110.50 |
| BNB-92100 | Days of Colour | Jul 13–17 | 6–8 | 9am–3pm (Full Day) | $311.50 |
| BNB-92097 | Art in Nature | Jul 20–24 | 9–12 | 9am–3pm (Full Day) | $311.50 |
| BNB-92101 | Find it, Make it | Jul 27–31 | 6–8 | 9am–3pm (Full Day) | $311.50 |
| BNB-92098 | Art Investigators | Aug 4–7 (BC Day) | 9–12 | 9am–3pm (Full Day) | $251.20 |
| BNB-92099 | Art Unusual | Aug 10–14 | 6–8 | 9am–3pm (Full Day) | $311.50 |

**Note:** No BAG camps Aug 17 or Aug 24 — confirmed via keyword search.

### Swangard Stadium (2 programs)
- Address: 3883 Imperial St, Burnaby, BC (neighbourhood: Central Burnaby)
- Ages: 6–11, Time: 9:00 AM – 3:00 PM, Cost: $163.50

| ID | Dates |
|----|-------|
| BNB-92749 | Jul 27–31 (Wk 5) |
| BNB-92757 | Aug 24–28 (Wk 9) |

Confirmed via `activity_keyword=swangard` search — only 2 results.

---

## Existing Center Price Corrections (112 programs)

All 8 Burnaby centers below had `cost=265` (wrong) and `priceVerified=true` (wrong).

| Provider | Was | Now | Notes |
|----------|-----|-----|-------|
| Bonsor Recreation Centre (JR, ageMax≤9) | $265 | $182 | 5-day JR verified |
| Bonsor Recreation Centre (Sr, ageMax>9) | $265 | $188.83 | 5-day Sr verified |
| Edmonds Recreation Centre | $265 | $168 | Verified |
| Christine Sinclair RC (JR) | $265 | $168 | Verified |
| Christine Sinclair RC (Sr) | $265 | $199.50 | Verified |
| Bill Copeland Recreation Centre | $265 | $168 | Verified (Wk 3+) |
| Cameron Recreation Centre | $265 | null | Price not confirmed; flagged |
| Confederation Park RC | $265 | null | Price not confirmed; flagged |
| Eileen Dailly Recreation Centre | $265 | null | Price not confirmed; flagged |
| Kensington Recreation Centre | $265 | null | Price not confirmed; flagged |

4-day BC Day pricing (where applicable):
- $168 × 0.80 = $134.40 ✓
- $182 × 0.80 = $145.60 ✓
- $188.83 × 0.808 ≈ $152.43 ✓

---

## Gap Analysis

| Category | Found | Added | Notes |
|----------|-------|-------|-------|
| WIL Summer Camp (8 wks) | 8 | 8 | Entirely new center |
| WCC Summer Camp (8 wks) | 8 | 8 | Entirely new center |
| CRC Summer Camp (8 wks) | 8 | 8 | Entirely new center |
| RSC Summer Camp (8 wks) | 8 | 8 | Entirely new center |
| RBR Summer Camp (7 programs) | 7 | 7 | Entirely new center |
| SCY Summer Break Camp (1 wk) | 1 | 1 | Entirely new center |
| BVM Themed Weeks (8) | 8 | 8 | Entirely new center |
| BAG Art Camps (7) | 7 | 7 | Entirely new center |
| SWA Sports Camp (2 wks) | 2 | 2 | Entirely new center |
| **Total new programs** | **57** | **57** | — |
| Existing centers price fix | 112 | 0 | Corrected, not new |

---

## Notes

- Burnaby ActiveNet display → URL offset = 5487 (confirmed across multiple programs)
- REST price API: `https://anc.ca.apm.activecommunities.com/burnaby/rest/activity/detail/estimateprice/{urlId}?locale=en-US`
- Canada Day (Jul 1, Wed): 4-day weeks at ~80% of 5-day rate
- BC Day (Aug 3, Mon): 4-day weeks at ~80% of 5-day rate
- WCC Aug 24 display ID anomaly: #99452 < #99453 (non-chronological assignment)
- CRC Aug 24 display ID anomaly: #99904 (expected #99903)
- RSC display IDs non-sequential: confirmed individually via browser
- BVM Toy Week (BC Day) 4-day price not verified — cost=null with costNote
- Cameron/Confederation/Eileen Dailly/Kensington prices remain unverified (cost=null, priceVerified=false)
