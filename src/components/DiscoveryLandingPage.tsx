import React from "react";
import SEO from "@/components/SEO";
import DiscoverySessionPage from "@/components/DiscoverySessionPage";
import Footer from "@/components/Footer";
import { COMPANY_HOME_URL } from "@/config/corporateLinks";

const DiscoveryLandingPage: React.FC = () => (
  <div className="min-h-screen bg-black text-gray-200">
    <SEO
      title="Sesión de Descubrimiento | Interactive DecoX"
      description="Explora una decisión, idea o reto con la metodología de Chalamandra Magistral. Experiencia web y sesión en vivo para personas, empresas y proyectos."
      keywords="sesión de descubrimiento, Interactive DecoX, metodología estratégica, diagnóstico, Chalamandra Magistral"
      canonical="https://interactive.chalamandramagistral.com/sesion-descubrimiento"
    />

    <header className="border-b border-white/10 bg-black/90 px-6 py-5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <a href="/" className="text-sm font-black uppercase tracking-[0.16em] text-white">
          Interactive <span className="text-yellow-400">DecoX</span>
        </a>
        <a
          href={COMPANY_HOME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-gray-400 transition-colors hover:text-yellow-300"
        >
          Chalamandra Magistral ↗
        </a>
      </div>
    </header>

    <main>
      <section className="hero-gradient px-6 py-16 text-center md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-yellow-400">
            Chalamandra Magistral · Decodificar y ejecutar
          </p>
          <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
            No necesitas otra respuesta genérica.
            <span className="mt-2 block text-yellow-300">Necesitas entender mejor el sistema.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
            La Sesión de Descubrimiento combina una experiencia web guiada con
            una conversación en vivo para explorar tu reto, detectar lo
            relevante y decidir el siguiente movimiento.
          </p>
          <a
            href="#elige-ruta"
            className="mt-8 inline-flex rounded-xl bg-yellow-400 px-7 py-4 font-black text-black transition-colors hover:bg-yellow-300"
          >
            Elegir mi recorrido ↓
          </a>
        </div>
      </section>

      <section id="elige-ruta" className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <DiscoverySessionPage />
      </section>
    </main>

    <Footer />
  </div>
);

export default DiscoveryLandingPage;
