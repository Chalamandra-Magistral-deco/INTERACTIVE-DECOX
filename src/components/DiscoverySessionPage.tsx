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
    <div ref={componentRef} className="space-y-16 pb-12">
      <div className="space-y-6 text-center">
        <h2 className="reveal-on-scroll text-4xl font-black tracking-tighter text-yellow-300 md:text-6xl">
          KIT DE AUTO-DECODIFICACIÓN
        </h2>
        <p className="reveal-on-scroll mx-auto max-w-3xl text-2xl font-bold leading-tight text-white md:text-3xl">
          Desmantela tu inercia y activa tu{" "}
          <span className="text-green-400">Ventaja Injusta</span> con las
          herramientas para entender tu Sistema Operativo.
        </p>
      </div>

      <div className="reveal-on-scroll grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-2xl font-black uppercase tracking-widest text-red-400">
            El Síntoma:
          </h3>
          <p className="text-lg leading-relaxed text-gray-300">
            Sientes que estás operando al 20% de tu capacidad. Tienes las
            herramientas, pero tu "Sistema Operativo" está lleno de patrones
            que no puedes ver con claridad.
          </p>
        </div>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 italic text-red-200">
          "La mayoría de las personas no fracasan por falta de talento, sino
          por operar bajo un mapa de la realidad que ya no existe."
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="reveal-on-scroll text-center text-3xl font-black text-white">
          LA METODOLOGÍA DEL KIT
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              title: "DIAGNÓSTICO",
              icon: "fa-magnifying-glass-chart",
              desc: "Escanea sesgos y detecta tu arquetipo dominante.",
            },
            {
              title: "DECODIFICACIÓN",
              icon: "fa-code-branch",
              desc: "Identifica el código muerto en tu toma de decisiones.",
            },
            {
              title: "ACTIVACIÓN",
              icon: "fa-bolt-lightning",
              desc: "Selecciona tu primer Hack Magistral para ejecución inmediata.",
            },
          ].map((step, index) => (
            <div
              key={step.title}
              className="reveal-on-scroll rounded-2xl border border-gray-700 bg-gray-800/50 p-6 text-center"
              style={{ transitionDelay: `${index * 0.2}s` }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20 text-2xl text-yellow-400">
                <i className={`fa-solid ${step.icon}`} />
              </div>
              <h4 className="mb-2 font-black text-white">{step.title}</h4>
              <p className="text-sm text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="reveal-on-scroll rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-2xl">
        <h4 className="mb-8 flex items-center text-2xl font-black text-green-400">
          <i className="fa-solid fa-box-open mr-4" />
          CONTENIDO DEL KIT:
        </h4>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              title: "Manual de Arquetipos (PDF)",
              desc: "Reporte con fortalezas y sombras cognitivas.",
            },
            {
              title: "Guía de Autodiagnóstico Táctico",
              desc: "Workbook para identificar tus 3 hacks prioritarios.",
            },
            {
              title: "Audio-Guía de Decodificación",
              desc: "Guía en audio para entender los principios clave.",
            },
            {
              title: "Protocolo de Activación Inicial",
              desc: "Tu primer hack explicado paso a paso.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start space-x-4 rounded-xl bg-black/20 p-4"
            >
              <i className="fa-solid fa-circle-check mt-1 text-green-500" />
              <div>
                <h5 className="font-bold text-white">{item.title}</h5>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="reveal-on-scroll space-y-8 text-center">
        <div>
          <p className="mb-4 text-sm uppercase tracking-widest text-gray-500">
            Inversión
          </p>
          <p className="mb-6 text-6xl font-black text-white">
            $27 <span className="text-xl text-gray-400">USD</span>
          </p>

          {PAYMENT_LINKS.discovery ? (
            <a
              href={PAYMENT_LINKS.discovery}
              target="_blank"
              rel="noopener noreferrer"
              className="pulse-glow inline-block rounded-2xl bg-yellow-500 px-12 py-5 text-xl font-black text-black shadow-[0_0_50px_rgba(234,179,8,0.3)] transition-all hover:scale-105"
            >
              OBTENER ACCESO AHORA
            </a>
          ) : (
            <span className="inline-block cursor-not-allowed rounded-2xl bg-yellow-500 px-12 py-5 text-xl font-black text-black opacity-40">
              CHECKOUT PENDIENTE DE CONFIGURACIÓN
            </span>
          )}

          <p className="mt-6 text-xs text-gray-500">
            El acceso y/o agenda se habilita mediante el checkout configurado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiscoverySessionPage;
