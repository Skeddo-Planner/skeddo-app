#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let fixCount = 0;

// ── 1. STATUS FIXES ────────────────────────────────────────────────────────
// 47 numeric IDs + hillcrest-cc-1: registrationDate=2026-04-08 → Coming Soon
const numericToFix = [
  1524,1525,1526,1527,1528,1529,1530,1531,1532,1533,
  1534,1535,1536,1537,1538,1539,1540,1541,1544,1545,
  1546,1547,1552,1553,1554,1555,1556,1557,1558,1559,
  1560,1561,1562,1563,1564,1565,1566,1567,1568,1569,
  1570,1571,1572,1573,1574,1575,2503,
];
const stringToFix = ['hillcrest-cc-1'];

const toFixSet = new Set([...numericToFix.map(String), ...stringToFix]);

for (const prog of programs) {
  if (toFixSet.has(String(prog.id))) {
    if (prog.enrollmentStatus !== 'Coming Soon') {
      const old = prog.enrollmentStatus;
      prog.enrollmentStatus = 'Coming Soon';
      fixCount++;
      console.log(`Fixed: ${prog.id} (${prog.name}) → Coming Soon (was ${old})`);
    }
  }
}

fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nDone. Fixed: ${fixCount}, Total: ${programs.length}`);
