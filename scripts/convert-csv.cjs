/**
 * convert-csv.cjs
 * Reads skeddo-combined.csv, cleans data, writes programs.json + summary.json
 */

const fs = require('fs');
const path = require('path');

// ── CSV Parsing (handles quoted fields with commas) ──────────────────────────
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = fields[idx] || '';
    });
    rows.push(obj);
  }
  return rows;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function parseCost(val) {
  if (!val) return null;
  const cleaned = val.replace(/[$,\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : Math.round(num * 100) / 100;
}

function parseNum(val) {
  if (!val) return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
}

function clean(val) {
  if (!val || val.trim() === '') return null;
  return val.trim();
}

function parseTags(val) {
  if (!val) return [];
  return val.split(',').map(t => t.trim()).filter(Boolean);
}

// ── Main ─────────────────────────────────────────────────────────────────────
const CSV_PATH = '/Users/nicolemont/Library/CloudStorage/GoogleDrive-skeddo.planner@gmail.com/Other computers/My Computer/Skeddo/skeddo-combined.csv';
const OUT_DIR = '/Users/nicolemont/Documents/Skeddo/skeddo-app/src/data';

console.log('Reading CSV...');
const raw = fs.readFileSync(CSV_PATH, 'utf-8');
const rows = parseCSV(raw);
console.log(`Parsed ${rows.length} rows from CSV.`);

// Map to clean schema
const mapped = rows.map((r, idx) => ({
  id: parseInt(r['ID']) || idx + 1,
  name: clean(r['Program Name']),
  provider: clean(r['Provider']),
  category: clean(r['Category']),
  campType: clean(r['Camp Type']),
  scheduleType: clean(r['Schedule Type']),
  ageMin: parseNum(r['Age Min']),
  ageMax: parseNum(r['Age Max']),
  startDate: clean(r['Start Date']),
  endDate: clean(r['End Date']),
  days: clean(r['Days']),
  startTime: clean(r['Start Time']),
  endTime: clean(r['End Time']),
  cost: parseCost(r['Cost']),
  indoorOutdoor: clean(r['Indoor/Outdoor']),
  neighbourhood: clean(r['Neighbourhood']),
  address: clean(r['Address']),
  lat: parseNum(r['Latitude']),
  lng: parseNum(r['Longitude']),
  enrollmentStatus: clean(r['Enrollment Status']),
  registrationUrl: clean(r['Registration URL']),
  description: clean(r['Description']),
  tags: parseTags(r['Tags']),
  activityType: clean(r['Activity Type']),
}));

// Filter out garbage: must have a name, name must be at least 3 chars,
// and not be obviously test/placeholder data
const filtered = mapped.filter(p => {
  if (!p.name) return false;
  if (p.name.length < 3) return false;
  const lower = p.name.toLowerCase();
  if (lower === 'test' || lower === 'tbd' || lower === 'n/a' || lower === 'none') return false;
  return true;
});

const removed = mapped.length - filtered.length;
console.log(`Filtered out ${removed} invalid/garbage rows. ${filtered.length} programs remain.`);

// Write programs.json
const programsPath = path.join(OUT_DIR, 'programs.json');
fs.writeFileSync(programsPath, JSON.stringify(filtered, null, 2), 'utf-8');
console.log(`Wrote ${programsPath}`);

// Build summary
const categories = [...new Set(filtered.map(p => p.category).filter(Boolean))].sort();
const neighbourhoods = [...new Set(filtered.map(p => p.neighbourhood).filter(Boolean))].sort();
const providers = [...new Set(filtered.map(p => p.provider).filter(Boolean))].sort();
const activityTypes = [...new Set(filtered.map(p => p.activityType).filter(Boolean))].sort();
const campTypes = [...new Set(filtered.map(p => p.campType).filter(Boolean))].sort();

const costs = filtered.map(p => p.cost).filter(c => c !== null && c > 0);
const avgCost = costs.length > 0 ? Math.round((costs.reduce((a, b) => a + b, 0) / costs.length) * 100) / 100 : 0;
const minCost = costs.length > 0 ? Math.min(...costs) : 0;
const maxCost = costs.length > 0 ? Math.max(...costs) : 0;

const withAges = filtered.filter(p => p.ageMin !== null || p.ageMax !== null).length;

const summary = {
  totalPrograms: filtered.length,
  rowsRemoved: removed,
  uniqueCategories: categories.length,
  categories,
  uniqueNeighbourhoods: neighbourhoods.length,
  neighbourhoods,
  uniqueProviders: providers.length,
  providers: providers.slice(0, 50), // top 50 to keep summary manageable
  totalProviders: providers.length,
  uniqueActivityTypes: activityTypes.length,
  activityTypes,
  uniqueCampTypes: campTypes.length,
  campTypes,
  costStats: { min: minCost, max: maxCost, average: avgCost, programsWithCost: costs.length },
  programsWithAgeRange: withAges,
};

const summaryPath = path.join(OUT_DIR, 'programs-summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
console.log(`Wrote ${summaryPath}`);

// Print summary to console
console.log('\n═══ SUMMARY ═══');
console.log(`Total programs: ${summary.totalPrograms}`);
console.log(`Rows removed: ${summary.rowsRemoved}`);
console.log(`Categories (${summary.uniqueCategories}): ${categories.join(', ')}`);
console.log(`Neighbourhoods (${summary.uniqueNeighbourhoods}): ${neighbourhoods.join(', ')}`);
console.log(`Providers: ${summary.uniqueProviders}`);
console.log(`Activity types (${summary.uniqueActivityTypes}): ${activityTypes.join(', ')}`);
console.log(`Camp types (${summary.uniqueCampTypes}): ${campTypes.join(', ')}`);
console.log(`Cost range: $${minCost} – $${maxCost} (avg $${avgCost})`);
console.log(`Programs with cost: ${costs.length}`);
console.log(`Programs with age range: ${withAges}`);
console.log('Done!');
