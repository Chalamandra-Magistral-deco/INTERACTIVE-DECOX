import React, { useState } from "react";
import { PAYMENT_LINKS } from "@/config/public";
import { getCompanyContactUrl } from "@/config/corporateLinks";

type Audience = "individual" | "organization";

const DiscoverySessionPage: React.FC = () => {
  const [audience, setAudience] = useState<Audience>("individual");

  const audienceOptions: Array<{
    id: Audience;
    eyebrow: string;
    title: string;
    description: string;
  }> = [
    {
      id: "individual",
      eyebrow: "Ruta individual",
      title: "Tengo una decisión, idea o problema",
      description:
        "Quiero entender mejor mi situación y definir un siguiente movimiento.",
    },
    {
      id: "organization",
      eyebrow: "Ruta organizacional",
      title: "Quiero trabajar un reto de empresa o equipo",
      description:
        "Necesito explorar cómo aplicar la metodología a un contexto organizacional.",
    },
  ];

  return (
    <div className="space-y-10">
      <section className="space-y-4 text-center">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-400">
          Experiencia web + sesión en vivo
        </p>
        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
          Sesión de Descubrimiento
        </h2>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300">
          Un espacio guiado para comprender el reto, detectar los factores que
          importan y elegir un siguiente paso con intención. No necesitas llegar
          con la solución; basta con traer la situación que quieres explorar.
        </p>
      </section>

      <section aria-labelledby="audience-heading" className="space-y-4">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">
            Elige tu recorrido
          </p>
          <h3 id="audience-heading" className="mt-2 text-xl font-bold text-white">
            ¿Qué quieres resolver?
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {audienceOptions.map((option) => {
            const selected = audience === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setAudience(option.id)}
                className={`rounded-2xl border p-6 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                  selected
                    ? "border-yellow-400/70 bg-yellow-400/[0.08]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25"
                }`}
              >
                <span className="text-xs font-black uppercase tracking-[0.16em] text-yellow-300">
                  {option.eyebrow}
                </span>
                <span className="mt-3 block text-lg font-black text-white">
                  {option.title}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-gray-400">
                  {option.description}
                </span>
                <span className="mt-5 block text-sm font-bold text-yellow-300">
                  {selected ? "Recorrido seleccionado ✓" : "Elegir este recorrido →"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {audience === "individual" ? (
        <section className="space-y-6" aria-live="polite">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="mb-3 text-xs font-black uppercase tracking-wider text-yellow-300">
                01 · Explora
              </p>
              <h4 className="mb-2 font-bold text-white">Prepara el contexto</h4>
              <p className="text-sm leading-relaxed text-gray-400">
                La experiencia web te ayuda a elegir el tipo de reto que quieres
                trabajar y llegar con un punto de partida más claro.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="mb-3 text-xs font-black uppercase tracking-wider text-yellow-300">
                02 · Decodifica
              </p>
              <h4 className="mb-2 font-bold text-white">Sesión en vivo · 90 min</h4>
              <p className="text-sm leading-relaxed text-gray-400">
                Exploramos tu situación, los patrones relevantes, las
                restricciones y el punto crítico que conviene atender.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="mb-3 text-xs font-black uppercase tracking-wider text-yellow-300">
                03 · Rediseña
              </p>
              <h4 className="mb-2 font-bold text-white">Define el siguiente paso</h4>
              <p className="text-sm leading-relaxed text-gray-400">
                Cerramos con una síntesis del reto y próximos pasos iniciales
                acordes con lo conversado.
              </p>
            </article>
          </div>

          <div className="mx-auto max-w-2xl rounded-3xl border border-yellow-400/25 bg-gradient-to-br from-yellow-400/[0.08] to-gray-900 p-7 text-center md:p-10">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-gray-400">
              Inversión de referencia · Sesión individual
            </p>
            <p className="mb-4 text-5xl font-black text-white md:text-6xl">
              $27 <span className="text-xl font-bold text-gray-400">USD</span>
            </p>
            <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-gray-400">
              La sesión está diseñada para trabajar sobre un caso concreto.
              El alcance final se ajusta al contexto que compartas; no se
              promete un resultado específico antes de conocerlo.
            </p>
            {PAYMENT_LINKS.discovery ? (
              <a
                href={PAYMENT_LINKS.discovery}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-xl bg-yellow-400 px-6 py-4 font-black text-black transition-colors hover:bg-yellow-300 sm:w-auto"
              >
                Continuar a pago seguro <span aria-hidden="true" className="ml-2">↗</span>
              </a>
            ) : (
              <a
                href={getCompanyContactUrl("services")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-xl bg-yellow-400 px-6 py-4 font-black text-black transition-colors hover:bg-yellow-300 sm:w-auto"
              >
                Consultar disponibilidad <span aria-hidden="true" className="ml-2">↗</span>
              </a>
            )}
            <p className="mt-4 text-xs leading-relaxed text-gray-500">
              La reserva y el horario se confirman mediante el flujo de compra
              y agenda configurado para el servicio.
            </p>
          </div>
        </section>
      ) : (
        <section className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-10" aria-live="polite">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
              Aplicación organizacional
            </p>
            <h3 className="mt-3 text-2xl font-black text-white md:text-3xl">
              Diseñar la siguiente jugada para tu organización
            </h3>
            <p className="mt-4 leading-relaxed text-gray-300">
              Para empresas, equipos y proyectos, el primer paso es comprender
              el contexto, los actores implicados y el resultado que se necesita.
              Conversamos sobre el alcance antes de proponer una intervención o
              presupuesto. No se aplica automáticamente el precio individual.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ["01 · Contexto", "Delimitar el reto y el resultado esperado."],
              ["02 · Sistema", "Identificar actores, restricciones e incentivos."],
              ["03 · Encaje", "Acordar el siguiente paso adecuado al alcance."],
            ].map(([title, description]) => (
              <article key={title} className="rounded-2xl border border-white/10 p-5">
                <h4 className="font-bold text-white">{title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{description}</p>
              </article>
            ))}
          </div>
          <a
            href={getCompanyContactUrl("services")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-xl bg-yellow-400 px-6 py-4 font-black text-black transition-colors hover:bg-yellow-300 sm:w-auto"
          >
            Conversar con Chalamandra <span aria-hidden="true" className="ml-2">↗</span>
          </a>
        </section>
      )}
    </div>
  );
};

export default DiscoverySessionPage;
