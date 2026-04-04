const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const baseFields = {
  provider: "Endless Biking",
  address: "101-1467 Crown Street, North Vancouver, BC",
  postalCode: "V7J 1G4",
  lat: 49.269554,
  lng: -123.140994,
  city: "North Vancouver",
  neighbourhood: "Mount Seymour",
  indoorOutdoor: "Outdoor",
  source: "endlessbiking.com",
  confirmed2026: true,
  urlVerified: true,
};

const updates = {
  "ACT-0166": {
    name: "Spring Break Camp | Kids AM | Week 2",
    enrollmentStatus: "Completed",
    registrationUrl: "https://www.endlessbiking.com/spring-break-camp",
    cost: 488.25,
    priceVerified: true,
    description: "Endless Biking Spring Break mountain bike camp for kids ages 6-10. Half-day AM (9:00 AM-12:00 PM), Mon-Fri, March 23-27, 2026. Riding on Mount Fromme and Mt. Seymour trails. PMBIA-certified instructors, 5:1 instructor-to-rider ratio. $465 + GST. Minimum Skill Level 2 required.",
  },
  "ACT-0168": {
    name: "Spring Break Camp | Youth | Week 2",
    enrollmentStatus: "Completed",
    registrationUrl: "https://www.endlessbiking.com/spring-break-camp",
    cost: 687.75,
    priceVerified: true,
    description: "Endless Biking Spring Break mountain bike camp for youth ages 10-16. Full-day (9:00 AM-3:00 PM), Mon-Fri, March 23-27, 2026. Riding on Mount Fromme and Mt. Seymour trails. PMBIA-certified instructors, 5:1 instructor-to-rider ratio. $655 + GST. Minimum Skill Level 2 required.",
  },
  "ACT-0223": {
    name: "DYRT Rides | Wednesday Kids | April",
    registrationUrl: "https://www.endlessbiking.com/dyrt-rides",
    cost: 257.25,
    priceVerified: true,
    description: "Endless Biking DYRT (Developing Youth to Ride Trails) after-school mountain bike rides for kids ages 6-10 on North Shore trails. Wednesdays 4:15-6:15 PM. April: 4 Wednesdays (Apr 8, 15, 22, 29). $245 + GST. Minimum Skill Level 2 required.",
  },
  "ACT-0224": {
    name: "DYRT Rides | Wednesday Youth | April",
    registrationUrl: "https://www.endlessbiking.com/dyrt-rides",
    cost: 257.25,
    priceVerified: true,
    description: "Endless Biking DYRT (Developing Youth to Ride Trails) after-school mountain bike rides for youth ages 10-16 on North Shore trails. Wednesdays 4:15-6:15 PM. April: 4 Wednesdays (Apr 8, 15, 22, 29). $245 + GST. Minimum Skill Level 2 required.",
  },
  "ACT-0241": {
    name: "DYRT Rides | Sunday Youth | April",
    registrationUrl: "https://www.endlessbiking.com/dyrt-rides",
    cost: 252,
    priceVerified: true,
    description: "Endless Biking DYRT (Developing Youth to Ride Trails) Sunday morning mountain bike rides for youth ages 10-16 on North Shore trails. 9:30 AM-12:30 PM. April: 3 Sundays (Apr 12, 19, 26). $240 + GST. Minimum Skill Level 2 required.",
  },
  "ACT-0242": {
    name: "DYRT Rides | Sunday Kids | April",
    registrationUrl: "https://www.endlessbiking.com/dyrt-rides",
    cost: 252,
    priceVerified: true,
    description: "Endless Biking DYRT (Developing Youth to Ride Trails) Sunday morning mountain bike rides for kids ages 6-10 on North Shore trails. 9:30 AM-12:30 PM. April: 3 Sundays (Apr 12, 19, 26). $240 + GST. Minimum Skill Level 2 required.",
  },
  "ACT-0305": {
    name: "DYRT Rides | Sunday Kids | May & June",
    registrationUrl: "https://www.endlessbiking.com/dyrt-rides",
    cost: 462,
    priceVerified: true,
    description: "Endless Biking DYRT (Developing Youth to Ride Trails) Sunday morning mountain bike rides for kids ages 6-10 on North Shore trails. 9:30 AM-12:30 PM. May & June: 6 Sundays (May 3, 10, 24; Jun 7, 14, 28). $440 + GST. Minimum Skill Level 2 required.",
  },
  "ACT-0306": {
    name: "DYRT Rides | Sunday Youth | May & June",
    registrationUrl: "https://www.endlessbiking.com/dyrt-rides",
    cost: 462,
    priceVerified: true,
    description: "Endless Biking DYRT (Developing Youth to Ride Trails) Sunday morning mountain bike rides for youth ages 10-16 on North Shore trails. 9:30 AM-12:30 PM. May & June: 6 Sundays (May 3, 10, 24; Jun 7, 14, 28). $440 + GST. Minimum Skill Level 2 required.",
  },
  "ACT-0314": {
    name: "DYRT Rides | Wednesday Kids | May & June",
    registrationUrl: "https://www.endlessbiking.com/dyrt-rides",
    cost: 456.75,
    priceVerified: true,
    description: "Endless Biking DYRT (Developing Youth to Ride Trails) after-school mountain bike rides for kids ages 6-10 on North Shore trails. Wednesdays 4:15-6:15 PM. May & June: 8 Wednesdays (May 6, 13, 20, 27; Jun 3, 10, 17, 24). $435 + GST. Minimum Skill Level 2 required.",
  },
  "ACT-0315": {
    name: "GRIP | Youth Spring | May",
    registrationUrl: "https://www.endlessbiking.com/grip",
    cost: 236.25,
    priceVerified: false,
    costNote: "Price sourced from ACTIVE Network registration system; not shown on public website. Approx $225 + GST for 4-session package. Contact Endless Biking at 604-985-2519 to confirm.",
    description: "Endless Biking GRIP (Girls Riding with Integrity & Purpose) spring mountain biking for girls, female-identifying, non-binary, and gender-expansive youth ages 10-17 on North Shore trails. Wednesdays 4:15-6:15 PM. May: May 6, 13, 20, 27. 5:1 instructor ratio. Minimum Skill Level 2 required.",
  },
  "ACT-0316": {
    name: "DYRT Rides | Wednesday Youth | May & June",
    registrationUrl: "https://www.endlessbiking.com/dyrt-rides",
    cost: 456.75,
    priceVerified: true,
    description: "Endless Biking DYRT (Developing Youth to Ride Trails) after-school mountain bike rides for youth ages 10-16 on North Shore trails. Wednesdays 4:15-6:15 PM. May & June: 8 Wednesdays (May 6, 13, 20, 27; Jun 3, 10, 17, 24). $435 + GST. Minimum Skill Level 2 required.",
  },
  "ACT-0317": {
    name: "COG Kids | Spring May",
    registrationUrl: "https://www.endlessbiking.com/cogkids",
    cost: 372.75,
    priceVerified: false,
    costNote: "Price sourced from ACTIVE Network registration system; not shown on public website. Contact Endless Biking at 604-985-2519 or info@endlessbiking.com to confirm.",
    description: "Endless Biking COG Kids mountain biking program for neurodivergent kids (autism, ADHD) ages 8-15. Thursday afternoon rides on North Shore trails (Lower Seymour, Blueridge, Mt. Fromme). 4:45-6:15 PM. May: May 7, 14, 21, 28. 2:1 participant-to-instructor ratio.",
  },
  "ACT-0321": {
    name: "GRIP | Kids Spring | June",
    registrationUrl: "https://www.endlessbiking.com/grip",
    cost: 236.25,
    priceVerified: false,
    costNote: "Price sourced from ACTIVE Network registration system; not shown on public website. Approx $225 + GST for 4-session package. Contact Endless Biking at 604-985-2519 to confirm.",
    description: "Endless Biking GRIP (Girls Riding with Integrity & Purpose) spring mountain biking for girls, female-identifying, non-binary, and gender-expansive youth ages 6-9 on North Shore trails. Thursdays 4:15-6:15 PM. June: Jun 4, 11, 18, 25. 5:1 instructor ratio. Minimum Skill Level 2 required.",
  },
  "ACT-0324": {
    name: "GRIP | Youth Spring | June",
    registrationUrl: "https://www.endlessbiking.com/grip",
    cost: 236.25,
    priceVerified: false,
    costNote: "Price sourced from ACTIVE Network registration system; not shown on public website. Approx $225 + GST for 4-session package. Contact Endless Biking at 604-985-2519 to confirm.",
    description: "Endless Biking GRIP (Girls Riding with Integrity & Purpose) spring mountain biking for girls, female-identifying, non-binary, and gender-expansive youth ages 10-17 on North Shore trails. Fridays 4:15-6:15 PM. June: Jun 5, 12, 19, 26. 5:1 instructor ratio. Minimum Skill Level 2 required.",
  },
  "ACT-0786": {
    name: "DYRT Rides | Sunday Kids | Fall (Sep-Oct)",
    registrationUrl: "https://www.endlessbiking.com/dyrt-rides",
    cost: 462,
    priceVerified: true,
    description: "Endless Biking DYRT (Developing Youth to Ride Trails) Sunday morning mountain bike rides for kids ages 6-10 on North Shore trails. 9:30 AM-12:30 PM. Fall: 6 Sundays (Sep 13, 20, 27; Oct 4, 11, 18). $440 + GST. Minimum Skill Level 2 required.",
  },
  "ACT-0787": {
    name: "DYRT Rides | Sunday Youth | Fall (Sep-Oct)",
    registrationUrl: "https://www.endlessbiking.com/dyrt-rides",
    cost: 462,
    priceVerified: true,
    description: "Endless Biking DYRT (Developing Youth to Ride Trails) Sunday morning mountain bike rides for youth ages 10-16 on North Shore trails. 9:30 AM-12:30 PM. Fall: 6 Sundays (Sep 13, 20, 27; Oct 4, 11, 18). $440 + GST. Minimum Skill Level 2 required.",
  },
};

// Apply updates to existing programs
const updated = data.map(p => {
  if (!updates[p.id]) return p;
  const u = updates[p.id];
  return Object.assign({}, p, baseFields, u);
});

const summerWeeks = [
  { startDate: "2026-07-06", endDate: "2026-07-10", days5: true, label: "Wk1 (Jul 6-10)" },
  { startDate: "2026-07-13", endDate: "2026-07-17", days5: true, label: "Wk2 (Jul 13-17)" },
  { startDate: "2026-07-21", endDate: "2026-07-24", days5: false, label: "Wk3 (Jul 21-24)" },
  { startDate: "2026-08-04", endDate: "2026-08-07", days5: false, label: "Wk4 (Aug 4-7)" },
  { startDate: "2026-08-10", endDate: "2026-08-14", days5: true, label: "Wk5 (Aug 10-14)" },
  { startDate: "2026-08-17", endDate: "2026-08-21", days5: true, label: "Wk6 (Aug 17-21)" },
];

const newPrograms = [];

// Spring Break Week 1 Kids AM
newPrograms.push({
  id: "ACT-0788",
  name: "Spring Break Camp | Kids AM | Week 1",
  provider: "Endless Biking",
  category: "Outdoor",
  campType: "Spring Break",
  scheduleType: "Half Day (AM)",
  ageMin: 6, ageMax: 10,
  startDate: "2026-03-16", endDate: "2026-03-20",
  days: "Mon-Fri",
  startTime: "9:00 AM", endTime: "12:00 PM",
  cost: 488.25,
  indoorOutdoor: "Outdoor",
  neighbourhood: "Mount Seymour",
  address: "101-1467 Crown Street, North Vancouver, BC",
  postalCode: "V7J 1G4", lat: 49.269554, lng: -123.140994,
  enrollmentStatus: "Completed",
  registrationUrl: "https://www.endlessbiking.com/spring-break-camp",
  description: "Endless Biking Spring Break mountain bike camp for kids ages 6-10. Half-day AM (9:00 AM-12:00 PM), Mon-Fri, March 16-20, 2026. Riding on Mount Fromme and Mt. Seymour trails. PMBIA-certified instructors, 5:1 instructor-to-rider ratio. $465 + GST. Minimum Skill Level 2 required.",
  tags: ["mountain biking", "camps"],
  source: "endlessbiking.com",
  season: "Spring 2026",
  dayLength: "Half Day",
  priceVerified: true,
  confirmed2026: true,
  durationPerDay: 3,
  activityType: "Day Camp",
  city: "North Vancouver",
  urlVerified: true,
});

// Spring Break Week 1 Youth
newPrograms.push({
  id: "ACT-0789",
  name: "Spring Break Camp | Youth | Week 1",
  provider: "Endless Biking",
  category: "Outdoor",
  campType: "Spring Break",
  scheduleType: "Full Day",
  ageMin: 10, ageMax: 16,
  startDate: "2026-03-16", endDate: "2026-03-20",
  days: "Mon-Fri",
  startTime: "9:00 AM", endTime: "3:00 PM",
  cost: 687.75,
  indoorOutdoor: "Outdoor",
  neighbourhood: "Mount Seymour",
  address: "101-1467 Crown Street, North Vancouver, BC",
  postalCode: "V7J 1G4", lat: 49.269554, lng: -123.140994,
  enrollmentStatus: "Completed",
  registrationUrl: "https://www.endlessbiking.com/spring-break-camp",
  description: "Endless Biking Spring Break mountain bike camp for youth ages 10-16. Full-day (9:00 AM-3:00 PM), Mon-Fri, March 16-20, 2026. Riding on Mount Fromme and Mt. Seymour trails. PMBIA-certified instructors, 5:1 instructor-to-rider ratio. $655 + GST. Minimum Skill Level 2 required.",
  tags: ["mountain biking", "camps"],
  source: "endlessbiking.com",
  season: "Spring 2026",
  dayLength: "Full Day",
  priceVerified: true,
  confirmed2026: true,
  durationPerDay: 6,
  activityType: "Day Camp",
  city: "North Vancouver",
  urlVerified: true,
});

// Summer Camps Kids AM
summerWeeks.forEach((wk, i) => {
  const cost = wk.days5 ? 456.75 : 367.50;
  const basePrice = wk.days5 ? 435 : 350;
  const daysStr = wk.days5 ? "Mon-Fri" : "Tue-Fri";
  newPrograms.push({
    id: "ACT-" + String(790 + i).padStart(4, "0"),
    name: "Summer Camp | Kids AM | " + wk.label,
    provider: "Endless Biking",
    category: "Outdoor",
    campType: "Summer Camp",
    scheduleType: "Half Day (AM)",
    ageMin: 6, ageMax: 9,
    startDate: wk.startDate, endDate: wk.endDate,
    days: daysStr,
    startTime: "9:00 AM", endTime: "12:00 PM",
    cost: cost,
    indoorOutdoor: "Outdoor",
    neighbourhood: "Mount Seymour",
    address: "101-1467 Crown Street, North Vancouver, BC",
    postalCode: "V7J 1G4", lat: 49.269554, lng: -123.140994,
    enrollmentStatus: "Open",
    registrationUrl: "https://www.endlessbiking.com/summer-camp",
    description: "Endless Biking Summer Camp for kids ages 6-9. Half-day AM (9:00 AM-12:00 PM), " + wk.startDate + " to " + wk.endDate + ". Mountain biking on North Shore trails. Certified mountain bike coaches. $" + basePrice + " + GST.",
    tags: ["mountain biking", "camps", "summer camp"],
    source: "endlessbiking.com",
    season: "Summer 2026",
    dayLength: "Half Day",
    priceVerified: true,
    confirmed2026: true,
    durationPerDay: 3,
    activityType: "Day Camp",
    city: "North Vancouver",
    urlVerified: true,
  });
});

// Summer Camps Kids PM
summerWeeks.forEach((wk, i) => {
  const cost = wk.days5 ? 456.75 : 367.50;
  const basePrice = wk.days5 ? 435 : 350;
  const daysStr = wk.days5 ? "Mon-Fri" : "Tue-Fri";
  newPrograms.push({
    id: "ACT-" + String(796 + i).padStart(4, "0"),
    name: "Summer Camp | Kids PM | " + wk.label,
    provider: "Endless Biking",
    category: "Outdoor",
    campType: "Summer Camp",
    scheduleType: "Half Day (PM)",
    ageMin: 6, ageMax: 9,
    startDate: wk.startDate, endDate: wk.endDate,
    days: daysStr,
    startTime: "1:00 PM", endTime: "4:00 PM",
    cost: cost,
    indoorOutdoor: "Outdoor",
    neighbourhood: "Mount Seymour",
    address: "101-1467 Crown Street, North Vancouver, BC",
    postalCode: "V7J 1G4", lat: 49.269554, lng: -123.140994,
    enrollmentStatus: "Open",
    registrationUrl: "https://www.endlessbiking.com/summer-camp",
    description: "Endless Biking Summer Camp for kids ages 6-9. Half-day PM (1:00 PM-4:00 PM), " + wk.startDate + " to " + wk.endDate + ". Mountain biking on North Shore trails. Certified mountain bike coaches. $" + basePrice + " + GST.",
    tags: ["mountain biking", "camps", "summer camp"],
    source: "endlessbiking.com",
    season: "Summer 2026",
    dayLength: "Half Day",
    priceVerified: true,
    confirmed2026: true,
    durationPerDay: 3,
    activityType: "Day Camp",
    city: "North Vancouver",
    urlVerified: true,
  });
});

// Summer Camps Youth
summerWeeks.forEach((wk, i) => {
  const cost = wk.days5 ? 687.75 : 582.75;
  const basePrice = wk.days5 ? 655 : 555;
  const daysStr = wk.days5 ? "Mon-Fri" : "Tue-Fri";
  newPrograms.push({
    id: "ACT-" + String(802 + i).padStart(4, "0"),
    name: "Summer Camp | Youth | " + wk.label,
    provider: "Endless Biking",
    category: "Outdoor",
    campType: "Summer Camp",
    scheduleType: "Full Day",
    ageMin: 9, ageMax: 16,
    startDate: wk.startDate, endDate: wk.endDate,
    days: daysStr,
    startTime: "9:00 AM", endTime: "3:00 PM",
    cost: cost,
    indoorOutdoor: "Outdoor",
    neighbourhood: "Mount Seymour",
    address: "101-1467 Crown Street, North Vancouver, BC",
    postalCode: "V7J 1G4", lat: 49.269554, lng: -123.140994,
    enrollmentStatus: "Open",
    registrationUrl: "https://www.endlessbiking.com/summer-camp",
    description: "Endless Biking Summer Camp for youth ages 9-16. Full-day (9:00 AM-3:00 PM), " + wk.startDate + " to " + wk.endDate + ". Mountain biking on North Shore trails. Certified mountain bike coaches. $" + basePrice + " + GST.",
    tags: ["mountain biking", "camps", "summer camp"],
    source: "endlessbiking.com",
    season: "Summer 2026",
    dayLength: "Full Day",
    priceVerified: true,
    confirmed2026: true,
    durationPerDay: 6,
    activityType: "Day Camp",
    city: "North Vancouver",
    urlVerified: true,
  });
});

// Fall Wednesday Rides Kids
newPrograms.push({
  id: "ACT-0808",
  name: "DYRT Rides | Wednesday Kids | Fall (Sep-Oct)",
  provider: "Endless Biking",
  category: "Outdoor",
  campType: "Fall Program",
  scheduleType: "Activity",
  ageMin: 6, ageMax: 10,
  startDate: "2026-09-09", endDate: "2026-10-14",
  days: "Wed",
  startTime: "4:15 PM", endTime: "6:15 PM",
  cost: 341.25,
  indoorOutdoor: "Outdoor",
  neighbourhood: "Mount Seymour",
  address: "101-1467 Crown Street, North Vancouver, BC",
  postalCode: "V7J 1G4", lat: 49.269554, lng: -123.140994,
  enrollmentStatus: "Open",
  registrationUrl: "https://www.endlessbiking.com/dyrt-rides",
  description: "Endless Biking DYRT (Developing Youth to Ride Trails) after-school mountain bike rides for kids ages 6-10 on North Shore trails. Wednesdays 4:15-6:15 PM. Fall: 6 Wednesdays (Sep 9, 16, 23, 30; Oct 7, 14). $325 + GST. Minimum Skill Level 2 required.",
  tags: ["mountain biking", "cycling"],
  source: "endlessbiking.com",
  season: "Fall 2026",
  dayLength: "Single Day",
  priceVerified: true,
  confirmed2026: true,
  durationPerDay: 2,
  activityType: "Cycling",
  repeating: "weekly",
  city: "North Vancouver",
  urlVerified: true,
});

// Fall Wednesday Rides Youth
newPrograms.push({
  id: "ACT-0809",
  name: "DYRT Rides | Wednesday Youth | Fall (Sep-Oct)",
  provider: "Endless Biking",
  category: "Outdoor",
  campType: "Fall Program",
  scheduleType: "Activity",
  ageMin: 10, ageMax: 16,
  startDate: "2026-09-09", endDate: "2026-10-14",
  days: "Wed",
  startTime: "4:15 PM", endTime: "6:15 PM",
  cost: 341.25,
  indoorOutdoor: "Outdoor",
  neighbourhood: "Mount Seymour",
  address: "101-1467 Crown Street, North Vancouver, BC",
  postalCode: "V7J 1G4", lat: 49.269554, lng: -123.140994,
  enrollmentStatus: "Open",
  registrationUrl: "https://www.endlessbiking.com/dyrt-rides",
  description: "Endless Biking DYRT (Developing Youth to Ride Trails) after-school mountain bike rides for youth ages 10-16 on North Shore trails. Wednesdays 4:15-6:15 PM. Fall: 6 Wednesdays (Sep 9, 16, 23, 30; Oct 7, 14). $325 + GST. Minimum Skill Level 2 required.",
  tags: ["mountain biking", "cycling"],
  source: "endlessbiking.com",
  season: "Fall 2026",
  dayLength: "Single Day",
  priceVerified: true,
  confirmed2026: true,
  durationPerDay: 2,
  activityType: "Cycling",
  repeating: "weekly",
  city: "North Vancouver",
  urlVerified: true,
});

// GRIP Youth Summer Camp
newPrograms.push({
  id: "ACT-0810",
  name: "GRIP | Youth Summer Camp",
  provider: "Endless Biking",
  category: "Outdoor",
  campType: "Summer Camp",
  scheduleType: "Full Day",
  ageMin: 10, ageMax: 17,
  startDate: "2026-07-27", endDate: "2026-07-31",
  days: "Mon-Fri",
  startTime: "9:00 AM", endTime: "3:00 PM",
  cost: null,
  costNote: "Price not listed on endlessbiking.com/grip. Contact Endless Biking at 604-985-2519 or info@endlessbiking.com.",
  indoorOutdoor: "Outdoor",
  neighbourhood: "Mount Seymour",
  address: "101-1467 Crown Street, North Vancouver, BC",
  postalCode: "V7J 1G4", lat: 49.269554, lng: -123.140994,
  enrollmentStatus: "Open",
  registrationUrl: "https://www.endlessbiking.com/grip",
  description: "Endless Biking GRIP (Girls Riding with Integrity & Purpose) summer camp for girls, female-identifying, non-binary, and gender-expansive youth ages 10-17 on North Shore trails. Full-day (9:00 AM-3:00 PM), Mon-Fri, July 27-31, 2026. 5:1 instructor ratio. Minimum Skill Level 2 required.",
  tags: ["mountain biking", "camps", "girls program", "summer camp"],
  source: "endlessbiking.com",
  season: "Summer 2026",
  dayLength: "Full Day",
  priceVerified: false,
  confirmed2026: true,
  durationPerDay: 6,
  activityType: "Day Camp",
  city: "North Vancouver",
  urlVerified: true,
});

const finalData = [...updated, ...newPrograms];
fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2) + '\n');

console.log('Updated existing programs:', Object.keys(updates).length);
console.log('Added new programs:', newPrograms.length);
console.log('Total programs:', finalData.length);

const eb = finalData.filter(p => p.provider === 'Endless Biking');
const nvo = finalData.filter(p => p.provider === 'North Vancouver Outdoors');
console.log('Endless Biking programs now:', eb.length);
console.log('North Vancouver Outdoors remaining:', nvo.length);
