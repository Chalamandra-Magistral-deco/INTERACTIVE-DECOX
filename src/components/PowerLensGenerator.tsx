import React, { useState } from "react";
import { motion } from "motion/react";

import { PODERES_SHEREZADE_DATA } from "@/utils/constants";
import { generarHook } from "@/services/geminiService";

const PowerLensGenerator: React.FC = () => {
  const [selectedPoder, setSelectedPoder] = useState(
    PODERES_SHEREZADE_DATA[0].title,
  );
  const [selectedDominio, setSelectedDominio] = useState("Negocios");
  const [generatedDirective, setGeneratedDirective] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (): Promise<void> => {
    if (isLoading) return;

    setIsLoading(true);
    setGeneratedDirective("");

    try {
      const directive = await generarHook(selectedPoder, selectedDominio);
      setGeneratedDirective(directive);
    } catch (error) {
      console.error(
        "Error generating power lens:",
        error instanceof Error ? error.message : "unknown",
      );
      setGeneratedDirective("Error al generar la directiva. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="power-lens-generator bg-black py-12 text-white">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-3xl font-black tracking-tighter md:text-4xl"
        >
          Generador de Lentes de Poder
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-8 max-w-2xl text-lg text-gray-400"
        >
          Combina un Poder de Sherezade con un Dominio de tu vida para generar
          una Directiva Estratégica y enfocar tu energía.
        </motion.p>

        <div className="mx-auto mb-8 grid max-w-xl grid-cols-1 items-center gap-6 md:grid-cols-2">
          <div className="w-full">
            <label
              htmlFor="poder-select"
              className="mb-2 block text-sm font-bold uppercase tracking-wider text-gray-400"
            >
              Poder
            </label>
            <select
              id="poder-select"
              value={selectedPoder}
              onChange={(event) => setSelectedPoder(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all duration-300 focus:ring-2 focus:ring-cyan-400"
            >
              {PODERES_SHEREZADE_DATA.map((poder) => (
                <option key={poder.id} value={poder.title}>
                  {poder.title}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label
              htmlFor="dominio-select"
              className="mb-2 block text-sm font-bold uppercase tracking-wider text-gray-400"
            >
              Dominio
            </label>
            <select
              id="dominio-select"
              value={selectedDominio}
              onChange={(event) => setSelectedDominio(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all duration-300 focus:ring-2 focus:ring-cyan-400"
            >
              <option>Negocios</option>
              <option>Relaciones</option>
              <option>Salud</option>
              <option>Finanzas</option>
              <option>Creatividad</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="rounded-xl bg-cyan-400 px-8 py-4 font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-cyan-300 disabled:opacity-50"
        >
          {isLoading ? "Generando..." : "Generar Directiva"}
        </button>

        {generatedDirective && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mt-12 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8 text-left"
          >
            <h3 className="mb-4 text-xl font-bold text-cyan-400">
              Lente de Poder:
            </h3>
            <p className="whitespace-pre-wrap text-lg text-gray-300">
              {generatedDirective}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PowerLensGenerator;
