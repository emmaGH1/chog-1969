/**
 * CHOG / 1969 Pi -> ntfy notifications.
 * Sends only generic agent state, NEVER session text, token IDs, API keys or prompts.
 * For legacy Pi versions: agent_end sends after a short delay.
 * For Pi versions with agent_settled: completion is emitted once at settled.
 * Install globally via scripts/setup-notifications.sh.
 */
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join } from "node:path";

const configPath = join(homedir(), ".config", "chog-1969", "ntfy-topic");
let fallback: ReturnType<typeof setTimeout> | undefined;
let lastSent = 0;

function topic(): string | null {
  try {
    const value = readFileSync(configPath, "utf8").trim();
    return /^[A-Za-z0-9_-]{16,64}$/.test(value) ? value : null;
  } catch { return null; }
}
function send(kind: "ready" | "stopped" | "test", contextName: string) {
  const id = topic();
  if (!id) return;
  const now = Date.now();
  if (kind === "ready" && now - lastSent < 4000) return;
  lastSent = now;
  const message = kind === "test"
    ? "Test received. Pi notifications are connected."
    : kind === "stopped"
      ? `Pi session exited: ${contextName}. Check your VPS if unexpected.`
      : `Pi finished its turn in ${contextName}. Open Pi / T3 to review results or provide the next instruction.`;
  // Fire-and-forget with short timeout; do not interrupt the agent.
  const controller = new AbortController();
  const kill = setTimeout(() => controller.abort(), 5000);
  void fetch(`https://ntfy.sh/${id}`, {
    method: "POST",
    headers: { "Title": "CHOG / 1969", "Priority": kind === "stopped" ? "4" : "3", "Cache": "no" },
    body: message,
    signal: controller.signal,
  }).catch(() => {}).finally(() => clearTimeout(kill));
}

export default function (pi: ExtensionAPI) {
  // This also runs on versions without agent_settled. The timer is a compatibility fallback.
  pi.on("agent_end", async (_event, ctx) => {
    if (fallback) clearTimeout(fallback);
    const label = basename(ctx.cwd || "pi");
    fallback = setTimeout(() => { fallback = undefined; send("ready", label); }, 2500);
  });
  // Newer versions: signal only when automatic continuations have fully stopped.
  pi.on("agent_settled", async (_event, ctx) => {
    if (fallback) { clearTimeout(fallback); fallback = undefined; }
    send("ready", basename(ctx.cwd || "pi"));
  });
  pi.on("agent_start", async () => {
    if (fallback) { clearTimeout(fallback); fallback = undefined; }
  });
  pi.on("session_shutdown", async (_event, ctx) => {
    if (fallback) { clearTimeout(fallback); fallback = undefined; }
    send("stopped", basename(ctx.cwd || "pi"));
  });
  pi.registerCommand("testphone", {
    description: "Send a safe test notification to your Android phone.",
    handler: async (_args, ctx) => {
      send("test", basename(ctx.cwd || "pi"));
      if (ctx.hasUI) ctx.ui.notify("Sent a test notification (if configured).", "info");
    },
  });
}
