# Skeddo Database — Comprehensive Audit Methodology

**Version:** 1.0
**Authors:** Tom (spot-checks) + Claude Code (analysis + documentation)
**Source data:** Two days of spot-checks and full-database analysis (2026-03-30 + 2026-03-31)
**Scope:** 6,915 programs across 429 providers
**Status:** Methodology only — no changes have been made. Review before executing anything.

---

## How to Use This Document

This is the **single source of truth** for fixing the Skeddo database. It covers:
- Every known data quality problem found across two days of analysis
- Exact detection methods (scripts/queries to find affected records)
- Resolution logic for existing programs
- Pipeline changes to prevent recurrence in future scrapes
- Which new validation rules to add to `DATA-QUALITY-RULES.md`

**Tom's rules — hardcoded into this document:**
1. Duplicates (#7): only delete when EVERY substantive field matches — no false positives
2. Expired programs (#11): change status to `"Completed"`, do NOT delete
3. Every fix must have both a detection method AND a resolution method
4. Fixes must apply to ALL existing programs AND prevent issues in future scrapes

---

## Execution Order

Run fixes in this order — later fixes depend on earlier ones being clean.

| Step | Pattern # | Why This Order |
|------|-----------|----------------|
| 1 | #13 Enrollment status conflicts | Trust/UX critical; affects what parents see today |
| 2 | #11 Expired programs → Completed | Removes stale data from Discover before other fixes |
| 3 | #3 Non-kids programs | Removes adult content before re-auditing counts |
| 4 | #9 Provider name normalization | Must happen before #7 (duplicate detection uses provider name) |
| 5 | #10 Cross-provider contamination | Must happen before #7 (dedup uses provider) |
| 6 | #7 Duplicate detection | Run after provider names are clean |
| 7 | #4 Internal codes as names | Safe at any point; no dependencies |
| 8 | #8 Missing ageMax | No dependencies; can run any time |
| 9 | #2 Burnaby Unknown facilities | Requires Burnaby facility mapping table first |
| 10 | #1 Wrong neighbourhoods | Depends on facility mapping from #2 |
| 11 | #5 Cost-per-hour fix | Requires date ranges to be correct first |
| 12 | #6 URL depth | Independent; can run any time |
| 13 | #12 Incorrectly removed programs | Investigation/UI fix; no data dependency |
| 14 | #14 Incomplete provider coverage | New scraping work; no data dependency |
| 15 | #15–#19 Quality/polish | Run last; lowest urgency |

---

## TIER 1 — CORE UX BREAKERS

These patterns directly break the app experience for parents. Fix first.

---

### Pattern 1: Wrong Neighbourhoods / Locations

**Rule reference:** Rule 6 (neighbourhood must exist in filter), Rule 11 (real street address)

#### Scope
- **730 programs** with generic `neighbourhood: "Burnaby"` instead of specific sub-area
- Root cause: Burnaby ActiveNet API returns only `", Burnaby, BC"` (no street address), so the address-based neighbourhood matcher produces nothing and programs fall through to a generic default

#### Detection
```bash
# Find programs with generic city-level neighbourhood
node -e "
const p = require('./src/data/programs.json');
const generic = p.filter(x => ['Burnaby', 'Vancouver', 'North Vancouver', 'West Vancouver', 'Richmond'].includes(x.neighbourhood));
console.log(generic.length, 'programs with generic city neighbourhoods');
generic.slice(0, 10).forEach(x => console.log(x.id, x.provider, x.neighbourhood, x.address));
"
```

#### Resolution — Existing Programs
Build a `BURNABY_CENTRES` lookup table in `scripts/fix-neighbourhoods.cjs` (similar to the existing `CENTRES` object for Vancouver). Map known Burnaby facility names to correct neighbourhoods:

| Facility Name | Correct Neighbourhood |
|---------------|-----------------------|
| Bonsor Recreation Complex | Metrotown |
| Edmonds Community Centre | Edmonds |
| Confederation Park Community Centre | North Burnaby |
| Kensington Community Centre | Kensington |
| Cameron Recreation Complex | Lougheed |
| McGill Library & Community Centre | North Burnaby |
| Burnaby Lake Recreation Complex | Burnaby Lake |
| Eileen Dailly Leisure Pool | North Burnaby |
| Stride Avenue Community School | East Burnaby |
| South Slope Community Centre | South Burnaby |

This table must be researched from the Burnaby Parks, Recreation & Cultural Services site and expanded to cover all 729+ "Unknown" facility programs.

Apply via `scripts/fix-neighbourhoods.cjs` — match on `provider` field containing the facility name, then assign neighbourhood.

#### Pipeline Prevention
In `scripts/refresh-activenet.js` and `scripts/scrape-activenet-multi.cjs`: after extracting Burnaby programs, apply the `BURNABY_CENTRES` lookup against the facility name field returned by the API before writing to `programs.json`.

#### New Validation Rule (DATA-QUALITY-RULES.md)
> **Rule 39: Generic City Neighbourhood Is Not Acceptable**
> `neighbourhood` must be a specific district, community, or area — not just a city name. Programs with neighbourhood equal to a bare city name ("Burnaby", "Vancouver", "Richmond", etc.) must be flagged as errors in the validator. The only exception is `"Online"`.

#### Automation
`validate-programs.cjs`: add a check — if `neighbourhood` is in `['Burnaby', 'Vancouver', 'North Vancouver', 'West Vancouver', 'Richmond', 'Surrey', 'Coquitlam']` AND the program has a real address, flag as `WARN: generic_neighbourhood`.

#### Estimated Time
- Building the Burnaby facility mapping table: 30–60 minutes (manual research)
- Script update + run: 15 minutes
- Full automation: 1–2 hours

---

### Pattern 2: Burnaby "Unknown" Facility Programs

**Rule reference:** Rule 11 (real street address), Rule 6 (neighbourhood filter)

#### Scope
- **729 programs** with `provider: "City of Burnaby - Unknown"` — no specific facility name
- These represent ~50% of all Burnaby programs
- Root cause: Burnaby ActiveNet API returns some programs with blank or generic facility assignment; the scraper falls back to "Unknown"

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');
const unknown = p.filter(x => x.provider && x.provider.includes('Unknown'));
console.log(unknown.length, 'Unknown-facility programs');
// Count by city
const byCityUnknown = {};
unknown.forEach(x => { const city = (x.provider || '').split(' - ')[0]; byCityUnknown[city] = (byCityUnknown[city] || 0) + 1; });
console.log(byCityUnknown);
"
```

#### Resolution — Existing Programs
1. For each "Unknown" Burnaby program, check the `activityId` or `externalId` field — the ActiveNet API may return a `location` or `facility` sub-object that the scraper isn't currently storing
2. Re-run the Burnaby scraper with facility extraction enabled (see Pipeline Prevention below)
3. Any program that still can't be matched to a specific facility: set `provider: "City of Burnaby Recreation"` (better than "Unknown"), flag with `needsFacilityReview: true`

#### Pipeline Prevention
In `scripts/scrape-activenet-multi.cjs`: extract the `location.location_name` or `activity_location` field from the Burnaby API response and store it as both the `facility` subfield and use it to construct a proper `provider` string (e.g., `"City of Burnaby - Bonsor Recreation Complex"`).

#### New Validation Rule
> **Rule 40: Provider Name Must Not Contain "Unknown"**
> Any program with `provider` containing `"Unknown"` is flagged as an error. Assign the real facility name from the source API, or use the city name alone if facility is genuinely unavailable.

#### Estimated Time
- API investigation + scraper update: 1–2 hours
- Re-scraping Burnaby: 20–30 minutes
- Manual cleanup of remaining unknowns: 30 minutes

---

### Pattern 3: Non-Kids Programs Showing on Kids Platform

**Rule reference:** Rule 31 (triple-check before removing), Rule 18 (include ALL program types for children)

#### Scope
Confirmed through prior spot-check removals: adult-only personal training, cycle fit, adult dance, and seniors events were found and removed in commit `396b5ca`. However, given the scale of the database (6,915 programs), similar programs likely persist.

**HARD RULE from Tom:** Only remove programs where `ageMin >= 18`. Ages 13–17 are valid kids/teen programs.

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');

// Programs explicitly for adults (ageMin >= 18)
const adultOnly = p.filter(x => x.ageMin >= 18);
console.log('ageMin >= 18:', adultOnly.length);

// Programs with adult keywords in name (candidates for manual review only)
const adultKeywords = ['senior', 'adult', 'aquafit', '55+', '60+', 'older adult', 'mature', 'retirement'];
const keywordMatches = p.filter(x => {
  const name = (x.name || '').toLowerCase();
  return adultKeywords.some(k => name.includes(k)) && (!x.ageMin || x.ageMin < 18);
});
console.log('Adult keywords but no ageMin >= 18 (manual review needed):', keywordMatches.length);
keywordMatches.forEach(x => console.log(x.id, x.name, 'ageMin:', x.ageMin));
"
```

#### Resolution — Existing Programs
- **Automatic removal:** Programs where `ageMin >= 18` (no exceptions)
- **Manual review required:** Programs with senior/adult keywords but no explicit age range — these could be intergenerational programs
- **NEVER remove:** Programs for ages 13–17, intergenerational programs (e.g., "Parent & Child"), programs where the keyword appears in a different context (e.g., "Adult Swim lessons for teens" means lessons in a pool, not adult-targeted)

#### Pipeline Prevention
In `scripts/refresh-activenet.js` and all private scrapers: add a filter — skip any program where the API returns `age_max_year <= 17 AND age_min_year >= 18`. This is already partially in place for CoV (comment in the script) but must be verified for Burnaby and private scrapers.

#### New Validation Rule
> **Rule 41: Programs With ageMin >= 18 Must Not Appear in Skeddo**
> The validator auto-flags programs where `ageMin >= 18` as REMOVE candidates. Programs with adult keywords but `ageMin < 18` are flagged as WARN for manual review. Kids/teen programs (0–17) are always retained.

#### Estimated Time
- Detection + auto-removal script: 30 minutes
- Manual review of keyword matches: 30–60 minutes

---

### Pattern 4: Internal Codes as Program Names

**Rule reference:** Rule 22 (never use internal codes)

#### Scope
Not yet fully quantified. Confirmed from analysis context: programs with names like `"04-ASR-K | Wednesday Rides: KIDS | April"` — these contain internal course codes as prefixes.

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');

// Pattern: code prefix with | separator
const codePrefixPattern = /^[A-Z0-9\-]{3,12}\s*\|/;
const codeMatches = p.filter(x => codePrefixPattern.test(x.name || ''));
console.log('Programs with internal code prefixes:', codeMatches.length);
codeMatches.forEach(x => console.log(x.id, x.name));

// Pattern: all-caps abbreviation at start
const allCapsPrefix = /^[A-Z]{2,6}\s*[-–]/;
const capsMatches = p.filter(x => allCapsPrefix.test(x.name || ''));
console.log('Programs with all-caps prefix abbreviations:', capsMatches.length);
capsMatches.forEach(x => console.log(x.id, x.name));
"
```

#### Resolution — Existing Programs
Strip internal code prefixes from the `name` field. The real program name is the text after the `|` separator. Examples:
- `"04-ASR-K | Wednesday Rides: KIDS | April"` → `"Wednesday Rides: Kids — April"`
- `"ASR-TEEN | Afternoon Skills Ride — Teens"` → `"Afternoon Skills Ride — Teens"`

Fix should be applied with regex: `name.replace(/^[A-Z0-9\-]+\s*\|\s*/, '').replace(/\s*\|.*$/, '').trim()`

#### Pipeline Prevention
In the scraper(s) that produce these names: add a name-cleanup step that strips internal codes before writing to `programs.json`. If the code is needed for tracking, store it in a separate `internalCode` field.

#### New Validation Rule
> **Rule 42: Program Names Must Not Contain Internal Course Codes**
> Names matching the pattern `CODE | Program Name` or starting with 3+ uppercase letters followed by a dash or pipe are flagged. The validator strips the prefix and saves the clean name when `--fix` is used.

#### Estimated Time
- Detection + script: 20 minutes
- Manual verification of edge cases: 30 minutes

---

### Pattern 5: Cost-Per-Hour Calculation Broken for Season-Long Programs

**Rule reference:** Rule 3 (costs must match registration page), Rule 2 (dates must be program-specific)

#### Scope
Any program where:
- `cost` is a per-week price (e.g., $350/week)
- But `startDate`/`endDate` span the entire summer (e.g., July 6 – August 21)
- The app calculates cost-per-hour using total duration, resulting in absurdly low $/hr figures

From the 2026-03-30 spot-check: Rule 2 was added specifically because 130+ programs had season-wide date ranges instead of specific week dates.

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');

// Programs with long date spans AND a non-null cost
const longSpan = p.filter(x => {
  if (!x.startDate || !x.endDate || !x.cost) return false;
  const start = new Date(x.startDate);
  const end = new Date(x.endDate);
  const days = (end - start) / (1000 * 60 * 60 * 24);
  return days > 14; // More than 2 weeks = likely season-wide
});
console.log('Programs with date spans > 14 days:', longSpan.length);

// Among these, find ones with repeating field set (these are correct — they're multi-week)
const legitimateRepeating = longSpan.filter(x => x.repeating);
const problematic = longSpan.filter(x => !x.repeating);
console.log('  With repeating field (correct):', legitimateRepeating.length);
console.log('  Without repeating field (problematic):', problematic.length);
problematic.slice(0, 10).forEach(x => console.log(x.id, x.name, x.startDate, x.endDate, 'cost:', x.cost));
"
```

#### Resolution — Existing Programs
Two cases:
1. **Weekly repeating camps:** If the program runs weekly through the season, set `repeating: "weekly"` + `repeatEndDate` + set `startDate`/`endDate` to the FIRST week only (Rule 2)
2. **Multi-week intensives:** If the program is one continuous multi-week program (not repeating), the date span is correct — but cost should reflect the full program cost, not a weekly cost. Add `costNote: "Full program cost for X-week intensive"`

Do NOT attempt to auto-fix these — each case requires verification against the provider's registration page.

#### Pipeline Prevention
In `scripts/fill-computable-fields.cjs`: when computing cost-per-hour, check if `repeating` is set. If yes, compute duration from `startDate` to `endDate` of ONE session, not the full season span. Add a `costPerHourNote: "calculated per session"` flag.

In the validator: flag any program where date span > 21 days AND `repeating` is not set AND `scheduleType` is not a multi-week intensive type — requires human review.

#### New Validation Rule
> **Rule 43: Date Spans Over 21 Days Require the `repeating` Field or an Intensive Classification**
> Programs with `endDate` more than 21 days after `startDate` must either have `repeating: "weekly"` (or other valid value) OR `scheduleType: "Intensive"`. Without one of these, the cost-per-hour calculation will be wrong. Flagged as WARN with `--fix` offering to set `repeating: "weekly"`.

#### Estimated Time
- Detection: 10 minutes
- Manual review + fix (each case needs provider verification): 2–4 hours depending on volume

---

### Pattern 6: URLs Not Reaching Registration Within 1 Click

**Rule reference:** Rule 1, Rule 29, Rule 32, Rule 35

#### Scope
- **28 programs** confirmed with no `registrationUrl` at all (ACT-prefix hockey programs)
- **31 URLs** shared by 10+ programs (likely generic landing pages, not program-specific)
- Additional unknown count: URLs that technically load but land on a search page or category listing

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');

// No URL at all
const noUrl = p.filter(x => !x.registrationUrl);
console.log('No registrationUrl:', noUrl.length);

// Generic homepage patterns (domain root only, or known generic paths)
const genericPatterns = [
  /^https?:\/\/[^\/]+\/?$/,           // domain root
  /\/home\/?$/,
  /\/index\.html?\/?$/,
  /\/programs\/?$/,
  /\/classes\/?$/,
  /\/camps\/?$/,
  /\/activities\/?$/,
  /\/register\/?$/,                    // generic register page
  /activecommunities\.com\/[^\/]+\/activity\/search(?!\/detail)/,  // ActiveNet search (not detail)
];
const genericUrls = p.filter(x => {
  if (!x.registrationUrl) return false;
  return genericPatterns.some(pat => pat.test(x.registrationUrl));
});
console.log('Generic/non-specific URLs:', genericUrls.length);

// activekids.com or campscui.active.com (banned per Rule 24)
const banned = p.filter(x => x.registrationUrl && (x.registrationUrl.includes('activekids.com') || x.registrationUrl.includes('campscui.active.com')));
console.log('Banned third-party URLs:', banned.length);
"
```

#### Resolution — Existing Programs
- **No URL:** Research and add the program-specific URL from the provider's site. For the 28 ACT hockey programs, find the hockey association's registration system.
- **Generic URL:** Replace with the direct program detail URL. For ActiveNet programs, use `/activity/search/detail/{activityId}`.
- **Banned URLs:** Replace with direct provider URL (Rule 24).

Run `node scripts/validate-urls.cjs --fix` to apply Rule 35 fallbacks for broken links.

#### Pipeline Prevention
All scrapers: verify the URL extraction logic produces activity-detail URLs, not search page URLs. For ActiveNet: confirm the URL template is `/activity/search/detail/{id}` not `/activity/search`.

#### Estimated Time
- Auto-detection and known fixes: 30 minutes
- Manual URL research for 28 hockey programs: 30 minutes
- Broken link verification (all 6,915): runs automatically via existing `validate-urls.cjs`

---

## TIER 2 — DATA INTEGRITY

---

### Pattern 7: 1,343 True Duplicates

**Rule reference:** Rule 10, Rule 30

#### Scope
- **791 groups** of same name + same provider
- **190 groups** = true duplicates: **1,343 programs** where name + provider + dates + cost ALL match
- **601 groups** = legitimate recurring sessions (same name, different dates/times/ages) — KEEP ALL

**Tom's rule:** Only delete when EVERY substantive field matches. Different times, ages, costs, or ActiveNet IDs = keep both.

#### Detection
```javascript
// Run this as: node scripts/find-duplicates.cjs > duplicate-report.json
const programs = require('../src/data/programs.json');

const groups = {};
programs.forEach(p => {
  const key = `${p.provider}|||${p.name}|||${p.startDate}|||${p.endDate}|||${String(p.cost)}`;
  if (!groups[key]) groups[key] = [];
  groups[key].push(p);
});

const trueDupes = Object.values(groups).filter(g => g.length > 1);
console.log('True duplicate groups:', trueDupes.length);
console.log('Total duplicate records:', trueDupes.reduce((sum, g) => sum + g.length - 1, 0));

// Output: which record to keep (first), which to remove (rest)
trueDupes.forEach(group => {
  const keep = group[0];
  const remove = group.slice(1);
  // Verify ALL substantive fields match before flagging
  const substantiveFields = ['registrationUrl', 'ageMin', 'ageMax', 'address', 'startTime', 'endTime', 'cost', 'days', 'category', 'enrollmentStatus', 'dayLength', 'durationPerDay'];
  const allMatch = remove.every(r => substantiveFields.every(f => String(r[f]) === String(keep[f])));
  if (allMatch) {
    console.log('SAFE TO REMOVE:', remove.map(r => r.id));
  } else {
    console.log('SUBSTANTIVE DIFFERENCE — keep both:', group.map(r => r.id));
  }
});
```

#### Resolution — Existing Programs
1. Run the detection script above
2. For each group where ALL substantive fields match: remove duplicates, keeping the record with the more complete data (prefer records with `priceVerified: true`, or with a non-null `registrationUrl`)
3. For groups with ANY field difference: keep all records — they represent different bookable options

#### Pipeline Prevention
In `scripts/refresh-activenet.js` and all scrapers: before appending a new program to the output, check if a record with identical `provider + name + startDate + endDate + cost` already exists. If yes, skip unless the `id` is different AND any substantive field differs.

#### New Validation Rule
> **Rule 44: Deduplication Must Check All Substantive Fields**
> The validator's duplicate check uses Rule 30's full field list. Running `validate-programs.cjs --fix` removes only records where ALL of: registrationUrl, ageMin, ageMax, address, startTime, endTime, cost, days, category, enrollmentStatus, dayLength, durationPerDay match an existing record. This is already partially implemented per Rule 30 — verify it covers all 1,343 identified duplicates.

#### Estimated Time
- Detection script + validation: 20 minutes
- Manual spot-check of 10 random "safe to remove" groups: 30 minutes
- Automated removal: 10 minutes

---

### Pattern 8: 1,668 Programs Missing ageMax (24% of Database)

**Rule reference:** Rule 5 (age ranges must match requirements)

#### Scope
- **1,668 programs** with `ageMax: null` or missing
- Age eligibility filter cannot include these programs for age-filtered searches
- An additional **162 programs** are missing `ageMin`

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');
const noAgeMax = p.filter(x => x.ageMax === null || x.ageMax === undefined);
const noAgeMin = p.filter(x => x.ageMin === null || x.ageMin === undefined);
console.log('Missing ageMax:', noAgeMax.length);
console.log('Missing ageMin:', noAgeMin.length);

// Breakdown by provider
const byProvider = {};
noAgeMax.forEach(x => { byProvider[x.provider] = (byProvider[x.provider] || 0) + 1; });
Object.entries(byProvider).sort((a,b) => b[1]-a[1]).slice(0, 15).forEach(([prov, count]) => console.log(count, prov));
"
```

#### Resolution — Existing Programs
Three sub-cases:
1. **"All ages" programs** (family events, open gym, etc.): set `ageMax: 17` (Skeddo's scope ceiling)
2. **Adult programs with missing ageMin** (detected from name keywords): set `ageMin: 18` — these will then be caught by Pattern 3 detection and removed
3. **Kids programs where age range is genuinely unknown**: set `ageMax: 17` as a safe default AND `ageNote: "Age range unconfirmed — check provider"` — this is better than hiding them from all age-filtered searches

**Do NOT set ageMax to arbitrary values without basis.** Use provider website data where available.

For Arts Umbrella programs with `ageMax: 19`: cap at `ageMax: 18` (Skeddo's scope). Per the analysis, these are ages 13–19 intensives — valid programs, just need the cap applied.

#### Pipeline Prevention
In all scrapers: if the API returns age data, always extract both min and max. If only one bound is available from the API, log it as a data gap rather than leaving the field null. Add a `TODO: ageMax` comment in the record for manual follow-up.

#### New Validation Rule
> **Rule 45: ageMax Null Programs Must Display Clearly**
> Programs with `ageMax: null` must not disappear silently from age-filtered views. The UI should treat `ageMax: null` as "any age" when displaying, but flag these records in the validator as WARN for manual age range research. The validator reports count and providers of null-ageMax programs in every run.

#### Estimated Time
- Detection + bulk default fix: 20 minutes
- Manual research for top providers: 1–2 hours

---

### Pattern 9: Provider Name Inconsistency

**Rule reference:** (New rule needed)

#### Scope
- **18 community centres** split between `"Cmty Centre"` and `"Community Centre"` — ~1,200+ programs affected
- Provider-level filtering returns incomplete results for any of these centres
- Additional pairs: STEMA Learning / STEMA Learning Centre, JCC of Greater Vancouver / JCCGV, Phoenix Gymnastics / Vancouver Phoenix Gymnastics

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');

// Find 'Cmty Centre' vs 'Community Centre' splits
const cmty = p.filter(x => x.provider && x.provider.includes('Cmty Centre'));
const community = p.filter(x => x.provider && x.provider.includes('Community Centre'));
console.log('Cmty Centre programs:', cmty.length);
console.log('Community Centre programs:', community.length);

// Find split pairs
const cmtyNames = new Set(cmty.map(x => x.provider.replace('Cmty Centre', '').trim()));
const commNames = new Set(community.map(x => x.provider.replace('Community Centre', '').trim()));
const splits = [...cmtyNames].filter(n => commNames.has(n));
console.log('Centres with split naming:', splits.length);
splits.forEach(n => {
  const c1 = cmty.filter(x => x.provider.includes(n)).length;
  const c2 = community.filter(x => x.provider.includes(n)).length;
  console.log(' ', n, '— Cmty:', c1, '| Community:', c2);
});
"
```

#### Resolution — Existing Programs
**Canonical form:** `"Community Centre"` (full word, not abbreviation)

Normalize all:
- `"X Cmty Centre"` → `"X Community Centre"`
- `"JCCGV"` → `"JCC of Greater Vancouver"`
- `"STEMA Learning Centre"` → `"STEMA Learning"` (verify which is the official name on their website)
- `"Vancouver Phoenix Gymnastics"` → `"Phoenix Gymnastics"` (verify)

This must run **before** duplicate detection (Pattern 7) since deduplication uses the `provider` field.

#### Pipeline Prevention
In all scrapers: add a `normalizeProviderName(name)` function that applies these substitutions before writing to `programs.json`. Run this normalization on every import.

#### New Validation Rule
> **Rule 46: Provider Names Must Use Canonical Forms**
> Maintain a `PROVIDER_ALIASES` lookup in `validate-programs.cjs` that maps non-canonical names to their canonical versions. Any program with a non-canonical provider name is auto-fixed when `--fix` is used. New aliases must be added whenever a split is discovered.

#### Estimated Time
- Script to normalize + verify: 30 minutes
- Verification that filter works correctly after: 15 minutes

---

### Pattern 10: Cross-Provider Contamination (Access2Innovate)

**Rule reference:** Rule 23 (verify against provider's live page)

#### Scope
- **Access2Innovate** appears in the database as a provider but uses URLs from **Mulgrave School** and **Collingwood School**
- 112 Mulgrave + 66 Collingwood programs potentially duplicated under Access2Innovate
- Petit Architect listed under 3 provider names for the same business (different locations)
- Other URL-sharing anomalies: STEMA / STEMA Learning Centre (15+15 programs)

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');

// Find programs sharing URLs across different providers
const urlToProviders = {};
p.forEach(x => {
  if (!x.registrationUrl) return;
  const url = x.registrationUrl.split('?')[0]; // strip query string
  if (!urlToProviders[url]) urlToProviders[url] = new Set();
  urlToProviders[url].add(x.provider);
});

const crossProvider = Object.entries(urlToProviders)
  .filter(([url, providers]) => providers.size > 1);
console.log('URLs shared across different providers:', crossProvider.length);
crossProvider.forEach(([url, providers]) => {
  const count = p.filter(x => x.registrationUrl && x.registrationUrl.startsWith(url)).length;
  console.log(count, 'programs |', [...providers].join(' + '), '|', url.substring(0, 60));
});
"
```

#### Resolution — Existing Programs
**Access2Innovate specifically:**
1. Audit each Access2Innovate program — is it a duplicate of an existing Mulgrave/Collingwood entry?
2. If yes (same program, same URL, same data): remove the Access2Innovate version; keep the school's own entry
3. If no (Access2Innovate adds unique info or is the only listing): update `provider` to the school's name, not the broker name

**Petit Architect:** Merge all three provider variants into `"Petit Architect"`, using the `neighbourhood` and `address` fields to distinguish locations.

#### Pipeline Prevention
When importing from private providers: if the registrationUrl domain doesn't match the provider's own domain, flag for manual review. A provider whose URLs all point to a different organization's site is a contamination signal.

#### New Validation Rule
> **Rule 47: Provider Name Must Match the Registration URL Domain**
> If a provider's programs all have URLs pointing to a different organization's domain, flag as WARN for manual review. This catches broker/reseller contamination early.

#### Estimated Time
- Audit Access2Innovate programs: 45–60 minutes (manual)
- Petit Architect merge: 15 minutes
- STEMA/JCC/Phoenix fixes: handled in Pattern 9

---

### Pattern 11: 449 Expired Programs Still Visible in Discover

**Rule reference:** Rule 31 (triple-check before removing — but these are status changes, not removals)

#### Scope
- **449 programs** with `endDate` before today (2026-03-31)
- **1 program** (`LGY-129`) with `endDate: "2015-11-02"` — clearly a data bug
- These programs are still showing in the Discover tab

**Tom's rule:** Change status to `"Completed"` — do NOT delete.

#### Detection
```bash
node -e "
const today = '2026-03-31';
const p = require('./src/data/programs.json');
const expired = p.filter(x => x.endDate && x.endDate < today && x.enrollmentStatus !== 'Completed');
console.log('Expired programs not yet Completed:', expired.length);

// Broken date on LGY-129
const broken = p.filter(x => x.endDate && x.endDate < '2020-01-01');
console.log('Programs with very old end dates (likely bugs):', broken.length);
broken.forEach(x => console.log(x.id, x.name, x.startDate, x.endDate));
"
```

#### Resolution — Existing Programs
1. **LGY-129:** Fix the malformed endDate — based on the program being "Spring Break 2026 - Extended Play", correct endDate is approximately `2026-03-21`. The startDate format `"2026-03-16 00:00:00"` should also be normalized to `"2026-03-16"`.

2. **All 449 expired programs:** Set `enrollmentStatus: "Completed"`, `status: "Completed"`. Do NOT change any other fields. Do NOT delete.

Script:
```javascript
// In scripts/mark-expired-completed.cjs
const today = new Date().toISOString().split('T')[0];
programs.forEach(p => {
  if (p.endDate && p.endDate < today && p.enrollmentStatus !== 'Completed') {
    p.enrollmentStatus = 'Completed';
    p.status = 'Completed';
  }
});
```

#### Pipeline Prevention
In `scripts/refresh-activenet.js` and all daily refresh scripts: as part of the refresh cycle, run the expiry check. Any program whose `endDate` is in the past and isn't already `"Completed"` should be auto-updated.

Add this check to `.github/workflows/refresh-programs.yml` as a post-scrape step.

#### New Validation Rule
> **Rule 48: Programs Past Their End Date Must Be Marked Completed**
> The validator flags any program with `endDate < today` that doesn't have `enrollmentStatus: "Completed"`. When `--fix` is used, it updates the status. This runs automatically in the daily pipeline.

#### Estimated Time
- Fix script: 20 minutes
- LGY-129 manual fix: 5 minutes
- Daily pipeline integration: 15 minutes

---

### Pattern 12: Programs Incorrectly Removed Instead of Marked Full/Waitlist

**Rule reference:** Rule 31 (triple-check before removing)

#### Scope
Investigation from 2026-03-30 spot-check found **no evidence of systemic incorrect removal** — all confirmed removals were intentional (adult programs, overnight camps, confirmed duplicates).

However, Tom's concern was valid: the **Discover tab may hide Full/Waitlist programs by default**, making them appear deleted when they're just filtered out.

#### Detection
Verify the Discover tab's default filter state:
```bash
grep -n "status.*Full\|Full.*status\|filter.*status\|default.*filter" skeddo-app/src/tabs/DiscoverTab.jsx | head -20
```

#### Resolution
1. If `status: "Full"` programs are hidden by default: add a UI indicator — `"Showing X programs (Y hidden: Full/Waitlist)"` with an option to show all
2. If they ARE shown by default: no change needed

#### Pipeline Prevention
No pipeline change needed. Add a comment in the Discover tab filter state initialization explaining the default behavior.

#### Estimated Time
- Investigation: 15 minutes
- UI change (if needed): 30 minutes

---

### Pattern 13: Enrollment Status Not Matching Reality

**Rule reference:** Rule 8, Rule 14, Rule 28, Rule 37

#### Scope
- **260 programs** with `status: "Open"` but `enrollmentStatus: "Coming Soon"` or `"Likely Coming Soon"` — direct contradiction
- Pedalheads: 27 programs all show `status: "Open"` but `enrollmentStatus: "Coming Soon"` with registration dates like 2026-04-09
- Root cause: `status` (from ActiveNet live API) and `enrollmentStatus` (from HTML scraping or manual entry) are never synchronized

**This is the highest-trust issue in the database.** Parents clicking "Register Now" on an unopened program is a trust-breaking bug.

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');

// Conflict: status Open but enrollmentStatus says not open
const conflicts = p.filter(x =>
  x.status === 'Open' &&
  ['Coming Soon', 'Likely Coming Soon', 'Upcoming'].includes(x.enrollmentStatus)
);
console.log('Status/enrollmentStatus conflicts:', conflicts.length);

// Conflict: registrationDate is in the future but status is Open
const today = '2026-03-31';
const prematureOpen = p.filter(x =>
  x.status === 'Open' &&
  x.registrationDate &&
  x.registrationDate > today
);
console.log('Open status but future registration date:', prematureOpen.length);
prematureOpen.forEach(x => console.log(x.id, x.name, 'regDate:', x.registrationDate));
"
```

#### Resolution — Existing Programs
**Rule: Use the more restrictive status when the two fields conflict.**

Priority order (most restrictive wins):
1. If `registrationDate` is in the future → override to `"Coming Soon"` (if within 30 days) or `"Upcoming"`
2. If `enrollmentStatus` is `"Coming Soon"` but `status` is `"Open"` → set `status: "Coming Soon"`
3. If `enrollmentStatus` is `"Likely Coming Soon"` → set `status: "Likely Coming Soon"`

Never override `"Full"`, `"Closed"`, or `"Waitlist"` to `"Open"`.

#### Pipeline Prevention
In `scripts/update-activenet-status.cjs`: after mapping API status to our `status` field, check `registrationOpenDate` from the API. If it's in the future, always set `status: "Coming Soon"` regardless of what the API's availability field says.

In the reconciliation step: when updating `status`, also update `enrollmentStatus` to match (or vice versa) so they never diverge.

#### New Validation Rule
> **Rule 49: Status and enrollmentStatus Must Not Contradict**
> The validator flags any program where `status: "Open"` AND (`enrollmentStatus` is "Coming Soon", "Likely Coming Soon", or "Upcoming") OR where `registrationDate > today` AND `status: "Open"`. Auto-fix resolves by applying the more restrictive value.

#### Estimated Time
- Fix script: 30 minutes
- Pipeline update: 45 minutes

---

### Pattern 14: Incomplete Provider Coverage

**Rule reference:** Rule 18 (include ALL program types)

#### Scope
- **Pedalheads:** Only 2 locations (Point Grey + Riley Park) out of 10+ Metro Vancouver locations; missing soccer camps, combo camps, age progressions
- **Private providers via `refresh-private.js`**: generic scraper has no multi-location enumeration; any multi-site provider is likely partially covered
- **Confirmed missing:** Art at Edgemont (North Vancouver), Grouse Mountain Camps
- **Likely underrepresented:** North Vancouver private providers overall

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');
const pedalheads = p.filter(x => x.provider && x.provider.toLowerCase().includes('pedalhead'));
const uniqueLocations = new Set(pedalheads.map(x => x.neighbourhood));
console.log('Pedalheads programs:', pedalheads.length);
console.log('Pedalheads locations:', [...uniqueLocations]);
"
```

#### Resolution — Existing Programs
No existing programs need fixing for this pattern. This is an expansion task.

Steps:
1. Build a full Metro Vancouver Pedalheads location list from their website
2. Add each location URL to `refresh-private.js` scraper config
3. Add Art at Edgemont to `refresh-private.js`
4. Add Grouse Mountain Camps to `refresh-private.js`
5. Run the 9-phase search methodology (`docs/PROGRAM-SEARCH-METHODOLOGY.md`) for North Vancouver

#### Pipeline Prevention
Create a `docs/PROVIDER-MANIFEST.md` — a registry of every provider we've evaluated, with status (`active`, `added`, `rejected`, `needs-expansion`). When a provider is added with only partial locations, mark it `needs-expansion` with a note about what's missing. This prevents the same gaps from being forgotten.

#### Estimated Time
- Pedalheads full enumeration + scraper update: 1–2 hours
- Art at Edgemont + Grouse Mountain: 30 minutes
- North Vancouver 9-phase search: 2–4 hours (separate sprint)

---

## TIER 3 — QUALITY / POLISH

---

### Pattern 15: Truncated Descriptions (500-char Mid-Word Cutoff)

**Rule reference:** Rule 12 (learn from every error)

#### Scope
Not yet quantified. The 500-character limit in the scraper cuts descriptions mid-word or mid-sentence, producing unprofessional output.

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');

// Descriptions exactly at or near 500 chars (likely truncated)
const truncated = p.filter(x => x.description && x.description.length >= 495 && x.description.length <= 505);
console.log('Likely truncated descriptions (495-505 chars):', truncated.length);

// Descriptions that end mid-word (no period, no space at end)
const midWord = p.filter(x => {
  if (!x.description) return false;
  const d = x.description.trim();
  return d.length > 100 && !'.!?\"\''.includes(d[d.length - 1]) && !d.endsWith('...');
});
console.log('Descriptions not ending on sentence boundary:', midWord.length);
midWord.slice(0, 5).forEach(x => console.log(x.id, '...', x.description.slice(-50)));
"
```

#### Resolution — Existing Programs
For each truncated description, either:
1. Fetch the full description from the provider's live page and replace
2. Or truncate cleanly at a sentence boundary (add `"..."` if not complete)

For descriptions under 20 characters (12 found in analysis): these are level labels used as descriptions — flag for manual replacement.

#### Pipeline Prevention
In all scrapers: change the description truncation to cut at the last complete sentence before the limit, not mid-word. Add `"..."` if truncated.

```javascript
function cleanDescription(raw, maxLen = 500) {
  if (!raw || raw.length <= maxLen) return raw;
  const truncated = raw.substring(0, maxLen);
  const lastSentence = Math.max(truncated.lastIndexOf('. '), truncated.lastIndexOf('! '), truncated.lastIndexOf('? '));
  if (lastSentence > maxLen * 0.7) return truncated.substring(0, lastSentence + 1);
  return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
}
```

#### New Validation Rule
> **Rule 50: Descriptions Must Not Be Truncated Mid-Word**
> The validator flags descriptions ending in a non-sentence-final character (no `.`, `!`, `?`, `"`, `'`) that are longer than 100 characters. These are likely pipeline truncation artifacts.

#### Estimated Time
- Detection: 10 minutes
- Scraper fix: 20 minutes
- Manual fix of worst cases: 30 minutes

---

### Pattern 16: GENERAL as Catch-All Category

**Rule reference:** Rule 12 (apply learned fixes across all providers)

#### Scope
- **1,854 programs** tagged `category: "General"` — the single largest category
- Many of these are correctly categorized programs that fall through because the category mapper doesn't recognize their activity type
- Examples confirmed: badminton tagged GENERAL instead of SPORTS, swimming lessons tagged GENERAL instead of SPORTS

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');
const general = p.filter(x => x.category === 'General');
console.log('General category:', general.length);

// Find programs in GENERAL that have obvious activity keywords
const keywordMap = {
  'Sports': ['swim', 'soccer', 'hockey', 'tennis', 'basketball', 'volleyball', 'badminton', 'squash', 'gymnastics', 'skate', 'ski', 'rugby', 'lacrosse', 'cricket', 'baseball', 'softball', 'karate', 'judo', 'boxing', 'wrestling', 'cycling', 'dance'],
  'Arts': ['art', 'paint', 'draw', 'craft', 'pottery', 'ceramics', 'sculpture', 'weaving', 'knit'],
  'Music': ['music', 'piano', 'guitar', 'violin', 'cello', 'drum', 'choir', 'singing', 'band', 'orchestra'],
  'STEM': ['stem', 'science', 'coding', 'robotics', 'math', 'engineering', 'computer', 'tech', 'programming'],
  'Outdoor': ['outdoor', 'nature', 'hiking', 'camping', 'kayak', 'canoe', 'rock climb', 'forest'],
};

Object.entries(keywordMap).forEach(([cat, keywords]) => {
  const miscat = general.filter(x => keywords.some(k => (x.name || '').toLowerCase().includes(k)));
  console.log('GENERAL programs that look like', cat + ':', miscat.length);
  miscat.slice(0, 3).forEach(x => console.log('  ', x.id, x.name));
});
"
```

#### Resolution — Existing Programs
Use the keyword map above to re-categorize obvious cases. For programs with no clear keyword match, leave as GENERAL — it IS a valid catch-all, just overused.

Run a script that applies keyword-based category assignment for programs in GENERAL where a keyword match has high confidence.

#### Pipeline Prevention
In `scripts/fill-computable-fields.cjs`: improve the category assignment logic using the keyword map. Apply before falling through to GENERAL.

#### New Validation Rule
> **Rule 51: GENERAL Category Programs With Activity Keywords Must Be Reviewed**
> The validator warns when a program is tagged GENERAL but its name contains activity keywords strongly associated with another category. Suggest the better category and require human confirmation.

#### Estimated Time
- Detection + semi-automated fix script: 45 minutes
- Manual review of edge cases: 30 minutes

---

### Pattern 17: Special Characters / Quotes in Program Names

**Rule reference:** Rule 12

#### Scope
Not yet quantified. Smart quotes, em dashes, and special characters from copy-paste can cause display issues on some browsers and break string matching.

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');
const special = p.filter(x => x.name && /[\u2018\u2019\u201C\u201D\u2013\u2014\u00E2]/.test(x.name));
console.log('Names with smart quotes or special chars:', special.length);
special.slice(0, 10).forEach(x => console.log(x.id, x.name));
"
```

#### Resolution — Existing Programs
Normalize: `'` → `'`, `"` → `"`, `—` → `-`, `–` → `-`. Only normalize in the `name` field, not descriptions (descriptions can keep typographic characters).

#### Pipeline Prevention
Add a `normalizeText(str)` utility to all scrapers that replaces smart quotes and special characters before writing to `programs.json`.

#### Estimated Time
- Script: 15 minutes

---

### Pattern 18: Schedule Contradictions (Title vs. Times)

**Rule reference:** Rule 4 (times must match registration page)

#### Scope
- **Confirmed:** `ACT-0231` — "Sat. 11:00 am Toddler Class" but `startTime: "12:05 AM"` — name says 11 AM, field says midnight
- **Confirmed:** Issue 2 from 2026-03-30 — `campType: "Year-Round Program"` on programs with specific date ranges (2,881 programs)
- **Confirmed:** 65 programs with `dayLength: "Half Day"` but `durationPerDay >= 5 hours`

#### Detection
```bash
node -e "
const p = require('./src/data/programs.json');

// Time in name vs startTime field mismatch
const timeInName = p.filter(x => {
  const name = (x.name || '').toLowerCase();
  const match = name.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
  if (!match || !x.startTime) return false;
  // Compare hours
  let nameHour = parseInt(match[1]);
  const namePeriod = match[3].toLowerCase();
  if (namePeriod === 'pm' && nameHour < 12) nameHour += 12;
  if (namePeriod === 'am' && nameHour === 12) nameHour = 0;
  const fieldHour = parseInt((x.startTime || '').split(':')[0]);
  return Math.abs(nameHour - fieldHour) > 1; // Allow 1 hour tolerance
});
console.log('Schedule contradictions (name time vs startTime field):', timeInName.length);
timeInName.forEach(x => console.log(x.id, x.name, 'startTime:', x.startTime));

// Year-Round campType with specific dates
const yearRoundWithDates = p.filter(x =>
  x.campType === 'Year-Round Program' && x.startDate && x.endDate
);
console.log('Year-Round campType with specific dates:', yearRoundWithDates.length);

// dayLength Half Day but duration >= 5
const halfDayLong = p.filter(x => x.dayLength === 'Half Day' && x.durationPerDay >= 5);
console.log('Half Day dayLength but >= 5 hours duration:', halfDayLong.length);
"
```

#### Resolution — Existing Programs
- `ACT-0231` and similar: fix `startTime` to match the value in the program name (verify against provider page first)
- Year-Round with specific dates: remove `"Year-Round"` campType; replace with `"Class/Lesson"` or `"Camp"` based on schedule type
- Half Day >= 5 hours: reclassify to `"Full Day"`

These fixes are part of the larger schedule classification overhaul described in Issue 2 of SPOT-CHECK-FINDINGS-2026-03-30.md.

#### Pipeline Prevention
The threshold fix in `fill-computable-fields.cjs` (Issue 2 fix from spot-check): implement the corrected thresholds:
- Under 3 hours → `"Activity"` or `"Lesson"` (depending on program type)
- 3–5.9 hours → `"Half Day"`
- 6+ hours → `"Full Day"`

#### Estimated Time
- Manual fix of ACT-0231: 5 minutes
- fill-computable-fields.cjs threshold fix: 30 minutes
- Re-running on all programs: 15 minutes

---

### Pattern 19: Misc Data Quality Issues

#### 19a: ALL CAPS Descriptions

**Detection:**
```bash
node -e "
const p = require('./src/data/programs.json');
const allCaps = p.filter(x => x.description && x.description === x.description.toUpperCase() && x.description.length > 30);
console.log('All-caps descriptions:', allCaps.length);
"
```

**Fix:** Convert to title case or sentence case. Add to scraper pipeline normalization.

#### 19b: $1 Placeholder Prices

**Detection:**
```bash
node -e "
const p = require('./src/data/programs.json');
const oneDollar = p.filter(x => x.cost === 1);
console.log('Cost = $1 (likely placeholder):', oneDollar.length);
oneDollar.forEach(x => console.log(x.id, x.name, x.provider));
"
```

**Confirmed:** `wvfhc-1` (West Vancouver Field Hockey Club) at $1.00 is almost certainly a placeholder. Fix: set `cost: null`, `costNote: "Inquire for pricing"`, `priceVerified: false`.

**New validation rule:**
> **Rule 52: Cost = $1 Is a Likely Placeholder**
> The validator warns on `cost: 1` and requires manual confirmation that $1 is a real price. Most real $1 programs are community drop-ins; field hockey registration at $1 is clearly wrong.

#### 19c: Support Services as Programs

**Definition:** Services like "register-only" admin entries, program descriptions that are actually parent-information pages, or internal tracking entries — not actual programs parents can enroll their child in.

**Detection:**
```bash
node -e "
const p = require('./src/data/programs.json');
const serviceKeywords = ['registration only', 'admin', 'placeholder', 'test program', 'do not register', 'support service', 'subsidy', 'fee assistance'];
const services = p.filter(x => serviceKeywords.some(k => (x.name || '').toLowerCase().includes(k) || (x.description || '').toLowerCase().includes(k)));
console.log('Possible support service entries:', services.length);
services.forEach(x => console.log(x.id, x.name));
"
```

**Fix:** Remove confirmed support service entries (these are the only programs that can be deleted outright — they are not real enrollable programs).

#### Estimated Time (all 19a–19c combined)
- All CAPS fix: 15 minutes
- $1 placeholder fix: 10 minutes
- Support services audit: 20 minutes

---

## Provider-by-Provider Audit Checklist Template

Use this template when auditing a specific provider's programs. Copy to a new doc for each provider.

```markdown
## Provider Audit: [Provider Name]
**Date:** YYYY-MM-DD
**Auditor:**
**Programs in database:** N

### Step 1: Count & Coverage
- [ ] Confirmed all programs from provider website are in database
- [ ] No programs exist in database that aren't on provider website
- [ ] Provider name is canonical (matches Rule 46)

### Step 2: Field Completeness
- [ ] All programs have ageMin + ageMax (or documented as "all ages")
- [ ] All programs have registrationUrl pointing to specific program page
- [ ] All programs have address + neighbourhood (not generic city)
- [ ] All programs have cost (or null + costNote if unknown)
- [ ] All programs have startDate + endDate (or repeating field)

### Step 3: Status Accuracy
- [ ] enrollmentStatus matches what's shown on provider's live page
- [ ] No "Open" programs whose registration hasn't opened yet
- [ ] Expired programs marked "Completed"

### Step 4: Content Quality
- [ ] No internal codes in program names
- [ ] Descriptions are full (not truncated)
- [ ] No smart quotes or special characters in names
- [ ] Category is correct (not defaulted to GENERAL)

### Step 5: URL Verification
- [ ] Clicked every registrationUrl — reached the specific program within 1 click
- [ ] No broken URLs (404s)
- [ ] No generic homepage URLs
- [ ] No activekids.com or campscui.active.com URLs

### Issues Found:
[Document any issues here]

### Actions Taken:
[Document fixes applied here]
```

---

## Verification Checklist (How to Confirm Fixes Applied Correctly)

After running any fix sprint, verify:

```bash
# 1. No programs with ageMin >= 18
node -e "const p = require('./src/data/programs.json'); console.log('Adult programs remaining:', p.filter(x => x.ageMin >= 18).length);"

# 2. No "Cmty Centre" provider names
node -e "const p = require('./src/data/programs.json'); console.log('Cmty Centre remaining:', p.filter(x => x.provider && x.provider.includes('Cmty Centre')).length);"

# 3. No status/enrollmentStatus conflicts
node -e "const p = require('./src/data/programs.json'); console.log('Status conflicts:', p.filter(x => x.status === 'Open' && ['Coming Soon', 'Likely Coming Soon'].includes(x.enrollmentStatus)).length);"

# 4. No expired programs still showing as Open/Coming Soon
node -e "const today = '2026-03-31'; const p = require('./src/data/programs.json'); console.log('Expired non-Completed:', p.filter(x => x.endDate && x.endDate < today && x.enrollmentStatus !== 'Completed').length);"

# 5. No programs with cost = 1 (after $1 fix)
node -e "const p = require('./src/data/programs.json'); console.log('$1 programs:', p.filter(x => x.cost === 1).length);"

# 6. No banned URLs
node -e "const p = require('./src/data/programs.json'); console.log('Banned URLs:', p.filter(x => x.registrationUrl && (x.registrationUrl.includes('activekids.com') || x.registrationUrl.includes('campscui.active.com'))).length);"

# 7. Run the full validator
node scripts/validate-programs.cjs 2>&1 | tail -20
```

---

## Summary: All Patterns at a Glance

| # | Pattern | Scope | Tier | Auto-fixable? | Estimated Time |
|---|---------|-------|------|--------------|----------------|
| 1 | Wrong neighbourhoods | 730 programs | UX Breaker | Partial (needs mapping table) | 1–2 hrs |
| 2 | Burnaby Unknown facilities | 729 programs | UX Breaker | Partial (needs API update) | 1–2 hrs |
| 3 | Non-kids programs | Unknown | UX Breaker | Partial (ageMin >= 18 auto; keywords manual) | 1 hr |
| 4 | Internal codes in names | Unknown | UX Breaker | Yes (regex strip) | 45 min |
| 5 | Cost-per-hour broken | Unknown (likely 130+) | UX Breaker | No (needs per-program verification) | 2–4 hrs |
| 6 | URLs not 1-click to registration | 28 confirmed + unknown | UX Breaker | Partial (existing validate-urls.cjs) | 1 hr |
| 7 | 1,343 true duplicates | 1,343 programs | Data Integrity | Yes (after provider names fixed) | 45 min |
| 8 | 1,668 missing ageMax | 1,668 programs | Data Integrity | Partial (default 17 + flag) | 1–2 hrs |
| 9 | Provider name inconsistency | ~1,200+ programs | Data Integrity | Yes (alias table) | 45 min |
| 10 | Cross-provider contamination | 112+ programs | Data Integrity | No (manual audit) | 1–1.5 hrs |
| 11 | 449 expired programs | 449 programs | Data Integrity | Yes (status → Completed) | 30 min |
| 12 | Programs missing from UI | 0 actual removals | Data Integrity | No (UI check only) | 15–30 min |
| 13 | Status conflicts | 260 programs | Data Integrity | Yes (most restrictive wins) | 45 min |
| 14 | Incomplete provider coverage | Pedalheads + 2 missing | Data Integrity | No (new scraping work) | 2–4 hrs |
| 15 | Truncated descriptions | Unknown | Quality | Partial (sentence boundary) | 45 min |
| 16 | GENERAL miscategorization | Up to 1,854 | Quality | Partial (keyword map) | 1 hr |
| 17 | Special chars in names | Unknown | Quality | Yes (normalize function) | 15 min |
| 18 | Schedule contradictions | 2,881 + others | Quality | Partial (threshold fix easy; manual for times) | 45 min |
| 19 | ALL CAPS, $1, support services | Small | Quality | Partial | 45 min |

**Total estimated time (all tiers):** 14–24 hours across multiple sprints
**Recommended sprint 1** (Tier 1 must-fix): 6–10 hours
**Recommended sprint 2** (Tier 2 integrity): 6–10 hours
**Recommended sprint 3** (Tier 3 polish + new providers): 4–6 hours

---

## New Rules Summary for DATA-QUALITY-RULES.md

Add these rules to `DATA-QUALITY-RULES.md` after the existing Rule 38:

| Rule # | Name | Type |
|--------|------|------|
| 39 | Generic city neighbourhood not acceptable | Hard Rule |
| 40 | Provider name must not contain "Unknown" | Hard Rule |
| 41 | Programs with ageMin >= 18 must not appear | Hard Rule |
| 42 | Program names must not contain internal course codes | Hard Rule |
| 43 | Date spans > 21 days require repeating field or intensive classification | Hard Rule |
| 44 | Deduplication must check all substantive fields | Hard Rule (extends Rule 30) |
| 45 | ageMax null programs must display clearly (not silently hidden) | Warning Rule |
| 46 | Provider names must use canonical forms | Hard Rule |
| 47 | Provider name must match registration URL domain | Warning Rule |
| 48 | Programs past end date must be marked Completed | Hard Rule |
| 49 | status and enrollmentStatus must not contradict | Hard Rule |
| 50 | Descriptions must not be truncated mid-word | Warning Rule |
| 51 | GENERAL category programs with activity keywords must be reviewed | Warning Rule |
| 52 | cost = $1 is a likely placeholder | Warning Rule |

---

*This document was created 2026-03-31. It should be updated whenever a new data quality pattern is discovered or a fix is applied. The "Scope" numbers in the summary reflect the database as of 2026-03-31 (6,915 programs). Rerun detection scripts to get current counts.*
