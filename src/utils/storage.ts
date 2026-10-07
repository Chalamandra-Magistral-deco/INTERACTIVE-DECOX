/**
 * Small client-side storage boundary.
 * All reads are guarded so corrupted localStorage never takes down the app.
 */
export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to persist ${key}:`, error);
  }
}

export function loadString(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function loadNumberSet(key: string): Set<number> {
  const values = loadJson<unknown>(key, []);
  if (!Array.isArray(values)) return new Set<number>();

  return new Set(
    values.filter((value): value is number => Number.isInteger(value) && value >= 0),
  );
}
