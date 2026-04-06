# Verification Log — City of Vancouver - West End Community Centre

**Audited:** 2026-04-06
**Queue entries:** Rank 116, Rank 129 (same center — center_ids=7)
**Search URL used:**
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=day+camp&center_ids=7&min_age=0&max_age=17&viewMode=list` (45 results)
**Address:** 870 Denman Street, Vancouver, BC (West End)
**DB count before audit:** 16,022 programs
**DB count after audit:** 16,029 (+7 added, 85 field fixes across 38 programs)

---

## Summary

West End CC runs four day camp tiers (Adventures 6-7yr, Discoveries 8-9yr, Voyages 10-12yr,
and After Care add-on) plus Cancelled Before Care for Summer 2026.

All 45 live programs were already represented in the DB, but 38 had significant data errors
introduced by a prior import from the West End CC Association (wecca) data source that used
DISPLAY IDs instead of URL IDs in registrationUrls.

**No genuine missing programs** (all 45 covered by COV-, wecca-, or numeric IDs).

**Programs added (7):** Before Care Wk 1-7 (all Cancelled — consistent with Wk 8-9 already in DB)

**Fixes applied (85 field changes across 38 programs):**
- 28 broken registrationUrls (display IDs → URL IDs)
- 14 age range corrections (Discoveries: 7-8yr→8-9yr; Voyages: 9-12yr→10-12yr)
- 28 name corrections (age bands in names, removed "at West End" suffix)
- 2 season fixes (Year-Round → Summer 2026)
- 2 status fixes (Before Care Wk 8-9: Completed → Cancelled)
- 7 name/format fixes for wecca-aftercare entries

---

## Root Cause: Broken URLs

The West End CC Association (wecca) import used **display IDs** in `registrationUrl` instead
of **URL IDs**. ActiveNet's `/search/detail/{id}` route uses URL IDs, not display IDs.

Formula: `url_id = display_id - 2922` (confirmed for all Vancouver programs)

Example:
- wecca-aftercare-w5 had `/detail/602548` → loaded Piano Lessons at Douglas Park (wrong!)
- Correct URL: `/detail/599626` → loads "Day Camp - After Care (6-12 yrs) - Week 5" ✓

Additionally, wecca-voy-w8 had wrong display ID 602600 (not 602587); correct url_id = 599665.

---

## Fee Verification (via REST estimateprice API)

`https://anc.ca.apm.activecommunities.com/vancouver/rest/activity/detail/estimateprice/{urlId}?locale=en-US`

| Program | 5-day fee | Canada Day 4-day | BC Day 4-day | Verified |
|---------|-----------|-----------------|--------------|---------|
| Adventures (6-7yr) | $180 | $144 | $144 | 599640=$144, 599641=$180 |
| Discoveries (8-9yr) | $180 | $144 | — | 599649=$144 |
| Voyages (10-12yr) | $180 | $144 | $144 | 599658=$144, 599659=$180 |
| After Care | ~$50/$40 | — | — | API shows no online price — kept existing values |
| Before Care | Cancelled | — | — | N/A |

**50% Leisure Access discount available on all programs.**

---

## Day Camp Programs (45 live, all in DB)

### After Care (6-12yr) — Wk 1-9 (URL IDs 599622-599630)
Times: 3:30 PM – 5:30 PM

| ID | Week | Status |
|----|------|--------|
| COV-599622 | Wk 1 (Jun 29–Jul 3) | In DB — fixed season Year-Round→Summer 2026 |
| COV-599623 | Wk 2 (Jul 6–10) | In DB ✓ |
| COV-599624 | Wk 3 (Jul 13–17) | In DB ✓ |
| COV-599625 | Wk 4 (Jul 20–24) | In DB ✓ |
| wecca-aftercare-w5 (→599626) | Wk 5 (Jul 27–31) | Fixed URL + name |
| wecca-aftercare-w6 (→599627) | Wk 6 (Aug 4–7) | Fixed URL + name |
| wecca-aftercare-w7 (→599628) | Wk 7 (Aug 10–14) | Fixed URL + name |
| wecca-aftercare-w8 (→599629) | Wk 8 (Aug 17–21) | Fixed URL + name |
| wecca-aftercare-w9 (→599630) | Wk 9 (Aug 24–28) | Fixed URL + name |

### Before Care (6-12yr) — Wk 1-9 (URL IDs 599631-599639) — ALL CANCELLED
Times: 8:00 AM – 9:30 AM

| ID | Week | Status |
|----|------|--------|
| COV-599631 | Wk 1 (Jun 29–Jul 3) | **Added** (Cancelled) |
| COV-599632 | Wk 2 (Jul 6–10) | **Added** (Cancelled) |
| COV-599633 | Wk 3 (Jul 13–17) | **Added** (Cancelled) |
| COV-599634 | Wk 4 (Jul 20–24) | **Added** (Cancelled) |
| COV-599635 | Wk 5 (Jul 27–31) | **Added** (Cancelled) |
| COV-599636 | Wk 6 (Aug 4–7) | **Added** (Cancelled) |
| COV-599637 | Wk 7 (Aug 10–14) | **Added** (Cancelled) |
| 2053 (→599638) | Wk 8 (Aug 17–21) | Fixed: Completed→Cancelled, season fixed |
| 2054 (→599639) | Wk 9 (Aug 24–28) | Fixed: Completed→Cancelled, season fixed |

### Day Camp Adventures (6-7yr) — Wk 1-9 (URL IDs 599640-599648)
Times: 9:00 AM – 3:30 PM | Prices: $144 (4-day), $180 (5-day)

| ID | Week | Status |
|----|------|--------|
| 1918 (→599640) | Wk 1 (Jun 29–Jul 3, $144) | Fixed URL + name |
| 1919 (→599641) | Wk 2 (Jul 6–10, $180) | Fixed URL + name |
| COV-599642 | Wk 3 (Jul 13–17, $180) | In DB ✓ |
| wecca-adv-w4 (→599643) | Wk 4 (Jul 20–24, $180) | Fixed URL + name |
| wecca-adv-w5 (→599644) | Wk 5 (Jul 27–31, $180) | Fixed URL + name |
| wecca-adv-w6 (→599645) | Wk 6 (Aug 4–7, $144 BC Day) | Fixed URL + name |
| wecca-adv-w7 (→599646) | Wk 7 (Aug 10–14, $180) | Fixed URL + name |
| COV-599647 | Wk 8 (Aug 17–21, $180) | In DB ✓ |
| wecca-adv-w9 (→599648) | Wk 9 (Aug 24–28, $180) | Fixed URL + name |

### Day Camp Discoveries (8-9yr) — Wk 1-9 (URL IDs 599649-599657)
Times: 9:00 AM – 3:30 PM | Prices: $144 (4-day), $180 (5-day)
**Age fix:** wecca entries had "7-8yr" → corrected to "8-9yr" (verified API name)

| ID | Week | Status |
|----|------|--------|
| COV-599649 | Wk 1 (Jun 29–Jul 3, $144) | Fixed season Year-Round→Summer 2026 |
| COV-599650 | Wk 2 (Jul 6–10, $180) | In DB ✓ |
| wecca-disc-w3 (→599651) | Wk 3 (Jul 13–17, $180) | Fixed URL + age + name |
| wecca-disc-w4 (→599652) | Wk 4 (Jul 20–24, $180) | Fixed URL + age + name |
| wecca-disc-w5 (→599653) | Wk 5 (Jul 27–31, $180) | Fixed URL + age + name |
| wecca-disc-w6 (→599654) | Wk 6 (Aug 4–7, $144 BC Day) | Fixed URL + age + name |
| wecca-disc-w7 (→599655) | Wk 7 (Aug 10–14, $180) | Fixed URL + age + name |
| wecca-disc-w8 (→599656) | Wk 8 (Aug 17–21, $180) | Fixed URL + age + name |
| wecca-disc-w9 (→599657) | Wk 9 (Aug 24–28, $180) | Fixed URL + age + name |

### Day Camp Voyages (10-12yr) — Wk 1-9 (URL IDs 599658-599666)
Times: 9:00 AM – 3:30 PM | Prices: $144 (4-day), $180 (5-day)
**Age fix:** wecca entries had "9-12yr" → corrected to "10-12yr" (verified API name)

| ID | Week | Status |
|----|------|--------|
| wecca-voy-w1 (→599658) | Wk 1 (Jun 29–Jul 3, $144) | Fixed URL + age + name |
| wecca-voy-w2 (→599659) | Wk 2 (Jul 6–10, $180) | Fixed URL + age + name |
| wecca-voy-w3 (→599660) | Wk 3 (Jul 13–17, $180) | Fixed URL + age + name |
| wecca-voy-w4 (→599661) | Wk 4 (Jul 20–24, $180) | Fixed URL + age + name |
| wecca-voy-w5 (→599662) | Wk 5 (Jul 27–31, $180) | Fixed URL + age + name |
| wecca-voy-w6 (→599663) | Wk 6 (Aug 4–7, $144 BC Day) | Fixed URL + age + name |
| wecca-voy-w7 (→599664) | Wk 7 (Aug 10–14, $180) | Fixed URL + age + name |
| wecca-voy-w8 (→599665) | Wk 8 (Aug 17–21, $180) | Fixed URL (had wrong display 602600) + age + name |
| wecca-voy-w9 (→599666) | Wk 9 (Aug 24–28, $180) | Fixed URL + age + name |

---

## Gap Analysis

| Category | Live | In DB before | Added | Fixed |
|----------|------|-------------|-------|-------|
| After Care Wk 1-9 | 9 | 9 | 0 | 5 (URLs + names) |
| Before Care Wk 1-9 (all Cancelled) | 9 | 2 (Wk 8-9 wrong status) | 7 | 2 (Completed→Cancelled) |
| Adventures Wk 1-9 | 9 | 9 | 0 | 7 (URLs + names) |
| Discoveries Wk 1-9 | 9 | 9 | 0 | 8 (URLs + ages + names) |
| Voyages Wk 1-9 | 9 | 9 | 0 | 9 (URLs + ages + names) |
| **Total** | **45** | **38** | **7** | **31** |

---

## Notes

- Vancouver display ID − 2922 = URL ID (confirmed for all West End programs)
- After Care: display 602544-602552 → URL 599622-599630
- Before Care: display 602553-602561 → URL 599631-599639
- Adventures: display 602562-602570 → URL 599640-599648
- Discoveries: display 602571-602579 → URL 599649-599657
- Voyages: display 602580-602588 → URL 599658-599666
- wecca-voy-w8 had wrong display ID 602600 (not 602587); url_id correctly set to 599665
- Ranks 116 and 129 are duplicate queue entries for same center — both marked completed
- Registration opens: Apr 8, 2026 at 7:00 PM
- Before Care Cancelled for 2026 — no parent action possible
