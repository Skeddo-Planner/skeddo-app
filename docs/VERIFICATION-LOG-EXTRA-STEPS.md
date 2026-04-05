# Verification Log — Extra Steps Preschool

**Date:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Provider:** Extra Steps Preschool
**Website:** https://www.extrasteps.ca/fun-camps
**Camp Weeks Page:** https://www.extrasteps.ca/fun-camps/camp-weeks
**Registration Form (JotForm):** https://form.jotform.com/info_Preschool_info120/summer-camps-2026

---

## Audit Status: COMPLETE — Data Verified Against Live Registration Form

Registration for Summer 2026 camps is **OPEN** as of 2026-04-05. The JotForm registration form is active and accepting signups, with payment due May 1, 2026.

---

## Programs Found on Provider Site

**8 themed camp weeks** offered, each with AM and PM sessions = **16 total programs**.

### Session Times (Confirmed)
- AM Class: 8:30 AM – 12:00 PM
- PM Class: 1:00 PM – 4:30 PM

### Age Group (Confirmed)
- Ages 3 through Kindergarten age (must be fully potty-trained)
- Database range ageMin:3, ageMax:6 is correct

### Pricing (Confirmed from JotForm)
- Regular weeks (5 days): **$220/week per session**
- Short week August 4–7 (4 days, BC Day Aug 3): **$200/week per session**
- New family one-time registration fee: **$30**
- Discounts: 5% for 3–5 camps; 10% for 6+ camps (current preschool families and next-year registrants only)

### Weekly Schedule (Confirmed)

| Week | Dates | Theme Listed in DB | Days |
|------|-------|-------------------|------|
| 1 | Jul 6–10 | Science | Mon-Fri |
| 2 | Jul 13–17 | Art | Mon-Fri |
| 3 | Jul 20–24 | Nature | Mon-Fri |
| 4 | Jul 27–31 | Heroes | Mon-Fri |
| 5 | Aug 4–7 | Top Chef | Tue-Fri (4 days, BC Day Aug 3) |
| 6 | Aug 10–14 | Animals | Mon-Fri |
| 7 | Aug 17–21 | Olympics | Mon-Fri |
| 8 | Aug 24–28 | Transportation | Mon-Fri |

**Theme Note:** The provider website lists 8 themes (Science, Art, Nature, Heroes, Top Chef, Animals, Olympics, Transportation) but does NOT assign them to specific weeks in 2026. The theme-to-week assignments in the database are carried over from the prior year's order. Verify the 2026 week-by-week theme schedule when the provider publishes it.

### Location (Confirmed)
- **Address:** 726 W 16th Ave, Vancouver, BC V5Z 1S7
- **Neighbourhood:** Cambie
- **Phone:** 604.569.0388
- **Email:** info@extrasteps.ca

---

## Discrepancies Found and Corrected

| Field | Was | Now | Reason |
|-------|-----|-----|--------|
| `cost` (regular weeks) | $225 | $220 | Confirmed from JotForm registration form |
| `cost` (BC Day short week) | $190 | $200 | Confirmed from JotForm (listed as $200 for 4-day week) |
| `endTime` (PM sessions) | not set / wrong | 4:30 PM | Confirmed: PM class is 1:00–4:30 PM |
| `days` (BC Day week, IDs 1196, 1197) | Mon-Fri | Tue-Fri | BC Day (Aug 3) = Monday, camp runs Tue-Fri |
| `registrationUrl` | /fun-camps generic page | JotForm direct link | Updated to actual 2026 registration form |
| `costNote` | absent | Added with discount info | Per R15 best practice |
| `notes` | absent | Added theme caveat | Themes not confirmed per week for 2026 |

---

## Count Verification

- **Provider website programs:** 8 weeks × 2 sessions (AM/PM) = 16 programs
- **Database before audit:** 16 programs
- **Database after audit:** 16 programs (0 added, 16 corrected)

---

## Enrollment Status

All 16 programs confirmed **Open** — JotForm registration is live and accepting submissions.

---

## Registration URL

Direct 2026 registration form:
`https://form.jotform.com/info_Preschool_info120/summer-camps-2026`

The previously stored URL (`https://www.extrasteps.ca/fun-camps`) is a valid informational page but does not allow direct registration. Updated to the JotForm URL.
