# Verification Log — Sparks Academy

**Date:** 2026-04-04
**Auditor:** Claude (automated audit agent)
**Provider:** Sparks Academy
**Provider Website:** https://www.sparksedu.com/
**Registration Page:** https://campscui.active.com/orgs/SparksAcademy?orglink=camps-registration
**Location:** Kerrisdale, Vancouver, BC

---

## Key Finding: Summer 2026 Registration Not Yet Accessible

Sparks Academy's website announces "Summer Camp Registration is NOW OPEN!" but the actual summer 2026 programs are not accessible on the ACTIVE registration portal (campscui.active.com/orgs/SparksAcademy). The current active season (3738134) only shows one upcoming session. The summer programs may be published in a new season not yet listed.

**Provider's stated summer pricing (from sparksedu.com/summercamp):**
- Half-day (morning 9am–12pm or afternoon 1pm–4pm): $375/week + tax
- Full-day (9am–4pm): $750/week + tax
- Extended day (to 5pm): +$100/week

**Database prices for summer programs are inconsistent with these rates:**
- Ages 3-6 programs show $901.95/week — does not match any stated pricing
- Ages 7-12 programs show $624.75/week — does not match any stated pricing
- Some programs show $150, $504, $756 — all inconsistent

These prices cannot be verified against a live registration page as of 2026-04-04.

---

## Registration Portal Verified Sessions (campscui.active.com season 3738134)

| # | Program Name | Date | Ages | Cost | Status |
|---|-------------|------|------|------|--------|
| 1 | Digital Collage & Design | Apr 20, 2026 | 6-12 | $168 | Open |

Only 1 session found on the live registration portal.

---

## Spring Break Programs (Completed)

The following programs ran during Spring Break 2026 (Mar 16–27) and are now completed:

| ID | Program Name | Date | Status |
|----|-------------|------|--------|
| ACT-0164 | AI Space Colony Builder (AI Engineering Lab) | Mar 23 | Completed |
| ACT-0178 | AI Security System (AI Engineering Lab) | Mar 24 | Completed |
| ACT-0188 | AI Park Designer (AI Engineering Lab) | Mar 25 | Completed |
| ACT-0193 | AI Weather Controller (AI Engineering Lab) | Mar 26 | Completed |
| ACT-0198 | AI Farming Tycoon (AI Engineering Lab) | Mar 27 | Completed |

---

## Database vs Live Page Comparison

| Category | Provider Shows | Database Has | Action |
|----------|---------------|--------------|--------|
| Spring Break (Mar) | Programs completed | Mixed statuses | Fixed to "Completed" |
| Apr 20 Digital Collage | 1 session, $168 | ACT-0254, $168 Open | Confirmed correct |
| Summer 2026 (Jun-Sep) | Not accessible on portal | 22 programs with unverified prices | Set confirmed2026=false, priceVerified=false |

---

## Discrepancies Found and Fixed

### 1. Spring break programs marked Completed (5 programs)
ACT-0164, ACT-0178, ACT-0188, ACT-0193, ACT-0198 all ran in March 2026 and are now complete.

### 2. Summer programs flagged as unverified (22 programs)
Programs ACT-0335 through ACT-0782 (summer weeks 1–11) have prices that don't match the provider's stated pricing ($375/wk half-day, $750/wk full-day). Since these cannot be verified against the live registration portal, all were set to:
- confirmed2026: false
- priceVerified: false
- enrollmentStatus: "Likely Coming Soon" (auto-fixed by validator from R14 rule)
- costNote added explaining unverified status

### 3. Registration URLs updated (all programs)
Updated from mixed URLs (sparksedu.com/summercamp, sparksedu.com/camps-1) to the actual registration portal: https://campscui.active.com/orgs/SparksAcademy?orglink=camps-registration

---

## Count Verification

- Registration portal (live): 1 accessible session (Apr 20)
- Database programs: 28 total
- Spring break: 5 (now Completed)
- April enrichment: 1 (ACT-0254, confirmed Open)
- Summer 2026: 22 (unverifiable, set to Likely Coming Soon)

---

## Follow-up Required

Summer camp prices need re-verification when the summer 2026 registration season opens on campscui.active.com. Expected pricing based on provider website: $375/week (half-day) or $750/week (full-day) + tax. The current DB prices ($901.95, $624.75, $150, $504) do not match.

**Contact:** inquiry@sparksedu.com | 672-515-7893
