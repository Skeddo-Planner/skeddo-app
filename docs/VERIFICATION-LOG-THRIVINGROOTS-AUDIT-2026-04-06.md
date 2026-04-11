# Verification Log — Thriving Roots

**Audited:** 2026-04-06
**Queue entry:** Rank 173
**Source URLs verified:**
- `https://www.thrivingroots.org/camps` (full camp listing, all 9 programs)
- `https://www.thrivingroots.org/wilderness-skills-camp` (price: $585+GST, time: 9:30am-3:30pm, dates: Jul 6-10)
- `https://www.thrivingroots.org/little-explorers-camp` (price: $465+GST, time: 10am-2:30pm, dates: Jun 29-Jul 3)
- `https://www.thrivingroots.org/campus` (geographic confirmation: Greater Victoria location)
**DB count before audit:** 16,194 programs
**DB count after audit:** 16,194 (0 added, 6 corrected)

---

## CRITICAL FINDING: Wrong Geographic Region

**Thriving Roots is based in Greater Victoria (Vancouver Island), NOT Metro Vancouver.**

Key evidence from the provider's website:
- Campus page states: "Our programs have typically been hosted from outdoor spaces in the Greater Victoria area"
- 2026/27 interim location: Boys & Girls Club Campus, 3900 Metchosin Rd, Metchosin, BC (Vancouver Island)
- Cedar Song Centre: 119 Ross Durrance Rd, Highlands, BC (near Victoria)
- Summer 2026 camps: Beaver Lake Ponds, Saanich, BC (Elk/Beaver Lake Regional Park, Victoria area)
- DB address was "3691 Mountain Hwy, North Vancouver" — completely wrong province-side location

**Resolution:** lat/lng corrected to Greater Victoria (~48.5145, -123.4102). Programs will fall outside the Metro Vancouver geographic filter and not appear in Metro Vancouver searches, which is correct.

---

## Programs Confirmed

### 1. Little Explorers (Ages 5-7) — ID 488

| Field | Old Value | New Value |
|-------|-----------|-----------|
| name | "Wilderness Camp" | "Thriving Roots — Little Explorers Summer Camp (Ages 5-7)" |
| cost | $380 | $465 + GST |
| address | 3691 Mountain Hwy, North Vancouver | Beaver Lake Ponds, Saanich, BC (Greater Victoria) |
| lat/lng | 49.3305, -123.031 | 48.5145, -123.4102 |
| startDate | unknown | 2026-06-29 |
| endDate | unknown | 2026-07-03 |
| startTime | missing | 10:00 AM |
| endTime | missing | 2:30 PM |
| days | missing | Mon, Tue, Thu, Fri (Canada Day Jul 1 off) |
| ageMin/ageMax | 5/17 | 5/7 |
| priceVerified | unset | true |
| confirmed2026 | unknown | true |

**Confirmed from:** `https://www.thrivingroots.org/little-explorers-camp`

### 2. Wilderness Skills Camp (Ages 8-14) — ID 489

| Field | Old Value | New Value |
|-------|-----------|-----------|
| name | "Wilderness Camp" | "Thriving Roots — Wilderness Skills Summer Camp (Ages 8-14)" |
| cost | $380 | $585 + GST |
| address | 3691 Mountain Hwy, North Vancouver | Beaver Lake Ponds, Saanich, BC (Greater Victoria) |
| lat/lng | 49.3305, -123.031 | 48.5145, -123.4102 |
| startDate | unknown | 2026-07-06 |
| endDate | unknown | 2026-07-10 |
| startTime | missing | 9:30 AM |
| endTime | missing | 3:30 PM |
| days | missing | Mon, Tue, Wed, Thu, Fri |
| ageMin/ageMax | 5/17 | 8/14 |
| priceVerified | unset | true |
| confirmed2026 | unknown | true |

**Confirmed from:** `https://www.thrivingroots.org/wilderness-skills-camp`

### 3. Way of the Scout (Ages 8-14) — ID 490

Listed on camps page: Jul 13-17, 2026. Individual program page not visited for price confirmation.

| Field | Value |
|-------|-------|
| cost | null (unconfirmed — likely ~$585+GST consistent with other 8-14 camps) |
| startDate/endDate | 2026-07-13 / 2026-07-17 |
| startTime/endTime | 9:30 AM / 3:30 PM (consistent with other 8-14 camps) |
| ageMin/ageMax | 8 / 14 |
| priceVerified | false |
| confirmed2026 | true (camp listed, dates confirmed on listing page) |

### 4. Wild Theatre Camp (Ages 8-14) — ID 491

Listed on camps page: Jul 20-24, 2026.

| Field | Value |
|-------|-------|
| cost | null (unconfirmed) |
| startDate/endDate | 2026-07-20 / 2026-07-24 |
| ageMin/ageMax | 8 / 14 |
| confirmed2026 | true |

### 5. Earth Arts Camp (Ages 8-14) — ID 492

Listed on camps page: Aug 10-14, 2026.

| Field | Value |
|-------|-------|
| cost | null (unconfirmed) |
| startDate/endDate | 2026-08-10 / 2026-08-14 |
| ageMin/ageMax | 8 / 14 |
| confirmed2026 | true |

### 6. Wild Craft & Wonder Overnight (Teens 13-17) — ID 493

Listed on camps page: Jul 13-17, 2026. Overnight format (5 days/4 nights). Location: W̱MÍYEŦEN Nature Sanctuary (Greater Victoria area).

| Field | Value |
|-------|-------|
| cost | null (overnight pricing not confirmed) |
| startDate/endDate | 2026-07-13 / 2026-07-17 |
| ageMin/ageMax | 13 / 17 |
| confirmed2026 | true |

---

## Additional Programs on Camps Page (Not in DB)

The provider's camps listing shows 9 total camps for 2026. The 6 DB entries (IDs 488-493) account for 6. Additional programs found:

| Program | Dates | Ages | Status |
|---------|-------|------|--------|
| Youth Nature Ninjas (Ages 5-7) | Aug 3-7, 2026 | 5-7 | Listed (BC Day week — Tue-Fri) |
| Wild Plants & Forest Wisdom (Ages 8-14) | Jul 27-31, 2026 | 8-14 | Listed |
| Wilderness Skills Leadership (Teens) | Aug, 2026 | 13-17 | Listed |

These 3 programs are not currently in the DB. They were not added in this audit as no DB IDs were allocated for them and the DB count was to remain at 16,194. A follow-up session should add these missing programs.

---

## Notes

- Provider phone: 778-676-4842
- CampBrain portal (login required) used for registration — public-facing page `https://www.thrivingroots.org/camps` used as registrationUrl
- All 6 DB entries previously showed address "3691 Mountain Hwy, North Vancouver" — this is entirely fabricated/incorrect
- Geographic correction means Thriving Roots programs will NOT appear in Metro Vancouver searches — this is the correct behavior since programs are in Victoria
- Equity Fund available for families experiencing financial barriers (discount amount not published)
- Camps include t-shirt; non-refundable deposit; 14-day notice required for refund
