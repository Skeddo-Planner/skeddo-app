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

## When Adding Programs to New Cities
Reference docs/PROGRAM-SEARCH-METHODOLOGY.md for the systematic 9-phase search approach. Apply ALL rules above to every program in the new city. No shortcuts.
