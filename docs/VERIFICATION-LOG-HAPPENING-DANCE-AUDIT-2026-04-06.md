# Verification Log — The Happening Dance Company

**Audited:** 2026-04-06
**Queue entry:** Rank 148
**Source URLs verified:**
- `https://www.thehappeningdance.com` (homepage — Summer Camps section)
- `https://app.jackrabbitclass.com/regv2.asp?hc=6%2C8%2C9&id=527886` (Jackrabbit registration)
**Address:** 5460 Fraser Street, Vancouver, BC
**DB count before audit:** 16,092 programs
**DB count after audit:** 16,092 (no adds — 2 data corrections only)

---

## Summary

The Happening Dance Company offers 2 camp types in Summer 2026:

**Beginner Level ($350 +GST):**
- Week 1: July 6–10, 2026
- Week 2: July 13–17, 2026
- Week 3: July 20–24, 2026
- **Week 4 (Jul 27–31) is NOT offered.**

**ELEVATE 2026 — Intermediate & Advanced ($650 +GST):**
- Week 1: August 10–14, 2026
- Week 2: August 17–21, 2026

**Issues found:**
1. id=80: Beginner PM Jul 27-31 — week NOT offered in 2026 → marked Cancelled
2. id=2138: ELEVATE Week 1 had wrong dates (Aug 6-10 in DB) → corrected to Aug 10-14

---

## Existing Entries Reviewed

| ID | Name | Dates (DB) | Dates (Live) | Status | Action |
|----|------|-----------|-------------|--------|--------|
| 77 | Beginner Summer Dance Camp (AM) | Jul 6-10 | Jul 6-10 ✓ | Open | None |
| 78 | Beginner Summer Dance Camp (PM) | Jul 13-17 | Jul 13-17 ✓ | Open | None |
| 79 | Beginner Summer Dance Camp (AM) | Jul 20-24 | Jul 20-24 ✓ | Open | None |
| 80 | Beginner Summer Dance Camp (PM) | Jul 27-31 | NOT OFFERED ✗ | Open → Cancelled | Fixed |
| 2138 | ELEVATE Dance Intensive | Aug 6-10 | Aug 10-14 ✗ | Open | Fixed dates |
| 2139 | ELEVATE Dance Intensive | Aug 17-21 | Aug 17-21 ✓ | Open | None |

---

## Fixes Applied

| ID | Field | Old Value | New Value |
|----|-------|-----------|-----------|
| 80 | enrollmentStatus | Open | Cancelled |
| 80 | costNote | (none) | July 27-31 week not offered in 2026. Beginner weeks are Jul 6-10, 13-17, 20-24 only. |
| 2138 | startDate | 2026-08-06 | 2026-08-10 |
| 2138 | endDate | 2026-08-10 | 2026-08-14 |

---

## Notes

- Homepage shows "Summer Camps" section with exact week-by-week breakdown — 3 Beginner weeks and 2 ELEVATE weeks
- Beginner camps split AM (4-7yr) / PM (8-14yr) by week — consistent with existing DB structure
- ELEVATE described as "Intermediate & Advanced Levels" — age range 7-18yr in DB retained (no finer breakdown shown on provider page)
- Jackrabbit registration portal (id=527886) does not expose individual session listings in a readable format via browser
- No missing programs identified — 6 DB entries cover all 5 camp sessions (3 Beginner + 2 ELEVATE)
- Registration is OPEN as of audit date
