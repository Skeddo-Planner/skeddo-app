# Verification Log — Collingwood School - Morven Campus

**Date:** 2026-04-04
**Auditor:** Claude (automated)
**Registration page:** https://www.collingwood.org/community/camps/2026-camps

---

## Summary

Provider shows extensive summer camp programs (Explorers K, Wonderers Gr 1-2, Adventurers Gr 3-5, Innovators Gr 6-8, Leadership Pathway Gr 6-9) across Wentworth and Morven campuses. Database currently only has 2 wrestling programs — significant gap vs what's offered.

**Database:** 2 programs | **Live page:** 50+ distinct programs across multiple weeks and categories.

Changes: 2 fixed (URL + costs) / 0 added (adding full camp catalog is a future task).

---

## Issues Fixed

### 1. Registration URL incorrect
- **Before:** `https://www.collingwood.org/camps`
- **After:** `https://www.collingwood.org/community/camps/2026-camps` (direct 2026 camps page)

### 2. Cost missing (Mat Warriors AM)
- **Before:** `cost: null`, `costNote: "Inquire with provider"`, `priceVerified: false`
- **After:** `cost: 300`, `costNote: "Per week (half day AM)"`, `priceVerified: true`
- Source: collingwood.org/community/camps/2026-camps shows $300/week for Innovators half-day camps

### 3. Mat Warriors PM session — unverified
- ACT-0496 (Mat Warriors Wrestling 8-10 PM): Research only found an AM session for wrestling (July 13-17).
- Set to `enrollmentStatus: "Likely Coming Soon"`, `confirmed2026: false` pending verification
- Program retained per Rule 31

---

## Programs Verified on Live Page

### Mat Warriors: Wrestling — Grades 6-8 (Innovators)
- **Dates:** July 13-17, 2026
- **Time:** AM half-day (9 AM–12 PM)
- **Cost:** $300/week ✅
- **Address:** 70 Morven Drive, West Vancouver, BC V7S 1B2 ✅
- **URL:** https://www.collingwood.org/community/camps/2026-camps ✅

---

## Missing Programs (not yet in database)

The following Collingwood programs exist on the live page but are not in the database:

**Explorers (Kindergarten / Ages 4-5) — Wentworth Campus**
- Explorers Specialty Camp AM ($310/week, June 22-26)
- Explorers Specialty Camp PM ($310/week, June 22-26)
- Signature Camp AM ($310/week, June 29–Aug 7)
- Signature Camp PM ($310/week, June 29–Aug 7)

**Wonderers (Grades 1-2) — Wentworth Campus**
- Specialty Camp programs: Splash of Colour, Breakdancing, Multi-Sports, STEM Adventure, Musical Theatre
- Signature Camp Full Day ($600/week, June 29–Aug 7)

**Adventurers (Grades 3-5) — Wentworth Campus**
- Specialty programs: One of a Kind Art, Breakdancing, Multi-Sports, STEM Innovators & Engineers, Moviemakers
- Signature Camp Full Day ($600/week, June 29–Aug 7)

**Innovators (Grades 6-8) — Morven Campus**
- 20+ programs including: Watercolour Remix, Ceramics, Sewing, Fashion Design, Culinary Arts, Cake Decorating, Moviemakers, Ultimate Sports Adventure, Strong Bodies Strong Leaders, Adventure Camp ($700/week), Racquet Sports, Babysitting Start Up!, Science Realms, CSI Summer Edition, Molecular Mayhem, World of AI, Video Game Design, Unplugged, Wilderness Quest

**Leadership Pathway (Grades 6-9)**
- Junior Leader (Gr. 6-7): $500, July 13-17
- Leader-in-Training (Gr. 8-9): $400, Aug 4-7

**Recommendation:** Add full Collingwood catalog in a follow-up audit (50+ programs total).
