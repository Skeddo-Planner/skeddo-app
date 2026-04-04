#!/usr/bin/env bash
# =============================================================================
# start-audit.sh
# =============================================================================
# The ONE command Tom runs. Sends AUDIT-MASTER-PROMPT.md to Claude Code and
# automatically restarts it after each session completes, until all providers
# in audit-provider-queue.json are marked "completed" or "failed".
#
# USAGE (from inside skeddo-app/):
#   bash scripts/start-audit.sh
#
# That's it. Walk away. Claude Code handles the rest.
#
# HOW IT WORKS
#   Each Claude Code session reads audit-provider-queue.json, audits as many
#   providers as context allows, commits after each one, then exits cleanly.
#   This script detects the exit and immediately restarts Claude Code for the
#   next batch. Restarts continue until no "pending" providers remain.
#
# IF IT GETS INTERRUPTED
#   Re-run the same command: bash scripts/start-audit.sh
#   It reads the queue, skips anything already completed, and picks up exactly
#   where it left off.
# =============================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
QUEUE="$REPO_ROOT/scripts/audit-provider-queue.json"
PROMPT="$REPO_ROOT/scripts/AUDIT-MASTER-PROMPT.md"
LOG_DIR="$REPO_ROOT/scripts/audit-logs"
CLAUDE="${CLAUDE_BIN:-claude}"

# Colours
GREEN='\033[0;32m'; CYAN='\033[0;36m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} $*"; }
ok()   { echo -e "${GREEN}[$(date '+%H:%M:%S')] ✅ $*${NC}"; }
warn() { echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠️  $*${NC}"; }
err()  { echo -e "${RED}[$(date '+%H:%M:%S')] ❌ $*${NC}"; }

# ---------------------------------------------------------------------------
pending_count() {
  python3 -c "
import json
q = json.load(open('$QUEUE'))
print(sum(1 for p in q['providers'] if p['status'] in ('pending', 'in_progress')))
"
}

completed_count() {
  python3 -c "
import json
q = json.load(open('$QUEUE'))
print(sum(1 for p in q['providers'] if p['status'] == 'completed'))
"
}

next_provider() {
  python3 -c "
import json
q = json.load(open('$QUEUE'))
p = next((p for p in q['providers'] if p['status'] == 'pending'), None)
print(p['name'] if p else '')
"
}

total_count() {
  python3 -c "import json; print(len(json.load(open('$QUEUE'))['providers']))"
}

# ---------------------------------------------------------------------------
# Sanity checks
# ---------------------------------------------------------------------------
if ! command -v "$CLAUDE" &>/dev/null; then
  err "Claude Code CLI not found on PATH."
  err "Install: npm install -g @anthropic-ai/claude-code"
  exit 1
fi
if [[ ! -f "$QUEUE" ]]; then
  err "Queue file not found: $QUEUE"
  err "Run: node scripts/generate-audit-queue.cjs"
  exit 1
fi
if [[ ! -f "$PROMPT" ]]; then
  err "Master prompt not found: $PROMPT"
  exit 1
fi

mkdir -p "$LOG_DIR"
cd "$REPO_ROOT"

TOTAL=$(total_count)
SESSION=0

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Skeddo One-Click Deeper Audit — Autonomous Runner    ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
log "Queue: $QUEUE"
log "Total providers in queue: $TOTAL"
log "Completed so far: $(completed_count)"
log "Pending: $(pending_count)"
echo ""

# ---------------------------------------------------------------------------
# Main restart loop
# ---------------------------------------------------------------------------
while true; do

  PENDING=$(pending_count)

  if [[ "$PENDING" -eq 0 ]]; then
    ok "Queue is empty — all providers audited!"
    echo ""
    echo -e "${GREEN}Final count: $(completed_count) / $TOTAL providers completed.${NC}"
    break
  fi

  SESSION=$((SESSION + 1))
  NEXT=$(next_provider)
  LOG_FILE="$LOG_DIR/session-$(date '+%Y%m%d-%H%M%S').log"

  echo -e "${CYAN}────────────────────────────────────────────────────────${NC}"
  log "Session $SESSION — $PENDING providers still pending"
  log "Next up: $NEXT"
  log "Session log: $LOG_FILE"
  echo ""

  # Run Claude Code with the master prompt (non-interactive, all permissions auto-approved)
  EXIT_CODE=0
  "$CLAUDE" \
    --dangerously-skip-permissions \
    -p "$(cat "$PROMPT")" \
    2>&1 | tee "$LOG_FILE" || EXIT_CODE=$?

  echo ""

  if [[ $EXIT_CODE -eq 0 ]]; then
    ok "Session $SESSION finished cleanly."
  else
    warn "Session $SESSION exited with code $EXIT_CODE."
    warn "Checking queue status before deciding whether to continue..."

    # If progress was made (at least one more completed than before), keep going
    NEW_PENDING=$(pending_count)
    if [[ "$NEW_PENDING" -ge "$PENDING" ]]; then
      err "No progress made this session. Possible hard error."
      err "Check the session log: $LOG_FILE"
      err "Fix the issue and re-run: bash scripts/start-audit.sh"
      exit 1
    else
      warn "Progress was made ($((PENDING - NEW_PENDING)) providers completed). Restarting..."
    fi
  fi

  # Brief pause before next session to avoid rate limits
  sleep 3

done

echo ""
log "Audit run complete. All session logs saved to: $LOG_DIR"
