# Verification Log — Alliance Française Vancouver

**Audited:** 2026-04-06
**Queue entry:** Rank 164
**Source URLs verified:**
- `https://www.alliancefrancaise.ca/en/language/kids-and-teens-classes/summer-break/` (full 2026 schedule, pricing, age groups)
**Address:** 6161 Cambie Street, Vancouver, BC V5Z 3B2
**DB count before audit:** 16,183 programs
**DB count after audit:** 16,183 (0 added, 6 corrected — no new entries needed)

---

## Summary

Alliance Française Vancouver offers two types of summer programs: morning intensive French classes (4 x 2-week sessions, Jul 6–Aug 28) and afternoon activity camps (weekly, Jul–Aug). The DB had 6 entries (603-608) all marked "Likely Coming Soon" and isEstimate=true. Morning sessions (603-606) have confirmed 2026 dates and confirmed price ($465) on the website. Afternoon camps (607-608) have confirmed price ($230) but 2026 dates not yet published.

---

## Program Details

### Morning Intensive French Classes (confirmed 2026)

| Field | Value |
|-------|-------|
| Sessions | 4 x 2-week sessions (Jul 6–Aug 28) |
| Hours | 9:00 AM – 12:00 PM (Mon-Fri) |
| Price | $465/session |
| Ages | 5-7 yr, 8-11 yr, 12+ yr (teens — three age groups, same price) |
| Registration | Opening early April 2026 |
| Course selector | `/af/course-selector/?age_group_id=X&session_id=197` or 198 |

| Session | Dates | DB Entry |
|---------|-------|----------|
| 1 | Jul 6-17 | 603 |
| 2 | Jul 20-31 | 604 |
| 3 | Aug 4-14 | 605 |
| 4 | Aug 17-28 | 606 |

### Afternoon Activity Camps (2026 dates not yet published)

| Field | Value |
|-------|-------|
| Duration | 1 week per session |
| Hours | 12:00 PM – 3:00 PM (Mon-Fri) |
| Price | $230/week |
| Ages | 6-9 years |
| 2025 season | 9 weeks (Jul 7–Aug 29, with themes: Harry Potter, Safari, Pokémon, etc.) |
| 2026 status | Price confirmed; specific dates/themes not yet announced |

---

## Fixes Applied

| Field | Old (603-606) | New |
|-------|--------------|-----|
| enrollmentStatus | Likely Coming Soon | Open (dates + price confirmed for 2026) |
| confirmed2026 | false | true |
| isEstimate | true | false (dates confirmed on website) |
| priceVerified | false | true ($465 confirmed) |
| ageMax | 12 | 17 ("12 years and up" includes teens to ~17) |
| ageSpanJustified | (missing) | Added (5-17 covers 3 age groups: 5-7, 8-11, 12-17) |
| address | No postal code | "6161 Cambie Street, Vancouver, BC V5Z 3B2" |
| description | Old text | Updated to reflect confirmed program details |
| costNote | "Based on 2025 pricing" | "Morning intensive: $465/2-week session confirmed for 2026" |

| Field | Old (607-608) | New |
|-------|--------------|-----|
| priceVerified | false | true ($230/week confirmed) |
| cost | 230 | 230 (confirmed, unchanged) |
| costNote | old | Updated with 2026 status note |
| address | No postal code | Added V5Z 3B2 |

---

## Notes

- Morning sessions: website explicitly shows 2026 schedule table (4 sessions Jul 6–Aug 28) — confirmed
- Afternoon camps: only "2025 Themes" shown; 2026 themes not yet published. DB entries for Jul 6-10 and Jul 13-17 are reasonable estimates. Full summer of afternoon camps (all weeks Jul-Aug) in 2026 likely — but not adding speculative entries.
- Three age groups for morning sessions (5-7, 8-11, 12+) combined into one DB entry per session with ageSpanJustified rather than creating 12 separate entries (3 groups × 4 sessions)
- Advanced French program (A2.1 level, ages 8-11, French immersion students) noted on website but not in DB — potential future addition
- Address confirmed: 6161 Cambie, V5Z 3B2 (note: Riley Park / Cambie area, not downtown)
