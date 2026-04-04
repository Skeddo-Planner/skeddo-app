# Skeddo Program Data Quality Rules

These rules are MANDATORY for ALL program data entry — whether manual, automated, or performed by Claude agents. They apply to **both existing programs and newly added ones**. Every rule traces to a specific incident where rule-breaking caused real harm to parents.

**Claude and its agents MUST follow every rule below without exception.** When in doubt, choose the more conservative option (e.g., "Likely Coming Soon" over "Open", `null` cost over a guess, keep a listing rather than remove it).

Automated enforcement: `node scripts/validate-programs.cjs` enforces rules where possible. Run it after ANY data change. Rules that cannot be auto-fixed must still be followed — the validator will flag violations.

## Rule 1: Registration URLs Must Be Program-Specific (HARD RULE)
**Why:** Science AL!VE listed a generic homepage URL. A parent clicking it couldn't find the actual camp registration.
- URL MUST point to the specific program's registration page, not the provider's homepage
- If the provider uses Eventbrite, link to the specific Eventbrite event
- If the provider uses a booking system (PerfectMind, ActiveNet), link to the specific activity detail page
- Test: clicking the URL MUST land the user within 1 click of registering for THAT specific program
- Claude and its agents MUST NEVER set a URL to a generic homepage, search page, or category listing when a direct program URL is findable — see Rules 29 and 32
- This applies to ALL programs in the database — existing programs with generic URLs must be updated

## Rule 2: Dates Must Be Program-Specific, Not Season-Wide
**Why:** 130+ programs showed "Jul 6 - Aug 21" (the whole summer) instead of specific camp weeks.
- Weekly camps: set startDate/endDate to the FIRST available week, add `repeating: "weekly"` and `repeatEndDate`
- One-week camps: exact week dates only
- Multi-week intensives: actual start and end dates of that specific intensive
- Never use the provider's entire summer window as the date range

## Rule 3: Costs Must Match the Registration Page
**Why:** Science AL!VE costs were wrong. Woods & Waves showed weekly cost as total cost.
- Cost must be the price a parent pays for ONE session/week of THIS specific program
- If cost is per week, it's the weekly cost (not multiplied by number of weeks)
- If cost is for the full program, state the full cost
- Always note if cost is estimated vs confirmed (use `priceVerified: true/false`)
- Include early bird pricing with `earlyBirdCost` and `earlyBirdDeadline` when available

## Rule 4: Times Must Match the Registration Page
**Why:** Science AL!VE Surrey times were initially reported as wrong (though turned out correct — different locations had different times).
- Claude and its agents MUST always verify times against the actual registration page, not the provider homepage
- Different locations of the same provider may have different times — verify each location separately
- Note before-care and after-care availability and costs when offered

## Rule 5: Age Ranges Must Match Grade Requirements
**Why:** Science AL!VE camps are grade-based (entering Grade 1, entering Grade 3-5) but our data showed age ranges that didn't match.
- If provider specifies grades, convert to ages accurately (Grade 1 = age 6-7, etc.)
- Include grade info in the description
- ageMin/ageMax must reflect who can actually register

## Rule 6: Neighbourhood Must Exist in the Filter
**Why:** Programs in "Surrey City Centre" and "Burnaby Mountain" weren't findable because those neighbourhoods weren't in the filter dropdown.
- Claude and its agents MUST verify any new neighbourhood exists in CITY_NEIGHBOURHOODS in DiscoverTab.jsx before adding a program with that neighbourhood
- If the neighbourhood is missing from the filter, add it to the correct city group before adding the program
- NEVER use vague locations ("Vancouver, BC") — use actual neighbourhood names

## Rule 7: Every Field Must Be Verified, Not Estimated
**Why:** Multiple fields across hundreds of programs contained estimated data that turned out wrong.
- `confirmed2026: true` only if the 2026 data is from the provider's website
- `priceVerified: true` only if the price was confirmed on the registration page
- If using prior-year data as estimates, set `confirmed2026: false` and note it in description

## Rule 8: Enrollment Status Must Be Current and Accurate
**Why:** Pedalheads showed "Open" when registration hadn't opened yet.
- "Open" = registration is currently accepting applications RIGHT NOW
- "Coming Soon" = registration date is confirmed and within 30 days
- "Upcoming" = registration date is confirmed but more than 30 days away
- "Likely Coming Soon" = no confirmed 2026 date, estimated based on prior year
- Verify by checking the actual registration page, not just the provider homepage

## Rule 9: Before/After Care Must Be Noted
**Why:** Parents need to know if extended care is available for logistics planning.
- Check every camp provider for before-care and after-care options
- Record: availability, times, cost, and any conditions
- Use structured `beforeCare` and `afterCare` fields

## Rule 10: No Duplicate Programs
**Why:** Some programs appeared multiple times with slightly different data.
- Claude and its agents MUST check whether a program already exists (match by name + provider + location) before adding
- If the same program runs at multiple locations, create separate entries per location
- If the same program runs multiple weeks, either create per-week entries OR use the repeating field
- See Rule 30 for the complete definition of what constitutes a true duplicate

## Rule 11: Address Must Be a Real Street Address
**Why:** Many programs had vague addresses like "Vancouver, BC" instead of actual locations.
- Every program must have a real street address (e.g., "4575 Clancy Loranger Way, Vancouver, BC")
- If the provider operates at a community centre, use the community centre's address
- Online programs should have neighbourhood: "Online"

## Rule 12: Learn From Every Error
**Why:** The same types of errors kept appearing across different providers.
- When an error is found in one provider's data, Claude and its agents MUST check ALL providers for the same pattern
- When a new error type is discovered, add a rule to this document
- These rules MUST be consulted and applied before any batch data import, not just once at the start

## Rule 13: Cross-Platform Consistency
**Why:** Changes must work on all devices and browsers.
- All code changes must work on web, Android, iOS
- All browsers: Chrome, Safari, Firefox, Edge
- Test mobile-first, verify desktop

## Rule 16: Changes Apply to Both Platforms by Default
**Why:** Changes were frequently applied to only mobile or only desktop, requiring follow-up fixes.
- When a change is requested WITHOUT specifying a platform, apply to BOTH mobile and desktop
- Only scope to one platform if explicitly told: "for the phone version" or "for the desktop version"
- Before committing any UI change, verify it renders correctly at both 375px (mobile) and 1400px (desktop)
- Use `useIsDesktop` hook or CSS media queries where layouts differ between platforms

## Rule 14: Prior-Year Data = "Likely Coming Soon" (HARD RULE)
**Why:** Programs showing "Open for Registration" with 2025 pricing misleads parents into thinking they have current info.
- If ANY field (cost, dates, times, ages) uses data from a previous year (2025 or earlier):
  - `enrollmentStatus` MUST be "Likely Coming Soon"
  - `confirmed2026` MUST be `false`
  - `priceVerified` MUST be `false`
  - `description` MUST contain the phrase "Based on prior year" (e.g., "Based on prior year — check provider for 2026 details")
- A program CANNOT show "Open" or "Coming Soon" if we're using estimated data
- This applies to ALL existing programs — Claude and its agents MUST audit and correct any non-compliant programs
- The validator checks `confirmed2026=false` programs for correct status AND for the required "Based on prior year" text in description
- This is NON-NEGOTIABLE

## Rule 15: No False "Free" Listings (HARD RULE)
**Why:** 847 programs were showing as "$0 / Free" because the cost field was null/empty. Parents filtered by "Free" and got misleading results.
- `cost: 0` is ONLY for programs confirmed free on the provider's website
- If cost is unknown: set `cost: null` and add `costNote: "Inquire for pricing"`
- If cost is estimated from prior year: set the estimated cost with `priceVerified: false`
- A program must NEVER display as "Free" unless it is genuinely free
- When displaying costs in the UI: null cost should show "Inquire for pricing", NOT "$0" or "Free"

## Rule 17: Every New Rule Must Be Documented AND Automated (META-RULE)
**Why:** Rules documented in memory alone were not enforced during batch imports. 847 false "Free" listings resulted.
- Every new rule MUST be saved to: (1) memory file, (2) this document, (3) validate-programs.cjs or code
- NEVER rely on Claude "remembering" to apply a rule — if Claude must remember it, it will eventually forget it
- If a rule can't be fully automated, a WARNING check MUST be added to the validation script so violations are visible
- Every new rule MUST explicitly state whether it applies to new programs only or also to existing programs (default: both)

## Rule 18: UI Changes Apply to Both Platforms by Default
**Why:** Changes were frequently applied to only mobile or only desktop.
- No platform specified → change applies to BOTH mobile (< 1024px) and desktop (≥ 1024px)
- "For the phone version" → mobile only
- "For the desktop version" → desktop only
- Verify at both 375px and 1400px before committing

## Rule 19: GitHub Is Source of Truth for Multi-Computer Work
**Why:** Two founders work from different computers. Local files can go stale.
- Always `git pull` before starting a session
- Always commit and push after changes
- Critical rules live in this file and `docs/PROGRAM-SEARCH-METHODOLOGY.md` (in git, not just memory)
- Google Drive "My Drive" is for input documents (specs, briefs, CSVs) only
- Never work on stale local files

## Rule 20: "Coming Soon" Requires a Confirmed Registration Date (HARD RULE)
**Why:** Listings showed "Coming Soon" with no registration date, giving parents false hope with no actionable info.
- `enrollmentStatus: "Coming Soon"` MUST include a `registrationDate` field with the confirmed date
- The registration date must be within 30 days of today
- If registration date is confirmed but >30 days away, use `enrollmentStatus: "Upcoming"`
- If registration date is NOT confirmed, use `enrollmentStatus: "Likely Coming Soon"`
- The listing MUST display the registration date (e.g., "Registration opens April 8 at 7 PM")
- Programs with "Coming Soon" but no registrationDate must be changed to "Likely Coming Soon"

## Rule 21: Every URL Must Be Verified Against the Actual Page (HARD RULE)
**Why:** A Petit Architect listing linked to a "Greenhorn Community Music Project" page — a completely wrong program.
- Before adding ANY program, the registration URL MUST be visited and the page content verified
- The program name, provider, dates, and cost on the linked page must match our listing
- ActiveNet activity IDs must be verified — never guess or increment IDs
- If a URL cannot be verified (JS-rendered page), note it as unverified and prioritize manual checking
- This check must happen for EVERY program, not just a sample

## Rule 22: NEVER Guess or Estimate Program Data (HARD RULE)
**Why:** Guessed ActiveNet IDs linked to wrong programs. Estimated prices, dates, and ages turned out wrong repeatedly.
- ALL data must come from the actual provider website or registration page
- NEVER construct, guess, or increment ActiveNet/PerfectMind activity IDs
- NEVER estimate prices from "typical" ranges or "comparable" providers
- NEVER assume dates, times, or age ranges from patterns
- NEVER assume enrollment status — verify on the actual page
- When data genuinely isn't available:
  - Set the field to `null` (not 0, not a guess)
  - Add a note explaining what's missing (e.g., `costNote: "Not published"`)
  - Mark `confirmed2026: false`, `priceVerified: false`
  - Use `enrollmentStatus: "Likely Coming Soon"`
- If prior-year data is used as a reference, it MUST be labeled: "Based on [year] — check provider for current info"
- This rule has NO exceptions

## Rule 23: Every Program Must Be Verified on the Provider's Live Page Before Adding (HARD RULE)
**Why:** Collage Collage had a "Kids Art Class" listing that didn't exist — it was fabricated based on assumptions. The provider's actual page showed completely different programs (Mini MAKE and Spring Break Camp).
- Before adding ANY program, visit the provider's actual registration/booking page
- Verify EVERY field against what's on the page: name, cost, dates, times, ages, registration status
- If the provider's page shows different programs than what you expected, use THEIR programs — not your assumptions
- If the provider's page is down, unreachable, or has no programs listed, do NOT add guessed programs
- This applies to initial adds AND to every data refresh
- Cross-check: after adding programs for any provider, revisit the registration page and confirm each listing matches
- This rule has NO exceptions — a fabricated listing is worse than a missing listing

## Rule 25: isEstimate and priceVerified Are Mutually Exclusive (HARD RULE)
**Why:** Programs had both `isEstimate: true` and `priceVerified: true`, creating contradictory data — a price can't be both estimated and verified.
- `isEstimate: true` means the data is from a prior year and unverified
- `priceVerified: true` means the current-year price was confirmed on the provider's site
- If both are set, the validator auto-fixes by setting `priceVerified: false`
- When current-year data replaces an estimate: set `isEstimate: false` (or remove it) and `priceVerified: true`

## Rule 26: Estimated Data Must Explain Its Source
**Why:** Parents need to know WHY a price is approximate so they can plan accordingly.
- Any program with `isEstimate: true` MUST have a `costNote` explaining the source (e.g., "Estimated from 2025 pricing")
- The validator auto-adds "Estimated from prior year pricing" if missing
- Never present estimated data without context

## Rule 27: dayLength "Lesson" for Short-Duration Classes (HARD RULE)
**Why:** 30-minute violin lessons were tagged "Half Day" — misleading for parents filtering by program length.
- Programs with `durationPerDay` ≤ 2 hours AND lesson-type names (lesson, class, private, instruction, tutorial, coaching, clinic) MUST have `dayLength: "Lesson"`
- The validator auto-fixes matching programs from other dayLength values to "Lesson"
- "Lesson" is distinct from "Half Day" (2-4 hours) — lessons are shorter, structured instruction

## Rule 28: "Open" Status Requires Verified Source (HARD RULE)
**Why:** 313 programs were bulk-defaulted to "Open" when providers hadn't confirmed 2026 offerings. Parents saw "Open for Registration" and clicked through to find nothing available.
- `enrollmentStatus: "Open"` requires EITHER `confirmed2026: true` OR an ActiveNet ID (verified via API)
- Programs with `confirmed2026: false` and no ActiveNet verification CANNOT be "Open"
- The validator auto-fixes these to "Likely Coming Soon"
- Never bulk-default unknown status to "Open"

## Rule 30: Deduplication Must Preserve Unique Listings (HARD RULE)
**Why:** 822 programs were incorrectly removed as "duplicates" based only on matching name+provider+startDate. In reality, these were different time slots, age groups, or pricing tiers — e.g., Ballet for ages 6-9 at 2:00 PM and Ballet for ages 8-14 at 3:00 PM. Parents need to see all options.
- Two programs are only TRUE duplicates if ALL substantive fields match: id, registrationUrl, ageMin, ageMax, address, neighbourhood, startTime, endTime, cost, days, category, enrollmentStatus, dayLength, durationPerDay, scheduleType
- Different registrationUrls (e.g., different ActiveNet activity IDs like COV-615925 vs COV-615927) mean different bookable slots — these are NEVER duplicates
- Programs with the same name/provider/startDate but different ages, times, costs, locations, or days are DISTINCT listings and MUST be kept
- The validator checks all substantive fields before flagging a duplicate
- Only true duplicates (every field identical) are auto-removed with `--fix`
- This rule has NO exceptions — never remove a listing without verifying all fields match an existing one

## Rule 29: Registration URLs Must Not Be Generic Homepages or Category Pages (HARD RULE)
**Why:** Scottish Cultural Centre had all 12 programs linking to the generic homepage. Parents couldn't find the actual registration page.
- URLs that resolve to just a domain root (no path), `/home`, or `/index.html` are NEVER acceptable — the validator flags these as errors
- URLs ending in `/programs`, `/programs/`, `/camps`, `/camps/`, `/classes`, `/classes/`, `/register`, `/registration` (without a specific program ID or slug) are also too generic — the validator warns on these
- Claude and its agents MUST investigate to find the specific program page before settling for a generic URL
- Only use a generic URL as a last resort (after thorough investigation), and ALWAYS add `urlNote: "Search provider site for this program"` when doing so
- The validator flags these — manual fix required

## Rule 33: scheduleType "Full Day" Must Have durationPerDay >= 4 Hours (HARD RULE)
**Why:** 278 programs were tagged "Full Day" but had durations under 4 hours — including 1-hour after-school classes (Young Rembrandts, Professor Puffin's), 1.5-hour paddling lessons (False Creek Sprint Canoe), and 3-hour half-day sessions (Access2Innovate AM/PM). Parents filtering by "Full Day" expected 6-8 hour camps and instead saw 1-hour lessons.
- If `durationPerDay` < 2 hours: `scheduleType` must be "Lesson" or "Class", `dayLength` must be "Lesson"
- If `durationPerDay` >= 2 and < 4 hours: `scheduleType` must be "Half Day", "Half Day (AM)", or "Half Day (PM)", `dayLength` must be "Half Day"
- If `durationPerDay` >= 4 hours: "Full Day" is valid only for actual day camps
- Before/after care add-ons (e.g., Access2Innovate 8-9 AM care): use "Before Care" or "After Care" scheduleType
- The validator flags any "Full Day" program with < 4 hours and auto-fixes with `--fix`
- This rule has NO exceptions

## Rule 34: ageMin <= 2 Must Match Infant/Toddler Program Names (WARNING RULE)
**Why:** 22 Access2Innovate programs had ageMin=1, ageMax=2 — but these were grade-based programs (Grade 1-2 = ages 6-7). Parents filtering for toddler programs got results for school-age kids.
- Programs with ageMin <= 2 must have names suggesting infant/toddler content (baby, infant, tot, toddler, parent and, preschool, playtime, etc.)
- If a program name doesn't contain infant/toddler keywords but has ageMin <= 2, the validator flags it for manual review
- Common cause: grade numbers being stored as ages (Grade 1-2 stored as ageMin=1, ageMax=2)
- Grade-to-age mapping: K=5, Grade 1-2=6-7, Grade 3-4=8-9, Grade 5-6=10-11, Grade 7-8=12-13
- This is a WARNING rule (not auto-fixed) — manual verification required

## Rule 35: Broken URLs Must Fall Back to Provider Search Page (HARD RULE)
**Why:** When a program's specific URL breaks (404, redirect to homepage, expired event), parents clicking it land on an error page or homepage with no way to find the program. A search page is always better than a broken link.
- When a registrationUrl returns 404, 410, or redirects to a homepage: update it to the provider's registration search page
- Add `urlNote: "Search provider site for this program"` so parents know to look for the specific program
- Known search page patterns:
  - ActiveNet: `https://anc.ca.apm.activecommunities.com/{city}/activity/search`
  - PerfectMind: root of the webreg.perfectmind.com subdomain
  - CampBrain: root of the `.campbrainregistration.com` subdomain
  - Private providers: root domain (e.g., `https://www.sciencealive.ca`)
- Run `node scripts/validate-urls.cjs --fix` to apply this rule across all programs
- NEVER leave a 404 URL in programs.json — always apply a fallback

## Rule 36: Unverifiable Pricing Must Show Graceful Fallback, Not Wrong Data (HARD RULE)
**Why:** Showing a price that doesn't match the provider's actual current price is worse than showing no price. Parents plan budgets based on what Skeddo shows — a wrong price causes real harm.
- If a price can't be verified against the live registration page: set `cost: null`, `costNote: "Inquire with provider"`, `priceVerified: false`
- If the page shows a clearly different price AND there is only one price on the page: update `cost` to the page price
- If the page shows multiple prices (tiered, early bird, multiple sessions): set `cost: null`, `costNote: "Inquire with provider"`
- This rule applies to ALL programs, not just new ones — run `node scripts/verify-programs.cjs --audit --fix`
- A program showing "Inquire with provider" is not a failure — it is honest data

## Rule 37: Enrollment Status Must Degrade Gracefully When Unverifiable (HARD RULE)
**Why:** Showing "Open" for a program that is full, closed, or hasn't opened registration yet erodes parent trust. "Likely Coming Soon" is the safe default — it doesn't mislead.
- If enrollment status cannot be verified from the live registration page:
  - Default to `enrollmentStatus: "Likely Coming Soon"` (not "Open", not "Coming Soon")
  - This is consistent with Rule 14 (prior-year data) and Rule 28 (verified source required for "Open")
- Acceptable page signals that justify updating status:
  - "Register Now" / "Enroll Now" / "Add to Cart" → Open
  - "Sold Out" / "Class is Full" / "No Spots Available" → Full
  - "Waitlist" → Full/Waitlist
  - "Registration Opens [date]" → Coming Soon (if date within 30 days) or Upcoming
  - "Registration Closed" → Closed
  - "Coming Soon" / "Not Yet Open" → Likely Coming Soon
- Run `node scripts/verify-programs.cjs --incremental --fix` to apply status corrections

## Rule 38: URL Verification Must Run on All Programs Regularly (PROCESS RULE)
**Why:** Provider websites change constantly — events expire, registration systems migrate, URLs restructure. Without regular checks, broken links accumulate silently.
- `validate-urls.cjs` runs in the daily GitHub Actions pipeline (after each refresh cycle)
- `verify-programs.cjs --incremental` checks unverified or stale programs (>7 days old)
- `verify-programs.cjs --audit` MUST be run after any large batch import (>50 programs)
- State is tracked in `scripts/verify-state.json` — NEVER delete this file
- The verify-report-YYYY-MM-DD.json files document what was checked and what was fixed
- Claude and its agents MUST run `node scripts/validate-programs.cjs` after every data change before committing

## Rule 39: Ages vs Grades — Always Convert Grades to Ages (HARD RULE)
**Why:** Collingwood and other school-based providers label programs by grade (e.g., "Grade 3–5", "(3-5)", "G3-4"). When grade numbers are stored directly as `ageMin`/`ageMax`, filters break — a "Grade 3–5" program stored as ageMin:3 appears alongside toddler programs instead of age 8–10 programs.
- All program listings MUST use ages (not grades) in `ageMin`, `ageMax`, and any filter-facing fields
- Grade references are ONLY permitted in the `name`/`description` fields as supplementary context
- When a provider lists programs by grade, convert to ages using this mapping:
  - Kindergarten (K): age 5 | Grade 1: age 6 | Grade 2: age 7 | Grade 3: age 8
  - Grade 4: age 9 | Grade 5: age 10 | Grade 6: age 11 | Grade 7: age 12
  - Grade 8: age 13 | Grade 9: age 14 | Grade 10: age 15 | Grade 11: age 16 | Grade 12: age 17
- Examples: "Grades 3–5" → ageMin: 8, ageMax: 10 | "Grade 6–8" → ageMin: 11, ageMax: 13
- The validator flags any program from a known grade-based provider where the `ageMin` equals the grade number directly (e.g., ageMin: 3 for a "Grade 3" program instead of age 8)
- This rule applies to ALL providers — Collingwood, Mulgrave, school districts, and any others that use grade-based labelling

## When Adding Programs to New Cities
Reference docs/PROGRAM-SEARCH-METHODOLOGY.md for the systematic 9-phase search approach. Claude and its agents MUST apply ALL rules above to every program in the new city. No shortcuts. Run `node scripts/validate-programs.cjs` after completing any batch import and fix ALL violations before committing.

## Rule 39: NEVER import from activekids.com (was duplicate Rule 16 — now Rule 39)
activekids.com is NOT a primary data source. It is a third-party directory with incomplete, outdated, and sometimes inaccurate program listings. Claude and its agents MUST NEVER use activekids.com as a source for new programs, pricing, dates, or any other data. Always go directly to the provider's own website or the official registration system (ActiveNet, PerfectMind, Eventbrite, etc.) for program data.

See also Rule 24 (ban on activekids.com URLs) which extends this rule to URL-level enforcement in the validator.

This rule is PERMANENT and NON-NEGOTIABLE.

## Rule 24: NEVER use activekids.com URLs (HARD RULE)
**Why:** activekids.com is a direct competitor to Skeddo — linking parents there actively harms the business. 459 programs were found with activekids.com URLs instead of direct provider registration pages.
- Registration URLs must NEVER contain `activekids.com`
- URLs must point directly to the provider's own website or their official registration portal (ActiveNet, PerfectMind, Eventbrite, campscui.active.com, etc.)
- This extends Rule 16 (never import from activekids.com) to explicitly ban this domain in URLs
- The validator auto-flags any URL containing this domain as a hard error
- This rule has NO exceptions
- **Note:** `campscui.active.com` and `activecommunities.com` are legitimate registration management platforms (ActiveNetwork software used by providers and municipalities). URLs on these domains are allowed and encouraged — they are specific registration links, not competitor sites.

## Rule 40: Always Scrape Official Registration APIs Directly (was duplicate Rule 17 — now Rule 40)
For any municipality or large provider with a registration portal, Claude and its agents MUST find and use their REST API to get the complete program catalog. NEVER rely on:
- Third-party directories (activekids.com — BANNED per Rule 16)
- CSV imports (partial, outdated)
- Manual web scraping (misses programs)
- Keyword-based searches (only finds subset)

Known municipal APIs:
- City of Vancouver: POST https://anc.ca.apm.activecommunities.com/vancouver/rest/activities/list?locale=en-US
- City of Burnaby: POST https://anc.ca.apm.activecommunities.com/burnaby/rest/activities/list?locale=en-US
- (Other cities: research their portals — many use PerfectMind, Xplor, or custom systems)

Payload format: {"activity_select_param":2,"page_info":{"page_number":N,"total_records_per_page":20,"order_by":"Name","order_option":"ASC"}}

Filter kids programs client-side: age_max_year <= 17 AND age_min_year < 18

Reusable scraper: scripts/scrape-cov-activenet.cjs (modify HOST and CITY variables for other ActiveNet cities)

## Rule 41: Include ALL Program Types (was duplicate Rule 18 — now Rule 41)
Skeddo is not just for summer camps. Claude and its agents MUST include EVERY program a parent might use:
- Day camps and summer camps
- Swimming lessons and aquatics
- Dance classes (ballet, hip hop, jazz, contemporary)
- Sports classes (tennis, soccer, basketball, hockey, skating)
- Arts (pottery, painting, drawing, ceramics)
- Music lessons (piano, guitar, drums, choir)
- STEM/coding programs
- Fitness and yoga
- Martial arts
- Theatre and performing arts
- Language classes
- Single-session classes and multi-week programs

If the program has an age range that includes children (0-17), it belongs in Skeddo. Parents use Skeddo to plan, schedule, budget, and coordinate — ALL activities benefit from these tools.

This rule exists because the March 2026 CoV import only captured 149 of 2,700 kids programs (5.5%) by focusing narrowly on "summer camp" keyword searches.

## Rule 31: NEVER Delete Programs Except for the 5 Allowed Criteria (HARD RULE — NO EXCEPTIONS)
**Why:** Over 100 programs were incorrectly removed across the project's history — real kids programs from real providers (SportBall, Burnaby Winter Club, Paintlounge, Camp Qwanoes, etc.) were lost because removal criteria were too aggressive or not carefully verified. Claude agents have deleted completed and filled programs that should have been kept with updated statuses.

**Claude and its agents MUST NEVER delete a program entry from programs.json except for one of these 5 criteria:**

1. **Adult-only:** ageMin >= 18 with no children/teens in the age range
2. **Outside service area:** program is not in the Lower Mainland / BC (e.g., Ontario-only, US-only)
3. **Permanently cancelled BEFORE registration ever opened:** the specific offering was cancelled/delisted before any registration occurred — NOT programs that ran successfully and completed, NOT programs temporarily between seasons
4. **Fabricated / never existed:** the listing was invented and never appeared on the provider's website
5. **True duplicate:** an exact copy with ALL substantive fields matching (per Rule 30)

**Programs that completed their run are NEVER deleted — set `enrollmentStatus: "Completed"` and keep the listing.** Completed programs provide useful historical context and may recur next season.

**A program MUST NEVER be deleted for any of these reasons:**
- Registration is full or has a waitlist — update status to "Full" or "Full/Waitlist", KEEP the listing
- Registration hasn't opened yet — set `enrollmentStatus: "Likely Coming Soon"`, KEEP the listing
- Registration period has ended / program ran and finished — set `enrollmentStatus: "Completed"`, KEEP the listing
- Price is unknown — set `cost: null` with `costNote: "Inquire for pricing"`, KEEP the listing
- URL is broken — apply Rule 35 fallback (search page URL + urlNote), KEEP the listing
- Data is from a prior year — set `confirmed2026: false` and `isEstimate: true`, KEEP the listing
- Provider hasn't confirmed 2026 offerings — set `enrollmentStatus: "Likely Coming Soon"`, KEEP the listing

**When in doubt: KEEP the listing.** A visible listing with estimated or partial data is always better than a missing listing.

**Before deleting any program, Claude MUST:**
1. Verify it meets one of the 5 criteria above
2. Run `git diff --stat` after deletion to confirm the count of removed programs is intentional
3. If deleting more than 5 programs at once, stop and get explicit approval from Tom first

The validator enforces what it can: adult-only checks (Rule 23), true duplicate checks (Rule 10b). Deletion prevention beyond that requires human oversight and this rule.

## Rule 32: Registration URL Must Lead to Enrollment for THAT Specific Program (HARD RULE — NO EXCEPTIONS)
**Why:** VSO School of Music "Arts Explorers" linked to a generic "camps" page. Parents had to click "Enroll Now", then navigate 8 sub-categories to find the right camp week. Multiple other providers had similar issues — generic program pages instead of direct enrollment links.
- The registrationUrl MUST lead to a page where the user can enroll in THAT SPECIFIC program within 1 click
- For ActiveNet providers: MUST use the activity detail URL (`/activity/search/detail/{ID}`) — NEVER the generic search page
- For providers with sub-activities (e.g., weekly camps under a parent activity): link to the parent activity detail page (sub-activities are shown on that page)
- A URL leading to a search results page, category listing, or generic "programs" page is NEVER acceptable — even if the program appears somewhere on that page
- This extends Rule 1 (program-specific URLs) and Rule 29 (no generic homepages) to also cover intermediate pages requiring additional navigation
- **Claude and its agents MUST NEVER set a URL to a generic page when a specific program URL is findable.** If after thorough investigation no specific URL exists, use the closest available URL and set `urlNote` explaining the limitation.
- The validator flags these patterns as errors:
  - ActiveNet search pages without a detail ID (`/activity/search` without `/detail/`)
  - Provider pages ending in `/programs`, `/programs/`, `/camps`, `/camps/`, `/classes`, `/classes/` without a specific program ID or slug
- This rule has NO exceptions

---

## Rule 42: Navigate Like a Parent — Read Every Page Level (AUDIT PROCESS RULE)
**Why:** Tom's April 1 spot-check found every audited provider had programs below the fold, behind dropdowns, or inside location tabs that agents missed entirely because they only read the landing page.
- Do NOT just read the provider's top-level landing page or homepage
- You MUST expand every dropdown, location selector, age group selector, and category filter on the registration page
- You MUST scroll through the full program listing — many programs are below the fold
- You MUST click into individual program detail pages to get complete field data (times, prices, age ranges)
- For multi-location providers: MUST check EVERY location tab or location-specific URL, not just the first
- Skipping any of these steps makes your audit incomplete — treat it like a parent who needs to find the right camp for their child

## Rule 43: One Database Listing Per Unique Program Variant (HARD RULE)
**Why:** Agents repeatedly collapsed distinct programs (different skill levels, age groups, themes, or time slots) into a single overly-broad listing. This causes programs to not appear in age-filtered searches and misrepresents what the provider offers.
- If a provider offers Level 1, Level 2, Level 3 of a camp → create THREE separate listings
- If a provider breaks a camp into age bands (5-6, 7-8, 9-10, 11-12) → create FOUR separate listings, one per band
- If a provider offers "Minecraft Camp" and "Roblox Camp" → TWO separate listings
- If a provider offers AM half-day and PM half-day → TWO separate listings
- If a provider offers a 2-week combo bundle distinct from individual weeks → separate listing for the bundle
- Extends Rule 30 (deduplication must preserve unique listings): this rule is its mirror image — do not over-merge
- A listing with ageMin=5 and ageMax=12 when the provider sells distinct 5-6, 7-9, 10-12 bands is a violation

## Rule 44: All Locations Required for Multi-Location Providers (AUDIT PROCESS RULE)
**Why:** Agents repeatedly missed entire locations (e.g., a Code Ninjas or Pedalheads location in Burnaby) because they audited only the first location returned or only the provider's default city.
- For any provider with multiple Metro Vancouver locations, EVERY location must be checked and every location's programs must be in the database
- Use location dropdowns, "Change Location" buttons, or location-specific sub-pages to enumerate all locations
- After completing a multi-location audit, list the locations you checked and confirm none were skipped
- Missing an entire location is treated as a missed-programs violation (see Rule 49)

## Rule 45: Use Anchor URLs When Registration Section Is Below Fold (HARD RULE)
**Why:** Agents used top-level page URLs when the actual registration section or program list was further down the page, behind a #register or #programs anchor. Parents who click a bare URL land at the top of the page with no obvious path to registration.
- If the registration or program listing section is not visible on page load (i.e., the parent must scroll), use the anchor URL: `provider.com/camps/#register` or `provider.com/camps/#programs`
- Acceptable anchors: `#register`, `#programs`, `#book`, `#signup`, `#enroll`, `#schedule`, `#sessions`
- If the provider uses JavaScript tab switching rather than anchors, use the deepest linkable URL available and set `urlNote` explaining this
- Extends Rule 32 (registration URL must lead to enrollment within 1 click)

## Rule 46: Use Provider's Exact Age Breakdowns as ageMin/ageMax (HARD RULE)
**Why:** Agents combined provider age bands (5-6, 7-8, 9-10, 11-12) into a single generic range (5-12). Parents filter by their child's specific age — a child aged 7 won't see a program listed as 5-12 if the system normalizes away the 7-8 band.
- If the provider's registration page shows age bands, each band becomes its own listing with the exact ageMin/ageMax from the provider
- Do NOT combine: ageMin=5, ageMax=12 when the provider sells 5-6, 7-8, 9-10, and 11-12 separately
- If the provider lists a single unbroken age range (e.g., "ages 6-14"), use that range as-is
- This rule pairs with Rule 43 (one listing per variant) — different age bands = different listings

## Rule 47: Completed Programs Must Stay in the Database with "Completed" Status (HARD RULE)
**Why:** Agents deleted completed programs (Spring Break camps, finished sessions) instead of keeping them with the correct status. Completed programs give parents historical context and often recur the following year.
- If a program ran in the past (e.g., Spring Break 2026) but is still listed on the provider's website, keep it with `enrollmentStatus: "Completed"`
- Do NOT delete a program just because it has passed — set status to "Completed" and keep the listing
- This reinforces Rule 31 (never delete except for the 5 allowed criteria): "program completed its run" is explicitly NOT a deletion criterion
- A completed program with full field data is always more valuable than a missing listing

## Rule 48: Data Visible on the Registration Page Is Never an Estimate (HARD RULE)
**Why:** Agents marked prices, dates, and times as `isEstimate: true` even when that data was clearly shown on the provider's live registration page. This incorrectly flags confirmed data as uncertain and misleads parents.
- If a price, date, time, or age range is visible and readable on the provider's live registration page → it is CONFIRMED data
- `isEstimate: true` is ONLY for data carried forward from a prior year when the current year's page has not yet published the information
- `priceVerified: true` and `isEstimate: true` are mutually exclusive (Rule 25 already enforces this)
- When in doubt: if you can see it on the page, it is not an estimate

## Rule 49: Count-and-Compare Completeness After Every Provider Audit (AUDIT PROCESS RULE)
**Why:** Every provider Tom spot-checked had missing programs — agents stopped after finding the obvious listings without verifying they had captured everything.
- After auditing any provider, count the total unique program offerings visible on their registration page
- Compare that count to the number of listings in programs.json for that provider
- If your count is lower than what the provider shows, programs are missing — find and add them before finishing
- Document in your session log or commit message: "Provider shows X programs, we have Y" — if X > Y, explain why
- This is a completeness gate: an audit is not done until counts match (or discrepancies are explained)

## Rule 50: Provider API Data Must Be Validated Against Registration Pages Before Use (HARD RULE)
**Why:** The Pedalheads API (api.pedalheads.com) returned wrong prices, incorrect age ranges, and broken URLs — data that differed materially from what parents see on the actual registration page. Using unvalidated API data caused systemic errors across an entire provider's listings.
- NEVER use a provider API as the primary data source without first validating it against the actual registration page
- **Validation protocol:** For the first 10-15 listings from any provider API, compare EVERY field (price, age range, program name, URL, enrollment status) against the live registration page
  - If ALL 10-15 match with ZERO differences → API is "validated" for this provider. May use API for remaining listings with 5% ongoing spot-checks.
  - If ANY discrepancy is found → API is "invalidated." Use browser navigation only. Do not use the API until the discrepancy is understood and resolved.
- In the verification log, mark each listing as "API-verified (validated against samples 1-15)" or "browser-verified (direct registration page check)"
- **Currently invalidated APIs:**
  - Pedalheads (api.pedalheads.com) — wrong prices, wrong ages, broken URLs. Must use browser only.
- This rule pairs with Rule 23 (every program must be verified on the provider's live page) — API data does not count as verification
