# Verification Log — City of Vancouver - Hillcrest Aquatic Centre + Hillcrest Rink

**Audited:** 2026-04-06
**HAC URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=39&min_age=0&max_age=17&activity_keyword=camp&viewMode=list
**Hillcrest Rink URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?activity_keyword=swim+and+skate+camp&viewMode=list
**center_id (HAC):** 39
**center_id (Hillcrest Rink):** unknown (programs registered under separate ActiveNet facility)
**DB count before audit:** 15,876 programs
**DB count after audit:** 15,884 (+8 programs added)

---

## Summary

**Hillcrest Aquatic Centre (center_id=39):**
19 programs already in DB — matches the expected count from the queue (listings: 19). No gaps found. Programs include swim lessons, lap swim sessions, and aquafit. All confirmed in DB with correct IDs.

**Hillcrest Rink (separate ActiveNet facility):**
8 Swim and Skate Camp programs (Wk 1–8, summer 2026) were entirely missing from the DB. These combine morning skating at Hillcrest Rink with afternoon recreational swimming at Hillcrest Pool. All 8 weeks added.

**Dual-ID formula confirmed for Swim and Skate Camp programs:**
- display ID − 2922 = URL ID
- Verified: display #617696 → URL 614774 (617696 − 2922 = 614774) ✓

**BC Day (Aug 3, Mon 2026):** Wk 5 (Aug 4–7) runs Tue–Fri (4 days), $180.44 vs $225.55 for 5-day weeks.

**Fees verified via ActiveNet REST API:**
- Endpoint: `https://anc.ca.apm.activecommunities.com/vancouver/rest/activity/detail/estimateprice/{urlId}?locale=en-US`
- 5-day week: $225.55 standard charge
- 4-day BC Day week: $180.44 standard charge
- 50% Leisure Access discount available for both (not included in our cost field — standard charge is the listed price)

---

## Programs Added (8 total)

### Swim and Skate Camp — All 8 Weeks

| ID | Week | Dates | Days | Cost |
|----|------|-------|------|------|
| COV-614774 | Wk 1 | Jul 6–10, 2026 | Mon–Fri | $225.55 |
| COV-614775 | Wk 2 | Jul 13–17, 2026 | Mon–Fri | $225.55 |
| COV-614776 | Wk 3 | Jul 20–24, 2026 | Mon–Fri | $225.55 |
| COV-614777 | Wk 4 | Jul 27–31, 2026 | Mon–Fri | $225.55 |
| COV-614778 | Wk 5 | Aug 4–7, 2026 | Tue–Fri (BC Day off) | $180.44 |
| COV-614779 | Wk 6 | Aug 10–14, 2026 | Mon–Fri | $225.55 |
| COV-614780 | Wk 7 | Aug 17–21, 2026 | Mon–Fri | $225.55 |
| COV-614781 | Wk 8 | Aug 24–28, 2026 | Mon–Fri | $225.55 |

**All weeks:**
- Ages: 8–13 yrs (ActiveNet: "at least 8 yrs but less than 14 yrs")
- Time: 9:30 AM – 4:00 PM (6.5 hours → Full Day)
- Location: Hillcrest Rink (4575 Clancy Loranger Way, Vancouver, BC)
- Registration: April 8, 2026 at 7:00 PM
- Instructor: Sukh Brach (Skating); Rink Activity Admin - JC City-Wide Rink Services
- Display IDs: #617696–#617703 (display − 2922 = URL ID)

---

## Programs Already in DB (HAC, center_id=39)

| Category | Count | DB Coverage |
|----------|-------|-------------|
| Swim lessons (Spring 2026) | 15 | COV-* ✓ |
| Year-Round swim/aquafit | 2 | COV-* ✓ |
| Summer swim camps | 2 | COV-* ✓ |
| **Total HAC** | **19** | All confirmed ✓ |

---

## Gap Analysis

| Category | Live Count | Added | Notes |
|----------|-----------|-------|-------|
| HAC (center_id=39) programs | 19 | 0 | All already in DB ✓ |
| Swim and Skate Camp (Hillcrest Rink) | 8 | 8 | Entire program family missing |

---

## Notes

- HAC (center_id=39) DB coverage is complete — 19/19 programs verified
- Swim and Skate Camp programs are listed under "Hillcrest Rink" in ActiveNet, not HAC
- Fee verified via REST API (not fee modal — modal requires JavaScript click): `/rest/activity/detail/estimateprice/{id}`
- BC Day week ratio: $180.44 / $225.55 = 80% ≈ 4/5 days ✓ (confirms proportional pricing)
- Canada Day (Jul 1, Wed): No Swim and Skate Camp in Canada Day week; Wk 1 starts Jul 6
- Existing Hillcrest Rink programs in DB (59 total): mostly public skate sessions and hockey programs
