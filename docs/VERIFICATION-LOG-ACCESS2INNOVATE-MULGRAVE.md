# Verification Log — Access2Innovate / Mulgrave

**Date:** 2026-04-04
**Auditor:** Claude (automated)
**Registration page:** https://www.mulgrave.com/campus-life/mulgrave-school-summer-camps
**Booking portal:** https://campscui.active.com/orgs/MulgraveSchool?orglink=camps-registration

---

## Summary

Provider has 111 programs in database (107 under "Access2Innovate / Mulgrave" + 4 under "Mulgrave School"). Main issues: incorrect address and missing `url` field on all programs.

Changes: 0 added / 111 fixed (address + url).

---

## Issues Fixed

### 1. Address incorrect on all programs
- **Before:** `2330 Cypress Lane, West Vancouver, BC`
- **After:** `2330 Cypress Bowl Lane, West Vancouver, BC V7S 3H9`
- Source: Mulgrave School's own website confirms full street name is "Cypress Bowl Lane"

### 2. Missing `url` field
- All 111 programs had `url: undefined`
- **Fixed:** All set to `https://www.mulgrave.com/campus-life/mulgrave-school-summer-camps`
- Note: `registrationUrl` was already correct (`https://www.mulgrave.com/campus-life/mulgrave-school-summer-camps`)

---

## Enrollment Status

Registration is **currently OPEN** as of 2026-04-04.

Sessions run:
- Week 1: July 6-10
- Week 2: July 13-17
- Week 3: July 20-24
- Week 4: July 27-31

Transfer/refund deadline: June 1, 2026

---

## Notes

- The campscui.active.com org handle is `MulgraveSchool` (allowed per Rule 24 — only activekids.com is banned)
- Information pages hosted on Canva: mulgravelearning.my.canva.site/summer-camps-2026
- Programs cover Grades 1-11 + Early Years (PK4/Kindergarten)
- The 4 numeric-ID programs (583-586) under "Mulgrave School" provider name have also been address/url-fixed
