#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let fixCount = 0;
let addCount = 0;

// ── 1. STATUS / AGE FIXES ─────────────────────────────────────────────────────

// After Care weeks 1–4: wrong status (Open → Coming Soon) + wrong ageMax (13 → 12)
// Live page: "Age at least 6 yrs but less than 13 yrs" → ageMax=12; reg opens Apr 8
const afterCareIds = ['COV-599622', 'COV-599623', 'COV-599624', 'COV-599625'];
for (const prog of programs) {
  if (afterCareIds.includes(String(prog.id))) {
    let changed = false;
    if (prog.enrollmentStatus !== 'Coming Soon') {
      prog.enrollmentStatus = 'Coming Soon';
      changed = true;
    }
    if (!prog.registrationDate) {
      prog.registrationDate = '2026-04-08';
      changed = true;
    }
    if (prog.ageMax === 13) {
      prog.ageMax = 12;
      changed = true;
    }
    if (changed) {
      fixCount++;
      console.log(`Fixed: ${prog.id} — ${prog.name}`);
    }
  }
}

// Mini Hip Hop Playground (4-6yrs): Open → Coming Soon (reg opens Apr 8)
for (const prog of programs) {
  if (prog.id === 'COV-607889' && prog.enrollmentStatus === 'Open') {
    prog.enrollmentStatus = 'Coming Soon';
    prog.registrationDate = '2026-04-08';
    fixCount++;
    console.log(`Fixed: ${prog.id} — ${prog.name}`);
  }
}

// ── BASE OBJECTS ──────────────────────────────────────────────────────────────
const WECC = {
  provider: 'City of Vancouver - West End Cmty Centre',
  address: '870 Denman Street, Vancouver, BC',
  neighbourhood: 'West End',
  lat: 49.2902044,
  lng: -123.1362511,
  city: 'Vancouver',
  confirmed2026: true,
  priceVerified: true,
  urlVerified: true,
  indoorOutdoor: 'Indoor',
  url: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search',
};

const SPRING = {
  ...WECC,
  season: 'Spring 2026',
  campType: 'Spring Program',
  scheduleType: 'Activity',
  dayLength: 'Single Day',
  registrationDate: null,
  enrollmentStatus: 'Open',
  repeating: 'weekly',
};

const SPORTBALL_BASE = {
  ...SPRING,
  category: 'Sports',
  activityType: 'Multi-Sport',
  tags: ['sportball', 'sports', 'kids'],
};

const SUMMER_SPORTBALL = {
  ...WECC,
  season: 'Summer 2026',
  campType: 'Summer Camp',
  category: 'Sports',
  activityType: 'Multi-Sport',
  scheduleType: 'Half Day',
  dayLength: 'Half Day',
  days: 'Mon,Tue,Wed,Thu,Fri',
  startTime: '1:00 PM',
  endTime: '4:00 PM',
  durationPerDay: 3.0,
  registrationDate: '2026-04-08',
  enrollmentStatus: 'Coming Soon',
  tags: ['sportball', 'sports', 'summer camp'],
};

// ── 2. NEW PROGRAMS ───────────────────────────────────────────────────────────
const newPrograms = [

  // ── DROP-IN / PLAYTIME ────────────────────────────────────────────────────
  {
    id: 'COV-605430',
    name: 'Baby Playtime',
    ...WECC,
    season: 'Spring 2026',
    campType: 'Spring Program',
    scheduleType: 'Drop-In',
    dayLength: 'Single Day',
    registrationDate: null,
    enrollmentStatus: 'Open',
    ageMin: 0, ageMax: 1,
    startDate: '2026-04-01', endDate: '2026-06-30',
    days: 'Mon,Tue,Wed,Thu,Fri',
    startTime: '9:30 AM', endTime: '2:00 PM',
    durationPerDay: null,
    cost: 3.50,
    costNote: '$3.50 drop-in. Mon/Wed/Fri 12:30–2:00 PM; Tue/Thu 9:30–11:30 AM. Parent participation required. No sessions: Apr 3, 6, May 18.',
    description: 'Drop-in playtime with toys, balls and more. Parents are required to help set up and clean up equipment each day. Parent participation required. For babies less than 2 years.',
    category: 'Social',
    activityType: 'Drop-In',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/605430',
    tags: ['baby', 'infant', 'drop-in', 'parent', 'playtime'],
    repeating: null,
  },
  {
    id: 'COV-605444',
    name: 'Jumbo Playtime (3-5yrs)',
    ...WECC,
    season: 'Spring 2026',
    campType: 'Spring Program',
    scheduleType: 'Drop-In',
    dayLength: 'Single Day',
    registrationDate: null,
    enrollmentStatus: 'Full/Waitlist',
    ageMin: 3, ageMax: 5,
    startDate: '2026-04-04', endDate: '2026-06-27',
    days: 'Sat',
    startTime: '9:30 AM', endTime: '11:00 AM',
    durationPerDay: 1.5,
    cost: 3.50,
    costNote: '$3.50 drop-in. Weekly Sat, Apr 4–Jun 27. Currently full.',
    description: 'Drop-in active play for children ages 3–5. Large equipment, balls and gym activities in a fun, supervised environment. Parent participation may be required.',
    category: 'Social',
    activityType: 'Drop-In',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/605444',
    tags: ['playtime', 'preschool', 'drop-in', 'kids'],
    repeating: 'weekly',
  },

  // ── BABY / INFANT ─────────────────────────────────────────────────────────
  {
    id: 'COV-603895',
    name: 'Baby Sign Language (Birth-24 months)',
    ...SPRING,
    ageMin: 0, ageMax: 2,
    startDate: '2026-05-19', endDate: '2026-06-16',
    days: 'Tue',
    startTime: '10:30 AM', endTime: '11:15 AM',
    durationPerDay: 0.75,
    cost: 77,
    costNote: '$77.00 for 5 sessions (weekly Tue, May 19–Jun 16). One parent/caregiver per child. Bring mat or blanket.',
    description: 'Using songs and games, learn how to teach your baby basic American Sign Language (ASL) so they can better convey their wants and needs. Research shows babies who learn sign language learn quicker and talk earlier. For newborns to 24 months with caregiver.',
    category: 'Education',
    activityType: 'Language',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/603895',
    tags: ['sign language', 'baby', 'infant', 'language', 'education', 'caregiver'],
  },

  // ── DANCE / PERFORMING ARTS ───────────────────────────────────────────────
  {
    id: 'COV-604173',
    name: 'Ballet / Jazz Fusion (4-7yrs)',
    ...SPRING,
    ageMin: 4, ageMax: 7,
    startDate: '2026-04-12', endDate: '2026-06-21',
    days: 'Sun',
    startTime: '12:45 PM', endTime: '1:30 PM',
    durationPerDay: 0.75,
    cost: 154,
    costNote: '$154.00 for 11 sessions (weekly Sun, Apr 12–Jun 21). Drop-in $15. Children must participate without a parent in the room.',
    description: 'Children learn the fundamentals of both ballet and jazz dance while developing their own creative expression. The dancer\'s mobility, balance, and coordination will be improved in this fun and welcoming program. Instructed by Endorphin Rush Dance (Kirby Snell Dance). Children must participate without a parent.',
    category: 'Performing Arts',
    activityType: 'Dance',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/604173',
    tags: ['dance', 'ballet', 'jazz', 'kids', 'performing arts'],
  },
  {
    id: 'COV-604177',
    name: 'Dance Extreme (6-12yrs)',
    ...SPRING,
    ageMin: 6, ageMax: 12,
    startDate: '2026-04-12', endDate: '2026-06-21',
    days: 'Sun',
    startTime: '1:35 PM', endTime: '2:35 PM',
    durationPerDay: 1.0,
    cost: 165,
    costNote: '$165.00 for 11 sessions (weekly Sun, Apr 12–Jun 21). Drop-in $16. Styles include Latin, Afro, Hip Hop, Acrobatic, Creative Movement and Bollywood.',
    description: 'Explore a number of different styles of dance with a variety of guest dance artists. Enjoy an energetic exploration of movement in a warm, safe and inspiring environment. Styles may include Latin Dance, Afro, Hip Hop, Acrobatic Dance, Creative Movement and Bollywood. Instructed by Endorphin Rush Dance.',
    category: 'Performing Arts',
    activityType: 'Dance',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/604177',
    tags: ['dance', 'hip hop', 'latin', 'kids', 'performing arts'],
  },
  {
    id: 'COV-604179',
    name: 'Hip Hop (4-7yrs)',
    ...SPRING,
    ageMin: 4, ageMax: 7,
    startDate: '2026-04-12', endDate: '2026-06-21',
    days: 'Sun',
    startTime: '11:40 AM', endTime: '12:25 PM',
    durationPerDay: 0.75,
    cost: 154,
    costNote: '$154.00 for 11 sessions (weekly Sun, Apr 12–Jun 21). Instructed by Endorphin Rush Dance.',
    description: 'High-energy hip hop dance class for children ages 4–7. Develops rhythm, coordination and self-expression in a fun, welcoming environment. Instructed by Endorphin Rush Dance (Kirby Snell Dance).',
    category: 'Performing Arts',
    activityType: 'Dance',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/604179',
    tags: ['dance', 'hip hop', 'kids', 'performing arts'],
  },
  {
    id: 'COV-603890',
    name: 'Hip Hop (8-10yrs)',
    ...SPRING,
    ageMin: 8, ageMax: 10,
    startDate: '2026-04-09', endDate: '2026-06-11',
    days: 'Thu',
    startTime: '4:00 PM', endTime: '5:00 PM',
    durationPerDay: 1.0,
    cost: 150,
    costNote: '$150.00 for 10 sessions (weekly Thu, Apr 9–Jun 11). Instructed by Endorphin Rush Dance.',
    description: 'High-energy hip hop dance class for children ages 8–10. Develops rhythm, coordination and self-expression in a fun, welcoming environment. Instructed by Endorphin Rush Dance (Kirby Snell Dance).',
    category: 'Performing Arts',
    activityType: 'Dance',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/603890',
    tags: ['dance', 'hip hop', 'kids', 'performing arts'],
  },

  // ── ARTS & CRAFTS ─────────────────────────────────────────────────────────
  {
    id: 'COV-606019',
    name: 'Kids Clay (5-8yrs) — Wednesday',
    ...SPRING,
    enrollmentStatus: 'Full/Waitlist',
    ageMin: 5, ageMax: 8,
    startDate: '2026-04-08', endDate: '2026-06-17',
    days: 'Wed',
    startTime: '3:30 PM', endTime: '4:45 PM',
    durationPerDay: 1.25,
    cost: 242,
    costNote: '$242.00 for 11 sessions (weekly Wed, Apr 8–Jun 17). Currently full — waitlist available. Clay and tools included.',
    description: 'Hands-on introduction to clay, learning basic techniques of slab making, coiling, sculpture, pinch pots and more. Make projects like flower pots, pet bowls, lanterns, window chimes, beads and fridge magnets. Clay and tools are included.',
    category: 'Arts & Crafts',
    activityType: 'Visual Arts',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/606019',
    tags: ['clay', 'pottery', 'arts', 'crafts', 'kids'],
  },
  {
    id: 'COV-606027',
    name: 'Kids Clay (9-15yrs)',
    ...SPRING,
    enrollmentStatus: 'Full/Waitlist',
    ageMin: 9, ageMax: 14,
    startDate: '2026-04-09', endDate: '2026-06-18',
    days: 'Thu',
    startTime: '5:00 PM', endTime: '6:15 PM',
    durationPerDay: 1.25,
    cost: 242,
    costNote: '$242.00 for 11 sessions (weekly Thu, Apr 9–Jun 18). Currently full — waitlist available. Clay and tools included. Age restriction: up to 14y 11m (program name says 15 but live registration restricts to less than 15y).',
    description: 'Hands-on introduction to clay for older youth, learning basic techniques of slab making, coiling, sculpture, pinch pots and more. Make projects like flower pots, pet bowls, lanterns, window chimes, beads and fridge magnets. Clay and tools are included.',
    category: 'Arts & Crafts',
    activityType: 'Visual Arts',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/606027',
    tags: ['clay', 'pottery', 'arts', 'crafts', 'youth'],
  },

  // ── DISNEY ANIMATOR PROGRAMS ──────────────────────────────────────────────
  {
    id: 'COV-607066',
    name: 'Cartoon with Disney Animator (5-8yrs) - Set 1',
    ...SPRING,
    ageMin: 5, ageMax: 8,
    startDate: '2026-04-10', endDate: '2026-05-15',
    days: 'Fri',
    startTime: '4:25 PM', endTime: '5:25 PM',
    durationPerDay: 1.0,
    cost: 100,
    costNote: '$100.00 for 5 sessions (weekly Fri, Apr 10–May 15). Instructed by Happy Kids Studios (former Disney animator).',
    description: 'Learn to tell stories through drawings by working on character development, thumbnails, layout pages, panelling and more. Instructed by a former Disney animator from Happy Kids Studios.',
    category: 'Arts & Crafts',
    activityType: 'Visual Arts',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607066',
    tags: ['drawing', 'cartoon', 'animation', 'Disney', 'kids', 'arts'],
  },
  {
    id: 'COV-607085',
    name: 'Cartoon with Disney Animator (5-8yrs) - Set 2',
    ...SPRING,
    ageMin: 5, ageMax: 8,
    startDate: '2026-05-22', endDate: '2026-06-26',
    days: 'Fri',
    startTime: '4:25 PM', endTime: '5:25 PM',
    durationPerDay: 1.0,
    cost: 100,
    costNote: '$100.00 for 5 sessions (weekly Fri, May 22–Jun 26). Instructed by Happy Kids Studios (former Disney animator).',
    description: 'Learn to tell stories through drawings by working on character development, thumbnails, layout pages, panelling and more. Instructed by a former Disney animator from Happy Kids Studios.',
    category: 'Arts & Crafts',
    activityType: 'Visual Arts',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607085',
    tags: ['drawing', 'cartoon', 'animation', 'Disney', 'kids', 'arts'],
  },
  {
    id: 'COV-607098',
    name: 'Character Design with Disney Animator (9-12yrs) - Set 1',
    ...SPRING,
    ageMin: 9, ageMax: 12,
    startDate: '2026-04-10', endDate: '2026-05-15',
    days: 'Fri',
    startTime: '5:35 PM', endTime: '6:35 PM',
    durationPerDay: 1.0,
    cost: 100,
    costNote: '$100.00 for 5 sessions (weekly Fri, Apr 10–May 15). Instructed by Happy Kids Studios (former Disney animator).',
    description: 'Learn advanced character design techniques including character development, expression sheets, turnarounds and more. Instructed by a former Disney animator from Happy Kids Studios.',
    category: 'Arts & Crafts',
    activityType: 'Visual Arts',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607098',
    tags: ['drawing', 'character design', 'animation', 'Disney', 'youth', 'arts'],
  },
  {
    id: 'COV-607109',
    name: 'Character Design with Disney Animator (9-12yrs) - Set 2',
    ...SPRING,
    ageMin: 9, ageMax: 12,
    startDate: '2026-05-22', endDate: '2026-06-26',
    days: 'Fri',
    startTime: '5:35 PM', endTime: '6:35 PM',
    durationPerDay: 1.0,
    cost: 100,
    costNote: '$100.00 for 5 sessions (weekly Fri, May 22–Jun 26). Instructed by Happy Kids Studios (former Disney animator).',
    description: 'Learn advanced character design techniques including character development, expression sheets, turnarounds and more. Instructed by a former Disney animator from Happy Kids Studios.',
    category: 'Arts & Crafts',
    activityType: 'Visual Arts',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607109',
    tags: ['drawing', 'character design', 'animation', 'Disney', 'youth', 'arts'],
  },

  // ── SPORTBALL — FLOOR HOCKEY ──────────────────────────────────────────────
  {
    id: 'COV-603836',
    name: 'Sportball Floor Hockey (4-6yrs) - Set 1',
    ...SPORTBALL_BASE,
    ageMin: 4, ageMax: 6,
    startDate: '2026-04-09', endDate: '2026-05-14',
    days: 'Thu',
    startTime: '3:45 PM', endTime: '4:30 PM',
    durationPerDay: 0.75,
    cost: 285,
    costNote: '$285.00 for 6 sessions (weekly Thu, Apr 9–May 14). Instructed by Sportball Vancouver.',
    description: 'Introduces fundamental concepts of floor hockey gameplay and teaches basic skills like shooting, stick handling, and passing in fun, skill-focused games. Supportive, non-competitive environment. Instructed by Sportball Vancouver.',
    activityType: 'Floor Hockey',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/603836',
  },
  {
    id: 'COV-603839',
    name: 'Sportball Floor Hockey (4-6yrs) - Set 2',
    ...SPORTBALL_BASE,
    ageMin: 4, ageMax: 6,
    startDate: '2026-05-21', endDate: '2026-06-25',
    days: 'Thu',
    startTime: '3:45 PM', endTime: '4:30 PM',
    durationPerDay: 0.75,
    cost: 114,
    costNote: '$114.00 for 6 sessions (weekly Thu, May 21–Jun 25). Instructed by Sportball Vancouver.',
    description: 'Introduces fundamental concepts of floor hockey gameplay and teaches basic skills like shooting, stick handling, and passing in fun, skill-focused games. Supportive, non-competitive environment. Instructed by Sportball Vancouver.',
    activityType: 'Floor Hockey',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/603839',
  },
  {
    id: 'COV-603840',
    name: 'Sportball Floor Hockey (6-9yrs) - Set 1',
    ...SPORTBALL_BASE,
    ageMin: 6, ageMax: 9,
    startDate: '2026-04-09', endDate: '2026-05-14',
    days: 'Thu',
    startTime: '4:30 PM', endTime: '5:15 PM',
    durationPerDay: 0.75,
    cost: 114,
    costNote: '$114.00 for 6 sessions (weekly Thu, Apr 9–May 14). Instructed by Sportball Vancouver.',
    description: 'Introduces fundamental concepts of floor hockey gameplay and teaches basic skills like shooting, stick handling, and passing in fun, skill-focused games. Supportive, non-competitive environment. Instructed by Sportball Vancouver.',
    activityType: 'Floor Hockey',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/603840',
  },
  {
    id: 'COV-603843',
    name: 'Sportball Floor Hockey (6-9yrs) - Set 2',
    ...SPORTBALL_BASE,
    ageMin: 6, ageMax: 9,
    startDate: '2026-05-21', endDate: '2026-06-25',
    days: 'Thu',
    startTime: '4:30 PM', endTime: '5:15 PM',
    durationPerDay: 0.75,
    cost: 114,
    costNote: '$114.00 for 6 sessions (weekly Thu, May 21–Jun 25). Instructed by Sportball Vancouver.',
    description: 'Introduces fundamental concepts of floor hockey gameplay and teaches basic skills like shooting, stick handling, and passing in fun, skill-focused games. Supportive, non-competitive environment. Instructed by Sportball Vancouver.',
    activityType: 'Floor Hockey',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/603843',
  },

  // ── SPORTBALL — MULTISPORT ────────────────────────────────────────────────
  {
    id: 'COV-603850',
    name: 'Sportball Multisport (3.5-5yrs) - Set 2',
    ...SPORTBALL_BASE,
    ageMin: 3, ageMax: 5,
    startDate: '2026-05-25', endDate: '2026-06-22',
    days: 'Mon',
    startTime: '3:30 PM', endTime: '4:30 PM',
    durationPerDay: 1.0,
    cost: 95,
    costNote: '$95.00 for 5 sessions (weekly Mon, May 25–Jun 22). Instructed by Sportball Vancouver.',
    description: 'Multi-sport program introducing children to various sports through age-appropriate drills and games. Develops fundamental movement skills in a fun, non-competitive environment. Instructed by Sportball Vancouver.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/603850',
  },
  {
    id: 'COV-603851',
    name: 'Sportball Multisport (5-8yrs) - Set 1',
    ...SPORTBALL_BASE,
    ageMin: 5, ageMax: 8,
    startDate: '2026-04-13', endDate: '2026-05-11',
    days: 'Mon',
    startTime: '4:30 PM', endTime: '5:30 PM',
    durationPerDay: 1.0,
    cost: 95,
    costNote: '$95.00 for 5 sessions (weekly Mon, Apr 13–May 11). Instructed by Sportball Vancouver.',
    description: 'Multi-sport program introducing children to various sports through age-appropriate drills and games. Develops fundamental movement skills in a fun, non-competitive environment. Instructed by Sportball Vancouver.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/603851',
  },
  {
    id: 'COV-603852',
    name: 'Sportball Multisport (5-8yrs) - Set 2',
    ...SPORTBALL_BASE,
    ageMin: 5, ageMax: 8,
    startDate: '2026-05-25', endDate: '2026-06-22',
    days: 'Mon',
    startTime: '4:30 PM', endTime: '5:30 PM',
    durationPerDay: 1.0,
    cost: 95,
    costNote: '$95.00 for 5 sessions (weekly Mon, May 25–Jun 22). Instructed by Sportball Vancouver.',
    description: 'Multi-sport program introducing children to various sports through age-appropriate drills and games. Develops fundamental movement skills in a fun, non-competitive environment. Instructed by Sportball Vancouver.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/603852',
  },

  // ── SPORTBALL — T-BALL & BASEBALL ────────────────────────────────────────
  {
    id: 'COV-607842',
    name: 'Sportball Parent & Tot T-Ball (2-3yrs)',
    ...SPRING,
    category: 'Sports',
    activityType: 'Baseball',
    enrollmentStatus: 'Full/Waitlist',
    ageMin: 2, ageMax: 3,
    startDate: '2026-05-10', endDate: '2026-06-28',
    days: 'Sun',
    startTime: '9:30 AM', endTime: '10:15 AM',
    durationPerDay: 0.75,
    cost: 133,
    costNote: '$133.00 for 8 sessions (weekly Sun, May 10–Jun 28). Registration closed (full). Parent participation required. Instructed by Sportball Vancouver.',
    description: 'Parent and tot t-ball program introducing young children to the basics of hitting, throwing and catching in a fun, supportive environment. Parent participation required. Instructed by Sportball Vancouver.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607842',
    tags: ['sportball', 'baseball', 't-ball', 'parent', 'tot', 'sports'],
  },
  {
    id: 'COV-607843',
    name: 'Sportball Indoor Baseball (7-9yrs)',
    ...SPRING,
    category: 'Sports',
    activityType: 'Baseball',
    enrollmentStatus: 'Full/Waitlist',
    ageMin: 7, ageMax: 9,
    startDate: '2026-05-10', endDate: '2026-06-28',
    days: 'Sun',
    startTime: '11:15 AM', endTime: '12:15 PM',
    durationPerDay: 1.0,
    cost: 133,
    costNote: '$133.00 for 8 sessions (weekly Sun, May 10–Jun 28). Registration closed (full). Instructed by Sportball Vancouver.',
    description: 'Indoor baseball program teaching throwing and catching, field goals, snapping and footwork in fun, exciting skill-focused play. Supportive, non-competitive environment. Instructed by Sportball Vancouver.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/607843',
    tags: ['sportball', 'baseball', 'sports', 'kids'],
  },

  // ── SPORTBALL — SUMMER CAMPS ─────────────────────────────────────────────
  {
    id: 'COV-616223',
    name: 'Sportball Floor Hockey Camp (5-8yrs)',
    ...SUMMER_SPORTBALL,
    ageMin: 5, ageMax: 8,
    startDate: '2026-07-06', endDate: '2026-07-10',
    cost: 285,
    costNote: '$285.00 for 5 sessions (Mon–Fri, Jul 6–10). Registration opens Apr 8. Bring nut-free snack and water bottle. Instructed by Sportball Vancouver.',
    description: 'Floor hockey camp introducing fundamental concepts of gameplay and basic skills like shooting, positioning, stick handling and goal tending. Also includes football skills. Bring a nut-free snack and labelled water bottle.',
    activityType: 'Floor Hockey',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616223',
  },
  {
    id: 'COV-616224',
    name: 'Sportball Floor Hockey Camp (9-12yrs)',
    ...SUMMER_SPORTBALL,
    ageMin: 9, ageMax: 12,
    startDate: '2026-07-27', endDate: '2026-07-31',
    cost: 285,
    costNote: '$285.00 for 5 sessions (Mon–Fri, Jul 27–31). Registration opens Apr 8. Instructed by Sportball Vancouver.',
    description: 'Floor hockey camp introducing fundamental concepts of gameplay and basic skills like shooting, positioning, stick handling and goal tending. Also includes football skills. Supportive, non-competitive environment.',
    activityType: 'Floor Hockey',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616224',
  },
  {
    id: 'COV-616225',
    name: 'Sportball Multi-Sport Camp (5-8yrs)',
    ...SUMMER_SPORTBALL,
    ageMin: 5, ageMax: 8,
    startDate: '2026-08-04', endDate: '2026-08-07',
    days: 'Tue,Wed,Thu,Fri',
    cost: 228,
    costNote: '$228.00 for 4 sessions (Tue–Fri, Aug 4–7; BC Day Aug 3 holiday, no class Mon). Registration opens Apr 8. Instructed by Sportball Vancouver.',
    description: 'Multi-sport day camp introducing children to a variety of sports through fun, skill-focused games and activities. Develops fundamental movement skills in a supportive, non-competitive environment.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616225',
  },
  {
    id: 'COV-616226',
    name: 'Sportball Multi-Sport Camp (9-12yrs)',
    ...SUMMER_SPORTBALL,
    ageMin: 9, ageMax: 12,
    startDate: '2026-08-17', endDate: '2026-08-21',
    cost: 285,
    costNote: '$285.00 for 5 sessions (Mon–Fri, Aug 17–21). Registration opens Apr 8. Instructed by Sportball Vancouver.',
    description: 'Multi-sport day camp introducing older youth to a variety of sports through fun, skill-focused games and activities. Develops fundamental movement skills in a supportive, non-competitive environment.',
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/616226',
  },
];

const existingIds = new Set(programs.map(p => String(p.id)));
for (const prog of newPrograms) {
  if (existingIds.has(String(prog.id))) {
    console.log(`SKIP (exists): ${prog.id}`);
  } else {
    programs.push(prog);
    existingIds.add(String(prog.id));
    addCount++;
    console.log(`ADDED: ${prog.id} — ${prog.name}`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nDone. Fixed: ${fixCount}, Added: ${addCount}, Total: ${programs.length}`);
