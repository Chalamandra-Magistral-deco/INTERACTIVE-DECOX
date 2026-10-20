/**
 * Canonical corporate destinations for the Chalamandra Magistral ecosystem.
 * Keep campaign parameters consistent so referrals from Interactive DecoX can
 * be measured without scattering raw company URLs across components.
 */
export const COMPANY_HOME_URL = "https://www.chalamandramagistral.com/";
const COMPANY_CONTACT_URL = "https://www.chalamandramagistral.com/contact.html";

export type CorporatePlacement = "nav" | "hero" | "services" | "footer";

export const getCompanyContactUrl = (placement: CorporatePlacement): string => {
  const url = new URL(COMPANY_CONTACT_URL);
  url.searchParams.set("interes", "consultoria-b2b");
  url.searchParams.set("utm_source", "interactive");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "entrega_1_consolidacion_comercial");
  url.searchParams.set("utm_content", placement);
  return url.toString();
};
