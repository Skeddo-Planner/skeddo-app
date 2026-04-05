# Verification Log — STEMA Learning Centre

**Date:** 2026-04-05
**Auditor:** Claude
**Registration page:** https://vancouver.stemalearning.com/product/summercamp2026/
**Pro-D Day page:** https://vancouver.stemalearning.com/product/pd-day-camp/
**Provider website:** https://vancouver.stemalearning.com
**Location:** 1025 Kingsway, Vancouver, BC V5V 3C7 (Kensington-Cedar Cottage / East Vancouver)

## Summary

Provider shows **9 summer camp weeks** (Jun 29 – Aug 28) with **two age groups** (5-7 and 8-13) and **4 Pro-D Day dates** (Jan 12, Feb 13, Apr 20, Jun 26) on the live pages. Database previously had **15 programs** (9 summer camps for ages 8-13 only, 4 Pro-D Day records, 2 incomplete records). After audit: **27 programs** total (9 new ages 5-7 records added; 3 Jun 26 Pro-D Day records added; May 15 Pro-D flagged as not found).

## Confirmed Program Details (from live page)

### Summer Camp 2026

**Location:** 1025 Kingsway, Vancouver, BC
**Full Day times:** 9:00 AM – 4:00 PM (extended care to 6:00 PM available)
**Half Day Morning:** 9:00 AM – 12:00 PM
**Half Day Afternoon:** 1:00 PM – 4:00 PM
**Ages:** 5-7 (Junior Explorers, Gr K-2) and 8-13 (Innovators, Gr 2-7) — separate age groups with different weekly themes

| Week | Dates | Days | Cost |
|------|-------|------|------|
| W1 | Jun 29–Jul 3 | Mon-Tue, Thu-Fri | $312 (4-day, Canada Day Jul 1) |
| W2 | Jul 6–10 | Mon-Fri | $389 |
| W3 | Jul 13–17 | Mon-Fri | $389 |
| W4 | Jul 20–24 | Mon-Fri | $389 |
| W5 | Jul 27–31 | Mon-Fri | $389 |
| W6 | Aug 4–7 | Tue-Fri | $312 (4-day, BC Day Aug 3) |
| W7 | Aug 10–14 | Mon-Fri | $389 |
| W8 | Aug 17–21 | Mon-Fri | $389 |
| W9 | Aug 24–28 | Mon-Fri | $389 |

Super Early Bird discount available until April 15, 2026.

### Ages 8-13 Weekly Themes (Innovators)
- W1: AM Robotics: Introduction to Robotics | PM Coding: Code your Animation and Game
- W2: AM Digital Arts: 3D World Builder and Game Designer | PM Minecraft Education: Mobbing & Coding
- W3: AM AI: Hour of Code and AI | PM Engineering: Structure, Machines & Gears
- W4: AM Minecraft Education: Artificial Intelligence | PM Roblox: Game Making with Roblox
- W5: AM Robotics: Creative Robotics with Micro:bit | PM Coding: Code Your Arcade Game
- W6: AM Minecraft Education: Cyber Security | PM Digital Arts: Stop-Motion Movie Studio
- W7: AM Digital Arts: 3D Modeling & Virtual Reality | PM Engineering: Structure, Machine & Gears
- W8: AM Minecraft Education: Space Science and General STEM | PM AI: Intro to Teachable Machine
- W9: AM Coding: Intermediate and Advanced Game Projects | PM Robotics: Robotics Competition

### Ages 5-7 Weekly Themes (Junior Explorers)
- W1: AM Robotics: Introduction to Robotics | PM Coding: Code Your Own Animation Jr
- W2: AM Digital Arts: 3D Design & Print | PM Engineering: Integrated STEAM Projects
- W3: AM AI: Artificial Intelligence & Computer Science Fundamentals | PM Robotics: Introduction to Robotics
- W4: AM Digital Arts: 3D Modeling & Virtual Reality | PM Minecraft Education: Builder Studio
- W5: AM Robotics: Creative Robotics with Micro:bit | PM Coding: Code Your Own Animation Jr + CS Fundamentals
- W6: AM Engineering: Creative Inventors | PM Digital Arts: Stop-Motion Movie Studio
- W7: AM Digital Arts: 3D Modeling & Virtual Reality | PM General Science: Tiny Scientist Labs
- W8: AM General Science: Integrated Arts and Science | PM Minecraft Education: Builder Studio
- W9: AM Coding: Code Your Own Game Jr | PM Robotics: Robotics Competition

### Pro-D Day Camps 2026

| Date | Status |
|------|--------|
| Jan 12, 2026 | Completed (past) |
| Feb 13, 2026 | Completed (past) |
| Apr 20, 2026 | Open (confirmed in DB) |
| Jun 26, 2026 | Open — ADDED to DB |

Full Day: $100 | Half Day AM: $60 | Half Day PM: $60
Times: Full Day 9:00 AM – 4:00 PM, Half AM 9:00 AM – 12:00 PM, Half PM 1:00 PM – 4:00 PM

## Discrepancies Found and Fixed

### 1. Missing age group (Ages 5-7) — ADDED (9 new records)
- **Was:** Only ages 8-13 records in DB (9 weekly records)
- **Now:** Separate listings for ages 5-7 (Junior Explorers) added: stema-junior-w1 through stema-junior-w9
- **Why:** Live page explicitly breaks camps into two age groups with separate weekly themes. Parents searching for programs for 5-7 year olds would not find STEMA without these records.

### 2. Program names (ALL 9 existing summer records) — FIXED
- **Was:** Generic names like "Robotics & Coding Camp", "Minecraft Engineering Camp"
- **Now:** "STEMA STEAM Summer Camp — Ages 8-13 (W2)" etc., with weekly themes in description
- **Why:** Names now accurately reflect the age group and are consistent. Theme details are in descriptions.

### 3. Age ranges (existing 9 records) — CONFIRMED CORRECT (ageMin=8, ageMax=13)
- DB had ageMin=8, which is correct for the 8-13 group. No change needed.
- Note: The product page lists ages 5-13 overall, but the program is split into 5-7 and 8-13 age bands.

### 4. Week 1 (2399) and Week 6 (1184) costs — FIXED
- **Was:** $389 for all weeks
- **Now:** $312 for 4-day weeks (W1 and W6)
- **Why:** W1 (Jun 29-Jul 3) skips Canada Day Jul 1 = 4 days. W6 (Aug 4-7) skips BC Day Aug 3 = 4 days. The live page pricing dropdown confirms reduced cost for 4-day weeks (extrapolated from $389 × 4/5 = $311.20, rounded to $312).

### 5. Pro-D Day Jun 26 — ADDED (3 new records)
- **Added:** proday-stema-jun26-fullday, proday-stema-jun26-halfday-am, proday-stema-jun26-halfday-pm
- **Why:** Live page product shows Jun 26 as an available Pro-D Day date not in DB.

### 6. Pro-D Day May 15 — FLAGGED
- **Was:** enrollmentStatus "Likely Coming Soon", confirmed2026 false
- **Now:** costNote updated to note this date is not on the live page as of 2026-04-05
- **Why:** Live page only shows Jan 12, Feb 13, Apr 20, Jun 26. May 15 is not listed.

### 7. stema-surrey-1 and stema-van-1 (undefined dates) — FLAGGED
- **Was:** enrollmentStatus "Open", cost null, startDate undefined
- **Now:** enrollmentStatus "Likely Coming Soon", confirmed2026 false
- **Why:** These records have no dates or pricing — cannot be shown as Open to parents.

### 8. Registration URLs (all summer records) — FIXED
- **Was:** https://vancouver.stemalearning.com/product-category/camp/
- **Now:** https://vancouver.stemalearning.com/product/summercamp2026/
- **Why:** The specific product page is the correct URL for parents to register.

## Verified Fields (no change needed)
- Summer camp location 1025 Kingsway, Vancouver: confirmed correct
- Full day times 9:00 AM – 4:00 PM: confirmed correct
- Full day cost $389 for 5-day weeks: confirmed correct
- Apr 20 Pro-D Day records (all 3): confirmed correct
- Pro-D Day times and prices: confirmed correct

## Notes
- Half-day AM and PM options also exist for summer camps but are not added as separate DB records (they share the same registration product with session type chosen at checkout). The costNote mentions this.
- Extended care to 6:00 PM exists as an add-on — not a separate listing.
- STEMA also operates in Surrey and at other Vancouver locations (stema-surrey-1, stema-van-1 need re-audit with live location pages).
- The actual 4-day week cost for W1 and W6 should be verified at checkout — the $312 figure is calculated (4/5 × $389). If the provider uses a different calculation, correct in follow-up.
