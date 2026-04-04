# Verification Log: Endless Biking (formerly "North Vancouver Outdoors") — V2 Audit

**Audit Date:** 2026-04-03
**Auditor:** Claude (claude-sonnet-4-6)
**Provider:** Endless Biking
**Website:** https://www.endlessbiking.com
**Address:** 101-1467 Crown Street, North Vancouver, BC V7J 1G4
**Phone:** 604-985-2519
**Email:** info@endlessbiking.com / programs@endlessbiking.com

---

## Critical Finding 1: Provider Name Was Wrong

All 16 programs were stored under provider name **"North Vancouver Outdoors"** — incorrect. The actual organization is **Endless Biking** (Endless Biking Ltd), operating at endlessbiking.com. All programs updated to `provider: "Endless Biking"`.

---

## Critical Finding 2: All 16 URLs Were Broken

All 16 programs used `registrationUrl: "https://nvrc.perfectmind.com/23734/Clients/BookMe4"` — this URL returns "This widget has been disabled or not set up properly."

**Root cause:** Programs were originally imported from the ACTIVE Network API under an NVRC (North Vancouver Recreation Commission) organization account, which has since been disabled. Endless Biking uses their own Active Network account (`campscui.active.com/orgs/EndlessBiking`), but that domain is banned by Rule R24.

**Fix:** Updated all `registrationUrl` fields to the correct Endless Biking program pages on their website.

---

## Registration URL Mapping (verified on endlessbiking.com)

| Program Type | registrationUrl |
|---|---|
| Spring Break Camps | https://www.endlessbiking.com/spring-break-camp |
| DYRT Rides (Wednesday & Sunday) | https://www.endlessbiking.com/dyrt-rides |
| GRIP Programs | https://www.endlessbiking.com/grip |
| COG Kids | https://www.endlessbiking.com/cogkids |
| Summer Camps | https://www.endlessbiking.com/summer-camp |

---

## Spring Break Camps

**Verified on:** https://www.endlessbiking.com/spring-break-camp

| ID | Name | Dates | Ages | Time | Price (pre-GST) | Cost (incl. GST) | Status |
|---|---|---|---|---|---|---|---|
| ACT-0788 *(new)* | Spring Break Camp \| Kids AM \| Week 1 | Mar 16-20 | 6-10 | 9:00 AM-12:00 PM | $465 | $488.25 | Completed |
| ACT-0789 *(new)* | Spring Break Camp \| Youth \| Week 1 | Mar 16-20 | 10-16 | 9:00 AM-3:00 PM | $655 | $687.75 | Completed |
| ACT-0166 | Spring Break Camp \| Kids AM \| Week 2 | Mar 23-27 | 6-10 | 9:00 AM-12:00 PM | $465 | $488.25 | Completed |
| ACT-0168 | Spring Break Camp \| Youth \| Week 2 | Mar 23-27 | 10-16 | 9:00 AM-3:00 PM | $655 | $687.75 | Completed |

**Notes:**
- Week 1 (Mar 16-20) was missing from DB entirely — added as Completed
- Week 2 status corrected from "Closed" to "Completed"
- Prices confirmed on website

---

## DYRT Rides (Developing Youth to Ride Trails)

**Verified on:** https://www.endlessbiking.com/dyrt-rides

DYRT = "Developing Youth to Ride Trails"
- Kids: ages 6-10 | Youth: ages 10-16
- Wednesday rides: 4:15 PM – 6:15 PM
- Sunday rides: 9:30 AM – 12:30 PM
- Minimum Skill Level 2 required for all sessions
- Location: North Shore trails (specific meeting point provided post-registration)

### Pricing Structure (verified on website)

| Session Block | Days | Weeks | Price + GST | Cost |
|---|---|---|---|---|
| April Wednesday | Wed | 4 | $245 + GST | $257.25 |
| May-June Wednesday | Wed | 8 | $435 + GST | $456.75 |
| Fall Wednesday | Wed | 6 | $325 + GST | $341.25 |
| April Sunday | Sun | 3 | $240 + GST | $252.00 |
| May-June Sunday | Sun | 6 | $440 + GST | $462.00 |
| Fall Sunday | Sun | 6 | $440 + GST | $462.00 |

### April

| ID | Name | Specific Dates | Ages | Cost | Status |
|---|---|---|---|---|---|
| ACT-0223 | DYRT Rides \| Wednesday Kids \| April | Apr 8, 15, 22, 29 | 6-10 | $257.25 | Open |
| ACT-0224 | DYRT Rides \| Wednesday Youth \| April | Apr 8, 15, 22, 29 | 10-16 | $257.25 | Open |
| ACT-0242 | DYRT Rides \| Sunday Kids \| April | Apr 12, 19, 26 | 6-10 | $252.00 | Open |
| ACT-0241 | DYRT Rides \| Sunday Youth \| April | Apr 12, 19, 26 | 10-16 | $252.00 | Open |

### May & June

| ID | Name | Specific Dates | Ages | Cost | Status |
|---|---|---|---|---|---|
| ACT-0314 | DYRT Rides \| Wednesday Kids \| May & June | May 6/13/20/27; Jun 3/10/17/24 | 6-10 | $456.75 | Open |
| ACT-0316 | DYRT Rides \| Wednesday Youth \| May & June | May 6/13/20/27; Jun 3/10/17/24 | 10-16 | $456.75 | Open |
| ACT-0305 | DYRT Rides \| Sunday Kids \| May & June | May 3/10/24; Jun 7/14/28 | 6-10 | $462.00 | Open |
| ACT-0306 | DYRT Rides \| Sunday Youth \| May & June | May 3/10/24; Jun 7/14/28 | 10-16 | $462.00 | Open |

### Fall (Sep-Oct)

| ID | Name | Specific Dates | Ages | Cost | Status |
|---|---|---|---|---|---|
| ACT-0808 *(new)* | DYRT Rides \| Wednesday Kids \| Fall | Sep 9/16/23/30; Oct 7/14 | 6-10 | $341.25 | Open |
| ACT-0809 *(new)* | DYRT Rides \| Wednesday Youth \| Fall | Sep 9/16/23/30; Oct 7/14 | 10-16 | $341.25 | Open |
| ACT-0786 | DYRT Rides \| Sunday Kids \| Fall | Sep 13/20/27; Oct 4/11/18 | 6-10 | $462.00 | Open |
| ACT-0787 | DYRT Rides \| Sunday Youth \| Fall | Sep 13/20/27; Oct 4/11/18 | 10-16 | $462.00 | Open |

**Note:** Fall Wednesday rides (ACT-0808, ACT-0809) were missing from DB entirely — confirmed on website and added.

---

## GRIP Programs (Girls Riding with Integrity & Purpose)

**Verified on:** https://www.endlessbiking.com/grip

- For girls, female-identifying, non-binary, and gender-expansive youth
- Kids ages: 6-9 | Youth ages: 10-17
- 5:1 instructor ratio | Minimum Skill Level 2 required
- **Price NOT visible on public website** — cost set to null + costNote per Rule R22

| ID | Name | Dates | Ages | Days/Time | Cost | Status |
|---|---|---|---|---|---|---|
| ACT-0315 | GRIP \| Youth Spring \| May | May 6, 13, 20, 27 | 10-17 | Wed 4:15-6:15 PM | null* | Open |
| ACT-0321 | GRIP \| Kids Spring \| June | Jun 4, 11, 18, 25 | 6-9 | Thu 4:15-6:15 PM | null* | Open |
| ACT-0324 | GRIP \| Youth Spring \| June | Jun 5, 12, 19, 26 | 10-17 | Fri 4:15-6:15 PM | null* | Open |
| ACT-0810 *(new)* | GRIP \| Youth Summer Camp | Jul 27-31 | 10-17 | Mon-Fri 9:00 AM-3:00 PM | null* | Open |

*costNote on each program: "Price not listed on endlessbiking.com/grip. Contact Endless Biking at 604-985-2519 or info@endlessbiking.com."

**Previous costs ($236.25) were from ACTIVE Network API and could not be verified on the live public website.**

---

## COG Kids

**Verified on:** https://www.endlessbiking.com/cogkids

- Mountain biking for kids with autism/neurodivergence
- Ages: 8-15 | 2:1 participant-to-instructor ratio
- Locations: Lower Seymour Demonstration Forest, Blueridge, Mt. Fromme
- **Price NOT visible on public website** — cost set to null + costNote per Rule R22

| ID | Name | Dates | Ages | Days/Time | Cost | Status |
|---|---|---|---|---|---|---|
| ACT-0317 | COG Kids \| Spring May | May 7, 14, 21, 28 | 8-15 | Thu 4:45-6:15 PM | null* | Open |

*costNote: "Price not listed on endlessbiking.com/cogkids. Contact Endless Biking at 604-985-2519."

**Previous cost ($372.75) was from ACTIVE Network API and could not be verified on the live public website.**

---

## Summer Camps

**Verified on:** https://www.endlessbiking.com/summer-camp

- Kids ages: 6-9 (separate AM and PM half-day sessions per week)
- Youth ages: 9-16 (full-day)
- Kids AM: 9:00 AM – 12:00 PM | Kids PM: 1:00 PM – 4:00 PM | Youth: 9:00 AM – 3:00 PM
- Certified mountain bike coaches
- Registration opened April 1, 2026

### Pricing (verified on website)

| Type | 5-day weeks | 4-day weeks |
|---|---|---|
| Kids AM or PM | $435 + GST = $456.75 | $350 + GST = $367.50 |
| Youth | $655 + GST = $687.75 | $555 + GST = $582.75 |

4-day weeks: Wk3 (Jul 21-24, starts Tuesday) and Wk4 (Aug 4-7, BC Day Monday)

### Kids AM

| ID | Name | Dates | Cost | Status |
|---|---|---|---|---|
| ACT-0790 *(new)* | Summer Camp \| Kids AM \| Wk1 (Jul 6-10) | Jul 6-10 (Mon-Fri) | $456.75 | Open |
| ACT-0791 *(new)* | Summer Camp \| Kids AM \| Wk2 (Jul 13-17) | Jul 13-17 (Mon-Fri) | $456.75 | Open |
| ACT-0792 *(new)* | Summer Camp \| Kids AM \| Wk3 (Jul 21-24) | Jul 21-24 (Tue-Fri, 4-day) | $367.50 | Open |
| ACT-0793 *(new)* | Summer Camp \| Kids AM \| Wk4 (Aug 4-7) | Aug 4-7 (Tue-Fri, 4-day) | $367.50 | Open |
| ACT-0794 *(new)* | Summer Camp \| Kids AM \| Wk5 (Aug 10-14) | Aug 10-14 (Mon-Fri) | $456.75 | Open |
| ACT-0795 *(new)* | Summer Camp \| Kids AM \| Wk6 (Aug 17-21) | Aug 17-21 (Mon-Fri) | $456.75 | Open |

### Kids PM

| ID | Name | Dates | Cost | Status |
|---|---|---|---|---|
| ACT-0796 *(new)* | Summer Camp \| Kids PM \| Wk1 (Jul 6-10) | Jul 6-10 (Mon-Fri) | $456.75 | Open |
| ACT-0797 *(new)* | Summer Camp \| Kids PM \| Wk2 (Jul 13-17) | Jul 13-17 (Mon-Fri) | $456.75 | Open |
| ACT-0798 *(new)* | Summer Camp \| Kids PM \| Wk3 (Jul 21-24) | Jul 21-24 (Tue-Fri, 4-day) | $367.50 | Open |
| ACT-0799 *(new)* | Summer Camp \| Kids PM \| Wk4 (Aug 4-7) | Aug 4-7 (Tue-Fri, 4-day) | $367.50 | Open |
| ACT-0800 *(new)* | Summer Camp \| Kids PM \| Wk5 (Aug 10-14) | Aug 10-14 (Mon-Fri) | $456.75 | Open |
| ACT-0801 *(new)* | Summer Camp \| Kids PM \| Wk6 (Aug 17-21) | Aug 17-21 (Mon-Fri) | $456.75 | Open |

### Youth

| ID | Name | Dates | Cost | Status |
|---|---|---|---|---|
| ACT-0802 *(new)* | Summer Camp \| Youth \| Wk1 (Jul 6-10) | Jul 6-10 (Mon-Fri) | $687.75 | Open |
| ACT-0803 *(new)* | Summer Camp \| Youth \| Wk2 (Jul 13-17) | Jul 13-17 (Mon-Fri) | $687.75 | Open |
| ACT-0804 *(new)* | Summer Camp \| Youth \| Wk3 (Jul 21-24) | Jul 21-24 (Tue-Fri, 4-day) | $582.75 | Open |
| ACT-0805 *(new)* | Summer Camp \| Youth \| Wk4 (Aug 4-7) | Aug 4-7 (Tue-Fri, 4-day) | $582.75 | Open |
| ACT-0806 *(new)* | Summer Camp \| Youth \| Wk5 (Aug 10-14) | Aug 10-14 (Mon-Fri) | $687.75 | Open |
| ACT-0807 *(new)* | Summer Camp \| Youth \| Wk6 (Aug 17-21) | Aug 17-21 (Mon-Fri) | $687.75 | Open |

---

## Completeness Check

| Program Type | Website | DB Before | DB After | Delta |
|---|---|---|---|---|
| Spring Break Kids AM | 2 weeks | 1 | 2 | +1 |
| Spring Break Youth | 2 weeks | 1 | 2 | +1 |
| DYRT Wednesday Kids | 3 blocks | 2 | 3 | +1 |
| DYRT Wednesday Youth | 3 blocks | 2 | 3 | +1 |
| DYRT Sunday Kids | 3 blocks | 3 | 3 | 0 |
| DYRT Sunday Youth | 3 blocks | 3 | 3 | 0 |
| GRIP Kids Spring | 1 | 1 | 1 | 0 |
| GRIP Youth Spring | 2 | 2 | 2 | 0 |
| GRIP Youth Summer | 1 | 0 | 1 | +1 |
| COG Kids Spring | 1 | 1 | 1 | 0 |
| Summer Camp Kids AM | 6 weeks | 0 | 6 | +6 |
| Summer Camp Kids PM | 6 weeks | 0 | 6 | +6 |
| Summer Camp Youth | 6 weeks | 0 | 6 | +6 |
| **TOTAL** | **39** | **16** | **39** | **+23** |

---

## Issues Requiring Follow-Up

1. **GRIP/COG prices not on public website** — ACT-0315, ACT-0317, ACT-0321, ACT-0324, ACT-0810 all have `cost: null`. A future agent or Tom should verify prices by calling 604-985-2519 or accessing the Active Network registration portal directly.

2. **R46 soft warnings (expected)** — 10 programs have age ranges spanning 7+ years. Verified on website that Endless Biking does NOT subdivide these into narrower age bands. The warnings are expected.

3. **Summer camp 4-day week start days** — Wk3 (Jul 21) and Wk4 (Aug 4) are set to "Tue-Fri". Verify: Jul 20 is not a Canadian holiday; Jul 21 appears to just be a Tuesday start. Aug 3 = BC Day (holiday). Both confirmed 4-day from website listing.
