#!/usr/bin/env node
// =============================================================================
// generate-audit-queue.cjs
// =============================================================================
// Reads programs.json, scores every provider by listing count + proximity to
// V5T 2J6 (Mount Pleasant, Vancouver), filters out already-audited providers,
// and writes scripts/audit-provider-queue.json.
//
// Re-run whenever:
//   - New providers are added to programs.json
//   - New audits are completed and you want to refresh the queue
//   - You want to rebuild scores after changing COMPLETED_AUDITS below
//
// USAGE
//   node scripts/generate-audit-queue.cjs
//   node scripts/generate-audit-queue.cjs --rebuild   # overwrite existing queue
// =============================================================================

const fs   = require('fs');
const path = require('path');

const REPO_ROOT   = path.resolve(__dirname, '..');
const PROGRAMS    = path.join(REPO_ROOT, 'src/data/programs.json');
const QUEUE_FILE  = path.join(REPO_ROOT, 'scripts/audit-provider-queue.json');

// ---------------------------------------------------------------------------
// Reference postal code: V5T 2J6 — Mount Pleasant, Vancouver
// ---------------------------------------------------------------------------
const REF_LAT = 49.2640;
const REF_LNG = -123.1010;

// ---------------------------------------------------------------------------
// Providers whose One-Click Deeper audit is COMPLETE.
// Update this list as audits are finished.
// ---------------------------------------------------------------------------
const COMPLETED_AUDITS = new Set([
  'Pedalheads',
  'Access2Innovate',
  'Access2Innovate / Collingwood',
  'Access2Innovate / Mulgrave',
  'Code Ninjas',
  'Legacy Sport Club',
  'Pear Tree Education',
  'Made Talents',
  'Sports Camps Canada',
  '4Cats Arts Studio',
  'Axis Adventure Camps',
  'Endless Biking',
  'Exceleration',
  'City of Richmond - Thompson Community Centre',
  'City of Richmond - South Arm Community Centre',
  'City of Richmond - Steveston Community Centre',
  'City of Richmond - City Centre Community Centre',
  'City of Richmond - West Richmond Community Centre',
  'City of Richmond - Cambie Community Centre',
  'City of Richmond - Sea Island Community Centre',
  'City of Richmond - Hamilton Community Centre',
  'North Van Arts',
  'SportsWeek',
  'Escape Adventures',
  'Absolute Cheer & Tumbling',
  'Parkgate Society',
  'North Vancouver Football Club',
  'Steamoji',
  'North Shore Academy of Dancing',
  'Shift Dance Academy',
  'Vanleena Dance Academy',
  'Driftwood Dance Academy',
  'Stagecoach Performing Arts',
  'MiFa Music & Art School',
  "Azars' Music School",
  'Vancouver Young Actors School (VYAS)',
  'Zen Maker Lab',
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function haversineKm(lat, lng) {
  if (!lat || !lng) return null;
  const R = 6371;
  const dLat = (lat - REF_LAT) * Math.PI / 180;
  const dLng = (lng - REF_LNG) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(REF_LAT * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---------------------------------------------------------------------------
// Load existing queue so we can preserve manual status edits
// ---------------------------------------------------------------------------
let existingQueue = {};
if (fs.existsSync(QUEUE_FILE)) {
  try {
    const existing = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
    existing.providers.forEach(p => { existingQueue[p.name] = p; });
    console.log(`Loaded existing queue with ${Object.keys(existingQueue).length} providers.`);
  } catch (e) {
    console.warn('Could not parse existing queue — starting fresh.');
  }
}

// ---------------------------------------------------------------------------
// Aggregate providers from programs.json
// ---------------------------------------------------------------------------
const programs = JSON.parse(fs.readFileSync(PROGRAMS, 'utf8'));

const providerMap = {};
programs.forEach(prog => {
  const name = prog.provider || prog.organizationName || 'Unknown';
  if (!providerMap[name]) {
    providerMap[name] = { count: 0, lats: [], lngs: [] };
  }
  providerMap[name].count++;
  if (prog.lat) providerMap[name].lats.push(prog.lat);
  if (prog.lng) providerMap[name].lngs.push(prog.lng);
});

// Build raw list of pending providers
const pendingRaw = Object.entries(providerMap)
  .filter(([name]) => !COMPLETED_AUDITS.has(name))
  .map(([name, d]) => {
    const avgLat = d.lats.length ? d.lats.reduce((a, b) => a + b, 0) / d.lats.length : null;
    const avgLng = d.lngs.length ? d.lngs.reduce((a, b) => a + b, 0) / d.lngs.length : null;
    const distKm = haversineKm(avgLat, avgLng);
    return { name, count: d.count, distKm };
  });

// ---------------------------------------------------------------------------
// Score: 60% log-count + 40% proximity (both normalized within pending pool)
// ---------------------------------------------------------------------------
const validDists = pendingRaw.map(r => r.distKm).filter(Boolean);
const counts     = pendingRaw.map(r => r.count);
const maxCount   = Math.max(...counts);
const minCount   = Math.min(...counts);
const maxDist    = Math.max(...validDists);
const minDist    = Math.min(...validDists);

const logMax = Math.log(maxCount + 1);
const logMin = Math.log(minCount + 1);

pendingRaw.forEach(r => {
  const logCount = Math.log(r.count + 1);
  r.countScore = (logCount - logMin) / (logMax - logMin);

  if (!r.distKm) {
    r.distScore = 0;
  } else {
    r.distScore = 1 - (r.distKm - minDist) / (maxDist - minDist);
  }

  r.priorityScore = Math.round((r.countScore * 0.6 + r.distScore * 0.4) * 100);
});

// Sort by priority desc
pendingRaw.sort((a, b) => b.priorityScore - a.priorityScore);

// ---------------------------------------------------------------------------
// Merge with existing queue to preserve status edits
// ---------------------------------------------------------------------------
const providers = pendingRaw.map((r, i) => {
  const existing = existingQueue[r.name];
  return {
    rank:          i + 1,
    name:          r.name,
    listings:      r.count,
    distKm:        r.distKm ? Math.round(r.distKm * 10) / 10 : null,
    priorityScore: r.priorityScore,
    // Preserve existing status/metadata; default to 'pending' for new entries
    status:        existing?.status    ?? 'pending',
    auditDate:     existing?.auditDate ?? null,
    logFile:       existing?.logFile   ?? null,
    notes:         existing?.notes     ?? null,
    sessionId:     existing?.sessionId ?? null,
  };
});

// ---------------------------------------------------------------------------
// Write queue file
// ---------------------------------------------------------------------------
const queue = {
  generatedAt:      new Date().toISOString().split('T')[0],
  referencePostalCode: 'V5T 2J6 (Mount Pleasant, Vancouver)',
  scoringMethod:    '60% log-normalized listing count + 40% proximity — normalized within pending pool only',
  totalProviders:   providers.length,
  providers,
};

fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));

const pending   = providers.filter(p => p.status === 'pending').length;
const done      = providers.filter(p => p.status === 'completed').length;
const failed    = providers.filter(p => p.status === 'failed').length;
const skipped   = providers.filter(p => p.status === 'skipped').length;
const inProgress = providers.filter(p => p.status === 'in_progress').length;

console.log('\n✅ Queue written to:', QUEUE_FILE);
console.log(`   Total providers: ${providers.length}`);
console.log(`   pending:     ${pending}`);
console.log(`   completed:   ${done}`);
console.log(`   in_progress: ${inProgress}`);
console.log(`   failed:      ${failed}`);
console.log(`   skipped:     ${skipped}`);
console.log('\nTop 5 by priority:');
providers.slice(0, 5).forEach(p =>
  console.log(`  ${p.rank}. ${p.name} — ${p.listings} listings, ${p.distKm ?? 'N/A'} km, score ${p.priorityScore}`)
);
