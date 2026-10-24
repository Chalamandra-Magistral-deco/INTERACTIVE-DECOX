import React from "react";
import { DISCOVERY_APP_URL, PAYMENT_LINKS } from "@/config/public";
import { T } from "@/core/Telemetry";

interface PremiumServicesProps {
  onServiceClick: (service: "discovery") => void;
  playUIClick: () => void;
}

const PurchaseLink: React.FC<{
  href: string;
  className: string;
  children: React.ReactNode;
  disabledLabel: string;
  disabledReason: string;
}> = ({ href, className, children, disabledLabel, disabledReason }) => {
  if (!href) {
    return (
      <span
        className="block w-full rounded-lg bg-yellow-500 py-3 font-black text-black opacity-50 cursor-not-allowed"
        aria-disabled="true"
        title={disabledReason}
      >
        {disabledLabel}
      </span>
    );
  }

  const handlePurchaseClick = () => {
    T.service.click("discovery");
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "cta_purchase_click",
        service: "discovery",
        sub: window.location.hostname.split(".")[0],
      });
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handlePurchaseClick}
    >
      {children}
    </a>
  );
};

const PremiumServices: React.FC<PremiumServicesProps> = ({
  onServiceClick,
  playUIClick,
}) => {
  return (
    <section className="bg-gradient-to-t from-black via-gray-900 to-black px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-center text-4xl font-black text-white">
          <i className="fa-solid fa-rocket mr-3" />
          SERVICIOS PREMIUM
        </h2>

        <p className="mb-12 text-center text-xl font-semibold text-gray-300">
          Acelera tu evolución con una intervención directa.
        </p>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-1">
          <div className="flex flex-col rounded-2xl border border-gray-700 bg-gray-800 p-8 text-center">
            <h3 className="mb-4 text-3xl font-bold text-yellow-300">
              Sesión Descubrimiento
            </h3>
            <p className="mb-4 text-5xl font-black text-white">
              $27 <span className="text-lg font-semibold text-gray-400">USD</span>
            </p>
            <p className="flex-grow text-gray-300">
              Un diagnóstico autoguiado en cinco fases: Explorar, Decodificar,
              Aplicar un Hack oficial, Orientar con SRAP y cerrar con una Ruta Inicial.
              Incluye informe ejecutivo descargable en PDF/A4 y JSON.
            </p>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => {
                  playUIClick();
                  T.service.view("discovery");
                  onServiceClick("discovery");
                }}
                className="w-full rounded-lg bg-white/10 py-3 font-bold text-white transition-colors hover:bg-white/20"
              >
                Saber Más
              </button>

              <PurchaseLink
                href={PAYMENT_LINKS.discovery && DISCOVERY_APP_URL ? PAYMENT_LINKS.discovery : ""}
                disabledLabel={
                  !PAYMENT_LINKS.discovery
                    ? "CHECKOUT PENDIENTE DE CONFIGURACIÓN"
                    : "ENTREGA INTERACTIVA PENDIENTE"
                }
                disabledReason={
                  !PAYMENT_LINKS.discovery
                    ? "Checkout pendiente de configuración"
                    : "Configura VITE_DISCOVERY_APP_URL después de desplegar y verificar la aplicación entregable"
                }
                className="block w-full rounded-lg bg-yellow-500 py-3 font-black text-black shadow-lg transition-colors hover:bg-yellow-400"
              >
                ADQUIRIR AHORA
              </PurchaseLink>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PremiumServices;
