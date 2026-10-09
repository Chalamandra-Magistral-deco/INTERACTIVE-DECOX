import { createPreflightResponse, isAllowedApiOrigin, withCors } from "../src/server/cors.js";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  objective: string;
  service: string;
  website?: string;
};

const json = (body: Record<string, unknown>, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const clean = (value: unknown, maxLength: number): string =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

async function handlePOST(request: Request): Promise<Response> {
  if (!isAllowedApiOrigin(request.headers.get("origin"), request.url)) {
    return json({ error: "Forbidden origin" }, 403);
  }

  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const contact = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    objective: clean(body.objective, 2000),
    service: clean(body.service, 120),
    website: clean(body.website, 200),
  };

  if (contact.website) {
    return json({ ok: true });
  }

  if (
    contact.name.length < 2 ||
    !isValidEmail(contact.email) ||
    contact.objective.length < 5
  ) {
    return json({ error: "Please provide valid contact data" }, 400);
  }

  try {
    const response = await fetch("https://formspree.io/f/xbgdyjnk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...contact,
        _replyto: contact.email,
        _subject: `Nueva solicitud Chalamandra — ${contact.service || "General"}`,
      }),
    });

    if (!response.ok) {
      console.error("Formspree contact error:", response.status);
      return json({ error: "Contact delivery failed" }, 502);
    }

    return json({ ok: true });
  } catch (error) {
    console.error(
      "Formspree contact error:",
      error instanceof Error ? error.message : "unknown",
    );
    return json({ error: "Contact delivery failed" }, 502);
  }
}

const POST_CORS_POLICY = {
  methods: ["POST", "OPTIONS"],
  headers: ["Content-Type"],
} as const;

export async function POST(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return createPreflightResponse(request, POST_CORS_POLICY);
  }

  if (request.method !== "POST") {
    return withCors(
      request,
      json({ error: "Method not allowed" }, 405),
      POST_CORS_POLICY,
    );
  }

  return withCors(
    request,
    await handlePOST(request),
    POST_CORS_POLICY,
  );
}

export function OPTIONS(request: Request): Response {
  return createPreflightResponse(request, POST_CORS_POLICY);
}
