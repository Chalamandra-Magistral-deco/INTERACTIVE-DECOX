import { describe, expect, it } from "vitest";
import { isJsonObject, readJsonBody } from "./json";

describe("readJsonBody", () => {
  it("parses a JSON object within the byte limit", async () => {
    const request = new Request("https://example.test", {
      method: "POST",
      body: JSON.stringify({ name: "Ada" }),
    });

    await expect(readJsonBody(request, 100)).resolves.toEqual({
      ok: true,
      value: { name: "Ada" },
    });
  });

  it("rejects an oversized body even without a content-length header", async () => {
    const request = new Request("https://example.test", {
      method: "POST",
      body: JSON.stringify({ value: "x".repeat(20) }),
    });

    await expect(readJsonBody(request, 10)).resolves.toEqual({
      ok: false,
      reason: "too_large",
    });
  });

  it("rejects malformed JSON", async () => {
    const request = new Request("https://example.test", {
      method: "POST",
      body: "{",
    });

    await expect(readJsonBody(request, 10)).resolves.toEqual({
      ok: false,
      reason: "invalid",
    });
  });
});

describe("isJsonObject", () => {
  it("rejects null, arrays, and primitives", () => {
    expect(isJsonObject(null)).toBe(false);
    expect(isJsonObject([])).toBe(false);
    expect(isJsonObject("value")).toBe(false);
  });
});
