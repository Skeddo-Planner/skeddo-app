# Verification Log — DaVinci Code Art Academy (RE-AUDIT)

**Audited:** 2026-04-09 (re-audit via Chrome browser)
**Queue entry:** Rank 241
**Source URLs verified (Chrome browser):**
- `https://davincicode.ca/` — homepage (loads fine, camp info on homepage)
- `https://davincicode.ca/summer-camps` — **404 Not Found**
- `https://app.marketingisfun.ca/widget/bookings/summerhalfdaycamp` — half day booking ($55 tax incl)
- `https://app.marketingisfun.ca/widget/bookings/fulldaycamp` — full day booking ($85 tax incl)
- `https://app.marketingisfun.ca/widget/bookings/kidscamppackageof5days` — weekly package ($400)
**DB count before audit:** 16,422 programs
**DB count after audit:** 16,422 (0 added, 3 corrected)

---

## Re-audit reason

Prior audit (WebFetch) timed out on davincicode.ca. Chrome browser verified site loads fine. Found /summer-camps URL returns 404 — camp info is on the homepage. Booking system (MarketingIsFun/LeadConnector) shows different prices from website text.

---

## Corrections Applied

| ID | Field | Old | New |
|----|-------|-----|-----|
| All 3 | confirmed2026 | true | false (summer 2026 not posted) |
| All 3 | enrollmentStatus | Open | Likely Coming Soon |
| All 3 | registrationUrl | davincicode.ca/summer-camps (404) | booking widget URLs |
| All 3 | urlVerified | false | true |
| All 3 | startDate/endDate | 2026-07-06/2026-08-28 | null (unconfirmed) |
| All 3 | costNote | (outdated) | Updated with booking widget prices |
| All 3 | campType | Specialty | Summer Camp |

---

## Pricing Discrepancy

Website text shows "Kids summer break camp: $78 Daily, $468 All 6 Days"
Booking widget shows:
- Half day (3hr): $55 tax included
- Full day (6hr): $85 tax included
- Full week: $400

Cannot determine which is current until summer 2026 slots open. Both noted in costNote.

---

## Completeness Check

Provider offers 3 camp formats for summer, all captured:
1. Half Day AM (9am-12pm) — ID 16068
2. Half Day PM (12pm-3pm) — ID 16069
3. Full Day (9am-3pm) — ID 16070

Also offers: Kids Camp ($129/day), Spring Break Camp ($99/day) — these are separate seasonal offerings, not summer-specific.

---

## Notes

- Address: 2-3046 Edgemont Blvd, North Vancouver, BC
- Phone: (604) 715-1576
- Email: info@davincicode.ca / davincicodeacademy@gmail.com
- Hours: 9am-7pm
- Ages: 5-12
- Instructors: Sara Mahjouri, Farahnaz Samari
- Activities: acrylic painting, collage, resin art, fabric design, pottery
- Booking via LeadConnector (MarketingIsFun) platform with Square payments
- Birthday parties also offered ($399 for 8 kids + $18/extra)
