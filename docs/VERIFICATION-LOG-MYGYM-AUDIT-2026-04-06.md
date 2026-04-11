# Verification Log — My Gym Richmond

**Audited:** 2026-04-06
**Queue entry:** Rank 171
**Source URL verified:**
- `https://www.mygym.com/richmondbc/camp` (camp page, available times, pricing, ages)
**DB count before audit:** 16,194 programs
**DB count after audit:** 16,194 (0 added, 6 corrected)

---

## Summary

My Gym Richmond (Unit 9, 4751 Shell Road) offers a Summer Camp program that runs daily, paid per session. The DB had multiple errors: wrong address, wrong cost ($250/week vs actual $35/session), wrong time (no times stored vs actual 1:00PM-4:00PM), and wrong status (Likely Coming Soon vs Open).

More critically, the DB had 6 weekly entries for Jul 6–Aug 14, but the registration page confirms only two specific weeks: **Jul 6–10** and **Aug 24–28**. Mid-summer weeks are not confirmed as of Apr 6, 2026.

---

## Confirmed Camp Details

| Field | Value |
|-------|-------|
| Address | Unit 9, 4751 Shell Road, Richmond, BC V6X 3H4 |
| Phone | (778) 859-9680 |
| Ages | 3 years 6 months to 9 years |
| Cost | $35.00 per session (pay-per-day) |
| Time | 1:00 PM – 4:00 PM (3 hours) |
| Days | Mon–Fri |
| Program | Summer Camp (single cohort, themed daily activities) |

### Confirmed Weeks (Available Times grid, Apr 6 2026)

| Session Dates | Status |
|--------------|--------|
| Jul 6, 7, 8, 9, 10 | Open |
| Aug 24, 25, 26, 27, 28 | Open |

**No other weeks appeared in the Available Times list.** The registration page also lists specific daily themes only for Jul 6–10 and Aug 24–28.

---

## Fixes Applied (IDs 347–352)

| Field | Old | New |
|-------|-----|-----|
| address | "5300 No. 3 Rd, Richmond, BC" | "Unit 9, 4751 Shell Road, Richmond, BC V6X 3H4" |
| cost | 250 | 35 (IDs 347, 348); 35 but unconfirmed weeks (349-352) |
| costNote | missing | $35/session, pay-per-day, cancellation policy |
| startTime/endTime | missing | 1:00 PM / 4:00 PM |
| registrationUrl | mygym.com/richmondbc/ | mygym.com/richmondbc/camp |
| days | "Mon-Fri" | "Mon, Tue, Wed, Thu, Fri" |
| enrollmentStatus | "Likely Coming Soon" | "Open" (IDs 347, 348); "Likely Coming Soon" (349-352) |
| confirmed2026 | false | true (IDs 347, 348); false (349-352) |
| priceVerified | unset | true (IDs 347, 348); false (349-352) |
| isEstimate | true | false (IDs 347, 348 — confirmed on live page) |
| ageSpanJustified | missing | Added — 3.5–9 yrs, single cohort, no age-band subdivision |
| lat/lng | missing | 49.1817, -123.1444 (4751 Shell Road, Richmond) |

### ID repurposing

- **ID 347**: Kept as Jul 6–10 (confirmed Week 1)
- **ID 348**: Repurposed from Jul 13–17 → **Aug 24–28** (confirmed last week)
- **IDs 349–352**: Retained with original mid-summer date ranges but set to "Likely Coming Soon" + confirmed2026=false, with a costNote noting these weeks are not confirmed on the registration page as of Apr 2026

---

## Notes

- My Gym grips socks are mandatory for camp (sold in-store)
- Same-day cancellations are non-refundable
- Early Bird discount mentioned on page but amount not shown in accessible tree
- No weekly package pricing — strictly per-day/session
