#!/usr/bin/env node
/**
 * Skeddo — Thorough Database Audit & Cleanup
 * Checks ALL programs in programs.json for data integrity issues.
 * Then writes a cleaned version back.
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

const VALID_CATEGORIES = [
  "Sports", "Arts", "STEM", "Music", "Outdoor", "Life Skills",
  "Academic", "Social", "Faith-Based", "Language", "Cultural",
];

const VALID_DAY_LENGTHS = ["Full Day", "Half Day", "Overnight"];
const VALID_ENROLLMENT_STATUSES = ["Open", "Closed", "Waitlist", "Full", "TBD", "Opening Soon", "Registration Required"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const URL_RE = /^https?:\/\//;

console.log('='.repeat(80));
console.log('  SKEDDO THOROUGH DATABASE AUDIT');
console.log('  Total programs loaded:', programs.length);
console.log('='.repeat(80));
console.log();

// ─────────────────────────────────────────────────────────
// 1. FIELD PRESENCE AUDIT
// ─────────────────────────────────────────────────────────
const FIELDS_TO_CHECK = [
  'id', 'name', 'provider', 'category', 'activityType',
  'ageMin', 'ageMax', 'cost',
  'startDate', 'endDate', 'days', 'startTime', 'endTime',
  'address', 'neighbourhood',
  'registrationUrl', 'enrollmentStatus', 'season', 'dayLength',
  'description',
];

const fieldCounts = {};
FIELDS_TO_CHECK.forEach(f => fieldCounts[f] = 0);

programs.forEach(p => {
  FIELDS_TO_CHECK.forEach(f => {
    const v = p[f];
    if (v !== undefined && v !== null && v !== '') {
      fieldCounts[f]++;
    }
  });
});

console.log('── 1. FIELD PRESENCE / COMPLETENESS ──');
console.log('Field'.padEnd(22) + 'Present'.padStart(8) + 'Missing'.padStart(8) + '  Coverage');
console.log('-'.repeat(55));
FIELDS_TO_CHECK.forEach(f => {
  const present = fieldCounts[f];
  const missing = programs.length - present;
  const pct = ((present / programs.length) * 100).toFixed(1);
  const bar = pct >= 95 ? '  OK' : pct >= 70 ? '  WARN' : '  BAD';
  console.log(f.padEnd(22) + String(present).padStart(8) + String(missing).padStart(8) + `  ${pct}%${bar}`);
});
console.log();

// ─────────────────────────────────────────────────────────
// 2. DUPLICATE DETECTION
// ─────────────────────────────────────────────────────────
console.log('── 2. DUPLICATE DETECTION ──');

// 2a. Same name + same provider (case-insensitive) — these are weekly sessions not dupes
const nameProviderMap = {};
programs.forEach((p, i) => {
  const key = `${(p.name || '').toLowerCase().trim()}|||${(p.provider || '').toLowerCase().trim()}`;
  if (!nameProviderMap[key]) nameProviderMap[key] = [];
  nameProviderMap[key].push({ index: i, id: p.id, startDate: p.startDate, endDate: p.endDate });
});

const nameProviderDupes = Object.entries(nameProviderMap).filter(([, v]) => v.length > 1);
// Only flag as TRUE dupes if they also share the same startDate
const trueDupes = [];
nameProviderDupes.forEach(([key, entries]) => {
  const dateMap = {};
  entries.forEach(e => {
    const dk = `${e.startDate}|${e.endDate}`;
    if (!dateMap[dk]) dateMap[dk] = [];
    dateMap[dk].push(e);
  });
  Object.entries(dateMap).forEach(([dk, group]) => {
    if (group.length > 1) {
      trueDupes.push({ key, dateKey: dk, entries: group });
    }
  });
});

console.log(`Programs sharing same name+provider: ${nameProviderDupes.length} groups (most are weekly sessions)`);
console.log(`TRUE duplicates (same name+provider+dates): ${trueDupes.length}`);
if (trueDupes.length > 0) {
  trueDupes.forEach(d => {
    const [name, provider] = d.key.split('|||');
    console.log(`  DUPE: "${name}" by "${provider}" dates=${d.dateKey} (${d.entries.length} copies, IDs: ${d.entries.map(e=>e.id).join(', ')})`);
  });
}

// 2b. Same registration URL (not dupes if different weeks)
const urlMap = {};
programs.forEach((p, i) => {
  if (p.registrationUrl) {
    if (!urlMap[p.registrationUrl]) urlMap[p.registrationUrl] = [];
    urlMap[p.registrationUrl].push(i);
  }
});
const sharedUrls = Object.entries(urlMap).filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length);
console.log(`\nRegistration URLs shared by multiple programs: ${sharedUrls.length}`);
console.log('Top 15 most-shared URLs:');
sharedUrls.slice(0, 15).forEach(([url, indices]) => {
  const provider = programs[indices[0]].provider;
  console.log(`  ${indices.length}x  ${provider} — ${url.substring(0, 80)}${url.length > 80 ? '...' : ''}`);
});

// 2c. Duplicate IDs
const idMap = {};
const dupeIds = [];
programs.forEach((p, i) => {
  if (idMap[p.id] !== undefined) {
    dupeIds.push({ id: p.id, first: idMap[p.id], second: i });
  } else {
    idMap[p.id] = i;
  }
});
console.log(`\nDuplicate IDs: ${dupeIds.length}`);
if (dupeIds.length > 0) {
  dupeIds.forEach(d => console.log(`  ID ${d.id} at indices ${d.first} and ${d.second}`));
}
console.log();

// ─────────────────────────────────────────────────────────
// 3. TYPE VALIDATION
// ─────────────────────────────────────────────────────────
console.log('── 3. TYPE VALIDATION ──');
const typeErrors = [];

programs.forEach((p, i) => {
  // id
  if (p.id === undefined || p.id === null) {
    typeErrors.push({ index: i, field: 'id', issue: 'missing', value: p.id });
  }
  // name
  if (typeof p.name !== 'string' || p.name.trim() === '') {
    typeErrors.push({ index: i, field: 'name', issue: 'empty or not string', value: p.name, id: p.id });
  }
  // provider
  if (typeof p.provider !== 'string' || p.provider.trim() === '') {
    typeErrors.push({ index: i, field: 'provider', issue: 'empty or not string', value: p.provider, id: p.id });
  }
  // category
  if (p.category && !VALID_CATEGORIES.includes(p.category)) {
    typeErrors.push({ index: i, field: 'category', issue: `invalid category "${p.category}"`, id: p.id, name: p.name });
  }
  // cost
  if (p.cost !== undefined && p.cost !== null) {
    if (typeof p.cost === 'string') {
      typeErrors.push({ index: i, field: 'cost', issue: `string value "${p.cost}"`, id: p.id, name: p.name });
    } else if (typeof p.cost !== 'number') {
      typeErrors.push({ index: i, field: 'cost', issue: `unexpected type ${typeof p.cost}`, id: p.id, name: p.name });
    }
  }
  // ageMin
  if (p.ageMin !== undefined && p.ageMin !== null) {
    if (typeof p.ageMin === 'string') {
      typeErrors.push({ index: i, field: 'ageMin', issue: `string value "${p.ageMin}"`, id: p.id, name: p.name });
    } else if (typeof p.ageMin !== 'number') {
      typeErrors.push({ index: i, field: 'ageMin', issue: `unexpected type ${typeof p.ageMin}`, id: p.id, name: p.name });
    }
  }
  // ageMax
  if (p.ageMax !== undefined && p.ageMax !== null) {
    if (typeof p.ageMax === 'string') {
      typeErrors.push({ index: i, field: 'ageMax', issue: `string value "${p.ageMax}"`, id: p.id, name: p.name });
    } else if (typeof p.ageMax !== 'number') {
      typeErrors.push({ index: i, field: 'ageMax', issue: `unexpected type ${typeof p.ageMax}`, id: p.id, name: p.name });
    }
  }
  // startDate format
  if (p.startDate && typeof p.startDate === 'string' && p.startDate.trim() !== '') {
    if (!DATE_RE.test(p.startDate)) {
      typeErrors.push({ index: i, field: 'startDate', issue: `bad format "${p.startDate}"`, id: p.id, name: p.name });
    }
  }
  // endDate format
  if (p.endDate && typeof p.endDate === 'string' && p.endDate.trim() !== '') {
    if (!DATE_RE.test(p.endDate)) {
      typeErrors.push({ index: i, field: 'endDate', issue: `bad format "${p.endDate}"`, id: p.id, name: p.name });
    }
  }
  // registrationUrl
  if (p.registrationUrl && typeof p.registrationUrl === 'string' && p.registrationUrl.trim() !== '') {
    if (!URL_RE.test(p.registrationUrl)) {
      typeErrors.push({ index: i, field: 'registrationUrl', issue: `does not start with http(s)://: "${p.registrationUrl}"`, id: p.id, name: p.name });
    }
  }
  // enrollmentStatus
  if (p.enrollmentStatus && !VALID_ENROLLMENT_STATUSES.includes(p.enrollmentStatus)) {
    typeErrors.push({ index: i, field: 'enrollmentStatus', issue: `invalid status "${p.enrollmentStatus}"`, id: p.id, name: p.name });
  }
  // dayLength
  if (p.dayLength && !VALID_DAY_LENGTHS.includes(p.dayLength)) {
    typeErrors.push({ index: i, field: 'dayLength', issue: `invalid dayLength "${p.dayLength}"`, id: p.id, name: p.name });
  }
});

console.log(`Type validation errors: ${typeErrors.length}`);
if (typeErrors.length > 0) {
  // Group by field
  const byField = {};
  typeErrors.forEach(e => {
    if (!byField[e.field]) byField[e.field] = [];
    byField[e.field].push(e);
  });
  Object.entries(byField).forEach(([field, errors]) => {
    console.log(`\n  ${field}: ${errors.length} errors`);
    errors.slice(0, 10).forEach(e => {
      console.log(`    [${e.index}] id=${e.id} "${e.name || ''}" — ${e.issue}`);
    });
    if (errors.length > 10) console.log(`    ... and ${errors.length - 10} more`);
  });
}
console.log();

// ─────────────────────────────────────────────────────────
// 4. LOGICAL VALIDATION
// ─────────────────────────────────────────────────────────
console.log('── 4. LOGICAL VALIDATION ──');
const logicErrors = [];

programs.forEach((p, i) => {
  // ageMin > ageMax
  if (typeof p.ageMin === 'number' && typeof p.ageMax === 'number' && p.ageMin > p.ageMax) {
    logicErrors.push({ index: i, id: p.id, name: p.name, issue: `ageMin(${p.ageMin}) > ageMax(${p.ageMax})` });
  }
  // startDate > endDate
  if (p.startDate && p.endDate && p.startDate > p.endDate) {
    logicErrors.push({ index: i, id: p.id, name: p.name, issue: `startDate(${p.startDate}) > endDate(${p.endDate})` });
  }
  // negative cost
  if (typeof p.cost === 'number' && p.cost < 0) {
    logicErrors.push({ index: i, id: p.id, name: p.name, issue: `negative cost: ${p.cost}` });
  }
  // very high cost
  if (typeof p.cost === 'number' && p.cost > 5000) {
    logicErrors.push({ index: i, id: p.id, name: p.name, issue: `very high cost: $${p.cost}` });
  }
  // impossible ages
  if (typeof p.ageMin === 'number' && (p.ageMin < 0 || p.ageMin > 25)) {
    logicErrors.push({ index: i, id: p.id, name: p.name, issue: `ageMin out of range: ${p.ageMin}` });
  }
  if (typeof p.ageMax === 'number' && (p.ageMax < 0 || p.ageMax > 25)) {
    logicErrors.push({ index: i, id: p.id, name: p.name, issue: `ageMax out of range: ${p.ageMax}` });
  }
  // dates out of range
  if (p.startDate && DATE_RE.test(p.startDate)) {
    const year = parseInt(p.startDate.substring(0, 4));
    if (year < 2025 || year > 2028) {
      logicErrors.push({ index: i, id: p.id, name: p.name, issue: `startDate year out of range: ${p.startDate}` });
    }
  }
  if (p.endDate && DATE_RE.test(p.endDate)) {
    const year = parseInt(p.endDate.substring(0, 4));
    if (year < 2025 || year > 2028) {
      logicErrors.push({ index: i, id: p.id, name: p.name, issue: `endDate year out of range: ${p.endDate}` });
    }
  }
});

console.log(`Logic errors: ${logicErrors.length}`);
logicErrors.forEach(e => {
  console.log(`  [${e.index}] id=${e.id} "${e.name}" — ${e.issue}`);
});
console.log();

// ─────────────────────────────────────────────────────────
// 5. URL QUALITY
// ─────────────────────────────────────────────────────────
console.log('── 5. URL QUALITY ──');
let noUrl = 0;
let homepageOnly = 0;
const homepageUrls = [];

programs.forEach((p, i) => {
  if (!p.registrationUrl || p.registrationUrl.trim() === '') {
    noUrl++;
    return;
  }
  try {
    const u = new URL(p.registrationUrl);
    if (u.pathname === '/' && !u.search && !u.hash) {
      homepageOnly++;
      homepageUrls.push({ id: p.id, name: p.name, provider: p.provider, url: p.registrationUrl });
    }
  } catch (e) {
    // already caught in type validation
  }
});

console.log(`Programs with no registrationUrl: ${noUrl}`);
console.log(`Programs with homepage-only URL (no path): ${homepageOnly}`);
if (homepageUrls.length > 0 && homepageUrls.length <= 30) {
  homepageUrls.forEach(h => console.log(`  id=${h.id} "${h.name}" (${h.provider}) — ${h.url}`));
} else if (homepageUrls.length > 30) {
  homepageUrls.slice(0, 15).forEach(h => console.log(`  id=${h.id} "${h.name}" (${h.provider}) — ${h.url}`));
  console.log(`  ... and ${homepageUrls.length - 15} more`);
}

// Most-shared URLs (already computed above)
console.log(`\nURLs shared by 10+ programs (may indicate generic/lazy entry):`);
sharedUrls.filter(([, v]) => v.length >= 10).forEach(([url, indices]) => {
  console.log(`  ${indices.length} programs share: ${url.substring(0, 90)}`);
});
console.log();

// ─────────────────────────────────────────────────────────
// 6. ADDRESS QUALITY
// ─────────────────────────────────────────────────────────
console.log('── 6. ADDRESS QUALITY ──');
let noAddress = 0;
let vagueAddress = 0;
let streetAddress = 0;
const VAGUE_PATTERNS = [
  /^vancouver/i, /^surrey/i, /^burnaby/i, /^richmond/i, /^north van/i,
  /^west van/i, /^coquitlam/i, /^new west/i, /^delta/i, /^langley/i,
  /^tbd$/i, /^varies$/i, /^various/i, /^multiple/i, /^online$/i,
  /^see website/i, /^check website/i,
];

const vagueExamples = [];
programs.forEach((p, i) => {
  if (!p.address || p.address.trim() === '') {
    noAddress++;
    return;
  }
  const addr = p.address.trim();
  const isVague = VAGUE_PATTERNS.some(pat => pat.test(addr)) ||
                  (addr.length < 25 && !/\d/.test(addr)); // short with no number = likely vague
  if (isVague) {
    vagueAddress++;
    vagueExamples.push({ id: p.id, name: p.name, address: addr });
  } else {
    streetAddress++;
  }
});

console.log(`No address: ${noAddress}`);
console.log(`Vague address: ${vagueAddress}`);
console.log(`Proper street address: ${streetAddress}`);
if (vagueExamples.length > 0) {
  console.log('Sample vague addresses:');
  vagueExamples.slice(0, 15).forEach(v => console.log(`  id=${v.id} "${v.name}" — "${v.address}"`));
  if (vagueExamples.length > 15) console.log(`  ... and ${vagueExamples.length - 15} more`);
}
console.log();

// ─────────────────────────────────────────────────────────
// 7. PROVIDER CONSISTENCY
// ─────────────────────────────────────────────────────────
console.log('── 7. PROVIDER CONSISTENCY ──');
const providerCounts = {};
programs.forEach(p => {
  const prov = (p.provider || 'MISSING').trim();
  providerCounts[prov] = (providerCounts[prov] || 0) + 1;
});

const providers = Object.entries(providerCounts).sort((a, b) => a[0].localeCompare(b[0]));
console.log(`Unique providers: ${providers.length}`);
console.log('\nAll providers (alphabetical):');
providers.forEach(([name, count]) => {
  console.log(`  ${String(count).padStart(4)}  ${name}`);
});

// Check for similar provider names (Levenshtein-like check — simplified)
console.log('\nPotential provider name duplicates:');
const provNames = providers.map(([n]) => n);
const similarPairs = [];
for (let i = 0; i < provNames.length; i++) {
  for (let j = i + 1; j < provNames.length; j++) {
    const a = provNames[i].toLowerCase().replace(/[^a-z0-9]/g, '');
    const b = provNames[j].toLowerCase().replace(/[^a-z0-9]/g, '');
    // Check if one is a substring of the other or they're very similar
    if (a.includes(b) || b.includes(a) ||
        (a.length > 5 && b.length > 5 && a.substring(0, 8) === b.substring(0, 8))) {
      similarPairs.push([provNames[i], provNames[j]]);
    }
  }
}
if (similarPairs.length === 0) {
  console.log('  None found.');
} else {
  similarPairs.forEach(([a, b]) => console.log(`  "${a}" <-> "${b}"`));
}
console.log();

// ─────────────────────────────────────────────────────────
// 8. CATEGORY DISTRIBUTION
// ─────────────────────────────────────────────────────────
console.log('── 8. CATEGORY DISTRIBUTION ──');
const catCounts = {};
let noCat = 0;
const invalidCats = new Set();

programs.forEach(p => {
  if (!p.category || p.category.trim() === '') {
    noCat++;
  } else if (!VALID_CATEGORIES.includes(p.category)) {
    invalidCats.add(p.category);
    catCounts[p.category] = (catCounts[p.category] || 0) + 1;
  } else {
    catCounts[p.category] = (catCounts[p.category] || 0) + 1;
  }
});

console.log(`Programs without category: ${noCat}`);
if (invalidCats.size > 0) {
  console.log(`Invalid categories found: ${[...invalidCats].join(', ')}`);
}
console.log('\nCategory distribution:');
Object.entries(catCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  const valid = VALID_CATEGORIES.includes(cat) ? '' : ' ** INVALID **';
  console.log(`  ${String(count).padStart(5)}  ${cat}${valid}`);
});

// Season distribution
const seasonCounts = {};
programs.forEach(p => {
  const s = p.season || 'MISSING';
  seasonCounts[s] = (seasonCounts[s] || 0) + 1;
});
console.log('\nSeason distribution:');
Object.entries(seasonCounts).sort((a, b) => b[1] - a[1]).forEach(([s, c]) => {
  console.log(`  ${String(c).padStart(5)}  ${s}`);
});

// dayLength distribution
const dlCounts = {};
programs.forEach(p => {
  const d = p.dayLength || 'MISSING';
  dlCounts[d] = (dlCounts[d] || 0) + 1;
});
console.log('\ndayLength distribution:');
Object.entries(dlCounts).sort((a, b) => b[1] - a[1]).forEach(([d, c]) => {
  console.log(`  ${String(c).padStart(5)}  ${d}`);
});

// enrollmentStatus distribution
const esCounts = {};
programs.forEach(p => {
  const e = p.enrollmentStatus || 'MISSING';
  esCounts[e] = (esCounts[e] || 0) + 1;
});
console.log('\nenrollmentStatus distribution:');
Object.entries(esCounts).sort((a, b) => b[1] - a[1]).forEach(([e, c]) => {
  console.log(`  ${String(c).padStart(5)}  ${e}`);
});
console.log();

// ─────────────────────────────────────────────────────────
// 9. CLEANUP — Fix all issues found
// ─────────────────────────────────────────────────────────
console.log('='.repeat(80));
console.log('  CLEANUP PHASE');
console.log('='.repeat(80));

let fixCount = 0;

// Work on a copy
const cleaned = JSON.parse(JSON.stringify(programs));

cleaned.forEach((p, i) => {
  // 9a. Convert string costs to numbers
  if (typeof p.cost === 'string') {
    const lower = p.cost.toLowerCase().trim();
    if (lower === 'tbd' || lower === 'free' || lower === '' || lower === 'n/a' || lower === 'varies') {
      const oldVal = p.cost;
      p.cost = lower === 'free' ? 0 : null;
      fixCount++;
      console.log(`  FIX cost: id=${p.id} "${p.name}" — "${oldVal}" -> ${p.cost}`);
    } else {
      const num = parseFloat(p.cost.replace(/[$,]/g, ''));
      if (!isNaN(num)) {
        const oldVal = p.cost;
        p.cost = num;
        fixCount++;
        console.log(`  FIX cost: id=${p.id} "${p.name}" — "${oldVal}" -> ${p.cost}`);
      }
    }
  }

  // 9b. Convert string ages to numbers
  if (typeof p.ageMin === 'string') {
    const num = parseInt(p.ageMin);
    const oldVal = p.ageMin;
    p.ageMin = isNaN(num) ? null : num;
    fixCount++;
    console.log(`  FIX ageMin: id=${p.id} "${p.name}" — "${oldVal}" -> ${p.ageMin}`);
  }
  if (typeof p.ageMax === 'string') {
    const num = parseInt(p.ageMax);
    const oldVal = p.ageMax;
    p.ageMax = isNaN(num) ? null : num;
    fixCount++;
    console.log(`  FIX ageMax: id=${p.id} "${p.name}" — "${oldVal}" -> ${p.ageMax}`);
  }

  // 9c. Fix empty string costs/ages to null
  if (p.cost === '') { p.cost = null; fixCount++; console.log(`  FIX cost: id=${p.id} empty string -> null`); }
  if (p.ageMin === '') { p.ageMin = null; fixCount++; console.log(`  FIX ageMin: id=${p.id} empty string -> null`); }
  if (p.ageMax === '') { p.ageMax = null; fixCount++; console.log(`  FIX ageMax: id=${p.id} empty string -> null`); }

  // 9d. Normalize invalid enrollment statuses
  if (p.enrollmentStatus) {
    const lower = p.enrollmentStatus.toLowerCase().trim();
    if (!VALID_ENROLLMENT_STATUSES.map(s => s.toLowerCase()).includes(lower)) {
      const oldVal = p.enrollmentStatus;
      // Try common mappings
      if (lower.includes('open')) p.enrollmentStatus = 'Open';
      else if (lower.includes('closed')) p.enrollmentStatus = 'Closed';
      else if (lower.includes('wait')) p.enrollmentStatus = 'Waitlist';
      else if (lower.includes('full')) p.enrollmentStatus = 'Full';
      else p.enrollmentStatus = 'TBD';
      if (oldVal !== p.enrollmentStatus) {
        fixCount++;
        console.log(`  FIX enrollmentStatus: id=${p.id} "${p.name}" — "${oldVal}" -> "${p.enrollmentStatus}"`);
      }
    }
  }
});

// 9e. Remove exact duplicates (same name + provider + startDate + endDate)
// Keep the one with more populated fields
const dupeIndices = new Set();
if (trueDupes.length > 0) {
  trueDupes.forEach(d => {
    // Compare entries, keep the one with the most non-empty fields
    const entries = d.entries;
    let bestIdx = entries[0].index;
    let bestCount = Object.values(cleaned[entries[0].index]).filter(v => v !== null && v !== undefined && v !== '').length;

    for (let k = 1; k < entries.length; k++) {
      const count = Object.values(cleaned[entries[k].index]).filter(v => v !== null && v !== undefined && v !== '').length;
      if (count > bestCount) {
        dupeIndices.add(bestIdx);
        bestIdx = entries[k].index;
        bestCount = count;
      } else {
        dupeIndices.add(entries[k].index);
      }
    }
  });
}

const finalPrograms = cleaned.filter((_, i) => !dupeIndices.has(i));

console.log(`\nDuplicates removed: ${dupeIndices.size}`);
console.log(`Total fixes applied: ${fixCount}`);
console.log(`Programs before cleanup: ${programs.length}`);
console.log(`Programs after cleanup: ${finalPrograms.length}`);

// Re-assign sequential IDs to avoid gaps
// Actually, keep original IDs to avoid breaking references
// Just fix any duplicate IDs by assigning new ones
const seenIds = new Set();
let maxId = 0;
finalPrograms.forEach(p => {
  if (typeof p.id === 'number' && p.id > maxId) maxId = p.id;
});
let nextId = maxId + 1;
let idFixCount = 0;
finalPrograms.forEach(p => {
  if (seenIds.has(p.id)) {
    const oldId = p.id;
    p.id = nextId++;
    idFixCount++;
    console.log(`  FIX duplicate id: "${p.name}" id ${oldId} -> ${p.id}`);
  }
  seenIds.add(p.id);
});
if (idFixCount > 0) console.log(`Duplicate IDs fixed: ${idFixCount}`);

// Write cleaned file
fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(finalPrograms, null, 2) + '\n', 'utf8');
console.log(`\nCleaned data written to ${PROGRAMS_PATH}`);

// ─────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────
console.log();
console.log('='.repeat(80));
console.log('  AUDIT SUMMARY');
console.log('='.repeat(80));
console.log(`  Total programs audited: ${programs.length}`);
console.log(`  Type validation errors found: ${typeErrors.length}`);
console.log(`  Logic errors found: ${logicErrors.length}`);
console.log(`  True duplicates found: ${trueDupes.length}`);
console.log(`  Duplicate IDs found: ${dupeIds.length}`);
console.log(`  Homepage-only URLs: ${homepageOnly}`);
console.log(`  No address: ${noAddress} / Vague address: ${vagueAddress}`);
console.log(`  Fixes applied: ${fixCount}`);
console.log(`  Duplicates removed: ${dupeIndices.size}`);
console.log(`  ID collisions fixed: ${idFixCount}`);
console.log(`  Final program count: ${finalPrograms.length}`);
console.log('='.repeat(80));
