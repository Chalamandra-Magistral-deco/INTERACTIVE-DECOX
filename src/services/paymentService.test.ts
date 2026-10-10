import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyPaymentSession } from "./paymentService";

describe("verifyPaymentSession", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns the service only when the server confirms a verified payment", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ verified: true, service: "discovery" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyPaymentSession("cs_test_123")).resolves.toBe("discovery");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/verify-payment?session_id=cs_test_123",
      { headers: { accept: "application/json" } },
    );
  });

  it("never promotes an unverified session to a purchased service", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ verified: false }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyPaymentSession("cs_test_456")).resolves.toBeNull();
  });
  it("rejects a legacy Magistral service even if the response claims payment is verified", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ verified: true, service: "magistral" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(verifyPaymentSession("cs_test_789")).resolves.toBeNull();
  });
});
