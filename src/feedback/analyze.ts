import type { Metrics } from "./collect";

export type AdaptationId =
  | "perf-low"
  | "quiz-slow"
  | "quiz-doubt"
  | "ai-slow"
  | "ai-fail"
  | "hack-stuck";

export interface Adaptation {
  id: AdaptationId;
  apply: string;
  msg: string | null;
}

export function analyze(m: Metrics): Adaptation[] {
  const actions: Adaptation[] = [];
  if (m.fps < 40) actions.push({ id: "perf-low", apply: "reduceMotion", msg: null });
  if (m.quizAvgMs > 12000) actions.push({ id: "quiz-slow", apply: "simplifyQuiz", msg: "Ajustando ritmo…" });
  if (m.quizChanges > 3) actions.push({ id: "quiz-doubt", apply: "showHints", msg: null });
  if (m.aiAvgMs > 4000) actions.push({ id: "ai-slow", apply: "aiProgressUI", msg: "Pensando más profundo…" });
  if (m.aiErrors > 1) actions.push({ id: "ai-fail", apply: "aiFallbackLocal", msg: null });
  if (m.hacksActivated > 0 && m.hacksCompleted === 0 && m.elapsedMs > 60000) {
    actions.push({ id: "hack-stuck", apply: "reorderHacks", msg: "Reordenando por dificultad" });
  }
  return actions;
}
