import React from "react";

const Introduction: React.FC = () => (
  <section id="propuesta" className="bg-black px-6 py-16 text-center md:py-20">
    <div className="mx-auto max-w-4xl">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-yellow-400">
        El enfoque
      </p>
      <h2 className="mb-6 text-3xl font-black leading-tight text-white md:text-4xl">
        Una experiencia práctica para pensar, decidir y actuar.
      </h2>
      <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
        Interactive DecoX es la experiencia digital de Chalamandra Magistral:
        combina diagnóstico cognitivo, ejercicios guiados y herramientas de
        reflexión para ayudarte a convertir ideas en acciones deliberadas.
      </p>
      <div className="mt-9 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="mb-2 text-sm font-black uppercase tracking-wider text-yellow-300">01 · Explora</p>
          <p className="text-sm leading-relaxed text-gray-400">Identifica un punto de partida con tu diagnóstico.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="mb-2 text-sm font-black uppercase tracking-wider text-yellow-300">02 · Practica</p>
          <p className="text-sm leading-relaxed text-gray-400">Entrena protocolos mediante ejercicios concretos.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="mb-2 text-sm font-black uppercase tracking-wider text-yellow-300">03 · Aplica</p>
          <p className="text-sm leading-relaxed text-gray-400">Define el siguiente paso y registra tu avance.</p>
        </div>
      </div>
    </div>
  </section>
);
export default Introduction;
