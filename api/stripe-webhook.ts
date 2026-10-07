import { createHmac, timingSafeEqual } from "node:crypto";

const json = (body: Record<string, unknown>, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const verifySignature = (payload: string, signature: string, secret: string): boolean => {
  const values = signature.split(",");
  const timestamp = values.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = values
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));

  if (!timestamp || signatures.length === 0) return false;

  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds)) return false;

  const age = Math.abs(Date.now() / 1000 - timestampSeconds);
  if (age > 300) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  return signatures.some((candidate) => {
    const left = Buffer.from(candidate, "utf8");
    const right = Buffer.from(expected, "utf8");
    return left.length === right.length && timingSafeEqual(left, right);
  });
};

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return json({ error: "Webhook is not configured" }, 503);
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return json({ error: "Missing Stripe signature" }, 400);
  }

  const payload = await request.text();
  if (!verifySignature(payload, signature, secret)) {
    return json({ error: "Invalid Stripe signature" }, 400);
  }

  let event: {
    type?: string;
    data?: { object?: { id?: string; payment_status?: string } };
  };

  try {
    event = JSON.parse(payload);
  } catch {
    return json({ error: "Invalid webhook JSON" }, 400);
  }

  const supported = new Set([
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
  ]);

  if (supported.has(event.type || "")) {
    const fulfillmentUrl = process.env.PURCHASE_EVENT_WEBHOOK_URL?.trim();

    if (fulfillmentUrl) {
      try {
        const fulfillmentResponse = await fetch(fulfillmentUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            event_type: event.type,
            session_id: event.data?.object?.id || null,
            payment_status: event.data?.object?.payment_status || null,
          }),
          signal: AbortSignal.timeout(3000),
        });

        if (!fulfillmentResponse.ok) {
          return json({ error: "Downstream fulfillment failed" }, 502);
        }
      } catch (error) {
        console.error(
          "Fulfillment provider error:",
          error instanceof Error ? error.message : "unknown",
        );
        return json({ error: "Downstream fulfillment failed" }, 502);
      }
    }
  }

  // Always acknowledge a verified Stripe event quickly. Durable fulfillment
  // belongs in the configured downstream system, not in the browser.
  return json({ received: true });
}
