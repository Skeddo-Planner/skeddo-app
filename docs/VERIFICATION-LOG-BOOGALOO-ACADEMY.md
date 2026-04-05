# Verification Log — Boogaloo Academy

**Latest audit date:** 2026-04-05
**Auditor:** Claude (automated)
**Registration page URL:** https://www.boogalooacademy.com/summer-camps/
**Overall status:** BLOCKED — JavaScript-rendered site, program content not accessible

---

## Audit History

### April 2026 Re-Check (2026-04-05)

**Result:** Still blocked. Same JS-rendering issue. No new program data obtained.

**Additional attempts beyond original audit:**
- Fetched all sub-pages: `/scheduleage/`, `/year-at-a-glance/`, `/new-students/` — all CSS/metadata only
- Confirmed Boogaloo Academy uses **Jackrabbit Class** for registration (referenced in multiple sources); searched `site:app.jackrabbitclass.com "boogaloo"` — no publicly indexed pages found; OrgID unknown
- Checked Facebook, Nextdoor, Yelp, Chatterblock, VancityKids, KidsOutAndAbout — general descriptions only, no 2026 prices or dates
- Ran 8+ targeted web searches; best result was "camps run 9am–3pm full day or 9am–12pm half day" (prior-year marketing copy)

**⚠️ Potential site compromise detected:**
Google indexes `https://www.boogalooacademy.com/index.php/scheduleage/` with title **"10 person tent instant 2025"** — a classic SEO spam injection fingerprint. When fetched directly, the page returns the normal title "Schedule by age - Boogaloo Academy". This cloaking pattern indicates the site may have been compromised. Page last-modified: 2025-08-14.
**Tom should consider notifying Boogaloo Academy about this.**

**Changes this audit:** Updated `costNote` on all 8 records to note April 2026 re-check and confirm Jackrabbit registration.

**Known data issues noted (cannot fix without live page access):**
- ID 55: `scheduleType: "Half Day (AM)"` but `endTime: "3:00 PM"` (9:30–3pm = 5.5h). Description mentions ages 3–5 half-day ending at noon — endTime is likely wrong. Cannot confirm without live page.
- ID 2543: `days: "Mon-Fri"` but `startDate: 2026-07-07` (Tuesday). If camp is Mon–Fri, start should be July 6. Cannot confirm without live page.
- IDs 55–60: All use `ageMin: 3 / ageMax: 12` (combined age range). Boogaloo appears to offer separate age brackets (3–5, 5–8, 9–12). Needs splitting once live data confirmed.

---

### Original Audit

**Date:** 2026-04-05 (same session, initial check — prior log entry)
**Auditor:** Claude (automated)

| Metric | Value |
|--------|-------|
| Programs found on live page | 0 (site is JS-rendered, content not accessible) |
| Programs in database | 8 |
| Programs added | 0 |
| Programs fixed | 8 (removed false verified flags) |
| Programs completed | 0 |

**What Was Tried:**
1. Static fetch of https://www.boogalooacademy.com/summer-camps/ — CSS/JS shell only
2. Static fetch of https://www.boogalooacademy.com/index.php/summer-camps/ — same
3. Web searches for 2026 pricing/dates — no 2026-specific data found
4. Aggregator sites (thebestcamps.com, kidsoutandabout.com) — general descriptions only

**Why It Failed:** WordPress/Divi renders all camp content client-side via JavaScript. Static HTTP fetches return only the HTML shell.

**Database Corrections Made:**

| ID | Name | Change |
|----|------|--------|
| 55 | Creative Arts Day Camp | confirmed2026=false, priceVerified=false, status=Likely Coming Soon |
| 56 | Creative Arts Day Camp | confirmed2026=false, priceVerified=false, status=Likely Coming Soon |
| 57 | Creative Arts Day Camp | confirmed2026=false, priceVerified=false, status=Likely Coming Soon |
| 58 | Creative Arts Day Camp | confirmed2026=false, priceVerified=false, status=Likely Coming Soon |
| 59 | Creative Arts Day Camp | confirmed2026=false, priceVerified=false, status=Likely Coming Soon |
| 60 | Creative Arts Day Camp | confirmed2026=false, priceVerified=false, status=Likely Coming Soon |
| 2543 | Enchanted Castle Dance Camp (Ages 3-5) | confirmed2026=false, priceVerified=false, status=Likely Coming Soon, fixed address |
| 2544 | Disney Magic Dance Camp (Ages 3-5) | confirmed2026=false, priceVerified=false, status=Likely Coming Soon, fixed address |

---

## Provider Information (confirmed from static sources)

| Field | Value |
|-------|-------|
| Address | #101 – 8410 Ontario St, Vancouver, BC V5X 4S6 |
| Neighbourhood | Marpole |
| Phone | 604-805-0558 |
| Email | contact@boogalooacademy.com |
| Registration system | Jackrabbit Class |
| Camp format | Full day 9am–3pm; Half day AM 9am–12pm; Half day PM 12pm–3pm |
| Age range | 3 to teens+ |
| Program types | Dance (street + classical), drama, arts; Early Childhood; Breakdancing; Teen Intensives |

---

## Current Database (8 programs — all unverified)

| ID | Name | Dates | Ages | Times | Cost | Status |
|----|------|-------|------|-------|------|--------|
| 55 | Creative Arts Day Camp | Jul 6–10, 2026 | 3–12 | 9:30am–3pm | $300 | Likely Coming Soon |
| 56 | Creative Arts Day Camp | Jul 13–17, 2026 | 3–12 | 9am–4pm | $300 | Likely Coming Soon |
| 57 | Creative Arts Day Camp | Jul 20–24, 2026 | 3–12 | 9am–4pm | $300 | Likely Coming Soon |
| 58 | Creative Arts Day Camp | Jul 27–31, 2026 | 3–12 | 9am–4pm | $300 | Likely Coming Soon |
| 59 | Creative Arts Day Camp | Aug 4–7, 2026 | 3–12 | 9am–4pm | $300 | Likely Coming Soon |
| 60 | Creative Arts Day Camp | Aug 10–14, 2026 | 3–12 | 9am–4pm | $300 | Likely Coming Soon |
| 2543 | Enchanted Castle Dance Camp (Ages 3-5) | Jul 7–11, 2026 | 3–5 | 9:30am–12pm | $295 | Likely Coming Soon |
| 2544 | Disney Magic Dance Camp (Ages 3-5) | Aug 18–22, 2026 | 3–5 | 9:30am–12pm | $295 | Likely Coming Soon |

---

## Recommended Next Steps

1. **Manual browser audit required.** Open https://www.boogalooacademy.com/summer-camps/ in Chrome/Firefox with JavaScript enabled, scroll through all offerings, capture per-age-group listings and exact prices.
2. Once live data confirmed, restructure IDs 55–60 into separate age-stratified listings (3–5 half-day AM, 5–8 full-day, 9–12 full-day).
3. Fix ID 55 endTime (likely should be 12:00 PM, not 3:00 PM) and ID 2543 startDate (likely July 6, not July 7).
4. **Consider notifying Boogaloo Academy** about the potential SEO spam on `/scheduleage/`.
