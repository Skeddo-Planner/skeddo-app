# Verification Log — Wayland Sports (RE-AUDIT)

**Audited:** 2026-04-09 (re-audit via Chrome browser)
**Queue entry:** Rank 208
**Source URLs verified (Chrome browser):**
- `https://www.waylandsports.com/` — homepage (loads correctly in Chrome)
- `https://www.waylandsports.com/ironwood-campus/` — camps page (8 program types listed)
- `https://www.waylandsports.com/locations/ironwood-campus/` — location/address page
- Spring 2025 camp info PDF (pricing reference)
- `https://app.jackrabbitclass.com/regv2.asp?id=287770` — registration portal (login-protected)
**DB count before audit:** 16,382 programs
**DB count after audit:** 16,382 (0 added, 4 corrected)

---

## Re-audit reason

Prior audit (2026-04-09) used WebFetch which timed out on waylandsports.com. Re-audited using Chrome browser — site loads correctly and all content is accessible.

---

## Corrections Applied

| ID | Field | Old | New |
|----|-------|-----|-----|
| All 4 | address | 12080 Horseshoe Way, Richmond, BC | 12080 Horseshoe Way, Richmond, BC V7A 4V5 |
| All 4 | postalCode | (missing) | V7A 4V5 |
| All 4 | city | (missing) | Richmond |
| All 4 | registrationUrl | waylandsports.com/ironwood-campus/ | (same, now urlVerified=true) |
| All 4 | costNote | (basic) | Detailed with Spring 2025 reference pricing + all 8 camp types |
| All 4 | description | (basic) | Updated with facility details |

---

## Completeness Check

Provider camps page lists **8 distinct program types:**
1. Half Day Swim/Workout Camp (Beginner)
2. Half Day Swim/Workout Camp (Intermediate)
3. Half Day Gymnastics Camp
4. Summer Camp Early Care
5. Full Day Camp (Beginner)
6. Full Day Camp (Intermediate)
7. Swim Camp (Beginner)
8. Swim Camp (Intermediate)

Our DB has **4 generic "Gymnastics & Swim Camp" entries** (weekly slots for Jul 6-31). This is a known gap — we cannot create proper entries until summer 2026 schedule/pricing is published. The 4 existing entries serve as placeholders to be expanded when summer registration opens.

---

## Pricing Reference (Spring 2025 — NOT verified for 2026)

| Camp Type | Spring 2025 Price | Times |
|-----------|------------------|-------|
| Half Day Gymnastics | $399 + GST | Mon-Fri 9:00AM-12:00PM |
| Full Day Beginner (Gym/Swim/Bike) | $860 + GST | Mon-Fri 9:00AM-3:00PM |
| Full Day Intermediate (Gym/Swim/Bike) | $795 + GST | Mon-Fri 9:00AM-3:00PM |

Additional fees: $16 Gymnastics BC insurance (non-members), $30 new member fee (swim camps)

---

## Notes

- Address: 12080 Horseshoe Way, Richmond, BC V7A 4V5
- Phone: 604-275-1888, Fax: 604-275-3888
- Email: richmondinfo@waylandsports.com (also inforichmondwaylandsports@gmail.com)
- 32,000 sq ft facility: Olympic gymnastics equipment, pool, trampolines, foam pit
- Steveston location permanently closed due to COVID-19
- Office hours: Thu 9:15am-2:15pm, Mon-Fri 3:00pm-8:30pm
- Registration via Jackrabbit Class portal (login-protected — cannot view schedules without account)
- Full day schedule: 9-12 Gymnastics, 12-12:30 Lunch, 12:30-3 Swim & Bike
- No refunds/makeups for missed days
