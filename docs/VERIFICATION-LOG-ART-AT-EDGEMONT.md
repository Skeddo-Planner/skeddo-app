# Verification Log — Art at Edgemont

**Date:** 2026-04-05
**Auditor:** Claude (automated)
**Registration Pages:**
- https://artatedgemont.com/collections/kids-camps
- https://artatedgemont.com/products/summer-break-camp-by-the-day
- https://artatedgemont.com/products/summer-break-camp-half-days
- https://artatedgemont.com/products/summer-break-camp-full-week
**Status:** COMPLETE

---

## Summary

| Metric | Value |
|--------|-------|
| Summer camp products on live page | 3 (Full Day/Day, Full Week, Half Day AM+PM) |
| Programs in database (before) | 8 |
| Programs corrected | 1 (Half Day price $90.25 → $95) |
| Programs added | 2 (PM Half Day + Full Week) |
| Spring/Year-Round classes | 6 (not summer camps — unchanged) |

---

## Provider Information

- **Name:** Art at Edgemont (Edgemont Village Art Studio)
- **Address:** 3116 Highland Boulevard, North Vancouver, BC V7R 2X6
- **Neighbourhood:** Central Lonsdale / Edgemont Village
- **Phone:** 778-340-1225
- **Email:** hello@theedgemontvillageartstudio.com
- **Website:** https://artatedgemont.com

---

## Summer Camp Products (verified)

| Product | Price | Ages | Times |
|---------|-------|------|-------|
| Full Day (by the day) | $139/day | 6-12 | 9:00 AM – 3:00 PM |
| Full Week | $579/week | 6-12 | 9:00 AM – 3:00 PM |
| Half Day AM | $95/day | 5-12 | 9:00 AM – 12:00 PM |
| Half Day PM | $95/day | 5-12 | 1:00 PM – 4:00 PM |

**Schedule:** 9 weeks, Jun 29 – Aug 28. Week 6 starts Tue Aug 4 (BC Day).
**Format:** Drop-off only; book by the day for flexibility. No refunds/credits.

---

## Corrections Made

| ID | Change |
|----|--------|
| 2619 | cost $90.25 → $95 (matches live site); costNote updated |
| 2618 | costNote updated to reference $95/day consistently |
| 2626 | NEW — PM Half Day listing added ($95/day, 1pm-4pm, ages 5-12) |
| 2627 | NEW — Full Week listing added ($579/week, ages 6-12) |

**Note on R43 false positive (IDs 2619, 2626):** R43 fires for ageMin=5, ageMax=12. Art at Edgemont genuinely accepts ages 5-12 for half-day camp with no separate age bands — verified on artatedgemont.com/products/summer-break-camp-half-days. The validator's R43 heuristic is a false positive here.

---

## Non-Summer Classes (unchanged)

| ID | Name | Status | Notes |
|----|------|--------|-------|
| 2620 | Post-Impressionists 10 Week Session | Open | Starts Apr 13 |
| 2621 | Dragons 6 Week Kids Session | Open | Starts May 21 |
| 2622 | Playing in the Mud 5 Week Clay | Open | Starts Apr 12 |
| 2623 | Clay Wheel 5 Week (Apr 1) | Full | Filled |
| 2624 | Teens Art Class 10 Week | Open | Starts Apr 16 |
| 2625 | Kittens Pre-Schoolers Session | Open | Starts Apr 5 |

These are spring/ongoing classes — URLs verified as active. No changes made.
