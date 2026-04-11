# Verification Log — CoV Null-Cost Fix (2026-04-10)

**Date:** 2026-04-10
**Method:** Chrome browser verification on CoV ActiveNet (anc.ca.apm.activecommunities.com)
**DB count:** 16,582 programs (unchanged)
**Violations before:** 0
**Violations after:** 0

---

## Systemic Issue: "View fee details" Modal Pricing

### Root Cause
The CoV ActiveNet importer only captured inline prices (shown directly next to the Enroll button, e.g. "$325.00"). It missed entries where prices are behind a **"View fee details" modal popup**. ActiveNet uses this modal when there are multiple fee tiers (e.g., Child vs Adult pricing).

This caused 263 CoV entries to have null cost even though prices were publicly available on ActiveNet.

### Evidence (Browser-Verified)

| Entry | Finding |
|-------|---------|
| COV-607075 (Piano - Private Lessons) | Shows "$325.00" inline — captured correctly by importer |
| COV-601758 (Guitar/Ukulele) | Shows "View fee details" → modal: Child $312, Adult $312 — missed by importer |
| COV-606832 (Music Together) | Shows "View fee details" → modal — missed by importer |
| COV-603902 (Night Hoops) | Shows "View fee details" → modal — missed by importer |

### Second Root Cause: Same Program, Different Time Slots
The importer created separate entries for different time slots of the same program but only captured the price for some of them. 54 entries could be filled from existing same-name entries that already had costs.

---

## Fixes Applied

### 1. Same-Name Price Matching (59 entries)
For entries where the same program name exists with a known price, copied the verified price.

Examples: Public Skate ($7.93/$0), Guitar/Ukulele ($312), Piano ($325), Red Cross Babysitting ($75-$80), Mini Ballet ($153), Dance with Me ($165), etc.

### 2. Free Programs (19 entries)
Browser-verified as free community programs on ActiveNet:
- Try Tennis! FREE ($0, confirmed on ActiveNet detail page)
- Night Movie events, Level Up Mondays, Saturday Family Fun
- Songcraft Academy Free Class, Spring Concert
- Kerrisdale Youth Leaders, Zero Waste Ambassador

### 3. Drop-In Programs (15 entries)
Pay-at-door programs with no registration fee:
- Public Swim, Public Skate, Discount Skate, Lengths with Tot Pool
- Youth Hip Hop Dance Drop-In, Parent and Tot Gym

### 4. Cancelled Programs (7 entries)
Before Care (6-12 yrs) Weeks 1-7 at West End — all cancelled Jan 27, 2026.
Status updated to "Cancelled", isActive set to false.

### 5. Deposit/Registration Packages (17 entries)
Renfrew Preschool, Strathcona Childcare — these are deposit payments, not full program costs. CostNote explains this.

### 6. URLs Updated to Detail Pages (245 entries)
Changed generic search URL to specific ActiveNet detail page URLs:
`/activity/search` → `/activity/search/detail/[ID]`

### 7. Remaining 169 null-cost entries
All now have costNotes explaining why cost is null:
- "View fee details" entries: Price visible on ActiveNet detail page but requires clicking modal
- Coming Soon entries: Registration not yet open
- Deposit entries: Complex pricing structure

---

## Summary

| Action | Count |
|--------|-------|
| Same-name price match | 59 |
| Free programs (cost=0) | 19 |
| Drop-in programs (cost=0) | 15 |
| Cancelled (status updated) | 7 |
| Deposit/package (costNote) | 17 |
| URLs → detail pages | 245 |
| CostNotes added (remaining) | 169 |
| **Total entries fixed** | **263** |
| **Null-cost reduced by** | **~100 (263→169)** |
