# Verification Log — City of Vancouver - Mount Pleasant Community Centre

**Audited:** 2026-04-06
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=53&min_age=0&max_age=17&viewMode=list
**center_id:** 53
**Live page count:** 521 programs (ages 0–17, in-progress/future)
**DB count before audit:** 117 programs
**DB count after audit:** 123 programs (117 + 6 added + 1 fix = net +6)

---

## Summary

Live page shows 521 programs for center_ids=53. The majority are adult programs, ongoing weekly classes, drop-in slots, and piano lessons already in the DB.

Keyword-searched "camp" (58 results), "sportball" (17), "VPS dance" (2), "superhero" (2), "karate" (8) to enumerate all camp and youth program types.

Dual-ID formula: display ID − 2922 = URL ID (consistent with all CoV centers).

Key findings:
- **Karate Camp Weeks 1–2** entirely missing from DB (confirmed via detail pages)
- **Ivy's Breakfast Club** (basketball camps) entirely missing from DB
- **Sportball 10:45 AM time slots** missing — DB had only the 9:30 AM slots for 3.5–5yr camps
- **ID 1714 (VPS Defy Gravity Dance Camp)** had null startTime/endTime — fixed to 9:30 AM / 2:30 PM (live page shows 9:30 AM - 2:30 PM; "2:30 AM next day" is a site rendering glitch)

**Registration opens April 8, 2026 at 7:00 PM** for all summer camps.

---

## Fixes (1)

| ID | Program | Fix |
|----|---------|-----|
| 1714 | VPS Defy Gravity Dance Camp at Mount Pleasant | startTime=null → 9:30 AM; endTime=null → 2:30 PM (live: 9:30 AM–2:30 PM; confirmed by other VPS Defy Gravity venues) |

---

## Programs Added This Audit (6)

### Karate Camp

Ages 6–12. Instructor: Heyton Tze. Location: Art Room / Multipurpose Room 3. Fee behind modal.

| ID | Dates | Days | Status |
|----|-------|------|--------|
| COV-607933 | Jul 6–10, 2026 | Mon–Fri, 10:00 AM–Noon | Coming Soon |
| COV-607934 | Jul 13–17, 2026 | Mon–Fri, 10:00 AM–Noon | Coming Soon |

### Ivy's Breakfast Club Basketball Camps

CCA Contractor program by Coach Ivy (former SFU/Capilano Men's Basketball assistant coach). Fee behind modal.

| ID | Name | Dates | Days/Time | Ages | Status |
|----|------|-------|-----------|------|--------|
| COV-605316 | Future Stars Basketball Camp | Aug 10–12, 2026 | Mon–Wed, 3:30–5:00 PM | 9–13 (Gr 4–7) | Coming Soon |
| COV-605317 | Shooters Club Camp | Aug 13–14, 2026 | Thu–Fri, 3:30–5:00 PM | 13–15 (Gr 8–11) | Coming Soon |

### Sportball Multisport Camp — Additional Time Slots

The 10:45 AM–Noon time slots were missing; DB had only the 9:30 AM slots.

| ID | Dates | Time | Ages | Status |
|----|-------|------|------|--------|
| COV-604690 | Jul 6–10, 2026 (Mon–Fri) | 10:45 AM–Noon | 3.5–5yrs | Coming Soon |
| COV-604694 | Aug 4–7, 2026 (Tue–Fri, 4-day) | 10:45 AM–Noon | 3.5–5yrs | Coming Soon |

---

## Duplicate Records Noted (Not Resolved This Session)

Two sets of duplicate records exist for Mount Pleasant programs. These have different IDs but identical registrationUrls:

| Legacy ID | COV/ACT ID | Program | Note |
|-----------|-----------|---------|------|
| 1712 | ACT-604678 | K-Pop Demon Hunters Half-Day Camp (Jul 20) | Legacy has cost=210; ACT- has cost=null |
| 1713 | ACT-604695 | K-Pop Demon Hunters Half-Day Camp (Aug 10) | Legacy has cost=210; ACT- has cost=null |
| 1725 | COV-598617 | Arts in Motion Camp (Aug 4) | Legacy has correct days=Tue–Fri; COV- has wrong days=Mon–Fri |

Per Rule 31, these are flagged for deduplication review rather than removed this session. The legacy numeric IDs (1712, 1713, 1725) have more complete/accurate data.

---

## Gap Analysis — Programs Not Added

| Category | Est. Count | Reason Not Added |
|----------|-----------|-----------------|
| Adult programs (16+) | ~200 | Out of age scope |
| Piano lessons (ongoing) | ~30 | Already in DB (COV-598518–526, COV-604714–742, etc.) |
| Weekly karate classes (ongoing) | 6 | Ongoing classes (not camps) — partially in scope but omitted for now; Kung Fu (ongoing) is already in DB |
| Sportball ongoing Sunday classes | 8 | Non-camp ongoing format |
| Drop-in programs | varies | Not registerable scheduled programs |
| Dance classes (ballet, hip-hop — ongoing) | ~15 | Already in DB |
| Games Room / Open Gym | 3 | Already in DB |
| Girls+/Boys+ Group | 2 | Already in DB |
| LEGO STEAM | 1 | Already in DB |
| Other Youth Leadership (existing) | 8 | Already in DB (Wks 1–8) |

---

## Notes

- All Ivy's Breakfast Club and Karate Camp fees are behind JS fee modal — cost=null with costNote for all new records
- Sportball existing records (9:30 AM slots) have cost=92.5 — this was pre-existing data, not verified this session
- VPS Defy Gravity time fix based on comparison with multiple other VPS Defy Gravity records at different venues (all show 9:30 AM–2:30 PM range)
