# Verification Log — Room to Roam Outdoor Learning

**Audited:** 2026-04-06
**Queue entry:** Rank 193
**Source URLs verified (browser navigation):**
- `https://roomtoroam.ca/port-coquitlam-summer-camps-2026/` (full 2026 camp schedule — dates, ages, pricing, availability confirmed)
**DB count before audit:** 16,248 programs
**DB count after audit:** 16,254 (6 added, 6 corrected)

---

## Summary

All 6 existing entries had fundamental data errors: ages listed as 3-12 (wrong — Little Roamers is ages 3-5, Big Roamers is ages 6-10), Little Roamers listed as Full Day ending at 4PM (wrong — it's Half Day ending at 12PM), Big Roamers listed as "Nature Camp" rather than proper name. ID 506 (Big Roamers Jul 27-31) was repurposed as Rollin' Roamers Jul 27-31 — that week's schedule has only Little Roamers + Rollin' Roamers, not Big Roamers. ID 507 (Aug 4-7) cost corrected from $340 to $275 (short 4-day week due to BC Day). All had 2025 registrationUrls and confirmed2026=false.

3 camp types confirmed for 2026:
1. **Little Roamers Half Day Camp** — ages 3-5, Mon-Fri 9AM-12PM, $220/week
2. **Big Roamers Full Day Camp** — ages 6-10, Mon-Fri 9AM-4PM, $340/week (4-day Aug 4-7: $275)
3. **Rollin' Roamers Full Day Bike Camp** — ages 7-12, Mon-Fri 9AM-4PM, $340/week

---

## 2026 Summer Calendar (Full)

| ID | Program | Ages | Dates | Cost | Status |
|----|---------|------|-------|------|--------|
| 503 (corrected) | Little Roamers Half Day Camp | 3-5 | Jul 6-10 | $220 | Full/Waitlist |
| 613421 (**NEW**) | Big Roamers Full Day Camp | 6-10 | Jul 6-10 | $340 | Full/Waitlist |
| 504 (corrected) | Little Roamers Half Day Camp | 3-5 | Jul 13-17 | $220 | Full/Waitlist |
| 613422 (**NEW**) | Rollin' Roamers Full Day Bike Camp | 7-12 | Jul 13-17 | $340 | Open (1 spot) |
| 613423 (**NEW**) | Little Roamers Half Day Camp | 3-5 | Jul 20-24 | $220 | Full/Waitlist |
| 505 (corrected) | Big Roamers Full Day Camp | 6-10 | Jul 20-24 | $340 | Open (1 spot) |
| 613424 (**NEW**) | Little Roamers Half Day Camp | 3-5 | Jul 27-31 | $220 | Full/Waitlist |
| 506 (repurposed) | Rollin' Roamers Full Day Bike Camp | 7-12 | Jul 27-31 | $340 | Open |
| 507 (corrected) | Big Roamers Full Day Camp | 6-10 | Aug 4-7 | $275 | Open |
| 508 (corrected) | Big Roamers Full Day Camp | 6-10 | Aug 10-14 | $340 | Open |
| 613425 (**NEW**) | Big Roamers Full Day Camp | 6-10 | Aug 17-21 | $340 | Open (2 spots) |
| 613426 (**NEW**) | Big Roamers Full Day Camp | 6-10 | Aug 24-28 | $340 | Open |

---

## Corrections Applied to Existing Entries

| Field | Old | New | Affected IDs |
|-------|-----|-----|-------------|
| name | "Little Roamers Nature Camp" | "Little Roamers Half Day Camp" | 503, 504 |
| name | "Big Roamers Nature Camp" | "Big Roamers Full Day Camp" | 505, 507, 508 |
| name | "Big Roamers Nature Camp" | "Rollin' Roamers Full Day Bike Camp" | 506 (repurposed) |
| ageMin | 3 | 3 (unchanged) | 503, 504 |
| ageMax | 12 | 5 | 503, 504 |
| ageMin | 3 | 6 | 505, 507, 508 |
| ageMax | 12 | 10 | 505, 507, 508 |
| ageMin | 3 | 7 | 506 |
| ageMax | 12 | 12 (unchanged) | 506 |
| endTime | 4:00 PM | 12:00 PM | 503, 504 |
| scheduleType | Full Day | Half Day | 503, 504 |
| dayLength | Full Day | Half Day | 503, 504 |
| durationPerDay | 7 | 3 | 503, 504 |
| cost | 340 | 275 | 507 (4-day Aug 4-7 week) |
| priceVerified | false | true | 503, 504, 505, 506, 507, 508 |
| confirmed2026 | false | true | 503, 504, 505, 506, 507, 508 |
| registrationUrl | /port-coquitlam-summer-camps-2025/ | registration form / waitlist | all |
| lat | 49.26 | 49.2656 | all |
| lng | -122.773 | -122.7726 | all |
| costNote | — | Full details with pricing context | all |
| description | Generic | Accurate per-camp description | all |

---

## Notes

- Registration URL for open sessions: `https://roomtoroam.ca/summer-camp-2026-registration-form/`
- Waitlist URL for full sessions: `https://roomtoroam.ca/wait-list/`
- Aug 4-7 is a 4-day week (BC Day stat holiday Aug 3) — priced at $275 vs standard $340
- Rollin' Roamers requires children to ride independently with gears and hand brakes
- No registration fee for any program
- Ages are per child turning that age by end of 2026 (consistent with BC grade levels)
- Contact: registration@roomtoroam.ca (registration), info@roomtoroam.ca (program questions)
- Provider website had old 2025 URL in DB — 2026 URL confirmed from nav menu
- All camps at Lions Park, Port Coquitlam (lat 49.2656, lng -122.7726)
