/**
 * Telemetry — capa unificada de eventos.
 * Envuelve: dataLayer (GTM) + trackModuleEngagement (DECOX) + Vercel Analytics.
 * Fuente única de verdad para todo lo que el sistema "siente" del usuario.
 */

const isDev = import.meta.env?.DEV ?? false;
const queue: Array<[string, Record<string, unknown>]> = [];
let ready = false;
let startedAt = 0;
let fpsFrames = 0;
let fpsLast = 0;
let fpsCurrent = 60;

type EventData = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    trackModuleEngagement?: (m: string, a: string, x?: EventData) => void;
  }
}

// Cast local para Vercel Analytics sin redeclarar el tipo global
type VercelAnalyticsFn = (cmd: "event", data: EventData) => void;

export const Telemetry = {
  boot(): void {
    startedAt = performance.now();
    ready = true;
    queue.splice(0).forEach(([n, d]) => this._push(n, d));
    this._startFpsSampler();
    this._attachAutoEvents();
  },

  event(name: string, data: EventData = {}): void {
    const payload: EventData = {
      ...data,
      _ts: Math.round(performance.now()),
      _url: location.pathname,
      _sub: location.hostname.split(".")[0],
    };
    if (!ready) {
      queue.push([name, payload]);
      return;
    }
    this._push(name, payload);
  },

  _push(name: string, data: EventData): void {
    if (window.dataLayer) {
      window.dataLayer.push({ event: name, ...data });
    }
    if (typeof window.trackModuleEngagement === "function") {
      window.trackModuleEngagement((data.module as string) ?? "core", name, data);
    }
    const va = (window as unknown as { va?: VercelAnalyticsFn }).va;
    if (typeof va === "function") {
      try { va("event", { name, ...data }); } catch { /* noop */ }
    }
    if (isDev) console.debug("[tele]", name, data);
  },

  get fps(): number { return fpsCurrent; },

  _startFpsSampler(): void {
    fpsLast = performance.now();
    const loop = (): void => {
      fpsFrames++;
      const now = performance.now();
      if (now - fpsLast >= 1000) {
        fpsCurrent = fpsFrames;
        fpsFrames = 0;
        fpsLast = now;
        if (fpsCurrent < 30) this.event("fps_critical", { fps: fpsCurrent });
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  },

  _attachAutoEvents(): void {
    let fired = false;
    const onFirst = (evt: Event): void => {
      if (fired) return;
      fired = true;
      this.event("first_interaction", {
        evt: evt.type,
        ms: Math.round(performance.now()),
      });
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
    window.addEventListener("pointerdown", onFirst, { once: true });
    window.addEventListener("keydown", onFirst, { once: true });

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.event("page_hide", {
          total_ms: Math.round(performance.now() - startedAt),
        });
      }
    });
  },
};

// ============================================================
// API semántica — usar ESTA en los componentes
// ============================================================
export const T = {
  quiz: {
    start: () => Telemetry.event("quiz_start", { module: "quiz" }),
    answer: (id: string | number, ms: number) =>
      Telemetry.event("quiz_answer", { module: "quiz", id, ms }),
    done: (archetype: string) =>
      Telemetry.event("quiz_done", { module: "quiz", archetype }),
  },
  ai: {
    request: () => Telemetry.event("ai_request", { module: "ai" }),
    success: (ms: number) => Telemetry.event("ai_success", { module: "ai", ms }),
    error: (msg: string) => Telemetry.event("ai_error", { module: "ai", msg }),
  },
  hack: {
    activate: (id: number) =>
      Telemetry.event("hack_activate", { module: "hacks", id }),
    complete: (id: number) =>
      Telemetry.event("hack_complete", { module: "hacks", id }),
  },
  service: {
    view: (id: string) =>
      Telemetry.event("service_view", { module: "services", id }),
    click: (id: string) =>
      Telemetry.event("service_click", { module: "services", id }),
  },
  payment: {
    success: (id: string) =>
      Telemetry.event("payment_success", { module: "payment", id }),
    failed: (msg: string) =>
      Telemetry.event("payment_failed", { module: "payment", msg }),
  },
};
