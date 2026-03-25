/**
 * fix-generic-dates.cjs
 *
 * Fixes ~130 programs in programs.json that have generic summer date ranges
 * instead of proper weekly-repeating camp metadata.
 *
 * Targets:
 *  - City of Richmond community centres (105 programs, 7 centres)
 *  - Richmond Olympic Oval (9 programs)
 *  - Science AL!VE Burnaby (16 programs)
 *  - Any other weekly day camps with >14-day spans
 *
 * Adds:  repeating: "weekly", repeatEndDate, updates startDate/endDate to first week,
 *        and appends a note to the description.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'programs.json');

// --- Helpers ---

function daysDiff(a, b) {
  return Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));
}

/** Return the Monday of the week containing `dateStr` (or dateStr itself if Monday). */
function toMonday(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay(); // 0=Sun … 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

/** Return the Friday of the same week as `mondayStr`. */
function toFriday(mondayStr) {
  const d = new Date(mondayStr + 'T12:00:00');
  d.setDate(d.getDate() + 4);
  return d.toISOString().slice(0, 10);
}

/** Return the last Friday on or before `dateStr`. */
function lastFridayOnOrBefore(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  // Friday = 5
  const diff = (day >= 5) ? day - 5 : day + 2; // days to subtract to get to previous Friday
  d.setDate(d.getDate() - diff);
  return d.toISOString().slice(0, 10);
}

function formatDateRange(start, end) {
  const s = new Date(start + 'T12:00:00');
  const e = new Date(end + 'T12:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[s.getMonth()]} ${s.getDate()} - ${months[e.getMonth()]} ${e.getDate()}`;
}

// --- Provider matching ---

const RICHMOND_CC_PATTERN = /^City of Richmond\s*-\s*/i;
const RICHMOND_OVAL_PATTERN = /^Richmond Olympic Oval$/i;
const SCIENCE_ALIVE_PATTERN = /^Science AL!VE$/i;

function isTargetProvider(provider) {
  return (
    RICHMOND_CC_PATTERN.test(provider) ||
    RICHMOND_OVAL_PATTERN.test(provider) ||
    SCIENCE_ALIVE_PATTERN.test(provider)
  );
}

// Providers / patterns to SKIP (school districts, seasonal, multi-week by design)
const SKIP_PROVIDERS = [
  /school district/i,
  /board of education/i,
  /university/i,    // actual university programs, not camps at university locations
];

function shouldSkip(program) {
  // Skip if provider is a school district
  if (SKIP_PROVIDERS.some(rx => rx.test(program.provider))) return true;
  // Skip if it already has repeating field
  if (program.repeating) return true;
  // Skip if not Mon-Fri (not a typical weekly day camp)
  if (program.days && !program.days.includes('Mon') && !program.days.includes('Fri')) return true;
  // Skip if description says "multi-week" or "full summer" explicitly as intended
  if (program.description && /\bmulti-week program\b/i.test(program.description)) return true;
  return false;
}

// --- Main ---

const raw = fs.readFileSync(FILE, 'utf8');
const programs = JSON.parse(raw);

let fixedCount = 0;
let fixedByProvider = {};

for (const p of programs) {
  if (!p.startDate || !p.endDate) continue;

  const span = daysDiff(p.startDate, p.endDate);

  // Only fix programs with span > 14 days (more than 2 weeks)
  if (span <= 14) continue;

  if (shouldSkip(p)) continue;

  // Check if this is a known target provider OR a generic weekly day camp
  const isKnownTarget = isTargetProvider(p.provider);

  if (!isKnownTarget) {
    // For other providers: only fix if it looks like a weekly day camp
    // Must be Mon-Fri, day camp / summer camp type, and have a large span
    const isWeeklyDayCamp =
      p.days === 'Mon-Fri' &&
      (p.campType === 'Summer Camp' || p.campType === 'Day Camp') &&
      span >= 28 && // at least 4 weeks — signals a full-summer window
      (p.costPer === 'week' || // explicitly priced per week
       (p.cost && p.cost < 600)); // weekly-priced camps tend to be under $600

    if (!isWeeklyDayCamp) continue;
  }

  // Calculate dates
  const originalEnd = p.endDate;
  const monday = toMonday(p.startDate);
  const friday = toFriday(monday);
  const repeatEnd = lastFridayOnOrBefore(originalEnd);

  // Update fields
  p.startDate = monday;
  p.endDate = friday;
  p.repeating = 'weekly';
  p.repeatEndDate = repeatEnd;

  // Update description — append weekly note if not already present
  const weeklyNote = `Runs weekly, ${formatDateRange(monday, repeatEnd)}. Register for individual weeks.`;
  if (p.description && !p.description.includes('Runs weekly')) {
    // For Science AL!VE, they already have a similar note — replace it
    if (SCIENCE_ALIVE_PATTERN.test(p.provider) && p.description.includes('Themes rotate across weeks')) {
      // Already has descriptive text, just ensure it's consistent
    } else {
      p.description = p.description.replace(/\s*$/, '') + ' ' + weeklyNote;
    }
  }

  fixedCount++;
  fixedByProvider[p.provider] = (fixedByProvider[p.provider] || 0) + 1;
}

// Write back
fs.writeFileSync(FILE, JSON.stringify(programs, null, 2) + '\n', 'utf8');

// Report
console.log(`\nFixed ${fixedCount} programs with generic date ranges.\n`);
console.log('By provider:');
const sorted = Object.entries(fixedByProvider).sort((a, b) => b[1] - a[1]);
for (const [provider, count] of sorted) {
  console.log(`  ${provider}: ${count}`);
}
console.log('\nFields added: repeating, repeatEndDate');
console.log('Fields updated: startDate (first Monday), endDate (first Friday)');
console.log('Description: appended weekly availability note');
