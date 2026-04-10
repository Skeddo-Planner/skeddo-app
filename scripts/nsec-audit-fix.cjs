/**
 * North Shore Equestrian Centre Audit Fix — 2026-04-09
 * Rank 221 in audit queue
 *
 * Browser-verified against:
 * - http://www.wecreateriders.com/summer-camps.html
 * - http://www.wecreateriders.com/services.html
 * - http://www.wecreateriders.com/pony-play-dates.html
 *
 * Key corrections:
 * - ageMin 6→7 for summer camps (website says "ages 7 and up")
 * - Advanced Beginner: Full Day→Half Day (website only offers 3hr sessions)
 * - Pony Play Dates: reclassified from 2hr summer program to 30min year-round activity
 * - registrationUrl: northshoreequestrian.com→wecreateriders.com
 * - 2026 dates/prices not yet published
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'North Shore Equestrian Centre') continue;

  // Common fixes
  delete p.urlVerified;

  // 16064: Intro Riding Camp (AM)
  if (p.id === 16064) {
    p.ageMin = 7;
    p.startTime = '8:30 AM';
    p.endTime = '11:30 AM';
    p.registrationUrl = 'http://www.wecreateriders.com/summer-camps.html';
    p.description = 'Introductory half-day horseback riding camp (AM session) at North Shore Equestrian Centre. For ages 7+, no prior experience needed. Max 6 students. Learn safety, grooming, leading, tacking up, mounting, and riding at walk/trot. 45-60 min riding lesson daily. Helmets and equipment provided (own boots with heel required). Registration opens April.';
    p.costNote = '2026 pricing not yet published. Registration opens every April. Contact WeCreateRiders@gmail.com or 604-988-5131.';
    corrected++;
  }

  // 16065: Intro Riding Camp (PM)
  if (p.id === 16065) {
    p.ageMin = 7;
    p.startTime = '12:00 PM';
    p.endTime = '3:00 PM';
    p.registrationUrl = 'http://www.wecreateriders.com/summer-camps.html';
    p.description = 'Introductory half-day horseback riding camp (PM session) at North Shore Equestrian Centre. For ages 7+, no prior experience needed. Max 6 students. Learn safety, grooming, leading, tacking up, mounting, and riding at walk/trot. 45-60 min riding lesson daily. Helmets and equipment provided (own boots with heel required). Registration opens April.';
    p.costNote = '2026 pricing not yet published. Registration opens every April. Contact WeCreateRiders@gmail.com or 604-988-5131.';
    corrected++;
  }

  // 16066: Advanced Beginner Riding Camp — fix from Full Day to Half Day
  if (p.id === 16066) {
    p.startTime = '8:30 AM';
    p.endTime = '11:30 AM';
    p.scheduleType = 'Half Day (AM)';
    p.dayLength = 'Half Day';
    p.durationPerDay = 3;
    p.registrationUrl = 'http://www.wecreateriders.com/summer-camps.html';
    p.description = 'Advanced Beginner horseback riding camp at North Shore Equestrian Centre. For riders who completed Intro camp or prior lessons. Must be able to tack up, have good control at walk and have trotted. Focus on riding position, basic aids, improved trot control. Max 6 students, 3 hours/day, 45-60 min riding lesson. Also available: Novice and Advanced Novice levels.';
    p.costNote = '2026 pricing not yet published. Registration opens every April. Contact WeCreateRiders@gmail.com or 604-988-5131.';
    p.ageMin = 7;
    corrected++;
  }

  // 16067: Pony Play Dates — reclassify as year-round activity
  if (p.id === 16067) {
    p.name = 'Pony Play Date';
    p.campType = 'Class/Lesson';
    p.scheduleType = 'Activity';
    p.startTime = null;
    p.endTime = null;
    p.startDate = null;
    p.endDate = null;
    p.days = 'By Appointment';
    p.durationPerDay = 0.5;
    p.dayLength = 'Single Day';
    p.cost = null;
    p.costNote = 'Price not listed on website. 30-minute session by appointment only. Contact WeCreateRiders@gmail.com to schedule.';
    p.registrationUrl = 'http://www.wecreateriders.com/pony-play-dates.html';
    p.description = 'Individual pony experience for children 4+ at North Shore Equestrian Centre. 30-minute 1-on-1 session by pre-scheduled appointment. Includes grooming, tacking up, and a 5-10 minute hand-led ride in covered arena. Year-round, rain or shine.';
    p.season = 'Year-Round';
    p.repeating = true;
    corrected++;
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`NSEC: ${corrected} corrected`);
console.log(`Total programs: ${programs.length}`);
