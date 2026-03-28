#!/usr/bin/env node
/**
 * Update registration status for all ActiveNet programs from the detail API.
 * Maps space_status/space_type to our status field.
 */
const https = require("https");
const fs = require("fs");
const path = require("path");

const HOST = "anc.ca.apm.activecommunities.com";
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

async function main() {
  const programsPath = path.join(__dirname, "..", "src", "data", "programs.json");
  const programs = JSON.parse(fs.readFileSync(programsPath, "utf-8"));

  const activenet = [];
  for (let i = 0; i < programs.length; i++) {
    const p = programs[i];
    const prefix = String(p.id).split("-")[0];
    if (!SLUG_MAP[prefix]) continue;
    const activityId = String(p.id).split("-").slice(1).join("-");
    activenet.push({ index: i, prefix, slug: SLUG_MAP[prefix], activityId });
  }

  console.log(`Checking status for ${activenet.length} ActiveNet programs...`);
  let updated = 0;
  const BATCH = 10;

  for (let i = 0; i < activenet.length; i += BATCH) {
    const batch = activenet.slice(i, i + BATCH);
    await Promise.all(batch.map(async (item) => {
      const result = await fetchDetail(item.slug, item.activityId);
      const detail = result?.body?.detail;
      if (!detail) return;

      const prog = programs[item.index];
      const oldStatus = prog.status;

      // Map space_status to our status
      if (detail.space_status === "Full") {
        if (detail.space_message && detail.space_message.includes("Waiting List")) {
          prog.status = "Waitlist";
        } else {
          prog.status = "Full";
        }
      } else if (detail.space_status === "Available") {
        prog.status = "Open";
      } else if (detail.space_status === "Cancelled") {
        prog.status = "Cancelled";
      }

      if (prog.status !== oldStatus) {
        updated++;
        if (updated <= 50) {
          console.log(`  ${prog.id}: ${oldStatus} → ${prog.status} (${detail.space_status}, ${detail.space_message || ""})`);
        }
      }
    }));

    if ((i + BATCH) % 500 < BATCH) {
      console.log(`Progress: ${Math.min(i + BATCH, activenet.length)}/${activenet.length} — Updated: ${updated}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Status updated: ${updated}/${activenet.length}`);

  if (updated > 0) {
    fs.writeFileSync(programsPath, JSON.stringify(programs, null, 2));
    console.log("Updated programs.json");
  }
}

main().catch(console.error);
