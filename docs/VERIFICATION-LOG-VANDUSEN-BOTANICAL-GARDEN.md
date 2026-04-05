# Verification Log — VanDusen Botanical Garden

**Date:** 2026-04-05
**Auditor:** Claude
**Registration page:** https://app.amilia.com/store/en/vanduseneducation/shop/programs/129816
**Provider website:** https://vandusengarden.org/learn/camps/
**Location:** 5251 Oak Street, Vancouver, BC (Oakridge/Shaughnessy border)

## Summary

Provider shows **8 summer camp sessions** and **2 Pro-D Day camps** on the live pages. Database had **11 programs** (8 summer + 2 Pro-D + 1 past ACTIVE listing). After audit: **12 programs** total (1 added: Jun 26 Pro-D Day; 1 past program marked Completed).

## Confirmed Program Details (from live pages)

**Ages:** 5–10 (must have completed or be currently attending kindergarten)
**Location:** VanDusen Botanical Garden, 5251 Oak Street, Vancouver (Oakridge)

### Summer Camps 2026

8 week-long sessions, June 29 – August 21, 2026 (excluding statutory holidays).

| Week | Dates | Days | Cost (non-member) |
|------|-------|------|-------------------|
| 1 | Jun 29–Jul 3 | Mon-Tue, Thu-Fri | $340 (4-day: Jul 1 = Canada Day) |
| 2 | Jul 6–10 | Mon-Fri | $425 |
| 3 | Jul 13–17 | Mon-Fri | $425 |
| 4 | Jul 20–24 | Mon-Fri | $425 |
| 5 | Jul 27–31 | Mon-Fri | $425 |
| 6 | Aug 4–7 | Tue-Fri | $340 (4-day: Aug 3 = BC Day) |
| 7 | Aug 10–14 | Mon-Fri | $425 |
| 8 | Aug 17–21 | Mon-Fri | $425 |

After-care: $64/week (non-member, 4-day) or $80/week (5-day).
Member rates: 10% discount ($306 4-day, $382.50 5-day, $57.60/$72 after-care).
Times: 9:00 AM – 4:00 PM (confirmed from registration page).

### Pro-D Day Camps 2026

| Name | Date | Status |
|------|------|--------|
| Flower Power | Monday, April 20 | Waitlist only |
| Bogs to Beaches | Friday, June 26 | Registration open |

Both Pro-D sessions: 9:00 AM – 4:00 PM | Ages 5+ | $85/day (non-member), $76.50/day (member)

## Discrepancies Found and Fixed

### 1. ACT-0195 (Outdoor Food Scientist, Mar 26) — FIXED
- **Was:** enrollmentStatus "Open"
- **Now:** enrollmentStatus "Completed"
- **Why:** Single-day event ran March 26, 2026. Today is April 5 — past. Not a standard summer camp session.

### 2. proday-vandusen-1 (Apr 20 Pro-D Day) — FIXED
- **Was:** name "Pro-D Day Nature Camp", endTime "3:00 PM", enrollmentStatus "Full"
- **Now:** name "Pro-D Day Nature Camp — Flower Power", endTime "4:00 PM", enrollmentStatus "Waitlist"
- **Why:** Live page confirms theme "Flower Power" and time 9am-4pm. Status is "Waitlist only" (not "Full" — waitlists are open, camp is not full/closed). durationPerDay updated from 6 to 7 hours.

### 3. proday-vandusenbotanicalgarden-20260515-oakridge (May 15 Pro-D Day) — FLAGGED
- **Was:** enrollmentStatus "Likely Coming Soon", confirmed2026 false
- **Now:** enrollmentStatus "Likely Coming Soon", confirmed2026 false, costNote updated with note that this date is not on the 2026 live page
- **Why:** Live page only shows Apr 20 and Jun 26 Pro-D Days for 2026. May 15 does not appear. May have been a VSB Pro-D Day that was dropped from 2026 programming. Retained in DB per policy (don't delete — use Likely Coming Soon).

### 4. Missing Pro-D Day — ADDED
- **New:** proday-vandusenbotanicalgarden-20260626-oakridge — "Bogs to Beaches" Pro-D Day
- **Date:** Friday, June 26, 2026
- **Time:** 9:00 AM – 4:00 PM
- **Cost:** $85 (non-member), $76.50 (member)
- **Status:** Open

## Verified Fields (no change needed)
- Summer camp ages 5-10: confirmed correct
- Summer camp times 9:00 AM – 4:00 PM: confirmed correct (previously some records showed 9-4, which was already right)
- Summer camp prices ($340 4-day, $425 5-day non-member): confirmed correct
- Summer camp days fields (holiday-aware scheduling for weeks 1 and 6): confirmed correct
- Summer camp records 1165-1168, 1170-1171 (5-day weeks): confirmed correct
- Address 5251 Oak St, Vancouver: confirmed correct

## Notes
- VanDusen Garden education programs are run by the Vancouver Botanical Gardens Association (VBGA), not the City of Vancouver
- Bursaries available for families with financial need — not reflected in pricing fields
- Registration is on Amilia platform (app.amilia.com/store/en/vanduseneducation)
- After-care options exist but are not listed as separate programs (add-on only)
- The "Teacher Professional Development" listed on the site is for adult educators, not a children's program
