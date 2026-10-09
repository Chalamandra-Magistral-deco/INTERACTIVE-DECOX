// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../../api/contact";

const endpoint = "https://interactive-decox-one.vercel.app/api/contact";
const origin = "https://interactive-decox-875051-3b397.web.app";
const contact = {
  name: "Test User",
  email: "test@example.com",
  phone: "",
  objective: "A test objective",
  service: "Transformación Total",
  website: "",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Formspree contact route", () => {
  it("posts validated contact data to the configured form", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(new Request(endpoint, {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    }));

    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(origin);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://formspree.io/f/xbgdyjnk",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"email":"test@example.com"'),
      }),
    );
  });

  it("does not contact Formspree for a filled honeypot", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(new Request(endpoint, {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify({ ...contact, website: "spam" }),
    }));

    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects unapproved origins without contacting Formspree", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(new Request(endpoint, {
      method: "POST",
      headers: {
        Origin: "https://attacker.invalid",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    }));

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
