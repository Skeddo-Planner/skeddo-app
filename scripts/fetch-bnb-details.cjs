#!/usr/bin/env node
/**
 * Fetch detailed info for all Burnaby (BNB) ActiveNet programs.
 * Uses slug 'burnaby' (not 'cityofburnaby').
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

const HOST = "anc.ca.apm.activecommunities.com";
const SLUG = "burnaby";

function fetchDetail(activityId) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: HOST, port: 443,
      path: `/${SLUG}/rest/activity/detail/${activityId}?locale=en-US`,
      method: "GET",
      headers: { "Accept": "application/json" },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
    });
    req.on("error", () => resolve(null));
    req.setTimeout(15000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

function fetchPrice(activityId) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: HOST, port: 443,
      path: `/${SLUG}/rest/activity/detail/estimateprice/${activityId}?locale=en-US`,
      method: "GET",
      headers: { "Accept": "application/json" },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          const ep = json.body?.estimateprice;
          if (ep?.show_price_info_online && ep?.estimate_price) {
            const match = ep.estimate_price.match(/\$([\d,.]+)/);
            if (match) resolve(parseFloat(match[1].replace(",", "")));
            else resolve(null);
          } else resolve(null);
        } catch { resolve(null); }
      });
    });
    req.on("error", () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#\d+;/g, "").replace(/\s+/g, " ").trim();
}

async function main() {
  const programsPath = path.join(__dirname, "..", "src", "data", "programs.json");
  const programs = JSON.parse(fs.readFileSync(programsPath, "utf-8"));

  const bnb = [];
  for (let i = 0; i < programs.length; i++) {
    if (String(programs[i].id).startsWith("BNB-")) {
      const activityId = String(programs[i].id).split("-")[1];
      const needsDesc = !programs[i].description;
      const needsCost = programs[i].cost === undefined || programs[i].cost === null;
      const needsAge = !programs[i].ageMax;
      if (needsDesc || needsCost || needsAge) {
        bnb.push({ index: i, activityId, needsDesc, needsCost, needsAge });
      }
    }
  }

  console.log(`Found ${bnb.length} BNB programs needing updates`);
  let descriptions = 0, prices = 0, ages = 0;
  const BATCH = 5;

  for (let i = 0; i < bnb.length; i += BATCH) {
    const batch = bnb.slice(i, i + BATCH);
    await Promise.all(batch.map(async (item) => {
      const prog = programs[item.index];

      if (item.needsDesc || item.needsAge) {
        const result = await fetchDetail(item.activityId);
        const detail = result?.body?.detail;
        if (detail) {
          if (item.needsDesc) {
            const desc = stripHtml(detail.catalog_description || detail.online_notes || "");
            if (desc && desc.length > 10) { prog.description = desc.substring(0, 500); descriptions++; }
          }
          if (item.needsAge && detail.age_max_year > 0) {
            prog.ageMax = detail.age_max_year;
            ages++;
          }
          if (!prog.ageMin && detail.age_min_year !== undefined) {
            prog.ageMin = detail.age_min_year;
          }
          if (!prog.startDate && detail.first_date) prog.startDate = detail.first_date;
          if (!prog.endDate && detail.last_date) prog.endDate = detail.last_date;
        }
      }

      if (item.needsCost) {
        const price = await fetchPrice(item.activityId);
        if (price !== null && !isNaN(price)) {
          prog.cost = price;
          prog.priceVerified = true;
          prices++;
        }
      }
    }));

    if ((i + BATCH) % 100 < BATCH) {
      console.log(`Progress: ${Math.min(i + BATCH, bnb.length)}/${bnb.length} — Desc: ${descriptions}, Prices: ${prices}, Ages: ${ages}`);
    }
    await new Promise(r => setTimeout(r, 250));
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Descriptions: ${descriptions}, Prices: ${prices}, Ages: ${ages}`);

  fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2));
  console.log("Updated programs.json");
}

main().catch(console.error);
