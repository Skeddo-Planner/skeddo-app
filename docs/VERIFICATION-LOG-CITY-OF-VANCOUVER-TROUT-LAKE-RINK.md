# Verification Log: City of Vancouver - Trout Lake Rink

**Date Audited:** 2026-04-05
**Auditor:** Claude (automated audit)
**Registration Page:** https://anc.ca.apm.activecommunities.com/vancouver/activity/search (filtered to Trout Lake Rink)
**Status:** INCOMPLETE — Playwright browser spawn blocked

---

## Why This Audit Is Incomplete

The Playwright browser (Firefox via MCP) failed to spawn on every attempt with error:
```
Error: server: spawn UNKNOWN
C:\Users\thoma\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe: Permission denied
```

This is a recurring system-level issue on this Windows machine (same failure in Dunbar, Creekside, Mount Pleasant audits). The Firefox binary exists at the expected path but cannot be launched from the automated context. Without Playwright, ActiveNet registration pages cannot be verified (they require JavaScript to render).

---

## Existing Database State (47 programs — not verified against live page)

### Drop-in / Public Sessions (Completed)
| ID | Name | Days | Time | Date Range | Cost | Status |
|----|------|------|------|------------|------|--------|
| COV-593889 | Public Skate | Sun | 2:15–3:30 PM | Jan 4–Mar 29, 2026 | $7.41 | Completed |
| COV-593900 | Public Skate | Sat | 12:45–2:15 PM | Jan 10–Mar 28, 2026 | $7.41 | Completed |
| COV-593901 | Family Fun Hockey | Sat | 2:30–3:30 PM | Jan 3–Mar 28, 2026 | $7.41 | Completed |
| COV-593902 | Public Skate | Fri | 3:15–5:00 PM | Jan 9–Mar 27, 2026 | $7.41 | Completed |
| COV-604097 | Public Skate | Sun | 12:30–2:00 PM | Mar 29, 2026 | $7.41 | Completed |

### Drop-in / Public Sessions (Open — Spring 2026)
| ID | Name | Days | Time | Date Range | Cost | Status |
|----|------|------|------|------------|------|--------|
| COV-600137 | Public Skate | Sat | 1:15–2:45 PM | Apr 4–Jun 27, 2026 | $7.41 | Open |
| COV-600427 | Public Skate | Sun | 2:00–3:00 PM | Apr 5–Jun 28, 2026 | $7.41 | Open |
| COV-600428 | Public Skate | Sun | 3:15–4:15 PM | Apr 5–Jun 28, 2026 | $7.41 | Open |

### Birthday Party Packages (Open — Spring 2026)
| ID | Date | Time | Cost | Status |
|----|------|------|------|--------|
| COV-614204 | Apr 5, 2026 | Sun 1:30–5:30 PM | $110 | Open |
| COV-614207 | Apr 26, 2026 | Sun 1:30–5:30 PM | $110 | Open |
| COV-614208 | May 3, 2026 | Sun 1:30–5:30 PM | $110 | Open |
| COV-614209 | May 17, 2026 | Sun 1:30–5:30 PM | $110 | Open |
| COV-614210 | May 24, 2026 | Sun 1:30–5:30 PM | $110 | Open |
| COV-614211 | May 31, 2026 | Sun 1:30–5:30 PM | $110 | Open |
| COV-614212 | Jun 7, 2026 | Sun 1:30–5:30 PM | $110 | Open |
| COV-614213 | Jun 14, 2026 | Sun 1:30–5:30 PM | $110 | Open |
| COV-614214 | Jun 21, 2026 | Sun 1:30–5:30 PM | $110 | Open |
| COV-614215 | Jun 28, 2026 | Sun 1:30–5:30 PM | $110 | Open |

### Learn-to-Skate Lessons — Thu evenings (Apr 2–May 14, 2026)
| ID | Name | Time | Cost |
|----|------|------|------|
| COV-616527 | Skating - Preschool Level 3 | Thu 4:30–5:00 PM | $56.91 |
| COV-616791 | Skating - Preschool Level 1 | Thu 4:30–5:00 PM | $56.91 |
| COV-616792 | Skating - Preschool Level 1 | Thu 5:00–5:30 PM | $56.91 |
| COV-616793 | Skating - Preschool Level 1 | Thu 5:30–6:00 PM | $56.91 |
| COV-616794 | Skating - Preschool Level 2 | Thu 4:30–5:00 PM | $56.91 |
| COV-616811 | Skating - Preschool Level 5 | Thu 6:00–6:30 PM | $56.91 |
| COV-616861 | Skating - Child Level 1 | Thu 4:30–5:00 PM | $46.34 |
| COV-616864 | Skating - Child Level 2 | Thu 4:30–5:00 PM | $46.34 |
| COV-616867 | Skating - Child Level 3 | Thu 4:30–5:00 PM | $46.34 |
| COV-616868 | Skating - Child Level 3 | Thu 5:00–5:30 PM | $46.34 |
| COV-616869 | Skating - Child Level 3 | Thu 5:30–6:00 PM | $46.34 |
| COV-616870 | Skating - Preschool Level 3 | Thu 6:00–6:30 PM | $56.91 |
| COV-616871 | Skating - Child Level 4 | Thu 5:30–6:00 PM | $46.34 |
| COV-616872 | Skating - Preschool Level 4 | Thu 6:00–6:30 PM | $56.91 |
| COV-616873 | Skating - Child Level 4 | Thu 6:00–6:30 PM | $46.34 |
| COV-616874 | Skating - Child Level 6 | Thu 6:00–6:30 PM | $46.34 |
| COV-616875 | Skating - Child Level 7 | Thu 6:00–6:30 PM | $46.34 |
| COV-616876 | Skating - Child Level 5 | Thu 6:00–6:30 PM | $46.34 |

### Learn-to-Skate Lessons — Sat mornings (Apr 4–May 9, 2026)
| ID | Name | Time | Cost |
|----|------|------|------|
| COV-616878 | Skating - Child Level 1 | Sat 11:00–11:30 AM | $39.72 |
| COV-616882 | Skating - Child Level 3 | Sat 10:30–11:00 AM | $39.72 |
| COV-616884 | Skating - Child Level 4 | Sat 11:00–11:30 AM | $39.72 |
| COV-616885 | Skating - Child Level 5 | Sat 11:00–11:30 AM | $39.72 |
| COV-616886 | Skating - Child Level 6 | Sat 11:00–11:30 AM | $39.72 |
| COV-616887 | Skating - Child Level 7 | Sat 11:00–11:30 AM | $39.72 |
| COV-616888 | Skating - Preschool Level 1 | Sat 10:30–11:00 AM | $48.78 |
| COV-616889 | Skating - Preschool Level 1 | Sat 11:00–11:30 AM | $48.78 |
| COV-616890 | Skating - Preschool Level 1 | Sat 11:30 AM–Noon | $48.78 |
| COV-616903 | Skating - Child Level 3 | Sat 11:30 AM–Noon | $39.72 |

### Private Lessons
| ID | Name | Date | Time | Cost |
|----|------|------|------|------|
| COV-617465 | Skating - Private Lesson | Apr 9, 2026 | Thu 3:15–3:45 PM | $40.60 |

---

## What Could Not Be Verified

- **All programs:** Live page data could not be compared due to Playwright browser failure
- **Missing programs:** Cannot determine if any programs on the live page are absent from DB
- **Price accuracy:** Cannot confirm $7.41 drop-in, $110 birthday party, $46.34/$56.91 lesson prices
- **Enrollment status:** Cannot confirm Open/Full/Waitlist status for any program
- **Age ranges:** Several programs have ageMin/ageMax = null; cannot verify actual age requirements

## Programs Changed This Session

**None** — audit blocked before any data could be verified.

## Recommendation

Re-audit when Playwright browser is functional. The COV-616xxx series (lessons) and COV-614xxx (birthday parties) were bulk-imported and need per-page verification to confirm prices, ages, and enrollment status.
