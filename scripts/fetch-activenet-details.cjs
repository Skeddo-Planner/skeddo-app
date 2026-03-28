#!/usr/bin/env node
/**
 * Fetch detailed info for all ActiveNet programs from the detail API.
 * Fills: ages, descriptions, dates, and prices (where available).
 * Updates programs.json directly.
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

const HOST = "anc.ca.apm.activecommunities.com";

const SLUG_MAP = {
  COV: "vancouver",
  BNB: "cityofburnaby",
  WV: "westvancouver",
  PC: "cityofportcoquitlam",
  LGY: "langleycityrecconnect",
};

function fetchDetail(slug, activityId) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: HOST, port: 443,
      path: `/${slug}/rest/activity/detail/${activityId}?locale=en-US`,
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

function fetchPrice(slug, activityId) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: HOST, port: 443,
      path: `/${slug}/rest/activity/detail/estimateprice/${activityId}?locale=en-US`,
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
          } else {
            resolve(null);
          }
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

  // Find all ActiveNet programs that need ANY field filled
  const needsWork = [];
  for (let i = 0; i < programs.length; i++) {
    const p = programs[i];
    const prefix = String(p.id).split("-")[0];
    if (!SLUG_MAP[prefix]) continue;

    const activityId = String(p.id).split("-").slice(1).join("-");
    const hasMissing = !p.description || !p.ageMin || !p.ageMax || !p.cost && p.cost !== 0;

    if (hasMissing) {
      needsWork.push({ index: i, id: p.id, prefix, slug: SLUG_MAP[prefix], activityId });
    }
  }

  console.log(`Found ${needsWork.length} ActiveNet programs needing field updates`);

  let detailsFound = 0;
  let pricesFound = 0;
  let agesFixed = 0;
  let descriptionsFixed = 0;
  const BATCH_SIZE = 5;

  for (let i = 0; i < needsWork.length; i += BATCH_SIZE) {
    const batch = needsWork.slice(i, i + BATCH_SIZE);

    await Promise.all(batch.map(async (item) => {
      const prog = programs[item.index];

      // Fetch detail
      const result = await fetchDetail(item.slug, item.activityId);
      const detail = result?.body?.detail;

      if (detail) {
        detailsFound++;

        // Fill ages
        if (!prog.ageMin && detail.age_min_year !== undefined && detail.age_min_year !== null) {
          prog.ageMin = detail.age_min_year;
          agesFixed++;
        }
        if (!prog.ageMax && detail.age_max_year !== undefined && detail.age_max_year !== null && detail.age_max_year > 0) {
          prog.ageMax = detail.age_max_year;
          agesFixed++;
        }

        // Fill description
        if (!prog.description) {
          const desc = stripHtml(detail.catalog_description || detail.online_notes || "");
          if (desc && desc.length > 10) {
            prog.description = desc.substring(0, 500);
            descriptionsFixed++;
          }
        }

        // Fill dates from first/last date
        if (!prog.startDate && detail.first_date) {
          prog.startDate = detail.first_date;
        }
        if (!prog.endDate && detail.last_date) {
          prog.endDate = detail.last_date;
        }
      }

      // Fetch price if missing
      if (prog.cost === undefined || prog.cost === null) {
        const price = await fetchPrice(item.slug, item.activityId);
        if (price !== null && !isNaN(price)) {
          prog.cost = price;
          prog.priceVerified = true;
          pricesFound++;
        }
      }
    }));

    if ((i + BATCH_SIZE) % 100 < BATCH_SIZE) {
      console.log(`Progress: ${Math.min(i + BATCH_SIZE, needsWork.length)}/${needsWork.length} — Details: ${detailsFound}, Prices: ${pricesFound}, Ages: ${agesFixed}, Descriptions: ${descriptionsFixed}`);
    }

    await new Promise(r => setTimeout(r, 250));
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Details found: ${detailsFound}`);
  console.log(`Prices found: ${pricesFound}`);
  console.log(`Ages fixed: ${agesFixed}`);
  console.log(`Descriptions added: ${descriptionsFixed}`);

  fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2));
  console.log("Updated programs.json");
}

main().catch(console.error);
