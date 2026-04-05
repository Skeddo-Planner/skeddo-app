# Verification Log — UBC Geering Up at Bodwell High School (North Vancouver)

**Date:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Queue Entry:** "Bodwell High School" (rank 90)
**Provider (Corrected):** UBC Geering Up
**Venue:** Bodwell High School, 955 Harbourside Drive, North Vancouver, BC V7P 3S7
**Provider Website:** https://geeringup.apsc.ubc.ca/camps/in-person-camps/offsite-camps/
**Registration Portal:** https://campscui.active.com/orgs/GEERingUp
**Contact:** northvan.geeringup@ubc.ca

---

## Audit Status: COMPLETE — Registration Open

All summer 2026 UBC Geering Up camps at Bodwell High School confirmed. Registration is open.

---

## Critical Finding: Wrong Provider Name

**These programs are NOT Bodwell High School's own programs.** They are run by **UBC Geering Up Engineering Outreach** using Bodwell High School as a venue location. All 14 programs have been corrected to `provider: "UBC Geering Up"`.

Bodwell High School runs its own academic English and international student programs separately (at summer.bodwell.edu) — those are NOT the programs in this database.

---

## Programs Verified

All 14 programs at Bodwell High School (North Vancouver) location confirmed for 2026:

| ID | Camp Name | Week | Dates | Grades | Ages | Price |
|----|-----------|------|-------|--------|------|-------|
| ACT-0383 | STEM Explorations 2/3: Discoverers | Week 2 | Jul 6-10 | 2-3 | 7-8 | $400 |
| ACT-0409 | Miniminds: Early Explorers | Week 2 | Jul 6-10 | 1 | 6 | $400 |
| ACT-0477 | Pathways in STEM 6/7 | Week 3 | Jul 13-17 | 6-7 | 11-12 | $400 |
| ACT-0478 | Maker 2/3: Tinkerers | Week 3 | Jul 13-17 | 2-3 | 7-8 | $400 |
| ACT-0519 | All Girls* STEM Explorations 2/3: Discoverers | Week 4 | Jul 20-24 | 2-3 | 7-8 | $400 |
| ACT-0520 | All Girls* STEM Explorations 4/5: Researchers | Week 4 | Jul 20-24 | 4-5 | 9-10 | $400 |
| ACT-0583 | Maker 4/5: Inventors | Week 5 | Jul 27-31 | 4-5 | 9-10 | $400 |
| ACT-0605 | Pathways in STEM 6/7 | Week 5 | Jul 27-31 | 6-7 | 11-12 | $400 |
| ACT-0668 | Maker 2/3: Tinkerers | Week 6 | Aug 4-7 | 2-3 | 7-8 | $350 |
| ACT-0670 | Miniminds: Growing Geniuses | Week 6 | Aug 4-7 | 1 | 6 | $350 |
| ACT-0707 | Pathways in STEM 6/7 | Week 7 | Aug 10-14 | 6-7 | 11-12 | $400 |
| ACT-0710 | STEM Explorations 4/5: Researchers | Week 7 | Aug 10-14 | 4-5 | 9-10 | $400 |
| ACT-0735 | STEM Explorations 2/3: Discoverers | Week 8 | Aug 17-21 | 2-3 | 7-8 | $400 |
| ACT-0746 | Maker 4/5: Inventors | Week 8 | Aug 17-21 | 4-5 | 9-10 | $400 |

*All Girls* camps are open to those who identify as girls and gender-diverse youth

---

## Discrepancies Found and Corrected

| Field | Was | Now | Reason |
|-------|-----|-----|--------|
| `provider` | "Bodwell High School" | "UBC Geering Up" | Bodwell is venue; UBC Geering Up runs the programs |
| `registrationUrl` | https://summer.bodwell.edu/?page_id=640 | Geering Up offsite page | Previous URL was Bodwell's own ESL program |
| `ageMin/ageMax` (various) | 10/null | Grade-appropriate ranges | Fixed to match actual grade levels |
| `days` (BC Day week) | Mon-Fri | Tue-Fri | BC Day Aug 3 = Monday; camp runs Tue-Fri |
| `neighbourhood` | "Lower Lonsdale" | "Norgate" | Harbourside Drive area is Norgate |
| `costNote` | absent | Added | Explains BC Day short week pricing |

---

## Pricing Confirmed

- **Regular 5-day weeks:** $400/week
- **BC Day short week (Aug 4-7, 4 days):** $350
- **General range from Geering Up offsite page:** "$350-$400 (varies by Camp Theme and Program Duration)"

This matches the existing database prices (all $400 for regular weeks, $350 for BC Day week).

---

## Count Verification

- **Provider (Geering Up North Vancouver) 2026 programs:** ~14 at Bodwell (2 camps per week per the offsite page)
- **Database before audit:** 14 programs
- **Database after audit:** 14 programs (0 added, 14 corrected)

---

## Important Note on Registration URL

The registration page for Geering Up offsite camps uses campscui.active.com (NOT activekids.com — the campscui platform is allowed per Skeddo rules). The specific session registration links are at:
https://campscui.active.com/orgs/GEERingUp

These links require JavaScript to load, so the programs have been linked to the Geering Up offsite camps page instead.

---

## Hours

All camps: **9:00 AM – 3:00 PM** (no before/after care at this location)
