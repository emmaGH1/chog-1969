#!/usr/bin/env bash
set -euo pipefail
ROOT="${CHOG_WORKDIR:-$HOME/projects}"
MAIN="$ROOT/chog-1969"
command -v git >/dev/null || { echo "git is missing"; exit 1; }
command -v tmux >/dev/null || { echo "tmux is missing"; exit 1; }
command -v pi >/dev/null || { echo "Pi CLI is not in the VPS PATH; open T3 Code in each worktree instead."; exit 1; }
cd "$MAIN"
git pull --ff-only origin main
echo "Preparing three clean agent worktrees..."
for info in "chog-story:chog-story" "chog-chain:chog-chain" "chog-media:chog-media"; do
  IFS=':' read -r dirname session <<< "$info"
  dir="$ROOT/$dirname"
  test -d "$dir/.git" -o -f "$dir/.git" || { echo "Missing worktree $dir. Run bootstrap first"; exit 1; }
  git -C "$dir" fetch origin
  git -C "$dir" merge --ff-only origin/main || { echo "Could not advance $dirname; resolve this before starting"; exit 1; }
  tmux has-session -t "$session" 2>/dev/null || tmux new-session -d -s "$session" -c "$dir"
done
for info in "chog-story:docs/AGENT_STORY.md" "chog-chain:docs/AGENT_CHAIN.md" "chog-media:docs/AGENT_MEDIA.md"; do
  IFS=':' read -r session promptfile <<< "$info"
  current="$(tmux display-message -t "$session" -p '#{pane_current_command}')"
  if [[ "$current" != "bash" && "$current" != "zsh" && "$current" != "sh" ]]; then
    echo "$session already running $current; skipped."
    continue
  fi
  dir="$ROOT/$session"
  prompt="Read $promptfile in this repository and begin the assigned work immediately. Work only in your branch. Commit frequently and do not deploy or spend money without approval."
  tmux send-keys -t "$session" "cd '$dir' && pi '$prompt'" C-m
  echo "Started $session"
done
echo
echo "Check each tmux session first: tmux attach -t chog-story"
echo "Detach without stopping Pi: Ctrl+B, then D."
echo "You should receive a ntfy message when Pi finishes a turn, assuming the extension is loaded."
echo "If Pi shows auth/provider errors, configure the relevant model through Pi/T3 rather than adding secrets to Git."
