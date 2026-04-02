#!/usr/bin/env node
/**
 * rebuild-pedalheads-nonbike.cjs
 *
 * Rebuilds ALL non-bike Pedalheads programs:
 *   - Soccer camps (program_id=1012, 17 Metro Van locations)
 *   - Swim lessons / group (program_id=2, 8 locations)
 *   - Swim outdoor summer (program_id=1002, 3 locations)
 *
 * Also cleans up:
 *   - Old "Soccer Camp" entries that used bike PE IDs (mislabeled)
 *   - Old "Swim Lessons" entries (all pointed to Swimmer 1 only, isEstimate=true)
 *   - Handles the 47 bike/trail PE IDs that were labeled "Soccer Camp"
 *
 * Session 3 — 2026-04-01
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '../src/data/programs.json');
const PROVINCE_STATE_ID = 1; // BC

// ── Location metadata ─────────────────────────────────────────────────────────
// Addresses sourced from existing DB entries and Google Maps verification.
// "no addr" means API doesn't provide address; use location name as fallback.

const SOCCER_LOCATIONS = {
  '1717': { address: '3214 W 10th Ave, Vancouver, BC',     neighbourhood: 'Kitsilano',             city: 'Vancouver' },
  '1723': { address: 'Jules Quesnel Elementary, Vancouver, BC', neighbourhood: 'Dunbar-Southlands', city: 'Vancouver' },
  '1724': { address: '1750 E 22nd Ave, Vancouver, BC',     neighbourhood: 'Renfrew-Collingwood',   city: 'Vancouver' },
  '1775': { address: '4196 West 4th Avenue, Vancouver, BC', neighbourhood: 'Point Grey',            city: 'Vancouver' },
  '1776': { address: '419 W 49th Ave, Vancouver, BC',      neighbourhood: 'Kensington-Cedar Cottage', city: 'Vancouver' },
  '1796': { address: '801 Charleson St, Vancouver, BC',    neighbourhood: 'False Creek',            city: 'Vancouver' },
  '1857': { address: '1690 W 49th Ave, Vancouver, BC',     neighbourhood: 'Quilchena',              city: 'Vancouver' },
  '1714': { address: '6501 Deer Lake Ave, Burnaby, BC',    neighbourhood: 'Deer Lake',              city: 'Burnaby' },
  '1777': { address: 'Beecher Park, Burnaby, BC',          neighbourhood: 'Brentwood',              city: 'Burnaby' },
  '1798': { address: 'Lynn Valley Elementary, North Vancouver, BC', neighbourhood: 'Lynn Valley',   city: 'North Vancouver' },
  '1921': { address: '1131 W Queens Rd, North Vancouver, BC', neighbourhood: 'Lynn Valley',         city: 'North Vancouver' },
  '1778': { address: '6411 No. 3 Rd, Richmond, BC',        neighbourhood: 'Ironwood',               city: 'Richmond' },
  '1797': { address: 'McNair Field, Richmond, BC',          neighbourhood: 'South Arm',              city: 'Richmond' },
  '1859': { address: 'James Whiteside Elementary, Richmond, BC', neighbourhood: 'South Arm',        city: 'Richmond' },
  '1964': { address: 'Blundell Park, Richmond, BC',         neighbourhood: 'Blundell',               city: 'Richmond' },
  '1832': { address: 'Alex Hope Elementary, Langley, BC',   neighbourhood: 'Walnut Grove',           city: 'Langley' },
  '1833': { address: 'École des Pionniers, Port Coquitlam, BC', neighbourhood: 'Port Coquitlam',    city: 'Port Coquitlam' },
};

const SWIM_LOCATIONS = {
  // program_id=2 (indoor/pool evening group lessons)
  '3':    { address: '4196 West 4th Avenue, Vancouver, BC', neighbourhood: 'Point Grey',   city: 'Vancouver' },
  '1328': { address: '511 W 59th Ave, Vancouver, BC',        neighbourhood: 'Marpole',      city: 'Vancouver' },
  '5':    { address: '6501 Deer Lake Ave, Burnaby, BC',      neighbourhood: 'Deer Lake',    city: 'Burnaby' },
  '1175': { address: 'Fitness 2000, Sullivan Heights, Burnaby, BC', neighbourhood: 'Sullivan Heights', city: 'Burnaby' },
  '1398': { address: '14200 Entertainment Blvd, Richmond, BC', neighbourhood: 'Ironwood',  city: 'Richmond' },
  '1327': { address: '2002 Park Royal S, West Vancouver, BC', neighbourhood: 'Park Royal',  city: 'West Vancouver' },
  '1732': { address: 'Fremont Village, Port Coquitlam, BC',   neighbourhood: 'Fremont',     city: 'Port Coquitlam' },
  '1953': { address: 'Fremont Village, Port Coquitlam, BC',   neighbourhood: 'Fremont',     city: 'Port Coquitlam' },
  // program_id=1002 (outdoor pool)
  '1054': { address: '4096 Point Grey Rd, Vancouver, BC',    neighbourhood: 'Point Grey',   city: 'Vancouver' },
  '1963': { address: 'Bell Park, Burnaby, BC',               neighbourhood: 'Burquitlam',   city: 'Burnaby' },
  '1447': { address: '14200 Entertainment Blvd, Richmond, BC', neighbourhood: 'Ironwood',   city: 'Richmond' },
};

async function fetchJSON(url, body) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://pedalheads.com',
      'Referer': 'https://pedalheads.com/en/camp',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  return resp.json();
}

function normalizeName(raw) {
  if (!raw || typeof raw === 'object') return (raw && raw.default) ? raw.default.trim() : 'Unknown';
  return raw.trim();
}

function formatTime(rawTime) {
  if (!rawTime) return null;
  const [h, m] = rawTime.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}

function buildSoccerUrl(peId, skillLevelId, catTimeId) {
  return `https://pedalheads.com/en/camp/details?region=1&program_event=${peId}&skill_level=${skillLevelId}&category_time=${catTimeId}`;
}

function getSoccerScheduleType(startH, endH) {
  const dur = endH - startH;
  if (dur >= 6) return 'Full Day';
  if (startH < 12) return 'Half Day AM';
  return 'Half Day PM';
}

function getSoccerAgeMax(levelName) {
  // Exact age brackets from Pedalheads API
  if (/zoomie/i.test(levelName)) return 4;
  if (/speedster/i.test(levelName)) return 5;
  if (/trailblazer/i.test(levelName)) return 6;
  if (/legend/i.test(levelName)) return 8;
  // Generic levels (Adapted, Half-Day Camp, Parent & Tot, Explorers) — no stated max age
  return null;
}

function getSoccerDescription(levelName, address, neighbourhood, scheduleType, price) {
  const timeDesc = scheduleType === 'Full Day' ? '9am–4pm' :
                   scheduleType === 'Half Day AM' ? '9am–12pm' :
                   scheduleType === 'Half Day PM' ? '1pm–4pm' : scheduleType;
  const loc = neighbourhood || address.split(',')[0];
  return `Pedalheads soccer camp at ${loc} — ${scheduleType} (${timeDesc}, $${price}/week). ` +
    `${levelName}. Fun skill-building in a safe, encouraging environment. ` +
    `Registration opens April 7 at 10am PST.`;
}

function getSwimScheduleType(startH, endH) {
  const dur = endH - startH;
  if (dur <= 0.5) return 'Private Lesson';  // 30-min private
  if (dur <= 1) return 'Group Lesson';       // 1-hour group
  if (dur <= 2) return 'Extended Lesson';    // 2-hour Swimmer 7-9
  return 'Activity';
}

function getSwimAgeInfo(levelName, minAge) {
  // Map level to sensible ageMax
  if (/preschool/i.test(levelName)) return { ageMin: minAge || 3, ageMax: 5 };
  if (/swimmer [789]/i.test(levelName)) return { ageMin: 8, ageMax: null };
  if (/swimmer/i.test(levelName)) return { ageMin: minAge || 5, ageMax: null };
  if (/private/i.test(levelName)) return { ageMin: minAge || 3, ageMax: null };
  return { ageMin: minAge || 3, ageMax: null };
}

function getSwimDescription(levelName, address, neighbourhood, price) {
  const loc = neighbourhood || address.split(',')[0];
  return `Pedalheads swim lessons at ${loc} — ${levelName}. ` +
    `Certified in-water instructors, small groups, $${price}/week. ` +
    `Registration opens April 7 at 10am PST.`;
}

// ── Discover all PE IDs for a list of location IDs ────────────────────────────
// Only include programs starting June 2026 or later (summer programs only)
const SUMMER_START = '2026-06-01';

async function discoverPEsForLocations(locIds, label) {
  const peToLocId = {};
  const peToCamps = {};
  let found = 0, skippedSpring = 0;

  for (const locId of locIds) {
    const data = await fetchJSON('https://api.pedalheads.com/api/search/camps/', {
      province_state_id: PROVINCE_STATE_ID,
      location_id: locId,
    });
    const camps = data.data?.camps || [];
    camps.forEach(c => {
      const peId = String(c.ProgramEventId);
      const startDate = c.event_start?.substring(0, 10);
      // Only include summer programs (June 2026+)
      if (startDate && startDate < SUMMER_START) { skippedSpring++; return; }
      if (!peToLocId[peId]) {
        peToLocId[peId] = locId;
        peToCamps[peId] = c;
        found++;
      }
    });
    await new Promise(r => setTimeout(r, 150));
  }
  console.log(`${label}: ${found} summer PE IDs, ${skippedSpring} spring PEs skipped`);
  return { peToLocId, peToCamps };
}

// ── Fetch levels for all PE IDs ───────────────────────────────────────────────
async function fetchAllLevels(peIds, label) {
  const peLevels = {};
  let ok = 0, empty = 0;

  for (const peId of peIds) {
    try {
      const data = await fetchJSON('https://api.pedalheads.com/api/search/camp-levels/', {
        program_event_id: peId,
        province_state_id: PROVINCE_STATE_ID,
        skill_level_ids: [],
        ages: [],
        time_blocks: [],
      });
      const levels = Object.values(data.data || {});
      if (levels.length > 0) {
        peLevels[peId] = levels.map(lv => ({
          skillLevelId: lv.SkillLevelId,
          name: normalizeName(lv.SkillLevelName),
          programId: String(lv.ProgramId),
          minAge: parseInt(lv.MinimumAge) || 3,
          times: Object.values(lv.times || {}).map(t => ({
            catTimeId: t.CategoryTimeId,
            name: normalizeName(t.CategoryTimeName),
            start: t.StartingTime?.substring(0, 5) || '',
            end: t.EndingTime?.substring(0, 5) || '',
            price: Math.round(parseFloat(t.Price) || 0),
            available: t.Available !== false,
          })),
        }));
        ok++;
      } else {
        empty++;
      }
    } catch (e) {
      console.error(`  Error fetching levels for PE ${peId}: ${e.message}`);
      empty++;
    }
    await new Promise(r => setTimeout(r, 150));
  }
  console.log(`${label}: ${ok} PEs with levels, ${empty} empty/failed`);
  return peLevels;
}

async function main() {
  const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));
  console.log(`Loaded ${programs.length} programs`);

  // Get max existing ID
  let nextId = programs.reduce((max, p) => {
    const n = typeof p.id === 'number' ? p.id : parseInt(p.id) || 0;
    return Math.max(max, n);
  }, 0) + 1;

  // ── Categorize existing Pedalheads programs ──────────────────────────────────
  const ph = programs.filter(p => p.provider === 'Pedalheads');
  const otherProviders = programs.filter(p => p.provider !== 'Pedalheads');

  // Old "Soccer Camp" PE IDs that may be bike/trail
  const oldSoccerPeIds = new Set();
  const oldSoccerEntries = ph.filter(p => p.name === 'Soccer Camp');
  oldSoccerEntries.forEach(p => {
    const m = p.registrationUrl?.match(/program_event=(\d+)/);
    if (m) oldSoccerPeIds.add(m[1]);
  });

  const oldSwimEntries = ph.filter(p => p.name === 'Swim Lessons');

  // Programs to keep as-is (Cycling subcategory rebuilt in Session 2, combos, trail combos)
  const keepPh = ph.filter(p => {
    if (p.name === 'Soccer Camp') return false;       // will rebuild from real soccer PE IDs
    if (p.name === 'Swim Lessons') return false;       // will rebuild with level breakdown
    return true;                                        // keep Cycling, combos, etc.
  });

  console.log(`\nExisting Pedalheads: ${ph.length} total`);
  console.log(`  Will delete: ${oldSoccerEntries.length} old Soccer Camp + ${oldSwimEntries.length} Swim Lessons`);
  console.log(`  Will keep: ${keepPh.length} (Cycling, combos, trail-swim)`);

  // ── Phase 1: Soccer rebuild ──────────────────────────────────────────────────
  console.log('\n=== Phase 1: Soccer Camps ===');
  const SOCCER_LOC_IDS = Object.keys(SOCCER_LOCATIONS);

  const { peToLocId: soccerPeToLoc, peToCamps: soccerCamps } =
    await discoverPEsForLocations(SOCCER_LOC_IDS, 'Soccer');

  const soccerPeLevels = await fetchAllLevels(Object.keys(soccerPeToLoc), 'Soccer levels');

  const newSoccerPrograms = [];
  for (const [peId, levels] of Object.entries(soccerPeLevels)) {
    const locId = soccerPeToLoc[peId];
    const camp = soccerCamps[peId];
    const locMeta = SOCCER_LOCATIONS[locId] || { address: `Soccer, ${locId}`, neighbourhood: 'Unknown', city: 'Vancouver' };

    // Get lat/lng from API (via rough reverse lookup — not available directly)
    // We'll use the existing soccer program lat/lng if available
    const existingWithLoc = programs.find(p => {
      if (p.provider !== 'Pedalheads') return false;
      const m = p.registrationUrl?.match(/program_event=(\d+)/);
      return m && soccerPeToLoc[m[1]] === locId && p.lat;
    });
    const lat = existingWithLoc?.lat || null;
    const lng = existingWithLoc?.lng || null;

    const startDate = camp?.event_start?.substring(0, 10);
    const endDate = camp?.event_end?.substring(0, 10);
    const dayCount = camp?.day_count || 5;

    for (const lv of levels) {
      // Only soccer levels (PID=1012) or unset
      if (lv.programId && lv.programId !== '1012' && lv.programId !== '0') continue;

      const levelName = lv.name;
      const ageMax = getSoccerAgeMax(levelName);

      for (const time of lv.times) {
        const startH = parseInt(time.start.split(':')[0]);
        const endH = parseInt(time.end.split(':')[0]);
        const scheduleType = getSoccerScheduleType(startH, endH);

        // API sometimes returns price=0 for adapted/subsidized programs — use null+note
        const hasValidPrice = time.price > 0;
        const costNote = !hasValidPrice ? 'Adapted/subsidized program — contact Pedalheads for pricing details' : undefined;

        const entry = {
          id: nextId++,
          name: `Soccer Camp – ${levelName}`,
          provider: 'Pedalheads',
          category: 'Sports',
          subcategory: 'Soccer',
          campType: 'Summer Camp',
          scheduleType,
          ageMin: lv.minAge,
          ageMax,
          startDate,
          endDate,
          days: dayCount === 4 ? 'Mon-Thu' : 'Mon-Fri',
          startTime: formatTime(time.start + ':00'),
          endTime: formatTime(time.end + ':00'),
          cost: hasValidPrice ? time.price : null,
          ...(costNote && { costNote }),
          indoorOutdoor: locMeta.address.includes('Indoor') || String(locId) === '1717' ||
                         String(locId) === '1723' || String(locId) === '1857' || String(locId) === '1778'
                         ? 'Indoor' : 'Outdoor',
          neighbourhood: locMeta.neighbourhood,
          address: locMeta.address,
          ...(lat && { lat }),
          ...(lng && { lng }),
          enrollmentStatus: time.available ? 'Open' : 'Full',
          registrationUrl: buildSoccerUrl(peId, lv.skillLevelId, time.catTimeId),
          registrationDate: '2026-04-07',
          registrationDateLabel: 'April 7 at 10am PST',
          description: getSoccerDescription(levelName, locMeta.address, locMeta.neighbourhood, scheduleType, time.price),
          tags: ['soccer', 'sports', scheduleType.toLowerCase().replace(' ', '-')],
          activityType: 'Soccer',
          confirmed2026: true,
          priceVerified: hasValidPrice,
          season: 'Summer 2026',
          durationPerDay: endH - startH,
          status: time.available ? 'Open' : 'Full',
          // If date span > 35 days, flag as repeating weekly program
          ...(startDate && endDate && (new Date(endDate) - new Date(startDate)) / 86400000 > 35
            ? { repeating: true } : {}),
        };

        newSoccerPrograms.push(entry);
      }
    }
  }
  console.log(`Built ${newSoccerPrograms.length} soccer entries`);

  // ── Phase 2: Handle misclassified "Soccer Camp" bike/trail PE IDs ────────────
  console.log('\n=== Phase 2: Misclassified Soccer Camp PE IDs (bike/trail) ===');

  // Find the 47 old soccer PE IDs that have no Cycling entry (not yet rebuilt)
  const cyclingPeIds = new Set();
  ph.filter(p => p.subcategory === 'Cycling').forEach(p => {
    const m = p.registrationUrl?.match(/program_event=(\d+)/);
    if (m) cyclingPeIds.add(m[1]);
  });

  const unresolvedSoccerPeIds = [...oldSoccerPeIds].filter(peId => !cyclingPeIds.has(peId));
  console.log(`Old Soccer Camp PE IDs: ${oldSoccerPeIds.size}, already rebuilt as Cycling: ${oldSoccerPeIds.size - unresolvedSoccerPeIds.length}, need checking: ${unresolvedSoccerPeIds.length}`);

  // Fetch levels for unresolved soccer PE IDs
  const unresolvedLevels = await fetchAllLevels(unresolvedSoccerPeIds, 'Unresolved soccer PE IDs');

  // For any that return bike/trail data (ProgramId=1), build proper bike entries
  const rescuedBikePrograms = [];
  const existingOldSoccer = new Map();
  oldSoccerEntries.forEach(p => {
    const m = p.registrationUrl?.match(/program_event=(\d+)/);
    if (m && !existingOldSoccer.has(m[1])) existingOldSoccer.set(m[1], p);
  });

  for (const [peId, levels] of Object.entries(unresolvedLevels)) {
    const bikeLevels = levels.filter(lv => lv.programId === '1' || lv.programId === '0');
    if (bikeLevels.length === 0) continue;

    // Use old soccer entry as metadata source (address, neighbourhood, lat, lng)
    const oldEntry = existingOldSoccer.get(peId);
    if (!oldEntry) continue;

    for (const lv of bikeLevels) {
      const levelName = lv.name;
      const isTrail = /trail rider/i.test(levelName);
      const isPrivate = /private/i.test(levelName);
      const isFutureNewbees = /future newbee/i.test(levelName);

      // Build program name
      const lvMatch = levelName.match(/Level (\d)/);
      let programName;
      if (isPrivate) programName = 'Bike Camp – Private Lesson';
      else if (isTrail) programName = `Bike Camp – ${levelName}`;
      else if (isFutureNewbees) programName = 'Bike Camp – Future Newbees';
      else if (lvMatch) {
        const baseName = levelName.replace(/^Level \d+ - /, '');
        programName = `Bike Camp Level ${lvMatch[1]} – ${baseName}`;
      } else {
        programName = `Bike Camp – ${levelName}`;
      }

      for (const time of lv.times) {
        const startH = parseInt(time.start.split(':')[0]);
        const endH = parseInt(time.end.split(':')[0]);
        const dur = endH - startH;
        const scheduleType = dur >= 6 ? 'Full Day' : startH < 12 ? 'Half Day AM' : 'Half Day PM';

        if (isPrivate && dur > 2) continue; // Skip if private but looks like full day (data error)

        rescuedBikePrograms.push({
          id: nextId++,
          name: programName,
          provider: 'Pedalheads',
          category: 'Sports',
          subcategory: 'Cycling',
          campType: 'Summer Camp',
          scheduleType: dur >= 6 ? 'Full Day' : isPrivate ? 'Private' : 'Half Day',
          ageMin: lv.minAge,
          ageMax: null, // Pedalheads uses "ages X and up"
          startDate: oldEntry.startDate,
          endDate: oldEntry.endDate,
          days: oldEntry.days || 'Mon-Fri',
          startTime: formatTime(time.start + ':00'),
          endTime: formatTime(time.end + ':00'),
          cost: time.price,
          indoorOutdoor: 'Outdoor',
          neighbourhood: oldEntry.neighbourhood,
          address: oldEntry.address,
          lat: oldEntry.lat,
          lng: oldEntry.lng,
          enrollmentStatus: time.available ? 'Open' : 'Full',
          registrationUrl: `https://pedalheads.com/en/camp/details?region=1&program_event=${peId}&skill_level=${lv.skillLevelId}&category_time=${time.catTimeId}`,
          registrationDate: '2026-04-07',
          registrationDateLabel: 'April 7 at 10am PST',
          description: `Pedalheads ${programName} at ${oldEntry.neighbourhood}. Ages ${lv.minAge}+. Registration opens April 7, 2026.`,
          tags: isTrail ? ['biking', 'trail-riding'] : ['biking', 'cycling'],
          activityType: 'Cycling',
          confirmed2026: true,
          priceVerified: true,
          season: 'Summer 2026',
          durationPerDay: dur,
          status: time.available ? 'Open' : 'Full',
        });
      }
    }
  }
  console.log(`Rescued ${rescuedBikePrograms.length} bike/trail entries from mislabeled Soccer Camp PEs`);

  // ── Phase 3: Swim rebuild ────────────────────────────────────────────────────
  console.log('\n=== Phase 3: Swim Lessons ===');
  const SWIM_LOC_IDS = Object.keys(SWIM_LOCATIONS);

  const { peToLocId: swimPeToLoc, peToCamps: swimCamps } =
    await discoverPEsForLocations(SWIM_LOC_IDS, 'Swim');

  const swimPeLevels = await fetchAllLevels(Object.keys(swimPeToLoc), 'Swim levels');

  const newSwimPrograms = [];
  for (const [peId, levels] of Object.entries(swimPeLevels)) {
    const locId = swimPeToLoc[peId];
    const camp = swimCamps[peId];
    const locMeta = SWIM_LOCATIONS[locId] || { address: `Swim, ${locId}`, neighbourhood: 'Unknown', city: 'Vancouver' };

    const startDate = camp?.event_start?.substring(0, 10);
    const endDate = camp?.event_end?.substring(0, 10);
    const dayCount = camp?.day_count || 5;

    for (const lv of levels) {
      // Only swim levels (PID=2 or PID=1002)
      if (lv.programId && !['2', '1002', '0'].includes(lv.programId)) continue;

      const levelName = lv.name;
      const ageInfo = getSwimAgeInfo(levelName, lv.minAge);

      for (const time of lv.times) {
        const startH = parseInt(time.start.split(':')[0]);
        const endH = parseInt(time.end.split(':')[0]);
        const dur = endH - startH;
        const scheduleType = getSwimScheduleType(startH, endH);

        const isPrivate = /private/i.test(levelName);
        const campType = isPrivate ? 'Private Lesson' : 'Weekly Class';

        const entry = {
          id: nextId++,
          name: `Swim Lessons – ${levelName}`,
          provider: 'Pedalheads',
          category: 'Sports',
          subcategory: 'Swimming',
          campType,
          scheduleType,
          ageMin: ageInfo.ageMin,
          ageMax: ageInfo.ageMax,
          startDate,
          endDate,
          days: dayCount === 4 ? 'Mon-Thu' : 'Mon-Fri',
          startTime: formatTime(time.start + ':00'),
          endTime: formatTime(time.end + ':00'),
          cost: time.price,
          indoorOutdoor: lv.programId === '1002' ? 'Outdoor' : 'Indoor',
          neighbourhood: locMeta.neighbourhood,
          address: locMeta.address,
          enrollmentStatus: time.available ? 'Open' : 'Full',
          registrationUrl: `https://pedalheads.com/en/camp/details?region=1&program_event=${peId}&skill_level=${lv.skillLevelId}&category_time=${time.catTimeId}`,
          registrationDate: '2026-04-07',
          registrationDateLabel: 'April 7 at 10am PST',
          description: getSwimDescription(levelName, locMeta.address, locMeta.neighbourhood, time.price),
          tags: ['swimming', 'water safety', 'lessons', isPrivate ? 'private' : 'group'],
          activityType: 'Swimming',
          confirmed2026: true,
          priceVerified: true,
          season: 'Summer 2026',
          durationPerDay: Math.max(dur, 0.5),
          status: time.available ? 'Open' : 'Full',
          // If date span > 35 days, flag as repeating weekly program
          ...(startDate && endDate && (new Date(endDate) - new Date(startDate)) / 86400000 > 35
            ? { repeating: true } : {}),
        };

        newSwimPrograms.push(entry);
      }
    }
  }
  console.log(`Built ${newSwimPrograms.length} swim entries`);

  // ── Assemble final dataset ────────────────────────────────────────────────────
  const finalPrograms = [
    ...otherProviders,
    ...keepPh,
    ...rescuedBikePrograms,
    ...newSoccerPrograms,
    ...newSwimPrograms,
  ];
  finalPrograms.sort((a, b) => (a.id || 0) - (b.id || 0));

  fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(finalPrograms, null, 2));

  console.log(`\n=== Summary ===`);
  console.log(`Before: ${programs.length}`);
  console.log(`After:  ${finalPrograms.length}`);
  console.log(`Change: ${finalPrograms.length > programs.length ? '+' : ''}${finalPrograms.length - programs.length}`);
  console.log(`  Deleted: ${oldSoccerEntries.length} old Soccer Camp + ${oldSwimEntries.length} old Swim Lessons`);
  console.log(`  Added:   ${newSoccerPrograms.length} soccer + ${newSwimPrograms.length} swim + ${rescuedBikePrograms.length} rescued bike`);

  // Count by type
  const ph2 = finalPrograms.filter(p => p.provider === 'Pedalheads');
  const byCat = {};
  ph2.forEach(p => {
    const k = p.subcategory || p.category;
    byCat[k] = (byCat[k] || 0) + 1;
  });
  console.log('\nPedalheads by subcategory:');
  Object.entries(byCat).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log(`  ${k}: ${n}`));
}

main().catch(e => { console.error(e); process.exit(1); });
