# Verification Log — Evans Lake Forest Education Society

**Audited:** 2026-04-09
**Queue entry:** Rank 239
**Source URLs verified (web fetch):**
- `https://evanslake.com/camp/camp-programs/`
- `https://evanslake.campbrainregistration.com`
**DB count before audit:** 16,379 programs
**DB count after audit:** 16,379 (0 added, 8 corrected)

---

## Summary

8 camp entries completely reworked. DB had them as "Day Camp" with ages 6-12 and cost $470 — all incorrect. Actual programs are overnight camps with ages 8-16 and costs $771-$963+GST. Names updated to match actual camp session types (Youth/Junior Teen/Teen). Dates corrected to match 2026 schedule (Jun 28 - Aug 28). Registration opened Jan 21, 2026.

---

## Corrections Applied

| ID | Field | Old | New |
|----|-------|-----|-----|
| All 8 | activityType | Day Camp | Overnight Camp |
| All 8 | ageMin | 6 | 8-13 (varies by session type) |
| All 8 | ageMax | 12 | 12-16 (varies by session type) |
| All 8 | cost | 470/375 | 963/771 (+GST) |
| All 8 | name | "Evans Lake Day Camp (Week N)" | Specific camp type + session number |
| All 8 | startDate/endDate | Estimated | Verified dates from website |
| All 8 | priceVerified | false | true |

---

## Programs Verified

| ID | Name | Ages | Cost | Dates | Status |
|----|------|------|------|-------|--------|
| evans-lake-w1 | Youth Camp (Camp 2) | 8-12 | $963+GST | Jul 5-10 | Open |
| evans-lake-w2 | Jr Teen Camp (Camp 3) | 10-14 | $963+GST | Jul 12-17 | Open |
| evans-lake-w3 | Youth Camp (Camp 4) | 8-12 | $963+GST | Jul 19-24 | Open |
| evans-lake-w4 | Youth Camp (Camp 5) | 8-12 | $963+GST | Jul 26-31 | Open |
| evans-lake-w5 | Teen Camp (Camp 6) | 13-16 | $963+GST | Aug 2-7 | Open |
| evans-lake-w6 | Jr Teen Camp (Camp 7) | 10-14 | $963+GST | Aug 9-14 | Open |
| evans-lake-w7 | Youth Camp (Camp 8) | 8-12 | $963+GST | Aug 16-21 | Open |
| evans-lake-w8 | Jr Teen Camp (Camp 9) | 10-14 | $771+GST | Aug 24-28 | Open |

---

## Not in DB (available on website but not added)

| Program | Ages | Cost | Dates |
|---------|------|------|-------|
| Camp 1 (Jr Teen) | 10-14 | $963+GST | Jun 28 - Jul 3 |
| Leadership A/B (Camps 2,4,5,8) | 14-16 | $1077+GST | Various |
| OAK Adventure (Camps 3,6,7) | 13-16 | $1167+GST | Various |

---

## Notes

- Location: Evans Lake Forest Education Centre, 15 km north of Squamish, BC
- 61.5 km from Vancouver — borderline for service area
- Registration opened Jan 21, 2026 at 12:00 PM
- Subsidy applications available
- All-gender cabin options and inclusion support
- CampBrain registration system (evanslake.campbrainregistration.com)
- Note: main website (evanslake.com) timed out on Playwright; data verified via WebFetch
