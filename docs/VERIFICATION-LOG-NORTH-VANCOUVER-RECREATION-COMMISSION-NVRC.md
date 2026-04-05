# Verification Log — North Vancouver Recreation Commission (NVRC)

**Date audited:** 2026-04-05
**Auditor:** Claude Agent (Sonnet 4.6)
**Registration page:** https://www.nvrc.ca/programs-memberships/program-directory/camps
**Booking system:** https://nvrc.perfectmind.com/23734/Clients/BookMe4?widgetId=a28b2c65-61af-407f-80d1-eaa58f30a94a

---

## Tool Availability Note

The `mcp__Claude_in_Chrome__navigate` browser tool was **not available** in this session. As a result:
- The static NVRC camps page (`nvrc.ca/programs-memberships/program-directory/camps`) was accessed via WebFetch
- The PerfectMind booking system (JavaScript-rendered) could **not** be accessed — it returns only a loading skeleton via WebFetch
- All verifiable data (addresses, prices, dates, camp names) was sourced from the static camps page content
- Part-day camp prices and times remain unverified (only available in PerfectMind)

**Recommendation:** Re-audit with Chrome tool available to verify part-day camp costs and times in PerfectMind.

---

## Provider Summary

**Total programs in database:** 328
**Status breakdown:**
- Open: 226 (full-day camps — confirmed 2026 data from static page)
- Likely Coming Soon: 102 (simple-named part-day programs — data quality issues, see below)

---

## Full-Day Camp Programs (Verified from Static Page)

### Ages 5–6 — 9:00 AM–3:00 PM, Mon–Fri
**Price:** $255.25/5-day week; $204.20/4-day week
**Locations:**
| Camp | Address | IDs |
|------|---------|-----|
| Camp Delbrook | 851 West Queens Rd, North Vancouver, BC V7N 2A7 | 709–717 (weekly), 15974 (season) |
| Camp Lynn Valley | 3590 Mountain Hwy, North Vancouver, BC V7K 2H4 | 718–726, 15975 |
| Camp Ron Andrews | 931 Lytton St, North Vancouver, BC | 727–735, 15976 |

**Sessions:** July 2–August 29, 2026 (9 weekly sessions)
**Short weeks:** July 2–3 (Canada Day July 1 holiday), Aug 4–7 (BC Day Aug 3 holiday) → $204.20

### Ages 6–9 — 8:45 AM–4:15 PM, Mon–Fri
**Price:** $279.80/5-day week; $223.84/4-day week
**Locations:**
| Camp | Address | IDs |
|------|---------|-----|
| Camp Delbrook | 851 West Queens Rd | 736–744, 15977 |
| Camp Harry Jerome | 123 East 23rd St, North Vancouver, BC V7L 3E2 | 745–753, 15978 |
| Camp Karen Magnussen | 2300 Kirkstone Rd, North Vancouver, BC | 754–762, 15979 |
| Camp Lynn Creek | 1491 Hunter Street, North Vancouver, BC V7J 1H7 | 763–771, 15980 |

### Ages 6–10 — 8:45 AM–4:15 PM, Mon–Fri
**Price:** $279.80/5-day week; $223.84/4-day week
**Locations:**
| Camp | Address | IDs |
|------|---------|-----|
| Camp John Braithwaite | 145 W 1st St, North Vancouver, BC V7M 1B2 | 772–780, 15981 |
| Camp Lions Gate | 1733 Lions Gate Lane, North Vancouver, BC V7P 3A3 | 781–789, 15982 |
| Camp Myrtle Park | Caledonia Ave & Cove Cliff Rd, North Vancouver | 790–798, 15983 |

### Ages 6–12 — 8:45 AM–4:15 PM, Mon–Fri (Limited Sessions)
| Camp | Address | IDs | Sessions |
|------|---------|-----|----------|
| Camp Harry Jerome | 123 East 23rd St | 799–807 (weekly), 15984 | Jun 23–27 + Aug 25–29 |
| Camp Karen Magnussen | 2300 Kirkstone Rd | 808 | Jun 23–27 only |
| Camp JBCC | 145 W 1st St | 809 | Jun 23–27 only |

*Note: These "6–12" camps are pre-existing data. NVRC primarily splits into 6–9 and 9–12 age groups for regular summer sessions.*

### Ages 9–12 — 8:45 AM–4:15 PM, Mon–Fri
**Price:** $279.80/5-day week; $223.84/4-day week
**Locations:**
| Camp | Address | IDs |
|------|---------|-----|
| Camp Harry Jerome | 123 East 23rd St | 810–818, 15985 |
| Camp Karen Magnussen | 2300 Kirkstone Rd | 819–827, 15986 |
| Camp Loutet Park | Rufus Ave & 14th St, North Vancouver | 828–836, 15987 |
| Camp Princess Park | Princess Ave, North Vancouver | 837–845, 15988 |
| Camp Lynn Creek | 1491 Hunter Street | 846–854, 15989 |

### Ages 13–15 Daytrippers — 9:30 AM–4:30 PM, Tue–Thu
**Price:** $226.17/3-day week
**Locations:**
| Camp | Address | IDs |
|------|---------|-----|
| Camp Daytrippers Harry Jerome | 123 East 23rd St | 855–861, 15990 |
| Camp Daytrippers Lynn Creek | 1491 Hunter Street | 862–868, 15991 |

**Sessions:** July 8–August 21 (7 weekly sessions, Tue–Thu only)

---

## Part-Day Camp Programs

### NVRC-Prefixed Part-Day Programs (IDs 15992–16158)
These 67 programs were added in a prior audit. They correctly identify age groups and locations but have **null cost and null times** because PerfectMind could not be accessed. Status: Open / confirmed2026: true.

Key programs (costs and times TBD via Chrome audit):

| Program | Ages | Location | IDs |
|---------|------|----------|-----|
| Art & Games Camp | 4–6 | John Braithwaite (145 W 1st St) | 15992 |
| Camp Little Campers | 3–4 | Delbrook | 15993 |
| Camp Littlest Campers | 2–3 | Delbrook | 15994 |
| Little Campers | 3–5 | Ron Andrews | 15995 |
| Sport & Climb Camp | 4–6 | Parkgate | 15996 |
| Multisport & Games Camp | 4–6 | Lynn Creek / Karen Magnussen | 15997 |
| Acting Camp | 10–12 | Delbrook | 15998 |
| Art & Mixed Media Camp | 5–8 | Memorial CRC (125 E 23rd St) | 15999 |
| Art & Mixed Media Camp | 9–13 | Memorial CRC (125 E 23rd St) | 16000 |
| Art & Cook Camp | 6–8 | Parkgate | 16001 |
| Art & Cook Camp | 9–12 | Parkgate | 16002 |
| Art & Swim Camp | 10–12 | Delbrook | 16003 |
| Art Exploration Camp | 6–8 | Parkgate | 16004 |
| Art Exploration Camp | 9–12 | Parkgate | 16005 |
| Basketball Camp | 6–9 | Lynn Creek | 16006 |
| Basketball Camp | 9–12 | Lions Gate | 16007 |
| Byte Camp | 9–14 | Lynn Valley Village (1277 Lynn Valley Rd) | 16008 |
| Clay & Art Camp | 6–8 | Parkgate | 16009 |
| Clay & Art Camp | 9–12 | Parkgate | 16010 |
| Climb, Sports & Swim Camp | 8–12 | Parkgate | 16011 |
| Cooking & Swim Camp | 8–11 | Ron Andrews | 16012 |
| Kitchen Creations Camp | 9–12 | Parkgate | 16013 |
| Multisport & Games Camp | 6–9 | Lynn Creek / Karen Magnussen | 16014 |
| Multisport & Games Camp | 9–12 | Lynn Creek / Karen Magnussen | 16015 |
| Musical Theatre Camp | 9–12 | Delbrook | 16016 |
| Painting & Mixed Media Camp | 8–12 | Lions Gate | 16017 |
| Pink Petal Dance Camp | 5–7 | Delbrook | 16018 |
| Pottery & Swim Camp | 9–12 | Delbrook | 16019 |
| Pottery Camp | 9–12 | Parkgate | 16020 |
| Racquet Sports Camp | 6–9 | Parkgate | 16021 |
| Racquet Sports Camp | 9–12 | Parkgate | 16022 |
| Science & Games Camp | 6–9 | John Braithwaite | 16023 |
| Scooter Camp | 6–9 | Parkgate | 16024 |
| Skateboard Camp | 9–12 | Parkgate | 16025 |
| Sport & Climb Camp | 6–9 | Parkgate | 16026 |
| Sport & Climb Camp | 9–12 | Parkgate | 16027 |
| Tennis & Waves Camp | 9–12 | Karen Magnussen | 16028 |
| Theatre Camp | 8–10 | Delbrook | 16029 |
| Aspiring Artists Camp | 12–16 | Ray Perrault Park | 16030 |
| Babysitter Training & Cooking | 11–15 | Lynn Creek | 16031 |
| Babysitter Training Extended | 11–15 | Parkgate | 16032 |
| Hiking & Outdoor Survival Skills | 11–14 | Karen Magnussen | 16033 |
| Improv Camp | 12–14 | Delbrook | 16034 |
| Urban Meets Nature Drawing/Sketching/Painting | 12–15 | Lions Gate | 16035 |
| Clay & Cook Camp | 6–8 | Parkgate | 16036 |
| Clay & Cook Camp | 9–12 | Parkgate | 16037 |
| Soccer & Games Camp | 6–12 | Lynn Creek | 16038 |
| **Board Games Camp** | **9–12** | **Parkgate** | **16158** |

### Simple-Named Part-Day Programs (IDs 869–970) — DATA QUALITY ISSUES
These 102 programs are **older entries** that appear to duplicate the NVRC-prefixed programs above. They have:
- **Combined age groups** (ageMin=6, ageMax=12) — violates R43, superseded by age-split NVRC listings
- **Cost: $175** — unverified; not sourced from live registration page
- **confirmed2026: false, priceVerified: false** — flags corrected this audit
- **Status: Likely Coming Soon** — set by validator due to unconfirmed data
- Addresses corrected to actual NVRC facility locations (were previously all "123 E 23rd St")

These programs should be **re-audited with Chrome browser** to either verify/fix data or confirm superseded by NVRC-prefixed programs.

---

## Discrepancies Found and Resolved

### 1. Harry Jerome CRC Address — FIXED
- **Issue:** 27 programs (IDs 745–818) used "240 East 23rd St" — incorrect
- **11 programs** (IDs 855–861, 15978, 15984, 15985, 15990) used "125 East 23rd St" — this is Memorial CRC, not Harry Jerome
- **Fix:** All Harry Jerome CRC programs updated to **"123 East 23rd St, North Vancouver, BC V7L 3E2"**
- **Source:** NVRC website facility page confirms Harry Jerome CRC at 123 East 23rd St (new building opening July 2026)

### 2. Memorial CRC Address — FIXED
- **Issue:** IDs 15999, 16000 (Art & Mixed Media at Memorial) had address "375 W 14th St" — incorrect
- **Fix:** Updated to **"125 E 23rd Street, North Vancouver, BC V7L 3E2"**
- **Source:** NVRC website confirms Memorial CRC at 125 E 23rd Street

### 3. First Session Start Date — FIXED
- **Issue:** 20 programs showed first session starting June 29 (Monday) — website confirms summer 2026 starts July 2
- **Fix:** startDate corrected from 2026-06-29 to **2026-07-02** for all first-session programs
- **Note:** July 1 is Canada Day (Wednesday), so the first camp week runs July 2–3 (Thu–Fri)

### 4. Short Week Pricing — FIXED
- **Canada Day week** (July 2–3): changed from $255.25 → **$204.20** (ages 5–6) and $279.80 → **$223.84** (ages 6+)
- **BC Day week** (Aug 4–7): changed from $255.25 → **$204.20** (ages 5–6) and $279.80 → **$223.84** (ages 6+)

### 5. Simple-Named Program Data Quality — FIXED
- **Issue:** 102 programs (IDs 869–970) had confirmed2026=true, priceVerified=true with unverified data
- **Fix:** Set confirmed2026=false, priceVerified=false; updated addresses; added costNote explaining verification needed

---

## Program Counts

| Category | Count |
|----------|-------|
| Total NVRC programs in database | 328 |
| Full-day camp sessions (old weekly style) | 162 |
| Full-day camps (NVRC season-range style) | 34 |
| Part-day camps (NVRC-prefixed, verified locations) | 67 |
| Part-day camps (simple-named, low quality, Likely Coming Soon) | 102 |
| Board Games Camp (9–12, Parkgate) | Already in DB as ID 16158 |
| **New programs added this audit** | **0** |
| Programs with address corrections | 40 |
| Programs with date/price corrections | 20 |
| Programs with data quality flags reset | 102 |

---

## Remaining Issues for Next Audit

1. **Part-day camp prices/times still unknown** — PerfectMind cannot be rendered without Chrome. 67 NVRC-prefixed part-day programs have null cost and null times. Requires Chrome browser tool.

2. **Simple-named programs (869–970)** — 102 programs with combined age groups (6–12) and unverified $175 cost. Should be reviewed with Chrome:
   - Update with correct per-age-group data from PerfectMind, OR
   - Confirm superseded by NVRC-prefixed programs and set to Completed

3. **Basketball Camp locations** — Website lists Basketball at "Lynn Creek, Lions Gate, JBCC" for multiple age groups. Currently have 6–9 at Lynn Creek (16006) and 9–12 at Lions Gate (16007). Possible missing: 6–9 at Lions Gate, 6–9 and 9–12 at JBCC.

4. **Racquet Sports Camp at Lions Gate** — Website mentions Racquet Sports at "Parkgate, Lions Gate". Currently only have Parkgate listings (16021, 16022). May be missing Lions Gate location.

5. **New Harry Jerome CRC opening July 2026** — The new building at 123 East 23rd St is opening July 2026. Address has been updated in database. Verify physical location and any program detail changes with the new facility when it opens.

6. **Short week exact session dates** — The Canada Day first week exact end date (July 3 vs July 4) could not be confirmed without PerfectMind. Currently set to July 2 start / July 3 end.

---

## Community Centre Addresses (Verified)

| Facility | Address |
|----------|---------|
| Delbrook CRC | 851 West Queens Rd, North Vancouver, BC V7N 2A7 |
| Harry Jerome CRC (NEW, opens July 2026) | 123 East 23rd St, North Vancouver, BC V7L 3E2 |
| John Braithwaite CRC | 145 W 1st St, North Vancouver, BC V7M 1B2 |
| Karen Magnussen CRC | 2300 Kirkstone Rd, North Vancouver, BC |
| Lions Gate CRC | 1733 Lions Gate Lane, North Vancouver, BC V7P 3A3 |
| Lynn Creek CRC | 1491 Hunter Street, North Vancouver, BC V7J 1H7 |
| Lynn Valley CRC | 3590 Mountain Hwy, North Vancouver, BC V7K 2H4 |
| Lynn Valley Village | 1277 Lynn Valley Rd, North Vancouver, BC V7J 0A2 |
| Memorial CRC | 125 E 23rd Street, North Vancouver, BC V7L 3E2 |
| Parkgate CRC | 3625 Banff Court, North Vancouver, BC V7H 2Z8 |
| Ron Andrews CRC | 931 Lytton St, North Vancouver, BC |

---

*Verification performed 2026-04-05. Chrome browser tool unavailable; PerfectMind booking system not accessible via WebFetch (JavaScript required). Static page verified at nvrc.ca/programs-memberships/program-directory/camps.*
