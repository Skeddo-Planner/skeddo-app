# Verification Log: City of Richmond Camps — Audit V2

**Date:** 2026-04-04
**Auditor:** Claude (claude-sonnet-4-6)
**Registration page:** https://www.richmond.ca/parks-recreation/about/camps.htm
**PerfectMind (Children):** https://richmondcity.perfectmind.com/23650/Clients/BookMe4BookingPages/BookingCoursesPage?calendarId=17a44143-25f4-4d94-8100-22eb7de0204b&widgetId=15f6af07-39c5-473e-b053-96653f77a406&embed=False
**PerfectMind (Youth):** https://richmondcity.perfectmind.com/23650/Clients/BookMe4BookingPages/BookingCoursesPage?calendarId=10472f5b-3be6-4dae-bd73-c0dfef3e09e7&widgetId=15f6af07-39c5-473e-b053-96653f77a406&embed=False
**PerfectMind (Preschoolers):** calendarId=eebf133e-f56e-4782-bf67-17877093e87f

---

## Audit Status

**Summer 2026 registration not yet open.** Online registration opens **Tuesday, May 5, 2026 at 9:00pm**. All camp listings on PerfectMind show "no available classes at this time."

Source confirmed from: https://www.richmond.ca/parks-recreation/registration.htm

---

## Findings

### 1. Missing Community Centre: Hamilton

**Hamilton Community Centre** (5140 Smith Drive, Richmond, BC V6V 2W5) was **entirely absent** from the database despite being listed:
- As a location filter option on the PerfectMind registration system
- On the City of Richmond parks-recreation page
- With confirmed licensed childcare programs (preschoolers and school-age children) per the facility page at https://www.richmond.ca/parks-recreation/centres/hamiltoncentre.htm

**Action taken:** Added 15 programs for Hamilton Community Centre (IDs 16085–16099).

### 2. Data Quality Issues in Existing 105 Programs

All 105 existing City of Richmond programs had three violations:

| Field | Old Value | New Value | Reason |
|-------|-----------|-----------|--------|
| `enrollmentStatus` | `"Open"` | `"Coming Soon"` | Registration opens May 5, 2026. Cannot be "Open" before that date. |
| `status` | `"Open"` | `"Coming Soon"` | Same as above |
| `priceVerified` | `true` | `false` | Every description explicitly stated "Price shown is based on Summer 2025 rates (2026 pricing not yet published)" — marking as verified is incorrect |
| `registrationDateLabel` | `"TBD"` | `"May 5, 2026"` | Date confirmed on richmond.ca registration page |
| `registrationDate` | *(absent)* | `"2026-05-05"` | Date confirmed on richmond.ca registration page |
| `cost` | `65` | `null` | 2026 pricing not published; using a number implies verified 2026 price |
| `costNote` | basic | expanded | Now reads: "Based on Summer 2025 rate of $65. 2026 pricing not yet published. Subsidized rate. Recreation Fee Subsidy Program available." |
| `description` | "Check richmond.ca/camps for 2026 updates." | + "Registration opens May 5, 2026 at 9:00pm online." | Added confirmed registration date |

### 3. Camp Types Present on PerfectMind Not in Database

The PerfectMind Children calendar lists 21 camp categories, of which we only have 8 in the database. **Missing types** (cannot add yet — specific locations/pricing/ages not yet published for 2026):

- Bricks 4 Kidz® Camps
- Byte Camps
- Computer and Technology Camps
- General - Day Camp (Single Day)
- General - Day Camps
- Heritage Camps
- Lego® Camps
- Licensed - Before/After Care
- Licensed - Day Camps (Single Day)
- Martial Arts Camps
- Musical Theatre
- Racquet Sports Camps
- Science Camps *(now added)*
- Sportball®

These will appear on PerfectMind once the schedule is published (expected May 2026). Many are third-party programs (Bricks4Kidz, Sportball, Lego) whose specific locations and sessions won't be known until then.

### 4. Youth Calendar

The Youth calendar (calendarId: `10472f5b-3be6-4dae-bd73-c0dfef3e09e7`) returned: "There are no events for this calendar or you do not have permissions to view the calendar." Youth programs are not currently listed for Summer 2026. Youth camp types include: Adventure, Arts, Byte, Lego, Nature, Racquet Sports, Variety.

---

## Hamilton Community Centre — New Programs (IDs 16085–16099)

**Address:** 5140 Smith Drive, Richmond, BC V6V 2W5
**Phone:** 604-238-8055
**Neighbourhood:** Hamilton
**Coordinates:** 49.175919, -122.965356 (verified via Google Maps)
**Source:** https://www.richmond.ca/parks-recreation/centres/hamiltoncentre.htm

| ID | Name | Ages | Status |
|----|------|------|--------|
| 16085 | Adventure Camp at Hamilton (Ages 6-9) | 6–9 | Likely Coming Soon |
| 16086 | Adventure Camp at Hamilton (Ages 10-12) | 10–12 | Likely Coming Soon |
| 16087 | Arts Camp at Hamilton (Ages 6-9) | 6–9 | Likely Coming Soon |
| 16088 | Arts Camp at Hamilton (Ages 10-12) | 10–12 | Likely Coming Soon |
| 16089 | Music Camp at Hamilton (Ages 6-9) | 6–9 | Likely Coming Soon |
| 16090 | Music Camp at Hamilton (Ages 10-12) | 10–12 | Likely Coming Soon |
| 16091 | Nature Camp at Hamilton (Ages 6-9) | 6–9 | Likely Coming Soon |
| 16092 | Nature Camp at Hamilton (Ages 10-12) | 10–12 | Likely Coming Soon |
| 16093 | Science Camp at Hamilton (Ages 6-9) | 6–9 | Likely Coming Soon |
| 16094 | Science Camp at Hamilton (Ages 10-12) | 10–12 | Likely Coming Soon |
| 16095 | Sports Camp at Hamilton (Ages 6-9) | 6–9 | Likely Coming Soon |
| 16096 | Sports Camp at Hamilton (Ages 10-12) | 10–12 | Likely Coming Soon |
| 16097 | Variety Camp at Hamilton (Ages 6-9) | 6–9 | Likely Coming Soon |
| 16098 | Variety Camp at Hamilton (Ages 10-12) | 10–12 | Likely Coming Soon |
| 16099 | Preschool Day Camp at Hamilton (Ages 3-5) | 3–5 | Likely Coming Soon |

**Notes:**
- All Hamilton programs marked `confirmed2026: false` — the facility confirms running licensed daycamps but specific 2026 program types are not yet published
- Cost shown as `null` — based on 2025 rate of $65 but 2026 pricing not published
- `priceVerified: false` — will need updating when 2026 schedule publishes
- All dates (Jul 6 – Aug 21, weekly) modeled on the other 7 Richmond community centres
- Coordinates verified via Google Maps

---

## Provider Summary

| Community Centre | Programs in DB | Status |
|-----------------|---------------|--------|
| Cambie CC | 15 | Fixed — Coming Soon |
| City Centre CC | 15 | Fixed — Coming Soon |
| Sea Island CC | 15 | Fixed — Coming Soon |
| South Arm CC | 15 | Fixed — Coming Soon |
| Steveston CC | 15 | Fixed — Coming Soon |
| Thompson CC | 15 | Fixed — Coming Soon |
| West Richmond CC | 15 | Fixed — Coming Soon |
| **Hamilton CC** | **15 (new)** | **Added — Likely Coming Soon** |
| **TOTAL** | **120** | |

---

## TODO for May 2026 Follow-Up

When summer 2026 programs go live (May 5+):
1. Update `cost` and set `priceVerified: true` for all Richmond/Hamilton programs
2. Change `enrollmentStatus` from "Coming Soon" → "Open"
3. Update `registrationUrl` fields with actual program URLs (not just keyword searches)
4. Verify Hamilton actually offers all 7 camp types (or remove any not offered)
5. Check for new camp types (Bricks4Kidz, Byte, Lego, Sportball, etc.) and add them
6. Add Youth programs if they appear on the Youth calendar
