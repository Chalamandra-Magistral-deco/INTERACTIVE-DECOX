import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./stripe-webhook";

const TEST_SECRET = "whsec_test_only";

let previousSecret: string | undefined;
let previousFulfillmentUrl: string | undefined;

function signedRequest(
  event: Record<string, unknown>,
  secret = TEST_SECRET,
): Request {
  const payload = JSON.stringify(event);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  return new Request("https://example.test/api/stripe-webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "stripe-signature": `t=${timestamp},v1=${signature}`,
    },
    body: payload,
  });
}

const checkoutEvent = (type = "checkout.session.completed") => ({
  id: "evt_test_checkout_123",
  type,
  data: {
    object: {
      id: "cs_test_session_123",
      payment_status: "paid",
    },
  },
});

beforeEach(() => {
  previousSecret = process.env.STRIPE_WEBHOOK_SECRET;
  previousFulfillmentUrl = process.env.PURCHASE_EVENT_WEBHOOK_URL;
  process.env.STRIPE_WEBHOOK_SECRET = TEST_SECRET;
  delete process.env.PURCHASE_EVENT_WEBHOOK_URL;
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  if (previousSecret === undefined) {
    delete process.env.STRIPE_WEBHOOK_SECRET;
  } else {
    process.env.STRIPE_WEBHOOK_SECRET = previousSecret;
  }

  if (previousFulfillmentUrl === undefined) {
    delete process.env.PURCHASE_EVENT_WEBHOOK_URL;
  } else {
    process.env.PURCHASE_EVENT_WEBHOOK_URL = previousFulfillmentUrl;
  }

  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/stripe-webhook", () => {
  it("does not acknowledge a purchase when durable fulfillment is not configured", async () => {
    const response = await POST(signedRequest(checkoutEvent()));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: "Purchase fulfillment is not configured",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns a retryable error when downstream fulfillment fails", async () => {
    process.env.PURCHASE_EVENT_WEBHOOK_URL = "https://fulfillment.example.test/events";
    vi.mocked(fetch).mockResolvedValue(new Response("unavailable", { status: 503 }));

    const response = await POST(signedRequest(checkoutEvent()));

    expect(response.status).toBe(502);
    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(
      "https://fulfillment.example.test/events",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "idempotency-key": "evt_test_checkout_123",
        }),
      }),
    );
  });

  it("acknowledges a purchase only after downstream fulfillment succeeds", async () => {
    process.env.PURCHASE_EVENT_WEBHOOK_URL = "https://fulfillment.example.test/events";
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));

    const response = await POST(signedRequest(checkoutEvent()));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });
  });

  it("acknowledges unrelated verified events without calling purchase fulfillment", async () => {
    const response = await POST(
      signedRequest({ id: "evt_test_unrelated", type: "customer.updated" }),
    );

    expect(response.status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects requests without a valid Stripe signature", async () => {
    const request = new Request("https://example.test/api/stripe-webhook", {
      method: "POST",
      body: JSON.stringify(checkoutEvent()),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });
});
