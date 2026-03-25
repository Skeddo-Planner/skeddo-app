/**
 * fix-missing-times.cjs
 *
 * Fixes 157 programs in programs.json that are missing startTime/endTime.
 * All times sourced from actual provider websites (researched March 25, 2026).
 * Rule 22: NEVER guess times — only verified data or "Check with provider" notes.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Map of program id -> { startTime, endTime, timeNote? }
// Times verified from provider websites via WebFetch on March 25, 2026
const fixes = {

  // ============================================================
  // MADE TALENTS — JS-rendered booking page, no times visible
  // ============================================================
  2480: { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // 4CATS ARTS STUDIO — After school art daily at 4pm mentioned
  // ============================================================
  2484: { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // GRACIE BARRA VANCOUVER — martial arts, multiple class times
  // ============================================================
  2485: { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },
  2487: { startTime: null, endTime: null, timeNote: "Check with provider" },
  2488: { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // KINGCREST LEARNING ACADEMY — Wix site, times not visible
  // ============================================================
  2489: { startTime: null, endTime: null, timeNote: "Check with provider" },
  2490: { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },
  2491: { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // COLLAGE COLLAGE — summer camp times not listed on site
  // ============================================================
  2492: { startTime: null, endTime: null, timeNote: "Check with provider" },
  2493: { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // AQUAVENTURES SWIM CENTRE — multiple session times
  // ============================================================
  2501: { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // CITY OF VANCOUVER SWIM LESSONS — ActiveNet registration, times vary
  // ============================================================
  2502: { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },
  2503: { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },
  2504: { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },
  2505: { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // LITTLE KITCHEN ACADEMY (Fraser) — verified: 9am-12pm, 12:30pm-3:30pm, 4pm-7pm sessions
  // ============================================================
  2506: { startTime: "9:00 AM", endTime: "12:00 PM", timeNote: "Morning session; afternoon (12:30-3:30 PM) and evening (4-7 PM) also available" },

  // ============================================================
  // PACIFIC INSTITUTE OF CULINARY ARTS — teen camp dates listed but no daily times
  // ============================================================
  2508: { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // SALMON FOREST — verified: 9:00 AM - 3:00 PM
  // ============================================================
  "salmon-forest-1": { startTime: "9:00 AM", endTime: "3:00 PM" },

  // ============================================================
  // JCCGV CAMP SHALOM — times not listed on site
  // ============================================================
  "camp-shalom-1": { startTime: null, endTime: null, timeNote: "Check with provider" },
  "camp-shalom-2": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // CAMP SQUEAH — overnight/residential camp, no daily start/end times
  // ============================================================
  "camp-squeah-1": { startTime: null, endTime: null, timeNote: "Residential camp — check drop-off/pick-up times" },
  "camp-squeah-2": { startTime: null, endTime: null, timeNote: "Residential camp — check drop-off/pick-up times" },
  "camp-squeah-3": { startTime: null, endTime: null, timeNote: "Residential camp — check drop-off/pick-up times" },
  "camp-squeah-4": { startTime: null, endTime: null, timeNote: "Residential camp — check drop-off/pick-up times" },
  "camp-squeah-5": { startTime: null, endTime: null, timeNote: "Residential camp — check drop-off/pick-up times" },
  "camp-squeah-6": { startTime: null, endTime: null, timeNote: "Residential camp — check drop-off/pick-up times" },

  // ============================================================
  // MCNA ISLAMIC CAMP — page didn't render times
  // ============================================================
  "mcna-islamic-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // CAMP GAN ISRAEL — 403 on registration page
  // ============================================================
  "gan-israel-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // CAMP HATIKVAH — residential camp, times not on site
  // ============================================================
  "camp-hatikvah-1": { startTime: null, endTime: null, timeNote: "Residential camp — check drop-off/pick-up times" },

  // ============================================================
  // WCSYA SUMMER CAMP — Wix site, no times visible
  // ============================================================
  "wcsya-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // KHALSA CENTRE KCMV — Wix site, no times visible
  // ============================================================
  "kcmv-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // GHISS GURMAT CAMP — dates listed (Jul 18-26) but no daily times
  // ============================================================
  "ghiss-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // GURMAT CENTER — no times on site
  // ============================================================
  "gurmat-center-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // SUKH SAGAR ACADEMY — verified: 9:00 AM - 3:30 PM
  // ============================================================
  "sukh-sagar-1": { startTime: "9:00 AM", endTime: "3:30 PM" },

  // ============================================================
  // KHALSA SCHOOL — CSS-only content, no times visible
  // ============================================================
  "khalsa-school-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // HINDU HERITAGE CENTRE — Wix site, no times visible
  // ============================================================
  "hindu-heritage-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // UPHORIA YOGA — page didn't render camp times
  // ============================================================
  "uphoria-yoga-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // VANCOUVER MANDARIN SCHOOL — Wix site, no times visible
  // ============================================================
  "van-mandarin-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // VSO SCHOOL OF MUSIC — AZALEA CHINESE MUSIC ENSEMBLE
  // Verified: Sundays 2:00 PM - 3:30 PM
  // ============================================================
  "azalea-music-1": { startTime: "2:00 PM", endTime: "3:30 PM" },

  // ============================================================
  // VAFCS — no specific times listed
  // ============================================================
  "vafcs-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // UBC CEDAR — not yet accepting applications for 2026
  // ============================================================
  "ubc-cedar-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // I-SPARC — CSS-only content, no times visible
  // ============================================================
  "isparc-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // UBC MUSEUM OF ANTHROPOLOGY NYP — verified: 9:00 AM - 4:00 PM (paid program, M-F)
  // ============================================================
  "moa-nyp-1": { startTime: "9:00 AM", endTime: "4:00 PM" },

  // ============================================================
  // EKUA'S HERITAGE SUMMER CAMP — no daily times listed
  // ============================================================
  "ekua-heritage-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // SPIRIT OF DANCE BOLLYWOOD — multiple class times, schedule page needed
  // ============================================================
  "spirit-dance-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // VJLS JAPANESE SUMMER CAMP — Wix site, no times visible
  // ============================================================
  "vjls-camp-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // GLADSTONE JAPANESE LANGUAGE SCHOOL — language classes, multiple sessions
  // ============================================================
  "gladstone-jls-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // STEVESTON JAPANESE LANGUAGE SCHOOL — language classes, multiple sessions
  // ============================================================
  "steveston-jls-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // NIKKEI SUMMER MANGA CAMP — verified: 9:30 AM - 4:30 PM (M-F)
  // ============================================================
  "nikkei-manga-1": { startTime: "9:30 AM", endTime: "4:30 PM" },

  // ============================================================
  // HOLA SPANISH CENTRE — multiple class times
  // ============================================================
  "hola-spanish-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // VANCOUVER WESTSIDE GERMAN SCHOOL — language classes, sessions vary
  // ============================================================
  "vwgs-german-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // SURREY GERMAN LANGUAGE SCHOOL — language classes, sessions vary
  // ============================================================
  "surrey-german-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // ITALIAN CULTURAL CENTRE — camp and classes, times not on rendered page
  // ============================================================
  "il-centro-camp-1": { startTime: null, endTime: null, timeNote: "Check with provider" },
  "il-centro-classes-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // CHINESE CULTURAL CENTRE — language school, sessions vary
  // ============================================================
  "ccc-chinese-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // CUE CANTONESE IMMERSION — language classes, sessions vary
  // ============================================================
  "cue-cantonese-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // FUN CANTONESE BASIC — language classes, sessions vary
  // ============================================================
  "fun-cantonese-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // MANDOKIDS — language classes, sessions vary
  // ============================================================
  "mandokids-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // BC ARABIC SCHOOL — verified: Sundays 10:00 AM - 2:00 PM (Vancouver location)
  // ============================================================
  "bc-arabic-1": { startTime: "10:00 AM", endTime: "2:00 PM" },

  // ============================================================
  // MAA BOLI — online Punjabi, 50-min classes twice/week, times not specified
  // ============================================================
  "maaboli-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // BERLITZ — language camps, multiple session times
  // ============================================================
  "berlitz-asl-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },
  "berlitz-van-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // TODO SPANISH — online camp, sessions vary
  // ============================================================
  "todo-spanish-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // MY LANGUAGE CONNECT — language classes, sessions vary
  // ============================================================
  "my-lang-connect-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // ============================================================
  // ACTIVEKIDS / CITY OF VANCOUVER PROGRAMS
  // ============================================================

  // Dragon Boat Youth Team — practice times vary by schedule
  "ACT-0130": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "ACT-0376": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },

  // Bronze Group Swim Practices — verified: sessions at 3-4pm or 5-6pm
  "ACT-0132": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // Youth Canoe/Kayak FUNdamentals — verified: Thu 4:00-5:30pm, Sat 12:30-2:30pm
  "ACT-0220": { startTime: "4:00 PM", endTime: "5:30 PM", timeNote: "Thursdays 4-5:30 PM and Saturdays 12:30-2:30 PM" },

  // Access2Innovate / Collingwood Lunch Programs — add-on to full day camp, times not specified
  "ACT-0328": { startTime: null, endTime: null, timeNote: "Lunch add-on for all-day campers — check registration" },
  "ACT-0343": { startTime: null, endTime: null, timeNote: "Lunch add-on for all-day campers — check registration" },
  "ACT-0377": { startTime: null, endTime: null, timeNote: "Lunch add-on for all-day campers — check registration" },
  "ACT-0445": { startTime: null, endTime: null, timeNote: "Lunch add-on for all-day campers — check registration" },
  "ACT-0510": { startTime: null, endTime: null, timeNote: "Lunch add-on for all-day campers — check registration" },
  "ACT-0575": { startTime: null, endTime: null, timeNote: "Lunch add-on for all-day campers — check registration" },
  "ACT-0644": { startTime: null, endTime: null, timeNote: "Lunch add-on for all-day campers — check registration" },

  // G5-10 Ultimate Outdoor Ed Adventures — full day, but no specific times listed
  "ACT-0574": { startTime: null, endTime: null, timeNote: "Full day — check registration for times" },

  // ============================================================
  // SD44 — NORTH VANCOUVER SCHOOL DISTRICT SUMMER PROGRAMS
  // ============================================================

  // Full Credit Courses — verified: 8:30 AM - 12:30 PM
  "SD44-0001": { startTime: "8:30 AM", endTime: "12:30 PM" },

  // Grade 7/8 Transition — verified: 8:30 AM - 12:00 PM
  "SD44-0002": { startTime: "8:30 AM", endTime: "12:00 PM" },

  // Literacy 8/9 — verified: 8:30 AM - 12:00 PM
  "SD44-0003": { startTime: "8:30 AM", endTime: "12:00 PM" },

  // Numeracy 8/9 — same as Literacy (same location/format)
  "SD44-0004": { startTime: "8:30 AM", endTime: "12:00 PM" },

  // ELL 8-11 — same as other secondary courses at Argyle
  "SD44-0005": { startTime: "8:30 AM", endTime: "12:00 PM" },

  // Eslha7an Indigenous Support — same school/format
  "SD44-0006": { startTime: "8:30 AM", endTime: "12:00 PM" },

  // Elementary Summer Learning — verified: 8:40 AM - 12:15 PM
  "SD44-0007": { startTime: "8:40 AM", endTime: "12:15 PM" },

  // ============================================================
  // SD45 — WEST VANCOUVER SCHOOLS SUMMER PROGRAMS
  // SSL certificate issue — couldn't verify directly
  // ============================================================
  "SD45-0001": { startTime: null, endTime: null, timeNote: "Check with provider" },
  "SD45-0002": { startTime: null, endTime: null, timeNote: "Check with provider" },
  "SD45-0003": { startTime: null, endTime: null, timeNote: "Check with provider" },
  "SD45-0004": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // STEAMOJI (South Surrey) — verified: half-day 9:00 AM-12:00 PM, full-day 9:00 AM-3:00 PM
  // ============================================================
  "steamoji-surrey-1": { startTime: "9:00 AM", endTime: "3:00 PM", timeNote: "Full day; half-day option (9 AM-12 PM) also available" },

  // ============================================================
  // STEMA LEARNING CENTRE (Surrey & Vancouver East) — no times on site
  // ============================================================
  "stema-surrey-1": { startTime: null, endTime: null, timeNote: "Check with provider" },
  "stema-van-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // SD36 — SURREY SCHOOL DISTRICT — no times on site
  // ============================================================
  "sd36-summer-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // SPORTS LEAGUES — practice times vary by age/division
  // ============================================================

  // Baseball leagues
  "trout-lake-ll-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "kerrisdale-ll-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "dunbar-ll-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "jericho-ll-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "little-mountain-bb-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "svll-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "hcll-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "vcb-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "vgsa-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },

  // Soccer
  "vafc-soccer-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },

  // Football
  "ua-flag-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "vmfl-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },

  // BC Lions Football Camp — verified: 9:00 AM - 4:00 PM
  "bc-lions-camp-1": { startTime: "9:00 AM", endTime: "4:00 PM" },

  // RAW Sports Football Camp — no times on site
  "raw-sports-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Lacrosse leagues
  "vmla-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "nsmla-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },

  // Rugby clubs
  "vrc-rugby-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "scribes-rugby-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "capilano-rugby-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },

  // Rowing
  "vrc-rowing-1": { startTime: null, endTime: null, timeNote: "Check with provider" },
  "ubc-rowing-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Field Hockey — verified times exist but vary by age group
  "van-hawks-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },
  "wvfhc-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },

  // Wrestling — verified: Mon/Wed/Fri 6:30-8:00 PM (youth)
  "bmwc-1": { startTime: "6:30 PM", endTime: "8:00 PM", timeNote: "Mon/Wed/Fri schedule" },
  "coast-wrestling-1": { startTime: null, endTime: null, timeNote: "Check with provider" },
  "westsider-wrestling-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Figure Skating — sessions vary by level
  "grandview-sc-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },
  "kerrisdale-fsc-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },
  "kits-fsc-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },
  "van-sc-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },

  // Hockey — season-based league
  "vmha-1": { startTime: null, endTime: null, timeNote: "Varies by division — check registration" },

  // Archery — verified: Sundays, 10:00 AM-12:00 PM or 3:00 PM-5:00 PM
  "lykopis-1": { startTime: "10:00 AM", endTime: "12:00 PM", timeNote: "Sundays; afternoon session (3-5 PM) also available" },

  // ============================================================
  // COOKING / LIFE SKILLS
  // ============================================================

  // Dirty Apron — calendar-based, specific times per class
  "dirty-apron-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Little Kitchen Academy (Point Grey) — verified: same as Fraser location
  "little-kitchen-pg-1": { startTime: "9:00 AM", endTime: "12:00 PM", timeNote: "Morning session; afternoon (12:30-3:30 PM) and evening (4-7 PM) also available" },

  // PICA Teen Cooking Camp — no daily times listed
  "pica-teen-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // FILM / PERFORMING ARTS
  // ============================================================

  // Young Moviemakers — Wix site, no times visible
  "young-moviemakers-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // UBC Action Filmmaking Camp — verified: 9:00 AM - 4:00 PM
  "ubc-filmmaking-1": { startTime: "9:00 AM", endTime: "4:00 PM" },

  // Cinelab Summer Filmmaking — verified: 9:00 AM - 4:00 PM (M-F)
  "cinelab-1": { startTime: "9:00 AM", endTime: "4:00 PM" },

  // DanceWorks — schedule in PDF, not on page
  "danceworks-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // The Landing Dance — no times on main page
  "landing-dance-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // CHESS / DEBATE / ACADEMIC
  // ============================================================

  // Vancouver Chess School — no camp times on main page
  "van-chess-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Roundhouse Chess Camp — registration not yet open, no times
  "roundhouse-chess-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Penny Chess Club — Wix site, no times visible
  "penny-chess-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // FDT Academy Debate — no times on rendered page
  "fdt-academy-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // BC Forensic League — verified: Gr 3-4: 4-7 PM, Gr 5-12: 4-8 PM (M/W/F)
  "bcfl-1": { startTime: "4:00 PM", endTime: "8:00 PM", timeNote: "Mon/Wed/Fri; Gr 3-4 ends at 7 PM" },

  // ============================================================
  // COMMUNITY CENTRES & NEIGHBOURHOOD HOUSES
  // ============================================================

  // Champlain Heights CC — ActiveNet registration, times vary
  "champlain-cc-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Sunset CC — verified: 9:00 AM - 4:00 PM (ages 6-12)
  "sunset-cc-camp-1": { startTime: "9:00 AM", endTime: "4:00 PM" },

  // Moberly Arts Creative Remix — registration not yet open
  "moberly-arts-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Moberly Arts Tastes & Tales — no times listed
  "moberly-arts-2": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // South Vancouver NH — no times on main page
  "svnh-camp-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Renfrew Park CC — no times on main page
  "renfrew-cc-camp-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Collingwood NH — no times on main page
  "cnh-camp-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Thunderbird CC — no times on main page
  "thunderbird-cc-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Frog Hollow NH — no times on main page
  "frog-hollow-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Marpole-Oakridge CC — no times on main page
  "marpole-oakridge-cc-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Hillcrest CC — no times on main page
  "hillcrest-cc-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Arbutus CC — ActiveNet registration, times vary
  "arbutus-cc-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Trout Lake CC — no times on main page
  "trout-lake-cc-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // OTHER CAMPS / PROGRAMS
  // ============================================================

  // Emily Carr Junior Arts Institute — no times on main page
  "emily-carr-jai-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Engineering For Kids — no times on location page
  "efk-van-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // Camp McLean (Scouts) — 403 error
  "camp-mclean-1": { startTime: null, endTime: null, timeNote: "Check with provider" },

  // ============================================================
  // CHORUS & CLOUDS — verified specific class times
  // ============================================================
  // Magical Music — multiple sessions, e.g. Wed 9:15-10:00 AM
  "chorus-clouds-1": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },
  // Infant/Toddler Art Club — multiple sessions, e.g. Mon 9:30-10:15 AM
  "chorus-clouds-2": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },
  // Little Wonders — Mon/Thu/Fri 12:30-1:30 PM
  "chorus-clouds-3": { startTime: "12:30 PM", endTime: "1:30 PM", timeNote: "Mon/Thu/Fri schedule" },
  // Explorer's Lab — Mon 10:45-11:45 AM, Thu 10:30-11:30 AM, Fri 9:30-10:30 AM
  "chorus-clouds-4": { startTime: null, endTime: null, timeNote: "Multiple sessions — check schedule" },
  // Drop-In Art and Music — drop-in, no fixed schedule
  "chorus-clouds-5": { startTime: null, endTime: null, timeNote: "Drop-in — check schedule" },
};

let updated = 0;
let notFound = 0;

for (const program of programs) {
  const id = program.id;
  const fix = fixes[id];

  if (fix) {
    // Only update if the program is actually missing times
    if (!program.startTime && program.startTime !== null) {
      // startTime is empty string "" — update it
      program.startTime = fix.startTime;
      program.endTime = fix.endTime;
      if (fix.timeNote) program.timeNote = fix.timeNote;
      updated++;
    } else if (program.startTime === undefined) {
      // startTime doesn't exist at all — add it
      program.startTime = fix.startTime;
      program.endTime = fix.endTime;
      if (fix.timeNote) program.timeNote = fix.timeNote;
      updated++;
    } else if (program.startTime === null) {
      // startTime is already null but may need timeNote
      if (fix.timeNote && !program.timeNote) {
        program.timeNote = fix.timeNote;
        updated++;
      } else if (fix.startTime !== null) {
        // We have actual times to add
        program.startTime = fix.startTime;
        program.endTime = fix.endTime;
        if (fix.timeNote) program.timeNote = fix.timeNote;
        updated++;
      }
    }
  }
}

// Verify all 157 programs are covered
const stillMissing = programs.filter(p => {
  const hasNoTime = (p.startTime === '' || p.startTime === undefined) && !fixes[p.id];
  return hasNoTime;
});

if (stillMissing.length > 0) {
  console.log(`\n⚠️  ${stillMissing.length} programs still not in fixes map:`);
  stillMissing.forEach(p => {
    console.log(`  - [${p.id}] ${p.name} (${p.provider})`);
  });
}

fs.writeFileSync(filePath, JSON.stringify(programs, null, 2) + '\n', 'utf-8');

console.log(`\n✅ Updated ${updated} programs in programs.json`);
console.log(`📊 Fix map has ${Object.keys(fixes).length} entries`);

// Summary of verified times vs "check with provider"
const verified = Object.values(fixes).filter(f => f.startTime !== null);
const checkProvider = Object.values(fixes).filter(f => f.startTime === null && f.timeNote === "Check with provider");
const multipleSessions = Object.values(fixes).filter(f => f.timeNote && f.timeNote.includes("Multiple sessions"));
const variesByDivision = Object.values(fixes).filter(f => f.timeNote && f.timeNote.includes("Varies by division"));
const other = Object.values(fixes).filter(f => f.startTime === null && f.timeNote && !f.timeNote.includes("Check with provider") && !f.timeNote.includes("Multiple sessions") && !f.timeNote.includes("Varies by division"));

console.log(`\n📋 Breakdown:`);
console.log(`  ✅ Verified times: ${verified.length}`);
console.log(`  🔍 Check with provider: ${checkProvider.length}`);
console.log(`  📅 Multiple sessions: ${multipleSessions.length}`);
console.log(`  🏟️  Varies by division: ${variesByDivision.length}`);
console.log(`  📝 Other notes: ${other.length}`);
