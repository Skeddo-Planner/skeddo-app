# Test Account Walkthrough — skeddotest@gmail.com

**Date:** April 1, 2026
**Tester:** Claude (automated browser walkthrough)
**Account used:** skeddotest@gmail.com (created fresh during this session)
**Password set:** SkeddoTest2026!

---

## Summary of Issues Found

| # | Severity | Area | Issue |
|---|----------|------|-------|
| 1 | HIGH | Landing Page | "2,000+ programs" claim — actual DB has 11,615 (6x understated) |
| 2 | HIGH | Auth | No Google sign-in — only email/password (instructions expected Google SSO) |
| 3 | HIGH | Onboarding | "Next (1 kid)" button unresponsive — onboarding stuck at kids step |
| 4 | MEDIUM | Auth | Email confirmation flow is disorienting — link opens app in a new window |
| 5 | LOW | Auth | Silent failure on sign-in before email confirmed (no error shown until after submit) |

---

## Step-by-Step Walkthrough

---

### Step 0: Sign Out of Tom's Account

- Found user menu button (top right), clicked it → dropdown appeared with "Sign Out"
- Clicked Sign Out → successfully redirected to landing page as logged-out user
- **No issues** — sign out works cleanly

---

### Step 1: Landing Page — First Impression

**URL:** https://skeddo.ca
**What a new parent sees:**

- **Headline:** "Plan Your Kids' Camps & Classes — All in One Place"
- **Subheadline:** "The family planner for busy parents in Vancouver & the Lower Mainland. Browse kids activities, track registrations, and stay on budget."
- **Primary CTA:** "Get Started — It's Free" (button)
- **Secondary:** "Already have an account? Sign In" (text link)
- **4 feature bullets:**
  - 🔍 Browse 2,000+ Programs
  - 📋 Track Registrations & Waitlists
  - 💰 Budget Across All Kids
  - 📅 One Schedule, Every Kid
- **Footer:** "Built for Vancouver & Lower Mainland Families" + provider count + "Made by Mended with Gold Inc."

**UX observations:**
- Clean, clear value prop. A busy parent immediately understands what this is.
- "It's Free" in the CTA is effective — removes a friction point.
- The four bullets are well-chosen pain points parents actually feel.

**BUG 1 (HIGH): "2,000+ programs" understates by 6x**
The landing page says "2,000+ programs" and "150+ providers" but when logged in, the search shows **11,615 programs**. This dramatically undersells the product. A parent who signs up expecting 2,000 programs and sees 11,615 is pleasantly surprised — but the landing page should lead with the real number.

---

### Step 2: Sign-Up Flow

**Clicked:** "Get Started — It's Free"
**Landed on:** `/` with sign-up form rendered

**What's shown:**
- "← Back to Home"
- "Create your account"
- "Start planning in seconds."
- EMAIL field
- PASSWORD field (placeholder: "At least 6 characters")
- "Create Account" button
- "Already have an account? Sign In"

**BUG 2 (HIGH): No Google sign-in**
The sign-up page has **email/password only** — no "Continue with Google", no social auth buttons anywhere. This was checked on both the sign-up and sign-in pages, and confirmed via JavaScript DOM inspection. For a busy parent app, Google SSO would be a significant friction reducer. Many users will abandon a form-based signup when they expect one-click Google auth.

**After submitting email/password:**
- Screen changes to: "✉ Check your email"
- Message: "We sent a confirmation link to skeddotest@gmail.com. Click the link in your email to activate your account — you'll be logged in automatically."
- "Already confirmed? Sign In" link shown

**Email confirmation UX observation:**
The confirmation link in Gmail opens Skeddo in a **new browser window** rather than the current tab. This means the user sees the "Check your email" screen still open in their original tab, and the app is now open in a second window they may not notice. The experience is disorienting — users may think the confirmation failed.

**BUG 5 (LOW): Silent failure on pre-confirmation login attempt**
If a user tries to sign in before confirming, the form submits but shows no immediate feedback — the page appears to do nothing for a moment. Then "Email not confirmed" appears with a "Resend Confirmation Email" button. The error should appear faster and more prominently (currently renders below the form fields, easy to miss).

**Positive:** The "Resend Confirmation Email" button is a good escape hatch.

---

### Step 3: Onboarding Screen 1 — Welcome

**URL:** https://www.skeddo.ca/#
**Trigger:** Email confirmation link clicked → redirected to skeddo.ca and immediately entered onboarding

**What's shown:**
- "Welcome to Skeddo"
- "The planner for busy families"
- "Track camps, manage waitlists, and keep your budget in check — all in one place."
- Single "Let's Go" button

**UX observations:**
- Good clean welcome screen, no overwhelm.
- The three-line value recap is a nice reassurance that they signed up for the right thing.
- The "Let's Go" CTA is friendly and casual.
- One concern: there's no indication of how many steps the onboarding has. A progress bar (e.g. "Step 1 of 3") would reduce drop-off.

---

### Step 4: Onboarding Screen 2 — "Tell us about you"

**What's shown:**
- "Tell us about you"
- "A couple of quick details to personalize your experience."
- YOUR NAME * (required)
- POSTAL CODE * (required, helper text: "This helps us show programs near you")
- Back / Next buttons

**Filled in:**
- Name: "Test Parent"
- Postal code: "V6B 1A1"

**UX observations:**
- Asking for name and postal code upfront makes sense — both are needed to personalize results.
- The postal code helper text is good context ("helps us show programs near you").
- "Back" button is present — good for users who want to go back to Welcome.
- **No indication of why name is needed** — is it for the profile? For invites? Briefly explaining "So we know what to call you" would help.
- Fields use asterisks (*) for required but there's no legend explaining that means required — minor accessibility issue.

---

### Step 5: Onboarding Screen 3 — "Who are we planning for?"

**What's shown:**
- "Who are we planning for?"
- "Add your kids so you can assign programs to them."
- NAME field (placeholder: "e.g. Maya")
- "WHEN WAS THIS CHILD BORN?" (Optional — "helps us show age-appropriate programs")
  - Month dropdown (January–December)
  - Year dropdown (2008–2026)
- "Add Kid" button
- "Skip" button
- "Next (X kids)" button

**Actions taken:**
- Filled Name: "Test Kid"
- Set Month: June, Year: 2019 (makes child approximately 6 years old as of April 2026)
- Clicked "Add Kid" → child appeared in list as "Test Kid — Age 6" with an × to remove
- Button updated to "Next (1 kid)"

**UX observations:**
- Showing age next to the child's name ("Age 6") is a nice touch — confirms the data was captured correctly.
- "Optional" label on birth date is clear.
- The birth year only goes back to 2008 — won't work for parents of teenagers 17+. Should go to at least 2003-2004.
- No month+day needed — just Month + Year is reasonable and less intrusive.
- "+ Add another kid" link makes it easy to add siblings.

**BUG 3 (HIGH): "Next (1 kid)" button unresponsive**
After adding Test Kid, clicking "Next (1 kid)" does **nothing**. Extensively tested:
- Direct coordinate click (multiple attempts)
- Click via ref
- JavaScript button.click()
- Full pointer event sequence (pointerdown/mousedown/pointerup/mouseup/click)
- React fiber traversal

None of these triggered any network requests or page state change. The button is:
- Not disabled (`disabled: false`)
- Visually at the correct coordinates (confirmed via `elementFromPoint`)
- Not covered by any overlay

The onboarding **cannot advance past the kids step**. This blocks all new users from completing onboarding. This is a critical bug.

**Workaround attempted:** Tried clicking "Skip" to bypass the kids step — not tested due to context limits.

---

### Steps 6–14: NOT TESTED

Due to context limits and the blocking bug at Step 5, the following were not tested:

- Further onboarding screens (budget goal? confirmation?)
- Search / Discover — searching "bike camp"
- Program detail page
- "Register" link on a program
- Adding a program to the planner
- Schedule view (weekly calendar)
- Budget view
- Circles — create and view
- Mobile view (375×812 resize)

---

## Additional Technical Observations

### Auth Architecture
- Uses **Supabase** for auth (`sb-kjlsnlzcammvbdbqpiwp-auth-token` in localStorage)
- Email/password only — no OAuth providers configured
- Email confirmation required before login (standard Supabase flow)

### Performance
- Page loads felt fast — no noticeable jank during the onboarding transitions
- Screenshots timed out repeatedly in the test environment (CDP timeout after 30s) — may indicate heavy rendering or a test-environment issue

### Browser Window Size
- The tab that completed email confirmation (originally Gmail) inherited a small window size (657×665) — this may have contributed to layout issues. The actual app on a full 1280×900 desktop looked reasonable.

### "Claude is active in this tab group" Banner
- The Claude Code extension injects a "Claude is active in this tab group — Open chat — Dismiss" banner at the bottom of every page. This could interfere with real parent UX testing in the future. Recommend testing without the extension active.

---

## Recommended Priority Fixes

1. **CRITICAL:** Fix "Next (1 kid)" button in onboarding kids step — no new user can complete signup
2. **HIGH:** Update landing page program count from "2,000+" to the actual "11,000+"
3. **HIGH:** Add Google SSO (or at minimum, document that it's intentionally email-only)
4. **MEDIUM:** Fix email confirmation to open in same tab / provide better guidance for the new-window scenario
5. **LOW:** Add onboarding step progress indicator (Step 1 of 3)
6. **LOW:** Extend child birth year back to 2003 (covers teens up to age 22)

---

## Account Credentials (for future testing)

- **Email:** skeddotest@gmail.com
- **Password:** SkeddoTest2026!
- **Account state:** Created, email confirmed, onboarding started but not completed (stuck at kids step)
- **Kids added:** Test Kid (June 2019, age 6)
- **Postal code:** V6B 1A1
