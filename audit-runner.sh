#!/bin/bash
# Audit runner — picks one provider at a time, injects it into the prompt, relaunches automatically
CLAUDE="/c/Users/thoma/AppData/Roaming/Claude/claude-code/2.1.87/claude.exe"
NODE="/c/Program Files/nodejs/node"
LOG="/c/Users/thoma/Skeddo/skeddo-app/audit-agent.log"
REPO="/c/Users/thoma/Skeddo/skeddo-app"
MAX_SECONDS=2700  # 45 min per provider before giving up

cd "$REPO" || exit 1

echo "=== AUDIT SESSION STARTED: $(date) ===" >> "$LOG"

# Pull latest before starting
git pull >> "$LOG" 2>&1

# Reset stale in-progress providers (crashed sessions leave these behind)
STALE=$("$NODE" -e "
  const fs = require('fs');
  const q = JSON.parse(fs.readFileSync('scripts/audit-provider-queue.json'));
  const stale = q.providers.filter(p => p.status === 'in_progress' && !p.logFile);
  stale.forEach(p => p.status = 'pending');
  if (stale.length) fs.writeFileSync('scripts/audit-provider-queue.json', JSON.stringify(q, null, 2));
  process.stdout.write(stale.map(p => p.name).join(', '));
" 2>/dev/null)

if [ -n "$STALE" ]; then
  echo "--- Reset stale in_progress providers: $STALE ---" >> "$LOG"
  git add scripts/audit-provider-queue.json
  git commit --no-verify -m "chore: reset stale in_progress providers to pending" >> "$LOG" 2>&1
  git push >> "$LOG" 2>&1
fi

while true; do
  # Pick next pending provider and mark it in_progress (runner owns this, not the agent)
  NEXT=$("$NODE" -e "
    const fs = require('fs');
    const q = JSON.parse(fs.readFileSync('scripts/audit-provider-queue.json'));
    const p = q.providers.find(p => p.status === 'pending');
    if (!p) { process.stdout.write(''); process.exit(0); }
    p.status = 'in_progress';
    fs.writeFileSync('scripts/audit-provider-queue.json', JSON.stringify(q, null, 2));
    process.stdout.write(p.name);
  " 2>/dev/null)

  if [ -z "$NEXT" ]; then
    echo "=== ALL PROVIDERS COMPLETE: $(date) ===" >> "$LOG"
    break
  fi

  # Compute UPPER-KEBAB-CASE slug for the verification log filename
  SLUG=$(PROVIDER_NAME="$NEXT" "$NODE" -e "
    process.stdout.write(process.env.PROVIDER_NAME.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-\$/g, ''));
  " 2>/dev/null)

  PENDING_COUNT=$("$NODE" -e "
    const q = JSON.parse(require('fs').readFileSync('scripts/audit-provider-queue.json'));
    process.stdout.write(String(q.providers.filter(p => p.status === 'pending').length));
  " 2>/dev/null)

  echo "--- LAUNCHING AGENT: $(date) | Provider: $NEXT | Remaining pending: $PENDING_COUNT ---" >> "$LOG"

  # Get registration URL from queue entry (if set) for direct navigation
  REG_URL=$("$NODE" -e "
    const q = JSON.parse(require('fs').readFileSync('scripts/audit-provider-queue.json'));
    const p = q.providers.find(p => p.name === process.argv[1]);
    process.stdout.write(p && p.registrationUrl ? p.registrationUrl : '');
  " "$NEXT" 2>/dev/null)

  # Build prompt: substitute {{PROVIDER_NAME}}, {{PROVIDER_SLUG}}, {{REGISTRATION_URL}} in the template
  PROMPT=$(PROVIDER_NAME="$NEXT" PROVIDER_SLUG="$SLUG" REGISTRATION_URL="$REG_URL" "$NODE" -e "
    const fs = require('fs');
    let t = fs.readFileSync('scripts/AUDIT-MASTER-PROMPT.md', 'utf8');
    t = t.replace(/\{\{PROVIDER_NAME\}\}/g, process.env.PROVIDER_NAME);
    t = t.replace(/\{\{PROVIDER_SLUG\}\}/g, process.env.PROVIDER_SLUG);
    t = t.replace(/\{\{REGISTRATION_URL\}\}/g, process.env.REGISTRATION_URL || 'https://anc.ca.apm.activecommunities.com/vancouver/activity/search');
    process.stdout.write(t);
  " 2>/dev/null)

  # Launch agent in background so we can enforce a timeout
  "$CLAUDE" --dangerously-skip-permissions -p "$PROMPT" >> "$LOG" 2>&1 &
  AGENT_PID=$!
  ELAPSED=0
  TIMED_OUT=0

  while kill -0 $AGENT_PID 2>/dev/null; do
    sleep 30
    ELAPSED=$((ELAPSED + 30))
    if [ $ELAPSED -ge $MAX_SECONDS ]; then
      echo "--- AGENT TIMED OUT (${MAX_SECONDS}s): $(date) | Provider: $NEXT ---" >> "$LOG"
      kill $AGENT_PID 2>/dev/null
      sleep 5
      kill -9 $AGENT_PID 2>/dev/null
      TIMED_OUT=1
      break
    fi
  done

  wait $AGENT_PID 2>/dev/null
  EXIT_CODE=$?
  [ $TIMED_OUT -eq 1 ] && EXIT_CODE=124

  echo "--- AGENT DONE (code $EXIT_CODE): $(date) | Provider: $NEXT ---" >> "$LOG"

  # Safety reset: if agent exited without marking the provider complete/failed, put it back to pending
  # After 3 consecutive failures, flag as needs_review so the runner moves on
  STILL_IN_PROGRESS=$(PROVIDER_NAME="$NEXT" "$NODE" -e "
    const fs = require('fs');
    const q = JSON.parse(fs.readFileSync('scripts/audit-provider-queue.json'));
    const p = q.providers.find(p => p.name === process.env.PROVIDER_NAME);
    if (p && p.status === 'in_progress') {
      p.failedAttempts = (p.failedAttempts || 0) + 1;
      if (p.failedAttempts >= 3) {
        p.status = 'needs_review';
        process.stdout.write('needs_review');
      } else {
        p.status = 'pending';
        process.stdout.write('yes');
      }
      fs.writeFileSync('scripts/audit-provider-queue.json', JSON.stringify(q, null, 2));
    }
  " 2>/dev/null)

  if [ "$STILL_IN_PROGRESS" = "yes" ]; then
    echo "--- Provider not completed by agent, reset to pending: $NEXT ---" >> "$LOG"
  elif [ "$STILL_IN_PROGRESS" = "needs_review" ]; then
    echo "--- Provider flagged needs_review after 3 failures (NOT skipped — will need manual audit): $NEXT ---" >> "$LOG"
  fi

  sleep 3
done
