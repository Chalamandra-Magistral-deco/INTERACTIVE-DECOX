export type CorsPolicy = {
  methods: readonly string[];
  headers: readonly string[];
};

const ALLOWED_ORIGINS = new Set([
  "https://interactive.chalamandramagistral.com",
  "https://interactive-decox-875051-3b397.web.app",
  "https://interactive-decox-875051-3b397.firebaseapp.com",
  "https://interactive-decox-one.vercel.app",
  "https://interactive-decox-chalamandra-magistral-s-projects.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
]);

export function isAllowedApiOrigin(
  origin: string | null,
  requestUrl?: string,
): boolean {
  // Conserva las llamadas server-to-server sin cabecera Origin.
  if (origin === null) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;

  // Permite el origen exacto del despliegue que sirve esta propia API.
  // No acepta otros subdominios de vercel.app.
  if (requestUrl) {
    try {
      return new URL(origin).origin === new URL(requestUrl).origin;
    } catch {
      return false;
    }
  }

  return false;
}

export function withCors(
  request: Request,
  response: Response,
  policy: CorsPolicy,
): Response {
  const headers = new Headers(response.headers);
  const vary = (headers.get("Vary") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!vary.some((value) => value.toLowerCase() === "origin")) {
    vary.push("Origin");
  }
  headers.set("Vary", vary.join(", "));

  const origin = request.headers.get("Origin");
  if (origin && isAllowedApiOrigin(origin, request.url)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", policy.methods.join(", "));
    headers.set("Access-Control-Allow-Headers", policy.headers.join(", "));
  }

  // Conserva status, body y cabeceras originales, incluso para errores.
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function createPreflightResponse(
  request: Request,
  policy: CorsPolicy,
): Response {
  const origin = request.headers.get("Origin");
  const requestedMethod = request.headers.get("Access-Control-Request-Method");
  const requestedHeaders = (
    request.headers.get("Access-Control-Request-Headers") || ""
  )
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const allowed =
    origin !== null &&
    isAllowedApiOrigin(origin, request.url) &&
    requestedMethod !== null &&
    policy.methods.includes(requestedMethod) &&
    requestedHeaders.every((header) =>
      policy.headers.some((allowedHeader) =>
        allowedHeader.toLowerCase() === header
      )
    );

  return withCors(
    request,
    new Response(null, { status: allowed ? 204 : 403 }),
    policy,
  );
}
