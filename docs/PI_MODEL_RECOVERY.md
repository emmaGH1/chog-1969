# Recover Pi agents from incompatible model selection

When Pi shows `400 The 'gpt-5.5' model is not supported when using Codex with a ChatGPT account`, the tmux session is **running but blocked**, not coding. The app, VPS and Git branches need not be recreated.

## Repair existing sessions

```bash
tmux attach -t chog-story
```

Inside Pi:
1. Type `/model`.
2. Select a **model supported by your existing ChatGPT/Codex login** such as `gpt-6.1-sol` or `gpt-5.4` **if shown**. Do not use `gpt-5.5`.
3. Optional: press `Ctrl+S` in the model picker to save the default for new Pi sessions. Resumed sessions retain their own model selections.
4. Send: `Read docs/AGENT_STORY.md and resume the assignment. Previous attempt failed due to the unsupported model. Commit incremental working changes.`
5. Wait for actual file reads/tool calls, then detach with `Ctrl+B`, `D`.

Repeat for `chog-chain` with `docs/AGENT_CHAIN.md`, and `chog-media` with `docs/AGENT_MEDIA.md`.

## New sessions only
`pi --list-models` lists available options for the authenticated providers on your VPS.

The startup script requires an explicit known-working choice to avoid silently reusing a bad one:

```bash
CHOG_PI_MODEL=openai-codex/gpt-6.1-sol bash scripts/start-agents.sh
```

Substitute **the actual provider/model shown in your picker**; modern Pi versions may use `openai` rather than `openai-codex` for ChatGPT sign-in. This does not retroactively change already-running sessions. Avoid using an API-key-backed provider unintentionally, as that can incur separate charges.

## Verify
```bash
for s in chog-story chog-chain chog-media; do
 echo "===== $s ====="
 tmux capture-pane -pt "$s" -S -25 | tail -25
done
```
Real progress means source files are opened/edited and tests run. A tmux session alone isn't proof of progress.

Official Pi reference: https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/models.md
