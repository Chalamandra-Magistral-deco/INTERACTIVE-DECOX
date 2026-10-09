import { afterEach, describe, expect, it, vi } from "vitest";
import { apiUrl } from "./api";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("apiUrl", () => {
  it("preserves relative API paths when no base is configured", () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    expect(apiUrl("/api/ai")).toBe("/api/ai");
  });

  it("normalizes trailing slashes in the configured base", () => {
    vi.stubEnv(
      "VITE_API_BASE_URL",
      " https://interactive-decox-one.vercel.app/// ",
    );
    expect(apiUrl("/api/contact")).toBe(
      "https://interactive-decox-one.vercel.app/api/contact",
    );
  });

  it("accepts paths without a leading slash", () => {
    vi.stubEnv(
      "VITE_API_BASE_URL",
      "https://interactive-decox-one.vercel.app/",
    );
    expect(apiUrl("api/ai")).toBe(
      "https://interactive-decox-one.vercel.app/api/ai",
    );
  });
});
