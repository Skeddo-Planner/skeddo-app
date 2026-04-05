# Verification Log — YMCA of Greater Vancouver

**Date:** 2026-04-04
**Auditor:** Claude (autonomous audit agent)
**Provider:** YMCA of Greater Vancouver
**Registration pages:**
- Day Camps (Kids Club): https://anc.ca.apm.activecommunities.com/ygv/
- Camp Elphinstone (overnight): https://www.gv.ymca.ca/overnight-camp
- Camp Elphinstone (day camp): https://www.gv.ymca.ca/elphinstone-day-camp
- Swim Lessons: https://www.gv.ymca.ca/ymca-swim-lessons

---

## Programs in Database

### 1. YMCA Kids Club — Day Camps (18 programs)

School-based summer day camps across Vancouver/Richmond. **All verified as correct:**
- Cost: $50/week (verified, activecommunities platform)
- Ages: 6–13 (single-group per registration system)
- Times: 7:30 AM – 5:30 PM
- Enrollment status: Mix of Open and Full (as shown on activecommunities)
- All 18 registrationUrls confirmed pointing to activecommunities.com/ygv/

### 2. Camp Elphinstone Programs (8 programs)

Overnight and day camp on the Sunshine Coast (1760 YMCA Road, Gibsons, BC).
Ages confirmed from website:

| Program | Ages | Format |
|---------|------|--------|
| McNabb Camp | 5–7 | Overnight, short session |
| Five-Day Camp | 7–14 | Overnight, 5 days |
| 12-Day Camp | 10–14 | Overnight, 12 days |
| Three-Day Out-Trip | 12–14 | Overnight backcountry trip |
| Eight-Day Out-Trip | 13–15 | Overnight backcountry trip |
| Leadership Development 1 | 14–15 | Overnight, leadership focus |
| Leadership Development 2 | 15–16 | Overnight, leadership focus |
| Day Camp | 5–11 | Day camp (not overnight) |

### 3. YMCA Swim Lessons (4 programs)

Continuous enrollment swim lessons at:
- Bettie Allard YMCA (555 Emerson St, Coquitlam) — ages 1–12
- Langara Family YMCA (5851 Ontario St, Vancouver) — ages 1–12
- Robert Lee YMCA (955 Burrard St, Vancouver) — ages 1–12
- Tong Louie Family YMCA (14988 57 Ave, Surrey) — ages 1–12

---

## Database Count

- **Database had:** 30 programs (18 Kids Club + 8 Elphinstone + 4 Swim)
- **Added:** 0 (no missing programs found)
- **Fixed:** 12 programs (Elphinstone and Swim programs)

---

## Discrepancies Found & Resolved

### 1. Camp Elphinstone programs — R48 violation (isEstimate=true with confirmed2026=true)
- **Issue:** All 8 Elphinstone programs had `isEstimate: true` and `confirmed2026: true`, triggering R48
- **Fix:** Set `isEstimate: false` for all. The programs ARE confirmed for 2026 (registration opened Jan 30, 2026); only the price was unknown.

### 2. Camp Elphinstone — wrong cost
- **Issue:** `cost: 25` — clearly incorrect for multi-day overnight camps
- **Fix:** Set `cost: null` with proper costNote: "Price not listed publicly — register at ymcacampelphinstone.campbrainregistration.com or call 604-939-9622."
- **Note:** Elphinstone prices are gated behind the campbrain registration system (requires JavaScript). Cannot be accessed programmatically. Parents must register directly to see pricing.

### 3. Camp Elphinstone — wrong registrationUrl
- **Issue:** `registrationUrl: "https://www.gv.ymca.ca/day-camps"` — incorrect URL
- **Fix:** Updated to specific pages:
  - Overnight camps: https://www.gv.ymca.ca/overnight-camp
  - Day camp: https://www.gv.ymca.ca/elphinstone-day-camp

### 4. YMCA Swim Lessons — R48 violation (same as above)
- **Issue:** `isEstimate: true` with `confirmed2026: true`
- **Fix:** Set `isEstimate: false`

### 5. Swim Lessons — wrong cost and registrationUrl
- **Issue:** `cost: 25` (wrong; actual pricing is YMCA child membership ~$25.99/bi-weekly + $5/bi-weekly swim add-on)
- **Fix:** Set `cost: null` with costNote explaining pricing structure
- **Fix:** Updated `registrationUrl` to https://www.gv.ymca.ca/ymca-swim-lessons
- **Fix:** Removed non-applicable startTime/endTime (continuous enrollment, times vary)

---

## Kids Club Day Camps — Verified as Correct

All 18 Kids Club programs already had correct data (confirmed previously in April 2026):
- Prices ($50/week, $20 for partial Week 1) ✓
- Ages 6–13 ✓
- Enrollment status (mix of Open/Full) ✓
- activecommunities.com registrationUrls ✓
- All addresses and neighbourhoods ✓

---

## Notes

- Camp Elphinstone pricing requires direct registration at campbrainregistration.com or calling 604-939-9622 / emailing camp.elphinstone@bc.ymca.ca
- Swim lesson pricing model: continuous enrollment, no fixed session dates. Parents start when convenient and pay bi-weekly.
- YMCA membership required for swim lessons (various membership levels available)
