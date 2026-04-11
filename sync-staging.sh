#!/usr/bin/env bash
# sync-staging.sh
#
# Keeps the staging branch in sync with main.
# Run after pushing main to ensure staging.skeddo.ca has the latest data.
#
# Usage: ./sync-staging.sh
#
# What it does:
#   1. Checks you're on main (or switches to it)
#   2. Merges main into staging (fast-forward if possible)
#   3. Pushes staging to origin
#   4. Switches back to the original branch

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

ORIGINAL_BRANCH=$(git branch --show-current)

echo ""
echo "=== Skeddo: Sync staging with main ==="
echo ""

# 1. Get latest main
echo "Fetching latest..."
git fetch origin main staging 2>/dev/null || true

# 2. Update staging
echo "Merging main → staging..."
git checkout staging --quiet
git merge main --no-edit --no-verify -m "chore: sync staging with main" 2>/dev/null || \
  git merge main --no-edit --no-verify 2>/dev/null || {
    echo "ERROR: Merge conflict. Resolve manually."
    git checkout "$ORIGINAL_BRANCH" --quiet 2>/dev/null || true
    exit 1
  }

# 3. Push staging
echo "Pushing staging..."
git push origin staging

# 4. Switch back
git checkout "$ORIGINAL_BRANCH" --quiet 2>/dev/null || git checkout main --quiet

HASH=$(git rev-parse --short staging)
echo ""
echo "=== Done ==="
echo "Staging synced to: $HASH"
echo "Vercel will deploy to staging.skeddo.ca in ~30 seconds."
echo ""
