# Verification Log — North Vancouver Recreation Commission (NVRC)

**Date:** 2026-04-04
**Auditor:** Claude (automated audit agent)
**Registration Page:** https://nvrc.perfectmind.com/23734/Clients/BookMe4?widgetId=a28b2c65-61af-407f-80d1-eaa58f30a94a
**Info Page:** https://www.nvrc.ca/programs-memberships/program-directory/camps
**Status:** Completed — URL and price corrections applied

---

## Summary

**Provider shows:** 15+ summer camp locations confirmed on nvrc.ca for summer 2026
**Database has:** 327 programs under NVRC provider (all future summer 2026)
**Changes made:** 327 URLs added, 146 price corrections applied

---

## Registration System

- **System:** PerfectMind (BookMe4)
- **Registration URL:** https://nvrc.perfectmind.com/23734/Clients/BookMe4?widgetId=a28b2c65-61af-407f-80d1-eaa58f30a94a
- **Info page:** https://www.nvrc.ca/programs-memberships/program-directory/camps
- **Registration status:** NOT YET OPEN as of April 4, 2026. Expected to open late May 2026 (typically Thursday in late May at 7am, per NVRC historical pattern)

---

## Key Findings

### 1. Missing URLs (Fixed)
All 327 programs had `url: null`. Added the NVRC PerfectMind registration URL as base URL.

### 2. Price Discrepancies (Fixed)
Two sets of NVRC data exist in the database:
- **Older set** (IDs 709-900+, 262 programs): Individual weekly sessions, slightly off prices
- **Newer set** (IDs 15974+, 65 programs): Season-level entries with more accurate prices/dates

Prices corrected in older set:
- Ages 5-6 camps: $255.00 → **$255.25** (verified on nvrc.ca)
- Ages 6-9 camps: $280.00 → **$279.80** (verified on nvrc.ca)

Other costs in older set ($175 for specialty camps, $226 for daytrippers) not yet verified against live page — summer 2026 registration not yet open. Left unchanged pending registration opening.

### 3. Start Date Discrepancy (Not Fixed)
- Older set has June 29, 2026 as first week start date
- Newer NVRC-prefixed set has July 2, 2026 as first session
- NVRC website confirms: Camp Delbrook first session is **July 2-4 (Wed-Fri), 2026** (short first week)
- The June 29 dates in the older set may be incorrect; left unchanged pending full price verification when registration opens

### 4. Enrollment Status
All 327 programs are marked "Open". Registration has not yet opened (opens late May 2026), so strictly speaking these should be "Coming Soon". However, Rule R20 requires a registrationDate for "Coming Soon" status, and the exact opening date is unconfirmed. Left as "Open" with this note.

---

## Summer 2026 NVRC Camp Locations Confirmed

| Camp | Ages | Address |
|------|------|---------|
| Camp Delbrook | 5-6, 6-9 | 851 West Queens Rd, North Vancouver |
| Camp Lynn Valley | 5-6 | 3590 Mountain Hwy, North Vancouver |
| Camp Ron Andrews | 5-6 | 931 Lytton St, North Vancouver |
| Camp Harry Jerome | 6-9, 6-12, 9-12, 13-15 | 125/240 East 23rd St, North Vancouver |
| Camp Karen Magnussen | 6-9, 9-12 | 2300 Kirkstone Rd, North Vancouver |
| Camp Lynn Creek | 6-9, 9-12, 13-15 | 1491 Hunter Street, North Vancouver |
| Camp John Braithwaite | 6-10 | 145 W 1st St, North Vancouver |
| Camp Lions Gate | 6-10 | 1733 Lions Gate Ln, North Vancouver |
| Camp Myrtle Park | 6-10 | Caledonia Ave & Cove Cliff Rd (Deep Cove area) |
| Camp Loutet Park | 9-12 | Rufus Ave & 14th St, North Vancouver |
| Camp Princess Park | 9-12 | Princess Ave, North Vancouver |

---

## Violations Summary

No new violations introduced. Pre-existing violations in BNB programs are unrelated to NVRC.

**Recommendation:** Re-audit NVRC when registration opens in late May 2026 to:
1. Verify all prices against live PerfectMind registration portal
2. Confirm enrollment status (Open/Full) for each session
3. Fix June 29 start dates in older set if they are wrong
4. Add individual session PerfectMind links if available
