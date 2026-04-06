# Verification Log — Burnaby Winter Club

**Audited:** 2026-04-06
**Website:** https://www.burnabywinterclub.com
**DB count before audit:** 28 programs
**DB count after audit:** 28 programs (no changes)

---

## Summary

BWC uses the SportsEngine/sportngin.com platform for their website. The site has no dedicated
summer skills camps page in its navigation as of April 6, 2026.

Navigation structure:
- Home (About Us, News, Gym Project, Golf Tournament Photos, NHL Rink Upgrade)
- Minor Hockey (Rascals, Initiation, U11 Atom, Bantam, Tournaments)
- Academy (Teams) — contains only the April 9–12, 2026 ID Camp (TeamSnap registration)
- Service Providers, Calendar, NHL Rink Upgrade, Dibs

**Summer 2026 skills camps are not yet posted** on the website as of April 6, 2026.
The 20 existing "Likely Coming Soon" programs (ACT-0443 through ACT-0730) are correct.

Individual camp registration uses TeamSnap forms (e.g., ID Camp uses
`https://registration.teamsnap.com/form/43548`). Summer camp TeamSnap forms are not yet live.

bwchockey.com redirects to burnabywinterclub.com — same site.

---

## Findings

### Spring Break 2026 camps (8 programs) — Completed
ACT-0179, ACT-0180, ACT-0185, ACT-0187, ACT-0191, ACT-0192, ACT-0196, ACT-0197

All correctly marked "Completed". Dates were March 24–26, 2026. No changes needed.

### Summer 2026 skills camps (20 programs) — Likely Coming Soon
ACT-0443, ACT-0444, ACT-0570, ACT-0573, ACT-0600, ACT-0616, ACT-0627, ACT-0628,
ACT-0690, ACT-0719, ACT-0721, ACT-0722, ACT-0723, ACT-0724, ACT-0725, ACT-0726,
ACT-0727, ACT-0728, ACT-0729, ACT-0730

Programs: Defenseman Camp, Dynamic Skating & Puck Skills, Prep Camp, Small Area Games &
Battle Camp, Passing & Shooting Camp, Creating Offense Camp — for U11/U13 (Group A) and
U15/U18 (Group B), each with separate skater and goaltender groups.

All have `registrationUrl: 'https://www.burnabywinterclub.com'` (generic homepage). This
is a pre-existing issue — no specific summer camp registration page exists on the site yet.
Cannot resolve until BWC posts summer 2026 registration forms (expected spring/summer 2026).

---

## Gap Analysis

| Category | Count | Action |
|----------|-------|--------|
| Summer skills camps (Group A/B, Skater/Goalie) | 20 | In DB as "Likely Coming Soon" — correct |
| Spring break camps | 8 | In DB as "Completed" — correct |
| Academy ID Camp (Apr 9–12, 2026) | 1 | Out of scope (elite tryout, not general youth camp) |
| New programs to add | 0 | None posted for summer 2026 |

---

## Notes

- BWC does not appear to have a standalone summer camps page; camps are posted ad-hoc with
  TeamSnap registration forms when registration opens
- Re-audit recommended when summer 2026 skills camp registration opens (likely May–June 2026)
- All `registrationUrl` fields remain as homepage — will need updating when specific camp
  pages are published
- The `url` field for all BWC programs already points to the homepage which is the most
  specific available URL
