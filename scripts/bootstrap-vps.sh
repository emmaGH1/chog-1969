#!/usr/bin/env bash
set -euo pipefail
ROOT="${CHOG_WORKDIR:-$HOME/projects}"
REPO="$ROOT/chog-1969"
mkdir -p "$ROOT"
if [ ! -d "$REPO/.git" ]; then
  git clone https://github.com/emmaGH1/chog-1969.git "$REPO"
fi
cd "$REPO"
git fetch origin --prune
git checkout main
git pull --ff-only origin main
echo "Installing app dependencies..."
npm install
for entry in "feat/story-engine:chog-story:chog-story" "feat/nft-memory:chog-chain:chog-chain" "feat/media-assets:chog-media:chog-media"; do
  IFS=':' read -r BRANCH DIR SESSION <<< "$entry"
  TARGET="$ROOT/$DIR"
  if [ ! -d "$TARGET" ]; then
    git worktree add --track -b "$BRANCH" "$TARGET" "origin/$BRANCH"
  fi
  if ! tmux has-session -t "$SESSION" 2>/dev/null; then
    tmux new-session -d -s "$SESSION" -c "$TARGET"
  fi
done
if ! tmux has-session -t chog-app 2>/dev/null; then
  tmux new-session -d -s chog-app -c "$REPO"
fi
printf '\nReady. Check app: cd %s && npm run dev\n' "$REPO"
echo "Agent directories: $ROOT/chog-story  $ROOT/chog-chain  $ROOT/chog-media"
echo "tmux sessions: chog-app, chog-story, chog-chain, chog-media"
echo "No agents were automatically launched. Start Pi/T3 in the appropriate directory."
