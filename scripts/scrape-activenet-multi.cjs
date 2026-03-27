#!/usr/bin/env node
/**
 * Scrape ALL kids programs from multiple ActiveNet municipalities.
 * Usage: node scripts/scrape-activenet-multi.cjs
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

const CITIES = [
  { slug: "cityofportcoquitlam", name: "Port Coquitlam", prefix: "PC" },
  { slug: "langleycityrecconnect", name: "City of Langley", prefix: "LGY" },
];

const HOST = "anc.ca.apm.activecommunities.com";

async function fetchPage(slug, pageNum) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      activity_select_param: 2,
      page_info: { page_number: pageNum, total_records_per_page: 20, order_by: "Name", order_option: "ASC" },
    });
    const req = https.request({
      hostname: HOST, port: 443, path: `/${slug}/rest/activities/list?locale=en-US`, method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(postData) },
    }, (res) => {
      let data = ""; res.on("data", (c) => (data += c));
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    });
    req.on("error", reject); req.write(postData); req.end();
  });
}

async function scrapeCity(city) {
  console.log(`\nScraping ${city.name} (${city.slug})...`);
  const first = await fetchPage(city.slug, 1);
  const totalPages = first.headers?.page_info?.total_page || 0;
  const totalRecords = first.headers?.page_info?.total_records || 0;
  console.log(`  Total: ${totalRecords} records, ${totalPages} pages`);

  const programs = new Map();
  let page = 1;
  while (page <= totalPages) {
    try {
      const data = page === 1 ? first : await fetchPage(city.slug, page);
      const items = data.body?.activity_items || [];
      for (const item of items) {
        if (item.age_min_year >= 18) continue;
        if (item.age_max_year !== undefined && item.age_max_year !== null && item.age_max_year > 17) continue;
        if (!programs.has(item.id)) {
          programs.set(item.id, {
            id: item.id, name: item.name,
            location: item.location?.label?.replace(/^\*/, "").trim() || "",
            startDate: item.date_range_start || "", endDate: item.date_range_end || "",
            days: item.days_of_week || "", timeRange: item.time_range || "",
            ageMin: item.age_min_year, ageMax: item.age_max_year,
            openings: item.total_open, enrollNow: item.enroll_now?.label || "",
            desc: (item.desc || "").replace(/<[^>]*>/g, "").substring(0, 300),
          });
        }
      }
      if (page % 20 === 0) console.log(`  Page ${page}/${totalPages} — ${programs.size} kids programs`);
      page++;
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.log(`  Error page ${page}: ${e.message}`);
      page++;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  const result = [...programs.values()];
  const outPath = path.join(__dirname, `${city.slug}-data.json`);
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`  Done! ${result.length} kids programs saved to ${outPath}`);
  return { city: city.name, prefix: city.prefix, slug: city.slug, count: result.length, programs: result };
}

async function main() {
  const results = [];
  for (const city of CITIES) {
    const result = await scrapeCity(city);
    results.push(result);
  }

  console.log("\n=== SUMMARY ===");
  results.forEach((r) => console.log(`${r.city}: ${r.count} kids programs`));
  console.log("Total new:", results.reduce((s, r) => s + r.count, 0));
}

main().catch(console.error);
