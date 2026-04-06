# Verification Log — City of Vancouver - Killarney Pool

**Audited:** 2026-04-06
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=36&min_age=0&max_age=17&viewMode=list
**center_id:** 36
**Live page count:** 193 programs (ages 0–17, in-progress/future)
**DB count after audit:** 42 programs (33 before + 9 added)

---

## Summary

Live page shows 193 programs — all swimming. Killarney Pool is a pool-only facility with no non-swimming programs. DB had 33 before audit.

**Three existing Adult/Teen Swimmer records were prior-year placeholders** (confirmed2026=false, description="Based on prior year"): COV-616934, COV-617020, COV-616940. All three verified on live page — updated confirmed2026=true, season=Spring 2026, actual descriptions added. COV-616934 status corrected Full/Waitlist→Open (2 spaces remaining).

**Dual-ID pattern confirmed:** display ID − 2922 = URL ID. Example: #619181 (Adult and Teen Swimmer 1, Mon) → URL ID 616259 ✓

**Fee not shown in page text** for Adult/Teen Swimmer levels — set cost: null, costNote: "Fee not displayed on registration page."

---

## Programs Added This Audit (9)

### Parent and Tot 2/3 — Goldfish/Seahorse (2)
| ID | Day | Time | Dates | Sessions | Status |
|----|-----|------|-------|----------|--------|
| COV-616272 | Tue | 11:45 AM–12:15 PM | Mar 31–May 26, 2026 | 9 | Full/Waitlist (5 on waitlist) |
| COV-616844 | Sat | 10:15–10:45 AM | Apr 11–May 30, 2026 | 8 | Full |

Ages: 1–3 (Goldfish: 12–24 months; Seahorse: 24–36 months). Caregiver participation required. Swim diapers mandatory.

### Adult and Teen Swimmer 1 (5)
No previous swimming experience required. Covers entries, treading water, front/back floats, front crawl and back crawl (10–15m), interval training intro.

| ID | Day | Time | Dates | Sessions | Status |
|----|-----|------|-------|----------|--------|
| COV-616259 | Mon | 10:45–11:25 AM | Mar 30–May 25, 2026 | 7 (no class Apr 6, May 18) | Open |
| COV-616271 | Tue | 11:45 AM–12:25 PM | Mar 31–May 26, 2026 | 9 | Open |
| COV-616982 | Wed | 6:00–6:40 PM | Apr 1–May 27, 2026 | 9 | Full |
| COV-617004 | Thu | 8:00–8:40 PM | Apr 2–May 28, 2026 | 9 | Full |
| COV-616959 | Fri | 11:15–11:55 AM | Apr 10–May 29, 2026 | 8 | Open |

### Adult and Teen Swimmer 3 (2)
Prerequisite: front/back crawl 25m, breaststroke intro, comfortable in deep water. Covers advanced entries, eggbeater kick, breaststroke, 50–100m sets, 300m continuous swim.

| ID | Day | Time | Dates | Sessions | Status |
|----|-----|------|-------|----------|--------|
| COV-616938 | Fri | 11:15–11:55 AM | Apr 10–May 29, 2026 | 8 | Open |
| COV-616939 | Wed | 12:00–12:40 PM | Apr 1–May 27, 2026 | 9 | Open |

Note: Swimmer 1 Fri and Swimmer 3 Fri share the same time slot (11:15–11:55 AM) — different levels running in parallel lanes.

---

## Status Fixes (3)

| ID | Name | Fix |
|----|------|-----|
| COV-616934 | Adult and Teen Swimmer 2 (Thu) | confirmed2026 false→true, season Year-Round→Spring 2026, status Full/Waitlist→Open, description updated |
| COV-617020 | Adult and Teen Swimmer 2 (Sat) | confirmed2026 false→true, season Year-Round→Spring 2026, description updated |
| COV-616940 | Adult and Teen Swimmer 3 (Sun) | confirmed2026 false→true, season Year-Round→Spring 2026, description updated |

---

## R46 Notes

No R46 violations. Parent and Tot (1–3 = 2-year span), Adult/Teen Swimmer (13+, no upper bound so ageMax=null). All under threshold.

---

## Gap Analysis — Remaining 151 Programs Not Added

| Category | Est. Count | Reason Not Added |
|----------|-----------|-----------------|
| Preschool 1 - Octopus (additional slots) | ~19 | 2 already in DB; remaining slots differ only by time |
| Preschool 2 - Crab (additional slots) | ~? | 2 already in DB |
| Preschool 3 - Orca (additional slots) | ~? | 3 already in DB |
| Swimmer 1–5 (additional slots) | ~70 | Multiple slots already in DB per level |
| Private or Semi-Private Lesson | ~51 | 4 already in DB; all 55 live slots are Full |
| Adult and Teen Swimmer 2 (additional slots) | 0 | Both slots now in DB |
| Parent and Tot 1 (if exists) | 0 | Not found in search (may not be offered) |

**Recommendation:** Run a dedicated swim-slot follow-up audit if completeness is needed. All program types are now represented in DB. The gap is individual time-slot instances of the same levels.

---

## Notes

- All programs: 50% Leisure Access discount available
- All programs operated by City of Vancouver Park Board — "PB Employee - Category" instructors
- Registration opened Mar 17, 2026 for all spring sessions
- Killarney Pool is pool-only (no non-swimming programs at center_id=36)
