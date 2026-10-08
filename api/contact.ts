import {
  enforceRateLimit,
  enforceSameOrigin,
  readJsonBody,
} from "../src/server/requestSecurity";

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

export async function POST(request: Request): Promise<Response> {
  const originError = enforceSameOrigin(request);
  if (originError) return originError;

  const rateLimitError = enforceRateLimit(
    request,
    "contact",
    3,
    10 * 60_000,
  );
  if (rateLimitError) return rateLimitError;

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const destination = process.env.CONTACT_TO_EMAIL?.trim();
  const sender = process.env.CONTACT_FROM_EMAIL?.trim();

  if (!resendKey || !destination || !sender) {
    return json({ error: "Contact delivery is not configured" }, 503);
  }

  const parsedBody = await readJsonBody<Partial<ContactPayload>>(
    request,
    16_384,
  );
  if ("error" in parsedBody) return parsedBody.error;
  const body = parsedBody.data;

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

  const subject = `Nueva solicitud Chalamandra — ${contact.service || "General"}`;
  const text = [
    `Nombre: ${contact.name}`,
    `Email: ${contact.email}`,
    `Teléfono: ${contact.phone || "No proporcionado"}`,
    `Servicio: ${contact.service || "No especificado"}`,
    "",
    "Objetivo / fricción:",
    contact.objective,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [destination],
        reply_to: contact.email,
        subject,
        text,
      }),
    });

    if (!response.ok) {
      return json({ error: "Contact delivery failed" }, 502);
    }

    return json({ ok: true });
  } catch (error) {
    console.error(
      "Contact provider error:",
      error instanceof Error ? error.message : "unknown",
    );
    return json({ error: "Contact delivery failed" }, 502);
  }
}
