# Verification Log — Phoenix Gymnastics (Vancouver Phoenix Gymnastics)

**Audited:** 2026-04-06
**Queue entry:** Rank 154
**Source URLs verified:**
- `https://phoenixgymnastics.uplifterinc.com/pages/Recreational/camps/summer/` (registration system)
- `https://www.vpgymnastics.com` (main site)
**Address:** Millennium Sport Facility / Tree House Gym, 4588 Clancy Loranger Way, Vancouver, BC V5Y 4B6
**DB count before audit:** 16,128 programs
**DB count after audit:** 16,128 (no adds — 7 entries corrected)

---

## Summary

**2026 summer camp schedule has NOT yet been posted** on the Uplifter registration system as of April 6, 2026. The page still shows "Summer 2022 Camps" with no 2026 sessions listed. DB entries set to `Likely Coming Soon` with appropriate notes.

---

## Camp Types Offered (from camps description page)

| Camp | Ages | Type |
|------|------|------|
| Scamper Camp | 3–4 yrs | Half Day (2 hrs/day) |
| Adventure Camp Jr | 5–7 yrs | Half Day |
| Adventure Camp Sr | 8–12 yrs | Half Day |
| Full Day Camp | 5–10 yrs | Full Day |

Provider does offer distinct age-band camps — DB placeholder entries use ageMin=3, ageMax=14 covering all groups until 2026 schedule is posted.

---

## Fixes Applied

| ID | Field | Old | New |
|----|-------|-----|-----|
| 337–342 | enrollmentStatus | Full/Waitlist | Likely Coming Soon |
| 337–342 | ageSpanJustified | (none) | Provider offers distinct age bands (3-4, 5-7, 8-12, 5-10 full day); single placeholder entry until 2026 posted |
| 337–342 | costNote | "Inquire with provider" | Pricing not yet available — 2026 schedule not posted |
| proday-phoenix-gym-1 | ageSpanJustified | (none) | Ages 5-12 is full school-aged range; no sub-bands on Pro-D page |

---

## Notes

- Uplifter registration URL: `https://phoenixgymnastics.uplifterinc.com/pages/Recreational/camps/summer/`
- Contact: 604-737-7693
- Second location: St. James Community Square, 3214 W 10th Ave, Vancouver, BC V6K 2L2
- **Re-audit required** when 2026 summer camp schedule is published on Uplifter
- Previous years: camps typically run Jul–Aug at Clancy Loranger Way facility
