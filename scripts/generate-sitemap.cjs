#!/usr/bin/env node
/**
 * generate-sitemap.cjs
 *
 * Generates sitemap.xml from the directory index data.
 * Includes all static pages plus dynamic directory pages
 * (providers, categories, areas).
 *
 * Run: node scripts/generate-sitemap.cjs
 * Should be run after generate-directory-data.cjs
 */

const fs = require("fs");
const path = require("path");

const DIR_INDEX_PATH = path.join(__dirname, "../src/data/directory-index.json");
const OUTPUT_PATH = path.join(__dirname, "../public/sitemap.xml");

const today = new Date().toISOString().split("T")[0];

// Blog post slugs — keep in sync with src/data/blog-posts.jsx
const BLOG_SLUGS = [
  "best-summer-camps-vancouver-2026",
  "vancouver-camp-costs-2026",
  "free-low-cost-camps-vancouver",
  "how-to-choose-summer-camp",
  "pro-d-day-camps-vancouver",
  "spring-break-camps-vancouver-2026",
  "camps-in-burnaby-2026",
  "camps-in-north-vancouver-2026",
];

function run() {
  const data = JSON.parse(fs.readFileSync(DIR_INDEX_PATH, "utf8"));

  const urls = [];

  // Static pages
  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/camps", priority: "0.9", changefreq: "weekly" },
    { loc: "/about", priority: "0.7", changefreq: "monthly" },
    { loc: "/privacy", priority: "0.5", changefreq: "monthly" },
    { loc: "/help", priority: "0.6", changefreq: "monthly" },
    { loc: "/signin", priority: "0.3", changefreq: "monthly" },
    { loc: "/signup", priority: "0.4", changefreq: "monthly" },
  ];

  for (const page of staticPages) {
    urls.push({
      loc: `https://skeddo.ca${page.loc}`,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  // Blog pages
  urls.push({
    loc: "https://skeddo.ca/blog",
    lastmod: today,
    changefreq: "weekly",
    priority: "0.8",
  });
  for (const slug of BLOG_SLUGS) {
    urls.push({
      loc: `https://skeddo.ca/blog/${slug}`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    });
  }

  // Category pages
  for (const cat of data.categories) {
    if (cat.programCount >= 10) {
      urls.push({
        loc: `https://skeddo.ca/camps/category/${cat.slug}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.8",
      });
    }
  }

  // Area pages
  for (const area of data.areas) {
    if (area.programCount >= 20) {
      urls.push({
        loc: `https://skeddo.ca/camps/area/${area.slug}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.8",
      });
    }
  }

  // Provider pages (only those with 5+ programs)
  for (const prov of data.providers) {
    if (prov.programCount >= 5) {
      urls.push({
        loc: `https://skeddo.ca/camps/provider/${prov.slug}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.7",
      });
    }
  }

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  fs.writeFileSync(OUTPUT_PATH, xml);
  console.log(`✅ Generated sitemap.xml with ${urls.length} URLs`);
  console.log(`   Static: ${staticPages.length}`);
  console.log(`   Blog: ${BLOG_SLUGS.length + 1} (index + ${BLOG_SLUGS.length} posts)`);
  console.log(`   Categories: ${data.categories.filter((c) => c.programCount >= 10).length}`);
  console.log(`   Areas: ${data.areas.filter((a) => a.programCount >= 20).length}`);
  console.log(`   Providers: ${data.providers.filter((p) => p.programCount >= 5).length}`);
}

run();
