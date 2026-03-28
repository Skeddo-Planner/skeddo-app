#!/usr/bin/env node
/**
 * Re-fetch prices for ActiveNet programs that are missing cost.
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

const HOST = "anc.ca.apm.activecommunities.com";
const SLUG_MAP = { COV: "vancouver", BNB: "burnaby", WV: "westvanrec", PC: "cityofportcoquitlam", LGY: "langleycityrecconnect" };

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
          resolve(json.body?.estimateprice || null);
        } catch { resolve(null); }
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

  const noCost = [];
  for (let i = 0; i < programs.length; i++) {
    const p = programs[i];
    if (p.cost !== undefined && p.cost !== null) continue;
    const prefix = String(p.id).split("-")[0];
    if (!SLUG_MAP[prefix]) continue;
    const activityId = String(p.id).split("-").slice(1).join("-");
    noCost.push({ index: i, prefix, slug: SLUG_MAP[prefix], activityId });
  }

  console.log(`Re-checking ${noCost.length} ActiveNet programs for prices...`);
  let found = 0;
  const BATCH = 5;

  for (let i = 0; i < noCost.length; i += BATCH) {
    const batch = noCost.slice(i, i + BATCH);
    await Promise.all(batch.map(async (item) => {
      const ep = await fetchPrice(item.slug, item.activityId);
      if (!ep) return;

      const prog = programs[item.index];
      if (ep.free) {
        prog.cost = 0;
        prog.priceVerified = true;
        delete prog.costNote;
        found++;
        console.log(`  FREE: ${prog.id} — ${prog.name}`);
      } else if (ep.show_price_info_online && ep.estimate_price) {
        const match = ep.estimate_price.match(/\$([\d,.]+)/);
        if (match) {
          prog.cost = parseFloat(match[1].replace(",", ""));
          prog.priceVerified = true;
          delete prog.costNote;
          found++;
          console.log(`  PRICE: ${prog.id} — ${prog.name} — $${prog.cost}`);
        }
      }
    }));
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nFound ${found} new prices`);
  if (found > 0) {
    fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2));
    console.log("Updated programs.json");
  }
}

main().catch(console.error);
