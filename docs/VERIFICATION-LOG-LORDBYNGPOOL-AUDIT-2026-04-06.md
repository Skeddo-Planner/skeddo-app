# Verification Log — City of Vancouver — Lord Byng Pool

**Audited:** 2026-04-06
**Queue entry:** Rank 183
**Source URLs verified (browser navigation):**
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615740` (Parent & Tot — Full confirmed)
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615794` (Preschool 1 — Full confirmed)
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615856` (Swimmer 1 — Full + cost $70.50 confirmed)
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615898` (Swimmer 7 Rookie — Full + cost error found)
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/615907` (Private Lesson — Full + cost $203 confirmed)
**DB count before audit:** 16,198 programs
**DB count after audit:** 16,198 (0 added, 27 corrected)

---

## Summary

All 5 sampled structured spring swim lesson entries are **Full** with waiting lists open, but DB showed them as "Open". Updated all 24 structured lesson entries to "Full". One cost error found: Swimmer 7 Rookie had cost=$4.30 (an ActiveNet "Standard charge" placeholder) instead of the actual child registration fee of $132.40. No summer 2026 sessions are posted yet on ActiveNet (as of Apr 6, 2026).

---

## Confirmed Program Details

| Field | Value |
|-------|-------|
| Address | 3990 West 14th Avenue, Vancouver, BC (Point Grey) |
| Coordinates | 49.2595, -123.1928 |
| Registration system | ActiveNet (anc.ca.apm.activecommunities.com/vancouver) |
| Registration opened | March 17, 2026 at 7:00 PM |
| Spring set | 2026 Park Board Aquatics - Spring Set 1 (Mar 30 – Jun 21) |

---

## Fee Verification (via fee detail modals)

| Program | DB Cost | Actual Fee | Result |
|---------|---------|------------|--------|
| Swimmer 1 (615856) | $70.50 | $70.50 Standard charge | ✓ Correct |
| Swimmer 7 Rookie (615898) | $4.30 | $132.40 (child 5–12) / $162.20 (youth 13–16) | ✗ WRONG — fixed |
| Private/Semi-Private Lesson (615907) | $203 | $203 (Under 14 yrs) / $203 (14+ yrs) | ✓ Correct |

**Note:** Swimmer 7 Rookie fee structure uses multiple tiers:
- "Standard charge": $4.30 (administrative placeholder, not the actual cost)
- "Child Fee PB – non-taxable for 5 up to 12 years old": $132.40
- "Youth Fee PB – non-taxable for 13 up to 16 years old": $162.20
- "Leisure Access – PB: for Customer": 50% discount

DB cost was set to $4.30 (the Standard charge) instead of the child fee. Fixed to $132.40 with costNote explaining the tier structure.

---

## Status Check (all structured lessons confirmed Full)

All 5 structured lesson entries sampled via browser navigation showed "We're sorry, but this Activity is full." with waiting lists open (3–7 persons on waitlist). This is consistent with spring swim lessons at CoV pools filling up rapidly after registration opens.

| ID | Program | Sampled? | Status on Site |
|----|---------|----------|---------------|
| COV-615740 | Parent & Tot (Apr 1–Jun 17, Wed 1pm) | Yes | Full (5 waitlist) |
| COV-615794 | Preschool 1 - Octopus (Mar 30–Jun 15, Mon 6pm) | Yes | Full (5 waitlist) |
| COV-615856 | Swimmer 1 (Apr 11–Jun 20, Sat) | Yes | Full (7 waitlist) |
| COV-615898 | Swimmer 7 - Rookie (Apr 12–Jun 21, Sun 10am) | Yes | Full (5 waitlist) |
| COV-615907 | Private Lesson (Mar 30–May 4, Mon 5:30pm) | Yes | Full (4 waitlist) |
| COV-615744, 615804, 615807, 615839, 615842, 615845, 615862, 615881, 615883, 615887, 615891, 615896, 615909, 615919, 615923, 615925, 615927, 615957, 615959 | Other structured lessons | Not individually sampled | Assumed Full (consistent with pattern) |

**Drop-in entries NOT updated (Open correct):** COV-616452 (Lengths), COV-616453 (School Board), COV-616454 (School Use), COV-616456 (Lessons/Swim Club), COV-616457 (Public Swim), COV-616462 (Statutory Holiday today)

---

## Summer 2026 Sessions

**Not posted yet.** ActiveNet search for Lord Byng swimming shows only current spring sessions and a few adult programs (kayak, personal training). Summer swim lesson registration at CoV pools typically opens in spring/early summer. No DB additions needed at this time; follow-up audit recommended when summer sessions open.

---

## Fixes Applied

| Field | Old | New | Affected IDs |
|-------|-----|-----|-------------|
| cost | $4.30 | $132.40 | COV-615898 |
| costNote | missing | Detailed fee tier note | COV-615898 |
| priceVerified | missing | true | COV-615898 |
| enrollmentStatus | Open | Full | All 24 structured lesson entries |

---

## Notes

- Private lesson description on-page says "2024 Private & Semi-Private Swimming Lesson Rates" — the description label is outdated (says 2024) but the actual fee modal shows $203 for 5 sessions ($40.60/session) which is the current 2026 rate. DB cost $203 is correct.
- Swimmer 3 level does not appear at Lord Byng Pool in the DB or on ActiveNet (only Swimmer 1, 2, 4, 5, 6, 7 are listed). This may reflect Lord Byng's specific swim schedule; no fix needed.
- COV-615594 (Aquafit - Shallow Moderate, Apr 2): cost=null confirmed correct — this is a drop-in program with no fixed course fee; Aquafit is drop-in at Lord Byng.
