#!/usr/bin/env node
// sd44-audit-fix.cjs
// Fixes SD44 Summer Learning data (rank 145 audit, 2026-04-06)
//
// Source: https://www.sd44.ca/school/summer/ProgramsServices/Pages/Courses.aspx
// All 7 programs confirmed for 2026 with published dates/times.
//
// Changes:
// 1. SD44-0001 (Full Credit): status Full/Waitlist → Coming Soon (reg not yet open)
//    registrationDate = 2026-05-01 (SD44 students), note May 19 for all districts
//    dates: Jul 2-31, 8:30 AM-12:30 PM, Argyle Secondary
// 2. SD44-0002 (Grade 7/8 Transition): Likely Coming Soon → Coming Soon
//    dates: Jul 6-22, 8:30 AM-12:00 PM
// 3. SD44-0003 (Literacy 8/9): same as 7/8 Transition
// 4. SD44-0004 (Numeracy 8/9): same as 7/8 Transition
// 5. SD44-0005 (ELL 8-11): same as 7/8 Transition
// 6. SD44-0006 (Eslha7an): Jul 6-17, 9:00 AM-1:00 PM
// 7. SD44-0007 (Elementary Summer Learning): Jul 6-21, 8:40 AM-12:15 PM, Queen Mary Elementary

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const pid_map = new Map(programs.map(p => [String(p.id), p]));

let fixes = 0;

function fix(id, field, value) {
  const p = pid_map.get(String(id));
  if (!p) { console.warn(`SKIP (not found): ${id}`); return; }
  p[field] = value;
  fixes++;
}

// ── SD44-0001: Full Credit Courses (Grades 10-12) ──────────────────────────
// Was: Full/Waitlist (stale from prior audit)
// Now: Coming Soon — registration opens May 1 for SD44, May 19 for all
fix('SD44-0001', 'enrollmentStatus', 'Coming Soon');
fix('SD44-0001', 'registrationDate', '2026-05-01');
fix('SD44-0001', 'registrationDateLabel', 'May 1 (SD44 students) / May 19 (all districts) at 9:00 AM');
fix('SD44-0001', 'startDate', '2026-07-02');
fix('SD44-0001', 'endDate', '2026-07-31');
fix('SD44-0001', 'startTime', '8:30 AM');
fix('SD44-0001', 'endTime', '12:30 PM');
fix('SD44-0001', 'days', 'Mon, Tue, Wed, Thu, Fri');
fix('SD44-0001', 'address', '1131 Frederick Rd, North Vancouver, BC');
fix('SD44-0001', 'confirmed2026', true);

// ── SD44-0002: Grade 7/8 Transition Courses ────────────────────────────────
fix('SD44-0002', 'enrollmentStatus', 'Coming Soon');
fix('SD44-0002', 'registrationDate', '2026-05-01');
fix('SD44-0002', 'registrationDateLabel', 'May 1 (SD44 students) / May 19 (all districts) at 9:00 AM');
fix('SD44-0002', 'startDate', '2026-07-06');
fix('SD44-0002', 'endDate', '2026-07-22');
fix('SD44-0002', 'startTime', '8:30 AM');
fix('SD44-0002', 'endTime', '12:00 PM');
fix('SD44-0002', 'days', 'Mon, Tue, Wed, Thu, Fri');
fix('SD44-0002', 'confirmed2026', true);

// ── SD44-0003: Literacy 8/9 ────────────────────────────────────────────────
fix('SD44-0003', 'enrollmentStatus', 'Coming Soon');
fix('SD44-0003', 'registrationDate', '2026-05-01');
fix('SD44-0003', 'registrationDateLabel', 'May 1 (SD44 students) / May 19 (all districts) at 9:00 AM');
fix('SD44-0003', 'startDate', '2026-07-06');
fix('SD44-0003', 'endDate', '2026-07-22');
fix('SD44-0003', 'startTime', '8:30 AM');
fix('SD44-0003', 'endTime', '12:00 PM');
fix('SD44-0003', 'days', 'Mon, Tue, Wed, Thu, Fri');
fix('SD44-0003', 'confirmed2026', true);

// ── SD44-0004: Numeracy 8/9 ────────────────────────────────────────────────
fix('SD44-0004', 'enrollmentStatus', 'Coming Soon');
fix('SD44-0004', 'registrationDate', '2026-05-01');
fix('SD44-0004', 'registrationDateLabel', 'May 1 (SD44 students) / May 19 (all districts) at 9:00 AM');
fix('SD44-0004', 'startDate', '2026-07-06');
fix('SD44-0004', 'endDate', '2026-07-22');
fix('SD44-0004', 'startTime', '8:30 AM');
fix('SD44-0004', 'endTime', '12:00 PM');
fix('SD44-0004', 'days', 'Mon, Tue, Wed, Thu, Fri');
fix('SD44-0004', 'confirmed2026', true);

// ── SD44-0005: English Language Learning (ELL) 8-11 ───────────────────────
fix('SD44-0005', 'enrollmentStatus', 'Coming Soon');
fix('SD44-0005', 'registrationDate', '2026-05-01');
fix('SD44-0005', 'registrationDateLabel', 'May 1 (SD44 students) / May 19 (all districts) at 9:00 AM');
fix('SD44-0005', 'startDate', '2026-07-06');
fix('SD44-0005', 'endDate', '2026-07-22');
fix('SD44-0005', 'startTime', '8:30 AM');
fix('SD44-0005', 'endTime', '12:00 PM');
fix('SD44-0005', 'days', 'Mon, Tue, Wed, Thu, Fri');
fix('SD44-0005', 'confirmed2026', true);

// ── SD44-0006: Eslha7an — Indigenous Student Academic Support ──────────────
fix('SD44-0006', 'enrollmentStatus', 'Coming Soon');
fix('SD44-0006', 'registrationDate', '2026-05-01');
fix('SD44-0006', 'registrationDateLabel', 'May 1 (SD44 students) / May 19 (all districts) at 9:00 AM');
fix('SD44-0006', 'startDate', '2026-07-06');
fix('SD44-0006', 'endDate', '2026-07-17');
fix('SD44-0006', 'startTime', '9:00 AM');
fix('SD44-0006', 'endTime', '1:00 PM');
fix('SD44-0006', 'days', 'Mon, Tue, Wed, Thu, Fri');
fix('SD44-0006', 'confirmed2026', true);

// ── SD44-0007: Elementary Summer Learning (Grades 4-7) ────────────────────
fix('SD44-0007', 'enrollmentStatus', 'Coming Soon');
fix('SD44-0007', 'registrationDate', '2026-05-01');
fix('SD44-0007', 'registrationDateLabel', 'May 1 (SD44 students) / May 19 (all districts) at 9:00 AM');
fix('SD44-0007', 'startDate', '2026-07-06');
fix('SD44-0007', 'endDate', '2026-07-21');
fix('SD44-0007', 'startTime', '8:40 AM');
fix('SD44-0007', 'endTime', '12:15 PM');
fix('SD44-0007', 'days', 'Mon, Tue, Wed, Thu, Fri');
fix('SD44-0007', 'address', 'Queen Mary Elementary School, North Vancouver, BC');
fix('SD44-0007', 'confirmed2026', true);

fs.writeFileSync(DATA_PATH, JSON.stringify(programs, null, 2));
console.log(`Done. Fields fixed: ${fixes}. Programs: ${programs.length}`);
