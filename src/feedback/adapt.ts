import { Telemetry } from "../core/Telemetry";
import type { Adaptation } from "./analyze";

const flags = new Set<string>();

export function adapt(actions: Adaptation[], applyFn: (a: Adaptation) => void): void {
  actions.forEach((a) => {
    if (flags.has(a.id)) return;
    flags.add(a.id);
    try {
      applyFn(a);
    } catch (e) {
      Telemetry.event("adapt_error", { id: a.id, msg: String(e) });
    }
    Telemetry.event("adapt_applied", { id: a.id, apply: a.apply });
  });
}

export function resetAdaptFlags(): void { flags.clear(); }
