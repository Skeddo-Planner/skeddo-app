# Verification Log — City of Vancouver - Champlain Heights Cmty Centre

**Audited:** 2026-04-06
**Registration page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=57&min_age=0&max_age=17&viewMode=list
**center_id:** 57
**Live page count:** 371 programs (ages 0–17, in-progress/future)
**DB count before audit:** 108 programs
**DB count after audit:** 125 programs (108 − 1 removed + 17 added + 1 fix = net +17)

---

## Summary

Live page shows 371 programs for center_ids=57. Of these, the majority are adult programs (16+), court rentals, personal training, and swim slots not relevant to this audit.

Prior audit was blocked by Playwright spawn errors. This audit used Claude in Chrome successfully.

Key findings:
- **Anime Drawing Camp Jun 29-Jul 3** was incorrectly "Coming Soon" — live page shows Cancelled
- **Anime Drawing Camp Aug 10-14** was incorrectly "Coming Soon" — live page shows Full
- **Byte Camp Foundations of AI** had wrong start date (Aug 10 → Jul 20 confirmed on detail page)
- **Senior Sunsplash Weeks 5–9** were entirely missing (only Weeks 1–4 in DB)
- **Supported Sunsplash Weeks 1–9** (inclusion program) entirely missing from DB
- **Champlain Cooking Club** (two sets) missing from DB
- **champlain-cc-1** placeholder had wrong registrationUrl (pointed to Killarney) — removed; Sunsplash records cover it

**Registration opens April 8, 2026 at 7:00 PM** for all summer camps (Sunsplash, Leadership, Byte Camp, Yoga, etc.). All "Coming Soon" records are correct.

**Dual-ID formula:** display ID − 2922 = URL ID (consistent with all CoV centers)

---

## Status / Date Fixes (4)

| Legacy ID | Program | Fix |
|-----------|---------|-----|
| 1394 | Anime Cartoon Drawing Camp (Jun 29–Jul 3) | Coming Soon → Cancelled (live: Cancelled) |
| 1395 | Anime Cartoon Drawing Camp (Aug 10–14) | Coming Soon → Full (live: Full, 0 openings) |
| 1397 | Byte Camp - Foundations of AI | startDate 2026-08-10 → 2026-07-20 (live: Jul 20–24, confirmed at detail/609695) |
| champlain-cc-1 | Champlain Heights Summer Day Camp | Removed — orphaned placeholder with wrong URL (pointed to Killarney); replaced by Sunsplash week records |

---

## Programs Added This Audit (17)

### Senior Sunsplash — Weeks 5–9 (Weeks 1–4 already in DB as IDs 1410–1413)

Registration opens Apr 8, 2026 at 7:00 PM. Ages 9–12. 27 openings/week.

| ID | Week | Dates | Days | Status |
|----|------|-------|------|--------|
| COV-602877 | Week 5 | Jul 27–31, 2026 | Mon–Fri | Coming Soon |
| COV-602878 | Week 6 | Aug 4–7, 2026 | Tue–Fri (BC Day off) | Coming Soon |
| COV-602879 | Week 7 | Aug 10–14, 2026 | Mon–Fri | Coming Soon |
| COV-602880 | Week 8 | Aug 17–21, 2026 | Mon–Fri | Coming Soon |
| COV-602881 | Week 9 | Aug 24–27, 2026 | Mon–Thu | Coming Soon |

### Supported Sunsplash — Weeks 1–9 (inclusion program)

3 spots per week. Registration opens Apr 8, 2026 at 7:00 PM. Ages 6–12 (Week 2: 6–8).

| ID | Week | Dates | Days | Age | Status |
|----|------|-------|------|-----|--------|
| COV-602285 | Week 1 | Jun 30–Jul 3 | Tue, Thu, Fri | 6–12 | Coming Soon |
| COV-602286 | Week 2 | Jul 6–10 | Mon–Fri | 6–8 | Coming Soon |
| COV-602287 | Week 3 | Jul 13–17 | Mon–Fri | 6–12 | Coming Soon |
| COV-602288 | Week 4 | Jul 20–24 | Mon–Fri | 6–12 | Coming Soon |
| COV-602289 | Week 5 | Jul 27–31 | Mon–Fri | 6–12 | Coming Soon |
| COV-602290 | Week 6 | Aug 4–7 | Tue–Fri | 6–12 | Coming Soon |
| COV-602291 | Week 7 | Aug 10–14 | Mon–Fri | 6–12 | Coming Soon |
| COV-602292 | Week 8 | Aug 17–21 | Mon–Fri | 6–12 | Coming Soon |
| COV-602293 | Week 9 | Aug 24–28 | Mon–Fri | 6–12 | Coming Soon |

### Champlain Cooking Club

| ID | Name | Dates | Day/Time | Cost | Ages | Status |
|----|------|-------|----------|------|------|--------|
| COV-598777 | Champlain Cooking Club Set #1 | Apr 2–May 7, 2026 | Thu 5:30–7:00 PM | Not shown (click-through) | 11–15 | Full/Waitlist (4 on list) |
| COV-598785 | Champlain Cooking Club Set #2 | May 14–Jun 18, 2026 | Thu 5:30–7:00 PM | Not shown (click-through) | 11–15 | Full |

Note: A third entry (Set 2 duplicate, display #601700, Cancelled) was not added.

### Pro-D Day — Science World

| ID | Dates | Cost | Ages | Status |
|----|-------|------|------|--------|
| COV-604055 | May 4, 2026 (Mon 9:00 AM–3:00 PM) | $75 (incl. $20 Science World admission) | K–7 | Open (18 spots, 1 on waitlist) |

Note: Priority registration for current Champlain Heights OSC participants. Non-OSC families placed on waitlist and contacted 2 weeks prior.

---

## Gap Analysis — Programs Not Added

| Category | Est. Count | Reason Not Added |
|----------|-----------|-----------------|
| Swimming / pool programs | ~40 | Champlain Heights has no pool; none found |
| Adult/senior programs (16+) | ~150 | Out of age scope |
| Badminton/gym court rentals | ~30 | Facility use, not programs |
| Bus trips (55+ seniors) | ~10 | Out of scope |
| Personal training | ~15 | Adult |
| Music (Piano, Guitar) — existing | 29 | Already in DB |
| Wing Chun, Taekwondo — existing | 2 | Already in DB |
| Junior Sunsplash Weeks 1–9 | 9 | Already in DB (IDs 1401–1409) |
| Senior Sunsplash Weeks 1–4 | 4 | Already in DB (IDs 1410–1413) |
| Adapted Family Open Gym | 2 | Age 5+ (family/adult) — out of youth scope |
| Champlain Youth Council (ages 13–17) | 1 | Already in DB? To check next session |
| High 5 Sports / other drop-in | varies | Drop-in format, not registerable programs |

---

## Notes

- All fees for Sunsplash programs are behind a JS click-through modal ("View fee details") — cost=null with costNote for all new/existing Sunsplash records
- Byte Camp fees ($410/week) confirmed consistent with False Creek Byte Camp (COV-603654)
- All Supported Sunsplash records include `ageSpanJustified` field for R46 compliance (ages 6–12)
- Pro-D Day is a licensed childcare program — registration priority given to existing OSC participants
