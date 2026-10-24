import React from "react";

const HowItWorks: React.FC = () => (
  <section id="metodologia" className="scroll-mt-24 bg-gray-950 px-6 py-16 md:py-20">
    <div className="mx-auto max-w-6xl">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-yellow-400">La metodología</p>
        <h2 className="text-3xl font-black text-white md:text-4xl">De la exploración a la acción</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
          Un recorrido claro: entiende tu punto de partida, practica una herramienta y decide cómo aplicarla.
        </p>
      </div>

      <img
        src="/images/el-algoritmo.svg"
        alt="El algoritmo de Chalamandra Magistral: de la visión a la ejecución"
        loading="lazy"
        className="mx-auto mb-14 w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl"
      />

      <div className="grid grid-cols-1 gap-5 text-left md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-black/50 p-7">
          <p className="mb-4 text-4xl font-black text-yellow-400">01</p>
          <h3 className="mb-3 text-xl font-black text-white">Diagnosticar</h3>
          <p className="leading-relaxed text-gray-400">
            Explora tu arquetipo cognitivo y establece un punto de partida para el trabajo personal.
          </p>
        </article>
        <article className="rounded-2xl border border-yellow-400/30 bg-yellow-400/[0.06] p-7">
          <p className="mb-4 text-4xl font-black text-yellow-300">02</p>
          <h3 className="mb-3 text-xl font-black text-white">Entrenar</h3>
          <p className="leading-relaxed text-gray-300">
            Practica Hacks Magistrales con ejercicios guiados y registra tu progreso dentro de la experiencia.
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-black/50 p-7">
          <p className="mb-4 text-4xl font-black text-yellow-400">03</p>
          <h3 className="mb-3 text-xl font-black text-white">Aplicar</h3>
          <p className="leading-relaxed text-gray-400">
            Convierte el aprendizaje en una siguiente acción y explora las herramientas disponibles para continuar.
          </p>
        </article>
      </div>
    </div>
  </section>
);

export default HowItWorks;
