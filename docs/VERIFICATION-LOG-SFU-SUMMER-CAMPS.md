# Verification Log — SFU Summer Camps

**Date:** 2026-04-05
**Auditor:** Claude (automated)
**Info Page:** https://www.sfu.ca/camps/camps/summer.html
**Registration Portal:** https://athleticsandrecreation.its.sfu.ca/ (login required)
**Status:** PARTIAL — pricing portal is login-gated, full re-audit required

---

## Summary

| Metric | Value |
|--------|-------|
| Programs on live site | 30+ distinct programs, potentially 100+ weekly sessions |
| Programs in database | 8 (fabricated names, wrong data) |
| Programs fixed | 8 (removed false flags, corrected URLs) |
| Programs added | 0 |

---

## Critical Issues Found

1. **Program names are fabricated**: "Science & Tech Camp" and "Adventure & Sports Camp" do not exist on SFU's website. Actual program names include Science: Chemistry, Science: Engineering, Mountain Madness, Multi Sport, Young Moviemakers, LEGO, Girls Rock, etc.

2. **Prices unverifiable**: Pricing only appears inside the Fusion member portal after login. The $350/$325 figures were incorrect — removed and set to null.

3. **Massively incomplete**: SFU offers 30+ distinct named programs across 5 categories (Recreational, Educational, Sport, Specialty, Youth Varsity). Database had 8 entries for 4 weeks each (July only). SFU camps run June 29 through September 4.

4. **confirmed2026=true and priceVerified=true were incorrect** — removed.

---

## What Was Fixed

All 8 entries (IDs 233-240):
- Set `confirmed2026=false`, `priceVerified=false`, `cost=null`
- Set `enrollmentStatus=Likely Coming Soon`
- Fixed registration URL to SFU camps info page
- Added costNote explaining pricing is portal-only

---

## Full Program Listing (from live site)

**SFU Burnaby Campus, 8888 University Drive, Burnaby**
**All camps:** Mon-Fri 8:30 AM – 3:30 PM (sport camps may be AM or PM half-day)

Categories confirmed:
- Recreational: Girls Rock (7-9), Junior (5-6), Mountain Madness (7-9, 9-11)
- Educational: Leadership L1/L2/L3, ELL Teen, Science Jr/Chemistry/Engineering/STEM (7-12)
- Sport: Multi Sport, Tennis, Volleyball, Soccer, Track & Field, Rugby, Climbing, Racquet Sports
- Specialty: Young Moviemakers (8-13), LEGO Claymation, Artmaking (Gibson Museum), Future Ready Minds, Language Discovery
- Youth Varsity: Basketball, Soccer, Volleyball, Softball, Sports Performance

**Registration portal:** https://athleticsandrecreation.its.sfu.ca
**Contact:** camps@sfu.ca | (778) 782-4965

---

## Recommendation

Full browser-based re-audit required. Log into the Fusion portal to get actual prices per program. Given 30+ programs × multiple weeks each, expect 80-150 database entries for a complete SFU listing. This is a high-priority provider for a future audit session.
