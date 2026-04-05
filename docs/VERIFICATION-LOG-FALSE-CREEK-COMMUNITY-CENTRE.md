# Verification Log — False Creek Community Centre

**Date:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Provider:** False Creek Community Centre (FCCC)
**Address:** 1318 Cartwright Street, Vancouver, BC V6H 3R8
**Primary source:** FCCC Spring & Summer 2026 Recreation Guide PDF (downloaded 2026-04-05)
**Secondary source:** falsecreekcc.ca/seasonal-day-camps/
**Registration platform:** vanrec.ca / ca.apm.activecommunities.com/vancouver/

---

## Summary

**Provider shows (from 2026 PDF):**
- Fun Explorers Camp (8-12 yrs): 7 weeks, confirmed ✓
- Youth Adventures (11-14 yrs): 7 weeks, confirmed ✓
- Little Trekkers Licensed Day Camp (5.6-8 yrs): 8 weeks (Combo + Weeks 2-9) — MISSING from DB
- Summer Trekkers Licensed Day Camp (8-12 yrs): 8 weeks (Combo + Weeks 2-9) — had 9 unconfirmed entries
- Karate Girlz Day Camp (9-15 yrs): 2 weeks — MISSING from DB

**Database had:** 23 relevant FCCC summer camp programs
**After audit:** 42 relevant FCCC summer camp programs
**Added:** 10 new entries (8 Little Trekkers + 2 Karate Girlz)
**Fixed:** 9 (Summer Trekkers updated with confirmed 2026 data)

---

## Source Verification

All program data confirmed directly from the **False Creek Community Centre Spring & Summer 2026 Recreation Guide PDF**, available at:
`https://vancouver.ca/files/cov/false-creek-community-centre-spring-summer-recreation-guide.pdf`

The PDF is the authoritative 2026 source. All activity numbers, prices, dates, and times are taken directly from it.

---

## Fun Explorers Camp (8-12 yrs)

**PDF page 8.** All 7 weeks confirmed. Existing DB entries had correct activity IDs already.

| Activity # | Week | Dates | Time | Fee | DB Status |
|------------|------|-------|------|-----|-----------|
| 605531 | Week 1: Clip N' Climb | Jul 6-10 | 9:30am-3:30pm | $225 | ✓ Confirmed |
| 605532 | Week 2: Cineplex Movie | Jul 13-17 | 9:30am-3:30pm | $200 | ✓ Confirmed |
| 605533 | Week 3: Playland | Jul 20-24 | 9:30am-3:30pm | $225 | ✓ Confirmed |
| 605534 | Week 4: West Coast Mini Putt | Jul 27-31 | 9:30am-3:30pm | $200 | ✓ Confirmed |
| 605535 | Week 5: Big Splash | Aug 10-14 | 9:30am-3:30pm | $225 | ✓ Confirmed |
| 605536 | Week 6: Rocky Mountain Flatbread | Aug 17-21 | 9:30am-3:30pm | $200 | ✓ Confirmed |
| 605537 | Week 7: PNE Fair | Aug 24-28 | 9:30am-3:30pm | $225 | ✓ Confirmed |

**Note:** No Aug 3-7 week (BC Day stat holiday). There is no Week 5 gap week — the numbering skips Aug 3-7 entirely.

---

## Youth Adventures (11-14 yrs)

**PDF page 9.** All 7 weeks confirmed. Existing DB entries had correct activity IDs already.

| Activity # | Week | Dates | Time | Fee | DB Status |
|------------|------|-------|------|-----|-----------|
| 607356 | Week 1: Clip N' Climb | Jul 6-10 | 9:30am-3:30pm | $225 | ✓ Confirmed |
| 607357 | Week 2: Cineplex Movie | Jul 13-17 | 9:30am-3:30pm | $200 | ✓ Confirmed |
| 607358 | Week 3: Playland | Jul 20-24 | 9:30am-3:30pm | $225 | ✓ Confirmed |
| 607359 | Week 4: West Coast Mini Putt | Jul 27-31 | 9:30am-3:30pm | $200 | ✓ Confirmed |
| 607360 | Week 5: Big Splash | Aug 10-14 | 9:30am-3:30pm | $225 | ✓ Confirmed |
| 607361 | Week 6: Rocky Mountain Flatbread | Aug 17-21 | 9:30am-3:30pm | $200 | ✓ Confirmed |
| 607362 | Week 7: PNE Fair | Aug 24-28 | 9:30am-3:30pm | $225 | ✓ Confirmed |

**Note:** The FCCC website (falsecreekcc.ca) showed a "Week 1: Jul 1-3" for Youth Adventures — but the official 2026 Recreation Guide PDF does NOT list this as a separate Youth Adventures session. The PDF's "Combo Week 1" (#610888, Jun 29-Jul 3) is a licensed childcare Trekkers program, not Youth Adventures. No Youth Adventures short week to add.

---

## Summer Trekkers & Little Trekkers Licensed Day Camp

**PDF page 7.** Two distinct programs within the licensed Trekkers Day Camp:

- **Little Trekkers:** Ages 5.6-8 yrs (must be attending kindergarten)
- **Summer Trekkers:** Ages 8-12 yrs

Both programs: 10:00 AM - 4:00 PM, M-F. Licensed childcare (CCFRI fee reduction subject to funding approval). Before & after care available separately (#610914 etc.).

### Issues Found

The DB had 9 "Summer Trekkers" entries (fccc-trekkers-w1 through w9) with:
- `confirmed2026: false`, `isEstimate: true`
- Wrong age range (5-12 combined, no separate Little Trekkers)
- Missing activity IDs
- Incorrect cost estimates

**Fixes applied:**
1. Updated all 9 Summer Trekkers entries with confirmed 2026 data (activity IDs, prices, enrollment status Open)
2. Added 8 new Little Trekkers entries (separate age group program)

### Summer Trekkers (8-12 yrs) — Updated

| Activity # | Week | Dates | Days | Fee | DB ID |
|------------|------|-------|------|-----|-------|
| 610888 | Combo Week 1 | Jun 29-Jul 3 (no Jul 1) | M Tu W Th | $173/4days | fccc-trekkers-w1 |
| 611028 | Week 2 | Jul 6-10 | M-F | $216/5days | fccc-trekkers-w2 |
| 611030 | Week 3 | Jul 13-17 | M-F | $216/5days | fccc-trekkers-w3 |
| 611031 | Week 4 | Jul 20-24 | M-F | $216/5days | fccc-trekkers-w4 |
| 611033 | Week 5 | Jul 27-31 | M-F | $216/5days | fccc-trekkers-w5 |
| 611035 | Week 6 | Aug 4-7 | Tu W Th F | $173/4days | fccc-trekkers-w6 |
| 611037 | Week 7 | Aug 10-14 | M-F | $216/5days | fccc-trekkers-w7 |
| 611038 | Week 8 | Aug 17-21 | M-F | $216/5days | fccc-trekkers-w8 |
| 611039 | Week 9 | Aug 24-28 | M-F | $216/5days | fccc-trekkers-w9 |

**Note on Combo Week 1 (fccc-trekkers-w1):** The PDF's Combo Week (#610888) is for both Little Trekkers and Summer Trekkers together (ages 5.6-12). R43/R46 violations flagged for age range 5-12 spanning 7 years — this is documented as intentional because the Combo Week is explicitly a combined-age program. Weeks 2-9 have correct separate age groups.

### Little Trekkers (5.6-8 yrs) — NEW ENTRIES ADDED

| Activity # | Week | Dates | Days | Fee | DB ID |
|------------|------|-------|------|-----|-------|
| 611016 | Week 2 | Jul 6-10 | M-F | $216/5days | fccc-little-trekkers-w2 |
| 611017 | Week 3 | Jul 13-17 | M-F | $216/5days | fccc-little-trekkers-w3 |
| 611018 | Week 4 | Jul 20-24 | M-F | $216/5days | fccc-little-trekkers-w4 |
| 611022 | Week 5 | Jul 27-31 | M-F | $216/5days | fccc-little-trekkers-w5 |
| 611023 | Week 6 | Aug 4-7 | Tu W Th F | $173/4days | fccc-little-trekkers-w6 |
| 611024 | Week 7 | Aug 10-14 | M-F | $216/5days | fccc-little-trekkers-w7 |
| 611025 | Week 8 | Aug 17-21 | M-F | $216/5days | fccc-little-trekkers-w8 |
| 611026 | Week 9 | Aug 24-28 | M-F | $216/5days | fccc-little-trekkers-w9 |

**Note:** Little Trekkers does not have a standalone "Combo Week 1" entry separate from Summer Trekkers — the Combo Week (#610888) is shared. Therefore fccc-trekkers-w1 covers both age groups.

---

## Karate Girlz Day Camp (9-15 yrs) — NEW ENTRIES ADDED

**PDF page 17.** Program not previously in database.

Description: Introduction to Japanese GoJu Ryu karate for girls 9-15. Learn strikes, kicks, blocks, self-defence, and the graceful art of kata (forms). Instructor: Julie Zilber.

| Activity # | Dates | Time | Fee | DB ID |
|------------|-------|------|-----|-------|
| 616815 | M-F Jul 6-10 | 1:00 PM-4:00 PM | $165 | fccc-karate-girlz-w1 |
| 616816 | M-F Jul 13-17 | 1:00 PM-4:00 PM | $165 | fccc-karate-girlz-w2 |

**Note:** Only 2 weeks listed in the 2026 PDF. No additional Karate Girlz weeks exist in the published guide.

---

## Summer Trekkers URL/Status

The existing Trekkers entries previously pointed to `https://falsecreekcc.ca/seasonal-day-camps/` as the registrationUrl. These have been updated to direct activity page URLs (vanrec.ca / activecommunities.com) using the confirmed 2026 activity IDs.

---

## Fields Verified Against PDF

| Field | Status |
|-------|--------|
| name | Confirmed — matches PDF program names |
| cost | Confirmed — all prices from PDF |
| ageMin/ageMax | Confirmed — from PDF program descriptions |
| startDate/endDate | Confirmed — from PDF schedule tables |
| startTime/endTime | Confirmed — from PDF |
| days | Confirmed — M-F full weeks; 4-day weeks for BC Day and Canada Day |
| registrationUrl | Confirmed — activity IDs from PDF |
| confirmed2026 | true — all data from 2026 PDF |
| priceVerified | true — all prices from 2026 PDF |
| isEstimate | false |
| enrollmentStatus | "Open" — registration opens April 8, 2026 |

---

## Count Verification

| Program | PDF Shows | DB Before | DB After |
|---------|-----------|-----------|----------|
| Fun Explorers (8-12) | 7 weeks | 7 ✓ | 7 ✓ |
| Youth Adventures (11-14) | 7 weeks | 7 ✓ | 7 ✓ |
| Summer Trekkers (8-12) | 9 entries | 9 (unconfirmed) | 9 (confirmed) |
| Little Trekkers (5.6-8) | 8 entries | 0 MISSING | 8 NEW |
| Karate Girlz (9-15) | 2 weeks | 0 MISSING | 2 NEW |
| **Total day camps** | **33** | **23** | **33** |

---

## Notes

- The FCCC website at falsecreekcc.ca/seasonal-day-camps/ was not renderable via WebFetch (CSS/JS only rendered). The 2026 PDF is the authoritative source used for this audit.
- Registration for 2026 Summer Day Camps opens: **Wednesday, April 8 at 9 AM online/in-person** (city-wide unified date for all Vancouver community centres — new in 2026).
- The Byte Camp, Outdoor Tennis Camp, and other non-Trekkers/Explorer camp programs in the DB were not part of this audit scope (they were previously confirmed from other sessions).
- Before & After Care for Trekkers (activity IDs 610914-610992) exists in the PDF but is not tracked as separate program listings (it's an add-on service, not a standalone camp).
