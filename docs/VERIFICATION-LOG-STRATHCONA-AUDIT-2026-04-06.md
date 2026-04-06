# Verification Log — City of Vancouver - Strathcona Community Centre

**Audited:** 2026-04-06
**URL:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=51&min_age=0&max_age=17&activity_keyword=camp&viewMode=list
**center_id:** 51 (confirmed via Where filter checkbox extraction)
**Live camp count:** 25 programs matching "camp" keyword (ages 0–17)
**DB count before audit:** 40 programs (legacy IDs 1803–1822 + COV-*)
**DB count after audit:** +5 programs added → 15,835 total

---

## Summary

Strathcona Community Centre operates the Supershine Summer Day Camp in three age bands:
- Ages 5–7 yrs (Wk 1–8)
- Ages 8–9 yrs (Wk 1–8)
- Ages 10–13 yrs (Wk 1–8)

A Pro-D Day Camp was also listed for April 20, 2026.

The DB already had complete coverage for 5–7yrs (IDs 1811–1818) and 10–13yrs (IDs 1803–1810), and partial coverage for 8–9yrs (IDs 1819–1822 = Wk 1–4). Weeks 5–8 of the 8–9yrs group were missing.

**Dual-ID formula confirmed for center_id=51:**
- Supershine 8-9yrs Wk 1 display #586171 → URL 583249 ✓ (in DB as ID 1819)
- Supershine 8-9yrs Wk 5 display #586175 → URL 583253 ✓ (verified at detail/583253)
- Pro-D Day Camp display #586308 → URL 583386 ✓ (verified at detail/583386)

---

## Programs Added (5 total)

### Supershine Summer Day Camp (8-9yrs) — Weeks 5–8

| ID | Week | Dates | Days | Cost |
|----|------|-------|------|------|
| COV-583253 | Wk 5 | Jul 27–31, 2026 | Mon–Fri | $140 |
| COV-583254 | Wk 6 | Aug 4–7, 2026 | Tue–Fri (BC Day off) | $112 |
| COV-583255 | Wk 7 | Aug 10–14, 2026 | Mon–Fri | $140 |
| COV-583256 | Wk 8 | Aug 17–21, 2026 | Mon–Fri | $140 |

Time: 9:00 AM – 4:00 PM | Ages: 8–9 yrs | Indoor | Gymnasium -2/3

### Pro-D Day Camp

| ID | Date | Days | Time | Ages | Cost |
|----|------|------|------|------|------|
| COV-583386 | Apr 20, 2026 | Mon | 9:00 AM – 3:00 PM | 5–12 | $25 |

Status: Full/Waitlist | Ages 5–12 offered as single group (ageSpanJustified=true) | Spring 2026

---

## Programs Already in DB

| Category | Weeks | DB Coverage |
|----------|-------|-------------|
| Supershine 5–7yrs | Wk 1–8 | IDs 1811–1818 ✓ |
| Supershine 8–9yrs | Wk 1–4 | IDs 1819–1822 ✓ |
| Supershine 10–13yrs | Wk 1–8 | IDs 1803–1810 ✓ |

---

## Fee Verification

All fees verified via ActiveNet fee modal (browser navigation):

| Program | URL ID | Fee |
|---------|--------|-----|
| Supershine 8-9yrs Wk 5 (5-day) | 583253 | $140 |
| Supershine 8-9yrs Wk 6 (4-day BC Day) | 583254 | $112 |
| Supershine 8-9yrs Wk 7 (5-day) | 583255 | $140 |
| Supershine 8-9yrs Wk 8 (5-day) | 583256 | $140 |
| Pro-D Day Camp | 583386 | $25 |

Rate: $28/day for 8–9yrs group (consistent with Wk 1 = $112 for 4-day Canada Day week)

---

## Gap Analysis

| Category | Live Count | DB Added | Notes |
|----------|-----------|---------|-------|
| Supershine 8-9yrs Wk 1–4 | 4 | 0 | Already in DB (IDs 1819-1822) |
| Supershine 8-9yrs Wk 5–8 | 4 | 4 | Complete |
| Supershine 5-7yrs Wk 1–8 | 8 | 0 | Already in DB (IDs 1811-1818) |
| Supershine 10-13yrs Wk 1–8 | 8 | 0 | Already in DB (IDs 1803-1810) |
| Pro-D Day Camp | 1 | 1 | Complete |

---

## Notes

- center_id=51 confirmed for Strathcona Community Centre
- Registration for Supershine camps: April 8, 2026 at 7:00 PM
- BC Day (Aug 3): Wk 6 runs Tue–Fri only (4 days), reduced fee $112 vs $140 for 5-day
- Canada Day (Jul 1): Wk 1 runs Mon/Tue/Thu/Fri (4 days) — already in DB (IDs 1819–1822)
- Pro-D Day: April 20, 2026 is Full/Waitlist; ages 5–12 listed as single group by provider
- Online registration not available for Supershine camps ("contact us during regular business hours")
