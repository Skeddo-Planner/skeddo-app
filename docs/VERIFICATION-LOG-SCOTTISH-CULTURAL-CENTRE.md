# Verification Log — Scottish Cultural Centre

**Date:** 2026-04-05
**Auditor:** Claude
**Provider website:** https://scottishculturalcentre.com
**Location:** 8886 Hudson St, Vancouver, BC (Marpole)

## Summary

**Finding: The Scottish Cultural Centre does not operate any summer camps or children's classes.** It is a wedding venue and community events space. All 11 "Scottish Cultural Centre" records in the database were actually programs operated by **Crocodile Mandarin School**, which rents the Celtic Room at this facility.

After audit: All 11 records corrected — provider field updated from "Scottish Cultural Centre" to "Crocodile Mandarin", corrupt data fixed, age ranges corrected from Crocodile Mandarin's live program pages.

## Scottish Cultural Centre Website Review

The scottishculturalcentre.com website describes itself as "an inclusive multi-use facility" offering "dances, weddings, fundraisers, banquets." No mention of summer camps, children's programs, toddler classes, or Mandarin classes anywhere on the site. The 11 ACTIVE Network API records attributed to "Scottish Cultural Centre" are from a third-party organization that rents this space.

## Actual Provider: Crocodile Mandarin School

**Website:** https://www.crocodilemandarin.com
**Classes at SCC location:** Saturday and select weekdays (Celtic Room, ground floor)
**Spring Term 2026:** April 11 – June 28 (11 sessions, break May 16-22)

### Classes Offered at Scottish Cultural Centre Location

| ACTIVE ID | Program Name | Days | Time | Ages | Cost | Notes |
|-----------|-------------|------|------|------|------|-------|
| ACT-0231 | Toddler/Preschool Mandarin Class | Sat | 11:00 AM–12:00 PM | 2–5 | $235/term* | Play-based |
| ACT-0235 | Toddler/Preschool Mandarin Class | Sat | 10:00 AM–11:00 AM | 2–5 | $235/term* | Play-based |
| ACT-0238 | A Class (Beginner Mandarin) | Sat | 12:00–1:00 PM | 5–10 | $235/term* | Beginner/near-beginner |

*Early bird price per 10-week term as shown on crocodilemandarin.com/courses/crocodile-classes.html

### Summer Day Camps at Scottish Cultural Centre (Crocodile Mandarin)

8 weeks, Jul 6 – Aug 28, 2026 | 9:00 AM – 5:00 PM | Ages 5-10
Regular $540+GST/week, Early Bird $498+GST/week (until May 1)

| ID | Dates | Status |
|----|-------|--------|
| ACT-0394 | Jul 6-10 | Likely Coming Soon (unconfirmed) |
| ACT-0450 | Jul 13-17 | Likely Coming Soon |
| ACT-0548 | Jul 20-24 | Likely Coming Soon |
| ACT-0619 | Jul 27-31 | Likely Coming Soon |
| ACT-0659 | Aug 4-7 | Likely Coming Soon |
| ACT-0696 | Aug 10-14 | Likely Coming Soon |
| ACT-0741 | Aug 17-21 | Likely Coming Soon |
| ACT-0768 | Aug 24-28 | Likely Coming Soon |

## Discrepancies Found and Fixed

### 1. Provider field (ALL 11 records) — FIXED
- **Was:** "Scottish Cultural Centre"
- **Now:** "Crocodile Mandarin"
- **Why:** SCC is the venue; Crocodile Mandarin School is the program operator. The ACTIVE API attributed programs to the venue rather than the operator.

### 2. Saturday class times — FIXED (ACT-0231, ACT-0235, ACT-0238)
- **Was:** startTime "12:05 AM" (midnight — clearly corrupt ACTIVE API data), days "Mon-Fri"
- **Now:** Correct times derived from program names (10:00 AM, 11:00 AM, 12:00 PM), days "Sat"
- **Why:** The record names included the actual times. ACTIVE API data was completely corrupt.

### 3. Saturday class campType — FIXED
- **Was:** campType "Summer Camp", scheduleType "Full Day", durationPerDay 11.9
- **Now:** campType "Class", scheduleType "Half Day (AM)", durationPerDay 1
- **Why:** These are weekly Saturday classes, not summer camps, and each session is 1 hour long.

### 4. Age ranges (Saturday classes) — FIXED
- ACT-0231, ACT-0235: ageMin=5, ageMax=null → ageMin=2, ageMax=5 (Toddler/Preschool class per crocodilemandarin.com)
- ACT-0238: ageMin=2, ageMax=10 → ageMin=5, ageMax=10 (A Class per crocodilemandarin.com)

### 5. Registration URLs (ALL 11 records) — FIXED
- **Was:** https://scottishculturalcentre.com (venue homepage, not registration)
- **Now:** https://www.crocodilemandarin.com/current-term.html (Saturday classes) and https://www.crocodilemandarin.com/courses/summer-day-camps.html (summer camps)

## Notes
- Crocodile Mandarin also has entries in the DB under IDs 609-612 (4 summer camp records) and ACT-0232, ACT-0233, ACT-0236 (Saturday classes with correct provider attribution)
- Crocodile Mandarin also operates at East Vancouver, South Burnaby, and Coquitlam locations — those are separate from this audit
- The summer camp DB prices ($540) align with the provider's website ($540+GST regular — the DB cost may need GST added; costNote updated with this context)
- All 11 records retain enrollmentStatus "Likely Coming Soon" since confirmed2026=false — Crocodile Mandarin's 2026 summer camp schedule should be verified separately
- Re-audit recommended when the Crocodile Mandarin queue entry (rank 195, 233) is processed
