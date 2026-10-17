import React from "react";

const Footer: React.FC = () => (
  <footer className="border-t border-gray-800 bg-gray-900 py-10 text-center">
    <div className="mx-auto max-w-6xl px-6">
      <p className="mb-2 text-gray-400">
        &copy; {new Date().getFullYear()} Chalamandra Magistral. Todos los derechos reservados.
      </p>
      <p className="text-xs uppercase tracking-widest text-gray-600">
        Sistema Operativo del 1%
      </p>
      
      {/* PUENTE B2B HACIA EL HUB */}
      <div className="mt-8 pt-8 border-t border-gray-800">
        <p className="text-gray-500 text-sm mb-4">
          ¿Quieres implementar estas metodologías en tu empresa?
        </p>
        <a 
          href="https://www.chalamandramagistral.com/contact.html?interes=consultoria-b2b&utm_source=interactive&utm_medium=footer&utm_campaign=b2b_bridge" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition-all"
          onClick={() => {
            const w = window as any;
            w.dataLayer = w.dataLayer || [];
            w.dataLayer.push({ event: 'b2b_lead_click', destination: 'hub_contact' });
          }}
        >
          Hablar con un Consultor DecoX →
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
