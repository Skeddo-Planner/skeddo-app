# Verification Log — City of Vancouver - Sunset Cmty Centre

**Audited:** 2026-04-05
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=41&min_age=0&max_age=17&viewMode=list
**Live page count:** 297 programs (ages 0–17, in-progress/future)
**DB count after audit:** 93 programs

---

## Summary

Live page shows 297 programs. DB has 93 programs after fixing 6 status errors and adding 8 missing programs. Gap of ~204 is largely birthday party time slots and B–Z programs not yet visible due to virtual renderer limitation.

**Center ID discovery:** center_ids=41 was unknown in the queue. Discovered by trying sequential IDs (confirmed by "Sunset Community Centre" appearing in the filter label).

**Status fixes:** 4 Bhangra Dance series classes were Open but actually Full (0 openings confirmed on live page). Guitar slot COV-614384 was Open but Full. sunset-cc-camp-1 was Completed but has registrationDate=2026-04-08 (should be Coming Soon).

**Validator fix:** R43 now respects `ageSpanJustified` flag to suppress false positives on verified single-bracket age ranges (same as R46). Added to `validate-programs.cjs`.

---

## Fixes Applied This Audit

| ID | Field | Old | New | Reason |
|----|-------|-----|-----|--------|
| sunset-cc-camp-1 | enrollmentStatus | Completed | Coming Soon | registrationDate=2026-04-08; can't be Completed before registration opens |
| COV-589473 | enrollmentStatus | Open | Full/Waitlist | Live page: 0 openings, waitlist open (1 person on waitlist) |
| COV-589474 | enrollmentStatus | Open | Full/Waitlist | Live page: 0 openings |
| COV-589475 | enrollmentStatus | Open | Full/Waitlist | Live page: 0 openings |
| COV-589475 | ageSpanJustified | — | Added | R46 suppression: 604 Bhangra uses single 9.5+ yrs bracket (age 9–17) |
| COV-589477 | enrollmentStatus | Open | Full/Waitlist | Live page: 0 openings |
| COV-614384 | enrollmentStatus | Open | Full/Waitlist | Live page: 0 openings |
| COV-614384 | ageSpanJustified | — | Added | R43/R46 suppression: private lesson single slot open to ages 5–12 |

---

## Programs Added This Audit (8)

| ID | Name | Dates | Time | Ages | Cost | Status |
|----|------|-------|------|------|------|--------|
| COV-595069 | 3D Flower Canvas Workshop | May 17, 2026 | Sun 10:00–11:15 AM | 6–10 | $15 | Open (9 openings) |
| COV-614379 | Acoustic Guitar - Private Lessons with Artemis | Apr 12–Jun 21, 2026 | Sun 2:00–2:30 PM | 5–12 | $200 | Full/Waitlist |
| COV-614380 | Acoustic Guitar - Private Lessons with Artemis | Apr 12–Jun 21, 2026 | Sun 2:30–3:00 PM | 5–12 | $200 | Open (1 opening) |
| COV-614381 | Acoustic Guitar - Private Lessons with Artemis | Apr 12–Jun 21, 2026 | Sun 3:00–3:30 PM | 5–12 | $200 | Full/Waitlist |
| COV-614382 | Acoustic Guitar - Private Lessons with Artemis | Apr 12–Jun 21, 2026 | Sun 3:30–4:00 PM | 5–12 | $200 | Open (1 opening) |
| COV-614383 | Acoustic Guitar - Private Lessons with Artemis | Apr 12–Jun 21, 2026 | Sun 4:00–4:30 PM | 5–12 | $200 | Full/Waitlist |
| COV-589482 | Active French Immersion Tumble, Flex and Dance | Apr 15–Jun 17, 2026 | Wed 3:45–4:45 PM | 5–8 | $160 | Open (8 openings) |
| COV-589479 | Activity Studio & Phonics | Apr 19–Jun 14, 2026 | Sun 9:15–10:10 AM | 4–5 | $84 | Open (6 openings) |

---

## Spot-Checks

### 3D Flower Canvas Workshop — COV-595069 (live #597991)
- **Date:** May 17, 2026, Sun 10:00–11:15 AM ✓
- **Age:** 6 to <11 (ageMin=6, ageMax=10) ✓
- **Cost:** $15 ✓
- **Status:** Open (9 openings), registration opened Mar 11, 2026 ✓

### Acoustic Guitar Private Lessons — COV-614379 (live #617301)
- **Dates:** Apr 12–Jun 21, Sun 2:00–2:30 PM, 8 sessions (no May 3/17 & Jun 7) ✓
- **Age:** 5 to <13 (ageMax=12) ✓
- **Cost:** $200 ✓
- **Status:** Full (waitlist open) ✓

### 604 Bhangra Dance (6-7 yrs) — COV-589473 (live #592395)
- **Dates:** Apr 12–Jun 28, Sun 9:15–10:15 AM, 11 sessions (no May 17) ✓
- **Status:** Full/Waitlist (0 openings, 1 on waitlist) ✓ (was Open — corrected)

### Active French Immersion — COV-589482 (live #592404)
- **Dates:** Apr 15–Jun 17, Wed 3:45–4:45 PM, 10 sessions ✓
- **Age:** 5 to <9 (ageMin=5, ageMax=8) ✓
- **Cost:** $160 ✓
- **Status:** Open (8 openings) ✓

### Activity Studio & Phonics — COV-589479 (live #592401)
- **Dates:** Apr 19–Jun 14, Sun 9:15–10:10 AM, 8 sessions (no May 17) ✓
- **Age:** 4 to <6 (ageMin=4, ageMax=5) ✓
- **Cost:** $84 ✓
- **Status:** Open (6 openings) ✓

---

## Programs Excluded

| Program | Reason |
|---------|--------|
| 604 Bhangra - Advanced/Intermediate/Fusion with Sandip (16 yrs+) | Adult programs — appear in youth search due to age overlap |
| Activities Spectacular Birthday Party (×3 visible slots) | Birthday party venue rental — excluded per policy |

---

## Notes

- Virtual renderer: only A programs visible (~20 DOM items). B–Z programs need follow-up pass.
- 604 Bhangra Dance series: 4 age-segmented classes (Preschool 4.5–6, 6–7, 8–9.5, 9.5+) all Full — popular program at Sunset CC.
- Guitar private lessons: 6 time slots (30 min each, Sun 2:00–5:00 PM), 5 of 6 missing from DB. All taught by Artemis Cheung. No session May 3, May 17 & Jun 7.
- Active French Immersion: bilingual program by ILLUMA Studio.
- Dual-ID pattern confirmed: display IDs differ from URL IDs (e.g., live #617301 = URL/DB ID 614379).
