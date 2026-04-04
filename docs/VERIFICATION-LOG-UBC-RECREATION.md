# Verification Log — UBC Recreation

- **Date:** 2026-04-04
- **Auditor:** Claude (automated audit agent)
- **Registration page URL:** https://recreation.ubc.ca/camps/summer/
- **Portal URL:** https://portal.recreation.ubc.ca (requires login to register)

---

## Summary

Provider shows approximately 80+ distinct camp programs across 17 categories. Database had 110 records covering 20 program types (~25% of full catalog). This audit verified all existing records and fixed 2 programs with incorrect status/data. The large number of missing programs was documented but not added in this pass — a follow-up audit is needed for full coverage.

**Existing records verified accurate:** 108 records (all except filmmaking and rowing)
**Programs updated:** 2 (filmmaking and rowing)
**New records added:** 9 (8 additional rowing sessions + 1 additional filmmaking session)
**Missing programs documented:** ~60+ (see below)

---

## Verified Programs (No Changes Needed)

All 108 records for the following camp types were verified against the live registration page at https://recreation.ubc.ca/camps/summer/. Dates, prices, ages, addresses, and enrollment status all match.

| Program | Sessions | Price | Ages | Address |
|---|---|---|---|---|
| Beach Kids Camp | 12 weekly (Jun 15–Sept 4) | $367.50/week | 6–7 | 1300 Discovery St (Jericho Sailing Centre) |
| City Explorers Camp | Aug 10–14, Aug 31–Sept 4 | $685/week | 10–13 | 6288 Stadium Rd (Thunderbird Stadium) |
| Super Soakers Camp | Jul 20–24, Aug 17–21 | $685/week | 12–14 | Thunderbird Stadium |
| Ultimate Adventure Camp | Jun 29–Jul 3, Aug 4–7 | $685/week | 12–14 | Thunderbird Stadium |
| AquaSport Sampler | 6 sessions Jun 29–Aug 7 | $171–$237 | 9–12 | UBC Aquatic Centre |
| Junior Lifeguard Camp | 6 sessions Jun 29–Aug 7 | $160–$200 | 8–12 | UBC Aquatic Centre |
| Mini World Cup Soccer | 10 sessions Jun 29–Sept 4 | $406–$508/week | 6–8 | Thunderbird Park - Ken Woods Field |
| Tennis Fundamentals - Red Ball | 9 sessions Jun 29–Aug 28 | $245–$306/week | 6–7 | UBC Tennis Centre, 6160 Thunderbird Blvd |
| Tennis Fundamentals - Orange Ball | 9 sessions Jun 29–Aug 28 | $245–$306/week | 8–9 | UBC Tennis Centre |
| Tennis Fundamentals - Green Ball | 9 sessions Jun 29–Aug 28 | $368–$650/week | 10–11 | UBC Tennis Centre |
| Tennis Fundamentals - Youth | 9 sessions Jun 29–Aug 28 | $520–$650/week | 12–15 | UBC Tennis Centre |
| Basketball Co-ed Elementary | Jul 13–17, Aug 10–14 | $285/week | 8–11 | War Memorial Gym |
| Basketball Co-ed Elementary (Older) | Jul 13–17, Aug 10–14 | $285/week | 12–14 | War Memorial Gym |
| S.T.E.A.M'ers Camp (Hellenic) | 9 sessions Jul 6–Sept 4 | $396–$495/week | 6–8 | Hellenic Community Centre, 4500 Arbutus St |
| S.T.E.A.M'ers Camp (UBC Campus) | Jul 27–31, Aug 17–21 | $495/week | 6–8 | UBC Campus (Classroom TBA) |
| S.T.E.A.M'ers Camp (Crofton House) | Aug 4–7 | $396 | 6–8 | Crofton House School, 3200 W 41st Ave |
| Kids Musical Theatre | Jul 13–17, Aug 10–14 | $546/week | 7–9 | B.C. Binnings Studios, 6373 University Blvd |
| Creative Writing Camp | Jul 13–17, Aug 10–14 | $605/week | 14–16 | Classroom TBA |
| Track & Field Fundamentals | 7 sessions Jul 13–Aug 28 | $214–$267/week | 9–12 | Rashpal Dhillon Track & Field Oval, 2329 Wesbrook |
| Junior Cruiser Sailing | 5 sessions Jun–Aug | $624.75/session | 12–16 | 1300 Discovery St (Jericho Sailing Centre) |

---

## Programs Fixed

### UBC Action Filmmaking Camp (ubc-filmmaking-1 + ubc-filmmaking-2)

**Previous state:** `enrollmentStatus: "Likely Coming Soon"`, ageMin: 6, no dates, cost: null, address: "UBC Campus", activityType: "Photography"

**Live site shows:**
- Name: "UBC Action Filmmaking Camp" (unchanged)
- Ages: 11–13 (not 6)
- Two sessions:
  - Session 1 (ubc-filmmaking-1): Jul 6–10, 2026
  - Session 2 (ubc-filmmaking-2): Jul 20–24, 2026 ← **new record added**
- Times: 9:00 AM – 4:00 PM
- Price: $495/week
- Address: Cambrian Hall, 215 E 17th Ave, Vancouver, BC (Mount Pleasant — NOT UBC Campus)
- Enrollment: Open

**Changes made:**
- enrollmentStatus: "Likely Coming Soon" → "Open"
- ageMin: 6 → 11, ageMax: null → 13
- Added startDate: 2026-07-06, endDate: 2026-07-10
- cost: null → 495
- costNote: "Inquire for pricing" → "Per week"
- address: "UBC Campus, Vancouver" → "Cambrian Hall, 215 E 17th Ave, Vancouver, BC"
- neighbourhood: "UBC" → "Mount Pleasant"
- activityType: "Photography" → "Performing Arts"
- confirmed2026: false → true, priceVerified: false → true
- Added second session record ubc-filmmaking-2 (Jul 20–24)

---

### Rowing – Fast Track Camp (ubc-rowing-1 through ubc-rowing-9)

**Previous state:** name: "UBC Thunder Youth Rowing", `enrollmentStatus: "Likely Coming Soon"`, ageMin: 6, no dates, cost: null, season: "Year-Round"

**Live site shows:**
- Name: "Rowing – Fast Track Camp" (not "UBC Thunder Youth Rowing")
- Ages: 13–18
- 9 weekly sessions, Mon–Fri, Jun 29 – Aug 28
- Times: 12:00 PM – 4:00 PM (half day afternoon)
- Price: $394.25/week (5-day weeks); $315.40/week (4-day weeks: Canada Day and BC Day)
- Address: John M.S. Lecky UBC Boathouse, 1 Boathouse Rd, Vancouver, BC
- Enrollment: Open

**Changes made to ubc-rowing-1:**
- name: "UBC Thunder Youth Rowing" → "Rowing – Fast Track Camp"
- enrollmentStatus: "Likely Coming Soon" → "Open"
- ageMin: 6 → 13, ageMax: null → 18
- Added startDate: 2026-06-29, endDate: 2026-07-03
- startTime: null → "12:00 PM", endTime: null → "4:00 PM"
- cost: null → 315.40 (4-day week due to Canada Day)
- costNote: updated
- season: "Year-Round" → "Summer 2026"
- campType: "Year-Round Program" → "Day Camp"
- registrationUrl: updated to rowing-fast-track-camp page
- confirmed2026: false → true, priceVerified: false → true

**8 new records added** (ubc-rowing-2 through ubc-rowing-9):
- ubc-rowing-2: Jul 6–10, $394.25
- ubc-rowing-3: Jul 13–17, $394.25
- ubc-rowing-4: Jul 20–24, $394.25
- ubc-rowing-5: Jul 27–31, $394.25
- ubc-rowing-6: Aug 3–7, $315.40 (BC Day week)
- ubc-rowing-7: Aug 10–14, $394.25
- ubc-rowing-8: Aug 17–21, $394.25
- ubc-rowing-9: Aug 24–28, $394.25

---

## Missing Programs (Not Added This Pass — Follow-Up Required)

UBC Recreation has a very large summer camp catalog (~80+ program types). This audit fixed existing records but did not attempt to add all missing programs. A dedicated follow-up audit is needed.

### High-Priority Missing Programs (by category):

**Adventure Camps** (ages 5-12, various dates/prices):
Ancient Mysteries, Aqua Adventures, Fairytale Fun, Garden Delights, Leap into Summer, No Limits, Outer Space Explorers, Ropes Course, Summer Spectacular, Urban Treasures

**Baseball:**
Performance Skill Development, Performance Summer World Series

**Biking & Skateboarding:**
Bike Hike, Bike Hike Stars, Bike Hike Supreme, Skateboarding Level 01 & 02

**Field Sports:**
Field Hockey Skill Development, Flag Football Intro Skills, Rugby Fundamentals, Ultimate Frisbee Beginner

**Fitness & Dance:**
Dance Ready Set Play!, Speed & Agility, Strength Power & Stability, Teen Fitness FUNdamentals

**Hockey & Skating:**
Hockey Performance, Skating Agility & Skills, Stickhandling & Shooting, Skating Spectacular

**Language & Enrichment:**
Adventures in English, Comic Book Adventures, Creative Writing & Rec Fun, Debate & Rec Fun, Intro Debate Skills, Read & Lead

**Multisports:**
Beach Sports and Canoeing Combo, Beach Sports Blast (Basics & Performance), Multisport Palooza, Run Hop Go!

**Performing Arts:**
Imagination Theatre, Musical Theatre Extravaganza, Star Performers Acting & Drama, Kids Can Rock & Roll, Mini Music Makers

**Personal Development:**
Red Cross Babysitter Training, Money Masters, multiple Leadership camps

**Racquet Sports:**
Badminton Beginner/Intermediate, Table Tennis Beginner

**Science & Technology:**
Animal Detectives, Aquatic Warriors in Training, Climate Justice & Leadership, Forest Guardians, Intro Coding with LEGO, Marine Animal Protectors, Marine Biologist, Marine Ecology (4 levels + combo), Ocean Creatures, Roblox Video Game Creation, Sea Scientists, Wildlife Biologist in Training

**Soccer (additional):**
Field Mice, Field Mice @ Douglas Park, Kickstart, Performance Goalkeepers, Performance Thunderbird Elite

**Tennis (additional):**
Competitive, Development, Performance levels

**Visual Arts:**
Animazing! Stop-motion Animation, Art-Tastic, Content Creator: YouTube Stars, Inspired Perspectives, Minecraft: Movie Makers

**Volleyball:**
Beginner Beach, Co-ed Skill Dev, Development Beach, Girls Advanced Club, Position Specific, High School & Club Prep

**Water Sports:**
Canoeing Level 1 & 2, Kayaking, Paddleboarding, Windsurfing, and multiple combo camps

**Also noted as variants of existing programs:**
- S.T.E.A.M'ers Plus (ages 6-8, 4 sessions, $495, Hellenic Community Centre) — NOT in database
- Mini World Cup @ Douglas Park (ages 6-8, 3 sessions Jun 22–Jul 27, $260, Douglas Park Field, 801 W 22nd Ave) — NOT in database

---

## Enrollment Status Notes

All verified programs show as "Open" on the live portal as of 2026-04-04.

## Price Verification

All prices verified from https://recreation.ubc.ca/camps/summer/ individual program pages as of 2026-04-04.
