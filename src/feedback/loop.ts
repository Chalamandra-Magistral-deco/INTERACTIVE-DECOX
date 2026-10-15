import { Collect } from "./collect";
import { analyze, type Adaptation } from "./analyze";
import { adapt } from "./adapt";
import { Telemetry } from "../core/Telemetry";

let intervalId: ReturnType<typeof setInterval> | null = null;

export function startFeedbackLoop(applyFn: (a: Adaptation) => void): void {
  if (intervalId) return;
  intervalId = setInterval(() => {
    Collect.fps(Telemetry.fps);
    const metrics = Collect.resumen();
    const actions = analyze(metrics);
    if (actions.length) {
      adapt(actions, applyFn);
      Telemetry.event("feedback_tick", {
        metrics,
        actions: actions.map((a) => a.id),
      });
    }
  }, 500);
}

export function stopFeedbackLoop(): void {
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
}
