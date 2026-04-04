#!/usr/bin/env node
/**
 * One-click deeper audit: Pear Tree Education — add all missing locations & age-group listings.
 * Removes incorrect generic 5-12 entries and replaces with per-age-group entries.
 * Run: node scripts/update-peartree-2026.cjs
 */
'use strict';

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// ── IDs to remove (wrong name, wrong age range, or unverified date) ─────────
const IDS_TO_REMOVE = new Set([
  629, 630, 631, 632, 633, 634,          // "STEAM & French Camp" 5-12 – wrong name & age
  'peartree-kits-summer-w7',              // same issue
  'proday-peartree-kits-1',              // generic 5-12 pro-d day
  'proday-peartreeeducation-20260515-kitsilano', // May 15 date not on website
]);

// ── Location definitions ──────────────────────────────────────────────────────
const LOCS = {
  kits: {
    label: 'kits',
    address: 'Suite 215 - 2678 West Broadway, Vancouver, BC V6K 2G3',
    lat: 49.2635, lng: -123.1665,
    neighbourhood: 'Kitsilano', city: 'Vancouver',
    summerPrice: 499,
    summerUrl: 'https://www.pear-tree.ca/our-camps/summer-camps-vancouver/#programs',
    prodUrl:   'https://www.pear-tree.ca/pro-d-day-camp-kitsilano/#programs',
  },
  yaletown: {
    label: 'yaletown',
    address: '1035 Cambie St, Vancouver, BC V6B 5L7',
    lat: 49.2686, lng: -123.1188,
    neighbourhood: 'Yaletown', city: 'Vancouver',
    summerPrice: 499,
    summerUrl: 'https://www.pear-tree.ca/our-camps/summer-vancouver-yaletown/#programs',
    prodUrl:   'https://www.pear-tree.ca/pro-d-day-camp-yaletown/',
  },
  kerrisdale: {
    label: 'kerrisdale',
    address: '2733 W 41st Ave, Vancouver, BC V6N 3C5',
    lat: 49.2337, lng: -123.1694,
    neighbourhood: 'Kerrisdale', city: 'Vancouver',
    summerPrice: 499,
    summerUrl: 'https://www.pear-tree.ca/our-camps/summer-vancouver-kerrisdale/#programs',
  },
  burnaby: {
    label: 'burnaby',
    address: '5135 Sperling Ave, Burnaby, BC V5E 2T2',
    lat: 49.2147, lng: -122.9706,
    neighbourhood: 'Deer Lake', city: 'Burnaby',
    summerPrice: 459,
    summerUrl: 'https://www.pear-tree.ca/our-camps/summer-camps-deer-lake/#programs',
  },
  northvan: {
    label: 'northvan',
    address: '530 E 12th St, North Vancouver, BC V7L 2K4',
    lat: 49.3214, lng: -123.0616,
    neighbourhood: 'North Vancouver', city: 'North Vancouver',
    summerPrice: 459,
    summerUrl: 'https://www.pear-tree.ca/our-camps/summer-camps-north-van/#programs',
  },
  coquitlam: {
    label: 'coquitlam',
    address: '2888 Delahaye Dr, Coquitlam, BC V3B 4T5',
    lat: 49.2882, lng: -122.7898,
    neighbourhood: 'Coquitlam', city: 'Coquitlam',
    summerPrice: 459,
    summerUrl: 'https://www.pear-tree.ca/our-camps/summer-tri-cities-coquitlam/#programs',
  },
};

// ── Summer weeks ──────────────────────────────────────────────────────────────
// BC Day 2026 = Aug 3 (Mon), so Week 5 starts Tue Aug 4
const WEEKS = [
  { num: 1, start: '2026-07-06', end: '2026-07-10', days: 'Mon-Fri' },
  { num: 2, start: '2026-07-13', end: '2026-07-17', days: 'Mon-Fri' },
  { num: 3, start: '2026-07-20', end: '2026-07-24', days: 'Mon-Fri' },
  { num: 4, start: '2026-07-27', end: '2026-07-31', days: 'Mon-Fri' },
  { num: 5, start: '2026-08-04', end: '2026-08-07', days: 'Tue-Fri' },
  { num: 6, start: '2026-08-10', end: '2026-08-14', days: 'Mon-Fri' },
  { num: 7, start: '2026-08-17', end: '2026-08-21', days: 'Mon-Fri' },
];

// ── Pro-D Day dates ───────────────────────────────────────────────────────────
// Today = 2026-04-03; all except Apr 20 are completed
const PROD_DATES = [
  { dateStr: '2025-09-19', days: 'Fri', status: 'Completed' },
  { dateStr: '2025-10-24', days: 'Fri', status: 'Completed' },
  { dateStr: '2025-11-21', days: 'Fri', status: 'Completed' },
  { dateStr: '2026-02-13', days: 'Fri', status: 'Completed' },
  { dateStr: '2026-04-20', days: 'Mon', status: 'Open' },
];

// Shorthand keys for dates used in IDs
const PROD_DATE_KEYS = {
  '2025-09-19': 'sep2025',
  '2025-10-24': 'oct2025',
  '2025-11-21': 'nov2025',
  '2026-02-13': 'feb2026',
  '2026-04-20': 'apr2026',
};

// Season labels for Pro-D Day dates
const PROD_DATE_SEASONS = {
  '2025-09-19': 'Fall 2025',
  '2025-10-24': 'Fall 2025',
  '2025-11-21': 'Fall 2025',
  '2026-02-13': 'Spring 2026',
  '2026-04-20': 'Spring 2026',
};

// ── Pro-D Day themes by age group & date index ───────────────────────────────
// Index 0-4 corresponds to PROD_DATES order above
const PROD_THEMES = {
  '5-6': [
    { name: 'Under the Sea',     desc: 'Marine biology through stories and hands-on discovery, a beach Crab Scavenger Hunt, and creating labelled scientific diagrams. Designed especially for 5–6 year olds.' },
    { name: 'Mini STEAMers',     desc: 'A one-day burst of hands-on creativity — chain-reaction marble runs, paper circuits, and team STEAM challenges blending science, technology, engineering, art, and math.' },
    { name: 'Fairytale Theatre', desc: 'A joyful day of storytelling, theatre, and making. Bring The Gingerbread Man to life with drama games, create "Missing" posters, and craft paper-bag puppet theatres.' },
    { name: "Painter's Pallet",  desc: 'A full day of colour exploring three art experiences: Chinese Lucky Lion watercolour, dot-painting pointillism winter scene, and a moonlit owl painting.' },
    { name: 'Interesting Insects', desc: 'Discover what makes an insect, why pollinators and decomposers matter, and how scientists borrow ideas from bugs. Includes insect classification, outdoor scavenger hunt, and clay bug creation.' },
  ],
  '7-8': [
    { name: 'Connect to Nature', desc: 'Become forest detectives! Bus trip to the forest for hands-on exploration, then use found natural materials to craft whimsical fairy/gnome homes.' },
    { name: 'Medieval Times',    desc: 'Castles, courage, and clever design! Read about medieval life, sketch cross-section castles, and take part in a friendly "jousting" tournament at the park.' },
    { name: 'Amazing Artists',   desc: 'Create like real artists: vibrant still-life painting, outdoor Andy Goldsworthy–inspired nature sculptures, and a gallery-walk critique session.' },
    { name: 'Food, Glorious Food!', desc: 'Curious tastebuds welcome! Supermarket scavenger hunt, cooking a recipe from scratch, and exploring the science of food.' },
    { name: 'Ancient Olympians', desc: 'Step into Ancient Greece — create Greek theatre masks, discover amphitheatre acoustics, and compete in an Ancient Olympics with field and track events.' },
  ],
  '9-10': [
    { name: 'Our Living Ocean',  desc: 'Real-world marine science at Vancouver\'s shore. Guided shore study, organism identification, and designing ocean-conservation solutions using design thinking.' },
    { name: 'Maker Space',       desc: 'Invent and tinker like real engineers — build marble-run Rube Goldberg machines and wire a Galaxy Bot that doodles patterns using a small motor and markers.' },
    { name: 'TV Reporters',      desc: 'Budding journalists form newsroom crews and rotate roles — anchor, camera, producer, editor — to produce and film a polished 60-second newscast.' },
    { name: 'Canada: Then',      desc: 'Read Paul Yee\'s Ghost Train, then transform Canadian history into a photographed graphic novel — storyboarding, staging, and shooting scenes with iPads.' },
    { name: 'Graphic Novels',    desc: 'Learn the art of comics — panels, gutters, page flow, captions vs. speech balloons — then write, draw, and publish a complete graphic novel in a single day.' },
  ],
  '11-12': [
    { name: 'Photo(shop)',       desc: 'Camera composition mini-lesson, guided indoor and neighbourhood photo shoot, then editing and presenting a polished photo essay in Photoshop.' },
    { name: 'Artificial Intelligence', desc: 'Code a real Dash robot with AI as your helper — plan in plain English, ask AI clear questions, then build and iterate block code in Blockly on iPads.' },
    { name: 'Urban Design 3D',   desc: 'Design a small open-top house in Tinkercad on iPads, then watch it get 3D-printed the same day. Covers wall thickness, sizing, and basic architectural principles.' },
    { name: 'Film School',       desc: 'Become a real film crew — rotate through director, camera, sound, slate, and actor roles to produce a polished 30–60 second scene from start to finish.' },
    { name: 'Future Global Leaders', desc: 'Spark global curiosity, build communication and collaboration skills, debate real-world issues, and develop a Team Action Plan to tackle a global challenge.' },
  ],
};

// ── Summer themes by location type & age group ────────────────────────────────
// "type-A" = Kitsilano/Yaletown (4 split groups: 5-6, 7-8, 9-10, 11-12)
// "type-B" = Kerrisdale/Burnaby/NorthVan/Coquitlam (3 groups: 5-6, 7-8, 9-12)

const SUMMER_THEMES_A = {
  '5-6': [
    { w: 1, name: 'Our Community',      desc: 'Explore the amazing people who make neighbourhoods thrive — police, firefighters, chefs, doctors, and more. Daily field trips, creative crafts, and teamwork games.' },
    { w: 2, name: 'Urban Gardeners',    desc: 'Discover the secrets of urban growing — plant seeds, build mini-gardens, explore composting, and learn how cities can grow their own food.' },
    { w: 3, name: 'Under the Sea',      desc: 'Dive into marine life through stories, hands-on activities, and a beach field trip to discover ocean creatures up close.' },
    { w: 4, name: 'Interesting Insects',desc: 'Bugs are heroes! Explore insect anatomy, pollinators, decomposers, and biomimicry through games, crafts, and outdoor scavenger hunts.' },
    { w: 5, name: 'Plants & Pollinators', desc: 'Discover how plants grow and why pollinators are vital. Seed planting, nature walks, flower anatomy activities, and garden art projects.' },
    { w: 6, name: 'Drama 101',          desc: 'Step into the spotlight! Voice exercises, improv games, script reading, and a mini performance — all in a supportive, creative environment.' },
    { w: 7, name: 'Transportation',     desc: 'Zoom through the world of transportation — from bicycles and boats to planes and rockets. Engineering challenges, field trips, and vehicle building.' },
  ],
  '7-8': [
    { w: 1, name: 'STEM Challenges',    desc: 'Hands-on science and engineering challenges — marble runs, bridge building, egg drop design, and team problem-solving that makes learning unforgettable.' },
    { w: 2, name: 'Food, Glorious Food', desc: 'Supermarket science, cooking from scratch, nutrition discovery, and food-inspired art. A delicious mix of learning and creativity.' },
    { w: 3, name: 'Amazing Artists',    desc: 'A week of studio arts: painting, sculpture, printmaking, and outdoor installation art inspired by real artists. Creative expression every day.' },
    { w: 4, name: 'Space',              desc: 'Blast into astronomy! Explore planets, stars, and galaxies through experiments, model building, and astronomy-inspired design challenges.' },
    { w: 5, name: 'Connect to Nature',  desc: 'Forest exploration, nature journalling, wildlife identification, and conservation projects — a week of outdoor adventure and environmental science.' },
    { w: 6, name: 'Junior Scientists',  desc: 'Run real experiments in chemistry, biology, and physics. Hands-on labs, scientific method practice, and a mini science fair to close the week.' },
    { w: 7, name: 'Math Magicians',     desc: 'Make math exciting through puzzles, code-breaking, probability games, geometry art, and real-world problem-solving challenges.' },
  ],
  '9-10': {
    // Note: Kitsilano has no Week 4 for 9-10 year olds
    kits: [
      { w: 1, name: 'Marine Biology',    desc: 'Plunge into marine science — shore studies, organism classification, ocean conservation design thinking, and hands-on lab experiments.' },
      { w: 2, name: 'Animation Studios', desc: 'Create stop-motion and digital animations: storyboarding, character design, frame-by-frame shooting, and sound editing.' },
      { w: 3, name: "Kids Can Cook!",    desc: 'Master kitchen skills, food science, and nutrition through daily cooking projects, recipe creation, and a chef\'s table finale.' },
      // No Week 4 at Kitsilano for 9-10
      { w: 5, name: 'Sports Science',    desc: 'Explore the biomechanics and physics behind sports through experiments, data collection, and applying science to athletic performance.' },
      { w: 6, name: 'TV Reporters',      desc: 'Form newsroom crews, rotate real roles — anchor, camera, producer, editor — and produce polished newscasts about topics that matter.' },
      { w: 7, name: 'Ancient Egypt',     desc: 'Uncover Egyptian history through archaeology simulations, hieroglyphic writing, mummification science, and pyramid engineering challenges.' },
    ],
    yaletown: [
      { w: 1, name: 'Marine Biology',    desc: 'Plunge into marine science — shore studies, organism classification, ocean conservation design thinking, and hands-on lab experiments.' },
      { w: 2, name: 'Animation Studios', desc: 'Create stop-motion and digital animations: storyboarding, character design, frame-by-frame shooting, and sound editing.' },
      { w: 3, name: "Kids Can Cook!",    desc: 'Master kitchen skills, food science, and nutrition through daily cooking projects, recipe creation, and a chef\'s table finale.' },
      { w: 4, name: 'Maker Space',       desc: 'Invent and tinker like real engineers — Rube Goldberg machines, Galaxy Bot wiring, electronics fundamentals, and iterative design challenges.' },
      { w: 5, name: 'Sports Science',    desc: 'Explore the biomechanics and physics behind sports through experiments, data collection, and applying science to athletic performance.' },
      { w: 6, name: 'TV Reporters',      desc: 'Form newsroom crews, rotate real roles — anchor, camera, producer, editor — and produce polished newscasts about topics that matter.' },
      { w: 7, name: 'Ancient Egypt',     desc: 'Uncover Egyptian history through archaeology simulations, hieroglyphic writing, mummification science, and pyramid engineering challenges.' },
    ],
  },
  '11-12': [
    { w: 1, name: 'Acting Studios',     desc: 'Intensive acting training: character development, scene study, voice and movement, improv, and a final performance for an invited audience.' },
    { w: 2, name: 'Debate Club',        desc: 'Master public speaking, argument structure, and critical thinking through structured debates, Socratic seminars, and persuasive writing.' },
    { w: 3, name: 'Artificial Intelligence', desc: 'Code real robots using AI as a helper — plan in plain English, translate ideas to block code in Blockly, and test and iterate robot programs on iPads.' },
    { w: 4, name: 'Urban Design 2D/3D', desc: 'Design buildings and city spaces using sketching, 2D planning, and Tinkercad 3D modelling on iPads — with models 3D-printed on site.' },
    { w: 5, name: 'Cooking Science',    desc: 'Explore the chemistry and physics behind food — emulsification, fermentation, Maillard reaction, and more — through daily cooking experiments.' },
    { w: 6, name: 'Entrepreneurs',      desc: 'Develop a business idea from concept to pitch: market research, branding, financial planning, and a final "Dragon\'s Den"-style presentation.' },
    { w: 7, name: 'Film Noir',          desc: 'Study the genre, write a script, then produce a polished short film — mastering lighting, camera angles, sound design, and editing together.' },
  ],
};

// Type-B locations (Kerrisdale, Burnaby, North Van, Coquitlam)
const SUMMER_THEMES_B = {
  '5-6': [
    { w: 1, name: 'Our Community',      desc: 'Explore the amazing people who make neighbourhoods thrive — police, firefighters, chefs, doctors, and more. Daily field trips, creative crafts, and teamwork games.' },
    { w: 2, name: "Painters Pallet",    desc: 'A full day of colour exploring three art experiences: Chinese Lucky Lion watercolour, dot-painting pointillism winter scene, and a moonlit owl painting.' },
    { w: 3, name: 'Interesting Insects',desc: 'Bugs are heroes! Explore insect anatomy, pollinators, decomposers, and biomimicry through games, crafts, and outdoor scavenger hunts.' },
    { w: 4, name: 'Urban Gardeners',    desc: 'Discover the secrets of urban growing — plant seeds, build mini-gardens, explore composting, and learn how cities can grow their own food.' },
    { w: 5, name: 'Nature Explorers',   desc: 'Forest walks, nature journalling, wildlife identification, and conservation crafts — a week of outdoor adventure and environmental discovery.' },
    { w: 6, name: 'Drama 101',          desc: 'Step into the spotlight! Voice exercises, improv games, script reading, and a mini performance — all in a supportive, creative environment.' },
    { w: 7, name: 'Transportation',     desc: 'Zoom through the world of transportation — from bicycles and boats to planes and rockets. Engineering challenges, field trips, and vehicle building.' },
  ],
  '7-8': [
    { w: 1, name: 'STEM Challenges',    desc: 'Hands-on science and engineering challenges — marble runs, bridge building, egg drop design, and team problem-solving that makes learning unforgettable.' },
    { w: 2, name: 'Amazing Artists',    desc: 'A week of studio arts: painting, sculpture, printmaking, and outdoor installation art inspired by real artists. Creative expression every day.' },
    { w: 3, name: 'Space',              desc: 'Blast into astronomy! Explore planets, stars, and galaxies through experiments, model building, and astronomy-inspired design challenges.' },
    { w: 4, name: 'Math Magicians',     desc: 'Make math exciting through puzzles, code-breaking, probability games, geometry art, and real-world problem-solving challenges.' },
    { w: 5, name: 'Connect to Nature',  desc: 'Forest exploration, nature journalling, wildlife identification, and conservation projects — a week of outdoor adventure and environmental science.' },
    { w: 6, name: 'Junior Scientists',  desc: 'Run real experiments in chemistry, biology, and physics. Hands-on labs, scientific method practice, and a mini science fair to close the week.' },
    { w: 7, name: 'Medieval Times',     desc: 'Castles, courage, and clever design! Read about medieval life, sketch cross-section castles, and participate in a friendly "jousting" tournament.' },
  ],
  '9-12': [
    { w: 1, name: 'Film School',        desc: 'Become a real film crew — rotate through director, camera, sound, slate, and actor roles to produce a polished 30–60 second scene from start to finish.' },
    { w: 2, name: 'Graphic Novels',     desc: 'Learn the art of comics — panels, gutters, page flow, captions vs. speech balloons — then write, draw, and publish a complete graphic novel in a day.' },
    { w: 3, name: "O'Canada",           desc: 'Explore Canadian history, geography, and culture through storytelling, photography, creative media projects, and community connections.' },
    { w: 4, name: 'Maker Space',        desc: 'Invent and tinker like real engineers — Rube Goldberg machines, Galaxy Bot wiring, electronics fundamentals, and iterative design challenges.' },
    { w: 5, name: 'Animation Studios',  desc: 'Create stop-motion and digital animations: storyboarding, character design, frame-by-frame shooting, and sound editing on iPads.' },
    { w: 6, name: 'Photo(shop)',        desc: 'Camera composition mini-lesson, guided photo shoot, then editing and presenting a polished photo essay using Photoshop on iPads.' },
    { w: 7, name: 'Film Noir',          desc: 'Study the genre, write a script, then produce a polished short film — mastering lighting, camera angles, sound design, and editing together.' },
  ],
};

// ── Helper: base Pro-D Day entry ──────────────────────────────────────────────
function makeProdEntry(loc, ageMin, ageMax, dateInfo, theme) {
  const ageKey  = `${ageMin}-${ageMax}`;
  const dateKey = PROD_DATE_KEYS[dateInfo.dateStr];
  const id      = `peartree-${loc.label}-prod-${ageMin}${ageMax}-${dateKey}`;
  return {
    id,
    name: theme.name,
    provider: 'Pear Tree Education',
    category: 'Multi-Activity',
    campType: 'Pro-D Day',
    scheduleType: 'Full Day',
    ageMin,
    ageMax,
    startDate: dateInfo.dateStr,
    endDate:   dateInfo.dateStr,
    days: dateInfo.days,
    startTime: '9:00 AM',
    endTime:   '3:00 PM',
    cost: 99,
    indoorOutdoor: 'Both',
    neighbourhood: loc.neighbourhood,
    address: loc.address,
    lat: loc.lat,
    lng: loc.lng,
    enrollmentStatus: dateInfo.status,
    registrationUrl: loc.prodUrl,
    description: theme.desc,
    tags: ['pro-d day', 'multi-activity', 'theme-based', 'STEAM'],
    activityType: 'Multi-Activity',
    priceVerified: true,
    confirmed2026: dateInfo.status === 'Open',
    season: PROD_DATE_SEASONS[dateInfo.dateStr],
    city: loc.city,
    costNote: '$99/day; optional extended care 8–9 AM & 3–5 PM +$25; hot lunch add-on +$25',
  };
}

// ── Helper: base Summer Camp entry ───────────────────────────────────────────
function makeSummerEntry(loc, ageMin, ageMax, week, theme) {
  const ageKey = `${ageMin}${ageMax}`;
  const id     = `peartree-${loc.label}-sum-${ageKey}-w${week.num}`;
  return {
    id,
    name: theme.name,
    provider: 'Pear Tree Education',
    category: 'Academic',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin,
    ageMax,
    startDate: week.start,
    endDate:   week.end,
    days: week.days,
    startTime: '9:00 AM',
    endTime:   '3:00 PM',
    cost: loc.summerPrice,
    indoorOutdoor: 'Both',
    neighbourhood: loc.neighbourhood,
    address: loc.address,
    lat: loc.lat,
    lng: loc.lng,
    enrollmentStatus: 'Open',
    registrationUrl: loc.summerUrl,
    description: theme.desc,
    tags: ['summer camp', 'theme-based', 'STEAM', 'field trips'],
    activityType: 'General STEM',
    priceVerified: true,
    confirmed2026: true,
    season: 'Summer 2026',
    city: loc.city,
    costNote: `$${loc.summerPrice}/week; optional extended care 8 AM–5 PM +$125/week; hot lunch +$84/week`,
  };
}

// ── Generate all new entries ──────────────────────────────────────────────────
const newEntries = [];

// ── Pro-D Day: Kitsilano (4 age groups) ──────────────────────────────────────
for (const [ageKey, themes] of Object.entries(PROD_THEMES)) {
  const [ageMin, ageMax] = ageKey.split('-').map(Number);
  PROD_DATES.forEach((dateInfo, i) => {
    newEntries.push(makeProdEntry(LOCS.kits, ageMin, ageMax, dateInfo, themes[i]));
  });
}

// ── Pro-D Day: Yaletown (5-6 and 7-8 only) ───────────────────────────────────
for (const ageKey of ['5-6', '7-8']) {
  const [ageMin, ageMax] = ageKey.split('-').map(Number);
  PROD_DATES.forEach((dateInfo, i) => {
    newEntries.push(makeProdEntry(LOCS.yaletown, ageMin, ageMax, dateInfo, PROD_THEMES[ageKey][i]));
  });
}

// ── Summer Camps: Kitsilano ───────────────────────────────────────────────────
// 5-6
SUMMER_THEMES_A['5-6'].forEach(t => {
  newEntries.push(makeSummerEntry(LOCS.kits, 5, 6, WEEKS[t.w - 1], t));
});
// 7-8
SUMMER_THEMES_A['7-8'].forEach(t => {
  newEntries.push(makeSummerEntry(LOCS.kits, 7, 8, WEEKS[t.w - 1], t));
});
// 9-10 (Kitsilano — no week 4)
SUMMER_THEMES_A['9-10'].kits.forEach(t => {
  newEntries.push(makeSummerEntry(LOCS.kits, 9, 10, WEEKS[t.w - 1], t));
});
// 11-12
SUMMER_THEMES_A['11-12'].forEach(t => {
  newEntries.push(makeSummerEntry(LOCS.kits, 11, 12, WEEKS[t.w - 1], t));
});

// ── Summer Camps: Yaletown ────────────────────────────────────────────────────
// 5-6 same as Kitsilano
SUMMER_THEMES_A['5-6'].forEach(t => {
  newEntries.push(makeSummerEntry(LOCS.yaletown, 5, 6, WEEKS[t.w - 1], t));
});
// 7-8
SUMMER_THEMES_A['7-8'].forEach(t => {
  newEntries.push(makeSummerEntry(LOCS.yaletown, 7, 8, WEEKS[t.w - 1], t));
});
// 9-10 (Yaletown has all 7 weeks incl. Maker Space W4)
SUMMER_THEMES_A['9-10'].yaletown.forEach(t => {
  newEntries.push(makeSummerEntry(LOCS.yaletown, 9, 10, WEEKS[t.w - 1], t));
});
// 11-12
SUMMER_THEMES_A['11-12'].forEach(t => {
  newEntries.push(makeSummerEntry(LOCS.yaletown, 11, 12, WEEKS[t.w - 1], t));
});

// ── Summer Camps: Kerrisdale, Burnaby, North Van, Coquitlam (type-B, 9-12 combined) ──
for (const loc of [LOCS.kerrisdale, LOCS.burnaby, LOCS.northvan, LOCS.coquitlam]) {
  // 5-6
  SUMMER_THEMES_B['5-6'].forEach(t => {
    newEntries.push(makeSummerEntry(loc, 5, 6, WEEKS[t.w - 1], t));
  });
  // 7-8
  SUMMER_THEMES_B['7-8'].forEach(t => {
    newEntries.push(makeSummerEntry(loc, 7, 8, WEEKS[t.w - 1], t));
  });
  // 9-12
  SUMMER_THEMES_B['9-12'].forEach(t => {
    newEntries.push(makeSummerEntry(loc, 9, 12, WEEKS[t.w - 1], t));
  });
}

// ── Merge into programs.json ──────────────────────────────────────────────────
const filtered = programs.filter(p => !IDS_TO_REMOVE.has(p.id));
const updated  = [...filtered, ...newEntries];

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(updated, null, 2));

console.log(`Removed: ${programs.length - filtered.length} old Pear Tree entries`);
console.log(`Added:   ${newEntries.length} new Pear Tree entries`);
console.log(`Total programs: ${updated.length}`);
console.log('\nNew entries summary:');
console.log('  Pro-D Day Kitsilano: 20 (4 age groups × 5 dates)');
console.log('  Pro-D Day Yaletown:  10 (2 age groups × 5 dates)');
console.log('  Summer Kitsilano:    27 (5-6×7, 7-8×7, 9-10×6, 11-12×7)');
console.log('  Summer Yaletown:     28 (all 4 age groups × 7 weeks)');
console.log('  Summer Kerrisdale:   21 (3 age groups × 7 weeks)');
console.log('  Summer Burnaby:      21 (3 age groups × 7 weeks)');
console.log('  Summer North Van:    21 (3 age groups × 7 weeks)');
console.log('  Summer Coquitlam:    21 (3 age groups × 7 weeks)');
