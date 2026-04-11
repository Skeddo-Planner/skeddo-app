/**
 * Batch Audit Fix — Ranks 245-248 — 2026-04-09
 *
 * 245: Woods and Waves Outdoor Learning (3 entries)
 * 246: West Coast Circus (4 entries)
 * 247: New Westminster School District SD40 (3 entries)
 * 248: Ocean Ambassadors Canada (3 entries)
 */

const fs = require('fs');
const path = require('path');

const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf8'));

let corrected = 0;

for (const p of programs) {
  // === RANK 245: Woods and Waves Outdoor Learning ===
  if (p.provider && p.provider.includes('Woods and Waves') && [477, 478, 479].includes(Number(p.id))) {
    p.postalCode = 'V6K 0C6';
    p.address = '302-2525 Carnarvon Street, Vancouver, BC V6K 0C6';
    p.activityType = 'Outdoor Education';
    p.category = 'Nature';
    p.indoorOutdoor = 'Outdoor';

    if (Number(p.id) === 478) {
      // Summer program — verified
      p.confirmed2026 = true;
      p.enrollmentStatus = 'Open';
      p.status = 'Open';
      p.cost = 445;
      p.priceVerified = true;
      p.startTime = '9:00 AM';
      p.endTime = '3:00 PM';
      p.startDate = '2026-07-06';
      p.endDate = '2026-08-28';
      p.costNote = '$445/week standard. Final week (Aug 4-7) $356. Refundable deposit required. New families must complete initial registration form. Contact: 778-929-5761.';
      p.description = 'Summer outdoor learning program for ages 3-6 at Woods and Waves, Vancouver. Weekly sessions Jul 6 - Aug 28. 9am-3pm. Outdoor nature-based education and play.';
    } else {
      // Spring (477) and Fall (479) — seasonal, not summer
      p.costNote = Number(p.id) === 477 ?
        '$445/term for spring program. Contact 778-929-5761 for current availability.' :
        '$445/term for fall program. Contact 778-929-5761 for current availability.';
    }

    p.tags = ['outdoor education', 'nature', 'preschool'];
    corrected++;
  }

  // === RANK 246: West Coast Circus ===
  if (p.provider && p.provider.includes('West Coast Circus') && [681, 682, 683, 684].includes(Number(p.id))) {
    p.cost = 409;
    p.priceVerified = true;
    p.startTime = '9:30 AM';
    p.endTime = '3:00 PM';
    p.durationPerDay = 5.5;
    p.activityType = 'Circus Arts';
    p.category = 'Arts';
    p.indoorOutdoor = 'Indoor';
    p.postalCode = 'V3Y 0G4';
    p.costNote = '$409/week. Early drop-off 8:30am ($12/day or $50/wk). Late pick-up until 4pm ($12/day or $50/wk). Nut-free facility. Friday 2:30pm showcase. Cancellation: 90% refund 2+ weeks before; non-refundable < 1 week.';
    p.description = 'Circus camp at West Coast Circus, Pitt Meadows. Ages 6-13. 9:30am-3pm Mon-Fri. Four daily rotations: aerial arts (silks, hoop, trapeze), tumbling & trampoline, equilibristics (rola bola, stilts), object manipulation (juggling, plate spinning). Friday showcase for families.';
    p.tags = ['circus', 'aerial arts', 'acrobatics', 'performing arts', 'summer camp'];
    p.registrationUrl = 'https://portal.iclasspro.com/westcoastcircus/camps/1';
    p.urlVerified = true;
    p.ageSpanJustified = 'Provider offers single age group 6-13 for summer circus camp — no separate age bands';
    corrected++;
  }

  // === RANK 247: New Westminster School District SD40 ===
  if (p.provider && p.provider.includes('New Westminster School District') && ['SD40-0001', 'SD40-0002', 'SD40-0003'].includes(String(p.id))) {
    p.cost = 0;
    p.priceVerified = true;
    p.activityType = 'Academic';
    p.category = 'Academic';
    p.indoorOutdoor = 'Indoor';
    p.registrationUrl = 'https://newwestschools.ca/programs-services/summer-learning/';
    p.urlVerified = true;

    const id = String(p.id);
    if (id === 'SD40-0001') {
      p.name = 'Secondary Summer Learning (Grades 10-12)';
      p.ageMin = 15;
      p.ageMax = 18;
      p.startDate = '2026-07-02';
      p.endDate = '2026-07-31';
      p.startTime = '8:10 AM';
      p.endTime = '4:20 PM';
      p.confirmed2026 = true;
      p.enrollmentStatus = 'Coming Soon';
      p.status = 'Coming Soon';
      p.registrationDate = '2026-03-30';
      p.costNote = 'Free. Full-credit courses. Registration Mar 30 at 9am for in-district; May 15 for out-of-district. First-come first-served. May be restricted to in-district. Contact 604-517-6240.';
      p.description = 'Free secondary summer learning at New Westminster School District. Grades 10-12 full-credit courses. Jul 2-31, Mon-Fri. Morning 8:10am-12pm or afternoon 12:30-4:20pm sessions.';
    }
    if (id === 'SD40-0002') {
      p.name = 'Non-Credit Short Courses (Grades 6-12)';
      p.ageMin = 11;
      p.ageMax = 18;
      p.startDate = '2026-07-06';
      p.endDate = '2026-07-22';
      p.startTime = '8:55 AM';
      p.endTime = '3:05 PM';
      p.confirmed2026 = true;
      p.enrollmentStatus = 'Coming Soon';
      p.status = 'Coming Soon';
      p.registrationDate = '2026-03-30';
      p.costNote = 'Free. Non-credit short courses. Registration Mar 30 at 9am for in-district; May 15 for out-of-district. First-come first-served. Contact 604-517-6240.';
      p.description = 'Free non-credit short courses at New Westminster School District. Grades 6-12. Jul 6-22, Mon-Fri. Morning 8:55am-12pm or afternoon 12:30-3:05pm sessions.';
      p.ageSpanJustified = 'School district program covers grades 6-12 as single offering';
    }
    if (id === 'SD40-0003') {
      p.name = 'K-5 Summer Learning';
      p.ageMin = 5;
      p.ageMax = 11;
      p.startDate = '2026-07-06';
      p.endDate = '2026-07-22';
      p.startTime = '8:55 AM';
      p.endTime = '12:00 PM';
      p.confirmed2026 = true;
      p.enrollmentStatus = 'Coming Soon';
      p.status = 'Coming Soon';
      p.registrationDate = '2026-03-30';
      p.costNote = 'Free. K-5 morning program. Registration Mar 30 at 9am for in-district; May 15 for out-of-district. First-come first-served. Contact 604-517-6240.';
      p.description = 'Free K-5 summer learning at New Westminster School District. Jul 6-22, Mon-Fri, 8:55am-12pm. First-come first-served enrollment.';
      p.ageSpanJustified = 'School district program covers K-5 as single offering';
    }

    p.tags = ['academic', 'summer learning', 'free'];
    corrected++;
  }

  // === RANK 248: Ocean Ambassadors Canada ===
  if (p.provider && p.provider.includes('Ocean Ambassadors') && [16061, 16062, 16063].includes(Number(p.id))) {
    p.priceVerified = true;
    p.confirmed2026 = true;
    p.enrollmentStatus = 'Open';
    p.status = 'Open';
    p.indoorOutdoor = 'Outdoor';
    p.urlVerified = true;

    const id = Number(p.id);
    if (id === 16061) {
      p.ageMin = 7;
      p.ageMax = 9;
      p.cost = 399;
      p.costNote = '$399/child. Ages 7-9: Mon-Wed at Mt Seymour, Thu-Fri at Cates Park. Paddleboarding, kayaking, outdoor skills. Partnership with Mt Seymour.';
      p.description = 'Sea to Sky Camp for ages 7-9. Mon-Wed at Mt Seymour (mountain days), Thu-Fri at Whey-ah-Wichen/Cates Park (ocean days with paddleboarding/kayaking). Explore North Shore ocean and mountain environments.';
      p.activityType = 'Outdoor Adventure';
      p.category = 'Nature';
      p.tags = ['outdoor adventure', 'paddleboarding', 'kayaking', 'nature', 'ocean'];
    }
    if (id === 16062) {
      p.ageMin = 10;
      p.ageMax = 12;
      p.cost = 399;
      p.costNote = '$399/child. Ages 10-12: Mon-Wed at Cates Park, Thu-Fri at Mt Seymour. Paddleboarding, kayaking, outdoor skills. Partnership with Mt Seymour.';
      p.description = 'Sea to Sky Camp for ages 10-12. Mon-Wed at Whey-ah-Wichen/Cates Park (ocean days), Thu-Fri at Mt Seymour (mountain days). Explore North Shore ocean and mountain environments.';
      p.activityType = 'Outdoor Adventure';
      p.category = 'Nature';
      p.tags = ['outdoor adventure', 'paddleboarding', 'kayaking', 'nature', 'ocean'];
    }
    if (id === 16063) {
      p.ageMin = 13;
      p.ageMax = 15;
      p.cost = 439;
      p.startDate = '2026-06-29';
      p.endDate = '2026-07-02';
      p.costNote = '$439/person. 4-day camp: Day 1 at Cates Park, Days 2-4 paddle camping trip to Twin Islands/Say Nuth Khaw Yum Park. Max 12 participants. For girls, genderfluid/non-binary, and trans youth. Email admin@oceanambassadorscanada.org or call 604-312-6023.';
      p.description = 'Leadership Camp for Young Women at Ocean Ambassadors. Ages 13-15. 4-day program: Day 1 at Whey-ah-Wichen/Cates Park, Days 2-4 paddle camping to Twin Islands. Build leadership and communication skills while promoting ocean health education. Max 12 participants.';
      p.activityType = 'Leadership';
      p.category = 'Nature';
      p.tags = ['leadership', 'paddling', 'camping', 'ocean', 'women'];
      p.registrationUrl = 'https://oceanambassadorscanada.org/programs/summer-camps/';
    }

    corrected++;
  }
}

fs.writeFileSync(PROGRAMS_PATH, JSON.stringify(programs, null, 2) + '\n');
console.log(`Batch audit 245-248: ${corrected} corrected, 0 added`);
console.log(`Total programs: ${programs.length}`);
