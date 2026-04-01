# Skeddo Program Data Quality Rules

These rules are MANDATORY for all program data entry, whether manual or automated. They exist because real users found real errors that damaged trust. Every rule traces to a specific incident.

## Rule 1: Registration URLs Must Be Program-Specific
**Why:** Science AL!VE listed a generic homepage URL. A parent clicking it couldn't find the actual camp registration.
- URL must point to the specific program's registration page, not the provider's homepage
- If the provider uses Eventbrite, link to the specific Eventbrite event
- If the provider uses a booking system (PerfectMind, ActiveNet), link to the specific activity detail page
- Test: clicking the URL should land the user within 1 click of registering for THAT specific program

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
- Always verify times against the actual registration page, not the provider homepage
- Different locations of the same provider may have different times
- Note before-care and after-care availability and costs when offered

## Rule 5: Age Ranges Must Match Grade Requirements
**Why:** Science AL!VE camps are grade-based (entering Grade 1, entering Grade 3-5) but our data showed age ranges that didn't match.
- If provider specifies grades, convert to ages accurately (Grade 1 = age 6-7, etc.)
- Include grade info in the description
- ageMin/ageMax must reflect who can actually register

## Rule 6: Neighbourhood Must Exist in the Filter
**Why:** Programs in "Surrey City Centre" and "Burnaby Mountain" weren't findable because those neighbourhoods weren't in the filter dropdown.
- Before adding a program with a new neighbourhood, verify it exists in CITY_NEIGHBOURHOODS in DiscoverTab.jsx
- If not, add it to the correct city group
- Never use vague locations ("Vancouver, BC") — use actual neighbourhood names

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
- Before adding a program, check if it already exists (match by name + provider)
- If the same program runs at multiple locations, create separate entries per location
- If the same program runs multiple weeks, either create per-week entries OR use the repeating field

## Rule 11: Address Must Be a Real Street Address
**Why:** Many programs had vague addresses like "Vancouver, BC" instead of actual locations.
- Every program must have a real street address (e.g., "4575 Clancy Loranger Way, Vancouver, BC")
- If the provider operates at a community centre, use the community centre's address
- Online programs should have neighbourhood: "Online"

## Rule 12: Learn From Every Error
**Why:** The same types of errors kept appearing across different providers.
- When an error is found in one provider's data, check ALL providers for the same pattern
- When a new error type is discovered, add a rule to this document
- These rules must be consulted before any batch data import

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
  - Description MUST note "Based on prior year — check provider for 2026 details"
- A program CANNOT show "Open" or "Coming Soon" if we're using estimated data
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
- Every new rule must be saved to: (1) memory file, (2) this document, (3) validate-programs.cjs or code
- Never rely on Claude "remembering" to apply a rule
- If a rule can't be fully automated, add a WARNING check to the validation script

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

## Rule 29: Registration URLs Must Not Be Generic Homepages
**Why:** Scottish Cultural Centre had all 12 programs linking to the generic homepage. Parents couldn't find the actual registration page.
- URLs that resolve to just a domain root (no path), `/home`, or `/index.html` are flagged
- The URL must point to a program-specific or at minimum a programs/registration landing page
- The validator warns on these — manual fix required to find the correct URL

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
- `verify-programs.cjs --audit` should be run manually after any large batch import
- State is tracked in `scripts/verify-state.json` — do not delete this file
- The verify-report-YYYY-MM-DD.json files document what was checked and what was fixed

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
Reference docs/PROGRAM-SEARCH-METHODOLOGY.md for the systematic 9-phase search approach. Apply ALL rules above to every program in the new city. No shortcuts.

## Rule 16: NEVER import from activekids.com
activekids.com is NOT a primary data source. It is a third-party directory with incomplete, outdated, and sometimes inaccurate program listings. NEVER use activekids.com as a source for new programs, pricing, dates, or any other data. Always go directly to the provider's own website or the official registration system (ActiveNet, PerfectMind, Eventbrite, etc.) for program data.

This rule is PERMANENT and NON-NEGOTIABLE.

## Rule 24: NEVER use activekids.com or campscui.active.com URLs (HARD RULE)
**Why:** 459 programs were found with third-party aggregator URLs instead of direct provider registration pages. Parents clicking these links landed on generic search pages with no filters, couldn't find the specific program, and lost trust.
- Registration URLs must NEVER contain `activekids.com` or `campscui.active.com`
- URLs must point directly to the provider's own website or their official registration portal (ActiveNet, PerfectMind, Eventbrite, etc.)
- This extends Rule 16 (never import from activekids.com) to explicitly ban these domains in URLs
- The validator auto-flags any URL containing these domains as a hard error
- This rule has NO exceptions

## Rule 17: Always scrape official registration APIs directly
For any municipality or large provider with a registration portal, ALWAYS find and use their REST API to get the complete program catalog. Never rely on:
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

## Rule 18: Include ALL program types
Skeddo is not just for summer camps. Include EVERY program a parent might use:
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

## Rule 31: Triple-Check Before Removing Any Program (HARD RULE)
**Why:** Over 100 programs were incorrectly removed across the project's history — real kids programs from real providers (SportBall, Burnaby Winter Club, Paintlounge, Camp Qwanoes, etc.) were lost because removal criteria were too aggressive or not carefully verified.
- Before removing ANY program, triple-check that it genuinely does not belong in Skeddo
- A program should ONLY be removed if it meets one or more of these criteria:
  - **Adult-only:** ageMin >= 18 with no children/teens in the age range
  - **Outside service area:** program is not in the Lower Mainland / BC (e.g., Ontario-only programs, US programs)
  - **Permanently closed / no longer offered:** the provider has shut down or permanently discontinued the program, OR the program was cancelled/delisted before registration ever opened (NOT programs that ran and completed, NOT programs that are temporarily full, waitlisted, or between seasons)
  - **Fabricated / does not exist:** the listing was invented and the program never existed on the provider's website
  - **True duplicate:** an exact copy of another listing with ALL fields matching (per Rule 30)
- A program must NEVER be removed for any of these reasons:
  - Registration is full or has a waitlist (parents still want to see it)
  - Registration hasn't opened yet (use "Likely Coming Soon" status instead)
  - Price is unknown (use `cost: null` with `costNote: "Inquire for pricing"`)
  - URL is temporarily broken (mark as unverified, don't delete)
  - Data is from a prior year (mark as `confirmed2026: false` and `isEstimate: true`)
  - Provider hasn't confirmed 2026 offerings yet (use "Likely Coming Soon")
- When in doubt, KEEP the listing — a visible listing with estimated data is better than a missing listing
- This rule has NO exceptions

## Rule 32: Registration URL Must Lead to Enrollment for THAT Specific Program (HARD RULE)
**Why:** VSO School of Music "Arts Explorers" linked to a generic "camps" page. Parents had to click "Enroll Now", then navigate 8 sub-categories to find the right camp week. Multiple other providers had similar issues — generic program pages instead of direct enrollment links.
- The registrationUrl must lead to a page where the user can enroll in THAT SPECIFIC program within 1 click
- For ActiveNet providers: use the activity detail URL (`/activity/search/detail/{ID}`) not the search page
- For providers with sub-activities (e.g., weekly camps under a parent activity): link to the parent activity detail page (sub-activities are shown on that page)
- A URL that leads to a search results page, category listing, or generic "programs" page is NOT acceptable — even if the program appears somewhere on that page
- This extends Rule 1 (program-specific URLs) and Rule 29 (no generic homepages) to also cover intermediate pages that require additional navigation
- The validator checks for known patterns: ActiveNet search pages without a detail ID, provider pages ending in `/programs/`, `/camps/`, `/classes/` without a specific program path
- This rule has NO exceptions
