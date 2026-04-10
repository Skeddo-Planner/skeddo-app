# Verification Log — Provider Name Standardization (2026-04-10)

**Date:** 2026-04-10
**Method:** Programmatic analysis of provider field values
**DB count:** 16,582 programs (unchanged)
**Violations before:** 0
**Violations after:** 0

---

## Systemic Issue: Duplicate Provider Names

18 CoV community centres had entries split across two provider name variations:
- Abbreviated: "City of Vancouver - [Name] Cmty Centre"
- Full: "City of Vancouver - [Name] Community Centre"

This causes programs from the same facility to appear as separate providers in search/filter, splitting the user experience.

### Root Cause
The CoV ActiveNet importer and manual entry processes used inconsistent abbreviations. The BNB- (Burnaby) importer used "Cmty Centre" consistently, but CoV entries were mixed.

---

## Fixes Applied

Standardized to the form with more entries per pair (635 entries updated):

| Facility | From | To | Count |
|----------|------|----|-------|
| Britannia | Community Centre | Cmty Centre | 2 |
| Champlain Heights | Community Centre | Cmty Centre | 32 |
| Coal Harbour | Community Centre | Cmty Centre | 52 |
| Douglas Park | Community Centre | Cmty Centre | 19 |
| Dunbar | Community Centre | Cmty Centre | 36 |
| False Creek | Community Centre | Cmty Centre | 18 |
| Hastings | Community Centre | Cmty Centre | 17 |
| Hillcrest | Community Centre | Cmty Centre | 47 |
| Kensington | Cmty Centre | Community Centre | 23 |
| Kerrisdale | Community Centre | Cmty Centre | 35 |
| Killarney | Community Centre | Cmty Centre | 84 |
| Marpole-Oakridge | Community Centre | Cmty Centre | 29 |
| Mount Pleasant | Community Centre | Cmty Centre | 56 |
| Renfrew Park | Community Centre | Cmty Centre | 2 |
| Strathcona | Cmty Centre | Community Centre | 20 |
| Thunderbird | Cmty Centre | Community Centre | 31 |
| Trout Lake | Community Centre | Cmty Centre | 91 |
| West End | Community Centre | Cmty Centre | 41 |
| **Total** | | | **635** |

---

## Summary

| Action | Count |
|--------|-------|
| Provider names standardized | 635 |
| Duplicate pairs resolved | 18 |
