# Verification Log — Young Rembrandts

**Date:** 2026-04-04
**Auditor:** Claude (automated)
**Metro Vancouver registration:** https://www.youngrembrandts.com/metrovancouver/view-classes-enroll/
**Lower Mainland registration:** https://www.youngrembrandts.com/lowermainland/view-classes-enroll/

---

## Summary

Young Rembrandts has TWO franchise territories in the Metro Vancouver area:
1. **Metro Vancouver** — Vancouver, Burnaby, New Westminster
2. **Lower Mainland** — Surrey, Langley, Delta

Database has 38 programs across both franchises. Main fix: `url` field was undefined on all 38 programs.

Changes: 0 added / 38 url fixed.

---

## Key Facts

- **Program type:** After-school drawing classes at elementary schools only
- **No summer camps** (spring 2026 sessions currently open; no summer 2026 listings as of April 4)
- **Age range:** 5-12 years (K-1 Drawing variant for Kindergarten/Grade 1)
- **Curriculum:** Elementary Drawing (main), K-1 Drawing, Cartoon Drawing, Preschool Drawing

---

## Fixes Applied

### URL field updated
All 38 programs had `url: undefined`. Set to match existing `registrationUrl`:
- Lower Mainland programs → `https://www.youngrembrandts.com/lowermainland/view-classes-enroll/`
- Metro Vancouver programs → `https://www.youngrembrandts.com/metrovancouver/view-classes-enroll/`

---

## Spring 2026 Programs Verified (sample)

| School | City | Dates | Day | Time | Cost | Status |
|--------|------|-------|-----|------|------|--------|
| Lord Tweedsmuir Elementary | New Westminster | Apr 17–May 29 | Fri | 3:05-4:15 PM | $103.50 | Open |
| Cameron Elementary | Burnaby | Apr 20–Jun 15 | Mon | 2:50-4:00 PM | $111.00 | Open |
| South Slope Elementary | Burnaby | Apr 20–Jun 15 | Mon | 3:05-4:15 PM | $129.50 | Open |
| Sullivan Elementary | Surrey | Apr 8–Jun 10 | Wed | 2:30-3:30 PM | $210.00 | Open |

---

## Rule 24 Note

Young Rembrandts uses `campscui.active.com` and `activekids.com` as their registration platforms. **activekids.com URLs are banned per Rule 24.** URLs in database correctly point to `youngrembrandts.com` franchise pages, which are the provider's own registration pages.
