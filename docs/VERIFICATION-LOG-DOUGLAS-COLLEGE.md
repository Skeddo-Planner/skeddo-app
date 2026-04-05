# Verification Log — Douglas College

**Date:** 2026-04-04
**Auditor:** Claude (automated audit agent)
**Registration page:** https://www.douglascollege.ca/programs-and-courses/continuing-education/sports-institute/youth-camps-and-programs/summer-camps

---

## Summary

- 2026 summer camp schedule NOT YET PUBLISHED as of 2026-04-04
- Live page states: "Check back in May 2026 for our 2026 Summer camps schedule"
- Database correctly has all 36 entries marked as `enrollmentStatus: "Likely Coming Soon"`, `confirmed2026: false`, `priceVerified: false`
- No data changes made — current DB state is accurate
- Provider page still shows 2025 schedule for reference

---

## 2025 Price Reference (for comparison when 2026 launches)

From live page 2025 data:
- Full week (5-day): **$160** (most camps)
- Full-day camps (e.g., Junior Artists & Writers): **$260** (two half-days = all day)
- 4-day week (BC Day): **$130** for regular, **$205** for full-day
- 3-day week (July 1 holiday): **$95** for regular, **$150** for full-day

These match the DB cost values ($160 for most, $260 for combined camps).

---

## Program Types on Live Page (2025) vs DB Coverage

### Programs in DB (36 records)
All programs at both Coquitlam and New Westminster campuses:
- Acting for the Camera, Badminton, Beach Volleyball, Cartooning, Coding, Creative Writing, Dance, Drama & Improv, Junior Basketball, Junior Soccer, Mathletes, Multisport, Racquet Sports, Sports & Computers Combo, Student Leadership, Videogame Design, Youth Basketball, Youth Soccer

### Programs on 2025 Live Page NOT Currently in DB
The 2025 schedule includes several program types not represented in our DB. These would need to be added when 2026 schedule is published:
- K-Pop & Hip-Hop (Junior 6-9 and Youth 10-14)
- Table Tennis (Junior 6-9 and Youth 10-14)
- Phone Photography (10-14)
- Junior Actors & Artists (6-9)
- Developing Apps (10-14)
- JavaScript & Playful Programming (10-14)
- Coding & Computer Design (10-14) — different from "Coding Camp"
- Junior Multisports & Activities (6-9)
- Youth Multisport (10-14)
- Junior Outdoor Soccer (6-9) — listed separately from Youth Soccer
- Youth Volleyball (10-14)
- DigiArt (10-14)

---

## Location Details

| Campus | Address |
|---|---|
| New Westminster Campus | 700 Royal Ave, New Westminster, BC V3M 5Z5 |
| Coquitlam Campus | 1250 Pinetree Way, Coquitlam, BC V3B 7X3 |
| Coquitlam/Pinetree Community Centre | Pinetree Community Centre (basketball/sports) |
| Coquitlam/Town Centre Park | Town Centre Park (outdoor sports) |
| New Westminster/Mercer Stadium | Mercer Stadium (outdoor soccer) |
| New Westminster/Moody Park | Moody Park (outdoor sports) |

---

## Changes Made

None — all 36 DB entries are correctly marked `"Likely Coming Soon"` with `confirmed2026: false`. Current state accurately reflects that 2026 schedule is not yet published. Re-audit recommended after May 2026 when schedule is posted.

---

## Count

- Live page (2025 data): 100+ individual camp sessions across multiple weeks
- DB: 36 programs (18 unique types × 2 campuses)
- Status: Accurate — all marked Likely Coming Soon pending 2026 schedule

---

## Action Required (Future)

When 2026 schedule is published (expected May 2026):
1. Re-run audit to capture actual dates, exact prices, enrollment status
2. Add missing program types from 2025 (K-Pop/Hip-Hop, Table Tennis, Phone Photography, etc.)
3. Update `confirmed2026: true` and `priceVerified: true` for all verified entries
