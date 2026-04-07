# Verification Log — LWL Education

**Audited:** 2026-04-06
**Queue entry:** Rank 196
**Source URLs verified (browser navigation):**
- `https://www.lwleducation.com/summer-camp` (camp details, times, curriculum, registration status)
**DB count before audit:** 16,254 programs
**DB count after audit:** 16,254 (0 added, 4 corrected)

---

## Summary

4 existing entries corrected. Programs are confirmed open for Summer 2026 registration ("Contact us now to register!", early bird discount until May 31). Start/end times were wrong (9AM-4PM → 9:30AM-3PM confirmed from page). Cost $325 was unverified — pricing requires contacting LWL directly (not listed on website). Name corrected from "Literacy & Public Speaking Camp" to "Language & Arts Summer Camp". Tags corrected (removed STEM — program is Language & Arts). Age range 3-13 justified with ageSpanJustified (provider groups internally by age, no separate age-band registrations).

---

## Program Confirmed

| Field | Value |
|-------|-------|
| Name | Language & Arts Summer Camp |
| Ages | 3-13 (grouped internally by age level) |
| Morning option | 9:30 AM - 12:00 PM |
| Afternoon option | 12:30 PM - 3:00 PM |
| Full Day | 9:30 AM - 3:00 PM |
| Location | Kerrisdale campus (5860 East Boulevard, Vancouver) |
| Also available | Richmond campus, Online |
| Enrollment | Open — contact to register |
| Early Bird deadline | May 31, 2026 (early bird discount + $20 off) |

---

## Curriculum (verified)

1. Storytelling and discussion (28 rotating themes, 600+ picture books)
2. Arts and crafts
3. Phonics and writing (levelled from beginner to upper advanced)
4. Confident communication and public speaking

---

## Corrections Applied

| Field | Old | New | IDs |
|-------|-----|-----|-----|
| name | "Literacy & Public Speaking Camp" | "Language & Arts Summer Camp" | 613, 614, 615, 616 |
| startTime | 9:00 AM | 9:30 AM | 613, 614, 615, 616 |
| endTime | 4:00 PM | 3:00 PM | 613, 614, 615, 616 |
| durationPerDay | 7 | 5.5 | 613, 614, 615, 616 |
| cost | 325 | null | 613, 614, 615, 616 |
| confirmed2026 | false | true | 613, 614, 615, 616 |
| enrollmentStatus | Likely Coming Soon | Open | 613, 614, 615, 616 |
| tags | literacy, public speaking, STEM, reading | literacy, arts, public speaking, writing, language | 613, 614, 615, 616 |
| activityType | General STEM | Language & Literacy | 613, 614, 615, 616 |
| ageSpanJustified | — | Note: provider groups 3-13 internally, no sub-band registrations | 613, 614, 615, 616 |
| costNote | — | Full explanation with early bird details | 613, 614, 615, 616 |
| description | Generic | Accurate description from provider page | 613, 614, 615, 616 |

---

## Notes

- Pricing not listed publicly — must contact LWL directly. The prior $325 was an unverified estimate.
- Children may attend single days or multi-day — not strictly Mon-Fri week-long format
- Reservation recommended 48 hours in advance
- Richmond campus also available (separate entry may be warranted in future)
- Online camp option also exists (not in DB)
- Address 5860 East Boulevard, Vancouver (Kerrisdale) — not explicitly confirmed from this page but consistent with neighbourhood field
- Registration form asks for: child's name/DOB, timezone, preferred time slot, subject preferences, special requirements
