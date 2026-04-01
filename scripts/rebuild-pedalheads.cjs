#!/usr/bin/env node
/**
 * rebuild-pedalheads.cjs
 *
 * Rebuilds all Pedalheads bike camp programs in programs.json with:
 * - Correct skill-level names (Level 1–5 + Private)
 * - Correct ages per level
 * - Correct prices from Pedalheads API (not Victoria prices)
 * - Correct registration URLs per level
 *
 * Scope: Metro Vancouver bike camps only (this pass).
 *        Swim, soccer, trail riding, and non-Metro cities are left unchanged.
 *
 * API: https://api.pedalheads.com/api/search/camp-levels/
 *      POST {program_event_id, province_state_id: 1}
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '../src/data/programs.json');
const PROVINCE_STATE_ID = 1; // BC

// Map from Pedalheads internal program ID to activity type
const PROGRAM_ID_MAP = {
  '1': 'Bike',
  '2': 'Swim',
  '3': 'Soccer',
  '4': 'Trail',
};

// Level name normalization: maps API names to display names
function normalizeLevelName(rawName) {
  if (!rawName || typeof rawName === 'object') {
    rawName = (rawName && rawName.default) ? rawName.default : 'Unknown Level';
  }
  return rawName.trim();
}

// Maps level name patterns to skill level number (1-5) for description
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

// Determine the schedule type from category time name and times
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

// Format time from "HH:MM:00.000" to "H:MM AM/PM"
function formatTime(rawTime) {
  if (!rawTime) return null;
  const [h, m] = rawTime.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}

function buildRegistrationUrl(programEventId, skillLevelId, categoryTimeId) {
  return `https://pedalheads.com/en/camp/details?region=1&program_event=${programEventId}&skill_level=${skillLevelId}&category_time=${categoryTimeId}`;
}

async function fetchLevels(programEventId) {
  const resp = await fetch('https://api.pedalheads.com/api/search/camp-levels/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://pedalheads.com',
      'Referer': 'https://pedalheads.com/en/camp',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
    },
    body: JSON.stringify({
      program_event_id: String(programEventId),
      province_state_id: PROVINCE_STATE_ID,
      skill_level_ids: [],
      ages: [],
      time_blocks: [],
    }),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for program_event ${programEventId}`);
  const data = await resp.json();
  if (!data.success) {
    console.warn(`  API error for PE ${programEventId}: ${data.message}`);
    return null;
  }
  return data.data; // object keyed by skill_level_id
}

async function main() {
  const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));
  const ph = programs.filter(p => p.provider === 'Pedalheads');
  const other = programs.filter(p => p.provider !== 'Pedalheads');

  console.log(`Total programs: ${programs.length}, Pedalheads: ${ph.length}`);

  // Step 1: Collect all unique program events and their location metadata
  // Key: programEventId → location info (from existing DB)
  const peLocationMap = {}; // programEventId → {address, neighbourhood, lat, lng, startDate, endDate, days, startTime, endTime}

  for (const p of ph) {
    const m = p.registrationUrl?.match(/program_event=(\d+)/);
    if (!m) continue;
    const peId = m[1];
    if (!peLocationMap[peId]) {
      peLocationMap[peId] = {
        address: p.address,
        neighbourhood: p.neighbourhood,
        lat: p.lat,
        lng: p.lng,
        startDate: p.startDate,
        endDate: p.endDate,
        days: p.days || 'Mon-Fri',
      };
    }
  }

  console.log(`Unique program events in DB: ${Object.keys(peLocationMap).length}`);

  // Step 2: Determine which program events are "bike camp" events (not swim/soccer)
  // We identify bike camp events by looking at existing entries that are NOT swim/soccer/trail
  const bikeCampPeIds = new Set();
  const swimPeIds = new Set();
  const soccerPeIds = new Set();
  const trailPeIds = new Set();
  const comboPeIds = new Set(); // Bike+Soccer combo etc.

  for (const p of ph) {
    const m = p.registrationUrl?.match(/program_event=(\d+)/);
    if (!m) continue;
    const peId = m[1];
    const name = (p.name || '').toLowerCase();
    if (name.includes('swim')) { swimPeIds.add(peId); continue; }
    if (name.includes('soccer') && !name.includes('bike')) { soccerPeIds.add(peId); continue; }
    if (name.includes('trail')) { trailPeIds.add(peId); continue; }
    if (name.includes('combo')) { comboPeIds.add(peId); continue; }
    // Default: treat as bike camp
    bikeCampPeIds.add(peId);
  }

  console.log(`Bike camp PEs: ${bikeCampPeIds.size}, swim: ${swimPeIds.size}, soccer: ${soccerPeIds.size}, trail: ${trailPeIds.size}, combo: ${comboPeIds.size}`);

  // Step 3: Fetch levels for all bike camp program events
  const peLevels = {}; // peId → array of level objects
  const peIds = Array.from(bikeCampPeIds);

  console.log(`\nFetching levels for ${peIds.length} bike camp program events...`);
  let fetched = 0;
  let failed = 0;

  for (const peId of peIds) {
    try {
      const levelsData = await fetchLevels(peId);
      if (levelsData && Object.keys(levelsData).length > 0) {
        peLevels[peId] = Object.values(levelsData).map(lv => ({
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
        console.warn(`  No level data for PE ${peId}`);
        failed++;
      }
    } catch (e) {
      console.error(`  Error fetching PE ${peId}: ${e.message}`);
      failed++;
    }
    // Delay to avoid API rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`Fetched: ${fetched}, Failed: ${failed}`);

  // Step 4: Build new program entries from level data
  // We keep non-bike-camp programs unchanged
  const nonBikePhPrograms = ph.filter(p => {
    const m = p.registrationUrl?.match(/program_event=(\d+)/);
    if (!m) return true;
    return !bikeCampPeIds.has(m[1]);
  });

  console.log(`\nNon-bike PH programs kept: ${nonBikePhPrograms.length}`);

  // Get the max existing numeric ID (some programs have string IDs)
  let nextId = programs.reduce((max, p) => {
    const n = typeof p.id === 'number' ? p.id : (Number.isInteger(parseInt(p.id)) ? parseInt(p.id) : 0);
    return Math.max(max, n);
  }, 0) + 1;

  const newBikePrograms = [];
  let skippedPe = 0;

  for (const peId of peIds) {
    const loc = peLocationMap[peId];
    const levels = peLevels[peId];

    if (!levels || !loc) {
      skippedPe++;
      continue;
    }

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

        // Build program name: "Bike Camp Level 1 – Newbees (Full Day)"
        const baseLevelName = levelName.replace(/^Level \d+ - /, '').replace(/^Private Lesson$/, 'Private Lesson');
        let programName;
        if (isPrivate) {
          programName = 'Bike Camp – Private Lesson';
        } else if (levelNum !== null && levelNum !== 'trail1' && levelNum !== 'trail2') {
          programName = `Bike Camp Level ${levelNum} – ${baseLevelName}`;
        } else {
          programName = `Bike Camp – ${levelName}`;
        }

        // Determine scheduleType for DB field
        let dbScheduleType;
        if (scheduleType === 'Full Day') dbScheduleType = 'Full Day';
        else if (scheduleType === 'Private') dbScheduleType = 'Private';
        else dbScheduleType = 'Half Day';

        // Duration
        const startH = parseInt(timeSlot.start.split(':')[0]);
        const endH = parseInt(timeSlot.end.split(':')[0]);
        const duration = endH - startH;

        const entry = {
          id: nextId++,
          name: programName,
          provider: 'Pedalheads',
          category: 'Sports',
          subcategory: 'Cycling',
          campType: 'Summer Camp',
          scheduleType: dbScheduleType,
          ageMin: level.minAge,
          ageMax: isPrivate ? 17 : (levelNum >= 4 ? 17 : 12),
          startDate: loc.startDate,
          endDate: loc.endDate,
          days: loc.days || 'Mon-Fri',
          startTime: startTime,
          endTime: endTime,
          cost: timeSlot.price,
          indoorOutdoor: 'Outdoor',
          neighbourhood: loc.neighbourhood,
          address: loc.address,
          lat: loc.lat,
          lng: loc.lng,
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

  console.log(`New bike camp entries generated: ${newBikePrograms.length}`);
  console.log(`Skipped program events (no data): ${skippedPe}`);

  // Preserve old bike camp programs for PEs where API returned no data
  // These are kept unchanged rather than being silently dropped
  const noDataPeIds = new Set(peIds.filter(id => !peLevels[id]));
  const preservedOldBike = ph.filter(p => {
    const m = p.registrationUrl?.match(/program_event=(\d+)/);
    return m && noDataPeIds.has(m[1]) && bikeCampPeIds.has(m[1]);
  });
  console.log(`Preserved old bike entries (no API data): ${preservedOldBike.length}`);

  // Step 5: Assemble final programs array
  const finalPrograms = [...other, ...nonBikePhPrograms, ...preservedOldBike, ...newBikePrograms];

  // Sort by id
  finalPrograms.sort((a, b) => (a.id || 0) - (b.id || 0));

  // Write
  fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(finalPrograms, null, 2));
  console.log(`\nWrote ${finalPrograms.length} total programs (was ${programs.length})`);
  console.log(`Change: ${finalPrograms.length - programs.length > 0 ? '+' : ''}${finalPrograms.length - programs.length}`);
}

function buildDescription(programName, levelName, minAge, scheduleType, price) {
  const timeDesc = scheduleType === 'Full Day' ? '9:00 AM–4:00 PM' :
                   scheduleType === 'Half Day AM' ? '9:00 AM–12:00 PM' :
                   scheduleType === 'Half Day PM' ? '1:00 PM–4:00 PM' :
                   scheduleType === 'Private' ? 'individual session' : scheduleType;
  return `Pedalheads ${programName} — ${scheduleType} (${timeDesc}, $${price}). ` +
    `Ages ${minAge}+. ${getLevelDescription(levelName)} Registration opens April 7, 2026.`;
}

function getLevelDescription(levelName) {
  const n = levelName.toLowerCase();
  if (n.includes('newbee') && n.includes('future')) return 'For kids on balance bikes or training wheels.';
  if (n.includes('newbee') && !n.includes('advanced')) return 'For kids learning to ride without training wheels.';
  if (n.includes('advanced newbee')) return 'For kids who can ride short distances on two wheels.';
  if (n.includes('level 3') || n.includes('pedalhead') && !n.includes('advanced')) return 'For confident two-wheel riders working on skills.';
  if (n.includes('advanced pedalhead') || n.includes('level 4')) return 'For skilled riders advancing technique.';
  if (n.includes('gearhead') || n.includes('level 5')) return 'For experienced riders tackling advanced challenges.';
  if (n.includes('private')) return 'One-on-one coaching with an experienced instructor.';
  if (n.includes('trail rider 1')) return 'For riders who can ride a two-wheeler — intro to trails.';
  if (n.includes('trail rider 2')) return 'For confident riders ready for more advanced trail features.';
  return 'Skill-based biking program.';
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

main().catch(e => { console.error(e); process.exit(1); });
