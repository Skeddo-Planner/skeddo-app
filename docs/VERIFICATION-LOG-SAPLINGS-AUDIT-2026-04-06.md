# Verification Log — Saplings Outdoor Program

**Audited:** 2026-04-06
**Queue entry:** Rank 174
**Source URLs verified:**
- `https://app.amilia.com/store/en/saplings-outdoor-program-ltd/shop/programs` (main registration store, all 2026 summer programs)
- `https://app.amilia.com/store/en/saplings-outdoor-program-ltd/shop/activities/6668736` (Pemberton Heights Day-to-Day Jun 29 — address, price, ages)
- `https://app.amilia.com/store/en/saplings-outdoor-program-ltd/shop/activities/6667596` (West Bay Jul 6-10 — address, price, ages, status: Full)
**DB count before audit:** 16,194 programs
**DB count after audit:** 16,194 (0 added, 6 corrected)

---

## Summary

DB had 6 generic "Outdoor Nature Camp" entries (IDs 509-514) for Jul 6–Aug 14, all marked "Full", with wrong address and wrong price. Saplings runs summer camps at 2 confirmed locations (Pemberton Heights and West Bay) with 3 distinct program types plus a day-to-day option. All 6 IDs repurposed.

---

## Key Errors Corrected

| Field | Old | New |
|-------|-----|-----|
| name | "Outdoor Nature Camp" (all 6) | Distinct program names per entry |
| address | "3663 Park Rd, North Vancouver, BC" | Per-location addresses (see below) |
| cost | $275 | $445/week (ID 509-511), $89/day (ID 512) |
| startTime/endTime | missing | 8:30 AM / 4:30 PM |
| ageMin/ageMax | 3/12 (all) | Corrected per program |
| enrollmentStatus | "Full" (all) | Open/Waitlist/Likely Coming Soon per program |
| endDate | Aug 14 | Aug 28 (season extends 2 more weeks) |
| repeating | missing | true (IDs 509-511) |

---

## Confirmed Programs

### Location 1: Pemberton Heights — 1390 West 22nd Street, North Vancouver, BC, V7P 2G4

#### 1a. Multi-Age Camp (Ages 3-9) — ID 509

| Field | Value |
|-------|-------|
| Price | $445/5-day week; $356/4-day BC Day week (Aug 4-7) |
| Time | 8:30 AM – 4:30 PM |
| Season | Jul 6 – Aug 28, 2026 (8 weeks) |
| Status | Open: Jul 6-Aug 7 | Full: Aug 10-28 |
| Ages | 3-9 |

#### 1b. School Age Camp (Ages 5-12) — ID 510

| Field | Value |
|-------|-------|
| Price | $445/5-day week; $356/4-day BC Day week |
| Time | 8:30 AM – 4:30 PM |
| Season | Jul 6 – Aug 28, 2026 (8 weeks) |
| Status | Open — all weeks available as of Apr 2026 |
| Ages | 5-12 |

#### 1c. Day to Day Camp (Ages 3-9) — ID 512

| Field | Value |
|-------|-------|
| Price | $89.00 per session (pay-per-day) |
| Time | 8:30 AM – 4:30 PM |
| Dates | Jun 29, Jun 30, Jul 2, Jul 3 (Jul 1 = Canada Day off) |
| Status | Open |
| Ages | 3-9 |

### Location 2: West Bay — 3175 Thompson Pl., West Vancouver, BC, V7V 3E3

#### 2a. Multi-Age Camp (Ages 3-9) — ID 511

| Field | Value |
|-------|-------|
| Price | $445/5-day week; $356/4-day BC Day week |
| Time | 8:30 AM – 4:30 PM |
| Season | Jul 6 – Aug 28, 2026 (8 weeks) |
| Status | **ALL WEEKS FULL** — waitlist available |
| Ages | 3-9 |

---

## Season Schedule

| Week | Dates | Days | Price | Notes |
|------|-------|------|-------|-------|
| Canada Day | Jun 29 – Jul 3 | Mon/Tue/Thu/Fri | $89/day (Day-to-Day only) | Jul 1 off |
| 1 | Jul 6–10 | Mon–Fri | $445 | |
| 2 | Jul 13–17 | Mon–Fri | $445 | |
| 3 | Jul 20–24 | Mon–Fri | $445 | |
| 4 | Jul 27–31 | Mon–Fri | $445 | |
| 5 | Aug 4–7 | Tue–Fri | $356 | BC Day Aug 3 off |
| 6 | Aug 10–14 | Mon–Fri | $445 | PH Multi-Age FULL |
| 7 | Aug 17–21 | Mon–Fri | $445 | PH Multi-Age FULL |
| 8 | Aug 24–28 | Mon–Fri | $445 | PH Multi-Age FULL |

---

## IDs 513-514: Placeholder Entries

Four other locations (Canyon Heights Elementary School, Glen Eagles, Lions Bay, Oakridge) appear in Saplings' Amilia filter but had no 2026 summer camp listings as of Apr 6, 2026. IDs 513-514 repurposed as placeholder entries:
- Set to "Likely Coming Soon", confirmed2026=false
- Address set to Pemberton Heights (closest confirmed location)
- Ages corrected from 3-12 to 3-9
- cost=null with costNote directing to registration page

---

## Notes

- Instructor at both locations confirmed as Heather Fraser
- Cancellation policy: 7+ days = refund less $35 admin fee; within 7 days = no refund
- Contact for changes: saplingsreg@gmail.com
- Taxes waived on all programs
- DB's original address "3663 Park Rd, North Vancouver" was not associated with any Saplings location found on the registration page
- DB cost $275 was wrong — never appeared on the registration page
