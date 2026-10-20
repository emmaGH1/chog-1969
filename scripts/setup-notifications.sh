#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG="$HOME/.config/chog-1969"
EXT="$HOME/.pi/agent/extensions"
mkdir -p "$CONFIG" "$EXT"
chmod 700 "$CONFIG"
if [[ ! -f "$CONFIG/ntfy-topic" ]]; then
  command -v openssl >/dev/null || { echo "Please install openssl and retry"; exit 1; }
  TOPIC="chog-1969-$(openssl rand -hex 16)"
  printf '%s\n' "$TOPIC" > "$CONFIG/ntfy-topic"
  chmod 600 "$CONFIG/ntfy-topic"
fi
cp "$ROOT/extensions/chog-notify.ts" "$EXT/chog-notify.ts"
chmod 644 "$EXT/chog-notify.ts"
TOPIC="$(cat "$CONFIG/ntfy-topic")"
echo "1. Install the ntfy Android app from the official Play Store or F-Droid."
echo "2. Subscribe to this PRIVATE-LIKE topic (do not share):"
echo "   $TOPIC"
echo "   Server: https://ntfy.sh"
echo "3. Enable Android notifications for ntfy; allow it to operate in background."
echo "4. Restart your Pi sessions (or use Pi /reload), then run /testphone in Pi."
echo
echo "Sending an initial test message now..."
curl -fsS -m 10 -H "Title: CHOG / 1969" -H "Priority: 3" -H "Cache: no" -d "Notifications connected to the CHOG VPS." "https://ntfy.sh/$TOPIC" >/dev/null && echo "Sent. Check Android after subscribing." || echo "Message not delivered; check VPS connectivity and curl."
echo "REMEMBER: This public service is not private, so notification content is generic only."
