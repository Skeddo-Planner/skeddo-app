#!/usr/bin/env node
/**
 * rebuild-pedalheads-v2.cjs
 *
 * Comprehensive rebuild of ALL Pedalheads bike camp programs across ALL Metro Van cities.
 *
 * What this does:
 * 1. Queries the Pedalheads locations API for all Metro Van cities to find all bike locations
 * 2. For each location, queries search/camps to discover ALL program event IDs
 * 3. For each unique bike PE ID, queries camp-levels to get level/price/time data
 * 4. Builds properly structured entries (Level 1, Level 2, etc.) for each location
 * 5. Keeps all non-bike Pedalheads programs (swim, soccer, trail, combo) unchanged
 *
 * Metro Vancouver cities covered:
 * Vancouver (3), Burnaby (1007), Coquitlam (1004), North Vancouver (2),
 * Richmond (1003), Surrey (1012), West Vancouver (1002), Langley (1013),
 * Port Coquitlam (3166), Delta (1010), Tsawwassen (3093)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '../src/data/programs.json');
const PROVINCE_STATE_ID = 1; // BC

// Metro Van city IDs (from Pedalheads API)
const METRO_VAN_CITY_IDS = [3, 1007, 1004, 2, 1003, 1012, 1002, 1013, 3166, 1010, 3093];

// Neighbourhood names derived from location API names (first segment before " - ")
// Also manual overrides for known locations
const NEIGHBOURHOOD_OVERRIDES = {
  '1': 'Lynn Valley',
  '2': 'Point Grey',
  '4': 'No. 2 Rd & Blundell',
  '1001': 'White Rock',
  '1002': 'Como Lake',
  '1003': 'Ambleside',
  '1004': 'Little Mountain',
  '1006': 'Walnut Grove',
  '1010': 'Pinetree',
  '1013': 'Sunshine Hills',
  '1014': 'Beach Grove',
  '1161': 'Lynn Valley',
  '1254': 'South Burnaby',
  '1307': 'Arbutus Ridge',
  '1353': 'Hastings-Sunrise',
  '1498': 'Port Coquitlam',
  '1545': 'Johnston Heights',
  '1614': 'Oakridge',
  '1628': 'Mount Pleasant',
  '1655': 'Como Lake',
  '1677': 'Cloverdale',
  '1678': 'Lonsdale',
  '1699': 'False Creek',
  '1755': 'Brentwood',
  '1853': 'Renfrew',
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

function normalizeLevelName(rawName) {
  if (!rawName || typeof rawName === 'object') {
    return (rawName && rawName.default) ? rawName.default.trim() : 'Unknown Level';
  }
  return rawName.trim();
}

function getLevelNumber(name) {
  if (/level\s*1/i.test(name)) return 1;
  if (/level\s*2/i.test(name)) return 2;
  if (/level\s*3/i.test(name)) return 3;
  if (/level\s*4/i.test(name)) return 4;
  if (/level\s*5/i.test(name)) return 5;
  if (/private/i.test(name)) return 'private';
  if (/future newbee/i.test(name)) return 0;
  if (/trail rider 1/i.test(name)) return 'trail1';
  if (/trail rider 2/i.test(name)) return 'trail2';
  return null;
}

function getScheduleType(catTimeName, startTime, endTime) {
  const name = (catTimeName || '').toLowerCase();
  if (name.includes('private')) return 'Private';
  const start = parseInt((startTime || '00:00').split(':')[0]);
  const end = parseInt((endTime || '00:00').split(':')[0]);
  const duration = end - start;
  if (duration >= 6) return 'Full Day';
  if (start < 12) return 'Half Day AM';
  return 'Half Day PM';
}

function formatTime(rawTime) {
  if (!rawTime) return null;
  const [h, m] = rawTime.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}

function buildRegistrationUrl(peId, skillLevelId, catTimeId) {
  return `https://pedalheads.com/en/camp/details?region=1&program_event=${peId}&skill_level=${skillLevelId}&category_time=${catTimeId}`;
}

function getLevelDescription(levelName) {
  const n = levelName.toLowerCase();
  if (n.includes('newbee') && n.includes('future')) return 'For kids on balance bikes or training wheels.';
  if (n.includes('newbee') && !n.includes('advanced')) return 'For kids learning to ride without training wheels.';
  if (n.includes('advanced newbee')) return 'For kids who can ride short distances on two wheels.';
  if (n.includes('level 3') || (n.includes('pedalhead') && !n.includes('advanced'))) return 'For confident two-wheel riders working on skills.';
  if (n.includes('advanced pedalhead') || n.includes('level 4')) return 'For skilled riders advancing technique.';
  if (n.includes('gearhead') || n.includes('level 5')) return 'For experienced riders tackling advanced challenges.';
  if (n.includes('private')) return 'One-on-one coaching with an experienced instructor.';
  if (n.includes('trail rider 1')) return 'For riders who can ride a two-wheeler — intro to trails.';
  if (n.includes('trail rider 2')) return 'For confident riders ready for more advanced trail features.';
  return 'Skill-based biking program.';
}

function buildDescription(programName, levelName, minAge, scheduleType, price) {
  const timeDesc = scheduleType === 'Full Day' ? '9:00 AM–4:00 PM' :
                   scheduleType === 'Half Day AM' ? '9:00 AM–12:00 PM' :
                   scheduleType === 'Half Day PM' ? '1:00 PM–4:00 PM' :
                   scheduleType === 'Private' ? 'individual session' : scheduleType;
  return `Pedalheads ${programName} — ${scheduleType} (${timeDesc}, $${price}). ` +
    `Ages ${minAge}+. ${getLevelDescription(levelName)} Registration opens April 7, 2026.`;
}

function buildTags(levelName, scheduleType) {
  const tags = ['biking', 'cycling'];
  const n = levelName.toLowerCase();
  if (n.includes('private')) tags.push('private-lesson');
  if (n.includes('trail')) tags.push('trail-riding');
  if (n.includes('newbee')) tags.push('beginner');
  if (n.includes('level 4') || n.includes('level 5') || n.includes('gearhead') || n.includes('advanced pedalhead')) tags.push('advanced');
  if (scheduleType.includes('Half Day')) tags.push('half-day');
  return tags;
}

async function main() {
  const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));
  const ph = programs.filter(p => p.provider === 'Pedalheads');
  const other = programs.filter(p => p.provider !== 'Pedalheads');

  console.log(`Total programs: ${programs.length}, Pedalheads: ${ph.length}`);

  // ── Step 1: Discover all bike locations for Metro Van ──────────────────────
  console.log('\nStep 1: Discovering bike locations...');
  const allBikeLocs = {}; // locationId → location object from API

  for (const cityId of METRO_VAN_CITY_IDS) {
    const data = await fetchJSON('https://api.pedalheads.com/api/search/locations/', {
      province_state_id: PROVINCE_STATE_ID,
      cityIds: [cityId],
    });
    const locs = Object.values(data.data?.locations || {});
    // Only include locations where program_id = 1 (Bike)
    locs.filter(l => String(l.program_id) === '1').forEach(l => {
      allBikeLocs[l.id] = l;
    });
    await new Promise(r => setTimeout(r, 300));
  }
  console.log(`Found ${Object.keys(allBikeLocs).length} bike locations across Metro Van`);

  // ── Step 2: Discover all bike PE IDs from the API ─────────────────────────
  console.log('\nStep 2: Discovering program events per location...');
  const peToLocId = {};   // PE ID → location ID
  const peToCamps = {};  // PE ID → camp metadata from search/camps

  for (const [locId, loc] of Object.entries(allBikeLocs)) {
    const data = await fetchJSON('https://api.pedalheads.com/api/search/camps/', {
      province_state_id: PROVINCE_STATE_ID,
      location_id: locId,
    });
    const camps = data.data?.camps || [];
    for (const camp of camps) {
      const peId = camp.ProgramEventId;
      if (!peToLocId[peId]) {
        peToLocId[peId] = locId;
        peToCamps[peId] = camp;
      }
    }
    await new Promise(r => setTimeout(r, 200));
  }

  const allBikePeIds = Object.keys(peToLocId);
  console.log(`Discovered ${allBikePeIds.length} unique bike PE IDs from API`);

  // ── Step 3: Build address/neighbourhood lookup from existing DB ────────────
  // Key: PE ID → {address, neighbourhood, lat, lng} from existing entries
  const peToExistingMeta = {};
  ph.forEach(p => {
    const m = p.registrationUrl?.match(/program_event=(\d+)/);
    if (!m) return;
    const peId = m[1];
    if (!peToExistingMeta[peId] && p.address) {
      peToExistingMeta[peId] = {
        address: p.address,
        neighbourhood: p.neighbourhood,
        lat: p.lat,
        lng: p.lng,
      };
    }
  });

  // ── Step 4: Fetch camp levels for all bike PE IDs ─────────────────────────
  console.log('\nStep 3: Fetching camp levels for all bike PE IDs...');
  const peLevels = {}; // peId → array of level objects
  let fetched = 0, failed = 0;

  for (const peId of allBikePeIds) {
    try {
      const data = await fetchJSON('https://api.pedalheads.com/api/search/camp-levels/', {
        program_event_id: String(peId),
        province_state_id: PROVINCE_STATE_ID,
        skill_level_ids: [],
        ages: [],
        time_blocks: [],
      });
      if (data.success && data.data && Object.keys(data.data).length > 0) {
        peLevels[peId] = Object.values(data.data).map(lv => ({
          skillLevelId: lv.SkillLevelId,
          name: normalizeLevelName(lv.SkillLevelName),
          category: typeof lv.SkillCategoryName === 'object' ? lv.SkillCategoryName?.default || '' : lv.SkillCategoryName,
          minAge: parseInt(lv.MinimumAge) || 4,
          programId: lv.ProgramId,
          times: Object.values(lv.times || {}).map(t => ({
            catTimeId: t.CategoryTimeId,
            name: t.CategoryTimeName || '',
            start: t.StartingTime?.substring(0, 5) || '',
            end: t.EndingTime?.substring(0, 5) || '',
            price: Math.round(parseFloat(t.Price)),
            available: t.Available !== false,
          })),
        }));
        fetched++;
      } else {
        failed++;
      }
    } catch (e) {
      console.error(`  Error fetching levels for PE ${peId}: ${e.message}`);
      failed++;
    }
    await new Promise(r => setTimeout(r, 200));
  }
  console.log(`Levels fetched: ${fetched}, failed/empty: ${failed}`);

  // ── Step 5: Build new bike program entries ─────────────────────────────────
  console.log('\nStep 4: Building program entries...');

  // Get max existing ID
  let nextId = programs.reduce((max, p) => {
    const n = typeof p.id === 'number' ? p.id : parseInt(p.id) || 0;
    return Math.max(max, n);
  }, 0) + 1;

  const newBikePrograms = [];
  let skippedPe = 0;

  for (const peId of allBikePeIds) {
    const levels = peLevels[peId];
    if (!levels) {
      skippedPe++;
      continue;
    }

    const locId = peToLocId[peId];
    const loc = allBikeLocs[locId];
    const camp = peToCamps[peId];

    // Determine address/neighbourhood/lat/lng
    // Prefer existing DB data (which may have proper street addresses)
    // Fall back to API location data
    const existingMeta = peToExistingMeta[peId];
    const lat = existingMeta?.lat || parseFloat(loc?.latitude);
    const lng = existingMeta?.lng || parseFloat(loc?.longitude);

    let address, neighbourhood;
    if (existingMeta?.address) {
      address = existingMeta.address;
      neighbourhood = existingMeta.neighbourhood;
    } else {
      // Build address from location name: "Neighbourhood - Location Name, City, BC"
      const locName = loc?.name || '';
      // Clean up: remove content in parens that's just clarifying info
      const cleanName = locName.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
      address = `${cleanName}, ${loc?.city_name || 'Vancouver'}, BC`;
      neighbourhood = NEIGHBOURHOOD_OVERRIDES[locId] || locName.split(' - ')[0]?.trim() || loc?.city_name;
    }

    // Dates from camp data
    const startDate = camp?.event_start?.substring(0, 10);
    const endDate = camp?.event_end?.substring(0, 10);
    const dayCount = camp?.day_count || 5;

    for (const level of levels) {
      // Only include bike camp levels (programId=1 or no programId)
      if (level.programId && !['1', '0'].includes(String(level.programId))) continue;

      const levelName = level.name;
      const levelNum = getLevelNumber(levelName);
      const isPrivate = levelNum === 'private';

      for (const timeSlot of level.times) {
        const scheduleType = getScheduleType(timeSlot.name, timeSlot.start, timeSlot.end);
        const startTime = formatTime(timeSlot.start + ':00');
        const endTime = formatTime(timeSlot.end + ':00');

        // Build program name
        const baseLevelName = levelName.replace(/^Level \d+ - /, '');
        let programName;
        if (isPrivate) {
          programName = 'Bike Camp – Private Lesson';
        } else if (levelNum !== null && levelNum !== 'trail1' && levelNum !== 'trail2') {
          programName = `Bike Camp Level ${levelNum} – ${baseLevelName}`;
        } else {
          programName = `Bike Camp – ${levelName}`;
        }

        const startH = parseInt(timeSlot.start.split(':')[0]);
        const endH = parseInt(timeSlot.end.split(':')[0]);
        const duration = endH - startH;

        let dbScheduleType = scheduleType === 'Full Day' ? 'Full Day' :
                             scheduleType === 'Private' ? 'Private' : 'Half Day';

        const entry = {
          id: nextId++,
          name: programName,
          provider: 'Pedalheads',
          category: 'Sports',
          subcategory: 'Cycling',
          campType: 'Summer Camp',
          scheduleType: dbScheduleType,
          ageMin: level.minAge,
          // Pedalheads programs are "Ages X and up" with no stated maximum age.
          // Verified on registration pages: "Ages 4 and up", "Ages 6 and up", etc.
          ageMax: null,
          startDate,
          endDate,
          days: dayCount === 4 ? 'Mon-Thu' : 'Mon-Fri',
          startTime,
          endTime,
          cost: timeSlot.price,
          indoorOutdoor: 'Outdoor',
          neighbourhood,
          address,
          lat,
          lng,
          enrollmentStatus: timeSlot.available ? 'Open' : 'Full',
          registrationUrl: buildRegistrationUrl(peId, level.skillLevelId, timeSlot.catTimeId),
          registrationDate: '2026-04-07',
          registrationDateLabel: 'April 7 at 10am PST',
          description: buildDescription(programName, levelName, level.minAge, scheduleType, timeSlot.price),
          tags: buildTags(levelName, scheduleType),
          activityType: 'Cycling',
          confirmed2026: true,
          priceVerified: true,
          season: 'Summer 2026',
          durationPerDay: duration,
          status: timeSlot.available ? 'Open' : 'Full',
        };

        newBikePrograms.push(entry);
      }
    }
  }

  console.log(`New bike camp entries: ${newBikePrograms.length}`);
  console.log(`PE IDs with no level data (skipped): ${skippedPe}`);

  // ── Step 6: Keep non-bike Pedalheads programs unchanged ───────────────────
  // Non-bike = swim, soccer, trail, combo (identified by name pattern)
  const nonBikePhPrograms = ph.filter(p => {
    const name = (p.name || '').toLowerCase();
    const isBikeOnly = (name.includes('bike') || name.includes('cycling') || name.includes('learn to ride')) &&
                       !name.includes('soccer') && !name.includes('swim') && !name.includes('trail') && !name.includes('combo');
    // If it already has subcategory=Cycling, it was rebuilt before → drop (will be replaced)
    if (p.subcategory === 'Cycling') return false;
    // Keep swim, soccer, trail, combo, and non-bike programs
    return !isBikeOnly;
  });

  console.log(`Non-bike Pedalheads programs kept: ${nonBikePhPrograms.length}`);

  // ── Step 7: Preserve old bike entries where API gave no levels ─────────────
  // These are for PE IDs that exist in the DB but have no level data from API
  // We preserve them as-is rather than silently dropping them
  const resolvedPeIds = new Set(Object.keys(peLevels));
  const apiPeIds = new Set(allBikePeIds);

  const preservedOldBike = ph.filter(p => {
    const m = p.registrationUrl?.match(/program_event=(\d+)/);
    if (!m) return false;
    const peId = m[1];
    // If this PE ID is in the API but had no levels → preserve
    if (apiPeIds.has(peId) && !resolvedPeIds.has(peId)) return true;
    // If this PE ID is NOT in the API at all (may be old/expired) → check if it's bike
    if (!apiPeIds.has(peId)) {
      const name = (p.name || '').toLowerCase();
      const isBikeOnly = (name.includes('bike') || name.includes('learn to ride')) &&
                         !name.includes('soccer') && !name.includes('swim') && !name.includes('trail') && !name.includes('combo');
      return isBikeOnly && p.subcategory !== 'Cycling';
    }
    return false;
  });

  console.log(`Preserved old bike entries (no API levels): ${preservedOldBike.length}`);

  // ── Step 8: Assemble and write ─────────────────────────────────────────────
  const finalPrograms = [...other, ...nonBikePhPrograms, ...preservedOldBike, ...newBikePrograms];
  finalPrograms.sort((a, b) => (a.id || 0) - (b.id || 0));

  fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(finalPrograms, null, 2));
  console.log(`\nWrote ${finalPrograms.length} programs (was ${programs.length})`);
  console.log(`Change: ${finalPrograms.length > programs.length ? '+' : ''}${finalPrograms.length - programs.length}`);

  // Summary by city
  const newByCityAddr = {};
  newBikePrograms.forEach(p => {
    const city = (p.address || '').split(', ').slice(-2, -1)[0] || 'Unknown';
    newByCityAddr[city] = (newByCityAddr[city] || 0) + 1;
  });
  console.log('\nNew bike programs by city:');
  Object.entries(newByCityAddr).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${c}: ${n}`));
}

main().catch(e => { console.error(e); process.exit(1); });
