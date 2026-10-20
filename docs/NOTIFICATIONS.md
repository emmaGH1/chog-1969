# CHOG / 1969 VPS attention alerts

Our workflow has TWO paths:

1. **T3 Code itself**: in the T3 Code Android app, open Settings -> Notifications. Enable push for agent completion, failure, input/approval needs. Confirm OS notification permission and T3 Connect registration when required.
2. **Pi in tmux (separate process)**: a small global Pi extension sends generic alerts to the ntfy Android app, so Termux can be closed while Pi works.

## Setup on VPS (builder account)
```sh
cd ~/projects/chog-1969
git pull --ff-only
bash scripts/setup-notifications.sh
```
Install ntfy on Android and subscribe to the random topic the script prints. Never share that topic in chat, screenshots or a public GitHub issue; it is effectively a secret because ntfy.sh topics are public to anyone who knows the name. The extension ONLY sends generic status, never prompts, history or credentials.

Restart Pi or run `/reload`. In Pi try `/testphone`. Once a Pi turn finishes, you should receive a notification with the folder name. Newer Pi fires `agent_settled`; older Pi falls back to `agent_end`.

**Limits:** this does not detect every internal confirmation dialog, silently stalled model call, or abnormal VPS crash; ntfy cannot make T3 Code send a message by itself. T3 Code already has its own notifications. For a complete unattended agent supervisory system, separately add process/health checks and approval hooks. Avoid posting messages containing API keys.

Android tip: enable notification permission, disable excessive battery restrictions for ntfy if delivery is delayed.

## Security and cost
No paid account is required for basic ntfy.sh topics; topics are unguessable URLs but still publicly accessible if learned. Generic messages only, with `Cache: no`.
