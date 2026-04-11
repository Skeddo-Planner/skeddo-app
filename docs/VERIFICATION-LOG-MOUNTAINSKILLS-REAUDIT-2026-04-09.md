# Verification Log — Mountain Skills Academy & Adventures (RE-AUDIT)

**Audited:** 2026-04-09 (re-audit via Chrome browser)
**Queue entry:** Rank 244
**Source URLs verified (Chrome browser):**
- `https://www.mountainskillsacademy.com/camps/` — main camps listing
- `https://www.mountainskillsacademy.com/camps/kids-adventure-squamish/` — details, daily routine, pricing
- `https://www.mountainskillsacademy.com/camps/kids-climbing-squamish/` — details, ages 7-14
- `https://www.mountainskillsacademy.com/camps/teen-climbing-squamish/` — details, ages 13-16
- `https://mountainskillsacademy.rezdy.com/306436/` — Kids Adventure Squamish booking (4 dates, pricing)
- `https://mountainskillsacademy.rezdy.com/306437/` — Kids Adventure Whistler booking (5 dates, 1 sold out)
- `https://mountainskillsacademy.rezdy.com/434607/` — Kids Climbing Squamish booking (5 dates, 2 sold out)
- `https://mountainskillsacademy.rezdy.com/167375/` — Teen Climbing Squamish booking (4 dates)
- `https://mountainskillsacademy.rezdy.com/482631/` — Spring Break 3-Day (completed, no availability)
- `https://mountainskillsacademy.rezdy.com/482633/` — Spring Break 4-Day (completed, no availability)
**DB count before audit:** 16,424 programs
**DB count after audit:** 16,438 (6 removed, 20 added)

---

## Re-audit reason

Prior audit had 6 generic "Mountain Adventure Camp" placeholders with cost=null and confirmed2026=false. Chrome re-audit found 4 distinct programs across 18 summer sessions plus 2 completed spring break sessions, all with verified pricing via Rezdy booking system.

---

## Programs Added (20 — replacing 6 generic placeholders)

### Kids Adventure Camp — Squamish ($515/5-day, $125/drop-in, ages 7-12)

| ID | Dates | Status |
|----|-------|--------|
| msa-adv-sq-jul6 | Jul 6-10 | Open |
| msa-adv-sq-jul20 | Jul 20-24 | Open |
| msa-adv-sq-aug3 | Aug 3-7 | Open |
| msa-adv-sq-aug17 | Aug 17-21 | Open |

### Kids Adventure Camp — Whistler ($515/5-day, $125/drop-in, ages 7-12)

| ID | Dates | Status |
|----|-------|--------|
| msa-adv-wh-jun29 | Jun 29-Jul 3 | Open |
| msa-adv-wh-jul13 | Jul 13-17 | Open |
| msa-adv-wh-jul27 | Jul 27-31 | Full (Sold Out) |
| msa-adv-wh-aug10 | Aug 10-14 | Open |
| msa-adv-wh-aug24 | Aug 24-28 | Open |

### Kids Climbing & Adventure Camp — Squamish ($535/5-day, $129/drop-in, ages 7-14)

| ID | Dates | Status |
|----|-------|--------|
| msa-climb-sq-jun29 | Jun 29-Jul 3 | Full (Sold Out) |
| msa-climb-sq-jul13 | Jul 13-17 | Open |
| msa-climb-sq-jul27 | Jul 27-31 | Full (Sold Out) |
| msa-climb-sq-aug10 | Aug 10-14 | Open |
| msa-climb-sq-aug24 | Aug 24-28 | Open |

### Teen Climbing Camp — Squamish ($585/5-day, $135/drop-in, ages 13-16)

| ID | Dates | Status |
|----|-------|--------|
| msa-teen-sq-jul6 | Jul 6-10 | Open |
| msa-teen-sq-jul20 | Jul 20-24 | Open |
| msa-teen-sq-aug3 | Aug 3-7 | Open |
| msa-teen-sq-aug17 | Aug 17-21 | Open |

### Spring Break Camps — Completed

| ID | Name | Days | Cost | Status |
|----|------|------|------|--------|
| msa-sb-3day | Spring Break Adventure 3 Days | Mar 23-25 | $325 | Completed |
| msa-sb-4day | Spring Break Adventure 4 Days | Mar 23-26 | $389 | Completed |

---

## Completeness Check

Provider shows 5 programs on main camps page (Kids Adventure Squamish, Kids Adventure Whistler, Kids Climbing Squamish, Teen Climbing Squamish, Spring Break Squamish). Spring Break has 2 sub-options (3-day, 4-day). Rezdy booking pages show 18 summer sessions + 2 spring break = 20 total. We have all 20.

---

## Notes

- Booking via Rezdy (mountainskillsacademy.rezdy.com)
- All camps: 9am-3pm, Mon-Fri
- Phone: 604-938-9242 | Email: info@mountainskillsacademy.com
- Office: 207B-4368 Main St, Market Pavilion, Whistler, BC V8E 1B6
- ACMG certified guides
- Cancellation: 100% forfeit within 30 days, $75 reschedule fee outside 30 days
- Liability waiver required
- Kids Adventure: Via Ferrata, mountain biking, rock climbing, water day, wilderness discovery
- Kids Climbing: Half day climbing + half day adventure (hiking, outdoor skills, games)
- Gondola ticket required for specific days (not included in camp price)
- Kids need own mountain bike for biking days (or rent from RideHub/Premium Rentals)
- Age discrepancy: Climbing camp shows 7-12 on Rezdy but 7-14 on main site — used 7-14 from main site
- 3 sessions sold out: Whistler Jul 27, Climbing Jun 29, Climbing Jul 27
