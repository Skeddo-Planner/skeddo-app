#!/usr/bin/env node
/**
 * Fetch prices for ActiveNet programs missing cost using the estimateprice API.
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

function fetchPrice(slug, activityId) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: HOST,
      port: 443,
      path: `/${slug}/rest/activity/detail/estimateprice/${activityId}?locale=en-US`,
      method: "GET",
      headers: { "Accept": "application/json" },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          // Price can be in various locations in the response
          const price = json.body?.estimated_price ?? json.body?.fee ?? null;
          if (price !== null && price !== undefined) {
            resolve(parseFloat(price));
          } else {
            // Try to find price in nested structure
            const body = json.body;
            if (body && typeof body === "object") {
              // Sometimes it's in fee_items
              if (body.fee_items && body.fee_items.length > 0) {
                const total = body.fee_items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
                resolve(total > 0 ? total : null);
              } else if (body.total_amount !== undefined) {
                resolve(parseFloat(body.total_amount));
              } else {
                resolve(null);
              }
            } else {
              resolve(null);
            }
          }
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

function fetchDetail(slug, activityId) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: HOST,
      port: 443,
      path: `/${slug}/rest/activities/${activityId}/detail?locale=en-US`,
      method: "GET",
      headers: { "Accept": "application/json" },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
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

  // Find all ActiveNet programs missing cost
  const missingCost = [];
  for (let i = 0; i < programs.length; i++) {
    const p = programs[i];
    if (p.cost !== undefined && p.cost !== null) continue;
    const prefix = String(p.id).split("-")[0];
    if (SLUG_MAP[prefix]) {
      missingCost.push({ index: i, id: p.id, prefix, slug: SLUG_MAP[prefix], activityId: String(p.id).split("-")[1] });
    }
  }

  console.log(`Found ${missingCost.length} ActiveNet programs missing cost`);

  let found = 0;
  let notFound = 0;
  let errors = 0;
  const BATCH_SIZE = 5;

  for (let i = 0; i < missingCost.length; i += BATCH_SIZE) {
    const batch = missingCost.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(async (item) => {
      // Try estimateprice first
      let price = await fetchPrice(item.slug, item.activityId);

      // If no price from estimateprice, try detail endpoint
      if (price === null) {
        const detail = await fetchDetail(item.slug, item.activityId);
        if (detail?.body) {
          const d = detail.body;
          // Check various price fields
          if (d.fee !== undefined && d.fee !== null) {
            price = parseFloat(d.fee);
          } else if (d.price !== undefined && d.price !== null) {
            price = parseFloat(d.price);
          }
        }
      }

      return { ...item, price };
    }));

    for (const result of results) {
      if (result.price !== null && !isNaN(result.price)) {
        programs[result.index].cost = result.price;
        programs[result.index].priceVerified = true;
        found++;
      } else {
        notFound++;
      }
    }

    if ((i + BATCH_SIZE) % 100 < BATCH_SIZE) {
      console.log(`Progress: ${i + BATCH_SIZE}/${missingCost.length} — Found: ${found}, Not found: ${notFound}`);
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Prices found: ${found}`);
  console.log(`Prices not found: ${notFound}`);

  fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2));
  console.log("Updated programs.json");
}

main().catch(console.error);
