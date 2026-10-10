import React from "react";
import { motion } from "motion/react";

import {
  Hack,
  ModalData,
  ModalState,
  PostPaymentData,
} from "@/utils/types";
import PostPaymentPage from "./PostPaymentPage";
import DiscoverySessionPage from "./DiscoverySessionPage";
import HackEducationalModule from "./HackEducationalModule";
import HackPracticeModule from "./HackPracticeModule";

interface ModalManagerProps {
  modalState: ModalState;
  hideModal: () => void;
  showModal: (type: ModalState["type"], data?: ModalData) => void;
  markHackCompleted: (id: number) => void;
}

const ModalManager: React.FC<ModalManagerProps> = ({
  modalState,
  hideModal,
  showModal,
  markHackCompleted,
}) => {
  if (!modalState.isOpen) return null;

  const hack = modalState.data as Hack | null;
  const postPayment = modalState.data as PostPaymentData | null;

  let title = "";
  let subtitle = "";
  let modalBody: React.ReactNode = null;

  switch (modalState.type) {
    case "discovery":
      title = "Sesión Descubrimiento";
      subtitle = "Tu primer paso hacia la decodificación.";
      modalBody = <DiscoverySessionPage />;
      break;

    case "hack":
      if (!hack) break;
      title = hack.title;
      subtitle = hack.subtitle;
      modalBody = (
        <HackEducationalModule
          hack={hack}
          onStartPractice={() => showModal("activation", hack)}
        />
      );
      break;

    case "activation":
      if (!hack) break;
      title = `Activar: ${hack.title}`;
      subtitle = "Ejecuta el protocolo para dominar este hack.";
      modalBody = (
        <HackPracticeModule
          hack={hack}
          onComplete={() => {
            markHackCompleted(hack.id);
            hideModal();
          }}
        />
      );
      break;

    case "srap":
      title = "Ritual SRAP™";
      subtitle = "Sincroniza Ritmos en Acción Presente";
      modalBody = (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            {["Sincronizar", "Reconocer", "Activar", "Pausa"].map((word) => (
              <div
                key={word}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
              >
                <span className="mb-2 block text-3xl font-black text-cyan-400">
                  {word[0]}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  {word}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-lg italic leading-relaxed text-gray-300">
            "Detente. Respira. Reconoce el patrón. Actúa con precisión. Sincroniza tu realidad."
          </p>
        </div>
      );
      break;

    case "postPayment":
      if (!postPayment) break;
      title = "Transmisión Exitosa";
      subtitle = "El pago ha sido verificado por Stripe.";
      modalBody = (
        <PostPaymentPage
          serviceName={postPayment.serviceName}
          archetype={postPayment.archetype}
        />
      );
      break;
  }

  if (!modalBody) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
      onClick={hideModal}
      role="presentation"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 16 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-3xl overflow-hidden rounded-[3rem] border border-white/10 bg-[#0a0a0a] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-start justify-between border-b border-white/5 p-8 md:p-12">
          <div>
            <h3 className="text-3xl font-black tracking-tighter text-white md:text-4xl">
              {title}
            </h3>
            <p className="mt-2 font-medium text-gray-500">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={hideModal}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-2xl text-gray-500 transition-colors hover:text-white"
            aria-label="Cerrar"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-8 md:p-12">
          {modalBody}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModalManager;
