/**
 * Public runtime configuration.
 *
 * Only non-secret values belong here. Vite exposes VITE_* variables to the
 * browser, so Stripe/Gemini private keys must never be placed in this module.
 */

export const PAYMENT_LINKS = {
  discovery: import.meta.env.VITE_STRIPE_DISCOVERY_URL?.trim() || "",
} as const;

const configuredDiscoveryAppUrl = import.meta.env.VITE_DISCOVERY_APP_URL?.trim() || "";
export const DISCOVERY_APP_URL = (() => {
  if (!configuredDiscoveryAppUrl) return "";
  try {
    const parsed = new URL(configuredDiscoveryAppUrl);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? configuredDiscoveryAppUrl
      : "";
  } catch {
    return "";
  }
})();

export const WHATSAPP = {
  number: import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, "") || "",
  message: import.meta.env.VITE_WHATSAPP_MESSAGE?.trim() || "",
} as const;

export const getWhatsAppUrl = (): string | null => {
  if (!WHATSAPP.number) return null;

  const query = WHATSAPP.message
    ? `?text=${encodeURIComponent(WHATSAPP.message)}`
    : "";

  return `https://wa.me/${WHATSAPP.number}${query}`;
};
