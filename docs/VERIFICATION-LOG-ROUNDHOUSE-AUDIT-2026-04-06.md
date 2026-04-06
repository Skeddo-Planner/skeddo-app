# Verification Log — City of Vancouver - Roundhouse Community Arts & Recreation Centre

**Audited:** 2026-04-06
**URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=42&min_age=0&max_age=17&viewMode=list
**center_id:** 42 (confirmed via Where filter checkbox extraction)
**Live program count:** ~108 in-progress/future programs (ages 0–17)
**DB count before audit:** ~69 programs (legacy IDs 1742+ and COV IDs)
**DB count after audit:** +27 programs added → 15,815 total

---

## Summary

Roundhouse Community Arts & Recreation Centre offers a rich mix of summer camps
(arts, dance, STEM, multi-activity) plus ongoing spring classes. Programs are run by
a combination of CoV staff and CCA contractors (Byte Camp, Petit Architect, Rise Arts,
Olsen Academy, etc.).

**Registration for all missing programs:** April 8, 2026 at 7:00 PM

**Dual-ID formula confirmed:** display ID − 2922 = URL ID
- LEGO Critter AM display #608548 → URL 605626 ✓
- Byte Camp Claymation display #608784 → URL 605862 ✓
- After Camp W2 display #610704 → URL 607782 ✓

---

## Key Finding: Legacy Records Already Cover Major Programs

Many Roundhouse summer programs were already in the DB as legacy numeric IDs (1742+)
with correct registrationUrls pointing to the proper ActiveNet detail pages.
These must be checked by URL (not just ID prefix) to avoid double-adds.

Programs already in DB via legacy records:
- Summer Safari Day Camp Junior (6–8) — Weeks 1–10 (IDs 1742–1762)
- Summer Safari Day Camp Senior (9–12) — Weeks 1–10
- Acrobatic Dance Camp, Preschool Acrobatic Dance Camp
- Ballet Camp, Creative Dance Camp × 2
- Lego Robotics Camp × 2, Lego Robotics Ev3 Camp × 2, Lego Stop Motion × 2
- Science Explorer Camp, Wild Science Camp
- Creative Remix Arts Camp, Creative Theatre Summer Camp
- Little Artist Camp × 2, Art is Fun Camp × 2
- Young-Commander Chess Camp × 3
- Byte Camp - Introduction to Coding, Byte Camp - Music Video Production
- Inventors & Inventions Camp, Amusement Parks Camp
- Architecture Around the World Camp, Future Ready Minds × 10
- Hip Hop Camp, Creative Jazz and Hip Hop, Creative Dance II
- Preschool Creative Dance Camp, Preschool Multi Dance Camp
- Multi Dance Camp, Preschool Acrobatic Dance Camp

---

## Programs Added (27 total)

### Byte Camp (CCA Contractor)

| ID | Name | Dates | Days | Time | Ages | Cost |
|----|------|-------|------|------|------|------|
| COV-605862 | Byte Camp - Claymation Movie Production | Jul 27–31 | Mon–Fri | 9AM–4PM | 9–12 | $410 |
| COV-605864 | Byte Camp - Graphic Design & Printing | Aug 4–7 | Tue–Fri (BC Day) | 9AM–4PM | 11–14 | $355 |

### CSI Lab Camp

| ID | Name | Dates | Days | Time | Ages | Cost |
|----|------|-------|------|------|------|------|
| COV-605624 | CSI Lab Camp | Jul 6–10 | Mon–Fri | 9AM–3PM | 7–12 | $350 |

### Rise Arts Company

| ID | Name | Dates | Days | Time | Ages | Cost |
|----|------|-------|------|------|------|------|
| COV-607065 | Clay Creations Summer Camp | Jul 20–24 | Mon–Fri | 9AM–3PM | 6–12 | $320 |

### Olsen Academy

| ID | Name | Dates | Days | Time | Ages | Cost |
|----|------|-------|------|------|------|------|
| COV-607981 | Drama Camp | Jul 20–24 | Mon–Fri | 9AM–3PM | 7–12 | $250 |

### Petit Architect

| ID | Name | Dates | Days | Time | Ages | Cost |
|----|------|-------|------|------|------|------|
| COV-606250 | Dream House Camp with Petit Architect | Jul 6–10 | Mon–Fri | 9:15AM–3PM | 7–12 | $490 |
| COV-606012 | Fairy and Gnome Houses Camp | Jul 27–31 | Mon–Fri | 9:15AM–3PM | 6–12 | $395 |
| COV-606249 | Happy City Camp with Petit Architect | Aug 10–14 | Mon–Fri | 9:15AM–3PM | 7–12 | $450 |

### Dance & Gymnastics Camps

| ID | Name | Dates | Days | Time | Ages | Cost |
|----|------|-------|------|------|------|------|
| COV-607760 | Preschool Ballet Camp | Jul 6–10 | Mon–Fri | 1:15–2:15PM | 3–4 | $125 |
| COV-607766 | Preschool Rhythmic Gymnastics Camp | Jul 20–24 | Mon–Fri | 1:15–2:15PM | 3–4 | $125 |
| COV-607769 | Rhythmic Gymnastics Camp | Jul 20–24 | Mon–Fri | 2:30–3:30PM | 5–8 | $125 |
| COV-607771 | Preschool Hip Hop Camp | Jul 27–31 | Mon–Fri | 1:15–2:15PM | 3–4 | $125 |
| COV-607777 | Rhythmic Gymnastics Camp | Aug 17–21 | Mon–Fri | 1:15–2:15PM | 8–12 | $125 |

### LEGO Camps

| ID | Name | Dates | Days | Time | Ages | Cost |
|----|------|-------|------|------|------|------|
| COV-605626 | LEGO Critter Constructions Camp (AM) | Jul 20–24 | Mon–Fri | 9:30AM–12:30PM | 5–10 | $220 |
| COV-605629 | LEGO Critter Constructions Camp (PM) | Jul 20–24 | Mon–Fri | 1:00–4:00PM | 5–10 | $220 |
| COV-605627 | LEGO Out of This World Camp (AM) | Jul 27–31 | Mon–Fri | 9:30AM–12:30PM | 5–10 | $220 |
| COV-605628 | LEGO Out of This World Camp (PM) | Jul 27–31 | Mon–Fri | 1:00–4:00PM | 5–10 | $220 |

### Summer Safari After Camp (6–13) — 10 Weeks

After-care program running 3:30–6:00 PM alongside the Summer Safari Day Camp.
Ages 5y5m–13y11m (listed as single group by provider → ageSpanJustified=true).

| ID | Week | Dates | Days | Cost |
|----|------|-------|------|------|
| COV-607781 | Week 1 | Jun 29–Jul 3 | Mon,Tue,Thu,Fri (Canada Day off) | $60 |
| COV-607782 | Week 2 | Jul 6–10 | Mon–Fri | $75 |
| COV-607783 | Week 3 | Jul 13–17 | Mon–Fri | $75 |
| COV-607784 | Week 4 | Jul 20–24 | Mon–Fri | $75 |
| COV-607785 | Week 5 | Jul 27–31 | Mon–Fri | $75 |
| COV-607786 | Week 6 | Aug 4–7 | Tue–Fri (BC Day off) | $60 |
| COV-607787 | Week 7 | Aug 10–14 | Mon–Fri | $75 |
| COV-607788 | Week 8 | Aug 17–21 | Mon–Fri | $75 |
| COV-607789 | Week 9 | Aug 24–28 | Mon–Fri | $75 |
| COV-607790 | Week 10 | Aug 31–Sep 4 | Mon–Fri | $75 |

---

## Gap Analysis

| Category | Live Count | DB Added | Notes |
|----------|-----------|---------|-------|
| Byte Camp (3 types) | 4 | 2 | Intro to Coding + Music Video already in DB |
| CSI Lab Camp | 1 | 1 | Complete |
| Clay Creations Summer Camp | 1 | 1 | Complete |
| Drama Camp | 1 | 1 | Complete |
| Petit Architect camps (3 types) | 3 | 3 | Complete |
| Dance/Gymnastics camps (missing) | 5 | 5 | Complete |
| Dance/Gymnastics camps (existing) | ~10 | 0 | Already in DB |
| LEGO Critter/OotW (AM+PM) | 4 | 4 | Complete |
| LEGO Robotics × 6 | 6 | 0 | Already in DB |
| Summer Safari After Camp (×10) | 10 | 10 | Complete |
| Summer Safari Day Camp Jr/Sr (×20) | 20 | 0 | Already in DB (legacy IDs) |
| Future Ready Minds (×10) | 10 | 0 | Already in DB (COV IDs) |
| Art/Remix/Chess/Science camps | ~15 | 0 | Already in DB |
| Inventors, Amusement Parks, Architecture | 3 | 0 | Already in DB |
| Spring/ongoing classes | ~28 | 0 | Not summer camps |

---

## Programs Not Added

| Category | Reason |
|----------|--------|
| Spring ongoing classes (Ballet I, Rhythmic Gymnastics, Creative Dance I/II, etc.) | Term ends June 2026; not summer camps |
| Science For Kids / Preschoolers (ongoing Sat) | Ongoing weekly class format |
| Rhythmic Gymnastics II (ongoing summer Mon) | Ongoing class, not a week-long camp |
| Design and Architecture for Kids (ongoing Wed) | Ongoing class, not a camp |
| Art in Motion Youth Residency | Paid youth residency program, not a general camp |
| Ballet Summer (ongoing Wed) | Ongoing summer class |

---

## Fee Verification Summary

All fees verified directly from ActiveNet detail pages via browser (fee modal click):

| Program | URL ID | Fee |
|---------|--------|-----|
| Byte Camp Claymation | 605862 | $410 |
| Byte Camp Graphic Design (4-day) | 605864 | $355 |
| CSI Lab Camp | 605624 | $350 |
| Clay Creations Summer Camp | 607065 | $320 |
| Drama Camp | 607981 | $250 |
| Dream House Camp (Petit Architect) | 606250 | $490 |
| Fairy & Gnome Houses Camp | 606012 | $395 |
| Happy City Camp (Petit Architect) | 606249 | $450 |
| Preschool Ballet Camp | 607760 | $125 |
| Preschool Rhythmic Gymnastics Camp | 607766 | $125 |
| Rhythmic Gymnastics Camp (Jul) | 607769 | $125 |
| Preschool Hip Hop Camp | 607771 | $125 |
| Rhythmic Gymnastics Camp (Aug) | 607777 | $125 |
| LEGO Critter AM | 605626 | $220 |
| LEGO Critter PM | 605629 | $220 |
| LEGO OotW AM | 605627 | $220 |
| LEGO OotW PM | 605628 | $220 |
| After Camp W1 (4-day) | 607781 | $60 |
| After Camp W2–W5,W7–W10 (5-day) | 607782–607790 | $75 |
| After Camp W6 (4-day BC Day) | 607786 | $60 |

---

## Notes

- center_id=42 confirmed for Roundhouse Community Arts & Recreation Centre
- Legacy records (numeric IDs 1742+) cover major programs; check by registrationUrl to avoid duplicates
- Registration for all new programs: April 8, 2026 at 7:00 PM
- After Camp age range 5–13 (ageSpanJustified=true): provider registers single age group, no separate bands
- Canada Day (Jul 1) → Week 1 runs Mon,Tue,Thu,Fri only
- BC Day (Aug 3) → Week 6 runs Tue,Wed,Thu,Fri only (After Camp) / Tue,Wed,Thu,Fri (Byte Camp Graphic Design)
