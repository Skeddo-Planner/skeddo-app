# Skeddo — Claude Agent Instructions

> Extended docs: [Audit Standard](docs/AUDIT-STANDARD.md) · [Scripts & Hooks](docs/SCRIPTS-REFERENCE.md) · [Data Quality Rules](docs/DATA-QUALITY-RULES.md)
> **New instructions belong in docs/ — link them here. Do not grow this file past 60 lines.**

## CRITICAL: Always Commit to Main

All code tasks run in git worktrees — commits go to isolated branches, NOT main.

Merge to main after every task:
```bash
cd /c/Users/thoma/Skeddo/skeddo-app && git checkout main && git merge WORKTREE_BRANCH --no-verify
```
Verify: `git log main --oneline -1` — report "Committed to main: [hash]". Work not on main doesn't count.

## Before Every Session

```bash
git pull   # Two founders, two machines (Rule 19)
```

## After ANY Change to src/data/programs.json

```bash
node scripts/fill-computable-fields.cjs
node scripts/validate-programs.cjs --fix
node scripts/auto-resolve-violations.cjs --offline --ids=<changed-ids>
git add src/data/programs.json
```
Never commit programs with violations — fix first. If unfixable, use null + costNote.

## Commit Message Format (programs.json)

```
fix: <description>

Validator: N violations, M auto-fixed
Rules checked: R1–R34 + REQ
Programs: XXXX total
```

## After Editing docs/DATA-QUALITY-RULES.md

Run `node scripts/check-rules-coverage.cjs`. Every rule needs a validator check in `validate-programs.cjs`. Stage both files together.

## What You Must NEVER Do

- Never commit programs with violations
- Never guess prices/dates/times/ages — use null + costNote
- Never mark `confirmed2026: true` / `priceVerified: true` without verifying on the live page
- Never remove a program because it's full, URL is broken, or price is unknown
- Never use activekids.com or campscui.active.com
- Never skip `fill-computable-fields.cjs` before validate
- Never edit DATA-QUALITY-RULES.md without updating validate-programs.cjs

## Key Rules (most violated)

R14: Prior-year → "Likely Coming Soon" | R15: cost=null needs costNote | R20: "Coming Soon" needs registrationDate | R22: Never estimate | R23: Verify on live page | R24: No activekids/campscui | R28: "Open" needs confirmed2026=true or ActiveNet ID | R30: Preserve unique slots | R31: Triple-check before removing | R33: "Full Day" needs durationPerDay ≥ 4h
