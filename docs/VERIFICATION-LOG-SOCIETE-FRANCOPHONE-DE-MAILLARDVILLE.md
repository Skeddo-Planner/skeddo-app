# Verification Log — Societe Francophone de Maillardville

**Audit date:** 2026-04-05
**Auditor:** Claude (automated)
**Registration page URL:** https://maillardville.com/activities/french-summer-camp/
**Overall status:** COMPLETED — 2026 data fully verified

---

## Summary

| Metric | Value |
|--------|-------|
| Programs found on live page | 8 themed weeks |
| Programs in database (before audit) | 9 (8 weekly + 1 duplicate generic) |
| Programs added | 0 |
| Programs fixed | 8 (price, names, status updated) |
| Programs marked Completed | 1 (sfm-french-1 duplicate) |

---

## Registration Page Details

**URL:** https://maillardville.com/activities/french-summer-camp/
**Provider:** Société Francophone de Maillardville
**Organization type:** French cultural non-profit, Port Coquitlam
**Address:** École des Pionniers-de-Maillardville, 1618 Patricia Avenue, Port Coquitlam, BC V3B 4A9
**Phone:** (604) 515-7070
**Email:** info@maillardville.com
**Office:** 938 Brunette Avenue, Suite 200, Coquitlam, BC V3K 1C9

---

## 2026 Program Data (verified from live page)

### Common Details (all weeks)
- **Ages:** 5 to 12 years old (single mixed-age group — no age bands)
- **Times:** 8:30 AM – 3:00 PM, Monday–Friday
- **Cost:** $195/week per child
- **Admin fee:** $25 per registration per child (mandatory, non-refundable)
- **Aftercare:** Available 3:00 PM – 5:00 PM, $20/day (limited spots)
- **Language requirement:** Good knowledge of French required
- **Cancellation policy:** All payments non-refundable

### Weekly Themes

| ID | Name | Dates | Theme |
|----|------|-------|-------|
| maillardville-french-w1 | Maillardville French Summer Camp — Week 1: Sonic Mission | Jul 6–10, 2026 | Music and sound exploration |
| maillardville-french-w2 | Maillardville French Summer Camp — Week 2: Legends & Wonders | Jul 13–17, 2026 | Magical creatures |
| maillardville-french-w3 | Maillardville French Summer Camp — Week 3: Guardians of the Animal World | Jul 20–24, 2026 | Nature focus |
| maillardville-french-w4 | Maillardville French Summer Camp — Week 4: Heroes of the Universe | Jul 27–31, 2026 | Space exploration |
| maillardville-french-w5 | Maillardville French Summer Camp — Week 5: Super Athletes | Aug 3–7, 2026 | Olympic-themed activities |
| maillardville-french-w6 | Maillardville French Summer Camp — Week 6: Lights, Camera, Action! | Aug 10–14, 2026 | Film creation |
| maillardville-french-w7 | Maillardville French Summer Camp — Week 7: Mission Geniuses! | Aug 17–21, 2026 | Scientific experiments |
| maillardville-french-w8 | Maillardville French Summer Camp — Week 8: Heroes of Tomorrow | Aug 24–28, 2026 | Robotics and innovation |

---

## Changes Made

| ID | Field | Before | After |
|----|-------|--------|-------|
| w1–w8 | name | Generic "Maillardville French Summer Camp — Week N" | Added themed subtitle |
| w1–w8 | cost | null | 195 |
| w1–w8 | priceVerified | false | true |
| w1–w8 | confirmed2026 | true | true (unchanged) |
| w1–w8 | enrollmentStatus | Likely Coming Soon | Open |
| w1–w8 | costNote | "Not yet posted for 2026" | Full pricing details incl. admin fee and aftercare |
| w1–w8 | description | Generic | Theme-specific description |
| w1–w8 | ageSpanJustified | (missing) | Added — provider confirms single 5–12 group |
| sfm-french-1 | enrollmentStatus | Likely Coming Soon | Completed (duplicate generic entry) |

---

## Age Group Verification

The website explicitly states "children aged 5 to 12 years old" as a single group. There are no separate age bands, cohorts, or groupings by age within any week. All ages 5–12 participate together. The `ageSpanJustified` field was added to suppress false R43/R46 warnings.

---

## Discrepancies Resolved

- **sfm-french-1:** This was a generic duplicate entry without specific dates. Marked as Completed since the 8 week-specific entries (maillardville-french-w1 through w8) are the canonical records.
- **Cost:** Was null / "Not yet posted for 2026." Confirmed $195/week from live registration page.
- **Program names:** Added themed week subtitles as shown on the registration page.

---

## Count Verification

Provider shows 8 weeks (Week 1–8). Database had 9 entries (8 weekly + 1 duplicate). After audit: 8 active weekly entries + 1 Completed duplicate = correct.
