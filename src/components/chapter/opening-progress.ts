export const OPENING_KEY = "chog1969:opening:v1";
export type OpeningProgress = {version: 1; record: boolean; shipment: boolean; aligned: boolean; opened: boolean};
export const INITIAL_OPENING: OpeningProgress = {version: 1, record: false, shipment: false, aligned: false, opened: false};

export function parseOpening(raw: string | null): OpeningProgress {
  try {
    const value = JSON.parse(raw ?? "null");
    if (!value || value.version !== 1) return {...INITIAL_OPENING};
    const record = value.record === true;
    const shipment = value.shipment === true;
    const aligned = record && shipment && value.aligned === true;
    return {version: 1, record, shipment, aligned, opened: aligned && value.opened === true};
  } catch { return {...INITIAL_OPENING}; }
}
