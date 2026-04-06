# Verification Log — City of Vancouver - Roundhouse Cmty Arts and Rec Centre

**Audited:** 2026-04-05
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=42&min_age=0&max_age=17&viewMode=list
**Live page count:** 488 programs (ages 0–17, in-progress/future)
**DB count after audit:** 177 programs

---

## Summary

Live page shows 488 programs. DB has 177 programs after adding 6 missing programs and fixing 56 status errors. The gap of ~311 is largely birthday party slots, adult-only programs, and programs in the C–Z alphabetical range not yet enumerated due to virtual renderer limitation (only A–B visible).

**Systemic status fix:** All 56 numeric ID programs (1742–1802) had `Full/Waitlist` status despite `registrationDate: 2026-04-08` — registration hadn't opened yet. All 56 corrected to "Coming Soon".

**R46 fix:** IDs 1767–1769 (Young-Commander Chess CAMP) had age span 5–13 without justification. Added `ageSpanJustified` field — provider uses a single Novice/Starter bracket across that range.

---

## Fixes Applied This Audit

| ID | Field | Old | New | Reason |
|----|-------|-----|-----|--------|
| 1742–1802 (56 programs) | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08; registration not yet open |
| 1767–1769 (3 programs) | ageSpanJustified | — | Added | R46 suppression: Young Commander Chess uses single 5–13 bracket |

---

## Programs Added This Audit (6)

| ID | Name | Dates | Time | Ages | Cost | Status |
|----|------|-------|------|------|------|--------|
| COV-606248 | Architecture Around the World Camp with Petit Architect | Aug 4–7, 2026 | Tue–Fri 9:15 AM–3:00 PM | 7–12 | $375 | Coming Soon (Apr 8) |
| COV-607770 | Ballet camp | Jul 6–10, 2026 | Mon–Fri 2:30–3:30 PM | 5–8 | $125 | Coming Soon (Apr 8) |
| COV-605107 | Ballet I | Apr 8–May 13, 2026 | Wed 2:15–3:00 PM | 3–4 | $115 | Full/Waitlist |
| COV-605108 | Ballet I | May 20–Jun 24, 2026 | Wed 2:15–3:00 PM | 3–4 | $115 | Open (6 openings) |
| COV-607779 | Ballet I | Jul 8–Aug 19, 2026 | Wed 3:45–4:30 PM | 3–4 | $130 | Open (8 openings) |
| COV-605421 | Bollywood Dance Kids | Apr 9–May 14, 2026 | Thu 5:15–6:00 PM | 5–13 | $108 | Open (8 openings) |

---

## Spot-Checks (field-by-field verification)

### Architecture Around the World Camp with Petit Architect — COV-606248 (live #609170)
- **Dates:** Aug 4–7, 2026 (Tue–Fri) ✓
- **Time:** 9:15 AM–3:00 PM ✓
- **Age:** 7 to <12y 11m (ageMax=12) ✓
- **Cost:** $375 (via fee details modal) ✓
- **Status:** Coming Soon (12 openings, opens Apr 8, 2026 7:00 PM) ✓

### Ballet I — COV-605107 (live #608029)
- **Dates:** Apr 8–May 13, 2026 (Wed) ✓
- **Time:** 2:15–3:00 PM ✓
- **Age:** 3 to <4y 11m (ageMax=4) ✓
- **Cost:** $115 ✓
- **Status:** Full (0 openings, waitlist open) ✓

### Ballet I — COV-607779 (live #610701)
- **Dates:** Jul 8–Aug 19, 2026 (Wed) ✓
- **Time:** 3:45–4:30 PM ✓
- **Cost:** $130 ✓
- **Status:** Open (8 openings) ✓

### Bollywood Dance Kids — COV-605421 (live #608343)
- **Dates:** Apr 9–May 14, 2026 (Thu) ✓
- **Time:** 5:15–6:00 PM ✓
- **Age:** 5 to <13y 11m (ageMax=13) ✓
- **Cost:** $108 ✓
- **Status:** Open (8 openings) ✓

---

## Notes

- Virtual renderer limitation: only A–B programs visible (~20 items). C–Z programs need follow-up pass.
- Dual-ID pattern confirmed: display IDs (e.g. #609170) differ from URL IDs (e.g. 606248). URL IDs match COV- DB IDs.
- 488 live programs include birthday party slots and adult-only programs — both excluded per policy.
- Ballet camp (COV-607770) and Ballet I sessions are taught by same instructor (Maria Do Espirito Santo Mauricio) with drop-in $20 available.
- Bollywood Dance Kids by SHIAMAK — largest dance academy in the world; drop-in $20.
- Afterschool MULTI REC/ARTS Club APR/MAY/JUN (COV-608269/270/271) already in DB and Open ✓
- Amusement Parks Camp (COV-606009) already in DB and Open ✓
