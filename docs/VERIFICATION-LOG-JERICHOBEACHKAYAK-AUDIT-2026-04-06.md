# Verification Log — Jericho Beach Kayak

**Audited:** 2026-04-06
**Queue entry:** Rank 159
**Source URLs verified:**
- `https://jerichobeachkayak.com/summer-camps/` (overview + pricing)
- `https://jerichobeachkayak.com/youth-kayak-programs/full-day-camp/` (full schedule with dates and availability)
- `https://jerichobeachkayak.com/youth-kayak-programs/` (all program types)
**Address:** 1300 Discovery St, Vancouver, BC V6R 4K5 (Jericho Sailing Centre compound)
**DB count before audit:** 16,139 programs
**DB count after audit:** 16,144 (+5 added, 6 corrected)

---

## Summary

Jericho Beach Kayak runs full-day and half-day kayak camps Jun 22–Sep 4 (11 weeks). DB had 6 entries (Jul 6–Aug 14 only) with wrong prices: 3 entries had $315 (half-day price applied to full-day entries) and the BC Day week entry had $569 instead of the reduced 4-day rate of $455. Added 5 missing weeks and fixed all 6 existing entries.

---

## Camp Types Offered

| Program | Ages | Type | Price |
|---------|------|------|-------|
| Fun Kayak Camp | 7-10 | Half Day (9-12 or 1-4) | $315/week |
| Fun Kayak + Coastal Adventures | 7-10 | Full Day (9-4) | $569 / $455 (holiday weeks) |
| Beginner Skills Kayak Camp | 10-14 | Half Day (1-4) | $315/week |
| Beginner Kayak Skills + Coastal Adventures | 10-14 | Full Day (9-4) | $569 / $455 (holiday weeks) |
| Intermediate Camp | 12-15 | Half Day (1-4) | $315/week |
| Private Camp Pods | 7+ | Half/Full Day | $1,495-$2,995 (group of 5) |

---

## 2026 Full Season Schedule

| Week | Dates | Days | Cost | DB Entry | Action |
|------|-------|------|------|----------|--------|
| 1 | Jun 22-26 | Mon-Fri | $569 | JBK-2026-W1 | **Added** |
| 2 | Jun 29-Jul 3 | Mon, Tue, Thu, Fri (Canada Day off) | $455 | JBK-2026-W2 | **Added** |
| 3 | Jul 6-10 | Mon-Fri | $569 | 423 | Fixed cost |
| 4 | Jul 13-17 | Mon-Fri | $569 | 424 | Fixed cost |
| 5 | Jul 20-24 | Mon-Fri | $569 | 425 | Fixed cost |
| 6 | Jul 27-31 | Mon-Fri | $569 | 426 | ✓ |
| 7 | Aug 4-7 | Tue-Fri (BC Day off) | $455 | 427 | Fixed cost $569→$455 |
| 8 | Aug 10-14 | Mon-Fri | $569 | 428 | ✓ |
| 9 | Aug 17-21 | Mon-Fri | $569 | JBK-2026-W9 | **Added** |
| 10 | Aug 24-28 | Mon-Fri | $569 | JBK-2026-W10 | **Added** |
| 11 | Aug 31-Sep 4 | Mon-Fri | $569 | JBK-2026-W11 | **Added** |

---

## Fixes Applied to Existing Entries

| ID | Field | Old | New |
|----|-------|-----|-----|
| 423, 424, 425 | cost | $315 (half-day price!) | $569 |
| 427 | cost | $569 | $455 (4-day BC Day week) |
| All | costNote | (none) | Pricing details added |
| All | ageSpanJustified | (none) | Added (ages 7-14, span=7 > threshold) |
| All | registrationUrl | go.theflybook.com/book/777 | jerichobeachkayak.com/summer-camps/ |
| All | address | missing postal code | Added V6R 4K5 |
| All | name | "Kayak & Nature Camp" | "Jericho Beach Kayak Full Day Camp — Week N" |

---

## Notes

- Half-day camps ($315) not individually listed in DB — follow-up audit recommended
- Registration opens Feb 2 each year; all 2026 spots available as of audit date
- Holiday week pricing confirmed on full-day camp product page
- FlyBook registration system (go.theflybook.com) not rendering accessible content — verified pricing and schedule from jerichobeachkayak.com directly
- Provider website at `jerichobeachkayak.com` (not `jerichoseakayak.com` which is dead)
