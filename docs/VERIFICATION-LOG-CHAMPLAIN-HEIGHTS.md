# Verification Log — City of Vancouver - Champlain Heights Cmty Centre

**Audited:** 2026-04-05
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=57&min_age=0&max_age=17&viewMode=list
**Live page count:** 371 programs (ages 0–17, in-progress/future)
**DB count after audit:** ~108 programs (94 before + 14 added)

---

## Summary

Live page shows 371 programs. DB has ~108 programs after fixing 34 status errors and adding 14 missing programs. Gap of ~263 is largely B–Z alphabetical programs not yet visible due to virtual renderer limitation (only A programs visible per load).

**Systemic status fix:** 32 numeric programs (IDs 1394–1425) + champlain-cc-1 had `enrollmentStatus: 'Full/Waitlist'` but `registrationDate: 2026-04-08` — registration hadn't opened yet on audit date (2026-04-05). All corrected to "Coming Soon".

**Cancelled programs detected:** COV-605925 (Anime Cartoon Drawing Camp, Jul) and COV-605926 (Aug) were listed in search results as "Full" but detail pages confirmed cancellation as of Mar 30, 2026 — not added.

---

## Fixes Applied This Audit

| ID(s) | Field | Old | New | Reason |
|-------|-------|-----|-----|--------|
| 1394–1425 (32 programs) | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08; registration not yet open |
| champlain-cc-1 | enrollmentStatus | Full/Waitlist | Coming Soon | registrationDate=2026-04-08; registration not yet open |
| COV-607069 | enrollmentStatus | Open | Full/Waitlist | Live page: 0 openings, 4 on waitlist confirmed |

---

## Programs Added This Audit (14)

| ID | Name | Dates | Time | Ages | Cost | Status |
|----|------|-------|------|------|------|--------|
| COV-608521 | Acro Jazz I & II | Apr 12–Jun 21, 2026 | Sun 11:30 AM–12:10 PM | 8–12 | $100 | Open |
| COV-609576 | Adapted Family Open Gym | May 16, 2026 | Sat 9:30–10:30 AM | 5+ | Free | Coming Soon |
| COV-610736 | Adapted Family Open Gym | Jul 25–Aug 22, 2026 | Sat 11:45 AM–12:45 PM | 5+ | Free | Coming Soon |
| COV-608866 | Adventures at Avalon Pond | May 20, 2026 | Wed 4:30–5:45 PM | 7–10 | $20 | Coming Soon |
| COV-608867 | Adventures at Avalon Pond | May 27, 2026 | Wed 4:30–5:45 PM | 7–10 | $20 | Coming Soon |
| COV-608868 | Adventures at Avalon Pond | Jun 10, 2026 | Wed 4:30–5:45 PM | 7–10 | $20 | Coming Soon |
| COV-608869 | Adventures at Avalon Pond | Jun 17, 2026 | Wed 4:30–5:45 PM | 7–10 | $20 | Coming Soon |
| COV-608858 | Amphibian and Nature Walk | May 7, 2026 | Thu 6:00–7:30 PM | 4+ | Free | Coming Soon |
| COV-608859 | Amphibian and Nature Walk | Jun 11, 2026 | Thu 6:00–7:30 PM | 4+ | Free | Coming Soon |
| COV-608861 | Amphibian and Nature Walk | Jul 2, 2026 | Thu 6:00–7:30 PM | 4+ | Free | Coming Soon |
| COV-608852 | Amphibian Survey | Apr 16, 2026 | Thu 6:00–7:30 PM | 10+ | Free | Coming Soon |
| COV-608854 | Amphibian Survey | Apr 21, 2026 | Tue 6:00–7:30 PM | 10+ | Free | Coming Soon |
| COV-608855 | Amphibian Survey | May 19, 2026 | Tue 6:00–7:30 PM | 10+ | Free | Coming Soon |
| COV-608856 | Amphibian Survey | May 26, 2026 | Tue 6:00–7:30 PM | 10+ | Free | Coming Soon |

---

## Spot-Checks

### Acro Jazz I & II — COV-608521
- **Dates:** Apr 12–Jun 21, 2026 (Sun), no May 17 ✓
- **Time:** 11:30 AM–12:10 PM ✓
- **Age:** 8–12 ✓
- **Cost:** $100 ✓
- **Status:** Open ✓

### Art Adventurers — COV-607069 (status fix)
- **Status:** Full/Waitlist (0 openings, 4 on waitlist) ✓ (was Open — corrected)
- **Dates:** Apr 13–May 11, 2026, Mon 3:30–4:30 PM ✓

### Adventures at Avalon Pond — COV-608866
- **Date:** May 20, 2026 (Wed) ✓
- **Time:** 4:30–5:45 PM ✓
- **Location:** Everett Crowley Park (Avalon Pond) ✓
- **Age:** 7–10 ✓
- **Cost:** $20 ✓
- **Status:** Coming Soon (opens Apr 8, 2026) ✓

### Amphibian Survey — COV-608852
- **Date:** Apr 16, 2026 (Thu) ✓
- **Time:** 6:00–7:30 PM ✓
- **Location:** Kerr St Parking Lot, Everett Crowley Park ✓
- **Age:** 10+ ✓
- **Cost:** Free ✓
- **Status:** Coming Soon ✓

---

## Programs Excluded

| Program | Reason |
|---------|--------|
| COV-605925 (Anime Cartoon Drawing Camp Jul) | Cancelled — detail page confirms "Cancelled as of Mar 30, 2026" |
| COV-605926 (Anime Cartoon Drawing Camp Aug) | Cancelled — detail page confirms cancelled |
| COV-605897, 605905, 605907 (Badminton Court Rental) | 16 yrs+ adult programs / venue rental |

---

## Notes

- Virtual renderer limitation: only A programs visible (~20 items). B–Z programs need follow-up pass.
- Dual-ID pattern confirmed: display IDs differ from URL IDs. URL IDs match COV- DB IDs.
- Adventures at Avalon Pond: held at Everett Crowley Park, not Champlain Heights CC building.
- Amphibian Survey and Nature Walk programs: evening outdoor citizen science at Everett Crowley Park.
- 371 live programs include birthday party slots (excluded per policy) and adult programs.
- COV-607069 (Art Adventurers, age 5–8): was incorrectly marked Open — corrected to Full/Waitlist.
