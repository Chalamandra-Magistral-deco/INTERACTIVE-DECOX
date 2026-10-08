import React from "react";
import { PAYMENT_LINKS } from "@/config/public";

interface KitMagistralSectionProps {
  onShowDiscovery: () => void;
}

const KitMagistralSection: React.FC<KitMagistralSectionProps> = ({
  onShowDiscovery,
}) => {
  return (
    <div className="space-y-16 pb-12 text-white">
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-black tracking-tighter text-purple-400 md:text-6xl">
          KIT MAGISTRAL
        </h2>
        <p className="mx-auto max-w-2xl text-xl font-bold text-gray-300 md:text-2xl">
          30 días de inmersión para instalar tu nuevo{" "}
          <span className="text-purple-300">Sistema Operativo Cognitivo</span>.
        </p>
      </div>

      <div className="rounded-3xl border border-purple-500/30 bg-purple-900/20 p-8">
        <p className="text-center text-lg leading-relaxed text-gray-200 md:text-xl italic">
          Saber qué hacer es solo el 10% del éxito. El resto es instalar ese
          conocimiento en tu comportamiento diario. El Kit Magistral es el
          proceso de instalación.
        </p>
      </div>

      <div className="space-y-8">
        <h3 className="text-center text-2xl font-black uppercase tracking-widest text-white">
          EL MAPA DE IMPLEMENTACIÓN
        </h3>

        <div className="space-y-4">
          {[
            {
              week: "01",
              title: "CALIBRACIÓN",
              desc: "Alineamos objetivos con tu arquetipo y seleccionamos los 4 hacks críticos.",
            },
            {
              week: "02",
              title: "INSTALACIÓN",
              desc: "Ejecutamos los primeros 2 hacks y monitorizamos la resistencia al cambio.",
            },
            {
              week: "03",
              title: "OPTIMIZACIÓN",
              desc: "Ajustamos la ejecución e instalamos los 2 hacks restantes.",
            },
            {
              week: "04",
              title: "SOBERANÍA",
              desc: "Consolidamos el sistema y creas tu ritual de mantenimiento SRAP.",
            },
          ].map((step) => (
            <div
              key={step.week}
              className="flex items-center space-x-6 rounded-2xl border border-gray-700 bg-gray-800/50 p-6 transition-all hover:border-purple-500/50"
            >
              <span className="text-4xl font-black text-purple-500/30">
                {step.week}
              </span>
              <div>
                <h4 className="text-lg font-black text-white">{step.title}</h4>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6 rounded-3xl border border-white/5 bg-black/30 p-8">
          <h4 className="flex items-center text-xl font-black text-white">
            <i className="fa-solid fa-microchip mr-3 text-purple-400" />
            TECNOLOGÍA INCLUIDA
          </h4>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start">
              <i className="fa-solid fa-check mr-3 mt-1 text-purple-500" />
              4 Sesiones 1-a-1 de 60 min.
            </li>
            <li className="flex items-start">
              <i className="fa-solid fa-check mr-3 mt-1 text-purple-500" />
              Guía de Implementación SRAP Personalizada.
            </li>
            <li className="flex items-start">
              <i className="fa-solid fa-check mr-3 mt-1 text-purple-500" />
              Acceso a la Biblioteca de Hacks Premium.
            </li>
          </ul>
        </div>

        <div className="space-y-6 rounded-3xl border border-white/5 bg-black/30 p-8">
          <h4 className="flex items-center text-xl font-black text-white">
            <i className="fa-solid fa-headset mr-3 text-purple-400" />
            SOPORTE TÁCTICO
          </h4>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start">
              <i className="fa-solid fa-check mr-3 mt-1 text-purple-500" />
              Acceso Directo a WhatsApp (L-V).
            </li>
            <li className="flex items-start">
              <i className="fa-solid fa-check mr-3 mt-1 text-purple-500" />
              Feedback en menos de 12h.
            </li>
            <li className="flex items-start">
              <i className="fa-solid fa-check mr-3 mt-1 text-purple-500" />
              Sesión de Cierre y Próximos Pasos.
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-800 bg-gray-900 p-8 text-center">
        <p className="mb-6 text-gray-400">
          Para garantizar que el Kit Magistral es lo que necesitas, requerimos
          una Sesión de Descubrimiento previa.
        </p>
        <button
          type="button"
          onClick={onShowDiscovery}
          className="rounded-xl border border-white/10 bg-white/5 px-8 py-3 font-bold text-white transition-all hover:bg-white/10"
        >
          AGENDAR DESCUBRIMIENTO PRIMERO
        </button>
      </div>

      <div className="space-y-6 text-center">
        <p className="text-sm uppercase tracking-widest text-gray-500">
          Inversión en tu Maestría
        </p>
        <p className="text-6xl font-black text-white">
          $397 <span className="text-xl text-gray-400">USD</span>
        </p>

        {PAYMENT_LINKS.magistral ? (
          <a
            href={PAYMENT_LINKS.magistral}
            target="_blank"
            rel="noopener noreferrer"
            className="pulse-glow inline-block rounded-2xl bg-purple-600 px-12 py-5 text-xl font-black text-white shadow-[0_0_50px_rgba(147,51,234,0.3)] transition-all hover:scale-105"
          >
            ADQUIRIR KIT MAGISTRAL
          </a>
        ) : (
          <span className="inline-block cursor-not-allowed rounded-2xl bg-purple-600 px-12 py-5 text-xl font-black text-white opacity-40">
            CHECKOUT PENDIENTE DE CONFIGURACIÓN
          </span>
        )}

        <p className="text-xs text-gray-500">
          Configura el Payment Link del producto antes de publicar el checkout.
        </p>
      </div>
    </div>
  );
};

export default KitMagistralSection;
