# Verification Log — Burnaby + NVRC + ActiveNet Age Fix (2026-04-10)

**Date:** 2026-04-10
**Method:** Chrome browser verification on Burnaby ActiveNet and NVRC website
**DB count:** 16,582 programs (unchanged)
**Violations before:** 0
**Violations after:** 0

---

## Burnaby Fixes

### Bonsor Day Camp (14 entries, IDs 971-984)
Browser-verified on Burnaby ActiveNet detail pages (#95081, #95090).

| Field | Before | After | Evidence |
|-------|--------|-------|----------|
| name | Bonsor Day Camp (Ages 6-8/9-12) | Bonsor Summer Camp - JR/Senior | ActiveNet program title |
| ageMin/ageMax (JR) | 6-8 | 5-7 | ActiveNet: "at least 5 yrs but less than 8 yrs" |
| ageMin/ageMax (Senior) | 9-12 | 8-11 | ActiveNet: "at least 8 yrs but less than 12 yrs" |
| endTime | 4:00 PM | 3:30 PM | ActiveNet detail page |
| enrollmentStatus | Open | Full | ActiveNet: full with waitlist |
| priceVerified | false | true | Browser-verified on ActiveNet |

### Cameron / Confederation / Eileen Dailly / Kensington (56 entries, IDs 999-1068)
Searched Burnaby ActiveNet for "summer camp", "day camp", "cameron", and "camp" with July-August date filter. These 4 facilities have **zero camp listings** on ActiveNet.

| Facility | Action | Reason |
|----------|--------|--------|
| Cameron Recreation Centre | enrollmentStatus → "Likely Coming Soon", confirmed2026 → false | Not on ActiveNet |
| Confederation Park Recreation Centre | enrollmentStatus → "Likely Coming Soon", confirmed2026 → false | Not on ActiveNet |
| Eileen Dailly Recreation Centre | enrollmentStatus → "Likely Coming Soon", confirmed2026 → false | Not on ActiveNet |
| Kensington Recreation Centre | enrollmentStatus → "Likely Coming Soon", confirmed2026 → false | Not on ActiveNet |

### Root cause
These entries were manually created (no ActiveNet IDs, generic search URL) based on an assumption that these facilities would offer summer camps. They were never verified on the actual registration system.

---

## NVRC Fixes

### Deactivated 97 old generic entries (IDs 869-965)
These were per-week entries with generic "6-12" age ranges, superseded by 48 properly broken-out entries (IDs 15992-16158) with correct age groups from the NVRC website.

### Verified NVRC full-day camp pricing (178 entries)
Cross-referenced against nvrc.ca/camps pricing table. All prices correct:
- 6-12yrs: $279.80 (5-day), $223.84 (4-day) ✅
- 5-6yrs: $255.25 (5-day), $204.20 (4-day) ✅
- 9-12yrs: $279.80 (5-day), $223.84 (4-day) ✅

### Part-day camp pricing
NVRC PerfectMind portal requires login to view pricing — not publicly accessible. Updated costNote on 48 new entries to explain.

---

## Systemic ActiveNet Off-by-One Age Fix

### Analysis
ActiveNet uses "less than X yrs" format. Some entries had ageMax=X instead of X-1.
- BNB- importer was generally correct (cross-verified Willingdon, Wesburn, Charles Rummel, Riverway all match)
- Off-by-one errors were in specific programs, not universal
- 55 entries fixed where program name contained age range that didn't match ageMax

### Entries fixed (55 total)
Programs across Jr Golf, Brit Gymnastics, Sportball, Split Second Basketball, Axe Capoeira, Dancepl3y, Fencing, Chess, Taekwondo, and others. Full list in fix script output.

### Remaining risk
~2,276 COV-/BNB- entries don't have age ranges in their names, so off-by-one can't be detected from name alone. However, the importer was verified as generally correct, so the risk is low.

---

## Summary

| Action | Count |
|--------|-------|
| Bonsor age/time/status fixed | 14 |
| Unverifiable facilities → Coming Soon | 56 |
| NVRC old generic entries deactivated | 97 |
| NVRC new entries costNote updated | 48 |
| NVRC full-day prices verified correct | 178 |
| Off-by-one ageMax fixed | 55 |
| **Total entries verified/fixed** | **448** |
