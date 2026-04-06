# Verification Log — Camp STEAM Canada

**Audited:** 2026-04-06
**Queue entry:** Rank 166
**Source URLs verified:**
- `https://campsteam.ca/summer-camps/burnaby/` (full 2026 schedule, pricing, ages, address)
- `https://campsteam.ca/summer-camps/port-moody/` (full 2026 schedule, pricing, ages, address)
**DB count before audit:** 16,183 programs
**DB count after audit:** 16,191 (+8 Port Moody added, 8 Surrey corrected → Burnaby)

---

## Summary

The DB had 8 Surrey entries (`camp-steam-surrey-1` through `camp-steam-surrey-8`) but the Surrey location is a 404 — Camp STEAM does not operate in Surrey for 2026. Current Metro Vancouver BC locations confirmed: **Burnaby** and **Port Moody** (Langford, Sidney, Victoria are Island — excluded from Metro Van audit).

Actions:
1. Relocated 8 Surrey entries → Burnaby (address, city, neighbourhood, lat/lng, name, URL, ageMin)
2. Added 8 new Port Moody entries

---

## Location Details

### Burnaby
| Field | Value |
|-------|-------|
| Venue | Nelson Avenue Community Church |
| Address | 5825 Nelson Avenue, Burnaby, BC V5H 3H6 |
| Ages | 6-13 (must be 6-13 on Aug 28, 2026) |
| Hours | 9:00 AM - 4:00 PM |
| Air conditioning | No |

### Port Moody
| Field | Value |
|-------|-------|
| Venue | Inlet United Church |
| Address | 2315 Spring Street, Port Moody, BC |
| Ages | 6-13 (same) |
| Hours | 9:00 AM - 4:00 PM |
| Air conditioning | Yes |

---

## Pricing
| Week | Cost |
|------|------|
| 5-day weeks (W1-4, W6-8) | $268/child |
| 4-day week (Aug 4-7, BC Day off) | $215/child |
| Before care (7:30-9:00 AM) | $40/week ($32 for 4-day week) |
| After care (4:00-5:30 PM) | $40/week ($32 for 4-day week) |

---

## 2026 Schedule (both locations identical)

| Week | Dates | Days | Cost | Theme |
|------|-------|------|------|-------|
| W1 | Jul 6-10 | Mon-Fri | $268 | Minecraft: Space Expedition |
| W2 | Jul 13-17 | Mon-Fri | $268 | LEGO: Theme Park Fun |
| W3 | Jul 20-24 | Mon-Fri | $268 | Minecraft: Mission to Mars |
| W4 | Jul 27-31 | Mon-Fri | $268 | LEGO: Forging the Future |
| W5 | Aug 4-7 | Tue-Fri | $215 | Minecraft: Space Expedition |
| W6 | Aug 10-14 | Mon-Fri | $268 | LEGO: Theme Park Fun |
| W7 | Aug 17-21 | Mon-Fri | $268 | Minecraft: Mission to Mars |
| W8 | Aug 24-28 | Mon-Fri | $268 | LEGO: Forging the Future |

---

## Fixes Applied to Existing Surrey Entries (camp-steam-surrey-1 to 8)

| Field | Old | New |
|-------|-----|-----|
| name | "Camp STEAM Week N" | "Camp STEAM Burnaby — Week N — [Theme] (date)" |
| address | "13474 96 Ave, Surrey, BC" | "5825 Nelson Avenue, Burnaby, BC V5H 3H6" |
| city | Surrey | Burnaby |
| neighbourhood | Whalley | Metrotown |
| lat/lng | Surrey coords | Burnaby coords (49.2245, -123.0096) |
| registrationUrl | campsteam.ca/summer-camps/ | campsteam.ca/summer-camps/burnaby/ |
| ageMin | 5 | 6 (site says min age is 6 on Aug 28, 2026) |
| ageSpanJustified | (missing) | Added — single cohort 6-13, no sub-division |
| costNote | (missing) | Added with full pricing detail |
| description | "Science & Technology program at Camp STEAM Canada. Ages 5-13. Mon-Fri." | Full description with theme, venue, extras |
| tags | ["extended-care", "STEM", "camp"] | ["STEM", "LEGO", "Minecraft", "coding", "science", "engineering", "technology"] |
| id=camp-steam-surrey-5 days | Mon, Tue, Wed, Thu, Fri | Tue, Wed, Thu, Fri (BC Day Aug 3 off) |
| id=camp-steam-surrey-5 beforeCare.cost | 40 | 32 (4-day week rate) |
| id=camp-steam-surrey-5 afterCare.cost | 40 | 32 (4-day week rate) |

---

## Notes

- Surrey location returns 404 — confirmed not operating in 2026
- BC locations for 2026: Burnaby, Langford, Port Moody, Sidney, Victoria
- Langford/Sidney/Victoria are Vancouver Island — excluded from Metro Vancouver audit scope
- Ages 6-13 confirmed via FAQ on both location pages: "no younger than 6 ... no older than 13 as of August 28, 2026"
- 4 themes run twice each (Jul and Aug) — themes confirmed from both location pages
- Provider website title for Port Moody still says "Summer Camp 2025" in browser title but content is clearly 2026
- Camp STEAM is a not-for-profit (stated on site footer)
