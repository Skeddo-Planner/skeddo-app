# Verification Log — Chorus & Clouds

**Audited:** 2026-04-06
**Queue entry:** Rank 178
**Source URLs verified:**
- `https://chorusandclouds.ca/collections/classes` (listing page, prices)
- `https://chorusandclouds.ca/products/magical-music-ages-0-5-all-ages-are-welcome` (sessions, availability)
- `https://chorusandclouds.ca/products/infant-toddler-art-club-ages-10-months` (sessions, availability)
- `https://chorusandclouds.ca/products/little-explorers-lab-3-12-months` (sessions, availability)
- `https://chorusandclouds.ca/products/explorer-s-lab-ages-2-5-yrs` (sessions, availability)
**DB count before audit:** 16,194 programs
**DB count after audit:** 16,194 (0 added, 5 corrected)

---

## Summary

DB had ALL 5 Chorus & Clouds programs marked as "Full" or "Full/Waitlist" with confirmed2026=false. This was completely wrong — the Spring 2026 semester (May 4–Jun 26) is OPEN with available spots confirmed via Shopify cart (all session options were enabled, not disabled). Prices were also wrong for 4 of 5 programs. Address confirmed correct.

---

## Confirmed Program Details

| Field | Value |
|-------|-------|
| Address | 197 East 17th Avenue, Vancouver, BC, V5V 1A5 (Mount Pleasant) |
| Coordinates | 49.2539, -123.0969 |
| Spring semester | May 4 – Jun 26, 2026 (no class Victoria Day May 18) |
| Registration opened | April 1, 2026 at 8:00 AM |
| Availability check | Shopify cart options: ALL enabled (not disabled/sold-out) |

---

## Availability Verification Method

Chorus & Clouds uses Shopify. For each program product page, each session variant is a `<select>` option. A **disabled** option = sold out. All options on all 4 class product pages were **enabled** → confirmed OPEN for spring semester.

---

## Price Corrections

| Program | DB Cost | Actual Cost (min session) | Full Range |
|---------|---------|--------------------------|------------|
| Magical Music (Ages 0-5) | $222 | **$188** (Mon 3:45-4:30pm, ages 0-12mo) | $188.13–$215.00 |
| Infant/Toddler Art Club (Ages 10mo+) | $212 | **$179** (Mon 9:30-10:15am) | $179.38–$205.00 |
| Little Wonders Developmental Play (Ages 3-12mo) | $191 | **$162** (Fri 12:30-1:30pm) | $161.88–$185.00 |
| Explorer's Lab / School Prep (Ages 2.5-5) | $215 | **$188** (Mon 10:45-11:45am) | $188.13–$215.00 |
| Drop-In Art and Music (All Ages) | $30 | **$30** ✓ CORRECT | — |

---

## Session Schedule — Magical Music (Ages 0-5)

| Session | Ages | Price |
|---------|------|-------|
| Mon 3:45-4:30pm | 0-12 months | $188.13 |
| Wed 9:15-10:00am | 0-5 years | $215.00 |
| Thu 9:15-10:00am | 0-5 years | $215.00 |
| Thu 3:00-3:45pm | 0-12 months | $215.00 |
| Fri 3:30-4:15pm | 0-5 years | $215.00 |

---

## Session Schedule — Infant/Toddler Art Club (Ages 10mo+)

| Session | Price |
|---------|-------|
| Mon 9:30-10:15am | $179.38 |
| Tue 9:30-10:15am | $205.00 |
| Tue 10:45-11:30am | $205.00 |
| Tue 3:30-4:15pm | $205.00 |
| Fri 11:15-12:00pm | $205.00 |

---

## Session Schedule — Little Wonders Developmental Play (Ages 3-12mo)

| Session | Price |
|---------|-------|
| Mon 12:30-1:30pm | $185.00 |
| Thu 12:30-1:30pm | $185.00 |
| Fri 12:30-1:30pm | $161.88 |

---

## Session Schedule — Explorer's Lab / School Preparation (Ages 2.5-5)

| Session | Price |
|---------|-------|
| Mon 10:45-11:45am | $188.13 |
| Thu 10:30-11:30am | $215.00 |
| Fri 9:30-10:30am | $215.00 |

---

## Fixes Applied

| Field | Old | New |
|-------|-----|-----|
| enrollmentStatus (all 5) | "Full" / "Full/Waitlist" | "Open" |
| confirmed2026 (all 5) | false | true |
| priceVerified (all 5) | unset/false | true |
| cost — chorus-clouds-1 | $222 | $188 |
| cost — chorus-clouds-2 | $212 | $179 |
| cost — chorus-clouds-3 | $191 | $162 |
| cost — chorus-clouds-4 | $215 | $188 |
| cost — chorus-clouds-5 | (unchanged) | $30 ✓ |
| startDate / endDate (all 5) | missing/wrong | 2026-05-04 / 2026-06-26 |
| repeating (all 5) | missing | true (53-day semester span) |
| name — chorus-clouds-1 | "Chorus & Clouds — Magical Music (Ages 0-5)" | "...incl. infant sessions" |
| name — chorus-clouds-3 | "...Little Wonders Developmental Play..." | "...Little Wonders Infant Developmental Play..." |
| days — chorus-clouds-5 | "Sat" (incorrect inherited value) | deleted (drop-in, no fixed day) |
| costNote (all 5) | missing/wrong | Added with full session breakdown and semester note |
| description (all 5) | missing/outdated | Added with accurate details |
| lat/lng (all 5) | varied | 49.2539, -123.0969 |

---

## Notes

- Provider is in its 10th year of operation (established ~2016)
- Spring semester price reflects approx 7-8 weeks
- Drop-in spots may be available in some classes — confirmed via email/Instagram DM
- Current semester (Jan-May 2026) runs until May 1; spring opens May 4
- Registration opens April 1 each semester
