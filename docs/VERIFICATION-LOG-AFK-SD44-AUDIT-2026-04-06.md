# Verification Log — Artists for Kids / SD44 Summer Programs

**Audited:** 2026-04-06
**Queue entry:** Rank 167
**Source URLs verified:**
- `https://my44.sd44.ca/group/984mc2j/Pages/Summer%20Day%20Camps/Week%201%20-%20Camp%201/...` (Gr 1-2, Jun 29-Jul 3)
- `https://my44.sd44.ca/group/984mc2j/Pages/Summer%20Day%20Camps/Week%201%20-%20Camp%202/...` (Gr 3-5, Jun 29-Jul 3)
- `https://my44.sd44.ca/group/984mc2j/Pages/Summer%20Day%20Camps/Week%202%20-%20Camp%201/...` (Gr 1-2, Jul 6-10)
- `https://my44.sd44.ca/group/984mc2j/Pages/Summer%20Day%20Camps/Week%202%20-%20Camp%202/...` (Gr 3-5, Jul 6-10)
- `https://my44.sd44.ca/group/984mc2j/Pages/Summer%20Day%20Camps/Week%203%20-%20Camp%201/...` (Gr 1-2, Aug 31-Sep 4)
- `https://www.sd44.ca/school/summer/` (SD44 Summer Learning main page)
**DB count before audit:** 16,191 programs
**DB count after audit:** 16,194 (+3 AFK added, 4 AFK corrected, 7 SD44 URLs fixed)

---

## Summary

### Artists for Kids Summer Day Camps
The DB had 4 AFK day camp entries (15931-15934). Verified all 3 active registration pages (Weeks 1-3). Found 3 missing camp sessions:
- Week 1 - Camp 1 (Grades 1-2, Jun 29-Jul 3) — missing, added as AFK-W1C1
- Week 1 - Camp 2 (Grades 3-5, Jun 29-Jul 3) — missing, added as AFK-W1C2
- Week 2 - Camp 1 (Grades 1-2, Jul 6-10) — missing, added as AFK-W2C1

Weeks 4-5 registration pages return 404 — not yet published.

### SD44 Summer Learning
7 entries (SD44-0001 to SD44-0007) had broken registrationUrls using old `/ProgramsServices/` path (404). Updated all to main SD44 summer page. Status remains "Coming Soon" — appropriate as 2026 registration details not yet published.

---

## AFK Day Camp Details (confirmed from registration pages)

| Field | Value |
|-------|-------|
| Address | 2121 Lonsdale Avenue, North Vancouver, BC V7M 2K6 |
| Hours | 9:00 AM - 3:00 PM (6 hours) |
| Cost | $495/week (all weeks, including 4-day Canada Day week) |
| Max per session | 18 campers |
| Age groups | Grades 1-2 (ages 6-8) and Grades 3-5 (ages 8-11) |

### Confirmed Weeks

| Week | Dates | Days | Grades |
|------|-------|------|--------|
| W1 | Jun 29-Jul 3 | Mon/Tue/Thu/Fri (Canada Day Jul 1 off) | 1-2 and 3-5 |
| W2 | Jul 6-10 | Mon-Fri | 1-2 and 3-5 |
| W3 | Aug 31-Sep 4 | Mon-Fri | 1-2 and 3-5 |

Weeks 4-5 (URLs pattern existed for 4-5 but return 404 — not yet published as of Apr 6, 2026)

---

## Fixes Applied to Existing Entries

| ID | Field | Old | New |
|----|-------|-----|-----|
| 15931, 15932, 15933 | days | "Mon-Fri" | "Mon, Tue, Wed, Thu, Fri" |
| 15931, 15932, 15933 | address | "2121 Lonsdale Avenue, North Vancouver, BC" | Added V7M 2K6 postal code |
| 15931, 15932, 15933 | lat/lng | missing | 49.3201, -123.0743 |
| 15934 | days | "Mon-Fri" | "Mon, Tue, Wed, Thu, Fri" |
| 15934 | registrationUrl | General AFK URL | Direct Paradise Valley page URL |
| SD44-0001 to SD44-0007 | registrationUrl | /ProgramsServices/ subpages (404) | https://www.sd44.ca/school/summer/ |

---

## Notes

- AFK registration system is my44.sd44.ca (SD44 SharePoint portal) — numbered sequentially as Week 1/2/3
- AFK Week 1 (Canada Day) costs $495 same as 5-day weeks — no discount for the short week
- All 3 live AFK camp weeks have Max 18 campers per session (per registration page)
- AFK Paradise Valley (id=15934, status=Full) is a residential/field trip art camp at a separate location in Squamish-Lillooet Regional District — confirmed different from day camps
- SD44 Summer Learning programs (academic, not art camps): registration not yet open. Main URL: sd44.ca/school/summer/. The old /ProgramsServices/ subdirectory structure has been removed.
- DB count: 6 confirmed AFK camp sessions (W1C1, W1C2, W2C1, W2C2/15931, W3C1/15932, W3C2/15933) + Paradise Valley (15934)
