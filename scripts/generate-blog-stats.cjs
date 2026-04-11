#!/usr/bin/env node
/**
 * generate-blog-stats.cjs
 *
 * Generates blog-stats.json from programs.json for data-driven blog content.
 * Run: node scripts/generate-blog-stats.cjs
 */

const fs = require("fs");
const path = require("path");

const PROGRAMS_PATH = path.join(__dirname, "../src/data/programs.json");
const OUTPUT_PATH = path.join(__dirname, "../src/data/blog-stats.json");

function run() {
  const data = JSON.parse(fs.readFileSync(PROGRAMS_PATH, "utf8"));

  const stats = {};

  // Total & providers
  stats.totalPrograms = data.length;
  stats.totalProviders = new Set(data.map((p) => p.provider).filter(Boolean)).size;

  // Free programs
  stats.freePrograms = data.filter((p) => p.cost === 0 || p.cost === "0").length;

  // Low cost (under $200)
  stats.lowCostPrograms = data.filter(
    (p) => p.cost != null && Number(p.cost) > 0 && Number(p.cost) <= 200
  ).length;

  // Cost stats
  const costs = data
    .filter((p) => p.cost != null && !isNaN(Number(p.cost)) && Number(p.cost) > 0)
    .map((p) => Number(p.cost));
  costs.sort((a, b) => a - b);
  stats.medianCost = costs[Math.floor(costs.length / 2)];
  stats.avgCost = Math.round(costs.reduce((a, b) => a + b, 0) / costs.length);
  stats.maxCost = Math.max(...costs);

  // Programs by area
  const areas = {};
  data.forEach((p) => {
    const a = p.city || "Unknown";
    if (a !== "Unknown") areas[a] = (areas[a] || 0) + 1;
  });
  stats.programsByArea = Object.entries(areas)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  // Top categories
  const cats = {};
  data.forEach((p) => {
    const c = p.category || "Other";
    cats[c] = (cats[c] || 0) + 1;
  });
  stats.topCategories = Object.entries(cats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // Top providers
  const provs = {};
  data.forEach((p) => {
    if (p.provider) provs[p.provider] = (provs[p.provider] || 0) + 1;
  });
  stats.topProviders = Object.entries(provs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([name, count]) => ({ name, count }));

  // Age breakdown
  stats.preschoolPrograms = data.filter((p) => p.ageMin != null && p.ageMin <= 5).length;
  stats.schoolAgePrograms = data.filter(
    (p) => p.ageMin != null && p.ageMin >= 6 && p.ageMin <= 12
  ).length;
  stats.teenPrograms = data.filter((p) => p.ageMin != null && p.ageMin >= 13).length;

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(stats, null, 2) + "\n");
  console.log(`✅ Generated blog-stats.json`);
  console.log(`   Programs: ${stats.totalPrograms}`);
  console.log(`   Providers: ${stats.totalProviders}`);
  console.log(`   Median cost: $${stats.medianCost}`);
  console.log(`   Free programs: ${stats.freePrograms}`);
}

run();
