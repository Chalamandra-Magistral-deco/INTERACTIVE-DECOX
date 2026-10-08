import React from "react";
import { PAYMENT_LINKS } from "@/config/public";

interface PremiumServicesProps {
  onServiceClick: (service: "discovery" | "magistral") => void;
  playUIClick: () => void;
}

const PurchaseLink: React.FC<{
  href: string;
  className: string;
  children: React.ReactNode;
}> = ({ href, className, children }) => {
  if (!href) {
    return (
      <span
        className={`${className} cursor-not-allowed opacity-40`}
        aria-disabled="true"
        title="Checkout pendiente de configuración"
      >
        Checkout no configurado
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
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

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-gray-700 bg-gray-800 p-8 text-center">
            <h3 className="mb-4 text-3xl font-bold text-yellow-300">
              Sesión Descubrimiento
            </h3>
            <p className="mb-4 text-5xl font-black text-white">
              $27 <span className="text-lg font-semibold text-gray-400">USD</span>
            </p>
            <p className="flex-grow text-gray-300">
              Una inmersión de 90 minutos para diagnosticar tu arquetipo y
              trazar tu mapa de ruta inicial.
            </p>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => {
                  playUIClick();
                  onServiceClick("discovery");
                }}
                className="w-full rounded-lg bg-white/10 py-3 font-bold text-white transition-colors hover:bg-white/20"
              >
                Saber Más
              </button>

              <PurchaseLink
                href={PAYMENT_LINKS.discovery}
                className="block w-full rounded-lg bg-yellow-500 py-3 font-black text-black shadow-lg transition-colors hover:bg-yellow-400"
              >
                ADQUIRIR AHORA
              </PurchaseLink>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border-2 border-purple-500 bg-gray-800 p-8 text-center shadow-2xl shadow-purple-500/30">
            <h3 className="mb-4 text-3xl font-bold text-purple-300">
              Kit Magistral
            </h3>
            <p className="mb-4 text-5xl font-black text-white">
              $397 <span className="text-lg font-semibold text-gray-400">USD</span>
            </p>
            <p className="flex-grow text-gray-300">
              Un mes de implementación intensiva. 4 sesiones para instalar
              tus hacks fundamentales y soporte directo.
            </p>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => {
                  playUIClick();
                  onServiceClick("magistral");
                }}
                className="w-full rounded-lg bg-white/10 py-3 font-bold text-white transition-colors hover:bg-white/20"
              >
                Saber Más
              </button>

              <PurchaseLink
                href={PAYMENT_LINKS.magistral}
                className="block w-full rounded-lg bg-purple-600 py-3 font-black text-white shadow-lg transition-colors hover:bg-purple-500"
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
