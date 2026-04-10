/**
 * Batch Status Update — Browser-Verified Audit Fixes (2026-04-09)
 * Ranks 301-413 in audit queue — via Chrome browser
 *
 * Browser-verified providers that have moved from "Likely Coming Soon" to "Open":
 *
 * 1. Dunbar Little League — 2026 registration active via TeamSnap
 * 2. UBC CEDAR Program — 2026 applications now accepted via Qualtrics form
 * 3. BC Forensic League (DebateOn) — 2026 summer day camp + camp registration open
 *    - Summer Day Camp: Gr 1-6, Jul 6-Aug 21, Mon-Fri 9am-3pm
 *    - Summer Camp: Gr 3-12
 * 4. Scouts Canada Camp McLean — CampBrain registration portal is live
 * 5. The Cinematheque Cinelab — 2026 registration now open (ages 14-19, 2-week filmmaking)
 * 6. Debate Camp — 2026 registration now open
 *    - Vancouver Day Camps: Jun 29-Jul 3 (4-day), Jul 6-10, Jul 13-17
 *    - Western Overnight Camps: Jul 26-Aug 1, Aug 2-8, Jul 26-Aug 8 (combined)
 * 7. RAW Sports — 2026 Vancouver Summer Football Camp listed ($629.99-$669.99)
 * 8. Vancouver Film School — Summer Intensives 2026 open (Jul 6-Aug 14, 9am-4pm)
 *    - Was "Full/Waitlist" but page says "limited spots available — register today"
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

const updates = [
  {
    id: 'dunbar-ll-1',
    changes: {
      enrollmentStatus: 'Open',
      status: 'Open',
      confirmed2026: true,
      registrationUrl: 'https://registration.teamsnap.com/form/40339',
    },
  },
  {
    id: 'ubc-cedar-1',
    changes: {
      enrollmentStatus: 'Open',
      status: 'Open',
      confirmed2026: true,
      registrationUrl: 'https://cedar.ubc.ca/camp/registration',
    },
  },
  {
    id: 'bcfl-1',
    changes: {
      enrollmentStatus: 'Open',
      status: 'Open',
      confirmed2026: true,
      registrationUrl: 'https://www.debateon.ca/summer',
    },
  },
  {
    id: 'camp-mclean-1',
    changes: {
      enrollmentStatus: 'Open',
      status: 'Open',
      confirmed2026: true,
      registrationUrl: 'https://campmclean.campbrainregistration.com/',
    },
  },
  {
    id: 'cinelab-1',
    changes: {
      enrollmentStatus: 'Open',
      status: 'Open',
      confirmed2026: true,
      registrationUrl: 'https://thecinematheque.ca/learn/cinelab',
    },
  },
  {
    id: 'debate-camp-1',
    changes: {
      enrollmentStatus: 'Open',
      status: 'Open',
      confirmed2026: true,
      registrationUrl: 'https://www.debatecamp.com/vancouver',
    },
  },
  {
    id: 'raw-sports-1',
    changes: {
      enrollmentStatus: 'Open',
      status: 'Open',
      confirmed2026: true,
      registrationUrl: 'https://rawsports.ca/british-columbia-football-camps/',
    },
  },
  {
    id: 'vfs-summer-1',
    changes: {
      enrollmentStatus: 'Open',
      status: 'Open',
      confirmed2026: true,
      registrationUrl: 'https://vfs.edu/programs/summer-intensives',
    },
  },
];

let updated = 0;
for (const u of updates) {
  const prog = programs.find(p => p.id === u.id);
  if (prog) {
    Object.assign(prog, u.changes);
    updated++;
    console.log(`Updated ${u.id}: ${JSON.stringify(u.changes)}`);
  } else {
    console.log(`WARNING: ${u.id} not found`);
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nBatch status update: ${updated} programs updated`);
console.log(`Total programs: ${programs.length}`);
