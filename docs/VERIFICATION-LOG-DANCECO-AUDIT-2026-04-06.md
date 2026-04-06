# Verification Log — Dance Co

**Audited:** 2026-04-06
**Queue entry:** Rank 147
**Source URLs verified:**
- `https://www.danceco.com/summer-dance-camps`
- `https://registration.danceco.com/camps`
**Address:** 4230 Yew Street, Vancouver, BC V6L 2E4 (Arbutus)
**DB count before audit:** 16,076 programs
**DB count after audit:** 16,092 (+16 added, 6 existing entries corrected)

---

## Summary

Dance Co Arbutus offers summer dance camps over 4 weeks in 2026. Registration is open.
The 6 existing DB entries had multiple data errors. The entries were split by age group
to comply with R46, and 16 new per-age-group entries were added.

**Issues found in existing data (ids 71-76):**
1. Wrong dates: id=71 (Jul 6 week) and id=76 (Aug 10 week) are NOT offered in 2026
2. Wrong prices: $275 doesn't match any actual price tier
3. Wrong status: "Likely Coming Soon" — registration IS open ("Register Now!")
4. Age range 3-14 violates R46 — Dance Co has distinct age bands

**Weeks offered (Dance Co Arbutus only):**
- Week 1: July 13-17, 2026 (5-day, $325 AM / $270 PM / $595 Full Day)
- Week 2: July 20-24, 2026 (5-day, $325 AM / $270 PM / $595 Full Day)
- Week 3: July 27-31, 2026 (5-day, $325 AM / $270 PM / $595 Full Day)
- Week 4: August 4-7, 2026 (4-day BC Day, $240 AM / $200 PM / $440 Full Day)

**Age groups (per provider's exact breakdowns):**
- Preschool (3-4yr): AM only (9am-12pm)
- Pre-Primary (5-6yr): AM, PM, or Full Day
- Primary (7-8yr): AM, PM, or Full Day
- Junior (9-11yr): AM, PM, or Full Day
- Teen (12-14yr): AM, PM, or Full Day

---

## Price Verification

Verified directly from live page (https://www.danceco.com/summer-dance-camps):

| Age Group | Session | 5-Day Price | 4-Day Price (Aug 4-7) |
|-----------|---------|-------------|----------------------|
| Preschool 3-4yr | AM 9am-12pm | $325 | $240 |
| Pre-Primary 5-6yr | AM 9am-12pm | $325 | $240 |
| Pre-Primary 5-6yr | PM 12:30-3pm | $270 | $200 |
| Pre-Primary 5-6yr | Full Day 9am-3pm | $595 | $440 |
| Primary 7-8yr | AM 9am-12pm | $325 | $240 |
| Primary 7-8yr | PM 12:30-3pm | $270 | $200 |
| Primary 7-8yr | Full Day 9am-3pm | $595 | $440 |
| Junior 9-11yr | AM 9am-12pm | $325 | $240 |
| Junior 9-11yr | PM 12:30-3pm | $270 | $200 |
| Junior 9-11yr | Full Day 9am-3pm | $595 | $440 |
| Teen 12-14yr | AM 9am-12pm | $325 | $240 |
| Teen 12-14yr | PM 12:30-3pm | $270 | $200 |
| Teen 12-14yr | Full Day 9am-3pm | $595 | $440 |

---

## Existing Entries Fixed (ids 71-76)

| ID | Original State | Fix Applied |
|----|---------------|------------|
| 71 | Wk1 Jul 6 "Likely Coming Soon" $275 age 3-14 | Cancelled (Jul 6 not offered), age → 3-4, Preschool |
| 72 | Wk2 Jul 13 "Likely Coming Soon" $275 age 3-14 | Open, age → 3-4 Preschool, price $325, correct fields |
| 73 | Wk3 Jul 20 "Likely Coming Soon" $275 age 3-14 | Open, age → 3-4 Preschool, price $325, correct fields |
| 74 | Wk4 Jul 27 "Likely Coming Soon" $275 age 3-14 | Open, age → 3-4 Preschool, price $325, correct fields |
| 75 | Wk5 Aug 4 "Likely Coming Soon" $275 age 3-14 | Open, age → 3-4 Preschool, 4-day price $240, correct fields |
| 76 | Wk6 Aug 10 "Likely Coming Soon" $275 age 3-14 | Cancelled (Aug 10 not offered), age → 3-4, Preschool |

---

## New Programs Added (16)

### Pre-Primary (5-6yr)

| ID | Week | Dates | Cost (AM base) |
|----|------|-------|---------------|
| DC-pre-primary-wk1 | Wk1 | Jul 13-17 | $325 AM / $270 PM / $595 Full |
| DC-pre-primary-wk2 | Wk2 | Jul 20-24 | $325 AM / $270 PM / $595 Full |
| DC-pre-primary-wk3 | Wk3 | Jul 27-31 | $325 AM / $270 PM / $595 Full |
| DC-pre-primary-wk4 | Wk4 | Aug 4-7 (4-day) | $240 AM / $200 PM / $440 Full |

### Primary (7-8yr)

| ID | Week | Dates | Cost (AM base) |
|----|------|-------|---------------|
| DC-primary-wk1 | Wk1 | Jul 13-17 | $325 AM / $270 PM / $595 Full |
| DC-primary-wk2 | Wk2 | Jul 20-24 | $325 AM / $270 PM / $595 Full |
| DC-primary-wk3 | Wk3 | Jul 27-31 | $325 AM / $270 PM / $595 Full |
| DC-primary-wk4 | Wk4 | Aug 4-7 (4-day) | $240 AM / $200 PM / $440 Full |

### Junior (9-11yr)

| ID | Week | Dates | Cost (AM base) |
|----|------|-------|---------------|
| DC-junior-wk1 | Wk1 | Jul 13-17 | $325 AM / $270 PM / $595 Full |
| DC-junior-wk2 | Wk2 | Jul 20-24 | $325 AM / $270 PM / $595 Full |
| DC-junior-wk3 | Wk3 | Jul 27-31 | $325 AM / $270 PM / $595 Full |
| DC-junior-wk4 | Wk4 | Aug 4-7 (4-day) | $240 AM / $200 PM / $440 Full |

### Teen (12-14yr)

| ID | Week | Dates | Cost (AM base) |
|----|------|-------|---------------|
| DC-teen-wk1 | Wk1 | Jul 13-17 | $325 AM / $270 PM / $595 Full |
| DC-teen-wk2 | Wk2 | Jul 20-24 | $325 AM / $270 PM / $595 Full |
| DC-teen-wk3 | Wk3 | Jul 27-31 | $325 AM / $270 PM / $595 Full |
| DC-teen-wk4 | Wk4 | Aug 4-7 (4-day) | $240 AM / $200 PM / $440 Full |

---

## Gap Analysis

| Category | Live (page) | In DB before | Fixed | Added |
|----------|------------|-------------|-------|-------|
| Preschool (3-4yr) ×4 weeks | 4 | 4 (wrong data) | 4 | 0 |
| Pre-Primary (5-6yr) ×4 weeks | 4 | 0 | 0 | 4 |
| Primary (7-8yr) ×4 weeks | 4 | 0 | 0 | 4 |
| Junior (9-11yr) ×4 weeks | 4 | 0 | 0 | 4 |
| Teen (12-14yr) ×4 weeks | 4 | 0 | 0 | 4 |
| Non-offered weeks (Cancelled) | 0 | 2 (wrong dates) | 2 | 0 |
| **Total** | **20** | **6** | **6** | **16** |

---

## Notes

- Dance Co has two locations (Arbutus and Fraser) but summer camps are at **Arbutus only** in 2026
- Registration is OPEN as of audit date (April 6, 2026)
- The Aug 4-7 week is 4-day due to BC Day (Mon Aug 3 holiday)
- Each week entries use AM base price ($325/$240) in cost field; PM and Full Day prices noted in costNote
- AM/PM/Full Day are separate schedule options within the same registration wizard — not split into separate DB entries (future audit improvement)
- BC Day Preschool 4-day AM price: $240 (confirmed live page)
