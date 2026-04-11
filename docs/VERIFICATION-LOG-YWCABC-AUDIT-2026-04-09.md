# Verification Log — YWCA BC

**Audited:** 2026-04-09
**Queue entry:** Rank 205
**Source URLs verified (browser navigation):**
- `https://ywcabc.org/child-care` (all 4 centres — hours, fees, ages, addresses)
- `https://ywcabc.org/programs/` (404 — old URL no longer valid)
**DB count before audit:** 16,267 programs
**DB count after audit:** 16,267 (0 added, 4 corrected)

---

## Summary

4 YWCA BC childcare/early learning centres verified. All had wrong startTime (7:30 AM in DB vs actual hours per centre). registrationUrl was broken (ywcabc.org/programs/ returns 404) — corrected to ywcabc.org/child-care. Hours and durationPerDay corrected per centre. All remain on Waitlist (~20 months). Set confirmed2026=true.

---

## Programs Verified (all fields browser-checked)

| ID | Centre | Ages | Hours | Cost | Status |
|----|--------|------|-------|------|--------|
| ywca-citygate | Citygate Early Learning | 3-5 | 7:45 AM - 5:30 PM | $200/mo | Waitlist |
| ywca-crabtree | Crabtree Corner | 0-5 | 9:00 AM - 3:30 PM | Free | Waitlist |
| ywca-emma | Emma's Early Learning | 0-3 | 8:00 AM - 4:00 PM | $200/mo | Waitlist |
| ywca-leslie | Leslie Diamond | 0-3 | 7:45 AM - 5:30 PM | $200/mo | Waitlist |

---

## Corrections Applied

| Field | Old | New | IDs |
|-------|-----|-----|-----|
| registrationUrl | ywcabc.org/programs/ (404) | ywcabc.org/child-care | all 4 |
| confirmed2026 | false | true | all 4 |
| urlVerified | false | true | all 4 |
| startTime | 7:30 AM | 7:45 AM | ywca-citygate, ywca-leslie |
| startTime | 7:30 AM | 9:00 AM | ywca-crabtree |
| startTime | 7:30 AM | 8:00 AM | ywca-emma |
| endTime | 5:30 PM | 3:30 PM | ywca-crabtree |
| endTime | 5:30 PM | 4:00 PM | ywca-emma |
| durationPerDay | 10 | 9.75 | ywca-citygate, ywca-leslie |
| durationPerDay | 10 | 6.5 | ywca-crabtree |
| durationPerDay | 10 | 8 | ywca-emma |

---

## Notes

- All centres year-round programs (not summer camps)
- $200/month fees are after $10-a-Day BC childcare subsidy
- Crabtree Corner: free short-term care, up to 12 days/month
- Emma's: focus on supporting young mothers
- Leslie Diamond & Emma's: toddler spaces reserved for graduates of infant program; new children only through infant program, cutoff age 15 months
- Waitlist ~20 months, contact njatskevich@ywcabc.org
- ywcavan.org now redirects to ywcabc.org (rebranded)
- No summer camps or youth activity programs offered by YWCA BC
