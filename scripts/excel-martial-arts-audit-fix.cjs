/**
 * Excel Martial Arts Audit Fix — 2026-04-09
 * Rank 235 in audit queue
 *
 * Browser-verified against:
 * - https://martialartsportcoquitlam.com/program/summer-camp/
 * - https://martialartsportcoquitlam.com/spring-summer-camp-registration/
 *
 * Key changes:
 * - enrollmentStatus: "Likely Coming Soon" → "Open" (registration confirmed open)
 * - registrationUrl updated to registration page
 * - Address updated with postal code V3C 2M8
 * - Times verified: 9:00 AM - 3:30 PM (free drop-off 7:30 AM, pick-up until 5:30 PM)
 * - activityType: corrected to Martial Arts
 * - costNote clarified — $1440 not verified on live page (behind iframe form)
 * - Description updated with verified camp details
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  if (p.provider !== 'Excel Martial Arts') continue;
  if (![387, 388, 389, 390].includes(Number(p.id))) continue;

  p.enrollmentStatus = 'Open';
  p.status = 'Open';
  p.registrationUrl = 'https://martialartsportcoquitlam.com/spring-summer-camp-registration/';
  p.address = '1740 Broadway St #1, Port Coquitlam, BC V3C 2M8';
  p.postalCode = 'V3C 2M8';
  p.startTime = '9:00 AM';
  p.endTime = '3:30 PM';
  p.activityType = 'Martial Arts';
  p.category = 'Sports';
  p.scheduleType = 'Full Day';
  p.dayLength = 'Full Day';
  p.durationPerDay = 6.5;
  p.urlVerified = true;
  p.priceVerified = false;
  p.costNote = '$1440 from prior listing — not verified on current site (pricing behind registration form). Camp hours 9am-3:30pm. Free early drop-off from 7:30am, free late pick-up until 5:30pm. Contact 604-554-0181 for current pricing.';
  p.description = 'Spring Break & Summer Martial Arts Camp at Excel Martial Arts, Port Coquitlam. Ages 7-12. Full day 9am-3:30pm Mon-Fri. Martial arts classes, games, crafts, outdoor play, obstacle courses. Free early drop-off (7:30am) and late pick-up (5:30pm). Weekly themes with special field trips. Fully licensed camp.';
  p.tags = ['martial arts', 'summer camp', 'taekwondo', 'fitness', 'sports'];
  corrected++;
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Excel Martial Arts: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
