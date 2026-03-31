# Spot-Check Findings — 2026-03-30

**Authored by:** Tom (spot-check) + Claude (investigation)
**Status:** All 6 issues fully researched. Fixes not yet implemented.
**Resume point:** Ready to begin fixes — start with Issue 2 (schedule tags) as it has the most user-visible impact.

---

## Issue 1: Neighbourhood Accuracy

### How Widespread
- **730 programs** (10.7% of 6,838 total) have a generic `"Burnaby"` neighbourhood instead of specific ones like "Metrotown", "North Burnaby", or "Edmonds"
- City of Vancouver programs are correctly assigned (e.g., Trout Lake → "Kensington-Cedar Cottage" ✅)
- **"Muddy Boot Prints" at Trout Lake** is correctly assigned to "Kensington-Cedar Cottage" — NOT Burnaby Heights. This may have been fixed already.

### Root Cause
Three-tier neighbourhood assignment system exists:
1. **CoV community centre ID mapping** (`scripts/refresh-activenet.js` lines 46–70, `CENTRES` object) — works correctly for Vancouver
2. **Address regex matching** (`scripts/fix-neighbourhoods.cjs` lines 26–228, `ADDRESS_RULES`) — requires a real street address to match against
3. **Manual hardcoding** (various add-*.cjs scripts)

The Burnaby ActiveNet API returns only `", Burnaby, BC"` as the address (no street-level data). Without a real address, `ADDRESS_RULES` can't match anything. The `PROVIDER_RULES` array (lines 237–240) doesn't cover `"City of Burnaby - Unknown"`. Result: 730 programs stuck at generic `"Burnaby"`.

Unlike Vancouver, there is **no facility-to-neighbourhood mapping** for Burnaby recreation centres.

### Proposed Fix
Build a `BURNABY_CENTRES` lookup table in `fix-neighbourhoods.cjs` or `scripts/refresh-activenet.js`, similar to the existing `CENTRES` object for Vancouver. Map known Burnaby facility names/IDs (Bonsor, Edmonds, Confederation Park, Kensington, etc.) to their proper neighbourhoods. This is a manual one-time mapping but will fix all 730 programs.

### Priority
**Medium** — Burnaby programs show as "Burnaby" which is still findable, just not granular.

---

## Issue 2: Schedule Classification Tags

### How Widespread
- **2,881 programs** (42.1% of all programs) tagged `campType: "Year-Round Program"` but have specific `startDate` and `endDate` fields — a direct contradiction
- **2,433 programs** with `dayLength: "Half Day"` but `durationPerDay < 3 hours` — these are short lessons/activities, not half-day programs
- **65 programs** with `dayLength: "Half Day"` but `durationPerDay >= 5 hours` — these are actually full-day camps
- **4 programs** with invalid `dayLength: "Activity"` (not a valid value)

**Confirmed example:** False Creek CC Floor Hockey (`COV-604334`) — 1 hour Thursday session, tagged `dayLength: "Activity"` and `scheduleType: "Activity"`.

### Root Cause
**File:** `scripts/fill-computable-fields.cjs`

The `dayLength` computation (lines 300–306) uses wrong thresholds:
```js
if (p.durationPerDay >= 5) p.dayLength = "Full Day";
else if (p.durationPerDay >= 3) p.dayLength = "Half Day";
else p.dayLength = "Single Day";  // rarely produced
```

**Problems:**
1. Threshold `>= 3` for Half Day is wrong — programs 0.5–2.9 hours should be `"Lesson"` or `"Activity"`, not "Half Day"
2. Full Day threshold should be `>= 4` hours (per DATA-QUALITY-RULES.md Rule 33), not `>= 5`
3. `"Activity"` value leaks in from raw CoV API data and is never normalized
4. `campType: "Year-Round Program"` is assigned from the program category/type in the API but is never cross-checked against presence of date ranges

**Validation gap:** `validate-programs.cjs` Rule 27 (lines 272–281) only catches short programs with "lesson" in the name — misses the majority.

### Proposed Fix (per Tom's rules)
Update `fill-computable-fields.cjs` thresholds:
- Under 3 hours → `"Activity"` (with `durationPerDay` already indicating exact hours)
- 3–5.9 hours → `"Half Day"`
- 6+ hours → `"Full Day"`
- Programs with defined `startDate` AND `endDate` → remove `"Year Round"` from `campType` (replace with `"Class/Lesson"` or `"Camp"` based on duration)

Add validation rules to `validate-programs.cjs` to catch these going forward.

### Priority
**High** — "Year Round" and "Half Day" tags surface directly in filter UI and mislead parents.

---

## Issue 3: Enrollment Status Accuracy

### How Widespread
- **2,336 programs** (34%) have `status` and `enrollmentStatus` fields that **contradict each other**
- **260 programs** show `status: "Open"` but `enrollmentStatus: "Coming Soon"` or `"Likely Coming Soon"`
- **Pedalheads:** 27 programs all show `status: "Open"` but `enrollmentStatus: "Coming Soon"` with registration dates like 2026-04-09 — the two fields directly contradict

Status breakdown (current):
| Status | Count |
|--------|-------|
| Open | 5,045 |
| Waitlist | 956 |
| Likely Coming Soon | 495 |
| Full | 210 |
| Full/Waitlist | 94 |
| Coming Soon | 29 |
| Closed | 9 |

**Aquafit Range of Motion at Kensington Pool:** 2 programs found, both `status: "Open"` — Tom reported the actual open date is May 18 at 12pm. These are likely stale/incorrect.

### Root Cause
Two separate fields exist that should represent the same information:
- `status` — set by the ActiveNet live API (`update-activenet-status.cjs` line 75: "Available" → "Open")
- `enrollmentStatus` — set by HTML scraping or manual entry (`refresh-private.js` lines 289–297)

**These fields are never synchronized.** When one updates, the other doesn't. For Pedalheads specifically, `enrollmentStatus` was correctly scraped as "Coming Soon" but `status` defaulted to "Open" from initial import.

**For Kensington Aquafit:** These are CoV ActiveNet programs. The API may be returning "Available" even though registration hasn't opened yet (pre-opening window before the actual open date).

### Proposed Fix
1. **Short term:** Write a script to reconcile `status` and `enrollmentStatus` — when they conflict, the more restrictive one should win (i.e., if either says "Coming Soon", don't show "Open")
2. **For ActiveNet programs:** Check if `registrationOpenDate` is in the future — if yes, override `status` to "Coming Soon" regardless of what the API says
3. **Add validation rule** to `validate-programs.cjs`: flag any program where `status: "Open"` but `registrationOpenDate` > today

### Priority
**Critical** — Parents clicking "Register Now" on a program that isn't open yet is a trust-breaking bug.

---

## Issue 4: Incomplete Provider Listings

### How Widespread
Top 10 providers by program count (current):
| Provider | Count | Notes |
|----------|-------|-------|
| City of Burnaby - Unknown | 729 | Provider field blank/unknown — scraper issue |
| NVRC | 262 | Appears complete |
| City of Vancouver - Hillcrest | 168 | Appears complete |
| District of West Vancouver | 158 | Appears complete |
| City of Vancouver - Dunbar | 144 | Appears complete |
| City of Vancouver - W Point Grey | 141 | Appears complete |
| Arts Umbrella | 135 | Appears complete |
| City of Vancouver - Kerrisdale | 121 | Appears complete |
| City of Vancouver - Killarney | 117 | Appears complete |
| City of Vancouver - Trout Lake | 111 | Appears complete |

**Pedalheads — confirmed incomplete:**
- We have: 27 programs, only at **Point Grey** and **Riley Park**
- Missing: All other Pedalheads locations across Metro Vancouver (Burnaby, North Van, Coquitlam, Surrey, etc.) and all **soccer camps**, **combo camps**, and different **age/level progressions**
- Source: Generic HTML scraping in `refresh-private.js` lines 147+ — no dedicated Pedalheads parser, no location enumeration

**Other likely-incomplete providers:**
- Any private provider added via `refresh-private.js` generic scraper (no structured multi-location support)

### Root Cause
`refresh-private.js` scrapes individual URLs and doesn't know how to discover or enumerate all locations for a multi-site provider like Pedalheads. The scraper was seeded with a few Pedalheads URLs but never expanded.

### Proposed Fix
1. Build a dedicated Pedalheads location list — enumerate all Metro Vancouver locations from their website
2. Add each as a separate entry in the private provider refresh config
3. Consider building a structured "provider manifest" that lists all known URLs per provider so gaps are visible

### Priority
**High** — Pedalheads is a major Vancouver camp provider. Incomplete coverage makes Skeddo less useful than just Googling.

---

## Issue 5: Programs Incorrectly Removed

### Findings
**No evidence of systemic incorrect removal.** Full investigation of git history shows:

Recent removals from `programs.json`:
- `deaff31`: Removed 5 programs — Camp Hatikvah (4 overnight sessions) + Modus Operandi (1) — all `status: "Open"`, intentional
- `396b5ca`: Removed 49 programs — adult-only services (personal training, cycle fit, adult dance) and cancelled/birthday party programs — NOT kids programs, intentional
- `c3031ef`: No deletions — only status changes (Open → Likely Coming Soon for 87 programs)
- `5ecd1cf`: Restored 193 programs (net positive)
- `b9f5dce`: Removed 3 duplicates replaced by better versions

**False Creek Floor Hockey status:**
- `COV-604334` ("Floor Hockey") EXISTS in current programs.json
- Status: `enrollmentStatus: "Full"`, `status: "Full"` ✅
- It was NOT deleted — Tom may have been looking at a filtered view that excluded Full programs

**2STGD programs — 5 currently in file:**
- COV-614769: 2STGD Board Games - Preteens (Open)
- COV-606945: 2STGD Board Games - Teens (Open)
- COV-596298: 2STGD Swim and Gym (Open)
- COV-603939: 2STGD Swim and Gym (Open)
- COV-606926: 2STGD Get Creative (Full)

If Tom saw fewer before, the Full one (COV-606926) may have been filtered out of his view by default.

### Proposed Fix
**No code fix needed.** The main action item is to ensure the Discover tab's default filters do NOT hide Full/Waitlist programs without making this clear to the user. Consider adding "Showing X programs (Y hidden: Full/Waitlist)" indicator.

Also confirm: does the Discover tab filter out `status: "Full"` programs by default? If so, this may explain why Tom thought they were deleted.

### Priority
**Low** (no actual data loss) — but verify the Discover UI default filter behavior.

---

## Issue 6: Missing Providers

### Confirmed Missing
**Art at Edgemont (North Vancouver)**
- URL: https://artatedgemont.com/collections/kids-camps/products/summer-break-camp-full-week
- Not in programs.json (confirmed by search)
- Summer Break Camp for kids — directly relevant to Skeddo

**Grouse Mountain Camps (North Vancouver)**
- URL: https://www.grousemountain.com/camps
- Not in programs.json (confirmed by search)
- Outdoor/adventure camps on the mountain — high-value program type

### What Other Metro Vancouver Providers Are Missing
Based on the current data distribution, North Vancouver private providers are underrepresented. Known gaps to investigate:
- **Deep Cove Outdoors** — kayaking/outdoor camps
- **Capilano Suspension Bridge** — nature camps (North Van)
- **Vancouver Aquarium** — science/marine camps
- **Science World** — science camps (not found in quick check — verify)
- **Burnaby Village Museum** — heritage camps
- **Shadbolt Centre for the Arts** (Burnaby) — arts camps
- **Minoru Centre for Active Living** (Richmond) — recreation programs

**Provider directories to check:**
- NVRC (North Vancouver Recreation Commission) — we have 262 programs, verify all centres covered
- Recreation BC program directories
- Vancouver School Board extended care listings

### Root Cause
No systematic process exists to discover new providers. Programs are added ad hoc. The `docs/PROGRAM-SEARCH-METHODOLOGY.md` 9-phase approach should be applied to North Vancouver specifically.

### Proposed Fix
1. Add Art at Edgemont and Grouse Mountain to `refresh-private.js` provider config
2. Run 9-phase methodology on North Vancouver (document in PROGRAM-SEARCH-METHODOLOGY.md)
3. Consider building a "known providers" registry file that explicitly lists providers we've evaluated (even ones we decided not to add) so we don't re-research the same providers

### Priority
**Medium** — New providers expand coverage; not urgent vs. fixing existing data quality.

---

## Summary Table

| # | Issue | Scope | Priority | Fix Type |
|---|-------|-------|----------|----------|
| 1 | Neighbourhood accuracy (Burnaby) | 730 programs | Medium | Build Burnaby centre→neighbourhood lookup table |
| 2 | Schedule classification tags | 2,881 Year-Round, 2,433 Half Day mismatches | High | Fix thresholds in fill-computable-fields.cjs + validate |
| 3 | Enrollment status accuracy | 260 Open/Coming Soon conflicts | **Critical** | Reconcile status fields; use most restrictive |
| 4 | Incomplete provider listings | Pedalheads (only 2/many locations) | High | Enumerate all Pedalheads locations; rebuild scraper config |
| 5 | Programs incorrectly removed | 0 incorrectly removed | Low | Check Discover UI default filter for Full programs |
| 6 | Missing providers | 2 confirmed, others likely | Medium | Add Art at Edgemont + Grouse Mtn; run 9-phase for North Van |

## Recommended Fix Order
1. **Issue 3** (status conflicts) — trust/UX critical
2. **Issue 2** (schedule tags) — filter accuracy
3. **Issue 4** (Pedalheads completeness) — content gap
4. **Issue 1** (Burnaby neighbourhoods) — granularity
5. **Issue 6** (new providers) — expansion
6. **Issue 5** (verify Discover UI filter behavior) — investigation only
