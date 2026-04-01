#!/usr/bin/env node
/**
 * Fill in computable fields for all programs based on existing data.
 * Fields: scheduleType, indoorOutdoor, campType, activityType, tags, durationPerDay, dayLength
 */
const fs = require("fs");
const path = require("path");

const programsPath = path.join(__dirname, "..", "src", "data", "programs.json");
const programs = JSON.parse(fs.readFileSync(programsPath, "utf-8"));

let stats = { scheduleType: 0, indoorOutdoor: 0, campType: 0, activityType: 0, tags: 0, durationPerDay: 0, dayLength: 0, ageMax: 0 };
let changed = { scheduleType: 0, dayLength: 0, campTypeYearRound: 0 };

function inferScheduleType(p) {
  const name = (p.name || "").toLowerCase();
  const desc = (p.description || "").toLowerCase();
  const start = p.startTime || "";
  const end = p.endTime || "";

  // Parse times
  function parseTime(t) {
    if (!t) return null;
    const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!m) return null;
    let h = parseInt(m[1]);
    if (m[3].toUpperCase() === "PM" && h !== 12) h += 12;
    if (m[3].toUpperCase() === "AM" && h === 12) h = 0;
    return h + parseInt(m[2]) / 60;
  }

  const startH = parseTime(start);
  const endH = parseTime(end);
  const duration = startH !== null && endH !== null ? endH - startH : null;

  if (name.includes("after school") || name.includes("afterschool") || name.includes("after-school")) return "After School";
  if (name.includes("overnight") || name.includes("sleepover")) return "Overnight";
  if (name.includes("residential")) return "Residential";
  if (name.includes("weekend") && !name.includes("camp")) return "Weekend";

  if (duration !== null) {
    if (duration < 3) return "Activity";
    if (duration < 6) {
      // Check if AM or PM
      if (startH !== null && startH < 12) return "Half Day (AM)";
      if (startH !== null && startH >= 12) return "Half Day (PM)";
      return "Half Day";
    }
    return "Full Day";
  }

  // Infer from name
  if (name.includes("half day") || name.includes("half-day")) {
    if (name.includes("am") || name.includes("morning")) return "Half Day (AM)";
    if (name.includes("pm") || name.includes("afternoon")) return "Half Day (PM)";
    return "Half Day";
  }
  if (name.includes("full day") || name.includes("full-day")) return "Full Day";
  if (name.includes("weekly") || name.includes("per week")) return "Weekly";

  // Day camps are typically full day
  if (name.includes("day camp")) return "Full Day";
  if (p.dayLength === "Full Day") return "Full Day";
  if (p.dayLength === "Half Day") return "Half Day";

  return null;
}

function inferIndoorOutdoor(p) {
  const name = (p.name || "").toLowerCase();
  const desc = (p.description || "").toLowerCase();
  const loc = (p.location || "").toLowerCase();
  const provider = (p.provider || "").toLowerCase();
  const at = (p.activityType || "").toLowerCase();

  // Definitely outdoor
  const outdoorKw = ["outdoor", "hiking", "kayak", "canoe", "paddle", "sailing", "nature", "wilderness", "camping", "rock climbing", "beach", "park ", "field hockey", "soccer field", "baseball", "softball", "rugby", "football field", "tennis court", "skateboard", "cycling", "biking", "mountain bike", "rowing", "archery range"];
  for (const kw of outdoorKw) {
    if (name.includes(kw) || desc.includes(kw)) return "Outdoor";
  }

  // Definitely indoor
  const indoorKw = ["indoor", "gymnasium", "studio", "classroom", "lab", "kitchen", "cooking", "baking", "chess", "coding", "robotics", "animation", "film editing", "music lesson", "piano", "violin", "guitar", "pottery", "painting class", "dance studio", "ballet", "yoga studio", "swim lesson", "pool", "rink", "arena", "ice skating", "figure skating", "hockey rink", "jiu-jitsu", "karate", "taekwondo", "judo", "bjj", "kickboxing"];
  for (const kw of indoorKw) {
    if (name.includes(kw) || desc.includes(kw)) return "Indoor";
  }

  // Location-based
  if (loc.includes("pool") || loc.includes("rink") || loc.includes("arena") || loc.includes("studio") || loc.includes("gym")) return "Indoor";
  if (loc.includes("park") || loc.includes("field") || loc.includes("beach") || loc.includes("trail")) return "Outdoor";

  // Activity type based
  if (["swimming", "hockey", "figure skating", "martial arts", "dance", "music", "coding & robotics", "coding", "chess", "cooking", "film acting"].includes(at)) return "Indoor";
  if (["outdoor", "nature", "cycling", "paddling & sailing", "climbing"].includes(at)) return "Outdoor";
  if (["tennis", "soccer", "baseball", "rugby", "lacrosse", "field hockey", "football"].includes(at)) return "Outdoor";

  // Multi-activity camps are usually both
  if (name.includes("day camp") || name.includes("summer camp") || at === "day camp" || at === "multi-sport") return "Both";

  // Community centre programs are typically indoor
  if (provider.includes("cmty centre") || provider.includes("community centre") || provider.includes("neighbourhood house")) return "Indoor";

  return null;
}

function inferCampType(p) {
  const name = (p.name || "").toLowerCase();
  const season = (p.season || "").toLowerCase();
  const cat = (p.category || "").toLowerCase();

  if (name.includes("pro-d") || name.includes("pro d") || name.includes("prod day")) return "Pro-D Day";
  if (name.includes("spring break")) return "Spring Break";
  if (name.includes("overnight camp") || name.includes("residential camp")) return "Overnight Camp";
  if (name.includes("drop-in") || name.includes("drop in")) return "Drop-in";

  // Summer-specific
  if (season.includes("summer")) {
    if (name.includes("day camp") || name.includes("summer camp")) return "Summer Camp";
    if (name.includes("summer learning") || name.includes("summer school")) return "Summer Learning";
    if (name.includes("class") || name.includes("lesson") || name.includes("program")) return "Summer Camp";
    return "Summer Camp";
  }

  // Year-round programs
  if (name.includes("weekly") || name.includes("class") || name.includes("lesson") || name.includes("course")) {
    if (season.includes("spring") || season.includes("fall") || season.includes("winter") || season === "year-round") return "Year-Round Program";
    return "Class/Lesson";
  }

  // Sports leagues
  if (name.includes("league") || name.includes("association") || name.includes("registration")) return "Club/League";

  // Camps
  if (name.includes("camp")) return "Summer Camp";
  if (name.includes("day camp")) return "Day Camp";

  // Default by season
  if (season.includes("summer")) return "Summer Camp";

  // Check date range before defaulting to Year-Round
  // Year-Round ONLY applies if: no end date (truly ongoing), or span > 10 months
  const startDateStr = p.startDate;
  const endDateStr = p.endDate;
  if (startDateStr && endDateStr) {
    const sd = new Date(startDateStr);
    const ed = new Date(endDateStr);
    const spanDays = (ed - sd) / (1000 * 60 * 60 * 24);
    if (spanDays > 305) {
      // Genuinely year-round (>10 months)
      return "Year-Round Program";
    }
    // Has a defined short date range — classify by start month
    const mo = sd.getMonth(); // 0-indexed
    if (mo >= 2 && mo <= 4) return "Spring Program";   // Mar–May
    if (mo >= 5 && mo <= 7) return "Summer Camp";      // Jun–Aug
    if (mo >= 8 && mo <= 10) return "Fall Program";    // Sep–Nov
    return "Class/Lesson"; // Dec–Feb (winter)
  }
  if (!endDateStr && startDateStr) {
    // Has a start date but no end date — treat as ongoing/year-round
    return "Year-Round Program";
  }

  // No date info at all — can't determine, leave as null
  return null;
}

function inferActivityType(p) {
  const name = (p.name || "").toLowerCase();
  const cat = (p.category || "").toLowerCase();
  const desc = (p.description || "").toLowerCase();

  // Sports
  if (name.includes("soccer") || name.includes("football club")) return "Soccer";
  if (name.includes("basketball")) return "Basketball";
  if (name.includes("baseball") || name.includes("little league") || name.includes("softball")) return "Baseball/Softball";
  if (name.includes("hockey") && !name.includes("field hockey")) return "Hockey";
  if (name.includes("field hockey")) return "Field Hockey";
  if (name.includes("tennis")) return "Tennis";
  if (name.includes("swimming") || name.includes("swim lesson") || name.includes("aqua")) return "Swimming";
  if (name.includes("gymnastics")) return "Gymnastics";
  if (name.includes("martial art") || name.includes("jiu-jitsu") || name.includes("bjj") || name.includes("karate") || name.includes("taekwondo") || name.includes("judo") || name.includes("kickboxing")) return "Martial Arts";
  if (name.includes("lacrosse")) return "Lacrosse";
  if (name.includes("rugby")) return "Rugby";
  if (name.includes("wrestling")) return "Wrestling";
  if (name.includes("skating") || name.includes("figure skat")) return "Figure Skating";
  if (name.includes("rowing")) return "Rowing";
  if (name.includes("cycling") || name.includes("bike") || name.includes("biking")) return "Cycling";
  if (name.includes("climbing") || name.includes("bouldering")) return "Climbing";
  if (name.includes("multi-sport") || name.includes("multi sport")) return "Multi-Sport";
  if (name.includes("volleyball")) return "Volleyball";
  if (name.includes("badminton")) return "Badminton";
  if (name.includes("archery")) return "Archery";
  if (name.includes("fencing")) return "Fencing";
  if (name.includes("golf")) return "Golf";
  if (name.includes("flag football")) return "Flag Football";
  if (name.includes("skateboard")) return "Skateboarding";

  // Arts
  if (name.includes("dance") || name.includes("ballet") || name.includes("hip hop") || name.includes("hip-hop") || name.includes("bollywood")) return "Dance";
  if (name.includes("painting") || name.includes("drawing") || name.includes("sketch")) return "Painting & Drawing";
  if (name.includes("pottery") || name.includes("ceramic") || name.includes("clay")) return "Pottery & Ceramics";
  if (name.includes("theatre") || name.includes("theater") || name.includes("drama") || name.includes("acting")) return "Theatre & Drama";
  if (name.includes("musical theatre") || name.includes("musical theater")) return "Musical Theatre";
  if (name.includes("film") || name.includes("movie") || name.includes("cinema") || name.includes("filmmaking")) return "Film & Animation";
  if (name.includes("animation") || name.includes("cartoon")) return "Film & Animation";
  if (name.includes("photography")) return "Photography";
  if (name.includes("visual art") || name.includes("art camp") || name.includes("arts camp") || name.includes("art class") || name.includes("creative art")) return "Visual Arts";

  // Music
  if (name.includes("piano")) return "Piano";
  if (name.includes("guitar")) return "Guitar";
  if (name.includes("violin") || name.includes("strings")) return "Strings";
  if (name.includes("drum")) return "Drums & Percussion";
  if (name.includes("singing") || name.includes("vocal") || name.includes("choir")) return "Singing & Voice";
  if (name.includes("music") && cat === "music") return "Music";

  // STEM
  if (name.includes("coding") || name.includes("programming") || name.includes("python") || name.includes("javascript")) return "Coding";
  if (name.includes("robotics") || name.includes("robot")) return "Coding & Robotics";
  if (name.includes("stem") || name.includes("steam") || name.includes("s.t.e.m") || name.includes("s.t.e.a.m")) return "Science & Technology";
  if (name.includes("science") || name.includes("experiment") || name.includes("chemistry")) return "Science";
  if (name.includes("engineering")) return "Engineering";
  if (name.includes("math")) return "Math";

  // Academic
  if (name.includes("chess")) return "Chess";
  if (name.includes("debate") || name.includes("public speaking") || name.includes("forensic")) return "Public Speaking & Debate";
  if (name.includes("cooking") || name.includes("baking") || name.includes("culinary") || name.includes("kitchen")) return "Cooking";
  if (name.includes("language") || name.includes("french") || name.includes("spanish") || name.includes("mandarin") || name.includes("cantonese") || name.includes("japanese") || name.includes("korean") || name.includes("arabic") || name.includes("german") || name.includes("punjabi") || name.includes("filipino") || name.includes("asl")) return "Language";
  if (name.includes("reading") || name.includes("writing") || name.includes("literacy")) return "Literacy";

  // Outdoor
  if (name.includes("nature") || name.includes("wilderness") || name.includes("forest")) return "Nature";
  if (name.includes("outdoor") || name.includes("adventure")) return "Outdoor";
  if (name.includes("kayak") || name.includes("canoe") || name.includes("paddle") || name.includes("sailing")) return "Paddling & Sailing";

  // General camps
  if (name.includes("day camp")) return "Day Camp";
  if (name.includes("camp") && cat === "multi-activity") return "Day Camp";

  return null;
}

function inferTags(p) {
  const name = (p.name || "").toLowerCase();
  const desc = (p.description || "").toLowerCase();
  const tags = [];

  // Skill level
  if (name.includes("beginner") || name.includes("intro") || name.includes("learn to")) tags.push("beginner-friendly");
  if (name.includes("advanced") || name.includes("competitive")) tags.push("advanced");
  if (name.includes("intermediate")) tags.push("intermediate");

  // Special features
  if (name.includes("free") || p.cost === 0) tags.push("free");
  if (name.includes("drop-in") || name.includes("drop in")) tags.push("drop-in");
  if (name.includes("online") || name.includes("virtual") || desc.includes("online") || desc.includes("zoom")) tags.push("online");
  if (p.beforeCare || p.afterCare) tags.push("extended-care");
  if (p.earlyBirdCost) tags.push("early-bird");

  // Age groups
  if (name.includes("preschool") || name.includes("pre-school") || (p.ageMin !== null && p.ageMin <= 4 && p.ageMax && p.ageMax <= 6)) tags.push("preschool");
  if (name.includes("toddler") || name.includes("tot")) tags.push("toddler");
  if (name.includes("teen") || name.includes("youth") || (p.ageMin !== null && p.ageMin >= 12)) tags.push("teens");

  // Content
  if (name.includes("stem") || name.includes("steam") || name.includes("s.t.e.m") || name.includes("s.t.e.a.m")) tags.push("STEM");
  if (name.includes("leadership")) tags.push("leadership");
  if (name.includes("outdoor") || name.includes("nature")) tags.push("outdoor");
  if (name.includes("creative") || name.includes("art")) tags.push("creative");
  if (name.includes("active") || name.includes("sport") || name.includes("athletic")) tags.push("active");
  if (name.includes("camp")) tags.push("camp");

  return tags.length > 0 ? tags : null;
}

function parseProgramTime(t) {
  if (!t) return null;
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1]);
  if (m[3].toUpperCase() === "PM" && h !== 12) h += 12;
  if (m[3].toUpperCase() === "AM" && h === 12) h = 0;
  return h + parseInt(m[2]) / 60;
}

for (const p of programs) {
  // scheduleType — always recompute (thresholds changed, old values may be wrong)
  {
    const st = inferScheduleType(p);
    if (st) {
      if (!p.scheduleType) stats.scheduleType++;
      else if (p.scheduleType !== st) changed.scheduleType++;
      p.scheduleType = st;
    }
  }

  // indoorOutdoor — only fill if missing
  if (!p.indoorOutdoor) {
    const io = inferIndoorOutdoor(p);
    if (io) { p.indoorOutdoor = io; stats.indoorOutdoor++; }
  }

  // campType — fill if missing, or fix if incorrectly set to "Year-Round Program"
  if (!p.campType) {
    const ct = inferCampType(p);
    if (ct) { p.campType = ct; stats.campType++; }
  } else if (p.campType === "Year-Round Program") {
    const ct = inferCampType(p);
    if (ct && ct !== "Year-Round Program") {
      p.campType = ct;
      changed.campTypeYearRound++;
    }
  }

  // activityType — only fill if missing
  if (!p.activityType) {
    const at = inferActivityType(p);
    if (at) { p.activityType = at; stats.activityType++; }
  }

  // tags — only fill if missing
  if (!p.tags || p.tags.length === 0) {
    const tags = inferTags(p);
    if (tags) { p.tags = tags; stats.tags++; }
  }

  // durationPerDay — always recompute from startTime/endTime if available
  if (p.startTime && p.endTime) {
    const s = parseProgramTime(p.startTime);
    const e = parseProgramTime(p.endTime);
    if (s !== null && e !== null && e > s) {
      const dur = Math.round((e - s) * 10) / 10;
      if (!p.durationPerDay) stats.durationPerDay++;
      p.durationPerDay = dur;
    }
  }

  // dayLength — always recompute with corrected thresholds (< 3 = Single Day, 3-6 = Half Day, 6+ = Full Day)
  // Exception: lesson-type names with short duration → "Lesson"
  if (p.durationPerDay) {
    const oldDL = p.dayLength;
    let newDL;
    if (p.durationPerDay >= 6) newDL = "Full Day";
    else if (p.durationPerDay >= 3) newDL = "Half Day";
    else {
      const nameLower = (p.name || "").toLowerCase();
      const lessonKeywords = ["lesson", "class", "private", "instruction", "tutorial", "coaching", "clinic"];
      const isLesson = lessonKeywords.some(kw => nameLower.includes(kw));
      newDL = isLesson ? "Lesson" : "Single Day";
    }

    if (!oldDL) stats.dayLength++;
    else if (oldDL !== newDL) changed.dayLength++;
    p.dayLength = newDL;
  }

  // Fix ageMax if it's 0
  if (p.ageMax === 0) {
    p.ageMax = null;
    stats.ageMax++;
  }
}

console.log("=== FIELDS NEWLY FILLED ===");
for (const [k, v] of Object.entries(stats)) {
  if (v > 0) console.log(k + ": " + v + " programs");
}

console.log("\n=== INCORRECT VALUES CORRECTED ===");
console.log("scheduleType (wrong threshold → Activity/HalfDay/FullDay): " + changed.scheduleType + " programs");
console.log("dayLength (wrong threshold corrected): " + changed.dayLength + " programs");
console.log("campType Year-Round → date-based classification: " + changed.campTypeYearRound + " programs");

fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2));
console.log("\nUpdated programs.json");

// Report remaining gaps
const fields = ['cost','description','lat','lng','startDate','endDate','ageMin','ageMax','scheduleType','indoorOutdoor','activityType','campType','startTime','endTime','days','tags','address','dayLength','durationPerDay'];
console.log("\n=== REMAINING GAPS ===");
for (const f of fields) {
  const missing = programs.filter(x => x[f] === undefined || x[f] === null || x[f] === '' || (Array.isArray(x[f]) && x[f].length === 0)).length;
  if (missing > 0) console.log(f + ": " + missing + " still missing");
}
