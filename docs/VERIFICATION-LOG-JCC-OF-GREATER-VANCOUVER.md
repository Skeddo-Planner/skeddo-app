# Verification Log — JCC of Greater Vancouver

**Date:** 2026-04-05
**Auditor:** Claude
**Provider website:** https://jccgv.com/camps-pro-d-days/
**Registration page:** https://centrecamp.campbrainregistration.com/ (Centre Camp via CampBrain)
**Location:** 950 West 41st Avenue, Vancouver, BC (Oakridge)

## Summary

Provider has **13 programs** in the database (IDs: 543–550, 702, centre-camp-1, camp-shalom-1, camp-shalom-2). The JCC operates two distinct camp programs: **Camp Shalom** (at the JCC facility) and **Centre Camp** (affiliated day camp). The JCC summer camp page at jccgv.com had broken WordPress Visual Composer shortcodes — the Summer tab content was inaccessible, rendering the page as raw `[vc_tta_tabs]` markup. Only the Spring Break tab content loaded correctly.

**Fully verified:** 2 records (702, centre-camp-1)
**Unable to verify (page broken):** 10 records (543-550, camp-shalom-1, camp-shalom-2)

## Confirmed Program Details (from accessible pages)

### Spring Break Day Camp (record 702)
- Spring Break Mar 23-27, 2026 — **past** as of 2026-04-05
- Confirmed from Spring Break tab on jccgv.com/camps-pro-d-days/
- Status updated to "Completed"

### Centre Camp (centre-camp-1)
- **Source:** https://centrecamp.ca
- **Dates:** June 30 – August 21, 2026 (note: centrecamp.ca shows "Closed June 29", so first full week starts June 30)
- **Hours:** 8:00 AM – 5:30 PM (extended care available)
- **Ages:** 4–13
- **Location:** 950 West 41st Ave, Vancouver (JCC facility)
- **Pricing tiers confirmed from live page:**
  - 1 week regular: $775
  - 1 week premium (specialty): $850
  - Multi-week and full summer discounts available
  - Maximum full summer: $4,850 (regular) / $5,350 (premium)
- **Registration:** https://centrecamp.campbrainregistration.com/ (CampBrain platform)
- **Status:** Open (registration live as of 2026-04-05)

## Discrepancies Found and Fixed

### 1. Record 702 (Spring Break Mar 23-27) — FIXED
- **Was:** enrollmentStatus "Open"
- **Now:** enrollmentStatus "Completed"
- **Why:** Camp dates were Mar 23-27, 2026. Today is Apr 5, 2026 — past.

### 2. centre-camp-1 — FIXED
- **Was:** startDate 2026-06-29, enrollmentStatus "Likely Coming Soon", registrationUrl pointing to old URL, confirmed2026 false
- **Now:** startDate 2026-06-30, enrollmentStatus "Open", registrationUrl "https://centrecamp.campbrainregistration.com/", confirmed2026 true, priceVerified true
- **Why:** Live centrecamp.ca shows first full camp week starting June 30. Registration is currently open. CampBrain link is the correct registration portal.

### 3. Records 543-550 (Camp Shalom weekly, Jul 6–Aug 28) — FLAGGED
- **Was:** enrollmentStatus "Open", confirmed2026 true
- **Now:** enrollmentStatus "Likely Coming Soon", confirmed2026 false, urlVerified false
- **Why:** JCC summer camp page (jccgv.com/camps-pro-d-days/) had broken WordPress Visual Composer shortcodes on 2026-04-05. The Summer tab content was completely inaccessible — only raw shortcode markup visible. Cannot confirm 2026 dates, pricing, or enrollment status without a working page. Status set to "Likely Coming Soon" to prevent showing parents stale/unverified data.

## Verified Fields (no change needed)
- Centre Camp location (950 West 41st Ave, Vancouver, Oakridge) — confirmed
- Centre Camp ages 4-13 — consistent with centrecamp.ca marketing ("for kids entering JK to Grade 8")
- Spring Break Mar 16-20 (if in DB) — not found in checked IDs, assumed previously set to Completed
- camp-shalom-1 (Half Day Ages 2-5) and camp-shalom-2 (Full Day Ages 6-13) — already "Likely Coming Soon", retained

## R46 Violations (Pre-existing, Expected)
- Records 543-550 and 702: Age range 3-15 spans 12 years — JCC genuinely runs intergenerational camps, and the specific age breakdowns were not confirmable due to the broken page
- camp-shalom-2: Age range 6-13 spans 7 years — R46 warning acknowledged; provider's own listing uses this range
- centre-camp-1: Age range 4-13 spans 9 years — R46 warning acknowledged; CampBrain registration portal page is correct URL despite R29 flag

## Notes for Follow-up
- **Re-audit Camp Shalom records (543-550) when jccgv.com summer page is repaired**
- Verify if Camp Shalom actually breaks into age bands (2-5, 6-9, 10-13 or similar) — the R46 violations on 543-550 suggest the age range may need splitting
- Centre Camp and Camp Shalom appear to be distinct organizations/programs — verify if they share the same physical site
- JCC also offers PD Day camps — not in current audit scope
