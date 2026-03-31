# Spot-Check Quality Patterns — 2026-03-31

Research-only analysis of `programs.json` (6,915 programs). No changes made.
Analyst: Claude Code. Tom's 5 prior findings are NOT duplicated here — only NEW patterns.

---

## Analysis 1 — Duplicate Detection

**New pattern? YES — not previously documented.**

Same name + same provider groups: **791 groups** involving **3,982 programs** (57% of the database).

Broken into two types:

| Type | Groups | Programs |
|------|--------|----------|
| TRUE duplicates (same name + same provider + same/overlapping dates/cost) | 190 groups | 1,343 programs |
| Legitimate recurring sessions (same name, different dates) | 601 groups | 2,639 programs |

**Top true-duplicate groups:**

| Provider | Program Name | Count |
|----------|-------------|-------|
| City of Burnaby - Unknown | Swimming Private or Semi-Private Lesson | 60 |
| City of Vancouver - West Point Grey | Private Piano Lessons with June | 56 |
| City of Vancouver - West Point Grey | Bouncy Castle Party Time / Birthday Party | 42 |
| City of Vancouver - Douglas Park | Piano Lessons | 40 |
| City of Burnaby - Unknown | Reserve in Advance Aquafit | 39 |
| City of Burnaby - Unknown | Swimmer 2 | 36 |
| City of Vancouver - Killarney | Forte Piano 6-12yrs | 35 |
| City of Vancouver - Dunbar | Private Piano Lessons 3-5 yrs | 28 |

**Root cause:** ActiveNet scraper appears to import recurring drop-in slots (same activity, different timeslot IDs) as separate program records. True duplicates likely have different ActiveNet internal IDs but identical user-facing data.

**Recommendation:** Add a dedup check to the scraper: flag records where provider + name + startDate + cost are identical to an existing record.

---

## Analysis 2 — Description Quality

**New pattern? YES (shared descriptions are new; missing descriptions already known).**

| Issue | Count |
|-------|-------|
| Null/empty descriptions | 0 |
| Under 20 characters (not empty) | 12 |
| Descriptions shared by 2+ programs (> 30 chars) | **830 unique texts** shared across **4,793 programs** |

**Under-20 char examples** (appear to be level names used as descriptions):
- `"Junior Ecologist"` (ACT-0172)
- `"Marine Biologist"` (ACT-0181)
- `"Outdoor Architect"` (ACT-0190)
- `"Ornithologist"` (ACT-0199)
- `"Pre Calculus 11"` (ACT-0418)
- `"Sat AM - Blue - VAC"` (ACT-0206)

These look like program level/track names, not descriptions.

**Most-shared description texts:**

| Count | Description (first 80 chars) |
|-------|------------------------------|
| 160 | "NVRC summer day camp. Staff trained in first aid, child development…" |
| 102 | "NVRC part-day specialty camp in North Vancouver." |
| 71 | "60 minutes of cycling with a longer warm up and cool down." |
| 57 | "For Children - June's lessons for young beginners include various fun…" |
| 56 | "City of Burnaby summer day camp. Games, crafts, outdoor adventures…" |
| 50 | "For more information, please visit http://vancouver.ca/…painters…" |
| 43 | "NOTE: For online registration, please only enroll one participant…" |
| 42 | "District of West Vancouver recreation camp. Registration opens April 30." |

The 160-count NVRC and 102-count NVRC descriptions mean ~262 NVRC camps share just 2 description templates.

**Recommendation:** Programs with descriptions under 20 characters should be flagged for human review — the text is almost certainly a level label, not a real description.

---

## Analysis 3 — Age Range Sanity

**New patterns: ageMax > 18 and ageMax null are new. ageMin = ageMax is partially new.**

| Issue | Count |
|-------|-------|
| ageMin > ageMax (impossible) | 0 |
| ageMin < 0 | 0 |
| ageMax > 18 | **25** |
| ageMax = 18 (borderline) | 135 |
| ageMin = ageMax (single age) | 21 |
| ageMax null/missing | **1,668** |
| ageMin null/missing | **162** |

**ageMax > 18 examples** (all are 13–19 range at Arts Umbrella):
All 25 programs are from Arts Umbrella intensive programs (e.g., "3D Modeling & Animation Intensive Ages 13-19"). The ageMax of 19 means these will not appear in eligibility filters for 18-year-olds correctly.

**ageMax = null (1,668 programs):** These programs have no upper age limit set. On the surface this could mean "all ages welcome" but without the field populated, the age eligibility filter cannot include them. This is a significant data gap — **24% of the database has no ageMax**.

**ageMin = ageMax (21 programs):** These are legitimate kindergarten/single-grade programs (e.g., "Pre-Kindergarten Summer Camp" — age 5 only). Not a bug, but unusual enough to flag for review.

**Recommendation:** Add a validation rule: if ageMax > 18, cap it at 18 (or flag for review). Investigate the 1,668 null ageMax records — determine if they should default to 17 or stay null.

---

## Analysis 4 — Price Outliers

**New pattern: cost < $5 camp programs and $1 placeholder are new findings.**

| Issue | Count |
|-------|-------|
| Cost > $2,000 | **7** |
| Cost < $5 (but > $0) | **216** |
| Cost = $0 (explicitly free) | 204 |
| Cost null/missing | **571** |
| 95th percentile | $525 |
| 99th percentile | $750 |
| Maximum | $2,432 |

**Over $2,000 programs:**
- `COV-554836` — WPG Preschool - 4 Years Old — **$2,432** (this is a full preschool year program, not a camp week; may be correct)
- `sgc-whistler-w1/w2` — Summer Gravity Camps (Whistler) — **$2,149** (bike camp, resort pricing)
- `COV-554833` — WPG Preschool - 3 Years Old — **$2,080** (same preschool)
- Arts Umbrella Intensives (3×) — **$2,040** (2-week intensives)

**Under $5 anomalies:**
- `wvfhc-1` — West Vancouver Field Hockey Club — **$1.00** (almost certainly a placeholder; field hockey registration doesn't cost $1)
- `COV-588796` — Family Play Gym — **$1.50** (plausible drop-in rate)
- 10× Bird's Nest Dragon Boat Paddling — **$2.00** each (plausible community rate)
- `BNB-91843/45/47` — Hike Hike Baby! — **$2.00** (plausible)

**The $1 field hockey program is the key anomaly** — it is likely a data-entry placeholder that never got updated.

**Cost = null (571 programs):** These have no pricing information at all. Combined with cost=0 (204 programs), that's **775 programs (11%)** with no usable price data.

**Recommendation:** Flag any program with cost ≤ $1 for manual review. Add a validation rule: cost=1 should be treated as a potential placeholder.

---

## Analysis 5 — Time/Duration Sanity

**New pattern: 12:05 AM start time is a new bug find.**

| Issue | Count |
|-------|-------|
| startTime after endTime | 0 |
| durationPerDay > 12h | 0 |
| durationPerDay < 0.5h | **6** |
| durationPerDay = 0 | 0 |
| durationPerDay null/missing | **221** |
| Start before 6 AM | **2** |
| End after 10 PM | 0 |

**Start before 6 AM:**
- `ACT-0231` — "Sat. 11:00 am Toddler Class" — **startTime: 12:05 AM** — CLEAR DATA BUG. The name says 11:00 AM but the field says 12:05 AM (midnight).
- `PC-118143` — "Swimmer 2" — **startTime: 5:25 AM** — Plausible (early morning swim lesson) but worth verifying.

**durationPerDay < 0.5h (6 programs):** Legitimate to flag — sub-30-minute programs are unusually short. May be data entry errors (e.g., duration in the wrong unit).

**durationPerDay null (221 programs):** 3.2% of programs have no duration set.

**Recommendation:** Flag programs where startTime doesn't match the text in the program name (e.g., `ACT-0231`). This is likely a scraper artifact where internal timeslot IDs have wrong times.

---

## Analysis 6 — Date Sanity

**New patterns: 1 impossible date, 450 expired programs, and 1 malformed timestamp.**

| Issue | Count |
|-------|-------|
| endDate before startDate | **1** |
| Programs with endDate in the past (before 2026-03-31) | **450** |
| Programs with startDate > 18 months future | 0 |
| startDate null/missing | **182** |
| endDate null/missing | **182** |

**Impossible date:**
- `LGY-129` — "Spring Break 2026 - Extended Play" — **startDate: "2026-03-16 00:00:00"** (has timestamp, not just date) vs **endDate: "2015-11-02"** — endDate is from 2015, clearly wrong. The startDate also has a non-standard format (includes time component) which may have caused a comparison bug.

**Expired programs (450 programs with endDate before today):**
- **1 program** ended in November 2015 (the `LGY-129` anomaly above)
- **449 programs** ended during March 2026 (spring break / early spring programs now past)

The 449 recently-expired programs are expected — spring break is wrapping up. However, they are still being served to users in the Discover tab.

**Recommendation:**
1. Fix `LGY-129`'s endDate (should be ~2026-03-20 based on spring break timing).
2. Consider auto-hiding programs where endDate < today in the Discover tab.

---

## Analysis 7 — Category/Tag Consistency

**New pattern: duplicate category names (plurals, variants) are a new finding.**

**Category distribution shows fragmentation:**

| Category | Count | Issue |
|----------|-------|-------|
| General | 1,854 | — |
| Sports | 1,471 | duplicated by "Sports & Fitness" (19) |
| Arts | 1,027 | — |
| Music | 585 | — |
| STEM | 460 | — |
| Multi-Activity | 435 | duplicated by "Multi-Activity Camps" (85) |
| Outdoor | 269 | duplicated by "Outdoors" (39) |
| Performing Arts | 268 | — |
| Academic | 195 | duplicated by "Academic & Language" (8) |
| Life Skills | 106 | — |
| Multi-Activity Camps | 85 | should be "Multi-Activity" |
| Language | 44 | — |
| Outdoors | 39 | should be "Outdoor" |
| Faith-Based | 36 | — |
| Sports & Fitness | 19 | should be "Sports" |
| Cultural | 11 | — |
| Academic & Language | 8 | should be "Academic" |
| Leadership | 2 | — |
| Health & Wellness | 1 | — |

**4 sets of duplicate categories** totaling 151 programs with non-canonical names.

**Miscategorized programs:**
- **10 programs** tagged "Arts" with sports keywords in name (e.g., "Art of Tennis Summer Camp" — likely tennis, not arts; "Axe Capoeira - Brazilian Martial Arts" tagged as Arts/Visual Arts)
- **42 programs** tagged "Sports" with arts keywords in name (all are Martial Arts programs — "Martial Arts" is ambiguous between Sports and Arts)

**Recommendation:** Consolidate: "Outdoors"→"Outdoor", "Multi-Activity Camps"→"Multi-Activity", "Sports & Fitness"→"Sports", "Academic & Language"→"Academic". This affects 151 programs and would make filter chips work correctly.

---

## Analysis 8 — Provider Name Consistency

**New pattern: "Cmty Centre" vs "Community Centre" split and "City of Burnaby - Unknown" are new.**

**Total unique provider names: 429**

**Critical inconsistency — "Cmty Centre" vs "Community Centre":**
18 community centres have BOTH versions as separate provider names, fragmenting programs across two entries for the same facility:

| Facility | "Cmty Centre" count | "Community Centre" count |
|----------|---------------------|--------------------------|
| Hillcrest | 168 | 47 |
| Dunbar | 144 | 36 |
| Kerrisdale | 121 | 35 |
| Trout Lake | 111 | 55 |
| Thunderbird | 106 | 36 |
| Douglas Park | 97 | 19 |
| Mount Pleasant | 95 | 28 |
| Strathcona | 20 | 20 |
| … 10 more | … | … |

This means provider-level filtering will return incomplete results — a user filtering by "Hillcrest Community Centre" misses 168 programs under "Hillcrest Cmty Centre".

**"City of Burnaby - Unknown" — 729 programs:**
729 programs from the Burnaby scraper have no specific facility assigned. This is 50%+ of all Burnaby programs. These programs appear under a generic "Unknown" facility which is confusing in the UI.

**Other notable inconsistencies:**
- `STEMA Learning` (15 programs) vs `STEMA Learning Centre` (same provider, different name)
- `JCC of Greater Vancouver` vs `JCCGV` (same provider)
- `Phoenix Gymnastics` vs `Vancouver Phoenix Gymnastics` (same provider)

**Recommendation:** Normalize all "Cmty Centre" → "Community Centre" across the database (affects ~1,200+ programs). Investigate Burnaby Unknown programs to assign facility names.

---

## Analysis 9 — Missing Critical Fields

**New pattern: 28 programs with no registrationUrl (mostly from one hockey provider).**

| Field | Missing Count |
|-------|--------------|
| registrationUrl | **28** |
| provider | 0 |
| name | 0 |
| neighbourhood | 0 |
| Placeholder/invalid URLs | 0 |

**Missing registrationUrl programs:**
All 28 are ACT-prefixed hockey programs (e.g., "2026 Spring Break Defenseman Camp - Group A - Goaltenders"). These are from a hockey association where the URL was not captured during data entry.

**Recommendation:** Locate the registration URL for this hockey provider and back-fill the 28 records.

---

## Analysis 10 — URL Patterns

**New patterns: cross-provider URL contamination and "Access2Innovate" acting as URL broker.**

**URL statistics:**
- Total unique URLs: 4,887
- URLs shared by 2+ programs: 236 (legitimate for providers with 1 registration page for all programs)
- Generic landing pages (10+ programs sharing 1 URL): 31

**Cross-provider URL contamination (14 cases):**

| URL | Programs | Providers (examples) |
|-----|----------|---------------------|
| mulgrave.com/summer-camps | 112 | **Mulgrave School** AND **Access2Innovate** |
| collingwood.org/camps | 66 | **Collingwood School** AND **Access2Innovate** |
| petitarchitect.com/summer-camps | 41 | **Petit Architect** AND **Pacific Spirit Park** AND **Jericho Beach** |
| activecommunities.com/vancouver (CoV pool search) | 39 | Lord Byng Pool AND Vancouver Aquatic Centre |
| vancouver.stemalearning.com | 15 | STEMA Learning AND STEMA Learning Centre |
| jccgv.com/camps | 12 | JCC of Greater Vancouver AND JCCGV |
| phoenixgymnastics URL | 7 | Phoenix Gymnastics AND Vancouver Phoenix Gymnastics |

**"Access2Innovate" anomaly:** This appears to be a third-party broker/reseller that lists programs from Mulgrave School and Collingwood School under their own provider name but with the original school's URL. This means users who register through Access2Innovate may actually be going to Mulgrave/Collingwood directly. The provider name is misleading.

**Petit Architect URL on 3 different providers:** Petit Architect offers programs at Pacific Spirit Park and Jericho Beach locations — these should probably all be provider "Petit Architect" with different neighbourhood/address fields, not three separate providers.

**Recommendation:**
1. Investigate Access2Innovate — are these resold programs or duplicates of the Mulgrave/Collingwood records?
2. Normalize Petit Architect location variants to one provider with different addresses.
3. The JCC/JCCGV and STEMA/STEMA Learning Centre duplicates confirmed from Analysis 8 are the same pattern here.

---

## Summary: New Patterns Found

| # | Pattern | Programs Affected | Severity |
|---|---------|-------------------|----------|
| 1 | True duplicates (same name+provider+date) | 1,343 | HIGH |
| 2 | Descriptions < 20 chars (level labels used as descriptions) | 12 | MEDIUM |
| 2b | Shared boilerplate descriptions (no unique content) | 4,793 | LOW |
| 3 | ageMax > 18 (exceeds Skeddo's scope) | 25 | MEDIUM |
| 3b | ageMax null/missing (24% of database) | 1,668 | HIGH |
| 4 | Cost = $1 (likely placeholder) | 1 | MEDIUM |
| 4b | Cost null/missing | 571 | MEDIUM |
| 5 | startTime "12:05 AM" data bug (name says 11 AM) | 1 | HIGH |
| 6 | endDate = 2015 (impossible date on City of Langley program) | 1 | HIGH |
| 6b | startDate has timestamp format (not date-only) | 1 | MEDIUM |
| 6c | 449 programs with past endDate still visible in Discover | 449 | MEDIUM |
| 7 | 4 duplicate category names (Outdoors/Outdoor, etc.) | 151 | MEDIUM |
| 7b | 10 programs miscategorized Arts with sports content | 10 | LOW |
| 8 | "Cmty Centre" vs "Community Centre" splits same facility | ~1,200+ | HIGH |
| 8b | "City of Burnaby - Unknown" — 729 programs with no facility | 729 | MEDIUM |
| 8c | Provider name variants (STEMA, JCC, Phoenix) | ~35 | MEDIUM |
| 9 | 28 programs with no registrationUrl (ACT hockey provider) | 28 | MEDIUM |
| 10 | Access2Innovate cross-provider URL contamination | 112+ | HIGH |
| 10b | Petit Architect 3-provider split for same business | 41 | MEDIUM |

**Highest priority for next fix sprint:**
1. "Cmty Centre" → "Community Centre" normalization (~1,200 programs, affects provider filter)
2. True duplicate detection in scraper pipeline (1,343 records)
3. ageMax null investigation (1,668 records)
4. Access2Innovate audit (potential duplicate records)
5. City of Burnaby - Unknown facility assignment (729 programs)
