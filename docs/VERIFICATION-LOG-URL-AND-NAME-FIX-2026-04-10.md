# Verification Log — URL + Provider Name Fixes (2026-04-10)

**Date:** 2026-04-10
**Method:** Programmatic analysis and fix
**DB count:** 16,582 programs (unchanged)
**Violations before:** 0
**Violations after:** 0

---

## Issue 1: Generic Search URLs (3,772 entries)

### Root Cause
CoV ActiveNet (COV-) and Burnaby ActiveNet (BNB-) entries had generic search page URLs
(`/activity/search`) instead of specific detail page URLs (`/activity/search/detail/[ID]`).
The detail page URL can be constructed from the numeric ID in the entry's COV-/BNB- ID field.

### Fix
Programmatically converted 3,772 generic search URLs to detail page URLs:
- COV- entries: 2,986 URLs → `/vancouver/activity/search/detail/[ID]`
- BNB- entries: 786 URLs → `/burnaby/activity/search/detail/[ID]`

---

## Issue 2: Em-Dash vs Hyphen in Provider Names (90 entries)

Some provider names used em-dash (—) while others used hyphen (-).
Standardized all 90 entries to use hyphen.

---

## Issue 3: Roundhouse Naming (77 entries)

The Roundhouse had 4 different provider name variants. Standardized to:
"City of Vancouver - Roundhouse Cmty Arts and Rec Centre" (the form with most entries).

---

## Issue 4: Residual Cmty/Community Duplicates (18 entries)

After em-dash fix, 3 more Cmty/Community pairs appeared. Standardized:
- Dunbar Community Centre → Cmty Centre (7)
- Trout Lake Community Centre → Cmty Centre (9)
- Mount Pleasant Community Centre → Cmty Centre (2)

---

## Summary

| Action | Count |
|--------|-------|
| Generic URLs → detail page URLs | 3,772 |
| Em-dash → hyphen in provider names | 90 |
| Roundhouse name standardization | 77 |
| Residual Cmty/Community fixes | 18 |
| **Total entries fixed** | **3,957** |
