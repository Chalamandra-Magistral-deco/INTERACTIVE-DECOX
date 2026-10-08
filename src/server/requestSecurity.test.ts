import { describe, expect, it } from "vitest";

import {
  enforceRateLimit,
  enforceSameOrigin,
  readJsonBody,
} from "./requestSecurity";

describe("request security", () => {
  it("rejects missing or foreign origins", () => {
    const missing = enforceSameOrigin(
      new Request("https://example.com/api/ai", { method: "POST" }),
    );
    expect(missing?.status).toBe(403);

    const foreign = enforceSameOrigin(
      new Request("https://example.com/api/ai", {
        method: "POST",
        headers: { origin: "https://attacker.example" },
      }),
    );
    expect(foreign?.status).toBe(403);

    const sameOrigin = enforceSameOrigin(
      new Request("https://example.com/api/ai", {
        method: "POST",
        headers: { origin: "https://example.com" },
      }),
    );
    expect(sameOrigin).toBeNull();
  });

  it("limits repeated requests within the same window", () => {
    const first = enforceRateLimit(
      new Request("https://example.com/api/ai", {
        method: "POST",
        headers: {
          origin: "https://example.com",
          "x-forwarded-for": "203.0.113.10",
        },
      }),
      "test-rate-limit",
      2,
      60_000,
    );
    const second = enforceRateLimit(
      new Request("https://example.com/api/ai", {
        method: "POST",
        headers: {
          origin: "https://example.com",
          "x-forwarded-for": "203.0.113.10",
        },
      }),
      "test-rate-limit",
      2,
      60_000,
    );
    const third = enforceRateLimit(
      new Request("https://example.com/api/ai", {
        method: "POST",
        headers: {
          origin: "https://example.com",
          "x-forwarded-for": "203.0.113.10",
        },
      }),
      "test-rate-limit",
      2,
      60_000,
    );

    expect(first).toBeNull();
    expect(second).toBeNull();
    expect(third?.status).toBe(429);
  });

  it("rejects oversized bodies before JSON parsing", async () => {
    const response = await readJsonBody<{ value: string }>(
      new Request("https://example.com/api/ai", {
        method: "POST",
        body: JSON.stringify({ value: "abcdefghij" }),
        headers: { "content-type": "application/json" },
      }),
      8,
    );

    expect("error" in response).toBe(true);
    if ("error" in response) {
      expect(response.error.status).toBe(413);
    }
  });
});
