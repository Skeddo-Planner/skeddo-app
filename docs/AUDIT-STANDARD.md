# Audit Standard — One Click Deeper

## One Click Deeper Audit Standard

When auditing or adding provider data, EVERY field must be verified against the provider's actual registration page:

1. Navigate to the provider's registration/program listing page (not just their homepage)
2. For EVERY program listing, verify ALL of these fields:
   - name, description, cost, costNote, startDate/endDate, startTime/endTime
   - ageMin/ageMax, address, neighbourhood, url, enrollmentStatus, category/subcategory, days
3. For NEW listings: every field must be sourced directly from the registration page. No guessing.
4. For EXISTING listings: compare every field against the registration page. Fix any discrepancies.
5. If a field cannot be verified, document the specific reason in costNote.

## Mandatory Audit Patterns (from Tom's April 1 spot-check)

These patterns were found across ALL 9 providers checked. They are systemic failures.

### 1. NAVIGATE LIKE A PARENT
- Click every dropdown on the registration page
- Expand every location/category/age group selector
- Scroll through the full list (many programs are below the fold)
- Click into individual program details pages
- Check EVERY location tab for multi-location providers

### 2. ONE LISTING PER UNIQUE PROGRAM
Break down by: skill level, age group, theme/name, time slot (AM vs PM), combo packages.
"Bike Camp Level 1", "Bike Camp Level 2" = two listings. "5-12" age range = wrong if provider breaks it into 5-6, 7-8, 9-10, 11-12.

### 3. EVERY LOCATION MUST BE CHECKED
Multi-location providers (Code Ninjas, Pedalheads, Pear Tree, etc.) — check EVERY Metro Vancouver location. Use location dropdowns, "Change Location" buttons, or location-specific URLs.

### 4. URLs MUST POINT TO REGISTRATION, NOT INFO
- ✅ `provider.com/camps/summer-camp/#programs` or `provider.com/register?session=12345`
- ❌ `provider.com/camps/` or `provider.com/our-programs`
Look for #register, #programs, #book, #signup anchors.

### 5. USE PROVIDER'S EXACT AGE BREAKDOWNS
Use EXACTLY the age ranges the provider uses. Do NOT combine into a generic range.

### 6. COMPLETED PROGRAMS STAY IN DATABASE
Past programs still on the provider's site → keep with `enrollmentStatus: "Completed"`.

### 7. NEVER MARK DATA AS ESTIMATED WHEN IT'S VERIFIABLE
If the price/date/detail is visible on the registration page, it is CONFIRMED — not an estimate. Only use `isEstimate: true` for prior-year data when current year hasn't been published.

### 8. COUNT AND VERIFY COMPLETENESS
After auditing, count total unique programs on the provider's page vs what's in the DB.
Document: "Provider shows X programs, we have Y — [X-Y] missing."

### 9. API DATA MUST BE VALIDATED BEFORE USE
Provider APIs may return generic, default, or outdated data.

**Validation protocol:**
1. For the first 10-15 listings, pull data from BOTH the API AND the actual registration page
2. Compare EVERY field — price, age range, program name, URL, enrollment status
3. ALL 10-15 match with ZERO differences → API is "validated" for this provider
4. ANY discrepancy → API is "invalidated." Use browser navigation only.
5. Document validation status in the verification log

**Currently invalidated APIs:**
- Pedalheads (api.pedalheads.com) — wrong prices, wrong ages, broken URLs. Browser only.
