# Verification Log — City of Langley

**Date:** 2026-04-04
**Auditor:** Claude (automated)
**Registration portal:** https://anc.ca.apm.activecommunities.com/langleycityrecconnect/
**Day camps info:** https://www.langleycity.ca/parks-recreation/activities-registration/daycamps

---

## Summary

Summer 2026 registration not yet open. Information available April 24, enrollment opens April 29, 2026.

Database has 91 programs, all incorrectly marked "Full/Waitlist". Fixed statuses and URLs.

Changes: 0 added / 91 url fixed / summer programs → Coming Soon with registrationDate 2026-04-29 / fixed bad endDate on LGY-129.

---

## Key Finding: Registration Opens April 29, 2026

- **Information available:** April 24, 2026
- **Enrollment opens:** April 29, 2026
- **Re-audit recommended:** After April 29 to verify actual program listings

---

## Fixes Applied

### 1. URL fields updated
All programs with generic search URL updated to use specific `registrationUrl` detail links.

### 2. Enrollment status corrected
Summer/Coming Soon programs: "Full/Waitlist" → "Coming Soon" with `registrationDate: "2026-04-29"`

### 3. Bad endDate fixed
- LGY-129: `endDate: "2015-11-02"` → `"2026-03-20"` (Spring Break 2026)

---

## Summer 2026 Programs (from langleycity.ca)

All camps run 8:30 AM–3:00 PM unless noted. Primary location: **Timms Community Centre, 20399 Douglas Crescent, Langley, BC**

| Program | Ages | Cost (5-day/4-day) | Location |
|---------|------|-------------------|----------|
| Funtastic Adventures Day Camp | 5-7, 8-12 | $250/$200 | Timms CC |
| Sports & Swim Camp | 8-12 | $225/$180 | City Park / Al Anderson Pool, 4949 207 St |
| Nicomekl Adventure Day Camp | 5-12 | $225/$180 | Nicomekl Elementary, 20050 53 Ave |
| Preschool Summer Camp | 3-5 | $150/$120 | Timms CC, AM or PM half-day |
| Girls Only Camp | 11-15 | $50/week (subsidized) | HD Stafford |

**Note:** These 5 specific camp types do not appear to be in the current database — the existing 91 programs are primarily fitness/drop-in/youth activities. Consider adding these 5 summer day camp types after April 29 when registration opens.

## Rule 24 Compliance
Uses `anc.ca.apm.activecommunities.com/langleycityrecconnect/` — activecommunities.com is allowed.
