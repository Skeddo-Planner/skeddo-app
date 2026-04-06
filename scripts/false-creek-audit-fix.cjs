#!/usr/bin/env node
// false-creek-audit-fix.cjs
// Fixes two classes of issues for City of Vancouver - False Creek Community Centre:
// 1. fccc-* registrationUrls used display IDs instead of URL IDs (display - 2922)
//    This caused parents to land on completely wrong program pages.
// 2. Birthday party / venue rental entries that should not be in the DB.

'use strict';
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

let urlFixed = 0;
let birthdayRemoved = 0;

// IDs of birthday party / venue rental entries to remove
const BIRTHDAY_IDS = new Set([
  'COV-593046', 'COV-593057',
  'COV-616677', 'COV-616678', 'COV-616679', 'COV-616680',
  'COV-616681', 'COV-616682', 'COV-616683', 'COV-616684',
  'COV-616685', 'COV-616686', 'COV-616687', 'COV-616688',
]);

const fixed = programs.filter(p => {
  // Remove birthday parties
  if (BIRTHDAY_IDS.has(String(p.id))) {
    console.log('  REMOVE birthday party:', p.id, p.name);
    birthdayRemoved++;
    return false;
  }
  return true;
}).map(p => {
  // Fix fccc-* registrationUrls: display ID → URL ID (display - 2922)
  if (typeof p.id === 'string' && p.id.startsWith('fccc-') && p.registrationUrl) {
    const match = p.registrationUrl.match(/\/detail\/(\d+)\?/);
    if (match) {
      const displayId = parseInt(match[1]);
      // Check if this is a display ID (if it's large enough to be one)
      // URL IDs are typically 600000+, display IDs are display = urlId + 2922
      // We can tell it's a display ID if it has the activity_select_param=2 suffix
      if (p.registrationUrl.includes('activity_select_param=2')) {
        const urlId = displayId - 2922;
        const newUrl = `https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/${urlId}?onlineSiteId=0&from_original_cui=true`;
        console.log(`  FIX URL: ${p.id} | display=${displayId} → urlId=${urlId}`);
        urlFixed++;
        return { ...p, registrationUrl: newUrl };
      }
    }
  }
  return p;
});

fs.writeFileSync(DATA_FILE, JSON.stringify(fixed, null, 2));

console.log('\nSummary:');
console.log(`  Birthday party entries removed: ${birthdayRemoved}`);
console.log(`  fccc-* URL IDs fixed: ${urlFixed}`);
console.log(`  Programs remaining: ${fixed.length}`);
