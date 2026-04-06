#!/usr/bin/env bash
# promote-to-production.sh
#
# Merges staging → main to promote all staging changes to skeddo.ca.
# Run from the repo root: ./promote-to-production.sh
#
# What it does:
#   1. Ensures you're on a clean working tree
#   2. Pulls latest from both staging and main
#   3. Merges staging into main (fast-forward preferred, falls back to merge commit)
#   4. Pushes main — triggers Vercel production deployment
#   5. Reports the commit that went live

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

echo ""
echo "=== Skeddo: Promote staging → production ==="
echo ""

# 1. Ensure clean working tree
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: You have uncommitted changes. Commit or stash them first."
  exit 1
fi

# 2. Pull latest staging
echo "Pulling latest staging..."
git fetch origin staging
git checkout staging
git pull origin staging

# 3. Pull latest main
echo "Pulling latest main..."
git fetch origin main
git checkout main
git pull origin main

# 4. Check there's actually something to promote
AHEAD=$(git rev-list main..staging --count)
if [ "$AHEAD" -eq 0 ]; then
  echo ""
  echo "Nothing to promote — staging is already up to date with main."
  exit 0
fi

echo ""
echo "Changes to be promoted ($AHEAD commit(s)):"
git log main..staging --oneline
echo ""

# 5. Confirm
read -r -p "Promote these changes to skeddo.ca (production)? [y/N] " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

# 6. Merge staging into main
echo ""
echo "Merging staging → main..."
git merge staging --no-ff -m "chore: promote staging to production

Merged staging → main via promote-to-production.sh"

# 7. Push
echo "Pushing main to origin..."
git push origin main

HASH=$(git rev-parse --short HEAD)
echo ""
echo "=== Done ==="
echo "Committed to main: $HASH"
echo "Vercel will deploy to skeddo.ca in ~30 seconds."
echo ""
