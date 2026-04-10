/**
 * Steamoji South Surrey — Full Audit Fix (2026-04-10)
 * 
 * Browser-verified at steamoji.com/camps/canada-bc-south-surrey/
 * 
 * PROBLEM: 6 generic "STEAM Creative Camp" entries (IDs 193-198) + 1 duplicate (steamoji-surrey-1)
 * collapsed 11 distinct programs with 24 sessions into identical generic entries.
 * 
 * FIX: Remove all 7 old entries, replace with 24 properly broken-out sessions.
 * Pricing not publicly visible (behind member login) — cost=null with costNote.
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

// Remove old generic entries
const idsToRemove = [193, 194, 195, 196, 197, 198, 'steamoji-surrey-1'];
const before = programs.length;
const filtered = programs.filter(p => !idsToRemove.includes(p.id));
console.log(`Removed ${before - filtered.length} generic Steamoji entries`);

// Common fields
const base = {
  provider: 'Steamoji',
  category: 'STEM',
  campType: 'Summer Camp',
  days: 'Mon-Fri',
  indoorOutdoor: 'Indoor',
  neighbourhood: 'South Surrey',
  address: 'South Surrey, BC',
  city: 'Surrey',
  cost: null,
  costNote: 'Pricing requires member login at steamoji.com. Not publicly listed.',
  priceVerified: false,
  enrollmentStatus: 'Open',
  status: 'Open',
  confirmed2026: true,
  registrationUrl: 'https://www.steamoji.com/camps/canada-bc-south-surrey/',
  tags: ['STEM', 'maker', 'engineering', 'coding'],
};

const newPrograms = [
  // 1. Carnival of Creativity (Ages 5+, half-day)
  { name: 'Carnival of Creativity: Digital Storytelling and Fabrication', ageMin: 5, ageMax: 7, startTime: '9:00 AM', endTime: '12:00 PM', scheduleType: 'Half Day',
    sessions: [['2026-06-29','2026-07-03'], ['2026-07-13','2026-07-17'], ['2026-08-03','2026-08-07']] },
  // 2. Lightbulb Moment (Ages 8+, full-day)
  { name: 'Lightbulb Moment: Making a 3D Printed Lamp', ageMin: 8, ageMax: 14, startTime: '9:00 AM', endTime: '3:00 PM', scheduleType: 'Full Day',
    sessions: [['2026-06-29','2026-07-03'], ['2026-08-03','2026-08-07'], ['2026-08-31','2026-09-04']] },
  // 3. Marble Run Madness (Ages 8+, full-day)
  { name: 'Marble Run Madness: Design and Engineer', ageMin: 8, ageMax: 14, startTime: '9:00 AM', endTime: '3:00 PM', scheduleType: 'Full Day',
    sessions: [['2026-07-06','2026-07-10'], ['2026-08-17','2026-08-21']] },
  // 4. VEX IQ - On the Move (Ages 10+, full-day)
  { name: 'VEX IQ Robotics Camp - On the Move', ageMin: 10, ageMax: 14, startTime: '9:00 AM', endTime: '3:00 PM', scheduleType: 'Full Day',
    sessions: [['2026-07-06','2026-07-10']] },
  // 5. Battle Bots (Ages 8+, full-day)
  { name: 'Battle Bots: Engineer, Code, Compete!', ageMin: 8, ageMax: 14, startTime: '9:00 AM', endTime: '3:00 PM', scheduleType: 'Full Day',
    sessions: [['2026-07-13','2026-07-17'], ['2026-07-27','2026-07-31'], ['2026-08-10','2026-08-14']] },
  // 6. Voice Assistant (Ages 10+, full-day)
  { name: 'Build and Code Your Own Voice Assistant', ageMin: 10, ageMax: 14, startTime: '9:00 AM', endTime: '3:00 PM', scheduleType: 'Full Day',
    sessions: [['2026-07-13','2026-07-17'], ['2026-08-10','2026-08-14'], ['2026-08-31','2026-09-04']] },
  // 7. Arduino in Action (Ages 10+, full-day)
  { name: 'Arduino in Action: Build, Code, Move!', ageMin: 10, ageMax: 14, startTime: '9:00 AM', endTime: '3:00 PM', scheduleType: 'Full Day',
    sessions: [['2026-07-20','2026-07-24'], ['2026-08-17','2026-08-21']] },
  // 8. Computer Vision (Ages 8+, full-day)
  { name: 'Coding the Future: Computer Vision in AI', ageMin: 8, ageMax: 14, startTime: '9:00 AM', endTime: '3:00 PM', scheduleType: 'Full Day',
    sessions: [['2026-07-20','2026-07-24'], ['2026-08-24','2026-08-28']] },
  // 9. RoboCity Builders (Ages 5+, half-day)
  { name: 'RoboCity Builders: Lights, Bots & Big Ideas', ageMin: 5, ageMax: 7, startTime: '9:00 AM', endTime: '12:00 PM', scheduleType: 'Half Day',
    sessions: [['2026-07-27','2026-07-31'], ['2026-08-17','2026-08-21'], ['2026-08-31','2026-09-04']] },
  // 10. VEX IQ - Carnival Games (Ages 10+, full-day)
  { name: 'Vex IQ Robotics Camp - Carnival Games', ageMin: 10, ageMax: 14, startTime: '9:00 AM', endTime: '3:00 PM', scheduleType: 'Full Day',
    sessions: [['2026-07-27','2026-07-31']] },
  // 11. VEX IQ - Search & Rescue (Ages 10+, full-day)
  { name: 'Vex IQ Robotics Camp: Search & Rescue', ageMin: 10, ageMax: 14, startTime: '9:00 AM', endTime: '3:00 PM', scheduleType: 'Full Day',
    sessions: [['2026-08-24','2026-08-28']] },
];

let counter = 0;
for (const prog of newPrograms) {
  for (const [start, end] of prog.sessions) {
    counter++;
    const entry = {
      ...base,
      id: `steamoji-ss-${counter}`,
      name: prog.name,
      ageMin: prog.ageMin,
      ageMax: prog.ageMax,
      startTime: prog.startTime,
      endTime: prog.endTime,
      scheduleType: prog.scheduleType,
      startDate: start,
      endDate: end,
    };
    filtered.push(entry);
  }
}

console.log(`Added ${counter} new Steamoji South Surrey entries`);
console.log(`Net change: ${counter - (before - filtered.length + counter)} entries`);

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(filtered, null, 2) + '\n');
console.log(`Total programs: ${filtered.length}`);
