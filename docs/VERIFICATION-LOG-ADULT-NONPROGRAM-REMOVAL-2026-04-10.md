# Verification Log — Adult, Facility & Non-Program Entry Removal (2026-04-10)

**Date:** 2026-04-10
**Method:** Browser spot-check on ActiveNet + programmatic keyword analysis
**DB count:** 16,582 → 16,110 (472 entries removed across 3 commits)
**Violations before:** 0
**Violations after:** 0

---

## Browser Spot Check Results (10 entries verified)

| ID | Name | Finding |
|----|------|---------|
| COV-603902 | Night Hoops | CCA % pricing, ageMax derivable |
| COV-611985 | Childrens - Hockey | **Wrong status** (page=Full, data=Open), ageMax derivable |
| COV-577115 | Personal Training: Bita | **Adult program** (12+, "Fitness & Health - Adult") |
| COV-603448 | Design & Architecture for Kids | Price $240 ✓, age 7-12 ✓ |
| COV-606741 | Explorers Preschool Summer Camp AM | $123 ✓, age 3-5 ✓, Open ✓ |
| BNB-92068 | Dance Camp | Price $283.50 ✓, **Wrong status** (page=Full, data=Open) |
| BNB-102045 | Aquafit | **Adult program** (14+, "Swimming, Adult") |
| COV-595895 | Cycle Fit | **Adult program** (13+, "Fitness & Health - Adult") |
| COV-607042 | Chess Camp (Beginner) | $144 ✓, age 7-10 ✓, Open ✓ |
| COV-616518 | Skating Preschool Level 1 | **Wrong status** (page=Full, data=Open) |

---

## Root Causes Identified & Fixed

### Root Cause #4: Adult-Only Programs in Youth Database (362 removed)

ActiveNet importers (COV, BNB, WV, LGY, PC) pulled in adult fitness programs alongside youth programs because the API doesn't distinguish by target audience.

| Category | Count |
|----------|-------|
| Aquafit (BNB/COV, ageMin 13-14+) | 90 |
| Cycle Fit / Cycle Xpress (COV, ageMin 13+) | 119 |
| Group Fitness - Zumba/Cardio/Step/etc (COV, ageMin 16+) | 42 |
| Personal Training (COV) | 19 |
| 15-15-15, Yoga Express (LGY/COV, ageMin 14+) | 40 |
| Pilates, Kickbox Cardio, Total Body Training | 7 |
| Spanish: Adult Beginners, Adult & Senior Skate | 5 |
| Other (Tai Chi, Fitness for Parkinsons) | 2 |
| **Not removed (false positives):** Youth-and-Adult, Adult Participation (parent-child), Teen Swimmer | — |

### Root Cause #5: Non-Program Facility Entries (110 removed)

| Type | Count |
|------|-------|
| Squash Court bookings (BNB Reserve In Advance) | 40 |
| Public Swim / Length Swim / Lengths | 33 |
| Public Skate | 24 |
| Pickleball / Badminton Court Bookings | 8 |
| Other (Org Registration Form, Facility Closure, SwimFIT) | 5 |

### Root Cause #2: ageMax Not Parsed (101 fixed)

Extracted ageMax from description text containing age ranges for 101 entries.

### Root Cause #3: Stale Enrollment Statuses (identified, not fully fixable offline)

3 of 10 spot-checked entries had wrong enrollment status (page=Full but data=Open). This requires live checking against ActiveNet which can't be done offline for all 5,000+ entries.

---

## Summary

| Action | Count |
|--------|-------|
| Adult-only programs removed | 362 |
| Non-program/facility entries removed | 110 |
| ageMax extracted from descriptions | 101 |
| ageSpanJustified set (R46 fix) | 13 |
| R5 fix (bad ageMax extraction reverted) | 1 |
| **Total entries removed** | **472** |
| **Total entries improved** | **115** |
| **New program count** | **16,110** |
