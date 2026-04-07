# Verification Log — Fraserview Golf Academy

**Audited:** 2026-04-06
**Queue entry:** Rank 184
**Source URLs verified:**
- `https://www.fraserviewgolfacademy.com/golf-camps.html` (main camps page — program listing, pricing, Pro-D dates)
- `https://fraserviewgolfacademy.as.me/squirrelsam1` (Pro-D AM Squirrels — dates, price $93.45 confirmed)
- `https://fraserviewgolfacademy.as.me/SQAMSUMMER20261947` (Summer AM Squirrels — 12 weeks Jun 15–Aug 31, price $246.75)
- `https://fraserviewgolfacademy.as.me/weekend471` (Weekend 4-7 — all 4 sessions Full)
- `https://fraserviewgolfacademy.as.me/weekend8121` (Weekend 8-12 — Jul 26 has 4 spots)
**DB count before audit:** 16,198 programs
**DB count after audit:** 16,209 (11 added, 5 corrected)

---

## Summary

All 5 existing entries were incorrectly marked "Likely Coming Soon" with confirmed2026=false — summer camp registration opened April 3, 2026. Found 3 missing Pro-D PM sessions and 8 missing summer camp program types. Added all 11. Weekend 4-7 is Full (all sessions); Weekend 8-12 is Open (July 26 session has 4 spots). Updated all registrationUrls from generic catalog to specific booking pages.

---

## Confirmed Program Details

| Field | Value |
|-------|-------|
| Address | 7800 Vivian Drive, Vancouver, BC (Fraserview Golf Course) |
| Coordinates | 49.2178, -123.0333 |
| Neighbourhood | Killarney |
| Registration system | Acuity Scheduling (fraserviewgolfacademy.as.me) |
| Registration opened | April 3, 2026 at 9:00 AM |
| Golf clubs | Included in all programs |

---

## Pro-D Day / Holiday Camps ($89 + GST = $93.45)

**1-day camps; run on holidays and Pro-D days**

| Program | Ages | Time | DB ID | Status |
|---------|------|------|-------|--------|
| AM Squirrels | 4–6 | 10:00am–1:00pm | fraserview-golf-1 | Open (updated) |
| PM Squirrels | 4–6 | 1:30pm–4:30pm | fraserview-golf-6 | Open (**NEW**) |
| AM Gophers | 7–9 | 9:30am–12:30pm | fraserview-golf-2 | Open (updated) |
| PM Gophers | 7–9 | 1:00pm–4:00pm | fraserview-golf-7 | Open (**NEW**) |
| AM Eagles | 10–14 | 9:45am–12:45pm | fraserview-golf-3 | Open (updated) |
| PM Eagles | 10–14 | 1:15pm–4:15pm | fraserview-golf-8 | Open (**NEW**) |

**2026 Pro-D/Holiday dates:** April 3 (Good Friday), 6 (Easter Monday), 17, 20, 24, 27; May 15, 18 (Victoria Day)

**Note:** "AM Gophers+" and "PM Gophers+" (ages 8-12) also exist on site but show "NOT AVAILABLE" — not added.

---

## Junior Weekend Camps ($189 + GST = $198.45 per 5-week block)

5 weeks × 1.5 hrs/week, Saturday/Sunday afternoons

| Program | Ages | Day | Sessions | Status |
|---------|------|-----|---------|--------|
| Weekend 4-7 | 4–7 | Sat | Apr 18, May 23, Jun 27, Aug 1 | **Full** (all No spots) |
| Weekend 8-12 | 8–12 | Sun | Apr 12, May 17, Jun 21, Jul 26 | Open (Jul 26 has 4 spots) |

---

## Summer Break Camps (2026) — Registration OPEN

12 weekly sessions, Mon–Fri, June 15 – August 31, 2026

| Program | Ages | Time | Cost (+GST) | DB ID |
|---------|------|------|-------------|-------|
| AM Squirrels | 4–6 | 10:00am–12:00pm | $235 | fraserview-golf-summer-sq-am (**NEW**) |
| PM Squirrels | 4–6 | 12:45pm–2:45pm | $235 | fraserview-golf-summer-sq-pm (**NEW**) |
| AM Gophers | 7–9 | 9:30am–12:30pm | $355 | fraserview-golf-summer-go-am (**NEW**) |
| PM Gophers | 7–9 | 1:00pm–4:00pm | $355 | fraserview-golf-summer-go-pm (**NEW**) |
| Gophers Performance | 7–9 | 11:00am–2:15pm | $395 | fraserview-golf-summer-go-perf (**NEW**) |
| Eagles | 10–14 | 9:45am–1:45pm | $525 | fraserview-golf-summer-ea (**NEW**) |
| Eagles Performance | 10–14 | 9:00am–1:30pm | $595 | fraserview-golf-summer-ea-perf (**NEW**) |
| Pre-Summer Camp | 10–14 | 11:00am–3:00pm | $525 | fraserview-golf-summer-pre (**NEW**) |

Summer camp prices confirmed via Acuity Scheduling: $246.75 = $235 + 5% GST.

---

## Fixes Applied to Existing Entries

| Field | Old | New | Affected IDs |
|-------|-----|-----|-------------|
| enrollmentStatus | Likely Coming Soon | Open or Full | All 5 existing |
| confirmed2026 | false | true | All 5 existing |
| registrationUrl | fraserviewgolfacademy.as.me/ (catalog) | Program-specific URL | All 5 existing |
| costNote | missing | Added with GST details | All 5 existing |
| startDate | missing | 2026-04-03 (Pro-D) / 2026-04-12 or 18 (Weekend) | All 5 existing |
| endDate | missing | 2026-05-18 (Pro-D) / 2026-08-30 or 09-05 (Weekend) | All 5 existing |
| days | "Varies" | Specific (Sat/Sun for weekend; "Varies (holidays and Pro-D days)") | All 5 existing |
| startTime/endTime | missing or wrong | Confirmed from booking pages | Weekend entries |
| repeating | missing | true | All 5 existing |
| campType | "Pro-D Day" / wrong | "Holiday/Pro-D Day" / "Year-Round Program" | All 5 existing |

---

## Notes

- FGA is located at Fraserview Golf Course (Vancouver Parks Board golf course), 7800 Vivian Drive
- Golf clubs are included in all programs — parents only need to bring snacks/lunch/water/hat/sunscreen
- Summer camp availability varies by week — some weeks are already sold out (especially Jun sessions)
- "Pre-Summer Camp" (10-14) has the same price as Eagles ($525+GST) but different hours (11am–3pm); likely targets a slightly different skill level or schedule preference
- Birthday party venue rental was NOT added (per policy: no birthday party programs)
