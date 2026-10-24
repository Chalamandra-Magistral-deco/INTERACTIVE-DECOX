import React, { useEffect, useRef } from "react";
import { PAYMENT_LINKS } from "@/config/public";

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
      <div className="space-y-6 text-center">
        <p className="reveal-on-scroll text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">
          Chalamandra Magistral DecoX
        </p>
        <h2 className="reveal-on-scroll text-4xl font-black tracking-tighter text-white md:text-6xl">
          SESIÓN DE DESCUBRIMIENTO
        </h2>
        <p className="reveal-on-scroll mx-auto max-w-3xl text-xl font-semibold leading-relaxed text-gray-300 md:text-2xl">
          Una sesión individual de 90 minutos para entender tu situación,
          identificar el punto crítico y definir una ruta inicial de acción.
        </p>
      </div>

      <div className="reveal-on-scroll grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            title: "01 · Explorar",
            icon: "fa-magnifying-glass",
            desc: "Aclaramos tu contexto, objetivo y el problema que necesitas resolver.",
          },
          {
            title: "02 · Decodificar",
            icon: "fa-code-branch",
            desc: "Analizamos patrones, restricciones y el nodo que merece atención prioritaria.",
          },
          {
            title: "03 · Orientar",
            icon: "fa-route",
            desc: "Definimos próximos pasos y una ruta inicial coherente con tu situación.",
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
          Claridad sobre el problema que estás abordando, una lectura
          estructurada de los factores relevantes y próximos pasos para decidir
          cómo avanzar. La sesión se enfoca en tu caso concreto.
        </p>
      </div>

      <div className="reveal-on-scroll space-y-6 text-center">
        <div>
          <p className="mb-3 text-sm uppercase tracking-widest text-gray-500">
            Inversión · 90 minutos
          </p>
          <p className="mb-6 text-6xl font-black text-white">
            $27 <span className="text-xl text-gray-400">USD</span>
          </p>

          {PAYMENT_LINKS.discovery ? (
            <a
              href={PAYMENT_LINKS.discovery}
              target="_blank"
              rel="noopener noreferrer"
              className="pulse-glow inline-block rounded-2xl bg-yellow-500 px-10 py-5 text-lg font-black text-black shadow-[0_0_50px_rgba(234,179,8,0.3)] transition-all hover:scale-105"
            >
              ADQUIRIR SESIÓN
            </a>
          ) : (
            <span className="inline-block cursor-not-allowed rounded-2xl bg-yellow-500 px-10 py-5 text-lg font-black text-black opacity-40">
              CHECKOUT PENDIENTE DE CONFIGURACIÓN
            </span>
          )}
          <p className="mt-5 text-xs text-gray-500">
            Tras confirmar el pago podrás continuar con la agenda de tu sesión.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiscoverySessionPage;
