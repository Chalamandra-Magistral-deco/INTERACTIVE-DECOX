import React, { useEffect, useRef } from "react";
import { PAYMENT_LINKS } from "@/config/public";
import { getCompanyContactUrl } from "@/config/corporateLinks";

const DiscoverySessionPage: React.FC = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = componentRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

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

    root.querySelectorAll(".reveal-on-scroll").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={componentRef} className="space-y-12 pb-8">
      <div className="space-y-5 text-center">
        <p className="reveal-on-scroll text-xs font-black uppercase tracking-[0.22em] text-yellow-400">
          Servicio individual · 90 minutos
        </p>
        <h2 className="reveal-on-scroll text-4xl font-black tracking-tight text-white md:text-5xl">
          Sesión de Descubrimiento
        </h2>
        <p className="reveal-on-scroll mx-auto max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
          Un espacio guiado para entender tu punto de partida, clarificar tu
          objetivo y elegir los siguientes pasos.
        </p>
      </div>

      <div className="reveal-on-scroll grid grid-cols-1 gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="mb-3 text-sm font-black uppercase tracking-wider text-yellow-300">
            01 · Contexto
          </p>
          <h3 className="mb-2 text-lg font-bold text-white">Entender el reto</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Aclaramos qué estás intentando resolver y qué resultado necesitas.
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="mb-3 text-sm font-black uppercase tracking-wider text-yellow-300">
            02 · Diagnóstico
          </p>
          <h3 className="mb-2 text-lg font-bold text-white">Explorar patrones</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Revisamos el objetivo y los patrones relevantes para tu situación.
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="mb-3 text-sm font-black uppercase tracking-wider text-yellow-300">
            03 · Dirección
          </p>
          <h3 className="mb-2 text-lg font-bold text-white">Definir próximos pasos</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Trazamos una hoja de ruta inicial acorde con el objetivo conversado.
          </p>
        </article>
      </div>

      <div className="reveal-on-scroll mx-auto max-w-2xl rounded-3xl border border-yellow-400/25 bg-gradient-to-br from-yellow-400/[0.08] to-gray-900 p-7 text-center md:p-10">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-gray-400">
          Inversión por sesión
        </p>
        <p className="mb-6 text-5xl font-black text-white md:text-6xl">
          $27 <span className="text-xl font-bold text-gray-400">USD</span>
        </p>

        {PAYMENT_LINKS.discovery ? (
          <a
            href={PAYMENT_LINKS.discovery}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-xl bg-yellow-400 px-6 py-4 text-base font-black text-black shadow-lg shadow-yellow-500/20 transition-colors hover:bg-yellow-300 sm:w-auto"
          >
            Continuar a pago seguro
            <span aria-hidden="true" className="ml-2">↗</span>
          </a>
        ) : (
          <div className="space-y-4">
            <p className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300">
              El pago en línea aún no está habilitado. Puedes contactar al equipo para coordinar los siguientes pasos.
            </p>
            <a
              href={getCompanyContactUrl("services")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl bg-yellow-400 px-6 py-4 text-base font-black text-black transition-colors hover:bg-yellow-300 sm:w-auto"
            >
              Contactar a Chalamandra Magistral
              <span aria-hidden="true" className="ml-2">↗</span>
            </a>
          </div>
        )}

        <p className="mt-5 text-xs leading-relaxed text-gray-500">
          La sesión se enfoca en clarificar el objetivo y acordar una ruta inicial.
          No se promete un resultado específico antes de conocer tu contexto.
        </p>
      </div>
    </div>
  );
};

export default DiscoverySessionPage;
