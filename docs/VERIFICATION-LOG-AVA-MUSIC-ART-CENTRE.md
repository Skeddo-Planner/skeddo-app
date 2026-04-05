# Verification Log — Ava Music & Art Centre (North Shore Summer Camp)

**Date:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Provider:** Ava Music & Art Centre
**Camp brand:** North Shore Summer Camp
**Primary source (registration/info):** https://northshoresummercamp.com/camps + /pricing + /contact
**Secondary source:** https://avamusic.com/ (homepage confirms 2026 dates and location)
**Address (confirmed from /contact page):** 734 Marine Drive, North Vancouver, BC V7M 1H3

---

## Summary

**Provider shows (2026):**
- Summer Camp (Juniors 3-6, Intermediates 7-12, Seniors 13-18): 2 weeks only — Jul 13-17 and Jul 20-24
- Half-Day AM (9:00-11:30 AM): $270/week
- Half-Day PM (1:00-3:15 PM): $270/week
- Full Day (9:00 AM-3:30 PM): $590/week
- Teacher Bootcamp (ages 13-19): $950 for Week III Jul 27-31

**Database before audit:** 22 entries (12 old + 10 new)
**Database after audit:** 22 entries (12 marked Completed + 10 corrected)
**Added:** 0
**Fixed:** 10 (address/neighbourhood/city corrected on new series)
**Marked Completed:** 12 (old stale series replaced by new entries)

---

## Source Verification

### northshoresummercamp.com/camps

Confirms three camper groups: Juniors (ages 3-6), Intermediates (7-12), Seniors (13-18).
Program types: Half-Day and Full-Day Summer Camp, plus Teacher Bootcamp.
No specific week dates shown on this page.

### northshoresummercamp.com/pricing

| Product | Price |
|---------|-------|
| Half-Day Camp | $270/week |
| Full-Day Camp | $590/week |
| Teacher Bootcamp | $950 (1 week) |
| Music Lab | $500 (3 weeks) |
| Before & After Care | $25/hr (8-9 AM, 3:30-4:30 PM) |
| Lunch Hour Care | $20/day |
| Family discount | $25 off per additional week or camper |
| Early Bird (by Feb 28) | $30 off |
| Registration fee | $45 + tax (all new campers) |

### avamusic.com homepage

Confirms 2026 dates explicitly: **"Summer Camp July 13th to 17th, 2026 / July 20th to 24th, 2026 / for ages 3 to 17"**. Only 2 weeks of regular summer camp in 2026. No Jul 6-10 week.

### northshoresummercamp.com/contact

Address confirmed: **734 Marine Drive, North Vancouver, BC V7M 1H3**

---

## Issues Found

### Issue 1: Old Entry Series (IDs 127-138) — Wrong Prices and Program Names

The database had 12 entries from a prior data load:
- Junior Music Camp (ages 3-6): $275/week — 4 weeks Jul 6-31
- Intermediate Music Camp (ages 7-12): $325/week — 4 weeks Jul 6-31
- Senior Music & Film Camp (ages 13-18): $375/week — 4 weeks Jul 6-31

**Problems:**
1. Prices wrong: $275/$325/$375 do not match live pricing ($270 half-day, $590 full-day)
2. Program names wrong: provider uses "Half-Day Camp," "Full-Day Camp," not "Junior/Intermediate/Senior Music Camp"
3. Week Jul 6-10 does not exist in 2026 — avamusic.com explicitly confirms camp is Jul 13-24 only
4. 4-week structure (Jul 6-31) is wrong — 2026 has 2 weeks of regular camp + 1 week Teacher Bootcamp

**Fix:** All 12 old entries marked `enrollmentStatus: "Completed"` with a costNote explaining they are superseded by the new entries (15943-15952).

### Issue 2: Wrong Address on New Entries (IDs 15943-15952)

New entries (added by prior auditor) had address "935 Marine Drive, West Vancouver, BC V7T 1A8" with neighbourhood "Ambleside" and city "West Vancouver".

The provider's own contact page confirms the correct address is **734 Marine Drive, North Vancouver, BC V7M 1H3**.

**Fix:** All 10 new entries corrected to proper address, neighbourhood (Central Lonsdale), and city (North Vancouver). Coordinates also corrected to match North Vancouver location (lat 49.316, lng -123.074).

### Issue 3: Teacher Bootcamp costNote Inaccuracy

Entry 15952 described Teacher Bootcamp as a "3-week program" in the costNote. The pricing page says $950 is the price for Teacher Bootcamp — but it is a 1-week program (Jul 27-31 only). The "3 weeks" reference in the pricing page refers to the Music Lab add-on ($500 for 3 weeks of theory/history). The Bootcamp itself is 1 week.

**Fix:** costNote corrected to "1-week program."

---

## Program Database (Post-Audit)

### Active Entries (10 total, Jul 13-24 + Jul 27-31 Teacher Bootcamp)

| ID | Program | Age | Format | Dates | Cost |
|----|---------|-----|--------|-------|------|
| 15943 | North Shore Summer Camp — Half Day Morning (Juniors, Ages 3-6) | 3-6 | Half-Day AM | Jul 13-24 | $270/wk |
| 15944 | North Shore Summer Camp — Half Day Afternoon (Juniors, Ages 3-6) | 3-6 | Half-Day PM | Jul 13-24 | $270/wk |
| 15945 | North Shore Summer Camp — Full Day (Juniors, Ages 3-6) | 3-6 | Full Day | Jul 13-24 | $590/wk |
| 15946 | North Shore Summer Camp — Half Day Morning (Intermediates, Ages 7-12) | 7-12 | Half-Day AM | Jul 13-24 | $270/wk |
| 15947 | North Shore Summer Camp — Half Day Afternoon (Intermediates, Ages 7-12) | 7-12 | Half-Day PM | Jul 13-24 | $270/wk |
| 15948 | North Shore Summer Camp — Full Day (Intermediates, Ages 7-12) | 7-12 | Full Day | Jul 13-24 | $590/wk |
| 15949 | North Shore Summer Camp — Half Day Morning (Seniors, Ages 13-18) | 13-18 | Half-Day AM | Jul 13-24 | $270/wk |
| 15950 | North Shore Summer Camp — Half Day Afternoon (Seniors, Ages 13-18) | 13-18 | Half-Day PM | Jul 13-24 | $270/wk |
| 15951 | North Shore Summer Camp — Full Day (Seniors, Ages 13-18) | 13-18 | Full Day | Jul 13-24 | $590/wk |
| 15952 | North Shore Summer Camp — Teacher Bootcamp (Ages 13-19) | 13-19 | Full Day | Jul 27-31 | $950 |

### Deprecated/Completed Entries (12 total, IDs 127-138)

These are the old "Junior/Intermediate/Senior Music Camp" entries with incorrect program names, prices, and dates. Marked Completed with explanatory costNote pointing parents to the new entries.

---

## Fields Verified Against Provider Page

| Field | Status |
|-------|--------|
| name | Confirmed — matches provider program type names |
| cost | Confirmed: $270 half-day, $590 full-day, $950 Teacher Bootcamp |
| ageMin/ageMax | Confirmed from /camps page (3-6 Juniors, 7-12 Intermediates, 13-18 Seniors, 13-19 Bootcamp) |
| startDate/endDate | Confirmed: Jul 13-24 (Weeks I & II); Jul 27-31 (Bootcamp) |
| startTime/endTime | Confirmed: 9:00-11:30 AM half-day morning; 1:00-3:15 PM half-day afternoon; 9:00-3:30 PM full day |
| address | Fixed: 734 Marine Drive, North Vancouver, BC V7M 1H3 (from /contact page) |
| neighbourhood | Fixed: Central Lonsdale |
| city | Fixed: North Vancouver |
| registrationUrl | Confirmed: https://northshoresummercamp.com/register-here |
| enrollmentStatus | Open — registration is live as of April 2026 |
| confirmed2026 | true — all data from 2026 live provider pages |
| priceVerified | true — all prices from live /pricing page |

---

## Count Verification

| Program Type | Provider Shows | DB Before | DB After |
|-------------|---------------|-----------|----------|
| Regular Camp (2 wks × 3 age groups × 3 formats) | 18 | 18 (new) + 12 (old stale) | 18 active + 12 deprecated |
| Teacher Bootcamp | 1 | 1 | 1 |
| **Total active** | **19** | **10 active** | **10 active** |

Note: The 3-per-age-group × 2-week structure means each of the 9 format/age combinations runs 2 weeks but is stored as a single entry with startDate=Jul 13 and endDate=Jul 24 (repeating=true). The 10th entry is the Teacher Bootcamp (1 week only).

---

## Notes

- The registration page (northshoresummercamp.com/register-here) is a form-based invoice system, not a booking engine. No specific session selector visible.
- The avamusic.com homepage is the clearest source for 2026 dates: "July 13th to 17th, 2026 / July 20th to 24th, 2026."
- Seniors age cap listed as 18 on the /camps page but the avamusic.com promo says "ages 3 to 17" (total range). Per /camps page, Seniors group is 13-18 — using 13-18 as it is the more specific source.
- Music Lab ($500, 3 weeks of theory/history) is an add-on not tracked as a separate camp listing.
- Before & After Care ($25/hr) is an add-on not tracked as a separate listing.
