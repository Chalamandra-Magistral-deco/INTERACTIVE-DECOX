import React from "react";
import { COMPANY_HOME_URL, getCompanyContactUrl } from "@/config/corporateLinks";

interface HeaderProps {
  completedCount: number;
  totalCount: number;
}

const Header: React.FC<HeaderProps> = ({ completedCount, totalCount }) => {
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header id="inicio" className="hero-gradient relative overflow-hidden px-6 py-16 text-center md:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="mb-5 inline-flex items-center rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
          Interactive DecoX · Chalamandra Magistral
        </p>
        <h1 className="premium-glow mx-auto mb-6 max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">
          Convierte conocimiento en{" "}
          <span className="text-yellow-300">acción estratégica.</span>
        </h1>
        <p className="mx-auto mb-9 max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
          Explora tu arquetipo cognitivo, practica Hacks Magistrales y transforma
          lo aprendido en decisiones y próximos pasos concretos.
        </p>

        <div className="mb-12 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href="#diagnostico"
            className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-7 py-4 text-sm font-black text-black shadow-lg shadow-yellow-500/20 transition-colors hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 focus:ring-offset-black"
          >
            Iniciar diagnóstico
            <span aria-hidden="true" className="ml-2">→</span>
          </a>
          <a
            href={getCompanyContactUrl("hero")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-black"
          >
            Soluciones para empresas
          </a>
          <a
            href={COMPANY_HOME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 text-sm font-semibold text-gray-300 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
          >
            Conocer la empresa
          </a>
        </div>

        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-black/30 p-5 text-left">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
              Tu progreso en Hacks Magistrales
            </span>
            <span className="shrink-0 text-sm font-black text-white">
              {progressPercent}%
            </span>
          </div>
          <div
            className="h-2.5 overflow-hidden rounded-full bg-gray-800"
            role="progressbar"
            aria-label="Progreso de Hacks Magistrales"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700 ease-out"
              style={{ width: progressPercent + "%" }}
            />
          </div>
          <p className="mt-3 text-sm text-gray-400">
            {completedCount} de {totalCount} protocolos completados.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
