# Verification Log — City of Vancouver - West Point Grey Community Centre (Aberthau)

**Audited:** 2026-04-06
**URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=49&min_age=0&max_age=17&activity_keyword=camp&viewMode=list
**center_id:** 49 (confirmed via Where filter — "West Point Grey Community Centre - Aberthau")
**Live camp count:** 100 programs matching "camp" keyword (ages 0–17)
**DB count before audit:** 242 programs
**DB count after audit:** 243 (+1 program added)

---

## Summary

West Point Grey CC has excellent DB coverage. All 100 programs returned by the "camp" keyword search were already in the DB. One additional non-camp spring tennis lesson (Mini Aces) was discovered during the tennis program search and added.

**Dual-ID formula confirmed for center_id=49:**
- display ID − 2922 = URL ID
- Verified: Sunshine Day Camp Wk 2 display #591826 → URL 588904 = COV-588904 ✓

**Canada Day (Jul 1, Wed 2026):** Sunshine Wk 1 and Discoveries Wk 1 (Jun 29–Jul 3) run Mon/Tue/Thu/Fri (4 days). Tennis Junior Aces Camp Wk 1 also Mon/Tue/Thu/Fri. Canada Day confirmed as Wednesday.

**BC Day (Aug 3, Mon 2026):** All Wk 6 camps (Aug 4–7) run Tue–Fri. Sunshine Wk 6 = $148 (4-day); Tennis Mini Fundamentals Wk 6 reflects 4-day pricing.

---

## Programs Added (1 total)

### Summer Smash Tennis: Mini Aces (6-7½ yrs)

| ID | Dates | Day | Time | Ages | Cost |
|----|-------|-----|------|------|------|
| COV-611638 | May 4 – Jun 15, 2026 | Mon (no May 18) | 4:15–5:00 PM | 6–7.5 yrs | null (opens Apr 11) |

- Display ID: #614560 → URL ID 611638 (display − 2922) ✓
- Location: Trimble Park Tennis Courts (West 7th Ave & Trimble St) — off-site from WPG building
- 6 sessions total; no class May 18 (Pro-D Day)
- Registration: April 11, 2026 at 9:00 AM (not April 8)
- Instructor: Summer Smash Tennis
- priceVerified=false: registration not yet open; fee modal not accessible before Apr 11

---

## Programs Already in DB (all 100 "camp" keyword results)

| Category | Live Count | DB Coverage |
|----------|-----------|-------------|
| Summer Smash Tennis: Junior Fundamentals+Aces Camp (Wk 1-9) | 9 | COV-591306–591314 ✓ |
| Summer Smash Tennis: Mini Fundamentals Camp (Wk 1-9 × 2 slots) | 18 | COV-591316–591334 ✓ |
| Summer Smash Tennis: Youth Fundamentals+Aces Camp (Wk 1-9) | 9 | COV-591337–591345 ✓ |
| Sunshine Day Camp (Wk 1-9) | 9 | COV-588903–588911 ✓ |
| WPG Preschool Summer Smiles Camp (Wk 1-9 × 2 slots) | 18 | COV-592484–592501 ✓ |
| Discoveries Adventure Day Camp (Wk 1-9) | 9 | COV-588892–588900 ✓ |
| Sportball Outdoor Multi-Sport Camp | 11 | COV-589181–589191 ✓ |
| Science camps (Adv, Explorer, Space, Wild) | 4 | COV-589199–589202 ✓ |
| Inventors and Inventions Camp | 1 | COV-589203 ✓ |
| LEGO® Stop Motion Animation Camp | 2 | COV-589156, COV-589158 ✓ |
| Brick-Bit Arcade Camp (AM + PM) | 2 | COV-587412, COV-587413 ✓ |
| Feature Film Making Camp | 2 | COV-589157, COV-589160 ✓ |
| Active Dance: Sing/Jazz Funk/Hip Hop/KPOP Camp | 2 | COV-592477, COV-592478 ✓ |
| Fire & Flower Empowerment Camp (Hummingbird, Kingfisher) | 2 | COV-589175, COV-589176 ✓ |
| Hand Building Pottery Camp (8-12 yrs) | 1 | COV-594527 ✓ |
| Music Video Production Camp | 1 | COV-589159 ✓ |

---

## Key Verifications

### Fire & Flower Empowerment Camps (FREE)
- Both Hummingbird and Kingfisher camps confirmed FREE (cost=0 in DB is correct)
- "Online registration is not allowed for this activity" — registration through fireandflowergirls.org
- DB enrollmentStatus="Coming Soon" (opens Apr 8) ✓

### Sunshine Day Camp Fees
- Wk 1 (Canada Day, 4-day): $148 → $37/day rate ✓
- Wk 2-5, 7-9 (5-day): $185 → $37/day rate ✓
- Wk 6 (BC Day, 4-day): $148 → $37/day rate ✓

### Tennis Junior Fundamentals spring lesson (COV-611637)
- Confirmed in DB: display #614559 → URL 611637 ✓
- cost=null, priceVerified=false — enrollment opens Apr 8 at 7:00 PM
- Same pattern used for new COV-611638 (Mini Aces, opens Apr 11)

### Age Range Verification
- ActiveNet "Age at least X but less than Y" → ageMax = Y−1 (e.g., "less than 9" = ageMax=8)
- Sunshine (6-8), Discoveries (9-12), LEGO (7-12), Science (6-10), Sportball Mini (3.5-5) ✓

---

## Gap Analysis

| Category | Live Count | Added | Notes |
|----------|-----------|-------|-------|
| All "camp" keyword programs | 100 | 0 | All already in DB ✓ |
| Spring tennis lessons | 2 visible | 1 | COV-611638 Mini Aces added; COV-611637 Junior Fundamentals already in DB |

---

## Notes

- center_id=49 confirmed for West Point Grey Community Centre (Aberthau)
- Registration for summer programs: April 8, 2026 at 7:00 PM (most programs)
- Mini Aces registration: April 11, 2026 at 9:00 AM (different date)
- All tennis camps (36 in "camp" search) and lessons run at Trimble Park Tennis Courts (off-site)
- DIY LegoLand Camp (COV-587275, Mar 23) and other spring programs already in DB ✓
- 56 Private Piano Lessons entries in DB — not part of "camp" audit scope
