#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'programs.json');
const programs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const patches = {
  'COV-608521': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608521',
    season: 'Spring',
    activityType: 'Dance',
    neighbourhood: 'Champlain Heights',
  },
  'COV-609576': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/609576',
    season: 'Spring',
    activityType: 'Open Gym',
    ageSpanJustified: 'Family adapted program — open to all ages 5+, no distinct age-band segments offered',
  },
  'COV-610736': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/610736',
    season: 'Summer',
    activityType: 'Open Gym',
    ageSpanJustified: 'Family adapted program — open to all ages 5+, no distinct age-band segments offered',
  },
  'COV-608866': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608866',
    season: 'Spring',
    activityType: 'Nature Program',
  },
  'COV-608867': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608867',
    season: 'Spring',
    activityType: 'Nature Program',
  },
  'COV-608868': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608868',
    season: 'Spring',
    activityType: 'Nature Program',
  },
  'COV-608869': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608869',
    season: 'Spring',
    activityType: 'Nature Program',
  },
  'COV-608858': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608858',
    season: 'Spring',
    activityType: 'Nature Program',
    ageMin: 4,
    // R34 fix: provider says "all ages" — use ageMin=4 (suitable for young children with parent supervision)
    // ageSpanJustified already set
  },
  'COV-608859': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608859',
    season: 'Spring',
    activityType: 'Nature Program',
    ageMin: 4,
  },
  'COV-608861': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608861',
    season: 'Summer',
    activityType: 'Nature Program',
    ageMin: 4,
  },
  'COV-608852': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608852',
    season: 'Spring',
    activityType: 'Nature Program',
    ageSpanJustified: 'Amphibian survey program for ages 10+ — single listing, no age-band segments',
  },
  'COV-608854': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608854',
    season: 'Spring',
    activityType: 'Nature Program',
    ageSpanJustified: 'Amphibian survey program for ages 10+ — single listing, no age-band segments',
  },
  'COV-608855': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608855',
    season: 'Spring',
    activityType: 'Nature Program',
    ageSpanJustified: 'Amphibian survey program for ages 10+ — single listing, no age-band segments',
  },
  'COV-608856': {
    registrationUrl: 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search/detail/608856',
    season: 'Spring',
    activityType: 'Nature Program',
    ageSpanJustified: 'Amphibian survey program for ages 10+ — single listing, no age-band segments',
  },
};

let patchCount = 0;
for (const prog of programs) {
  const patch = patches[String(prog.id)];
  if (patch) {
    Object.assign(prog, patch);
    patchCount++;
    console.log(`Patched: ${prog.id}`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(programs, null, 2) + '\n');
console.log(`\nPatched ${patchCount} programs.`);
