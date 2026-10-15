export interface Metrics {
  fps: number;
  quizAvgMs: number;
  quizChanges: number;
  aiAvgMs: number;
  aiErrors: number;
  hacksActivated: number;
  hacksCompleted: number;
  elapsedMs: number;
}

export const Collect = {
  state: {
    fpsSamples: [] as number[],
    quizTimes: [] as number[],
    quizChanges: 0,
    aiWaits: [] as number[],
    aiErrors: 0,
    hacksActivated: 0,
    hacksCompleted: 0,
    startedAt: typeof performance !== "undefined" ? performance.now() : 0,
  },

  fps(v: number): void {
    this.state.fpsSamples.push(v);
    if (this.state.fpsSamples.length > 20) this.state.fpsSamples.shift();
  },
  quizAnswer(ms: number): void { this.state.quizTimes.push(ms); },
  quizChange(): void { this.state.quizChanges++; },
  aiWait(ms: number): void {
    this.state.aiWaits.push(ms);
    if (this.state.aiWaits.length > 5) this.state.aiWaits.shift();
  },
  aiError(): void { this.state.aiErrors++; },
  hackActivated(): void { this.state.hacksActivated++; },
  hackCompleted(): void { this.state.hacksCompleted++; },

  resumen(): Metrics {
    const avg = (arr: number[], def = 0): number =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : def;
    return {
      fps: Math.round(avg(this.state.fpsSamples, 60)),
      quizAvgMs: Math.round(avg(this.state.quizTimes)),
      quizChanges: this.state.quizChanges,
      aiAvgMs: Math.round(avg(this.state.aiWaits)),
      aiErrors: this.state.aiErrors,
      hacksActivated: this.state.hacksActivated,
      hacksCompleted: this.state.hacksCompleted,
      elapsedMs: Math.round(performance.now() - this.state.startedAt),
    };
  },
};
