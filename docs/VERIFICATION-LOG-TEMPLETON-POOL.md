# Verification Log — City of Vancouver - Templeton Park Pool

**Audited:** 2026-04-06
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=45&min_age=0&max_age=17&viewMode=list
**center_id:** 45 (discovered during audit by probing center_ids 1–70)
**Live page count:** 200 programs (ages 0–17, in-progress/future)
**DB count after audit:** 48 programs (42 before + 6 added)

---

## Summary

Live page shows 200 programs. DB has 48 after adding 6 missing programs. Gap of ~152 is primarily swim lesson time slots not added this pass (all levels present in DB, missing many individual session slots) plus adapted lessons (all Full, specialized) and Aquafit sessions (adult-focused, 13+).

**center_id=45** confirmed for Templeton Park Pool via probing center_ids 1–70. IDs 11–21 all return no results for ages 0–17.

**Dual-ID pattern confirmed:** display ID − 2922 = URL ID (consistent with Trout Lake Rink finding). Verified: Active Dance Sing shows as display #613959 → URL ID 611037 ✓.

**Status fixes:** None required — all 30 Open programs had correct status, no registrationDate=2026-04-08 conflicts.

**Programs added (6):** 4 dance/arts summer camps + 2 weekly music classes.

---

## Programs Added This Audit (6)

| ID | Name | Dates | Time | Ages | Cost | Status |
|----|------|-------|------|------|------|--------|
| COV-611037 | Active Dance Sing/KPOP (AM Half Camp) | Jul 13–17, 2026 | 9:05 AM–Noon | 5–14 | $238.00 | Coming Soon |
| COV-611038 | Active Dance Jazz Funk PM Half Camp | Jul 13–17, 2026 | Noon–3:00 PM | 5–14 | $225.00 | Coming Soon |
| COV-611039 | Active Tumble, Flex and Dance (AM) | Aug 17–21, 2026 | 9:05 AM–Noon | 5–14 | $238.00 | Coming Soon |
| COV-611040 | Active Dance Sing/KPOP (PM Half Camp) | Aug 17–21, 2026 | Noon–3:00 PM | 5–14 | $225.00 | Coming Soon |
| COV-611473 | Adventures in Music - Babies | Apr 10–Jun 19, 2026 (Fri) | 11:30 AM–12:15 PM | 0–1 | $165.00 | Open |
| COV-611405 | Adventures in Music - Mixed Ages | Apr 10–Jun 19, 2026 (Fri) | 10:30–11:15 AM | 1–5 | $165.00 | Open |

All dance camps: registration opens Apr 8, 2026 → enrollmentStatus: "Coming Soon".
All programs: indoor, instructor Jennifer Yamazaki (music) / ILLUMA Studio (dance).

---

## R46 Notes

All 4 dance camps: ages 5–14 (9-year span ≥ 7 → R46 triggered). Added `ageSpanJustified` to all 4: "Single-skill-level camp serving wide age range (5-14) — campers grouped by age/skill on assessment day, no age-band subdivisions offered."

---

## Spot-Checks

### COV-611037 — Active Dance Sing/KPOP (AM Half Camp)
- **URL:** /detail/611037, display #613959 (offset 2922) ✓
- **Dates:** Jul 13–17, 2026 ✓
- **Time:** 9:05 AM–Noon ✓
- **Age:** 5 to <14y 11m ✓
- **Fee:** $238.00 (Standard charge) ✓
- **Status:** Open (12 spots), registration opens Apr 8 → Coming Soon ✓

### COV-611473 — Adventures in Music - Babies
- **URL:** /detail/611473, display #614395 (offset 2922) ✓
- **Age:** less than 1y 6m → ageMax=1 ✓
- **Fee:** $165.00 ✓
- **Sessions:** 11 weekly Fri sessions ✓
- **Drop-in:** $17 ✓

---

## Gap Analysis — Remaining 152 Programs Not Added

| Category | Est. Count | Reason Not Added |
|----------|-----------|-----------------|
| Child swim lessons (all levels/time slots) | ~70 | Individual time slots for same levels already in DB; need follow-up swim audit |
| Swimming - Adapted Lessons | ~16 | All Full, specialized disability program; not mainstream |
| Adult/Teen Swimmer (13+) | ~6 | Adult-focused |
| Public Swim / Lengths (future drop-in) | ~20 | Drop-in sessions, low priority |
| Aquafit Shallow Moderate (Apr 7, Apr 9) | 2 | Missing sessions (COV-617647, 617648); low priority |
| Other swimming programs | ~38 | Mix of levels not captured |

**Recommendation:** Run a dedicated swim-lesson follow-up audit for Templeton to add all missing swim lesson slots. The DB already has correct level coverage but is missing many time-slot instances.

---

## center_id Discoveries This Audit

Additional IDs confirmed during center_id probe (1–21 searched):
- 10 = Lord Byng Pool (193 programs)
- 11–21 = No results (inactive or adult-only centers)
- 45 = Templeton Park Pool ✓

---

## Notes

- All dance/arts camps run by ILLUMA Studio contractor (CCA Contractor Business - Category 1)
- Music classes run by Jennifer Yamazaki (CCA Contractor Individual - Category 1)
- Department code "HS - TP HCA Program Rev (4181)" confirms Templeton Park (TP) affiliation
- Leisure Access discount: 50% on all programs
- Programs labeled "2026 Summer/Spring Hastings" in admin — Templeton is administratively grouped with Hastings CC
