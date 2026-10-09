import { describe, expect, it } from "vitest";
import { OPTIONS as aiOptions } from "../../api/ai";
import { OPTIONS as contactOptions } from "../../api/contact";
import { OPTIONS as paymentOptions } from "../../api/verify-payment";

const origin = "https://interactive-decox-875051-3b397.web.app";
const customOrigin = "https://interactive.chalamandramagistral.com";

const routes = [
  {
    name: "IA",
    url: "https://interactive-decox-one.vercel.app/api/ai",
    handler: aiOptions,
    method: "POST",
    headers: "content-type",
  },
  {
    name: "contacto",
    url: "https://interactive-decox-one.vercel.app/api/contact",
    handler: contactOptions,
    method: "POST",
    headers: "content-type",
  },
  {
    name: "verificación de pago",
    url: "https://interactive-decox-one.vercel.app/api/verify-payment",
    handler: paymentOptions,
    method: "GET",
    headers: "accept",
  },
];

describe("Preflight de las rutas Vercel", () => {
  it.each(routes)("$name acepta el origen Firebase permitido", ({
    url, handler, method, headers,
  }) => {
    const request = new Request(url, {
      method: "OPTIONS",
      headers: {
        Origin: origin,
        "Access-Control-Request-Method": method,
        "Access-Control-Request-Headers": headers,
      },
    });

    const response = handler(request);
    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(origin);
    expect(response.headers.get("Vary")).toContain("Origin");
  });

  it.each(routes)("$name acepta el dominio personalizado", ({
    url, handler, method, headers,
  }) => {
    const request = new Request(url, {
      method: "OPTIONS",
      headers: {
        Origin: customOrigin,
        "Access-Control-Request-Method": method,
        "Access-Control-Request-Headers": headers,
      },
    });

    const response = handler(request);
    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin"))
      .toBe(customOrigin);
    expect(response.headers.get("Vary")).toContain("Origin");
  });

  it.each(routes)("$name rechaza un origen no permitido", ({
    url, handler, method, headers,
  }) => {
    const request = new Request(url, {
      method: "OPTIONS",
      headers: {
        Origin: "https://attacker.invalid",
        "Access-Control-Request-Method": method,
        "Access-Control-Request-Headers": headers,
      },
    });

    const response = handler(request);
    expect(response.status).toBe(403);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });
});
