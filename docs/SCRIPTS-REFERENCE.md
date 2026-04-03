# Scripts & Hooks Reference

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

## Quarantine File

`src/data/quarantined-programs.json` — programs with violations that couldn't be auto-resolved
by the daily CI pipeline. To attempt resolution:
```bash
node scripts/auto-resolve-violations.cjs --all          # offline resolution
node scripts/auto-resolve-violations.cjs --all --ids=<id1,id2>  # specific programs
```

## Pre-Commit Hook Behaviour

The hook (`.husky/pre-commit`) runs automatically on every commit:
1. Identifies only new/changed programs in the staged diff
2. Runs `fill-computable-fields.cjs` + `validate-programs.cjs --fix`
3. Tries offline auto-resolution on remaining violations
4. **Blocks commit only if new/changed programs still have violations**
5. Allows commit (with warning) if violations are on pre-existing programs

You are only responsible for programs you add or change.

## Git Hooks Installation (run once per machine)

```bash
git config core.hooksPath .husky
chmod +x .husky/pre-commit   # Mac/Linux only
```
