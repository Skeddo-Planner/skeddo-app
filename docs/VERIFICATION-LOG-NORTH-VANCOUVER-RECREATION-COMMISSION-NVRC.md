# Verification Log — North Vancouver Recreation Commission (NVRC)

**Date:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Registration Page:** https://nvrc.perfectmind.com/23734/Clients/BookMe4?widgetId=a28b2c65-61af-407f-80d1-eaa58f30a94a
**Info Page:** https://www.nvrc.ca/programs-memberships/program-directory/camps
**Status:** Partially complete — Chrome browser tools unavailable in this session; some fixes applied from nvrc.ca info page; full PerfectMind audit deferred to registration opening (expected late May 2026)

---

## Audit Method

- **Primary source used:** nvrc.ca info page (WebFetch)
- **Chrome browser (PerfectMind):** NOT available — `mcp__Claude_in_Chrome__navigate` tools not loaded in this CLI session
- **PerfectMind API:** Attempted — all API endpoint patterns returned 404 (PerfectMind endpoints not accessible via direct API calls for this instance)
- **Registration status:** NOT YET OPEN as of April 5, 2026. Expected to open late May 2026.

---

## Summary

**Provider shows (nvrc.ca):** 20 full-day camp programs + 47 part-day specialty camps across 15+ locations
**Database had:** 327 programs under NVRC provider
**Changes made:**
- 14 Daytripper programs: cost corrected $226 → $226.17
- 102 old-style specialty camps: removed unverified $175 price (set cost=null, priceVerified=false)
- 1 program added: Board Games Camp (Ages 9-12, Parkgate)
**Total after audit:** 328 programs

---

## Programs Found on nvrc.ca

### Full-Day Camps

| Camp | Age Range | Location | Address | Times | Price (5-day) | Price (4-day) |
|------|-----------|----------|---------|-------|---------------|---------------|
| Camp Delbrook | 5-6 | Delbrook CRC | 851 West Queens Rd | M-F 9:00-15:00 | $255.25 | $204.20 |
| Camp Lynn Valley | 5-6 | Lynn Valley CC | 3590 Mountain Hwy | M-F 9:00-15:00 | $255.25 | $204.20 |
| Camp Ron Andrews | 5-6 | Ron Andrews CRC | 931 Lytton St | M-F 9:00-15:00 | $255.25 | $204.20 |
| Camp Delbrook | 6-9 | Delbrook CRC | 851 West Queens Rd | M-F 8:45-16:15 | $279.80 | $223.84 |
| Camp Harry Jerome | 6-9 | Harry Jerome CRC | 240 East 23rd St | M-F 8:45-16:15 | $279.80 | $223.84 |
| Camp Karen Magnussen | 6-9 | Karen Magnussen CRC | 2300 Kirkstone Rd | M-F 8:45-16:15 | $279.80 | $223.84 |
| Camp Lynn Creek | 6-9 | Lynn Creek CRC | 1491 Hunter St | M-F 8:45-16:15 | $279.80 | $223.84 |
| Camp John Braithwaite | 6-10 | John Braithwaite CC | 145 W 1st St | M-F 8:45-16:15 | $279.80 | $223.84 |
| Camp Lions Gate | 6-10 | Lions Gate CRC | 1733 Lions Gate Ln | M-F 8:45-16:15 | $279.80 | $223.84 |
| Camp Myrtle Park | 6-10 | Myrtle Park (outdoor) | Caledonia Ave & Cove Cliff Rd | M-F 8:45-16:15 | $279.80 | $223.84 |
| Camp Harry Jerome | 6-12 | Harry Jerome CRC | 125/240 East 23rd St | M-F 8:45-16:15 | $279.80 | n/a |
| Camp Karen Magnussen | 6-12 | Karen Magnussen CRC | 2300 Kirkstone Rd | M-F 8:45-16:15 | $279.80 | n/a |
| Camp JBCC | 6-12 | John Braithwaite CC | 145 West 1st St | M-F 8:45-16:15 | $279.80 | n/a |
| Camp Harry Jerome | 9-12 | Harry Jerome CRC | 240 East 23rd St | M-F 8:45-16:15 | $279.80 | $223.84 |
| Camp Karen Magnussen | 9-12 | Karen Magnussen CRC | 2300 Kirkstone Rd | M-F 8:45-16:15 | $279.80 | $223.84 |
| Camp Loutet Park | 9-12 | Loutet Park (outdoor) | Rufus Ave & 14th St | M-F 8:45-16:15 | $279.80 | $223.84 |
| Camp Princess Park | 9-12 | Princess Park (outdoor) | Princess Ave | M-F 8:45-16:15 | $279.80 | $223.84 |
| Camp Lynn Creek | 9-12 | Lynn Creek CRC | 1491 Hunter St | M-F 8:45-16:15 | $279.80 | $223.84 |
| Camp Daytrippers Harry Jerome | 13-15 | Harry Jerome CRC | 125 East 23rd St | Tu-Th 9:30-16:30 | $226.17 (3-day) | n/a |
| Camp Daytrippers Lynn Creek | 13-15 | Lynn Creek CRC | 1491 Hunter St | Tu-Th 9:30-16:30 | $226.17 (3-day) | n/a |

**Season:** July 2-4 through August 25-29 (9 weekly sessions)
- Short weeks: Canada Day (July 2-4), BC Day (August 4/5-8)
- Daytrippers run July 8-10 through August 19-21

### Part-Day Specialty Camps (prices not listed on nvrc.ca — register via PerfectMind)

| Camp | Age | Location | In DB? |
|------|-----|----------|--------|
| Camp Littlest Campers | 2-3 | Delbrook | ✓ ID 15994 |
| Camp Little Campers | 3-4 | Delbrook | ✓ ID 15993 |
| Little Campers | 3-5 | Ron Andrews | ✓ ID 15995 |
| Art & Games Camp | 4-6 | John Braithwaite | ✓ ID 15992 |
| Sport & Climb Camp | 4-6 | Parkgate | ✓ ID 15996 |
| Multisport & Games Camp | 4-6 | Lynn Creek | ✓ ID 15997 |
| Multisport & Games Camp | 4-6 | Karen Magnussen | ✗ MISSING |
| Art & Mixed Media Camp | 5-8 | Memorial | ✓ ID 15999 |
| Art & Cook Camp | 5-8 | Parkgate | ✓ ID 16001 (DB says 6-8 min) |
| Art Exploration Camp | 5-8 | Parkgate | ✓ ID 16004 (DB says 6-8 min) |
| Clay & Art Camp | 5-8 | Parkgate | ✓ ID 16009 (DB says 6-8 min) |
| Clay & Cook Camp | 5-8 | Parkgate | ✓ ID 16036 (DB says 6-8 min) |
| Science & Games Camp | 5-8 | John Braithwaite | ✓ ID 16023 (DB says 6-9 min) |
| Painting & Mixed Media Camp | 6-8 | Lions Gate | ✗ MISSING (DB has 8-12 only) |
| Pink Petal Dance Camp | 6-8 | Delbrook | ✓ ID 16018 (DB says 5-7 min) |
| Theatre Camp | 6-8 | Delbrook | ✓ ID 16029 (DB says 8-10) |
| Basketball Camp | 6-9 | Lynn Creek, Lions Gate | ✓ ID 16006 |
| Multisport & Games Camp | 6-9 | Parkgate, Lynn Creek, Lions Gate, JBCC | ✓ ID 16014 |
| Racquet Sports Camp | 6-9 | Parkgate | ✓ ID 16021 |
| Scooter Camp | 6-9 | Parkgate | ✓ ID 16024 |
| Sport & Climb Camp | 6-9 | Parkgate | ✓ ID 16026 |
| Soccer & Games Camp | 6-9 | Lynn Creek, JBCC | ✓ ID 16038 (DB age max 12, addresses Lynn Creek) |
| Cooking & Swim Camp | 8-11 | Ron Andrews | ✓ ID 16012 |
| Climb, Sports & Swim Camp | 8-12 | Parkgate | ✓ ID 16011 |
| Painting & Mixed Media Camp | 8-12 | Lions Gate | ✓ ID 16017 |
| Art & Mixed Media Camp | 9-12 | Memorial | ✓ ID 16000 (DB says 9-13 max) |
| Art & Cook Camp | 9-12 | Parkgate | ✓ ID 16002 |
| Art Exploration Camp | 9-12 | Parkgate | ✓ ID 16005 |
| Art & Swim Camp | 10-12 | Delbrook | ✓ ID 16003 |
| Basketball Camp | 9-12 | Lions Gate, JBCC | ✓ ID 16007 |
| Board Games Camp | 9-12 | Parkgate | ✓ ID 16158 (ADDED) |
| Clay & Art Camp | 9-12 | Parkgate | ✓ ID 16010 |
| Clay & Cook Camp | 9-12 | Parkgate | ✓ ID 16037 |
| Kitchen Creations Camp | 9-12 | Parkgate | ✓ ID 16013 |
| Multisport & Games Camp | 9-12 | Parkgate, KM, Lions Gate, JBCC | ✓ ID 16015 |
| Musical Theatre Camp | 9-12 | Delbrook | ✓ ID 16016 |
| Pottery Camp | 9-12 | Parkgate | ✓ ID 16020 |
| Pottery & Swim Camp | 9-12 | Delbrook | ✓ ID 16019 |
| Racquet Sports Camp | 9-12 | Parkgate, Lions Gate | ✓ ID 16022 |
| Skateboard Camp | 9-12 | Parkgate | ✓ ID 16025 |
| Tennis & Waves Camp | 9-12 | Karen Magnussen | ✓ ID 16028 |
| Byte Camp | 9-14 | Lynn Valley Village | ✓ ID 16008 |
| Acting Camp | 10-12 | Delbrook | ✓ ID 15998 |
| Hiking & Outdoor Survival Skills Camp | 11-14 | Karen Magnussen | ✓ ID 16033 |
| Babysitter Training & Cooking Camp | 11-15 | Lynn Creek | ✓ ID 16031 |
| Babysitter Training Extended Camp | 11-15 | Parkgate | ✓ ID 16032 |
| Improv Camp | 12-14 | Delbrook | ✓ ID 16034 |
| Urban Meets Nature Drawing/Painting Camp | 12-15 | Lions Gate | ✓ ID 16035 |
| Aspiring Artists Camp | 12-16 | Ray Perrault Park | ✓ ID 16030 |

---

## Discrepancies Found

### 1. Daytripper Cost (FIXED)
- **Old:** $226.00 (IDs 855-868, 14 programs)
- **Correct:** $226.17 per 3-day week (Tue-Thu)
- **Source:** nvrc.ca info page
- **Fixed:** ✓

### 2. Old-Style Specialty Camp Prices (FIXED)
- **Issue:** 102 old-style specialty camp programs (IDs 869-970) had cost=$175 with priceVerified=true
- **Problem:** Price was never verified on live PerfectMind page (registration not open); $175 was an estimate
- **Fix:** cost=null, priceVerified=false, added costNote
- **Fixed:** ✓

### 3. Missing Board Games Camp (ADDED)
- **Issue:** "Board Games Camp (Ages 9-12, Parkgate)" listed on nvrc.ca but not in database
- **Added:** ID 16158, cost=null (price not listed on nvrc.ca)
- **Fixed:** ✓

### 4. First-Week Start Dates — Ambiguous
- **Old-style programs:** Start June 29, 2026 (Monday before Canada Day week)
- **New-style programs:** Start July 2, 2026
- **nvrc.ca says:** "July 2-4 through Aug 25-29"
- **Analysis:** Unclear whether NVRC runs June 29-30 (Mon-Tue before Canada Day) or starts fresh on July 2 (Thu after Canada Day). nvrc.ca wording suggests July 2 start.
- **Action:** Not changed — defer to re-audit when PerfectMind registration opens and shows actual session listings
- **Note:** If old-style sessions starting June 29 are wrong, they should be updated to July 2 start

### 5. Age Range Discrepancies (Not Fixed)
Programs where nvrc.ca groups suggest different age ranges than database:
- **Theatre Camp (ID 16029):** DB says ages 8-10, nvrc.ca groups under "Age 6-8"
- **Pink Petal Dance Camp (ID 16018):** DB says ages 5-7, nvrc.ca groups under "Age 6-8"
- **Art & Cook Camp (IDs 16001, 16002):** DB says min age 6, nvrc.ca groups under "Age 5-8 years"
- **Art & Mixed Media Camp Memorial (ID 16000):** DB says max age 13, nvrc.ca says up to 12
- **Art Exploration Camp (IDs 16004, 16005):** DB says min age 6, nvrc.ca groups under "Age 5-8 years"
- **Clay & Art Camp (IDs 16009, 16010):** Same issue
- **Clay & Cook Camp (ID 16036):** Same issue
- **Defer:** These require PerfectMind browser verification to confirm exact age ranges

### 6. Missing Programs (Not Added — Need PerfectMind Verification)
The following appear on nvrc.ca but were not added due to inability to verify exact details:
- **Multisport & Games Camp (Ages 4-6, Karen Magnussen):** nvrc.ca lists this location separately
- **Painting & Mixed Media Camp (Ages 6-8, Lions Gate):** DB only has the 8-12 age group at Lions Gate; nvrc.ca lists both 6-8 and 8-12 groups
- **Soccer & Games Camp (JBCC location):** Existing DB entry covers Lynn Creek; JBCC location not listed separately

### 7. Old-Style Specialty Camp Addresses (Pre-existing Issue)
102 old-style specialty camps (IDs 869-970) have incorrect address "123 E 23rd St, North Vancouver, BC"
- This is not the address for these programs — Harry Jerome is at 125 East 23rd St, and specialty camps are at Parkgate, Delbrook, Memorial, etc.
- These are duplicates of the NVRC-prefixed programs (IDs 15992-16038) which have correct addresses
- Pre-existing issue, not introduced in this audit
- Recommend: Fix addresses or set these to Completed if they're true duplicates

---

## Old-Style vs New-Style Programs

The database has two sets of NVRC programs:
- **Old-style (IDs 709-970, 262 programs):** Individual weekly sessions, broader age ranges, "123 E 23rd St" address for specialty camps
- **New-style (IDs 15974-16038+, 66 programs):** Season-level summaries, specific locations, correct addresses, PerfectMind course IDs in costNote

These are overlapping/duplicate entries. The new-style programs are more accurate. The old-style programs provide individual session-level detail which is useful for parents. Recommend:
- Keep both, but fix the old-style specialty camp addresses in a future audit
- When registration opens (late May 2026), verify old-style first-week dates (June 29 vs July 2)

---

## Count

- **nvrc.ca shows:** 20 full-day camp programs + ~47 part-day specialty program types = ~67 distinct program types across 15+ facilities
- **Database has:** 328 NVRC programs (327 + 1 added Board Games Camp)
- **Discrepancy note:** Database programs include multiple weekly sessions per program type; nvrc.ca shows season-level overview

---

## Recommendations for Re-Audit (When Registration Opens ~Late May 2026)

1. Use Chrome browser to navigate PerfectMind registration portal
2. Verify first-week start dates — confirm whether camps start June 29 or July 2
3. Verify specialty camp prices (currently null — PerfectMind will show actual prices)
4. Add Multisport & Games Camp (Ages 4-6) at Karen Magnussen CC
5. Add Painting & Mixed Media Camp (Ages 6-8) at Lions Gate CC
6. Verify age ranges for Theatre Camp, Pink Petal Dance, Art & Cook/Exploration/Clay groups
7. Fix old-style specialty camp addresses (123 E 23rd St → correct locations)
8. Verify Art & Mixed Media Camp (Memorial) max age: 12 or 13?
