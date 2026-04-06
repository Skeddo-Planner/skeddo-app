# Verification Log — City of Vancouver - Renfrew Park Cmty Centre

**Audited:** 2026-04-05
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=46&min_age=0&max_age=17&viewMode=list
**Live page count:** 252 programs (ages 0–17, in-progress/future)
**DB count after audit:** 94 programs

---

## Summary

Live page shows 252 programs. DB has 94 programs after fixing 2 status errors and adding 6 missing badminton programs. The gap of ~158 is largely programs in the C–Z alphabetical range not yet visible due to the virtual renderer limitation (only A–B visible per load).

**Status fixes:** ID 2505 (Kids Swim Lessons) and `renfrew-cc-camp-1` (Renfrew Summer Adventures Day Camp) both had `registrationDate: 2026-04-08` but `Full/Waitlist` status — corrected to "Coming Soon" since registration hadn't opened yet.

---

## Fixes Applied This Audit

| ID | Field | Old | New | Reason |
|----|-------|-----|-----|--------|
| 2505 | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08; registration not yet open |
| 2505 | ageSpanJustified | — | Added | R46 suppression: generic placeholder covers all ages 3–16 |
| renfrew-cc-camp-1 | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08; registration not yet open |

---

## Programs Added This Audit (6)

| ID | Name | Dates | Time | Ages | Cost | Status |
|----|------|-------|------|------|------|--------|
| COV-610679 | Ace Academy - Badminton Lessons - Beginner | Apr 7–May 12, 2026 | Tue 4:00–4:55 PM | 7–12 | $85 | Full/Waitlist |
| COV-610680 | Ace Academy - Badminton Lessons - Beginner | Apr 7–May 12, 2026 | Tue 5:00–5:55 PM | 7–12 | $85 | Full/Waitlist |
| COV-610682 | Ace Academy - Badminton Lessons - Beginner | Apr 12–May 17, 2026 | Sun 9:30–10:25 AM | 7–12 | $85 | Full/Waitlist |
| COV-610683 | Ace Academy - Badminton Lessons - Beginner | Apr 12–May 17, 2026 | Sun 10:30–11:25 AM | 7–12 | $85 | Full/Waitlist |
| COV-610685 | Ace Academy - Badminton Lessons - Beginner | May 19–Jun 23, 2026 | Tue 4:00–4:55 PM | 7–12 | $102 | Full/Waitlist |
| COV-610686 | Ace Academy - Badminton Lessons - Beginner | May 19–Jun 23, 2026 | Tue 5:00–5:55 PM | 7–12 | $102 | Full/Waitlist |

---

## Spot-Checks (field-by-field verification)

### Ace Academy - Badminton Lessons - Beginner — COV-610679 (live #613601)
- **Dates:** Apr 7–May 12, 2026 (Tue), 5 sessions ✓
- **Time:** 4:00–4:55 PM ✓
- **Age:** 7 to <13 (ageMax=12) ✓
- **Cost:** $85 ✓
- **Status:** Full/Waitlist (waitlist open) ✓
- **Exception:** No session Apr 28 ✓

### Ace Academy - Badminton Lessons - Beginner — COV-610685 (live #613607)
- **Dates:** May 19–Jun 23, 2026 (Tue), 6 sessions ✓
- **Cost:** $102 ✓ (6 sessions vs 5 sessions for Apr series)
- **Status:** Full/Waitlist ✓

### 1-Active Ballet Time with Strength and Stretch — COV-614405 (live #617327)
- **Ages:** 6 to <9 (ageMax=8) ✓ (matches DB)
- **Time:** Sun 2:00–3:00 PM ✓
- **Status:** Open (7 openings) ✓

### 1st Ballet Time — COV-614392 (live #617314)
- **Dates:** Apr 13–Jun 15, 2026 ✓
- **Time:** Mon 10:15–11:00 AM ✓
- **Status:** Open ✓

---

## Notes

- Virtual renderer limitation: only A–B programs visible (~20 items). C–Z programs need follow-up pass.
- All 6 Ace Academy Badminton Beginner sessions are Full/Waitlist — high demand for this program.
- Badminton cost difference: 5-session series = $85, 6-session series = $102.
- Instructor: Gabriel Ip (Ace Academy).
- Existing "1-Active", "1st", "123 ABCs", Falaise Day Camp, Renfrew Rangers, swimming, piano/guitar lessons all verified correct in DB.
- COV-514865/551711 (Renfrew Out of School Care) are after-school care deposits — retained per policy since they are youth programs (not birthday parties or venue rentals).
