export type EscapeRoute = "keep" | "burn" | null;
export type Progress = {
  version: 1;
  index: number;
  unlocked: boolean;
  route: EscapeRoute;
};
export const SAVE_KEY = "chog1969:pilot";
export const INITIAL_PROGRESS: Progress = {version: 1, index: 0, unlocked: false, route: null};

/** Accept old pilot saves, but never let malformed storage bypass a story gate. */
export function parseProgress(raw: string | null): Progress {
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    if (!value || typeof value !== "object") return {...INITIAL_PROGRESS};
    const saved = value as Record<string, unknown>;
    if (saved.version !== undefined && saved.version !== 1) return {...INITIAL_PROGRESS};
    let index = typeof saved.index === "number" && Number.isInteger(saved.index)
      ? Math.min(5, Math.max(0, saved.index)) : 0;
    const unlocked = saved.unlocked === true;
    const route = saved.route === "keep" || saved.route === "burn" ? saved.route : null;
    if (!unlocked) index = Math.min(index, 1);
    if (!route) index = Math.min(index, 3);
    return {version: 1, index, unlocked, route};
  } catch {
    return {...INITIAL_PROGRESS};
  }
}

export function canAdvance(progress: Progress): boolean {
  return progress.index < 5 && !(progress.index === 1 && !progress.unlocked)
    && !(progress.index === 3 && !progress.route);
}

export function advanceProgress(progress: Progress): Progress {
  return canAdvance(progress) ? {...progress, index: progress.index + 1} : progress;
}
