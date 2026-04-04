# Pear Tree Education — One-Click Deeper Audit
**Date:** 2026-04-03
**Auditor:** Claude Sonnet 4.6
**Method:** Browser navigation (Claude in Chrome) — every dropdown clicked, every location checked
**Commit:** ec443a8

---

## Summary

| | Before | After |
|---|---|---|
| Total Pear Tree entries | 9 | 169 |
| Removed (wrong data) | — | 9 |
| Net new entries | — | +160 |
| Violations on changed programs | — | 0 |

### What was wrong before

- All 7 Kitsilano summer camp entries used name "STEAM & French Camp" — **wrong** (each week has a specific theme name: Our Community, Urban Gardeners, etc.)
- All entries used `ageMin: 5, ageMax: 12` — **wrong** (provider breaks into 2-year groups: 5-6, 7-8, 9-10, 11-12)
- Registration URL didn't include `#programs` anchor
- 5 other locations (Yaletown, Kerrisdale, Burnaby, North Van, Coquitlam) were **entirely missing**
- Pro-D Day camps: only 1 generic entry for Apr 20 + 1 unverified "Likely Coming Soon" May 15 entry (May 15 doesn't appear on provider website — removed)

---

## Location Directory

| Location | Address | Price/Week | URL |
|---|---|---|---|
| Kitsilano | Suite 215 - 2678 West Broadway, Vancouver, BC V6K 2G3 | $499 | pear-tree.ca/our-camps/summer-camps-vancouver/#programs |
| Yaletown | 1035 Cambie St, Vancouver, BC V6B 5L7 | $499 | pear-tree.ca/our-camps/summer-vancouver-yaletown/#programs |
| Kerrisdale | 2733 W 41st Ave, Vancouver, BC V6N 3C5 | $499 | pear-tree.ca/our-camps/summer-vancouver-kerrisdale/#programs |
| Burnaby (Deer Lake) | 5135 Sperling Ave, Burnaby, BC V5E 2T2 | $459 | pear-tree.ca/our-camps/summer-camps-deer-lake/#programs |
| North Vancouver | 530 E 12th St, North Vancouver, BC V7L 2K4 | $459 | pear-tree.ca/our-camps/summer-camps-north-van/#programs |
| Coquitlam | 2888 Delahaye Dr, Coquitlam, BC V3B 4T5 | $459 | pear-tree.ca/our-camps/summer-tri-cities-coquitlam/#programs |

Prices verified at: https://www.pear-tree.ca/our-camps/summer-camps-overview/

---

## Pro-D Day Camps — Field Verification

**Common fields (all Pro-D Day locations):**
- Times: 9:00 AM – 3:00 PM
- Cost: $99/day
- Extended care: 8–9 AM & 3–5 PM, +$25
- Hot lunch: +$25
- campType: Pro-D Day
- scheduleType: Full Day (6 hrs)
- Verified on: pear-tree.ca registration pages

### Kitsilano Pro-D Days — 4 age groups × 5 dates = 20 entries

**Pro-D Day Dates & Status (as of 2026-04-03):**

| Date | Day | Status |
|---|---|---|
| 2025-09-19 | Friday | Completed |
| 2025-10-24 | Friday | Completed |
| 2025-11-21 | Friday | Completed |
| 2026-02-13 | Friday | Completed |
| 2026-04-20 | Monday | Open |

**5-6 Year Olds:**

| ID | Name | Date | Status |
|---|---|---|---|
| peartree-kits-prod-56-sep2025 | Under the Sea | 2025-09-19 | Completed |
| peartree-kits-prod-56-oct2025 | Mini STEAMers | 2025-10-24 | Completed |
| peartree-kits-prod-56-nov2025 | Fairytale Theatre | 2025-11-21 | Completed |
| peartree-kits-prod-56-feb2026 | Painter's Pallet | 2026-02-13 | Completed |
| peartree-kits-prod-56-apr2026 | Interesting Insects | 2026-04-20 | Open |

**7-8 Year Olds:**

| ID | Name | Date | Status |
|---|---|---|---|
| peartree-kits-prod-78-sep2025 | Connect to Nature | 2025-09-19 | Completed |
| peartree-kits-prod-78-oct2025 | Medieval Times | 2025-10-24 | Completed |
| peartree-kits-prod-78-nov2025 | Amazing Artists | 2025-11-21 | Completed |
| peartree-kits-prod-78-feb2026 | Food, Glorious Food! | 2026-02-13 | Completed |
| peartree-kits-prod-78-apr2026 | Ancient Olympians | 2026-04-20 | Open |

**9-10 Year Olds:**

| ID | Name | Date | Status |
|---|---|---|---|
| peartree-kits-prod-910-sep2025 | Our Living Ocean | 2025-09-19 | Completed |
| peartree-kits-prod-910-oct2025 | Maker Space | 2025-10-24 | Completed |
| peartree-kits-prod-910-nov2025 | TV Reporters | 2025-11-21 | Completed |
| peartree-kits-prod-910-feb2026 | Canada: Then | 2026-02-13 | Completed |
| peartree-kits-prod-910-apr2026 | Graphic Novels | 2026-04-20 | Open |

**11-12 Year Olds:**

| ID | Name | Date | Status |
|---|---|---|---|
| peartree-kits-prod-1112-sep2025 | Photo(shop) | 2025-09-19 | Completed |
| peartree-kits-prod-1112-oct2025 | Artificial Intelligence | 2025-10-24 | Completed |
| peartree-kits-prod-1112-nov2025 | Urban Design 3D | 2025-11-21 | Completed |
| peartree-kits-prod-1112-feb2026 | Film School | 2026-02-13 | Completed |
| peartree-kits-prod-1112-apr2026 | Future Global Leaders | 2026-04-20 | Open |

### Yaletown Pro-D Days — 2 age groups × 5 dates = 10 entries

Yaletown offers Pro-D days for 5-6 and 7-8 year olds only (same dates, same themes as Kitsilano).
URL: https://www.pear-tree.ca/pro-d-day-camp-yaletown/

| Age Group | Themes (by date) |
|---|---|
| 5-6 | Under the Sea, Mini STEAMers, Fairytale Theatre, Painter's Pallet, Interesting Insects |
| 7-8 | Connect to Nature, Medieval Times, Amazing Artists, Food Glorious Food!, Ancient Olympians |

---

## Summer Camps 2026 — Field Verification

**Common fields (all summer locations):**
- Schedule: Mon–Fri (Week 5: Tue–Fri due to BC Day Aug 3, 2026)
- Times: 9:00 AM – 3:00 PM
- Extended care: 8 AM–5 PM, +$125/week
- Hot lunch: +$84/week
- campType: Summer Camp, scheduleType: Full Day (6 hrs)
- enrollmentStatus: Open (all weeks in the future as of audit date)
- confirmed2026: true, priceVerified: true

### Summer Camp Weeks

| Week | Dates | Days |
|---|---|---|
| W1 | Jul 6–10, 2026 | Mon–Fri |
| W2 | Jul 13–17, 2026 | Mon–Fri |
| W3 | Jul 20–24, 2026 | Mon–Fri |
| W4 | Jul 27–31, 2026 | Mon–Fri |
| W5 | Aug 4–7, 2026 | **Tue–Fri** (BC Day Aug 3) |
| W6 | Aug 10–14, 2026 | Mon–Fri |
| W7 | Aug 17–21, 2026 | Mon–Fri |

### Kitsilano Summer Camps ($499/week)

Age groups: 5-6, 7-8, 9-10, 11-12 (separately per provider's booking page)

**5-6 Year Olds (7 weeks):**
W1: Our Community | W2: Urban Gardeners | W3: Under the Sea | W4: Interesting Insects | W5: Plants & Pollinators | W6: Drama 101 | W7: Transportation

**7-8 Year Olds (7 weeks):**
W1: STEM Challenges | W2: Food, Glorious Food | W3: Amazing Artists | W4: Space | W5: Connect to Nature | W6: Junior Scientists | W7: Math Magicians

**9-10 Year Olds (6 weeks — no W4 at Kitsilano):**
W1: Marine Biology | W2: Animation Studios | W3: Kids Can Cook! | W5: Sports Science | W6: TV Reporters | W7: Ancient Egypt
> Note: Week 4 (Jul 27–31) is not offered for 9-10 year olds at Kitsilano specifically. Verified on booking page — tab shows only 6 entries.

**11-12 Year Olds (7 weeks):**
W1: Acting Studios | W2: Debate Club | W3: Artificial Intelligence | W4: Urban Design 2D/3D | W5: Cooking Science | W6: Entrepreneurs | W7: Film Noir

### Yaletown Summer Camps ($499/week)

Age groups: 5-6, 7-8, 9-10, 11-12 (all 4 groups, all 7 weeks)

**5-6 & 7-8:** Same themes as Kitsilano
**9-10 Year Olds (7 weeks — includes W4 Maker Space):**
W1: Marine Biology | W2: Animation Studios | W3: Kids Can Cook! | W4: **Maker Space** | W5: Sports Science | W6: TV Reporters | W7: Ancient Egypt
**11-12:** Same themes as Kitsilano

### Kerrisdale Summer Camps ($499/week)

Age groups: 5-6, 7-8, **9-12 combined** (per provider's booking page — only 3 tabs)

**5-6 Year Olds:** W1: Our Community | W2: Painters Pallet | W3: Interesting Insects | W4: Urban Gardeners | W5: Nature Explorers | W6: Drama 101 | W7: Transportation
**7-8 Year Olds:** W1: STEM Challenges | W2: Amazing Artists | W3: Space | W4: Math Magicians | W5: Connect to Nature | W6: Junior Scientists | W7: Medieval Times
**9-12 Year Olds:** W1: Film School | W2: Graphic Novels | W3: O'Canada | W4: Maker Space | W5: Animation Studios | W6: Photo(shop) | W7: Film Noir

### Burnaby (Deer Lake) Summer Camps ($459/week)

Same age groups and themes as Kerrisdale. Address: 5135 Sperling Ave, Burnaby, BC V5E 2T2

### North Vancouver Summer Camps ($459/week)

Same age groups and themes as Kerrisdale. Address: 530 E 12th St, North Vancouver, BC V7L 2K4

### Coquitlam Summer Camps ($459/week)

Same age groups and themes as Kerrisdale. Address: 2888 Delahaye Dr, Coquitlam, BC V3B 4T5

---

## Completeness Check

**Provider registration page shows:**
- 6 summer camp locations ✅
- 2 Pro-D Day locations (Kitsilano + Yaletown) ✅
- Kitsilano: 4 age groups for summer, 4 for Pro-D ✅
- Yaletown: 4 age groups for summer, 2 for Pro-D ✅
- Kerrisdale/Burnaby/NorthVan/Coquitlam: 3 age groups each ✅
- 7 weeks of summer camps per location/age group ✅ (Kits 9-10 has 6 — verified)
- 5 Pro-D days per location/age group ✅

**Our database after audit:**
- 169 Pear Tree entries total ✅
- 0 violations ✅

---

## What Was NOT Included

- **French/ESL Camps (Kitsilano)** — offered but not scoped in this audit
- **Spring Camps (Kitsilano + Yaletown)** — offered but spring break already passed; not scoped
- **Exam Tutoring** — not a camp, not in scope
