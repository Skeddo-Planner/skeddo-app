# Verification Log — Petit Architect

**Date:** 2026-04-04
**Auditor:** Claude (automated)
**Registration page:** https://petitarchitect.com/all-programs | https://petitarchitect.com/summer-camps

---

## Summary

Provider shows 46+ programs across studio + 7+ community centre locations. Database had 46 programs — count matches. Main issue: **`url` field was `undefined` on all 46 programs** (registrationUrl was correct but url was missing). Fixed.

Changes made: 0 added / 46 url fixed / 1 status fixed (spring camp → Completed).

---

## Issues Found and Fixed

### 1. Missing `url` field (all 46 programs)
All Petit Architect programs had `url: undefined`. Fixed by mapping each to the appropriate URL:
- **Weekend/weekday classes** (ACT-0234, -0237, -0239, -0244, -0246, -0247, -0252): → `https://petitarchitect.com/all-programs`
- **Pro D Day** (ACT-0255): → `https://petitarchitect.com/pro-d-days`
- **Spring break camp** (ACT-0169): → `https://petitarchitect.com/spring-camps`
- **Studio summer camps** (ACT-0371, -0421, -0488, etc.): → `https://petitarchitect.com/summer-camps`
- **VCC summer camps** (pa-hillcrest-*, pa-killarney-*, pa-troutlake-*): → their specific `anc.ca.apm.activecommunities.com` registration URLs

### 2. Spring camp status (ACT-0169)
- **Before:** `enrollmentStatus: "Closed"`
- **After:** `enrollmentStatus: "Completed"` — camp ran March 23-27, 2026 (past date)

---

## Program Verification (live page cross-check)

### Studio Location — St. Mary's Church, 2490 W 37th Ave, Vancouver (Kerrisdale)

| Program | Days | Time | Cost | Dates | DB Status | Live Status |
|---------|------|------|------|-------|-----------|-------------|
| Tiny Architects (Saturdays) | Sat | 10-11 AM | $240 | Apr 11 – Jun 6 | Open | ✅ Open |
| Design & Architecture for Kids (Saturdays) | Sat | 11:15 AM–12:30 PM | $240 | Apr 11 – Jun 6 | Open | ✅ Open |
| Advanced Architecture for Kids (Saturdays) | Sat | 1-2:15 PM | $240 | Apr 11 – Jun 6 | Open | ✅ Open |
| Design Thinkers & Makers (Sundays) | Sun | 11:30 AM–1 PM | $264 | Apr 12 – Jun 7 | Open | ✅ Open |
| Tiny Architects (Sundays AM) | Sun | 10-11 AM | $240 | Apr 12 – Jun 7 | Open | ✅ Open |
| Tiny Architects (Sundays PM) | Sun | 1:30-2:30 PM | $240 | Apr 12 – Jun 7 | Open | ✅ Open |
| Tiny Architects (Thursdays) | Thu | 4:15-5:15 PM | $240 | Apr 16 – Jun 4 | Open | ✅ Open |
| PRO D: Design a Playground | Single days | Full day | $115 | Apr 20, Hillcrest/Studio | Open | ✅ Open |
| WEEK 1: Architecture Around the World | Mon-Fri | 9:15 AM–3 PM | $375 | Jun 29–Jul 3 | Open | ✅ Open (4-day week) |
| WEEK 2: Dream House Architecture Camp | Mon-Fri | 9:15 AM–3 PM | $490 | Jul 6-10 | Open | ✅ Open |
| WEEK 3: Happy City Architecture Camp | Mon-Fri | 9:15 AM–3 PM | $450 | Jul 13-17 | Open | ✅ Open |
| WEEK 4: Beautiful Boutiques Architecture Camp | Mon-Fri | 9:15 AM–3 PM | $450 | Jul 20-24 | Open | ✅ Open |
| WEEK 5: Dream House Architecture Camp | Mon-Fri | 9:15 AM–3 PM | $490 | Jul 27-31 | Open | ✅ Open |
| WEEK 6: Architecture Around the World Camp | Mon-Fri | 9:15 AM–3 PM | $375 | Aug 4-7 | Open | ✅ Open (4-day week) |
| WEEK 7: Dream House Architecture Camp | Mon-Fri | 9:15 AM–3 PM | $490 | Aug 10-14 | Open | ✅ Open |

**Note:** Database also contains WEEK 8 (Aug 17), WEEK 9 (Aug 24), WEEK 10 (Aug 31) at studio — research indicates sessions end Aug 14. These may be outdated or unconfirmed. Retained with Open status pending further verification.

### VCC Locations
- Hillcrest CC (4575 Clancy Loranger Way): 9 sessions — Full/Waitlist per DB. Confirmed on activecommunities.com.
- Killarney CC (6260 Killarney Street): 4 sessions — Full/Waitlist.
- Trout Lake CC (3360 Victoria Drive): 5 sessions — mix of Full/Waitlist and Coming Soon.
- Marpole-Oakridge CC (990 West 59th Ave): 2 sessions — Coming Soon.
- Roundhouse CC (181 Roundhouse Mews): 2 sessions — Coming Soon.
- Coal Harbour CC (480 Broughton Street): 1 session — Coming Soon.
- Richmond Cultural Centre (7700 Minoru Gate): 4 sessions — Coming Soon.

---

## Notes
- Saturday/Sunday classes: confirmed at studio and Richmond
- Age ranges verified: 4-6 (Tiny Architects), 7-12 (most camps), 13+ (Design Thinkers)
- Pricing verified from petitarchitect.com/summer-camps
