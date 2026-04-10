# Verification Log — UTG Academy (RE-AUDIT)

**Audited:** 2026-04-09 (re-audit via Chrome browser)
**Queue entry:** Rank 240
**Source URLs verified (Chrome browser):**
- `https://utgacademy.com/courses/?courseCategory=summer` — full summer catalog (JS-rendered with scheduleOptions data)
- `https://kitsilano.underthegui.com/product/summer-coding-camp-full-day-ultimate/` — $560 verified
- `https://kitsilano.underthegui.com/product/summer-coding-camp-half-day/` — $300 verified
- `https://kitsilano.underthegui.com/product/summer-robotics-camp-half-day/` — $375 verified
- `https://kitsilano.underthegui.com/product/summer-robotics-camp-full-day-ultimate-4/` — $625 verified
- `https://kitsilano.underthegui.com/product/summer-digital-art-camp-half-day/` — $375 verified
- `https://kitsilano.underthegui.com/product/summer-digital-art-camp-full-day-ultimate/` — $625 verified
**DB count before audit:** 16,398 programs
**DB count after audit:** 16,422 (3 removed, 27 added)

---

## Re-audit reason

Prior audit used WebFetch which returned no useful data — site is JS-heavy WooCommerce. Chrome browser captured the full summer camp catalog with JavaScript schedule data showing all 27 sessions across 6 program types. Old entries had wrong address (North Vancouver instead of Kitsilano), no prices, no dates.

---

## Corrections Applied

| Field | Old (3 entries) | New (27 entries) |
|-------|----------------|-----------------|
| address | 200-1046 St Georges Ave, North Vancouver | 210-1909 W Broadway, Vancouver, BC V6J 1Z3 |
| neighbourhood | Lower Lonsdale | Kitsilano |
| city | North Vancouver | Vancouver |
| cost | null | $300-$625 (verified per program type) |
| confirmed2026 | false | true |
| priceVerified | false | true |
| enrollmentStatus | Likely Coming Soon | Open |
| count | 3 generic entries | 27 individual sessions |

---

## Completeness Check

**Provider shows 27 sessions across 6 program types. We have 27.**

### Coding Camp Full Day (Ultimate) — $560 (4 sessions)
| # | Dates | Days | Our DB |
|---|-------|------|--------|
| 1 | Jun 29 - Jul 3 | Mon-Tue, Thu-Fri | utg-coding-fd-1 |
| 2 | Jul 27 - Jul 31 | Mon-Fri | utg-coding-fd-2 |
| 3 | Aug 10 - Aug 14 | Mon-Fri | utg-coding-fd-3 |
| 4 | Aug 24 - Aug 28 | Mon-Fri | utg-coding-fd-4 |

### Coding Camp Half Day — $300 (5 sessions)
| # | Dates | Time | Our DB |
|---|-------|------|--------|
| 1 | Jun 29 - Jul 3 | PM 12:45-4pm | utg-coding-hd-1 |
| 2 | Jul 6 - Jul 10 | AM 9-12:15pm | utg-coding-hd-2 |
| 3 | Aug 4 - Aug 7 | AM 9-12:15pm | utg-coding-hd-3 |
| 4 | Aug 10 - Aug 14 | PM 12:45-4pm | utg-coding-hd-4 |
| 5 | Aug 24 - Aug 28 | PM 12:45-4pm | utg-coding-hd-5 |

### Robotics Camp Half Day — $375 (10 sessions)
| # | Dates | Time | Our DB |
|---|-------|------|--------|
| 1 | Jun 29 - Jul 3 | AM 9-12:15pm | utg-robotics-hd-1 |
| 2 | Jul 6 - Jul 10 | PM 12:45-4pm | utg-robotics-hd-2 |
| 3 | Jul 13 - Jul 17 | AM 9-12:15pm | utg-robotics-hd-3 |
| 4 | Jul 20 - Jul 24 | PM 12:45-4pm | utg-robotics-hd-4 |
| 5 | Jul 27 - Jul 31 | PM 12:45-4pm | utg-robotics-hd-5 |
| 6 | Jul 27 - Jul 31 | AM 9-12:15pm | utg-robotics-hd-6 |
| 7 | Aug 4 - Aug 7 | PM 12:45-4pm | utg-robotics-hd-7 |
| 8 | Aug 10 - Aug 14 | AM 9-12:15pm | utg-robotics-hd-8 |
| 9 | Aug 17 - Aug 21 | PM 12:45-4pm | utg-robotics-hd-9 |
| 10 | Aug 24 - Aug 28 | AM 9-12:15pm | utg-robotics-hd-10 |

### Robotics Camp Full Day (Ultimate) — $625 (4 sessions)
| # | Dates | Days | Our DB |
|---|-------|------|--------|
| 1 | Jul 6 - Jul 10 | Mon-Fri | utg-robotics-fd-1 |
| 2 | Jul 20 - Jul 24 | Mon-Fri | utg-robotics-fd-2 |
| 3 | Aug 4 - Aug 7 | Tue-Fri | utg-robotics-fd-3 |
| 4 | Aug 17 - Aug 21 | Mon-Fri | utg-robotics-fd-4 |

### Digital Art Camp Half Day — $375 (3 sessions)
| # | Dates | Time | Our DB |
|---|-------|------|--------|
| 1 | Jul 13 - Jul 17 | PM 12:45-4pm | utg-digart-hd-1 |
| 2 | Jul 20 - Jul 24 | AM 9-12:15pm | utg-digart-hd-2 |
| 3 | Aug 17 - Aug 21 | AM 9-12:15pm | utg-digart-hd-3 |

### Digital Art Camp Full Day (Ultimate) — $625 (1 session)
| # | Dates | Days | Our DB |
|---|-------|------|--------|
| 1 | Jul 13 - Jul 17 | Mon-Fri | utg-digart-fd-1 |

---

## Notes

- Address: 210-1909 W Broadway, Vancouver, BC V6J 1Z3 (Kitsilano — head office)
- Phone: (604) 715-6471 / (604) 700-9931
- Registration via WooCommerce at kitsilano.underthegui.com
- Full Day (Ultimate) camps = half day STEM + half day Ultimate Frisbee with Elevate
- Ages 7-14 for all programs, grouped internally by age and skill
- No prior experience required for any camp
- Jun 29 and Aug 4 weeks are 4-day weeks (Canada Day / BC Day)
- Week of Jul 27 has TWO robotics half-day sessions (AM + PM)
- All prices are per week
