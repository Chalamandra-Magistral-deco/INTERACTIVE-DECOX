import React from "react";
import { PAYMENT_LINKS } from "@/config/public";
import { COMPANY_HOME_URL, getCompanyContactUrl } from "@/config/corporateLinks";
import { T } from "@/core/Telemetry";

interface PremiumServicesProps {
  onServiceClick: (service: "discovery") => void;
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
        className={className + " cursor-not-allowed opacity-50"}
        aria-disabled="true"
        title="El enlace de pago aún no está configurado"
      >
        Pago aún no habilitado
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
  playUIClick,
}) => (
  <section id="servicios" className="scroll-mt-24 bg-gradient-to-b from-black via-gray-950 to-black px-6 py-20">
    <div className="mx-auto max-w-6xl">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-yellow-400">
          Siguiente paso
        </p>
        <h2 className="text-3xl font-black text-white md:text-4xl">
          Servicios y soluciones
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
          Empieza con una sesión individual o conversa con el equipo sobre la aplicación de la metodología en tu organización.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="flex flex-col rounded-3xl border border-yellow-400/40 bg-gradient-to-b from-yellow-400/[0.09] to-gray-950 p-7 shadow-2xl shadow-yellow-950/20 md:p-9">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
            Servicio individual
          </p>
          <h3 className="mb-4 text-2xl font-black text-white md:text-3xl">
            Sesión de Descubrimiento
          </h3>
          <p className="mb-5 text-4xl font-black text-white">
            $27 <span className="text-base font-bold text-gray-400">USD</span>
          </p>
          <p className="mb-6 leading-relaxed text-gray-300">
            Una experiencia web guiada más una sesión en vivo para explorar tu
            situación, clarificar el objetivo y definir próximos pasos.
          </p>
          <ul className="mb-8 space-y-2 text-sm text-gray-300">
            <li>✓ Recorrido web con rutas diferenciadas</li>
            <li>✓ Sesión en vivo</li>
            <li>✓ Síntesis del reto y próximos pasos iniciales</li>
          </ul>
          <div className="mt-auto space-y-3">
            <a
              href="/sesion-descubrimiento"
              onClick={() => {
                playUIClick();
                T.service.view("discovery");
              }}
              className="block w-full rounded-xl border border-white/15 bg-white/5 py-3 text-center font-bold text-white transition-colors hover:bg-white/10"
            >
              Ver detalles de la sesión
            </a>
            <PurchaseLink
              href={PAYMENT_LINKS.discovery}
              className="block w-full rounded-xl bg-yellow-400 py-3 text-center font-black text-black shadow-lg shadow-yellow-500/20 transition-colors hover:bg-yellow-300"
            >
              Reservar sesión
            </PurchaseLink>
          </div>
        </article>

        <article className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-9">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-gray-400">
            Empresas y equipos
          </p>
          <h3 className="mb-4 text-2xl font-black text-white md:text-3xl">
            Aplicación organizacional
          </h3>
          <p className="mb-6 leading-relaxed text-gray-300">
            ¿Quieres llevar estas metodologías a tu empresa? Comparte el contexto,
            los objetivos y el reto para conversar sobre el alcance adecuado.
          </p>
          <div className="mt-auto space-y-3">
            <a
              href={getCompanyContactUrl("services")}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl bg-white py-3 text-center font-black text-black transition-colors hover:bg-gray-200"
              onClick={() => {
                if (typeof window !== "undefined" && window.dataLayer) {
                  window.dataLayer.push({
                    event: "corporate_lead_click",
                    placement: "services",
                    destination: "chalamandramagistral_contact",
                  });
                }
              }}
            >
              Conversar con la empresa
            </a>
            <a
              href={COMPANY_HOME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl border border-white/15 px-5 py-3 text-center text-sm font-semibold text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              Conocer Chalamandra Magistral
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
);
export default PremiumServices;
