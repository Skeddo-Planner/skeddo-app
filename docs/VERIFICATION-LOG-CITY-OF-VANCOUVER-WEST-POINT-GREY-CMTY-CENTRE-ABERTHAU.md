# Verification Log — City of Vancouver - West Point Grey Cmty Centre - Aberthau

**Date audited:** 2026-04-05
**Auditor:** Claude (claude-sonnet-4-6)
**Registration page URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search
**Facility address:** 4397 West 2nd Avenue, Vancouver, BC (West Point Grey)

---

## Session Notes

The Playwright MCP browser (Chromium) failed to launch this session due to a `spawn UNKNOWN` error on Windows. Audit was conducted using:

1. **wpg_all.json** — 760 adult program records from the ActiveNet API (collected April 5, 2026)
2. **wpg_new_programs.json** — 146 youth/family program records from the ActiveNet API (collected April 5, 2026)
3. **Screenshots** from an earlier browser session on April 5, 2026 directly verifying 4 program detail pages:
   - `wpg_discoveries_588892.png` — Discoveries Adventure Day Camp - Week 1
   - `wpg_summer_smiles_592484.png` — WPG Preschool Summer Smiles Camp - Week 1
   - `wpg_tennis_591306.png` — Summer Smash Tennis: Junior Fundamentals+Aces Camp - Week 1
   - `wpg_tennis_youth_591337.png` — Summer Smash Tennis: Youth Fundamentals + Aces Camp - Week 1

---

## Programs Verified via Screenshots

### COV-588892 — Discoveries Adventure Day Camp - Week 1
- **Dates:** Jun 29 – Jul 3, 2026 ✅
- **Days:** Mon, Tue, Thu, Fri ✅
- **Times:** 10:00 AM – 3:00 PM ✅
- **Age:** At least 5 and less than 13 ✅
- **Openings:** 30 remaining
- **Registration opens:** Apr 8, 2026 at 7:00 PM — confirmed "Coming Soon" ✅

### COV-592484 — WPG Preschool Summer Smiles Camp - Week 1
- **Dates:** Jun 29 – Jul 3, 2026 ✅
- **Days:** Mon, Tue, Thu, Fri ✅
- **Times:** 9:00 AM – Noon ✅
- **Age:** At least 3 and less than 6 ✅
- **Openings:** 20 remaining
- **Registration opens:** Apr 8, 2026 at 7:00 PM — confirmed "Coming Soon" ✅

### COV-591306 — Summer Smash Tennis: Junior Fundamentals+Aces Camp - Week 1
- **Dates:** Jun 29 – Jul 3, 2026 ✅
- **Days:** Mon, Tue, Thu, Fri ✅
- **Times:** 10:00 AM – Noon ✅
- **Age:** At least 5.5 and less than 8 ✅
- **Openings:** 12 remaining
- **Registration opens:** Apr 8, 2026 at 7:00 PM — confirmed "Coming Soon" ✅

### COV-591337 — Summer Smash Tennis: Youth Fundamentals + Aces Camp - Week 1
- **Dates:** Jun 29 – Jul 3, 2026 ✅
- **Days:** Mon, Tue, Thu, Fri ✅
- **Age:** Youth (8–13 yrs) ✅
- **Openings:** 12 remaining
- **Registration opens:** Apr 8, 2026 at 7:00 PM — confirmed "Coming Soon" ✅

---

## API Cross-Reference (wpg_new_programs.json — 146 programs)

143 of 146 were already in the database. The 3 not in DB:

| ID | Name | Ages | Decision |
|----|------|------|----------|
| 609925 | Salt Spring Saturday Market | 50+ | Not added — senior excursion, not a children's program |
| 610818 | The Spring Doubles Pickleball Workshop (3.25+) | 16+ | Not added — adult program |
| 586768 | Family Pickleball Workshop | 10+ | Not added — status: **Cancelled** |

**Price cross-reference:** Zero discrepancies between DB costs and API `search_from_price` values.
**Date cross-reference:** Zero discrepancies.
**Days cross-reference:** All match (API omits spaces after commas; functionally identical).

---

## Discrepancy Fixed

### COV-585245 — Zumba® Kids Jr. (3-6 yrs)
- **Before:** `enrollmentStatus: "Coming Soon"`, `registrationDate: "2026-04-08"`, `costNote: "Enrollment opens April 8, 2026 at 7:00 PM; fee not yet listed"`
- **Issue:** API shows `urgent_message.status_description: "Full"`, `openings: "0"`. Program has been running since January 25, 2026 — registration long since opened and filled.
- **Fix:** Updated `enrollmentStatus` to `"Full/Waitlist"`, corrected `costNote`, removed invalid `registrationDate`/`registrationDateLabel`.

---

## Count Summary

| | Count |
|--|--|
| Programs in DB before audit | 207 |
| Programs added | 0 |
| Programs fixed | 1 (COV-585245 status) |
| Programs set to Completed | 0 |
| Programs in DB after audit | 207 |

---

## Limitations

- Playwright browser unavailable; individual price detail pages not verified for most programs
- Programs with `cost: null` / `priceVerified: false` not individually price-verified this session
- API data does not expose fee amounts for most programs (requires browser navigation to fee details page)
