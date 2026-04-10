# Verification Log — Collingwood School / A2I Misattribution Fix (2026-04-10)

**Date:** 2026-04-10
**Method:** Chrome browser verification on collingwood.org and campscui.active.com
**DB count:** 16,582 programs (unchanged)
**Violations before:** 0
**Violations after:** 0

---

## Systemic Issue: Wrong Provider Attribution

86 entries attributed to "Access2Innovate / Collingwood" are actually **Collingwood School** programs — a completely separate organization.

### Evidence

| Source | Finding |
|--------|---------|
| A2I registration (campscui.active.com/orgs/Access2InnovateFoundation2) | Only STEM/robotics camps at The Shipyards, North Vancouver. 32 summer sessions. |
| Collingwood School registration (campscui.active.com/orgs/CollingwoodSchool0) | Separate Active.com org for Collingwood School |
| collingwood.org/community/camps/dates-rates | Programs match our DB entries (Splash of Colour, Multi-Sports, Musical Theatre, Ceramics, etc.) |
| Address (2605 Wentworth Ave, West Vancouver) | Collingwood School's campus, NOT A2I location |
| A2I address (125 Victory Ship Way, North Vancouver) | Different city, different organization |

### Root Cause
The original audit incorrectly merged two separate organizations that both use Active.com for registration. A2I may have a partnership with schools (Mulgrave, possibly Collingwood) for hosting camps, but Collingwood School runs its own independent summer camp program.

---

## Fixes Applied

### 1. Provider Attribution (86 entries)
Changed `provider` from "Access2Innovate / Collingwood" to "Collingwood School"

### 2. URLs Added (86 entries)
Set `url` to `https://www.collingwood.org/community/camps/dates-rates`

### 3. Pricing Added (47 entries, was null)
Browser-verified on collingwood.org/community/camps/dates-rates:

| Grade Group | Ages | Half-Day | Full-Day | Entries |
|-------------|------|----------|----------|---------|
| K | 4-5 | $310 | — | 8 |
| JK | 3-4 | $310 | — | 1 |
| Grades 1-2 | 5-7 | $300 | $600 | 17 |
| Grades 3-5 | 7-10 | $300 | $600 | 13 |
| Grades 6-8 | 10-13 | $250-$325 | $400-$700 | 6 |
| Leadership | 13-14 | — | $400 | 1 |
| Lunch Program | — | $90 | — | 2 |

### 4. Age Ranges Corrected (60+ entries)
The original audit mapped grades to ages incorrectly (e.g., Grade 1 → age 6 instead of 5).
Corrected using collingwood.org's actual age ranges:

| Grade | Old ageMin | Correct ageMin-ageMax | Source |
|-------|-----------|----------------------|--------|
| K | 5 | 4-5 | "Age 4-5 (born in 2021)" |
| Grades 1-2 | 6 | 5-7 | "Ages 5-7 (born 2019-2020)" |
| Grades 3-5 | 8 | 7-10 | "Ages 7-10 (born 2016-2018)" |
| Grades 6-8 | 11 | 10-13 | "Ages 10-13 (born 2013-2015)" |
| JK | 8 (!) | 3-4 | Junior Kindergarten |

### 5. A2I (actual) URLs Fixed (11 entries)
Set URL to `https://www.access2innovate.com/camps` for the 11 actual A2I ProD Day camp entries that had no URL.

---

## Also Fixed: CLAUDE.md R24 Wording

Updated CLAUDE.md to match the actual rules doc and validator — `campscui.active.com` is a legitimate registration platform and is ALLOWED. Only `activekids.com` is banned (R24).

---

## Summary

| Action | Count |
|--------|-------|
| Provider corrected (A2I/Collingwood → Collingwood School) | 86 |
| URLs added | 97 |
| Null costs filled with browser-verified prices | 47 |
| Age ranges corrected | 60+ |
| A2I ProD Day camp URLs added | 11 |
| **Total entries fixed** | **86 + 11 = 97** |
