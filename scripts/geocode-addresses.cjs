#!/usr/bin/env node
/**
 * Geocode all unique addresses in programs.json using Nominatim (OpenStreetMap).
 * Rate limited to 1 request per second as per Nominatim usage policy.
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

function geocode(address) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(address + ", Canada");
    const req = https.request({
      hostname: "nominatim.openstreetmap.org",
      port: 443,
      path: `/search?format=json&q=${query}&limit=1`,
      method: "GET",
      headers: {
        "User-Agent": "Skeddo/1.0 (skeddo.ca)",
        "Accept": "application/json",
      },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          const results = JSON.parse(data);
          if (results.length > 0) {
            resolve({
              lat: parseFloat(results[0].lat),
              lng: parseFloat(results[0].lon),
            });
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

async function main() {
  const programsPath = path.join(__dirname, "..", "src", "data", "programs.json");
  const programs = JSON.parse(fs.readFileSync(programsPath, "utf-8"));

  // Build unique addresses
  const addressMap = new Map();
  for (let i = 0; i < programs.length; i++) {
    const p = programs[i];
    if (p.address && !p.lat && p.address !== "TBD" && !p.address.startsWith("Multiple") && !p.address.startsWith("Online")) {
      if (!addressMap.has(p.address)) {
        addressMap.set(p.address, []);
      }
      addressMap.get(p.address).push(i);
    }
  }

  const addresses = [...addressMap.entries()];
  console.log(`Geocoding ${addresses.length} unique addresses...`);

  let found = 0;
  let notFound = 0;
  let programsUpdated = 0;

  for (let i = 0; i < addresses.length; i++) {
    const [addr, indices] = addresses[i];
    const result = await geocode(addr);

    if (result) {
      found++;
      for (const idx of indices) {
        programs[idx].lat = result.lat;
        programs[idx].lng = result.lng;
        programsUpdated++;
      }
    } else {
      notFound++;
      if (notFound <= 20) console.log(`  Not found: "${addr}"`);
    }

    if ((i + 1) % 50 === 0) {
      console.log(`Progress: ${i + 1}/${addresses.length} — Found: ${found}, Not found: ${notFound}, Programs updated: ${programsUpdated}`);
    }

    // Nominatim requires 1 request per second
    await new Promise(r => setTimeout(r, 1100));
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Addresses geocoded: ${found}/${addresses.length}`);
  console.log(`Programs updated: ${programsUpdated}`);
  console.log(`Not found: ${notFound}`);

  fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2));
  console.log("Updated programs.json");
}

main().catch(console.error);
