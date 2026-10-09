/**
 * Resuelve endpoints del backend.
 * Sin base configurada conserva las rutas relativas de Vercel.
 */
export function apiUrl(path: string): string {
  const base = (import.meta.env.VITE_API_BASE_URL ?? "")
    .trim()
    .replace(/\/+$/, "");

  const route = path.replace(/^\/+/, "");
  return `${base}/${route}`;
}
