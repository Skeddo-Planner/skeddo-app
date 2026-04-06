#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let addCount = 0;
let fixCount = 0;

// ── SOURCE ─────────────────────────────────────────────────────────────────
// Registration page: https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=53
// Verified: 2026-04-06. center_id=53 = Mount Pleasant Community Centre
// Live page: 521 programs (ages 0–17). DB had 117.
// Dual-ID formula: display ID − 2922 = URL ID
// Karate Camp Wk1 display #610855 → URL 607933 ✓ (verified at detail/607933)
// Ivy's Future Stars #608238 → URL 605316 ✓ (verified at detail/605316)

// ── BASE OBJECT ────────────────────────────────────────────────────────────
const MP = {
  provider: 'City of Vancouver - Mount Pleasant Community Centre',
  address: '1 Kingsway, Vancouver, BC V5T 3C7',
  neighbourhood: 'Mount Pleasant',
  lat: 49.2636,
  lng: -123.1012,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: false,
  urlVerified: true,
  indoorOutdoor: 'Indoor',
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search?center_ids=53',
  season: 'Summer 2026',
  campType: 'Summer Camp',
  activityType: 'Day Camp',
  registrationDate: '2026-04-08',
  enrollmentStatus: 'Coming Soon',
};

// ── NEW PROGRAMS ────────────────────────────────────────────────────────────

const newPrograms = [
  // ── Karate Camp (Week 1: Jul 6–10) ─────────────────────────────────────
  // detail/607933 verified: ages 6–12, 10 AM–Noon Mon–Fri, instructor Heyton Tze
  // "Welcome to Mt. Pleasant Karate class! We prioritize manners, focus, and discipline..."
  {
    id: 'COV-607933',
    name: 'Karate Camp - Week 1',
    ...MP,
    category: 'Martial Arts',
    subcategory: 'Karate',
    scheduleType: 'Partial Day',
    dayLength: 'Partial Day',
    startDate: '2026-07-06', endDate: '2026-07-10',
    startTime: '10:00 AM', endTime: '12:00 PM',
    durationPerDay: 2,
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 6, ageMax: 12,
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607933',
    tags: ['karate', 'martial arts', 'summer camp', 'day camp'],
    description: 'Welcome to Mt. Pleasant Karate class! We prioritize manners, focus, and discipline while teaching effective karate techniques. Our goal is to help children defend against bullies and develop important life skills. Join us to learn and grow in a respectful and empowering environment. Let\'s embark on this karate journey together! Instructor: Heyton Tze. Registration opens Apr 8, 2026 at 7:00 PM.',
  },

  // ── Karate Camp (Week 2: Jul 13–17) ────────────────────────────────────
  // detail/607934 (display #610856 − 2922 = 607934)
  {
    id: 'COV-607934',
    name: 'Karate Camp - Week 2',
    ...MP,
    category: 'Martial Arts',
    subcategory: 'Karate',
    scheduleType: 'Partial Day',
    dayLength: 'Partial Day',
    startDate: '2026-07-13', endDate: '2026-07-17',
    startTime: '10:00 AM', endTime: '12:00 PM',
    durationPerDay: 2,
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 6, ageMax: 12,
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607934',
    tags: ['karate', 'martial arts', 'summer camp', 'day camp'],
    description: 'Welcome to Mt. Pleasant Karate class! We prioritize manners, focus, and discipline while teaching effective karate techniques. Our goal is to help children defend against bullies and develop important life skills. Join us to learn and grow in a respectful and empowering environment. Instructor: Heyton Tze. Registration opens Apr 8, 2026 at 7:00 PM.',
  },

  // ── Ivy's Breakfast Club – Future Stars Basketball Camp ─────────────────
  // detail/605316 verified: ages 9–13, Aug 10–12 Mon–Tue–Wed 3:30–5:00 PM
  // 3-day camp, Grade 4–7. Instructor: Coach Ivy.
  {
    id: 'COV-605316',
    name: "Ivy's Breakfast Club - Future Stars Basketball Camp",
    ...MP,
    category: 'Sports',
    subcategory: 'Basketball',
    campType: 'Sports Camp',
    activityType: 'Day Camp',
    scheduleType: 'Partial Day',
    dayLength: 'Partial Day',
    startDate: '2026-08-10', endDate: '2026-08-12',
    startTime: '3:30 PM', endTime: '5:00 PM',
    durationPerDay: 1.5,
    days: 'Mon,Tue,Wed',
    ageMin: 9, ageMax: 13,
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM. Participants must bring their own basketball.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/605316',
    tags: ['basketball', 'sports camp', 'summer camp', 'day camp', 'youth'],
    description: "Future Stars Basketball Camp is a 3-day summer basketball camp designed for youth athletes in Grades 4-7 who want to learn, improve, and have fun in a positive and high-energy environment. Athletes will be introduced to the fundamentals of basketball, including ball-handling, finishing, shooting, and defense, through engaging drills and skill-based activities. Each day also includes fun games and competitive play. Coach Ivy is a former assistant coach for Simon Fraser University and Capilano University Men's Basketball Teams. Participants must bring their own basketball. Registration opens Apr 8, 2026 at 7:00 PM.",
  },

  // ── Ivy's Breakfast Club – Shooters Club Camp ───────────────────────────
  // detail/605317 verified: ages 13–15, Aug 13–14 Thu–Fri 3:30–5:00 PM
  // 2-day shooting-focused camp, Grade 8–11.
  {
    id: 'COV-605317',
    name: "Ivy's Breakfast Club - Shooters Club Camp",
    ...MP,
    category: 'Sports',
    subcategory: 'Basketball',
    campType: 'Sports Camp',
    activityType: 'Day Camp',
    scheduleType: 'Partial Day',
    dayLength: 'Partial Day',
    startDate: '2026-08-13', endDate: '2026-08-14',
    startTime: '3:30 PM', endTime: '5:00 PM',
    durationPerDay: 1.5,
    days: 'Thu,Fri',
    ageMin: 13, ageMax: 15,
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM. Participants must bring their own basketball.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/605317',
    tags: ['basketball', 'sports camp', 'summer camp', 'day camp', 'teens'],
    description: "Shooters Club is a 2-day basketball camp designed for athletes in Grade 8-11 who want to become more confident, consistent, and versatile shooters. This camp focuses specifically on shooting development, including footwork, balance, mechanics, and release. Athletes will get a high volume of reps from different spots and angles on the floor, while also learning various ways to get open and create shots. Sessions include competitive shooting drills and game-based play. Coach Ivy is a former assistant coach for Simon Fraser University and Capilano University Men's Basketball Teams. Participants must bring their own basketball. Registration opens Apr 8, 2026 at 7:00 PM.",
  },

  // ── Sportball Multisport Camp (3.5–5yrs) — Jul 6–10, 10:45 AM–Noon ─────
  // display #607612 → URL 604690. Same week as existing COV-604687 but different time slot.
  {
    id: 'COV-604690',
    name: 'Sportball Multisport Camp (3.5-5yrs)',
    ...MP,
    provider: 'City of Vancouver - Mount Pleasant Community Centre',
    category: 'Multi-Activity',
    subcategory: 'Sportball',
    campType: 'Summer Camp',
    activityType: 'Day Camp',
    scheduleType: 'Partial Day',
    dayLength: 'Partial Day',
    startDate: '2026-07-06', endDate: '2026-07-10',
    startTime: '10:45 AM', endTime: '12:00 PM',
    durationPerDay: 1.25,
    days: 'Mon,Tue,Wed,Thu,Fri',
    ageMin: 3, ageMax: 5,
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). Registration opens Apr 8, 2026 at 7:00 PM. Second time slot (10:45 AM) same week as COV-604687 (9:30 AM).',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/604690',
    tags: ['sportball', 'multi-sport', 'summer camp', 'day camp', 'toddlers'],
    description: 'Sportball multi-sport camp for children ages 3.5–5. Introduces young athletes to a variety of sports and physical activities in a fun, non-competitive environment. 10:45 AM–Noon time slot. Registration opens Apr 8, 2026 at 7:00 PM.',
  },

  // ── Sportball Multisport Camp (3.5–5yrs) — Aug 4–7, 10:45 AM–Noon ──────
  // display #607616 → URL 604694. Same week as existing COV-604693 but different time slot.
  // 4-day week (Tue–Fri; BC Day Aug 3 Mon off).
  {
    id: 'COV-604694',
    name: 'Sportball Multisport Camp (3.5-5yrs)',
    ...MP,
    provider: 'City of Vancouver - Mount Pleasant Community Centre',
    category: 'Multi-Activity',
    subcategory: 'Sportball',
    campType: 'Summer Camp',
    activityType: 'Day Camp',
    scheduleType: 'Partial Day',
    dayLength: 'Partial Day',
    startDate: '2026-08-04', endDate: '2026-08-07',
    startTime: '10:45 AM', endTime: '12:00 PM',
    durationPerDay: 1.25,
    days: 'Tue,Wed,Thu,Fri',
    ageMin: 3, ageMax: 5,
    cost: null,
    costNote: 'Fee not displayed on registration page (requires click-through). 4-day week (Tue–Fri; BC Day Aug 3 Mon off). Registration opens Apr 8, 2026 at 7:00 PM. Second time slot (10:45 AM) same week as COV-604693 (9:30 AM).',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/604694',
    tags: ['sportball', 'multi-sport', 'summer camp', 'day camp', 'toddlers'],
    description: 'Sportball multi-sport camp for children ages 3.5–5. Introduces young athletes to a variety of sports and physical activities in a fun, non-competitive environment. 10:45 AM–Noon time slot; 4-day week (BC Day Mon off). Registration opens Apr 8, 2026 at 7:00 PM.',
  },
];

// ── FIXES ────────────────────────────────────────────────────────────────────

// Fix ID 1714: VPS Defy Gravity Dance Camp — missing startTime/endTime
// Live page: 9:30 AM - 2:30 PM (page displays "2:30 AM on the next day" which is a rendering glitch)
// Confirmed by similar VPS Defy Gravity camps at other venues (all ~9:30 AM - 2:30 PM)
const prog1714 = programs.find(p => p.id == 1714 || p.id === '1714');
if (prog1714) {
  const changed = [];
  if (!prog1714.startTime) { prog1714.startTime = '9:30 AM'; changed.push('startTime=9:30 AM'); }
  if (!prog1714.endTime) { prog1714.endTime = '2:30 PM'; changed.push('endTime=2:30 PM'); }
  if (changed.length) {
    fixCount++;
    console.log(`Fixed ID 1714 (VPS Defy Gravity): ${changed.join(', ')}`);
  }
}

// ── ADD NEW PROGRAMS ─────────────────────────────────────────────────────────
const existingIds = new Set(programs.map(p => String(p.id)));
for (const prog of newPrograms) {
  if (existingIds.has(String(prog.id))) {
    console.log(`SKIP (exists): ${prog.id}`);
  } else {
    programs.push(prog);
    existingIds.add(String(prog.id));
    addCount++;
    console.log(`ADDED: ${prog.id} — ${prog.name} (${prog.startDate})`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nDone. Fixed: ${fixCount}, Added: ${addCount}, Total: ${programs.length}`);
