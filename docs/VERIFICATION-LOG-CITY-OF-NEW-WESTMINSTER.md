# Verification Log — City of New Westminster

**Date:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Provider:** City of New Westminster Parks & Recreation
**Registration Page:** https://www.newwestcity.ca/parks-and-recreation/day-camps
**PerfectMind Portal:** https://cityofnewwestminster.perfectmind.com/23693/Clients/BookMe4?widgetId=50a33660-b4f7-44d9-9256-e10effec8641

---

## Audit Status: INCOMPLETE — Registration Not Yet Open

**Critical Finding:** The City of New Westminster Summer 2026 camps brochure has NOT been published as of 2026-04-05. Key facts confirmed from the provider's live website:

- Summer 2026 camps brochure expected: **April 30, 2026**
- Summer 2026 Active Living Guide expected: **May 21, 2026**
- Summer 2026 registration opens: **May 8, 2026 (NW residents); May 9 (general public)**

This means NO 2026-specific program details can be verified at this time. All fields (cost, exact dates, age ranges, times, locations) must be treated as estimates from prior year data.

---

## Corrections Applied

All 21 City of New Westminster programs (IDs 1143–1163) had the following incorrect data that was corrected:

### Incorrect Fields Fixed

| Field | Was | Now | Reason |
|-------|-----|-----|--------|
| `enrollmentStatus` | "Open" | "Coming Soon" | Registration doesn't open until May 8, 2026 |
| `confirmed2026` | true | false | 2026 brochure not yet released |
| `priceVerified` | true | false | 2026 prices not yet published |
| `isEstimate` | (absent) | true | All data is from prior year; 2026 not confirmed |
| `registrationDate` | (absent) | "2026-05-08" | Per R20, "Coming Soon" requires registrationDate |
| `registrationDateLabel` | "TBD (typically early May)" | "Opens May 8 for NW residents; May 9 for all others" | Confirmed from live page |
| `costNote` | (absent) | Prior year price note | Per R15, estimate requires explanation |
| `status` | "Open" | "Coming Soon" | Match enrollmentStatus |

### BC Day Holiday Week Correction (IDs 1155, 1156, 1157)

The week starting Aug 4, 2026 was listed as "Mon-Fri" (5 days) but BC Day falls on **Monday, August 3, 2026**, making this a 4-day week (Tue-Fri, Aug 4–7).

- `days` corrected to "Tue-Fri"
- `notes` added: "Short week — BC Day (Aug 3) holiday. Camp runs Tue-Fri only."

---

## Programs in Database (21 City of New Westminster programs)

All programs are structured as weekly sessions (Mon-Fri or Tue-Fri for BC Day week) at Moody Park Community Centre (65 E 6th Ave, New Westminster, BC).

### Session Weeks Covered

| Week | Dates | Programs (3 per week) |
|------|-------|----------------------|
| Week 1 | Jul 6–10 | Day Camp Ages 6-8, Day Camp Ages 9-12, Arts & Culture Camp |
| Week 2 | Jul 13–17 | Day Camp Ages 6-8, Day Camp Ages 9-12, Arts & Culture Camp |
| Week 3 | Jul 20–24 | Day Camp Ages 6-8, Day Camp Ages 9-12, Arts & Culture Camp |
| Week 4 | Jul 27–31 | Day Camp Ages 6-8, Day Camp Ages 9-12, Arts & Culture Camp |
| Week 5 | Aug 4–7 (4 days) | Day Camp Ages 6-8, Day Camp Ages 9-12, Arts & Culture Camp |
| Week 6 | Aug 10–14 | Day Camp Ages 6-8, Day Camp Ages 9-12, Arts & Culture Camp |
| Week 7 | Aug 17–21 | Day Camp Ages 6-8, Day Camp Ages 9-12, Arts & Culture Camp |

### Data From Prior Year (Not Verified for 2026)

- **Cost:** $250/week (from 2025 brochure) — marked isEstimate: true
- **Times:** 9:00 AM – 4:00 PM — assumed consistent year-over-year
- **Age groups:** 6-8, 9-12 for day camps; 6-12 for arts camp
- **Location:** 65 E 6th Ave (Moody Park) — assumed consistent

### Arts & Culture Camp Age Range Note

The Arts & Culture Camp is listed with ages 6-12 (combined range). The 2025 brochure showed a "Dance & Art" camp for ages 6-10. It is possible the 2026 Arts camp will have distinct age bands (e.g., 6-8 and 9-12 like the general day camp). This should be verified when the 2026 brochure is released on April 30, 2026.

---

## Programs Count

- **Provider website (live today):** 0 summer 2026 programs listed (brochure not yet published)
- **Database before audit:** 21 programs marked "Open" with confirmed2026: true (incorrect)
- **Database after audit:** 21 programs marked "Coming Soon" with correct metadata
- **Added:** 0 (cannot add without verified data)
- **Fixed:** 21 (enrollment status, confirmed flags, registration date, cost note)

---

## Other New Westminster Programs in Database

### New Westminster Soccer Club (ID 401)
- Provider: "New Westminster Soccer Club" (different from "City of New Westminster")
- Not in scope of this City audit but noted for reference
- Already has confirmed2026: true and priceVerified: true — not changed

### SD40 School District Programs (IDs SD40-0001, SD40-0002, SD40-0003)
- Provider: "School District 40 (New Westminster)" — separate provider
- Already marked "Likely Coming Soon" — not changed

---

## What Must Be Re-Audited

When the 2026 Summer Camps brochure is released (expected April 30, 2026):

1. Verify exact program names and any new camp types
2. Confirm 2026 pricing
3. Confirm exact session dates (especially BC Day week)
4. Verify age group breakdowns (may differ from 2025)
5. Check if Arts & Culture Camp should be split by age group
6. Update all programs with confirmed2026: true and priceVerified: true after verification
7. Update enrollmentStatus to "Open" once registration opens May 8

---

## Registration URL Note

The PerfectMind portal URL in the database is a valid landing page but programs won't be searchable until registration opens in May. The URL is correct for directing parents to where they will register.

**Portal URL:** https://cityofnewwestminster.perfectmind.com/23693/Clients/BookMe4BookingPages/BookingCoursesPage?calendarId=08850d05-e58f-4843-9b00-e8c5d080ce0b&widgetId=50a33660-b4f7-44d9-9256-e10effec8641&embed=False
