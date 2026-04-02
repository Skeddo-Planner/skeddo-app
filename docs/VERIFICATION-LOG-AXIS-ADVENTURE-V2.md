# Axis Adventure Camps – Verification Log V2
**Date:** 2026-04-02
**Agent:** Claude Sonnet 4.6
**Registration page:** https://axiscamps.playbookapi.com/programs/register/
**Provider website:** https://axisadventurecamps.com/
**Prior listings:** 4 | **New listings:** 85 | **Method:** Browser navigation + DOM extraction

---

## Audit Methodology

1. Navigated to `axiscamps.playbookapi.com/programs/register/` in browser
2. Extracted all 85 programs from the `#name_filter` dropdown (85 options confirmed)
3. Extracted prices, dates, spots, and addresses from DOM card elements
4. Verified prices against official website pages:
   - `axisadventurecamps.com/3-5-age-group/`
   - `axisadventurecamps.com/5-12-age-group/`
   - `axisadventurecamps.com/peak-adventures/`
   - `axisadventurecamps.com/fall-camps/`
5. Captured network requests to confirm API endpoint (`/api/class-packages/{pk}/`)

---

## Two Physical Locations Confirmed

| Location | Address | Programs |
|----------|---------|----------|
| Fitzsimmons | 7226 Fitzsimmons Rd, Whistler, BC | Biking Ages 3-5, Spring, Fall |
| Spruce Grove Park | 7328 Kirkpatrick Way, Whistler, BC | Biking Ages 5-12, Peak Adventures |

---

## Program Categories (85 total)

### Category 1: Summer 2026 Biking Ages 3-5 (10 weekly camps)
**Address:** 7226 Fitzsimmons Rd, Whistler, BC
**Age:** 3-5 (children turning 3 by August 28, 2026)
**Schedule:** Mon-Fri, 8:30 AM – 3:00 PM
**Price:** $699/week
**Source:** axisadventurecamps.com/3-5-age-group/ + registration page

| ID | Name | Start | End | Spots |
|----|------|-------|-----|-------|
| axis-biking-3-5-w1 | Week 1 June 29 - July 3 | 2026-06-29 | 2026-07-03 | 4 |
| axis-biking-3-5-w2 | Week 2 July 6-10 | 2026-07-06 | 2026-07-10 | 4 |
| axis-biking-3-5-w3 | Week 3 July 13-17 | 2026-07-13 | 2026-07-17 | 5+ |
| axis-biking-3-5-w4 | Week 4 July 20-24 | 2026-07-20 | 2026-07-24 | 5+ |
| axis-biking-3-5-w5 | Week 5 July 27-31 | 2026-07-27 | 2026-07-31 | 5+ |
| axis-biking-3-5-w6 | Week 6 Aug 3-7 | 2026-08-03 | 2026-08-07 | 5+ |
| axis-biking-3-5-w7 | Week 7 Aug 10-14 | 2026-08-10 | 2026-08-14 | 5+ |
| axis-biking-3-5-w8 | Week 8 Aug 17-21 | 2026-08-17 | 2026-08-21 | 5+ |
| axis-biking-3-5-w9 | Week 9 Aug 24-28 | 2026-08-24 | 2026-08-28 | 5+ |
| axis-biking-3-5-w10 | Week 10 Aug 31 - Sep 4 | 2026-08-31 | 2026-09-04 | 5+ |

**Note:** Registration page shows prices for 3-5 weekly camps as NO_PRICE in DOM (price appears in checkout). Price of $699/week confirmed from axisadventurecamps.com/3-5-age-group/.

---

### Category 2: Summer 2026 Biking Ages 5-12 (10 weekly camps)
**Address:** Spruce Grove Park, 7328 Kirkpatrick Way, Whistler, BC
**Age:** 5-12 (turning 6-12 in 2026)
**Schedule:** Mon-Fri, 8:30 AM – 3:00 PM
**Price:** $699/week
**Source:** axisadventurecamps.com/5-12-age-group/ + registration page ($699 confirmed in DOM)

| ID | Name | Start | End | Spots | Reg Price (DOM) |
|----|------|-------|-----|-------|----------------|
| axis-biking-5-12-w1 | Week 1 June 29 - July 3 | 2026-06-29 | 2026-07-03 | 5+ | $699.00 ✓ |
| axis-biking-5-12-w2 | Week 2 July 6-10 | 2026-07-06 | 2026-07-10 | 5+ | $699.00 ✓ |
| axis-biking-5-12-w3 | Week 3 July 13-17 | 2026-07-13 | 2026-07-17 | 5+ | $699.00 ✓ |
| axis-biking-5-12-w4 | Week 4 July 20-24 | 2026-07-20 | 2026-07-24 | 5+ | $699.00 ✓ |
| axis-biking-5-12-w5 | Week 5 July 27-31 | 2026-07-27 | 2026-07-31 | 5+ | $699.00 ✓ |
| axis-biking-5-12-w6 | Week 6 Aug 3-7 | 2026-08-03 | 2026-08-07 | 5+ | $699.00 ✓ |
| axis-biking-5-12-w7 | Week 7 Aug 10-14 | 2026-08-10 | 2026-08-14 | 5+ | $699.00 ✓ |
| axis-biking-5-12-w8 | Week 8 Aug 17-21 | 2026-08-17 | 2026-08-21 | 5+ | $699.00 ✓ |
| axis-biking-5-12-w9 | Week 9 Aug 24-28 | 2026-08-24 | 2026-08-28 | 5+ | $699.00 ✓ |
| axis-biking-5-12-w10 | Week 10 Aug 31 - Sep 4 | 2026-08-31 | 2026-09-04 | 5+ | $699.00 ✓ |

---

### Category 3: Summer 2026 Peak Adventures Ages 3-5 (10 weekly camps) — No Biking
**Address:** 7328 Kirkpatrick Way, Whistler, BC
**Age:** 3-5
**Schedule:** Mon-Fri, 8:30 AM – 3:00 PM
**Price:** $699/week (confirmed in registration page DOM)

| ID | Start | End | Spots | DOM Price |
|----|-------|-----|-------|-----------|
| axis-peak-3-5-w1 | 2026-06-29 | 2026-07-03 | 5+ | $699.00 ✓ |
| axis-peak-3-5-w2 | 2026-07-06 | 2026-07-10 | 5+ | $699.00 ✓ |
| axis-peak-3-5-w3 | 2026-07-13 | 2026-07-17 | 5+ | $699.00 ✓ |
| axis-peak-3-5-w4 | 2026-07-20 | 2026-07-24 | 5+ | $699.00 ✓ |
| axis-peak-3-5-w5 | 2026-07-27 | 2026-07-31 | 5+ | $699.00 ✓ |
| axis-peak-3-5-w6 | 2026-08-03 | 2026-08-07 | 5+ | $699.00 ✓ |
| axis-peak-3-5-w7 | 2026-08-10 | 2026-08-14 | 5+ | $699.00 ✓ |
| axis-peak-3-5-w8 | 2026-08-17 | 2026-08-21 | 5+ | $699.00 ✓ |
| axis-peak-3-5-w9 | 2026-08-24 | 2026-08-28 | 5+ | $699.00 ✓ |
| axis-peak-3-5-w10 | 2026-08-31 | 2026-09-04 | 5+ | $699.00 ✓ |

---

### Category 4: Summer 2026 Peak Adventures Ages 5-12 (10 weekly camps) — No Biking
Same as Category 3 but ages 5-12. IDs: axis-peak-5-12-w1 through axis-peak-5-12-w10.
All prices: $699.00 confirmed in DOM.

---

### Category 5: Summer 2026 Biking Season Passes – Ages 3-5
**Address:** 7226 Fitzsimmons Rd | **Source:** Registration page DOM

| ID | Program | Cost | Start | End | Spots |
|----|---------|------|-------|-----|-------|
| axis-summer-b35-mw | Mon/Wed Season Pass | $1,803 | 2026-06-29 | 2026-09-02 | 5+ |
| axis-summer-b35-tth | Tue/Thu Season Pass | $1,803 | 2026-06-30 | 2026-09-03 | 5+ |
| axis-summer-b35-mon | Monday Only Season Pass | $984 | 2026-06-29 | 2026-08-31 | 4 |
| axis-summer-b35-tue | Tuesday Only Season Pass | $984 | 2026-06-30 | 2026-09-01 | 5+ |
| axis-summer-b35-wed | Wednesday Only Season Pass | $984 | 2026-07-01 | 2026-09-02 | 5+ |
| axis-summer-b35-thu | Thursday Only Season Pass | $984 | 2026-07-02 | 2026-09-03 | 5+ |
| axis-summer-b35-fri | Friday Only Season Pass | $984 | 2026-07-03 | 2026-08-28 | 4 |
| axis-summer-b35-dropin | Daily Drop In | $150 | 2026-06-29 | 2026-09-04 | 5+ |
| axis-summer-b35-5day | Flexible 5-Day Package | $556 | 2026-06-29 | 2026-08-28 | Open |

---

### Category 6: Summer 2026 Biking Season Passes – Ages 5-12
**Address:** Spruce Grove Park, 7328 Kirkpatrick Way | **Source:** Registration page DOM

| ID | Program | Cost | Start | End |
|----|---------|------|-------|-----|
| axis-summer-b512-mw | Mon/Wed Season Pass | $1,622.70 | 2026-06-29 | 2026-08-26 |
| axis-summer-b512-tth | Tue/Thu Season Pass | $1,662.70 | 2026-06-30 | 2026-08-27 |
| axis-summer-b512-mon | Monday Only Season Pass | $885.60 | 2026-06-29 | 2026-08-24 |
| axis-summer-b512-tue | Tuesday Only Season Pass | $885.60 | 2026-06-30 | 2026-08-25 |
| axis-summer-b512-wed | Wednesday Only Season Pass | $885.60 | 2026-07-01 | 2026-08-26 |
| axis-summer-b512-thu | Thursday Only Season Pass | $885.60 | 2026-07-02 | 2026-08-27 |
| axis-summer-b512-fri | Friday Only Season Pass | $885.60 | 2026-07-03 | 2026-08-28 |
| axis-summer-b512-dropin | Daily Drop In | $150 | 2026-06-29 | 2026-08-28 |
| axis-summer-b512-5day | Flexible 5-Day Package | $556 | 2026-06-29 | 2026-08-28 |

**Note:** Tue/Thu 5-12 shows $1,662.70 vs $1,622.70 for Mon/Wed. This is the actual price
on the registration page ("Summer 2026 Tuesday/Thursday (5-12) $1,662.70"). The official
website says $1,622.70 for both, but registration page is authoritative. Possible data entry
error by provider; recommend Tom verify directly.

---

### Category 7: Summer 2026 Peak Adventures Season Passes – Ages 3-5
**Address:** 7328 Kirkpatrick Way | **Source:** Registration page DOM

| ID | Program | Cost |
|----|---------|------|
| axis-summer-peak35-2day | 2-Day/Week Season Pass | $1,803 |
| axis-summer-peak35-1day | 1-Day/Week Season Pass | $984 |
| axis-summer-peak35-dropin | Daily Drop In | $150 |
| axis-summer-peak35-5day | Flexible 5-Day Package | $556 |

---

### Category 8: Summer 2026 Peak Adventures Season Passes – Ages 5-12
**Address:** 7328 Kirkpatrick Way | **Source:** Registration page DOM

| ID | Program | Cost |
|----|---------|------|
| axis-summer-peak512-2day | 2-Day/Week Season Pass | $1,803 |
| axis-summer-peak512-1day | 1-Day/Week Season Pass | $984 |
| axis-summer-peak512-dropin | Daily Drop In | $150 |
| axis-summer-peak512-5day | Flexible 5-Day Package | $556 |

---

### Category 9: Extended Day Programs
| ID | Season | Cost/Session | Start | End | Time |
|----|--------|-------------|-------|-----|------|
| axis-extended-day-spring | Spring 2026 | $30.00 | 2026-04-06 | 2026-06-25 | 3:15 PM |
| axis-extended-day-summer | Summer 2026 | $29.50 | 2026-06-29 | 2026-09-04 | 3:15 PM |
| axis-extended-day-fall | Fall 2026 | $29.50 | 2026-09-07 | 2026-11-26 | 3:15 PM |

Source: Prices verified directly in registration page DOM (per-session class pricing).

---

### Category 10: Spring 2026 Programs
**Address:** 7226 Fitzsimmons Rd | **Age:** 3-12 | **Schedule:** Mon-Thu, 8:30 AM–3:00 PM
**Note:** No Fridays in spring/fall. Season: April 6 – June 25, 2026.

| ID | Program | Cost | Start | End | Status |
|----|---------|------|-------|-----|--------|
| axis-spring-mw | Mon/Wed Season Pass | $2,160 | 2026-04-06 | 2026-06-24 | Open |
| axis-spring-tth | Tue/Thu Season Pass | $2,160 | 2026-04-07 | 2026-06-25 | Open |
| axis-spring-mon | Monday Only Season Pass | $1,182 | 2026-04-06 | 2026-06-22 | **Full** |
| axis-spring-tue | Tuesday Only Season Pass | $1,182 | 2026-04-07 | 2026-06-23 | Open |
| axis-spring-wed | Wednesday Only Season Pass | $1,182 | 2026-04-08 | 2026-06-24 | Open |
| axis-spring-thu | Thursday Only Season Pass | $1,182 | 2026-04-09 | 2026-06-25 | Open |
| axis-spring-dropin | Daily Drop In | $150 | 2026-04-06 | 2026-06-25 | Open |
| axis-spring-5day | Flexible 5-Day Package | $556 | 2026-04-06 | 2026-06-25 | Open |
| axis-extended-day-spring | Extended Day | $30/session | 2026-04-06 | 2026-06-25 | Open |

Spring Monday Only: "No spots available" confirmed on registration page DOM.

---

### Category 11: Fall 2026 Programs
**Address:** 7226 Fitzsimmons Rd | **Age:** 3-12 | **Schedule:** Mon-Thu, 8:30 AM–3:00 PM
**Season:** August 31 – November 26, 2026

| ID | Program | Cost | Start | End |
|----|---------|------|-------|-----|
| axis-fall-mw | Mon/Wed Season Pass | $2,344 | 2026-08-31 | 2026-11-25 |
| axis-fall-tth | Tue/Thu Season Pass | $2,344 | 2026-09-01 | 2026-11-26 |
| axis-fall-mon | Monday Only Season Pass | $1,279 | 2026-08-31 | 2026-11-23 |
| axis-fall-tue | Tuesday Only Season Pass | $1,279 | 2026-09-01 | 2026-11-24 |
| axis-fall-wed | Wednesday Only Season Pass | $1,279 | 2026-09-02 | 2026-11-25 |
| axis-fall-thu | Thursday Only Season Pass | $1,279 | 2026-09-03 | 2026-11-26 |
| axis-fall-dropin | Daily Drop In | $150 | 2026-08-31 | 2026-11-26 |
| axis-fall-5day | Flexible 5-Day Package | $556 | 2026-08-31 | 2026-11-26 |
| axis-extended-day-fall | Extended Day | $29.50/session | 2026-09-07 | 2026-11-26 |

---

## Price Sources Summary

| Price | Source |
|-------|--------|
| $699/week (weekly biking/peak adv) | Website + registration DOM (5-12 confirmed in DOM) |
| $150/day (drop-in) | Website + registration DOM |
| $556 (5-day package) | Website + registration page |
| $1,803 (summer 2-day season, 3-5) | Registration page DOM |
| $984 (summer 1-day season, 3-5) | Registration page DOM |
| $1,622.70 (summer Mon/Wed, 5-12) | Registration page DOM |
| $1,662.70 (summer Tue/Thu, 5-12) | Registration page DOM |
| $885.60 (summer 1-day season, 5-12) | Registration page DOM |
| $2,160 (spring season pass) | Registration page DOM |
| $1,182 (spring 1-day season) | Registration page DOM |
| $2,344 (fall season pass) | Registration page DOM |
| $1,279 (fall 1-day season) | Registration page DOM |
| $30/session (spring extended day) | Registration page DOM (class sessions list) |
| $29.50/session (summer/fall extended day) | Registration page DOM |

---

## Age Range Verification

- **Ages 3-5:** Provider explicitly states "children turning 3 by August 28, 2026" and "5-year-olds turning 5 in 2026." Provider does NOT sub-divide this range.
- **Ages 5-12:** Provider explicitly states "children turning 6-12 in 2026." Listed as single range on registration page. Provider does NOT use age sub-bands (5-6, 7-8, etc.). R43/R46 soft warnings are acknowledged; this is correct per provider structure.

---

## Completeness Check

- Registration page dropdown: **85 programs** ✓
- Database entries added: **85** ✓
- Removed old entries: 4 (merged into proper individual listings)

---

## Known Items for Follow-Up

1. **Tue/Thu 5-12 price discrepancy**: Registration shows $1,662.70 but website says $1,622.70. Recommend Tom verify with provider.
2. **Spring Monday Only is FULL**: No spots as of April 2, 2026. Marked `enrollmentStatus: "Full"`.
3. **Ages 3-5 biking weekly prices in DOM**: The weekly camp cards for Ages 3-5 don't show price until checkout. Price confirmed from website ($699) which matches Ages 5-12 DOM-confirmed price.
