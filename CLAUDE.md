# Skeddo — Claude Agent Instructions

These instructions are MANDATORY for every Claude agent working in this repository.
They exist because automated rules exist to prevent real harm: wrong prices, broken links,
and fabricated listings that erode parent trust.

## Before Every Session

```bash
git pull   # Always pull first — two founders work from different machines (Rule 19)
```

## After ANY Change to src/data/programs.json

**MANDATORY — no exceptions:**

```bash
node scripts/fill-computable-fields.cjs       # compute derived fields first
node scripts/validate-programs.cjs --fix      # auto-fix rule violations
node scripts/auto-resolve-violations.cjs --offline --ids=<changed-ids>  # additional fixes
git add src/data/programs.json
```

- Run ALL three steps immediately after every data change, before staging for commit.
- **Never commit new/changed programs with violations** — fix them first.
- If violations remain after `--fix` and `auto-resolve`, fix them manually before committing.
- If a violation genuinely can't be fixed (e.g. price is unknown until registration opens),
  document WHY in the program's `costNote` field and set the appropriate flags.
- Include the validator output summary in your commit message (see Commit Format below).

### What the pre-commit hook does automatically

The smart pre-commit hook (`.husky/pre-commit`) runs this pipeline automatically:
1. Identifies only the new/changed programs in your staged diff
2. Runs `fill-computable-fields.cjs` + `validate-programs.cjs --fix`
3. Tries offline auto-resolution (`auto-resolve-violations.cjs --offline`) on remaining violations
4. **Blocks the commit only if new/changed programs still have violations**
5. Allows the commit (with a warning) if violations are on pre-existing programs

This means: **you should never see a commit blocked due to someone else's old data.**
You are only responsible for the programs you add or change.

## After Editing docs/DATA-QUALITY-RULES.md

**MANDATORY — no exceptions:**

```bash
node scripts/check-rules-coverage.cjs
```

- You MUST also add a corresponding check to `scripts/validate-programs.cjs` for any
  new rule. Per Rule 17: every rule must be documented AND automated.
- Never add a rule to the doc without also writing the validator code.
- Never remove a rule from the doc without also removing the validator check.
- Stage both files together in the same commit.

## Commit Message Format

Every commit that touches programs.json MUST include the validator summary:

```
chore: <description of change>

Validator: N violations, M auto-fixed
Rules checked: R1, R2, R3, ...
Programs: XXXX total
```

Example:
```
fix: correct enrollment status for Pedalheads summer camps

Validator: 0 violations, 3 auto-fixed (status corrections)
Rules checked: R1–R34 + REQ
Programs: 6721 total
```

## Data Rules Quick Reference

Full rules: docs/DATA-QUALITY-RULES.md
Validator:  scripts/validate-programs.cjs
Coverage:   scripts/check-rules-coverage.cjs

**Hard rules most commonly violated:**
| Rule | Summary |
|------|---------|
| R14  | Prior-year data → enrollmentStatus MUST be "Likely Coming Soon" |
| R15  | cost=null → must have costNote; cost=0 only for genuinely free |
| R20  | "Coming Soon" requires a registrationDate |
| R22  | Never guess or estimate — null + costNote when unknown |
| R23  | Every program must be verified on the provider's live page |
| R24  | Never use activekids.com or campscui.active.com URLs |
| R28  | "Open" requires confirmed2026=true or an ActiveNet ID |
| R30  | Deduplication must preserve unique time slots and age groups |
| R31  | Triple-check before removing ANY program |
| R33  | "Full Day" scheduleType requires durationPerDay >= 4 hours |

## What You Must NEVER Do

- Never edit `docs/DATA-QUALITY-RULES.md` without also updating `validate-programs.cjs`
- **Never commit new/changed programs with violations** — run the full pipeline first
- Never guess program data (prices, dates, times, ages) — use null + notes
- Never mark `confirmed2026: true` or `priceVerified: true` without verifying on the
  actual provider page
- Never remove a program because registration is full, URL is broken, or price is unknown
  — use appropriate flags instead
- Never use activekids.com or campscui.active.com as data sources
- Never skip `fill-computable-fields.cjs` — it must run before validate to prevent false violations

## Key Scripts

| Script | Purpose |
|--------|---------|
| `node scripts/validate-programs.cjs` | Check all data quality rules |
| `node scripts/validate-programs.cjs --fix` | Auto-fix fixable violations |
| `node scripts/fill-computable-fields.cjs` | Compute derived fields (scheduleType, dayLength, etc.) |
| `node scripts/auto-resolve-violations.cjs --offline --ids=<ids>` | Extra offline fixes for specific programs |
| `node scripts/auto-resolve-violations.cjs --all` | Attempt full resolution of all violations |
| `node scripts/check-rules-coverage.cjs` | Verify doc ↔ validator coverage |
| `node scripts/validate-urls.cjs --fix` | Fix broken registration URLs |
| `node scripts/verify-programs.cjs --incremental --fix` | Cross-check live pages |

### Quarantine file

`src/data/quarantined-programs.json` — programs with violations that couldn't be auto-resolved
by the daily CI pipeline. Checked by subsequent Claude sessions. To attempt resolution:
```bash
node scripts/auto-resolve-violations.cjs --all          # offline resolution
node scripts/auto-resolve-violations.cjs --all --ids=<id1,id2>  # specific programs
```

## Git Hooks

The pre-commit hook (`.husky/pre-commit`) runs automatically on every commit:
- Validates programs.json if it changed (blocks on HARD violations)
- Warns if rules doc was updated without validator code changes
- Prints coverage % from check-rules-coverage.cjs

To install (run once per machine):
```bash
git config core.hooksPath .husky
chmod +x .husky/pre-commit   # Mac/Linux only
```

## One Click Deeper Audit Standard

When auditing or adding provider data, EVERY field must be verified against the provider's actual registration page. This means:

1. Navigate to the provider's registration/program listing page (not just their homepage)
2. For EVERY program listing, verify ALL of these fields against what's shown on the registration page:
   - name: Must match the program name on the registration page
   - description: Must accurately describe the program based on registration page content
   - cost: Must match the price shown on the registration page (not "inquire for pricing" if a price exists)
   - costNote: Must include context if cost is per-session, per-week, etc.
   - startDate/endDate: Must match dates on registration page
   - startTime/endTime: Must match times on registration page
   - ageMin/ageMax: Must match age ranges on registration page
   - address: Must be the actual physical location of the program
   - neighbourhood: Must be correct for the address
   - url: Must point to the specific registration/program page (not a search page or homepage)
   - enrollmentStatus: Must reflect the actual current status (Open, Full, Waitlist, etc.)
   - category/subcategory: Must be appropriate for the program content
   - days: Must match the actual schedule days

3. For NEW listings being added: every field value must be directly sourced from the provider's registration page. No guessing, no placeholders, no "inquire for pricing" if the price is visible.

4. For EXISTING listings being verified: compare every field against the registration page. Fix any discrepancies.

5. If a field cannot be verified (e.g., registration hasn't opened yet), document the specific reason in a costNote or comment field.

## Important Files

| File | Purpose |
|------|---------|
| `docs/DATA-QUALITY-RULES.md` | Source of truth for all data quality rules |
| `scripts/validate-programs.cjs` | Automated enforcement of those rules |
| `scripts/fill-computable-fields.cjs` | Computes derived fields from existing data |
| `scripts/auto-resolve-violations.cjs` | Additional offline + web-based violation resolution |
| `scripts/pre-commit-validate.cjs` | Smart pre-commit pipeline logic (called by hook) |
| `scripts/check-rules-coverage.cjs` | Audits that every rule has a check |
| `src/data/programs.json` | The program database (~6700+ entries) |
| `src/data/quarantined-programs.json` | Programs with violations needing human attention |
| `scripts/verify-state.json` | State tracker for incremental URL verification — do not delete |
