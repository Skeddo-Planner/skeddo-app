/**
 * West Vancouver Schools (SD45) Audit Fix — 2026-04-09
 * Rank 219 in audit queue
 *
 * Browser-verified against:
 * - https://westvancouverschools.ca/summer-learning/
 * - https://westvancouverschools.ca/summer-learning/elementary-programs/
 * - https://westvancouverschools.ca/summer-learning/secondary-programs/
 * - https://westvancouverschools.ca/summer-learning/registration-deposit-and-fees/
 *
 * Key corrections:
 * - cost $100→$0 (courses are FREE for BC students; $100 is a refundable deposit)
 * - Elementary ageMax 10→13 (Grades 1-7 = ages 6-13)
 * - startTime/endTime filled in from website
 * - neighbourhood/city fixed: "West Point Grey"/"Vancouver" → "West Vancouver"
 * - confirmed2026: false→true (2026 dates confirmed)
 * - SD45-0004 endDate: Jul 17→Jul 31 (Full Credit runs 4 weeks)
 * - Enrollment statuses updated per staggered registration dates
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'West Vancouver Schools (SD45)') continue;

  // Common fixes for all entries
  p.cost = 0;
  p.costNote = 'Free for BC residents under 19. $100 refundable registration deposit required (refunded if student attends full course). International fee-paying students pay separate course fees. Contact summerlearning@wvschools.ca for financial hardship.';
  p.priceVerified = true;
  p.confirmed2026 = true;
  p.neighbourhood = 'West Vancouver';
  p.city = 'West Vancouver';
  delete p.urlVerified;
  delete p.timeNote;

  // SD45-0001: Elementary Literacy & Numeracy (English)
  if (p.id === 'SD45-0001') {
    p.ageMax = 13;
    p.startTime = '8:30 AM';
    p.endTime = '12:15 PM';
    p.address = 'Irwin Park Elementary (2455 Haywood Ave) or Ridgeview Elementary (1250 Mathers Ave), West Vancouver, BC';
    p.lat = 49.3418;
    p.lng = -123.1678;
    p.enrollmentStatus = 'Open';
    p.status = 'Open';
    p.registrationUrl = 'https://westvancouverschools.ca/summer-learning/registration/';
    p.description = 'Free Literacy and Numeracy enrichment for Grades 1-7 (current K-6). Half day each of ELA and Math. July 2-17, Mon-Fri 8:30 AM-12:15 PM (or 8:45-12:30 depending on location). 20-min outdoor break included. At Irwin Park or Ridgeview Elementary. $100 refundable deposit. One course per student.';
    p.ageSpanJustified = 'SD45 elementary summer learning is a single program for all Grades 1-7 (ages 6-13) — school district does not sub-divide by age group.';
    corrected++;
  }

  // SD45-0002: Elementary French Immersion
  if (p.id === 'SD45-0002') {
    p.ageMax = 13;
    p.startTime = '8:30 AM';
    p.endTime = '12:15 PM';
    p.address = '2455 Haywood Ave, West Vancouver, BC';
    p.lat = 49.3418;
    p.lng = -123.1678;
    p.enrollmentStatus = 'Open';
    p.status = 'Open';
    p.registrationUrl = 'https://westvancouverschools.ca/summer-learning/registration/';
    p.description = 'Free French Immersion Literacy and Numeracy for Grades 1-7 (current K-6). Same curriculum as English program, delivered in French. Must be enrolled in French Immersion for 2025-2026. July 2-17, Mon-Fri 8:30 AM-12:15 PM. At Irwin Park Elementary only. $100 refundable deposit.';
    p.ageSpanJustified = 'SD45 elementary summer learning is a single program for all Grades 1-7 (ages 6-13) — school district does not sub-divide by age group.';
    corrected++;
  }

  // SD45-0003: Secondary Preview/Review (Gr 8-9)
  if (p.id === 'SD45-0003') {
    p.startTime = '8:30 AM';
    p.endTime = '12:15 PM';
    p.address = '1750 Mathers Ave, West Vancouver, BC';
    p.enrollmentStatus = 'Coming Soon';
    p.status = 'Coming Soon';
    p.registrationDate = '2026-04-10';
    p.registrationUrl = 'https://westvancouverschools.ca/summer-learning/registration/';
    p.description = 'Free non-credit preview/review courses for Grades 8-9 (current Gr 7-8): English 8, English 9, Math 8, Math 9, Science 8, Science 9. 12-day program reinforcing essential skills. July 2-17, Mon-Fri 8:30 AM-12:15 PM. At West Vancouver Secondary. $100 refundable deposit.';
    corrected++;
  }

  // SD45-0004: Secondary Full Credit (Gr 10-12)
  if (p.id === 'SD45-0004') {
    p.startTime = '8:30 AM';
    p.endTime = '12:40 PM';
    p.endDate = '2026-07-31';
    p.address = '1750 Mathers Ave, West Vancouver, BC';
    p.enrollmentStatus = 'Open';
    p.status = 'Open';
    p.registrationUrl = 'https://westvancouverschools.ca/summer-learning/registration/';
    p.description = 'Free full credit academic courses for Grades 10-12 (current Gr 9-11): Pre-Calc/Foundations Math 10, Pre-Calc 11, Pre-Calc 12, Science 10, Physics 11, English 10 (Composition & Literacy), ELL English 10 (Cultural Literacy). Fast-paced, full curriculum. July 2-31, Mon-Fri 8:30 AM-12:40 PM. At West Vancouver Secondary. $100 refundable deposit.';
    corrected++;
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`SD45: ${corrected} corrected`);
console.log(`Total programs: ${programs.length}`);
