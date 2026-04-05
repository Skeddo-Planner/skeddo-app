#!/bin/bash
# Audit runner with auto-relaunch between providers
CLAUDE="/c/Users/thoma/AppData/Roaming/Claude/claude-code/2.1.87/claude.exe"
NODE="/c/Program Files/nodejs/node"
LOG="/c/Users/thoma/Skeddo/skeddo-app/audit-agent.log"
PROMPT_FILE="./scripts/AUDIT-MASTER-PROMPT.md"
REPO="/c/Users/thoma/Skeddo/skeddo-app"

cd "$REPO" || exit 1

echo "=== AUDIT SESSION STARTED: $(date) ===" >> "$LOG"

while true; do
  # Use relative paths so Node.js can resolve them (it doesn't understand /c/... POSIX paths)
  PENDING=$("$NODE" -e "
    const q = JSON.parse(require('fs').readFileSync('./scripts/audit-provider-queue.json'));
    const p = q.providers.filter(p => p.status === 'pending');
    console.log(p.length);
  " 2>/dev/null)

  if [ "$PENDING" = "0" ]; then
    echo "=== ALL PROVIDERS COMPLETE: $(date) ===" >> "$LOG"
    break
  fi

  # Get next provider name for logging
  NEXT=$("$NODE" -e "
    const q = JSON.parse(require('fs').readFileSync('./scripts/audit-provider-queue.json'));
    const p = q.providers.find(p => p.status === 'pending');
    console.log(p ? p.name : 'none');
  " 2>/dev/null)

  echo "--- LAUNCHING AGENT: $(date) | Pending: $PENDING | Next: $NEXT ---" >> "$LOG"

  # Run audit agent
  PROMPT=$(cat "$PROMPT_FILE")
  "$CLAUDE" --dangerously-skip-permissions -p "$PROMPT" >> "$LOG" 2>&1
  EXIT_CODE=$?

  echo "--- AGENT EXITED (code $EXIT_CODE): $(date) ---" >> "$LOG"

  sleep 5
done
