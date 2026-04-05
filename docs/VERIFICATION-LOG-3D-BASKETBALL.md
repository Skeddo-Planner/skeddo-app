# Verification Log — 3D Basketball Academy

**Date:** 2026-04-05
**Auditor:** Claude (automated audit agent)
**Provider:** 3D Basketball Academy
**Website:** https://3dbasketball.net/camps
**Registration Platform:** https://3dbasketball.teamsportsadmin.com/

---

## Audit Status: COMPLETE — Registration Open

All summer 2026 Future All-Stars camps at Brockton School confirmed. Registration is open.

---

## Programs Verified (Future All-Stars Camp at Brockton School)

### Location
**Brockton School**
3467 Duval Rd, North Vancouver, BC V7J 3E8
Neighbourhood: Lynn Valley

### Camp Overview
- **Ages:** U6-U10 (ages 6-10)
- **Time:** 9:00 AM – 3:30 PM (full day) or 9:00 AM – 12:00 PM (morning) or 12:30 PM – 3:30 PM (afternoon)
- **Discount:** 10% sibling discount when adding second child to same week
- **Registration:** Open

### Sessions and Pricing

| Week | Dates | Full Day | Morning | Afternoon | Notes |
|------|-------|----------|---------|-----------|-------|
| Week 1 | Jun 29 - Jul 3 | $255 | $160 | $160 | 4-day week (Canada Day Jul 1) |
| Week 2 | Jul 6-10 | $315 | $199 | $199 | 5-day week |
| Week 3 | Jul 13-17 | $315 | $199 | $199 | 5-day week |
| Week 4 | Jul 20-24 | $315 | $199 | $199 | 5-day week |

---

## Discrepancies Found and Corrected

| Field | Was | Now | Reason |
|-------|-----|-----|--------|
| `address` | "Brockton School, North Vancouver, BC" | "3467 Duval Rd, North Vancouver, BC" | Full address confirmed |
| `neighbourhood` | "Lower Lonsdale" | "Lynn Valley" | Duval Rd is in Lynn Valley |
| `lat`/`lng` | 49.332 / -123.053 | 49.3355 / -123.0203 | Corrected to Lynn Valley coordinates |
| `days` (Week 1) | "Mon-Fri" | "Mon, Tue, Thu, Fri" | Canada Day July 1 = Wednesday holiday |
| `costNote` | absent | Added | Per-session pricing and sibling discount note |

---

## Other Programs at 3D Basketball (NOT in database — different venue and age groups)

The following Mulgrave School programs are offered in July 2026 but are NOT currently in the database. They could be added in a future audit:

- **U10-U12 Development Camp (AM):** Jul 6-10, 13-17, 20-24, 27-31 at Mulgrave, $250/week (9 AM-12 PM)
- **U13-U14 Shooting Camp (PM):** Jul 6-10, 27-31 at Mulgrave, $279/week (12:30-3:30 PM)
- **U13-U14 Offensive Skills Camp (PM):** Jul 13-17 at Mulgrave, $279/week
- **U13-U14 3x3 Decision Making (PM):** Jul 20-24 at Mulgrave, $279/week
- **U15-U18 Advanced Shooting Camp (PM):** Jul 6-10, 27-31 at Mulgrave, $279/week
- **U15-U18 Advanced Offensive Skills (PM):** Jul 13-17 at Mulgrave, $279/week
- **U15-U18 Advanced Scoring Camp (PM):** Jul 20-24 at Mulgrave, $279/week

---

## Count Verification

- **Provider website programs (Brockton School):** 12 (4 full-day + 8 half-day AM/PM across 4 weeks)
- **Database before audit:** 12 programs
- **Database after audit:** 12 programs (0 added, 12 corrected)
