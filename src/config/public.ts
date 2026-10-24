/**
 * Public runtime configuration.
 *
 * Only non-secret values belong here. Vite exposes VITE_* variables to the
 * browser, so Stripe/Gemini private keys must never be placed in this module.
 */

export const PAYMENT_LINKS = {
  discovery: import.meta.env.VITE_STRIPE_DISCOVERY_URL?.trim() || "",
} as const;

/**
 * Public destination of the separately deployed Discovery Session app.
 * Vite values are public: never put payment or API secrets here.
 */
const discoveryAppCandidate = import.meta.env.VITE_DISCOVERY_APP_URL?.trim() || "";
export const DISCOVERY_APP_URL = /^https:\/\//i.test(discoveryAppCandidate)
  ? discoveryAppCandidate
  : "";

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
