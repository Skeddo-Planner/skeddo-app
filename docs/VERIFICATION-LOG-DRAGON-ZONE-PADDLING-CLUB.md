# Verification Log — Dragon Zone Paddling Club

**Date:** 2026-04-05
**Auditor:** Claude (automated)
**Provider website:** https://dragonzone.ca/paddle/community/
**Registration page:** https://register.dragonboatbc.ca/code/

---

## Summary

- Provider shows **1 program type** (Summer Paddling Camp, Ages 8-12) with **9 weekly sessions**
- Database had **9 entries** — all "Likely Coming Soon" with incorrect/shifted dates
- **0 programs added, 0 deleted**
- **9 programs updated** — status set to Open, dates corrected, address corrected

---

## Programs Found on Live Registration Page

### Summer Paddling Camp (Ages 8-12)

**Location:** Creekside Community Centre, 1 Athletes Way, Vancouver, BC V5Y 0B1 (Olympic Village waterfront)
**Times:** 9:00 AM – 3:30 PM (drop-off 8:30–9:00 AM, pick-up 3:30–4:00 PM)
**Ages:** 8–12
**Registration:** https://register.dragonboatbc.ca/code/ (currently open)
**Info page:** https://dragonzone.ca/paddle/community/

**Pricing:**
- Regular 5-day week: $400/camper
- 4-day weeks (Canada Day / BC Day): $325/camper
- Discount: Use code SUMMERCAMP25 for 10% off through April 30, 2026
- Multi-camper / multi-week discount: also 10% off

**Included:** All boats, paddles, life jackets provided. Campers bring lunch, snack, water bottle, hat, sunscreen, water-appropriate clothing.

**Program content:** Multi-boat instruction (kayak, SUP, dragon boat, flatwater), cultural education, field trips to local attractions. Certified instructors with First Aid/CPR credentials. Low instructor-to-camper ratios.

| Week | Dates | Days | Cost | Notes |
|------|-------|------|------|-------|
| Week 1 | Jun 29 – Jul 3 | Mon,Tue,Thu,Fri | $325 | 4-day (no Jul 1 Canada Day) |
| Week 2 | Jul 6 – Jul 10 | Mon–Fri | $400 | Full week |
| Week 3 | Jul 13 – Jul 17 | Mon–Fri | $400 | Full week |
| Week 4 | Jul 20 – Jul 24 | Mon–Fri | $400 | Full week |
| Week 5 | Jul 27 – Jul 31 | Mon–Fri | $400 | Full week |
| Week 6 | Aug 4 – Aug 7 | Tue,Wed,Thu,Fri | $325 | 4-day (no Aug 3 BC Day) |
| Week 7 | Aug 10 – Aug 14 | Mon–Fri | $400 | Full week |
| Week 8 | Aug 17 – Aug 21 | Mon–Fri | $400 | Full week |
| Week 9 | Aug 24 – Aug 28 | Mon–Fri | $400 | Full week |

---

## Changes Made to Database

### All 9 entries updated:

**Status:** "Likely Coming Soon" → "Open" (registration is currently open)

**Dates corrected (all were shifted by one week):**
- DB had W1=Jul 6–10, W2=Jul 13–17, etc. — missing the first week (Jun 29–Jul 3)
- DB had W5=Aug 3–7 and W6=Aug 10–14 — wrong: BC Day week is Aug 4–7 (Tue–Fri)
- DB had W9=Aug 31–Sep 4 — wrong: 9th week is Aug 24–28 (registration page confirms)

**Registration URL updated:** From `dragonzone.ca/paddle/community/` to `register.dragonboatbc.ca/code/` (actual booking page)

**Address corrected:**
- DB had "1 Athletes Way, Vancouver" (close but missing full address)
- Confirmed: 1 Athletes Way, Vancouver, BC V5Y 0B1, neighbourhood False Creek

**Cost confirmed:** $400 regular weeks, $325 for 4-day stat holiday weeks (matches DB for regular weeks; 4-day cost was already correct in DB)

---

## Count Verification

| Program | Live page shows | DB before | DB after |
|---------|----------------|-----------|---------|
| Summer Paddling Camp (Ages 8-12) | 9 weeks | 9 | 9 |
| **Total** | **9** | **9** | **9** |

---

## Discrepancies Found & Resolved

1. **All dates shifted:** DB was missing Week 1 (Jun 29–Jul 3) and had an extra Week 9 (Aug 31–Sep 4) that doesn't exist. Fixed all 9 week dates.
2. **BC Day week wrong:** DB had Aug 3–7 (Mon–Fri, wrong — Aug 3 is BC Day stat) → corrected to Aug 4–7 (Tue–Fri)
3. **Status wrong:** All "Likely Coming Soon" → "Open" (registration is open)
4. **Registration URL:** Should point to register.dragonboatbc.ca for actual booking

## Notes

- Provider operates from Creekside Community Centre docks at 1 Athletes Way (Olympic Village), False Creek
- Discount code SUMMERCAMP25 is valid through April 30, 2026 — parents should be informed
- No age group breakdown on registration — single camp for ages 8-12 combined
- Provider also offers Intro to Dragon Boat & Race programs (adult-oriented, not in DB)
