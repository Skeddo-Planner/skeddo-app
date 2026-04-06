# Verification Log — City of Vancouver - Vancouver Aquatic Centre

**Audited:** 2026-04-06
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=2&min_age=0&max_age=17&viewMode=list
**center_id:** 2
**Live page count:** 175 programs (ages 0–17, in-progress/future)
**DB count before audit:** 46 programs (VAC-specific; excludes 19 Hillcrest Aquatic Centre)
**DB count after audit:** 46 programs (no additions; 1 fix)

---

## Summary

Vancouver Aquatic Centre is a pure aquatics facility. All programs are swimming-related:
swim lessons (Preschool, Parent & Tot, Swimmer levels, Adapted), private/semi-private lessons,
pool access (Length Swim, SwimFIT), and Aquafit.

**Summer 2026 swim lessons are not yet posted** as of April 6, 2026. Spring 2026 lessons
run April–June 2026. Summer lesson registration typically opens May–June.

**center_id=2 confirmed** for VAC (Hillcrest Aquatic Centre = center_id=59).

**Dual-ID formula confirmed:** display ID − 2922 = URL ID (e.g., Preschool #618416 → URL 615494 ✓)

---

## Fixes (1)

| Fix | Description |
|-----|-------------|
| Provider name normalization | 21 programs used em-dash variant "City of Vancouver — Vancouver Aquatic Centre" → standardized to "City of Vancouver - Vancouver Aquatic Centre" (hyphen, consistent with all other CoV centers) |

---

## Gap Analysis vs. Live Page

| Category | Live Count | DB Count | Gap | Action |
|----------|-----------|---------|-----|--------|
| Swimming - Adapted Lessons | ~12 | 0 | ~12 | All Full (spring); add when summer posted |
| Swimming - Parent & Tot | ~8 | 6 | ~2 | Spring slots, mostly Full |
| Swimming - Preschool 1–4 | ~25 | 3 | ~22 | Spring slots, mostly Full |
| Swimming - Swimmer 1–7 | ~25 | 1 | ~24 | Spring slots, mostly Full |
| Swimming - Private/Semi-Private | ~30 | 3 | ~27 | Spring slots |
| Length Swim (50m) | ~20 | 5 | ~15 | Ongoing facility access, not programs |
| SwimFIT | ~5 | 1 | ~4 | Ongoing fitness class (adults) |
| Aquafit | ~30 | 22 | ~8 | Adult-focused (ages 13+) |
| Public Swim / Family Swim | ~10 | 0 | ~10 | Drop-in access, not programs |
| Summer 2026 swim lessons | 0 | 0 | 0 | Not posted yet |

---

## Key Findings

### Spring 2026 swim lessons — status discrepancies
Many existing "Open" programs are now Full on the live page:
- COV-615494 (Swimming - Preschool 1 - Octopus, Mar 30–Jun 15) → live shows Full
- Likely other spring lesson programs are also Full now

These are low-priority: spring programs end June 2026, parents can check live availability.

### Summer 2026 programs
Summer 2026 swim lesson registration has not yet opened as of April 6, 2026.
Keyword searches for "summer" and "camp" returned 0 results.
**Action required:** Return to VAC when summer lessons post (likely May–June 2026).

### Provider name inconsistency fixed
21 programs used an em-dash ("—") in the provider name instead of a hyphen ("-"). Fixed
to "City of Vancouver - Vancouver Aquatic Centre" for consistency with all other CoV centers.

---

## Programs Not Added

| Category | Count | Reason |
|----------|-------|--------|
| Additional spring lesson time slots | ~100 | Spring term ending; most Full |
| Swimming - Adapted Lessons | ~12 | All Full (spring); add when summer posted |
| Length Swim / Public Swim slots | ~30 | Facility access tickets, not programs |
| Adult Aquafit | ~30 | Adult-focused (ages 13+) |

---

## Notes

- VAC has no summer day camps; it is a pure aquatics facility
- Summer 2026 swim lesson registration expected to open May–June 2026
- Re-audit recommended once summer lessons are posted
- center_id=2 confirmed for future reference
- Hillcrest Aquatic Centre (center_id=59) is a separate facility — 19 DB programs, audited separately
