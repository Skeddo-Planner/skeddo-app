# Verification Log — Monarch Arts Education (Camp Monarch)

**Audited:** 2026-04-06
**Queue entry:** Rank 149
**Source URLs verified:**
- `https://www.monarcharts.com/camp-monarch`
- `https://www.monarcharts.com/register-for-camp`
**Address:** 333 Chesterfield Ave, North Vancouver, BC V7M 3M2 (Presentation House Theatre)
**DB count before audit:** 16,092 programs
**DB count after audit:** 16,092 (no adds — 6 existing entries corrected, 5 marked Cancelled)

---

## Summary

Camp Monarch 2026 is a **single 2-week cohort** running **July 6–17, 2026**, for ages 5–12.
It is NOT offered as individual weekly sessions.

The DB had 6 separate weekly entries (ids 143–148) with multiple errors:
- Wrong structure: 6 weekly slots instead of 1 two-week cohort
- Wrong name: "Musical Theatre Camp" (correct: "Camp Monarch — Music, Art, Dance & Theatre")
- Wrong address: "1277 Marine Dr" (correct: 333 Chesterfield Ave — Presentation House Theatre)
- Wrong price: $325/week (correct: $950 for 2 weeks)
- Wrong status: "Likely Coming Soon" (registration IS open)
- confirmed2026=false (should be true)

**Fixes:**
- id=143: Fully corrected to the actual 2-week Jul 6–17 camp
- ids 144–148: Marked Cancelled (standalone weeks were never offered)

---

## Verified Program Details

| Field | Value |
|-------|-------|
| Name | Camp Monarch — Music, Art, Dance & Theatre |
| Dates | July 6–17, 2026 (2 weeks) |
| Ages | 5–12 (single mixed-age cohort, Orff-Schulwerk ensemble) |
| Hours | 9:00 AM – 3:00 PM (Full Day) |
| Before Care | 8:00 AM – 9:00 AM (included) |
| After Care | 3:00 PM – 5:00 PM ($195 extra) |
| Price | CA$950 (sibling: CA$860) |
| Status | Open (Register Now active) |
| Location | Presentation House Theatre, 333 Chesterfield Ave, North Vancouver |

---

## Price Verification

From `https://www.monarcharts.com/register-for-camp`:

| Product | Price |
|---------|-------|
| Camp Monarch, July 6-17, 2026 | CA$950.00 |
| Camp Monarch, July 6-17, 2026 - Sibling | CA$860.00 |
| After Camp Care, July 6-17, 2026 | CA$195.00 |

---

## Fixes Applied (id=143)

| Field | Old Value | New Value |
|-------|-----------|-----------|
| name | Musical Theatre Camp | Camp Monarch — Music, Art, Dance & Theatre |
| address | 1277 Marine Dr, North Vancouver, BC | 333 Chesterfield Ave, North Vancouver, BC V7M 3M2 |
| neighbourhood | (unset) | Lower Lonsdale |
| startDate | 2026-07-06 | 2026-07-06 ✓ |
| endDate | 2026-07-10 | 2026-07-17 (2-week camp) |
| cost | $325 | $950 |
| enrollmentStatus | Likely Coming Soon | Open |
| confirmed2026 | false | true |
| priceVerified | (unset) | true |
| registrationUrl | /camp-monarch | /register-for-camp |
| costNote | (none) | CA$950 for 2-week camp; sibling CA$860; After Care CA$195 |

## Cancelled Entries (ids 144–148)

| ID | Original Dates | Reason |
|----|---------------|--------|
| 144 | Jul 13–17 | Not offered as standalone — week 2 of cohort |
| 145 | Jul 20–24 | Not offered in 2026 |
| 146 | Jul 27–31 | Not offered in 2026 |
| 147 | Aug 4–7 | Not offered in 2026 |
| 148 | Aug 10–14 | Not offered in 2026 |

---

## Gap Analysis

| Category | Live | In DB before | Fixed | Net |
|----------|------|-------------|-------|-----|
| Camp Monarch 2-week cohort | 1 | 0 (wrong structure) | 1 | 0 |
| Non-offered standalone weeks | 0 | 5 (wrong entries) | 0 (Cancelled) | 0 |

---

## Notes

- Camp Monarch is in its 24th year (per site: "Celebrating 24 Years")
- Single cohort: children audition for groups by age/experience within the 5–12 range
- Performance for family/friends on final day (Week 2 conclusion, 2:30–3:30 PM)
- After Camp Care NOT available on final performance day
- Registration is OPEN as of audit date (April 6, 2026)
- ageSpanJustified set for all 6 entries: Orff-Schulwerk mixed-age ensemble, no age-band splits
