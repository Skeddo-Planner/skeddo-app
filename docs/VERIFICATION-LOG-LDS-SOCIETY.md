# Verification Log — LDS Society

**Date:** 2026-04-05
**Auditor:** Claude (automated)
**Registration Page:** https://ldsociety.ca/program/camps/
**Application Portal:** https://apply.ldsociety.ca
**Status:** COMPLETED

---

## Summary

| Metric | Value |
|--------|-------|
| Programs found on live page | 4 (2 program types × 2 sessions each) |
| Programs in database | 8 |
| Programs added | 0 |
| Programs fixed | 4 (corrected dates, pricing, days) |
| Unconfirmed sessions | 4 (set to Likely Coming Soon) |

---

## Programs Found on Live Page

### Young Scientists (Grades 1–3, approx. ages 6–9)
- **Activities:** Color-changing potions, volcano building, animal rescues, paper airplane design
- **Schedule:** Monday–Thursday, 9:00 AM – 4:00 PM
- **Session 1:** July 13–16, 2026
- **Session 2:** August 10–13, 2026
- **Max group size:** 10 students

### Earth Explorers (Grades 4–6, approx. ages 9–12)
- **Activities:** Rainforest ecosystems, desert adaptations, mountain formation, ocean investigations
- **Schedule:** Monday–Thursday, 9:00 AM – 4:00 PM
- **Session 1:** July 27–30, 2026
- **Session 2:** August 24–27, 2026
- **Max group size:** 10 students

### Pricing (Sliding Scale — per 4-day camp)
| Household Income | Fee |
|---|---|
| $0–$70,000 | $210 |
| $70,000–$85,000 | $330 |
| $85,000–$120,000 | $450 |
| $120,000+ | $580 |

**Location:** East Vancouver Learning Centre, 3292 East Broadway, Vancouver, BC

**Registration:** Apply at apply.ldsociety.ca — new families require an intake interview; returning learners have a shorter call.

---

## Database Changes Made

### Fixed (dates, cost, days corrected)

| ID | Name | Old Dates | New Dates | Old Cost | New Cost |
|----|------|-----------|-----------|----------|----------|
| 219 | Young Scientists STEAM Camp | Jul 21–25 (Mon-Fri) | Jul 13–16 (Mon-Thu) | $495 | null (sliding scale) |
| 222 | Young Scientists STEAM Camp | Aug 11–15 (Mon-Fri) | Aug 10–13 (Mon-Thu) | $495 | null (sliding scale) |
| 224 | Earth Explorers STEAM Camp | Jul 28–Aug 1 (Mon-Fri) | Jul 27–30 (Mon-Thu) | $495 | null (sliding scale) |
| 226 | Earth Explorers STEAM Camp | Aug 11–15 (Mon-Fri) | Aug 24–27 (Mon-Thu) | $495 | null (sliding scale) |

All 4 updated entries: `confirmed2026: true`, `priceVerified: true`, `registrationUrl: https://ldsociety.ca/program/camps/`

### Set to "Likely Coming Soon" (sessions not shown on live page)

| ID | Name | Old Dates | Reason |
|----|------|-----------|--------|
| 220 | Young Scientists STEAM Camp | Jul 28–Aug 1 | Not on live page; only 2 sessions offered |
| 221 | Young Scientists STEAM Camp | Aug 5–8 | Not on live page; only 2 sessions offered |
| 223 | Earth Explorers STEAM Camp | Jul 21–25 | Not on live page; only 2 sessions offered |
| 225 | Earth Explorers STEAM Camp | Aug 5–8 | Not on live page; only 2 sessions offered |

All 4 unconfirmed entries: `confirmed2026: false`, `priceVerified: false`, cost set to null with sliding scale note.

---

## Key Discrepancies Found

1. **Dates wrong:** All 8 database entries had incorrect dates. Our data had Mon-Fri 5-day weeks; live page shows Mon-Thu 4-day camps.
2. **Cost wrong:** Database had flat $495; actual cost is sliding scale $210–$580 based on household income.
3. **Too many sessions:** Database had 4 sessions per program type; live page shows only 2 per type.
4. **Registration URL:** Should point to ldsociety.ca/program/camps/ (camp info page with "Apply Now" button to apply.ldsociety.ca).
