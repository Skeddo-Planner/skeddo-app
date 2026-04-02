# Skeddo Bug Sweep Report
**Date:** 2026-04-01
**Tester:** Claude (automated browser sweep)
**Environment:** Desktop Chrome on Windows 10, skeddo.ca (production), logged in as Tom
**Turn budget used:** ~130 of 250

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 2 |
| High     | 3 |
| Medium   | 4 |
| Low      | 2 |
| **Total**| **11** |

Plus 4 data-quality issues noted separately.

---

## CRITICAL Bugs

---

### BUG-001 — Mobile navigation completely missing
**Severity:** Critical
**Where:** All pages at mobile width (≤767px)
**Steps to reproduce:**
1. Open skeddo.ca on a phone (or resize browser to 375px width)
2. Observe the top navigation

**What happens:** The desktop nav bar (Search / Schedule / Programs / Circles / Budget) hides correctly via CSS breakpoint at `width ≤ 767px`, but **no mobile replacement exists** — no hamburger menu, no bottom navigation bar, no slide-out drawer. The user has no way to navigate between tabs.

**Evidence:** Screenshot taken at 375×812 shows only the Skeddo logo in the top-left; all navigation is gone.
**CSS breakpoints confirmed:** `(width <= 767px)` trigger exists in stylesheet but the mobile nav element is absent from the DOM.

**Impact:** Any user on a phone or tablet cannot navigate the app at all after landing on the home/dashboard screen.

---

### BUG-002 — Pedalheads registration URLs broken (6,575 programs affected)
**Severity:** Critical
**Where:** Program detail modal → "View registration page" link; all Pedalheads programs
**Steps to reproduce:**
1. Search for "Pedalheads" in the Search tab
2. Click any Pedalheads program card
3. Click "View registration page →" in the modal

**What happens:** The URL `https://pedalheads.com/en/camp/details?region=1&program_event=XXXXX&skill_level=` (empty `skill_level` parameter) lands on Pedalheads' own error page: **"Oops, you are on the wrong page."**

**Screenshot:** Captured Pedalheads 404-equivalent error page.
**Impact:** Pedalheads is the **largest provider** in the database (6,575 programs, ~48% of all programs). Every single registration link for Pedalheads is broken for parents trying to register.
**Root cause:** The `skill_level` parameter is being passed as empty (`&skill_level=`) — Pedalheads' site requires a valid value.

---

## HIGH Bugs

---

### BUG-003 — Program detail description truncated mid-sentence
**Severity:** High
**Where:** Program detail modal (click any program card) → description field
**Steps to reproduce:**
1. Search for any program
2. Click a program card to open the detail modal
3. Read the description

**What happens:** The description is cut off mid-sentence with no "Read more" indicator. Example seen: *"Once registered, the Access Services Team will contact you to determine camp l"* — sentence ends abruptly.

**Impact:** Parents can't read the full program description; may miss important details about eligibility or requirements.

---

### BUG-004 — Search Week filter has wrong BC Day date and Week 6 dates
**Severity:** High
**Where:** Search tab → Week filter dropdown
**Steps to reproduce:**
1. Open the Search tab
2. Click the "Week" filter button
3. Observe Week 6

**What happens:** The Week filter shows **"Week 6: Aug 4 – Aug 8 · BC Day Aug 4"**. This is wrong:
- BC Day 2026 = **August 3** (first Monday of August; confirmed Aug 1=Sat, Aug 2=Sun, Aug 3=Mon)
- Week 6 should be **Aug 3 – Aug 7** (Mon–Fri)

The Schedule Planner correctly shows "Week 6 Aug 3 – Aug 7", confirming the Week filter is the bug.

**Impact:** Parents filtering by the "BC Day week" get wrong results; programs on Monday Aug 3 won't appear if they filter by Aug 4–8.

---

### BUG-005 — Vancouver Academy of Music registration URL points to login page
**Severity:** High
**Where:** All Vancouver Academy of Music programs → "View registration page" link
**Steps to reproduce:**
1. Search for "Vancouver Academy of Music"
2. Click any program → click "View registration page →"

**What happens:** URL goes to `https://vancouveracademyofmusic.com/edit-my-profile/log-in-log-out/` — a generic login/logout page, not a programs or registration page.

**Screenshot:** Captured VAM "Log In/ Log Out" page.
**Impact:** Parents cannot find any registration information for VAM programs.

---

## MEDIUM Bugs

---

### BUG-006 — Location field shows leading comma when no street address
**Severity:** Medium
**Where:** Program detail modal → LOCATION field
**Steps to reproduce:**
1. Click any City of Burnaby program (e.g., "1:1 Support for Day Camps")
2. Look at the LOCATION field in the modal

**What happens:** Location displays as **", Burnaby, BC"** — starts with a comma because the street address field is empty. Should display just "Burnaby, BC" when no specific address is available.

**Affected programs:** All programs where `address` is null/empty but `city` and province are set (primarily "City of Burnaby - Unknown" provider).

---

### BUG-007 — Programs tab: $/HR column and "+ Add" button clipped at viewport edge
**Severity:** Medium
**Where:** Programs tab (click "Programs" in top nav)
**Steps to reproduce:**
1. Click the "Programs" nav tab
2. Look at the table — the rightmost column

**What happens:**
- The `$/HR` column header and all values are partially clipped at the right edge of the viewport (e.g., "$13." instead of "$13.85")
- The "+ Add" button in the top-right corner is clipped, showing only "+ Addo" instead of the full label

**Root cause:** Table has horizontal overflow at 1280px; the $/hr column is wider than the available space.

---

### BUG-008 — Schedule Planner: Week 10 end date shows Sep 3 instead of Sep 4
**Severity:** Medium
**Where:** Schedule tab → Planner view → Week 10
**Steps to reproduce:**
1. Click "Schedule" in the top nav
2. Ensure "Planner" toggle is selected (top-right)
3. Scroll to Week 10

**What happens:** Week 10 shows **"Aug 31 – Sep 3"** (4 days, Mon–Thu). The correct range is **"Aug 31 – Sep 4"** (Mon–Fri). The Search Week filter correctly shows "Aug 31 – Sep 4".

**Impact:** If a parent checks Week 10 coverage and a camp runs through Friday Sep 4, the planner might incorrectly report it as a gap.

---

### BUG-009 — Status filter appears pre-active with "4" badge (confusing default state)
**Severity:** Medium
**Where:** Search tab → filter bar
**Steps to reproduce:**
1. Open the Search tab (fresh load, no filters applied)
2. Observe the filter bar

**What happens:** The "Status" button displays a filled dark badge reading **"Status 4"** — the same visual treatment as a user-applied active filter. However, this is the *default* state (4 of 7 statuses pre-selected: Open for Registration, Coming Soon, Upcoming, Likely Coming Soon). Users may think they accidentally applied filters, or may not realize 3 statuses are hidden by default (Full/Waitlist, In Progress, Completed).

**Impact:** Confusing to new users; parents looking for "Full / Waitlist" programs may not know those are filtered out by default.

---

## LOW Bugs

---

### BUG-010 — Budget page "% remaining" label clipped at right edge
**Severity:** Low
**Where:** Budget tab → progress bar label
**Steps to reproduce:**
1. Click "Budget" in the top nav
2. Look at the budget progress bar's right-side label

**What happens:** The **"46% remaining"** label is clipped, showing only **"46% remaini"**.

---

### BUG-011 — Axis Adventure Camps uses HTTP (not HTTPS) registration URL
**Severity:** Low
**Where:** Data — `registrationUrl` for Axis Adventure Camps programs
**Details:** URL in database is `http://axiscamps.playbookapi.com/programs/register` (HTTP). The server redirects to HTTPS automatically so end-users are not exposed, but storing HTTP in the DB is bad practice and may break in future.

---

## Data Quality Issues (Not UI Bugs)

These are issues in `src/data/programs.json` that surface visually but are data problems:

| Issue | Count | Rule Violated |
|-------|-------|--------------|
| Programs with `cost: null` and no `costNote` | 5 | R15 |
| Providers showing as "City of Burnaby - Unknown" in location | ~39 programs | R8 |
| Providers "City of Vancouver - N/A" and "City of Vancouver - No Location" visible in Provider filter | Multiple | R8 |
| Arts Umbrella registration URL redirects to different path than stored | 1 | R23 |

**Programs with null cost / no costNote:**
- Debate Camp Vancouver (Debate Camp)
- Lykopis Archery Summer Camp (Lykopis Archery)
- Vancouver Albayan Arabic & Islamic Studies (Muslim Association of Canada)
- myArabic Academy Kids Classes (myArabic Academy)
- Vancouver Minor Softball Association (VMSA)

---

## What Was Tested and Verified Working

- ✅ Keyword search (returns correct results)
- ✅ Category filter (modal renders, selections work)
- ✅ Eligible for / age filter (correctly shows "Marti is 6/7" badges, "Show borderline camps" toggle)
- ✅ Cost filter (Total cost and $/hr tabs both work)
- ✅ Sort (Price Low/High applies correctly, dialog closes automatically)
- ✅ Zero-results state ("No programs found. Try adjusting your filters." with icon)
- ✅ Program card display (category, name, provider, status, dates, age, area, type, cost — all render)
- ✅ Program detail modal (opens, shows all fields, "Add to My Schedule" / "Close" buttons work)
- ✅ Code Ninjas registration URL ✅
- ✅ Arts Umbrella registration URL (redirects but lands correctly) ✅
- ✅ YMCA registration URL ✅
- ✅ Science World registration URL (intentional login page for their booking system) ✅
- ✅ Axis Adventure Camps URL (works after HTTP→HTTPS redirect) ✅
- ✅ Schedule Calendar view (current week highlighted, previous/next week navigation works)
- ✅ Schedule Planner view (Summer/Spring Break/Holiday Break tabs, coverage stats, week rows)
- ✅ Programs tab (table with filter by status/kid sidebar, quick stats, program list)
- ✅ Budget tab (goal tracking, committed/potential/remaining, spend by kid, spend by status, $/hr)
- ✅ "Needs Attention" alerts on Home dashboard
- ✅ Co-parent display on Home dashboard
- ✅ Budget snapshot on Home dashboard

---

## Prioritized Fix Order

1. **BUG-002** — Pedalheads broken URLs (48% of all programs, Critical)
2. **BUG-001** — Mobile navigation missing (Critical for all mobile users)
3. **BUG-004** — BC Day / Week 6 wrong date in search filter (High, parents get wrong results)
4. **BUG-005** — Vancouver Academy of Music wrong URL (High)
5. **BUG-003** — Description truncation (High, affects all programs)
6. **BUG-007** — Programs table overflow/clipping (Medium)
7. **BUG-006** — Leading comma in location (Medium)
8. **BUG-008** — Week 10 date off by one (Medium)
9. **BUG-009** — Status filter default state confusing (Medium)
10. **BUG-010** — Budget label clipped (Low)
11. **BUG-011** — HTTP URL for Axis Adventure (Low)
