# Verification Log — The Cut Fashion Academy (listed as "The Cut Design Academy")

**Audited:** 2026-04-06
**Queue entry:** Rank 186
**Source URLs verified (browser navigation):**
- `https://www.thecutfashionacademy.com/youth-camps` (overview — 4 program types confirmed)
- `https://www.thecutfashionacademy.com/part-time-classes/youth-summer-fashion-camp` (fashion camp — all 7 dates, price, age, time confirmed)
- `https://www.thecutfashionacademy.com/part-time-classes/glam-youth-makeup-camp-summer` (makeup camp — 4 sessions confirmed, 2-day structure confirmed)
- `https://www.thecutfashionacademy.com/part-time-classes/youth-art` (art camp — Thursdays, $295/month confirmed)
- `https://www.thecutfashionacademy.com/part-time-classes/youth-sewing-camp` (sewing camp — Wednesdays, $295/month confirmed)
**DB count before audit:** 16,210 programs
**DB count after audit:** 16,218 (8 added, 4 corrected)

---

## Summary

Provider name was "The Cut Design Academy" in DB — corrected to "The Cut Fashion Academy" (website domain and title). Four existing entries had wrong start/end times (9am-4pm → 10am-3pm), wrong ageMax (14 → 16). Makeup camp entries had completely wrong date structure — they're 2-day sessions (Mon & Tue only), not full weeks. Only 2 of 7 fashion camp sessions were in DB; 5 more added. Only 2 of 4 makeup camp sessions were in DB (with wrong dates); 2 more added. Two brand-new after-school programs discovered: Art Camp (Thu) and Sewing Camp (Wed), each $295/month.

---

## Confirmed Program Details

| Field | Value |
|-------|-------|
| Address | 1888 West 1st Ave, Vancouver, BC (Kitsilano) |
| Coordinates | 49.271, -123.147 |
| Neighbourhood | Kitsilano |
| Registration system | Squarespace (thecutfashionacademy.com) |

---

## Youth Fashion Design Camp — $650/week

- **Times:** 10:00 AM – 3:00 PM Mon–Fri (DB had 9AM-4PM — WRONG)
- **Ages:** 8–16 (DB had 8–14 — WRONG)
- **Class size:** 10 students max

| Session | DB ID | Status |
|---------|-------|--------|
| Mar 16–20 (Spring Break) | — | Completed (past, not added) |
| Jun 29–Jul 3 | 16160 (**NEW**) | Open |
| Jul 6–10 | 67 (corrected) | Open |
| Jul 13–17 | 68 (corrected) | Open |
| Jul 20–24 | 16161 (**NEW**) | Open |
| Jul 27–31 | 16162 (**NEW**) | Open |
| Aug 17–21 | 16163 (**NEW**) | Open |

Note: Jun 29–Jul 3 week contains Canada Day (Jul 1, Wednesday). Camp may adjust schedule; confirmed with note in costNote.

---

## Summer Glam Youth Makeup Camp — $295 per 2-day session

**CRITICAL ERROR IN DB:** This is a 2-day session (Mon & Tue), NOT a full week. Existing entries had full Mon-Fri date ranges.

- **Times:** 10:00 AM – 3:00 PM Mon & Tue only (DB had 9AM-4PM full week — WRONG)
- **Ages:** 8–16 (DB had 8–14 — WRONG)
- **Class size:** 12 students max

| Session | DB ID | Old dates | Corrected dates |
|---------|-------|-----------|-----------------|
| Jul 6–7 (Mon & Tue) | 16164 (**NEW**) | — | 2026-07-06 to 2026-07-07 |
| Jul 13–14 (Mon & Tue) | 16165 (**NEW**) | — | 2026-07-13 to 2026-07-14 |
| Jul 20–21 (Mon & Tue) | 69 (corrected) | Jul 20–24 (full week) | 2026-07-20 to 2026-07-21 |
| Jul 27–28 (Mon & Tue) | 70 (corrected) | Jul 27–31 (full week) | 2026-07-27 to 2026-07-28 |

Note: Site dropdown shows "July 12th & 14th 2026" for session 2. Jul 12 is a Sunday; confirmed as Mon Jul 13 & Tue Jul 14.

---

## Youth After School Art Camp — $295/month (NEW)

- **Day:** Thursdays (once a week, 4 sessions = 1 month)
- **Time:** 4:00 PM – 6:00 PM
- **Ages:** 8–14
- **Class size:** 16 students max
- **Available months:** April, May, June, September, October, November 2026
- **DB ID:** 16166

---

## Youth After School Sewing Camp — $295/month (NEW)

- **Day:** Wednesdays (once a week, 4 sessions = 1 month)
- **Time:** 4:00 PM – 6:00 PM
- **Ages:** 8–14
- **Class size:** 16 students max
- **Available months:** April, May, June, September, October, November 2026
- **DB ID:** 16167

---

## Fixes Applied to Existing Entries

| Field | Old | New | Affected IDs |
|-------|-----|-----|-------------|
| provider | "The Cut Design Academy" | "The Cut Fashion Academy" | 67, 68, 69, 70 |
| startTime | 9:00 AM | 10:00 AM | 67, 68, 69, 70 |
| endTime | 4:00 PM | 3:00 PM | 67, 68, 69, 70 |
| ageMax | 14 | 16 | 67, 68, 69, 70 |
| durationPerDay | 7 | 5 | 67, 68, 69, 70 |
| registrationUrl | generic /youth-camps | specific program page | 67, 68, 69, 70 |
| costNote | missing | Added with details | 67, 68, 69, 70 |
| ageSpanJustified | missing | Added | 67, 68, 69, 70 |
| startDate | 2026-07-20 | 2026-07-20 | 69 (unchanged, 2-day Mon) |
| endDate | 2026-07-24 | 2026-07-21 | 69 |
| startDate | 2026-07-27 | 2026-07-27 | 70 (unchanged) |
| endDate | 2026-07-31 | 2026-07-28 | 70 |
| days | Mon-Fri | Mon,Tue | 69, 70 |

---

## Notes

- The website domain and title say "The Cut Fashion Academy" — the provider name "The Cut Design Academy" was incorrect in our DB
- Summer makeup camp is fundamentally different from what was in DB: 2-day sessions, not 5-day weeks
- After-school programs (art + sewing) were completely missing from DB; discovered on youth-camps overview page
- The spring break fashion camp (Mar 16–20) and spring makeup camp (Mar 5–6) are past and were not added since they are Completed with no parent action possible
