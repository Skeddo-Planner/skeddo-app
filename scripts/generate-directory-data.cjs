#!/usr/bin/env node
/**
 * generate-directory-data.cjs
 *
 * Generates lightweight public directory data from programs.json
 * for the SEO-friendly public browse pages.
 *
 * Output: src/data/directory-index.json
 *
 * Run: node scripts/generate-directory-data.cjs
 * Should be run before builds (add to package.json build script).
 */

const fs = require("fs");
const path = require("path");

const PROGRAMS_PATH = path.join(__dirname, "../src/data/programs.json");
const OUTPUT_PATH = path.join(__dirname, "../src/data/directory-index.json");

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function run() {
  const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, "utf8"));

  // --- Aggregate by provider ---
  const providerMap = {};
  const categoryMap = {};
  const areaMap = {};

  for (const p of programs) {
    const prov = p.provider || "Unknown";
    const cat = p.category || "Other";
    const city = p.city || "Unknown";

    // Provider aggregation
    if (!providerMap[prov]) {
      providerMap[prov] = {
        name: prov,
        slug: slugify(prov),
        programCount: 0,
        categories: new Set(),
        cities: new Set(),
        neighbourhoods: new Set(),
        ageMin: Infinity,
        ageMax: -Infinity,
        costMin: Infinity,
        costMax: -Infinity,
        samplePrograms: [],
      };
    }
    const pm = providerMap[prov];
    pm.programCount++;
    pm.categories.add(cat);
    if (city !== "Unknown") pm.cities.add(city);
    if (p.neighbourhood) pm.neighbourhoods.add(p.neighbourhood);
    if (p.ageMin != null && p.ageMin < pm.ageMin) pm.ageMin = p.ageMin;
    if (p.ageMax != null && p.ageMax > pm.ageMax) pm.ageMax = p.ageMax;
    if (p.cost != null && p.cost > 0) {
      if (p.cost < pm.costMin) pm.costMin = p.cost;
      if (p.cost > pm.costMax) pm.costMax = p.cost;
    }
    // Keep up to 6 sample programs (with key display fields only)
    if (pm.samplePrograms.length < 6) {
      pm.samplePrograms.push({
        name: p.name,
        category: cat,
        activityType: p.activityType || "",
        ageMin: p.ageMin,
        ageMax: p.ageMax,
        cost: p.cost,
        costNote: p.costNote || "",
        startDate: p.startDate,
        endDate: p.endDate,
        startTime: p.startTime,
        endTime: p.endTime,
        days: p.days,
        neighbourhood: p.neighbourhood || "",
        city: city,
        dayLength: p.dayLength || "",
        enrollmentStatus: p.enrollmentStatus || "",
      });
    }

    // Category aggregation
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        name: cat,
        slug: slugify(cat),
        programCount: 0,
        providers: new Set(),
        cities: new Set(),
        ageMin: Infinity,
        ageMax: -Infinity,
        costMin: Infinity,
        costMax: -Infinity,
        activityTypes: new Set(),
        samplePrograms: [],
      };
    }
    const cm = categoryMap[cat];
    cm.programCount++;
    cm.providers.add(prov);
    if (city !== "Unknown") cm.cities.add(city);
    if (p.activityType) cm.activityTypes.add(p.activityType);
    if (p.ageMin != null && p.ageMin < cm.ageMin) cm.ageMin = p.ageMin;
    if (p.ageMax != null && p.ageMax > cm.ageMax) cm.ageMax = p.ageMax;
    if (p.cost != null && p.cost > 0) {
      if (p.cost < cm.costMin) cm.costMin = p.cost;
      if (p.cost > cm.costMax) cm.costMax = p.cost;
    }
    if (cm.samplePrograms.length < 8) {
      cm.samplePrograms.push({
        name: p.name,
        provider: prov,
        activityType: p.activityType || "",
        ageMin: p.ageMin,
        ageMax: p.ageMax,
        cost: p.cost,
        neighbourhood: p.neighbourhood || "",
        city: city,
        dayLength: p.dayLength || "",
      });
    }

    // Area (city) aggregation
    if (city !== "Unknown") {
      if (!areaMap[city]) {
        areaMap[city] = {
          name: city,
          slug: slugify(city),
          programCount: 0,
          providers: new Set(),
          categories: new Set(),
          neighbourhoods: new Set(),
          costMin: Infinity,
          costMax: -Infinity,
          samplePrograms: [],
        };
      }
      const am = areaMap[city];
      am.programCount++;
      am.providers.add(prov);
      am.categories.add(cat);
      if (p.neighbourhood) am.neighbourhoods.add(p.neighbourhood);
      if (p.cost != null && p.cost > 0) {
        if (p.cost < am.costMin) am.costMin = p.cost;
        if (p.cost > am.costMax) am.costMax = p.cost;
      }
      if (am.samplePrograms.length < 8) {
        am.samplePrograms.push({
          name: p.name,
          provider: prov,
          category: cat,
          activityType: p.activityType || "",
          ageMin: p.ageMin,
          ageMax: p.ageMax,
          cost: p.cost,
          dayLength: p.dayLength || "",
          neighbourhood: p.neighbourhood || "",
        });
      }
    }
  }

  // Convert sets to arrays and fix infinities
  const fixRange = (v) => (v === Infinity || v === -Infinity ? null : v);

  const providers = Object.values(providerMap)
    .map((p) => ({
      ...p,
      categories: [...p.categories],
      cities: [...p.cities],
      neighbourhoods: [...p.neighbourhoods],
      ageMin: fixRange(p.ageMin),
      ageMax: fixRange(p.ageMax),
      costMin: fixRange(p.costMin),
      costMax: fixRange(p.costMax),
    }))
    .sort((a, b) => b.programCount - a.programCount);

  const categories = Object.values(categoryMap)
    .map((c) => ({
      ...c,
      providers: [...c.providers],
      cities: [...c.cities],
      activityTypes: [...c.activityTypes],
      ageMin: fixRange(c.ageMin),
      ageMax: fixRange(c.ageMax),
      costMin: fixRange(c.costMin),
      costMax: fixRange(c.costMax),
    }))
    .sort((a, b) => b.programCount - a.programCount);

  const areas = Object.values(areaMap)
    .map((a) => ({
      ...a,
      providers: [...a.providers],
      categories: [...a.categories],
      neighbourhoods: [...a.neighbourhoods],
      costMin: fixRange(a.costMin),
      costMax: fixRange(a.costMax),
    }))
    .sort((a, b) => b.programCount - a.programCount);

  const output = {
    totalPrograms: programs.length,
    totalProviders: providers.length,
    totalCategories: categories.length,
    totalAreas: areas.length,
    lastUpdated: new Date().toISOString().split("T")[0],
    providers,
    categories,
    areas,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  const sizeKB = (fs.statSync(OUTPUT_PATH).size / 1024).toFixed(0);
  console.log(`✅ Generated directory-index.json (${sizeKB} KB)`);
  console.log(`   ${providers.length} providers, ${categories.length} categories, ${areas.length} areas`);
  console.log(`   ${programs.length} total programs`);
}

run();
