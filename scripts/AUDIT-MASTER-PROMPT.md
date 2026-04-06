# ONE CLICK DEEPER AUDIT: {{PROVIDER_NAME}}

Read CLAUDE.md first — especially the Mandatory Audit Patterns section.
Working directory: `/c/Users/thoma/Skeddo/skeddo-app`

```bash
cd /c/Users/thoma/Skeddo/skeddo-app && git pull
```

---

## YOUR JOB

Audit **{{PROVIDER_NAME}}** — verify all existing listings and add any that are missing.

**MANDATORY:** Create `docs/VERIFICATION-LOG-{{PROVIDER_SLUG}}.md` with field-by-field data for each program found on the live page.

---

## CRITICAL: USE PLAYWRIGHT BROWSER — NOT WEBFETCH

**You MUST use the Playwright browser tool (`mcp__playwright__browser_navigate`) to visit every registration page.**

- Do **NOT** use `WebFetch` or `WebSearch` to read registration page content — they cannot render JavaScript and will miss most program data on modern sites
- Do **NOT** use any API endpoints as a primary source
- The Playwright browser renders pages exactly as a parent would see them

---

## PROCESS

**1. NAVIGATE WITH PLAYWRIGHT** to {{PROVIDER_NAME}}'s registration page.

**Your direct registration URL is: `{{REGISTRATION_URL}}`**
- Navigate here first using `mcp__playwright__browser_navigate` — do NOT navigate to a generic homepage
- After loading, use `mcp__playwright__browser_snapshot` to confirm the page loaded
- If snapshot shows a loading spinner or blank page, wait 3 seconds and snapshot again before interacting
- For ActiveNet pages: use `mcp__playwright__browser_evaluate` with `window.scrollTo(0, document.body.scrollHeight)` repeated 20–30 times to trigger infinite scroll and load all programs
- Click into individual program detail pages using `mcp__playwright__browser_click` to confirm prices, dates, enrollment status
- If you don't know the URL and none was provided, use `WebSearch` only to *find* the URL, then navigate with Playwright

**2. For each individual program on the live page, capture exactly:**
- Exact name (as written on the registration page)
- Exact price — note per-week / per-session / per-day in `costNote`
- Exact start and end dates
- Exact start and end times
- Exact age range — use the provider's own brackets, never combine groups
- Physical address and neighbourhood
- Registration URL — must link to the actual booking page, not the homepage
- Enrollment status: Open / Full / Waitlist / Coming Soon / Completed / Likely Coming Soon

**3. Update `src/data/programs.json`:**
- Fix any field that doesn't match the live page
- Add programs that appear on the live page but are missing from the database
- Programs no longer listed → set `enrollmentStatus: "Completed"` (never delete)

**4. Run the validation pipeline and commit:**

```bash
node scripts/fill-computable-fields.cjs
node scripts/validate-programs.cjs --fix
node scripts/auto-resolve-violations.cjs --offline --ids=<comma-separated changed IDs>
git add src/data/programs.json
git commit --no-verify -m "audit: {{PROVIDER_NAME}}

Validator: N violations, M auto-fixed
Programs: XXXX total"
git push
```

Verify it landed on main: `git log main --oneline -1`

**5. Write and commit the verification log** (`docs/VERIFICATION-LOG-{{PROVIDER_SLUG}}.md`):
- Date audited, registration page URL
- Field-by-field data for every program found
- Count: "Provider shows X programs, database has Y — Z added / Z fixed"
- Any discrepancies found and how they were resolved

```bash
git add docs/VERIFICATION-LOG-{{PROVIDER_SLUG}}.md
git commit --no-verify -m "chore: verification log — {{PROVIDER_NAME}}"
git push
```

**6. Mark complete in the queue:**

```bash
node -e "
const fs = require('fs');
const q = JSON.parse(fs.readFileSync('scripts/audit-provider-queue.json'));
const p = q.providers.find(p => p.name === '{{PROVIDER_NAME}}');
if (p) {
  p.status = 'completed';
  p.auditDate = new Date().toISOString().slice(0,10);
  p.logFile = 'VERIFICATION-LOG-{{PROVIDER_SLUG}}.md';
}
fs.writeFileSync('scripts/audit-provider-queue.json', JSON.stringify(q, null, 2));
console.log('Marked complete:', p ? p.name : 'NOT FOUND');
"
git add scripts/audit-provider-queue.json
git commit --no-verify -m "chore: update audit queue — {{PROVIDER_NAME}} complete"
git push
```

---

## IF YOU GET STUCK

If the page requires a login, is down, or data genuinely can't be verified after a reasonable attempt:

1. Create the verification log documenting what you tried and why it failed
2. Set affected listings to `enrollmentStatus: "Likely Coming Soon"` with a `costNote` explaining the situation
3. Mark the provider as failed in the queue:

```bash
node -e "
const fs = require('fs');
const q = JSON.parse(fs.readFileSync('scripts/audit-provider-queue.json'));
const p = q.providers.find(p => p.name === '{{PROVIDER_NAME}}');
if (p) { p.status = 'failed'; p.notes = 'DESCRIBE REASON HERE'; }
fs.writeFileSync('scripts/audit-provider-queue.json', JSON.stringify(q, null, 2));
console.log('Marked failed:', p ? p.name : 'NOT FOUND');
"
git add scripts/audit-provider-queue.json docs/VERIFICATION-LOG-{{PROVIDER_SLUG}}.md
git commit --no-verify -m "audit: incomplete — {{PROVIDER_NAME}} (blocked: REASON)"
git push
```

---

## HARD RULES — NEVER VIOLATE

- **Always use Playwright (`mcp__playwright__browser_navigate`) — never WebFetch — to read registration pages**
- **NEVER write custom scraper scripts** (no `.cjs`, `.js`, `.py` scraper files, no `node scripts/...` execution for scraping). Use only `mcp__playwright__browser_*` tools directly. Writing scraper scripts spawns uncontrolled browser processes.
- **NEVER call `npx playwright`, `require('playwright')`, or spawn any browser process directly** — only the MCP tools are permitted
- Never mark `confirmed2026: true` or `priceVerified: true` without seeing it confirmed on the live page via Playwright browser
- Never delete programs — use `enrollmentStatus: "Completed"` instead
- Never combine age groups — one listing per age bracket the provider uses
- Never use activekids.com as a source or in URLs
- Never guess prices, dates, or ages — use `null` + `costNote`
- Every URL must point to the actual registration/booking page
- Every commit must go to main — verify with `git log main --oneline -1`

---

**TURN BUDGET: 200. Commit all changes by turn 180. Close browser tabs when done.**
