/**
 * SD43 (Coquitlam School District) Audit Fix — 2026-04-09
 * Rank 204 in audit queue
 *
 * Browser-verified against https://ce43.augusoft.net/info/landing/summer-learning
 *
 * Corrections:
 * - SD43-0001: confirmed2026=true, enrollmentStatus→Coming Soon, registrationDate=2026-04-21
 * - SD43-0002: confirmed2026=false (no "Grades 5-7" program exists on live page)
 * - SD43-0003: fix times to 8:45 AM-11:45 AM, confirmed2026=true, Coming Soon
 * - SD43-0004: fix dates Jul 7-24, times 8:30 AM-11:30 AM, ageMax→17, location Centennial
 * - SD43-0005: fix times 8:00 AM-11:30 AM, durationPerDay→3.5, confirmed2026=true
 * - SD43-0006: fix times 8:00 AM-11:30 AM, durationPerDay→3.5, confirmed2026=true
 * New:
 * - SD43-0007: Secondary Skill Building (Gr. 9-12) — missing from DB
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

const SD43_IDS = ['SD43-0001', 'SD43-0002', 'SD43-0003', 'SD43-0004', 'SD43-0005', 'SD43-0006'];
let changed = 0;

for (const p of programs) {
  if (!SD43_IDS.includes(p.id)) continue;

  switch (p.id) {
    case 'SD43-0001': {
      // Elementary Summer Learning (Gr. 1-5) — times/dates correct, just status update
      p.confirmed2026 = true;
      p.enrollmentStatus = 'Coming Soon';
      p.registrationDate = '2026-04-21';
      p.registrationUrl = 'https://ce43.augusoft.net/index.cfm?method=templates.CustomTemplatePreview&ContentID=191';
      p.description = 'Reading, writing, math, and science enrichment for elementary students (Grades 1-5). Daily 9:00 AM - 12:00 PM, July 7-24. Multiple school locations across Coquitlam/Port Coquitlam/Port Moody. FREE for BC students. Elementary lottery closed April 8; registration reopens April 21-July 7.';
      changed++;
      break;
    }

    case 'SD43-0002': {
      // "Grades 5-7" does NOT exist on live page — no such program
      p.confirmed2026 = false;
      p.enrollmentStatus = 'Likely Coming Soon';
      p.description = 'Previously listed as Elementary Summer Learning (Grades 5-7). This program does not appear on the 2026 SD43 Summer Learning page — Elementary is Gr. 1-5 and Middle is Gr. 6-8 with no overlap program. Retained in DB per R31; may reappear in future years.';
      changed++;
      break;
    }

    case 'SD43-0003': {
      // Middle School (Gr. 6-8) — fix times from 9:00-12:00 to 8:45-11:45
      p.startTime = '8:45 AM';
      p.endTime = '11:45 AM';
      p.confirmed2026 = true;
      p.enrollmentStatus = 'Coming Soon';
      p.registrationDate = '2026-04-21';
      p.registrationUrl = 'https://ce43.augusoft.net/index.cfm?method=templates.CustomTemplatePreview&ContentID=192';
      p.description = 'Enrichment courses for middle school students (Grades 6-8). Daily 8:45 AM - 11:45 AM, July 7-24. Locations: Hillcrest, Kwayhquitlum, Scott Creek. FREE for BC students. Elementary/Middle lottery closed April 8; registration reopens April 21-July 7.';
      changed++;
      break;
    }

    case 'SD43-0004': {
      // Secondary Academic Completion (Gr. 10-12) — fix dates, times, location, ageMax
      p.startDate = '2026-07-07';
      p.endDate = '2026-07-24';
      p.startTime = '8:30 AM';
      p.endTime = '11:30 AM';
      p.ageMax = 17;
      p.confirmed2026 = true;
      p.enrollmentStatus = 'Coming Soon';
      p.registrationDate = '2026-04-28';
      p.registrationUrl = 'https://ce43.augusoft.net/index.cfm?method=templates.CustomTemplatePreview&ContentID=193#secondary-remedial';
      p.address = 'Centennial Secondary, Coquitlam, BC';
      p.neighbourhood = 'Coquitlam';
      p.description = 'For SD43 students who need to complete courses (Math 10 Foundations & Pre-Calculus, Science 10). By referral only from home school. Morning class 8:30-11:30 AM or afternoon class 12:00-3:00 PM. At Centennial Secondary. FREE. Secondary lottery opens April 28.';
      changed++;
      break;
    }

    case 'SD43-0005': {
      // High School Credit — fix times, durationPerDay
      p.startTime = '8:00 AM';
      p.endTime = '11:30 AM';
      p.durationPerDay = 3.5;
      p.confirmed2026 = true;
      p.enrollmentStatus = 'Coming Soon';
      p.registrationDate = '2026-04-28';
      p.registrationUrl = 'https://ce43.augusoft.net/index.cfm?method=templates.CustomTemplatePreview&ContentID=193#secondary-advanced';
      p.address = 'Centennial Secondary & Gleneagle Secondary, Coquitlam, BC';
      p.neighbourhood = 'Coquitlam';
      p.description = 'Full credit face-to-face courses. Open to all school-aged students. Morning classes 8:00-11:30 AM or afternoon classes 12:00-3:30 PM daily. Non-instructional days: Jul 27, Aug 3. At Centennial or Gleneagle Secondary. FREE for BC students. Secondary lottery opens April 28.';
      changed++;
      break;
    }

    case 'SD43-0006': {
      // Fast Track Hybrid — fix times, durationPerDay, endDate
      p.startTime = '8:00 AM';
      p.endTime = '11:30 AM';
      p.endDate = '2026-08-06';
      p.durationPerDay = 3.5;
      p.confirmed2026 = true;
      p.enrollmentStatus = 'Coming Soon';
      p.registrationDate = '2026-04-28';
      p.registrationUrl = 'https://ce43.augusoft.net/index.cfm?method=templates.CustomTemplatePreview&ContentID=193#secondary-fast';
      p.address = 'Centennial Secondary & Gleneagle Secondary, Coquitlam, BC';
      p.neighbourhood = 'Coquitlam';
      p.description = 'Hybrid credit courses combining twice-weekly in-person classes with online learning. Tue/Thu track: Jul 2-Aug 5. Wed/Fri track: Jul 3-Aug 6. 10 in-person classes per track. Morning 8:00-11:30 AM or afternoon 12:00-3:30 PM. Non-instructional days: Jul 27, Aug 3. At Centennial or Gleneagle Secondary. FREE for BC students. Secondary lottery opens April 28.';
      changed++;
      break;
    }
  }
}

// Add missing program: Secondary Skill Building (Gr. 9-12)
const newProgram = {
  id: 'SD43-0007',
  name: 'Secondary Skill Building (Grades 9-12)',
  provider: 'Coquitlam School District (SD43)',
  category: 'Academic',
  campType: 'Summer Learning',
  scheduleType: 'Half Day (AM)',
  ageMin: 14,
  ageMax: 17,
  startDate: '2026-07-07',
  endDate: '2026-07-24',
  days: 'Mon-Fri',
  startTime: '8:30 AM',
  endTime: '11:30 AM',
  cost: 0,
  indoorOutdoor: 'Indoor',
  neighbourhood: 'Coquitlam',
  address: 'Centennial Secondary & Gleneagle Secondary, Coquitlam, BC',
  postalCode: null,
  lat: 49.2838,
  lng: -122.7932,
  enrollmentStatus: 'Coming Soon',
  registrationDate: '2026-04-28',
  registrationUrl: 'https://ce43.augusoft.net/index.cfm?method=templates.CustomTemplatePreview&ContentID=193#secondary-skill',
  description: 'Skill building enrichment for secondary students (Grades 9-12). Morning class 8:30-11:30 AM or afternoon class 12:00-3:00 PM. July 7-24. At Centennial or Gleneagle Secondary. FREE for BC students. Secondary lottery opens April 28.',
  tags: ['school district', 'Coquitlam', 'SD43', 'summer learning', 'free', 'academic'],
  source: 'Coquitlam SD43 Summer Learning 2026',
  season: 'Summer 2026',
  dayLength: 'Half Day',
  priceVerified: true,
  durationPerDay: 3,
  activityType: 'Academic',
  status: 'Open',
  confirmed2026: true,
  urlVerified: true
};

programs.push(newProgram);

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`SD43 audit: ${changed} programs corrected, 1 added (SD43-0007)`);
console.log(`Total programs: ${programs.length}`);
