// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  createPreflightResponse,
  isAllowedApiOrigin,
  withCors,
  type CorsPolicy,
} from "./cors";

const firebaseOrigin =
  "https://interactive-decox-875051-3b397.web.app";

const policy: CorsPolicy = {
  methods: ["POST", "OPTIONS"],
  headers: ["Content-Type"],
};

describe("API CORS policy", () => {
  it("allows the configured Firebase and development origins", () => {
    expect(isAllowedApiOrigin(firebaseOrigin)).toBe(true);
    expect(isAllowedApiOrigin("http://localhost:5173")).toBe(true);
  });

  it("rejects origins not on the allowlist", () => {
    expect(isAllowedApiOrigin("https://attacker.invalid")).toBe(false);
  });

  it("allows only the exact same-origin Vercel deployment", () => {
    expect(
      isAllowedApiOrigin(
        "https://interactive-decox-preview.vercel.app",
        "https://interactive-decox-preview.vercel.app/api/ai",
      ),
    ).toBe(true);

    expect(
      isAllowedApiOrigin(
        "https://attacker.invalid",
        "https://interactive-decox-one.vercel.app/api/ai",
      ),
    ).toBe(false);
  });

  it("adds the exact origin and Vary to successful responses", async () => {
    const request = new Request("https://interactive-decox-one.vercel.app/api/ai", {
      headers: { Origin: firebaseOrigin },
    });
    const response = withCors(
      request,
      new Response("ok", { status: 200 }),
      policy,
    );

    expect(response.headers.get("Access-Control-Allow-Origin"))
      .toBe(firebaseOrigin);
    expect(response.headers.get("Vary")).toContain("Origin");
    expect(await response.text()).toBe("ok");
  });

  it("keeps CORS headers on errors for allowed origins", () => {
    const request = new Request("https://interactive-decox-one.vercel.app/api/ai", {
      headers: { Origin: firebaseOrigin },
    });
    const response = withCors(
      request,
      new Response('{"error":"unavailable"}', { status: 503 }),
      policy,
    );

    expect(response.status).toBe(503);
    expect(response.headers.get("Access-Control-Allow-Origin"))
      .toBe(firebaseOrigin);
    expect(response.headers.get("Vary")).toContain("Origin");
  });

  it("does not grant access to a disallowed origin", () => {
    const request = new Request("https://interactive-decox-one.vercel.app/api/ai", {
      headers: { Origin: "https://attacker.invalid" },
    });
    const response = withCors(
      request,
      new Response("forbidden", { status: 403 }),
      policy,
    );

    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
    expect(response.headers.get("Vary")).toContain("Origin");
  });

  it("accepts a valid JSON POST preflight", () => {
    const request = new Request("https://interactive-decox-one.vercel.app/api/ai", {
      method: "OPTIONS",
      headers: {
        Origin: firebaseOrigin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
      },
    });
    const response = createPreflightResponse(request, policy);

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin"))
      .toBe(firebaseOrigin);
    expect(response.headers.get("Access-Control-Allow-Methods"))
      .toContain("POST");
  });

  it("rejects a preflight requesting an unapproved header", () => {
    const request = new Request("https://interactive-decox-one.vercel.app/api/ai", {
      method: "OPTIONS",
      headers: {
        Origin: firebaseOrigin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "x-unapproved-header",
      },
    });

    expect(createPreflightResponse(request, policy).status).toBe(403);
  });

  it("rejects a preflight from an unapproved origin", () => {
    const request = new Request("https://interactive-decox-one.vercel.app/api/ai", {
      method: "OPTIONS",
      headers: {
        Origin: "https://attacker.invalid",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
      },
    });
    const response = createPreflightResponse(request, policy);

    expect(response.status).toBe(403);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });
});
