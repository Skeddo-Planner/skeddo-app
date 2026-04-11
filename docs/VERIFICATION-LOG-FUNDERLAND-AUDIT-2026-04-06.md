# Verification Log — Funderland

**Audited:** 2026-04-06
**Queue entry:** Rank 162
**Source URLs verified:**
- `https://funderland.ca/` (home page — full 2026 fee schedule, dates, locations, registration form)
- `https://funderland.ca/summer-camp/` (program detail page)
**Addresses:**
- Vancouver: 1708 W 16th Ave, Vancouver, BC V6J 2M1
- West Vancouver: 1290 3rd St, West Vancouver, BC V7S 2Y2
**DB count before audit:** 16,173 programs
**DB count after audit:** 16,177 (+4 added, 6 corrected)

---

## Summary

Funderland runs full-day summer camps at two locations (Vancouver and West Vancouver) for children ages 5-10 (K-Grade 4). The DB had 6 entries (ids 565-570) covering only weeks 2-7 (Jul 6–Aug 14), all with cost=null. All prices now confirmed from live fee schedule. Added 4 missing weeks.

---

## 2026 Fee Schedule (All confirmed from funderland.ca homepage)

| Week | Dates | Days | Regular | Early Bird |
|------|-------|------|---------|------------|
| Jul W1 | Jul 2-3 (Thu-Fri) | Thu, Fri | $170 | $139 |
| Jul W2 | Jul 6-10 | Mon-Fri | $420 | $399 |
| Jul W3 | Jul 13-17 | Mon-Fri | $420 | $399 |
| Jul W4 | Jul 20-24 | Mon-Fri | $420 | $399 |
| Jul W5 | Jul 27-31 | Mon-Fri | $420 | $399 |
| Aug W1 | Aug 4-7 (Tue-Fri) | Tue-Fri | $370 | $350 |
| Aug W2 | Aug 10-14 | Mon-Fri | $420 | $399 |
| Aug W3 | Aug 17-21 | Mon-Fri | $420 | $399 |
| Aug W4 | Aug 24-28 | Mon-Fri | $420 | $399 |
| Aug W5 | Aug 31-Sep 4 | Mon-Fri | $420 | $399 |

**Hours:** 9:00 AM – 4:30 PM | **Ages:** 5-10 (K-Grade 4)

---

## DB Changes

| Week | DB Entry | Action |
|------|----------|--------|
| Jul W1 (Jul 2-3) | FL-2026-JULW1 | **Added** ($170, Thu-Fri) |
| Jul W2 (Jul 6-10) | 565 | Fixed cost null→$420, ageMax 11→10, address, name |
| Jul W3 (Jul 13-17) | 566 | Fixed cost null→$420, ageMax, address, name |
| Jul W4 (Jul 20-24) | 567 | Fixed cost null→$420, ageMax, address, name |
| Jul W5 (Jul 27-31) | 568 | Fixed cost null→$420, ageMax, address, name |
| Aug W1 (Aug 4-7) | 569 | Fixed cost null→$370, days Mon-Fri→Tue-Fri, ageMax, address, name |
| Aug W2 (Aug 10-14) | 570 | Fixed cost null→$420, ageMax, address, name |
| Aug W3 (Aug 17-21) | FL-2026-AUGW3 | **Added** ($420) |
| Aug W4 (Aug 24-28) | FL-2026-AUGW4 | **Added** ($420) |
| Aug W5 (Aug 31-Sep 4) | FL-2026-AUGW5 | **Added** ($420) |

---

## Fixes Applied to Existing Entries (ids 565-570)

| Field | Old | New |
|-------|-----|-----|
| cost | null | $420 (standard); $370 for id=569 BC Day week |
| priceVerified | false | true |
| costNote | "Inquire with provider" | Full pricing details added |
| ageMax | 11 | 10 (K-Grade 4 = max age 10) |
| address | "1708 W 16th St, Vancouver, BC V6J 2M1" | "1708 W 16th Ave, Vancouver, BC V6J 2M1" |
| name | "Fun & Field Trips Camp" | "Funderland Summer Camp — [Month] Week N (dates)" |
| id=569 days | Mon-Fri | Tue, Wed, Thu, Fri (BC Day Aug 3 off) |

---

## Notes

- Canada Day Jul 1 (Mon): Camp runs only Thu Jul 2 - Fri Jul 3 = 2-day partial week at $170
- BC Day Aug 3 (Mon): Camp runs Tue Aug 4 - Fri Aug 7 = 4-day week at $370
- Second location at West Vancouver (1290 3rd St) has same schedule/pricing — not yet added to DB separately. Follow-up audit recommended to add West Vancouver location entries
- Registration form on homepage allows multi-week booking via checkbox list — no per-week booking pages
- School year ends Sep 6, 2026; camp ends Sep 4
- Early bird pricing applies when booking in advance; DB uses regular (non-early-bird) price per convention
