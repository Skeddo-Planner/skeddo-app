# Verification Log — Vancouver Skateboard Coalition

**Audited:** 2026-04-06
**Queue entry:** Rank 165
**Source URLs verified:**
- `https://www.vancouverskateboardcoalition.ca/` (no 2026 camp info found)
- `https://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&activity_select_param=2&activity_keyword=skateboard&viewMode=list` (CoV recreation portal)
**DB count before audit:** 16,183 programs
**DB count after audit:** 16,183 (0 added, 6 downgraded — no new entries possible)

---

## Summary

The DB had 6 VSC entries (ACT-0407, ACT-0485, ACT-0533, ACT-0588, ACT-0708, ACT-0737) sourced from the old ACTIVE Network API. All were marked `enrollmentStatus="Open"`, `confirmed2026=true`, `priceVerified=true` at $515/week with 9am-3pm full-day schedule and "Busing Available."

**Neither the VSC website nor the CoV recreation portal (new ActiveNet system) shows any VSC-operated full-day camps for 2026.** The CoV portal search for "skateboard" returns only:
1. **Spectrum Skateboard Society Camp** — Hillcrest CC, 1pm-4pm, $250/week, ages 6-17
2. **Swim and Skate Camp** — Hillcrest Rink, 9:30am-4pm, $225.55/week, ages 8-13

Neither matches the VSC DB entries ($515, 9am-3pm, "Busing Available"). It's possible VSC ran these camps in prior years via an ACTIVE Network partnership that no longer exists, or that they will open registration later in 2026 — but as of April 6, 2026 they cannot be confirmed.

**Decision:** Downgrade all 6 entries to "Likely Coming Soon", unset `confirmed2026`/`priceVerified`, fix name typos ("Avialble" → correct names), update `registrationUrl` to CoV recreation skateboard search, add `ageSpanJustified` and improved `description`.

---

## DB Entries (ACT-0407, ACT-0485, ACT-0533, ACT-0588, ACT-0708, ACT-0737)

| ID | Session | Dates |
|----|---------|-------|
| ACT-0407 | Session 1 | Jul 6-10 |
| ACT-0485 | Session 2 | Jul 13-17 |
| ACT-0533 | Session 3 | Jul 20-24 |
| ACT-0588 | Session 4 | Jul 27-31 |
| ACT-0708 | Session 5 | Aug 10-14 |
| ACT-0737 | Session 6 | Aug 17-21 |

---

## Fixes Applied

| Field | Old | New |
|-------|-----|-----|
| name | "Vancouver Session N - ... - Busing Avialble" | "VSC Vancouver Skate Camp — Session N (dates)" |
| enrollmentStatus | Open | Likely Coming Soon |
| confirmed2026 | true | false |
| priceVerified | true | false |
| registrationUrl | https://www.vancouverskateboardcoalition.ca/ | CoV recreation portal skateboard search |
| costNote | (missing) | Prior-year ACTIVE API data ($515/week); 2026 not confirmed on CoV portal as of Apr 2026 |
| ageSpanJustified | (missing) | Added — ages 6-14 covers beginner to intermediate (no age-band subdivision verified) |
| description | Repeated camp name with typo | Full-day skate camp with busing; 2026 unconfirmed as of April 2026 |
| days | "Mon-Fri" | "Mon, Tue, Wed, Thu, Fri" (normalized format) |

---

## Notes

- VSC website (vancouverskateboardcoalition.ca) has no summer camp information as of audit date
- CoV migrated from old ACTIVE Network (`anc.ca.apm.activecommunities.com/VancouverParks`) to new system (`anc.ca.apm.activecommunities.com/vancouver`) — old ACT-* IDs may not be present in new portal
- Spectrum Skateboard Society Camp ($250, Hillcrest CC) and Swim and Skate Camp ($225.55, Hillcrest Rink) are distinct programs from different providers — NOT VSC entries
- $515 price from old API is significantly higher than comparable CoV skate offerings — may reflect a premium/full-day program that VSC has not yet listed for 2026
- No new entries added — re-audit when registration opens (likely spring 2026)
