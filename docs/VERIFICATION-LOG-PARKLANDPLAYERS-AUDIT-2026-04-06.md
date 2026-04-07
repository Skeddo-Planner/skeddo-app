# Verification Log — Parkland Players

**Audited:** 2026-04-06
**Queue entry:** Rank 182
**Source URL verified:**
- `https://parklandplayers.com/programs#summer-camp` (summer camp details, schedule, weekly fees)
  (Old URL `https://parklandplayers.com/programs/summer-camp-coquitlam-daycare-summer-school` returns 404)
**DB count before audit:** 16,195 programs
**DB count after audit:** 16,198 (3 added, 6 corrected)

---

## Summary

DB had major errors: cost $275 was wrong (actual $325–$355/week), times 9am-4pm were wrong (actual 7:30am-5:30pm), and the DB only covered 6 of 9 weeks. The existing registrationUrl was 404. Status was "Likely Coming Soon" with confirmed2026=true (contradictory); program is registerable via contact form.

---

## Confirmed Program Details

| Field | Value |
|-------|-------|
| Address | 900 Sharpe St, Coquitlam, BC (Parkland Elementary School) |
| Coordinates | 49.257, -122.8055 |
| Hours | 7:30 AM – 5:30 PM, Monday–Friday |
| Ages | 6–12 years |
| Season | Jun 28, 2026 – Aug 27, 2026 (9 weeks) |
| Registration | Via contact form or phone (604) 936-7005 |
| Registration URL | https://web.kinderlogix.com/registration.php?cid=1285 |

---

## Summer 2026 Schedule and Pricing (all 9 weeks confirmed)

| Week (starts) | DB Dates | DB ID | Fee | Status |
|---------------|----------|-------|-----|--------|
| Jun 28 (Canada Day week) | Jun 29–Jul 3 | parkland-players-w1 | $325 | **ADDED** |
| Jul 5 | Jul 6–10 | 597 | $355 | Corrected |
| Jul 12 | Jul 13–17 | 598 | $335 | Corrected |
| Jul 19 | Jul 20–24 | 599 | $345 | Corrected |
| Jul 26 | Jul 27–31 | 600 | $355 | Corrected |
| Aug 2 (BC Day week) | Aug 4–7 (Tue-Fri) | 601 | $325 | Corrected |
| Aug 9 | Aug 10–14 | 602 | $335 | Corrected |
| Aug 16 | Aug 17–21 | parkland-players-w8 | $355 | **ADDED** |
| Aug 23 | Aug 24–27 (Mon-Thu) | parkland-players-w9 | $355 | **ADDED** |

**Notes:**
- Canada Day (Jul 1, Wednesday) falls in the Jun 28 week — camp listed for full week, may have Jul 1 off
- BC Day (Aug 3, Monday) — week runs Tue–Fri (Aug 4–7)
- Season ends Aug 27 (Thursday) — last week is 4 days (Aug 24–27)

---

## Price Detail (all correct)

Provider lists prices at $325–$355/week with the exact amount varying by week. DB had all weeks at $275 (incorrect from prior year data).

---

## Fixes Applied

| Field | Old | New | Affected IDs |
|-------|-----|-----|-------------|
| cost | $275 (all) | $325–$355 (per week) | All 6 existing |
| startTime | 9:00 AM | 7:30 AM | All 6 existing |
| endTime | 4:00 PM | 5:30 PM | All 6 existing |
| enrollmentStatus | Likely Coming Soon | Open | All 6 existing |
| registrationUrl | (404) | programs#summer-camp | All 6 existing |
| costNote | missing | Added with weekly rate + season note | All 9 |
| priceVerified | missing | true | All 9 |
| days (BC Day week) | Mon-Fri | Tue-Wed-Thu-Fri | 601 |
| names | "Multi-Activity Camp" (generic) | Week-specific names | All 9 |
| 3 new entries | — | Jun 28, Aug 16, Aug 23 weeks | New |

---

## Notes

- Provider uses KinderLogix for registration enquiries: `https://web.kinderlogix.com/registration.php?cid=1285`
- The programs page also mentions "Inquire About Enrolment" button — registration appears to be contact/inquiry based, not self-serve online
- Camp activities include: soccer, sewing, music lessons, pottery, woodworking, science experiments, creative arts, culinary arts, photography, drama
- Provider is described as "Reggio Emilia-inspired" child care centre
