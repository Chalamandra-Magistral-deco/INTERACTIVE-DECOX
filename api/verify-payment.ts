import { createPreflightResponse, isAllowedApiOrigin, withCors } from "../src/server/cors.js";
const PRICE_TO_SERVICE = {
  discovery: process.env.STRIPE_DISCOVERY_PRICE_ID?.trim() || "",
  magistral: process.env.STRIPE_MAGISTRAL_PRICE_ID?.trim() || "",
} as const;

const json = (body: Record<string, unknown>, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

async function handleGET(request: Request): Promise<Response> {
  if (!isAllowedApiOrigin(request.headers.get("origin"), request.url)) {
    return json({ error: "Forbidden origin" }, 403);
  }
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    return json({ error: "Payment verification is not configured" }, 503);
  }

  if (!PRICE_TO_SERVICE.discovery || !PRICE_TO_SERVICE.magistral) {
    return json({ error: "Stripe price mapping is not configured" }, 503);
  }

  const sessionId = new URL(request.url).searchParams.get("session_id")?.trim();
  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return json({ error: "Invalid checkout session" }, 400);
  }

  const stripeResponse = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand%5B%5D=line_items.data.price`,
    {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    },
  );

  if (!stripeResponse.ok) {
    return json({ error: "Unable to verify checkout session" }, 502);
  }

  const session = (await stripeResponse.json()) as {
    payment_status?: string;
    line_items?: {
      data?: Array<{
        price?: { id?: string | null } | null;
      }>;
    };
  };

  if (session.payment_status !== "paid") {
    return json({ verified: false }, 200);
  }

  const priceIds = new Set(
    (session.line_items?.data || [])
      .map((item) => item.price?.id)
      .filter((id): id is string => Boolean(id)),
  );

  const service = (Object.entries(PRICE_TO_SERVICE) as Array<
    [keyof typeof PRICE_TO_SERVICE, string]
  >).find(([, priceId]) => priceIds.has(priceId))?.[0];

  if (!service) {
    return json({ error: "Paid session does not match a configured service" }, 403);
  }

  return json({ verified: true, service });
}

const GET_CORS_POLICY = {
  methods: ["GET", "OPTIONS"],
  headers: ["Accept"],
} as const;

export async function GET(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return createPreflightResponse(request, GET_CORS_POLICY);
  }

  if (request.method !== "GET") {
    return withCors(
      request,
      json({ error: "Method not allowed" }, 405),
      GET_CORS_POLICY,
    );
  }

  return withCors(
    request,
    await handleGET(request),
    GET_CORS_POLICY,
  );
}

export function OPTIONS(request: Request): Response {
  return createPreflightResponse(request, GET_CORS_POLICY);
}
