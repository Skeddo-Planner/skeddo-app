# Verification Log — Mount Seymour

**Date:** 2026-04-04
**Auditor:** Claude (autonomous audit agent)
**Provider:** Mount Seymour
**Registration page:** https://mtseymour.ca/summer/2026-summer-camps
**Address:** 1700 Mt Seymour Road, North Vancouver, BC

---

## Programs Found on Live Page

Source: https://mtseymour.ca/summer/2026-summer-camps (verified 2026-04-04)

**All camps run 9:00 AM – 4:00 PM daily. Max 14 children per group, 2 instructors.**

### 1. Trailblazers Camp
**URL:** https://mtseymour.ca/summer/eco-adventure-summer-camps/trailblazers
**Age:** 5.5–6 years (must have turned 5 by Dec 30 prior year)

| Week | Dates | Days | Price |
|------|-------|------|-------|
| 1 | Jun 29 – Jul 3 | Mon–Thu (4 days, Canada Day Jul 1) | $339 |
| 2 | Jul 6–10 | Mon–Fri | $409 |
| 3 | Jul 13–17 | Mon–Fri | $409 |
| 4 | Jul 20–24 | Mon–Fri | $409 |
| 5 | Jul 27–31 | Mon–Fri | $409 |
| 6 | Aug 4–7 | Tue–Fri (4 days, BC Day Aug 3) | $339 |
| 7 | Aug 10–14 | Mon–Fri | $409 |
| 8 | Aug 17–21 | Mon–Fri | $409 |
| 9 | Aug 24–28 | Mon–Fri | $409 |
| 10 | Aug 31–Sep 4 | Mon–Fri | $409 |

### 2. Forest Guardians Camp
**URL:** https://mtseymour.ca/summer/eco-adventure-summer-camps/forest-guardians
**Age:** 7–9 years

| Week | Dates | Days | Price |
|------|-------|------|-------|
| 1 | Jun 29 – Jul 3 | Mon–Thu (4 days) | $329 |
| 2 | Jul 6–10 | Mon–Fri | $399 |
| 3 | Jul 13–17 | Mon–Fri | $399 |
| 4 | Jul 20–24 | Mon–Fri | $399 |
| 5 | Jul 27–31 | Mon–Fri | $399 |
| 6 | Aug 4–7 | Tue–Fri (4 days) | $329 |
| 7 | Aug 10–14 | Mon–Fri | $399 |
| 8 | Aug 17–21 | Mon–Fri | $399 |
| 9 | Aug 24–28 | Mon–Fri | $399 |
| 10 | Aug 31–Sep 4 | Mon–Fri | $399 |

### 3. Mountain Rangers Camp
**URL:** https://mtseymour.ca/summer/eco-adventure-summer-camps/mountain-rangers
**Age:** 10–12 years

| Week | Dates | Days | Price |
|------|-------|------|-------|
| 1 | Jun 29 – Jul 3 | Mon–Thu (4 days) | $319 |
| 2 | Jul 6–10 | Mon–Fri | $389 |
| 3 | Jul 13–17 | Mon–Fri | $389 |
| 4 | Jul 20–24 | Mon–Fri | $389 |
| 5 | Jul 27–31 | Mon–Fri | $389 |
| 6 | Aug 4–7 | Tue–Fri (4 days) | $319 |
| 7 | Aug 10–14 | Mon–Fri | $389 |
| 8 | Aug 17–21 | Mon–Fri | $389 |
| 9 | Aug 24–28 | Mon–Fri | $389 |
| 10 | Aug 31–Sep 4 | Mon–Fri | $389 |

### 4. Sea to Sky Camp (new — collaboration with Ocean Ambassadors Canada)
**URL:** https://mtseymour.ca/summer/2026-summer-camps
**Age:** 7–9 and 10–12 years (two separate groups)
**Price:** $399/week (3 weeks only)
**Schedule:** Mon–Fri 9am–4pm
- Ages 7–9: Mon–Wed at Mt Seymour, Thu–Fri at Cates Park (paddleboarding/kayaking)
- Ages 10–12: Mon–Wed at Cates Park, Thu–Fri at Mt Seymour

| Week | Dates |
|------|-------|
| 2 | Jul 6–10 |
| 3 | Jul 13–17 |
| 4 | Jul 20–24 |

---

## Database Count

- **Provider shows:** 4 program types, 10 weeks each (Trailblazers, Forest Guardians, Mountain Rangers) + Sea to Sky (3 weeks × 2 age groups = 6)
- **Database had:** 38 programs
- **Added:** 6 Sea to Sky programs
- **Retired to Completed:** 8 old stale "Eco-Adventure Summer Camp" records (IDs 469–476)
- **Database now has:** 44 programs for this provider (38 active + 8 Completed)

---

## Discrepancies Found & Resolved

### 1. Stale "Eco-Adventure Summer Camp" records (IDs 469–476)
- **Issue:** 8 unconfirmed (confirmed2026: false) generic records with cost: null, marked "Full". These were prior-year placeholders.
- **Fix:** Set enrollmentStatus: "Completed" with costNote explaining they're superseded by age-specific listings.
- **Note:** Per Rule R31, these are retained in the database rather than deleted.

### 2. Aug 4–7 week: wrong days field (IDs 2431–2433)
- **Issue:** `days: "Mon-Thu"` — but BC Day is August 3 (Monday), so the camp starts Tuesday August 4.
- **Fix:** Corrected to `days: "Tue-Fri"` for all three age groups.
- **Confirmation:** Website confirms "4-day week" for this session.

### 3. Sea to Sky Camp completely missing
- **Issue:** New 2026 collaboration with Ocean Ambassadors Canada not in database.
- **Fix:** Added 6 listings (3 weeks × 2 age groups: 7–9 and 10–12), all confirmed2026: true, $399/week.

---

## Price Verification

All prices confirmed on live registration pages (mtseymour.ca, verified 2026-04-04):
- Trailblazers: $339 (4-day weeks), $409 (5-day weeks) ✓
- Forest Guardians: $329 (4-day weeks), $399 (5-day weeks) ✓
- Mountain Rangers: $319 (4-day weeks), $389 (5-day weeks) ✓
- Sea to Sky: $399/week ✓

## Enrollment Status
- Live site does not show explicit sold-out indicators; if a session is full it disappears from the booking widget.
- All 30 age-specific records show "Open" — consistent with live site showing all sessions purchasable.
- IDs 469–476 marked "Completed" (superseded by age-specific records).

## Advisory Violations
- IDs 469–476: R43/R46 (age range 5–12 spans multiple age bands). These are legacy "Completed" records and the warnings are expected. The provider correctly uses age-specific listings (Trailblazers/Forest Guardians/Mountain Rangers) — the old generic records are historical artifacts.
