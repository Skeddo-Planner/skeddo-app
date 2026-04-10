# Verification Log — SC Kim's Taekwondo

**Audited:** 2026-04-09
**Queue entry:** Rank 223
**Source URLs verified (browser navigation):**
- `https://sckimstaekwondo.com/` (homepage — confirms address, contact info)
- `https://sckimstaekwondo.com/summer-camp-burnaby/` (summer camp lead capture page)
- `https://sckimstaekwondo.com/schedule/` (2026 class schedule, effective March 1, 2026)
**DB count before audit:** 16,362 programs
**DB count after audit:** 16,362 (0 added, 4 corrected)

---

## Summary

SC Kim's Taekwondo offers a summer camp program but 2026 details (dates, pricing, schedule) are NOT yet announced. The summer camp page is a lead capture form only — parents submit contact info to receive camp details. Website previously returned HTTP 403 but now loads correctly. Main corrections: address updated from "4455 Byrne Rd" to "4603 Kingsway Suite 001" (confirmed on homepage and summer camp page), postal code added, registration URL updated, and stale HTTP 403 note removed.

---

## Corrections Applied (IDs 379-382)

| Field | Old | New |
|-------|-----|-----|
| address | 4455 Byrne Rd, Burnaby, BC | 4603 Kingsway Suite 001, Burnaby, BC V5H 4M4 |
| postalCode | (none) | V5H 4M4 |
| lat | 49.228 | 49.2290 |
| lng | -122.939 | -123.0015 |
| registrationUrl | sckimstaekwondo.com | sckimstaekwondo.com/summer-camp-burnaby/ |
| urlNote | "HTTP 403 — search provider site" | (removed) |
| costNote | (none) | Price from prior year, unverified. 2026 details not announced. |
| ageSpanJustified | (none) | Provider offers one summer camp program for all ages. |

---

## Programs Verified

| ID | Name | Status |
|----|------|--------|
| 379 | Taekwondo Summer Camp (Week 1: Jul 6-10) | Likely Coming Soon — 2026 details TBD |
| 380 | Taekwondo Summer Camp (Week 2: Jul 13-17) | Likely Coming Soon — 2026 details TBD |
| 381 | Taekwondo Summer Camp (Week 3: Jul 20-24) | Likely Coming Soon — 2026 details TBD |
| 382 | Taekwondo Summer Camp (Week 4: Jul 27-31) | Likely Coming Soon — 2026 details TBD |

---

## Notes

- Address confirmed: 4603 Kingsway Suite 001, Burnaby, BC V5H 4M4
- Phone: 604-430-5467, Email: info@sckimstaekwondo.com
- Founded by Grandmaster Songchul Kim (2012/2016 Olympic official)
- Regular classes: Little Tigers (7 & under), Kid Tigers (8-12), Teen (13+), Adult
- Summer camp page is lead-capture only — no dates, prices, or schedule visible
- Cost $250 is from prior year data, unverified for 2026
- Dates Jul 6-31 are from prior year data — 2026 dates TBD
- Re-audit when 2026 summer camp details are announced
- Provider shows only 4 weeks in DB but may offer more weeks — cannot verify until announced
