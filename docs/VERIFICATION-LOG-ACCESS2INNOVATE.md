# Verification Log — Access2Innovate Foundation

**Verified by:** Claude (session 2026-04-01)
**Provider website:** https://www.access2innovate.com
**Registration page:** https://www.access2innovate.com/camps
**Active.com campscui:** https://campscui.active.com/orgs/Access2InnovateFoundation2
**Address confirmed:** Unit 224, 125 Victory Ship Way, North Vancouver, BC V7L 0G5
**Phone:** 604-636-2646

---

## Changes Made This Session

### 1. Fixed registrationUrl for all 11 programs (CRITICAL)

**Issue:** All 11 A2I programs had `registrationUrl: "https://www.mulgrave.com/campus-life/mulgrave-school-summer-camps"` — this is the Mulgrave School's own camp page and is **completely wrong** for Access2Innovate programs.

**Finding:** Verified on campscui.active.com that ALL A2I summer 2026 sessions (32 total) and all ProD Day sessions (6 total) are at **Access2Innovate Foundation - The Shipyards** (224-125 Victory Ship Way). No A2I programs are listed at Mulgrave School or Collingwood School in the 2026 campscui data.

**Fix:** Changed `registrationUrl` to `https://www.access2innovate.com/camps` for all 11 programs. Set `urlVerified: false` pending Tom's specific session URL guidance.

**Programs fixed:**
- ACT-0170, ACT-0307, ACT-0308, ACT-0318, ACT-0319, ACT-0322, ACT-0323, ACT-0423, ACT-0424, ACT-0439, ACT-0490

### 2. Fixed campType for ACT-0170 (Build an Arcade game & controller)

**Issue:** `campType: "Summer Camp"` but startDate is 2026-03-23 (spring break week).

**Fix:** Changed to `campType: "Spring Break"`, `season: "Spring 2026"`.

---

## Verified Data — All A2I Programs

### ProD Day Programs (all at The Shipyards, $100 CAD each)

| ID | Name | Date | Time | Grade | URL Used |
|----|------|------|------|-------|----------|
| ACT-0307 | Code the Patterns, Crack the Numbers! | May 4, 2026 | 9:30 AM–3:00 PM | Gr 4–6 | access2innovate.com/camps |
| ACT-0308 | Splash & Scales Adventure Lab | May 4, 2026 | 9:30 AM–3:00 PM | Gr K–3 | access2innovate.com/camps |
| ACT-0319 | The Great A2I Math Challenge | May 15, 2026 | 9:30 AM–3:00 PM | Gr 4–6 | access2innovate.com/camps |
| ACT-0318 | Tiny Planet Protectors | May 15, 2026 | 9:30 AM–3:00 PM | Gr K–3 | access2innovate.com/camps |
| ACT-0323 | Backyard Biologists | Jun 5, 2026 | 9:30 AM–3:00 PM | Gr K–3 | access2innovate.com/camps |
| ACT-0322 | Graph Masters: Data Detectives | Jun 5, 2026 | 9:30 AM–3:00 PM | Gr 4–6 | access2innovate.com/camps |

**Notes on ProD Day campscui session IDs (for reference only, cannot use campscui URLs per R24):**
- Code the Patterns: session 69067533
- Splash & Scales: session 69067633
- Great A2I Math: session 69074539
- Tiny Planet Protectors: session 69074639
- Backyard Biologists: session 69074839
- Graph Masters: session 69074739

### Summer Camp Programs (all at The Shipyards)

| ID | Name | Dates | Time | Grade | Cost | URL Used |
|----|------|-------|------|-------|------|----------|
| ACT-0423 | Code & Build Robotics Camp: Den Bot | Jul 6–10, 2026 | 9:30–3:30 | Gr 5–7 | $495 | access2innovate.com/camps |
| ACT-0424 | Tiny Inventors | Jul 6–10, 2026 | 9:30–12:30 AM | Gr K–1 | $250 | access2innovate.com/camps |
| ACT-0439 | Tiny Creators | Jul 6–10, 2026 | 1:00–4:00 PM | Gr K–1 | $250 | access2innovate.com/camps |
| ACT-0490 | Code & Build Robotics Camp: Claw Bot | Jul 13–17, 2026 | 9:30–3:30 | Gr 5–7 | $495 | access2innovate.com/camps |

### Spring Break Program

| ID | Name | Dates | Time | Cost | URL Used |
|----|------|-------|------|------|----------|
| ACT-0170 | Build an Arcade game & controller | Mar 23–27, 2026 | 9:30–3:30 | $495 | access2innovate.com/camps |

Note: This is a **spring break camp** (not summer). Fixed campType from "Summer Camp" to "Spring Break". enrollmentStatus: Closed (registration deadline was March 13).

---

## Active.com Direct Session URLs Found (active.com domain only)

The following active.com URLs were found during research (NOT activekids.com, NOT campscui) and can be used for future program entries:

- Summer Makers Fair | Gr K-3 (Jun 20, 2026): https://www.active.com/north-vancouver-bc/science/camp/summer-makers-fair-gr-k-3-2026
- Summer Makers Fair | Gr 4-6 (Jun 20, 2026): https://www.active.com/north-vancouver-bc/science/camp/summer-makers-fair-gr-4-6-2026
- Summer Makers Fair | Gr 7-12 (Jun 20, 2026): https://www.active.com/north-vancouver-bc/science/camp/summer-makers-fair-gr-7-12-2026
- Jr. Engineer: Engineering a Green City (Jul 27–31, 2026): https://www.active.com/north-vancouver-bc/science/camp/jr-engineer-engineering-a-green-city-2026-108484871

These 4 programs are **NOT currently in the database** and should be added in a future session.

---

## Issues Investigated But Not Resolved (For Next Session)

### Tom Feedback #2 — After school care ($20/day not $20/week)
- Researched Mulgrave campscui: confirmed "After Camp Care - Daily Drop-In" = CAD $20/day and "After Camp Care - By Week" = CAD $100/week
- **Could not find any "after school care" notes in the current A2I program entries** — none of the 11 A2I programs have costNote or description mentioning after-school care pricing
- **Action needed:** Tom to clarify which program(s) or field(s) contain the wrong $20/week note

### Tom Feedback #3 — Pricing shows "inquire for pricing" when Active.com shows $480
- Reviewed all 32 summer 2026 sessions and all 6 ProD Day sessions on campscui
- Prices found: $495 (full-day camps), $250 (half-day Tiny Creators/Inventors), $100 (ProD Days)
- **No $480 price found anywhere in A2I campscui**
- **Action needed:** Tom to identify which program shows "inquire for pricing" — may be a program not yet in our database

### Tom Feedback #4 — Three robotics camps at wrong venue (address doesn't match Mulgrave)
- Searched A2I campscui (all 32 sessions), Mulgrave campscui (new UI), Collingwood campscui
- **All A2I summer 2026 sessions are at "Access2Innovate Foundation - The Shipyards"**
- Mulgrave has their own VEX IQ Robotics camps (separate provider, not A2I)
- Collingwood has no A2I programs
- **Conclusion:** The three robotics camps (ACT-0170, ACT-0423, ACT-0490) appear correctly located at The Shipyards. The previous mulgrave.com registrationUrl was the source of the "address doesn't match" confusion — now fixed.
- **Action needed:** Tom to confirm if there are separate Mulgrave/Collingwood-hosted A2I sessions that are not in the 2026 campscui data (possibly older sessions or separately contracted programs)

### Missing Programs (Not Yet in Database)
The following A2I programs run in summer 2026 but are NOT in our database:
- Jr. Coding & Stop Motion: Creative Coding & Animation Adventure (Jul 6–10, Gr 1–4, $495) — weeks 1 and 5
- Jr. Engineer: Engineering a Green City (Jul 13–17, 27–31, Aug 10–14, Gr 2–4, $495) — multiple weeks
- Summer Makers Fair | Gr K-3, 4-6, 7-12 (Jun 20, 2026)
- Additional weeks of Den Bot, Claw Bot, Tiny Creators, Tiny Inventors (Aug sessions)

**Next session should add these missing programs.**

---

## Verification Source Notes

- campscui.active.com (A2I org) visited: confirmed 32 summer sessions + 6 ProD Day sessions, all at The Shipyards
- activekids.com pages visited (research only, URLs not stored per R24): confirmed $495/$250 pricing
- active.com search performed: found 4 programs with usable active.com URLs (listed above)
- Mulgrave campscui visited: no A2I programs found, only Mulgrave's own programs
- Collingwood campscui visited: no A2I programs found
- access2innovate.com/camps: confirmed as the canonical registration landing page
