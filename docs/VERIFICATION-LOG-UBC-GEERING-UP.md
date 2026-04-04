# Verification Log — UBC Geering Up

**Date:** 2026-04-04
**Auditor:** Claude (automated)
**Registration page:** https://campscui.active.com/orgs/GEERingUp
**Provider info page:** https://geeringup.apsc.ubc.ca/camps/in-person-camps/

---

## Summary

Registration is **confirmed OPEN** for Summer 2026 ("Registration for our 2026 Summer Camps is NOW OPEN!").

Database has 116 programs. Main issues: wrong `url` field (pointed to account management portal instead of registration page) and 104 programs incorrectly marked "Likely Coming Soon".

Changes: 0 added / 116 url fixed / 104 enrollment status updated to Open.

---

## Issues Fixed

### 1. Wrong URL on all 116 programs
- **Before:** `url: "https://campsself.active.com/GEERingUp"`
  - This is the **account management/login portal** — requires existing account login, not a discovery page
- **After:** `url: "https://campscui.active.com/orgs/GEERingUp"`
  - This is the **correct registration browse page** where parents can find and book camps

### 2. Enrollment status — 104 programs updated
- **Before:** `enrollmentStatus: "Likely Coming Soon"` on 104 programs
- **After:** `enrollmentStatus: "Open"` — registration confirmed open on live page

---

## Program Overview

UBC Geering Up offers STEM camps for:
- **Elementary** (Grades 1-7) — Vancouver, Richmond, South Surrey, Port Coquitlam, North Vancouver, Kelowna
- **High School** (Grades 8-12) — UBC Vancouver, UBCO Kelowna, South Surrey
- **All Girls** (Grades 1-12)
- **Kelowna** (Grades 1-9)

Address note: Admin office is at "Room 210, 2386 East Mall, Gerald McGavin Building, Vancouver, BC V6T 1Z4". Individual camp locations vary; "2332 Main Mall" in the database needs per-program verification.

---

## Rule 24 Compliance
Uses `campscui.active.com/orgs/GEERingUp` — allowed per Rule 24 (only activekids.com is banned).
