/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_DISCOVERY_URL?: string;
  readonly VITE_STRIPE_MAGISTRAL_URL?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_WHATSAPP_MESSAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
