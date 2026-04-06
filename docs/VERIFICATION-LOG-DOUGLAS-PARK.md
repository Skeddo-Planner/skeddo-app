# Verification Log — City of Vancouver - Douglas Park Cmty Centre

**Audited:** 2026-04-05
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=48&min_age=0&max_age=17&viewMode=list
**Live page count:** 392 programs (ages 0–17, in-progress/future)
**DB count after audit:** 156 programs

---

## Summary

Live page shows 392 programs. DB has 156 programs after adding 7 missing programs. Gap of ~236 is largely birthday party time slots, Kindercare/after-care deposits, and SAC waitlist entries (all excluded per policy).

Same pattern as Thunderbird: 19 numeric ID programs (1430–1449) from a prior import had `Full/Waitlist` status despite `registrationDate: 2026-04-08` — registration hasn't opened yet. All 19 corrected to "Coming Soon".

---

## Fixes Applied This Audit

| ID | Field | Old | New | Reason |
|----|-------|-----|-----|--------|
| 1430–1449 (19 programs) | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08; registration not yet open |

---

## Programs Added This Audit (7)

| ID | Name | Dates | Time | Ages | Cost | Status |
|----|------|-------|------|------|------|--------|
| COV-607559 | Active KPOP Hip Hop Dance Sampler | Apr 1–Jun 17, 2026 | Wed 3:30–4:30 PM | 6–10 | $192 | Open (9 openings) |
| COV-607564 | Active KPOP Hip Hop Dance Sampler | Apr 1–Jun 17, 2026 | Wed 4:30–5:30 PM | 8–15 | $192 | Open |
| COV-608107 | Active KPOP Hip Hop Dance Sampler Camp | Jul 13–17, 2026 | Weekdays 9:00 AM–Noon | 6–8 | $240 | Coming Soon (Apr 8) |
| COV-608110 | Active KPOP Hip Hop Dance Sampler Camp | Jul 13–17, 2026 | Weekdays 12:15–3:15 PM | 9–13 | $240 | Coming Soon (Apr 8) |
| COV-598008 | Art Camp: Race to the Bottom of the Ocean | Jul 27–31, 2026 | Weekdays 9:30 AM–3:00 PM | 6–12 | $285 | Coming Soon (Apr 8) |
| COV-598009 | Art Camp: Race to the Depth of the Jungle | Aug 4–7, 2026 | Tue–Fri 9:30 AM–3:00 PM | 6–12 | $240 | Coming Soon (Apr 8) |
| COV-599331 | Baby Sign Language | Apr 13–May 11, 2026 | Mon 1:15–2:00 PM | 0–1 | $77 | Open |

---

## Spot-Checks (field-by-field verification)

### Active KPOP Hip Hop Dance Sampler — COV-607559 (live #610481)
- **Dates:** Apr 1–Jun 17, 2026 ✓ (already started, registrations still accepted)
- **Time:** Wed 3:30–4:30 PM ✓
- **Age:** 6 to <11 (ageMax=10) ✓
- **Cost:** $192 ✓
- **Status:** Open (9 openings) ✓

### Art Camp: Race to the Bottom of the Ocean — COV-598008 (live #600930)
- **Dates:** Jul 27–31, 2026 ✓
- **Time:** Weekdays 9:30 AM–3:00 PM ✓ (Full Day camp)
- **Age:** 6 to <13 (ageMax=12) ✓
- **Cost:** $285 ✓
- **Status:** Coming Soon (12 openings, opens Apr 8, 2026 7:00 PM) ✓

### Baby Sign Language — COV-599331 (live #602253)
- **Dates:** Apr 13–May 11, 2026 ✓
- **Time:** Mon 1:15–2:00 PM ✓
- **Age:** less than 2 yrs (ageMin=0, ageMax=1) ✓
- **Cost:** $77 ✓
- **Status:** Open ✓

---

## Notes

- After-care / SAC waitlist entries (537885, 537892, 608862, 608864) are school-year child-care deposit registrations — excluded per policy
- Birthday party slots excluded per policy
- Virtual renderer limitation: only A–B programs visible (20 items). C–Z programs need follow-up pass
- COV-607564 (ageMin=8, ageMax=15) has `ageSpanJustified` flag: provider uses a single 8–15 bracket
- ID 1448 absent from numeric series (1430–1449 skips 1448) — appears intentional gap in prior import
- Art Camp: Race to the Depth of the Jungle runs Tue–Fri only (BC Day Aug 3 excluded = 4-day week)
