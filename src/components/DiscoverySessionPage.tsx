import React, { useEffect, useRef } from "react";
import { DISCOVERY_APP_URL, PAYMENT_LINKS } from "@/config/public";

const DiscoverySessionPage: React.FC = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 },
    );

    const elements = componentRef.current?.querySelectorAll(".reveal-on-scroll");
    elements?.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={componentRef} className="space-y-12 pb-12">
      <div className="reveal-on-scroll grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: "01 · Explorar",
            icon: "fa-magnifying-glass",
            desc: "Define el objetivo, la situación observable, la fricción y las restricciones reales.",
          },
          {
            title: "02 · Decodificar",
            icon: "fa-code-branch",
            desc: "Distingue patrones, hipótesis, incentivos e incertidumbres que necesitan evidencia.",
          },
          {
            title: "03 · Aplicar un Hack",
            icon: "fa-wand-magic-sparkles",
            desc: "Selecciona un Hack oficial y completa su plantilla metodológica aplicada a tu caso.",
          },
          {
            title: "04 · Orientar con SRAP",
            icon: "fa-compass",
            desc: "Conecta las condiciones reales, el patrón reconocido, la acción inmediata y el criterio de pausa.",
          },
          {
            title: "05 · Ruta Inicial",
            icon: "fa-route",
            desc: "Cierra con un informe ejecutivo descargable en PDF/A4 y JSON.",
          },
        ].map((step, index) => (
          <div
            key={step.title}
            className="reveal-on-scroll rounded-2xl border border-gray-700 bg-gray-800/50 p-6 text-center"
            style={{ transitionDelay: `${index * 0.15}s` }}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/20 text-xl text-yellow-300">
              <i className={`fa-solid ${step.icon}`} />
            </div>
            <h3 className="mb-3 text-lg font-black text-white">{step.title}</h3>
            <p className="text-sm leading-relaxed text-gray-400">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="reveal-on-scroll rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-center shadow-2xl">
        <h3 className="mb-4 text-2xl font-black text-white">
          ¿Qué obtienes?
        </h3>
        <p className="mx-auto max-w-2xl leading-relaxed text-gray-300">
          Una experiencia autoguiada de cinco fases para Personas u Organizaciones.
          La síntesis local funciona sin depender obligatoriamente de una llamada de IA;
          el resultado es una Ruta Inicial fundamentada en tus respuestas, con exportación
          del informe ejecutivo en PDF/A4 y JSON.
        </p>
      </div>

      <div className="reveal-on-scroll space-y-6 text-center">
        <div>
          <p className="mb-3 text-sm uppercase tracking-widest text-gray-500">
            Inversión
          </p>
          <p className="mb-6 text-6xl font-black text-white">
            $27 <span className="text-xl text-gray-400">USD</span>
          </p>

          {PAYMENT_LINKS.discovery && DISCOVERY_APP_URL ? (
            <a
              href={PAYMENT_LINKS.discovery}
              target="_blank"
              rel="noopener noreferrer"
              className="pulse-glow inline-block rounded-2xl bg-yellow-500 px-10 py-5 text-lg font-black text-black shadow-[0_0_50px_rgba(234,179,8,0.3)] transition-all hover:scale-105"
            >
              ADQUIRIR SESIÓN
            </a>
          ) : (
            <span
              className="inline-block cursor-not-allowed rounded-2xl bg-yellow-500 px-10 py-5 text-lg font-black text-black opacity-40"
              aria-disabled="true"
              title={
                !PAYMENT_LINKS.discovery
                  ? "Checkout pendiente de configuración"
                  : "Configura VITE_DISCOVERY_APP_URL después de desplegar y verificar la aplicación"
              }
            >
              {!PAYMENT_LINKS.discovery
                ? "CHECKOUT PENDIENTE DE CONFIGURACIÓN"
                : "ENTREGA INTERACTIVA PENDIENTE"}
            </span>
          )}
          <p className="mt-5 text-xs text-gray-500">
            La compra se habilitará cuando el checkout y la URL pública de entrega estén configurados.
            Después de verificar el pago, podrás abrir la experiencia de cinco fases y descargar el informe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiscoverySessionPage;
