# Verification Log — The Hive Climbing

**Date:** 2026-04-04
**Auditor:** Claude (autonomous audit agent)
**Registration Page:** https://hiveclimbing.com/youth-kids/camps/
**Additional Pages:**
- https://app.rockgympro.com/b/widget/?a=offering&offering_guid=1a70718db6034985b9fb171a208ce60b&widget_guid=f1dcb82d0e2a4bac941fcc43a0d78236&iframeid=&mode=p (Juniors Summer Camps)
- https://app.rockgympro.com/b/widget/?a=offering&offering_guid=68ab660dcdff41319bc78f076ceec443&widget_guid=f1dcb82d0e2a4bac941fcc43a0d78236&iframeid=&mode=p (Inters Summer Camps)
- https://app.rockgympro.com/b/widget/?a=offering&offering_guid=acecbe7e64ac4759860b95a873616126&widget_guid=27362b193418402f83d637ea5ac267b1&iframeid=&mode=p (Spring Break Juniors)
- https://app.rockgympro.com/b/widget/?a=offering&offering_guid=001c05cc478c432187be45355cd106eb&widget_guid=27362b193418402f83d637ea5ac267b1&iframeid=&mode=p (Spring Break Inters)

---

## Summary

**Previous database:** 33 entries (mix of old generic entries and newer detailed entries)
**After audit:** 33 entries (12 status updates, no adds needed)
**Programs added:** 0
**Programs updated:** 12 (status corrections)

### Locations Checked

The Hive operates 6 locations (Vancouver Boulder, Vancouver Heights, North Shore, Port Coquitlam, Surrey, Winnipeg). Youth camp programs in Metro Vancouver are only offered at:
- **The Hive North Shore** — 140-2270 Dollarton Hwy, North Vancouver, BC V7H 1A8

Vancouver Boulder and Vancouver Heights do not list youth camps online (youth bookings 0-15 must be made by phone per the website). Port Coquitlam lists a "Family Intro to Bouldering" course but no summer camps.

---

## Programs Found on Live Registration Page

### Spring Break Camps — Hive North Shore (March 2026)

Registration opened January 12, 2026. Both weeks of Spring Break camps are now past (March 16-20 and March 23-27).

| Age Group | Dates | Price | Status |
|-----------|-------|-------|--------|
| Juniors (Ages 6-8) | March 16-20, 2026 | $475/week | Completed |
| Inters (Ages 9-12) | March 16-20, 2026 | $475/week | Completed |
| Juniors (Ages 6-8) | March 23-27, 2026 | $475/week | Completed |
| Inters (Ages 9-12) | March 23-27, 2026 | $475/week | Completed |

Times: 9 AM – 4 PM, Monday-Friday

### Summer Camps 2026 — Hive North Shore

Registration opened March 30, 2026 at 10 AM (first-come, first-served).

**Juniors (Ages 6-8) — $475/week, Mon-Fri 9 AM–4 PM**

| Week | Dates | Live Status | DB Status | Action |
|------|-------|-------------|-----------|--------|
| 1 | Jun 29–Jul 3 | Available | Open | No change |
| 2 | Jul 6–10 | **Full** | Waitlist → **Full** | Updated |
| 3 | Jul 13–17 | Available | Open | No change |
| 4 | Jul 20–24 | Available | Open | No change |
| 5 | Jul 27–31 | Available | Open | No change |
| 6 | Aug 3–7 | Available | Open | No change |
| 7 | Aug 10–14 | **Full** | Waitlist → **Full** | Updated |
| 8 | Aug 17–21 | Available | Open | No change |
| 9 | Aug 24–28 | Available | Open | No change |

**Inters (Ages 9-12) — $475/week, Mon-Fri 9 AM–4 PM**

| Week | Dates | Live Status | DB Status | Action |
|------|-------|-------------|-----------|--------|
| 1 | Jun 29–Jul 3 | Open | Open | No change |
| 2 | Jul 6–10 | Open | Open | No change |
| 3 | Jul 13–17 | Open | Open | No change |
| 4 | Jul 20–24 | Open | Open | No change |
| 5 | Jul 27–31 | Open | Open | No change |
| 6 | Aug 3–7 | Open | Open | No change |
| 7 | Aug 10–14 | Open | Open | No change |
| 8 | Aug 17–21 | Open | Open | No change |
| 9 | Aug 24–28 | Open | Open | No change |

---

## Duplicate / Outdated Entries Resolved

The following old entries were superseded by the detailed per-week entries (IDs 15790-15811) from a prior audit. They were marked "Completed" to preserve historical record:

| ID | Name | Issue |
|----|------|-------|
| 331 | Rock Climbing Camp (Jul 6-10) | Generic, ages 6-14 — superseded by 15796/15797 |
| 332 | Rock Climbing Camp (Jul 13-17) | Generic, ages 6-14 — superseded by 15798/15799 |
| 333 | Rock Climbing Camp (Jul 20-24) | Generic, ages 6-14 — superseded by 15800/15801 |
| 334 | Rock Climbing Camp (Jul 27-31) | Generic, ages 6-14 — superseded by 15802/15803 |
| 335 | Rock Climbing Camp (Aug 4-8) | Generic, ages 6-14 — superseded by 15804/15805 |
| 336 | Rock Climbing Camp (Aug 10-14) | Generic, ages 6-14 — superseded by 15806/15807 |
| 704 | Spring Break Climbing Camp (Mar 23-27) | Generic — superseded by 15792/15793 |
| hive-camp-6-8 | The Hive Summer Climbing Camp (Ages 6-8) | No dates/location — superseded |
| hive-camp-9-12 | The Hive Summer Climbing Camp (Ages 9-12) | No dates/location — superseded |
| hive-youth-1 | The Hive Youth Climbing Programs | Generic ages 4-16 — superseded |

---

## Price Verification

- **Spring Break camps:** $475/week — confirmed on RockGymPro registration widgets
- **Summer camps:** $475/week — confirmed on RockGymPro registration widgets
- All prices marked `priceVerified: true` in existing entries — confirmed correct

## Enrollment Status Notes

- Jul 6-10 Juniors: Corrected from "Waitlist" to "Full" (live page shows "sold out")
- Aug 10-14 Juniors: Corrected from "Waitlist" to "Full" (live page shows "sold out")
- All other summer camp Juniors and Inters sessions: Open (confirmed)
- Spring break camps: Completed (past dates)

## Count Verification

Provider registration page shows:
- 9 weeks × 2 age groups = 18 summer camp sessions at North Shore
- 2 weeks × 2 age groups = 4 spring break sessions at North Shore

Database has: 18 summer camp entries (IDs 15794-15811) + 4 spring break entries (15790-15793) = 22 specific entries. The older generic entries (331-336, 703-704, hive-*) remain as Completed for historical reference.

Total accurate current listings: 22 (fully detailed per-week per-age-group)

## Notes

- The Hive operates camps only at North Shore for Metro Vancouver area. Vancouver Boulder and Heights direct youth bookings to phone.
- Camp schedule: ~2/3 of time climbing at gym, ~1/3 at nearby outdoor parks
- Camps run on statutory holidays (Canada Day Jul 1, BC Day Aug 3)
- Rental shoes and chalk bags provided
