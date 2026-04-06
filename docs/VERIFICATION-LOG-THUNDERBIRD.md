# Verification Log — City of Vancouver - Thunderbird Cmty Centre

**Audited:** 2026-04-05
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=58&min_age=0&max_age=17&viewMode=list
**Live page count:** 337 programs (ages 0–17, in-progress/future)
**DB count after audit:** 68 programs

---

## Summary

Live page shows 337 programs. DB has 68 programs. The gap is largely birthday party time slots (excluded per policy) which appear heavily in the Thunderbird list. The first 20 alphabetical programs visible confirm that most non-birthday programs are already in the DB, with a few missing or status-incorrect entries fixed in this audit.

**Key structural finding:** All 36 numeric ID programs (1823–1858) from a prior import had incorrect `enrollmentStatus` values (Open or Full/Waitlist) despite having `registrationDate: 2026-04-08` — registration hasn't opened yet. All 36 corrected to "Coming Soon".

**Dual-ID note:** The search list display IDs (e.g. #600778) differ from the URL IDs (e.g. 597856) used in `/detail/` links. URL IDs match the COV- IDs in our DB.

---

## Fixes Applied This Audit

| ID | Field | Old | New | Reason |
|----|-------|-----|-----|--------|
| COV-597852 | enrollmentStatus | Completed | Cancelled | Detail page: "This activity has been cancelled" (A Ballet Time with Strength and Stretch, Apr 7–Jun 9) |
| 1823–1828 | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08; registration not yet open |
| 1829–1838 | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08; Sunrays confirmed 22 openings (detail page) |
| 1839 | enrollmentStatus | Open | Coming Soon | registrationDate=2026-04-08; registration not yet open |
| 1840–1858 | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08; Basketball Camp confirmed 12 openings; Active Dance confirmed 12 openings |
| 1847 | ageSpanJustified | — | Added | R46 suppression: provider uses single 6–14 bracket |
| COV-597852 | ageSpanJustified | — | Added | R46 suppression: provider uses single 6–13 bracket |
| **New** COV-597856 | — | — | Added | Active Jazz Funk and Pop Dance & KPOP Sampler — missing from DB |

---

## Programs Added This Audit (1)

| ID | Name | Dates | Time | Ages | Cost | Status |
|----|------|-------|------|------|------|--------|
| COV-597856 | Active Jazz Funk and Pop Dance & KPOP Sampler | Apr 7–Jun 9, 2026 | Tue 4:45–5:45 PM | 6–12 | $100 | Open (9 openings) |

---

## Spot-Checks (field-by-field verification)

### A Ballet Time with Strength and Stretch — COV-597852 (live #600774)
- **Status:** CANCELLED — "This activity has been cancelled" ✓ (was Completed — wrong for future start date)

### Sunrays Day Camp Week 1 — ID 1830 (live #600809)
- **Status:** 22 openings remaining, enrollment opens Apr 8, 2026 7:00 PM → Coming Soon ✓ (was Full/Waitlist)
- **Dates:** Jun 29–Jul 3, 2026 ✓

### Active Dance Sing/Jazz Funk/Hip Hop/KPOP Camp — ID 1847 / COV-604985 (live #607907)
- **Cost:** $135 ✓
- **Status:** 12 openings, enrollment opens Apr 8 → Coming Soon ✓ (was Full/Waitlist)

### Basketball Camp — ID 1843 / COV-613179 (live #616101)
- **Cost:** $125 ✓
- **Status:** 12 openings, enrollment opens Apr 8 → Coming Soon ✓ (was Full/Waitlist)

### Active Jazz Funk and Pop Dance & KPOP Sampler — COV-597856 (live #600778)
- **Dates:** Apr 7–Jun 9, 2026 ✓
- **Time:** Tue 4:45–5:45 PM ✓
- **Age:** 6 to <13 (ageMax=12) ✓
- **Cost:** $100 (registration), drop-in $10 ✓
- **Status:** Open (9 openings) ✓

---

## Notes

- Birthday party time slots appear in the Thunderbird live list (e.g. "Birthday Party - Gymnasium - Sat, Apr 11") — these are excluded per policy and not added to DB.
- Live page shows 337 programs but many are birthday party slots. After excluding those, the gap with our 68 programs is significantly smaller.
- 337 live programs were not fully enumerable due to virtual renderer (20 DOM items at a time). A–B section was fully reviewed; C–Z programs need a follow-up pass.
- Active Jazz Funk, Hip Pop & KPOP Dance Sampler - Family (COV-597854, live #600776) was CANCELLED — not added.
- Art Jam with a Disney Animator - Set 1 (COV-608914, live #611836) was CANCELLED — not added.
- Sunseekers Day Camp Weeks 2–8 are absent from DB (only Week 1 = ID 1838 is present) — needs follow-up audit.
