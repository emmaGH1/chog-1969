#!/usr/bin/env bash
set -euo pipefail
ROOT="${CHOG_WORKDIR:-$HOME/projects}"
MAIN="$ROOT/chog-1969"
TARGET="$ROOT/chog-integration"
test -d "$MAIN/.git" || { echo "Missing main clone at $MAIN"; exit 1; }
command -v tmux >/dev/null || { echo "tmux unavailable"; exit 1; }
git -C "$MAIN" fetch origin
if [ ! -e "$TARGET" ]; then
  if git -C "$MAIN" show-ref --quiet refs/heads/integration/pilot; then
    git -C "$MAIN" worktree add "$TARGET" integration/pilot
  else
    git -C "$MAIN" worktree add --track -b integration/pilot "$TARGET" origin/integration/pilot
  fi
fi
if ! tmux has-session -t chog-integration 2>/dev/null; then
  tmux new-session -d -s chog-integration -c "$TARGET"
fi
echo "Integration worktree ready: $TARGET"
echo "Session ready: chog-integration"
echo "Attach with: tmux attach -t chog-integration (or tmux switch-client -t chog-integration when already inside tmux)"
echo "Start Pi inside the session, select your already working model and send:"
echo "Read docs/INTEGRATION_SPRINT.md and carry out Gate 0 on integration/pilot."
echo "No branch merges have been executed by this setup script."
