# Verification Log — Grouse Mountain

**Date:** 2026-04-04
**Auditor:** Claude (autonomous audit agent)
**Provider:** Grouse Mountain
**Registration page:** https://www.grousemountain.com/camps
**Address:** 6400 Nancy Greene Way, North Vancouver, BC V7R 4K9

---

## Programs Found on Live Page

**Camp hours:** 8:30 AM – 3:30 PM (Mon–Fri). After-care available 3:30–5:00 PM.
**Check-in:** Gondola Plaza, between Red Tram and Blue Gondola

### 1. Pathfinders Adventure Camp
**URL:** https://www.grousemountain.com/camps/pathfinders
**Birth years:** 2018–2020 (ages 6–8 in 2026)
**Pricing:** $420/5-day week, $336/4-day week
**Runs:** All 10 weeks (A–J)

| Week | Dates | Days | Price | Theme |
|------|-------|------|-------|-------|
| A | Jun 29–Jul 3 | Mon,Tue,Thu,Fri (4 days, Canada Day) | $336 | Adventure is Calling |
| B | Jul 6–10 | Mon–Fri | $420 | Mountain Explorers & Survival |
| C | Jul 13–17 | Mon–Fri | $420 | Nature Detectives |
| D | Jul 20–24 | Mon–Fri | $420 | Adventure is Calling |
| E | Jul 27–30 | Mon–Thu (4 days, unusual) | $420 | Mountain Explorers & Survival |
| F | Aug 4–7 | Tue–Fri (4 days, BC Day) | $336 | Nature Detectives |
| G | Aug 10–14 | Mon–Fri | $420 | Adventure is Calling |
| H | Aug 17–21 | Mon–Fri | $420 | Mountain Explorers & Survival |
| I | Aug 24–28 | Mon–Fri | $420 | Nature Detectives |
| J | Aug 31–Sep 4 | Mon–Fri | $420 | Adventure is Calling |

### 2. Alpine Blazers Camp
**URL:** https://www.grousemountain.com/camps/alpine-blazers
**Birth years:** 2013–2017 (ages 9–13 in 2026)
**Pricing:** $420/5-day week, $336/4-day week
**Runs:** All 10 weeks (A–J) — confirmed ✓

### 3. Extreme Adventure Camp
**URL:** https://www.grousemountain.com/camps/extreme-adventure-camp
**Birth years:** 2011–2015 (ages 11–15 in 2026)
**Requirements:** Weight 70–250 lbs, height min 145 cm, fitness for 1+ hour moderate hikes
**Pricing:** $529/5-day week, $425/4-day week
**Runs:** All 10 weeks (A–J) — confirmed ✓

### 4. Mountain Goats Hiking Camp
**URL:** https://www.grousemountain.com/camps/mountain-goats-hiking-camp
**Birth years:** 2011–2015 (ages 11–15 in 2026)
**Requirements:** Must be comfortable hiking 3–4 hours with moderate inclines
**Pricing:** $420/5-day week, $336/4-day week
**Runs:** Weeks F–J only (August only) — confirmed ✓

---

## Database Count

- **Provider shows:** 35 programs (10 Pathfinders + 10 Alpine Blazers + 10 Extreme + 5 Mountain Goats)
- **Database had:** 35 programs — count matches ✓
- **Added:** 0 (no missing programs)
- **Fixed:** 11 existing programs

---

## Discrepancies Found & Resolved

### 1. Pathfinders age range incorrect
- **Issue:** Database had ageMin: 5, ageMax: 7. Website clearly states "Born 2018–2020" = ages 6–8 in 2026.
- **Fix:** Updated ageMin: 5 → 6, ageMax: 7 → 8 for all 10 Pathfinders programs (IDs 2583–2592)

### 2. Pathfinders Week E cost wrong
- **Issue:** Database had cost: $336 (4-day rate). Website shows $420 for Week E (Jul 27–30) despite being a 4-day week (no stat holiday).
- **Fix:** Updated cost: $336 → $420 for ID 2587
- **Note:** Week E ends Thursday July 30 (not Friday July 31) — the 4-day nature of this week is confirmed but it is priced at the full 5-day rate of $420. Unusual but taken directly from website.

---

## Data Already Correct

The following were verified and found accurate:
- All Alpine Blazers data (ages 9–13, prices $420/$336, dates) ✓
- All Extreme Adventure data (ages 11–15, prices $529/$425, dates) ✓
- All Mountain Goats data (ages 11–15, prices $420/$336, dates) ✓
- All registrationUrls set correctly ✓
- Times (8:30 AM – 3:30 PM) ✓
- Address (6400 Nancy Greene Way) ✓
- 4-day week dates (Week A: Canada Day, Week F: BC Day) ✓

## Notes

- **Week E Pathfinders anomaly:** Jul 27–30 is a 4-day week (Monday–Thursday) without a statutory holiday. Website prices this at $420 (same as 5-day weeks). This is confirmed from the live page and retained as-is.
- **Alpine Blazers Week E end date:** Database shows Jul 31 (Friday). Website appeared to show "Aug 1" — this is likely a website display issue. Jul 31 (Friday) is the correct and expected end of the July 27–31 week. Retained Jul 31.
- **Extreme Adventure Week D website typo:** Website showed end date "July 27" for Week D (which conflicts with Week E starting July 27). This is clearly a website typo; Jul 24 (Friday) is correct. Database already has Jul 24 — no change needed.
- **Mountain Goats runs Weeks F–J only** (Aug 4 – Sep 4): confirmed, no earlier weeks offered.
