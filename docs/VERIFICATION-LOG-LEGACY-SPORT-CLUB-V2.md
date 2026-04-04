# Verification Log — Legacy Sport Club (V2 Audit)

**Auditor:** Claude (claude-sonnet-4-6)
**Date:** 2026-04-03
**Scope:** Small fixes based on Tom's spot-check feedback
**Source page:** https://www.legacysportclub.com/multi-sport-programs/summer-camps

---

## Changes Made

### Fix 1: Remove `isEstimate` flag from Week 1 (legacy-whistler-w1)

**Program:** Legacy Sport Club — Music & Multi-Sport (Jun 29–Jul 3)
**Issue:** `isEstimate: true` was set, causing `~$280` to display on the frontend.
**Resolution:** Tom confirmed on the registration page that the price is $280. Removed `isEstimate` flag and set `priceVerified: true`.

| Field | Before | After |
|-------|--------|-------|
| `isEstimate` | `true` | *(removed)* |
| `priceVerified` | `false` | `true` |

---

### Fix 2: Add missing Drop-In Summer Camp listing (legacy-whistler-dropin)

**Issue:** A standalone drop-in day option ($80) was listed on the same registration page as the weekly camps but was absent from the database.
**Resolution:** Added new program `legacy-whistler-dropin`.

| Field | Value | Source |
|-------|-------|--------|
| `id` | `legacy-whistler-dropin` | assigned |
| `name` | Legacy Sport Club — Multi-Sport Camp Drop-In Day | registration page |
| `provider` | Legacy Sport Club | known |
| `category` | Multi-Activity | consistent with weekly camps |
| `activityType` | Multi-Sport | consistent with weekly camps |
| `ageMin` | 6 | consistent with weekly camps |
| `ageMax` | 12 | consistent with weekly camps |
| `cost` | 80 | Tom's spot-check confirmation |
| `costNote` | $80/drop-in day; available throughout summer camp season (Jun 29–Aug 28); financial aid via PLAY Credit or KidSport Canada | derived from weekly camp notes |
| `startDate` | 2026-06-29 | first day of summer camps |
| `endDate` | 2026-08-28 | last day of summer camps |
| `repeating` | `true` | required for 60-day span (R2) |
| `days` | Mon-Fri | consistent with weekly camps |
| `address` | 1080 Legacy Way, Whistler, BC V8E 0K3 | same venue as weekly camps |
| `neighbourhood` | Whistler | correct for address |
| `registrationUrl` | https://www.legacysportclub.com/multi-sport-programs/summer-camps | same page as weekly camps |
| `enrollmentStatus` | Open | consistent with weekly camps |
| `season` | Summer 2026 | correct |
| `dayLength` | Full Day | computed (durationPerDay=6) |
| `confirmed2026` | `true` | Tom confirmed on live page |
| `priceVerified` | `true` | Tom confirmed $80 on live page |
| `campType` | Drop-in | correct type |
| `scheduleType` | Full Day | computed (durationPerDay=6h) |
| `indoorOutdoor` | Both | consistent with weekly camps |
| `startTime` | 9:00 AM | consistent with weekly camps |
| `endTime` | 3:00 PM | consistent with weekly camps |
| `durationPerDay` | 6 | computed from start/end times |
| `city` | Whistler | correct |

---

## Program Count Verification

| Week | ID | Name | Cost | Status | isEstimate |
|------|-----|------|------|--------|-----------|
| Jun 29–Jul 3 | legacy-whistler-w1 | Music & Multi-Sport | $280 | Open | *(removed — confirmed)* |
| Jul 6–10 | legacy-whistler-w2 | Art & Multi-Sport | $350 | Open | — |
| Jul 13–17 | legacy-whistler-w3 | Cooking & Multi-Sport | $345 | Full | — |
| Jul 20–24 | legacy-whistler-w4 | Rockwall & Multi-Sport | $350 | Open | — |
| Jul 27–31 | legacy-whistler-w5 | Art & Multi-Sport | $350 | Open | — |
| Aug 4–7 | legacy-whistler-w6 | Legacy Wilderness | $280 | Open | — |
| Aug 10–14 | legacy-whistler-w7 | Music & Multi-Sport | $350 | Open | — |
| Aug 17–21 | legacy-whistler-w8 | Drama & Multi-Sport | $350 | Open | — |
| Aug 24–28 | legacy-whistler-w9 | Art & Multi-Sport | $350 | Open | — |
| Summer | legacy-whistler-dropin | Multi-Sport Camp Drop-In Day | $80 | Open | — |

**Total after V2 audit:** 10 programs (9 weekly + 1 drop-in)

---

## Validator Output

```
Total programs: 13781
Violations (before): 1759
Violations (after):  1758
Auto-fixed: 0
No violations on Legacy Sport Club programs.
Rules checked: R1–R34, R39, R43, R46, R48 + REQ
```
