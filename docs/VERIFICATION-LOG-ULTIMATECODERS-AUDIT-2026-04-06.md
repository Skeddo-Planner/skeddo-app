# Verification Log — Ultimate Coders

**Audited:** 2026-04-06
**Queue entry:** Rank 168
**Source URLs verified:**
- `https://www.ultimatecoders.com/richmond-bc-ca/programs/coding-camps` (pricing, details, availability)
- `https://www.ultimatecoders.com/locations` (Metro Vancouver location count)
**DB count before audit:** 16,194 programs
**DB count after audit:** 16,194 (0 added, 6 corrected)

---

## Summary

One Metro Vancouver location confirmed: Richmond, BC (4400 Hazelbridge Way, Unit 510). DB had wrong address ("6060 Minoru Blvd"), wrong cost ($350), and generic names ("Coding Bootcamp"). Fixed all 6 entries. No 2026 summer sessions posted yet — status "Likely Coming Soon" is appropriate.

---

## Location Details

| Field | Value |
|-------|-------|
| Address | 4400 Hazelbridge Way, Unit 510, Richmond, BC V6X 3R8 |
| Phone | 604-285-6661 |
| Email | ucrichmond@ultimatecoders.ca |
| Metro Vancouver locations | 1 (Richmond only) |

---

## Pricing (confirmed from registration page, + taxes)

| Option | Price | Hours |
|--------|-------|-------|
| Half Day | $275/week | 9am-12pm OR 1pm-4pm |
| Full Day (Most Popular) | $550/week | 9am-4pm (lunch included) |
| Day Camp (single day) | $150/day | 9am-4pm |

Discounts: 10% off if combining Coding + Math or Debate; 15% off combining all three (Richmond only).

---

## 2026 Summer Availability

The website shows "No Coding Camps are currently available at this location." 2026 summer session dates not yet published as of April 6, 2026. DB week dates (Jul 6–Aug 14) are estimates from prior season — retained with `confirmed2026=false`.

---

## Fixes Applied (ids 203-208)

| Field | Old | New |
|-------|-----|-----|
| name | "Coding Bootcamp" | "Ultimate Coders Coding Camp — Week N (dates)" |
| address | "6060 Minoru Blvd, Richmond, BC" | "4400 Hazelbridge Way, Unit 510, Richmond, BC V6X 3R8" |
| cost | 350 | null (pricing is $275 or $550 + taxes depending on half/full day) |
| costNote | (missing) | Full pricing detail added |
| confirmed2026 | true | false (no sessions posted yet) |
| priceVerified | true | false (pricing tiers shown but no per-session confirmation) |
| ageMin | 6 | 6 (confirmed — "ages 6 and above" on site, heading says "Ages 5+") |
| ageSpanJustified | (missing) | Added — single cohort 6-18, no age-band subdivision |
| lat/lng | missing | 49.1703, -123.1353 (Hazelbridge Way, Richmond) |
| registrationUrl | ultimatecoders.ca (redirects) | ultimatecoders.com direct URL |
| id=207 days | Mon, Tue, Wed, Thu, Fri | Tue, Wed, Thu, Fri (BC Day Aug 3 off) |
| description | generic | Updated with address, pricing, 2026 status note |

---

## Notes

- Ultimate Coders website uses `.com` domain (ultimatecoders.com); `.ca` domain redirects — updated to `.com`
- No other Metro Vancouver locations (all other franchises are in Ontario and Alberta)
- Week 5 (Aug 4-7) dates changed to Tue-Fri accounting for BC Day Aug 3 off
- Age heading says "5+" but FAQ and description say "6 and above" — used 6 as minimum (consistent with website description)
- Pricing confirmed on page but total cost unknown until registration opens (adds taxes)
