# Verification Log — MAB Art Studio

**Date:** 2026-04-05
**Auditor:** Claude
**Registration page:** https://mabstudio.ca/summer-camps (UNREACHABLE — see below)
**Status: INCOMPLETE — website unreachable**

## Summary

**Provider website (mabstudio.ca) was completely unreachable on 2026-04-05.** Both HTTP and HTTPS connections returned "connection refused." The site is either down, moved, or defunct.

Database has **14 programs** across 2 locations (Lonsdale and Lynn Valley in North Vancouver). Live page count: unknown (could not load).

## What Was Attempted

1. Navigated to https://mabstudio.ca — connection refused
2. Navigated to https://mabstudio.ca/summer-camps — connection refused (error page in browser)
3. Attempted WebFetch — ECONNREFUSED
4. curl check: HTTP status 000 (connection failed, no response)

## Action Taken

Since the site is unreachable and enrollment status cannot be confirmed:
- `enrollmentStatus` changed from "Open" → "Likely Coming Soon" for all 14 programs
- `urlVerified` set to false for all 14 programs
- `costNote` updated to note the unreachable site on 2026-04-05

The `confirmed2026: true` and `priceVerified: true` flags were NOT removed — data may have been verified previously and the site may be temporarily down.

## Existing Database Data (unverified)

Two locations, 7 weeks each (Jul 6 – Aug 28, 2026, skipping Aug 3-7):

**Lonsdale location** — 3063 Lonsdale Ave, North Vancouver
**Lynn Valley location** — address in DB

All programs: Ages 5-13, Mon-Fri, 9:00 AM – 4:00 PM, $560.18/week

## Notes for Follow-up

- Re-audit this provider when the website is back online
- Verify if provider has moved, rebranded, or ceased operations
- The $560.18 price is an unusual amount (may be after tax — verify exact pricing)
- R46 violations (age range 5-13, 8-year span) remain unresolvable until live page can be checked for age band breakdowns
- Consider checking social media (Instagram, Facebook) for current status
