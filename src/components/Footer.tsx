import React from "react";
import { COMPANY_HOME_URL, getCompanyContactUrl } from "@/config/corporateLinks";

const Footer: React.FC = () => (
  <footer className="border-t border-white/10 bg-gray-950 px-6 py-12">
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
      <div>
        <a
          href={COMPANY_HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-black tracking-wide text-white transition-colors hover:text-yellow-300"
        >
          Chalamandra Magistral
        </a>
        <p className="mt-2 text-sm text-gray-400">
          Interactive DecoX · Diagnóstico, práctica y acción estratégica.
        </p>
        <p className="mt-3 text-xs uppercase tracking-widest text-gray-600">
          © {new Date().getFullYear()} Chalamandra Magistral. Todos los derechos reservados.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 text-sm sm:flex-row">
        <a
          href={COMPANY_HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
        >
          Conocer la empresa
        </a>
        <a
          href={getCompanyContactUrl("footer")}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-white/15 px-5 py-3 font-bold text-white transition-colors hover:bg-white/5"
          onClick={() => {
            if (typeof window !== "undefined" && window.dataLayer) {
              window.dataLayer.push({
                event: "corporate_lead_click",
                placement: "footer",
                destination: "chalamandramagistral_contact",
              });
            }
          }}
        >
          Hablar con la empresa
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
