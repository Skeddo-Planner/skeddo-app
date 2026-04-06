# Verification Log — YMCA of Greater Vancouver (Kids Clubs)

**Audited:** 2026-04-06
**Registration page:** https://www.gv.ymca.ca/summer-day-camps-information
**ActiveNet portal:** https://anc.ca.apm.activecommunities.com/ygv/activity/search
**DB count before audit:** 18 Kids Club programs (+ 8 Elphinstone, 4 swim = 30 total YMCA)
**DB count after audit:** 18 Kids Club programs (fixes only, no new programs added)

---

## Summary

All 18 YMCA GV Kids Club summer day camp programs were already in the DB (ymca-dc-* IDs). Audit focused on correcting critical cost errors and adding missing fields verified from the 2026 summer camps page.

**Critical issue found:** All 18 Kids Club records had `cost: 50`, but only 3 locations are approved BC $10/day child care centres ($50/week). The remaining 15 locations charge $284/week (Vancouver/Burnaby) or $298/week (Coquitlam/Richmond/Surrey). This was a systemic error affecting 15 programs.

**Dual-ID pattern confirmed (ygv):** Display ID − 5340 = URL ID. Example: Anderson Wk 1 display #31762 → URL ID 26422.

**Summer 2026 dates confirmed:** Jul 2 – Aug 28, 2026. Week 1 (Jul 2-3) is a 2-day partial week. Registration opened Mar 8, 2026.

---

## Cost Corrections (18 programs)

### $10/day Approved BC Child Care Centres — $50/week CORRECT (3 locations)

These 3 locations are approved $10/day child care centres under BC's child care subsidy program. The existing cost=50 was correct; only costNote and url/dates were missing.

| ID | Location | City | Cost (per 5-day wk) |
|----|----------|------|---------------------|
| ymca-dc-cascade | Cascade Heights | Burnaby | $50 ✓ |
| ymca-dc-osler | Osler | Vancouver | $50 ✓ |
| ymca-dc-donna | Donna Gabriel Robins | Langley | $50 ✓ |

### $284/week Locations — Cost CORRECTED from $50 (10 locations)

| ID | Location | City | Old Cost | New Cost |
|----|----------|------|----------|----------|
| ymca-dc-stoney | Stoney Creek | Burnaby | $50 | $284 |
| ymca-dc-douglas | Douglas Park | Vancouver | $50 | $284 |
| ymca-dc-fleming | Fleming | Vancouver | $50 | $284 |
| ymca-dc-jamieson | Jamieson | Vancouver | $50 | $284 |
| ymca-dc-jules | Jules | Vancouver | $50 | $284 |
| ymca-dc-mtpleasant | Mt. Pleasant | Vancouver | $50 | $284 |
| ymca-dc-roberts | Roberts | Vancouver | $50 | $284 |
| ymca-dc-rupert | Rupert | Vancouver | $50 | $284 |
| ymca-dc-vanhorne | Van Horne | Vancouver | $50 | $284 |
| ymca-dc-weir | Weir | Vancouver | $50 | $284 |

### $298/week Locations — Cost CORRECTED from $50 (5 locations)

| ID | Location | City | Old Cost | New Cost |
|----|----------|------|----------|----------|
| ymca-dc-coast | Coquitlam Coast | Coquitlam | $50 | $298 |
| ymca-dc-anderson | Anderson | Richmond | $50 | $298 |
| ymca-dc-sprouts | Sprouts | Richmond | $50 | $298 |
| ymca-dc-jessie | Jessie Wowk | Surrey | $50 | $298 |
| ymca-dc-tonglouie | Tong Louie | Surrey | $50 | $298 |

---

## Other Fields Added/Updated (all 18 programs)

| Field | Value Added |
|-------|------------|
| `url` | `https://www.gv.ymca.ca/summer-day-camps-information` |
| `startDate` | `2026-07-02` |
| `endDate` | `2026-08-28` |
| `costNote` | Location-specific text with week 1 partial-week note and subsidy info |
| `priceVerified` | `true` (cost confirmed from gv.ymca.ca/summer-day-camps-information) |

---

## Programs NOT Added / Out of Scope

| Category | Count | Reason |
|----------|-------|--------|
| Kids Club Weeks 2–9 per location | 144 | Week 1 in DB is representative; individual weekly slots not yet added |
| Camp Elphinstone (8 programs) | 8 | Different booking system (possibly CampBrain); left as-is |
| YMCA swim lessons (4 programs) | 4 | Membership-based, no public open registration |
| YMCA adult programs | — | Out of age scope (0–17) |

---

## Source Verification

- **Cost data source:** `https://www.gv.ymca.ca/summer-day-camps-information` — confirmed 2026 pricing table showing $50/wk ($10/day centres), $284/wk (Vancouver/Burnaby standard), $298/wk (Coquitlam/Richmond/Surrey standard)
- **Date data source:** Same page — confirmed "July 2 – August 28, 2026. Registration opened March 8, 2026."
- **URL verification:** ActiveNet ygv portal confirmed showing 2026 Kids Club programs; Anderson Wk 1 (#31762 / URL ID 26422) verified as Summer 2026 Day Camp
- **$10/day centre status:** Confirmed from page text identifying Cascade Heights, Osler, and Donna Gabriel Robins as approved BC child care centres at $10/day rate

---

## Notes

- 50% Leisure Access subsidy available at $50/week locations (mentioned on gv.ymca.ca)
- Financial assistance info available at gv.ymca.ca for all locations
- Week 1 (Jul 2-3) is a 2-day partial week due to Canada Day; $20 for $10/day centres, pro-rated for others
- The ygv ActiveNet portal offset: display ID − 5340 = URL ID
