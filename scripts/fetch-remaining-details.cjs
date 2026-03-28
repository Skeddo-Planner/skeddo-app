#!/usr/bin/env node
/**
 * Fetch details for WV (westvanrec), remaining COV prices, and PC/LGY gaps.
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

const HOST = "anc.ca.apm.activecommunities.com";

// Corrected slugs
const SLUG_MAP = {
  COV: "vancouver",
  BNB: "burnaby",
  WV: "westvanrec",
  PC: "cityofportcoquitlam",
  LGY: "langleycityrecconnect",
};

function fetchDetail(slug, activityId) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: HOST, port: 443,
      path: `/${slug}/rest/activity/detail/${activityId}?locale=en-US`,
      method: "GET", headers: { "Accept": "application/json" },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch { resolve(null); } });
    });
    req.on("error", () => resolve(null));
    req.setTimeout(15000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

function fetchPrice(slug, activityId) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: HOST, port: 443,
      path: `/${slug}/rest/activity/detail/estimateprice/${activityId}?locale=en-US`,
      method: "GET", headers: { "Accept": "application/json" },
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

  const needsWork = [];
  for (let i = 0; i < programs.length; i++) {
    const p = programs[i];
    const prefix = String(p.id).split("-")[0];
    if (!SLUG_MAP[prefix]) continue;
    // Skip BNB (already done with correct slug)
    if (prefix === "BNB") continue;

    const activityId = String(p.id).split("-").slice(1).join("-");
    const needsDesc = !p.description;
    const needsCost = p.cost === undefined || p.cost === null;
    const needsAge = !p.ageMax;
    const needsDates = !p.startDate || !p.endDate;

    if (needsDesc || needsCost || needsAge || needsDates) {
      needsWork.push({ index: i, prefix, slug: SLUG_MAP[prefix], activityId, needsDesc, needsCost, needsAge, needsDates });
    }
  }

  console.log(`Found ${needsWork.length} programs needing updates`);
  const byPrefix = {};
  needsWork.forEach(x => { byPrefix[x.prefix] = (byPrefix[x.prefix] || 0) + 1; });
  console.log("By prefix:", byPrefix);

  let descriptions = 0, prices = 0, ages = 0, dates = 0;
  const BATCH = 5;

  for (let i = 0; i < needsWork.length; i += BATCH) {
    const batch = needsWork.slice(i, i + BATCH);
    await Promise.all(batch.map(async (item) => {
      const prog = programs[item.index];

      if (item.needsDesc || item.needsAge || item.needsDates) {
        const result = await fetchDetail(item.slug, item.activityId);
        const detail = result?.body?.detail;
        if (detail) {
          if (item.needsDesc) {
            const desc = stripHtml(detail.catalog_description || detail.online_notes || "");
            if (desc && desc.length > 10) { prog.description = desc.substring(0, 500); descriptions++; }
          }
          if (item.needsAge && detail.age_max_year > 0) { prog.ageMax = detail.age_max_year; ages++; }
          if (!prog.ageMin && detail.age_min_year !== undefined && detail.age_min_year !== null) { prog.ageMin = detail.age_min_year; }
          if (!prog.startDate && detail.first_date) { prog.startDate = detail.first_date; dates++; }
          if (!prog.endDate && detail.last_date) { prog.endDate = detail.last_date; dates++; }
        }
      }

      if (item.needsCost) {
        const price = await fetchPrice(item.slug, item.activityId);
        if (price !== null && !isNaN(price)) {
          prog.cost = price;
          prog.priceVerified = true;
          prices++;
        }
      }
    }));

    if ((i + BATCH) % 100 < BATCH) {
      console.log(`Progress: ${Math.min(i + BATCH, needsWork.length)}/${needsWork.length} — Desc: ${descriptions}, Prices: ${prices}, Ages: ${ages}, Dates: ${dates}`);
    }
    await new Promise(r => setTimeout(r, 250));
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Descriptions: ${descriptions}, Prices: ${prices}, Ages: ${ages}, Dates: ${dates}`);

  fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2));
  console.log("Updated programs.json");
}

main().catch(console.error);
