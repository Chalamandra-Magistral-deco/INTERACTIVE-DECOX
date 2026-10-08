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
    </div>
  </footer>
);

export default Footer;
