'use strict';
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data/programs.json', 'utf8'));

let changes = 0;

data.forEach(p => {
  if (!p.provider || !p.provider.toLowerCase().includes('soaring eagle')) return;
  const id = Number(p.id);

  // ID 461: NV Jul 6-10 confirmed on live page
  if (id === 461) {
    p.name = 'Summer Forest Camp (Capilano River, North Vancouver)';
    p.cost = 490;
    p.costNote = '$490 + GST per week. Confirmed from live provider page (Apr 2026). Capilano River Regional Park, North Vancouver.';
    p.confirmed2026 = true;
    p.priceVerified = true;
    p.isEstimate = false;
    p.enrollmentStatus = 'Open';
    p.address = 'Capilano River Regional Park, North Vancouver, BC';
    p.lat = 49.3439;
    p.lng = -123.1116;
    p.neighbourhood = 'Lynn Valley';
    p.city = 'North Vancouver';
    p.registrationUrl = 'https://soaringeaglenatureschool.org/summer-forest-camp/';
    changes++;
  }

  // ID 462: NV doesn't have Jul 13-17. Acadia Beach Vancouver does.
  if (id === 462) {
    p.name = 'Summer Forest Camp (Acadia Beach, Vancouver)';
    p.cost = 490;
    p.costNote = '$490 + GST per week. Confirmed from live provider page (Apr 2026). Acadia Beach Park, Vancouver.';
    p.confirmed2026 = true;
    p.priceVerified = true;
    p.isEstimate = false;
    p.enrollmentStatus = 'Open';
    p.address = 'Acadia Beach Park, Vancouver, BC';
    p.lat = 49.271;
    p.lng = -123.211;
    p.neighbourhood = 'UBC';
    p.city = 'Vancouver';
    p.registrationUrl = 'https://soaringeaglenatureschool.org/summer-forest-camp/';
    changes++;
  }

  // ID 463: NV doesn't have Jul 20-24; Coquitlam does (covered by 1389). Mark Completed.
  if (id === 463) {
    p.enrollmentStatus = 'Completed';
    p.costNote = 'Entry superseded. 2026 Summer Forest Camp NV location does not run Jul 20-24. See Coquitlam entry for Jul 20-24. Check soaringeaglenatureschool.org.';
    p.confirmed2026 = false;
    p.priceVerified = false;
    changes++;
  }

  // ID 464: Jul 27-31 doesn't exist at any Soaring Eagle location in 2026.
  if (id === 464) {
    p.enrollmentStatus = 'Completed';
    p.costNote = 'Entry superseded. 2026 Summer Forest Camp does not run Jul 27-31 at any location. Check soaringeaglenatureschool.org.';
    p.confirmed2026 = false;
    p.priceVerified = false;
    changes++;
  }

  // ID 465: NV doesn't have Aug 3-7. Acadia Beach Vancouver does (Aug 3-7, BC Day Mon so runs Tue-Fri Aug 4-7).
  if (id === 465) {
    p.name = 'Summer Forest Camp (Acadia Beach, Vancouver)';
    p.cost = 490;
    p.costNote = '$490 + GST per week (4-day week; BC Day Mon Aug 3 holiday, camp runs Tue-Fri Aug 4-7). Confirmed from live provider page (Apr 2026). Acadia Beach Park, Vancouver.';
    p.confirmed2026 = true;
    p.priceVerified = true;
    p.isEstimate = false;
    p.enrollmentStatus = 'Open';
    p.address = 'Acadia Beach Park, Vancouver, BC';
    p.lat = 49.271;
    p.lng = -123.211;
    p.neighbourhood = 'UBC';
    p.city = 'Vancouver';
    p.startDate = '2026-08-04';
    p.endDate = '2026-08-07';
    p.days = 'Tue-Fri';
    p.registrationUrl = 'https://soaringeaglenatureschool.org/summer-forest-camp/';
    changes++;
  }

  // ID 466: NV Aug 10-14 confirmed
  if (id === 466) {
    p.name = 'Summer Forest Camp (Capilano River, North Vancouver)';
    p.cost = 490;
    p.costNote = '$490 + GST per week. Confirmed from live provider page (Apr 2026). Capilano River Regional Park, North Vancouver.';
    p.confirmed2026 = true;
    p.priceVerified = true;
    p.isEstimate = false;
    p.enrollmentStatus = 'Open';
    p.address = 'Capilano River Regional Park, North Vancouver, BC';
    p.lat = 49.3439;
    p.lng = -123.1116;
    p.neighbourhood = 'Lynn Valley';
    p.city = 'North Vancouver';
    p.registrationUrl = 'https://soaringeaglenatureschool.org/summer-forest-camp/';
    changes++;
  }

  // ID 468: Spring Break Survival Skills NV Mar 23-27 — past date, mark Completed
  if (id === 468) {
    p.enrollmentStatus = 'Completed';
    p.costNote = 'Spring Break camp ran March 23-27, 2026 — now complete.';
    changes++;
  }

  // ID 1379: Ocean & Forest Camp Jul 27-31 — Jul 27-31 not in 2026 schedule. Mark Completed.
  if (id === 1379) {
    p.enrollmentStatus = 'Completed';
    p.costNote = 'Entry superseded. 2026 Summer Forest Camp does not run Jul 27-31 at Acadia Beach. Check soaringeaglenatureschool.org.';
    p.confirmed2026 = false;
    p.priceVerified = false;
    changes++;
  }

  // ID 1380: Ocean & Forest Camp Aug 4-7 (BC Day week) confirmed at Acadia Beach
  if (id === 1380) {
    p.name = 'Summer Ocean & Forest Camp (Acadia Beach, Vancouver)';
    p.startDate = '2026-08-04';
    p.endDate = '2026-08-07';
    p.days = 'Tue-Fri';
    p.cost = 490;
    p.costNote = '$490 + GST per week (4-day week; BC Day Mon Aug 3 holiday, camp runs Tue-Fri Aug 4-7). Confirmed from live provider page (Apr 2026). Acadia Beach Park, Vancouver.';
    p.confirmed2026 = true;
    p.priceVerified = true;
    p.isEstimate = false;
    p.enrollmentStatus = 'Open';
    p.registrationUrl = 'https://soaringeaglenatureschool.org/summer-forest-camp/';
    changes++;
  }

  // IDs 1381-1384: Young Sprouts — pricing TBA, fix URL, fix address, fix end time (9AM-1PM)
  if (id >= 1381 && id <= 1384) {
    p.registrationUrl = 'https://soaringeaglenatureschool.org/summer-young-sprouts-camp/';
    p.cost = null;
    p.costNote = 'Pricing TBA as of Apr 2026 — check soaringeaglenatureschool.org/summer-young-sprouts-camp/. Prior year ~$365/week. Times: 9AM-1PM (half day). Dates not yet posted.';
    p.confirmed2026 = false;
    p.priceVerified = false;
    p.isEstimate = false;
    p.endTime = '1:00 PM';
    p.scheduleType = 'Half Day';
    p.durationPerDay = 4;
    if (id === 1381 || id === 1382) {
      p.address = 'Capilano River Regional Park, North Vancouver, BC';
      p.lat = 49.3439;
      p.lng = -123.1116;
      p.neighbourhood = 'Lynn Valley';
      p.city = 'North Vancouver';
    }
    if (id === 1383 || id === 1384) {
      p.address = 'Pacific Spirit Regional Park, Vancouver, BC';
      p.lat = 49.259;
      p.lng = -123.223;
      p.neighbourhood = 'UBC';
      p.city = 'Vancouver';
    }
    changes++;
  }

  // IDs 1385-1386: Advanced Forest Camp — fix ageMin (DB=9, live=8), pricing TBA, fix URL
  if (id === 1385 || id === 1386) {
    p.ageMin = 8;
    p.registrationUrl = 'https://soaringeaglenatureschool.org/summer-advanced-camp/';
    p.cost = null;
    p.costNote = 'Pricing TBA as of Apr 2026 — check soaringeaglenatureschool.org/summer-advanced-camp/. Prior year ~$365/week. Prerequisite: 2+ previous 5-day camps or Monthly programs.';
    p.confirmed2026 = false;
    p.priceVerified = false;
    p.isEstimate = false;
    changes++;
  }

  // IDs 1387-1388: Summer Forest Camp (Pacific Spirit) — Pacific Spirit is NOT a Summer Forest Camp location
  // It is a Young Sprouts location. Mark Completed.
  if (id === 1387 || id === 1388) {
    p.enrollmentStatus = 'Completed';
    p.costNote = 'Entry superseded. Pacific Spirit Park is a Young Sprouts location, not a Summer Forest Camp location per 2026 provider page. Check soaringeaglenatureschool.org.';
    p.confirmed2026 = false;
    p.priceVerified = false;
    changes++;
  }

  // ID 1389: Coquitlam (Minnekhada) Jul 20-24 confirmed
  if (id === 1389) {
    p.cost = 490;
    p.costNote = '$490 + GST per week. Confirmed from live provider page (Apr 2026). Minnekhada Regional Park, Coquitlam.';
    p.confirmed2026 = true;
    p.priceVerified = true;
    p.isEstimate = false;
    p.enrollmentStatus = 'Open';
    p.registrationUrl = 'https://soaringeaglenatureschool.org/summer-forest-camp/';
    changes++;
  }

  // ID 1390: Delta (Watershed Park) Aug 10-14 confirmed
  if (id === 1390) {
    p.cost = 490;
    p.costNote = '$490 + GST per week. Confirmed from live provider page (Apr 2026). Delta Watershed Park, Delta.';
    p.confirmed2026 = true;
    p.priceVerified = true;
    p.isEstimate = false;
    p.enrollmentStatus = 'Open';
    p.registrationUrl = 'https://soaringeaglenatureschool.org/summer-forest-camp/';
    changes++;
  }
});

// Now add missing Summer Forest Camp sessions not in DB:
// NV: Jun 29-Jul 3, Aug 17-21, Aug 24-28
// Vancouver Acadia Beach: Jun 29-Jul 3, Jul 6-10, Jul 20-24, Aug 10-14, Aug 17-21, Aug 24-28
// Delta: Jul 13-17
// We already have/fixing entries:
//   461=NV Jul 6-10, 466=NV Aug 10-14
//   462=Van Jul 13-17, 465=Van Aug 4-7, 1380=Van Aug 4-7 (ocean)
//   1389=Coq Jul 20-24, 1390=Delta Aug 10-14
// Missing:
//   NV: Jun 29-Jul 3 (Canada Day short week Mon-Thu), Aug 17-21, Aug 24-28
//   Van: Jun 29-Jul 3, Jul 6-10, Jul 20-24, Aug 10-14, Aug 17-21, Aug 24-28
//   Delta: Jul 13-17

const newEntries = [
  // NV Jun 29-Jul 3 (Canada Day short week, Mon-Thu, no Jul 1)
  {
    id: 'sens-nv-jun29',
    name: 'Summer Forest Camp (Capilano River, North Vancouver)',
    provider: 'Soaring Eagle Nature School',
    category: 'Outdoor',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 6, ageMax: 12,
    startDate: '2026-06-29', endDate: '2026-07-03',
    days: 'Mon-Thu',
    startTime: '9:00 AM', endTime: '3:00 PM',
    cost: 490,
    costNote: '$490 + GST per week (4-day week; Canada Day Jul 1 holiday, camp runs Mon-Thu Jun 29-Jul 2 or Tue-Fri Jul 1 excluded). Confirmed from live provider page (Apr 2026).',
    indoorOutdoor: 'Outdoor',
    neighbourhood: 'Lynn Valley',
    address: 'Capilano River Regional Park, North Vancouver, BC',
    lat: 49.3439, lng: -123.1116,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://soaringeaglenatureschool.org/summer-forest-camp/',
    description: 'Nature-based summer camp exploring edible plants, wildlife tracking, and survival skills in Capilano River Regional Park. Small groups (7-8 kids per mentor). 4-day week due to Canada Day.',
    tags: ['forest school', 'nature', 'wildlife', 'survival skills', 'outdoor'],
    activityType: 'Outdoor',
    confirmed2026: true, priceVerified: true, isEstimate: false,
    season: 'Summer 2026', city: 'North Vancouver'
  },
  // NV Aug 17-21
  {
    id: 'sens-nv-aug17',
    name: 'Summer Forest Camp (Capilano River, North Vancouver)',
    provider: 'Soaring Eagle Nature School',
    category: 'Outdoor',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon-Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    cost: 490,
    costNote: '$490 + GST per week. Confirmed from live provider page (Apr 2026). Capilano River Regional Park, North Vancouver.',
    indoorOutdoor: 'Outdoor',
    neighbourhood: 'Lynn Valley',
    address: 'Capilano River Regional Park, North Vancouver, BC',
    lat: 49.3439, lng: -123.1116,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://soaringeaglenatureschool.org/summer-forest-camp/',
    description: 'Nature-based summer camp exploring edible plants, wildlife tracking, and survival skills in Capilano River Regional Park. Small groups (7-8 kids per mentor).',
    tags: ['forest school', 'nature', 'wildlife', 'survival skills', 'outdoor'],
    activityType: 'Outdoor',
    confirmed2026: true, priceVerified: true, isEstimate: false,
    season: 'Summer 2026', city: 'North Vancouver'
  },
  // NV Aug 24-28
  {
    id: 'sens-nv-aug24',
    name: 'Summer Forest Camp (Capilano River, North Vancouver)',
    provider: 'Soaring Eagle Nature School',
    category: 'Outdoor',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon-Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    cost: 490,
    costNote: '$490 + GST per week. Confirmed from live provider page (Apr 2026). Capilano River Regional Park, North Vancouver.',
    indoorOutdoor: 'Outdoor',
    neighbourhood: 'Lynn Valley',
    address: 'Capilano River Regional Park, North Vancouver, BC',
    lat: 49.3439, lng: -123.1116,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://soaringeaglenatureschool.org/summer-forest-camp/',
    description: 'Nature-based summer camp exploring edible plants, wildlife tracking, and survival skills in Capilano River Regional Park. Small groups (7-8 kids per mentor).',
    tags: ['forest school', 'nature', 'wildlife', 'survival skills', 'outdoor'],
    activityType: 'Outdoor',
    confirmed2026: true, priceVerified: true, isEstimate: false,
    season: 'Summer 2026', city: 'North Vancouver'
  },
  // Vancouver Acadia Beach Jun 29-Jul 3
  {
    id: 'sens-van-jun29',
    name: 'Summer Forest Camp (Acadia Beach, Vancouver)',
    provider: 'Soaring Eagle Nature School',
    category: 'Outdoor',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 6, ageMax: 12,
    startDate: '2026-06-29', endDate: '2026-07-03',
    days: 'Mon-Thu',
    startTime: '9:00 AM', endTime: '3:00 PM',
    cost: 490,
    costNote: '$490 + GST per week (4-day week; Canada Day Jul 1 holiday). Confirmed from live provider page (Apr 2026). Acadia Beach Park, Vancouver.',
    indoorOutdoor: 'Outdoor',
    neighbourhood: 'UBC',
    address: 'Acadia Beach Park, Vancouver, BC',
    lat: 49.271, lng: -123.211,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://soaringeaglenatureschool.org/summer-forest-camp/',
    description: 'Nature-based summer camp at Acadia Beach Park exploring edible plants, wildlife tracking, and survival skills. Beach and forest access. Small groups (7-8 kids per mentor). 4-day week due to Canada Day.',
    tags: ['forest school', 'nature', 'beach', 'wildlife', 'survival skills', 'outdoor'],
    activityType: 'Outdoor',
    confirmed2026: true, priceVerified: true, isEstimate: false,
    season: 'Summer 2026', city: 'Vancouver'
  },
  // Vancouver Acadia Beach Jul 6-10
  {
    id: 'sens-van-jul6',
    name: 'Summer Forest Camp (Acadia Beach, Vancouver)',
    provider: 'Soaring Eagle Nature School',
    category: 'Outdoor',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 6, ageMax: 12,
    startDate: '2026-07-06', endDate: '2026-07-10',
    days: 'Mon-Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    cost: 490,
    costNote: '$490 + GST per week. Confirmed from live provider page (Apr 2026). Acadia Beach Park, Vancouver.',
    indoorOutdoor: 'Outdoor',
    neighbourhood: 'UBC',
    address: 'Acadia Beach Park, Vancouver, BC',
    lat: 49.271, lng: -123.211,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://soaringeaglenatureschool.org/summer-forest-camp/',
    description: 'Nature-based summer camp at Acadia Beach Park exploring edible plants, wildlife tracking, and survival skills. Beach and forest access. Small groups (7-8 kids per mentor).',
    tags: ['forest school', 'nature', 'beach', 'wildlife', 'survival skills', 'outdoor'],
    activityType: 'Outdoor',
    confirmed2026: true, priceVerified: true, isEstimate: false,
    season: 'Summer 2026', city: 'Vancouver'
  },
  // Vancouver Acadia Beach Jul 20-24
  {
    id: 'sens-van-jul20',
    name: 'Summer Forest Camp (Acadia Beach, Vancouver)',
    provider: 'Soaring Eagle Nature School',
    category: 'Outdoor',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 6, ageMax: 12,
    startDate: '2026-07-20', endDate: '2026-07-24',
    days: 'Mon-Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    cost: 490,
    costNote: '$490 + GST per week. Confirmed from live provider page (Apr 2026). Acadia Beach Park, Vancouver.',
    indoorOutdoor: 'Outdoor',
    neighbourhood: 'UBC',
    address: 'Acadia Beach Park, Vancouver, BC',
    lat: 49.271, lng: -123.211,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://soaringeaglenatureschool.org/summer-forest-camp/',
    description: 'Nature-based summer camp at Acadia Beach Park exploring edible plants, wildlife tracking, and survival skills. Beach and forest access. Small groups (7-8 kids per mentor).',
    tags: ['forest school', 'nature', 'beach', 'wildlife', 'survival skills', 'outdoor'],
    activityType: 'Outdoor',
    confirmed2026: true, priceVerified: true, isEstimate: false,
    season: 'Summer 2026', city: 'Vancouver'
  },
  // Vancouver Acadia Beach Aug 10-14
  {
    id: 'sens-van-aug10',
    name: 'Summer Forest Camp (Acadia Beach, Vancouver)',
    provider: 'Soaring Eagle Nature School',
    category: 'Outdoor',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-10', endDate: '2026-08-14',
    days: 'Mon-Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    cost: 490,
    costNote: '$490 + GST per week. Confirmed from live provider page (Apr 2026). Acadia Beach Park, Vancouver.',
    indoorOutdoor: 'Outdoor',
    neighbourhood: 'UBC',
    address: 'Acadia Beach Park, Vancouver, BC',
    lat: 49.271, lng: -123.211,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://soaringeaglenatureschool.org/summer-forest-camp/',
    description: 'Nature-based summer camp at Acadia Beach Park exploring edible plants, wildlife tracking, and survival skills. Beach and forest access. Small groups (7-8 kids per mentor).',
    tags: ['forest school', 'nature', 'beach', 'wildlife', 'survival skills', 'outdoor'],
    activityType: 'Outdoor',
    confirmed2026: true, priceVerified: true, isEstimate: false,
    season: 'Summer 2026', city: 'Vancouver'
  },
  // Vancouver Acadia Beach Aug 17-21
  {
    id: 'sens-van-aug17',
    name: 'Summer Forest Camp (Acadia Beach, Vancouver)',
    provider: 'Soaring Eagle Nature School',
    category: 'Outdoor',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-17', endDate: '2026-08-21',
    days: 'Mon-Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    cost: 490,
    costNote: '$490 + GST per week. Confirmed from live provider page (Apr 2026). Acadia Beach Park, Vancouver.',
    indoorOutdoor: 'Outdoor',
    neighbourhood: 'UBC',
    address: 'Acadia Beach Park, Vancouver, BC',
    lat: 49.271, lng: -123.211,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://soaringeaglenatureschool.org/summer-forest-camp/',
    description: 'Nature-based summer camp at Acadia Beach Park exploring edible plants, wildlife tracking, and survival skills. Beach and forest access. Small groups (7-8 kids per mentor).',
    tags: ['forest school', 'nature', 'beach', 'wildlife', 'survival skills', 'outdoor'],
    activityType: 'Outdoor',
    confirmed2026: true, priceVerified: true, isEstimate: false,
    season: 'Summer 2026', city: 'Vancouver'
  },
  // Vancouver Acadia Beach Aug 24-28
  {
    id: 'sens-van-aug24',
    name: 'Summer Forest Camp (Acadia Beach, Vancouver)',
    provider: 'Soaring Eagle Nature School',
    category: 'Outdoor',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 6, ageMax: 12,
    startDate: '2026-08-24', endDate: '2026-08-28',
    days: 'Mon-Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    cost: 490,
    costNote: '$490 + GST per week. Confirmed from live provider page (Apr 2026). Acadia Beach Park, Vancouver.',
    indoorOutdoor: 'Outdoor',
    neighbourhood: 'UBC',
    address: 'Acadia Beach Park, Vancouver, BC',
    lat: 49.271, lng: -123.211,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://soaringeaglenatureschool.org/summer-forest-camp/',
    description: 'Nature-based summer camp at Acadia Beach Park exploring edible plants, wildlife tracking, and survival skills. Beach and forest access. Small groups (7-8 kids per mentor).',
    tags: ['forest school', 'nature', 'beach', 'wildlife', 'survival skills', 'outdoor'],
    activityType: 'Outdoor',
    confirmed2026: true, priceVerified: true, isEstimate: false,
    season: 'Summer 2026', city: 'Vancouver'
  },
  // Delta Jul 13-17
  {
    id: 'sens-delta-jul13',
    name: 'Summer Forest Camp (Delta Watershed Park)',
    provider: 'Soaring Eagle Nature School',
    category: 'Outdoor',
    campType: 'Summer Camp',
    scheduleType: 'Full Day',
    ageMin: 6, ageMax: 12,
    startDate: '2026-07-13', endDate: '2026-07-17',
    days: 'Mon-Fri',
    startTime: '9:00 AM', endTime: '3:00 PM',
    cost: 490,
    costNote: '$490 + GST per week. Confirmed from live provider page (Apr 2026). Delta Watershed Park, Delta.',
    indoorOutdoor: 'Outdoor',
    neighbourhood: 'North Delta',
    address: 'Delta Watershed Park, 11401 Watershed Rd, Delta, BC',
    lat: 49.134, lng: -122.894,
    enrollmentStatus: 'Open',
    registrationUrl: 'https://soaringeaglenatureschool.org/summer-forest-camp/',
    description: 'Nature-based summer camp in Delta Watershed Park exploring edible plants, wildlife tracking, and survival skills. Small groups (7-8 kids per mentor).',
    tags: ['forest school', 'nature', 'wildlife', 'survival skills', 'outdoor'],
    activityType: 'Outdoor',
    confirmed2026: true, priceVerified: true, isEstimate: false,
    season: 'Summer 2026', city: 'Delta'
  }
];

data.push(...newEntries);
console.log('New entries added:', newEntries.length);
console.log('Total changes (existing):', changes);

fs.writeFileSync('./src/data/programs.json', JSON.stringify(data, null, 2));
console.log('Done. Total programs:', data.length);
