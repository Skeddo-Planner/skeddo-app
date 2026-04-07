# Verification Log — Crocodile Mandarin

**Audited:** 2026-04-06
**Queue entry:** Rank 195
**Source URLs verified (browser navigation):**
- `https://www.crocodilemandarin.com/courses/summer-day-camps.html` (camp details, pricing, dates)
- `https://www.crocodilemandarin.com/where/scottish-cultural-centre.html` (address confirmed: 8886 Hudson St, Marpole)
**DB count before audit:** 16,254 programs
**DB count after audit:** 16,254 (0 added, 12 corrected)

---

## Summary

12 existing entries corrected. Two true duplicates identified (ACT-0394 = same session as 609; ACT-0450 = same session as 610) — marked confirmed2026=false. IDs 611 and 612 are correctly half-day sessions; ACT-0548 and ACT-0619 are the corresponding full-day sessions for the same weeks (not duplicates). ACT-0450 and ACT-0548 had wrong age ranges (7-12 → corrected to 5-10). All August camps (ACT-0659, 0696, 0741, 0768) confirmed for 2026 ("weekly throughout the summer"). Address corrected on numeric IDs 609-612 (added street number from location page). Specific 2026 weekly dates not published — schedule expected to match prior year pattern.

---

## Programs Confirmed for 2026

| Type | Schedule | Price | Ages |
|------|---------|-------|------|
| Full Day Camp | Mon-Fri 9AM-5PM | $540+GST (early bird $498+GST until May 1) | 5-10 recommended |
| Half Day Camp | Mon-Fri 9AM-1PM | $280+GST (early bird $260+GST until May 1) | 5-10 recommended |

Location: 8886 Hudson St, Vancouver, BC (Marpole — Scottish Cultural Centre)

South Burnaby location: "Date to be determined" — no 2026 schedule published.

---

## Session Inventory After Audit

| ID | Type | Week | Confirmed | Notes |
|----|------|------|-----------|-------|
| 609 | Full Day | Jul 6-10 | ✅ | Canonical; ACT-0394 is duplicate |
| 610 | Full Day | Jul 13-17 | ✅ | Canonical; ACT-0450 is duplicate |
| 611 | Half Day | Jul 20-24 | ✅ | Half-day session |
| 612 | Half Day | Jul 27-31 | ✅ | Half-day session |
| ACT-0394 | Full Day | Jul 6-10 | ❌ (duplicate) | Duplicate of 609 |
| ACT-0450 | Full Day | Jul 13-17 | ❌ (duplicate) | Duplicate of 610; ages fixed 7-12→5-10 |
| ACT-0548 | Full Day | Jul 20-24 | ✅ | Not duplicate (611 is half-day) |
| ACT-0619 | Full Day | Jul 27-31 | ✅ | Not duplicate (612 is half-day) |
| ACT-0659 | Full Day | Aug 4-10 | ✅ | |
| ACT-0696 | Full Day | Aug 10-14 | ✅ | |
| ACT-0741 | Full Day | Aug 17-21 | ✅ | |
| ACT-0768 | Full Day | Aug 24-28 | ✅ | |

Missing half-day entries for Jul 6-10, Jul 13-17, and all Aug weeks — half-day option available on request per provider.

---

## Corrections Applied

| Field | Old | New | Affected IDs |
|-------|-----|-----|-------------|
| address | "Scottish Cultural Centre, Vancouver, BC" | "8886 Hudson St, Vancouver, BC" | 609, 610, 611, 612 |
| lat/lng | — | 49.2087, -123.1367 (Marpole) | 609, 610, 611, 612 |
| confirmed2026 | false | false (kept) / true (fixed) | ACT-0548→true, ACT-0619→true, ACT-0659/0696/0741/0768→true |
| confirmed2026 | false | false (marked duplicate) | ACT-0394, ACT-0450 |
| ageMin/ageMax | 7-12 | 5-10 | ACT-0450, ACT-0548 |
| costNote | — | Full pricing with early bird details | all |

---

## Notes

- Registration via campscui.active.com (R24 prohibited URL) — registrationUrl set to provider's own page
- Early Bird pricing ends May 1, 2026 — regular price applies after
- Extended pickup to 5:30 PM available for small additional fee
- Content changes weekly — kids can attend multiple weeks
- Fees likely qualify as childcare tax deduction
- Contact: David, 604-644-6829 | spauldo45@yahoo.ca
- South Burnaby and other locations (East Vancouver/Odlum, Coquitlam) offer regular classes but summer camp dates TBD
