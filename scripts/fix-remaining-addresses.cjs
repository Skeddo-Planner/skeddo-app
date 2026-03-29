#!/usr/bin/env node
/**
 * Fix remaining R11 violations — vague addresses
 */
const fs = require("fs");
const path = require("path");

const programsPath = path.join(__dirname, "..", "src", "data", "programs.json");
const programs = JSON.parse(fs.readFileSync(programsPath, "utf8"));

let fixes = 0;

const FIXES = {
  "uphoria-yoga-1": "88 East Broadway, Vancouver, BC V5T 1V6",
  "surrey-german-1": "10441 132 St, Surrey, BC V3T 3V3",
  "squamish-arts-1": "37950 Cleveland Ave, Squamish, BC",
  "hindu-heritage-1": "3885 Albert St, Burnaby, BC V5C 2C9", // Hindu Heritage Centre at Hindu Mandir
};

// Legacy Sport Club Whistler — all w1-w9 + rmow-sunsations
const WHISTLER_IDS = [
  "legacy-whistler-w1", "legacy-whistler-w2", "legacy-whistler-w3",
  "legacy-whistler-w4", "legacy-whistler-w5", "legacy-whistler-w6",
  "legacy-whistler-w7", "legacy-whistler-w8", "legacy-whistler-w9",
];
WHISTLER_IDS.forEach(id => {
  FIXES[id] = "1080 Legacy Way, Whistler, BC V8E 0K3";
});
FIXES["rmow-sunsations"] = "8107 Camino Dr, Whistler, BC V8E 0C4"; // Meadow Park Sports Centre

// Mountain Skills Academy — Squamish programs (IDs 447-452)
for (let i = 447; i <= 452; i++) {
  FIXES[String(i)] = "38922 Progress Way, Squamish, BC V8B 0K5";
}

// Soaring Eagle Nature School — outdoor locations
FIXES["1389"] = "Minnekhada Regional Park, Coquitlam, BC";
FIXES["1390"] = "Watershed Park, 11401 Watershed Rd, Delta, BC";

programs.forEach(p => {
  const id = String(p.id);
  if (FIXES[id]) {
    p.address = FIXES[id];
    fixes++;
  }
});

fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2));
console.log(`Fixed ${fixes} addresses. programs.json saved.`);
