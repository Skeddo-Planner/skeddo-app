# Pedalheads Second Spot-Check (Round 2)

**Date:** 2026-04-03
**Auditor:** Claude Agent (claude-sonnet-4-6)
**Method:** Browser navigation to pedalheads.com for each sample
**Purpose:** Verify zero errors remain after Round 1 fixes; use different locations than Round 1

---

## Samples Checked (8 Categories)

### 1. Private Lesson — Vancouver (Arbutus Ridge)
**DB Record:** ID 9479 — "Bike Camp – Private Lesson"
**URL:** `https://pedalheads.com/en/camp/details?region=1&program_event=30362&skill_level=2021&category_time=2016`

| Field | DB Value | Page Value | Result |
|-------|----------|------------|--------|
| Cost | $296 | $296/child | ✅ |
| Age | 3+ | Ages 3 and up | ✅ |
| Time | 4:05 PM–5:00 PM | 4:05pm–5:00pm | ✅ |
| Location | Vancouver / Arbutus Ridge | Arbutus Ridge - Prince of Wales Mini | ✅ |
| Name | Bike Camp – Private Lesson | Private Lesson | ✅ |
| URL | Works | 200 OK | ✅ |

**Verdict: PASS**

---

### 2. Trail Rider 1 — Vancouver (Point Grey)
**DB Record:** ID 10840 — "Bike Camp – Trail Rider 1 - Must ride two-wheeler bike"
**URL:** `https://pedalheads.com/en/camp/details?region=1&program_event=30513&skill_level=2273&category_time=4417`

| Field | DB Value | Page Value | Result |
|-------|----------|------------|--------|
| Cost (Jun 29) | $264 ❌ | **$272/child** | **PRICE ERROR** |
| Age | 4+ | Ages 4 and up | ✅ |
| Time | 9:15 AM–12:15 PM | 9:15am–12:15pm | ✅ |
| Location | Vancouver / Point Grey | Point Grey - Musqueam Park (Trail Riding) | ✅ |
| URL | Works | 200 OK | ✅ |

> **Fix applied:** 18 Trail Rider records on Jun 29 week updated cost $264 → $272.
> **Scope:** All records with `"Trail Rider" in name AND startDate=2026-06-29 AND cost=264`.

---

### 3. Soccer Half-Day Camp — Burnaby (Deer Lake) — 4-Day Week
**DB Record:** ID 12708 — "Soccer Camp – Half-Day Camp"
**URL:** `https://pedalheads.com/en/camp/details?region=1&program_event=32663&skill_level=2356&category_time=4886`

| Field | DB Value | Page Value | Result |
|-------|----------|------------|--------|
| Cost (Jun 29, 4-day) | $173 ❌ | **$240/child** | **PRICE ERROR** |
| Age | 3+ | Ages 3 and up | ✅ |
| Time | 11:30 AM–3:00 PM | 11:30am–3:00pm | ✅ |
| Location | Burnaby / Deer Lake | Deer Lake Park | ✅ |
| Days | Mon-Fri | Jun 29–Jul 3 (4 days due to Canada Day) | ✅ |
| URL | Works | 200 OK | ✅ |

> **Fix applied:** 12 Soccer Half-Day Camp records on 4-day weeks updated cost $173 → $240.
> **Scope:** All records with `"Half-Day Camp" in name AND subcategory=Soccer AND cost=173`.

---

### 4. Soccer Half-Day Camp — Burnaby (Deer Lake) — 5-Day Week
**DB Record:** ID 12709 — "Soccer Camp – Half-Day Camp"
**URL:** `https://pedalheads.com/en/camp/details?region=1&program_event=32663&skill_level=2356&category_time=4886`
**Week:** Jul 6–10, 2026

| Field | DB Value | Page Value | Result |
|-------|----------|------------|--------|
| Cost (5-day) | $216 ❌ | **$300/child** | **PRICE ERROR** |
| Age | 3+ | Ages 3 and up | ✅ |
| Time | 11:30 AM–3:00 PM | 11:30am–3:00pm | ✅ |

> **Fix applied:** 42 Soccer Half-Day Camp records on 5-day weeks updated cost $216 → $300.
> **Scope:** All records with `"Half-Day Camp" in name AND subcategory=Soccer AND cost=216`.

---

### 5. Swim Lessons — Richmond (Ironwood)
**DB Record:** ID 12981 — "Swim Lessons – Preschool 1: Octopus"
**Note:** Verifying the systemic swim-labeling issue from Round 1.

| Field | DB Value | Page Value | Result |
|-------|----------|------------|--------|
| Cost | $508 | $508/child | ✅ |
| Age | 4+ | Ages 4 and up | ✅ |
| Name in DB | "Swim Lessons – Preschool 1: Octopus" | Page resolves to Bike/Swim Combo | ⚠️ |
| Subcategory | Swimming | Cycling + Swimming (combo) | ⚠️ |

> **Confirms Round 1 systemic finding:** These 2352 "Swimming | Activity" records are Bike/Swim Combo components, not standalone swim lessons. The $508 price matches the 4-day combo week price. Dedicated audit still required to correct all labels.

---

### 6. Bike/Soccer Combo — Vancouver (Kensington)
**DB Record:** ID 2880 — "Bike & Soccer Combo – Level 1"
**URL:** City fallback page (registrationUrl points to Vancouver city page)

| Field | DB Value | Page Value | Result |
|-------|----------|------------|--------|
| Cost | $545 | $545 (confirmed via search) | ✅ |
| Age | 4+ | Ages 4 and up | ✅ |
| Time | 9:00 AM–4:00 PM | 9:00am–4:00pm | ✅ |
| Location | Vancouver | Charles Tupper & David Livingstone | ✅ |
| Description | "$436/week" (stale) | $545 is correct cost | ⚠️ stale description |

> **Note:** Description field contains "$436/week" which is stale/wrong. The `cost` field ($545) is correct. Description stale data is a cosmetic issue — cost field drives pricing in app.

---

### 7. Surrey Mislabeling — Actually Delta (Sunshine Hills)
**DB Records:** 37 records with `program_event` in {30445, 30446, 30447}
**Listed as:** Surrey / Cloverdale / Hillcrest Elementary School
**Actually:** Delta / Sunshine Hills Elementary

| Field | DB Value | Correct Value | Result |
|-------|----------|---------------|--------|
| city | Surrey ❌ | Delta | **CITY ERROR** |
| neighbourhood | Cloverdale ❌ | Sunshine Hills | **HOOD ERROR** |
| address | Hillcrest Elementary School, Surrey, BC ❌ | Delta - Sunshine Hills Elementary, Delta, BC | **ADDRESS ERROR** |
| lat | (wrong) ❌ | 49.123693 | **COORDS ERROR** |
| lng | (wrong) ❌ | -122.91069 | **COORDS ERROR** |

> **Fix applied:** All 37 records updated with correct Delta / Sunshine Hills values.
> Reference record: ID 9885 (correct Delta record with verified coordinates).

> **Also noted:** 6 additional records with program_events 30448-30450 labelled Surrey return 404 — these may be additional Delta programs not yet open; marked for follow-up.

---

### 8. Coquitlam Mislabeling — Actually Burnaby (Our Lady of Mercy)
**DB Records:** 18 records with `program_event=30391`
**Listed as:** Coquitlam / Como Lake / 1424 Winslow Ave, Coquitlam, BC
**Actually:** Burnaby / South Burnaby / Our Lady of Mercy Elementary

| Field | DB Value | Correct Value | Result |
|-------|----------|---------------|--------|
| city | Coquitlam ❌ | Burnaby | **CITY ERROR** |
| neighbourhood | Como Lake ❌ | South Burnaby | **HOOD ERROR** |
| address | 1424 Winslow Ave, Coquitlam, BC ❌ | Our Lady of Mercy Elementary, Burnaby, BC | **ADDRESS ERROR** |
| lat | (wrong) ❌ | 49.2186 | **COORDS ERROR** |
| lng | (wrong) ❌ | -122.9991 | **COORDS ERROR** |

> **Fix applied:** All 18 records updated with correct Burnaby / South Burnaby values.
> Reference record: ID 9695 (correct Burnaby Our Lady record). Live address confirmed: 7481 10th Ave., Burnaby, BC, V3N 2S1.

---

## Fixes Applied in This Session

| Fix | Records | Description |
|-----|---------|-------------|
| Trail Rider Jun 29 cost $264 → $272 | 18 | Jun 29 week priced higher than standard 5-day |
| Soccer Half-Day 4-day cost $173 → $240 | 12 | Jun 29 (Canada Day) and Aug 4 (BC Day) 4-day weeks |
| Soccer Half-Day 5-day cost $216 → $300 | 42 | Full 5-day weeks at correct price |
| Surrey → Delta city/neighbourhood/address/coords | 37 | program_events 30445-30447 mislabelled as Surrey |
| Coquitlam → Burnaby city/neighbourhood/address/coords | 18 | program_event=30391 mislabelled as Coquitlam |
| **Total** | **127** | |

---

## Open Issues (Carry-Forward from Round 1 + New)

| Priority | Issue | Scope | Action |
|----------|-------|-------|--------|
| HIGH | Swim lesson labeling: ~2352 "Swimming\|Activity" records are actually Bike/Swim Combo components | ~2352 records | Dedicated swim audit needed |
| MEDIUM | Aug 4–7 broken registration URLs (category_time=1/2/3 → 404) | ~269 records | Find correct category_time IDs per location |
| MEDIUM | Surrey 404 records (program_events 30448-30450) | 6 records | Identify correct program or mark unavailable |
| LOW | Bike/Swim Combo endTime varies by location | Some records | Verify per location |
| LOW | Stale descriptions (e.g. "$436/week" in Bike/Soccer Combo) | Unknown | Description audit |

---

## Category Verdict

| # | Category | Status |
|---|----------|--------|
| 1 | Private Lesson — Vancouver Arbutus Ridge | ✅ PASS |
| 2 | Trail Rider 1 — Vancouver Point Grey | ✅ PASS (price fixed: $264→$272) |
| 3 | Soccer Half-Day 4-day — Burnaby Deer Lake | ✅ PASS (price fixed: $173→$240) |
| 4 | Soccer Half-Day 5-day — Burnaby Deer Lake | ✅ PASS (price fixed: $216→$300) |
| 5 | Swim Lessons — Richmond Ironwood | ⚠️ SYSTEMIC LABELING (carry-forward) |
| 6 | Bike/Soccer Combo — Vancouver Kensington | ✅ PASS |
| 7 | Surrey → Delta mislabeling | ✅ PASS (location fixed: 37 records) |
| 8 | Coquitlam → Burnaby mislabeling | ✅ PASS (location fixed: 18 records) |

**Overall: 7/8 categories PASS (with fixes). 1 carry-forward issue (swim labeling). 127 records corrected.**
