# Incorrect Removal Investigation — 2026-03-31

**Task:** Investigate all commits in git history for programs with Full/Waitlist/Full-Waitlist/Completed
enrollmentStatus that were deleted instead of having their status updated.

**Analyst:** Claude Code
**Result:** No incorrectly removed programs found. No restore action required.

---

## Investigation Method

1. Enumerated all commits that modified `src/data/programs.json`
2. Identified commits that removed program records (by counting deleted `"id"` lines in diffs)
3. For each removal commit, parsed removed program objects and checked their `status` and `enrollmentStatus` fields
4. Classified any Full/Waitlist removals as correct (out-of-scope) or incorrect (should have been kept with updated status)

---

## Commits Investigated

| Commit | Description | Programs Removed | Full/Waitlist Removed |
|--------|-------------|------------------|-----------------------|
| `deaff31` | Remove 5 programs: Camp Hatikvah + Modus Operandi | 5 | 0 |
| `1d6002a` | Address 8 Google Keep items | 10 | 2 (see below) |
| `b9f5dce` | Data quality overhaul | 3 (duplicates replaced) | 0 (status changes only) |
| `19137cd` | Remove 2 scraper artifacts | 2 | 0 |
| `3f5b40b` | Remove GHISS Maryland | 1 | 0 |
| `5ecd1cf` | Restore wrongly removed programs | Updates only | 0 (apparent deletions were updates) |
| `241801f` | Remove 2 Vancouver WA (USA) programs | 2 | 0 |
| `396b5ca` | Remove adult-only and cancelled programs | 49 | 0 |
| `ebea7df` | Verify prices, fix 259 adult-only | 284 | 0 |
| `3af3c01` | Fix circle bugs + remove daycares | 11 | 11 (see below) |
| `7821324` | Rebuild program indicators | 978 | 0 |
| `443eff4` | Rebuild Arts Umbrella | 1,919 | 0 |
| `806993d` | Rebuild Richmond programs | 937 | 0 |
| `9b8aa95` | Replace templated CoV with ActiveNet | 780 | 0 |
| Other small commits | Various fixes | Various | 0 |

---

## Programs with Full/Waitlist Status That Were Removed

### Group 1 — `1d6002a`: 2 out-of-scope programs

**COV-598953** — "3 Corners - Pizza Lunch - Jan - Apr 2026"
- `status: "Full"`, `enrollmentStatus: "Open"`
- Provider: City of Vancouver - N/A
- **Verdict: Correctly removed.** This is a pizza lunch fundraiser for a preschool (17 lunch sessions, Jan–Apr 2026). It is not an activity program, camp, or lesson. Removal was appropriate — not a Skeddo-scope program.

**PC-122234** — "WIlson Advisory Board Breakgast" *(sic)*
- `status: "Waitlist"`, `enrollmentStatus: "Likely Coming Soon"`
- Provider: City of Port Coquitlam
- **Verdict: Correctly removed.** This is a one-day advisory board breakfast meeting (Thu, 7–9 AM). Not a youth activity program — a staff/governance event. Name contains a typo ("Breakgast"). Removal was appropriate.

### Group 2 — `3af3c01`: 11 daycare/childcare programs

The commit message explicitly states "remove daycares." All 11 removed programs are licensed childcare facilities/waitlists:
- VSOCC Quayside Childcare (`enrollmentStatus: "Waitlist"`)
- VSOCC Library Square Childcare (`enrollmentStatus: "Waitlist"`)
- VSOCC Olympic Village Childcare (`enrollmentStatus: "Waitlist"`)
- YMCA Child Care — Robert Lee (`enrollmentStatus: "Waitlist"`)
- YMCA Kids at Heather (`enrollmentStatus: "Waitlist"`)
- YMCA Child Care — Marpole (`enrollmentStatus: "Waitlist"`)
- Kids & Company — Vancouver West (`enrollmentStatus: "Waitlist"`)
- Kids & Company — Cambie (`enrollmentStatus: "Waitlist"`)
- Kitsilano Neighbourhood House Childcare (`enrollmentStatus: "Waitlist"`)
- Collingwood Neighbourhood House Child Care (`enrollmentStatus: "Waitlist"`)
- Frog Hollow Neighbourhood House Daycare (`enrollmentStatus: "Full/Waitlist"`)
- Kiwassa Neighbourhood House Childcare (`enrollmentStatus: "Waitlist"`)
- Marpole Neighbourhood House Child Care (`enrollmentStatus: "Waitlist"`)
- South Vancouver NH Out-of-School Care (`enrollmentStatus: "Waitlist"`)

**Verdict: Correctly removed.** These are licensed childcare centres and daycare programs — not activity camps or lessons. Skeddo's scope is extracurricular programs (camps, lessons, activities), not full-time childcare. The Waitlist status reflects childcare waitlists (typically year-long enrollment queues), not activity registration. Removal was appropriate.

### Note on `5ecd1cf` — apparent false positives

The parser initially flagged 6 West Vancouver "Swim: Sessional Private" programs (WV-214109, WV-214110, WV-214169, WV-214171, WV-214173, WV-214177) as removed in `5ecd1cf`. These are **false positives**: the diff showed the old version of these records (without `"repeating": "weekly"`) replaced by an updated version (with the field added). All 6 programs exist in the current `programs.json` at lines 243480–243739.

---

## Conclusion

**No programs require restoration.** Every program with Full/Waitlist status that was removed was either:

1. Clearly out-of-scope (pizza lunch fundraiser, board meeting breakfast, licensed daycare facilities)
2. An apparent removal that was actually a field update (WV swim programs still in database)

This confirms the finding in `docs/SPOT-CHECK-FINDINGS-2026-03-30.md` Issue 5: "No evidence of systemic incorrect removal."

The data quality rules in `docs/DATA-QUALITY-RULES.md` Rule 31 (added in `5ecd1cf`) now require triple-checking before any removal, which should prevent future issues.

---

## Recommendation

No data restore needed. The one process improvement to consider:

When removing programs for being out-of-scope, the commit message should explicitly state *why* they are out-of-scope (e.g., "remove daycare/childcare programs — not activity programs") so future investigators can quickly confirm intent without re-reading the full program data.
