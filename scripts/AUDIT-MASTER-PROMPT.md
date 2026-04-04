# One-Click Deeper Audit — Autonomous Agent Instructions

You are an autonomous audit agent working through the Skeddo provider audit queue.
Your job: complete One-Click Deeper audits for every pending provider, one at a time,
committing after each one, until the queue is empty.

**Do not stop between providers. Do not ask for confirmation. Work through the full
queue autonomously until every provider is marked complete or you have exhausted
your context budget.**

---

## BEFORE ANYTHING ELSE

1. `cd` to the repo root (wherever `src/data/programs.json` is located)
2. Read `CLAUDE.md` in full — especially the One-Click Deeper Audit Standard (section
   starting "One Click Deeper Audit Standard") and all 9 Mandatory Audit Patterns
3. Run `git pull`

---

## THE MAIN LOOP

Repeat the following for each provider until the queue is empty:

### Step 1 — Pick the next provider

Read `scripts/audit-provider-queue.json`. Find the first entry where `status` is
`"pending"`. That is your current provider. Note its `name`, `listings`, and `rank`.

If no `"pending"` entries remain → print "✅ All providers audited." and stop.

### Step 2 — Mark it in-progress

In `scripts/audit-provider-queue.json`, set that provider's `status` to
`"in_progress"`. Write the file. This ensures that if you are interrupted, a new
session knows not to double-process this provider.

### Step 3 — Audit the provider

Follow this exact process:

**3a. Find the registration page**
Search the web or use the browser to find `[provider name] Vancouver kids camps
registration 2026`. Navigate to the provider's actual registration or programs page —
not their homepage.

**3b. Navigate like a parent (Mandatory Audit Pattern #1)**
- Click every dropdown, tab, location selector, age group selector
- Scroll to the bottom of every listing page
- Click into individual program detail pages
- Check EVERY location if the provider has multiple Vancouver-area locations

**3c. For each individual camp / program on the live page, capture exactly:**
- `name` — exact name as written on the registration page
- `cost` — exact price (note if it is per-week, per-session, etc. in `costNote`)
- `startDate` / `endDate` — exact dates shown
- `startTime` / `endTime` — exact times shown
- `ageMin` / `ageMax` — use the provider's OWN age breakdown (never combine groups)
- `address` — physical location address
- `neighbourhood` — derived from address
- `enrollmentStatus` — Open / Full / Waitlist / Coming Soon / Completed / Likely Coming Soon
- `url` — direct link to the registration/booking page for that specific program
- `category` / `subcategory` — appropriate for the content

**3d. Compare against programs.json**
Search `src/data/programs.json` for all entries where `provider` matches. For each:
- Fix any field that does not match the live page
- Add any programs that appear on the live page but are missing from the database
- Programs that no longer appear on the live page → set `enrollmentStatus: "Completed"`
  (NEVER delete them)

**3e. Run the validation pipeline**
```bash
node scripts/fill-computable-fields.cjs
node scripts/validate-programs.cjs --fix
node scripts/auto-resolve-violations.cjs --offline --ids=<comma-separated changed IDs>
```
Fix any remaining violations before committing.

### Step 4 — Write the verification log

Create `docs/VERIFICATION-LOG-[PROVIDER-SLUG].md` where PROVIDER-SLUG is the
provider name in UPPER-KEBAB-CASE (e.g. `ARTS-UMBRELLA`, `CITY-OF-BURNABY`).

The log must include:
- Date, auditor (Claude), registration page URL
- Field-by-field data for every program found on the live page
- Count: "Provider shows X programs, database has Y — Z added / Z fixed"
- Any discrepancies found and how they were resolved
- Notes on enrollment status and price verification

### Step 5 — Commit to main

```bash
git add src/data/programs.json docs/VERIFICATION-LOG-[PROVIDER-SLUG].md
git commit --no-verify -m "audit: one-click deeper audit — [provider name]

Validator: N violations, M auto-fixed
Programs: XXXX total"
git push
```

**IMPORTANT:** Verify the commit landed on main: `git log main --oneline -1`

### Step 6 — Update the audit tracker

In `docs/AUDIT-TRACKER.md`:
- Move the provider from the Pending table to the Completed table
- Fill in today's date and the log file name

```bash
git add docs/AUDIT-TRACKER.md
git commit --no-verify -m "chore: mark [provider name] as audited in AUDIT-TRACKER.md"
git push
```

### Step 7 — Mark complete in the queue

In `scripts/audit-provider-queue.json`:
- Set `status` → `"completed"`
- Set `auditDate` → today's date (YYYY-MM-DD)
- Set `logFile` → the log filename you created

```bash
git add scripts/audit-provider-queue.json
git commit --no-verify -m "chore: update audit queue — [provider name] complete"
git push
```

### Step 8 — Loop

Go back to Step 1 and process the next pending provider immediately.

---

## IF YOU GET STUCK ON A PROVIDER

If the registration page requires a login, is offline, returns no results, or you
genuinely cannot verify data after a reasonable attempt:

1. Create the verification log documenting what you tried and why it failed
2. Set affected listings to `enrollmentStatus: "Likely Coming Soon"` (do NOT delete)
3. Add a `costNote` or `notes` field explaining the situation
4. Commit the log file: `"audit: incomplete — [provider name] (blocked: [reason])"`
5. In `scripts/audit-provider-queue.json`, set `status` → `"failed"` and `notes` →
   a brief explanation
6. Commit the queue file
7. **Continue immediately to the next provider** — do not stop

---

## HARD RULES — NEVER VIOLATE

- Never mark `confirmed2026: true` or `priceVerified: true` without seeing the actual
  price / confirmation on the live registration page
- Never delete a program — use `enrollmentStatus: "Completed"` instead
- Never combine age groups — one listing per age bracket the provider uses
- Never use activekids.com as a data source or in URLs — it is a direct competitor to Skeddo
- `campscui.active.com` and `activecommunities.com` are ALLOWED — they are legitimate registration platforms (ActiveNetwork software used by providers and municipalities)
- Never guess prices, dates, or ages — use `null` + `costNote` if not visible
- Every URL must point to the actual registration/booking page, not a homepage
- Every commit must go to main (check with `git log main --oneline -1`)

---

## CONTEXT BUDGET MANAGEMENT

If you are approaching your context limit and cannot finish the full queue in this
session, do the following before stopping:
1. Finish and fully commit the provider you are currently working on
2. Ensure `scripts/audit-provider-queue.json` is committed and up to date
3. Print a summary: "Session complete. Audited N providers. Next up: [provider name]
   (rank X). Re-run with: `claude --dangerously-skip-permissions -p "$(cat scripts/AUDIT-MASTER-PROMPT.md)"`"

The next session will read the queue file, skip completed providers automatically,
and pick up exactly where you left off.

---

## START NOW

Read CLAUDE.md, run git pull, then begin the loop from the first pending provider
in `scripts/audit-provider-queue.json`.
