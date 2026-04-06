# Verification Log — City of Vancouver - Kerrisdale Cmty Centre

**Audited:** 2026-04-05
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=33&min_age=0&max_age=17&viewMode=list
**Live page count:** 573 programs (ages 0–17, in-progress/future)
**DB count after audit:** 698 programs

---

## Summary

Live page shows 573 programs. Database has 698 programs:
- Open: 574 | Full/Waitlist: 64 | Completed: 44 | Coming Soon: 16

The DB count exceeds the live count due to 44 Completed programs (excluded by the live page's "In Progress/Future" filter), some Coming Soon programs not yet visible, and numeric-ID programs from a prior import that overlap with COV- programs by name+date.

**Virtual renderer limitation:** ActiveNet shows only ~20 DOM items at a time. Scrolling did not expand the list further. Only A-series programs were visible. The API endpoint (`/vancouver/rest/activities/list`) does not honour the `center_ids` session filter from JavaScript context and returns all-Vancouver results. As a result, only the first ~20 visible programs were fully cross-referenced; remaining programs were spot-checked via direct detail page navigation.

**Dual-ID pattern confirmed:** Navigating to `/detail/602253` (DB ID for "ABC's and 123's") renders the same program as live page ID #605175. Both IDs are valid references to the same program. No data changes needed — the DB IDs remain correct.

---

## Fixes Applied This Audit

| ID | Field | Old | New | Reason |
|----|-------|-----|-----|--------|
| COV-602586 | enrollmentStatus | Completed | Cancelled | Detail page: "This activity has been cancelled" (Jul 27–31 Act, Dance, Sing FUN! Camp) |
| COV-603432 | cost | null | $22.50 | Drop-in fee: $22.50 (7–13 yrs), $25 (14+) — from description on detail page |
| COV-603433 | cost | null | $22.50 | Same ongoing Axe Capoeira Family class (May session) |
| COV-603435 | cost | null | $22.50 | Same ongoing Axe Capoeira Family class (Jun session) |
| COV-602586 | ageSpanJustified | — | Added | R46 suppression: provider uses single 5–14 bracket |

---

## Spot-Checks (field-by-field verification)

### ABC's and 123's — COV-602253 (live #605175)
- **Name:** ABC's and 123's ✓
- **Dates:** Apr 12–Jun 14, 2026 ✓
- **Time:** Sun 9:15–10:00 AM ✓
- **Age:** 3 to <6 → ageMax=5 ✓
- **Cost:** $190 ✓
- **Status:** Open (2 openings) ✓
- **Note:** DB ID 602253 and live ID #605175 refer to the same program (confirmed by navigating to /detail/602253)

### Act, Dance, Sing FUN! Camp Jul 20–24 — COV-602584 (live #605506)
- **Cost:** $276.25 ✓
- **Status:** Open (12 openings, registration opens Apr 8, 2026 7:00 PM) ✓
- **Note:** Live list extraction showed "Cancelled" due to text misalignment in virtual renderer — detail page confirmed Open

### Act, Dance, Sing FUN! Camp Jul 27–31 — COV-602586 (live #605508)
- **Status:** CANCELLED — confirmed "This activity has been cancelled" on detail page ✓ (fixed)
- **Was:** Completed (incorrect — future date, and now cancelled not completed)

### Act, Dance, Sing FUN! Camp Aug 31–Sep 4 — COV-617810 (live #620732)
- **Cost:** $255 ✓
- **Status:** Open (12 openings) ✓
- **Note:** Live list extraction showed "Cancelled" due to text misalignment — detail page confirmed Open

### Week 1 Summer Safaris Daycamp Jrs 6–8yrs — COV-604596 (live #607518)
- **Dates:** Jun 29–Jul 3, 2026 ✓
- **Cost:** $140 ✓
- **Status:** Open (40 openings) ✓

### Axe Capoeira Family (Apr) — COV-603432 (live #606354)
- **Dates:** Apr 13–27, 2026, Mon 6:15–7:15 PM ✓
- **Cost:** Drop-in $22.50 (7–13 yrs) / $25 (14+) — null → $22.50 (fixed) ✓
- **Status:** Open (16 openings) ✓

---

## Notes

- Text-extraction misalignment: The virtual renderer sometimes renders items with varying line counts (e.g., multi-day schedules add an extra line). This causes the status field offset to pick up the wrong text. All status findings from list-extraction were individually verified via detail page navigation.
- 45 remaining null-cost programs not addressed this audit (CPR/First Aid, private training, Little League, etc.) — will be addressed in subsequent passes.
- Numeric ID programs (1585–1600 range) from prior import overlap Kerrisdale Summer Safaris and Active Dance Camp programs by name+date. Per Rule 30 these are treated as distinct listings since IDs differ; data appears correct in both.
- Birthday Party records (13 deleted on 2026-04-05 in platform-wide cleanup) are no longer in the DB.
