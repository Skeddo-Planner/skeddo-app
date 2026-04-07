# Verification Log — Hero Academy

**Audited:** 2026-04-06
**Queue entry:** Rank 185
**Source URLs verified (browser navigation):**
- `https://hero-academy.ca/kids-camps-north-vancouver/` (summer camps — all weeks, pricing, ages confirmed)
- `https://hero-academy.ca/kids-martial-arts-north-vancouver/` (martial arts programs — active status confirmed)
**DB count before audit:** 16,209 programs
**DB count after audit:** 16,210 (1 added, 1 corrected)

---

## Summary

Entry 16055 had 3 errors: early bird price ($330 → $350), endDate wrong (Aug 28 → Aug 14, the actual last ages-5-10 week), and ageMax wrong (11 → 10). The site clearly distinguishes 4 weeks for ages 5-10 and 2 weeks for ages 8-11. Added missing entry 16159 for the ages 8-11 camp weeks (Jul 13-17, Aug 17-21). Martial arts class entries (16051-16053) confirmed active and valid; no changes needed. After-school care (16054) was not re-verified as it's unchanged.

---

## Confirmed Summer Camp Data

| Week | Ages | Cost | Early Bird | Status |
|------|------|------|------------|--------|
| Jul 6–10 | 5–10 | $440 | $350 (till Apr 30) | Open |
| Jul 13–17 | 8–11 | $440 | $350 (till Apr 30) | Open |
| Jul 20–24 | 5–10 | $440 | $350 (till Apr 30) | Open |
| Jul 27–31 | 5–10 | $440 | $350 (till Apr 30) | Open |
| Aug 3–7 | — | — | — | No camp (BC Day holiday) |
| Aug 10–14 | 5–10 | $440 | $350 (till Apr 30) | Open |
| Aug 17–21 | 8–11 | $440 | $350 (till Apr 30) | Open |

- **Time:** 9:00 AM – 3:00 PM Mon–Fri
- **Location:** 208–250 East Esplanade, North Vancouver (entrance in alley)
- **Subsidies:** Harbourside Youth Foundation and Athletics 4 Kids (up to 100% coverage)
- **Registration:** hero-academy.ca/kids-camps-north-vancouver/ → "Register Now" buttons (WellnessLiving)

---

## Fixes Applied to Existing Entries

| Field | Old | New | Affected ID |
|-------|-----|-----|-------------|
| name | "Ages 5-11" | "Ages 5-10" | 16055 |
| ageMax | 11 | 10 | 16055 |
| endDate | 2026-08-28 | 2026-08-14 | 16055 |
| costNote | Early bird $330 | Early bird $350, specific dates added | 16055 |
| description | Ages 5–11 reference | Ages 5–10, specific weeks listed | 16055 |
| repeating | missing | true | 16055 |
| priceVerified | — | true | 16055 |

---

## New Entry Added

| ID | Program | Ages | Weeks | Cost | Status |
|----|---------|------|-------|------|--------|
| 16159 | Hero Academy Kids Summer Camp (Ages 8-11) | 8–11 | Jul 13–17, Aug 17–21 | $440/week | Open (**NEW**) |

---

## Martial Arts Classes (16051–16053) — Confirmed No Changes Needed

- Website confirms JITS (K–Grade 7) and STRIKE (K–Grade 7) programs are active
- MMA listed as "coming soon" — no DB entry exists, correct
- Pricing not shown on marketing page; existing entries with priceVerified:true retained
- Entry 16054 (after-school care) not re-verified (unchanged, cost=null with note)

---

## Notes

- BC Day (Aug 3) falls on a Monday 2026; the Aug 3–7 week has no camp, hence no entry for that week
- The camps page explicitly says ages 5–10 for 4 weeks and ages 8–11 for 2 weeks — these are distinct programs
- "Register Now" buttons lead to WellnessLiving scheduling system (wellnessliving.com/rs/event/heroacademy)
- Early bird pricing expires April 30, 2026
