#!/usr/bin/env node
/**
 * Scrape ALL kids programs from City of Vancouver ActiveNet system.
 * Calls the REST API directly (no auth required).
 * Filters for age 0-17 client-side.
 * Outputs to scripts/cov-activenet-data.json
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

const API_URL = "/vancouver/rest/activities/list?locale=en-US";
const HOST = "anc.ca.apm.activecommunities.com";
const PER_PAGE = 20; // API always returns 20 regardless of request

async function fetchPage(pageNum) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      activity_select_param: 2,
      page_info: {
        page_number: pageNum,
        total_records_per_page: PER_PAGE,
        order_by: "Name",
        order_option: "ASC",
      },
    });

    const options = {
      hostname: HOST,
      port: 443,
      path: API_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error("Parse error on page " + pageNum));
        }
      });
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log("Starting CoV ActiveNet scrape...");

  // Get first page to know total
  const first = await fetchPage(1);
  const totalRecords = first.headers?.page_info?.total_records || 0;
  const totalPages = first.headers?.page_info?.total_page || 0;
  console.log(`Total records: ${totalRecords}, Pages: ${totalPages}`);

  const allPrograms = new Map(); // id -> program
  let page = 1;
  let errors = 0;

  while (page <= totalPages) {
    try {
      const data = page === 1 ? first : await fetchPage(page);
      const items = data.body?.activity_items || [];

      for (const item of items) {
        // Filter for kids programs (age max <= 17 years)
        const ageMax = item.age_max_year;
        if (ageMax !== undefined && ageMax !== null && ageMax > 17) continue;
        // Also skip if age_min >= 18 (adult-only)
        if (item.age_min_year >= 18) continue;

        if (!allPrograms.has(item.id)) {
          allPrograms.set(item.id, {
            id: item.id,
            name: item.name,
            location: item.location?.label?.replace(/^\*/, "").trim() || "",
            startDate: item.date_range_start || "",
            endDate: item.date_range_end || "",
            dateRange: item.date_range || "",
            days: item.days_of_week || "",
            timeRange: item.time_range || "",
            ageMin: item.age_min_year || null,
            ageMinMonth: item.age_min_month || 0,
            ageMax: item.age_max_year || null,
            ageMaxMonth: item.age_max_month || 0,
            ageDescription: item.age_description || "",
            openings: item.total_open,
            enrollNow: item.enroll_now?.label || "",
            detailUrl: item.detail_url || "",
            searchFromPrice: item.search_from_price,
            searchFromPriceDesc: item.search_from_price_desc || "",
            desc: (item.desc || "").replace(/<[^>]*>/g, "").substring(0, 300),
          });
        }
      }

      if (page % 50 === 0) {
        console.log(`  Page ${page}/${totalPages} — ${allPrograms.size} kids programs collected`);
      }

      page++;

      // Small delay to be respectful
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.log(`  Error on page ${page}: ${e.message}. Retrying...`);
      errors++;
      if (errors > 10) {
        console.log("Too many errors, stopping.");
        break;
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  const programs = [...allPrograms.values()];
  console.log(`\nDone! Collected ${programs.length} unique kids programs from ${page - 1} pages.`);

  // Save to file
  const outPath = path.join(__dirname, "cov-activenet-data.json");
  fs.writeFileSync(outPath, JSON.stringify(programs, null, 2));
  console.log(`Saved to ${outPath}`);

  // Summary stats
  const byLoc = {};
  programs.forEach((p) => {
    byLoc[p.location || "Unknown"] = (byLoc[p.location || "Unknown"] || 0) + 1;
  });
  console.log("\nBy location (top 20):");
  Object.entries(byLoc)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([k, v]) => console.log(`  ${v} ${k}`));
}

main().catch(console.error);
