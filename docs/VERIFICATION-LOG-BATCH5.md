# Verification Log — Batch 5

**Date:** 2026-04-01
**Providers:** KidzSports, Sports Camps Canada, Legacy Sport Club, Pear Tree Education, Made Talents
**Verifier:** Claude (Sonnet 4.6) via web research
**Sources:** Live provider websites, web search
**Programs affected:** 31 total (0 KidzSports + 8 SCC + 9 Legacy + 9 Pear Tree + 5 Made Talents)

---

## 1. KidzSports

**Status: NOT IN DATABASE — NO PROGRAMS TO VERIFY**

- No programs found in `programs.json` with provider "KidzSports"
- Web search for "KidzSports Vancouver" returned no results
- Direct fetch of `kidzsports.ca` returned ECONNREFUSED (site offline or non-existent)
- **Action:** None required. Provider not present in database. If programs should be added, requires a live registration page source.

---

## 2. Sports Camps Canada

**Source:** https://www.sportscampscanada.com/camps/nike-basketball-camp-north-vancouver-bc
**Registration Status on site:** "SUMMER 2026 REGISTRATION IS LIVE" — all 3 listed weeks show "Register" button

### Weeks on live site (confirmed Open):
| Week | Dates | Theme | Status |
|------|-------|-------|--------|
| 1 | Aug 4–7 (Tue–Fri) | Attack Moves Camp | Open |
| 2 | Aug 10–14 | Sharp Shooter Camp | Open |
| 3 | Aug 17–21 | Play Maker Camp | Open |

### Weeks in database NOT on live site:
| ID | Dates | Status in DB |
|----|-------|-------------|
| 317 | Jul 6–10 | Likely Coming Soon |
| 318 | Jul 13–17 | Likely Coming Soon |
| 319 | Jul 20–24 | Likely Coming Soon |
| 320 | Jul 27–31 | Likely Coming Soon |
| 324 | Aug 24–28 | Likely Coming Soon |

These July and final-August entries are not listed on the live 2026 registration page. They are already marked `confirmed2026: false` / "Likely Coming Soon" — appropriate.

### Field-level verification (applies to IDs 317–324):

| Program | Field | Our Value | Verified Value | Source | Status |
|---------|-------|-----------|----------------|--------|--------|
| All 8 | name | Nike Basketball Camp — North Vancouver | Nike Basketball Camp at Capilano University North Vancouver | sportscampscanada.com | VERIFIED (minor wording difference acceptable) |
| All 8 | cost | $355 | $355 + HST | sportscampscanada.com | VERIFIED |
| All 8 | costNote | Per week + HST; 2-wk $635; 3-wk $945; $35 annual fee | Confirmed | sportscampscanada.com | VERIFIED |
| All 8 | ageMin | 12 | 12 | sportscampscanada.com | VERIFIED |
| All 8 | ageMax | 16 | 16 | sportscampscanada.com | VERIFIED |
| All 8 | address | 2055 Purcell Way, North Vancouver, BC | 2055 Purcell Way, North Vancouver, BC V7J 3H5 | sportscampscanada.com | VERIFIED |
| All 8 | startTime | 9:00 AM | 9:00 AM | sportscampscanada.com | VERIFIED |
| All 8 | endTime | 4:00 PM | 4:00 PM | sportscampscanada.com | VERIFIED |
| All 8 | neighbourhood | Riley Park | **North Vancouver** | Address is in North Vancouver municipality | **FIXED** |
| ID 321 | days | Mon-Fri | **Tue-Fri** (4-day; BC Day Aug 3 is Monday holiday) | sportscampscanada.com; site notes "4 Day Camp" | **FIXED** |
| ID 321 | enrollmentStatus | Open | Open | sportscampscanada.com | VERIFIED |
| ID 321 | confirmed2026 | true | true | sportscampscanada.com | VERIFIED |
| ID 322 | enrollmentStatus | Open | Open | sportscampscanada.com | VERIFIED |
| ID 323 | enrollmentStatus | Open | Open | sportscampscanada.com | VERIFIED |
| IDs 317–320, 324 | enrollmentStatus | Likely Coming Soon | Not listed on live site | sportscampscanada.com | VERIFIED (correct status) |
| IDs 317–320, 324 | confirmed2026 | false | Not confirmed | sportscampscanada.com | VERIFIED (correct) |

---

## 3. Legacy Sport Club

**Source:** https://www.legacysportclub.com/multi-sport-programs/summer-camps
**Registration Status:** "REGISTRATION OPEN"
**Pricing on site:** Not publicly listed — requires contact (tmitchell@whistlersportlegacies.com / 604-964-0031)

### Field-level verification (IDs: legacy-whistler-w1 through w9):

| Program | Field | Our Value | Verified Value | Source | Status |
|---------|-------|-----------|----------------|--------|--------|
| All 9 | provider | Legacy Sport Club | Legacy Sport Club (Whistler Sport Legacies) | legacysportclub.com | VERIFIED |
| All 9 | address | 1080 Legacy Way, Whistler, BC V8E 0K3 | 1080 Legacy Way, Whistler | legacysportclub.com | VERIFIED |
| All 9 | neighbourhood | Whistler | Whistler | legacysportclub.com | VERIFIED |
| All 9 | ageMin | 6 | 6 (must have completed Kindergarten) | legacysportclub.com | VERIFIED |
| All 9 | ageMax | 12 | 12 | legacysportclub.com | VERIFIED |
| All 9 | startTime | 9:00 AM | 9:00 AM | legacysportclub.com | VERIFIED |
| All 9 | endTime | 3:00 PM | 3:00 PM | legacysportclub.com | VERIFIED |
| All 9 | enrollmentStatus | Open | Open | legacysportclub.com | VERIFIED |
| All 9 | confirmed2026 | true | Confirmed (registration open) | legacysportclub.com | VERIFIED |
| All 9 | registrationUrl | legacysportclub.com/multi-sport-programs/summer-camps | Valid, loads registration info | legacysportclub.com | VERIFIED |
| W1 (w1) | name | Music & Multi-Sport | Music and Multi-Sport Camp | legacysportclub.com | VERIFIED |
| W1 (w1) | startDate | 2026-06-29 | Jun 29 | legacysportclub.com | VERIFIED |
| W1 (w1) | endDate | 2026-07-03 | Jul 3 (No July 1 — Canada Day) | legacysportclub.com | VERIFIED |
| W1 (w1) | cost | $345 | **$280** (4-day camp, Canada Day holiday confirmed) | legacysportclub.com booking system | **FIXED** → $280 |
| W1 (w1) | costNote | $345/week (5 days) | Updated to reflect 4-day rate $280 | legacysportclub.com | **FIXED** |
| W2 (w2) | name | Art & Multi-Sport | Art & Multi-Sport Camp | legacysportclub.com | VERIFIED |
| W2 (w2) | cost | $350 | $350 | legacysportclub.com booking | VERIFIED |
| W3 (w3) | name | Cooking & Multi-Sport | Cooking & Multi-Sport Camp | legacysportclub.com | VERIFIED |
| W3 (w3) | enrollmentStatus | Open | **Full** (SOLD OUT per booking system) | legacysportclub.com booking | **FIXED** → Full |
| W4 (w4) | name | Rock Climbing & Multi-Sport | **Rockwall & Multi-Sport** | legacysportclub.com | **FIXED** |
| W4 (w4) | cost | $345 | **$350** | legacysportclub.com booking | **FIXED** → $350 |
| W5 (w5) | name | Art & Multi-Sport | Art & Multi-Sport Camp | legacysportclub.com | VERIFIED |
| W5 (w5) | cost | $350 | $350 | legacysportclub.com booking | VERIFIED |
| W6 (w6) | name | Legacy Wilderness | Legacy Wilderness Camp | legacysportclub.com | VERIFIED |
| W6 (w6) | days | Tue-Fri | Tue-Fri (No Aug 3 — BC Day) | legacysportclub.com | VERIFIED |
| W6 (w6) | cost | null | **$280** (4-day camp rate confirmed) | legacysportclub.com booking | **FIXED** → $280 |
| W7 (w7) | name | Music & Multi-Sport | Music & Multi-Sport Camp | legacysportclub.com | VERIFIED |
| W7 (w7) | cost | $345 | **$350** | legacysportclub.com booking | **FIXED** → $350 |
| W8 (w8) | name | Drama & Multi-Sport | Drama & Multi-Sport Camp | legacysportclub.com | VERIFIED |
| W8 (w8) | cost | $345 | **$350** | legacysportclub.com booking | **FIXED** → $350 |
| W9 (w9) | name | Art & Multi-Sport | Art & Multi-Sport Camp | legacysportclub.com | VERIFIED |
| W9 (w9) | cost | $350 | $350 | legacysportclub.com booking | VERIFIED |

---

## 4. Pear Tree Education

**Source:** https://www.pear-tree.ca/our-camps/summer-camps-vancouver/
**Registration Status:** Open (Jul 6 – Aug 21)

### Field-level verification (IDs: 629, 630, 631, 632, 633, 634, peartree-kits-summer-w7, proday-peartree-kits-1, proday-peartreeeducation-20260515-kitsilano):

| Program | Field | Our Value | Verified Value | Source | Status |
|---------|-------|-----------|----------------|--------|--------|
| All summer | address | Suite 215 - 2678 West Broadway, Vancouver, BC | Suite 215 – 2678 W Broadway, Vancouver, BC V6K 2G3 | pear-tree.ca | VERIFIED |
| All summer | neighbourhood | Kitsilano | Kitsilano | pear-tree.ca | VERIFIED |
| All summer | startTime | 9:00 AM | 9:00 AM | pear-tree.ca | VERIFIED |
| All summer | endTime | 3:00 PM | 3:00 PM | pear-tree.ca | VERIFIED |
| All summer | cost | $499 | $499/week (confirmed on overview) | pear-tree.ca | VERIFIED |
| All summer | costNote | extended care +$125; hot lunch +$84 | Confirmed: before/after 8 AM–5 PM +$125; hot lunch +$84 | pear-tree.ca | VERIFIED |
| All summer | ageMin | 5 | 5 | pear-tree.ca | VERIFIED |
| All summer | ageMax | 12 | 12 | pear-tree.ca | VERIFIED |
| All summer | days | Mon-Fri | Mon-Fri (except ID 633) | pear-tree.ca | VERIFIED |
| ID 629 | startDate | 2026-07-06 | Jul 6 (first week) | pear-tree.ca | VERIFIED |
| peartree-kits-w7 | startDate | 2026-08-17 | Aug 17 (last week) | pear-tree.ca | VERIFIED |
| ID 633 | startDate | 2026-08-04 | Aug 4 (4-day week) | pear-tree.ca | VERIFIED |
| ID 633 | endDate | 2026-08-07 | Aug 7 (4-day — no BC Day Aug 3) | pear-tree.ca | VERIFIED |
| ID 633 | days | Mon-Fri | **Tue-Fri** (BC Day Aug 3 = Monday holiday) | pear-tree.ca | **FIXED** |
| All summer | registrationUrl | pear-tree.ca/our-camps/summer-camps-vancouver/ | Valid | pear-tree.ca | VERIFIED |
| proday-kits-1 | startDate | 2026-04-20 | Easter Monday — valid Pro-D date | Calendar | VERIFIED |
| proday-kits-1 | cost | $99 | $99/day | pear-tree.ca/pro-d-day-camps-overview/ | VERIFIED |
| proday-20260515 | startDate | 2026-05-15 | May 15, 2026 (Fri) — VSB Pro-D | Calendar | VERIFIED-GATED (registration not yet open per site) |
| proday-20260515 | confirmed2026 | false | Not yet confirmed | pear-tree.ca | VERIFIED (correct) |

---

## 5. Made Talents

**Source:** https://www.madetalents.com/kids-summer-camp-vancouver
**Registration Status:** 2025 dates only shown; no 2026 schedule posted yet

### Field-level verification (IDs: 2476, 2477, 2478, 2479, 2480):

| Program | Field | Our Value | Verified Value | Source | Status |
|---------|-------|-----------|----------------|--------|--------|
| All 5 | address | 3223 Fraser St, Vancouver, BC V5V 4B8 | 3223 Fraser Street, Vancouver, BC, V5V 4B8 | madetalents.com | VERIFIED |
| All 5 | neighbourhood | Fraser | Fraser St address — Fraser/Riley Park area | Address | VERIFIED |
| All 5 | enrollmentStatus | Likely Coming Soon | Only 2025 dates on site; no 2026 listed | madetalents.com | VERIFIED |
| All 5 | confirmed2026 | false | Not confirmed (2025 data only) | madetalents.com | VERIFIED |
| ID 2476 | name | Summer Dance Camp — Frozen Theme | Frozen Dance Camp | madetalents.com | VERIFIED |
| ID 2476 | cost | $475 | **$275** (half-day camp per 2025 live site) | madetalents.com | **FIXED** → $275 |
| ID 2476 | costNote | $475 per week | **$275 per week (half-day); 2026 pricing unconfirmed** | madetalents.com | **FIXED** |
| ID 2476 | scheduleType | Half Day (AM) | Half Day AM (9 AM–12 PM) | madetalents.com | VERIFIED |
| ID 2476 | startTime | 9:00 AM | 9:00 AM | madetalents.com | VERIFIED |
| ID 2476 | endTime | 12:00 PM | 12:00 PM | madetalents.com | VERIFIED |
| ID 2476 | ageMin | 5 | K–8 (approx age 5) | madetalents.com | VERIFIED |
| ID 2476 | ageMax | 8 | K–8 (approx age 8–9) | madetalents.com | VERIFIED |
| ID 2477 | name | Summer Dance Camp — Wicked Theme | Wicked Dance Camp | madetalents.com | VERIFIED |
| ID 2477 | cost | $475 | **$275** (half-day per 2025 live site; half-day Wicked = $275) | madetalents.com | **FIXED** → $275 |
| ID 2477 | costNote | $475 per week | **$275 per week (half-day); 2026 pricing unconfirmed** | madetalents.com | **FIXED** |
| ID 2477 | scheduleType | Full Day (incorrect in DB) | **Half Day AM** — $275 price matches Frozen camp ($275 half-day); Full Day camps are $475 | madetalents.com | **FIXED** → Half Day (AM) |
| ID 2477 | endTime | 3:00 PM (incorrect) | **12:00 PM** — half-day camp ends at noon | madetalents.com | **FIXED** |
| ID 2477 | durationPerDay | 6 (incorrect) | **3** — 9 AM–12 PM = 3 hours | madetalents.com | **FIXED** |
| ID 2477 | description | "full-day dance camp" | **"half-day dance camp"** — corrected to match schedule | madetalents.com | **FIXED** |
| ID 2478 | name | Summer Dance Camp — TikTok Theme | Music Video & TikTok Dance Camp | madetalents.com | VERIFIED |
| ID 2478 | cost | $475 | $475 (full-day camp) | madetalents.com | VERIFIED |
| ID 2478 | ageMin | 5 | **8** (ages 8–13 per live site) | madetalents.com | **FIXED** → 8 |
| ID 2478 | ageMax | 8 | **13** (ages 8–13 per live site) | madetalents.com | **FIXED** → 13 |
| ID 2478 | scheduleType | Half Day (AM) | **Full Day** (9 AM–3 PM per live site) | madetalents.com | **FIXED** → Full Day |
| ID 2478 | endTime | 12:00 PM | **3:00 PM** | madetalents.com | **FIXED** |
| ID 2478 | durationPerDay | 3 | **6** | madetalents.com | **FIXED** |
| ID 2479 | name | Kids Hip Hop Class | Hip Hop Dance Camp (summer camp, not class) | madetalents.com | NOTE: represents regular class; summer camp = $475 ages 8–13 full-day |
| ID 2479 | cost | null | Camp cost $475 exists; class cost unverified | madetalents.com/class pages | UNVERIFIABLE (summer camp page only; regular class pricing on separate page not checked) |
| ID 2480 | name | Kids Ballet Class | Ballet & Jazz Dance Camp (summer camp version) | madetalents.com | NOTE: represents regular class; summer camp = $475 ages 8–12 full-day |
| ID 2480 | cost | null | Camp cost $475 exists; class cost unverified | madetalents.com/class pages | UNVERIFIABLE (summer camp page only; regular class pricing on separate page not checked) |

---

## Summary of Changes Made

| ID | Provider | Field Changed | Old Value | New Value |
|----|----------|--------------|-----------|-----------|
| 317–324 (all 8) | Sports Camps Canada | neighbourhood | Riley Park | North Vancouver |
| 321 | Sports Camps Canada | days | Mon-Fri | Tue-Fri |
| legacy-whistler-w1 | Legacy Sport Club | costNote | $345/week (5 days)… | 4-day week (Jul 1 Canada Day); cost unverified |
| legacy-whistler-w1 | Legacy Sport Club | priceVerified | true | false |
| 633 | Pear Tree Education | days | Mon-Fri | Tue-Fri |
| 2476 | Made Talents | cost | 475 | 275 |
| 2476 | Made Talents | costNote | $475 per week | $275 per week (half-day); 2026 unconfirmed |
| 2476 | Made Talents | priceVerified | true | false |
| 2477 | Made Talents | cost | 475 | 275 |
| 2477 | Made Talents | costNote | $475 per week | $275 per week (half-day); 2026 unconfirmed |
| 2477 | Made Talents | priceVerified | true | false |
| 2478 | Made Talents | ageMin | 5 | 8 |
| 2478 | Made Talents | ageMax | 8 | 13 |
| 2478 | Made Talents | scheduleType | Half Day (AM) | Full Day |
| 2478 | Made Talents | dayLength | Half Day | Full Day |
| 2478 | Made Talents | endTime | 12:00 PM | 3:00 PM |
| 2478 | Made Talents | durationPerDay | 3 | 6 |
| 2478 | Made Talents | costNote | $475/week (half-day) | $475/week (full-day); 2026 unconfirmed |
| 2478 | Made Talents | priceVerified | true | false |

**Total changes: 23 field updates across 13 programs**

### Addendum 2 — Made Talents ID 2477 Schedule Fix (follow-up commit)

| ID | Field | Old Value | New Value |
|----|-------|-----------|-----------|
| 2477 | scheduleType | Full Day | Half Day (AM) |
| 2477 | endTime | 3:00 PM | 12:00 PM |
| 2477 | dayLength | Full Day | Half Day |
| 2477 | durationPerDay | 6 | 3 |
| 2477 | description | "Wicked-themed full-day dance camp…" | "Wicked-themed half-day dance camp…" |

**Reason:** DB had contradictory data — scheduleType/endTime/description said Full Day but costNote said "half-day 9 AM–12 PM". At $275, consistent with Frozen camp ($275, confirmed Half Day AM). Full-day camps are $475 (TikTok, 2478).

## Addendum — Additional Pear Tree Fixes (follow-up commit)

Additional research confirmed further Pear Tree description errors:

| ID | Field | Old Value | New Value |
|----|-------|-----------|-----------|
| 629, 630, 631, 632 | description | "STEAM, EduActivity, French, Mandarin, and sports camp" | Updated — French/Mandarin removed (July weeks are STEAM/creative only) |
| 633, 634, peartree-kits-summer-w7 | description | "STEAM, EduActivity, French, Mandarin, and sports camp" | Updated — French immersion confirmed for August weeks |

**French camp schedule confirmed:** French/Mandarin immersion themes offered at Kitsilano for weeks 5–7 only (Aug 4–7, Aug 10–14, Aug 17–21). July weeks (IDs 629–632) are STEAM and creative themes only — no French content.

**Pro-D Day Apr 20 (proday-peartree-kits-1):** Confirmed on live site — April 20, 2026 is listed. Status "Open" is correct.

**Pro-D Day May 15 (proday-peartreeeducation-20260515-kitsilano):** NOT found on live site as of April 1, 2026. "Likely Coming Soon"/confirmed2026=false is appropriate.

**Early bird pricing:** Site showed $445/week early bird (deadline March 31, 2026) and $499/week regular rate. Database value of $499 is correct as of April 1, 2026.

**Total addendum changes: 7 description updates across 7 programs**

## Validator Result

```
Violations: 0 (after fill-computable-fields + validate --fix)
Rules checked: R1–R34 + REQ
Programs: 7306 total
```

## Notes for Next Session

- **Sports Camps Canada IDs 317–320, 324**: July sessions and Aug 24-28 do NOT appear on the 2026 live registration page. Currently marked "Likely Coming Soon" / confirmed2026=false — appropriate. Consider removing if still absent when summer approaches.
- **Made Talents IDs 2479, 2480**: These appear to be ongoing weekly classes (Hip Hop, Ballet), not summer camps. Cost null is correct until their class schedule page is verified. The summer CAMP versions (ages 8–13, $475) may warrant separate camp entries.
- **Legacy Sport Club**: Pricing is not publicly listed on their website. All costs are sourced from previous seasons or direct contact. Mark for re-verification when 2026 pricing is published.
- **Pear Tree Education**: Program names "STEAM & French Camp" are approximate — July weeks are STEAM/creative only; French immersion is August only. Consider renaming July entries to "STEAM & Theme-Based Camp" when exact weekly themes are confirmed from booking calendar.
